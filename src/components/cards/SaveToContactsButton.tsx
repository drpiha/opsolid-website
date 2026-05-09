"use client";

// =============================================================================
// SaveToContactsButton — public card page download trigger.
//
// Sits next to SaveCardButton + LocaleSwitcher in the row below the card body.
// On click, navigates the browser to the public vCard endpoint with `download`
// so the user gets the native iOS / Android Contacts import dialog (or a
// "Save File" prompt on desktop).
//
// We deliberately render an <a download> rather than a programmatic blob
// download because:
//   - iOS Safari needs a real navigation to surface the system Contacts sheet.
//   - On desktop the browser's own download UI is more familiar than a JS
//     blob assertion.
//   - The endpoint already sets Content-Disposition: attachment, so direct
//     navigation Just Works without an extra client fetch.
// =============================================================================

import { UserPlus } from "lucide-react";

interface Props {
  /** CardOrder.id — the v1 endpoint is keyed by id, not slug. */
  cardId: string;
  locale?: "de" | "en" | "tr";
  className?: string;
}

const LABELS: Record<"de" | "en" | "tr", { label: string; ariaLabel: string }> = {
  de: { label: "In Kontakte speichern", ariaLabel: "Kontakt in dein Adressbuch speichern" },
  en: { label: "Save to contacts", ariaLabel: "Save contact to your address book" },
  tr: { label: "Rehbere kaydet", ariaLabel: "Rehbere kaydet" },
};

export function SaveToContactsButton({ cardId, locale = "de", className = "" }: Props) {
  const labels = LABELS[locale];
  const href = `/api/v1/cards/${encodeURIComponent(cardId)}/vcard`;

  return (
    <a
      href={href}
      download
      aria-label={labels.ariaLabel}
      className={[
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium",
        "shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-colors",
        "border-line bg-bg-1 text-ink hover:border-copper-500 hover:text-copper-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <UserPlus size={16} strokeWidth={1.8} aria-hidden="true" />
      <span>{labels.label}</span>
    </a>
  );
}
