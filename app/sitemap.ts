import type { MetadataRoute } from 'next';

import { ORG, absoluteUrl, type RouteKey } from '@/content';

/* Reproduces the pre-rebuild sitemap.xml: the same eight URLs, the same
   hreflang alternates and the same priorities. */

const PRIORITY: Record<RouteKey, number> = {
  home: 1.0,
  about: 0.8,
  services: 0.9,
  contact: 0.9,
};

const ROUTES: RouteKey[] = ['home', 'about', 'services', 'contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) =>
    (['sq', 'en'] as const).map((lang) => ({
      url: absoluteUrl(lang, route),
      lastModified: ORG.dateModified,
      changeFrequency: 'monthly' as const,
      priority: PRIORITY[route],
      alternates: {
        languages: {
          sq: absoluteUrl('sq', route),
          en: absoluteUrl('en', route),
          'x-default': absoluteUrl('sq', route),
        },
      },
    })),
  );
}
