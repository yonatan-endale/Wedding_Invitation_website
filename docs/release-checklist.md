# Release checklist

Checks that need a real phone, because headless Chrome can't stand in for them.
Run them on a published couple (a test one is fine), once in English and once in
Amharic.

## Telegram in-app browser (Android and iPhone)

Send the site link in a Telegram chat and open it from there.

- [ ] The opening screen shows, and tapping it opens the site.
- [ ] The music starts after the tap and the music button pauses and resumes it.
- [ ] The full-screen sections (cover, save-the-date) fill the screen without a gap or a jump when the address bar hides or shows.
- [ ] The RSVP form submits, and the guest card downloads or opens to save.
- [ ] Share links (WhatsApp, Telegram, copy) work from inside Telegram.

## iOS Safari

- [ ] The same five checks as above.
- [ ] With Settings → Accessibility → Motion → Reduce Motion on, the opening goes straight to the site and nothing moves.
- [ ] Stories: swiping scrolls card by card, and the keyboard never covers the RSVP field you're typing in.
- [ ] Flat-lay: the cards stack while scrolling and every card can be read to the end.

## Measured before release (October 2026)

Lighthouse mobile, local production build, simulated slow 4G:

| Couple | Layout | Performance | Accessibility | LCP |
|---|---|---|---|---|
| Rich (20 photos, 7 events) | Reel | 86 | 100 | 3.9 s |
| Sparse (no photos, 1 event) | Gilded Arches | 84 | 100 | 4.2 s |
| Amharic-first, long names | Brana Manuscript | 77 | 100 | 4.6 s |
| Real couple | Editorial | 90 | 100 | 3.5 s |

Brana loads two Ge'ez typefaces and a layout font, so it is the heaviest. The next
gains would come from splitting each layout's CSS out of the shared page bundle.
