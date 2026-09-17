import { z } from "zod";

export const PHONE_PATTERN = /^\+?[0-9][0-9 ()-]{6,19}$/;

const rsvpSchema = z.object({
  name: z.string().trim().min(2, "name").max(80, "name"),
  phone: z.string().trim().regex(PHONE_PATTERN, "phone"),
  email: z
    .string()
    .trim()
    .max(120)
    .transform((value) => (value === "" ? null : value))
    .pipe(z.email("email").nullable()),
  attending: z.enum(["yes", "no"]).transform((value) => value === "yes"),
  guestCount: z.coerce.number().int().min(1, "guestCount").max(10, "guestCount"),
  message: z
    .string()
    .trim()
    .max(500, "message")
    .transform((value) => (value === "" ? null : value)),
});

export type RsvpInput = {
  name: string;
  phone: string;
  email: string | null;
  attending: boolean;
  guestCount: number;
  message: string | null;
};

export type RsvpField = keyof RsvpInput;

export type RsvpParseResult =
  | { success: true; data: RsvpInput }
  | { success: false; isBot: boolean; fieldErrors: Partial<Record<RsvpField, true>> };

export function parseRsvp(raw: Record<string, unknown>): RsvpParseResult {
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return { success: false, isBot: true, fieldErrors: {} };
  }

  const input = {
    name: raw.name ?? "",
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    attending: raw.attending,
    guestCount: raw.attending === "no" ? "1" : (raw.guestCount ?? "1"),
    message: raw.message ?? "",
  };

  const result = rsvpSchema.safeParse(input);
  if (!result.success) {
    const fieldErrors: Partial<Record<RsvpField, true>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string") fieldErrors[field as RsvpField] = true;
    }
    return { success: false, isBot: false, fieldErrors };
  }

  const data = result.data;
  return { success: true, data: { ...data, guestCount: data.attending ? data.guestCount : 0 } };
}
