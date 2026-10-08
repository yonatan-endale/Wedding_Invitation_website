import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { Crest } from "../../kit/crest";
import { FoilText } from "../../kit/foil-text";
import { KeylineFrame } from "../../kit/keyline-frame";
import { WeddingImage } from "../../primitives";
import type { SiteNames } from "../types";
import styles from "./noir.module.css";
import { GoldRule, Sparkles, noirEyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/*
 * Decorative gradients stay inline: where color-mix is unsupported the
 * browser skips the whole declaration instead of painting full-strength metal.
 */

/** A warm gold light behind the crest and a vignette that darkens the edges. */
const HERO_LIGHT: CSSProperties = {
  backgroundImage: [
    "radial-gradient(50% 38% at 50% 36%, color-mix(in oklab, var(--w-metal) 14%, transparent), transparent 72%)",
    "radial-gradient(130% 95% at 50% 42%, transparent 50%, rgb(0 0 0 / 0.5))",
  ].join(", "),
};

/** A faint gold light on the invitation panel, brightest at its head. */
const PANEL_LIGHT: CSSProperties = {
  backgroundImage:
    "radial-gradient(80% 45% at 50% 0%, color-mix(in oklab, var(--w-metal) 9%, transparent), transparent 70%)",
};

/** The full names, sized down for Ge'ez, which sets wider than Cormorant. */
const nameClass =
  "block font-cormorant text-[clamp(2.75rem,8vw,5.75rem)] leading-[1.02] font-light [&:lang(am)]:text-[clamp(2.25rem,6.6vw,4.5rem)] [&:lang(am)]:leading-[1.2]";

/**
 * The cover: a large crest with the couple's initials on dark paper, the
 * full names in gold foil, the hosts above and the date and city below,
 * all inside a thin double gold frame. A photo, if there is one, is only a
 * dark wash behind; it paints at once (no fade), and the crest and type do
 * the work. The crest draws itself in, the foil catches the light once and,
 * at the rich level, a few glints twinkle around the crest.
 */
export async function NoirHero({ site, locale, names }: Props) {
  const t = await getTranslations("invitation");
  const { couple } = site;
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const tagline = pickText(couple.tagline, locale);
  const city = pickText(couple.city, locale);
  const date = formatWeddingDate(couple.weddingAt, couple.timezone, locale);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-clip px-7 pt-28 pb-20 text-center sm:px-12 sm:pb-24"
    >
      {couple.heroPhotoUrl ? (
        <>
          {/* The outer layer drifts with scroll (rich); the inner one settles from a slight zoom. Never from opacity 0. */}
          <div className="hero-drift absolute inset-0 -z-30">
            <div className="hero-photo absolute inset-0">
              <WeddingImage
                src={couple.heroPhotoUrl}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover grayscale"
                style={{ objectPosition: couple.heroPosition }}
              />
            </div>
          </div>
          <div aria-hidden className="absolute inset-0 -z-20 bg-paper/90" />
        </>
      ) : null}
      <div aria-hidden className="absolute inset-0 -z-10" style={HERO_LIGHT} />
      {/* The cover melts into the paper below instead of ending on a hard edge. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-paper to-transparent" />

      {/* A thin double gold frame, clear of the header, that opens from its centre. */}
      <div
        aria-hidden
        data-reveal="unroll"
        className="pointer-events-none absolute inset-x-3 top-[4.5rem] bottom-3 sm:inset-x-6 sm:bottom-6 lg:inset-x-10 lg:bottom-8"
      >
        <KeylineFrame inset={0} double corners className="size-full" />
      </div>

      <div className="relative w-full max-w-4xl">
        <div className="relative mx-auto w-[clamp(8.5rem,30vw,11.5rem)]">
          <Crest initials={names.initials} separator={locale === "am" ? "፡" : "&"} id="noir-hero-crest" className="w-full" />
          <Sparkles />
        </div>

        <p className={cn(noirEyebrow, "hero-fade mt-9")} style={order(0)}>
          {hosts}
        </p>

        <h1 className="mt-6">
          {/* The spaces keep the accessible name "One & Two" across the stacked lines. */}
          <FoilText className={nameClass}>{names.one}</FoilText>{" "}
          <span
            className="my-1 block font-cormorant text-[clamp(1.75rem,4.5vw,2.75rem)] leading-none font-light text-metal italic [&:lang(am)]:my-2 [&:lang(am)]:text-[clamp(1.25rem,3.5vw,1.75rem)] [&:lang(am)]:not-italic"
          >
            {locale === "am" ? "እና" : "&"}
          </span>{" "}
          <FoilText className={nameClass} sheenDelay={0.7}>
            {names.two}
          </FoilText>
        </h1>

        {tagline ? (
          <p
            className="hero-fade mx-auto mt-6 max-w-[40ch] font-cormorant text-[clamp(1.2rem,2.6vw,1.5rem)] text-ink-soft italic [&:lang(am)]:not-italic"
            style={order(1)}
          >
            {tagline}
          </p>
        ) : null}

        <GoldRule hero index={2} className="mt-8" />

        <p className={cn(noirEyebrow, "hero-fade mt-6 text-ink lining-nums")} style={order(3)}>
          {date}
        </p>
        {city ? (
          <p className={cn(noirEyebrow, "hero-fade mt-2 text-ink-soft")} style={order(4)}>
            {city}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/**
 * The invitation itself, right under the cover: the words in Cormorant
 * italic, then the date, the time and the first venue between gold rules,
 * on a panel framed in a double gold keyline with corner diamonds.
 */
export async function NoirInvitation({ site, locale }: Omit<Props, "names">) {
  const t = await getTranslations("invitation");
  const { couple, venues } = site;
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const firstVenue = venues[0];
  const venueName = firstVenue ? pickText(firstVenue.name, locale) : "";
  const venueAddress = firstVenue ? pickText(firstVenue.address, locale) : "";

  return (
    <section id="invitation" aria-labelledby="invitation-heading" className="px-5 pt-8 pb-10 sm:px-8 sm:pt-12 sm:pb-16">
      <KeylineFrame inset={10} double corners className="mx-auto max-w-2xl bg-sheet/60">
        <div data-reveal-group className="px-7 py-16 text-center sm:px-16 sm:py-20" style={PANEL_LIGHT}>
          <h2 id="invitation-heading" data-reveal="fade" className={cn(styles.label, noirEyebrow)}>
            {t("eyebrow")}
          </h2>
          <p
            data-reveal="up"
            style={order(1)}
            className="mx-auto mt-8 max-w-[30ch] font-cormorant text-[clamp(1.5rem,3.8vw,2.1rem)] leading-snug italic [&:lang(am)]:max-w-[34ch] [&:lang(am)]:text-[clamp(1.2rem,3vw,1.5rem)] [&:lang(am)]:leading-relaxed [&:lang(am)]:not-italic"
          >
            {invitation}
          </p>

          <GoldRule className="my-10" index={2} />

          <p
            data-reveal="up"
            style={order(4)}
            className="font-cormorant text-[clamp(1.75rem,5vw,2.75rem)] leading-tight lining-nums [&:lang(am)]:text-[clamp(1.35rem,4.2vw,2rem)]"
          >
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
          {locale === "am" ? (
            <p data-reveal="up" style={order(5)} className="mt-2 text-base text-ink-soft">
              {formatGregorianDate(couple.weddingAt, couple.timezone)}
            </p>
          ) : (
            <p lang="am" data-reveal="up" style={order(5)} className="mt-2 text-base text-ink-soft">
              {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
            </p>
          )}
          <p data-reveal="up" style={order(6)} className={cn(noirEyebrow, "mt-5 text-sm")}>
            {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
          </p>

          {firstVenue ? (
            <>
              <GoldRule className="my-10" index={7} />
              <p
                data-reveal="up"
                style={order(8)}
                className="font-cormorant text-[clamp(1.5rem,4vw,2.1rem)] leading-tight [&:lang(am)]:text-[clamp(1.25rem,3.4vw,1.6rem)]"
              >
                {venueName}
              </p>
              {venueAddress ? (
                <p data-reveal="up" style={order(9)} className="mt-2 text-base text-ink-soft">
                  {venueAddress}
                </p>
              ) : null}
            </>
          ) : null}

          {dressCode ? (
            <p data-reveal="up" style={order(10)} className="mx-auto mt-10 max-w-[40ch] text-base">
              <span className={cn(noirEyebrow, "mb-1 block")}>{t("dressCode")}</span>
              {dressCode}
            </p>
          ) : null}
        </div>
      </KeylineFrame>
    </section>
  );
}
