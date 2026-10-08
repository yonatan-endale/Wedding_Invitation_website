import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { LAYOUT_COMPONENTS } from "@/components/wedding/layouts";
import { BootScript } from "@/components/wedding/intro/boot-script";
import { IntroProvider } from "@/components/wedding/intro/intro-context";
import { MotionProvider } from "@/components/wedding/motion/motion-provider";
import { MotionToggle } from "@/components/wedding/motion/motion-toggle";
import { RevealObserver } from "@/components/wedding/motion/reveal-observer";
import { MusicButton, MusicProvider } from "@/components/wedding/music";
import { OpeningHost } from "@/components/wedding/openings";
import { SiteHeader } from "@/components/wedding/site-header";
import { sectionLinks } from "@/components/wedding/site-links";
import { getSiteData, type SiteData } from "@/db/queries/site";
import { getMotionLevel, getOrnament } from "@/lib/appearance";
import { getAdminUser } from "@/lib/auth";
import { parseGuestName } from "@/lib/guest";
import { CLERK_SESSION_COOKIE, TENANT_HEADER } from "@/lib/constants";
import { LAYOUTS, getLayout } from "@/lib/layout";
import { isLocale, pickText, type Locale } from "@/lib/localized";
import { fullName, initials, monogramText } from "@/lib/names";
import { getOpening } from "@/lib/opening";
import { hasPreviewOverrides, parsePreviewOverrides, type PreviewOverrides } from "@/lib/preview-overrides";
import { getTheme, layoutPalette, themeCss } from "@/lib/theme";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";

type SearchParams = Record<string, string | string[] | undefined>;
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

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

/**
 * Admin-only looks from the query string (?layout=, ?opening=, ?motion=,
 * ?calendar=, ?theme=), for trying a design without saving it. Guests and
 * couple subdomains never get them; Clerk is asked only when one is present
 * and the visitor has a session. On `next dev` they work without signing in,
 * so designs can be checked locally.
 */
async function adminOverrides(searchParams: SearchParams, preview: boolean): Promise<PreviewOverrides> {
  const overrides = parsePreviewOverrides(searchParams);
  if (!hasPreviewOverrides(overrides)) return {};
  if ((await headers()).get(TENANT_HEADER)) return {};
  if (preview || process.env.NODE_ENV === "development") return overrides;
  const signedIn = (await cookies()).getAll().some((cookie) => CLERK_SESSION_COOKIE.test(cookie.name));
  return signedIn && (await getAdminUser()) ? overrides : {};
}

export default async function CoupleSitePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const loaded = await loadVisibleSite(slug);
  const { preview } = loaded;
  const query = await searchParams;
  const overrides = await adminOverrides(query, preview);
  const site: SiteData = { ...loaded.site, couple: { ...loaded.site.couple, ...overrides } };
  const locale = await currentLocale();
  const t = await getTranslations("nav");
  const { couple } = site;

  // Three forms of each name: first name on the opening screen, nickname in the
  // hero, and first plus father's name in the formal places.
  const firstOne = pickText(couple.partnerOne, locale);
  const firstTwo = pickText(couple.partnerTwo, locale);
  const one = fullName(couple.partnerOne, couple.partnerOneFather, locale);
  const two = fullName(couple.partnerTwo, couple.partnerTwoFather, locale);
  const coupleInitials = initials(firstOne, firstTwo);
  const names = { one, two, firstOne, firstTwo, initials: coupleInitials, monogram: monogramText(coupleInitials) };

  // The layout decides the section order and look; the shell around it is shared.
  const layout = getLayout(couple.layout);
  const Layout = LAYOUT_COMPONENTS[layout];
  const meta = LAYOUTS[layout];
  const links = sectionLinks(site, locale, (key) => t(key), meta);
  const photos = site.photos.map((photo) => ({ id: photo.id, url: photo.url, caption: pickText(photo.caption, locale) }));
  const motion = getMotionLevel(couple.motion);
  // Dark layouts show a light theme in its dark variant.
  const palette = layoutPalette(getTheme(couple.theme), meta.scheme);

  return (
    <MusicProvider src={couple.musicUrl}>
      <IntroProvider slug={couple.slug}>
        <MotionProvider>
          <style dangerouslySetInnerHTML={{ __html: themeCss(palette) }} />
          <div className="wedding min-h-screen" lang={locale} data-motion={motion}>
            <BootScript slug={couple.slug} replay={query.replay === "1"} />
            <noscript dangerouslySetInnerHTML={{ __html: "<style>[data-opening]{display:none!important}</style>" }} />
            {preview ? (
              <p className="fixed inset-x-0 bottom-0 z-[80] bg-black px-4 py-2 text-center font-sans text-sm text-white">
                Draft preview. Guests can&apos;t see this site until you publish it.
              </p>
            ) : null}
            <OpeningHost
              name={getOpening(couple.opening)}
              names={{ one: firstOne, two: firstTwo }}
              initials={coupleInitials}
              separator={locale === "am" ? "፡" : "&"}
              dateLine={formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
              altDateLine={
                locale === "am"
                  ? formatGregorianDate(couple.weddingAt, couple.timezone)
                  : formatEthiopianDateLine(couple.weddingAt, couple.timezone)
              }
              border={couple.border}
              ornament={getOrnament(couple.ornament)}
              photo={couple.heroPhotoUrl ? { src: couple.heroPhotoUrl, position: couple.heroPosition } : null}
              guestName={parseGuestName(query.to)}
              level={motion}
            />
            <div id="site">
              <SiteHeader monogram={names.monogram} links={links} startSolid={meta.headerStartSolid} />
              <Layout site={site} locale={locale} names={names} photos={photos} />
              <MusicButton title={couple.musicTitle} />
              {/* Subtle pages have nothing that moves for long; every other level gets the pause. */}
              <MotionToggle visible={motion !== "subtle"} />
            </div>
            <RevealObserver />
          </div>
        </MotionProvider>
      </IntroProvider>
    </MusicProvider>
  );
}
