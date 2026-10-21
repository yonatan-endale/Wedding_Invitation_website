"use client";

import { MotionGlobalConfig } from "motion/react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMusic } from "../music";

const STORAGE_KEY = "wedding-motion";
const CHANGE_EVENT = "wedding-motion-change";

/**
 * Motion reads MotionConfig's reducedMotion only when an element mounts, so
 * pausing also sets the global flag that every new animation checks.
 */
function syncMotionLibrary(paused: boolean) {
  MotionGlobalConfig.instantAnimations = paused;
}

/**
 * True while the guest has paused motion (html[data-motion-off], set by the
 * boot script on a return visit or by MotionToggle). The server and the first
 * client render always say false; the real value is read after hydration.
 */
export function useMotionPaused() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const read = () => {
      const value = document.documentElement.hasAttribute("data-motion-off");
      syncMotionLibrary(value);
      setPaused(value);
    };
    read();
    window.addEventListener(CHANGE_EVENT, read);
    return () => window.removeEventListener(CHANGE_EVENT, read);
  }, []);

  return paused;
}

function setMotionPaused(paused: boolean) {
  const root = document.documentElement;
  // The hero's entrance has played by now; resuming must not start it over.
  root.dataset.heroPlayed = "";
  if (paused) root.dataset.motionOff = "";
  else delete root.dataset.motionOff;
  try {
    if (paused) window.localStorage.setItem(STORAGE_KEY, "off");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked; the pause then lasts until the page is closed.
  }
  syncMotionLibrary(paused);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/**
 * Lets a guest stop the page's movement (WCAG 2.2.2). The CSS reveals and loops
 * key off html[data-motion-off]; motion's own animations become instant. A
 * fixed label with aria-pressed carries the state, and a sparkle (crossed out
 * when paused) keeps it distinct from the music button's play and pause.
 * Below sm it sits above the music button; from sm, to its left.
 */
export function MotionToggle({ visible }: { visible: boolean }) {
  const t = useTranslations("motion");
  const { available: music } = useMusic();
  const paused = useMotionPaused();
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!document.documentElement.hasAttribute("data-motion-off"))}
      aria-pressed={paused}
      aria-label={t("pause")}
      title={t("pause")}
      className={cn(
        "fixed end-4 z-40 flex size-12 items-center justify-center rounded-full border border-rule bg-paper text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 active:scale-95 sm:end-6",
        music ? "bottom-21 sm:end-23 sm:bottom-7" : "bottom-4 sm:bottom-6",
      )}
    >
      <span aria-hidden className="relative">
        <Sparkles className="size-5" />
        {paused ? <span className="absolute top-1/2 left-1/2 h-px w-7 -translate-1/2 -rotate-45 bg-current" /> : null}
      </span>
    </button>
  );
}
