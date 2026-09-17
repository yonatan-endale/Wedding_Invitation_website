import { describe, expect, it } from "vitest";
import { pinSslMode } from "./connection-string";

describe("pinSslMode", () => {
  it("pins the weaker aliases to verify-full", () => {
    expect(pinSslMode("postgres://u:p@host/db?sslmode=require")).toBe("postgres://u:p@host/db?sslmode=verify-full");
    expect(pinSslMode("postgres://u:p@host/db?sslmode=prefer")).toBe("postgres://u:p@host/db?sslmode=verify-full");
    expect(pinSslMode("postgres://u:p@host/db?sslmode=verify-ca")).toBe("postgres://u:p@host/db?sslmode=verify-full");
  });

  it("keeps other parameters and their order", () => {
    expect(pinSslMode("postgres://u:p@host/db?sslmode=require&channel_binding=require")).toBe(
      "postgres://u:p@host/db?sslmode=verify-full&channel_binding=require",
    );
  });

  it("leaves connection strings without an SSL mode alone", () => {
    expect(pinSslMode("postgres://localhost:5432/wedding_dev")).toBe("postgres://localhost:5432/wedding_dev");
  });

  it("leaves stricter or already pinned modes alone", () => {
    expect(pinSslMode("postgres://u:p@host/db?sslmode=verify-full")).toBe("postgres://u:p@host/db?sslmode=verify-full");
    expect(pinSslMode("postgres://u:p@host/db?sslmode=no-verify")).toBe("postgres://u:p@host/db?sslmode=no-verify");
    expect(pinSslMode("postgres://u:p@host/db?sslmode=disable")).toBe("postgres://u:p@host/db?sslmode=disable");
  });

  it("respects an explicit request for libpq behaviour", () => {
    const url = "postgres://u:p@host/db?uselibpqcompat=true&sslmode=require";
    expect(pinSslMode(url)).toBe(url);
  });
});
