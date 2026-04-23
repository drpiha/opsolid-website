// =============================================================================
// Customer self-service edit endpoint — PATCH /api/card/edit/[orderId]?t=...
//
// Gate: `requireEditToken` (constant-time, per-order UUID). No admin bearer.
// Writable fields: cardData, brandPrimaryHex, brandAccentHex, photoPath,
// logoPath, and an optional designer hint that gets appended to designNotes.
// Non-writable: billingMode, template, contact email/name/phone (those need
// support — changing them after payment would break Stripe customer mapping).
//
// Blocks edits in PENDING_PAYMENT (not paid yet), CANCELLED, REFUNDED (archive
// states). Editing during AWAITING_DESIGN leaves a "customer edited — re-render
// before publish" flag in designNotes so the designer notices before going live.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CardDataSchema, OrderStatus } from "@/lib/validation";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a #rrggbb hex")
  .optional()
  .or(z.literal("").transform(() => undefined));

const PatchSchema = z.object({
  cardData: CardDataSchema,
  brandPrimaryHex: hexColor,
  brandAccentHex: hexColor,
  photoPath: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  logoPath: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

const NON_EDITABLE_STATUSES = new Set<string>([
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await requireEditToken(req, params.orderId);

    if (NON_EDITABLE_STATUSES.has(order.status)) {
      return NextResponse.json(
        { error: "not_editable", status: order.status },
        { status: 409 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // If the designer is still preparing the first render, nudge them to
    // pick up the new input. Appended rather than overwriting so they can
    // still see their own prior internal notes.
    const designerHint =
      order.status === OrderStatus.AWAITING_DESIGN
        ? `[${new Date().toISOString()}] customer edited — re-render before publish`
        : null;

    const nextDesignNotes = designerHint
      ? [order.designNotes?.trim(), designerHint].filter(Boolean).join("\n")
      : order.designNotes;

    await prisma.cardOrder.update({
      where: { id: order.id },
      data: {
        cardData: data.cardData,
        brandPrimaryHex: data.brandPrimaryHex ?? null,
        brandAccentHex: data.brandAccentHex ?? null,
        photoPath: data.photoPath ?? null,
        logoPath: data.logoPath ?? null,
        designNotes: nextDesignNotes,
      },
    });

    // Audit trail — status doesn't change, so from == to.
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        fromStatus: order.status,
        toStatus: order.status,
        actor: "customer-self-edit",
        note: designerHint ?? "Customer edited card content",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof EditTokenError) {
      return NextResponse.json({ error: err.code }, { status: err.status });
    }
    console.error("[card/edit PATCH] unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
