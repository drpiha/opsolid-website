"use client";

// =============================================================================
// Services / products editor — manages `cardData.services`, the list that
// templates render as "services", "products" or "Atölyeden" items depending on
// the design. Previously these came ONLY from sector presets and could not be
// edited, so owners saw items they could not change. This editor makes the
// list fully owner-controlled: add, edit, remove, reorder-by-remove, and a
// one-click "load sector examples" seed for a quick start.
//
// An explicit empty list (owner removed everything) is persisted as [] so the
// template shows no products — the preset only fills in when the field has
// never been touched (undefined). See the `cardData.services ?? sector?.services`
// fallback in the v2 templates.
// =============================================================================

import * as React from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import type { CardService } from "@/lib/validation";
import { getSectorPreset } from "@/config/card-sectors";

const MAX_SERVICES = 12;

interface Props {
  services: CardService[] | undefined;
  sectorKey: string | null | undefined;
  onServicesChange: (next: CardService[] | undefined) => void;
  L: (k: string, fallback: string) => string;
}

export function ServicesEditor({
  services,
  sectorKey,
  onServicesChange,
  L,
}: Props) {
  const items = services ?? [];
  const atLimit = items.length >= MAX_SERVICES;

  // Persist [] as [] (explicit "no services") but never write an all-empty row
  // set as undefined here — the parent decides undefined on save normalisation.
  const update = (next: CardService[]) => onServicesChange(next);

  const setField = (idx: number, key: keyof CardService, value: string) => {
    const next = items.map((it, i) =>
      i === idx ? { ...it, [key]: value } : it,
    );
    update(next);
  };

  const addRow = () => {
    if (atLimit) return;
    update([...items, { title: "" }]);
  };

  const removeRow = (idx: number) => {
    update(items.filter((_, i) => i !== idx));
  };

  const loadExamples = () => {
    const preset = getSectorPreset(sectorKey);
    if (preset?.services?.length) {
      update(preset.services.slice(0, MAX_SERVICES));
    }
  };

  const presetAvailable = Boolean(getSectorPreset(sectorKey)?.services?.length);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-xs text-ink-300">
          {L(
            "servicesEmpty",
            "Henüz hizmet/ürün yok. Ekle’ye bas ya da sektör örneklerini yükle.",
          )}
        </p>
      )}

      {items.map((item, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-line bg-bg-0 p-3 space-y-2"
        >
          <div className="flex items-start gap-2">
            <input
              type="text"
              className="field w-full"
              placeholder={L("servicesTitle", "Başlık (ör. Genel muayene)")}
              value={item.title}
              maxLength={120}
              onChange={(e) => setField(idx, "title", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeRow(idx)}
              aria-label={L("servicesRemove", "Sil")}
              className="mt-1 shrink-0 rounded-lg border border-line bg-white p-2 text-ink-300 transition-colors hover:border-signal-err hover:text-signal-err"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <input
            type="text"
            className="field w-full"
            placeholder={L("servicesDesc", "Kısa açıklama (opsiyonel)")}
            value={item.description ?? ""}
            maxLength={400}
            onChange={(e) => setField(idx, "description", e.target.value)}
          />
          <input
            type="text"
            className="field w-full sm:w-1/2"
            placeholder={L("servicesPrice", "Fiyat etiketi (ör. 49 €) — opsiyonel")}
            value={item.priceLabel ?? ""}
            maxLength={60}
            onChange={(e) => setField(idx, "priceLabel", e.target.value)}
          />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={addRow}
          disabled={atLimit}
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all",
            atLimit
              ? "cursor-not-allowed border border-line bg-bg-1 text-ink/35"
              : "border border-copper/40 bg-copper/10 text-ink hover:border-copper hover:bg-copper/20",
          ].join(" ")}
        >
          <Plus size={13} />
          {L("servicesAdd", "Hizmet/ürün ekle")}
        </button>

        {items.length === 0 && presetAvailable && (
          <button
            type="button"
            onClick={loadExamples}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink-300 transition-colors hover:border-copper/60 hover:text-ink"
          >
            <Sparkles size={13} />
            {L("servicesLoadExamples", "Sektör örneklerini yükle")}
          </button>
        )}

        <span className="ml-auto mono-label text-[10px] uppercase tracking-wider text-ink/45">
          {items.length} / {MAX_SERVICES}
        </span>
      </div>
    </div>
  );
}
