import { describe, expect, it } from "vitest";
import { canOptimizeImage } from "./images";

describe("canOptimizeImage", () => {
  it("optimizes files served from this site", () => {
    expect(canOptimizeImage("/demo/photo.jpg")).toBe(true);
  });

  it("optimizes Unsplash and Vercel Blob images", () => {
    expect(canOptimizeImage("https://images.unsplash.com/photo-1?w=2000")).toBe(true);
    expect(canOptimizeImage("https://abc123.public.blob.vercel-storage.com/photos/a.jpg")).toBe(true);
  });

  it("serves other hosts as-is because next/image would reject them", () => {
    expect(canOptimizeImage("https://example.com/a.jpg")).toBe(false);
    expect(canOptimizeImage("http://images.unsplash.com/photo-1")).toBe(false);
    expect(canOptimizeImage("not a url")).toBe(false);
  });
});
