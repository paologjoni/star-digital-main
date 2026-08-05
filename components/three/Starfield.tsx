'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from 'motion/react';
import CssStars from './CssStars';

/* The starfield is deliberately not WebGL.

   It was, briefly. Rendering it through three.js pulled ~300KB of JavaScript
   into the first paint of every page to draw dots that are two pixels wide —
   indistinguishable from the CSS version, at roughly three times the cost of
   everything else on the page combined. three.js now loads only for the
   laptop scene, which is below the fold and earns it.

   Two layers at different depths plus a little pointer parallax give the
   field enough dimension to read as space rather than as noise. */

export default function Starfield({ className = '' }: { className?: string }) {
  const near = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };

    const render = () => {
      x += (targetX - x) * 0.045;
      y += (targetY - y) * 0.045;

      if (far.current) {
        far.current.style.transform = `translate3d(${(x * 12).toFixed(2)}px, ${(
          y * 8
        ).toFixed(2)}px, 0)`;
      }
      if (near.current) {
        near.current.style.transform = `translate3d(${(x * 30).toFixed(2)}px, ${(
          y * 20
        ).toFixed(2)}px, 0)`;
      }

      frame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <div ref={far} className="absolute inset-0 will-change-transform">
        <CssStars count={70} seed={20260805} className="absolute inset-0 opacity-70" />
      </div>
      <div ref={near} className="absolute inset-0 will-change-transform">
        <CssStars count={34} seed={99173} scale={1.6} className="absolute inset-0" />
      </div>
    </div>
  );
}
