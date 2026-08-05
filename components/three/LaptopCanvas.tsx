'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';

import MacBook from './MacBook';

/* Sits inside the Suspense boundary and does nothing but exist. React only
   mounts a suspended tree's children once every promise in it has settled, so
   this effect is the earliest honest moment to say the object is on screen —
   earlier than any timer, and without polling a loader store. */
function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function LaptopCanvas({
  progress,
  compact = false,
  onReady,
}: {
  progress: MotionValue<number>;
  compact?: boolean;
  onReady?: () => void;
}) {
  return (
    /* Resolution is the whole ballgame for how this reads. The object is a
       slab of hard edges and a panel of fine text, and both alias badly — the
       previous 1.75 cap on a 2x display meant every straight edge on the
       chassis was being reconstructed from fewer samples than the screen had
       pixels to show it with, which is the "pixelated" everyone sees first.

       Phones still render cheaper, but no longer render *rougher*: the cap
       comes down to 2 and MSAA stays on everywhere. Dropping antialiasing was
       saving a few milliseconds and costing the object its edges. */
    <Canvas
      dpr={compact ? [1, 2] : [1, 2.5]}
      camera={{ position: [0, 0.35, 5.6], fov: 42 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.92,
      }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Metal is nothing but reflections. Lit by lamps alone the anodised
          chassis renders as a black slab — which is exactly how it looked
          before this was added. The environment is built here out of
          lightformers and baked once, rather than fetched as an HDR from
          someone else's CDN.

          The two thin overhead strips are the ones doing the real work: a
          machined edge only reads as machined when a small, bright source
          runs a hard specular line down it. Broad soft panels alone gave the
          flat, matte look the chassis had. */}
      <Environment resolution={compact ? 256 : 512} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#ffffff"
          position={[0, 5, 2]}
          scale={[10, 5, 1]}
          rotation={[-Math.PI / 2.6, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={7}
          color="#ffffff"
          position={[-1.6, 4, 1.4]}
          scale={[0.35, 6, 1]}
          rotation={[-Math.PI / 2.2, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={5}
          color="#ffffff"
          position={[1.9, 4, 1.4]}
          scale={[0.3, 6, 1]}
          rotation={[-Math.PI / 2.2, 0, 0]}
        />
        {/* Brand colour, rationed. A polished metal takes its colour almost
            entirely from what is around it, so the broad gold panel that used
            to sit here did not tint the chassis — it replaced it, and the deck
            rendered as a slab of gold rather than aluminium. Narrow and dimmer,
            it does what it was meant to do: run an accent down one edge. */}
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#f5c518"
          position={[-6, 1.2, 0.5]}
          scale={[1.6, 7, 1]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1}
          color="#9a7bf0"
          position={[6, 0, 0.5]}
          scale={[1.6, 7, 1]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        {/* Neutral flanks, so the shell has plain daylight to reflect between
            the two accents and reads as silver. */}
        <Lightformer
          form="rect"
          intensity={0.85}
          color="#ffffff"
          position={[-4.5, 0.5, 3]}
          scale={[5, 6, 1]}
          rotation={[0, Math.PI / 3, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.85}
          color="#ffffff"
          position={[4.5, 0.5, 3]}
          scale={[5, 6, 1]}
          rotation={[0, -Math.PI / 3, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#ffffff"
          position={[0, -3, 3]}
          scale={[8, 3, 1]}
          rotation={[Math.PI / 3, 0, 0]}
        />
      </Environment>

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={0.9} color="#f2ecff" />
      {/* The gold rim that ties the object to the brand — a grazing kicker
          from behind, not a wash across the deck. */}
      <directionalLight position={[-5, 2, -3]} intensity={0.55} color="#f5c518" />

      <Suspense fallback={null}>
        <MacBook progress={progress} compact={compact} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
