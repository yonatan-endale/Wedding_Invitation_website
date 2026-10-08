"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { countdownParts } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { DigitRoll } from "./motion/digit-roll";

/**
 * How the digits are dressed. plain: display numerals with colons (Classic,
 * Editorial). timecode: monospaced, like a film timecode (Reel). outline:
 * hollow numerals stroked in the theme's metal (Noir & Gold). niches: each
 * unit in its own arched niche, no colons (Gilded Arches). stitch: each unit
 * on a small embroidered patch, a running stitch inside a fine gold edge, no
 * colons (Kaba Velvet).
 */
export type CountdownVariant = "plain" | "timecode" | "outline" | "niches" | "stitch";

const VARIANTS: Record<CountdownVariant, { unit: string; digits: string; separator: string | null; label: string }> = {
  plain: {
    unit: "min-w-[2.4em]",
    digits: "font-display text-[clamp(2.25rem,8.5vw,4.5rem)] leading-none",
    separator: "font-display",
    label: "",
  },
  timecode: {
    unit: "min-w-[2.2em]",
    digits: "font-mono text-[clamp(2rem,8vw,4rem)] leading-none tracking-tight",
    separator: "font-mono text-thread-2 opacity-100",
    label: "uppercase tracking-[0.25em] text-xs sm:text-xs [&:lang(am)]:normal-case [&:lang(am)]:tracking-normal",
  },
  outline: {
    unit: "min-w-[2.4em]",
    digits:
      "font-display text-[clamp(2.5rem,9.5vw,5rem)] leading-none text-transparent [-webkit-text-stroke:1.25px_var(--w-metal)] forced-colors:text-[CanvasText]",
    separator: "font-display text-metal opacity-100",
    label: "",
  },
  niches: {
    unit: "mx-1 min-w-[3.4em] rounded-t-full border border-metal/60 px-2 pt-7 pb-3 sm:mx-2 sm:min-w-[4.2em]",
    digits: "font-display text-[clamp(1.9rem,7vw,3.5rem)] leading-none",
    separator: null,
    label: "",
  },
  stitch: {
    unit: "mx-1 min-w-[3.3em] rounded-[3px] border border-dashed border-metal/75 px-1.5 pt-5 pb-3 outline outline-1 outline-offset-[3px] outline-metal/45 sm:mx-2 sm:min-w-[4.4em] sm:px-2",
    digits: "font-display text-[clamp(1.9rem,7vw,3.5rem)] leading-none",
    separator: null,
    label: "",
  },
};

type Props = {
  target: string;
  serverNow: string;
  captionId: string;
  tone?: "ink" | "light";
  variant?: CountdownVariant;
};

/**
 * Starts from the server's clock so the first client render matches the HTML,
 * then ticks every second, but only while it is on screen and the tab is
 * visible. Screen readers get one plain sentence instead of rolling digits.
 */
export function Countdown({ target, serverNow, captionId, tone = "ink", variant = "plain" }: Props) {
  const t = useTranslations("countdown");
  const ref = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date(serverNow));

  useEffect(() => {
    let timer: number | undefined;
    let onScreen = true;
    const sync = () => {
      const run = onScreen && document.visibilityState === "visible";
      if (run && timer === undefined) {
        setNow(new Date());
        timer = window.setInterval(() => setNow(new Date()), 1000);
      } else if (!run && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
          });
    if (ref.current && observer) observer.observe(ref.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, []);

  const parts = countdownParts(new Date(target), now);
  const units = [
    { key: "days", value: parts.days, digits: 1 },
    { key: "hours", value: parts.hours, digits: 2 },
    { key: "minutes", value: parts.minutes, digits: 2 },
    { key: "seconds", value: parts.seconds, digits: 2 },
  ] as const;
  const soft = tone === "light" ? "text-white/70" : "text-ink-soft";
  const look = VARIANTS[variant];

  return (
    <div ref={ref} className={cn("mx-auto max-w-3xl text-center", tone === "light" && "text-white")}>
      <p id={captionId} className={soft}>
        {parts.passed ? t("since") : t("until")}
      </p>
      <div role="timer" aria-live="off" className="mt-5">
        <p className="sr-only">
          {t(parts.passed ? "summarySince" : "summary", { days: parts.days, hours: parts.hours, minutes: parts.minutes })}
        </p>
        <div aria-hidden className="flex items-start justify-center">
          {units.map((unit, index) => (
            <div key={unit.key} className="flex items-start">
              {index > 0 && look.separator ? (
                <span
                  className={cn("px-1 pt-[0.12em] text-[clamp(1.6rem,6vw,3rem)] leading-none opacity-50 sm:px-2", soft, look.separator)}
                >
                  :
                </span>
              ) : null}
              <div className={look.unit}>
                <div className={look.digits}>
                  <DigitRoll value={unit.value} minDigits={unit.digits} />
                </div>
                <div className={cn("mt-3 text-sm sm:text-base", soft, look.label)}>{t(unit.key)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
