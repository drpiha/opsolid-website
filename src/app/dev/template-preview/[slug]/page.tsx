// =============================================================================
// /dev/template-preview/[slug] — chrome-less single-template render target.
//
// Phase 7.5 deliverable #1. Renders one v2 template by sample slug at
// production fidelity (440 px card width, white surface, no header / footer /
// analytics) so the Phase 7.5 Puppeteer script can screenshot the article
// element.
//
// Pattern mirrors `/dev/template-gallery` — both are server components that
// look up `templateRegistry` + `cardTemplateSamples` and render the template
// component directly. Templates are client components (`"use client"`) but
// importing and rendering them from a server component is the standard
// Next.js pattern: the registry export is plain data, not a React boundary
// crossing.
//
// Production: returns a 404 in production via `notFound()`. Dev only.
// =============================================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  cardTemplateSamples,
} from "@/config/card-template-samples";
import { getTemplateEntry } from "@/components/cards/templates/v2/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Template Preview · /dev",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TemplatePreviewPage({ params }: PageProps) {
  // Production gate. Mirrors /dev/template-gallery — this route exists only
  // for the Puppeteer thumbnail script and human visual QA in dev.
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { slug } = await params;

  // Reverse lookup: samples are keyed by templateId, but this route is
  // addressed by slug. Linear scan over a 12-entry record is fine.
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
