import { Check, X } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemedPage } from "@/components/card/themed-page";
import { buttonOutline } from "@/components/wedding/primitives";
import { getGuestCard } from "@/db/queries/cards";
import { getSiteData } from "@/db/queries/site";
import { siteBaseFromRequest } from "@/lib/card/site-base";
import { isLocale, pickText } from "@/lib/localized";
import { siteTitleNames } from "@/lib/site-names";
import { cn } from "@/lib/utils";
import { formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";

// Read fresh on every scan, so a deleted RSVP stops passing at the door.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; token: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("card.pass");
  return { title: t("title"), robots: { index: false, follow: false }, referrer: "no-referrer" };
}

/**
 * What an usher sees after scanning a card's QR code: valid or not, the guest's
 * name and how many they bring. Never the phone number or email.
 */
export default async function EntryPassPage({ params }: Props) {
  const { slug, token } = await params;
  const [card, site] = await Promise.all([getGuestCard(slug, token), getSiteData(slug)]);
  if (!site || site.couple.status !== "published" || !site.couple.guestCardsEnabled) notFound();

  const [t, tCard, current, base] = await Promise.all([
    getTranslations("card.pass"),
    getTranslations("card"),
    getLocale(),
    siteBaseFromRequest(slug),
  ]);
  const locale = isLocale(current) ? current : "en";
  const { couple, venues } = site;
  const coupleNames = siteTitleNames(site, locale);
  const venue = venues[0];

  return (
    <ThemedPage theme={couple.theme} border={couple.border} locale={locale}>
      <div className="mt-6 text-center">
        <p className="text-sm tracking-[0.18em] text-ink-soft uppercase">{t("title")}</p>
        {card ? (
          <>
            <div className="mx-auto mt-6 flex size-24 items-center justify-center rounded-full bg-thread-1 text-on-thread-1">
              <Check className="size-12" strokeWidth={2.5} aria-hidden />
            </div>
            <h1 className="mt-6 font-display text-[clamp(1.75rem,5vw,2.25rem)] text-thread-1">{t("valid")}</h1>
            <p className="mt-6 font-display text-[clamp(2rem,7vw,3rem)] leading-tight break-words">{card.guest.name}</p>
            <p className="mt-3 text-2xl">{tCard("admits", { count: card.guest.guestCount })}</p>
          </>
        ) : (
          <>
            <div className="mx-auto mt-6 flex size-24 items-center justify-center rounded-full bg-thread-3 text-white">
              <X className="size-12" strokeWidth={2.5} aria-hidden />
            </div>
            <h1 className="mt-6 font-display text-[clamp(1.75rem,5vw,2.25rem)] text-thread-3">{t("invalid")}</h1>
            <p className="mx-auto mt-4 max-w-[36ch] text-ink-soft">{t("invalidBody")}</p>
          </>
        )}

        <div className="mx-auto my-10 h-px w-16 bg-thread-2" aria-hidden />
        <p className="font-display text-xl">{coupleNames}</p>
        <p className="mt-2 text-ink-soft">
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}, {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
        </p>
        {venue ? <p className="mt-1 text-ink-soft">{pickText(venue.name, locale)}</p> : null}
        <a href={base} className={cn(buttonOutline, "mt-8")}>
          {tCard("openSite")}
        </a>
      </div>
    </ThemedPage>
  );
}
