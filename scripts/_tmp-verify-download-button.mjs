import { chromium } from 'playwright';

const expected = {
  ar: '191M9qTsUhtp9Shstf4xJbEYC-iSzXpmD',
  en: '19VislWASMpd284pQYi4yffnn4AZeMepS',
  tr: '1nRlkSmZHcVKgCucV9UHoCEPYdgJYd-Z6',
};

const browser = await chromium.launch();
for (const locale of ['ar', 'en', 'tr']) {
  const context = await browser.newContext();
  await context.addInitScript(
    (loc) => window.localStorage.setItem('veysel-karani-locale', loc),
    locale,
  );
  const page = await context.newPage();
  await page.goto('http://localhost:5173/about/waqf', { waitUntil: 'networkidle' });
  const anchor = page.locator('#cms-about-waqf-intro a[href*="drive.google.com"]').first();
  await anchor.waitFor({ timeout: 15000 });
  const href = await anchor.getAttribute('href');
  const label = (await anchor.innerText()).trim().replace(/\s+/g, ' ');
  const ok = href?.includes(expected[locale]) ? 'OK' : 'WRONG FILE';
  console.log(`${locale}: [${ok}] "${label}" -> ${href}`);
  await context.close();
}
await browser.close();
