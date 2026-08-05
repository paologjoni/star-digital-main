import type { Metadata } from 'next';

import { PORTFOLIO, getDictionary, href, toLang } from '@/content';
import { buildMetadata } from '@/content/seo';
import JsonLd from '@/components/JsonLd';
import Reveal from '@/components/Reveal';
import { GoldButton } from '@/components/Button';
import Hero from '@/components/home/Hero';
import LaptopScene from '@/components/home/LaptopScene';
import { ChevronRight } from '@/components/icons';

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return buildMetadata(toLang((await params).lang), 'home');
}

export default async function HomePage({ params }: Params) {
  const lang = toLang((await params).lang);
  const dict = getDictionary(lang);
  const t = dict.home;

  return (
    <>
      <JsonLd lang={lang} route="home" />

      <main id="main">
        <Hero lang={lang} />

        {/* Pinned WebGL scene. Decorative and desktop-only — the projects it
            cycles through are rendered as real markup in the grid below. */}
        <LaptopScene />
        {/* WHAT WE DO */}
        <section className="relative py-24 sm:py-32" aria-labelledby="wwd-h">
          <div className="container-x">
            <Reveal>
              <h2 className="section-title" id="wwd-h">
                {t.wwdTitle}
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {t.wwd.map((card, i) => (
                <Reveal key={card.title} delay={i * 0.1}>
                  <article className="rim group relative h-full overflow-hidden rounded-2xl glass p-8 transition-transform duration-500 hover:-translate-y-1.5">
                    <div
                      aria-hidden="true"
                      className="mb-5 text-3xl transition-transform duration-500 group-hover:scale-110"
                    >
                      {['🎨', '💻', '⚡'][i]}
                    </div>
                    <h3 className="text-[length:var(--text-h3)] font-bold">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="relative py-24 sm:py-32" aria-labelledby="why-h">
          <div className="container-x">
            <Reveal>
              <h2 className="section-title" id="why-h">
                {t.whyTitle}
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {t.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.1}>
                  <div className="rim relative h-full overflow-hidden rounded-2xl border border-line/70 bg-surface/40 p-7">
                    <div className="text-lg font-bold text-gold">{stat.label}</div>
                    <p className="mt-2 text-sm text-muted">{stat.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section id="portfolio" className="relative py-24 sm:py-32" aria-labelledby="pf-h">
          <div className="container-x">
            <Reveal>
              <h2 className="section-title" id="pf-h">
                {t.portfolioTitle}
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {PORTFOLIO.map((project, i) => {
                const copy = t.portfolio[project.key];
                return (
                  <Reveal key={project.key} delay={i * 0.1}>
                    <article className="rim group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface/50 transition-transform duration-500 hover:-translate-y-2">
                      <div
                        className="relative overflow-hidden"
                        style={{ borderBottom: `3px solid ${project.accent}` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.image}
                          alt={copy.alt}
                          width={project.width}
                          height={project.height}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[1536/729] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <span
                          className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm"
                          style={{
                            background: `color-mix(in srgb, ${project.accent} 13%, transparent)`,
                            color: project.accent,
                            border: `1px solid color-mix(in srgb, ${project.accent} 25%, transparent)`,
                          }}
                        >
                          {copy.badge}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-7">
                        <h3 className="text-[length:var(--text-h3)] font-bold">
                          {copy.title}
                        </h3>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                          {copy.desc}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-line bg-bg/60 px-3 py-1 text-xs text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t.viewProject}: ${copy.title}`}
                          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform duration-300 hover:gap-3"
                          style={{ color: project.accent }}
                        >
                          {t.viewProject}
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>


        {/* CTA BANNER */}
        <section className="relative py-24 sm:py-32">
          <div className="container-x">
            <Reveal>
              <div className="rim relative overflow-hidden rounded-3xl glass px-8 py-16 text-center sm:px-16">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_0%,rgb(245_197_24/0.12),transparent_70%)]"
                />
                <h2 className="section-title relative">{t.bannerTitle}</h2>
                <p className="relative mx-auto mt-5 max-w-xl text-[length:var(--text-lead)] text-muted">
                  {t.bannerSub}
                </p>
                <div className="relative mt-9 flex justify-center">
                  <GoldButton href={href(lang, 'contact')} size="lg">
                    {t.bannerCta}
                  </GoldButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
