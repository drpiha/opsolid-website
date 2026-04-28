// =============================================================================
// WhatsApp-optimized OG image — GET /c/[slug]/wa.png
//
// Phase 8 redesign: 1080×1350 portrait (4:5). The portrait aspect renders
// big in WhatsApp's link preview because the platform shrinks square images
// aggressively but allocates more vertical space to taller posts. We drop
// the QR (link previews exist to make the link feel personal — the QR has
// its own surface in-app) and let the profile photo + name dominate.
//
// Composition: large circular avatar at top, big serif name below, optional
// title/company, accent hairline near the bottom, small domain footer.
// =============================================================================

import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { absoluteAssetUrl } from "@/lib/storage";
import { getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

const WIDTH = 1080;
const HEIGHT = 1350;
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

  const cardHost =
    process.env.NEXT_PUBLIC_CARD_HOST?.trim() || "card.opsolid.de";
  const displayHost = cardHost.replace(/^https?:\/\//, "");

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
          padding: "80px 60px 60px",
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
            marginTop: 40,
          }}
        >
          {photoUrl ? (
            <div
              style={{
                width: 480,
                height: 480,
                borderRadius: 240,
                overflow: "hidden",
                border: `8px solid ${accent}`,
                display: "flex",
                boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt=""
                width={480}
                height={480}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 480,
                height: 480,
                borderRadius: 240,
                background: `${accent}33`,
                border: `8px solid ${accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_STACK,
                fontSize: 200,
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
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          <div
            style={{
              fontSize: 120,
              lineHeight: 1.02,
              fontFamily: FONT_STACK,
              display: "flex",
              textAlign: "center",
              maxWidth: 960,
            }}
          >
            {name}
          </div>
          {title ? (
            <div
              style={{
                fontSize: 40,
                marginTop: 20,
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
                fontSize: 32,
                marginTop: 10,
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
              width: 120,
              height: 4,
              background: accent,
              borderRadius: 2,
              marginBottom: 22,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 22,
              opacity: 0.55,
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
