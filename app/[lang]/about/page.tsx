import type { Metadata } from 'next';

import { SKILLS, getDictionary, toLang } from '@/content';
import { buildMetadata } from '@/content/seo';
import JsonLd from '@/components/JsonLd';
import Reveal from '@/components/Reveal';
import PageHero from '@/components/PageHero';
import SkillOrbit from '@/components/SkillOrbit';
import { CheckIcon } from '@/components/icons';

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return buildMetadata(toLang((await params).lang), 'about');
}

export default async function AboutPage({ params }: Params) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang).about;

  return (
    <>
      <JsonLd lang={lang} route="about" />

      <main id="main">
        <PageHero badge={t.badge} title={t.title} />

        {/* WHO WE ARE */}
        <section className="py-20 sm:py-28" aria-labelledby="who-h">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="section-title" id="who-h">
                {t.whoTitle}
              </h2>
              <p className="mt-6 text-[length:var(--text-lead)] leading-relaxed text-muted">
                {t.whoBody}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              {/* The opening quote glyph is drawn as a pseudo-element so it
                  stays decoration and never enters the text content. */}
              <blockquote className="rim relative overflow-hidden rounded-3xl glass p-9 before:pointer-events-none before:absolute before:-top-6 before:left-6 before:font-serif before:text-8xl before:text-gold/20 before:content-['\201C']">
                <p className="relative text-[length:var(--text-lead)] leading-relaxed italic">
                  {t.quote}
                </p>
              </blockquote>
            </Reveal>
          </div>
        </section>

        {/* MISSION */}
        <section className="py-20 sm:py-28" aria-labelledby="mission-h">
          <div className="container-x">
            <Reveal className="mx-auto max-w-3xl text-center">
              <h2 className="section-title" id="mission-h">
                {t.missionTitle}
              </h2>
              <p className="mt-6 text-[length:var(--text-lead)] leading-[1.7] text-muted">
                {t.missionBody}
              </p>
            </Reveal>
          </div>
        </section>

        {/* SKILLS */}
        <section className="py-20 sm:py-28" aria-labelledby="skills-h">
          <div className="container-x">
            <Reveal>
              <h2 className="section-title" id="skills-h">
                {t.skillsTitle}
              </h2>
            </Reveal>

            {/* The orbit is a visual layer over this list; the list itself is
                the content and is always in the DOM. */}
            <SkillOrbit skills={[...SKILLS]} label={t.skillsTitle} />
          </div>
        </section>

        {/* WHY WORK WITH US */}
        <section className="py-20 sm:py-28" aria-labelledby="whywork-h">
          <div className="container-x">
            <Reveal>
              <h2 className="section-title" id="whywork-h">
                {t.reasonsTitle}
              </h2>
            </Reveal>

            <ul className="mt-12 grid gap-4 sm:grid-cols-2">
              {t.reasons.map((reason, i) => (
                <Reveal as="li" key={reason} delay={i * 0.1}>
                  {/* items-center, not items-start: the grid stretches every
                      card in a row to the tallest one, and top-aligned content
                      left the shorter card's text floating above its own box. */}
                  <div className="rim group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-line/70 bg-surface/40 p-6 transition-transform duration-500 hover:-translate-y-1">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{reason}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
