'use client';

import { type ReactNode, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/* Cursor-tracked 3D tilt, done with CSS transforms rather than WebGL — the
   effect is a few degrees of rotation, which does not justify a canvas or a
   second render loop. Pointer-driven, so it costs nothing until hovered. */

export default function TiltCard({
  children,
  className = '',
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || reduce || e.pointerType !== 'mouse') return;

    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    node.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(
      2,
    )}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-4px)`;
  };

  const reset = () => {
    const node = ref.current;
    if (node) node.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
