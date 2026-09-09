# Star Digital website

The Star Digital site, rebuilt in September 2026 as a scroll-driven film on
desktop and a stills-only "flight log" on phones. This repository holds the
**static build** that gets deployed: plain HTML per route plus the client
bundle and assets. No framework, no build step, no server.

## Routes

English at the root, Albanian under `/sq`, German under `/de`:

- `/`, `/contact`, `/work/orthopedic-studio`, `/work/candles-auroma`,
  `/work/afa-engineering-klima`
- the same five under `/sq` and `/de`
- `sitemap.xml` (all 15 URLs), `robots.txt`, `404.html`

Canonical URLs and `hreflang` links point at `https://stardigital.app`.
The contact form posts to Formspree straight from the browser.

## Hosting

- **Vercel**: `vercel.json` sets `framework: null` (static, no build), clean
  URLs without trailing slashes, and cache headers. If the project was created
  as a Next.js project, no dashboard change is needed; the file overrides it.
- **Apache / cPanel**: upload everything including the hidden `.htaccess`.
- **Netlify, Cloudflare Pages, GitHub Pages**: upload as-is.

The desktop film is five 1080p legs, about 46 MB in total, fetched only on
mouse-driven screens wider than 860 px. Phones download about 340 KB of
stills instead.

## Source

The site is authored on the Higgsfield website builder (React 19, TanStack
Start, Vite). The source lives in that project's git repository, not here.
To regenerate this folder after a change to the source:

```bash
cd app && bun run export:static
```

then copy the contents of `static-export/` over this repository and commit.
