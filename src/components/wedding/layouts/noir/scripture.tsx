import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { GoldRule, noirEyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

/** The couple's verse, set quietly in Cormorant italic between gold rules. Renders nothing without one. */
export function NoirScripture({ site, locale }: Props) {
  const text = pickText(site.couple.scripture, locale);
  if (!text) return null;
  const reference = pickText(site.couple.scriptureRef, locale);

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <figure data-reveal-group className="mx-auto max-w-3xl text-center">
        <GoldRule index={0} />
        <blockquote
          data-reveal="fade"
          style={{ "--i": 2 } as CSSProperties}
          className="mt-10 font-cormorant text-[clamp(1.6rem,4.2vw,2.5rem)] leading-[1.35] font-light italic [&:lang(am)]:text-[clamp(1.3rem,3.4vw,1.9rem)] [&:lang(am)]:leading-[1.6] [&:lang(am)]:not-italic"
        >
          <p>{text}</p>
        </blockquote>
        {reference ? (
          <figcaption data-reveal="up" style={{ "--i": 4 } as CSSProperties} className={`${noirEyebrow} mt-8`}>
            {reference}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
