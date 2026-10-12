import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { pickText, type Locale } from "@/lib/localized";
import { initials } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatWeddingDate, formatWeddingTime, weddingDateParts } from "@/lib/wedding-format";
import { HeroNames } from "../../hero";
import { FaithOrnament } from "../../ornaments/faith-ornament";
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
  const [initialOne, initialTwo] = initials(pickText(couple.partnerOne, locale), pickText(couple.partnerTwo, locale));
  // The lines under the names fade up in reading order; without a tagline the rest move up one step.
  const after = tagline ? 1 : 0;

  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {couple.petals ? <FallingPetals /> : null}
      <div
        id="invitation"
        className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        <div>
          <FaithOrnament ornament={getOrnament(couple.ornament)} className="mb-5 size-9 sm:size-10" />
          <p className={eyebrow}>{t("eyebrow")}</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.95] tracking-[-0.01em]">
            <HeroNames one={one} two={two} ampersand="mr-[0.22em] align-[0.1em] text-[0.6em]" />
          </h1>
          {tagline ? (
            <p className="hero-fade mt-6 text-xl" style={{ "--i": 0 } as CSSProperties}>
              {tagline}
            </p>
          ) : null}
          <p className="hero-fade mt-8 text-ink-soft" style={{ "--i": after } as CSSProperties}>
            {hosts}
          </p>
          <p className="hero-fade mt-2 max-w-[44ch]" style={{ "--i": after + 1 } as CSSProperties}>
            {invitation}
          </p>
          <p
            className="hero-fade mt-8 font-display text-[clamp(1.35rem,3vw,1.75rem)] leading-tight"
            style={{ "--i": after + 2 } as CSSProperties}
          >
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          <p className="hero-fade mt-1 text-ink-soft" style={{ "--i": after + 3 } as CSSProperties}>
            {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
            {city ? ` · ${city}` : ""}
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative flex-1 border border-rule bg-sheet p-2 sm:p-3">
            <div className="relative aspect-[4/3] overflow-hidden bg-thread-1">
              {/* Settles from a slight zoom inside the frame, by scale only so the photo paints at once. */}
              {couple.heroPhotoUrl ? (
                <div className="hero-photo absolute inset-0">
                  <WeddingImage
                    src={couple.heroPhotoUrl}
                    alt={`${one} & ${two}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: couple.heroPosition }}
                  />
                </div>
              ) : (
                // No cover photo yet: the couple's initials on a soft wash of the theme colour.
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_38%,color-mix(in_oklab,var(--w-thread-1)_72%,var(--w-sheet))_0%,var(--w-thread-1)_78%)] font-display text-[clamp(3rem,11vw,6.5rem)] leading-none text-on-thread-1"
                >
                  {initialOne}
                  <span className="mx-[0.3em] text-[0.45em] opacity-75">{locale === "am" ? "፡" : "&"}</span>
                  {initialTwo}
                </div>
              )}
            </div>
          </div>
          <div
            aria-hidden
            className={cn(
              "flex items-baseline justify-center gap-5 font-display leading-none text-ink/30 tabular-nums",
              "sm:flex-col sm:items-end sm:gap-2",
            )}
          >
            {/* The numerals stagger in beside the photo while the text column is still arriving. */}
            <span className="hero-fade text-[clamp(3.5rem,9vw,6.5rem)]" style={{ "--i": 2 } as CSSProperties}>
              {date.day}
            </span>
            <span
              className={cn(
                "hero-fade text-[clamp(1.6rem,4vw,2.5rem)] uppercase",
                locale === "am" && "text-[clamp(1.35rem,3vw,2rem)]",
              )}
              style={{ "--i": 3 } as CSSProperties}
            >
              {date.month}
            </span>
            <span className="hero-fade text-[clamp(2.25rem,6vw,4rem)]" style={{ "--i": 4 } as CSSProperties}>
              {date.year}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
