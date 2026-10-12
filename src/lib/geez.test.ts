import { describe, expect, it } from "vitest";
import { toGeez } from "./geez";

describe("toGeez", () => {
  it("writes ones and tens", () => {
    expect(toGeez(1)).toBe("፩");
    expect(toGeez(9)).toBe("፱");
    expect(toGeez(10)).toBe("፲");
    expect(toGeez(29)).toBe("፳፱");
    expect(toGeez(99)).toBe("፺፱");
  });

  it("counts hundreds with ፻, leaving out a lone one", () => {
    expect(toGeez(100)).toBe("፻");
    expect(toGeez(101)).toBe("፻፩");
    expect(toGeez(110)).toBe("፻፲");
    expect(toGeez(200)).toBe("፪፻");
    expect(toGeez(999)).toBe("፱፻፺፱");
  });

  it("writes thousands as tens of hundreds", () => {
    expect(toGeez(1000)).toBe("፲፻");
    expect(toGeez(2019)).toBe("፳፻፲፱");
    expect(toGeez(2026)).toBe("፳፻፳፮");
    expect(toGeez(9999)).toBe("፺፱፻፺፱");
  });

  it("counts ten thousands with ፼", () => {
    expect(toGeez(10000)).toBe("፼");
    expect(toGeez(10001)).toBe("፼፩");
    expect(toGeez(10100)).toBe("፼፻");
    expect(toGeez(12345)).toBe("፼፳፫፻፵፭");
    expect(toGeez(20000)).toBe("፪፼");
    expect(toGeez(1000000)).toBe("፻፼");
    expect(toGeez(1010000)).toBe("፻፩፼");
  });

  it("falls back to plain digits where Ge'ez has no numeral", () => {
    expect(toGeez(0)).toBe("0");
    expect(toGeez(-5)).toBe("-5");
    expect(toGeez(1.5)).toBe("1.5");
    expect(toGeez(Number.NaN)).toBe("NaN");
  });
});
