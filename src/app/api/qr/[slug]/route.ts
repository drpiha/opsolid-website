// =============================================================================
// GET /api/qr/[slug]?style=rounded&logo=1&primary=15120F&accent=E8A252&format=png
//
// Streams a styled QR code for the published card at /c/[slug]. Style + colors
// can be overridden via query for one-off renders (e.g. WhatsApp 1:1 OG with
// a different palette than the saved one), or omitted to use the order's
// persisted `qrStyle`.
//
// Output: image/png by default, image/svg+xml when ?format=svg.
//
// Center overlay: when ?logo=1 is set we use the order's logoPath; when ?photo=1
// we use photoPath. They're mutually exclusive (logo wins if both set).
//
// Caching: aggressive (5min s-maxage) — the QR rarely changes once published,
// and edits flow through `revalidateTag('card-${slug}')`.
// =============================================================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/lib/validation";
import { renderQr } from "@/lib/qr/styled-server";
import { absoluteAssetUrl } from "@/lib/storage";
import { getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SavedQrStyle {
  preset?: string;
  primary?: string;
  accent?: string;
  withLogo?: boolean;
  withPhoto?: boolean;
  ai?: { generatedUrl?: string };
  // Set after the customer confirms a client-rendered QR — the QR endpoint
  // 302-redirects to this so OG/share images show the exact same artwork.
  savedUrl?: string;
}

function pickHex(query: string | null, fallback?: string | null): string | undefined {
  if (!query) return fallback ?? undefined;
  const cleaned = query.replace(/^#/, "").trim();
  return /^[0-9a-fA-F]{6}$/.test(cleaned) ? `#${cleaned}` : fallback ?? undefined;
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { searchParams } = new URL(req.url);

  const order = await prisma.cardOrder.findUnique({
    where: { slug: params.slug },
  });
  if (!order || order.status !== OrderStatus.PUBLISHED) {
    return new NextResponse("Not found", { status: 404 });
  }

  const saved = (order.qrStyle ?? null) as SavedQrStyle | null;

  // Fast path 1: AI Art QR (Replicate-generated PNG already in storage).
  // We let the client request it explicitly via ?ai=1 to avoid surprise
  // redirects when a designer or admin grabs the "raw" QR.
  if (searchParams.get("ai") === "1" && saved?.ai?.generatedUrl) {
    return NextResponse.redirect(saved.ai.generatedUrl, 302);
  }

  // Fast path 2: client-rendered + saved QR (the "real" customer QR).
  // Skip when the caller is asking for a one-off override (any style/color
  // query param signals "render fresh, not the saved one").
  const wantsOverride =
    searchParams.has("style") ||
    searchParams.has("primary") ||
    searchParams.has("accent") ||
    searchParams.has("format");
  if (!wantsOverride && saved?.savedUrl) {
    return NextResponse.redirect(saved.savedUrl, 302);
  }

  // Slow path: server-render fresh. Resolve preset + colors from query first,
  // then fall back to the saved style, then to defaults inside `renderQr`.
  const preset = searchParams.get("style") ?? saved?.preset ?? "rounded";
  const primary =
    pickHex(searchParams.get("primary"), saved?.primary ?? order.brandPrimaryHex) ??
    undefined;
  const accent =
    pickHex(searchParams.get("accent"), saved?.accent ?? order.brandAccentHex) ??
    undefined;
  const format = searchParams.get("format") === "svg" ? "svg" : "png";
  const sizeParam = parseInt(searchParams.get("size") ?? "", 10);
  const size = Number.isFinite(sizeParam) && sizeParam > 0 && sizeParam <= 1024
    ? sizeParam
    : undefined;

  // Center overlay: prefer logo, fall back to photo. Caller controls with
  // ?logo=1 / ?photo=1, but we also honour the persisted preferences.
  const wantsLogo =
    searchParams.get("logo") === "1" ||
    (searchParams.get("logo") === null && saved?.withLogo);
  const wantsPhoto =
    !wantsLogo &&
    (searchParams.get("photo") === "1" ||
      (searchParams.get("photo") === null && saved?.withPhoto));

  const siteUrl = getSiteUrl();
  let centerImageUrl: string | undefined;
  if (wantsLogo && order.logoPath) {
    centerImageUrl = absoluteAssetUrl(order.logoPath, siteUrl);
  } else if (wantsPhoto && order.photoPath) {
    centerImageUrl = absoluteAssetUrl(order.photoPath, siteUrl);
  }

  const data = `${siteUrl}/c/${params.slug}`;

  try {
    const { bytes, contentType } = await renderQr({
      data,
      preset,
      primary,
      accent,
      format,
      centerImageUrl,
      size,
    });
    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // 5 min CDN, 1h SWR — a typical user shares the card a few times in
        // quick succession; we want the second share to hit cache.
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("[qr] render failed:", err);
    return new NextResponse("QR render failed", { status: 500 });
  }
}
