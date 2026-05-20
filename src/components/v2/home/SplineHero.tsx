"use client";

/**
 * SplineHero — the 3D Spline scene that lives on the right side of the
 * home hero. Replaces the legacy WorkflowMock card.
 *
 * Loading:
 *   - Dynamic import so the ~600 kB Spline runtime isn't shipped in the
 *     initial HTML chunk. Scene boots after first paint.
 *   - Suspense fallback renders a quiet placeholder card (same footprint
 *     as the scene area) so layout doesn't jump on load.
 *
 * Fallback rules:
 *   - prefers-reduced-motion → skip the WebGL canvas, render a static
 *     placeholder.
 *   - Coarse pointer (touch) AND viewport < 900px → render a small
 *     teaser placeholder instead of booting a heavy WebGL scene on a
 *     low-power device.
 *
 * Scene asset: https://prod.spline.design/UcBFpVxcJM0n7jLy/scene.splinecode
 * Provided by the operator; can be swapped without changing this file.
 */

import { Suspense, lazy, useEffect, useState } from "react";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/UcBFpVxcJM0n7jLy/scene.splinecode";

const Spline = lazy(() =>
  import("@splinetool/react-spline/next").then((m) => ({ default: m.default })),
);

function Placeholder() {
  return (
    <div className="v2-spline-placeholder" aria-hidden="true">
      <div className="v2-spline-placeholder__orb" />
      <div className="v2-spline-placeholder__ring" />
      <div className="v2-spline-placeholder__ring v2-spline-placeholder__ring--lg" />
    </div>
  );
}

export function SplineHero() {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small =
      window.matchMedia("(max-width: 900px)").matches &&
      window.matchMedia("(pointer: coarse)").matches;
    if (reduced || small) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, []);

  // Strip the Spline "Built with Spline" watermark anchor whenever it
  // appears in the DOM. The CSS selectors already hide it, but this
  // belt-and-braces removal handles cases where Spline inlines the
  // node with !important styles we cannot override from CSS alone.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const strip = () => {
      const anchors = document.querySelectorAll(
        'a[href*="spline.design"]',
      );
      anchors.forEach((a) => a.remove());
    };
    strip();
    const obs = new MutationObserver(strip);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="v2-spline" aria-hidden="true">
      {enabled ? (
        <Suspense fallback={<Placeholder />}>
          <Spline scene={SPLINE_SCENE_URL} />
        </Suspense>
      ) : (
        <Placeholder />
      )}
    </div>
  );
}
