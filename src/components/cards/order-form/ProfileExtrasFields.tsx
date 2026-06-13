"use client";

// =============================================================================
// Profile extras — tagline + location chip controls.
//
// 2026-06 hardcoded-data purge: templates used to ship persona taglines
// ("2014'ten beri sevgiyle") and a `|| "Berlin"` location fallback. Both are
// now owner-controlled:
//   • tagline — short claim line; empty falls back to position/title
//     (resolveTagline), never to template copy.
//   • location — tri-state: Auto (city derived from address) / Custom text /
//     Hidden (`hideLocation: true`).
// =============================================================================

import * as React from "react";
import type { CardData } from "@/lib/validation";
import { lastAddressSegment } from "@/components/cards/templates/v2/shared/profileExtras";

type LocationMode = "auto" | "custom" | "hidden";

interface Props {
  cardData: CardData;
  /** Writes a single cardData field (same contract as the editor's setCard). */
  setField: <K extends keyof CardData>(key: K, value: CardData[K]) => void;
  L: (k: string, fallback: string) => string;
}

export function ProfileExtrasFields({ cardData, setField, L }: Props) {
  const mode: LocationMode = cardData.hideLocation
    ? "hidden"
    : cardData.location
      ? "custom"
      : "auto";

  const derivedCity = lastAddressSegment(cardData.address) ?? "";

  const setMode = (next: LocationMode) => {
    if (next === "hidden") {
      setField("hideLocation", true);
      setField("location", undefined);
    } else if (next === "custom") {
      setField("hideLocation", undefined);
      setField("location", cardData.location || derivedCity);
    } else {
      setField("hideLocation", undefined);
      setField("location", undefined);
    }
  };

  const modeBtn = (value: LocationMode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(value)}
      aria-pressed={mode === value}
      className={[
        "rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
        mode === value
          ? "border border-copper bg-copper/15 text-ink"
          : "border border-line bg-white text-ink-300 hover:border-copper/50 hover:text-ink",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Tagline */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink">
          {L("taglineLabel", "Tagline")}
        </label>
        <input
          type="text"
          className="field w-full"
          placeholder={L("taglinePlaceholder", "A short claim line (optional)")}
          value={cardData.tagline ?? ""}
          maxLength={80}
          onChange={(e) => setField("tagline", e.target.value || undefined)}
        />
        <p className="text-[11px] text-ink-300">
          {L(
            "taglineHint",
            "Shown under your name on some designs. Empty = your role/title is used instead.",
          )}
        </p>
      </div>

      {/* Location chip */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink">
          {L("locationLabel", "Location on card")}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {modeBtn("auto", L("locationAuto", "From address"))}
          {modeBtn("custom", L("locationCustom", "Custom"))}
          {modeBtn("hidden", L("locationHidden", "Hidden"))}
        </div>
        {mode === "auto" && (
          <p className="text-[11px] text-ink-300">
            {derivedCity
              ? `${L("locationAutoHint", "Derived from your address:")} ${derivedCity}`
              : L(
                  "locationAutoEmpty",
                  "No address yet — no location will be shown until you add one.",
                )}
          </p>
        )}
        {mode === "custom" && (
          <input
            type="text"
            className="field w-full"
            placeholder={L("locationPlaceholder", "Remote · Berlin")}
            value={cardData.location ?? ""}
            maxLength={64}
            onChange={(e) => setField("location", e.target.value || undefined)}
          />
        )}
        {mode === "hidden" && (
          <p className="text-[11px] text-ink-300">
            {L("locationHiddenHint", "No location chip will appear on your card.")}
          </p>
        )}
      </div>
    </div>
  );
}
