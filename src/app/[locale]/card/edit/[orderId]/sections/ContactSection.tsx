"use client";

// =============================================================================
// ContactSection — A8.2 split.
//
// Section 3 of the edit form: typography preset picker, brand colour pair,
// and the free-form design notes textarea. Visual markup matches the
// pre-split CardEditClient byte-for-byte.
// =============================================================================

import { Check, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/Input";
import { useLocale } from "@/context/LocaleContext";
import { TYPOGRAPHY_PRESET_LIST } from "@/lib/typographyPresets";
import type { CardData } from "@/lib/validation";
import type { SectionToggle, SetCardFn } from "./types";

interface ContactSectionProps extends SectionToggle {
  cardData: CardData;
  setCard: SetCardFn;
  brandPrimaryHex: string;
  setBrandPrimaryHex: (v: string) => void;
  brandAccentHex: string;
  setBrandAccentHex: (v: string) => void;
}

export default function ContactSection({
  cardData,
  setCard,
  brandPrimaryHex,
  setBrandPrimaryHex,
  brandAccentHex,
  setBrandAccentHex,
  openSections,
  toggleSection,
}: ContactSectionProps) {
  const { t } = useLocale();
  const edit = t.products.digitalCard.edit;
  const form = t.products.digitalCard.order.form;

  return (
    <section id="section-contact">
      <button
        type="button"
        onClick={() => toggleSection("contact")}
        className="flex w-full items-center justify-between gap-3 mt-8 mb-3 text-left"
        aria-expanded={openSections.has("contact")}
        aria-label={
          openSections.has("contact")
            ? edit.collapseSection
            : edit.expandSection
        }
      >
        <h2 className="font-serif text-lg text-ink">
          {edit.sectionContact}
        </h2>
        <ChevronDown
          size={18}
          className={[
            "text-ink-300 shrink-0 motion-safe:transition-transform motion-safe:duration-200",
            openSections.has("contact") ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>
      <div hidden={!openSections.has("contact")} className="space-y-4">

        {/* Phase 7.9 — Typography preset */}
        <fieldset className="space-y-4">
          <legend className="text-heading-sm text-ink">
            {form.typographySection ?? "Tipografi"}
          </legend>
          {form.typographyHint && (
            <p className="-mt-2 text-xs text-ink-300">
              {form.typographyHint}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
            {TYPOGRAPHY_PRESET_LIST.map((preset) => {
              const active =
                (cardData.typographyPreset ?? "default") === preset.key;
              const labelKey = `typography${
                preset.key.charAt(0).toUpperCase() + preset.key.slice(1)
              }Label`;
              const descKey = `typography${
                preset.key.charAt(0).toUpperCase() + preset.key.slice(1)
              }Desc`;
              const formMap = form as Record<string, string>;
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() =>
                    setCard(
                      "typographyPreset",
                      preset.key === "default" ? undefined : preset.key,
                    )
                  }
                  className={[
                    "group relative flex flex-col items-start gap-2 rounded-2xl border bg-white p-3.5 text-left transition-all",
                    active
                      ? "border-copper bg-copper/5 ring-2 ring-copper/30"
                      : "border-line hover:border-copper/40 hover:bg-bg-1",
                  ].join(" ")}
                >
                  <span
                    className="leading-none text-3xl text-ink"
                    style={{
                      fontFamily:
                        preset.displayFamily ||
                        "Geist, Inter, system-ui, sans-serif",
                    }}
                  >
                    {preset.sample}
                  </span>
                  <span className="block text-xs font-semibold text-ink">
                    {formMap[labelKey] ?? preset.label}
                  </span>
                  <span className="block text-[10.5px] leading-snug text-ink-300">
                    {formMap[descKey] ?? preset.description}
                  </span>
                  {active && (
                    <span className="absolute right-2 top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-copper text-white">
                      <Check size={9} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Branding */}
        <fieldset className="space-y-4">
          <legend className="text-heading-sm text-ink">
            {form.brandSection}
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <ColorField
              label={form.primaryColor}
              value={brandPrimaryHex}
              onChange={setBrandPrimaryHex}
            />
            <ColorField
              label={form.accentColor}
              value={brandAccentHex}
              onChange={setBrandAccentHex}
            />
          </div>
        </fieldset>

        <Textarea
          label={form.designNotes}
          value={cardData.designNotes ?? ""}
          onChange={(e) => setCard("designNotes", e.target.value)}
          rows={3}
          placeholder={form.designNotesPh}
        />

      </div>{/* end collapsible: contact */}
    </section>
  );
}

// -----------------------------------------------------------------------------
// ColorField — local copy from the pre-split CardEditClient. Identical shape.
// -----------------------------------------------------------------------------
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-ink">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#0A0A0A"}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-16 cursor-pointer rounded-2xl border border-neutral-200 bg-white p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0A0A0A"
          className="h-12 flex-1 rounded-full border border-neutral-200 bg-white px-5 font-mono text-sm"
        />
      </div>
    </div>
  );
}
