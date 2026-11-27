# Arabic strings waiting for a native speaker

All of `messages/ar.json` is a machine-quality draft, translated from
`messages/en.json` with `messages/am.json` as a second reference. A native
Arabic speaker must review it before Arabic is switched on for real guests.
The table below lists the strings the translator was least sure about; please
read the rest too. Mark a row done by filling in the reviewer and date.

## Conventions to confirm

- Digits: the site prints Western digits (1, 2, 3) everywhere, including
  inside Arabic text. Should Arabic pages use Arabic-Indic digits (١، ٢، ٣)
  for dates, times, counts and the countdown?
- Ethiopian clock times: Amharic pages show local time, so "8:00" in the
  afternoon means 2 PM. If Arabic pages reuse that clock, an Arabic reader will
  read "8:00 بعد الظهر" as 8 PM. Decide whether Arabic shows the international
  clock only, or both.
- Joining names: "و" is attached directly to the second name ("{one} و{two}"),
  with no space, as in standard Arabic. Confirm this reads well with Latin or
  Ge'ez names, where a space may be clearer.
- Register: guests are addressed in the respectful plural (أنتم، أدخلوا،
  افتحوا) throughout, and the hosts in the dual for weddings (يتشرفان) and the
  plural for other events (يتشرفون). Confirm the plural is right for a single
  guest addressed by name ("عزيزنا {name}").
- Gender: "عزيزنا" and "سيحضر / لن يحضر" use the masculine default. The site
  does not know a guest's gender.
- Plurals: countdown strings use the full Arabic plural set (zero, one, two,
  few, many, other). Check the many/other forms (يومًا vs يوم).
- Ethiopian terms are transliterated, not explained: الملس (Mels), النتيلا
  (Netela), الأدي (Adey), الشَّمَّا (shema), الكابا (kaba), الهَرَغ (harag),
  كريستنا (kristina). Brand names (WhatsApp, Telegram, Telebirr, Google) stay in
  Latin script.

## Strings to check first

| Where              | Key                               | English                                                     | Arabic draft                                                          | Reviewer, date |
| ------------------ | --------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- | -------------- |
| `messages/ar.json` | intro.invited                     | You are invited to the wedding of                           | أنتم مدعوون لحضور حفل زفاف                                            |                |
| `messages/ar.json` | intro.letter                      | invite you to celebrate their wedding                       | يتشرفان بدعوتكم لمشاركتهما فرحة زفافهما                               |                |
| `messages/ar.json` | intro.dear / card.dear            | Dear {name},                                                | عزيزنا {name}،                                                        |                |
| `messages/ar.json` | nav.rsvp / rsvp.heading           | RSVP                                                        | تأكيد الحضور                                                          |                |
| `messages/ar.json` | footer.families                   | With love, the families of the bride and groom              | مع خالص المحبة، عائلتا العروسين                                       |                |
| `messages/ar.json` | countdown.summary                 | {days} days, {hours} hours and {minutes} minutes left       | بقي {days} و{hours} و{minutes} (plural forms)                         |                |
| `messages/ar.json` | saveTheDate.gregorian             | Gregorian                                                   | الميلادي                                                              |                |
| `messages/ar.json` | invitation.hostsFallback          | Together with their families                                | بمشاركة عائلتيهما                                                     |                |
| `messages/ar.json` | invitation.defaultText            | request the pleasure of your company as they celebrate ...  | يتشرفان بدعوتكم لحضور حفل زفافهما ومشاركتهما فرحتهما.                 |                |
| `messages/ar.json` | invitation.dressCode              | Dress code                                                  | قواعد اللباس                                                          |                |
| `messages/ar.json` | rsvp.yes / rsvp.no                | Joyfully accept / Regretfully decline                       | أقبل الدعوة بكل سرور / أعتذر عن الحضور مع الأسف                       |                |
| `messages/ar.json` | card.admits                       | Admits {count}                                              | يسمح بدخول {count}                                                    |                |
| `messages/ar.json` | card.pass.title                   | Entry pass                                                  | تصريح الدخول                                                          |                |
| `messages/ar.json` | couplePortal.wishesHeading        | Wishes                                                      | التهاني                                                               |                |
| `messages/ar.json` | layouts.reel.presents             | Two families present                                        | تقدّم عائلتان                                                         |                |
| `messages/ar.json` | layouts.reel.ending               | And so it begins                                            | وهكذا تبدأ الحكاية                                                    |                |
| `messages/ar.json` | layouts.kaba.mels                 | A family tradition                                          | تقليد عائلي                                                           |                |
| `messages/ar.json` | layouts.brana.colophon            | Here ends this book; may the love written in it never end.  | هنا ينتهي هذا الكتاب؛ ولا انتهى الحب المكتوب فيه أبدًا.               |                |
| `messages/ar.json` | layouts.brana.writtenIn           | Written in the year <year></year> of the Ethiopian calendar | كُتب في عام <year></year> بالتقويم الإثيوبي                           |                |
| `messages/ar.json` | layouts.tassel.graduates          | Graduate(s) of {year}                                       | خرّيج / خرّيجا / خرّيجو دفعة {year}                                   |                |
| `messages/ar.json` | layouts.milestone.years           | years                                                       | عامًا                                                                 |                |
| `messages/ar.json` | layouts.shema.godparents          | Godparents                                                  | العرّابان                                                             |                |
| `messages/ar.json` | events.baptism.\* (christening)   | christening                                                 | المعمودية                                                             |                |
| `messages/ar.json` | events.birthday.nav.couple        | Birthday                                                    | صاحب العيد                                                            |                |
| `messages/ar.json` | showcase.openings.adey / netela   | Adey bloom / Netela                                         | تفتّح زهرة الأدي / النتيلا                                            |                |
| `messages/ar.json` | showcase.layouts.brana.b3         | The day as a canon table, and a colophon at the end         | اليوم في جدول على هيئة جداول الأناجيل، وخاتمة الناسخ في النهاية      |                |
| `messages/ar.json` | showcase.layouts.slate.goodFor    | Modern weddings, and destination and diaspora couples.      | حفلات الزفاف العصرية، والأزواج في المهجر أو في وجهات السفر.           |                |

## Notes for the reviewer

- `layouts.arches.allPhotos` and similar: the English "View all {count} photos"
  became "عرض كل الصور ({count})" to avoid Arabic number-noun agreement with a
  plain argument. Rewrite as a plural block if a sentence form reads better.
- `events.birthday.nav.couple` uses the masculine "صاحب العيد"; the honoree may
  be female or several people.
- Arabic is right-to-left. These strings assume the page sets `dir="rtl"`;
  mixed Latin names and `+251` phone numbers should be checked on a real page.

## Default event titles

The titles the admin schedule pre-fills when an event kind is picked, in `src/lib/event-kinds.ts`. Ethiopian names (Telosh, Mels, Kelekel) are transliterated.

## Meto birthday layout

The birthday layout for an elder's 90th or 100th (`src/components/events/layouts/meto`). `years` uses Arabic plural categories: 100 takes the singular genitive (100 عام), 11–99 the accusative (60 عامًا). `wish` is the usual birthday greeting addressed to everyone (أنتم).

| File | Key | English | Arabic | Reviewer |
|---|---|---|---|---|
| `messages/ar.json` | layouts.meto.years | {age, plural, one {# year} other {# years}} | {age, plural, zero {# عام} one {عام واحد} two {عامان} few {# أعوام} many {# عامًا} other {# عام}} | |
| `messages/ar.json` | layouts.meto.gallery | A life in pictures | حياة في صور | |
| `messages/ar.json` | layouts.meto.wish | Many happy returns of the day | كل عام وأنتم بخير | |
| `messages/ar.json` | showcase.layouts.meto.feel | For an elder's 90th or 100th: the age in Ge'ez numerals inside a gold laurel, over a broad band of woven tibeb. | لعيد الميلاد التسعين أو المئة: العمر بالأرقام الجعزية داخل إكليل غار ذهبي، فوق شريط عريض من التطريز المنسوج. | |
| `messages/ar.json` | showcase.layouts.meto.mood | Pale, warm and dignified | فاتح ودافئ ووقور | |
| `messages/ar.json` | showcase.layouts.meto.goodFor | A 90th, a 100th, or any elder's birthday. | عيد الميلاد التسعون أو المئة، أو ميلاد أي من كبار السن. | |
| `messages/ar.json` | showcase.layouts.meto.b1 | The age in Ge'ez numerals, read from their own line | العمر بالأرقام الجعزية، يُقرأ من سطرهم الخاص | |
| `messages/ar.json` | showcase.layouts.meto.b2 | Woven tibeb under the cover and at the close | تطريز منسوج تحت الغلاف وفي الختام | |
| `messages/ar.json` | showcase.layouts.meto.b3 | An adey flower and a wish above the replies | زهرة أداي وأمنية فوق الردود | |
