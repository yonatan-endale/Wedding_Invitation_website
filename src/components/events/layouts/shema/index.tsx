import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { LayoutProps } from "@/components/wedding/layouts/types";
import { MemoriesSection } from "@/components/wedding/closing";
import { CountdownSection } from "@/components/wedding/countdown-section";
import { GiftsSection } from "@/components/wedding/gifts";
import { StorySection } from "@/components/wedding/invitation";
import { FaithOrnament } from "@/components/wedding/ornaments/faith-ornament";
import { Band, WeddingImage, eyebrowClass } from "@/components/wedding/primitives";
import { RsvpSection } from "@/components/wedding/rsvp";
import { SaveTheDate } from "@/components/wedding/save-the-date";
import { ScheduleSection, VenuesSection } from "@/components/wedding/schedule";
import { getOrnament } from "@/lib/appearance";
import { pickText, usesEthiopianCalendar } from "@/lib/localized";
import { joinNames } from "@/lib/names";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { EventFooter } from "../../event-footer";
import { EventInvitation } from "../../event-invitation";
import { GroupedGallery } from "../../grouped-gallery";
import { HonoreeSection } from "../../honorees";

/**
 * Shema: a christening in white. The cover is a length of hand-woven shema,
 * a pale panel with the site's border running down both edges as a woven
 * cloth's does, and on it the child's name with the christening name under it,
 * the day in both calendars and the cover photo in an arch. A cross shows only
 * when the admin chose a faith ornament, as everywhere else. Then the
 * invitation, the child's card with the godparents, the save-the-date, the
 * day and the replies.
 */
export async function ShemaLayout({ site, locale, names, photos }: LayoutProps) {
  const { couple, honorees } = site;
  const t = await getTranslations("layouts.shema");
  const tInvitation = await getTranslations("invitation");
  const firstNames = honorees.map((honoree) => pickText(honoree.nick, locale) || pickText(honoree.name, locale));
  const christeningNames = honorees.map((honoree) => pickText(honoree.headline, locale)).filter(Boolean);
  const otherCalendar =
    usesEthiopianCalendar(locale) ? formatGregorianDate(couple.eventAt, couple.timezone) : formatEthiopianDateLine(couple.eventAt, couple.timezone);

  return (
    <>
      <main className="relative z-10">
        <header className="px-4 pt-20 pb-14 sm:px-8 sm:pt-28 sm:pb-20">
          <div className="mx-auto flex max-w-xl border-y border-rule bg-sheet shadow-[0_24px_60px_-36px_rgb(0_0_0/0.35)]">
            {/* Out of the flow and clipped, so a band's own length never sets the cloth's height. */}
            <div className="relative w-6 shrink-0 overflow-hidden sm:w-8">
              <Band variant={couple.border} orientation="vertical" className="absolute inset-0 h-full w-full" />
            </div>
            <div className="flex-1 px-6 py-14 text-center sm:px-12 sm:py-20">
              <FaithOrnament ornament={getOrnament(couple.ornament)} className="mx-auto mb-8 size-10" />
              <p data-reveal="up" className={eyebrowClass}>
                {tInvitation("eyebrow")}
              </p>
              <h1
                data-reveal="up"
                style={{ "--i": 1 } as CSSProperties}
                className="mt-6 font-display text-[clamp(3rem,12vw,5.5rem)] leading-[0.95]"
              >
                {joinNames(firstNames)}
              </h1>
              {christeningNames.length ? (
                <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="mt-6">
                  <span className="block text-sm text-ink-soft">{t("christeningName")}</span>
                  <span className="mt-1 block font-display text-[clamp(1.5rem,4.5vw,2.25rem)] text-thread-1">
                    {joinNames(christeningNames)}
                  </span>
                </p>
              ) : null}
              <div data-reveal="rule" style={{ "--i": 3 } as CSSProperties} aria-hidden className="mx-auto my-9 h-px w-14 bg-metal" />
              <p data-reveal="up" style={{ "--i": 4 } as CSSProperties}>
                <span className="block font-display text-[clamp(1.25rem,3vw,1.625rem)]">
                  {formatWeddingDate(couple.eventAt, couple.timezone, locale)}
                </span>
                <span className="block text-ink-soft">{otherCalendar}</span>
              </p>
              {couple.heroPhotoUrl ? (
                <div data-reveal="fade" className="relative mx-auto mt-10 aspect-[4/5] w-full max-w-60 overflow-hidden rounded-t-full bg-rule">
                  <WeddingImage
                    src={couple.heroPhotoUrl}
                    alt={names.one}
                    fill
                    priority
                    sizes="240px"
                    className="object-cover"
                    style={{ objectPosition: couple.heroPosition }}
                  />
                </div>
              ) : null}
            </div>
            {/* Out of the flow and clipped, so a band's own length never sets the cloth's height. */}
            <div className="relative w-6 shrink-0 overflow-hidden sm:w-8">
              <Band variant={couple.border} orientation="vertical" className="absolute inset-0 h-full w-full" />
            </div>
          </div>
        </header>

        <EventInvitation site={site} locale={locale} look="letter" />
        <HonoreeSection
          honorees={honorees}
          locale={locale}
          look="arch"
          labels={{ headline: t("christeningName"), subheadline: t("godparents") }}
          className="bg-sheet"
        />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="editorial" photoPreference="gallery" />
        <CountdownSection site={site} />
        <ScheduleSection site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <GroupedGallery photos={photos} names={names.one} heading={t("gallery")} look="frames" />
        <StorySection site={site} locale={locale} />
        <GiftsSection site={site} locale={locale} />
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <EventFooter site={site} locale={locale} />
    </>
  );
}
