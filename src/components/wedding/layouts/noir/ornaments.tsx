import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { eyebrowClass } from "../../primitives";
import styles from "./noir.module.css";

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/** Small gold capitals for labels; Ge'ez keeps its own case and spacing (see eyebrowClass). */
export const noirEyebrow = cn(eyebrowClass, "text-metal");

/**
 * A gold hairline either side of a small diamond. With `reveal` the lines
 * grow from the middle and the diamond pops in; `hero` uses the hero's
 * keyframed fade instead, keyed to the opening screen.
 */
export function GoldRule({
  className,
  index = 0,
  reveal = true,
  hero = false,
}: {
  className?: string;
  index?: number;
  reveal?: boolean;
  hero?: boolean;
}) {
  const motion = reveal && !hero;
  return (
    <div
      aria-hidden
      className={cn("flex items-center justify-center gap-3", hero && "hero-fade", className)}
      style={hero ? order(index) : undefined}
    >
      <span
        data-reveal={motion ? "rule" : undefined}
        style={order(index)}
        className="h-px w-[clamp(2.5rem,12vw,5.5rem)] bg-gradient-to-l from-metal to-transparent"
      />
      <span data-reveal={motion ? "pop" : undefined} style={order(index + 1)} className="size-[7px] rotate-45 bg-metal" />
      <span
        data-reveal={motion ? "rule" : undefined}
        style={order(index)}
        className="h-px w-[clamp(2.5rem,12vw,5.5rem)] bg-gradient-to-r from-metal to-transparent"
      />
    </div>
  );
}

/** A centred section title in light Cormorant under an optional gold label, over a gold rule. */
export function NoirHeading({
  id,
  children,
  kicker,
  className,
}: {
  id: string;
  children: ReactNode;
  kicker?: string;
  className?: string;
}) {
  return (
    <div data-reveal-group className={cn("text-center", className)}>
      {kicker ? (
        <p data-reveal="fade" className={noirEyebrow}>
          {kicker}
        </p>
      ) : null}
      <h2
        id={id}
        data-reveal="up"
        style={order(1)}
        className={cn("font-cormorant text-[clamp(2.5rem,6.5vw,4.25rem)] leading-[1.05]", kicker && "mt-4")}
      >
        {children}
      </h2>
      <GoldRule className="mt-6" index={2} />
    </div>
  );
}

/** A four-pointed glint. */
const STAR = "M10 0C10.7 7.3 12.7 9.3 20 10 12.7 10.7 10.7 12.7 10 20 9.3 12.7 7.3 10.7 0 10 7.3 9.3 9.3 7.3 10 0Z";

type Glint = { top: string; left: string; size: number; delay: string };

const AROUND_CREST: Glint[] = [
  { top: "4%", left: "20%", size: 17, delay: "0s" },
  { top: "18%", left: "90%", size: 12, delay: "-2.1s" },
  { top: "62%", left: "-3%", size: 11, delay: "-3.7s" },
  { top: "92%", left: "76%", size: 14, delay: "-1.1s" },
  { top: "46%", left: "104%", size: 9, delay: "-4.9s" },
  { top: "-5%", left: "60%", size: 10, delay: "-5.6s" },
];

/**
 * Tiny gold glints that twinkle in turn around whatever box they sit in
 * (place them in a relative parent). Rendered for every guest but shown only
 * at the rich motion level; see noir.module.css. data-stage lets the reveal
 * observer mark them data-inview, so they pause off screen.
 */
export function Sparkles({ className, glints = AROUND_CREST }: { className?: string; glints?: Glint[] }) {
  return (
    <span aria-hidden data-stage className={cn(styles.sparkles, "pointer-events-none absolute inset-0", className)}>
      {glints.map((glint, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className={styles.glint}
          style={{ top: glint.top, left: glint.left, width: glint.size, height: glint.size, animationDelay: glint.delay }}
        >
          <path d={STAR} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
