"use client";

// =============================================================================
// ContentSection — A8.2 split.
//
// Section 2 of the edit form: gallery photos and the custom-section editor.
// Visual markup matches CardEditClient pre-split byte-for-byte.
// =============================================================================

import { ChevronDown } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { CustomSectionsEditor } from "@/components/cards/order-form/CustomSectionsEditor";
import { GalleryEditor } from "@/components/cards/order-form/GalleryEditor";
import type { CardData } from "@/lib/validation";
import type { HandleFileUpload, SectionToggle, SetCardFn } from "./types";

interface ContentSectionProps extends SectionToggle {
  cardData: CardData;
  setCard: SetCardFn;
  handleFileUpload: HandleFileUpload;
}

export default function ContentSection({
  cardData,
  setCard,
  handleFileUpload,
  openSections,
  toggleSection,
}: ContentSectionProps) {
  const { t } = useLocale();
  const edit = t.products.digitalCard.edit;
  const form = t.products.digitalCard.order.form;

  return (
    <section>
      <button
        type="button"
        onClick={() => toggleSection("content")}
        className="flex w-full items-center justify-between gap-3 mt-8 mb-3 text-left"
        aria-expanded={openSections.has("content")}
        aria-label={
          openSections.has("content")
            ? edit.collapseSection
            : edit.expandSection
        }
      >
        <h2 className="font-serif text-lg text-ink">
          {edit.sectionContent}
        </h2>
        <ChevronDown
          size={18}
          className={[
            "text-ink/40 shrink-0 motion-safe:transition-transform motion-safe:duration-200",
            openSections.has("content") ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>
      <div hidden={!openSections.has("content")} className="space-y-4">

        {/* Gallery — up to 24 photos rendered on the public card */}
        <fieldset className="space-y-4">
          <legend className="text-heading-sm text-ink">
            {(form as Record<string, string>).gallerySection ?? "Galeri"}
          </legend>
          {(form as Record<string, string>).galleryHint && (
            <p className="-mt-2 text-xs text-ink/55">
              {(form as Record<string, string>).galleryHint}
            </p>
          )}
          <GalleryEditor
            gallery={cardData.gallery}
            onGalleryChange={(next) => setCard("gallery", next)}
            handleFileUpload={handleFileUpload}
            L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
          />
        </fieldset>

        {/* Phase 7.9 — Custom Sections */}
        <fieldset className="space-y-4">
          <legend className="text-heading-sm text-ink">
            {form.customSectionsSection ?? "Özel bölümler"}
          </legend>
          {form.customSectionsHint && (
            <p className="-mt-2 text-xs text-ink/55">
              {form.customSectionsHint}
            </p>
          )}
          <CustomSectionsEditor
            cardData={cardData}
            setCard={setCard}
            L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
            handleFileUpload={handleFileUpload}
          />
        </fieldset>

      </div>{/* end collapsible: content */}
    </section>
  );
}
