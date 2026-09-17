import { describe, expect, it } from "vitest";
import { resolveTenant, routeRequest, tenantRewritePath, coupleSiteUrl } from "./tenant";

describe("routeRequest", () => {
  it("rewrites couple subdomain pages to the couple route", () => {
    expect(routeRequest("demo.example.com", "/", "example.com")).toEqual({
      kind: "tenant",
      slug: "demo",
      path: "/s/demo",
    });
  });

  it("refuses admin pages and admin APIs on couple subdomains", () => {
    expect(routeRequest("demo.example.com", "/api/admin/upload", "example.com")).toEqual({ kind: "not-found" });
    expect(routeRequest("demo.localhost:3000", "/admin", undefined)).toEqual({ kind: "not-found" });
    expect(routeRequest("demo.localhost:3000", "/sign-in", undefined)).toEqual({ kind: "not-found" });
  });

  it("does not mistake paths that merely start with admin", () => {
    expect(routeRequest("demo.example.com", "/administrator", "example.com")).toEqual({
      kind: "tenant",
      slug: "demo",
      path: "/s/demo/administrator",
    });
  });

  it("leaves other API routes alone on couple subdomains", () => {
    expect(routeRequest("demo.example.com", "/api/health", "example.com")).toEqual({
      kind: "tenant",
      slug: "demo",
      path: "/api/health",
    });
  });

  it("sends main domain requests to the platform", () => {
    expect(routeRequest("example.com", "/admin", "example.com")).toEqual({ kind: "platform" });
  });

  it("serves couple paths on the main domain without auth for guests", () => {
    expect(routeRequest("wedding-sites.vercel.app", "/s/demo", undefined)).toEqual({ kind: "guest" });
    expect(routeRequest("wedding-sites.vercel.app", "/s/demo/opengraph-image", undefined)).toEqual({ kind: "guest" });
  });

  it("keeps auth on couple paths when the visitor has a sign-in session, for draft previews", () => {
    expect(routeRequest("wedding-sites.vercel.app", "/s/demo", undefined, { hasSession: true })).toEqual({
      kind: "platform",
    });
  });

  it("does not treat other paths starting with s as couple paths", () => {
    expect(routeRequest("wedding-sites.vercel.app", "/sign-in", undefined)).toEqual({ kind: "platform" });
  });
});

describe("resolveTenant", () => {
  it("reads the slug from a localhost subdomain in development", () => {
    expect(resolveTenant("demo.localhost:3000", undefined)).toBe("demo");
  });

  it("returns null for bare localhost", () => {
    expect(resolveTenant("localhost:3000", undefined)).toBeNull();
  });

  it("reads the slug from a subdomain of the root domain", () => {
    expect(resolveTenant("sara-dawit.example.com", "example.com")).toBe("sara-dawit");
  });

  it("ignores the port and letter case of the host", () => {
    expect(resolveTenant("Sara-Dawit.Example.com:443", "example.com")).toBe("sara-dawit");
  });

  it("returns null for the root domain itself", () => {
    expect(resolveTenant("example.com", "example.com")).toBeNull();
  });

  it("returns null for reserved subdomains", () => {
    expect(resolveTenant("www.example.com", "example.com")).toBeNull();
    expect(resolveTenant("admin.example.com", "example.com")).toBeNull();
    expect(resolveTenant("api.localhost:3000", undefined)).toBeNull();
  });

  it("returns null for nested subdomains", () => {
    expect(resolveTenant("a.b.example.com", "example.com")).toBeNull();
  });

  it("returns null for hosts outside the root domain such as vercel.app", () => {
    expect(resolveTenant("wedding-sites.vercel.app", "example.com")).toBeNull();
    expect(resolveTenant("wedding-sites.vercel.app", undefined)).toBeNull();
  });

  it("does not treat a lookalike domain as the root domain", () => {
    expect(resolveTenant("evil.notexample.com", "example.com")).toBeNull();
  });

  it("returns null when the host is missing", () => {
    expect(resolveTenant(null, "example.com")).toBeNull();
  });
});

describe("tenantRewritePath", () => {
  it("maps the site root to the couple page", () => {
    expect(tenantRewritePath("demo", "/")).toBe("/s/demo");
  });

  it("keeps nested paths under the couple page", () => {
    expect(tenantRewritePath("demo", "/opengraph-image")).toBe("/s/demo/opengraph-image");
  });
});

describe("coupleSiteUrl", () => {
  it("uses a subdomain when a root domain is configured", () => {
    expect(coupleSiteUrl("demo", { rootDomain: "example.com", origin: "https://example.com" })).toBe(
      "https://demo.example.com",
    );
  });

  it("falls back to a path on the current origin without a root domain", () => {
    expect(coupleSiteUrl("demo", { rootDomain: undefined, origin: "https://wedding-sites.vercel.app" })).toBe(
      "https://wedding-sites.vercel.app/s/demo",
    );
  });

  it("keeps http and the port for localhost subdomains", () => {
    expect(coupleSiteUrl("demo", { rootDomain: "localhost:3000", origin: "http://localhost:3000" })).toBe(
      "http://demo.localhost:3000",
    );
  });
});
