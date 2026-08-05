'use client';

import { type ReactNode, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useScroll } from 'motion/react';

import { PORTFOLIO } from '@/content';
import { useCapability } from '@/lib/useCapability';

const LaptopCanvas = dynamic(() => import('@/components/three/LaptopCanvas'), {
  ssr: false,
});

/* Wraps the three middle sections of the homepage. The canvas is pinned
   behind them and reads one scroll value for the whole block, so the laptop
   and the sections can never fall out of step.

   Everything the laptop shows also exists as real markup below it — the
   portfolio grid renders the same screenshots as <img> regardless. */

export default function LaptopStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const { allow3D } = useCapability();

  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={stage} className="relative">
      {allow3D && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
          <LaptopCanvas progress={scrollYProgress} />
          {/* Scrim: keeps body copy at full contrast over the moving scene. */}
          <div className="absolute inset-0 bg-bg/55" />
        </div>
      )}

      {!allow3D && (
        /* Static stand-in for phones and reduced-motion. It is the same first
           screenshot the 3D scene opens on, so the page still leads with work. */
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center opacity-20"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PORTFOLIO[0].image}
            alt=""
            width={PORTFOLIO[0].width}
            height={PORTFOLIO[0].height}
            loading="lazy"
            decoding="async"
            className="w-[min(90vw,52rem)] rounded-xl blur-[1px]"
          />
        </div>
      )}

      {/* No caption for the canvas: it is decorative, and the portfolio grid
          below already names all three projects in real markup. */}
      {children}
    </div>
  );
}
