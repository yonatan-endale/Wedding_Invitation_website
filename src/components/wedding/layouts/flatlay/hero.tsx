import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { getOpening } from "@/lib/opening";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { WaxSeal } from "../../ornaments/wax-seal";
import { WeddingImage } from "../../primitives";
import type { SiteNames } from "../types";
import styles from "./flatlay.module.css";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/**
 * The cover: an envelope on the linen with the printed card the names are
 * set on, the couple's photo as a print beside it. A guest who has just
 * opened the envelope opening finds the same envelope already open, its card
 * risen out of the pocket and the wax seal lying broken on the table; with
 * any other opening it is still sealed and the card lies beside it.
 */
export async function FlatlayHero({ site, locale, names }: Props) {
  const t = await getTranslations("invitation");
  const { couple } = site;
  const open = getOpening(couple.opening) === "envelope";
  // Nicknames, when the couple set them, replace the first names on the cover only.
  const one = pickText(couple.partnerOneNick, locale) || pickText(couple.partnerOne, locale);
  const two = pickText(couple.partnerTwoNick, locale) || pickText(couple.partnerTwo, locale);
  const separator = locale === "am" ? "፡" : "&";
  const city = pickText(couple.city, locale);

  return (
    <section id="top" aria-labelledby="flatlay-names" className={styles.hero}>
      <div className={styles.scene} data-open={open || undefined} data-photo={couple.heroPhotoUrl ? "" : undefined}>
        {/* Back of the envelope, and the open flap with its liner. */}
        <div aria-hidden className={cn(styles.piece, styles.envBox, styles.envBack)}>
          <span className={cn(styles.panel, styles.back)} />
          {open ? <span className={styles.flapOpen} /> : null}
        </div>

        <div className={cn(styles.piece, styles.heroCard, styles.sheet)}>
          <div className={cn(styles.cardFace, "flex flex-col items-center px-[9cqw] pt-[11cqw] text-center")}>
            <span aria-hidden className={styles.keyline} />
            <p className="text-[max(0.75rem,3.6cqw)] tracking-[0.28em] text-ink-soft uppercase [&:lang(am)]:text-[max(0.85rem,4.4cqw)] [&:lang(am)]:tracking-normal [&:lang(am)]:normal-case">
              {t("eyebrow")}
            </p>
            <h1
              id="flatlay-names"
              className="mt-[5cqw] font-cormorant text-[13cqw] leading-[1.02] font-medium text-ink italic [overflow-wrap:anywhere] [&:lang(am)]:text-[9.5cqw] [&:lang(am)]:leading-[1.25] [&:lang(am)]:not-italic"
            >
              {/* Spaces between the lines keep the heading's text "One & Two" for screen readers. */}
              <span className="block">{one}</span>{" "}
              <span className="block text-[0.55em] text-ink-soft">&amp;</span>{" "}
              <span className="block">{two}</span>
            </h1>
            <span aria-hidden className="mt-[5cqw] block h-px w-[18cqw] bg-metal" />
            <p className="mt-[4.5cqw] font-display text-[max(1rem,5.6cqw)] leading-snug [&:lang(am)]:text-[max(1rem,5cqw)]">
              {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
            </p>
            {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
            {locale === "am" ? (
              <p className="mt-[1cqw] text-[max(0.8rem,4cqw)] text-ink-soft">{formatGregorianDate(couple.weddingAt, couple.timezone)}</p>
            ) : (
              <p lang="am" className="mt-[1cqw] text-[max(0.8rem,4cqw)] text-ink-soft">
                {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
              </p>
            )}
            {city && !open ? (
              <p className="mt-[3cqw] text-[max(0.75rem,3.6cqw)] tracking-[0.2em] text-ink-soft uppercase [&:lang(am)]:tracking-normal [&:lang(am)]:normal-case">
                {city}
              </p>
            ) : null}
          </div>
        </div>

        {/* The pocket in front of the card, and when sealed the flap and the wax seal over it. */}
        <div aria-hidden className={cn(styles.piece, styles.envBox, styles.envFront)}>
          <span className={cn(styles.pocket, styles.panel)}>
            <span className={cn(styles.panel, styles.foldLeft)} />
            <span className={cn(styles.panel, styles.foldRight)} />
            <span className={cn(styles.panel, styles.foldBottom)} />
          </span>
          {open ? null : (
            <>
              <span className={styles.flapClosed} />
              <span className={styles.seal}>
                <WaxSeal initials={names.initials} separator={separator} tone="wax" className="size-full" />
              </span>
            </>
          )}
        </div>

        {couple.heroPhotoUrl ? (
          <div className={cn(styles.piece, styles.print)}>
            <div className={styles.photo}>
              <div className="relative aspect-[4/5] overflow-hidden bg-rule">
                <WeddingImage
                  src={couple.heroPhotoUrl}
                  alt={`${one} & ${two}`}
                  fill
                  priority
                  sizes="(min-width: 768px) 15rem, 40vw"
                  className="object-cover"
                  style={{ objectPosition: couple.heroPosition }}
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* Opened: the seal lies broken in two on the table. */}
        {open ? (
          <>
            <span aria-hidden className={cn(styles.piece, styles.sealLeft)}>
              <WaxSeal initials={names.initials} separator={separator} tone="wax" half="left" className="w-full" />
            </span>
            <span aria-hidden className={cn(styles.piece, styles.sealRight)}>
              <WaxSeal initials={names.initials} separator={separator} tone="wax" half="right" className="w-full" />
            </span>
          </>
        ) : null}
      </div>
    </section>
  );
}
