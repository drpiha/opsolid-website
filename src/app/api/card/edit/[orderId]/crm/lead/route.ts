// POST /api/card/edit/[orderId]/crm/lead?t=<editToken>
// Owner manually adds a contact to their CRM inbox (e.g. someone met offline).
// Gated by the same edit token as the other CRM endpoints.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";

const CreateSchema = z
  .object({
    name: z.string().trim().max(200).optional(),
    email: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(60).optional(),
    company: z.string().trim().max(200).optional(),
    message: z.string().trim().max(2000).optional(),
  })
  .refine((d) => Boolean(d.name || d.email || d.phone), {
    message: "name_email_or_phone_required",
  });

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "invalid" },
        { status: 400 },
      );
    }
    const d = parsed.data;

    const lead = await prisma.cardLead.create({
      data: {
        orderId: order.id,
        name: d.name || null,
        email: d.email || null,
        phone: d.phone || null,
        company: d.company || null,
        message: d.message || null,
        // Tag so the owner can tell manually-added contacts apart from inbound.
        tags: ["manuel"],
        status: "new",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        interest: true,
        meetingContext: true,
        company: true,
        ownerNotes: true,
        tags: true,
        status: true,
        priority: true,
        lastContactedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[crm/lead POST]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
