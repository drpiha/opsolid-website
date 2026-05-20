/**
 * V2 redesign locale strings — isolated namespace gated behind ?preview=v2.
 * EN is the type-defining source of truth; DE/TR mirror its shape.
 *
 * Voice rules (docs/research/voice-audit.md):
 *  - No period at end of headings, ever.
 *  - Short certain claims (3-8 words majority).
 *  - Reject "unlock / supercharge / revolutionize / next-gen / AI-native".
 *  - No tool-name dropping in headlines (no "Power Automate", "Make", "n8n",
 *    "ChatGPT" etc. on the home hero — that's HOW; the customer wants WHAT).
 *  - DE = formal Sie. TR = formal siz.
 */

export const v2 = {
  home: {
    hero: {
      eyebrow: "Independent automation practice",
      headline: [
        "We take the repeat",
        "off your team —",
        "quietly, every day",
      ],
      lead: "We build the tools, workflows and the AI layer that quietly run your operation in the background. So nobody has to ask whether it ran.",
      ctaPrimary: "Talk to us",
      ctaSecondary: "See what we build",
      chips: ["Process automation", "Internal tools", "AI consulting", "Training EN · DE · TR"],
    },
    pillars: {
      eyebrow: "What we build",
      headline: "Four practices, one studio",
      items: [
        {
          slug: "prozessautomatisierung",
          label: "Process automation",
          sub: "Repetitive work disappears into the background — nobody has to start it, nobody has to remember it",
        },
        {
          slug: "interne-tools",
          label: "Internal tools",
          sub: "Custom apps instead of fragile spreadsheets — without the compliance drama",
        },
        {
          slug: "ki-beratung",
          label: "AI consulting",
          sub: "We tell you where AI pays back and where it quietly burns budget",
        },
        {
          slug: "ki-schulungen",
          label: "Training EN · DE · TR",
          sub: "Practical workshops in English, German and Turkish — for the people who will use the system",
        },
      ],
      cardCta: "Open",
    },
  },
  leistungen: {
    eyebrow: "Five practices",
    headline: "What we build for you",
    manifesto:
      "Five practices, one studio. We pick the right combination for your operation — sometimes a single tool, sometimes the whole stack.",
    services: [
      {
        index: "01",
        slug: "ki-beratung",
        label: "AI strategy",
        sub: "Where AI pays back",
      },
      {
        index: "02",
        slug: "prozessautomatisierung",
        label: "Process automation",
        sub: "Workflows that run themselves",
      },
      {
        index: "03",
        slug: "microsoft-365-automatisierung",
        label: "Microsoft 365",
        sub: "Outlook, Teams, SharePoint flows",
      },
      {
        index: "04",
        slug: "interne-tools",
        label: "Internal tools",
        sub: "Replace the spreadsheet",
      },
      {
        index: "05",
        slug: "ki-schulungen",
        label: "AI training",
        sub: "Practical sessions for your team",
      },
    ],
  },
  kiBeratung: {
    eyebrow: "AI consulting",
    headline: "What can your AI take over?",
    lead: "We sit with your operation, identify the work that should be machine work, and tell you where AI pays back — not where it sounds good in a deck.",
    ctaPrimary: "Talk to us",
    ctaSecondary: "How we work",
    terminal: {
      title: "session · ai-discovery",
      prompt: "$ opsolid scan --depth=ops",
      lines: [
        "> reading 12 daily flows ...",
        "  found: invoice intake      28 min/day  → automatable",
        "  found: customer reply triage 44 min/day → automatable",
        "  found: inventory reconcile  35 min/day  → automatable",
        "  found: legal review                     → keep human",
        "  found: pricing exception                → keep human",
        "> projection: 11.3 hours / week recovered",
        "> next: kickoff call",
      ],
    },
  },
  prozess: {
    eyebrow: "Process automation",
    headline: "We retire the work nobody likes doing",
    lead: "The forms, the spreadsheets, the copy-paste, the 'did anyone send the report yet?' — we take them off your team and put them on rails.",
    ctaPrimary: "Talk to us",
    ctaSecondary: "How we work",
  },
  microsoft365: {
    eyebrow: "Microsoft 365 integration",
    headline: "Your 365 finally talking to your other systems",
    lead: "We don't install Microsoft 365 — we connect the one you already have to your CRM, ERP, helpdesk and the rest of the stack, so messages, files and approvals stop falling between apps.",
    ctaPrimary: "Talk to us",
    ctaSecondary: "How we work",
    services: ["Outlook", "Teams", "SharePoint", "OneDrive", "Forms", "Planner"],
    hubLabel: "Integration Hub",
  },
  interneTools: {
    eyebrow: "Internal tools",
    headline: "Replace the spreadsheet your business runs on",
    lead: "The Excel file everyone shares, breaks and copies — we replace it with a small purpose-built app your team wants to open.",
    ctaPrimary: "Talk to us",
    ctaSecondary: "How we work",
    beforeLabel: "Spreadsheet chaos",
    afterLabel: "Your team's tool",
  },
} as const;

export type V2Content = typeof v2;
