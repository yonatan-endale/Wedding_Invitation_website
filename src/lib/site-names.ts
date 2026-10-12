import type { SiteData } from "@/db/queries/site";
import { usesHonorees } from "./event-types";
import type { Locale } from "./localized";
import { pickText } from "./localized";
import { fullName, joinNames } from "./names";

type NamedSite = Pick<SiteData, "couple" | "honorees">;

/**
 * Everyone the site celebrates, by first name and by full name (first plus
 * father's name), in order. A couple site lists its two partners and an
 * honoree site its honorees, so titles, cards and share text read the same
 * way for every event type.
 */
export function celebratedNames(site: NamedSite, locale: Locale): { first: string[]; full: string[] } {
  const { couple } = site;
  if (usesHonorees(couple.eventType)) {
    return {
      first: site.honorees.map((honoree) => pickText(honoree.name, locale)),
      full: site.honorees.map((honoree) => fullName(honoree.name, honoree.father, locale)),
    };
  }
  return {
    first: [pickText(couple.partnerOne, locale), pickText(couple.partnerTwo, locale)],
    full: [
      fullName(couple.partnerOne, couple.partnerOneFather, locale),
      fullName(couple.partnerTwo, couple.partnerTwoFather, locale),
    ],
  };
}

/** "Hanna Tesfaye & Dawit Alemu", or "Ruth, Mahlet & Selam Solomon": the formal names as one line. */
export function siteTitleNames(site: NamedSite, locale: Locale): string {
  return joinNames(celebratedNames(site, locale).full);
}
