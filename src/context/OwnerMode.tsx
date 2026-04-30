"use client";

// =============================================================================
// OwnerModeContext — propagates the "viewing as owner" flag down through the
// public card tree (/c/[slug]). Consumed by visitor-only CTAs (SendMyInfoButton,
// ExchangeButton, album upload form) so they noop when the card owner is
// previewing their own card via `?owner=<editToken>`.
//
// Server-side detection lives in `app/c/[slug]/page.tsx`; this provider is a
// thin client wrapper so the value can be read by the deeply-nested template
// components without prop-drilling through 100+ template files.
// =============================================================================

import { createContext, useContext } from "react";

const OwnerModeContext = createContext<boolean>(false);

export function OwnerModeProvider({
  isOwner,
  children,
}: {
  isOwner: boolean;
  children: React.ReactNode;
}) {
  return (
    <OwnerModeContext.Provider value={isOwner}>
      {children}
    </OwnerModeContext.Provider>
  );
}

export function useIsOwner(): boolean {
  return useContext(OwnerModeContext);
}
