'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useScroll, useTransform, motion } from 'motion/react';


import { useCapability } from '@/lib/useCapability';

const LaptopCanvas = dynamic(() => import('@/components/three/LaptopCanvas'), {
  ssr: false,
});

/* A pinned scene: a tall scroll region whose inner viewport sticks while the
   laptop opens, turns through the three portfolio screenshots and recedes.

   An earlier version pinned the laptop behind the content sections. It read
   badly — the object cut through headings, and by the portfolio grid it was
   duplicating the very screenshots the cards were already showing. Giving it
   its own stage lets the object be the subject while it is on screen, and
   lets the sections below be plainly readable once it is gone.

   Decorative throughout: the same three projects appear as real markup in
   the portfolio grid further down the page. */

export default function LaptopScene() {
  const stage = useRef<HTMLDivElement>(null);
  const { allow3D } = useCapability();
  const [near, setNear] = useState(false);

  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ['start start', 'end end'],
  });

  /* three.js plus the three screen textures is roughly 300KB of JavaScript
     and 170KB of images. None of it is needed above the fold, and a visitor
     who reads the hero and leaves should never pay for it.

     An IntersectionObserver is the obvious tool and the wrong one here: the
     hero is 92vh, so this stage's top edge is already on screen at scroll
     zero and any intersection trigger fires immediately. A scroll threshold
     says what is actually meant — start loading once the visitor commits to
     going down the page. */
  useEffect(() => {
    if (!allow3D || near) return;

    const check = () => {
      if (window.scrollY > window.innerHeight * 0.35) {
        setNear(true);
        window.removeEventListener('scroll', check);
      }
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [allow3D, near]);

  /* Fade the canvas at both ends so it never bleeds into the hero above or
     the section below. */
  const opacity = useTransform(scrollYProgress, [0, 0.06, 0.9, 1], [0, 1, 1, 0]);

  /* The stage element is always rendered so useScroll has a target to measure
     from the first paint. Only its height is conditional — the capability
     check resolves after mount, and a tracker whose target appears later
     never starts reporting. Without WebGL the section collapses to nothing
     rather than leaving three viewports of dead scroll. */
  return (
    <div
      ref={stage}
      className={allow3D ? 'relative h-[300vh]' : 'relative h-0'}
      aria-hidden="true"
    >
      {allow3D && (
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ opacity }} className="absolute inset-0">
            {near && <LaptopCanvas progress={scrollYProgress} />}
          </motion.div>

          {/* Grounds the object against the section below. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />
        </div>
      )}
    </div>
  );
}

