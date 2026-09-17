/**
 * Postgres drivers currently treat sslmode=require as the strict verify-full, but a
 * future major version will weaken it to libpq semantics, which skip certificate
 * checks. Writing verify-full keeps today's behaviour and silences the driver warning.
 * A connection string that asks for libpq behaviour explicitly is left alone.
 */
export function pinSslMode(connectionString: string): string {
  if (/[?&]uselibpqcompat=true\b/i.test(connectionString)) return connectionString;
  return connectionString.replace(/([?&]sslmode=)(require|prefer|verify-ca)\b/i, "$1verify-full");
}
