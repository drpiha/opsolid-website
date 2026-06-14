// =============================================================================
// /api/v1/cards/draft-from-url
//
// M1 — Frictionless creation. Body: { url: string }.
// The mobile client pastes a LinkedIn / personal site / company URL; we fetch
// the page server-side (so the user never ships a CORS error or a private
// IP redirect to their phone), strip HTML, and ship the first 4000 characters
// to Claude Haiku for structured extraction.
//
// Required env vars:
//   ANTHROPIC_API_KEY — Anthropic Console key. https://console.anthropic.com.
// When unset we return 503 `{ error: "ai_not_configured" }` so the wizard
// can degrade gracefully (button shows a "Coming soon" hint).
//
// Auth: bearer-only.
// Rate limit: 10 / hour / user.
//
// Implementation notes:
//  * 5-second fetch timeout + 1 MB response cap stop a malicious URL from
//    blocking the route's worker thread.
//  * SSRF perimeter: before connecting we DNS-resolve the target host and
//    refuse any name/literal that lands in a private, loopback, link-local
//    (incl. 169.254.169.254 cloud-metadata) or special range — see
//    `src/lib/net/ssrf.ts`, shared with the enrichment route. Redirects still
//    use `redirect: "follow"`; the bearer-auth + 10/hr budget bounds the
//    residual redirect-to-private risk.
//  * No SDK dependency: we call Anthropic's `/v1/messages` REST endpoint
//    directly with `fetch`. Adding `@anthropic-ai/sdk` would be 1.5 MB of
//    extra runtime for one POST call — not worth it.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { checkPublicHost } from "@/lib/net/ssrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const MAX_FETCH_BYTES = 1 * 1024 * 1024; // 1 MB
const FETCH_TIMEOUT_MS = 5_000;
const ANTHROPIC_PROMPT_CHAR_BUDGET = 4_000;

const InputSchema = z.object({
  url: z
    .string()
    .trim()
    .min(4)
    .max(500),
});

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    const limit = rateLimit(
      "cards:draft-from-url",
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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return applyCors(
        errorJson(
          "ai_not_configured",
          "URL-import is not enabled on this deployment.",
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

    // Normalize the URL — accept "linkedin.com/in/foo" by prepending https://.
    const target = normalizeUrl(parsed.data.url);
    if (!target) {
      return applyCors(
        errorJson("invalid_url", "URL is not a valid http(s) address.", 400),
        req,
      );
    }

    // Fetch the page with a hard size + time budget.
    let pageText: string;
    try {
      pageText = await fetchAndStrip(target);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "fetch_failed";
      console.warn("[v1/cards/draft-from-url] fetch failed:", msg);
      return applyCors(
        errorJson(
          "fetch_failed",
          "Could not reach the URL within 5 seconds.",
          502,
        ),
        req,
      );
    }

    if (!pageText) {
      return applyCors(
        errorJson("empty_page", "Page returned no text content.", 422),
        req,
      );
    }

    const trimmed = pageText.slice(0, ANTHROPIC_PROMPT_CHAR_BUDGET);

    let extracted: ExtractedFields;
    try {
      extracted = await callAnthropicHaiku(apiKey, target, trimmed);
    } catch (err) {
      console.error("[v1/cards/draft-from-url] Anthropic call failed:", err);
      return applyCors(
        errorJson("ai_upstream_error", "AI extraction failed.", 502),
        req,
      );
    }

    return applyCors(NextResponse.json(extracted, { status: 200 }), req);
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/cards/draft-from-url] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}

// ---------- helpers ----------

function normalizeUrl(input: string): string | null {
  let s = input.trim();
  if (!/^https?:\/\//i.test(s)) {
    if (/^[^\s]+\.[^\s]{2,}/.test(s)) s = `https://${s}`;
    else return null;
  }
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * Fetch a URL with a 5s timeout + 1MB body cap, then strip HTML to a plain-
 * text approximation. We don't pull in `cheerio` for this — a lightweight
 * regex strip is good enough for the LLM context we then feed to Haiku.
 */
async function fetchAndStrip(url: string): Promise<string> {
  // SSRF perimeter: reject hosts that resolve to private/special ranges
  // (cloud-metadata, loopback, RFC-1918, link-local) before we connect.
  const blocked = await checkPublicHost(new URL(url).hostname);
  if (blocked) {
    throw new Error(blocked);
  }

  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      // Plenty of LinkedIn / corporate sites gate non-browser UAs. Send a
      // realistic UA + accept-language so we look like a normal preview
      // bot. This is the same posture our OG-image renderer uses.
      "User-Agent":
        "Mozilla/5.0 (compatible; OpsolidVerso/1.0; +https://opsolid.de)",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en,de;q=0.8,tr;q=0.5",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!res.ok || !res.body) {
    throw new Error(`upstream_status_${res.status}`);
  }

  // Stream-read with a hard size cap so a misbehaving URL can't fill memory.
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_FETCH_BYTES) {
      // Cancel the body and bail.
      try {
        await reader.cancel("size_cap_exceeded");
      } catch {
        /* ignore cancel errors */
      }
      break;
    }
    chunks.push(value);
  }
  const buf = concatChunks(chunks);
  // Default to UTF-8; ignore decoder errors (LinkedIn occasionally serves
  // mixed-encoding chunks). A few mojibake characters won't hurt the LLM.
  const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);

  return stripHtml(html);
}

function concatChunks(chunks: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const c of chunks) total += c.byteLength;
  const out = new Uint8Array(total);
  let i = 0;
  for (const c of chunks) {
    out.set(c, i);
    i += c.byteLength;
  }
  return out;
}

function stripHtml(html: string): string {
  // Drop scripts, styles, noscript blocks entirely — they're either noise
  // or massive minified JS that would consume the LLM budget.
  const s = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  // Pull out OG/meta description first — these often contain the most
  // signal-dense summary on a corporate page.
  const ogTitleMatch = s.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
  );
  const ogDescMatch = s.match(
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
  );
  const titleMatch = s.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = s.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  );
  const meta = [
    titleMatch?.[1],
    ogTitleMatch?.[1],
    descMatch?.[1],
    ogDescMatch?.[1],
  ]
    .filter(Boolean)
    .join("\n");

  // Strip remaining tags + collapse whitespace.
  const text = s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  // Front-load meta so the LLM sees high-signal lines even when we truncate
  // to 4000 chars.
  return meta ? `${meta}\n\n${text}` : text;
}

type ExtractedFields = {
  name: string | null;
  title: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  bio: string | null;
};

async function callAnthropicHaiku(
  apiKey: string,
  url: string,
  pageText: string,
): Promise<ExtractedFields> {
  // Claude 3.5 Haiku is the cheap-and-fast tier — perfect for this single
  // structured-extraction call. We keep max_tokens tight because the entire
  // valid response is a small JSON object.
  const sys =
    'Extract the person represented on this page as JSON: { name, title, company, email, phone, website, bio }. Return ONLY the JSON. If a field is missing, return null. The bio should be ≤140 characters.';

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-latest",
      max_tokens: 400,
      system: sys,
      messages: [
        {
          role: "user",
          content: `URL: ${url}\n\n${pageText}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`anthropic_${res.status}_${detail.slice(0, 200)}`);
  }

  type AnthropicMessage = {
    content?: Array<{ type?: string; text?: string }>;
  };
  const json = (await res.json()) as AnthropicMessage;
  const text =
    json.content?.find((c) => c.type === "text")?.text?.trim() ??
    "";

  return parseAnthropicJson(text);
}

function parseAnthropicJson(text: string): ExtractedFields {
  const empty: ExtractedFields = {
    name: null,
    title: null,
    company: null,
    email: null,
    phone: null,
    website: null,
    bio: null,
  };
  if (!text) return empty;

  // Tolerate "```json ... ```" wrappers that Haiku sometimes emits despite
  // the system prompt.
  let payload = text;
  const fence = payload.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) payload = fence[1];

  // Find the first {...} block — the model occasionally emits a one-line
  // preface even when told not to.
  const start = payload.indexOf("{");
  const end = payload.lastIndexOf("}");
  if (start < 0 || end <= start) return empty;
  const slice = payload.slice(start, end + 1);

  let parsed: unknown;
  try {
    parsed = JSON.parse(slice);
  } catch {
    return empty;
  }
  if (!parsed || typeof parsed !== "object") return empty;
  const obj = parsed as Record<string, unknown>;

  const pick = (key: string): string | null => {
    const v = obj[key];
    if (typeof v !== "string") return null;
    const trimmed = v.trim();
    if (!trimmed || trimmed.toLowerCase() === "null") return null;
    return trimmed.slice(0, 500);
  };

  return {
    name: pick("name"),
    title: pick("title"),
    company: pick("company"),
    email: pick("email"),
    phone: pick("phone"),
    website: pick("website"),
    bio: pick("bio")?.slice(0, 280) ?? null,
  };
}
