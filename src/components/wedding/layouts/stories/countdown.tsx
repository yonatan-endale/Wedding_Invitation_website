import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { CountdownSection } from "../../countdown-section";
import { StoryCard, darkGround } from "./card";
import styles from "./stories.module.css";

type Props = { site: SiteData; locale: Locale };

/*
 * A colour story, like the gradient grounds of a text story: glows of the
 * theme's threads and metal in the corners, over the threads deepened toward
 * black in the middle, where the white type sits, so it keeps 4.5:1 on every
 * theme. Inline, so a browser without color-mix keeps the near-black ground.
 */
export const COLOUR_STORY: CSSProperties = {
  backgroundImage: [
    "radial-gradient(85% 55% at 0% 0%, color-mix(in oklab, var(--w-thread-1) 75%, transparent), transparent 70%)",
    "radial-gradient(60% 40% at 100% 8%, color-mix(in oklab, var(--w-metal) 38%, transparent), transparent 70%)",
    "radial-gradient(75% 50% at 100% 100%, color-mix(in oklab, var(--w-thread-3) 60%, transparent), transparent 70%)",
    "linear-gradient(170deg, color-mix(in oklab, var(--w-thread-1) 50%, #0d0b0b), color-mix(in oklab, var(--w-thread-3) 38%, #0d0b0b))",
  ].join(", "),
};

/** A soft light behind the sticker. */
const HALO: CSSProperties = {
  backgroundImage: "radial-gradient(55% 40% at 50% 48%, rgb(255 255 255 / 0.16), transparent 70%)",
};

/**
 * The shared live countdown, dressed as a countdown sticker: a white card
 * with the title and the rolling digits, floating on a colour story, with
 * the date beneath.
 */
export async function StoriesCountdown({ site, locale }: Props) {
  const t = await getTranslations("countdown");
  const { couple } = site;

  return (
    <StoryCard as="div" hash="save-the-date" tone="dark" className={darkGround} style={COLOUR_STORY}>
      <span aria-hidden className="absolute inset-0 -z-10" style={HALO} />
      <div className="flex flex-1 flex-col items-center justify-center px-5 pt-14 pb-12">
        <div
          data-reveal="pop"
          className={cn(
            styles.sticker,
            "w-full max-w-[23rem] rounded-[1.75rem] bg-sheet pt-6 text-ink shadow-[0_28px_60px_-24px_rgb(0_0_0/0.6)]",
          )}
        >
          <p className="px-5 text-center font-sans text-xs font-semibold tracking-[0.24em] text-thread-1 uppercase [&:lang(am)]:text-sm [&:lang(am)]:tracking-normal [&:lang(am)]:normal-case">
            {t("heading")}
          </p>
          <CountdownSection site={site} variant="plain" tone="ink" className="px-3 pt-3 pb-6 sm:pt-3 sm:pb-6" />
        </div>
        <p data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="mt-8 text-center text-[1.05rem] text-white">
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
      </div>
    </StoryCard>
  );
}
