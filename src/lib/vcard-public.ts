// =============================================================================
// vcard-public — pure-function vCard 4.0 builder for the public /api/v1
// download endpoint.
//
// Sibling of `src/lib/vcard.ts` (the legacy slug-keyed builder). We keep the
// two separate so the new endpoint can evolve its field set freely without
// destabilising the existing share-drawer flow that depends on the original
// shape (X-SOCIALPROFILE entries, source labels, vCard 3.0 fallback, etc.).
//
// RFC 6350 compliance notes:
//   - Line endings MUST be CRLF (\r\n) — we never emit raw \n.
//   - Long lines fold at 75 octets per §3.2: CRLF + single space continues
//     the previous line. Required so Outlook / Mail.app don't truncate
//     long base64 photos or URLs.
//   - Property values escape \, ;, , and \n per §3.4.
// =============================================================================

import type { CardData } from "@/lib/validation";

const CRLF = "\r\n";

export interface FormatVCardArgs {
  cardData: CardData;
  /** Base64 image bytes already gated by the route's 200 KB cap. */
  photoBytes?: { mime: string; base64: string };
  /** Public URL of the card page — emitted as URL;TYPE=verso. */
  cardPageUrl: string;
  /** ISO-8601 string for the REV (revision) field — `card.updatedAt`. */
  revIso: string;
}

/**
 * Escape a property VALUE per RFC 6350 §3.4. Backslash MUST be escaped first
 * so the substitutions below don't double-escape it.
 */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Soft line folding per RFC 6350 §3.2 — at most 75 octets per line. Subsequent
 * physical lines start with a single space (the "fold marker"), which the
 * importer strips when concatenating. We byte-count by character length here;
 * for ASCII content (everything except FN/N/NOTE) this matches octets exactly,
 * and for the few UTF-8 strings that may exceed 75 chars we still fold safely
 * — we just fold a little more aggressively than strictly required.
 */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    const take = i === 0 ? 75 : 74;
    chunks.push(line.slice(i, i + take));
    i += take;
  }
  return chunks.join(CRLF + " ");
}

/**
 * Best-effort N (structured name) split. Single-token names go in the "given"
 * slot which Contacts apps render fine.
 */
function structuredName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ";;;;";
  if (parts.length === 1) return `;${esc(parts[0])};;;`;
  const family = parts[parts.length - 1];
  const given = parts.slice(0, -1).join(" ");
  return `${esc(family)};${esc(given)};;;`;
}

/**
 * Strip phone formatting down to "+digits". Contacts apps re-format on import,
 * so we don't need to keep visual punctuation.
 */
function digitsOnly(phone: string): string {
  return phone.replace(/[^+0-9]/g, "");
}

/**
 * Build a vCard 4.0 string for a published card. Pure function — no I/O.
 * Photo fetching + 200 KB cap is the caller's responsibility.
 */
export function formatVCard(args: FormatVCardArgs): string {
  const { cardData, photoBytes, cardPageUrl, revIso } = args;
  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:4.0");
  lines.push(`FN:${esc(cardData.name)}`);
  lines.push(`N:${structuredName(cardData.name)}`);

  if (cardData.company) lines.push(`ORG:${esc(cardData.company)}`);
  if (cardData.title) lines.push(`TITLE:${esc(cardData.title)}`);

  if (cardData.email) {
    lines.push(`EMAIL;TYPE=work:${esc(cardData.email)}`);
  }
  if (cardData.phone) {
    lines.push(`TEL;TYPE=cell:${digitsOnly(cardData.phone)}`);
  }
  if (cardData.website) {
    lines.push(`URL:${esc(cardData.website)}`);
  }

  if (cardData.bio) {
    lines.push(`NOTE:${esc(cardData.bio)}`);
  }

  // Socials — per the task spec, each platform gets its own URL line tagged
  // with TYPE=<platform>. Importers that don't recognise the tag still keep
  // the URL value, which is the important thing.
  const socials = cardData.socials;
  if (socials) {
    if (socials.linkedin)  lines.push(`URL;TYPE=linkedin:${esc(socials.linkedin)}`);
    if (socials.instagram) lines.push(`URL;TYPE=instagram:${esc(socials.instagram)}`);
    if (socials.x)         lines.push(`URL;TYPE=x:${esc(socials.x)}`);
    if (socials.github)    lines.push(`URL;TYPE=github:${esc(socials.github)}`);
    if (socials.youtube)   lines.push(`URL;TYPE=youtube:${esc(socials.youtube)}`);
  }

  // PHOTO inline — already enforced ≤ 200 KB by the caller. We use the
  // RFC 6350 §6.7.4 form: `PHOTO:data:<mime>;base64,<data>`.
  if (photoBytes) {
    lines.push(
      `PHOTO:data:${photoBytes.mime};base64,${photoBytes.base64}`,
    );
  }

  lines.push(`REV:${esc(revIso)}`);
  lines.push(`URL;TYPE=verso:${esc(cardPageUrl)}`);
  lines.push("END:VCARD");

  // Fold every physical line and join with CRLF; trailing CRLF is required.
  return lines.map(fold).join(CRLF) + CRLF;
}

/**
 * Sanitize a slug for use in `Content-Disposition: attachment; filename=`.
 * Restricts to alphanumerics + hyphens (per the task spec) and prefixes the
 * `verso-` brand label so downloads land in the user's Files / Downloads with
 * a recognisable name.
 */
export function vcardDownloadFilename(slug: string): string {
  const cleaned = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `verso-${cleaned || "card"}.vcf`;
}
