import { describe, expect, it } from "vitest";
import { messagesForEvent, siteSlugFromPath } from "./event-messages";

const messages = {
  intro: { invited: "You are invited to the wedding of", open: "Open invitation" },
  footer: { families: "With love, the families of the bride and groom" },
  events: {
    honorees: { footer: { families: "With love, the family" } },
    graduation: { intro: { invited: "You are invited to celebrate" } },
  },
};

describe("messagesForEvent", () => {
  it("leaves a wedding's messages alone", () => {
    expect(messagesForEvent(messages, "wedding")).toEqual({ intro: messages.intro, footer: messages.footer });
  });

  it("lays a type's own wording over the shared messages and keeps the rest", () => {
    const graduation = messagesForEvent(messages, "graduation");
    expect(graduation.intro).toEqual({ invited: "You are invited to celebrate", open: "Open invitation" });
    expect(graduation.footer.families).toBe("With love, the family");
    expect(messages.intro.invited).toBe("You are invited to the wedding of");
    expect("events" in graduation).toBe(false);
  });

  it("gives honoree types the shared honoree lines even without their own", () => {
    expect(messagesForEvent(messages, "birthday").footer.families).toBe("With love, the family");
    expect(messagesForEvent(messages, "engagement").footer.families).toBe(messages.footer.families);
  });
});

describe("siteSlugFromPath", () => {
  it("finds the slug in site paths only", () => {
    expect(siteSlugFromPath("/s/ruth-mahlet")).toBe("ruth-mahlet");
    expect(siteSlugFromPath("/s/ruth-mahlet/card/abc")).toBe("ruth-mahlet");
    expect(siteSlugFromPath("/admin/couples")).toBeNull();
    expect(siteSlugFromPath("/s/")).toBeNull();
  });
});
