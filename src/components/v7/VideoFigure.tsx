"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { FX_EVENT, motionOff } from "./fx";

type Src = { webm?: string; mp4: string; webmP?: string; mp4P?: string };

/**
 * Poster-first video slot. The <picture> poster (children) is always rendered. Video sources are set only
 * after window `load` plus an idle callback; portrait files go to phones in portrait, landscape files
 * everywhere else (WebM before MP4). Muted, looping, preload="none". Paused off screen and in hidden tabs.
 * Reduced motion and the footer switch (opsolid-fx=off) keep the poster only and fetch no video.
 */
export function VideoFigure({
  src,
  label,
  pauseLabel,
  playLabel,
  children,
}: {
  src: Src;
  label: string;
  pauseLabel: string;
  playLabel: string;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const pausedByUser = useRef(false);
  const visible = useRef(false);

  // Arm after load + idle, unless motion is off; disarm when the footer switch turns motion off.
  useEffect(() => {
    let cancelled = false;
    let idle: number | undefined;
    const arm = () => {
      if (cancelled || motionOff()) return;
      const go = () => !cancelled && !motionOff() && setArmed(true);
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(go, { timeout: 2500 });
      else idle = (window as Window).setTimeout(go, 600);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    const onFx = () => {
      if (motionOff()) {
        setArmed(false);
        setPlaying(false);
      } else {
        arm();
      }
    };
    window.addEventListener(FX_EVENT, onFx);
    return () => {
      cancelled = true;
      window.removeEventListener("load", arm);
      window.removeEventListener(FX_EVENT, onFx);
      if (idle !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
        (window as Window).clearTimeout(idle);
      }
    };
  }, []);

  const sync = useCallback(() => {
    const v = vid.current;
    if (!v) return;
    const want = visible.current && !document.hidden && !pausedByUser.current && !motionOff();
    if (want) void v.play().catch(() => undefined);
    else v.pause();
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = box.current;
    const v = vid.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = !!e?.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("playing", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      v.removeEventListener("playing", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [armed, sync]);

  const portrait = armed && typeof window !== "undefined" && window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
  const webm = portrait && src.webmP ? src.webmP : src.webm;
  const mp4 = portrait && src.mp4P ? src.mp4P : src.mp4;

  const toggle = () => {
    pausedByUser.current = !pausedByUser.current;
    setPaused(pausedByUser.current);
    sync();
  };

  return (
    <div ref={box} className="relative h-full w-full overflow-hidden">
      {children}
      {armed && (
        <>
          <video
            ref={vid}
            key={`${webm ?? ""}|${mp4}`}
            muted
            loop
            playsInline
            preload="none"
            aria-label={label}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
          >
            {webm && <source src={webm} type="video/webm" />}
            <source src={mp4} type="video/mp4" />
          </video>
          <button
            type="button"
            aria-pressed={paused}
            aria-label={pauseLabel}
            title={paused ? playLabel : pauseLabel}
            onClick={toggle}
            className="absolute bottom-3 right-3 z-10 grid size-11 place-items-center rounded-full border border-[#E3DCD1] bg-[#F6F2EC] text-[#16191D] transition-colors hover:bg-white"
          >
            {paused ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z" /></svg>
            )}
          </button>
        </>
      )}
    </div>
  );
}
