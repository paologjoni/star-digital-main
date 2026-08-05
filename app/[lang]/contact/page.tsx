import type { Metadata } from 'next';

import { CONTACT, getDictionary, toLang } from '@/content';
import { buildMetadata } from '@/content/seo';
import JsonLd from '@/components/JsonLd';
import Reveal from '@/components/Reveal';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import { ClockIcon, InstagramIcon, MailIcon, WhatsAppIcon } from '@/components/icons';

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return buildMetadata(toLang((await params).lang), 'contact');
}

export default async function ContactPage({ params }: Params) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang).contact;

  const actionClass =
    'rim group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-line/70 bg-surface/40 px-6 py-5 text-sm font-semibold transition-all duration-400 hover:-translate-y-0.5';

  return (
    <>
      <JsonLd lang={lang} route="contact" />

      <main id="main">
        <PageHero title={t.title} sub={t.sub} />

        <section className="pb-24 sm:pb-32">
          <div className="container-x grid gap-10 lg:grid-cols-[1.35fr_1fr]">
            <Reveal>
              <ContactForm lang={lang} />
            </Reveal>

            <Reveal delay={0.15} className="flex flex-col gap-4">
              <div className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-gold/8 px-6 py-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <ClockIcon className="h-5 w-5" />
                </span>
                <p className="text-sm text-muted">{t.responseNote}</p>
              </div>

              <p className="eyebrow mt-4">{t.reachDirectly}</p>

              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${actionClass} border-gold/30 bg-gold/10 text-gold hover:bg-gold/15`}
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span>{t.actionWhatsapp}</span>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className={`${actionClass} text-ink hover:text-gold`}
              >
                <MailIcon className="h-5 w-5" />
                <span>{t.actionEmail}</span>
              </a>

              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${actionClass} text-ink hover:text-gold`}
              >
                <InstagramIcon className="h-5 w-5" />
                <span>{t.actionInstagram}</span>
              </a>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
