/**
 * "Add to calendar" for the wedding: a Google Calendar link and an .ics file
 * (Apple Calendar, Outlook and most phones). Times are written in UTC, so every
 * guest's calendar shows the wedding in their own time zone.
 */

export type CalendarEvent = {
  /** Stable id, so adding the file twice updates the same entry instead of duplicating it. */
  uid: string;
  title: string;
  start: Date;
  end: Date;
  details?: string;
  location?: string;
  url?: string;
};

const SIX_HOURS = 6 * 60 * 60_000;

/** 2026-10-24T12:00:00.000Z → 20261024T120000Z */
export function utcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * The wedding ends when its last event does. Without event times, or if they
 * end before the start, it is given six hours.
 */
export function weddingEnd(start: Date, eventTimes: { startsAt: string; endsAt: string | null }[]): Date {
  const latest = Math.max(...eventTimes.map((e) => new Date(e.endsAt ?? e.startsAt).getTime()), -Infinity);
  return latest > start.getTime() ? new Date(latest) : new Date(start.getTime() + SIX_HOURS);
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({ action: "TEMPLATE", text: event.title, dates: `${utcStamp(event.start)}/${utcStamp(event.end)}` });
  const details = [event.details, event.url].filter(Boolean).join("\n");
  if (details) params.set("details", details);
  if (event.location) params.set("location", event.location);
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** RFC 5545 text: backslashes, semicolons, commas and newlines are escaped. */
function escapeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

const encoder = new TextEncoder();

/** Lines longer than 75 bytes continue on the next line after a space; Ge'ez letters are 3 bytes each. */
function fold(line: string): string {
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export function buildIcs(event: CalendarEvent, now = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding invitations//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${utcStamp(event.start)}`,
    `DTEND:${utcStamp(event.end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    ...(event.details ? [`DESCRIPTION:${escapeText(event.details)}`] : []),
    ...(event.url ? [`URL:${event.url}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
