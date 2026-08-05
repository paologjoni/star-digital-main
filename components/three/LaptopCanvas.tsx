'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';

import Laptop from './Laptop';

export default function LaptopCanvas({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.35, 5.6], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.6} />
      {/* Fill from below-front so the deck reads as metal rather than a
          silhouette against the dark background. */}
      <pointLight position={[0, -2, 4]} intensity={12} color="#7b5cc4" distance={12} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#e8ddff" />
      {/* The gold rim that ties the object to the brand. */}
      <directionalLight position={[-5, 2, -3]} intensity={2.2} color="#f5c518" />

      <Suspense fallback={null}>
        <Laptop progress={progress} />
      </Suspense>
    </Canvas>
  );
}
