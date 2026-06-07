"use client";

// =============================================================================
// ServiceLink — wraps a product/service card. Renders a real <a> (new tab)
// when the service has an `href`, otherwise a plain <div>. Lets templates make
// the "Buy"/"Kaufen" affordance clickable without bespoke per-template link
// plumbing — drop it in as the outer element of an existing service card.
// =============================================================================

import * as React from "react";

interface ServiceLinkProps {
  href?: string | null;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function ServiceLink({ href, className, style, children }: ServiceLinkProps) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
