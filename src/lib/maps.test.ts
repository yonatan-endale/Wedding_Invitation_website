import { describe, expect, it } from "vitest";
import { mapsEmbedUrl, mapsLink } from "./maps";

describe("mapsLink", () => {
  it("prefers a pasted maps URL", () => {
    expect(mapsLink({ mapsUrl: "https://maps.app.goo.gl/abc123", lat: 9, lng: 38, address: "Bole" })).toBe(
      "https://maps.app.goo.gl/abc123",
    );
  });

  it("ignores non-http URLs", () => {
    expect(mapsLink({ mapsUrl: "javascript:alert(1)", lat: 9.01, lng: 38.76 })).toBe(
      "https://www.google.com/maps/search/?api=1&query=9.01%2C38.76",
    );
  });

  it("builds a search link from coordinates", () => {
    expect(mapsLink({ lat: 9.0192, lng: 38.7525 })).toBe(
      "https://www.google.com/maps/search/?api=1&query=9.0192%2C38.7525",
    );
  });

  it("builds a search link from the address", () => {
    expect(mapsLink({ address: "Kazanchis, Addis Ababa" })).toBe(
      "https://www.google.com/maps/search/?api=1&query=Kazanchis%2C%20Addis%20Ababa",
    );
  });

  it("returns null when there is nothing to locate", () => {
    expect(mapsLink({ mapsUrl: "", address: "  " })).toBeNull();
  });
});

describe("mapsEmbedUrl", () => {
  it("embeds coordinates without an API key", () => {
    expect(mapsEmbedUrl({ lat: 9.0192, lng: 38.7525 })).toBe(
      "https://maps.google.com/maps?q=9.0192%2C38.7525&z=16&output=embed",
    );
  });

  it("returns null without coordinates or address", () => {
    expect(mapsEmbedUrl({})).toBeNull();
  });
});
