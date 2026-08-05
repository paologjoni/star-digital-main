'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, useTexture } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';

import { PORTFOLIO } from '@/content';
import {
  LID_CLOSED,
  dolly,
  fadeOut,
  lidAngle,
  screenWeight,
  turn,
  wake,
} from './choreography';

/* A MacBook-alike, assembled from primitives — no GLB, no asset pipeline, no
   licence, and every dimension tunable in code.

   Deliberately unbranded. Modelling the silhouette is fine; stamping someone
   else's logo on it and putting that on a commercial site is not, so the lid
   carries no mark.

   What makes it read as a MacBook rather than a generic laptop: a thin
   uniform aluminium slab, a dark recessed key bed of individually instanced
   keys, an oversized centred trackpad, a visible hinge barrel, very slim
   screen bezels, and the notch. */

/* 16:10 screen, as the real thing. */
const SCREEN_W = 3.16;
const SCREEN_H = 1.975;
const CHASSIS_W = 3.34;
const DECK_D = 2.28;

const ALUMINIUM = '#8f93a3';

export default function MacBook({ progress }: { progress: MotionValue<number> }) {
  const root = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const screens = useRef<(THREE.Mesh | null)[]>([]);
  const keys = useRef<THREE.InstancedMesh>(null);
  const glow = useRef<THREE.PointLight>(null);

  const textures = useTexture(PORTFOLIO.map((project) => project.image));

  /* The screenshots are ~2.1:1; the screen is 1.6:1. Stretching one onto the
     other visibly distorts the site being shown, so sample a full-height,
     centred slice instead — website layouts are centred, so what gets cropped
     is margin. */
  useMemo(() => {
    for (const texture of textures) {
      const image = texture.image as { width: number; height: number } | undefined;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      if (!image?.width || !image?.height) continue;

      const imageAspect = image.width / image.height;
      const screenAspect = SCREEN_W / SCREEN_H;
      const width = Math.min(1, screenAspect / imageAspect);

      texture.repeat.set(width, 1);
      texture.offset.set((1 - width) / 2, 0);
      texture.needsUpdate = true;
    }
  }, [textures]);

  /* Key bed: one instanced draw call for the whole keyboard. */
  const keyLayout = useMemo(() => {
    const positions: [number, number][] = [];
    const cols = 14;
    const rows = 5;
    const width = 2.62;
    const depth = 0.78;
    const gapX = width / cols;
    const gapZ = depth / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push([
          -width / 2 + gapX * (col + 0.5),
          -0.86 + gapZ * (row + 0.5),
        ]);
      }
    }

    return { positions, gapX, gapZ };
  }, []);

  useLayoutEffect(() => {
    const mesh = keys.current;
    if (!mesh) return;

    const matrix = new THREE.Matrix4();
    keyLayout.positions.forEach(([x, z], i) => {
      matrix.makeTranslation(x, 0, z);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [keyLayout]);

  useFrame((state, delta) => {
    const p = progress.get();
    const damp = THREE.MathUtils.damp;

    if (lid.current) {
      lid.current.rotation.x = damp(lid.current.rotation.x, lidAngle(p), 5, delta);
    }

    if (root.current) {
      root.current.rotation.y = damp(root.current.rotation.y, turn(p), 4, delta);
      root.current.position.z = damp(root.current.position.z, dolly(p), 4, delta);
      root.current.rotation.z = damp(
        root.current.rotation.z,
        Math.sin(state.clock.elapsedTime * 0.4) * 0.015,
        3,
        delta,
      );
    }

    screens.current.forEach((mesh, i) => {
      if (!mesh) return;
      (mesh.material as THREE.MeshBasicMaterial).opacity = screenWeight(p, i);
    });

    if (glow.current) glow.current.intensity = wake(p) * fadeOut(p) * 5;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.32}>
      <group ref={root} position={[0, -0.7, 0]} scale={0.94}>
        {/* Chassis — thin, uniform, machined */}
        <RoundedBox args={[CHASSIS_W, 0.1, DECK_D]} radius={0.042} smoothness={5}>
          <meshStandardMaterial color={ALUMINIUM} metalness={0.96} roughness={0.28} />
        </RoundedBox>

        {/* Recessed key well */}
        <mesh position={[0, 0.051, -0.47]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.78, 0.94]} />
          <meshStandardMaterial color="#15161b" metalness={0.4} roughness={0.85} />
        </mesh>

        <instancedMesh
          ref={keys}
          args={[undefined, undefined, keyLayout.positions.length]}
          position={[0, 0.058, 0]}
        >
          <boxGeometry args={[keyLayout.gapX * 0.78, 0.012, keyLayout.gapZ * 0.72]} />
          <meshStandardMaterial color="#26272e" metalness={0.35} roughness={0.7} />
        </instancedMesh>

        {/* Oversized trackpad */}
        <mesh position={[0, 0.052, 0.58]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.16, 0.78]} />
          <meshStandardMaterial color="#4c505d" metalness={0.82} roughness={0.34} />
        </mesh>

        {/* Hinge barrel */}
        <mesh position={[0, 0.045, -1.12]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, CHASSIS_W - 0.12, 20]} />
          <meshStandardMaterial color="#3a3d47" metalness={0.9} roughness={0.4} />
        </mesh>

        {/* Lid, hinged at the back edge */}
        <group ref={lid} position={[0, 0.05, -1.12]} rotation={[LID_CLOSED, 0, 0]}>
          <RoundedBox
            args={[CHASSIS_W, SCREEN_H + 0.17, 0.052]}
            radius={0.042}
            smoothness={5}
            position={[0, 1.09, 0]}
          >
            <meshStandardMaterial color={ALUMINIUM} metalness={0.96} roughness={0.26} />
          </RoundedBox>

          {/* Black glass front, giving the slim bezel */}
          <mesh position={[0, 1.09, 0.027]}>
            <planeGeometry args={[CHASSIS_W - 0.09, SCREEN_H + 0.1]} />
            <meshStandardMaterial color="#08080b" metalness={0.2} roughness={0.34} />
          </mesh>

          {PORTFOLIO.map((project, i) => (
            <mesh
              key={project.key}
              ref={(node) => {
                screens.current[i] = node;
              }}
              position={[0, 1.09, 0.029 + i * 0.001]}
            >
              <planeGeometry args={[SCREEN_W, SCREEN_H]} />
              <meshBasicMaterial
                map={textures[i]}
                transparent
                opacity={0}
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
          ))}

          {/* The notch */}
          <mesh position={[0, 1.09 + SCREEN_H / 2 - 0.035, 0.033]}>
            <planeGeometry args={[0.42, 0.072]} />
            <meshBasicMaterial color="#08080b" toneMapped={false} />
          </mesh>

          {/* Screen spill, kept well forward of the panel it lights */}
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
