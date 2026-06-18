// =============================================================================
// ENGLISH CONTENT
// Duplicate this file as de.ts / tr.ts to add new languages.
// Keep the object structure identical across all language files.
// =============================================================================

export const content = {
  consent: {
    title: "Cookies & analytics",
    body: "We use minimal analytics to understand how you use OpSolid. No marketing cookies, no profiling. You can change your choice anytime.",
    privacyLink: "Read our privacy policy",
    accept: "Accept",
    reject: "Reject",
  },

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
      ratingPill: "",
      title: [
        "Automation that runs",
        "your operations —",
        "not the other way round.",
      ],
      subtitle:
        "OpSolid designs and builds practical automation and AI systems for real business operations — workflow automation, systems integration, internal tools, and AI-assisted processes.",
      primaryCtaLabel: "Book a discovery call",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "See services",
      secondaryCtaHref: "/solutions",
      footnote: "",
      consultingNote: "We also ship standalone products — Kutasia, Digital Business Card, Digital Reception.",
      editorial: {
        eyebrow: "",
        title: [
          "Systems that run quietly",
          "in the background",
          "of your operations.",
        ],
        paragraph:
          "Practical automation for mid-sized operations — orders, documents, approvals, communications. Integrates with your existing stack instead of replacing it.",
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
        "Eliminate repetitive workflows with custom-built automations",
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
            "Automated workflows that replace manual steps — from data entry and approvals to notifications and reporting. Delivered through API integrations and custom business logic.",
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
        { name: "Custom Workflows", icon: "workflow" },
        { name: "Shopify", icon: "shoppingBag" },
        { name: "CRM Systems", icon: "users" },
        { name: "ERP Systems", icon: "database" },
        { name: "Email & SMTP", icon: "mail" },
        { name: "REST APIs", icon: "code" },
        { name: "Google Workspace", icon: "cloud" },
        { name: "Databases", icon: "hardDrive" },
        { name: "Webhooks", icon: "zap" },
        { name: "Message Queues", icon: "settings" },
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
            "Headquartered in Germany, serving businesses across Europe and beyond. Familiar with local requirements and international contexts.",
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
      headline: "Automation building blocks OpSolid works with",
      description:
        "Each engagement is delivered as a custom system — built from production-ready engineering layers, chosen to fit your operations rather than a one-size-fits-all toolkit.",
      tools: [
        {
          name: "Custom Workflow Engine",
          description:
            "Custom-coded workflow engines for complex automations. Webhook triggers, conditional logic, retries, and full data sovereignty — no closed-off runtime.",
          techFeatures: [
            "Self-Hosted",
            "Open Architecture",
            "Webhook Triggers",
            "Error Handling",
            "Data Sovereignty",
          ],
        },
        {
          name: "API Orchestration",
          description:
            "Multi-step orchestration across REST APIs, GraphQL, and message queues. Built-in transformation, branching, and error recovery for production loads.",
          techFeatures: [
            "REST · GraphQL",
            "Data Routing",
            "API Modules",
            "Error Branching",
            "Real-Time",
          ],
        },
        {
          name: "AI Layer",
          description:
            "Practical AI primitives: classification, extraction, voice and chat agents. Auditable model calls, structured outputs, and human-in-the-loop checkpoints.",
          techFeatures: [
            "Voice Agents",
            "Document AI",
            "Classification",
            "Structured Output",
            "Audit Logs",
          ],
        },
        {
          name: "Self-Hosted Stack",
          description:
            "Full deployment on your own infrastructure or EU-hosted environments — Postgres, queues, observability. The exit is always two weeks away.",
          techFeatures: [
            "Postgres",
            "Message Queues",
            "Observability",
            "EU-Hosted",
            "Source Code Yours",
          ],
        },
      ],
    },

    trustStrip: {
      items: [] as string[],
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
            "End-to-end automation for repetitive, rule-based work — built with custom integrations and proper error handling and monitoring.",
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
            "Self-hosted or deployed on EU infrastructure. No US subprocessors unless you ask for them.",
        },
      ],
    },

    howItWorks: {
      label: "Process",
      headline: "Three steps.",
      steps: [
        {
          title: "Discover",
          description:
            "We map your actual processes, identify bottlenecks, and pinpoint where automation pays off. You get a written scope before anyone writes code.",
        },
        {
          title: "Design & build",
          description:
            "We design the architecture that fits your processes, build it with custom code, and deliver iteratively — with clear updates at every step.",
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
      headline: "Teams looking to scale their operations.",
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
            "Custom workflow automation",
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
            "Digital Business Card — link, QR, WhatsApp, no app",
            "Digital Reception — AI front desk for service businesses",
            "Every product ready to use out of the box",
          ],
          ctaLabel: "See all products",
          ctaHref: "/products",
          tone: "dark",
        },
      ],
    },

    testimonials: {
      label: "Field notes",
      headline: "What teams notice after working with OpSolid.",
      items: [
        {
          quote:
            "We stopped copying order data between four systems. The process now completes automatically before anyone starts the workday.",
          name: "Lena Richter",
          role: "Head of Operations",
          company: "Mid-size retail group",
        },
        {
          quote:
            "OpSolid didn't try to sell us a platform. They mapped our actual process, automated the repetitive parts, and handed us full documentation.",
          name: "Marco Weber",
          role: "COO",
          company: "Industrial group, Germany",
        },
        {
          quote:
            "The whole integration layer is self-hosted. No US subprocessors. Legal signed off in one meeting.",
          name: "Sarah Klein",
          role: "Head of IT",
          company: "Service firm",
        },
      ],
    },

    finalCta: {
      eyebrow: "LET'S TALK",
      headline:
        "Let's review your processes together.",
      description:
        "Book a free discovery call. We'll map where automation pays off — and where it doesn't.",
      primaryCtaLabel: "Book a discovery call",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "See services",
      secondaryCtaHref: "/solutions",
    },

    cardStrip: {
      eyebrow: "TEMPLATES",
      heading: "10 industry templates ready to ship",
      paragraph:
        "Real estate, clinic, restaurant, DJ, barber, e-commerce, architect, fitness — 10 share-by-link cards tailored per sector. Click to preview live.",
      ctaLabel: "See all templates",
      ctaHref: "/products/digital-card",
    },

    agentShowcase: {
      eyebrow: "AI AGENTS",
      heading: "AI agents for phone, chat, and bookings",
      paragraph:
        "Voice on your phone line, chat on your website, bookings in your calendar — built on real, production-grade stacks.",
      items: [
        {
          key: "voice",
          title: "Voice AI Agent",
          body: "24/7 phone answering, routing, booking — Retell-powered.",
          href: "/products/voice-agent",
          badge: "Retell · Vapi",
        },
        {
          key: "chatbot",
          title: "Website Chatbot",
          body: "Web, WhatsApp, Telegram at once. CRM-synced.",
          href: "/products/chatbot",
          badge: "Multi-channel",
        },
        {
          key: "booking",
          title: "Booking Agent",
          body: "Phone or chat → calendar. No double-bookings.",
          href: "/products/booking-agent",
          badge: "Cal.com",
        },
      ],
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
          "Automate repetitive, rule-based tasks across your organization using custom workflows and API orchestration.",
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
        "Focused on replacing manual, repetitive operational work with reliable automated systems.",
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
          title: "Stay practical and clear",
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
        "Independent automation specialist. Focused on designing and building practical automation systems, workflow integrations, and AI-assisted processes for business operations.",
      expertiseLabel: "",
      expertise: [],
      footnote:
        "Available for projects across Europe and internationally.",
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
      email: "info@kutasia.com",
      response: "Typical response time: 1-2 business days.",
      location:
        "Available for projects across Europe and internationally.",
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
        slug: "eu-ai-act-omnibus-2026-compliance-changes",
        title: "EU AI Act Omnibus: What Changed and What Businesses Must Do Now",
        excerpt:
          "The EU AI Act Omnibus extended the key high-risk AI deadline to December 2027 and expanded relief for smaller companies. What changed and what to act on now.",
        category: "ai",
        date: "2026-06-16",
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
    categories: {
      all: "All",
      customerFacing: "Customer-facing",
      internalOps: "Internal Ops",
      communication: "Communication",
    },
    templatesStrip: {
      label: "INDUSTRY TEMPLATES",
      heading: "10 templates ready to customize",
      paragraph:
        "Pick your sector, customize, ship. Real estate, clinic, restaurant, DJ, barber, e-commerce, architect, fitness and more.",
      cta: "Customize your own template",
      ctaHref: "/products/digital-card",
    },
    techStack: {
      label: "BUILT ON REAL INFRASTRUCTURE",
      heading: "No magic. Real, production-grade tech.",
      items: [
        "Retell AI",
        "Vapi",
        "Cal.com",
        "Custom Workflows",
        "Supabase",
        "Meta Business",
        "HubSpot",
        "Stripe",
      ],
    },
    items: [
      {
        name: "Digital Business Card",
        tagline: "Link · QR code · WhatsApp · no app",
        description:
          "A hosted-in-Germany digital business card. Share your profile as a link, QR code, WhatsApp message, or email - the receiver needs no app, and you can edit it anytime. Industry templates for real estate, salons, clinics, restaurants, photographers and more — all GDPR-native.",
        status: "Live",
        href: "/products/digital-card",
        externalUrl: "",
        icon: "idCard",
        startingPrice: "Free",
        category: "Customer-facing",
        stack: "Next.js · Hetzner · vCard · HubSpot",
      },
      {
        name: "Voice AI Agent",
        tagline: "24/7 phone receptionist · Retell · Vapi",
        description:
          "An AI voice agent that answers your phone line 24/7, books appointments, and routes calls. Multi-language (DE/EN/TR). Built on Retell AI or Vapi with calendar sync. Replaces €3k/month receptionist work.",
        status: "Live",
        href: "/products/voice-agent",
        externalUrl: "",
        icon: "phone",
        startingPrice: "Starting at €1,200 setup + €0.12/min",
        category: "Communication",
        stack: "Retell AI · Vapi · Cal.com · Supabase",
      },
      {
        name: "Website Chatbot",
        tagline: "Multi-channel · web · WhatsApp · Telegram",
        description:
          "A chatbot that lives on your website, WhatsApp, and Telegram at once. Qualifies leads, answers FAQs, syncs to CRM. Context-aware multi-turn conversations, no scripted walls.",
        status: "Live",
        href: "/products/chatbot",
        externalUrl: "",
        icon: "messageCircle",
        startingPrice: "Starting at €1,800 setup + €99/mo",
        category: "Customer-facing",
        stack: "OpenAI · Custom Workflows · Supabase · HubSpot",
      },
      {
        name: "WhatsApp Business Agent",
        tagline: "Official Meta API · order status · payments",
        description:
          "WhatsApp automation via the official Meta Business Cloud API (through a verified BSP — Twilio, 360dialog, AiSensy). Order status, support, qualification, payment triggers. No gray-market scraping, no ban risk.",
        status: "Live",
        href: "/products/whatsapp-agent",
        externalUrl: "",
        icon: "messagesSquare",
        startingPrice: "Starting at €1,500 setup + Meta fees",
        category: "Communication",
        stack: "Meta Business Cloud · 360dialog · Twilio · Stripe",
      },
      {
        name: "Appointment Booking Agent",
        tagline: "Cal.com + voice + chat",
        description:
          "A booking agent that handles scheduling through phone, chat, or form. Two-way sync with Google Calendar/Outlook/Cal.com. Handles rescheduling, reminders, and no-show follow-ups.",
        status: "Live",
        href: "/products/booking-agent",
        externalUrl: "",
        icon: "calendarClock",
        startingPrice: "Starting at €800 setup + €49/mo",
        category: "Internal Ops",
        stack: "Cal.com · Retell · Custom Workflows · Google Calendar",
      },
      {
        name: "Email Automation Agent",
        tagline: "Outreach · triage · reply drafting",
        description:
          "AI email workflows — cold outreach with personalized variants, inbox triage, auto-drafts for review. Built on Instantly, AgentMail, and custom workflows. Deliverability warmed, GDPR-compliant.",
        status: "Live",
        href: "/products/email-agent",
        externalUrl: "",
        icon: "mail",
        startingPrice: "Starting at €99 – €499/month",
        category: "Communication",
        stack: "Instantly · AgentMail · Custom Workflows · OpenAI",
      },
      {
        name: "Lead Qualification Agent",
        tagline: "Voice + chat · CRM scoring · HubSpot sync",
        description:
          "A conversational agent that qualifies inbound leads via voice or chat, scores them, and routes qualified leads into HubSpot/Pipedrive/Salesforce. 40% MQL→SQL conversion uplift realistic.",
        status: "Live",
        href: "/products/lead-qualifier",
        externalUrl: "",
        icon: "userCheck",
        startingPrice: "Starting at €2,200 setup + €199/mo",
        category: "Customer-facing",
        stack: "Retell · HubSpot · Custom Workflows · Supabase",
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
        startingPrice: "Starting at €29/month",
        category: "Internal Ops",
        stack: "Retell · Cal.com · Postmark · Supabase",
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
        startingPrice: "Custom pricing · by tenant",
        category: "Internal Ops",
        stack: "Next.js · Postgres · OpenAI · Stripe",
      },
    ],

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
        items: [
          {
            quote:
              "I built my card in ten minutes. Picked a template, typed in my details, hit publish, and the link was live. No back-and-forth, no waiting.",
            name: "Lena Richter",
            role: "Independent broker",
            company: "Berlin, DE",
          },
          {
            quote:
              "The fact that the data stays in the EU closed the deal with our legal team. That alone sold it for us.",
            name: "Marco Weber",
            role: "COO",
            company: "Munich industrial group",
          },
          {
            quote:
              "No monthly subscription. No 'enterprise tier' upsell. I started free, paid once for the custom domain, moved on. Exactly what I wanted.",
            name: "Sarah Klein",
            role: "Independent consultant",
            company: "Berlin, DE",
          },
        ],
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

    voiceAgent: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 02 ]   VOICE AI",
        title: [
          "A voice agent",
          "that answers your phone",
          "at 2 AM — in three languages.",
        ],
        paragraph:
          "A production-grade AI voice agent that picks up your phone line 24/7, qualifies callers, books appointments, and routes real emergencies to a human. German, English, and Turkish out of the box. Built on Retell AI or Vapi with live calendar sync.",
        primaryCta: "Book a demo",
        secondaryCta: "See how it works",
        tags: "RETELL · VAPI · DE/EN/TR · 24/7",
        startingPrice: "Starting at €1,200 setup + €0.12/min",
      },
      features: {
        label: "WHAT YOU GET",
        heading: "Every call answered — qualified, logged, routed.",
        items: [
          {
            label: "NATURAL CONVERSATION",
            body: "Low-latency turn-taking (<800ms) with barge-in support. Sounds like a well-briefed receptionist, not an IVR tree.",
          },
          {
            label: "CALENDAR BOOKING",
            body: "Live two-way sync with Google Calendar, Outlook, and Cal.com. The agent books, reschedules, and respects buffers.",
          },
          {
            label: "CALL ROUTING",
            body: "Detects urgency and routes complex calls to a live human, with full context and transcript delivered before pickup.",
          },
          {
            label: "TRANSCRIPTS & SUMMARIES",
            body: "Every call transcribed, summarized, tagged by intent. Dropped into your CRM or Slack within seconds of hang-up.",
          },
          {
            label: "MULTILINGUAL",
            body: "German, English, Turkish — with voice selection per language. Callers get answered in the language they called in.",
          },
          {
            label: "GDPR NATIVE",
            body: "EU-hosted inference, DPA on signup, recordings stored in Frankfurt. Opt-in announcements at call start.",
          },
        ],
      },
      howItWorks: {
        label: "HOW IT WORKS",
        heading: "Four steps. One phone number.",
        steps: [
          {
            step: "01",
            title: "Port or forward your number",
            body: "Keep your existing number — we forward unanswered calls to the agent, or you give us a dedicated line.",
          },
          {
            step: "02",
            title: "Brief the agent",
            body: "We write the system prompt with your services, pricing, opening hours, and escalation rules. You review it.",
          },
          {
            step: "03",
            title: "Connect your calendar + CRM",
            body: "Cal.com or Google Calendar for bookings; HubSpot/Pipedrive for leads. Webhooks handle the rest.",
          },
          {
            step: "04",
            title: "Go live and monitor",
            body: "Every call logged in a dashboard. You review transcripts, tweak the prompt, adjust escalation triggers.",
          },
        ],
      },
      stack: {
        label: "BUILT ON",
        heading: "No magic. Real tech.",
        items: [
          { name: "Retell AI", role: "Voice orchestration + telephony" },
          { name: "Vapi", role: "Alternative voice stack (enterprise)" },
          { name: "Cal.com", role: "Calendar booking layer" },
          { name: "Supabase", role: "Call logs + context store" },
          { name: "Custom Workflows", role: "CRM sync + post-call orchestration" },
        ],
      },
      pricing: {
        label: "PRICING",
        heading: "Pay setup once. Pay per minute of actual calls.",
        tiers: [
          {
            name: "Starter",
            price: "€1,200",
            billing: "one-time setup + €0.12/min",
            features: [
              "One phone line",
              "DE or EN (one language)",
              "Cal.com integration",
              "Email notifications",
              "100 min test credit",
            ],
            cta: "Book a demo",
          },
          {
            name: "Business",
            price: "€2,400",
            billing: "setup + €0.12/min + €99/mo",
            features: [
              "Up to 3 phone lines",
              "DE · EN · TR multilingual",
              "HubSpot / Pipedrive sync",
              "Slack + WhatsApp notifications",
              "Monthly prompt tuning",
              "Priority support",
            ],
            cta: "Book a demo",
            featured: "true",
          },
          {
            name: "Enterprise",
            price: "Custom",
            billing: "volume pricing + SLA",
            features: [
              "Unlimited lines",
              "Custom voice cloning",
              "Self-hosted option (Vapi)",
              "Dedicated slack channel",
              "99.9% SLA",
            ],
            cta: "Talk to us",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Clear answers.",
        items: [
          {
            q: "Will callers know it's an AI?",
            a: "Yes — we announce it at the start of every call. Pretending otherwise breaks GDPR and damages trust. In practice, callers don't care once the agent handles the call competently.",
          },
          {
            q: "What happens on complex or emergency calls?",
            a: "The agent detects escalation triggers (keyword lists you define + intent signals) and transfers to a human line, with the transcript and summary already sent via Slack/email.",
          },
          {
            q: "How fast is it, really?",
            a: "Turn latency is sub-800ms on Retell's enterprise tier. It barges in, interrupts politely, and doesn't do the awkward 2-second pause that gives away early-2024 voice agents.",
          },
          {
            q: "Can I hear a real sample?",
            a: "Yes. We run a live demo on a sandboxed number during the discovery call — you call, the agent answers, you test edge cases. No slide deck.",
          },
          {
            q: "Is it really GDPR-compliant?",
            a: "Calls are processed on EU infrastructure (Retell EU region / Vapi self-hosted). Recordings stored in Frankfurt. DPA signed on day one. We announce the AI at call start and offer opt-out.",
          },
        ],
      },
      cta: {
        heading: "Your phone rings at 2 AM. Who picks up?",
        paragraph:
          "Book a 30-minute discovery call. We'll spin up a sandboxed agent on your actual services and let you call it.",
        primaryCta: "Book a demo",
        secondaryCta: "Talk to us",
      },
    },

    chatbot: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 03 ]   WEBSITE CHATBOT",
        title: [
          "One chatbot.",
          "Three channels.",
          "Zero scripted walls.",
        ],
        paragraph:
          "A context-aware chatbot that lives on your website, WhatsApp, and Telegram simultaneously — same brain, three mouths. Qualifies leads, answers real questions from your docs, and syncs conversations to HubSpot.",
        primaryCta: "Book a demo",
        secondaryCta: "See how it works",
        tags: "OPENAI · CUSTOM · SUPABASE · MULTI-CHANNEL",
        startingPrice: "Starting at €1,800 setup + €99/mo",
      },
      features: {
        label: "WHAT YOU GET",
        heading: "A chatbot that reads your docs, not a FAQ parrot.",
        items: [
          {
            label: "MULTI-CHANNEL",
            body: "Same conversation, same memory — across web widget, WhatsApp Business, and Telegram. Unified inbox for your team.",
          },
          {
            label: "RAG-POWERED",
            body: "Trained on your actual content: product docs, policies, PDFs, Notion pages. No hallucinated answers — citations included.",
          },
          {
            label: "LEAD CAPTURE",
            body: "Qualifies with a natural conversation (not a form dump), then pushes structured data to HubSpot/Pipedrive on submit.",
          },
          {
            label: "HUMAN HANDOFF",
            body: "Seamless escalation to a live agent with full transcript, detected sentiment, and recommended next action.",
          },
          {
            label: "ANALYTICS",
            body: "Top unanswered questions, escalation rate, conversion funnel per channel. One weekly digest, no dashboard maze.",
          },
          {
            label: "CUSTOM STYLED",
            body: "Your fonts, your colors, your tone. Lives in your site's shell — no generic third-party chat bubble.",
          },
        ],
      },
      howItWorks: {
        label: "HOW IT WORKS",
        heading: "Four steps to launch.",
        steps: [
          {
            step: "01",
            title: "Ingest your knowledge",
            body: "We crawl your site, import docs/PDFs, connect your Notion or Confluence. Embeddings land in Supabase pgvector.",
          },
          {
            step: "02",
            title: "Design the flows",
            body: "Lead qualification, booking path, escalation triggers. You approve the system prompt and guardrails.",
          },
          {
            step: "03",
            title: "Deploy across channels",
            body: "One widget for web. BSP-verified WhatsApp Business. Telegram bot. All hitting the same conversation backend.",
          },
          {
            step: "04",
            title: "Iterate weekly",
            body: "We monitor top-failed queries and update the knowledge base and prompts. First 30 days included.",
          },
        ],
      },
      stack: {
        label: "BUILT ON",
        heading: "No magic. Real tech.",
        items: [
          { name: "OpenAI / Claude", role: "LLM core (swappable)" },
          { name: "Supabase pgvector", role: "RAG embeddings + memory" },
          { name: "Custom Workflows", role: "Channel orchestration + CRM sync" },
          { name: "Meta Business Cloud", role: "Official WhatsApp BSP" },
          { name: "HubSpot / Pipedrive", role: "Lead sync destination" },
        ],
      },
      pricing: {
        label: "PRICING",
        heading: "One-time build. Predictable monthly.",
        tiers: [
          {
            name: "Web only",
            price: "€1,800",
            billing: "setup + €99/mo",
            features: [
              "Website widget",
              "RAG on up to 200 pages/docs",
              "HubSpot sync",
              "5,000 messages/mo",
              "30-day post-launch tuning",
            ],
            cta: "Book a demo",
          },
          {
            name: "Multi-channel",
            price: "€2,800",
            billing: "setup + €199/mo",
            features: [
              "Web + WhatsApp + Telegram",
              "Unified agent inbox",
              "RAG on up to 1,000 docs",
              "20,000 messages/mo",
              "Human handoff workflow",
              "Weekly iteration",
            ],
            cta: "Book a demo",
            featured: "true",
          },
          {
            name: "Scale",
            price: "From €5,000",
            billing: "setup + usage-based",
            features: [
              "Unlimited channels",
              "Custom LLM (self-hosted option)",
              "Advanced analytics",
              "White-label",
              "SLA + dedicated support",
            ],
            cta: "Talk to us",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Clear answers.",
        items: [
          {
            q: "Will it hallucinate and damage our brand?",
            a: "RAG with strict grounding means the bot cites its sources. If the answer isn't in your docs, it says so and offers to escalate. We explicitly tune it to prefer 'I don't know' over confident fiction.",
          },
          {
            q: "Does WhatsApp really work properly?",
            a: "Yes — through the official Meta Business Cloud API via a verified BSP (Twilio, 360dialog, or AiSensy). No gray-market scraping. Green verified badge, no ban risk.",
          },
          {
            q: "Can we keep using our existing live chat tool?",
            a: "If you use Intercom, Crisp, or Zendesk — yes. We layer AI on top and only escalate to your existing human workflow. No tool replacement.",
          },
          {
            q: "What happens if OpenAI goes down?",
            a: "We configure Claude (Anthropic) as a fallback and can self-host Llama 3 for critical workloads. Multi-provider LLM routing is in every tier above Web.",
          },
        ],
      },
      cta: {
        heading: "Your support team fields the same 50 questions. Every day.",
        paragraph:
          "Book a demo. We'll spin up a chatbot on your real docs and let you test it before you commit.",
        primaryCta: "Book a demo",
        secondaryCta: "Talk to us",
      },
    },

    whatsappAgent: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 04 ]   WHATSAPP BUSINESS",
        title: [
          "WhatsApp",
          "that actually works —",
          "officially.",
        ],
        paragraph:
          "WhatsApp automation via the official Meta Business Cloud API — through a verified BSP (Twilio, 360dialog, AiSensy). Order tracking, support, qualification, payment triggers. No scraping, no unofficial libraries, no ban risk.",
        primaryCta: "Book a demo",
        secondaryCta: "See how it works",
        tags: "META BUSINESS CLOUD · 360DIALOG · TWILIO · VERIFIED",
        startingPrice: "Starting at €1,500 setup + Meta fees",
      },
      features: {
        label: "WHAT YOU GET",
        heading: "Everything Meta's API allows — nothing it doesn't.",
        items: [
          {
            label: "VERIFIED GREEN CHECKMARK",
            body: "We handle the official business verification through the BSP. Your brand shows up with the green tick that customers trust.",
          },
          {
            label: "ORDER & SHIPPING UPDATES",
            body: "Automated notifications: order received, packed, shipped, delivered. Tied directly into Shopify / WooCommerce / your ERP.",
          },
          {
            label: "CUSTOMER SUPPORT",
            body: "Inbound support with AI first-line responses. Escalate to a human with full context when the bot hits its limits.",
          },
          {
            label: "PAYMENT LINKS",
            body: "Trigger Stripe payment links inside a conversation — order confirmations, invoices, deposits — with receipts back in WhatsApp.",
          },
          {
            label: "CAMPAIGN TEMPLATES",
            body: "Meta-approved message templates for broadcasts. Opt-in management, rate-limited, never spammy.",
          },
          {
            label: "TEAM INBOX",
            body: "Your agents handle conversations in a real inbox (ours or your existing one — Front, HubSpot, Zendesk). Full audit trail.",
          },
        ],
      },
      howItWorks: {
        label: "HOW IT WORKS",
        heading: "Verification first, automation second.",
        steps: [
          {
            step: "01",
            title: "Verify your business with Meta",
            body: "We guide you through Facebook Business Manager verification and BSP onboarding. Typically 5–10 business days.",
          },
          {
            step: "02",
            title: "Design message templates",
            body: "Meta approves every broadcast template. We draft, submit, and iterate until approved — usually 1–2 rounds.",
          },
          {
            step: "03",
            title: "Wire up your backend",
            body: "Shopify/WooCommerce for orders, Stripe for payments, HubSpot for leads. Webhooks flow both directions.",
          },
          {
            step: "04",
            title: "Launch with automations + human layer",
            body: "Auto-responses + AI for scale, human agents for nuance. You choose where the line is.",
          },
        ],
      },
      stack: {
        label: "BUILT ON",
        heading: "Official API, no gray market.",
        items: [
          { name: "Meta Business Cloud API", role: "Official WhatsApp channel" },
          { name: "360dialog / Twilio / AiSensy", role: "Verified BSP layer" },
          { name: "Custom Workflows", role: "Workflow orchestration" },
          { name: "Stripe", role: "Payment link triggers" },
          { name: "Shopify / WooCommerce", role: "Order + shipping source of truth" },
        ],
      },
      pricing: {
        label: "PRICING",
        heading: "Setup + BSP passthrough. No margin games.",
        tiers: [
          {
            name: "Launch",
            price: "€1,500",
            billing: "setup + Meta fees passthrough",
            features: [
              "Business verification",
              "3 Meta templates approved",
              "1 automation (order or support)",
              "360dialog or Twilio BSP",
              "30-day post-launch support",
            ],
            cta: "Book a demo",
          },
          {
            name: "Commerce",
            price: "€3,200",
            billing: "setup + €149/mo + Meta fees",
            features: [
              "Everything in Launch",
              "Shopify/WooCommerce integration",
              "Order flow automations",
              "Stripe payment links",
              "AI-first support layer",
              "Team inbox (up to 5 agents)",
            ],
            cta: "Book a demo",
            featured: "true",
          },
          {
            name: "Enterprise",
            price: "Custom",
            billing: "setup + volume pricing",
            features: [
              "Multi-country numbers",
              "CRM bi-directional sync",
              "Advanced routing + SLAs",
              "Dedicated BSP rep",
              "Compliance review",
            ],
            cta: "Talk to us",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Clear answers about an opaque channel.",
        items: [
          {
            q: "Why not use a cheaper unofficial WhatsApp library?",
            a: "Because Meta bans them, period. Your number gets flagged, your customers lose trust, your automation breaks overnight. We refuse to ship gray-market WhatsApp. The official API costs more — it's also the only thing that survives.",
          },
          {
            q: "How much are Meta's fees?",
            a: "Conversation-based. Utility conversations (order updates) are roughly €0.02–0.05 each; marketing conversations €0.05–0.12. We pass these through at cost — no markup.",
          },
          {
            q: "How long does verification take?",
            a: "5–10 business days on average. Meta verifies your business documents and your BSP relationship. We handle the paperwork.",
          },
          {
            q: "Can I migrate from an unofficial tool?",
            a: "Yes. We run the official channel in parallel for 2 weeks, then cut over. Phone number migration is possible but requires coordination with your current provider.",
          },
        ],
      },
      cta: {
        heading: "WhatsApp is where your customers already are.",
        paragraph:
          "Book a demo. We'll show you the exact Meta verification path and what's automatable on your stack.",
        primaryCta: "Book a demo",
        secondaryCta: "Talk to us",
      },
    },

    bookingAgent: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 05 ]   BOOKING AGENT",
        title: [
          "Bookings that",
          "handle themselves —",
          "across phone and chat.",
        ],
        paragraph:
          "An AI agent dedicated to one job: booking, rescheduling, and reminding. Works through voice, chat, or form — two-way synced with Google Calendar, Outlook, or Cal.com. Zero double-bookings, fewer no-shows.",
        primaryCta: "Book a demo",
        secondaryCta: "See how it works",
        tags: "CAL.COM · RETELL · CUSTOM · GOOGLE CALENDAR",
        startingPrice: "Starting at €800 setup + €49/mo",
      },
      features: {
        label: "WHAT YOU GET",
        heading: "One agent, every booking channel.",
        items: [
          {
            label: "MULTI-CHANNEL INTAKE",
            body: "Caller, chat user, or web form — same backend, same availability logic, same confirmation email.",
          },
          {
            label: "TWO-WAY CALENDAR SYNC",
            body: "Live sync with Google Calendar, Outlook 365, iCloud, or Cal.com. External blocks respected instantly.",
          },
          {
            label: "RESCHEDULING & CANCELS",
            body: "Customer can reschedule by replying to the confirmation or calling back. No form rodeo, no support ticket.",
          },
          {
            label: "REMINDERS + NO-SHOWS",
            body: "SMS/WhatsApp/email reminders on your schedule. Auto-follow-up on missed appointments with a rebooking link.",
          },
          {
            label: "BUFFER & ROUTING RULES",
            body: "Per-service duration, buffers, team routing, location constraints. No magic — all visible in Cal.com.",
          },
          {
            label: "DASHBOARDS",
            body: "Booking velocity, utilization, no-show rate by channel. Simple weekly report, no 20-chart graveyard.",
          },
        ],
      },
      howItWorks: {
        label: "HOW IT WORKS",
        heading: "Four steps. One calendar of truth.",
        steps: [
          {
            step: "01",
            title: "Map your services",
            body: "Each service: duration, buffer, who can deliver, location/room constraints. We model it in Cal.com.",
          },
          {
            step: "02",
            title: "Connect calendars",
            body: "Staff calendars (Google/Outlook/iCloud) sync both ways. External meetings block booking slots automatically.",
          },
          {
            step: "03",
            title: "Wire the intake channels",
            body: "Phone (via Retell voice agent), web chat widget, embedded form. All write to the same Cal.com backend.",
          },
          {
            step: "04",
            title: "Automate reminders",
            body: "Reminder cadence and channel per service. No-show follow-ups with rebooking links. Track everything.",
          },
        ],
      },
      stack: {
        label: "BUILT ON",
        heading: "No magic. Real tech.",
        items: [
          { name: "Cal.com", role: "Booking engine + availability" },
          { name: "Retell AI", role: "Voice intake (optional)" },
          { name: "Custom Workflows", role: "Reminder + follow-up orchestration" },
          { name: "Google Calendar / Outlook", role: "Source-of-truth sync" },
          { name: "Twilio", role: "SMS reminders" },
        ],
      },
      pricing: {
        label: "PRICING",
        heading: "Small setup. Small monthly. Real ROI.",
        tiers: [
          {
            name: "Solo",
            price: "€800",
            billing: "setup + €49/mo",
            features: [
              "Up to 3 services",
              "Web form + chat intake",
              "Google Calendar or Cal.com",
              "Email + SMS reminders",
              "Weekly report",
            ],
            cta: "Book a demo",
          },
          {
            name: "Team",
            price: "€1,600",
            billing: "setup + €129/mo",
            features: [
              "Unlimited services",
              "Phone + chat + form",
              "Voice agent (Retell)",
              "Team routing rules",
              "WhatsApp reminders",
              "No-show rebooking flow",
            ],
            cta: "Book a demo",
            featured: "true",
          },
          {
            name: "Multi-location",
            price: "Custom",
            billing: "per location",
            features: [
              "Multi-site routing",
              "Resource constraints",
              "Custom integrations",
              "Staff app (optional)",
              "SLA + onboarding",
            ],
            cta: "Talk to us",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Clear answers.",
        items: [
          {
            q: "Can I keep my existing Cal.com account?",
            a: "Yes — we layer on top. If you're already on Cal.com, we extend it with voice intake and workflow automation. No migration required.",
          },
          {
            q: "What about recurring bookings / packages?",
            a: "Supported natively via Cal.com. Packages of 5, monthly subscriptions, multi-session treatments — all standard.",
          },
          {
            q: "Does it really reduce no-shows?",
            a: "In our deployments, 30–50% reduction is typical — driven by 24h + 2h reminders and a one-click reschedule link. Numbers depend on your service type.",
          },
          {
            q: "Can customers just call us to book?",
            a: "Yes — that's the whole point. The voice agent answers, finds slots, books, confirms. Or a human can still pick up if the customer prefers.",
          },
        ],
      },
      cta: {
        heading: "Every missed call is a missed booking.",
        paragraph:
          "Book a demo. We'll connect a sandbox calendar and let you test the phone + chat flow end to end.",
        primaryCta: "Book a demo",
        secondaryCta: "Talk to us",
      },
    },

    emailAgent: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 06 ]   EMAIL AUTOMATION",
        title: [
          "Inbox triage.",
          "Cold outreach.",
          "Draft replies, reviewed.",
        ],
        paragraph:
          "AI email workflows that actually ship: personalized cold outreach, inbound triage, and auto-drafted replies for a human to approve. Built on Instantly, AgentMail, and custom orchestration flows. Warmed deliverability, GDPR-compliant.",
        primaryCta: "Book a demo",
        secondaryCta: "See how it works",
        tags: "INSTANTLY · AGENTMAIL · CUSTOM · OPENAI",
        startingPrice: "Starting at €99 – €499/month",
      },
      features: {
        label: "WHAT YOU GET",
        heading: "Email that works — without a 50-person SDR team.",
        items: [
          {
            label: "COLD OUTREACH AT SCALE",
            body: "Personalized variants per contact, not spray-and-pray. Multi-inbox rotation, sender warmup, bounce handling.",
          },
          {
            label: "INBOX TRIAGE",
            body: "Incoming mail classified: Lead, Support, Partner, Spam, Escalate. Routed, tagged, summary waiting in your CRM.",
          },
          {
            label: "REPLY DRAFTS",
            body: "AI drafts replies in your voice, based on your past emails. You review, tweak, send — hours saved, no bot slop shipped.",
          },
          {
            label: "DELIVERABILITY HEALTH",
            body: "SPF/DKIM/DMARC audit, sender reputation monitoring, warmup across 5–50 inboxes. You actually land in inbox.",
          },
          {
            label: "CRM WRITE-BACK",
            body: "Every meaningful thread logged in HubSpot/Pipedrive with the right contact, stage, and summary — automatically.",
          },
          {
            label: "GDPR GUARDRAILS",
            body: "Suppression lists, unsubscribe handling, EU contact consent logic. No cold-mailing list without opt-in signal.",
          },
        ],
      },
      howItWorks: {
        label: "HOW IT WORKS",
        heading: "Four steps, inbox-deep.",
        steps: [
          {
            step: "01",
            title: "Audit deliverability",
            body: "SPF, DKIM, DMARC, sender reputation. Fix anything burning. Provision warmup inboxes if outreach is in scope.",
          },
          {
            step: "02",
            title: "Connect your mail + CRM",
            body: "Google Workspace, M365, or Postmark. HubSpot/Pipedrive for logging. Everything read-only until you approve.",
          },
          {
            step: "03",
            title: "Build the flows",
            body: "Triage rules, reply templates, outreach sequences. Prompts tuned to your voice with real sample emails.",
          },
          {
            step: "04",
            title: "Human-in-the-loop",
            body: "Drafts land in a review queue. You approve, edit, send. Outreach runs on its own with suppression logic.",
          },
        ],
      },
      stack: {
        label: "BUILT ON",
        heading: "No magic. Real tech.",
        items: [
          { name: "Instantly", role: "Cold outreach + warmup" },
          { name: "AgentMail", role: "Inbound triage + drafting" },
          { name: "Custom Workflows", role: "Custom workflow orchestration" },
          { name: "OpenAI / Claude", role: "Drafting + classification" },
          { name: "HubSpot / Pipedrive", role: "CRM source of truth" },
        ],
      },
      pricing: {
        label: "PRICING",
        heading: "Monthly operational pricing. Cancel anytime.",
        tiers: [
          {
            name: "Triage",
            price: "€99",
            billing: "per month",
            features: [
              "1 inbox classified + triaged",
              "Reply drafts (up to 200/mo)",
              "HubSpot or Pipedrive sync",
              "Weekly report",
            ],
            cta: "Book a demo",
          },
          {
            name: "Outreach + Triage",
            price: "€299",
            billing: "per month",
            features: [
              "Everything in Triage",
              "Cold outreach (5 inboxes)",
              "Warmup + deliverability monitoring",
              "Up to 2,000 emails/mo sent",
              "A/B testing",
              "Monthly prompt tuning",
            ],
            cta: "Book a demo",
            featured: "true",
          },
          {
            name: "Scale",
            price: "€499+",
            billing: "per month, volume-based",
            features: [
              "Unlimited inboxes",
              "Custom LLM routing",
              "Advanced segmentation",
              "Dedicated workflow eng",
              "SLA",
            ],
            cta: "Talk to us",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Clear answers about a spammy-by-default channel.",
        items: [
          {
            q: "Isn't AI-written cold email just spam?",
            a: "It is when you do it wrong. We personalize at the paragraph level (not mail-merge token substitution), cap volume per inbox, and suppress anyone who doesn't engage. If your list is garbage, we tell you — and recommend inbound instead.",
          },
          {
            q: "Is this GDPR-compliant for EU contacts?",
            a: "B2B cold outreach to EU contacts requires legitimate interest justification + easy opt-out. We implement both. For consumer (B2C) contacts, prior consent is mandatory — we won't email without it.",
          },
          {
            q: "Can it reply without human review?",
            a: "Yes, but only for narrow, safe intents (shipping confirmations, availability-check replies, scheduling). Everything else queues for review. You set the line.",
          },
          {
            q: "What about my existing mailbox history?",
            a: "We can train the reply-drafter on your last 500 sent emails so drafts sound like you, not GPT-4's corporate voice. All processed locally, nothing stored beyond embeddings.",
          },
        ],
      },
      cta: {
        heading: "Your inbox is a second full-time job. It shouldn't be.",
        paragraph:
          "Book a demo. We'll audit your mail setup and show what's automatable without triggering spam filters.",
        primaryCta: "Book a demo",
        secondaryCta: "Talk to us",
      },
    },

    leadQualifier: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 07 ]   LEAD QUALIFICATION",
        title: [
          "Every inbound lead.",
          "Qualified, scored,",
          "handed to sales.",
        ],
        paragraph:
          "A conversational agent that qualifies inbound leads via voice or chat, scores them against your ICP, and routes MQLs straight to sales in HubSpot or Pipedrive. Typical uplift: 40% MQL-to-SQL conversion.",
        primaryCta: "Book a demo",
        secondaryCta: "See how it works",
        tags: "RETELL · HUBSPOT · CUSTOM · SCORING",
        startingPrice: "Starting at €2,200 setup + €199/mo",
      },
      features: {
        label: "WHAT YOU GET",
        heading: "SDR work, at 24/7 availability.",
        items: [
          {
            label: "CONVERSATIONAL QUALIFICATION",
            body: "Natural back-and-forth instead of a 14-field form. Asks what matters, skips what doesn't, feels human.",
          },
          {
            label: "ICP SCORING",
            body: "Configurable scoring model — firmographics, intent signals, budget, timeline. Score lands in HubSpot on submit.",
          },
          {
            label: "INSTANT ROUTING",
            body: "SQL-ready leads ping sales on Slack or book a call directly into an AE's calendar. No 'we'll be in touch' delay.",
          },
          {
            label: "VOICE OR CHAT",
            body: "Same qualification logic works through phone (Retell), website chat, or WhatsApp. You choose the channels.",
          },
          {
            label: "CONVERSATION LIBRARY",
            body: "Full transcript + summary + score on every lead. Sales opens HubSpot and already knows the context.",
          },
          {
            label: "A/B QUESTION TUNING",
            body: "Monthly review of qualification drop-off. Refine questions, improve close rate, measure the impact.",
          },
        ],
      },
      howItWorks: {
        label: "HOW IT WORKS",
        heading: "From anonymous visitor to sales-ready, without a human.",
        steps: [
          {
            step: "01",
            title: "Define your ICP + scoring model",
            body: "We workshop your ideal customer profile and turn it into a weighted scoring rubric (firmographic + intent).",
          },
          {
            step: "02",
            title: "Design the conversation",
            body: "Qualifying questions mapped to score dimensions. Branching logic. Disqualification gracefully handled.",
          },
          {
            step: "03",
            title: "Wire CRM + sales routing",
            body: "HubSpot/Pipedrive pipelines, Slack channels, AE calendar routing. SQL handoff via booking link or direct ping.",
          },
          {
            step: "04",
            title: "Launch across channels",
            body: "Chat widget + phone line live. Monthly scoring review with sales to calibrate MQL→SQL conversion.",
          },
        ],
      },
      stack: {
        label: "BUILT ON",
        heading: "No magic. Real tech.",
        items: [
          { name: "Retell AI", role: "Voice qualification" },
          { name: "HubSpot / Pipedrive", role: "CRM + scoring destination" },
          { name: "Custom Workflows", role: "Routing + Slack/Cal.com handoff" },
          { name: "Supabase", role: "Conversation log + analytics" },
          { name: "Clearbit / Apollo (optional)", role: "Firmographic enrichment" },
        ],
      },
      pricing: {
        label: "PRICING",
        heading: "Setup once. Recurring uplift.",
        tiers: [
          {
            name: "Chat-only",
            price: "€2,200",
            billing: "setup + €199/mo",
            features: [
              "Website chat widget",
              "ICP scoring model",
              "HubSpot or Pipedrive sync",
              "Slack routing",
              "Monthly review",
            ],
            cta: "Book a demo",
          },
          {
            name: "Voice + Chat",
            price: "€3,800",
            billing: "setup + €349/mo",
            features: [
              "Chat + inbound phone",
              "Retell voice qualification",
              "Calendar routing to AEs",
              "Firmographic enrichment",
              "A/B testing on questions",
              "Weekly sales sync",
            ],
            cta: "Book a demo",
            featured: "true",
          },
          {
            name: "Enterprise",
            price: "Custom",
            billing: "per-team pricing",
            features: [
              "Multi-team routing",
              "Custom CRM integrations",
              "Account-based scoring",
              "Dedicated sales ops",
              "SLA + reporting",
            ],
            cta: "Talk to us",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Clear answers.",
        items: [
          {
            q: "Do leads actually stay engaged with an AI?",
            a: "Short answer: yes, if the conversation feels useful. We disclose the AI up front, keep questions to 4–6 max, and offer a human handoff at any point. Completion rates run 60–80% vs. 15–25% on static forms.",
          },
          {
            q: "What's a realistic MQL→SQL uplift?",
            a: "30–50% in most deployments, driven by better scoring accuracy + faster routing (SQLs hit sales in minutes vs. hours). Specific numbers depend on your current baseline.",
          },
          {
            q: "Can it disqualify leads?",
            a: "Yes — and gracefully. Out-of-ICP leads get routed to a self-serve tier or politely shown the door. Your AEs stop wasting time on no-fit calls.",
          },
          {
            q: "How does it integrate with our existing SDR team?",
            a: "It either replaces the initial qualification (SDR team focuses on warm outbound) or augments them (SDRs get only SQL-ready handoffs). We map to your current motion.",
          },
        ],
      },
      cta: {
        heading: "Your AEs should talk to SQLs. Not qualify tire-kickers.",
        paragraph:
          "Book a demo. We'll walk through your funnel and map where qualification loses leads today.",
        primaryCta: "Book a demo",
        secondaryCta: "Talk to us",
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
        heading: "Small, clear, monthly. Cancel anytime.",
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
            "Something went wrong. Please email info@kutasia.com directly.",
        },
      },
      faq: {
        label: "FAQ",
        heading: "Clear answers.",
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
    nav: {
      home: "Home",
      services: "Services",
      automationCheck: "AI Automation Check",
      journal: "Insights",
      contact: "Contact",
      cta: "Book a call",
      account: "My cards",
      servicesDropdown: {
        "ki-beratung": { title: "AI consulting", sub: "Use cases · risk · roadmap" },
        prozessautomatisierung: { title: "Process automation", sub: "Workflows · API · automation" },
        "microsoft-365-automatisierung": {
          title: "Microsoft 365 automation",
          sub: "Power Automate · M365 · SharePoint",
        },
        "interne-tools": { title: "Internal tools", sub: "Dashboards · tools · integrations" },
        "ki-schulungen": { title: "AI training & guidelines", sub: "Training · guidelines · GDPR" },
      },
    },

    footer: {
      tagline:
        "AI & automation consulting for mid-market businesses in Germany and Europe — practical, measurable, privacy-conscious.",
      chipLive: "",
      chipLanguages: "DE · EN · TR",
      cols: {
        servicesHeading: "Services",
        studioHeading: "Studio",
        reachHeading: "Reach",
        legalHeading: "Legal",
        services: {
          automationCheck: "AI Automation Check",
          consulting: "AI consulting",
          automation: "Process automation",
          internalTools: "Internal tools & integrations",
          training: "AI training & guidelines",
        },
        studio: {
          about: "About me",
          journal: "Insights",
          contact: "Contact",
        },
        reach: {
          email: "info@opsolid.de",
          linkedinLabel: "LinkedIn",
          linkedinHref: "https://www.linkedin.com/company/opsolid/",
        },
        legal: {
          privacy: "Privacy",
          imprint: "Imprint",
        },
      },
      base: {
        copyrightSuffix: "OpSolid · Arnsberg, DE",
        trustLine: "",
      },
    },

    home: {
      hero: {
        metaChip: "",
        metaLabel: "[ AI & AUTOMATION CONSULTING ]",
        title: {
          pre: "AI and automation for ",
          italic: "more efficient",
          post: " business processes.",
        },
        lead:
          "OpSolid helps small and mid-sized businesses simplify manual tasks, Excel processes, email workflows and internal operations with AI, automation and modern tools.",
        ctaPrimary: "Book a free discovery call",
        ctaSecondary: "See the AI & Automation Check",
        stats: [] as Array<{ value: string; label: string }>,
        benefits: [
          { icon: "workflow", label: "Less manual work" },
          { icon: "bolt", label: "Faster processes" },
          { icon: "shield", label: "Safer AI use" },
        ],
      },

      problem: {
        eyebrow: "[ THE STATUS QUO ]",
        headline: "Do these problems sound familiar?",
        lead:
          "Most SMEs lose hours every week to manual handoffs, scattered data, and copy-paste between tools — work that runs the team rather than the team running it.",
        items: [
          {
            title: "Repetitive tasks eat up time every day",
            body: "Quotes, invoices, status updates and follow-ups still go out by hand.",
          },
          {
            title: "Information lives in silos — email, Excel, separate tools",
            body: "The same data is entered three times; nothing reconciles automatically.",
          },
          {
            title: "People copy data between systems by hand",
            body: "CRM, ERP, spreadsheets — bridges that should have been built in are left to the team.",
          },
          {
            title: "Offers, reports and documents take too long",
            body: "Templates exist but assembling them is still manual work.",
          },
          {
            title: "AI is in use, but without structure or a privacy concept",
            body: "ChatGPT in shadow IT — no guidelines, no audit trail, no clear ownership.",
          },
        ],
      },

      services: {
        eyebrow: "[ WHAT OPSOLID DOES ]",
        headline: "What OpSolid takes off your plate",
        lead:
          "Four focused areas. Each one tied to a measurable outcome — fewer manual touches, shorter cycle times, safer AI use.",
        cards: [
          {
            icon: "bot",
            title: "AI consulting",
            body:
              "We identify worthwhile AI use cases, weigh value against risk, and produce a realistic roadmap for your business.",
            tag: "USE CASES · RISK · ROADMAP",
          },
          {
            icon: "workflow",
            title: "Process automation",
            body:
              "We automate recurring tasks with Microsoft 365, Power Automate, Make, APIs, Python and custom workflows.",
            tag: "M365 · POWER AUTOMATE · APIS",
          },
          {
            icon: "plug",
            title: "Internal tools & integrations",
            body:
              "We connect existing systems, eliminate media breaks, and build small internal tools for everyday operations.",
            tag: "INTEGRATIONS · INTERNAL TOOLS",
          },
          {
            icon: "shield",
            title: "AI training & guidelines",
            body:
              "We train teams to use AI safely and productively, and write simple guidelines that fit your everyday work.",
            tag: "TRAINING · GUIDELINES · GDPR",
          },
        ],
      },

      automationCheckCard: {
        eyebrow: "[ ENTRY ENGAGEMENT ]",
        badge: "AI & AUTOMATION CHECK",
        title: {
          pre: "A clear ",
          italic: "first step",
          post: " for AI and automation",
        },
        lead:
          "60–90 minutes. We map your most important manual processes, identify five concrete automation candidates and hand over a usable 30-day plan.",
        bullets: [
          "60–90 minute analysis call",
          "Capture of your key manual processes",
          "Identification of 5 automation opportunities",
          "Assessment by effort, value and risk",
          "Concrete 30-day implementation plan",
          "Optional: implementation of a first pilot workflow",
        ],
        priceNote: "Price on request",
        ctaPrimary: "Request the AI & Automation Check",
        ctaSecondary: "See what's included",
      },

      useCases: {
        eyebrow: "[ TYPICAL USE CASES ]",
        headline: "What we automate, in practice",
        lead:
          "A short selection of the workflows we have built or scoped for SMEs. Less copy-paste, fewer mistakes, faster turnaround.",
        cards: [
          {
            title: "Email classification & routing",
            body: "Inbound mail tagged by topic and pushed to the right inbox or ticket — no more manual triage.",
          },
          {
            title: "Quote and document generation",
            body: "Templates filled from CRM data and sent for approval — quotes leave the same day.",
          },
          {
            title: "Excel & reporting automation",
            body: "Recurring reports built once and rebuilt automatically — KPIs ready when the meeting starts.",
          },
          {
            title: "CRM / ERP data sync",
            body: "Data flows once between systems and reconciles itself — no double entry.",
          },
          {
            title: "Document summarisation",
            body: "Long PDFs, contracts and meeting notes turned into a clear summary the team can act on.",
          },
          {
            title: "Internal AI knowledge base",
            body: "Search your own documents, policies and FAQs — answers stay inside your organisation.",
          },
          {
            title: "Meeting notes & task tracking",
            body: "Calls transcribed, decisions extracted, tasks pushed into your system.",
          },
          {
            title: "Support & inbound request handling",
            body: "First-level questions handled automatically — humans take the cases that need them.",
          },
        ],
      },

      targetGroup: {
        eyebrow: "[ WHO IT'S FOR ]",
        headline: "Who OpSolid is built for",
        lead:
          "We work best with companies that have grown faster than their internal systems — and want a measurable next step rather than a platform pitch.",
        items: [
          "Mid-sized businesses (SMEs · Mittelstand)",
          "Trades and production companies",
          "Sales and service teams",
          "Companies with many Excel, email or document-heavy processes",
          "Teams that want to use AI — but in a structured, safe way",
        ],
      },

      trust: {
        eyebrow: "[ WHY OPSOLID ]",
        headline: "Why OpSolid",
        lead:
          "Practical, measurable, privacy-conscious. No oversized platforms, no buzzwords, no AI for its own sake.",
        items: [
          {
            title: "Hands-on IT and project management background",
            body: "Years of running IT projects, digitalisation and process work in real companies — not consultancy theatre.",
          },
          {
            title: "Focus on measurable process improvement",
            body: "Every engagement starts with a baseline and ends with a number you can act on.",
          },
          {
            title: "No unnecessarily complex systems",
            body: "We build the smallest thing that actually solves the problem — then extend if it keeps paying off.",
          },
          {
            title: "Privacy-conscious by default",
            body: "EU hosting, GDPR-native infrastructure, no shadow IT — set up so audit and compliance can follow along.",
          },
          {
            title: "Plain language instead of tech-speak",
            body: "Decision-makers shouldn't need an IT translator to follow the proposal.",
          },
          {
            title: "Implementation through partners or directly",
            body: "Delivered through the OpSolid network or built directly — whichever fits the scope.",
          },
        ],
      },

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

      capabilities: {
        eyebrow: "[ 02 / 04 ] CAPABILITIES",
        headline: "What we own end-to-end",
        lead:
          "Not a platform, not a marketplace. A small, focused studio that takes operations as they are — manual, half-automated, stitched together — and leaves them running as systems that don't need constant attention.",
        seeAffordance: "+ See it run",
        closeAffordance: "− Close",
        cards: [
          {
            icon: "workflow",
            title: "Workflow automation",
            body:
              "Orders, documents, approvals, communications. Built around your processes with custom orchestration and dedicated connectors — not on closed off-the-shelf SaaS.",
            tag: "API · WEBHOOKS · CUSTOM",
          },
          {
            icon: "plug",
            title: "Systems integration",
            body:
              "ERP, CRM, warehouse, billing, messaging — wired together so data moves once and reconciles automatically. Adapters owned by you, not rented.",
            tag: "ADAPTERS · WEBHOOKS · APIS",
          },
          {
            icon: "bot",
            title: "AI-assisted processes",
            body:
              "Where routing, extraction, or classification earns its keep — and only there. Advised against where it doesn't. Every model call audited and logged.",
            tag: "LLM · RETELL · VAPI",
          },
          {
            icon: "ship",
            title: "Internal tools",
            body:
              "Admin consoles, ops dashboards, approval queues. Built on the systems you already run so your team has one place to work from.",
            tag: "REACT · POSTGRES · CAL",
          },
          {
            icon: "radio",
            title: "Voice & chat agents",
            body:
              "Phone answering, WhatsApp triage, web chat. Transferred to humans when the script runs out — never when it's inconvenient for you.",
            tag: "24/7 · EN · DE · TR",
          },
          {
            icon: "shield",
            title: "GDPR-native infrastructure",
            body:
              "German hosting, EU data residency, ISO 27001-aligned practices. Every customer owns their data, their workflows, and their escape hatch.",
            tag: "FRA · AV-DSGVO · ISO 27001",
          },
        ],
      },

      specimen: {
        eyebrow: "[ 03 / 04 ] INDUSTRY BASELINE",
        title: {
          pre: "The numbers automation is ",
          italic: "measured",
          post: " against",
        },
        body:
          "Every automation is measured against the industry's reference figures. Today's typical state on the left, the result we aim for on the right.",
        chipBefore: "INDUSTRY MEDIAN",
        chipAfter: "AUTOMATION TARGET",
        rows: [
          {
            label: "Quote-to-cash cycle time",
            sub: "Industry reference · mid-size operations",
            value: "3–7 days",
            delta: "vs. <4h automated",
          },
          {
            label: "Manual touches per order",
            sub: "Industry reference · mid-size operations",
            value: "4–9",
            delta: "vs. 1–2 automated",
          },
          {
            label: "Voice response latency",
            sub: "Industry reference · 2025",
            value: "<800ms",
            delta: "end-to-end, natural flow",
          },
          {
            label: "Time to exit the system",
            sub: "OpSolid · the source code stays with you",
            value: "0",
            delta: "handover within weeks",
          },
        ],
      },

      process: {
        eyebrow: "[ HOW WE WORK ]",
        headline: "How the engagement runs",
        lead:
          "Four short steps. Map first, scope tightly, deliver one thing well, and extend only where it keeps paying off — no platform rollouts, no multi-quarter discovery.",
        steps: [
          {
            num: "01",
            title: "Discovery call",
            body:
              "A focused first conversation. We listen to where the team currently loses time and what the day-to-day actually looks like — no slide deck, no sales pitch.",
            chipA: "30–60 min",
            chipB: "No obligation",
          },
          {
            num: "02",
            title: "Process analysis",
            body:
              "We map the most relevant workflows end-to-end — handoffs, tools, data, exceptions — and write it down clearly enough that the team can audit it.",
            chipA: "AI & Automation Check",
            chipB: "Written plan",
          },
          {
            num: "03",
            title: "Solution concept",
            body:
              "A short, concrete proposal: what to automate first, with which tools, expected effort and the measurable outcome. Honest about what's not worth it.",
            chipA: "Scope · effort · outcome",
            chipB: "Decision-ready",
            chipBHot: true,
          },
          {
            num: "04",
            title: "Implementation & optimisation",
            body:
              "We build it — alone or with your team — and keep iterating where it pays off. Handover notes and source belong to you from day one.",
            chipA: "Pilot → rollout",
            chipB: "You own the code",
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

    aiAutomationCheckPage: {
      hero: {
        metaChip: "AI & AUTOMATION CHECK",
        metaLabel: "[ ENTRY ENGAGEMENT · 60–90 MIN ]",
        title: {
          pre: "Find the ",
          italic: "real",
          post: " automation potential in your business",
        },
        lead:
          "A focused 60–90 minute analysis call, plus a written 30-day plan with five concrete automation candidates — scored by effort, value and risk. Designed as a low-risk first step before any larger project.",
        ctaPrimary: "Request the AI & Automation Check",
        ctaSecondary: "Back to overview",
      },
      problem: {
        eyebrow: "[ WHY IT EXISTS ]",
        headline: "Most automation projects fail before they start",
        lead:
          "Not because the technology doesn't work — but because the wrong process gets automated, or no one wrote down what the team actually does. The AI & Automation Check fixes that with a short, structured analysis.",
        items: [
          "Symptoms get automated instead of root causes",
          "AI tools are bought without a clear use case",
          "ROI is impossible to measure because there's no baseline",
          "Teams can't tell what should stay manual on purpose",
        ],
      },
      package: {
        eyebrow: "[ WHAT YOU GET ]",
        headline: "What's included",
        bullets: [
          {
            title: "60–90 minute analysis call",
            body: "On-site or remote. We listen to how work currently moves through the team — no slide deck.",
          },
          {
            title: "Capture of your key manual processes",
            body: "We write down the most relevant workflows so they're auditable by the team, not stuck in someone's head.",
          },
          {
            title: "5 concrete automation candidates",
            body: "Picked from your real processes — not a generic list of AI ideas.",
          },
          {
            title: "Scored by effort, value and risk",
            body: "Each candidate rated so leadership can prioritise without becoming the tech expert.",
          },
          {
            title: "A clear 30-day implementation plan",
            body: "Concrete next steps, tools, owners and the expected outcome.",
          },
          {
            title: "Optional: pilot workflow implementation",
            body: "If it makes sense, we build the first automation directly — fixed scope, fixed timeline.",
          },
        ],
      },
      audience: {
        eyebrow: "[ WHO IT'S FOR ]",
        headline: "Who the Check is right for",
        items: [
          "Mid-sized companies that want a measurable first step",
          "Teams already using AI in shadow IT and want structure",
          "Operations leads with too many manual handoffs",
          "Companies evaluating Microsoft 365 / Power Automate / Make",
          "Anyone who wants an outside read on \"what should we even automate first?\"",
        ],
      },
      deliverables: {
        eyebrow: "[ DELIVERABLES ]",
        headline: "What lands in your inbox",
        items: [
          "Written process map of the workflows we discussed",
          "5 scored automation opportunities",
          "Recommended tools and rough effort estimate per opportunity",
          "30-day implementation plan with owners",
          "A short note on what should stay manual — and why",
        ],
      },
      process: {
        eyebrow: "[ HOW IT RUNS ]",
        headline: "How the Check runs",
        steps: [
          { num: "01", title: "Kickoff", body: "Short prep call to align on goals and which processes are in scope." },
          { num: "02", title: "Analysis call", body: "60–90 minutes with the people who actually do the work." },
          { num: "03", title: "Written plan", body: "Within a few working days you receive the written 30-day plan." },
          { num: "04", title: "Walk-through", body: "30-minute review call to clarify scope, effort and next steps." },
        ],
      },
      faq: {
        eyebrow: "[ FAQ ]",
        headline: "Common questions",
        items: [
          { q: "What does the AI & Automation Check cost?", a: "Price on request — depends on scope and team size. We share a fixed price after the first short call." },
          { q: "Do you sign a confidentiality agreement?", a: "Yes — a standard NDA is signed before the analysis call." },
          { q: "Is this only for companies already using AI?", a: "No. Many engagements begin with no AI in use." },
          { q: "Can we use our existing tools?", a: "Yes — wherever Microsoft 365, Google Workspace, your CRM or ERP can carry the workflow, we use them first." },
          { q: "What happens after the Check?", a: "Either you implement the plan yourself, we implement a pilot together, or we stop there. No lock-in." },
        ],
      },
      finalCta: {
        eyebrow: "[ NEXT STEP ]",
        title: {
          pre: "Find out ",
          italic: "what's worth automating",
          post: " in your business.",
        },
        lead:
          "One call. One written plan. No obligation after — we'd rather tell you it's not the right time than ship a project that doesn't pay off.",
        ctaPrimary: "Request the AI & Automation Check",
        ctaSecondary: "Book a discovery call instead",
      },
    },

    leistungen: {
      meta: {
        title: "Services — AI, Automation & Digital Processes | OpSolid",
        description:
          "OpSolid services for SMEs: AI consulting, process automation, Microsoft 365 automation, internal tools, and AI training. Practical, measurable, GDPR-conscious.",
      },
      hero: {
        metaChip: "",
        metaLabel: "[ SERVICES · 2026 ]",
        title: {
          pre: "Services for AI, automation and ",
          italic: "digital processes",
          post: "",
        },
        lead:
          "Five focused service areas. We pick the smallest engagement that solves the problem, ship it, and only extend where it keeps paying off — no platform rollouts, no multi-quarter discovery.",
        ctaPrimary: "Book a discovery call",
        ctaSecondary: "Start with the AI Automation Check",
      },
      cards: {
        eyebrow: "[ WHAT WE OFFER ]",
        headline: "Five practical service areas",
        lead:
          "Each area has its own page with use cases, tools, process and pricing. Most engagements start with an AI & Automation Check — the cheapest way to make sure we automate the right thing.",
        items: [
          {
            slug: "ki-beratung",
            icon: "bot",
            title: "AI consulting",
            body:
              "Identify worthwhile AI use cases for your business. We weigh value against risk and produce a realistic, decision-ready roadmap.",
            tag: "USE CASES · RISK · ROADMAP",
            linkLabel: "More on AI consulting",
          },
          {
            slug: "prozessautomatisierung",
            icon: "workflow",
            title: "Process automation",
            body:
              "Automate manual workflows end-to-end. Quotes, invoices, reports, document generation, email routing — built on the tools you already pay for.",
            tag: "WORKFLOWS · API · AUTOMATION",
            linkLabel: "More on process automation",
          },
          {
            slug: "microsoft-365-automatisierung",
            icon: "plug",
            title: "Microsoft 365 automation",
            body:
              "Power Automate, Power Apps, Teams, SharePoint, Outlook — wired together so your daily tooling actually does the work for the team.",
            tag: "POWER AUTOMATE · M365 · SHAREPOINT",
            linkLabel: "More on Microsoft 365 automation",
          },
          {
            slug: "interne-tools",
            icon: "ship",
            title: "Internal tools",
            body:
              "Small, focused internal tools where SaaS doesn't fit: admin consoles, approval queues, dashboards, knowledge bases — built on systems you already run.",
            tag: "DASHBOARDS · TOOLS · INTEGRATIONS",
            linkLabel: "More on internal tools",
          },
          {
            slug: "ki-schulungen",
            icon: "shield",
            title: "AI training & guidelines",
            body:
              "Train teams to use AI safely and productively. Written guidelines, role-based playbooks, GDPR-compliant setup — no shadow IT.",
            tag: "TRAINING · GUIDELINES · GDPR",
            linkLabel: "More on AI training",
          },
        ],
      },
      process: {
        eyebrow: "[ HOW WE WORK ]",
        headline: "How an engagement runs",
        lead:
          "Same approach across every service area: map first, scope tightly, deliver one thing well.",
        steps: [
          {
            num: "01",
            title: "Discovery call",
            body:
              "30–60 minute conversation. We listen to where the team loses time and what the day-to-day actually looks like.",
          },
          {
            num: "02",
            title: "Analysis & proposal",
            body:
              "We write down the relevant workflows, score automation candidates, and propose the smallest thing worth building first.",
          },
          {
            num: "03",
            title: "Implementation",
            body:
              "We build it — alone or with your team — and only extend where it keeps paying off. Source code stays with you.",
          },
        ],
      },
      faq: {
        eyebrow: "[ FAQ ]",
        headline: "Common questions about our services",
        items: [
          {
            q: "Do we have to choose one service area?",
            a: "No. Most engagements span two or three areas — an AI use case usually needs automation around it, and a custom tool usually needs training. We scope what's actually useful, not what fits a service catalogue.",
          },
          {
            q: "How do you charge?",
            a: "Either fixed-price per delivery (AI Automation Check, pilot workflow, training day) or as a small monthly retainer for ongoing iteration. Price on request — depends on scope and team size.",
          },
          {
            q: "Can we use our existing tools?",
            a: "Yes. Microsoft 365, Google Workspace, your CRM, your ERP — we use what you already pay for wherever it can carry the workflow.",
          },
          {
            q: "Where is the data hosted?",
            a: "EU only, by default. Frankfurt or other EU regions. AVV (Auftragsverarbeitungsvertrag) signed before any engagement that touches customer data.",
          },
          {
            q: "Do you build from scratch or use platforms?",
            a: "Both — wherever Power Automate, Make or n8n can do the job, we use them. Where they can't, we build small Python services, Next.js tools or custom integrations.",
          },
        ],
      },
      finalCta: {
        eyebrow: "[ FIRST STEP ]",
        title: {
          pre: "Not sure which service ",
          italic: "fits best",
          post: "?",
        },
        lead:
          "Start with the AI & Automation Check or a free discovery call. We tell you which area gives the highest leverage — even if it's not the one you asked about.",
        ctaPrimary: "Request the AI Automation Check",
        ctaSecondary: "Book a discovery call",
      },
    },

    services: {
      shared: {
        whatWeDoEyebrow: "[ WHAT WE DO ]",
        useCasesEyebrow: "[ USE CASES ]",
        toolsEyebrow: "[ TOOLS & STACK ]",
        processEyebrow: "[ HOW IT RUNS ]",
        faqEyebrow: "[ FAQ ]",
        finalCtaEyebrow: "[ NEXT STEP ]",
        backToServices: "All services",
      },
      kiBeratung: {
        slug: "ki-beratung",
        meta: {
          title: "AI Consulting for SMEs — Use Cases, Risk, Roadmap | OpSolid",
          description:
            "AI consulting for mid-sized businesses in Germany. We identify worthwhile AI use cases, weigh value against risk, and produce a decision-ready roadmap. GDPR-conscious.",
        },
        hero: {
          metaChip: "AI CONSULTING",
          metaLabel: "[ SERVICE · 01 / 05 ]",
          title: {
            pre: "Which AI ",
            italic: "actually pays off",
            post: " for your business?",
          },
          lead:
            "AI is being sold to every department right now — but only a few use cases are worth the effort, the cost and the risk. We help you tell the difference and produce a roadmap you can actually defend in front of leadership.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
        whatWeDo: {
          headline: "What AI consulting with OpSolid looks like",
          bullets: [
            "Identify three to five AI use cases that fit your business — and rule out the ones that don't.",
            "Score each use case by expected value, implementation effort and operational risk.",
            "Write down a 6–12-month AI roadmap with clear owners, costs and decision points.",
            "Set up GDPR-compliant AI use with model choice, data residency and a short company guideline.",
          ],
        },
        useCases: {
          headline: "What we have advised or scoped",
          items: [
            {
              title: "Document & contract analysis",
              body: "Pre-classify long PDFs, extract clauses, surface deadlines — humans review the summary instead of the document.",
            },
            {
              title: "Internal knowledge search",
              body: "Index your own policies, FAQs and SharePoint — staff get answers from your documents, not from public ChatGPT.",
            },
            {
              title: "Quote and proposal drafting",
              body: "Draft tailored offers from a template, the CRM record and a short brief — sales reviews instead of writing from scratch.",
            },
            {
              title: "Support triage and routing",
              body: "Classify incoming requests by topic and urgency before they hit a human queue.",
            },
          ],
        },
        tools: {
          headline: "Models, vendors and frameworks we work with",
          items: [
            "OpenAI · GPT-4 family",
            "Anthropic · Claude",
            "Microsoft Copilot · Azure OpenAI",
            "Mistral · open-source options",
            "Retrieval-augmented generation (RAG)",
            "Vector databases · pgvector · Qdrant",
            "GDPR-native EU hosting",
          ],
        },
        process: {
          headline: "How an AI consulting engagement runs",
          steps: [
            { num: "01", title: "Discovery", body: "Short call to understand your team, your data and what you're trying to achieve." },
            { num: "02", title: "Use-case scoring", body: "Workshop and written analysis: which AI use cases are worth it for you, which are not." },
            { num: "03", title: "Roadmap & guideline", body: "Decision-ready 6–12-month roadmap plus a short, written AI guideline for the company." },
          ],
        },
        faq: {
          headline: "AI consulting — common questions",
          items: [
            { q: "Do we have to be 'AI-ready'?", a: "No. Most clients are not — that's exactly why they need this work done before spending money on tools." },
            { q: "Do you sell AI tools?", a: "No. We are independent — we recommend what fits, including 'use what you already have' or 'don't do this yet'." },
            { q: "Can we use AI in a GDPR-compliant way?", a: "Yes, with the right model choice, EU hosting and a written guideline. We help you set this up." },
            { q: "How long does a consulting engagement take?", a: "Typically two to four weeks for the analysis and roadmap. Implementation timelines are separate and scope-dependent." },
          ],
        },
        finalCta: {
          title: { pre: "Find out which AI use cases ", italic: "are worth it", post: " for you." },
          lead: "One call. One written roadmap. No platform pitch.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
      },
      prozessautomatisierung: {
        slug: "prozessautomatisierung",
        meta: {
          title: "Process Automation for SMEs — Power Automate, Make, Python | OpSolid",
          description:
            "Automate manual workflows — quotes, invoices, document generation, email routing, data sync. Built on the tools you already pay for. GDPR-native.",
        },
        hero: {
          metaChip: "PROCESS AUTOMATION",
          metaLabel: "[ SERVICE · 02 / 05 ]",
          title: {
            pre: "Manual tasks that ",
            italic: "no one should be doing",
            post: " by hand anymore",
          },
          lead:
            "Quotes that take half a day. Reports that get rebuilt every Monday. Data copied between Excel, CRM and email. We map these workflows, automate the parts worth automating, and leave the rest to people.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
        whatWeDo: {
          headline: "What process automation with OpSolid looks like",
          bullets: [
            "Map the end-to-end workflow — handoffs, tools, data, exceptions — clearly enough that the team can audit it.",
            "Identify which steps are automation-worth and which should stay manual on purpose.",
            "Build the automation on Power Automate, Make, n8n, Python or custom code — whichever fits.",
            "Monitor, document and hand over so your team owns the workflow afterwards.",
          ],
        },
        useCases: {
          headline: "Workflows we have automated",
          items: [
            {
              title: "Quote and document generation",
              body: "Templates filled from CRM data, approved in a workflow, and sent — quotes leave the same day.",
            },
            {
              title: "Email classification and routing",
              body: "Inbound mail tagged by topic and pushed to the right inbox or ticket queue — no manual triage.",
            },
            {
              title: "Reporting and Excel automation",
              body: "Recurring reports built once and rebuilt automatically — KPIs ready when the meeting starts.",
            },
            {
              title: "CRM / ERP data synchronisation",
              body: "Data flows once between systems and reconciles itself — no double entry.",
            },
          ],
        },
        tools: {
          headline: "Tools we automate with",
          items: [
            "Microsoft Power Automate",
            "Make (Integromat)",
            "n8n · self-hosted",
            "Zapier · where it fits",
            "Python · custom scripts",
            "REST APIs · Webhooks",
            "PostgreSQL · file storage · queues",
          ],
        },
        process: {
          headline: "How a process automation engagement runs",
          steps: [
            { num: "01", title: "Map", body: "Workshop with the team that actually does the work. We write down the workflow as it really runs." },
            { num: "02", title: "Build", body: "We implement the first pilot automation — usually within two to four weeks." },
            { num: "03", title: "Operate", body: "Documentation, handover, and a short period of iteration before you take it over." },
          ],
        },
        faq: {
          headline: "Process automation — common questions",
          items: [
            { q: "What's a typical first project?", a: "A single high-leverage workflow — quote generation, email triage, or a weekly report. Fixed scope, two to four weeks." },
            { q: "Do we need to replace our tools?", a: "No. We automate on top of what you have — Microsoft 365, Google Workspace, your CRM, your ERP." },
            { q: "What if the process changes later?", a: "Most automations are documented so your own IT team can adjust. For bigger changes, we offer a small monthly retainer." },
            { q: "Is it safe to automate critical processes?", a: "Yes — with proper logging, error handling and a manual fallback. We design for the failure case, not just the happy path." },
          ],
        },
        finalCta: {
          title: { pre: "Pick the first workflow ", italic: "worth automating", post: "." },
          lead: "We map it, score it and tell you whether it's worth the effort.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
      },
      microsoft365: {
        slug: "microsoft-365-automatisierung",
        meta: {
          title: "Microsoft 365 Automation — Power Automate, SharePoint, Teams | OpSolid",
          description:
            "Automate workflows inside Microsoft 365: Power Automate flows, SharePoint document libraries, Teams approvals, Outlook routing. EU-hosted, GDPR-conscious.",
        },
        hero: {
          metaChip: "MICROSOFT 365 AUTOMATION",
          metaLabel: "[ SERVICE · 03 / 05 ]",
          title: {
            pre: "Microsoft 365 already on every desk — ",
            italic: "now make it work for you",
            post: "",
          },
          lead:
            "Teams, SharePoint, Outlook and Power Automate are already paid for. With the right setup they replace most third-party automation tools you'd otherwise buy on top — fewer subscriptions, one identity, one audit trail.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
        whatWeDo: {
          headline: "What Microsoft 365 automation with OpSolid looks like",
          bullets: [
            "Audit your current Microsoft 365 tenant and identify automation opportunities the team isn't using yet.",
            "Build Power Automate flows for approvals, document generation, email routing and notifications.",
            "Connect SharePoint, Teams, Outlook and Excel so data lives in one place — not in seven copies.",
            "Set up Microsoft 365 Copilot responsibly with role-based access and clear guidelines.",
          ],
        },
        useCases: {
          headline: "Microsoft 365 workflows we have built",
          items: [
            {
              title: "Approval workflows in Teams",
              body: "Holiday requests, expense reports, document sign-off — approved in Teams, logged in SharePoint.",
            },
            {
              title: "Document generation from SharePoint lists",
              body: "Quotes, contracts and reports generated from a SharePoint list — no copy-paste from Excel.",
            },
            {
              title: "Outlook email parsing and routing",
              body: "Incoming orders, support requests or invoices parsed automatically and pushed into the right system.",
            },
            {
              title: "Microsoft 365 Copilot rollout",
              body: "Guidelines, role-based access and a short training so Copilot actually gets used — and used safely.",
            },
          ],
        },
        tools: {
          headline: "Microsoft technologies we work with",
          items: [
            "Microsoft Power Automate",
            "Power Apps · low-code apps",
            "SharePoint Online · Lists · Libraries",
            "Microsoft Teams · Bots · Approvals",
            "Outlook · Exchange",
            "Microsoft Graph API",
            "Microsoft 365 Copilot",
            "Entra ID (Azure AD)",
          ],
        },
        process: {
          headline: "How a Microsoft 365 engagement runs",
          steps: [
            { num: "01", title: "Tenant review", body: "We look at your current licences, security setup and tooling — and find what's underused." },
            { num: "02", title: "First flow", body: "We build the first Power Automate flow or Teams workflow as a pilot — usually within two weeks." },
            { num: "03", title: "Rollout", body: "Wider rollout with documentation, handover and optional training for your IT team." },
          ],
        },
        faq: {
          headline: "Microsoft 365 automation — common questions",
          items: [
            { q: "Do we need premium Power Automate licences?", a: "Sometimes — but most useful flows work on the standard Microsoft 365 plans. We tell you when premium is actually needed." },
            { q: "Is Microsoft 365 Copilot worth it?", a: "For some teams yes, for others no. We help you decide before you buy the licences." },
            { q: "Can you work with our IT department?", a: "Yes — most engagements involve your IT or one of your existing Microsoft partners. We complement, we don't replace." },
            { q: "Is this GDPR-compliant?", a: "Microsoft 365 in the EU tenant configuration is GDPR-compliant. We set it up correctly and document the data flows." },
          ],
        },
        finalCta: {
          title: { pre: "Get more out of Microsoft 365 ", italic: "without buying more tools", post: "." },
          lead: "One call. We'll tell you what's worth automating in your current tenant — before you add another subscription.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
      },
      interneTools: {
        slug: "interne-tools",
        meta: {
          title: "Internal Tools & Integrations — Admin Panels, Dashboards | OpSolid",
          description:
            "Small, focused internal tools for SMEs: admin consoles, approval queues, dashboards, knowledge bases. Built on systems you already run. EU-hosted.",
        },
        hero: {
          metaChip: "INTERNAL TOOLS",
          metaLabel: "[ SERVICE · 04 / 05 ]",
          title: {
            pre: "Where SaaS doesn't fit, ",
            italic: "a small custom tool",
            post: " does",
          },
          lead:
            "Not every internal job needs a €500/month platform. Sometimes a small custom admin panel, an approval queue or a dashboard solves the problem better, cheaper and faster — and stays your property.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
        whatWeDo: {
          headline: "What we build",
          bullets: [
            "Internal admin consoles for operations teams — clear, focused, no bloat.",
            "Dashboards on top of your existing data sources — KPIs, exceptions and alerts in one view.",
            "Approval queues, internal forms, escalation flows that fit your real process.",
            "Internal knowledge bases — search your own documents, policies and FAQs.",
          ],
        },
        useCases: {
          headline: "Internal tools we have built",
          items: [
            {
              title: "Operations admin console",
              body: "Order overview, exception handling, customer notes — one place instead of three tabs.",
            },
            {
              title: "Internal KPI dashboard",
              body: "Daily, weekly and monthly numbers from your CRM, ERP and finance system — without an analyst rebuilding the spreadsheet every week.",
            },
            {
              title: "Approval and escalation queue",
              body: "Quotes, contracts or refunds queued, routed and approved with a clear audit trail.",
            },
            {
              title: "Internal AI knowledge base",
              body: "Search your own documents, policies and FAQs — answers stay inside your organisation.",
            },
          ],
        },
        tools: {
          headline: "Tech stack",
          items: [
            "Next.js · React · TypeScript",
            "Node.js · Python",
            "PostgreSQL · Supabase",
            "REST · GraphQL · Webhooks",
            "Auth0 · Microsoft Entra ID · SSO",
            "Hetzner · IONOS · Vercel · EU hosting",
            "GitHub · CI/CD · audit logs",
          ],
        },
        process: {
          headline: "How an internal tool engagement runs",
          steps: [
            { num: "01", title: "Spec", body: "Short workshop to write down what the tool needs to do — and what it doesn't." },
            { num: "02", title: "Build", body: "Pilot version in three to six weeks. Real users, real data, fast iteration." },
            { num: "03", title: "Operate", body: "Handover with documentation, source code and a small retainer if you want ongoing iteration." },
          ],
        },
        faq: {
          headline: "Internal tools — common questions",
          items: [
            { q: "Is a custom tool really cheaper than SaaS?", a: "For specific, narrow problems — often yes. Especially when SaaS adoption is low or the tool needs to fit a unique process." },
            { q: "Who owns the code?", a: "You do. Source code, schemas and runbooks are yours from day one." },
            { q: "What if we want to change it later?", a: "You can — internally, with another provider, or with us. No lock-in." },
            { q: "Can it integrate with our existing systems?", a: "Yes — that's usually the whole point. CRM, ERP, Microsoft 365, your warehouse system." },
          ],
        },
        finalCta: {
          title: { pre: "Get a tool that ", italic: "fits your team", post: "." },
          lead: "One call. We'll tell you if a custom internal tool is the right move — or if a configured SaaS is enough.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
      },
      kiSchulungen: {
        slug: "ki-schulungen",
        meta: {
          title: "AI Training & Guidelines for SMEs — Safe, Productive Use of AI | OpSolid",
          description:
            "Practical AI training for SME teams: how to use AI safely and productively in everyday work. Written guidelines, role-based playbooks, GDPR-compliant setup.",
        },
        hero: {
          metaChip: "AI TRAINING",
          metaLabel: "[ SERVICE · 05 / 05 ]",
          title: {
            pre: "Your team. ",
            italic: "Safer and faster",
            post: " with AI.",
          },
          lead:
            "Half your team is already using ChatGPT in shadow IT. Without guidelines, that's a privacy problem and a quality problem. With them, it's a productivity boost. We help you set up the rules and train the people.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
        whatWeDo: {
          headline: "What an AI training engagement covers",
          bullets: [
            "Practical AI workshops for everyday tasks — drafting, summarising, classifying, structuring.",
            "Role-based playbooks for sales, support, finance, HR — not generic 'how to talk to ChatGPT' decks.",
            "Written AI guidelines and acceptable-use policy for the company — short, readable, enforceable.",
            "GDPR-compliant AI setup: model choice, data residency, audit trail, and what employees may and may not paste in.",
          ],
        },
        useCases: {
          headline: "Training formats we have run",
          items: [
            {
              title: "Company-wide AI primer",
              body: "Half-day session for all staff: what AI can and can't do, where it helps, where it hurts.",
            },
            {
              title: "Department-specific workshops",
              body: "Sales, support, finance, HR — each with role-specific prompts and example workflows.",
            },
            {
              title: "Leadership briefing",
              body: "A focused two-hour session for the leadership team — strategic implications, not prompt syntax.",
            },
            {
              title: "AI guideline rollout",
              body: "Written policy, internal Q&A and a short e-learning module so the rules actually stick.",
            },
          ],
        },
        tools: {
          headline: "Tools and platforms we train on",
          items: [
            "ChatGPT · GPT-4 family",
            "Microsoft 365 Copilot",
            "Claude · Anthropic",
            "Google Gemini · Workspace",
            "Notion AI · Slack AI",
            "Internal RAG / chat assistants",
            "GDPR best practice · audit logging",
          ],
        },
        process: {
          headline: "How a training engagement runs",
          steps: [
            { num: "01", title: "Audit", body: "Short interview round: who already uses AI, how, and where the risks sit." },
            { num: "02", title: "Tailor", body: "We tailor the training to your industry, your tools and your real use cases — no off-the-shelf decks." },
            { num: "03", title: "Roll out", body: "Workshops, written guideline, internal Q&A — and an optional follow-up after eight weeks." },
          ],
        },
        faq: {
          headline: "AI training — common questions",
          items: [
            { q: "How long is a typical training?", a: "Half a day for an all-staff primer; one or two full days for department-specific deep-dives." },
            { q: "Do you train in German?", a: "Yes — German and English. Turkish on request." },
            { q: "What's the difference vs. an online course?", a: "We train on your real workflows, your tools and your data — not on hypothetical examples. People remember what they actually used." },
            { q: "Do you also write the AI guideline?", a: "Yes — short, readable, enforceable. Tailored to your industry and tooling, not a 30-page legal document." },
          ],
        },
        finalCta: {
          title: { pre: "Help your team use AI ", italic: "safely and productively", post: "." },
          lead: "One call. We'll suggest a training format that actually fits your team — not a generic webinar.",
          ctaPrimary: "Book a discovery call",
          ctaSecondary: "Start with the AI Automation Check",
        },
      },
    },

    voiceAgent: {
      hero: {
        metaChip: "VOICE AGENT",
        metaLabel: "[ PRODUCT · 01 ]",
        title: {
          pre: "Answer every call in ",
          italic: "thirty seconds",
          post: " or less — around the clock",
        },
        lead:
          "A voice agent customers can't tell from a junior dispatcher. Routes by intent, books into your calendar, hands off warmly when the script runs out. Deployed on Retell or Vapi, audited end-to-end, trained on your own playbook.",
        ctaPrimary: "Book a pilot",
        ctaSecondary: "See a live call",
        features: [
          {
            label: "LATENCY",
            value: "<800",
            unit: "ms p50",
            sub: "end-to-end · real-time",
          },
          {
            label: "LANGUAGES",
            value: "DE · EN · TR",
            unit: "",
            sub: "auto-detected",
          },
          {
            label: "UPTIME",
            value: "99.9",
            unit: "% target",
            sub: "Retell SLA · vendor-measured",
          },
        ],
      },
      flow: {
        eyebrow: "[ CALL FLOW ]",
        headline: "Every call, four moves",
        lead:
          "The agent is deterministic where it needs to be — identity, scheduling, transfer — and conversational where it can be. No open-ended chat that invents policy.",
        steps: [
          {
            num: "01 · GREET",
            title: "Pick up within one ring.",
            body:
              "Opening line in your brand's voice. Language auto-detected from the first sentence.",
          },
          {
            num: "02 · CLASSIFY",
            title: "Route by intent, not menu.",
            body:
              "Booking, support, dispatch, delivery, emergency. Mapped to your team's actual queues.",
          },
          {
            num: "03 · RESOLVE",
            title: "Do the thing, write the record.",
            body:
              "Books into Cal.com, updates CRM, posts to ops channel. Every action logged with a trace ID.",
          },
          {
            num: "04 · HANDOFF",
            title: "Escalate before it fails.",
            body:
              "If confidence drops or intent is new, warm-transfer to a human with full transcript context.",
          },
        ],
      },
      spec: {
        eyebrow: "[ TECHNICAL SPEC ]",
        headline: "Built on tools you can open and inspect",
        lead:
          "No closed-off pricing tiers. Every layer is swappable, every setting is versioned on your side.",
        rows: [
          { label: "Platform", value: "Set up to your specification" },
          { label: "Speech recognition", value: "Multi-lingual, real-time" },
          { label: "Language understanding", value: "Leading production models; on-prem when required" },
          { label: "Voice synthesis", value: "Tone tuned to your brand" },
          { label: "Telephony", value: "German number · GDPR agreement" },
          { label: "Integrations", value: "Cal.com, HubSpot, Pipedrive, SAP, custom connectors" },
          { label: "Data residency", value: "EU-west · Frankfurt · no US subprocessors" },
          { label: "Handover time", value: "Two weeks. Settings, data and numbers all portable." },
        ],
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
    },

    contact: {
      hero: {
        metaChip: "BOOKING OPEN · 2026 Q2",
        metaLabel: "[ CONTACT ]",
        title: {
          pre: "Thirty minutes. ",
          italic: "A written plan",
          post: "",
        },
        lead:
          "One short call. An operations walkthrough, a clear assessment of what should and shouldn't be automated, and a written summary in your inbox within 48 hours — whether the engagement moves forward or not.",
        contacts: [] as Array<{ key: string; value: string; meta: string; href: string }>,
        trust: [] as Array<{ em: string; rest: string }>,
      },
      form: {
        title: "Book a discovery call",
        meta: "FORM · 01",
        fields: {
          name: { label: "Name", placeholder: "Your full name" },
          company: { label: "Company", placeholder: "Operating entity" },
          email: { label: "Email", placeholder: "you@company.de" },
          phone: { label: "Phone (optional)", placeholder: "+49 …" },
          interest: { label: "Interested in" },
          message: {
            label: "What's on your operations floor?",
            placeholder:
              "A sentence or two on what's manual, what's fragile, what you'd like to stop thinking about.",
          },
        },
        topics: [
          { key: "automation", label: "Workflow automation" },
          { key: "integration", label: "Systems integration" },
          { key: "voice", label: "Voice agent" },
          { key: "card", label: "Digital card" },
          { key: "kutasia", label: "Kutasia" },
          { key: "other", label: "Something else" },
        ],
        legal:
          "Submissions reach us directly. We don't use third-party analytics; you won't be added to a marketing list, and there's no automated follow-up after 14 days.",
        submitCta: "Request call",
        success: "Thanks — we'll reply within 48 hours.",
        error: "Something didn't send. Try again or email directly.",
      },
    },

    blog: {
      head: {
        eyebrow: "[ JOURNAL · VOL. 0 ]",
        title: {
          pre: "Notes from the ",
          italic: "operations floor",
          post: "",
        },
        intro:
          "Field notes, engagement reports, and the occasional strong opinion. First pieces are being written — subscribe below to hear when they land.",
      },
      emptyFeature: {
        tag: "COMING · LONG-FORM",
        headline:
          "Focused automation: what moves a business vs. what just looks good in a deck",
        lede:
          "Opening piece of the journal. Draft in progress — on how a focused, sub-20-line automation outperforms an ERP replacement on the measurements that matter.",
        meta: "D. PIHA · SCHEDULED · 15 MIN",
      },
      series: {
        title: "Practical playbooks for automating operations",
        body:
          "An ongoing series. First six pieces scheduled — second half next quarter. No email blasts, no drip campaigns, just a note when something lands.",
        placeholder: "you@company.de",
        cta: "Subscribe",
        legal: "One email per post. Unsubscribe in one click.",
      },
    },

    legal: {
      impressum: {
        eyebrow: "[ LEGAL · IMPRINT ]",
        title: "Impressum",
      },
      privacy: {
        eyebrow: "[ LEGAL · PRIVACY ]",
        title: "Privacy",
      },
    },

    kutasia: {
      hero: {
        metaChip: "KUTASIA",
        metaLabel: "[ WORKSPACE · SMB ]",
        title: {
          pre: "The AI workspace for ",
          italic: "customer ops",
          post: " that don't sleep",
        },
        lead:
          "Unified WhatsApp, Telegram, Email and Voice in one AI-assisted workspace — built for SMBs across Germany and Turkey whose business runs on customer conversations. From the bakery taking supplier voice notes to the clinic recovering no-shows from the waitlist.",
        ctaPrimary: "Open workspace",
        ctaSecondary: "See the automations",
      },
      rooms: {
        eyebrow: "[ AUTOMATIONS ]",
        headline: "Six automations. One workspace",
        lead:
          "Each automation runs end-to-end in under 90 seconds, demoable from a phone at the booth. Run them standalone or chain them — the unified inbox keeps every channel, conversation, and AI suggestion in a single view.",
        items: [
          {
            n: "01 · UNIFIED INBOX",
            h: "Every channel, one screen.",
            b: "WhatsApp, Telegram, Email, Voice transcripts and web forms in one inbox — with AI summary, sentiment, and suggested reply on every thread.",
            rows: [
              { label: "CHANNELS", value: "WA · TG · EMAIL · VOICE" },
              { label: "AI", value: "SUMMARY · SENTIMENT · DRAFT" },
              { label: "ASSIGN", value: "ROLES · TEAMS · TAGS" },
            ],
          },
          {
            n: "02 · VOICE NOTE → TICKET",
            h: "From voice memo to structured action.",
            b: "Customer or supplier sends a voice note on WhatsApp — Whisper transcribes, the LLM extracts items, quantities, dates. Lands as a confirmed ticket with a Telegram summary to the owner.",
            rows: [
              { label: "TRANSCRIBE", value: "WHISPER · MULTILINGUAL" },
              { label: "EXTRACT", value: "ITEMS · QTY · DATE" },
              { label: "OUTPUT", value: "TICKET + TG ALERT" },
            ],
          },
          {
            n: "03 · MULTILINGUAL TRIAGE",
            h: "TR ↔ DE ↔ EN, on the fly.",
            b: "The customer writes in their language. The owner sees a one-line summary in theirs. AI reply drafts come back in the customer's language, signed in your tone.",
            rows: [
              { label: "DETECT", value: "AUTO · 12 LANGS" },
              { label: "TRANSLATE", value: "CONTEXT-AWARE" },
              { label: "ROUTE", value: "TG / WEB OWNER PING" },
            ],
          },
          {
            n: "04 · NO-SHOW RECOVERY",
            h: "Empty slots that fill themselves.",
            b: "A booking cancels — the system fires a parallel WhatsApp template to the top 3 from your waitlist. First reply claims the slot, others get a polite stand-down message.",
            rows: [
              { label: "TRIGGER", value: "CAL.COM · MANUAL" },
              { label: "TEMPLATE", value: "WA UTILITY · APPROVED" },
              { label: "RACE", value: "FIRST-YES WINS" },
            ],
          },
          {
            n: "05 · EMAIL → QUOTE DRAFT",
            h: "RFQ in, draft out, human send.",
            b: "Inbound RFQ matches your keyword rules. AI drafts a quote against your price list and sits it in the Outbox awaiting human approval — no auto-send, no surprises.",
            rows: [
              { label: "INTAKE", value: "IMAP · POSTMARK" },
              { label: "PRICE LIST", value: "JSON · CSV · API" },
              { label: "APPROVE", value: "HUMAN IN THE LOOP" },
            ],
          },
          {
            n: "06 · AI ANALYTICS",
            h: "Only what helps you act.",
            b: "Response time, sentiment trend, intent mix, conversation cost. Daily digest to email or Telegram. No vanity dashboards — the chart either changes a decision or it isn't shipped.",
            rows: [
              { label: "EXPORTS", value: "CSV · API" },
              { label: "DIGEST", value: "EMAIL · TG · WEEKLY" },
              { label: "PRIVACY", value: "GDPR · EU-HOSTED" },
            ],
          },
        ],
      },
    },

    productsHub: {
      meta: {
        title: "Products — Voice, OpSo Smart, Chat, WhatsApp, Booking, Email, Lead, Custom, Kutasia | OpSolid",
        description: "Nine products from one studio: AI agents for phone, chat, WhatsApp, email and lead qualification, free digital business cards (OpSo Smart), custom workflow automation, and Kutasia — the unified AI workspace for DACH and TR SMBs. Every product transparent-priced and EU-hosted.",
      },
      hero: {
        eyebrow: "[ PRODUCTS · 2026 ]",
        title: { pre: "Nine products, ", italic: "one studio", post: "" },
        lead: "Every product on this page is built and run by the same team. Voice, chat, and WhatsApp agents share an integration spine. OpSo Smart, our digital business card, is free and live in seconds. Custom Automation handles the workflows the rest can't reach. Kutasia bundles the agents into one unified AI workspace for SMBs that run on customer conversations. Pick the surface, we'll handle the rest.",
        primaryCta: "See pricing",
        secondaryCta: "Book a discovery call",
      },
      featured: {
        eyebrow: "[ FLAGSHIPS ]",
        heading: "The two products people remember us for",
        items: [
          {
            id: "voice-agent",
            name: "Voice AI Agent",
            tagline: "24/7 phone receptionist on Retell or Vapi.",
            body: "Multilingual phone answering, calendar sync, hand-off to humans when the script runs out. Live in Hamburg taxi dispatches, Bavarian hotels, and B2B service desks across DE.",
            href: "/products/voice-agent",
            startingAt: "from €299/mo + €1,500 setup",
            badge: "Live",
          },
          {
            id: "verso",
            name: "OpSo Smart",
            tagline: "Digital business card · free, live in seconds.",
            body: "Build your own card free and publish in seconds. 20+ industry templates, share by link, QR, WhatsApp or email - no app for the receiver, editable anytime. EU-hosted in Frankfurt. Replace paper cards without becoming Linktree.",
            href: "/products/digital-card",
            startingAt: "Free",
            badge: "Live",
          },
        ],
      },
      grid: {
        eyebrow: "[ AGENTS & SERVICES ]",
        heading: "Seven more, each clear about what it does",
        items: [
          { id: "chatbot-agent", name: "Chatbot Agent", tagline: "Web chat trained on your knowledge base.", startingAt: "from €149/mo", href: "/products/chatbot-agent", category: "AGENT" },
          { id: "whatsapp-agent", name: "WhatsApp Agent", tagline: "WhatsApp Business automated replies + broadcast.", startingAt: "from €199/mo", href: "/products/whatsapp-agent", category: "AGENT" },
          { id: "booking-agent", name: "Booking Agent", tagline: "Multi-channel bookings → Cal.com → reminders.", startingAt: "from €99/mo", href: "/products/booking-agent", category: "AGENT" },
          { id: "email-agent", name: "Email Agent", tagline: "Inbox triage, AI-drafted replies, escalation.", startingAt: "from €39/seat/mo", href: "/products/email-agent", category: "AGENT" },
          { id: "lead-qualifier-agent", name: "Lead Qualifier Agent", tagline: "BANT scoring on form, chat, and voice intake.", startingAt: "from €249/mo", href: "/products/lead-qualifier-agent", category: "AGENT" },
          { id: "custom-automation", name: "Custom Automation", tagline: "Sprint, project, or retainer engineering.", startingAt: "from €4,500 sprint", href: "/products/custom-automation", category: "SERVICE" },
          { id: "kutasia", name: "Kutasia", tagline: "Unified WhatsApp, Telegram, Email and Voice AI workspace for SMBs.", startingAt: "from €79/mo", href: "/products/kutasia", category: "WORKSPACE" },
        ],
      },
      bottomCta: {
        eyebrow: "[ NOT SURE WHICH ONE? ]",
        heading: "Tell us your bottleneck — we'll point to the right one, or to none",
        lead: "If a 20-minute call decides it's not us, that's also a useful 20 minutes. We've sent prospects to Cal.com, to a Zapier flow, and to 'just hire a junior' more than once.",
        cta: "Book a free 20 minutes",
      },
    },

    about: {
      meta: {
        title: "About me — Hasan Dönmez | OpSolid",
        description:
          "OpSolid is run by Hasan Dönmez — practical AI and automation consulting for mid-sized businesses in Germany. Background in IT project management, digitalisation and process optimisation.",
      },
      hero: {
        eyebrow: "[ ABOUT · 2026 ]",
        title: {
          pre: "Practical, applicable and ",
          italic: "measurable",
          post: " digital solutions",
        },
        lead:
          "OpSolid is the independent consulting practice of Hasan Dönmez. The focus is on AI, process automation and digital workflows for mid-sized businesses in Germany — built on years of hands-on IT project management, digitalisation and process work.",
        primaryCta: "Book a discovery call",
        secondaryCta: "View services",
      },
      principles: {
        eyebrow: "[ HOW I WORK ]",
        heading: "Four principles, kept short",
        items: [
          {
            n: "01",
            title: "Practical before strategic",
            body: "We start with one workflow that actually loses your team time — not with a multi-quarter strategy deck. Strategy follows once we've earned the right to plan further.",
          },
          {
            n: "02",
            title: "Measurable outcomes",
            body: "Every engagement starts with a baseline (time per task, error rate, cycle time) and ends with a number you can act on. No theatre, no buzzword reporting.",
          },
          {
            n: "03",
            title: "Privacy-conscious by default",
            body: "EU hosting, GDPR-native infrastructure, AVV signed where customer data is involved. Audit and compliance can follow along from day one.",
          },
          {
            n: "04",
            title: "Source code stays with you",
            body: "Every engagement leaves you with code, schemas and documentation you can take to another provider. No vendor lock-in by design.",
          },
        ],
      },
      founder: {
        eyebrow: "[ FOUNDER ]",
        heading: "Hasan Dönmez",
        body: [
          "I work as an IT project manager and am building OpSolid alongside that role as an independent consulting practice for AI and automation. The combination is intentional: by day I see how digitalisation projects actually run in mid-sized companies — with their constraints, politics, legacy systems and real teams — and that's exactly the perspective I bring into OpSolid engagements.",
          "Background: hands-on experience in IT project management, digitalisation and process optimisation. The focus is small, mid-sized businesses in Germany — companies that have grown faster than their internal systems and need a measurable next step rather than a platform pitch.",
          "OpSolid is intentionally one-person: when you book a call, you talk to the person who will do the work. No layers, no junior delivery, no handoff.",
        ],
        linkedinLabel: "Hasan on LinkedIn",
        linkedinHref: "https://www.linkedin.com/in/hasan-doenmez/",
      },
      contact: {
        eyebrow: "[ START A CONVERSATION ]",
        heading: "20 minutes is enough to see if we're a fit",
        lead:
          "Free discovery call: walk me through one operational pain point. I'll tell you whether OpSolid is the right fit, whether the AI & Automation Check is the right first step, or whether you should keep doing what you're doing.",
        cta: "Book a discovery call",
      },
    },

    productPages: {
      labels: {
        useCasesEyebrow: "[ USE CASES ]",
        useCasesHeading: "Where it earns its keep",
        integrationsEyebrow: "[ INTEGRATIONS ]",
        integrationsHeading: "Wired into the stack you already run",
        faqEyebrow: "[ FAQ ]",
        faqHeading: "Common questions",
      },
      pages: {
        chatbotAgent: {
          meta: { title: "Chatbot Agent — Web chat, knowledge base, lead capture | OpSolid", description: "A configured chatbot agent for your site. Knowledge base ingestion, lead capture, and human hand-off — wired into HubSpot, Pipedrive, or Slack. EU-hosted, GDPR-native." },
          hero: {
            metaChip: "CHATBOT AGENT",
            metaLabel: "[ PRODUCT · 03 ]",
            title: { pre: "Site visitors get answers, ", italic: "your team gets qualified leads", post: "" },
            lead: "A web-chat agent trained on your knowledge base. It answers product questions in business hours, captures contact details after hours, and hands the conversation to a human when the visitor asks. Configured for your site in week one — not a tool you have to learn.",
            ctaPrimary: "Book a 20-minute setup call",
            ctaSecondary: "See pricing",
            features: [
              { label: "DEPLOY", value: "Week 1", sub: "Configured for you" },
              { label: "HAND-OFF", value: "Slack · Email", sub: "Human takeover" },
              { label: "HOSTED", value: "EU · Frankfurt", sub: "GDPR-native" },
            ],
          },
          useCases: [
            { industry: "B2B SaaS", problem: "Engineers waste hours answering the same product questions in a chat widget.", outcome: "Chatbot answers 70% of product questions from the docs; leaves 30% for the team." },
            { industry: "E-commerce", problem: "Cart abandonment because shipping and returns questions go unanswered after 18:00.", outcome: "24/7 answers cut abandonment; complex orders escalate to email overnight." },
            { industry: "Professional services", problem: "Inbound leads land in a contact form and bounce when nobody replies fast.", outcome: "Chatbot qualifies, books a discovery call on Cal.com, drops the lead in HubSpot." },
          ],
          integrations: ["HubSpot", "Pipedrive", "Cal.com", "Slack", "Notion", "Zendesk", "Custom webhooks"],
          faq: [
            { q: "How long does setup take?", a: "Week one for Standard (1 site, 50 KB documents). Two to three weeks for Professional with CRM sync. We schedule a 20-minute scoping call, review your knowledge base, and ship a configured agent within five working days of kickoff." },
            { q: "What happens when the chatbot can't answer?", a: "Three options: capture an email and respond by your team within agreed SLA (Standard), live hand-off to Slack with the conversation context (Professional), or 24/7 human escalation through your own help desk (Enterprise). The visitor never hits a dead end." },
            { q: "Is this just ChatGPT in a box?", a: "No. We use modern LLMs as one component but ground every answer in your indexed knowledge base, audit each response, and let you review and edit answers in a dashboard. The model never makes up facts about your product." },
            { q: "Where is the data hosted?", a: "Hetzner / IONOS Frankfurt. EU-only. Zero US subprocessors. Conversation history is yours, exportable to CSV or API, deletable on request." },
          ],
        },
        whatsappAgent: {
          meta: { title: "WhatsApp Agent — Business API, automated replies, broadcast | OpSolid", description: "A configured WhatsApp Business agent — automated replies, broadcast campaigns, CRM sync, and human hand-off. Meta WABA passthrough, no hidden markup." },
          hero: {
            metaChip: "WHATSAPP AGENT",
            metaLabel: "[ PRODUCT · 04 ]",
            title: { pre: "WhatsApp answers ", italic: "while your team sleeps", post: "" },
            lead: "An automated agent on your WhatsApp Business number. Templates, broadcast campaigns, lead capture flows, hand-off to humans when the script runs out. Meta WABA conversation costs pass through transparently — no hidden markup buried in your bill.",
            ctaPrimary: "Book a 20-minute setup call",
            ctaSecondary: "See pricing",
            features: [
              { label: "API", value: "Meta WABA", sub: "Official, not gateway" },
              { label: "PASSTHROUGH", value: "Transparent", sub: "No hidden markup" },
              { label: "TEAM", value: "Multi-user", sub: "Roles & routing" },
            ],
          },
          useCases: [
            { industry: "Local retail", problem: "Customers ask about hours, stock, and returns on WhatsApp; staff answer the same five questions all day.", outcome: "Auto-reply handles the FAQ; staff focuses on real sales, not status updates." },
            { industry: "Hospitality", problem: "Booking inquiries arrive on WhatsApp at 23:00 and convert badly because the front desk replies at 09:00.", outcome: "Agent confirms availability, takes the booking, sends payment link — even when the front desk is closed." },
            { industry: "Cross-border services", problem: "Multilingual support on WhatsApp eats team capacity; team can't keep up with DE/EN/TR demand.", outcome: "Agent replies in the visitor's language, hands off to the right team member only when needed." },
          ],
          integrations: ["Meta WABA", "HubSpot", "Pipedrive", "Cal.com", "Stripe", "Twilio fallback", "Custom webhooks"],
          faq: [
            { q: "Do I need a Meta WABA number?", a: "Yes — you provide a number that we register with Meta on your behalf. If you already have a WABA number, we migrate it. The number stays yours; you can take it elsewhere if you ever leave." },
            { q: "How do conversation costs work?", a: "Meta charges per 24-hour conversation window (~€0.05–0.15 in EU depending on category). On Standard and Professional we add a small per-message markup; on Enterprise we pass through Meta's price with no markup." },
            { q: "Can my team take over the chat manually?", a: "Yes — every conversation has a 'human takeover' button in our dashboard, or you route to a Slack channel with full context. Once a human takes over, the agent stays silent until you mark the chat resolved." },
            { q: "Is broadcast spam-safe?", a: "We use Meta's pre-approved template messages only and respect opt-out requests automatically. Misuse will get your number banned by Meta — we configure conservative defaults that keep your number compliant." },
          ],
        },
        bookingAgent: {
          meta: { title: "Booking Agent — Web, voice, WhatsApp bookings → Cal.com | OpSolid", description: "Multi-channel booking agent. Web widget, voice intake, WhatsApp confirmations, no-show recovery — synced to Cal.com or your own calendar. EU-hosted." },
          hero: {
            metaChip: "BOOKING AGENT",
            metaLabel: "[ PRODUCT · 05 ]",
            title: { pre: "Bookings arrive by web, voice, and WhatsApp — ", italic: "the calendar stays clean", post: "" },
            lead: "A booking agent that takes intake from any channel, confirms availability against your real calendar, sends reminders, and recovers no-shows. Cal.com under the hood, our intelligence on top — works for solo practitioners, multi-staff service businesses, and multi-location operations.",
            ctaPrimary: "Book a 20-minute setup call",
            ctaSecondary: "See pricing",
            features: [
              { label: "CHANNELS", value: "Web · Voice · WA", sub: "All routed to one calendar" },
              { label: "CALENDAR", value: "Cal.com", sub: "Open-source core" },
              { label: "RECOVERY", value: "Auto", sub: "No-show flow built-in" },
            ],
          },
          useCases: [
            { industry: "Salons / barbers", problem: "Phone bookings interrupt service; clients double-book or no-show without notice.", outcome: "Voice and web take 80% of bookings; SMS reminders cut no-show rate by half." },
            { industry: "Clinics", problem: "Reception spends hours on confirmation calls and rebookings.", outcome: "Reminders + auto-rebook flow handle most of it; reception only deals with exceptions." },
            { industry: "Multi-staff agencies", problem: "Round-robin booking across team members fails when calendars get out of sync.", outcome: "Real-time Cal.com integration keeps everyone in one source of truth; bookings route by skill or workload." },
          ],
          integrations: ["Cal.com", "Google Calendar", "Outlook", "Twilio", "Stripe (deposits)", "HubSpot", "Slack notifications"],
          faq: [
            { q: "Do I have to use Cal.com?", a: "Cal.com is the default — it's open-source and we host it inside your infrastructure on Professional and Enterprise. We can also wire to native Google Calendar, Outlook, or any calendar with CalDAV." },
            { q: "Can it take deposits?", a: "Yes, on Enterprise we collect a configurable deposit at booking time via Stripe. The flow handles refunds, partial captures on no-show, and SEPA for German customers." },
            { q: "What about multi-location?", a: "Enterprise supports unlimited locations, each with its own calendar set, business hours, and routing rules. Visitors pick the location first, then the staff member." },
            { q: "How does no-show recovery work?", a: "If a booking is missed, the agent sends a follow-up message asking to rebook within 48 hours. If the customer rebooks, no charge. If they don't reply, you can configure auto-rebook offers or final reminders." },
          ],
        },
        emailAgent: {
          meta: { title: "Email Agent — Inbox triage, auto-reply, escalation | OpSolid", description: "An email automation agent for shared inboxes. AI triage, configurable auto-reply, escalation rules, CRM logging. Front-style UX without Front pricing." },
          hero: {
            metaChip: "EMAIL AGENT",
            metaLabel: "[ PRODUCT · 06 ]",
            title: { pre: "Triage and auto-reply on the inbox, ", italic: "without retraining your team", post: "" },
            lead: "An email agent that reads the shared inbox, classifies messages, drafts replies for review, escalates the urgent ones to Slack or a senior, and logs the rest to your CRM. Plays nicely with Front, Help Scout, or plain Gmail / Outlook — your team doesn't change tools.",
            ctaPrimary: "Book a 20-minute setup call",
            ctaSecondary: "See pricing",
            features: [
              { label: "INBOX", value: "Gmail · Outlook · Front", sub: "No tool change" },
              { label: "TRIAGE", value: "Categorized", sub: "Auto-tag + priority" },
              { label: "DRAFTS", value: "Reviewable", sub: "Team approves before send" },
            ],
          },
          useCases: [
            { industry: "Service desk", problem: "Inbox of 200/day means urgent tickets sit next to newsletter subscribes for hours.", outcome: "Triage tags 'urgent / standard / low'; team works the urgent queue first, agent drafts replies for the standard." },
            { industry: "Sales ops", problem: "Inbound product questions and pricing requests get lost in a generic info@ inbox.", outcome: "Sales-relevant emails route to HubSpot, drafts go to the right rep, low-priority messages get a polite acknowledgment." },
            { industry: "Hospitality", problem: "Reception team spends mornings clearing the inbox before service starts.", outcome: "Agent handles confirmations, FAQ replies, and routing overnight — reception checks exceptions only." },
          ],
          integrations: ["Gmail / Workspace", "Outlook / Microsoft 365", "Front", "Help Scout", "HubSpot", "Pipedrive", "Slack"],
          faq: [
            { q: "Will it send replies without me approving?", a: "Standard sends drafts only — your team reviews and clicks send. Professional adds optional auto-send for whitelisted reply types (e.g. opening hours, simple FAQs). Enterprise supports full auto-send with audit log and rollback. You decide where on the spectrum." },
            { q: "Can it learn our reply style?", a: "Yes — we ingest your last 90 days of sent mail to learn tone, sign-off, and common phrasing. Drafts read like the team wrote them, not like a generic AI assistant." },
            { q: "What about GDPR for email content?", a: "Email content is processed in EU only. We retain conversation history for the period your DPA specifies (default 24 months). One-click export and deletion supported." },
            { q: "Can it work alongside Front?", a: "Yes — Email Agent plugs into Front via API and operates inside your existing Front workflows. Same for Help Scout. You don't migrate; you augment." },
          ],
        },
        leadQualifierAgent: {
          meta: { title: "Lead Qualifier Agent — Form, chat, voice intake → BANT scoring | OpSolid", description: "Lead qualification agent that takes intake from any channel, scores against your ICP, and pushes qualified leads to your CRM with full context." },
          hero: {
            metaChip: "LEAD QUALIFIER AGENT",
            metaLabel: "[ PRODUCT · 07 ]",
            title: { pre: "Sales talks to ", italic: "qualified leads only", post: "" },
            lead: "A qualification agent that runs on your forms, web chat, and inbound voice. It asks the right discovery questions, scores against your ICP and BANT criteria, and only routes the qualified ones to your sales team. Unqualified visitors get a polite next step — not a wasted SDR call.",
            ctaPrimary: "Book a 20-minute setup call",
            ctaSecondary: "See pricing",
            features: [
              { label: "INTAKE", value: "Form · Chat · Voice", sub: "All scored uniformly" },
              { label: "SCORING", value: "BANT + ICP", sub: "Customizable model" },
              { label: "ROUTING", value: "By rep / region", sub: "Round-robin or rules-based" },
            ],
          },
          useCases: [
            { industry: "B2B SaaS", problem: "Demo requests flood in; SDRs burn time on tire-kickers while real prospects wait.", outcome: "Agent qualifies first; SDRs see only ICP-match leads with intent signal already gathered." },
            { industry: "Agencies", problem: "Inbound 'how much?' inquiries go unanswered because pricing depends on scope.", outcome: "Agent runs scoping questions, lands a qualified intro call only when budget and timeline make sense." },
            { industry: "Outbound-heavy teams", problem: "Apollo / Outreach replies need fast triage to keep open rates up.", outcome: "Agent reads replies, classifies intent, schedules follow-up only on positive signals." },
          ],
          integrations: ["HubSpot", "Pipedrive", "Salesforce", "Apollo.io", "Outreach.io", "Slack", "Custom CRM via webhook"],
          faq: [
            { q: "How is 'qualified' defined?", a: "We define it together with you in the kickoff: ICP fit (industry, size, role), intent signals (specific questions, urgency markers), and BANT (budget, authority, need, timeline). The definition is in writing in your contract — billing per qualified lead can only invoice leads that match." },
            { q: "Can I override the scoring?", a: "Yes. Sales team can mark any lead 'misqualified' in the dashboard; the model adapts. We retrain monthly on your team's overrides — the model gets sharper at your ICP over time." },
            { q: "What happens to unqualified leads?", a: "They get a polite next step: a content piece, a self-serve waitlist, a community link, or a 'we're not the right fit, here's who is' referral. Never ghosted, never wasted." },
            { q: "Can it run on my existing chat tool?", a: "Yes — Lead Qualifier plugs into Intercom, Drift, your custom widget, or our Chatbot Agent. The qualification flow runs as a layer on top, not as a replacement." },
          ],
        },
        customAutomation: {
          meta: { title: "Custom Automation — Sprint, project, retainer | OpSolid", description: "Workflow automation builds for mid-market German B2B. Sprint, project, or retainer engagement — your source code, your data, no vendor lock-in." },
          hero: {
            metaChip: "CUSTOM AUTOMATION",
            metaLabel: "[ SERVICE · 08 ]",
            title: { pre: "Workflows the off-the-shelf tools ", italic: "can't reach", post: "" },
            lead: "Sometimes the answer isn't a SaaS — it's an engineer building the integration that connects your ERP, your warehouse, and your CRM the way your business runs. Sprint for a single workflow, project for a digital-ops initiative, or a monthly retainer that keeps shipping. Source code stays with you.",
            ctaPrimary: "Book a 30-minute scoping call",
            ctaSecondary: "See pricing",
            features: [
              { label: "ENGAGEMENT", value: "Sprint · Project · Retainer", sub: "Match scope to need" },
              { label: "OWNERSHIP", value: "Source code yours", sub: "No lock-in" },
              { label: "STACK", value: "Open-source first", sub: "Hetzner · Postgres · Node" },
            ],
          },
          useCases: [
            { industry: "Logistics", problem: "Warehouse data exports as CSV, finance ERP eats EDI, manual translation eats one FTE per week.", outcome: "Sprint built a translator service; finance gets clean EDI inside two minutes of warehouse export." },
            { industry: "Real estate", problem: "Inbound leads scattered across Immoscout, web forms, and WhatsApp; no single source of truth.", outcome: "Project consolidated all channels into HubSpot with deduplication and contact enrichment." },
            { industry: "Multi-entity holding", problem: "Six subsidiaries, six accounting systems, monthly consolidation takes a week.", outcome: "Retainer keeps shipping integrations: now consolidation runs nightly, audit-ready by morning." },
          ],
          integrations: ["Postgres", "Node.js / TypeScript", "Python", "n8n", "Zapier (when it makes sense)", "Hetzner", "Custom APIs"],
          faq: [
            { q: "Why not just use Zapier or Make?", a: "We do — when they fit. Zapier and Make are great for simple connectors. They start to hurt at scale (cost, debugging, reliability) and they can't handle business-specific logic. We help you decide where each tool earns its keep, then build the rest." },
            { q: "How does scoping work?", a: "Free 30-minute discovery call. If we both want to proceed, we run a paid scoping workshop (~€1,500, deducted from project fee if you sign) that produces a written spec and a fixed price. You walk away with the spec either way." },
            { q: "What's the day rate?", a: "€1,200/day for senior automation engineering, billed in half-day increments. Below this, the work is junior labor or you're getting overcharged on tooling. Project pricing usually beats day rates for well-scoped work — that's the Standard sprint at €4,500." },
            { q: "Do you sign DPAs?", a: "Yes — standard German B2B AVV (Auftragsverarbeitungsvertrag) on every engagement that touches customer data. NDA before scoping if you need to share confidential context." },
          ],
        },
      },
    },

    pricing: {
      meta: {
        title: "Pricing — Standard, Professional, Enterprise | OpSolid",
        description: "Transparent EUR pricing for OpSolid's nine products: Voice Agent, OpSo Smart, Chatbot, WhatsApp, Booking, Email, Lead Qualifier, Custom Automation, and Kutasia.",
      },
      hero: {
        eyebrow: "[ PRICING · TRANSPARENT ]",
        title: {
          pre: "Tier pricing across ",
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
              setup: "€1,500",
              monthly: "€299/mo",
              included: ["500 minutes / month", "1 phone number", "1 language", "Business-hours coverage", "Cal.com integration"],
              overage: "€0.18/min",
              forWhom: "Single-location SMB, after-hours overflow",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€2,500",
              monthly: "€699/mo",
              included: ["2,000 minutes / month", "3 phone numbers", "Multilingual (DE / EN / TR)", "24/7 coverage", "CRM sync (HubSpot, Pipedrive)"],
              overage: "€0.14/min",
              forWhom: "Mid-market with steady inbound (clinics, agencies)",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€4,500",
              monthly: "€1,499/mo",
              included: ["8,000 minutes / month", "Unlimited numbers", "Custom voice + branding", "SLA 99.9%", "EU data residency contract"],
              overage: "€0.10/min",
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
              setup: "€750",
              monthly: "€149/mo",
              included: ["1 site", "500 conversations / month", "Knowledge base up to 50 docs", "Business-hours hand-off", "Email + ticket capture"],
              overage: "€0.40 / conversation",
              forWhom: "Small site, lead-capture focus",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1,500",
              monthly: "€399/mo",
              included: ["3 sites", "2,500 conversations / month", "Unlimited KB documents", "24/7 hand-off", "CRM sync"],
              overage: "€0.30 / conversation",
              forWhom: "Mid-market with active funnel",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€3,000",
              monthly: "€999/mo",
              included: ["Unlimited sites", "10,000 conversations / month", "Multi-language", "SLA + audit log", "Custom voice + tone training"],
              overage: "€0.20 / conversation",
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
              setup: "€900",
              monthly: "€199/mo",
              included: ["1 WABA number", "3 users", "1,000 conversations / month", "Templates + broadcast", "Lead capture flow"],
              overage: "Meta passthrough + €0.02 / msg",
              forWhom: "Local businesses, single-channel",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1,800",
              monthly: "€499/mo",
              included: ["1 WABA number", "10 users", "5,000 conversations / month", "Automation flows", "CRM sync"],
              overage: "Meta passthrough + €0.015 / msg",
              forWhom: "Mid-market service operations",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€3,500",
              monthly: "€1,299/mo",
              included: ["3+ WABA numbers", "Unlimited users", "20,000 conversations / month", "Multi-team routing", "SLA"],
              overage: "Meta passthrough only (no markup)",
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
              setup: "€500",
              monthly: "€99/mo",
              included: ["Web booking widget", "Cal.com sync", "Email + SMS reminders", "1 calendar", "Up to 100 bookings / month"],
              overage: "",
              forWhom: "Solo practitioner / small team",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1,200",
              monthly: "€299/mo",
              included: ["Up to 10 calendars", "Voice + WhatsApp + web intake", "No-show recovery flow", "Intake forms", "Custom reminders"],
              overage: "",
              forWhom: "Multi-staff service business",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€2,500",
              monthly: "€699/mo",
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
              setup: "€600",
              monthly: "€39/seat/mo",
              included: ["1 shared inbox", "AI triage + auto-reply", "500 emails / seat / month", "Basic CRM log", "Slack notifications"],
              overage: "€0.05 / email",
              forWhom: "Small ops team",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1,200",
              monthly: "€69/seat/mo",
              included: ["3 inboxes", "Escalation rules", "2,000 emails / seat / month", "HubSpot / Pipedrive sync", "Custom reply templates"],
              overage: "€0.04 / email",
              forWhom: "Mid-market service desk",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€2,500",
              monthly: "€99/seat/mo",
              included: ["Unlimited inboxes", "Custom routing rules", "Audit log + SLA", "EU DPA included", "Dedicated success manager"],
              overage: "€0.03 / email",
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
              setup: "€1,000",
              monthly: "€249/mo",
              included: ["250 qualified leads / month", "Form + chat intake", "BANT scoring", "CRM push (HubSpot, Pipedrive)", "Slack alerts"],
              overage: "€1.50 / lead",
              forWhom: "Outbound-light B2B",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€2,000",
              monthly: "€599/mo",
              included: ["1,000 qualified leads / month", "Voice + chat + form intake", "Custom scoring model", "Routing rules", "Weekly digest"],
              overage: "€1.00 / lead",
              forWhom: "Active SDR-supported team",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€4,000",
              monthly: "€1,499/mo",
              included: ["4,000 qualified leads / month", "Multi-channel intake", "Account-based scoring", "SLA", "Custom integrations"],
              overage: "€0.60 / lead",
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
              setup: "€4,500 fixed (sprint)",
              monthly: "—",
              included: ["1 workflow built end-to-end", "Scoping + build + 30-day support", "Up to 3 integrations", "Documentation + handover", "Source code yours"],
              overage: "",
              forWhom: "Single pain point, well-defined",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€12,000 fixed (project) — or €1,200/day",
              monthly: "—",
              included: ["3–5 workflows", "Discovery workshop", "Build + 90-day support", "Integration + custom code", "Ops dashboard"],
              overage: "",
              forWhom: "Mid-market digital ops project",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "—",
              monthly: "€4,500/mo (12-month minimum)",
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
      bundles: {
        eyebrow: "[ BUNDLES & ANNUAL ]",
        heading: "Stack the savings",
        lead: "Buy more than one product, or commit annually, and the bill drops automatically. Discounts stack with each other.",
        items: [
          { rule: "2 products", benefit: "−10% on combined recurring fees" },
          { rule: "3+ products", benefit: "−15% on combined recurring + 1 free tier upgrade for 3 months" },
          { rule: "Annual prepay", benefit: "−15% (any product, any tier)" },
          { rule: "OpSo Smart teams (50+ seats) bundled with any agent", benefit: "OpSo Smart seat price drops to €4/user/mo" },
          { rule: "Custom Automation retainer customers", benefit: "All SaaS products at −20%" },
        ],
        note: "Discounts apply to recurring fees only. Setup fees stay fixed. Annual prepay non-refundable; monthly tiers cancel with 30-day notice.",
      },
      footnote: "All prices in EUR, ex-VAT. Non-EU customers are charged ex-VAT with reverse charge applicable. EU-hosted infrastructure (Hetzner / IONOS Frankfurt) included on every tier.",
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
    contribute: {
      triggerLabel: "Send a photo",
      modalTitle: "Send a photo",
      modalSubtitle:
        "Your photo will be reviewed by the card owner before it appears.",
      nameLabel: "Your name",
      emailLabel: "Email (optional)",
      messageLabel: "Message (optional)",
      messagePh: "A short note to go with the photo.",
      photoLabel: "Photo",
      photoHint: "JPG, PNG or WebP · max 5 MB",
      submitLabel: "Send",
      submittingLabel: "Sending…",
      successTitle: "Thanks!",
      successBody: "We sent it to the owner. It will appear once approved.",
      consentText: "I confirm I have the right to share this photo.",
      consentRequired: "Please confirm the consent.",
      tooLargeError: "File too large (max 5 MB).",
      wrongTypeError: "Unsupported format. Use JPG, PNG, or WebP.",
      genericError: "Sending failed. Please try again later.",
      rateLimited: "Too many submissions. Please try again later.",
    },
    wallet: {
      notConfigured:
        "Wallet support is being configured. This card will show Apple/Google Wallet buttons once activated.",
    },
    vcard: {
      label: "Save to contacts",
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
      subtitle: "Get a free digital business card. No credit card required.",
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
      passwordCta: "or use password",
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
    verify: {
      verifying: "Verifying your link…",
      successTitle: "Signed in",
      successBody: "Redirecting you now…",
      errorTitle: "Link expired or invalid",
      errorBody: "This magic link has already been used or has expired. Please request a new one.",
      requestNewLink: "Request a new link",
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
    cards: {
      title: "My Cards",
      subtitle: "Manage and share your digital business cards.",
      createNewCta: "Create new card",
      emptyTitle: "No cards yet",
      emptyHint: "Create your first digital business card and start sharing your contact in seconds.",
      emptyCta: "Create your first card",
    },
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
    chrome: {
      logoutCta: "Sign out",
      settingsCta: "Settings",
    },
    claim: {
      bannerTitle: "We found cards under your email address.",
      bannerHint: "Connect them to your account to manage them here.",
      claimCta: "Claim this card",
      claimingState: "Connecting…",
      claimedState: "Connected",
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
