"use server";

import { cookies } from "next/headers";
import { getSiteData } from "@/db/queries/site";
import { LOCALE_COOKIE } from "@/lib/constants";
import { isLocale } from "@/lib/localized";

/** Remembers the guest's language, if the site they are on offers it. */
export async function setLocale(locale: string, slug?: string) {
  if (!isLocale(locale)) return;
  if (slug) {
    const site = await getSiteData(slug);
    if (site && !site.couple.enabledLocales.includes(locale)) return;
  }
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
