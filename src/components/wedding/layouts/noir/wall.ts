/**
 * Where each photo hangs on the Noir gallery wall. Pure data, so the
 * placement can be tested without rendering.
 *
 * Wide screens: a twelve-column grid hung in groups of five, one large piece
 * beside four smaller ones, the large piece alternating sides; whatever is
 * left over (one to four pieces) shares a last row evenly. Phones and
 * tablets: two columns, every third frame (and one left alone at the end)
 * across the full width.
 */

/** The wall hangs this many frames; the rest open in the viewer from a button under it. */
export const WALL_SIZE = 12;

/** Grid rows per group of five on wide screens. */
const GROUP_ROWS = 8;

type Spot = { col: number; cols: number; row: number; rows: number };

/*
 * One group, in reading order (by the row each piece starts on): the large
 * piece, a landscape and a portrait across the top, then a landscape and a
 * small one underneath. The mirrored group puts the large piece on the right.
 */
const GROUP: Spot[] = [
  { col: 1, cols: 5, row: 0, rows: 8 },
  { col: 6, cols: 4, row: 0, rows: 4 },
  { col: 10, cols: 3, row: 0, rows: 5 },
  { col: 6, cols: 4, row: 4, rows: 4 },
  { col: 10, cols: 3, row: 5, rows: 3 },
];
const MIRRORED: Spot[] = [
  { col: 1, cols: 3, row: 0, rows: 5 },
  { col: 4, cols: 4, row: 0, rows: 4 },
  { col: 8, cols: 5, row: 0, rows: 8 },
  { col: 4, cols: 4, row: 4, rows: 4 },
  { col: 1, cols: 3, row: 5, rows: 3 },
];

/** A last row of one to four pieces: where each starts, how wide, and how many rows tall. */
const LAST_ROW: Record<number, { cols: number; starts: number[]; rows: number }> = {
  1: { cols: 6, starts: [4], rows: 8 },
  2: { cols: 4, starts: [3, 7], rows: 5 },
  3: { cols: 4, starts: [1, 5, 9], rows: 5 },
  4: { cols: 3, starts: [1, 4, 7, 10], rows: 4 },
};

export type Placement = {
  /** Wide screens: 1-based grid column and row lines, and spans. */
  col: number;
  cols: number;
  row: number;
  rows: number;
  /** A large piece, marked with corner diamonds. */
  large: boolean;
  /** Phones: spans both columns. */
  wide: boolean;
};

/** Where photo `index` of `count` (at most WALL_SIZE) hangs. */
export function placement(index: number, count: number): Placement {
  const size = GROUP.length;
  const groups = Math.floor(count / size);
  const group = Math.floor(index / size);
  const wide = index % 3 === 0 || (index === count - 1 && index % 3 === 1);

  if (group < groups) {
    const spot = (group % 2 === 0 ? GROUP : MIRRORED)[index % size];
    return { ...spot, row: group * GROUP_ROWS + spot.row + 1, large: spot.rows === GROUP_ROWS, wide };
  }
  const last = LAST_ROW[count - groups * size];
  return {
    col: last.starts[index - groups * size],
    cols: last.cols,
    row: groups * GROUP_ROWS + 1,
    rows: last.rows,
    large: count === 1,
    wide,
  };
}
