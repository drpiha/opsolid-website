import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOCALES,
  DEFAULT_LOCALE,
  isLocale,
  localeForCountry,
  type Locale,
} from "@/lib/i18n";
import { getRetiredRedirectTarget } from "@/lib/redirects";

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
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Read the visitor's country from an upstream geo header, if any proxy/CDN in
 * front sets one. NOTE: the production VPS currently runs bare Traefik with no
 * GeoIP plugin, so none of these are usually present and detection falls back
 * to the in-app /api/geo lookup (lookupCountryFromIp). If Cloudflare
 * (cf-ipcountry) or a Traefik GeoIP middleware is added later it is picked up
 * here automatically and takes precedence over the in-app lookup — no other
 * change required.
 */
function readCountry(req: NextRequest): string | null {
  // Vercel edge (when deployed on Vercel)
  const vercel = req.headers.get("x-vercel-ip-country");
  if (vercel) return vercel.toUpperCase();
  // Cloudflare proxy (if the domain is ever orange-clouded)
  const cf = req.headers.get("cf-ipcountry");
  if (cf && cf !== "XX") return cf.toUpperCase();
  // Generic / custom proxy headers (Traefik GeoIP plugin, nginx)
  const generic =
    req.headers.get("x-country-code") || req.headers.get("x-geo-country");
  if (generic) return generic.toUpperCase();
  return null;
}

/**
 * Locale resolution policy (2026-07 — geo is resolved in-app):
 *   1. Explicit user choice (our versioned cookie) always wins.
 *   2. An upstream geo header, if any proxy/CDN provides one (Cloudflare,
 *      Vercel, or a Traefik GeoIP plugin), is authoritative.
 *   3. Otherwise resolve the country ourselves from the client IP via the
 *      Node-runtime /api/geo route — this is what makes detection work on the
 *      bare-Traefik VPS, where NO edge sets a country header.
 *   4. Country genuinely unknown → English. We deliberately do NOT consult
 *      Accept-Language: language follows COUNTRY, so a Turkish browser locale
 *      never forces /tr outside Turkey (the whole point of this change).
 *
 * TR → tr, DACH → de, every other country → en (see localeForCountry).
 * Returns the resolved locale plus how it was reached, so a redirect can attach
 * an opt-in x-opsolid-geo debug header (see maybeAttachGeoDebug).
 */
type LocaleSource = "cookie" | "geo-header" | "geo-ip" | "default";

interface LocaleResolution {
  locale: Locale;
  country: string | null;
  ip: string | null;
  source: LocaleSource;
}

async function resolveLocale(req: NextRequest): Promise<LocaleResolution> {
  // 1. Explicit user choice.
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
  if (isLocale(cookieValue)) {
    return { locale: cookieValue, country: null, ip: null, source: "cookie" };
  }

  // 2. Upstream geo header (authoritative when a proxy/CDN provides it).
  const headerCountry = readCountry(req);
  if (headerCountry) {
    return {
      locale: localeForCountry(headerCountry) ?? DEFAULT_LOCALE,
      country: headerCountry,
      ip: null,
      source: "geo-header",
    };
  }

  // 3. Bare Traefik sets no geo header → resolve the country in-app from IP.
  const ip = clientIpFromRequest(req);
  const country = ip ? await lookupCountryFromIp(ip, req) : null;
  if (country) {
    return {
      locale: localeForCountry(country) ?? DEFAULT_LOCALE,
      country,
      ip,
      source: "geo-ip",
    };
  }

  // 4. Country genuinely unknown → English default.
  return { locale: DEFAULT_LOCALE, country: null, ip, source: "default" };
}

/**
 * Opt-in diagnostics: on `?geodebug=1` reflect how the locale was resolved back
 * in a response header. Country/own-IP are not sensitive and this is gated, so
 * it stays invisible to normal traffic while making prod detection debuggable.
 */
function maybeAttachGeoDebug(
  req: NextRequest,
  res: NextResponse,
  r: LocaleResolution,
) {
  if (req.nextUrl.searchParams.get("geodebug") !== "1") return;
  res.headers.set(
    "x-opsolid-geo",
    `source=${r.source};country=${r.country ?? "-"};ip=${r.ip ?? "-"};locale=${r.locale}`,
  );
}

/** Client IP from proxy headers (Traefik populates both on the VPS). */
function clientIpFromRequest(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = req.headers.get("x-real-ip");
  return xri ? xri.trim() : null;
}

/**
 * Resolve an IP → country via our own /api/geo route (the edge middleware can't
 * read the on-disk GeoIP DB directly).
 *
 * We call the route over LOOPBACK, not the public origin. On the single-VPS
 * Docker setup a container fetching its own public hostname
 * (`https://opsolid.de/...`) can't hairpin back through Traefik, so that fetch
 * silently failed and EVERY visitor fell through to English — the bug this
 * fixes. The app process always answers on 127.0.0.1:<PORT> (PORT=3000 in the
 * container). Fail-open: any error/timeout resolves to null so navigation is
 * never blocked on a geo miss.
 */
async function lookupCountryFromIp(
  ip: string,
  req: NextRequest,
): Promise<string | null> {
  try {
    const port = req.nextUrl.port || process.env.PORT || "3000";
    const url = `http://127.0.0.1:${port}/api/geo?ip=${encodeURIComponent(ip)}`;
    // Hard cap the lookup so a slow/hung geo call can never stall the first
    // page load — on timeout the fetch throws, we swallow it, and detection
    // falls through to the English default.
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const body = (await res.json().catch(() => null)) as
      | { country?: string | null }
      | null;
    const country = body?.country;
    return typeof country === "string" && country.length === 2
      ? country.toUpperCase()
      : null;
  } catch {
    return null;
  }
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

  // Retired-route 301 redirects. Checked after the locale split so both
  // /solutions and /en/solutions resolve to the right target with the locale
  // prefix preserved. detectLocale() is awaited lazily (and at most once per
  // request) so its geo lookup only runs on the locale-less paths that need it.
  const retiredTarget = getRetiredRedirectTarget(pathWithoutLocale);
  if (retiredTarget !== null) {
    let localeForRedirect: Locale;
    let resolution: LocaleResolution | null = null;
    if (hasLocale) {
      localeForRedirect = firstSegment as Locale;
    } else {
      resolution = await resolveLocale(req);
      localeForRedirect = resolution.locale;
    }
    const url = req.nextUrl.clone();
    url.pathname =
      retiredTarget === "/" ? `/${localeForRedirect}` : `/${localeForRedirect}${retiredTarget}`;
    const response = NextResponse.redirect(url, 301);
    response.cookies.set(COOKIE_NAME, localeForRedirect, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    clearLegacyLocaleCookies(response);
    if (resolution) maybeAttachGeoDebug(req, response, resolution);
    return response;
  }

  if (!hasLocale) {
    const resolution = await resolveLocale(req);
    const locale = resolution.locale;
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

    const response = NextResponse.redirect(url, 307);
    // Only PERSIST the locale when we actually resolved it (cookie / geo header
    // / geo-ip). If detection was unconfident (source "default", e.g. the geo
    // lookup missed), redirect to English but DON'T pin it — otherwise a single
    // failed lookup would stick the visitor on /en for a year. The next visit
    // re-detects. Explicit switcher choices persist via LocaleContext.
    if (resolution.source !== "default") {
      response.cookies.set(COOKIE_NAME, locale, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }
    clearLegacyLocaleCookies(response);
    maybeAttachGeoDebug(req, response, resolution);
    return response;
  }

  // Forward pathname as header so server components can read it
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname + search);
  requestHeaders.set("x-locale", firstSegment);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

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
