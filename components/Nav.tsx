'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { getDictionary, href, type Lang, type RouteKey } from '@/content';
import { routeFromPathname } from '@/lib/route';
import { CloseIcon, MenuIcon } from './icons';

const ROUTES: RouteKey[] = ['home', 'about', 'services', 'contact'];

export default function Nav({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang);
  const pathname = usePathname();
  const current = routeFromPathname(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const labels: Record<RouteKey, string> = {
    home: dict.chrome.navHome,
    about: dict.chrome.navAbout,
    services: dict.chrome.navServices,
    contact: dict.chrome.navContact,
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock the page while the sheet is open, and let Escape close it. */
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const other: Lang = lang === 'sq' ? 'en' : 'sq';

  const LangSwitcher = ({ large = false }: { large?: boolean }) => (
    <div className={`flex items-center gap-2 ${large ? 'text-base' : 'text-sm'}`}>
      <Link
        href={href(lang, current)}
        hrefLang={lang}
        lang={lang}
        aria-current="true"
        className="font-semibold text-gold"
      >
        {lang.toUpperCase()}
      </Link>
      <span aria-hidden="true" className="text-line">
        |
      </span>
      <Link
        href={href(other, current)}
        hrefLang={other}
        lang={other}
        className="font-semibold text-muted transition-colors hover:text-ink"
      >
        {other.toUpperCase()}
      </Link>
    </div>
  );

  return (
    <>
      <nav
        aria-label={dict.chrome.mainNavLabel}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/10 bg-bg/80 py-2 backdrop-blur-xl'
            : 'border-b border-transparent py-4'
        }`}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Link
            href={href(lang, 'home')}
            aria-label={dict.chrome.logoLabel}
            className="shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Star Digital"
              width={800}
              height={800}
              className={`w-auto transition-all duration-500 ${scrolled ? 'h-8' : 'h-10'}`}
            />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {ROUTES.map((route) => {
              const active = route === current;
              return (
                <Link
                  key={route}
                  href={href(lang, route)}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative text-sm font-medium transition-colors ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {labels[route]}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-400 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}

            <LangSwitcher />

            <Link
              href={href(lang, 'contact')}
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-bg transition-all duration-300 hover:bg-gold-hi hover:shadow-[0_0_28px_-4px_rgb(245_197_24/0.6)]"
            >
              {dict.chrome.navCta}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={dict.chrome.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="rounded-lg p-2 text-ink transition-colors hover:text-gold lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.chrome.mainNavLabel}
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'circle(0% at 92% 6%)' }}
            animate={
              reduce ? { opacity: 1 } : { opacity: 1, clipPath: 'circle(140% at 92% 6%)' }
            }
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'circle(0% at 92% 6%)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-7 bg-bg-deep/97 backdrop-blur-2xl lg:hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.chrome.closeMenu}
              className="absolute top-5 right-5 rounded-lg p-2 text-ink transition-colors hover:text-gold"
            >
              <CloseIcon className="h-7 w-7" />
            </button>

            {ROUTES.map((route, i) => {
              const active = route === current;
              return (
                <motion.div
                  key={route}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={href(lang, route)}
                    aria-current={active ? 'page' : undefined}
                    className={`text-2xl font-semibold transition-colors ${
                      active ? 'text-gold' : 'text-ink hover:text-gold'
                    }`}
                  >
                    {labels[route]}
                  </Link>
                </motion.div>
              );
            })}

            <LangSwitcher large />

            <Link
              href={href(lang, 'contact')}
              className="rounded-full bg-gold px-8 py-3.5 text-base font-bold text-bg"
            >
              {dict.chrome.navCta}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
