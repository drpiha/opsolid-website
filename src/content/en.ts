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
            "Digital Business Card — link, QR, optional NFC",
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
        "Real estate, clinic, restaurant, DJ, barber, e-commerce, architect, fitness — 10 tap-to-share cards tailored per sector. Click to preview live.",
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
              "You may delete your Digital Business Card profile and all associated data with one click inside your account, or by emailing info@kutasia.com. Deletion is effective within 30 days.",
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
        tagline: "Link · QR code · optional NFC",
        description:
          "A hosted-in-Germany digital business card. Share your profile as a link, QR code, or optional NFC card. Industry templates for real estate, salons, clinics, restaurants, photographers and more — all GDPR-native.",
        status: "Live",
        href: "/products/digital-card",
        externalUrl: "",
        icon: "idCard",
        startingPrice: "€39 one-time · free tier available",
        category: "Customer-facing",
        stack: "Next.js · Hetzner · Apple Wallet · HubSpot",
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
        eyebrow: "[ OPSOLID PRODUCT · 01 ]   DIGITAL BUSINESS CARD",
        title: [
          "Hand-designed",
          "digital business cards,",
          "delivered in 48 hours.",
        ],
        paragraph:
          "A hand-designed one-page digital profile we build for you. Share it as a link or QR code. 20+ industry templates as starting points. German hosting, GDPR-native — no subscription traps.",
        primaryCta: "Start my card",
        secondaryCta: "See 20 live templates",
        tags: "LINK · QR CODE · CUSTOM DESIGN · 48H DELIVERY · GERMAN HOSTING",
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
            title: "Hand-designed for you",
            desc: "We customize the template with your info, colors, and photos. Delivered in 48–72 hours. Revisions included.",
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
            title: "Hosted in Germany",
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
            name: "Starter",
            price: "€49",
            cadence: "one-time · 1st year hosting included",
            popular: "",
            bullets: [
              "1 industry template from our library",
              "Link + QR code (PNG + SVG)",
              "2 revisions included",
              "Email signature snippet",
              "1 year hosting on opsolid.de/c/your-name",
              "Hosting renewal: €9/year after year 1",
            ],
            cta: "Start my Starter",
            href: "#lead",
          },
          {
            name: "Professional",
            price: "€149",
            cadence: "one-time · €9/year hosting after year 1",
            popular: "true",
            bullets: [
              "Any template + light customization",
              "Custom slug (opsolid.de/c/your-brand)",
              "5 revisions included",
              "Analytics (views, link clicks)",
              "Email signature + social-ready images",
              "Multi-language (DE/EN/TR) optional",
            ],
            cta: "Start Professional",
            href: "#lead",
          },
          {
            name: "Custom",
            price: "From €299",
            cadence: "quoted per project",
            popular: "",
            bullets: [
              "Fully custom design (no template)",
              "Your own domain (yourname.com)",
              "Multi-language (DE/EN/TR)",
              "Advanced analytics",
              "Team roster (5+ cards priced per project)",
              "CRM integration if needed",
            ],
            cta: "Request a quote",
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
            "Thanks — we'll reply within one business day with a preview link.",
          error:
            "Something went wrong. Please email info@kutasia.com directly.",
        },
      },
      testimonials: {
        label: "SOCIAL PROOF",
        heading: "What customers say after their first card.",
        items: [
          {
            quote:
              "We had the card in two days. The designer actually understood what a real estate agent needs on a profile page — I barely had to revise anything.",
            name: "Lena Richter",
            role: "Independent broker",
            company: "Berlin, DE",
          },
          {
            quote:
              "The fact that the data stays in Germany closed the deal with our legal team. That alone was worth the price.",
            name: "Marco Weber",
            role: "COO",
            company: "Munich industrial group",
          },
          {
            quote:
              "No monthly subscription. No 'enterprise tier' upsell. I paid once, got a card, got a QR, moved on. Exactly what I wanted.",
            name: "Sarah Klein",
            role: "Independent consultant",
            company: "Berlin, DE",
          },
        ],
      },
      howItWorks: {
        label: "HOW WE DELIVER",
        heading: "Four steps. Card live in 48 hours.",
        steps: [
          {
            title: "01 · Order",
            description:
              "Fill the short form: your industry, basic info, preferred template. Pay the one-time fee.",
          },
          {
            title: "02 · Design",
            description:
              "Within 48–72 hours we send you a preview link of your customized profile.",
          },
          {
            title: "03 · Revisions",
            description:
              "Tell us what to change. 2–5 rounds depending on your tier. No rush fees.",
          },
          {
            title: "04 · Delivery",
            description:
              "You receive: the live link, QR code (PNG + SVG), email signature snippet. Fully yours.",
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
              "48–72 hours from the moment we have your info and payment. Rush delivery is possible in Professional and Custom tiers — ask us.",
          },
          {
            question: "Do you ship a physical NFC card?",
            answer:
              "Not yet. We focus on digital-only: link + QR. A customer scans your QR or opens your link and sees your profile. No hardware needed. Physical NFC cards may come later as an add-on.",
          },
          {
            question: "Can I edit my card myself later?",
            answer:
              "You send us the changes, we update within one business day. In Custom tier we can set up a simple editor for you. For Starter and Professional, edits are handled through us.",
          },
          {
            question: "Where is my data stored?",
            answer:
              "Frankfurt, Germany — Hetzner / IONOS. Zero US subprocessors. A DPA is ready on request.",
          },
          {
            question: "Can I cancel or delete my card?",
            answer:
              "Yes, anytime. One-click deletion. No auto-renewal traps. Hosting is prepaid annually after year one.",
          },
          {
            question: "I need 10+ cards for my team. How?",
            answer:
              "Custom tier. We quote per project based on how much each card should share vs. stay unified. Email info@kutasia.com.",
          },
        ],
      },
      cta: {
        eyebrow: "READY?",
        heading: "Your new card. Live in 48 hours.",
        primaryCta: "Start my card",
        secondaryCta: "Browse templates",
      },
      preview: {
        meta: {
          title: "Digital Business Card — Live Preview | OpSolid",
          description:
            "Try all 5 designs on your phone. Swipe left or right. Pick the one you like and order — €29 one-time, €5/month, or €39/year.",
        },
        eyebrow: "LIVE PREVIEW",
        title: "Try the designs on your phone",
        subtitle:
          "5 designs. Swipe left or right. Order the one you like.",
        hintSwipe: "Swipe",
        hintArrows: "Use arrow keys to move between designs",
        prev: "Previous design",
        next: "Next design",
        orderCta: "Order this design",
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
          monthlyShort: "/mo",
        },
        form: {
          eyebrow: "ORDER",
          title: "Your details, your design, your card.",
          subtitle:
            "Fill out the form — your card goes live at opsolid.de/c/… immediately after payment.",
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
            "Anything specific you want us to know — fonts, logo tweaks, layout preferences. We review every order before publishing.",
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
          previewNoPaymentNote: "Preview only — no payment required",
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
            "Send your card to others before paying. Anyone with the link can read it.",
          shareLinkUrl: "Link",
          shareLinkCopy: "Copy",
          shareLinkCopied: "Copied ✓",
          shareLinkOpen: "Open in new tab",
          shareLinkNote:
            "The link contains all form data; the card is not published until you pay.",
          // Phase 7.9 — custom sections editor
          customSectionsSection: "Custom sections (optional)",
          customSectionsHint:
            "Add up to 6 sections — awards, languages, anything you want.",
          customSectionAdd: "Add section",
          customSectionTitle: "Title",
          customSectionTitlePh: "e.g. Languages, Awards, Press",
          customSectionBody: "Content",
          customSectionBodyPh:
            "Body text — visible to anyone who opens your card.",
          customSectionRemove: "Remove",
          customSectionsCount: "{n} of 6",
          customSectionAddImage: "Add image (optional)",
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
          stepIndicator: "Step {current} of {total}",
          stepEmpty: "Add your details",
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
          "Digital Business Card — Hand-designed, German-hosted | OpSolid",
        description:
          "A hand-designed one-page digital business card with link and QR code. 20+ industry templates. 48-hour delivery. Hosted in Germany, GDPR-native.",
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
      voiceAgent: "Voice Agent",
      digitalCard: "Digital Card",
      kutasia: "Kutasia",
      journal: "Journal",
      contact: "Contact",
      cta: "Book discovery",
    },

    footer: {
      tagline:
        "Independent automation studio. Hamburg · Frankfurt. GDPR-native infrastructure; the source code stays with you.",
      chipLive: "",
      chipLanguages: "EN · DE · TR",
      cols: {
        productsHeading: "Products",
        servicesHeading: "Services",
        studioHeading: "Studio",
        legalHeading: "Legal",
        services: {
          workflow: "Workflow automation",
          integration: "Systems integration",
          internal: "Internal tools",
          ai: "AI-assisted processes",
        },
        studio: {
          journal: "Journal",
          contact: "Contact",
        },
        legal: {
          privacy: "Privacy",
          imprint: "Imprint",
        },
      },
      base: {
        copyrightSuffix: "OpSolid UG · Hamburg, DE",
        trustLine: "",
      },
    },

    home: {
      hero: {
        metaChip: "",
        metaLabel: "",
        title: {
          pre: "Automation that ",
          italic: "actually",
          post: " runs your operations — not the other way round.",
        },
        lead:
          "OpSolid builds the systems your operations already pretend to have. Workflow automation, systems integration, internal tools, and AI-assisted processes for mid-sized teams. No rebuild of your stack. No AI theater.",
        ctaPrimary: "Book a discovery call",
        ctaSecondary: "See what OpSolid builds",
        stats: [] as Array<{ value: string; label: string }>,
      },

      capabilities: {
        eyebrow: "[ 02 / 04 ] CAPABILITIES",
        headline: "Surfaces OpSolid owns end-to-end.",
        lead:
          "Not a platform, not a marketplace. A small, focused studio that takes operations as they are — manual, half-automated, stitched together — and leaves them running as systems that don't need constant attention.",
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
          post: " against.",
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
        eyebrow: "[ 04 / 04 ] PROCESS",
        headline: "Three steps. A clear, transparent process.",
        lead:
          "Every engagement follows the same shape: we map what exists, deliver the most critical step first, and extend only where it keeps paying off. Automation is recommended where it makes sense — and advised against where it doesn't.",
        steps: [
          {
            num: "01",
            title: "Operations walkthrough",
            body:
              "A 90-minute deep-dive into how work moves today. We produce a written map of every manual handoff, every fragile integration, every place the business runs on someone's calendar rather than a system.",
            chipA: "1 session · 90 min",
            chipB: "Written map · PDF",
          },
          {
            num: "02",
            title: "A focused first delivery",
            body:
              "One workflow, end-to-end, in production within three weeks. Built on tools your team can already open and inspect. If the expected result doesn't show up in the first month, the engagement stops there.",
            chipA: "3 weeks · fixed scope",
            chipB: "Production-ready",
            chipBHot: true,
          },
          {
            num: "03",
            title: "Extend as it keeps delivering",
            body:
              "Monthly or quarterly continuing support. New surfaces are added only when the existing ones are stable. Handover notes, runbooks and the full source are yours from day one — you can take it over yourself in two weeks, any time you choose.",
            chipA: "Monthly support",
            chipB: "You own the code",
          },
        ],
      },

      finalCta: {
        eyebrow: "[ LET'S TALK ]",
        title: {
          pre: "Let's see what can ",
          italic: "actually",
          post: " be automated.",
        },
        lead:
          "30 minutes. An operations walkthrough, a clear assessment, and a written plan. No obligation after the call — if automation isn't the right tool, we'll say so together.",
        ctaPrimary: "Book a discovery call",
        ctaSecondary: "Read the journal",
        trustLine:
          "BUILT IN GERMANY · GDPR-NATIVE · YOUR CODE STAYS YOURS · EN · DE · TR",
      },
    },

    voiceAgent: {
      hero: {
        metaChip: "VOICE AGENT",
        metaLabel: "[ PRODUCT · 01 ]",
        title: {
          pre: "Answer every call in ",
          italic: "thirty seconds",
          post: " or less — around the clock.",
        },
        lead:
          "A voice agent your customers can't tell isn't a junior dispatcher. Routes by intent, books into your calendar, escalates when the script runs out. Deployed on Retell or Vapi, audited end-to-end, trained on your actual playbook.",
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
        headline: "Every call, four moves.",
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
        headline: "Built on tools you can open and inspect.",
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
        metaChip: "DIGITAL CARD",
        metaLabel: "[ PRODUCT · 02 ]",
        title: {
          pre: "A business card your customers ",
          italic: "actually",
          post: " keep.",
        },
        lead:
          "Tap-to-share NFC with a QR fallback. Ships as a machined metal card or a phone-wallet pass. Updates your contact details, calendar link, and portfolio centrally — without a print run every time someone changes roles.",
        ctaPrimary: "Order a sample",
        ctaSecondary: "Browse templates",
        features: [
          {
            label: "MATERIAL",
            value: "Brass · Matte",
            sub: "or recycled PVC",
          },
          {
            label: "PROTOCOL",
            value: "NFC + QR",
            sub: "NDEF · vCard",
          },
          {
            label: "LEAD TIME",
            value: "Pre-order",
            sub: "2026 Q2 · DE · shipped",
          },
        ],
      },
      templates: {
        eyebrow: "[ INDUSTRY TEMPLATES ]",
        headline: "Starting points, not straitjackets.",
        lead:
          "Template layouts for law, medical, skilled trades, and hospitality — each with the contact fields, compliance disclosures, and calendar integrations that sector actually uses. Every layout is a fork-off-and-modify starting point, not a locked theme.",
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
        headline: "Three layers. One tap.",
        lead:
          "Hardware ships once. Everything on the other side of the tap updates in your dashboard, not at the printer.",
        steps: [
          {
            num: "01",
            title: "Tap or scan",
            body:
              "NFC triggers on any phone within 4cm. QR fallback on the back for older devices and print collateral.",
          },
          {
            num: "02",
            title: "Land on your portal",
            body:
              "A single hosted page — vCard download, calendar booking, portfolio links, and whatever else the sector needs.",
          },
          {
            num: "03",
            title: "Edit centrally",
            body:
              "New role, new number, new availability — change once, propagates to every card out in the world.",
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
          italic: "A written plan.",
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
          post: ".",
        },
        intro:
          "Field notes, engagement reports, and the occasional strong opinion. First pieces are being written — subscribe below to hear when they land.",
      },
      emptyFeature: {
        tag: "COMING · LONG-FORM",
        headline:
          "Focused automation: what actually moves a business vs. what just looks good in a deck.",
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
        metaLabel: "[ FLAGSHIP · HOSPITALITY ]",
        title: {
          pre: "The customer platform for ",
          italic: "rooms",
          post: " that remember.",
        },
        lead:
          "Built first for a restaurant in Istanbul. Designed for hotels, chef's tables, wine bars, and private clubs across DE · TR. Reservations, memberships, gifting, and guest memory — in one system the host can actually run from the floor.",
        ctaPrimary: "Request access",
        ctaSecondary: "See the modules",
      },
      rooms: {
        eyebrow: "[ MODULES ]",
        headline: "Five rooms. One house.",
        lead:
          "Every module runs standalone and hands off cleanly to the next. Start with reservations, add memberships when the waitlist gets serious, layer in guest memory when service warrants it.",
        items: [
          {
            n: "01 · RESERVATIONS",
            h: "The first room.",
            b: "Table inventory, deposits, party-size rules, waitlist. Connected directly to your voice agent and web chat for 24/7 booking.",
            rows: [
              { label: "CHANNELS", value: "WEB · PHONE · WA" },
              { label: "DEPOSIT", value: "STRIPE · SEPA" },
              { label: "CALENDAR", value: "CAL.COM" },
            ],
          },
          {
            n: "02 · MEMBERSHIPS",
            h: "Quiet invitations.",
            b: "Tiered access for regulars — early booking windows, tasting-menu priority, chef's-table nights. Renewed automatically or by hand.",
            rows: [
              { label: "TIERS", value: "3 DEFAULT" },
              { label: "BILLING", value: "MONTHLY · ANNUAL" },
              { label: "INVITES", value: "MANUAL · RULE-BASED" },
            ],
          },
          {
            n: "03 · GUEST MEMORY",
            h: "What the house remembers.",
            b: "Notes on allergies, preferences, anniversaries, last wine. Written by the floor team after service, surfaced before the next visit.",
            rows: [
              { label: "ENTRY", value: "VOICE · WEB" },
              { label: "PRIVACY", value: "GDPR · GUEST-OWNED" },
              { label: "SURFACING", value: "ON BOOKING" },
            ],
          },
          {
            n: "04 · GIFTING",
            h: "Presents that arrive.",
            b: "Gift vouchers, tasting evenings, experience bundles. Printed card, email delivery, or a wallet pass — redeemed in one tap.",
            rows: [
              { label: "FORMAT", value: "PRINT · EMAIL · WALLET" },
              { label: "EXPIRY", value: "CONFIGURABLE" },
              { label: "SETTLEMENT", value: "STRIPE" },
            ],
          },
          {
            n: "05 · SERVICE DESK",
            h: "Calm on the floor.",
            b: "The single screen your maître d' opens. Tonight's cover list, arrivals, VIP flags, last-second cancellations — everything one glance away.",
            rows: [
              { label: "DEVICE", value: "TABLET · DESKTOP" },
              { label: "ROLES", value: "HOST · MANAGER · CHEF" },
              { label: "AUDIT", value: "FULL · EXPORTABLE" },
            ],
          },
          {
            n: "06 · ANALYTICS",
            h: "Only what matters.",
            b: "Covers vs. capacity, no-show rate, first-visit to third-visit conversion, spend per cover. No vanity dashboards.",
            rows: [
              { label: "EXPORTS", value: "CSV · API" },
              { label: "PRIVACY", value: "AGGREGATED" },
              { label: "CADENCE", value: "LIVE · WEEKLY DIGEST" },
            ],
          },
        ],
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
