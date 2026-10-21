import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { splitWords } from "@/lib/hero-words";
import { pickText, type Locale, usesEthiopianCalendar } from "@/lib/localized";
import { widestWordEm } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { FallingPetals } from "./petals";
import { Band, WeddingImage } from "./primitives";

type Props = { site: SiteData; locale: Locale };

export function Hero({ site, locale }: Props) {
  const { couple } = site;
  // Nicknames, when the couple set them, replace the full names in the hero only.
  const one = pickText(couple.partnerOneNick, locale) || pickText(couple.partnerOne, locale);
  const two = pickText(couple.partnerTwoNick, locale) || pickText(couple.partnerTwo, locale);
  const tagline = pickText(couple.tagline, locale);
  const city = pickText(couple.city, locale);

  return (
    <>
      <section id="top" className="relative isolate flex min-h-[100svh] items-end overflow-clip bg-ink text-white">
        {couple.heroPhotoUrl ? (
          // The outer layer drifts with scroll (rich), the inner one settles from a slight zoom.
          // Neither touches opacity, so the photo paints at once.
          <div className="hero-drift absolute inset-0 -z-20">
            <div className="hero-photo absolute inset-0">
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
          <div aria-hidden className="absolute inset-0 -z-20 bg-thread-1" />
        )}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.38)_38%,rgba(0,0,0,0.04)_68%,rgba(0,0,0,0.3)_100%)]"
        />
        {couple.petals ? <FallingPetals /> : null}
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-32 sm:px-8 sm:pb-20">
          {tagline ? <p className="mb-5 max-w-md text-lg text-white/85 sm:text-xl">{tagline}</p> : null}
          {/* Capped by the widest word (plus the second line's indent and ampersand) so long names stay on a phone screen. */}
          <h1
            className="font-display text-[length:min(clamp(3.75rem,14vw,10.5rem),calc((100vw_-_2.5rem)/var(--name-em)))] leading-[0.88] tracking-[-0.01em] [text-shadow:0_2px_24px_rgba(0,0,0,0.25)]"
            style={{ "--name-em": Math.max(widestWordEm(one), widestWordEm(two) + 1.4).toFixed(2) } as CSSProperties}
          >
            <HeroNames
              one={one}
              two={two}
              secondLine="pl-[0.55em]"
              ampersand="mr-[0.28em] align-[0.14em] text-[0.48em]"
            />
          </h1>
          <div className="mt-8 space-y-1 text-lg text-white/90 sm:text-xl">
            <p className="hero-fade" style={{ "--i": 0 } as CSSProperties}>
              {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
            </p>
            {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
            {usesEthiopianCalendar(locale) ? (
              <p className="hero-fade text-white/70" style={{ "--i": 1 } as CSSProperties}>
                {formatGregorianDate(couple.weddingAt, couple.timezone)}
              </p>
            ) : (
              <p lang="am" className="hero-fade text-white/70" style={{ "--i": 1 } as CSSProperties}>
                {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
              </p>
            )}
            {city ? (
              <p className="hero-fade text-white/70" style={{ "--i": 2 } as CSSProperties}>
                {city}
              </p>
            ) : null}
          </div>
        </div>
      </section>
      <Band variant={couple.border} />
    </>
  );
}

type HeroNamesProps = {
  one: string;
  two: string;
  /** Classes for the second line, which starts with the ampersand. */
  secondLine?: string;
  /** Size, spacing and lift of the ampersand. */
  ampersand: string;
};

/**
 * The couple's names on two lines for a hero h1. Screen readers get one full
 * copy; the visible words rise one after another out of their own masks, the
 * ampersand counted as a word between the two names.
 */
export function HeroNames({ one, two, secondLine, ampersand }: HeroNamesProps) {
  const first = splitWords(one);
  const second = splitWords(two);

  return (
    <>
      <span className="sr-only">{`${one} & ${two}`}</span>
      <span aria-hidden className="block">
        {first.map((word, index) => (
          <HeroWord key={index} word={word} index={index} spaced={index > 0} />
        ))}
      </span>
      <span aria-hidden className={cn("block", secondLine)}>
        <HeroWord word="&" index={first.length} className={ampersand} />
        {second.map((word, index) => (
          <HeroWord key={index} word={word} index={first.length + 1 + index} spaced={index > 0} />
        ))}
      </span>
    </>
  );
}

type HeroWordProps = {
  word: string;
  /** Position across both names, which sets the stagger (capped so long names stay brisk). */
  index: number;
  /** Puts a space before the word, so the line can still wrap between words. */
  spaced?: boolean;
  className?: string;
};

/**
 * One word rising out of a mask that clips only below it, so text shadows and
 * accents still spill freely (overflow-hidden would cut them, and would move the
 * baseline). The word's bottom padding, cancelled by a negative margin so lines
 * lay out as plain text, lengthens the rise to clear descenders.
 */
function HeroWord({ word, index, spaced, className }: HeroWordProps) {
  return (
    <>
      {spaced ? " " : null}
      <span className={cn("inline-block [clip-path:inset(-1em_-1em_-0.2em)]", className)}>
        <span
          className="hero-word -mb-[0.2em] inline-block pb-[0.2em]"
          style={{ "--i": Math.min(index, 6) } as CSSProperties}
        >
          {word}
        </span>
      </span>
    </>
  );
}
