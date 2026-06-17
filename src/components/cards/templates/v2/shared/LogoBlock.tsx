"use client";

// =============================================================================
// LogoBlock — universal brand strip rendered ABOVE the template (wrapper-level
// block, like VideoBlock). Guarantees the owner's logo shows no matter which
// template is chosen: 73 of 96 templates never render `logoPath` (Maker uses a
// monogram instead). This slim, centered, transparent strip fills that gap.
//
// Gated by LOGO_NATIVE_KEYS — the templates that already place a logo inside
// their own header — so those don't get a duplicate. Self-hides with no logo.
// =============================================================================

import * as React from "react";

interface LogoBlockProps {
  logoPath?: string | null;
  tone?: "light" | "dark";
  /** True for templates that render the logo natively → skip the strip. */
  suppress?: boolean;
}

function resolveSrc(path: string): string {
  if (/^(https?:|blob:|data:)/.test(path) || path.startsWith("/")) return path;
  return `/${path}`;
}

export function LogoBlock({ logoPath, tone = "light", suppress = false }: LogoBlockProps) {
  if (!logoPath || suppress) return null;
  void tone;

  // Centered brand mark with generous whitespace — reads as a discreet
  // "letterhead" above the card rather than a separate bar (no hard border).
  // `tpl-logo` makes the owner's position editor (pan/zoom) apply here too, so
  // the logo fits properly on EVERY non-native template, not just the 22 with a
  // bespoke slot. `object-contain` + bounded size keeps any aspect ratio /
  // transparent PNG intact and never crops the mark.
  return (
    <div className="flex items-center justify-center px-6 pb-3 pt-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveSrc(logoPath)}
        alt=""
        className="tpl-logo h-auto max-h-[56px] w-auto max-w-[60%] object-contain"
      />
    </div>
  );
}
