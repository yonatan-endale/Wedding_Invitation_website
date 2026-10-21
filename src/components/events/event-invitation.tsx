import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { FaithOrnament } from "@/components/wedding/ornaments/faith-ornament";
import { Band, sectionPadding } from "@/components/wedding/primitives";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { pickText, type Locale, usesEthiopianCalendar } from "@/lib/localized";
import { celebratedNames } from "@/lib/site-names";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";

type Props = {
  site: SiteData;
  locale: Locale;
  /** "letter" sits flush left on the page; "card" is centred on a sheet between two bands of the border. */
  look: "letter" | "card";
};

/**
 * The invitation itself, for sites that celebrate honorees: who invites, every
 * honoree's full name on its own line, the words, the day in both calendars,
 * the time, the first venue and the dress code.
 */
export async function EventInvitation({ site, locale, look }: Props) {
  const t = await getTranslations("invitation");
  const { couple, venues } = site;
  const people = celebratedNames(site, locale).full.filter(Boolean);
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const venue = venues[0];
  const ornament = getOrnament(couple.ornament);
  const otherCalendar =
    usesEthiopianCalendar(locale) ? formatGregorianDate(couple.eventAt, couple.timezone) : formatEthiopianDateLine(couple.eventAt, couple.timezone);
  const card = look === "card";
  const reveal = (i: number) => ({ "data-reveal": "up", style: { "--i": i } as CSSProperties });

  return (
    <section id="invitation" aria-labelledby="invitation-names" className={sectionPadding}>
      <div className={cn("mx-auto max-w-2xl", card ? "border border-rule bg-sheet text-center" : "text-start")}>
        {card ? <Band variant={couple.border} reveal /> : null}
        <div data-reveal-group className={card ? "px-6 py-14 sm:px-16 sm:py-20" : ""}>
          <p {...reveal(0)} className="text-ink-soft">
            {t("eyebrow")}
          </p>
          <FaithOrnament ornament={ornament} className={cn("mt-6 size-10", card ? "mx-auto" : "")} />
          <p {...reveal(1)} className="mt-6 text-ink-soft">
            {hosts}
          </p>
          <h2 id="invitation-names" {...reveal(2)} className="mt-6 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05]">
            {people.map((name, index) => (
              <span key={index} className="block">
                {name}
              </span>
            ))}
          </h2>
          <p {...reveal(3)} className={cn("mt-8 max-w-[46ch]", card && "mx-auto")}>
            {invitation}
          </p>
          <div
            data-reveal="rule"
            style={{ "--i": 4 } as CSSProperties}
            className={cn("my-10 h-px w-16 bg-metal", card && "mx-auto")}
            aria-hidden
          />
          <p {...reveal(5)} className="font-display text-[clamp(1.5rem,4vw,2.125rem)] leading-tight">
            {formatWeddingDate(couple.eventAt, couple.timezone, locale)}
          </p>
          <p {...reveal(6)} className="mt-1 text-base text-ink-soft">
            {otherCalendar}
          </p>
          <p {...reveal(6)} className="mt-3 text-xl">
            {formatWeddingTime(couple.eventAt, couple.timezone, locale)}
          </p>
          {venue ? (
            <p {...reveal(7)} className="mt-8">
              {pickText(venue.name, locale)}
              {venue.address ? <span className="block text-ink-soft">{pickText(venue.address, locale)}</span> : null}
            </p>
          ) : null}
          {dressCode ? (
            <p {...reveal(8)} className={cn("mt-10 max-w-[40ch] text-base", card && "mx-auto")}>
              <span className="block text-ink-soft">{t("dressCode")}</span>
              {dressCode}
            </p>
          ) : null}
        </div>
        {card ? <Band variant={couple.border} reveal /> : null}
      </div>
    </section>
  );
}
