"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_SITE_LOCALES, type Locale } from "@/lib/localized";

type SiteLocales = { slug: string | null; locales: readonly Locale[] };

const Context = createContext<SiteLocales>({ slug: null, locales: DEFAULT_SITE_LOCALES });

/** The languages this site offers, for the language switcher on every page under /s/<slug>. */
export function SiteLocalesProvider({ value, children }: { value: SiteLocales; children: ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useSiteLocales = () => useContext(Context);
