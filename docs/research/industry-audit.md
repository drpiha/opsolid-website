# Industry Audit — SMB Automation, RPA, Orchestration, DACH Enterprise

Audience: DACH SMB owners and ops leads. Goal: capture what category leaders ACTUALLY do, so OpSolid lands in the right register — not in cliché "automation = dark theme + electric mint" territory.

Method: live WebFetch on each home page in May 2026; WebSearch fallback where direct fetch was blocked (ServiceNow 403, MuleSoft 403, SAP 403, Personio 429). Fetch failures flagged inline.

---

## Per-site dissection

### zapier.com
- Palette: white background, dark navy text, teal accents on CTAs. Light-default.
- Type: modern geometric sans for headlines; matching sans body. No serif moments. Font specifics not exposed in CSS payload (likely a brand sans served via Next.js font optimization).
- Hero motion: text-first, no video or canvas in the hero. Two CTA buttons, gradient/solid light background. Static layout, scroll-driven product screenshots below.
- Voice: "AI automation, governed" / "Your tools. Your rules. Any AI." — institutional-confident, governance framing, not casual.
- Stock vs custom: custom product screenshots and workflow diagrams; licensed partner logos (NVIDIA, Airbnb, Meta); professional customer photography. No stock illustration.
- Page-to-page: not separately verified this pass.

### make.com
- Palette: white background, charcoal/dark-gray text, teal/cyan blue accents. Light-default. No explicit hex exposed.
- Type: clean contemporary sans (Next.js font pipeline; likely Inter or a brand variant). Same family across headline/body.
- Hero motion: static composite — text hero plus a logo strip below. No video, no canvas. Minimalist, typography-first.
- Voice: "The visual AI automation platform" / "Connect any app, data source, or AI model. Build and manage automations and AI agents — visually, in code, or with a prompt." Capability-led, action verbs ("Connect, Build, Scale"), confident but not hyped.
- Stock vs custom: custom iconography and product screenshots; legitimate partner logos (BambooHR, Salesforce). Enterprise-grade, not stock.
- Page-to-page: not separately verified this pass.

### tines.com
- Palette: light-default. Dark navy/charcoal text (#1B1F23-range), bright blue (#4E8FD0), orange (#F4873F), green (#25A871) as data-flow accents. Multi-accent system, not single-color.
- Type: modern geometric sans, same family headline + body. Likely custom brand stack.
- Hero motion: SVG-based animated node network — pulsing gradient orbs connected by curved lines. Workflow-as-illustration. Medium scale, not full-bleed; lively but tasteful, not "robotic."
- Voice: "The intelligent workflow platform" / "Securely scale AI and automation. Integrate agents, teams, and tools with speed and control." Trust-and-control register; CTA paired with "Unmatched time to value."
- Stock vs custom: fully custom — proprietary SVG illustrations, real product screenshots (Cases, Storyboard, Workbench), partner logo grid.
- Page-to-page: not separately verified this pass. Reputation: design-led across the site.

### workato.com
- Palette: white background (light-default), near-black text (#111010 spotted in inline SVGs), blue CTAs. Multi-color brand logos (Salesforce, Slack) as accents on the page.
- Type: modern clean sans; hierarchical scale for headers vs body.
- Hero motion: static layout with a rotating logo carousel (Claude/OpenAI/Copilot horizontal scroll). Full-width banner, product imagery below. Motion is constrained to the carousel.
- Voice: "Light up your AI with Workato Enterprise MCP" / "The enterprise context, trust, and accuracy you need to make AI work. Built on the #1 iPaaS." Enterprise-confident with one lightweight verb ("Light up") for warmth.
- Stock vs custom: custom — Genie product previews, branded dashboards.
- Page-to-page: not separately verified this pass.

### uipath.com
- Palette: black (#000000) primary background, white text. DARK-default. Blue accents for CTAs.
- Type: custom proprietary sans for headlines; clean system sans body.
- Hero motion: video / animated canvas background, parallax on scroll, custom motion graphics around "coding agents" visuals. Full-bleed, robotic feel YES, large scale.
- Voice: "Introducing UiPath for Coding Agents" / "As coding agents and AI models multiply, UiPath is the reliable layer where more of what gets built actually reaches production." Plus campaign line "Agents think, robots do, people lead." Professional-aspirational, RPA register.
- Stock vs custom: mix — custom 3D renderings for product; licensed Getty for testimonial backdrops; real customer brand photography (WEX, AGS, HUB); illustrated icons for features.
- Page-to-page: not separately verified this pass.

### n8n.io
- Palette: near-black background (~#0A0A0A), white text, purple/lavender accents. DARK-default with optional light mode. Stars-SVG decoration.
- Type: modern sans-serif (system stack vibe — likely -apple-system/Inter range). Same family headline + body.
- Hero motion: static `hero-bg.webp` with decorative SVGs (stars-bg, stars-wide-bar); animated integration-logo carousel. No full video. Medium scale.
- Voice: "AI agents and workflows you can see and control" / "Build visually, go deep with code, connect to anything. Every step of your agents' reasoning, traceable on the canvas. Deploy on your infrastructure or ours." Direct, developer-confident, metric-backed (188k GitHub stars, 4.9/5 G2).
- Stock vs custom: custom product screenshots + canvas demos; styled customer photos; official partner logos (Meta, Microsoft, Wayfair).
- Page-to-page: not separately verified this pass.

### tray.ai (redirect from tray.io)
- Palette: deep navy/dark blue (#0A0A0A, #1B1F23), cyan/electric blue accents (#3689FF, #4D6BFE), warm gold/amber highlights (#F6C013, #FCA326). DARK-default with high-contrast accents.
- Type: modern geometric sans, system stack (-apple-system, Segoe UI).
- Hero motion: static product-screenshot composite (Agent Gateway dashboard with live MCP metrics). Subtle fade-in only; no autoplay video. Medium scale.
- Voice: "Enterprise orchestration for data and AI." / "Build AI agents, govern MCP, integrate 700+ apps, and automate with AI. Stop wrangling AI. Start orchestrating it." Commanding, contrast-verb framing ("Stop X, Start Y").
- Stock vs custom: fully custom product screenshots + 30+ recognizable brand logos. No lifestyle photography.
- Page-to-page: not separately verified this pass.

### relay.app
- Palette: not exposed in fetched payload — content was thin. Assume light-default per category norm; UNVERIFIED.
- Type: not exposed.
- Hero motion: "WATCH / See Relay.app in action" copy implies a video module in or near the hero; UNVERIFIED visual.
- Voice: "The easiest way to automate with AI" / "Relay.app turns plain language into reliable, visual workflows across over 200+ apps." Plus user-quote callouts ("LIFE-CHANGING!", "insanely reliable") — much more casual/enthusiastic than the rest of the cohort.
- Stock vs custom: testimonial-driven; visuals UNVERIFIED.
- Page-to-page: not verified.

### pipedream.com
- Palette: not exposed in fetched payload — content was thin. UNVERIFIED.
- Type: not exposed.
- Hero motion: not exposed; thin extraction. UNVERIFIED.
- Voice: "What do you want to automate?" / "Prompt, run, and deploy AI agents in seconds." Plus social proof "Trusted by 1,000,000+ developers." Developer-direct, speed-focused.
- Stock vs custom: integration partner refs only (Supabase, Shopify, Linear, Notion); visuals UNVERIFIED.
- Page-to-page: not verified.

### celonis.com
- Palette: deep blue/navy + white. LIGHT-default. High contrast, dark text on light background. Specific hex not exposed.
- Type: not declared in fetched HTML payload — extraction-limited.
- Hero motion: embedded Wistia explainer video. Standard product demo, no 3D / robotic flourish detected. Medium scale.
- Voice: "Industrialize Enterprise AI." / "Make Enterprise AI work." Pragmatic, outcome-led; the "make X work" formula recurs. Very German B2B: short, certain, no hype.
- Stock vs custom: custom process-mining visuals; partner-supplied customer logos (Fujitsu, Uniper, Standard Bank, PepsiCo). No lifestyle stock.
- Page-to-page: /solutions/ page was lighter, templated hub layout (category grid + descriptions) — UNVERIFIED visual differentiation from home.

### servicenow.com
- Palette: UNVERIFIED — homepage returned 403. Brand norm: white background, dark text, electric green (~#62D84E) as historical brand accent. Light-default per brand book.
- Type: ServiceNow brand sans (not directly fetched).
- Hero motion: UNVERIFIED. Brand pattern is large hero video + scroll-driven scenes.
- Voice (from press + page titles): "Put AI to Work" (homepage title, verified) + 2026 campaign phrasing "Enterprises need AI that senses, decides, and securely acts." Institutional, governance-heavy, Knowledge 2026 enterprise tone.
- Stock vs custom: brand norm = custom motion + customer brand photography.
- Page-to-page: not verified this pass.

### boomi.com
- Palette: light-default home with dark navy nav/footer; bright magenta/neon-pink accents (Sparkle CTAs and quote icons). High-polish, not muted.
- Type: modern sans-serif system stack; bold large headlines for hierarchy.
- Hero motion: animated neon graphic (`boomi-creations-neon-graphic.png`), glowing aesthetic; multiple carousels announcing product launches. Motion-forward but not full canvas.
- Voice: "The Data Activation Company." / "Boomi brings data to life. By integrating and governing data across your entire business, we power everything from AI to BI." Confident, "infrastructure layer" framing.
- Stock vs custom: custom (pyramid stacks, cubes, controller icons, dashboard mockups) plus professional B2B testimonial photography.
- Page-to-page: /products/agentstudio/ archive page was highly templated — pure navigation hub, icon-only, no hero. Marketing-detail vs nav-hub gap is wide.

### mulesoft.com
- Palette: UNVERIFIED — homepage returned 403. Brand norm: white background, navy and blue accents. Light-default per Salesforce-family brand system.
- Type: Salesforce brand sans (Salesforce Sans family) — UNVERIFIED on this fetch.
- Hero motion: UNVERIFIED. Brand norm = static composite with product-screenshot canvas.
- Voice (from page title + ecosystem references): "Integration And Automation For The AI Era" — enterprise-confident, era-framing, AI-front. Plus the 2026 agentic-trends report angle for credibility.
- Stock vs custom: brand norm = custom product visuals + Salesforce-family illustration system.
- Page-to-page: not verified this pass.

### sap.com
- Palette: UNVERIFIED — fetch returned 403. Brand norm: SAP Blue (#0070F2 / #003D8F) primary, white background, blue and gold accents. Light-default.
- Type: SAP brand stack (SAP-72 / "72 Brand Type"). UNVERIFIED on this fetch.
- Hero motion: UNVERIFIED — brand norm = large hero video plus carousels.
- Voice (from press 2026): "SAP Unveils the Autonomous Enterprise" / Joule Work / "where agents run the business." Plus partnership phrasing "Claude on SAP Business AI Platform." Institutional, agentic-era, very German-corporate-confident.
- Stock vs custom: brand norm = custom photography + commissioned illustration.
- Page-to-page: not verified.

### personio.com
- Palette: UNVERIFIED — fetch returned 429. Brand norm: white background, near-black text, vivid blue + warm coral accents. Light-default.
- Type: Personio uses GT Walsheim / similar humanist geometric (UNVERIFIED on this fetch).
- Hero motion: UNVERIFIED.
- Voice (from search-verified page title + LinkedIn): "Championing every side of HR's evolution" plus "The Intelligent HR Platform" plus "Whether you have a team of 50 or 5000 — we'll help you manage your HR processes, stay compliant, and make meaningful business decisions." DACH-SMB pragmatic, no Silicon-Valley energy.
- Stock vs custom: brand norm = custom photography of real customer employees, not stock.
- Page-to-page: not verified.

### hetzner.com
- Palette: white background (LIGHT-default), dark gray/charcoal text, signature Hetzner red accent. No dark mode.
- Type: not declared — system sans-serif throughout; no custom font load detected. This is the most aggressively un-styled brand in the cohort, deliberately.
- Hero motion: NONE. Static product photograph (EX131 dedicated server) with text overlay and a "Scroll Down" indicator. Catalog/showroom aesthetic.
- Voice: "Dedicated Servers EX-Line / Ex131: a whole new performance class / With an exceptionally large leap over the previous generation, the EX131 unlocks significantly more Intel® power for databases and virtualization." Plus retail urgency: "Prices drop & excitement mounts. Snap up your offer." Tech-direct, hardware-spec, zero AI-era flourish. This is the German B2B baseline.
- Stock vs custom: custom product photography of actual hardware; flat SVG icons for service categories.
- Page-to-page: not verified — but brand is famously consistent (catalog-grid pages throughout).

### bosch.com
- Palette: white/near-white background (#FFFFFF), dark charcoal text (~#333). LIGHT-default. No dark mode visible.
- Type: not declared in markup; brand norm is "Bosch Sans" custom corporate type.
- Hero motion: static imagery with carousel slider. Annual report imagery (work / mobility / warehouses), e-bike touring photography. Carousel rotation only; no canvas/video flourish in hero.
- Voice: tagline "Invented for life." Campaign headlines "For tomorrow. Today." / "What do people expect from innovation?" / "Exploring by e-bike." Corporate-aspirational, calm, multi-business-line.
- Stock vs custom: 100% custom photography — employees, products, scenarios. No stock.
- Page-to-page: not verified this pass.

---

## Cross-site consensus

### Category palette consensus

**Light-default DOMINATES this category.** Of 17 sites, the homepages I could verify break down as:

| Light-default (confirmed) | Dark-default (confirmed) | Unverified (403/429/thin) |
|---|---|---|
| zapier, make, tines, workato, celonis, boomi, hetzner, bosch | uipath, n8n, tray.ai | relay, pipedream, servicenow*, mulesoft*, sap*, personio* |

*Brand norm for the unverified four (ServiceNow, MuleSoft, SAP, Personio) is LIGHT-default per public brand guidelines. So the realistic count is ~12 light vs 3 dark.

**The "automation SaaS = dark theme + electric mint" assumption is REJECTED by the data.** Dark-default is the minority and belongs almost exclusively to developer-positioned products (n8n, tray.ai, uipath's RPA-cinematic register). The enterprise-trust, DACH-relevant, SMB-buyer-facing leaders (zapier, make, celonis, personio brand norm, sap brand norm, hetzner, bosch) are all LIGHT-default.

**Accent range:** teal/cyan recurs (zapier, make, tray.ai-blue), brand-magenta is a Boomi distinctive, brand-red is Hetzner's wall, SAP-blue is the institutional DACH baseline, navy + white is the universal safe register. Multi-accent data-flow palettes (tines: blue/orange/green/navy) are a recognised "premium serious workflow" signal.

**Recommendation for OpSolid:** light-default with one disciplined warm accent (copper per existing palette memory) reads as serious DACH B2B — not as a contrarian choice. Copper specifically separates from the saturated teal/blue herd without sliding into n8n purple or uipath black.

### Category typography consensus

**Geometric / humanist sans monoculture across the board.** Recurring patterns:

- Brand-owned sans for the budget-rich (UiPath, Bosch Sans, SAP-72) — costly but signals adulthood.
- Inter / Söhne / GT Walsheim family for the design-led (Tines, Personio, modern SaaS norm). Personio specifically reads as GT Walsheim or close.
- System stacks (`-apple-system`, Segoe UI) for the deliberately-utilitarian (Hetzner, n8n, tray.ai).
- Same-family headline + body is the default. Single-typeface pages.
- **No serif moments found in this cohort.** Not Celonis, not SAP-norm, not Personio-norm, not even Bosch. Serif would be a strong contrarian signal — and would risk reading as legal-firm/luxury rather than industrial-confident.

**Recommendation:** stay in geometric sans territory. A subtle editorial serif accent (one or two display words in hero) would differentiate without breaking category register. Don't go full serif — none of the leaders do.

### Voice / tone consensus

Three registers exist in this cohort. Quoting verbatim:

**A. Institutional / process-confident (the DACH register):**
1. "Industrialize Enterprise AI. Make Enterprise AI work." — celonis.com
2. "Integration And Automation For The AI Era" — mulesoft.com
3. "SAP Unveils the Autonomous Enterprise" / "where agents run the business" — sap.com/sapphire-2026
4. "Championing every side of HR's evolution" / "The Intelligent HR Platform" — personio.com
5. "Put AI to Work" — servicenow.com
6. "Enterprise orchestration for data and AI. Stop wrangling AI. Start orchestrating it." — tray.ai
7. "The intelligent workflow platform. Securely scale AI and automation." — tines.com

**B. Capability / build-led (mid-register):**
- "The visual AI automation platform" — make.com
- "AI automation, governed. Your tools. Your rules. Any AI." — zapier.com
- "AI agents and workflows you can see and control" — n8n.io
- "The Data Activation Company." — boomi.com

**C. Casual / get-started-bro (minority):**
- "The easiest way to automate with AI" + "LIFE-CHANGING!" — relay.app
- "What do you want to automate?" — pipedream.com

The DACH/SMB-leader register is overwhelmingly A and B. The bro register (C) is the minority and belongs to consumer-developer products. **OpSolid should write in register A.** Strong nouns, short certain claims, no exclamation marks, no rhetorical questions.

### Background motion consensus

**Most leaders are STATIC-with-microinteractions, not lively animated backgrounds.** Of the verified 13: nine are static or static-with-carousel (zapier, make, workato, n8n, tray.ai, celonis-Wistia-video, boomi-PNG, hetzner, bosch). Only three carry actual lively visual systems: **UiPath** (full-bleed parallax + motion graphics, robotic register), **Tines** (animated SVG node network with pulsing orbs and curved connectors), and **Boomi** (neon glow + carousel sequence). UiPath is the biggest, Tines the most tastefully executed, Boomi the loudest.

So a large robotic background animation is a CONTRARIAN move in this category, not the norm. The DACH-trust leaders (Celonis, Hetzner, Bosch, brand-norm SAP/Personio) deliberately avoid motion in the hero. **Recommendation: take Tines as the ceiling — SVG-illustrated workflow lattice with restrained motion — not UiPath cinematic, not Hetzner-flat.**

### Stock-asset usage

**Custom dominates. Stock photography is rare and used only as backdrop for testimonials.** Pattern:

- Fully custom (illustration + product screenshots + own photography): Tines, Make, Workato, Boomi, Bosch.
- Custom illustration + licensed Getty for testimonial frames: UiPath (most explicit Getty use).
- Custom product visuals + partner-supplied customer brand photography: Celonis, Zapier, n8n, tray.ai, Personio (brand norm).
- Custom hardware product photography: Hetzner.
- No site in the cohort relies on stock-illustration aesthetics ("Storyset / unDraw" style). That look reads as bootstrap-SaaS, not DACH-enterprise.

**Recommendation for OpSolid:** custom SVG illustrations + real product screenshots + (when you have one) real founder/team photography. No Storyset. No Lottie "robot waves" stock packs. The audit confirms this is non-negotiable for the register.

---

## Bottom line for OpSolid

1. **Light-default is correct and category-aligned** — not a brave bet, it's the DACH-enterprise norm. The "automation site = dark" assumption is broken by the data: Zapier, Make, Celonis, Hetzner, Bosch, SAP-norm, Personio-norm all run light.
2. **Single-family geometric sans, optional one-word editorial accent.** Match Personio / Tines tier, not Hetzner-system-stack tier.
3. **Register A voice.** Short nouns, certain verbs, no exclamations. "Industrialize Enterprise AI" / "Put AI to Work" / "The intelligent workflow platform" are the targets. NOT "the easiest way to automate" or "LIFE-CHANGING!".
4. **Restrained hero motion.** Tines-style SVG lattice is the ceiling; static-with-microinteractions is the median. A large robotic animation is contrarian in this category — if used, it must be defensible by execution quality (Tines tier), not novelty.
5. **Custom illustration + real product screenshots only.** No stock. No Storyset.

### Fetch reliability notes
- Direct fetch failed (403/429/404 or thin extraction) for: servicenow.com, mulesoft.com, sap.com, personio.com, relay.app, pipedream.com, celonis /process-intelligence-platform/. For the four enterprise leaders, voice was reconstructed from page titles + verified press releases + brand norms; palette/font/motion are flagged UNVERIFIED. web.archive.org is blocked from this environment, so historical snapshots were not available as fallback. Recommend a live browser-screenshot pass on those six before any final design decision is committed.
