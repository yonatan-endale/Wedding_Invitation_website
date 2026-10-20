"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { SHOWCASE, SHOWCASE_KINDS, type ShowcaseKind } from "@/lib/showcase";
import { cn } from "@/lib/utils";
import { DesignCard } from "./design-card";

/** The filter chips and every design under them. */
export function DesignsGallery() {
  const t = useTranslations("showcase");
  const [kind, setKind] = useState<ShowcaseKind | "all">("all");
  const designs = kind === "all" ? SHOWCASE : SHOWCASE.filter((design) => design.kind === kind);

  return (
    <>
      <div role="group" aria-label={t("filterLabel")} className="mt-10 flex flex-wrap gap-2">
        {(["all", ...SHOWCASE_KINDS] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={kind === option}
            onClick={() => setKind(option)}
            className={cn(
              "min-h-11 rounded-full border px-5 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
              kind === option ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink",
            )}
          >
            {option === "all" ? t("all") : t(`kinds.${option}`)}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-soft">{t("comingSoon")}</p>
      <div className="mt-6">
        {designs.map((design, index) => (
          <DesignCard key={design.layout} design={design} first={index === 0} />
        ))}
      </div>
    </>
  );
}
