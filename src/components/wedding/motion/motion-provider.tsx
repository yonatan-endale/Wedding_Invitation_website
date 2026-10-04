"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE } from "@/lib/motion-tokens";
import features from "./motion-features";
import { useMotionPaused } from "./motion-toggle";

/**
 * One motion setup for the couple's site. Components use `m.*` from
 * "motion/react-m"; `strict` throws if a full `motion.*` component sneaks in
 * and pulls the whole library back. Guests who ask their device for reduced
 * motion, or who pause motion with MotionToggle, get fades instead of movement.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const paused = useMotionPaused();

  return (
    <LazyMotion features={features} strict>
      <MotionConfig
        reducedMotion={paused ? "always" : "user"}
        transition={{ duration: DURATION.base, ease: EASE.out }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
