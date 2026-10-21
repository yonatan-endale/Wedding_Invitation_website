import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { cn } from "@/lib/utils";
import { MemoriesSection } from "../../closing";
import { GiftsSection } from "../../gifts";
import { WeddingImage } from "../../primitives";
import { RsvpSection } from "../../rsvp";
import { SaveTheDate } from "../../save-the-date";
import { VenuesSection } from "../../schedule";
import type { LayoutProps } from "../types";
import { StoryCard, darkGround } from "./card";
import { StoryController } from "./controller";
import { StoriesCountdown } from "./countdown";
import { StoriesCover } from "./cover";
import { StoriesGallery } from "./gallery";
import { StoriesInvitation } from "./invitation";
import { cardCount } from "./plan";
import { StoriesSchedule } from "./schedule";
import { StoriesStory } from "./story";
import styles from "./stories.module.css";
import { StoriesThanks } from "./thanks";
import { LANGUAGES } from "@/lib/localized";

/**
 * Stories: the site told like stories on a phone, one full-screen card at a
 * time. The cover, the invitation, the save-the-date, a countdown sticker,
 * the day, the venues, the photos, the story, RSVP and gifts, then a thank
 * you. The window scrolls and snaps gently to each card; a progress bar,
 * the arrow keys, taps on photo cards and buttons beside the column step
 * through them, and nothing ever moves on by itself. Wide screens show the
 * cards in a phone-sized column over a soft blur of the cover photo.
 */
export function StoriesLayout({ site, locale, names, photos }: LayoutProps) {
  const { couple } = site;
  const count = cardCount(site, locale, photos.length) + (couple.telegramUrl ? 1 : 0);
  const gifts = site.giftAccounts.length > 0 || site.wishlistItems.length > 0;

  return (
    <div className={cn("layout-stories relative isolate", styles.root)}>
      <Backdrop site={site} />
      <Controls count={count} />
      {/* Clear of the fixed header, so the cover rests under it like every other card. */}
      <main className="relative z-10 pt-(--head)">
        <StoriesCover site={site} locale={locale} names={names} />
        <StoriesInvitation site={site} locale={locale} names={names} />
        <StoryCard as="div" hash="save-the-date" tone="dark" tap className={darkGround}>
          <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="story" photoPreference="gallery" />
        </StoryCard>
        <StoriesCountdown site={site} locale={locale} />
        <StoriesSchedule site={site} locale={locale} />
        {site.venues.length > 0 ? (
          <StoryCard as="div" shared hash="venues" tone="light" className="bg-sheet text-ink">
            <VenuesSection site={site} locale={locale} />
          </StoryCard>
        ) : null}
        <StoriesGallery photos={photos} names={names} separator={LANGUAGES[locale].initialsSeparator} />
        <StoriesStory site={site} locale={locale} />
        {couple.rsvpEnabled ? (
          <StoryCard as="div" shared hash="rsvp" tone="light" className="bg-sheet text-ink">
            <RsvpSection site={site} locale={locale} />
          </StoryCard>
        ) : null}
        {gifts ? (
          <StoryCard as="div" shared hash="gifts" tone="light" className="bg-paper text-ink">
            <GiftsSection site={site} locale={locale} />
          </StoryCard>
        ) : null}
        {couple.telegramUrl ? (
          <StoryCard as="div" shared hash="thanks" tone="light" className="bg-sheet text-ink">
            <MemoriesSection site={site} locale={locale} />
          </StoryCard>
        ) : null}
      </main>
      <StoriesThanks site={site} locale={locale} names={names} />
    </div>
  );
}

async function Controls({ count }: { count: number }) {
  const t = await getTranslations("layouts.stories");
  return <StoryController count={count} labels={{ previous: t("previous"), next: t("next") }} />;
}

/* The paper, tinted by the theme's threads, under the blurred photo. Inline, so a browser without color-mix keeps the plain paper. */
const TINT: CSSProperties = {
  backgroundImage: [
    "radial-gradient(60% 50% at 15% 20%, color-mix(in oklab, var(--w-thread-1) 22%, transparent), transparent 70%)",
    "radial-gradient(55% 50% at 85% 85%, color-mix(in oklab, var(--w-thread-2) 22%, transparent), transparent 70%)",
  ].join(", "),
};

/**
 * Behind the column on wide screens: the cover photo, fetched tiny and
 * blurred into a wash of its colours, over the theme-tinted paper. Hidden on
 * phones, where the cards fill the screen (and the lazy image never loads).
 */
function Backdrop({ site }: { site: SiteData }) {
  const { heroPhotoUrl, heroPosition } = site.couple;
  return (
    <div aria-hidden className={cn(styles.backdrop, "bg-paper")}>
      <div className="absolute inset-0" style={TINT} />
      {heroPhotoUrl ? (
        <div className={styles.blur}>
          <WeddingImage src={heroPhotoUrl} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: heroPosition }} />
        </div>
      ) : null}
    </div>
  );
}
