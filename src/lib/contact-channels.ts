// =============================================================================
// contact-channels — outbound contact links for product inquiries (OpSo Smart
// custom-card requests in particular). Server-safe (no "use client"): imported
// by both server components and client CTAs.
//
// One source of truth for the WhatsApp / phone / email hrefs so every CTA
// (product page, pricing section, public card footer) renders the same links
// with a consistent, pre-filled message. Labels are NOT here — they come from
// the locale files so the UI stays translatable; this module returns only the
// machine-readable `kind`, the human-readable `value`, and the `href`.
// =============================================================================

import { SITE_CONFIG } from "@/lib/constants";

/** Strip everything but digits (drops "+", spaces, dashes) for wa.me / tel. */
function digits(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

/** WhatsApp click-to-chat link. `prefill` becomes the pre-typed message. */
export function waLink(phoneE164: string, prefill?: string): string {
  const base = `https://wa.me/${digits(phoneE164)}`;
  return prefill ? `${base}?text=${encodeURIComponent(prefill)}` : base;
}

/** `tel:` link in E.164 (keeps the leading +). */
export function telLink(phoneE164: string): string {
  return `tel:+${digits(phoneE164)}`;
}

/** `mailto:` with optional subject/body. */
export function mailtoLink(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return qs ? `mailto:${email}?${qs}` : `mailto:${email}`;
}

export type ContactChannelKind = "whatsappTr" | "whatsappDe" | "phone" | "email";

export interface ContactChannel {
  kind: ContactChannelKind;
  /** Human-readable value shown next to the label (number / address). */
  value: string;
  href: string;
}

/**
 * The contact channels for a product inquiry. Since 2026-11-11 (owner's decision) the site shows no phone or
 * WhatsApp number, so this is email only; the WhatsApp and phone kinds stay in the type for the locale labels.
 * Pass `prefill` to pre-type the email subject (e.g. "OpSo Smart — özel tasarım talebi").
 */
export function getContactChannels(prefill?: string): ContactChannel[] {
  return [
    {
      kind: "email",
      value: SITE_CONFIG.email,
      href: mailtoLink(SITE_CONFIG.email, prefill),
    },
  ];
}
