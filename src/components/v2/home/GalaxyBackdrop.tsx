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

const PARTICLE_COUNT = 1100;
const FOCAL_LENGTH = 320;
const TILT_MAX = 0.5;
const TILT_EASE = 0.07;

type ThemeKey = "light" | "hybrid" | "dark";

// Light register — graphite + teal microdots on Concrete Studio. Higher
// alphas than before so the field actually reads.
const PALETTE_LIGHT: Palette = [
  [17, 24, 39, 0.85],
  [17, 24, 39, 0.55],
  [17, 24, 39, 0.35],
  [55, 65, 81, 0.65],
  [15, 118, 110, 0.85],
  [20, 184, 166, 0.9],
] as const;

// Hybrid (twilight) register — bright cream + saturated teal on
// deep blue-graphite. Galaxy reads as "actual space" here.
const PALETTE_HYBRID: Palette = [
  [255, 255, 255, 0.95],
  [248, 250, 252, 0.7],
  [226, 232, 240, 0.55],
  [203, 213, 225, 0.4],
  [94, 234, 212, 0.85],
  [45, 212, 191, 0.95],
] as const;

// Dark register — ice-white + bright teal on near-black. Strongest.
const PALETTE_DARK: Palette = [
  [255, 255, 255, 1.0],
  [248, 250, 252, 0.8],
  [226, 232, 240, 0.65],
  [148, 163, 184, 0.5],
  [94, 234, 212, 0.95],
  [45, 212, 191, 1.0],
] as const;

function getInitialTheme(): ThemeKey {
  if (typeof document === "undefined") return "hybrid";
  const t = document.documentElement.dataset.theme;
  if (t === "dark" || t === "light" || t === "hybrid") return t;
  return "hybrid";
}

function paletteFor(theme: ThemeKey): Palette {
  if (theme === "dark") return PALETTE_DARK;
  if (theme === "light") return PALETTE_LIGHT;
  return PALETTE_HYBRID;
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
    let palette: Palette = paletteFor(getInitialTheme());
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

        const r = Math.max(0.8, 2.4 * depthAlpha);
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${a})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
        // Bright stars get a soft halo so close-up particles read as
        // luminous, not as flat circles.
        if (a > 0.55 && r > 1.4) {
          const haloR = r * 3.5;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, haloR);
          grad.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${a * 0.35})`);
          grad.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, haloR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    // Theme observer — swap palette on the fly when the user toggles theme.
    const themeObserver = new MutationObserver(() => {
      palette = paletteFor(getInitialTheme());
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
