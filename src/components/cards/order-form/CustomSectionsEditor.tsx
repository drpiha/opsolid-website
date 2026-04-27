"use client";

// =============================================================================
// Phase 7.9 — Custom sections editor (shared between the create form and the
// post-purchase edit page). Lets the customer add up to 6 free-form titled
// blocks of text, each with optional inline images.
//
// Phase 8 — multi-image: each section now carries up to 6 photos via the
// new `media[]` field. Legacy `mediaPath` is migrated transparently:
//   - existing single-image sections continue to render until the user
//     edits the section, at which point we lift the legacy path into the
//     new array shape.
//   - new sections only ever write to `media[]`.
// =============================================================================

import * as React from "react";
import { X, Camera } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import {
  type CardData,
  type CustomSection,
  type SectionMedia,
} from "@/lib/validation";

const MAX_MEDIA_PER_SECTION = 6;
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  cardData: CardData;
  setCard: <K extends keyof CardData>(key: K, value: CardData[K]) => void;
  L: (k: string, f: string) => string;
  /** Reuses the parent form's upload helper so files land in the same bucket. */
  handleFileUpload: (
    file: File,
    kind: "photo" | "logo"
  ) => Promise<string | null>;
}

/**
 * Read the merged media list for a section, lifting legacy `mediaPath` into
 * the new `media[]` shape when present. Pure — does not mutate the section.
 */
function effectiveMedia(section: CustomSection): SectionMedia[] {
  if (section.media && section.media.length > 0) return section.media;
  if (section.mediaPath) return [{ src: section.mediaPath }];
  return [];
}

export function CustomSectionsEditor({
  cardData,
  setCard,
  L,
  handleFileUpload,
}: Props) {
  const sections = cardData.customSections ?? [];
  const updateSections = (next: CustomSection[]) =>
    setCard("customSections", next.length ? next : undefined);

  const addSection = () => {
    if (sections.length >= 6) return;
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 10);
    updateSections([...sections, { id, title: "", body: "" }]);
  };

  const updateSection = (i: number, patch: Partial<CustomSection>) => {
    const next = sections.slice();
    next[i] = { ...next[i], ...patch };
    updateSections(next);
  };

  const removeSection = (i: number) => {
    updateSections(sections.filter((_, j) => j !== i));
  };

  const atLimit = sections.length >= 6;

  return (
    <div className="space-y-3">
      {sections.length > 0 && (
        <div className="space-y-3">
          {sections.map((section, i) => (
            <SectionCard
              key={section.id}
              section={section}
              onChange={(patch) => updateSection(i, patch)}
              onRemove={() => removeSection(i)}
              handleFileUpload={handleFileUpload}
              L={L}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={addSection}
          disabled={atLimit}
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all",
            atLimit
              ? "cursor-not-allowed border border-line bg-bg-1 text-ink/35"
              : "border border-copper/40 bg-copper/10 text-ink hover:border-copper hover:bg-copper/20",
          ].join(" ")}
        >
          <span aria-hidden className="text-base leading-none">
            +
          </span>
          {L("customSectionAdd", "Bölüm ekle")}
        </button>
        <span className="mono-label text-[10px] uppercase tracking-wider text-ink/45">
          {L("customSectionsCount", "{n} / 6").replace(
            "{n}",
            String(sections.length)
          )}
        </span>
      </div>
    </div>
  );
}

function SectionCard({
  section,
  onChange,
  onRemove,
  handleFileUpload,
  L,
}: {
  section: CustomSection;
  onChange: (patch: Partial<CustomSection>) => void;
  onRemove: () => void;
  handleFileUpload: (
    file: File,
    kind: "photo" | "logo"
  ) => Promise<string | null>;
  L: (k: string, f: string) => string;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = React.useState(0);

  // The single source of truth for this section's images. Lifts legacy
  // `mediaPath` on first render so subsequent edits only write to `media[]`.
  const media = effectiveMedia(section);
  const remaining = 800 - (section.body?.length ?? 0);
  const slotsLeft = MAX_MEDIA_PER_SECTION - media.length;

  const setMedia = (next: SectionMedia[]) => {
    // Forward-only writes: drop the legacy mediaPath as soon as the user
    // touches the section so future reads go through `media[]` directly.
    onChange({ media: next.length ? next : undefined, mediaPath: undefined });
  };

  const handleFiles = async (files: FileList) => {
    const valid: File[] = [];
    for (const file of Array.from(files)) {
      if (!ALLOWED_MIME.includes(file.type)) continue;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) continue;
      valid.push(file);
    }
    if (valid.length === 0) return;

    // Cap at remaining slots.
    const accepted = valid.slice(0, slotsLeft);
    setUploadingCount((c) => c + accepted.length);

    const newItems: SectionMedia[] = [];
    for (const file of accepted) {
      const path = await handleFileUpload(file, "photo");
      if (path) newItems.push({ src: path });
      setUploadingCount((c) => Math.max(0, c - 1));
    }

    if (newItems.length > 0) {
      setMedia([...media, ...newItems]);
    }
  };

  const removeMediaAt = (idx: number) => {
    setMedia(media.filter((_, i) => i !== idx));
  };

  return (
    <div className="relative space-y-3 rounded-2xl border border-line bg-bg-1 p-4">
      <button
        type="button"
        onClick={onRemove}
        aria-label={L("customSectionRemove", "Kaldır")}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-ink/55 transition-colors hover:border-line-firm hover:text-ink"
      >
        <X size={12} />
      </button>

      <Input
        label={L("customSectionTitle", "Başlık")}
        maxLength={60}
        value={section.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder={L(
          "customSectionTitlePh",
          "Örn. Diller, Ödüller, Basın"
        )}
      />

      <div>
        <Textarea
          label={L("customSectionBody", "İçerik")}
          rows={3}
          maxLength={800}
          value={section.body}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder={L(
            "customSectionBodyPh",
            "Açıklama — kartını açan herkesin göreceği metin."
          )}
        />
        <p
          className={[
            "mt-1 text-right text-[10px] mono-label",
            remaining < 60 ? "text-copper" : "text-ink/40",
          ].join(" ")}
        >
          {section.body?.length ?? 0} / 800
        </p>
      </div>

      {/* Phase 8 — multi-image (max 6) per section. */}
      <div className="space-y-2">
        {media.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {media.map((item, idx) => {
              const url = item.src.startsWith("/") || item.src.startsWith("http")
                ? item.src
                : `/${item.src}`;
              return (
                <div
                  key={idx}
                  className="relative h-16 w-16 overflow-hidden rounded-lg border border-line bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={item.alt ?? ""}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeMediaAt(idx)}
                    aria-label={L("uploadRemove", "Remove")}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-white text-ink/65 shadow-sm transition-colors hover:border-line-firm hover:text-ink"
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
            {Array.from({ length: uploadingCount }).map((_, i) => (
              <div
                key={`up-${i}`}
                className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-copper/40 bg-copper/5 text-[9px] mono-label uppercase text-copper"
              >
                {L("uploading", "…")}
              </div>
            ))}
            {slotsLeft > uploadingCount ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-line bg-bg-0 text-ink/55 transition-colors hover:border-copper/60 hover:text-ink"
                aria-label={L("customSectionAddImage", "Resim ekle")}
              >
                <Camera size={16} />
              </button>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-bg-0 px-3 py-3 text-[11px] font-semibold text-ink/55 transition-colors hover:border-copper/50 hover:text-ink"
          >
            <Camera size={13} />
            {L(
              "customSectionAddImageMulti",
              "Resim ekle (en fazla 6, opsiyonel)"
            )}
          </button>
        )}

        <p className="mono-label text-[10px] uppercase tracking-wider text-ink/45">
          {L("customSectionPhotosCount", "{n} / 6")
            .replace("{n}", String(media.length + uploadingCount))}
        </p>

        <input
          ref={fileRef}
          type="file"
          accept={ALLOWED_MIME.join(",")}
          multiple
          className="sr-only"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) void handleFiles(files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
