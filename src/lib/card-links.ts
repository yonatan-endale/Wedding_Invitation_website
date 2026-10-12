/**
 * Links for a guest's card, entry pass and the couple's private page. `base` is
 * the couple's site link from siteLinks().share: either the subdomain or the
 * /s/<slug> path, so every link works with or without a custom domain.
 */

const CARD_TOKEN = /^[0-9a-f]{32}$/;

/** Card tokens are 32 hex characters (see rsvps.card_token); anything else is rejected before a database call. */
export function isCardToken(value: string): boolean {
  return CARD_TOKEN.test(value);
}

const join = (base: string, path: string) => `${base.replace(/\/+$/, "")}${path}`;

export function cardPageUrl(base: string, token: string): string {
  return join(base, `/card/${token}`);
}

/** No file extension: the middleware skips paths that have one, which would break subdomain links. */
export function cardImageUrl(base: string, token: string, { download = false }: { download?: boolean } = {}): string {
  return join(base, `/card/${token}/image${download ? "?download=1" : ""}`);
}

export type GuestCardLinks = { page: string; image: string; download: string };

export function guestCardLinks(base: string, token: string): GuestCardLinks {
  return {
    page: cardPageUrl(base, token),
    image: cardImageUrl(base, token),
    download: cardImageUrl(base, token, { download: true }),
  };
}

export function passUrl(base: string, token: string): string {
  return join(base, `/pass/${token}`);
}

/** The secret sits in the fragment, which browsers never send to the server or in a Referer header. */
export function couplePortalUrl(base: string, token: string): string {
  return join(base, `/couple#k=${token}`);
}

/**
 * wa.me needs the number in international form, digits only. Ethiopian guests
 * often type 09… or 9…, so those become 2519…; numbers with + or 00 keep their code.
 */
export function internationalPhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `251${digits.slice(1)}`;
  if (digits.length === 9 && /^[79]/.test(digits)) return `251${digits}`;
  return digits;
}

/** Opens a WhatsApp chat with the guest when a phone number is given, otherwise the contact picker. */
export function whatsappShareUrl(text: string, phone?: string | null): string {
  const to = phone ? internationalPhone(phone) : "";
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}

export function telegramShareUrl(url: string, text: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

/** A safe download name such as "invitation-abebe-kebede.png"; Ethiopic names keep their letters. */
export function cardFileName(guestName: string): string {
  const slug = guestName
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `invitation${slug ? `-${slug}` : ""}.png`;
}
