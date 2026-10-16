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
- **Pages (DE, EN, TR, content in `src/content/v4/pages-*.ts`):** Start, Agents (new), Websites (new), Leistungen, KI-Beratung, Prozessautomatisierung, Microsoft 365, Interne Tools, KI-Schulungen, KI-Check, Über mich, Kontakt (form), Notizen (blog list and posts). OpSo, Impressum and Datenschutz keep their existing content under the new theme.
- **Scripted agent demo:** typed sample dialogue plus a wave, and an abstract voice-reactive form in 3D (particle sphere that swells with the same amplitude, glowing core, three rings; no face, eyes or mouth). Labelled "Demo · Szenario, ohne Ton", with the data-protection note. No audio, no microphone, no provider. A live voice demo needs a provider and a data-protection review first.
- **Voice:** all v4 copy is first person singular. Collective "we/wir/biz" phrasing was removed in DE, EN and TR ("Im KI-Check gehe ich … mit Ihnen durch").

## SEO and GEO

- One `" | OpSolid"` suffix (root title template); manual suffixes removed.
- Self-canonical per locale, reciprocal hreflang (`de`, `en`, `tr`) and `x-default` = `/de` via `src/lib/seo-v4.ts`.
- `/` answers with a 307 by cookie, then `Accept-Language`, then `de`. `/de`, `/en`, `/tr` never redirect. Locale-less retired URLs go to `/de/...` with a 301 that does not depend on request headers. The old geo-IP logic is gone. `DEFAULT_LOCALE` stays `en` (used by app surfaces); `ROUTING_DEFAULT_LOCALE` is `de`.
- One JSON-LD `@graph` per page (`src/components/v4/JsonLd.tsx`): ProfessionalService, Person, WebSite, WebPage / ProfilePage / CollectionPage / ContactPage, BreadcrumbList (matches the visible breadcrumb), Service (offers only for the three published training prices), FAQPage (only where the FAQ is visible), BlogPosting.
- `robots.txt`: public site open to search and AI bots (list in `src/app/robots.ts`), private paths disallowed. `llms.txt` rewritten, no "we", linked from the footer. Sitemap has alternates and real `lastModified`.
- Visible "Stand: Oktober 2026" (from `SITE_UPDATED_ISO`), answer-first lede under every H2, one line "OpSolid ist nicht TopSolid" on Über mich and in the footer.

## Performance work

- The full content bundle (about 220 kB gz) no longer ships to marketing routes: `useLocale()` is split into locale-only (`useLocaleBase`) and content (`t`, via `ContentGate`).
- Legacy stylesheets (about 26 kB gz) load only for app, legal and card surfaces.
- Archivo latin is the only preloaded display font; latin-ext (ğ ş İ ı) loads on demand. Geist is no longer preloaded.
- Consent copy extracted into `src/content/consent-copy.ts`; accept and reject carry the same visual weight.
- `/api/auth/status` answers 200 for anonymous visitors, so there is no 401 console error on every page. `/api/auth/me` keeps its 401 contract.

## Needs owner confirmation

1. Websites: sale/rental terms and prices are not in the repo. The text says "Konditionen im Gespräch" and describes Kauf (you get the site) and Miete (I run it).
2. The sample dialogue in the agent demo is invented and labelled "gespielter Ablauf".
3. The repo lists two entry offers: KI-Check (price on request, 30-day plan) and KI-Quick-Check (from 490 €, short report). The KI-Check page links them; they may need merging.
4. "Den KI-Quick-Check führe ich selbst durch" and "kein Zertifikatskurs" are inferred, not taken from existing copy.
5. Kutasia is described with the llms.txt wording (WhatsApp, Telegram, email in one inbox, AI pre-sorting).
6. Hero and "Über mich" sentences are new first-person drafts. No photo of Hasan yet.
7. Screenshots on the 3D window planes: opsolid.de (this site), OpSo (card.opsolid.de landing, fictional demo profiles), Kutasia (kutasia.com root, Turkish UI, demo dashboard). Please confirm you are happy to show these publicly; replace the three files in `public/img/v4/` to change them.

## Verification (sandbox, 2026-10-16)

- Clean install and gate: `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run predeploy` (audit:cards + build), `npx tsx --test scripts/tests/redirects.test.mts` (3 of 3): all pass.
- Overlap audit (Playwright + `?debug` hook; for every scene section of every marketing page the projected object box is compared with the rectangle of every visible text element not on an opaque panel). Final build: the 13 pages that have a 3D stage at 1440 and 390 px, 6 pages at 1280 and at 1920 px, plus a mid-morph pass at 78 % section progress (1440 and 390, 8 pages) on the previous build. Earlier builds covered 13 pages at each of 1280, 1440 and 1920. No overlaps, no console errors, no horizontal scroll at 1440 or 390 on any page including OpSo, Impressum and Datenschutz (which have no 3D stage). The audit boxes are conservative axis-aligned boxes, so a few pixels of apparent edge contact at the right viewport edge are not real overlap.
- axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practice), with the 3D stage running (full on desktop, light on mobile), 18 pages (`/de` pages, `/en`, `/tr`) at 1440 and 390 px: 0 violations.
- Lighthouse 12 mobile, devtools throttling (4x CPU, slow 4G), production build, software WebGL, final build. `/de`: performance 89 (85–89 over five runs), LCP 2.3 s (2.2–2.4 s, text, `p.v4-lede`), TBT 170 ms (170–260 ms), CLS 0.024. `/de/ki-schulungen`: 92, LCP 2.4 s, TBT 100 ms, CLS 0.027. `/de/agents`: 92, LCP 2.2 s, TBT 180 ms, CLS 0.022. Accessibility 100, best practices 100, SEO 100 on all. LCP is within 2.5 s and CLS within 0.1, but with little headroom on `/de` and `/de/ki-schulungen`; the earlier internal target "LCP under 2.0 s lab" is not reached under that throttling. Remaining weight: render-blocking CSS (tailwind about 23 kB gz, tokens, v4) and the preloaded display font (about 89 kB). Not done: purge unused tailwind utilities for marketing routes, subset the display font, inline critical CSS.
- JS at load (gzip): about 194 kB (Next reports 159 kB first-load for marketing routes), down from about 407 kB. The 3D chunks (three, bloom passes, GSAP ScrollTrigger) add about 210 kB gz after first intent; screenshots add about 79 kB, only on pages that have a Websites / Produkte scene.
- Limits: all WebGL runs here use software rendering (SwiftShader, a few frames per second), so frame rate, bloom cost and the frame-time guard are not measured, and no real GPU, phone or field data was available. Lighthouse in this sandbox does not interact with the page, so the 3D core (which starts on first intent or after 8 s) is largely outside the measured window; interactive cost of the 3D is therefore not in these numbers.

## CLAUDE.md

Updated in this PR: v4 art direction and tokens, Archivo + IBM Plex Mono, the content split (`useLocaleBase` vs `useLocale`), the 3D guardrails (SSR text as LCP, idle/intent load, light mode on phones, poster for reduced motion / no WebGL, footer switch, never over text, abstract agent, real proof only), no gradient mesh, no glassmorphism. Stale rules (Geist/Inter/Instrument Serif as the marketing fonts, the homepage sections list, the "deep blue / violet" tailwind note, the single `useLocale()` pattern) were replaced; "no gradient mesh, no glassmorphism, no framer-motion page choreography" is kept.

## Dead code candidates (not removed)

`src/app/[locale]/leistungen/LeistungenPage.tsx` and `src/app/[locale]/ai-automation-check/AIAutomationCheck.tsx` are not imported by anything any more (the routes render the v4 page definitions). `src/components/v2/*` and `src/components/sections/*` are still imported by `/about`, the `products/*` pages and `ProductStubPage`, so they stay. Left in place to keep this PR reviewable.
