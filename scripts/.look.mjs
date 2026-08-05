import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer';

const OUT = process.argv[2];
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'shell',
  args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--hide-scrollbars'],
  protocolTimeout: 240000,
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle2', timeout: 60000 });

const height = await page.evaluate(() => document.body.scrollHeight);
for (const stop of [0.18, 0.26, 0.34]) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), height * stop);
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: `${OUT}/s${Math.round(stop * 100)}.png` });
  console.log('shot', stop);
}

console.log(errors.length ? [...new Set(errors)].join('\n') : 'no console errors');
await browser.close();
