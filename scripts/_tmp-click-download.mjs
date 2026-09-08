import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext();
await context.addInitScript(() => window.localStorage.setItem('veysel-karani-locale', 'tr'));
const page = await context.newPage();
await page.goto('http://localhost:5173/about/waqf', { waitUntil: 'domcontentloaded' });

const anchor = page.locator('#cms-about-waqf-intro a[href*="drive.google.com"]').first();
await anchor.waitFor({ timeout: 15000 });
const href = await anchor.getAttribute('href');
const target = await anchor.getAttribute('target');
console.log(`button href: ${href}`);
console.log(`target: ${target}`);

const [popup] = await Promise.all([
  context.waitForEvent('page', { timeout: 15000 }).catch(() => null),
  anchor.click(),
]);
const opened = popup ?? page;
await opened.waitForLoadState('domcontentloaded');
await opened.waitForTimeout(3000);
console.log(`opened url: ${opened.url()}`);
console.log(`opened title: ${await opened.title()}`);
await browser.close();
