// GET /api/card/edit/[orderId]/coach?t=TOKEN
//
// Returns the full coach suggestion list (rule-based by default).
// Requires a valid edit token — same auth pattern as sibling routes.

import { NextRequest, NextResponse } from "next/server";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";
import { getCoachSuggestions } from "@/lib/card-coach";
import type { CardOrderForScore } from "@/lib/card-quality";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const cardForScore: CardOrderForScore = {
      photoPath: order.photoPath,
      logoPath: order.logoPath,
      contactName: order.contactName,
      contactEmail: order.contactEmail,
      contactPhone: order.contactPhone,
      videoUrl: order.videoUrl,
      cardData: order.cardData,
      city: order.city,
      country: order.country,
      openToNetworking: order.openToNetworking,
      acceptingClients: order.acceptingClients,
    };

    const suggestions = await getCoachSuggestions(cardForScore);

    return NextResponse.json({ suggestions }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[coach] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
