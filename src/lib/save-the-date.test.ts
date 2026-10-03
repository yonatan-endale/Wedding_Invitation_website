import { describe, expect, it } from "vitest";
import { pickSaveTheDatePhoto } from "./save-the-date";

const couple = { calendarPhotoUrl: null, heroPhotoUrl: "/cover.jpg", heroPosition: "50% 20%" };

describe("pickSaveTheDatePhoto", () => {
  it("uses the couple's chosen save-the-date photo first", () => {
    expect(pickSaveTheDatePhoto({ ...couple, calendarPhotoUrl: "/std.jpg" }, ["/a.jpg"], "gallery")).toEqual({
      src: "/std.jpg",
      position: "50% 40%",
    });
  });

  it("prefers the cover, keeping its focal point", () => {
    expect(pickSaveTheDatePhoto(couple, ["/a.jpg"], "hero")).toEqual({ src: "/cover.jpg", position: "50% 20%" });
  });

  it("prefers a gallery photo that is not the cover", () => {
    expect(pickSaveTheDatePhoto(couple, ["/cover.jpg", "/a.jpg"], "gallery")).toEqual({ src: "/a.jpg", position: "50% 40%" });
  });

  it("falls back to the other source, then to none", () => {
    expect(pickSaveTheDatePhoto(couple, ["/cover.jpg"], "gallery")).toEqual({ src: "/cover.jpg", position: "50% 20%" });
    expect(pickSaveTheDatePhoto({ ...couple, heroPhotoUrl: null }, ["/a.jpg"], "hero")).toEqual({ src: "/a.jpg", position: "50% 40%" });
    expect(pickSaveTheDatePhoto({ ...couple, heroPhotoUrl: null }, [], "hero")).toBeNull();
  });
});
