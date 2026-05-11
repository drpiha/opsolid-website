"use client";

// =============================================================================
// TipJarBlock — Buy-Me-a-Coffee CTA rendered for ALL templates at wrapper level.
//
// Visible when cardData.tipJar.enabled === true AND the owner is Pro (the API
// already gates /api/cards/[slug]/tip on Pro, but we hide the button too for
// defence-in-depth). The block POSTs to the existing tip route and redirects
// the visitor to the Stripe Checkout session URL returned.
//
// The `ownerIsPro` prop is evaluated server-side in page.tsx from the Prisma
// user record and threaded in here so the client never needs to fetch auth.
//
// Returns null when tipJar is absent, disabled, or owner is not Pro.
// =============================================================================

import { useState } from "react";
import type { CardData } from "@/lib/validation";

interface Props {
  slug: string;
  tipJar: CardData["tipJar"] | null;
  /** Passed from server — avoids a client-side /api/auth/me round-trip. */
  ownerIsPro: boolean;
  /** Brand-primary hex for the button background. */
  primaryHex?: string | null;
}

export function TipJarBlock({
  slug,
  tipJar,
  ownerIsPro,
  primaryHex,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Guard: nothing to render unless explicitly enabled by a Pro owner AND
  // the owner has wired up a Stripe price. Without a price the API would
  // 503 `tip_unavailable` on click — better to hide the button entirely
  // than show a CTA that errors.
  if (!tipJar?.enabled || !ownerIsPro) return null;
  const stripePriceId =
    typeof (tipJar as { stripePriceId?: unknown }).stripePriceId === "string"
      ? ((tipJar as { stripePriceId?: string }).stripePriceId ?? "").trim()
      : "";
  if (!stripePriceId) return null;

  const label = tipJar.label?.trim() || "Support me";
  const primary = primaryHex ?? "#C27940";

  async function handleClick() {
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/cards/${encodeURIComponent(slug)}/tip`, {
        method: "POST",
      });
      const json = (await res.json()) as { url?: string; error?: { message?: string } };
      if (!res.ok || !json.url) {
        setErrorMsg(json.error?.message ?? "Tip unavailable. Try again later.");
        setStatus("error");
        return;
      }
      // Redirect to Stripe Checkout.
      window.location.href = json.url;
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="mt-6">
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={status === "loading"}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.97] disabled:opacity-60"
        style={{ background: primary }}
        aria-label={label}
      >
        {status === "loading" ? (
          <span aria-live="polite">…</span>
        ) : (
          <>
            <span aria-hidden>☕</span>
            <span>{label}</span>
          </>
        )}
      </button>
      {status === "error" && errorMsg && (
        <p
          role="alert"
          className="mt-2 text-center text-xs text-red-600"
        >
          {errorMsg}
        </p>
      )}
    </section>
  );
}
