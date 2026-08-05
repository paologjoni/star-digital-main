import type { Metadata } from 'next';

import { SERVICE_ORDER, getDictionary, href, toLang, type ServiceKey } from '@/content';
import { buildMetadata } from '@/content/seo';
import JsonLd from '@/components/JsonLd';
import Reveal from '@/components/Reveal';
import PageHero from '@/components/PageHero';
import TiltCard from '@/components/TiltCard';
import { OutlineButton } from '@/components/Button';
import {
  CartIcon,
  CodeIcon,
  LayersIcon,
  MonitorIcon,
  SearchIcon,
  WrenchIcon,
} from '@/components/icons';

type Params = { params: Promise<{ lang: string }> };

const ICONS: Record<ServiceKey, (props: { className?: string }) => React.ReactElement> = {
  design: MonitorIcon,
  landing: LayersIcon,
  ecom: CartIcon,
  redesign: CodeIcon,
  maintenance: WrenchIcon,
  seo: SearchIcon,
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return buildMetadata(toLang((await params).lang), 'services');
}

export default async function ServicesPage({ params }: Params) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang).services;

  return (
    <>
      <JsonLd lang={lang} route="services" />

      <main id="main">
        <PageHero badge={t.badge} title={t.title} sub={t.sub} />

        <section className="py-16 sm:py-24" aria-labelledby="services-h">
          <div className="container-x">
            <Reveal>
              <h2 className="section-title" id="services-h">
                {t.sectionTitle}
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICE_ORDER.map((key, i) => {
                const item = t.items[key];
                const Icon = ICONS[key];

                return (
                  <Reveal key={key} delay={i * 0.08}>
                    <TiltCard className="rim group relative flex h-full flex-col overflow-hidden rounded-2xl glass p-8">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                      />

                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold transition-transform duration-500 group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </span>

                      <h3 className="mt-6 text-[length:var(--text-h3)] font-bold">
                        {item.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                        {item.body}
                      </p>

                      <div className="mt-7">
                        <OutlineButton
                          href={href(lang, 'contact')}
                          ariaLabel={`${t.ctaAriaPrefix}: ${item.title}`}
                        >
                          {t.cta}
                        </OutlineButton>
                      </div>
                    </TiltCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
