import type { SiteCouple, SiteHonoree } from "@/db/queries/site";
import type { SiteNames } from "@/components/wedding/layouts/types";
import { usesHonorees } from "./event-types";
import type { Locale } from "./localized";
import { pickText } from "./localized";
import { fullName, initials, initialsOf, joinNames, monogramText } from "./names";

/** Just the name fields, so admin rows and cached site data both fit. */
type NamedSite = {
  couple: Pick<SiteCouple, "eventType" | "partnerOne" | "partnerTwo" | "partnerOneFather" | "partnerTwoFather">;
  honorees: Pick<SiteHonoree, "name" | "father">[];
};

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

/**
 * The names in the forms the page uses (see SiteNames). A couple is exactly as
 * it always was: first names on the opening screen, first plus father's name in
 * the formal places, and two initials. An honoree site puts everyone in `one`,
 * leaves `two` empty and its messages print `one` alone; its seal carries the
 * first two initials and its monogram all of them.
 */
export function layoutNames(site: NamedSite, locale: Locale): SiteNames {
  const { first, full } = celebratedNames(site, locale);
  if (!usesHonorees(site.couple.eventType)) {
    const pair = initials(first[0], first[1]);
    return { one: full[0], two: full[1], firstOne: first[0], firstTwo: first[1], initials: pair, monogram: monogramText(pair) };
  }
  const letters = initialsOf(first);
  return {
    one: joinNames(full),
    two: "",
    firstOne: joinNames(first),
    firstTwo: "",
    initials: [letters[0] ?? "", letters[1] ?? ""],
    monogram: letters.join(" · "),
  };
}
