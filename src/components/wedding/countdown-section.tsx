import type { SiteData } from "@/db/queries/site";
import { cn } from "@/lib/utils";
import { Countdown, type CountdownVariant } from "./countdown";

type Props = { site: SiteData; className?: string; variant?: CountdownVariant; tone?: "ink" | "light" };

/** The live countdown on its own band, shared by layouts that place it under the save-the-date. */
export function CountdownSection({ site, className, variant, tone }: Props) {
  return (
    <section aria-labelledby="countdown-caption" className={cn("px-5 py-16 sm:py-20", className)}>
      <Countdown
        target={site.couple.weddingAt}
        serverNow={new Date().toISOString()}
        captionId="countdown-caption"
        variant={variant}
        tone={tone}
      />
    </section>
  );
}
