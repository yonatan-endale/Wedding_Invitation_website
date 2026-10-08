# Amharic strings waiting for a native speaker

New Amharic text added during the save-the-date, openings, motion and layouts
work. Each phase adds its strings here; a phase ships to guests only after its
rows are reviewed. Mark a row done by filling in the reviewer and date.

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `src/lib/event-kinds.ts` | telosh title | Telosh | ጥሎሽ | |
| `src/lib/event-kinds.ts` | ceremony_orthodox title | Church ceremony | የቤተክርስቲያን ሥርዓት | |
| `src/lib/event-kinds.ts` | ceremony_protestant title | Wedding service | የጋብቻ አገልግሎት | |
| `src/lib/event-kinds.ts` | ceremony_civil title | Vow ceremony | የቃልኪዳን ሥርዓት | |
| `src/lib/event-kinds.ts` | nikah title | Nikah | ኒካህ | |
| `src/lib/event-kinds.ts` | photos title | Photo session | የፎቶ ፕሮግራም | |
| `src/lib/event-kinds.ts` | blessing title | Elders' blessing | የሽማግሌዎች ምርቃት | |
| `src/lib/event-kinds.ts` | mels title | Mels | መልስ | |
| `src/lib/event-kinds.ts` | kelekel title | Kelekel | ቅልቅል | |
| `src/lib/event-kinds.ts` | buna title | Coffee ceremony | የቡና ሥነ ሥርዓት | |

## Conventions to confirm

- Monogram separator on Amharic pages: the Ethiopic wordspace "፡" instead of "&".
- Initials on Amharic pages use the first fidel of each Amharic first name.

## Phase 1: save-the-date and countdown

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | saveTheDate.title | Save the date | ቀኑን ይያዙ | |
| `messages/am.json` | saveTheDate.couple | {one} and {two} | {one} እና {two} | |
| `messages/am.json` | saveTheDate.switchLabel | Calendar | የቀን አቆጣጠር | |
| `messages/am.json` | saveTheDate.ethiopian | Ethiopian | ኢትዮጵያ | |
| `messages/am.json` | saveTheDate.gregorian | Gregorian | ፈረንጅ | |
| `messages/am.json` | saveTheDate.captionGregorian | {month} {year}, with the wedding day marked | {month} {year}፣ የሠርጉ ቀን ምልክት ተደርጎበታል | |
| `messages/am.json` | countdown.summary | {days} days, {hours} hours and {minutes} minutes left | {days} ቀናት፣ {hours} ሰዓታት እና {minutes} ደቂቃዎች ቀርተዋል | |
| `messages/am.json` | countdown.summarySince | … since the wedding | ከሠርጉ ወዲህ {days} ቀናት፣ {hours} ሰዓታት እና {minutes} ደቂቃዎች | |

## Phase 2: openings

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | intro.dear | Dear {name}, | ውድ {name}፣ | |
| `messages/am.json` | intro.pressToOpen | Press to open | ለመክፈት ይጫኑ | |
| `messages/am.json` | intro.sealLabel | Open the invitation from {one} and {two} | ከ{one} እና {two} የመጣውን ግብዣ ይክፈቱ | |
| `messages/am.json` | intro.openEnvelope | Tap the envelope to open | ለመክፈት ፖስታውን ይንኩ | |
| `messages/am.json` | intro.letter | invite you to celebrate their wedding | በሠርጋቸው ላይ እንዲገኙ ይጋብዙዎታል | |
| `messages/am.json` | intro.tapFlower | Tap the flower to open | ለመክፈት አበባውን ይንኩ | |
| Seal monogram | separator on Amharic pages | A & M (interlocked) | ዳ ፡ ሲ | |

## Phase 3: section motion

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | motion.pause | Pause motion | እንቅስቃሴን አቁም | |
| `messages/am.json` | motion.play | Play motion | እንቅስቃሴን አስጀምር | |

## Guest cards and entry pass

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | card.dear | Dear {name}, | ውድ {name}፣ | |
| `messages/am.json` | card.admits | Admits {count} | የእንግዶች ብዛት፦ {count} | |
| `messages/am.json` | card.showAtEntrance | Show this code at the entrance | ይህን ኮድ መግቢያ ላይ ያሳዩ | |
| `messages/am.json` | card.ready | Your personal invitation card is ready. | የግል የግብዣ ካርድዎ ዝግጁ ነው። | |
| `messages/am.json` | card.download | Download card | ካርዱን ያውርዱ | |
| `messages/am.json` | card.viewAndShare | View and share | ይመልከቱ እና ያጋሩ | |
| `messages/am.json` | card.imageAlt | Invitation card for {name} | ለ{name} የተዘጋጀ የግብዣ ካርድ | |
| `messages/am.json` | card.pageTitle | Invitation for {name} | የ{name} ግብዣ | |
| `messages/am.json` | card.pageIntro | Save this card to your phone and show its QR code at the entrance. | ይህን ካርድ በስልክዎ ያስቀምጡ፤ መግቢያ ላይ QR ኮዱን ያሳዩ። | |
| `messages/am.json` | card.share | Share | አጋራ | |
| `messages/am.json` | card.shareText | My invitation to the wedding of {couple} | የ{couple} የሠርግ ግብዣዬ | |
| `messages/am.json` | card.whatsapp / card.telegram | WhatsApp / Telegram | ዋትስአፕ / ቴሌግራም | |
| `messages/am.json` | card.copyLink | Copy link | ማስፈንጠሪያውን ቅዳ | |
| `messages/am.json` | card.copied | Link copied | ማስፈንጠሪያው ተቀድቷል | |
| `messages/am.json` | card.copyFailed | Couldn't copy the link. | ማስፈንጠሪያውን መቅዳት አልተቻለም። | |
| `messages/am.json` | card.openSite | Open the wedding website | የሠርጉን ድረ-ገጽ ይክፈቱ | |
| `messages/am.json` | card.pass.title | Entry pass | የመግቢያ ማረጋገጫ | |
| `messages/am.json` | card.pass.valid | Valid invitation | ትክክለኛ ግብዣ | |
| `messages/am.json` | card.pass.invalid | Invitation not valid | ግብዣው ትክክል አይደለም | |
| `messages/am.json` | card.pass.invalidBody | This invitation was cancelled or the code is wrong. Please check with the couple's family. | ይህ ግብዣ ተሰርዟል ወይም ኮዱ ትክክል አይደለም። እባክዎ የሙሽሮቹን ቤተሰብ ያነጋግሩ። | |

## Couple's private page

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | couplePortal.title | Your RSVPs and wishes | ምላሾች እና መልካም ምኞቶች | |
| `messages/am.json` | couplePortal.unlockTitle | Your private page | የግል ገጽዎ | |
| `messages/am.json` | couplePortal.unlockIntro | Enter the passcode you were sent separately. | ለብቻው የተላከልዎትን የይለፍ ኮድ ያስገቡ። | |
| `messages/am.json` | couplePortal.passcode | Passcode | የይለፍ ኮድ | |
| `messages/am.json` | couplePortal.unlock / unlocking | Open / Opening… | ክፈት / በመክፈት ላይ… | |
| `messages/am.json` | couplePortal.noLink | Open the private link you were sent. If you lost it, ask for a new one. | የተላከልዎትን የግል ማስፈንጠሪያ ይክፈቱ። ከጠፋብዎ አዲስ ይጠይቁ። | |
| `messages/am.json` | couplePortal.signOut | Sign out | ውጣ | |
| `messages/am.json` | couplePortal.errors.invalid | That passcode or link isn't right. | የይለፍ ኮዱ ወይም ማስፈንጠሪያው ትክክል አይደለም። | |
| `messages/am.json` | couplePortal.errors.locked | Too many wrong tries. The page is locked for a while; try again later. | ብዙ የተሳሳቱ ሙከራዎች ተደርገዋል። ገጹ ለተወሰነ ጊዜ ተቆልፏል፤ ቆይተው ይሞክሩ። | |
| `messages/am.json` | couplePortal.errors.rateLimited | Too many attempts. Wait a minute and try again. | ብዙ ሙከራዎች ተደርገዋል። ከአንድ ደቂቃ በኋላ እንደገና ይሞክሩ። | |
| `messages/am.json` | couplePortal.errors.generic | Something went wrong. Check your connection and try again. | ችግር ተፈጥሯል። ግንኙነትዎን አረጋግጠው እንደገና ይሞክሩ። | |
| `messages/am.json` | couplePortal.stats.* | Responses / Guests coming / Can't come | ምላሾች / የሚመጡ እንግዶች / የማይመጡ | |
| `messages/am.json` | couplePortal.wishesHeading | Wishes | መልካም ምኞቶች | |
| `messages/am.json` | couplePortal.noWishes | No wishes yet. Messages from the RSVP form appear here. | እስካሁን ምንም መልዕክት የለም። ከምላሽ ቅጹ የሚመጡ መልዕክቶች እዚህ ይታያሉ። | |
| `messages/am.json` | couplePortal.hide / unhide | Hide / Show again | ደብቅ / መልሰህ አሳይ | |
| `messages/am.json` | couplePortal.hiddenHeading | Hidden wishes ({count}) | የተደበቁ መልዕክቶች ({count}) | |
| `messages/am.json` | couplePortal.guestsHeading | Guests | እንግዶች | |
| `messages/am.json` | couplePortal.noGuests | No responses yet. | እስካሁን ምላሽ የለም። | |
| `messages/am.json` | couplePortal.coming / notComing | Coming / Can't come | ይመጣሉ / አይመጡም | |
| `messages/am.json` | couplePortal.guestCount | Guests | እንግዶች | |
| `messages/am.json` | couplePortal.downloadCard | Download card | ካርዱን አውርድ | |
| `messages/am.json` | couplePortal.sendWhatsApp | Send on WhatsApp | በዋትስአፕ ላክ | |
| `messages/am.json` | couplePortal.copyCardLink | Copy card link | የካርዱን ማስፈንጠሪያ ቅዳ | |
| `messages/am.json` | couplePortal.copied / copyFailed | Copied / Couldn't copy the link. | ተቀድቷል / ማስፈንጠሪያውን መቅዳት አልተቻለም። | |
| `messages/am.json` | couplePortal.cardShareText | Your invitation card for the wedding of {couple}: {url} | ለ{couple} ሠርግ የተዘጋጀ የግብዣ ካርድዎ፦ {url} | |

## Phase 4: Reel layout

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | layouts.reel.presents | Two families present | ሁለት ቤተሰቦች ያቀርባሉ | |
| `messages/am.json` | layouts.reel.starring | Starring | ዋና ተዋንያን | |
| `messages/am.json` | layouts.reel.scenes | The scenes | ትዕይንቶች | |
| `messages/am.json` | layouts.reel.locations | Locations | ቦታዎች | |
| `messages/am.json` | layouts.reel.stills | Stills | ምስሎች | |
| `messages/am.json` | layouts.reel.ending | And so it begins | እናም ይጀምራል | |
| `messages/am.json` | layouts.reel.date | Date | ቀን | |
| `messages/am.json` | layouts.reel.time | Time | ሰዓት | |
| `messages/am.json` | layouts.reel.venue | Venue | ቦታ | |

## Phase 4: Noir & Gold layout

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | layouts.noir.accountNumber | Account number | የሂሳብ ቁጥር | |
| `messages/am.json` | layouts.noir.morePhotos | See {count, plural, one {# more photo} other {# more photos}} | ተጨማሪ {count} ፎቶዎችን ይመልከቱ | |

## Phase 4: Gilded Arches layout

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | layouts.arches.allPhotos | View all {count} photos | ሁሉንም {count} ፎቶዎች ይመልከቱ | |

## T2: Habesha event presets

The other default event titles are in the table at the top. The reception
title was respelled with ሠ to match ሠርግ everywhere else on the site.

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `src/lib/event-kinds.ts` | reception title | Reception | የሠርግ ግብዣ | |

## Phase 4: Stories layout

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | layouts.stories.open | Open the invitation | ግብዣውን ይክፈቱ | |
| `messages/am.json` | layouts.stories.previous | Previous page | ቀዳሚ ገጽ | |
| `messages/am.json` | layouts.stories.next | Next page | ቀጣይ ገጽ | |
| `messages/am.json` | layouts.stories.thanks | Thank you | እናመሰግናለን | |
| `messages/am.json` | layouts.stories.restart | Back to the start | ወደ መጀመሪያው ይመለሱ | |
| `messages/am.json` | layouts.stories.allPhotos | View all {count} photos | ሁሉንም {count} ፎቶዎች ይመልከቱ | |

## Phase 4: Kaba Velvet layout

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | layouts.kaba.mels | A family tradition | የቤተሰብ ወግ | |

## Phase 4: Flat-lay Suite layout

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | layouts.flatlay.thanks | Thank you | እናመሰግናለን | |
| `messages/am.json` | layouts.flatlay.thanksNote | We are so grateful to share this day with you. | ይህን ቀን ከእናንተ ጋር በማሳለፋችን እጅግ ደስተኞች ነን። | |
| `messages/am.json` | layouts.flatlay.allPhotos | View all {count} photos | ሁሉንም {count} ፎቶዎች ይመልከቱ | |
