"use client";

// =============================================================================
// StickySaveBar — A4 (Faz 6.7)
//
// Fixed bottom bar that reflects dirty / saving / saved state for the card
// edit form. Visible but subdued when form is clean; tinted copper when there
// are unsaved changes. Includes Revert affordance and a primary Save button.
//
// Props:
//   isDirty     — whether current form state differs from last-saved snapshot
//   formState   — mirrors CardEditClient's FormState
//   onRevert    — callback to reset form to last-saved snapshot
// =============================================================================

import { Loader2, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export type FormState = "idle" | "saving" | "saved" | "error";

interface StickySaveBarProps {
  isDirty: boolean;
  formState: FormState;
  onRevert: () => void;
}

export function StickySaveBar({ isDirty, formState, onRevert }: StickySaveBarProps) {
  const { t } = useLocale();
  const edit = t.products.digitalCard.edit;

  const isSaving = formState === "saving";
  const isSaved = formState === "saved";

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-30 border-t transition-colors duration-300",
        isDirty
          ? "border-copper-300/60 bg-copper-50/95 backdrop-blur-md"
          : "border-line bg-bg-0/90 backdrop-blur-md",
      ].join(" ")}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
      data-dirty={isDirty}
      role="status"
      aria-live="polite"
      aria-label={isDirty ? edit.unsavedChanges : edit.allSaved}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Left: status label */}
        <div className="flex items-center gap-2 text-sm text-ink/70">
          {isSaved ? (
            <CheckCircle2 size={15} className="text-green-600 shrink-0" />
          ) : isDirty ? (
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-copper-500 motion-safe:animate-pulse"
              aria-hidden="true"
            />
          ) : null}
          <span
            className={
              isSaved
                ? "text-green-700"
                : isDirty
                ? "text-ink/80"
                : "text-ink/40"
            }
          >
            {isSaved ? edit.savedSuccess : isDirty ? edit.unsavedChanges : edit.allSaved}
          </span>
        </div>

        {/* Right: Revert + Save */}
        <div className="flex items-center gap-2">
          {isDirty && !isSaving && (
            <button
              type="button"
              onClick={onRevert}
              className="text-sm text-ink/60 underline-offset-2 hover:text-ink hover:underline"
            >
              {edit.revert}
            </button>
          )}
          <button
            type="submit"
            disabled={(!isDirty && formState !== "saved") || isSaving}
            className="btn-primary min-h-[48px] min-w-[140px] inline-flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 size={15} className="motion-safe:animate-spin" />}
            <span>{isSaving ? edit.saving : edit.save}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
