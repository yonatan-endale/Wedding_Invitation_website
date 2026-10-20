# Invitation sites

One Next.js 15 app that hosts a separate invitation website for every celebration, plus an admin dashboard where you create and edit them. Weddings came first; graduations, birthdays and christenings are open too, and engagements are planned. No code changes are needed to add a site.

## Graduations

A graduation site lists one to six graduates, each with a portrait, degree, school and a few lines, in its own layouts:

- Commencement: the class year in large outline numerals under the names, and each graduate on a diploma-style card
- Tassel: a deep cover with a laurel wreath of initials hung on a gold cord, and each graduate in an arch

Birthdays list one to three people, with their age or milestone, in two layouts: Confetti (the name in a page of confetti) and Milestone (a dark cover with the age in gold foil, for the big numbers).

Christenings (kristina) list the child with their christening name and godparents in the Shema layout, a cover of woven white cloth with the site's border down both edges. A cross appears only when the admin picks a faith ornament, here and on the timeline.

Photos can be grouped under headings such as "The two of us". The shared sections (save-the-date, countdown, RSVP, calendar, guest card) speak of a graduation in both languages: each event type lays its own wording from `events.<type>` in `messages/*.json` over the wedding wording. Try it with `pnpm db:seed:example graduation` (or `birthday`, `baptism`).

## The designs page

`/designs` shows every layout beside a plain explanation, on fictional demo sites that use only drawn artwork, so no real person appears. Each design starts as a small picture and opens the live site in a phone frame when a visitor taps "Try it live"; they can then try other colours and opening screens.

- **Demo sites:** `public/examples/showcase-{wedding,graduation,birthday,christening}.json`, loaded with `pnpm db:seed:example showcase-wedding demo-wedding --publish` (and the same for the others, slugs `demo-graduation`, `demo-birthday`, `demo-christening`). Each has the per-site **Showcase mode** switch on, which lets anyone use `?layout=`, `?theme=` and `?opening=` on that site only. It is off for every real site, and the faith ornament can never be changed this way.
- **Artwork:** `python3 scripts/make-showcase-art.py` draws `public/showcase/art/*.svg`. No faces, no flag-coloured stripes, and no cross unless a family chooses one.
- **Pictures:** `BASE_URL=... PUPPETEER_DIR=... npx tsx scripts/make-showcase-posters.ts` takes `public/showcase/posters/*.webp` from the running demos. Run it again after a layout changes.
- **The explanations:** `showcase.layouts.<layout>` in `messages/*.json`, in English and Amharic. A test fails if a layout has none.
- **"Ask for this design"** leads to the home page's contact section; set `NEXT_PUBLIC_CONTACT_URL` for its "Get in touch" button.

## Weddings

Each wedding site has:

- Nine layouts to choose from, each with its own design: Classic, Editorial, Reel (cinematic), Noir & Gold (black tie), Gilded Arches, Stories (one full-screen card at a time), Flat-lay Suite (stationery on linen), Kaba Velvet and Brana Manuscript (an illuminated Ge'ez manuscript)
- A choice of opening screen, which starts the couple's music when a guest opens it: a netela, wax-seal gates, a 3D envelope with a letter, or an adey abeba flower that blooms. A `?to=Name` link greets the guest by name
- A full-screen save-the-date with the wedding month and the day marked, in the Ethiopian calendar, the Gregorian one, or both with a switch, plus a live countdown
- A hero with the couple's photo and a formal invitation card
- Section animations at three levels per couple (subtle, moderate, rich), with a pause button and no motion for guests who prefer reduced motion
- Their story, a verse or quote, and the day's timeline with start and optional end times, closing with an end-of-day marker. Each event can be a Habesha step (telosh, church ceremony, mels, kelekel, buna and more) with a bilingual title and its own icon
- Venues with "Open in Google Maps" and an optional embedded map
- A swipeable photo gallery with a full-screen viewer
- Gifts: bank and Telebirr details with copy buttons and QR codes, plus a wishlist that links to shops
- An RSVP form, and a Telegram link for guests to share photos
- A personal invitation card for every guest who accepts: their name on the couple's invitation, in the couple's theme, ready to download. Its QR code opens an entry pass that ushers can check at the door
- A private page where the couple reads RSVPs and wishes and sends guests their cards. There is no sign-up: a secret link plus a passcode
- An English and Amharic switch. Times always use the Ethiopian clock, so 2 PM reads as 8:00 in the afternoon, and Amharic also uses Ethiopian calendar dates
- A share preview image for WhatsApp, Telegram and Facebook
- Thirteen colour themes, drawn from Ethiopian weddings and classic schemes; dark layouts turn light themes into dark versions that keep their contrast
- A choice of border: two woven tibeb bands (the slim original, or a wide one drawn from a real netela), harag manuscript interlace, a floral vine, or a plain line
- An optional faith ornament (Orthodox cross, plain cross or Harari rosette), off unless the couple picks one
- Falling rose petals over the hero photo, off for guests who prefer reduced motion
- Three forms of each name: the first name on the opening screen, an optional nickname in the hero, and first plus father's name on the invitation card, footer and share preview

## How it works

| Piece | Where |
| --- | --- |
| Guest site | `src/app/s/[slug]/page.tsx`, wedding sections in `src/components/wedding/`, other event types in `src/components/events/` |
| Subdomain routing | `src/middleware.ts` rewrites `<slug>.<root domain>` to `/s/<slug>` |
| Admin dashboard | `src/app/(platform)/admin/`, forms in `src/components/admin/` |
| Server actions | `src/actions/admin.ts` (admin), `src/actions/rsvp.ts` (guests), `src/actions/couple-portal.ts` (the couple's private page) |
| Guest card and entry pass | `src/lib/card/` draws the PNG; pages under `src/app/s/[slug]/card/` and `pass/` |
| Couple's private page | `src/app/s/[slug]/couple/`, access and sessions in `src/lib/couple-access.ts` |
| Database schema | `src/db/schema.ts` (Drizzle ORM, Postgres) |
| Themes | `src/lib/theme.ts` |
| UI text in English and Amharic | `messages/en.json`, `messages/am.json` |

Guest pages are cached per couple, and every admin save clears that couple's cache. A draft site returns "not found" to guests. You can still preview it at `/s/<slug>` while signed in as admin.

## Services (all free tiers)

| Need | Service | Env vars |
| --- | --- | --- |
| Database | Neon Postgres (Vercel Marketplace) | `DATABASE_URL` |
| Admin login | Clerk (Vercel Marketplace) | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |
| Photo and music uploads | Vercel Blob | `BLOB_READ_WRITE_TOKEN` |
| Who can use the admin | You | `ADMIN_EMAILS` (comma-separated) |
| Subdomain links (optional) | Your domain | `NEXT_PUBLIC_ROOT_DOMAIN` |

Without `BLOB_READ_WRITE_TOKEN` everything still works, but you paste image and music links instead of uploading.

## Run it locally

Requirements: Node 20 or newer, pnpm, and a Postgres database. A local Postgres works, and so does a Neon connection string.

```bash
pnpm install
cp .env.example .env.local        # then fill in the values
pnpm db:migrate                   # create the tables
pnpm db:seed                      # optional: demo couple "hanna-dawit"
pnpm dev
```

Then open:

- `http://localhost:3000/s/hanna-dawit` for the demo couple site

To add a real site, put its data in a JSON file (see `public/examples/couple.json` for a wedding and `public/examples/graduation.json` for a graduation; real ones live in `data/couples/`) and upload it at `/admin/sites/import`. Old `/admin/couples/...` links redirect there.
- `http://hanna-dawit.localhost:3000` for the same site on a subdomain (works in Chrome and Firefox)
- `http://localhost:3000/admin` for the dashboard

For local Clerk keys without an account, run `npx clerk@latest init --framework next --accountless` in an empty folder and copy the two `CLERK` keys it writes. Put your own email in `ADMIN_EMAILS`.

## Add a new couple

1. Open `/admin` and click **New couple**. Fill in first names, father's names, optional nicknames, date, time zone, theme, border, cover photo and music, then create it.
2. Fill in the **Invitation text** tab: story, verse, dress code, RSVP deadline, gift message and Telegram link.
3. Add gallery pictures in **Photos**. The star sets the cover photo.
4. Add the church or hall and the day's events in **Venues and schedule**. Paste the Google Maps share link, or add latitude and longitude for the embedded map.
5. Add bank or Telebirr accounts and wishlist items in **Gifts**.
6. Click **Preview**, check it on your phone, then click **Publish**.
7. Use **Copy link**, or the menu's WhatsApp and Telegram share, to send the link.

To try a look before saving it, add preview options to the site link while signed in as admin, for example `/s/<slug>?layout=noir&theme=burgundy&opening=seal&motion=rich&border=harag&ornament=orthodox`. They also work without signing in on `next dev`.

RSVPs appear in the **RSVPs** tab. **Download CSV** opens in Excel with Amharic names intact.

Guest cards and the couple's private page start **off** for every couple. Turn them on in **Invitation text → RSVP and sharing**. While a feature is off, its pages return "not found" and its links stop working; turning it back on restores them.

With guest cards on, the CSV includes each guest's card link, and the card button on a guest's row downloads their card or sends it to them on WhatsApp.

To give the couple their own page, turn it on, then click **Create link and passcode** at the top of the RSVPs tab. Send the link and the passcode by different routes, for example the link on Telegram and the passcode by phone. Both are shown only once; if they get lost, make a new pair, which also signs out every device. Five wrong passcodes in a row lock the page for 15 minutes, then longer; **Unlock** lifts it early.

## Deploy to Vercel (free Hobby plan)

Database migrations run automatically at the start of every Vercel build (`scripts/migrate.ts`). You never create tables by hand.

1. **Import:** in Vercel, choose Add New, then Project, and import the GitHub repository. Keep the detected Next.js settings. Don't paste your local `.env.local`, because it points at localhost.
2. **Database:** in the project, open Storage, create a Neon Postgres database and connect it to all environments. This adds `DATABASE_URL`.
3. **Uploads (optional):** in Storage, create a Blob store with public access and connect it. This adds `BLOB_READ_WRITE_TOKEN`.
4. **Login:** create a free app at clerk.com and copy its development keys (`pk_test_…` and `sk_test_…`). Clerk production keys need a domain you own, so development keys are the ones to use on `vercel.app`.
5. **Environment variables:** in Settings, then Environment Variables, add these:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` set to `/sign-in`
   - `ADMIN_EMAILS` set to the email you sign in with
   - Leave `NEXT_PUBLIC_ROOT_DOMAIN` unset.
6. **Redeploy:** open Deployments, then Redeploy. Environment variable changes only apply to new deployments. The build log should show "Database migrations are up to date."
7. **Check:** open `https://<project>.vercel.app/admin`, sign up with the email from `ADMIN_EMAILS`, and create your first couple.

Couple links will be `https://<project>.vercel.app/s/<slug>`.

Preview deployments also run migrations, against whatever database their `DATABASE_URL` points to. Neon's integration can give each preview its own database branch.

### Optional: subdomain links

1. In the Vercel project, add your domain and a wildcard domain `*.yourdomain.com`. Point the domain's nameservers to Vercel, which wildcard domains require.
2. Set `NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com` and redeploy.
3. Links become `https://<slug>.yourdomain.com`. The `/s/<slug>` links keep working.
4. In Clerk, add `yourdomain.com` as the production domain so admin sign-in works there.

## Useful commands

```bash
pnpm test          # unit tests (calendar, clock, validation, routing, CSV and more)
pnpm typecheck
pnpm lint
pnpm build
pnpm db:generate   # after changing src/db/schema.ts, create a migration
pnpm db:migrate    # apply migrations
pnpm db:studio     # browse the database
```

## Notes

- **Music rights:** only upload music the couple has the right to share. The demo track is a public-domain recording of Pachelbel's Canon by the U.S. Air Force Band.
- **Demo photos:** they come from Unsplash, and the seed's account numbers are placeholders.
- **Image limits:** the Hobby plan has a monthly image-optimization quota. Uploaded photos are served from Vercel Blob. Links from other hosts are shown unoptimized.
- **RSVP spam:** a hidden honeypot field and a per-IP limit protect the form. If spam becomes a problem, move the limit to Upstash Redis.
- **Entry passes:** anyone with the site link can RSVP, so a pass shows that the person said yes, not that they were on a guest list. Deleting an RSVP voids its card and pass at once.
- **Couple's page security:** the link's secret sits after `#`, so it never reaches the server logs or another site. Only hashes of the link, the passcode and each session are stored, and every request checks the session against the database.
