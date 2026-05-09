// =============================================================================
// /api/v1/cards/draft-from-image
//
// M1 — Frictionless creation. Body: { imageBase64: string }.
// The mobile client captures a paper business card via expo-image-picker's
// camera mode, resizes/compresses client-side (kept off the wire), and POSTs
// the base64 payload here. We forward to Google Cloud Vision's
// `documentTextDetection` REST endpoint, then heuristically parse the OCR
// output into { name?, title?, company?, email?, phone?, website? }.
//
// Required env vars:
//   GOOGLE_CLOUD_VISION_API_KEY — Google Cloud API key with Vision API enabled
//                                 and (recommended) restricted to this server's
//                                 outbound IP. Region: EU multi-region for GDPR.
// When unset we return 503 `{ error: "ocr_not_configured" }` so the mobile
// wizard can show a friendly "Coming soon" state without crashing.
//
// Auth: bearer-only.
// Rate limit: 10 / hour / user.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

// Cap the inbound base64 payload at ~6 MB encoded (≈4.5 MB raw). Mobile is
// expected to resize/compress before posting; this is a safety belt against
// a misbehaving client filling our memory.
const MAX_BASE64_BYTES = 6 * 1024 * 1024;

const InputSchema = z.object({
  imageBase64: z
    .string()
    .min(64, "imageBase64 too short")
    .max(MAX_BASE64_BYTES, "imageBase64 too large"),
});

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "cards:draft-from-image",
      req,
      user,
      RATE_MAX,
      RATE_WINDOW_MS,
    );
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
    if (!apiKey) {
      return applyCors(
        errorJson(
          "ocr_not_configured",
          "OCR is not enabled on this deployment.",
          503,
        ),
        req,
      );
    }

    const body = await readJsonBody(req);
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return applyCors(
        errorJson(
          "invalid_payload",
          parsed.error.issues[0]?.message ?? "Invalid payload.",
          400,
        ),
        req,
      );
    }

    // Strip a possible data-URL prefix the client may have included.
    let b64 = parsed.data.imageBase64;
    const comma = b64.indexOf(",");
    if (b64.startsWith("data:") && comma > 0) {
      b64 = b64.slice(comma + 1);
    }

    let visionRes: Response;
    try {
      visionRes = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requests: [
              {
                image: { content: b64 },
                features: [
                  { type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 },
                ],
                imageContext: {
                  // Hint EU + EN/DE/TR market — Vision still auto-detects but
                  // ranking improves when the candidate set is constrained.
                  languageHints: ["en", "de", "tr"],
                },
              },
            ],
          }),
          // Generous Vision timeout — 12s. The mobile client shows a spinner
          // and we'd rather wait than fail a near-complete request.
          signal: AbortSignal.timeout(12_000),
        },
      );
    } catch (err) {
      console.error("[v1/cards/draft-from-image] Vision call failed:", err);
      return applyCors(
        errorJson("ocr_upstream_error", "OCR provider unavailable.", 502),
        req,
      );
    }

    if (!visionRes.ok) {
      const detail = await visionRes.text().catch(() => "");
      console.error(
        "[v1/cards/draft-from-image] Vision non-2xx:",
        visionRes.status,
        detail.slice(0, 400),
      );
      return applyCors(
        errorJson(
          "ocr_upstream_error",
          `OCR provider returned ${visionRes.status}.`,
          502,
        ),
        req,
      );
    }

    type VisionResponse = {
      responses?: Array<{
        fullTextAnnotation?: { text?: string };
        textAnnotations?: Array<{ description?: string }>;
        error?: { code?: number; message?: string };
      }>;
    };
    const json = (await visionRes.json()) as VisionResponse;
    const r0 = json.responses?.[0];
    if (r0?.error?.message) {
      console.error(
        "[v1/cards/draft-from-image] Vision returned error:",
        r0.error.message,
      );
      return applyCors(
        errorJson("ocr_upstream_error", "OCR provider rejected request.", 502),
        req,
      );
    }
    const rawText =
      r0?.fullTextAnnotation?.text ??
      r0?.textAnnotations?.[0]?.description ??
      "";

    const fields = parseBusinessCardText(rawText);

    return applyCors(
      NextResponse.json({ ...fields, raw_ocr_text: rawText }, { status: 200 }),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/cards/draft-from-image] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}

// ---------------------------------------------------------------------------
// Heuristic parser — turns OCR text into structured fields.
//
// Rules (in this order, most-specific first):
//  1. email — first /\S+@\S+\.\S+/ on any line.
//  2. phone — regex over the canonical international + digit/punct alphabet.
//             We don't pull in libphonenumber here (not currently a project
//             dep) — a tolerant regex is good enough for owner-side review.
//  3. website — first token that looks like a URL (host + TLD), excluding
//               the email's host and pure phone strings.
//  4. name — first non-email/phone/URL line that is reasonably title-cased.
//  5. title — second short line that looks like a job title (heuristic: 2-6
//             words, alpha-dominant, no digits other than roman numerals).
//  6. company — second short line that looks like a company name (the
//               remaining "first non-name line" once name+title are picked).
//
// All fields are optional in the response. The mobile wizard renders them
// pre-filled and the user reviews + edits before publishing — so a mis-
// classified line is recoverable in seconds.
// ---------------------------------------------------------------------------

function parseBusinessCardText(text: string): {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
} {
  if (!text) return {};

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. email
  const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  let email: string | undefined;
  for (const l of lines) {
    const m = l.match(emailRe);
    if (m) {
      email = m[0];
      break;
    }
  }

  // 2. phone — very tolerant: + or starts with digit, allows space, dash,
  // dot, slash, parens; min 7 digits to dodge zip codes.
  const phoneRe =
    /(?:\+?\d[\d\s().\-/]{6,}\d)/;
  let phone: string | undefined;
  for (const l of lines) {
    if (email && l.includes(email)) continue;
    const m = l.match(phoneRe);
    if (m) {
      const digits = m[0].replace(/\D/g, "");
      if (digits.length >= 7 && digits.length <= 16) {
        phone = m[0].trim();
        break;
      }
    }
  }

  // 3. website
  const urlRe =
    /\b(?:https?:\/\/)?(?:www\.)?([A-Z0-9-]+(?:\.[A-Z0-9-]+)+)(?:\/\S*)?/i;
  let website: string | undefined;
  for (const l of lines) {
    if (email && l.includes(email)) continue;
    const m = l.match(urlRe);
    if (m) {
      const host = m[1];
      // Skip if this is just the email's domain re-detected.
      if (email && host && email.toLowerCase().endsWith(`@${host.toLowerCase()}`)) {
        continue;
      }
      // Skip if entire matched substring is a phone-formatted run.
      if (phone && phone.includes(m[0])) continue;
      website = m[0];
      break;
    }
  }

  // 4. name + 5. title + 6. company — derived from the residual lines.
  // Strip lines we've already classified or that are pure address noise.
  const isContactLine = (l: string): boolean => {
    if (email && l.includes(email)) return true;
    if (phone && l.includes(phone)) return true;
    if (website && l.includes(website)) return true;
    if (/^\+?\d[\d\s().\-/]{6,}/.test(l)) return true;
    if (urlRe.test(l) && /\.\w{2,}/.test(l)) return true;
    return false;
  };

  const candidates = lines.filter((l) => !isContactLine(l));

  let name: string | undefined;
  let title: string | undefined;
  let company: string | undefined;

  // Name guess: first line with ≥2 alpha-dominant tokens, mostly title-cased.
  for (const l of candidates) {
    if (looksLikeName(l)) {
      name = l;
      break;
    }
  }

  // Title and company guesses: walk remaining short lines.
  for (const l of candidates) {
    if (l === name) continue;
    if (l.length > 60) continue; // too long for either; probably address
    if (!title && looksLikeTitle(l)) {
      title = l;
      continue;
    }
    if (!company && looksLikeCompany(l)) {
      company = l;
      continue;
    }
    if (title && company) break;
  }

  return {
    ...(name ? { name } : {}),
    ...(title ? { title } : {}),
    ...(company ? { company } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(website ? { website } : {}),
  };
}

function looksLikeName(line: string): boolean {
  const tokens = line.split(/\s+/).filter(Boolean);
  if (tokens.length < 2 || tokens.length > 5) return false;
  // No digits in names.
  if (/\d/.test(line)) return false;
  // Most tokens should start with an uppercase letter.
  const upper = tokens.filter((t) => /^[A-ZÄÖÜŞĞİÇÖ]/.test(t)).length;
  return upper / tokens.length >= 0.6;
}

function looksLikeTitle(line: string): boolean {
  const tokens = line.split(/\s+/).filter(Boolean);
  if (tokens.length < 1 || tokens.length > 8) return false;
  // Job titles are mostly letters with optional `&`, `/`, `,`.
  if (!/^[\w\s&/,.\-äöüÄÖÜşŞğĞİıÇç]+$/i.test(line)) return false;
  // Avoid capturing all-caps short company names by requiring at least one
  // lowercase letter (Co-CEO is fine, ACME is not).
  if (!/[a-zäöüşğıç]/.test(line)) return false;
  return true;
}

function looksLikeCompany(line: string): boolean {
  // After name + title are claimed, this is the catch-all for one more
  // sensible line. Reject lines that look like postal addresses.
  if (/\d{4,}/.test(line)) return false; // postal code in line
  if (/strasse|straße|street|str\.|rd\.|avenue|ave\.|sokak|cad\./i.test(line))
    return false;
  if (line.length < 2) return false;
  return true;
}
