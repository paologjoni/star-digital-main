/* Re-captures the portfolio screenshots from the live sites.

   The originals were 1536px wide and 2.1:1 — a letterbox crop of a viewport.
   That is the wrong shape for the laptop, whose screen is 16:10, so the 3D
   scene had to crop a centred slice and ended up stretching about 1160px of
   texture across the panel. It looked exactly as soft as that sounds.

   So: shoot at the laptop's own aspect, and shoot far bigger than needed.
   Chrome renders the page at 3x device scale, and sharp then downsamples with
   Lanczos. The reduction is doing the work of a supersampling pass — text and
   hairlines come out cleaner than a native-resolution grab of the same page,
   because every output pixel is an average of nine rendered ones.

   Two derivatives per site, from one master:
     <key>-screen.webp  2048x1280  the texture the 3D laptop samples
     <key>.webp         1536x960   the <img> in the portfolio grid

   Puppeteer is deliberately not a package.json dependency — it drags a browser
   download that neither the build nor the deploy needs:

     npm install --no-save puppeteer
     node scripts/shoot-portfolio.mjs [--only=key] */

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

const OUT = 'public/assets/portfolio';

/* 16:10, matching the laptop panel. 3x of this is 4536x2835 off the browser. */
const SHOT = { width: 1512, height: 945, scale: 3 };

const SCREEN = { width: 2048, height: 1280, quality: 92 };
const CARD = { width: 1536, height: 960, quality: 88 };

/* `name` is the filename stem and is not always the portfolio key — the files
   predate the keys and the legacy .png/.jpg beside them are referenced by the
   structured data, so the stems stay put. */
const SITES = [
  { key: 'studio', name: 'studio', url: 'https://orthopedic-studio.vercel.app' },
  { key: 'candles', name: 'candles-auroma', url: 'https://candlesauroma.com' },
  { key: 'afa', name: 'afa-engineering-klima', url: 'https://afaengineeringklima.com' },
];

const only = process.argv
  .find((argument) => argument.startsWith('--only='))
  ?.slice('--only='.length);

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'shell',
  args: ['--hide-scrollbars', '--force-device-scale-factor=3'],
  protocolTimeout: 240_000,
});

/* Sites of this kind open on a hero animation and lazy-load their imagery. A
   networkidle wait alone catches the page mid-reveal, so also scroll the full
   height to trip any IntersectionObserver, come back to the top, and give the
   entry transitions time to land. */
async function settle(page) {
  /* Capped: only the top of the page is ever photographed, so this is just
     enough travel to trip the observers that govern it. One of these sites
     scrolls for tens of screens, and walking all of them ran past the CDP
     call timeout without improving the shot. */
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const limit = Math.min(document.body.scrollHeight, step * 12);
    for (let y = 0; y < limit; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });

  /* Raced against a deadline, and not optionally. An image that is lazy and
     still below the fold never fires either event, so an unbounded wait here
     hangs until the CDP call times out and the whole site is skipped — which
     is precisely what two of the three did. */
  await page.evaluate(async () => {
    const pending = Array.from(document.images).filter((image) => !image.complete);

    await Promise.race([
      Promise.all(
        pending.map((image) => new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        })),
      ),
      new Promise((resolve) => setTimeout(resolve, 8000)),
    ]);
  });

  try {
    await page.evaluate(() => document.fonts.ready);
  } catch {
    /* No font loading API, or no webfonts. Neither is a problem. */
  }

  await new Promise((resolve) => setTimeout(resolve, 1800));
}

for (const site of SITES) {
  const name = site.name ?? site.key;
  if (only && only !== site.key && only !== name) continue;

  console.log(`${name}  ${site.url}`);

  const page = await browser.newPage();
  await page.setViewport({
    width: SHOT.width,
    height: SHOT.height,
    deviceScaleFactor: SHOT.scale,
  });

  try {
    await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60_000 });
    await settle(page);

    const master = await page.screenshot({ type: 'png', captureBeyondViewport: false });
    const meta = await sharp(master).metadata();
    console.log(`  captured ${meta.width}x${meta.height}`);

    for (const [suffix, spec] of [
      ['-screen', SCREEN],
      ['', CARD],
    ]) {
      const file = path.join(OUT, `${name}${suffix}.webp`);
      /* `fit: cover` rather than a plain resize: the master is exactly 16:10
         already, so nothing is cropped — this only guards against a site that
         forces a taller layout and returns a longer shot. */
      const { size } = await sharp(master)
        .resize(spec.width, spec.height, {
          fit: 'cover',
          position: 'top',
          kernel: 'lanczos3',
        })
        .webp({ quality: spec.quality, effort: 6, smartSubsample: false })
        .toFile(file);

      console.log(`  ${file}  ${spec.width}x${spec.height}  ${(size / 1024).toFixed(0)}KB`);
    }
  } catch (error) {
    console.log(`  ! failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await page.close();
  }
}

await browser.close();
console.log('\nDone.');
