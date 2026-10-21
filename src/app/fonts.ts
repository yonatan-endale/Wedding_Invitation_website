import { Abyssinica_SIL, Amiri, Figtree, Marcellus, Noto_Naskh_Arabic, Noto_Serif_Ethiopic, Source_Serif_4 } from "next/font/google";

/** Inscriptional capitals for names and headings. */
export const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

/**
 * Reading serif for invitation text, at one weight. Asking for any more makes
 * Google send the whole variable font, about 2.5 times the size, which slows
 * the first paint on phone connections. Bolder text is synthesised.
 */
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

/** Ge'ez manuscript letterforms for Amharic headings. */
export const abyssinica = Abyssinica_SIL({
  weight: "400",
  subsets: ["ethiopic"],
  variable: "--font-abyssinica",
  display: "swap",
  preload: false,
});

/** Amharic body text, at one weight for the same reason: 48 KB instead of the 184 KB variable font. */
export const notoSerifEthiopic = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  weight: "400",
  variable: "--font-noto-serif-ethiopic",
  display: "swap",
  preload: false,
});

/** Arabic headings and names: a classical Naskh with the calligraphic weight Marcellus has in Latin. */
export const amiri = Amiri({
  weight: "400",
  subsets: ["arabic"],
  variable: "--font-amiri",
  display: "swap",
  preload: false,
});

/** Arabic body text, at one weight like the other body faces. */
export const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-noto-naskh-arabic",
  display: "swap",
  preload: false,
});

/**
 * Admin dashboard UI. Not preloaded: guest pages rarely use it, and a
 * preload there competes with the cover photo on slow phone connections.
 */
export const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  preload: false,
});

export const fontVariables = [marcellus, sourceSerif, abyssinica, notoSerifEthiopic, amiri, notoNaskhArabic, figtree]
  .map((font) => font.variable)
  .join(" ");
