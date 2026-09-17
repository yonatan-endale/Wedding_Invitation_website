import { describe, expect, it } from "vitest";
import {
  parseCoupleDetails,
  parseCoupleTexts,
  parseEvent,
  parseGiftAccount,
  parseVenue,
  parseWishlistItem,
  readLocalized,
} from "./admin";

describe("readLocalized", () => {
  it("reads English and Amharic inputs that share a base name", () => {
    expect(readLocalized({ "story.en": " Hello ", "story.am": "ሰላም" }, "story")).toEqual({
      en: "Hello",
      am: "ሰላም",
    });
  });

  it("omits blank Amharic text", () => {
    expect(readLocalized({ "story.en": "Hello", "story.am": " " }, "story")).toEqual({ en: "Hello" });
  });

  it("returns null when both languages are blank", () => {
    expect(readLocalized({ "story.en": "", "story.am": "" }, "story")).toBeNull();
    expect(readLocalized({}, "story")).toBeNull();
  });
});

const details = {
  "partnerOne.en": "Hanna",
  "partnerOne.am": "ሐና",
  "partnerTwo.en": "Dawit",
  "partnerTwo.am": "",
  slug: "hanna-dawit",
  weddingAt: "2026-07-18T14:00",
  timezone: "Africa/Addis_Ababa",
  "city.en": "Addis Ababa",
  "city.am": "አዲስ አበባ",
  theme: "tibeb",
  heroPhotoUrl: "https://images.unsplash.com/photo-1",
  heroPosition: "50% 40%",
  musicUrl: "/demo/canon-in-d.mp3",
  musicTitle: "Canon in D",
};

describe("parseCoupleDetails", () => {
  it("parses names, slug, date in the couple's time zone and appearance", () => {
    const result = parseCoupleDetails(details);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual({
      partnerOne: { en: "Hanna", am: "ሐና" },
      partnerTwo: { en: "Dawit" },
      slug: "hanna-dawit",
      weddingAt: new Date("2026-07-18T11:00:00.000Z"),
      timezone: "Africa/Addis_Ababa",
      city: { en: "Addis Ababa", am: "አዲስ አበባ" },
      theme: "tibeb",
      heroPhotoUrl: "https://images.unsplash.com/photo-1",
      heroPosition: "50% 40%",
      musicUrl: "/demo/canon-in-d.mp3",
      musicTitle: "Canon in D",
    });
  });

  it("requires both English names, a valid slug and a date", () => {
    const result = parseCoupleDetails({
      ...details,
      "partnerOne.en": "",
      slug: "Admin",
      weddingAt: "",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["partnerOne.en", "slug", "weddingAt"]);
  });

  it("rejects unknown time zones and themes", () => {
    const result = parseCoupleDetails({ ...details, timezone: "Mars/Olympus", theme: "neon" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["theme", "timezone"]);
  });

  it("rejects script and protocol-relative URLs", () => {
    const result = parseCoupleDetails({ ...details, heroPhotoUrl: "javascript:alert(1)", musicUrl: "//evil.com/a.mp3" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["heroPhotoUrl", "musicUrl"]);
  });

  it("stores empty optional fields as null", () => {
    const result = parseCoupleDetails({ ...details, heroPhotoUrl: "", musicUrl: "", musicTitle: "", "city.en": "", "city.am": "" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.heroPhotoUrl).toBeNull();
    expect(result.data.musicUrl).toBeNull();
    expect(result.data.musicTitle).toBeNull();
    expect(result.data.city).toBeNull();
  });
});

describe("parseCoupleTexts", () => {
  it("parses invitation texts, telegram link and RSVP settings", () => {
    const result = parseCoupleTexts(
      {
        "invitation.en": "Please join us",
        "story.en": "We met in 2016.",
        telegramUrl: "https://t.me/hanna_dawit",
        rsvpEnabled: "on",
        rsvpDeadline: "2026-06-30T23:59",
      },
      "Africa/Addis_Ababa",
    );
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toMatchObject({
      invitation: { en: "Please join us" },
      story: { en: "We met in 2016." },
      tagline: null,
      hosts: null,
      scripture: null,
      scriptureRef: null,
      dressCode: null,
      giftNote: null,
      telegramUrl: "https://t.me/hanna_dawit",
      rsvpEnabled: true,
      rsvpDeadline: new Date("2026-06-30T20:59:00.000Z"),
    });
  });

  it("treats a missing checkbox as RSVP off and a blank deadline as none", () => {
    const result = parseCoupleTexts({ rsvpDeadline: "" }, "Africa/Addis_Ababa");
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.rsvpEnabled).toBe(false);
    expect(result.data.rsvpDeadline).toBeNull();
  });
});

describe("parseVenue", () => {
  it("parses coordinates and links", () => {
    const result = parseVenue({
      "name.en": "Holy Trinity Cathedral",
      "address.en": "Arat Kilo, Addis Ababa",
      mapsUrl: "https://maps.app.goo.gl/x",
      lat: "9.0306",
      lng: "38.7657",
      imageUrl: "",
    });
    expect(result).toEqual({
      success: true,
      data: {
        name: { en: "Holy Trinity Cathedral" },
        address: { en: "Arat Kilo, Addis Ababa" },
        mapsUrl: "https://maps.app.goo.gl/x",
        lat: 9.0306,
        lng: 38.7657,
        imageUrl: null,
      },
    });
  });

  it("requires a name and valid coordinate ranges", () => {
    const result = parseVenue({ "name.en": "", lat: "91", lng: "abc" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["lat", "lng", "name.en"]);
  });

  it("requires both coordinates or neither", () => {
    const result = parseVenue({ "name.en": "Hall", lat: "9.03", lng: "" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["lng"]);
  });
});

describe("parseEvent", () => {
  it("parses the start time in the couple's time zone and an optional venue", () => {
    const result = parseEvent(
      { "title.en": "Ceremony", startsAt: "2026-07-18T14:00", venueId: "" },
      "Africa/Addis_Ababa",
    );
    expect(result).toEqual({
      success: true,
      data: {
        title: { en: "Ceremony" },
        description: null,
        startsAt: new Date("2026-07-18T11:00:00.000Z"),
        venueId: null,
      },
    });
  });

  it("requires a title and start time", () => {
    const result = parseEvent({ "title.en": "", startsAt: "" }, "Africa/Addis_Ababa");
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["startsAt", "title.en"]);
  });
});

describe("parseGiftAccount", () => {
  it("parses a Telebirr account", () => {
    expect(
      parseGiftAccount({
        kind: "telebirr",
        provider: "Telebirr",
        accountName: "Hanna Tesfaye",
        accountNumber: "0911 234 567",
      }),
    ).toEqual({
      success: true,
      data: {
        kind: "telebirr",
        provider: "Telebirr",
        accountName: "Hanna Tesfaye",
        accountNumber: "0911 234 567",
        note: null,
      },
    });
  });

  it("requires provider, name and number", () => {
    const result = parseGiftAccount({ kind: "bank", provider: "", accountName: "", accountNumber: "" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["accountName", "accountNumber", "provider"]);
  });
});

describe("parseWishlistItem", () => {
  it("parses a wishlist item with an optional link and price", () => {
    expect(parseWishlistItem({ "title.en": "Jebena set", url: "https://shop.example/jebena", price: "ETB 2,500" })).toEqual({
      success: true,
      data: {
        title: { en: "Jebena set" },
        url: "https://shop.example/jebena",
        imageUrl: null,
        price: "ETB 2,500",
      },
    });
  });
});
