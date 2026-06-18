"use client";

// =============================================================================
// VideoBlock — universal video renderer appended after every template (the
// "wrapper-level blocks" pattern in /c/[slug] and the editor preview).
//
// Renders, in order, whichever the owner provided:
//   • a self-hosted clip (cardData.videoPath) with native <video> controls
//     (play / pause / seek / replay / fullscreen — works on every template),
//   • a YouTube / Vimeo embed (cardData.videoUrl) as a click-to-play facade
//     (poster first, iframe only after the user clicks → no autoplay surprise,
//     lighter initial load).
//
// Self-hides when neither field is set. Centralising video here means a card
// shows its video on ALL 96 templates, not only the few with native support.
// =============================================================================

import * as React from "react";
import { Play, Volume2 } from "lucide-react";

interface VideoBlockProps {
  videoUrl?: string | null;
  videoPath?: string | null;
  accentHex?: string | null;
  tone?: "light" | "dark";
  heading?: string;
  /** Card locale — only used for the "tap for sound" badge label. */
  locale?: "de" | "en" | "tr";
  /** When true, the YouTube/Vimeo embed is left to the template (which renders
   *  it natively) and only the self-hosted clip is shown here. */
  suppressEmbed?: boolean;
}

const SOUND_LABEL: Record<"de" | "en" | "tr", string> = {
  de: "Ton aktivieren",
  en: "Tap for sound",
  tr: "Ses aç",
};

const YT_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{6,16})/;
const VIMEO_RE = /vimeo\.com\/(?:video\/)?(\d{5,12})/;

interface ParsedVideo {
  provider: "youtube" | "vimeo";
  id: string;
  poster: string | null;
}

function parseVideo(url: string): ParsedVideo | null {
  const yt = url.match(YT_RE);
  if (yt) {
    return {
      provider: "youtube",
      id: yt[1],
      poster: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`,
    };
  }
  const v = url.match(VIMEO_RE);
  if (v) return { provider: "vimeo", id: v[1], poster: null };
  return null;
}

function embedSrc(v: ParsedVideo): string {
  return v.provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&autoplay=1&playsinline=1`
    : `https://player.vimeo.com/video/${v.id}?autoplay=1`;
}

function resolveSrc(path: string): string {
  if (/^(https?:|blob:|data:)/.test(path) || path.startsWith("/")) return path;
  return `/${path}`;
}

export function VideoBlock({
  videoUrl,
  videoPath,
  tone = "light",
  heading = "Video",
  locale = "en",
  suppressEmbed = false,
}: VideoBlockProps) {
  const [playing, setPlaying] = React.useState(false);
  // Tracks whether the self-hosted clip is currently muted, so we can show a
  // "tap for sound" badge. Starts true (autoplay generally lands muted).
  const [muted, setMuted] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const hasAutoPlayed = React.useRef(false);
  const embed = !suppressEmbed && videoUrl ? parseVideo(videoUrl) : null;

  // Self-hosted clip: autoplay ONCE when it first scrolls into view, then on
  // end rewind to the first frame and stop (no looping). We try to play WITH
  // sound by default; browsers block unmuted autoplay before a user gesture, so
  // on rejection we fall back to muted autoplay (still plays once) — the visitor
  // can unmute/replay via the native controls. Hero (top) videos play the moment
  // the card opens; lower ones play once when scrolled to.
  React.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAutoPlayed.current) {
            hasAutoPlayed.current = true;
            el.muted = false;
            el.play()
              .then(() => setMuted(false)) // sound-on autoplay allowed
              .catch(() => {
                // Unmuted autoplay blocked → play muted (still plays once) and
                // surface the "tap for sound" badge.
                el.muted = true;
                setMuted(true);
                void el.play().catch(() => {});
              });
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!videoPath && !embed) return null;

  const isDark = tone === "dark";
  const headingCls = isDark
    ? "text-white/60"
    : "text-ink-400";

  return (
    <div
      className={[
        "px-6 py-5",
        isDark ? "border-t border-white/10" : "border-t border-line",
      ].join(" ")}
    >
      <h2
        className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${headingCls}`}
      >
        {heading}
      </h2>

      {/* Self-hosted clip first — native controls. */}
      {videoPath && (
        <div className="relative overflow-hidden rounded-2xl border border-line bg-black">
          <video
            ref={videoRef}
            src={resolveSrc(videoPath)}
            controls
            playsInline
            preload="metadata"
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            onEnded={(e) => {
              // Rewind to the first frame and stop (no loop).
              e.currentTarget.currentTime = 0;
              e.currentTarget.pause();
            }}
            className="aspect-video w-full bg-black"
          />
          {/* "Tap for sound" badge — only while muted. Autoplay-with-sound is
              blocked by browsers before a user gesture, so the clip starts muted;
              one tap unmutes and replays from the start (a real user gesture, so
              it works everywhere). Hidden once sound is on. */}
          {muted && (
            <button
              type="button"
              onClick={() => {
                const el = videoRef.current;
                if (!el) return;
                el.muted = false;
                el.currentTime = 0;
                void el.play().catch(() => {});
                setMuted(false);
              }}
              className="absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/85"
              aria-label={SOUND_LABEL[locale]}
            >
              <Volume2 size={14} />
              <span>{SOUND_LABEL[locale]}</span>
            </button>
          )}
        </div>
      )}

      {/* YouTube / Vimeo embed — click-to-play facade. */}
      {embed && (
        <div
          className={[
            "overflow-hidden rounded-2xl border border-line bg-black",
            videoPath ? "mt-3" : "",
          ].join(" ")}
        >
          <div className="relative aspect-video w-full">
            {playing ? (
              <iframe
                src={embedSrc(embed)}
                title="Embedded video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Video"
                className="group absolute inset-0 h-full w-full"
              >
                {embed.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={embed.poster}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
                )}
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition-transform group-hover:scale-105 group-active:scale-95">
                    <Play size={26} className="ml-1 fill-current" />
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
