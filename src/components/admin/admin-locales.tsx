"use client";

import { createContext, useContext, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { DEFAULT_SITE_LOCALES, LANGUAGES, LOCALES, type Locale, type LocalizedText } from "@/lib/localized";
import { Field } from "./fields";

const AdminLocales = createContext<readonly Locale[]>(DEFAULT_SITE_LOCALES);

/** The languages this site offers guests, so text inputs appear only for those. */
export function AdminLocalesProvider({ locales, children }: { locales: readonly Locale[]; children: ReactNode }) {
  return <AdminLocales.Provider value={locales}>{children}</AdminLocales.Provider>;
}

/**
 * English first, since it is the fallback every site keeps, then the site's
 * other languages, and separately the switched-off ones whose saved text
 * travels as hidden inputs so turning a language off never deletes it.
 */
export function useAdminLocales(): { shown: Locale[]; hidden: Locale[] } {
  const enabled = useContext(AdminLocales);
  const shown = LOCALES.filter((locale) => locale === "en" || enabled.includes(locale));
  return { shown, hidden: LOCALES.filter((locale) => !shown.includes(locale)) };
}

export const languageLabel = (locale: Locale) =>
  locale === "en" ? "English" : `${LANGUAGES[locale].englishName} (optional)`;

export const inputDir = (locale: Locale) => (LANGUAGES[locale].dir === "rtl" ? "rtl" : undefined);

/** Hidden copies of text in switched-off languages. */
export function KeptTranslations({ name, value, locales }: { name: string; value?: LocalizedText | null; locales: Locale[] }) {
  return locales.map((locale) =>
    value?.[locale] ? <input key={locale} type="hidden" name={`${name}.${locale}`} value={value[locale]} /> : null,
  );
}

/** One input per non-English site language, for name fields laid out by hand. */
export function OtherLanguageInputs({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value?: LocalizedText | null;
}) {
  const { shown, hidden } = useAdminLocales();
  return (
    <>
      {shown
        .filter((locale) => locale !== "en")
        .map((locale) => (
          <Field key={locale} label={`${label} in ${LANGUAGES[locale].englishName}`} htmlFor={`${name}-${locale}`}>
            <Input
              id={`${name}-${locale}`}
              name={`${name}.${locale}`}
              lang={locale}
              dir={inputDir(locale)}
              defaultValue={value?.[locale]}
              autoComplete="off"
            />
          </Field>
        ))}
      <KeptTranslations name={name} value={value} locales={hidden} />
    </>
  );
}
