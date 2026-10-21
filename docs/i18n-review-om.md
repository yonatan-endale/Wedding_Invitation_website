# Afaan Oromo strings waiting for a native speaker

Everything in `messages/om.json` is a machine-assisted draft, written from the English source with the Amharic file as a second reference. All of it needs review by a native Afaan Oromo speaker before Afaan Oromo is switched on for real guests. The rows below are the strings we were least sure about; please also read the rest of the file. Mark a row done by filling in the reviewer and date.

## Conventions to confirm

- "fi" between the two names: "{one} fi {two}", also in the signature "Jaalalaan, {one} fi {two}".
- Ethiopian clock phrasing: the hour is counted from 6 AM, so 2 PM is "guyyaa 8:00". Periods are halkan (night), ganama (morning), guyyaa (daytime) and galgala (evening). Ranges use "hanga": "guyyaa 8:00 hanga 11:00".
- Date format: "Sanbata, 11 Adooleessa 2018", with no era marker (no equivalent of ዓ.ም.).
- Oromo Ethiopian month names: Fulbaana, Onkoloolessa, Sadaasa, Muddee, Amajjii, Guraandhala, Bitootessa, Ebla, Caamsaa, Waxabajjii, Adooleessa, Hagayya, Qaammee.
- The Ethiopian calendar date is shown first, with the Gregorian date after it.
- Polite second-person plural ("-aa", "keessan", "isin") for every guest-facing instruction and button.
- Wedding is "cidha" (and "cidha fuudhaa fi heerumaa" in full); the couple is "misirroota", bride "misirrittii", groom "misirricha".
- Calendar is "dhaha guyyaa"; graduation "eebba"; birthday "guyyaa dhalootaa"; christening "cuuphaa"; invitation "affeerraa".
- Loanwords kept as spoken: poostaa (envelope), liinkii (link), kaardii (card), koodii QR, marsariitii (website), imeelii.

## Least certain strings

| Where              | Key                               | English                                                       | Oromo draft                                                     | Reviewer, date |
| ------------------ | --------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- | -------------- |
| `messages/om.json` | intro.invited                     | You are invited to the wedding of                             | Cidha fuudhaa fi heerumaa kanaaf affeeramtaniittu               |                |
| `messages/om.json` | intro.letter                      | invite you to celebrate their wedding                         | ayyaana cidha isaanii irratti akka argamtan isin affeeru        |                |
| `messages/om.json` | intro.dear / card.dear            | Dear {name},                                                  | Jaalatamaa {name},                                              |                |
| `messages/om.json` | intro.openEnvelope                | Tap the envelope to open                                      | Banuuf poostaa tuqaa                                            |                |
| `messages/om.json` | nav.menu                          | Menu                                                          | Baafata                                                         |                |
| `messages/om.json` | couple.bride / couple.groom       | The bride / The groom                                         | Misirrittii / Misirricha                                        |                |
| `messages/om.json` | countdown.since                   | Since we got married                                          | Erga gaa'ela raawwannee as                                      |                |
| `messages/om.json` | countdown.summary                 | {days} days, {hours} hours and {minutes} minutes left         | guyyaa #, sa'aatii # fi daqiiqaa # hafe                         |                |
| `messages/om.json` | saveTheDate.title                 | Save the date                                                 | Guyyaa kana qabadhaa                                            |                |
| `messages/om.json` | saveTheDate.switchLabel           | Calendar                                                      | Dhaha guyyaa                                                    |                |
| `messages/om.json` | saveTheDate.gregorian             | Gregorian                                                     | Kan Gorgooriyaa                                                 |                |
| `messages/om.json` | saveTheDate.captionEthiopian      | {month} {year} in the Ethiopian calendar, with the wedding day marked | {month} {year} dhaha guyyaa Itoophiyaatiin, guyyaan cidhaa mallattaa'eera |                |
| `messages/om.json` | invitation.defaultText            | request the pleasure of your company as they celebrate their marriage. | ayyaana gaa'ela isaanii irratti argamtanii gammachuu isaanii akka qooddattan kabajaan isin affeeru. |                |
| `messages/om.json` | rsvp.heading                      | RSVP                                                          | Argamuu keessan nutti himaa                                     |                |
| `messages/om.json` | rsvp.yes / rsvp.no                | Joyfully accept / Regretfully decline                         | Gammachuun nan argama / Gaddaan hin argamu                      |                |
| `messages/om.json` | rsvp.replyBy                      | Please reply by {date}.                                       | Maaloo hanga {date}tti deebii nuuf kennaa.                      |                |
| `messages/om.json` | rsvp.thanksNo                     | Thank you for letting us know, {name}. You'll be missed.      | Nutti himuu keessaniif galatoomaa, {name}. Isin dhabuun nu gaddisiisa. |                |
| `messages/om.json` | card.admits                       | Admits {count}                                                | Nama {count}f seensa                                            |                |
| `messages/om.json` | card.pass.title                   | Entry pass                                                    | Hayyama seensaa                                                 |                |
| `messages/om.json` | couplePortal.passcode             | Passcode                                                      | Koodii icciitii                                                 |                |
| `messages/om.json` | layouts.reel.starring             | Starring                                                      | Taphattoota ijoo                                                |                |
| `messages/om.json` | layouts.brana.colophon            | Here ends this book; may the love written in it never end.    | Kitaabni kun asitti xumurama; jaalalli keessatti barreeffame garuu xumura hin qabaatin. |                |
| `messages/om.json` | layouts.brana.writtenIn           | Written in the year <year></year> of the Ethiopian calendar   | Bara <year></year> dhaha guyyaa Itoophiyaatiin barreeffame      |                |
| `messages/om.json` | layouts.shema.godparents          | Godparents                                                    | Abbaa fi haadha cuuphaa                                         |                |
| `messages/om.json` | layouts.tassel.graduates          | Graduate(s) of {year}                                         | Eebbifamaa / Eebbifamtoota bara {year}                          |                |
| `messages/om.json` | events.graduation.honorees.heading | The graduate / The graduates                                 | Eebbifamaa keenya / Eebbifamtoota keenya                        |                |
| `messages/om.json` | showcase.openings.seal            | Wax-seal gates                                                | Balbala chaappaa sibiilaa                                       |                |
| `messages/om.json` | showcase.comingSoon               | Engagements are coming soon.                                  | Kaadhimmannaan dhiyootti ni dhufa.                              |                |
| `messages/om.json` | showcase.layouts.arches.*         | arch / arched window                                          | foddaa (olii) marsaa qabu                                       |                |
| `messages/om.json` | showcase.layouts.kaba.feel        | A groom's velvet kaba … gold-thread embroidery                | Kabaa veelvetii misirrichaa … tolfama foon warqee               |                |

## Default event titles

The titles the admin schedule pre-fills when an event kind is picked, in `src/lib/event-kinds.ts`. Ethiopian names (Telosh, Mels, Kelekel) are transliterated.
