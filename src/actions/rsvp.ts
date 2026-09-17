"use server";

import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { getSiteData } from "@/db/queries/site";
import { rsvps } from "@/db/schema";
import { formDataToFields } from "@/lib/validation/admin";
import { createRateLimiter } from "@/lib/rate-limit";
import { parseRsvp, type RsvpField } from "@/lib/validation/rsvp";

export type RsvpFormState =
  | { status: "idle" }
  | {
      status: "error";
      fieldErrors: (RsvpField | "attending")[];
      formError: "generic" | "rateLimited" | "closed" | null;
      values: Record<string, string>;
    }
  | { status: "success"; name: string; attending: boolean; submissionId: number };

const limiter = createRateLimiter({ limit: 6, windowMs: 60_000 });

export async function submitRsvp(slug: string, _previous: RsvpFormState, formData: FormData): Promise<RsvpFormState> {
  const fields = formDataToFields(formData);
  const values = {
    name: fields.name ?? "",
    phone: fields.phone ?? "",
    email: fields.email ?? "",
    attending: fields.attending ?? "",
    guestCount: fields.guestCount ?? "1",
    message: fields.message ?? "",
  };
  const submissionId = Number(fields.submissionId ?? 0) || 0;
  const fail = (formError: "generic" | "rateLimited" | "closed" | null, fieldErrors: (RsvpField | "attending")[] = []) =>
    ({ status: "error", formError, fieldErrors, values }) as const;

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  if (!limiter.check(`${slug}:${ip}`)) return fail("rateLimited");

  const parsed = parseRsvp(fields);
  if (!parsed.success) {
    // Bots get a normal-looking success so they don't retry.
    if (parsed.isBot) return { status: "success", name: values.name, attending: values.attending === "yes", submissionId };
    return fail(null, Object.keys(parsed.fieldErrors) as RsvpField[]);
  }

  try {
    const site = await getSiteData(slug);
    const couple = site?.couple;
    const deadlinePassed = couple?.rsvpDeadline ? new Date(couple.rsvpDeadline).getTime() < Date.now() : false;
    if (!couple || couple.status !== "published" || !couple.rsvpEnabled || deadlinePassed) return fail("closed");

    await getDb()
      .insert(rsvps)
      .values({ coupleId: couple.id, ...parsed.data, locale: await getLocale() });

    return { status: "success", name: parsed.data.name, attending: parsed.data.attending, submissionId };
  } catch (error) {
    console.error("RSVP failed", { slug, error });
    return fail("generic");
  }
}
