import type { PageDef } from "./types";
import type { PageKey } from "./keys";

const CHECK = { label: "Start with the AI Check", href: "/ai-automation-check" };
const CONTACT = { label: "Get in touch", href: "/contact" };
/** Required under every price table: net prices are only safe when the offer is visibly limited to businesses. */
const PRICE_NOTE = "All prices are net, plus VAT. Our services are for businesses only.";
/** Limited pilot phase: remove once the three free AI Checks are used. */
const PILOT_NOTE = "Pilot phase: we run the first three AI Checks at entry scope free of charge in exchange for honest feedback.";

const DEMO = {
  chip: "Demo · scripted scenario, no sound",
  play: "Play scenario",
  again: "Play again",
  note: "A scripted run, not a live call. The live voice demo will follow once the voice provider and the data-protection review (GDPR) are settled.",
  sr: "Sample conversation. Agent: Hello, you are speaking with an AI agent. How can I help you? Caller: I would like to book an appointment for next week. Agent: Certainly. Would Wednesday at 10 am or Thursday at 2 pm suit you? Caller: Thursday works. Agent: Then I will book you in for Thursday at 2 pm. You will receive a confirmation by email.",
  script: [
    { who: "Agent", agent: true, text: "Hello, you are speaking with an AI agent. How can I help you?", ms: 3400 },
    { who: "Caller", agent: false, text: "I would like to book an appointment for next week.", ms: 3000 },
    { who: "Agent", agent: true, text: "Certainly. Would Wednesday at 10 am or Thursday at 2 pm suit you?", ms: 3600 },
    { who: "Caller", agent: false, text: "Thursday works.", ms: 1400 },
    { who: "Agent", agent: true, text: "Then I will book you in for Thursday at 2 pm. You will receive a confirmation by email.", ms: 4200 },
  ],
};

/** Real screenshots of our own work (public/img/v4), shown next to the project rows. */
const SHOT = {
  opsolid: { src: "/img/v4/shot-opsolid.webp", w: 960, h: 640, alt: "The opsolid.de home page in German: the headline “Weniger Routine. Mehr Zeit für Ihre Kunden.” (Less routine. More time for your customers.) in front of a light scene of seven glass plates, one per service" },
  opso: { src: "/img/v4/shot-card.webp", w: 960, h: 640, alt: "The OpSo home page in German: the headline “Deine Visitenkarte als Mini-Website.” (Your business card as a mini website.) beside a phone showing a fictional demo profile, a QR code and NFC and link labels" },
  kutasia: { src: "/img/v4/shot-kutasia.webp", w: 960, h: 640, alt: "The Kutasia home page in Turkish: a headline about customer communication and appointments on one screen, beside a dashboard view with messages and weekly statistics" },
};

export const en: Record<PageKey, PageDef> = {
  home: {
    slug: "",
    meta: {
      title: "OpSolid | AI agents, websites and automation",
      description:
        "Less routine, more time for customers: OpSolid builds AI agents for phone and chat, websites on subscription and automation for small and mid-sized businesses.",
    },
    crumb: "Home",
    hero: {
      eyebrow: "AI agents · Websites · Automation",
      h1: ["Less routine. ", "More time", " for your customers."],
      lede: "AI agents answer calls and chats, tasks run without copy and paste, and your website brings in enquiries instead of upkeep. OpSolid builds this for small and mid-sized businesses, measures before and after, and hands over with documentation.",
      primary: { label: "Start the AI Check", href: "/ai-automation-check" },
      secondary: { label: "See our services", href: "#leistungen" },
    },
    blocks: [
      {
        t: "rows",
        id: "leistungen",
        eyebrow: "Services",
        h: "Eight ways to less manual work.",
        lede: "Each service solves a concrete problem in your day-to-day business. Pick the one that costs you the most time today.",
        items: [
          { h: "AI agents", p: "Calls and chats answered, even while your team is with a customer.", href: "/agents" },
          { h: "Websites", p: "Fast, clear, looked after. On subscription from €99 a month.", href: "/websites" },
          { h: "Process automation", p: "Type data in once. The rest runs on its own.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "More from the licences you already pay for.", href: "/microsoft-365-automatisierung" },
          { h: "Internal tools", p: "The shared spreadsheet becomes a tool with roles and history.", href: "/interne-tools" },
          { h: "AI Check", p: "In 90 minutes you know what pays off. From €490.", href: "/ai-automation-check" },
          { h: "AI training", p: "Your team works safely with AI, practised on real tasks.", href: "/ki-schulungen" },
          { h: "OpSo", tag: "Test phase", p: "The digital business card: one link, NFC and QR, always current.", href: "/opso" },
        ],
        cta: { label: "All services at a glance", href: "/leistungen" },
      },
      {
        t: "demo",
        id: "agents",
        eyebrow: "AI agents for phone and chat",
        h: "No call left unanswered.",
        lede: "An AI agent takes enquiries, arranges appointments and answers questions, based on your own documents. As soon as a person is needed, it hands over to your team. Callers are told at the start that they are speaking with an AI system.",
        ...DEMO,
        cta: { label: "More on AI agents", href: "/agents" },
      },
      {
        t: "offer",
        id: "websites",
        eyebrow: "Websites on subscription",
        h: "A website that brings in enquiries.",
        lede: "We design, build and run your website: fast, easy to read, designed for your business instead of taken from a template. Hosting, care and updates are on us.",
        label: "Website subscription",
        amount: "from €99",
        unit: "a month",
        sub: "or €990 a year · setup from €490",
        items: ["Hosting, care and updates included", "1 small change a month, done within 5 working days", "Buying the website outright on request"],
        note: PRICE_NOTE,
        shot: SHOT.opsolid,
        cta: { label: "More on websites", href: "/websites" },
      },
      {
        t: "compare",
        id: "automatisierung",
        eyebrow: "Process automation · Microsoft 365 · Internal tools",
        h: "Type data in only once.",
        lede: "What travels by hand between inbox, Excel, CRM and ERP today runs on its own afterwards. Decisions only a person can make stay with your team.",
        before: { h: "Today", items: ["An enquiry arrives by email", "Copy the data into the spreadsheet", "Type it into the CRM again", "Put the quote together by hand", "Ask for the status by group email"] },
        after: { h: "Afterwards", items: ["An enquiry arrives by email", "The data lands in the CRM, checked", "A draft quote is ready", "Your team reviews and approves", "Everyone sees the status in Teams"] },
        cta: { label: "More on process automation", href: "/prozessautomatisierung" },
      },
      {
        t: "rows",
        eyebrow: "What changes",
        h: "What changes in your business.",
        lede: "So that this stays more than a promise, we measure what a task costs today before every pilot: time per case, lead time, errors. Afterwards we measure the same again.",
        items: [
          { h: "Less routine", p: "Copy and paste, double entry and the weekly report run on their own. Your team gains time for customers." },
          { h: "Fewer errors", p: "Data is captured once and passed on cleanly. Every workflow has a log, error handling and a manual fallback." },
          { h: "Faster answers", p: "Enquiries are pre-sorted, answered or routed straight to the right person." },
          { h: "No lock-in", p: "For automations and internal tools, the source code and documentation are yours. Your IT can take over at any time." },
        ],
      },
      {
        t: "spec",
        id: "ki-check",
        eyebrow: "The way in: AI Check",
        h: "A plan before the budget moves.",
        lede: "The AI Check shows which of your tasks can be automated and which cannot: 90 minutes remote with the people who do the work, followed by a short written report.",
        rows: [
          ["Entry", "90 minutes remote, short written report"],
          ["Extended", "Workshop, process map, five rated candidates, 30-day plan"],
          ["NDA", "Before the analysis session"],
          ["Price", "From €490 net; extended scope at a fixed price, in writing up front"],
        ],
        cta: { label: "AI Check details", href: "/ai-automation-check" },
      },
      {
        t: "table",
        id: "preise",
        eyebrow: "Fixed formats, clear prices",
        h: "What getting started costs.",
        caption: "AI Check, AI training and website subscription at a glance",
        cols: ["Offer", "Format", "Price"],
        rows: [
          ["AI Check", "90 minutes remote, short written report", "from €490"],
          ["AI Literacy Basics", "Half a day, up to 15 people", "€1,490"],
          ["Copilot Practice Day", "1 day, up to 12 people", "from €2,400"],
          ["Website subscription", "Hosting, care, updates, 1 small change a month", "from €99 / month"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
        cta: { label: "Training in detail", href: "/ki-schulungen" },
      },
      {
        t: "rows",
        id: "produkte",
        eyebrow: "Our own projects",
        h: "What we build ourselves.",
        lede: "Our own applications show how we work: design, engineering and data protection in the same project.",
        items: [
          { h: "opsolid.de", tag: "This site", p: "Designed, built and run by OpSolid. The text comes first; the background video can be paused and switched off.", shot: SHOT.opsolid },
          { h: "OpSo", tag: "Product in test phase", p: "Digital business card with NFC and QR: one link, always current, no app needed by the recipient.", href: "/opso", shot: SHOT.opso },
          { h: "Kutasia", tag: "Project in development", p: "Customer messages from WhatsApp, Telegram and email in one inbox, pre-sorted by AI.", href: "https://kutasia.com", shot: SHOT.kutasia },
        ],
      },
    ],
    faq: {
      h: "Frequently asked questions",
      items: [
        { q: "Does an AI agent replace our team?", a: "No. It takes over routine and hands over as soon as a person is needed." },
        { q: "Can we keep our existing systems?", a: "Yes. Where Microsoft 365, Google Workspace, your CRM or ERP carry the workflow, we build on them." },
        { q: "How much time does our team need to set aside?", a: "For the AI Check: a short preliminary call and a 90-minute analysis with the people who do the work. The extended scope adds a workshop and a 30-minute review of the plan." },
        { q: "Do you sign a confidentiality agreement first?", a: "Yes. A standard NDA is signed before the analysis session." },
        { q: "Who is our point of contact?", a: "You have one fixed contact at OpSolid, from analysis to operation. The AI Literacy Basics training is led by a freelance specialist whom we select and name to you in advance." },
      ],
    },
    cta: {
      h: "Which task costs you the most time today?",
      p: "Describe it in three sentences. We will tell you whether automation pays off and what the next step is. We usually reply within a few working days.",
      primary: { label: "Describe your task", href: "/contact" },
      secondary: CHECK,
    },
    service: undefined,
  },

  agents: {
    slug: "agents",
    meta: {
      title: "AI agents for phone and website",
      description:
        "OpSolid's AI agents work as phone and chat assistants: they take inquiries, arrange appointments and hand over to your team. With a data-protection review.",
    },
    crumb: "AI agents",
    hero: {
      eyebrow: "AI agents · phone and website",
      h1: ["The phone rings. ", "Your AI agent", " answers."],
      lede: "An AI agent takes inquiries, arranges appointments and answers questions about your business, based on your own documents. Anything that needs judgement goes to your team. Fewer calls are left waiting, and your team is interrupted less often.",
      primary: CHECK,
      secondary: { label: "See the scenario", href: "#demo" },
      spec: [
        ["Formats", "Phone and chat assistant"],
        ["Tasks", "Inquiries, appointments, information, handover"],
        ["Status", "Scripted demo, live demo to follow"],
      ],
    },
    blocks: [
      {
        t: "demo",
        id: "demo",
        h: "How a call plays out.",
        lede: "A booking request from the first sentence to the confirmation: the agent says at the start that an AI system is speaking, offers slots, books the appointment and confirms by email. As soon as a person is needed, it hands over to your team.",
        ...DEMO,
      },
      {
        t: "rows",
        eyebrow: "Tasks",
        h: "What an agent takes on, and what it does not.",
        lede: "An agent takes on routine work that repeats and follows clear rules. Anything that needs judgement goes to your team.",
        items: [
          { h: "Take inquiries", p: "Record requests by phone or on your website and pass them to your team in a structured form." },
          { h: "Arrange appointments", p: "Offer free slots, enter the appointment and send a confirmation." },
          { h: "Give information", p: "Explain services, procedures and opening times, based on your own documents." },
          { h: "Hand over to people", p: "Complaints, special cases and anything uncertain go to a person." },
        ],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "Four steps to your own agent.",
        items: [
          { h: "Clarify", p: "Define tasks, limits and tone: what may the agent decide, and what not?" },
          { h: "Build", p: "Design the dialogue and the voice, and connect them to your calendar, CRM or inbox." },
          { h: "Review data protection", p: "Settle provider, storage location, retention and the notice that an AI system is speaking, before going live." },
          { h: "Test and run", p: "Evaluate conversations, refine the agent and support it in daily use." },
        ],
      },
    ],
    faq: {
      h: "Questions about AI agents",
      items: [
        { q: "What does an AI agent cost?", a: "That depends on the tasks, the integrations and the call volume. We give you the price in writing before anything is built. Prices are net, plus VAT." },
        { q: "Does the agent already speak live?", a: "At the moment we show a scripted scenario. The live voice demo will follow once the voice provider and the data-protection review are settled." },
        { q: "Who listens to the calls?", a: "We agree that with you in advance: provider, storage location, retention and access. Callers are told at the start that they are speaking to an AI system." },
        { q: "Will an agent replace our team?", a: "No. It takes routine work off your team and hands over as soon as a person is needed." },
        { q: "Is the video on this website an agent?", a: "No. The background video with the glass plates is decoration; you can pause it or switch it off under “Background video” at the bottom of the page. Our AI agents work as phone and chat assistants, with no figure and no face." },
        { q: "How do we start?", a: "With the AI Check. Together we work out whether an agent makes sense for your business and which tasks it should take on." },
      ],
    },
    cta: { h: "Find out whether an agent suits you.", p: "In the AI Check we settle tasks, limits and data protection before anything is built.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI phone and chat assistants" },
  },

  websites: {
    slug: "websites",
    meta: {
      title: "Website design and build: buy or subscribe",
      description:
        "OpSolid designs, builds and runs websites that look like your business: fast and multilingual. To buy, or as a website subscription from €99 a month, net.",
    },
    crumb: "Websites",
    hero: {
      eyebrow: "Websites · buy or subscribe",
      h1: ["Websites that look like ", "you", "."],
      lede: "OpSolid designs and builds websites that load fast, read well and work in several languages. Buy: a one-off project price, and the site is yours. Website subscription: from €99 a month, and we take care of hosting, maintenance and updates.",
      primary: CONTACT,
      secondary: { label: "See work samples", href: "#referenzen" },
      spec: [
        ["Models", "Buy or website subscription"],
        ["Subscription", "From €99/month or €990/year, setup from €490"],
        ["Buy", "Price in writing after the first call"],
        ["Prices", "Net, plus VAT; for businesses only"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Service",
        h: "What goes into every website.",
        items: [
          { h: "Design", p: "Typography, colour and motion that suit your business, instead of a template with a new logo." },
          { h: "Build", p: "Text first, fast to load, accessible, and structured cleanly for search engines and AI search." },
          { h: "Multilingual", p: "Each language with its own address and clean markup for search, in the languages your customers speak." },
          { h: "Buy or subscribe", p: "Buying makes sense if you want to take the site forward yourself. The website subscription, if you would rather not deal with anything technical." },
        ],
      },
      {
        t: "table",
        id: "preise",
        eyebrow: "Prices",
        h: "What a website costs.",
        lede: "The website subscription prices are in the table. For a purchase, we give you the project price in writing after our first call.",
        caption: "Website subscription and purchase at a glance",
        cols: ["Model", "Scope", "Price"],
        rows: [
          ["Website subscription||Includes hosting, maintenance, updates and 1 small change per month (done within 5 working days, no emergency service).", "Setup from €490; then monthly or €990 a year", "from €99/month"],
          ["Buy||A one-off project price. The finished website is yours, and you take it forward yourself or with your IT.", "Project price by scope, in writing after the first call", "On request"],
        ],
        note: PRICE_NOTE,
      },
      {
        t: "rows",
        id: "referenzen",
        eyebrow: "Work samples",
        h: "Designed and built in-house.",
        lede: "OpSolid conceived and developed these projects itself, from design to engineering. The links take you to each project, so you can judge for yourself.",
        items: [
          { h: "opsolid.de", tag: "This site", p: "Text first; the background video starts after the text and can be paused and switched off.", shot: SHOT.opsolid },
          { h: "OpSo", tag: "Product in testing", p: "A digital business card as a web app: profile, QR code and NFC link. The launch is being prepared.", href: "/opso", shot: SHOT.opso },
          { h: "Kutasia", tag: "Project in development", p: "One inbox for WhatsApp, Telegram and email, with AI triage.", href: "https://kutasia.com", shot: SHOT.kutasia },
        ],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "From the first call to the finished site.",
        items: [
          { h: "First call", p: "Clarify goal, audience, content and languages. We then set out scope and price in writing." },
          { h: "Draft", p: "Structure and design of the key pages, refined with your feedback." },
          { h: "Build", p: "Implementation with texts, images and forms, tested on phone and desktop." },
          { h: "Launch and operation", p: "Publishing, domain and data-protection components; with the website subscription we then take care of hosting, maintenance and updates." },
        ],
      },
    ],
    faq: {
      h: "Questions about websites",
      items: [
        { q: "Buy or subscribe: which suits you better?", a: "Buy if you want to run the site yourself or with your IT: you pay once, and the site is yours; we give you the price in writing after our first call. Choose the website subscription if you would rather not deal with the technology: from €99 a month or €990 a year, setup from €490, all prices net, plus VAT. It includes hosting, maintenance, updates and one small change per month, done within 5 working days; there is no emergency service." },
        { q: "How long does a website project take?", a: "That depends on the scope. After the first call you receive a concrete schedule." },
        { q: "Who owns the texts and images?", a: "Content you supply remains yours. The usage rights for design and code are agreed in writing beforehand." },
        { q: "Can the site include video and motion?", a: "Yes, as an extra. The text always comes first; video and effects can be paused and switched off and respect the reduced-motion setting." },
      ],
    },
    cta: { h: "What should your website achieve?", p: "Tell us in two or three sentences who the site is for and what it should achieve. We usually reply within a few working days.", primary: { label: "Ask about a website", href: "/contact" } },
    service: {
      type: "Website design, development and subscription",
      offers: [
        { name: "Website subscription, monthly", price: 99, from: true, unit: "month" },
        { name: "Website subscription, yearly", price: 990, unit: "year" },
        { name: "Website subscription, setup", price: 490, from: true },
      ],
    },
  },

  leistungen: {
    slug: "leistungen",
    meta: {
      title: "Services: AI agents, websites, automation",
      description:
        "AI agents, websites, process automation, Microsoft 365, internal tools, AI consulting and AI training: which OpSolid service solves which problem.",
    },
    crumb: "Services",
    hero: {
      eyebrow: "Services",
      h1: ["Seven ways to ", "cut manual work", "."],
      lede: "Each service solves a specific problem: calls that go unanswered, a website that no longer fits, data moved between systems by hand. The AI Check shows where it pays to start.",
      primary: CHECK,
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "All services",
        h: "Which service solves which problem.",
        items: [
          { h: "AI agents", tag: "Phone · website", p: "When calls and inquiries pile up: the agent takes them, arranges appointments and hands over to your team.", href: "/agents" },
          { h: "Websites", tag: "Buy · subscribe", p: "When your website no longer fits your business: designed, built and, if you wish, run by us.", href: "/websites" },
          { h: "Process automation", p: "When the same data is typed in twice: quotes, reports and data syncs run automatically.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "When you pay for licences but barely use them: automate approvals, documents and mailbox rules.", href: "/microsoft-365-automatisierung" },
          { h: "Internal tools", p: "When a spreadsheet becomes the bottleneck: a tool with permissions, a history and exactly the fields you need.", href: "/interne-tools" },
          { h: "AI consulting", p: "When it is unclear where AI pays off: three to five use cases, assessed in writing, with a roadmap.", href: "/ki-beratung" },
          { h: "AI training", tag: "Team", p: "When your team uses AI without shared rules: three formats with a fixed scope and a clear price.", href: "/ki-schulungen" },
        ],
      },
      {
        t: "steps",
        eyebrow: "Approach",
        h: "One path, wherever you start.",
        items: [
          { h: "Analysis", p: "In the AI Check we look at your workflows and work out where automation pays off." },
          { h: "Pilot", p: "One workflow with real leverage, with a fixed scope and a fixed time frame." },
          { h: "Rollout", p: "What works in the pilot is used more widely and documented." },
          { h: "Handover", p: "Your team runs the solution itself; if you wish, we stay involved with a small retainer for adjustments." },
        ],
      },
    ],
    cta: { h: "Not sure where to start?", p: "In the AI Check we sort your workflows and choose the building block that pays off first.", primary: CHECK, secondary: CONTACT },
  },

  kiBeratung: {
    slug: "ki-beratung",
    meta: {
      title: "AI consulting for SMEs: use cases, risk, roadmap",
      description:
        "AI consulting from OpSolid for small and mid-sized businesses: three to five use cases, rated by benefit, effort and risk, with a roadmap and an AI policy.",
    },
    crumb: "AI consulting",
    hero: {
      eyebrow: "AI consulting",
      h1: ["Which AI is ", "worth it for you", "?"],
      lede: "We find three to five AI use cases that fit your business, rate benefit, effort and risk, and set out the result in a written roadmap. What does not fit, we explicitly rule out.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Result", "Use-case rating, roadmap, AI policy"],
        ["Duration", "Target of two to four weeks"],
        ["Stance", "Independent, no AI tool sales"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Service",
        h: "Three to five use cases, assessed in writing.",
        items: [
          { h: "Find use cases", p: "Identify three to five applications that fit your business, and clearly rule out those that do not." },
          { h: "Rate them", p: "Place each use case by expected benefit, effort and operating risk." },
          { h: "Set the roadmap", p: "A roadmap for 6 to 12 months with owners, costs and decision points." },
          { h: "Set up data protection", p: "Prepare data-protection-compliant use: model choice, data sovereignty and a short AI policy for your business." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Typical use cases",
        h: "Where AI reads, sorts and drafts text.",
        lede: "AI pays off where a lot of text is read, sorted or drafted, and a person checks the result.",
        items: [
          { h: "Document and contract analysis", p: "Pre-sort long PDFs and surface clauses and deadlines. A person checks the summary." },
          { h: "Internal knowledge search", p: "Make policies, FAQs and SharePoint searchable, with answers drawn from your own documents." },
          { h: "Quote drafting", p: "Draft quotes from a template, a CRM record and a short brief. Sales reviews and signs them off." },
          { h: "Support triage", p: "Sort incoming requests by topic and urgency before a person handles them. Kutasia, our own project in development, uses this kind of AI triage too." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Models and building blocks",
        h: "Your data decides the model.",
        lede: "Where data must not leave the EU, EU hosting or open-source models are the options. Where Microsoft 365 is already in place, Copilot is the obvious candidate.",
        items: ["OpenAI", "Anthropic Claude", "Microsoft Copilot, Azure OpenAI", "Mistral and open-source models", "Retrieval-augmented generation", "pgvector, Qdrant", "EU hosting"],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "From first call to roadmap in three steps.",
        items: [
          { h: "Discovery", p: "A short call about your team, data and goals." },
          { h: "Use-case rating", p: "Workshop and written analysis: which applications pay off, and which do not?" },
          { h: "Roadmap and policy", p: "A decision-ready roadmap plus a short written AI policy for your business." },
        ],
      },
    ],
    faq: {
      h: "Questions about AI consulting",
      items: [
        { q: "What does it cost?", a: "That depends on the scope. We set out scope and price in writing in our proposal before any work starts. Prices are net, plus VAT." },
        { q: "How does AI consulting differ from the AI Check?", a: "The AI Check looks through your workflows for automation candidates, with and without AI. AI consulting goes further: it rates specific AI applications, sets out a roadmap for 6 to 12 months and delivers an AI policy for your business." },
        { q: "Do you sell AI tools?", a: "No. OpSolid is independent and recommends what fits. That can also mean: use what you have, or wait for now." },
        { q: "Can AI be used in line with data protection law?", a: "Its use can be designed to meet data protection requirements: the right choice of model, EU hosting, a data processing agreement and a written policy. We help prepare this; the final assessment lies with your data protection officer or legal adviser." },
        { q: "How long does consulting take?", a: "We plan two to four weeks for analysis and roadmap; the exact time frame is set out in our proposal. Implementation is a separate project." },
      ],
    },
    cta: { h: "Find out which AI is worth it.", p: "One conversation, a written roadmap, no platform sales pitch.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI consulting" },
  },

  prozess: {
    slug: "prozessautomatisierung",
    meta: {
      title: "Process automation for SMEs",
      description:
        "OpSolid automates quotes, documents, email routing, reports and data syncs with the tools you already have. Measured first, then built.",
    },
    crumb: "Process automation",
    hero: {
      eyebrow: "Process automation",
      h1: ["Enter your data ", "just once", "."],
      lede: "We automate the workflows that cost you time today: quotes that take half a day, reports rebuilt every Monday, data shuttled between Excel, CRM and email. First we map the workflow and measure what it costs. Then we automate what is worth it.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Start", "One high-leverage workflow, fixed scope"],
        ["Pilot", "Target of two to four weeks"],
        ["Basis", "Your existing tools"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Approach",
        h: "From today's workflow to a running pilot.",
        items: [
          { h: "Map the workflow", p: "Write down handovers, tools, data and exceptions so that your team can check the workflow." },
          { h: "Measure and choose", p: "Measure the baseline and clarify which steps can be automated and which should deliberately stay manual." },
          { h: "Build", p: "Automation with Power Automate, Make, n8n, Python or custom code, whichever fits your workflow." },
          { h: "Hand over", p: "Monitoring, documentation and handover, so that your team runs the workflow itself afterwards." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Typical workflows",
        h: "Where automation pays off first.",
        lede: "Wherever the same data is typed in twice: between email, Excel, CRM and ERP.",
        items: [
          { h: "Quotes and documents", p: "Fill templates from CRM data, approve them within the workflow and send them." },
          { h: "Email sorting", p: "Tag incoming emails by topic and route them to the right inbox or ticket. Kutasia, our own project in development, pre-sorts messages from WhatsApp, Telegram and email on the same principle." },
          { h: "Reports and Excel", p: "Build recurring reports once and regenerate them automatically." },
          { h: "CRM and ERP sync", p: "Capture data once and reconcile it between systems, without double entry." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Tools",
        h: "Tools chosen to fit your workflow.",
        lede: "Where Microsoft 365 is in place, Power Automate is the natural choice. Make or n8n suit connections across system boundaries, and Python handles the special cases.",
        items: ["Microsoft Power Automate", "Make", "n8n, self-hosted", "Zapier, where it fits", "Python", "REST APIs and webhooks", "PostgreSQL and queues"],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "Three steps, one fixed scope.",
        items: [
          { h: "Map", p: "A workshop with the team that does the work. We record the workflow as it really runs and measure the baseline." },
          { h: "Build", p: "The first pilot automation, with a target of two to four weeks, fixed in our proposal." },
          { h: "Hand over", p: "Documentation, handover to your team and a short period of fine-tuning." },
        ],
      },
    ],
    faq: {
      h: "Questions about process automation",
      items: [
        { q: "What does it cost?", a: "That depends on the scope. We set out scope and price in writing in our proposal before any work starts. Prices are net, plus VAT." },
        { q: "What is a typical first project?", a: "A single workflow with real leverage, such as preparing quotes, sorting email or a weekly report. Fixed scope, with a target of two to four weeks." },
        { q: "Do we need AI for this?", a: "No. Often the first sensible step is clean automation with no AI at all." },
        { q: "What if the workflow changes later?", a: "We document everything so that your IT can make adjustments itself. For larger changes, a small monthly retainer is available on request." },
        { q: "Is it safe to automate critical workflows?", a: "Yes, with logging, error handling and a manual fallback. We plan for failure, not just for the ideal case." },
      ],
    },
    cta: { h: "Choose the first workflow worth automating.", p: "We map it, assess it and tell you whether it is worth the effort.", primary: CHECK, secondary: CONTACT },
    service: { type: "Business process automation" },
  },

  m365: {
    slug: "microsoft-365-automatisierung",
    meta: {
      title: "Microsoft 365 automation: Power Automate, SharePoint",
      description:
        "OpSolid automates Microsoft 365 with the licences you already have: Power Automate, SharePoint, approvals in Teams, Outlook routing. Properly documented.",
    },
    crumb: "Microsoft 365",
    hero: {
      eyebrow: "Microsoft 365",
      h1: ["You have the licences. ", "Now put them to work", "."],
      lede: "We set up Teams, SharePoint, Outlook and Power Automate so that approvals, documents and mailbox rules run without manual work and your data sits in one place. Much of this is already included in your licences, and some add-on subscriptions become unnecessary.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Start", "Review of your tenant"],
        ["Pilot", "First flow, target of two weeks"],
        ["Basis", "Standard licences where they suffice"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Service",
        h: "What is already in your tenant.",
        items: [
          { h: "Review the tenant", p: "Look at licences, settings and tools, and find automations your team does not use yet." },
          { h: "Build flows", p: "Power Automate for approvals, documents, email routing and notifications." },
          { h: "Connect", p: "Link SharePoint, Teams, Outlook and Excel so that data sits in one place." },
          { h: "Configure Copilot", p: "Microsoft 365 Copilot with role-based access and clear rules." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Typical workflows",
        h: "Where Microsoft 365 takes work off your team.",
        lede: "What you have is often enough: approvals, documents and mailbox rules can be automated with the standard connectors for Outlook, Teams and SharePoint.",
        items: [
          { h: "Approvals in Teams", p: "Leave, expenses, documents: approve in Teams, log in SharePoint." },
          { h: "Documents from SharePoint lists", p: "Generate quotes, contracts and reports from a list, without copy-paste from Excel." },
          { h: "Outlook parsing and routing", p: "Read orders, requests or invoices automatically and pass them to the right system." },
          { h: "Copilot rollout", p: "Rules, roles and a short training session so that Copilot is used safely." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Tools",
        h: "From the Microsoft toolkit.",
        items: ["Power Automate", "Power Apps", "SharePoint Online", "Teams, bots, approvals", "Outlook, Exchange", "Microsoft Graph API", "Microsoft 365 Copilot", "Entra ID"],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "From tenant review to rollout.",
        items: [
          { h: "Tenant review", p: "Look at licences, security settings and tools, and find what goes unused." },
          { h: "First flow", p: "A Power Automate flow or Teams workflow as a pilot, with a target of two weeks." },
          { h: "Rollout", p: "Wider use with documentation, handover and optional training for your IT." },
        ],
      },
    ],
    faq: {
      h: "Questions about Microsoft 365",
      items: [
        { q: "What does it cost?", a: "That depends on the scope. We set out scope and price in writing in our proposal before any work starts. Prices are net, plus VAT." },
        { q: "Do we need Power Automate Premium licences?", a: "Sometimes. Many useful flows run on the standard plans. We tell you in advance when Premium is needed." },
        { q: "Is Microsoft 365 Copilot worth it?", a: "For some teams yes, for others no. We clarify that before you buy licences." },
        { q: "Can you work with our IT?", a: "Yes. We work alongside your IT or your Microsoft partner; OpSolid adds to what they do rather than replacing them." },
        { q: "Does this comply with data protection law?", a: "It can be set up in a data-protection-compliant way: EU Data Boundary, data processing agreement, roles and permissions, documented data flows. The final assessment lies with your data protection officer or legal adviser; we provide the documentation for it." },
      ],
    },
    cta: { h: "Get more out of Microsoft 365.", p: "We show you what is worth automating in your tenant before you sign up for another subscription.", primary: CHECK, secondary: CONTACT },
    service: { type: "Microsoft 365 automation" },
  },

  interneTools: {
    slug: "interne-tools",
    meta: {
      title: "Internal tools: admin panels, dashboards, approvals",
      description:
        "OpSolid builds small, focused internal tools: admin consoles, dashboards, approval queues and knowledge bases. Hosted in the EU, with source code.",
    },
    crumb: "Internal tools",
    hero: {
      eyebrow: "Internal tools",
      h1: ["Your spreadsheet becomes a ", "real tool", "."],
      lede: "Where off-the-shelf software does not fit, a small, purpose-built tool often solves the problem better and faster. Not every internal workflow needs yet another platform with a monthly per-user subscription. Built in-house: for OpSo, OpSolid developed the dashboard, onboarding and admin console.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Pilot", "Target of three to six weeks"],
        ["Handover", "Source code and documentation"],
        ["Hosting", "EU, or on your own servers if you prefer"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "What we build",
        h: "Small, fast, built for exactly one workflow.",
        items: [
          { h: "Admin consoles", p: "Clear and focused for your operations team, without clutter." },
          { h: "Dashboards", p: "Metrics, exceptions and alerts from your data sources in one view." },
          { h: "Approval queues and forms", p: "Approvals and escalations that match how your workflow actually runs." },
          { h: "Knowledge bases", p: "Search across your own documents, policies and FAQs." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Typical tools",
        h: "When the spreadsheet is no longer enough.",
        lede: "A tool of your own pays off when several people maintain one spreadsheet and nobody is quite sure which version is right.",
        items: [
          { h: "Operations console", p: "Order overview, exceptions and customer notes in one place instead of three tabs." },
          { h: "KPI dashboard", p: "Daily, weekly and monthly figures from CRM, ERP and finance system, without manual work." },
          { h: "Approval queue", p: "Queue, route and approve quotes, contracts or refunds, with a full history." },
          { h: "AI knowledge base", p: "Search your own documents. Answers stay within your organisation." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Technology",
        h: "Mainstream technology your IT can take over.",
        items: ["Next.js, React, TypeScript", "Node.js, Python", "PostgreSQL", "REST, GraphQL, webhooks", "Microsoft Entra ID, SSO", "EU hosting", "GitHub, CI/CD, audit logs"],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "From specification to day-to-day use.",
        items: [
          { h: "Specification", p: "A short workshop: what must the tool do, and what not?" },
          { h: "Build", p: "A pilot version with real users and real data, with a target of three to six weeks." },
          { h: "Hand over", p: "Handover with documentation and source code, optionally with a small retainer for ongoing changes." },
        ],
      },
    ],
    faq: {
      h: "Questions about internal tools",
      items: [
        { q: "What does it cost?", a: "That depends on the scope. We set out scope and price in writing in our proposal before any work starts. Prices are net, plus VAT." },
        { q: "Why not off-the-shelf software?", a: "Off-the-shelf software is often the right choice. We only build when it does not fit or would be too expensive for the purpose, and we tell you so beforehand." },
        { q: "Who owns the code?", a: "We put that in writing before the start. The plan is that you receive the source code and documentation." },
        { q: "Where does the tool run?", a: "In the EU, with a provider of your choice or on your own infrastructure." },
      ],
    },
    cta: { h: "Retire the spreadsheet.", p: "Describe the workflow briefly. We will tell you whether a tool of your own pays off or off-the-shelf software will do.", primary: CHECK, secondary: CONTACT },
    service: { type: "Custom internal tools" },
  },

  schulungen: {
    slug: "ki-schulungen",
    meta: {
      title: "AI training: three formats with clear prices",
      description:
        "AI Check from €490, AI Literacy Basics €1,490, Copilot Practice Day from €2,400, all plus VAT. Practised on your own tasks.",
    },
    crumb: "AI training",
    hero: {
      eyebrow: "AI training · Art. 4 EU AI Act",
      h1: ["Three formats, ", "clear prices", "."],
      lede: "Since 2 February 2025, Article 4 of the EU AI Act has required businesses that use AI to take measures to ensure sufficient AI literacy among their staff. Our three formats have a fixed scope and a clear price, and participants work on their own tasks rather than on slides.",
      primary: { label: "Request training", href: "/contact" },
      secondary: CHECK,
    },
    blocks: [
      {
        t: "table",
        id: "angebote",
        eyebrow: "Formats and prices",
        h: "Which format suits your team.",
        caption: "AI Check and AI training at a glance",
        cols: ["Offer", "Format", "Price"],
        rows: [
          ["AI Check||The compact way in: together we look at where AI makes sense in your daily work and where it does not. Delivered by OpSolid, with the result as a short written report. An extended scope with a process map and a 30-day plan is available at a fixed price, quoted in writing beforehand.", "90 minutes remote, with report", "from €490"],
          ["AI Literacy Basics||The fundamentals of using AI safely at work. Led by a freelance specialist whom OpSolid selects and names to you in advance. Supports your AI literacy measures under Art. 4 of the EU AI Act.", "Half day, up to 15 people", "€1,490"],
          ["Copilot Practice Day||Hands-on work with Microsoft 365 Copilot on your own tasks. For businesses that already hold Copilot licences.", "1 day, up to 12 people", "from €2,400"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "Hands-on, with your own tasks.",
        items: [
          { h: "Inquiry", p: "You describe your team, tasks and prior knowledge. We recommend the right format and name the price." },
          { h: "Planning", p: "Date, on site or remote, number of participants, and content with examples from your daily work." },
          { h: "Delivery", p: "Participants work on their own tasks instead of just listening." },
        ],
      },
    ],
    faq: {
      h: "Questions about training",
      items: [
        { q: "Do we get a certificate?", a: "The training is not a certificate course. It supports your AI literacy measures under Art. 4 of the EU AI Act." },
        { q: "Who delivers the training?", a: "OpSolid runs the AI Check itself. AI Literacy Basics is led by a freelance specialist whom OpSolid selects and names to you in advance." },
        { q: "Why is the AI Check listed under training?", a: "Because it works well as a first step before training: in 90 minutes we clarify where AI makes sense in your daily work. If you wish, we extend it to a mapping of your workflows with a process map and a 30-day plan; we quote the fixed price for that in writing beforehand." },
        { q: "Are online sessions available?", a: "The entry scope of the AI Check runs remotely. For the other formats, we agree with you whether they take place on site or remotely." },
      ],
    },
    cta: { h: "Find the right format.", p: "Write to us briefly about your team and goal. We recommend a format and name the price.", primary: { label: "Request training", href: "/contact" }, secondary: CHECK },
    service: {
      type: "AI training",
      offers: [
        { name: "AI Check", price: 490, from: true },
        { name: "AI Literacy Basics", price: 1490 },
        { name: "Copilot Practice Day", price: 2400, from: true },
      ],
    },
  },

  check: {
    slug: "ai-automation-check",
    meta: {
      title: "AI Check: where automation really pays off",
      description:
        "The OpSolid AI Check from €490 net: 90 minutes remote, then a short written report. Extended with a process map and a 30-day plan. NDA in advance.",
    },
    crumb: "AI Check",
    hero: {
      eyebrow: "AI Check · the first step",
      h1: ["Where automation ", "really", " pays off."],
      lede: "The AI Check shows which of your workflows can be automated and which are better left manual. The entry scope from €490 net: 90 minutes remote and a short written report. For an extended scope with a workshop, a process map and a 30-day plan, we quote a fixed price in writing beforehand.",
      primary: { label: "Request an AI Check", href: "/contact" },
      secondary: { label: "See how it works", href: "#ablauf" },
      spec: [
        ["Entry", "90 minutes remote, short written report"],
        ["Extended", "Workshop, process map, five rated candidates, 30-day plan"],
        ["NDA", "Before the analysis call"],
        ["Price", "From €490 net; extended scope at a fixed price, quoted in writing"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Why the check exists",
        h: "Why automation often fails.",
        lede: "Rarely because of the technology. More often the wrong workflow gets automated, or nobody has written down what the team actually does.",
        items: [
          { h: "Symptoms instead of causes", p: "What stands out gets automated, not what causes the problem." },
          { h: "Tools without a use case", p: "AI tools are bought before it is clear what they are for." },
          { h: "No baseline", p: "Without a measured starting point, the benefit cannot be proven." },
          { h: "Unclear limits", p: "Nobody has decided which steps should deliberately stay manual." },
        ],
      },
      {
        t: "table",
        id: "umfang",
        eyebrow: "Scope and price",
        h: "Start compact, extend if needed.",
        lede: "The entry scope costs from €490. If you need more, we extend the scope and quote the fixed price for it in writing beforehand.",
        caption: "AI Check: entry and extended scope",
        cols: ["Scope", "Format", "Price"],
        rows: [
          ["Entry||Delivered by OpSolid, with the people who do the work. The result is a short written report: where AI and automation make sense in your daily work, and where they do not.", "90 minutes remote, with report", "from €490"],
          ["Extended||Mapping of the key workflows, a process map, five candidates rated by effort, benefit and risk, a 30-day plan and a 30-minute walkthrough.", "Workshop on site or remote", "Fixed price, quoted in writing"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
      },
      {
        t: "rows",
        eyebrow: "Who it is for",
        h: "Who the check is for.",
        items: [
          { h: "Small and mid-sized businesses", p: "You want a measurable first step instead of a large platform project." },
          { h: "AI in use, but without rules", p: "Your team already uses AI, but without shared rules or structure." },
          { h: "Operations leads", p: "Too many manual handovers cost time and cause errors." },
          { h: "Before a purchase decision", p: "You are weighing up tools such as Microsoft 365, Power Automate or Make and want to know what they are for before you buy." },
          { h: "Industry focus", p: "Services, hospitality, retail and practices (no health data). Not for businesses in plumbing and heating, building services, electrical, construction or wholesale." },
        ],
      },
      {
        t: "steps",
        id: "ablauf",
        eyebrow: "Process",
        h: "Four steps, one fixed price.",
        items: [
          { h: "Intro call", p: "A brief look at goals, the workflows in scope and the scope itself. The fixed price is set afterwards, from €490 net." },
          { h: "Analysis call", p: "90 minutes remote with the people who actually do the work; for the extended scope as a workshop, on site if you prefer." },
          { h: "Written result", p: "A short report; for the extended scope you receive the process map and the 30-day plan within a few working days." },
          { h: "Walkthrough", p: "For the extended scope: 30 minutes on the plan, effort and next steps." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Result",
        h: "What lands in your inbox at the end.",
        items: [
          { h: "Short written report", tag: "Entry", p: "Where AI and automation make sense in your daily work, and where they do not." },
          { h: "Process map", tag: "Extended", p: "The workflows discussed, in writing." },
          { h: "Five rated candidates", tag: "Extended", p: "Drawn from your real workflows, with a tool recommendation and a rough effort estimate." },
          { h: "30-day plan", tag: "Extended", p: "With owners and next steps." },
          { h: "What stays manual", tag: "Extended", p: "Which steps should deliberately stay manual, and why." },
        ],
      },
    ],
    faq: {
      h: "Questions about the AI Check",
      items: [
        { q: "What does the AI Check cost?", a: "The entry scope costs from €490: 90 minutes remote and a short written report. For an extended scope with a workshop, a process map and a 30-day plan, we quote a fixed price in writing after the intro call, before any work starts. All prices are net, plus VAT." },
        { q: "Is a confidentiality agreement signed?", a: "Yes, a standard NDA is signed before the analysis call." },
        { q: "What if nothing is worth automating?", a: "Then that is exactly what the written result says, with the reasons. That is a result too: you avoid a project that would not pay for itself." },
        { q: "What happens after the check?", a: "Three paths are open: you act on the recommendations yourself, we run a pilot together, or the collaboration ends there. You make no commitment." },
      ],
    },
    cta: { h: "Find out what is really worth it.", p: "One conversation, a written result, no commitment. If the timing is not right yet, we will tell you.", primary: { label: "Request an AI Check", href: "/contact" }, secondary: { label: "All services", href: "/leistungen" } },
    service: { type: "AI and automation assessment", offers: [{ name: "AI Check", price: 490, from: true }] },
  },

  about: {
    slug: "ueber-uns",
    meta: {
      title: "About OpSolid: the workflow first, then the technology",
      description:
        "OpSolid builds AI agents, websites and automation for small and mid-sized businesses: measured, documented, no lock-in. Not to be confused with TopSolid.",
    },
    crumb: "About OpSolid",
    hero: {
      eyebrow: "About OpSolid",
      h1: ["Process first, ", "technology second", "."],
      lede: "OpSolid builds AI agents, websites and automated workflows for small and mid-sized businesses. We first understand how the work is done today, and only then decide what technology can improve.",
      primary: CONTACT,
      secondary: CHECK,
      spec: [
        ["Focus", "AI agents, websites, automation"],
        ["Method", "Analysis, pilot, rollout, handover"],
        ["For", "Small and mid-sized businesses"],
        ["Handover", "Source code and documentation"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "How we work",
        h: "Four principles for every project.",
        items: [
          { h: "Start with the people", p: "We begin with your real workflows and the people who do them, and propose what holds up in daily use. Where automation does not make sense, we say so." },
          { h: "A measured baseline", p: "Before every pilot we record how the workflow runs today and how much time it takes. After the pilot we compare against the same figures." },
          { h: "Data protection from the start", p: "EU hosting, a setup that complies with the GDPR and, for projects connected to Türkiye, with the Turkish data protection law KVKK. Clear access rules are part of the design, not an afterthought." },
          { h: "No lock-in", p: "For automations and internal tools we hand over source code and documentation, so your IT or another provider can take over at any time." },
        ],
      },
      {
        t: "text",
        eyebrow: "Industries",
        h: "Which businesses we work for.",
        paras: ["Industry focus: services, hospitality, retail and practices (no health data). Not for businesses in plumbing, heating and sanitation (SHK), building services engineering (TGA), electrical trades, construction or wholesale."],
      },
      {
        t: "text",
        eyebrow: "Experience",
        h: "Where the method comes from.",
        lede: "The experience behind OpSolid comes from IT project management, digitalisation and process optimisation in the day-to-day operations of companies. Every step of our method comes from there: map the workflow, measure the baseline, pilot small, hand over cleanly.",
        paras: [
          "The toolkit includes Microsoft 365 with Outlook, Teams, SharePoint and Power Automate, plus Make, n8n, Python and custom code, CRM and ERP integrations and hosting in the EU.",
        ],
      },
      {
        t: "rows",
        eyebrow: "Our own projects",
        h: "Projects that show our work.",
        items: [
          { h: "opsolid.de", tag: "This site", p: "Designed, built and run by OpSolid. The text comes first; the background video can be paused and switched off.", shot: SHOT.opsolid },
          { h: "OpSo", tag: "Product in testing", p: "A digital business card with NFC and QR, built as a web app with its own dashboard, onboarding and admin console. The launch is being prepared.", href: "/opso", shot: SHOT.opso },
          { h: "Kutasia", tag: "Project in development", p: "Customer messages from WhatsApp, Telegram and email in one inbox, with AI triage.", href: "https://kutasia.com", shot: SHOT.kutasia },
        ],
      },
      {
        t: "text",
        eyebrow: "Not to be confused",
        h: "OpSolid is not TopSolid.",
        paras: ["OpSolid is not TopSolid (CAD/CAM) and has no connection to it."],
      },
    ],
    cta: { h: "Start with one workflow.", p: "If your workflows involve too much manual work, we support you from analysis to handover.", primary: CHECK, secondary: CONTACT },
  },

  contact: {
    slug: "contact",
    meta: {
      title: "Contact: describe your workflow, request an AI Check",
      description:
        "Write to OpSolid by form, email or phone: which workflow, which systems, what gets in the way. We usually reply within a few working days.",
    },
    crumb: "Contact",
    hero: {
      eyebrow: "Contact",
      h1: ["Three sentences ", "are enough", "."],
      lede: "Tell us which workflow it is about, which systems are involved and what gets in the way today. By form, email or phone; we usually reply within a few working days.",
      primary: { label: "Write a message", href: "#form-h" },
      secondary: CHECK,
    },
    blocks: [],
    cta: { h: "Prefer to have your workflows reviewed first?", p: "The AI Check shows where automation pays off for you: 90 minutes remote, followed by a short written report.", primary: CHECK },
  },
};
