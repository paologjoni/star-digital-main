/* Every dimension of the machine, and the keyboard that sits in it.

   Proportions are taken off a 14" MacBook Pro and expressed as ratios of the
   chassis width, so the whole object scales from one number. The previous
   model was assembled from eyeballed constants and read as a toy for a
   specific reason: it was too thin for its footprint, its keys were a uniform
   grid of 14x5 boxes, and nothing had a chamfer. All three are fixed here. */

/** 16:10, as the panel actually is. */
export const SCREEN_W = 3.16;
export const SCREEN_H = 1.975;

export const CHASSIS_W = 3.34;
export const CHASSIS_D = 2.28;
/* 0.61" over a 12.3" width on the real machine. The old 0.1 was proportionally
   thinner than an Air and was most of why the thing looked cheap. */
export const CHASSIS_H = 0.163;

/* No wedge: the taper belongs to the Air. A Pro — which is what the notch and
   the full-height function row make this — is a uniform slab. */

export const HINGE_Z = -CHASSIS_D / 2;
export const DECK_Y = CHASSIS_H / 2;

export const TRACKPAD_W = 1.24;
export const TRACKPAD_D = 0.82;
export const TRACKPAD_Z = 0.6;

export const GRILLE_W = 0.28;

/* Key well: 14.5 units across on every row, six rows deep. */
export const KEY_UNITS = 14.5;
export const KEY_ROWS = 6;
export const KEYBED_W = 2.58;
export const UNIT = KEYBED_W / KEY_UNITS;
export const KEYBED_D = UNIT * KEY_ROWS;
/* Back edge of the key well, just clear of the hinge. */
export const KEYBED_Z = -0.97;

export const KEY_GAP = 0.11;
export const KEY_H = 0.016;

export interface Key {
  /** Centre, in deck-local world units. */
  x: number;
  z: number;
  w: number;
  d: number;
  label: string;
}

/* Widths in units, US layout. Each row totals 14.5. `arrows` expands into the
   inverted-T cluster, whose up and down keys are half depth. */
type Slot = [width: number, label: string];

const ROWS: Slot[][] = [
  [[1.5, 'esc'], ...'123456789'.split('').map((n): Slot => [1, `F${n}`]),
   [1, 'F10'], [1, 'F11'], [1, 'F12'], [1, '']],
  [[1, '`'], [1, '1'], [1, '2'], [1, '3'], [1, '4'], [1, '5'], [1, '6'],
   [1, '7'], [1, '8'], [1, '9'], [1, '0'], [1, '-'], [1, '='], [1.5, 'delete']],
  [[1.5, 'tab'], [1, 'Q'], [1, 'W'], [1, 'E'], [1, 'R'], [1, 'T'], [1, 'Y'],
   [1, 'U'], [1, 'I'], [1, 'O'], [1, 'P'], [1, '['], [1, ']'], [1, '\\']],
  [[1.75, 'caps'], [1, 'A'], [1, 'S'], [1, 'D'], [1, 'F'], [1, 'G'], [1, 'H'],
   [1, 'J'], [1, 'K'], [1, 'L'], [1, ';'], [1, "'"], [1.75, 'return']],
  [[2.25, 'shift'], [1, 'Z'], [1, 'X'], [1, 'C'], [1, 'V'], [1, 'B'], [1, 'N'],
   [1, 'M'], [1, ','], [1, '.'], [1, '/'], [2.25, 'shift']],
  [[1, 'fn'], [1, 'ctrl'], [1, 'opt'], [1.25, 'cmd'], [5, ''], [1.25, 'cmd'],
   [1, 'opt'], [3, 'arrows']],
];

/** The key bed, as rectangles centred on the deck origin. */
export function buildKeys(): Key[] {
  const keys: Key[] = [];
  const left = -KEYBED_W / 2;
  const front = KEYBED_Z;

  ROWS.forEach((row, rowIndex) => {
    const z = front + UNIT * (rowIndex + 0.5);
    let cursor = 0;

    for (const [width, label] of row) {
      const w = UNIT * width - UNIT * KEY_GAP;
      const d = UNIT - UNIT * KEY_GAP;

      if (label === 'arrows') {
        /* Inverted T: full-height left and right, up and down stacked in the
           middle slot at half depth each. */
        const unit = UNIT - UNIT * KEY_GAP;
        const centre = left + UNIT * (cursor + 1.5);
        keys.push({ x: centre - UNIT, z, w: unit, d, label: '' });
        keys.push({ x: centre + UNIT, z, w: unit, d, label: '' });
        keys.push({ x: centre, z: z - UNIT / 4, w: unit, d: d / 2 - UNIT * 0.04, label: '' });
        keys.push({ x: centre, z: z + UNIT / 4, w: unit, d: d / 2 - UNIT * 0.04, label: '' });
      } else {
        keys.push({ x: left + UNIT * (cursor + width / 2), z, w, d, label });
      }

      cursor += width;
    }
  });

  return keys;
}
