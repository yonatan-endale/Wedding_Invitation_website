import { Send } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties, ReactNode } from "react";
import { greatVibes } from "@/app/layout-fonts";
import type { SiteData } from "@/db/queries/site";
import { LAYOUTS } from "@/lib/layout";
import { pickText, type Locale } from "@/lib/localized";
import { getTheme, layoutPalette } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { MemoriesSection } from "../../closing";
import { CountdownSection } from "../../countdown-section";
import { GallerySection } from "../../gallery";
import { GiftsSection } from "../../gifts";
import { StorySection } from "../../invitation";
import { RsvpSection } from "../../rsvp";
import { SaveTheDate } from "../../save-the-date";
import type { LayoutProps } from "../types";
import { SlateFooter } from "./footer";
import { SlateHero } from "./hero";
import { SlateInvitation } from "./invitation";
import { Kicker, SharedCard } from "./kit";
import { slateColors } from "./palette";
import { SlateSchedule } from "./schedule";
import styles from "./slate.module.css";
import { SlateVenues } from "./venues";

type Props = { site: SiteData; locale: Locale };

/**
 * Slate: clean, airy and modern. Cool paper with white cards and one clear
 * accent, deep bands for the cover's foot, the dark cards and the footer, and
 * every heading a script accent line over a serif title with a fine rule and
 * a diamond. A full photo cover with the two ways in (confirm attendance, see
 * the day), the invitation on a white card, the month on a dark photo card, a
 * boxed countdown, the day as white cards down a rail, venue cards with
 * directions, the photos hung as framed prints, the story, RSVP and gifts on
 * white cards, Telegram on a dark card and a footer with the couple's links.
 * The colours are worked out from the theme (palette.ts), so it reads on any
 * of them. Server components throughout; the only scripts are the shared ones.
 */
export function SlateLayout({ site, locale, names, photos }: LayoutProps) {
  const { couple } = site;
  const { band, onBand, glow, accent } = slateColors(layoutPalette(getTheme(couple.theme), LAYOUTS.slate.scheme).colors);
  const colors = { "--slate-band": band, "--slate-on-band": onBand, "--slate-glow": glow, "--slate-accent": accent } as CSSProperties;
  const gifts = site.giftAccounts.length > 0 || site.wishlistItems.length > 0;

  return (
    <div className={cn(greatVibes.variable, styles.root)} style={colors}>
      <main>
        <SlateHero site={site} locale={locale} names={names} />
        <SlateInvitation site={site} locale={locale} names={names} />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="slate" marker="circle" photoPreference="gallery" />
        <CountdownSection site={site} variant="boxed" className="pt-0 pb-10 sm:pt-0 sm:pb-14" />
        <SlateSchedule site={site} locale={locale} />
        <SlateVenues site={site} locale={locale} />
        <SlateGallery site={site} locale={locale} photos={photos} names={`${names.one} & ${names.two}`} />
        {pickText(couple.story, locale) ? (
          <Shared locale={locale} kicker="story">
            <StorySection site={site} locale={locale} />
          </Shared>
        ) : null}
        {couple.rsvpEnabled ? (
          <Shared locale={locale} kicker="rsvp" width="max-w-2xl">
            <RsvpSection site={site} locale={locale} />
          </Shared>
        ) : null}
        {gifts ? (
          <Shared locale={locale} kicker="gifts" width="max-w-5xl">
            <GiftsSection site={site} locale={locale} />
          </Shared>
        ) : null}
        {couple.telegramUrl ? <SlateMemories site={site} locale={locale} /> : null}
      </main>
      <SlateFooter site={site} locale={locale} names={names} />
    </div>
  );
}

/** A shared section in a white card under its script accent line. */
async function Shared({
  locale,
  kicker,
  width,
  children,
}: {
  locale: Locale;
  kicker: "story" | "rsvp" | "gifts";
  width?: string;
  children: ReactNode;
}) {
  const t = await getTranslations("layouts.slate");
  return (
    <SharedCard kicker={t(`kicker.${kicker}`)} locale={locale} width={width}>
      {children}
    </SharedCard>
  );
}

/** The shared carousel (drifting when the couple turned it on) under Slate's accent line, its photos hung as framed prints. */
async function SlateGallery({ site, locale, photos, names }: Props & Pick<LayoutProps, "photos"> & { names: string }) {
  if (photos.length === 0) return null;
  const t = await getTranslations("layouts.slate");
  return (
    <div className={cn(styles.shared, styles.gallery, "pt-10 pb-4 sm:pt-16")}>
      <Kicker locale={locale} className="mb-1 px-5 text-center [&:lang(am)]:mb-2">
        {t("kicker.gallery")}
      </Kicker>
      <GallerySection photos={photos} names={names} drift={site.couple.galleryDrift} />
    </div>
  );
}

/** The shared Telegram invitation on a dark card: the band, with a large paper plane faint in its corner. */
function SlateMemories({ site, locale }: Props) {
  return (
    <div className="px-3 py-8 sm:px-8 sm:py-12">
      <div className={cn(styles.onBand, "relative isolate mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] [&_section>div]:border-y-0")}>
        <span aria-hidden className="absolute inset-0 -z-10" style={MEMORIES_GLOW} />
        <Send aria-hidden className="absolute -right-6 -bottom-8 -z-10 size-44 rotate-12 text-(--slate-glow) opacity-[0.12]" strokeWidth={1} />
        <MemoriesSection site={site} locale={locale} />
      </div>
    </div>
  );
}

/** A soft light of the accent from the card's top left. Inline, so a browser without color-mix keeps the plain band. */
const MEMORIES_GLOW: CSSProperties = {
  backgroundImage: "radial-gradient(70% 90% at 0% 0%, color-mix(in oklab, var(--slate-glow) 22%, transparent), transparent 70%)",
};
