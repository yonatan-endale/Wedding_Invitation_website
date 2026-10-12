import { ChevronDown, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { widestWordEm } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate, weddingDateParts } from "@/lib/wedding-format";
import { HeroNames } from "../../hero";
import { FallingPetals } from "../../petals";
import { WeddingImage } from "../../primitives";
import type { SiteNames } from "../types";
import { Initials, Scrims, StoryCard, StoryRing, darkGround, pill } from "./card";
import styles from "./stories.module.css";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/* Without a cover photo: the theme's threads glowing on near-black. Inline, so a browser without color-mix skips it. */
const GLOW: CSSProperties = {
  backgroundImage: [
    "radial-gradient(70% 50% at 20% 15%, color-mix(in oklab, var(--w-thread-1) 55%, transparent), transparent 70%)",
    "radial-gradient(60% 45% at 85% 80%, color-mix(in oklab, var(--w-thread-3) 45%, transparent), transparent 70%)",
  ].join(", "),
};

/**
 * The first story: the cover photo filling the card, a story header with the
 * couple's avatar and the day, then the names, the date in both calendars,
 * the city as a location sticker and a link on to the invitation. The photo
 * is the largest paint, so it is never faded: it settles by scale alone.
 */
export async function StoriesCover({ site, locale, names }: Props) {
  const [t, ti] = await Promise.all([getTranslations("layouts.stories"), getTranslations("invitation")]);
  const { couple } = site;
  // Nicknames, when the couple set them, replace the first names on the cover.
  const one = pickText(couple.partnerOneNick, locale) || pickText(couple.partnerOne, locale);
  const two = pickText(couple.partnerTwoNick, locale) || pickText(couple.partnerTwo, locale);
  const tagline = pickText(couple.tagline, locale);
  const city = pickText(couple.city, locale);
  const day = weddingDateParts(couple.weddingAt, couple.timezone, locale);

  return (
    <StoryCard id="top" hash="" tone="dark" tap labelledBy="stories-title" className={darkGround}>
      {couple.heroPhotoUrl ? (
        <div className="hero-photo absolute inset-0 -z-20">
          <WeddingImage
            src={couple.heroPhotoUrl}
            alt={`${one} & ${two}`}
            fill
            priority
            sizes="(min-width: 48rem) 34rem, 100vw"
            className="object-cover"
            style={{ objectPosition: couple.heroPosition }}
          />
        </div>
      ) : (
        <div aria-hidden className="absolute inset-0 -z-20" style={GLOW} />
      )}
      <Scrims />
      {couple.petals ? <FallingPetals /> : null}

      {/* The story header: the couple's avatar, their names and the day, under the progress bar. */}
      <div className="hero-fade flex items-center gap-2.5 px-4 pt-9" style={order(0)}>
        <StoryRing className="size-10" ground="bg-[#110f0e]">
          <Initials initials={names.initials} separator={locale === "am" ? "፡" : "&"} className="text-[0.9rem]" />
        </StoryRing>
        <p className="min-w-0 font-sans text-sm leading-tight [text-shadow:0_1px_4px_rgb(0_0_0/0.5)]">
          <span className="font-semibold">
            {names.firstOne} &amp; {names.firstTwo}
          </span>
          <span className="ml-2 text-white/75">
            {day.day} {day.month}
          </span>
        </p>
      </div>

      <div className="mt-auto flex flex-col items-center px-6 pt-16 pb-7 text-center [text-shadow:0_2px_18px_rgb(0_0_0/0.35)]">
        <p className={cn(pill, "hero-fade bg-white text-[#141210] [text-shadow:none]")} style={order(1)}>
          {ti("eyebrow")}
        </p>
        {tagline ? (
          <p className="hero-fade mt-4 max-w-[30ch] text-white/90" style={order(1)}>
            {tagline}
          </p>
        ) : null}
        <h1
          id="stories-title"
          className="mt-5 font-display text-[length:min(clamp(2.9rem,16cqi,4.4rem),calc((100cqi_-_3rem)/var(--name-em)))] leading-[0.95] [&:lang(am)]:text-[length:min(clamp(2.4rem,13cqi,3.6rem),calc((100cqi_-_3rem)/var(--name-em)))] [&:lang(am)]:leading-[1.15]"
          // Capped by the widest word (plus the ampersand before the second name) so long names fit the card.
          style={{ "--name-em": Math.max(widestWordEm(one), widestWordEm(two) + 0.9).toFixed(2) } as CSSProperties}
        >
          <HeroNames one={one} two={two} ampersand="mr-[0.22em] align-[0.12em] text-[0.5em] text-[color-mix(in_oklab,var(--w-metal)_60%,white)]" />
        </h1>
        <p className="hero-fade mt-6 text-[1.05rem] text-white" style={order(2)}>
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
        {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
        {locale === "am" ? (
          <p className="hero-fade text-base text-white/75" style={order(3)}>
            {formatGregorianDate(couple.weddingAt, couple.timezone)}
          </p>
        ) : (
          <p lang="am" className="hero-fade text-base text-white/75" style={order(3)}>
            {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
          </p>
        )}
        {city ? (
          <p className={cn(pill, "hero-fade mt-4 bg-black/35 text-white backdrop-blur-sm")} style={order(4)}>
            <MapPin aria-hidden className="size-4 shrink-0" />
            {city}
          </p>
        ) : null}

        {/* Swipe-up style: a real link on to the next card, for every guest and every device. */}
        <a
          href="#invitation"
          className={cn(pill, "hero-fade mt-8 min-h-11 bg-white/95 px-5 text-[#141210] [text-shadow:none] hover:bg-white")}
          style={order(5)}
        >
          {t("open")}
          <ChevronDown aria-hidden className={cn(styles.bob, "size-4 shrink-0")} />
        </a>
      </div>
    </StoryCard>
  );
}
