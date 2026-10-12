/**
 * What a site celebrates. Weddings came first and the rest of the code still
 * calls a site a "couple"; the other types reuse that row and add honorees.
 * Each type gets its own layouts (see `eventTypes` in layout.ts), its own
 * event kinds (event-kinds.ts) and its own copy under `events.<type>` in the
 * messages. Plain data, so admin, import and tests can read it.
 */
export const EVENT_TYPES = ["wedding", "graduation", "birthday", "baptism", "engagement"] as const;
export type EventType = (typeof EVENT_TYPES)[number];
export const DEFAULT_EVENT_TYPE: EventType = "wedding";

export type EventTypeMeta = {
  label: string;
  /**
   * "couple" sites name two partners on the couple row; "honorees" sites list
   * one or more people in the honorees table instead.
   */
  people: "couple" | "honorees";
  /** How many honorees a site may list. Couple sites always have two partners. */
  honorees: { min: number; max: number };
  /**
   * Admin labels for the honoree's two short lines, or null when the type has
   * no use for that line. The degree and school for a graduate, say.
   */
  headlineLabel: string | null;
  subheadlineLabel: string | null;
  /**
   * Open in admin and import. A type stays closed until it has at least one
   * layout, so no site can be saved that has nothing to render it.
   */
  enabled: boolean;
};

export const EVENT_TYPE_META: Record<EventType, EventTypeMeta> = {
  wedding: {
    label: "Wedding",
    people: "couple",
    honorees: { min: 0, max: 0 },
    headlineLabel: null,
    subheadlineLabel: null,
    enabled: true,
  },
  graduation: {
    label: "Graduation",
    people: "honorees",
    honorees: { min: 1, max: 6 },
    headlineLabel: "Degree",
    subheadlineLabel: "School",
    enabled: false,
  },
  birthday: {
    label: "Birthday",
    people: "honorees",
    honorees: { min: 1, max: 3 },
    headlineLabel: "Age or milestone",
    subheadlineLabel: null,
    enabled: false,
  },
  baptism: {
    label: "Baptism (Kristina)",
    people: "honorees",
    honorees: { min: 1, max: 3 },
    headlineLabel: "Christening name",
    subheadlineLabel: "Godparents",
    enabled: false,
  },
  engagement: {
    label: "Engagement (Telosh, Kelebet)",
    people: "couple",
    honorees: { min: 0, max: 0 },
    headlineLabel: null,
    subheadlineLabel: null,
    enabled: false,
  },
};

export function isEventType(value: unknown): value is EventType {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value);
}

/** Unknown or missing types are weddings, which is what every row was before types existed. */
export function getEventType(value: unknown): EventType {
  return isEventType(value) ? value : DEFAULT_EVENT_TYPE;
}

export const ENABLED_EVENT_TYPES: EventType[] = EVENT_TYPES.filter((type) => EVENT_TYPE_META[type].enabled);

/** Whether the type's people are the honorees list rather than the two partners. */
export function usesHonorees(type: EventType): boolean {
  return EVENT_TYPE_META[type].people === "honorees";
}
