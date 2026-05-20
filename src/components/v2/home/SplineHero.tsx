"use client";

/**
 * SplineHero — the 3D Spline scene that fills the right column of the
 * home hero. Direct import per operator direction.
 *
 * Watermark suppression: ONLY via the CSS `::after` mask on
 * `.v2-spline` (covers the bottom-right corner with the theme-bound
 * page bg). A previous version also DOM-removed watermark anchors
 * via MutationObserver, but Spline mounts its watermark INSIDE its
 * own React tree — removing the node from outside React broke
 * reconciliation with React error #482 ("Cannot remove a node that
 * wasn't in this tree"). The CSS-only mask is bulletproof and
 * doesn't fight React, so the JS strip was removed.
 *
 * Scene: https://prod.spline.design/UcBFpVxcJM0n7jLy/scene.splinecode
 */

import Spline from "@splinetool/react-spline/next";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/UcBFpVxcJM0n7jLy/scene.splinecode";

export function SplineHero() {
  return (
    <div className="v2-spline" aria-hidden="true">
      <Spline scene={SPLINE_SCENE_URL} />
    </div>
  );
}
