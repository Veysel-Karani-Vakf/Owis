// End-to-end check of the GA4 integration against the production build.
//
//   npm run build && npm run test:analytics
//
// dist/ is served as https://veysvakfi.org through Playwright routing, so the
// production-host gate in src/analytics/googleAnalytics.ts is exercised for
// real. gtag.js is Google's live tag for G-CVWM3EXR7D, but every GA hit is
// answered locally with 204 and GA hosts resolve to 127.0.0.1: no test data
// can reach the property. CMS content comes from the live Supabase (read-only);
// the payment API is mocked, so no payment is created.
import { existsSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');
const SITE = 'https://veysvakfi.org';
const GA_ID = 'G-CVWM3EXR7D';

// Distinctive values planted in URLs, the referrer and the donor form.
// None of them may appear in anything sent to Google.
const DONOR = { name: 'Testdonor Secretname', email: 'secret.donor@example.com', phone: '+905550001122' };
const PAID_OID = 'PAIDOID777';
const FORBIDDEN = [
  'amount=', '?oid', '&oid', 'oid=', 'error=', 'cmsPreview', 'TESTOID', 'FAKEOID', PAID_OID, 'AUTH777',
  'SECRETSESSION', 'est3Dgate', 'Secretname', 'secret.donor', '5550001122',
];

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/ is missing: run `npm run build` first.');
  process.exit(1);
}

let failures = 0;
function check(condition, message) {
  if (condition) {
    console.log(`  ok   ${message}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${message}`);
  }
}

// ---------------------------------------------------------------- GA capture

/** Every payload gtag tried to send, as { pageId, frameUrl, url, body }. */
const payloads = [];
/** gtag.js script requests, as { pageId, url }. */
const tagRequests = [];
const pageIds = new WeakMap();
let nextPageId = 1;

function idOf(page) {
  if (!page) return 0;
  if (!pageIds.has(page)) pageIds.set(page, nextPageId++);
  return pageIds.get(page);
}

function toEvents(payload) {
  const url = new URL(payload.url);
  const base = Object.fromEntries(url.searchParams.entries());
  const lines = String(payload.body || '').split(/\r?\n/).filter(Boolean);
  const rows = lines.length ? lines.map((line) => ({ ...base, ...Object.fromEntries(new URLSearchParams(line)) })) : [base];
  return rows.filter((row) => row.en).map((row) => ({ ...row, pageId: payload.pageId, frameUrl: payload.frameUrl }));
}

const events = () => payloads.flatMap(toEvents);
const pageViews = (pageId) => events().filter((e) => e.en === 'page_view' && e.pageId === pageId);

async function waitFor(predicate, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (predicate()) return true;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return predicate();
}

const settle = (ms = 7000) => new Promise((resolve) => setTimeout(resolve, ms));

// Records payloads in the page before they leave (fetch and sendBeacon bodies
// are not reliably visible to request interception).
const HOOK = `(() => {
  const report = (url, body) => {
    try {
      const u = String(url);
      if (!/\\/g\\/collect/.test(u) || u.includes('doubleclick')) return;
      window.__gaHit(u, typeof body === 'string' ? body : body == null ? '' : String(body));
    } catch {}
  };
  const beacon = navigator.sendBeacon.bind(navigator);
  navigator.sendBeacon = (url, body) => { report(url, body); return beacon(url, body); };
  const f = window.fetch.bind(window);
  window.fetch = (input, init) => { report(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, init && init.body); return f(input, init); };
})();`;

// ------------------------------------------------------------- mocked site

const mock = { createBodies: [], gatePosts: [] };

function json(route, status, body) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}

async function serveSite(route, url) {
  const request = route.request();
  const { pathname } = url;

  if (pathname === '/api/payments/config') {
    return json(route, 200, { ok: true, mode: 'test', currency: 'USD', minAmount: 1, maxAmount: 500000, presets: [100, 250, 500] });
  }
  if (pathname === '/api/payments/status') {
    if (url.searchParams.get('oid') !== PAID_OID) return json(route, 404, { ok: false });
    return json(route, 200, {
      ok: true,
      payment: {
        oid: PAID_OID, status: 'paid', amount: 75, currency: 'USD', opportunitySlug: null, opportunityTitle: null,
        donorName: DONOR.name, authCode: 'AUTH777', errorMessage: null, mode: 'test', createdAt: new Date().toISOString(),
      },
    });
  }
  if (pathname === '/api/payments/create') {
    mock.createBodies.push(request.postData() || '');
    return json(route, 200, { ok: true, oid: 'TESTOID-CREATED', gateUrl: `${SITE}/__test-gate`, fields: { clientid: 'test-client', oid: 'TESTOID-CREATED' } });
  }
  if (pathname.startsWith('/api/')) return json(route, 404, { ok: false });
  if (pathname === '/__test-gate') {
    mock.gatePosts.push({ method: request.method(), body: request.postData() || '' });
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>gate</title><p>test gate</p>' });
  }
  if (pathname === '/__frame-test') {
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><title>frame test</title><iframe id="f" src="/news" style="width:1200px;height:800px"></iframe>',
    });
  }

  const file = normalize(join(DIST, decodeURIComponent(pathname)));
  if (file.startsWith(DIST) && existsSync(file) && statSync(file).isFile()) return route.fulfill({ path: file });
  return route.fulfill({ path: join(DIST, 'index.html'), contentType: 'text/html' }); // SPA rewrite, as vercel.json
}

// ----------------------------------------------------------------- browser

async function launch() {
  const options = {
    args: [
      '--host-resolver-rules=MAP *.google-analytics.com 127.0.0.1, MAP analytics.google.com 127.0.0.1, ' +
        'MAP *.doubleclick.net 127.0.0.1, MAP www.google.com 127.0.0.1, MAP www.google.com.tr 127.0.0.1',
    ],
  };
  try {
    return await chromium.launch(options);
  } catch {
    return chromium.launch({ ...options, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  }
}

const browser = await launch();

async function newContext() {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, serviceWorkers: 'block' });
  await ctx.exposeBinding('__gaHit', (source, url, body) => {
    payloads.push({ pageId: idOf(source.page), frameUrl: source.frame.url(), url, body });
  });
  await ctx.addInitScript(HOOK);
  ctx.on('request', (request) => {
    const url = request.url();
    if (url.startsWith('https://www.googletagmanager.com/gtag/js')) {
      tagRequests.push({ pageId: idOf(request.frame()?.page()), url, frameUrl: request.frame()?.url() });
    }
  });
  await ctx.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === SITE) return serveSite(route, url);
    if (url.pathname.includes('/g/collect')) return route.fulfill({ status: 204, body: '' });
    if (url.hostname === 'www.googletagmanager.com') return route.continue();
    if (/(^|\.)(google\.com|google\.com\.tr|doubleclick\.net|googlesyndication\.com|googleadservices\.com)$/.test(url.hostname)) {
      return route.fulfill({ status: 204, body: '' });
    }
    // Keep the run light: no video, no third-party images.
    if (/youtube|ytimg|googlevideo|wa\.me|whatsapp/.test(url.hostname)) return route.abort();
    if (['image', 'media'].includes(route.request().resourceType())) return route.abort();
    return route.continue();
  });
  return ctx;
}

async function openPage(ctx, path, options) {
  const page = await ctx.newPage();
  idOf(page);
  await page.goto(`${SITE}${path}`, { waitUntil: 'domcontentloaded', ...options });
  return page;
}

/** Client-side navigation the way a visitor triggers it: a click on a router link. */
async function clickLink(page, selector) {
  const link = page.locator(selector).first();
  await link.waitFor({ state: 'attached', timeout: 30000 });
  await link.dispatchEvent('click', { button: 0 });
}

/** Navigation the router performs without a link (e.g. a redirect entry). */
async function routerGo(page, path) {
  await page.evaluate((target) => {
    window.history.pushState(null, '', target);
    window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
  }, path);
}

const optOut = (page) => page.evaluate((id) => window[`ga-disable-${id}`] === true, GA_ID);

// ------------------------------------------------------------------- tests

const ctx = await newContext();

console.log('\n1. Initial homepage page view');
const home = await openPage(ctx, '/');
const homeId = idOf(home);
await waitFor(() => pageViews(homeId).length > 0);
await settle();
{
  const views = pageViews(homeId);
  check(tagRequests.some((r) => r.pageId === homeId), 'gtag.js requested once the public page booted');
  check(tagRequests.filter((r) => r.pageId === homeId).length === 1, 'gtag.js loaded only once');
  check(views.length === 1, `exactly one page_view (got ${views.length})`);
  check(views[0]?.dl === `${SITE}/`, `page_location is ${SITE}/ (got ${views[0]?.dl})`);
  check(Boolean(views[0]?.dt), `page_title present ("${views[0]?.dt}")`);
  const wrapped = await home.evaluate(() => !String(window.history.pushState).includes('[native code]'));
  console.log(`  info Enhanced Measurement history hook active in this tag build: ${wrapped}`);
}

console.log('\n2. Navigation between public routes (no reload)');
await clickLink(home, 'a[href="/news"]');
await waitFor(() => pageViews(homeId).some((e) => e.dl === `${SITE}/news`));
await clickLink(home, 'a[href="/projects"]');
await waitFor(() => pageViews(homeId).some((e) => e.dl === `${SITE}/projects`));
await home.goBack();
await waitFor(() => pageViews(homeId).filter((e) => e.dl === `${SITE}/news`).length >= 2);
await settle();
{
  const views = pageViews(homeId).map((e) => `${e.dl.replace(SITE, '')} <- ${(e.dr || '(none)').replace(SITE, '')}`);
  console.log(`  info sequence: ${views.join(' | ')}`);
  const expected = ['/ <- (none)', '/news <- /', '/projects <- /news', '/news <- /projects'];
  check(JSON.stringify(views) === JSON.stringify(expected), 'one page_view per navigation, referrer = previous page (incl. back button)');
}

console.log('\n3. No duplicate page views and redirects count only their target');
await routerGo(home, '/about/administrative-structure');
await waitFor(() => pageViews(homeId).some((e) => e.dl === `${SITE}/about/structure`));
await settle();
{
  const views = pageViews(homeId);
  check(!views.some((e) => e.dl.includes('administrative-structure')), 'redirect source /about/administrative-structure not reported');
  check(views.filter((e) => e.dl === `${SITE}/about/structure`).length === 1, 'redirect target /about/structure reported once');
  const perStep = views.map((e) => e.dl);
  const doubles = perStep.filter((dl, i) => i > 0 && perStep[i - 1] === dl);
  check(doubles.length === 0, 'no back-to-back duplicate page_view');
}
for (const [path, target] of [['/no-such-page-xyz', '/'], ['/participate', '/participate/share-ideas']]) {
  const page = await openPage(ctx, path);
  const id = idOf(page);
  await waitFor(() => pageViews(id).length > 0);
  await settle(5000);
  const dls = pageViews(id).map((e) => e.dl.replace(SITE, ''));
  check(JSON.stringify(dls) === JSON.stringify([target]), `full load of ${path} reports only ${target} (got ${JSON.stringify(dls)})`);
  await page.close();
}

console.log('\n4. No tracking inside /admin');
{
  const admin = await openPage(ctx, '/admin');
  const id = idOf(admin);
  await settle(9000);
  check(!tagRequests.some((r) => r.pageId === id), 'gtag.js never requested on /admin');
  check(!events().some((e) => e.pageId === id), 'no GA event from /admin');
  check(await admin.evaluate(() => typeof window.gtag === 'undefined' && typeof window.dataLayer === 'undefined'), 'no gtag/dataLayer on the dashboard');
  await admin.close();

  // A public tab that moves into the dashboard stops reporting.
  const before = events().filter((e) => e.pageId === homeId).length;
  await routerGo(home, '/admin');
  await settle(8000);
  check(events().filter((e) => e.pageId === homeId).length === before, 'public tab sends nothing after entering /admin');
  check(await optOut(home), 'opt-out flag raised for the rest of that tab');
  await home.close();
}

console.log('\n5. No tracking inside CMS preview frames');
{
  const preview = await openPage(ctx, '/?cmsPreview=1&cmsLocale=ar');
  const id = idOf(preview);
  await settle(9000);
  check(!tagRequests.some((r) => r.pageId === id), 'gtag.js never requested with ?cmsPreview=1');
  check(!events().some((e) => e.pageId === id), 'no GA event from the preview document');
  await preview.close();

  const host = await openPage(ctx, '/__frame-test');
  const id2 = idOf(host);
  const frame = host.frameLocator('#f');
  await frame.locator('a[href="/projects"]').first().waitFor({ state: 'attached', timeout: 30000 });
  await frame.locator('a[href="/projects"]').first().dispatchEvent('click', { button: 0 });
  await settle(9000);
  check(!tagRequests.some((r) => r.pageId === id2), 'gtag.js never requested inside a frame (also after in-frame navigation)');
  check(!events().some((e) => e.pageId === id2), 'no GA event from the framed site');
  await host.close();
}

console.log('\n6. Donation URLs are sanitized; 8. checkout still works');
{
  const donate = await openPage(ctx, '/donate');
  const id = idOf(donate);
  await waitFor(() => pageViews(id).some((e) => e.dl === `${SITE}/donate`));
  const href = await donate
    .locator('a[href^="/donate/checkout/"]')
    .first()
    .getAttribute('href', { timeout: 30000 })
    .catch(() => null);
  check(Boolean(href), `donate page links to a checkout (${href})`);
  const slugPath = href ? new URL(href, SITE).pathname : '/donate/checkout/waqf-share';
  if (href) {
    await clickLink(donate, `a[href="${href}"]`);
    await waitFor(() => pageViews(id).some((e) => e.dl.startsWith(`${SITE}/donate/checkout/`)));
    await settle(3000);
    const view = pageViews(id).find((e) => e.dl.startsWith(`${SITE}/donate/checkout/`));
    check(view?.dl === `${SITE}${slugPath}`, `in-app checkout page_view has no query (${view?.dl}; link was ${href})`);
    check(await optOut(donate), 'automatic collection blocked on the checkout page');

    // The donor form: only our own API sees the details, then the bank hand-over.
    const amount = donate.locator('#custom-amount');
    if ((await amount.inputValue().catch(() => '')) === '') await amount.fill('75');
    await donate.fill('#donor-name', DONOR.name);
    await donate.fill('#donor-email', DONOR.email);
    await donate.fill('#donor-phone', DONOR.phone);
    await donate.locator('#cms-checkout-form input[type="checkbox"]').first().check();
    await donate.locator('#cms-checkout-form button[type="submit"]').first().click();
    await waitFor(() => mock.gatePosts.length > 0, 20000);
    check(mock.createBodies.some((b) => b.includes(DONOR.email)), 'checkout still sends the donor details to /api/payments/create');
    check(mock.gatePosts[0]?.method === 'POST' && mock.gatePosts[0]?.body.includes('clientid=test-client'), 'checkout still POSTs the signed fields to the bank gate');
  }
  await donate.close();

  const cases = [
    [`${slugPath}?amount=75&oid=FAKEOID999`, slugPath, undefined],
    ['/donate/result?oid=TESTOID123&error=verify&amount=99', '/donate/result', 'https://sanalpos.isbank.com.tr/fim/est3Dgate?session=SECRETSESSION'],
    ['/donate/result?error=unknown', '/donate/result', undefined],
  ];
  for (const [path, expected, referer] of cases) {
    const page = await openPage(ctx, path, referer ? { referer } : undefined);
    const pid = idOf(page);
    await waitFor(() => pageViews(pid).length > 0);
    await settle(5000);
    const views = pageViews(pid);
    check(views.length === 1 && views[0].dl === `${SITE}${expected}`, `full load of ${path} -> page_location ${expected} (got ${views.map((v) => v.dl).join(', ')})`);
    if (referer) {
      check(views[0]?.dr === 'https://sanalpos.isbank.com.tr/', `bank referrer reduced to its origin (got ${views[0]?.dr})`);
      check(views[0]?.ir === '1' || views[0]?.['ep.ignore_referrer'] === 'true', `return from the bank flagged ignore_referrer (params: ${Object.keys(views[0] || {}).join(',')})`);
    }
    check(!(views[0]?.dt || '').match(/TESTOID|FAKEOID|amount|oid/i), `page_title carries no query value ("${views[0]?.dt}")`);
    await page.close();
  }

  const paid = await openPage(ctx, `/donate/result?oid=${PAID_OID}`);
  const pid = idOf(paid);
  await waitFor(() => pageViews(pid).length > 0);
  const receipt = paid.locator('a[href*="text="]').first();
  const receiptHref = await receipt.getAttribute('href', { timeout: 20000 }).catch(() => null);
  if (receiptHref) {
    check(decodeURIComponent(receiptHref).includes(DONOR.name), 'WhatsApp receipt link unchanged (still carries the donor name for the donor)');
    await receipt.click({ modifiers: [] }).catch(() => undefined);
    await paid.locator('body').press('End').catch(() => undefined);
  } else {
    console.log('  info no WhatsApp contact configured: receipt link not rendered, click skipped');
  }
  await settle(8000);
  const sent = events().filter((e) => e.pageId === pid).map((e) => e.en);
  check(JSON.stringify(sent) === '["page_view"]', `result page sends only its page_view (got ${JSON.stringify(sent)})`);
  await paid.close();
}

console.log('\n7. Nothing sensitive in any analytics request');
{
  const raw = payloads.map((p) => {
    let text = `${p.url}\n${p.body}`;
    for (let i = 0; i < 2; i += 1) {
      try {
        text = decodeURIComponent(text);
      } catch {
        break;
      }
    }
    return text;
  });
  console.log(`  info ${payloads.length} payloads / ${events().length} events captured`);
  for (const token of FORBIDDEN) {
    check(!raw.some((text) => text.includes(token)), `no "${token}" sent`);
  }
  check(!events().some((e) => 'em' in e || Object.keys(e).some((k) => k.startsWith('up.') && /mail|phone/i.test(k))), 'no user-provided data (em) attached to any event');
  const kinds = [...new Set(events().map((e) => e.en))];
  console.log(`  info event names seen: ${kinds.join(', ')}`);
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed.` : '\nAll analytics checks passed.');
process.exit(failures ? 1 : 0);
