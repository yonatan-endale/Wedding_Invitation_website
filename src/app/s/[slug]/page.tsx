import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { LAYOUT_COMPONENTS, LAYOUT_SHELL } from "@/components/wedding/layouts";
import { MusicButton, MusicProvider } from "@/components/wedding/music";
import { NetelaIntro } from "@/components/wedding/netela-intro";
import { SiteHeader } from "@/components/wedding/site-header";
import { sectionLinks } from "@/components/wedding/site-links";
import { getSiteData, type SiteData } from "@/db/queries/site";
import { getAdminUser } from "@/lib/auth";
import { TENANT_HEADER } from "@/lib/constants";
import { getLayout } from "@/lib/layout";
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
  const names = { one, two, firstOne, firstTwo, monogram: `${firstOne.charAt(0)} & ${firstTwo.charAt(0)}` };

  // The layout decides the section order and look; the shell around it is shared.
  const layout = getLayout(couple.layout);
  const Layout = LAYOUT_COMPONENTS[layout];
  const shell = LAYOUT_SHELL[layout];
  const links = sectionLinks(site, locale, (key) => t(key), { withCouple: shell.withCoupleLink });
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
        <SiteHeader monogram={names.monogram} links={links} startSolid={shell.headerStartSolid} />
        <Layout site={site} locale={locale} names={names} photos={photos} />
        <MusicButton title={couple.musicTitle} />
      </div>
    </MusicProvider>
  );
}
