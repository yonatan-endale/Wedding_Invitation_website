import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("writes a header row and data rows", () => {
    const csv = toCsv(
      [{ name: "Abebe", guests: 2 }],
      [
        { key: "name", header: "Name" },
        { key: "guests", header: "Guests" },
      ],
    );
    expect(csv).toBe("Name,Guests\r\nAbebe,2\r\n");
  });

  it("quotes commas, quotes and newlines", () => {
    const csv = toCsv([{ note: 'He said "hi",\nthen left' }], [{ key: "note", header: "Note" }]);
    expect(csv).toBe('Note\r\n"He said ""hi"",\nthen left"\r\n');
  });

  it("neutralises spreadsheet formulas", () => {
    const csv = toCsv([{ name: "=HYPERLINK(1)" }], [{ key: "name", header: "Name" }]);
    expect(csv).toBe("Name\r\n'=HYPERLINK(1)\r\n");
  });

  it("writes empty cells for null and undefined", () => {
    const csv = toCsv([{ a: null, b: undefined }], [
      { key: "a", header: "A" },
      { key: "b", header: "B" },
    ]);
    expect(csv).toBe("A,B\r\n,\r\n");
  });
});
