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
| `src/lib/event-kinds.ts` | reception title | Reception | የሰርግ ግብዣ | |
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
