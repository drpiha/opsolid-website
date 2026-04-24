// =============================================================================
// WhatsApp-optimized OG image — GET /c/[slug]/wa.png
//
// Why a separate route from /c/[slug].png? WhatsApp picks the *first* og:image
// it sees and crops aggressively to a near-square thumbnail (≈400×400) for
// link previews in chats. A 1200×630 image gets cropped to a thin horizontal
// slice and looks awful. This 600×600 1:1 version is offered as a secondary
// `og:image` so WhatsApp picks the square one and the rest of the world keeps
// the wide one.
//
// Composition: stacked layout — avatar at top, name below, QR at bottom.
// All three readable in a small WhatsApp thumbnail.
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

const SIDE = 600;
const FALLBACK_PRIMARY = "#15120F";
const FALLBACK_ACCENT = "#E8A252";

const FONT_STACK =
  '"Instrument Serif", "Georgia", "Times New Roman", serif';
const SANS_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const QR_PIXEL_SIZE = 220;

interface SavedQrStyle {
  preset?: string;
  primary?: string;
  accent?: string;
  withLogo?: boolean;
  withPhoto?: boolean;
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

  const primary = order.brandPrimaryHex ?? FALLBACK_PRIMARY;
  const accent = order.brandAccentHex ?? FALLBACK_ACCENT;

  const siteUrl = getSiteUrl();
  const publicUrl = `${siteUrl}/c/${params.slug}`;

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
      centerImageUrl:
        saved?.withLogo && order.logoPath
          ? absoluteAssetUrl(order.logoPath, siteUrl)
          : saved?.withPhoto && order.photoPath
          ? absoluteAssetUrl(order.photoPath, siteUrl)
          : undefined,
    });
    qrDataUrl = `data:image/png;base64,${bytes.toString("base64")}`;
  } catch (err) {
    console.error("[og:wa] QR render failed:", err);
    qrDataUrl =
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'/%3E";
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: primary,
          color: "#FFFFFF",
          fontFamily: SANS_STACK,
          padding: "40px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(at 50% 0%, ${accent}33 0%, transparent 60%)`,
            display: "flex",
          }}
        />

        {photoUrl ? (
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              overflow: "hidden",
              border: `4px solid ${accent}`,
              display: "flex",
              marginBottom: 16,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt=""
              width={140}
              height={140}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ) : null}

        <div
          style={{
            fontSize: 56,
            lineHeight: 1.05,
            fontFamily: FONT_STACK,
            display: "flex",
            textAlign: "center",
          }}
        >
          {name}
        </div>
        {title ? (
          <div
            style={{
              fontSize: 22,
              marginTop: 8,
              opacity: 0.85,
              display: "flex",
              fontFamily: SANS_STACK,
              textAlign: "center",
            }}
          >
            {title}
          </div>
        ) : null}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 22,
            padding: 16,
            display: "flex",
            border: `4px solid ${accent}`,
            marginTop: 28,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="" width={QR_PIXEL_SIZE} height={QR_PIXEL_SIZE} />
        </div>
      </div>
    ),
    {
      width: SIDE,
      height: SIDE,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    }
  );
}
