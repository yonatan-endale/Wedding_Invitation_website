import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { LayoutProps } from "@/components/wedding/layouts/types";
import { MemoriesSection } from "@/components/wedding/closing";
import { CountdownSection } from "@/components/wedding/countdown-section";
import { GiftsSection } from "@/components/wedding/gifts";
import { StorySection } from "@/components/wedding/invitation";
import { Band, eyebrowClass } from "@/components/wedding/primitives";
import { RsvpSection } from "@/components/wedding/rsvp";
import { SaveTheDate } from "@/components/wedding/save-the-date";
import { ScheduleSection, VenuesSection } from "@/components/wedding/schedule";
import { pickText } from "@/lib/localized";
import { getTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { joinNames } from "@/lib/names";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { EventFooter } from "../../event-footer";
import { EventInvitation } from "../../event-invitation";
import { GroupedGallery } from "../../grouped-gallery";
import { HonoreeSection } from "../../honorees";
import { milestoneNumber } from "../../milestone";

/**
 * Milestone: an elegant birthday for the big numbers, a 50th or a 70th. The
 * cover is dark (the ink of a light theme, the page of a dark one), with the age set very large in gold foil
 * between two fine rules and the name under it; a birthday without an age in
 * its headline shows the name alone. Then the invitation as a bordered card,
 * the person in an arch, the save-the-date and the rest of the day.
 */
export async function MilestoneLayout({ site, locale, names, photos }: LayoutProps) {
  const { couple, honorees } = site;
  const t = await getTranslations("layouts.milestone");
  const firstNames = honorees.map((honoree) => pickText(honoree.nick, locale) || pickText(honoree.name, locale));
  // The age comes from the first honoree's headline; a shared party for twins shares it.
  const age = milestoneNumber(pickText(honorees[0]?.headline, locale));
  const otherCalendar =
    locale === "am" ? formatGregorianDate(couple.eventAt, couple.timezone) : formatEthiopianDateLine(couple.eventAt, couple.timezone);
  const tagline = pickText(couple.tagline, locale);
  // A dark theme's page is already deep, so the cover keeps its paper; a light theme's cover turns to its ink.
  const dark = getTheme(couple.theme).scheme === "dark";
  const soft = dark ? "text-ink-soft" : "text-paper/75";

  return (
    <>
      <main className="relative z-10">
        <header className={cn("relative isolate overflow-hidden", dark ? "bg-paper text-ink" : "bg-ink text-paper")}>
          <div className="flex min-h-[88svh] flex-col items-center justify-center px-5 pt-24 pb-16 text-center">
            {age ? (
              <div data-reveal="up" className="flex flex-col items-center">
                <span aria-hidden className="h-px w-24 bg-metal" />
                <p className="foil-text foil-sheen mt-4 font-display text-[clamp(8rem,38vw,18rem)] leading-[0.85]">{age}</p>
                <p className={cn(eyebrowClass, "mt-2", soft)}>{t("years")}</p>
                <span aria-hidden className="mt-5 h-px w-24 bg-metal" />
              </div>
            ) : null}
            <h1
              data-reveal="up"
              style={{ "--i": 1 } as CSSProperties}
              className="mt-10 max-w-4xl font-display text-[clamp(2.75rem,9vw,5.5rem)] leading-[1.02]"
            >
              {joinNames(firstNames)}
            </h1>
            {tagline ? (
              <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className={cn("mt-6 max-w-[40ch] text-lg", soft)}>
                {tagline}
              </p>
            ) : null}
            <p data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="mt-8">
              <span className="block font-display text-[clamp(1.25rem,3vw,1.75rem)]">
                {formatWeddingDate(couple.eventAt, couple.timezone, locale)}
              </span>
              <span className={cn("block", soft)}>{otherCalendar}</span>
            </p>
          </div>
          <Band variant={couple.border} />
        </header>

        <EventInvitation site={site} locale={locale} look="card" />
        <HonoreeSection honorees={honorees} locale={locale} look="arch" className="bg-sheet" />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="cinema" photoPreference="hero" />
        <CountdownSection site={site} />
        <ScheduleSection site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <GroupedGallery photos={photos} names={names.one} heading={t("gallery")} look="plain" />
        <StorySection site={site} locale={locale} />
        <GiftsSection site={site} locale={locale} />
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <EventFooter site={site} locale={locale} />
    </>
  );
}
