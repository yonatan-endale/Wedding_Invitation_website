import { describe, expect, it } from "vitest";
import { copyKey } from "./event-copy";

const messages = new Set(["intro.invited", "events.graduation.intro.invited"]);
const has = (key: string) => messages.has(key);

describe("copyKey", () => {
  it("reads a type's own wording when it has one", () => {
    expect(copyKey("graduation", "intro.invited", has)).toBe("events.graduation.intro.invited");
  });

  it("falls back to the shared key", () => {
    expect(copyKey("birthday", "intro.invited", has)).toBe("intro.invited");
  });

  it("never moves wedding copy", () => {
    expect(copyKey("wedding", "intro.invited", () => true)).toBe("intro.invited");
  });
});
