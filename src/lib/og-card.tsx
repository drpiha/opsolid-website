// Share cards (1200×630) for og:image / twitter:image, in the v7 "Klarheit" language: porcelain, ink and copper,
// Fraunces Light for the title, Geist Mono for the label, the nested-squares mark bleeding off the right edge.
// - renderPageCard: the card with a page's own headline, rendered by src/app/og/[locale]/[...card]/route.tsx for
//   every marketing page and journal post (seo-v7.ts names it).
// - renderOgCard: the per-locale card (home claim), rendered by src/app/[locale]/opengraph-image.tsx and
//   src/app/opengraph-image.tsx (DE); app pages and the legal pages use it.
// Fonts are read from public/fonts/og (copied into the standalone image) and carry the Turkish letters. Each
// distinct card is rendered once per process and then served from memory: the set of cards is finite.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { L3 } from "@/lib/v7-routes";
import { OG_CLAIM, OG_SIZE, OG_TAGLINE } from "@/lib/seo-v4";

export { OG_SIZE, ogAlt } from "@/lib/seo-v4";

let fonts: Promise<[Buffer, Buffer]> | null = null;
function loadFonts() {
  const dir = join(process.cwd(), "public", "fonts", "og");
  fonts ??= Promise.all([readFile(join(dir, "fraunces-300.woff")), readFile(join(dir, "geist-mono-400.woff"))]).catch((e) => {
    fonts = null; // retry on the next request instead of caching the failure
    throw e;
  });
  return fonts;
}

// v7 tokens (src/styles/opsolid-v7.css).
const V7 = { porcelain: "#F6F2EC", ink: "#16191D", stone: "#6B665F", line: "#E3DCD1", copper: "#B5623A", deep: "#8A4524" };
// The brand mark: four nested rounded squares on a 320 grid (insets 0/30/60/90, radii 84/62/42/24).
const MARK = [
  { inset: 0, r: 84, o: 0.9, w: 3 },
  { inset: 30, r: 62, o: 0.62, w: 2 },
  { inset: 60, r: 42, o: 0.4, w: 2 },
  { inset: 90, r: 24, o: 0.24, w: 2 },
];
// Titles can change, so no year-long immutable cache (the ImageResponse default).
const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

const rendered = new Map<string, ArrayBuffer>();

function png(body: ArrayBuffer): Response {
  return new Response(body, { headers: { "Content-Type": "image/png", "Cache-Control": CACHE_CONTROL } });
}

/** Title size by length: three lines at most for every headline the site has (the longest is about 85 characters). */
function titleSize(title: string): number {
  const n = title.replace(/\n/g, " ").length;
  return n > 90 ? 46 : n > 64 ? 54 : n > 44 ? 64 : 74;
}

/** The card: mono label, the title (a "\n" starts a new line), OpSolid / opsolid.de. */
export async function renderPageCard({ locale, label, title }: { locale: L3; label: string; title: string }): Promise<Response> {
  const key = `${locale}\n${label}\n${title}`;
  const hit = rendered.get(key);
  if (hit) return png(hit);

  const [fraunces, mono] = await loadFonts();
  const scale = 1.25; // mark drawn at 400 px
  const image = new ImageResponse(
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
                border: `${m.w}px solid ${V7.copper}`,
                opacity: m.o,
                display: "flex",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px 64px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Geist Mono", fontSize: 26, letterSpacing: 2, color: V7.stone }}>
            <div style={{ width: 44, height: 2, background: V7.copper, marginRight: 20, display: "flex" }} />
            <div style={{ display: "flex" }}>{label.toLocaleUpperCase(locale)}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 740, fontSize: titleSize(title), lineHeight: 1.06, letterSpacing: -1.5 }}>
            {title.split("\n").map((line) => (
              <div key={line} style={{ display: "flex" }}>
                {line}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ display: "flex", fontSize: 40, letterSpacing: -0.5, color: V7.ink }}>OpSolid</div>
            <div style={{ display: "flex", margin: "0 16px", fontFamily: "Geist Mono", fontSize: 24, color: V7.line }}>/</div>
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 24, letterSpacing: 2, color: V7.deep }}>opsolid.de</div>
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
  const body = await image.arrayBuffer();
  rendered.set(key, body);
  return png(body);
}

/** The per-locale card: the home claim ("Erst der Prozess. / Dann die KI") under the tagline. */
export function renderOgCard(locale: L3): Promise<Response> {
  const claim = OG_CLAIM[locale].replace(/\.$/, "").replace(/\.\s+/, ".\n");
  return renderPageCard({ locale, label: OG_TAGLINE[locale], title: claim });
}
