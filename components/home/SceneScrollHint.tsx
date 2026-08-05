'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';

import { getDictionary, type Lang } from '@/content';
import { ChevronDown } from '@/components/icons';
import { hintPresence } from '@/components/three/choreography';

/* The scene pins for three viewports, and a pinned viewport looks like a page
   that has stopped responding: the visitor scrolls, the layout does not move,
   and the natural read is that they have hit the bottom of something.

   So the cue stays up for the whole pin rather than only over the shut lid.
   The stall it explains does not end when the lid opens — the object turning
   through three screenshots is just as capable of reading as a video that
   should be watched rather than a page that should be scrolled.

   Sits low enough to clear the stacked caption that the sub-lg layout puts
   under the machine. Opacity rides the same motion value as everything else
   in the scene, so the fade costs no React renders. */

export default function SceneScrollHint({
  progress,
  lang,
}: {
  progress: MotionValue<number>;
  lang: Lang;
}) {
  const opacity = useTransform(progress, (p) => hintPresence(p));

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-2.5"
    >
      <span className="rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-muted uppercase backdrop-blur-sm">
        {getDictionary(lang).home.sceneScrollHint}
      </span>
      <ChevronDown className="h-5 w-5 text-muted/70 motion-safe:animate-[chevron-bounce_2s_ease-in-out_infinite]" />
    </motion.div>
  );
}
