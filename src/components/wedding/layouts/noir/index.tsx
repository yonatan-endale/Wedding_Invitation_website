import { cormorant } from "@/app/layout-fonts";
import { cn } from "@/lib/utils";
import { MemoriesSection } from "../../closing";
import { CountdownSection } from "../../countdown-section";
import { StorySection } from "../../invitation";
import { RsvpSection } from "../../rsvp";
import { SaveTheDate } from "../../save-the-date";
import { ScheduleSection, VenuesSection } from "../../schedule";
import type { LayoutProps } from "../types";
import { NoirFooter } from "./footer";
import { NoirGallery } from "./gallery";
import { NoirGifts } from "./gifts";
import { NoirHero, NoirInvitation } from "./hero";
import styles from "./noir.module.css";
import { NoirScripture } from "./scripture";

/*
 * Black tie wants paper darker than most themes'. Cap the lightness of the
 * theme's paper and sheet and quieten their colour, keeping the hue:
 * oxblood for burgundy, green-black for emerald; a paper already that dark
 * keeps its lightness. The theme's own values are copied first on
 * :root, so the new ones on body never refer to themselves. Set on body, so
 * the header, menu and opening screen match the page. Only ever darker, so
 * each colour keeps at least the contrast it was checked for. Rendered only
 * with this layout, and skipped where relative colours are unsupported.
 */
const NOIR_PAPER =
  ":root{--noir-paper:var(--w-paper);--noir-sheet:var(--w-sheet)}" +
  "@supports (color:oklch(from red l c h)){html body{" +
  "--w-paper:oklch(from var(--noir-paper) min(l,0.145) calc(c*0.6) h);" +
  "--w-sheet:oklch(from var(--noir-sheet) min(l,0.185) calc(c*0.65) h);" +
  "background:var(--w-paper)}}";

/**
 * Noir & Gold: black tie. A crest cover with the names in gold foil, the
 * invitation on a gold-framed panel, the typographic save-the-date, outline
 * countdown, the shared day and venues, a gold-framed gallery wall,
 * black-metal gift cards and a crest to close.
 */
export function NoirLayout({ site, locale, names, photos }: LayoutProps) {
  return (
    <div className={cn(cormorant.variable, styles.root)}>
      <style dangerouslySetInnerHTML={{ __html: NOIR_PAPER }} />
      <main className="relative z-10">
        <NoirHero site={site} locale={locale} names={names} />
        <NoirInvitation site={site} locale={locale} />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="noir" />
        <CountdownSection site={site} variant="outline" className="border-t border-rule" />
        <ScheduleSection site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <NoirGallery photos={photos} names={`${names.one} & ${names.two}`} />
        <StorySection site={site} locale={locale} />
        <NoirScripture site={site} locale={locale} />
        <NoirGifts site={site} locale={locale} names={names} />
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <NoirFooter site={site} locale={locale} names={names} />
    </div>
  );
}
