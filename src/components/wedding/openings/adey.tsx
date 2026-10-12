"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useIntro } from "../intro/intro-context";
import { AdeyFlower } from "../ornaments/adey-flower";
import { OpeningShell } from "./shell";
import type { OpeningProps } from "./types";

const DONE_AT = 1900;
/** Little daisies that scatter from the bloom at the rich motion level; fixed angles keep server and client alike. */
const SCATTER = Array.from({ length: 16 }, (_, index) => ({
  angle: (index * 360) / 16 + (index % 3) * 7,
  distance: 34 + (index % 4) * 9,
  size: 0.9 + (index % 3) * 0.35,
}));

/**
 * A closed adey abeba bud. Tapping it unfolds the eight petals, and the
 * flower's centre opens into a widening circle that reveals the site, a new
 * beginning in the Meskel flower's own language.
 */
export function AdeyOpening({ names, dateLine, guestName, level }: OpeningProps) {
  const t = useTranslations("intro");
  const { phase, open, finish } = useIntro();
  const reduceMotion = useReducedMotion();
  const opening = phase === "opening";
  const flower = useRef<HTMLButtonElement>(null);
  const [center, setCenter] = useState({ x: "50%", y: "46%" });
  // The widening circle needs @property; without it the opening simply fades.
  const [iris, setIris] = useState(false);

  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(finish, reduceMotion ? 400 : DONE_AT);
    return () => window.clearTimeout(timer);
  }, [opening, finish, reduceMotion]);

  function bloom() {
    open();
    setIris(typeof CSS !== "undefined" && "registerProperty" in CSS);
    const rect = flower.current?.getBoundingClientRect();
    if (rect) setCenter({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` });
  }

  return (
    <OpeningShell titleId="intro-names">
      <div
        data-open={opening ? "" : undefined}
        data-iris={iris ? "" : undefined}
        style={{ "--iris-x": center.x, "--iris-y": center.y } as CSSProperties}
        className="adey-iris flex h-full flex-col items-center justify-center gap-6 bg-[radial-gradient(110%_80%_at_50%_45%,var(--w-sheet),color-mix(in_oklab,var(--w-paper),var(--w-thread-1)_10%))] px-5 text-center"
      >
        <div className={cn("transition-opacity duration-300", opening && "opacity-0")}>
          {guestName ? <p className="mb-2 text-lg text-ink-soft">{t("dear", { name: guestName })}</p> : null}
          <h2 id="intro-names" className="font-display text-[clamp(2rem,8vw,3.25rem)] leading-tight">
            {names.one} &amp; {names.two}
          </h2>
        </div>

        <button
          ref={flower}
          type="button"
          autoFocus
          onClick={bloom}
          disabled={opening}
          aria-label={t("tapFlower")}
          className="relative size-[min(58vw,15rem)] rounded-full"
        >
          <AdeyFlower open={opening} className={cn("size-full", !opening && "adey-sway")} />
          {opening && level === "rich"
            ? SCATTER.map((daisy, index) => (
                <m.span
                  key={index}
                  aria-hidden
                  className="absolute top-1/2 left-1/2 -mt-2 -ml-2 size-4"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                  animate={{
                    x: `${Math.cos((daisy.angle * Math.PI) / 180) * daisy.distance}vmin`,
                    y: `${Math.sin((daisy.angle * Math.PI) / 180) * daisy.distance}vmin`,
                    opacity: [0, 1, 0],
                    scale: daisy.size,
                    rotate: daisy.angle,
                  }}
                  transition={{ duration: 1.3, delay: 0.35 + (index % 5) * 0.04, ease: [0.2, 0.7, 0.3, 1] }}
                >
                  <AdeyFlower open className="size-full" />
                </m.span>
              ))
            : null}
        </button>

        <div className={cn("transition-opacity duration-300", opening && "opacity-0")}>
          <p className="font-sans text-sm font-semibold tracking-[0.18em] text-ink-soft uppercase [&:lang(am)]:tracking-normal">
            {t("tapFlower")}
          </p>
          <p className="mt-6 text-ink-soft">{dateLine}</p>
        </div>
      </div>
    </OpeningShell>
  );
}
