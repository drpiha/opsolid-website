// =============================================================================
// Storage adapter — pluggable backend for card asset uploads (photo, logo,
// AI-generated QR PNGs, future video posters).
//
// Two drivers, selected via STORAGE_DRIVER env (or auto: local in dev, blob in
// prod when BLOB_READ_WRITE_TOKEN is set):
//
//   • local  — writes under /public/uploads/cards/{hex}/{name}, returns a
//              same-origin path. Survives `next dev` but lost on every Vercel
//              deploy (filesystem is ephemeral).
//   • blob   — Vercel Blob. Returns a fully-qualified https URL backed by
//              Vercel's CDN. Survives deploys and scales horizontally.
//
// Both drivers expose the same shape so callers (api/uploads, qr generator,
// future video poster pipeline) stay backend-agnostic. To migrate existing
// /uploads/cards/... paths to Blob, run a one-shot script that reads each
// file and re-uploads via `putAsset`.
// =============================================================================

import { writeFile, mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { put, del } from "@vercel/blob";

export interface PutAssetArgs {
  /** Logical bucket within "cards/" (e.g. "photo", "logo", "qr-ai"). */
  kind: string;
  /** File extension WITHOUT the dot ("png", "jpg", "svg", "webp"). */
  ext: string;
  /** Raw file bytes. Buffer is preferred (Node-native, accepted by both
   *  fs.writeFile and @vercel/blob put). Uint8Array is wrapped for blob. */
  body: Buffer;
  /** Browser-supplied or sniffed MIME type. */
  contentType: string;
  /** Optional per-call size ceiling. Defaults to the 5 MB image limit; video
   *  uploads pass the larger STORAGE_LIMITS.maxVideoBytes. */
  maxBytes?: number;
}

export interface PutAssetResult {
  /** Public URL or same-origin path that can be set on an <img src>. */
  url: string;
  /** Stable identifier the caller stores in the DB and passes to deleteAsset. */
  key: string;
}

export type StorageDriver = "local" | "blob";

function detectDriver(): StorageDriver {
  const explicit = process.env.STORAGE_DRIVER?.toLowerCase();
  if (explicit === "local" || explicit === "blob") return explicit;
  // Auto: prefer blob if its token is configured (works on Vercel preview/prod).
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return "local";
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB per file (was 2 MB before premium upgrade)
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB — enough for a ~60s self-hosted clip

export const STORAGE_LIMITS = {
  maxBytes: MAX_BYTES,
  maxBytesHuman: "5 MB",
  /** Self-hosted video cap. Kept modest on purpose — long/large files belong
   *  on YouTube/Vimeo via videoUrl. Paired with a client-side duration limit. */
  maxVideoBytes: MAX_VIDEO_BYTES,
  maxVideoBytesHuman: "100 MB",
  /** Self-hosted video duration cap (seconds). Enforced server-side in the
   *  upload route via a dependency-free container-header parser, and mirrored
   *  client-side by VideoUploader's MAX_DURATION_SEC (which cannot import this
   *  node-only module). Keep the two values in sync. */
  maxVideoDurationSec: 60,
  /** Accepted video MIME types for the kind="video" upload lane. */
  allowedVideo: new Set([
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ]),
  /**
   * Image MIME types accepted by user-facing upload endpoints (photo, logo,
   * gallery). SVG is intentionally absent — see Faz 6.7 / C1: SVG can carry
   * inline `<script>` / `onload=` payloads that browsers execute when the
   * asset is rendered through an `<img>` whose `src` resolves to an SVG, or
   * when the file is opened in a new tab. Even with re-encoding via sharp we
   * have no clean path to render a sanitized SVG without losing the vector
   * benefits, so we drop the format entirely. Server-generated assets (AI QR
   * PNG) bypass this gate by calling `putAsset` directly with their own
   * trusted bytes.
   */
  allowedImage: new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]),
} as const;

function safeKindSegment(kind: string): string {
  // Kinds are passed by our own code, but defense-in-depth: only allow lowercase
  // letters, digits, hyphens. Strip everything else, fall back to "asset".
  const cleaned = kind.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32);
  return cleaned || "asset";
}

function safeExt(ext: string): string {
  const cleaned = ext.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  // Sensible defaults for the asset kinds we actually accept.
  return cleaned || "bin";
}

/**
 * Persist an asset and return a stable URL the renderer can use.
 *
 * Errors propagate so callers can surface them as HTTP 5xx — we deliberately
 * don't swallow because a silent storage failure would result in an order
 * with a broken photo path that's hard to diagnose later.
 */
export async function putAsset(args: PutAssetArgs): Promise<PutAssetResult> {
  const limit = args.maxBytes ?? MAX_BYTES;
  if (args.body.byteLength > limit) {
    throw new Error(`File too large: ${args.body.byteLength} > ${limit}`);
  }

  const kind = safeKindSegment(args.kind);
  const ext = safeExt(args.ext);
  const dirHex = randomBytes(8).toString("hex");
  const filename = `${kind}-${Date.now()}.${ext}`;
  const relPath = `cards/${dirHex}/${filename}`;
  const driver = detectDriver();

  if (driver === "blob") {
    const result = await put(relPath, args.body, {
      access: "public",
      contentType: args.contentType,
      // Keep paths human-readable; we already added entropy via dirHex.
      addRandomSuffix: false,
    });
    return { url: result.url, key: result.url };
  }

  // local driver
  const absDir = join(process.cwd(), "public", "uploads", "cards", dirHex);
  const absPath = join(absDir, filename);
  await mkdir(absDir, { recursive: true });
  await writeFile(absPath, args.body);
  // Same-origin path. We deliberately route through /api/uploads/<rel> rather
  // than the bare /uploads/<rel> static path because Next.js `output:
  // standalone` snapshots the public/ tree at container startup — files
  // written after startup (every customer upload) hit a hard 404 from the
  // built-in static handler. The /api/uploads/[...path] route streams from
  // disk on every request and survives container restarts because the host
  // volume mount preserves the files.
  const url = `/api/uploads/${relPath}`;
  return { url, key: url };
}

/**
 * Delete a previously-uploaded asset. Idempotent: a missing file is not an
 * error (we may have already cleaned it up, or the order is being re-uploaded).
 */
export async function deleteAsset(key: string): Promise<void> {
  if (!key) return;
  const driver = detectDriver();

  if (driver === "blob") {
    // Blob keys are full URLs; del() accepts either a URL or a path.
    try {
      await del(key);
    } catch {
      // Swallow — see jsdoc above.
    }
    return;
  }

  // local driver — accept both legacy `/uploads/...` keys (from before the
  // standalone-server fix) and new `/api/uploads/...` keys, then resolve
  // back to the on-disk path under public/.
  let relPath: string | null = null;
  if (key.startsWith("/api/uploads/")) {
    relPath = key.slice("/api/uploads/".length);
  } else if (key.startsWith("/uploads/")) {
    relPath = key.slice("/uploads/".length);
  }
  if (!relPath) return;
  const absPath = join(process.cwd(), "public", "uploads", relPath);
  try {
    await unlink(absPath);
  } catch {
    // Swallow — see jsdoc above.
  }
}

/**
 * Resolve a stored key (from `putAsset`) to a fully-qualified URL the
 * server-side QR/OG image renderer can fetch. Local-driver keys are
 * relative and need the site origin prepended.
 */
export function absoluteAssetUrl(key: string, siteUrl: string): string {
  if (!key) return "";
  if (/^https?:\/\//i.test(key)) return key;
  if (key.startsWith("/")) return `${siteUrl.replace(/\/$/, "")}${key}`;
  return `${siteUrl.replace(/\/$/, "")}/${key}`;
}

export function currentDriver(): StorageDriver {
  return detectDriver();
}
