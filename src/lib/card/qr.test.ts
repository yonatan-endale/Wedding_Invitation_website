import { describe, expect, it } from "vitest";
import { qrPath } from "./qr";

describe("qrPath", () => {
  it("draws a square symbol as one path", () => {
    const { size, path } = qrPath("https://example.com/s/hanna-dawit/pass/0123456789abcdef0123456789abcdef");
    expect(size).toBeGreaterThanOrEqual(21);
    expect((size - 17) % 4).toBe(0);
    expect(path).toMatch(/^M0 0h7v1h-7z/);
    expect(path).not.toMatch(/[^-Mhvz0-9 ]/);
  });

  it("changes with the text", () => {
    expect(qrPath("a").path).not.toBe(qrPath("b").path);
  });
});
