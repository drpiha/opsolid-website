// File-based metadata: Next.js 14 picks this up automatically and wires it
// into the root metadata.openGraph.images / twitter.images. Renders a
// 1200×630 PNG with brand styling.

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "OpSolid — Practical Automation & AI Systems for Business Operations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0B0E13 0%, #15120F 55%, #1A0E04 100%)",
          padding: "96px 96px 88px",
          fontFamily: "system-ui",
          position: "relative",
        }}
      >
        {/* Copper accent rail — top-left brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, #E8A252 0%, #C27940 50%, #8C5125 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,240,215,0.55), inset 0 -1px 0 rgba(0,0,0,0.4), 0 8px 32px rgba(194,121,64,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background:
                  "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), transparent 55%), #1A0E04",
                border: "1px solid rgba(0,0,0,0.4)",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#F5F0E8",
              letterSpacing: -1,
            }}
          >
            OpSolid
          </div>
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            color: "#F5F0E8",
            letterSpacing: -3,
            lineHeight: 1.04,
            marginBottom: 24,
            display: "flex",
          }}
        >
          Practical Automation
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 500,
            background:
              "linear-gradient(135deg, #E8A252 0%, #C27940 50%, #8C5125 100%)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: -3,
            lineHeight: 1.04,
            fontStyle: "italic",
            display: "flex",
          }}
        >
          for Business Operations
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 88,
            left: 96,
            right: 96,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#A8A29E",
            fontSize: 22,
            letterSpacing: 0.5,
          }}
        >
          <div style={{ display: "flex" }}>
            Hamburg · Frankfurt · GDPR-native
          </div>
          <div style={{ display: "flex", color: "#C27940", fontWeight: 500 }}>
            opsolid.de
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
