import { chromium } from 'playwright';

const URL = 'http://localhost:8080';
const OUT = '/tmp/shots';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// --- log in as member ---
await page.goto(URL, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /member sign in/i }).click();
await page.locator('#email').fill('member@demo.test');
await page.locator('#password').fill('uncorked2026');
await page.getByRole('button', { name: /^sign in$/i }).click();
await page.waitForTimeout(2500); // let auth + member picks query resolve
// scroll to exclusive picks
await page.getByText('Exclusive Picks').scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/03-memberpicks.png`, fullPage: true });
console.log('shot member picks');

// --- compare page ---
await page.goto(`${URL}/compare`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.getByRole('button', { name: /^compare$/i }).click();
// wait for both panels to print timings (look for 'total')
await page.getByText('total').first().waitFor({ timeout: 40000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/04-compare.png`, fullPage: true });
console.log('shot compare');

await browser.close();
console.log('done');
