import { describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin";

describe("isAdminEmail", () => {
  it("matches an allowlisted email ignoring case and spaces", () => {
    expect(isAdminEmail("Me@Example.com", " other@x.com, me@example.com ")).toBe(true);
  });

  it("rejects emails that are not on the list", () => {
    expect(isAdminEmail("guest@example.com", "me@example.com")).toBe(false);
  });

  it("rejects everyone when the allowlist is empty or missing", () => {
    expect(isAdminEmail("me@example.com", "")).toBe(false);
    expect(isAdminEmail("me@example.com", undefined)).toBe(false);
  });

  it("rejects a missing email", () => {
    expect(isAdminEmail(undefined, "me@example.com")).toBe(false);
  });
});
