"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * AmbientBackdrop — soft, theme-aware ambient field behind the entire app.
 *
 * 5 slow-drifting SVG blobs + paper grain feel. Pure CSS animation (no RAF)
 * to keep CPU idle; transforms only. Fades in on mount. Pointer-events none,
 * sits at z-index 0 while main content stays at z-index 1+.
 *
 * Respects prefers-reduced-motion and goes static on viewports below `md`.
 */
export function AmbientBackdrop() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Defer to the next frame so the initial opacity transition can play.
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Skip the marketing backdrop on customer self-service surfaces.
  if (pathname && /\/card\/edit\//.test(pathname)) return null;

  return (
    <div
      className="ambient-backdrop"
      aria-hidden="true"
      data-ready={ready ? "1" : "0"}
    >
      <svg
        className="ambient-svg"
        viewBox="0 0 1600 1200"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="ambSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="80" />
          </filter>
          <radialGradient id="ambBlobA" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--copper-400)" stopOpacity="0.45" />
            <stop offset="1" stopColor="var(--copper-400)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ambBlobB" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--copper-200)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--copper-200)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ambBlobC" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--ink-400)" stopOpacity="0.20" />
            <stop offset="1" stopColor="var(--ink-400)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g filter="url(#ambSoft)">
          <circle
            className="amb-blob amb-blob-a"
            cx="280"
            cy="240"
            r="240"
            fill="url(#ambBlobA)"
          />
          <circle
            className="amb-blob amb-blob-b"
            cx="1300"
            cy="380"
            r="320"
            fill="url(#ambBlobB)"
          />
          <circle
            className="amb-blob amb-blob-c"
            cx="900"
            cy="900"
            r="280"
            fill="url(#ambBlobC)"
          />
          <circle
            className="amb-blob amb-blob-d"
            cx="400"
            cy="1000"
            r="220"
            fill="url(#ambBlobA)"
          />
          <circle
            className="amb-blob amb-blob-e"
            cx="1500"
            cy="1100"
            r="260"
            fill="url(#ambBlobB)"
          />
        </g>
      </svg>
    </div>
  );
}
