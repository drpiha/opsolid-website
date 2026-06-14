// =============================================================================
// GET /api/cards/[slug]/wallet/apple
//
// Streams a signed `.pkpass` for a published Smart Card. Visitors tap "Add to
// Apple Wallet" → iOS prompts to add the pass; Android downloads the file.
//
// Behavior matrix:
//   - Card not found / not PUBLISHED        → 404
//   - Wallet env vars missing                → 503 wallet_not_configured
//   - Card data invalid (bad JSON in DB)     → 500 invalid_card_data
//   - Signing/build failure                  → 500 internal
//   - Success                                → 200 application/vnd.apple.pkpass
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CardDataSchema, OrderStatus } from "@/lib/validation";
import { buildApplePass } from "@/lib/wallet/apple";
import { WalletNotConfiguredError } from "@/lib/wallet/config";
import { publicCardUrlFor } from "@/lib/card-host";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Resolve the QR target URL baked into the (durable, on-device) wallet pass.
 *   1. Verified custom domain → `https://<domain>/`
 *   2. Otherwise defer to `publicCardUrlFor` — which only emits the pretty
 *      NEXT_PUBLIC_CARD_HOST subdomain when CARD_HOST_VERIFIED=true, else the
 *      always-resolving `${siteUrl}/c/<slug>`. Never encode an unverified host
 *      into a pass: a stale value would 404 forever on the saved pass.
 */
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
    const buffer = await buildApplePass({
      slug: params.slug,
      name: cardData.name,
      title: cardData.title ?? cardData.position,
      company: cardData.company,
      phone: cardData.phone,
      email: cardData.email,
      website: cardData.website,
      primaryHex: order.brandPrimaryHex ?? null,
      accentHex: order.brandAccentHex ?? null,
      cardUrl,
    });

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="${params.slug}.pkpass"`,
        // No-store: a freshly edited card should produce a freshly signed pass.
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (err instanceof WalletNotConfiguredError) {
      return NextResponse.json(
        { error: "wallet_not_configured", provider: err.provider },
        { status: 503 }
      );
    }
    console.error("[wallet/apple] build failed:", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
