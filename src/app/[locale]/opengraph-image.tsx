// Per-locale v4 share card at /{locale}/opengraph-image. pageMetadata
// (src/lib/seo-v4.ts) names it as og:image and twitter:image on every
// marketing page; app pages under [locale] inherit it as file-based metadata.

import { OG_SIZE, renderOgCard } from "@/lib/og-card";
import { pickLocale } from "@/lib/seo-v4";

export const runtime = "nodejs";
// Same Windows pre-render workaround as src/app/opengraph-image.tsx.
export const dynamic = "force-dynamic";
// Static alt for the file-based (app page) use; marketing pages pass a localized alt.
export const alt = "OpSolid";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OG({ params }: { params: { locale: string } }) {
  return renderOgCard(pickLocale(params.locale));
}
