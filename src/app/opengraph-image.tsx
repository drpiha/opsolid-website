// File-based metadata for routes outside [locale]: the v4 share card in German.
// Marketing pages reference the per-locale card (src/app/[locale]/opengraph-image.tsx)
// explicitly through pageMetadata; see src/lib/og-card.tsx.

import { OG_SIZE, ogAlt, renderOgCard } from "@/lib/og-card";

export const runtime = "nodejs";
// `@vercel/og` 0.7.x has a pre-render bug on Windows where `fileURLToPath(join(import.meta.url, "../noto-sans.ttf"))`
// throws `TypeError: Invalid URL`, blocking the entire production build. Forcing dynamic
// generation skips static export and renders the image on first request instead.
export const dynamic = "force-dynamic";
export const alt = ogAlt("de");
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OG() {
  return renderOgCard("de");
}
