"use client";

import { useReducedMotion, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import type { MotionLevel } from "@/lib/appearance";
import { cn } from "@/lib/utils";

/**
 * From the first event's marker down to the centre of the closing diamond,
 * which ScheduleTimeline pins to the last line of the list, so the rail ends
 * under it however the closing label wraps.
 */
const LINE = "pointer-events-none absolute top-[0.7rem] bottom-[0.65rem] start-0 w-px";

// The guest can pause motion at any time; the boot script and the toggle mirror it to html[data-motion-off].
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion-off"] });
  return () => observer.disconnect();
}
const motionPaused = () => document.documentElement.hasAttribute("data-motion-off");
// The server cannot know, so it renders the full line, which is right for every guest.
const pausedOnServer = () => true;

function Progress({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ["start 70%", "end 60%"] });
  return <m.span aria-hidden className={cn(LINE, "origin-top bg-metal")} style={{ scaleY: scrollYProgress }} />;
}

/**
 * The timeline's one rail: a faint track with a gold line over it that draws
 * down as the guest scrolls through the day. The server render and hydration
 * show the gold line full, and so do the subtle level, reduced motion and
 * paused motion; it only starts following the scroll once hydrated.
 */
export function TimelineRail({ level, className, children }: { level: MotionLevel; className?: string; children: ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const paused = useSyncExternalStore(subscribe, motionPaused, pausedOnServer);
  const drawn = level !== "subtle" && !reduced && !paused;

  return (
    <div ref={target} className={cn("relative", className)}>
      <span aria-hidden className={cn(LINE, "bg-rule")} />
      {drawn ? <Progress target={target} /> : <span aria-hidden className={cn(LINE, "bg-metal")} />}
      {children}
    </div>
  );
}
