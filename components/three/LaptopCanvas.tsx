'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';

import Laptop from './Laptop';

export default function LaptopCanvas({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.7, 6.4], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#e8ddff" />
      {/* The gold rim that ties the object to the brand. */}
      <directionalLight position={[-5, 2, -3]} intensity={2.2} color="#f5c518" />

      <Suspense fallback={null}>
        <Laptop progress={progress} />
      </Suspense>
    </Canvas>
  );
}
