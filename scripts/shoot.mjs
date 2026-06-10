import { chromium } from 'playwright';

const URL = 'http://localhost:8080';
const OUT = '/tmp/shots';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/01-landing.png`, fullPage: true });
console.log('shot landing');

// run a search
await page.locator('input[type="text"]').first().fill('a bold structured red for a steak dinner');
await page.locator('button[type="submit"]').first().click();
// wait for the result card (the "Another" reshuffle button only appears with a result)
await page.getByText('Another', { exact: false }).waitFor({ timeout: 35000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/02-winecard.png`, fullPage: true });
// also a viewport-only shot to see what fits without scrolling
await page.screenshot({ path: `${OUT}/02b-winecard-viewport.png`, fullPage: false });
console.log('shot winecard');

await browser.close();
console.log('done');
