/**
 * Shared timing for every animation on the wedding pages, so all layouts move
 * alike. globals.css mirrors these as --ease-* variables for the CSS reveals.
 */
export const DURATION = { fast: 0.2, base: 0.6, slow: 0.9, draw: 1.2 } as const;

export const EASE = {
  /** Settles softly; the default for things entering. */
  out: [0.22, 1, 0.36, 1],
  /** The netela's cloth: slow start, long glide. */
  cloth: [0.7, 0, 0.2, 1],
  /** Lines and strokes drawing themselves. */
  draw: [0.65, 0, 0.35, 1],
} as const;

export const STAGGER = { tight: 0.035, base: 0.08, loose: 0.14 } as const;
