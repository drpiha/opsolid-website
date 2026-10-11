"use client";

/**
 * HeroVideo — OpSo product video in the home hero.
 *
 * The file is served by the OpSo landing (card.opsolid.de). Until that is
 * deployed (or if it ever fails) we fall back to a local OpSo demo capture.
 * With prefers-reduced-motion we never autoplay: poster + play button only.
 */

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import claraMobile from "@/assets/opso/clara-weber-mobile.png";

export const OPSO_HERO_VIDEO_URL = "https://card.opsolid.de/media/opso-hero.mp4";
export const OPSO_HERO_POSTER_URL = "https://card.opsolid.de/media/opso-hero-poster.webp";

const COPY = {
  de: { play: "Video abspielen", alt: "OpSo: digitale Visitenkarte auf dem Smartphone", label: "OpSo Produktvideo" },
  en: { play: "Play video", alt: "OpSo: digital business card on a smartphone", label: "OpSo product video" },
  tr: { play: "Videoyu oynat", alt: "OpSo: akıllı telefonda dijital kartvizit", label: "OpSo ürün videosu" },
} as const;

export function HeroVideo() {
  const { locale } = useLocale();
  const c = COPY[locale === "de" || locale === "tr" ? locale : "en"];
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (failed) {
    return (
      <div className="v2-hero-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={claraMobile.src} alt={c.alt} width={claraMobile.width} height={claraMobile.height} />
      </div>
    );
  }

  const showPlay = reduced && !playing;

  return (
    <div className="v2-hero-video">
      <video
        ref={ref}
        src={OPSO_HERO_VIDEO_URL}
        poster={OPSO_HERO_POSTER_URL}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={c.label}
        onError={() => setFailed(true)}
        controls={reduced && playing}
      />
      {showPlay && (
        <button
          type="button"
          className="v2-hero-video__play"
          aria-label={c.play}
          onClick={() => {
            setPlaying(true);
            void ref.current?.play();
          }}
        >
          ▶
        </button>
      )}
    </div>
  );
}
