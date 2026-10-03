"use client";

import * as m from "motion/react-m";
import { useId } from "react";

/** One petal pointing up from the centre of a 100×100 box. */
const PETAL = "M50 50C45.6 38 45.4 21 50 9.5 54.6 21 54.4 38 50 50Z";
const PETALS = Array.from({ length: 8 }, (_, index) => index * 45);

/**
 * Adey abeba, the yellow Meskel daisy of the Ethiopian New Year: eight petals
 * around a dark centre. Closed it is a bud; `open` unfolds the petals one by
 * one on a spring. Decorative.
 */
export function AdeyFlower({ open, className }: { open: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id={`${id}-petal`} x1="50" y1="10" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffd94a" />
          <stop offset="100%" style={{ stopColor: "color-mix(in oklab, #f2b705, var(--w-metal) 35%)" }} />
        </linearGradient>
        <radialGradient id={`${id}-heart`} cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#c9741f" />
          <stop offset="100%" stopColor="#6e3410" />
        </radialGradient>
      </defs>
      <m.g initial={false} animate={open ? "open" : "closed"} variants={{ open: { transition: { staggerChildren: 0.06 } }, closed: {} }}>
        {PETALS.map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            <m.path
              d={PETAL}
              fill={`url(#${id}-petal)`}
              style={{ transformBox: "view-box", transformOrigin: "50px 50px" }}
              variants={{
                closed: { scaleX: 0.42, scaleY: 0.62 },
                open: { scaleX: 1, scaleY: 1, transition: { type: "spring", stiffness: 170, damping: 14 } },
              }}
            />
          </g>
        ))}
      </m.g>
      <m.circle
        cx="50"
        cy="50"
        r="9.5"
        fill={`url(#${id}-heart)`}
        style={{ transformBox: "view-box", transformOrigin: "50px 50px" }}
        initial={false}
        animate={{ scale: open ? 1 : 0.7 }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}
