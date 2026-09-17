import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Db = NodePgDatabase<typeof schema>;

let db: Db | null = null;

/**
 * Lazily creates one pooled connection per server instance. Works with Neon
 * (use its pooled connection string) and with a local Postgres in development.
 */
export function getDb(): Db {
  if (db) return db;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Run `vercel env pull .env.local --yes` or see README.md.");
  }
  const pool = new Pool({ connectionString, max: 5, idleTimeoutMillis: 5_000 });
  attachDatabasePool(pool);
  db = drizzle(pool, { schema });
  return db;
}
