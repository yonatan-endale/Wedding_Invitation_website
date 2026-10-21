import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { splitWords } from "@/lib/hero-words";
import { pickText, type Locale, isEthiopic } from "@/lib/localized";
import { widestWordEm } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { FallingPetals } from "../../petals";
import { WeddingImage } from "../../primitives";
import type { SiteNames } from "../types";
import { DateAndPlace, Monogram, order, slateEyebrow } from "./kit";
import styles from "./slate.module.css";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/** One word rising out of a mask that clips only below it (the shared hero's entrance, see .hero-word). */
function Word({ word, index, className }: { word: string; index: number; className?: string }) {
  return (
    <span className={cn("inline-block [clip-path:inset(-1em_-1em_-0.25em)]", className)}>
      <span className="hero-word -mb-[0.25em] inline-block pb-[0.25em]" style={order(Math.min(index, 6))}>
        {word}
      </span>
    </span>
  );
}

/** The widest one-line name, in em, that fits a tablet or desktop cover at the largest size. */
const ONE_LINE_EM = 9.5;

const buttonBase =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[0.875rem] px-7 font-sans text-sm font-semibold uppercase tracking-[0.14em] transition-[filter,background-color,border-color] sm:w-auto ethiopic:text-base ethiopic:font-medium ethiopic:tracking-normal ethiopic:normal-case";

/**
 * The cover: the couple's photo full-bleed, the deep band rising from its
 * foot, and on it a small "Wedding invitation" pill, the names with a script
 * ampersand, the day and the city, the two ways in (confirm attendance, see
 * the day) and a scroll cue. Without a photo the band fills the cover and the
 * monogram sits in its glow. The photo paints at once: it only settles from a
 * slight zoom, by transform.
 */
export async function SlateHero({ site, locale, names }: Props) {
  const t = await getTranslations("layouts.slate");
  const tInvitation = await getTranslations("invitation");
  const { couple } = site;
  // Nicknames, when the couple set them, stand in for the first names on the cover only.
  const one = pickText(couple.partnerOneNick, locale) || names.firstOne;
  const two = pickText(couple.partnerTwoNick, locale) || names.firstTwo;
  const city = pickText(couple.city, locale);
  const date = formatWeddingDate(couple.weddingAt, couple.timezone, locale);
  const first = splitWords(one);
  const second = splitWords(two);
  // Two lines on a phone ("One" / "& Two"), so each is capped by its widest word plus the ampersand.
  const nameEm = Math.max(widestWordEm(one), widestWordEm(two) + 1.1).toFixed(2);
  // From tablets up the names share one line when it fits at the largest size; long names stay stacked,
  // so the ampersand always opens the second line instead of hanging at the end of the first.
  const lineEm = [...first, ...second].reduce((sum, word) => sum + widestWordEm(word) + 0.3, 1.1);
  const inline = lineEm <= ONE_LINE_EM ? "md:inline" : null;
  const photo = couple.heroPhotoUrl;

  return (
    <section
      id="top"
      className={cn("relative isolate flex min-h-[100svh] flex-col overflow-clip text-white", !photo && styles.coverPlain)}
    >
      {photo ? (
        <>
          {/* The outer layer drifts with scroll (rich), the inner one settles from a slight zoom; neither touches opacity. */}
          <div className="hero-drift absolute inset-0 -z-20">
            <div className="hero-photo absolute inset-0">
              <WeddingImage
                src={photo}
                alt={`${one} & ${two}`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: couple.heroPosition }}
              />
            </div>
          </div>
          <div aria-hidden className={cn(styles.coverShade, "absolute inset-0 -z-10")} />
        </>
      ) : null}
      {couple.petals ? <FallingPetals /> : null}

      <div className={cn("relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-5 pt-28 pb-7 text-center sm:px-8", photo ? "justify-end" : "justify-center")}>
        {photo ? null : (
          <Monogram
            initials={names.initials}
            locale={locale}
            tone="band"
            className="hero-fade mb-10 size-[clamp(6.5rem,26vw,8.5rem)] text-[clamp(1.7rem,6.4vw,2.2rem)]"
          />
        )}

        <p
          className={cn(
            slateEyebrow,
            "hero-fade inline-flex min-h-8 items-center rounded-full border border-white/35 bg-white/10 px-4 text-[0.7rem] text-white backdrop-blur-sm ethiopic:text-sm",
          )}
          style={order(0)}
        >
          {tInvitation("eyebrow")}
        </p>

        <h1
          className="mt-5 font-display text-[length:min(clamp(2.9rem,11vw,6.25rem),calc((100vw_-_2.5rem)/var(--name-em)))] leading-[1.06] [text-shadow:0_2px_22px_rgb(0_0_0/0.28)] ethiopic:leading-[1.25] md:text-[length:min(clamp(2.9rem,7.4vw,6.25rem),calc((100vw_-_4rem)/var(--name-em)))]"
          style={{ "--name-em": nameEm } as CSSProperties}
        >
          <span className="sr-only">{`${one} & ${two}`}</span>
          <span aria-hidden className={cn("block", inline)}>
            {first.map((word, index) => (
              <span key={index}>
                {index > 0 ? " " : null}
                <Word word={word} index={index} />
              </span>
            ))}
          </span>{" "}
          <span aria-hidden className={cn("block", inline)}>
            <Word
              word="&"
              index={first.length}
              className={cn(
                "mr-[0.22em] text-(--slate-glow)",
                isEthiopic(locale) ? "text-[0.7em]" : "font-script text-[0.92em] [&>span]:pr-[0.08em]",
              )}
            />
            {second.map((word, index) => (
              <span key={index}>
                {index > 0 ? " " : null}
                <Word word={word} index={first.length + 1 + index} />
              </span>
            ))}
          </span>
        </h1>

        <DateAndPlace date={date} city={city} className="hero-fade mt-5 text-white/85" style={order(1)} />

        {couple.rsvpEnabled || site.events.length > 0 ? (
          <div className="hero-fade mt-8 flex w-full max-w-[22rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center" style={order(2)}>
            {couple.rsvpEnabled ? (
              <a
                href="#rsvp"
                className={cn(
                  buttonBase,
                  "bg-thread-1 text-on-thread-1 shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--w-thread-1)_80%,transparent)] hover:brightness-110",
                )}
              >
                {t("confirm")}
              </a>
            ) : null}
            {site.events.length > 0 ? (
              <a href="#schedule" className={cn(buttonBase, "border border-white/45 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white/15")}>
                {t("seeDay")}
              </a>
            ) : null}
          </div>
        ) : null}

        {/* Decoration only: the header and the buttons are the ways down the page. */}
        <div aria-hidden className={cn(slateEyebrow, "hero-fade mt-9 flex flex-col items-center gap-1 text-[0.65rem] text-white/75")} style={order(3)}>
          {t("scroll")}
          <ChevronDown className={cn(styles.cue, "size-4 text-(--slate-glow)")} />
        </div>
      </div>
    </section>
  );
}
