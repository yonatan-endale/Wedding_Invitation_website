import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { StitchRule, kabaEyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

/** The couple's verse in Cormorant between stitched rules. Renders nothing without one. */
export function KabaVerse({ site, locale }: Props) {
  const text = pickText(site.couple.scripture, locale);
  if (!text) return null;
  const reference = pickText(site.couple.scriptureRef, locale);

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <figure className="mx-auto max-w-3xl text-center">
        <StitchRule id="kaba-verse-rule" />
        <blockquote
          data-reveal="fade"
          style={{ "--i": 1 } as CSSProperties}
          className="mt-10 font-cormorant text-[clamp(1.6rem,4.2vw,2.5rem)] leading-[1.35] italic [&:lang(am)]:text-[clamp(1.3rem,3.4vw,1.9rem)] [&:lang(am)]:leading-[1.6] [&:lang(am)]:not-italic"
        >
          <p>{text}</p>
        </blockquote>
        {reference ? (
          <figcaption data-reveal="up" style={{ "--i": 2 } as CSSProperties} className={`${kabaEyebrow} mt-8`}>
            {reference}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
