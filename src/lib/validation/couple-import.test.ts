import { describe, expect, it } from "vitest";
import { zonedTimeToUtc } from "@/lib/datetime";
import { parseCoupleImport } from "./couple-import";

const minimal = {
  couple: {
    slug: "hanna-dawit",
    partnerOne: { en: "Hanna", am: "ሐና" },
    partnerTwo: { en: "Dawit" },
    weddingAt: "2026-07-18T14:00",
    timezone: "Africa/Addis_Ababa",
  },
};

function issuesOf(raw: unknown): string[] {
  const result = parseCoupleImport(raw);
  return result.success ? [] : result.issues;
}

describe("parseCoupleImport", () => {
  it("accepts a minimal file and applies defaults", () => {
    const result = parseCoupleImport(minimal);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.couple).toMatchObject({
      slug: "hanna-dawit",
      status: "draft",
      partnerOne: { en: "Hanna", am: "ሐና" },
      partnerTwo: { en: "Dawit" },
      partnerOneRole: "bride",
      partnerTwoRole: "groom",
      theme: "tibeb",
      layout: "classic",
      border: "tibeb",
      heroPosition: "50% 40%",
      petals: true,
      rsvpEnabled: true,
      rsvpDeadline: null,
      city: null,
      heroPhotoUrl: null,
    });
    expect(result.data.venues).toEqual([]);
    expect(result.data.events).toEqual([]);
    expect(result.data.photos).toEqual([]);
    expect(result.data.gifts).toEqual([]);
    expect(result.data.milestones).toEqual([]);
    expect(result.data.wishlist).toEqual([]);
  });

  it("resolves local times in the couple's time zone", () => {
    const result = parseCoupleImport(minimal);
    if (!result.success) throw new Error(result.issues.join("\n"));
    expect(result.data.couple.weddingAt).toEqual(zonedTimeToUtc("2026-07-18T14:00", "Africa/Addis_Ababa"));
    expect(result.data.couple.weddingAt.toISOString()).toBe("2026-07-18T11:00:00.000Z");
  });

  it("keeps ISO dates with an offset and Date objects as they are", () => {
    const result = parseCoupleImport({
      ...minimal,
      couple: { ...minimal.couple, weddingAt: "2026-07-18T14:00:00+03:00", rsvpDeadline: new Date("2026-07-01T00:00:00Z") },
    });
    if (!result.success) throw new Error(result.issues.join("\n"));
    expect(result.data.couple.weddingAt.toISOString()).toBe("2026-07-18T11:00:00.000Z");
    expect(result.data.couple.rsvpDeadline?.toISOString()).toBe("2026-07-01T00:00:00.000Z");
  });

  it("rejects dates in other formats", () => {
    expect(issuesOf({ ...minimal, couple: { ...minimal.couple, weddingAt: "18/07/2026" } })).toEqual([
      expect.stringMatching(/^couple\.weddingAt: Use "YYYY-MM-DDTHH:mm"/),
    ]);
  });

  it("maps events to venues by index and rejects a missing index", () => {
    const venues = [{ name: { en: "Church" } }, { name: { en: "Hall" } }];
    const events = [
      { title: { en: "Ceremony" }, startsAt: "2026-07-18T14:00", venue: 1 },
      { title: { en: "Travel" }, startsAt: "2026-07-18T16:00" },
    ];
    const ok = parseCoupleImport({ ...minimal, venues, events });
    if (!ok.success) throw new Error(ok.issues.join("\n"));
    expect(ok.data.events.map((e) => e.venue)).toEqual([1, null]);

    expect(issuesOf({ ...minimal, venues, events: [{ ...events[0], venue: 2 }] })).toEqual([
      "events[0].venue: points at a venue that does not exist (venues has 2).",
    ]);
  });

  it("requires the end of an event to be after its start", () => {
    const events = [{ title: { en: "Ceremony" }, startsAt: "2026-07-18T14:00", endsAt: "2026-07-18T14:00" }];
    expect(issuesOf({ ...minimal, events })).toEqual(["events[0].endsAt: The end must be after the start."]);
  });

  it("reads photos as plain URLs or objects with captions", () => {
    const result = parseCoupleImport({
      ...minimal,
      photos: ["/couples/x/a.jpg", { url: "https://example.com/b.jpg", caption: { en: "Us", am: "" } }],
    });
    if (!result.success) throw new Error(result.issues.join("\n"));
    expect(result.data.photos).toEqual([
      { url: "/couples/x/a.jpg", caption: null },
      { url: "https://example.com/b.jpg", caption: { en: "Us" } },
    ]);
  });

  it("collapses blank localized text to null and requires English for names", () => {
    const result = parseCoupleImport({ ...minimal, couple: { ...minimal.couple, city: { en: " ", am: "" } } });
    if (!result.success) throw new Error(result.issues.join("\n"));
    expect(result.data.couple.city).toBeNull();

    expect(issuesOf({ ...minimal, couple: { ...minimal.couple, partnerTwo: { am: "ዳዊት" } } })).toEqual([
      "couple.partnerTwo: Add the English text.",
    ]);
  });

  it("reports one issue per broken field", () => {
    const issues = issuesOf({
      ...minimal,
      couple: {
        ...minimal.couple,
        slug: "Admin",
        theme: "neon",
        heroPhotoUrl: "javascript:alert(1)",
        telegramUrl: "/relative-not-allowed",
      },
      venues: [{ name: { en: "Church" }, lat: 9.03 }],
      gifts: [{ provider: "", accountName: "Hanna", accountNumber: "1000" }],
      milestones: [{ happenedOn: "15/01/2022", title: { en: "Met" } }],
    });
    expect(issues).toEqual([
      expect.stringMatching(/^couple\.slug: /),
      "couple.heroPhotoUrl: Enter a full link starting with https://",
      "couple.telegramUrl: Enter a full link starting with https://",
      "couple.theme: Unknown theme.",
      "venues[0].lng: Add the longitude too, or drop the latitude.",
      "gifts[0].provider: Enter the bank or service name.",
      'milestones[0].happenedOn: Use a calendar day like "2022-01-15".',
    ]);
  });

  it("rejects unknown keys so typos do not vanish silently", () => {
    expect(issuesOf({ ...minimal, couple: { ...minimal.couple, heroPhotoURL: "/x.jpg" } })).toEqual([
      expect.stringMatching(/^couple: .*heroPhotoURL/),
    ]);
  });

  it("falls back to the default time zone when the file's one is invalid", () => {
    const issues = issuesOf({ ...minimal, couple: { ...minimal.couple, timezone: "Mars/Olympus" } });
    expect(issues).toEqual(["couple.timezone: Use an IANA time zone such as Africa/Addis_Ababa."]);
  });
});
