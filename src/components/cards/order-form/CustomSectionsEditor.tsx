"use client";

// =============================================================================
// Phase 7.9 — Custom sections editor (shared between the create form and the
// post-purchase edit page). Lets the customer add up to 6 free-form titled
// blocks of text, each with an optional inline image.
// =============================================================================

import * as React from "react";
import { X, Camera } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import type { CardData, CustomSection } from "@/lib/validation";

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
  const [uploading, setUploading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const remaining = 800 - (section.body?.length ?? 0);

  const handleFile = async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;

    // instant preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") setPreviewUrl(result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    const path = await handleFileUpload(file, "photo");
    setUploading(false);
    if (path) {
      onChange({ mediaPath: path });
      setPreviewUrl(null);
    }
  };

  const displayed = (() => {
    if (previewUrl) return previewUrl;
    if (!section.mediaPath) return null;
    if (
      section.mediaPath.startsWith("data:") ||
      section.mediaPath.startsWith("blob:") ||
      section.mediaPath.startsWith("http") ||
      section.mediaPath.startsWith("/")
    ) {
      return section.mediaPath;
    }
    return `/${section.mediaPath}`;
  })();

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

      {/* Optional inline image — Phase 7.9 C3 */}
      <div className="flex items-center gap-3">
        {displayed ? (
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-line bg-white px-3 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayed}
              alt=""
              className="h-12 w-12 rounded-lg object-cover"
            />
            <span className="flex-1 truncate text-[11px] text-ink/55">
              {uploading
                ? L("uploading", "Wird hochgeladen…")
                : L("uploadDone", "Hochgeladen")}
            </span>
            <button
              type="button"
              onClick={() => {
                onChange({ mediaPath: undefined });
                setPreviewUrl(null);
              }}
              aria-label={L("uploadRemove", "Remove")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-ink/55 transition-colors hover:border-line-firm hover:text-ink"
            >
              <X size={11} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-bg-0 px-3 py-2.5 text-[11px] font-semibold text-ink/55 transition-colors hover:border-copper/50 hover:text-ink"
          >
            <Camera size={13} />
            {L("customSectionAddImage", "Resim ekle (opsiyonel)")}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
