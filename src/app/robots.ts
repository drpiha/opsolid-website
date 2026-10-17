import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * robots.txt, generated at build time.
 *
 * Policy: the marketing site is public, so search and AI bots are welcome,
 * including AI-search retrieval bots (how AI answers cite the site) and
 * training crawlers. Only private/app surfaces are disallowed. robots.txt is
 * guidance, not security: private routes are protected by auth, not by this file.
 */
const PRIVATE_PATHS = ["/api/", "/admin/", "/dev/", "/card/edit/", "/onboarding/", "/dashboard/"];

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
