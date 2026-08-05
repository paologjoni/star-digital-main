'use client';

import { useMemo } from 'react';

/* The no-WebGL starfield: the same twinkling dots the pre-rebuild site drew
   with 60 spans, kept as the fallback for phones and reduced-motion.
   Seeded so server and client agree and hydration stays quiet. */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function CssStars({
  count = 60,
  seed = 20260805,
  scale = 1,
  className = '',
}: {
  count?: number;
  seed?: number;
  scale?: number;
  className?: string;
}) {
  const stars = useMemo(() => {
    const random = mulberry32(seed);

    return Array.from({ length: count }, () => ({
      top: `${(random() * 100).toFixed(1)}%`,
      left: `${(random() * 100).toFixed(1)}%`,
      size: `${((random() * 2 + 1) * scale).toFixed(1)}px`,
      opacity: Number((random() * 0.5 + 0.1).toFixed(2)),
      duration: `${(random() * 3 + 2).toFixed(1)}s`,
      delay: `${(random() * 4).toFixed(1)}s`,
    }));
  }, [count, seed, scale]);

  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white motion-safe:animate-[twinkle_var(--dur)_ease-in-out_infinite]"
          style={
            {
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              '--op': star.opacity,
              '--dur': star.duration,
              animationDelay: star.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
