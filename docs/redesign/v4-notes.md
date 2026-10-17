# opsolid.de v4: implementation notes (2026-10-16)

Branch `claude/opsolid-v4`, draft PR #43. Not deployed.

## What changed

- **Art direction (marketing routes only):** graphite + copper, Archivo (display and body, width axis) + IBM Plex Mono (labels). Scoped to `html[data-v4]`. Dark only. App surfaces (dashboard, onboarding, card-preview, auth, public cards `/c/*`, admin, voice) keep the existing theme system and its stylesheet bundle.
- **3D stage:** one persistent object behind every marketing page, a stack of seven plates (one per offering) that re-forms per section with GSAP ScrollTrigger. Sections mark scenes with `data-scene` and `data-heat`. `src/components/v4/Stage.tsx`.
  - **Own column, never over text.** On desktop the object is fitted into the free column beside the measured text column of the scene in view (scale and position are derived from the column's right edge each frame). Wide blocks (tables, the agent demo, FAQ) sit on an opaque panel. On phones the object is above the text and every text column is an opaque panel. `?debug` exposes `window.__v4stage.bounds()` for automated overlap checks.
  - **Impact:** HDR copper edges with bloom (desktop), per-scene camera moves (dolly, crane, field of view), cubic easing between scenes, first frame placed directly at its target (no glide across text).
  - **Real proof on the window planes:** the Websites and Produkte scenes show real screenshots of opsolid.de, OpSo (card.opsolid.de, a demo profile) and Kutasia (kutasia.com, Turkish UI) as `public/img/v4/shot-*.webp` (24–30 kB each, fetched only on pages that have such a scene).
  - three.js and GSAP are dynamic imports, started on the first user intent (pointer, scroll, touch, key) or after 8 s. Until then the static poster (inline SVG) is the first frame.
  - No WebGL, `prefers-reduced-motion`, or the footer switch "3D-Effekte: Aus" keep the poster and load no 3D code. The footer switch is the only quality control in production (the Voll/Leicht/Poster bar existed only in the static prototype).
  - Phones and touch devices run a lighter mode (DPR up to 1.5, no reflections, no bloom, no edge lines, 30 fps). Desktop has a frame-time guard that drops bloom for good if frames stay slow.
- **Pages (DE, EN, TR, content in `src/content/v4/pages-*.ts`):** Start, Agents (new), Websites (new), Leistungen, KI-Beratung, Prozessautomatisierung, Microsoft 365, Interne Tools, KI-Schulungen, KI-Check, Über OpSolid, Kontakt (form), Notizen (blog list and posts). OpSo, Impressum and Datenschutz keep their existing content under the new theme.
- **Design pass (round 3, owner request "nothing ordinary"):** an independent design audit (benchmarked against Awwwards/CSSDA-level work) found the sections monotonous (same column, same slide), a weak H1/H2 hierarchy and template-grade lists, tables, FAQ and footer. Implemented: chapter numbers and rules on every section, top-aligned rhythm, layout variants per block type (index rows with arrows and drawn hover rule, ledger rows, narrow timeline steps, essay text), price table as a rate card with the VAT note under the figures, FAQ as a numbered accordion, steps as a drawn timeline, crop marks on wide panels, a visible drafting grid, the CTA band as a display-size finale, a drafting title-block footer, a scroll-progress hairline in the header, joined full-bleed text panels on phones with "FIG." labels on the 3D windows. Inner pages got their own 3D scenes (rows, steps) so the object keeps telling the story instead of holding one pose; the stage fits the object beside all text that is on screen.
- **Content process (round 3):** one agent wrote the copy (DE source, then EN and TR transcreation), a separate agent audited it independently before and after. Each page now has one specific promise and a problem → approach → proof → offer → next step arc. Prices for the fixed-format offers stay visible with "Alle Preise netto, zzgl. MwSt." (as on the previous site); custom work is priced after the first conversation.
- **Logo:** the official OpSolid lockup (copper rounded-square mark + OPSOLID wordmark, `public/icons/logo with name dark.png`) is used as an inline vector (`src/components/v4/Logo.tsx`, traced from the master PNG) in the header, the menu sheet and the footer. No new logo was designed; an earlier iteration of this branch had wrongly used its own mark.
- **Header and mark:** the header is opaque at every scroll position (no content showing through behind the nav).
- **Layout guards in the repo:** `npm run audit:stage` (Playwright, needs a running server, `BASE=...`) asserts per scene that the 3D object does not intersect any heading, paragraph, list item, table, link, button or form control at 1280, 1440, 1920 and 390 px (desktop: no exemption, phones: opaque panels exempt), plus horizontal scroll and console errors. `npm run audit:headings` checks that no h1/h2 needs a mid-word break in de/en/tr at 360–1920 px. Long German compounds get soft hyphens at known stems (`src/lib/soft-hyphen.ts`).
- **Scripted agent demo:** typed sample dialogue plus a wave, and an abstract voice-reactive form in 3D (particle sphere that swells with the same amplitude, glowing core, three rings; no face, eyes or mouth). Labelled "Demo · Szenario, ohne Ton", with the data-protection note. No audio, no microphone, no provider. A live voice demo needs a provider and a data-protection review first.
- **Voice (owner decision, 2026-10-16):** professional company voice (OpSolid / wir / we / biz), focused on what the work changes for the client's business. Team size is not a topic: all "allein", "Einzelpraxis", "one-person", "tek başıma" phrasing was removed, and no team size is implied. Experience is shown through real background (IT project management, digitalisation, process optimisation), the method and real work (opsolid.de, OpSo as a product in its test phase, Kutasia as a project in development, not a product). No invented numbers, clients, testimonials or certifications. The about page is now "Über OpSolid" at `/ueber-uns` (`/ueber-mich` and `/about` 301 there).

## SEO and GEO

- One `" | OpSolid"` suffix (root title template); manual suffixes removed.
- Self-canonical per locale, reciprocal hreflang (`de`, `en`, `tr`) and `x-default` = `/de` via `src/lib/seo-v4.ts`.
- Locale routing keeps the owner's July rule (#34/#35): **language follows COUNTRY, not the browser**. `/` and other locale-less URLs get a 307 by cookie (explicit choice), then an upstream geo header, then the in-app `/api/geo` lookup over loopback (fail-open, 2.5 s timeout), then `de` when the country is unknown (the July version answered `en` there). Unlike the July version, detection no longer persists the cookie on a confident geo redirect, so a bare `/` visit always re-detects. TR → `tr`, DACH → `de`, everything else → `en`. `Accept-Language` is never consulted: a Turkish browser in Germany lands on `/de`. The 307 carries `Vary: Cookie` and `Cache-Control: private, no-store`; detection writes no cookie (only an explicit language switch persists); `/de`, `/en`, `/tr` never redirect; locale-less retired URLs go to `/de/...` with a stable 301. `?geodebug=1` reflects the decision in `x-opsolid-geo`. The logic is in `src/lib/locale-routing.ts` (including the time-capped `/api/geo` lookup) and unit-tested (country TR/DE/AT/CH/US, unknown country, cookie beats country, Accept-Language ignored, lookup timeout or failure → `de`). `DEFAULT_LOCALE` stays `en` (app surfaces); `ROUTING_DEFAULT_LOCALE` is `de`.
- One JSON-LD `@graph` per page (`src/components/v4/JsonLd.tsx`): ProfessionalService, Person, WebSite, WebPage / ProfilePage / CollectionPage / ContactPage, BreadcrumbList (matches the visible breadcrumb), Service (offers only for the three published training prices), FAQPage (only where the FAQ is visible), BlogPosting.
- `robots.txt`: public site open to search and AI bots (list in `src/app/robots.ts`), private paths disallowed. `llms.txt` rewritten, no "we", linked from the footer. Sitemap has alternates and real `lastModified`.
- Visible "Stand: Oktober 2026" (from `SITE_UPDATED_ISO`), answer-first lede under every H2, one line "OpSolid ist nicht TopSolid" on Über mich and in the footer.

## Performance work

- The full content bundle (about 220 kB gz) no longer ships to marketing routes: `useLocale()` is split into locale-only (`useLocaleBase`) and content (`t`, via `ContentGate`).
- Legacy stylesheets (about 26 kB gz) load only for app, legal and card surfaces.
- Archivo latin is the only preloaded display font; latin-ext (ğ ş İ ı) loads on demand. Geist is no longer preloaded.
- Consent copy extracted into `src/content/consent-copy.ts`; accept and reject carry the same visual weight.
- `/api/auth/status` answers 200 for anonymous visitors, so there is no 401 console error on every page. `/api/auth/me` keeps its 401 contract.

## Owner questions: resolved from OpSolid's own sources (2026-10-17)

The owner asked to answer what can be answered from OpSolid's own material and to decide the rest.

- **VAT:** the Impressum lists a VAT ID ("Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE462227107") and the previous site said "Alle Preise in EUR, zzgl. MwSt.". The price tables keep "Alle Preise netto, zzgl. MwSt." with "Die Angebote richten sich ausschließlich an Unternehmen" (team trainings are B2B; net prices are only allowed when the offer is B2B).
- **Logo:** the official lockup from `public/icons/` is used (inline vector trace); the favicon `src/app/icon.svg` is also an existing official asset and stays.
- **Kutasia screenshot in Turkish:** kutasia.com is currently Turkish-only (no `/de`, no language switch), so the Turkish UI is the accurate picture of the project.
- **Website prices, experience years, Copilot-Praxistag lead:** none of these exist in the repo, the old copy, `llms.txt` or the live site. The copy stays neutral (prices after the first call, experience described qualitatively, no trainer named for the Copilot day) rather than inventing them.
- **Legacy product pages:** `/products` (the old "Neun Produkte" hub) now 301s to `/leistungen`, `/products/kutasia` to `/websites` (work samples), `/solutions` straight to `/leistungen`. The dead route files (`products/page.tsx`, `ProductsHubPage.tsx`, `products/kutasia/*`, `about/*`) are deleted. The OpSo flow under `/products/digital-card/*` keeps working; its gallery no longer says "go live in minutes".
- **About route:** moved to `/ueber-uns`; `/ueber-mich` and `/about` 301 there (locale prefix kept).
- **Statements written as commitments** (re-measure after each pilot, target ranges for pilot durations, trainer named in advance, website price in writing after the first call): they describe how OpSolid will work, not past results. Pilot durations come from the previous copy. OpSo's dashboard, onboarding and admin console are in this repository.
- **Video agents with a 3D figure** stay as an offering (original brief); the live demo follows the data-protection review.

Still open only if the owner wants more: real numbers (years, sectors, projects) and a photo.

## Verification (sandbox, 2026-10-17, final build of round 3)

- `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run predeploy` (audit:cards + build), `npx tsx --test scripts/tests/redirects.test.mts` (10 of 10: retired routes incl. `/ueber-mich` → `/ueber-uns` and the legacy product hub, country routing, and a geo lookup that times out, fails or returns garbage → `de`): all pass.
- Country routing checked end to end with curl on the production build: geo header TR → `/tr`, DE/AT/CH → `/de`, US → `/en`, no country → `/de`, `Accept-Language: tr` with country DE → `/de`, cookie `en` beats country DE, in-app lookup over loopback (8.8.8.8 → US → `/en`), `/de` `/en` `/tr` answer 200, retired `/solutions` → 301 `/de/products`; detection sets no locale cookie.
- `npm run audit:headings` (de/en/tr × 360, 390, 768, 1280, 1440, 1920 px × 13 pages): no heading needs a mid-word break.
- `npm run audit:stage` (every section of the 13 staged pages, object box vs every visible heading, paragraph, list item, table, link, button and form control; desktop strict, phones with opaque panels): 1280, 1440, 1920 and 390 px all clear, no console errors, no horizontal scroll. OpSo, Impressum and Datenschutz (no 3D) have no horizontal scroll at 1440 or 390.
- axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practice), with the 3D stage running, 18 pages (`/de` pages, `/en`, `/tr`) at 1440 and 390 px: 0 violations.
- Lighthouse 12 mobile, devtools throttling (4x CPU, slow 4G), production build, software WebGL: `/de` performance 91–92, LCP 2.2 s, TBT 110–150 ms, CLS 0.010–0.015; `/de/ki-schulungen` 94, LCP 2.2 s, TBT 100 ms, CLS 0.007; `/de/agents` 91, LCP 2.1 s, TBT 210 ms, CLS 0.065. Accessibility, best practices and SEO 100 on all. LCP ≤ 2.5 s and CLS ≤ 0.1 hold; the internal "LCP under 2.0 s lab" target is still not reached under this throttling.
- JS at load (gzip): about 194 kB for marketing routes (Next reports about 159 kB first-load); the 3D chunks (three, bloom, GSAP) add about 210 kB after first intent; the three screenshot textures (about 85 kB) load only on pages with a Websites/Produkte scene.
- Limits: all WebGL here is software rendering (SwiftShader, a few frames per second), so real frame rate, bloom cost and the frame-time guard are not measured; no real GPU, phone or field data. Lighthouse does not interact with the page, so the 3D core is mostly outside its window.

## CLAUDE.md

Updated in this PR: v4 art direction and tokens, Archivo + IBM Plex Mono, the content split (`useLocaleBase` vs `useLocale`), the 3D guardrails (SSR text as LCP, idle/intent load, light mode on phones, poster for reduced motion / no WebGL, footer switch, never over text, abstract agent, real proof only), no gradient mesh, no glassmorphism. Stale rules (Geist/Inter/Instrument Serif as the marketing fonts, the homepage sections list, the "deep blue / violet" tailwind note, the single `useLocale()` pattern) were replaced; "no gradient mesh, no glassmorphism, no framer-motion page choreography" is kept.

## Dead code removed

`src/app/[locale]/leistungen/LeistungenPage.tsx` and `src/app/[locale]/ai-automation-check/AIAutomationCheck.tsx` were no longer imported (the routes render the v4 page definitions) and are deleted. `src/components/v2/*` and `src/components/sections/*` stay: `/about`, the `products/*` pages and `ProductStubPage` still import them.
