import { describe, expect, it } from "vitest";
import { hashPasscode, newPasscode, normalizePasscode, randomToken, safeEqual, sha256, verifyPasscode } from "./tokens";

describe("randomToken", () => {
  it("is url-safe and 43 characters for 32 bytes", () => {
    const token = randomToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("never repeats", () => {
    const tokens = new Set(Array.from({ length: 200 }, () => randomToken()));
    expect(tokens.size).toBe(200);
  });
});

describe("sha256", () => {
  it("is hex and stable", () => {
    expect(sha256("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});

describe("passcodes", () => {
  it("looks like XXXX-XXXX without look-alike characters", () => {
    for (let i = 0; i < 50; i += 1) expect(newPasscode()).toMatch(/^[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/);
  });

  it("ignores case, spaces and dashes", () => {
    expect(normalizePasscode(" k7qm 3xra ")).toBe("K7QM3XRA");
    expect(normalizePasscode("K7QM-3XRA")).toBe("K7QM3XRA");
  });

  it("verifies the right passcode and rejects others", async () => {
    const stored = await hashPasscode("K7QM-3XRA");
    expect(stored).not.toContain("K7QM");
    expect(await verifyPasscode("k7qm3xra", stored)).toBe(true);
    expect(await verifyPasscode("K7QM-3XRB", stored)).toBe(false);
    expect(await verifyPasscode("", stored)).toBe(false);
  });

  it("salts each hash", async () => {
    expect(await hashPasscode("AAAA-BBBB")).not.toBe(await hashPasscode("AAAA-BBBB"));
  });

  it("rejects malformed stored values", async () => {
    expect(await verifyPasscode("AAAA-BBBB", "nonsense")).toBe(false);
    expect(await verifyPasscode("AAAA-BBBB", "a:b")).toBe(false);
  });
});

describe("safeEqual", () => {
  it("compares strings", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });
});
