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
  const isDark = tone === "dark";

  return (
    <div
      className={[
        "flex items-center justify-center px-6 py-4",
        isDark ? "border-b border-white/10" : "border-b border-line/70",
      ].join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveSrc(logoPath)}
        alt=""
        className="max-h-12 w-auto max-w-[60%] object-contain"
      />
    </div>
  );
}
