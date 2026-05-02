// =============================================================================
// Shared types for the CardEditClient section components (A8.2 split).
//
// State remains owned by CardEditClient (the orchestrator). Section components
// are "controlled" — they receive the slices of state they render plus the
// setters/handlers needed to mutate them. The split is purely mechanical so
// the visual output is byte-identical to the pre-split version.
// =============================================================================

import type { CardData } from "@/lib/validation";

export type FormState = "idle" | "saving" | "saved" | "error";

/**
 * Generic CardData setter. Mirrors the inline helper used in CardEditClient:
 *   const setCard = <K extends keyof CardData>(key: K, value: CardData[K]) =>
 *     setCardData((c) => ({ ...c, [key]: value }));
 *
 * Declared as a generic call signature so callers keep full type-safety.
 */
export interface SetCardFn {
  <K extends keyof CardData>(key: K, value: CardData[K]): void;
}

/** Setter for a single key inside cardData.socials. */
export type SetSocialFn = (
  key: keyof NonNullable<CardData["socials"]>,
  value: string,
) => void;

/** Upload helper — returns the storage path (or null on failure). */
export type HandleFileUpload = (
  file: File,
  kind: "photo" | "logo",
) => Promise<string | null>;

/** B7 expand/collapse contract. */
export interface SectionToggle {
  openSections: Set<string>;
  toggleSection: (id: string) => void;
}
