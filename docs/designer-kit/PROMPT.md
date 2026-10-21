# Design task: the landing page for an Ethiopian invitation-website service

You are the designer. Read this whole file, look at the images in `images/`, then produce the landing page described under **What to deliver**. Don't ask questions: where something is undecided, make the best choice, and list your assumptions at the end.

## 1. The product

A family gets one link to a **personal invitation website** for their celebration. Guests open it on their phone and see: the date in both the **Ethiopian and Gregorian calendars**, the day's schedule, venues with directions, photos, gift details and an RSVP. It works in **English and Amharic** and is built for Ethiopian celebrations and for the diaspora guests who travel for them.

It started with **weddings** and also covers **graduations, birthdays and christenings (kristina)**. Engagements are "coming soon".

What a guest experiences, in order:
1. **An opening moment.** They tap a netela (Ethiopian cotton shawl) that parts, a wax-seal gate, an envelope, or an adey abeba (Meskel daisy) that blooms. The invitation opens and music starts.
2. **Save the date.** A full-screen calendar in the Ethiopian calendar, the Gregorian one, or both with a switch, a live countdown, and add-to-calendar buttons.
3. **The day.** A timeline of steps with an icon each: telosh, church ceremony, photos, reception, mels, coffee ceremony.
4. **Venues** with directions, a **photo gallery**, **gifts** (bank and Telebirr details with copy buttons, and a wishlist; no payment processing).
5. **RSVP.** Each guest who accepts gets a **personal card with a QR entry pass**, to show at the door.
6. The family has a **private page** (secret link and passcode) where they read RSVPs and wishes.

The product has **15 designs**: 10 for weddings (Classic, Editorial, Reel, Noir & Gold, Gilded Arches, Stories, Flat-lay Suite, Kaba Velvet, Brana Manuscript, Slate), 2 for graduations (Commencement, Tassel), 2 for birthdays (Confetti, Milestone) and 1 for christenings (Shema). `images/01-all-layouts.png` shows all of them; study it, because the landing page should feel like it belongs to the same family. `layout-pictures/` has each one as a separate image (390 × 807, WebP).

## 2. Who it is for and what the page must do

**Audience:** Ethiopian families, in Addis Ababa and abroad, planning a celebration. Most arrive on a **mid-range Android phone, from a Telegram or WhatsApp message, on a slow connection**. Guests who received an invitation never use this page; they open their own link.

**Job of the page:** make a family think "I want that for my celebration", show how it looks and works, and give **one clear way to get started**.

**There is no self-signup, no pricing and no login for families.** The service is run by one person who builds each invitation with the family, free of charge. So the main call to action is **"Ask for your invitation"** (the contact route is not decided yet: build the button so its link is one setting, `CONTACT_URL`, and also show it as a plain text instruction if the link is empty). The secondary action is **"See our designs"**, which goes to `/designs` (already built). Do not design a pricing table, a "Start free trial" button, testimonials with real people, or a family login.

## 3. The look: it must look like the product, not like software

- **Mood:** warm, dignified, plain. Speak to the family ("your guests", "your day"), never about software. No "platform", "solution", "SaaS".
- **Cultural references to use** (real, specific): tibeb (the woven border of a habesha kemis and netela), netela, harag (the interlaced knotwork of Ethiopian manuscripts), Ge'ez letterforms, mesob (woven table basket), jebena (coffee pot), adey abeba, the netela hem, Lalibela's rose-coloured stone.
- **Avoid:** stock "African" tropes (drums, safari, savannah), flag-coloured stripes, and anything that looks like a generic startup template (gradient blobs, purple, glassmorphism, a row of three identical icon cards).
- **The one memorable moment:** pick one thing to be bold about (for example the hero, or the way the four kinds of celebration are shown) and keep everything else quiet and disciplined.
- **People:** the product shows **no real people**. Use only the drawn artwork in `artwork/` (see `images/02-artwork.png`: faceless silhouettes, objects and patterns), your own illustrations in the same spirit, and patterns. Do not use photographs, and do not draw faces.

### Hard rules (the owner decided these; do not break them)
1. **Never stack green, gold and red as three bands or stripes side by side**: it reads as the national flag. Thin gold rules and woven patterns where the colours alternate in small shapes are fine.
2. **Faith imagery is opt-in.** Do not lead with a cross, a crescent or any religious symbol. The tibeb cross pattern and the Harari rosette ornament are allowed as pattern. A christening can be shown with woven white cloth and a church doorway, without a cross.
3. **Never machine-translate Amharic.** Use the Amharic in section 6 exactly as written; where there is none, leave the text out of the Amharic version rather than inventing it. It is a draft that a native speaker will check.
4. **Amharic typography:** set Ge'ez text about one size step larger than Latin, never letter-spaced and never uppercased, with a taller line height (about 1.7). Test every section with the Amharic text, which is usually longer.
5. **Both languages are equal.** The page has an English/አማርኛ toggle; no layout may break in either.

## 4. Design tokens (use these; they are the product's own)

The product's default theme, "Tibeb":

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f2f4ef` | page background |
| `--sheet` | `#fbfcf9` | cards and raised areas |
| `--ink` | `#17261f` | text |
| `--ink-soft` | `#56655c` | secondary text |
| `--rule` | `#d5dbd0` | hairlines |
| `--thread-1` | `#1d6b47` | primary colour (buttons, links), deep green |
| `--thread-2` | `#c49a22` | gold accent |
| `--thread-3` | `#a8372c` | red accent, small use only |
| `--on-thread-1` | `#ffffff` | text on the green |

Contrast is already checked for ink on paper (about 14:1) and white on green (about 6:1). If you add a colour, check it: **text 4.5:1 minimum, large text and borders 3:1**.

Other palettes the product offers, if you want one section to feel different: Meskel (deep highland green with adey yellow), Buna (coffee and copper), Lalibela (rose stone and ochre), Tizita (evening navy with silver), Netela (cotton white with one gold thread), Emerald & Gold, Basalt (grey stone with bronze), Blush, Ivory, Slate, Burgundy, Dusty blue, Academy (navy and gold), Laurel (sage and gold).

**Fonts** (all free on Google Fonts; use these):
- Display: **Marcellus** (400), for headings.
- Text: **Source Serif 4** (400) for body.
- Interface labels: **Figtree**.
- Amharic: **Noto Serif Ethiopic** (400) for text and **Abyssinica SIL** (400) for display.
- Load a **single weight** of each (asking for several makes Google send a file about 4 times larger).

**Existing building blocks you may reuse in spirit:** a woven **tibeb band** across the top and bottom of the current placeholder page, a phone frame with a rounded 2.4rem body and a dark border, small pictures of each design, diamond bullets in gold, and gentle staggered reveals as sections scroll into view.

## 5. Page structure (follow it, but improve the details)

1. **Header:** wordmark placeholder, language toggle, "See our designs".
2. **Hero:** one strong line, a short supporting line, a phone showing an invitation (use the drawn artwork and layout pictures), and both calls to action.
3. **How your guests see it:** the four moments (open, both calendars, reply, personal pass) as a short sequence, ideally with a phone frame that changes as you scroll or step through.
4. **One service, many celebrations:** wedding, graduation, birthday and christening, each with its own look (use the pictures from `layout-pictures/`) and a link to `/designs#<layout>`.
5. **Made for Ethiopia:** both calendars, Amharic, the Ethiopian clock, tibeb and harag borders, Telebirr, Telegram. Short and concrete.
6. **For your family:** guest cards with QR passes, the private RSVP page, gifts, free of charge.
7. **Ask for your invitation:** the call to action, with the contact link if present.
8. **Footer:** "Received an invitation? Open the link you were sent.", the language toggle and a small, quiet "Sign in" link to `/admin`.

## 6. Copy (use as given; this is the real wording)

| Where | English | Amharic (draft, needs a native check) |
| --- | --- | --- |
| Brand placeholder | Invitations for every celebration | ለእያንዳንዱ በዓል ግብዣ |
| Hero headline | Your celebration, in one beautiful link. | በዓልዎ፣ በአንድ ውብ ማስፈንጠሪያ። |
| Hero text | A personal invitation website for your wedding, graduation, birthday or christening: the date in both calendars, the day's schedule, directions, photos and an RSVP. In English and Amharic. | ለሠርግ፣ ለምረቃ፣ ለልደት ወይም ለክርስትና የግል የግብዣ ድረ-ገጽ፦ ቀኑ በሁለቱም አቆጣጠር፣ የቀኑ መርሐ ግብር፣ አቅጣጫ፣ ፎቶዎች እና ምላሽ መስጫ። በአማርኛ እና በእንግሊዝኛ። |
| Primary button | Ask for your invitation | ግብዣዎን ይጠይቁ |
| Secondary button | See our designs | ንድፎቻችንን ይመልከቱ |
| Section 3 title | How your guests will see it | እንግዶችዎ እንዴት ያዩታል |
| Step 1 | They tap to open. A netela parts, a seal splits, an envelope unfolds. | በመንካት ይከፍቱታል። |
| Step 2 | They see the day in both calendars, with a countdown. | ቀኑን በሁለቱም አቆጣጠር ያያሉ። |
| Step 3 | They reply in a minute. | በደቂቃ ውስጥ ይመልሳሉ። |
| Step 4 | They arrive with a personal pass. | በግል መግቢያ ካርድ ይመጣሉ። |
| Section 4 title | One service, for every celebration | ለእያንዳንዱ በዓል |
| Cards | Weddings · Graduations · Birthdays · Christenings | ሠርግ · ምረቃ · ልደት · ክርስትና |
| Wedding card | Ten designs, from a quiet classic to a velvet kaba and an illuminated manuscript. | (none: leave out in Amharic) |
| Graduation card | One graduate or several, each with their degree, school and story. | (none) |
| Birthday card | From a page of confetti to the age in gold foil. | (none) |
| Christening card | Woven white cloth, the christening name and the godparents. | (none) |
| Section 5 title | Made for Ethiopia | ለኢትዮጵያ የተሠራ |
| Section 5 points | The Ethiopian and Gregorian calendar, side by side · The Ethiopian clock: 2 PM reads as 8:00 in the afternoon · English and Amharic · Telebirr and bank details · Shares properly on Telegram and WhatsApp | (none) |
| Section 6 title | For your family | ለቤተሰብዎ |
| Section 6 points | A personal card with a QR pass for every guest · A private page where you read the RSVPs and wishes · Gift details with copy buttons · Free of charge | (none) |
| Final title | Ask for your invitation | ግብዣዎን ይጠይቁ |
| Final text | We build each invitation with you, free of charge. Tell us about your celebration and which design you like. | (none) |
| Footer line | Received an invitation? Open the link you were sent. | ግብዣ ደርሶዎታል? የተላከልዎትን ማስፈንጠሪያ ይክፈቱ። |
| Sign in link | Sign in | (leave in English) |

## 7. What to deliver

1. **One self-contained `index.html`**, with CSS in a `<style>` block and a very small amount of vanilla JavaScript (language toggle, and any scroll behaviour). No frameworks and no build step. Fonts through one Google Fonts `<link>`. Images by relative path from the files in this kit (`artwork/…`, `layout-pictures/…`).
2. **Design rules:**
   - Mobile first: it must work at 360 px wide, with a 16 px side margin and no horizontal scroll, and then widen well to 1280 px.
   - **Every text lives in one `const COPY = { en: {…}, am: {…} }` object**, so the page can be ported into the app's translation files. Use `data-i18n` attributes.
   - The tokens above as CSS variables on `:root`, with the names from section 4.
   - Semantic HTML: one `<h1>`, ordered headings, landmarks, a skip link, real buttons and links, `lang` set on `<html>` and switched with the toggle (`lang="am"` for Amharic).
   - Respect `prefers-reduced-motion`: no motion at all when it is set. Otherwise motion is gentle, and there is only one memorable moment.
   - Visible keyboard focus, tap targets of 44 px or more, alt text for every picture (empty for decoration).
   - Light: no image over about 150 KB, no video, no auto-playing audio, and the page should score 90+ on Lighthouse mobile performance and 100 on accessibility.
3. **A short note** (under 200 words) after the code: the one bold choice you made and why, and your assumptions.

## 8. How this will be used

A developer will port your page into the app (Next.js 15, React 19, Tailwind v4, `next-intl`) at `src/app/(public)/page.tsx`. Keep class names meaningful, keep the structure close to the sections above, and keep the copy in the `COPY` object. The page is public and must not need a login or any server.

## 9. Files in this kit

- `PROMPT.md`: this file.
- `images/01-all-layouts.png`: all 15 designs, labelled.
- `images/02-artwork.png`: the drawn artwork, labelled with file names.
- `layout-pictures/*.webp`: each design as a phone-sized picture (classic, editorial, reel, noir, arches, stories, flatlay, kaba, brana, slate, commencement, tassel, confetti, milestone, shema).
- `artwork/*.svg`: 24 vector files: 8 cover scenes (`wedding-walk`, `wedding-arch`, `graduation-caps`, `graduation-gate`, `birthday-cake`, `birthday-balloons`, `christening-door`, `christening-cloth`), 10 detail pieces (`rings`, `coffee-jebena`, `mesob`, `adey-flowers`, `tibeb-textile`, `candles`, `laurel-cap`, `church-arch`, `confetti-burst`, `keepsake`) and 6 portrait silhouettes (`portrait-1` to `portrait-6`).
- `background/landing-page-brief.md` and `background/showcase-plan.md`: longer background, if you want it. This prompt overrides them where they differ.
