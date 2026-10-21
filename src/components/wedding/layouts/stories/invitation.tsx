import { CalendarHeart, Clock, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { pickText, type Locale, LANGUAGES, usesEthiopianCalendar } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { FaithOrnament } from "../../ornaments/faith-ornament";
import { Band, WeddingImage, eyebrowClass } from "../../primitives";
import type { SiteNames } from "../types";
import { Initials, StoryCard, StoryRing, pill } from "./card";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/* A faint wash of the theme's threads over the sheet. Inline, so a browser without color-mix keeps the plain sheet. */
const WASH: CSSProperties = {
  backgroundImage: [
    "radial-gradient(90% 45% at 50% 0%, color-mix(in oklab, var(--w-thread-1) 12%, transparent), transparent 75%)",
    "radial-gradient(70% 35% at 50% 100%, color-mix(in oklab, var(--w-metal) 14%, transparent), transparent 75%)",
  ].join(", "),
};

/**
 * The invitation as a story: the couple's photo in the story ring, the hosts,
 * the full names, the words, and the day, time and place as stickers, over
 * the couple's woven border. Everything rises in, one line after another,
 * as the card comes up.
 */
export async function StoriesInvitation({ site, locale, names }: Props) {
  const t = await getTranslations("invitation");
  const { couple, venues } = site;
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const ornament = getOrnament(couple.ornament);
  const venue = venues[0];
  const venueName = venue ? pickText(venue.name, locale) : "";
  const venueAddress = venue ? pickText(venue.address, locale) : "";

  return (
    <StoryCard id="invitation" tone="light" labelledBy="stories-invitation-names" className="bg-sheet text-ink">
      <span aria-hidden className="absolute inset-0 -z-10" style={WASH} />
      <div data-reveal-group className="flex flex-1 flex-col items-center justify-center px-6 pt-12 pb-9 text-center">
        <span data-reveal="scale" className="block">
          <StoryRing className="size-20" ground="bg-sheet">
            {couple.heroPhotoUrl ? (
              <WeddingImage
                src={couple.heroPhotoUrl}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
                style={{ objectPosition: couple.heroPosition }}
              />
            ) : (
              <Initials initials={names.initials} separator={LANGUAGES[locale].initialsSeparator} className="text-2xl" />
            )}
          </StoryRing>
        </span>

        <p data-reveal="up" style={order(1)} className="mt-5 text-ink-soft">
          {hosts}
        </p>
        <FaithOrnament ornament={ornament} style={order(1)} className="mx-auto mt-4 size-9" />
        <h2
          id="stories-invitation-names"
          data-reveal="up"
          style={order(3)}
          className="mt-3 font-display text-[clamp(2rem,9.6cqi,2.65rem)] leading-[1.08] ethiopic:text-[clamp(1.65rem,8cqi,2.2rem)] ethiopic:leading-[1.3]"
        >
          {names.one}
          <span className="mx-2 inline-block align-[0.1em] text-[0.55em] text-ink-soft">&amp;</span>
          {names.two}
        </h2>
        <p data-reveal="up" style={order(4)} className="mx-auto mt-4 max-w-[34ch] text-[1.05rem] leading-relaxed">
          {invitation}
        </p>

        <span aria-hidden data-reveal="rule" style={order(5)} className="my-6 block h-px w-14 bg-thread-2" />

        <p data-reveal="pop" style={order(6)} className={cn(pill, "bg-thread-1 px-4 py-2 text-[0.95rem] text-on-thread-1")}>
          <CalendarHeart aria-hidden className="size-4 shrink-0" />
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
        {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
        {usesEthiopianCalendar(locale) ? (
          <p data-reveal="up" style={order(7)} className="mt-2 text-base text-ink-soft">
            {formatGregorianDate(couple.weddingAt, couple.timezone)}
          </p>
        ) : (
          <p lang="am" data-reveal="up" style={order(7)} className="mt-2 text-base text-ink-soft">
            {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
          </p>
        )}
        <p data-reveal="up" style={order(7)} className="mt-1 inline-flex items-center gap-1.5 text-base">
          <Clock aria-hidden className="size-4 shrink-0 text-ink-soft" />
          {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
        </p>

        {venue ? (
          <div data-reveal="pop" style={order(8)} className="mt-5 flex flex-col items-center">
            <p className={cn(pill, "border border-rule bg-paper px-4 py-2 text-[0.95rem] text-ink")}>
              <MapPin aria-hidden className="size-4 shrink-0 text-thread-1" />
              {venueName}
            </p>
            {venueAddress ? <p className="mt-1.5 text-base text-ink-soft">{venueAddress}</p> : null}
          </div>
        ) : null}

        {dressCode ? (
          <p data-reveal="up" style={order(9)} className="mx-auto mt-6 max-w-[34ch] text-base">
            <span className={cn(eyebrowClass, "mb-1 block")}>{t("dressCode")}</span>
            {dressCode}
          </p>
        ) : null}
      </div>
      <Band variant={couple.border} />
    </StoryCard>
  );
}
