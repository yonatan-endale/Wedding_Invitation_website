import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CountdownSection, Hero } from "@/components/wedding/hero";
import { GallerySection } from "@/components/wedding/gallery";
import { GiftsSection } from "@/components/wedding/gifts";
import { InvitationCard, ScriptureSection, StorySection } from "@/components/wedding/invitation";
import { MemoriesSection, SiteFooter } from "@/components/wedding/closing";
import { MonogramWatermark } from "@/components/wedding/primitives";
import { MusicButton, MusicProvider } from "@/components/wedding/music";
import { NetelaIntro } from "@/components/wedding/netela-intro";
import { RsvpSection } from "@/components/wedding/rsvp";
import { ScheduleSection, VenuesSection } from "@/components/wedding/schedule";
import { SiteHeader, type NavLink } from "@/components/wedding/site-header";
import { getSiteData, type SiteData } from "@/db/queries/site";
import { getAdminUser } from "@/lib/auth";
import { TENANT_HEADER } from "@/lib/constants";
import { isLocale, pickText, type Locale } from "@/lib/localized";
import { fullName } from "@/lib/names";
import { getTheme } from "@/lib/theme";
import { formatWeddingDate } from "@/lib/wedding-format";

type Props = { params: Promise<{ slug: string }> };

/** Published sites are public. Drafts are visible only to an admin on the main domain (preview). */
const loadVisibleSite = cache(async (slug: string): Promise<{ site: SiteData; preview: boolean }> => {
  const site = await getSiteData(slug);
  if (!site) notFound();
  if (site.couple.status === "published") return { site, preview: false };

  const onCoupleSubdomain = Boolean((await headers()).get(TENANT_HEADER));
  if (onCoupleSubdomain || !(await getAdminUser())) notFound();
  return { site, preview: true };
});

async function currentLocale(): Promise<Locale> {
  const locale = await getLocale();
  return isLocale(locale) ? locale : "en";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { site } = await loadVisibleSite(slug);
  const locale = await currentLocale();
  const { couple } = site;
  const title = `${fullName(couple.partnerOne, couple.partnerOneFather, locale)} & ${fullName(couple.partnerTwo, couple.partnerTwoFather, locale)}`;
  const description = [formatWeddingDate(couple.weddingAt, couple.timezone, locale), pickText(couple.city, locale)]
    .filter(Boolean)
    .join(", ");
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: false, follow: false },
  };
}

function themeCss(themeName: string) {
  const { colors, scheme } = getTheme(themeName);
  return `:root{color-scheme:${scheme};--w-paper:${colors.paper};--w-ink:${colors.ink};--w-ink-soft:${colors.inkSoft};--w-rule:${colors.rule};--w-sheet:${colors.sheet};--w-thread-1:${colors.thread1};--w-thread-2:${colors.thread2};--w-thread-3:${colors.thread3};--w-on-thread-1:${colors.onThread1};--w-petal:${colors.petal}}body{background:${colors.paper}}`;
}

export default async function CoupleSitePage({ params }: Props) {
  const { slug } = await params;
  const { site, preview } = await loadVisibleSite(slug);
  const locale = await currentLocale();
  const t = await getTranslations("nav");
  const { couple } = site;

  // Three forms of each name: first name on the opening screen, nickname in the
  // hero, and first plus father's name in the formal places.
  const firstOne = pickText(couple.partnerOne, locale);
  const firstTwo = pickText(couple.partnerTwo, locale);
  const one = fullName(couple.partnerOne, couple.partnerOneFather, locale);
  const two = fullName(couple.partnerTwo, couple.partnerTwoFather, locale);
  const monogram = `${firstOne.charAt(0)} & ${firstTwo.charAt(0)}`;

  const links: NavLink[] = [
    { id: "invitation", label: t("invitation") },
    pickText(couple.story, locale) ? { id: "story", label: t("story") } : null,
    site.events.length ? { id: "schedule", label: t("schedule") } : null,
    site.venues.length ? { id: "venues", label: t("venues") } : null,
    site.photos.length ? { id: "gallery", label: t("gallery") } : null,
    site.giftAccounts.length || site.wishlistItems.length ? { id: "gifts", label: t("gifts") } : null,
    couple.rsvpEnabled ? { id: "rsvp", label: t("rsvp") } : null,
  ].filter((link): link is NavLink => link !== null);

  const photos = site.photos.map((photo) => ({ id: photo.id, url: photo.url, caption: pickText(photo.caption, locale) }));

  return (
    <MusicProvider src={couple.musicUrl}>
      <style dangerouslySetInnerHTML={{ __html: themeCss(couple.theme) }} />
      <div className="wedding min-h-screen" lang={locale}>
        {preview ? (
          <p className="fixed inset-x-0 bottom-0 z-[80] bg-black px-4 py-2 text-center font-sans text-sm text-white">
            Draft preview. Guests can&apos;t see this site until you publish it.
          </p>
        ) : null}
        <NetelaIntro
          slug={couple.slug}
          partnerOne={firstOne}
          partnerTwo={firstTwo}
          dateLine={formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          border={couple.border}
        />
        <MonogramWatermark monogram={monogram} />
        <SiteHeader monogram={monogram} links={links} />
        <main className="relative z-10">
          <Hero site={site} locale={locale} />
          <CountdownSection site={site} locale={locale} />
          <InvitationCard site={site} locale={locale} />
          <StorySection site={site} locale={locale} />
          <ScriptureSection site={site} locale={locale} />
          <ScheduleSection site={site} locale={locale} />
          <VenuesSection site={site} locale={locale} />
          <GallerySection photos={photos} names={`${one} & ${two}`} />
          <GiftsSection site={site} locale={locale} />
          <RsvpSection site={site} locale={locale} />
          <MemoriesSection site={site} locale={locale} />
        </main>
        <SiteFooter site={site} locale={locale} />
        <MusicButton title={couple.musicTitle} />
      </div>
    </MusicProvider>
  );
}
