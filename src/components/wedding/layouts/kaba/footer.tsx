import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { FoilText } from "../../kit/foil-text";
import { Band } from "../../primitives";
import type { SiteNames } from "../types";
import styles from "./kaba.module.css";
import { Medallion, StitchRule, kabaEyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/** Lit from below, as if by candlelight. */
const LIGHT = { "--sheen-x": "50%", "--sheen-y": "18%", "--sheen-size": "70% 55%", "--shade-x": "50%", "--shade-y": "105%" } as CSSProperties;

/**
 * The close: the couple's initials in gold foil inside an embroidered
 * medallion ringed with laurel (the rim stitches itself in, the laurel
 * follows), then the names in foil, a stitched rule, the date and the
 * families' line. The couple's border runs along the top like a hem.
 */
export async function KabaFooter({ site, locale, names }: Props) {
  const t = await getTranslations("footer");
  const { couple } = site;
  const separator = locale === "am" ? "፡" : "&";

  return (
    <footer className={cn(styles.velvet, "relative isolate overflow-hidden px-5 pt-28 pb-32 text-center sm:px-8")} style={LIGHT}>
      <Band variant={couple.border} className="absolute inset-x-0 top-0" />
      <div data-reveal-group className="mx-auto max-w-3xl">
        <Medallion id="kaba-footer-monogram" wreath className="mx-auto w-[clamp(11rem,48vw,14rem)]">
          <span aria-hidden className="flex size-full items-center justify-center">
            <FoilText className="font-display text-[clamp(2.7rem,12vw,3.6rem)] leading-none whitespace-nowrap [&:lang(am)]:text-[clamp(2.3rem,10vw,3rem)]">
              {names.initials[0]}
              <span className="mx-[0.12em] font-cormorant text-[0.62em] italic [&:lang(am)]:not-italic">{separator}</span>
              {names.initials[1]}
            </FoilText>
          </span>
        </Medallion>
        <p
          data-reveal="up"
          style={order(3)}
          className="mt-10 font-display text-[clamp(1.9rem,5.2vw,3rem)] leading-[1.15] [&:lang(am)]:text-[clamp(1.5rem,4.4vw,2.25rem)] [&:lang(am)]:leading-[1.35]"
        >
          {/* Stacked on phones, one line on wider screens; the spaces keep the text "One & Two". */}
          <FoilText className="block sm:inline-block">{names.one}</FoilText>{" "}
          <span className="my-1 block font-cormorant text-[0.7em] text-metal italic sm:mx-1 sm:my-0 sm:inline-block [&:lang(am)]:not-italic">
            {locale === "am" ? "እና" : "&"}
          </span>{" "}
          <FoilText className="block sm:inline-block" sheenDelay={0.7}>
            {names.two}
          </FoilText>
        </p>
        <StitchRule id="kaba-footer-rule" className="mt-8" />
        <p data-reveal="up" style={order(5)} className={cn(kabaEyebrow, "mt-6 text-ink lining-nums")}>
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
        <p data-reveal="up" style={order(6)} className="mx-auto mt-5 max-w-[40ch] text-base text-ink-soft">
          {t("families")}
        </p>
      </div>
    </footer>
  );
}
