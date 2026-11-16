import { Img as Image } from "@/components/v7/Img";
import type { Img, Media } from "@/content/v7/types";
import { SITE_STR } from "@/content/v7/site";
import type { L3 } from "@/lib/v7-routes";
import { BrowserFrame } from "./frames/Browser";
import { PhoneFrame } from "./frames/Phone";
import { Flow } from "./figures/Flow";
import { Squares } from "./figures/Squares";
import { VideoFigure } from "./VideoFigure";
import { Etikett } from "./werkstatt/Etikett";

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

/** The label word the Etikett starts with, per kind of figure (rule 6: every schema and screen says what it is). */
const KIND: Record<L3, { svg: string; screen: string }> = {
  de: { svg: "Schema", screen: "App-Screen" },
  en: { svg: "Schema", screen: "App screen" },
  tr: { svg: "Şema", screen: "Uygulama ekranı" },
};
/** A caption that already names its kind ("Schema · ...", "Konzept-Render ...") gets no second label. */
const NAMED = /^(schema|şema|render|konzept|concept|muster|beispiel|example|sample|örnek|app|uygulama|foto|photo)/i;

/**
 * One figure with its Etikett under it (design C): "Schema · <caption>" for the drawn figures, "App-Screen ·
 * <caption>" for framed screens, plus the "KI-generiert" chip for AI-made media. The old "Abb. x.y" numbering is no
 * longer shown (`fig` stays in the data). Handles the SVG figures, images (plain, browser or phone frame) and the
 * poster-first video slot. The aspect ratio is reserved up front.
 */
export function MediaFigure({ media, locale, className = "", priority }: { media: Media; locale: L3; className?: string; priority?: boolean }) {
  const t = SITE_STR[locale];
  const ai = media.kind !== "svg" && media.ai;
  const kind = media.kind === "svg" ? KIND[locale].svg : media.kind === "image" && media.frame && media.frame !== "none" ? KIND[locale].screen : "";
  const text = media.caption ? (kind && !NAMED.test(media.caption.trim()) ? `${kind} · ${media.caption}` : media.caption) : kind;
  const caption =
    text || ai ? (
      <figcaption className="wk-media-cap">
        {text && <Etikett>{text}</Etikett>}
        {ai && <span className="wk-chip is-note">{t.aiLabel}</span>}
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
        <div className="overflow-hidden rounded-[10px] border border-wk-line bg-wk-sheet">
          <Image src={media.img.src} width={media.img.w} height={media.img.h} alt={media.img.alt} sizes={sizes} priority={priority} className="h-auto w-full" />
        </div>
      );
  } else {
    const { poster, posterPortrait } = media;
    body = (
      <div
        className="v7-ar relative overflow-hidden rounded-[10px] border border-wk-line bg-wk-paper-2"
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
    <figure className={`wk-media${className ? ` ${className}` : ""}`}>
      {body}
      {caption}
    </figure>
  );
}
