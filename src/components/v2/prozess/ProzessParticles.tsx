"use client";

/**
 * ProzessParticles — canvas overlay that draws luminous particles
 * flowing along the BPMN diagram's path geometry. Direction tracks
 * the mouse: cursor on the right half of the hero → particles flow
 * forward along each path; cursor on the left → they reverse. The
 * speed scales with horizontal cursor displacement, so a still
 * cursor produces a quiet drift, and a moving cursor "tugs" the
 * flow toward itself.
 *
 * The path waypoints below mirror the static BPMN drawn in
 * ProzessV2.tsx's <BpmnMap />. Keeping them inline (instead of
 * reading SVG getPointAtLength every frame) keeps the canvas tick
 * cheap and lets the same particles read in light, twilight, and
 * dark registers via theme-aware palette.
 *
 *  - HTML5 Canvas, ~3 kB on the wire.
 *  - prefers-reduced-motion → render one static frame.
 *  - Coarse pointer → fall back to a slow auto-flow (no mouse).
 */

import { useEffect, useRef } from "react";

/**
 * BPMN viewBox is 1400 × 520. Particles use these path segments —
 * a series of straight segments per arrow (the SVG arrows are all
 * straight L commands so straight-line interpolation matches the
 * draw exactly).
 */
type Segment = ReadonlyArray<readonly [number, number]>;

const PATHS: readonly Segment[] = [
  // flow-1: 106,120 → 230,120
  [
    [106, 120],
    [230, 120],
  ],
  // flow-2: 410,120 → 530,120
  [
    [410, 120],
    [530, 120],
  ],
  // flow-3: 640,120 → 760,120
  [
    [640, 120],
    [760, 120],
  ],
  // flow-4: 950,120 → 1080,120
  [
    [950, 120],
    [1080, 120],
  ],
  // flow-5: 590,160 → 590,250
  [
    [590, 160],
    [590, 250],
  ],
  // flow-6 (best-guess from row-2 — see ProzessV2 BpmnMap)
  [
    [680, 288],
    [820, 288],
  ],
  // flow-7
  [
    [820, 288],
    [820, 400],
  ],
] as const;

const PARTICLES_PER_PATH = 6;
const VIEW_W = 1400;
const VIEW_H = 520;

type ThemeKey = "light" | "hybrid" | "dark";

type Particle = {
  pathIdx: number;
  t: number; // 0..1 along the path
};

function getInitialTheme(): ThemeKey {
  if (typeof document === "undefined") return "hybrid";
  const t = document.documentElement.dataset.theme;
  return t === "dark" || t === "light" || t === "hybrid" ? t : "hybrid";
}

function pathLength(seg: Segment): number {
  let total = 0;
  for (let i = 1; i < seg.length; i++) {
    const [ax, ay] = seg[i - 1];
    const [bx, by] = seg[i];
    total += Math.hypot(bx - ax, by - ay);
  }
  return total;
}

function pointAt(seg: Segment, t: number): [number, number] {
  const total = pathLength(seg);
  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < seg.length; i++) {
    const [ax, ay] = seg[i - 1];
    const [bx, by] = seg[i];
    const len = Math.hypot(bx - ax, by - ay);
    if (target <= len) {
      const u = target / len;
      return [ax + (bx - ax) * u, ay + (by - ay) * u];
    }
    target -= len;
  }
  const last = seg[seg.length - 1];
  return [last[0], last[1]];
}

export function ProzessParticles({
  parentRef,
}: {
  parentRef: React.RefObject<HTMLElement>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = parentRef.current;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pxW = canvas.clientWidth;
    let pxH = canvas.clientHeight;
    let raf = 0;
    let mouseFlow = 0.45; // -1..1 — drift forward by default
    let theme = getInitialTheme();

    const particles: Particle[] = [];
    PATHS.forEach((_, pathIdx) => {
      for (let p = 0; p < PARTICLES_PER_PATH; p++) {
        particles.push({ pathIdx, t: p / PARTICLES_PER_PATH });
      }
    });

    function resize() {
      pxW = canvas!.clientWidth;
      pxH = canvas!.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(pxW * dpr);
      canvas!.height = Math.floor(pxH * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onPointer(e: PointerEvent) {
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      // Map screen x [0..1] → flow direction [-1..1] with a small
      // dead zone in the middle so particles don't oscillate when
      // the cursor is dead-centre.
      const raw = (nx - 0.5) * 2.4;
      const target = Math.max(-1.4, Math.min(1.4, raw));
      mouseFlow += (target - mouseFlow) * 0.08;
    }

    const themeObs = new MutationObserver(() => {
      theme = getInitialTheme();
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    function palette() {
      if (theme === "dark") {
        return {
          dot: "rgba(94, 234, 212, 0.95)",
          halo: "rgba(94, 234, 212, 0.32)",
        };
      }
      if (theme === "light") {
        return {
          dot: "rgba(15, 118, 110, 0.95)",
          halo: "rgba(20, 184, 166, 0.30)",
        };
      }
      // hybrid
      return {
        dot: "rgba(94, 234, 212, 0.95)",
        halo: "rgba(45, 212, 191, 0.35)",
      };
    }

    function frame() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, pxW, pxH);

      // Map SVG viewBox coords (1400×520) into canvas px with
      // preserveAspectRatio xMidYMid meet — same as the SVG renderer.
      const scale = Math.min(pxW / VIEW_W, pxH / VIEW_H);
      const offsetX = (pxW - VIEW_W * scale) / 2;
      const offsetY = (pxH - VIEW_H * scale) / 2;

      // Base drift even when mouse is centred so the field always
      // feels alive. Coarse devices get a fixed forward drift
      // because there's no mouse.
      const baseDrift = coarse ? 0.012 : 0.006;
      const step = baseDrift + (mouseFlow * 0.022);

      const { dot, halo } = palette();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.t += step;
        // Wrap around for forward flow, reverse-wrap for backward.
        while (p.t > 1.05) p.t -= 1.1;
        while (p.t < -0.05) p.t += 1.1;

        const seg = PATHS[p.pathIdx];
        const [x, y] = pointAt(seg, Math.max(0, Math.min(1, p.t)));
        const cx = x * scale + offsetX;
        const cy = y * scale + offsetY;

        // Halo
        const haloR = 10 * Math.max(0.6, scale);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
        grad.addColorStop(0, halo);
        grad.addColorStop(1, halo.replace(/[\d.]+\)$/, "0)"));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = dot;
        ctx.beginPath();
        ctx.arc(cx, cy, 2.4 * Math.max(0.7, scale), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    if (reduceMotion) {
      frame();
      cancelAnimationFrame(raf);
      return () => {
        themeObs.disconnect();
      };
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [parentRef]);

  return (
    <canvas
      ref={canvasRef}
      className="v2-prozess-particles"
      aria-hidden="true"
    />
  );
}
