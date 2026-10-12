import { describe, expect, it } from "vitest";
import type { SiteData, SiteHonoree } from "@/db/queries/site";
import { celebratedNames, siteTitleNames } from "./site-names";

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
