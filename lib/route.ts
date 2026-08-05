import type { Lang, RouteKey } from '@/content';

/* usePathname() returns the browser URL, not the internal /[lang] rewrite,
   so /about and /en/about both resolve here without knowing about the
   rewrite table. */
export function routeFromPathname(pathname: string): RouteKey {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '');

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
