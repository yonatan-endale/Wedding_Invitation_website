"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { countdownParts } from "@/lib/datetime";

type Props = { target: string; serverNow: string; doneLabel: string };

/** Starts from the server's clock so the first client render matches the HTML, then ticks every second. */
export function Countdown({ target, serverNow, doneLabel }: Props) {
  const t = useTranslations("countdown");
  const [now, setNow] = useState(() => new Date(serverNow));

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = countdownParts(new Date(target), now);

  if (parts.done) {
    return <p className="text-center font-display text-[clamp(1.75rem,5vw,2.75rem)]">{doneLabel}</p>;
  }

  const units = [
    { key: "days", value: parts.days },
    { key: "hours", value: parts.hours },
    { key: "minutes", value: parts.minutes },
    { key: "seconds", value: parts.seconds },
  ] as const;

  return (
    <div role="timer" aria-live="off" className="mx-auto grid max-w-3xl grid-cols-4 gap-2 text-center sm:gap-6">
      {units.map((unit) => (
        <div key={unit.key}>
          <div className="font-display text-[clamp(2.5rem,10vw,5rem)] leading-none tabular-nums">
            {unit.key === "days" ? unit.value : String(unit.value).padStart(2, "0")}
          </div>
          <div className="mt-3 text-sm text-ink-soft sm:text-base">{t(unit.key)}</div>
        </div>
      ))}
    </div>
  );
}
