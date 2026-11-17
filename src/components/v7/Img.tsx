import ReactDOM from "react-dom";
import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  decoding?: "async" | "sync" | "auto";
  /** Accepted for parity with next/image; with images.unoptimized there is no srcset, so it is not emitted. */
  sizes?: string;
  style?: CSSProperties;
};

type PreloadFn = (href: string, opts: { as: "image"; fetchPriority: "high" }) => void;

/**
 * Server-rendered twin of next/image for the marketing pages. next.config sets images.unoptimized, so next/image
 * emits a plain <img> with the original src, no srcset and no sizes; this renders the same element and attributes
 * (loading, decoding, data-nimg, the transparent alt colour, the fill box, fetchPriority plus a preload for
 * `priority`) without shipping the next/image client component (about 6 kB gz and one request) on every page.
 */
export function Img({ src, alt, width, height, fill, priority, className, decoding = "async", style }: Props) {
  if (priority) (ReactDOM as unknown as { preload?: PreloadFn }).preload?.(src, { as: "image", fetchPriority: "high" });
  const box: CSSProperties = fill ? { position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0 } : {};
  return (
    // eslint-disable-next-line @next/next/no-img-element -- the image optimizer is off (images.unoptimized); same output as next/image
    <img
      alt={alt}
      loading={priority ? undefined : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      decoding={decoding}
      data-nimg={fill ? "fill" : "1"}
      className={className}
      style={{ ...box, color: "transparent", ...style }}
      src={src}
    />
  );
}
