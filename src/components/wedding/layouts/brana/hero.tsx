import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { FaithOrnament } from "../../ornaments/faith-ornament";
import { FallingPetals } from "../../petals";
import { WeddingImage } from "../../primitives";
import styles from "./brana.module.css";
import { nameLang, scribedName, scriptLang, type ScribedName } from "./names";
import { Headpiece, MiniatureFrame, SectionMark, SideBand, order } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

/** One partner's name: the Ge'ez form, when the couple gave one, above the Latin; each line rises out of its own mask. */
function Name({ name, step }: { name: ScribedName; step: number }) {
  return (
    <span className="block">
      {name.geez ? (
        <span className="block [clip-path:inset(-1em_-1em_-0.15em)]">
          <span lang="am" className={cn(styles.heroGeez, "hero-word block")} style={order(step)}>
            {name.geez}
          </span>
        </span>
      ) : null}
      {name.latin ? (
        <span className="block [clip-path:inset(-1em_-1em_-0.2em)]">
          <span
            lang={nameLang(name.latin)}
            className={cn(name.geez ? styles.heroGloss : styles.heroLatin, "hero-word block", name.geez && "mt-1")}
            style={order(step + 1)}
          >
            {name.latin}
          </span>
        </span>
      ) : null}
    </span>
  );
}

/**
 * The opening page, set as the incipit of an illuminated Ge'ez book: a tall
 * harag headpiece with side bands hanging from it like the legs of a Π
 * (short on phones, the whole page on wide screens), the couple's names in
 * red rubric (the Ge'ez form above the Latin one when they gave both, never
 * transliterated), the day in both calendars and the city. The cover photo,
 * if any, is a small framed miniature beside the names (above them on
 * phones); it paints at once and only settles from a slight zoom. A faith
 * ornament, if the couple chose one, stands on the headpiece like a finial.
 */
export function BranaHero({ site, locale }: Props) {
  const { couple } = site;
  const ornament = getOrnament(couple.ornament);
  const one = scribedName(couple.partnerOne);
  const two = scribedName(couple.partnerTwo);
  const tagline = pickText(couple.tagline, locale);
  const city = pickText(couple.city, locale);
  const and = locale === "am" ? "እና" : "&";
  // Screen readers get the names once, in the page's language; the two scripts are for the eye.
  const spoken = `${pickText(couple.partnerOne, locale)} ${and} ${pickText(couple.partnerTwo, locale)}`;
  const photo = couple.heroPhotoUrl;
  const steps = (name: ScribedName) => (name.geez ? 1 : 0) + (name.latin ? 1 : 0);

  return (
    <section id="top" className="relative overflow-x-clip px-4 pt-[5.75rem] pb-14 sm:px-8 sm:pt-28 lg:pb-20">
      {couple.petals ? <FallingPetals /> : null}
      <div className="relative mx-auto max-w-5xl">
        {ornament !== "none" ? (
          <div className="hero-fade relative z-10 -mb-1.5 flex justify-center" style={order(0)}>
            <span className="rounded-full bg-(--brana-parchment) px-2 pt-1">
              <FaithOrnament ornament={ornament} reveal={false} className="size-9 text-(--brana-rubric) sm:size-10" />
            </span>
          </div>
        ) : null}
        <Headpiece rows={2} reveal={false} className={cn(styles.unfurl, styles.earsWide)} />

        <div className="relative">
          <SideBand className={cn(styles.legs, styles.legLeft)} bandClassName={styles.descend} />
          <SideBand className={cn(styles.legs, styles.legRight)} bandClassName={styles.descend} />

          <div
            className={cn(
              "grid justify-items-center gap-y-8 px-12 pt-8 pb-4 text-center sm:px-16 sm:pt-10 lg:px-20 lg:pt-12 lg:pb-12",
              photo && "lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-center lg:gap-x-14",
            )}
          >
            {photo ? (
              <MiniatureFrame className="w-[min(100%,clamp(8.5rem,min(42vw,22svh),11rem))] lg:w-full" windowClassName="aspect-[4/5]">
                {/* Settles from a slight zoom by transform only, so the photo paints at once. */}
                <div className="hero-photo absolute inset-0">
                  <WeddingImage
                    src={photo}
                    alt={spoken}
                    fill
                    priority
                    sizes="(min-width: 1024px) 17rem, 11rem"
                    className="object-cover"
                    style={{ objectPosition: couple.heroPosition }}
                  />
                </div>
              </MiniatureFrame>
            ) : null}

            <div className="w-full min-w-0">
              <h1 className="break-words">
                <span className="sr-only">{spoken}</span>
                <span aria-hidden className="block">
                  <Name name={one} step={0} />
                  <span className="hero-fade my-2 block font-cormorant text-[clamp(1.4rem,4vw,1.9rem)] leading-none text-ink italic [&:lang(am)]:my-3 [&:lang(am)]:text-[clamp(1.1rem,3.2vw,1.4rem)] [&:lang(am)]:not-italic" style={order(1)}>
                    {and}
                  </span>
                  <Name name={two} step={steps(one) + 1} />
                </span>
              </h1>

              {tagline ? (
                <p
                  lang={scriptLang(tagline)}
                  className="hero-fade mx-auto mt-5 max-w-[34ch] font-cormorant text-[clamp(1.15rem,2.6vw,1.4rem)] text-ink-soft italic [&:lang(am)]:not-italic"
                  style={order(2)}
                >
                  {tagline}
                </p>
              ) : null}

              <SectionMark className="hero-fade mt-6 text-[1.35rem]" style={order(2)} />

              <p
                className="hero-fade mt-3 font-cormorant text-[clamp(1.3rem,3.4vw,1.7rem)] leading-tight font-medium lining-nums [&:lang(am)]:text-[clamp(1.15rem,3vw,1.4rem)]"
                style={order(3)}
              >
                {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
              </p>
              {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
              {locale === "am" ? (
                <p className="hero-fade mt-1 text-base text-ink-soft" style={order(4)}>
                  {formatGregorianDate(couple.weddingAt, couple.timezone)}
                </p>
              ) : (
                <p lang="am" className="hero-fade mt-1 text-base text-ink-soft" style={order(4)}>
                  {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
                </p>
              )}
              {city ? (
                <p
                  lang={scriptLang(city)}
                  className={cn(styles.incipit, "hero-fade mt-4 text-sm [&:lang(am)]:text-base")}
                  style={order(5)}
                >
                  {city}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
