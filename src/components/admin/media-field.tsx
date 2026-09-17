"use client";

import { upload } from "@vercel/blob/client";
import { Loader2, Music, Upload } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "./fields";

export type MediaKind = "image" | "audio";

const ACCEPT: Record<MediaKind, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif,image/heic",
  audio: "audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/ogg,audio/wav",
};

/** Uploads one file to Vercel Blob through /api/admin/upload and returns its public URL. */
export async function uploadMedia(file: File, kind: MediaKind): Promise<string> {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const blob = await upload(`couples/${kind}s/${safeName}`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    clientPayload: kind,
    multipart: file.size > 5 * 1024 * 1024,
  });
  return blob.url;
}

export function uploadErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/content type|not allowed/i.test(message)) return "That file type isn't supported. Use JPG, PNG or WebP photos and MP3 or M4A music.";
  if (/size|too large/i.test(message)) return "That file is too large. Photos can be up to 10 MB and music up to 15 MB.";
  return message || "Upload failed. Check your connection and try again.";
}

type Props = {
  name: string;
  label: string;
  kind: MediaKind;
  defaultValue?: string | null;
  uploadsEnabled: boolean;
  error?: string;
  hint?: string;
};

/** A link field with an upload button. The form posts whatever URL ends up in the input. */
export function MediaField({ name, label, kind, defaultValue, uploadsEnabled, error, hint }: Props) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      setUrl(await uploadMedia(file, kind));
      toast.success(kind === "image" ? "Photo uploaded. Save to keep it." : "Music uploaded. Save to keep it.");
    } catch (err) {
      toast.error(uploadErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-4">
        {kind === "image" ? (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-md border bg-muted">
            {url ? <Image src={url} alt="" fill sizes="80px" unoptimized className="object-cover" /> : null}
          </div>
        ) : null}
        <div className="grid min-w-0 flex-1 gap-2">
          <div className="flex gap-2">
            <Input
              id={id}
              name={name}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://"
              aria-invalid={error ? true : undefined}
              className="min-w-0"
            />
            <input
              ref={fileInput}
              type="file"
              accept={ACCEPT[kind]}
              className="sr-only"
              tabIndex={-1}
              onChange={(event) => onFile(event.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              disabled={!uploadsEnabled || uploading}
              onClick={() => fileInput.current?.click()}
              title={uploadsEnabled ? undefined : "Connect a Vercel Blob store to enable uploads"}
            >
              {uploading ? <Loader2 className="animate-spin" aria-hidden /> : <Upload aria-hidden />}
              Upload
            </Button>
          </div>
          {kind === "audio" && url ? (
            <div className="flex items-center gap-2">
              <Music className="size-4 text-muted-foreground" aria-hidden />
              <audio controls preload="none" src={url} className="h-9 w-full max-w-sm" />
            </div>
          ) : null}
          {error ? (
            <FieldError message={error} />
          ) : (
            <p className="text-sm text-muted-foreground">
              {uploadsEnabled ? hint : "Uploads are off until a Vercel Blob store is connected. Paste a link for now."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
