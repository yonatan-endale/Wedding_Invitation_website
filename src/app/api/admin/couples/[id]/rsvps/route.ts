import { getCoupleForAdmin, listRsvps } from "@/db/queries/admin";
import { getAdminUser } from "@/lib/auth";
import { cardPageUrl } from "@/lib/card-links";
import { toCsv } from "@/lib/csv";
import { siteLinks } from "@/lib/site-links";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) return new Response("Not found", { status: 404 });

  const { id } = await params;
  const couple = await getCoupleForAdmin(id);
  if (!couple) return new Response("Not found", { status: 404 });

  const { share } = await siteLinks(couple.slug);
  const rows = (await listRsvps(id)).map((r) => ({
    name: r.name,
    phone: r.phone,
    email: r.email,
    attending: r.attending ? "Yes" : "No",
    guests: r.guestCount,
    message: r.message,
    language: r.locale === "am" ? "Amharic" : "English",
    received: r.createdAt.toISOString(),
    card: r.attending ? cardPageUrl(share, r.cardToken) : "",
  }));

  const csv = toCsv(rows, [
    { key: "name", header: "Name" },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
    { key: "attending", header: "Attending" },
    { key: "guests", header: "Guests" },
    { key: "message", header: "Message" },
    { key: "language", header: "Language" },
    { key: "received", header: "Received (UTC)" },
    { key: "card", header: "Invitation card" },
  ]);

  // The byte-order mark makes Excel read Amharic names correctly.
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${couple.slug}-rsvps.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
