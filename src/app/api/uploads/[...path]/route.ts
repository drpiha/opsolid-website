// =============================================================================
// GET /api/uploads/[...path]
//
// Serves files from /app/public/uploads at request time. Required because
// Next.js `output: standalone` snapshots the public/ directory listing at
// container start — files written AFTER startup (i.e. user uploads via the
// local storage driver) get a hard 404 from the built-in static handler.
//
// This route bypasses that by streaming directly from disk on every request.
// It is intentionally read-only, restricted to files under public/uploads,
// and rejects any path-traversal attempt (`..`, absolute paths, NUL bytes).
//
// Caching: 1 day with immutable hint. Filenames already embed an 8-byte
// random hex prefix, so the URL itself is the cache key — overwrites use
// a new path. If you need to flush, just delete the file from disk.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { join, normalize, sep } from "node:path";
import { Readable } from "node:stream";

export const runtime = "nodejs";
// Static files don't need ISR — every request hits the file system, but
// the underlying volume is the source of truth and should not be cached
// at the route layer.
export const dynamic = "force-dynamic";

const PUBLIC_UPLOADS_ROOT = join(process.cwd(), "public", "uploads");

/**
 * MIME map kept tight on purpose — the upload endpoint already restricts
 * to a small image set, so anything outside this list is suspicious.
 */
const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
  gif: "image/gif",
};

function isSafeRelative(rel: string): boolean {
  // Reject NUL bytes and any literal segment that's just dots — covers
  // both `..` and contrived `....`/`.` segments.
  if (rel.includes("\0")) return false;
  const segments = rel.split(/[\\/]+/);
  for (const seg of segments) {
    if (seg === "" || seg === "." || seg === "..") return false;
    // Disallow Windows drive letters or any colon-prefixed segment
    if (/^[a-zA-Z]:/.test(seg)) return false;
  }
  return true;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const segments = params.path ?? [];
  if (segments.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rel = segments.join("/");
  if (!isSafeRelative(rel)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const absPath = normalize(join(PUBLIC_UPLOADS_ROOT, ...segments));
  // Defense-in-depth: ensure the resolved path is still under the root.
  if (
    absPath !== PUBLIC_UPLOADS_ROOT &&
    !absPath.startsWith(PUBLIC_UPLOADS_ROOT + sep)
  ) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  let info;
  try {
    info = await stat(absPath);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!info.isFile()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = (segments[segments.length - 1].split(".").pop() ?? "").toLowerCase();
  const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

  // Stream the file so we don't pull a 5 MB image into memory per request.
  const nodeStream = createReadStream(absPath);
  // Type cast: Next.js Response constructor accepts ReadableStream<Uint8Array>;
  // Node 18+'s Readable.toWeb() returns a Web ReadableStream.
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": info.size.toString(),
      // Filenames already embed entropy → URL is the cache key. Long-lived
      // cache is safe; if a customer re-uploads a new photo, they get a
      // new URL and the old one becomes orphaned (cleanup is a separate job).
      "Cache-Control": "public, max-age=86400, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
