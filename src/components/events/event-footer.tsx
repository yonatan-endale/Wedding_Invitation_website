import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { Band } from "@/components/wedding/primitives";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { siteTitleNames } from "@/lib/site-names";
import { formatWeddingDate } from "@/lib/wedding-format";

/** The closing band: everyone celebrated, the day, and the family's sign-off. */
export async function EventFooter({ site, locale }: { site: SiteData; locale: Locale }) {
  const t = await getTranslations("footer");
  const { couple } = site;
  return (
    <footer className="bg-ink text-paper">
      <Band variant={couple.border} reveal />
      <div data-reveal-group className="px-5 pt-16 pb-28 text-center">
        <p data-reveal="up" className="mx-auto max-w-3xl font-display text-[clamp(2rem,5vw,3rem)] leading-tight">
          {siteTitleNames(site, locale)}
        </p>
        <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="mt-4 text-paper/75">
          {formatWeddingDate(couple.eventAt, couple.timezone, locale)}
        </p>
        <p data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="mt-8 text-paper/75">
          {t("families")}
        </p>
      </div>
    </footer>
  );
}
