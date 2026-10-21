"use client";

import * as m from "motion/react-m";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { EASE } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";
import { useIntro } from "../intro/intro-context";
import { Band, buttonPrimary } from "../primitives";
import { OpeningShell } from "./shell";
import type { OpeningProps } from "./types";

const PANEL_SECONDS = 1.15;

/** Two halves of a netela with the couple's border meet in the middle and part when the guest opens the invitation. */
export function NetelaOpening({ names, dateLine, border, guestName }: OpeningProps) {
  const t = useTranslations("intro");
  const { phase, open, finish } = useIntro();
  const opening = phase === "opening";
  const panelTransition = { duration: PANEL_SECONDS, ease: EASE.cloth };

  // If the slide never reports back (a backgrounded tab, an interrupted
  // animation), the opening still gets out of the way.
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(finish, PANEL_SECONDS * 1000 + 500);
    return () => window.clearTimeout(timer);
  }, [opening, finish]);

  const bandClass = border === "tibeb2" ? "w-10 sm:w-12" : undefined;

  return (
    <OpeningShell titleId="intro-names">
      <m.div
        aria-hidden
        className="absolute inset-y-0 left-0 flex w-1/2 justify-end bg-paper"
        initial={false}
        animate={{ x: opening ? "-100%" : "0%" }}
        transition={panelTransition}
        onAnimationComplete={() => opening && finish()}
      >
        <Band variant={border} orientation="vertical" className={cn("me-2 sm:me-4", bandClass)} />
      </m.div>
      <m.div
        aria-hidden
        className="absolute inset-y-0 right-0 flex w-1/2 justify-start bg-paper"
        initial={false}
        animate={{ x: opening ? "100%" : "0%" }}
        transition={panelTransition}
      >
        <Band variant={border} orientation="vertical" className={cn("ms-2 sm:ms-4", bandClass)} />
      </m.div>

      <m.div
        className="relative flex h-full items-center justify-center px-5"
        initial={false}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-sm bg-paper px-6 py-12 text-center sm:max-w-md sm:px-12 sm:py-16">
          {guestName ? <p className="mb-2 text-lg">{t("dear", { name: guestName })}</p> : null}
          <p className="text-ink-soft">{t("invited")}</p>
          <h2 id="intro-names" className="mt-7 font-display text-[clamp(3rem,13vw,4.75rem)] leading-[0.95]">
            <span className="block">{names.one}</span>
            <span className="my-3 block text-[0.45em]">&amp;</span>
            <span className="block">{names.two}</span>
          </h2>
          <p className="mt-7">{dateLine}</p>
          <button type="button" autoFocus onClick={open} disabled={opening} className={cn(buttonPrimary, "mt-10 px-8 text-lg")}>
            {t("open")}
          </button>
        </div>
      </m.div>
    </OpeningShell>
  );
}
