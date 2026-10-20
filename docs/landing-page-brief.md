# Landing page brief

**For:** the designer building the public landing page.
**Product:** an invitation-site builder for Ethiopian celebrations, working name "Invitations for every celebration" (no final name or domain yet).

## What the product is, in one paragraph

A family sends one link, and guests open a beautiful personal invitation website: the date in both the Ethiopian and Gregorian calendars, the day's schedule, venue directions, photos, gift details, and an RSVP. It works in English and Amharic, and it is built for Ethiopian celebrations and the diaspora guests who attend from abroad. It started with weddings and now also does graduations, birthdays and christenings (kristina). Engagements (telosh, kelebet) are planned.

## Who the landing page is for

1. **Families planning a celebration**, mostly Ethiopian, in Addis Ababa and the diaspora. Many will arrive from a Telegram or WhatsApp message or a friend's invitation, on a phone.
2. **Guests** who received an invitation do not use the landing page: they open their own link. The page only needs a small "Received an invitation? Open the link you were sent" line.

## The job of the page

Make a family think "I want that for my celebration", show how it looks and works, and give one clear way to get started.

**The way to get started is not self-signup.** Sites are created and managed by the owner, free of charge, for each family. The call to action is therefore "Ask for your invitation" (a contact route: Telegram, phone or a short form). Decision still open: which contact channel. There is also an admin sign-in link for the owner, kept small and unobtrusive.

## What to show

### The product, by what a guest experiences
- **An opening moment.** The guest taps a netela, a wax-seal gate, an envelope or a blooming adey abeba flower, and the invitation opens. The music starts.
- **Save the date.** A full-screen calendar in the Ethiopian calendar, the Gregorian one, or both with a switch, plus a live countdown and add-to-calendar buttons.
- **The day.** A timeline of steps (telosh, church ceremony, mels, kelekel, coffee ceremony and more), each with an icon.
- **Venues** with directions and a map link.
- **Photos** in a swipeable gallery.
- **Gifts:** bank and Telebirr details with copy buttons and QR codes, and a wishlist. No payment processing.
- **RSVP**, then a **personal card with a QR entry pass** for every guest who accepts, ready to download and show at the door.
- **A private page for the family** with a secret link and passcode, where they read RSVPs and wishes.
- **Everything in English and Amharic**, times in the Ethiopian clock (2 PM reads as 8:00 in the afternoon), and a share preview image for Telegram, WhatsApp and Facebook.

### The range of celebrations (the page's main structure)
Show each kind as its own look, not the same template with different words:
- **Weddings**: 10 layouts (Classic, Editorial, Reel, Noir & Gold, Gilded Arches, Stories, Flat-lay Suite, Kaba Velvet, Brana Manuscript, Slate), 16 colour themes and 5 border styles drawn from netela and tibeb weaving and from Ethiopian manuscripts.
- **Graduations**: Commencement (class year in large outline numerals) and Tassel (a laurel wreath of initials hung on a gold cord).
- **Birthdays**: Confetti (the name in a page of confetti) and Milestone (a dark cover with the age in gold foil).
- **Christenings (kristina)**: Shema (a cover of woven white cloth with the border down both edges).
- **Engagements**: coming soon.

### Proof
The proof already exists: the **`/designs` page** (`src/app/(public)/designs/`, components in `src/components/showcase/`) shows all 15 layouts beside a plain explanation, each on a fictional demo site that opens live in a phone frame, with colour and opening-screen controls. The landing page should lead people to it ("See our designs") and can reuse its look: the phone frame, the small pictures in `public/showcase/posters/` and the drawn artwork in `public/showcase/art/`. See `docs/showcase-plan.md` and the README section "The designs page". Demo data is in `public/examples/showcase-*.json`.

## Suggested page structure

1. **Hero:** one strong line, a phone showing a real invitation opening, and the call to action.
2. **How it feels to receive one:** the opening, the Ethiopian date, the schedule, the RSVP, in a short scroll sequence on a phone frame.
3. **One product, many celebrations:** wedding, graduation, birthday and christening, each with its own look and a "See an example" link.
4. **Made for Ethiopia:** both calendars, Amharic, the Ethiopian clock, tibeb and harag borders, Telebirr, Telegram. Short and concrete.
5. **For the family:** guest cards with QR passes, the private RSVP page, gifts, free of charge.
6. **Call to action:** ask for your invitation, then a small footer with the "received an invitation?" line, language toggle and the admin sign-in.

## Tone and content

- Warm, dignified and plain. Speak to the family ("your guests", "your day"), not about software.
- No jargon like "platform", "SaaS" or "solution". Concrete beats clever.
- Both languages. The page needs English and Amharic versions (the app already switches language with a cookie). Amharic copy must be written or checked by a native speaker; do not machine-translate. Amharic is set a size up and without letter-spacing or capitals; Ge'ez syllables are never uppercased.
- Dates should show the Ethiopian date first for Amharic readers.

## Visual direction and constraints

- **The landing page should look like the product**, not like a software company. Today's placeholder uses the product's own tokens: a woven tibeb band at the top and bottom, Marcellus display type, Source Serif 4 for text, Noto Serif Ethiopic and Abyssinica SIL for Amharic, and a green thread colour.
- **Colours** come from the Ethiopian themes (green, gold and red threads on paper) but **never as three stacked stripes**: that reads as the national flag. Thin gold rules are fine.
- **Cultural rules (decided by the owner):**
  - The tibeb cross and the Harari rosette ornament are kept.
  - Other faith imagery (crosses, crescents) appears only when a family opts in, so the landing page should not lead with religious symbols. Christenings can show woven white cloth and a church silhouette without a cross.
  - Avoid stock "African" tropes. Use real patterns: tibeb, netela borders, harag manuscript interlace, mesob, jebena, adey abeba.
- **Motion:** gentle and purposeful, one memorable moment rather than many. It must respect reduced motion. The product's own pages use staggered reveals and a single sheen on gold type; the landing page should feel like the same family.
- **Mobile first.** Most visitors arrive on a mid-range Android phone from a chat app, often on a slow connection. Keep the page light: performance score 85 or higher, accessibility 100, no layout shift.
- **Accessibility:** contrast checked on every colour pair, visible keyboard focus, real headings and landmarks, alt text, and nothing important conveyed by colour alone.

## Technical context for the build

- The page lives in this Next.js app at `src/app/(public)/page.tsx` (App Router, Tailwind v4). The current file is a simple placeholder with a "See our designs" button and an "Ask for your invitation" section (`id="ask"`). It sits outside the Clerk sign-in group on purpose, so visitors don't download sign-in code: keep it that way.
- Design tokens come from `src/lib/theme.ts` (the `--w-*` CSS variables, 16 themes), the fonts from `src/app/fonts.ts`, and shared pieces from `src/components/wedding/primitives.tsx` (borders, headings).
- Language: `next-intl`, messages in `messages/en.json` and `messages/am.json`.
- No payment, no sign-up: do not design a pricing table, a "Start free trial" button or a login for families.
- Free hosting only, so avoid heavy video and large images. Use optimised WebP or AVIF, and short looping clips only if they stay under a few hundred kilobytes.

## Status and caveats to know before designing

- The graduation, birthday and christening layouts, the events-wide branding and the `/designs` page are built but **not yet merged** into the main branch; they are on six stacked branches (the newest is `feat/showcase`) waiting for the owner's review. Work from `feat/showcase` to see everything. Weddings are live in the main branch.
- The product has **no public name, domain or logo yet**. A wordmark or name is needed, or a placeholder agreed with the owner.
- Whether the contact route is Telegram, phone or a form is undecided.
- A separate product for **businesses** (conferences, galas, guest lists, QR check-in at the door) is in development. It is not part of this landing page; if the owner wants it mentioned, add a small "For companies" link that goes nowhere yet, or a short "coming soon" strip.

## Open questions for the owner

1. The name and domain of the product, and whether there is a logo.
2. The contact route for "Ask for your invitation".
3. Whether the drawn, faceless artwork used on the demo sites is the right look for the landing page too, or whether the designer will provide their own illustrations. No real photos of people can be used.
4. Should the page mention that it is free, and for whom?
5. English first, Amharic first, or equal weight?
