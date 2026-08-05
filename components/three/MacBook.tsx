'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
import {
  CHASSIS_D,
  CHASSIS_H,
  CHASSIS_W,
  DECK_Y,
  GRILLE_W,
  HINGE_Z,
  KEYBED_D,
  KEYBED_W,
  KEYBED_Z,
  KEY_H,
  SCREEN_H,
  SCREEN_W,
  TRACKPAD_D,
  TRACKPAD_W,
  TRACKPAD_Z,
} from './macbook/layout';
import { CHAMFER as CAP_CHAMFER, buildKeycapGeometry } from './macbook/keycaps';
import {
  brushedTexture,
  grilleTexture,
  keyLegendTexture,
  sheenTexture,
} from './macbook/textures';

/* A MacBook Pro, assembled from primitives — no GLB, no asset pipeline, no
   licence, and every dimension tunable in code.

   Deliberately unbranded. Modelling the silhouette is fine; stamping someone
   else's logo on it and putting that on a commercial site is not, so the lid
   carries no mark.

   What earns the resemblance is mostly the small stuff: a real US key layout
   with correctly sized modifiers rather than a uniform grid, chamfered
   keycaps, perforated speaker grilles, machined edges, and anodised aluminium
   whose highlight breaks up along the grain as the object turns. */

const KEYBED_CENTRE_Z = KEYBED_Z + KEYBED_D / 2;

/* Keycaps are extruded with a chamfer at both ends, so the merged bed sits a
   chamfer below its origin and its tops land a chamfer short of KEY_H. The
   legend layer has to be derived from that rather than guessed at: a legend
   floating even a hundredth of a unit proud of its cap slides off the key as
   the machine turns. */
const CAP_BASE_Y = DECK_Y - 0.002;
const CAP_TOP_Y = CAP_BASE_Y + KEY_H - CAP_CHAMFER;

/* The menu-bar band the notch sits in, and the panel left under it. */
const MENUBAR_H = 0.072;
const PANEL_H = SCREEN_H - MENUBAR_H;
const PANEL_Y = 1.07 - MENUBAR_H / 2;

export default function MacBook({
  progress,
  compact = false,
}: {
  progress: MotionValue<number>;
  compact?: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const screens = useRef<(THREE.Mesh | null)[]>([]);
  const sheen = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);

  const gl = useThree((state) => state.gl);
  const width = useThree((state) => state.viewport.width);

  const textures = useTexture(PORTFOLIO.map((project) => project.screenImage));

  /* Fit the machine to the viewport instead of trusting a fixed scale.

     The camera has a fixed vertical FOV, so how much horizontal room exists
     is entirely a function of aspect ratio — on a portrait phone it is less
     than half what a laptop gives, and an unscaled chassis simply ran off both
     edges. Widest extent is the chassis at its turned angle, not its face-on
     width, hence the margin. Capped at 1 so wide screens keep the framing
     they were composed for. */
  const fit = Math.min(1, width / 4.6);

  /* Whatever the GPU will actually give. Textures on this object are seen at a
     glancing angle for most of the scene, which is exactly the case
     anisotropic filtering exists for and exactly where the old hardcoded 8
     was leaving detail on the table. */
  const anisotropy = useMemo(() => gl.capabilities.getMaxAnisotropy(), [gl]);

  /* The screenshots are 16:10, the same shape as the panel, so they map on
     whole. The previous textures were 2.1:1 and had to be cropped to a centred
     slice — which threw away a quarter of their width and then stretched what
     was left, and was the larger half of why the sites looked soft. */
  useMemo(() => {
    for (const texture of textures) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = anisotropy;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      /* The menu-bar band eats a sliver of panel height, so take the same
         sliver off the bottom of the shot rather than squashing the whole page
         into what is left. Sites are read from the top down; the bottom 4% of
         a hero is the part nobody misses. */
      const slice = PANEL_H / SCREEN_H;
      texture.repeat.set(1, slice);
      texture.offset.set(0, 1 - slice);
      texture.needsUpdate = true;
    }
  }, [textures, anisotropy]);

  const keycaps = useMemo(() => buildKeycapGeometry(), []);
  const legends = useMemo(() => keyLegendTexture(anisotropy), [anisotropy]);
  const grille = useMemo(() => grilleTexture(anisotropy), [anisotropy]);
  const brushed = useMemo(() => brushedTexture(anisotropy), [anisotropy]);
  const gloss = useMemo(() => sheenTexture(), []);

  useEffect(() => () => {
    keycaps.dispose();
    legends.dispose();
    grille.dispose();
    brushed.dispose();
    gloss.dispose();
  }, [keycaps, legends, grille, brushed, gloss]);

  useFrame((state, delta) => {
    const p = progress.get();
    const damp = THREE.MathUtils.damp;

    if (lid.current) {
      lid.current.rotation.x = damp(lid.current.rotation.x, lidAngle(p), 5, delta);
    }

    if (root.current) {
      root.current.rotation.y = damp(root.current.rotation.y, turn(p), 4, delta);
      /* Scaled with the object: the dolly is authored against a full-size
         machine, and left absolute it would shove a phone-sized one clean
         through the camera at the end of the scene. */
      root.current.position.z = damp(root.current.position.z, dolly(p) * fit, 4, delta);
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

    const lit = wake(p) * fadeOut(p);
    /* The gloss is a hint that there is glass in front of the panel, not a
       glare — at full strength it hazed the screenshot it sits over. */
    if (sheen.current) {
      (sheen.current.material as THREE.MeshBasicMaterial).opacity = lit * 0.45;
    }
    if (glow.current) glow.current.intensity = lit * 3;
  });

  /* No contact shadow under this machine, deliberately.

     One was fitted and then taken out again: the canvas is transparent over a
     near-black page, and a contact shadow works by darkening what is beneath
     it. There was nothing beneath it to darken, so it rendered an extra depth
     pass and a blur every frame and produced a shadow nobody could see. The
     object is lit to float in a void; the feet and the underside shading are
     what give it weight instead. */

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.32}>
      {/* The -0.7 stand-off scales with the object, or a shrunken machine
          would hang far lower than it was composed to. The lift term is zero
          at full size and only takes effect as `fit` closes in, recovering the
          dead band a phone otherwise leaves above the lid. */}
      <group
        ref={root}
        position={[0, -0.7 * fit + (1 - fit) * 0.55, 0]}
        scale={0.94 * fit}
      >
        {/* Chassis. A generous corner radius and a high smoothness are what
            catch the light along the machined edge; the old 0.042 at
            smoothness 5 gave a hard rim that read as a plastic box. */}
        <RoundedBox
          args={[CHASSIS_W, CHASSIS_H, CHASSIS_D]}
          radius={0.052}
          smoothness={8}
          creaseAngle={0.5}
        >
          {/* Anodised, not polished. Roughness this low turned the deck into a
              mirror that reflected the studio panels straight back at the
              camera as a sheet of blown-out white; a real bead-blasted shell
              scatters far more than that. */}
          <meshPhysicalMaterial
            color="#a4a8b4"
            metalness={0.94}
            roughness={0.46}
            roughnessMap={brushed}
            anisotropy={0.6}
            anisotropyRotation={Math.PI / 2}
            clearcoat={0.25}
            clearcoatRoughness={0.5}
            envMapIntensity={0.85}
          />
        </RoundedBox>

        {/* Milled key well, a hair below the deck so the caps sit in a recess
            rather than on a shelf. */}
        <mesh position={[0, DECK_Y - 0.004, KEYBED_CENTRE_Z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[KEYBED_W + 0.05, KEYBED_D + 0.05]} />
          <meshStandardMaterial color="#101116" metalness={0.5} roughness={0.9} />
        </mesh>

        <mesh geometry={keycaps} position={[0, CAP_BASE_Y, 0]}>
          <meshPhysicalMaterial
            color="#1c1d23"
            metalness={0.15}
            roughness={0.62}
            clearcoat={0.2}
            clearcoatRoughness={0.6}
          />
        </mesh>

        {/* Legends ride just above the caps as their own transparent layer,
            generated from the same layout, so they land dead centre on every
            key without a UV unwrap of the merged bed. */}
        <mesh
          position={[0, CAP_TOP_Y + 0.0004, KEYBED_CENTRE_Z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[KEYBED_W, KEYBED_D]} />
          <meshBasicMaterial
            map={legends}
            transparent
            opacity={0.85}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* Speaker grilles, flanking the key bed. */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * (KEYBED_W / 2 + GRILLE_W / 2 + 0.07), DECK_Y - 0.001, KEYBED_CENTRE_Z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[GRILLE_W, KEYBED_D * 0.92]} />
            <meshStandardMaterial
              color="#0d0e12"
              alphaMap={grille}
              transparent
              metalness={0.3}
              roughness={0.95}
            />
          </mesh>
        ))}

        {/* Trackpad: a slightly larger dark plate under a glass top, which is
            what gives it the hairline seam around its edge. */}
        <mesh position={[0, DECK_Y - 0.0015, TRACKPAD_Z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[TRACKPAD_W + 0.012, TRACKPAD_D + 0.012]} />
          <meshBasicMaterial color="#5c606c" toneMapped={false} />
        </mesh>
        <mesh position={[0, DECK_Y - 0.001, TRACKPAD_Z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[TRACKPAD_W, TRACKPAD_D]} />
          <meshPhysicalMaterial
            color="#6e727f"
            metalness={0.75}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* Feet. Small, but the object sits on a shadow and four dark pads are
            what stop it looking like it is floating over one. */}
        {[-1, 1].map((x) =>
          [-1, 1].map((z) => (
            <mesh
              key={`${x}${z}`}
              position={[x * (CHASSIS_W / 2 - 0.2), -CHASSIS_H / 2 - 0.008, z * (CHASSIS_D / 2 - 0.16)]}
            >
              <cylinderGeometry args={[0.045, 0.042, 0.016, 16]} />
              <meshStandardMaterial color="#131419" roughness={0.85} metalness={0.1} />
            </mesh>
          )),
        )}

        {/* Hinge recess: a dark inset the lid rises out of, rather than a bare
            cylinder bolted across the back. */}
        <mesh position={[0, DECK_Y - 0.012, HINGE_Z + 0.055]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[CHASSIS_W - 0.5, 0.1]} />
          <meshStandardMaterial color="#0b0c10" roughness={0.8} metalness={0.4} />
        </mesh>
        <mesh position={[0, DECK_Y - 0.028, HINGE_Z + 0.04]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, CHASSIS_W - 0.46, 24]} />
          <meshStandardMaterial color="#2b2e37" metalness={0.9} roughness={0.45} />
        </mesh>

        {/* Lid, hinged at the back edge */}
        <group ref={lid} position={[0, DECK_Y - 0.03, HINGE_Z + 0.04]} rotation={[LID_CLOSED, 0, 0]}>
          <RoundedBox
            args={[CHASSIS_W, SCREEN_H + 0.16, 0.056]}
            radius={0.05}
            smoothness={8}
            creaseAngle={0.5}
            position={[0, 1.07, 0]}
          >
            <meshPhysicalMaterial
              color="#a4a8b4"
              metalness={0.94}
              roughness={0.42}
              roughnessMap={brushed}
              anisotropy={0.6}
              clearcoat={0.3}
              clearcoatRoughness={0.45}
              envMapIntensity={0.85}
            />
          </RoundedBox>

          {/* Black glass front, giving the slim bezel */}
          <mesh position={[0, 1.07, 0.029]}>
            <planeGeometry args={[CHASSIS_W - 0.055, SCREEN_H + 0.105]} />
            <meshPhysicalMaterial
              color="#050508"
              metalness={0.1}
              roughness={0.12}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={0.7}
            />
          </mesh>

          {PORTFOLIO.map((project, i) => (
            <mesh
              key={project.key}
              ref={(node) => {
                screens.current[i] = node;
              }}
              position={[0, PANEL_Y, 0.0305 + i * 0.0008]}
            >
              <planeGeometry args={[SCREEN_W, PANEL_H]} />
              <meshBasicMaterial
                map={textures[i]}
                transparent
                opacity={0}
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
          ))}

          {/* Reflection in the glass over the panel. Without it the screenshot
              reads as a sticker on a black rectangle. */}
          <mesh ref={sheen} position={[0, PANEL_Y, 0.034]}>
            <planeGeometry args={[SCREEN_W, PANEL_H]} />
            <meshBasicMaterial
              map={gloss}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          {/* The notch, and the band it lives in.

              The notch alone sat straight on top of the website and read as a
              black smear across its navigation. On the real machine nothing is
              ever underneath it — the menu bar is — so the site is inset below
              a dark band instead, which is both how the hardware behaves and
              the only way the notch stops looking like a bug. */}
          <mesh position={[0, 1.07 + SCREEN_H / 2 - MENUBAR_H / 2, 0.0325]}>
            <planeGeometry args={[SCREEN_W, MENUBAR_H]} />
            <meshBasicMaterial color="#0c0d12" toneMapped={false} />
          </mesh>
          <mesh position={[0, 1.07 + SCREEN_H / 2 - MENUBAR_H / 2, 0.0335]}>
            <planeGeometry args={[0.4, MENUBAR_H]} />
            <meshBasicMaterial color="#050508" toneMapped={false} />
          </mesh>

        </group>

        {/* Screen spill, a sibling of the lid rather than a child of it.

            Parented to the lid it swung forward as the machine opened and
            ended up sitting in front of the glass, where the panel's own
            clearcoat reflected it back as a bright blob in the middle of the
            website. Out here it stays put, low and forward, and does the one
            job it has: throwing a little colour onto the deck. */}
        <pointLight
          ref={glow}
          position={[0, 0.75, 1.5]}
          color="#c9b6ff"
          intensity={0}
          distance={4.5}
          decay={2}
        />
      </group>
    </Float>
  );
}
