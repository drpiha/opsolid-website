// =============================================================================
// POST /api/cards/[id]/claim — bind a legacy (userId=null) card to the current
// user's account (B0.6 claim-card flow).
//
// Pre-conditions:
//   - card.userId IS NULL (unclaimed)
//   - LOWER(TRIM(card.contactEmail)) === LOWER(user.email)
//
// On success: sets card.userId = user.id.
// editToken is NOT cleared — old links continue to work after claiming.
//
// Returns:
//   200  { ok: true, card: { id, slug, name, status } }
//   400  card already claimed
//   401  not authenticated
//   403  email mismatch
//   404  card not found
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, AuthError } from "@/lib/auth/require-user";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const { id } = await params;

  const card = await prisma.cardOrder.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      contactName: true,
      contactEmail: true,
      userId: true,
      status: true,
    },
  });

  if (!card) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Already claimed.
  if (card.userId !== null) {
    if (card.userId === user.id) {
      // Idempotent — already owned by this user.
      return NextResponse.json({
        ok: true,
        card: { id: card.id, slug: card.slug, name: card.contactName, status: card.status },
      });
    }
    return NextResponse.json({ error: "already_claimed" }, { status: 400 });
  }

  // Email match verification (case-insensitive, trim-safe).
  const storedEmail = card.contactEmail.trim().toLowerCase();
  const userEmail = user.email.toLowerCase();
  if (storedEmail !== userEmail) {
    return NextResponse.json({ error: "email_mismatch" }, { status: 403 });
  }

  // Claim: set userId.
  const updated = await prisma.cardOrder.update({
    where: { id },
    data: { userId: user.id },
    select: { id: true, slug: true, contactName: true, status: true },
  });

  return NextResponse.json({
    ok: true,
    card: {
      id: updated.id,
      slug: updated.slug,
      name: updated.contactName,
      status: updated.status,
    },
  });
}
