'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/* Decides whether this visitor gets WebGL at all.

   Deliberately conservative: reduced-motion and small or low-core devices
   fall back to static markup rather than paying for a canvas. The check runs
   after mount, so the server-rendered HTML is always the fallback — which is
   also what a crawler sees. */

let webglSupport: boolean | null = null;

function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;

  try {
    const canvas = document.createElement('canvas');
    webglSupport = Boolean(
      canvas.getContext('webgl2') ?? canvas.getContext('webgl'),
    );
  } catch {
    webglSupport = false;
  }

  return webglSupport;
}

export function useCapability() {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [roomy, setRoomy] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const cores = navigator.hardwareConcurrency ?? 8;

    const evaluate = () => setRoomy(query.matches && cores > 4 && supportsWebGL());

    evaluate();
    setReady(true);
    query.addEventListener('change', evaluate);
    return () => query.removeEventListener('change', evaluate);
  }, []);

  const allow3D = ready && roomy && !reduce;

  return { allow3D, reduce: Boolean(reduce), ready };
}
