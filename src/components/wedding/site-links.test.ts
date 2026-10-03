import { describe, expect, it } from "vitest";
import type { SiteData } from "@/db/queries/site";
import { LAYOUTS } from "@/lib/layout";
import { sectionLinks } from "./site-links";

function site(overrides: { couple?: Partial<SiteData["couple"]> } & Partial<Omit<SiteData, "couple">> = {}): SiteData {
  const { couple, ...rest } = overrides;
  return {
    couple: {
      story: null,
      partnerOnePortraitUrl: null,
      partnerTwoPortraitUrl: null,
      rsvpEnabled: true,
      ...couple,
    } as SiteData["couple"],
    photos: [],
    venues: [],
    events: [],
    giftAccounts: [],
    wishlistItems: [],
    milestones: [],
    ...rest,
  };
}

const ids = (data: SiteData, layout: keyof typeof LAYOUTS, locale: "en" | "am" = "en") =>
  sectionLinks(data, locale, (key) => key, LAYOUTS[layout]).map((link) => link.id);

const full = site({
  couple: { story: { en: "We met." }, partnerOnePortraitUrl: "/a.jpg" },
  photos: [{ id: "p", url: "/p.jpg", caption: null }],
  venues: [{ id: "v", name: { en: "Hall" }, address: null, mapsUrl: null, lat: null, lng: null, imageUrl: null }],
  events: [{ id: "e", title: { en: "Ceremony" }, description: null, startsAt: "2026-07-18T11:00:00.000Z", endsAt: null, venueId: null, kind: "other" }],
  giftAccounts: [{ id: "g", kind: "bank", provider: "CBE", accountName: "Hanna", accountNumber: "1", note: null }],
});

describe("sectionLinks", () => {
  it("follows each layout's page order", () => {
    expect(ids(full, "classic")).toEqual(["invitation", "story", "schedule", "venues", "gallery", "gifts", "rsvp"]);
    expect(ids(full, "editorial")).toEqual(["invitation", "couple", "schedule", "venues", "gallery", "story", "rsvp", "gifts"]);
  });

  it("drops sections that will not render", () => {
    expect(ids(site({ couple: { rsvpEnabled: false } }), "editorial")).toEqual(["invitation"]);
  });

  it("links the story from milestones only in layouts that show them", () => {
    const milestonesOnly = site({
      milestones: [{ id: "m", happenedOn: "2022-01-15", title: { en: "Met" }, body: null, imageUrl: null }],
    });
    expect(ids(milestonesOnly, "editorial")).toContain("story");
    expect(ids(milestonesOnly, "classic")).not.toContain("story");
  });

  it("links the portraits only when one exists", () => {
    expect(ids(site(), "editorial")).not.toContain("couple");
    expect(ids(site({ couple: { partnerTwoPortraitUrl: "/b.jpg" } }), "editorial")).toContain("couple");
  });

  it("finds story text in either language", () => {
    expect(ids(site({ couple: { story: { en: "We met." } } }), "classic", "am")).toContain("story");
  });
});
