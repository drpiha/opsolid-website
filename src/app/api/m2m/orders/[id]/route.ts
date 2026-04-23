// =============================================================================
// GET /api/m2m/orders/[id] — full order detail for the federated admin.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { authorizeM2M } from "@/lib/auth/m2m";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = authorizeM2M(req);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "Unauthorized", reason: auth.reason },
      { status: 401 },
    );
  }

  const { id } = await params;
  const order = await prisma.cardOrder.findUnique({
    where: { id },
    include: {
      template: {
        select: { id: true, name: true, slug: true, componentKey: true },
      },
      subscription: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = CardDataSchema.safeParse(order.cardData);

  return NextResponse.json({
    id: order.id,
    orderNumber: order.orderNumber,
    slug: order.slug,
    templateId: order.templateId,
    template: order.template
      ? {
          id: order.template.id,
          name: order.template.name,
          slug: order.template.slug,
          componentKey: order.template.componentKey,
        }
      : null,
    contactName: order.contactName,
    contactEmail: order.contactEmail,
    contactPhone: order.contactPhone,
    callMeBack: order.callMeBack,
    cardData: parsed.success ? parsed.data : null,
    cardDataRaw: order.cardData,
    brandPrimaryHex: order.brandPrimaryHex,
    brandAccentHex: order.brandAccentHex,
    photoPath: order.photoPath,
    logoPath: order.logoPath,
    billingMode: order.billingMode,
    amountCents: order.amountCents,
    currency: order.currency,
    locale: order.locale,
    stripeSessionId: order.stripeSessionId,
    stripePaymentIntentId: order.stripePaymentIntentId,
    stripeSubscriptionId: order.stripeSubscriptionId,
    stripeCustomerId: order.stripeCustomerId,
    status: order.status,
    designNotes: order.designNotes,
    contactedAt: order.contactedAt?.toISOString() ?? null,
    contactedByNote: order.contactedByNote,
    paidAt: order.paidAt?.toISOString() ?? null,
    awaitingDesignAt: order.awaitingDesignAt?.toISOString() ?? null,
    publishedAt: order.publishedAt?.toISOString() ?? null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    subscription: order.subscription
      ? {
          id: order.subscription.id,
          status: order.subscription.status,
          currentPeriodEnd: order.subscription.currentPeriodEnd.toISOString(),
          cancelAt: order.subscription.cancelAt?.toISOString() ?? null,
          canceledAt: order.subscription.canceledAt?.toISOString() ?? null,
        }
      : null,
    statusHistory: order.statusHistory.map((h) => ({
      id: h.id,
      fromStatus: h.fromStatus,
      toStatus: h.toStatus,
      note: h.note,
      actor: h.actor,
      createdAt: h.createdAt.toISOString(),
    })),
  });
}
