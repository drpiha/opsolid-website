// =============================================================================
// Shared order state-transition helpers.
//
// Both /api/admin/orders/* (URL-token admin) and /api/m2m/orders/* (federated
// Kutasia admin) delegate here. Keep all status-change side-effects in one
// place so we cannot accidentally diverge behaviour between the two admins.
// =============================================================================

import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { buildSlug, isSlugAvailable } from "@/lib/slug";
import { notifyOrderEvent } from "@/lib/notifications";
import { sendCustomerEmail } from "@/lib/email/send";
import { normalizeLocale } from "@/lib/email/shell";
import {
  renderRevisionReadyHtml,
  renderRevisionReadyText,
  revisionReadySubject,
} from "@/lib/email/templates/revision-ready";

export type OrderActionResult =
  | { ok: true; slug?: string }
  | { ok: false; status: number; error: string };

type ActorName = "admin" | "admin:m2m" | string;

// ---------------------------------------------------------------------------
// mark-contacted: log that the operator called the customer back.
// ---------------------------------------------------------------------------
export async function markContactedAction(
  orderId: string,
  opts: { note?: string; actor?: ActorName } = {},
): Promise<OrderActionResult> {
  const order = await prisma.cardOrder.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, status: 404, error: "Not found" };

  const now = new Date();
  const note = opts.note?.trim() || undefined;

  await prisma.cardOrder.update({
    where: { id: orderId },
    data: { contactedAt: now, contactedByNote: note ?? null },
  });
  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      fromStatus: order.status,
      toStatus: order.status,
      actor: opts.actor ?? "admin",
      note: `Contacted. ${note ?? ""}`.trim(),
    },
  });
  return { ok: true };
}

// ---------------------------------------------------------------------------
// cancel: move an order to CANCELLED. Idempotent.
// ---------------------------------------------------------------------------
export async function cancelOrderAction(
  orderId: string,
  opts: { note?: string; actor?: ActorName } = {},
): Promise<OrderActionResult> {
  const order = await prisma.cardOrder.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, status: 404, error: "Not found" };

  if (order.status === OrderStatus.CANCELLED) {
    return { ok: true };
  }

  await prisma.cardOrder.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
  });
  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      fromStatus: order.status,
      toStatus: OrderStatus.CANCELLED,
      actor: opts.actor ?? "admin",
      note: opts.note?.trim() || "Manually cancelled",
    },
  });
  return { ok: true };
}

// ---------------------------------------------------------------------------
// publish: AWAITING_DESIGN -> PUBLISHED, assign slug, fire notifications.
// ---------------------------------------------------------------------------
export async function publishOrderAction(
  orderId: string,
  opts: { designNotes?: string; actor?: ActorName } = {},
): Promise<OrderActionResult> {
  const order = await prisma.cardOrder.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, status: 404, error: "Not found" };
  if (order.status !== OrderStatus.AWAITING_DESIGN) {
    return {
      ok: false,
      status: 409,
      error: `Order is ${order.status}, cannot publish`,
    };
  }

  let slug = order.slug;
  if (!slug && order.desiredSlug && (await isSlugAvailable(order.desiredSlug))) {
    slug = order.desiredSlug;
  }
  if (!slug) {
    for (let i = 0; i < 5; i++) {
      const candidate = buildSlug(order.contactName, order.id);
      const conflict = await prisma.cardOrder.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      if (!conflict) {
        slug = candidate;
        break;
      }
    }
  }
  if (!slug) {
    return {
      ok: false,
      status: 500,
      error: "Could not generate a unique slug",
    };
  }

  const trimmedNotes = opts.designNotes?.trim();
  const now = new Date();

  await prisma.cardOrder.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.PUBLISHED,
      slug,
      publishedAt: now,
      designNotes:
        trimmedNotes && trimmedNotes.length > 0
          ? trimmedNotes
          : order.designNotes,
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      fromStatus: OrderStatus.AWAITING_DESIGN,
      toStatus: OrderStatus.PUBLISHED,
      actor: opts.actor ?? "admin",
      note:
        trimmedNotes && trimmedNotes.length > 0
          ? `Published. Design notes: ${trimmedNotes}`
          : "Published after design review.",
    },
  });

  // Auto-create a "main" short link using the slug as the code so
  // go.opsolid.de/<slug> resolves immediately on publish — no manual admin
  // step required. Idempotent: re-publishing or seeding leaves any existing
  // link with this code untouched. We avoid `reserveShortCode` here because
  // it throws on collision (re-publish would crash); upsert with `update: {}`
  // is the safer no-op-on-conflict path.
  await prisma.cardLink.upsert({
    where: { code: slug },
    create: {
      orderId,
      code: slug,
      label: "main",
      source: "nfc",
      active: true,
    },
    update: {},
  });

  notifyOrderEvent({
    orderId: order.id,
    orderNumber: order.orderNumber,
    contactName: order.contactName,
    contactEmail: order.contactEmail,
    contactPhone: order.contactPhone,
    callMeBack: order.callMeBack,
    amountCents: order.amountCents,
    billingMode: order.billingMode,
    slug,
    event: "published",
  }).catch((e) => console.error("[order-actions] notification error:", e));

  // Customer "your card is live" email. Errors are logged + swallowed — the
  // publish transition itself has already committed and must not be blocked.
  try {
    const locale = normalizeLocale(order.locale);
    const revisionInput = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      contactName: order.contactName,
      slug,
      editToken: order.editToken ?? "",
      isSubscription:
        order.billingMode === "MONTHLY" || order.billingMode === "YEARLY",
    };
    const html = await renderRevisionReadyHtml(revisionInput, locale);
    const text = renderRevisionReadyText(revisionInput, locale);
    const result = await sendCustomerEmail({
      to: order.contactEmail,
      subject: revisionReadySubject(revisionInput, locale),
      html,
      text,
    });
    if (!result.skipped) {
      console.log(
        `[order-actions] revision-ready email sent to ${order.contactEmail} (${result.messageId ?? "no-id"})`
      );
    }
  } catch (err) {
    console.error("[order-actions] revision-ready email failed:", err);
    Sentry.captureException(err, {
      tags: { area: "customer-email", template: "revision-ready" },
      extra: { orderId: order.id, orderNumber: order.orderNumber },
    });
  }

  return { ok: true, slug };
}
