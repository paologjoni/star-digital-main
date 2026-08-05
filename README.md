# Star Digital

Bilingual agency site. Next.js 16 (App Router), TypeScript, Tailwind v4,
react-three-fiber. Every page is statically rendered — no server functions,
no image transforms — so it runs inside Vercel's Hobby tier.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # expect 8 static pages, 0 dynamic
npm run lint         # tsc --noEmit
```

## URLs

Albanian is served from the bare paths, English from `/en`. Internally every
page lives under `app/[lang]`; four explicit rewrites in `next.config.ts` map
the Albanian URLs onto the `sq` branch, and `/sq/*` 308s away so each page has
exactly one canonical address.

| Albanian | English |
|---|---|
| `/` | `/en` |
| `/about` | `/en/about` |
| `/services` | `/en/services` |
| `/contact` | `/en/contact` |

## Content

All copy lives in `content/sq.ts` and `content/en.ts`. Both satisfy the
`Dictionary` interface in `content/types.ts`, so adding a string to one
language without the other is a compile error. Language-independent data —
project URLs, accent colours, screenshot paths, tech tags — is in
`content/shared.ts`, keyed identically. Metadata and JSON-LD are generated in
`content/seo.ts`.

**Edit copy in the dictionaries, never in a component.**

## Verification

The site was rebuilt from a previous hand-written HTML version, which is kept
under `legacy/` as the fixture for two gates. Both must pass.

```bash
npm run build && npm start     # one shell
npm run parity                 # another: visible text + alt attributes
node scripts/seo-check.mjs     #          titles, canonicals, hreflang, JSON-LD
```

`parity-check.mjs` compares old and new in **both** directions — text that
went missing is a bug, and so is text that appeared, because the rebuild was
supposed to change the presentation and nothing else.

Copy deliberately added since then is listed in `INTENTIONAL_ADDITIONS` at the
top of that script (currently the fourteen skills added to `/about`). Add to
that list when you add copy on purpose, so the gate keeps failing on
everything you did not.

`seo-check.mjs` allows exactly one intended difference: the homepage
`ItemList` used to advertise "Tirana Eats", pointing at a screenshot that does
not exist, while the page rendered AFA Engineering Klima. The structured data
now matches the page.

`scripts/shoot.mjs` drives headless Chrome to screenshot the scroll scene and
assert the mobile and reduced-motion fallbacks render no canvas. It needs
`npm install --no-save puppeteer` first.

## The 3D

`components/home/LaptopScene.tsx` is a pinned scroll region; the laptop in
`components/three/Laptop.tsx` is built from primitives, not a GLB. It opens,
turns and cycles the three real portfolio screenshots onto its screen.

Two rules hold everywhere:

1. **Nothing that is content lives only inside a canvas.** WebGL text is
   invisible to crawlers and screen readers. The skill orbit on `/about` is
   projection maths applied to real DOM chips; the laptop is decorative and
   the projects it shows are rendered as `<img>` in the grid below it.
2. **WebGL is opt-in per visitor.** `lib/useCapability.ts` clears it only for
   wide viewports with more than four cores and no reduced-motion preference.
   three.js is additionally deferred behind a scroll threshold, so the initial
   payload is ~210KB of JS and the ~300KB WebGL chunk is fetched only once a
   visitor starts scrolling. Phones and reduced-motion never load it at all.
