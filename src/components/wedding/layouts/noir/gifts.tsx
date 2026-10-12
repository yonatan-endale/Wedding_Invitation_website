import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData, SiteGiftAccount } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { GiftAccountActions } from "../../gift-account-actions";
import { FoilText } from "../../kit/foil-text";
import { WeddingImage, buttonOutline } from "../../primitives";
import type { SiteNames } from "../types";
import styles from "./noir.module.css";
import { GoldRule, NoirHeading, noirEyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

const order = (index: number) => ({ "--i": Math.min(index, 6) }) as CSSProperties;

/*
 * Black metal: a fixed charcoal whatever the theme, brushed, lit from the
 * top left with a warm glint of the theme's gold at the opposite corner.
 * Inline so that, without color-mix, the browser drops the gradients and
 * keeps the plain charcoal.
 */
const METAL: CSSProperties = {
  backgroundColor: "#111113",
  backgroundImage: [
    "radial-gradient(120% 85% at 0% 0%, rgb(255 255 255 / 0.11), transparent 52%)",
    "radial-gradient(80% 70% at 100% 100%, color-mix(in oklab, var(--w-metal) 16%, transparent), transparent 62%)",
    "repeating-linear-gradient(112deg, rgb(255 255 255 / 0.02) 0 1px, transparent 1px 4px)",
    "linear-gradient(135deg, #1e1e21 0%, #0c0c0d 46%, #19191b 72%, #08080a 100%)",
  ].join(", "),
  boxShadow:
    "inset 0 1px 0 rgb(255 255 255 / 0.12), inset 0 0 0 1px rgb(255 255 255 / 0.07), 0 34px 60px -34px rgb(0 0 0 / 0.95)",
};

/** The chip, in a gradient of the theme's gold. */
function Chip({ id }: { id: string }) {
  const gradient = `${id}-chip`;
  return (
    <svg aria-hidden viewBox="0 0 46 36" className="h-auto w-[clamp(2.4rem,9vw,2.9rem)] text-metal">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" style={{ stopColor: "color-mix(in oklab, var(--w-metal), white 40%)" }} />
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" style={{ stopColor: "color-mix(in oklab, var(--w-metal), black 30%)" }} />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="45" height="35" rx="6" fill={`url(#${gradient})`} />
      <g fill="none" stroke="rgb(0 0 0 / 0.38)" strokeWidth="0.9">
        <path d="M0.5 12.5H15M0.5 23.5H15M31 12.5H45.5M31 23.5H45.5M15 0.5V35.5M31 0.5V35.5" />
        <rect x="15" y="8" width="16" height="20" rx="3.5" />
      </g>
    </svg>
  );
}

/**
 * One account as a premium card: provider and kind on top, the gold chip,
 * the number set large in a monospace with tabular figures, the holder's
 * name and the couple's initials in foil. Copy and QR stay below the card.
 */
function GiftCard({ account, label, kind, initials }: { account: SiteGiftAccount; label: { name: string; number: string }; kind: string; initials: string }) {
  return (
    <div
      className={cn(
        styles.card,
        "relative isolate flex aspect-[1.586] flex-col overflow-hidden rounded-[14px] p-[clamp(1.15rem,4.6vw,1.6rem)] text-left text-ink",
      )}
      style={METAL}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[clamp(1.2rem,4vw,1.55rem)] leading-[1.15]">{account.provider}</h3>
        <p className={cn(noirEyebrow, "shrink-0 pt-1 text-[0.68rem] tracking-[0.24em]")}>{kind}</p>
      </div>
      <div className="mt-3 mb-5">
        <Chip id={`noir-${account.id}`} />
      </div>
      <dl className="mt-auto">
        <div>
          <dt className="sr-only">{label.number}</dt>
          <dd className="font-mono text-[clamp(1.1rem,4.8vw,1.5rem)] leading-tight tracking-[0.12em] break-words text-ink [font-variant-numeric:lining-nums_tabular-nums] [text-shadow:0_1px_0_rgb(0_0_0/0.9)] select-all">
            {account.accountNumber}
          </dd>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <dt className={cn(noirEyebrow, "text-[0.62rem] text-ink-soft")}>{label.name}</dt>
            <dd className="mt-0.5 text-[0.95rem] break-words tracking-[0.08em] uppercase [&:lang(am)]:tracking-normal [&:lang(am)]:normal-case">
              {account.accountName}
            </dd>
          </div>
          <FoilText aria-hidden sheen={false} className="shrink-0 font-cormorant text-[1.6rem] leading-none italic">
            {initials}
          </FoilText>
        </div>
      </dl>
    </div>
  );
}

function columns(count: number) {
  if (count === 1) return "max-w-md";
  return "max-w-4xl md:grid-cols-2";
}

/**
 * Gifts as black-metal cards, each with the shared copy and QR buttons
 * underneath, then the wishlist as a list between gold rules.
 */
export async function NoirGifts({ site, locale, names }: Props) {
  const { giftAccounts, wishlistItems, couple } = site;
  if (giftAccounts.length === 0 && wishlistItems.length === 0) return null;
  const t = await getTranslations("gifts");
  const tn = await getTranslations("layouts.noir");
  const note = pickText(couple.giftNote, locale) || t("defaultNote");
  const initials = names.initials.filter(Boolean).join(locale === "am" ? "፡" : "&");
  const label = { name: t("accountName"), number: tn("accountNumber") };

  return (
    <section id="gifts" aria-labelledby="gifts-heading" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <NoirHeading id="gifts-heading">{t("heading")}</NoirHeading>
        <p data-reveal="up" className="mx-auto mt-8 max-w-[54ch] text-center text-ink-soft">
          {note}
        </p>

        {giftAccounts.length > 0 ? (
          <ul data-reveal-group className={cn("mx-auto mt-16 grid items-start gap-x-10 gap-y-14", columns(giftAccounts.length))}>
            {giftAccounts.map((account, index) => {
              const accountNote = pickText(account.note, locale);
              return (
                // A plain block, so the copy and QR buttons sit right under their card even when a QR code opens beside it.
                <li key={account.id} data-reveal="up" style={order(index)}>
                  <GiftCard account={account} label={label} kind={t(`kind.${account.kind}`)} initials={initials} />
                  {accountNote ? <p className="mt-4 text-base text-ink-soft">{accountNote}</p> : null}
                  <GiftAccountActions number={account.accountNumber} withQr={account.kind === "telebirr"} />
                </li>
              );
            })}
          </ul>
        ) : null}

        {wishlistItems.length > 0 ? (
          <div className="mt-24">
            <div data-reveal-group className="text-center">
              <h3 data-reveal="up" className="text-[clamp(1.9rem,4vw,2.5rem)] leading-tight">
                {t("wishlist")}
              </h3>
              <GoldRule className="mt-5" index={1} />
            </div>
            <ul data-reveal-group className="mx-auto mt-10 max-w-3xl divide-y divide-rule border-y border-metal/40">
              {wishlistItems.map((item, index) => {
                const title = pickText(item.title, locale);
                return (
                  <li
                    key={item.id}
                    data-reveal="up"
                    style={order(index)}
                    className="flex flex-wrap items-center gap-x-5 gap-y-3 py-6"
                  >
                    {item.imageUrl ? (
                      <div className="relative size-16 shrink-0 overflow-hidden bg-sheet ring-1 ring-metal/50 ring-offset-2 ring-offset-paper">
                        <WeddingImage src={item.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="font-cormorant text-[1.45rem] leading-snug">{title}</p>
                      {item.price ? <p className="text-base text-ink-soft lining-nums">{item.price}</p> : null}
                    </div>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className={cn(buttonOutline, "border-metal/50 hover:border-metal")}>
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
