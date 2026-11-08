/**
 * Google Analytics 4 (gtag.js) for the public site.
 *
 * One page-view strategy: the app reports every page itself, from React Router
 * (see usePageViewTracking), with a sanitized URL. gtag's automatic page_view
 * is switched off with `send_page_view: false`.
 *
 * Google still sends Enhanced Measurement "browser history" page views when
 * `send_page_view` is false, so that option must stay OFF in the GA web stream
 * (Admin > Data streams > Enhanced measurement > Page views > Show advanced
 * settings > "Page changes based on browser history events"). If it is on,
 * every in-app navigation is counted twice.
 *
 * Privacy rules are enforced before anything is sent:
 * - The tag never loads on /admin, inside the dashboard preview (or any other
 *   frame), outside the production hosts, or in a dev build.
 * - page_location and page_referrer keep only campaign parameters (utm_*,
 *   Google Ads click ids) and drop the #fragment, so amount, oid, error and
 *   search terms never leave the browser.
 * - On the payment routes (checkout and result) only the sanitized page_view
 *   goes out. Everything the tag would collect there by itself (form
 *   interactions, outbound clicks such as the WhatsApp receipt link that
 *   carries the donor's name and payment reference, scrolls, automatic
 *   user-provided data detection) is blocked with Google's opt-out flag,
 *   which gtag checks as each event is queued.
 */

const MEASUREMENT_ID = 'G-CVWM3EXR7D';
const TAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
const PRODUCTION_HOSTS = new Set(['veysvakfi.org', 'www.veysvakfi.org']);
const OPT_OUT_FLAG = `ga-disable-${MEASUREMENT_ID}`;

/** Query parameters GA needs for campaign attribution; every other one is dropped. */
const CAMPAIGN_PARAMS = new Set([
  'utm_id',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_source_platform',
  'utm_creative_format',
  'utm_marketing_tactic',
  'gclid',
  'gbraid',
  'wbraid',
  'dclid',
]);

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** off: never started here. on: tracking. stopped: the dashboard was opened in this tab. */
let status: 'off' | 'on' | 'stopped' = 'off';
let lastPageLocation: string | null = null;
let firstReferrer = '';

export function isAdminPath(pathname: string): boolean {
  // Same test App.tsx uses to hand the route to the dashboard.
  return pathname.startsWith('/admin');
}

/** Checkout and the bank's return page: only a sanitized page_view is sent there. */
export function isPaymentPath(pathname: string): boolean {
  const path = pathname.toLowerCase().replace(/\/+$/, '');
  return path === '/donate/result' || path === '/donate/checkout' || path.startsWith('/donate/checkout/');
}

/** Origin + path + campaign parameters only. Payment pages keep no query at all. */
export function sanitizePageUrl(href: string): string {
  const url = new URL(href);
  const kept = new URLSearchParams();
  if (!isPaymentPath(url.pathname)) {
    url.searchParams.forEach((value, key) => {
      if (CAMPAIGN_PARAMS.has(key.toLowerCase())) kept.append(key, value);
    });
  }
  const query = kept.toString();
  return `${url.origin}${url.pathname}${query ? `?${query}` : ''}`;
}

/** Our own pages are sanitized like page_location; another site is reduced to its origin. */
export function sanitizeReferrer(referrer: string, ownHost: string): string {
  if (!referrer) return '';
  try {
    const url = new URL(referrer);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    return url.host === ownHost ? sanitizePageUrl(url.href) : `${url.origin}/`;
  } catch {
    return '';
  }
}

/** Removes any non-campaign query value from the title, in case a page ever echoes one. */
export function scrubTitle(title: string, search: string): string {
  let clean = title;
  new URLSearchParams(search).forEach((value, key) => {
    const needle = value.trim();
    if (needle.length >= 3 && !CAMPAIGN_PARAMS.has(key.toLowerCase())) clean = clean.split(needle).join('');
  });
  return clean.replace(/\s{2,}/g, ' ').trim();
}

function gtag(...args: unknown[]): void {
  window.gtag?.(...args);
}

/**
 * Google's opt-out flag. gtag reads it when an event is queued, so an event
 * pushed while it is up is dropped and one pushed while it is down is kept.
 */
function setOptOut(on: boolean): void {
  (window as unknown as Record<string, unknown>)[OPT_OUT_FLAG] = on;
}

function shouldTrackThisDocument(): boolean {
  if (!import.meta.env.PROD) return false;
  if (!PRODUCTION_HOSTS.has(window.location.hostname)) return false;
  if (isAdminPath(window.location.pathname)) return false;
  // The dashboard's live preview loads the site in an iframe with ?cmsPreview=1.
  // That flag is gone after the first in-frame navigation, so any frame is excluded.
  if (window.self !== window.top) return false;
  if (new URLSearchParams(window.location.search).has('cmsPreview')) return false;
  return true;
}

/**
 * Raises the opt-out flag before the URL changes to a payment or admin route,
 * so not even an automatic history event gets through with the raw URL
 * (checkout links carry ?amount=). Registered before gtag.js loads, so these
 * listeners run ahead of the tag's own.
 */
function guardSensitiveNavigation(): void {
  const isSensitive = (pathname: string) => isPaymentPath(pathname) || isAdminPath(pathname);

  document.addEventListener(
    'click',
    (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.origin === window.location.origin && isSensitive(anchor.pathname)) setOptOut(true);
    },
    true,
  );

  window.addEventListener('popstate', () => {
    if (isSensitive(window.location.pathname)) setOptOut(true);
  });
}

/** Loads gtag.js once, asynchronously. Never throws: analytics must not break the site. */
export function initAnalytics(): void {
  if (status !== 'off') return;
  try {
    if (!shouldTrackThisDocument()) return;
    status = 'on';

    const { href, host, pathname, search } = window.location;
    firstReferrer = sanitizeReferrer(document.referrer, host);
    setOptOut(isPaymentPath(pathname));
    guardSensitiveNavigation();

    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtagQueue() {
        // gtag.js expects the arguments object itself.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
    }

    // Blocks the property's automatic user-provided data detection (hashed
    // emails, phone numbers and addresses read from forms such as checkout).
    gtag('consent', 'default', { ad_user_data: 'denied' });
    gtag('js', new Date());
    // Every hit, including events the tag creates by itself, reports these
    // sanitized values instead of the raw address bar.
    gtag('set', {
      page_location: sanitizePageUrl(href),
      page_referrer: firstReferrer,
      page_title: scrubTitle(document.title, search),
    });
    gtag('config', MEASUREMENT_ID, { send_page_view: false });

    if (!document.querySelector(`script[src="${TAG_SRC}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = TAG_SRC;
      // Blocked by an extension or offline: the queue just stays local.
      script.onerror = () => undefined;
      document.head.appendChild(script);
    }
  } catch {
    status = 'stopped';
  }
}

/**
 * Sends one page_view for the current address, unless it is the page already
 * reported (query-only changes such as a library search stay one view).
 */
export function trackPageView(): void {
  if (status !== 'on') return;
  try {
    const { href, pathname, search, host } = window.location;
    const onPaymentPage = isPaymentPath(pathname);
    const pageLocation = sanitizePageUrl(href);

    if (pageLocation !== lastPageLocation) {
      const isFirstView = lastPageLocation === null;
      const pageTitle = scrubTitle(document.title, search);
      const pageReferrer = isFirstView ? firstReferrer : lastPageLocation ?? '';
      const params: Record<string, unknown> = {
        page_location: pageLocation,
        page_title: pageTitle,
        page_referrer: pageReferrer,
      };
      // Coming back from the bank's 3-D Secure page must not start a new
      // "referral" visit from the bank: keep the donor's original source.
      if (isFirstView && onPaymentPage && firstReferrer && new URL(firstReferrer).host !== host) {
        params.ignore_referrer = true;
      }

      setOptOut(false);
      gtag('set', { page_location: pageLocation, page_title: pageTitle, page_referrer: pageReferrer });
      gtag('event', 'page_view', params);
      lastPageLocation = pageLocation;
    }

    setOptOut(onPaymentPage);
  } catch {
    // A tracking failure must never surface to visitors.
  }
}

/** The dashboard was opened in this tab: send nothing more from this document. */
export function stopAnalytics(): void {
  if (status === 'on') setOptOut(true);
  status = 'stopped';
}
