import { Cormorant_Garamond, Great_Vibes } from "next/font/google";

/**
 * Fonts that only some layouts use. A layout puts the font's `variable` class
 * on its own root element (never in the global fontVariables), and with
 * preload off the browser only downloads a face once text on the page uses
 * it. Each stack falls back to Abyssinica SIL for Ge'ez (see the
 * .font-cormorant utility in globals.css).
 */

/** High-contrast Garamond display serif for the Gilded Arches and Noir & Gold layouts. */
export const cormorant = Cormorant_Garamond({
  weight: ["300", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

/**
 * A flowing script for the short accent lines of the Slate layout ("Save the
 * date", "The day"). Latin only: Ge'ez is never set in it (see .font-script).
 */
export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  preload: false,
});
