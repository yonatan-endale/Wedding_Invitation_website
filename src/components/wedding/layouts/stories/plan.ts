import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";

/** At most this many photos get a card of their own; the rest open from "View all" in the viewer. */
export const PHOTO_CARDS = 6;

/** Events on one schedule card when the day is long. */
const EVENTS_PER_CARD = 3;

/**
 * Splits `count` items into cards of at most `max`, as evenly as possible,
 * the fuller cards first: 7 → [3, 2, 2], 4 → [2, 2].
 */
export function balancedChunks(count: number, max: number): number[] {
  if (count <= 0 || max <= 0) return [];
  const cards = Math.ceil(count / max);
  const base = Math.floor(count / cards);
  const extra = count % cards;
  return Array.from({ length: cards }, (_, index) => base + (index < extra ? 1 : 0));
}

/** Events per schedule card: a short day gets one card per event, a long one groups of up to three. */
export function scheduleCards(events: number): number[] {
  return events <= EVENTS_PER_CARD ? Array.from({ length: Math.max(0, events) }, () => 1) : balancedChunks(events, EVENTS_PER_CARD);
}

/** The story paragraphs, split on blank lines. */
export function storyParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

type PlanSite = Pick<SiteData, "couple" | "events" | "venues" | "milestones" | "giftAccounts" | "wishlistItems">;

/**
 * How many cards the page shows, in order, so the progress bar can be drawn
 * on the server. Each condition mirrors the card's own "render nothing" check.
 */
export function cardCount(site: PlanSite, locale: Locale, photos: number): number {
  const { couple } = site;
  const story = storyParagraphs(pickText(couple.story, locale)).length > 0 ? 1 : 0;
  return [
    1, // cover
    1, // invitation
    1, // save the date
    1, // countdown
    scheduleCards(site.events.length).length,
    site.venues.length > 0 ? 1 : 0,
    Math.min(photos, PHOTO_CARDS),
    story + site.milestones.length,
    couple.rsvpEnabled ? 1 : 0,
    site.giftAccounts.length > 0 || site.wishlistItems.length > 0 ? 1 : 0,
    1, // thank you
  ].reduce((sum, cards) => sum + cards, 0);
}
