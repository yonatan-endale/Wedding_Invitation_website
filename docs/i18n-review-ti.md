# Tigrigna strings waiting for a native speaker

Every string in `messages/ti.json` is a machine-assisted draft, written from the
English source with the Amharic file as a guide to meaning and tone. None of it
has been read by a native Tigrigna speaker yet. The whole file needs that review
before Tigrigna is switched on for real guests. Mark a row done by filling in
the reviewer and date; fix anything else directly in `messages/ti.json`.

## Conventions to confirm

- The word between the two names on the hero and save-the-date (`saveTheDate.couple`) is "&" (`{one} & {two}`), because Tigrigna "ን…ን" is a suffix on each name. In full sentences the draft uses the suffix form, for example `{one}ን {two}ን`.
- Ethiopian clock phrasing: "ድሕሪ ቐትሪ 8:00 ሰዓት", with the periods ናይ ለይቲ (night), ናይ ንግሆ (morning), ድሕሪ ቐትሪ (afternoon) and ናይ ምሸት (evening).
- Date format: "11 ሓምለ 2018 ዓ.ም.", day first, with the months መስከረም ጥቅምቲ ሕዳር ታሕሳስ ጥሪ ለካቲት መጋቢት ሚያዝያ ግንቦት ሰነ ሓምለ ነሓሰ ጳጉሜን.
- Weekday names: ሰንበት ሰኑይ ሰሉስ ረቡዕ ሓሙስ ዓርቢ ቀዳም.
- Address form: the draft speaks to guests in the polite plural (ኣእትዉ, ክፈቱ, ተዓዲምኩም) and greets them with "ዝኸበርኩም {name}፣".
- Couple: "መርዓዊን መርዓትን" (groom and bride) where the English says "the couple"; "መጻምዲ" for couples in general on the designs page.
- Link is "ሊንክ" and passcode is "ምሕላፊ ኮድ". Brand names (WhatsApp, Telegram, Google Maps) stay in Latin script.
- "ዕድመ" means both "invitation" and "age" in Tigrigna. The draft uses ዕድመ only for invitation and says "ዓመታት" (years) for a person's age.

## Strings I was least sure about

| Where              | Key                                | English                                              | Tigrigna draft                                  | Reviewer, date |
| ------------------ | ---------------------------------- | ---------------------------------------------------- | ----------------------------------------------- | -------------- |
| `messages/ti.json` | intro.invited                      | You are invited to the wedding of                    | ናብ መርዓ ተዓዲምኩም                                  |                |
| `messages/ti.json` | intro.dear                         | Dear {name},                                         | ዝኸበርኩም {name}፣                                   |                |
| `messages/ti.json` | saveTheDate.title                  | Save the date                                        | ነዚ ዕለት ሓዙ                                       |                |
| `messages/ti.json` | saveTheDate.switchLabel            | Calendar                                             | ኣቆጻጽራ ዘመን                                       |                |
| `messages/ti.json` | saveTheDate.gregorian              | Gregorian                                            | ግሪጎርያዊ                                          |                |
| `messages/ti.json` | countdown.since                    | Since we got married                                 | ካብ ዝተመርዓናሉ መዓልቲ ጀሚሩ                             |                |
| `messages/ti.json` | countdown.summary                  | {days}, {hours} and {minutes} left                   | {days}፣ {hours}ን {minutes}ን ተሪፉ                  |                |
| `messages/ti.json` | rsvp.heading                       | RSVP                                                 | ምምጻእኩም ኣፍልጡና                                    |                |
| `messages/ti.json` | rsvp.yes / rsvp.no                 | Joyfully accept / Regretfully decline                | ብሓጎስ ክመጽእ እየ / ክመጽእ ኣይክእልን እየ                  |                |
| `messages/ti.json` | rsvp.thanksNo                      | Thank you for letting us know, {name}. You'll be missed. | ስለ ዘፍለጥኩምና የቐንየልና {name}። ክንናፍቐኩም ኢና።         |                |
| `messages/ti.json` | invitation.defaultText             | request the pleasure of your company …               | ኣብ መዓልቲ መርዓኦም ተረኺብኩም ሓጎሶም ክትካፈሉ ብኽብሪ ይዕድሙኹም። |                |
| `messages/ti.json` | invitation.dressCode               | Dress code                                           | ኣከዳድና                                          |                |
| `messages/ti.json` | card.pass.title                    | Entry pass                                           | ፍቓድ መእተዊ                                        |                |
| `messages/ti.json` | couplePortal.passcode              | Passcode                                             | ምሕላፊ ኮድ                                         |                |
| `messages/ti.json` | gallery.play / gallery.pause       | Play the photos / Pause the photos                   | ስእልታት ኣርኢ / ስእልታት ደው ኣብል                       |                |
| `messages/ti.json` | honorees.heading                   | Who we celebrate                                     | ዘኽብሮ / ዘኽብሮም                                    |                |
| `messages/ti.json` | events.honorees.nav.couple         | Who we celebrate                                     | ዘኽብሮም                                           |                |
| `messages/ti.json` | layouts.reel.ending                | And so it begins                                     | ከምኡ ድማ ይጅምር                                     |                |
| `messages/ti.json` | layouts.kaba.mels                  | A family tradition                                   | ልምዲ ስድራቤት                                       |                |
| `messages/ti.json` | showcase.layouts.kaba.b2           | A stitched timeline that marks the Mels              | መልስ ዘመልክት ዝተጠልፈ መደብ መዓልቲ (is "መልስ" the word used in Tigray?) |                |
| `messages/ti.json` | layouts.brana.colophon             | Here ends this book; may the love written in it never end. | እዚ መጽሓፍ ኣብዚ ተፈጸመ፤ እታ ኣብኡ ዝተጻሕፈት ፍቕሪ ግን መወዳእታ ኣይሃልዋ። |                |
| `messages/ti.json` | layouts.commencement.classOf       | Class of {year}                                      | ምሩቓት {year}                                      |                |
| `messages/ti.json` | layouts.confetti.party             | Let's celebrate                                      | ነብዕል!                                           |                |
| `messages/ti.json` | layouts.shema.godparents           | Godparents                                           | ወለዲ ክርስትና                                       |                |
| `messages/ti.json` | showcase.layouts.tassel.b1         | A tassel that swings once as the page opens          | ገጽ ክኽፈት ከሎ ሓንሳብ ዝወዛወዝ ዘፋ                         |                |
| `messages/ti.json` | showcase.layouts.brana.goodFor     | Couples who love Ethiopian manuscripts and Amharic.  | ኢትዮጵያዊ ብራናን ኣምሓርኛን ዝፈትዉ መጻምዲ። (say ግእዝ instead?) |                |
| `messages/ti.json` | showcase.openings.seal             | Wax-seal gates                                       | ማዕጾ ማሕተም                                        |                |
| `messages/ti.json` | showcase.comingSoon                | Engagements are coming soon.                         | ናይ ሕጽኖት ዕድመታት ቀልጢፎም ክመጹ እዮም።                   |                |

## Default event titles

The titles the admin schedule pre-fills when an event kind is picked, in `src/lib/event-kinds.ts`. Ethiopian names (Telosh, Mels, Kelekel) are transliterated.
