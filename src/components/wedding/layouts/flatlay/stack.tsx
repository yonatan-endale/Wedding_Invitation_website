import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "../../gallery";
import { GiftsSection } from "../../gifts";
import { RsvpSection } from "../../rsvp";
import { SaveTheDate } from "../../save-the-date";
import type { SiteNames } from "../types";
import { DetailsCardFace, InvitationCardFace, ScheduleCardFace } from "./cards";
import styles from "./flatlay.module.css";
import { StackHeights } from "./stack-heights";

type Props = { site: SiteData; locale: Locale; names: SiteNames; photos: GalleryPhoto[] };

type Card = {
  key: string;
  /** The header link's target, placed in the flow just above the card. Shared sections bring their own id. */
  anchor?: string;
  /**
   * Held cards stay pinned while the next one slides over them. The RSVP and
   * gifts cards are tall and full of controls, so they pass straight over
   * the stack instead; their sections carry their own ids.
   */
  hold: boolean;
  /** Width cap and turn, so the suite reads as cards of different sizes laid by hand. */
  width: string;
  turn: number;
  /** The card's drop shadow comes from its parent when its edge is deckled. */
  deckled?: boolean;
  node: ReactNode;
};

/**
 * The suite: the invitation, the save-the-date, the day, the details, the
 * reply card and the gifts card, one after another down the linen. The first
 * four are held under the header in a loose pile, each a little lower than
 * the last, and every new card slides over the one before.
 */
export function FlatlayStack({ site, locale, names, photos }: Props) {
  const { couple, events, venues, giftAccounts, wishlistItems } = site;

  const cards: Card[] = [
    {
      key: "invitation",
      anchor: "invitation",
      hold: true,
      width: "36rem",
      turn: -0.7,
      deckled: true,
      node: <InvitationCardFace site={site} locale={locale} />,
    },
    {
      key: "save-the-date",
      hold: true,
      width: "38rem",
      turn: 0.6,
      node: (
        <div className={styles.cut}>
          <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="card" showPhoto={false} />
        </div>
      ),
    },
  ];
  if (events.length > 0) {
    cards.push({ key: "schedule", anchor: "schedule", hold: true, width: "40rem", turn: -0.45, node: <ScheduleCardFace site={site} locale={locale} /> });
  }
  if (venues.length > 0) {
    cards.push({ key: "venues", anchor: "venues", hold: true, width: "44rem", turn: 0.8, node: <DetailsCardFace site={site} locale={locale} /> });
  }
  if (couple.rsvpEnabled) {
    cards.push({
      key: "rsvp",
      hold: false,
      width: "38rem",
      turn: -0.5,
      deckled: true,
      node: (
        <div className={cn(styles.sheet, styles.deckle, styles.inset)}>
          <RsvpSection site={site} locale={locale} />
        </div>
      ),
    });
  }
  if (giftAccounts.length > 0 || wishlistItems.length > 0) {
    cards.push({
      key: "gifts",
      hold: false,
      width: "54rem",
      turn: 0.35,
      node: (
        <div className={cn(styles.sheet, styles.cut, styles.inset, styles.gifts)}>
          <GiftsSection site={site} locale={locale} />
        </div>
      ),
    });
  }

  return (
    <div className={styles.stack}>
      <StackHeights />
      {cards.map((card, index) => {
        const next = cards[index + 1];
        const previous = cards[index - 1];
        // Two passing cards in a row overlap, the later one tucked under the earlier one's foot.
        const tucked = !card.hold && previous !== undefined && !previous.hold;
        const vars = {
          "--i": index,
          "--r": card.turn,
          "--cw": card.width,
          "--tl": `--fl-${index}`,
          ...(next && card.hold ? { "--next": `--fl-${index + 1}` } : {}),
        } as CSSProperties;
        return (
          <Fragment key={card.key}>
            <span id={card.anchor} className={cn(styles.anchor, tucked && styles.tuck)} style={{ "--i": index } as CSSProperties} />
            <div
              data-hold={card.hold || undefined}
              data-next={next && card.hold ? "" : undefined}
              className={cn(
                styles.card,
                card.hold && styles.hold,
                card.deckled && styles.deckleShadow,
                !card.hold && (tucked ? styles.under : styles.over),
              )}
              style={vars}
            >
              {card.node}
              {next && card.hold ? <span aria-hidden className={styles.shade} /> : null}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
