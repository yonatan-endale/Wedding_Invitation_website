import type { SiteData } from "@/db/queries/site";
import type { LayoutMeta } from "@/lib/layout";
import { pickText, type Locale } from "@/lib/localized";
import type { NavKey } from "@/lib/nav";
import type { NavLink } from "./site-header";

type LayoutNav = Pick<LayoutMeta, "navOrder" | "showsCouple" | "showsMilestones">;

/**
 * Header links, in the layout's page order, for the sections that will
 * actually render. Each condition mirrors the section's own "return null" check.
 */
export function sectionLinks(site: SiteData, locale: Locale, t: (key: NavKey) => string, layout: LayoutNav): NavLink[] {
  const { couple } = site;
  const visible: Record<NavKey, boolean> = {
    invitation: true,
    couple: layout.showsCouple && Boolean(couple.partnerOnePortraitUrl || couple.partnerTwoPortraitUrl),
    story: Boolean(pickText(couple.story, locale)) || (layout.showsMilestones && site.milestones.length > 0),
    schedule: site.events.length > 0,
    venues: site.venues.length > 0,
    gallery: site.photos.length > 0,
    gifts: site.giftAccounts.length > 0 || site.wishlistItems.length > 0,
    rsvp: couple.rsvpEnabled,
  };
  return layout.navOrder.filter((id) => visible[id]).map((id) => ({ id, label: t(id) }));
}
