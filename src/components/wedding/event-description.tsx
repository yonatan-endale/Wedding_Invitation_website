import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLElement> & {
  text: string | null | undefined;
  /** The couple's "tap-to-expand event details" switch. */
  collapsible: boolean;
};

/**
 * An event's description in a timeline. Plain text as always, or, when the
 * couple turned the switch on, folded behind "Show details" in a native
 * <details>, which opens without JavaScript and is announced by screen readers.
 * Extra attributes (reveal hooks, styles) go on the outer element either way.
 */
export async function EventDescription({ text, collapsible, className, ...rest }: Props) {
  if (!text) return null;
  if (!collapsible) {
    return (
      <p className={className} {...rest}>
        {text}
      </p>
    );
  }
  const t = await getTranslations("schedule");
  return (
    <details className={cn("group/details", className)} {...rest}>
      <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1 text-sm underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
        <span className="group-open/details:hidden">{t("showDetails")}</span>
        <span className="hidden group-open/details:inline">{t("hideDetails")}</span>
        <ChevronDown aria-hidden className="size-4 transition-transform group-open/details:rotate-180" />
      </summary>
      <p className="mt-1">{text}</p>
    </details>
  );
}
