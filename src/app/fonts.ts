import { Abyssinica_SIL, Figtree, Marcellus, Noto_Serif_Ethiopic, Source_Serif_4 } from "next/font/google";

/** Inscriptional capitals for names and headings. */
export const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

/** Reading serif for invitation text. */
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
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

/** Amharic body text. */
export const notoSerifEthiopic = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-noto-serif-ethiopic",
  display: "swap",
  preload: false,
});

/** Admin dashboard UI. */
export const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const fontVariables = [marcellus, sourceSerif, abyssinica, notoSerifEthiopic, figtree]
  .map((font) => font.variable)
  .join(" ");
