// =============================================================================
// Phase 8.4 — Owner feedback management.
//
// GET   /api/card/edit/[orderId]/feedback?t=<editToken>
//   Returns: { feedbackEnabled, count, averages, recent: last10comments }
//   `recent` contains at most 10 entries with { comment, createdAt } — no
//   giver identity is exposed (giver privacy; only the owner sees comments).
//
// PATCH /api/card/edit/[orderId]/feedback?t=<editToken>
//   Body: { feedbackEnabled: boolean }
//   Toggles the feedbackEnabled flag on the card order.
//   Returns: { feedbackEnabled }
//
// Auth: editToken gate (same pattern as analytics, crm, quality-score siblings).
//   Missing or wrong token → 403/404 from requireEditToken.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  feedbackEnabled: z.boolean(),
});

// GET — owner view of all feedback (aggregated + last 10 comments)
export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const rows = await prisma.cardFeedback.findMany({
      where: { cardOrderId: order.id },
      select: { ratings: true, comment: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const count = rows.length;

    const averages: Record<string, number> = {};
    if (count > 0) {
      const sums: Record<string, number> = {};
      for (const row of rows) {
        const r = row.ratings as Record<string, number>;
        for (const [k, v] of Object.entries(r)) {
          sums[k] = (sums[k] ?? 0) + v;
        }
      }
      for (const [k, v] of Object.entries(sums)) {
        averages[k] = Math.round((v / count) * 10) / 10;
      }
    }

    // Return the 10 most recent comments (no giver identity).
    const recent = rows
      .filter((r) => r.comment)
      .slice(0, 10)
      .map((r) => ({ comment: r.comment, createdAt: r.createdAt }));

    return NextResponse.json({
      feedbackEnabled: order.feedbackEnabled,
      count,
      averages,
      recent,
    });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/edit/feedback GET]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// PATCH — toggle feedbackEnabled
export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const body = await req.json().catch(() => null);
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await prisma.cardOrder.update({
      where: { id: order.id },
      data: { feedbackEnabled: parsed.data.feedbackEnabled },
      select: { feedbackEnabled: true },
    });

    return NextResponse.json({ feedbackEnabled: updated.feedbackEnabled });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/edit/feedback PATCH]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
