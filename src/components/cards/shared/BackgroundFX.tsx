"use client";

// =============================================================================
// BackgroundFX — drop-in background layers that give the new premium templates
// the "wow" depth missing from the old flat Template01-05 designs.
//
// Three layers, each renderable independently or composed:
//
//   • <AmbientOrbs />     — 3 large blurred color blobs that drift slowly
//                            (0% CPU after first frame: pure CSS animation).
//                            Reference: HTML showcase 03-dugun-etkinlik.
//   • <NoiseTexture />     — 1 px SVG noise overlay at low opacity. Removes
//                            the "AI-generated flat plastic" look from large
//                            gradient surfaces. Reference: Stripe homepage.
//   • <GradientMesh />     — Static radial-gradient mesh (4 sources) painted
//                            on a single SVG. Cheap, no JS animation.
//
// All layers are positioned absolutely and pointer-events-none so they never
// interfere with the interactive content sitting on top.
// =============================================================================

import type { CSSProperties } from "react";

interface OrbsProps {
  /** Tailwind-friendly hex strings; defaults match the HTML showcase demos. */
  colors?: [string, string, string];
  /** Opacity (0-1) per orb. Lower = more subtle. Default: 0.07/0.06/0.05. */
  opacity?: [number, number, number];
  className?: string;
}

/**
 * Three slow-drifting blurred orbs. Pure CSS keyframes — no JS, no rerenders.
 * Pair with a dark background for the maximal "ambient depth" effect.
 */
export function AmbientOrbs({
  colors = ["#00c8ff", "#8b5cf6", "#10b981"],
  opacity = [0.07, 0.06, 0.05],
  className = "",
}: OrbsProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      >
        <span
          className="absolute -left-[20%] -top-[25%] h-[600px] w-[600px] rounded-full"
          style={{
            background: colors[0],
            opacity: opacity[0],
            filter: "blur(120px)",
            animation: "fx-orb-1 28s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <span
          className="absolute -bottom-[20%] -right-[15%] h-[500px] w-[500px] rounded-full"
          style={{
            background: colors[1],
            opacity: opacity[1],
            filter: "blur(120px)",
            animation: "fx-orb-2 32s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <span
          className="absolute left-[60%] top-[45%] h-[350px] w-[350px] rounded-full"
          style={{
            background: colors[2],
            opacity: opacity[2],
            filter: "blur(120px)",
            animation: "fx-orb-3 24s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>
      {/* Keyframes are global so they're reusable; defining once is cheaper
          than 3× component-scoped style tags. prefers-reduced-motion freezes
          them mid-cycle (acceptable: opacity is so low that a still orb still
          adds depth). */}
      <style jsx global>{`
        @keyframes fx-orb-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(80px, 60px) scale(1.05);
          }
          66% {
            transform: translate(-30px, 90px) scale(0.95);
          }
        }
        @keyframes fx-orb-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-70px, -50px) scale(0.92);
          }
          66% {
            transform: translate(50px, -80px) scale(1.08);
          }
        }
        @keyframes fx-orb-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-60px, -40px) scale(1.15);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="fx-orb"],
          .pointer-events-none > span {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

interface NoiseProps {
  /** 0-1, default 0.05 — keep low or it reads as a dirty screen. */
  opacity?: number;
  className?: string;
}

/** Sub-pixel SVG noise overlay. Inline data URI = no network round-trip. */
export function NoiseTexture({ opacity = 0.05, className = "" }: NoiseProps) {
  // Tiny 100×100 SVG turbulence pattern, base64-encoded so we don't need a
  // separate /public asset. Tile-repeats infinitely.
  const noiseSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.85'/></svg>`;
  const dataUri = `url("data:image/svg+xml;utf8,${encodeURIComponent(noiseSvg)}")`;
  const style: CSSProperties = {
    backgroundImage: dataUri,
    backgroundRepeat: "repeat",
    opacity,
    mixBlendMode: "overlay",
  };
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={style}
    />
  );
}

interface MeshProps {
  /** 4 colors painted as 4 radial gradients on a single canvas. */
  colors?: [string, string, string, string];
  className?: string;
}

/**
 * Static radial-gradient mesh — 4 light sources, no animation. Cheap, beautiful
 * on dark surfaces. Reference: Linear's hero, Stripe's checkout.
 */
export function GradientMesh({
  colors = ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"],
  className = "",
}: MeshProps) {
  const style: CSSProperties = {
    backgroundImage: [
      `radial-gradient(at 18% 22%, ${colors[0]}66 0%, transparent 55%)`,
      `radial-gradient(at 82% 18%, ${colors[1]}66 0%, transparent 55%)`,
      `radial-gradient(at 24% 82%, ${colors[2]}55 0%, transparent 55%)`,
      `radial-gradient(at 80% 78%, ${colors[3]}55 0%, transparent 55%)`,
    ].join(", "),
  };
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={style}
    />
  );
}
