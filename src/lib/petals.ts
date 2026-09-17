export type Petal = {
  /** Start column as a percentage of the hero width. */
  left: number;
  /** Seconds before the first fall starts. */
  delay: number;
  /** Seconds for one full fall. */
  duration: number;
  /** Width in pixels. */
  size: number;
  /** Sideways travel over one fall, in pixels; negative drifts left. */
  drift: number;
  opacity: number;
};

/** Small deterministic generator, so the server and the browser lay the petals out identically. */
function sequence(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const between = (random: () => number, min: number, max: number) => min + random() * (max - min);

/**
 * Lays out `count` petals across the hero. Columns are spread evenly with a
 * little jitter so the fall covers the whole width without looking like a grid.
 */
export function petalLayout(count: number): Petal[] {
  const random = sequence(20260917);
  const petals: Petal[] = [];
  for (let index = 0; index < count; index++) {
    const column = count === 1 ? 50 : (index / (count - 1)) * 100;
    const duration = between(random, 14, 24);
    petals.push({
      left: Math.min(100, Math.max(0, column + between(random, -4, 4))),
      delay: between(random, 0, duration * 0.95),
      duration,
      size: between(random, 14, 26),
      drift: between(random, -60, 60),
      opacity: between(random, 0.7, 0.9),
    });
  }
  return petals;
}
