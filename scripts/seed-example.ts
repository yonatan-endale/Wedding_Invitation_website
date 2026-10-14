/**
 * Creates (or recreates) a demo site from one of the files in public/examples
 * (graduation, birthday, baptism), through the same checks as the admin's JSON import.
 * Run with: pnpm db:seed:example <graduation|birthday|baptism> [slug] [--publish]
 */
import { readFileSync } from "node:fs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pinSslMode } from "../src/db/connection-string";
import { importCouple } from "../src/db/queries/couple-import";
import * as schema from "../src/db/schema";
import { parseCoupleImport } from "../src/lib/validation/couple-import";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set. Run with: pnpm db:seed:example <example>");
  const [example, slug] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  if (!example || !/^[a-z]+$/.test(example)) throw new Error("Name an example in public/examples, such as graduation or birthday.");
  const publish = process.argv.includes("--publish");

  const raw = JSON.parse(readFileSync(new URL(`../public/examples/${example}.json`, import.meta.url), "utf8"));
  if (slug) raw.couple.slug = slug;
  if (publish) raw.couple.status = "published";
  const parsed = parseCoupleImport(raw);
  if (!parsed.success) throw new Error(`The example file has problems:\n${parsed.issues.join("\n")}`);

  const pool = new Pool({ connectionString: pinSslMode(connectionString) });
  try {
    const { id } = await importCouple(drizzle(pool, { schema }), parsed.data, { replace: true });
    console.log(`Ready: /s/${parsed.data.couple.slug} (admin /admin/sites/${id})`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
