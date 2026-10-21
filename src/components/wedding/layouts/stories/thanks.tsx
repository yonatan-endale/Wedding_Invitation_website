import { RotateCcw } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { type Locale, LANGUAGES } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { WeddingImage } from "../../primitives";
import type { SiteNames } from "../types";
import { COLOUR_STORY } from "./countdown";
import { Initials, StoryCard, StoryRing, darkGround, pill } from "./card";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * The last story, as the footer: the couple in the story ring, "Thank you",
 * the families, the names and the day, and a link back to the first card.
 */
export async function StoriesThanks({ site, locale, names }: Props) {
  const [t, tf] = await Promise.all([getTranslations("layouts.stories"), getTranslations("footer")]);
  const { couple } = site;

  return (
    <StoryCard as="footer" id="thanks" tone="dark" labelledBy="stories-thanks" className={cn(darkGround, "z-10")} style={COLOUR_STORY}>
      <div data-reveal-group className="flex flex-1 flex-col items-center justify-center px-6 pt-14 pb-12 text-center">
        <span data-reveal="scale" className="block">
          <StoryRing className="size-28" ground="bg-[#110f0e]">
            {couple.heroPhotoUrl ? (
              <WeddingImage
                src={couple.heroPhotoUrl}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
                style={{ objectPosition: couple.heroPosition }}
              />
            ) : (
              <Initials initials={names.initials} separator={LANGUAGES[locale].initialsSeparator} className="text-3xl" />
            )}
          </StoryRing>
        </span>
        <h2
          id="stories-thanks"
          data-reveal="up"
          style={order(1)}
          className="mt-8 font-display text-[clamp(2.75rem,15cqi,4rem)] leading-none ethiopic:text-[clamp(2.3rem,12cqi,3.3rem)] ethiopic:leading-[1.2]"
        >
          {t("thanks")}
        </h2>
        <p data-reveal="up" style={order(2)} className="mt-5 max-w-[30ch] text-white/90">
          {tf("families")}
        </p>
        <span aria-hidden data-reveal="rule" style={order(3)} className="my-7 block h-px w-14 bg-white/50" />
        <p
          data-reveal="up"
          style={order(4)}
          className="font-display text-[clamp(1.4rem,7cqi,1.85rem)] leading-snug ethiopic:text-[clamp(1.25rem,6cqi,1.6rem)]"
        >
          {names.one}
          <span className="mx-2 inline-block text-[0.7em] text-white/75">&amp;</span>
          {names.two}
        </p>
        <p data-reveal="up" style={order(5)} className="mt-1.5 text-base text-white/85">
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
        <div data-reveal="up" style={order(6)} className="mt-10">
          <a href="#top" className={cn(pill, "min-h-11 bg-white/95 px-5 text-[#141210] hover:bg-white")}>
            <RotateCcw aria-hidden className="size-4 shrink-0" />
            {t("restart")}
          </a>
        </div>
      </div>
    </StoryCard>
  );
}
