// =============================================================================
// POST /api/cards/[id]/delete — soft-delete a card (B0.6).
//
// Auth: requireUser (cookie or Bearer).
// Ownership check:
//   - card.userId === user.id  (normal case — card already claimed)
//   - card.userId === null AND LOWER(TRIM(card.contactEmail)) === LOWER(user.email)
//     (claim-and-delete shorthand for legacy pre-auth cards)
//
// Soft-delete: sets status = 'CANCELLED'. The card remains in the DB and all
// public links resolve to a 404 (middleware / page component checks status).
// editToken links continue to work after delete (no-op; page shows archived state).
//
// Returns:
//   200  { ok: true }
//   401  not authenticated
//   403  not the owner
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
  // 1. Authenticate.
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const { id } = await params;

  // 2. Load card.
  const card = await prisma.cardOrder.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      contactEmail: true,
      status: true,
    },
  });

  if (!card) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // 3. Ownership check.
  const ownedByUser = card.userId === user.id;
  const legacyEmailMatch =
    card.userId === null &&
    card.contactEmail.trim().toLowerCase() === user.email.toLowerCase();

  if (!ownedByUser && !legacyEmailMatch) {
    // Sentry breadcrumb (dynamic import so the module is never bundled into
    // routes that don't reach this branch at runtime).
    try {
      const Sentry = await import("@sentry/nextjs");
      Sentry.addBreadcrumb({
        category: "auth",
        message: `card.delete: 403 for card ${id} by user ${user.id}`,
        level: "warning",
      });
    } catch {
      // Sentry not configured — ignore.
    }
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 4. Soft-delete.
  await prisma.cardOrder.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  // Sentry breadcrumb for successful delete.
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.addBreadcrumb({
      category: "cards",
      message: `card.delete: card ${id} cancelled by user ${user.id}`,
      level: "info",
    });
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true });
}
