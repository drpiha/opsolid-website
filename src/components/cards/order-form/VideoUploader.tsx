"use client";

// =============================================================================
// VideoUploader — owner uploads a short self-hosted clip (mp4 / webm / mov)
// that renders on the card with native <video> controls. Complements the
// YouTube/Vimeo URL field (unlimited length) with a direct upload that is
// deliberately bounded:
//   - duration  ≤ MAX_DURATION_SEC   (checked client-side via loadedmetadata)
//   - file size ≤ MAX_SIZE_MB        (checked client + server)
// Anything longer/bigger belongs on YouTube via the URL field. The component
// is self-contained (owns its fetch to /api/uploads kind="video").
// =============================================================================

import * as React from "react";
import { Film, X, Loader2 } from "lucide-react";

const MAX_DURATION_SEC = 60;
const MAX_SIZE_MB = 60;
const ACCEPT = ["video/mp4", "video/webm", "video/quicktime"];

interface Props {
  videoPath: string | undefined;
  onChange: (path: string | undefined) => void;
  L: (k: string, fallback: string) => string;
}

function resolveSrc(path: string): string {
  if (/^(https?:|blob:|data:)/.test(path) || path.startsWith("/")) return path;
  return `/${path}`;
}

// Read a video file's duration without uploading it.
function probeDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement("video");
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(el.duration) ? el.duration : 0);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0); // unknown — let the server size-cap be the backstop
    };
    el.src = url;
  });
}

export function VideoUploader({ videoPath, onChange, L }: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);

    if (!ACCEPT.includes(file.type)) {
      setError(L("videoUploadType", "Sadece MP4, WebM veya MOV yükleyebilirsin."));
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(
        L("videoUploadSize", `Video çok büyük (en fazla ${MAX_SIZE_MB} MB).`).replace(
          "{mb}",
          String(MAX_SIZE_MB),
        ),
      );
      return;
    }

    const duration = await probeDuration(file);
    if (duration > MAX_DURATION_SEC + 0.5) {
      setError(
        L("videoUploadDuration", `Video en fazla ${MAX_DURATION_SEC} saniye olmalı.`).replace(
          "{sec}",
          String(MAX_DURATION_SEC),
        ),
      );
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", "video");
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? L("videoUploadFailed", "Video yüklenemedi."));
        return;
      }
      const { path } = (await res.json()) as { path?: string };
      if (path) onChange(path);
    } catch {
      setError(L("videoUploadFailed", "Video yüklenemedi."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {videoPath ? (
        <div className="relative overflow-hidden rounded-xl border border-line bg-black">
          <video
            src={resolveSrc(videoPath)}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full bg-black"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label={L("videoUploadRemove", "Videoyu kaldır")}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white/90 text-ink-300 shadow-sm transition-colors hover:border-signal-err hover:text-signal-err"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-bg-0 px-4 py-4 text-sm font-semibold text-ink-300 transition-colors hover:border-copper/60 hover:text-ink disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              {L("videoUploading", "Yükleniyor…")}
            </>
          ) : (
            <>
              <Film size={15} />
              {L("videoUploadCta", "Galeriden video yükle")}
            </>
          )}
        </button>
      )}

      <p className="text-[11px] text-ink-300">
        {L(
          "videoUploadLimits",
          `En fazla ${MAX_DURATION_SEC} sn ve ${MAX_SIZE_MB} MB. Daha uzun videolar için YouTube bağlantısı kullan.`,
        )
          .replace("{sec}", String(MAX_DURATION_SEC))
          .replace("{mb}", String(MAX_SIZE_MB))}
      </p>

      {error && <p className="text-xs text-signal-err">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT.join(",")}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
