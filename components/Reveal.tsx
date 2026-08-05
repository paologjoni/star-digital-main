'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/* The replacement for the old IntersectionObserver + .reveal class.
   Under prefers-reduced-motion it degrades to a plain opacity fade, and the
   content is in the DOM either way — nothing here gates visibility on JS. */

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li';
};

export default function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  as = 'div',
}: Props) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px 0px' }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}
