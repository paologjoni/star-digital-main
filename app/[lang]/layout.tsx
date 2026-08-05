import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';

import '../globals.css';
import { LANGS, getDictionary, toLang } from '@/content';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollProgress from '@/components/ScrollProgress';

/* This is the root layout: every route lives under [lang], which lets
   <html lang> be correct per language without any client-side patching. */

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

/* Only sq and en exist; anything else is a 404 rather than a rendered page. */
export const dynamicParams = false;

export const viewport = {
  themeColor: '#0f0720',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const lang = toLang((await params).lang);
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={inter.variable}>
      <body>
        <div className="aurora" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-5 focus:py-3 focus:font-semibold focus:text-bg"
        >
          {dict.chrome.skipLink}
        </a>

        <SmoothScroll />
        <ScrollProgress />
        <Nav lang={lang} />

        {children}

        <Footer lang={lang} />
        <WhatsAppButton lang={lang} />
      </body>
    </html>
  );
}
