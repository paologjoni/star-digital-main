import Link from 'next/link';

import { CONTACT, getDictionary, href, type Lang, type RouteKey } from '@/content';
import { InstagramIcon, MailIcon } from './icons';

const ROUTES: RouteKey[] = ['home', 'about', 'services', 'contact'];

export default function Footer({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang);

  const labels: Record<RouteKey, string> = {
    home: dict.chrome.navHome,
    about: dict.chrome.navAbout,
    services: dict.chrome.navServices,
    contact: dict.chrome.navContact,
  };

  return (
    <footer className="relative mt-8 border-t border-line/60 bg-bg-deep/80">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Star Digital"
              width={245}
              height={70}
              loading="lazy"
              decoding="async"
              className="h-9 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {dict.chrome.footerDesc}
            </p>
          </div>

          <div>
            <p className="eyebrow">{dict.chrome.footerQuickLinks}</p>
            <ul className="mt-5 space-y-3">
              {ROUTES.map((route) => (
                <li key={route}>
                  <Link
                    href={href(lang, route)}
                    className="text-sm text-muted transition-colors hover:text-gold"
                  >
                    {labels[route]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">{dict.chrome.footerFollowUs}</p>
            <div className="mt-5 space-y-3">
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer me"
                className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-gold"
              >
                <InstagramIcon className="h-4 w-4" />
                {`@${CONTACT.instagramHandle}`}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-gold"
              >
                <MailIcon className="h-4 w-4" />
                {CONTACT.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line/60 pt-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>{dict.chrome.footerCopyright}</span>
          <span>{dict.chrome.footerBuiltWith}</span>
        </div>
      </div>
    </footer>
  );
}
