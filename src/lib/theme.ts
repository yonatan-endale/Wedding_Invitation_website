import type { CSSProperties } from "react";

type ThemeColors = {
  paper: string;
  ink: string;
  inkSoft: string;
  rule: string;
  sheet: string;
  thread1: string;
  thread2: string;
  thread3: string;
  onThread1: string;
  /** Falling petals over the hero photo. */
  petal: string;
};

export type Theme = {
  name: string;
  label: string;
  description: string;
  scheme: "light" | "dark";
  colors: ThemeColors;
};

/**
 * The first five palettes borrow from Ethiopian weddings; the rest are classic
 * wedding schemes. The three "threads" colour the border band that runs through
 * the site, whichever border style the couple picks.
 */
const THEMES = {
  tibeb: {
    name: "tibeb",
    label: "Tibeb",
    description: "Linen white with the green, gold and red threads of a habesha kemis border.",
    scheme: "light",
    colors: {
      paper: "#f2f4ef",
      ink: "#17261f",
      inkSoft: "#56655c",
      rule: "#d5dbd0",
      sheet: "#fbfcf9",
      thread1: "#1d6b47",
      thread2: "#c49a22",
      thread3: "#a8372c",
      onThread1: "#ffffff",
      petal: "#c94a4a",
    },
  },
  meskel: {
    name: "meskel",
    label: "Meskel",
    description: "Deep highland green lit by yellow adey abeba daisies.",
    scheme: "dark",
    colors: {
      paper: "#102a1e",
      ink: "#f3ebc8",
      inkSoft: "#b9b48f",
      rule: "#2a4636",
      sheet: "#15352a",
      thread1: "#f2c12e",
      thread2: "#7fb069",
      thread3: "#e4572e",
      onThread1: "#102a1e",
      petal: "#e2604a",
    },
  },
  buna: {
    name: "buna",
    label: "Buna",
    description: "Roasted coffee, copper jebena and a green coffee leaf.",
    scheme: "dark",
    colors: {
      paper: "#221712",
      ink: "#f0e3d3",
      inkSoft: "#b59f8a",
      rule: "#3a2a22",
      sheet: "#2b1e18",
      thread1: "#d08650",
      thread2: "#e8c07d",
      thread3: "#7d9b69",
      onThread1: "#221712",
      petal: "#c96b6b",
    },
  },
  lalibela: {
    name: "lalibela",
    label: "Lalibela",
    description: "Rose-coloured rock churches, ochre light and a priest's blue robe.",
    scheme: "light",
    colors: {
      paper: "#efe4df",
      ink: "#2e1d1b",
      inkSoft: "#735c57",
      rule: "#dccbc4",
      sheet: "#f7efeb",
      thread1: "#8e3b46",
      thread2: "#b98a4e",
      thread3: "#34566b",
      onThread1: "#ffffff",
      petal: "#b8515f",
    },
  },
  tizita: {
    name: "tizita",
    label: "Tizita",
    description: "Evening navy with silver and dusty rose, for night receptions.",
    scheme: "dark",
    colors: {
      paper: "#151b2b",
      ink: "#e7e9f1",
      inkSoft: "#9aa3ba",
      rule: "#283149",
      sheet: "#1b2336",
      thread1: "#c9d2e6",
      thread2: "#d6a2ad",
      thread3: "#6f86b8",
      onThread1: "#151b2b",
      petal: "#d98a99",
    },
  },
  blush: {
    name: "blush",
    label: "Blush",
    description: "Blush pink and champagne gold with a soft warm grey.",
    scheme: "light",
    colors: {
      paper: "#f8eeed",
      ink: "#3d2f30",
      inkSoft: "#7e6b6c",
      rule: "#e8d7d5",
      sheet: "#fdf6f5",
      thread1: "#b8737e",
      thread2: "#c8a96a",
      thread3: "#d9a1a8",
      onThread1: "#ffffff",
      petal: "#d98995",
    },
  },
  ivory: {
    name: "ivory",
    label: "Ivory",
    description: "Ivory and charcoal with one muted gold accent. Very quiet.",
    scheme: "light",
    colors: {
      paper: "#f7f4ee",
      ink: "#2b2a27",
      inkSoft: "#6f6c65",
      rule: "#e2ddd3",
      sheet: "#fcfaf6",
      thread1: "#4a4741",
      thread2: "#b89b5e",
      thread3: "#9a948a",
      onThread1: "#ffffff",
      petal: "#c9a0a4",
    },
  },
  burgundy: {
    name: "burgundy",
    label: "Burgundy",
    description: "Deep burgundy with cream and gold. Rich and evening.",
    scheme: "dark",
    colors: {
      paper: "#3b1420",
      ink: "#f5e9dc",
      inkSoft: "#c9aaa5",
      rule: "#5a2a37",
      sheet: "#47192a",
      thread1: "#d4a862",
      thread2: "#e8c99a",
      thread3: "#c2626f",
      onThread1: "#3b1420",
      petal: "#e2919c",
    },
  },
  dusty: {
    name: "dusty",
    label: "Dusty blue",
    description: "Dusty blue and slate with a rose accent. Calm and airy.",
    scheme: "light",
    colors: {
      paper: "#eef2f5",
      ink: "#243040",
      inkSoft: "#5f6f80",
      rule: "#d5dee6",
      sheet: "#f7f9fb",
      thread1: "#5b7a99",
      thread2: "#c0a17a",
      thread3: "#c98a94",
      onThread1: "#ffffff",
      petal: "#d99aa4",
    },
  },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof THEMES;
export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];
export const THEME_LIST: Theme[] = Object.values(THEMES);

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === "string" && value in THEMES;
}

export function getTheme(name: string | null | undefined): Theme {
  return isThemeName(name) ? THEMES[name] : THEMES.tibeb;
}

export function themeStyle(name: string | null | undefined): CSSProperties {
  const { colors, scheme } = getTheme(name);
  return {
    colorScheme: scheme,
    "--w-paper": colors.paper,
    "--w-ink": colors.ink,
    "--w-ink-soft": colors.inkSoft,
    "--w-rule": colors.rule,
    "--w-sheet": colors.sheet,
    "--w-thread-1": colors.thread1,
    "--w-thread-2": colors.thread2,
    "--w-thread-3": colors.thread3,
    "--w-on-thread-1": colors.onThread1,
    "--w-petal": colors.petal,
  } as CSSProperties;
}
