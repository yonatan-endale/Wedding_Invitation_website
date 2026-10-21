import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { LayoutProps } from "@/components/wedding/layouts/types";
import { MemoriesSection } from "@/components/wedding/closing";
import { CountdownSection } from "@/components/wedding/countdown-section";
import { GiftsSection } from "@/components/wedding/gifts";
import { StorySection } from "@/components/wedding/invitation";
import { eyebrowClass } from "@/components/wedding/primitives";
import { RsvpSection } from "@/components/wedding/rsvp";
import { SaveTheDate } from "@/components/wedding/save-the-date";
import { ScheduleSection, VenuesSection } from "@/components/wedding/schedule";
import { pickText, usesEthiopianCalendar } from "@/lib/localized";
import { joinNames } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { EventFooter } from "../../event-footer";
import { EventInvitation } from "../../event-invitation";
import { GroupedGallery } from "../../grouped-gallery";
import { HonoreeSection } from "../../honorees";
import styles from "./confetti.module.css";
import { confettiPieces, type Piece } from "./pieces";

const PIECES = confettiPieces(34);
const THREAD = { 1: "var(--w-thread-1)", 2: "var(--w-thread-2)", 3: "var(--w-thread-3)" } as const;

/** One scrap of confetti: a dot, a paper strip or a curled ribbon. */
function Scrap({ piece }: { piece: Piece }) {
  const color = THREAD[piece.thread];
  return (
    <span
      className={cn(styles.piece, "absolute block")}
      style={{ left: `${piece.x}%`, top: `${piece.y}%`, "--d": piece.delay } as CSSProperties}
    >
      <svg viewBox="0 0 24 24" className="size-5 sm:size-6" style={{ transform: `rotate(${piece.rotate}deg)` }}>
        {piece.shape === "dot" ? <circle cx="12" cy="12" r="5" fill={color} /> : null}
        {piece.shape === "strip" ? <rect x="9" y="3" width="6" height="18" rx="1.5" fill={color} /> : null}
        {piece.shape === "squiggle" ? (
          <path d="M4 16c3-6 5 4 8-2s5 4 8-2" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        ) : null}
      </svg>
    </span>
  );
}

/**
 * Confetti: a birthday, bright and warm. The cover is the birthday person's
 * name set huge in the middle of a page of confetti in the theme's three
 * threads, which drifts into place once as it opens, with the admin's own line
 * for them ("Turns 30") on a ribbon under it. Then the invitation on a card,
 * the person's card, the save-the-date, the day, the photos through the
 * years and the replies.
 */
export async function ConfettiLayout({ site, locale, names, photos }: LayoutProps) {
  const { couple, honorees } = site;
  const t = await getTranslations("layouts.confetti");
  const firstNames = honorees.map((honoree) => pickText(honoree.nick, locale) || pickText(honoree.name, locale));
  const headlines = honorees.map((honoree) => pickText(honoree.headline, locale)).filter(Boolean);
  const otherCalendar =
    usesEthiopianCalendar(locale) ? formatGregorianDate(couple.eventAt, couple.timezone) : formatEthiopianDateLine(couple.eventAt, couple.timezone);
  const tagline = pickText(couple.tagline, locale);

  return (
    <>
      <main className="relative z-10">
        <header className="relative isolate overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-10">
            {PIECES.map((piece, index) => (
              <Scrap key={index} piece={piece} />
            ))}
          </div>
          <div className="flex min-h-[88svh] flex-col items-center justify-center px-8 pt-24 pb-20 text-center">
            <p data-reveal="up" className={eyebrowClass}>
              {t("party")}
            </p>
            <h1
              data-reveal="up"
              style={{ "--i": 1 } as CSSProperties}
              className="mt-5 max-w-4xl font-display text-[clamp(3.5rem,15vw,9rem)] leading-[0.92] text-thread-1"
            >
              {joinNames(firstNames)}
            </h1>
            {headlines.length ? (
              <p
                data-reveal="up"
                style={{ "--i": 2 } as CSSProperties}
                className="mt-7 rounded-full bg-thread-1 px-6 py-2 font-display text-[clamp(1.125rem,3vw,1.5rem)] text-on-thread-1"
              >
                {joinNames(headlines)}
              </p>
            ) : null}
            {tagline ? (
              <p data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="mt-7 max-w-[36ch] text-lg">
                {tagline}
              </p>
            ) : null}
            <p data-reveal="up" style={{ "--i": 4 } as CSSProperties} className="mt-8">
              <span className="block font-display text-[clamp(1.25rem,3vw,1.75rem)]">
                {formatWeddingDate(couple.eventAt, couple.timezone, locale)}
              </span>
              <span className="block text-ink-soft">{otherCalendar}</span>
            </p>
          </div>
        </header>

        <EventInvitation site={site} locale={locale} look="card" />
        <HonoreeSection honorees={honorees} locale={locale} look="arch" className="bg-sheet" />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="editorial" photoPreference="gallery" />
        <CountdownSection site={site} variant="boxed" />
        <ScheduleSection site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <GroupedGallery photos={photos} names={names.one} heading={t("gallery")} look="frames" className="bg-sheet" />
        <StorySection site={site} locale={locale} />
        <GiftsSection site={site} locale={locale} />
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <EventFooter site={site} locale={locale} />
    </>
  );
}
