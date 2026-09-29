import { MemoriesSection } from "../../closing";
import { VenuesSection } from "../../schedule";
import type { LayoutProps } from "../types";
import { EditorialCountdown } from "./countdown";
import { EditorialCouple } from "./couple";
import { EditorialEvents } from "./events";
import { EditorialFooter } from "./footer";
import { EditorialGallery } from "./gallery";
import { EditorialGifts } from "./gifts";
import { EditorialHero } from "./hero";
import { EditorialQuote } from "./quote";
import { EditorialRsvp } from "./rsvp";
import { EditorialStory } from "./story";

/** Magazine layout: light split hero, portraits, event cards, dark mosaic gallery, dated story, RSVP over a photo. */
export function EditorialLayout({ site, locale, names, photos }: LayoutProps) {
  const fullNames = `${names.one} & ${names.two}`;
  return (
    <>
      <main className="relative z-10">
        <EditorialHero site={site} locale={locale} />
        <EditorialCouple site={site} locale={locale} />
        <EditorialCountdown site={site} locale={locale} />
        <EditorialEvents site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <EditorialGallery photos={photos} names={fullNames} />
        <EditorialQuote site={site} locale={locale} overlap={photos.length > 0} />
        <EditorialStory site={site} locale={locale} />
        <EditorialRsvp site={site} locale={locale} photos={photos} />
        <EditorialGifts site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <EditorialFooter site={site} locale={locale} names={names} />
    </>
  );
}
