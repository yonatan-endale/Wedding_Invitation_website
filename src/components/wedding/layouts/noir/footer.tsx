import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { Crest } from "../../kit/crest";
import { FoilText } from "../../kit/foil-text";
import type { SiteNames } from "../types";
import { GoldRule, Sparkles, noirEyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/** The same warm light as the cover, smaller, under the closing crest. */
const FOOTER_LIGHT: CSSProperties = {
  backgroundImage: "radial-gradient(45% 55% at 50% 30%, color-mix(in oklab, var(--w-metal) 10%, transparent), transparent 75%)",
};

/** The close: a small crest that draws itself in, the full names in foil, the date and the families' line. */
export async function NoirFooter({ site, locale, names }: Props) {
  const t = await getTranslations("footer");
  const { couple } = site;
  return (
    <footer className="relative isolate overflow-hidden border-t border-rule px-5 pt-24 pb-32 text-center sm:px-8">
      <div aria-hidden className="absolute inset-0 -z-10" style={FOOTER_LIGHT} />
      <div data-reveal-group>
        <div className="relative mx-auto w-[clamp(5.5rem,20vw,7rem)]">
          <Crest initials={names.initials} separator={locale === "am" ? "፡" : "&"} id="noir-footer-crest" className="w-full" />
          <Sparkles />
        </div>
        <p
          data-reveal="up"
          style={order(3)}
          className="mt-9 font-cormorant text-[clamp(1.9rem,5vw,3rem)] leading-[1.15] font-light [&:lang(am)]:text-[clamp(1.5rem,4.2vw,2.25rem)]"
        >
          <FoilText className="inline-block">{names.one}</FoilText>
          <span className="mx-3 inline-block text-[0.7em] text-metal italic [&:lang(am)]:not-italic">
            {locale === "am" ? "እና" : "&"}
          </span>
          <FoilText className="inline-block" sheenDelay={0.7}>
            {names.two}
          </FoilText>
        </p>
        <GoldRule className="mt-7" index={4} />
        <p data-reveal="up" style={order(5)} className={cn(noirEyebrow, "mt-6 text-sm text-ink lining-nums")}>
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
        <p data-reveal="up" style={order(6)} className="mx-auto mt-5 max-w-[40ch] text-base text-ink-soft">
          {t("families")}
        </p>
      </div>
    </footer>
  );
}
