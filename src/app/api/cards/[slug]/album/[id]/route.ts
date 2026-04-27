// =============================================================================
// /api/cards/[slug]/album/[id]
//
// Owner-only management for a single album photo.
//
// PATCH  — update status (approve/reject), caption, or connectionId tag.
// DELETE — remove the row. Storage cleanup is intentionally deferred to a
//          future V2 sweep so we never destroy the underlying blob mid-flight
//          if the same key is referenced elsewhere (e.g. a CMS export).
//
// Both verbs require `?t=<editToken>` matching the parent CardOrder. The
// photo must belong to the slug in the URL — we cross-check cardOrderId
// against the resolved order before touching the row.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditToken, EditTokenError } from "@/lib/auth/edit-token";
import { AlbumPatchSchema, OrderStatus } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(
  req: NextRequest,
  slug: string,
  photoId: string,
) {
  const order = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true, status: true, editToken: true },
  });
  // 404 covers both missing-card and not-yet-published — matches the rest of
  // the public surface and avoids leaking pending order state.
  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return { error: NextResponse.json({ error: "Karte nicht gefunden." }, { status: 404 }) };
  }

  try {
    await requireEditToken(req, order.id);
  } catch (err) {
    if (err instanceof EditTokenError) {
      return { error: NextResponse.json({ error: err.code }, { status: err.status }) };
    }
    throw err;
  }

  const photo = await prisma.cardAlbumPhoto.findUnique({
    where: { id: photoId },
    select: { id: true, cardOrderId: true, status: true },
  });
  // Photo must exist AND belong to this card. We deliberately collapse the two
  // failure modes into one 404 so an attacker can't probe ID space across cards.
  if (!photo || photo.cardOrderId !== order.id) {
    return { error: NextResponse.json({ error: "Foto nicht gefunden." }, { status: 404 }) };
  }

  return { order, photo };
}

// -----------------------------------------------------------------------------
// PATCH — update status / caption / connectionId.
//
// Body (all optional, but at least one field must be present to avoid no-op
// writes): { status?: "APPROVED" | "REJECTED", caption?, connectionId? }
//
// Setting status = APPROVED stamps approvedAt = now (idempotent: if it's
// already APPROVED, we leave the existing timestamp alone).
//
// connectionId, when set to a non-null string, is verified to belong to the
// SAME card as the photo (either as owner or visitor side). This prevents
// owners from cross-tagging photos to connections that aren't theirs.
// -----------------------------------------------------------------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string; id: string } },
) {
  const auth = await authorize(req, params.slug, params.id);
  if ("error" in auth) return auth.error;
  const { photo, order } = auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const parsed = AlbumPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Eingabe ungültig." },
      { status: 400 },
    );
  }

  const { status, caption, connectionId } = parsed.data;
  if (status === undefined && caption === undefined && connectionId === undefined) {
    return NextResponse.json({ error: "Keine Änderungen." }, { status: 400 });
  }

  // Verify connectionId (if provided non-null) belongs to this card. Setting
  // null is always allowed — that's how the owner clears a tag.
  if (connectionId) {
    const conn = await prisma.cardConnection.findUnique({
      where: { id: connectionId },
      select: { id: true, ownerCardId: true, visitorCardId: true },
    });
    if (
      !conn ||
      (conn.ownerCardId !== order.id && conn.visitorCardId !== order.id)
    ) {
      return NextResponse.json(
        { error: "Connection nicht gefunden." },
        { status: 404 },
      );
    }
  }

  const data: {
    status?: string;
    caption?: string | null;
    connectionId?: string | null;
    approvedAt?: Date;
  } = {};

  if (status !== undefined) {
    data.status = status;
    // Only stamp approvedAt on a transition INTO APPROVED. Re-saving an
    // already-APPROVED row preserves the original approval timestamp.
    if (status === "APPROVED" && photo.status !== "APPROVED") {
      data.approvedAt = new Date();
    }
  }
  if (caption !== undefined) {
    data.caption = caption.length === 0 ? null : caption;
  }
  if (connectionId !== undefined) {
    data.connectionId = connectionId;
  }

  const updated = await prisma.cardAlbumPhoto.update({
    where: { id: photo.id },
    data,
    select: {
      id: true,
      status: true,
      caption: true,
      connectionId: true,
      approvedAt: true,
      photoPath: true,
      uploaderName: true,
      uploaderType: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    ...updated,
    approvedAt: updated.approvedAt?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
  });
}

// -----------------------------------------------------------------------------
// DELETE — remove the photo row. Storage object is intentionally NOT deleted
// here; a separate cleanup pass (V2) will reconcile orphaned blobs.
// Returns 204 No Content on success.
// -----------------------------------------------------------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string; id: string } },
) {
  const auth = await authorize(req, params.slug, params.id);
  if ("error" in auth) return auth.error;
  const { photo } = auth;

  await prisma.cardAlbumPhoto.delete({ where: { id: photo.id } });
  return new NextResponse(null, { status: 204 });
}
