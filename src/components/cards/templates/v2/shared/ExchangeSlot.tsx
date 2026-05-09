// =============================================================================
// ExchangeSlot — wraps the existing `ExchangeButton` so each v2 template can
// theme the trigger without re-implementing the modal/exchange-post logic.
//
// Phase 6 contract preserved: same POST `/api/cards/[slug]/exchange`, same
// localStorage discovery (`myCardSlug`), same i18n strings. We only add an
// outer wrapper class hook so a template can place this into the layout flow.
// =============================================================================

"use client";

import * as React from "react";
import { ExchangeButton } from "@/components/cards/smart/ExchangeButton";

export interface ExchangeSlotProps {
  slug: string;
  primary: string;
  locale?: "de" | "en" | "tr" | "es" | "it" | "fr" | "ar";
  className?: string;
}

export function ExchangeSlot({
  slug,
  primary,
  locale,
  className,
}: ExchangeSlotProps) {
  return (
    <div className={className}>
      <ExchangeButton slug={slug} primary={primary} locale={locale} />
    </div>
  );
}
