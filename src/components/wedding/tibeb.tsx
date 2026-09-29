import { useId } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* The tibeb of a habesha kemis, drawn from photographs of the real     */
/* woven border. The cloth is a tight weave: colour fills the whole     */
/* column and the black ground shows only as the fine lines between     */
/* threads. Diamonds interlock like bricks, a row of two beside a row   */
/* of one whole and two halves: gold (one and two halves), red (two),   */
/* red (one and two halves), green (two). From the green diamonds a     */
/* stack of broad chevrons runs on, green, gold, red, green, gold, and  */
/* the last gold ones close around the next gold diamond. Columns run   */
/* between rails of gold checks and are parted by a line of gold        */
/* dashes. Everything is drawn in "design units": a column is 120 units */
/* across, and the band takes its size from CSS.                        */
/* ------------------------------------------------------------------ */

type Orientation = "horizontal" | "vertical";

export type TibebColors = { gold: string; red: string; green: string; ground: string };

/** Threads take the couple's theme; the ground stays black like the cloth. */
export const THEME_TIBEB: TibebColors = {
  gold: "var(--w-thread-2)",
  red: "var(--w-thread-3)",
  green: "var(--w-thread-1)",
  ground: "#141110",
};

const FIELD = 120;
const RAIL = 9;
const GAP = 6;
/** Long enough that no screen is wider than the band; the pattern fills it. */
const LENGTH = 100000;

/** Half a diamond along the band and across it. Two diamonds fill the column. */
const A = 40;
const B = FIELD / 4;

const CHEVRON_PITCH = 16;
const CHEVRON_COUNT = 20;
/** The black line left between two chevrons, and around every diamond. */
const SEAM = 2.2;

/** The chevrons start at the tips of the green diamonds and end at the tip of the next gold one. */
const CHEVRONS_X = A * 4;
const PERIOD = CHEVRONS_X + CHEVRON_COUNT * CHEVRON_PITCH;

export function tibebThickness(columns: number) {
  return RAIL * 2 + FIELD * columns + GAP * (columns - 1);
}

const points = (list: [number, number][]) => list.map(([x, y]) => `${x},${y}`).join(" ");

const diamondPoints = (cx: number, cy: number, s = 1) =>
  points([
    [cx, cy - B * s],
    [cx + A * s, cy],
    [cx, cy + B * s],
    [cx - A * s, cy],
  ]);

/** Where diamonds sit across the column: a row of two, or one whole with a half at each rail. */
const PAIR = [B, B * 3];
const SPLIT = [0, B * 2, B * 4];
const HALVES = [0, B * 4];

/**
 * A diamond with finer diamonds woven inside it. Rings in another thread are
 * as broad as the thread; rings in the ground are fine seams, three deep.
 */
function Diamond({ cx, cy, fill, ring, ground }: { cx: number; cy: number; fill: string; ring: string; ground: string }) {
  const seams = ring === ground;
  const rings = seams ? [0.75, 0.5, 0.25] : [0.66, 0.36];
  return (
    <g>
      <polygon points={diamondPoints(cx, cy)} fill={fill} stroke={ground} strokeWidth={SEAM} strokeLinejoin="miter" />
      {rings.map((s) => (
        <polygon key={s} points={diamondPoints(cx, cy, s)} fill="none" stroke={ring} strokeWidth={seams ? SEAM : 4.2} />
      ))}
      {seams ? null : <polygon points={diamondPoints(cx, cy, 0.1)} fill={ring} />}
    </g>
  );
}

function DiamondRow({
  x,
  y,
  centers,
  fill,
  ring,
  ground,
}: {
  x: number;
  y: number;
  centers: number[];
  fill: string;
  ring: string;
  ground: string;
}) {
  return (
    <>
      {centers.map((cy) => (
        <Diamond key={cy} cx={x} cy={y + cy} fill={fill} ring={ring} ground={ground} />
      ))}
    </>
  );
}

/**
 * Broad chevrons pointing back at the green diamonds, cut on the same slant as
 * the diamonds so the weave runs on without a break: one green, six gold,
 * three red, three green, seven gold.
 */
function Chevrons({ x, y, colors }: { x: number; y: number; colors: TibebColors }) {
  const sequence = [
    ...Array<string>(1).fill(colors.green),
    ...Array<string>(6).fill(colors.gold),
    ...Array<string>(3).fill(colors.red),
    ...Array<string>(3).fill(colors.green),
    ...Array<string>(7).fill(colors.gold),
  ];
  const half = FIELD / 2;
  /** Arms run a little past the rails; the column clips them square. */
  const reach = half + 12;
  const run = (A / B) * reach;
  /** The pitch is measured along the band; the thread is as wide as the gap across the slant allows. */
  const weight = (CHEVRON_PITCH * B) / Math.hypot(A, B) - SEAM;
  return (
    <>
      {sequence.map((color, i) => {
        const apex = x + CHEVRON_PITCH / 2 + i * CHEVRON_PITCH;
        return (
          <polyline
            key={i}
            points={points([
              [apex + run, y + half - reach],
              [apex, y + half],
              [apex + run, y + half + reach],
            ])}
            fill="none"
            stroke={color}
            strokeWidth={weight}
            strokeLinejoin="miter"
            strokeMiterlimit={8}
          />
        );
      })}
    </>
  );
}

function Column({ y, colors }: { y: number; colors: TibebColors }) {
  const { gold, red, green, ground } = colors;
  return (
    <>
      {/* The stack that began in the repeat before this one runs in under the first diamonds. */}
      <Chevrons x={CHEVRONS_X - PERIOD} y={y} colors={colors} />
      <Chevrons x={CHEVRONS_X} y={y} colors={colors} />
      <DiamondRow x={A * 5} y={y} centers={HALVES} fill={green} ring={ground} ground={ground} />
      <DiamondRow x={A} y={y} centers={SPLIT} fill={gold} ring={ground} ground={ground} />
      <DiamondRow x={A + PERIOD} y={y} centers={SPLIT} fill={gold} ring={ground} ground={ground} />
      <DiamondRow x={A * 2} y={y} centers={PAIR} fill={red} ring={gold} ground={ground} />
      <DiamondRow x={A * 3} y={y} centers={SPLIT} fill={red} ring={gold} ground={ground} />
      <DiamondRow x={A * 4} y={y} centers={PAIR} fill={green} ring={gold} ground={ground} />
    </>
  );
}

/** Two staggered rows of gold checks along the edge of the band. */
function Rail({ y, color }: { y: number; color: string }) {
  const squares: [number, number][] = [];
  for (let x = 0; x < PERIOD; x += 8) squares.push([x, y + 1], [x + 4, y + 4.5]);
  return (
    <>
      {squares.map(([sx, sy]) => (
        <rect key={`${sx}-${sy}`} x={sx} y={sy} width={4} height={3.5} fill={color} />
      ))}
    </>
  );
}

/** The line of gold dashes between two columns. */
function Dashes({ y, color }: { y: number; color: string }) {
  const dashes: number[] = [];
  for (let x = 0; x < PERIOD; x += 10) dashes.push(x);
  return (
    <>
      {dashes.map((x) => (
        <rect key={x} x={x + 2} y={y + 2} width={6} height={2} fill={color} />
      ))}
    </>
  );
}

export function TibebTile({
  columns,
  colors,
  idPrefix = "tibeb",
}: {
  columns: number;
  colors: TibebColors;
  idPrefix?: string;
}) {
  const thickness = tibebThickness(columns);
  return (
    <>
      <defs>
        {Array.from({ length: columns }, (_, i) => (
          <clipPath key={i} id={`${idPrefix}-column-${i}`}>
            <rect x={0} y={RAIL + i * (FIELD + GAP)} width={PERIOD} height={FIELD} />
          </clipPath>
        ))}
      </defs>
      <rect width={PERIOD} height={thickness} fill={colors.ground} />
      <Rail y={0} color={colors.gold} />
      <Rail y={thickness - RAIL} color={colors.gold} />
      {Array.from({ length: columns }, (_, i) => {
        const y = RAIL + i * (FIELD + GAP);
        return (
          <g key={i}>
            {i > 0 ? <Dashes y={y - GAP} color={colors.gold} /> : null}
            <g clipPath={`url(#${idPrefix}-column-${i})`}>
              <Column y={y} colors={colors} />
            </g>
          </g>
        );
      })}
    </>
  );
}

/**
 * The woven band. Size it with CSS: its thickness comes from the height
 * (horizontal) or width (vertical) of the element, and the pattern repeats
 * along the other axis. `columns` stacks more woven columns across the band,
 * as on the broad border of a netela.
 */
export function Tibeb({
  orientation = "horizontal",
  columns = 1,
  colors = THEME_TIBEB,
  className,
}: {
  orientation?: Orientation;
  columns?: number;
  colors?: TibebColors;
  className?: string;
}) {
  const id = `tibeb-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const thickness = tibebThickness(columns);
  const horizontal = orientation === "horizontal";
  return (
    <svg
      aria-hidden
      className={cn("block size-full", className)}
      viewBox={horizontal ? `0 0 ${LENGTH} ${thickness}` : `0 0 ${thickness} ${LENGTH}`}
      preserveAspectRatio={horizontal ? "xMinYMid slice" : "xMidYMin slice"}
    >
      <defs>
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={PERIOD}
          height={thickness}
          patternTransform={horizontal ? undefined : "rotate(90)"}
        >
          <TibebTile columns={columns} colors={colors} idPrefix={id} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
