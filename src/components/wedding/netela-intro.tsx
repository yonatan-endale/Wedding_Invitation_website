"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMusic } from "./music";
import { TibebBand, buttonPrimary } from "./primitives";
import { LanguageToggle } from "./site-header";

type Props = { slug: string; partnerOne: string; partnerTwo: string; dateLine: string };

const EASE = [0.7, 0, 0.2, 1] as const;

/**
 * Opening screen: two halves of a netela with tibeb borders meet in the middle
 * and part when the guest opens the invitation. Shown once per browser session.
 */
export function NetelaIntro({ slug, partnerOne, partnerTwo, dateLine }: Props) {
  const t = useTranslations("intro");
  const { play } = useMusic();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"shown" | "opening" | "gone">("shown");
  const storageKey = `invitation-opened:${slug}`;

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(storageKey)) setPhase("gone");
    } catch {
      // Storage can be blocked; the intro simply shows again.
    }
  }, [storageKey]);

  useEffect(() => {
    if (phase === "gone") return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [phase]);

  function open() {
    play();
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Ignore blocked storage.
    }
    setPhase("opening");
  }

  if (phase === "gone") return null;

  const opening = phase === "opening";
  const panelTransition = { duration: reduceMotion ? 0 : 1.15, ease: EASE };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="intro-names" className="fixed inset-0 z-[60]">
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 flex w-1/2 justify-end bg-paper"
        initial={false}
        animate={{ x: opening ? "-100%" : "0%" }}
        transition={panelTransition}
        onAnimationComplete={() => opening && setPhase("gone")}
      >
        <TibebBand orientation="vertical" className="mr-2 sm:mr-4" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute inset-y-0 right-0 flex w-1/2 justify-start bg-paper"
        initial={false}
        animate={{ x: opening ? "100%" : "0%" }}
        transition={panelTransition}
      >
        <TibebBand orientation="vertical" className="ml-2 sm:ml-4" />
      </motion.div>

      <motion.div
        className="relative flex h-full items-center justify-center px-5"
        initial={false}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.3 }}
      >
        <div className="w-full max-w-sm bg-paper px-6 py-12 text-center sm:max-w-md sm:px-12 sm:py-16">
          <p className="text-ink-soft">{t("invited")}</p>
          <h1 id="intro-names" className="mt-7 font-display text-[clamp(3rem,13vw,4.75rem)] leading-[0.95]">
            <span className="block">{partnerOne}</span>
            <span className="my-3 block text-[0.45em]">&amp;</span>
            <span className="block">{partnerTwo}</span>
          </h1>
          <p className="mt-7">{dateLine}</p>
          <button type="button" autoFocus onClick={open} disabled={opening} className={cn(buttonPrimary, "mt-10 px-8 text-lg")}>
            {t("open")}
          </button>
        </div>
      </motion.div>

      <div className={cn("absolute top-4 right-4 transition-opacity", opening && "opacity-0")}>
        <LanguageToggle />
      </div>
    </div>
  );
}
