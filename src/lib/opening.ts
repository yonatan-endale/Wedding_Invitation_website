/**
 * Opening screens: the full-screen cover a guest taps to open the invitation
 * (which also starts the music). Chosen per couple, independent of the layout.
 */
export type OpeningMeta = {
  name: string;
  label: string;
  description: string;
};

export const OPENINGS = {
  netela: {
    name: "netela",
    label: "Netela",
    description: "Two halves of a netela with the couple's border meet in the middle and part when the guest opens it.",
  },
  seal: {
    name: "seal",
    label: "Wax-seal gates",
    description: "Ivory doors meet at a gold line with the couple's seal on it. The seal splits and the doors swing open.",
  },
  envelope: {
    name: "envelope",
    label: "Envelope and letter",
    description: "A sealed envelope lined in the couple's threads. The seal pops, the flap folds back and the letter rises.",
  },
  adey: {
    name: "adey",
    label: "Adey abeba bloom",
    description: "A Meskel daisy bud unfolds its eight petals, and its centre opens into a circle that reveals the site.",
  },
} as const satisfies Record<string, OpeningMeta>;

export type OpeningName = keyof typeof OPENINGS;

export const OPENING_NAMES = Object.keys(OPENINGS) as OpeningName[];
export const OPENING_LIST: OpeningMeta[] = OPENING_NAMES.map((name) => OPENINGS[name]);
export const DEFAULT_OPENING: OpeningName = "netela";

export function isOpeningName(value: unknown): value is OpeningName {
  return typeof value === "string" && Object.hasOwn(OPENINGS, value);
}

/** Unknown or missing names fall back to the netela so old rows and stale cache entries keep rendering. */
export function getOpening(name: string | null | undefined): OpeningName {
  return isOpeningName(name) ? name : DEFAULT_OPENING;
}
