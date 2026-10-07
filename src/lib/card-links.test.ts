import { describe, expect, it } from "vitest";
import {
  cardFileName,
  cardImageUrl,
  cardPageUrl,
  couplePortalUrl,
  internationalPhone,
  isCardToken,
  passUrl,
  telegramShareUrl,
  whatsappShareUrl,
} from "./card-links";

const token = "0123456789abcdef0123456789abcdef";

describe("isCardToken", () => {
  it("accepts 32 lowercase hex characters only", () => {
    expect(isCardToken(token)).toBe(true);
    expect(isCardToken(token.toUpperCase())).toBe(false);
    expect(isCardToken(token.slice(1))).toBe(false);
    expect(isCardToken(`${token}0`)).toBe(false);
    expect(isCardToken("../../etc/passwd")).toBe(false);
  });
});

describe("card links", () => {
  it("works with a subdomain base", () => {
    const base = "https://hanna-dawit.example.com";
    expect(cardPageUrl(base, token)).toBe(`${base}/card/${token}`);
    expect(passUrl(base, token)).toBe(`${base}/pass/${token}`);
    expect(cardImageUrl(base, token)).toBe(`${base}/card/${token}/image`);
    expect(cardImageUrl(base, token, { download: true })).toBe(`${base}/card/${token}/image?download=1`);
  });

  it("works with a path base and a trailing slash", () => {
    expect(cardPageUrl("https://example.com/s/hanna-dawit/", token)).toBe(`https://example.com/s/hanna-dawit/card/${token}`);
  });

  it("puts the couple's secret in the fragment", () => {
    expect(couplePortalUrl("https://example.com/s/hanna-dawit", "abc_-1")).toBe("https://example.com/s/hanna-dawit/couple#k=abc_-1");
  });
});

describe("internationalPhone", () => {
  it("turns local Ethiopian numbers into 251", () => {
    expect(internationalPhone("0911 23 45 67")).toBe("251911234567");
    expect(internationalPhone("911234567")).toBe("251911234567");
    expect(internationalPhone("0711234567")).toBe("251711234567");
  });

  it("keeps international numbers", () => {
    expect(internationalPhone("+251 911 234 567")).toBe("251911234567");
    expect(internationalPhone("+1 (202) 555-0100")).toBe("12025550100");
    expect(internationalPhone("0044 20 7946 0000")).toBe("442079460000");
  });
});

describe("share links", () => {
  it("builds a WhatsApp link to the guest", () => {
    expect(whatsappShareUrl("Hi & welcome", "0911234567")).toBe("https://wa.me/251911234567?text=Hi%20%26%20welcome");
    expect(whatsappShareUrl("Hi")).toBe("https://wa.me/?text=Hi");
  });

  it("builds a Telegram share link", () => {
    expect(telegramShareUrl("https://x.test/a?b=1", "Card")).toBe(
      "https://t.me/share/url?url=https%3A%2F%2Fx.test%2Fa%3Fb%3D1&text=Card",
    );
  });
});

describe("cardFileName", () => {
  it("makes a safe file name", () => {
    expect(cardFileName("Abebe Kebede")).toBe("invitation-abebe-kebede.png");
    expect(cardFileName('../"evil"\\name')).toBe("invitation-evil-name.png");
    expect(cardFileName("አበበ ከበደ")).toBe("invitation-አበበ-ከበደ.png");
    expect(cardFileName("!!!")).toBe("invitation.png");
  });
});
