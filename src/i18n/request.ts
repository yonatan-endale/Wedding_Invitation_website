import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { getSiteData } from "@/db/queries/site";
import { LOCALE_COOKIE, SITE_HEADER } from "@/lib/constants";
import { messagesForEvent } from "@/lib/event-messages";
import { DEFAULT_SITE_LOCALES, isLocale } from "@/lib/localized";
import { pickLocale } from "./pick-locale";

/**
 * The site behind this request, from the header the middleware sets on
 * /s/<slug> requests; the lookup is the same cached read the page makes.
 */
async function currentSite() {
  const slug = (await headers()).get(SITE_HEADER);
  return slug ? getSiteData(slug) : null;
}

/** An explicit locale, as in getTranslations({ locale }) for a guest's card, wins over the visitor's own. */
export default getRequestConfig(async ({ locale: requested }) => {
  const site = await currentSite();
  // Pages outside a guest site (the landing page, admin) stay in English or Amharic.
  const offered = site?.couple.enabledLocales ?? DEFAULT_SITE_LOCALES;
  const locale = isLocale(requested)
    ? requested
    : pickLocale(offered, (await cookies()).get(LOCALE_COOKIE)?.value, (await headers()).get("accept-language"));
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return {
    locale,
    // A site that celebrates something other than a wedding reads its own wording over the shared messages.
    messages: messagesForEvent(messages, site?.couple.eventType ?? "wedding"),
  };
});
