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

export const STORAGE_LIMITS = {
  maxBytes: MAX_BYTES,
  maxBytesHuman: "5 MB",
  /** Image MIME types accepted everywhere (photo, logo, gallery, AI QR). */
  allowedImage: new Set([
    "image/jpeg",
    "image/png",
    "image/svg+xml",
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
  if (args.body.byteLength > MAX_BYTES) {
    throw new Error(`File too large: ${args.body.byteLength} > ${MAX_BYTES}`);
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
  // Same-origin path so <img src="/uploads/cards/.../foo.png"> works in dev.
  const url = `/uploads/${relPath}`;
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

  // local driver — strip leading slash, resolve under public/.
  if (!key.startsWith("/uploads/")) return;
  const absPath = join(process.cwd(), "public", key.replace(/^\//, ""));
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
