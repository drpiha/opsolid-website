// =============================================================================
// GET /api/cards/[slug]/wallet/google
//
// Builds a Google Wallet "Save to Wallet" JWT for a published Smart Card and
// 302-redirects the visitor to `https://pay.google.com/gp/v/save/${jwt}`.
//
// Behavior matrix:
//   - Card not found / not PUBLISHED        → 404 JSON
//   - Wallet env vars missing                → 503 wallet_not_configured
//   - Card data invalid                      → 500 invalid_card_data
//   - JWT build/sign failure                 → 500 internal
//   - Success                                → 302 → pay.google.com
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CardDataSchema, OrderStatus } from "@/lib/validation";
import { buildGoogleWalletJwt } from "@/lib/wallet/google";
import { WalletNotConfiguredError } from "@/lib/wallet/config";
import { publicCardUrlFor } from "@/lib/card-host";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Resolve the QR target baked into the (durable) wallet pass. Verified custom
// domain wins; otherwise defer to publicCardUrlFor, which only emits the pretty
// NEXT_PUBLIC_CARD_HOST subdomain when CARD_HOST_VERIFIED=true and never bakes
// an unverified (potentially dead) host into a saved pass.
function resolveCardUrl(args: {
  slug: string;
  customDomain: string | null;
  customDomainVerified: boolean;
}): string {
  if (args.customDomain && args.customDomainVerified) {
    return `https://${args.customDomain}/`;
  }
  return publicCardUrlFor(args.slug);
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const order = await prisma.cardOrder.findUnique({
    where: { slug: params.slug },
  });

  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const parsed = CardDataSchema.safeParse(order.cardData);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_card_data" }, { status: 500 });
  }
  const cardData = parsed.data;

  const cardUrl = resolveCardUrl({
    slug: params.slug,
    customDomain: order.customDomain,
    customDomainVerified: order.customDomainVerified,
  });

  try {
    const jwt = await buildGoogleWalletJwt({
      slug: params.slug,
      name: cardData.name,
      title: cardData.title ?? cardData.position,
      company: cardData.company,
      phone: cardData.phone,
      email: cardData.email,
      website: cardData.website,
      primaryHex: order.brandPrimaryHex ?? null,
      cardUrl,
      photoPath: order.photoPath ?? null,
      logoPath: order.logoPath ?? null,
    });

    const saveUrl = `https://pay.google.com/gp/v/save/${jwt}`;
    // 302 is intentional — we never want this URL cached: the JWT has an
    // `iat` claim, and Google rejects stale tokens after a window.
    return NextResponse.redirect(saveUrl, { status: 302 });
  } catch (err) {
    if (err instanceof WalletNotConfiguredError) {
      return NextResponse.json(
        { error: "wallet_not_configured", provider: err.provider },
        { status: 503 }
      );
    }
    console.error("[wallet/google] build failed:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
