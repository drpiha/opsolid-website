// =============================================================================
// Phase 8.4 — Card feedback (public aggregate + authenticated submission).
//
// GET  /api/cards/[slug]/feedback — public aggregate (no auth required).
//   Returns: { enabled, count, averages: { [category]: number } }
//   Returns enabled:false (and empty data) if feedbackEnabled is off or card
//   is not PUBLISHED.
//
// POST /api/cards/[slug]/feedback — submit / update feedback (requires login).
//   Body: { ratings: { design, readability, photo, cta, mobile, trust,
//           content }: 1-5 each }, comment?: string (max 500)
//   Returns 201 { created: true } on first submission, 200 { updated: true }
//   on re-submission (upsert semantics — one row per user per card).
//
// Security:
//   - POST requires authentication (AuthError → 401).
//   - Owner cannot submit feedback on their own card (400 cannot_review_own_card).
//   - feedbackEnabled must be true on the card (403 feedback_disabled).
//   - Ratings validated 1–5 integers; comment trimmed to 500 chars.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, AuthError } from "@/lib/auth/require-user";
import { z } from "zod";

export const runtime = "nodejs";

const CATEGORIES = [
  "design",
  "readability",
  "photo",
  "cta",
  "mobile",
  "trust",
  "content",
] as const;

const RatingsSchema = z.object(
  Object.fromEntries(
    CATEGORIES.map((k) => [k, z.number().int().min(1).max(5)]),
  ) as Record<(typeof CATEGORIES)[number], z.ZodNumber>,
);

const SubmitSchema = z.object({
  ratings: RatingsSchema,
  comment: z.string().max(500).optional(),
});

// GET — public aggregate (no auth required, only if feedbackEnabled)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const card = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true, status: true, feedbackEnabled: true },
  });

  if (!card || card.status !== "PUBLISHED" || !card.feedbackEnabled) {
    return NextResponse.json({ enabled: false, count: 0, averages: {} });
  }

  const rows = await prisma.cardFeedback.findMany({
    where: { cardOrderId: card.id },
    select: { ratings: true },
  });

  if (rows.length === 0) {
    return NextResponse.json({ enabled: true, count: 0, averages: {} });
  }

  // Compute per-category averages across all submissions.
  const sums: Record<string, number> = {};
  for (const row of rows) {
    const r = row.ratings as Record<string, number>;
    for (const [k, v] of Object.entries(r)) {
      sums[k] = (sums[k] ?? 0) + v;
    }
  }
  const averages: Record<string, number> = {};
  for (const [k, v] of Object.entries(sums)) {
    averages[k] = Math.round((v / rows.length) * 10) / 10;
  }

  return NextResponse.json({ enabled: true, count: rows.length, averages });
}

// POST — submit / update feedback (requires login)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    if (err instanceof AuthError) return err.toResponse();
    throw err;
  }

  const card = await prisma.cardOrder.findUnique({
    where: { slug },
    select: { id: true, status: true, feedbackEnabled: true, userId: true },
  });

  if (!card || card.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!card.feedbackEnabled) {
    return NextResponse.json({ error: "feedback_disabled" }, { status: 403 });
  }
  if (card.userId === user.id) {
    return NextResponse.json(
      { error: "cannot_review_own_card" },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await prisma.cardFeedback.findUnique({
    where: {
      giverId_cardOrderId: { giverId: user.id, cardOrderId: card.id },
    },
    select: { id: true },
  });

  if (existing) {
    // Re-submission: update in place (owner dashboard always shows latest).
    await prisma.cardFeedback.update({
      where: { id: existing.id },
      data: {
        ratings: parsed.data.ratings,
        comment: parsed.data.comment ?? null,
      },
    });
    return NextResponse.json({ updated: true });
  }

  await prisma.cardFeedback.create({
    data: {
      cardOrderId: card.id,
      giverId: user.id,
      ratings: parsed.data.ratings,
      comment: parsed.data.comment ?? null,
    },
  });

  return NextResponse.json({ created: true }, { status: 201 });
}
