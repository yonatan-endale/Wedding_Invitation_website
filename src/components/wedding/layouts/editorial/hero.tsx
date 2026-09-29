import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate, formatWeddingTime, weddingDateParts } from "@/lib/wedding-format";
import { FallingPetals } from "../../petals";
import { WeddingImage } from "../../primitives";
import { eyebrow } from "./shared";

type Props = { site: SiteData; locale: Locale };

/** Split hero: names and invitation on the left, the cover photo with the date in large numerals on the right. */
export async function EditorialHero({ site, locale }: Props) {
  const t = await getTranslations("invitation");
  const { couple } = site;
  const one = pickText(couple.partnerOneNick, locale) || pickText(couple.partnerOne, locale);
  const two = pickText(couple.partnerTwoNick, locale) || pickText(couple.partnerTwo, locale);
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const tagline = pickText(couple.tagline, locale);
  const city = pickText(couple.city, locale);
  const date = weddingDateParts(couple.weddingAt, couple.timezone, locale);

  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {couple.petals ? <FallingPetals /> : null}
      <div
        id="invitation"
        className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        <div>
          <p className={eyebrow}>{t("eyebrow")}</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.95] tracking-[-0.01em]">
            <span className="block">{one}</span>
            <span className="block">
              <span className="mr-[0.22em] inline-block align-[0.1em] text-[0.6em]">&amp;</span>
              {two}
            </span>
          </h1>
          {tagline ? <p className="mt-6 text-xl">{tagline}</p> : null}
          <p className="mt-8 text-ink-soft">{hosts}</p>
          <p className="mt-2 max-w-[44ch]">{invitation}</p>
          <p className="mt-8 font-display text-[clamp(1.35rem,3vw,1.75rem)] leading-tight">
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          <p className="mt-1 text-ink-soft">
            {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
            {city ? ` · ${city}` : ""}
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative flex-1 border border-rule bg-sheet p-2 sm:p-3">
            <div className="relative aspect-[4/3] overflow-hidden bg-thread-1">
              {couple.heroPhotoUrl ? (
                <WeddingImage
                  src={couple.heroPhotoUrl}
                  alt={`${one} & ${two}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: couple.heroPosition }}
                />
              ) : null}
            </div>
          </div>
          <div
            aria-hidden
            className={cn(
              "flex items-baseline justify-center gap-5 font-display leading-none text-ink/30 tabular-nums",
              "sm:flex-col sm:items-end sm:gap-2",
            )}
          >
            <span className="text-[clamp(3.5rem,9vw,6.5rem)]">{date.day}</span>
            <span className={cn("text-[clamp(1.6rem,4vw,2.5rem)] uppercase", locale === "am" && "text-[clamp(1.35rem,3vw,2rem)]")}>
              {date.month}
            </span>
            <span className="text-[clamp(2.25rem,6vw,4rem)]">{date.year}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
