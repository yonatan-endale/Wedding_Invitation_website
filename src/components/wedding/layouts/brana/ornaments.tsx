import type { CSSProperties, ReactNode } from "react";
import { toGeez } from "@/lib/geez";
import { cn } from "@/lib/utils";
import { Band } from "../../primitives";
import styles from "./brana.module.css";

/*
 * Brana Manuscript's ornaments, after the illuminated Ge'ez books of the
 * Lalibela scriptoria: the harag interlace headpiece (ርእስ) that opens every
 * section, its side bands, red rubric headings, Ge'ez numerals, and
 * miniatures framed in red and ink rules with interlace knots at the corners.
 * All decorative (aria-hidden) except the numerals, and all server components.
 */

export const order = (index: number) => ({ "--i": index }) as CSSProperties;

/* Theme colours as styles: inside a <use>d symbol they resolve where the knot is placed. */
const THREAD_1: CSSProperties = { stroke: "var(--w-thread-1)" };
const THREAD_3: CSSProperties = { stroke: "var(--w-thread-3)" };
const GAP: CSSProperties = { stroke: "var(--brana-parchment)" };

/**
 * The knot drawing, once per page; every miniature corner is a <use> of it.
 * Width and height 0 rather than display:none, which would drop the symbol.
 */
export function BranaSprite() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute overflow-hidden">
      <defs>
        {/*
         * A Solomon's knot: two loops at right angles, each passing over the
         * other once and under it once. The gap round an over-crossing is the
         * parchment, so the weave reads at any size.
         */}
        <symbol id="brana-knot" viewBox="0 0 24 24">
          <g fill="none" strokeWidth="2.3">
            <rect x="2.5" y="8" width="19" height="8" rx="4" style={THREAD_1} />
            <rect x="8" y="2.5" width="8" height="19" rx="4" style={THREAD_3} />
            {/* The horizontal loop over the vertical one at the top left and bottom right. */}
            <path d="M5.6 8H10.4M13.6 16H18.4" strokeWidth="4.6" style={GAP} />
            <path d="M5.4 8H10.6M13.4 16H18.6" style={THREAD_1} />
            {/* The vertical loop over the horizontal one at the top right and bottom left. */}
            <path d="M16 5.6V10.4M8 13.6V18.4" strokeWidth="4.6" style={GAP} />
            <path d="M16 5.4V10.6M8 13.4V18.6" style={THREAD_3} />
          </g>
          <rect x="10.4" y="10.4" width="3.2" height="3.2" transform="rotate(45 12 12)" style={{ fill: "var(--w-thread-2)" }} />
        </symbol>
      </defs>
    </svg>
  );
}

/**
 * A harag headpiece: the interlace in a box ruled in ink, with a small
 * lozenge "ear" at each end. `rows` stacks bands for the taller headpiece of
 * the opening page. `reveal` grows it from its centre as it scrolls in.
 */
export function Headpiece({
  className,
  rows = 1,
  reveal = true,
  style,
}: {
  className?: string;
  rows?: 1 | 2;
  reveal?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div aria-hidden data-reveal={reveal ? "rule" : undefined} className={cn(styles.headpiece, className)} style={style}>
      <Band variant="harag" />
      {rows === 2 ? <Band variant="harag" className={styles.secondRow} /> : null}
    </div>
  );
}

/**
 * A vertical harag band ruled in ink on both sides, for the margins of the
 * opening page. `bandClassName` moves the interlace inside its ruled box (the
 * box clips it), so an entrance can draw it down without squashing it.
 */
export function SideBand({ className, bandClassName }: { className?: string; bandClassName?: string }) {
  return (
    <div aria-hidden className={cn(styles.sideBand, className)}>
      <div className="h-full overflow-hidden">
        <Band variant="harag" orientation="vertical" className={bandClassName} />
      </div>
    </div>
  );
}

/** The Ethiopic paragraph mark ፨ in red, as scribes set between passages. */
export function SectionMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span aria-hidden lang="am" className={cn(styles.mark, className)} style={style}>
      ፨
    </span>
  );
}

/** A section title in red rubric, over a ፨ between two hairlines. */
export function BranaHeading({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <div data-reveal-group className={cn("text-center", className)}>
      <h2 id={id} data-reveal="up" className={styles.heading}>
        {children}
      </h2>
      <span aria-hidden data-reveal="rule" style={order(1)} className={styles.underline}>
        <span />
        <SectionMark />
        <span />
      </span>
    </div>
  );
}

/**
 * A number in Ge'ez numerals (፩, ፲፬, ፳፻፲፱). Screen readers, and readers'
 * speech engines that cannot voice Ge'ez numerals, get the plain number: the
 * glyphs are labelled as one image named with it.
 */
export function GeezNumeral({ value, className }: { value: number; className?: string }) {
  return (
    <span lang="am" role="img" aria-label={String(value)} className={cn(styles.geezNumeral, className)}>
      {toGeez(value)}
    </span>
  );
}

const KNOTS = ["-top-[11px] -left-[11px]", "-top-[11px] -right-[11px]", "-bottom-[11px] -left-[11px]", "-right-[11px] -bottom-[11px]"];

/**
 * A miniature's frame: a red rule outside, a narrow margin of lighter vellum,
 * an ink rule round the picture, and an interlace knot on each corner (from
 * BranaSprite). Children fill the window, which keeps the given aspect ratio.
 */
export function MiniatureFrame({
  children,
  className,
  windowClassName,
  knots = true,
}: {
  children?: ReactNode;
  className?: string;
  windowClassName?: string;
  knots?: boolean;
}) {
  return (
    <div className={cn(styles.miniature, className)}>
      <div className={cn(styles.window, windowClassName)}>{children}</div>
      {knots
        ? KNOTS.map((place) => (
            <svg key={place} aria-hidden viewBox="0 0 24 24" className={cn("pointer-events-none absolute size-[22px]", place)}>
              <use href="#brana-knot" />
            </svg>
          ))
        : null}
    </div>
  );
}
