import { LogOut } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { lockPortal } from "@/actions/couple-portal";
import type { CoupleRsvp } from "@/db/queries/couple-portal";
import type { Locale } from "@/lib/localized";
import { formatEthiopianDateLine, formatGregorianDate } from "@/lib/wedding-format";
import { GuestCardActions } from "./guest-card-actions";
import { WishToggle } from "./wish-toggle";

type Props = {
  slug: string;
  rows: CoupleRsvp[];
  coupleNames: string;
  timezone: string;
  siteBase: string;
  locale: Locale;
  cardsEnabled: boolean;
};

/** The couple's private page: how many are coming, the wishes guests left, and every guest with their card. */
export async function CoupleDashboard({ slug, rows, coupleNames, timezone, siteBase, locale, cardsEnabled }: Props) {
  const t = await getTranslations("couplePortal");
  const received = (date: Date) =>
    locale === "am" ? formatEthiopianDateLine(date.toISOString(), timezone) : formatGregorianDate(date.toISOString(), timezone);

  const coming = rows.filter((r) => r.attending);
  const stats = [
    { label: t("stats.responses"), value: rows.length },
    { label: t("stats.coming"), value: coming.reduce((sum, r) => sum + r.guestCount, 0) },
    { label: t("stats.declined"), value: rows.length - coming.length },
  ];
  const wishes = rows.filter((r) => r.message?.trim());
  const shown = wishes.filter((r) => !r.hiddenAt);
  const hidden = wishes.filter((r) => r.hiddenAt);

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight">{t("title")}</h1>
          <p className="mt-1 text-ink-soft">{coupleNames}</p>
        </div>
        <form action={lockPortal.bind(null, slug)}>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-rule px-4 text-sm text-ink-soft hover:border-ink/40 hover:text-ink"
          >
            <LogOut className="size-4" aria-hidden /> {t("signOut")}
          </button>
        </form>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[3px] border border-rule bg-sheet px-4 py-4 text-center">
            <dt className="text-sm text-ink-soft">{stat.label}</dt>
            <dd className="mt-1 font-display text-[clamp(1.75rem,5vw,2.5rem)] leading-none tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="wishes-heading" className="mt-14">
        <h2 id="wishes-heading" className="font-display text-[clamp(1.6rem,4vw,2.25rem)]">
          {t("wishesHeading")}
        </h2>
        {shown.length === 0 ? (
          <p className="mt-4 text-ink-soft">{t("noWishes")}</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {shown.map((wish) => (
              <li key={wish.id} className="flex flex-col rounded-[3px] border border-rule bg-sheet p-5">
                <p className="flex-1 whitespace-pre-line">{wish.message}</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-rule pt-3">
                  <p className="text-sm text-ink-soft">
                    <span className="text-ink">{wish.name}</span> · {received(wish.createdAt)}
                  </p>
                  <WishToggle slug={slug} rsvpId={wish.id} hidden={false} />
                </div>
              </li>
            ))}
          </ul>
        )}
        {hidden.length > 0 ? (
          <details className="mt-6">
            <summary className="cursor-pointer text-ink-soft">{t("hiddenHeading", { count: hidden.length })}</summary>
            <ul className="mt-4 grid gap-3">
              {hidden.map((wish) => (
                <li key={wish.id} className="flex items-start justify-between gap-3 rounded-[3px] border border-dashed border-rule p-4 text-ink-soft">
                  <p className="whitespace-pre-line">
                    {wish.message} <span className="text-sm">— {wish.name}</span>
                  </p>
                  <WishToggle slug={slug} rsvpId={wish.id} hidden />
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      <section aria-labelledby="guests-heading" className="mt-14">
        <h2 id="guests-heading" className="font-display text-[clamp(1.6rem,4vw,2.25rem)]">
          {t("guestsHeading")}
        </h2>
        {rows.length === 0 ? (
          <p className="mt-4 text-ink-soft">{t("noGuests")}</p>
        ) : (
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {rows.map((row) => (
              <li key={row.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="text-lg break-words">{row.name}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    <a href={`tel:${row.phone.replace(/\s+/g, "")}`} className="tabular-nums underline-offset-4 hover:underline">
                      {row.phone}
                    </a>
                    {" · "}
                    <span className={row.attending ? "text-thread-1" : undefined}>
                      {row.attending ? t("coming") : t("notComing")}
                    </span>
                    {row.attending ? ` · ${t("guestCount")}: ${row.guestCount}` : null}
                  </p>
                </div>
                {row.attending && cardsEnabled ? (
                  <GuestCardActions siteBase={siteBase} token={row.cardToken} phone={row.phone} coupleNames={coupleNames} />
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
