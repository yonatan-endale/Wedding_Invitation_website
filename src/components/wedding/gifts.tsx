import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { GiftAccountActions } from "./gift-account-actions";
import { SectionHeading, WeddingImage, buttonOutline, sectionPadding } from "./primitives";

type Props = { site: SiteData; locale: Locale };

export async function GiftsSection({ site, locale }: Props) {
  const { giftAccounts, wishlistItems, couple } = site;
  if (giftAccounts.length === 0 && wishlistItems.length === 0) return null;
  const t = await getTranslations("gifts");
  const note = pickText(couple.giftNote, locale) || t("defaultNote");

  return (
    <section id="gifts" aria-labelledby="gifts-heading" className={cn(sectionPadding, "border-t border-rule")}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="gifts-heading">{t("heading")}</SectionHeading>
        <p className="mt-5 max-w-[58ch] text-ink-soft">{note}</p>

        {giftAccounts.length > 0 ? (
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {giftAccounts.map((account) => {
              const accountNote = pickText(account.note, locale);
              return (
                <li key={account.id} className="flex flex-col border border-rule bg-sheet p-6 sm:p-8">
                  <p className="text-base text-ink-soft">{t(`kind.${account.kind}`)}</p>
                  <h3 className="mt-1 font-display text-[1.75rem] leading-tight">{account.provider}</h3>
                  <dl className="mt-6">
                    <dt className="text-sm text-ink-soft">{t("accountName")}</dt>
                    <dd className="text-lg">{account.accountName}</dd>
                  </dl>
                  <p className="mt-5 font-body text-[clamp(1.5rem,3.6vw,1.9rem)] leading-tight font-semibold tracking-[0.06em] break-words [font-variant-numeric:lining-nums_tabular-nums] select-all">
                    {account.accountNumber}
                  </p>
                  {accountNote ? <p className="mt-3 text-base text-ink-soft">{accountNote}</p> : null}
                  <GiftAccountActions number={account.accountNumber} withQr={account.kind === "telebirr"} />
                </li>
              );
            })}
          </ul>
        ) : null}

        {wishlistItems.length > 0 ? (
          <div className="mt-16">
            <h3 className="font-display text-[clamp(1.75rem,3.5vw,2.25rem)]">{t("wishlist")}</h3>
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {wishlistItems.map((item) => {
                const title = pickText(item.title, locale);
                return (
                  <li key={item.id} className="flex flex-wrap items-center gap-x-5 gap-y-3 py-5">
                    {item.imageUrl ? (
                      <div className="relative size-16 shrink-0 overflow-hidden bg-rule">
                        <WeddingImage src={item.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="text-xl leading-snug">{title}</p>
                      {item.price ? <p className="text-base text-ink-soft">{item.price}</p> : null}
                    </div>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className={buttonOutline}>
                        {t("viewItem")}
                        <ExternalLink aria-hidden className="size-4" />
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
