import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { pickText, type Locale, usesEthiopianCalendar } from "@/lib/localized";
import { mapsLink } from "@/lib/maps";
import { fullName } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { FaithOrnament } from "../../ornaments/faith-ornament";
import { Band, eyebrowClass } from "../../primitives";
import { ScheduleTimeline } from "../../schedule";
import styles from "./flatlay.module.css";

type Props = { site: SiteData; locale: Locale };

/** A card's title, in the display face, a size down from the page-wide section headings. */
const cardTitle = "font-display text-[clamp(2rem,6vw,2.9rem)] leading-[1.08]";

/**
 * The invitation itself, printed on deckled card: the couple's border at
 * head and foot, their faith ornament if they chose one, the hosts, the full
 * names in italic, the invitation, then the day, time and place.
 */
export async function InvitationCardFace({ site, locale }: Props) {
  const t = await getTranslations("invitation");
  const { couple, venues } = site;
  const one = fullName(couple.partnerOne, couple.partnerOneFather, locale);
  const two = fullName(couple.partnerTwo, couple.partnerTwoFather, locale);
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const firstVenue = venues[0];
  const ornament = getOrnament(couple.ornament);

  return (
    <section aria-labelledby="invitation-names" className={cn(styles.sheet, styles.deckleAll, "px-[clamp(1.5rem,7vw,4rem)] py-[clamp(2rem,6vw,3.25rem)] text-center")}>
      <Band variant={couple.border} className="opacity-90" />
      <div data-reveal-group className="py-[clamp(1.75rem,6vw,3rem)]">
        <p data-reveal="up" className="text-ink-soft">
          {hosts}
        </p>
        <FaithOrnament ornament={ornament} style={{ "--i": 1 } as CSSProperties} className="mx-auto mt-7 size-10" />
        <h2
          id="invitation-names"
          data-reveal="up"
          style={{ "--i": 2 } as CSSProperties}
          className={cn(
            "font-cormorant text-[clamp(2.4rem,8.5vw,3.6rem)] leading-[1.05] font-medium italic",
            "ethiopic:text-[clamp(1.9rem,7vw,2.9rem)] ethiopic:leading-[1.3] ethiopic:not-italic",
            ornament === "none" ? "mt-7" : "mt-5",
          )}
        >
          <span className="block">{one}</span>{" "}
          <span className="block text-[0.6em] text-ink-soft">&amp;</span>{" "}
          <span className="block">{two}</span>
        </h2>
        <p data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="mx-auto mt-7 max-w-[40ch]">
          {invitation}
        </p>
        <span aria-hidden data-reveal="rule" style={{ "--i": 4 } as CSSProperties} className="mx-auto my-9 block h-px w-16 bg-metal" />
        <p data-reveal="up" style={{ "--i": 5 } as CSSProperties} className="font-display text-[clamp(1.4rem,4.4vw,1.9rem)] leading-tight">
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
        {usesEthiopianCalendar(locale) ? (
          <p data-reveal="up" style={{ "--i": 5 } as CSSProperties} className="mt-1 text-base text-ink-soft">
            {formatGregorianDate(couple.weddingAt, couple.timezone)}
          </p>
        ) : null}
        <p data-reveal="up" style={{ "--i": 6 } as CSSProperties} className="mt-2 text-xl">
          {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
        </p>
        {firstVenue ? (
          <p data-reveal="up" style={{ "--i": 7 } as CSSProperties} className="mt-6">
            {pickText(firstVenue.name, locale)}
            {firstVenue.address ? <span className="block text-ink-soft">{pickText(firstVenue.address, locale)}</span> : null}
          </p>
        ) : null}
        {dressCode ? (
          <p data-reveal="up" style={{ "--i": 8 } as CSSProperties} className="mx-auto mt-7 max-w-[40ch] text-base">
            <span className="block text-ink-soft">{t("dressCode")}</span>
            {dressCode}
          </p>
        ) : null}
      </div>
      <Band variant={couple.border} className="opacity-90" />
    </section>
  );
}

/** The order of the day on its own card, the shared timeline inside it. */
export async function ScheduleCardFace({ site, locale }: Props) {
  const t = await getTranslations("schedule");
  const { couple } = site;

  return (
    <section aria-labelledby="schedule-heading" className={cn(styles.sheet, styles.cut, "px-[clamp(1.35rem,6vw,3.5rem)] pt-[clamp(2.75rem,8vw,4rem)] pb-[clamp(2.25rem,7vw,3.25rem)]")}>
      <span aria-hidden className={styles.keyline} />
      <div className="relative text-center">
        <h2 id="schedule-heading" className={cardTitle}>
          {t("heading")}
        </h2>
        <p className="mt-2 text-ink-soft">{formatWeddingDate(couple.weddingAt, couple.timezone, locale)}</p>
        <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-metal" />
      </div>
      <ScheduleTimeline site={site} locale={locale} className="relative mx-auto mt-10 max-w-[30rem] ps-6 sm:ps-8" />
    </section>
  );
}

/** The details card: each place with its address and a link to the map. */
export async function DetailsCardFace({ site, locale }: Props) {
  const t = await getTranslations("venues");
  const many = site.venues.length > 1;

  return (
    <section aria-labelledby="venues-heading" className={cn(styles.sheet, styles.cut, "px-[clamp(1.35rem,6vw,3.5rem)] pt-[clamp(2.75rem,8vw,4rem)] pb-[clamp(2.5rem,7vw,3.5rem)] text-center")}>
      <span aria-hidden className={styles.keyline} />
      <h2 id="venues-heading" className={cn(cardTitle, "relative")}>
        {t("heading")}
      </h2>
      <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-metal" />
      <ul data-reveal-group className={cn("relative mt-9 grid gap-x-10 gap-y-9", many && "md:grid-cols-2")}>
        {site.venues.map((venue, index) => {
          const name = pickText(venue.name, locale);
          const address = pickText(venue.address, locale);
          const href = mapsLink({ mapsUrl: venue.mapsUrl, lat: venue.lat, lng: venue.lng, address: pickText(venue.address, "en") || name });
          // An odd last place in two columns sits centred under the pair.
          const lone = many && index === site.venues.length - 1 && index % 2 === 0;
          return (
            <li key={venue.id} data-reveal="up" style={{ "--i": Math.min(index, 5) } as CSSProperties} className={cn(lone && "md:col-span-2")}>
              <p className={cn(eyebrowClass, "mb-2")}>{String(index + 1).padStart(2, "0")}</p>
              <h3 className="font-cormorant text-[clamp(1.6rem,4.6vw,2rem)] leading-tight font-medium italic ethiopic:not-italic">{name}</h3>
              {address ? <p className="mt-1 text-ink-soft">{address}</p> : null}
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center gap-2 text-base underline decoration-metal decoration-1 underline-offset-[6px] hover:decoration-ink"
                >
                  <MapPin aria-hidden className="size-4 text-ink-soft" />
                  {t("openMaps")}
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
