"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { LAYOUTS } from "@/lib/layout";
import type { OpeningName } from "@/lib/opening";
import { posterSrc, previewHref, type ShowcaseDesign } from "@/lib/showcase";
import type { ThemeName } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** The frame's screen, in CSS pixels. The site inside is laid out at phone width and scaled to fit. */
const SCREEN = { width: 290, height: 600 };
const PHONE = { width: 390, height: Math.round((600 * 390) / 290) };

/**
 * One design: a phone showing the demo site on the left, the explanation on the
 * right. The phone starts as a small picture and loads the live site only when
 * the visitor asks, so the page stays light. Choosing another colour or opening
 * loads the site with that look.
 */
export function DesignCard({ design, first = false }: { design: ShowcaseDesign; first?: boolean }) {
  const t = useTranslations("showcase");
  const [theme, setTheme] = useState<ThemeName>(design.defaultTheme);
  const [opening, setOpening] = useState<OpeningName>(design.defaultOpening);
  const [live, setLive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  const name = LAYOUTS[design.layout].label;
  const text = (field: string) => t(`layouts.${design.layout}.${field}`);
  const src = previewHref(design, { theme, opening });

  function choose<T>(set: (value: T) => void, value: T) {
    set(value);
    setLoaded(false);
    setLive(true);
  }

  return (
    <article
      id={design.layout}
      aria-labelledby={`${design.layout}-name`}
      className="grid scroll-mt-24 gap-8 border-t border-rule py-14 lg:grid-cols-[minmax(0,19.5rem)_1fr] lg:gap-14"
    >
      <div className="mx-auto w-full max-w-[19.5rem]">
        <div className="rounded-[2.4rem] bg-ink p-[10px] shadow-[0_24px_50px_-24px_rgb(0_0_0/0.5)]">
          <div
            className="relative overflow-hidden rounded-[1.9rem] bg-paper"
            style={{ width: SCREEN.width, height: SCREEN.height }}
          >
            {live ? (
              <>
                <iframe
                  key={src}
                  src={src}
                  title={t("phoneTitle", { name })}
                  onLoad={() => setLoaded(true)}
                  className="absolute top-0 left-0 origin-top-left border-0"
                  style={{ width: PHONE.width, height: PHONE.height, transform: `scale(${SCREEN.width / PHONE.width})` }}
                />
                {loaded ? null : (
                  <p
                    role="status"
                    className="absolute inset-0 grid place-items-center bg-paper px-6 text-center text-sm text-ink-soft"
                  >
                    {t("loading")}
                  </p>
                )}
              </>
            ) : (
              <>
                {posterFailed ? (
                  <div aria-hidden className="absolute inset-0 bg-sheet" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- a small prebuilt WebP; the optimizer would add nothing
                  <img
                    src={posterSrc(design.layout)}
                    alt={t("posterAlt", { name })}
                    width={SCREEN.width}
                    height={SCREEN.height}
                    loading={first ? "eager" : "lazy"}
                    fetchPriority={first ? "high" : "auto"}
                    onError={() => setPosterFailed(true)}
                    className="size-full object-cover object-top"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setLive(true)}
                  className="absolute inset-x-6 bottom-6 inline-flex min-h-12 items-center justify-center rounded-[3px] bg-thread-1 px-5 text-base font-medium text-on-thread-1 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {t("tryIt")}
                </button>
              </>
            )}
          </div>
        </div>
        {live ? (
          <button
            type="button"
            onClick={() => {
              setLive(false);
              setLoaded(false);
            }}
            className="mt-3 w-full text-center text-sm text-ink-soft underline underline-offset-4"
          >
            {t("backToPicture")}
          </button>
        ) : null}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-ink-soft">{t(`kinds.${design.kind}`)}</p>
        <h2 id={`${design.layout}-name`} className="mt-1 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight">
          {name}
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg">{text("feel")}</p>

        <dl className="mt-6 grid max-w-xl gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink-soft">{t("mood")}</dt>
            <dd className="mt-1">{text("mood")}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-soft">{t("goodFor")}</dt>
            <dd className="mt-1">{text("goodFor")}</dd>
          </div>
        </dl>

        <h3 className="mt-8 text-sm text-ink-soft">{t("highlights")}</h3>
        <ul className="mt-2 grid max-w-xl gap-2">
          {["b1", "b2", "b3"].map((field) => (
            <li key={field} className="flex gap-3">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-metal" />
              <span>{text(field)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid max-w-xl gap-5">
          <div role="group" aria-label={t("coloursNote")}>
            <p className="text-sm text-ink-soft">{t("colours")}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {design.themes.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  aria-pressed={theme === option.name}
                  aria-label={option.label}
                  title={option.label}
                  onClick={() => choose(setTheme, option.name)}
                  className={cn(
                    "flex size-11 overflow-hidden rounded-full border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                    theme === option.name ? "border-ink" : "border-rule",
                  )}
                >
                  <span className="flex-1" style={{ backgroundColor: option.colors.paper }} />
                  <span className="flex-1" style={{ backgroundColor: option.colors.thread1 }} />
                  <span className="flex-1" style={{ backgroundColor: option.colors.metal }} />
                </button>
              ))}
            </div>
          </div>

          <div role="group" aria-label={t("openingNote")}>
            <p className="text-sm text-ink-soft">{t("opening")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {design.openings.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={opening === option}
                  onClick={() => choose(setOpening, option)}
                  className={cn(
                    "min-h-11 rounded-[3px] border px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                    opening === option ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink",
                  )}
                >
                  {t(`openings.${option}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <a
          href={`/?design=${design.layout}#ask`}
          className="mt-8 inline-flex min-h-12 items-center rounded-[3px] bg-thread-1 px-6 text-base font-medium text-on-thread-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {t("ask")}
        </a>
      </div>
    </article>
  );
}
