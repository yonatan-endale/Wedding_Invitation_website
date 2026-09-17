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

export default getRequestConfig(async () => {
  const locale = await detectLocale();
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
