/* Content parity gate.

   Extracts the visible text (plus image alt text, which is content too) from
   each of the eight pre-rebuild HTML files and from the eight pages the new
   build serves, then compares them as multisets of normalised chunks.

   Reports both directions:
     MISSING — text the old site had and the new one does not. Always a bug.
     ADDED   — text the new site has and the old one did not. Must be empty
               too: the brief was to change the presentation, not the copy.

   Usage:  npm run build && npm start   (in one shell)
           npm run parity               (in another)
*/

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

/* The old contact form built its <select> options in JavaScript, so they are
   absent from the legacy HTML but present in the new server-rendered markup.
   They are the same strings, moved from js/i18n.js into the dictionaries. */
const RUNTIME_ONLY = new Set(
  [
    'Zgjidhni llojin e projektit',
    'Dizajn & Zhvillim Faqesh',
    'Landing Pages',
    'Dyqane Online',
    'Rikonstruktim Faqeje',
    'Mirëmbajtje Faqeje',
    'Zgjidhni buxhetin',
    'Nën €500',
    '€500–€1,500',
    '€1,500–€5,000',
    '€5,000+',
    'Nuk e di',
    'Dërgo Mesazhin',
    'Select project type',
    'Web Design & Development',
    'Ecom Store',
    'Website Redesign',
    'Website Maintenance',
    'Select budget range',
    'Under €500',
    'Not sure',
    'Send Message',
  ].map((s) => s.toLowerCase()),
);

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  apos: "'",
  nbsp: ' ',
  ldquo: '“',
  rdquo: '”',
  mdash: '—',
  ndash: '–',
};

function decode(text) {
  return text.replace(/&(#?\w+);/g, (match, entity) => {
    if (entity in ENTITIES) return ENTITIES[entity];
    if (entity.startsWith('#x')) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(parseInt(entity.slice(1), 10));
    return match;
  });
}

function normalise(text) {
  return decode(text)
    .replace(/\s+/g, ' ')
    .replace(/ /g, ' ')
    .trim();
}

/** Visible text nodes plus alt attributes: the chunks, and the whole stream.

   Both are needed. Comparing chunk-to-chunk alone produces false failures
   whenever markup boundaries move — the new hero splits its headline into
   per-word spans for the stagger, and the old site kept its mobile menu in
   the DOM permanently so every nav label appeared three times. Neither
   changes a word of what a reader sees. So each chunk is instead required to
   appear somewhere in the other page's full text stream. */
function extract(html) {
  const body = html.slice(html.indexOf('<body'));

  const alts = [...body.matchAll(/<img[^>]*\salt="([^"]*)"/g)]
    .map((match) => normalise(match[1]))
    .filter(Boolean);

  const stripped = body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<template[\s\S]*?<\/template>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const text = stripped
    .split(/<[^>]+>/)
    .map(normalise)
    .filter(Boolean);

  const chunks = new Set([...text, ...alts].map((chunk) => chunk.toLowerCase()));
  const stream = [...text, ...alts].join(' ').toLowerCase();

  return { chunks, stream };
}

function diff(before, after) {
  const missing = [...before.chunks].filter((chunk) => !after.stream.includes(chunk));

  const added = [...after.chunks].filter(
    (chunk) => !RUNTIME_ONLY.has(chunk) && !before.stream.includes(chunk),
  );

  return { missing, added };
}

let failures = 0;

for (const page of PAGES) {
  const legacyHtml = await readFile(join(ROOT, page.legacy), 'utf8');

  let liveHtml;
  try {
    const response = await fetch(`${BASE}${page.url}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    liveHtml = await response.text();
  } catch (error) {
    console.error(`✗ ${page.url}  could not fetch — is the server running? (${error.message})`);
    failures++;
    continue;
  }

  const { missing, added } = diff(extract(legacyHtml), extract(liveHtml));

  if (missing.length === 0 && added.length === 0) {
    console.log(`✓ ${page.url}`);
    continue;
  }

  failures++;
  console.log(`✗ ${page.url}`);
  for (const chunk of missing) console.log(`    MISSING: ${chunk}`);
  for (const chunk of added) console.log(`    ADDED:   ${chunk}`);
}

console.log(
  failures === 0
    ? '\nContent parity: all 8 pages match.'
    : `\nContent parity: ${failures} page(s) differ.`,
);

process.exit(failures === 0 ? 0 : 1);
