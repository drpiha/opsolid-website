import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { LOCALES } from "@/lib/i18n";

/**
 * robots.txt, generated at build time.
 *
 * Policy: the marketing site is public, so search and AI bots are welcome,
 * including AI-search retrieval bots (how AI answers cite the site) and
 * training crawlers. Only private/app surfaces are disallowed. robots.txt is
 * guidance, not security: private routes are protected by auth, not by this file.
 */
// App routes live under /:locale/… (e.g. /de/card/edit/<id>?t=<token>), so each
// is listed with every locale prefix as well as bare. No trailing slash on
// dashboard/onboarding so their index pages match too.
const LOCALIZED_PRIVATE_PATHS = ["/card/edit/", "/card/manage/", "/onboarding", "/dashboard", "/login", "/magic-link"];
// "/de" is not a prefix any more for the German home ("/"), but /de/<private> still exists.
const PRIVATE_PATHS = [
  "/api/",
  "/admin/",
  "/dev/",
  "/voice/",
  ...LOCALIZED_PRIVATE_PATHS,
  ...LOCALES.flatMap((locale) => LOCALIZED_PRIVATE_PATHS.map((path) => `/${locale}${path}`)),
];

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
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      // A bot-specific group replaces the "*" group, so the private paths are repeated.
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE_PATHS })),
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
