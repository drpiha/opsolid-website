import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOCALES,
  PUBLIC_LOCALES,
  ROUTING_DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "@/lib/i18n";
import { lookupCountryViaApi, resolveLocale, type LocaleResolution } from "@/lib/locale-routing";
import { getRetiredRedirectTarget } from "@/lib/redirects";
import { isV4Path } from "@/lib/v4";

/** Origin of a Sentry DSN baked in at build time ("" when unset or malformed). */
function sentryOrigin(dsn: string | undefined): string {
  if (!dsn) return "";
  try {
    return new URL(dsn).origin;
  } catch {
    return "";
  }
}

/**
 * Enforced CSP for the v4 marketing documents. The production string (no DSN)
 * is the policy that was tested in a browser on every marketing template with
 * 0 violations; the hero video, its posters and fonts are same-origin files.
 * App surfaces keep the report-only policy from next.config.mjs. `next dev`
 * also needs 'unsafe-eval' (webpack eval source maps); a Sentry DSN adds its
 * ingest origin. No nonces: inline scripts stay allowed until the Next upgrade.
 */
const SENTRY_ORIGIN = sentryOrigin(process.env.NEXT_PUBLIC_SENTRY_DSN);
const V4_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${SENTRY_ORIGIN ? ` ${SENTRY_ORIGIN}` : ""}`,
  "media-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

/** Cheap IPv4/IPv6 shape check (edge-safe, no node:net). */
const IP_SHAPE = /^[0-9A-Fa-f:.]{2,45}$/;

function voiceIsEnabled(): boolean {
  const v = process.env.VOICE_AGENT_ENABLED;
  if (!v) return false;
  const t = v.trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes" || t === "on";
}

// Versioned cookie name. Each time the detection POLICY changes we bump this so
// a stale AUTO-detected value can't pin returning visitors to the old result.
// History:
//   • NEXT_LOCALE       — original logic (Turkish browser tag → TR everywhere).
//   • OPSOLID_LOCALE     — 2026-05 geo policy, but no geo header was ever set in
//                          prod, so it kept auto-saving the Accept-Language guess
//                          (e.g. OPSOLID_LOCALE=tr for a Turkish browser in
//                          Berlin) and pinning that visitor to TR.
//   • OPSOLID_LOCALE_V2  — 2026-07: country resolved in-app, but the internal
//                          lookup hit its own public origin and silently failed
//                          on the VPS, so it auto-saved the English fallback
//                          (OPSOLID_LOCALE_V2=en) and pinned everyone to EN.
//   • OPSOLID_LOCALE_V3  — 2026-07: lookup fixed (loopback). Bump once more to
//                          clear those stale =en pins; and we no longer persist
//                          the cookie when detection was unconfident (see below).
// Every older name is swept on each response (clearLegacyLocaleCookies).
const COOKIE_NAME = "OPSOLID_LOCALE_V3";
const LEGACY_COOKIE_NAMES = ["NEXT_LOCALE", "OPSOLID_LOCALE", "OPSOLID_LOCALE_V2"];

/**
 * Locale resolution for locale-less URLs (`/`, `/ki-beratung`, …), see
 * `src/lib/locale-routing.ts`: cookie → upstream geo header → in-app /api/geo
 * lookup → German. Language follows COUNTRY (TR → tr, DACH → de, else → en);
 * Accept-Language is never consulted. The redirect is always a 307 (never
 * cached as permanent), `/de`, `/en`, `/tr` never redirect, detection never
 * writes a cookie (only an explicit language switch does), and a locale-less
 * retired URL gets a stable 301 to /de that does not depend on the request.
 */

/**
 * Resolve an IP → country via our own /api/geo route (the edge middleware can't
 * read the on-disk GeoIP DB directly).
 *
 * We call the route over LOOPBACK, not the public origin. On the single-VPS
 * Docker setup a container fetching its own public hostname
 * (`https://opsolid.de/...`) can't hairpin back through Traefik, so that fetch
 * silently failed and EVERY visitor fell through to the default (#35). The app
 * process always answers on 127.0.0.1:<PORT> (PORT=3000 in the container).
 * Fail-open: any error/timeout resolves to null so navigation is never blocked
 * on a geo miss.
 */
async function lookupCountryFromIp(ip: string, req: NextRequest): Promise<string | null> {
  const port = req.nextUrl.port || process.env.PORT || "3000";
  // Hard cap so a slow or hung lookup can never stall the first page load.
  return lookupCountryViaApi(`http://127.0.0.1:${port}/api/geo?ip=${encodeURIComponent(ip)}`, 2500);
}

/**
 * Opt-in diagnostics: on `?geodebug=1` reflect how the locale was resolved back
 * in a response header. Country and own IP are not sensitive and this is gated,
 * so it stays invisible to normal traffic. The IP comes from X-Forwarded-For,
 * so anything that is not shaped like an address is reported as "invalid"
 * instead of echoing client text.
 */
function maybeAttachGeoDebug(req: NextRequest, res: NextResponse, r: LocaleResolution) {
  if (req.nextUrl.searchParams.get("geodebug") !== "1") return;
  const ip = r.ip ? (IP_SHAPE.test(r.ip) ? r.ip : "invalid") : "-";
  res.headers.set(
    "x-opsolid-geo",
    `source=${r.source};country=${r.country ?? "-"};ip=${ip};locale=${r.locale}`,
  );
}

/** Delete every legacy locale cookie so none can override the current one. */
function clearLegacyLocaleCookies(res: NextResponse) {
  for (const name of LEGACY_COOKIE_NAMES) {
    // Don't clobber a value this same response is deliberately setting.
    if (res.cookies.get(name)) continue;
    res.cookies.set(name, "", { path: "/", maxAge: 0, sameSite: "lax" });
  }
}

// Subdomain routing for the Smart Card product:
//   • card.opsolid.de/<slug> → rewritten to /c/<slug> (public Smart Card)
//   • go.opsolid.de/<code>   → rewritten to /l/<code> (short-link gateway,
//                              records ScanEvent and 307s to /c/<slug>)
// Bare host (no path) bounces to the main site so neither subdomain ever
// renders the marketing homepage.
const CARD_HOST = "card.opsolid.de";
const SHORTLINK_HOST = "go.opsolid.de";

// Phase 6 — third-party hosts (custom domains) that don't match any of our
// own subdomains hit the custom-domain resolver. Anything in KNOWN_HOSTS
// falls through to existing locale logic; everything else is treated as a
// custom-domain candidate and resolved via /api/domain-resolve.
//
// NOTE: This works in dev (via local hosts file or matching Host header).
// Production routing requires a Traefik HostRegexp catch-all router that is
// not yet deployed; see plan §A "Custom Domain" — UNRESOLVED ops blocker.
const KNOWN_HOSTS = new Set<string>([
  CARD_HOST,
  SHORTLINK_HOST,
  "opsolid.de",
  "www.opsolid.de",
]);

const STATIC_FILE_RE = /\.[a-z0-9]+$/i;

/**
 * Local dev hosts — any localhost or 127.0.0.1 on any port. Next picks an
 * alternate port automatically when 3000 is in use, so hard-coding port
 * numbers in KNOWN_HOSTS is a known cause of "Smart Card not configured"
 * appearing on the dev marketing site.
 */
function isLocalDev(host: string): boolean {
  if (!host) return false;
  if (host === "localhost" || host.startsWith("localhost:")) return true;
  if (host === "127.0.0.1" || host.startsWith("127.0.0.1:")) return true;
  if (host === "0.0.0.0" || host.startsWith("0.0.0.0:")) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const host = (req.headers.get("host") || "").toLowerCase();

  // Pages only answer GET/HEAD. The app has no Server Actions and no page-level
  // POST handler, so refusing other methods here keeps request bodies away
  // from the Next 14 action/RSC decoders (unbounded multipart parse, RSC DoS
  // advisories). /api/* (incl. /api/voice/*) keeps its own method handling.
  if (req.method !== "GET" && req.method !== "HEAD" && !pathname.startsWith("/api/")) {
    return new NextResponse(null, { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  // -- Voice Agent master kill switch ---------------------------------------
  // Gate /api/voice/* and /voice/* when VOICE_AGENT_ENABLED is falsy.
  // Exceptions: webhooks (must keep receiving Retell events) and diagnostics
  // (used to debug why the flag is off). Runs before locale/domain logic.
  //
  // After the gate decision, BOTH /api/voice/* and /voice/* must short-circuit
  // and never fall through to locale logic. Voice surfaces are locale-agnostic
  // (the customer dashboard pages render their own language directly from KB
  // content / agent config, not from a /:locale prefix). Without this early
  // return, the unprefixed-locale branch below would 307 the request to
  // /en/voice/[slug]/... or /en/api/voice/... — neither exists as a Next
  // route, so the user sees 404.
  if (pathname.startsWith("/api/voice") || pathname.startsWith("/voice")) {
    if (!voiceIsEnabled()) {
      const isWebhook = pathname.startsWith("/api/voice/webhooks/");
      const isDiagnostics = pathname === "/api/voice/admin/diagnostics";
      if (!isWebhook && !isDiagnostics) {
        if (pathname.startsWith("/api/voice")) {
          return NextResponse.json(
            { error: "Voice Agent is disabled", reason: "feature_disabled" },
            { status: 503 },
          );
        }
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    // Voice dashboard tenant token: lift `?token=…` off the URL into a
    // httpOnly cookie. Keeps the secret out of browser history, Referer
    // headers, and our own access logs (gap-report finding G9). The Layout
    // reads it via `cookies()` instead of `searchParams` (which Next.js no
    // longer passes to layouts).
    if (pathname.startsWith("/voice/")) {
      const incomingToken = req.nextUrl.searchParams.get("token");
      if (incomingToken) {
        const cleanUrl = new URL(pathname, req.nextUrl);
        req.nextUrl.searchParams.forEach((value, key) => {
          if (key !== "token") cleanUrl.searchParams.set(key, value);
        });
        const res = NextResponse.redirect(cleanUrl);
        res.cookies.set("voice_token", incomingToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          // path "/" so the cookie is also sent to /api/voice/* routes —
          // form submits from /voice/[slug]/agents/new etc. need the API
          // to read the same cookie via requireTenantToken.
          path: "/",
          maxAge: 60 * 60 * 24, // 1 day; tenant re-shares dashboard link as needed
        });
        return res;
      }
    }
    return NextResponse.next();
  }
  // -------------------------------------------------------------------------

  // -- Phase 6: custom-domain resolver --------------------------------------
  // Run BEFORE locale detection so customer hosts never get redirected
  // into /<locale>/… and never hit the retired-route table.
  if (host && !isLocalDev(host) && !KNOWN_HOSTS.has(host)) {
    // Skip framework / static / API paths — these must hit Next directly so
    // /api/domain-resolve itself keeps working when called via fetch below.
    if (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      STATIC_FILE_RE.test(pathname)
    ) {
      return NextResponse.next();
    }

    try {
      const resolveUrl = `${req.nextUrl.origin}/api/domain-resolve/${encodeURIComponent(host)}`;
      const lookup = await fetch(resolveUrl, { next: { revalidate: 300 } });
      if (lookup.ok) {
        const body = (await lookup.json().catch(() => null)) as
          | { slug?: string }
          | null;
        const slug = body?.slug;
        if (slug && typeof slug === "string") {
          const url = req.nextUrl.clone();
          url.pathname = `/c/${slug}${pathname === "/" ? "" : pathname}`;
          // Preserve query string verbatim (search already on cloned URL).
          return NextResponse.rewrite(url);
        }
        // 200 but no slug → treat as miss.
        const url = req.nextUrl.clone();
        url.pathname = "/c/404";
        url.search = "";
        return NextResponse.rewrite(url);
      }
      // Non-200 (typically 404) → branded miss page.
      const url = req.nextUrl.clone();
      url.pathname = "/c/404";
      url.search = "";
      return NextResponse.rewrite(url);
    } catch {
      // Fail open: if the resolver is unreachable (e.g. dev rebuild), let
      // the request continue so localhost:3000 traffic that arrives with an
      // unfamiliar Host header doesn't get blackholed.
      return NextResponse.next();
    }
    // Unreachable; the branches above all return.
  }

  if (host === CARD_HOST || host === SHORTLINK_HOST) {
    if (pathname === "/" || pathname === "") {
      return NextResponse.redirect(new URL("https://opsolid.de/"), 307);
    }
    const url = req.nextUrl.clone();
    url.pathname = host === SHORTLINK_HOST ? `/l${pathname}` : `/c${pathname}`;
    return NextResponse.rewrite(url);
  }
  // ------------------------------------------------------------------------

  // Check if pathname already starts with a valid locale
  const firstSegment = pathname.split("/")[1];
  const hasLocale = isLocale(firstSegment);

  const pathWithoutLocale = hasLocale
    ? pathname.slice(firstSegment.length + 1) || "/"
    : pathname;
  // es/it/fr/ar still exist for app and card surfaces, but the marketing pages
  // are only written in de/en/tr.
  const isPartialLocale = hasLocale && !PUBLIC_LOCALES.includes(firstSegment as Locale);

  // Retired-route 301 redirects. Checked after the locale split so both
  // /solutions and /en/solutions resolve to the right target with the locale
  // prefix preserved (a partial locale goes straight to /en, every target is a
  // marketing page). A locale-less retired URL always lands on the default
  // locale: a permanent redirect must not depend on request headers.
  const retiredTarget = getRetiredRedirectTarget(pathWithoutLocale);
  if (retiredTarget !== null) {
    const localeForRedirect: Locale = !hasLocale
      ? ROUTING_DEFAULT_LOCALE
      : isPartialLocale && isV4Path(retiredTarget)
        ? "en"
        : (firstSegment as Locale);
    const url = req.nextUrl.clone();
    url.pathname =
      retiredTarget === "/" ? `/${localeForRedirect}` : `/${localeForRedirect}${retiredTarget}`;
    const response = NextResponse.redirect(url, 301);
    clearLegacyLocaleCookies(response);
    return response;
  }

  if (!hasLocale) {
    // Root and other locale-less URLs: 307 (never cached as permanent) to the
    // resolved locale. Nothing is persisted here; only an explicit language
    // switch sets the cookie (LocaleContext.setLocale).
    const resolution = await resolveLocale({
      cookie: req.cookies.get(COOKIE_NAME)?.value,
      header: (name) => req.headers.get(name),
      lookupCountry: (ip) => lookupCountryFromIp(ip, req),
    });
    const { locale } = resolution;
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    const response = NextResponse.redirect(url, 307);
    // The answer depends on the cookie and on the client's country (IP or geo header), so no shared cache.
    response.headers.set("Vary", "Cookie");
    response.headers.set("Cache-Control", "private, no-store");
    maybeAttachGeoDebug(req, response, resolution);
    clearLegacyLocaleCookies(response);
    return response;
  }

  // Marketing pages under a partial locale (/es, /ar/agents, …) would render
  // the English copy with lang="es" / dir="rtl": send them to the /en page.
  // Card surfaces (/c/*) never reach this (excluded by the matcher).
  if (isPartialLocale && isV4Path(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = pathWithoutLocale === "/" ? "/en" : `/en${pathWithoutLocale}`;
    const response = NextResponse.redirect(url, 301);
    clearLegacyLocaleCookies(response);
    return response;
  }

  // Forward pathname as header so server components can read it
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname + search);
  requestHeaders.set("x-locale", firstSegment);
  // Next 14 reads a nonce from an inbound CSP header; a client must never be
  // able to supply one.
  requestHeaders.delete("content-security-policy");
  requestHeaders.delete("content-security-policy-report-only");

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (isV4Path(pathname)) response.headers.set("Content-Security-Policy", V4_CSP);

  // NOTE: we deliberately do NOT persist the locale here. The cookie is written
  // only on a confident geo redirect (above) or an explicit switcher choice
  // (LocaleContext.setLocale). Auto-saving whatever /:locale the visitor happens
  // to be viewing is exactly what let a broken-geo /en visit pin everyone to
  // English — so being on a prefixed URL no longer writes the cookie, and a
  // bare "/" visit always re-detects. Legacy cookies are still swept so stale
  // pins from older logic disappear on the very next page load.
  clearLegacyLocaleCookies(response);

  return response;
}

export const config = {
  // Skip: /api, /_next, static files, sitemap/robots, /c/ and /l/ (public
  // card + short-link surfaces are locale-agnostic), /admin/*, /dev/*.
  //
  // /dev/* is a development-only namespace (gated by NODE_ENV inside each
  // route) and does not need locale resolution. Skipping the middleware
  // also prevents dev routes from hitting the custom-domain resolver when
  // the dev server happens to run on a port that isn't in KNOWN_HOSTS
  // (e.g. port 3001 when 3000 is already taken — the Phase 7.5 thumbnail
  // script picks a free port dynamically).
  //
  // /api/voice/* is listed explicitly so the VOICE_AGENT_ENABLED gate runs
  // at the edge even though other /api/* paths are excluded from locale logic.
  matcher: [
    // Exclude opengraph-image / twitter-image (Next 14 file-based metadata
    // routes that live at /opengraph-image and must not be locale-redirected;
    // social crawlers fetch them by exact URL).
    "/((?!api|_next|.*\\..*|sitemap\\.xml|robots\\.txt|opengraph-image|twitter-image|c/|l/|admin|dev/).*)",
    "/api/voice/:path*",
  ],
};

export { LOCALES };
