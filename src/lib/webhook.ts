// =============================================================================
// CRM webhook dispatcher (Phase 6 — outbound).
//
// Each card order can register one or more webhook subscriptions in
// `card_webhooks`. When a `lead.created` or `connection.created` event happens
// on the card, we POST a signed JSON envelope to every active subscription
// whose `events` array contains the event.
//
// Design rules:
//   * Fire-and-forget — callers MUST `void dispatchWebhook(...)`. We never
//     throw; we never block the user request. Failures land in Sentry as
//     captured exceptions.
//   * 5-second deadline per delivery via AbortController. Slow consumers must
//     not stall the originating /api/cards/[slug]/lead request.
//   * HMAC-SHA256 over the JSON body, hex digest, sent as
//     `X-OpSolid-Signature: sha256=<hex>`. The receiver verifies with the
//     subscription's `secret` (shown ONCE at creation time, see admin route).
//   * Idempotency: each delivery carries a UUID in `X-OpSolid-Delivery` and in
//     the envelope's `delivery` field, so receivers can de-dupe across retries.
//
// We update `lastDeliveryAt` / `lastDeliveryStatus` best-effort after every
// attempt; an update failure is swallowed (we don't want bookkeeping to mask
// the original delivery failure).
// =============================================================================

import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

export type WebhookEvent = "lead.created" | "connection.created";

export interface WebhookEnvelope<T = unknown> {
  event: WebhookEvent;
  delivery: string;
  deliveredAt: string;
  data: T;
}

const DELIVERY_TIMEOUT_MS = 5_000;

/**
 * Fan out a webhook event to every active subscription on the order.
 * Returns immediately; deliveries run in the background via Promise.allSettled.
 *
 * Callers should invoke as `void dispatchWebhook(...)` — we never throw.
 */
export function dispatchWebhook<T>(
  orderId: string,
  event: WebhookEvent,
  data: T,
): void {
  // Wrap the entire pipeline in a try/catch so a thrown query / unexpected
  // bug never escapes to the caller. Even the `prisma.findMany` failure path
  // must not surface — webhooks are non-critical.
  void (async () => {
    try {
      const subscriptions = await prisma.cardWebhook.findMany({
        where: {
          orderId,
          active: true,
          // Postgres `has` on a String[] column — Prisma compiles to `@>`.
          events: { has: event },
        },
        select: { id: true, url: true, secret: true },
      });

      if (subscriptions.length === 0) return;

      const envelope: WebhookEnvelope<T> = {
        event,
        delivery: crypto.randomUUID(),
        deliveredAt: new Date().toISOString(),
        data,
      };

      // Body is shared across subscriptions. We re-use the JSON string but
      // each subscription gets its own HMAC signature with its own secret.
      const body = JSON.stringify(envelope);

      await Promise.allSettled(
        subscriptions.map((sub) => deliverOne(sub, envelope.delivery, body, event)),
      );
    } catch (err) {
      Sentry.captureException(err, {
        tags: { surface: "webhook.dispatch", event },
        extra: { orderId },
      });
    }
  })();
}

async function deliverOne(
  sub: { id: string; url: string; secret: string },
  deliveryId: string,
  body: string,
  event: WebhookEvent,
): Promise<void> {
  const signature = crypto
    .createHmac("sha256", sub.secret)
    .update(body)
    .digest("hex");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);

  let status: number | null = null;
  try {
    const res = await fetch(sub.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "OpSolid-Webhook/1.0",
        "X-OpSolid-Event": event,
        "X-OpSolid-Signature": `sha256=${signature}`,
        "X-OpSolid-Delivery": deliveryId,
      },
      body,
      signal: controller.signal,
      // Avoid Next.js fetch caching for outbound POSTs — this is an external
      // side-effect, not a data load.
      cache: "no-store",
    });
    status = res.status;

    // 4xx/5xx is a delivery failure for observability purposes, even though
    // the network call technically completed. Surface in Sentry so admin
    // can see broken endpoints.
    if (!res.ok) {
      Sentry.captureMessage(
        `webhook non-2xx response (${res.status}) for ${sub.url}`,
        {
          level: "warning",
          tags: { surface: "webhook.delivery", event },
          extra: { webhookId: sub.id, status: res.status },
        },
      );
    }
  } catch (err) {
    Sentry.captureException(err, {
      tags: { surface: "webhook.delivery", event },
      extra: { webhookId: sub.id, url: sub.url },
    });
  } finally {
    clearTimeout(timeout);
  }

  // Best-effort delivery bookkeeping. A failure here is non-fatal; we already
  // captured the original error above (if any) and the receiver doesn't care.
  await prisma.cardWebhook
    .update({
      where: { id: sub.id },
      data: {
        lastDeliveryAt: new Date(),
        lastDeliveryStatus: status,
      },
    })
    .catch(() => {
      /* swallow — bookkeeping is best-effort */
    });
}

/**
 * Verify an inbound `X-OpSolid-Signature: sha256=<hex>` header against the
 * raw request body. Exposed for documentation, tests, and any future
 * inbound surface that wants to dog-food the same algorithm.
 *
 * Uses `crypto.timingSafeEqual` to avoid leaking signature byte-by-byte
 * comparison timing.
 */
export function verifyWebhookSignature(
  secret: string,
  body: string,
  signatureHeader: string | null | undefined,
): boolean {
  if (!signatureHeader) return false;

  // Header format: `sha256=<hex>`. Tolerate missing prefix for forward-compat.
  const provided = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : signatureHeader;

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");

  // timingSafeEqual requires equal-length buffers; bail early on length
  // mismatch (which is itself a leak-safe fast path for obviously bad sigs).
  if (provided.length !== expected.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(provided, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}
