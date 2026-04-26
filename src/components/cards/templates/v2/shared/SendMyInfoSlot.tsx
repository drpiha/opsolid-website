// =============================================================================
// SendMyInfoSlot — wraps the existing `SendMyInfoButton` so each v2 template
// can theme the trigger without re-implementing the modal/lead-post logic.
//
// `SendMyInfoButton` already accepts a `primary` colour and styles the
// trigger inline with that. This slot only adds an outer wrapper class hook
// and a small `tone` switch — it does NOT fork the modal or the API call.
// Phase 6 lead-post behaviour is preserved 1:1.
// =============================================================================

"use client";

import * as React from "react";
import { SendMyInfoButton } from "@/components/cards/smart/SendMyInfoButton";

export interface SendMyInfoSlotProps {
  slug: string;
  sourceQs: string;
  /** Drives the button accent (border, fill on submit). */
  primary: string;
  /** Outer wrapper classes — usually a `mt-x` to slot into the template flow. */
  className?: string;
}

export function SendMyInfoSlot({
  slug,
  sourceQs,
  primary,
  className,
}: SendMyInfoSlotProps) {
  return (
    <div className={className}>
      <SendMyInfoButton slug={slug} sourceQs={sourceQs} primary={primary} />
    </div>
  );
}
