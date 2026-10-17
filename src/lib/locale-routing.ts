/**
 * Locale resolution for locale-less URLs (`/`, `/ki-beratung`, …).
 *
 * Owner decision (2026-07, #34/#35, confirmed for v4): language follows COUNTRY,
 * not the browser. A Turkish browser in Germany lands on /de.
 *
 *   1. Explicit choice: our versioned cookie.
 *   2. An upstream geo header (Vercel, Cloudflare, Traefik GeoIP, nginx), if any.
 *   3. The in-app /api/geo lookup from the client IP (over loopback, fail-open).
 *   4. Country unknown → German (ROUTING_DEFAULT_LOCALE).
 *
 * TR → tr, DACH → de, every other country → en (`localeForCountry`).
 * Accept-Language is never consulted.
 *
 * Pure module (no `next/server`) so `scripts/tests/redirects.test.mts` can run it.
 */
import { ROUTING_DEFAULT_LOCALE, isLocale, localeForCountry, type Locale } from "@/lib/i18n";

export type LocaleSource = "cookie" | "geo-header" | "geo-ip" | "default";

export interface LocaleResolution {
  locale: Locale;
  country: string | null;
  ip: string | null;
  source: LocaleSource;
}

export interface LocaleInputs {
  /** Value of the versioned locale cookie, if present. */
  cookie: string | null | undefined;
  /** Case-insensitive request header reader. */
  header: (name: string) => string | null;
  /** IP → ISO country via the in-app lookup; must resolve to null on any failure. */
  lookupCountry: (ip: string) => Promise<string | null>;
}

/** ISO 3166-1 alpha-2 only; Cloudflare's XX (unknown) and T1 (Tor) are not countries. */
function normalizeCountry(value: string | null): string | null {
  if (!value) return null;
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === "XX" || code === "T1") return null;
  return code;
}

/** Country from an upstream geo header, if any proxy/CDN in front sets one. */
export function readCountry(header: LocaleInputs["header"]): string | null {
  return (
    normalizeCountry(header("x-vercel-ip-country")) ||
    normalizeCountry(header("cf-ipcountry")) ||
    normalizeCountry(header("x-country-code")) ||
    normalizeCountry(header("x-geo-country"))
  );
}

/** Client IP from proxy headers (Traefik populates both on the VPS). */
export function clientIp(header: LocaleInputs["header"]): string | null {
  const xff = header("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = header("x-real-ip");
  return xri ? xri.trim() : null;
}

export async function resolveLocale(input: LocaleInputs): Promise<LocaleResolution> {
  if (isLocale(input.cookie)) {
    return { locale: input.cookie, country: null, ip: null, source: "cookie" };
  }

  const headerCountry = readCountry(input.header);
  if (headerCountry) {
    return {
      locale: localeForCountry(headerCountry) ?? ROUTING_DEFAULT_LOCALE,
      country: headerCountry,
      ip: null,
      source: "geo-header",
    };
  }

  const ip = clientIp(input.header);
  const country = ip ? await input.lookupCountry(ip).catch(() => null) : null;
  if (country) {
    return {
      locale: localeForCountry(country) ?? ROUTING_DEFAULT_LOCALE,
      country,
      ip,
      source: "geo-ip",
    };
  }

  return { locale: ROUTING_DEFAULT_LOCALE, country: null, ip, source: "default" };
}

/**
 * IP → country via the in-app `/api/geo` route. The middleware calls it over loopback (see #35);
 * the fetch is capped by `timeoutMs` and every failure (timeout, network, bad JSON, non-200,
 * malformed code) resolves to null, so a geo miss never blocks navigation and lands on `de`.
 */
export async function lookupCountryViaApi(
  url: string,
  timeoutMs: number,
  fetchImpl: (input: string, init: { signal: AbortSignal }) => Promise<Response> = (input, init) => fetch(input, init),
): Promise<string | null> {
  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    const body = (await res.json().catch(() => null)) as { country?: string | null } | null;
    return normalizeCountry(typeof body?.country === "string" ? body.country : null);
  } catch {
    return null;
  }
}
