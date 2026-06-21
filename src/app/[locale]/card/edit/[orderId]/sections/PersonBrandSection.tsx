"use client";

// =============================================================================
// PersonBrandSection — A8.2 split.
//
// Section 1 of the edit form: card identity (name/title/company/contact),
// socials, and the photo + logo upload tiles with the position-editor entry
// thumbnails. Visual markup matches CardEditClient pre-split byte-for-byte.
// =============================================================================

import { useState } from "react";
import { ChevronDown, Loader2, Pencil, Upload } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { ProfileExtrasFields } from "@/components/cards/order-form/ProfileExtrasFields";
import { SpotlightEditor } from "@/components/cards/order-form/SpotlightEditor";
import { useLocale } from "@/context/LocaleContext";
import type { CardData } from "@/lib/validation";
import type {
  HandleFileUpload,
  SectionToggle,
  SetCardFn,
  SetSocialFn,
} from "./types";

interface PersonBrandSectionProps extends SectionToggle {
  cardData: CardData;
  setCard: SetCardFn;
  setSocial: SetSocialFn;
  photoPath: string | null;
  setPhotoPath: (path: string | null) => void;
  logoPath: string | null;
  setLogoPath: (path: string | null) => void;
  photoUploading: boolean;
  setPhotoUploading: (v: boolean) => void;
  logoUploading: boolean;
  setLogoUploading: (v: boolean) => void;
  handleFileUpload: HandleFileUpload;
  onOpenPhotoEditor: () => void;
  onOpenLogoEditor: () => void;
  resolveAsset: (path: string) => string;
}

export default function PersonBrandSection({
  cardData,
  setCard,
  setSocial,
  photoPath,
  setPhotoPath,
  logoPath,
  setLogoPath,
  photoUploading,
  setPhotoUploading,
  logoUploading,
  setLogoUploading,
  handleFileUpload,
  onOpenPhotoEditor,
  onOpenLogoEditor,
  resolveAsset,
  openSections,
  toggleSection,
}: PersonBrandSectionProps) {
  const { t } = useLocale();
  const edit = t.products.digitalCard.edit;
  const form = t.products.digitalCard.order.form;
  // Parity with /card/new: secondary contact fields live behind a "Daha fazla"
  // reveal so the always-open essentials match the create flow one-for-one.
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <section id="section-person-brand">
      <button
        type="button"
        onClick={() => toggleSection("person-brand")}
        className="flex w-full items-center justify-between gap-3 mb-3 text-left"
        aria-expanded={openSections.has("person-brand")}
        aria-label={
          openSections.has("person-brand")
            ? edit.collapseSection
            : edit.expandSection
        }
      >
        <h2 className="text-sm font-semibold text-ink">
          {edit.sectionPersonBrand}
        </h2>
        <ChevronDown
          size={18}
          className={[
            "text-ink-300 shrink-0 motion-safe:transition-transform motion-safe:duration-200",
            openSections.has("person-brand") ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>
      <div hidden={!openSections.has("person-brand")} className="space-y-4">

        {/* Card content */}
        <fieldset className="space-y-4">
          <legend className="text-heading-sm text-ink">
            {form.cardSection}
          </legend>
          {/* Temel — matches /card/new: name / title / company / email / phone. */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={form.cardName}
              value={cardData.name}
              onChange={(e) => setCard("name", e.target.value)}
            />
            <Input
              label={form.cardTitle}
              value={cardData.title ?? ""}
              onChange={(e) => setCard("title", e.target.value)}
            />
            <Input
              label={form.cardCompany}
              value={cardData.company ?? ""}
              onChange={(e) => setCard("company", e.target.value)}
            />
            <Input
              type="email"
              label={form.cardEmail}
              value={cardData.email ?? ""}
              onChange={(e) => setCard("email", e.target.value)}
            />
            <Input
              type="tel"
              label={form.cardPhone}
              value={cardData.phone ?? ""}
              onChange={(e) => setCard("phone", e.target.value)}
            />
          </div>

          {/* Daha fazla — secondary contact fields, collapsed (create parity). */}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-xl border border-line bg-bg-0 px-3 py-2 text-sm font-medium text-ink-200 hover:border-copper/40"
            aria-expanded={moreOpen}
          >
            <span>{edit.tierMore}</span>
            <ChevronDown
              size={16}
              className={[
                "text-ink-300 motion-safe:transition-transform motion-safe:duration-150",
                moreOpen ? "rotate-180" : "",
              ].join(" ")}
              aria-hidden="true"
            />
          </button>
          {moreOpen && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={form.cardWebsite}
                  value={cardData.website ?? ""}
                  onChange={(e) => setCard("website", e.target.value)}
                />
                <Input
                  type="tel"
                  label={form.cardWhatsapp}
                  value={cardData.whatsapp ?? ""}
                  onChange={(e) => setCard("whatsapp", e.target.value)}
                />
                <Input
                  label={form.cardAddress}
                  value={cardData.address ?? ""}
                  onChange={(e) => setCard("address", e.target.value)}
                />
              </div>
              <Textarea
                label={form.cardBio}
                value={cardData.bio ?? ""}
                onChange={(e) => setCard("bio", e.target.value)}
                rows={3}
              />
              {/* Tagline + location chip — owner-controlled (2026-06 purge of
                  hardcoded template personas). */}
              <ProfileExtrasFields
                cardData={cardData}
                setField={setCard}
                L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
              />
            </div>
          )}
        </fieldset>

        {/* Şu an / Now — prominent momentary update (note + link) shown right
            below the photo on the public card and in the live preview. */}
        <fieldset className="space-y-2">
          <legend className="text-heading-sm text-ink">
            {(form as Record<string, string>).spotlightSection ?? "Şu an · Now"}
          </legend>
          <SpotlightEditor
            spotlight={cardData.spotlight}
            onChange={(next) => setCard("spotlight", next)}
            L={(k, fb) => (form as Record<string, string>)[k] ?? fb}
          />
        </fieldset>

        {/* Socials */}
        <fieldset className="space-y-4">
          <legend className="text-heading-sm text-ink">
            {form.socialSection}
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="LinkedIn"
              value={cardData.socials?.linkedin ?? ""}
              onChange={(e) => setSocial("linkedin", e.target.value)}
            />
            <Input
              label="Instagram"
              value={cardData.socials?.instagram ?? ""}
              onChange={(e) => setSocial("instagram", e.target.value)}
            />
            <Input
              label="X (Twitter)"
              value={cardData.socials?.x ?? ""}
              onChange={(e) => setSocial("x", e.target.value)}
            />
            <Input
              label="TikTok"
              value={cardData.socials?.tiktok ?? ""}
              onChange={(e) => setSocial("tiktok", e.target.value)}
            />
            <Input
              label="YouTube"
              value={cardData.socials?.youtube ?? ""}
              onChange={(e) => setSocial("youtube", e.target.value)}
            />
            <Input
              label="GitHub"
              value={cardData.socials?.github ?? ""}
              onChange={(e) => setSocial("github", e.target.value)}
            />
          </div>
        </fieldset>

        {/* Uploads — B7 premium thumbnail entry for photo + logo */}
        <fieldset className="space-y-4">
          <legend className="text-heading-sm text-ink">
            {form.uploadSection}
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <UploadTile
                label={form.photoLabel}
                current={photoPath}
                uploading={photoUploading}
                onChange={async (file) => {
                  setPhotoUploading(true);
                  const path = await handleFileUpload(file, "photo");
                  if (path) setPhotoPath(path);
                  setPhotoUploading(false);
                }}
              />
              {photoPath && (
                <div className="mt-2 flex items-center gap-3">
                  {/* B7 — premium 64×64 thumbnail entry button */}
                  <button
                    type="button"
                    onClick={onOpenPhotoEditor}
                    className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-ink/25 bg-neutral-100"
                    aria-label={edit.adjustPhoto}
                    title={edit.adjustPhoto}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveAsset(photoPath)}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition: `${cardData.photoPosition?.x ?? 50}% ${cardData.photoPosition?.y ?? 50}%`,
                        transform: `scale(${cardData.photoPosition?.scale ?? 1})`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                      <Pencil size={14} className="text-white" />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPath(null);
                      setCard("photoPosition", undefined);
                    }}
                    className="text-[10.5px] text-ink-300 hover:text-ink"
                  >
                    {form.uploadRemove ?? "Remove"}
                  </button>
                </div>
              )}
            </div>
            <div>
              <UploadTile
                label={form.logoLabel}
                current={logoPath}
                uploading={logoUploading}
                onChange={async (file) => {
                  setLogoUploading(true);
                  const path = await handleFileUpload(file, "logo");
                  if (path) setLogoPath(path);
                  setLogoUploading(false);
                }}
              />
              {logoPath && (
                <div className="mt-2 flex items-center gap-3">
                  {/* B7 — premium 64×64 thumbnail entry button */}
                  <button
                    type="button"
                    onClick={onOpenLogoEditor}
                    className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-ink/25 bg-neutral-100"
                    aria-label={edit.adjustLogo}
                    title={edit.adjustLogo}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveAsset(logoPath)}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition: `${cardData.logoPosition?.x ?? 50}% ${cardData.logoPosition?.y ?? 50}%`,
                        transform: `scale(${cardData.logoPosition?.scale ?? 1})`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                      <Pencil size={14} className="text-white" />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPath(null);
                      setCard("logoPosition", undefined);
                    }}
                    className="text-[10.5px] text-ink-300 hover:text-ink"
                  >
                    {form.uploadRemove ?? "Remove"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </fieldset>

      </div>{/* end collapsible: person-brand */}
    </section>
  );
}

// -----------------------------------------------------------------------------
// UploadTile — local copy of the order-form tile so the customer experience
// stays consistent. Identical shape to the pre-split version.
// -----------------------------------------------------------------------------
function UploadTile({
  label,
  current,
  uploading,
  onChange,
}: {
  label: string;
  current: string | null;
  uploading: boolean;
  onChange: (file: File) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-neutral-300 bg-white p-4 transition-colors hover:border-ink/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-ink-200">
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="truncate text-xs text-ink-300">
          {current ? current.split("/").pop() : "JPG · PNG · SVG · max 2 MB"}
        </p>
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/svg+xml"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f);
        }}
      />
    </label>
  );
}
