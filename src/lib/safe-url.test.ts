import { describe, expect, it } from "vitest";
import { safeHttpUrl } from "./safe-url";

describe("safeHttpUrl", () => {
  it("keeps http and https links", () => {
    expect(safeHttpUrl("https://t.me/example")).toBe("https://t.me/example");
    expect(safeHttpUrl("http://example.com")).toBe("http://example.com/");
  });

  it("refuses everything else", () => {
    for (const bad of [
      "javascript:alert(1)",
      "data:text/html,x",
      "tel:+251900000000",
      "//evil.example",
      "nope",
      "",
      undefined,
      null,
    ]) {
      expect(safeHttpUrl(bad)).toBeNull();
    }
  });
});
