import { serviceClient } from '../_lib/db';
import { siteOrigin, supabaseUrl } from '../_lib/env';
import { methodNotAllowed, readQuery, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http';
import {
  PUBLIC_STORAGE_PREFIX,
  SHARE_IMAGE_MAX_BYTES,
  SITE_CARD_PATH,
  SITE_DESCRIPTION,
  encodePath,
  imageRef,
  localized,
  oneLine,
  renderNewsCard,
  shareCopyPath,
  unusableForCards,
} from '../_lib/shareCard';

/**
 * Link preview of a news article: its title, summary and picture, for the
 * apps that build a card from a shared link without running the page's
 * script. The web server sends those apps here for /news/<slug> and serves
 * the ordinary page shell for any answer other than 200, so a slug that does
 * not exist, an unpublished article or a failure here never shows a broken
 * page: only the site-wide card.
 */

const PATH_PREFIX = '/api/share/news/';
const LOOKUP_TIMEOUT_MS = 1500;

function slugFrom(req: ApiRequest): string | null {
  const raw = req.url ?? '';
  const end = raw.search(/[?#]/);
  const path = end === -1 ? raw : raw.slice(0, end);
  let slug = path.startsWith(PATH_PREFIX) ? path.slice(PATH_PREFIX.length) : readQuery(req).get('slug') ?? '';
  slug = slug.replace(/\/+$/, '');
  try {
    slug = decodeURIComponent(slug);
  } catch {
    return null;
  }
  slug = slug.trim();
  if (!slug || slug.length > 300 || slug.includes('/')) return null;
  return slug;
}

/** Size of a file, or null when it is not there (or did not answer in time). */
async function fileSize(url: string): Promise<number | null> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS) });
    if (!response.ok) return null;
    const length = Number(response.headers.get('content-length') ?? '');
    return Number.isFinite(length) ? length : -1;
  } catch {
    return null;
  }
}

/**
 * The picture for the card: the article's own when the apps can show it, its
 * light copy when it is too heavy, and the site-wide card otherwise.
 */
async function cardImage(image: unknown, origin: string): Promise<string> {
  const fallback = `${origin}${SITE_CARD_PATH}`;
  const ref = imageRef(image, new URL(origin).hostname);
  if (!ref) return fallback;
  if ('external' in ref) return ref.external;
  if (unusableForCards(ref.path)) return fallback;

  let storage: string;
  try {
    storage = supabaseUrl().replace(/\/+$/, '');
  } catch {
    return fallback;
  }

  const copy = shareCopyPath(ref.path);
  if ((await fileSize(`${storage}${copy}`)) !== null) return `${origin}${copy}`;

  if (ref.path.startsWith(PUBLIC_STORAGE_PREFIX)) {
    const size = await fileSize(`${storage}${encodePath(ref.path)}`);
    return size !== null && size >= 0 && size <= SHARE_IMAGE_MAX_BYTES ? `${origin}${encodePath(ref.path)}` : fallback;
  }
  // A picture shipped with the site itself; the heavy ones have a copy.
  return `${origin}${encodePath(ref.path)}`;
}

function send(req: ApiRequest, res: ApiResponse, html: string): void {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.end(req.method === 'HEAD' ? undefined : html);
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    methodNotAllowed(res, 'GET, HEAD');
    return;
  }

  const slug = slugFrom(req);
  if (!slug) {
    sendJson(res, 404, { ok: false, error: 'not-found' });
    return;
  }

  const { data, error } = await serviceClient()
    .from('news')
    .select('slug,title,excerpt,image,image_alt,published_at,is_published')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('share/news failed:', error.message);
    sendJson(res, 503, { ok: false, error: 'unavailable' });
    return;
  }
  if (!data || data.is_published === false) {
    sendJson(res, 404, { ok: false, error: 'not-found' });
    return;
  }

  const origin = siteOrigin(req).replace(/\/+$/, '');
  const title = oneLine(localized(data.title), 160);
  if (!title) {
    sendJson(res, 404, { ok: false, error: 'not-found' });
    return;
  }

  send(
    req,
    res,
    renderNewsCard({
      origin,
      slug: String(data.slug),
      title,
      description: oneLine(localized(data.excerpt) || SITE_DESCRIPTION, 200),
      image: await cardImage(data.image, origin),
      imageAlt: oneLine(localized(data.image_alt), 160),
      publishedAt: typeof data.published_at === 'string' ? data.published_at : null,
    }),
  );
}
