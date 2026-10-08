import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const C = 80;
const STEM = 56;
const LEAF = 12;
const LEAF_BULGE = 7;

const round = (value: number) => Math.round(value * 100) / 100;
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const onStem = (angle: number): [number, number] => [C + STEM * Math.cos(rad(angle)), C + STEM * Math.sin(rad(angle))];

/** An almond leaf from (x, y) pointing along `angle` degrees (screen coordinates, y down). */
function leaf([x, y]: [number, number], angle: number): string {
  const dx = Math.cos(rad(angle));
  const dy = Math.sin(rad(angle));
  const mx = x + (dx * LEAF) / 2;
  const my = y + (dy * LEAF) / 2;
  const tip = `${round(x + dx * LEAF)} ${round(y + dy * LEAF)}`;
  const side = (sign: 1 | -1) => `${round(mx - dy * LEAF_BULGE * sign)} ${round(my + dx * LEAF_BULGE * sign)}`;
  return `M${round(x)} ${round(y)}Q${side(1)} ${tip}Q${side(-1)} ${round(x)} ${round(y)}Z`;
}

/*
 * The left laurel branch: a stem along a circle from the foot (104°) up the
 * left side (212°), with leaf pairs angled outward and inward along it and
 * one leaf at the tip. The right branch is the same drawing mirrored.
 */
const STEM_FROM = 104;
const STEM_TO = 212;
const [fromX, fromY] = onStem(STEM_FROM);
const [toX, toY] = onStem(STEM_TO);
const STEM_PATH = `M${round(fromX)} ${round(fromY)}A${STEM} ${STEM} 0 0 1 ${round(toX)} ${round(toY)}`;
const LEAVES_PATH = [116, 134, 152, 170, 188]
  .flatMap((angle) => [leaf(onStem(angle), angle + 45), leaf(onStem(angle), angle + 135)])
  .concat(leaf(onStem(STEM_TO), STEM_TO + 90))
  .join("");

/** Rings start at the top; the outer one draws clockwise, the inner one the other way. */
const OUTER_RING = "M80 4A76 76 0 1 1 80 156A76 76 0 1 1 80 4Z";
const INNER_RING = "M80 9A71 71 0 1 0 80 151A71 71 0 1 0 80 9Z";
const TIE = "M80 132.5 84 137 80 141.5 76 137Z";

const order = (index: number) => ({ "--i": index }) as CSSProperties;

type Props = {
  initials: [string, string];
  /** "&" in English, the Ethiopic wordspace "፡" in Amharic. */
  separator: "&" | "፡";
  className?: string;
  /** Prefix for the gradient id. Give each crest on a page its own (the default is "crest"). */
  id?: string;
  /** "dark" (default): bright foil initials for dark grounds. "light": deepened gold, still decorative only. */
  surface?: "dark" | "light";
  /** An accessible name when the crest stands alone; without it the crest is hidden from screen readers. */
  label?: string;
};

/**
 * A monogram crest: a double ring and a laurel in the theme's metal, with
 * the couple's initials in foil at its heart. The rings and stems trace
 * themselves in and the leaves and initials fade up when it scrolls into
 * view (data-reveal="draw" in globals.css); without motion it simply shows.
 * Pure SVG, so it costs no download. Size it with a width class. A server
 * component.
 */
export function Crest({ initials, separator, className, id = "crest", surface = "dark", label }: Props) {
  const [one, two] = initials;
  const gradient = `${id}-foil`;
  const stops =
    surface === "dark"
      ? ["color-mix(in oklab, var(--w-metal), white 45%)", "var(--w-metal)", "color-mix(in oklab, var(--w-metal), black 20%)"]
      : ["color-mix(in oklab, var(--w-metal), black 25%)", "color-mix(in oklab, var(--w-metal), black 40%)", "color-mix(in oklab, var(--w-metal), black 55%)"];

  return (
    <svg
      viewBox="0 0 160 160"
      data-reveal-group
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      className={cn("block overflow-visible text-metal", className)}
    >
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          {/* currentColor (the metal) stands in where color-mix is unsupported. */}
          <stop offset="0%" stopColor="currentColor" style={{ stopColor: stops[0] }} />
          <stop offset="55%" stopColor="currentColor" style={{ stopColor: stops[1] }} />
          <stop offset="100%" stopColor="currentColor" style={{ stopColor: stops[2] }} />
        </linearGradient>
      </defs>

      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path data-reveal="draw" pathLength={1} strokeWidth={1.3} d={OUTER_RING} style={order(0)} />
        <path data-reveal="draw" pathLength={1} strokeWidth={0.6} strokeOpacity={0.75} d={INNER_RING} style={order(2)} />
        <path data-reveal="draw" pathLength={1} strokeWidth={1} d={STEM_PATH} style={order(4)} />
        <path data-reveal="draw" pathLength={1} strokeWidth={1} d={STEM_PATH} style={order(4)} transform="matrix(-1 0 0 1 160 0)" />
      </g>

      <g data-reveal="fade" fill="currentColor" fillOpacity={0.85} style={order(7)}>
        <path d={LEAVES_PATH} />
        <path d={LEAVES_PATH} transform="matrix(-1 0 0 1 160 0)" />
        <path d={TIE} />
      </g>

      <g data-reveal="fade" fill={`url(#${gradient})`} textAnchor="middle" dominantBaseline="central" style={order(3)}>
        {separator === "&" ? (
          <>
            <text x="57" y="80" fontSize="36" className="font-display">
              {one}
            </text>
            <text x="80" y="83" fontSize="22" className="font-cormorant italic">
              &amp;
            </text>
            <text x="103" y="80" fontSize="36" className="font-display">
              {two}
            </text>
          </>
        ) : (
          <>
            <text x="56" y="80" fontSize="32" className="font-display">
              {one}
            </text>
            <text x="80" y="80" fontSize="20" className="font-display">
              {separator}
            </text>
            <text x="104" y="80" fontSize="32" className="font-display">
              {two}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
