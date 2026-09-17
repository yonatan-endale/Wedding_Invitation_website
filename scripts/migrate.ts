/**
 * Applies database migrations from ./drizzle. Runs before `next build`, so every
 * Vercel deployment brings its database up to date.
 * Skips quietly when no database is configured (for example a local build).
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

async function main() {
  // Neon's Vercel integration also provides a direct (unpooled) URL, which suits migrations best.
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) {
    console.log("Migrations skipped: DATABASE_URL is not set.");
    return;
  }

  const pool = new Pool({ connectionString, max: 1 });
  try {
    await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
    console.log("Database migrations are up to date.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Database migration failed:", error);
  process.exit(1);
});
