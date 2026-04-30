// PATCH /api/card/edit/[orderId]/crm/lead/[leadId]?t=<editToken>
// Owner updates a lead's ownerNotes, tags, status, priority, lastContactedAt.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";

const PatchSchema = z.object({
  ownerNotes: z.string().max(10000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  status: z.enum(["new", "contacted", "qualified", "archived"]).optional(),
  priority: z.number().int().min(0).max(2).optional(),
  lastContactedAt: z.string().datetime().optional().or(z.null()),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string; leadId: string } }
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    // Verify lead belongs to this order
    const existing = await prisma.cardLead.findFirst({
      where: { id: params.leadId, orderId: order.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const updated = await prisma.cardLead.update({
      where: { id: params.leadId },
      data: {
        ...(parsed.data.ownerNotes !== undefined && { ownerNotes: parsed.data.ownerNotes }),
        ...(parsed.data.tags !== undefined && { tags: parsed.data.tags }),
        ...(parsed.data.status !== undefined && { status: parsed.data.status }),
        ...(parsed.data.priority !== undefined && { priority: parsed.data.priority }),
        ...(parsed.data.lastContactedAt !== undefined && {
          lastContactedAt: parsed.data.lastContactedAt
            ? new Date(parsed.data.lastContactedAt)
            : null,
        }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[crm/lead PATCH]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
