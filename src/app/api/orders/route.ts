import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderPayloadSchema, OrderStatus } from "@/lib/validation";
import { getTemplateById } from "@/config/card-templates";
import { createCheckoutSession } from "@/lib/stripe";
import { validateManualSlug, isSlugAvailable, ensureUniqueSlug } from "@/lib/slug";
import { getSiteUrl } from "@/lib/stripe";

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

  // FREE tier bypasses Stripe entirely — amount is always 0.
  const isFree = data.billingMode === "FREE";

  // Resolve the amount server-side (never trust the client).
  const amountCents = isFree
    ? 0
    : data.billingMode === "MONTHLY"
    ? template.monthlyCents
    : data.billingMode === "YEARLY"
    ? template.yearlyCents
    : template.oneTimeCents;

  if (!isFree && data.billingMode !== "ONE_TIME" && !amountCents) {
    return NextResponse.json(
      { error: `This template does not offer a ${data.billingMode.toLowerCase()} plan.` },
      { status: 400 }
    );
  }

  // Validate optional customer-chosen slug before creating the order.
  // Re-validated in the publish flow for paid tiers; for FREE we set it now.
  let desiredSlug: string | undefined;
  if (data.desiredSlug) {
    const v = validateManualSlug(data.desiredSlug);
    if (!v.ok) {
      return NextResponse.json(
        { error: "slug_invalid", reason: v.reason },
        { status: 400 },
      );
    }
    if (!(await isSlugAvailable(v.slug))) {
      return NextResponse.json(
        { error: "slug_taken" },
        { status: 409 },
      );
    }
    desiredSlug = v.slug;
  }

  // FREE: generate slug now so the card URL is immediately available.
  const freeSlug = isFree
    ? desiredSlug ?? (await ensureUniqueSlug(data.cardData.name ?? data.contactName))
    : undefined;

  const editToken = crypto.randomUUID();

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
      conciergeAddon: isFree ? false : data.conciergeAddon,
      layoutKey: data.layoutKey,
      themeKey: data.themeKey,
      customBlocks: data.customBlocks
        ? (data.customBlocks as unknown as object)
        : undefined,
      qrStyle: data.qrStyle ? (data.qrStyle as unknown as object) : undefined,
      billingMode: data.billingMode,
      amountCents: amountCents ?? 0,
      currency: "EUR",
      locale: data.locale,
      // FREE goes straight to PUBLISHED; paid starts at PENDING_PAYMENT.
      status: isFree ? OrderStatus.PUBLISHED : OrderStatus.PENDING_PAYMENT,
      slug: freeSlug,
      paidAt: isFree ? new Date() : undefined,
      publishedAt: isFree ? new Date() : undefined,
      editToken,
      desiredSlug: isFree ? undefined : desiredSlug,
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      fromStatus: null,
      toStatus: isFree ? OrderStatus.PUBLISHED : OrderStatus.PENDING_PAYMENT,
      actor: "system",
      note: isFree
        ? "Free tier — published immediately (no payment)"
        : "Order created, awaiting Stripe checkout",
    },
  });

  // FREE: return card URL + edit link, no Stripe.
  if (isFree) {
    const siteUrl = getSiteUrl();
    const cardUrl = `${siteUrl}/c/${freeSlug}`;
    const editUrl = `/${data.locale}/card/edit/${order.id}?t=${editToken}`;
    return NextResponse.json({ orderId: order.id, editToken, cardUrl, editUrl });
  }

  // Paid tiers: create Stripe checkout session.
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
      // FREE never reaches this branch — cast is safe.
      billingMode: data.billingMode as "ONE_TIME" | "MONTHLY" | "YEARLY",
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
