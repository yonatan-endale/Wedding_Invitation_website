import { Download } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CardShare } from "@/components/card/card-share";
import { ThemedPage } from "@/components/card/themed-page";
import { buttonPrimary } from "@/components/wedding/primitives";
import { getGuestCard } from "@/db/queries/cards";
import { cardFileName, cardImageUrl, cardPageUrl } from "@/lib/card-links";
import { siteBaseFromRequest } from "@/lib/card/site-base";
import { isLocale } from "@/lib/localized";
import { fullName } from "@/lib/names";
import { cn } from "@/lib/utils";

// Never cached: deleting the RSVP takes the card down at once.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; token: string }> };

const loadCard = cache((slug: string, token: string) => getGuestCard(slug, token));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, token } = await params;
  const card = await loadCard(slug, token);
  const t = await getTranslations("card");
  if (!card) return { robots: { index: false, follow: false } };
  const base = await siteBaseFromRequest(slug);
  const title = t("pageTitle", { name: card.guest.name });
  return {
    title,
    robots: { index: false, follow: false },
    referrer: "no-referrer",
    // The card itself is the link preview when a guest forwards it.
    openGraph: { title, images: [{ url: cardImageUrl(base, token), width: 1080, height: 1512 }] },
  };
}

/** The guest's own card: the picture, a download button and ways to share it. */
export default async function GuestCardPage({ params }: Props) {
  const { slug, token } = await params;
  const card = await loadCard(slug, token);
  if (!card) notFound();

  const [t, current, base] = await Promise.all([getTranslations("card"), getLocale(), siteBaseFromRequest(slug)]);
  const locale = isLocale(current) ? current : "en";
  const { couple } = card.site;
  const coupleNames = `${fullName(couple.partnerOne, couple.partnerOneFather, locale)} & ${fullName(couple.partnerTwo, couple.partnerTwoFather, locale)}`;
  const fileName = cardFileName(card.guest.name);

  return (
    <ThemedPage theme={couple.theme} border={couple.border} locale={locale}>
      <h1 className="text-center font-display text-[clamp(1.75rem,5vw,2.5rem)] leading-tight">
        {t("pageTitle", { name: card.guest.name })}
      </h1>
      <p className="mx-auto mt-3 max-w-[38ch] text-center text-ink-soft">{t("pageIntro")}</p>

      {/* eslint-disable-next-line @next/next/no-img-element -- a generated PNG; next/image would re-encode it */}
      <img
        src={cardImageUrl(base, token)}
        alt={t("imageAlt", { name: card.guest.name })}
        width={1080}
        height={1512}
        className="mx-auto mt-8 h-auto w-full max-w-md rounded-[3px] border border-rule shadow-[0_18px_50px_-20px_rgb(0_0_0/0.35)]"
      />

      <div className="mx-auto mt-8 grid max-w-md gap-3">
        <a href={cardImageUrl(base, token, { download: true })} download={fileName} className={cn(buttonPrimary, "w-full")}>
          <Download className="size-4" aria-hidden /> {t("download")}
        </a>
        <CardShare
          pageUrl={cardPageUrl(base, token)}
          imageUrl={cardImageUrl(base, token)}
          fileName={fileName}
          text={t("shareText", { couple: coupleNames })}
        />
        <a href={base} className="mt-2 text-center text-ink-soft underline underline-offset-4 hover:text-ink">
          {t("openSite")}
        </a>
      </div>
    </ThemedPage>
  );
}
