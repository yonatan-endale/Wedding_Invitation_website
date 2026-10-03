import type { MotionLevel, Ornament } from "@/lib/appearance";
import type { BorderStyle } from "@/lib/constants";

/** Everything an opening screen may draw. Each opening uses what it needs. */
export type OpeningProps = {
  /** First names in the page's language. */
  names: { one: string; two: string };
  initials: [string, string];
  /** Between the initials on a seal: "&", or the Ethiopic wordspace on Amharic pages. */
  separator: "&" | "፡";
  /** The wedding date in the page's calendar, and the other calendar's date when it differs. */
  dateLine: string;
  altDateLine: string | null;
  border: BorderStyle;
  ornament: Ornament;
  photo: { src: string; position: string } | null;
  /** From ?to= on the invitation link, already cleaned. */
  guestName: string | null;
  level: MotionLevel;
};
