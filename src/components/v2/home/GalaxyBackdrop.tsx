"use client";

/**
 * GalaxyBackdrop — quiet starfield rendered to <canvas> behind the home hero.
 *
 *  - HTML5 Canvas (~3 kB on the wire) instead of Three.js (~120 kB).
 *  - Particles live in a small projected 3D space; depth controls
 *    brightness + size, giving parallax without GPU cost.
 *  - Mouse parallax: camera tilts toward the cursor with critically-damped
 *    easing.
 *  - Theme-reactive: subscribes to html[data-theme] via MutationObserver,
 *    swaps palette (graphite on concrete in light, ice-white + teal on
 *    charcoal in dark) and re-seeds.
 *  - prefers-reduced-motion: render one frame and exit.
 */

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  twinkle: number;
};
type Palette = ReadonlyArray<readonly [number, number, number, number]>;

const PARTICLE_COUNT = 700;
const FOCAL_LENGTH = 320;
const TILT_MAX = 0.4;
const TILT_EASE = 0.06;

// Light register — graphite ink + faint teal traces on Concrete Studio.
const PALETTE_LIGHT: Palette = [
  [17, 24, 39, 0.55],
  [17, 24, 39, 0.32],
  [17, 24, 39, 0.18],
  [55, 65, 81, 0.42],
  [15, 118, 110, 0.45],
  [20, 184, 166, 0.5],
] as const;

// Dark register — ice-white core + bright teal traces on charcoal.
const PALETTE_DARK: Palette = [
  [248, 250, 252, 0.85],
  [248, 250, 252, 0.55],
  [203, 213, 225, 0.45],
  [148, 163, 184, 0.35],
  [45, 212, 191, 0.7],
  [94, 234, 212, 0.55],
] as const;

function getInitialTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function seedStars(width: number, height: number): Star[] {
  const stars: Star[] = new Array(PARTICLE_COUNT);
  const span = Math.max(width, height);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    stars[i] = {
      x: (Math.random() - 0.5) * span * 1.5,
      y: (Math.random() - 0.5) * span * 1.5,
      z: Math.random() * 600 + 80,
      twinkle: Math.random() * Math.PI * 2,
    };
  }
  return stars;
}

export function GalaxyBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = seedStars(width, height);
    let palette: Palette =
      getInitialTheme() === "dark" ? PALETTE_DARK : PALETTE_LIGHT;
    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;
    let tiltX = 0;
    let tiltY = 0;
    const startTime = performance.now();

    function resize() {
      if (!canvas || !ctx) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = seedStars(width, height);
    }

    function onPointer(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = Math.max(-0.5, Math.min(0.5, nx)) * TILT_MAX * 2;
      mouseY = Math.max(-0.5, Math.min(0.5, ny)) * TILT_MAX * 2;
    }

    function frame(now: number) {
      if (!ctx) return;
      tiltX += (mouseX - tiltX) * TILT_EASE;
      tiltY += (mouseY - tiltY) * TILT_EASE;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      const cx = width * 0.5;
      const cy = height * 0.5;
      const t = (now - startTime) * 0.001;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const s = stars[i];
        const xt = s.x + tiltX * s.z * 0.8;
        const yt = s.y + tiltY * s.z * 0.8;
        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + s.z);
        const px = cx + xt * scale;
        const py = cy + yt * scale;
        if (px < -10 || px > width + 10 || py < -10 || py > height + 10) continue;

        const depthAlpha = scale;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.7 + s.twinkle);
        const color = palette[i % palette.length];
        const a = color[3] * depthAlpha * tw;
        if (a < 0.015) continue;

        const r = Math.max(0.6, 1.8 * depthAlpha);
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${a})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    // Theme observer — swap palette on the fly when the user toggles theme.
    const themeObserver = new MutationObserver(() => {
      palette =
        document.documentElement.dataset.theme === "dark"
          ? PALETTE_DARK
          : PALETTE_LIGHT;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resize();

    if (reduceMotion) {
      frame(performance.now());
      cancelAnimationFrame(raf);
      return () => {
        themeObserver.disconnect();
        window.removeEventListener("resize", resize);
      };
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="v2-galaxy" aria-hidden="true" />;
}
