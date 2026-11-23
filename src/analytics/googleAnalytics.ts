/**
 * Google tags for the public site, through one gtag.js: Google Analytics 4
 * (G-CVWM3EXR7D) and the Google Ads tag (AW-460760222).
 *
 * Page views
 * - Analytics: the app reports every page itself, from React Router (see
 *   usePageViewTracking), with a sanitized URL, to Analytics only. gtag's
 *   automatic page_view is switched off with `send_page_view: false`.
 *   Google still sends Enhanced Measurement "browser history" page views when
 *   `send_page_view` is false, so that option must stay OFF in the GA web
 *   stream (Admin > Data streams > Enhanced measurement > Page views > Show
 *   advanced settings > "Page changes based on browser history events"). If
 *   it is on, every in-app navigation is counted twice.
 * - Google Ads: its tag counts the first page itself and then every change of
 *   address inside the app (the browser history events). The app sends it no
 *   page_view of its own, which would count each page twice.
 *
 * Consent (Google Consent Mode v2)
 * - analytics_storage is granted: visits are measured from the start.
 * - ad_storage, ad_user_data and ad_personalization stay denied until the
 *   visitor accepts advertising cookies in the banner (ConsentBanner). The
 *   answer is kept in this browser for a year and applied before any tag
 *   runs on later visits. While they are denied the Ads tag sends cookieless
 *   pings only, with ad-click identifiers redacted, and neither tag collects
 *   user-provided data (hashed emails or phone numbers read from forms).
 *
 * Privacy rules are enforced before anything is sent:
 * - The tags never load on /admin, inside the dashboard preview (or any other
 *   frame), outside the production hosts, or in a dev build.
 * - The payment's own reference (oid) leaves the result page's address
 *   before any tag loads (see pages/donate/resultReference.ts): the Ads tag
 *   reads the address bar as it is. Google Ads therefore sees page paths and
 *   their ordinary query (the amount offered on a checkout link, a library
 *   search), never the payment reference.
 * - For Analytics, page_location and page_referrer keep only campaign
 *   parameters (utm_*, Google Ads click ids) and drop the #fragment, so
 *   amount, error and search terms never reach it either.
 * - On the payment routes (checkout and result) only what the app sends itself
 *   goes to Analytics. Everything the tag would collect there by itself (form
 *   interactions, outbound clicks such as the WhatsApp receipt link that
 *   carries the donor's name and payment reference, scrolls, automatic
 *   user-provided data detection) is blocked with Google's opt-out flag,
 *   which gtag checks as each event is queued.
 *   The app sends three things from there, all with the sanitized address:
 *   the page_view, begin_checkout when a checkout page opens, and purchase
 *   once the bank has confirmed a donation (amount, currency and a one-way
 *   reference that cannot be turned back into the payment's own reference).
 *
 * Google Ads conversions: begin_checkout and purchase also go to Ads as
 * conversions once their labels are filled in ADS_CONVERSION_LABELS below;
 * an empty label sends nothing to Ads.
 */

const MEASUREMENT_ID = 'G-CVWM3EXR7D';
const ADS_ID = 'AW-460760222';

/**
 * Conversion labels of the Google Ads actions: the part after the slash in
 * the action's event snippet, send_to: 'AW-460760222/<label>' (Google Ads >
 * Goals > Conversions > the action > Tag setup > Use Google tag).
 */
const ADS_CONVERSION_LABELS: Record<'beginCheckout' | 'purchase', string> = {
  beginCheckout: '',
  purchase: '',
};

const TAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
const PRODUCTION_HOSTS = new Set(['veysvakfi.org', 'www.veysvakfi.org']);
const OPT_OUT_FLAG = `ga-disable-${MEASUREMENT_ID}`;

/** The visitor's answer about advertising cookies, kept in this browser. */
const CONSENT_STORAGE_KEY = 'vkv-ads-consent';
/** After a year the visitor is asked again. */
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export type AdsConsent = 'granted' | 'denied';

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

/** Checkout and the bank's return page: only what the app sends itself goes out there. */
export function isPaymentPath(pathname: string): boolean {
  const path = pathname.toLowerCase().replace(/\/+$/, '');
  return path === '/donate/result' || path === '/donate/checkout' || path.startsWith('/donate/checkout/');
}

/** A checkout page: opening one is the start of a donation. */
function isCheckoutPath(pathname: string): boolean {
  return pathname.toLowerCase().replace(/\/+$/, '').startsWith('/donate/checkout/');
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
 * Google's opt-out flag for Analytics. gtag reads it when an event is queued,
 * so an event pushed while it is up is dropped and one pushed while it is
 * down is kept.
 */
function setOptOut(on: boolean): void {
  (window as unknown as Record<string, unknown>)[OPT_OUT_FLAG] = on;
}

/** The visitor's answer, or null when there is none (or it is more than a year old). */
function storedAdsConsent(): AdsConsent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { choice?: unknown; at?: unknown };
    if (saved.choice !== 'granted' && saved.choice !== 'denied') return null;
    if (typeof saved.at !== 'number' || Date.now() - saved.at > CONSENT_MAX_AGE_MS) return null;
    return saved.choice;
  } catch {
    return null;
  }
}

/** The three advertising signals of Consent Mode, all following the one answer. */
function adsSignals(choice: AdsConsent): Record<string, AdsConsent> {
  return { ad_storage: choice, ad_user_data: choice, ad_personalization: choice };
}

/** Clears the Ads tag's cookies (_gcl_*) when the visitor withdraws consent. */
function removeAdCookies(): void {
  const host = window.location.hostname;
  const site = host.split('.').slice(-2).join('.');
  const domains = ['', host, `.${host}`, `.${site}`];
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim() ?? '';
    if (!name.startsWith('_gcl_')) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
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
 * so not even an automatic Analytics history event gets through with the raw
 * URL (checkout links carry ?amount=). Registered before gtag.js loads, so
 * these listeners run ahead of the tag's own.
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

    // Consent first, before any tag is configured: visits are measured, and
    // the advertising signals follow the visitor's answer (denied until one is
    // given). Denied ad_user_data also keeps the tags' automatic user-provided
    // data detection off.
    gtag('consent', 'default', { analytics_storage: 'granted', ...adsSignals(storedAdsConsent() ?? 'denied') });
    // While advertising cookies are refused, ad-click identifiers are left out
    // of the Ads tag's pings as well.
    gtag('set', 'ads_data_redaction', true);
    gtag('js', new Date());
    // Every hit, including events the tag creates by itself, reports these
    // sanitized values instead of the raw address bar.
    gtag('set', {
      page_location: sanitizePageUrl(href),
      page_referrer: firstReferrer,
      page_title: scrubTitle(document.title, search),
    });
    gtag('config', MEASUREMENT_ID, { send_page_view: false });
    gtag('config', ADS_ID);

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

/** True while the tags run on this page and the visitor has not answered the consent banner. */
export function adsConsentPending(): boolean {
  return status === 'on' && storedAdsConsent() === null;
}

/** True while the tags run on this page, so the answer can be given or changed here. */
export function adsConsentAvailable(): boolean {
  return status === 'on';
}

/** Records the visitor's answer about advertising cookies and applies it at once. */
export function setAdsConsent(choice: AdsConsent): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ choice, at: Date.now() }));
  } catch {
    // Storage unavailable (private mode): the answer still applies to this page.
  }
  if (status !== 'on') return;
  try {
    gtag('consent', 'update', adsSignals(choice));
    if (choice === 'denied') removeAdCookies();
  } catch {
    // A tracking failure must never surface to visitors.
  }
}

/** Sends a Google Ads conversion when its label is set; nothing otherwise. */
function sendAdsConversion(action: keyof typeof ADS_CONVERSION_LABELS, params: Record<string, unknown>): void {
  const label = ADS_CONVERSION_LABELS[action].trim();
  if (!label) return;
  gtag('event', 'conversion', { send_to: `${ADS_ID}/${label}`, ...params });
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
        // Analytics only: the Ads tag counts pages itself.
        send_to: MEASUREMENT_ID,
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
      // Opening a checkout page counts as the start of a donation: to
      // Analytics with the same sanitized address and no amount, and to Google
      // Ads as a conversion once its label is set.
      if (isCheckoutPath(pathname)) {
        gtag('event', 'begin_checkout', {
          send_to: MEASUREMENT_ID,
          page_location: pageLocation,
          page_title: pageTitle,
        });
        sendAdsConversion('beginCheckout', {});
      }
      lastPageLocation = pageLocation;
    }

    setOptOut(onPaymentPage);
  } catch {
    // A tracking failure must never surface to visitors.
  }
}

/**
 * A reference for Google that cannot be turned back into the payment's own
 * reference. That one opens the donor's result page (name and amount) to
 * whoever holds it, so it never leaves the browser. The same payment always
 * gives the same value, which is all that is needed to count it once.
 */
async function donationReference(oid: string): Promise<string> {
  const bytes = new TextEncoder().encode(`owis-donation:${oid}`);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest).slice(0, 12), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** Resolves once gtag.js itself has loaded, or after five seconds at the latest. */
async function tagLoaded(): Promise<void> {
  const loaded = () => 'google_tag_manager' in window;
  for (let waited = 0; waited < 5000 && !loaded(); waited += 100) {
    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }
}

const reportedDonations = new Set<string>();

/**
 * One `purchase` for a donation the bank has confirmed, sent from the result
 * page to Analytics, and to Google Ads as a conversion once its label is set.
 * It carries the amount, its currency and the one-way reference: no name, no
 * contact detail, no payment reference. Reloading the result page does not
 * report the donation again.
 */
export function trackDonationPaid(payment: { oid: string; amount: number; currency: string; mode: string }): void {
  if (status !== 'on') return;
  if (payment.mode !== 'production') return;
  if (!Number.isFinite(payment.amount) || payment.amount <= 0) return;
  void (async () => {
    try {
      const reference = await donationReference(payment.oid);
      if (reportedDonations.has(reference)) return;
      reportedDonations.add(reference);
      const storageKey = `vkv-donation-reported:${reference}`;
      try {
        if (window.localStorage.getItem(storageKey)) return;
        window.localStorage.setItem(storageKey, '1');
      } catch {
        // Storage unavailable (private mode): this document still reports once.
      }
      // gtag reads the opt-out flag when it takes an event in, so the event is
      // handed over only once the tag is there to take it.
      await tagLoaded();
      if (status !== 'on') return;
      const { href, pathname, search } = window.location;
      const currency = payment.currency || 'USD';
      setOptOut(false);
      gtag('event', 'purchase', {
        send_to: MEASUREMENT_ID,
        transaction_id: reference,
        value: payment.amount,
        currency,
        page_location: sanitizePageUrl(href),
        page_title: scrubTitle(document.title, search),
      });
      sendAdsConversion('purchase', { transaction_id: reference, value: payment.amount, currency });
      setOptOut(isPaymentPath(pathname));
    } catch {
      // A tracking failure must never surface to visitors.
    }
  })();
}

/** The dashboard was opened in this tab: send nothing more from this document. */
export function stopAnalytics(): void {
  if (status === 'on') setOptOut(true);
  status = 'stopped';
}
