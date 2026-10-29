/**
 * KI-Beratung (flagship hub, direction A "Klarheit"). German is the source; EN and TR are transcreations.
 * Offer ladder per owner decision 2026-10-29: Kennenlernen (free) → KI-Check ab 990 € netto → Pilot zum
 * Festpreis (no number) → Betrieb und Ausbau (no number). The sample is a labelled "Muster", not a client report.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "beratung",
  meta: {
    title: "KI-Beratung und KI-Automatisierung für Unternehmen",
    description:
      "KI-Beratung, die bei Ihren Abläufen beginnt: KI-Check ab 990 € netto, Pilot zum Festpreis, Betrieb nach Vereinbarung. Unabhängig, ohne Lizenzverkauf.",
  },
  crumbs: [],
  crumb: "KI-Beratung",
  hero: {
    eyebrow: "KI-Beratung · KI-Automatisierung",
    h1: ["KI-Beratung, die bei Ihren ", "Abläufen", " beginnt"],
    lede: "OpSolid berät Unternehmen bei der Automatisierung mit KI. Wir nehmen zuerst auf, wie die Arbeit heute läuft, entscheiden mit Ihnen, was sich lohnt, und bauen eine Lösung, die im Alltag läuft.",
    primary: { label: "KI-Check ansehen", to: "check" },
    secondary: { label: "Kennenlernen vereinbaren", to: "kontakt", query: { anliegen: "beratung" } },
    facts: ["KI-Check ab 990 € netto", "Pilot zum Festpreis, vorab schriftlich", "Unabhängig, ohne Lizenzverkauf"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Skizze: ein Ablauf von der Anfrage über Prüfung und Entwurf zur Freigabe durch eine Person",
      caption: "Erst der Ablauf, dann das Werkzeug. Die Freigabe bleibt bei Ihnen.",
      fig: "1.1",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "situationen",
      label: "Anlässe",
      h: "Wann Unternehmen zu uns kommen",
      lede: "Am Anfang steht meist kein Technikthema, sondern ein Ablauf, der zu viel Zeit kostet.",
      items: [
        {
          h: "Die Idee ist da, der Plan fehlt",
          p: "KI-Werkzeuge gibt es viele. Welches zu Ihren Abläufen passt und welches nur Aufwand erzeugt, ist offen.",
        },
        {
          h: "Das Team tippt, leitet weiter und fragt nach",
          p: "Aufgaben, die jeden Tag wiederkehren und kaum Urteilskraft brauchen, binden Zeit, die an anderer Stelle fehlt.",
        },
        {
          h: "Ein Versuch ist im Sand verlaufen",
          p: "Ein Tool wurde getestet, aber nie in den Alltag übernommen. Niemand pflegt es, niemand weiß, was es kann.",
        },
        {
          h: "Einzelne nutzen KI, ohne gemeinsame Regeln",
          p: "Was mit Kundendaten erlaubt ist und was nicht, hat niemand festgelegt. Das ist ein Risiko und eine verpasste Chance.",
        },
      ],
    },
    {
      t: "process",
      id: "methode",
      label: "Methode",
      h: "Von Ihrem Ablauf zur laufenden Lösung",
      lede: "Nach jedem Schritt halten wir das Ergebnis schriftlich fest, und Sie entscheiden, ob es weitergeht.",
      cta: { label: "Den KI-Check ansehen", to: "check" },
      steps: [
        {
          name: "Aufnehmen",
          h: "Den Ablauf verstehen",
          p: "Wir sprechen mit den Menschen, die die Arbeit machen, und beschreiben, wie der Ablauf heute wirklich läuft.",
          result: "Der Ablauf steht schriftlich da, mit seinen Ausnahmen.",
          meta: "im KI-Check",
        },
        {
          name: "Bewerten",
          h: "Entscheiden, was sich lohnt",
          p: "Wir ordnen die Abläufe nach Nutzen, Aufwand und Risiko ein. Manches automatisieren wir mit KI, manches ohne, manches gar nicht.",
          result: "Eine Empfehlung pro Ablauf, auch wenn sie lautet: besser nicht.",
          meta: "im KI-Check",
        },
        {
          name: "Pilotieren",
          h: "Einen Ablauf live nehmen",
          p: "Wir bauen die Lösung für einen Ablauf und lassen sie im Alltag laufen. Umfang und Festpreis stehen vorab schriftlich fest.",
          result: "Eine laufende, dokumentierte Lösung.",
          meta: "Pilot zum Festpreis",
        },
        {
          name: "Übergeben",
          h: "Einführen und weitergeben",
          p: "Ihr Team lernt die Lösung kennen. Auf Wunsch betreuen wir sie weiter, sonst übergeben wir sie mit Dokumentation.",
          result: "Sie entscheiden, wer die Lösung betreibt.",
          meta: "Betrieb und Ausbau",
        },
      ],
    },
    {
      t: "offers",
      id: "angebot",
      label: "Angebot",
      h: "Vier Stufen. Sie bestimmen, wie weit es geht",
      lede: "Keine Stufe verpflichtet zur nächsten.",
      items: [
        {
          name: "Kennenlernen",
          price: "kostenlos",
          unit: "unverbindlich",
          p: "Ein kurzes Gespräch, in dem wir Ihre Lage verstehen und klären, ob ein KI-Check sinnvoll ist.",
          points: ["30 Minuten", "Auch die Antwort „noch nicht“ ist ein Ergebnis"],
          href: { label: "Gespräch anfragen", to: "kontakt", query: { anliegen: "beratung" } },
        },
        {
          name: "KI-Check",
          price: "ab 990 € netto",
          p: "90 Minuten remote mit den Menschen, die die Arbeit machen, plus schriftlicher Kurzbericht. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an.",
          points: ["NDA vor der Analyse", "Bericht auch ohne Empfehlung", "Erweiterter Umfang zum Festpreis"],
          href: { label: "Zum KI-Check", to: "check" },
          featured: true,
        },
        {
          name: "Pilot",
          price: "Festpreis",
          unit: "vorab schriftlich",
          p: "Ein Ablauf, live im Alltag. Wir legen Umfang, Termin und Preis fest, bevor die Arbeit beginnt.",
          points: ["Ein klar abgegrenzter Ablauf", "Nachträge nur nach Ihrer Zustimmung"],
          href: { label: "Pilot besprechen", to: "kontakt", query: { anliegen: "beratung" } },
        },
        {
          name: "Betrieb und Ausbau",
          price: "monatlich",
          unit: "nach Vereinbarung",
          p: "Wir betreuen die Lösung weiter und bauen sie aus.",
          points: ["Betreuung nur auf Wunsch", "Weitere Abläufe Schritt für Schritt", "Übergabe jederzeit möglich"],
          href: { label: "Betrieb besprechen", to: "kontakt", query: { anliegen: "beratung" } },
        },
      ],
      footnote: "Alle Preise netto zzgl. USt., nur für Unternehmen. Wir prüfen mit Ihnen, welche Förderung zu Ihrem Vorhaben passt.",
    },
    {
      t: "rows",
      id: "automatisieren",
      label: "Was wir automatisieren",
      h: "Was wir für Sie automatisieren",
      lede: "Wir setzen ein, was zu Ihnen passt: Microsoft 365, Power Automate, SharePoint, n8n, Make, Python sowie Anbindungen an Ihr CRM oder ERP.",
      items: [
        {
          h: "Abläufe und Dokumente",
          p: "Anfragen sortieren, Daten übertragen, Rechnungen und Formulare auslesen, Berichte erstellen. Ihre Systeme bleiben, wir verbinden sie.",
          href: { label: "Prozessautomatisierung", to: "prozess" },
        },
        {
          h: "Microsoft 365 und Copilot",
          p: "Outlook, Teams, SharePoint und Power Automate so einrichten, dass wiederkehrende Arbeit von allein läuft und Copilot im Team ankommt.",
          href: { label: "Microsoft 365", to: "m365" },
        },
        {
          h: "Telefon- und Chat-Assistenten",
          p: "KI-Assistenten, die Standardfragen beantworten, Anliegen aufnehmen und an Ihr Team übergeben, sobald ein Mensch gefragt ist.",
          href: { label: "KI-Assistenten", to: "agenten" },
        },
        {
          h: "Anwendungsfälle nach Branche",
          p: "Beispiele für Dienstleistung, Gastronomie und Hotellerie, Handel sowie Praxen (ohne Gesundheitsdaten), mit dem, was jeweils beim Menschen bleibt.",
          href: { label: "Anwendungsfälle", to: "anwendungen" },
        },
      ],
    },
    {
      t: "sample",
      id: "muster",
      label: "Muster",
      h: "So kann das Ergebnis eines KI-Checks aussehen",
      lede: "Eine Empfehlung pro Ablauf, mit Begründung. Auch „manuell lassen“ ist eine Empfehlung.",
      mark: "Muster",
      title: "Ergebnis KI-Check (Auszug)",
      meta: "Dienstleistungsunternehmen, fiktives Beispiel",
      rows: [
        ["Eingehende Anfragen sortieren", "Automatisieren"],
        ["Terminbestätigungen versenden", "Automatisieren"],
        ["Angebote erstellen", "Teilautomatisieren"],
        ["Reklamationen bearbeiten", "Manuell lassen"],
        ["Monatliche Auswertung", "Später prüfen"],
      ],
      foot: "Ein echter Bericht enthält Ihre Abläufe, die Begründung je Empfehlung und die nächsten Schritte. Bei Angeboten bleibt die Freigabe beim Vertrieb.",
    },
    {
      t: "principles",
      id: "zusagen",
      label: "Zusagen",
      h: "Vier Zusagen für jede Zusammenarbeit",
      items: [
        {
          h: "Unabhängig",
          p: "Wir verkaufen keine KI-Lizenzen und keine Software. Wir empfehlen, was zu Ihnen passt, auch das, was Sie schon haben.",
        },
        {
          h: "Der Mensch entscheidet",
          p: "Freigaben, Ausnahmen und Kundenkontakt bleiben bei Ihrem Team. Jeder Assistent hat klare Grenzen, übergibt an einen Menschen und gibt sich als KI zu erkennen.",
        },
        {
          h: "Dokumentiert und übergeben",
          p: "Dokumentation und Zugänge gehören Ihnen, bei individuell gebauten Automatisierungen auch der Quellcode.",
        },
        {
          h: "Ehrlich bei „lohnt sich nicht“",
          p: "Wenn Automatisierung sich nicht trägt, steht das im Bericht, mit Begründung. Dann bauen wir nichts.",
        },
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Fragen zur KI-Beratung",
    items: [
      {
        q: "Brauchen wir überhaupt KI?",
        a: "Nicht immer. Oft reicht eine saubere Automatisierung ohne KI. Das klären wir im KI-Check, bevor Sie etwas kaufen.",
      },
      {
        q: "Was kostet ein Pilot?",
        a: "Das hängt vom Ablauf ab. Nach dem KI-Check legen wir Umfang und Festpreis schriftlich fest, bevor die Arbeit beginnt. Der KI-Check selbst kostet ab 990 € netto. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an.",
      },
      {
        q: "Wie steht es um den Datenschutz?",
        a: "Wir zeigen vor dem Start, wo Daten verarbeitet werden, und schließen die nötigen Verträge (AVV). Die abschließende Bewertung trifft Ihr Datenschutzbeauftragter oder Ihre Rechtsberatung.",
      },
      {
        q: "Was, wenn sich nichts lohnt?",
        a: "Dann steht genau das im Bericht, mit Begründung. Sie erhalten ihn auch dann.",
      },
      {
        q: "Wie lange dauert es?",
        a: "Der KI-Check besteht aus einem Gespräch von 90 Minuten und einem kurzen schriftlichen Bericht. Die Dauer eines Piloten legen wir zusammen mit dem Festpreis schriftlich fest.",
      },
      {
        q: "Können wir unsere Systeme behalten?",
        a: "Ja. Wo Microsoft 365, Google Workspace, Ihr CRM oder ERP den Ablauf tragen, bauen wir darauf auf und ersetzen nichts, was funktioniert.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Beginnen Sie mit dem KI-Check",
    p: "90 Minuten remote plus schriftlicher Kurzbericht, ab 990 € netto. NDA vor der Analyse, keine Bindung danach.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Erst kennenlernen", to: "kontakt", query: { anliegen: "beratung" } },
  },
  schema: {
    service: {
      name: "KI-Beratung und KI-Automatisierung",
      serviceType: "KI-Beratung",
      description:
        "KI-Beratung für Unternehmen, die bei den Abläufen beginnt: KI-Check, Pilot zum Festpreis, Betrieb und Ausbau. Unabhängig, ohne Lizenzverkauf.",
      offers: [{ name: "KI-Check", price: 990, from: true }],
    },
  },
};

const en: PageDef = {
  key: "beratung",
  meta: {
    title: "AI automation consulting for companies",
    description:
      "AI automation consulting that starts with your workflows: AI check from €990 net, pilot at a fixed price, operation by agreement. Independent, no licence sales.",
  },
  crumbs: [],
  crumb: "AI consulting",
  hero: {
    eyebrow: "AI consulting · AI automation",
    h1: ["AI consulting that starts with your ", "workflows", ""],
    lede: "OpSolid advises companies on automating work with AI. We first record how the work runs today, decide with you what is worth doing, and build a solution that runs day to day.",
    primary: { label: "See the AI check", to: "check" },
    secondary: { label: "Arrange an intro call", to: "kontakt", query: { anliegen: "beratung" } },
    facts: ["AI check from €990 net", "Pilot at a fixed price, in writing first", "Independent, no licence sales"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Sketch: a flow from an enquiry through review and draft to approval by a person",
      caption: "Process first, tool second. Approval stays with you.",
      fig: "1.1",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "situationen",
      label: "Triggers",
      h: "When companies come to us",
      lede: "The starting point is rarely a technology question, but a workflow that costs too much time.",
      items: [
        {
          h: "The idea is there, the plan is not",
          p: "There are many AI tools. Which one fits your workflows, and which one only creates effort, is unclear.",
        },
        {
          h: "The team types, forwards and chases",
          p: "Tasks that recur every day and need little judgement tie up time that is missing elsewhere.",
        },
        {
          h: "An attempt fizzled out",
          p: "A tool was tried but never made part of daily work. Nobody maintains it, nobody knows what it can do.",
        },
        {
          h: "Individuals use AI without shared rules",
          p: "What is allowed with customer data has not been decided. That is a risk and a missed opportunity.",
        },
      ],
    },
    {
      t: "process",
      id: "methode",
      label: "Method",
      h: "From your workflow to a running solution",
      lede: "After each step we put the result in writing, and you decide whether to continue.",
      cta: { label: "See the AI check", to: "check" },
      steps: [
        {
          name: "Record",
          h: "Understand the workflow",
          p: "We talk to the people who do the work and describe how the workflow really runs today.",
          result: "The workflow is written down, including its exceptions.",
          meta: "in the AI check",
        },
        {
          name: "Assess",
          h: "Decide what is worth it",
          p: "We rate workflows by benefit, effort and risk. Some we automate with AI, some without, some not at all.",
          result: "A recommendation per workflow, even when it says: better not.",
          meta: "in the AI check",
        },
        {
          name: "Pilot",
          h: "Take one workflow live",
          p: "We build the solution for one workflow and let it run in daily work. Scope and fixed price are set in writing beforehand.",
          result: "A running, documented solution.",
          meta: "pilot at a fixed price",
        },
        {
          name: "Hand over",
          h: "Introduce and pass on",
          p: "Your team gets to know the solution. If you wish we keep running it, otherwise we hand it over with documentation.",
          result: "You decide who operates the solution.",
          meta: "operation and expansion",
        },
      ],
    },
    {
      t: "offers",
      id: "angebot",
      label: "Offer",
      h: "Four steps. You decide how far to go",
      lede: "No step obliges you to take the next.",
      items: [
        {
          name: "Intro call",
          price: "free",
          unit: "no obligation",
          p: "A short conversation in which we understand your situation and clarify whether an AI check makes sense.",
          points: ["30 minutes", "“Not yet” is also a result"],
          href: { label: "Request a call", to: "kontakt", query: { anliegen: "beratung" } },
        },
        {
          name: "AI check",
          price: "from €990 net",
          p: "90 minutes remote with the people who do the work, plus a short written report. Credited in full against a follow-up order within 60 days.",
          points: ["NDA before the analysis", "Report even without a recommendation", "Extended scope at a fixed price"],
          href: { label: "To the AI check", to: "check" },
          featured: true,
        },
        {
          name: "Pilot",
          price: "Fixed price",
          unit: "in writing first",
          p: "One workflow, live in daily work. We set scope, date and price before the work begins.",
          points: ["One clearly bounded workflow", "Extras only with your approval"],
          href: { label: "Discuss a pilot", to: "kontakt", query: { anliegen: "beratung" } },
        },
        {
          name: "Operation and expansion",
          price: "monthly",
          unit: "by agreement",
          p: "We keep running the solution and extend it.",
          points: ["Support only on request", "More workflows step by step", "Handover possible at any time"],
          href: { label: "Discuss operation", to: "kontakt", query: { anliegen: "beratung" } },
        },
      ],
      footnote: "All prices are net of VAT and for businesses only. We check with you which funding fits your project.",
    },
    {
      t: "rows",
      id: "automatisieren",
      label: "What we automate",
      h: "What we automate for you",
      lede: "We use what fits you: Microsoft 365, Power Automate, SharePoint, n8n, Make, Python and connections to your CRM or ERP.",
      items: [
        {
          h: "Workflows and documents",
          p: "Sort enquiries, transfer data, read invoices and forms, create reports. Your systems stay, we connect them.",
          href: { label: "Process automation", to: "prozess" },
        },
        {
          h: "Microsoft 365 and Copilot",
          p: "Set up Outlook, Teams, SharePoint and Power Automate so recurring work runs by itself and Copilot lands in the team.",
          href: { label: "Microsoft 365", to: "m365" },
        },
        {
          h: "Phone and chat assistants",
          p: "AI assistants that answer standard questions, take down requests and hand over to your team as soon as a person is needed.",
          href: { label: "AI assistants", to: "agenten" },
        },
        {
          h: "Use cases by sector",
          p: "Examples for services, hospitality, retail and practices (without health data), with what stays with people in each case.",
          href: { label: "Use cases", to: "anwendungen" },
        },
      ],
    },
    {
      t: "sample",
      id: "muster",
      label: "Sample",
      h: "What the result of an AI check can look like",
      lede: "One recommendation per workflow, with reasoning. “Keep manual” is a recommendation too.",
      mark: "Sample",
      title: "AI check result (excerpt)",
      meta: "Service company, fictional example",
      rows: [
        ["Sort incoming enquiries", "Automate"],
        ["Send appointment confirmations", "Automate"],
        ["Prepare quotes", "Partly automate"],
        ["Handle complaints", "Keep manual"],
        ["Monthly reporting", "Review later"],
      ],
      foot: "A real report contains your workflows, the reasoning for each recommendation and the next steps. For quotes, approval stays with sales.",
    },
    {
      t: "principles",
      id: "zusagen",
      label: "Commitments",
      h: "Four commitments for every engagement",
      items: [
        {
          h: "Independent",
          p: "We do not sell AI licences or software. We recommend what fits you, including what you already have.",
        },
        {
          h: "People decide",
          p: "Approvals, exceptions and customer contact stay with your team. Every assistant has clear limits, hands over to a person and discloses that it is an AI.",
        },
        {
          h: "Documented and handed over",
          p: "Documentation and access belong to you, and for custom-built automations the source code too.",
        },
        {
          h: "Honest when it is not worth it",
          p: "If automation does not pay off, the report says so, with reasons. Then we build nothing.",
        },
      ],
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Questions about AI consulting",
    items: [
      {
        q: "Do we need AI at all?",
        a: "Not always. Often clean automation without AI is enough. We clarify this in the AI check, before you buy anything.",
      },
      {
        q: "What does a pilot cost?",
        a: "That depends on the workflow. After the AI check we set scope and fixed price in writing before the work begins. The AI check itself costs from €990 net. Credited in full against a follow-up order within 60 days.",
      },
      {
        q: "What about data protection?",
        a: "Before we start we show where data is processed and sign the necessary agreements (DPA). The final assessment is made by your data protection officer or legal adviser.",
      },
      {
        q: "What if nothing is worth doing?",
        a: "Then the report says exactly that, with reasons. You still get the report.",
      },
      {
        q: "How long does it take?",
        a: "The AI check is one 90-minute conversation and a short written report. We set the duration of a pilot in writing together with the fixed price.",
      },
      {
        q: "Can we keep our systems?",
        a: "Yes. Where Microsoft 365, Google Workspace, your CRM or ERP carry the workflow, we build on them and replace nothing that works.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Start with the AI check",
    p: "90 minutes remote plus a short written report, from €990 net. NDA before the analysis, no obligation afterwards.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Intro call first", to: "kontakt", query: { anliegen: "beratung" } },
  },
  schema: {
    service: {
      name: "AI automation consulting",
      serviceType: "AI consulting",
      description:
        "AI consulting for companies that starts with the workflows: AI check, pilot at a fixed price, operation and expansion. Independent, no licence sales.",
      offers: [{ name: "AI check", price: 990, from: true }],
    },
  },
};

const tr: PageDef = {
  key: "beratung",
  meta: {
    title: "Şirketler için yapay zeka danışmanlığı ve otomasyon",
    description:
      "İş akışlarınızdan başlayan yapay zeka danışmanlığı: YZ Kontrolü 990 €'dan (net), sabit fiyatlı pilot, anlaşmaya göre işletme. Bağımsız, lisans satışı yok.",
  },
  crumbs: [],
  crumb: "YZ danışmanlığı",
  hero: {
    eyebrow: "YZ danışmanlığı · YZ otomasyonu",
    h1: ["İş akışlarınızdan ", "başlayan", " yapay zeka danışmanlığı"],
    lede: "OpSolid, şirketlerin işlerini yapay zekayla otomatikleştirmesi için danışmanlık verir. Önce işin bugün nasıl yürüdüğünü kaydeder, neyin değer taşıdığına sizinle birlikte karar verir ve günlük işte çalışan bir çözüm kurarız.",
    primary: { label: "YZ Kontrolü'nü inceleyin", to: "check" },
    secondary: { label: "Tanışma görüşmesi planlayın", to: "kontakt", query: { anliegen: "beratung" } },
    facts: ["YZ Kontrolü 990 €'dan itibaren (net)", "Sabit fiyatlı pilot, önceden yazılı", "Bağımsız, lisans satışı yok"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Çizim: bir talepten inceleme ve taslak aşamalarından geçerek bir kişinin onayına uzanan akış",
      caption: "Önce süreç, sonra araç. Onay sizde kalır.",
      fig: "1.1",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "situationen",
      label: "Durumlar",
      h: "Şirketler bize ne zaman gelir?",
      lede: "Başlangıçta çoğu zaman bir teknoloji sorusu değil, çok zaman alan bir iş akışı vardır.",
      items: [
        {
          h: "Fikir var, plan yok",
          p: "Çok sayıda YZ aracı var. Hangisinin iş akışlarınıza uyduğu, hangisinin yalnızca yük getireceği belirsiz.",
        },
        {
          h: "Ekip yazıyor, iletiyor, tekrar soruyor",
          p: "Her gün tekrarlanan ve pek muhakeme gerektirmeyen işler, başka yerde eksik kalan zamanı bağlıyor.",
        },
        {
          h: "Bir deneme yarıda kaldı",
          p: "Bir araç denendi ama günlük işe hiç oturmadı. Onu kimse bakımda tutmuyor, ne yapabildiğini kimse bilmiyor.",
        },
        {
          h: "Bazı kişiler YZ kullanıyor, ortak kural yok",
          p: "Müşteri verileriyle neyin serbest olduğunu kimse belirlememiş. Bu hem bir risk hem de kaçırılmış bir fırsat.",
        },
      ],
    },
    {
      t: "process",
      id: "methode",
      label: "Yöntem",
      h: "İş akışınızdan çalışan çözüme",
      lede: "Her adımdan sonra sonucu yazılı olarak kaydederiz; devam edip etmeyeceğinize siz karar verirsiniz.",
      cta: { label: "YZ Kontrolü'nü inceleyin", to: "check" },
      steps: [
        {
          name: "Kaydetmek",
          h: "İş akışını anlamak",
          p: "İşi yapan kişilerle konuşur ve iş akışının bugün gerçekte nasıl yürüdüğünü tarif ederiz.",
          result: "İş akışı, istisnalarıyla birlikte yazılı olarak ortada.",
          meta: "YZ Kontrolü içinde",
        },
        {
          name: "Değerlendirmek",
          h: "Neyin değdiğine karar vermek",
          p: "İş akışlarını fayda, efor ve riske göre sıralarız. Bazılarını YZ ile, bazılarını YZ olmadan otomatikleştiririz; bazılarına hiç dokunmayız.",
          result: "Her iş akışı için bir öneri; öneri “daha iyisi yapmamak” olsa bile.",
          meta: "YZ Kontrolü içinde",
        },
        {
          name: "Pilot",
          h: "Bir iş akışını canlıya almak",
          p: "Bir iş akışı için çözümü kurar ve günlük işte çalıştırırız. Kapsam ve sabit fiyat önceden yazılı olarak belirlenir.",
          result: "Çalışan, belgelenmiş bir çözüm.",
          meta: "sabit fiyatlı pilot",
        },
        {
          name: "Devretmek",
          h: "Devreye almak ve teslim etmek",
          p: "Ekibiniz çözümü tanır. İsterseniz çözümü işletmeye devam ederiz; istemezseniz belgeleriyle teslim ederiz.",
          result: "Çözümü kimin işleteceğine siz karar verirsiniz.",
          meta: "işletme ve geliştirme",
        },
      ],
    },
    {
      t: "offers",
      id: "angebot",
      label: "Teklif",
      h: "Dört basamak. Ne kadar ileri gideceğinize siz karar verirsiniz",
      lede: "Hiçbir basamak sizi bir sonrakine zorlamaz.",
      items: [
        {
          name: "Tanışma",
          price: "ücretsiz",
          unit: "bağlayıcı değil",
          p: "Durumunuzu anladığımız ve bir YZ Kontrolü'nün anlamlı olup olmadığını netleştirdiğimiz kısa bir görüşme.",
          points: ["30 dakika", "“Henüz değil” cevabı da bir sonuçtur"],
          href: { label: "Görüşme talep edin", to: "kontakt", query: { anliegen: "beratung" } },
        },
        {
          name: "YZ Kontrolü",
          price: "990 €'dan itibaren (net)",
          p: "İşi yapan kişilerle 90 dakika uzaktan görüşme ve kısa bir yazılı rapor. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir.",
          points: ["Analizden önce NDA", "Öneri çıkmasa da rapor", "Geniş kapsam sabit fiyatla"],
          href: { label: "YZ Kontrolü'ne gidin", to: "check" },
          featured: true,
        },
        {
          name: "Pilot",
          price: "Sabit fiyat",
          unit: "önceden yazılı",
          p: "Bir iş akışı, günlük işte canlı. Çalışma başlamadan önce kapsamı, tarihi ve fiyatı belirleriz.",
          points: ["Net sınırları olan tek bir iş akışı", "Ek ücret yalnızca onayınızla"],
          href: { label: "Pilotu görüşün", to: "kontakt", query: { anliegen: "beratung" } },
        },
        {
          name: "İşletme ve geliştirme",
          price: "aylık",
          unit: "anlaşmaya göre",
          p: "Çözümü işletmeye ve geliştirmeye devam ederiz.",
          points: ["Destek yalnızca isteğe bağlı", "Diğer iş akışları adım adım", "Devir her zaman mümkün"],
          href: { label: "İşletmeyi görüşün", to: "kontakt", query: { anliegen: "beratung" } },
        },
      ],
      footnote: "Tüm fiyatlar net, KDV hariçtir ve yalnızca işletmeler içindir. Projenize hangi teşvikin uyduğunu sizinle birlikte değerlendiririz.",
    },
    {
      t: "rows",
      id: "automatisieren",
      label: "Neyi otomatikleştiriyoruz",
      h: "Sizin için neyi otomatikleştiriyoruz?",
      lede: "Size uyanı kullanırız: Microsoft 365, Power Automate, SharePoint, n8n, Make, Python ve CRM ya da ERP bağlantıları.",
      items: [
        {
          h: "İş akışları ve belgeler",
          p: "Talepleri sıralamak, veri aktarmak, fatura ve formları okumak, rapor üretmek. Sistemleriniz yerinde kalır, biz onları birbirine bağlarız.",
          href: { label: "Süreç otomasyonu", to: "prozess" },
        },
        {
          h: "Microsoft 365 ve Copilot",
          p: "Outlook, Teams, SharePoint ve Power Automate'i, tekrarlayan işler kendiliğinden yürüsün ve Copilot ekipte karşılık bulsun diye kurmak.",
          href: { label: "Microsoft 365", to: "m365" },
        },
        {
          h: "Telefon ve sohbet asistanları",
          p: "Standart soruları yanıtlayan, talepleri alan ve bir insan gerektiği anda ekibinize devreden YZ asistanları.",
          href: { label: "YZ asistanları", to: "agenten" },
        },
        {
          h: "Sektöre göre kullanım örnekleri",
          p: "Hizmet, yeme-içme ve konaklama, perakende ile muayenehaneler (sağlık verisi olmadan) için örnekler; her birinde insanda neyin kaldığıyla birlikte.",
          href: { label: "Kullanım örnekleri", to: "anwendungen" },
        },
      ],
    },
    {
      t: "sample",
      id: "muster",
      label: "Örnek",
      h: "Bir YZ Kontrolü sonucu nasıl görünebilir?",
      lede: "Her iş akışı için gerekçeli bir öneri. “Manuel kalsın” da bir öneridir.",
      mark: "Örnek",
      title: "YZ Kontrolü sonucu (özet)",
      meta: "Bir hizmet şirketi, kurgusal örnek",
      rows: [
        ["Gelen talepleri sıralamak", "Otomatikleştirin"],
        ["Randevu onaylarını göndermek", "Otomatikleştirin"],
        ["Teklif hazırlamak", "Kısmen otomatikleştirin"],
        ["Şikâyetleri işlemek", "Manuel kalsın"],
        ["Aylık değerlendirme", "Sonra değerlendirin"],
      ],
      foot: "Gerçek bir rapor sizin iş akışlarınızı, her öneri için gerekçeyi ve sonraki adımları içerir. Tekliflerde onay satışta kalır.",
    },
    {
      t: "principles",
      id: "zusagen",
      label: "Taahhütler",
      h: "Her iş birliği için dört taahhüt",
      items: [
        {
          h: "Bağımsızız",
          p: "YZ lisansı ya da yazılım satmayız. Size uyanı öneririz; elinizde zaten olanı da.",
        },
        {
          h: "Kararı insan verir",
          p: "Onaylar, istisnalar ve müşteri iletişimi ekibinizde kalır. Her asistanın net sınırları vardır, gerektiğinde bir insana devreder ve YZ olduğunu belirtir.",
        },
        {
          h: "Belgelenir ve teslim edilir",
          p: "Belgeler ve erişimler size aittir; özel geliştirilen otomasyonlarda kaynak kod da.",
        },
        {
          h: "“Değmez” dediğinde dürüst",
          p: "Otomasyon kendini karşılamıyorsa rapor bunu gerekçesiyle söyler. O zaman hiçbir şey kurmayız.",
        },
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "YZ danışmanlığı hakkında sorular",
    items: [
      {
        q: "Bizim gerçekten YZ'ye ihtiyacımız var mı?",
        a: "Her zaman değil. Çoğu zaman YZ olmadan düzgün bir otomasyon yeter. Bunu bir şey satın almadan önce YZ Kontrolü'nde netleştiririz.",
      },
      {
        q: "Bir pilotun maliyeti nedir?",
        a: "İş akışına bağlıdır. YZ Kontrolü'nden sonra, çalışma başlamadan önce kapsamı ve sabit fiyatı yazılı olarak belirleriz. YZ Kontrolü'nün kendisi 990 €'dan itibaren (net). 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir.",
      },
      {
        q: "Veri koruma nasıl ele alınıyor?",
        a: "Başlamadan önce verilerin nerede işlendiğini gösterir, gerekli sözleşmeleri (AVV) yaparız. Nihai değerlendirmeyi veri koruma görevliniz veya hukuk danışmanınız yapar.",
      },
      {
        q: "Hiçbir şey değmezse ne olur?",
        a: "O zaman rapor tam olarak bunu gerekçesiyle söyler. Raporu yine alırsınız.",
      },
      {
        q: "Ne kadar sürer?",
        a: "YZ Kontrolü, 90 dakikalık bir görüşme ile kısa bir yazılı rapordan oluşur. Pilotun süresini sabit fiyatla birlikte yazılı olarak belirleriz.",
      },
      {
        q: "Mevcut sistemlerimizi koruyabilir miyiz?",
        a: "Evet. İş akışını Microsoft 365, Google Workspace, CRM'iniz ya da ERP'niz taşıyorsa onların üzerine kurarız; işleyen hiçbir şeyi değiştirmeyiz.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "YZ Kontrolü ile başlayın",
    p: "90 dakika uzaktan görüşme ve kısa yazılı rapor, 990 €'dan itibaren (net). Analizden önce NDA, sonrasında yükümlülük yok.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Önce tanışalım", to: "kontakt", query: { anliegen: "beratung" } },
  },
  schema: {
    service: {
      name: "Yapay zeka danışmanlığı ve otomasyonu",
      serviceType: "Yapay zeka danışmanlığı",
      description:
        "İş akışlarından başlayan şirketler için yapay zeka danışmanlığı: YZ Kontrolü, sabit fiyatlı pilot, işletme ve geliştirme. Bağımsız, lisans satışı yok.",
      offers: [{ name: "YZ Kontrolü", price: 990, from: true }],
    },
  },
};

export const page: PageSet = { de, en, tr };
