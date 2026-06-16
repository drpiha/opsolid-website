// =============================================================================
// GET /api/card/edit/[orderId]/quality-score?t=<editToken>
//
// Returns a 0-100 quality score for the card owner's profile completeness.
// Gated by the same edit token as the PATCH / CRM / analytics endpoints.
//
// Response shape: QualityScoreResult (see src/lib/card-quality.ts)
//   { score, maxScore, breakdown, suggestions }
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireCardEditAccess } from "@/lib/auth/edit-token";
import { getOptionalUser } from "@/lib/auth/require-user";
import { calculateQualityScore } from "@/lib/card-quality";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await getOptionalUser(req);
    const order = await requireCardEditAccess(req, params.orderId, user);

    const data = await prisma.cardOrder.findUnique({
      where: { id: order.id },
      select: {
        photoPath: true,
        logoPath: true,
        contactName: true,
        contactEmail: true,
        contactPhone: true,
        videoUrl: true,
        cardData: true,
        city: true,
        country: true,
        openToNetworking: true,
        acceptingClients: true,
      },
    });

    if (!data) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const result = calculateQualityScore(data);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/edit/quality-score GET]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
