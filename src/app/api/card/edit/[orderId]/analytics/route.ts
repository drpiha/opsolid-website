// =============================================================================
// GET /api/card/edit/[orderId]/analytics?t=<editToken>
//
// Returns view-count analytics for the card owner's dashboard panel.
// Gated by the same edit token as the PATCH / CRM endpoints.
//
// Response:
//   { total, last7d, last30d, bySource: { qr, nfc, link, wallet, other } }
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function startOf(daysAgo: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const [all, last7d, last30d, bySrc] = await Promise.all([
      prisma.cardView.count({ where: { orderId: order.id } }),
      prisma.cardView.count({
        where: { orderId: order.id, createdAt: { gte: startOf(7) } },
      }),
      prisma.cardView.count({
        where: { orderId: order.id, createdAt: { gte: startOf(30) } },
      }),
      prisma.cardView.groupBy({
        by: ["source"],
        where: { orderId: order.id },
        _count: { _all: true },
      }),
    ]);

    const bySource: Record<string, number> = {
      qr: 0,
      nfc: 0,
      link: 0,
      wallet: 0,
      other: 0,
    };
    for (const row of bySrc) {
      const key = row.source ?? "other";
      if (key in bySource) {
        bySource[key] = row._count._all;
      } else {
        bySource.other += row._count._all;
      }
    }

    return NextResponse.json({
      total: all,
      last7d,
      last30d,
      bySource,
    });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/edit/analytics GET]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
