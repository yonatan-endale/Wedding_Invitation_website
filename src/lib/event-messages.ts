import { usesHonorees, type EventType } from "./event-types";

type Messages = { [key: string]: string | Messages };

/** Deep merge; `over` wins wherever both have a string. */
function merge(base: Messages, over: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(over)) {
    const current = out[key];
    out[key] = typeof value === "object" && typeof current === "object" ? merge(current, value) : value;
  }
  return out;
}

/**
 * The messages a site's pages read. The shared messages carry the wedding
 * wording; another event type lays its own wording from `events.<type>` over
 * them, so every shared section (save the date, countdown, RSVP, calendar)
 * speaks of a graduation without knowing it. Weddings get the shared
 * messages as they are.
 */
export function messagesForEvent<T extends Messages>(messages: T, type: EventType): T {
  // The per-type wording is only read here, so it never ships to the browser.
  const { events, ...rest } = messages as Messages;
  if (type === "wedding" || typeof events !== "object") return rest as T;
  const own = events[type];
  // Honoree types share a few lines (no bride and groom) before their own.
  const shared = usesHonorees(type) ? events.honorees : undefined;
  let out: Messages = rest;
  if (typeof shared === "object") out = merge(out, shared);
  if (typeof own === "object") out = merge(out, own);
  return out as T;
}

const SITE_PATH = /^\/s\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/|$)/;

/** The site slug in a /s/<slug>/… path, or null for every other page. */
export function siteSlugFromPath(pathname: string): string | null {
  return SITE_PATH.exec(pathname)?.[1] ?? null;
}
