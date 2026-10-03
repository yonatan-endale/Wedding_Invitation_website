import { describe, expect, it } from "vitest";
import { parseGuestName } from "./guest";

describe("parseGuestName", () => {
  it("reads the name from the link", () => {
    expect(parseGuestName("Abebe")).toBe("Abebe");
    expect(parseGuestName("አበበ በቀለ")).toBe("አበበ በቀለ");
    expect(parseGuestName(["Abebe", "Kebede"])).toBe("Abebe");
  });

  it("returns nothing for a missing or blank name", () => {
    expect(parseGuestName(undefined)).toBeNull();
    expect(parseGuestName("")).toBeNull();
    expect(parseGuestName("   \n ")).toBeNull();
  });

  it("collapses spaces and drops control and direction characters", () => {
    expect(parseGuestName("  Abebe \t\n Kebede ")).toBe("Abebe Kebede");
    expect(parseGuestName("Abe‮be\u0000")).toBe("Abe be");
  });

  it("caps long names at 60 characters without splitting a syllable", () => {
    const name = parseGuestName("ሀ".repeat(80));
    expect(name).toHaveLength(60);
  });

  it("keeps markup as plain text for React to escape", () => {
    expect(parseGuestName("<script>alert(1)</script>")).toBe("<script>alert(1)</script>");
  });
});

describe("parseGuestName against stacked marks", () => {
  it("keeps real accents but strips floods of combining marks", () => {
    expect(parseGuestName("Ze\u0301na")).toBe("Z\u00e9na");
    const flood = parseGuestName("A" + "\u0301".repeat(500) + "bebe");
    // NFC first composes A plus one accent into a single character, then three more marks are kept.
    expect(flood).toBe("\u00c1\u0301\u0301\u0301bebe");
    expect(parseGuestName("\u0301".repeat(400).repeat(60))!.length).toBeLessThanOrEqual(120);
  });
});
