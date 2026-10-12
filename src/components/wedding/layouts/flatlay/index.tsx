import { cormorant } from "@/app/layout-fonts";
import { pickText } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { MemoriesSection } from "../../closing";
import { CountdownSection } from "../../countdown-section";
import { StorySection } from "../../invitation";
import type { LayoutProps } from "../types";
import styles from "./flatlay.module.css";
import { FlatlayFooter } from "./footer";
import { FlatlayGallery } from "./gallery";
import { FlatlayHero } from "./hero";
import { FlatlayStack } from "./stack";

/**
 * Flat-lay Suite: a wedding stationery suite photographed on linen. An
 * envelope with the couple's wax seal (already open for guests who just
 * opened the envelope opening), then the suite's cards stacking over one
 * another as the guest scrolls: invitation, save-the-date, the day, the
 * details, the reply card and the gifts card. The countdown sits on the
 * linen, the photos lie fanned out as prints, the story is one more card and
 * a thank-you note closes. Cormorant is loaded for the italic names.
 */
export function FlatlayLayout({ site, locale, names, photos }: LayoutProps) {
  const story = pickText(site.couple.story, locale);
  return (
    <div className={cn(cormorant.variable, styles.root)}>
      <main className="relative">
        <FlatlayHero site={site} locale={locale} names={names} />
        <FlatlayStack site={site} locale={locale} names={names} photos={photos} />
        <CountdownSection site={site} className={cn(styles.onLinen, styles.press, "py-14 sm:py-20")} />
        <FlatlayGallery photos={photos} names={`${names.one} & ${names.two}`} />
        {story ? (
          <div className="px-4 pb-20 sm:px-8 sm:pb-28">
            <div className={cn(styles.sheet, styles.cut, styles.inset, "mx-auto max-w-5xl rotate-[0.4deg]")}>
              <StorySection site={site} locale={locale} />
            </div>
          </div>
        ) : null}
        <div className={styles.onLinen}>
          <MemoriesSection site={site} locale={locale} />
        </div>
      </main>
      <FlatlayFooter site={site} locale={locale} names={names} />
    </div>
  );
}
