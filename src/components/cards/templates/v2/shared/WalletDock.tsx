// =============================================================================
// WalletDock — passthrough wrapper for the {walletSlot} prop.
//
// Phase 6's `WalletButtons` server component is mounted by the parent and
// passed in via `walletSlot`. Each v2 template decides *where* in the layout
// the slot renders and what visual chrome surrounds it (eyebrow label,
// hairline divider, background tile). This wrapper keeps that wrapper-shape
// declarative so a template like RealEstate just writes:
//
//   <WalletDock label="Add to wallet" tone="dark">
//     {walletSlot}
//   </WalletDock>
//
// rather than re-implementing the `border-t / px / py / eyebrow` recipe.
// =============================================================================

import * as React from "react";

export interface WalletDockProps {
  children: React.ReactNode;
  /** Optional eyebrow / label rendered above the buttons. */
  label?: string;
  /** Tailwind class string for the wrapper. Templates style freely. */
  className?: string;
  /** Tailwind class string for the eyebrow label. */
  labelClassName?: string;
}

export function WalletDock({
  children,
  label,
  className,
  labelClassName,
}: WalletDockProps) {
  // No buttons configured — render nothing so the section header doesn't
  // hang over an empty area.
  if (!children) return null;

  return (
    <div className={className ?? "border-t border-line px-6 py-5"}>
      {label && (
        <p
          className={
            labelClassName ??
            "mb-3 text-[10px] uppercase tracking-[0.18em] font-semibold text-ink-400"
          }
        >
          {label}
        </p>
      )}
      {children}
    </div>
  );
}
