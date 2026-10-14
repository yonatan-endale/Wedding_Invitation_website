import type { Ornament } from "./appearance";
import type { EventType } from "./event-types";
import type { LocalizedText } from "./localized";

/**
 * What kind of step an event is. The wedding kinds follow a Habesha wedding:
 * the days before, the ceremony in each tradition, the day itself and the days
 * after; the other event types add their own after them. Picking a kind in
 * admin pre-fills a bilingual title; the title stays editable. The Amharic
 * titles are listed in docs/i18n-review.md for a native speaker.
 */
const WEDDING_KINDS = [
  "telosh",
  "ceremony_orthodox",
  "ceremony_protestant",
  "ceremony_civil",
  "nikah",
  "photos",
  "reception",
  "blessing",
  "mels",
  "kelekel",
  "buna",
  "other",
] as const;

export const EVENT_KINDS = [...WEDDING_KINDS, "commencement", "celebration", "cake"] as const;

export type EventKind = (typeof EVENT_KINDS)[number];
export const DEFAULT_EVENT_KIND: EventKind = "other";

type EventKindMeta = {
  /** Shown in the admin picker. */
  label: string;
  /** Default title for the event, or null to leave the title empty. */
  title: LocalizedText | null;
};

export const EVENT_KIND_META: Record<EventKind, EventKindMeta> = {
  telosh: { label: "Telosh (the groom's family brings gifts)", title: { en: "Telosh", am: "ጥሎሽ" } },
  ceremony_orthodox: { label: "Church ceremony (Orthodox)", title: { en: "Church ceremony", am: "የቤተክርስቲያን ሥርዓት" } },
  ceremony_protestant: { label: "Wedding service (Protestant)", title: { en: "Wedding service", am: "የጋብቻ አገልግሎት" } },
  ceremony_civil: { label: "Vow ceremony", title: { en: "Vow ceremony", am: "የቃልኪዳን ሥርዓት" } },
  nikah: { label: "Nikah", title: { en: "Nikah", am: "ኒካህ" } },
  photos: { label: "Photo session", title: { en: "Photo session", am: "የፎቶ ፕሮግራም" } },
  reception: { label: "Reception", title: { en: "Reception", am: "የሠርግ ግብዣ" } },
  blessing: { label: "Elders' blessing", title: { en: "Elders' blessing", am: "የሽማግሌዎች ምርቃት" } },
  mels: { label: "Mels (the return)", title: { en: "Mels", am: "መልስ" } },
  kelekel: { label: "Kelekel (the families meet)", title: { en: "Kelekel", am: "ቅልቅል" } },
  buna: { label: "Coffee ceremony", title: { en: "Coffee ceremony", am: "የቡና ሥነ ሥርዓት" } },
  commencement: { label: "Graduation ceremony", title: { en: "Graduation ceremony", am: "የምረቃ ሥነ ሥርዓት" } },
  celebration: { label: "Celebration (lunch, dinner or party)", title: { en: "Celebration", am: "የደስታ ግብዣ" } },
  cake: { label: "Cake and candles", title: { en: "Cake and candles", am: "ኬክ መቁረስ" } },
  other: { label: "Other", title: null },
};

/**
 * The kinds the admin picker offers for each event type, in picker order.
 * Every type keeps "other". A type's own kinds arrive with its layouts.
 */
export const EVENT_KINDS_BY_TYPE: Record<EventType, readonly EventKind[]> = {
  wedding: WEDDING_KINDS,
  graduation: ["commencement", "photos", "celebration", "buna", "other"],
  birthday: ["celebration", "cake", "photos", "buna", "other"],
  baptism: ["photos", "buna", "other"],
  engagement: ["telosh", "blessing", "kelekel", "photos", "buna", "other"],
};

export function kindsFor(type: EventType): readonly EventKind[] {
  return EVENT_KINDS_BY_TYPE[type];
}

export function isEventKind(value: unknown): value is EventKind {
  return typeof value === "string" && (EVENT_KINDS as readonly string[]).includes(value);
}

export function getEventKind(value: unknown): EventKind {
  return isEventKind(value) ? value : DEFAULT_EVENT_KIND;
}

/**
 * The title after the admin picks another kind: each language takes the new
 * kind's default where its field is empty or still holds the old kind's
 * default, so nothing the admin wrote is lost. Other has no default and leaves
 * the title as it is.
 */
export function titleForKind(
  title: { en: string; am: string },
  from: EventKind,
  to: EventKind,
): { en: string; am: string } {
  const next = EVENT_KIND_META[to].title;
  if (!next) return title;
  const previous = EVENT_KIND_META[from].title;
  const untouched = (value: string, previousDefault = "") => !value.trim() || value.trim() === previousDefault;
  return {
    en: untouched(title.en, previous?.en) ? next.en : title.en,
    am: untouched(title.am, previous?.am) ? (next.am ?? "") : title.am,
  };
}

/** The drawings the timeline can put beside an event title (see ornaments/event-icons.tsx). */
export type EventIconName =
  | "gift"
  | "rings"
  | "church"
  | "orthodox-cross"
  | "cross"
  | "crescent"
  | "camera"
  | "mesob"
  | "blessing"
  | "home"
  | "families"
  | "jebena"
  | "diamond"
  | "mortarboard"
  | "cake";

const EVENT_ICONS: Record<EventKind, EventIconName> = {
  telosh: "gift",
  ceremony_orthodox: "church",
  ceremony_protestant: "church",
  ceremony_civil: "rings",
  nikah: "rings",
  photos: "camera",
  reception: "mesob",
  blessing: "blessing",
  mels: "home",
  kelekel: "families",
  buna: "jebena",
  commencement: "mortarboard",
  celebration: "mesob",
  cake: "cake",
  other: "diamond",
};

/** Faith imagery, shown only to a couple who chose the matching ornament. */
const FAITH_ICONS: Partial<Record<EventKind, { ornament: Ornament; icon: EventIconName }>> = {
  ceremony_orthodox: { ornament: "orthodox", icon: "orthodox-cross" },
  ceremony_protestant: { ornament: "protestant", icon: "cross" },
  nikah: { ornament: "harari", icon: "crescent" },
};

/**
 * Whether an event gets an icon. "other" is what every event had before kinds
 * existed, so it shows none: older timelines look as they did until the admin
 * picks a kind.
 */
export function hasEventIcon(kind: EventKind): boolean {
  return kind !== DEFAULT_EVENT_KIND;
}

/**
 * Which drawing an event gets. Every kind can be picked whatever the ornament,
 * since most weddings have a church ceremony either way; only the imagery is
 * gated. A cross or a crescent appears only when the couple chose that faith's
 * ornament, and otherwise the ceremony shows a church without a cross, or rings.
 */
export function eventIconFor(kind: EventKind, ornament: Ornament): EventIconName {
  const faith = FAITH_ICONS[kind];
  return faith && faith.ornament === ornament ? faith.icon : EVENT_ICONS[kind];
}
