import { Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { fullName } from "@/lib/names";
import { formatWeddingDate } from "@/lib/wedding-format";
import { Band, buttonPrimary } from "./primitives";

type Props = { site: SiteData; locale: Locale };

export async function MemoriesSection({ site }: Props) {
  const url = site.couple.telegramUrl;
  if (!url) return null;
  const t = await getTranslations("memories");

  return (
    <section aria-labelledby="memories-heading" className="px-5 py-16 sm:px-8 sm:py-20">
      <div
        data-reveal-group
        className="mx-auto flex max-w-4xl flex-col items-start gap-6 border-y border-rule py-10 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 id="memories-heading" data-reveal="up" className="font-display text-[clamp(1.75rem,4vw,2.5rem)]">
            {t("heading")}
          </h2>
          <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="mt-2 max-w-[44ch] text-ink-soft">
            {t("body")}
          </p>
        </div>
        {/* The reveal sits on a wrapper so its transition does not replace the button's own. */}
        <div data-reveal="up" style={{ "--i": 2 } as CSSProperties}>
          <a href={url} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
            <Send aria-hidden className="size-4" />
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({ site, locale }: Props) {
  const { couple } = site;
  return (
    <footer className="bg-ink text-paper">
      <Band variant={couple.border} reveal />
      <div data-reveal-group className="px-5 pt-16 pb-28 text-center">
        <p data-reveal="up" className="font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-none">
          {fullName(couple.partnerOne, couple.partnerOneFather, locale)}
          <span className="mx-3 inline-block align-[0.12em] text-[0.55em]">&amp;</span>
          {fullName(couple.partnerTwo, couple.partnerTwoFather, locale)}
        </p>
        <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="mt-4 text-paper/75">
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
      </div>
    </footer>
  );
}
