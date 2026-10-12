import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children?: ReactNode;
  className?: string;
  /**
   * How far the keyline sits from the edge, in px: positive inside the box
   * (over a photo or card), negative outside it (then no ancestor may clip).
   */
  inset?: number;
  /** A second, fainter line 4px inside the first. */
  double?: boolean;
  /** Small gold diamonds on the four corners. */
  corners?: boolean;
  /** Classes for the keyline layer, e.g. a reveal or choreography class. */
  lineClassName?: string;
};

const CORNERS = ["-top-[3.5px] -left-[3.5px]", "-top-[3.5px] -right-[3.5px]", "-bottom-[3.5px] -left-[3.5px]", "-bottom-[3.5px] -right-[3.5px]"];

/**
 * A thin gold rectangle drawn over or around a photo or card, in the theme's
 * metal colour. Decorative and click-through; the children render as they
 * are. A server component.
 */
export function KeylineFrame({ children, className, inset = 8, double = false, corners = false, lineClassName }: Props) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <span aria-hidden className={cn("pointer-events-none absolute", lineClassName)} style={{ inset: `${inset}px` }}>
        <span className="absolute inset-0 border border-metal/70" />
        {double ? <span className="absolute inset-1 border border-metal/40" /> : null}
        {corners
          ? CORNERS.map((position) => <span key={position} className={cn("absolute size-[7px] rotate-45 bg-metal", position)} />)
          : null}
      </span>
    </div>
  );
}
