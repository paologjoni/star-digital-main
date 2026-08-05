/* Screenshot harness for visual verification.

   Drives the real site in headless Chrome with WebGL enabled and captures
   the homepage at several scroll depths, so the laptop choreography can be
   inspected frame by frame rather than assumed to work.

   Puppeteer is intentionally not a dependency — it pulls a browser download
   that nothing in the build or the deploy needs. Install it when you want to
   look at something:

     npm install --no-save puppeteer
     npm run build && npm start
     node scripts/shoot.mjs [outDir] */

import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer';

const BASE = process.env.PARITY_BASE ?? 'http://localhost:3000';
const OUT = process.argv[2] ?? 'shots';

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'shell',
  args: [
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--hide-scrollbars',
  ],
});

async function shoot(page, name) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`  ${name}.png`);
}

/* Desktop: hero, then the laptop stage at four depths, then the CTA. */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  console.log('desktop /');
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await shoot(page, '01-hero');

  const height = await page.evaluate(() => document.body.scrollHeight);
  const stops = [0.16, 0.3, 0.44, 0.58, 0.74, 0.9];

  for (const [i, stop] of stops.entries()) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), height * stop);
    await shoot(page, `0${i + 2}-scroll-${Math.round(stop * 100)}`);
  }

  console.log('desktop /about, /services, /contact');
  for (const [name, path] of [
    ['08-about', '/about'],
    ['09-services', '/services'],
    ['10-contact', '/contact'],
  ]) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' });
    await shoot(page, name);
  }

  if (errors.length) {
    console.log('\nConsole errors:');
    for (const error of [...new Set(errors)]) console.log(`  ! ${error}`);
  } else {
    console.log('\nNo console errors.');
  }

  await page.close();
}

/* Mobile: must fall back to the poster, never boot the laptop canvas. */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });

  console.log('mobile /');
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await shoot(page, '11-mobile-hero');

  const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
  console.log(`  canvases on mobile: ${canvases} (expected 0)`);

  await page.close();
}

/* Reduced motion: also no canvas anywhere. */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ]);

  console.log('reduced-motion /');
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await shoot(page, '12-reduced-motion');

  const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
  console.log(`  canvases with reduced motion: ${canvases} (expected 0)`);

  await page.close();
}

await browser.close();
console.log('\nDone.');
