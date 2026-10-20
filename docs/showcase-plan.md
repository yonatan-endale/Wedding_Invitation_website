# Showcase plan: show what we do without real people

**For:** the owner, and whoever designs and builds the showcase pages.
**Goal:** a "Our designs" section where each layout is shown side by side with a plain-language explanation, using only fictional people and non-personal images.

## Status (built)

Decided: the images are **drawn artwork and silhouettes, no faces** (options 1 and 2 combined), and the showcase is its own `/designs` page. Built on branch `feat/showcase`: the artwork (`scripts/make-showcase-art.py`), four fictional demo sites (`public/examples/showcase-*.json`), the per-site **Showcase mode** switch, the pictures (`scripts/make-showcase-posters.ts`), the page and its English and Amharic explanations. See the README section "The designs page". Still open: the contact route behind "Ask for this design", a native-speaker review of the Amharic, and merging the branches.

## Recommendation

Build it **inside the app, from the real layouts**, not as screenshots.

1. Publish a few **fictional demo sites** (one per kind of celebration) with invented names and non-personal images.
2. A new public page, `/designs`, shows each layout as a **phone-framed live preview on the left** and a **description card on the right**. On a phone the preview comes first and the card sits under it.
3. The preview is the real site in an iframe, switched to that layout with the app's existing `?layout=`, `?theme=` and `?opening=` options. When a layout changes in code, the showcase changes with it, so it can never go out of date.
4. A static poster image (taken automatically from the demo) loads first. The live preview starts when the visitor taps "Try it", which keeps the landing page light on slow phones.

Why not just screenshots: they go stale every time a layout changes, they can't show the opening animation or the Ethiopian/Gregorian switch, and each language needs its own set. Screenshots are still used, but only as the poster image.

## The page, side by side

```
┌────────────────────────────┬──────────────────────────────────┐
│                            │  Gilded Arches        [Wedding]  │
│      ┌──────────────┐      │  Ivory and gold. The cover photo │
│      │  phone frame │      │  sits in an arched window ...    │
│      │  live demo   │      │                                  │
│      │  (tap to try)│      │  Mood      Elegant, light        │
│      └──────────────┘      │  Opening   Wax-seal gates        │
│   Theme:  ● ● ● ● ●        │  Best for  Church weddings ...   │
│   Opening: [Seal] [Netela] │  Highlights  ✓ arch photo strip  │
│                            │              ✓ twin arches ...   │
│                            │  [Ask for this design]           │
└────────────────────────────┴──────────────────────────────────┘
```

- **Controls under the phone:** theme dots (the layout's recommended themes) and opening buttons. Visitors can change them and see the result immediately. This is the most persuasive part and costs almost nothing, because the options already exist.
- **Language toggle:** the whole page and the demo switch between English and Amharic together.
- **"Ask for this design"** goes to the landing page's contact route, with the layout name filled in. Contact route is still undecided.
- **Filter chips at the top:** Weddings, Graduations, Birthdays, Christenings. Engagements appears as "coming soon".

## Fictional content (no real people)

**Names:** invented and clearly generic. Suggested set, to be checked by a native speaker so none looks like a real public figure:
- Wedding: *Saron & Eyob*
- Graduation: *Betty and Liya*, two sisters
- Birthday: *Mama Tigist*, turning 60
- Christening: *Baby Selam*

**Images, in order of preference:**
1. **Illustrated or abstract artwork.** Warm duotone illustrations of hands, rings, a jebena and coffee cups, a mesob, adey abeba flowers, church doors, a graduation cap, a cake, textile close-ups. No faces, so no consent issue and it feels intentional rather than missing.
2. **Silhouettes and figures seen from behind** (a couple walking, graduates throwing caps), drawn as vector art or generated.
3. **Licensed stock photos** only if the licence allows commercial use *and* shows no recognisable people, or the people are clearly model-released. Keep the licence text with the file. The current examples use Unsplash photos of people; replace them before the page goes public.
4. **AI-generated images** are a fast way to get full-bleed covers, but check the tool's terms, keep prompts generic, and avoid anything that looks like a real person. Label the page "Example designs with illustrative images".

Whatever is used, **keep image files small** (WebP or AVIF, cover under 150 KB) so the live previews stay fast.

**Everything else is invented too:** the venue ("Example Hall, Addis Ababa"), the phone and bank details ("0000 0000"), the Telegram link, and the gift accounts. No real account number ever goes in a demo.

## What each description card says

Every card has the same fields, so visitors can compare:

| Field | Source |
| --- | --- |
| Name and one-sentence feel | `description` in `src/lib/layout.ts` (rewritten in plain words for the page) |
| Kind of celebration | `eventTypes` |
| Mood | light or dark (`scheme`), plus a few words |
| Opening that suits it | `defaultOpening` |
| Themes that look best | `recommendedThemes` |
| Standout moments | 3 bullets written by hand per layout |
| Good for | a line about the occasion and the family |
| Good to know | for example "always dark", or "needs portraits" |

## The layouts, explained

### Weddings (10)

| Layout | In one line | Mood | Opening | Standout moments | Good for |
| --- | --- | --- | --- | --- | --- |
| **Classic** | A full-screen cover photo and a framed invitation card. | Warm, familiar | Netela | Carousel gallery, framed card, timeline | Families who want the traditional look |
| **Editorial** | A magazine spread: the date in huge numerals, oval portraits. | Light, designed | Envelope | Dated love story, mosaic gallery, portraits | Couples with a story to tell and good portraits |
| **Reel** | A film: opening credits, the couple as stars, the day as scenes. | Dark, cinematic | Wax seal | Letterboxed cover, film-strip gallery, end credits | Couples who love photography and video |
| **Noir & Gold** | Black tie. A gold crest monogram and gold-foil names. | Dark, formal | Wax seal | Gold crest, gallery wall, black-metal gift cards | Evening weddings and formal receptions |
| **Gilded Arches** | Ivory and gold, with the cover photo in an arched window. | Light, elegant | Wax seal | Arch photo strip, twin arches for the couple | Church weddings and garden venues |
| **Stories** | Tap through it like stories on a phone. | Light, playful | Adey bloom | One card at a time, progress bars | Younger couples and guests who live on their phones |
| **Flat-lay Suite** | A stationery suite on linen: envelope, then cards that stack as you scroll. | Light, tactile | Envelope | Stacking cards, fanned photo prints | Couples who care about paper and detail |
| **Kaba Velvet** | A groom's velvet kaba: deep velvet and gold-thread embroidery that stitches itself in. | Always dark, regal | Netela | Stitched timeline, stitched monogram, marks the Mels | Traditional Habesha weddings |
| **Brana Manuscript** | An illuminated Ge'ez manuscript on parchment. | Light, scholarly | Netela | Harag headpieces, red names, Ge'ez numerals, colophon | Couples who love Ethiopian manuscripts and Amharic |
| **Slate** | Clean and modern: a full photo cover with script accents. | Light, modern | Envelope | Boxed countdown, cards for the day, framed photo strip | Modern weddings, destination and diaspora couples |

### Graduations (2)

| Layout | In one line | Standout moments |
| --- | --- | --- |
| **Commencement** | Light and modern; the class year in huge outline numerals behind the names. | A diploma-style card per graduate; photos in named groups ("The two of us") |
| **Tassel** | A deep cover with a laurel wreath of initials hung on a gold cord. | The tassel swings once as the page opens; each graduate in an arch |

### Birthdays (2)

| Layout | In one line | Standout moments |
| --- | --- | --- |
| **Confetti** | The name set huge in a page of confetti in your three colours. | Confetti settles once as the page opens; their line on a ribbon |
| **Milestone** | Elegant, for the big numbers: the age in gold foil on a dark cover. | Reads "60" from the person's own line; shows the name alone without an age |

### Christenings, kristina (1)

| Layout | In one line | Standout moments |
| --- | --- | --- |
| **Shema** | A cover of woven white shema cloth with your border down both edges. | Christening name and godparents on the child's card; a cross only if the family chooses one |

## Openings (shown as the second control under every phone)

- **Netela:** two halves of a netela meet in the middle and part.
- **Wax-seal gates:** ivory doors with a seal that splits as they swing open.
- **Envelope and letter:** the seal pops, the flap folds, the letter rises.
- **Adey abeba bloom:** a Meskel daisy opens its eight petals into a circle that reveals the site.

## Themes (the colour dots)

20 palettes, among them Tibeb (linen with green, gold and red threads), Meskel (highland green and adey yellow), Buna (coffee and copper), Lalibela (rose rock and ochre), Tizita (evening navy), Netela, Emerald & Gold, Basalt (the grey stone of Aksum), Blush, Ivory, Slate, Burgundy, Dusty blue, Academy and Laurel. The page lists the 4 or 5 that suit each layout, not all 20.

## How to build it (about 3 to 4 days)

1. **Demo content (half a day):** extend the example files in `public/examples/` with the invented names and illustrated images above, one per kind, and publish them as real demo sites (`demo-wedding`, `demo-graduation`, `demo-birthday`, `demo-christening`) with `pnpm db:seed:example`.
2. **A showcase switch (half a day):** the `?layout=`, `?theme=` and `?opening=` options currently work only in development or for a signed-in admin. Add a per-site switch, "Showcase mode", **off by default** (following the rule that new features start off), that lets anyone use them on that site only. Real families' sites never get it.
3. **Posters (half a day):** a script that loads each demo in each layout and saves a small WebP poster, so the page shows something before the live preview starts.
4. **The page (1 to 1.5 days):** `/designs` with filter chips, the phone frame, the controls and the description cards. Content comes from one data file so the English and Amharic copy sits in `messages/*.json`.
5. **Copy and review (half a day):** write the descriptions in plain English, then have the Amharic written by a native speaker.
6. **Checks:** accessibility (iframes need titles, controls need labels, tap targets), performance (nothing heavy loads until "Try it"), reduced motion respected inside the demos, and a clear "Example designs" note.

## Alternatives, if this is too much

- **Smallest version (1 day):** a static `/designs` page with posters and description cards only, no live previews. Honest, but stale after any layout change.
- **Video version:** a 10-second looping clip of each layout (a few hundred KB each as WebM). Shows the opening and scroll, but costs more bandwidth and needs re-recording on changes.
- **Link-out version:** each card links to its demo site in a new tab. Easiest, but visitors leave the page.

## Decisions needed from the owner

1. Which image approach: illustrated artwork, stock photos, or generated images?
2. The four invented names and whether they look right in Amharic.
3. Whether visitors may change the theme and opening live (recommended), or only look.
4. Whether engagements and the upcoming business product appear as "coming soon".
5. Where the page lives: a section of the landing page, or its own `/designs` page (recommended, so the landing page stays light).
