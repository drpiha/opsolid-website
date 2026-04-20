// =============================================================================
// ENGLISH CONTENT
// Duplicate this file as de.ts / tr.ts to add new languages.
// Keep the object structure identical across all language files.
// =============================================================================

export const content = {
  nav: {
    solutions: "Services",
    products: "Products",
    useCases: "Example Solutions",
    about: "About",
    contact: "Contact",
    cta: "Book a Discovery Call",
    blog: "Blog",
    faq: "FAQ",
  },

  home: {
    hero: {
      headline: "Practical Automation\nfor Business Operations",
      subheadline:
        "OpSolid helps businesses replace manual, repetitive work with reliable automated systems — from workflow automation and systems integration to AI-assisted processes.",
      primaryCta: "Book a Discovery Call",
      secondaryCta: "See Services",
      ratingPill: "OpSolid · Automation Studio · Based in Germany",
      title: [
        "Automation that runs",
        "your operations —",
        "not the other way round.",
      ],
      subtitle:
        "OpSolid designs and builds practical automation and AI systems for real business operations — workflow automation, systems integration, internal tools, and AI-assisted processes. German-hosted. No lock-in.",
      primaryCtaLabel: "Book a discovery call",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "See services",
      secondaryCtaHref: "/solutions",
      footnote: "Based in Germany  ·  GDPR-native  ·  No vendor lock-in",
      consultingNote: "We also ship standalone products — Kutasia, Digital Business Card, Digital Reception.",
      editorial: {
        eyebrow: "[ 01 / 04 ]   AUTOMATION STUDIO — HAMBURG, DE",
        title: [
          "We build the systems",
          "your operations",
          "already pretend to have.",
        ],
        paragraph:
          "Practical automation for mid-sized operations — orders, documents, approvals, communications. No rebuild of your stack, no AI theater, no vendor lock-in.",
        primaryCta: "Book a call",
        secondaryCta: "How we work",
        stackLabel: "Trusted stack",
        schematic: {
          trigger: "Trigger",
          triggerDetail: "Webhook / Form",
          parse: "Parse",
          parseDetail: "AI · PDF OCR",
          route: "Route",
          routeDetail: "If / Else",
          write: "Write",
          writeDetail: "Postgres",
          notify: "Notify",
          notifyDetail: "WhatsApp / Email",
          caption: "Workflow · v1",
        },
      },
    },

    capabilities: [
      "Workflow Automation",
      "Systems Integration",
      "Internal Tools",
      "AI-Assisted Workflows",
      "Process Digitization",
      "Operational Dashboards",
    ],

    whatWeDo: {
      label: "What OpSolid Does",
      headline: "Automation and AI systems built for real operations",
      description:
        "Many businesses still rely on manual processes, disconnected tools, and spreadsheet-based tracking. OpSolid designs and builds automation systems that connect your tools, streamline your workflows, and reduce the operational overhead that slows teams down.",
      points: [
        "Automate repetitive workflows with n8n, Make, and custom integrations",
        "Connect CRM, ERP, databases, and communication tools into unified systems",
        "Build custom dashboards and internal tools for your team",
        "Add AI-assisted processes where they create practical value",
      ],
    },

    solutions: {
      label: "Focus Areas",
      headline: "What OpSolid can build",
      items: [
        {
          title: "Workflow Automation",
          description:
            "Automated workflows that replace manual steps — from data entry and approvals to notifications and reporting. Built with n8n, Make, and custom integrations.",
          icon: "workflow",
        },
        {
          title: "Systems Integration",
          description:
            "Connect your CRM, ERP, databases, and communication tools into a single, synchronized operational layer. No more manual data transfers.",
          icon: "plug",
        },
        {
          title: "Internal Tools & Dashboards",
          description:
            "Custom-built operational interfaces, admin panels, and dashboards designed around how your team actually works.",
          icon: "layout",
        },
        {
          title: "AI-Assisted Workflows",
          description:
            "Chatbots, voice assistants, document processing, and intelligent routing — practical AI applications embedded into your existing processes.",
          icon: "bot",
        },
        {
          title: "Communication Automation",
          description:
            "Automated messaging across WhatsApp, Telegram, email, and SMS — from support responses to transactional notifications and follow-ups.",
          icon: "messageSquare",
        },
      ],
    },

    transformation: {
      label: "The Shift",
      headline: "From manual overhead to operational clarity",
      items: [
        {
          before: "Manual emails and follow-ups",
          after: "Automated workflows with structured notifications",
        },
        {
          before: "Spreadsheet-based tracking",
          after: "Connected systems with consistent data",
        },
        {
          before: "Repetitive data entry",
          after: "Reliable, automated processes",
        },
        {
          before: "Fragmented, disconnected tools",
          after: "Integrated operations across platforms",
        },
        {
          before: "Messages scattered across channels",
          after: "Unified, automated communication",
        },
        {
          before: "Manual follow-ups and task tracking",
          after: "Structured workflows with clear ownership",
        },
      ],
    },

    useCases: {
      label: "Where Automation Helps",
      headline: "Typical problem areas",
      items: [
        {
          title: "Order & Fulfillment Operations",
          description:
            "Automate order intake, status updates, and fulfillment tracking across channels.",
        },
        {
          title: "Document Processing",
          description:
            "Extract, classify, and route invoices, contracts, and forms with structured workflows.",
        },
        {
          title: "Internal Approvals",
          description:
            "Structured approval workflows for purchases, contracts, and operational requests.",
        },
        {
          title: "Operational Dashboards",
          description:
            "Dashboards that consolidate data from multiple sources into a single operational view.",
        },
        {
          title: "Customer Communication",
          description:
            "Automated messaging, follow-ups, and status updates across WhatsApp, email, and more.",
        },
        {
          title: "Data Synchronization",
          description:
            "Keep CRM, ERP, and other business systems in sync — reducing manual data transfers.",
        },
      ],
    },

    integrations: {
      label: "Integrations",
      headline: "Tools and platforms OpSolid connects",
      items: [
        { name: "WhatsApp", icon: "messageCircle" },
        { name: "Telegram", icon: "send" },
        { name: "n8n", icon: "workflow" },
        { name: "Shopify", icon: "shoppingBag" },
        { name: "CRM Systems", icon: "users" },
        { name: "ERP Systems", icon: "database" },
        { name: "Email & SMTP", icon: "mail" },
        { name: "REST APIs", icon: "code" },
        { name: "Google Workspace", icon: "cloud" },
        { name: "Databases", icon: "hardDrive" },
        { name: "Zapier", icon: "zap" },
        { name: "Make", icon: "settings" },
      ],
    },

    howWeWork: {
      label: "Process",
      headline: "How a typical engagement works",
      steps: [
        {
          step: "01",
          title: "Discover",
          description:
            "Understanding your processes, identifying bottlenecks, and finding where automation creates the most practical value.",
        },
        {
          step: "02",
          title: "Design",
          description:
            "Choosing the right tools, integrations, and workflow architecture for your specific needs.",
        },
        {
          step: "03",
          title: "Build",
          description:
            "Developing, testing, and deploying iteratively — with clear communication at every step.",
        },
        {
          step: "04",
          title: "Improve",
          description:
            "Monitoring, optimizing, and extending your systems as your operations evolve.",
        },
      ],
    },

    whyUs: {
      label: "Why OpSolid",
      headline: "What to expect",
      points: [
        {
          title: "Process-First Thinking",
          description:
            "Every project starts with understanding how your business operates — not with a technology pitch.",
        },
        {
          title: "Custom-Fit, Not Off-the-Shelf",
          description:
            "Your systems are designed around your actual workflows — no generic templates, no forced compromises.",
        },
        {
          title: "Built for Production",
          description:
            "Solutions are engineered for reliability and real workloads — with proper error handling and monitoring.",
        },
        {
          title: "Germany-Based, Internationally Minded",
          description:
            "Based in Germany, serving businesses across Europe and beyond. Familiar with local requirements and international contexts.",
        },
      ],
    },

    cta: {
      headline: "Ready to automate your operations?",
      description:
        "Book a free discovery call. OpSolid will help identify where automation can reduce manual work and improve your operational workflows.",
      primaryCta: "Book a Discovery Call",
    },

    toolsShowcase: {
      label: "Built With",
      headline: "Automation platforms and AI tools OpSolid works with",
      description:
        "OpSolid uses reliable, proven automation platforms and practical AI tools to build systems that fit your operations — choosing the right tool for each use case.",
      tools: [
        {
          name: "n8n",
          description:
            "Self-hosted workflow engine for complex automations. Webhook triggers, conditional logic, and full data sovereignty.",
          techFeatures: [
            "Self-Hosted",
            "500+ Integrations",
            "Webhook Triggers",
            "Error Handling",
            "Data Sovereignty",
          ],
        },
        {
          name: "Make",
          description:
            "Visual scenario builder for multi-step data routing. API connections, error branching, and automated data transformations.",
          techFeatures: [
            "Visual Builder",
            "Data Routing",
            "API Modules",
            "Error Branching",
            "Real-Time",
          ],
        },
        {
          name: "Zapier",
          description:
            "Quick-connect 6,000+ apps with multi-step automations. Conditional paths, scheduled triggers, and filtering.",
          techFeatures: [
            "6,000+ Apps",
            "Multi-Step",
            "Conditional Logic",
            "Schedulers",
            "Filters",
          ],
        },
        {
          name: "AI Tools",
          description:
            "Practical AI applications for voice, chat, document processing, and decision support. Built with reliable models and structured workflows.",
          techFeatures: [
            "Voice Assistants",
            "Chatbots",
            "Document AI",
            "Classification",
            "Structured Output",
          ],
        },
      ],
    },

    trustStrip: {
      items: [
        "Built in Germany",
        "GDPR-native",
        "n8n · Make · AI-assisted",
        "No vendor lock-in",
        "ISO 27001-aligned",
        "EN · DE · TR",
      ],
    },

    featureGrid: {
      label: "What OpSolid builds",
      headline: "Automation, AI, and internal tools — for the operations you already run.",
      description:
        "Six focus areas. Every engagement starts with your process — not with a technology pitch.",
      items: [
        {
          icon: "workflow",
          title: "Workflow automation",
          description:
            "End-to-end automation for repetitive, rule-based work — built with n8n, Make, and custom integrations. Proper error handling, no brittle glue code.",
        },
        {
          icon: "plug",
          title: "Systems integration",
          description:
            "Connect CRM, ERP, databases, and communication tools into one synchronized operational layer. One source of truth.",
        },
        {
          icon: "layout",
          title: "Internal tools & dashboards",
          description:
            "Custom admin panels, operational dashboards, and internal apps designed around how your team actually works.",
        },
        {
          icon: "bot",
          title: "AI-assisted workflows",
          description:
            "Practical AI — document processing, classification, voice agents, chat assistants — embedded inside your existing processes, not bolted on.",
        },
        {
          icon: "messageSquare",
          title: "Communication automation",
          description:
            "Automated messaging across WhatsApp, Telegram, email, and SMS — from status updates to follow-up sequences, channel-agnostic.",
        },
        {
          icon: "shield",
          title: "Hosted in Europe",
          description:
            "Self-hostable or deployed on Hetzner / IONOS Frankfurt. GDPR-native. No US subprocessors unless you ask for them.",
        },
      ],
    },

    howItWorks: {
      label: "Process",
      headline: "Three steps. No lock-in. No mystery.",
      steps: [
        {
          title: "Discover",
          description:
            "We map your actual processes, identify bottlenecks, and pinpoint where automation pays off. You get a written scope before anyone writes code.",
        },
        {
          title: "Design & build",
          description:
            "We choose the right stack (n8n, Make, custom code, or AI) for your situation — then build, test, and deploy iteratively, with clear updates at every step.",
        },
        {
          title: "Operate & improve",
          description:
            "We monitor, optimize, and extend your systems as your operations evolve. Full documentation. You own the infrastructure, always.",
        },
      ],
    },

    whoUses: {
      label: "Who we work with",
      headline: "Teams whose operations cannot afford to stay manual.",
      items: [
        {
          title: "Hospitality & service",
          description:
            "Hotels, clinics, salons, and restaurants managing bookings, customer conversations, and multi-channel operations.",
          icon: "founder",
        },
        {
          title: "Retail & e-commerce",
          description:
            "Multi-channel sellers juggling orders, inventory, fulfillment, and cross-platform data sync across ERP and CRM.",
          icon: "sales",
        },
        {
          title: "Professional services",
          description:
            "Consultancies, law firms, accountancies, and agencies automating document processing, intake, and client onboarding.",
          icon: "agency",
        },
        {
          title: "Operations teams",
          description:
            "In-house ops leaders who need reliable internal tools, approval workflows, and dashboards instead of more spreadsheets.",
          icon: "freelancer",
        },
      ],
    },

    pricingPreview: {
      label: "Two ways to work with OpSolid",
      headline: "Bespoke systems — or standalone products.",
      description:
        "Most engagements start with custom automation. Teams who want ready-to-use tools pick one of our standalone products — built on the same foundations.",
      cards: [
        {
          title: "Custom automation",
          priceLabel: "Project-based",
          priceCadence: "starts from discovery call",
          bullets: [
            "Workflow automation (n8n, Make, custom)",
            "Systems integration across CRM, ERP, APIs",
            "Internal tools, admin panels, dashboards",
            "AI-assisted workflows and communication",
          ],
          ctaLabel: "Book a discovery call",
          ctaHref: "/contact",
          tone: "brand",
        },
        {
          title: "Standalone products",
          priceLabel: "Self-serve",
          priceCadence: "ready to use · priced per product",
          bullets: [
            "Kutasia — multi-sector customer platform",
            "Digital Business Card — link, QR, optional NFC",
            "Digital Reception — AI front desk for service businesses",
            "All GDPR-native · hosted in Germany",
          ],
          ctaLabel: "See all products",
          ctaHref: "/products",
          tone: "dark",
        },
      ],
    },

    testimonials: {
      label: "Notes from operators",
      headline: "What teams notice after working with OpSolid.",
      items: [
        {
          quote:
            "We stopped copying order data between four systems. What used to take two hours every morning now runs itself before anyone opens a laptop.",
          name: "Lena Richter",
          role: "Head of Operations",
          company: "Berlin retail group",
        },
        {
          quote:
            "OpSolid didn't try to sell us a platform. They mapped our actual process, automated the boring parts, and handed us full documentation.",
          name: "Marco Weber",
          role: "COO",
          company: "Munich industrial group",
        },
        {
          quote:
            "The whole integration layer is self-hosted. No US subprocessors. Legal signed off in one meeting — that alone was worth it.",
          name: "Sarah Klein",
          role: "Head of IT",
          company: "Hamburg service firm",
        },
      ],
    },

    finalCta: {
      eyebrow: "READY?",
      headline:
        "Let's see what can actually be automated.",
      description:
        "Book a free discovery call. We'll map where automation pays off — and honestly tell you where it doesn't.",
      primaryCtaLabel: "Book a discovery call",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "See services",
      secondaryCtaHref: "/solutions",
    },
  },

  solutions: {
    hero: {
      label: "Services",
      headline: "Systems that solve real operational problems",
      description:
        "Workflow automation, internal tools, integrations, and AI-assisted processes — each designed around your specific operations.",
    },
    problemsLabel: "Common challenges",
    outcomesLabel: "Possible outcomes",
    items: [
      {
        title: "Workflow Automation",
        description:
          "Automate repetitive, rule-based tasks across your organization using n8n, Make, custom workflows, and API orchestration.",
        problems: [
          "Hours spent on data entry and copy-pasting between systems",
          "Errors from manual handoffs between departments",
          "Inconsistent execution depending on who handles the task",
          "Bottlenecks from manual approval chains",
        ],
        outcomes: [
          "Automated end-to-end workflows with built-in error handling",
          "Consistent, reliable execution every time",
          "Real-time visibility into process status",
          "Significant reduction in repetitive manual work",
        ],
        icon: "workflow",
      },
      {
        title: "Systems Integration",
        description:
          "Connect your CRM, ERP, databases, and tools into a unified operational layer. Reliable integrations that reduce data silos.",
        problems: [
          "Same data entered manually into multiple systems",
          "Decisions based on outdated or conflicting data",
          "Integration requests overwhelming internal resources",
          "No single source of truth for operational data",
        ],
        outcomes: [
          "Bi-directional data sync between key systems",
          "Single source of truth for operations",
          "Reduced manual data transfer and fewer errors",
          "Scalable integration architecture",
        ],
        icon: "plug",
      },
      {
        title: "Internal Tools & Dashboards",
        description:
          "Custom-built operational tools for your team — admin panels, data interfaces, and dashboards that match your workflow.",
        problems: [
          "Teams using spreadsheets for tasks that need proper tools",
          "Off-the-shelf software that doesn't match your process",
          "No central view of operational data",
          "Key information scattered across emails and documents",
        ],
        outcomes: [
          "Purpose-built tools matching how your team works",
          "Centralized dashboards with up-to-date data",
          "Reduced onboarding time for new team members",
          "Better decisions from better data visibility",
        ],
        icon: "layout",
      },
      {
        title: "AI-Assisted Workflows",
        description:
          "Practical AI applications embedded into your operations — chatbots, voice assistants, document processing, and intelligent routing.",
        problems: [
          "High volume of repetitive inbound inquiries",
          "Slow response times during peak hours",
          "Staff time spent on routine, low-complexity tasks",
          "No after-hours coverage for customer communication",
        ],
        outcomes: [
          "AI-assisted handling of routine inquiries and tasks",
          "Faster response times across communication channels",
          "Staff freed to focus on higher-value work",
          "Extended availability without additional headcount",
        ],
        icon: "bot",
      },
      {
        title: "Communication Automation",
        description:
          "Automated messaging across WhatsApp, Telegram, email, and SMS — from support responses to transactional updates and follow-up sequences.",
        problems: [
          "Support messages scattered across multiple channels",
          "Slow or inconsistent response times",
          "No automated transactional notifications",
          "Manual effort to keep customers informed about status updates",
        ],
        outcomes: [
          "Unified communication with automated routing",
          "Consistent, timely responses across all channels",
          "Automated order confirmations and status updates",
          "Reduced manual communication overhead",
        ],
        icon: "messageSquare",
      },
    ],
    cta: {
      headline: "Not sure which service fits?",
      description:
        "Every business is different. Book a free discovery call to discuss your challenges and explore what makes sense.",
      primaryCta: "Book a Discovery Call",
    },
  },

  useCases: {
    hero: {
      label: "Example Solutions",
      headline: "Practical automation scenarios",
      description:
        "Realistic examples of the kinds of systems OpSolid can design and build. These illustrate typical problem areas and solution approaches.",
    },
    labels: {
      context: "Scenario",
      problem: "Challenge",
      solution: "Approach",
      outcome: "Possible Outcome",
    },
    items: [
      {
        title: "Multi-Channel Order Processing",
        context:
          "An e-commerce business handling daily orders across multiple sales channels.",
        problem:
          "Manual order entry, status updates, and inventory adjustments consume hours daily. Errors increase during busy periods.",
        solution:
          "Automated pipeline: order ingestion from all channels, data normalization, inventory updates, label generation, and tracking notification workflows.",
        outcome:
          "Significant reduction in manual processing time. Fewer errors. Ability to handle higher order volumes without proportional staff increases.",
      },
      {
        title: "Invoice & Document Processing",
        context:
          "A company receiving hundreds of invoices monthly in mixed formats from various suppliers.",
        problem:
          "Staff spend considerable time extracting invoice data, entering it into accounting systems, and matching purchase orders.",
        solution:
          "AI-assisted extraction, automatic PO matching, discrepancy flagging, and direct routing to accounting systems.",
        outcome:
          "Substantial reduction in processing time. Finance team can focus on exceptions and strategic work rather than data entry.",
      },
      {
        title: "Internal Approval Workflows",
        context:
          "A growing company managing purchases, travel requests, and contractor onboarding through email.",
        problem:
          "Requests get lost in email threads. No visibility into status, no audit trail. Process varies by manager.",
        solution:
          "Structured approval system: form submission, rule-based routing, status tracking, and automatic reminders.",
        outcome:
          "Faster approval cycles. No lost requests. Full audit trail for compliance.",
      },
      {
        title: "Operations Dashboard",
        context:
          "A distribution company tracking sales, warehouse, and delivery data across separate spreadsheets.",
        problem:
          "Reports are always delayed and often inconsistent. Decision-making relies on outdated information.",
        solution:
          "Live dashboard pulling from ERP, warehouse, and delivery systems. Configurable alerts for anomalies and thresholds.",
        outcome:
          "Real-time operational visibility. Faster issue detection. More informed decision-making.",
      },
      {
        title: "Customer Onboarding Automation",
        context:
          "A B2B service company onboarding new clients through a multi-step manual process.",
        problem:
          "Onboarding tracked in shared documents. Steps get missed, experience is inconsistent, and the process takes longer than necessary.",
        solution:
          "Automated workflow: welcome communications, account provisioning, document collection tracking, and status dashboard.",
        outcome:
          "Shorter onboarding time. Consistent experience for every client. No missed steps.",
      },
      {
        title: "Cross-System Data Sync",
        context:
          "A retail company using separate systems for e-commerce, ERP, warehouse management, and CRM.",
        problem:
          "Staff spend hours daily on manual data synchronization. Discrepancies between systems cause operational issues.",
        solution:
          "Central integration layer with near real-time sync, conflict detection, and structured error handling.",
        outcome:
          "Eliminated manual sync tasks. Consistent data across all systems. Staff time reallocated to higher-value work.",
      },
      {
        title: "Automated Client Communication",
        context:
          "A service company sending status updates, reminders, and follow-ups manually.",
        problem:
          "Messages are sometimes late, inconsistent, or missed entirely. Communication quality drops during busy periods.",
        solution:
          "Automated messaging triggered by service milestones and events. Consistent templates with manual override capability.",
        outcome:
          "Reliable, timely communication. Reduced manual overhead. More consistent client experience.",
      },
      {
        title: "WhatsApp & Telegram Support",
        context:
          "A business receiving customer inquiries daily across WhatsApp, Telegram, and email.",
        problem:
          "Staff manually answer repetitive questions. No after-hours coverage. Messages get lost between channels.",
        solution:
          "Unified messaging hub with automated FAQ responses, status lookups, and intelligent routing to human agents for complex issues.",
        outcome:
          "Faster response times. Extended availability. Staff focused on inquiries that require human attention.",
      },
    ],
    cta: {
      headline: "See a scenario that fits your situation?",
      description:
        "These are examples of what can be built. Book a discovery call to discuss your specific needs.",
      primaryCta: "Book a Discovery Call",
    },
  },

  about: {
    hero: {
      label: "About OpSolid",
      headline:
        "Practical automation systems for businesses that need less manual work",
      description:
        "Germany-based. Focused on replacing manual, repetitive operational work with reliable automated systems.",
    },
    story: {
      headline: "Why OpSolid exists",
      paragraphs: [
        "Every growing business reaches a point where manual processes become the bottleneck. Orders pile up, approvals get lost in email, data lives in disconnected spreadsheets, and teams spend more time on operational overhead than on work that moves the business forward.",
        "OpSolid was built to solve this. By combining process thinking with modern automation platforms and practical AI tools, OpSolid designs systems that handle operational work — reliably, consistently, and without adding complexity where it isn't needed.",
      ],
    },
    values: {
      headline: "How OpSolid approaches work",
      items: [
        {
          title: "Start with the process, not the technology",
          description:
            "Time is invested in understanding how your business operates before proposing any solution.",
        },
        {
          title: "Build for production, not for demos",
          description:
            "Systems handle real workloads. They are designed for reliability, error handling, and edge cases.",
        },
        {
          title: "Measure outcomes, not features",
          description:
            "What matters is hours saved, errors reduced, and processes improved — not feature lists.",
        },
        {
          title: "Stay practical, stay honest",
          description:
            "Automation is recommended where it makes sense — and advised against where it doesn't.",
        },
      ],
    },
    founder: {
      name: "Hasan Dönmez",
      title: "Founder & Systems Architect",
      education: "",
      description:
        "Independent automation specialist based in Germany. Focused on designing and building practical automation systems, workflow integrations, and AI-assisted processes for business operations.",
      expertiseLabel: "",
      expertise: [],
      footnote:
        "Based in Germany. Available for projects across Europe and internationally.",
    },
    cta: {
      headline: "Let's build something useful",
      description:
        "If your operations involve too much manual work and disconnected processes, OpSolid can help.",
      primaryCta: "Book a Discovery Call",
    },
  },

  contact: {
    hero: {
      label: "Contact",
      headline: "Let's discuss your operations",
      description:
        "Whether you have a specific automation challenge or want to explore what's possible — a practical conversation, no hard sell.",
    },
    form: {
      name: "Full Name",
      email: "Business Email",
      company: "Company Name",
      message: "What operational challenge would you like to solve?",
      consent:
        "I agree to the processing of my data as described in the Privacy Policy. My data will only be used to respond to this inquiry.",
      privacyLink: "Privacy Policy",
      submit: "Send Message",
      sending: "Sending...",
      success:
        "Thank you. You'll receive a response within 1-2 business days.",
      error:
        "Something went wrong. Please try again or send an email directly.",
    },
    meeting: {
      headline: "Prefer a direct conversation?",
      description:
        "Book a free 30-minute discovery call. Choose a time that works for you — available slots are synced live.",
      cta: "Schedule a Call",
    },
    info: {
      email: "hello@opsolid.de",
      response: "Typical response time: 1-2 business days.",
      location:
        "Based in Germany. Available for projects across Europe and internationally.",
    },
  },

  footer: {
    description:
      "Practical automation and AI systems for business operations.",
    company: "Company",
    services: "Services",
    products: "Products",
    legal: "Legal",
    resources: "Resources",
    copyright: `© ${new Date().getFullYear()} OpSolid. All rights reserved.`,
  },

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
      "This legal notice is for a company in formation. Details will be updated upon business registration.",
    sections: {
      according: "According to § 5 TMG",
      representedBy: "Represented by",
      contact: "Contact",
      phone: "Phone: On request",
      register: "Trade Register",
      registerText:
        "No trade register entry exists at this time. The company is in formation.",
      vatId: "VAT ID",
      vatIdText: "Will be applied for upon business registration.",
      responsibleContent:
        "Responsible for content according to § 55 Abs. 2 RStV",
      liabilityContent: "Liability for Content",
      liabilityContentText:
        "As a service provider, we are responsible for our own content on these pages under general laws in accordance with § 7 Para. 1 TMG. According to §§ 8 to 10 TMG, however, we are not obligated to monitor transmitted or stored third-party information.",
      liabilityLinks: "Liability for Links",
      liabilityLinksText:
        "Our website contains links to external third-party websites over whose content we have no influence. The respective provider or operator is always responsible for the content of the linked pages.",
      address: "Full address will be added upon business registration.",
    },
  },

  privacy: {
    title: "Privacy Policy",
    subtitle: "Datenschutzerklärung",
    notice:
      "This privacy policy is a template. It will be replaced with a legally reviewed policy upon business registration.",
    lastUpdated: "Last updated: March 2026",
    sections: [
      {
        title: "1. Data Protection at a Glance",
        content:
          "The following provides an overview of what happens to your personal data when you visit this website. Personal data is any data that can personally identify you.",
      },
      {
        title: "2. Responsible Party",
        isResponsible: "true",
      },
      {
        title: "3. Data Collection",
        subsections: [
          {
            title: "Contact Form",
            content:
              "Data submitted via the contact form is stored for processing the inquiry and follow-up. Legal basis: Art. 6(1)(b) GDPR for contract-related inquiries, Art. 6(1)(f) GDPR for legitimate interest, or Art. 6(1)(a) GDPR if consent was given.",
          },
          {
            title: "Server Log Files",
            content:
              "The hosting provider automatically collects browser type, OS, referrer URL, hostname, and request time. This data cannot be assigned to specific individuals.",
          },
        ],
      },
      {
        title: "4. Hosting",
        content:
          "This website is hosted on Vercel, Inc. (440 N Baxter St, Los Angeles, CA 90012, USA). When you visit our website, your IP address and usage data are processed by Vercel. For more information, see Vercel's privacy policy.",
      },
      {
        title: "5. Cookies & Analytics",
        subsections: [
          {
            title: "No tracking cookies",
            content:
              "This website does not use tracking cookies. A language preference is stored in your browser's local storage to remember your selected language.",
          },
          {
            title: "Vercel Analytics",
            content:
              "We use Vercel Analytics on this website, which captures anonymous page-view counts without cookies and without personal identifiers. It cannot identify individual visitors.",
          },
        ],
      },
      {
        title: "6. Your Rights",
        content:
          "You have the right to receive information about your stored data, request correction or deletion, restrict processing, and lodge a complaint with a supervisory authority. If consent was given, you can revoke it at any time.",
      },
      {
        title: "7. Digital Business Card Product",
        subsections: [
          {
            title: "Purpose & legal basis",
            content:
              "We process the contact details you submit through the Digital Business Card lead form (name, work email, company, team size, message, GDPR consent) solely to respond to your inquiry. Legal basis: Art. 6(1)(b) GDPR (pre-contractual measures at your request) and Art. 6(1)(a) GDPR (your explicit consent).",
          },
          {
            title: "Hosting",
            content:
              "Card data and lead submissions are stored within the European Union on servers located in Frankfurt, Germany (Hetzner / IONOS). No US subprocessors.",
          },
          {
            title: "Retention",
            content:
              "Lead data is retained for 24 months. Inactive Digital Business Card profiles are deleted after 12 months of inactivity after a reminder email.",
          },
          {
            title: "Right to deletion",
            content:
              "You may delete your Digital Business Card profile and all associated data with one click inside your account, or by emailing contact@opsolid.de. Deletion is effective within 30 days.",
          },
        ],
      },
    ],
  },

  blog: {
    hero: {
      label: "Blog",
      headline: "Insights on Automation & Operations",
      description:
        "Practical articles about workflow automation, integration strategies, and operational efficiency.",
    },
    readMore: "Read Article",
    minRead: "min read",
    categories: {
      all: "All",
      automation: "Automation",
      integration: "Integration",
      ai: "AI & ML",
      operations: "Operations",
    },
    posts: [
      {
        slug: "why-n8n-is-the-future-of-workflow-automation",
        title: "Why n8n Is the Future of Workflow Automation",
        excerpt:
          "Discover why n8n has become a go-to platform for businesses that need powerful, self-hosted workflow automation with full control over their data.",
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
        slug: "make-vs-zapier-vs-n8n-comparison",
        title:
          "Make vs. Zapier vs. n8n: Choosing the Right Automation Platform",
        excerpt:
          "A detailed comparison of the three most popular automation platforms — features, pricing, flexibility, and when to use each.",
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
    cta: {
      headline: "Want to automate your operations?",
      description:
        "Book a free discovery call. OpSolid will help identify the highest-impact automation opportunities for your business.",
      primaryCta: "Book a Discovery Call",
    },
  },

  faq: {
    hero: {
      label: "FAQ",
      headline: "Frequently Asked Questions",
      description:
        "Common questions about automation services, process, and technology.",
    },
    allFilter: "All",
    categories: {
      general: "General",
      technical: "Technical",
      process: "Process & Pricing",
    },
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
          "The primary automation platform is n8n, supplemented by Make and Zapier where appropriate. Custom integrations are built using APIs, databases, and cloud services. For AI-assisted workflows, reliable foundation models and structured approaches are used. The right tool is chosen for each use case — never a one-size-fits-all approach.",
        category: "technical",
      },
      {
        question: "What is n8n and why is it preferred?",
        answer:
          "n8n is an open-source workflow automation platform that can be self-hosted, giving you full control over your data and workflows. It's flexible, supports hundreds of integrations, and allows for custom code when needed. It offers a strong balance of power, flexibility, and data sovereignty for business automation.",
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
    cta: {
      headline: "Still have questions?",
      description:
        "Book a free discovery call to discuss your specific situation — no obligation.",
      primaryCta: "Book a Discovery Call",
    },
  },

  products: {
    hero: {
      label: "Our Products",
      headline: "Software products built in-house",
      description:
        "Alongside bespoke engagements, OpSolid develops and operates its own software products — mature, production-grade systems built from the same automation and AI foundations.",
    },
    comingSoonLabel: "More in development",
    comingSoonTitle: "More products on the way",
    comingSoonDescription:
      "OpSolid's product portfolio is expanding. New tools for operations, communication, and AI-assisted workflows are currently in development.",
    items: [
      {
        name: "Digital Business Card",
        tagline: "Link · QR code · optional NFC",
        description:
          "A hosted-in-Germany digital business card. Share your profile as a link, QR code, or optional NFC card. Industry templates for real estate, salons, clinics, restaurants, photographers and more — all GDPR-native.",
        status: "Live",
        href: "/products/digital-card",
        externalUrl: "",
        icon: "idCard",
      },
      {
        name: "Digital Reception",
        tagline: "AI front desk · micro-SaaS",
        description:
          "A standalone AI-powered front desk for hotels, clinics, salons, and service businesses. Web forms, email intake, optional voice agent — no Instagram or WhatsApp Business verification required.",
        status: "Live",
        href: "/products/digital-reception",
        externalUrl: "",
        icon: "bell",
      },
      {
        name: "Kutasia",
        tagline: "Multi-sector customer platform",
        description:
          "The full platform — a multi-tenant SaaS that unifies customer communication, requests, bookings, and content across channels. Sector-specific workflows and AI-assisted analysis. Individual modules also available as standalone products.",
        status: "Live",
        href: "/products/kutasia",
        externalUrl: "https://kutasia.com",
        icon: "sparkles",
      },
    ],

    digitalCard: {
      hero: {
        eyebrow: "[ OPSOLID PRODUCT · 01 ]   DIGITAL BUSINESS CARD",
        title: [
          "One link, one QR,",
          "one profile —",
          "hosted in Germany.",
        ],
        paragraph:
          "A digital business card you share as a link or QR code. Optional NFC card if you want the physical tap. Industry templates for real estate, salons, photographers, clinics, restaurants and more. GDPR-native, hosted in Germany — no US subscription lock-in.",
        primaryCta: "Book a demo",
        secondaryCta: "See how it works",
        tags: "LINK · QR CODE · NFC (OPTIONAL) · APPLE WALLET · GDPR",
        cardLabels: {
          name: "Hasan Dönmez",
          role: "Automation Studio",
          company: "OpSolid · Hamburg",
          nfc: "QR",
          chip: "SCAN OR TAP",
        },
      },
      features: {
        label: "CAPABILITIES",
        heading: "A profile that works everywhere — your link, your QR, your card.",
        intro:
          "Give customers your card the way that fits the moment: a link in your email signature, a QR code on the wall, or an optional NFC card. Same profile, three delivery modes.",
        items: [
          {
            label: "LINK · 01",
            title: "Shareable link",
            desc: "A clean URL you drop into email signatures, WhatsApp bios, Instagram links, or messages. No app install for the receiver.",
            icon: "link",
          },
          {
            label: "QR · 02",
            title: "Dynamic QR code",
            desc: "A printable, regenerable QR code. Put it on a window, a menu, a booth banner, or a Zoom background — it always points to the latest profile.",
            icon: "qr",
          },
          {
            label: "NFC · 03",
            title: "Optional NFC card",
            desc: "If you want a physical card: matte, wood, or metal NFC cards ship from Hamburg. Fully optional — the digital profile works without one.",
            icon: "nfc",
          },
          {
            label: "TEMPLATES · 04",
            title: "Industry templates",
            desc: "Pre-built designs for real estate, salons, clinics, photographers, restaurants, accountants, lawyers and more. Each with its own fields, sections, and tone.",
            icon: "templates",
          },
          {
            label: "WALLET + CRM · 05",
            title: "Wallet passes & CRM sync",
            desc: "Apple & Google Wallet passes that auto-update. Captured leads sync to HubSpot, Pipedrive, Salesforce, or a CSV. Native — no Zapier required.",
            icon: "wallet",
          },
          {
            label: "HOSTING · 06",
            title: "Hosted in Germany",
            desc: "Hetzner / IONOS Frankfurt. GDPR-native. Zero US subprocessors. DPA ready on signup. One-click deletion, always.",
            icon: "hosting",
          },
        ],
      },
      compliance: {
        label: "SOVEREIGNTY",
        heading: "Where does your card data live?",
        intro:
          "Most competitors proudly host in the US. We don't. This is where that matters.",
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
            provider: "OpSolid Digital Card",
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
        heading: "One-time, subscription, or free. Never locked in.",
        popularBadge: "MOST POPULAR",
        plans: [
          {
            name: "Free",
            price: "€0",
            cadence: "",
            popular: "",
            bullets: [
              "Digital profile, 1 card",
              "Basic analytics",
              "OpSolid watermark",
              "Ideal for founders and freelancers",
            ],
            cta: "Create profile",
            href: "/contact?source=dbc-free",
          },
          {
            name: "Team",
            price: "€4.90",
            cadence: "per user / month",
            popular: "true",
            bullets: [
              "Everything in Free",
              "Advanced analytics",
              "CRM sync (HubSpot, Pipedrive, Salesforce)",
              "Custom domain & full branding",
              "Roster + SSO",
              "Annual billing, min. 5 seats",
            ],
            cta: "Book a demo",
            href: "#lead",
          },
          {
            name: "NFC + Lifetime",
            price: "€39",
            cadence: "one-time, per card",
            popular: "",
            bullets: [
              "Matte or wood NFC card, shipped from Hamburg",
              "Free digital account, forever",
              "No subscription, ever",
              "Upgrade to Team anytime",
            ],
            cta: "Request card",
            href: "#lead",
          },
        ],
      },
      lead: {
        label: "REQUEST",
        heading: "Book a demo — or your first card.",
        intro:
          "Tell us roughly how big your team is and what you want to do with digital cards. We respond within one business day.",
        fields: {
          name: "Full name",
          email: "Work email",
          company: "Company (optional)",
          teamSize: "Team size",
          teamSizeOptions: ["1", "2 – 10", "11 – 50", "50+"],
          message: "Anything we should know? (optional)",
          consent:
            "I consent to OpSolid processing this submission to respond to my request. See the Privacy Policy.",
          privacyLink: "Privacy Policy",
          submit: "Send request",
          submitting: "Sending…",
          success:
            "Thanks — we'll reply within one business day.",
          error:
            "Something went wrong. Please email contact@opsolid.de directly.",
        },
      },
      testimonials: {
        label: "Social proof",
        heading: "What customers say after switching.",
        items: [
          {
            quote:
              "We replaced paper cards in three cities in a single week. Leads hit HubSpot in seconds, and nobody had to type anything.",
            name: "Lena Richter",
            role: "Head of Sales",
            company: "Berlin-based scale-up",
          },
          {
            quote:
              "The fact that the data stays in Germany closed the deal with our legal team. Everything else was just a bonus.",
            name: "Marco Weber",
            role: "COO",
            company: "Munich industrial group",
          },
          {
            quote:
              "One flat €39 for a lifetime card. No subscription trap. That alone made me switch from the US product.",
            name: "Sarah Klein",
            role: "Independent consultant",
            company: "Hamburg",
          },
        ],
      },
      howItWorks: {
        label: "How it works",
        heading: "Three steps. Under five minutes.",
        steps: [
          {
            title: "Order your card",
            description:
              "Choose matte, metal, or wood. We ship from Hamburg within two business days.",
          },
          {
            title: "Build your profile",
            description:
              "Add your photo, links, social handles, and calendar. Preview in real time.",
          },
          {
            title: "Tap and share",
            description:
              "One tap shares everything. Track every interaction from your dashboard.",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Questions, answered quickly.",
        items: [
          {
            question: "Do the cards work with every phone?",
            answer:
              "Yes. NFC is supported on every modern iOS and Android device. The recipient never needs to install an app.",
          },
          {
            question: "Where is my data stored?",
            answer:
              "In Frankfurt, Germany, on Hetzner and IONOS infrastructure. Zero US subprocessors. A DPA is ready the moment you sign up.",
          },
          {
            question: "Can I cancel any time?",
            answer:
              "The €39 lifetime card has no subscription at all. Team plans are month-to-month after the first annual term.",
          },
          {
            question: "Can I keep my existing CRM?",
            answer:
              "Yes. We sync natively with HubSpot, Pipedrive, and Salesforce — and export to CSV for anything else. No Zapier required.",
          },
        ],
      },
      cta: {
        eyebrow: "READY?",
        heading:
          "Your next business card ships from Hamburg,\nnot San Francisco.",
        primaryCta: "Book a call",
        secondaryCta: "Go to /contact",
      },
      meta: {
        title: "Digital Business Card — Hosted in Germany | OpSolid",
        description:
          "A modern NFC business card with a GDPR-native digital profile. Apple & Google Wallet, CRM sync, team roster — hosted in Hamburg, not San Francisco.",
      },
    },

    digitalReception: {
      hero: {
        eyebrow: "[ OPSOLID PRODUCT · 02 ]   DIGITAL RECEPTION",
        title: [
          "An AI front desk",
          "that answers,",
          "even when no one's there.",
        ],
        paragraph:
          "Digital Reception is a standalone micro-SaaS — an AI-powered front desk for hotels, clinics, salons, and service businesses. Web form + email intake + optional voice agent. No Instagram or WhatsApp Business verification required. Standalone, or bolted into Kutasia when you need more.",
        primaryCta: "Book a demo",
        secondaryCta: "See how it works",
        tags: "AI INTAKE · WEB FORM · EMAIL · OPTIONAL VOICE · GDPR",
      },
      features: {
        label: "CAPABILITIES",
        heading: "A front desk that doesn't sleep, call in sick, or fumble the booking calendar.",
        intro:
          "Focused on the one job a reception needs to do well: capture the inquiry, qualify it, answer the common stuff, and route the rest to a human.",
        items: [
          {
            label: "INTAKE · 01",
            title: "Smart web form",
            desc: "A branded intake form for your site. Dynamic questions, conditional logic, and automatic routing by service type.",
            icon: "form",
          },
          {
            label: "EMAIL · 02",
            title: "AI email triage",
            desc: "Incoming emails are summarized, classified, and routed by AI. Reply drafts are suggested — a human always approves.",
            icon: "mail",
          },
          {
            label: "VOICE · 03",
            title: "Optional voice agent",
            desc: "A GDPR-compliant voice agent that picks up after hours. German, English, and Turkish out of the box. Calls get transcribed and sent to your inbox.",
            icon: "phone",
          },
          {
            label: "BOOKINGS · 04",
            title: "Calendar bookings",
            desc: "Connects to Google Calendar, Outlook, or Cal.com. No broken Instagram DM integration — just calendar availability, confirmed bookings.",
            icon: "calendar",
          },
          {
            label: "ANALYTICS · 05",
            title: "Simple analytics",
            desc: "Where inquiries come from, how fast they're answered, which services people ask about most. One dashboard, no 40-tab CRM.",
            icon: "chart",
          },
          {
            label: "HOSTING · 06",
            title: "Hosted in Germany",
            desc: "Hetzner / IONOS Frankfurt. GDPR-native. No data exported to US. Works standalone, or as a module inside Kutasia.",
            icon: "hosting",
          },
        ],
      },
      useCases: {
        label: "WHO IT'S FOR",
        heading: "Small teams whose reception is a bottleneck.",
        intro:
          "Digital Reception is deliberately narrow — it replaces the missed-call, slow-email, overflow-DM chaos with one organized intake.",
        items: [
          {
            title: "Hotels & guesthouses",
            desc: "Reservation questions, late-night inquiries, multi-language guests. Voice agent + form + email triage — without replacing your front desk.",
          },
          {
            title: "Clinics & practices",
            desc: "Appointment intake, medication questions, no-show reduction. Intake forms follow GDPR for health data. Human always in the loop.",
          },
          {
            title: "Salons & spas",
            desc: "Appointment booking, service questions, walk-in triage. AI handles the repetitive questions, staff focus on the client in the chair.",
          },
          {
            title: "Service businesses",
            desc: "Plumbers, electricians, accountants, lawyers — anyone whose phone is the bottleneck. Fully branded intake that routes to the right person.",
          },
        ],
      },
      pricing: {
        label: "PRICING",
        heading: "Small, honest, monthly. Cancel anytime.",
        popularBadge: "MOST POPULAR",
        plans: [
          {
            name: "Starter",
            price: "€29",
            cadence: "per month",
            popular: "",
            bullets: [
              "Web intake form",
              "AI email triage (1 inbox)",
              "100 conversations / month",
              "EN · DE · TR",
            ],
            cta: "Start free trial",
            href: "#lead",
          },
          {
            name: "Reception",
            price: "€79",
            cadence: "per month",
            popular: "true",
            bullets: [
              "Everything in Starter",
              "Unlimited inboxes & forms",
              "Calendar booking integration",
              "500 conversations / month",
              "Custom domain & branding",
            ],
            cta: "Book a demo",
            href: "#lead",
          },
          {
            name: "Voice+",
            price: "€149",
            cadence: "per month",
            popular: "",
            bullets: [
              "Everything in Reception",
              "AI voice agent (EN · DE · TR)",
              "After-hours call handling",
              "1,500 conversations / month",
              "Priority support",
            ],
            cta: "Book a demo",
            href: "#lead",
          },
        ],
      },
      lead: {
        label: "REQUEST",
        heading: "Try it on your business — book a free 30-minute setup call.",
        intro:
          "Tell us what kind of business and roughly how many inquiries you handle. We'll walk through the setup together and spin up a trial.",
        fields: {
          name: "Full name",
          email: "Work email",
          company: "Business name",
          businessType: "Business type",
          businessTypeOptions: ["Hotel / guesthouse", "Clinic / practice", "Salon / spa", "Service business", "Other"],
          message: "Anything we should know? (optional)",
          consent:
            "I consent to OpSolid processing this submission to respond to my request. See the Privacy Policy.",
          privacyLink: "Privacy Policy",
          submit: "Send request",
          submitting: "Sending…",
          success:
            "Thanks — we'll reply within one business day.",
          error:
            "Something went wrong. Please email contact@opsolid.de directly.",
        },
      },
      faq: {
        label: "FAQ",
        heading: "Honest answers.",
        items: [
          {
            question: "Does this replace my front desk staff?",
            answer:
              "No — it reduces their load. AI handles the repetitive, low-value inquiries so your people can focus on the guest / patient / client actually in front of them. A human approves anything non-trivial.",
          },
          {
            question: "Do I need to be on Instagram or WhatsApp Business?",
            answer:
              "No. Digital Reception deliberately avoids platforms that require business verification hoops. It works with your website form, your email, and optionally a phone number — no Meta/Instagram integrations required.",
          },
          {
            question: "Is it GDPR-compliant for health data?",
            answer:
              "Yes. We host in Frankfurt, encrypt all data at rest, and ship a DPA (Auftragsverarbeitung) on signup. Clinics and practices have specific onboarding for BDSG-compliant setup.",
          },
          {
            question: "Can I connect this to Kutasia later?",
            answer:
              "Yes. Digital Reception is a standalone product — but if you grow into needing the full Kutasia platform (unified inbox, sector workflows, AI analysis), it plugs in as a module without data migration.",
          },
        ],
      },
      cta: {
        eyebrow: "READY?",
        heading:
          "Let your reception answer at 2 AM —\nwithout hiring another person.",
        primaryCta: "Book a demo",
        secondaryCta: "Talk to us",
      },
      meta: {
        title: "Digital Reception — AI Front Desk for Hotels, Clinics & Salons | OpSolid",
        description:
          "A standalone AI front desk for service businesses. Web forms, email triage, optional voice agent. GDPR-native, hosted in Germany. No Instagram Business verification required.",
      },
    },

    kutasia: {
      hero: {
        eyebrow: "An OpSolid product · The platform",
        label: "Kutasia",
        headline: "Customer operations,\nunified and intelligent",
        subheadline:
          "Kutasia is a multi-tenant SaaS platform that brings messaging, requests, bookings, and content into one AI-assisted workspace — tailored per business sector. Modular: key pieces (Digital Reception, Digital Business Card) are also available as standalone products.",
        primaryCta: "Visit Kutasia",
        secondaryCta: "Talk to the team",
        primaryCtaHref: "https://kutasia.com",
        secondaryCtaHref: "/contact",
        domain: "kutasia.com",
      },

      trustStrip: [
        "Multi-tenant SaaS",
        "AES-256 encryption",
        "GDPR compliant",
        "EN / DE / TR",
      ],

      features: {
        label: "Platform Capabilities",
        headline: "Everything an operational team needs",
        description:
          "Kutasia consolidates the tools businesses juggle across channels — with sector-specific structure and AI that turns conversations into insights.",
        items: [
          {
            icon: "inbox",
            title: "Unified Inbox",
            description:
              "Email, web forms, and optional messaging channels (WhatsApp Business API, Instagram where approved) in one threaded workspace — with automatic assignment and status tracking. Channel-agnostic: you stay in control of which integrations to turn on.",
          },
          {
            icon: "bot",
            title: "AI Analysis",
            description:
              "Sentiment, intent, and booking-intent scoring on every message — surfacing urgent conversations and opportunities automatically.",
          },
          {
            icon: "layers",
            title: "Sector Templates",
            description:
              "Hotel, salon, jewelry, clinic, restaurant, accounting and more — each sector ships with its own fields, terminology, and workflows.",
          },
          {
            icon: "lineChart",
            title: "Operational Dashboards",
            description:
              "Daily summaries, KPI trends, channel distribution, and AI insights in a single dashboard built for multi-sector operations.",
          },
          {
            icon: "shield",
            title: "Secure Multi-Tenant",
            description:
              "AES-256-GCM encrypted OAuth tokens, strict tenant isolation, role-based access control, and GDPR-aligned data handling.",
          },
          {
            icon: "languages",
            title: "Built for Europe",
            description:
              "Native English, German, and Turkish — with sector terminology translated per industry, ready for cross-border operations.",
          },
        ],
      },

      sectors: {
        label: "Sectors Supported",
        headline: "One platform, fifteen industries",
        description:
          "Kutasia adapts its fields, language, and workflows to the sector you operate in — without forcing generic templates on specialized work.",
        list: [
          { name: "Hotel & Hospitality", icon: "bed" },
          { name: "Salon & Beauty", icon: "scissors" },
          { name: "Jewelry", icon: "gem" },
          { name: "Restaurant", icon: "utensils" },
          { name: "Clinic & Health", icon: "stethoscope" },
          { name: "Accounting", icon: "calculator" },
          { name: "Influencer", icon: "sparkles" },
          { name: "Creator", icon: "video" },
          { name: "Freelancer", icon: "briefcase" },
          { name: "E-commerce", icon: "shoppingBag" },
          { name: "Agency", icon: "megaphone" },
          { name: "Education", icon: "graduationCap" },
          { name: "Legal", icon: "scale" },
          { name: "Consulting", icon: "lineChart" },
          { name: "Other", icon: "package" },
        ],
      },

      howItHelps: {
        label: "The Shift",
        headline: "From scattered channels to operational clarity",
        items: [
          {
            before: "Messages lost across Instagram, WhatsApp, and email",
            after: "Unified inbox with AI-scored urgency",
          },
          {
            before: "Generic CRM that doesn't fit your sector",
            after: "Sector-specific fields and workflows out of the box",
          },
          {
            before: "Manual follow-ups and no insight into conversations",
            after: "Daily AI summaries and automated customer signals",
          },
          {
            before: "Fragmented customer data across tools",
            after: "Single customer profile with full interaction history",
          },
        ],
      },

      forWho: {
        label: "Built for",
        headline: "Teams that depend on customer conversations",
        items: [
          {
            title: "Local service businesses",
            description:
              "Hotels, salons, clinics, jewelers, and restaurants managing bookings and customer relationships across channels.",
          },
          {
            title: "Individual professionals",
            description:
              "Influencers, creators, freelancers, and consultants handling high volumes of client communication.",
          },
          {
            title: "Small agencies",
            description:
              "Teams managing multiple client accounts, each with its own workflows, branding, and reporting needs.",
          },
        ],
      },

      cta: {
        headline: "See Kutasia in action",
        description:
          "Visit kutasia.com to explore the platform, or talk to the OpSolid team for a tailored walkthrough.",
        primaryCta: "Visit kutasia.com",
        secondaryCta: "Book a walkthrough",
      },
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
