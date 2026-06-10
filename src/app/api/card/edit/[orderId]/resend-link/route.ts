// =============================================================================
// POST /api/card/edit/[orderId]/resend-link — lost edit-link recovery.
//
// Body-less. Emails the card-live message (public URL + edit link) to the
// order's STORED contact email — the token is never returned in the response
// and never sent anywhere the caller chooses. Responds { ok: true } for every
// non-429 outcome (unknown order, archived order, missing SMTP) so the
// endpoint can't be used to enumerate order IDs.
//
// Rate limits (in-memory, single-container topology — see rate-limit.ts):
//   • 5/hour per client IP
//   • 3/hour per order id (even from rotating IPs)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { sendCustomerEmail } from "@/lib/email/send";
import { normalizeLocale, siteBase } from "@/lib/email/shell";
import {
  cardLiveSubject,
  renderCardLiveHtml,
  renderCardLiveText,
} from "@/lib/email/templates/card-live";

export const runtime = "nodejs";

const HOUR = 60 * 60 * 1000;

// Only PUBLISHED orders have a slug (the card-live email embeds the public
// URL). Concierge orders mid-design keep their confirmation-email channel.
const RESENDABLE_STATUSES = new Set<string>([OrderStatus.PUBLISHED]);

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const ipLimit = hitWindow(`resend:ip:${clientIp(req)}`, 5, HOUR);
  const orderLimit = hitWindow(`resend:order:${params.orderId}`, 3, HOUR);
  if (!ipLimit.ok || !orderLimit.ok) {
    const retryAfter =
      Math.max(ipLimit.retryAfterSeconds ?? 0, orderLimit.retryAfterSeconds ?? 0) || 60;
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  // Everything below intentionally collapses to { ok: true } — no enumeration.
  try {
    const order = await prisma.cardOrder.findUnique({
      where: { id: params.orderId },
      select: {
        id: true,
        slug: true,
        status: true,
        editToken: true,
        contactName: true,
        contactEmail: true,
        locale: true,
      },
    });

    if (
      order &&
      order.editToken &&
      order.contactEmail &&
      order.slug &&
      RESENDABLE_STATUSES.has(order.status)
    ) {
      const locale = normalizeLocale(order.locale);
      const liveInput = {
        orderId: order.id,
        contactName: order.contactName,
        cardUrl: `${siteBase()}/c/${order.slug}`,
        editToken: order.editToken,
        locale,
      };
      const result = await sendCustomerEmail({
        to: order.contactEmail,
        subject: cardLiveSubject(locale),
        html: renderCardLiveHtml(liveInput),
        text: renderCardLiveText(liveInput),
      });
      if (!result.skipped) {
        console.log(
          `[resend-link] edit link re-sent for order ${order.id} to stored contact email`
        );
      }
    }
  } catch (err) {
    // Log, but still answer ok — the caller learns nothing from failures.
    console.error("[resend-link] failed:", err);
  }

  return NextResponse.json({ ok: true });
}
