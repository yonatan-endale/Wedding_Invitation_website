/**
 * The repeating tiles of the Tibeb and Floral borders, drawn once and used by the
 * site's CSS-mask bands (components/wedding/primitives.tsx) and by the guest card
 * image, which has no CSS masks and paints them as SVG patterns instead. Each tile
 * is 28×28 and is authored horizontally.
 */

/** Which of the theme's three thread colours a layer takes. */
export type Thread = "thread1" | "thread2" | "thread3";
export type BorderLayer = { thread: Thread; shapes: string };

export const BORDER_TILE = 28;

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
