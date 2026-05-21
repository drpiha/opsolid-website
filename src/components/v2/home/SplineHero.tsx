"use client";

/**
 * SplineHero — 3D robot scene in the home hero's right column.
 *
 * Background transparency: the published scene at the URL below was
 * exported with a baked-in light background. We can't edit the scene
 * file, but the Spline runtime exposes `setBackgroundColor(color)` on
 * the Application instance that's handed to the `onLoad` callback.
 * Setting it to a zero-alpha color removes the white plate so the
 * robot floats over whatever page surface sits behind it (twilight
 * indigo today, dark charcoal under the dark toggle).
 *
 * Mount stability: Spline owns its own canvas + WebGL context + an
 * internal watermark anchor inside its own React tree. If a parent
 * wrapper changes structure between renders (PageTransition's old
 * AnimatePresence ↔ Fragment flip did this), React unmounts Spline
 * and the WebGL cleanup path trips on nodes Spline already removed
 * — surfacing as Minified React error #482. PageTransition is now a
 * pure passthrough, so Spline mounts exactly once.
 *
 * Watermark suppression is purely CSS — see `.v2-spline::after` in
 * opsolid-v2.css. We never touch Spline-managed DOM from outside.
 */

import Spline from "@splinetool/react-spline/next";
import type { Application as SplineApplication } from "@splinetool/runtime";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/UcBFpVxcJM0n7jLy/scene.splinecode";

function handleSplineLoad(spline: SplineApplication) {
  try {
    spline.setBackgroundColor("rgba(0, 0, 0, 0)");
  } catch {
    // Older runtime builds may not expose setBackgroundColor; the CSS
    // mask in .v2-spline still hides the bottom-right corner, so a
    // miss here is cosmetic, not fatal.
  }
}

export function SplineHero() {
  return (
    <div className="v2-spline" aria-hidden="true">
      <Spline scene={SPLINE_SCENE_URL} onLoad={handleSplineLoad} />
    </div>
  );
}
