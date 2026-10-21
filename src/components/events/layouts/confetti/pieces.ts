export type Piece = { x: number; y: number; rotate: number; shape: "dot" | "strip" | "squiggle"; thread: 1 | 2 | 3; delay: number };

/**
 * Where the confetti lies around the cover, in percent of its box. A fixed
 * pseudo-random walk, so the server and every browser draw the same pieces;
 * pieces keep to the edges and leave the middle, where the names are, clear.
 */
export function confettiPieces(count: number, seed = 7): Piece[] {
  let state = seed;
  const next = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
  const shapes = ["dot", "strip", "squiggle"] as const;
  const pieces: Piece[] = [];
  for (let index = 0; index < count; index++) {
    const x = next() * 100;
    // Pieces near the middle column move up or down to the top and bottom bands.
    const middle = x > 18 && x < 82;
    const y = middle ? (next() < 0.5 ? next() * 18 : 82 + next() * 16) : next() * 100;
    pieces.push({
      x,
      y,
      rotate: Math.round(next() * 360),
      shape: shapes[index % shapes.length],
      thread: ((index % 3) + 1) as 1 | 2 | 3,
      delay: Math.round(next() * 900),
    });
  }
  return pieces;
}
