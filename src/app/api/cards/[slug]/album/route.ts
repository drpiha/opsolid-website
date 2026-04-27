// =============================================================================
// /api/cards/[slug]/album
//
// GET  — public list of APPROVED photos (paginated). Visitor flow.
// POST — upload a new photo:
//          • visitor upload (default): saved as PENDING, requires owner
//            approval before it surfaces in GET. IP-hash rate-limited.
//          • owner upload (?asOwner=1&t=<editToken>): saved as APPROVED
//            immediately, no rate limit beyond storage caps.
//
// All photos persist via the same storage adapter the rest of the app uses
// (local disk in dev, Vercel Blob in prod). Raw IPs never touch the DB —
// we hash them with a server salt so abuse detection is possible without
// retaining personally identifying network metadata.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { putAsset, STORAGE_LIMITS } from "@/lib/storage";
import { resolveAssetUrl } from "@/lib/cardAssetUrl";
import {
  AlbumUploadSchema,
  OrderStatus,
} from "@/lib/validation";
import { requireEditToken, EditTokenError } from "@/lib/auth/edit-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// -----------------------------------------------------------------------------
// Pagination defaults — keep visitor-facing pages small to bound payload size
// and enable infinite-scroll on the public album view.
// -----------------------------------------------------------------------------
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;

// -----------------------------------------------------------------------------
// Visitor upload rate limit. Album uploads are an abuse-prone surface (anyone
// can hit them anonymously); cap at 3 uploads / hour per IP. Stored in a
// process-local Map — single-container deploys only; revisit for multi-instance.
//
// MIME / size validation reuses STORAGE_LIMITS from the storage adapter so
// limits stay consistent with /api/uploads and the QR-art pipeline.
// -----------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;
const rateBucket = new Map<string, number[]>();

function visitorIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const first = xff.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "unknown";
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "opsolid";
  return createHash("sha256").update(`${ip}${salt}`).digest("hex").slice(0, 32);
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = rateBucket.get(key) ?? [];
  const fresh = bucket.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (fresh.length >= RATE_LIMIT_MAX) {
    rateBucket.set(key, fresh);
    return false;
  }
  fresh.push(now);
  rateBucket.set(key, fresh);
  return true;
}

// -----------------------------------------------------------------------------
// GET — public list of APPROVED photos for this card.
//
// Query params:
//   page     — 1-indexed page number (default 1)
//   pageSize — 1..MAX_PAGE_SIZE (default DEFAULT_PAGE_SIZE)
//
// Response: { photos, total, hasMore }
// 404 if the slug doesn't resolve to a PUBLISHED card so we never leak the
// existence of pending/cancelled orders.
// -----------------------------------------------------------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;
  const url = new URL(req.url);

  const pageRaw = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSizeRaw = Number.parseInt(
    url.searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE),
    10,
  );
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const pageSize = Math.min(
    Math.max(Number.isFinite(pageSizeRaw) ? pageSizeRaw : DEFAULT_PAGE_SIZE, 1),
    MAX_PAGE_SIZE,
  );

  const order = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true, status: true },
  });
  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return NextResponse.json({ error: "Karte nicht gefunden." }, { status: 404 });
  }

  const where = { cardOrderId: order.id, status: "APPROVED" } as const;

  const [total, rows] = await prisma.$transaction([
    prisma.cardAlbumPhoto.count({ where }),
    prisma.cardAlbumPhoto.findMany({
      where,
      orderBy: [{ approvedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        photoPath: true,
        caption: true,
        uploaderName: true,
        connectionId: true,
        approvedAt: true,
      },
    }),
  ]);

  const photos = rows.map((row) => ({
    id: row.id,
    photoPath: resolveAssetUrl(row.photoPath),
    caption: row.caption,
    uploaderName: row.uploaderName,
    connectionId: row.connectionId,
    approvedAt: row.approvedAt?.toISOString() ?? null,
  }));

  return NextResponse.json({
    photos,
    total,
    hasMore: page * pageSize < total,
  });
}

// -----------------------------------------------------------------------------
// POST — upload a new album photo.
//
// Branches on `?asOwner=1`:
//   • Owner branch validates `?t=<editToken>` against the order's editToken
//     via requireEditToken. Photo is stored APPROVED with approvedAt = now.
//   • Visitor branch is unauthenticated, IP-hash rate-limited, and stores
//     the photo as PENDING. Owner approves it later from the dashboard.
//
// Body: multipart/form-data
//   photo        — File (required, JPEG/PNG/WEBP, ≤ 5 MB)
//   caption      — optional string ≤ 500
//   uploaderName — optional string ≤ 120 (visitor branch only; owner uploads
//                  always carry the owner's contactName implicitly)
// -----------------------------------------------------------------------------
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;
  const url = new URL(req.url);
  const asOwner = url.searchParams.get("asOwner") === "1";

  const order = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true, status: true, editToken: true },
  });
  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return NextResponse.json({ error: "Karte nicht gefunden." }, { status: 404 });
  }

  // Owner branch — validate edit token before doing any work.
  if (asOwner) {
    try {
      await requireEditToken(req, order.id);
    } catch (err) {
      if (err instanceof EditTokenError) {
        return NextResponse.json({ error: err.code }, { status: err.status });
      }
      throw err;
    }
  }

  // Visitor branch — rate limit BEFORE parsing the body so we cheaply reject
  // spam without buffering large uploads. Owners skip this entirely.
  const ip = visitorIp(req);
  const ipHash = hashIp(ip);
  if (!asOwner) {
    if (!checkRateLimit(`album:${order.id}:${ipHash}`)) {
      return NextResponse.json(
        { error: "Zu viele Uploads. Bitte später erneut versuchen." },
        { status: 429 },
      );
    }
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const file = form.get("photo");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Foto fehlt." }, { status: 400 });
  }
  // JPEG/PNG/WEBP only — SVG is excluded here even though the storage adapter
  // accepts it elsewhere, because SVG is an attack vector for XSS via inline
  // <script> when rendered with a permissive Content-Type. Albums only need
  // raster formats.
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(file.type)) {
    return NextResponse.json(
      { error: "Nur JPEG, PNG oder WEBP erlaubt." },
      { status: 400 },
    );
  }
  if (file.size > STORAGE_LIMITS.maxBytes) {
    return NextResponse.json(
      { error: `Datei zu groß (max ${STORAGE_LIMITS.maxBytesHuman}).` },
      { status: 413 },
    );
  }

  const parsed = AlbumUploadSchema.safeParse({
    caption: form.get("caption") ?? undefined,
    uploaderName: form.get("uploaderName") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Eingabe ungültig." },
      { status: 400 },
    );
  }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";

  let storedUrl: string;
  try {
    const body = Buffer.from(await file.arrayBuffer());
    const result = await putAsset({
      kind: "album",
      ext,
      body,
      contentType: file.type,
    });
    storedUrl = result.url;
  } catch (err) {
    console.error("[album] storage error:", err);
    return NextResponse.json({ error: "Upload fehlgeschlagen." }, { status: 500 });
  }

  const now = new Date();
  const created = await prisma.cardAlbumPhoto.create({
    data: {
      cardOrderId: order.id,
      uploaderType: asOwner ? "owner" : "visitor",
      uploaderName: parsed.data.uploaderName,
      uploaderIpHash: asOwner ? null : ipHash,
      photoPath: storedUrl,
      caption: parsed.data.caption,
      status: asOwner ? "APPROVED" : "PENDING",
      approvedAt: asOwner ? now : null,
    },
    select: { id: true, status: true },
  });

  return NextResponse.json(created, { status: 201 });
}
