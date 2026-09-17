import { Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { formatWeddingDate } from "@/lib/wedding-format";
import { TibebBand, buttonPrimary } from "./primitives";

type Props = { site: SiteData; locale: Locale };

export async function MemoriesSection({ site }: Props) {
  const url = site.couple.telegramUrl;
  if (!url) return null;
  const t = await getTranslations("memories");

  return (
    <section aria-labelledby="memories-heading" className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 border-y border-rule py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="memories-heading" className="font-display text-[clamp(1.75rem,4vw,2.5rem)]">
            {t("heading")}
          </h2>
          <p className="mt-2 max-w-[44ch] text-ink-soft">{t("body")}</p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
          <Send aria-hidden className="size-4" />
          {t("cta")}
        </a>
      </div>
    </section>
  );
}

export function SiteFooter({ site, locale }: Props) {
  const { couple } = site;
  return (
    <footer className="bg-ink text-paper">
      <TibebBand />
      <div className="px-5 pt-16 pb-28 text-center">
        <p className="font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-none">
          {pickText(couple.partnerOne, locale)}
          <span className="mx-3 inline-block align-[0.12em] text-[0.55em]">&amp;</span>
          {pickText(couple.partnerTwo, locale)}
        </p>
        <p className="mt-4 opacity-75">{formatWeddingDate(couple.weddingAt, couple.timezone, locale)}</p>
      </div>
    </footer>
  );
}
