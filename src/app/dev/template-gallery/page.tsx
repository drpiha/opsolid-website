// =============================================================================
// /dev/template-gallery — render every v2 template at production size.
//
// Not linked from anywhere; reachable by typing the URL. Used to eyeball the
// full Phase 7 line-up as templates land — when all 12 are wired up, this is
// the human visual QA matrix (render at 375 / 1440 in viewport tools).
//
// Production: returns a 404 in production via `notFound()`. Dev only.
// =============================================================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  templateRegistry,
  getTemplateEntry,
} from "@/components/cards/templates/v2/registry";
import { getTemplateSample } from "@/config/card-template-samples";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Template Gallery · /dev",
  robots: { index: false, follow: false },
};

export default function TemplateGalleryPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const entries = Object.values(templateRegistry).sort((a, b) => a.id - b.id);

  return (
    <main className="min-h-screen bg-[#f0eee6]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <header className="mb-12 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/55">
            /dev/template-gallery
          </p>
          <h1 className="mt-2 text-[2rem] font-bold leading-tight tracking-tight text-ink">
            Phase 7 v2 templates
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Every entry in <code className="font-mono text-xs text-ink">templateRegistry</code> rendered at
            production fidelity (max 460 px wide) with curated sample data.
            Resize to 375 px and 1440 px to verify mobile + desktop framing.
            Wallet slot is rendered as a placeholder so the layout reflects the
            production rhythm.
          </p>
        </header>

        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => {
            const sample = getTemplateSample(entry.id);
            const resolved = getTemplateEntry(entry.id);
            if (!sample || !resolved) {
              return (
                <div
                  key={entry.id}
                  className="rounded-3xl border border-dashed border-ink/30 bg-white p-8 text-center"
                >
                  <p className="text-sm text-ink/60">
                    Missing sample data for id={entry.id} ({entry.key}).
                  </p>
                </div>
              );
            }
            const Template = resolved.Component;
            return (
              <article key={entry.id} className="space-y-4">
                <header className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/55">
                      #{String(entry.id).padStart(2, "0")} · {entry.key}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-ink">
                      {entry.name}
                    </h2>
                    <p className="text-xs text-ink/55">{entry.industry}</p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
                    style={{
                      background: `${entry.defaults.brandAccentHex}1A`,
                      color: entry.defaults.brandAccentHex,
                    }}
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full"
                      style={{ background: entry.defaults.brandPrimaryHex }}
                    />
                    {entry.defaults.brandAccentHex}
                  </span>
                </header>

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
                  siteUrl="https://opsolid.de"
                  locale="de"
                  walletSlot={<WalletSlotPlaceholder />}
                />
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function WalletSlotPlaceholder() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="inline-flex items-center gap-2 rounded-full bg-black/95 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 ring-1 ring-white/10">
        <span className="h-2 w-2 rounded-full bg-white/80" />
        Add to Apple Wallet
      </span>
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-wide text-ink ring-1 ring-line">
        <span className="h-2 w-2 rounded-full bg-ink/80" />
        Save to Google Wallet
      </span>
    </div>
  );
}
