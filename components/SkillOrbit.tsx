'use client';

import { useEffect, useRef, useState } from 'react';

import { useCapability } from '@/lib/useCapability';

/* The ten skill chips arranged on a slowly turning sphere.

   Deliberately not WebGL. Each chip stays a real DOM element with real text,
   so it is selectable, translatable, crawlable and readable by a screen
   reader — none of which is true of text rasterised into a canvas. The 3D is
   projection maths applied to transforms, which costs nothing by comparison.

   Server-rendered output is a plain wrapped list; the orbit is an upgrade
   applied after mount, and only when motion is welcome. */

type Point = { x: number; y: number; z: number };

/* Fibonacci sphere: even spacing without clustering at the poles. */
function spherePoints(count: number): Point[] {
  const golden = Math.PI * (3 - Math.sqrt(5));

  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;

    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
  });
}

export default function SkillOrbit({
  skills,
  label,
}: {
  skills: string[];
  label: string;
}) {
  const { allow3D, ready } = useCapability();
  const [orbiting, setOrbiting] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLLIElement | null)[]>([]);
  const drag = useRef({ vx: 0.0016, vy: 0, rx: -0.25, ry: 0, pointerX: 0, active: false });

  useEffect(() => {
    if (ready) setOrbiting(allow3D);
  }, [ready, allow3D]);

  useEffect(() => {
    if (!orbiting) return;

    const points = spherePoints(skills.length);
    const state = drag.current;
    let frame = 0;

    const render = () => {
      const box = container.current;
      if (box) {
        /* Use the box's width and height independently — a single min() made
           the sphere collapse to the shorter axis and cluster in the middle
           of a much wider container. */
        const radius = Math.min(box.clientWidth * 0.44, box.clientHeight * 0.46);

        if (!state.active) state.ry += state.vx;
        state.rx = Math.max(-0.55, Math.min(0.55, state.rx));

        const cosY = Math.cos(state.ry);
        const sinY = Math.sin(state.ry);
        const cosX = Math.cos(state.rx);
        const sinX = Math.sin(state.rx);

        points.forEach((point, i) => {
          const chip = chips.current[i];
          if (!chip) return;

          /* Rotate around Y, then X. */
          const x1 = point.x * cosY - point.z * sinY;
          const z1 = point.x * sinY + point.z * cosY;
          const y2 = point.y * cosX - z1 * sinX;
          const z2 = point.y * sinX + z1 * cosX;

          /* Perspective: nearer chips are larger and brighter. */
          const depth = (z2 + 1.6) / 2.6;
          const scale = 0.62 + depth * 0.52;

          chip.style.transform = `translate3d(calc(${(x1 * radius).toFixed(1)}px - 50%), calc(${(
            y2 * radius
          ).toFixed(1)}px - 50%), 0) scale(${scale.toFixed(3)})`;
          chip.style.opacity = (0.3 + depth * 0.7).toFixed(3);
          chip.style.zIndex = String(Math.round(depth * 100));
        });
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    const box = container.current;

    const onPointerDown = (e: PointerEvent) => {
      state.active = true;
      state.pointerX = e.clientX;
      box?.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!state.active) return;
      const dx = e.clientX - state.pointerX;
      state.pointerX = e.clientX;
      state.ry += dx * 0.006;
      state.vx = Math.max(-0.02, Math.min(0.02, dx * 0.0012)) || state.vx;
    };

    const onPointerUp = (e: PointerEvent) => {
      state.active = false;
      box?.releasePointerCapture(e.pointerId);
    };

    box?.addEventListener('pointerdown', onPointerDown);
    box?.addEventListener('pointermove', onPointerMove);
    box?.addEventListener('pointerup', onPointerUp);
    box?.addEventListener('pointercancel', onPointerUp);

    return () => {
      cancelAnimationFrame(frame);
      box?.removeEventListener('pointerdown', onPointerDown);
      box?.removeEventListener('pointermove', onPointerMove);
      box?.removeEventListener('pointerup', onPointerUp);
      box?.removeEventListener('pointercancel', onPointerUp);
    };
  }, [orbiting, skills.length]);

  const chipClass =
    'rounded-full border border-line bg-surface/60 px-5 py-2.5 text-sm font-semibold text-ink backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold';

  if (!orbiting) {
    return (
      <ul aria-label={label} className="mt-12 flex flex-wrap justify-center gap-3">
        {skills.map((skill) => (
          <li key={skill} className={chipClass}>
            {skill}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={container}
      className="relative mx-auto mt-10 h-[24rem] w-full max-w-2xl cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[28rem]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(22rem_22rem_at_50%_50%,rgb(245_197_24/0.07),transparent_70%)]"
      />
      <ul aria-label={label} className="absolute inset-0">
        {skills.map((skill, i) => (
          <li
            key={skill}
            ref={(node) => {
              chips.current[i] = node;
            }}
            className={`absolute top-1/2 left-1/2 whitespace-nowrap will-change-transform ${chipClass}`}
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
