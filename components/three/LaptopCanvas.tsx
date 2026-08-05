'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import type { MotionValue } from 'motion/react';

import MacBook from './MacBook';

export default function LaptopCanvas({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.35, 5.6], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Metal is nothing but reflections. Lit by lamps alone the anodised
          chassis renders as a black slab — which is exactly how it looked
          before this was added. The environment is built here out of
          lightformers and baked once, rather than fetched as an HDR from
          someone else's CDN. */}
      <Environment resolution={256} frames={1}>
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
          intensity={3.2}
          color="#f5c518"
          position={[-6, 1.5, 1]}
          scale={[5, 7, 1]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color="#9a7bf0"
          position={[6, 0, 1]}
          scale={[5, 7, 1]}
          rotation={[0, -Math.PI / 2, 0]}
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

      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 5]} intensity={0.8} color="#e8ddff" />
      {/* The gold rim that ties the object to the brand. */}
      <directionalLight position={[-5, 2, -3]} intensity={1.5} color="#f5c518" />

      <Suspense fallback={null}>
        <MacBook progress={progress} />
      </Suspense>
    </Canvas>
  );
}
