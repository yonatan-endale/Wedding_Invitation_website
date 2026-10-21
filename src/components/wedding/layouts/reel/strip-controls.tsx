"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { roundButton } from "../../lightbox";

type Props = { target: string; previous: string; next: string };

/**
 * Arrows for the film strip, for mouse users without a sideways scroll. The
 * strip itself is a native scroller (swipe, trackpad and Tab all move it);
 * these only scroll it by about one frame, and dim at either end.
 */
export function StripControls({ target, previous, next }: Props) {
  const [ends, setEnds] = useState({ start: true, end: false });

  useEffect(() => {
    const strip = document.getElementById(target);
    if (!strip) return;
    // Right to left, scrollLeft runs from 0 down to minus the overflow.
    const update = () => {
      const scrolled = Math.abs(strip.scrollLeft);
      setEnds({ start: scrolled <= 2, end: scrolled + strip.clientWidth >= strip.scrollWidth - 2 });
    };
    update();
    strip.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      strip.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  const move = (direction: 1 | -1) => {
    const strip = document.getElementById(target);
    const frame = strip?.querySelector("li");
    if (!strip || !frame) return;
    const still = document.documentElement.hasAttribute("data-motion-off") || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reading = getComputedStyle(strip).direction === "rtl" ? -1 : 1;
    strip.scrollBy({ left: reading * direction * frame.getBoundingClientRect().width, behavior: still ? "auto" : "smooth" });
  };

  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={() => move(-1)}
        disabled={ends.start}
        aria-controls={target}
        aria-label={previous}
        className={cn(roundButton, "border-ink/25 hover:border-ink")}
      >
        <ChevronLeft aria-hidden className="size-5 rtl:-scale-x-100" />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        disabled={ends.end}
        aria-controls={target}
        aria-label={next}
        className={cn(roundButton, "border-ink/25 hover:border-ink")}
      >
        <ChevronRight aria-hidden className="size-5 rtl:-scale-x-100" />
      </button>
    </div>
  );
}
