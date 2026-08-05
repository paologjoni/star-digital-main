/* Procedural texture maps, drawn to a canvas at module use rather than
   fetched.

   These are what carry the detail that geometry cannot afford: key legends,
   the perforations in the speaker grilles, and the fine directional grain in
   the anodised aluminium. Painting them beats modelling them by a wide margin
   — a thousand speaker holes is one texture lookup and no triangles — and it
   keeps the object free of any downloaded asset. */

import * as THREE from 'three';

import { KEYBED_D, KEYBED_W, KEYBED_Z, buildKeys } from './layout';

function canvas(width: number, height: number) {
  const element = document.createElement('canvas');
  element.width = width;
  element.height = height;
  return { element, ctx: element.getContext('2d')! };
}

function finish(element: HTMLCanvasElement, anisotropy: number, srgb = false) {
  const texture = new THREE.CanvasTexture(element);
  texture.anisotropy = anisotropy;
  texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** Key legends, laid out from the same data the keycaps are built from — so
    they cannot drift out of register with the caps beneath them. */
export function keyLegendTexture(anisotropy: number) {
  const width = 2048;
  const height = Math.round((width * KEYBED_D) / KEYBED_W);
  const { element, ctx } = canvas(width, height);
  const scale = width / KEYBED_W;

  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const key of buildKeys()) {
    if (!key.label) continue;

    const x = ((key.x + KEYBED_W / 2) / KEYBED_W) * width;
    const y = ((key.z - KEYBED_Z) / KEYBED_D) * height;
    /* Single characters are the legend; words are shrunk and set to the left
       of their cap, which is where a modifier's label actually sits. */
    const word = key.label.length > 1;
    const size = Math.round(scale * (word ? 0.028 : 0.042));

    ctx.font = `500 ${size}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    ctx.fillStyle = '#d8d9de';

    if (word) {
      ctx.textAlign = 'left';
      ctx.fillText(key.label, x - (key.w / KEYBED_W) * width * 0.42, y);
      ctx.textAlign = 'center';
    } else {
      ctx.fillText(key.label, x, y);
    }
  }

  return finish(element, anisotropy, true);
}

/** Perforation mask for the speaker grilles: a staggered dot field, used as an
    alpha map so the holes read as holes rather than as painted dots. */
export function grilleTexture(anisotropy: number) {
  const { element, ctx } = canvas(128, 512);

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 128, 512);
  ctx.fillStyle = '#ffffff';

  const pitch = 11;
  for (let row = 0; row * pitch < 512 + pitch; row++) {
    const offset = row % 2 ? pitch / 2 : 0;
    for (let col = 0; col * pitch + offset < 128; col++) {
      ctx.beginPath();
      ctx.arc(col * pitch + offset + pitch / 2, row * pitch + pitch / 2, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = finish(element, anisotropy);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Roughness variation for the anodised shell.

    Uniform roughness is what makes CG metal look like plastic — a real
    machined surface scatters light unevenly along the direction it was cut.
    Fine horizontal streaks plus a little per-pixel noise give the highlight
    something to break up against as the object turns. */
export function brushedTexture(anisotropy: number) {
  const size = 1024;
  const { element, ctx } = canvas(size, size);

  ctx.fillStyle = '#9a9a9a';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 5200; i++) {
    const y = Math.random() * size;
    const length = 40 + Math.random() * 320;
    const shade = 128 + Math.floor((Math.random() - 0.5) * 70);
    ctx.strokeStyle = `rgba(${shade},${shade},${shade},0.16)`;
    ctx.lineWidth = Math.random() < 0.7 ? 1 : 2;
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, y);
    ctx.lineTo(Math.random() * size + length, y);
    ctx.stroke();
  }

  const texture = finish(element, anisotropy);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/** A soft diagonal sheen laid over the panel, so the screen reads as glass
    under glass rather than as a decal. */
export function sheenTexture() {
  const width = 512;
  const height = 320;
  const { element, ctx } = canvas(width, height);

  const gradient = ctx.createLinearGradient(0, height, width * 0.78, 0);
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.42, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.13)');
  gradient.addColorStop(0.62, 'rgba(255,255,255,0.05)');
  gradient.addColorStop(0.72, 'rgba(255,255,255,0)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return finish(element, 1, true);
}
