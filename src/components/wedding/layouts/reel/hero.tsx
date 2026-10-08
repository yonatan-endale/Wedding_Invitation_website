import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { splitWords } from "@/lib/hero-words";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { FallingPetals } from "../../petals";
import { WeddingImage } from "../../primitives";
import { creditCaps } from "./shared";
import styles from "./reel.module.css";

type Props = { site: SiteData; locale: Locale };

/**
 * The cover as the first frame of a film: the photo full-bleed under static
 * grain, black letterbox bars that close in as the opening parts, and the
 * opening credits over the lower third. The photo is never faded (it is the
 * LCP); it settles by scale, or at the rich level drifts in a slow Ken Burns.
 */
export async function ReelHero({ site, locale }: Props) {
  const t = await getTranslations("layouts.reel");
  const { couple } = site;
  // Nicknames, when the couple set them, replace the first names on the title card.
  const one = pickText(couple.partnerOneNick, locale) || pickText(couple.partnerOne, locale);
  const two = pickText(couple.partnerTwoNick, locale) || pickText(couple.partnerTwo, locale);
  const city = pickText(couple.city, locale);
  const date = formatWeddingDate(couple.weddingAt, couple.timezone, locale);
  const words = [...splitWords(one), "&", ...splitWords(two)];
  const ampersand = splitWords(one).length;

  return (
    <section
      id="top"
      aria-labelledby="reel-title"
      className={cn(styles.hero, "relative isolate flex min-h-[34rem] h-[100svh] flex-col overflow-clip bg-black text-white")}
    >
      <div className="absolute inset-0 -z-10">
        {couple.heroPhotoUrl ? (
          // The outer layer drifts with scroll at the rich level (globals.css); the inner one settles or pushes in.
          <div className="hero-drift absolute inset-0">
            <div className={cn(styles.photo, "absolute inset-0")} style={{ transformOrigin: couple.heroPosition }}>
              <WeddingImage
                src={couple.heroPhotoUrl}
                alt={`${one} & ${two}`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: couple.heroPosition }}
              />
            </div>
          </div>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,color-mix(in_oklab,var(--w-thread-1)_30%,#000)_0%,#000_72%)]"
          />
        )}
        {/* A vignette, then a fall-off under the credits so they hold their contrast on a bright photo. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_45%,rgba(0,0,0,0.55)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.55)_30%,rgba(0,0,0,0.08)_58%,rgba(0,0,0,0)_100%)]"
        />
        <div aria-hidden className={cn(styles.grain, "absolute inset-0")} />
      </div>

      {couple.petals ? <FallingPetals /> : null}

      {/* Letterbox bars. The header sits on the top one; the bottom one carries the city and the other calendar. */}
      <div aria-hidden className={cn(styles.barTop, "absolute inset-x-0 top-0 z-10 h-(--bar) bg-black")} />
      <div
        className={cn(
          styles.barBottom,
          "absolute inset-x-0 bottom-0 z-10 flex h-(--bar) items-center justify-center bg-black px-20 text-center text-white/60",
        )}
      >
        {/* Centred, clear of the fixed music and motion buttons in the corners; stacked on phones. */}
        <div className="flex min-w-0 flex-col items-center gap-x-4 gap-y-1 sm:flex-row">
          {city ? (
            <>
              <p className={creditCaps}>{city}</p>
              <span aria-hidden className="hidden h-px w-6 bg-white/30 sm:block" />
            </>
          ) : null}
          {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
          {locale === "am" ? (
            <p className={creditCaps}>{formatGregorianDate(couple.weddingAt, couple.timezone)}</p>
          ) : (
            <p lang="am" className={creditCaps}>
              {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
            </p>
          )}
        </div>
      </div>

      <div className="relative mx-auto mt-auto mb-[calc(var(--bar)+clamp(2rem,6svh,4rem))] w-full max-w-6xl px-5 text-center sm:px-8">
        <p
          className={cn(styles.credit, creditCaps, "text-[color-mix(in_oklab,var(--w-metal)_55%,white)]")}
          style={{ "--i": 0 } as CSSProperties}
        >
          {t("presents")}
        </p>
        <h1
          id="reel-title"
          className="mt-5 font-display text-[clamp(3.25rem,13.5vw,8rem)] leading-[0.95] tracking-[0.01em] [text-shadow:0_2px_30px_rgba(0,0,0,0.35)] [&:lang(am)]:tracking-normal"
        >
          <span className="sr-only">{`${one} & ${two}`}</span>
          <span aria-hidden>
            {words.map((word, index) => (
              <TitleWord
                key={index}
                word={word}
                index={index}
                small={index === ampersand}
              />
            ))}
          </span>
        </h1>
        <span aria-hidden className={cn(styles.heroRule, "mx-auto mt-7 block h-px w-24 bg-white/45")} />
        <p
          className={cn(styles.credit, "mt-6 text-[clamp(0.95rem,2.4vw,1.2rem)] tracking-[0.22em] text-white/90 uppercase [&:lang(am)]:tracking-normal [&:lang(am)]:normal-case")}
          style={{ "--i": 2 } as CSSProperties}
        >
          {date}
        </p>
      </div>
    </section>
  );
}

/** One word of the title, rising out of a mask that clips only below it, so shadows and accents still spill. */
function TitleWord({ word, index, small }: { word: string; index: number; small: boolean }) {
  return (
    <>
      {index > 0 ? " " : null}
      <span className={cn("inline-block [clip-path:inset(-1em_-1em_-0.18em)]", small && "mx-[0.06em] align-[0.16em] text-[0.5em] text-[color-mix(in_oklab,var(--w-metal)_55%,white)]")}>
        <span className={cn(styles.word, "-mb-[0.18em] inline-block pb-[0.18em]")} style={{ "--i": Math.min(index, 6) } as CSSProperties}>
          {word}
        </span>
      </span>
    </>
  );
}
