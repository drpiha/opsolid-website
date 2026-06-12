// =============================================================================
// 9:16 story-format share card — GET /c/[slug]/story.png
//
// 1080×1920, the size of a WhatsApp status / Instagram story / phone screen.
// Unlike wa.png (link-preview thumbnail at the platform's mercy), this image
// is meant to be SENT AS A FILE: the ShareDrawer's WhatsApp action attaches
// it via the Web Share API so the recipient sees a full-screen business card
// — photo, name, title, company — plus a scannable QR and the card URL.
//
// Composition: framed card panel on the brand-primary backdrop. Avatar (or
// initial) with accent ring → serif name → title/company → accent divider →
// QR in a white rounded tile → URL + "scan to view" footer.
//
// Self-contained like og.png: the QR is embedded as a data URL so next/og
// never has to fetch a second route.
// =============================================================================

import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { CardDataSchema } from "@/lib/validation";
import { absoluteAssetUrl } from "@/lib/storage";
import { getSiteUrl } from "@/lib/stripe";
import { renderQr } from "@/lib/qr/styled-server";
import { publicCardDisplayFor, publicCardUrlFor } from "@/lib/card-host";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

const WIDTH = 1080;
const HEIGHT = 1920;
const FALLBACK_PRIMARY = "#15120F";
const FALLBACK_ACCENT = "#E8A252";

const FONT_STACK = '"Instrument Serif", "Georgia", "Times New Roman", serif';
const SANS_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

interface SavedQrStyle {
  preset?: string;
  primary?: string;
  accent?: string;
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
  const website = parsed.success ? parsed.data.website ?? "" : "";

  const primary = order.brandPrimaryHex ?? FALLBACK_PRIMARY;
  const accent = order.brandAccentHex ?? FALLBACK_ACCENT;

  const siteUrl = getSiteUrl();
  const photoUrl = order.photoPath
    ? absoluteAssetUrl(order.photoPath, siteUrl)
    : null;

  // Canonical opsolid.de/c/<slug> unless a verified NEXT_PUBLIC_CARD_HOST is
  // set — see src/lib/card-host.ts for why the bare subdomain fallback broke.
  const cardUrl = publicCardUrlFor(params.slug);
  const cardDisplay = publicCardDisplayFor(params.slug);

  // QR embedded as data URL — same approach as og.png so the image is
  // self-contained. Plain dark-on-white for maximum scanner compatibility.
  const saved = (order.qrStyle ?? null) as SavedQrStyle | null;
  let qrDataUrl: string | null = null;
  try {
    const { bytes } = await renderQr({
      data: cardUrl,
      preset: saved?.preset,
      primary: "#111111",
      accent: "#111111",
      format: "png",
      size: 560,
    });
    qrDataUrl = `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    // QR is an enhancement — the URL footer still identifies the card.
    qrDataUrl = null;
  }

  const displayWebsite = website
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: primary,
          padding: 56,
          boxSizing: "border-box",
          position: "relative",
          fontFamily: SANS_STACK,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(at 50% 0%, ${accent}38 0%, transparent 60%), radial-gradient(at 50% 100%, ${accent}1f 0%, transparent 55%)`,
            display: "flex",
          }}
        />

        {/* card panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 48,
            border: `2px solid ${accent}55`,
            background: "rgba(255,255,255,0.045)",
            padding: "88px 56px 72px",
            color: "#FFFFFF",
            zIndex: 1,
          }}
        >
          {/* avatar + identity */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {photoUrl ? (
              <div
                style={{
                  width: 400,
                  height: 400,
                  borderRadius: 200,
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
                  width={400}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: 400,
                  height: 400,
                  borderRadius: 200,
                  background: `${accent}33`,
                  border: `8px solid ${accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_STACK,
                  fontSize: 170,
                  color: accent,
                }}
              >
                {(name ?? "?").charAt(0).toUpperCase()}
              </div>
            )}

            <div
              style={{
                fontSize: 96,
                lineHeight: 1.04,
                fontFamily: FONT_STACK,
                display: "flex",
                textAlign: "center",
                maxWidth: 900,
                marginTop: 64,
              }}
            >
              {name}
            </div>
            {title ? (
              <div
                style={{
                  fontSize: 40,
                  marginTop: 24,
                  opacity: 0.92,
                  display: "flex",
                  textAlign: "center",
                  maxWidth: 880,
                }}
              >
                {title}
              </div>
            ) : null}
            {company ? (
              <div
                style={{
                  fontSize: 34,
                  marginTop: 12,
                  opacity: 0.68,
                  display: "flex",
                  textAlign: "center",
                  maxWidth: 880,
                }}
              >
                {company}
              </div>
            ) : null}
            {displayWebsite ? (
              <div
                style={{
                  fontSize: 28,
                  marginTop: 28,
                  color: accent,
                  display: "flex",
                  letterSpacing: "0.04em",
                }}
              >
                {displayWebsite}
              </div>
            ) : null}
          </div>

          {/* divider */}
          <div
            style={{
              width: 180,
              height: 4,
              borderRadius: 2,
              background: accent,
              display: "flex",
            }}
          />

          {/* QR + URL footer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {qrDataUrl ? (
              <div
                style={{
                  width: 340,
                  height: 340,
                  borderRadius: 36,
                  background: "#FFFFFF",
                  border: `4px solid ${accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 22,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt=""
                  width={296}
                  height={296}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ) : null}
            <div
              style={{
                fontSize: 30,
                marginTop: 36,
                display: "flex",
                opacity: 0.95,
              }}
            >
              {cardDisplay}
            </div>
            <div
              style={{
                fontSize: 22,
                marginTop: 14,
                opacity: 0.5,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              OpSolid · Smart Card
            </div>
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
