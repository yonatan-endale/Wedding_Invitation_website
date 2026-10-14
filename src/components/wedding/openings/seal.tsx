"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIntro } from "../intro/intro-context";
import { WaxSeal } from "../ornaments/wax-seal";
import { OpeningShell } from "./shell";
import type { OpeningProps } from "./types";
import { joinNames } from "@/lib/names";

const DOOR_SECONDS = 1.4;
const DOOR_DELAY = 0.2;
const DOOR_EASE = [0.6, 0, 0.2, 1] as const;

/** Text over the gold seam sits on a paper chip, so the line pauses behind it. */
const chip = "relative bg-paper px-3 py-1";

/**
 * Two ivory doors meet at a thin gold seam with the couple's seal on it. The
 * seal is the open button: it presses in, splits along the seam, and each half
 * rides its door as the doors swing open onto the site.
 */
export function SealOpening({ names, initials, separator, dateLine, guestName }: OpeningProps) {
  const t = useTranslations("intro");
  const { phase, open, finish } = useIntro();
  const opening = phase === "opening";
  // Reduced motion: the doors fade instead of swinging (only the animation changes, never the markup).
  const reduceMotion = useReducedMotion();
  const doorTransition = reduceMotion ? { duration: 0.4 } : { duration: DOOR_SECONDS, ease: DOOR_EASE, delay: DOOR_DELAY };
  const swing = (angle: number) => (opening ? (reduceMotion ? { opacity: 0 } : { rotateY: angle }) : { rotateY: 0, opacity: 1 });

  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(finish, (DOOR_DELAY + DOOR_SECONDS) * 1000 + 500);
    return () => window.clearTimeout(timer);
  }, [opening, finish]);

  const fadeAway = { opacity: opening ? 0 : 1 };
  const sealSize = "size-32 sm:size-36";

  return (
    <OpeningShell titleId="intro-names">
      <div aria-hidden className="absolute inset-0 overflow-hidden [perspective:1800px]">
        <m.div
          className="absolute inset-y-0 left-0 w-1/2 bg-paper"
          style={{ transformOrigin: "left center" }}
          initial={false}
          animate={swing(-140)}
          transition={doorTransition}
          onAnimationComplete={() => opening && finish()}
        >
          <m.span className="absolute inset-0 bg-black" initial={false} animate={{ opacity: opening ? 0.3 : 0 }} transition={doorTransition} />
          <span className={cn("absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2", sealSize, !opening && "invisible")}>
            <WaxSeal initials={initials} separator={separator} half="left" className="size-full" />
          </span>
        </m.div>
        <m.div
          className="absolute inset-y-0 right-0 w-1/2 bg-paper"
          style={{ transformOrigin: "right center" }}
          initial={false}
          animate={swing(140)}
          transition={doorTransition}
        >
          <m.span className="absolute inset-0 bg-black" initial={false} animate={{ opacity: opening ? 0.3 : 0 }} transition={doorTransition} />
          <span className={cn("absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2", sealSize, !opening && "invisible")}>
            <WaxSeal initials={initials} separator={separator} half="right" className="size-full" />
          </span>
        </m.div>
        <m.span
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,var(--w-metal)_12%,var(--w-metal)_88%,transparent)]"
          initial={false}
          animate={{ scaleY: opening ? 0 : 1, opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <m.div className="relative flex h-full items-center justify-center px-5 text-center" initial={false} animate={fadeAway} transition={{ duration: 0.2 }}>
        {/* The seal sits exactly on the seam's centre, where the halves wait in the doors; the text hangs around it. */}
        <div className="relative">
          {guestName ? (
            <p className={cn(chip, "absolute bottom-full left-1/2 mb-10 w-max max-w-[86vw] -translate-x-1/2 text-lg text-ink-soft")}>
              {t("dear", { name: guestName })}
            </p>
          ) : null}
          <m.button
            type="button"
            autoFocus
            onClick={open}
            disabled={opening}
            aria-label={`${t("pressToOpen")}, ${t("sealLabel", { one: names.one, two: names.two })}`}
            whileTap={{ scale: 0.96 }}
            className={cn("relative block rounded-full", sealSize)}
          >
            <span
              aria-hidden
              className="seal-glow absolute -inset-[35%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--w-metal)_50%,transparent),transparent)]"
            />
            <WaxSeal initials={initials} separator={separator} className="seal-face relative size-full drop-shadow-[0_6px_14px_rgb(0_0_0/0.18)]" />
          </m.button>
          <p
            className={cn(
              chip,
              "pointer-events-none absolute top-full left-1/2 mt-6 w-max -translate-x-1/2 font-sans text-sm font-semibold tracking-[0.18em] text-ink-soft uppercase [&:lang(am)]:tracking-normal",
            )}
          >
            {t("pressToOpen")}
          </p>
        </div>

        {/* Near the bottom; on short screens it follows the seal instead of covering it. */}
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-1 sm:bottom-14 [@media(max-height:640px)]:top-[calc(50%+6.5rem)] [@media(max-height:640px)]:bottom-auto">
          <h2 id="intro-names" className={cn(chip, "font-display text-[clamp(1.75rem,6vw,2.5rem)] leading-tight")}>
            {joinNames([names.one, names.two])}
          </h2>
          <p className={cn(chip, "text-ink-soft [@media(max-height:480px)]:hidden")}>{dateLine}</p>
        </div>
      </m.div>
    </OpeningShell>
  );
}
