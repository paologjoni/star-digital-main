'use client';

import { motion, useReducedMotion } from 'motion/react';

import { getDictionary, href, type Lang } from '@/content';
import { GoldButton, OutlineButton } from '@/components/Button';
import { ChevronDown } from '@/components/icons';
import Starfield from '@/components/three/Starfield';

/* The headline splits into words purely for the stagger. The full sentence
   stays one continuous <h1> text node for assistive tech and crawlers. */
function SplitWords({ text, className = '' }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(' ').filter(Boolean);

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: '0.9em' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15 + i * 0.055,
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

export default function Hero({ lang }: { lang: Lang }) {
  const t = getDictionary(lang).home;
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden pt-28 pb-20">
      <Starfield className="absolute inset-0 -z-10" />

      <div className="container-x relative text-center">
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/8 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
            {t.badge}
          </span>
        </motion.div>

        <h1 className="mx-auto mt-7 max-w-5xl text-[length:var(--text-display)] leading-[1.04] font-extrabold tracking-[-0.03em]">
          <SplitWords text={t.titleLead.trim()} />{' '}
          <SplitWords text={t.titleAccent} className="gold-text" />
        </h1>

        <motion.p
          {...fadeUp(0.45)}
          className="mx-auto mt-7 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-muted"
        >
          {t.sub}
        </motion.p>

        <motion.div
          {...fadeUp(0.58)}
          className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <GoldButton href={href(lang, 'contact')} size="lg">
            {t.ctaPrimary}
          </GoldButton>
          <OutlineButton href="#portfolio" size="lg">
            {t.ctaSecondary}
          </OutlineButton>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted/70 motion-safe:animate-[chevron-bounce_2s_ease-in-out_infinite]"
      >
        <ChevronDown className="h-6 w-6" />
      </div>
    </section>
  );
}
