import { serviceClient } from '../_lib/db';
import { methodNotAllowed, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http';

/**
 * Addresses of the former WordPress site that still circulate (ads, posts,
 * messages, search results). The web server asks here about any address that
 * is neither a file of the build nor a page of the app, with the visitor's
 * request line in the X-Original-URI header. The answer is a permanent
 * redirect to the page that took its place, or 404: the web server then shows
 * the app's "page not found" with that status.
 *
 * The query string travels with the redirect, so campaign parameters and
 * Google Ads click ids still reach the new page.
 */

/** Former pages, by path (decoded, lower case, without the slashes at both ends). */
const MOVED_PAGES: Record<string, string> = {
  // Volunteering
  'تطوع-معنا': '/participate/volunteer',
  'volunteer-with-us': '/participate/volunteer',
  // Store pages of the waqf projects
  'product/waqf-share': '/projects/waqf-share',
  'product/the-blessed-tree-project': '/projects/blessed-tree',
  'مشروع-الشجرة-المباركة': '/projects/blessed-tree',
  // Donation steps
  'donate-now': '/donate',
  'complete-payment': '/donate',
  shop: '/donate',
  cart: '/donate',
  checkout: '/donate',
  // About and contact
  'من-نحن': '/about/waqf',
  'about-us': '/about/waqf',
  'اتصل-بنا': '/participate/contact',
  'contact-us': '/participate/contact',
  // Library
  'قصص-النجاح': '/library/success-stories',
  'معرض-الصور': '/library/gallery',
  'الفيديوهات': '/library/gallery',
  // Pages of the Blessed Tree project
  'استعلم-عن-شجرتك': '/projects/blessed-tree',
  'دليل-المستثمر': '/projects/blessed-tree',
  'مزارع-الزيتون': '/projects/blessed-tree',
  'الحملات-الدعائية': '/projects/blessed-tree',
  // Home pages of the language versions
  'الرئيسية-english': '/',
  'الرئيسية-turkce': '/',
  'tr/الرئيسية-turkce': '/',
  tr: '/',
  en: '/',
};

/** Whole sections of the former site, by the start of the path. */
const MOVED_SECTIONS: Array<[string, string]> = [
  ['product/', '/projects'],
  ['product-category/', '/projects'],
  ['category/', '/news'],
  ['tag/', '/news'],
  ['gt3_gallery/', '/library/gallery'],
];

/** The former site's article addresses: one slug, possibly after a date. */
const ARTICLE_SLUG = /^[\p{L}\p{N}-]{3,200}$/u;

const LOOKUP_TIMEOUT_MS = 2000;

type Original = { path: string; query: string };

/** The visitor's path (decoded, lower case, no slashes at the ends) and query. */
function originalOf(req: ApiRequest): Original | null {
  const header = req.headers['x-original-uri'];
  const raw = (Array.isArray(header) ? header[0] : header) ?? '';
  if (!raw.startsWith('/') || raw.length > 2000) return null;
  const queryStart = raw.indexOf('?');
  const rawPath = queryStart === -1 ? raw : raw.slice(0, queryStart);
  const rawQuery = queryStart === -1 ? '' : raw.slice(queryStart + 1).split('#')[0];
  let path: string;
  try {
    path = decodeURIComponent(rawPath);
  } catch {
    return null;
  }
  path = path.normalize('NFC').toLowerCase().replace(/\/{2,}/g, '/').replace(/^\/+|\/+$/g, '');
  // A query that is not plain URL text (it would not fit in a header) is dropped.
  const query = /^[\x21-\x7e]*$/.test(rawQuery) ? rawQuery : '';
  return { path, query };
}

function movedPage(path: string): string | null {
  if (Object.hasOwn(MOVED_PAGES, path)) return MOVED_PAGES[path];
  for (const [prefix, target] of MOVED_SECTIONS) {
    if (path.startsWith(prefix)) return target;
  }
  return null;
}

/**
 * The former site's posts were imported as news with the slug
 * archive-<post id>-<post slug>, and the post was at /<post slug>/ (or under a
 * date, /2024/05/<post slug>/).
 */
async function movedArticle(path: string): Promise<string | null> {
  const segments = path.split('/');
  const slug = segments[segments.length - 1];
  if (!segments.slice(0, -1).every((segment) => /^\d{1,4}$/.test(segment))) return null;
  if (!ARTICLE_SLUG.test(slug)) return null;

  const { data, error } = await serviceClient()
    .from('news')
    .select('slug')
    .like('slug', `archive-%-${slug}`)
    .eq('is_published', true)
    .limit(10)
    .abortSignal(AbortSignal.timeout(LOOKUP_TIMEOUT_MS));
  if (error) {
    console.error('legacy redirect lookup failed:', error.message);
    return null;
  }
  const match = (data ?? []).find((row) => String(row.slug).replace(/^archive-\d+-/, '') === slug);
  return match ? `/news/${encodeURIComponent(String(match.slug))}` : null;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    methodNotAllowed(res, 'GET, HEAD');
    return;
  }

  const original = originalOf(req);
  const target = original ? movedPage(original.path) ?? (await movedArticle(original.path)) : null;
  if (!original || !target) {
    sendJson(res, 404, { ok: false, error: 'not-found' });
    return;
  }

  res.statusCode = 301;
  res.setHeader('Location', `${target}${original.query ? `?${original.query}` : ''}`);
  // Browsers keep a permanent redirect without asking again; an hour leaves
  // room to correct a destination.
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.end();
}
