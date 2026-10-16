import type { PageDef } from "./types";
import type { PageKey } from "./keys";

const CHECK = { label: "Book an AI check", href: "/ai-automation-check" };
const CONTACT = { label: "Get in touch", href: "/contact" };

const DEMO = {
  chip: "Demo · scripted scenario, no sound",
  play: "Play scenario",
  again: "Play again",
  note: "A scripted run, not a live call. The live voice demo follows once the voice provider and the data-protection review (GDPR) are settled.",
  sr: "Sample conversation. Caller: Hello, I would like to book an appointment for next week. Agent: Gladly. Does Wednesday at 10 or Thursday at 2 pm suit you? Caller: Thursday works. Agent: Then I will book Thursday at 2 pm. You will receive a confirmation by email.",
  script: [
    { who: "Caller", agent: false, text: "Hello, I would like to book an appointment for next week.", ms: 3000 },
    { who: "Agent", agent: true, text: "Gladly. Does Wednesday at 10 or Thursday at 2 pm suit you?", ms: 3600 },
    { who: "Caller", agent: false, text: "Thursday works.", ms: 1400 },
    { who: "Agent", agent: true, text: "Then I will book Thursday at 2 pm. You will receive a confirmation by email.", ms: 4200 },
  ],
};

export const en: Record<PageKey, PageDef> = {
  home: {
    slug: "",
    meta: {
      title: "OpSolid | AI agents, websites and automation from Arnsberg",
      description:
        "Independent practice for talking AI agents, websites, process automation and AI training. I plan, build and run it myself. Arnsberg, Germany.",
    },
    crumb: "Home",
    hero: {
      eyebrow: "OpSolid · Practice for AI agents, websites and automation · Arnsberg",
      h1: ["Built to ", "keep running", "."],
      lede: "I build talking AI agents, websites and workflows for small and mid-sized businesses, and I run products of my own that are in use today.",
      primary: CHECK,
      secondary: { label: "See agents", href: "/agents" },
      scene: "stack",
    },
    blocks: [
      {
        t: "demo",
        id: "agents",
        scene: "agents",
        heat: [0],
        eyebrow: "Voice and video agents",
        h: "Agents that speak and listen.",
        lede: "I build voice and video agents for inquiries, scheduling and questions about your business. The face is the surface; your process runs behind it.",
        ...DEMO,
        cta: { label: "More on agents", href: "/agents" },
      },
      {
        t: "rows",
        id: "websites",
        scene: "websites",
        heat: [1],
        eyebrow: "Websites to buy or rent",
        h: "Websites I design, build and rent out.",
        lede: "A website with its own character, to buy or to rent. I settle the terms with you in a conversation.",
        items: [
          { h: "opsolid.de", tag: "This site", p: "Designed, built and run by me: three languages, text first, 3D only as an extra.", href: "https://opsolid.de" },
          { h: "OpSo", tag: "Product", p: "A digital business card with NFC and QR, built as its own web app.", href: "https://card.opsolid.de" },
          { h: "Kutasia", tag: "Live demo", p: "WhatsApp, Telegram and email in one inbox, with AI pre-sorting.", href: "https://kutasia.com" },
        ],
        cta: { label: "More on websites", href: "/websites" },
      },
      {
        t: "rows",
        id: "automatisierung",
        scene: "flow",
        heat: [2, 3, 4],
        eyebrow: "Process automation and Microsoft 365",
        h: "Workflows that run by themselves.",
        lede: "I put forms, spreadsheets and copy-paste on rails. What only a person can decide stays with your team.",
        items: [
          { h: "Process automation", p: "Recurring steps run through without rework.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Outlook, Teams and SharePoint connected to your CRM, ERP and helpdesk.", href: "/microsoft-365-automatisierung" },
          { h: "Internal tools", p: "The shared spreadsheet becomes a purpose-built tool.", href: "/interne-tools" },
          { h: "AI consulting", p: "Where AI pays off in your business, and where it does not.", href: "/ki-beratung" },
        ],
      },
      {
        t: "spec",
        id: "ki-check",
        scene: "steps",
        heat: [5, 6],
        eyebrow: "AI check and AI training",
        h: "Clarify first, then build.",
        lede: "In the AI check I go through your workflows with you for 60–90 minutes. You then receive a written 30-day plan with five rated candidates.",
        rows: [
          ["Scope", "60–90 minutes, on site or remote"],
          ["Result", "Process map, 5 rated opportunities, 30-day plan"],
          ["Price", "On request, fixed after the intro call"],
        ],
        cta: { label: "Book an AI check", href: "/ai-automation-check" },
      },
      {
        t: "table",
        h: "Three fixed training offers.",
        caption: "Parts list: AI training",
        cols: ["Offer", "Format", "Price"],
        rows: [
          ["AI Quick Check", "90 minutes remote, written report", "from €490"],
          ["AI Literacy Basics", "Half day, up to 15 people", "€1,490"],
          ["Copilot Practice Day", "1 day, up to 12 people", "from €2,400"],
        ],
        cta: { label: "All training", href: "/ki-schulungen" },
      },
      {
        t: "rows",
        id: "produkte",
        scene: "cards",
        eyebrow: "Own products",
        h: "Two products I run myself.",
        lede: "Both are live, and both show how I work.",
        items: [
          { h: "OpSo", tag: "Product", p: "A digital business card with NFC and QR: one link, always current, no app needed for the recipient.", href: "/opso" },
          { h: "Kutasia", tag: "Live demo", p: "Customer messaging from WhatsApp, Telegram and email in one inbox.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "text",
        id: "ueber-mich",
        scene: "offset",
        eyebrow: "About me",
        h: "Hasan Dönmez, Arnsberg.",
        lede: "I work alone, and you always talk to me. Process first, then technology. Where automation does not make sense, I will say so.",
        paras: ["OpSolid is not TopSolid (CAD/CAM) and has no connection to it."],
        cta: { label: "More about me", href: "/ueber-mich" },
      },
    ],
    faq: {
      h: "Frequently asked questions",
      items: [
        { q: "Who works on my project?", a: "I do, Hasan Dönmez, personally. OpSolid is a one-person practice. If I bring in a freelance trainer for a workshop, I choose that person in advance and tell you." },
        { q: "Is a confidentiality agreement signed beforehand?", a: "Yes. A standard NDA is signed before the analysis call." },
        { q: "Do I need to use AI already?", a: "No. Many projects start with no AI at all." },
        { q: "Can I keep my existing tools?", a: "Yes. Where Microsoft 365, Google Workspace, your CRM or ERP carry the process, I use those first." },
      ],
    },
    cta: { h: "Book an intro call or write directly.", p: "I usually reply within a few working days.", primary: CHECK, secondary: CONTACT },
  },

  agents: {
    slug: "agents",
    meta: {
      title: "AI agents with voice and video",
      description:
        "Talking AI agents for inquiries, scheduling and questions: as a voice or a 3D figure. Built by Hasan Dönmez, with a data-protection review before going live.",
    },
    crumb: "Agents",
    hero: {
      eyebrow: "Agents · voice and video",
      h1: ["Agents that ", "speak", " and listen."],
      lede: "An agent takes inquiries, schedules appointments and answers questions about your business, as a voice or as a 3D figure on video. Your own process runs behind it.",
      primary: CHECK,
      secondary: { label: "See the scenario", href: "#demo" },
      scene: "agents",
      heat: [0],
      spec: [
        ["Formats", "Voice and video with a 3D figure"],
        ["Tasks", "Inquiries, appointments, answers"],
        ["Status", "Scripted demo, live demo to follow"],
      ],
    },
    blocks: [
      {
        t: "demo",
        id: "demo",
        scene: "agents",
        heat: [0],
        h: "What a call sounds like.",
        lede: "A scripted run with a waveform and a moving mouth. The agent says what it does and hands over when a person is needed.",
        ...DEMO,
      },
      {
        t: "rows",
        eyebrow: "Tasks",
        h: "What an agent takes over.",
        lede: "Routine that repeats and follows clear rules. Anything that needs judgement goes to your team.",
        items: [
          { h: "Take inquiries", p: "Record questions by phone or video chat and pass them to your team in a structured way." },
          { h: "Schedule appointments", p: "Offer free slots, book the appointment, send a confirmation." },
          { h: "Give information", p: "Explain services, processes and hours, from your own material." },
          { h: "Hand over to people", p: "For complaints, special cases and uncertainty, the conversation goes to a person." },
        ],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "How an agent comes about.",
        items: [
          { h: "Clarify", p: "Set tasks, limits and tone. What may the agent decide, and what not?" },
          { h: "Build", p: "Design the dialogue, voice or figure and connect it to calendar, CRM or mailbox." },
          { h: "Review data protection", p: "Settle provider, storage location, retention and the notice that an AI system is speaking, before it goes live." },
          { h: "Test and run", p: "Review conversations, refine, and support the agent in daily use." },
        ],
      },
    ],
    faq: {
      h: "Questions about agents",
      items: [
        { q: "Does the agent speak live today?", a: "Today I show a scripted scenario. The live voice demo follows once the voice provider and the data-protection review are settled." },
        { q: "Who listens to the conversations?", a: "I settle that with you beforehand: provider, storage location, retention and access. Callers are told at the start that an AI system is speaking." },
        { q: "Does an agent replace my team?", a: "No. It takes over routine and hands over as soon as a person is needed." },
        { q: "How do I start?", a: "With the AI check. There I clarify whether an agent makes sense for your business and which tasks it should take." },
      ],
    },
    cta: { h: "Check whether an agent fits you.", p: "In the AI check I clarify tasks, limits and data protection before anything is built.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI voice and video agents" },
  },

  websites: {
    slug: "websites",
    meta: {
      title: "Websites: design, build and rent",
      description:
        "Websites with their own character, to buy or to rent. Design, build and operation from one hand. Only sites that Hasan Dönmez built himself are shown.",
    },
    crumb: "Websites",
    hero: {
      eyebrow: "Websites · buy or rent",
      h1: ["Websites I ", "design, build", " and rent out."],
      lede: "A website with its own character: fast, easy to read and in several languages. You buy it or rent it. I settle the terms with you in a conversation.",
      primary: CONTACT,
      secondary: { label: "See references", href: "#referenzen" },
      scene: "websites",
      heat: [1],
      spec: [
        ["Models", "Buy or rent"],
        ["Languages", "German, English, Turkish possible"],
        ["Pricing", "By scope, in conversation"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "What you get",
        h: "What you get.",
        items: [
          { h: "Design", p: "Its own hand instead of a template: typography, colour and motion fit your business." },
          { h: "Build", p: "Text first, fast loading, accessible, and built cleanly for search engines and AI search." },
          { h: "Multilingual", p: "Several languages with their own addresses and clean markup for search." },
          { h: "Buy or rent", p: "Buy: you receive the finished site. Rent: you use it continuously and I take care of operation. You and I set the terms together." },
        ],
      },
      {
        t: "rows",
        id: "referenzen",
        scene: "websites",
        heat: [1],
        eyebrow: "References",
        h: "Sites I built myself.",
        lede: "I only show sites and products here that I built and run myself. Client sites follow once there are some.",
        items: [
          { h: "opsolid.de", tag: "This site", p: "Three languages, text first, with a 3D stage as an extra that can be switched off.", href: "https://opsolid.de" },
          { h: "OpSo", tag: "Product", p: "A digital business card as a web app: profile, QR and NFC link.", href: "https://card.opsolid.de" },
          { h: "Kutasia", tag: "Live demo", p: "An inbox for WhatsApp, Telegram and email with AI pre-sorting.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "From conversation to finished site.",
        items: [
          { h: "Conversation", p: "Clarify goal, audience, content and languages. I then name scope and price." },
          { h: "Draft", p: "Structure and design of the key pages, with your feedback." },
          { h: "Build", p: "Implementation with texts, images and forms, tested on phone and desktop." },
          { h: "Launch and operation", p: "Publishing, domain, data-protection building blocks and, on request, ongoing care." },
        ],
      },
    ],
    faq: {
      h: "Questions about websites",
      items: [
        { q: "Buy or rent, which is better?", a: "It depends on whether you want to carry the site on yourself. If you buy, it is yours; if you rent, I take care of operation. I settle that with you in a conversation." },
        { q: "How long does a website take?", a: "That depends on scope. After the conversation I name a concrete schedule." },
        { q: "Who owns the texts and images?", a: "Content you supply stays yours. I agree the usage rights for design and code with you in writing beforehand." },
        { q: "Can the site include 3D and motion?", a: "Yes, as an extra. The text always comes first, effects can be switched off, and they respect the reduced-motion setting." },
      ],
    },
    cta: { h: "Discuss your website.", p: "Tell me briefly what the site should do. I usually reply within a few working days.", primary: CONTACT },
    service: { type: "Website design, development and rental" },
  },

  leistungen: {
    slug: "leistungen",
    meta: {
      title: "Services: agents, websites, automation, AI",
      description:
        "Seven services from one practice: AI agents, websites, process automation, Microsoft 365, internal tools, AI consulting and AI training.",
    },
    crumb: "Services",
    hero: {
      eyebrow: "Services",
      h1: ["Seven areas, ", "one practice", "."],
      lede: "I take on single building blocks or the whole setup. The AI check shows where to begin.",
      primary: CHECK,
      scene: "stack",
      heat: [0, 1, 2, 3, 4, 5, 6],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "All services",
        h: "Every plate in the stack is an offer.",
        items: [
          { h: "Agents", tag: "Voice · video", p: "Talking AI agents for inquiries, appointments and answers.", href: "/agents" },
          { h: "Websites", tag: "Build · rent", p: "Designed, built and, on request, rented out.", href: "/websites" },
          { h: "Process automation", p: "Workflows that run by themselves.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Outlook, Teams and SharePoint connected to your business systems.", href: "/microsoft-365-automatisierung" },
          { h: "Internal tools", p: "Replace the spreadsheet with a small, purpose-built tool.", href: "/interne-tools" },
          { h: "AI consulting", p: "Where AI pays off, and where it does not.", href: "/ki-beratung" },
          { h: "AI training", tag: "Team", p: "Three fixed offers with fixed prices.", href: "/ki-schulungen" },
        ],
      },
    ],
    cta: { h: "Not sure where to start?", p: "In the AI check I sort your workflows and pick the building block that pays off first.", primary: CHECK, secondary: CONTACT },
  },

  kiBeratung: {
    slug: "ki-beratung",
    meta: {
      title: "AI consulting for SMEs: use cases, risk, roadmap",
      description:
        "AI consulting for small and mid-sized businesses: find worthwhile use cases, weigh benefit against risk, and get a written roadmap and GDPR-compliant setup.",
    },
    crumb: "AI consulting",
    hero: {
      eyebrow: "AI consulting",
      h1: ["Which AI is really ", "worth it for you", "?"],
      lede: "I find three to five AI use cases that fit your business, rate benefit, effort and risk, and put the result in writing as a roadmap.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "steps",
      heat: [5],
      spec: [
        ["Result", "Use-case rating and written roadmap"],
        ["Duration", "Usually two to four weeks"],
        ["Stance", "Independent, I do not sell AI tools"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "What I do",
        h: "What AI consulting looks like.",
        items: [
          { h: "Find use cases", p: "Identify three to five applications that fit your business, and rule out the ones that do not." },
          { h: "Rate them", p: "Place each use case by expected benefit, effort and operating risk." },
          { h: "Write the roadmap", p: "A 6 to 12 month roadmap with owners, costs and decision points." },
          { h: "Set up data protection", p: "Prepare GDPR-compliant use: model choice, data sovereignty and a short company policy." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Fields of use",
        h: "Typical applications.",
        lede: "These are typical examples, not client projects.",
        items: [
          { h: "Document and contract analysis", p: "Pre-sort long PDFs, surface clauses and deadlines. A person checks the summary." },
          { h: "Internal knowledge search", p: "Make policies, FAQs and SharePoint searchable, with answers from your own documents." },
          { h: "Proposal drafts", p: "Draft proposals from a template, a CRM record and a short brief. Sales reviews and approves." },
          { h: "Support triage", p: "Sort incoming requests by topic and urgency before a person handles them." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Tools",
        h: "Models, providers and building blocks.",
        items: ["OpenAI", "Anthropic Claude", "Microsoft Copilot, Azure OpenAI", "Mistral and open-source models", "Retrieval-augmented generation", "pgvector, Qdrant", "EU hosting"],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "How an AI consulting engagement runs.",
        items: [
          { h: "Discovery", p: "A short conversation about team, data and goals." },
          { h: "Use-case rating", p: "Workshop and written analysis: which applications pay off, which do not." },
          { h: "Roadmap and policy", p: "A decision-ready roadmap plus a short written AI policy for your business." },
        ],
      },
    ],
    faq: {
      h: "Questions about AI consulting",
      items: [
        { q: "Does my business need to be “AI-ready” already?", a: "No. That is exactly when consulting pays off, before money goes into tools." },
        { q: "Do you sell AI tools?", a: "No. I am independent and recommend what fits. That can mean: use what you have, or wait for now." },
        { q: "Can AI be used in a GDPR-compliant way?", a: "Yes, with the right model choice, EU hosting and a written policy. I help set that up from the start." },
        { q: "How long does consulting take?", a: "Usually two to four weeks for analysis and roadmap. Implementation timelines are separate and depend on scope." },
      ],
    },
    cta: { h: "Find out which AI is worth it.", p: "One conversation, a written roadmap, no platform pitch.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI consulting" },
  },

  prozess: {
    slug: "prozessautomatisierung",
    meta: {
      title: "Process automation for SMEs",
      description:
        "Automate manual workflows: proposals, documents, email routing, reports and data sync. On the tools you already pay for. GDPR-aware.",
    },
    crumb: "Process automation",
    hero: {
      eyebrow: "Process automation",
      h1: ["Tasks that ", "nobody should do by hand", " anymore."],
      lede: "Proposals that take half a day. Reports rebuilt every Monday. Data that wanders between Excel, CRM and email. I map the workflow and automate what is worth it.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "flow",
      heat: [2],
      spec: [
        ["Start", "One high-leverage workflow, fixed scope"],
        ["Duration", "Pilot usually in two to four weeks"],
        ["Basis", "Your existing tools"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "What I do",
        h: "What process automation looks like.",
        items: [
          { h: "Map the workflow", p: "Write down handovers, tools, data and exceptions so clearly that your team can check it." },
          { h: "Choose", p: "Clarify which steps can be automated and which should deliberately stay manual." },
          { h: "Build", p: "Automation with Power Automate, Make, n8n, Python or custom code, whatever fits." },
          { h: "Hand over", p: "Monitoring, documentation and handover so your team runs the workflow afterwards." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Fields of use",
        h: "Typical workflows.",
        lede: "Typical examples, not client projects.",
        items: [
          { h: "Proposals and documents", p: "Fill templates from CRM data, approve in the workflow and send." },
          { h: "Email sorting", p: "Tag incoming mail by topic and route it to the right inbox or ticket." },
          { h: "Reports and Excel", p: "Build recurring analyses once and regenerate them automatically." },
          { h: "CRM and ERP sync", p: "Capture data once and reconcile it between systems, without double entry." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Tools",
        h: "What I automate with.",
        items: ["Microsoft Power Automate", "Make", "n8n, self-hosted", "Zapier, where it fits", "Python", "REST APIs and webhooks", "PostgreSQL and queues"],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "How an automation project runs.",
        items: [
          { h: "Map", p: "A workshop with the team that does the work. I write the workflow down as it really runs." },
          { h: "Build", p: "The first pilot automation, usually within two to four weeks." },
          { h: "Run", p: "Documentation, handover and a short phase of refinement." },
        ],
      },
    ],
    faq: {
      h: "Questions about process automation",
      items: [
        { q: "What is a typical first project?", a: "A single high-leverage workflow, such as proposal creation, email sorting or a weekly report. Fixed scope, two to four weeks." },
        { q: "Do I have to replace my tools?", a: "No. I automate on what you have: Microsoft 365, Google Workspace, your CRM, your ERP." },
        { q: "What if the workflow changes later?", a: "I document so that your IT can make adjustments itself. For bigger changes there is an optional small monthly frame." },
        { q: "Is it safe to automate critical workflows?", a: "Yes, with logging, error handling and a manual fallback. I plan for failure, not just the ideal case." },
      ],
    },
    cta: { h: "Pick the first workflow worth automating.", p: "I map it, rate it and tell you whether it is worth the effort.", primary: CHECK, secondary: CONTACT },
    service: { type: "Business process automation" },
  },

  m365: {
    slug: "microsoft-365-automatisierung",
    meta: {
      title: "Microsoft 365 automation: Power Automate, SharePoint, Teams",
      description:
        "Automate workflows in Microsoft 365: Power Automate, SharePoint, Teams approvals and Outlook routing, EU-hosted and privacy-aware.",
    },
    crumb: "Microsoft 365",
    hero: {
      eyebrow: "Microsoft 365",
      h1: ["Microsoft 365 is there. ", "Now it works", " for you."],
      lede: "Teams, SharePoint, Outlook and Power Automate are paid for. With the right setup they replace many extra subscriptions and keep data in one place.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "flow",
      heat: [3],
      spec: [
        ["Start", "Review of your tenant"],
        ["Pilot", "First flow usually in two weeks"],
        ["Basis", "Standard licences where enough"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "What I do",
        h: "What Microsoft 365 automation looks like.",
        items: [
          { h: "Review the tenant", p: "Look at licences, setup and tools, and find automations your team is not using yet." },
          { h: "Build flows", p: "Power Automate for approvals, documents, email routing and notifications." },
          { h: "Connect", p: "Link SharePoint, Teams, Outlook and Excel so data lives in one place." },
          { h: "Order Copilot", p: "Set up Microsoft 365 Copilot with role-based access and clear rules." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Fields of use",
        h: "Typical workflows in Microsoft 365.",
        lede: "Typical examples, not client projects.",
        items: [
          { h: "Approvals in Teams", p: "Leave, expenses, documents: approve in Teams, log in SharePoint." },
          { h: "Documents from SharePoint lists", p: "Generate proposals, contracts and reports from a list, without copy-paste from Excel." },
          { h: "Outlook parsing and routing", p: "Read orders, requests or invoices automatically and pass them to the right system." },
          { h: "Copilot rollout", p: "Rules, roles and a short training so Copilot is used safely." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Tools",
        h: "What I work with.",
        items: ["Power Automate", "Power Apps", "SharePoint Online", "Teams, bots, approvals", "Outlook, Exchange", "Microsoft Graph API", "Microsoft 365 Copilot", "Entra ID"],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "How a Microsoft 365 project runs.",
        items: [
          { h: "Tenant review", p: "Look at licences, security setup and tools, and find what is underused." },
          { h: "First flow", p: "A Power Automate flow or Teams workflow as a pilot, usually in two weeks." },
          { h: "Rollout", p: "Wider use with documentation, handover and optional training for your IT." },
        ],
      },
    ],
    faq: {
      h: "Questions about Microsoft 365",
      items: [
        { q: "Do I need Power Automate Premium licences?", a: "Sometimes. Most useful flows run on the standard plans. I will tell you when Premium is needed." },
        { q: "Is Microsoft 365 Copilot worth it?", a: "For some teams yes, for others no. I clarify that before you buy licences." },
        { q: "Can you work with our IT?", a: "Yes. Most projects run together with your IT or your Microsoft partner. I add to it, I do not replace it." },
        { q: "Is this GDPR-compliant?", a: "Microsoft 365 in an EU tenant can be run in a GDPR-compliant way. I configure it cleanly and document the data flows." },
      ],
    },
    cta: { h: "Get more out of Microsoft 365.", p: "I tell you what is worth automating in your tenant before you sign up for another subscription.", primary: CHECK, secondary: CONTACT },
    service: { type: "Microsoft 365 automation" },
  },

  interneTools: {
    slug: "interne-tools",
    meta: {
      title: "Internal tools: admin panels, dashboards, approval queues",
      description:
        "Small, focused internal tools for SMEs: admin consoles, dashboards, approval queues and knowledge bases, EU-hosted.",
    },
    crumb: "Internal tools",
    hero: {
      eyebrow: "Internal tools",
      h1: ["Where off-the-shelf software does not fit, ", "a small tool solves", " the problem."],
      lede: "Not every internal job needs a platform at 500 euros a month. Often a small, purpose-built tool solves the problem better, cheaper and faster.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "cards",
      heat: [4],
      spec: [
        ["Pilot", "In three to six weeks"],
        ["Handover", "Source code and documentation"],
        ["Hosting", "EU, on your side on request"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "What I build",
        h: "Tools for everyday operations.",
        items: [
          { h: "Admin consoles", p: "Clear and focused for your operations team, without bloat." },
          { h: "Dashboards", p: "Metrics, exceptions and alerts from your data sources in one view." },
          { h: "Approval queues and forms", p: "Approvals and escalations that fit your real workflow." },
          { h: "Knowledge bases", p: "Search across your own documents, policies and FAQs." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Fields of use",
        h: "Typical tools.",
        lede: "Typical examples, not client projects.",
        items: [
          { h: "Operations console", p: "Order overview, exceptions and customer notes in one place instead of three tabs." },
          { h: "KPI dashboard", p: "Daily, weekly and monthly figures from CRM, ERP and finance, without manual work." },
          { h: "Approval queue", p: "Queue, route and approve proposals, contracts or refunds with a history." },
          { h: "AI knowledge base", p: "Search your own documents. Answers stay inside your organisation." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Stack",
        h: "What I build with.",
        items: ["Next.js, React, TypeScript", "Node.js, Python", "PostgreSQL", "REST, GraphQL, webhooks", "Microsoft Entra ID, SSO", "EU hosting", "GitHub, CI/CD, audit logs"],
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "How an internal-tool project runs.",
        items: [
          { h: "Specification", p: "A short workshop: what the tool must do and what it must not." },
          { h: "Build", p: "A pilot version in three to six weeks, with real users and real data." },
          { h: "Run", p: "Handover with documentation and source code, optionally with a small frame for ongoing changes." },
        ],
      },
    ],
    faq: {
      h: "Questions about internal tools",
      items: [
        { q: "Why not ready-made software?", a: "Ready-made software is often the right choice. I only build when it does not fit or would be too expensive for the purpose. I will tell you honestly." },
        { q: "Who owns the code?", a: "I put that in writing before the start. Handing over source code and documentation is usual." },
        { q: "Where does the tool run?", a: "In the EU, with a provider of your choice or on your own infrastructure." },
      ],
    },
    cta: { h: "Replace the spreadsheet.", p: "Describe the workflow briefly. I will tell you whether a tool of your own pays off.", primary: CHECK, secondary: CONTACT },
    service: { type: "Custom internal tools" },
  },

  schulungen: {
    slug: "ki-schulungen",
    meta: {
      title: "AI training: three fixed offers with clear prices",
      description:
        "AI Quick Check from €490, AI Literacy Basics €1,490, Copilot Practice Day from €2,400. Practice over theory, for your team, in German, English or Turkish.",
    },
    crumb: "AI training",
    hero: {
      eyebrow: "AI training",
      h1: ["Three fixed offers, ", "clearly priced", "."],
      lede: "No building blocks, no subscriptions. You pick the format that fits your team. The training is practical: your tasks instead of slides.",
      primary: { label: "Send an inquiry", href: "/contact" },
      secondary: CHECK,
      scene: "steps",
      heat: [6],
    },
    blocks: [
      {
        t: "table",
        id: "angebote",
        eyebrow: "Offers",
        h: "What I offer.",
        caption: "Parts list: AI training",
        cols: ["Offer", "Format", "Price"],
        rows: [
          ["AI Quick Check||Together, you and I look at where AI makes sense in your daily work and where it does not. Result as a short written report. The first 3 pilots are free, in exchange for honest feedback.", "90 minutes remote, with report", "from €490"],
          ["AI Literacy Basics||Fundamentals for using AI safely at work. Delivered by a freelance trainer I select personally in advance. Supports your measures for AI literacy under Art. 4 of the EU AI Act.", "Half day, up to 15 people", "€1,490"],
          ["Copilot Practice Day||Hands-on work with Microsoft 365 Copilot on your own tasks. For businesses that already hold Copilot licences.", "1 day, up to 12 people", "from €2,400"],
        ],
        note: "Languages: German, English and Turkish.",
      },
      {
        t: "steps",
        eyebrow: "Process",
        h: "How a training runs.",
        items: [
          { h: "Inquiry", p: "You describe team, tasks and prior knowledge. I recommend the fitting format." },
          { h: "Agreement", p: "Date, place or remote, number of participants and content with examples from your daily work." },
          { h: "Delivery", p: "Practice on your tasks. Participants do the work themselves instead of listening." },
        ],
      },
    ],
    faq: {
      h: "Questions about training",
      items: [
        { q: "Do we get a certificate?", a: "The training is not a certificate course. It supports your measures for AI literacy under Art. 4 of the EU AI Act." },
        { q: "Who delivers the training?", a: "I deliver the AI Quick Check myself. For AI Literacy Basics a freelance specialist takes over, whom I select personally in advance." },
        { q: "Are online dates possible?", a: "The Quick Check runs remote. I agree the other formats with you." },
      ],
    },
    cta: { h: "Find the right format.", p: "Write me briefly about team and goal. I recommend a format and name the price.", primary: { label: "Send an inquiry", href: "/contact" }, secondary: CHECK },
    service: {
      type: "AI training",
      offers: [
        { name: "AI Quick Check", price: 490, from: true },
        { name: "AI Literacy Basics", price: 1490 },
        { name: "Copilot Practice Day", price: 2400, from: true },
      ],
    },
  },

  check: {
    slug: "ai-automation-check",
    meta: {
      title: "AI check: automation potential with a 30-day plan",
      description:
        "A 60–90 minute analysis call and a written 30-day plan with five rated automation candidates. The low-risk first step.",
    },
    crumb: "AI check",
    hero: {
      eyebrow: "AI check · entry offer",
      h1: ["Find the ", "real", " automation potential."],
      lede: "A focused analysis call of 60–90 minutes and a written 30-day plan with five concrete candidates, rated by effort, benefit and risk.",
      primary: { label: "Request an AI check", href: "/contact" },
      secondary: { label: "See the process", href: "#ablauf" },
      scene: "steps",
      heat: [5],
      spec: [
        ["Scope", "60–90 minutes, on site or remote"],
        ["Result", "Process map, 5 rated opportunities, 30-day plan"],
        ["Price", "On request, fixed after the intro call"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Why it exists",
        h: "Many automation projects fail before they begin.",
        lede: "Not because of the technology, but because the wrong workflow is automated or nobody wrote down what the team actually does.",
        items: [
          { h: "Symptoms instead of causes", p: "What stands out gets automated, not what causes the problem." },
          { h: "Tools without a use case", p: "AI tools are bought before it is clear what for." },
          { h: "No baseline", p: "Without a starting point the benefit cannot be measured." },
          { h: "Unclear limits", p: "It is open which steps should deliberately stay manual." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Included",
        h: "What is in the check.",
        items: [
          { h: "Analysis call, 60–90 minutes", p: "On site or remote. I listen to how work flows through your team, without slides." },
          { h: "Capture of the key workflows", p: "Workflows are written down so your team can check them." },
          { h: "5 concrete opportunities", p: "From your real workflows, not a generic AI wish list." },
          { h: "Rating by effort, benefit, risk", p: "So management can prioritise without technical knowledge." },
          { h: "30-day plan", p: "Next steps, tools, owners and expected result." },
          { h: "Optional: one pilot workflow", p: "Where it makes sense I build the first automation, with fixed scope and time frame." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Who for",
        h: "Who the check suits.",
        items: [
          { h: "Mid-sized businesses", p: "That want a measurable first step." },
          { h: "Teams with shadow AI", p: "That already use AI and want structure." },
          { h: "Operations leads", p: "With too many manual handovers." },
          { h: "Businesses evaluating tools", p: "Such as Microsoft 365, Power Automate or Make." },
        ],
      },
      {
        t: "steps",
        id: "ablauf",
        eyebrow: "Process",
        h: "How the check runs.",
        items: [
          { h: "Kickoff", p: "A short intro call on goals and the workflows in scope. After that the fixed price is set." },
          { h: "Analysis call", p: "60–90 minutes with the people who actually do the work." },
          { h: "Written plan", p: "Within a few working days you receive the 30-day plan." },
          { h: "Walkthrough", p: "30 minutes on scope, effort and next steps." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Result",
        h: "What ends up in your inbox.",
        items: [
          { h: "Process map", p: "The workflows discussed, in writing." },
          { h: "5 rated opportunities", p: "With tool recommendation and a rough effort estimate." },
          { h: "30-day plan", p: "With owners." },
          { h: "Note on what stays manual", p: "What should deliberately stay manual, and why." },
        ],
      },
    ],
    faq: {
      h: "Questions about the AI check",
      items: [
        { q: "What does the AI check cost?", a: "The price depends on scope and team size. After the intro call I name a fixed price. A shorter variant with a brief report is the AI Quick Check from €490." },
        { q: "Is a confidentiality agreement signed?", a: "Yes, a standard NDA is signed before the analysis call." },
        { q: "Is this only for businesses that already use AI?", a: "No. Many projects start with no AI at all." },
        { q: "Can we keep using our tools?", a: "Yes. Where Microsoft 365, Google Workspace, your CRM or ERP carry the workflow, I use those first." },
        { q: "What happens after the check?", a: "Either you carry out the plan yourself, you and I run a pilot together, or it ends there. No lock-in." },
      ],
    },
    cta: { h: "Find out what is really worth it.", p: "One conversation, a written plan, no obligation. I would rather tell you it is not the right time yet than start a project that does not pay off.", primary: { label: "Request an AI check", href: "/contact" }, secondary: { label: "All services", href: "/leistungen" } },
    service: { type: "AI and automation assessment" },
  },

  about: {
    slug: "ueber-mich",
    meta: {
      title: "About me: Hasan Dönmez, independent practice in Arnsberg",
      description:
        "Hasan Dönmez is an automation specialist in Arnsberg. OpSolid is a one-person practice for AI agents, websites and automation. Not to be confused with TopSolid.",
    },
    crumb: "About",
    hero: {
      eyebrow: "About me",
      h1: ["Hasan Dönmez, ", "alone", " and personal."],
      lede: "I am an automation specialist in Arnsberg. OpSolid is my one-person practice: you always talk to me and get the results from me.",
      primary: CONTACT,
      secondary: CHECK,
      scene: "offset",
      spec: [
        ["Name", "Hasan Dönmez"],
        ["Practice", "OpSolid, independent, sole proprietorship"],
        ["Place", "Arnsberg, Germany"],
        ["Languages", "German, English, Turkish"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Way of working",
        h: "How I work.",
        items: [
          { h: "Process first, then technology", p: "I take the time to understand your business before I suggest anything." },
          { h: "Built for daily use, not for demos", p: "Systems have to carry real load, handle errors and know the special cases." },
          { h: "Results, not features", p: "What should count is hours saved, fewer errors and better workflows." },
          { h: "Staying clear", p: "I recommend automation where it makes sense, and advise against it where it does not." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Own products",
        h: "What I run myself.",
        items: [
          { h: "OpSo", tag: "Product", p: "A digital business card with NFC and QR.", href: "/opso" },
          { h: "Kutasia", tag: "Live demo", p: "Customer messaging in one inbox, with AI pre-sorting.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "text",
        eyebrow: "Disambiguation",
        h: "OpSolid is not TopSolid.",
        paras: ["OpSolid is not TopSolid (CAD/CAM) and has no connection to it. If you are looking for Hasan Dönmez and OpSolid, you are in the right place."],
      },
    ],
    cta: { h: "Build something useful for your workflows.", p: "If your workflows contain too much manual work, I can help.", primary: CHECK, secondary: CONTACT },
  },

  contact: {
    slug: "contact",
    meta: {
      title: "Contact: request an intro call or AI check",
      description:
        "Request an intro call or an AI check by form, email or phone. I usually reply within a few working days.",
    },
    crumb: "Contact",
    hero: {
      eyebrow: "Contact",
      h1: ["Write or ", "call", "."],
      lede: "Tell me briefly what it is about. I usually reply within a few working days.",
      primary: CHECK,
      scene: "tight",
    },
    blocks: [],
    cta: { h: "Rather start right away?", p: "The AI check is the clearest first step.", primary: CHECK },
  },
};
