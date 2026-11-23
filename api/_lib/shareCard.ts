import { createHash } from 'node:crypto';

/**
 * The card an app builds when a link to the site is shared (WhatsApp,
 * Facebook, Telegram, X, LinkedIn...). Those apps read the page's meta tags
 * without running its script, so whatever is not in the HTML they receive
 * does not exist for them.
 *
 * No other module of the project is imported here, so the file can be checked
 * on its own (node --experimental-strip-types).
 */

export const SITE_NAME = 'وقف أويس القرني';
export const SITE_DESCRIPTION =
  'مؤسسة وقفية تسعى إلى إيجاد أوعية استثمارية مبتكرة ومستدامة، والتكامل مع الشركاء في بناء القدرات وتنفيذ البرامج المساندة التي تخدم نهوض اليمن.';

/** The site-wide card: the logo on a white ground, 1200×630 (public/share/site.jpg). */
export const SITE_CARD_PATH = '/share/site.jpg';

/**
 * WhatsApp leaves the picture out of a card when the file is larger than
 * about 300 KB. Heavier pictures get a lighter copy for sharing.
 */
export const SHARE_IMAGE_MAX_BYTES = 300 * 1024;

/** Where the lighter copies live in the public media bucket. */
export const SHARE_COPY_PREFIX = '/storage/v1/object/public/media/share/news/';

/** Public pictures in storage, as the site serves them. */
export const PUBLIC_STORAGE_PREFIX = '/storage/v1/object/public/';

/** Arabic first (the site's own language), then English, then Turkish. */
export function localized(value: unknown): string {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const record = value as Record<string, unknown>;
  for (const key of ['ar', 'en', 'tr']) {
    const text = record[key];
    if (typeof text === 'string' && text.trim()) return text.trim();
  }
  return '';
}

/** One line of at most `max` characters, cut at a word where possible. */
export function oneLine(text: string, max: number): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const atWord = cut.replace(/\s+\S*$/, '');
  return `${atWord.length >= max / 2 ? atWord : cut}…`;
}

export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export type ImageRef = { path: string } | { external: string };

/**
 * A news picture as stored ("/news/x.jpg", "news/x.jpg" or a full address)
 * reduced to its decoded path on this site, or kept whole when it lives on
 * another site. Nothing usable: null.
 */
export function imageRef(image: unknown, siteHost: string): ImageRef | null {
  if (typeof image !== 'string') return null;
  const raw = image.trim();
  if (!raw) return null;
  let path = raw;
  if (/^https?:\/\//i.test(raw)) {
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      return null;
    }
    const host = url.hostname.toLowerCase();
    const ours = host === siteHost.toLowerCase() || host === 'veysvakfi.org' || host.endsWith('.veysvakfi.org');
    if (!ours) return { external: url.href };
    path = url.pathname;
  } else {
    path = raw.split(/[?#]/)[0];
  }
  try {
    path = decodeURIComponent(path);
  } catch {
    // Not percent-encoded after all: keep it as written.
  }
  if (!path) return null;
  return { path: path.startsWith('/') ? path : `/${path}` };
}

/**
 * The name of a picture's light copy: the first 16 hex digits of the SHA-256
 * of its decoded site path. owis-migrate share-images makes the copies under
 * the same name.
 */
export function shareKey(path: string): string {
  return createHash('sha256').update(path, 'utf8').digest('hex').slice(0, 16);
}

export function shareCopyPath(path: string): string {
  return `${SHARE_COPY_PREFIX}${shareKey(path)}.jpg`;
}

/** Formats the link-preview apps do not show. */
export function unusableForCards(path: string): boolean {
  return /\.svg$/i.test(path);
}

/** A site path as a URL path: every segment percent-encoded where needed. */
export function encodePath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export type NewsCard = {
  origin: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  publishedAt: string | null;
};

/** The page the apps read: the meta tags, and a readable fallback body. */
export function renderNewsCard(card: NewsCard): string {
  const url = `${card.origin}/news/${encodeURIComponent(card.slug)}`;
  const title = escapeAttribute(card.title);
  const description = escapeAttribute(card.description);
  const image = escapeAttribute(card.image);
  const alt = escapeAttribute(card.imageAlt || card.title);
  const site = escapeAttribute(SITE_NAME);
  const href = escapeAttribute(url);
  const published = card.publishedAt
    ? `\n<meta property="article:published_time" content="${escapeAttribute(card.publishedAt)}">`
    : '';
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | ${site}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${href}">
<meta property="og:site_name" content="${site}">
<meta property="og:type" content="article">
<meta property="og:locale" content="ar_AR">
<meta property="og:url" content="${href}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:image:alt" content="${alt}">${published}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
</head>
<body>
<h1>${title}</h1>
<p>${description}</p>
<p><a href="${href}">${href}</a></p>
</body>
</html>
`;
}
