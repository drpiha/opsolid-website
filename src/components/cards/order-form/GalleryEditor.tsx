"use client";

// =============================================================================
// Gallery editor — up to 24 manually uploaded photos rendered on the public
// card. Mirrors the thumbnail-strip pattern used by CustomSectionsEditor's
// per-section media so the customer sees a consistent UX between gallery and
// section photos.
//
// v1 scope:
//   - thumbnail grid (h-20 w-20) with X buttons
//   - bulk upload through a single hidden <input multiple>
//   - in-flight tiles for files that haven't resolved yet
//   - hard cap at 24, per-file 5 MB + jpeg/png/webp validation
//   - no drag-reorder, no per-item alt text editor (kept intentionally simple)
// =============================================================================

import * as React from "react";
import { X, Camera } from "lucide-react";
import type { CardGalleryItem } from "@/lib/validation";

const MAX_GALLERY_ITEMS = 24;
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  gallery: CardGalleryItem[] | undefined;
  onGalleryChange: (next: CardGalleryItem[] | undefined) => void;
  handleFileUpload: (
    file: File,
    kind: "photo" | "logo"
  ) => Promise<string | null>;
  L: (k: string, fallback: string) => string;
}

export function GalleryEditor({
  gallery,
  onGalleryChange,
  handleFileUpload,
  L,
}: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = React.useState(0);

  const media = gallery ?? [];
  const slotsLeft = MAX_GALLERY_ITEMS - media.length - uploadingCount;
  const atLimit = media.length + uploadingCount >= MAX_GALLERY_ITEMS;

  // Keep a ref in sync so back-to-back upload batches append to the latest
  // gallery, not a stale closure value captured at the start of the batch.
  const galleryRef = React.useRef<CardGalleryItem[]>(media);
  React.useEffect(() => {
    galleryRef.current = gallery ?? [];
  }, [gallery]);

  const setMedia = (next: CardGalleryItem[]) => {
    onGalleryChange(next.length ? next : undefined);
  };

  const handleFiles = async (files: FileList) => {
    const valid: File[] = [];
    for (const file of Array.from(files)) {
      if (!ALLOWED_MIME.includes(file.type)) continue;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) continue;
      valid.push(file);
    }
    if (valid.length === 0) return;

    // Cap at remaining slots so we never overshoot the schema's max(24).
    const accepted = valid.slice(0, Math.max(0, slotsLeft));
    if (accepted.length === 0) return;

    setUploadingCount((c) => c + accepted.length);

    // Upload in parallel; resolve order doesn't matter — we append once all
    // settle so the order matches the user's selection order.
    const results = await Promise.all(
      accepted.map((file) => handleFileUpload(file, "photo"))
    );
    setUploadingCount((c) => Math.max(0, c - accepted.length));

    const newItems: CardGalleryItem[] = results
      .filter((path): path is string => Boolean(path))
      .map((src) => ({ src }));

    if (newItems.length > 0) {
      const merged = [...galleryRef.current, ...newItems].slice(
        0,
        MAX_GALLERY_ITEMS
      );
      galleryRef.current = merged;
      onGalleryChange(merged.length ? merged : undefined);
    }
  };

  const removeAt = (idx: number) => {
    setMedia(media.filter((_, i) => i !== idx));
  };

  const onPick = () => fileRef.current?.click();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {media.map((item, idx) => {
          const url =
            item.src.startsWith("/") || item.src.startsWith("http")
              ? item.src
              : `/${item.src}`;
          return (
            <div
              key={`${item.src}-${idx}`}
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-line bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={item.alt ?? ""}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(idx)}
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
            key={`gallery-up-${i}`}
            className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-copper/40 bg-copper/5 text-[9px] mono-label uppercase text-copper"
          >
            {L("uploading", "…")}
          </div>
        ))}

        {!atLimit && (
          <button
            type="button"
            onClick={onPick}
            aria-label={L("galleryAddImage", "Fotoğraf ekle")}
            className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-line bg-bg-0 text-ink/55 transition-colors hover:border-copper/60 hover:text-ink"
          >
            <Camera size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="mono-label text-[10px] uppercase tracking-wider text-ink/45">
          {media.length + uploadingCount} / {MAX_GALLERY_ITEMS}
        </span>
        <button
          type="button"
          onClick={onPick}
          disabled={atLimit}
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all",
            atLimit
              ? "cursor-not-allowed border border-line bg-bg-1 text-ink/35"
              : "border border-copper/40 bg-copper/10 text-ink hover:border-copper hover:bg-copper/20",
          ].join(" ")}
        >
          <Camera size={13} />
          {L("galleryAdd", "Fotoğraf ekle")}
        </button>
      </div>

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
  );
}
