import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemedPage } from "@/components/card/themed-page";
import { CoupleDashboard } from "@/components/couple/dashboard";
import { UnlockForm } from "@/components/couple/unlock-form";
import { listRsvpsForCouple } from "@/db/queries/couple-portal";
import { getSiteData } from "@/db/queries/site";
import { siteBaseFromRequest } from "@/lib/card/site-base";
import { getCoupleSession } from "@/lib/couple-access";
import { isLocale } from "@/lib/localized";
import { siteTitleNames } from "@/lib/site-names";

// Reads the session cookie on every request; never cached.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("couplePortal");
  return { title: t("unlockTitle"), robots: { index: false, follow: false }, referrer: "no-referrer" };
}

/**
 * The couple's private page for RSVPs and wishes. No sign-up and no admin
 * account: the secret link plus passcode start a session (see lib/couple-access.ts).
 */
export default async function CouplePortalPage({ params }: Props) {
  const { slug } = await params;
  const site = await getSiteData(slug);
  if (!site?.couple.couplePageEnabled) notFound();

  const [t, current, session] = await Promise.all([getTranslations("couplePortal"), getLocale(), getCoupleSession(slug)]);
  const locale = isLocale(current) ? current : "en";
  const { couple } = site;
  const coupleNames = siteTitleNames(site, locale);

  if (!session) {
    return (
      <ThemedPage theme={couple.theme} border={couple.border} locale={locale}>
        <div className="mt-8 text-center">
          <h1 className="font-display text-[clamp(2rem,6vw,2.75rem)] leading-tight">{t("unlockTitle")}</h1>
          <p className="mt-2 text-ink-soft">{coupleNames}</p>
        </div>
        <UnlockForm slug={slug} />
      </ThemedPage>
    );
  }

  const [rows, siteBase] = await Promise.all([listRsvpsForCouple(session.coupleId), siteBaseFromRequest(slug)]);
  return (
    <ThemedPage theme={couple.theme} border={couple.border} locale={locale} width="wide">
      <CoupleDashboard
        slug={slug}
        rows={rows}
        coupleNames={coupleNames}
        timezone={couple.timezone}
        siteBase={siteBase}
        locale={locale}
        cardsEnabled={couple.guestCardsEnabled}
      />
    </ThemedPage>
  );
}
