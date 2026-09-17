"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { countdownParts } from "@/lib/datetime";

type Props = { target: string; serverNow: string; captionId: string };

/** Starts from the server's clock so the first client render matches the HTML, then ticks every second. */
export function Countdown({ target, serverNow, captionId }: Props) {
  const t = useTranslations("countdown");
  const [now, setNow] = useState(() => new Date(serverNow));

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = countdownParts(new Date(target), now);
  const units = [
    { key: "days", value: parts.days },
    { key: "hours", value: parts.hours },
    { key: "minutes", value: parts.minutes },
    { key: "seconds", value: parts.seconds },
  ] as const;

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p id={captionId} className="text-ink-soft">
        {parts.passed ? t("since") : t("until")}
      </p>
      <div role="timer" aria-live="off" className="mt-5 flex items-start justify-center">
        {units.map((unit, index) => (
          <div key={unit.key} className="flex items-start">
            {index > 0 ? (
              <span
                aria-hidden
                className="px-1 pt-[0.12em] font-display text-[clamp(1.6rem,6vw,3rem)] leading-none text-ink-soft/50 sm:px-2"
              >
                :
              </span>
            ) : null}
            <div className="min-w-[2.4em]">
              <div className="font-display text-[clamp(2.25rem,8.5vw,4.5rem)] leading-none tabular-nums">
                {unit.key === "days" ? unit.value : String(unit.value).padStart(2, "0")}
              </div>
              <div className="mt-3 text-sm text-ink-soft sm:text-base">{t(unit.key)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
