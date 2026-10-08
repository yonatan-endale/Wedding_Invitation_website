import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tag = "span" | "p" | "div" | "h1" | "h2" | "h3" | "strong" | "em";

type Props = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: Tag;
  children: ReactNode;
  className?: string;
  /**
   * One bright sweep across the foil when this text, or an ancestor, scrolls
   * into view (moderate and rich motion only). The text is never hidden, so
   * it is safe in a hero.
   */
  sheen?: boolean;
  /** Seconds between the reveal and the sweep (default 0.4). */
  sheenDelay?: number;
};

/**
 * Gold-foil lettering: a gradient derived from the theme's metal colour,
 * clipped to the glyphs, with a deep edge, the metal itself and a bright
 * highlight. Browsers without background-clip:text or color-mix, and forced
 * colours, get solid metal (or the system text colour). Use it only on dark
 * backgrounds or at large display sizes, where metal holds its contrast.
 * Do not nest elements with transforms or opacity inside it: they drop out
 * of the clipped text in Chromium. A server component.
 */
export function FoilText({ as: Tag = "span", children, className, sheen = true, sheenDelay, style, ...rest }: Props) {
  const merged = sheenDelay === undefined ? style : ({ ...style, "--sheen-delay": `${sheenDelay}s` } as CSSProperties);
  return (
    <Tag
      {...rest}
      // A reveal preset that never hides anything; it only gets the text observed.
      data-reveal={sheen ? "sheen" : undefined}
      className={cn("foil-text", sheen && "foil-sheen", className)}
      style={merged}
    >
      {children}
    </Tag>
  );
}
