// =============================================================================
// SendMyInfoSlot — wraps SendMyInfoButton so each v2 template can theme the
// trigger without re-implementing the modal/lead-post logic. Resolves the
// owner's persisted locale (DE/EN/TR) into a labels bag and passes it through.
// =============================================================================

import * as React from "react";
import { SendMyInfoButton } from "@/components/cards/smart/SendMyInfoButton";
import { contents } from "@/content";

export interface SendMyInfoSlotProps {
  slug: string;
  sourceQs: string;
  /** Drives the button accent (border, fill on submit). */
  primary: string;
  /** Outer wrapper classes — usually a `mt-x` to slot into the template flow. */
  className?: string;
  /** Owner's persisted locale (from CardOrder.locale). Defaults to "de". */
  locale?: "de" | "en" | "tr";
}

export function SendMyInfoSlot({
  slug,
  sourceQs,
  primary,
  className,
  locale = "de",
}: SendMyInfoSlotProps) {
  const labels = contents[locale].card.send;
  return (
    <div className={className}>
      <SendMyInfoButton
        slug={slug}
        sourceQs={sourceQs}
        primary={primary}
        labels={labels}
      />
    </div>
  );
}
