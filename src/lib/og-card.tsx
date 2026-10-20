// v4 share card (1200×630) for og:image / twitter:image. Rendered by
// src/app/[locale]/opengraph-image.tsx (per locale, referenced by every
// marketing page through pageMetadata) and src/app/opengraph-image.tsx (DE).
// Porcelain + ink + copper ("Licht & Kupfer"), Archivo 800 and IBM Plex Mono read from
// public/ (copied into the standalone image), so Turkish glyphs render.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { L3 } from "@/content/v4/types";
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
