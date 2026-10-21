import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { getSiteData } from "@/db/queries/site";
import { LOCALE_COOKIE, SITE_HEADER } from "@/lib/constants";
import { messagesForEvent } from "@/lib/event-messages";
import { DEFAULT_SITE_LOCALES, isLocale, type Locale } from "@/lib/localized";

/** Only these have message files so far. */
const READY = (value: unknown): value is Locale => isLocale(value) && DEFAULT_SITE_LOCALES.includes(value);

async function detectLocale(): Promise<Locale> {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (READY(fromCookie)) return fromCookie;
  const accept = (await headers()).get("accept-language") ?? "";
  return /^am\b/i.test(accept.trim()) ? "am" : "en";
}

/**
 * A site that celebrates something other than a wedding reads its own wording
 * over the shared messages. The site comes from the header the middleware sets
 * on /s/<slug> requests; the lookup is the same cached read the page makes.
 */
async function siteEventType() {
  const slug = (await headers()).get(SITE_HEADER);
  if (!slug) return "wedding" as const;
  return (await getSiteData(slug))?.couple.eventType ?? "wedding";
}

/** An explicit locale, as in getTranslations({ locale }) for a guest's card, wins over the visitor's own. */
export default getRequestConfig(async ({ locale: requested }) => {
  const locale = READY(requested) ? requested : await detectLocale();
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return {
    locale,
    messages: messagesForEvent(messages, await siteEventType()),
  };
});
