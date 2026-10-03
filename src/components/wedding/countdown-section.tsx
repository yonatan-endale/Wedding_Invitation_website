import type { SiteData } from "@/db/queries/site";
import { cn } from "@/lib/utils";
import { Countdown } from "./countdown";

/** The live countdown on its own band, shared by layouts that place it under the save-the-date. */
export function CountdownSection({ site, className }: { site: SiteData; className?: string }) {
  return (
    <section aria-labelledby="countdown-caption" className={cn("px-5 py-16 sm:py-20", className)}>
      <Countdown target={site.couple.weddingAt} serverNow={new Date().toISOString()} captionId="countdown-caption" />
    </section>
  );
}
