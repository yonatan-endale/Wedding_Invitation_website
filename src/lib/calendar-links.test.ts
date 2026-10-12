import { describe, expect, it } from "vitest";
import { buildIcs, googleCalendarUrl, utcStamp, weddingEnd, type CalendarEvent } from "./calendar-links";

const event: CalendarEvent = {
  uid: "wedding-hanna-dawit@invitations",
  title: "Wedding of Hanna and Dawit",
  start: new Date("2026-10-24T12:00:00Z"),
  end: new Date("2026-10-24T20:00:00Z"),
  details: "Invitation: https://example.com/s/hanna-dawit",
  location: "Holy Trinity Cathedral, Arat Kilo; Addis Ababa",
  url: "https://example.com/s/hanna-dawit",
};

describe("utcStamp", () => {
  it("writes UTC without separators", () => {
    expect(utcStamp(new Date("2026-10-24T12:05:09.123Z"))).toBe("20261024T120509Z");
  });
});

describe("weddingEnd", () => {
  const start = new Date("2026-10-24T12:00:00Z");
  it("ends with the last event", () => {
    const end = weddingEnd(start, [
      { startsAt: "2026-10-24T12:00:00Z", endsAt: "2026-10-24T14:00:00Z" },
      { startsAt: "2026-10-24T18:00:00Z", endsAt: null },
      { startsAt: "2026-10-24T15:00:00Z", endsAt: "2026-10-24T21:30:00Z" },
    ]);
    expect(end.toISOString()).toBe("2026-10-24T21:30:00.000Z");
  });
  it("gives six hours without events, or when events end before the start", () => {
    expect(weddingEnd(start, []).toISOString()).toBe("2026-10-24T18:00:00.000Z");
    expect(weddingEnd(start, [{ startsAt: "2026-10-23T10:00:00Z", endsAt: null }]).toISOString()).toBe("2026-10-24T18:00:00.000Z");
  });
});

describe("googleCalendarUrl", () => {
  it("fills a Google Calendar template", () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("Wedding of Hanna and Dawit");
    expect(url.searchParams.get("dates")).toBe("20261024T120000Z/20261024T200000Z");
    expect(url.searchParams.get("location")).toBe(event.location);
    expect(url.searchParams.get("details")).toContain("https://example.com/s/hanna-dawit");
  });
});

describe("buildIcs", () => {
  const ics = buildIcs(event, new Date("2026-10-08T09:00:00Z"));
  it("uses CRLF line endings and the required fields", () => {
    expect(ics.endsWith("\r\n")).toBe(true);
    expect(ics.split("\r\n")).toContain("DTSTART:20261024T120000Z");
    expect(ics.split("\r\n")).toContain("DTEND:20261024T200000Z");
    expect(ics.split("\r\n")).toContain("DTSTAMP:20261008T090000Z");
    expect(ics).toMatch(/^BEGIN:VCALENDAR\r\nVERSION:2\.0\r\n/);
    expect(ics).toContain("BEGIN:VEVENT");
  });
  it("escapes commas, semicolons and newlines", () => {
    expect(ics).toContain("LOCATION:Holy Trinity Cathedral\\, Arat Kilo\; Addis Ababa");
    expect(buildIcs({ ...event, details: "a\nb" })).toContain("DESCRIPTION:a\\nb");
  });
  it("folds long lines at 75 bytes, counting Ge'ez as 3 bytes", () => {
    const long = buildIcs({ ...event, title: "የሐና እና የዳዊት ሠርግ ".repeat(6) });
    for (const line of long.split("\r\n")) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    expect(long).toContain("\r\n ");
  });
});
