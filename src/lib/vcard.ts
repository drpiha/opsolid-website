// =============================================================================
// vCard 4.0 builder — turns a published CardOrder into an RFC 6350 .vcf file
// that iOS Contacts, Android Contacts, Outlook and Apple Mail all understand.
//
// Why 4.0 (not 3.0)?
//   - Native UTF-8 (no quoted-printable encoding for non-ASCII names)
//   - Cleaner TYPE= parameters (cell, work, home, voice, video, text)
//   - All modern OS contact apps support it (≥ iOS 8, ≥ Android 5)
//
// Photo embedding: we inline-embed (PHOTO;ENCODING=b;...) when the photo is
// reasonably small (<1.5 MB). For larger photos we emit a URL reference so the
// .vcf doesn't bloat to multi-MB and break import on older devices.
// =============================================================================

import type { CardData } from "@/lib/validation";

export interface BuildVCardArgs {
  cardData: CardData;
  /** Already absolute https URL (Vercel Blob) or origin-relative path (local). */
  photoUrl?: string;
  /** Inline base64 bytes for the photo (when small enough to embed). */
  photoBytes?: { mime: string; base64: string };
  /** Public URL of the card page — added as URL field. */
  cardPageUrl: string;
}

const CRLF = "\r\n"; // RFC 6350 mandates CRLF line endings.

/**
 * vCard properties forbid raw \, ; , and , in values — they must be escaped
 * with a leading backslash. We also fold long lines per RFC at 75 octets.
 */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Soft line folding per RFC 6350 §3.2: at most 75 octets per line, CRLF
 * followed by a single space to continue. Prevents Outlook/Mail.app from
 * truncating long URLs or bios.
 */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    const chunk = line.slice(i, i + (i === 0 ? 75 : 74));
    chunks.push(chunk);
    i += chunk.length;
  }
  return chunks.join(CRLF + " ");
}

/**
 * Best-effort split of a name into Family/Given for the structured N field.
 * Falls back to ";Name;;;" when only one token is present (Contacts apps
 * happily render that as a single-line display name).
 */
function structuredName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return `;${esc(parts[0])};;;`;
  }
  const family = parts[parts.length - 1];
  const given = parts.slice(0, -1).join(" ");
  return `${esc(family)};${esc(given)};;;`;
}

function digitsOnly(phone: string): string {
  return phone.replace(/[^+0-9]/g, "");
}

export function buildVCard(args: BuildVCardArgs): string {
  const { cardData, photoUrl, photoBytes, cardPageUrl } = args;
  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:4.0");
  lines.push(`FN:${esc(cardData.name)}`);
  lines.push(`N:${structuredName(cardData.name)}`);

  if (cardData.company) lines.push(`ORG:${esc(cardData.company)}`);
  if (cardData.title) lines.push(`TITLE:${esc(cardData.title)}`);

  if (cardData.phone) {
    // CELL is the most universal type label and what Contacts apps rank first.
    lines.push(`TEL;TYPE=cell,voice;VALUE=uri:tel:${digitsOnly(cardData.phone)}`);
  }
  if (cardData.whatsapp) {
    // No standard TYPE for WhatsApp — emit a plain TEL plus an X-SOCIALPROFILE
    // pointer so a future "Open in WhatsApp" tap target works in some clients.
    lines.push(`TEL;TYPE=cell,text;VALUE=uri:tel:${digitsOnly(cardData.whatsapp)}`);
    lines.push(
      `X-SOCIALPROFILE;TYPE=whatsapp:https://wa.me/${digitsOnly(cardData.whatsapp).replace(/^\+/, "")}`
    );
  }
  if (cardData.email) lines.push(`EMAIL;TYPE=internet:${esc(cardData.email)}`);
  if (cardData.website) lines.push(`URL:${esc(cardData.website)}`);

  if (cardData.address) {
    // ADR is structured as PO;Ext;Street;City;Region;Postal;Country. We don't
    // have a structured address from the form, so we emit the whole thing in
    // the "street" slot — Contacts apps render that fine as a single line.
    lines.push(`ADR;TYPE=work:;;${esc(cardData.address)};;;;`);
  }
  if (cardData.bio) lines.push(`NOTE:${esc(cardData.bio)}`);

  lines.push(`URL;TYPE=card:${esc(cardPageUrl)}`);

  // Social profiles — X-SOCIALPROFILE is widely understood by macOS/iOS Contacts
  // and is harmless to other clients.
  if (cardData.socials) {
    const s = cardData.socials;
    if (s.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${esc(s.linkedin)}`);
    if (s.instagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${esc(s.instagram)}`);
    if (s.x) lines.push(`X-SOCIALPROFILE;TYPE=twitter:${esc(s.x)}`);
    if (s.tiktok) lines.push(`X-SOCIALPROFILE;TYPE=tiktok:${esc(s.tiktok)}`);
    if (s.youtube) lines.push(`X-SOCIALPROFILE;TYPE=youtube:${esc(s.youtube)}`);
    if (s.github) lines.push(`X-SOCIALPROFILE;TYPE=github:${esc(s.github)}`);
    if (s.facebook) lines.push(`X-SOCIALPROFILE;TYPE=facebook:${esc(s.facebook)}`);
  }

  // Photo: prefer inline base64 if we have it (offline-friendly), else URL.
  if (photoBytes) {
    const mediaType =
      photoBytes.mime.split("/")[1]?.toUpperCase() ?? "JPEG";
    lines.push(
      `PHOTO;ENCODING=b;TYPE=${mediaType}:${photoBytes.base64}`
    );
  } else if (photoUrl) {
    lines.push(`PHOTO;VALUE=uri:${esc(photoUrl)}`);
  }

  lines.push(`REV:${new Date().toISOString()}`);
  lines.push("END:VCARD");

  return lines.map(fold).join(CRLF) + CRLF;
}

/**
 * Sanitize the card name into a safe download filename. iOS uses the name we
 * send in Content-Disposition as the contact suggestion, so we want it to read
 * naturally ("Hasan Donmez.vcf") not as a slug ("hasan-donmez.vcf").
 */
export function vcardFilename(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 60);
  return `${cleaned || "contact"}.vcf`;
}
