// =============================================================================
// /api/card/manage/[orderId]/leads — owner self-service lead inbox.
//
// GET   — newest-first lead list (capped) for the owner's card
// PATCH — update one lead's status ("new"|"contacted"|"qualified"|"archived")
//
// Gate: per-order edit token (`?t=…`) — works for account-less owners. The
// data returned here is the owner's own CRM inbox (people who submitted the
// "send my info" form on their card), never anyone else's.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LEADS = 200;
const LEAD_STATUSES = ["new", "contacted", "qualified", "archived"] as const;

const PatchInput = z
  .object({
    leadId: z.string().min(1).max(64),
    status: z.enum(LEAD_STATUSES),
  })
  .strict();

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    const leads = await prisma.cardLead.findMany({
      where: { orderId: order.id },
      orderBy: { createdAt: "desc" },
      take: MAX_LEADS,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        message: true,
        interest: true,
        meetingContext: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      leads: leads.map((l) => ({
        ...l,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/manage leads GET] unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
    const parsed = PatchInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const result = await prisma.cardLead.updateMany({
      where: { id: parsed.data.leadId, orderId: order.id },
      data: {
        status: parsed.data.status,
        lastContactedAt:
          parsed.data.status === "contacted" ? new Date() : undefined,
      },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "lead_not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/manage leads PATCH] unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
