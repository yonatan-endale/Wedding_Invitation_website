/**
 * Creates (or recreates) a demo couple so you can see every section working.
 * Run with: pnpm db:seed
 */
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pinSslMode } from "../src/db/connection-string";
import * as schema from "../src/db/schema";

const SLUG = "hanna-dawit";
const TZ = "Africa/Addis_Ababa";
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=75`;
/** Addis Ababa is UTC+3 all year. */
const addis = (local: string) => new Date(`${local}:00+03:00`);

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set. Run with: pnpm db:seed");
  const pool = new Pool({ connectionString: pinSslMode(connectionString) });
  const db = drizzle(pool, { schema });

  await db.delete(schema.couples).where(eq(schema.couples.slug, SLUG));

  const [couple] = await db
    .insert(schema.couples)
    .values({
      slug: SLUG,
      status: "published",
      partnerOne: { en: "Hanna", am: "ሐና" },
      partnerTwo: { en: "Dawit", am: "ዳዊት" },
      tagline: { en: "Two families, one table.", am: "ሁለት ቤተሰብ፣ አንድ ማዕድ።" },
      weddingAt: addis("2027-01-23T10:00"),
      timezone: TZ,
      city: { en: "Addis Ababa", am: "አዲስ አበባ" },
      hosts: {
        en: "Together with the families of Tesfaye Alemu and Mulugeta Bekele",
        am: "ከአቶ ተስፋዬ ዓለሙ እና ከአቶ ሙሉጌታ በቀለ ቤተሰቦች ጋር በመሆን",
      },
      invitation: {
        en: "Hanna and Dawit joyfully invite you to celebrate their marriage, to pray with them, eat with them and dance with them until late.",
        am: "ሐና እና ዳዊት በጋብቻቸው ቀን ከእነርሱ ጋር እንዲጸልዩ፣ እንዲመገቡ እና እስከ ምሽት እንዲደሰቱ በደስታ ይጋብዙዎታል።",
      },
      story: {
        en: "We met in 2019 at a friend's coffee ceremony in Bole. Dawit was in charge of the popcorn and burnt the first batch. Hanna laughed, then showed him how her grandmother does it.\n\nFive years of Sunday walks up Entoto, long phone calls between Addis and Hawassa, and one very nervous conversation with Hanna's father later, Dawit asked her to marry him on the same balcony where they first met.\n\nWe can't imagine this day without the people who have walked with us. Come celebrate with us.",
        am: "በ2011 ዓ.ም. ቦሌ በሚገኝ የጓደኛችን ቤት የቡና ሥነ ሥርዓት ላይ ተገናኘን። ዳዊት ፈንድሻ የማዘጋጀት ኃላፊነት ተሰጥቶት የመጀመሪያውን አሳረረው። ሐና ሳቀች፤ ከዚያም አያቷ እንዴት እንደሚያዘጋጁት አሳየችው።\n\nከአምስት ዓመታት የእሑድ የእንጦጦ የእግር ጉዞዎች፣ በአዲስ አበባ እና በሐዋሳ መካከል ከተደረጉ ረጅም የስልክ ጥሪዎች እና ከሐና አባት ጋር ከተደረገ አስጨናቂ ውይይት በኋላ ዳዊት መጀመሪያ በተገናኙበት በረንዳ ላይ ጋብቻ ጠየቃት።\n\nአብረውን የተጓዙ ወዳጆቻችን የሌሉበትን ይህን ቀን ልናስበው አንችልም። መጥታችሁ አብራችሁን አክብሩ።",
      },
      scripture: {
        en: "Many waters cannot quench love, neither can the floods drown it.",
        am: "ብዙ ውኃ ፍቅርን ያጠፋት ዘንድ አይችልም፤ ፈሳሾችም አያሰጥሙአትም።",
      },
      scriptureRef: { en: "Song of Songs 8:7", am: "መኃልየ መኃልይ 8፥7" },
      dressCode: {
        en: "Habesha kemis, suits or anything you feel celebrated in.",
        am: "የሀበሻ ቀሚስ፣ ሱፍ ወይም የሚያምርብዎትን ልብስ።",
      },
      giftNote: {
        en: "Your presence is the greatest gift. If you would like to bless our new home, you can send a gift using the details below. These demo numbers are placeholders.",
        am: "የእርስዎ መገኘት ትልቁ ስጦታችን ነው። አዲሱን ቤታችንን መባረክ ከፈለጉ ከዚህ በታች ያሉትን መረጃዎች መጠቀም ይችላሉ። እነዚህ የማሳያ ቁጥሮች ናቸው።",
      },
      heroPhotoUrl: unsplash("1551963319-13ff32a5acd1"),
      heroPosition: "50% 40%",
      musicUrl: "/demo/canon-in-d.mp3",
      musicTitle: "Canon in D, U.S. Air Force Band (public domain)",
      telegramUrl: "https://t.me/",
      theme: "tibeb",
      rsvpEnabled: true,
      rsvpDeadline: addis("2027-01-09T23:59"),
    })
    .returning();

  const [church, reception] = await db
    .insert(schema.venues)
    .values([
      {
        coupleId: couple.id,
        name: { en: "Holy Trinity Cathedral", am: "መንበረ ፀባዖት ቅድስት ሥላሴ ካቴድራል" },
        address: { en: "Arat Kilo, Addis Ababa", am: "አራት ኪሎ፣ አዲስ አበባ" },
        lat: 9.0303,
        lng: 38.7663,
        imageUrl: unsplash("1565428136418-a012111c85b8"),
        sortOrder: 0,
      },
      {
        coupleId: couple.id,
        name: { en: "Garden reception hall", am: "የአትክልት ስፍራ የግብዣ አዳራሽ" },
        address: { en: "Meskel Square, Addis Ababa", am: "መስቀል አደባባይ፣ አዲስ አበባ" },
        lat: 9.0107,
        lng: 38.761,
        imageUrl: unsplash("1752159985395-ee98f2574448"),
        sortOrder: 1,
      },
    ])
    .returning();

  await db.insert(schema.events).values([
    {
      coupleId: couple.id,
      title: { en: "Guests arrive", am: "የእንግዶች አቀባበል" },
      startsAt: addis("2027-01-23T09:30"),
      venueId: church.id,
    },
    {
      coupleId: couple.id,
      title: { en: "Holy matrimony", am: "የቅዱስ ጋብቻ ሥነ ሥርዓት" },
      description: { en: "Please be seated before the procession begins.", am: "እባክዎ ሥነ ሥርዓቱ ከመጀመሩ በፊት ይቀመጡ።" },
      startsAt: addis("2027-01-23T10:00"),
      venueId: church.id,
    },
    {
      coupleId: couple.id,
      title: { en: "Lunch and family photos", am: "ምሳ እና የቤተሰብ ፎቶ" },
      startsAt: addis("2027-01-23T13:00"),
      venueId: reception.id,
    },
    {
      coupleId: couple.id,
      title: { en: "Reception and dinner", am: "የራት ግብዣ" },
      description: { en: "Speeches from both families, then dinner.", am: "የሁለቱም ቤተሰቦች ንግግር፣ ከዚያም እራት።" },
      startsAt: addis("2027-01-23T18:00"),
      venueId: reception.id,
    },
    {
      coupleId: couple.id,
      title: { en: "Eskista until late", am: "እስክስታ እስከ ምሽት" },
      startsAt: addis("2027-01-23T21:00"),
      venueId: reception.id,
    },
  ]);

  const gallery = [
    "1720791176076-e8f9fc8cc62b",
    "1645827042168-4fb0cdd0bf7e",
    "1606495186270-395860907235",
    "1558794384-03504283146c",
    "1558794401-54d7fce8d534",
    "1585556282289-d4d5a7967936",
    "1558525074-ffde186fce7c",
    "1558794414-bdf63cfe06d7",
  ];
  await db.insert(schema.photos).values(
    gallery.map((id, index) => ({ coupleId: couple.id, url: unsplash(id), sortOrder: index })),
  );

  await db.insert(schema.giftAccounts).values([
    {
      coupleId: couple.id,
      kind: "bank",
      provider: "Commercial Bank of Ethiopia",
      accountName: "Hanna Tesfaye",
      accountNumber: "1000 0000 0000 0",
      sortOrder: 0,
    },
    {
      coupleId: couple.id,
      kind: "telebirr",
      provider: "Telebirr",
      accountName: "Dawit Mulugeta",
      accountNumber: "0900 000 000",
      sortOrder: 1,
    },
  ]);

  await db.insert(schema.wishlistItems).values([
    {
      coupleId: couple.id,
      title: { en: "Jebena and coffee cups", am: "ጀበና እና ሲኒዎች" },
      url: "https://example.com/jebena",
      price: "ETB 3,500",
      sortOrder: 0,
    },
    {
      coupleId: couple.id,
      title: { en: "Mesob for the dining room", am: "ለመመገቢያ ክፍል መሶብ" },
      url: "https://example.com/mesob",
      price: "ETB 6,000",
      sortOrder: 1,
    },
    {
      coupleId: couple.id,
      title: { en: "Honeymoon fund", am: "ለጫጉላ ሽርሽር" },
      sortOrder: 2,
    },
  ]);

  await pool.end();
  console.log(`Seeded demo couple "${SLUG}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
