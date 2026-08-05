/* The key bed as a single merged geometry.

   Instancing was the obvious choice and the wrong one: a MacBook's keys are
   not one size. Driving an InstancedMesh would mean scaling a shared cap, and
   scaling a chamfered cap stretches its chamfer — the return key would carry a
   visibly fatter edge than the letter beside it. Merging sidesteps that. Every
   cap gets geometry cut to its own size, and the whole bed still costs one
   draw call because none of it ever moves. */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import { KEY_H, buildKeys } from './layout';

const CORNER = 0.012;

/** Exported because the legend layer has to be placed against the cap tops,
    which this shifts. */
export const CHAMFER = 0.0045;

function capShape(width: number, depth: number) {
  const w = width / 2 - CHAMFER;
  const d = depth / 2 - CHAMFER;
  const r = Math.min(CORNER, w * 0.5, d * 0.5);

  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.quadraticCurveTo(w, -d, w, -d + r);
  shape.lineTo(w, d - r);
  shape.quadraticCurveTo(w, d, w - r, d);
  shape.lineTo(-w + r, d);
  shape.quadraticCurveTo(-w, d, -w, d - r);
  shape.lineTo(-w, -d + r);
  shape.quadraticCurveTo(-w, -d, -w + r, -d);
  return shape;
}

export function buildKeycapGeometry(): THREE.BufferGeometry {
  const caps = buildKeys().map((key) => {
    const geometry = new THREE.ExtrudeGeometry(capShape(key.w, key.d), {
      depth: KEY_H - CHAMFER * 2,
      bevelEnabled: true,
      bevelThickness: CHAMFER,
      bevelSize: CHAMFER,
      bevelOffset: 0,
      bevelSegments: 2,
      curveSegments: 4,
    });

    /* Extrusion runs along +Z; the caps need to face up. */
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(key.x, 0, key.z);
    return geometry;
  });

  const merged = mergeGeometries(caps, false);
  for (const cap of caps) cap.dispose();

  merged.computeVertexNormals();
  return merged;
}
