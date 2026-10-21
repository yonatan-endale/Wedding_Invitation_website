import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { pickText, type Locale, LANGUAGES, usesEthiopianCalendar } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { FoilText } from "../../kit/foil-text";
import { FaithOrnament } from "../../ornaments/faith-ornament";
import { FallingPetals } from "../../petals";
import { Band, WeddingImage } from "../../primitives";
import type { SiteNames } from "../types";
import styles from "./kaba.module.css";
import { Lozenge, Medallion, StitchFrame, StitchRule, kabaEyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/** The full names, sized down for Ge'ez, which sets wider than Marcellus. */
const nameClass =
  "block font-display text-[clamp(2.5rem,min(9.5vw,8.4svh),5.25rem)] leading-[1.04] ethiopic:text-[clamp(2.1rem,min(8vw,7svh),4.25rem)] ethiopic:leading-[1.25]";

/**
 * The cover, cut like the back of a kaba: a velvet panel inside an
 * embroidered gold frame whose corners stitch themselves in, the couple's
 * photo in an embroidered medallion, the names in gold foil and, along the
 * hem, the couple's border with a gold fringe hanging from it that sways
 * once as the page opens. The photo paints at once (it only settles from a
 * slight zoom); a faith ornament, if the couple chose one, sits over the
 * names.
 */
export function KabaHero({ site, locale, names }: Props) {
  const { couple } = site;
  const ornament = getOrnament(couple.ornament);
  const tagline = pickText(couple.tagline, locale);
  const city = pickText(couple.city, locale);
  const date = formatWeddingDate(couple.weddingAt, couple.timezone, locale);
  const separator = LANGUAGES[locale].initialsSeparator;

  return (
    <section id="top" className="relative isolate overflow-x-clip [--fringe-h:clamp(2.5rem,6.5vw,3.5rem)]">
      <div className={cn(styles.velvet, styles.cape, "relative z-10 flex min-h-[calc(100svh-var(--fringe-h))] flex-col")}>
        {couple.petals ? <FallingPetals /> : null}
        <div className="relative flex flex-1 flex-col px-3 pt-[4.5rem] pb-3 sm:px-6 sm:pb-5 lg:px-10">
          <div className="relative flex flex-1 flex-col items-center justify-center px-7 py-16 text-center sm:px-16 lg:py-10">
            <StitchFrame id="kaba-hero-frame" />

            <Medallion id="kaba-hero-medallion" className="w-[clamp(8rem,min(36vw,21svh),11rem)]" windowClassName="bg-sheet">
              {couple.heroPhotoUrl ? (
                // Settles from a slight zoom by transform only, so the photo paints at once.
                <div className="hero-photo absolute inset-0">
                  <WeddingImage
                    src={couple.heroPhotoUrl}
                    alt={`${names.one} & ${names.two}`}
                    fill
                    priority
                    sizes="(min-width: 640px) 9rem, 28vw"
                    className="object-cover"
                    style={{ objectPosition: couple.heroPosition }}
                  />
                </div>
              ) : (
                <span aria-hidden className="flex size-full items-center justify-center font-display text-[clamp(1.75rem,7vw,2.5rem)] leading-none">
                  <FoilText sheen={false}>
                    {names.initials[0]}
                    <span className="mx-1 font-cormorant text-[0.7em] italic ethiopic:not-italic">{separator}</span>
                    {names.initials[1]}
                  </FoilText>
                </span>
              )}
            </Medallion>

            <FaithOrnament ornament={ornament} className="mx-auto mt-8 size-10 sm:size-11" />

            <h1 className={ornament === "none" ? "mt-8" : "mt-5"}>
              {/* The spaces keep the accessible name "One & Two" across the stacked lines. */}
              <FoilText className={nameClass}>{names.one}</FoilText>{" "}
              <span className="my-1.5 block font-cormorant text-[clamp(1.75rem,4.6vw,2.6rem)] leading-none text-metal italic ethiopic:my-2 ethiopic:text-[clamp(1.2rem,3.4vw,1.6rem)] ethiopic:not-italic">
                {LANGUAGES[locale].and}
              </span>{" "}
              <FoilText className={nameClass} sheenDelay={0.7}>
                {names.two}
              </FoilText>
            </h1>

            {tagline ? (
              <p
                className="hero-fade mx-auto mt-6 max-w-[36ch] font-cormorant text-[clamp(1.2rem,2.8vw,1.5rem)] text-ink-soft italic ethiopic:not-italic"
                style={order(0)}
              >
                {tagline}
              </p>
            ) : null}

            <div className="hero-fade mt-8 w-full" style={order(1)}>
              <StitchRule id="kaba-hero-rule" draw={false} />
            </div>
            <p className={cn(kabaEyebrow, "hero-fade mt-6 text-ink lining-nums")} style={order(2)}>
              {date}
            </p>
            {city ? (
              <p className={cn(kabaEyebrow, "hero-fade mt-2")} style={order(3)}>
                {city}
              </p>
            ) : null}
          </div>
        </div>
        {/* The hem: the couple's border, which the fringe hangs from. */}
        <Band variant={couple.border} className="relative" />
      </div>
      <div aria-hidden className={styles.fringe}>
        <span className={styles.threads} />
        <span className={styles.knots} />
      </div>
    </section>
  );
}

/**
 * The invitation itself, on an embroidered panel below the fringe: the
 * hosts and the words in Cormorant, then the day in both calendars, the
 * time, the first venue and the dress code between stitched rules.
 */
export async function KabaInvitation({ site, locale }: Omit<Props, "names">) {
  const t = await getTranslations("invitation");
  const { couple, venues } = site;
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const firstVenue = venues[0];
  const venueName = firstVenue ? pickText(firstVenue.name, locale) : "";
  const venueAddress = firstVenue ? pickText(firstVenue.address, locale) : "";

  return (
    <section id="invitation" aria-labelledby="invitation-heading" className="px-4 pt-14 pb-10 sm:px-8 sm:pt-20 sm:pb-16">
      <div className={cn(styles.panel, "relative mx-auto max-w-2xl")}>
        <StitchFrame id="kaba-invitation-frame" />
        <div data-reveal-group className="px-9 py-20 text-center sm:px-20 sm:py-24">
          <h2 id="invitation-heading" data-reveal="fade" className={cn(styles.label, kabaEyebrow)}>
            {t("eyebrow")}
          </h2>
          <p
            data-reveal="up"
            style={order(1)}
            className="mt-8 font-cormorant text-[clamp(1.25rem,3vw,1.5rem)] text-ink-soft italic ethiopic:not-italic"
          >
            {hosts}
          </p>
          <p
            data-reveal="up"
            style={order(2)}
            className="mx-auto mt-3 max-w-[30ch] font-cormorant text-[clamp(1.5rem,3.8vw,2.05rem)] leading-snug ethiopic:max-w-[34ch] ethiopic:text-[clamp(1.2rem,3vw,1.5rem)] ethiopic:leading-relaxed"
          >
            {invitation}
          </p>

          <StitchRule id="kaba-invitation-rule" className="my-10" />

          <p
            data-reveal="up"
            style={order(4)}
            className="font-display text-[clamp(1.6rem,4.6vw,2.4rem)] leading-tight lining-nums ethiopic:text-[clamp(1.35rem,4vw,1.9rem)]"
          >
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
          {usesEthiopianCalendar(locale) ? (
            <p data-reveal="up" style={order(5)} className="mt-2 text-base text-ink-soft">
              {formatGregorianDate(couple.weddingAt, couple.timezone)}
            </p>
          ) : (
            <p lang="am" data-reveal="up" style={order(5)} className="mt-2 text-base text-ink-soft">
              {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
            </p>
          )}
          <p data-reveal="up" style={order(6)} className={cn(kabaEyebrow, "mt-5 text-sm")}>
            {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
          </p>

          {firstVenue ? (
            <div data-reveal="up" style={order(7)} className="mt-10">
              <Lozenge className="mx-auto mb-6 size-[7px]" />
              <p className="font-display text-[clamp(1.35rem,3.6vw,1.8rem)] leading-tight ethiopic:text-[clamp(1.2rem,3.2vw,1.5rem)]">
                {venueName}
              </p>
              {venueAddress ? <p className="mt-1.5 text-base text-ink-soft">{venueAddress}</p> : null}
            </div>
          ) : null}

          {dressCode ? (
            <p data-reveal="up" style={order(8)} className="mx-auto mt-10 max-w-[40ch] text-base">
              <span className={cn(kabaEyebrow, "mb-1 block")}>{t("dressCode")}</span>
              {dressCode}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
