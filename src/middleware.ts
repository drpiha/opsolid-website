import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import { getRetiredRedirectTarget } from "@/lib/redirects";

function voiceIsEnabled(): boolean {
  const v = process.env.VOICE_AGENT_ENABLED;
  if (!v) return false;
  const t = v.trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes" || t === "on";
}

const COOKIE_NAME = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function detectLocale(req: NextRequest): Locale {
  // 1. Cookie preference (explicit user choice wins)
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
  if (isLocale(cookieValue)) return cookieValue;

  // 2. Vercel geo header — production-only (free on Hobby tier)
  const country = req.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country === "DE" || country === "AT" || country === "CH") return "de";
  if (country === "TR") return "tr";

  // 3. Accept-Language header fallback (order by quality score)
  const accept = req.headers.get("accept-language") || "";
  const preferred = accept
    .split(",")
    .map((part) => {
      const [tag, q = "q=1"] = part.trim().split(";");
      const quality = parseFloat(q.replace("q=", "")) || 1;
      return { tag: tag.toLowerCase().split("-")[0], quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of preferred) {
    if (tag === "de") return "de";
    if (tag === "tr") return "tr";
    if (tag === "es") return "es";
    if (tag === "it") return "it";
    if (tag === "fr") return "fr";
    if (tag === "ar") return "ar";
    if (tag === "en") return "en";
  }

  return DEFAULT_LOCALE;
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
  "localhost",
  "localhost:3000",
]);

const STATIC_FILE_RE = /\.[a-z0-9]+$/i;

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
  if (host && !KNOWN_HOSTS.has(host)) {
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

  // Retired-route 301 redirects. Checked before / after locale split so
  // both /solutions and /en/solutions resolve to the right target with
  // the locale prefix preserved.
  const localeForRedirect = hasLocale ? (firstSegment as Locale) : detectLocale(req);
  const pathWithoutLocale = hasLocale
    ? pathname.slice(firstSegment.length + 1) || "/"
    : pathname;
  const retiredTarget = getRetiredRedirectTarget(pathWithoutLocale);
  if (retiredTarget !== null) {
    const url = req.nextUrl.clone();
    url.pathname =
      retiredTarget === "/" ? `/${localeForRedirect}` : `/${localeForRedirect}${retiredTarget}`;
    const response = NextResponse.redirect(url, 301);
    response.cookies.set(COOKIE_NAME, localeForRedirect, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return response;
  }

  if (!hasLocale) {
    const locale = detectLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

    const response = NextResponse.redirect(url, 307);
    response.cookies.set(COOKIE_NAME, locale, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return response;
  }

  // Forward pathname as header so server components can read it
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname + search);
  requestHeaders.set("x-locale", firstSegment);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Keep cookie in sync so the user's last viewed locale becomes default
  if (req.cookies.get(COOKIE_NAME)?.value !== firstSegment) {
    response.cookies.set(COOKIE_NAME, firstSegment, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

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
