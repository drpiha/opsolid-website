// =============================================================================
// ENGLISH CONTENT
// Duplicate this file as de.ts / tr.ts to add new languages.
// Keep the object structure identical across all language files.
// =============================================================================

export const content = {








  notFound: {
    title: "Page not found",
    description:
      "The page you are looking for does not exist or has been moved.",
    backHome: "Back to Home",
    contactUs: "Contact Us",
  },

  impressum: {
    title: "Legal Notice",
    notice:
      "OpSolid is the sole proprietorship (Einzelunternehmen) of Hasan Dönmez, based in Arnsberg, Germany.",
    sections: {
      according: "According to § 5 DDG (Digital Services Act, formerly § 5 TMG)",
      representedBy: "Represented by",
      contact: "Contact",
      phone: "Phone: On request",
      register: "Trade Register",
      registerText:
        "OpSolid is a sole proprietorship (Einzelunternehmen) and is not entered in the commercial register (Handelsregister); no such entry is required for this legal form.",
      vatId: "VAT ID / Wirtschafts-Identifikationsnummer (W-IdNr)",
      vatIdText:
        "VAT identification number according to § 27a German VAT Act (USt-IdNr.): DE462227107",
      responsibleContent:
        "Responsible for content according to § 18 Abs. 2 MStV (Medienstaatsvertrag, formerly § 55 RStV)",
      disputeResolution: "Online Dispute Resolution",
      disputeResolutionText:
        "The European Commission provides a platform for online dispute resolution (ODR): https://ec.europa.eu/consumers/odr/. You can find our email address above. We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.",
      liabilityContent: "Liability for Content",
      liabilityContentText:
        "As a service provider, we are responsible for our own content on these pages under general laws in accordance with § 7 Para. 1 DDG. According to §§ 8 to 10 DDG, however, we are not obligated to monitor transmitted or stored third-party information.",
      liabilityLinks: "Liability for Links",
      liabilityLinksText:
        "Our website contains links to external third-party websites over whose content we have no influence. The respective provider or operator is always responsible for the content of the linked pages.",
      address: "Full postal address will be added upon Gewerbeanmeldung.",
    },
  },

  privacy: {
    title: "Privacy Policy",
    subtitle: "Datenschutzerklärung · Aydınlatma Metni",
    notice:
      "This is a self-prepared privacy notice covering GDPR (EU) and KVKK (Türkiye) for the OpSolid marketing site and the OpSo Smart Digital Business Card product. A lawyer-reviewed final version will replace this notice after Gewerbeanmeldung. Last review by Hasan Dönmez.",
    lastUpdated: "Last updated: May 2026",
    sections: [
      {
        title: "1. Data Protection at a Glance",
        content:
          "The following provides an overview of what happens to your personal data when you visit this website or use the OpSo Smart Digital Business Card product. Personal data is any data that can identify you. Two legal frameworks apply in parallel: the EU General Data Protection Regulation (GDPR / DSGVO) and the Turkish Personal Data Protection Law (KVKK, Law No. 6698).",
      },
      {
        title: "2. Responsible Party / Veri Sorumlusu",
        isResponsible: "true",
      },
      {
        title: "3. Data Collection",
        subsections: [
          {
            title: "Contact Form",
            content:
              "Data submitted via the contact form (name, work email, company, message, optional phone) is stored for processing the inquiry and follow-up. Legal basis: Art. 6(1)(b) GDPR for contract-related inquiries, Art. 6(1)(f) GDPR for legitimate interest, or Art. 6(1)(a) GDPR if consent was given. KVKK basis: Art. 5(2)(c) (sözleşme ifası) or Art. 5(1) açık rıza.",
          },
          {
            title: "Server Log Files",
            content:
              "The hosting provider automatically collects browser type, OS, referrer URL, hostname, IP address (truncated where possible), and request time. Retention: 14 days for security/abuse analysis, then deleted. Legal basis: Art. 6(1)(f) GDPR (legitimate interest in operational security).",
          },
          {
            title: "Cookie Consent Log",
            content:
              "When you make a cookie banner choice (accept / reject), we store the choice plus a timestamp in your browser's localStorage. We do not transmit your IP for this consent record. You can revoke or change the choice at any time via the page footer link. Legal basis: Art. 6(1)(c) GDPR (legal obligation under § 25 TDDDG to document consent).",
          },
        ],
      },
      {
        title: "4. Hosting",
        content:
          "The marketing site, the OpSo Smart Digital Business Card application backend, and the Postgres database all run on a single self-managed Hostinger VPS (Hostinger International Ltd., AS47583), physically located in Vilnius, Lithuania (EU). Server hostname: srv1150632.hstgr.cloud. All visitor traffic, card data, customer records and database backups remain on EU territory. The DPA (AVV under Art. 28 GDPR) with Hostinger is on file.",
      },
      {
        title: "5. Cookies & Analytics",
        subsections: [
          {
            title: "Strictly necessary",
            content:
              "Language preference and cookie consent state are stored in your browser's localStorage. These are strictly necessary for the site to function and do not require consent under § 25(2) TDDDG.",
          },
          {
            title: "Optional analytics",
            content:
              "If you accept analytics in the cookie banner, aggregated, anonymous page-view counts may be collected. The collection is cookieless, contains no personal identifiers, and cannot identify individual visitors. If you reject, no analytics call is made and no data leaves the Hostinger Vilnius server.",
          },
          {
            title: "No third-party tracking, ads, or social plugins",
            content:
              "No advertising cookies, no third-party tracking pixels, no social-network plugins, no fingerprinting. Fonts are self-hosted (no Google Fonts CDN call).",
          },
        ],
      },
      {
        title: "6. Sub-Processors",
        content:
          "We engage the following sub-processors to deliver the service. AVV / DPA agreements per Art. 28 GDPR are on file for each. The current list at any time can be requested via info@opsolid.de.",
        subsections: [
          {
            title: "Hosting & infrastructure",
            content:
              "Hostinger International Ltd. (Lithuania, EU) — single VPS in Vilnius hosting the marketing site, the OpSo Smart application and the Postgres database. No US hosting sub-processor.",
          },
          {
            title: "Email delivery",
            content:
              "SMTP relay used for contact-form notifications. Provider details are listed on request and updated when changed.",
          },
          {
            title: "Payments (OpSo Smart, planned)",
            content:
              "Stripe Payments Europe Ltd. (Ireland) for one-time and subscription billing. Card data is tokenised by Stripe; OpSolid never sees raw PAN. DPA in place via Stripe Services Agreement. International transfer to Stripe US under DPF + SCC.",
          },
          {
            title: "AI providers (where used)",
            content:
              "OpenAI Ireland Ltd. and Anthropic Ireland Ltd. may be engaged via API for production features. DPAs and SCCs in place; user content is not used for model training (API-side opt-out enabled).",
          },
        ],
      },
      {
        title: "7. International Data Transfers",
        content:
          "Where personal data is transferred outside the European Economic Area (e.g. to Vercel, Stripe, OpenAI, Anthropic in the United States), the transfer is based on (a) the EU-US Data Privacy Framework adequacy decision where the recipient is DPF-certified, or (b) Standard Contractual Clauses (SCC, EU 2021/914) with a documented Transfer Impact Assessment. For Türkiye-resident data subjects, KVKK Art. 9 yurtdışı aktarım rules apply: transfers are made under KVKK standard contractual clauses (Yönetmelik 10.07.2024) and notified to the Kurum within 5 business days where required.",
      },
      {
        title: "8. OpSo Smart Digital Business Card Product",
        subsections: [
          {
            title: "Purpose & legal basis",
            content:
              "We process the contact details you submit through the OpSo Smart lead form or self-service order flow (name, work email, company, role, phone (optional), message, photo/logo upload, brand colours, social links) to provide the Digital Business Card service. Legal basis: Art. 6(1)(b) GDPR (contract performance) and Art. 6(1)(a) GDPR (your explicit consent for public publication).",
          },
          {
            title: "Public publication of your card",
            content:
              "When you publish a OpSo Smart card at /c/{slug}, the information you have entered becomes publicly accessible on the internet. This requires your explicit, separate opt-in checkbox at publish time. You can unpublish or delete the card at any time from your account; we will then add a noindex header and request URL removal from major search engines.",
          },
          {
            title: "Third-party content",
            content:
              "You are solely responsible for ensuring you have all rights to any photo, logo, or other content you upload. By uploading you confirm you hold the necessary rights. Notice-and-takedown requests may be sent to info@opsolid.de; we respond within 7 days.",
          },
          {
            title: "Hosting",
            content:
              "Card data and customer records are stored on the Hostinger VPS (Lithuania, EU). No US sub-processors for OpSo Smart card content itself; payment data is processed by Stripe under separate sub-processor terms above.",
          },
          {
            title: "14-day right of withdrawal (B2C)",
            content:
              "If you order OpSo Smart as a consumer (B2C, EU/EEA), you have a 14-day right of withdrawal under § 355 BGB. For digital services to start before the 14 days end, you must explicitly request immediate performance and acknowledge that the right of withdrawal lapses upon full performance — both via separate checkboxes at checkout. We log your acknowledgements for evidence. From 19 June 2026, a one-click withdrawal button is provided.",
          },
          {
            title: "Retention",
            content:
              "Active OpSo Smart cards: retained while the subscription is active. Cancelled / inactive: deleted 90 days after subscription end (a reminder email is sent at day 60). Lead form submissions (no purchase): 24 months. Invoices: retained 10 years per § 257 HGB / Vergi Usul Kanunu (legal obligation).",
          },
          {
            title: "Marketing emails (consent / double opt-in)",
            content:
              "We send marketing email (product news and offers about OpSo Smart) only with your prior express consent (§ 7 UWG, Art. 6(1)(a) GDPR). Consent is given separately from account creation via an unticked checkbox and verified by double opt-in through a confirmation email; we only send marketing email after you confirm. For proof, we log the exact consent wording, a timestamp, and a hashed (never plaintext) IP address. You can withdraw consent at any time with effect for the future — via the unsubscribe link in every email or by emailing info@opsolid.de. Withdrawal does not affect the lawfulness of processing carried out before it.",
          },
          {
            title: "Right to deletion",
            content:
              "You may delete your OpSo Smart card and all associated personal data with one click from your account, or by emailing info@opsolid.de. Deletion is effective within 30 days. Identity verification (email confirmation + 2FA where enabled) is required before destructive actions.",
          },
        ],
      },
      {
        title: "9. Your Rights (GDPR)",
        content:
          "Under Articles 15–22 GDPR you have the right to: access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction (Art. 18), data portability (Art. 20), and to object to processing (Art. 21). You may withdraw any consent at any time without affecting prior processing. To exercise rights, email info@opsolid.de — we respond within one month (Art. 12(3)). You may also lodge a complaint with the supervisory authority of your habitual residence or place of the alleged infringement.",
      },
      {
        title: "10. Your Rights (KVKK Madde 11) — for Türkiye-resident data subjects",
        content:
          "6698 sayılı KVKK m.11 uyarınca: kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içi/yurt dışında aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, KVKK m.7'deki şartlarda silinmesini/yok edilmesini isteme, otomatik sistemlerle yapılan analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme, kanuna aykırı işleme nedeniyle uğradığınız zararın giderilmesini talep etme. Başvuru: info@opsolid.de. KVKK 2026/347 ilke kararı uyarınca aydınlatma metni (bu sayfa) ile açık rıza beyanı ayrı belgelerdir; rıza onayı ürün akışında ayrıca alınır.",
      },
      {
        title: "11. Data Breach Notification",
        content:
          "If a personal data breach is likely to result in a risk to your rights and freedoms, we notify the competent supervisory authority within 72 hours of becoming aware (Art. 33 GDPR). High-risk breaches are also communicated to affected individuals without undue delay (Art. 34 GDPR). Under KVKK we additionally notify the Kurum and affected persons in the shortest reasonable time (KVKK Kurul kararları).",
      },
      {
        title: "12. Changes to this Policy",
        content:
          "We may update this policy to reflect changes in law or our processing. Material changes will be announced on this page and, where you have an account, by email at least 30 days in advance.",
      },
    ],
  },

  blog: {
    posts: [
      {
        slug: "eu-ai-act-august-2026-omnibus-compliance",
        title: "EU AI Act Goes Live: What the Omnibus Amendments Mean for Your Business",
        excerpt:
          "The EU AI Act enters full force on 2 August 2026. Here is what the Omnibus VII amendments changed - and which transparency rules every business must comply with now.",
        category: "ai",
        date: "2026-07-07",
        readTime: "7",
      },
      {
        slug: "workflow-automation-fundamentals",
        title: "Workflow Automation Fundamentals: What Actually Matters",
        excerpt:
          "A practical look at what makes a workflow automation last in production — error handling, data sovereignty, observability, and exit cost — independent of which engine you pick.",
        category: "automation",
        date: "2026-03-15",
        readTime: "6",
      },
      {
        slug: "5-signs-your-business-needs-process-automation",
        title: "5 Signs Your Business Needs Process Automation",
        excerpt:
          "Is your team spending too much time on manual work? Here are the key indicators that it's time to invest in automation.",
        category: "operations",
        date: "2026-03-08",
        readTime: "5",
      },
      {
        slug: "connecting-crm-erp-the-integration-playbook",
        title: "Connecting CRM & ERP: The Integration Playbook",
        excerpt:
          "A practical guide to synchronizing your CRM and ERP systems — reducing data silos and creating a single source of truth.",
        category: "integration",
        date: "2026-02-28",
        readTime: "8",
      },
      {
        slug: "ai-chatbots-vs-rule-based-bots",
        title: "AI Chatbots vs. Rule-Based Bots: Which One Do You Need?",
        excerpt:
          "Understanding the difference between AI-powered and rule-based chatbots, and when each approach makes sense for your business.",
        category: "ai",
        date: "2026-02-20",
        readTime: "7",
      },
      {
        slug: "choosing-the-right-automation-architecture",
        title:
          "Choosing the Right Automation Architecture for Your Business",
        excerpt:
          "How to choose between point-to-point integrations, custom orchestration layers, and hybrid models — based on volume, compliance, and team size, not vendor pitch.",
        category: "automation",
        date: "2026-02-12",
        readTime: "10",
      },
      {
        slug: "whatsapp-business-automation-guide",
        title: "The Complete Guide to WhatsApp Business Automation",
        excerpt:
          "How to automate customer communication on WhatsApp — from order confirmations to support bots — without losing the personal touch.",
        category: "automation",
        date: "2026-02-05",
        readTime: "9",
      },
    ],
  },

  faq: {
    items: [
      {
        question: "What exactly does OpSolid do?",
        answer:
          "OpSolid builds automation systems, integrations, and internal tools for businesses. If your team spends time on manual, repetitive work — data entry, email follow-ups, order processing, report generation — OpSolid builds systems that handle it automatically and reliably.",
        category: "general",
      },
      {
        question: "What tools and platforms are used?",
        answer:
          "Each engagement is delivered as a custom system, built from production-ready engineering layers — REST APIs, message queues, Postgres, and webhooks at the core, supplemented by AI primitives where they earn their keep. The architecture is chosen for each use case rather than a one-size-fits-all toolkit.",
        category: "technical",
      },
      {
        question: "Why custom development instead of a SaaS platform?",
        answer:
          "Custom-built systems put you in full control of your data, your workflows, and the cost curve. No per-execution fees, no opaque pricing tiers, and no dependency on a single vendor. The architecture is designed to fit your processes — and the source code is yours to keep.",
        category: "technical",
      },
      {
        question: "How long does a typical project take?",
        answer:
          "Most projects take 2-6 weeks from discovery to deployment, depending on complexity. Simple automations can be live within days. Complex multi-system integrations may take longer. Work is done iteratively — you see results early and often.",
        category: "process",
      },
      {
        question: "Is ongoing support available after deployment?",
        answer:
          "Yes. Monitoring, maintenance, and optimization are available after deployment. Automation systems evolve as your business grows — ongoing support ensures your systems keep up. Documentation and training are also provided so your team can manage day-to-day operations independently.",
        category: "process",
      },
      {
        question: "How much does it cost?",
        answer:
          "Every project is different. A free initial consultation helps understand your needs, followed by a transparent proposal. Pricing is project-based, not hourly — you know the investment upfront.",
        category: "process",
      },
      {
        question: "Can OpSolid integrate with existing systems?",
        answer:
          "Almost certainly. OpSolid works with CRMs (HubSpot, Salesforce, Pipedrive), ERPs (SAP, Oracle, Odoo), e-commerce platforms (Shopify, WooCommerce), databases, Google Workspace, and virtually any system with an API.",
        category: "technical",
      },
      {
        question: "Do existing tools need to be replaced?",
        answer:
          "No. OpSolid builds systems that connect your existing tools — not replace them. The goal is to make what you already have work better together, eliminating data silos and manual handoffs.",
        category: "general",
      },
      {
        question: "Is data secure?",
        answer:
          "Yes. All automation infrastructure can be self-hosted within your own environment. GDPR requirements are followed, encryption is used for sensitive data, and all connections use secure APIs. No data passes through third-party servers unless you explicitly choose cloud-hosted solutions.",
        category: "technical",
      },
      {
        question: "What industries are served?",
        answer:
          "OpSolid works across industries — e-commerce, logistics, manufacturing, professional services, and more. Solutions are built around your processes, not your industry label. If your operations involve repetitive manual work, automation can help.",
        category: "general",
      },
    ],
  },

  products: {
    comingSoonDescription:
      "OpSolid's product portfolio is expanding. New tools for operations, communication, and AI-assisted workflows are currently in development.",

    digitalCard: {
      hero: {
        eyebrow: "[ OPSO SMART ]   YOUR DIGITAL BUSINESS CARD",
        title: [
          "OpSo Smart.",
          "Build your own digital business card -",
          "free, live in seconds.",
        ],
        paragraph:
          "Pick a template, fill in your details, publish. Your card goes live in seconds at opsolid.de/c/your-name, free. Share it by link, QR code, WhatsApp, or email - the receiver needs no app, and you can edit it anytime. EU-hosted in Frankfurt, GDPR-native.",
        primaryCta: "Create my free card",
        secondaryCta: "See 20 live templates",
        tags: "OPSO SMART · LINK · QR CODE · WHATSAPP · vCARD · NO APP · FREE",
        cardLabels: {
          name: "Alex Weber",
          role: "Product Designer",
          company: "Studio Nord",
          nfc: "QR",
          chip: "SCAN TO SHARE",
        },
      },
      features: {
        label: "WHAT YOU GET",
        heading: "One profile, three share modes, twenty starting points.",
        intro:
          "We design your profile based on your industry. You share it the way that fits the moment.",
        items: [
          {
            label: "LINK · 01",
            title: "Shareable link",
            desc: "A clean URL on opsolid.de/c/your-name (or your own domain in Custom). Drop it in email signatures, WhatsApp bios, Instagram. No app install for the receiver.",
            icon: "link",
          },
          {
            label: "QR · 02",
            title: "Download your QR code",
            desc: "PNG + SVG files you can print, embed, or screen-share. Put it on window stickers, menus, booth banners, or a Zoom background.",
            icon: "qr",
          },
          {
            label: "TEMPLATES · 03",
            title: "20 industry templates",
            desc: "Real estate, clinic, restaurant, DJ, barber, photographer, architect, fitness and more. Browse live previews before we start.",
            icon: "templates",
          },
          {
            label: "DESIGN · 04",
            title: "Design it yourself",
            desc: "Live preview as you type. Pick a layout and theme, drop in your colors and photos, publish instantly. Prefer it done for you? White-glove is one tier up.",
            icon: "layout",
          },
          {
            label: "SIGNATURE · 05",
            title: "Email signature ready",
            desc: "Paste the ready-made snippet into Gmail or Outlook. Your card travels with every email you send.",
            icon: "wallet",
          },
          {
            label: "HOSTING · 06",
            title: "EU-hosted (Frankfurt)",
            desc: "Hetzner / IONOS Frankfurt. GDPR-native. Zero US subprocessors. One-click deletion, always.",
            icon: "hosting",
          },
        ],
      },
      compliance: {
        label: "SOVEREIGNTY",
        heading: "Where does your card data live?",
        intro:
          "Most competitors host in the US. We don't. When a customer scans your card, their data stays in Germany.",
        cols: [
          "Provider",
          "Host region",
          "Sub-processors",
          "GDPR DPA",
          "One-click delete",
        ],
        rows: [
          {
            provider: "Popl",
            host: "US",
            sub: "US (AWS, Heroku)",
            dpa: "via SCC",
            del: "Partial",
            highlight: "",
          },
          {
            provider: "Blinq",
            host: "AU",
            sub: "US (AWS Sydney)",
            dpa: "via SCC",
            del: "Partial",
            highlight: "",
          },
          {
            provider: "Lemontaps",
            host: "DE (Frankfurt)",
            sub: "Limited",
            dpa: "Yes",
            del: "Yes",
            highlight: "",
          },
          {
            provider: "OpSo Smart",
            host: "DE (Frankfurt)",
            sub: "No US subprocessors",
            dpa: "Native",
            del: "Yes",
            highlight: "true",
          },
        ],
      },
      pricing: {
        label: "PRICING",
        heading: "Three flexible tiers. No subscription traps.",
        popularBadge: "MOST POPULAR",
        plans: [
          {
            name: "Free",
            price: "€0",
            cadence: "Build it yourself, live in seconds.",
            popular: "",
            bullets: [
              "All templates, layouts, and themes",
              "Link + QR code (PNG + SVG)",
              "Save-to-contacts (vCard)",
              "Hosted on opsolid.de/c/your-name",
              "Small \"Made with OpSo Smart\" badge",
              "No login required",
            ],
            cta: "Create my free card",
            href: "#lead",
          },
          {
            name: "Premium",
            price: "€149",
            cadence: "one-time · €9/year hosting after year 1",
            popular: "true",
            bullets: [
              "Everything in Free, badge removed",
              "Custom slug or your own domain",
              "WhatsApp share button",
              "Analytics (views + clicks)",
              "Video block + lead capture / CRM",
              "Multiple cards",
            ],
            cta: "Go Premium",
            href: "#lead",
          },
          {
            name: "White-glove",
            price: "From €299",
            cadence: "quoted · we design it for you",
            popular: "",
            bullets: [
              "We hand-design your card for you in 48h",
              "Unlimited revisions",
              "Multi-language (DE/EN/TR)",
              "Team rollout",
              "Everything in Premium",
              "Priority support",
            ],
            cta: "Request white-glove",
            href: "#lead",
          },
        ],
      },
      lead: {
        label: "REQUEST",
        heading: "Tell us about your card.",
        intro:
          "Share your industry, basic info, and the template you like. We'll reply within one business day with a preview link.",
        fields: {
          name: "Full name",
          email: "Work email",
          company: "Company (optional)",
          teamSize: "How many cards?",
          teamSizeOptions: ["1", "2 – 5", "6 – 20", "20+"],
          message:
            "Anything else we should know? (industry, link preferences, etc.)",
          consent:
            "I consent to OpSolid processing this submission to respond to my request. See the Privacy Policy.",
          privacyLink: "Privacy Policy",
          submit: "Send request",
          submitting: "Sending…",
          success:
            "Thanks - we'll reply within one business day with a preview link.",
          error:
            "Something went wrong. Please email info@opsolid.de directly.",
        },
      },
      testimonials: {
        label: "SOCIAL PROOF",
        heading: "What customers say after their first card.",
        items: [],
      },
      howItWorks: {
        label: "HOW IT WORKS",
        heading: "Four steps. Live in seconds.",
        steps: [
          {
            title: "01 · Pick a template",
            description:
              "Browse 20 industry templates and choose the one that fits. Pick a layout and theme to match.",
          },
          {
            title: "02 · Fill your details",
            description:
              "Add your name, role, links, photos, and colors. A live preview updates as you type.",
          },
          {
            title: "03 · Publish in seconds",
            description:
              "Hit publish and your card goes live at opsolid.de/c/your-name. No login, no waiting.",
          },
          {
            title: "04 · Share your link",
            description:
              "Share the link and QR code anywhere: email signatures, WhatsApp, Instagram, printed material.",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Questions, answered directly.",
        items: [
          {
            question: "How fast do I get my card?",
            answer:
              "Instantly: build it yourself and publish in seconds. Prefer we design it for you? Choose white-glove (48h).",
          },
          {
            question: "Does the receiver need an app?",
            answer:
              "No. The card opens in any browser from your link or QR code - nothing to install. Share it by link, QR, WhatsApp, or email, and the receiver just taps and sees your profile.",
          },
          {
            question: "Can I edit my card myself later?",
            answer:
              "Yes, anytime - you own an edit link. Open it, change what you need, republish in seconds. No request, no waiting.",
          },
          {
            question: "Where is my data stored?",
            answer:
              "EU-hosted (Frankfurt) - Hetzner / IONOS. No US subprocessors. A DPA is ready on request.",
          },
          {
            question: "Can I cancel or delete my card?",
            answer:
              "Yes, anytime. One-click deletion. No auto-renewal traps. Hosting is prepaid annually after year one.",
          },
          {
            question: "I need 10+ cards for my team. How?",
            answer:
              "Every card is free, so build one per person. For a larger rollout you'd rather not set up yourself, email info@opsolid.de and we'll help.",
          },
        ],
      },
      cta: {
        eyebrow: "READY?",
        heading: "Your card. Live in seconds.",
        primaryCta: "Create my free card",
        secondaryCta: "Browse templates",
      },
      preview: {
        meta: {
          title: "Digital Business Card — Live Preview | OpSolid",
          description:
            "Build your own digital business card. Preview it live on your phone, swipe between templates, and publish free in seconds.",
        },
        eyebrow: "LIVE PREVIEW",
        title: "Build your card, preview it live",
        subtitle:
          "Swipe between templates. Preview live. Publish free in seconds.",
        hintSwipe: "Swipe",
        hintArrows: "Use arrow keys to move between designs",
        prev: "Previous design",
        next: "Next design",
        orderCta: "Use this design",
        secondaryCta: "See all designs",
        counter: "{{current}} / {{total}}",
        priceYearly: "/yr",
        priceMonthly: "/mo",
        priceOneTime: "one-time",
      },
      order: {
        gallery: {
          title: "Choose a design",
          subtitle:
            "Every design is numbered. When you call us, just mention the number.",
          selectCta: "Pick this design",
          selected: "Selected",
          fromPrice: "from",
          demoCta: "Demo",
          demoModalChoose: "Choose this template",
          demoModalBack: "Back to gallery",
          comingSoon: "Coming soon",
          comingSoonHint: "This design is on the way.",
          prevSlide: "Previous design",
          nextSlide: "Next design",
          slideOf: "{{current}} of {{total}}",
          sectorAll: "All",
          sectorRealEstate: "Real estate",
          sectorLawyer: "Legal",
          sectorRestaurant: "Restaurant",
          sectorCreator: "Creator",
          sectorClinic: "Clinic",
          sectorMusic: "Music",
          sectorSalon: "Salon",
          sectorRetail: "Retail",
          sectorArchitecture: "Architecture",
          sectorFitness: "Fitness",
          sectorHospitality: "Hospitality",
          sectorConsultant: "Consulting",
          sectorTech: "Tech",
          sectorEvents: "Events",
          sectorDentist: "Dentist",
          sectorPsychologist: "Therapist",
          sectorBeauty: "Beauty",
          sectorAccounting: "Accounting",
          sectorSoftware: "Software & IT",
          sectorContentCreator: "Content Creator",
          sectorWellness: "Wellness",
          sectorEventPlanner: "Event Planner",
          sectorAuto: "Auto Dealer",
          sectorInterior: "Interior Design",
          monthlyShort: "/mo",
        },
        form: {
          eyebrow: "CREATE YOUR CARD",
          title: "Your details, your design, your card.",
          subtitle:
            "Fill out the form — your card goes live at opsolid.de/c/… as soon as you publish.",
          howToCreate:
            "Anyone can create a card — no account needed. Pick a design, fill in the form, and it goes live in minutes. You get a private link to edit it anytime.",
          eventJoinLabel:
            "List my card in the participant directory so other attendees can find me.",
          draftRestored:
            "Your previous draft was restored — continue where you left off.",
          draftDiscard: "Start over",
          selectedTemplate: "Selected design",
          changeTemplate: "Change",
          contactSection: "Contact — how we reach you",
          contactName: "Your name",
          contactEmail: "Email",
          contactPhone: "Phone",
          callMeBack: "Call me back",
          callMeBackHint:
            "We'll get back to you within one business day to confirm details.",
          cardSection: "Your card content",
          sampleHint: "Sample content to explore — replace it with your own details.",
          clearSample: "Clear",
          cardLanguageLabel: "Card language",
          cardLanguageHint:
            "The language your card's visitors will see. You can change it later in the editor.",
          spotlightSection: "Now · Spotlight",
          spotlightHint:
            "A bold, momentary update shown right below your photo — a short note and/or one link. Leave empty to hide it.",
          spotlightEnabled: "Show on my card",
          spotlightBody: "What's happening right now?",
          spotlightBodyPlaceholder: "e.g. Booking new projects for July — say hi 👋",
          spotlightLinkUrl: "Link (optional)",
          spotlightLinkLabel: "Button text (optional)",
          spotlightLinkLabelPlaceholder: "Read more",
          spotlightPlacement: "Position on the card",
          spotlightPlaceBelowPhoto: "Below the photo (recommended)",
          spotlightPlaceTop: "Top of the card",
          spotlightPlaceBottom: "Bottom of the card",
          statsSection: "Stats",
          statsHint:
            "Real numbers shown as a stat strip on many designs (e.g. 12 — Years).",
          statsEmpty:
            "No stats yet. Add real numbers you're proud of (e.g. 12 — Years of experience). Cards without stats simply don't show this section.",
          statsValue: "12+",
          statsLabel: "Years of experience",
          statsAdd: "Add stat",
          statsRemove: "Remove",
          taglineLabel: "Tagline",
          taglinePlaceholder: "A short claim line (optional)",
          taglineHint:
            "Shown under your name on some designs. Empty = your role/title is used instead.",
          locationLabel: "Location on card",
          locationAuto: "From address",
          locationCustom: "Custom",
          locationHidden: "Hidden",
          locationAutoHint: "Derived from your address:",
          locationAutoEmpty:
            "No address yet — no location will be shown until you add one.",
          locationPlaceholder: "Remote · Berlin",
          locationHiddenHint: "No location chip will appear on your card.",
          copyFromContact: "Use info from above",
          cardName: "First and last name",
          cardTitle: "Title / role",
          cardCompany: "Company",
          cardWebsite: "Website",
          cardEmail: "Email (on card)",
          cardPhone: "Phone (on card)",
          cardWhatsapp: "WhatsApp",
          cardAddress: "Address",
          cardBio: "Short bio",
          cardBioPh: "One line about you or your business.",
          socialSection: "Social links (optional)",
          uploadSection: "Photo & logo (optional)",
          photoLabel: "Profile photo",
          logoLabel: "Logo",
          uploadTooLarge: "File too large (max 2 MB).",
          uploadFailed: "Upload failed.",
          brandSection: "Brand colors (optional)",
          primaryColor: "Primary color",
          accentColor: "Accent color",
          designNotes: "Special requests (optional)",
          designNotesPh:
            "Anything specific we should know: fonts, logo tweaks, layout preferences.",
          resetColors: "Reset to template defaults",
          uploadWrongType: "Unsupported format. Use JPG, PNG, or WebP.",
          dragHere: "Drag here or click to upload",
          uploadHint: "JPG, PNG, WebP · max 5 MB",
          uploadRemove: "Remove",
          submitLabel: "Pay and publish my card",
          selectionModeLabel: "Select your design",
          templateColors: "Template colors",
          uploadDone: "Uploaded",
          uploading: "Uploading…",
          templateNoPhoto: "This design doesn't use a photo.",
          templateNoLogo: "This design doesn't use a logo.",
          templateNoAsset: "This design doesn't use this element.",
          previewExpand: "Open full preview",
          previewClose: "Close preview",
          previewOpenInNewTab: "Open in new tab",
          previewLanguage: "Card language",
          previewNoPaymentNote: "Preview only",
          // Phase 7.9 — photo position editor
          editPosition: "Edit position",
          photoEditorTitle: "Profile photo position",
          photoEditorSubtitle: "Drag to position, slide to zoom.",
          logoEditorTitle: "Logo position",
          logoEditorSubtitle:
            "Place the logo exactly where you want it in its frame.",
          photoEditorZoom: "Zoom",
          photoEditorReset: "Reset",
          photoEditorSave: "Save",
          photoEditorCancel: "Cancel",
          photoEditorHint: "The ring shows the visible centre of the image.",
          // Phase 7.9 — share-link modal
          shareLink: "Preview link",
          shareLinkTitle: "Share preview link",
          shareLinkSubtitle:
            "Send your card to others before you publish. Anyone with the link can read it.",
          shareLinkUrl: "Link",
          shareLinkCopy: "Copy",
          shareLinkCopied: "Copied ✓",
          shareLinkOpen: "Open in new tab",
          shareLinkNote:
            "The link contains all form data; the card is not published until you create it.",
          // Video embed (YouTube / Vimeo)
          videoSection: "Video (optional)",
          videoHint:
            "Paste a YouTube or Vimeo link — it plays right on your card.",
          videoLabel: "Video link",
          videoPlaceholder: "https://youtube.com/watch?v=…",
          videoInvalid: "Only YouTube or Vimeo links are supported.",
          videoPlacementLabel: "Video position",
          videoPlacementTop: "Top",
          videoPlacementDefault: "Default",
          videoPlacementBottom: "Bottom",
          // Phase 7.9 — custom sections editor
          customSectionsSection: "Custom sections (optional)",
          customSectionsHint:
            "Add up to 6 sections — awards, languages, anything you want.",
          // Editable section labels
          labelsSection: "Section titles (optional)",
          labelsHint:
            'Rename the section TITLES on your card (e.g. "Services" → "Menu"). Enter the content itself in the sections above — a section you leave empty (and its title) won\'t appear on the card. Leave a field blank to keep the default.',
          customSectionAdd: "Add section",
          customSectionTitle: "Title",
          customSectionTitlePh: "e.g. Languages, Awards, Press",
          customSectionBody: "Content",
          customSectionBodyPh:
            "Body text — visible to anyone who opens your card.",
          customSectionRemove: "Remove",
          customSectionsCount: "{n} of 6",
          customSectionAddImage: "Add image (optional)",
          // FAQ editor
          faqSection: "FAQ (optional)",
          faqHint:
            "Add up to 12 frequently asked questions — they appear as an accordion on your card.",
          faqQuestion: "Question",
          faqAnswer: "Answer",
          faqAdd: "Add question",
          faqRemove: "Remove",
          faqEmpty:
            "No FAQ items yet. Add a question to get started.",
          // Testimonials editor
          testimonialsSection: "Testimonials (optional)",
          testimonialsHint:
            "Add up to 8 client quotes — shown on all templates that don't display them natively.",
          testimonialAuthor: "Name (e.g. Maria K.)",
          testimonialRole: "Role / company (optional)",
          testimonialQuote: "Quote",
          testimonialAdd: "Add testimonial",
          testimonialRemove: "Remove",
          testimonialsEmpty:
            "No testimonials yet. Add your first client quote.",
          // Phase 7.9 — typography presets
          typographySection: "Typography (optional)",
          typographyHint:
            "Override the template's fonts. Leave on default to use the template's own typography.",
          typographyDefaultLabel: "Template default",
          typographyDefaultDesc: "Uses the template's own typography.",
          typographyModernLabel: "Modern",
          typographyModernDesc: "Inter + Manrope — minimalist, corporate.",
          typographyClassicLabel: "Classic",
          typographyClassicDesc:
            "Cormorant Garamond + Source Sans 3 — elegant, traditional.",
          typographyEditorialLabel: "Editorial",
          typographyEditorialDesc: "Playfair Display + Inter — magazine feel.",
          typographyBoldLabel: "Bold",
          typographyBoldDesc: "Bebas Neue + Inter — striking, sporty.",
          billingSection: "Billing mode",
          billingMonthly: "Monthly",
          monthlyFooter: "Lowest barrier. Cancel any time.",
          billingYearly: "Yearly",
          billingBestValue: "Best value",
          yearlyFooter: "~35% off vs monthly. Revisions included.",
          billingOneTime: "One-time",
          oneTimeFooter: "Hosted for life. No renewal.",
          totalLabel: "Total",
          submit: "Pay & publish card",
          submitting: "Processing …",
          previewLabel: "Live preview",
          previewHint:
            "Preview updates live — that's how your card looks after publishing.",
          invalidInput: "Please check the highlighted fields.",
          serverError: "Server error. Please try again.",
          noCheckoutUrl: "No payment URL returned.",
          networkError: "Network error.",
          step1Title: "Contact",
          step1Summary: "How we reach you",
          step1Next: "Continue to card content",
          step2Title: "Card content",
          step2Summary: "What appears on your card",
          step2Next: "Continue to branding",
          step3Title: "Branding",
          step3Summary: "Colors, theme, design notes",
          step3Next: "Continue to billing",
          step4Title: "Billing",
          step4Summary: "Choose your plan",
          // Self-serve free flow (shown when payments are off). The card is
          // created & published, not ordered/paid for.
          step4TitleCreate: "Create & publish",
          step4SummaryCreate: "Check your address and go live",
          step3NextCreate: "Continue to publish",
          slugSection: "Card address",
          slugHint:
            "Your card URL. Leave empty to auto-generate it from your name.",
          createExplainerTitle: "What happens when you click",
          createExplainerBody:
            "Your card is published instantly and reachable at its link. We email you the link plus a private edit link. Free, no credit card.",
          createSubmitLabel: "Publish for free",
          createSubmitHint: "No credit card. Your card goes live instantly.",
          createSubmit: "Create my card for free",
          stepIndicator: "Step {current} of {total}",
          stepEmpty: "Add your details",
          stepBack: "Back",
          reviewEdit: "Edit",
          contactEmailInline: "Your email (we send your card link here)",
          previewLabelMobile: "Preview",
          previewSheetTitle: "Live preview",
          previewSheetClose: "Close",
          previewLiveBadge: "Live preview",
          previewLiveHint: "Updates as you type",
          stepLockedHint: "Complete previous step to unlock",
        },
      },
      edit: {
        title: "Edit your card",
        subtitle:
          "Typos, phone numbers, social links — fix anything on your card yourself. Changes go live in seconds.",
        publicUrlLabel: "Your public card:",
        contactReadonlyLabel: "Your contact details (read-only)",
        contactReadonlyHint:
          "Need to change the email, name or phone on file? Reply to your order email and we'll handle it.",
        statusLabel: "Order status",
        save: "Save changes",
        saving: "Saving …",
        savedSuccess: "Saved.",
        savedError: "Couldn't save your changes. Please try again.",
        shareHeading: "Share your card",
        shareBody:
          "Download a 1200×630 image of your card to post on LinkedIn, Instagram or include in a signature.",
        downloadOg: "Download social image",
        shareNotReady:
          "The shareable image becomes available once your card is published.",
        notFoundTitle: "We couldn't open this edit link",
        notFoundBody:
          "This link is expired or not valid anymore. Please reply to your order email and we'll send you a fresh link.",
        liveBadge: "Card is live",
        slugRenameWarning:
          "The new address takes effect once you press «Save». The old address auto-redirects to the new one.",
        viewAsOwner: "View as owner",
        analyticsLoading: "Loading…",
        analyticsEmpty: "Analytics not available.",
        analyticsLast7: "Last 7 days",
        analyticsLast30: "Last 30 days",
        analyticsTotal: "Total",
        sourceWallet: "Wallet",
        sourceOther: "Other",
        leadStatusContacted: "Contacted",
        leadStatusArchived: "Archived",
        leadStatusNew: "New",
        leadStatusQualified: "Qualified",
        crmHeaderTitle: "Connections (CRM)",
        crmHeaderHint:
          "Visitors who fill the form on your card and other cardholders who exchange with you appear here. You also receive an email per entry.",
        crmTabLeads: "Inbox",
        crmTabConnections: "Card connections",
        crmFilterAll: "All",
        crmSearchPlaceholder: "Name, email, company, tag…",
        crmLoading: "Loading…",
        crmEmptyLeads: "No incoming info yet.",
        crmEmptyConnections: "No card connections yet.",
        addNotePlaceholder:
          "Context: where we met, what we discussed, follow-up notes…",
        editNote: "Edit note",
        closeNote: "Hide note",
        addNote: "Add note",
        connectionNotePlaceholder: "Add a note about this connection…",
        unsavedChanges: "Unsaved changes",
        allSaved: "All changes saved",
        revert: "Revert",
        untitledCard: "Untitled card",
        viewLive: "View live",
        // B7 — section labels + photo/logo thumbnail affordances
        sectionPersonBrand: "Person & Brand",
        sectionContact: "Contact",
        sectionContent: "Content",
        sectionPublish: "Publishing & Status",
        adjustPhoto: "Adjust photo",
        adjustLogo: "Adjust logo",
        expandSection: "Expand section",
        collapseSection: "Collapse section",
        // WS-2 / WS-3 — simplified progressive editor
        backToCards: "My cards",
        tierBasic: "Basics",
        tierMore: "More details",
        tierAdvanced: "Advanced",
        allDesigns: "All designs",
        allDesignsHint: "Browse all 90+ designs by sector.",
        performanceTitle: "Performance & CRM",
        uploadCue: "Uploaded — hit Save to publish it.",
        completenessTitle: "Card completeness",
        completenessSummary: "{done}/{total} done",
        completenessGoto: "Go",
        completenessAllDone: "Your card looks complete 🎉",
        completenessPhoto: "Profile photo",
        completenessLogo: "Logo",
        completenessName: "Name",
        completenessJobTitle: "Job title",
        completenessCompany: "Company",
        completenessContact: "Contact (phone/email)",
        completenessSocial: "Social link",
        completenessBio: "About",
      },
      cancel: {
        heading: "Cancel subscription",
        body: "Your card stays live until the end of the current billing period. You won't be charged again after that.",
        openCta: "Cancel my subscription",
        alreadyScheduled:
          "Your subscription is already scheduled to end on {date}.",
        modalEyebrow: "CONFIRM",
        modalTitle: "Cancel your OpSolid Digital Card?",
        explainer:
          "Your subscription stays active until {date}, then stops renewing. You won't be charged again.",
        explainerNoDate:
          "Your subscription stays active until the end of the current billing period, then stops renewing.",
        keep: "Keep subscription",
        confirm: "Confirm cancel",
        error: "We couldn't schedule the cancellation. Please email info@kutasia.com.",
        doneBody:
          "Cancellation scheduled. Your card stays live until {date}. You'll get a final confirmation email from Stripe.",
        doneClose: "Close",
      },
      meta: {
        title:
          "OpSo Smart — Free digital business card, live in seconds | OpSolid",
        description:
          "Build your own digital business card for free and publish it in seconds — link, QR, WhatsApp, email. No app for the receiver, editable anytime. EU-hosted (Frankfurt), GDPR-native.",
      },
    },








  },

  // ===========================================================================
  // V2 DESIGN-SYSTEM CONTENT (Claude Design industrial-luxury port)
  //
  // All redesigned surfaces consume from `t.v2.*`. Keep this tree structurally
  // identical across en.ts / de.ts / tr.ts. Headlines that carry the editorial
  // italic signature move are expressed as { pre, italic, post } so each
  // locale can choose its own natural italic word.
  //
  // Voice rules: third-person ("OpSolid builds…"), professional + convincing,
  // no superlatives, no emoji, em-dashes as rhythm breaks. Trust-bank phrases
  // (Hosted in Frankfurt, GDPR-native, No US subprocessors) stay in English
  // across all locales.
  // ===========================================================================
  v2: {


    home: {







      faq: {
        eyebrow: "[ FAQ ]",
        headline: "Common questions",
        items: [
          {
            q: "Who is OpSolid right for?",
            a: "Mid-sized companies and teams with many manual or Excel/email-driven processes. If everything already runs as a system, we are probably not the highest-leverage choice.",
          },
          {
            q: "Which processes can be automated?",
            a: "Anything repetitive with a clear input and a clear output — quotes, document generation, reporting, data sync, email routing, support triage.",
          },
          {
            q: "Can AI be used in a GDPR-compliant way?",
            a: "Yes — with the right model choice, data residency and a written guideline. We help you set this up from the start.",
          },
          {
            q: "Do we need to be using AI already?",
            a: "No. Many engagements begin with no AI in use at all and the result is still a measurable improvement.",
          },
          {
            q: "How long does a first Automation Check take?",
            a: "60 to 90 minutes for the call itself, plus a few working days for the written 30-day plan.",
          },
          {
            q: "Can we keep using our existing tools like Microsoft 365?",
            a: "Yes — most of what we build sits on top of the tools you already pay for.",
          },
          {
            q: "Do you also build custom solutions?",
            a: "Yes — where off-the-shelf does not fit, we build internal tools, custom workflows and integrations.",
          },
        ],
      },




      finalCta: {
        eyebrow: "[ LET'S TALK ]",
        title: {
          pre: "Ready to make your processes ",
          italic: "more efficient",
          post: "?",
        },
        lead:
          "Let's look together at which tasks in your company can be simplified with AI and automation. No obligation after the call — if it's not the right fit, we'll say so plainly.",
        ctaPrimary: "Book a free discovery call",
        ctaSecondary: "Read insights",
        trustLine:
          "INDEPENDENT · GDPR-NATIVE · BUILT IN GERMANY · DE · EN · TR",
      },
    },





    digitalCard: {
      hero: {
        metaChip: "OPSO SMART",
        metaLabel: "[ OPSO SMART · 02 ]",
        title: {
          pre: "A business card ",
          italic: "designed to be kept",
          post: "",
        },
        lead:
          "Create a mobile-friendly digital business card in a minute. Share it by link, QR code, WhatsApp, or email — your recipients need no app. Update your contact details, booking link, and portfolio anytime, no reprint.",
        ctaPrimary: "Create for free",
        ctaSecondary: "See designs",
        features: [
          {
            label: "FORMAT",
            value: "Digital card",
            sub: "Link · QR · WhatsApp",
          },
          {
            label: "RECIPIENT",
            value: "No app",
            sub: "Opens in browser",
          },
          {
            label: "PRICE",
            value: "Free",
            sub: "Edit anytime",
          },
        ],
      },
      templates: {
        eyebrow: "[ INDUSTRY TEMPLATES ]",
        headline: "Starting points, not straitjackets",
        lead:
          "Template layouts for law, medical, skilled trades, and hospitality — each with the contact fields, compliance disclosures, and calendar integrations that sector relies on day-to-day. Every layout is a fork-and-modify starting point, not a locked theme.",
        items: [
          {
            sector: "LAW",
            name: "Anja Weber",
            role: "Partner · Corporate Law",
            code: "LAW · HAM",
            cls: "sector-law",
          },
          {
            sector: "CLINIC",
            name: "Dr. Martin Bauer",
            role: "Dentist · Private Practice",
            code: "CLINIC · BER",
            cls: "sector-clinic",
          },
          {
            sector: "TRADES",
            name: "Jan Meister",
            role: "Master Craftsman · Plumbing",
            code: "TRADES · FRA",
            cls: "sector-trades",
          },
          {
            sector: "HOSP",
            name: "Sofia Aydın",
            role: "Sommelière · Fine Dining",
            code: "HOSP · IST",
            cls: "sector-hosp",
          },
        ],
      },
      howItWorks: {
        eyebrow: "[ HOW IT WORKS ]",
        headline: "Create. Share. Update",
        lead:
          "No hardware, no app. Your card lives at a link you update anytime from your dashboard.",
        steps: [
          {
            num: "01",
            title: "Create in a minute",
            body:
              "Pick a design, fill in a few fields, publish free — no account needed.",
          },
          {
            num: "02",
            title: "Share anywhere",
            body:
              "By link, QR code, WhatsApp, or email. Recipients open it in the browser — no app.",
          },
          {
            num: "03",
            title: "Edit anytime",
            body:
              "New role, new number, new photo — change once, instantly live.",
          },
        ],
      },
      customRequest: {
        eyebrow: "[ WHITE-GLOVE · DESIGNED FOR YOU ]",
        headline: "Prefer we design it for you?",
        lead:
          "Two done-for-you paths: white-glove hand-designs your card in 48 hours, or we quote a bespoke build for teams and special requests. Tell us what you need below — or just message us.",
        options: [
          {
            tag: "WHITE-GLOVE",
            price: "from €299",
            title: "We design it for you",
            body:
              "Hand-designed in 48 hours, unlimited revisions, multi-language (DE / EN / TR), priority support.",
          },
          {
            tag: "CUSTOM · TEAM",
            price: "On request",
            title: "Bespoke or team rollout",
            body:
              "Special layouts, many cards, your own domain — we scope it and send you a quote.",
          },
        ],
        channels: {
          heading: "Reach us directly",
          note: "Fastest by WhatsApp — we usually reply within one business day.",
          prefill: "Hi OpSolid — I'd like a custom OpSo Smart card.",
          labels: {
            whatsappTr: "WhatsApp · TR",
            whatsappDe: "WhatsApp · DE",
            phone: "Call",
            email: "Email",
          },
        },
        form: {
          heading: "Tell us about your card",
          name: "Full name",
          email: "Work email",
          company: "Company (optional)",
          industry: "Industry / sector",
          teamSize: "How many cards?",
          teamSizeOptions: ["1", "2 – 5", "6 – 20", "20+"],
          message: "What do you need? Style, links, special requests…",
          consent:
            "I consent to OpSolid processing this request to reply.",
          privacyLink: "Privacy Policy",
          submit: "Send request",
          submitting: "Sending…",
          success: "Thanks — we'll reply within one business day.",
          error: "Something went wrong. Please email info@opsolid.de directly.",
        },
      },
      gallery: {
        heading: "All designs",
        subheading:
          "Browse the full lineup and pick the design that fits your work.",
        countLabel: "designs",
        allChip: "All",
        useDesign: "Use this design",
        backLink: "Back to Digital Card",
        imgFallbackLabel: "Template preview",
        sectors: {
          general: "General",
          realEstate: "Real Estate",
          salon: "Salon & Barber",
          restaurant: "Restaurant",
          creator: "Creator & Photo",
          freelancer: "Freelancer",
          lawyer: "Legal",
          clinic: "Clinic",
          fitness: "Fitness",
          music: "Music & DJ",
          architecture: "Architecture",
          retail: "Retail",
          hospitality: "Hospitality",
          events: "Events",
          construction: "Construction",
          tourism: "Tourism",
          corporate: "Corporate",
          tech: "Tech",
          consultant: "Consultant",
          dentist: "Dentist",
          psychologist: "Psychology",
          beauty: "Beauty",
          accounting: "Accounting",
          software: "Software",
          "content-creator": "Content Creator",
          wellness: "Wellness",
          eventPlanner: "Event Planner",
          auto: "Auto Dealer",
          interior: "Interior Design",
        },
      },
      pricing: {
        eyebrow: "[ PRICING ]",
        headline: "Free to start. Pay only when you need more.",
        lead:
          "Build and publish for free. Upgrade for your own domain and analytics, or let us design the whole thing for you.",
      },
    },








    pricing: {
      meta: {
        title: "Pricing — Standard, Professional, Enterprise | OpSolid",
        description: "Pricing overview for OpSolid's products (prices for most products on request): Voice Agent, OpSo Smart, Chatbot, WhatsApp, Booking, Email, Lead Qualifier, Custom Automation, and Kutasia.",
      },
      hero: {
        eyebrow: "[ PRICING · TRANSPARENT ]",
        title: {
          pre: "Pricing across ",
          italic: "all nine products",
          post: ".",
        },
        lead: "Standard for the focused use case. Professional for the active operation. Enterprise for the regulated and the scaled. Setup once, recurring matched to usage, no hidden upgrades.",
        vatNotice: "All prices in EUR, ex-VAT. EU-hosted infrastructure included.",
      },
      labels: {
        setup: "Setup",
        monthly: "Recurring",
        included: "Included",
        overage: "Overage",
        forWhom: "Best for",
        primaryCta: "Get started",
        enterpriseCta: "Talk to us",
        viewProduct: "View product",
        perMonth: "/mo",
        perUser: "/user",
        perSeat: "/seat",
      },
      tierNames: {
        standard: "Standard",
        professional: "Professional",
        enterprise: "Enterprise",
      },
      products: [
        {
          id: "voice-agent",
          name: "Voice AI Agent",
          tagline: "24/7 phone receptionist on Retell or Vapi, multilingual.",
          href: "/products/voice-agent",
          tiers: [
            {
              name: "Standard",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["500 minutes / month", "1 phone number", "1 language", "Business-hours coverage", "Cal.com integration"],
              overage: "",
              forWhom: "Single-location SMB, after-hours overflow",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["2,000 minutes / month", "3 phone numbers", "Multilingual (DE / EN / TR)", "24/7 coverage", "CRM sync (HubSpot, Pipedrive)"],
              overage: "",
              forWhom: "Mid-market with steady inbound (clinics, agencies)",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["8,000 minutes / month", "Unlimited numbers", "Custom voice + branding", "SLA by agreement", "EU data residency contract"],
              overage: "",
              forWhom: "High-volume, regulated industries",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "verso",
          name: "OpSo Smart",
          tagline: "Build your own digital business card, free",
          href: "/products/digital-card",
          tiers: [
            {
              name: "Free",
              setup: "€0",
              monthly: "€0",
              included: ["All templates, layouts & themes", "Link + QR code (PNG + SVG)", "Save-to-contacts (vCard)", "Hosted on opsolid.de/c/your-name", "Small 'Made with OpSo Smart' badge"],
              overage: "",
              forWhom: "Solo, freelancer, consultant",
              isHighlighted: false,
            },
            {
              name: "Premium",
              setup: "€149 one-time",
              monthly: "€9/year hosting after year 1",
              included: ["Everything in Free, badge removed", "Custom slug or your own domain", "WhatsApp share button", "Analytics (views + clicks)", "Lead capture + CRM webhook"],
              overage: "",
              forWhom: "Pros who want a domain & analytics",
              isHighlighted: true,
            },
            {
              name: "White-glove",
              setup: "From €299",
              monthly: "quoted",
              included: ["We hand-design your card in 48h", "Unlimited revisions", "Multi-language (DE / EN / TR)", "Team rollout", "Priority support"],
              overage: "",
              forWhom: "Want it done for you",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "chatbot-agent",
          name: "Chatbot Agent",
          tagline: "Web chat + KB ingestion + lead capture, hand-off to human.",
          href: "/products/chatbot-agent",
          tiers: [
            {
              name: "Standard",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["1 site", "500 conversations / month", "Knowledge base up to 50 docs", "Business-hours hand-off", "Email + ticket capture"],
              overage: "",
              forWhom: "Small site, lead-capture focus",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["3 sites", "2,500 conversations / month", "Unlimited KB documents", "24/7 hand-off", "CRM sync"],
              overage: "",
              forWhom: "Mid-market with active funnel",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["Unlimited sites", "10,000 conversations / month", "Multi-language", "SLA + audit log", "Custom voice + tone training"],
              overage: "",
              forWhom: "High-traffic e-commerce / B2B SaaS",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "whatsapp-agent",
          name: "WhatsApp Agent",
          tagline: "WhatsApp Business API — automated replies, broadcast, hand-off.",
          href: "/products/whatsapp-agent",
          tiers: [
            {
              name: "Standard",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["1 WABA number", "3 users", "1,000 conversations / month", "Templates + broadcast", "Lead capture flow"],
              overage: "",
              forWhom: "Local businesses, single-channel",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["1 WABA number", "10 users", "5,000 conversations / month", "Automation flows", "CRM sync"],
              overage: "",
              forWhom: "Mid-market service operations",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["3+ WABA numbers", "Unlimited users", "20,000 conversations / month", "Multi-team routing", "SLA"],
              overage: "",
              forWhom: "High-volume retail / multi-brand",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "booking-agent",
          name: "Booking Agent",
          tagline: "Web / voice / WhatsApp bookings → Cal.com → reminders → no-show recovery.",
          href: "/products/booking-agent",
          tiers: [
            {
              name: "Standard",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["Web booking widget", "Cal.com sync", "Email + SMS reminders", "1 calendar", "Up to 100 bookings / month"],
              overage: "",
              forWhom: "Solo practitioner / small team",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["Up to 10 calendars", "Voice + WhatsApp + web intake", "No-show recovery flow", "Intake forms", "Custom reminders"],
              overage: "",
              forWhom: "Multi-staff service business",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["Unlimited calendars", "Custom workflows", "Deposit collection (Stripe)", "Multi-location", "SLA"],
              overage: "",
              forWhom: "Clinics, multi-branch operations",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "email-agent",
          name: "Email Agent",
          tagline: "Inbox triage, auto-reply, escalation, CRM logging.",
          href: "/products/email-agent",
          tiers: [
            {
              name: "Standard",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["1 shared inbox", "AI triage + auto-reply", "500 emails / seat / month", "Basic CRM log", "Slack notifications"],
              overage: "",
              forWhom: "Small ops team",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["3 inboxes", "Escalation rules", "2,000 emails / seat / month", "HubSpot / Pipedrive sync", "Custom reply templates"],
              overage: "",
              forWhom: "Mid-market service desk",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["Unlimited inboxes", "Custom routing rules", "Audit log + SLA", "EU DPA included", "Dedicated success manager"],
              overage: "",
              forWhom: "Regulated / high-volume",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "lead-qualifier-agent",
          name: "Lead Qualifier Agent",
          tagline: "Form / chat / voice intake → BANT scoring → CRM push.",
          href: "/products/lead-qualifier-agent",
          tiers: [
            {
              name: "Standard",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["250 qualified leads / month", "Form + chat intake", "BANT scoring", "CRM push (HubSpot, Pipedrive)", "Slack alerts"],
              overage: "",
              forWhom: "Outbound-light B2B",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["1,000 qualified leads / month", "Voice + chat + form intake", "Custom scoring model", "Routing rules", "Weekly digest"],
              overage: "",
              forWhom: "Active SDR-supported team",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["4,000 qualified leads / month", "Multi-channel intake", "Account-based scoring", "SLA", "Custom integrations"],
              overage: "",
              forWhom: "Sales-led mid-market",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "custom-automation",
          name: "Custom Automation",
          tagline: "Workflow builds — sprint, project, or retainer. Not SaaS.",
          href: "/products/custom-automation",
          tiers: [
            {
              name: "Standard",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["1 workflow built end-to-end", "Scoping + build + 30-day support", "Up to 3 integrations", "Documentation + handover", "Source code yours"],
              overage: "",
              forWhom: "Single pain point, well-defined",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["3–5 workflows", "Discovery workshop", "Build + 90-day support", "Integration + custom code", "Ops dashboard"],
              overage: "",
              forWhom: "Mid-market digital ops project",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Price on request",
              monthly: "Price on request",
              included: ["Dedicated automation engineer 4 days / month", "Unlimited workflows in scope", "Quarterly review", "Priority on incidents", "Roadmap collaboration"],
              overage: "",
              forWhom: "Ongoing transformation partner",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "kutasia",
          name: "Kutasia",
          tagline: "Unified AI workspace — WhatsApp, Telegram, Email and Voice in one inbox, with hero automations and a fair-tested demo mode.",
          href: "/products/kutasia",
          tiers: [
            {
              name: "Starter",
              setup: "€500",
              monthly: "€79/mo",
              included: ["1 channel (WhatsApp or Telegram or Email)", "500 AI conversations / month", "1 user", "Unified inbox + AI summary", "Voice-note transcription (Whisper)"],
              overage: "€0.06 / extra conversation",
              forWhom: "Solo operator or single-location SMB",
              isHighlighted: false,
            },
            {
              name: "Growth",
              setup: "€1,200",
              monthly: "€179/mo",
              included: ["3 channels (WA + TG + Email)", "2,000 AI conversations / month", "5 users", "5 hero playbooks enabled", "Multilingual triage + AI drafts"],
              overage: "€0.05 / extra conversation",
              forWhom: "Active SMB with daily customer ops",
              isHighlighted: true,
            },
            {
              name: "Scale",
              setup: "€2,500",
              monthly: "€379/mo",
              included: ["All channels + Voice (300 min)", "8,000 AI conversations / month", "Unlimited users", "Custom playbooks + automations", "WhatsApp BSP fees pass-through (no markup)"],
              overage: "€0.04 / extra conversation · €0.18 / extra voice min",
              forWhom: "Multi-staff operations, ≥daily volume",
              isHighlighted: false,
            },
          ],
        },
      ],
    },
  },
  card: {
    send: {
      triggerLabel: "Send my info",
      modalTitle: "Send my info",
      modalSubtitle: "Share your contact so we can follow up.",
      submitLabel: "Send",
      submittingLabel: "Sending…",
      closeLabel: "Close",
      successTitle: "Thank you!",
      successBody: "Your details were sent. We'll get back to you shortly.",
      successCloseLabel: "Close",
      consentRequired: "Please confirm the privacy notice.",
      submitFailed: "Sending failed. Please try again later.",
      networkError: "Network error. Please try again.",
      nameLabel: "Name",
      phoneLabel: "Phone",
      emailLabel: "Email",
      companyLabel: "Company",
      meetingContextLabel: "Where did we meet?",
      meetingContextPh: "Hannover Messe, LinkedIn, referral …",
      interestLabel: "Interest / topic",
      messageLabel: "Message",
      messagePh: "What's it about?",
      consentText: "I agree that my details may be processed for follow-up (GDPR).",
      requiredMark: "*",
    },
    qr: {
      triggerLabel: "Show QR",
      modalTitle: "Scan or share",
      modalSubtitle: "Scan with a phone camera or share the link.",
      copyLabel: "Copy link",
      copiedLabel: "Copied",
      shareLabel: "Share",
      downloadLabel: "Download QR",
      closeLabel: "Close",
    },
    wallet: {
      notConfigured:
        "Wallet support is being configured. This card will show Apple/Google Wallet buttons once activated.",
    },
    share: {
      title: "Share card",
      close: "Close",
      qrDownload: "Download QR",
      copyLink: "Copy link",
      copied: "Copied!",
      whatsapp: "Share on WhatsApp",
      whatsappHint: "Sends a large card image together with your link",
      storyDownload: "Card image (9:16)",
      storyHint: "For WhatsApp status & Instagram stories",
      vcardVisitor: "Save contact",
      vcardOwner: "My vCard (.vcf)",
      vcardOwnerHint: "Forward — saves you to their contacts",
      emailSignature: "Email signature",
      copy: "Copy",
      openCard: "Open card",
      shareButtonAriaLabel: "Share card",
    },
    error: {
      title: "This card can't be opened right now",
      body: "We couldn't load this card. Please try again in a few seconds.",
      retry: "Try again",
    },
    owner: {
      banner: "You're the owner of this card — changes go live instantly.",
      publicBannerLabel: "Your card",
      editLabel: "Edit",
      previewLabel: "Preview mode",
      shareLabel: "Share link",
      manageLabel: "Stats & links",
    },
    manage: {
      title: "Card management",
      subtitle:
        "Stats, share links, and leads for your card — everything in one place.",
      backToCard: "View card",
      editCard: "Edit card",
      statsHeading: "Last 30 days",
      statViews: "Views",
      statLeads: "Leads",
      statSaves: "Saves",
      statShares: "Shares",
      statScans: "Link scans",
      linksHeading: "Share links",
      linksHint:
        "Create a separate short link per channel — QR on print, email signature, Instagram bio — and see which one brings visitors.",
      linkLabelPlaceholder: "Label (e.g. Trade fair QR)",
      linkCodePlaceholder: "Custom code (optional)",
      linkSourcePlaceholder: "Source (e.g. instagram)",
      linkCampaignPlaceholder: "Campaign (optional)",
      createLink: "Create link",
      creating: "Creating…",
      linkLimitReached: "Link limit reached for this card.",
      codeUnavailable: "That code is taken or invalid — try another one.",
      linkCreateFailed: "Could not create the link. Please try again.",
      scansLabel: "scans",
      activeLabel: "Active",
      inactiveLabel: "Off",
      copyLabel: "Copy",
      copiedLabel: "Copied",
      qrLabel: "QR",
      disableLabel: "Turn off",
      enableLabel: "Turn on",
      noLinksYet:
        "No share links yet. Your card URL always works — short links add per-channel tracking.",
      leadsHeading: "Leads",
      leadsHint: "People who shared their contact details through your card.",
      noLeadsYet:
        "No leads yet. They appear here when someone uses “Send my info” on your card.",
      leadStatusNew: "New",
      leadStatusContacted: "Contacted",
      leadStatusQualified: "Qualified",
      leadStatusArchived: "Archived",
      notPublished:
        "This card is not published yet — links and stats activate once it goes live.",
      publicLinkLabel: "Your public card link — share this one",
      publicLinkHint:
        "Anyone with this link sees your card. Put it in chats, email signatures, QR codes.",
      privateLinkLabel: "Your private links — keep them to yourself",
      privateLinkHint:
        "This management page and your edit page are private: anyone with their links can change your card. They're in your card email — never share them.",
    },
    eventDirectory: {
      eyebrow: "Event directory",
      ctaTitle: "Going too? Create your card.",
      ctaBody:
        "Free, no account needed — your card is live in minutes and you appear in this list.",
      ctaButton: "Create my card",
      participantsHeading: "Participants",
      participantsHint:
        "Cards whose owners chose to be listed publicly. Tap one to view and save the contact.",
      emptyState:
        "No participants listed yet — be the first: create your card and join the directory.",
      searchPlaceholder: "Search by name, company or role…",
      noResults: "No participants match your search.",
    },
    mobileAppSoon:
      "Mobile app coming soon — create and manage your card on the go. Everything works in the browser today.",
    quickCreate: {
      title: "Your card in 60 seconds",
      subtitle:
        "Five fields, one button — your digital business card goes live instantly. Free, no account needed.",
      nameLabel: "Full name",
      titleLabel: "Job title",
      companyLabel: "Company",
      phoneLabel: "Phone",
      emailLabel: "Email",
      emailHint:
        "Your private edit and management links are sent here — double-check it.",
      photoLabel: "Add a photo (optional)",
      photoChange: "Change photo",
      photoHint: "JPG, PNG or WebP",
      photoError: "Photo upload failed — you can add it later in the editor.",
      submit: "Create my card — free",
      submitting: "Creating…",
      errorRequired: "Name, phone and email are required.",
      errorGeneric: "Something went wrong. Please try again.",
      designSectionLabel: "Design",
      designClassic: "Classic",
      designModern: "Modern",
      designVisual: "Visual",
      designHint:
        "Pick a starter look — you can switch designs and add more details anytime.",
      logoLabel: "Add a logo (optional)",
      logoChange: "Change logo",
      logoHint: "PNG with transparency works best",
      socialSectionLabel: "Social media (optional)",
      linkedinLabel: "LinkedIn URL",
      instagramLabel: "Instagram URL",
      xLabel: "X (Twitter) URL",
      youtubeLabel: "YouTube URL",
      facebookLabel: "Facebook URL",
      tiktokLabel: "TikTok URL",
      moreToggle: "More details",
      whatsappLabel: "WhatsApp number",
      websiteLabel: "Website",
      addressLabel: "Address",
      bioLabel: "Short bio",
      videoLabel: "YouTube / Vimeo video URL",
      fullFormLink: "Want every option? Use the detailed form",
    },
    ownerWelcome: {
      title: "Your card is live!",
      step1Title: "Share it",
      step1Body:
        "Use the Share button — it sends your public link, QR, or a big card image on WhatsApp.",
      step2Title: "Check your email",
      step2Body:
        "Your private edit and management links are there. Keep them to yourself — they control your card.",
      step3Title: "Watch it work",
      step3Body:
        "Views, contacts you receive, and per-channel share links live on your management page.",
      manageCta: "Stats & links",
      loginCta: "Log in to manage all your cards",
      loginBody:
        "Sign in with this email to manage every card from any device.",
      dismiss: "Got it",
    },
    languageSwitcher: "Language",
  },

  auth: {
    signup: {
      title: "Create your account",
      subtitle: "Create your free account with an email sign-in link or Google. No password needed.",
      emailLabel: "Email address",
      nameLabel: "Name (optional)",
      passwordLabel: "Password",
      magicLinkCta: "Send magic link",
      passwordCta: "or continue with password",
      alreadyHaveAccount: "Already have an account?",
      signInLink: "Sign in",
      expandPassword: "+ add password",
    },
    login: {
      title: "Welcome back",
      subtitle: "Sign in to manage your digital business cards.",
      emailLabel: "Email address",
      passwordLabel: "Password",
      magicLinkCta: "Send magic link",
      passwordCta: "Use an existing verified account password",
      legacyPasswordHelp: "Passwords remain available for accounts whose email was already verified. If you created a password before verifying your email, use the email sign-in link or Google. Your earlier password is removed when your email is first verified.",
      dontHaveAccount: "Don't have an account?",
      signUpLink: "Create one",
      expandPassword: "+ use password",
      orDivider: "or",
      googleCta: "Continue with Google",
    },
    magicLink: {
      title: "Check your inbox",
      subtitle: "We sent a sign-in link to",
      resendCta: "Resend link",
      sentToEmail: "Link sent to",
      resendCooldown: "Resend available in",
      seconds: "seconds",
      backToLogin: "Back to sign in",
    },
    errors: {
      invalid_email: "Please enter a valid email address.",
      weak_password: "Password must be at least 12 characters with at least one letter and one number.",
      email_in_use: "This email is already registered. Try signing in.",
      invalid_credentials: "Invalid email or password.",
      rate_limited: "Too many requests — please wait a few minutes and try again.",
      generic: "Something went wrong. Please try again.",
      invalid_input: "Please check your input and try again.",
      email_unavailable: "This email cannot be used to sign up.",
    },
  },

  dashboard: {
    cardItem: {
      editCta: "Edit",
      shareCta: "Copy link",
      deleteCta: "Delete",
      deleteConfirm: "Delete this card?",
      viewCountLabel: "Views",
      statusPublished: "Published",
      statusDraft: "Draft",
      statusDeleted: "Archived",
    },
  },

  onboarding: {
    cancel: "Cancel",
    back: "Back",
    next: "Continue",
    steps: {
      industry: "Industry",
      personal: "About you",
      preview: "Preview & publish",
    },
    industry: {
      title: "What kind of card are you making?",
      subtitle:
        "Pick a sector — we'll start with a tailored design and a sensible default palette. You can change everything later.",
      surpriseMe: "Surprise me",
      categories: {
        architecture: "Architecture",
        legal: "Legal",
        restaurant: "Restaurant",
        photography: "Photography",
        clinic: "Healthcare",
        music: "Music",
        barber: "Barber & beauty",
        retail: "Retail",
        realEstate: "Real estate",
        fitness: "Fitness",
        hospitality: "Hospitality",
        consulting: "Consulting",
        tech: "Technology",
        events: "Events",
        dentist: "Dentist",
        psychologist: "Psychologist",
        beauty: "Beauty salon",
        accounting: "Accounting",
        software: "Software",
        contentCreator: "Content creator",
        wellness: "Wellness",
        eventPlanner: "Event planner",
        auto: "Automotive",
        interior: "Interior design",
      },
      descriptions: {
        architecture: "Clean lines, stone palette",
        legal: "Authoritative, serif type",
        restaurant: "Warm, appetite-friendly",
        photography: "Editorial, image-first",
        clinic: "Calm, trust-building",
        music: "Bold, high-contrast",
        barber: "Sharp, masculine grid",
        retail: "Product-forward, lifestyle",
        realEstate: "Premium navy & gold",
        fitness: "Energetic, athletic",
        hospitality: "Refined boutique feel",
        consulting: "Editorial, executive",
        tech: "Clean, precise, modern",
        events: "Festive, celebratory",
        dentist: "Bright, friendly clinic",
        psychologist: "Soft, approachable",
        beauty: "Elegant, polished",
        accounting: "Trustworthy, structured",
        software: "Developer-minded, mono",
        contentCreator: "Vivid, personality-led",
        wellness: "Calm, organic palette",
        eventPlanner: "Romantic, ceremonial",
        auto: "Bold, performance-leaning",
        interior: "Warm, textured neutrals",
      },
    },
    personal: {
      title: "Tell us about you",
      subtitle:
        "We pre-filled what we know. Add a job title and a phone number — the rest is optional.",
      nameLabel: "Full name",
      namePlaceholder: "Anna Fischer",
      titleLabel: "Job title",
      titlePlaceholder: "Founder & Designer",
      emailLabel: "Email",
      emailHint: "Linked to your account — change it from settings later.",
      phoneLabel: "Phone",
      companyLabel: "Company",
      companyPlaceholder: "Atelier Nord",
      bioLabel: "Short bio",
      bioPlaceholder: "One or two sentences that introduce you.",
      photoLabel: "Profile photo",
      photoCta: "Drop a photo here",
      photoHint: "Drag or click to upload — JPG/PNG up to 5MB",
      photoBrowse: "Browse files",
      photoUploading: "Uploading…",
      photoUploaded: "Photo uploaded",
      photoChange: "Click the trash icon to replace",
      photoRemove: "Remove photo",
      brandColorLabel: "Brand color",
      skipCta: "Skip & finish",
    },
    preview: {
      title: "Almost there — last look",
      subtitle:
        "Review your card on the right and pick the address you'd like to share.",
      slugLabel: "Card address",
      slugChecking: "Checking…",
      slugAvailable: "Available",
      slugTaken: "Taken",
      slugTakenHint: "That address is taken — try a variation.",
      slugReset: "Reset to default",
      summaryName: "Name",
      summaryTitle: "Title",
      summaryCompany: "Company",
      summaryPhone: "Phone",
      summaryEmail: "Email",
      livePreviewLabel: "Live preview",
      previewFallbackName: "Your name",
      publishCta: "Publish my card",
      publishingState: "Publishing…",
      draftCta: "Save as draft",
      draftingState: "Saving…",
    },
    errors: {
      name_too_short: "Name must be at least 2 characters.",
      name_too_long: "Name is too long.",
      title_required: "Add a job title (or click 'Skip & finish').",
      phone_invalid: "That phone number doesn't look right.",
      brand_invalid: "Use a 6-digit hex (e.g. #1a365d).",
      slug_invalid: "Use 3+ characters: lowercase letters, numbers, hyphens.",
      slug_taken: "That address is already taken — please pick another.",
      upload_failed: "Upload failed — please try a different file.",
      upload_too_large: "That image is over 5MB — try a smaller one.",
      network_error: "Something went wrong — check your connection and retry.",
    },
  },
};

type DeepString<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepString<U>[]
    : T extends object
      ? { [K in keyof T]: DeepString<T[K]> }
      : T;

export type Content = DeepString<typeof content>;
