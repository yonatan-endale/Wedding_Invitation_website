import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import type { NavLink } from "./site-header";

type NavKey = "invitation" | "couple" | "story" | "schedule" | "venues" | "gallery" | "gifts" | "rsvp";

/**
 * Header links, in page order, for the sections that will actually render.
 * Each condition mirrors the section's own "return null" check.
 */
export function sectionLinks(
  site: SiteData,
  locale: Locale,
  t: (key: NavKey) => string,
  { withCouple = false }: { withCouple?: boolean } = {},
): NavLink[] {
  const { couple } = site;
  const hasPortraits = Boolean(couple.partnerOnePortraitUrl || couple.partnerTwoPortraitUrl);
  const hasStory = site.milestones.length > 0 || Boolean(pickText(couple.story, locale));
  const candidates: [NavKey, boolean][] = [
    ["invitation", true],
    ["couple", withCouple && hasPortraits],
    ["story", hasStory],
    ["schedule", site.events.length > 0],
    ["venues", site.venues.length > 0],
    ["gallery", site.photos.length > 0],
    ["gifts", site.giftAccounts.length > 0 || site.wishlistItems.length > 0],
    ["rsvp", couple.rsvpEnabled],
  ];
  return candidates.filter(([, show]) => show).map(([id]) => ({ id, label: t(id) }));
}
