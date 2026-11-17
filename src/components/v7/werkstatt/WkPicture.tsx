import type { Picture } from "@/content/v7/types";

/**
 * A labelled raster picture as a native <picture>: the optional phone cut as <source media="(max-width: 960px)">,
 * the width pairs as srcSet, explicit width and height (no layout shift). next.config sets images.unoptimized, so
 * next/image would emit neither srcset nor art direction; this is the one documented no-img-element exception
 * besides the video posters (PLAN 5.3). Only the one hero picture that is the LCP element is eager with
 * fetchPriority="high". The Etikett is the caller's job (LabelledFigure, the CTA band caption).
 */
export function WkPicture({ pic, className, imgClassName, sizes }: { pic: Picture; className?: string; imgClassName?: string; sizes?: string }) {
  const srcSet = pic.srcSet && pic.srcSet.length > 0 ? pic.srcSet.map((s) => `${s.src} ${s.w}w`).join(", ") : undefined;
  const sz = sizes ?? pic.sizes;
  return (
    <picture className={className}>
      {pic.mobile && <source media="(max-width: 960px)" srcSet={pic.mobile.src} width={pic.mobile.w} height={pic.mobile.h} />}
      {/* eslint-disable-next-line @next/next/no-img-element -- native srcset and art direction; the image optimizer is off (PLAN 5.3) */}
      <img
        src={pic.src}
        srcSet={srcSet}
        sizes={srcSet ? sz : undefined}
        width={pic.w}
        height={pic.h}
        alt={pic.alt}
        loading={pic.priority ? "eager" : "lazy"}
        decoding={pic.priority ? undefined : "async"}
        fetchPriority={pic.priority ? "high" : undefined}
        className={imgClassName}
      />
    </picture>
  );
}
