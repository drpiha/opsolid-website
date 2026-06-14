// =============================================================================
// SSRF perimeter helpers
//
// Server-side fetches of user-supplied URLs (card draft-from-url, enrichment,
// OG previews) must never be tricked into reaching cloud-metadata endpoints
// (169.254.169.254), loopback, or RFC-1918 / link-local hosts. These helpers
// reject blocked hostnames up front and DNS-resolve everything else, refusing
// if any A/AAAA record lands in a private or special range.
//
// Mirrors the perimeter originally inlined in
// `src/app/api/v1/enrichment/from-url/route.ts` so other routes can share one
// audited implementation instead of re-deriving the IP ranges.
// =============================================================================

import net from "node:net";
import dns from "node:dns/promises";

export function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map((x) => Number.parseInt(x, 10));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b] = parts as [number, number, number, number];
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local + cloud metadata
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

export function isPrivateIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::" || lower === "::1") return true; // unspecified + loopback
  if (lower.startsWith("fe80:")) return true; // link-local
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
  if (lower.startsWith("ff")) return true; // multicast
  const mapped = lower.match(/^::ffff:([\d.]+)$/); // IPv4-mapped IPv6
  if (mapped) return isPrivateIpv4(mapped[1]);
  return false;
}

export function isPrivateOrSpecialIp(ip: string): boolean {
  const family = net.isIP(ip);
  if (family === 4) return isPrivateIpv4(ip);
  if (family === 6) return isPrivateIpv6(ip);
  return true; // unparseable → treat as blocked
}

export function isBlockedHostname(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost") return true;
  if (h.endsWith(".localhost")) return true;
  if (h.endsWith(".local")) return true;
  if (h.endsWith(".internal")) return true;
  const family = net.isIP(h);
  if (family === 4 || family === 6) return isPrivateOrSpecialIp(h);
  return false;
}

/**
 * Resolve `hostname` and return a short machine reason string if it must be
 * blocked, or `null` if it is safe to fetch. IP literals are checked directly;
 * everything else is DNS-resolved and every A/AAAA record is range-checked.
 */
export async function checkPublicHost(hostname: string): Promise<string | null> {
  if (isBlockedHostname(hostname)) return "blocked_host";
  if (net.isIP(hostname)) return null; // literal already validated above
  let records: Array<{ address: string; family: number }> = [];
  try {
    records = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch {
    return "dns_resolve_failed";
  }
  if (records.length === 0) return "dns_no_records";
  for (const rec of records) {
    if (isPrivateOrSpecialIp(rec.address)) return "blocked_host";
  }
  return null;
}
