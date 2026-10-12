"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIntro } from "../intro/intro-context";
import { LanguageToggle } from "../site-header";

/**
 * The frame every opening shares: a full-screen dialog over the site, the
 * language switch in the corner, and nothing at all once it is done.
 * [data-opening] lets the boot script's CSS hide it before the first paint
 * for guests who already opened the invitation.
 */
export function OpeningShell({ titleId, className, children }: { titleId: string; className?: string; children: ReactNode }) {
  const { phase } = useIntro();
  if (phase === "done") return null;
  return (
    <div data-opening role="dialog" aria-modal="true" aria-labelledby={titleId} className={cn("fixed inset-0 z-[60]", className)}>
      {children}
      <div className={cn("absolute top-4 right-4 transition-opacity", phase === "opening" && "opacity-0")}>
        <LanguageToggle />
      </div>
    </div>
  );
}
