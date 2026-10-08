import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatCalendarDate } from "@/lib/wedding-format";
import { WeddingImage, eyebrowClass } from "../../primitives";
import { Scrims, StoryCard, darkGround, pill } from "./card";
import { storyParagraphs } from "./plan";

type Props = { site: SiteData; locale: Locale };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * The couple's story: the text, when they wrote one, on a card of its own,
 * then each dated milestone as a story. A milestone with a photo fills the
 * card with it (tap to step on), its words on a dark panel at the foot; one
 * without is a text story on the paper.
 */
export async function StoriesStory({ site, locale }: Props) {
  const { milestones, couple } = site;
  const paragraphs = storyParagraphs(pickText(couple.story, locale));
  if (milestones.length === 0 && paragraphs.length === 0) return null;
  const t = await getTranslations("story");
  const titleOnPhoto = paragraphs.length === 0 && Boolean(milestones[0]?.imageUrl);

  const heading = (
    <h2
      id="story-heading"
      data-reveal="pop"
      className={cn(
        pill,
        "px-4 py-2 text-base",
        titleOnPhoto ? "bg-white text-[#141210]" : "bg-thread-1 text-on-thread-1",
      )}
    >
      {t("heading")}
    </h2>
  );

  return (
    <>
      {paragraphs.length > 0 ? (
        <StoryCard id="story" tone="light" labelledBy="story-heading" className="bg-sheet text-ink">
          <div data-reveal-group className="flex flex-1 flex-col items-center justify-center px-6 pt-14 pb-12 text-center">
            {heading}
            <div className="mt-8 max-w-[36ch] space-y-5">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  data-reveal="up"
                  style={order(Math.min(index + 1, 6))}
                  className={cn("whitespace-pre-line", index === 0 && "font-display text-[clamp(1.3rem,6.4cqi,1.6rem)] leading-snug")}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </StoryCard>
      ) : null}

      {milestones.map((milestone, index) => {
        const opening = index === 0 && paragraphs.length === 0;
        const title = pickText(milestone.title, locale);
        const body = pickText(milestone.body, locale);
        const when = <time dateTime={milestone.happenedOn}>{formatCalendarDate(milestone.happenedOn, locale)}</time>;
        const shared = {
          as: opening ? ("section" as const) : ("div" as const),
          id: opening ? "story" : undefined,
          hash: "story",
          labelledBy: opening ? "story-heading" : undefined,
        };

        if (milestone.imageUrl) {
          return (
            <StoryCard key={milestone.id} {...shared} tone="dark" tap className={darkGround}>
              <WeddingImage src={milestone.imageUrl} alt={title} fill sizes="(min-width: 48rem) 34rem, 100vw" className="-z-20 object-cover" />
              <Scrims foot="h-[55%]" />
              {opening ? <div className="px-4 pt-9">{heading}</div> : null}
              <div data-reveal-group className="mt-auto px-4 pt-10 pb-6">
                <div data-reveal="up" className="rounded-[1.5rem] bg-black/45 px-5 py-5 backdrop-blur-md">
                  <p className={cn(eyebrowClass, "text-white/80")}>{when}</p>
                  <h3 className="mt-2 font-display text-[clamp(1.6rem,8cqi,2.1rem)] leading-tight">{title}</h3>
                  {body ? <p className="mt-2 text-base whitespace-pre-line text-white/90">{body}</p> : null}
                </div>
              </div>
            </StoryCard>
          );
        }

        return (
          <StoryCard key={milestone.id} {...shared} tone="light" className="bg-paper text-ink">
            <div data-reveal-group className="flex flex-1 flex-col items-center justify-center px-6 pt-14 pb-12 text-center">
              {opening ? <div className="mb-8">{heading}</div> : null}
              <p data-reveal="pop" style={order(1)} className={cn(pill, "border border-rule bg-sheet px-4 py-1.5 text-ink-soft")}>
                {when}
              </p>
              <h3
                data-reveal="up"
                style={order(2)}
                className="mt-5 font-display text-[clamp(2rem,10.5cqi,2.8rem)] leading-[1.08] [&:lang(am)]:text-[clamp(1.7rem,8.6cqi,2.35rem)] [&:lang(am)]:leading-[1.3]"
              >
                {title}
              </h3>
              {body ? (
                <p data-reveal="up" style={order(3)} className="mt-5 max-w-[36ch] whitespace-pre-line">
                  {body}
                </p>
              ) : null}
            </div>
          </StoryCard>
        );
      })}
    </>
  );
}
