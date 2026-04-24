// =============================================================================
// OG share image for a published digital card — GET /c/[slug].png
//
// 1200×630 PNG rendered by next/og. Composition (premium upgrade 2026-04-23):
//   • solid background = brandPrimaryHex (fallback #15120F — ink)
//   • subtle radial gradient overlay at the corners for depth
//   • LEFT: optional avatar (circular, 200px) when photoPath is set,
//           name (big serif), title, company, accent underline, URL footer
//   • RIGHT: customer's chosen QR style fetched from /api/qr/[slug]?logo=1,
//           inside a rounded white panel with a brand-accent border
//
// Caching: s-maxage=60 + stale-while-revalidate so edits propagate within a
// minute without hammering the renderer. Non-PUBLISHED orders return 404
// to avoid leaking pre-publish data.
// =============================================================================

import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { renderQr } from "@/lib/qr/styled-server";
import { absoluteAssetUrl } from "@/lib/storage";
import { getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

const WIDTH = 1200;
const HEIGHT = 630;

// Fallbacks — OpSolid ink + amber from tailwind.config.ts.
const FALLBACK_PRIMARY = "#15120F";
const FALLBACK_ACCENT = "#E8A252";

const FONT_STACK =
  '"Instrument Serif", "Georgia", "Times New Roman", serif';
const SANS_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const QR_PIXEL_SIZE = 320;

interface SavedQrStyle {
  preset?: string;
  primary?: string;
  accent?: string;
  withLogo?: boolean;
  withPhoto?: boolean;
  ai?: { generatedUrl?: string };
  savedUrl?: string;
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const order = await prisma.cardOrder.findUnique({
    where: { slug: params.slug },
  });
  if (!order || order.status !== "PUBLISHED") {
    return new Response("Not found", { status: 404 });
  }

  const parsed = CardDataSchema.safeParse(order.cardData);
  const name = parsed.success ? parsed.data.name : order.contactName;
  const title = parsed.success ? parsed.data.title ?? "" : "";
  const company = parsed.success ? parsed.data.company ?? "" : "";

  const primary = order.brandPrimaryHex ?? FALLBACK_PRIMARY;
  const accent = order.brandAccentHex ?? FALLBACK_ACCENT;

  const siteUrl = getSiteUrl();
  const publicUrl = `${siteUrl}/c/${params.slug}`;

  // Build the QR. We render server-side here (instead of pointing <img> at
  // /api/qr/[slug]) so the OG image is fully self-contained — next/og's image
  // fetcher can be flaky for same-origin URLs during ISR generation.
  const saved = (order.qrStyle ?? null) as SavedQrStyle | null;
  let qrDataUrl: string;
  try {
    const { bytes } = await renderQr({
      data: publicUrl,
      preset: saved?.preset ?? "rounded",
      primary: saved?.primary ?? "#15120F",
      accent: saved?.accent ?? accent,
      format: "png",
      size: QR_PIXEL_SIZE,
      // Centered logo or photo when configured. The QR endpoint mirrors this
      // logic — we keep them in sync so /api/qr and the OG image agree.
      centerImageUrl:
        saved?.withLogo && order.logoPath
          ? absoluteAssetUrl(order.logoPath, siteUrl)
          : saved?.withPhoto && order.photoPath
          ? absoluteAssetUrl(order.photoPath, siteUrl)
          : undefined,
    });
    qrDataUrl = `data:image/png;base64,${bytes.toString("base64")}`;
  } catch (err) {
    console.error("[og] QR render failed, falling back to plain:", err);
    // Final fallback: tiny inline SVG so the image still renders something
    // recognisable rather than a broken OG card.
    qrDataUrl =
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'/%3E";
  }

  const photoUrl = order.photoPath
    ? absoluteAssetUrl(order.photoPath, siteUrl)
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: primary,
          color: "#FFFFFF",
          fontFamily: SANS_STACK,
          padding: "72px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Soft radial accent at top-right and bottom-left for premium depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(at 88% 12%, ${accent}33 0%, transparent 55%), radial-gradient(at 8% 90%, ${accent}22 0%, transparent 55%)`,
            display: "flex",
          }}
        />

        {/* LEFT: identity block (with optional avatar) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: "40px",
            position: "relative",
          }}
        >
          {photoUrl ? (
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                overflow: "hidden",
                marginBottom: 28,
                border: `4px solid ${accent}`,
                display: "flex",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt=""
                width={180}
                height={180}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <div
              style={{
                fontSize: 20,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: 0.7,
                fontFamily: SANS_STACK,
                display: "flex",
              }}
            >
              OpSolid · Digital Card
            </div>
          )}
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              marginTop: photoUrl ? 0 : 24,
              fontFamily: FONT_STACK,
              fontWeight: 400,
              display: "flex",
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: 20,
              height: 4,
              width: 120,
              background: accent,
              borderRadius: 2,
            }}
          />
          {title ? (
            <div
              style={{
                fontSize: 32,
                marginTop: 24,
                opacity: 0.92,
                display: "flex",
                fontFamily: SANS_STACK,
              }}
            >
              {title}
            </div>
          ) : null}
          {company ? (
            <div
              style={{
                fontSize: 24,
                marginTop: 8,
                opacity: 0.7,
                display: "flex",
                fontFamily: SANS_STACK,
              }}
            >
              {company}
            </div>
          ) : null}

          <div
            style={{
              marginTop: "auto",
              fontSize: 18,
              opacity: 0.55,
              display: "flex",
              fontFamily: SANS_STACK,
            }}
          >
            {publicUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>

        {/* RIGHT: QR panel */}
        <div
          style={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 28,
              padding: 24,
              display: "flex",
              border: `6px solid ${accent}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="" width={QR_PIXEL_SIZE} height={QR_PIXEL_SIZE} />
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.75,
              fontFamily: SANS_STACK,
            }}
          >
            Scan to view
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    }
  );
}
