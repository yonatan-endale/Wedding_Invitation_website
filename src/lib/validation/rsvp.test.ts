import { describe, expect, it } from "vitest";
import { parseRsvp } from "./rsvp";

const valid = {
  name: "Abebe Kebede",
  phone: "+251 911 234 567",
  email: "",
  attending: "yes",
  guestCount: "2",
  message: "Congratulations!",
  website: "",
};

describe("parseRsvp", () => {
  it("accepts a complete attending response", () => {
    const result = parseRsvp(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "Abebe Kebede",
        phone: "+251 911 234 567",
        email: null,
        attending: true,
        guestCount: 2,
        message: "Congratulations!",
      });
    }
  });

  it("sets the guest count to zero when not attending", () => {
    const result = parseRsvp({ ...valid, attending: "no", guestCount: "4" });
    expect(result.success && result.data.guestCount).toBe(0);
  });

  it("requires a name and a phone number", () => {
    const result = parseRsvp({ ...valid, name: " ", phone: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.fieldErrors).sort()).toEqual(["name", "phone"]);
    }
  });

  it("rejects an invalid email and phone", () => {
    const result = parseRsvp({ ...valid, email: "not-an-email", phone: "call me" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.fieldErrors).sort()).toEqual(["email", "phone"]);
    }
  });

  it("limits the party size to 10", () => {
    expect(parseRsvp({ ...valid, guestCount: "11" }).success).toBe(false);
    expect(parseRsvp({ ...valid, guestCount: "0" }).success).toBe(false);
  });

  it("flags bots that fill the hidden field", () => {
    const result = parseRsvp({ ...valid, website: "http://spam" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.isBot).toBe(true);
  });
});
