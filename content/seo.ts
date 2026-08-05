/* Metadata and JSON-LD, reproducing the pre-rebuild graphs node-for-node.

   One deliberate correction: the homepage ItemList previously listed
   "Tirana Eats" as item 3, pointing at /assets/portfolio/tirana-eats.png,
   a file that does not exist and a project that is not on the page. It now
   reflects the third card actually rendered, AFA Engineering Klima. */

import type { Metadata } from 'next';
import { getDictionary } from './index';
import { CONTACT, ORG, PORTFOLIO, SERVICE_ORDER, SITE_URL, absoluteUrl } from './shared';
import type { RouteKey } from './shared';
import type { Lang } from './types';

const OG_LOCALE: Record<Lang, string> = { sq: 'sq_AL', en: 'en_US' };

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_ID = `${SITE_URL}/#logo`;

/* ── Metadata ─────────────────────────────────────────────────────────── */

export function buildMetadata(lang: Lang, route: RouteKey): Metadata {
  const dict = getDictionary(lang);
  const { title, description } = dict.meta[route];
  const canonical = absoluteUrl(lang, route);

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        sq: absoluteUrl('sq', route),
        en: absoluteUrl('en', route),
        'x-default': absoluteUrl('sq', route),
      },
    },
    authors: [{ name: ORG.name }],
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    openGraph: {
      type: 'website',
      siteName: ORG.name,
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[lang === 'sq' ? 'en' : 'sq'],
      title,
      description,
      url: canonical,
      images: [
        {
          url: ORG.ogImage,
          width: 1200,
          height: 630,
          alt: 'Star Digital — Web Design & Development, Albania',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ORG.ogImage],
    },
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/assets/icons/favicon-32.png', type: 'image/png', sizes: '32x32' },
        { url: '/assets/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
      ],
      apple: '/assets/icons/apple-touch-icon.png',
    },
  };
}

/* ── JSON-LD ──────────────────────────────────────────────────────────── */

type Node = Record<string, unknown>;

function organizationNode(lang: Lang): Node {
  const dict = getDictionary(lang);

  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: ORG.name,
    url: `${SITE_URL}/`,
    description: dict.org.description,
    email: CONTACT.email,
    telephone: CONTACT.telephone,
    image: ORG.ogImage,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: ORG.logo.url,
      width: ORG.logo.width,
      height: ORG.logo.height,
      caption: ORG.name,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: ORG.locality,
      addressCountry: ORG.country,
      addressRegion: ORG.region,
    },
    areaServed: [
      { '@type': 'Country', name: 'Albania' },
      { '@type': 'Country', name: 'Kosovo' },
    ],
    priceRange: ORG.priceRange,
    knowsLanguage: ['sq', 'en'],
    sameAs: [CONTACT.instagramUrl],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: CONTACT.telephone,
      email: CONTACT.email,
      availableLanguage: ['Albanian', 'English'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: dict.org.offerCatalogName,
      itemListElement: SERVICE_ORDER.map((key) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: dict.services.items[key].title,
          description: dict.services.items[key].body,
          provider: { '@id': ORG_ID },
        },
      })),
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: ORG.latitude,
      longitude: ORG.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    slogan: dict.org.slogan,
  };
}

function websiteNode(lang: Lang): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: ORG.name,
    inLanguage: lang,
    publisher: { '@id': ORG_ID },
  };
}

const PAGE_TYPE: Record<RouteKey, string> = {
  home: 'WebPage',
  about: 'AboutPage',
  services: 'CollectionPage',
  contact: 'ContactPage',
};

function pageNode(lang: Lang, route: RouteKey): Node {
  const dict = getDictionary(lang);
  /* The Albanian homepage's node ids are anchored on "…app/", with the
     trailing slash — matching what is already indexed. */
  const url = absoluteUrl(lang, route);
  const base = url;

  const node: Node = {
    '@type': PAGE_TYPE[route],
    '@id': `${base}#webpage`,
    url,
    name: dict.meta[route].title,
    description: dict.meta[route].description,
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: ORG.ogImage },
  };

  if (route !== 'home') {
    node.breadcrumb = { '@id': `${base}#breadcrumb` };
  }
  node.dateModified = ORG.dateModified;

  return node;
}

function breadcrumbNode(lang: Lang, route: Exclude<RouteKey, 'home'>): Node {
  const dict = getDictionary(lang);
  const url = absoluteUrl(lang, route);
  const label = {
    about: dict.chrome.navAbout,
    services: dict.chrome.navServices,
    contact: dict.chrome.navContact,
  }[route];

  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.org.breadcrumbHome,
        item: lang === 'en' ? `${SITE_URL}/en` : `${SITE_URL}/`,
      },
      { '@type': 'ListItem', position: 2, name: label, item: url },
    ],
  };
}

function portfolioListNode(lang: Lang): Node {
  const dict = getDictionary(lang);
  const base = lang === 'en' ? `${SITE_URL}/en` : `${SITE_URL}/`;

  return {
    '@type': 'ItemList',
    '@id': `${base}#portfolio`,
    name: dict.org.portfolioListName,
    itemListElement: PORTFOLIO.map((project, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'WebSite',
        name: dict.home.portfolio[project.key].title,
        description: dict.home.portfolio[project.key].desc,
        url: project.url,
        image: project.schemaImage,
        creator: { '@id': ORG_ID },
      },
    })),
  };
}

function serviceNodes(lang: Lang): Node[] {
  const dict = getDictionary(lang);
  const url = absoluteUrl(lang, 'services');

  return SERVICE_ORDER.map((key, i) => ({
    '@type': 'Service',
    '@id': `${url}#service-${i + 1}`,
    name: dict.services.items[key].title,
    description: dict.services.items[key].body,
    serviceType: dict.services.items[key].title,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Albania' },
  }));
}

export function buildJsonLd(lang: Lang, route: RouteKey): string {
  const graph: Node[] = [organizationNode(lang), websiteNode(lang), pageNode(lang, route)];

  if (route === 'home') {
    graph.push(portfolioListNode(lang));
  } else {
    graph.push(breadcrumbNode(lang, route));
    if (route === 'services') graph.push(...serviceNodes(lang));
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}
