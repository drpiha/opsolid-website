// =============================================================================
// Client-side image downscaling — runs in the browser BEFORE upload.
//
// Why client-side (not sharp on the server): the card builder is anonymous-
// first, so uploads happen with no native image pipeline guaranteed in the
// deploy image. Shrinking in the browser also cuts the bytes actually sent
// over the wire — the real cause of "photos load slowly": a 4 MB phone JPEG
// was stored and then served full-size into a 128 px thumbnail. We cap the
// long edge and re-encode at a sane quality, typically 4 MB -> ~200-400 KB.
//
// Safe by construction: GIF/SVG and already-small images pass through
// untouched, and any failure falls back to the original File so an upload is
// never blocked by the optimizer.
// =============================================================================

export interface DownscaleOptions {
  /** Longest edge in pixels after scaling. */
  maxEdge?: number;
  /** JPEG/WebP quality 0..1 (ignored for PNG). */
  quality?: number;
  /** Skip work when the file is already under this many bytes. */
  skipUnderBytes?: number;
}

const DEFAULTS: Required<DownscaleOptions> = {
  maxEdge: 1600,
  quality: 0.82,
  skipUnderBytes: 500 * 1024, // 500 KB — small enough to serve fast as-is
};

/**
 * Returns a (usually smaller) File. Never throws — on any error the original
 * File is returned so the upload still proceeds.
 */
export async function downscaleImage(
  file: File,
  opts: DownscaleOptions = {},
): Promise<File> {
  const { maxEdge, quality, skipUnderBytes } = { ...DEFAULTS, ...opts };

  // Formats we must not touch: SVG (vector) and GIF (animation would be lost).
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= skipUnderBytes) return file;
  if (typeof document === "undefined") return file; // SSR guard

  try {
    const bitmap = await loadBitmap(file);
    const { width, height } = bitmap;
    const longest = Math.max(width, height);
    const scale = longest > maxEdge ? maxEdge / longest : 1;

    // Already small enough in dimensions AND under the byte gate handled above
    // would have returned; here we still re-encode to drop bloated bytes.
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      closeBitmap(bitmap);
      return file;
    }
    ctx.drawImage(bitmap as CanvasImageSource, 0, 0, targetW, targetH);
    closeBitmap(bitmap);

    // Preserve transparency for PNG (logos); everything else -> JPEG, which
    // compresses photos far better than PNG.
    const outMime = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await canvasToBlob(canvas, outMime, quality);
    if (!blob || blob.size >= file.size) return file; // no win — keep original

    const ext = outMime === "image/png" ? "png" : "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.${ext}`, {
      type: outMime,
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

async function loadBitmap(
  file: File,
): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through to <img> path (e.g. Safari quirks) */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode failed"));
      el.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function closeBitmap(b: ImageBitmap | HTMLImageElement): void {
  if (typeof ImageBitmap !== "undefined" && b instanceof ImageBitmap) {
    b.close();
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mime, quality);
  });
}
