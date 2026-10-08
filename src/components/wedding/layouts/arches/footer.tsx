import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { ArchFrame } from "../../kit/arch-frame";
import type { SiteNames } from "../types";
import { GLOW, Plinth, Sunburst, eyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/** A small gold-keyline arch holding the monogram, a faint sunburst behind it, then the families, the names and the date. */
export async function ArchesFooter({ site, locale, names }: Props) {
  const t = await getTranslations("footer");
  const { couple } = site;

  return (
    <footer className="relative isolate overflow-hidden border-t border-rule bg-sheet px-5 pt-24 pb-28 text-center sm:px-8 sm:pt-28">
      <div data-reveal-group className="mx-auto max-w-2xl">
        <div className="relative mx-auto w-[8.5rem]">
          <Sunburst
            id="arches-footer-rays"
            className="pointer-events-none absolute top-[4.25rem] left-1/2 -z-10 w-[32rem] -translate-x-1/2 -translate-y-1/2 opacity-80"
          />
          <ArchFrame keyline ratio={0.76} className="w-full" windowClassName="bg-paper">
            <span aria-hidden className="flex size-full items-center justify-center pt-[18%]" style={GLOW}>
              <span className="font-cormorant text-[2.6rem] leading-none font-light text-ink">
                {names.initials[0]}
                <span className="mx-[0.14em] text-[0.55em] text-ink-soft italic">{locale === "am" ? "፡" : "&"}</span>
                {names.initials[1]}
              </span>
            </span>
          </ArchFrame>
          <Plinth className="absolute -bottom-[2px] left-1/2 w-[15rem] -translate-x-1/2" />
        </div>
        <p data-reveal="fade" style={{ "--i": 2 } as CSSProperties} className={cn(eyebrow, "mt-10")}>
          {t("families")}
        </p>
        <p
          data-reveal="up"
          style={{ "--i": 3 } as CSSProperties}
          className="mt-5 font-cormorant text-[clamp(1.8rem,5vw,2.6rem)] leading-tight font-light [&:lang(am)]:text-[clamp(1.5rem,4.2vw,2.1rem)]"
        >
          {names.one}
          <span className="mx-3 inline-block text-[0.7em] text-ink-soft italic">&amp;</span>
          {names.two}
        </p>
        <p data-reveal="up" style={{ "--i": 4 } as CSSProperties} className="mt-3 text-ink-soft">
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
      </div>
    </footer>
  );
}
