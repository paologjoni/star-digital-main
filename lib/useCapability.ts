'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/* Decides whether this visitor gets WebGL at all.

   Reduced-motion and low-core devices fall back to static markup rather than
   paying for a canvas. The check runs after mount, so the server-rendered HTML
   is always the fallback — which is also what a crawler sees.

   Screen width used to be part of the gate, which meant phones — most of the
   traffic — never saw the scene at all. Width is now reported separately as
   `compact` so the canvas can render cheaper there instead of not at all; the
   core count still keeps the weakest devices out. */

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
  const [capable, setCapable] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const cores = navigator.hardwareConcurrency ?? 8;

    const evaluate = () => {
      setCapable(cores > 3 && supportsWebGL());
      setCompact(!query.matches);
    };

    evaluate();
    setReady(true);
    query.addEventListener('change', evaluate);
    return () => query.removeEventListener('change', evaluate);
  }, []);

  const allow3D = ready && capable && !reduce;

  return { allow3D, compact, reduce: Boolean(reduce), ready };
}
