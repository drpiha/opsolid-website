// =============================================================================
// QR style presets — single source of truth for the 8 named looks shared by
// the server renderer (src/lib/qr/styled-server.ts) and the client widget
// (src/components/cards/qr/QRStylist.tsx).
//
// Naming matches the QrStyleSchema enum in src/lib/validation.ts. When a
// customer picks a preset in the widget, we persist `qrStyle.preset` and
// re-derive the visual settings here, not from any UI-only state.
// =============================================================================

export type QrPresetKey =
  | "classic"
  | "rounded"
  | "dots"
  | "diamond"
  | "gradient"
  | "monoNeon"
  | "watercolor"
  | "brandSync";

export type QrDotShape = "square" | "rounded" | "dots" | "classy" | "extra-rounded";
export type QrEyeShape = "square" | "extra-rounded" | "dot";

export interface QrPreset {
  key: QrPresetKey;
  label: string;
  /** Foreground color when the order has no brand color set. */
  defaultPrimary: string;
  /** Background color (almost always white). */
  defaultBackground: string;
  /** Optional second color for gradient/dual-tone presets. */
  defaultAccent?: string;
  /** Shape used by qr-code-styling for the data dots. */
  dotShape: QrDotShape;
  /** Shape for the three corner finder patterns ("eyes"). */
  eyeShape: QrEyeShape;
  /** Linear gradient (true) vs solid fill (false) for foreground dots. */
  gradient: boolean;
  /** Hint shown in the Stylist widget, shown as a sub-label. */
  description: string;
}

export const QR_PRESETS: Record<QrPresetKey, QrPreset> = {
  classic: {
    key: "classic",
    label: "Classic",
    defaultPrimary: "#15120F",
    defaultBackground: "#FFFFFF",
    dotShape: "square",
    eyeShape: "square",
    gradient: false,
    description: "Maximum scan reliability — ink black on warm white.",
  },
  rounded: {
    key: "rounded",
    label: "Rounded",
    defaultPrimary: "#15120F",
    defaultBackground: "#FFFFFF",
    dotShape: "rounded",
    eyeShape: "extra-rounded",
    gradient: false,
    description: "Softer corners, friendlier feel — premium default.",
  },
  dots: {
    key: "dots",
    label: "Dots",
    defaultPrimary: "#15120F",
    defaultBackground: "#FFFFFF",
    dotShape: "dots",
    eyeShape: "dot",
    gradient: false,
    description: "Pure circles — playful, modern, content-creator vibe.",
  },
  diamond: {
    key: "diamond",
    label: "Diamond",
    defaultPrimary: "#15120F",
    defaultBackground: "#FFFFFF",
    dotShape: "classy",
    eyeShape: "square",
    gradient: false,
    description: "Faceted dots — luxury / boutique feel.",
  },
  gradient: {
    key: "gradient",
    label: "Gradient",
    defaultPrimary: "#7C3AED",
    defaultBackground: "#FFFFFF",
    defaultAccent: "#EC4899",
    dotShape: "extra-rounded",
    eyeShape: "extra-rounded",
    gradient: true,
    description: "Linear color sweep — bold, energetic, creator-first.",
  },
  monoNeon: {
    key: "monoNeon",
    label: "Mono Neon",
    defaultPrimary: "#06B6D4",
    defaultBackground: "#0B1020",
    dotShape: "rounded",
    eyeShape: "extra-rounded",
    gradient: false,
    description: "Cyan on near-black — cyberpunk dev / studio.",
  },
  watercolor: {
    key: "watercolor",
    label: "Watercolor",
    defaultPrimary: "#0F766E",
    defaultBackground: "#F9FAF7",
    defaultAccent: "#84CC16",
    dotShape: "extra-rounded",
    eyeShape: "extra-rounded",
    gradient: true,
    description: "Soft teal-to-lime sweep — organic, atelier, salon.",
  },
  brandSync: {
    key: "brandSync",
    label: "Brand Sync",
    defaultPrimary: "#15120F",
    defaultBackground: "#FFFFFF",
    defaultAccent: "#E8A252",
    dotShape: "rounded",
    eyeShape: "extra-rounded",
    gradient: true,
    description: "Auto-uses your brandPrimaryHex + brandAccentHex.",
  },
};

export function getPreset(key: string | null | undefined): QrPreset {
  if (key && key in QR_PRESETS) return QR_PRESETS[key as QrPresetKey];
  return QR_PRESETS.rounded; // sensible premium default
}
