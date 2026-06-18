// =============================================================================
// vCard builder — turns a published CardOrder into a .vcf file.
//
// Two versions are supported:
//   - vCard 4.0 (RFC 6350): Native UTF-8, modern TYPE= params. iOS 8+,
//     Android 5+. Default.
//   - vCard 3.0 (RFC 2426): Wider Android compatibility, especially older
//     Android (9–11) and Samsung/Pixel native Contacts. Photo encoding differs.
//
// Photo embedding: we inline-embed when the photo is < 1.5 MB. For larger
// photos we emit a URL reference so the .vcf doesn't bloat.
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
  /** Optional human-readable source label appended to NOTE so the saved
   *  contact remembers where it came from (e.g. "Hannover Messe — Hall B12"). */
  sourceLabel?: string;
  /** Card locale (de|en|tr) — used to localize the card-link X-ABLabel. */
  locale?: string;
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

/** Localized X-ABLabel for the card-page URL so Apple Contacts shows a distinct
 *  "Digital Card" row instead of a second "homepage". */
const CARD_URL_LABEL: Record<string, string> = {
  de: "Digitale Karte",
  en: "Digital Card",
  tr: "Dijital Kart",
};
function cardUrlLabel(locale: string | undefined): string {
  return CARD_URL_LABEL[locale ?? "en"] ?? CARD_URL_LABEL.en;
}

// =============================================================================
// vCard 4.0 (RFC 6350) — default, iOS + modern Android
// =============================================================================

// Exported under both names — buildVCard is the legacy alias kept for backward
// compatibility with existing callers; buildVCard4 is the canonical export.
export function buildVCard(args: BuildVCardArgs): string {
  const { cardData, photoUrl, photoBytes, cardPageUrl, sourceLabel, locale } = args;
  const lines: string[] = [];
  // Apple item-grouping counter (itemN.URL + itemN.X-ABLabel) for custom labels.
  let item = 1;

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:4.0");
  lines.push(`FN:${esc(cardData.name)}`);
  lines.push(`N:${structuredName(cardData.name)}`);

  if (cardData.company) lines.push(`ORG:${esc(cardData.company)}`);
  if (cardData.title) lines.push(`TITLE:${esc(cardData.title)}`);

  if (cardData.phone) {
    // CELL is the most universal type label and what Contacts apps rank first.
    // Plain TEL value (not the tel: URI form) — iOS Contacts mis-parses
    // `VALUE=uri:tel:` and shows the literal label "VALUE" with a "tel+90…"
    // value, so we emit the bare number which every client renders correctly.
    lines.push(`TEL;TYPE=cell,voice:${digitsOnly(cardData.phone)}`);
  }
  if (cardData.whatsapp) {
    // WhatsApp as a labeled wa.me link (item-grouped) — gives Contacts a
    // tappable "WhatsApp" row (opens the WhatsApp app) WITHOUT writing the
    // number a second time as a phone entry. So when WhatsApp == phone the
    // contact shows one phone number plus a distinct WhatsApp action.
    const wa = digitsOnly(cardData.whatsapp).replace(/^\+/, "");
    const n = item++;
    lines.push(`item${n}.URL:https://wa.me/${wa}`);
    lines.push(`item${n}.X-ABLabel:WhatsApp`);
  }
  if (cardData.email) lines.push(`EMAIL;TYPE=internet:${esc(cardData.email)}`);
  if (cardData.website) lines.push(`URL:${esc(cardData.website)}`);

  if (cardData.address) {
    // ADR is structured as PO;Ext;Street;City;Region;Postal;Country. We don't
    // have a structured address from the form, so we emit the whole thing in
    // the "street" slot — Contacts apps render that fine as a single line.
    lines.push(`ADR;TYPE=work:;;${esc(cardData.address)};;;;`);
  }
  // NOTE: bio + optional source label so the saved contact remembers context
  // (e.g. "Saved via OpSolid Smart Card. Source: Hannover Messe — Hall B12").
  const noteParts: string[] = [];
  if (cardData.bio) noteParts.push(cardData.bio);
  if (sourceLabel) noteParts.push(`Source: ${sourceLabel}`);
  if (noteParts.length > 0) {
    lines.push(`NOTE:${esc(noteParts.join("\n"))}`);
  }

  // Card page link with a localized label ("Dijital Kart" / "Digital Card")
  // via Apple item-grouping, so it isn't shown as a second "homepage" next to
  // the website URL.
  {
    const n = item++;
    lines.push(`item${n}.URL:${esc(cardPageUrl)}`);
    lines.push(`item${n}.X-ABLabel:${esc(cardUrlLabel(locale))}`);
  }

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

/** vCard 4.0 — same as buildVCard, explicit named export for version-aware callers. */
export const buildVCard4 = buildVCard;

// =============================================================================
// vCard 3.0 (RFC 2426) — Android fallback
//
// Key differences from 4.0:
//   PHOTO inline  → PHOTO;TYPE=JPEG;ENCODING=BASE64:  (not ENCODING=b)
//   PHOTO URL     → PHOTO;VALUE=URL:                  (not VALUE=uri)
//   TEL TYPE      → TYPE=CELL (uppercase; avoid comma-joined types — use
//                   multiple TYPE params for strict 3.0 parsers)
//   ADR TYPE      → TYPE=WORK (uppercase)
//   EMAIL TYPE    → TYPE=INTERNET (uppercase)
//   X- lines      → plain X-FOO: (no XML namespace)
//   VERSION       → 3.0
//   CRLF          → mandatory (same as 4.0 — already handled by CRLF const)
// =============================================================================

export function buildVCard3(args: BuildVCardArgs): string {
  const { cardData, photoUrl, photoBytes, cardPageUrl, sourceLabel } = args;
  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");
  // CHARSET=UTF-8 on every text property: vCard 3.0 has no default charset, so
  // without this older Android / strict parsers decode non-ASCII (ş, ı, ö, ü)
  // as Latin-1 and mangle Turkish/German names.
  lines.push(`FN;CHARSET=UTF-8:${esc(cardData.name)}`);
  lines.push(`N;CHARSET=UTF-8:${structuredName(cardData.name)}`);

  if (cardData.company) lines.push(`ORG;CHARSET=UTF-8:${esc(cardData.company)}`);
  if (cardData.title) lines.push(`TITLE;CHARSET=UTF-8:${esc(cardData.title)}`);

  if (cardData.phone) {
    // 3.0: TYPE values must be uppercase; avoid comma-joining multiple TYPEs —
    // emit as separate TYPE params for maximum parser compatibility.
    lines.push(`TEL;TYPE=CELL;TYPE=VOICE:${digitsOnly(cardData.phone)}`);
  }
  if (cardData.whatsapp) {
    // WhatsApp pointer only — no second TEL line, so the number is never shown
    // twice when WhatsApp == phone.
    lines.push(
      `X-SOCIALPROFILE;TYPE=whatsapp:https://wa.me/${digitsOnly(cardData.whatsapp).replace(/^\+/, "")}`
    );
  }
  if (cardData.email) lines.push(`EMAIL;TYPE=INTERNET:${esc(cardData.email)}`);
  if (cardData.website) lines.push(`URL:${esc(cardData.website)}`);

  if (cardData.address) {
    lines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${esc(cardData.address)};;;;`);
  }

  const noteParts: string[] = [];
  if (cardData.bio) noteParts.push(cardData.bio);
  if (sourceLabel) noteParts.push(`Source: ${sourceLabel}`);
  if (noteParts.length > 0) {
    lines.push(`NOTE;CHARSET=UTF-8:${esc(noteParts.join("\n"))}`);
  }

  lines.push(`URL;TYPE=CARD:${esc(cardPageUrl)}`);

  if (cardData.socials) {
    const s = cardData.socials;
    if (s.linkedin)  lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${esc(s.linkedin)}`);
    if (s.instagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${esc(s.instagram)}`);
    if (s.x)         lines.push(`X-SOCIALPROFILE;TYPE=twitter:${esc(s.x)}`);
    if (s.tiktok)    lines.push(`X-SOCIALPROFILE;TYPE=tiktok:${esc(s.tiktok)}`);
    if (s.youtube)   lines.push(`X-SOCIALPROFILE;TYPE=youtube:${esc(s.youtube)}`);
    if (s.github)    lines.push(`X-SOCIALPROFILE;TYPE=github:${esc(s.github)}`);
    if (s.facebook)  lines.push(`X-SOCIALPROFILE;TYPE=facebook:${esc(s.facebook)}`);
  }

  // 3.0 photo encoding:
  //   Inline  → PHOTO;TYPE=JPEG;ENCODING=BASE64:<base64data>
  //   URL ref → PHOTO;VALUE=URL:<url>
  if (photoBytes) {
    const mediaType =
      photoBytes.mime.split("/")[1]?.toUpperCase() ?? "JPEG";
    lines.push(
      `PHOTO;TYPE=${mediaType};ENCODING=BASE64:${photoBytes.base64}`
    );
  } else if (photoUrl) {
    lines.push(`PHOTO;VALUE=URL:${esc(photoUrl)}`);
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
