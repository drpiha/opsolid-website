// =============================================================================
// WhatsApp-optimized OG image — GET /c/[slug]/wa.png
//
// 720×900 portrait (4:5). The portrait aspect renders big in WhatsApp's link
// preview because the platform shrinks square images aggressively but
// allocates more vertical space to taller posts. We drop the QR (link
// previews exist to make the link feel personal — the QR has its own surface
// in-app) and let the profile photo + name dominate.
//
// IMPORTANT — file size: WhatsApp silently DROPS preview images larger than
// ~300 KB (and caches that failure), leaving only a bare link. next/og emits
// PNG with no quality control, and a photographic avatar pushes a 1080×1350
// canvas to ~434 KB — over the limit. We therefore render at 720×900, which
// keeps the same composition but lands the PNG comfortably under ~250 KB.
// Do NOT bump these dimensions back up without converting the output to JPEG
// (would require adding `sharp`); a larger PNG breaks WhatsApp previews.
//
// Composition: large circular avatar at top, big serif name below, optional
// title/company, accent hairline near the bottom, small domain footer.
// =============================================================================

import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { absoluteAssetUrl } from "@/lib/storage";
import { getSiteUrl } from "@/lib/stripe";
import { publicCardUrlFor } from "@/lib/card-host";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

const WIDTH = 720;
const HEIGHT = 900;
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
  const photoUrl = order.photoPath
    ? absoluteAssetUrl(order.photoPath, siteUrl)
    : null;

  // Footer shows the host of the card's REAL public URL (canonical
  // opsolid.de unless a verified NEXT_PUBLIC_CARD_HOST is configured) so the
  // preview never advertises an address that doesn't resolve.
  const displayHost = new URL(publicCardUrlFor(params.slug)).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          background: primary,
          color: "#FFFFFF",
          fontFamily: SANS_STACK,
          padding: "54px 40px 40px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(at 50% 0%, ${accent}3a 0%, transparent 65%), radial-gradient(at 50% 100%, ${accent}22 0%, transparent 60%)`,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
            marginTop: 28,
          }}
        >
          {photoUrl ? (
            <div
              style={{
                width: 320,
                height: 320,
                borderRadius: 160,
                overflow: "hidden",
                border: `6px solid ${accent}`,
                display: "flex",
                boxShadow: "0 20px 54px rgba(0,0,0,0.45)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt=""
                width={320}
                height={320}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 320,
                height: 320,
                borderRadius: 160,
                background: `${accent}33`,
                border: `6px solid ${accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_STACK,
                fontSize: 134,
                color: accent,
              }}
            >
              {(name ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
            textAlign: "center",
            paddingLeft: 28,
            paddingRight: 28,
          }}
        >
          <div
            style={{
              fontSize: 80,
              lineHeight: 1.02,
              fontFamily: FONT_STACK,
              display: "flex",
              textAlign: "center",
              maxWidth: 640,
            }}
          >
            {name}
          </div>
          {title ? (
            <div
              style={{
                fontSize: 28,
                marginTop: 14,
                opacity: 0.9,
                display: "flex",
                fontFamily: SANS_STACK,
                textAlign: "center",
                letterSpacing: "0.01em",
              }}
            >
              {title}
            </div>
          ) : null}
          {company ? (
            <div
              style={{
                fontSize: 22,
                marginTop: 8,
                opacity: 0.65,
                display: "flex",
                fontFamily: SANS_STACK,
                textAlign: "center",
              }}
            >
              {company}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 16,
              opacity: 0.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              display: "flex",
              fontFamily: SANS_STACK,
            }}
          >
            {displayHost}
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
