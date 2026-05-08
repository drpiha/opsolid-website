// =============================================================================
// /dev/template-preview/[slug] — chrome-less single-template render target.
//
// Phase 7.5 / Sprint F1. Renders one v2 template by sample slug at production
// fidelity (440 px card width, white surface, no header / footer / analytics)
// so the puppeteer preview script can screenshot the article element.
//
// MUST be a client component — `cardTemplateSamples` re-exports references
// originating from `"use client"` template modules (Clinic.tsx, etc.). RSC
// will not let a server component dot into those exports ("Cannot access X
// on the server"), which silently 404s every template except the one whose
// sample is defined inline in `card-template-samples.ts` (id=1, RealEstate).
// Switching to a client page reads the values directly in the browser /
// puppeteer renderer, sidestepping the RSC boundary.
//
// Production: returns 404 via `notFound()`. Dev only.
// =============================================================================

"use client";

import { notFound, useParams } from "next/navigation";
import {
  cardTemplateSamples,
} from "@/config/card-template-samples";
import { getTemplateEntry } from "@/components/cards/templates/v2/registry";

export default function TemplatePreviewPage() {
  // Production gate. The route file is reachable in any build, but the dev
  // gallery + thumbnail script are the only intended consumers.
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  // Reverse lookup: samples are keyed by templateId, addressed by slug here.
  // Linear scan over a 96-entry record is cheap.
  const sample = Object.values(cardTemplateSamples).find(
    (s) => s.slug === slug,
  );
  if (!sample) notFound();

  const entry = getTemplateEntry(sample.templateId);
  if (!entry) notFound();

  const Template = entry.Component;

  return (
    <main className="flex justify-center p-0 bg-white min-h-screen">
      <div className="w-full max-w-[440px]">
        <Template
          slug={sample.slug}
          cardData={sample.cardData}
          photoPath={sample.photoUrl ?? null}
          logoPath={sample.logoUrl ?? null}
          brandPrimaryHex={
            sample.brandPrimaryHex ?? entry.defaults.brandPrimaryHex
          }
          brandAccentHex={
            sample.brandAccentHex ?? entry.defaults.brandAccentHex
          }
          siteUrl="https://mayai.de"
          locale="de"
          source={{ src: "preview" }}
        />
      </div>
    </main>
  );
}
