"use client";

// =============================================================================
// PublishSection — A8.2 split, updated Phase 8.1.
//
// Section 4 of the edit form: error/saved alerts, read-only status info,
// and the new visibility / networking settings added in Phase 8.1.
// The actual save action lives in StickySaveBar; this section just surfaces
// the most recent submit outcome, the publish status, and discovery controls.
// =============================================================================

import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { FormState, SectionToggle } from "./types";

interface PublishSectionProps extends SectionToggle {
  errorMsg: string | null;
  formState: FormState;
  badgeInfo: { label: string; cls: string };
  /** Phase 8.1 — discovery / visibility fields */
  visibility: "public" | "unlisted" | "private";
  onVisibilityChange: (v: "public" | "unlisted" | "private") => void;
  openToNetworking: boolean;
  onOpenToNetworkingChange: (v: boolean) => void;
  acceptingClients: boolean;
  onAcceptingClientsChange: (v: boolean) => void;
}

export default function PublishSection({
  errorMsg,
  formState,
  badgeInfo,
  openSections,
  toggleSection,
  visibility,
  onVisibilityChange,
  openToNetworking,
  onOpenToNetworkingChange,
  acceptingClients,
  onAcceptingClientsChange,
}: PublishSectionProps) {
  const { t, locale } = useLocale();
  const edit = t.products.digitalCard.edit;

  const loc = (locale ?? "de") as "de" | "en" | "tr";

  const visibilityOptions: {
    value: "public" | "unlisted" | "private";
    label: Record<"de" | "en" | "tr", string>;
    desc: Record<"de" | "en" | "tr", string>;
  }[] = [
    {
      value: "public",
      label: { de: "Öffentlich", en: "Public", tr: "Herkese Açık" },
      desc: {
        de: "In der Suche sichtbar",
        en: "Visible in discovery",
        tr: "Arama'da görünür",
      },
    },
    {
      value: "unlisted",
      label: { de: "Nur per Link", en: "Unlisted", tr: "Yalnızca Linkle" },
      desc: {
        de: "Nur mit direktem Link erreichbar",
        en: "Only accessible via direct link",
        tr: "Sadece direkt linkle erişilebilir",
      },
    },
    {
      value: "private",
      label: { de: "Privat", en: "Private", tr: "Özel" },
      desc: {
        de: "Nur für Sie sichtbar",
        en: "Only visible to you",
        tr: "Sadece size görünür",
      },
    },
  ];

  return (
    <section>
      <button
        type="button"
        onClick={() => toggleSection("publish")}
        className="flex w-full items-center justify-between gap-3 mt-8 mb-3 text-left"
        aria-expanded={openSections.has("publish")}
        aria-label={
          openSections.has("publish")
            ? edit.collapseSection
            : edit.expandSection
        }
      >
        <h2 className="font-serif text-lg text-ink">
          {edit.sectionPublish}
        </h2>
        <ChevronDown
          size={18}
          className={[
            "text-ink-300 shrink-0 motion-safe:transition-transform motion-safe:duration-200",
            openSections.has("publish") ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>
      <div hidden={!openSections.has("publish")} className="space-y-4">

        {errorMsg && (
          <div className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/5 p-4 text-sm text-brand">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {formState === "saved" && (
          <div className="flex items-start gap-3 rounded-2xl border border-green-600/30 bg-green-600/5 p-4 text-sm text-green-700">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{edit.savedSuccess}</span>
          </div>
        )}

        {/* Status info block — save button moved to StickySaveBar (A4) */}
        <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
          <div>
            <p className="text-eyebrow uppercase text-ink-300">
              {edit.statusLabel}
            </p>
            <p className="text-heading-sm text-ink">{badgeInfo.label}</p>
          </div>
        </div>

        {/* ── Phase 8.1 — Visibility ── */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-ink mb-2">
            {loc === "de" ? "Sichtbarkeit" : loc === "tr" ? "Görünürlük" : "Visibility"}
          </legend>
          {visibilityOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-start gap-3 rounded-lg border border-line bg-bg-1 px-3 py-2.5 cursor-pointer transition-colors hover:border-copper-500 has-[:checked]:border-copper-500 has-[:checked]:bg-bg-2"
            >
              <input
                type="radio"
                name="visibility"
                value={opt.value}
                checked={visibility === opt.value}
                onChange={() => onVisibilityChange(opt.value)}
                className="mt-0.5 accent-copper-500"
              />
              <div>
                <p className="text-sm font-medium text-ink">{opt.label[loc]}</p>
                <p className="text-xs text-ink-300">{opt.desc[loc]}</p>
              </div>
            </label>
          ))}
        </fieldset>

        {/* ── Phase 8.1 — Networking flags ── */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-ink">
            {loc === "de" ? "Vernetzung" : loc === "tr" ? "Ağ Kurma" : "Networking"}
          </p>
          <label className="flex items-center gap-3 rounded-lg border border-line bg-bg-1 px-3 py-2.5 cursor-pointer transition-colors hover:border-copper-500/50">
            <input
              type="checkbox"
              checked={openToNetworking}
              onChange={(e) => onOpenToNetworkingChange(e.target.checked)}
              className="accent-copper-500"
            />
            <span className="text-sm text-ink">
              {loc === "de"
                ? "Offen für Networking"
                : loc === "tr"
                ? "Networking'e açığım"
                : "Open to networking"}
            </span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-line bg-bg-1 px-3 py-2.5 cursor-pointer transition-colors hover:border-copper-500/50">
            <input
              type="checkbox"
              checked={acceptingClients}
              onChange={(e) => onAcceptingClientsChange(e.target.checked)}
              className="accent-copper-500"
            />
            <span className="text-sm text-ink">
              {loc === "de"
                ? "Nehme neue Kunden an"
                : loc === "tr"
                ? "Yeni müşteri kabul ediyorum"
                : "Accepting new clients"}
            </span>
          </label>
        </div>

      </div>{/* end collapsible: publish */}
    </section>
  );
}
