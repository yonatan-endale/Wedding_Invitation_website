import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { listRsvps } from "@/db/queries/admin";
import { formatGregorianDate, formatStandardTime } from "@/lib/wedding-format";
import { CardActions } from "./card-actions";
import { DeleteButton } from "./item-actions";

type Rsvp = Awaited<ReturnType<typeof listRsvps>>[number];

type Props = {
  coupleId: string;
  rows: Rsvp[];
  timezone: string;
  /** The couple's site link, which card links are built on. */
  siteBase: string;
  coupleNames: string;
};

export function RsvpList({ coupleId, rows, timezone, siteBase, coupleNames }: Props) {
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
                <TableHead className="w-20">
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
                  <TableCell className="max-w-xs text-sm whitespace-normal text-muted-foreground">
                    {row.message}
                    {row.message && row.hiddenAt ? (
                      <Badge variant="outline" className="ml-2 align-middle">
                        Hidden by couple
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                    {formatGregorianDate(row.createdAt.toISOString(), timezone)}, {formatStandardTime(row.createdAt.toISOString(), timezone)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      {row.attending ? (
                        <CardActions
                          siteBase={siteBase}
                          token={row.cardToken}
                          guestName={row.name}
                          phone={row.phone}
                          coupleNames={coupleNames}
                        />
                      ) : null}
                      <DeleteButton list="rsvps" id={row.id} itemLabel={`${row.name}'s RSVP`} />
                    </div>
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
