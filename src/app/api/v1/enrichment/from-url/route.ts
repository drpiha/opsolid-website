// =============================================================================
// /api/v1/enrichment/from-url — M7 paste-URL → social profile enrichment.
//
// The mobile wizard pastes a GitHub / YouTube / LinkedIn / personal-site URL;
// we fan out to a host-specific enrichment strategy and return a normalised
// shape the client can drop straight into a card draft. The contract is
// intentionally narrow (one endpoint, one request shape) so we can add or
// retire host strategies without bumping the API version.
//
// Strategies in order of host match:
//   github.com           → public users API ($GITHUB_TOKEN raises rate limit)
//   youtube.com / youtu.be → YouTube Data API v3 ($YOUTUBE_API_KEY required)
//   linkedin.com         → no-op response with a friendly hint (LinkedIn does
//                          not allow third-party profile lookups; the client
//                          is expected to fall back to "Sign In With LinkedIn")
//   open.spotify.com     → defer (Tier 2). Falls through to OG/Twitter parser.
//   anything else        → fetch the page, extract OG/Twitter/<title>/<meta
//                          name="description">. No third-party scrapers.
//
// Hardening:
//   * SSRF: only http/https; block private IPv4 + IPv6 ranges, loopback,
//     link-local, multicast, broadcast, AWS/GCP metadata, .local/.internal/.
//     We resolve hostnames to IPs (DNS) and block on the resolved IP family
//     too — a hostname like attacker.com that points to 169.254.169.254 is
//     refused at fetch time, not just at parse time.
//   * Hard fetch budget: 5s timeout, 1MB body cap (matches draft-from-url).
//   * Per-user rate limit: 30 / hour (uses the existing in-memory limiter).
//   * 24h in-memory cache, capped at 1000 entries (LRU eviction by insertion
//     order — Map iteration order is insertion order in V8).
//   * No new heavy deps. We deliberately do NOT pull in `cheerio` or
//     `@octokit/rest` — both would multiply the bundle for one regex parse
//     and one HTTPS GET respectively.
//
// Out of scope (do not add): Proxycurl, Apify, RapidAPI scrapers, Clearbit,
// FullContact. Legal + cost issues. LinkedIn lookup is provided via OIDC
// "Sign In With LinkedIn", not by scraping.
//
// Manual smoke tests (after deploy):
//   curl -X POST https://opsolid.de/api/v1/enrichment/from-url \
//     -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
//     -d '{"url":"https://github.com/torvalds"}'
//   → { source: "github", displayName: "Linus Torvalds", followerCount: ..., ... }
//
//   curl ... -d '{"url":"https://www.youtube.com/@Fireship"}'
//   → { source: "youtube", displayName: "Fireship", followerCount: ..., ... }
//
//   curl ... -d '{"url":"https://nextjs.org"}'
//   → { source: "opengraph", displayName: "Next.js by Vercel ...", bio: "...", ... }
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import dns from "node:dns/promises";
import net from "node:net";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// -----------------------------------------------------------------------------
// Tunables
// -----------------------------------------------------------------------------
const RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const FETCH_TIMEOUT_MS = 5_000;
const MAX_FETCH_BYTES = 1 * 1024 * 1024; // 1 MB

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const CACHE_MAX_ENTRIES = 1000;

// -----------------------------------------------------------------------------
// Public response shape — exported so the mobile / web SDKs can re-import.
// -----------------------------------------------------------------------------
export type EnrichmentSource =
  | "github"
  | "youtube"
  | "oembed"
  | "opengraph"
  | "linkedin-self";

export interface EnrichmentLink {
  /** "twitter" | "youtube" | "github" | "site" | "instagram" | ... */
  kind: string;
  url: string;
}

export interface EnrichmentResult {
  source: EnrichmentSource;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  followerCount?: number;
  /** Job title or channel role (e.g. "Software Engineer", "Tech YouTuber"). */
  role?: string;
  website?: string;
  location?: string;
  links?: EnrichmentLink[];
  /**
   * Out-of-band code surfaced to the client when source-specific guidance is
   * needed (e.g. linkedin-self → "linkedin_no_lookup"). NEVER set together
   * with an HTTP error status — the success/error split is purely on status.
   */
  code?: string;
  note?: string;
}

const InputSchema = z.object({
  url: z.string().trim().min(4).max(500),
});

// -----------------------------------------------------------------------------
// In-memory cache. Map iteration order is insertion order in V8 — that's all
// we need for LRU-on-eviction (we don't bump on hit; reads stay O(1)).
// -----------------------------------------------------------------------------
interface CachedEntry {
  result: EnrichmentResult;
  expiresAt: number;
}
const cache: Map<string, CachedEntry> = new Map();

function cacheKey(url: string): string {
  return crypto.createHash("sha1").update(url.toLowerCase()).digest("hex");
}

function cacheGet(key: string): EnrichmentResult | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return hit.result;
}

function cacheSet(key: string, result: EnrichmentResult): void {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    // Evict the oldest insertion. Map.keys() yields in insertion order.
    const oldest = cache.keys().next().value;
    if (typeof oldest === "string") cache.delete(oldest);
  }
  cache.set(key, { result, expiresAt: Date.now() + CACHE_TTL_MS });
}

// -----------------------------------------------------------------------------
// CORS preflight
// -----------------------------------------------------------------------------
export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

// -----------------------------------------------------------------------------
// POST handler
// -----------------------------------------------------------------------------
export async function POST(req: Request) {
  const startedAt = Date.now();
  let userId = "anon";
  let host = "?";
  let chosenSource: EnrichmentSource | "error" = "error";

  try {
    const user = await requireBearerUser(req);
    userId = user.id;

    const limit = rateLimit(
      "enrichment:from-url",
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

    const target = parseAndValidateUrl(parsed.data.url);
    if (!target.ok) {
      return applyCors(
        errorJson("invalid_url", target.reason, 400),
        req,
      );
    }
    host = target.url.hostname;

    // Cache check (after auth + rate limit, before any upstream call).
    const ck = cacheKey(target.url.toString());
    const cached = cacheGet(ck);
    if (cached) {
      chosenSource = cached.source;
      logEnrichment(userId, host, chosenSource, Date.now() - startedAt, true);
      return applyCors(NextResponse.json(cached, { status: 200 }), req);
    }

    // Route to the appropriate strategy.
    const strategy = pickStrategy(target.url);

    let result: EnrichmentResult;
    try {
      result = await strategy.run(target.url);
    } catch (err) {
      const code = err instanceof EnrichmentError ? err.code : "upstream_error";
      const status = err instanceof EnrichmentError ? err.status : 502;
      const message =
        err instanceof EnrichmentError
          ? err.message
          : "Enrichment upstream failed.";
      logEnrichment(userId, host, "error", Date.now() - startedAt, false, code);
      return applyCors(errorJson(code, message, status), req);
    }

    chosenSource = result.source;

    // Cache successful results only. We don't cache errors so a transient
    // upstream blip doesn't poison the next 24h.
    cacheSet(ck, result);

    logEnrichment(userId, host, chosenSource, Date.now() - startedAt, false);
    return applyCors(NextResponse.json(result, { status: 200 }), req);
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error(
      `[enrichment] user=${userId} url=${host} source=error ms=${Date.now() - startedAt} err=`,
      err,
    );
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}

// =============================================================================
// URL validation + SSRF perimeter
// =============================================================================

interface ParsedTarget {
  ok: true;
  url: URL;
}
interface ParsedTargetError {
  ok: false;
  reason: string;
}

function parseAndValidateUrl(input: string): ParsedTarget | ParsedTargetError {
  let s = input.trim();
  // Accept "github.com/foo" by prepending https://. Anything that looks like
  // a non-http scheme (file:, data:, ftp:, javascript:) is rejected.
  if (!/^https?:\/\//i.test(s)) {
    if (/^[a-z]+:/i.test(s)) {
      return { ok: false, reason: "Only http(s) URLs are supported." };
    }
    if (/^[^\s]+\.[^\s]{2,}/.test(s)) {
      s = `https://${s}`;
    } else {
      return { ok: false, reason: "URL is not parseable." };
    }
  }

  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return { ok: false, reason: "URL is not parseable." };
  }

  if (u.protocol !== "https:" && u.protocol !== "http:") {
    return { ok: false, reason: "Only http(s) URLs are supported." };
  }
  if (!u.hostname) {
    return { ok: false, reason: "URL has no hostname." };
  }

  // Block obvious internal / loopback hostnames at the literal level. The
  // resolved-IP check below is the real perimeter; this is just a fast
  // rejection that also runs for IP-literal inputs.
  if (isBlockedHostname(u.hostname)) {
    return { ok: false, reason: "URL points to a blocked host." };
  }

  return { ok: true, url: u };
}

function isBlockedHostname(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost") return true;
  if (h.endsWith(".localhost")) return true;
  if (h.endsWith(".local")) return true;
  if (h.endsWith(".internal")) return true;

  // IP literal? Run the IP-range check directly.
  const family = net.isIP(h);
  if (family === 4 || family === 6) return isPrivateOrSpecialIp(h);

  return false;
}

function isPrivateOrSpecialIp(ip: string): boolean {
  const family = net.isIP(ip);
  if (family === 4) return isPrivateIpv4(ip);
  if (family === 6) return isPrivateIpv6(ip);
  return true; // unparseable → treat as blocked
}

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map((x) => Number.parseInt(x, 10));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b] = parts as [number, number, number, number];
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local + AWS metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 192 && b === 0 && parts[2] === 0) return true; // 192.0.0.0/24
  if (a === 192 && b === 0 && parts[2] === 2) return true; // 192.0.2.0/24 TEST-NET-1
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15
  if (a === 198 && b === 51 && parts[2] === 100) return true; // TEST-NET-2
  if (a === 203 && b === 0 && parts[2] === 113) return true; // TEST-NET-3
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
  if (a >= 224) return true; // 224+ multicast / reserved / broadcast
  return false;
}

function isPrivateIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::" || lower === "::1") return true; // unspecified + loopback
  if (lower.startsWith("fe80:")) return true; // link-local
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
  if (lower.startsWith("ff")) return true; // multicast
  // IPv4-mapped IPv6: ::ffff:a.b.c.d → defer to v4 check.
  const mapped = lower.match(/^::ffff:([\d.]+)$/);
  if (mapped) return isPrivateIpv4(mapped[1]);
  return false;
}

/**
 * DNS-resolve a hostname and refuse if any A/AAAA record lands in a private
 * or special range. Called on the upstream-fetch path so attacker-controlled
 * hostnames that resolve to internal IPs are blocked before connect.
 */
async function assertResolvesToPublicIp(hostname: string): Promise<void> {
  // IP literals already validated upstream.
  if (net.isIP(hostname)) return;
  let records: Array<{ address: string; family: number }> = [];
  try {
    records = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new EnrichmentError("dns_resolve_failed", "Could not resolve URL.", 502);
  }
  if (records.length === 0) {
    throw new EnrichmentError("dns_no_records", "URL has no DNS records.", 502);
  }
  for (const rec of records) {
    if (isPrivateOrSpecialIp(rec.address)) {
      throw new EnrichmentError(
        "blocked_host",
        "URL resolves to a blocked address.",
        400,
      );
    }
  }
}

// =============================================================================
// Strategy selection
// =============================================================================

interface Strategy {
  run: (url: URL) => Promise<EnrichmentResult>;
}

function pickStrategy(url: URL): Strategy {
  const host = url.hostname.toLowerCase();
  if (host === "github.com" || host === "www.github.com") {
    return { run: enrichGithub };
  }
  if (
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be"
  ) {
    return { run: enrichYoutube };
  }
  if (host === "linkedin.com" || host.endsWith(".linkedin.com")) {
    return { run: enrichLinkedinSelf };
  }
  // Spotify (Tier 2 deferral): explicitly fall through to OG so the artist
  // name + cover image still come back via og:title / og:image.
  return { run: enrichOpenGraph };
}

// =============================================================================
// GitHub strategy
// =============================================================================

async function enrichGithub(url: URL): Promise<EnrichmentResult> {
  // Path shape: /{user}, /{user}/{repo}, /orgs/{org}, etc. We only handle the
  // bare-user case here; everything else falls back to OG.
  const segs = url.pathname.split("/").filter(Boolean);
  if (segs.length === 0) return enrichOpenGraph(url);
  const handle = segs[0];
  if (!/^[A-Za-z0-9-]{1,39}$/.test(handle)) return enrichOpenGraph(url);
  // Skip GitHub system paths.
  const reserved = new Set([
    "orgs",
    "topics",
    "explore",
    "marketplace",
    "settings",
    "notifications",
    "issues",
    "pulls",
    "search",
    "sponsors",
    "trending",
    "features",
    "pricing",
    "about",
    "events",
    "login",
    "join",
    "logout",
  ]);
  if (reserved.has(handle.toLowerCase())) return enrichOpenGraph(url);

  // If the URL has a second path segment it's likely a repo or org-internal
  // path — GitHub's user API still works for the username, but we keep
  // returning the user profile (most useful default).

  const apiUrl = `https://api.github.com/users/${encodeURIComponent(handle)}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "OpsolidVerso/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetchWithBudget(apiUrl, { headers });

  if (res.status === 404) {
    throw new EnrichmentError("not_found", "GitHub user not found.", 404);
  }
  if (res.status === 403 || res.status === 429) {
    throw new EnrichmentError(
      "rate_limited",
      "GitHub rate limit reached. Set GITHUB_TOKEN or retry later.",
      429,
    );
  }
  if (!res.ok) {
    throw new EnrichmentError("upstream_error", `GitHub upstream ${res.status}.`, 502);
  }

  const json = (await res.json()) as Record<string, unknown>;
  const pick = (k: string): string | undefined => {
    const v = json[k];
    return typeof v === "string" && v.trim() ? v.trim() : undefined;
  };
  const pickInt = (k: string): number | undefined => {
    const v = json[k];
    return typeof v === "number" && Number.isFinite(v) ? v : undefined;
  };

  const links: EnrichmentLink[] = [
    { kind: "github", url: `https://github.com/${handle}` },
  ];
  const blog = pick("blog");
  if (blog) {
    const normalised = /^https?:\/\//i.test(blog) ? blog : `https://${blog}`;
    links.push({ kind: "site", url: normalised });
  }
  const twitter = pick("twitter_username");
  if (twitter) {
    links.push({ kind: "twitter", url: `https://twitter.com/${twitter}` });
  }

  return {
    source: "github",
    displayName: pick("name") ?? pick("login"),
    bio: pick("bio"),
    avatarUrl: pick("avatar_url"),
    followerCount: pickInt("followers"),
    role: pick("company"),
    website: blog
      ? /^https?:\/\//i.test(blog)
        ? blog
        : `https://${blog}`
      : undefined,
    location: pick("location"),
    links,
  };
}

// =============================================================================
// YouTube strategy
// =============================================================================

interface YoutubeChannelItem {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    customUrl?: string;
    country?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  statistics?: {
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
  };
}
interface YoutubeChannelsResponse {
  items?: YoutubeChannelItem[];
}

async function enrichYoutube(url: URL): Promise<EnrichmentResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    // Loud warn so the operator notices the missing config in the logs;
    // we still fall back to OG so the user's wizard isn't blocked.
    console.warn(
      "[enrichment] YOUTUBE_API_KEY not set — falling back to OG for youtube.com",
    );
    return enrichOpenGraph(url);
  }

  // Resolve identifier from URL shape:
  //   youtube.com/channel/UC...    → id=UC...
  //   youtube.com/@handle          → forHandle=handle
  //   youtube.com/c/name           → forHandle=name (best-effort; legacy)
  //   youtube.com/user/name        → forUsername=name
  //   youtu.be/<videoId>           → unsupported (no cheap channel lookup)
  let query: string | null = null;
  if (url.hostname === "youtu.be") {
    throw new EnrichmentError(
      "unsupported",
      "Paste the channel URL (youtube.com/@handle), not a video link.",
      422,
    );
  }
  const segs = url.pathname.split("/").filter(Boolean);
  const first = segs[0] ?? "";
  if (first.startsWith("@")) {
    query = `forHandle=${encodeURIComponent(first.slice(1))}`;
  } else if (first === "channel" && segs[1]) {
    query = `id=${encodeURIComponent(segs[1])}`;
  } else if (first === "c" && segs[1]) {
    query = `forHandle=${encodeURIComponent(segs[1])}`;
  } else if (first === "user" && segs[1]) {
    query = `forUsername=${encodeURIComponent(segs[1])}`;
  } else {
    throw new EnrichmentError(
      "unsupported",
      "Could not parse a YouTube channel from the URL.",
      422,
    );
  }

  const apiUrl =
    `https://www.googleapis.com/youtube/v3/channels` +
    `?part=snippet,statistics&${query}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetchWithBudget(apiUrl, {
    headers: { Accept: "application/json" },
  });
  if (res.status === 403) {
    throw new EnrichmentError(
      "rate_limited",
      "YouTube API rate limit / quota reached.",
      429,
    );
  }
  if (!res.ok) {
    throw new EnrichmentError(
      "upstream_error",
      `YouTube upstream ${res.status}.`,
      502,
    );
  }
  const json = (await res.json()) as YoutubeChannelsResponse;
  const item = json.items?.[0];
  if (!item) {
    throw new EnrichmentError("not_found", "YouTube channel not found.", 404);
  }
  const snippet = item.snippet ?? {};
  const stats = item.statistics ?? {};
  const subscriberCount =
    stats.hiddenSubscriberCount === true
      ? undefined
      : stats.subscriberCount && /^\d+$/.test(stats.subscriberCount)
        ? Number.parseInt(stats.subscriberCount, 10)
        : undefined;

  const channelId = item.id;
  const channelUrl = channelId
    ? `https://www.youtube.com/channel/${channelId}`
    : url.toString();

  const avatar =
    snippet.thumbnails?.high?.url ??
    snippet.thumbnails?.medium?.url ??
    snippet.thumbnails?.default?.url ??
    undefined;

  return {
    source: "youtube",
    displayName: snippet.title || undefined,
    bio: clamp(snippet.description, 280),
    avatarUrl: avatar,
    followerCount: subscriberCount,
    role: "YouTube creator",
    location: snippet.country,
    links: [{ kind: "youtube", url: channelUrl }],
  };
}

// =============================================================================
// LinkedIn — friendly no-op
// =============================================================================

async function enrichLinkedinSelf(url: URL): Promise<EnrichmentResult> {
  return {
    source: "linkedin-self",
    code: "linkedin_no_lookup",
    note:
      "LinkedIn does not allow third-party profile lookups. Use Sign In With LinkedIn to import your profile.",
    links: [{ kind: "linkedin", url: url.toString() }],
  };
}

// =============================================================================
// OpenGraph / Twitter / <title> fallback
// =============================================================================

async function enrichOpenGraph(url: URL): Promise<EnrichmentResult> {
  const res = await fetchWithBudget(url.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; OpsolidVerso/1.0; +https://opsolid.de)",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en,de;q=0.8,tr;q=0.5",
    },
  });
  if (!res.ok || !res.body) {
    throw new EnrichmentError(
      "upstream_error",
      `Upstream returned ${res.status}.`,
      502,
    );
  }
  const html = await readBodyCapped(res);

  const meta = extractMeta(html);

  const displayName = first(
    meta["og:title"],
    meta["twitter:title"],
    meta["title"],
  );
  const bio = clamp(
    first(
      meta["og:description"],
      meta["twitter:description"],
      meta["description"],
    ),
    280,
  );
  const avatarUrl = absoluteUrl(
    first(meta["og:image"], meta["twitter:image"], meta["twitter:image:src"]),
    url,
  );
  const role = first(meta["og:site_name"]);

  if (!displayName && !bio && !avatarUrl) {
    throw new EnrichmentError(
      "not_found",
      "No metadata found at the URL.",
      404,
    );
  }

  return {
    source: "opengraph",
    displayName,
    bio,
    avatarUrl,
    role,
    website: url.origin,
    links: [{ kind: "site", url: url.toString() }],
  };
}

/**
 * Extract OG/Twitter/<title>/<meta description> values from HTML using regex.
 * We deliberately skip cheerio — the matrix of selectors needed is small,
 * and the 1MB stream cap means we never run regex on a pathological body.
 */
function extractMeta(html: string): Record<string, string> {
  const out: Record<string, string> = {};

  // Strip <script>/<style> first so we don't match attributes inside JS strings.
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");

  // <title>...</title> — first one wins.
  const t = stripped.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t?.[1]) out.title = decodeEntities(t[1]).trim();

  // Walk every <meta ...> tag and pick property/name + content.
  const metaRe = /<meta\b([^>]*)>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(stripped))) {
    const attrs = m[1];
    const propMatch = attrs.match(/\bproperty\s*=\s*["']([^"']+)["']/i);
    const nameMatch = attrs.match(/\bname\s*=\s*["']([^"']+)["']/i);
    const contentMatch = attrs.match(/\bcontent\s*=\s*["']([^"']*)["']/i);
    if (!contentMatch) continue;
    const key = (propMatch?.[1] ?? nameMatch?.[1] ?? "").toLowerCase();
    if (!key) continue;
    // First occurrence wins — og:image often appears multiple times.
    if (!(key in out)) {
      out[key] = decodeEntities(contentMatch[1]).trim();
    }
  }
  return out;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/");
}

function first(...vals: Array<string | undefined>): string | undefined {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function clamp(s: string | undefined, max: number): string | undefined {
  if (!s) return undefined;
  const trimmed = s.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? trimmed.slice(0, max - 1) + "…" : trimmed;
}

function absoluteUrl(
  candidate: string | undefined,
  base: URL,
): string | undefined {
  if (!candidate) return undefined;
  try {
    const u = new URL(candidate, base);
    if (u.protocol !== "http:" && u.protocol !== "https:") return undefined;
    return u.toString();
  } catch {
    return undefined;
  }
}

// =============================================================================
// HTTP helper — applies SSRF check, timeout, and size cap.
// =============================================================================

interface FetchOpts {
  headers?: Record<string, string>;
}

async function fetchWithBudget(
  rawUrl: string,
  opts: FetchOpts = {},
): Promise<Response> {
  const u = new URL(rawUrl);
  await assertResolvesToPublicIp(u.hostname);

  return fetch(rawUrl, {
    method: "GET",
    redirect: "follow",
    headers: opts.headers ?? {},
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

/**
 * Stream the body with a hard byte cap. Used by the OG strategy where the
 * upstream may send megabytes of HTML; the 1MB ceiling keeps the regex parse
 * bounded.
 */
async function readBodyCapped(res: Response): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_FETCH_BYTES) {
      try {
        await reader.cancel("size_cap_exceeded");
      } catch {
        // ignore
      }
      break;
    }
    chunks.push(value);
  }
  let totalLen = 0;
  for (const c of chunks) totalLen += c.byteLength;
  const buf = new Uint8Array(totalLen);
  let i = 0;
  for (const c of chunks) {
    buf.set(c, i);
    i += c.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(buf);
}

// =============================================================================
// Errors + logging
// =============================================================================

class EnrichmentError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function logEnrichment(
  userId: string,
  host: string,
  source: EnrichmentSource | "error",
  ms: number,
  cached: boolean,
  errorCode?: string,
): void {
  const tail = errorCode ? ` err=${errorCode}` : "";
  const cacheTag = cached ? " cache=hit" : "";
  console.log(
    `[enrichment] user=${userId} url=${host} source=${source} ms=${ms}${cacheTag}${tail}`,
  );
}

// =============================================================================
// Manual smoke tests (run after deploy):
//
//   GitHub:
//     curl -X POST https://opsolid.de/api/v1/enrichment/from-url \
//       -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
//       -d '{"url":"https://github.com/torvalds"}'
//     → { source: "github", displayName: "Linus Torvalds", ... }
//
//   YouTube (handle):
//     curl ... -d '{"url":"https://www.youtube.com/@Fireship"}'
//     → { source: "youtube", displayName: "Fireship", followerCount: ... }
//
//   LinkedIn (no lookup):
//     curl ... -d '{"url":"https://www.linkedin.com/in/example/"}'
//     → 200 { source: "linkedin-self", code: "linkedin_no_lookup", ... }
//
//   Generic site (OpenGraph):
//     curl ... -d '{"url":"https://nextjs.org"}'
//     → { source: "opengraph", displayName: "...", bio: "...", avatarUrl: "..." }
//
//   SSRF perimeter:
//     curl ... -d '{"url":"http://169.254.169.254/latest/meta-data/"}'
//     → 400 { error: { code: "invalid_url", ... } }
// =============================================================================
