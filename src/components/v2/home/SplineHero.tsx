"use client";

/**
 * SplineHero — 3D robot scene in the home hero's right column.
 *
 * Mount stability: Spline owns its own canvas + WebGL context + an
 * internal watermark anchor inside its own React tree. If a parent
 * wrapper changes structure between renders (the AnimatePresence ↔
 * Fragment toggle in PageTransition used to do this), React unmounts
 * Spline and the WebGL cleanup path trips on nodes Spline already
 * removed — surfacing as Minified React error #482. PageTransition
 * is now a pure passthrough, so Spline mounts exactly once.
 *
 * Watermark suppression is purely CSS — see `.v2-spline::after` in
 * opsolid-v2.css. We never touch Spline-managed DOM from outside.
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
