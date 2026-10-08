/**
 * The repeating tiles of the Tibeb, Floral and Harag borders, drawn once and used
 * by the site's CSS-mask bands (components/wedding/primitives.tsx) and by the
 * guest card image, which has no CSS masks and paints them as SVG patterns
 * instead. Tiles are authored horizontally, one unit to a pixel of the 28px band;
 * each style sets its own tile size in BORDER_TILES.
 */

/** Which of the theme's three thread colours a layer takes. */
export type Thread = "thread1" | "thread2" | "thread3";
export type BorderLayer = { thread: Thread; shapes: string };

export const TIBEB_LAYERS: BorderLayer[] = [
  {
    thread: "thread1",
    shapes:
      "<g><rect y='4' width='28' height='1'/><rect y='23' width='28' height='1'/><path fill-rule='evenodd' d='M7 7l7 7-7 7-7-7zM7 10.5l3.5 3.5-3.5 3.5-3.5-3.5z'/></g>",
  },
  {
    thread: "thread3",
    shapes:
      "<g><rect x='20' y='8' width='2' height='12'/><rect x='15' y='13' width='12' height='2'/><circle cx='7' cy='14' r='1.5'/></g>",
  },
  {
    thread: "thread2",
    shapes:
      "<g><rect width='28' height='2'/><rect y='26' width='28' height='2'/><rect x='20.25' y='13.25' width='1.5' height='1.5'/><rect x='14.5' y='13' width='1' height='2'/></g>",
  },
];

/** A rosette every tile, joined by a vine with a leaf on each side. */
export const FLORAL_LAYERS: BorderLayer[] = [
  {
    thread: "thread3",
    shapes:
      "<g><circle cx='9' cy='11' r='2.6'/><circle cx='9' cy='17' r='2.6'/><circle cx='6' cy='14' r='2.6'/><circle cx='12' cy='14' r='2.6'/><circle cx='7.2' cy='11.9' r='2.2'/><circle cx='10.8' cy='11.9' r='2.2'/><circle cx='7.2' cy='16.1' r='2.2'/><circle cx='10.8' cy='16.1' r='2.2'/></g>",
  },
  {
    thread: "thread1",
    shapes: "<g><path d='M17 14c3-4 6-4 8-3-1 3-4 5-8 3z'/><path d='M17 14c3 4 6 4 8 3-1-3-4-5-8-3z'/></g>",
  },
  {
    thread: "thread2",
    shapes:
      "<g><path d='M0 14c4 0 5-3 9-3s5 3 9 3 5-3 10-3v1c-5 0-6 3-10 3s-5-3-9-3-5 3-9 3z'/><circle cx='9' cy='14' r='1.3'/></g>",
  },
];

/*
 * Harag, the interlace of Ethiopian manuscripts and church carving. Two strands
 * cross at right angles on the band's centre line (x 8 and 24) and round off
 * at the top and bottom (x 0, 16 and 32), so each passes over at one crossing
 * and under at the next. The under strand stops just short of the over strand
 * on both sides, the gap that shows the weave. A quatrefoil sits in every loop,
 * and rails of checks run along both edges. Strands are stroked in currentColor
 * (black in a mask; the card sets `color` per thread) and run past the tile, so
 * its edges cut them mid-curve and the repeat has no seam.
 */

const HARAG_WIDTH = 32;

/** Two rows of 2×2 checks from y; `shift` moves the first row along by one check. */
const checks = (y: number, shift: 0 | 2) =>
  Array.from(
    { length: HARAG_WIDTH / 4 },
    (_, i) => `M${i * 4 + shift} ${y}h2v2h-2zM${i * 4 + 2 - shift} ${y + 2}h2v2h-2z`,
  ).join("");

/** A four-lobed flower centred on (x, 14). */
const quatrefoil = (x: number) =>
  [
    [0, -1.3],
    [1.3, 0],
    [0, 1.3],
    [-1.3, 0],
  ]
    .map(([dx, dy]) => `<circle cx='${x + dx}' cy='${14 + dy}' r='1.2'/>`)
    .join("");

const strand = (d: string) => `<g><path d='${d}' fill='none' stroke='currentColor' stroke-width='2.4'/></g>`;

export const HARAG_LAYERS: BorderLayer[] = [
  {
    // Over at x 8, under at x 24.
    thread: "thread1",
    shapes: strand(
      "M-6.69 12.69 -2.47 8.47A3.5 3.5 0 0 1 2.47 8.47L13.53 19.53A3.5 3.5 0 0 0 18.47 19.53L22.69 15.31" +
        "M25.31 12.69 29.53 8.47A3.5 3.5 0 0 1 34.47 8.47L36 10",
    ),
  },
  {
    // Under at x 8, over at x 24.
    thread: "thread3",
    shapes: strand(
      "M-6 16 -2.47 19.53A3.5 3.5 0 0 0 2.47 19.53L6.69 15.31" +
        "M9.31 12.69 13.53 8.47A3.5 3.5 0 0 1 18.47 8.47L29.53 19.53A3.5 3.5 0 0 0 34.47 19.53L36 18",
    ),
  },
  {
    thread: "thread2",
    shapes: `<g><path d='${checks(0, 0)}${checks(24, 2)}'/>${quatrefoil(0)}${quatrefoil(16)}${quatrefoil(32)}</g>`,
  },
];

/** The borders drawn from these tiles. */
export type TiledBorder = "tibeb" | "floral" | "harag";

/** A style's tile: as tall as the band, as wide as one repeat of its motif. */
export type BorderTile = { width: number; height: number; layers: BorderLayer[] };

export const BORDER_TILES: Record<TiledBorder, BorderTile> = {
  tibeb: { width: 28, height: 28, layers: TIBEB_LAYERS },
  floral: { width: 28, height: 28, layers: FLORAL_LAYERS },
  harag: { width: HARAG_WIDTH, height: 28, layers: HARAG_LAYERS },
};
