import { describe, expect, it } from "vitest";
import type { SiteEvent, SiteVenue } from "@/db/queries/site";
import { timelineItems } from "./timeline";

const TZ = "Africa/Addis_Ababa";

const church: SiteVenue = {
  id: "v-church",
  name: { en: "Holy Trinity Cathedral", am: "ቅድስት ሥላሴ ካቴድራል" },
  address: { en: "Arat Kilo, Addis Ababa" },
  mapsUrl: null,
  lat: null,
  lng: null,
  imageUrl: null,
};

const hall: SiteVenue = {
  id: "v-hall",
  name: { en: "Sheraton Addis" },
  address: null,
  mapsUrl: "https://maps.app.goo.gl/abc123",
  lat: null,
  lng: null,
  imageUrl: null,
};

function event(overrides: Partial<SiteEvent> & Pick<SiteEvent, "id">): SiteEvent {
  return {
    title: { en: "Ceremony", am: "ሥርዓት" },
    description: null,
    startsAt: "2026-07-18T07:00:00.000Z",
    endsAt: null,
    venueId: null,
    kind: "other",
    ...overrides,
  };
}

function site(events: SiteEvent[], venues: SiteVenue[] = [church, hall]) {
  return { couple: { timezone: TZ } as Parameters<typeof timelineItems>[0]["couple"], events, venues };
}

describe("timelineItems", () => {
  it("resolves each event's venue to its name and a maps link", () => {
    const { items } = timelineItems(
      site([event({ id: "a", venueId: "v-church" }), event({ id: "b", venueId: "v-hall" })]),
      "en",
    );
    expect(items[0].venue).toEqual({
      name: "Holy Trinity Cathedral",
      href: "https://www.google.com/maps/search/?api=1&query=Arat%20Kilo%2C%20Addis%20Ababa",
    });
    expect(items[1].venue).toEqual({ name: "Sheraton Addis", href: "https://maps.app.goo.gl/abc123" });
  });

  it("names the venue in the page's language and falls back to the other one", () => {
    const { items } = timelineItems(
      site([event({ id: "a", venueId: "v-church" }), event({ id: "b", venueId: "v-hall" })]),
      "am",
    );
    expect(items.map((item) => item.venue?.name)).toEqual(["ቅድስት ሥላሴ ካቴድራል", "Sheraton Addis"]);
  });

  it("leaves the venue out when the event has none or it no longer exists", () => {
    const { items } = timelineItems(site([event({ id: "a" }), event({ id: "b", venueId: "v-gone" })]), "en");
    expect(items.map((item) => item.venue)).toEqual([null, null]);
  });

  it("keeps the venue name without a link when there is nothing to locate", () => {
    const bare: SiteVenue = { ...church, id: "v-bare", address: null };
    const { items } = timelineItems(site([event({ id: "a", venueId: "v-bare" })], [bare]), "en");
    expect(items[0].venue).toEqual({ name: "Holy Trinity Cathedral", href: null });
  });

  it("shows a range when the event has an end and the start alone otherwise", () => {
    const { items } = timelineItems(
      site([
        event({ id: "a", startsAt: "2026-07-18T07:00:00.000Z", endsAt: "2026-07-18T08:30:00.000Z" }),
        event({ id: "b", startsAt: "2026-07-18T11:00:00.000Z" }),
      ]),
      "en",
    );
    expect(items[0]).toMatchObject({ startTime: "4:00 in the morning", time: "4:00 to 5:30 in the morning" });
    expect(items[1]).toMatchObject({ startTime: "8:00 in the afternoon", time: "8:00 in the afternoon" });
  });

  it("writes times in Amharic on Amharic pages", () => {
    const { items } = timelineItems(
      site([event({ id: "a", startsAt: "2026-07-18T07:00:00.000Z", endsAt: "2026-07-18T08:30:00.000Z" })]),
      "am",
    );
    expect(items[0]).toMatchObject({ startTime: "ከጠዋቱ 4:00 ሰዓት", time: "ከጠዋቱ 4:00 እስከ 5:30 ሰዓት" });
  });

  it("keeps the order it is given", () => {
    const { items } = timelineItems(
      site([
        event({ id: "late", startsAt: "2026-07-18T15:00:00.000Z" }),
        event({ id: "early", startsAt: "2026-07-18T05:00:00.000Z" }),
        event({ id: "noon", startsAt: "2026-07-18T09:00:00.000Z" }),
      ]),
      "en",
    );
    expect(items.map((item) => item.id)).toEqual(["late", "early", "noon"]);
  });

  it("picks the title and description, reads the kind safely and keeps the raw times", () => {
    const { items } = timelineItems(
      site([
        event({ id: "a", title: { en: "Reception" }, description: { en: "Dinner and dancing" }, kind: "reception" }),
        event({ id: "b", description: { en: "  " }, kind: "not-a-kind" }),
      ]),
      "en",
    );
    expect(items[0]).toMatchObject({
      title: "Reception",
      description: "Dinner and dancing",
      kind: "reception",
      startsAt: "2026-07-18T07:00:00.000Z",
      endsAt: null,
    });
    expect(items[1]).toMatchObject({ description: null, kind: "other" });
  });

  it("ends the day at the last event's end, or without a time when it has none", () => {
    const ended = timelineItems(
      site([event({ id: "a" }), event({ id: "b", startsAt: "2026-07-18T13:00:00.000Z", endsAt: "2026-07-18T18:00:00.000Z" })]),
      "en",
    );
    expect(ended.end).toEqual({ at: "2026-07-18T18:00:00.000Z", time: "3:00 in the evening" });
    expect(timelineItems(site([event({ id: "a", endsAt: "2026-07-18T08:00:00.000Z" }), event({ id: "b" })]), "en").end).toBeNull();
    expect(timelineItems(site([]), "en")).toEqual({ items: [], end: null });
  });
});
