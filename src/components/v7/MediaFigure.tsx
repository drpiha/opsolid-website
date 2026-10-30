import Image from "next/image";
import type { Img, Media } from "@/content/v7/types";
import { SITE_STR } from "@/content/v7/site";
import type { L3 } from "@/lib/v7-routes";
import { BrowserFrame } from "./frames/Browser";
import { PhoneFrame } from "./frames/Phone";
import { Flow } from "./figures/Flow";
import { Squares } from "./figures/Squares";
import { VideoFigure } from "./VideoFigure";

function Poster({ img, portrait, priority }: { img: Img; portrait?: Img; priority?: boolean }) {
  return (
    <picture>
      {portrait && <source media="(max-width: 767px) and (orientation: portrait)" srcSet={portrait.src} width={portrait.w} height={portrait.h} />}
      {/* eslint-disable-next-line @next/next/no-img-element -- poster pair with art direction; same-origin file */}
      <img
        src={img.src}
        width={img.w}
        height={img.h}
        alt={img.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

/**
 * One figure with an editorial caption ("Abb. 1.1 Text · KI-generiert"). Handles the SVG figures, images
 * (plain, browser or phone frame) and the poster-first video slot. The aspect ratio is reserved up front.
 */
export function MediaFigure({ media, locale, className = "", priority }: { media: Media; locale: L3; className?: string; priority?: boolean }) {
  const t = SITE_STR[locale];
  const ai = media.kind !== "svg" && media.ai;
  const caption = media.caption || media.fig || ai ? (
    <figcaption className="f-mono mt-2 border-t border-[#E3DCD1] pt-3 text-[12px] uppercase leading-[1.6] text-[#6B665F]">
      {media.fig && (
        <span className="mr-2 text-[#8A4524]">
          {t.figure} {media.fig}
        </span>
      )}
      {media.caption}
      {ai && (
        <span className="ml-2 whitespace-nowrap rounded-full border border-[#B5623A]/50 px-2 py-0.5 text-[12px] text-[#8A4524]">{t.aiLabel}</span>
      )}
    </figcaption>
  ) : null;

  let body: React.ReactNode;
  if (media.kind === "svg") {
    body = media.name === "squares" ? <Squares alt={media.alt} locale={locale} labels={media.labels} /> : <Flow alt={media.alt} locale={locale} labels={media.labels} />;
  } else if (media.kind === "image") {
    const sizes = media.frame === "phone" ? "(min-width: 1024px) 240px, 60vw" : "(min-width: 1024px) 720px, 100vw";
    if (media.frame === "browser") body = <BrowserFrame img={media.img} />;
    else if (media.frame === "phone") body = <div className="mx-auto w-[min(240px,62%)]"><PhoneFrame img={media.img} sizes={sizes} /></div>;
    else
      body = (
        <div className="overflow-hidden rounded-[20px] border border-[#E3DCD1] bg-white">
          <Image src={media.img.src} width={media.img.w} height={media.img.h} alt={media.img.alt} sizes={sizes} priority={priority} className="h-auto w-full" />
        </div>
      );
  } else {
    const { poster, posterPortrait } = media;
    body = (
      <div
        className="v7-ar relative overflow-hidden rounded-[20px] border border-[#E3DCD1] bg-[#EFE9E0]"
        style={{ ["--ar" as string]: `${poster.w} / ${poster.h}`, ["--arp" as string]: posterPortrait ? `${posterPortrait.w} / ${posterPortrait.h}` : undefined }}
      >
        <VideoFigure
          src={{ webm: media.webm, mp4: media.mp4, webmP: media.webmPortrait, mp4P: media.mp4Portrait }}
          label={media.alt}
          pauseLabel={t.videoPause}
          playLabel={t.videoPlay}
        >
          <Poster img={poster} portrait={posterPortrait} priority={priority} />
        </VideoFigure>
      </div>
    );
  }

  return (
    <figure className={className}>
      {body}
      {caption}
    </figure>
  );
}
