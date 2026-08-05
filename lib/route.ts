import type { Lang, RouteKey } from '@/content';

/* Strips whichever language prefix is present.

   usePathname() does not always report the browser URL: on the Albanian
   pages, which are rewrites onto app/[lang], it reports the internal
   /sq/about rather than /about. Handling both prefixes keeps the active nav
   link correct either way — without this, every page reported itself as the
   homepage. */
export function routeFromPathname(pathname: string): RouteKey {
  const bare = pathname.replace(/^\/(en|sq)(?=\/|$)/, '').replace(/\/$/, '');

  switch (bare) {
    case '/about':
      return 'about';
    case '/services':
      return 'services';
    case '/contact':
      return 'contact';
    default:
      return 'home';
  }
}

export function langFromPathname(pathname: string): Lang {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'sq';
}
