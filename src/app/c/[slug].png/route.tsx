// =============================================================================
// OG share image for a published digital card — GET /c/[slug].png
//
// 1200×630 PNG rendered by next/og. Composition:
//   • solid background = brandPrimaryHex (fallback #15120F — ink)
//   • left half: name (big serif-alike), title (medium), company (small),
//     with a 4-px underline in brandAccentHex beneath the name
//   • right side: white QR of the public URL, 320×320 inside a rounded
//     white "card" panel with a thin shadow-ish border, small "Scan to view"
//     caption beneath
//   • bottom-left caption: domain and "Digital Card by OpSolid"
//
// No external fonts — we lean on a system serif + sans stack via inline CSS.
// This keeps the route fast and avoids any network fetch at render time.
//
// Caching: s-maxage=60 + stale-while-revalidate so edits propagate within a
// minute without hammering the renderer. Non-PUBLISHED orders return 404
// to avoid leaking pre-publish data (the card data is still in the DB but
// the public page 404s until the designer publishes).
// =============================================================================

import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
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

  // QR as a data URL — embedded as <img> in the ImageResponse.
  const qrDataUrl = await QRCode.toDataURL(publicUrl, {
    margin: 1,
    width: 320,
    color: { dark: "#15120F", light: "#FFFFFF" },
  });

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
        }}
      >
        {/* LEFT: identity block */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: "40px",
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.7,
              fontFamily: SANS_STACK,
            }}
          >
            OpSolid · Digital Card
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.05,
              marginTop: 24,
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
                fontSize: 36,
                marginTop: 28,
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
                fontSize: 26,
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
            <img src={qrDataUrl} alt="" width={320} height={320} />
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
