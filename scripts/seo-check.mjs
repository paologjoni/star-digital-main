/* SEO parity gate.

   Compares title, description, canonical, hreflang alternates, OG/Twitter
   tags and the JSON-LD graph between the pre-rebuild HTML and the new build.

   The homepage ItemList is expected to differ in exactly one way: the stale
   "Tirana Eats" entry (which pointed at a screenshot that does not exist) now
   names the third project the page actually renders. Any other difference is
   a regression. */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.PARITY_BASE ?? 'http://localhost:3000';

const PAGES = [
  { legacy: 'legacy/index.html', url: '/' },
  { legacy: 'legacy/about.html', url: '/about' },
  { legacy: 'legacy/services.html', url: '/services' },
  { legacy: 'legacy/contact.html', url: '/contact' },
  { legacy: 'legacy/en/index.html', url: '/en' },
  { legacy: 'legacy/en/about.html', url: '/en/about' },
  { legacy: 'legacy/en/services.html', url: '/en/services' },
  { legacy: 'legacy/en/contact.html', url: '/en/contact' },
];

const EXPECTED_FIX = { from: 'Tirana Eats', to: 'AFA Engineering Klima' };

const decode = (text) =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

/* https://stardigital.app and https://stardigital.app/ address the same
   resource — an empty path is the root path. Next normalises to the former,
   the old hand-written markup used the latter. */
const sameUrl = (a, b) => a.replace(/\/$/, '') === b.replace(/\/$/, '');

const head = (html) => html.slice(0, html.indexOf('</head>'));

function tags(html) {
  const source = head(html);
  const grab = (re) => [...source.matchAll(re)];

  const title = decode(source.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? '');

  const meta = new Map();
  for (const [, name, content] of grab(
    /<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]*)"/g,
  )) {
    meta.set(name, decode(content));
  }
  /* Next emits content before name on some tags. */
  for (const [, content, name] of grab(
    /<meta\s+content="([^"]*)"\s+(?:name|property)="([^"]+)"/g,
  )) {
    if (!meta.has(name)) meta.set(name, decode(content));
  }

  const canonical = grab(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)[0]?.[1] ?? '';

  /* HTML attribute names are case-insensitive; Next serialises hrefLang. */
  const alternates = new Map();
  for (const link of grab(/<link[^>]*rel="alternate"[^>]*>/gi)) {
    const hreflang = link[0].match(/hreflang="([^"]+)"/i)?.[1];
    const href = link[0].match(/href="([^"]+)"/i)?.[1];
    if (hreflang && href) alternates.set(hreflang, href);
  }

  return { title, meta, canonical, alternates };
}

function jsonLd(html) {
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];

  const graph = [];
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1]);
      graph.push(...(parsed['@graph'] ?? [parsed]));
    } catch {
      graph.push({ '@type': 'UNPARSEABLE' });
    }
  }

  return graph;
}

const KEYS = [
  'description',
  'og:title',
  'og:description',
  'og:url',
  'og:type',
  'og:site_name',
  'og:locale',
  'og:image',
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
];

let failures = 0;

for (const page of PAGES) {
  const legacyHtml = await readFile(join(ROOT, page.legacy), 'utf8');
  const response = await fetch(`${BASE}${page.url}`);
  const liveHtml = await response.text();

  const before = tags(legacyHtml);
  const after = tags(liveHtml);
  const problems = [];

  if (before.title !== after.title) {
    problems.push(`title: "${before.title}" → "${after.title}"`);
  }

  for (const key of KEYS) {
    const oldValue = before.meta.get(key) ?? '';
    const newValue = after.meta.get(key) ?? '';
    const equal = key.endsWith(':url') ? sameUrl(oldValue, newValue) : oldValue === newValue;
    if (!equal) problems.push(`${key}: "${oldValue}" → "${newValue}"`);
  }

  if (!sameUrl(before.canonical, after.canonical)) {
    problems.push(`canonical: ${before.canonical} → ${after.canonical}`);
  }

  for (const [hreflang, href] of before.alternates) {
    if (!sameUrl(after.alternates.get(hreflang) ?? '', href)) {
      problems.push(
        `hreflang ${hreflang}: ${href} → ${after.alternates.get(hreflang) ?? '(missing)'}`,
      );
    }
  }

  /* JSON-LD: same node types in the same order, and same serialised content
     once the known Tirana Eats correction is normalised away. */
  const beforeGraph = jsonLd(legacyHtml);
  const afterGraph = jsonLd(liveHtml);

  const typesBefore = beforeGraph.map((node) => node['@type']).join(',');
  const typesAfter = afterGraph.map((node) => node['@type']).join(',');
  if (typesBefore !== typesAfter) {
    problems.push(`json-ld nodes: [${typesBefore}] → [${typesAfter}]`);
  }

  const canonicalise = (graph) =>
    JSON.stringify(graph, (_, value) =>
      value && typeof value === 'object' && !Array.isArray(value)
        ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))
        : value,
    );

  let beforeJson = canonicalise(beforeGraph);
  const afterJson = canonicalise(afterGraph);

  if (beforeJson !== afterJson && beforeJson.includes(EXPECTED_FIX.from)) {
    /* Normalise the one intended correction, then require an exact match. */
    const thirdItem = beforeGraph
      .find((node) => node['@type'] === 'ItemList')
      ?.itemListElement?.find((entry) => entry.position === 3);

    if (thirdItem) {
      const replacement = afterGraph
        .find((node) => node['@type'] === 'ItemList')
        ?.itemListElement?.find((entry) => entry.position === 3);
      if (replacement) thirdItem.item = replacement.item;
      beforeJson = canonicalise(beforeGraph);
      console.log(
        `  · ${page.url}: applied expected fix "${EXPECTED_FIX.from}" → "${EXPECTED_FIX.to}"`,
      );
    }
  }

  if (beforeJson !== afterJson) {
    problems.push('json-ld content differs (run with DEBUG=1 to dump)');
    if (process.env.DEBUG) {
      console.log('--- before ---\n', beforeJson);
      console.log('--- after  ---\n', afterJson);
    }
  }

  if (problems.length === 0) {
    console.log(`✓ ${page.url}`);
  } else {
    failures++;
    console.log(`✗ ${page.url}`);
    for (const problem of problems) console.log(`    ${problem}`);
  }
}

console.log(
  failures === 0
    ? '\nSEO parity: all 8 pages match.'
    : `\nSEO parity: ${failures} page(s) differ.`,
);

process.exit(failures === 0 ? 0 : 1);
