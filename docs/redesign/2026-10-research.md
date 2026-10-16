# OpSolid redesign research (2026-10-16)

Method notes: all sites below returned HTTP 200 on 2026-10-16 (curl). Award data is read from awwwards.com's Site-of-the-Day archive pages (single Awwwards pages returned 503). CSSDA, FWA and Webby could not be fetched, so none is claimed. Google PageSpeed quota was exhausted, so no lab CWV were measured; "HTML" sizes are raw document weight only. Awwwards Site of the Year 2025 (Lando Norris, Messenger) are WebGL showpieces, deliberately not used as references.

## 1. Reference sites

1. **Eduard Bodak**, https://www.eduardbodak.com. Awwwards SOTD, Jun 14 2025. Solo designer/developer in Cologne, DE/EN. Borrow: bilingual switch; a three-service split (Design / Development / Motion); one-sentence value line ("Crafting Websites that Feel Good"); case cards with a plain "View" link. HTML 98 KB.
2. **Cerebrium**, https://cerebrium.ai. SOTD, Sep 10 2026 (Louis Paquet). B2B AI infrastructure. Borrow: neutral grotesk plus mono labels (font files show Suisse Intl, ABC Favorit, Suisse Intl Mono); logo row directly under the hero; industry grid linking to case studies; paired CTAs ("Try it now" / "Book a demo"). HTML 473 KB, so take structure only.
3. **Heron AI**, https://heronaiapp.com. SOTD and Developer Award, Oct 12 2026 (Bearplus). B2B AI agent for architects. Borrow: problem-first section titles ("Your design tools do what you tell them, nothing more"); the product shown in its real context; one soft CTA ("Contact us"). Motion weight not checked; use it for narrative only.
4. **twks**, https://twks.ch/en. SOTD, Oct 7 2026. Independent Geneva agency. Borrow: hero that states what and where in five words; four case cards (client name plus one-line tagline); no invented metrics or logos; GT Standard in three weights only. HTML 185 KB.
5. **Turn.io**, https://www.turn.io. SOTD, Jun 7 2025 (O0). B2B WhatsApp automation. Borrow: use-case section titles ("Every patient touchpoint in one conversation") and the "Real results from real teams" block layout. OpSolid has no testimonials yet, so swap that block for sample deliverables. Heavy (968 KB).
6. **simonholm.studio**, https://www.simonholm.studio. SOTD, May 9 2026. Solo brand designer. Borrow: numbered index ("Featured 05 / Index 05"); minimal nav (About, email, phone). HTML 81 KB.
7. **digitalists**, https://digitalists.at. SOTD, Jun 21 2026. Web studio in Eisenstadt (AT), German copy. Borrow: numbered case cards ("CS 01") with client and service tags; "call now" and "request" CTAs, which fit DACH buyers; question-style headings. Avoid its "wir" voice.
8. **Aino**, https://aino.agency. SOTD, May 20 2026. Scandinavian design and tech agency. Borrow: extreme lightness (24 KB HTML), work grid first, three CTAs only.
9. **Get Hyped**, https://www.gethyped.nl. SOTD, Oct 26 2025 (Dylan Brouwer). Dutch content agency. Borrow: outcome-style case headlines and counters, but only with real numbers.
10. **Linear**, https://linear.app. Award unconfirmed. Borrow: Inter Variable at one weight scale; typographic restraint; a public changelog as honest proof of activity (OpSolid: a dated build log).
11. **Resend**, https://resend.com. Award unconfirmed. Borrow: link-only customer index (no fake logo wall); serves Markdown when sent `Accept: text/markdown` (observed with curl, plus llms.txt).

## 2. Design principles

- Say who, what and where in the first line (twks): "Independent AI & automation practice, Arnsberg." One primary CTA (book the KI-Check), one secondary.
- Proof is artifacts, not metrics: a sample KI-Check plan structure, live products (OpSo, Kutasia), a dated build log. No logos or quotes until real.
- Type does the branding: at most 2 families, variable, subsetted; mono only for small labels. Fewer font files means faster LCP.
- Numbered indexes (01-05) for offers and work; they read as honest and scannable.
- Answer-first sections: each H2 opens with a 1-2 sentence answer. This helps readers and AI citation.
- First-person, named, local: Hasan's photo, Arnsberg, languages spoken, direct booking. Specificity (scope, duration, price if public) builds trust.
- Motion restraint: opacity/transform only, 200-400 ms, once per element, `prefers-reduced-motion` honoured; no scroll-jacking, WebGL or above-the-fold video.
- Performance is a design constraint: LCP element is text, first-load JS budget about 150 KB, ship only the active locale's strings to the client.
- WCAG 2.2 AA by construction: copper #C27940 is 3.44:1 on white and 4.4:1 on #262626 (fails for body text), but 5.35:1 on #141414. Use a darker "copper-ink" (#A8622B = 4.72:1, #8F4F1E = 6.35:1 on white) for text on light, and dark text on copper buttons. Also: targets at least 24 px (2.5.8), `scroll-margin-top` under sticky headers (2.4.11), `lang="tr"` for correct İ casing.
- Consistency across three locales: same structure, localized slugs, no machine-feel translations.

## 3. Two directions

**A. "Werkbank" (workbench)**
- Concept: calm technical notebook. Graphite-first with a light theme, numbered offer index, the KI-Check as the single hero action.
- Type: Geist variable (display and body) plus Geist Mono for meta labels; Instrument Serif italic for one accent word per page. Drops Inter and JetBrains Mono (4 families to 2). All have latin-ext for ä ö ü ß ğ ş İ ı.
- Color: graphite surfaces; copper only for rules, fills and one link style; copper-ink for text on light.
- Hero: left-aligned plain statement, "KI-Check buchen" (Cal.com) plus text link "Leistungen"; right side a static card labelled "Beispielstruktur" showing the KI-Check output sections.
- Motion: single reveal (fade and 8 px rise), underline slide on links, nothing else.
- Order: Hero, KI-Check (scope, time, deliverable, book), Leistungen index 01-04, KI-Schulungen (3 fixed offers), Eigene Produkte (OpSo, Kutasia), Ablauf (3 steps), Über Hasan, FAQ (visible), Kontakt.

**B. "Dossier" (editorial)**
- Concept: reads like a well-edited briefing. Trust comes from writing and clarity.
- Type: Newsreader (variable, opsz) for headlines and lede plus Inter Tight for UI and body. No mono.
- Color: warm paper #FAF8F5, ink #1A1A1A, copper-ink #8F4F1E (5.99:1) for links and rules; dark theme uses #E0A070 on #141414 (8.27:1).
- Hero: 700 px measure, large serif H1, 2-sentence lede, text-style CTA; a contents rail on desktop.
- Motion: none beyond hover/focus; optional cross-fade view transition on navigation (progressive enhancement).
- Order: Lede, So läuft der KI-Check (article-style steps), Typische Ausgangslagen (generic, labelled as typical, not clients), Leistungen, Schulungen, Werkstattberichte (OpSo, Kutasia), Notizen (latest 3 posts), Über mich, FAQ, Kontakt.

Both: hero text is the LCP element, one preloaded font file, `next/image` only below the fold, static generation per locale.

## 4. Technical SEO checklist 2026 (Next.js 14)

Observed on live opsolid.de today (curl): `<title>` ends "| OpSolid | OpSolid" (template plus manual suffix); `/` returns 307 to `/en` even with `Accept-Language: de`, while x-default is `/de`; FAQPage JSON-LD present; English URLs use German slugs (`/en/ki-beratung`).

- **hreflang** (documented): self-reference plus all alternates, reciprocal, absolute URLs, language-only codes (`de`, `en`, `tr`) are fine. x-default is the fallback for unmatched users. HTML tags, headers and sitemap are equivalent; use one method or keep them identical. Keep `x-default` = `/de` (a 200 page).
- **Canonical:** self-canonical per locale page, via `alternates.canonical` with `metadataBase: new URL('https://opsolid.de')`.
- **Root redirect:** Google advises against auto-redirecting by perceived language and says to offer visible switch links. If `/` must redirect, use 307 (never 301/308, browsers cache the first language), same logic for every client, order cookie then Accept-Language then `de`. `/de`, `/en` and `/tr` never redirect. Fix the current `/en` default.
- **Metadata API:** `title: {default, template: '%s | OpSolid'}` (no manual suffix), `generateMetadata` per page, `alternates.languages` including `'x-default'`, `openGraph.locale` and `alternateLocale`, `viewport` export for theme colour, file-based `opengraph-image` per locale.
- **Sitemap:** `app/sitemap.ts` with `alternates.languages` per entry (supported since Next 14.2). Real `lastModified` only; Google ignores `priority` and `changefreq`.
- **CWV** (documented, p75): LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1. Project target: LCP under 2.0 s lab-mobile. Server Components by default; client islands only for theme toggle, nav and booking; defer analytics; avoid long tasks over 50 ms.
- **Images, fonts, video:** `next/image` with width/height and `sizes`, `priority` only on the LCP image, AVIF/WebP; `next/font` self-hosted, latin plus latin-ext, `display: swap`; video only below the fold, `preload="none"` with poster, or a youtube-nocookie facade.
- **Structured data** (JSON-LD, one `@graph`, stable `@id`s):
  - `ProfessionalService`: name, legalName, url, logo (at least 112 px), description, address (Arnsberg, DE), areaServed, telephone, email, sameAs (owned profiles only), founder.
  - `Person` (Hasan Dönmez): name, jobTitle, image, url, worksFor, sameAs, knowsAbout, knowsLanguage; add `ProfilePage` on the about page.
  - `Service` per offer: name, description, provider, serviceType, areaServed, `offers` only with a real published price. No Google rich result exists for it.
  - `WebSite`: name, url, alternateName. `BreadcrumbList` (position, name, item) on inner pages, matching a visible breadcrumb. Blog: `BlogPosting` with author, datePublished, dateModified.
  - `FAQPage`: Google retired FAQ rich results on 7 May 2026 and still reads the markup, so keep it only where Q&A is visible; low priority.

## 5. GEO / AI-search checklist 2026

**Documented**
- Google: no special optimization, files or schema needed for AI Overviews or AI Mode; the page must be indexed and snippet-eligible; limit with nosnippet / max-snippet.
- Bots: OAI-SearchBot (ChatGPT search); GPTBot (training); ChatGPT-User and Perplexity-User (user-triggered, robots.txt may not apply); ClaudeBot (training), Claude-SearchBot (search index), Claude-User (user fetch), all honouring robots.txt; PerplexityBot (search, not training); Google-Extended (Gemini training and grounding, no effect on Search); Applebot-Extended (training only, no effect on Siri/Spotlight).
- **Recommendation:** allow all of them. The site is public marketing copy with nothing to protect, and retrieval bots are how AI answers cite you. Keep the Disallow rules for private paths only. Training-bot opt-out is a legitimate alternative; it costs little in visibility. robots.txt is not security.
- llms.txt: format per llmstxt.org (H1, blockquote, H2 link lists). Ahrefs (137K domains, May 2026): 97% of files got zero requests, and the authors conclude "the cons outweigh the pros right now." Keep the existing short file current (it already carries the TopSolid disambiguation) and link it from the footer. `llms-full.txt` has no documented consumer; skip unless generated for free at build time.

**Speculative or weakly evidenced**
- Entity consistency: one spelling "OpSolid" everywhere (site, Impressum, LinkedIn, Cal.com, GitHub); `sameAs` to owned profiles; `disambiguatingDescription` plus one visible line "OpSolid is not TopSolid (CAD/CAM)" on the about page. No Wikidata entry unless notable.
- Answer-first blocks: H2 as a real question, 40-60 word direct answer, then detail; facts in tables (scope, duration, deliverable, price, booking); visible "Stand: Oktober 2026". The Princeton GEO study (KDD 2024) reports visibility gains of up to about 40% from citations, quotes and statistics (secondary figures, single benchmark). Cite primary sources, never invent numbers.
- E-E-A-T for a solo founder: named byline, photo, bio, location, working languages, Impressum and phone; real project write-ups (OpSo, Kutasia); `author` linked to the Person `@id`.
- Citation-friendly pages: one topic per URL, server-rendered text (not images), stable anchors on H2s, short quotable sentences, correct `dateModified`, all three locales cross-linked.
- Markdown for agents: resend.com, vercel.com and cal.com serve Markdown on `Accept: text/markdown` (observed); Cloudflare shipped "Markdown for Agents" in Feb 2026. Reported cloaking concerns, so keep it identical to the HTML. Optional, low value.
- Measure: server logs for AI user agents; register Bing Webmaster Tools (its AI Performance report, public preview Feb 2026 per secondary sources, shows Copilot citations and grounding queries); IndexNow for Bing.

## 6. Sources (abridged)
Awwwards SOTD archive pages; developers.google.com (localized-versions, managing-multi-regional-sites, faqpage, organization, site-names, ai-features, google-common-crawlers); web.dev/articles/vitals; nextjs.org (generate-metadata, sitemap); developers.openai.com/api/docs/bots; support.claude.com (crawler); docs.perplexity.ai/guides/bots; support.apple.com/en-us/119829; llmstxt.org; ahrefs.com/blog/llmstxt-study; developers.cloudflare.com changelog 2026-02-12; arxiv.org/abs/2311.09735.

## 7. Addendum (2026-10-16): scroll-driven 3D / WebGL references

Direction change from the owner: scroll-driven 3D that is effective and not generic, since OpSolid will sell and rent websites and ship voice/video 3D AI agents. Method: three standard web searches only. The results were thin: they confirmed Active Theory (v4, Awwwards Site of the Month, Jan 2018) and Lusion (first studio site, Site of the Month, May), and otherwise returned Awwwards inspiration pages and opinion pieces. The remaining entries come from the earlier research pass (SOTD/SOTY lists read on 2026-10-16) and general knowledge; their traits are **not re-verified in this pass**. Open each site once on a real device before copying any technique.

1. **Lando Norris** (Awwwards Site of the Year 2025, per the earlier pass). Borrow: a single strong brand object and bold type carrying a long scroll story. Do not copy: its weight; it is a showpiece.
2. **Messenger** (Site of the Year 2025, per the earlier pass). Borrow: scene changes that follow the narrative beats instead of decorating them. Check its mobile behaviour first.
3. **Igloo Inc.** Borrow: one hero object that holds the brand and a dark, calm palette. Not verified in this pass.
4. **Lusion** (verified: Site of the Month, May). A small studio focused on real-time animation. Borrow: real-time 3D as the brand signature; keep the interaction restrained enough to read the text.
5. **Active Theory** (verified: v4 Site of the Month, Jan 2018). Borrow: one continuous world instead of separate page blocks. Their sites are heavy; we ship one object, not a world.
6. **Bruno Simon portfolio.** Borrow: personality from one original 3D idea. Not verified in this pass.

Practical guidance from the search results (vendor and community sources, not official docs): animate only transform and opacity, keep real text in HTML, load 3D lazily near or after first paint, pause the render loop when hidden, choose quality by device tier, and ship a static fallback. The prototype implements all of these.

What we take: one original object (a stack of seven plates, one per offering) that re-forms per section; HTML text first; 3D after load; poster fallback for no WebGL and `prefers-reduced-motion`; a lighter scene on phones.
