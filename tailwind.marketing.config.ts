import type { Config } from "tailwindcss";
import base from "./tailwind.config";

/**
 * Tailwind for the marketing sheet only (src/styles/marketing.css, `@config`): the same theme as the app config,
 * but the content scan covers just the files a marketing page renders, so the sheet carries only their utilities.
 * Marketing routes are the isV4Path ones (src/lib/v4.ts); keep the route folders below in step with it. App surfaces
 * load the full sheet (src/app/globals.css) from their own layouts.
 */
const MARKETING_ROUTES = [
  "page.tsx",
  "not-found.tsx",
  "layout.tsx",
  "[...rest]",
  "blog",
  "contact",
  "impressum",
  "ki-beratung",
  "ki-schulungen",
  "opso",
  "privacy",
  "produkte",
  "ueber-uns",
];

const config: Config = {
  ...base,
  content: [
    "./src/app/layout.tsx",
    // Brackets are glob classes, so "[" is written as "[[]" to match the literal folder names.
    ...MARKETING_ROUTES.map((r) => {
      const seg = r.replace(/\[/g, "[[]");
      return r.endsWith(".tsx") ? `./src/app/[[]locale]/${seg}` : `./src/app/[[]locale]/${seg}/**/*.{ts,tsx}`;
    }),
    "./src/components/v7/**/*.{ts,tsx}",
    "./src/content/v7/**/*.ts",
    "./src/content/blog/**/*.ts",
  ],
};

export default config;
