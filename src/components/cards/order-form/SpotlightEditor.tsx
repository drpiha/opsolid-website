"use client";

// =============================================================================
// SpotlightEditor — owner controls for the "Şu an / Now" spotlight panel
// (cardData.spotlight). Shared by BOTH the create flow (OrderFormSection) and
// the edit flow (PersonBrandSection) so the field is visible while creating AND
// while editing — rendered by SpotlightBlock in the UniversalBlocks stack, so
// the live preview in both forms reflects edits immediately.
//
// Localized via the same `L(key, fallback)` contract as the other order-form
// editors; English fallbacks keep it working before locale keys land.
// =============================================================================

import { Input, Select, Textarea } from "@/components/ui/Input";
import type { CardSpotlight } from "@/lib/validation";

const MAX_BODY = 280;

interface Props {
  spotlight: CardSpotlight | undefined;
  onChange: (next: CardSpotlight | undefined) => void;
  L: (k: string, fallback: string) => string;
}

export function SpotlightEditor({ spotlight, onChange, L }: Props) {
  const enabled = spotlight?.enabled !== false; // schema default is on
  const body = spotlight?.body ?? "";
  const linkUrl = spotlight?.linkUrl ?? "";
  const linkLabel = spotlight?.linkLabel ?? "";

  // `stamp` refreshes the "updated X ago" chip — only content edits bump it,
  // not the visibility toggle. Drops the whole object when nothing meaningful
  // remains so cardData stays clean and legacy-equivalent.
  const commit = (patch: Partial<CardSpotlight>, stamp: boolean) => {
    const next: CardSpotlight = { ...(spotlight ?? { enabled: true }), ...patch };
    if (stamp) next.updatedAt = new Date().toISOString();
    const hasContent = Boolean(next.body?.trim() || next.linkUrl?.trim());
    onChange(hasContent || next.enabled === false ? next : undefined);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-ink-300">
        {L(
          "spotlightHint",
          "A bold, momentary update that sits right below your photo — a short note and/or one link. Leave empty to hide it.",
        )}
      </p>

      <label className="flex items-center gap-2.5 rounded-xl border border-line bg-bg-0 px-3 py-2.5">
        <input
          type="checkbox"
          className="h-4 w-4 accent-copper"
          checked={enabled}
          onChange={(e) => commit({ enabled: e.target.checked }, false)}
        />
        <span className="text-sm font-medium text-ink">
          {L("spotlightEnabled", "Show on my card")}
        </span>
      </label>

      <Select
        label={L("spotlightPlacement", "Position on the card")}
        value={spotlight?.placement ?? "belowPhoto"}
        onChange={(e) =>
          commit(
            { placement: e.target.value as CardSpotlight["placement"] },
            false,
          )
        }
      >
        <option value="belowPhoto">
          {L("spotlightPlaceBelowPhoto", "Below the photo (recommended)")}
        </option>
        <option value="top">{L("spotlightPlaceTop", "Top of the card")}</option>
        <option value="bottom">
          {L("spotlightPlaceBottom", "Bottom of the card")}
        </option>
      </Select>

      <div>
        <Textarea
          label={L("spotlightBody", "What's happening right now?")}
          value={body}
          rows={3}
          maxLength={MAX_BODY}
          placeholder={L(
            "spotlightBodyPlaceholder",
            "e.g. Booking new projects for July — say hi 👋",
          )}
          onChange={(e) => commit({ body: e.target.value }, true)}
        />
        <div className="mt-1 text-right mono-label text-[10px] uppercase tracking-wider text-ink/45">
          {body.length} / {MAX_BODY}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Input
          type="url"
          label={L("spotlightLinkUrl", "Link (optional)")}
          value={linkUrl}
          placeholder="https://…"
          onChange={(e) => commit({ linkUrl: e.target.value }, true)}
        />
        <Input
          label={L("spotlightLinkLabel", "Button text (optional)")}
          value={linkLabel}
          maxLength={48}
          placeholder={L("spotlightLinkLabelPlaceholder", "Read more")}
          onChange={(e) => commit({ linkLabel: e.target.value }, true)}
        />
      </div>
    </div>
  );
}
