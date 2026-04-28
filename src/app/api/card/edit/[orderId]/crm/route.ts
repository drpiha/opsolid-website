// GET /api/card/edit/[orderId]/crm?t=<editToken>
// Returns leads and card-to-card connections for the card owner's CRM panel.
// Gated by the same edit token as the PATCH endpoint.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const [leads, connections] = await Promise.all([
      prisma.cardLead.findMany({
        where: { orderId: order.id },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          createdAt: true,
        },
      }),
      prisma.cardConnection.findMany({
        where: { ownerCardId: order.id },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          source: true,
          note: true,
          createdAt: true,
          visitorCard: {
            select: {
              slug: true,
              cardData: true,
            },
          },
        },
      }),
    ]);

    const connectionsOut = connections.map((c) => {
      const data = c.visitorCard.cardData as { name?: string } | null;
      return {
        id: c.id,
        visitorSlug: c.visitorCard.slug,
        visitorName: data?.name ?? c.visitorCard.slug,
        source: c.source,
        note: c.note,
        createdAt: c.createdAt,
      };
    });

    return NextResponse.json({ leads, connections: connectionsOut });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/edit/crm GET]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
