import type { CSSProperties, ReactNode } from "react";
import { cormorant } from "@/app/layout-fonts";
import { getTheme, layoutPalette } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { MemoriesSection } from "../../closing";
import { CountdownSection } from "../../countdown-section";
import { GiftsSection } from "../../gifts";
import { RsvpSection } from "../../rsvp";
import { SaveTheDate } from "../../save-the-date";
import { VenuesSection } from "../../schedule";
import type { LayoutProps } from "../types";
import styles from "./brana.module.css";
import { BranaColophon } from "./colophon";
import { BranaMiniatures } from "./gallery";
import { BranaHero } from "./hero";
import { BranaInvitation, BranaVerse } from "./invitation";
import { BranaSprite, Headpiece } from "./ornaments";
import { branaColors } from "./palette";
import { BranaCanon } from "./schedule";
import { BranaChapters } from "./story";

/** A shared section set as a leaf of the book: a harag headpiece over it, and its title in rubric (see .leaf). */
function Leaf({ children }: { children: ReactNode }) {
  return (
    <div className={cn(styles.leaf, "pt-12 sm:pt-16 lg:pt-20")}>
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <Headpiece className="mx-[18px]" />
      </div>
      {children}
    </div>
  );
}

/**
 * Brana Manuscript: the site as an illuminated Ge'ez book (brana is
 * parchment), after the scriptoria of Lalibela. Calm and scholarly: parchment
 * warmed from the theme's paper with foxed edges, a harag interlace headpiece
 * opening every section, names and titles in red rubric over black ink, and
 * Ge'ez numerals. An incipit page with side bands, the invitation as a page
 * of text, the month ruled like a computus table, the day as a canon table,
 * the photos as framed miniatures, the story in numbered chapters and a
 * colophon with the year in the Ethiopian calendar. The couple's border
 * setting is not used: a manuscript always has harag. Server components
 * throughout; it adds no script of its own (the lightbox and countdown are
 * the shared ones).
 */
export function BranaLayout({ site, locale, names, photos }: LayoutProps) {
  const { couple } = site;
  // The rubric and soft ink are worked out from the theme so they pass AA on this parchment (see palette.ts).
  const { rubric, inkSoft } = branaColors(layoutPalette(getTheme(couple.theme), "theme").colors);
  const colors = { "--brana-rubric": rubric, "--w-ink-soft": inkSoft } as CSSProperties;
  const gifts = site.giftAccounts.length > 0 || site.wishlistItems.length > 0;

  return (
    <div className={cn(cormorant.variable, styles.root)} style={colors}>
      <span aria-hidden className={styles.vignette} />
      <BranaSprite />
      <main className="relative z-[1]">
        <BranaHero site={site} locale={locale} />
        <BranaInvitation site={site} locale={locale} />
        <BranaVerse site={site} locale={locale} />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="manuscript" numerals="geez" marker="circle" photoPreference="gallery" />
        <div className={styles.countdown}>
          <CountdownSection site={site} variant="plain" className="pt-4 pb-10 sm:pt-6 sm:pb-14" />
        </div>
        <BranaCanon site={site} locale={locale} />
        {site.venues.length > 0 ? (
          <Leaf>
            <VenuesSection site={site} locale={locale} />
          </Leaf>
        ) : null}
        <BranaMiniatures photos={photos} names={`${names.one} & ${names.two}`} />
        <BranaChapters site={site} locale={locale} />
        {couple.rsvpEnabled ? (
          <Leaf>
            <RsvpSection site={site} locale={locale} />
          </Leaf>
        ) : null}
        {gifts ? (
          <Leaf>
            <GiftsSection site={site} locale={locale} />
          </Leaf>
        ) : null}
        <MemoriesSection site={site} locale={locale} />
      </main>
      <div className="relative z-[1]">
        <BranaColophon site={site} locale={locale} />
      </div>
    </div>
  );
}
