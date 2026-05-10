"use client";

// =============================================================================
// AlbumSection — public-facing photo album rendered at the bottom of every
// PUBLISHED smart card.
//
//   • Pulls APPROVED photos from /api/cards/[slug]/album (paginated, 12 per
//     page) and renders them in an adaptive grid that matches the visual
//     language of CustomSectionsBlock (1 = full-bleed, 2-3 = 2-col,
//     4+ = 3-col).
//   • Lightbox on tap, Radix Dialog so screen readers + keyboard work.
//   • Visitor "Add a photo" CTA opens VisitorUploadModal which posts to the
//     same endpoint without ?asOwner=1 — entries land as PENDING for the
//     owner to approve.
//
// Returns null when the album is empty AND we want to keep the visitor CTA
// reachable (we still render the dashed "Add a photo" button so the album
// can grow organically — this is the only path for a guest to seed it).
// =============================================================================

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Camera, Loader2, X, Upload } from "lucide-react";

interface AlbumPhoto {
  id: string;
  photoPath: string | null;
  caption: string | null;
  uploaderName: string | null;
  connectionId: string | null;
  connectionName: string | null;
  approvedAt: string | null;
}

interface ApiResponse {
  photos: AlbumPhoto[];
  total: number;
  hasMore: boolean;
}

interface Props {
  /** Card slug — used for both /api/cards/[slug]/album endpoints. */
  slug: string;
  /** Brand accent for the hairline above the section title. */
  accentHex?: string;
  /** Tone — must match the host template's surface palette. */
  tone?: "light" | "dark";
}

const PAGE_SIZE = 12;

export function AlbumSection({ slug, accentHex, tone = "light" }: Props) {
  const isDark = tone === "dark";
  const accent = accentHex ?? "#C27940";

  const [photos, setPhotos] = React.useState<AlbumPhoto[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = React.useState(false);

  // ---------------------------------------------------------------------------
  // Initial fetch — first page on mount. Subsequent "Daha fazla göster" clicks
  // bump `page` and append.
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/cards/${slug}/album?page=1&pageSize=${PAGE_SIZE}`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? (res.json() as Promise<ApiResponse>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        setPhotos(data.photos);
        setHasMore(data.hasMore);
        setPage(1);
      })
      .catch(() => {
        /* swallow — album is non-critical, card still renders */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await fetch(
        `/api/cards/${slug}/album?page=${next}&pageSize=${PAGE_SIZE}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = (await res.json()) as ApiResponse;
      setPhotos((prev) => [...prev, ...data.photos]);
      setHasMore(data.hasMore);
      setPage(next);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, page, slug]);

  // ---------------------------------------------------------------------------
  // Insert a freshly-uploaded visitor photo as PENDING locally so the modal
  // can show "your photo is awaiting approval" without forcing a refetch.
  // The list itself doesn't change — visitor uploads only surface to the
  // public after the owner approves.
  // ---------------------------------------------------------------------------
  const onUploaded = React.useCallback(() => {
    setUploadOpen(false);
  }, []);

  const open = openIdx !== null ? photos[openIdx] : null;

  // ---------------------------------------------------------------------------
  // Loading skeleton — minimal, 3-cell grid with copper-tinted pulse.
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <section
        className={[
          "px-7 py-7",
          isDark
            ? "border-t border-white/10"
            : "border-t border-black/[0.08] bg-black/[0.015]",
        ].join(" ")}
        aria-busy="true"
      >
        <SectionHeader accent={accent} isDark={isDark} />
        <div className="mt-4 grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={[
                "aspect-square animate-pulse rounded-md",
                isDark ? "bg-white/[0.06]" : "bg-black/[0.04]",
              ].join(" ")}
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty album — render the visitor CTA only. A blank state with no entry
  // point would be a dead end; the dashed "Nerede tanıştınız?" tile is the
  // primary acquisition surface for the album to ever fill.
  // ---------------------------------------------------------------------------
  const hasPhotos = photos.length > 0;

  return (
    <section
      className={[
        "px-7 py-7 space-y-5",
        isDark
          ? "border-t border-white/10"
          : "border-t border-black/[0.08] bg-black/[0.015]",
      ].join(" ")}
    >
      {hasPhotos && <SectionHeader accent={accent} isDark={isDark} />}

      {hasPhotos && (
        <PhotoGrid
          photos={photos}
          onOpen={(i) => setOpenIdx(i)}
          isDark={isDark}
          accent={accent}
        />
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
              isDark
                ? "border border-white/15 text-white/75 hover:border-white/30 hover:text-white"
                : "border border-black/15 text-black/65 hover:border-black/35 hover:text-black",
            ].join(" ")}
          >
            {loadingMore ? (
              <Loader2 size={12} className="animate-spin" />
            ) : null}
            Daha fazla göster
          </button>
        </div>
      )}

      <VisitorCta
        isDark={isDark}
        accent={accent}
        onClick={() => setUploadOpen(true)}
        compact={hasPhotos}
      />

      <Lightbox
        photo={open}
        onClose={() => setOpenIdx(null)}
        accent={accent}
      />

      <VisitorUploadModal
        slug={slug}
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploaded={onUploaded}
        accent={accent}
      />
    </section>
  );
}

// =============================================================================
// SectionHeader — copper hairline + uppercase eyebrow, mirrors
// CustomSectionsBlock visual language so the two sections stack cleanly.
// =============================================================================
function SectionHeader({
  accent,
  isDark,
}: {
  accent: string;
  isDark: boolean;
}) {
  return (
    <header className="flex items-center gap-2">
      <span
        aria-hidden
        className="inline-block h-px w-6"
        style={{ background: accent }}
      />
      <h3
        className={[
          "text-[11px] font-semibold uppercase tracking-[0.18em]",
          isDark ? "text-white/85" : "text-black/80",
        ].join(" ")}
        style={{
          fontFamily:
            "var(--tpl-font-display, var(--card-display-font, inherit))",
        }}
      >
        FOTOĞRAFLAR
      </h3>
    </header>
  );
}

// =============================================================================
// PhotoGrid — adaptive layout shared with CustomSectionsBlock semantics.
//   1     full-bleed h-52 spotlight
//   2-3   2-col aspect-square
//   4+    3-col aspect-square
// =============================================================================
function PhotoGrid({
  photos,
  onOpen,
  isDark,
  accent,
}: {
  photos: AlbumPhoto[];
  onOpen: (i: number) => void;
  isDark: boolean;
  accent: string;
}) {
  if (photos.length === 1) {
    const p = photos[0];
    return (
      <div className="space-y-2">
        <PhotoTile
          photo={p}
          onOpen={() => onOpen(0)}
          isDark={isDark}
          variant="full"
        />
        <PhotoMeta photo={p} isDark={isDark} accent={accent} />
      </div>
    );
  }

  if (photos.length <= 3) {
    return (
      <div className="grid grid-cols-2 gap-1.5">
        {photos.map((p, i) => (
          <PhotoCell
            key={p.id}
            photo={p}
            onOpen={() => onOpen(i)}
            isDark={isDark}
            accent={accent}
            variant="square"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {photos.map((p, i) => (
        <PhotoCell
          key={p.id}
          photo={p}
          onOpen={() => onOpen(i)}
          isDark={isDark}
          accent={accent}
          variant="square"
        />
      ))}
    </div>
  );
}

// =============================================================================
// PhotoCell — image button + caption / connection / date stack underneath.
// =============================================================================
function PhotoCell({
  photo,
  onOpen,
  isDark,
  accent,
  variant,
}: {
  photo: AlbumPhoto;
  onOpen: () => void;
  isDark: boolean;
  accent: string;
  variant: "full" | "square";
}) {
  return (
    <div className="space-y-1.5">
      <PhotoTile photo={photo} onOpen={onOpen} isDark={isDark} variant={variant} />
      <PhotoMeta photo={photo} isDark={isDark} accent={accent} />
    </div>
  );
}

function PhotoTile({
  photo,
  onOpen,
  isDark,
  variant,
}: {
  photo: AlbumPhoto;
  onOpen: () => void;
  isDark: boolean;
  variant: "full" | "square";
}) {
  const ringClass = isDark
    ? "ring-1 ring-white/10 hover:ring-white/30"
    : "ring-1 ring-black/5 hover:ring-black/15";
  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={`block w-full overflow-hidden rounded-xl ${ringClass} transition`}
      >
        {photo.photoPath ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo.photoPath}
            alt={photo.caption ?? (photo.connectionName ? `Photo by ${photo.connectionName}` : "Album photo")}
            loading="lazy"
            className="h-52 w-full object-cover"
          />
        ) : null}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`block overflow-hidden rounded-md ${ringClass} transition`}
    >
      {photo.photoPath ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={photo.photoPath}
          alt={photo.caption ?? (photo.connectionName ? `Photo by ${photo.connectionName}` : "Album photo")}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      ) : null}
    </button>
  );
}

// =============================================================================
// PhotoMeta — caption / connection-name / approved-date stack. Each line is
// optional, the whole block is hidden if everything is empty.
// =============================================================================
function PhotoMeta({
  photo,
  isDark,
  accent,
}: {
  photo: AlbumPhoto;
  isDark: boolean;
  accent: string;
}) {
  const captionColor = isDark ? "text-white/65" : "text-black/60";
  const dateColor = isDark ? "text-white/35" : "text-black/40";

  if (!photo.caption && !photo.connectionName && !photo.approvedAt) return null;

  let dateLabel: string | null = null;
  if (photo.approvedAt) {
    try {
      dateLabel = new Date(photo.approvedAt).toLocaleDateString();
    } catch {
      dateLabel = null;
    }
  }

  return (
    <div className="space-y-0.5">
      {photo.caption && (
        <p
          className={`line-clamp-2 text-[12px] leading-snug ${captionColor}`}
          style={{
            fontFamily: "var(--tpl-font-body, var(--card-body-font, inherit))",
          }}
        >
          {photo.caption}
        </p>
      )}
      {photo.connectionName && (
        <p
          className="text-[11px] font-medium leading-snug"
          style={{ color: accent }}
        >
          <span aria-hidden>📎</span> {photo.connectionName} ile
        </p>
      )}
      {dateLabel && (
        <p
          className={`mono-label text-[10px] uppercase tracking-wider ${dateColor}`}
        >
          {dateLabel}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// VisitorCta — dashed "add a photo" tile. Always rendered (with or without
// existing photos) so visitors have a consistent way to contribute.
// `compact` shrinks the visuals when the album already has photos so it
// reads as a secondary action rather than a hero state.
// =============================================================================
function VisitorCta({
  isDark,
  accent,
  onClick,
  compact,
}: {
  isDark: boolean;
  accent: string;
  onClick: () => void;
  compact: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full items-center gap-3 rounded-xl border border-dashed text-left transition",
        compact ? "px-4 py-3" : "px-5 py-5",
        isDark
          ? "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]"
          : "border-black/15 bg-black/[0.01] hover:border-black/30 hover:bg-black/[0.03]",
      ].join(" ")}
    >
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
        style={{ background: accent }}
      >
        <Camera size={16} />
      </span>
      <span className="min-w-0">
        <span
          className={[
            "block text-[13px] font-semibold leading-tight",
            isDark ? "text-white/90" : "text-black/85",
          ].join(" ")}
        >
          Nerede tanıştınız? Fotoğraf ekleyin
        </span>
        <span
          className={[
            "block text-[11px] leading-snug",
            isDark ? "text-white/55" : "text-black/50",
          ].join(" ")}
        >
          Sahibin onayından sonra herkese görünür.
        </span>
      </span>
    </button>
  );
}

// =============================================================================
// Lightbox — full-bleed Radix dialog identical in feel to CustomSectionsBlock.
// =============================================================================
function Lightbox({
  photo,
  onClose,
  accent,
}: {
  photo: AlbumPhoto | null;
  onClose: () => void;
  accent: string;
}) {
  return (
    <Dialog.Root open={photo !== null} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" />
        <Dialog.Content
          aria-label="Photo preview"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none"
        >
          <Dialog.Title className="sr-only">Photo preview</Dialog.Title>
          {photo?.photoPath ? (
            <div className="relative max-h-[90vh] max-w-[95vw]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.photoPath}
                alt={photo.caption ?? (photo.connectionName ? `Photo by ${photo.connectionName}` : "Album photo")}
                className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
              />
              {(photo.caption || photo.connectionName) && (
                <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/80 to-transparent px-4 py-3 text-white">
                  {photo.caption && (
                    <p className="text-[13px] leading-snug">{photo.caption}</p>
                  )}
                  {photo.connectionName && (
                    <p
                      className="mt-0.5 text-[11px] font-medium"
                      style={{ color: accent }}
                    >
                      <span aria-hidden>📎</span> {photo.connectionName} ile
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : null}
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
            >
              <X size={18} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// =============================================================================
// VisitorUploadModal — Radix dialog wrapping a small upload form. Mobile
// browsers honour `capture="environment"` to open the back camera directly
// when the input is tapped.
// =============================================================================
function VisitorUploadModal({
  slug,
  open,
  onOpenChange,
  onUploaded,
  accent,
}: {
  slug: string;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onUploaded: () => void;
  accent: string;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [caption, setCaption] = React.useState("");
  const [uploaderName, setUploaderName] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Reset internal state every time the modal closes so the next opening is
  // clean (esp. after a successful submit).
  React.useEffect(() => {
    if (open) return;
    setFile(null);
    setCaption("");
    setUploaderName("");
    setUploading(false);
    setSuccess(false);
    setErrorMsg(null);
  }, [open]);

  // Manage the object URL lifecycle to avoid leaks on rapid re-selection.
  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (next: File | null) => {
    setErrorMsg(null);
    if (!next) {
      setFile(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) {
      setErrorMsg("Sadece JPEG, PNG veya WEBP yükleyebilirsiniz.");
      return;
    }
    if (next.size > 5 * 1024 * 1024) {
      setErrorMsg("Dosya çok büyük (max 5 MB).");
      return;
    }
    setFile(next);
  };

  const submit = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setErrorMsg(null);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      if (caption.trim()) fd.append("caption", caption.trim().slice(0, 500));
      if (uploaderName.trim())
        fd.append("uploaderName", uploaderName.trim().slice(0, 120));

      const res = await fetch(`/api/cards/${slug}/album`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMsg(body.error ?? "Yükleme başarısız.");
        setUploading(false);
        return;
      }
      setSuccess(true);
      // Brief moment for the user to read the confirmation before we close.
      setTimeout(() => {
        onUploaded();
      }, 1500);
    } catch {
      setErrorMsg("Yükleme başarısız.");
      setUploading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white p-5 shadow-2xl outline-none"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/85">
              Fotoğraf ekle
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Kapat"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-black/45 hover:bg-black/[0.05] hover:text-black/80"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {success ? (
            <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
                style={{ background: accent }}
              >
                <Camera size={20} />
              </span>
              <p className="text-[14px] font-semibold text-black/85">
                Fotoğrafınız sahip onayına gönderildi 🙏
              </p>
              <p className="text-[12px] text-black/55">
                Onaylandığında albümde görünür.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {previewUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Önizleme"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleFile(null)}
                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75"
                    aria-label="Fotoğrafı kaldır"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 bg-black/[0.015] px-4 py-8 text-center transition hover:border-black/40 hover:bg-black/[0.04]">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
                    style={{ background: accent }}
                  >
                    <Camera size={18} />
                  </span>
                  <span className="text-[13px] font-semibold text-black/80">
                    Fotoğraf seçin
                  </span>
                  <span className="text-[11px] text-black/50">
                    JPEG · PNG · WEBP · max 5 MB
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    className="sr-only"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}

              <div className="space-y-2">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-black/55">
                    Açıklama (opsiyonel)
                  </span>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value.slice(0, 500))}
                    rows={2}
                    placeholder="Nerede, ne zaman, nasıl tanıştınız?"
                    className="w-full resize-none rounded-xl border border-black/15 bg-white px-3 py-2 text-[13px] text-black/85 placeholder:text-black/35 focus:border-black/35 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-black/55">
                    İsminiz (opsiyonel)
                  </span>
                  <input
                    type="text"
                    value={uploaderName}
                    onChange={(e) =>
                      setUploaderName(e.target.value.slice(0, 120))
                    }
                    placeholder="Adınız Soyadınız"
                    className="w-full rounded-full border border-black/15 bg-white px-4 py-2 text-[13px] text-black/85 placeholder:text-black/35 focus:border-black/35 focus:outline-none"
                  />
                </label>
              </div>

              {errorMsg && (
                <p className="text-[12px] text-red-600">{errorMsg}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={uploading}
                  className="rounded-full px-4 py-2 text-[12px] font-semibold text-black/55 hover:text-black/85 disabled:opacity-50"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={!file || uploading}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: accent }}
                >
                  {uploading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Upload size={12} />
                  )}
                  {uploading ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
