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
 * The ordered list of contact channels for a product inquiry. Pass `prefill`
 * to pre-type a WhatsApp/email message (e.g. "OpSo Smart — özel tasarım
 * talebi"). The order is intentional: WhatsApp first (fastest), then phone,
 * then email.
 */
export function getContactChannels(prefill?: string): ContactChannel[] {
  const wa = SITE_CONFIG.whatsapp;
  return [
    { kind: "whatsappTr", value: wa.tr, href: waLink(wa.tr, prefill) },
    { kind: "whatsappDe", value: wa.de, href: waLink(wa.de, prefill) },
    { kind: "phone", value: SITE_CONFIG.phone, href: telLink(SITE_CONFIG.phone) },
    {
      kind: "email",
      value: SITE_CONFIG.email,
      href: mailtoLink(SITE_CONFIG.email, prefill),
    },
  ];
}
