"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useIntro } from "../intro/intro-context";
import { FaithOrnament } from "../ornaments/faith-ornament";
import { WaxSeal } from "../ornaments/wax-seal";
import { OpeningShell } from "./shell";
import type { OpeningProps } from "./types";
import { joinNames } from "@/lib/names";

/** Steps of the opening, in order, with when each starts (ms after the tap). */
const STEPS = [
  { step: 1, at: 0 }, // the seal pops
  { step: 2, at: 260 }, // the flap folds back
  { step: 3, at: 560 }, // ...past upright, it drops behind the letter
  { step: 4, at: 820 }, // the letter rises out of the pocket
  { step: 5, at: 1550 }, // everything fades onto the site
] as const;
const DONE_AT = 2150;

const paper = (shade: number) => `color-mix(in oklab, var(--w-sheet), var(--w-ink) ${shade}%)`;

/**
 * A cream envelope sealed with the couple's wax seal, its liner in the
 * couple's threads. Tapping it pops the seal, folds the flap back and slides
 * the letter up, then the whole thing fades onto the site.
 */
export function EnvelopeOpening({ names, initials, separator, dateLine, ornament, guestName }: OpeningProps) {
  const t = useTranslations("intro");
  const { phase, open, finish } = useIntro();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const opening = phase === "opening";

  useEffect(() => {
    if (!opening) return;
    // With reduced motion the envelope doesn't unfold; it fades straight onto the site, as the adey does.
    const steps = reduceMotion ? [{ step: 5, at: 0 }] : STEPS;
    const timers = steps.map(({ step: next, at }) => window.setTimeout(() => setStep(next), at));
    timers.push(window.setTimeout(finish, reduceMotion ? 400 : DONE_AT));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [opening, finish, reduceMotion]);

  return (
    <OpeningShell titleId="intro-names">
      {/* The background fades with everything else, so the site shows through instead of a hard cut. */}
      <m.div
        className="flex h-full flex-col items-center justify-center gap-8 bg-[radial-gradient(120%_90%_at_50%_40%,var(--w-sheet),var(--w-paper))] px-5 text-center"
        initial={false}
        animate={{ opacity: step >= 5 ? 0 : 1 }}
        transition={{ duration: 0.55 }}
      >
        {/* Steps aside as the letter rises into its place. */}
        <m.div initial={false} animate={{ opacity: step >= 3 ? 0 : 1 }} transition={{ duration: 0.3 }}>
          {guestName ? <p className="mb-1 line-clamp-2 text-lg">{t("dear", { name: guestName })}</p> : null}
          <p className="text-ink-soft">{t("invited")}</p>
          <h2 id="intro-names" className="mt-2 font-display text-[clamp(2rem,8vw,3.25rem)] leading-tight">
            {joinNames([names.one, names.two])}
          </h2>
        </m.div>

        <m.button
          type="button"
          autoFocus
          onClick={open}
          disabled={opening}
          aria-label={t("openEnvelope")}
          whileTap={{ scale: 0.98 }}
          className="relative block aspect-[1.55] w-[min(86vw,30rem)] [perspective:1200px]"
          animate={{ y: step >= 5 ? "12vh" : "0vh" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 1, 1] }}
        >
          {/* Back of the envelope. */}
          <span aria-hidden className="absolute inset-0 rounded-[6px] shadow-[0_18px_40px_rgb(0_0_0/0.18)]" style={{ background: paper(7) }} />

          {/* The letter, tucked in the pocket until it rises. */}
          <m.span
            aria-hidden
            className="absolute inset-x-[6%] top-[5%] z-[2] flex h-[90%] flex-col items-center gap-2 overflow-hidden rounded-[4px] border border-rule bg-sheet px-4 pt-[7%] text-ink shadow-[0_2px_10px_rgb(0_0_0/0.12)]"
            initial={false}
            animate={{ y: step >= 4 ? "-58%" : "0%" }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* The couple's faith symbol heads the letter, as on a printed invitation. */}
            <FaithOrnament ornament={ornament} reveal={false} className="size-[clamp(1.25rem,5vw,1.75rem)]" />
            {guestName ? (
              <span className="line-clamp-1 text-[clamp(0.85rem,3vw,1rem)] text-ink-soft">{t("dear", { name: guestName })}</span>
            ) : null}
            <span className="font-display text-[clamp(1.25rem,5vw,1.9rem)] leading-tight">
              {joinNames([names.one, names.two])}
            </span>
            <span className="text-[clamp(0.75rem,2.6vw,0.95rem)] text-ink-soft">{t("letter")}</span>
            <span className="h-px w-12 bg-metal" />
            <span className="text-[clamp(0.8rem,2.8vw,1rem)]">{dateLine}</span>
          </m.span>

          {/* Pocket: three folds over the lower part of the letter. */}
          <span aria-hidden className="absolute inset-0 z-[3] rounded-[6px] [clip-path:polygon(0_0,52%_55%,0_100%)]" style={{ background: paper(4) }} />
          <span aria-hidden className="absolute inset-0 z-[3] rounded-[6px] [clip-path:polygon(100%_0,48%_55%,100%_100%)]" style={{ background: paper(5) }} />
          <span aria-hidden className="absolute inset-0 z-[3] rounded-[6px] [clip-path:polygon(0_100%,50%_46%,100%_100%)]" style={{ background: paper(2) }} />

          {/* Flap: closed it covers the top; folded back, its liner shows and it drops behind the letter. */}
          <m.span
            aria-hidden
            className={cn("absolute inset-x-0 top-0 h-[58%] [transform-style:preserve-3d]", step >= 3 ? "z-[1]" : "z-[4]")}
            style={{ transformOrigin: "top center" }}
            initial={false}
            animate={{ rotateX: step >= 2 ? 180 : 0 }}
            transition={{ duration: 0.6, ease: [0.45, 0, 0.25, 1] }}
          >
            <span
              className="absolute inset-0 [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)]"
              style={{ background: paper(3) }}
            />
            <span
              // Clipped upside down so that, after the flap's half turn, the liner sits on the hinge point up.
              className="absolute inset-0 [backface-visibility:hidden] [clip-path:polygon(0_100%,100%_100%,50%_0)] [transform:rotateX(180deg)]"
              // A fine gold lattice. Never green, yellow and red stripes, which read as the flag.
              style={{
                background:
                  "repeating-linear-gradient(45deg, color-mix(in oklab, var(--w-metal) 70%, transparent) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, color-mix(in oklab, var(--w-metal) 70%, transparent) 0 1px, transparent 1px 9px), color-mix(in oklab, var(--w-sheet), var(--w-metal) 12%)",
              }}
            />
          </m.span>

          {/* The seal on the flap's point. */}
          <m.span
            aria-hidden
            className="absolute top-[58%] left-1/2 z-[5] size-[clamp(3.5rem,14vw,4.75rem)] -translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={step >= 1 ? { scale: [1, 1.15, 0], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <WaxSeal initials={initials} separator={separator} tone="wax" className="size-full drop-shadow-[0_3px_6px_rgb(0_0_0/0.25)]" />
          </m.span>
        </m.button>

        <m.p
          className="font-sans text-sm font-semibold tracking-[0.18em] text-ink-soft uppercase [&:lang(am)]:tracking-normal"
          initial={false}
          animate={{ opacity: step >= 1 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {t("openEnvelope")}
        </m.p>
      </m.div>
    </OpeningShell>
  );
}
