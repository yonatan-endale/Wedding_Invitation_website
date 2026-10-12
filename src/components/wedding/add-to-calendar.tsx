import { CalendarPlus, Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { googleCalendarUrl } from "@/lib/calendar-links";
import { siteBaseFromRequest } from "@/lib/card/site-base";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { weddingCalendarEvent } from "@/lib/wedding-calendar";

const button =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-current/30 px-4 text-sm transition-colors hover:border-current focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Two ways to save the day: Google Calendar, and an .ics file for Apple
 * Calendar, Outlook and most phones. Takes the colour of the text around it, so
 * it sits on any save-the-date skin. Renders nothing unless the couple turned
 * "Add to calendar" on.
 */
export async function AddToCalendar({ site, locale, className }: { site: SiteData; locale: Locale; className?: string }) {
  if (!site.couple.calendarButtons) return null;
  const [t, base] = await Promise.all([getTranslations("calendar"), siteBaseFromRequest(site.couple.slug)]);
  const event = await weddingCalendarEvent(site, locale, base);
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2.5", className)}>
      <span className="sr-only">{t("add")}</span>
      <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={button}>
        <CalendarPlus aria-hidden className="size-4" /> {t("google")}
      </a>
      <a href={`${base}/calendar`} download="wedding.ics" className={button}>
        <Download aria-hidden className="size-4" /> {t("ics")}
      </a>
    </div>
  );
}
