"use client";

import { Copy, Download, ExternalLink, IdCard, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { guestCardLinks, whatsappShareUrl } from "@/lib/card-links";
import { EVENT_TYPE_META, type EventType } from "@/lib/event-types";

type Props = { siteBase: string; token: string; guestName: string; phone: string; coupleNames: string; eventType: EventType };

/** Download a guest's invitation card, or send it to them on WhatsApp. */
export function CardActions({ siteBase, token, guestName, phone, coupleNames, eventType }: Props) {
  const links = guestCardLinks(siteBase, token);
  const message = `Hello ${guestName}, here is your invitation card for the ${EVENT_TYPE_META[eventType].noun} of ${coupleNames}. Show its QR code at the entrance: ${links.page}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(links.page);
      toast.success("Card link copied.");
    } catch {
      toast.error("Couldn't copy. Open the card and copy its address.");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={`${guestName}'s invitation card`}>
          <IdCard aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={links.download} download>
            <Download aria-hidden /> Download card
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={links.page} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden /> Open card
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={whatsappShareUrl(message, phone)} target="_blank" rel="noopener noreferrer">
            <Send aria-hidden /> Send on WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={copy}>
          <Copy aria-hidden /> Copy card link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
