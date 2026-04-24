// =============================================================================
// POST /api/uploads
//
// Accepts multipart/form-data with `file` and `kind` fields and persists the
// asset via the storage adapter (filesystem in dev, Vercel Blob in prod).
//
// Limits and types are centralized in src/lib/storage.ts so they stay in sync
// with the QR-art generation pipeline (which writes via the same adapter).
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { putAsset, STORAGE_LIMITS } from "@/lib/storage";

export const runtime = "nodejs";

const ALLOWED_KINDS = new Set(["photo", "logo", "gallery"]);

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "asset");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!STORAGE_LIMITS.allowedImage.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 }
    );
  }
  if (file.size > STORAGE_LIMITS.maxBytes) {
    return NextResponse.json(
      { error: `File too large (max ${STORAGE_LIMITS.maxBytesHuman})` },
      { status: 413 }
    );
  }
  if (!ALLOWED_KINDS.has(kind)) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/svg+xml"
      ? "svg"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";

  const body = Buffer.from(await file.arrayBuffer());

  try {
    const { url } = await putAsset({
      kind,
      ext,
      body,
      contentType: file.type,
    });
    // Backwards-compatible response shape — the OrderFormSection client still
    // reads `path`, and we want it to keep working without a coordinated
    // client/server release. The URL is full-qualified for blob driver and
    // origin-relative for local driver; both work in <img src>.
    return NextResponse.json({ path: url });
  } catch (err) {
    console.error("[uploads] storage error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
