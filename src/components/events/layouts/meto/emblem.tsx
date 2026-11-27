import { CREST_PATHS } from "@/components/wedding/kit/crest";
import { cn } from "@/lib/utils";

/** Smaller type as the numeral grows, so it stays inside the laurel: ፻ alone, ፹፭, ፻፲፩. */
function fontSizeFor(numeral: string): number {
  const glyphs = [...numeral].length;
  if (glyphs <= 1) return 64;
  if (glyphs === 2) return 44;
  return 30;
}

/**
 * The age in Ge'ez numerals at the heart of the crest's double ring and
 * laurel, in the theme's metal. The age is also written out beside it in the
 * page's language, so the emblem itself is decorative.
 */
export function GeezEmblem({ numeral, surface, className }: { numeral: string; surface: "light" | "dark"; className?: string }) {
  const gradient = "meto-emblem-foil";
  const stops =
    surface === "dark"
      ? ["color-mix(in oklab, var(--w-metal), white 45%)", "var(--w-metal)", "color-mix(in oklab, var(--w-metal), black 20%)"]
      : ["color-mix(in oklab, var(--w-metal), black 25%)", "color-mix(in oklab, var(--w-metal), black 40%)", "color-mix(in oklab, var(--w-metal), black 55%)"];

  return (
    <svg viewBox="0 0 160 160" aria-hidden className={cn("block overflow-visible text-metal", className)}>
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          {/* currentColor (the metal) stands in where color-mix is unsupported. */}
          <stop offset="0%" stopColor="currentColor" style={{ stopColor: stops[0] }} />
          <stop offset="55%" stopColor="currentColor" style={{ stopColor: stops[1] }} />
          <stop offset="100%" stopColor="currentColor" style={{ stopColor: stops[2] }} />
        </linearGradient>
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path strokeWidth={1.3} d={CREST_PATHS.outerRing} />
        <path strokeWidth={0.6} strokeOpacity={0.75} d={CREST_PATHS.innerRing} />
        <path strokeWidth={1} d={CREST_PATHS.stem} />
        <path strokeWidth={1} d={CREST_PATHS.stem} transform="matrix(-1 0 0 1 160 0)" />
      </g>
      <g fill="currentColor" fillOpacity={0.85}>
        <path d={CREST_PATHS.leaves} />
        <path d={CREST_PATHS.leaves} transform="matrix(-1 0 0 1 160 0)" />
        <path d={CREST_PATHS.tie} />
      </g>
      <text
        x="80"
        y="80"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSizeFor(numeral)}
        fill={`url(#${gradient})`}
        className="font-display"
      >
        {numeral}
      </text>
    </svg>
  );
}
