import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { fullName } from "@/lib/names";
import { cn } from "@/lib/utils";
import { ArchFrame } from "../../kit/arch-frame";
import { WeddingImage } from "../../primitives";
import type { SiteNames } from "../types";
import { ArchTitle, Diamond, GLOW, Sunburst, eyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/**
 * Twin arches, one per partner, with the full name and role beneath. A
 * missing portrait becomes a gilded window holding the partner's initial, so
 * the section still reads as a pair. With two portraits (or one) the arches
 * stack on phones; with none they stay side by side, since an initial needs
 * less room than a face.
 */
export async function ArchesCouple({ site, locale, names }: Props) {
  const t = await getTranslations("couple");
  const { couple } = site;
  const partners = [
    {
      key: "one",
      portrait: couple.partnerOnePortraitUrl,
      name: fullName(couple.partnerOne, couple.partnerOneFather, locale),
      alt: pickText(couple.partnerOne, locale),
      initial: names.initials[0],
      role: couple.partnerOneRole,
    },
    {
      key: "two",
      portrait: couple.partnerTwoPortraitUrl,
      name: fullName(couple.partnerTwo, couple.partnerTwoFather, locale),
      alt: pickText(couple.partnerTwo, locale),
      initial: names.initials[1],
      role: couple.partnerTwoRole,
    },
  ];
  const compact = partners.every((partner) => !partner.portrait);

  const figures = partners.map((partner, index) => (
    <figure
      key={partner.key}
      data-reveal-group
      className={cn("mx-auto w-full text-center", compact ? "max-w-[17rem]" : "max-w-[19rem]")}
    >
      <div data-reveal={index === 0 ? "left" : "right"}>
        <ArchFrame keyline ratio={0.74} reveal={Boolean(partner.portrait)} className="w-full" windowClassName="bg-sheet">
          {partner.portrait ? (
            <WeddingImage
              src={partner.portrait}
              alt={partner.alt}
              fill
              sizes="(min-width: 640px) 19rem, 80vw"
              className="object-cover"
            />
          ) : (
            // The initial at the heart of a small sunburst, as if lit from behind.
            <span aria-hidden className="relative block size-full" style={GLOW}>
              <Sunburst
                id={`arches-couple-${partner.key}-rays`}
                className="absolute top-[64%] left-1/2 w-[260%] -translate-x-1/2 -translate-y-1/2"
              />
              <span className="absolute top-[64%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-cormorant text-[clamp(3.25rem,14vw,6rem)] leading-none font-light text-ink">
                {partner.initial}
              </span>
              <span className="absolute top-[83%] left-1/2 flex w-[38%] -translate-x-1/2 items-center gap-1.5">
                <span className="h-px flex-1 bg-metal/60" />
                <Diamond className="size-[5px]" />
                <span className="h-px flex-1 bg-metal/60" />
              </span>
            </span>
          )}
        </ArchFrame>
      </div>
      <figcaption data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="mt-6 sm:mt-8">
        <p className={eyebrow}>{t(partner.role)}</p>
        <h3 className="mt-2 font-cormorant text-[clamp(1.35rem,4.5vw,2.1rem)] leading-tight font-medium break-words">
          {partner.name}
        </h3>
      </figcaption>
    </figure>
  ));

  return (
    <section id="couple" aria-labelledby="couple-heading" className="overflow-x-clip px-5 py-20 sm:px-8 sm:py-28">
      <ArchTitle id="couple-heading">{t("heading")}</ArchTitle>
      <div
        className={cn(
          "mx-auto mt-14 grid max-w-4xl items-start",
          compact
            ? "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-2 sm:gap-x-8"
            : "gap-y-6 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-8",
        )}
      >
        {figures[0]}
        <span
          aria-hidden
          data-reveal="fade"
          style={{ "--i": 1 } as CSSProperties}
          className={cn(
            "self-center text-center font-cormorant leading-none font-light text-ink-soft italic",
            compact ? "-mt-16 text-[clamp(2rem,7vw,4rem)] sm:-mt-24" : "text-[clamp(2.5rem,7vw,4rem)] sm:-mt-24",
          )}
        >
          &amp;
        </span>
        {figures[1]}
      </div>
    </section>
  );
}
