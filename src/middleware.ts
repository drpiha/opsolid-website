import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import { getRetiredRedirectTarget } from "@/lib/redirects";

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

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const host = (req.headers.get("host") || "").toLowerCase();

  if (host === CARD_HOST || host === SHORTLINK_HOST) {
    if (pathname === "/" || pathname === "") {
      return NextResponse.redirect(new URL("https://opsolid.de/"), 307);
    }
    const url = req.nextUrl.clone();
    url.pathname = host === SHORTLINK_HOST ? `/l${pathname}` : `/c${pathname}`;
    return NextResponse.rewrite(url);
  }

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
  // card + short-link surfaces are locale-agnostic), /admin/*.
  matcher: [
    "/((?!api|_next|.*\\..*|sitemap\\.xml|robots\\.txt|c/|l/|admin).*)",
  ],
};

export { LOCALES };
