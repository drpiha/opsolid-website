// Share cards (1200×630) for og:image / twitter:image.
// - renderOgCard: the per-locale card, rendered by src/app/[locale]/opengraph-image.tsx and
//   src/app/opengraph-image.tsx (DE); app pages and the legal pages use it.
// - renderPageCard: the v7 card with the page's own title, rendered by src/app/og/[locale]/[...card]/route.tsx
//   for every marketing page and journal post (seo-v7.ts names it).
// Fonts are read from public/fonts/og (copied into the standalone image), so Turkish glyphs render.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { L3 } from "@/lib/v7-routes";
import { OG_CLAIM, OG_SIZE, OG_TAGLINE } from "@/lib/seo-v4";

export { OG_SIZE, ogAlt } from "@/lib/seo-v4";

let fonts: Promise<[Buffer, Buffer]> | null = null;
function loadFonts() {
  const dir = join(process.cwd(), "public", "fonts", "og");
  fonts ??= Promise.all([readFile(join(dir, "archivo-800-semiexpanded.ttf")), readFile(join(dir, "ibm-plex-mono-500.ttf"))]).catch((e) => {
    fonts = null; // retry on the next request instead of caching the failure
    throw e;
  });
  return fonts;
}

const BG = "#F5F3EF";
const INK = "#15130F";
const INK2 = "#4E4943";
const LINE = "#E2DED6";
const CU = "#C27940";
const CU_INK = "#8F4F1E";

export async function renderOgCard(locale: L3): Promise<ImageResponse> {
  const [archivo, mono] = await loadFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 88px 72px",
          background: BG,
          color: INK,
          fontFamily: "Archivo",
          position: "relative",
        }}
      >
        {/* Rounded porcelain panel with a copper plate, like the hero. */}
        <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: `1px solid ${LINE}`, borderRadius: 36, display: "flex" }} />
        <div style={{ position: "absolute", top: 64, right: 72, width: 150, height: 150, borderRadius: 34, background: CU, transform: "rotate(18deg)", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "Plex Mono", fontSize: 22, letterSpacing: 3, color: INK2 }}>
          <div style={{ width: 14, height: 14, background: CU, display: "flex" }} />
          <div style={{ display: "flex" }}>{OG_TAGLINE[locale].toLocaleUpperCase(locale)}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, lineHeight: 1, letterSpacing: -4 }}>OpSolid</div>
          <div style={{ display: "flex", width: 120, height: 3, background: CU, margin: "34px 0 30px" }} />
          <div style={{ display: "flex", maxWidth: 980, fontSize: 52, lineHeight: 1.12, letterSpacing: -1, color: INK }}>{OG_CLAIM[locale]}</div>
        </div>

        <div style={{ display: "flex", fontFamily: "Plex Mono", fontSize: 24, letterSpacing: 2, color: CU_INK }}>opsolid.de</div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo", data: archivo, weight: 800, style: "normal" },
        { name: "Plex Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}

let v7Fonts: Promise<[Buffer, Buffer]> | null = null;
function loadV7Fonts() {
  const dir = join(process.cwd(), "public", "fonts", "og");
  v7Fonts ??= Promise.all([readFile(join(dir, "fraunces-300.woff")), readFile(join(dir, "geist-mono-400.woff"))]).catch((e) => {
    v7Fonts = null;
    throw e;
  });
  return v7Fonts;
}

// v7 "Klarheit" tokens (src/styles/opsolid-v7.css).
const V7 = { porcelain: "#F6F2EC", ink: "#16191D", stone: "#6B665F", line: "#E3DCD1", copper: "#B5623A", deep: "#8A4524" };
// The brand mark: four nested rounded squares on a 320 grid (insets 0/30/60/90, radii 84/62/42/24).
const MARK = [
  { inset: 0, r: 84, o: 0.9 },
  { inset: 30, r: 62, o: 0.62 },
  { inset: 60, r: 42, o: 0.4 },
  { inset: 90, r: 24, o: 0.24 },
];

/**
 * The v7 share card: mono label, the page title in Fraunces Light (a "\n" in the title starts a new line),
 * the nested-squares mark bleeding off the right edge, OpSolid / opsolid.de.
 */
export async function renderPageCard({ locale, label, title }: { locale: L3; label: string; title: string }): Promise<ImageResponse> {
  const [fraunces, mono] = await loadV7Fonts();
  const size = title.length > 64 ? 54 : title.length > 44 ? 64 : 74;
  const scale = 1.25; // mark drawn at 400 px
  const res = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: V7.porcelain, color: V7.ink, position: "relative", fontFamily: "Fraunces" }}>
        <div style={{ position: "absolute", top: 115, right: -90, width: 320 * scale, height: 320 * scale, display: "flex" }}>
          {MARK.map((m) => (
            <div
              key={m.inset}
              style={{
                position: "absolute",
                top: m.inset * scale,
                left: m.inset * scale,
                width: (320 - 2 * m.inset) * scale,
                height: (320 - 2 * m.inset) * scale,
                borderRadius: m.r * scale,
                border: `2px solid ${V7.copper}`,
                opacity: m.o,
                display: "flex",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "76px 80px 68px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 2, color: V7.stone }}>
            <div style={{ width: 44, height: 2, background: V7.copper, marginRight: 20, display: "flex" }} />
            <div style={{ display: "flex" }}>{label.toLocaleUpperCase(locale)}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 700, fontSize: size, lineHeight: 1.06, letterSpacing: -1.5 }}>
            {title.split("\n").map((line) => (
              <div key={line} style={{ display: "flex" }}>
                {line}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Geist Mono", fontSize: 24, letterSpacing: 2, color: V7.deep }}>
            <div style={{ display: "flex" }}>OpSolid</div>
            <div style={{ display: "flex", margin: "0 16px", color: V7.line }}>/</div>
            <div style={{ display: "flex" }}>opsolid.de</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 300, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
  // Titles can change, so no year-long immutable cache (the ImageResponse default; the headers option appends).
  res.headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
  return res;
}
