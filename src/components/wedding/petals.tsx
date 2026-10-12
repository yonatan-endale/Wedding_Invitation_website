"use client";

import { useEffect, useRef, useState } from "react";
import { petalLayout } from "@/lib/petals";
import { useIntroOpen } from "./intro/intro-context";

const PETALS = petalLayout(12);

/**
 * A slow fall of rose petals over the hero. Rendered nowhere else, paused
 * while the hero is off screen, and started once the opening screen is gone.
 * CSS hides them for reduced motion, paused motion, data saving and the
 * subtle motion level, so the markup is the same on server and client.
 */
export function FallingPetals() {
  const introOpen = useIntroOpen();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [introOpen]);

  if (!introOpen) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="petals pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ animationPlayState: visible ? "running" : "paused" }}
    >
      {PETALS.map((petal, index) => (
        <span
          key={index}
          className="petal absolute -top-8"
          style={{
            left: `${petal.left}%`,
            width: petal.size,
            height: petal.size,
            opacity: petal.opacity,
            animationDuration: `${petal.duration}s, ${petal.duration / 3}s`,
            animationDelay: `-${petal.delay}s, -${petal.delay}s`,
            animationPlayState: visible ? "running" : "paused",
            ["--petal-drift" as string]: `${petal.drift}px`,
          }}
        >
          <svg viewBox="0 0 24 24" className="size-full" fill="var(--w-petal)">
            <path d="M12 1c5 3 9 8 9 13a9 9 0 0 1-18 0c0-5 4-10 9-13z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
