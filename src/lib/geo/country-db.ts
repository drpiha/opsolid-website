// =============================================================================
// GeoIP country resolver — NODE RUNTIME ONLY.
//
// Reads a locally-bundled, CC0-licensed IP→country database (the @ip-location-db
// "geo-whois-asn-country" MaxMind-format .mmdb) via the pure-JS `maxmind`
// reader. Everything happens in-process: no third-party API is ever contacted,
// so no visitor IP leaves the box (GDPR-clean) and there is no runtime network
// dependency.
//
// IMPORTANT: this module imports `node:path` + `maxmind` and therefore must
// NEVER be imported from the edge middleware. It is consumed only by the
// Node-runtime route src/app/api/geo/route.ts, which the middleware reaches via
// an internal fetch (mirroring the /api/domain-resolve pattern).
//
// Shipping the .mmdb into the standalone Docker image is handled by an explicit
// COPY in the Dockerfile (Next's file tracer does not follow data files that
// aren't `require`d). Override the path with GEOIP_MMDB_PATH if it ever moves.
// =============================================================================

import path from "node:path";
import maxmind, { type Reader, type Response } from "maxmind";

const DEFAULT_MMDB_PATH = path.join(
  process.cwd(),
  "node_modules/@ip-location-db/geo-whois-asn-country-mmdb/geo-whois-asn-country.mmdb",
);

const MMDB_PATH = process.env.GEOIP_MMDB_PATH || DEFAULT_MMDB_PATH;

// Open once per process and cache the reader. The .mmdb (~7.5 MB) is read into
// memory a single time; subsequent lookups are in-memory radix-tree walks.
let readerPromise: Promise<Reader<Response>> | null = null;

function getReader(): Promise<Reader<Response>> {
  if (!readerPromise) {
    readerPromise = maxmind.open<Response>(MMDB_PATH).catch((err) => {
      // Reset so a transient failure (e.g. file not present yet during a
      // rolling deploy) can be retried on the next request instead of being
      // cached as a permanently-rejected promise.
      readerPromise = null;
      throw err;
    });
  }
  return readerPromise;
}

/**
 * Resolve an IPv4/IPv6 address to an ISO-3166 alpha-2 country code (uppercase),
 * or `null` when the address is invalid, private, or not in the database.
 * Never throws for a bad IP — only a genuine DB-open failure rejects, and the
 * caller (the /api/geo route) swallows that into `{ country: null }`.
 */
export async function countryForIp(ip: string): Promise<string | null> {
  if (!ip || !maxmind.validate(ip)) return null;
  const reader = await getReader();
  // This database stores a flat `{ country_code: "DE" }` record (not the
  // nested GeoLite2 `country.iso_code` shape), so read it directly.
  const record = reader.get(ip) as unknown as { country_code?: string } | null;
  const code = record?.country_code;
  return typeof code === "string" && code.length === 2 ? code.toUpperCase() : null;
}
