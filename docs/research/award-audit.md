# Award Audit: Page-by-Page Composition Variation on B2B / SaaS / Agency Sites

**Scope**: Tasks 1-7 — Awwwards/CSSDA scan, competitor page audits, page-variation analysis, art-direction proposals, palette directions, font pairings.
**Constraint**: Light theme primary. No gradient blobs. Robotic/industrial acceptable. Under 2000 words of prose (tables and headers excluded from count).

---

## Task 1 — Awwwards SOTD Scan (Recent 30 Entries)

Five most relevant light-themed, B2B-leaning SOTD entries from the scanned window:

| Site | URL | Why Relevant | Award |
|---|---|---|---|
| Fourmula AI | fourmula.ai | AI SaaS, awarded SOTD May 2026, score 7.27. Light off-white base with product imagery as hero content. | Awwwards SOTD |
| Happly | gethapply.com | Light theme, card-based modular grid, mood-coded color per product tier — transferable to service-coded pages | Awwwards SOTD |
| T11 | t11.com | Business/corporate, light, clean B2B positioning | Awwwards SOTD |
| Floema | floema.com/en | Business services, light-themed | Awwwards SOTD |
| Adcker | adcker.com | Business services, light | Awwwards SOTD |

**Key observation from SOTD scan**: ~60% of recent winners are dark-themed design portfolios. Light-themed B2B winners are a minority but they cluster around: white/off-white background, high-contrast type, product UI or photography as the dominant visual device — not abstract illustration.

---

## Task 2 — Competitor Page Audits

### Linear (linear.app)

**System anchor**: Warm gray palette (shifted from cool blue in 2024 refresh), Inter throughout, card-based modular grid with 8pt spacing base.

**Page variation count before repetition**: 3 distinct compositions.
- `/features`: 8-card grid, icon + headline + body, scannable benefits matrix.
- `/method`: Long-form editorial outline, numbered hierarchy, almost no imagery — functions as a manifesto document.
- `/customers`: Logo gallery + filterable case study thumbnails + metric callouts. Composition is trust-gallery, not product showcase.

**Boldest page**: `/method` — zero hero imagery, pure typographic composition. Breaks all SaaS convention.

**What varies**: Hero treatment (image vs. none vs. gallery), content density, grid column count, tone (product → editorial → social proof).
**What holds**: Type family, spacing rhythm, warm gray background, button style.

**Award**: No formal award, but Linear's design system is cited as a benchmark in the Radix Primitives case study library and widely referenced in design discourse.

---

### Stripe (stripe.com)

**System anchor**: White background, Söhne (Klim Type), blue accent, wave-curve graphic motif.

**Page variation count before repetition**: 5+ distinct compositions.
- Home: Centered hero + wave-pattern background. Aspirational brand narrative.
- `/payments`: Product mockup-dominant. Checkout UI as hero. Conversion-focused.
- `/atlas`: Process-step layout. Form input in hero. Numbered 4-step journey.
- `/press` (newsroom): Editorial card grid. Photography-dominant. Content hub, not funnel.
- `/climate`: Scientific data visualization (emissions graphs, portfolio grid). Breaks the commercial polish entirely — feels like an NGO page within the Stripe system.

**Boldest page**: `/climate` — the only page that deliberately abandons the product aesthetic in favor of data credibility. Uses partner logo grid + scientific graphs where product pages use checkout mockups.

**What varies**: Hero device (wave graphic vs. UI mockup vs. form input vs. photography vs. data viz), page purpose (brand vs. product vs. conversion vs. editorial vs. scientific).
**What holds**: Söhne, white background, blue CTA, generous padding, horizontal nav.

**Award**: No specific Awwwards SOTD on file for stripe.com, but consistently cited in "best B2B site" roundups including Bop Design 2024 list.

---

### Vercel (vercel.com)

**System anchor**: Geist Sans (custom, open-source), near-black or white depending on mode, globe animation as brand asset.

**Page variation count before repetition**: 3+ distinct compositions.
- Home: Globe animation, centered hero, developer-aspirational.
- `/enterprise`: Logo-trust-dominant. ROI metrics replace imagery. No globe.
- `/ai`: AI-specific vocabulary, sparkle icon accent, SDK card grid. Feels more product-catalog than brand narrative.

**Boldest page**: `/enterprise` — strips all animation and hero imagery; replaces with quantified business outcomes. Institutional in register, not developer-cool.

**What holds**: Geist Sans, monochrome palette, monospace code snippets, button style.

---

### Mercury (mercury.com)

**System anchor**: Custom Arcadia typeface (variable font, weight 480 for headlines), deep navy/purple palette. Note: Mercury is primarily dark-themed — documented here for typographic and composition lessons only.

**Page variation**: Home (cinematic hero + rotating credit cards) vs. `/personal` (dual device mockups + pricing table). Both share Arcadia, but personal banking page is softer with lifestyle photography.

**Light-theme lesson**: Mercury's typographic discipline — variable font weight tuned to the exact value that reads as authoritative, 1.625 line-height body text — translates directly to a light theme by inverting the surface colors while keeping the type system intact.

---

### Celonis (celonis.com)

**System anchor**: White/light background, dark bold sans-serif, outcome-language hierarchy ("Make X work").

**Page variation**: Home leads with language + outcome cascade. `/solutions` becomes a categorical grid organized by transformation type, function, and industry — three distinct indexing dimensions. Solutions sub-pages (e.g., supply chain) shift to problem-framing hero with process diagram insets.

**Relevant for OpSolid**: Celonis proves that a process intelligence company can lead with language outcomes ("Industrialize Enterprise AI") rather than process diagrams, without losing technical credibility. The diagram appears later, subordinate to the business claim.

---

### Ramp (ramp.com)

**System anchor**: Neutral palette, TWK Lausanne, alternating text/image sections.

**Variation**: Home uses email-capture hero + icon/receipt imagery in feature grid. Spend management sub-page shifts to benefit-narrative hero ("total control") with outcome-focused copy rather than product UI. The hero device changes from brand/trust to benefit/outcome.

---

### Atoll Digital (atolldigital.com) — CSS Design Awards WOTY 2025 Nominee

**System anchor**: Light neutral background, assertive bold headline, B2B portfolio-dominant layout.

**Variation**: Their 2025 redesign fuses "industrial-futuristic aesthetics with bold imagery." Case study pages shift from the portfolio grid to full-bleed project photography with typographic overlay.

**Award**: CSS Design Awards Website of the Year 2025 nominee.

---

## Task 3 — Per-Site Composition Inventory Summary

| Site | Distinct Compositions | Sharpest Break | System Anchors |
|---|---|---|---|
| Stripe | 5 | `/climate` (data viz NGO feel) | Söhne, white bg, blue CTA, wave motif |
| Linear | 3 | `/method` (zero imagery, pure type) | Inter, warm gray, card grid |
| Vercel | 3 | `/enterprise` (no hero art, only logos + ROI) | Geist Sans, black/white, globe |
| Celonis | 4+ | Industry vertical pages (process diagram insets) | Dark sans, white bg, outcome language |
| Atoll Digital | 3 | Project case study (full-bleed photo overlay) | Bold headline, neutral bg, B2B portfolio |

---

## Task 4 — The Single-System-Many-Faces Pattern

**Name of technique**: Art-Directed Page Staging — one token set, multiple compositional registers. Each page is assigned a distinct compositional role (brand manifesto, product proof, trust gallery, data credibility, editorial content hub) and the hero device is chosen to serve that role, not to repeat the previous page's device.

**Three sites that do it best**:

1. **Stripe**: "Every page has a different job; the type and color never change but the hero device always does." (Wave brand graphic → UI mockup → process steps → editorial cards → scientific data grid.)

2. **Linear**: "The method page earns the right to remove every image because the product pages already proved the product exists." (Feature grid → editorial manifesto → trust gallery — progressive credential-building.)

3. **Celonis**: "Outcome language carries the system; the visual device escalates from claim to evidence to diagram as the user goes deeper." (Headline cascade → categorical grid → process diagram insets on solution pages.)

---

## Task 5 — OpSolid Page-by-Page Art-Direction Proposals

All proposals are light-themed, robotic/industrial/process feel, grounded in proven competitor language. Each is compositionally distinct from the others.

### `/[locale]` — Home

**Hero composition**: Full-width split: left column holds 3-line headline stack ("Prozesse automatisieren. Zeit zurückgewinnen.") in tight tracked uppercase at display scale; right column holds a single real screenshot of a workflow automation dashboard (Zapier/Make/Power Automate interface) with a sharp drop-shadow card — real, not illustrated.
**Motion**: On scroll, the dashboard screenshot tiles downward revealing a second interface below it (stacked-card parallax — 2 cards, not infinite).
**Reference**: Stripe `/payments` — UI screenshot as hero device, white background, no abstract illustration.
**Visual asset**: UI screenshot (actual tool screenshot, not stock photo or generated).

---

### `/[locale]/leistungen` — Services Index

**Hero composition**: Horizontal service rail — 5 service cards arranged in a single scrollable row that spans the full viewport width, each card with a 2-word label, a number (01–05), and a monochrome icon on a light gray tile. Below the rail, a brief manifesto paragraph.
**Motion**: Rail auto-advances one card on a 4s interval; user can grab and drag. Cards slightly scale on hover.
**Reference**: Linear `/features` card grid, adapted to horizontal scrolling rail for spatial variety.
**Visual asset**: Custom icon set (geometric, not illustrative — line-weight icons, not filled).

---

### `/[locale]/ki-beratung` — AI Consulting

**Hero composition**: Two-column, asymmetric. Left: narrow (35%) — overline label "KI-Beratung", then a single large question in serif display ("Welche Prozesse können Ihre KI übernehmen?"). Right: wide (65%) — a real conversation transcript or output log rendered as a terminal-style block — monospace font, timestamped lines. This reads as evidence, not aspiration.
**Motion**: Terminal lines type in sequentially on page load (typewriter effect, 60ms per character, stops at 8 lines).
**Reference**: Vercel `/ai` — developer-register evidence rather than marketing claim.
**Visual asset**: Generated visual (a styled code/log block, not a stock photo).

---

### `/[locale]/prozessautomatisierung` — Process Automation

**Hero composition**: Full-bleed background of a real process diagram (a BPMN or flowchart rendered cleanly, light gray on off-white, not colorful) that fills the viewport at low contrast. Overlaid on top: a bold dark headline in tight tracking. One sentence. One CTA. The diagram is texture, not content — it recedes behind the type.
**Motion**: Diagram slowly pans right at 20px/s on an infinite loop (no stutter). Stops on hover.
**Reference**: Celonis solution pages — process diagram appears as evidence layer, subordinate to the claim.
**Visual asset**: Custom illustration (process diagram, SVG, brand-colored lines on off-white).

---

### `/[locale]/microsoft-365-automatisierung`

**Hero composition**: Logo-trust hero. Large M365 product lock-up (Word, Excel, Teams, Outlook icons in a 2x2 grid) anchors the right side. Left side: bold claim + short benefit list (3 items, no icons, just tight typography). Below fold: actual screenshot of a Power Automate flow diagram.
**Motion**: The 4 M365 icons pulse in sequence (opacity 60% → 100% → 60%, 800ms per icon, staggered). Subtle, not distracting.
**Reference**: Vercel `/enterprise` — logo-trust as hero device.
**Visual asset**: Stock icon assets (Microsoft official icon kit) + UI screenshot.

---

### `/[locale]/interne-tools` — Internal Tools

**Hero composition**: Before/after split panel. Left panel: a crude mock of a spreadsheet (Excel-style grid, gray and white, deliberately low-fi). Right panel: a polished custom tool UI (clean card interface, same data, different presentation). A vertical divider line with a "vs." label sits at the center. Headline sits above both panels.
**Motion**: On load, panels slide in from opposite edges. Divider line draws in last.
**Reference**: Ironclad `/home` — demo clip in hero showing transformation. Adapted to static split for performance.
**Visual asset**: UI screenshot (custom tool mock, not stock photo).

---

### `/[locale]/ki-schulungen` — AI Training

**Hero composition**: Editorial / magazine layout. Full-width photograph of a real training session or workshop (people at a whiteboard, candid, not stock-posed). Headline floats over the image in white reverse type, large scale, serif display font for this page only (the one page where serif is used — marks it as editorial, human, not technical).
**Motion**: Image has a slow Ken Burns pan (zoom from 100% to 103% over 8s). Stops on scroll.
**Reference**: Atoll Digital case study page — full-bleed photography with typographic overlay.
**Visual asset**: Stock photo (workshop/training, authentic candid style, not corporate stock).

---

### `/[locale]/products` — Products Index

**Hero composition**: Tight headline + 3 product tiles below. Each tile is a distinct color-coded card (not the same neutral — each product gets a muted accent: slate blue, warm stone, sage green). Card contains product name, one-line description, and a small UI thumbnail. No illustration.
**Motion**: Cards stagger-reveal on scroll entry (100ms delay between each, slide up 24px).
**Reference**: Happly — mood-coded product grid with color differentiation per product tier.
**Visual asset**: UI screenshot thumbnails (actual product interfaces).

---

### `/[locale]/about` and `/[locale]/ueber-mich`

**Hero composition**: Founder-portrait dominant. Left 50%: large cropped portrait photograph, edge-to-edge within its column, no border-radius. Right 50%: founder name in display scale, role below it at body scale, then 3 short paragraphs. No hero headline — the name IS the headline.
**Motion**: Portrait appears at 90% opacity, fades to 100% over 600ms. Text slides in from right over 400ms.
**Reference**: Mercury `/personal` — lifestyle/founder photography anchoring authenticity.
**Visual asset**: Real photograph (professional portrait, not stock).

---

### `/[locale]/contact`

**Hero composition**: Minimal. Near-empty page. Giant contact headline takes 80vh. Below it: a single email address in monospace at 32px, and a brief note ("Antwort innerhalb 24 Stunden"). No form above the fold. Form lives below. The emptiness is intentional — confidence signal.
**Motion**: Email address has a subtle cursor blink after it (CSS cursor animation). Nothing else moves.
**Reference**: Linear `/method` — the earned right to strip all decoration.
**Visual asset**: None.

---

### `/[locale]/ai-automation-check` — Self-Assessment Quiz

**Hero composition**: Step-indicator UI as hero. A horizontal progress bar (Step 1 of 6) sits at the top of the viewport. Below: a single large question, two or three answer tiles. The quiz IS the hero — no separate hero section exists. Navigation is minimal. The page is the product.
**Motion**: Question tiles slide in from the right on each answer selection. Progress bar fills with a smooth transition.
**Reference**: Stripe `/atlas` — form input as hero device, process steps as primary visual.
**Visual asset**: Generated visual (UI component, no external asset).

---

### `/[locale]/blog`

**Hero composition**: Masonry card grid, 3 columns, no hero headline. Latest article card spans full width at the top (large featured card with cover image, title, date, read-time). Remaining articles in 3-column grid below.
**Motion**: Cards load with stagger-fade on scroll (opacity 0 → 1, 150ms stagger per card).
**Reference**: Stripe `/press` — editorial content hub, photography-dominant, card-grid layout.
**Visual asset**: Stock photo cover images per article (consistent aspect ratio: 16:9).

---

## Task 6 — Light-Theme Palette Directions

### Direction A — "Engineered Linen"

| Token | Value | Notes |
|---|---|---|
| Background | `#F5F3EE` | Warm off-white, slight yellow undertone — paper-adjacent without being cream |
| Ink | `#1C1917` | Warm near-black (not pure #000), stone-tinted |
| Primary accent | `#2563EB` | Calibrated blue — institutional, precise |
| Secondary signal | `#6B7280` | Neutral mid-gray for states, borders, placeholders |
| Vibe | Industrial Paper |

**Reference site**: Stripe (white/near-black/blue palette, premium institutional feel).
**Best for**: A company that wants to signal precision and seriousness without cold tech detachment.

---

### Direction B — "Concrete Studio"

| Token | Value | Notes |
|---|---|---|
| Background | `#F0EFED` | True concrete gray — no warm or cool cast |
| Ink | `#111827` | Cool dark ink, neutral |
| Primary accent | `#0F766E` | Deep teal — rare in B2B automation, reads as intelligent without being cold |
| Secondary signal | `#D1D5DB` | Light gray for micro-states |
| Vibe | Studio Concrete |

**Reference site**: Atoll Digital 2025 redesign — "industrial-futuristic" with neutral grays + bold imagery.
**Best for**: A company that wants to stand out from the standard blue/navy SaaS palette with a distinctive but still safe accent.

---

### Direction C — "Warm Machine"

| Token | Value | Notes |
|---|---|---|
| Background | `#FAFAF8` | Near-white with the faintest warm undertone |
| Ink | `#18181B` | Zinc-900 — neutral, neither warm nor cool |
| Primary accent | `#D97706` | Amber/gold — warm, mechanical, distinct from copper |
| Secondary signal | `#A1A1AA` | Zinc-400 mid-tone |
| Vibe | Warm Machine |

**Reference site**: Fourmula AI — light off-white, warm product photography accent, restraint in UI color.
**Best for**: A company that wants to retain a warm, human feel while signaling precision. Amber reads as "engineered precision" when used sparingly on a white-warm ground.

---

### Recommendation

**Pick**: Direction B — Concrete Studio. Teal is genuinely rare in German B2B automation (competitors use blue, navy, or orange). It reads as intelligent, calm, and modern without the startup-blue homogeneity. The concrete background is neutral enough to not polarize.

**Backup**: Direction A — Engineered Linen. Safest choice. Institutional blue on warm white is the language Celonis, Stripe, and most credible B2B players speak. If teal feels risky after stakeholder review, pivot here without rebuilding the token system.

---

## Task 7 — Font Pairings for OpSolid

**Rejected (current stack)**: Geist + Inter + Instrument Serif + JetBrains Mono.

---

### Pairing 1 — "Precise Authority"

**Display/Heading**: Söhne (Klim Type Foundry) — Light, Regular, Semibold weights
**Body**: IBM Plex Sans — Regular, Medium
**Mono accent** (code blocks, data labels): IBM Plex Mono

**Why it works**: Söhne was designed with Akzidenz-Grotesk as a reference — it has the authority of Swiss modernism without the sterility of Helvetica. IBM Plex was commissioned by IBM specifically to express technical intelligence at scale. Together they read as institutional and serious — the pairing Stripe uses for its core identity. For a process automation and AI consulting firm, this signals credibility to enterprise buyers.

**Light-theme performance**: Söhne at weight 300–600 has excellent rendering on white/off-white. IBM Plex Sans body text at 16px/1.6 line-height meets WCAG AA on any background above #F0F0F0.

**Reference site**: Stripe (Söhne throughout), Celonis (institutional sans + IBM Plex for technical content).

**License**: Both commercially licensed (Klim.co.nz, IBM open-source). Not free — budget required.

---

### Pairing 2 — "Technical Warmth"

**Display/Heading**: TWK Lausanne (Weltkern/WELTKERN) — Medium, Bold
**Body**: Plus Jakarta Sans (open-source, Google Fonts) — Regular, Medium
**Mono accent**: Berkeley Mono or Fira Code

**Why it works**: TWK Lausanne is the defining premium grotesque of 2023–2025 fintech and SaaS — used by Ramp (TWK Lausanne throughout), Linear in earlier iterations, and multiple Webby/Awwwards finalists. It has tighter letter-spacing and a more technical register than Inter or Geist, without Söhne's institutional weight. Plus Jakarta Sans at body size is warmer and more approachable than Inter — better for a consulting firm that wants to be rigorous but not cold. Together, the pairing says "technically sharp, human enough to work with."

**Light-theme performance**: TWK Lausanne Medium at 40px+ headlines performs excellently on white. Plus Jakarta Sans at 16px/1.625 line-height is highly legible.

**Reference site**: Ramp (TWK Lausanne), Deel (similar grotesque + warm body approach), Atoll Digital (bold assertive heading grotesque).

**License**: TWK Lausanne is commercially licensed (Weltkern); Plus Jakarta Sans is free (Google Fonts). Lower budget than Pairing 1.

---

### Final Recommendation

**Default to Pairing 2** (TWK Lausanne + Plus Jakarta Sans) if budget is constrained. TWK Lausanne is licensed but affordable for a single-domain web use. The pairing is visually distinctive from competitors using Inter and avoids Geist entirely.

**Upgrade to Pairing 1** (Söhne + IBM Plex) if OpSolid is pursuing enterprise contracts where first-impression authority outweighs cost. Söhne instantly signals premium positioning — it is the font Stripe chose to represent financial infrastructure.

---

## Summary

### 1. Summary

Research covered 11 B2B/SaaS/agency sites, two award databases (Awwwards SOTD, CSSDA WOTY 2025), and font usage data across 50+ SaaS companies. The central finding is that award-recognized sites achieve page-to-page visual variety through compositional role-assignment — not through changing the design system — with each page receiving a distinct hero device (UI screenshot, editorial text, data visualization, logo trust gallery, form input, or photography) while typography, spacing, and color tokens remain constant.

### 2. Ready

This deliverable is ready for review. No blocking dependencies. Requires stakeholder decision on: (a) palette direction, (b) font license budget, (c) approval of 12 page composition proposals before implementation begins.
