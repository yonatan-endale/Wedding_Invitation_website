import { describe, expect, it } from "vitest";
import type { SiteData, SiteHonoree } from "@/db/queries/site";
import { celebratedNames, layoutNames, siteTitleNames } from "./site-names";

const honoree = (name: SiteHonoree["name"], father: SiteHonoree["father"] = null): SiteHonoree => ({
  id: name.en,
  name,
  nick: null,
  father,
  headline: null,
  subheadline: null,
  story: null,
  portraitUrl: null,
  portraitPosition: "50% 40%",
});

const site = (couple: Partial<SiteData["couple"]>, honorees: SiteHonoree[] = []) => ({
  couple: {
    eventType: "wedding",
    partnerOne: { en: "Hanna", am: "ሐና" },
    partnerTwo: { en: "Dawit" },
    partnerOneFather: { en: "Tesfaye" },
    partnerTwoFather: null,
    ...couple,
  } as SiteData["couple"],
  honorees,
});

describe("siteTitleNames", () => {
  it("keeps the couple's line exactly as before", () => {
    expect(siteTitleNames(site({}), "en")).toBe("Hanna Tesfaye & Dawit");
    expect(siteTitleNames(site({}), "am")).toBe("ሐና Tesfaye & Dawit");
  });

  it("lists the honorees of a graduation and ignores the empty partners", () => {
    const grads = site({ eventType: "graduation", partnerOne: { en: "" }, partnerTwo: { en: "" } }, [
      honoree({ en: "Ruth" }, { en: "Solomon" }),
      honoree({ en: "Mahlet", am: "ማህሌት" }, { en: "Solomon" }),
    ]);
    expect(siteTitleNames(grads, "en")).toBe("Ruth Solomon & Mahlet Solomon");
    expect(celebratedNames(grads, "am").first).toEqual(["Ruth", "ማህሌት"]);
  });

  it("names a single birthday honoree alone", () => {
    expect(siteTitleNames(site({ eventType: "birthday" }, [honoree({ en: "Abel" })]), "en")).toBe("Abel");
  });
});

describe("layoutNames", () => {
  it("gives a couple the same forms the page always built", () => {
    expect(layoutNames(site({}), "en")).toEqual({
      one: "Hanna Tesfaye",
      two: "Dawit",
      firstOne: "Hanna",
      firstTwo: "Dawit",
      initials: ["H", "D"],
      monogram: "H & D",
    });
  });

  it("puts every honoree in the first name and leaves the second empty", () => {
    const grads = site({ eventType: "graduation" }, [
      honoree({ en: "Ruth" }, { en: "Solomon" }),
      honoree({ en: "Mahlet" }, { en: "Solomon" }),
      honoree({ en: "Selam" }),
    ]);
    expect(layoutNames(grads, "en")).toEqual({
      one: "Ruth Solomon, Mahlet Solomon & Selam",
      two: "",
      firstOne: "Ruth, Mahlet & Selam",
      firstTwo: "",
      initials: ["R", "M"],
      monogram: "R · M · S",
    });
  });

  it("seals a single honoree with one initial", () => {
    expect(layoutNames(site({ eventType: "graduation" }, [honoree({ en: "Abel" })]), "en").initials).toEqual(["A", ""]);
  });
});
