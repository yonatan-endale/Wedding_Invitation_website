# Amharic strings waiting for a native speaker

New Amharic text added during the save-the-date, openings, motion and layouts
work. Each phase adds its strings here; a phase ships to guests only after its
rows are reviewed. Mark a row done by filling in the reviewer and date.

| Where                    | Key or context            | English          | Amharic draft  | Reviewer, date |
| ------------------------ | ------------------------- | ---------------- | -------------- | -------------- |
| `src/lib/event-kinds.ts` | telosh title              | Telosh           | ጥሎሽ            |                |
| `src/lib/event-kinds.ts` | ceremony_orthodox title   | Church ceremony  | የቤተክርስቲያን ሥርዓት |                |
| `src/lib/event-kinds.ts` | ceremony_protestant title | Wedding service  | የጋብቻ አገልግሎት    |                |
| `src/lib/event-kinds.ts` | ceremony_civil title      | Vow ceremony     | የቃልኪዳን ሥርዓት    |                |
| `src/lib/event-kinds.ts` | nikah title               | Nikah            | ኒካህ            |                |
| `src/lib/event-kinds.ts` | photos title              | Photo session    | የፎቶ ፕሮግራም      |                |
| `src/lib/event-kinds.ts` | blessing title            | Elders' blessing | የሽማግሌዎች ምርቃት   |                |
| `src/lib/event-kinds.ts` | mels title                | Mels             | መልስ            |                |
| `src/lib/event-kinds.ts` | kelekel title             | Kelekel          | ቅልቅል           |                |
| `src/lib/event-kinds.ts` | buna title                | Coffee ceremony  | የቡና ሥነ ሥርዓት    |                |

## Conventions to confirm

- Monogram separator on Amharic pages: the Ethiopic wordspace "፡" instead of "&".
- Initials on Amharic pages use the first fidel of each Amharic first name.

## Phase 1: save-the-date and countdown

| Where              | Key or context               | English                                               | Amharic draft                                        | Reviewer, date |
| ------------------ | ---------------------------- | ----------------------------------------------------- | ---------------------------------------------------- | -------------- |
| `messages/am.json` | saveTheDate.title            | Save the date                                         | ቀኑን ይያዙ                                              |                |
| `messages/am.json` | saveTheDate.couple           | {one} and {two}                                       | {one} እና {two}                                       |                |
| `messages/am.json` | saveTheDate.switchLabel      | Calendar                                              | የቀን አቆጣጠር                                            |                |
| `messages/am.json` | saveTheDate.ethiopian        | Ethiopian                                             | ኢትዮጵያ                                                |                |
| `messages/am.json` | saveTheDate.gregorian        | Gregorian                                             | ፈረንጅ                                                 |                |
| `messages/am.json` | saveTheDate.captionGregorian | {month} {year}, with the wedding day marked           | {month} {year}፣ የሠርጉ ቀን ምልክት ተደርጎበታል                 |                |
| `messages/am.json` | countdown.summary            | {days} days, {hours} hours and {minutes} minutes left | {days} ቀናት፣ {hours} ሰዓታት እና {minutes} ደቂቃዎች ቀርተዋል    |                |
| `messages/am.json` | countdown.summarySince       | … since the wedding                                   | ከሠርጉ ወዲህ {days} ቀናት፣ {hours} ሰዓታት እና {minutes} ደቂቃዎች |                |

## Phase 2: openings

| Where              | Key or context             | English                                  | Amharic draft                  | Reviewer, date |
| ------------------ | -------------------------- | ---------------------------------------- | ------------------------------ | -------------- |
| `messages/am.json` | intro.dear                 | Dear {name},                             | ውድ {name}፣                     |                |
| `messages/am.json` | intro.pressToOpen          | Press to open                            | ለመክፈት ይጫኑ                      |                |
| `messages/am.json` | intro.sealLabel            | Open the invitation from {one} and {two} | ከ{one} እና {two} የመጣውን ግብዣ ይክፈቱ |                |
| `messages/am.json` | intro.openEnvelope         | Tap the envelope to open                 | ለመክፈት ፖስታውን ይንኩ                |                |
| `messages/am.json` | intro.letter               | invite you to celebrate their wedding    | በሠርጋቸው ላይ እንዲገኙ ይጋብዙዎታል        |                |
| `messages/am.json` | intro.tapFlower            | Tap the flower to open                   | ለመክፈት አበባውን ይንኩ                |                |
| Seal monogram      | separator on Amharic pages | A & M (interlocked)                      | ዳ ፡ ሲ                          |                |

## Phase 3: section motion

| Where              | Key or context | English      | Amharic draft | Reviewer, date |
| ------------------ | -------------- | ------------ | ------------- | -------------- |
| `messages/am.json` | motion.pause   | Pause motion | እንቅስቃሴን አቁም   |                |
| `messages/am.json` | motion.play    | Play motion  | እንቅስቃሴን አስጀምር |                |

## Guest cards and entry pass

| Where              | Key or context                | English                                                                                    | Amharic draft                                           | Reviewer, date |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------- | -------------- |
| `messages/am.json` | card.dear                     | Dear {name},                                                                               | ውድ {name}፣                                              |                |
| `messages/am.json` | card.admits                   | Admits {count}                                                                             | የእንግዶች ብዛት፦ {count}                                     |                |
| `messages/am.json` | card.showAtEntrance           | Show this code at the entrance                                                             | ይህን ኮድ መግቢያ ላይ ያሳዩ                                      |                |
| `messages/am.json` | card.ready                    | Your personal invitation card is ready.                                                    | የግል የግብዣ ካርድዎ ዝግጁ ነው።                                   |                |
| `messages/am.json` | card.download                 | Download card                                                                              | ካርዱን ያውርዱ                                               |                |
| `messages/am.json` | card.viewAndShare             | View and share                                                                             | ይመልከቱ እና ያጋሩ                                            |                |
| `messages/am.json` | card.imageAlt                 | Invitation card for {name}                                                                 | ለ{name} የተዘጋጀ የግብዣ ካርድ                                  |                |
| `messages/am.json` | card.pageTitle                | Invitation for {name}                                                                      | የ{name} ግብዣ                                             |                |
| `messages/am.json` | card.pageIntro                | Save this card to your phone and show its QR code at the entrance.                         | ይህን ካርድ በስልክዎ ያስቀምጡ፤ መግቢያ ላይ QR ኮዱን ያሳዩ።                |                |
| `messages/am.json` | card.share                    | Share                                                                                      | አጋራ                                                     |                |
| `messages/am.json` | card.shareText                | My invitation to the wedding of {couple}                                                   | የ{couple} የሠርግ ግብዣዬ                                     |                |
| `messages/am.json` | card.whatsapp / card.telegram | WhatsApp / Telegram                                                                        | ዋትስአፕ / ቴሌግራም                                           |                |
| `messages/am.json` | card.copyLink                 | Copy link                                                                                  | ማስፈንጠሪያውን ቅዳ                                            |                |
| `messages/am.json` | card.copied                   | Link copied                                                                                | ማስፈንጠሪያው ተቀድቷል                                          |                |
| `messages/am.json` | card.copyFailed               | Couldn't copy the link.                                                                    | ማስፈንጠሪያውን መቅዳት አልተቻለም።                                  |                |
| `messages/am.json` | card.openSite                 | Open the wedding website                                                                   | የሠርጉን ድረ-ገጽ ይክፈቱ                                        |                |
| `messages/am.json` | card.pass.title               | Entry pass                                                                                 | የመግቢያ ማረጋገጫ                                             |                |
| `messages/am.json` | card.pass.valid               | Valid invitation                                                                           | ትክክለኛ ግብዣ                                               |                |
| `messages/am.json` | card.pass.invalid             | Invitation not valid                                                                       | ግብዣው ትክክል አይደለም                                         |                |
| `messages/am.json` | card.pass.invalidBody         | This invitation was cancelled or the code is wrong. Please check with the couple's family. | ይህ ግብዣ ተሰርዟል ወይም ኮዱ ትክክል አይደለም። እባክዎ የሙሽሮቹን ቤተሰብ ያነጋግሩ። |                |

## Couple's private page

| Where              | Key or context                   | English                                                                 | Amharic draft                                        | Reviewer, date |
| ------------------ | -------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- | -------------- |
| `messages/am.json` | couplePortal.title               | Your RSVPs and wishes                                                   | ምላሾች እና መልካም ምኞቶች                                    |                |
| `messages/am.json` | couplePortal.unlockTitle         | Your private page                                                       | የግል ገጽዎ                                              |                |
| `messages/am.json` | couplePortal.unlockIntro         | Enter the passcode you were sent separately.                            | ለብቻው የተላከልዎትን የይለፍ ኮድ ያስገቡ።                          |                |
| `messages/am.json` | couplePortal.passcode            | Passcode                                                                | የይለፍ ኮድ                                              |                |
| `messages/am.json` | couplePortal.unlock / unlocking  | Open / Opening…                                                         | ክፈት / በመክፈት ላይ…                                      |                |
| `messages/am.json` | couplePortal.noLink              | Open the private link you were sent. If you lost it, ask for a new one. | የተላከልዎትን የግል ማስፈንጠሪያ ይክፈቱ። ከጠፋብዎ አዲስ ይጠይቁ።           |                |
| `messages/am.json` | couplePortal.signOut             | Sign out                                                                | ውጣ                                                   |                |
| `messages/am.json` | couplePortal.errors.invalid      | That passcode or link isn't right.                                      | የይለፍ ኮዱ ወይም ማስፈንጠሪያው ትክክል አይደለም።                     |                |
| `messages/am.json` | couplePortal.errors.locked       | Too many wrong tries. The page is locked for a while; try again later.  | ብዙ የተሳሳቱ ሙከራዎች ተደርገዋል። ገጹ ለተወሰነ ጊዜ ተቆልፏል፤ ቆይተው ይሞክሩ። |                |
| `messages/am.json` | couplePortal.errors.rateLimited  | Too many attempts. Wait a minute and try again.                         | ብዙ ሙከራዎች ተደርገዋል። ከአንድ ደቂቃ በኋላ እንደገና ይሞክሩ።            |                |
| `messages/am.json` | couplePortal.errors.generic      | Something went wrong. Check your connection and try again.              | ችግር ተፈጥሯል። ግንኙነትዎን አረጋግጠው እንደገና ይሞክሩ።                |                |
| `messages/am.json` | couplePortal.stats.\*            | Responses / Guests coming / Can't come                                  | ምላሾች / የሚመጡ እንግዶች / የማይመጡ                            |                |
| `messages/am.json` | couplePortal.wishesHeading       | Wishes                                                                  | መልካም ምኞቶች                                            |                |
| `messages/am.json` | couplePortal.noWishes            | No wishes yet. Messages from the RSVP form appear here.                 | እስካሁን ምንም መልዕክት የለም። ከምላሽ ቅጹ የሚመጡ መልዕክቶች እዚህ ይታያሉ።   |                |
| `messages/am.json` | couplePortal.hide / unhide       | Hide / Show again                                                       | ደብቅ / መልሰህ አሳይ                                       |                |
| `messages/am.json` | couplePortal.hiddenHeading       | Hidden wishes ({count})                                                 | የተደበቁ መልዕክቶች ({count})                               |                |
| `messages/am.json` | couplePortal.guestsHeading       | Guests                                                                  | እንግዶች                                                |                |
| `messages/am.json` | couplePortal.noGuests            | No responses yet.                                                       | እስካሁን ምላሽ የለም።                                       |                |
| `messages/am.json` | couplePortal.coming / notComing  | Coming / Can't come                                                     | ይመጣሉ / አይመጡም                                         |                |
| `messages/am.json` | couplePortal.guestCount          | Guests                                                                  | እንግዶች                                                |                |
| `messages/am.json` | couplePortal.downloadCard        | Download card                                                           | ካርዱን አውርድ                                            |                |
| `messages/am.json` | couplePortal.sendWhatsApp        | Send on WhatsApp                                                        | በዋትስአፕ ላክ                                            |                |
| `messages/am.json` | couplePortal.copyCardLink        | Copy card link                                                          | የካርዱን ማስፈንጠሪያ ቅዳ                                     |                |
| `messages/am.json` | couplePortal.copied / copyFailed | Copied / Couldn't copy the link.                                        | ተቀድቷል / ማስፈንጠሪያውን መቅዳት አልተቻለም።                       |                |
| `messages/am.json` | couplePortal.cardShareText       | Your invitation card for the wedding of {couple}: {url}                 | ለ{couple} ሠርግ የተዘጋጀ የግብዣ ካርድዎ፦ {url}                 |                |

## Phase 4: Reel layout

| Where              | Key or context         | English              | Amharic draft   | Reviewer, date |
| ------------------ | ---------------------- | -------------------- | --------------- | -------------- |
| `messages/am.json` | layouts.reel.presents  | Two families present | ሁለት ቤተሰቦች ያቀርባሉ |                |
| `messages/am.json` | layouts.reel.starring  | Starring             | ዋና ተዋንያን        |                |
| `messages/am.json` | layouts.reel.scenes    | The scenes           | ትዕይንቶች          |                |
| `messages/am.json` | layouts.reel.locations | Locations            | ቦታዎች            |                |
| `messages/am.json` | layouts.reel.stills    | Stills               | ምስሎች            |                |
| `messages/am.json` | layouts.reel.ending    | And so it begins     | እናም ይጀምራል       |                |
| `messages/am.json` | layouts.reel.date      | Date                 | ቀን              |                |
| `messages/am.json` | layouts.reel.time      | Time                 | ሰዓት             |                |
| `messages/am.json` | layouts.reel.venue     | Venue                | ቦታ              |                |

## Phase 4: Noir & Gold layout

| Where              | Key or context             | English                                                       | Amharic draft            | Reviewer, date |
| ------------------ | -------------------------- | ------------------------------------------------------------- | ------------------------ | -------------- |
| `messages/am.json` | layouts.noir.accountNumber | Account number                                                | የሂሳብ ቁጥር                 |                |
| `messages/am.json` | layouts.noir.morePhotos    | See {count, plural, one {# more photo} other {# more photos}} | ተጨማሪ {count} ፎቶዎችን ይመልከቱ |                |

## Phase 4: Gilded Arches layout

| Where              | Key or context           | English                 | Amharic draft           | Reviewer, date |
| ------------------ | ------------------------ | ----------------------- | ----------------------- | -------------- |
| `messages/am.json` | layouts.arches.allPhotos | View all {count} photos | ሁሉንም {count} ፎቶዎች ይመልከቱ |                |

## T2: Habesha event presets

The other default event titles are in the table at the top. The reception
title was respelled with ሠ to match ሠርግ everywhere else on the site.

| Where                    | Key or context  | English   | Amharic draft | Reviewer, date |
| ------------------------ | --------------- | --------- | ------------- | -------------- |
| `src/lib/event-kinds.ts` | reception title | Reception | የሠርግ ግብዣ      |                |

## Phase 4: Stories layout

| Where              | Key or context            | English                 | Amharic draft           | Reviewer, date |
| ------------------ | ------------------------- | ----------------------- | ----------------------- | -------------- |
| `messages/am.json` | layouts.stories.open      | Open the invitation     | ግብዣውን ይክፈቱ              |                |
| `messages/am.json` | layouts.stories.previous  | Previous page           | ቀዳሚ ገጽ                  |                |
| `messages/am.json` | layouts.stories.next      | Next page               | ቀጣይ ገጽ                  |                |
| `messages/am.json` | layouts.stories.thanks    | Thank you               | እናመሰግናለን                |                |
| `messages/am.json` | layouts.stories.restart   | Back to the start       | ወደ መጀመሪያው ይመለሱ          |                |
| `messages/am.json` | layouts.stories.allPhotos | View all {count} photos | ሁሉንም {count} ፎቶዎች ይመልከቱ |                |

## Phase 4: Kaba Velvet layout

| Where              | Key or context    | English            | Amharic draft | Reviewer, date |
| ------------------ | ----------------- | ------------------ | ------------- | -------------- |
| `messages/am.json` | layouts.kaba.mels | A family tradition | የቤተሰብ ወግ      |                |

## Phase 4: Flat-lay Suite layout

| Where              | Key or context             | English                                        | Amharic draft                         | Reviewer, date |
| ------------------ | -------------------------- | ---------------------------------------------- | ------------------------------------- | -------------- |
| `messages/am.json` | layouts.flatlay.thanks     | Thank you                                      | እናመሰግናለን                              |                |
| `messages/am.json` | layouts.flatlay.thanksNote | We are so grateful to share this day with you. | ይህን ቀን ከእናንተ ጋር በማሳለፋችን እጅግ ደስተኞች ነን። |                |
| `messages/am.json` | layouts.flatlay.allPhotos  | View all {count} photos                        | ሁሉንም {count} ፎቶዎች ይመልከቱ               |                |

## Core site text (written before this list existed)

These strings came with the original site and were never logged. They need the same native review.

| Where              | Key or context               | English                                                                                                   | Amharic draft                                                             | Reviewer, date |
| ------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------- |
| `messages/am.json` | intro.invited                | You are invited to the wedding of                                                                         | በሠርጋችን ላይ እንዲገኙ ተጋብዘዋል                                                    |                |
| `messages/am.json` | intro.open                   | Open invitation                                                                                           | ግብዣውን ይክፈቱ                                                                |                |
| `messages/am.json` | nav.label                    | Sections                                                                                                  | ክፍሎች                                                                      |                |
| `messages/am.json` | nav.menu                     | Menu                                                                                                      | ማውጫ                                                                       |                |
| `messages/am.json` | nav.close                    | Close menu                                                                                                | ማውጫውን ዝጋ                                                                  |                |
| `messages/am.json` | nav.invitation               | Invitation                                                                                                | ግብዣ                                                                       |                |
| `messages/am.json` | nav.couple                   | The couple                                                                                                | ሙሽሮቹ                                                                      |                |
| `messages/am.json` | nav.story                    | Our story                                                                                                 | ታሪካችን                                                                     |                |
| `messages/am.json` | nav.schedule                 | The day                                                                                                   | የዕለቱ መርሐ ግብር                                                              |                |
| `messages/am.json` | nav.venues                   | Venues                                                                                                    | ቦታዎች                                                                      |                |
| `messages/am.json` | nav.gallery                  | Gallery                                                                                                   | ፎቶዎች                                                                      |                |
| `messages/am.json` | nav.gifts                    | Gifts                                                                                                     | ስጦታ                                                                       |                |
| `messages/am.json` | nav.rsvp                     | RSVP                                                                                                      | ምላሽ                                                                       |                |
| `messages/am.json` | language.label               | Language                                                                                                  | ቋንቋ                                                                       |                |
| `messages/am.json` | language.en                  | English                                                                                                   | English                                                                   |                |
| `messages/am.json` | language.am                  | አማርኛ                                                                                                      | አማርኛ                                                                      |                |
| `messages/am.json` | couple.heading               | The couple                                                                                                | ሙሽሮቹ                                                                      |                |
| `messages/am.json` | couple.bride                 | The bride                                                                                                 | ሙሽሪት                                                                      |                |
| `messages/am.json` | couple.groom                 | The groom                                                                                                 | ሙሽራ                                                                       |                |
| `messages/am.json` | footer.families              | With love, the families of the bride and groom                                                            | በፍቅር፣ የሙሽሪት እና የሙሽራው ቤተሰቦች                                                |                |
| `messages/am.json` | countdown.heading            | Wedding day                                                                                               | የሠርጉ ቀን                                                                   |                |
| `messages/am.json` | countdown.label              | Time until the wedding                                                                                    | ለሠርጉ ቀን የቀረው ጊዜ                                                           |                |
| `messages/am.json` | countdown.until              | Left for the big day                                                                                      | ለታላቁ ቀን የቀረው                                                              |                |
| `messages/am.json` | countdown.since              | Since we got married                                                                                      | ከተጋባንበት ቀን ጀምሮ                                                            |                |
| `messages/am.json` | countdown.days               | days                                                                                                      | ቀናት                                                                       |                |
| `messages/am.json` | countdown.hours              | hours                                                                                                     | ሰዓታት                                                                      |                |
| `messages/am.json` | countdown.minutes            | minutes                                                                                                   | ደቂቃዎች                                                                     |                |
| `messages/am.json` | countdown.seconds            | seconds                                                                                                   | ሰከንዶች                                                                     |                |
| `messages/am.json` | saveTheDate.captionEthiopian | {month} {year} in the Ethiopian calendar, with the wedding day marked                                     | {month} {year} ዓ.ም.፣ የሠርጉ ቀን ምልክት ተደርጎበታል                                 |                |
| `messages/am.json` | saveTheDate.weddingDay       | Wedding day                                                                                               | የሠርጉ ቀን                                                                   |                |
| `messages/am.json` | invitation.eyebrow           | Wedding invitation                                                                                        | የሠርግ ግብዣ                                                                  |                |
| `messages/am.json` | invitation.hostsFallback     | Together with their families                                                                              | ከቤተሰቦቻቸው ጋር በመሆን                                                          |                |
| `messages/am.json` | invitation.defaultText       | request the pleasure of your company as they celebrate their marriage.                                    | በጋብቻቸው ቀን ተገኝተው የደስታቸው ተካፋይ እንዲሆኑ በአክብሮት ተጋብዘዋል።                          |                |
| `messages/am.json` | invitation.dressCode         | Dress code                                                                                                | የአለባበስ ሥርዓት                                                               |                |
| `messages/am.json` | invitation.ethiopianDate     | Ethiopian calendar                                                                                        | በኢትዮጵያ አቆጣጠር                                                              |                |
| `messages/am.json` | story.heading                | Our story                                                                                                 | ታሪካችን                                                                     |                |
| `messages/am.json` | schedule.heading             | The day                                                                                                   | የዕለቱ መርሐ ግብር                                                              |                |
| `messages/am.json` | schedule.directions          | Directions                                                                                                | አቅጣጫ                                                                      |                |
| `messages/am.json` | schedule.viewLocation        | View location                                                                                             | ቦታውን ይመልከቱ                                                                |                |
| `messages/am.json` | schedule.end                 | End of the day                                                                                            | የዕለቱ መጨረሻ                                                                 |                |
| `messages/am.json` | schedule.endAt               | End of the day, {time}                                                                                    | የዕለቱ መጨረሻ፣ {time}                                                         |                |
| `messages/am.json` | venues.heading               | Where to find us                                                                                          | የሥነ ሥርዓቱ ቦታዎች                                                             |                |
| `messages/am.json` | venues.openMaps              | Open in Google Maps                                                                                       | በጎግል ካርታ ይክፈቱ                                                             |                |
| `messages/am.json` | venues.showMap               | Show map                                                                                                  | ካርታ አሳይ                                                                   |                |
| `messages/am.json` | venues.hideMap               | Hide map                                                                                                  | ካርታ ደብቅ                                                                   |                |
| `messages/am.json` | venues.mapTitle              | Map of {name}                                                                                             | የ{name} ካርታ                                                               |                |
| `messages/am.json` | gallery.heading              | Gallery                                                                                                   | ፎቶዎች                                                                      |                |
| `messages/am.json` | gallery.previous             | Previous photo                                                                                            | ቀዳሚ ፎቶ                                                                    |                |
| `messages/am.json` | gallery.next                 | Next photo                                                                                                | ቀጣይ ፎቶ                                                                    |                |
| `messages/am.json` | gallery.open                 | View photo {index} full screen                                                                            | ፎቶ {index}ን በሙሉ ገጽ ይመልከቱ                                                  |                |
| `messages/am.json` | gallery.close                | Close                                                                                                     | ዝጋ                                                                        |                |
| `messages/am.json` | gallery.counter              | {current} of {total}                                                                                      | {current} / {total}                                                       |                |
| `messages/am.json` | gifts.heading                | Gifts                                                                                                     | ስጦታ                                                                       |                |
| `messages/am.json` | gifts.defaultNote            | Your presence is the greatest gift. If you would like to bless us further, you can use the details below. | የእርስዎ መገኘት ትልቁ ስጦታችን ነው። ተጨማሪ ስጦታ መስጠት ከፈለጉ ከዚህ በታች ያሉትን መረጃዎች መጠቀም ይችላሉ። |                |
| `messages/am.json` | gifts.accountName            | Account name                                                                                              | የሂሳብ ባለቤት ስም                                                              |                |
| `messages/am.json` | gifts.copy                   | Copy number                                                                                               | ቁጥሩን ቅዳ                                                                   |                |
| `messages/am.json` | gifts.copied                 | Copied                                                                                                    | ተቀድቷል                                                                     |                |
| `messages/am.json` | gifts.copyFailed             | Copy didn't work. Select the number and copy it manually.                                                 | መቅዳት አልተሳካም። ቁጥሩን መርጠው በእጅ ይቅዱ።                                           |                |
| `messages/am.json` | gifts.showQr                 | Show QR code                                                                                              | QR ኮድ አሳይ                                                                 |                |
| `messages/am.json` | gifts.hideQr                 | Hide QR code                                                                                              | QR ኮድ ደብቅ                                                                 |                |
| `messages/am.json` | gifts.qrAlt                  | QR code for {number}                                                                                      | የ{number} QR ኮድ                                                           |                |
| `messages/am.json` | gifts.wishlist               | Wishlist                                                                                                  | የስጦታ ዝርዝር                                                                 |                |
| `messages/am.json` | gifts.viewItem               | View item                                                                                                 | ዕቃውን ይመልከቱ                                                                |                |
| `messages/am.json` | gifts.kind.bank              | Bank transfer                                                                                             | የባንክ ዝውውር                                                                 |                |
| `messages/am.json` | gifts.kind.telebirr          | Telebirr                                                                                                  | ቴሌብር                                                                      |                |
| `messages/am.json` | gifts.kind.other             | Other                                                                                                     | ሌላ                                                                        |                |
| `messages/am.json` | rsvp.heading                 | RSVP                                                                                                      | መገኘትዎን ያሳውቁን                                                              |                |
| `messages/am.json` | rsvp.intro                   | Please let us know whether you can join us.                                                               | መገኘት ይችሉ እንደሆነ እባክዎ ያሳውቁን።                                                |                |
| `messages/am.json` | rsvp.replyBy                 | Please reply by {date}.                                                                                   | እባክዎ እስከ {date} ድረስ ምላሽ ይስጡ።                                              |                |
| `messages/am.json` | rsvp.closed                  | RSVPs are closed. Please contact the couple directly.                                                     | የምላሽ መስጫ ጊዜው አልፏል። እባክዎ ሙሽሮቹን በቀጥታ ያነጋግሩ።                                 |                |
| `messages/am.json` | rsvp.name                    | Full name                                                                                                 | ሙሉ ስም                                                                     |                |
| `messages/am.json` | rsvp.phone                   | Phone number                                                                                              | ስልክ ቁጥር                                                                   |                |
| `messages/am.json` | rsvp.email                   | Email (optional)                                                                                          | ኢሜይል (አማራጭ)                                                               |                |
| `messages/am.json` | rsvp.attendance              | Will you attend?                                                                                          | ይገኛሉ?                                                                     |                |
| `messages/am.json` | rsvp.yes                     | Joyfully accept                                                                                           | በደስታ እገኛለሁ                                                                |                |
| `messages/am.json` | rsvp.no                      | Regretfully decline                                                                                       | መገኘት አልችልም                                                                |                |
| `messages/am.json` | rsvp.guestCount              | Guests, including you                                                                                     | እርስዎን ጨምሮ የእንግዶች ብዛት                                                      |                |
| `messages/am.json` | rsvp.message                 | Message for the couple (optional)                                                                         | ለሙሽሮቹ መልዕክት (አማራጭ)                                                        |                |
| `messages/am.json` | rsvp.submit                  | Send RSVP                                                                                                 | ምላሽ ላክ                                                                    |                |
| `messages/am.json` | rsvp.sending                 | Sending…                                                                                                  | በመላክ ላይ…                                                                  |                |
| `messages/am.json` | rsvp.thanksYes               | Thank you, {name}. We can't wait to celebrate with you.                                                   | እናመሰግናለን {name}። አብረን ለማክበር በጉጉት እንጠብቃለን።                                 |                |
| `messages/am.json` | rsvp.thanksNo                | Thank you for letting us know, {name}. You'll be missed.                                                  | ስላሳወቁን እናመሰግናለን {name}። እንናፍቅዎታለን።                                        |                |
| `messages/am.json` | rsvp.another                 | Send another response                                                                                     | ሌላ ምላሽ ላክ                                                                 |                |
| `messages/am.json` | rsvp.errors.name             | Enter your full name.                                                                                     | ሙሉ ስምዎን ያስገቡ።                                                             |                |
| `messages/am.json` | rsvp.errors.phone            | Enter a phone number, for example +251 911 234 567.                                                       | ስልክ ቁጥር ያስገቡ፤ ለምሳሌ +251 911 234 567።                                      |                |
| `messages/am.json` | rsvp.errors.email            | Enter a valid email or leave it empty.                                                                    | ትክክለኛ ኢሜይል ያስገቡ ወይም ባዶ ይተዉት።                                              |                |
| `messages/am.json` | rsvp.errors.guestCount       | Choose between 1 and 10 guests.                                                                           | ከ1 እስከ 10 እንግዶች ይምረጡ።                                                     |                |
| `messages/am.json` | rsvp.errors.message          | Keep the message under 500 characters.                                                                    | መልዕክቱ ከ500 ፊደላት ያነሰ ይሁን።                                                  |                |
| `messages/am.json` | rsvp.errors.attending        | Choose whether you will attend.                                                                           | ይገኙ እንደሆነ ይምረጡ።                                                           |                |
| `messages/am.json` | rsvp.errors.generic          | Your RSVP wasn't sent. Check your connection and try again.                                               | ምላሽዎ አልተላከም። ግንኙነትዎን አረጋግጠው እንደገና ይሞክሩ።                                   |                |
| `messages/am.json` | rsvp.errors.rateLimited      | Too many attempts. Wait a minute and try again.                                                           | ብዙ ሙከራዎች ተደርገዋል። ከአንድ ደቂቃ በኋላ እንደገና ይሞክሩ።                                 |                |
| `messages/am.json` | rsvp.errors.closed           | RSVPs for this wedding are closed.                                                                        | የዚህ ሠርግ የምላሽ መስጫ ተዘግቷል።                                                   |                |
| `messages/am.json` | memories.heading             | Share your photos                                                                                         | ፎቶዎችዎን ያጋሩን                                                               |                |
| `messages/am.json` | memories.body                | Took photos at the wedding? Send them to us on Telegram.                                                  | በሠርጉ ላይ ፎቶ አንስተዋል? በቴሌግራም ይላኩልን።                                          |                |
| `messages/am.json` | memories.cta                 | Open Telegram                                                                                             | ቴሌግራም ክፈት                                                                 |                |
| `messages/am.json` | music.play                   | Play music                                                                                                | ሙዚቃ አጫውት                                                                  |                |
| `messages/am.json` | music.pause                  | Pause music                                                                                               | ሙዚቃ አቁም                                                                   |                |
| `messages/am.json` | music.nowPlaying             | Now playing: {title}                                                                                      | አሁን እየተጫወተ ያለው፦ {title}                                                   |                |
| `messages/am.json` | notFound.title               | This invitation isn't available                                                                           | ይህ ግብዣ አይገኝም                                                              |                |
| `messages/am.json` | notFound.body                | Check the link you were sent, or ask the couple for a new one.                                            | የተላከልዎትን ማስፈንጠሪያ ያረጋግጡ ወይም ሙሽሮቹን አዲስ ማስፈንጠሪያ ይጠይቁ።                        |                |

## Amharic written directly in code

Calendar words, weekdays, time-of-day words, Ge'ez numerals and separators that live in code instead of the message files.

| Where                                                      | Key or context  | English | Amharic draft                                                           | Reviewer, date |
| ---------------------------------------------------------- | --------------- | ------- | ----------------------------------------------------------------------- | -------------- |
| `src/app/s/[slug]/page.tsx:129`                            | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/site-header.tsx:52`                | literal in code |         | አማ                                                                      |                |
| `src/components/wedding/save-the-date/index.tsx:130`       | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/save-the-date/month-table.tsx:9`   | literal in code |         | እሑ                                                                      |                |
| `src/components/wedding/save-the-date/month-table.tsx:9`   | literal in code |         | እሑድ                                                                     |                |
| `src/components/wedding/save-the-date/month-table.tsx:10`  | literal in code |         | ሰኞ                                                                      |                |
| `src/components/wedding/save-the-date/month-table.tsx:11`  | literal in code |         | ማክ                                                                      |                |
| `src/components/wedding/save-the-date/month-table.tsx:11`  | literal in code |         | ማክሰኞ                                                                    |                |
| `src/components/wedding/save-the-date/month-table.tsx:12`  | literal in code |         | ረቡ                                                                      |                |
| `src/components/wedding/save-the-date/month-table.tsx:12`  | literal in code |         | ረቡዕ                                                                     |                |
| `src/components/wedding/save-the-date/month-table.tsx:13`  | literal in code |         | ሐሙ                                                                      |                |
| `src/components/wedding/save-the-date/month-table.tsx:13`  | literal in code |         | ሐሙስ                                                                     |                |
| `src/components/wedding/save-the-date/month-table.tsx:14`  | literal in code |         | ዓር                                                                      |                |
| `src/components/wedding/save-the-date/month-table.tsx:14`  | literal in code |         | ዓርብ                                                                     |                |
| `src/components/wedding/save-the-date/month-table.tsx:15`  | literal in code |         | ቅዳ                                                                      |                |
| `src/components/wedding/save-the-date/month-table.tsx:15`  | literal in code |         | ቅዳሜ                                                                     |                |
| `src/components/wedding/kit/crest.tsx:49`                  | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/arches/hero.tsx:80`        | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/arches/footer.tsx:30`      | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/noir/hero.tsx:97`          | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/noir/hero.tsx:111`         | literal in code |         | እና                                                                      |                |
| `src/components/wedding/layouts/noir/gifts.tsx:116`        | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/noir/footer.tsx:30`        | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/noir/footer.tsx:40`        | literal in code |         | እና                                                                      |                |
| `src/components/wedding/layouts/flatlay/hero.tsx:28`       | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/flatlay/footer.tsx:43`     | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/stories/index.tsx:56`      | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/stories/cover.tsx:66`      | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/stories/invitation.tsx:59` | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/stories/thanks.tsx:40`     | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/kaba/hero.tsx:39`          | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/kaba/hero.tsx:80`          | literal in code |         | እና                                                                      |                |
| `src/components/wedding/layouts/kaba/footer.tsx:29`        | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/layouts/kaba/footer.tsx:52`        | literal in code |         | እና                                                                      |                |
| `src/components/wedding/ornaments/wax-seal.tsx:10`         | literal in code |         | ፡                                                                       |                |
| `src/components/wedding/openings/types.ts:10`              | literal in code |         | ፡                                                                       |                |
| `src/components/admin/couple-texts-form.tsx:21`            | literal in code |         | ሁለት ቤተሰብ፣ አንድ ማዕድ።                                                      |                |
| `src/components/admin/couple-texts-form.tsx:47`            | literal in code |         | መኃልየ መኃልይ 8፥7                                                           |                |
| `src/components/admin/couple-import-form.tsx:13`           | literal in code |         | ሐና                                                                      |                |
| `src/components/admin/couple-import-form.tsx:14`           | literal in code |         | ዳዊት                                                                     |                |
| `src/components/admin/couple-import-form.tsx:17`           | literal in code |         | አዲስ አበባ                                                                 |                |
| `src/components/admin/couple-details-form.tsx:353`         | literal in code |         | አዲስ አበባ                                                                 |                |
| `src/lib/geez.ts:9`                                        | literal in code |         | ፩                                                                       |                |
| `src/lib/geez.ts:9`                                        | literal in code |         | ፪                                                                       |                |
| `src/lib/geez.ts:9`                                        | literal in code |         | ፫                                                                       |                |
| `src/lib/geez.ts:9`                                        | literal in code |         | ፬                                                                       |                |
| `src/lib/geez.ts:9`                                        | literal in code |         | ፭                                                                       |                |
| `src/lib/geez.ts:9`                                        | literal in code |         | ፮                                                                       |                |
| `src/lib/geez.ts:9`                                        | literal in code |         | ፯                                                                       |                |
| `src/lib/geez.ts:9`                                        | literal in code |         | ፰                                                                       |                |
| `src/lib/geez.ts:9`                                        | literal in code |         | ፱                                                                       |                |
| `src/lib/geez.ts:10`                                       | literal in code |         | ፲                                                                       |                |
| `src/lib/geez.ts:10`                                       | literal in code |         | ፳                                                                       |                |
| `src/lib/geez.ts:10`                                       | literal in code |         | ፴                                                                       |                |
| `src/lib/geez.ts:10`                                       | literal in code |         | ፵                                                                       |                |
| `src/lib/geez.ts:10`                                       | literal in code |         | ፶                                                                       |                |
| `src/lib/geez.ts:10`                                       | literal in code |         | ፷                                                                       |                |
| `src/lib/geez.ts:10`                                       | literal in code |         | ፸                                                                       |                |
| `src/lib/geez.ts:10`                                       | literal in code |         | ፹                                                                       |                |
| `src/lib/geez.ts:10`                                       | literal in code |         | ፺                                                                       |                |
| `src/lib/geez.ts:11`                                       | literal in code |         | ፻                                                                       |                |
| `src/lib/geez.ts:12`                                       | literal in code |         | ፼                                                                       |                |
| `src/lib/ethiopian-calendar.ts:7`                          | literal in code |         | መስከረም                                                                   |                |
| `src/lib/ethiopian-calendar.ts:8`                          | literal in code |         | ጥቅምት                                                                    |                |
| `src/lib/ethiopian-calendar.ts:9`                          | literal in code |         | ኅዳር                                                                     |                |
| `src/lib/ethiopian-calendar.ts:10`                         | literal in code |         | ታኅሣሥ                                                                    |                |
| `src/lib/ethiopian-calendar.ts:11`                         | literal in code |         | ጥር                                                                      |                |
| `src/lib/ethiopian-calendar.ts:12`                         | literal in code |         | የካቲት                                                                    |                |
| `src/lib/ethiopian-calendar.ts:13`                         | literal in code |         | መጋቢት                                                                    |                |
| `src/lib/ethiopian-calendar.ts:14`                         | literal in code |         | ሚያዝያ                                                                    |                |
| `src/lib/ethiopian-calendar.ts:15`                         | literal in code |         | ግንቦት                                                                    |                |
| `src/lib/ethiopian-calendar.ts:16`                         | literal in code |         | ሰኔ                                                                      |                |
| `src/lib/ethiopian-calendar.ts:17`                         | literal in code |         | ሐምሌ                                                                     |                |
| `src/lib/ethiopian-calendar.ts:18`                         | literal in code |         | ነሐሴ                                                                     |                |
| `src/lib/ethiopian-calendar.ts:19`                         | literal in code |         | ጳጉሜን                                                                    |                |
| `src/lib/ethiopian-calendar.ts:129`                        | literal in code |         | ${ETHIOPIAN_MONTHS_AM[date.month - 1]} ${date.day} ቀን ${date.year} ዓ.ም. |                |
| `src/lib/ethiopian-calendar.ts:134`                        | literal in code |         | ከሌሊቱ                                                                    |                |
| `src/lib/ethiopian-calendar.ts:134`                        | literal in code |         | ከጠዋቱ                                                                    |                |
| `src/lib/ethiopian-calendar.ts:134`                        | literal in code |         | ከቀኑ                                                                     |                |
| `src/lib/ethiopian-calendar.ts:134`                        | literal in code |         | ከምሽቱ                                                                    |                |
| `src/lib/ethiopian-calendar.ts:136`                        | literal in code |         | )} ሰዓት                                                                  |                |
| `src/lib/wedding-format.ts:26`                             | literal in code |         | እሑድ                                                                     |                |
| `src/lib/wedding-format.ts:26`                             | literal in code |         | ሰኞ                                                                      |                |
| `src/lib/wedding-format.ts:26`                             | literal in code |         | ማክሰኞ                                                                    |                |
| `src/lib/wedding-format.ts:26`                             | literal in code |         | ረቡዕ                                                                     |                |
| `src/lib/wedding-format.ts:26`                             | literal in code |         | ሐሙስ                                                                     |                |
| `src/lib/wedding-format.ts:26`                             | literal in code |         | ዓርብ                                                                     |                |
| `src/lib/wedding-format.ts:26`                             | literal in code |         | ቅዳሜ                                                                     |                |
| `src/lib/wedding-format.ts:59`                             | literal in code |         | ${WEEKDAYS_AM[p.weekday]}፣ ${formatEthiopianDate(ethiopian)}            |                |
| `src/lib/wedding-format.ts:87`                             | literal in code |         | ከሌሊቱ                                                                    |                |
| `src/lib/wedding-format.ts:88`                             | literal in code |         | ከጠዋቱ                                                                    |                |
| `src/lib/wedding-format.ts:89`                             | literal in code |         | ከቀኑ                                                                     |                |
| `src/lib/wedding-format.ts:90`                             | literal in code |         | ከምሽቱ                                                                    |                |
| `src/lib/wedding-format.ts:106`                            | literal in code |         | ${period} ${clock} ሰዓት                                                  |                |
| `src/lib/wedding-format.ts:116`                            | literal in code |         | ${start.period} ${start.clock} እስከ ${end.clock} ሰዓት                     |                |
| `src/lib/wedding-format.ts:117`                            | literal in code |         | ${start.period} ${start.clock} እስከ ${end.period} ${end.clock} ሰዓት       |                |
| `src/lib/event-kinds.ts:36`                                | literal in code |         | ጥሎሽ                                                                     |                |
| `src/lib/event-kinds.ts:37`                                | literal in code |         | የቤተክርስቲያን ሥርዓት                                                          |                |
| `src/lib/event-kinds.ts:38`                                | literal in code |         | የጋብቻ አገልግሎት                                                             |                |
| `src/lib/event-kinds.ts:39`                                | literal in code |         | የቃልኪዳን ሥርዓት                                                             |                |
| `src/lib/event-kinds.ts:40`                                | literal in code |         | ኒካህ                                                                     |                |
| `src/lib/event-kinds.ts:41`                                | literal in code |         | የፎቶ ፕሮግራም                                                               |                |
| `src/lib/event-kinds.ts:42`                                | literal in code |         | የሠርግ ግብዣ                                                                |                |
| `src/lib/event-kinds.ts:43`                                | literal in code |         | የሽማግሌዎች ምርቃት                                                            |                |
| `src/lib/event-kinds.ts:44`                                | literal in code |         | መልስ                                                                     |                |
| `src/lib/event-kinds.ts:45`                                | literal in code |         | ቅልቅል                                                                    |                |
| `src/lib/event-kinds.ts:46`                                | literal in code |         | የቡና ሥነ ሥርዓት                                                             |                |

## Notes for the reviewer

- `intro.invited`: the Amharic says "our wedding", while the English is third person ("the wedding of"). Pick one voice.
- `saveTheDate.gregorian`: "ጎርጎሮሳዊያን" is colloquial. Is a more formal word for the Gregorian calendar better here?

## Phase 4: Brana Manuscript layout

| Where              | Key or context          | English                                                     | Amharic draft                                     | Reviewer, date |
| ------------------ | ----------------------- | ----------------------------------------------------------- | ------------------------------------------------- | -------------- |
| `messages/am.json` | layouts.brana.date      | Date                                                        | ቀን                                                |                |
| `messages/am.json` | layouts.brana.time      | Time                                                        | ሰዓት                                               |                |
| `messages/am.json` | layouts.brana.place     | Place                                                       | ቦታ                                                |                |
| `messages/am.json` | layouts.brana.event     | Event                                                       | ዝግጅት                                              |                |
| `messages/am.json` | layouts.brana.number    | Number                                                      | ተራ ቁጥር                                            |                |
| `messages/am.json` | layouts.brana.allPhotos | View all {count} photos                                     | ሁሉንም {count} ፎቶዎች ይመልከቱ                           |                |
| `messages/am.json` | layouts.brana.chapter   | Chapter                                                     | ምዕራፍ                                              |                |
| `messages/am.json` | layouts.brana.writtenIn | Written in the year <year></year> of the Ethiopian calendar | በ<year></year> ዓ.ም. ተጻፈ።                          |                |
| `messages/am.json` | layouts.brana.colophon  | Here ends this book; may the love written in it never end.  | ይህ መጽሐፍ እዚህ ላይ ተፈጸመ፤ በውስጡ የተጻፈው ፍቅር ግን ፍጻሜ አይኑረው። |                |

## Extras: drifting gallery, add to calendar, event details

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | gallery.pause | Pause the photos | ፎቶዎቹን አቁም | |
| `messages/am.json` | gallery.play | Play the photos | ፎቶዎቹን አጫውት | |
| `messages/am.json` | calendar.add | Add the wedding to your calendar | ሠርጉን በቀን መቁጠሪያዎ ያስቀምጡ | |
| `messages/am.json` | calendar.google | Google Calendar | Google ቀን መቁጠሪያ | |
| `messages/am.json` | calendar.eventTitle | Wedding of {one} and {two} | የ{one} እና የ{two} ሠርግ | |
| `messages/am.json` | calendar.details | You are invited. The full invitation, the day's schedule and the RSVP are on the website. | ተጋብዘዋል። ሙሉ ግብዣው፣ የዕለቱ መርሐ ግብር እና የምላሽ ቅጹ በድረ-ገጹ ላይ ይገኛሉ። | |
| `messages/am.json` | schedule.showDetails | Show details | ዝርዝሩን አሳይ | |
| `messages/am.json` | schedule.hideDetails | Hide details | ዝርዝሩን ደብቅ | |

## Phase 4: Slate layout

| Where | Key or context | English | Amharic draft | Reviewer, date |
|---|---|---|---|---|
| `messages/am.json` | layouts.slate.confirm | Confirm attendance | መገኘትዎን ያረጋግጡ | |
| `messages/am.json` | layouts.slate.seeDay | See the day | መርሐ ግብሩን ይመልከቱ | |
| `messages/am.json` | layouts.slate.scroll | Scroll | ወደ ታች | |
| `messages/am.json` | layouts.slate.kicker.invitation | You are invited | ተጋብዘዋል | |
| `messages/am.json` | layouts.slate.kicker.schedule | Hour by hour | ሰዓት በሰዓት | |
| `messages/am.json` | layouts.slate.kicker.venues | Find your way | እንዴት እንደሚደርሱ | |
| `messages/am.json` | layouts.slate.kicker.gallery | A few favourites | የምንወዳቸው ፎቶዎች | |
| `messages/am.json` | layouts.slate.kicker.story | How it began | እንዴት ተጀመረ | |
| `messages/am.json` | layouts.slate.kicker.rsvp | We hope you can come | እንደሚመጡ ተስፋ እናደርጋለን | |
| `messages/am.json` | layouts.slate.kicker.gifts | With gratitude | በምስጋና | |
| `messages/am.json` | layouts.slate.kicker.thanks | Thank you | እናመሰግናለን | |
| `messages/am.json` | layouts.slate.footerNav | On this page | በዚህ ገጽ ላይ | |
| `messages/am.json` | layouts.slate.backToTop | Back to top | ወደ ላይ ይመለሱ | |
| `messages/am.json` | layouts.slate.signature | With love, {one} and {two} | በፍቅር፣ {one} እና {two} | |
| `messages/am.json` | layouts.slate.when | When | መቼ | |
| `messages/am.json` | layouts.slate.where | Where | የት | |

## Phase B: graduations

Graduation sites lay `events.graduation` over the shared wording, and every honoree site (graduation, birthday, baptism) lays `events.honorees` under it. The Amharic for "graduate" uses ተመራቂ; please check whether ምሩቃን reads better in the class-year line.

| Where | Key or context | English | Amharic draft | Reviewer, date |
| --- | --- | --- | --- | --- |
| `messages/am.json` | layouts.commencement.classOf | Class of {year} | የ{year} ዓ.ም. ምሩቃን | |
| `messages/am.json` | layouts.commencement.gallery | Along the way | የጉዞው ትዝታዎች | |
| `messages/am.json` | layouts.tassel.graduates | {count, plural, one {Graduate of {year}} other {Graduates of {year}}} | {count, plural, one {የ{year} ዓ.ም. ተመራቂ} other {የ{year} ዓ.ም. ተመራቂዎች}} | |
| `messages/am.json` | layouts.tassel.gallery | Along the way | የጉዞው ትዝታዎች | |
| `messages/am.json` | honorees.heading | {count, plural, one {Who we celebrate} other {Who we celebrate}} | {count, plural, one {የምናከብረው} other {የምናከብራቸው}} | |
| `messages/am.json` | events.honorees.intro.sealLabel | Open the invitation from {one} | ከ{one} የመጣውን ግብዣ ይክፈቱ | |
| `messages/am.json` | events.honorees.intro.letter | invite you to celebrate with them | ደስታቸውን አብረዋቸው እንዲያከብሩ ይጋብዙዎታል | |
| `messages/am.json` | events.honorees.nav.couple | Who we celebrate | የምናከብራቸው | |
| `messages/am.json` | events.honorees.nav.story | Their story | ታሪካቸው | |
| `messages/am.json` | events.honorees.couple.heading | Who we celebrate | የምናከብራቸው | |
| `messages/am.json` | events.honorees.story.heading | Their story | ታሪካቸው | |
| `messages/am.json` | events.honorees.footer.families | With love, the family | በፍቅር፣ ቤተሰቡ | |
| `messages/am.json` | events.honorees.countdown.since | Since the celebration | ከበዓሉ ቀን ጀምሮ | |
| `messages/am.json` | events.honorees.countdown.summarySince | {days, plural, one {# day} other {# days}}, {hours, plural, one {# hour} other {# hours}} and {minutes, plural, one {# minute} other {# minutes}} since the celebration | ከበዓሉ ወዲህ {days} ቀናት፣ {hours} ሰዓታት እና {minutes} ደቂቃዎች | |
| `messages/am.json` | events.honorees.saveTheDate.couple | {one} | {one} | |
| `messages/am.json` | events.honorees.invitation.hostsFallback | Together with their family | ከቤተሰባቸው ጋር በመሆን | |
| `messages/am.json` | events.honorees.rsvp.closed | RSVPs are closed. Please contact the family directly. | የምላሽ መስጫ ጊዜው አልፏል። እባክዎ ቤተሰቡን በቀጥታ ያነጋግሩ። | |
| `messages/am.json` | events.honorees.rsvp.message | A message for them (optional) | መልዕክት ካለዎት (አማራጭ) | |
| `messages/am.json` | events.honorees.rsvp.errors.closed | RSVPs for this celebration are closed. | የዚህ በዓል የምላሽ መስጫ ተዘግቷል። | |
| `messages/am.json` | events.honorees.card.openSite | Open the invitation website | የግብዣውን ድረ-ገጽ ይክፈቱ | |
| `messages/am.json` | events.honorees.card.pass.invalidBody | This invitation was cancelled or the code is wrong. Please check with the family. | ይህ ግብዣ ተሰርዟል ወይም ኮዱ ትክክል አይደለም። እባክዎ ቤተሰቡን ያነጋግሩ። | |
| `messages/am.json` | events.honorees.memories.body | Took photos at the celebration? Send them to us on Telegram. | በበዓሉ ላይ ፎቶ አንስተዋል? በቴሌግራም ይላኩልን። | |
| `messages/am.json` | events.honorees.notFound.body | Check the link you were sent, or ask the family for a new one. | የተላከልዎትን ማስፈንጠሪያ ያረጋግጡ ወይም ቤተሰቡን አዲስ ማስፈንጠሪያ ይጠይቁ። | |
| `messages/am.json` | events.graduation.intro.invited | You are invited to the graduation of | በምረቃ በዓላችን ላይ እንዲገኙ ተጋብዘዋል | |
| `messages/am.json` | events.graduation.intro.letter | invite you to celebrate their graduation | በምረቃ በዓላቸው ላይ እንዲገኙ ይጋብዙዎታል | |
| `messages/am.json` | events.graduation.nav.couple | Graduates | ተመራቂዎች | |
| `messages/am.json` | events.graduation.couple.heading | Graduates | ተመራቂዎች | |
| `messages/am.json` | events.graduation.honorees.heading | {count, plural, one {The graduate} other {The graduates}} | {count, plural, one {ተመራቂ} other {ተመራቂዎች}} | |
| `messages/am.json` | events.graduation.countdown.heading | Graduation day | የምረቃው ቀን | |
| `messages/am.json` | events.graduation.countdown.label | Time until the graduation | ለምረቃው ቀን የቀረው ጊዜ | |
| `messages/am.json` | events.graduation.countdown.since | Since graduation day | ከምረቃው ቀን ጀምሮ | |
| `messages/am.json` | events.graduation.countdown.summarySince | {days, plural, one {# day} other {# days}}, {hours, plural, one {# hour} other {# hours}} and {minutes, plural, one {# minute} other {# minutes}} since graduation day | ከምረቃው ወዲህ {days} ቀናት፣ {hours} ሰዓታት እና {minutes} ደቂቃዎች | |
| `messages/am.json` | events.graduation.saveTheDate.captionEthiopian | {month} {year} in the Ethiopian calendar, with graduation day marked | {month} {year} ዓ.ም.፣ የምረቃው ቀን ምልክት ተደርጎበታል | |
| `messages/am.json` | events.graduation.saveTheDate.captionGregorian | {month} {year}, with graduation day marked | {month} {year}፣ የምረቃው ቀን ምልክት ተደርጎበታል | |
| `messages/am.json` | events.graduation.saveTheDate.weddingDay | Graduation day | የምረቃው ቀን | |
| `messages/am.json` | events.graduation.calendar.add | Add the graduation to your calendar | ምረቃውን በቀን መቁጠሪያዎ ያስቀምጡ | |
| `messages/am.json` | events.graduation.calendar.eventTitle | Graduation of {one} | የ{one} ምረቃ | |
| `messages/am.json` | events.graduation.invitation.eyebrow | Graduation invitation | የምረቃ ግብዣ | |
| `messages/am.json` | events.graduation.invitation.defaultText | request the pleasure of your company as they celebrate their graduation. | በምረቃ በዓላቸው ተገኝተው የደስታቸው ተካፋይ እንዲሆኑ በአክብሮት ተጋብዘዋል። | |
| `messages/am.json` | events.graduation.rsvp.message | A message for the graduates (optional) | ለተመራቂዎቹ መልዕክት (አማራጭ) | |
| `messages/am.json` | events.graduation.rsvp.errors.closed | RSVPs for this graduation are closed. | የዚህ ምረቃ የምላሽ መስጫ ተዘግቷል። | |
| `messages/am.json` | events.graduation.card.shareText | My invitation to the graduation of {couple} | የ{couple} የምረቃ ግብዣዬ | |
| `messages/am.json` | events.graduation.couplePortal.cardShareText | Your invitation card for the graduation of {couple}: {url} | ለ{couple} ምረቃ የተዘጋጀ የግብዣ ካርድዎ፦ {url} | |
| `src/lib/event-kinds.ts` | commencement title | Graduation ceremony | የምረቃ ሥነ ሥርዓት | |
| `src/lib/event-kinds.ts` | celebration title | Celebration | የደስታ ግብዣ | |
| `public/examples/graduation.json` | demo text | (the demo site) | (see the file) | |

## Phase D: birthdays

Birthday sites lay `events.birthday` over the shared wording (and `events.honorees` under it). The layouts avoid lines that would need a gendered verb, such as "turns 60"; the admin writes that line for each person in their own words.

| Where | Key or context | English | Amharic draft | Reviewer, date |
| --- | --- | --- | --- | --- |
| `messages/am.json` | layouts.confetti.party | Let's celebrate | እናክብር | |
| `messages/am.json` | layouts.confetti.gallery | Through the years | በዓመታት ውስጥ | |
| `messages/am.json` | layouts.milestone.years | years | ዓመት | |
| `messages/am.json` | layouts.milestone.gallery | Through the years | በዓመታት ውስጥ | |
| `messages/am.json` | events.birthday.intro.invited | You are invited to the birthday of | በልደት በዓላችን ላይ እንዲገኙ ተጋብዘዋል | |
| `messages/am.json` | events.birthday.intro.letter | invite you to celebrate their birthday | በልደት በዓላቸው ላይ እንዲገኙ ይጋብዙዎታል | |
| `messages/am.json` | events.birthday.nav.couple | Birthday | የልደቱ ባለቤት | |
| `messages/am.json` | events.birthday.countdown.heading | The birthday | የልደት ቀን | |
| `messages/am.json` | events.birthday.countdown.label | Time until the birthday | ለልደቱ ቀን የቀረው ጊዜ | |
| `messages/am.json` | events.birthday.countdown.since | Since the birthday | ከልደቱ ቀን ጀምሮ | |
| `messages/am.json` | events.birthday.countdown.summarySince | {days, plural, one {# day} other {# days}}, {hours, plural, one {# hour} other {# hours}} and {minutes, plural, one {# minute} other {# minutes}} since the birthday | ከልደቱ ወዲህ {days} ቀናት፣ {hours} ሰዓታት እና {minutes} ደቂቃዎች | |
| `messages/am.json` | events.birthday.saveTheDate.captionEthiopian | {month} {year} in the Ethiopian calendar, with the birthday marked | {month} {year} ዓ.ም.፣ የልደቱ ቀን ምልክት ተደርጎበታል | |
| `messages/am.json` | events.birthday.saveTheDate.captionGregorian | {month} {year}, with the birthday marked | {month} {year}፣ የልደቱ ቀን ምልክት ተደርጎበታል | |
| `messages/am.json` | events.birthday.saveTheDate.weddingDay | The birthday | የልደት ቀን | |
| `messages/am.json` | events.birthday.calendar.add | Add the birthday to your calendar | የልደት በዓሉን በቀን መቁጠሪያዎ ያስቀምጡ | |
| `messages/am.json` | events.birthday.calendar.eventTitle | Birthday of {one} | የ{one} የልደት በዓል | |
| `messages/am.json` | events.birthday.invitation.eyebrow | Birthday invitation | የልደት በዓል ግብዣ | |
| `messages/am.json` | events.birthday.invitation.defaultText | request the pleasure of your company as they celebrate their birthday. | በልደት በዓላቸው ተገኝተው የደስታቸው ተካፋይ እንዲሆኑ በአክብሮት ተጋብዘዋል። | |
| `messages/am.json` | events.birthday.rsvp.message | Birthday wishes (optional) | የልደት መልካም ምኞት (አማራጭ) | |
| `messages/am.json` | events.birthday.rsvp.errors.closed | RSVPs for this birthday are closed. | የዚህ የልደት በዓል የምላሽ መስጫ ተዘግቷል። | |
| `messages/am.json` | events.birthday.card.shareText | My invitation to the birthday of {couple} | የ{couple} የልደት በዓል ግብዣዬ | |
| `messages/am.json` | events.birthday.couplePortal.cardShareText | Your invitation card for the birthday of {couple}: {url} | ለ{couple} የልደት በዓል የተዘጋጀ የግብዣ ካርድዎ፦ {url} | |
| `src/lib/event-kinds.ts` | cake title | Cake and candles | ኬክ መቁረስ | |
| `public/examples/birthday.json` | demo text | (the demo site) | (see the file) | |

## Phase E: christenings (kristina)

Christening sites lay `events.baptism` over the shared wording. Please check "የክርስትና አባት እና እናት" for godparents, and whether the invitation lines should speak for the parents ("our") or of the child.

| Where | Key or context | English | Amharic draft | Reviewer, date |
| --- | --- | --- | --- | --- |
| `messages/am.json` | layouts.shema.christeningName | Christening name | የክርስትና ስም | |
| `messages/am.json` | layouts.shema.godparents | Godparents | የክርስትና አባት እና እናት | |
| `messages/am.json` | layouts.shema.gallery | Little moments | ትናንሽ ትዝታዎች | |
| `messages/am.json` | events.baptism.intro.invited | You are invited to the christening of | በክርስትና በዓላችን ላይ እንዲገኙ ተጋብዘዋል | |
| `messages/am.json` | events.baptism.intro.letter | invite you to celebrate their christening | በክርስትና በዓሉ ላይ እንዲገኙ ይጋብዙዎታል | |
| `messages/am.json` | events.baptism.countdown.heading | Christening day | የክርስትናው ቀን | |
| `messages/am.json` | events.baptism.countdown.label | Time until the christening | ለክርስትናው ቀን የቀረው ጊዜ | |
| `messages/am.json` | events.baptism.countdown.since | Since the christening | ከክርስትናው ቀን ጀምሮ | |
| `messages/am.json` | events.baptism.countdown.summarySince | {days, plural, one {# day} other {# days}}, {hours, plural, one {# hour} other {# hours}} and {minutes, plural, one {# minute} other {# minutes}} since the christening | ከክርስትናው ወዲህ {days} ቀናት፣ {hours} ሰዓታት እና {minutes} ደቂቃዎች | |
| `messages/am.json` | events.baptism.saveTheDate.captionEthiopian | {month} {year} in the Ethiopian calendar, with the christening marked | {month} {year} ዓ.ም.፣ የክርስትናው ቀን ምልክት ተደርጎበታል | |
| `messages/am.json` | events.baptism.saveTheDate.captionGregorian | {month} {year}, with the christening marked | {month} {year}፣ የክርስትናው ቀን ምልክት ተደርጎበታል | |
| `messages/am.json` | events.baptism.saveTheDate.weddingDay | Christening day | የክርስትናው ቀን | |
| `messages/am.json` | events.baptism.calendar.add | Add the christening to your calendar | ክርስትናውን በቀን መቁጠሪያዎ ያስቀምጡ | |
| `messages/am.json` | events.baptism.calendar.eventTitle | Christening of {one} | የ{one} ክርስትና | |
| `messages/am.json` | events.baptism.invitation.eyebrow | Christening invitation | የክርስትና ግብዣ | |
| `messages/am.json` | events.baptism.invitation.defaultText | request the pleasure of your company as they celebrate the christening. | በክርስትና በዓሉ ተገኝተው የደስታችን ተካፋይ እንዲሆኑ በአክብሮት ተጋብዘዋል። | |
| `messages/am.json` | events.baptism.rsvp.message | A blessing or message (optional) | ምርቃት ወይም መልዕክት (አማራጭ) | |
| `messages/am.json` | events.baptism.rsvp.errors.closed | RSVPs for this christening are closed. | የዚህ ክርስትና የምላሽ መስጫ ተዘግቷል። | |
| `messages/am.json` | events.baptism.card.shareText | My invitation to the christening of {couple} | የ{couple} የክርስትና ግብዣዬ | |
| `messages/am.json` | events.baptism.couplePortal.cardShareText | Your invitation card for the christening of {couple}: {url} | ለ{couple} ክርስትና የተዘጋጀ የግብዣ ካርድዎ፦ {url} | |
| `src/lib/event-kinds.ts` | christening title | Christening | ክርስትና | |
| `public/examples/baptism.json` | demo text | (the demo site) | (see the file) | |
