import { createHash, randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";

/** A url-safe random secret. 32 bytes is 256 bits, far beyond guessing. */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/** Secrets are stored as their sha256, so a leaked database row can't be used as a link. */
export function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/** No 0/O or 1/I/L, so a passcode read out over the phone survives. */
const PASSCODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const PASSCODE_LENGTH = 8;

/** Eight characters shown as two groups, such as "K7QM-3XRA". */
export function newPasscode(): string {
  const chars = Array.from({ length: PASSCODE_LENGTH }, () => PASSCODE_ALPHABET[randomInt(PASSCODE_ALPHABET.length)]);
  return `${chars.slice(0, 4).join("")}-${chars.slice(4).join("")}`;
}

/** Uppercases and drops spaces and dashes, so "k7qm 3xra" matches "K7QM-3XRA". */
export function normalizePasscode(input: string): string {
  return input.toUpperCase().replace(/[^0-9A-Z]/g, "");
}

const KEY_LENGTH = 32;

function scryptKey(passcode: string, salt: Buffer, length: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(normalizePasscode(passcode), salt, length, (error, key) => (error ? reject(error) : resolve(key))),
  );
}

/** Salted scrypt, stored as "salt:hash" in base64url. */
export async function hashPasscode(passcode: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptKey(passcode, salt, KEY_LENGTH);
  return `${salt.toString("base64url")}:${key.toString("base64url")}`;
}

export async function verifyPasscode(passcode: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  if (expected.length !== KEY_LENGTH) return false;
  const actual = await scryptKey(passcode, Buffer.from(salt, "base64url"), KEY_LENGTH);
  return timingSafeEqual(expected, actual);
}

/** Compares two secrets in constant time, for values that are not passcodes. */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
