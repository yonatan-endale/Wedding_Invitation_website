import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { listRsvps } from "@/db/queries/admin";
import { formatGregorianDate, formatWeddingTime } from "@/lib/wedding-format";
import { DeleteButton } from "./item-actions";

type Rsvp = Awaited<ReturnType<typeof listRsvps>>[number];

export function RsvpList({ coupleId, rows, timezone }: { coupleId: string; rows: Rsvp[]; timezone: string }) {
  const attending = rows.filter((r) => r.attending);
  const stats = [
    { label: "Responses", value: rows.length },
    { label: "Guests coming", value: attending.reduce((sum, r) => sum + r.guestCount, 0) },
    { label: "Can't come", value: rows.length - attending.length },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <dl className="grid grid-cols-3 gap-3 sm:w-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-background px-4 py-3">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="text-2xl font-semibold tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <Button asChild variant="outline" disabled={rows.length === 0}>
          <a href={`/api/admin/couples/${coupleId}/rsvps`} download>
            <Download aria-hidden /> Download CSV
          </a>
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          No responses yet. Share the site link and replies will show up here.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Reply</TableHead>
                <TableHead className="text-right">Guests</TableHead>
                <TableHead className="min-w-56">Message</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.name}
                    {row.email ? <span className="block text-xs font-normal text-muted-foreground">{row.email}</span> : null}
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    <a href={`tel:${row.phone.replace(/\s+/g, "")}`} className="underline-offset-4 hover:underline">
                      {row.phone}
                    </a>
                  </TableCell>
                  <TableCell>{row.attending ? "Coming" : "Can't come"}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.guestCount}</TableCell>
                  <TableCell className="max-w-xs text-sm whitespace-normal text-muted-foreground">{row.message}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                    {formatGregorianDate(row.createdAt.toISOString(), timezone)}, {formatWeddingTime(row.createdAt.toISOString(), timezone, "en")}
                  </TableCell>
                  <TableCell>
                    <DeleteButton list="rsvps" id={row.id} itemLabel={`${row.name}'s RSVP`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
