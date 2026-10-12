import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { WaxSeal } from "../../ornaments/wax-seal";
import { eyebrowClass } from "../../primitives";
import type { SiteNames } from "../types";
import styles from "./flatlay.module.css";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/** The last piece of the suite: a small deckled thank-you note, sealed with the couple's wax seal. */
export async function FlatlayFooter({ site, locale, names }: Props) {
  const t = await getTranslations("layouts.flatlay");
  const tFooter = await getTranslations("footer");
  const { couple } = site;

  return (
    <footer className={cn(styles.onLinen, "px-4 pt-10 pb-28 sm:px-8 sm:pt-16 sm:pb-36")}>
      <div className={cn(styles.note, styles.deckleShadow, "mx-auto w-[min(100%,30rem)]")}>
        <div data-reveal-group className={cn(styles.sheet, styles.deckleAll, "px-8 pt-14 pb-12 text-center sm:px-12")}>
          <span aria-hidden className={styles.keyline} />
          <p data-reveal="up" className="relative font-cormorant text-[clamp(2.6rem,10vw,3.6rem)] leading-none font-medium italic [&:lang(am)]:text-[clamp(2rem,8vw,2.8rem)] [&:lang(am)]:leading-tight [&:lang(am)]:not-italic">
            {t("thanks")}
          </p>
          <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="relative mx-auto mt-5 max-w-[30ch] text-ink-soft">
            {t("thanksNote")}
          </p>
          <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="relative mt-8 font-display text-[clamp(1.45rem,5vw,1.85rem)] leading-tight">
            <span className="block">{names.one}</span>{" "}
            <span className="block text-[0.7em] text-ink-soft">&amp;</span>{" "}
            <span className="block">{names.two}</span>
          </p>
          <p data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="relative mt-2 text-ink-soft">
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          <p data-reveal="fade" style={{ "--i": 4 } as CSSProperties} className={cn(eyebrowClass, "relative mx-auto mt-8 max-w-[34ch] leading-relaxed")}>
            {tFooter("families")}
          </p>
          <span aria-hidden data-reveal="pop" style={{ "--i": 5 } as CSSProperties} className="relative mx-auto mt-8 block w-16 drop-shadow-[0_3px_4px_rgb(60_10_10/0.3)]">
            <WaxSeal initials={names.initials} separator={locale === "am" ? "፡" : "&"} tone="wax" className="w-full" />
          </span>
        </div>
      </div>
    </footer>
  );
}
