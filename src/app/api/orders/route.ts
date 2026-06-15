import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderPayloadSchema, OrderStatus } from "@/lib/validation";
import { getTemplateById } from "@/config/card-templates";
import { resolveCardEntitlement, EntitlementError } from "@/lib/billing/plan";
import { createCheckoutSession } from "@/lib/stripe";
import { validateManualSlug, isSlugAvailable, ensureUniqueSlug } from "@/lib/slug";
import { getSiteUrl } from "@/lib/stripe";
import { sendCustomerEmail } from "@/lib/email/send";
import { normalizeLocale } from "@/lib/email/shell";
import {
  cardLiveSubject,
  renderCardLiveHtml,
  renderCardLiveText,
} from "@/lib/email/templates/card-live";

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

  // Resolve price through the single entitlement seam (never trust the client).
  // Under all_free this always returns FREE/0 — no order can reach Stripe, even
  // one submitted from a stale form that still offered paid tiers. Paid tiers
  // price from the template; future per-person / group / event grants resolve
  // in this same call.
  let entitlement;
  try {
    entitlement = resolveCardEntitlement({
      billingMode: data.billingMode,
      template,
      contactEmail: data.contactEmail,
      eventSlug: data.eventSlug,
    });
  } catch (err) {
    if (err instanceof EntitlementError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
  // The resolved billing mode is authoritative (all_free coerces paid -> FREE).
  data.billingMode = entitlement.billingMode;
  const isFree = entitlement.isFree;
  const amountCents = entitlement.amountCents;

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
      amountCents,
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

  // Fair flow — attach the card to the event's attendee directory. Best-
  // effort: an unknown/inactive event or a race on the unique constraint must
  // never fail the order itself. The public roster only lists PUBLISHED
  // cards, so paid orders surface there after publish.
  let attachedEventSlug: string | null = null;
  if (data.eventSlug) {
    try {
      const event = await prisma.event.findUnique({
        where: { slug: data.eventSlug },
        select: { id: true, slug: true, isActive: true, endAt: true },
      });
      if (event && event.isActive && event.endAt > new Date()) {
        await prisma.eventAttendee.create({
          data: { eventId: event.id, cardId: order.id },
        });
        attachedEventSlug = event.slug;
      }
    } catch (err) {
      console.error("[orders] event attach failed (non-fatal):", err);
    }
  }

  // FREE: return card URL + edit link, no Stripe.
  if (isFree) {
    const siteUrl = getSiteUrl();
    const cardUrl = `${siteUrl}/c/${freeSlug}`;
    const editUrl = `/${data.locale}/card/edit/${order.id}?t=${editToken}`;
    // Card-live email with the public + edit links. Without it the edit link
    // only exists in this response — close the tab on a phone (the trade-fair
    // case) and the card is unrecoverable. Fire-and-forget: the response must
    // not wait on SMTP, and a mail failure must not fail the order.
    //
    // Wrapped in try/catch because the template render (cardLiveSubject /
    // renderCardLiveHtml / renderCardLiveText) runs SYNCHRONOUSLY here — a
    // throw would 500 the response even though the order was already created,
    // which looks to the customer like "card creation failed". Email is never
    // worth failing a created card over.
    try {
      const liveInput = {
        orderId: order.id,
        contactName: data.contactName,
        cardUrl,
        editToken,
        locale: normalizeLocale(data.locale),
        eventUrl: attachedEventSlug
          ? `${siteUrl}/${data.locale}/events/${attachedEventSlug}`
          : null,
      };
      void sendCustomerEmail({
        to: data.contactEmail,
        subject: cardLiveSubject(liveInput.locale),
        html: renderCardLiveHtml(liveInput),
        text: renderCardLiveText(liveInput),
      })
        .then((result) => {
          if (result.skipped) {
            // Not delivered (send failed). The edit link is already in the API
            // response and the resend-link route is the recovery path, so log
            // loudly rather than swallow.
            console.error(
              `[orders] card-live email NOT delivered to ${data.contactEmail}: ${result.reason ?? "unknown error"}`
            );
          } else {
            console.log(
              `[orders] card-live email sent to ${data.contactEmail} (${result.messageId ?? "no-id"})`
            );
          }
        })
        .catch((err) => {
          console.error("[orders] free-tier card-live email failed:", err);
        });
    } catch (err) {
      console.error("[orders] card-live email dispatch threw (non-fatal):", err);
    }
    return NextResponse.json({ orderId: order.id, editToken, cardUrl, editUrl });
  }

  // Paid tiers: create Stripe checkout session.
  //
  // The Stripe Price IDs stored in the catalog are TEST-mode objects. A
  // test-mode price under a live key (or vice-versa) is rejected by Stripe
  // ("No such price"), which would break exactly the ~19 priced templates the
  // instant we switch to live keys. The `*Cents` fields are authoritative and
  // present for every template, and inline price_data works in either mode, so
  // we default to price_data and only consume stored price IDs when explicitly
  // opted in (after a live `setup-stripe` run) via STRIPE_USE_PRICE_IDS=true.
  const useStoredPriceIds = process.env.STRIPE_USE_PRICE_IDS === "true";
  const priceId = useStoredPriceIds
    ? data.billingMode === "MONTHLY"
      ? template.stripeMonthlyPriceId
      : data.billingMode === "YEARLY"
      ? template.stripeYearlyPriceId
      : template.stripeOneTimePriceId
    : null;

  try {
    const session = await createCheckoutSession({
      orderId: order.id,
      amountCents,
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
