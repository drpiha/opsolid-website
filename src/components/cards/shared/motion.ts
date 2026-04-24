// =============================================================================
// Card motion presets — Framer Motion variants used by every premium layout.
//
// Why a shared file instead of inlining per-component:
//   1. Consistent feel across templates (same easing, same staggers).
//   2. One place to honor `prefers-reduced-motion` — tweak here, every layout
//      respects it automatically.
//   3. Lighter bundle: variants are plain objects, tree-shaken with the
//      template that imports them.
//
// Easing: a custom cubic that's slightly snappier than Framer's default
// "easeOut" — feels closer to native iOS/Android system animations and reads
// as "polished" rather than "web-default".
// =============================================================================

import type { Variants } from "framer-motion";

// cubic-bezier(0.22, 1, 0.36, 1) — also used in the HTML demos under
// /public/demos/business-card. Keeping the same easing makes the React ports
// match the originals one-to-one. Tuple typed loose so Framer Motion 11+
// accepts it as a cubic-bezier 4-tuple without relying on the `Easing` export
// (which moved between major versions).
export const easeOutQuint = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  fast: 0.32,
  base: 0.55,
  slow: 0.85,
} as const;

/** Standard "fade up from below" — the workhorse entry animation. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: easeOutQuint },
  },
};

/** Same as fadeUp but starts from above — used for headers/badges. */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: easeOutQuint },
  },
};

/** Subtle scale-in — used for avatars, hero photos, large CTAs. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DUR.base, ease: easeOutQuint },
  },
};

/**
 * Container that staggers its direct children's `visible` transitions.
 * Pair with any of the above on the children. Default 80ms between children
 * — fast enough to feel responsive, slow enough to read as "choreographed".
 */
export const staggerContainer = (staggerMs = 80): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerMs / 1000,
      delayChildren: 0.05,
    },
  },
});

/** When a layout includes a hero image / video, this gives it a slow ken-burns
 *  drift instead of a static frame. Apply to the wrapper of the media. */
export const kenBurns: Variants = {
  hidden: { scale: 1.08, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.4, ease: easeOutQuint },
  },
};

/**
 * Viewport options for the `whileInView` pattern — once: true (don't replay
 * on scroll-back), amount: 0.25 (trigger when ~a quarter of the element is
 * on-screen, matches the HTML demos' IntersectionObserver threshold).
 */
export const inViewOnce = { once: true, amount: 0.25 } as const;
