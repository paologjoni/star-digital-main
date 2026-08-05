'use client';

import { useState } from 'react';
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react';

import { PORTFOLIO, getDictionary, type Lang } from '@/content';
import { activeIndex, captionPresence } from '@/components/three/choreography';

/* The text flanking the MacBook, swapping as each project comes up on screen.

   Every string here already exists in the portfolio grid below — category,
   title, tech tags. Nothing is invented, so nothing new needs translating and
   the content gate stays meaningful.

   The whole scene is aria-hidden, so this is not read out twice: assistive
   tech gets the real portfolio cards further down the page.

   Opacity rides a motion value so the fade costs no React renders; only the
   project index is state, and that changes twice in the whole scene. */

export default function SceneCaption({
  progress,
  lang,
}: {
  progress: MotionValue<number>;
  lang: Lang;
}) {
  const dict = getDictionary(lang);
  const [index, setIndex] = useState(0);

  const opacity = useTransform(progress, (p) => captionPresence(p));
  const driftLeft = useTransform(progress, (p) => (1 - captionPresence(p)) * -22);
  const driftRight = useTransform(progress, (p) => (1 - captionPresence(p)) * 22);

  useMotionValueEvent(progress, 'change', (p) => {
    const next = activeIndex(p);
    setIndex((previous) => (previous === next ? previous : next));
  });

  const project = PORTFOLIO[index];
  const copy = dict.home.portfolio[project.key];

  const counter = (
    <span
      className="font-mono text-3xl font-bold tabular-nums"
      style={{ color: project.accent }}
    >
      {String(index + 1).padStart(2, '0')}
    </span>
  );

  const tags = project.tags.map((tag) => (
    <span
      key={tag}
      className="rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm"
    >
      {tag}
    </span>
  ));

  return (
    <>
      {/* Wide: flanking the machine. */}
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-between px-8 lg:flex xl:px-16">
        <motion.div
          style={{ opacity, x: driftLeft }}
          className="max-w-[15rem] xl:max-w-[17rem]"
        >
          <div className="mb-4 flex items-baseline gap-3">
            {counter}
            <span className="h-px flex-1 bg-linear-to-r from-white/25 to-transparent" />
          </div>

          <p className="eyebrow" style={{ color: project.accent }}>
            {copy.badge}
          </p>

          <h3 className="mt-2 text-2xl leading-tight font-bold text-balance xl:text-[1.75rem]">
            {copy.title}
          </h3>
        </motion.div>

        <motion.div
          style={{ opacity, x: driftRight }}
          className="flex max-w-[13rem] flex-col items-end gap-2.5"
        >
          {tags}
        </motion.div>
      </div>

      {/* Narrower, but still wide enough for the scene: the same caption
          collected under the machine, since there is no room beside it.
          Without this the text simply disappeared between 768 and 1024. */}
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute inset-x-0 bottom-16 flex flex-col items-center gap-3 px-6 text-center lg:hidden"
      >
        <div className="flex items-center gap-3">
          {counter}
          <p className="eyebrow" style={{ color: project.accent }}>
            {copy.badge}
          </p>
        </div>
        <h3 className="text-xl leading-tight font-bold text-balance">{copy.title}</h3>
        <div className="flex flex-wrap justify-center gap-2">{tags}</div>
      </motion.div>
    </>
  );
}
