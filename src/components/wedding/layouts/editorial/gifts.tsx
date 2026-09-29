import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { GiftAccountActions } from "../../gift-account-actions";
import { SectionHeading, WeddingImage, buttonOutline, sectionPadding } from "../../primitives";
import { eyebrow } from "./shared";

type Props = { site: SiteData; locale: Locale };

function columns(count: number) {
  if (count === 1) return "max-w-md";
  if (count === 2) return "max-w-3xl md:grid-cols-2";
  return "md:grid-cols-2 lg:grid-cols-3";
}

/** Gift accounts as a row of cards, then the wishlist as a grid. */
export async function EditorialGifts({ site, locale }: Props) {
  const { giftAccounts, wishlistItems, couple } = site;
  if (giftAccounts.length === 0 && wishlistItems.length === 0) return null;
  const t = await getTranslations("gifts");
  const note = pickText(couple.giftNote, locale) || t("defaultNote");

  return (
    <section id="gifts" aria-labelledby="gifts-heading" className={cn(sectionPadding, "border-t border-rule")}>
      <div className="mx-auto max-w-6xl text-center">
        <SectionHeading id="gifts-heading" className="text-center">
          {t("heading")}
        </SectionHeading>
        <p className="mx-auto mt-5 max-w-[58ch] text-ink-soft">{note}</p>

        {giftAccounts.length > 0 ? (
          <ul className={cn("mx-auto mt-12 grid gap-6 text-left", columns(giftAccounts.length))}>
            {giftAccounts.map((account) => {
              const accountNote = pickText(account.note, locale);
              return (
                <li key={account.id} className="flex flex-col border border-rule bg-sheet p-6 sm:p-8">
                  <p className={eyebrow}>{t(`kind.${account.kind}`)}</p>
                  <h3 className="mt-2 font-display text-[1.75rem] leading-tight">{account.provider}</h3>
                  <dl className="mt-5">
                    <dt className="text-sm text-ink-soft">{t("accountName")}</dt>
                    <dd className="text-lg">{account.accountName}</dd>
                  </dl>
                  <p className="mt-4 font-body text-[clamp(1.35rem,3vw,1.7rem)] leading-tight font-semibold tracking-[0.06em] break-words [font-variant-numeric:lining-nums_tabular-nums] select-all">
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
            <ul className={cn("mx-auto mt-8 grid gap-6 text-left", columns(wishlistItems.length))}>
              {wishlistItems.map((item) => {
                const title = pickText(item.title, locale);
                return (
                  <li key={item.id} className="flex flex-col border border-rule bg-sheet">
                    {item.imageUrl ? (
                      <div className="relative aspect-[4/3] overflow-hidden bg-rule">
                        <WeddingImage src={item.imageUrl} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xl leading-snug">{title}</p>
                      {item.price ? <p className="mt-1 text-base text-ink-soft">{item.price}</p> : null}
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn(buttonOutline, "mt-5 self-start")}>
                          {t("viewItem")}
                          <ExternalLink aria-hidden className="size-4" />
                        </a>
                      ) : null}
                    </div>
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
