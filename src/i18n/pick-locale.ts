import { isLocale, type Locale } from "@/lib/localized";

/**
 * The language to show, from those the site offers: the guest's own pick
 * (the cookie) first, then their browser's languages in order, then English,
 * then the site's first language. A pick the site no longer offers is ignored.
 */
export function pickLocale(offered: readonly Locale[], cookie: string | undefined, acceptLanguage: string | null): Locale {
  const available = offered.length > 0 ? offered : (["en"] as const);
  if (isLocale(cookie) && available.includes(cookie)) return cookie;
  const browser = (acceptLanguage ?? "")
    .split(",")
    .map((part) => part.split(";")[0].trim().split("-")[0].toLowerCase());
  const match = browser.find((code): code is Locale => isLocale(code) && available.includes(code));
  if (match) return match;
  return available.includes("en") ? "en" : available[0];
}
