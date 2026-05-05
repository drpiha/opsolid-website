// =============================================================================
// Phase 8.3 — Save / unsave a card by slug.
//
// POST   /api/cards/[slug]/save — bookmark a card (idempotent upsert)
// DELETE /api/cards/[slug]/save — remove bookmark
// GET    /api/cards/[slug]/save — check if current user has saved this card
//
// Security:
//   - Requires authentication (AuthError → 401 if not logged in).
//   - A user cannot save their own card (400 cannot_save_own_card).
//   - Private cards are invisible to non-owners (404, same as not-found).
//   - SavedCard rows are owner-private: the card owner cannot see who saved them.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, AuthError } from "@/lib/auth/require-user";

export const runtime = "nodejs";

// POST /api/cards/[slug]/save — bookmark a card (idempotent)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const { slug } = await params;

  const card = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true, status: true, visibility: true, userId: true },
  });

  if (!card || card.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (card.visibility === "private" && card.userId !== user.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (card.userId === user.id) {
    return NextResponse.json({ error: "cannot_save_own_card" }, { status: 400 });
  }

  const saved = await prisma.savedCard.upsert({
    where: { userId_cardOrderId: { userId: user.id, cardOrderId: card.id } },
    create: { userId: user.id, cardOrderId: card.id },
    update: {}, // already saved — no-op
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ saved: true, id: saved.id });
}

// DELETE /api/cards/[slug]/save — remove bookmark
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const { slug } = await params;

  const card = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!card) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.savedCard.deleteMany({
    where: { userId: user.id, cardOrderId: card.id },
  });

  return NextResponse.json({ saved: false });
}

// GET /api/cards/[slug]/save — check if current user has saved this card
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const { slug } = await params;

  const card = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!card) return NextResponse.json({ saved: false });

  const existing = await prisma.savedCard.findUnique({
    where: { userId_cardOrderId: { userId: user.id, cardOrderId: card.id } },
    select: { id: true },
  });

  return NextResponse.json({ saved: !!existing });
}
