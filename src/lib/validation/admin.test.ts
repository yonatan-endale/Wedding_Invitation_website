import { describe, expect, it } from "vitest";
import {
  parseCoupleDetails,
  parseCoupleTexts,
  parseEvent,
  parseGiftAccount,
  parseMilestone,
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
  "partnerOneNick.en": "Hanni",
  "partnerOneNick.am": "",
  "partnerTwoNick.en": "",
  "partnerTwoNick.am": "",
  "partnerOneFather.en": "Tesfaye",
  "partnerOneFather.am": "ተስፋዬ",
  "partnerTwoFather.en": "",
  "partnerTwoFather.am": "",
  border: "floral",
  petals: "on",
};

describe("parseCoupleDetails", () => {
  it("parses names, slug, date in the couple's time zone and appearance", () => {
    const result = parseCoupleDetails(details);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual({
      partnerOne: { en: "Hanna", am: "ሐና" },
      partnerTwo: { en: "Dawit" },
      partnerOneNick: { en: "Hanni" },
      partnerTwoNick: null,
      partnerOneFather: { en: "Tesfaye", am: "ተስፋዬ" },
      partnerTwoFather: null,
      partnerOneRole: "bride",
      partnerTwoRole: "groom",
      partnerOnePortraitUrl: null,
      partnerTwoPortraitUrl: null,
      slug: "hanna-dawit",
      weddingAt: new Date("2026-07-18T11:00:00.000Z"),
      timezone: "Africa/Addis_Ababa",
      city: { en: "Addis Ababa", am: "አዲስ አበባ" },
      theme: "tibeb",
      layout: "classic",
      border: "floral",
      petals: true,
      heroPhotoUrl: "https://images.unsplash.com/photo-1",
      heroPosition: "50% 40%",
      musicUrl: "/demo/canon-in-d.mp3",
      musicTitle: "Canon in D",
    });
  });

  it("treats a missing petals checkbox as off and defaults the border to tibeb", () => {
    const rest: Record<string, string> = { ...details };
    delete rest.petals;
    delete rest.border;
    const result = parseCoupleDetails(rest);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.petals).toBe(false);
    expect(result.data.border).toBe("tibeb");
  });

  it("accepts the second tibeb and rejects an unknown border", () => {
    const second = parseCoupleDetails({ ...details, border: "tibeb2" });
    expect(second.success).toBe(true);
    if (second.success) expect(second.data.border).toBe("tibeb2");
    const unknown = parseCoupleDetails({ ...details, border: "zigzag" });
    expect(unknown.success).toBe(false);
  });

  it("parses the layout, partner roles and portraits", () => {
    const result = parseCoupleDetails({
      ...details,
      layout: "editorial",
      partnerOneRole: "groom",
      partnerTwoRole: "bride",
      partnerOnePortraitUrl: "https://example.com/one.jpg",
      partnerTwoPortraitUrl: "",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.layout).toBe("editorial");
    expect(result.data.partnerOneRole).toBe("groom");
    expect(result.data.partnerTwoRole).toBe("bride");
    expect(result.data.partnerOnePortraitUrl).toBe("https://example.com/one.jpg");
    expect(result.data.partnerTwoPortraitUrl).toBeNull();
  });

  it("rejects an unknown layout, role or unsafe portrait link", () => {
    const result = parseCoupleDetails({
      ...details,
      layout: "magazine",
      partnerOneRole: "best man",
      partnerTwoPortraitUrl: "javascript:alert(1)",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["layout", "partnerOneRole", "partnerTwoPortraitUrl"]);
  });

  it("rejects an unknown border style", () => {
    const result = parseCoupleDetails({ ...details, border: "lace" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["border"]);
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

  it("leaves settings that have no form control undefined, so a save never resets them", () => {
    const result = parseCoupleDetails(details);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.opening).toBeUndefined();
    expect(result.data.calendarStyle).toBeUndefined();
    expect(result.data.motion).toBeUndefined();
    expect(result.data.ornament).toBeUndefined();
    expect(result.data.calendarPhotoUrl).toBeUndefined();
  });

  it("parses the opening, calendar, motion, ornament and save-the-date photo when the form sends them", () => {
    const result = parseCoupleDetails({
      ...details,
      opening: "netela",
      calendarStyle: "gregorian",
      motion: "rich",
      ornament: "harari",
      calendarPhotoUrl: "",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.opening).toBe("netela");
    expect(result.data.calendarStyle).toBe("gregorian");
    expect(result.data.motion).toBe("rich");
    expect(result.data.ornament).toBe("harari");
    expect(result.data.calendarPhotoUrl).toBeNull();
  });

  it("rejects unknown appearance settings and an unsafe save-the-date photo", () => {
    const result = parseCoupleDetails({
      ...details,
      opening: "fireworks",
      calendarStyle: "lunar",
      motion: "wild",
      ornament: "star",
      calendarPhotoUrl: "javascript:alert(1)",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["calendarPhotoUrl", "calendarStyle", "motion", "opening", "ornament"]);
  });
});

describe("parseMilestone", () => {
  it("parses a dated chapter with optional body and photo", () => {
    const result = parseMilestone({
      happenedOn: "2023-01-06",
      "title.en": "Our first meet",
      "title.am": "መጀመሪያ የተገናኘንበት",
      "body.en": "At a friend's graduation.",
      "body.am": "",
      imageUrl: "",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual({
      happenedOn: "2023-01-06",
      title: { en: "Our first meet", am: "መጀመሪያ የተገናኘንበት" },
      body: { en: "At a friend's graduation." },
      imageUrl: null,
    });
  });

  it("requires a calendar date and an English title", () => {
    const result = parseMilestone({ happenedOn: "06/01/2023", "title.en": "", imageUrl: "javascript:x" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["happenedOn", "imageUrl", "title.en"]);
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
        guestCardsEnabled: "on",
        galleryDrift: "on",
        collapsibleEvents: "on",
        showcaseEnabled: "on",
        "locale.am": "on",
        "locale.en": "on",
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
      guestCardsEnabled: true,
      couplePageEnabled: false,
      galleryDrift: true,
      calendarButtons: false,
      scrollProgress: false,
      collapsibleEvents: true,
      showcaseEnabled: true,
      enabledLocales: ["en", "am"],
    });
  });

  it("treats a missing checkbox as RSVP off and a blank deadline as none", () => {
    const result = parseCoupleTexts({ rsvpDeadline: "", "locale.am": "on" }, "Africa/Addis_Ababa");
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.rsvpEnabled).toBe(false);
    expect(result.data.rsvpDeadline).toBeNull();
    expect(result.data.guestCardsEnabled).toBe(false);
    expect(result.data.couplePageEnabled).toBe(false);
    expect(result.data.galleryDrift).toBe(false);
    expect(result.data.calendarButtons).toBe(false);
    expect(result.data.scrollProgress).toBe(false);
    expect(result.data.collapsibleEvents).toBe(false);
    expect(result.data.showcaseEnabled).toBe(false);
  });

  it("reads the switched-on languages and needs at least one", () => {
    const some = parseCoupleTexts({ "locale.ar": "on", "locale.en": "on", "locale.xx": "on" }, "Africa/Addis_Ababa");
    expect(some.success && some.data.enabledLocales).toEqual(["en", "ar"]);
    const none = parseCoupleTexts({}, "Africa/Addis_Ababa");
    expect(none.success).toBe(false);
    if (!none.success) expect(none.fieldErrors.enabledLocales).toBe("Keep at least one language on.");
  });

  it("keeps text in every language", () => {
    const result = parseCoupleTexts(
      { "locale.en": "on", "tagline.en": "Welcome", "tagline.ar": "أهلاً", "tagline.om": "  ", "tagline.ti": "እንቋዕ" },
      "Africa/Addis_Ababa",
    );
    expect(result.success && result.data.tagline).toEqual({ en: "Welcome", ar: "أهلاً", ti: "እንቋዕ" });
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
        endsAt: null,
        venueId: null,
      },
    });
  });

  it("parses an optional end time in the couple's time zone", () => {
    const result = parseEvent(
      { "title.en": "Ceremony", startsAt: "2026-07-18T14:00", endsAt: "2026-07-18T15:30" },
      "Africa/Addis_Ababa",
    );
    expect(result.success && result.data.endsAt).toEqual(new Date("2026-07-18T12:30:00.000Z"));
  });

  it("rejects an end time that is not after the start", () => {
    const result = parseEvent(
      { "title.en": "Ceremony", startsAt: "2026-07-18T14:00", endsAt: "2026-07-18T14:00" },
      "Africa/Addis_Ababa",
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["endsAt"]);
  });

  it("requires a title and start time", () => {
    const result = parseEvent({ "title.en": "", startsAt: "" }, "Africa/Addis_Ababa");
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["startsAt", "title.en"]);
  });

  it("reads the event kind when the form sends one and leaves it unchanged otherwise", () => {
    const base = { "title.en": "Mels", startsAt: "2026-07-20T14:00" };
    const withKind = parseEvent({ ...base, kind: "mels" }, "Africa/Addis_Ababa");
    expect(withKind.success && withKind.data.kind).toBe("mels");
    const withoutKind = parseEvent(base, "Africa/Addis_Ababa");
    expect(withoutKind.success && withoutKind.data.kind).toBeUndefined();
    const unknown = parseEvent({ ...base, kind: "party" }, "Africa/Addis_Ababa");
    expect(unknown.success).toBe(false);
    if (unknown.success) return;
    expect(Object.keys(unknown.fieldErrors)).toEqual(["kind"]);
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
