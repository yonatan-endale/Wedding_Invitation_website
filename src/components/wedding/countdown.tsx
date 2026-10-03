"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { countdownParts } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { DigitRoll } from "./motion/digit-roll";

type Props = { target: string; serverNow: string; captionId: string; tone?: "ink" | "light" };

/**
 * Starts from the server's clock so the first client render matches the HTML,
 * then ticks every second, but only while it is on screen and the tab is
 * visible. Screen readers get one plain sentence instead of rolling digits.
 */
export function Countdown({ target, serverNow, captionId, tone = "ink" }: Props) {
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
              {index > 0 ? (
                <span className={cn("px-1 pt-[0.12em] font-display text-[clamp(1.6rem,6vw,3rem)] leading-none opacity-50 sm:px-2", soft)}>
                  :
                </span>
              ) : null}
              <div className="min-w-[2.4em]">
                <div className="font-display text-[clamp(2.25rem,8.5vw,4.5rem)] leading-none">
                  <DigitRoll value={unit.value} minDigits={unit.digits} />
                </div>
                <div className={cn("mt-3 text-sm sm:text-base", soft)}>{t(unit.key)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
