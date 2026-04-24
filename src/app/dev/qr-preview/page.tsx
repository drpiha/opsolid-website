// =============================================================================
// /dev/qr-preview — visual QA grid for the 8 server-rendered QR presets.
//
// Not linked from anywhere; reachable by typing the URL. Used during
// development to confirm every preset renders correctly with brand colors,
// optional logo and photo overlays, both as PNG and SVG.
//
// Production note: this page works in production too (no auth) but is hidden
// from sitemap.xml and `robots: { index: false }` so it doesn't show up in
// Google. Safe to leave deployed as a permanent QA harness.
// =============================================================================

import type { Metadata } from "next";
import { QR_PRESETS } from "@/lib/qr/presets";
import { renderQr } from "@/lib/qr/styled-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "QR Preview · /dev",
  robots: { index: false, follow: false },
};

const SAMPLE_URL = "https://opsolid.de/c/preview-card";

interface RenderedTile {
  key: string;
  label: string;
  description: string;
  primary: string;
  background: string;
  accent?: string;
  pngDataUrl: string;
}

async function buildTile(
  presetKey: keyof typeof QR_PRESETS
): Promise<RenderedTile> {
  const preset = QR_PRESETS[presetKey];
  const { bytes } = await renderQr({
    data: SAMPLE_URL,
    preset: preset.key,
    primary: preset.defaultPrimary,
    background: preset.defaultBackground,
    accent: preset.defaultAccent,
    format: "png",
    size: 320,
  });
  return {
    key: preset.key,
    label: preset.label,
    description: preset.description,
    primary: preset.defaultPrimary,
    background: preset.defaultBackground,
    accent: preset.defaultAccent,
    pngDataUrl: `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`,
  };
}

export default async function QrPreviewPage() {
  const tiles = await Promise.all(
    (Object.keys(QR_PRESETS) as (keyof typeof QR_PRESETS)[]).map(buildTile)
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
            /dev/qr-preview
          </p>
          <h1 className="mt-2 font-serif text-4xl">
            8 server-rendered QR presets
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            Sample payload:{" "}
            <code className="font-mono text-amber-300">{SAMPLE_URL}</code>. Each
            tile uses the preset default palette. The customer-facing widget
            (Phase 4) will let users override colors and embed a logo or photo
            in the center.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {tiles.map((tile) => (
            <div
              key={tile.key}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div
                className="mb-4 flex aspect-square items-center justify-center rounded-xl"
                style={{ background: tile.background }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.pngDataUrl}
                  alt={`${tile.label} preview`}
                  width={320}
                  height={320}
                  className="h-auto w-full"
                />
              </div>
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-xl">{tile.label}</h2>
                <code className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  {tile.key}
                </code>
              </div>
              <p className="mt-2 text-xs text-white/60">{tile.description}</p>
              <div className="mt-3 flex gap-2">
                <span
                  title={`primary ${tile.primary}`}
                  className="inline-block h-3 w-3 rounded-full ring-1 ring-white/20"
                  style={{ background: tile.primary }}
                />
                <span
                  title={`background ${tile.background}`}
                  className="inline-block h-3 w-3 rounded-full ring-1 ring-white/20"
                  style={{ background: tile.background }}
                />
                {tile.accent ? (
                  <span
                    title={`accent ${tile.accent}`}
                    className="inline-block h-3 w-3 rounded-full ring-1 ring-white/20"
                    style={{ background: tile.accent }}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-serif text-2xl">Endpoint cheat-sheet</h2>
          <ul className="mt-4 space-y-2 font-mono text-xs text-white/70">
            <li>
              GET{" "}
              <code className="text-amber-300">
                /api/qr/&lt;slug&gt;?style=rounded&primary=15120F&accent=E8A252&logo=1&format=png
              </code>
            </li>
            <li>
              GET{" "}
              <code className="text-amber-300">
                /api/qr/&lt;slug&gt;?format=svg
              </code>{" "}
              — vector for printers
            </li>
            <li>
              GET{" "}
              <code className="text-amber-300">
                /api/qr/&lt;slug&gt;?ai=1
              </code>{" "}
              — redirects to the saved AI Art QR (when generated)
            </li>
            <li>
              POST{" "}
              <code className="text-amber-300">
                /api/qr/ai-generate?token=&lt;editToken&gt;
              </code>{" "}
              body:{" "}
              <code className="text-amber-300">
                {`{ orderId, prompt, style }`}
              </code>{" "}
              — yearly+lifetime only
            </li>
            <li>
              GET{" "}
              <code className="text-amber-300">/c/&lt;slug&gt;.png</code> — OG
              1200×630, embeds avatar + custom QR
            </li>
            <li>
              GET{" "}
              <code className="text-amber-300">/c/&lt;slug&gt;/wa.png</code> —
              WhatsApp 600×600 1:1 thumbnail
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
