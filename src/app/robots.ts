import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { L3_LOCALES } from "@/lib/v7-routes";

/**
 * robots.txt, generated at build time.
 *
 * Policy: the marketing site is public, so search and AI bots are welcome,
 * including AI-search retrieval bots (how AI answers cite the site) and
 * training crawlers. Only private/app surfaces are disallowed. robots.txt is
 * guidance, not security: private routes are protected by auth, not by this file.
 */
// App routes live under /:locale/… (e.g. /de/card/edit/<id>?t=<token>), so each
// is listed with every public locale prefix as well as bare. No trailing slash on
// dashboard/onboarding so their index pages match too. Retired locales (/es, /ar, …)
// answer 301, so they need no rules.
const LOCALIZED_PRIVATE_PATHS = ["/card/edit/", "/card/manage/", "/onboarding", "/dashboard", "/login", "/magic-link"];
const PRIVATE_PATHS = [
  "/api/",
  "/admin/",
  "/dev/",
  "/voice/",
  ...LOCALIZED_PRIVATE_PATHS,
  ...L3_LOCALES.flatMap((locale) => LOCALIZED_PRIVATE_PATHS.map((path) => `/${locale}${path}`)),
];

// Named so the welcome is explicit; they share the "*" rules in one group.
const AI_BOTS = [
  "OAI-SearchBot", // ChatGPT search
  "GPTBot", // OpenAI training
  "ChatGPT-User", // user-triggered fetch
  "ClaudeBot", // Anthropic training
  "Claude-SearchBot", // Claude search index
  "Claude-User", // user-triggered fetch
  "PerplexityBot", // Perplexity search index
  "Perplexity-User", // user-triggered fetch
  "Google-Extended", // Gemini training/grounding (no effect on Search)
  "Applebot-Extended", // Apple training (no effect on Siri/Spotlight)
  "Bingbot", // Bing search (feeds Copilot and ChatGPT-adjacent indexes)
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: ["*", ...AI_BOTS], allow: "/", disallow: PRIVATE_PATHS }],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
