# Wedding invitation sites

One Next.js 15 app that hosts a separate invitation website for every couple, plus an admin dashboard where you create and edit them. No code changes are needed to add a couple.

Each couple site has:

- An opening screen styled like a netela, which starts the couple's music when a guest opens it
- A hero with the couple's photo, a live countdown and a formal invitation card
- Their story, a verse or quote, and the day's timeline
- Venues with "Open in Google Maps" and an optional embedded map
- A swipeable photo gallery with a full-screen viewer
- Gifts: bank and Telebirr details with copy buttons and QR codes, plus a wishlist that links to shops
- An RSVP form, and a Telegram link for guests to share photos
- An English and Amharic switch, with Ethiopian calendar dates and Ethiopian clock times in Amharic
- A share preview image for WhatsApp, Telegram and Facebook
- A choice of five colour themes

## How it works

| Piece | Where |
| --- | --- |
| Guest site | `src/app/s/[slug]/page.tsx`, sections in `src/components/wedding/` |
| Subdomain routing | `src/middleware.ts` rewrites `<slug>.<root domain>` to `/s/<slug>` |
| Admin dashboard | `src/app/(platform)/admin/`, forms in `src/components/admin/` |
| Server actions | `src/actions/admin.ts` (admin), `src/actions/rsvp.ts` (guests) |
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
- `http://hanna-dawit.localhost:3000` for the same site on a subdomain (works in Chrome and Firefox)
- `http://localhost:3000/admin` for the dashboard

For local Clerk keys without an account, run `npx clerk@latest init --framework next --accountless` in an empty folder and copy the two `CLERK` keys it writes. Put your own email in `ADMIN_EMAILS`.

## Add a new couple

1. Open `/admin` and click **New couple**. Fill in names, date, time zone, theme, cover photo and music, then create it.
2. Fill in the **Invitation text** tab: story, verse, dress code, RSVP deadline, gift message and Telegram link.
3. Add gallery pictures in **Photos**. The star sets the cover photo.
4. Add the church or hall and the day's events in **Venues and schedule**. Paste the Google Maps share link, or add latitude and longitude for the embedded map.
5. Add bank or Telebirr accounts and wishlist items in **Gifts**.
6. Click **Preview**, check it on your phone, then click **Publish**.
7. Use **Copy link**, or the menu's WhatsApp and Telegram share, to send the link.

RSVPs appear in the **RSVPs** tab. **Download CSV** opens in Excel with Amharic names intact.

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
pnpm test          # unit tests (calendar, validation, routing, CSV and more)
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
