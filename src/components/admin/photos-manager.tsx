"use client";

import { ImagePlus, Loader2, Star } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { addPhotos, setCoverPhoto } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminCouple } from "@/db/queries/admin";
import { DeleteButton, MoveButtons } from "./item-actions";
import { uploadErrorMessage, uploadMedia } from "./media-field";
import { reportResult } from "./use-action-feedback";

export function PhotosManager({ couple, uploadsEnabled }: { couple: AdminCouple; uploadsEnabled: boolean }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [pending, startTransition] = useTransition();

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    setProgress({ done: 0, total: list.length });
    const urls: string[] = [];
    for (const file of list) {
      try {
        urls.push(await uploadMedia(file, "image"));
      } catch (error) {
        toast.error(`${file.name}: ${uploadErrorMessage(error)}`);
      }
      setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
    }
    setProgress(null);
    if (fileInput.current) fileInput.current.value = "";
    if (urls.length) reportResult(await addPhotos(couple.id, urls));
  }

  function addLink() {
    if (!link.trim()) return;
    startTransition(async () => {
      const result = await addPhotos(couple.id, [link]);
      reportResult(result);
      if (result.ok) setLink("");
    });
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-medium">Gallery photos</h2>
          <p className="text-sm text-muted-foreground">
            Guests swipe through these in order. Star one to use it as the cover.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/heic"
            multiple
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => onFiles(event.target.files)}
          />
          <Button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={!uploadsEnabled || progress !== null}
            title={uploadsEnabled ? undefined : "Connect a Vercel Blob store to enable uploads"}
          >
            {progress ? <Loader2 className="animate-spin" aria-hidden /> : <ImagePlus aria-hidden />}
            {progress ? `Uploading ${progress.done} of ${progress.total}` : "Upload photos"}
          </Button>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              addLink();
            }}
          >
            <Input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Or paste a photo link"
              aria-label="Photo link"
              className="sm:w-64"
            />
            <Button type="submit" variant="outline" disabled={pending || !link.trim()}>
              Add
            </Button>
          </form>
        </div>
      </div>

      {couple.photos.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          No photos yet. Upload a few favourites or paste links to add them to the gallery.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {couple.photos.map((photo, index) => {
            const isCover = photo.url === couple.heroPhotoUrl;
            return (
              <li key={photo.id} className="overflow-hidden rounded-lg border bg-background">
                <div className="relative aspect-[4/5] bg-muted">
                  <Image src={photo.url} alt={`Photo ${index + 1}`} fill sizes="240px" unoptimized className="object-cover" />
                  {isCover ? <Badge className="absolute top-2 left-2">Cover</Badge> : null}
                </div>
                <div className="flex items-center justify-between gap-1 p-1.5">
                  <span className="pl-1.5 text-sm text-muted-foreground tabular-nums">{index + 1}</span>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isCover || pending}
                      aria-label="Use as cover photo"
                      title="Use as cover photo"
                      onClick={() => startTransition(async () => reportResult(await setCoverPhoto(photo.id)))}
                    >
                      <Star aria-hidden className={isCover ? "fill-current" : undefined} />
                    </Button>
                    <MoveButtons list="photos" id={photo.id} first={index === 0} last={index === couple.photos.length - 1} />
                    <DeleteButton list="photos" id={photo.id} itemLabel="this photo" description="It will be removed from the gallery." />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
