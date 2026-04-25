"use client";

// =============================================================================
// SectorPanel — admin "Apply sector preset" picker on /admin/orders/[id].
//
// Fills empty service/CTA/FAQ blocks from a sector preset (consultant,
// real-estate, salon, …). Owner-supplied fields are never overwritten — this
// is a one-shot starter pack, not a destructive template swap.
// =============================================================================

import { useState } from "react";
import { listSectorPresets, type SectorPreset } from "@/config/card-sectors";

interface Props {
  orderId: string;
  token: string;
  currentSectorKey?: string | null;
}

const PRESETS: SectorPreset[] = listSectorPresets();

export function SectorPanel({ orderId, token, currentSectorKey }: Props) {
  const [selected, setSelected] = useState<string>(currentSectorKey ?? "consultant");
  const [applyColors, setApplyColors] = useState(true);
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const preset = PRESETS.find((p) => p.key === selected) ?? PRESETS[0];

  async function handleApply() {
    setState("submitting");
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/cards/${orderId}/sector?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sectorKey: selected, applyColors }),
        },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setState("error");
        setError(body?.error ?? `HTTP ${res.status}`);
        return;
      }
      setState("ok");
      // Reload so the public-card panel below reflects the new content.
      setTimeout(() => window.location.reload(), 900);
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Network error");
    }
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 md:col-span-2">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-heading-sm text-ink">Sector preset</h2>
        {currentSectorKey && (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/60">
            current: {currentSectorKey}
          </span>
        )}
      </div>
      <p className="mb-4 text-xs text-ink/60">
        Fills empty service / CTA / FAQ blocks from a sector starter pack.
        Owner-supplied content is never overwritten.
      </p>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="grid gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">
            Sector
          </span>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-ink"
          >
            {PRESETS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleApply}
          disabled={state === "submitting"}
          className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {state === "submitting" ? "Applying…" : state === "ok" ? "Applied!" : "Apply preset"}
        </button>
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs text-ink/70">
        <input
          type="checkbox"
          checked={applyColors}
          onChange={(e) => setApplyColors(e.target.checked)}
        />
        Also fill empty brand colors with sector defaults
      </label>

      <div className="mt-4 grid gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs">
        <div className="flex items-center gap-3">
          <ColorSwatch hex={preset.primaryHex} label="primary" />
          <ColorSwatch hex={preset.accentHex} label="accent" />
          <span className="text-ink/60">{preset.tagline}</span>
        </div>
        {preset.services.length > 0 && (
          <div>
            <p className="font-semibold text-ink/70">Services</p>
            <ul className="ml-4 list-disc text-ink/60">
              {preset.services.map((s, i) => (
                <li key={i}>
                  {s.title}
                  {s.priceLabel ? ` (${s.priceLabel})` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
        {preset.customButtons.length > 0 && (
          <div>
            <p className="font-semibold text-ink/70">Buttons</p>
            <p className="text-ink/60">
              {preset.customButtons.map((b) => b.label).join(" · ")}
            </p>
          </div>
        )}
        {preset.faqs.length > 0 && (
          <p className="text-ink/60">
            {preset.faqs.length} FAQ{preset.faqs.length === 1 ? "" : "s"} included
          </p>
        )}
      </div>

      {error && <p className="mt-3 text-xs text-signal-err">{error}</p>}
    </section>
  );
}

function ColorSwatch({ hex, label }: { hex: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-4 w-4 rounded border border-ink/15"
        style={{ background: hex }}
      />
      <code className="font-mono text-[10px] text-ink/70">
        {label}: {hex}
      </code>
    </span>
  );
}
