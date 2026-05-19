"use client";

/**
 * GalaxyBackdrop — quiet starfield rendered to <canvas> behind the home hero.
 *
 * Trade-offs deliberately made:
 *  - HTML5 Canvas instead of Three.js → ~3 kB instead of ~120 kB, no WebGL
 *    context cost, plays well with the existing NodeGraphBackdrop layered on
 *    top of it (graph stays in front, galaxy supplies depth behind).
 *  - Particles live in a small 3D space, projected with a fixed focal length
 *    each frame; depth (z) controls brightness + size, giving the parallax
 *    feel without the per-frame GPU cost of true 3D.
 *  - Mouse parallax: camera tilts toward the cursor (yaw/pitch in [-0.4, 0.4])
 *    with critically-damped easing so the field never overshoots — feels
 *    responsive but never jittery.
 *  - prefers-reduced-motion: render one static frame and exit. No RAF loop.
 *
 * The component is page-painted only on v2 home; do not import elsewhere.
 */

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  /** Persistent twinkle phase so neighbouring stars stay out of sync. */
  twinkle: number;
};

const PARTICLE_COUNT = 520;
const FOCAL_LENGTH = 320;
/** Camera tilt max in radians (~23°). Caps mouse parallax. */
const TILT_MAX = 0.4;
/** Per-frame easing factor toward the target tilt. */
const TILT_EASE = 0.06;
/** Star colour palette — graphite ink + faint teal traces, sized to read
 *  on the light Concrete Studio ground without ever feeling "dark". */
const STAR_PALETTE = [
  // Graphite ink — most stars. Reads as fine pointillism on concrete.
  [17, 24, 39, 0.55],
  [17, 24, 39, 0.32],
  [17, 24, 39, 0.18],
  [55, 65, 81, 0.42],
  // Teal accent traces matching --v2-motion-trace.
  [15, 118, 110, 0.45],
  [20, 184, 166, 0.5],
] as const;

function seedStars(width: number, height: number): Star[] {
  const stars: Star[] = new Array(PARTICLE_COUNT);
  const span = Math.max(width, height);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    stars[i] = {
      x: (Math.random() - 0.5) * span * 1.4,
      y: (Math.random() - 0.5) * span * 1.4,
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
      // Critically-damped ease toward the cursor target.
      tiltX += (mouseX - tiltX) * TILT_EASE;
      tiltY += (mouseY - tiltY) * TILT_EASE;

      ctx.clearRect(0, 0, width, height);
      // Default 'source-over' blends correctly on the light Concrete
      // Studio ground; 'lighter' would wash particles white.
      ctx.globalCompositeOperation = "source-over";

      const cx = width * 0.5;
      const cy = height * 0.5;
      const t = (now - startTime) * 0.001;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const s = stars[i];
        // Apply camera yaw/pitch in object space — fast: just add tilt * z.
        const xt = s.x + tiltX * s.z * 0.8;
        const yt = s.y + tiltY * s.z * 0.8;
        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + s.z);
        const px = cx + xt * scale;
        const py = cy + yt * scale;
        if (px < -10 || px > width + 10 || py < -10 || py > height + 10) continue;

        const depthAlpha = scale;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.7 + s.twinkle);
        const palette = STAR_PALETTE[i % STAR_PALETTE.length];
        const a = palette[3] * depthAlpha * tw;
        if (a < 0.01) continue;

        const r = Math.max(0.4, 1.6 * depthAlpha);
        ctx.fillStyle = `rgba(${palette[0]}, ${palette[1]}, ${palette[2]}, ${a})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();

    if (reduceMotion) {
      // One static paint, no loop.
      frame(performance.now());
      cancelAnimationFrame(raf);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="v2-galaxy"
      aria-hidden="true"
    />
  );
}
