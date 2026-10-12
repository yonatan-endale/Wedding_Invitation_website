"use client";

import { useState, type ReactNode } from "react";
import type { CalendarSystem } from "@/lib/month-grid";
import { cn } from "@/lib/utils";

const SYSTEMS: CalendarSystem[] = ["ethiopian", "gregorian"];

type Props = {
  initial: CalendarSystem;
  /** Server-rendered grids; only the ones the couple offers are present. */
  views: Partial<Record<CalendarSystem, ReactNode>>;
  labels: { group: string } & Record<CalendarSystem, string>;
  tone: "light" | "ink";
};

/**
 * Switches between the Ethiopian and Gregorian grids when the couple offers
 * both. Both grids are rendered on the server; the hidden one is out of the
 * accessibility tree, and the first one shown is decided on the server too.
 */
export function CalendarViews({ initial, views, labels, tone }: Props) {
  const [view, setView] = useState<CalendarSystem>(initial);
  const offered = SYSTEMS.filter((system) => views[system]);
  // After a refresh the couple may offer different grids; never leave every pane hidden.
  const active = offered.includes(view) ? view : offered.includes(initial) ? initial : offered[0];

  return (
    <>
      {offered.length > 1 ? (
        <div
          role="group"
          aria-label={labels.group}
          className={cn(
            "std-switch mx-auto mb-7 inline-flex rounded-full border p-0.5 font-sans text-sm",
            tone === "light" ? "border-white/35 bg-black/20 text-white" : "border-rule bg-paper text-ink",
          )}
        >
          {offered.map((system) => (
            <button
              key={system}
              type="button"
              aria-pressed={active === system}
              onClick={() => setView(system)}
              className={cn(
                "min-h-9 rounded-full px-4 transition-colors",
                active === system && (tone === "light" ? "bg-white text-black" : "bg-ink text-paper"),
              )}
            >
              {labels[system]}
            </button>
          ))}
        </div>
      ) : null}
      {offered.map((system) => (
        <div key={system} hidden={active !== system}>
          {views[system]}
        </div>
      ))}
    </>
  );
}
