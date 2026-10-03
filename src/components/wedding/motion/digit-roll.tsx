"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Each cell of the strip is one digit tall: a spare cell, 0 to 9, another
 * spare. When a countdown digit wraps from 0 to 9 (or a count-up from 9 to 0)
 * the strip rolls one step to a spare showing the new digit, then jumps to the
 * real cell without a transition, so it never spins back across the strip.
 */
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const LEAD = 0;
const TRAIL = 11;

type Strip = { index: number; spare: number; animate: boolean };

function Digit({ value }: { value: number }) {
  const [strip, setStrip] = useState<Strip>({ index: value + 1, spare: value, animate: false });
  const previous = useRef(value);

  useEffect(() => {
    const from = previous.current;
    previous.current = value;
    if (from === value) return;
    if (Math.abs(value - from) === 1) setStrip({ index: value + 1, spare: value, animate: true });
    else if (from === 0) setStrip({ index: LEAD, spare: value, animate: true });
    else if (value === 0) setStrip({ index: TRAIL, spare: value, animate: true });
    else setStrip({ index: value + 1, spare: value, animate: false });
  }, [value]);

  // Land on the real cell after a wrap, even if the transition never reports
  // its end (the subtle motion level and reduced motion have none).
  useEffect(() => {
    if (strip.index !== LEAD && strip.index !== TRAIL) return;
    const timer = window.setTimeout(() => setStrip((s) => ({ index: s.spare + 1, spare: s.spare, animate: false })), 600);
    return () => window.clearTimeout(timer);
  }, [strip.index]);

  const settle = () => {
    if (strip.index === LEAD || strip.index === TRAIL) setStrip((s) => ({ index: s.spare + 1, spare: s.spare, animate: false }));
  };

  return (
    <span className="inline-block h-[1em] overflow-hidden align-top">
      <span
        className={`digit-strip flex flex-col ${strip.animate ? "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""}`}
        style={{ transform: `translateY(-${strip.index}em)` }}
        onTransitionEnd={settle}
      >
        <span className="h-[1em]">{strip.spare}</span>
        {DIGITS.map((digit) => (
          <span key={digit} className="h-[1em]">
            {digit}
          </span>
        ))}
        <span className="h-[1em]">{strip.spare}</span>
      </span>
    </span>
  );
}

/** A number whose digits roll like an odometer when it changes. Decorative: pair it with readable text. */
export function DigitRoll({ value, minDigits = 1 }: { value: number; minDigits?: number }) {
  const digits = String(value).padStart(minDigits, "0").split("").map(Number);
  return (
    <span aria-hidden className="inline-flex leading-none tabular-nums">
      {digits.map((digit, index) => (
        // Keyed from the right, so the ones digit keeps rolling when the number gets shorter.
        <Digit key={digits.length - index} value={digit} />
      ))}
    </span>
  );
}
