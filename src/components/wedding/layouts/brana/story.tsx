import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatCalendarDate } from "@/lib/wedding-format";
import { WeddingImage } from "../../primitives";
import styles from "./brana.module.css";
import { scriptLang } from "./names";
import { BranaHeading, GeezNumeral, Headpiece, MiniatureFrame, SectionMark, order } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

/** Past this many characters the story text reads well in two ruled columns on wide screens. */
const TWO_COLUMNS = 600;

/**
 * The couple's story as the chapters of the book. Their story text opens it
 * (its first paragraph a little larger, and in two ruled columns on wide
 * screens when it runs long); then each dated milestone is a chapter,
 * numbered ፩ ፪ ፫ in a red rubric line, with its title in black ink, its date,
 * its words and, if it has one, a small framed miniature. Renders nothing
 * when there is neither story text nor a milestone.
 */
export async function BranaChapters({ site, locale }: Props) {
  const { milestones, couple } = site;
  const story = pickText(couple.story, locale);
  if (!story && milestones.length === 0) return null;
  const t = await getTranslations("story");
  const tb = await getTranslations("layouts.brana");
  const paragraphs = story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const long = story.length > TWO_COLUMNS;

  return (
    <section id="story" aria-labelledby="story-heading" className="px-4 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Headpiece className="mx-[18px]" />
        <BranaHeading id="story-heading" className="mt-12">
          {t("heading")}
        </BranaHeading>

        {paragraphs.length > 0 ? (
          <div data-reveal-group className={cn("mx-auto mt-10", long ? cn(styles.columns, "md:columns-2 md:gap-12") : "max-w-[62ch]")}>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                data-reveal="up"
                style={order(Math.min(index, 4))}
                lang={scriptLang(paragraph)}
                className={cn("mb-5 whitespace-pre-line", index === 0 && "font-cormorant text-[1.35em] leading-[1.45] font-medium")}
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        {milestones.length > 0 ? (
          <ol className="mt-12">
            {milestones.map((milestone, index) => {
              const title = pickText(milestone.title, locale);
              const body = pickText(milestone.body, locale);
              return (
                <li key={milestone.id} data-reveal-group className={cn("py-10", index > 0 && "border-t border-(--brana-rule)")}>
                  <div className="text-center">
                    <p data-reveal="fade" className={cn(styles.chapterLabel, "text-sm ethiopic:text-base")}>
                      {tb("chapter")} <GeezNumeral value={index + 1} className="ml-1 text-[1.5em] tracking-normal" />
                    </p>
                    <h3
                      data-reveal="up"
                      style={order(1)}
                      lang={scriptLang(title)}
                      className="mt-3 font-cormorant text-[clamp(1.75rem,4vw,2.4rem)] leading-tight font-medium ethiopic:text-[clamp(1.45rem,3.4vw,1.9rem)] ethiopic:leading-snug"
                    >
                      {title}
                    </h3>
                    <p data-reveal="up" style={order(2)} className="mt-2 text-base text-ink-soft">
                      <time dateTime={milestone.happenedOn}>{formatCalendarDate(milestone.happenedOn, locale)}</time>
                    </p>
                  </div>
                  {milestone.imageUrl || body ? (
                    <div data-reveal="up" style={order(3)} className={cn("mt-7", milestone.imageUrl && "sm:flow-root")}>
                      {milestone.imageUrl ? (
                        <MiniatureFrame
                          className={cn("mx-auto mb-6 w-[min(70%,15rem)] sm:mb-3 sm:ml-8 sm:w-[13rem]", "sm:float-right")}
                          windowClassName="aspect-[4/5]"
                        >
                          <WeddingImage src={milestone.imageUrl} alt={title} fill sizes="(min-width: 640px) 13rem, 70vw" className="object-cover" />
                        </MiniatureFrame>
                      ) : null}
                      {body ? (
                        <p lang={scriptLang(body)} className="whitespace-pre-line">
                          {body}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : null}
        <div className="mt-6 text-center">
          <SectionMark />
        </div>
      </div>
    </section>
  );
}
