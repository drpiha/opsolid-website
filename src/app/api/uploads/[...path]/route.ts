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
  // Self-hosted short clips (kind="video" uploads).
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  ogg: "video/ogg",
};

const VIDEO_EXTS = new Set(["mp4", "webm", "mov", "ogg"]);

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
  const req = _req;
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
  const isVideo = VIDEO_EXTS.has(ext);

  const baseHeaders: Record<string, string> = {
    "Content-Type": contentType,
    // Filenames already embed entropy → URL is the cache key. Long-lived
    // cache is safe; if a customer re-uploads, they get a new URL.
    "Cache-Control": "public, max-age=86400, immutable",
    "X-Content-Type-Options": "nosniff",
  };

  // Video needs byte-range support so the <video> element can seek and so
  // Safari plays at all (it requires a 206 response). Honour a Range header
  // for video; everything else streams whole.
  const rangeHeader = isVideo ? req.headers.get("range") : null;
  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
    if (match) {
      const size = info.size;
      let start = match[1] ? parseInt(match[1], 10) : 0;
      let end = match[2] ? parseInt(match[2], 10) : size - 1;
      if (Number.isNaN(start)) start = 0;
      if (Number.isNaN(end) || end >= size) end = size - 1;
      if (start > end || start >= size) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${size}`, "Accept-Ranges": "bytes" },
        });
      }
      const chunk = createReadStream(absPath, { start, end });
      const chunkStream = Readable.toWeb(chunk) as ReadableStream<Uint8Array>;
      return new NextResponse(chunkStream, {
        status: 206,
        headers: {
          ...baseHeaders,
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end}/${size}`,
          "Content-Length": (end - start + 1).toString(),
        },
      });
    }
  }

  // Stream the whole file so we don't pull it into memory per request.
  const nodeStream = createReadStream(absPath);
  // Type cast: Next.js Response constructor accepts ReadableStream<Uint8Array>;
  // Node 18+'s Readable.toWeb() returns a Web ReadableStream.
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      ...baseHeaders,
      "Content-Length": info.size.toString(),
      ...(isVideo ? { "Accept-Ranges": "bytes" } : {}),
    },
  });
}
