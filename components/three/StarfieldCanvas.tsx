'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* A drifting point cloud with a slow cursor parallax. Two shells at different
   depths give the field some volume without a second draw call each frame. */

function Stars({ count = 1400 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      /* Distribute in a slab rather than a sphere: the camera looks straight
         down -Z, so depth spread matters more than a round silhouette. */
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = -Math.random() * 14;
      sizes[i] = Math.random() * 0.045 + 0.012;
    }

    return { positions, sizes };
  }, [count]);

  useFrame((state, delta) => {
    const mesh = points.current;
    if (!mesh) return;

    const { x, y } = state.pointer;
    mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, x * 0.12, 2.2, delta);
    mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, -y * 0.08, 2.2, delta);
    mesh.position.y += delta * 0.045;

    /* Recycle the field so the upward drift never runs out of stars. */
    if (mesh.position.y > viewport.height) mesh.position.y = -viewport.height;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        depthWrite={false}
        size={0.05}
        sizeAttenuation
        color="#ffffff"
        opacity={0.75}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function StarfieldCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <Stars />
    </Canvas>
  );
}
