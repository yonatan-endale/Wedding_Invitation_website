import type { ReactNode } from "react";
import { Band } from "@/components/wedding/primitives";
import { LanguageToggle } from "@/components/wedding/site-header";
import type { BorderStyle } from "@/lib/constants";
import type { Locale } from "@/lib/localized";
import { getTheme, themeCss } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Props = {
  theme: string;
  border: BorderStyle;
  locale: Locale;
  /** Wide for the couple's guest list; narrow for a single card or pass. */
  width?: "narrow" | "wide";
  children: ReactNode;
};

/**
 * A page in the couple's colours and border but without the site's header and
 * sections: a guest's card, an entry pass, the couple's private page.
 */
export function ThemedPage({ theme, border, locale, width = "narrow", children }: Props) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeCss(getTheme(theme)) }} />
      <div className="wedding flex min-h-screen flex-col" lang={locale}>
        <Band variant={border} />
        <div className="flex justify-end px-5 pt-4 sm:px-8">
          <LanguageToggle />
        </div>
        <main className={cn("mx-auto w-full flex-1 px-5 pt-4 pb-16 sm:px-8", width === "wide" ? "max-w-5xl" : "max-w-xl")}>
          {children}
        </main>
        <Band variant={border} />
      </div>
    </>
  );
}
