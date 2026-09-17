import { CalendarHeart, Plus, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listCouples } from "@/db/queries/admin";
import { getTheme } from "@/lib/theme";
import { formatWeddingDate } from "@/lib/wedding-format";

export const metadata: Metadata = { title: "Couples" };

export default async function AdminHomePage() {
  const couples = await listCouples();
  const now = Date.now();

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Couples</h1>
          <p className="mt-1 text-muted-foreground">Each couple gets their own invitation site. Create one, fill it in, then publish.</p>
        </div>
        <Button asChild>
          <Link href="/admin/couples/new">
            <Plus aria-hidden /> New couple
          </Link>
        </Button>
      </div>

      {couples.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-background p-12 text-center">
          <CalendarHeart className="mx-auto size-10 text-muted-foreground" aria-hidden />
          <h2 className="mt-4 font-medium">No couples yet</h2>
          <p className="mt-1 text-muted-foreground">Create the first invitation site. It stays a draft until you publish it.</p>
          <Button asChild className="mt-6">
            <Link href="/admin/couples/new">
              <Plus aria-hidden /> New couple
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {couples.map((couple) => {
            const theme = getTheme(couple.theme);
            const past = couple.weddingAt.getTime() < now;
            return (
              <li key={couple.id}>
                <Link
                  href={`/admin/couples/${couple.id}`}
                  className="group block overflow-hidden rounded-xl border bg-background transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <div className="relative aspect-[16/9]" style={{ backgroundColor: theme.colors.thread1 }}>
                    {couple.heroPhotoUrl ? (
                      <Image
                        src={couple.heroPhotoUrl}
                        alt=""
                        fill
                        unoptimized
                        sizes="400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 flex h-1.5" aria-hidden>
                      {[theme.colors.thread2, theme.colors.thread1, theme.colors.thread3].map((color, index) => (
                        <span key={index} className="flex-1" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <Badge variant={couple.status === "published" ? "default" : "secondary"} className="absolute top-3 left-3">
                      {couple.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="font-medium">
                      {couple.partnerOne.en} &amp; {couple.partnerTwo.en}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatWeddingDate(couple.weddingAt.toISOString(), couple.timezone, "en")}
                      {past ? " (past)" : ""}
                    </p>
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="size-4" aria-hidden />
                      {couple.responses === 0
                        ? "No RSVPs yet"
                        : `${couple.responses} ${couple.responses === 1 ? "response" : "responses"}, ${couple.guests} coming`}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
