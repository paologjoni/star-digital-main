import { buildJsonLd } from '@/content/seo';
import type { Lang, RouteKey } from '@/content';

/* Rendered server-side so the structured data is in the HTML source, exactly
   as it was before the rebuild — crawlers never have to execute anything. */
export default function JsonLd({ lang, route }: { lang: Lang; route: RouteKey }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: buildJsonLd(lang, route) }}
    />
  );
}
