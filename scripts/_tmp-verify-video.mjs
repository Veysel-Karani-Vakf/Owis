import { chromium } from 'playwright';

const expected = { ar: 'dvDQGL8IWX8', en: 'STmMVySqqtg', tr: 'DPY--Zs7Ero' };

const browser = await chromium.launch();
for (const locale of ['ar', 'en', 'tr']) {
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  await context.addInitScript(
    (loc) => window.localStorage.setItem('veysel-karani-locale', loc),
    locale,
  );
  const page = await context.newPage();
  await page.goto('http://localhost:5173/about/waqf#cms-about-waqf-video', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  let src = null;
  for (let i = 0; i < 10 && !src; i++) {
    await page.evaluate(() =>
      document.querySelector('#cms-about-waqf-video')?.scrollIntoView({ block: 'center' }),
    );
    await page.waitForTimeout(1500);
    src = await page.evaluate(
      () => document.querySelector('#cms-about-waqf-video iframe')?.src ?? null,
    );
  }
  const ok = src?.includes(expected[locale]) ? 'OK' : 'WRONG VIDEO';
  console.log(`${locale}: [${ok}] embed -> ${src}`);
  await context.close();
}
await browser.close();
