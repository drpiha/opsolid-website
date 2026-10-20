"use client";

/**
 * Hero scene: a full-bleed background video behind the SSR hero text, plus a tap layer.
 *
 * - The poster (<picture>, SSR) is the first frame. The video starts only after the page has loaded and the
 *   browser is idle, never under prefers-reduced-motion or with the footer switch off (then: poster only).
 * - A visible pause button controls the video (WCAG 2.2.2); it also pauses while the hero is off screen.
 * - Every point of the hero answers a tap or click: a copper ring opens at the point and the next offering
 *   unfolds there as a card. The card is placed so it never covers the hero text or its buttons. "Szene
 *   erkunden" does the same from the keyboard; Escape closes the cards. Nothing moves the layout.
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { withLocale, type Locale } from "@/lib/i18n";
import type { L3 } from "@/content/v4/types";
import { SCENE_ITEMS, SCENE_UI } from "@/content/v4/scene";
import { FX_EVENT, motionOff } from "@/components/v4/motion";

const MEDIA = "/media/hero";
const CARD_W = 300;
const CARD_H = 196;
const GAP = 24;
const KEEP = 2;
/** Keyboard path through the scene (fractions of the hero box), used by "Szene erkunden". */
const SPOTS: [number, number][] = [
  [0.7, 0.3], [0.82, 0.56], [0.62, 0.62], [0.86, 0.26], [0.74, 0.46], [0.64, 0.22], [0.84, 0.7], [0.7, 0.58],
];

type Card = { id: number; k: number; x: number; y: number; cx: number; cy: number };
type Box = { l: number; t: number; r: number; b: number };

const hit = (a: Box, b: Box) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

/** Card position for a tap at (x, y) inside a w×h hero: near the point, clear of every rectangle in `avoid`. */
export function placeCard(x: number, y: number, w: number, h: number, avoid: Box[], cw = CARD_W, ch = CARD_H): [number, number] {
  const pad = 12;
  const top = 76;
  const clamp = (cx: number, cy: number): [number, number] => [
    Math.min(Math.max(cx, pad), Math.max(pad, w - cw - pad)),
    Math.min(Math.max(cy, top), Math.max(top, h - ch - 72)),
  ];
  const free = (cx: number, cy: number) => !avoid.some((a) => hit({ l: cx - 6, t: cy - 6, r: cx + cw + 6, b: cy + ch + 6 }, a));
  const candidates: [number, number][] = [
    [x + 16, y - 20],
    [x - cw - 16, y - 20],
    [x + 16, y - ch + 20],
    [x - cw / 2, y + 24],
    [x - cw / 2, y - ch - 24],
  ];
  // Beside or above the text: the free column on desktop, the band over the copy on phones.
  for (const a of avoid) {
    candidates.push([a.r + GAP, y - ch / 2], [a.r + GAP, a.t], [x - cw / 2, a.t - ch - GAP], [pad, a.t - ch - GAP]);
  }
  for (const c of candidates) {
    const [cx, cy] = clamp(c[0], c[1]);
    if (free(cx, cy)) return [cx, cy];
  }
  // No free slot (very small screens): the top band, which the copy never uses.
  return clamp(w - cw - pad, top);
}

export function HeroScene({ locale, compact = false }: { locale: L3; compact?: boolean }) {
  const ui = SCENE_UI[locale];
  const items = SCENE_ITEMS[locale];
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seq = useRef(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [video, setVideo] = useState<"off" | "on" | "paused">("off");
  const [announce, setAnnounce] = useState("");

  const heroOf = () => rootRef.current?.closest<HTMLElement>(".v4-hero") ?? null;

  const cardsRef = useRef<Card[]>([]);
  cardsRef.current = cards;

  const open = useCallback(
    (x: number, y: number) => {
      const hero = heroOf();
      if (!hero) return;
      const hb = hero.getBoundingClientRect();
      const avoid: Box[] = Array.from(hero.querySelectorAll<HTMLElement>("[data-scene-avoid]")).map((el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - hb.left, t: r.top - hb.top, r: r.right - hb.left, b: r.bottom - hb.top };
      });
      // The previous card stays readable: the new one avoids it too (when there is room).
      const prev = cardsRef.current[cardsRef.current.length - 1];
      const cw = Math.min(CARD_W, hb.width - 24);
      if (prev && hb.width >= 760) avoid.push({ l: prev.cx, t: prev.cy, r: prev.cx + cw, b: prev.cy + CARD_H });
      const [cx, cy] = placeCard(x, y, hb.width, hb.height, avoid, cw);
      const k = seq.current % items.length;
      seq.current += 1;
      setCards((prev) => [...prev.slice(-(KEEP - 1)), { id: seq.current, k, x, y, cx, cy }]);
      setAnnounce(`${items[k].t} ${ui.opened}. ${ui.next}`);
    },
    [items, ui],
  );

  // Taps anywhere in the hero, except on its own links and buttons.
  useEffect(() => {
    const hero = heroOf();
    if (!hero) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button, input, select, textarea, summary, label, .v4-scene-card")) return;
      const hb = hero.getBoundingClientRect();
      open(e.clientX - hb.left, e.clientY - hb.top);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCards([]);
    };
    hero.addEventListener("click", onClick);
    hero.addEventListener("keydown", onKey);
    // Layout audit hook (CLAUDE.md): only with ?debug, inert otherwise.
    if (/[?&]debug\b/.test(window.location.search)) {
      (window as unknown as { __v5scene?: unknown }).__v5scene = {
        tap: (fx: number, fy: number) => {
          const hb = hero.getBoundingClientRect();
          open(fx * hb.width, fy * hb.height);
        },
        clear: () => setCards([]),
      };
    }
    return () => {
      hero.removeEventListener("click", onClick);
      hero.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Background video: idle start, poster-only when motion is off, paused off screen and in hidden tabs.
  useEffect(() => {
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    const start = () => {
      if (cancelled || motionOff()) return;
      const v = videoRef.current;
      if (!v) return;
      const portrait = window.innerWidth < 760 && window.innerHeight > window.innerWidth;
      const name = portrait ? "hero-720x1280" : "hero-1920";
      const webm = v.canPlayType('video/webm; codecs="vp9"') !== "";
      v.src = `${MEDIA}/${name}.${webm ? "webm" : "mp4"}`;
      v.muted = true;
      v.play().then(
        () => !cancelled && setVideo("on"),
        () => !cancelled && setVideo("off"),
      );
      io = new IntersectionObserver(([e]) => {
        if (!videoRef.current || videoRef.current.dataset.user === "paused") return;
        if (e.isIntersecting && !document.hidden) videoRef.current.play().catch(() => undefined);
        else videoRef.current.pause();
      });
      io.observe(v);
    };
    const idle = () => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(start, { timeout: 2500 });
      else window.setTimeout(start, 1200);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    const stop = () => {
      const v = videoRef.current;
      if (!v) return;
      v.pause();
      v.removeAttribute("src");
      v.load();
      setVideo("off");
    };
    const onFx = () => (motionOff() ? stop() : start());
    const onVis = () => {
      const v = videoRef.current;
      if (!v || !v.src || v.dataset.user === "paused") return;
      if (document.hidden) v.pause();
      else v.play().catch(() => undefined);
    };
    window.addEventListener(FX_EVENT, onFx);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      io?.disconnect();
      window.removeEventListener("load", idle);
      window.removeEventListener(FX_EVENT, onFx);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (video === "on") {
      v.dataset.user = "paused";
      v.pause();
      setVideo("paused");
    } else {
      delete v.dataset.user;
      v.play().then(() => setVideo("on"), () => setVideo("off"));
    }
  };

  const explore = () => {
    const hero = heroOf();
    if (!hero) return;
    const hb = hero.getBoundingClientRect();
    const [fx, fy] = SPOTS[seq.current % SPOTS.length];
    open(fx * hb.width, fy * hb.height);
  };

  const last = cards[cards.length - 1];
  return (
    <div ref={rootRef} className={`v4-scene${compact ? " is-compact" : ""}${video === "off" ? "" : " has-video"}`}>
      <div className="v4-scene-media" aria-hidden="true">
        <picture>
          <source media="(max-width: 759px) and (orientation: portrait)" srcSet={`${MEDIA}/hero-poster-720x1280.webp`} type="image/webp" />
          <source media="(max-width: 759px) and (orientation: portrait)" srcSet={`${MEDIA}/hero-poster-720x1280.jpg`} />
          <source srcSet={`${MEDIA}/hero-poster-1920.webp`} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element -- art-directed poster, the video's first frame */}
          <img src={`${MEDIA}/hero-poster-1920.jpg`} alt="" width={1920} height={1080} fetchPriority={compact ? "auto" : "high"} decoding="async" />
        </picture>
        <video ref={videoRef} muted loop playsInline preload="none" tabIndex={-1} disablePictureInPicture />
      </div>

      <div className="v4-scene-layer" role="region" aria-label={ui.label}>
        {cards.map((c) => (
          <span key={`r${c.id}`} className="v4-scene-ring" style={{ left: c.x, top: c.y }} aria-hidden="true" />
        ))}
        {cards.map((c) => {
          const it = items[c.k];
          const current = c.id === last?.id;
          return (
            <div key={c.id} className={`v4-scene-card${current ? " is-current" : ""}`} style={{ left: c.cx, top: c.cy }}>
              <p className="v4-scene-n">{it.n}</p>
              <p className="v4-scene-t">{it.t}</p>
              <p className="v4-scene-p">{it.p}</p>
              <div className="v4-scene-actions">
                <Link href={withLocale(it.href, locale as Locale)} className="v4-link">
                  {ui.more} <span aria-hidden="true">→</span>
                </Link>
                <button type="button" className="v4-scene-x" aria-label={ui.close} onClick={() => setCards((p) => p.filter((x) => x.id !== c.id))}>
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="v4-scene-bar">
        <p className="v4-scene-hint" aria-live="polite">
          <span aria-hidden="true" className="v4-scene-dot" />
          <span>{announce || ui.hint}</span>
        </p>
        <div className="v4-scene-ctrl">
          <button type="button" className="v4-scene-btn" onClick={explore}>
            {ui.explore}
          </button>
          {/* The slot is always there (hidden until the video plays), so the bar never shifts. */}
          <button
            type="button"
            className="v4-scene-btn is-icon"
            onClick={togglePlay}
            aria-label={video === "on" ? ui.pause : ui.play}
            disabled={video === "off"}
            aria-hidden={video === "off" ? true : undefined}
            style={video === "off" ? { visibility: "hidden" } : undefined}
          >
            {video === "on" ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <rect x="2.5" y="1.5" width="3" height="11" fill="currentColor" />
                <rect x="8.5" y="1.5" width="3" height="11" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 1.5l9 5.5-9 5.5z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
