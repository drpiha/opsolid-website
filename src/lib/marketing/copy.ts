// =============================================================================
// MARKETING CONSENT — CLIENT-SAFE COPY.
//
// The EXACT marketing opt-in checkbox wording, per locale, plus the consent
// text version. This module has NO server-only imports (no prisma, no
// node:crypto) so it is safe to import from BOTH the server (consent.ts /
// signup route — what we persist as `consentText`) AND the client
// (SignupClient.tsx — what the user actually sees and ticks). Keeping a single
// source of truth guarantees the stored consentText equals what the user saw.
//
// Verbatim per the brief; reviewed by the legal agent. Locales outside de/en/tr
// fall back to German (the §7 UWG primary market).
// =============================================================================

/**
 * Version stamp for the consent wording. Bump when the checkbox copy changes
 * so the consent log can tie a stored `consentText` to a known revision.
 */
export const MARKETING_CONSENT_TEXT_VERSION = "2026-06-v1";

export const MARKETING_CHECKBOX_TEXT: Record<"de" | "en" | "tr", string> = {
  de: "Ja, OpSolid darf mir gelegentlich per E-Mail Produktneuigkeiten und Angebote zu OpSo Smart senden. Ich kann diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen (Abmeldelink in jeder E-Mail).",
  en: "Yes, OpSolid may occasionally email me product news and offers about OpSo Smart. I can withdraw this consent at any time with effect for the future (unsubscribe link in every email).",
  tr: "Evet, OpSolid bana ara sıra OpSo Smart hakkında ürün haberleri ve teklifler gönderebilir. Bu izni istediğim zaman ileriye dönük olarak geri çekebilirim (her e-postada abonelikten çıkma bağlantısı).",
};

/**
 * Resolve the checkbox wording for a (possibly missing) locale, defaulting to
 * German — the primary market and the §7 UWG context.
 */
export function marketingCheckboxText(locale?: string | null): string {
  if (locale === "en" || locale === "tr") return MARKETING_CHECKBOX_TEXT[locale];
  return MARKETING_CHECKBOX_TEXT.de;
}
