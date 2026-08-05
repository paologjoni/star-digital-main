/* Language-independent data. Keyed by the same identifiers the dictionaries
   use, so a portfolio project's URL/colour/screenshot lives here exactly once
   while its badge/title/description live in sq.ts and en.ts. */

import type { Lang, PortfolioKey, ServiceKey } from './types';

export const SITE_URL = 'https://stardigital.app';

export const CONTACT = {
  email: 'contact@stardigital.app',
  telephone: '+355 68 212 8669',
  whatsappNumber: '355682128669',
  whatsappUrl: 'https://wa.me/355682128669',
  instagramHandle: 'stardigital.app',
  instagramUrl: 'https://instagram.com/stardigital.app',
  formspreeEndpoint: 'https://formspree.io/f/xpqgnwav',
} as const;

export const ORG = {
  name: 'Star Digital',
  locality: 'Lezhë',
  region: 'Lezhë',
  country: 'AL',
  latitude: 41.7836,
  longitude: 19.6436,
  priceRange: '€€',
  logo: { url: `${SITE_URL}/logo.png`, width: 294, height: 84 },
  ogImage: `${SITE_URL}/assets/og-image.png`,
  dateModified: '2026-07-30',
} as const;

/* Skill chips on /about, grouped loosely front-end → back-end → tooling →
   quality so the wrapped fallback list reads in a sensible order.

   Deliberately all proper nouns. Names like "Responsive Design" would have to
   be translated, which means moving this list into both dictionaries and
   keeping them in step; product names are identical in Albanian and English,
   so the list stays here and cannot drift. */
export const SKILLS = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Tailwind CSS',
  'Framer Motion',
  'Three.js',
  'WebGL',
  'Node.js',
  'Python',
  'SQL',
  'PostgreSQL',
  'REST APIs',
  'Java',
  'C',
  'Git',
  'Vite',
  'Vercel',
  'Figma',
  'Schema.org',
  'Core Web Vitals',
  'WCAG',
] as const;

export interface PortfolioMeta {
  key: PortfolioKey;
  url: string;
  /** Rendered <img> source and the texture the 3D laptop streams. */
  image: string;
  /** Legacy .png/.jpg used by structured data, kept byte-identical. */
  schemaImage: string;
  width: number;
  height: number;
  accent: string;
  tags: string[];
}

export const PORTFOLIO: PortfolioMeta[] = [
  {
    key: 'studio',
    url: 'https://orthopedic-studio.vercel.app',
    image: '/assets/portfolio/studio.webp',
    schemaImage: `${SITE_URL}/assets/portfolio/studio.png`,
    width: 1536,
    height: 729,
    accent: '#4da3ff',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    key: 'candles',
    url: 'https://candlesauroma.com',
    image: '/assets/portfolio/candles-auroma.webp',
    schemaImage: `${SITE_URL}/assets/portfolio/candles-auroma.png`,
    width: 1536,
    height: 731,
    accent: '#c9a84c',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    key: 'afa',
    url: 'https://afaengineeringklima.com',
    image: '/assets/portfolio/afa-engineering-klima.jpg',
    schemaImage: `${SITE_URL}/assets/portfolio/afa-engineering-klima.jpg`,
    width: 1536,
    height: 729,
    accent: '#7aa919',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
];

export const SERVICE_ORDER: ServiceKey[] = [
  'design',
  'landing',
  'ecom',
  'redesign',
  'maintenance',
  'seo',
];

/* Route helpers. Albanian lives at the bare paths, English under /en. */
export type RouteKey = 'home' | 'about' | 'services' | 'contact';

const SEGMENT: Record<RouteKey, string> = {
  home: '',
  about: '/about',
  services: '/services',
  contact: '/contact',
};

export function href(lang: Lang, route: RouteKey): string {
  const base = lang === 'en' ? '/en' : '';
  return `${base}${SEGMENT[route]}` || '/';
}

export function absoluteUrl(lang: Lang, route: RouteKey): string {
  const path = href(lang, route);
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
