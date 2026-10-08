import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { RsvpSection } from "../../rsvp";
import { ArchOutline } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

/**
 * The shared RSVP section set inside an arch-topped sheet panel with a gold
 * outline. The section keeps its own id, heading and form; only its band
 * colour and top rule give way to the panel. Its own top padding already
 * clears the arch's shoulders for the heading and intro.
 */
export function ArchesRsvp({ site, locale }: Props) {
  if (!site.couple.rsvpEnabled) return null;
  return (
    <div className="px-4 pt-10 pb-20 sm:px-8 sm:pt-16 sm:pb-28">
      <div className="relative mx-auto max-w-[44rem] rounded-t-[999rem] bg-sheet [&>section]:border-t-0 [&>section]:bg-transparent [&>section]:px-7 [&>section]:pt-24 sm:[&>section]:px-8 sm:[&>section]:pt-32">
        <ArchOutline inset={8} />
        <RsvpSection site={site} locale={locale} />
      </div>
    </div>
  );
}
