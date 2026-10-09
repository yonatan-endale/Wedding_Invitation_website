# Cultural review for release

The roadmap's release gate has two parts: a cultural review of the designs, and a
native speaker signing off every Amharic and Ge'ez string. This file tracks the
first; `docs/i18n-review.md` tracks the second.

## The three rules

| Rule | Status | Notes |
|---|---|---|
| Harag interlace has no eye motifs | Pass | Each loop is a diamond with a four-petal flower inside (`src/lib/border-shapes.ts`). |
| Faith imagery appears only when the couple opts in | Pass, with one decided exception | FaithOrnament and the faith-gated event icons show nothing unless the couple picks an ornament (default "none"). See the exception below. |
| No flag stripes | Pass | The share preview's thin rules are all gold now, so green, gold and red never stack as bands. |

## Decisions taken with the site owner (October 2026)

- **The Tibeb border keeps its small equal-armed cross.** It is part of the traditional habesha kemis weave and has been on every site since the start, so it is treated as a woven motif, not a faith ornament. It appears in the default Tibeb border on the site, the guest card, the card and pass pages and the not-found page.
- **The "Harari" faith ornament keeps its name and drawing** (an eight-pointed geometric star; nikah events show a crescent when it is chosen).
- The default English gift note no longer says "bless us"; it now matches the neutral Amharic.

## Left for a human to judge

- The Gilded Arches hero puts sunburst rays and a dotted halo behind the couple's photo, which some guests may read as a nimbus.
- The Stories countdown card is a soft wash from green at the top to red at the bottom with a gold glow; it is a gradient, not stripes.
- The admin placeholder for the verse ("Song of Songs 8:7") and the seed couple's text lean Christian. They are never shown to guests unless a couple keeps them.
