import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { splitWords } from "@/lib/hero-words";
import { pickText, type Locale, LANGUAGES, usesEthiopianCalendar } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { ArchFrame } from "../../kit/arch-frame";
import { FallingPetals } from "../../petals";
import { WeddingImage } from "../../primitives";
import type { SiteNames } from "../types";
import styles from "./arches.module.css";
import { GLOW, Plinth, Sunburst, eyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/** Width over height of the cover's window: a tall arch. */
const RATIO = 0.7;

/**
 * The cover: the couple's photo in a tall arched window with a double gold
 * keyline that draws itself in, an art-deco sunburst fanning out behind it,
 * and the names in large Cormorant. On wide screens the names flank the arch
 * and an ampersand medallion sits on its foot; on phones they stack beneath
 * it. The arch's width is one custom property (--arch-w), sized so the whole
 * cover fits a laptop screen.
 */
export function ArchesHero({ site, locale, names }: Props) {
  const { couple } = site;
  // Nicknames, when the couple set them, replace the first names on the cover only.
  const one = pickText(couple.partnerOneNick, locale) || pickText(couple.partnerOne, locale);
  const two = pickText(couple.partnerTwoNick, locale) || pickText(couple.partnerTwo, locale);
  const tagline = pickText(couple.tagline, locale);
  const city = pickText(couple.city, locale);
  const firstWords = splitWords(one);
  const secondWords = splitWords(two);
  // The lines under the arch fade up in order; without a tagline the rest move up one step.
  const after = tagline ? 1 : 0;

  return (
    <section
      id="top"
      className={cn(
        styles.timeline,
        "relative isolate overflow-hidden px-5 pt-24 pb-16 sm:px-8 sm:pt-28 lg:pb-20",
        "[--arch-w:min(76vw,21rem,max(13rem,calc((100svh-21rem)*0.7)))]",
        "lg:[--arch-w:clamp(15rem,calc((100svh-17rem)*0.7),25rem)]",
      )}
    >
      {couple.petals ? <FallingPetals /> : null}
      <div className="mx-auto grid max-w-6xl justify-items-center lg:grid-cols-[minmax(0,1fr)_var(--arch-w)_minmax(0,1fr)] lg:gap-x-[clamp(2rem,4vw,4.5rem)]">
        <div className="relative w-[var(--arch-w)] lg:col-start-2 lg:row-start-1">
          {/* Centred on the arch's semicircle; the drift wrapper turns it on scroll (rich), the svg turns into place. */}
          <div
            aria-hidden
            className={cn(
              styles.drift,
              "pointer-events-none absolute top-[calc(var(--arch-w)/2)] left-1/2 -z-10 aspect-square w-[calc(var(--arch-w)*5)] -translate-x-1/2 -translate-y-1/2",
            )}
          >
            <Sunburst id="arches-hero-rays" className={cn(styles.rays, "size-full")} />
          </div>
          <ArchFrame keyline ratio={RATIO} className="w-full" windowClassName="bg-sheet">
            {couple.heroPhotoUrl ? (
              // Rises gently inside the window by transform only, so the photo paints at once.
              <div className={cn(styles.rise, "absolute inset-0")}>
                <WeddingImage
                  src={couple.heroPhotoUrl}
                  alt={`${one} & ${two}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 25rem, (min-width: 640px) 21rem, 76vw"
                  className="object-cover"
                  style={{ objectPosition: couple.heroPosition }}
                />
              </div>
            ) : (
              <span aria-hidden className="flex size-full items-center justify-center" style={GLOW}>
                <span className="font-cormorant text-[calc(var(--arch-w)*0.3)] leading-none font-light text-ink">
                  {names.initials[0]}
                  <span className="mx-[0.06em] text-[0.5em] text-ink-soft italic">{LANGUAGES[locale].initialsSeparator}</span>
                  {names.initials[1]}
                </span>
              </span>
            )}
          </ArchFrame>
          <Plinth className="absolute -bottom-[2px] left-1/2 w-[min(150%,calc(100vw-2.5rem))] -translate-x-1/2 lg:w-[175%]" />
        </div>

        {/* Over the arch's row on wide screens, sharing the page grid's columns so the names sit either side of it. */}
        <h1
          className={cn(
            "mt-10 w-full text-center font-cormorant leading-[0.95] font-light text-ink",
            "text-[clamp(3.25rem,15vw,5rem)] ethiopic:text-[clamp(2.75rem,13vw,4rem)] ethiopic:leading-[1.15]",
            "lg:col-span-full lg:row-start-1 lg:mt-0 lg:grid lg:grid-cols-subgrid lg:items-center",
            "lg:text-[clamp(3.75rem,6vw,6.25rem)] lg:ethiopic:text-[clamp(2.75rem,4.4vw,4.5rem)]",
          )}
        >
          <span className="sr-only">{`${one} & ${two}`}</span>
          <span aria-hidden className="block break-words lg:col-start-1 lg:text-right">
            <Words words={firstWords} start={0} />
          </span>
          <span aria-hidden className="my-2 block text-[0.42em] text-ink-soft italic lg:hidden">
            <Words words={["&"]} start={firstWords.length} />
          </span>
          <span aria-hidden className="block break-words lg:col-start-3 lg:text-left">
            <Words words={secondWords} start={firstWords.length + 1} />
          </span>
        </h1>

        {/* The ampersand medallion on the arch's foot, wide screens only (phones read it between the names). */}
        <span
          aria-hidden
          className="hero-fade relative z-10 hidden size-[3.75rem] translate-y-1/2 items-center justify-center rounded-full border border-metal/80 bg-paper font-cormorant text-[2rem] leading-none text-ink italic lg:col-start-2 lg:row-start-1 lg:flex lg:self-end"
          style={{ "--i": 0 } as CSSProperties}
        >
          <span className="absolute inset-[4px] rounded-full border border-metal/35" />
          <span className="-mt-[0.1em]">&amp;</span>
        </span>

        <div className="mt-9 text-center lg:col-span-full lg:mt-12">
          {tagline ? (
            <p className="hero-fade mx-auto mb-5 max-w-[34ch] font-cormorant text-[1.35rem] leading-snug italic" style={{ "--i": 0 } as CSSProperties}>
              {tagline}
            </p>
          ) : null}
          <p
            className="hero-fade font-cormorant text-[clamp(1.4rem,4.4vw,1.85rem)] leading-tight font-medium lining-nums ethiopic:text-[clamp(1.2rem,4vw,1.6rem)]"
            style={{ "--i": after } as CSSProperties}
          >
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
          {usesEthiopianCalendar(locale) ? (
            <p className="hero-fade mt-1 text-base text-ink-soft" style={{ "--i": after + 1 } as CSSProperties}>
              {formatGregorianDate(couple.weddingAt, couple.timezone)}
            </p>
          ) : (
            <p lang="am" className="hero-fade mt-1 text-base text-ink-soft" style={{ "--i": after + 1 } as CSSProperties}>
              {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
            </p>
          )}
          {city ? (
            <p className={cn(eyebrow, "hero-fade mt-5")} style={{ "--i": after + 2 } as CSSProperties}>
              {city}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Words that rise one after another out of their own line masks (the shared
 * hero-word entrance). The mask clips only below, so accents still show.
 */
function Words({ words, start }: { words: string[]; start: number }) {
  return (
    <>
      {words.map((word, index) => (
        <span key={index}>
          {index > 0 ? " " : null}
          <span className="inline-block [clip-path:inset(-1em_-1em_-0.2em)]">
            <span className="hero-word -mb-[0.2em] inline-block pb-[0.2em]" style={{ "--i": Math.min(start + index, 6) } as CSSProperties}>
              {word}
            </span>
          </span>
        </span>
      ))}
    </>
  );
}
