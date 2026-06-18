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
import { FaqEditor } from "@/components/cards/order-form/FaqEditor";
import { GalleryEditor } from "@/components/cards/order-form/GalleryEditor";
import { ServicesEditor } from "@/components/cards/order-form/ServicesEditor";
import { StatsEditor } from "@/components/cards/order-form/StatsEditor";
import { TestimonialsEditor } from "@/components/cards/order-form/TestimonialsEditor";
import { VideoUploader } from "@/components/cards/order-form/VideoUploader";
import { SectionLabelsEditor } from "@/components/cards/order-form/SectionLabelsEditor";
import type { BlockLocale } from "@/components/cards/templates/v2/shared/universalHeadings";
import type { CardData } from "@/lib/validation";
import type { HandleFileUpload, SectionToggle, SetCardFn } from "./types";

interface ContentSectionProps extends SectionToggle {
  cardData: CardData;
  setCard: SetCardFn;
  handleFileUpload: HandleFileUpload;
  /** Registry key of the selected template — drives editable label keys. */
  templateKey: string | null;
  /** Card display language — drives the label defaults shown as placeholders. */
  cardLocale: BlockLocale;
}

export default function ContentSection({
  cardData,
  setCard,
  handleFileUpload,
  openSections,
  toggleSection,
  templateKey,
  cardLocale,
}: ContentSectionProps) {
  const { t } = useLocale();
  const edit = t.products.digitalCard.edit;
  const form = t.products.digitalCard.order.form;

  return (
    <section id="section-content">
      <button
        type="button"
        onClick={() => toggleSection("content")}
        className="flex w-full items-center justify-between gap-3 mb-3 text-left"
        aria-expanded={openSections.has("content")}
        aria-label={
          openSections.has("content")
            ? edit.collapseSection
            : edit.expandSection
        }
      >
        <h2 className="text-sm font-semibold text-ink">
          {edit.sectionContent}
        </h2>
        <ChevronDown
          size={18}
          className={[
            "text-ink-300 shrink-0 motion-safe:transition-transform motion-safe:duration-200",
            openSections.has("content") ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>
      <div hidden={!openSections.has("content")} className="space-y-4">

        {/* Services / products — the list templates render (services, products,
            "Atölyeden" items). Fully owner-editable; empty = hidden on card. */}
        <fieldset className="space-y-2">
          <legend className="text-heading-sm text-ink">
            {(form as Record<string, string>).servicesSection ?? "Hizmetler · Ürünler"}
          </legend>
          {(form as Record<string, string>).servicesHint && (
            <p className="-mt-1 text-xs text-ink-300">
              {(form as Record<string, string>).servicesHint}
            </p>
          )}
          <ServicesEditor
            services={cardData.services}
            sectorKey={cardData.sectorKey}
            onServicesChange={(next) => setCard("services", next)}
            L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
          />
        </fieldset>

        {/* Stats — owner's proof-point numbers (replaces the old hardcoded
            template stats). Empty = no stat block on the card. */}
        <fieldset className="space-y-2">
          <legend className="text-heading-sm text-ink">
            {(form as Record<string, string>).statsSection ?? "Stats"}
          </legend>
          {(form as Record<string, string>).statsHint && (
            <p className="-mt-1 text-xs text-ink-300">
              {(form as Record<string, string>).statsHint}
            </p>
          )}
          <StatsEditor
            stats={cardData.stats}
            onStatsChange={(next) => setCard("stats", next)}
            L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
          />
        </fieldset>

        {/* Gallery — up to 24 photos rendered on the public card */}
        <fieldset className="space-y-4">
          <legend className="text-heading-sm text-ink">
            {(form as Record<string, string>).gallerySection ?? "Galeri"}
          </legend>
          {(form as Record<string, string>).galleryHint && (
            <p className="-mt-2 text-xs text-ink-300">
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

        {/* Video — direct upload (short clip) + YouTube/Vimeo embed link */}
        <fieldset className="space-y-2">
          <legend className="text-heading-sm text-ink">
            {form.videoSection ?? "Video"}
          </legend>
          {form.videoHint && (
            <p className="-mt-1 text-xs text-ink-300">{form.videoHint}</p>
          )}

          {/* Direct upload — short self-hosted clip */}
          <VideoUploader
            videoPath={cardData.videoPath}
            onChange={(path) => setCard("videoPath", path)}
            L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
          />

          {/* Or a YouTube / Vimeo link (no length limit) */}
          <p className="pt-1 text-[11px] uppercase tracking-wider text-ink-300">
            {(form as Record<string, string>).videoOrLink ?? "veya YouTube / Vimeo bağlantısı"}
          </p>
          <label className="block">
            <span className="sr-only">{form.videoLabel ?? "Video link"}</span>
            <input
              type="url"
              inputMode="url"
              className="field w-full"
              placeholder={form.videoPlaceholder ?? "https://youtube.com/watch?v=…"}
              value={cardData.videoUrl ?? ""}
              onChange={(e) =>
                setCard("videoUrl", e.target.value.trim() || undefined)
              }
            />
          </label>
          {cardData.videoUrl &&
            !/(?:youtube\.com|youtu\.be|youtube-nocookie\.com|vimeo\.com)/i.test(
              cardData.videoUrl,
            ) && (
              <p className="text-xs text-signal-err">
                {form.videoInvalid ??
                  "Only YouTube or Vimeo links are supported."}
              </p>
            )}

          {/* Vertical placement — only relevant once a video is set. */}
          {(cardData.videoPath || cardData.videoUrl) && (
            <div className="pt-1 space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-ink-300">
                {(form as Record<string, string>).videoPlacementLabel ??
                  "Video konumu"}
              </p>
              <div className="flex gap-1.5" role="radiogroup">
                {(["top", "default", "bottom"] as const).map((value) => {
                  const active = (cardData.videoPlacement ?? "default") === value;
                  const labelKey =
                    value === "top"
                      ? "videoPlacementTop"
                      : value === "bottom"
                        ? "videoPlacementBottom"
                        : "videoPlacementDefault";
                  const fallback =
                    value === "top"
                      ? "Üst"
                      : value === "bottom"
                        ? "Alt"
                        : "Varsayılan";
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() =>
                        setCard(
                          "videoPlacement",
                          value === "default" ? undefined : value,
                        )
                      }
                      className={`flex-1 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                        active
                          ? "border-copper bg-copper/10 text-ink"
                          : "border-line text-ink-300 hover:border-line-firm"
                      }`}
                    >
                      {(form as Record<string, string>)[labelKey] ?? fallback}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </fieldset>

        {/* FAQ — up to 12 Q&A items rendered as accordion */}
        <fieldset className="space-y-2">
          <legend className="text-heading-sm text-ink">
            {(form as Record<string, string>).faqSection ?? "FAQ (optional)"}
          </legend>
          {(form as Record<string, string>).faqHint && (
            <p className="-mt-1 text-xs text-ink-300">
              {(form as Record<string, string>).faqHint}
            </p>
          )}
          <FaqEditor
            faqs={cardData.faqs}
            onFaqsChange={(next) => setCard("faqs", next)}
            L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
          />
        </fieldset>

        {/* Testimonials — up to 8 client quotes */}
        <fieldset className="space-y-2">
          <legend className="text-heading-sm text-ink">
            {(form as Record<string, string>).testimonialsSection ?? "Testimonials (optional)"}
          </legend>
          {(form as Record<string, string>).testimonialsHint && (
            <p className="-mt-1 text-xs text-ink-300">
              {(form as Record<string, string>).testimonialsHint}
            </p>
          )}
          <TestimonialsEditor
            testimonials={cardData.testimonials}
            onTestimonialsChange={(next) => setCard("testimonials", next)}
            L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
          />
        </fieldset>

        {/* Phase 7.9 — Custom Sections */}
        <fieldset className="space-y-4">
          <legend className="text-heading-sm text-ink">
            {form.customSectionsSection ?? "Özel bölümler"}
          </legend>
          {form.customSectionsHint && (
            <p className="-mt-2 text-xs text-ink-300">
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

        {/* Editable section labels — rename any heading the template renders. */}
        <fieldset className="space-y-2">
          <legend className="text-heading-sm text-ink">
            {(form as Record<string, string>).labelsSection ?? "Section labels (optional)"}
          </legend>
          <p className="-mt-1 text-xs text-ink-300">
            {(form as Record<string, string>).labelsHint ??
              'Rename any heading on your card. Leave blank to keep the template default.'}
          </p>
          <SectionLabelsEditor
            templateKey={templateKey}
            locale={cardLocale}
            labels={cardData.labels}
            onChange={(next) => setCard("labels", next)}
          />
        </fieldset>

      </div>{/* end collapsible: content */}
    </section>
  );
}
