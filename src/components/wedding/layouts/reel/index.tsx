import { MemoriesSection } from "../../closing";
import { CountdownSection } from "../../countdown-section";
import { GiftsSection } from "../../gifts";
import { RsvpSection } from "../../rsvp";
import { SaveTheDate } from "../../save-the-date";
import { EditorialStory } from "../editorial/story";
import type { LayoutProps } from "../types";
import { ReelInvitation } from "./credits";
import { ReelEndCredits } from "./end-credits";
import { ReelEpigraph } from "./epigraph";
import { ReelGallery } from "./film-strip";
import { ReelHero } from "./hero";
import { ReelCouple } from "./posters";
import { ReelLocations, ReelScenes } from "./scenes";

/**
 * Cinematic and dark, the site as the couple's film: a letterboxed cover with
 * opening credits, the invitation as credits, the save-the-date, a timecode
 * countdown, the couple as the stars, the day as scenes, the venues as
 * locations, a film-strip gallery, the story, RSVP and gifts, then end credits.
 */
export function ReelLayout({ site, locale, names, photos }: LayoutProps) {
  return (
    <>
      <main className="relative z-10">
        <ReelHero site={site} locale={locale} />
        <ReelInvitation site={site} locale={locale} />
        <ReelEpigraph site={site} locale={locale} />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="cinema" photoPreference="gallery" />
        <CountdownSection site={site} variant="timecode" className="border-b border-rule" />
        <ReelCouple site={site} locale={locale} photos={photos} />
        <ReelScenes site={site} locale={locale} />
        <ReelLocations site={site} locale={locale} />
        <ReelGallery photos={photos} names={`${names.one} & ${names.two}`} />
        <EditorialStory site={site} locale={locale} />
        <RsvpSection site={site} locale={locale} />
        <GiftsSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <ReelEndCredits site={site} locale={locale} names={names} />
    </>
  );
}
