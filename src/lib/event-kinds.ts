import type { LocalizedText } from "./localized";

/**
 * What kind of step an event is, following a Habesha wedding: the days before,
 * the ceremony in each tradition, the day itself and the days after. Picking a
 * kind in admin pre-fills a bilingual title; the title stays editable. The
 * Amharic titles are listed in docs/i18n-review.md for a native speaker.
 */
export const EVENT_KINDS = [
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
  reception: { label: "Reception", title: { en: "Reception", am: "የሰርግ ግብዣ" } },
  blessing: { label: "Elders' blessing", title: { en: "Elders' blessing", am: "የሽማግሌዎች ምርቃት" } },
  mels: { label: "Mels (the return)", title: { en: "Mels", am: "መልስ" } },
  kelekel: { label: "Kelekel (the families meet)", title: { en: "Kelekel", am: "ቅልቅል" } },
  buna: { label: "Coffee ceremony", title: { en: "Coffee ceremony", am: "የቡና ሥነ ሥርዓት" } },
  other: { label: "Other", title: null },
};

export function isEventKind(value: unknown): value is EventKind {
  return typeof value === "string" && (EVENT_KINDS as readonly string[]).includes(value);
}

export function getEventKind(value: unknown): EventKind {
  return isEventKind(value) ? value : DEFAULT_EVENT_KIND;
}
