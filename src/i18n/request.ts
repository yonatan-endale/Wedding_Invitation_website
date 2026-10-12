import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE } from "@/lib/constants";
import { isLocale, type Locale } from "@/lib/localized";

async function detectLocale(): Promise<Locale> {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;
  const accept = (await headers()).get("accept-language") ?? "";
  return /^am\b/i.test(accept.trim()) ? "am" : "en";
}

/** An explicit locale, as in getTranslations({ locale }) for a guest's card, wins over the visitor's own. */
export default getRequestConfig(async ({ locale: requested }) => {
  const locale = isLocale(requested) ? requested : await detectLocale();
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
