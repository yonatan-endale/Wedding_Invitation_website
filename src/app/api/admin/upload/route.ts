import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg", "audio/wav"];
const MB = 1024 * 1024;

/** Issues short-lived tokens so the admin's browser can upload photos and music straight to Vercel Blob. */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Uploads need a Vercel Blob store. Connect one to the project, or paste a link instead." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!(await getAdminUser())) throw new Error("Sign in with an admin account to upload files.");
        const audio = clientPayload === "audio";
        return {
          allowedContentTypes: audio ? AUDIO_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: audio ? 15 * MB : 10 * MB,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
