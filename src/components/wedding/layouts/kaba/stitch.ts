/*
 * The geometry of Kaba Velvet's gold-thread embroidery, as SVG path data.
 * Everything is plain strings built once at import, so the ornaments stay
 * server components and cost no script. Motifs are drawn in their own boxes:
 * the corner flourish in 100 × 100 (the top-left corner; the others are the
 * same drawing flipped), the medallion in 200 × 200 and the rule in 240 × 28.
 *
 * Each motif has a "needle" path: one continuous stroke along its spine. As
 * the mask of the motif it traces itself in (data-reveal="draw"), so the
 * embroidery appears as if stitched along the needle's route; every motif
 * animates exactly one path.
 */

export type Pt = readonly [number, number];
/** One cubic Bézier segment: two control points and the end point. */
export type Seg = readonly [Pt, Pt, Pt];
/** A smooth stem: a start point and the cubic segments that follow it. */
export type Spine = { start: Pt; segs: readonly Seg[] };

const round = (value: number) => Math.round(value * 100) / 100;
const pt = ([x, y]: Pt) => `${round(x)} ${round(y)}`;
const rad = (degrees: number) => (degrees * Math.PI) / 180;

/** The spine as path data; `move` false continues the current subpath with a line to its start. */
export function spinePath(spine: Spine, move = true): string {
  const head = move ? `M${pt(spine.start)}` : `L${pt(spine.start)}`;
  return head + spine.segs.map(([c1, c2, end]) => `C${pt(c1)} ${pt(c2)} ${pt(end)}`).join("");
}

/** The same curve walked from its end back to its start. */
export function reverseSpine(spine: Spine): Spine {
  const points = [spine.start, ...spine.segs.map((seg) => seg[2])];
  const segs = spine.segs.map((seg, index): Seg => [seg[1], seg[0], points[index]]).reverse();
  return { start: points[points.length - 1], segs };
}

/** Every point of the spine moved by `map` (a mirror, say). */
export function mapSpine(spine: Spine, map: (point: Pt) => Pt): Spine {
  return { start: map(spine.start), segs: spine.segs.map((seg): Seg => [map(seg[0]), map(seg[1]), map(seg[2])]) };
}

/** Mirror across the corner's diagonal: the top vine becomes the left one. */
export const swapXY = ([x, y]: Pt): Pt => [y, x];

/** A point on segment `index` of the spine at t (0–1), and the direction it travels there in degrees. */
export function pointOn(spine: Spine, index: number, t: number): { at: Pt; angle: number } {
  const from = index === 0 ? spine.start : spine.segs[index - 1][2];
  const [c1, c2, to] = spine.segs[index];
  const u = 1 - t;
  const axis = (k: 0 | 1) => u * u * u * from[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t * t * t * to[k];
  const slope = (k: 0 | 1) => 3 * u * u * (c1[k] - from[k]) + 6 * u * t * (c2[k] - c1[k]) + 3 * t * t * (to[k] - c2[k]);
  return { at: [axis(0), axis(1)], angle: (Math.atan2(slope(1), slope(0)) * 180) / Math.PI };
}

/** An almond leaf from `base` pointing along `angle` degrees (y down), as a closed subpath. */
export function leaf(base: Pt, angle: number, length: number, bulge: number): string {
  const dx = Math.cos(rad(angle));
  const dy = Math.sin(rad(angle));
  const [x, y] = base;
  const mx = x + (dx * length) / 2;
  const my = y + (dy * length) / 2;
  const tip: Pt = [x + dx * length, y + dy * length];
  const side = (sign: 1 | -1): Pt => [mx - dy * bulge * sign, my + dx * bulge * sign];
  return `M${pt(base)}Q${pt(side(1))} ${pt(tip)}Q${pt(side(-1))} ${pt(base)}Z`;
}

/** A diamond (lozenge) centred on (x, y), as a closed subpath. */
export const lozenge = ([x, y]: Pt, r: number) => `M${pt([x, y - r])}L${pt([x + r, y])}L${pt([x, y + r])}L${pt([x - r, y])}Z`;

/** A full circle as one closed subpath, starting at the top and running clockwise. */
export const ring = ([x, y]: Pt, r: number) =>
  `M${pt([x, y - r])}A${round(r)} ${round(r)} 0 1 1 ${pt([x, y + r])}A${round(r)} ${round(r)} 0 1 1 ${pt([x, y - r])}Z`;

/** A small dot (a French knot) as a closed subpath, for fills. */
export const knot = (at: Pt, r: number) => ring(at, r);

const polar = ([cx, cy]: Pt, r: number, degrees: number): Pt => [cx + r * Math.cos(rad(degrees)), cy + r * Math.sin(rad(degrees))];

/* ------------------------------------------------------------------ */
/* Corner flourish (top-left, in 100 × 100)                             */
/* ------------------------------------------------------------------ */

const JEWEL: Pt = [12, 12];

/** The vine along the top edge: a wave that ends in a curl turning in toward the panel. */
const TOP_VINE: Spine = {
  start: [23.5, 12],
  segs: [
    [[30, 12], [32, 5.5], [40, 5.5]],
    [[48, 5.5], [50, 14], [58, 14]],
    [[66, 14], [68, 6.5], [76, 6.5]],
    [[84, 6.5], [89.5, 11], [87.5, 16]],
    [[85.5, 21], [78, 21], [78, 16]],
    [[78, 12.6], [82, 12], [83.4, 14.6]],
  ],
};
const LEFT_VINE = mapSpine(TOP_VINE, swapXY);

/** Leaves on the top vine, alternating sides: [segment, t, turn from the stem, length]. */
const TOP_LEAVES: [number, number, number, number][] = [
  [0, 0.6, 58, 12.5],
  [1, 0.25, -62, 8.5],
  [1, 0.62, 60, 11],
  [2, 0.5, -60, 9.5],
  [2, 0.85, 62, 11],
  [3, 0.3, -48, 8],
];

function leavesOn(spine: Spine) {
  return TOP_LEAVES.map(([index, t, turn, length]) => {
    const { at, angle } = pointOn(spine, index, t);
    return leaf(at, angle + turn, length, length * 0.34);
  }).join("");
}

/** The mirrored vine turns the other way, so its leaves flip their turn too. */
function leavesOnLeft() {
  return TOP_LEAVES.map(([index, t, turn, length]) => {
    const { at, angle } = pointOn(LEFT_VINE, index, t);
    return leaf(at, angle - turn, length, length * 0.34);
  }).join("");
}

/** A small scroll below the diagonal; mirrored, the pair opens like a bud from the jewel. */
const SCROLL: Spine = {
  start: [19.5, 25],
  segs: [
    [[21.5, 34], [30.5, 39.5], [37.5, 35.5]],
    [[41.5, 33], [40.5, 27.5], [36.5, 27.5]],
  ],
};

const DIAGONAL_KNOTS: [Pt, number][] = [
  [[30, 30], 1.9],
  [[41, 41], 2.1],
  [[46.5, 46.5], 1.4],
  [[50.8, 50.8], 1],
];

export const CORNER = {
  /** The two vines, couched gold cord. */
  vines: spinePath(TOP_VINE) + spinePath(LEFT_VINE),
  /** Satin-stitched leaves. */
  leaves: leavesOn(TOP_VINE) + leavesOnLeft(),
  /** The scroll pair on the diagonal, couched like the vines. */
  scrolls: spinePath(SCROLL) + spinePath(mapSpine(SCROLL, swapXY)),
  /** The corner jewel, pierced, with a knot at its heart, inside a corded lozenge. */
  jewel: lozenge(JEWEL, 7.5) + lozenge(JEWEL, 3.6),
  jewelHeart: knot(JEWEL, 1.5),
  jewelSetting: lozenge(JEWEL, 11.5),
  /** French knots down the diagonal, and one in each curl. */
  knots:
    DIAGONAL_KNOTS.map(([at, r]) => knot(at, r)).join("") + knot([82.5, 16.8], 1.3) + knot([16.8, 82.5], 1.3),
  /**
   * The needle: from the top curl back along the top vine to the jewel, out
   * along the diagonal and back, then down the left vine to its curl. One
   * subpath, so it draws as one continuous thread.
   */
  needle:
    spinePath(reverseSpine(TOP_VINE)) +
    `L${pt(JEWEL)}L${pt([52, 52])}L${pt(JEWEL)}` +
    spinePath(LEFT_VINE, false),
};

/* ------------------------------------------------------------------ */
/* Medallion (in 200 × 200): a couched cord rim, a scalloped running     */
/* stitch, knots in the dips and a fine inner ring around the window.    */
/* ------------------------------------------------------------------ */

const CENTRE: Pt = [100, 100];
const PETALS = 24;

/** A ring of pointed petals between two radii, each a closed subpath, for a satin fill. */
function petalRing(count: number, inner: number, outer: number, width: number): string {
  let d = "";
  for (let i = 0; i < count; i++) {
    const angle = -90 + (i * 360) / count;
    const foot = polar(CENTRE, inner, angle);
    const tip = polar(CENTRE, outer, angle);
    const left = polar(CENTRE, (inner + outer) / 2, angle - width);
    const right = polar(CENTRE, (inner + outer) / 2, angle + width);
    d += `M${pt(foot)}Q${pt(left)} ${pt(tip)}Q${pt(right)} ${pt(foot)}Z`;
  }
  return d;
}

export const MEDALLION = {
  /** The window inside the rings, as a share of the box: photos and initials sit within it. */
  window: 0.74,
  rim: ring(CENTRE, 96.5),
  petals: petalRing(PETALS, 82.5, 95, 5.4),
  knots: Array.from({ length: PETALS }, (_, i) => knot(polar(CENTRE, 91, -90 + ((i + 0.5) * 360) / PETALS), 1.3)).join(""),
  cord: ring(CENTRE, 81),
  stitch: ring(CENTRE, 77.5),
  /** One circle through the middle of the band, from the top, clockwise. */
  needle: ring(CENTRE, 87),
};

/** A laurel inside the medallion, for the monogram: a ring of stem with leaf pairs all round, and its needle. */
export const WREATH = (() => {
  const count = 16;
  const radius = 63;
  let leaves = "";
  for (let i = 0; i < count; i++) {
    const angle = -90 + (i * 360) / count;
    const base = polar(CENTRE, radius, angle);
    // Leaves run clockwise along the stem, one tilted out and one in.
    leaves += leaf(base, angle + 90 - 32, 12, 3.9) + leaf(base, angle + 90 + 32, 12, 3.9);
  }
  return { stem: ring(CENTRE, radius), leaves };
})();

/* ------------------------------------------------------------------ */
/* Rule (in 240 × 28): a lozenge between knots, a short vine either side */
/* with a leaf on each wave, fading into a running stitch.              */
/* ------------------------------------------------------------------ */

const MID: Pt = [120, 14];
const RULE_VINE: Spine = {
  start: [105, 14],
  segs: [
    [[99, 14], [97, 8], [91, 8]],
    [[85, 8], [83, 20], [77, 20]],
    [[71, 20], [69, 14], [63, 14]],
  ],
};
const mirrorRule = ([x, y]: Pt): Pt => [240 - x, y];
const RULE_VINE_RIGHT = mapSpine(RULE_VINE, mirrorRule);

function ruleLeaves(): string {
  const left = [leaf([91, 8], 205, 9.5, 3.3), leaf([77, 20], 155, 9.5, 3.3)];
  const right = [leaf([149, 8], -25, 9.5, 3.3), leaf([163, 20], 25, 9.5, 3.3)];
  return [...left, ...right].join("");
}

export const RULE = {
  vines: spinePath(RULE_VINE) + spinePath(RULE_VINE_RIGHT),
  leaves: ruleLeaves(),
  /** The running stitch out to each end. */
  stitch: `M59 14H6M181 14H234`,
  jewel: lozenge(MID, 7) + lozenge(MID, 3),
  knots: knot([108.5, 14], 1.5) + knot([131.5, 14], 1.5) + knot([3, 14], 1.2) + knot([237, 14], 1.2),
  /** Left to right in one pass. */
  needle: "M-6 14H246",
};
