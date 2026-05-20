"use client";

/**
 * SplineHero — the 3D Spline scene that fills the right column of the
 * home hero. Uses the direct `@splinetool/react-spline/next` import as
 * requested by the operator; the Spline runtime joins the initial JS
 * bundle so the robot appears as soon as the page is interactive, not
 * after a lazy boot tick.
 *
 * The "Built with Spline" watermark that the free runtime injects is
 * suppressed in two ways:
 *   1. CSS `::after` mask on `.v2-spline` covers the bottom-right
 *      corner where the watermark renders. Mask colour is bound to
 *      the active theme via `var(--v2-bg-base)` so it always blends.
 *   2. A MutationObserver below removes the watermark `<a>` whenever
 *      it appears in the DOM — belt-and-braces in case Spline injects
 *      it outside the canvas container.
 *
 * Scene asset: https://prod.spline.design/UcBFpVxcJM0n7jLy/scene.splinecode
 */

import { useEffect } from "react";
import Spline from "@splinetool/react-spline/next";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/UcBFpVxcJM0n7jLy/scene.splinecode";

export function SplineHero() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const strip = () => {
      document
        .querySelectorAll('a[href*="spline.design"]')
        .forEach((node) => node.remove());
    };
    strip();
    const obs = new MutationObserver(strip);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="v2-spline" aria-hidden="true">
      <Spline scene={SPLINE_SCENE_URL} />
    </div>
  );
}
