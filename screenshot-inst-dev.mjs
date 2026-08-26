import { chromium } from "playwright";

async function screenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:5173/programs/institutional-development", { waitUntil: "networkidle" });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: "institutional-dev-screenshot.png", fullPage: true });
  await browser.close();
  console.log("Screenshot saved");
}

screenshot().catch(e => console.error(e));
