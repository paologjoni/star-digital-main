/* The scroll choreography for the pinned MacBook scene, in one place.

   Both the WebGL object and the DOM captions beside it read these timings.
   They used to live inside the render loop, which meant the text could only
   be kept in step with the screen by copying the numbers — and copied numbers
   drift the first time one side is tuned. */

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Eased piecewise ramp through [progress, value] keyframes. */
export function ramp(p: number, stops: [number, number][]): number {
  if (p <= stops[0][0]) return stops[0][1];

  for (let i = 0; i < stops.length - 1; i++) {
    const [x0, y0] = stops[i];
    const [x1, y1] = stops[i + 1];
    if (p <= x1) return y0 + (y1 - y0) * smoothstep(x0, x1, p);
  }

  return stops[stops.length - 1][1];
}

export const LID_CLOSED = -Math.PI / 2;
export const LID_OPEN = -0.28;

/* Dwell on each project, then switch quickly. */
const SLOT_STOPS: [number, number][] = [
  [0.3, 0],
  [0.46, 0],
  [0.53, 1],
  [0.68, 1],
  [0.75, 2],
  [1.0, 2],
];

const TURN_STOPS: [number, number][] = [
  [0.0, 0.0],
  [0.32, 0.0],
  [0.5, -0.42],
  [0.66, 0.0],
  [0.8, 0.38],
  [0.94, 0.05],
];

const DOLLY_STOPS: [number, number][] = [
  [0.0, 0.4],
  [0.2, 0.0],
  [0.84, 0.0],
  [1.0, -3.6],
];

export const lidAngle = (p: number) =>
  LID_CLOSED + (LID_OPEN - LID_CLOSED) * smoothstep(0.1, 0.32, p);

export const turn = (p: number) => ramp(p, TURN_STOPS);
export const dolly = (p: number) => ramp(p, DOLLY_STOPS);

/** 0 while the lid is shut, 1 once the screen is awake. */
export const wake = (p: number) => smoothstep(0.14, 0.34, p);

/** Falls to 0 as the whole object recedes at the end of the scene. */
export const fadeOut = (p: number) => 1 - smoothstep(0.86, 1, p);

/** Continuous position between the three projects. */
export const slot = (p: number) => clamp(ramp(p, SLOT_STOPS), 0, 2);

/** Which project is showing. */
export const activeIndex = (p: number) => clamp(Math.round(slot(p)), 0, 2);

/** Per-screen opacity: steep, so two screenshots are never both half-visible. */
export const screenWeight = (p: number, index: number) =>
  clamp(1 - Math.abs(slot(p) - index) * 2.4, 0, 1) * wake(p) * fadeOut(p);

/** Scroll cue opacity: held for the whole pinned scene, since the pin lasts
    three viewports and the instruction is true for every one of them. It
    leaves only with the object, on the same recede as everything else. */
export const hintPresence = (p: number) => fadeOut(p);

/** Caption opacity: present while settled on a project, gone mid-switch. */
export function captionPresence(p: number): number {
  const distance = Math.abs(slot(p) - activeIndex(p));
  return (1 - smoothstep(0.06, 0.28, distance)) * wake(p) * fadeOut(p);
}
