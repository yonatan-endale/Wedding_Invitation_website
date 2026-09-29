import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatCalendarDate } from "@/lib/wedding-format";
import { SectionHeading, WeddingImage, sectionPadding } from "../../primitives";
import { eyebrow } from "./shared";

type Props = { site: SiteData; locale: Locale };

/** Dated chapters alternating text and photo. Without chapters, the story text stands alone. */
export async function EditorialStory({ site, locale }: Props) {
  const { milestones, couple } = site;
  const story = pickText(couple.story, locale);
  if (milestones.length === 0 && !story) return null;
  const t = await getTranslations("story");
  const paragraphs = story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="story" aria-labelledby="story-heading" className={sectionPadding}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="story-heading" className="text-center">
          {t("heading")}
        </SectionHeading>

        {paragraphs.length > 0 ? (
          <div className="mx-auto mt-10 max-w-[62ch] space-y-6 text-center">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className={cn("whitespace-pre-line", index === 0 && "text-[1.2em] leading-[1.55]")}>
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        {milestones.length > 0 ? (
          <ol className="mt-14 space-y-8 sm:space-y-10">
            {milestones.map((milestone, index) => {
              const body = pickText(milestone.body, locale);
              const flip = index % 2 === 1;
              return (
                <li key={milestone.id} className={cn("grid overflow-hidden border border-rule", milestone.imageUrl && "md:grid-cols-2")}>
                  <div className={cn("bg-sheet px-8 py-10 sm:px-12 sm:py-14", flip && "md:order-2")}>
                    <p className={eyebrow}>
                      <time dateTime={milestone.happenedOn}>{formatCalendarDate(milestone.happenedOn, locale)}</time>
                    </p>
                    <h3 className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight">
                      {pickText(milestone.title, locale)}
                    </h3>
                    {body ? <p className="mt-5 max-w-[48ch] text-base whitespace-pre-line sm:text-lg">{body}</p> : null}
                  </div>
                  {milestone.imageUrl ? (
                    <div className="relative aspect-[4/3] bg-rule md:aspect-auto md:min-h-[320px]">
                      <WeddingImage
                        src={milestone.imageUrl}
                        alt={pickText(milestone.title, locale)}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
