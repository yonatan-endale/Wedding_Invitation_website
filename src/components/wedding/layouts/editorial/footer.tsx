import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import type { SiteNames } from "../types";
import { eyebrow } from "./shared";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/** Initials in a large italic, the families' line, then the names and date. */
export async function EditorialFooter({ site, locale, names }: Props) {
  const t = await getTranslations("footer");
  const { couple } = site;
  return (
    <footer className="border-t border-rule bg-sheet px-5 pt-16 pb-28 text-center sm:px-8">
      <p aria-hidden className="font-display text-[clamp(4.5rem,14vw,9rem)] leading-none text-thread-2 italic">
        {names.firstOne.charAt(0)}
        {names.firstTwo.charAt(0)}
      </p>
      <p className={cn(eyebrow, "mt-6")}>{t("families")}</p>
      <p className="mt-6 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
        {names.one}
        <span className="mx-3 inline-block align-[0.12em] text-[0.55em]">&amp;</span>
        {names.two}
      </p>
      <p className="mt-3 text-ink-soft">{formatWeddingDate(couple.weddingAt, couple.timezone, locale)}</p>
    </footer>
  );
}
