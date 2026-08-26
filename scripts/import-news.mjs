#!/usr/bin/env node

/**
 * Imports the public WordPress news archive into a deterministic TypeScript
 * data module and (optionally) Supabase.
 *
 * Usage:
 *   node scripts/import-news.mjs
 *   node scripts/import-news.mjs --dry-run
 *   node scripts/import-news.mjs --database
 *   node scripts/import-news.mjs --dry-run --database
 *
 * `--dry-run` performs the remote reads, transformations, downloads in memory,
 * and validations, but writes neither files nor database rows.
 * `--database` upserts the generated rows through SUPABASE_DB_URL. It never
 * deletes rows. SUPABASE_DB_URL may be set in the process or in .env.local.
 */

import { createHash } from 'node:crypto';
import {
  access,
  mkdir,
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { request as httpRequest } from 'node:http';
import { Agent as HttpsAgent, request as httpsRequest } from 'node:https';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(SCRIPT_PATH);
const ROOT_DIR = resolve(SCRIPT_DIR, '..');
const NEWS_DATA_PATH = join(ROOT_DIR, 'src', 'data', 'news.ts');
const GENERATED_PATH = join(ROOT_DIR, 'src', 'data', 'newsArchive.generated.ts');
const PUBLIC_DIR = join(ROOT_DIR, 'public');
const ASSET_DIR = join(PUBLIC_DIR, 'news', 'archive');
const PLACEHOLDER_PUBLIC_PATH = '/news/news-placeholder.svg';
const PLACEHOLDER_FILE_PATH = join(PUBLIC_DIR, 'news', 'news-placeholder.svg');

const SOURCE_ORIGIN = 'https://veysvakfi.org';
const API_ENDPOINT = new URL('/wp-json/wp/v2/posts', SOURCE_ORIGIN);
const MEDIA_ENDPOINT = new URL('/wp-json/wp/v2/media/', SOURCE_ORIGIN);
const CATEGORY_ID = 16;
const PAGE_SIZE = 100;
const MAX_IMAGE_DIMENSION = 1024;
const MAX_FALLBACK_IMAGE_DIMENSION = 2048;
const MAX_API_BYTES = 24 * 1024 * 1024;
const MAX_IMAGE_BYTES = 32 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 35_000;
const REQUEST_ATTEMPTS = 3;
const USER_AGENT = 'Veysel-Karani-Vakfi-news-importer/1.0';

const VEYS_HOSTS = new Set(['veysvakfi.org', 'www.veysvakfi.org']);
const LEGACY_VEYS_HOSTS = new Set(['vesvakfi.net', 'www.vesvakfi.net']);
const YOUTUBE_ID_PATTERN =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([A-Za-z0-9_-]{11})/i;

// The legacy host has an incomplete TLS chain on some environments. This
// exception is deliberately scoped to requests whose hostname is exactly one
// of the legacy hosts. Other HTTPS requests retain Node's normal verification.
const legacyHttpsAgent = new HttpsAgent({
  keepAlive: true,
  rejectUnauthorized: false,
});

class HttpStatusError extends Error {
  constructor(url, response, detail = '') {
    const preview = response.body.toString('utf8', 0, 500).replace(/\s+/g, ' ').trim();
    super(
      `HTTP ${response.statusCode} for ${url.href}${detail ? `: ${detail}` : preview ? `: ${preview}` : ''}`,
    );
    this.name = 'HttpStatusError';
    this.statusCode = response.statusCode;
    this.responseBody = response.body;
  }
}

const flags = new Set(process.argv.slice(2));
const allowedFlags = new Set(['--dry-run', '--database', '--help']);
const unknownFlags = [...flags].filter((flag) => !allowedFlags.has(flag));

if (unknownFlags.length > 0) {
  console.error(`Unknown option(s): ${unknownFlags.join(', ')}`);
  printUsage();
  process.exitCode = 1;
} else if (flags.has('--help')) {
  printUsage();
} else {
  await main({
    dryRun: flags.has('--dry-run'),
    database: flags.has('--database'),
  }).catch((error) => {
    console.error(`\nImport failed: ${formatError(error)}`);
    process.exitCode = 1;
  });
}

function printUsage() {
  console.log(`Usage: node scripts/import-news.mjs [--dry-run] [--database]

  --dry-run   Validate the full import without writing files or database rows
  --database  Upsert generated articles through SUPABASE_DB_URL (never delete)`);
}

async function main(options) {
  const context = createContext(options);

  console.log(`Reading published WordPress posts in category ${CATEGORY_ID} …`);
  const currentIds = await readCuratedNewsIds();
  const remote = await fetchAllPosts();
  const remotePosts = validateRemotePosts(remote);
  const archivePosts = remotePosts.filter((post) => !currentIds.has(String(post.id)));

  context.counts.remote = remotePosts.length;
  context.counts.curatedIds = currentIds.size;
  context.counts.excluded = remotePosts.length - archivePosts.length;

  console.log(
    `Found ${remotePosts.length} published posts; excluding ${context.counts.excluded} currently curated ID(s).`,
  );

  const articles = [];
  for (const [index, post] of archivePosts.entries()) {
    process.stdout.write(
      `\rTransforming ${String(index + 1).padStart(String(archivePosts.length).length, ' ')}/${archivePosts.length}`,
    );
    articles.push(await transformPost(post, context));
  }
  if (archivePosts.length > 0) process.stdout.write('\n');

  articles.sort(compareArticles);
  validateImport({
    articles,
    archivePosts,
    currentIds,
    remotePosts,
    expectedRemoteTotal: remote.expectedTotal,
    context,
  });

  if (usesPlaceholder(articles)) {
    await verifyPlaceholder(options.dryRun);
  }

  if (!options.dryRun) {
    await persistAssets(context);
    await verifyPersistedAssets(context);
    await writeGeneratedModule(articles);
  }

  if (options.database) {
    if (options.dryRun) {
      console.log(`Dry run: would upsert ${articles.length} row(s) into public.news.`);
    } else {
      await upsertDatabase(articles);
    }
  }

  printSummary(articles, context);
}

function createContext(options) {
  return {
    options,
    assetFetches: new Map(),
    assetsByHash: new Map(),
    assetsByPublicPath: new Map(),
    mediaFetches: new Map(),
    warnings: [],
    counts: {
      remote: 0,
      curatedIds: 0,
      excluded: 0,
      imageSpecs: 0,
      resolvedImageRefs: 0,
      failedImageRefs: 0,
      networkImageDownloads: 0,
      reusedAssetFiles: 0,
      writtenAssetFiles: 0,
    },
  };
}

function warn(context, message) {
  context.warnings.push(message);
  console.warn(`\nWarning: ${message}`);
}

async function readCuratedNewsIds() {
  const source = await readFile(NEWS_DATA_PATH, 'utf8');
  const start = source.indexOf('const curatedNewsArticles = [');
  const end = source.indexOf('] as const satisfies readonly NewsArticle[]', start);

  if (start < 0 || end < 0) {
    throw new Error(
      `Could not locate the newsArticles array in ${displayPath(NEWS_DATA_PATH)}; refusing to risk duplicate imports.`,
    );
  }

  const arraySource = source.slice(start, end);
  const ids = new Set();
  for (const match of arraySource.matchAll(/["']id["']\s*:\s*["'](\d+)["']/g)) {
    ids.add(match[1]);
  }
  return ids;
}

async function fetchAllPosts() {
  const first = await fetchPostPage(1);
  const posts = [...first.posts];
  const expectedTotal = readPositiveIntegerHeader(first.headers, 'x-wp-total', true);
  const headerPages = readPositiveIntegerHeader(first.headers, 'x-wp-totalpages', true);

  if (headerPages !== null) {
    for (let page = 2; page <= headerPages; page += 1) {
      const result = await fetchPostPage(page);
      posts.push(...result.posts);
    }
  } else {
    let page = 2;
    let previousSize = first.posts.length;
    while (previousSize === PAGE_SIZE) {
      try {
        const result = await fetchPostPage(page);
        if (result.posts.length === 0) break;
        posts.push(...result.posts);
        previousSize = result.posts.length;
        page += 1;
      } catch (error) {
        if (isInvalidWordPressPage(error)) break;
        throw error;
      }
    }
  }

  return { posts, expectedTotal };
}

async function fetchPostPage(page) {
  const url = new URL(API_ENDPOINT);
  url.searchParams.set('categories', String(CATEGORY_ID));
  url.searchParams.set('status', 'publish');
  url.searchParams.set('context', 'view');
  url.searchParams.set('per_page', String(PAGE_SIZE));
  url.searchParams.set('page', String(page));
  url.searchParams.set('orderby', 'date');
  url.searchParams.set('order', 'desc');
  url.searchParams.set('_embed', '1');

  const response = await requestJson(url, { maxBytes: MAX_API_BYTES });
  if (!Array.isArray(response.value)) {
    throw new Error(`WordPress page ${page} did not return an array.`);
  }
  return { posts: response.value, headers: response.headers };
}

function validateRemotePosts(remote) {
  const ids = new Set();
  const duplicateIds = new Set();

  for (const post of remote.posts) {
    const id = String(post?.id ?? '');
    if (!/^\d+$/.test(id)) throw new Error('WordPress returned a post without a numeric ID.');
    if (ids.has(id)) duplicateIds.add(id);
    ids.add(id);
    if (post.status !== 'publish') {
      throw new Error(`WordPress post ${id} is not public (status: ${post.status ?? 'missing'}).`);
    }
  }

  if (duplicateIds.size > 0) {
    throw new Error(`WordPress returned duplicate post ID(s): ${[...duplicateIds].join(', ')}`);
  }

  if (remote.expectedTotal !== null && remote.posts.length !== remote.expectedTotal) {
    throw new Error(
      `WordPress reported ${remote.expectedTotal} posts but ${remote.posts.length} were fetched across all pages.`,
    );
  }

  return remote.posts;
}

async function transformPost(post, context) {
  const id = String(post.id);
  const title = cleanInlineText(post.title?.rendered) || `خبر ${id}`;
  let paragraphs = cleanHtmlToParagraphs(post.content?.rendered);
  if (paragraphs.length === 0) paragraphs = cleanHtmlToParagraphs(post.excerpt?.rendered);
  if (paragraphs.length === 0) paragraphs = [title];

  const excerptText = cleanHtmlToParagraphs(post.excerpt?.rendered).join(' ');
  const excerpt = truncateAtWord(excerptText || paragraphs[0] || title, 360);
  const publishedAt = normalizePublishedDate(post);
  const sourceSlug = String(post.slug || slugFromPostLink(post.link) || id);
  const slugPart = slugify(sourceSlug) || 'news';
  const slug = `archive-${id}-${slugPart}`;
  const sourceUrl = normalizeArticleUrl(post.link, sourceSlug);
  const categoryArabic = categoryName(post) || 'الأخبار';

  const imageSpecs = await collectPostImageSpecs(post, context);
  context.counts.imageSpecs += imageSpecs.length;

  const resolvedImages = [];
  for (const spec of imageSpecs) {
    const resolvedImage = await resolveImageSpec(spec, context);
    if (resolvedImage) resolvedImages.push(resolvedImage);
    else context.counts.failedImageRefs += 1;
  }

  const uniqueImages = dedupeBy(resolvedImages, (image) => image.asset.hash);
  context.counts.resolvedImageRefs += uniqueImages.length;
  const primary = uniqueImages[0] ?? null;
  const galleryImages = uniqueImages.slice(1);

  const gallery = galleryImages.map((image, index) => {
    const ordinal = index + 1;
    const fallbackAlt = `${title} - صورة ${ordinal}`;
    const imageAlt = cleanInlineText(image.alt) || fallbackAlt;
    return {
      id: `${slug}-${ordinal}`,
      image: image.asset.publicPath,
      thumbnail: image.asset.publicPath,
      sourceUrl: image.sourceUrl,
      title: { ar: fallbackAlt },
      imageAlt: { ar: imageAlt },
      width: image.width,
      height: image.height,
    };
  });

  return {
    id,
    slug,
    sourceSlug,
    sourceUrl,
    publishedAt,
    year: new Date(publishedAt).getUTCFullYear(),
    sourceLanguage: 'ar',
    category: {
      ar: categoryArabic,
      en: 'News',
      tr: 'Haberler',
    },
    title: { ar: title },
    excerpt: { ar: excerpt },
    content: { ar: paragraphs },
    image: primary?.asset.publicPath ?? PLACEHOLDER_PUBLIC_PATH,
    imageAlt: { ar: cleanInlineText(primary?.alt) || title },
    gallery,
    sourceImages: uniqueImages.map((image) => image.asset.publicPath),
  };
}

async function collectPostImageSpecs(post, context) {
  const specs = [];
  const embeddedMedia = post?._embedded?.['wp:featuredmedia']?.[0] ?? null;
  let featuredMedia = embeddedMedia;

  if (!featuredMedia && Number(post.featured_media) > 0) {
    featuredMedia = await fetchMediaSafely(Number(post.featured_media), context);
  }

  if (featuredMedia) {
    const candidates = candidatesFromMedia(featuredMedia);
    if (candidates.length > 0) {
      specs.push({
        kind: 'featured',
        alt: featuredMedia.alt_text || cleanInlineText(featuredMedia.caption?.rendered),
        candidates,
      });
    }
  }

  const tags = extractImageTags(post.content?.rendered || '');
  for (const tag of tags) {
    const candidates = [...tag.candidates];
    let alt = tag.alt;
    if (tag.attachmentId) {
      const media = await fetchMediaSafely(tag.attachmentId, context);
      if (media) {
        candidates.unshift(...candidatesFromMedia(media));
        alt ||= media.alt_text || cleanInlineText(media.caption?.rendered);
      }
    }
    const uniqueCandidates = mergeCandidates(candidates);
    if (uniqueCandidates.length > 0) {
      specs.push({ kind: 'content', alt, candidates: uniqueCandidates });
    }
  }

  return specs;
}

async function fetchMediaSafely(id, context) {
  if (!context.mediaFetches.has(id)) {
    context.mediaFetches.set(
      id,
      (async () => {
        const url = new URL(String(id), MEDIA_ENDPOINT);
        url.searchParams.set('context', 'view');
        try {
          return (await requestJson(url, { maxBytes: MAX_API_BYTES })).value;
        } catch (error) {
          warn(context, `could not read WordPress media ${id}: ${formatError(error)}`);
          return null;
        }
      })(),
    );
  }
  return context.mediaFetches.get(id);
}

function candidatesFromMedia(media) {
  const details = media?.media_details ?? {};
  const candidates = [];
  const originalUrl = resolveRemoteImageUrl(media?.source_url || media?.guid?.rendered);

  if (originalUrl) {
    candidates.push({
      url: originalUrl,
      width: positiveNumber(details.width),
      height: positiveNumber(details.height),
      isOriginal: true,
    });
  }

  for (const size of Object.values(details.sizes ?? {})) {
    const sizeUrl = resolveRemoteImageUrl(
      size?.source_url || (originalUrl && size?.file ? new URL(size.file, originalUrl).href : ''),
    );
    if (!sizeUrl) continue;
    candidates.push({
      url: sizeUrl,
      width: positiveNumber(size.width),
      height: positiveNumber(size.height),
    });
  }

  return mergeCandidates(candidates);
}

function extractImageTags(html) {
  const tags = [];
  for (const match of String(html).matchAll(/<img\b[^>]*>/gi)) {
    const attributes = parseHtmlAttributes(match[0]);
    const width = positiveNumber(attributes.width || attributes['data-width']);
    const height = positiveNumber(attributes.height || attributes['data-height']);
    const candidates = [];

    for (const name of [
      'data-large-file',
      'data-full-url',
      'data-orig-file',
      'data-lazy-src',
      'data-src',
      'src',
    ]) {
      const url = resolveRemoteImageUrl(attributes[name]);
      if (!url) continue;
      const inferred = inferDimensionsFromUrl(url);
      candidates.push({
        url,
        width: inferred.width || width,
        height: inferred.height || height,
        isOriginal: name === 'data-full-url' || name === 'data-orig-file',
      });
    }

    for (const candidate of parseSrcset(attributes.srcset || attributes['data-srcset'])) {
      candidates.push(candidate);
    }

    const className = attributes.class || '';
    const idMatch = className.match(/(?:wp-image-|attachment[_-])(\d+)/i);
    const dataId = String(attributes['data-attachment-id'] || attributes['data-id'] || '');
    const attachmentId = positiveNumber(idMatch?.[1] || (/^\d+$/.test(dataId) ? dataId : 0));

    tags.push({
      alt: cleanInlineText(attributes.alt || attributes.title),
      attachmentId,
      candidates: mergeCandidates(candidates),
    });
  }
  return tags;
}

function parseHtmlAttributes(tag) {
  const attributes = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of String(tag).matchAll(pattern)) {
    const name = match[1].toLowerCase();
    if (name === 'img') continue;
    attributes[name] = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

function parseSrcset(value) {
  if (!value) return [];
  const candidates = [];
  for (const part of String(value).split(',')) {
    const tokens = part.trim().split(/\s+/);
    const url = resolveRemoteImageUrl(tokens[0]);
    if (!url) continue;
    const descriptor = tokens[1] || '';
    const widthMatch = descriptor.match(/^(\d+(?:\.\d+)?)w$/i);
    const inferred = inferDimensionsFromUrl(url);
    candidates.push({
      url,
      width: positiveNumber(widthMatch?.[1]) || inferred.width,
      height: inferred.height,
    });
  }
  return candidates;
}

function inferDimensionsFromUrl(url) {
  const pathname = safeUrl(url)?.pathname || '';
  const match = pathname.match(/-(\d{2,5})x(\d{2,5})(?=\.[^.\/]+$)/i);
  return {
    width: positiveNumber(match?.[1]),
    height: positiveNumber(match?.[2]),
  };
}

function mergeCandidates(candidates) {
  const byUrl = new Map();
  for (const candidate of candidates) {
    const url = resolveRemoteImageUrl(candidate?.url);
    if (!url) continue;
    const normalized = {
      url,
      width: positiveNumber(candidate.width),
      height: positiveNumber(candidate.height),
      isOriginal: Boolean(candidate.isOriginal),
    };
    const current = byUrl.get(url);
    if (!current || imageArea(normalized) > imageArea(current)) {
      byUrl.set(url, { ...normalized, isOriginal: normalized.isOriginal || current?.isOriginal || false });
    } else if (normalized.isOriginal && !current.isOriginal) {
      byUrl.set(url, { ...current, isOriginal: true });
    }
  }
  return [...byUrl.values()];
}

function orderCandidates(candidates) {
  const knownWithinLimit = [];
  const knownFallbacks = [];
  const unknown = [];

  for (const candidate of mergeCandidates(candidates)) {
    const maximum = Math.max(candidate.width, candidate.height);
    if (maximum === 0) unknown.push(candidate);
    else if (maximum <= MAX_IMAGE_DIMENSION) knownWithinLimit.push(candidate);
    else if (maximum <= MAX_FALLBACK_IMAGE_DIMENSION) knownFallbacks.push(candidate);
  }

  knownWithinLimit.sort((a, b) => imageArea(b) - imageArea(a) || a.url.localeCompare(b.url));
  knownFallbacks.sort((a, b) => imageArea(a) - imageArea(b) || a.url.localeCompare(b.url));
  unknown.sort((a, b) => a.url.localeCompare(b.url));

  // Try the best optimized derivative first. If legacy WordPress metadata points
  // at deleted virtual derivatives, immediately fall back to the real original
  // instead of issuing requests for every missing thumbnail size.
  return dedupeBy(
    [
      ...knownWithinLimit.slice(0, 1),
      ...[...knownWithinLimit, ...knownFallbacks, ...unknown].filter((candidate) => candidate.isOriginal),
      ...knownWithinLimit.slice(1),
      ...unknown,
      ...knownFallbacks,
    ],
    (candidate) => candidate.url,
  );
}

async function resolveImageSpec(spec, context) {
  for (const candidate of orderCandidates(spec.candidates)) {
    try {
      const fetched = await fetchImageAsset(candidate.url, context);
      const width = fetched.width || candidate.width;
      const height = fetched.height || candidate.height;

      if (!width || !height) {
        warn(context, `skipping image with unknown dimensions: ${candidate.url}`);
        continue;
      }
      if (Math.max(width, height) > MAX_FALLBACK_IMAGE_DIMENSION) continue;
      if (width <= 8 || height <= 8) continue;

      const asset = registerAsset(fetched, context);
      return {
        alt: spec.alt,
        kind: spec.kind,
        sourceUrl: fetched.finalUrl,
        width,
        height,
        asset,
      };
    } catch (error) {
      warn(context, `could not import image ${candidate.url}: ${formatError(error)}`);
    }
  }
  return null;
}

async function fetchImageAsset(url, context) {
  if (!context.assetFetches.has(url)) {
    context.assetFetches.set(
      url,
      (async () => {
        context.counts.networkImageDownloads += 1;
        const response = await requestUrl(url, {
          accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif,*/*;q=0.2',
          maxBytes: MAX_IMAGE_BYTES,
        });
        const imageInfo = inspectImage(response.body, response.headers['content-type']);
        if (!imageInfo) {
          throw new Error(`response is not a supported raster image (${response.headers['content-type'] || 'unknown type'})`);
        }
        return {
          ...imageInfo,
          body: response.body,
          finalUrl: response.url.href,
          hash: sha256(response.body),
        };
      })(),
    );
  }
  return context.assetFetches.get(url);
}

function registerAsset(fetched, context) {
  let asset = context.assetsByHash.get(fetched.hash);
  if (asset) return asset;

  const filename = `sha256-${fetched.hash.slice(0, 32)}${fetched.extension}`;
  const publicPath = `/news/archive/${filename}`;
  const filePath = join(ASSET_DIR, filename);
  const collision = context.assetsByPublicPath.get(publicPath);
  if (collision && collision.hash !== fetched.hash) {
    throw new Error(`Asset filename collision at ${publicPath}.`);
  }

  asset = {
    body: fetched.body,
    extension: fetched.extension,
    filePath,
    hash: fetched.hash,
    mime: fetched.mime,
    publicPath,
  };
  context.assetsByHash.set(fetched.hash, asset);
  context.assetsByPublicPath.set(publicPath, asset);
  return asset;
}

function inspectImage(buffer, contentTypeHeader) {
  const declared = String(contentTypeHeader || '').split(';', 1)[0].trim().toLowerCase();
  let mime = '';
  let extension = '';
  let dimensions = { width: 0, height: 0 };

  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
    mime = 'image/png';
    extension = '.png';
    dimensions = { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  } else if (buffer.length >= 10 && /^(GIF87a|GIF89a)$/.test(buffer.subarray(0, 6).toString('ascii'))) {
    mime = 'image/gif';
    extension = '.gif';
    dimensions = { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  } else if (buffer.length >= 12 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    mime = 'image/jpeg';
    extension = '.jpg';
    dimensions = jpegDimensions(buffer);
  } else if (
    buffer.length >= 30 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    mime = 'image/webp';
    extension = '.webp';
    dimensions = webpDimensions(buffer);
  } else if (looksLikeAvif(buffer)) {
    mime = 'image/avif';
    extension = '.avif';
    dimensions = avifDimensions(buffer);
  } else {
    return null;
  }

  if (declared.startsWith('image/') && declared !== mime) {
    // File signatures are authoritative. CDNs occasionally return a stale or
    // generic image Content-Type after converting formats.
  }

  return { mime, extension, ...dimensions };
}

function jpegDimensions(buffer) {
  const startOfFrame = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (marker === 0xda) break;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    if (startOfFrame.has(marker) && length >= 7) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      };
    }
    offset += length;
  }
  return { width: 0, height: 0 };
}

function webpDimensions(buffer) {
  const kind = buffer.subarray(12, 16).toString('ascii');
  if (kind === 'VP8X' && buffer.length >= 30) {
    return {
      width: 1 + readUInt24LE(buffer, 24),
      height: 1 + readUInt24LE(buffer, 27),
    };
  }
  if (kind === 'VP8L' && buffer.length >= 25 && buffer[20] === 0x2f) {
    return {
      width: 1 + (buffer[21] | ((buffer[22] & 0x3f) << 8)),
      height: 1 + (((buffer[22] & 0xc0) >> 6) | (buffer[23] << 2) | ((buffer[24] & 0x0f) << 10)),
    };
  }
  if (kind === 'VP8 ' && buffer.length >= 30) {
    for (let offset = 20; offset + 9 < Math.min(buffer.length, 40); offset += 1) {
      if (buffer[offset] === 0x9d && buffer[offset + 1] === 0x01 && buffer[offset + 2] === 0x2a) {
        return {
          width: buffer.readUInt16LE(offset + 3) & 0x3fff,
          height: buffer.readUInt16LE(offset + 5) & 0x3fff,
        };
      }
    }
  }
  return { width: 0, height: 0 };
}

function looksLikeAvif(buffer) {
  if (buffer.length < 16 || buffer.subarray(4, 8).toString('ascii') !== 'ftyp') return false;
  const brands = buffer.subarray(8, Math.min(buffer.length, 64)).toString('ascii');
  return /(?:avif|avis)/.test(brands);
}

function avifDimensions(buffer) {
  const needle = Buffer.from('ispe', 'ascii');
  const index = buffer.indexOf(needle);
  if (index >= 4 && index + 16 <= buffer.length) {
    return {
      width: buffer.readUInt32BE(index + 8),
      height: buffer.readUInt32BE(index + 12),
    };
  }
  return { width: 0, height: 0 };
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

async function persistAssets(context) {
  await mkdir(ASSET_DIR, { recursive: true });
  const assets = [...context.assetsByHash.values()].sort((a, b) =>
    a.publicPath.localeCompare(b.publicPath),
  );

  for (const [index, asset] of assets.entries()) {
    const existing = await readFileIfExists(asset.filePath);
    if (existing) {
      if (sha256(existing) !== asset.hash) {
        throw new Error(`Existing asset does not match its content hash: ${asset.publicPath}`);
      }
      context.counts.reusedAssetFiles += 1;
      continue;
    }

    const temporaryPath = `${asset.filePath}.${process.pid}-${index}.tmp`;
    try {
      await writeFile(temporaryPath, asset.body, { flag: 'wx' });
      await rename(temporaryPath, asset.filePath);
      context.counts.writtenAssetFiles += 1;
    } catch (error) {
      await unlink(temporaryPath).catch(() => {});
      throw error;
    }
  }
}

async function verifyPersistedAssets(context) {
  for (const asset of context.assetsByHash.values()) {
    const info = await stat(asset.filePath);
    if (!info.isFile() || info.size !== asset.body.length) {
      throw new Error(`Asset verification failed for ${asset.publicPath}.`);
    }
    const stored = await readFile(asset.filePath);
    if (sha256(stored) !== asset.hash) {
      throw new Error(`Asset checksum verification failed for ${asset.publicPath}.`);
    }
  }
}

async function verifyPlaceholder(dryRun) {
  try {
    await access(PLACEHOLDER_FILE_PATH);
  } catch {
    const suffix = dryRun ? ' (required before a real import)' : '';
    throw new Error(`Missing fallback asset ${PLACEHOLDER_PUBLIC_PATH}${suffix}.`);
  }
}

function validateImport({
  articles,
  archivePosts,
  currentIds,
  remotePosts,
  expectedRemoteTotal,
  context,
}) {
  if (expectedRemoteTotal !== null && remotePosts.length !== expectedRemoteTotal) {
    throw new Error('Remote post count changed during validation.');
  }
  if (archivePosts.length !== articles.length) {
    throw new Error(`Expected ${archivePosts.length} generated articles, received ${articles.length}.`);
  }

  const expectedIds = new Set(archivePosts.map((post) => String(post.id)));
  const articleIds = new Set();
  const slugs = new Set();
  const galleryIds = new Set();

  for (const article of articles) {
    if (currentIds.has(article.id)) throw new Error(`Curated post ${article.id} leaked into the archive.`);
    if (!expectedIds.has(article.id)) throw new Error(`Generated unexpected post ${article.id}.`);
    if (articleIds.has(article.id)) throw new Error(`Duplicate generated post ID ${article.id}.`);
    if (slugs.has(article.slug)) throw new Error(`Duplicate generated slug ${article.slug}.`);
    articleIds.add(article.id);
    slugs.add(article.slug);

    if (!article.title?.ar || !article.excerpt?.ar || !Array.isArray(article.content?.ar)) {
      throw new Error(`Article ${article.id} is missing required Arabic text.`);
    }
    if (article.content.ar.length === 0 || article.content.ar.some((paragraph) => !paragraph.trim())) {
      throw new Error(`Article ${article.id} contains an empty Arabic body.`);
    }
    if ([article.title.ar, article.excerpt.ar, ...article.content.ar].some(containsHtmlTag)) {
      throw new Error(`Article ${article.id} still contains HTML markup.`);
    }
    if (Object.keys(article.title).join(',') !== 'ar') {
      throw new Error(`Article ${article.id} duplicates legacy title translations.`);
    }
    if (!article.category.ar || !article.category.en || !article.category.tr) {
      throw new Error(`Article ${article.id} is missing a translated category.`);
    }

    const localImages = new Set(article.sourceImages);
    if (localImages.size !== article.sourceImages.length) {
      throw new Error(`Article ${article.id} contains duplicate source image paths.`);
    }
    if (article.image !== PLACEHOLDER_PUBLIC_PATH && !localImages.has(article.image)) {
      throw new Error(`Article ${article.id} primary image is absent from sourceImages.`);
    }

    for (const path of article.sourceImages) assertGeneratedAsset(path, context, article.id);
    for (const image of article.gallery) {
      if (galleryIds.has(image.id)) throw new Error(`Duplicate gallery ID ${image.id}.`);
      galleryIds.add(image.id);
      if (image.image !== image.thumbnail) {
        throw new Error(`Gallery thumbnail mismatch in article ${article.id}.`);
      }
      assertGeneratedAsset(image.image, context, article.id);
      if (!localImages.has(image.image)) {
        throw new Error(`Gallery asset is absent from sourceImages in article ${article.id}.`);
      }
      if (
        !Number.isInteger(image.width) ||
        !Number.isInteger(image.height) ||
        image.width <= 0 ||
        image.height <= 0 ||
        Math.max(image.width, image.height) > MAX_FALLBACK_IMAGE_DIMENSION
      ) {
        throw new Error(`Invalid gallery dimensions in article ${article.id}.`);
      }
    }
  }

  if (articleIds.size !== expectedIds.size) {
    throw new Error(`Generated ID count ${articleIds.size} does not match expected ${expectedIds.size}.`);
  }

  for (const [hash, asset] of context.assetsByHash) {
    if (sha256(asset.body) !== hash) throw new Error(`In-memory asset checksum failed: ${asset.publicPath}`);
    if (context.assetsByPublicPath.get(asset.publicPath) !== asset) {
      throw new Error(`Asset path index mismatch: ${asset.publicPath}`);
    }
  }
}

function assertGeneratedAsset(publicPath, context, articleId) {
  if (!publicPath.startsWith('/news/archive/')) {
    throw new Error(`Article ${articleId} references an unexpected generated asset: ${publicPath}`);
  }
  if (!context.assetsByPublicPath.has(publicPath)) {
    throw new Error(`Article ${articleId} references a missing generated asset: ${publicPath}`);
  }
}

async function writeGeneratedModule(articles) {
  const body = JSON.stringify(articles, null, 2).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const output = `/* eslint-disable */
// AUTO-GENERATED by scripts/import-news.mjs. Do not edit by hand.
import type { NewsArticle } from './news';

export const archivedNewsArticles = ${body} as const satisfies readonly NewsArticle[];
`;
  const previous = await readFileIfExists(GENERATED_PATH, 'utf8');
  if (previous === output) {
    console.log(`Unchanged: ${displayPath(GENERATED_PATH)}`);
    return;
  }
  await writeFile(GENERATED_PATH, output, 'utf8');
  console.log(`Wrote ${displayPath(GENERATED_PATH)} (${articles.length} article(s)).`);
}

async function upsertDatabase(articles) {
  const connectionString = process.env.SUPABASE_DB_URL || (await readEnvValue('SUPABASE_DB_URL'));
  if (!connectionString) {
    throw new Error('Missing SUPABASE_DB_URL in the environment or .env.local.');
  }

  const pgModule = await import('pg');
  const Client = pgModule.Client || pgModule.default?.Client;
  if (!Client) throw new Error('The pg package does not export Client.');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query('begin');
    for (const [index, article] of articles.entries()) {
      await client.query(
        `
          insert into public.news (
            slug, source_slug, source_url, published_at, year, source_language,
            featured, category, title, excerpt, content, image, image_alt,
            gallery, source_images, sort_order, is_published
          ) values (
            $1, $2, $3, $4, $5, $6,
            false, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12::jsonb,
            $13::jsonb, $14::jsonb, $15, true
          )
          on conflict (slug) do update set
            source_slug = excluded.source_slug,
            source_url = excluded.source_url,
            published_at = excluded.published_at,
            year = excluded.year,
            source_language = excluded.source_language,
            category = excluded.category,
            title = excluded.title,
            excerpt = excluded.excerpt,
            content = excluded.content,
            image = excluded.image,
            image_alt = excluded.image_alt,
            gallery = excluded.gallery,
            source_images = excluded.source_images,
            sort_order = excluded.sort_order,
            is_published = true,
            updated_at = now()
        `,
        [
          article.slug,
          article.sourceSlug,
          article.sourceUrl,
          article.publishedAt,
          article.year,
          article.sourceLanguage,
          JSON.stringify(article.category),
          JSON.stringify(article.title),
          JSON.stringify(article.excerpt),
          JSON.stringify(article.content),
          article.image,
          JSON.stringify(article.imageAlt),
          JSON.stringify(article.gallery),
          JSON.stringify(article.sourceImages),
          10_000 + index,
        ],
      );
    }
    await client.query('commit');
  } catch (error) {
    await client.query('rollback').catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
  console.log(`Upserted ${articles.length} row(s) into public.news; no rows deleted.`);
}

async function readEnvValue(key) {
  const envPath = join(ROOT_DIR, '.env.local');
  const source = await readFileIfExists(envPath, 'utf8');
  if (!source) return '';
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(new RegExp(`^\\s*${escapeRegExp(key)}\\s*=\\s*(.*?)\\s*$`));
    if (!match) continue;
    const value = match[1];
    if (!value || value.startsWith('#')) return '';
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1);
    }
    return value.replace(/\s+#.*$/, '').trim();
  }
  return '';
}

function cleanHtmlToParagraphs(value) {
  const videoUrls = extractYouTubeUrls(value);
  let html = preserveContentLinks(value);
  html = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|template|svg|iframe|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<img\b[^>]*>/gi, ' ')
    .replace(/\[(?:\/?)(?:caption|gallery|playlist|audio|video)[^\]]*\]/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(?:p|div|section|article|header|footer|aside|blockquote|pre|h[1-6]|li|ul|ol|tr|table|figure|figcaption|hr)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  const lines = decodeHtmlEntities(html)
    .replace(/\r\n?/g, '\n')
    .split(/\n+/)
    .map(normalizeText)
    .filter(Boolean)
    .filter((line) => !/^the post .+ appeared first on .+\.?$/i.test(line));

  const paragraphs = [];
  let previous = '';
  for (const line of lines) {
    const fingerprint = line.toLocaleLowerCase('ar');
    if (fingerprint === previous) continue;
    paragraphs.push(line);
    previous = fingerprint;
  }
  for (const videoUrl of videoUrls) {
    if (!paragraphs.includes(videoUrl)) paragraphs.push(videoUrl);
  }
  return paragraphs;
}

function preserveContentLinks(value) {
  return String(value || '')
    .replace(/<iframe\b([^>]*)>(?:[\s\S]*?<\/iframe\s*>)?/gi, (_match, rawAttributes) => {
      const attributes = parseHtmlAttributes(`<iframe ${rawAttributes}>`);
      const sourceUrl = normalizeContentUrl(attributes.src);
      if (!sourceUrl) return ' ';
      return `\n${canonicalYouTubeUrl(sourceUrl) || sourceUrl}\n`;
    })
    .replace(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi, (_match, rawAttributes, innerHtml) => {
      const attributes = parseHtmlAttributes(`<a ${rawAttributes}>`);
      const href = normalizeContentUrl(attributes.href);
      const label = cleanInlineText(innerHtml);
      if (!href || !label) return ` ${label} `;
      const destination = canonicalYouTubeUrl(href) || href;
      return label === href ? ` ${destination} ` : ` ${label}: ${destination} `;
    });
}

function normalizeContentUrl(value) {
  if (!value) return '';
  const decoded = decodeHtmlEntities(String(value).trim()).replace(/\\\//g, '/');
  const url = safeUrl(decoded, SOURCE_ORIGIN);
  if (!url || !['http:', 'https:'].includes(url.protocol)) return '';
  const hostname = url.hostname.toLowerCase();
  if (LEGACY_VEYS_HOSTS.has(hostname)) url.hostname = 'veysvakfi.org';
  if (VEYS_HOSTS.has(url.hostname.toLowerCase())) url.protocol = 'https:';
  url.hash = '';
  return url.href;
}

function canonicalYouTubeUrl(value) {
  const normalized = decodeHtmlEntities(String(value || '')).replace(/\\\//g, '/');
  const videoId = normalized.match(YOUTUBE_ID_PATTERN)?.[1] || '';
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : '';
}

function extractYouTubeUrls(value) {
  const decoded = decodeHtmlEntities(String(value || '')).replace(/\\\//g, '/');
  const urls = [];
  for (const match of decoded.matchAll(/(?:https?:)?\/\/[^\s"'<>]+/gi)) {
    const canonical = canonicalYouTubeUrl(match[0]);
    if (canonical) urls.push(canonical);
  }
  return [...new Set(urls)];
}

function cleanInlineText(value) {
  return normalizeText(
    decodeHtmlEntities(
      String(value || '')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<[^>]+>/g, ' '),
    ),
  );
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[\u00ad\u200b\u200c\u200d\u2060\ufeff]/g, '')
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/[\t\v\f ]+/g, ' ')
    .replace(/\s+([،؛:,.!?؟])/g, '$1')
    .trim();
}

function decodeHtmlEntities(value) {
  const named = {
    amp: '&',
    apos: "'",
    bull: '•',
    copy: '©',
    gt: '>',
    hellip: '…',
    laquo: '«',
    ldquo: '“',
    lsquo: '‘',
    lt: '<',
    mdash: '—',
    middot: '·',
    nbsp: ' ',
    ndash: '–',
    quot: '"',
    raquo: '»',
    rdquo: '”',
    reg: '®',
    rsquo: '’',
    shy: '',
    trade: '™',
  };

  let output = String(value || '');
  for (let pass = 0; pass < 2; pass += 1) {
    output = output.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z][a-z0-9]+);?/gi, (entity, code) => {
      if (code[0] === '#') {
        const hexadecimal = code[1]?.toLowerCase() === 'x';
        const number = Number.parseInt(code.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
        if (!Number.isInteger(number) || number < 0 || number > 0x10ffff) return entity;
        try {
          return String.fromCodePoint(number);
        } catch {
          return entity;
        }
      }
      return Object.hasOwn(named, code.toLowerCase()) ? named[code.toLowerCase()] : entity;
    });
  }
  return output;
}

function truncateAtWord(value, maximum) {
  const text = normalizeText(value);
  if (text.length <= maximum) return text;
  const candidate = text.slice(0, maximum - 1);
  const lastSpace = candidate.lastIndexOf(' ');
  const end = lastSpace >= Math.floor(maximum * 0.65) ? lastSpace : candidate.length;
  return `${candidate.slice(0, end).replace(/[،؛:,.!?؟\s]+$/g, '')}…`;
}

function slugify(value) {
  let decoded = String(value || '');
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Keep malformed legacy slugs verbatim and normalize them below.
  }
  return decoded
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 88)
    .replace(/-+$/g, '');
}

function categoryName(post) {
  const groups = post?._embedded?.['wp:term'];
  if (!Array.isArray(groups)) return '';
  const terms = groups.flatMap((group) => (Array.isArray(group) ? group : []));
  const category =
    terms.find((term) => term?.taxonomy === 'category' && Number(term.id) === CATEGORY_ID) ||
    terms.find((term) => term?.taxonomy === 'category');
  return cleanInlineText(category?.name);
}

function normalizePublishedDate(post) {
  const raw = post.date_gmt || post.date;
  if (!raw) throw new Error(`WordPress post ${post.id} has no publication date.`);
  const candidate = post.date_gmt && !/[z+-]\d*:?\d*$/i.test(raw) ? `${raw}Z` : raw;
  const date = new Date(candidate);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`WordPress post ${post.id} has an invalid publication date: ${raw}`);
  }
  return date.toISOString();
}

function normalizeArticleUrl(link, sourceSlug) {
  const fallback = new URL(`${encodeURIComponent(sourceSlug)}/`, `${SOURCE_ORIGIN}/`).href;
  const url = safeUrl(link, SOURCE_ORIGIN) || new URL(fallback);
  if (VEYS_HOSTS.has(url.hostname.toLowerCase())) url.protocol = 'https:';
  return url.href;
}

function slugFromPostLink(link) {
  const url = safeUrl(link);
  const parts = url?.pathname.split('/').filter(Boolean) ?? [];
  return parts.at(-1) || '';
}

function resolveRemoteImageUrl(value) {
  if (!value) return '';
  const decoded = decodeHtmlEntities(String(value).trim()).replace(/\\\//g, '/');
  const url = safeUrl(decoded, SOURCE_ORIGIN);
  if (!url || !['http:', 'https:'].includes(url.protocol)) return '';
  if (LEGACY_VEYS_HOSTS.has(url.hostname.toLowerCase())) url.hostname = 'veysvakfi.org';
  if (VEYS_HOSTS.has(url.hostname.toLowerCase())) url.protocol = 'https:';
  if (url.protocol !== 'https:') return '';
  url.hash = '';
  return url.href;
}

function safeUrl(value, base) {
  try {
    return new URL(value, base);
  } catch {
    return null;
  }
}

async function requestJson(url, options = {}) {
  const response = await requestUrl(url, {
    accept: 'application/json',
    maxBytes: options.maxBytes || MAX_API_BYTES,
  });
  try {
    return { ...response, value: JSON.parse(response.body.toString('utf8')) };
  } catch (error) {
    throw new Error(`Invalid JSON from ${response.url.href}: ${formatError(error)}`);
  }
}

async function requestUrl(input, options = {}, redirectCount = 0) {
  const url = input instanceof URL ? new URL(input) : new URL(input);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Unsupported URL protocol: ${url.protocol}`);
  }
  if (url.protocol === 'http:' && VEYS_HOSTS.has(url.hostname.toLowerCase())) {
    url.protocol = 'https:';
  }

  let lastError;
  for (let attempt = 1; attempt <= REQUEST_ATTEMPTS; attempt += 1) {
    try {
      const response = await requestOnce(url, options);
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        const location = response.headers.location;
        if (!location) throw new HttpStatusError(url, response, 'Redirect response has no Location header.');
        if (redirectCount >= 6) throw new Error(`Too many redirects while requesting ${url.href}.`);
        return requestUrl(new URL(location, url), options, redirectCount + 1);
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return { ...response, url };
      }

      const statusError = new HttpStatusError(url, response);
      if (attempt < REQUEST_ATTEMPTS && isRetryableStatus(response.statusCode)) {
        await delay(retryDelay(response.headers['retry-after'], attempt));
        lastError = statusError;
        continue;
      }
      throw statusError;
    } catch (error) {
      if (error instanceof HttpStatusError) throw error;
      lastError = error;
      if (attempt < REQUEST_ATTEMPTS) {
        await delay(300 * 2 ** (attempt - 1));
        continue;
      }
    }
  }
  throw lastError || new Error(`Request failed: ${url.href}`);
}

function requestOnce(url, options) {
  return new Promise((resolvePromise, rejectPromise) => {
    const request = url.protocol === 'https:' ? httpsRequest : httpRequest;
    const requestOptions = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || undefined,
      path: `${url.pathname}${url.search}`,
      method: 'GET',
      headers: {
        Accept: options.accept || '*/*',
        'Accept-Encoding': 'identity',
        'User-Agent': USER_AGENT,
      },
      agent:
        url.protocol === 'https:' && VEYS_HOSTS.has(url.hostname.toLowerCase())
          ? legacyHttpsAgent
          : undefined,
    };

    const req = request(requestOptions, (response) => {
      const chunks = [];
      let received = 0;
      const maximum = options.maxBytes || MAX_API_BYTES;

      response.on('data', (chunk) => {
        received += chunk.length;
        if (received > maximum) {
          response.destroy(new Error(`Response exceeded ${maximum} bytes: ${url.href}`));
          return;
        }
        chunks.push(chunk);
      });
      response.on('error', rejectPromise);
      response.on('end', () => {
        resolvePromise({
          body: Buffer.concat(chunks),
          headers: response.headers,
          statusCode: response.statusCode || 0,
        });
      });
    });

    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms: ${url.href}`));
    });
    req.on('error', rejectPromise);
    req.end();
  });
}

function isInvalidWordPressPage(error) {
  if (!(error instanceof HttpStatusError) || error.statusCode !== 400) return false;
  try {
    return JSON.parse(error.responseBody.toString('utf8')).code === 'rest_post_invalid_page_number';
  } catch {
    return false;
  }
}

function isRetryableStatus(statusCode) {
  return statusCode === 408 || statusCode === 425 || statusCode === 429 || statusCode >= 500;
}

function retryDelay(retryAfter, attempt) {
  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 10_000);
  return 400 * 2 ** (attempt - 1);
}

function readPositiveIntegerHeader(headers, name, allowZero) {
  const raw = Array.isArray(headers[name]) ? headers[name][0] : headers[name];
  if (raw === undefined) return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < (allowZero ? 0 : 1)) {
    throw new Error(`Invalid ${name} response header: ${raw}`);
  }
  return value;
}

function compareArticles(a, b) {
  const dateDifference = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  if (dateDifference !== 0) return dateDifference;
  return Number(b.id) - Number(a.id);
}

function containsHtmlTag(value) {
  return /<\/?[a-z][^>]*>/i.test(String(value));
}

function usesPlaceholder(articles) {
  return articles.some((article) => article.image === PLACEHOLDER_PUBLIC_PATH);
}

function positiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number) : 0;
}

function imageArea(candidate) {
  return candidate.width && candidate.height
    ? candidate.width * candidate.height
    : Math.max(candidate.width, candidate.height);
}

function dedupeBy(values, keyFor) {
  const seen = new Set();
  return values.filter((value) => {
    const key = keyFor(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function readFileIfExists(path, encoding) {
  try {
    return await readFile(path, encoding);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function displayPath(path) {
  const local = relative(ROOT_DIR, path);
  return local.split(sep).join('/');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function delay(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

function printSummary(articles, context) {
  const imageReferences = context.counts.resolvedImageRefs;
  const uniqueAssets = context.assetsByHash.size;
  console.log(`
Import ${context.options.dryRun ? 'dry run ' : ''}validated successfully:
  remote published posts : ${context.counts.remote}
  curated IDs read       : ${context.counts.curatedIds}
  curated posts excluded : ${context.counts.excluded}
  archive articles       : ${articles.length}
  image references       : ${imageReferences}
  unique image assets    : ${uniqueAssets}
  deduplicated images    : ${Math.max(0, imageReferences - uniqueAssets)}
  image URL downloads    : ${context.counts.networkImageDownloads}
  image failures         : ${context.counts.failedImageRefs}
  asset files written    : ${context.options.dryRun ? 0 : context.counts.writtenAssetFiles}
  asset files reused     : ${context.options.dryRun ? 0 : context.counts.reusedAssetFiles}
  warnings               : ${context.warnings.length}`);

  if (context.options.dryRun) {
    console.log(
      `Dry run: would write ${displayPath(GENERATED_PATH)} and ${uniqueAssets} content-addressed asset(s).`,
    );
  }
}
