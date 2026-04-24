import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderPayloadSchema, OrderStatus } from "@/lib/validation";
import { getTemplateById } from "@/config/card-templates";
import { createCheckoutSession } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = OrderPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const template = getTemplateById(data.templateId);
  if (!template || !template.isActive) {
    return NextResponse.json({ error: "Unknown template" }, { status: 404 });
  }

  // Resolve the amount server-side (never trust the client).
  const amountCents =
    data.billingMode === "MONTHLY"
      ? template.monthlyCents
      : data.billingMode === "YEARLY"
      ? template.yearlyCents
      : template.oneTimeCents;

  if (data.billingMode !== "ONE_TIME" && !amountCents) {
    return NextResponse.json(
      { error: `This template does not offer a ${data.billingMode.toLowerCase()} plan.` },
      { status: 400 }
    );
  }

  const order = await prisma.cardOrder.create({
    data: {
      templateId: template.id,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      callMeBack: data.callMeBack,
      cardData: data.cardData,
      brandPrimaryHex: data.brandPrimaryHex,
      brandAccentHex: data.brandAccentHex,
      photoPath: data.photoPath,
      logoPath: data.logoPath,
      // Premium foundation fields (2026-04-23). Persisting them now means the
      // Stripe webhook can read conciergeAddon when deciding self-serve vs
      // designer review without a second client round-trip.
      conciergeAddon: data.conciergeAddon,
      layoutKey: data.layoutKey,
      themeKey: data.themeKey,
      customBlocks: data.customBlocks
        ? (data.customBlocks as unknown as object)
        : undefined,
      qrStyle: data.qrStyle ? (data.qrStyle as unknown as object) : undefined,
      billingMode: data.billingMode,
      amountCents: amountCents!,
      currency: "EUR",
      locale: data.locale,
      status: OrderStatus.PENDING_PAYMENT,
      // Track D consumes this to let customers edit from /card/edit/[token].
      editToken: crypto.randomUUID(),
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      fromStatus: null,
      toStatus: OrderStatus.PENDING_PAYMENT,
      actor: "system",
      note: "Order created, awaiting Stripe checkout",
    },
  });

  const priceId =
    data.billingMode === "MONTHLY"
      ? template.stripeMonthlyPriceId
      : data.billingMode === "YEARLY"
      ? template.stripeYearlyPriceId
      : template.stripeOneTimePriceId;

  try {
    const session = await createCheckoutSession({
      orderId: order.id,
      amountCents: amountCents!,
      currency: "EUR",
      templateName: template.name,
      billingMode: data.billingMode,
      stripePriceId: priceId,
      locale: data.locale,
      customerEmail: data.contactEmail,
    });

    await prisma.cardOrder.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      orderId: order.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("[orders] Stripe checkout session failed:", error);
    await prisma.cardOrder.update({
      where: { id: order.id },
      data: { status: OrderStatus.CANCELLED },
    });
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        fromStatus: OrderStatus.PENDING_PAYMENT,
        toStatus: OrderStatus.CANCELLED,
        actor: "system",
        note: `Stripe error: ${(error as Error).message}`,
      },
    });
    return NextResponse.json(
      { error: "Payment provider unavailable" },
      { status: 502 }
    );
  }
}
