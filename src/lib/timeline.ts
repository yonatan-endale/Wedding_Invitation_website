import type { SiteData } from "@/db/queries/site";
import { getEventKind, type EventKind } from "./event-kinds";
import { pickText, type Locale } from "./localized";
import { mapsLink } from "./maps";
import { formatWeddingTime, formatWeddingTimeRange } from "./wedding-format";

export type TimelineItem = {
  id: string;
  kind: EventKind;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  /** The start alone, for the machine-readable <time>. */
  startTime: string;
  /** What guests read: the range when the event has an end, otherwise the start. */
  time: string;
  venue: { name: string; href: string | null } | null;
};

export type Timeline = {
  items: TimelineItem[];
  /** When the last event ends, for "End of the day, {time}"; null when it has no end. */
  end: { at: string; time: string } | null;
};

/**
 * The day's events as every layout's timeline shows them, in the order given
 * (the site query sorts them by start), with times in the Ethiopian clock and
 * each venue resolved to its name and a maps link. Translated labels stay with
 * the caller, so this stays free of next-intl.
 */
export function timelineItems(site: Pick<SiteData, "couple" | "events" | "venues">, locale: Locale): Timeline {
  const { timezone } = site.couple;
  const venuesById = new Map(site.venues.map((v) => [v.id, v]));

  const items = site.events.map((event): TimelineItem => {
    const venue = event.venueId ? venuesById.get(event.venueId) : undefined;
    const startTime = formatWeddingTime(event.startsAt, timezone, locale);
    return {
      id: event.id,
      kind: getEventKind(event.kind),
      title: pickText(event.title, locale),
      description: pickText(event.description, locale) || null,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      startTime,
      time: event.endsAt ? formatWeddingTimeRange(event.startsAt, event.endsAt, timezone, locale) : startTime,
      venue: venue
        ? {
            name: pickText(venue.name, locale),
            href: mapsLink({ mapsUrl: venue.mapsUrl, lat: venue.lat, lng: venue.lng, address: pickText(venue.address, "en") }),
          }
        : null,
    };
  });

  const lastEnd = site.events[site.events.length - 1]?.endsAt;
  return { items, end: lastEnd ? { at: lastEnd, time: formatWeddingTime(lastEnd, timezone, locale) } : null };
}
