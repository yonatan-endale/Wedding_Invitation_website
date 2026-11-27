import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { LayoutProps } from "@/components/wedding/layouts/types";
import { MemoriesSection } from "@/components/wedding/closing";
import { CountdownSection } from "@/components/wedding/countdown-section";
import { GiftsSection } from "@/components/wedding/gifts";
import { StorySection } from "@/components/wedding/invitation";
import { AdeyFlower } from "@/components/wedding/ornaments/adey-flower";
import { Band, eyebrowClass } from "@/components/wedding/primitives";
import { RsvpSection } from "@/components/wedding/rsvp";
import { SaveTheDate } from "@/components/wedding/save-the-date";
import { ScheduleSection, VenuesSection } from "@/components/wedding/schedule";
import { toGeez } from "@/lib/geez";
import { pickText, usesEthiopianCalendar } from "@/lib/localized";
import { celebratedNames } from "@/lib/site-names";
import { joinNames } from "@/lib/names";
import { getTheme } from "@/lib/theme";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { EventFooter } from "../../event-footer";
import { EventInvitation } from "../../event-invitation";
import { GroupedGallery } from "../../grouped-gallery";
import { HonoreeSection } from "../../honorees";
import { milestoneAge } from "../../milestone";
import { GeezEmblem } from "./emblem";

/**
 * Meto ("a hundred"): a birthday for an elder, made for a 90th or a 100th.
 * The cover is the page's own sheet with the age in Ge'ez numerals at the
 * heart of a laurel crest, the age written out under it, then the full name
 * (first and father's name, as an elder is addressed) and the day in both
 * calendars, closed by a band of the site's border. The age is read from the
 * person's line, or else from the site's tagline; without one the crest gives
 * way to an open adey flower. The adey flower returns with a wish above the
 * replies, and the border closes the page. With the wide woven tibeb the cover's
 * band is two columns broad.
 */
export async function MetoLayout({ site, locale, names, photos }: LayoutProps) {
  const { couple, honorees } = site;
  const t = await getTranslations("layouts.meto");
  const tInvitation = await getTranslations("invitation");
  // An elder is named in full: first and father's name, never a nickname.
  const fullNames = celebratedNames(site, locale).full;
  const tagline = pickText(couple.tagline, locale);
  // The age comes from the first honoree's line ("Turns 100", "፻ኛ ዓመት"), or else the tagline.
  const age = milestoneAge(pickText(honorees[0]?.headline, locale), tagline);
  const otherCalendar =
    usesEthiopianCalendar(locale) ? formatGregorianDate(couple.eventAt, couple.timezone) : formatEthiopianDateLine(couple.eventAt, couple.timezone);
  const wide = couple.border === "tibeb2";
  const surface = getTheme(couple.theme).scheme === "dark" ? "dark" : "light";

  return (
    <>
      <main className="relative z-10">
        <header className="bg-sheet text-ink">
          <div className="flex min-h-[86svh] flex-col items-center justify-center px-5 pt-24 pb-16 text-center">
            {age ? (
              <div data-reveal="up" className="flex flex-col items-center">
                <GeezEmblem numeral={toGeez(age)} surface={surface} className="w-[clamp(13rem,58vw,19rem)]" />
                <p className="mt-6 font-display text-[clamp(1.75rem,6vw,2.75rem)] leading-tight">{t("years", { age })}</p>
              </div>
            ) : (
              <AdeyFlower open className="size-28 sm:size-32" />
            )}
            <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className={`${eyebrowClass} mt-10`}>
              {tInvitation("eyebrow")}
            </p>
            <h1
              data-reveal="up"
              style={{ "--i": 2 } as CSSProperties}
              className="mt-4 max-w-4xl font-display text-[clamp(3rem,11vw,5.75rem)] leading-[1.02]"
            >
              {joinNames(fullNames)}
            </h1>
            {tagline ? (
              <p data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="mt-5 max-w-[40ch] text-xl text-ink-soft">
                {tagline}
              </p>
            ) : null}
            <div data-reveal="rule" style={{ "--i": 4 } as CSSProperties} aria-hidden className="my-9 h-px w-16 bg-metal" />
            <p data-reveal="up" style={{ "--i": 5 } as CSSProperties}>
              <span className="block font-display text-[clamp(1.5rem,4vw,2rem)]">
                {formatWeddingDate(couple.eventAt, couple.timezone, locale)}
              </span>
              <span className="block text-lg text-ink-soft">{otherCalendar}</span>
            </p>
          </div>
          <Band variant={couple.border} columns={wide ? 2 : 1} reveal className={wide ? "h-[4.5rem] sm:h-20" : undefined} />
        </header>

        <EventInvitation site={site} locale={locale} look="card" />
        <HonoreeSection honorees={honorees} locale={locale} look="arch" className="bg-sheet" />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="editorial" photoPreference="hero" />
        <CountdownSection site={site} />
        <ScheduleSection site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <GroupedGallery photos={photos} names={names.one} heading={t("gallery")} look="frames" />
        <StorySection site={site} locale={locale} />
        <GiftsSection site={site} locale={locale} />

        <div data-reveal-group className="flex flex-col items-center px-5 pt-16 text-center sm:pt-20">
          <div data-reveal="fade" aria-hidden className="flex w-full max-w-md items-center gap-5">
            <span className="h-px flex-1 bg-rule" />
            <AdeyFlower open className="size-14" />
            <span className="h-px flex-1 bg-rule" />
          </div>
          <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="mt-6 font-display text-[clamp(1.75rem,5vw,2.5rem)] leading-tight">
            {t("wish")}
          </p>
        </div>
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
        <Band variant={couple.border} />
      </main>
      <EventFooter site={site} locale={locale} />
    </>
  );
}
