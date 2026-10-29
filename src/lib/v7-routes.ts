/**
 * v7 marketing routes (relaunch 2026-10-29). One key per page.
 *
 * - ROUTE: the folder under src/app/[locale] that renders the page (German slugs).
 * - SLUG: the public, localized path per locale. Middleware rewrites a public EN/TR slug to its ROUTE
 *   and 301s a path that belongs to another locale (/en/ki-beratung → /en/ai-automation-consulting).
 * - The German home is served at "/" (200, WebSite markup at the domain root); "/de" 308s to "/".
 *
 * Every link to a marketing page goes through href(); never hand-write "/de/..." paths.
 * Slugs are part of the public URL contract: change one only together with a 301 in src/lib/redirects.ts.
 */
import { SITE_CONFIG } from "@/lib/constants";

export type L3 = "de" | "en" | "tr";
export const L3_LOCALES: readonly L3[] = ["de", "en", "tr"];

export type PageKey =
  | "home"
  | "beratung"
  | "check"
  | "prozess"
  | "m365"
  | "agenten"
  | "anwendungen"
  | "schulungen"
  | "kompetenz"
  | "copilot"
  | "trainer"
  | "opso"
  | "projekte"
  | "ueber"
  | "kontakt"
  | "blog"
  | "impressum"
  | "privacy";

/** Route folder under src/app/[locale] ("" = the locale home). */
export const ROUTE: Record<PageKey, string> = {
  home: "",
  beratung: "/ki-beratung",
  check: "/ki-beratung/ki-check",
  prozess: "/ki-beratung/prozessautomatisierung",
  m365: "/ki-beratung/microsoft-365",
  agenten: "/ki-beratung/ki-agenten",
  anwendungen: "/ki-beratung/anwendungsfaelle",
  schulungen: "/ki-schulungen",
  kompetenz: "/ki-schulungen/ki-kompetenz",
  copilot: "/ki-schulungen/copilot-praxistag",
  trainer: "/ki-schulungen/trainer",
  opso: "/opso",
  projekte: "/projekte",
  ueber: "/ueber-uns",
  kontakt: "/contact",
  blog: "/blog",
  impressum: "/impressum",
  privacy: "/privacy",
};

/** Public path per locale, without the locale prefix ("" = the locale home). */
export const SLUG: Record<PageKey, Record<L3, string>> = {
  home: { de: "", en: "", tr: "" },
  beratung: { de: "/ki-beratung", en: "/ai-automation-consulting", tr: "/yapay-zeka-danismanligi" },
  check: { de: "/ki-beratung/ki-check", en: "/ai-automation-consulting/ai-check", tr: "/yapay-zeka-danismanligi/yz-kontrolu" },
  prozess: {
    de: "/ki-beratung/prozessautomatisierung",
    en: "/ai-automation-consulting/process-automation",
    tr: "/yapay-zeka-danismanligi/surec-otomasyonu",
  },
  m365: { de: "/ki-beratung/microsoft-365", en: "/ai-automation-consulting/microsoft-365", tr: "/yapay-zeka-danismanligi/microsoft-365" },
  agenten: { de: "/ki-beratung/ki-agenten", en: "/ai-automation-consulting/ai-agents", tr: "/yapay-zeka-danismanligi/yz-asistanlari" },
  anwendungen: {
    de: "/ki-beratung/anwendungsfaelle",
    en: "/ai-automation-consulting/use-cases",
    tr: "/yapay-zeka-danismanligi/kullanim-ornekleri",
  },
  schulungen: { de: "/ki-schulungen", en: "/ai-training", tr: "/yapay-zeka-egitimleri" },
  kompetenz: { de: "/ki-schulungen/ki-kompetenz", en: "/ai-training/ai-literacy", tr: "/yapay-zeka-egitimleri/yz-yetkinligi" },
  copilot: { de: "/ki-schulungen/copilot-praxistag", en: "/ai-training/copilot-workshop", tr: "/yapay-zeka-egitimleri/copilot-uygulama-gunu" },
  trainer: { de: "/ki-schulungen/trainer", en: "/ai-training/trainers", tr: "/yapay-zeka-egitimleri/egitmenler" },
  opso: { de: "/opso", en: "/opso", tr: "/opso" },
  projekte: { de: "/projekte", en: "/projects", tr: "/projeler" },
  ueber: { de: "/ueber-uns", en: "/about", tr: "/hakkimizda" },
  kontakt: { de: "/contact", en: "/contact", tr: "/iletisim" },
  blog: { de: "/blog", en: "/blog", tr: "/blog" },
  impressum: { de: "/impressum", en: "/impressum", tr: "/impressum" },
  privacy: { de: "/privacy", en: "/privacy", tr: "/privacy" },
};

export const PAGE_KEYS = Object.keys(ROUTE) as PageKey[];

export function isL3(value: string | undefined | null): value is L3 {
  return value === "de" || value === "en" || value === "tr";
}

/** "/x/" → "/x", "/" → "": the form ROUTE and SLUG use. */
function norm(path: string): string {
  const clean = path.split("?")[0].split("#")[0];
  const trimmed = clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
  return trimmed === "/" ? "" : trimmed;
}

/**
 * Public path of a page: "/" for the German home, "/en", "/tr", "/de/ki-beratung",
 * "/en/ai-automation-consulting". `sub` appends a child path (blog posts: "/my-post").
 */
export function href(key: PageKey, locale: L3, opts?: { hash?: string; sub?: string }): string {
  const sub = opts?.sub ?? "";
  const base = key === "home" && locale === "de" && !sub ? "/" : `/${locale}${SLUG[key][locale]}${sub}`;
  return opts?.hash ? `${base}#${opts.hash}` : base;
}

/** Absolute public URL (canonical form; the German home is "https://opsolid.de/"). */
export function absUrl(key: PageKey, locale: L3, sub = ""): string {
  return `${SITE_CONFIG.url}${href(key, locale, { sub })}`;
}

/** Reciprocal hreflang map for one page; x-default is the German version. */
export function alternates(key: PageKey, sub = ""): Record<L3 | "x-default", string> {
  return {
    de: absUrl(key, "de", sub),
    en: absUrl(key, "en", sub),
    tr: absUrl(key, "tr", sub),
    "x-default": absUrl(key, "de", sub),
  };
}

/**
 * Middleware: the internal route for a locale-stripped public path of this locale, when the two differ
 * (EN/TR slugs). Exact matches only; children of identical slugs (/en/blog/x, /en/opso/account) pass
 * through untouched. Returns null when no rewrite is needed.
 */
export function publicToInternal(locale: L3, rest: string): string | null {
  const p = norm(rest);
  for (const key of PAGE_KEYS) {
    if (SLUG[key][locale] === p && SLUG[key][locale] !== ROUTE[key]) return ROUTE[key] || "/";
  }
  return null;
}

/**
 * Middleware: when `rest` is a v7 page path that is not this locale's own slug (the German route folder
 * or another locale's slug, e.g. /en/ki-beratung or /tr/ai-training), the locale-stripped path to 301 to.
 * Returns null for this locale's own slugs and for anything that is not a v7 page path.
 */
export function foreignSlugTarget(locale: L3, rest: string): string | null {
  const p = norm(rest);
  if (PAGE_KEYS.some((key) => SLUG[key][locale] === p)) return null;
  for (const key of PAGE_KEYS) {
    const others = [ROUTE[key], SLUG[key].de, SLUG[key].en, SLUG[key].tr];
    if (others.includes(p)) return SLUG[key][locale] || "/";
  }
  return null;
}

/**
 * The locale-stripped public path for an internal route path in one locale. Turns RETIRED_REDIRECTS
 * targets (internal German paths, optionally with "#fragment") into one-hop redirects.
 * Paths that are not v7 routes come back unchanged.
 */
export function internalToPublic(locale: L3, internal: string): string {
  const [pathPart, hash] = internal.split("#");
  const p = norm(pathPart);
  const key = PAGE_KEYS.find((k) => ROUTE[k] === p);
  const out = key ? SLUG[key][locale] || "/" : pathPart;
  return hash ? `${out}#${hash}` : out;
}

/**
 * The page behind a public path as the browser shows it ("/", "/en/ai-training", "/tr/blog/x"), for the
 * language switcher and breadcrumbs. Longest-slug prefix match, so children keep their `sub` path.
 */
export function keyForPublicPath(pathname: string): { key: PageKey; locale: L3; sub: string } | null {
  const p = norm(pathname);
  if (p === "") return { key: "home", locale: "de", sub: "" };
  const parts = p.split("/").filter(Boolean);
  const locale = parts[0];
  if (!isL3(locale)) return null;
  const rest = "/" + parts.slice(1).join("/");
  const r = norm(rest);
  let best: { key: PageKey; len: number } | null = null;
  for (const key of PAGE_KEYS) {
    const slug = SLUG[key][locale];
    if (r === slug || (slug !== "" && r.startsWith(slug + "/"))) {
      if (!best || slug.length > best.len) best = { key, len: slug.length };
    }
  }
  if (!best) return null;
  const sub = r.slice(best.len);
  return { key: best.key, locale, sub: best.key === "home" ? "" : sub };
}

/**
 * Public path (as the browser shows it) for a locale-stripped public path of one locale:
 * ("de", "") and ("de", "/") → "/", ("en", "") → "/en", ("en", "/about") → "/en/about".
 * Middleware helper for redirect targets; the German home is the domain root.
 */
export function withLocalePrefix(locale: L3, rest: string): string {
  const r = norm(rest);
  if (r === "") return locale === "de" ? "/" : `/${locale}`;
  return `/${locale}${r}`;
}
