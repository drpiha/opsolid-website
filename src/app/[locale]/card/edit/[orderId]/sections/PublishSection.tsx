"use client";

// =============================================================================
// PublishSection — A8.2 split.
//
// Section 4 of the edit form: error/saved alerts and the read-only status
// info block. The actual save action lives in StickySaveBar; this section
// just surfaces the most recent submit outcome and the publish status.
// Visual markup matches CardEditClient pre-split byte-for-byte.
// =============================================================================

import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { FormState, SectionToggle } from "./types";

interface PublishSectionProps extends SectionToggle {
  errorMsg: string | null;
  formState: FormState;
  badgeInfo: { label: string; cls: string };
}

export default function PublishSection({
  errorMsg,
  formState,
  badgeInfo,
  openSections,
  toggleSection,
}: PublishSectionProps) {
  const { t } = useLocale();
  const edit = t.products.digitalCard.edit;

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
            "text-ink/40 shrink-0 motion-safe:transition-transform motion-safe:duration-200",
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
            <p className="text-eyebrow uppercase text-ink/50">
              {edit.statusLabel}
            </p>
            <p className="text-heading-sm text-ink">{badgeInfo.label}</p>
          </div>
        </div>

      </div>{/* end collapsible: publish */}
    </section>
  );
}
