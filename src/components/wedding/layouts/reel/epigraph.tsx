import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { creditCaps } from "./shared";

type Props = { site: SiteData; locale: Locale };

/** The couple's verse or quote, set as a film's epigraph under the credits. Hidden when there is none. */
export function ReelEpigraph({ site, locale }: Props) {
  const text = pickText(site.couple.scripture, locale);
  if (!text) return null;
  const reference = pickText(site.couple.scriptureRef, locale);

  return (
    <section className="px-5 pb-24 sm:px-8 sm:pb-32">
      <figure data-reveal-group className="mx-auto max-w-2xl text-center">
        <blockquote
          data-reveal="fade"
          className={cn("text-[clamp(1.3rem,3vw,1.8rem)] leading-[1.5] text-ink-soft", locale === "am" ? "font-display" : "italic")}
        >
          <p>{text}</p>
        </blockquote>
        {reference ? (
          <figcaption data-reveal="fade" style={{ "--i": 3 } as CSSProperties} className={cn(creditCaps, "mt-6 text-metal")}>
            {reference}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
