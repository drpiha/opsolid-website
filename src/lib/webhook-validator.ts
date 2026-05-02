// =============================================================================
// Webhook URL SSRF guard.
//
// We let card owners register arbitrary outbound webhook URLs on their orders
// (see /api/admin/cards/[id]/webhooks). Without validation a malicious — or
// merely curious — operator could register an internal-network URL such as
// `http://169.254.169.254/latest/meta-data/` (AWS instance metadata),
// `http://localhost:5432` (Postgres), or `http://10.0.0.1` (private RFC1918)
// and use OUR server to probe / exfiltrate from inside the trust boundary.
// That is a textbook Server-Side Request Forgery (SSRF) attack.
//
// Defence has two stages:
//
//   1. STATIC validation at registration time (POST /api/admin/cards/.../webhooks)
//      - Accepts only http: / https: URLs.
//      - Resolves the host via DNS and rejects if ANY returned address is
//        loopback, private (RFC1918), link-local (including the AWS / cloud
//        metadata range 169.254.0.0/16), or IPv6 equivalents (::1, fc00::/7,
//        fe80::/10, ::ffff:<v4>/96 mapped IPv4).
//      - "ANY returned address" is strict on purpose: a host can resolve to
//        both a public and a private IP; rejecting only when ALL records are
//        public still lets DNS rebinding succeed during dispatch.
//
//   2. RUNTIME re-check inside dispatchWebhook() before each fetch, with a
//      5-minute TTL cache keyed by URL. The cache narrows the DNS-rebinding
//      window — the attacker can flip DNS between registration and dispatch,
//      so we cannot trust the registration-time check alone — while keeping
//      hot dispatches cheap.
//
// We deliberately do NOT support a "pin to first resolved IP" approach: that
// breaks legitimate consumers behind round-robin DNS / CDN failover and adds
// complexity without closing the rebinding window better than a 5-min recheck.
//
// `ALLOW_HTTP_WEBHOOKS=1` env flag re-enables plain http:// for local dev.
// In production the default is https-only.
// =============================================================================

// Use namespace imports (`* as`) so the module compiles correctly under both
// CommonJS interop and pure ESM. `node:net` exposes its members on the
// namespace, not on a default export — `import net from "node:net"` resolves
// to undefined under some toolchain configs.
import * as dns from "node:dns";
import * as net from "node:net";

export type ValidateResult = { ok: true } | { ok: false; reason: string };

/**
 * IPv4 helpers — convert dotted-quad to a 32-bit unsigned integer so we can
 * check CIDR ranges with simple bitmask arithmetic.
 */
function ipv4ToInt(addr: string): number | null {
  const parts = addr.split(".");
  if (parts.length !== 4) return null;
  let result = 0;
  for (const part of parts) {
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    result = (result * 256) + octet;
  }
  // Use unsigned 32-bit: shift-based arithmetic risks sign overflow at high bits.
  return result >>> 0;
}

function inCidrV4(addr: string, network: string, prefix: number): boolean {
  const addrInt = ipv4ToInt(addr);
  const netInt = ipv4ToInt(network);
  if (addrInt === null || netInt === null) return false;
  if (prefix === 0) return true;
  // /32 mask via shift would overflow JS's 32-bit shift semantics; build it
  // by subtracting the host portion from 2^32.
  const mask = prefix === 32 ? 0xffffffff : (0xffffffff << (32 - prefix)) >>> 0;
  return (addrInt & mask) === (netInt & mask);
}

/**
 * Returns true if the IPv4 address is loopback / private / link-local / unspec.
 * Covers every RFC1918 + RFC6890 special-purpose range that can reach internal
 * services from the OpSolid pod.
 */
function isPrivateV4(addr: string): boolean {
  return (
    inCidrV4(addr, "10.0.0.0", 8) ||
    inCidrV4(addr, "172.16.0.0", 12) ||
    inCidrV4(addr, "192.168.0.0", 16) ||
    inCidrV4(addr, "169.254.0.0", 16) || // link-local (incl. AWS metadata)
    inCidrV4(addr, "127.0.0.0", 8) ||    // loopback
    inCidrV4(addr, "0.0.0.0", 8) ||      // "this network" / unspecified
    inCidrV4(addr, "100.64.0.0", 10) ||  // CGNAT — not Internet routable
    inCidrV4(addr, "192.0.0.0", 24) ||   // IETF protocol assignments
    inCidrV4(addr, "198.18.0.0", 15) ||  // benchmark
    inCidrV4(addr, "224.0.0.0", 4) ||    // multicast
    inCidrV4(addr, "240.0.0.0", 4)       // reserved
  );
}

/**
 * Returns true if the IPv6 address is loopback / unique-local / link-local
 * or an IPv4-mapped address pointing to a private IPv4. We normalize to lower
 * case and rely on the rendered form Node returns from dns.lookup.
 */
function isPrivateV6(addr: string): boolean {
  const a = addr.toLowerCase();

  // Loopback (::1) and unspecified (::).
  if (a === "::1" || a === "::") return true;

  // Unique-local fc00::/7 — both fc.. and fd.. high bytes match.
  if (a.startsWith("fc") || a.startsWith("fd")) return true;

  // Link-local fe80::/10. fe80..febf cover the prefix; conservative check
  // on the first three hex chars catches the practical encoding.
  if (a.startsWith("fe8") || a.startsWith("fe9") || a.startsWith("fea") || a.startsWith("feb")) {
    return true;
  }

  // IPv4-mapped ::ffff:a.b.c.d — defer to the v4 check on the embedded address.
  // Node renders these as `::ffff:10.0.0.1` (mixed) or `::ffff:0a00:0001` (hex).
  if (a.startsWith("::ffff:")) {
    const tail = addr.slice(7);
    if (tail.includes(".")) {
      return isPrivateV4(tail);
    }
    // Hex form — convert two 16-bit groups to four octets.
    const groups = tail.split(":");
    if (groups.length === 2) {
      const hi = parseInt(groups[0], 16);
      const lo = parseInt(groups[1], 16);
      if (Number.isFinite(hi) && Number.isFinite(lo)) {
        const v4 = `${(hi >> 8) & 0xff}.${hi & 0xff}.${(lo >> 8) & 0xff}.${lo & 0xff}`;
        return isPrivateV4(v4);
      }
    }
  }

  // 64:ff9b::/96 NAT64 prefix — rare but reachable; play safe.
  if (a.startsWith("64:ff9b:")) return true;

  return false;
}

function isPrivateAddress(addr: string): boolean {
  const family = net.isIP(addr);
  if (family === 4) return isPrivateV4(addr);
  if (family === 6) return isPrivateV6(addr);
  // Unknown — treat as untrusted. Should not happen for results from dns.lookup.
  return true;
}

/**
 * Validate a webhook URL against SSRF risks.
 *
 * Rejection reasons are stable string codes so callers can show localized
 * messages without parsing prose:
 *   - `invalid_url`        — URL.parse failed
 *   - `unsupported_protocol` — neither http: nor https:
 *   - `http_disallowed`    — http: rejected in production
 *   - `host_required`      — empty hostname
 *   - `dns_failure`        — lookup threw / no records
 *   - `private_ip`         — at least one resolved address is private
 *   - `literal_private_ip` — host literal IP is private
 */
export async function validateWebhookUrl(url: string): Promise<ValidateResult> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, reason: "unsupported_protocol" };
  }

  // Default to https-only in production. ALLOW_HTTP_WEBHOOKS=1 (or any truthy
  // value) re-enables plain http:// for dev / on-prem testing.
  const allowHttp = process.env.ALLOW_HTTP_WEBHOOKS === "1" ||
    process.env.NODE_ENV !== "production";
  if (parsed.protocol === "http:" && !allowHttp) {
    return { ok: false, reason: "http_disallowed" };
  }

  const host = parsed.hostname;
  if (!host) {
    return { ok: false, reason: "host_required" };
  }

  // If the host is already a literal IP, skip DNS but apply the same range
  // check directly. Strip brackets that URL.hostname leaves on IPv6 literals.
  const stripped = host.startsWith("[") && host.endsWith("]")
    ? host.slice(1, -1)
    : host;
  const literalFamily = net.isIP(stripped);
  if (literalFamily !== 0) {
    return isPrivateAddress(stripped)
      ? { ok: false, reason: "literal_private_ip" }
      : { ok: true };
  }

  // Resolve every A / AAAA record. dns.lookup with all:true mirrors how the
  // platform's getaddrinfo would feed fetch's connection setup, so we check
  // the same set of addresses fetch would dial.
  let records: Array<{ address: string; family: number }>;
  try {
    records = await dns.promises.lookup(stripped, { all: true, verbatim: true });
  } catch {
    return { ok: false, reason: "dns_failure" };
  }

  if (records.length === 0) {
    return { ok: false, reason: "dns_failure" };
  }

  // Strict: a single private record poisons the whole URL. This is intentional
  // — partial-private resolutions enable rebinding-style bypasses where the
  // attacker fronts a public A record that flips to private at dispatch.
  for (const r of records) {
    if (isPrivateAddress(r.address)) {
      return { ok: false, reason: "private_ip" };
    }
  }

  return { ok: true };
}

// -----------------------------------------------------------------------------
// 5-minute TTL cache for hot-path dispatchers. The cache caps DNS-rebinding
// exposure to 5 minutes after the first successful resolve while saving the
// repeated DNS roundtrip when a card fires many leads in close succession.
// -----------------------------------------------------------------------------
type CacheEntry = ValidateResult & { expires: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60_000;

export async function validateWebhookUrlCached(url: string): Promise<ValidateResult> {
  const now = Date.now();
  const hit = cache.get(url);
  if (hit && hit.expires > now) {
    return hit.ok ? { ok: true } : { ok: false, reason: hit.reason };
  }

  const result = await validateWebhookUrl(url);
  cache.set(url, { ...result, expires: now + CACHE_TTL_MS } as CacheEntry);

  // Soft cap on entries — webhook URL universe is tiny per deployment, but
  // belt-and-braces against accidental unbounded growth from validation
  // calls on attacker-controlled junk URLs.
  if (cache.size > 1000) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }

  return result;
}

/** Test-only: clear the cache between unit tests. */
export function __clearWebhookValidatorCache(): void {
  cache.clear();
}
