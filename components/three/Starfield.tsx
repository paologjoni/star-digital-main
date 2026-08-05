'use client';

import dynamic from 'next/dynamic';

import { useCapability } from '@/lib/useCapability';
import CssStars from './CssStars';

/* WebGL never reaches the server bundle: the canvas chunk is fetched only
   after mount, and only for visitors the capability check clears. */
const StarfieldCanvas = dynamic(() => import('./StarfieldCanvas'), { ssr: false });

export default function Starfield({ className = '' }: { className?: string }) {
  const { allow3D } = useCapability();

  return (
    <div aria-hidden="true" className={className}>
      {allow3D ? <StarfieldCanvas /> : <CssStars className="absolute inset-0" />}
    </div>
  );
}
