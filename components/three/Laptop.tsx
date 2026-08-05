'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, useTexture } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';

import { PORTFOLIO } from '@/content';

/* A laptop assembled from primitives rather than loaded as a GLB: no asset
   pipeline, no licence, a few KB instead of a few MB, and every dimension
   stays tunable in code.

   Scroll choreography, in stage-normalised progress:
     0.00 – 0.10  closed, drifting
     0.10 – 0.32  lid swings open, screen wakes
     0.32 – 0.58  turns left, screen crossfades to project 2
     0.58 – 0.84  turns right, crossfades to project 3
     0.84 – 1.00  dollies back and fades as the portfolio grid takes over */

const CLOSED = -Math.PI / 2;
const OPEN = -0.28;

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Piecewise linear ramp through keyframes, used for the turn and the dolly. */
function ramp(p: number, stops: [number, number][]): number {
  if (p <= stops[0][0]) return stops[0][1];

  for (let i = 0; i < stops.length - 1; i++) {
    const [x0, y0] = stops[i];
    const [x1, y1] = stops[i + 1];
    if (p <= x1) {
      return THREE.MathUtils.lerp(y0, y1, smoothstep(x0, x1, p));
    }
  }

  return stops[stops.length - 1][1];
}

export default function Laptop({ progress }: { progress: MotionValue<number> }) {
  const root = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const screens = useRef<(THREE.Mesh | null)[]>([]);
  const glow = useRef<THREE.PointLight>(null);

  const textures = useTexture(PORTFOLIO.map((project) => project.image));

  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  });

  useFrame((state, delta) => {
    const p = progress.get();
    const damp = THREE.MathUtils.damp;

    if (lid.current) {
      const target = THREE.MathUtils.lerp(CLOSED, OPEN, smoothstep(0.1, 0.32, p));
      lid.current.rotation.x = damp(lid.current.rotation.x, target, 5, delta);
    }

    if (root.current) {
      const turn = ramp(p, [
        [0.0, 0.0],
        [0.32, 0.0],
        [0.5, -0.42],
        [0.66, 0.0],
        [0.8, 0.38],
        [0.94, 0.05],
      ]);
      const dolly = ramp(p, [
        [0.0, 0.4],
        [0.2, 0.0],
        [0.84, 0.0],
        [1.0, -3.6],
      ]);

      root.current.rotation.y = damp(root.current.rotation.y, turn, 4, delta);
      root.current.position.z = damp(root.current.position.z, dolly, 4, delta);
      root.current.rotation.z = damp(
        root.current.rotation.z,
        Math.sin(state.clock.elapsedTime * 0.4) * 0.015,
        3,
        delta,
      );
    }

    /* Screen wake, then a triangular crossfade across the three shots: each
       plane peaks when the continuous slot index passes its own index. */
    const wake = smoothstep(0.14, 0.34, p);
    const fadeOut = 1 - smoothstep(0.86, 1, p);
    /* Plateaus, not a constant ramp: the slot index dwells on each project
       while the laptop turns, then switches over a short window. A linear
       slide spent most of its time between two screenshots. */
    const slot = THREE.MathUtils.clamp(
      ramp(p, [
        [0.3, 0],
        [0.46, 0],
        [0.53, 1],
        [0.68, 1],
        [0.75, 2],
        [1.0, 2],
      ]),
      0,
      2,
    );

    /* Steeper than a linear crossfade so the two screenshots are never both
       half-visible: the screen dims through dark between projects, the way a
       display looks when it switches source. A straight A/B blend read as a
       double exposure. */
    screens.current.forEach((mesh, i) => {
      if (!mesh) return;
      const weight = THREE.MathUtils.clamp(1 - Math.abs(slot - i) * 2.4, 0, 1);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = weight * wake * fadeOut;
    });

    if (glow.current) {
      glow.current.intensity = wake * fadeOut * 5;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
      <group ref={root} position={[0, -0.75, 0]} scale={1.08}>
        {/* Deck */}
        <RoundedBox args={[3.3, 0.13, 2.25]} radius={0.055} smoothness={4}>
          <meshStandardMaterial color="#241546" metalness={0.85} roughness={0.32} />
        </RoundedBox>

        {/* Trackpad and key bed — enough surface detail to read as a laptop
            at this distance without instancing 80 individual keys. */}
        <mesh position={[0, 0.069, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.05, 0.72]} />
          <meshStandardMaterial color="#1a0f38" metalness={0.6} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.069, -0.42]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.85, 1.02]} />
          <meshStandardMaterial color="#160d30" metalness={0.5} roughness={0.6} />
        </mesh>

        {/* Lid — hinged at the back edge of the deck */}
        <group ref={lid} position={[0, 0.06, -1.12]} rotation={[CLOSED, 0, 0]}>
          <RoundedBox
            args={[3.3, 2.15, 0.09]}
            radius={0.05}
            smoothness={4}
            position={[0, 1.07, 0]}
          >
            <meshStandardMaterial color="#241546" metalness={0.85} roughness={0.3} />
          </RoundedBox>

          {PORTFOLIO.map((project, i) => (
            <mesh
              key={project.key}
              ref={(node) => {
                screens.current[i] = node;
              }}
              position={[0, 1.07, 0.05 + i * 0.002]}
            >
              <planeGeometry args={[3.02, 1.87]} />
              <meshBasicMaterial
                map={textures[i]}
                transparent
                opacity={0}
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
          ))}

          {/* The screen's spill light. Kept well clear of the lid — close in,
              it blooms a visible hotspot on the very panel it is meant to be
              cast by. */}
          <pointLight
            ref={glow}
            position={[0, 0.4, 2.8]}
            color="#c9b6ff"
            intensity={0}
            distance={9}
          />
        </group>
      </group>
    </Float>
  );
}
