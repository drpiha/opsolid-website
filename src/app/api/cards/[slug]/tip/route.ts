// =============================================================================
// POST /api/cards/[slug]/tip — visitor taps the tip jar.
//
// Reads `cardData.tipJar.{enabled, stripePriceId}`; refuses when the owner
// isn't Pro (defence in depth — the edit form gates on Pro too) or when
// tipJar is disabled. Creates a one-time Stripe Checkout Session for the
// configured Price and returns the URL.
//
// Public endpoint, IP-rate-limited (visitors are anonymous).
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { hitWindow, clientIp } from "@/lib/auth/rate-limit";
import { isPro } from "@/lib/auth/pro";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;
    const ip = clientIp(req);
    const rl = hitWindow(`tip::${ip}::${slug}`, RATE_MAX, RATE_WINDOW_MS);
    if (!rl.ok) {
      return NextResponse.json(
        { error: { code: "rate_limited", message: "Too many attempts." } },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) },
        },
      );
    }

    const order = await prisma.cardOrder.findUnique({
      where: { slug },
      select: {
        id: true,
        cardData: true,
        status: true,
        userId: true,
        user: { select: { proSince: true } },
      },
    });
    if (!order || order.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: { code: "not_found", message: "Card not found." } },
        { status: 404 },
      );
    }

    // Owner must be Pro for the tip jar to function — defence in depth
    // around the edit form gate.
    if (!order.user || !isPro({ proSince: order.user.proSince })) {
      return NextResponse.json(
        { error: { code: "tip_unavailable", message: "Tipping not available." } },
        { status: 404 },
      );
    }

    const cd = CardDataSchema.safeParse(order.cardData);
    const tipJar =
      cd.success && (cd.data as Record<string, unknown>).tipJar
        ? ((cd.data as Record<string, unknown>).tipJar as {
            enabled?: boolean;
            stripePriceId?: string | null;
          })
        : null;

    if (!tipJar?.enabled || !tipJar.stripePriceId) {
      return NextResponse.json(
        { error: { code: "tip_unavailable", message: "Tipping not configured." } },
        { status: 404 },
      );
    }

    const siteUrl = getSiteUrl().replace(/\/$/, "");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: tipJar.stripePriceId, quantity: 1 }],
      success_url: `${siteUrl}/c/${slug}?tip=ok`,
      cancel_url: `${siteUrl}/c/${slug}?tip=cancel`,
      metadata: {
        kind: "tipJar",
        cardOrderId: order.id,
        slug,
      },
      payment_intent_data: {
        metadata: {
          kind: "tipJar",
          cardOrderId: order.id,
          slug,
        },
      },
    });

    return NextResponse.json(
      { url: session.url },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[cards/:slug/tip] failed:", err);
    return NextResponse.json(
      { error: { code: "server_error", message: "Internal error." } },
      { status: 500 },
    );
  }
}
