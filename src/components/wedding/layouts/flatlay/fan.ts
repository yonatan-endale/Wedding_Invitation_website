/**
 * How the gallery's prints are dealt into small fans on the linen. Pure
 * data, so the arrangement can be tested without rendering.
 *
 * The prints are dealt into fans of at most three, as evenly as possible, so
 * no fan is left with a single print unless there is only one photo. Within
 * a fan each print turns a little further than the one before, the middle
 * one sits highest and on top, and every other fan is mirrored so the table
 * does not look stamped.
 */

/** The table shows this many prints; the rest open in the viewer from a button under it. */
export const PRINTS_SHOWN = 12;

/** Width over height of a print: a 4:5 photo in a 5% border with a 17% margin at its foot (see .photo). */
export const PRINT_RATIO = 1 / (0.05 + 0.9 * 1.25 + 0.17);

export type Pose = {
  /** Left edge and width, in % of the fan's width. */
  left: number;
  width: number;
  /** Top edge, in % of the fan's width (the fan is a size container). */
  top: number;
  /** Degrees. */
  rotate: number;
  /** Stacking order inside the fan. */
  z: number;
};

export type Fan = {
  /** Index of the fan's first photo in the gallery. */
  start: number;
  poses: Pose[];
  /** The fan's height, in % of its width, with room for the turned corners. */
  height: number;
};

/**
 * Poses for a fan of one, two and three prints, before mirroring. The outer
 * prints keep about 6% clear of the fan's sides for their turned corners.
 */
const LAYOUTS: Record<1 | 2 | 3, Omit<Pose, "z">[]> = {
  1: [{ left: 18, width: 64, top: 3, rotate: -3 }],
  2: [
    { left: 7, width: 52, top: 6, rotate: -6 },
    { left: 41, width: 52, top: 1, rotate: 5 },
  ],
  3: [
    { left: 6, width: 48, top: 7, rotate: -9 },
    { left: 26, width: 48, top: 1, rotate: 1.5 },
    { left: 46, width: 48, top: 6, rotate: 8 },
  ],
};

/** Fan sizes for `count` prints: fans of three, evened out so the last is never a single print. */
export function fanSizes(count: number): number[] {
  if (count <= 0) return [];
  const fans = Math.ceil(count / 3);
  const base = Math.floor(count / fans);
  const extra = count % fans;
  return Array.from({ length: fans }, (_, index) => base + (index < extra ? 1 : 0));
}

/** Deals `count` prints (at most PRINTS_SHOWN are shown) into fans. */
export function dealFans(count: number): Fan[] {
  const sizes = fanSizes(Math.min(count, PRINTS_SHOWN));
  let start = 0;
  return sizes.map((size, fanIndex) => {
    const mirror = fanIndex % 2 === 1;
    const layout = LAYOUTS[size as 1 | 2 | 3];
    const poses = layout.map((pose, index): Pose => {
      // Mirroring flips the turn and the side, so the print order still reads left to right.
      const left = mirror ? 100 - pose.left - pose.width : pose.left;
      return { ...pose, left, rotate: mirror ? -pose.rotate : pose.rotate, z: index === 1 ? 3 : index === 0 ? 2 : 1 };
    });
    if (mirror) poses.reverse();
    const height = Math.max(...poses.map((pose) => pose.top + pose.width / PRINT_RATIO)) + 6;
    const fan = { start, poses, height: Math.round(height * 10) / 10 };
    start += size;
    return fan;
  });
}
