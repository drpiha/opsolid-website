// =============================================================================
// StatusBanner — owner-curated short notice rendered above the public card.
//
// Phase 6.6 addition. Owner edits this in the Settings tab (`statusMessage`
// field on cardData). The banner is intentionally restrained — a single line
// of text, a soft tinted background, no buttons. It's a billboard, not a CTA.
//
// Three tones map to subtly different palettes; all three respect the active
// theme tokens so the banner sits naturally on light/hybrid/dark surfaces.
// =============================================================================

import { Sparkles } from "lucide-react";

// Two generations of tone vocabulary live in the wild:
//   - Phase 6.6 web ("info" | "warm" | "celebration") — `cardData.statusMessage`
//   - Sprint 6 mobile ("info" | "success" | "warn" | "announce") — `cardData.statusBanner`
// The component accepts the union; the page preference order (statusBanner →
// statusMessage) is enforced upstream in src/app/c/[slug]/page.tsx.
type Tone =
  | "info"
  | "warm"
  | "celebration"
  | "success"
  | "warn"
  | "announce";

interface Props {
  text: string;
  tone?: Tone;
  accentHex?: string | null;
}

export function StatusBanner({ text, tone = "info", accentHex }: Props) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Per-tone classes are kept inline — six variants still sits below the
  // threshold where a CVA wrapper would pay for itself.
  const classes =
    tone === "celebration" || tone === "announce"
      ? "border-copper-500/40 bg-copper-500/10 text-ink"
      : tone === "warm" || tone === "warn"
        ? "border-copper-500/25 bg-copper-50/60 text-ink"
        : tone === "success"
          ? "border-[rgba(127,178,134,0.40)] bg-[rgba(127,178,134,0.12)] text-ink"
          : "border-line bg-bg-1 text-ink";

  // Tones that render a Sparkles glyph: the celebratory / announcement family.
  const showIcon = tone === "celebration" || tone === "announce";

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "mx-auto mb-4 flex max-w-[420px] items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-[13px] font-medium leading-snug shadow-sm",
        classes,
      ].join(" ")}
      style={
        showIcon && accentHex
          ? { borderColor: `${accentHex}55`, backgroundColor: `${accentHex}14` }
          : undefined
      }
    >
      {showIcon && (
        <Sparkles
          size={14}
          className="shrink-0 text-copper"
          style={accentHex ? { color: accentHex } : undefined}
          aria-hidden
        />
      )}
      <span className="min-w-0 flex-1 break-words">{trimmed}</span>
    </div>
  );
}
