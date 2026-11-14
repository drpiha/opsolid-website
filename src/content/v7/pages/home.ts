/**
 * Home page (direction A "Klarheit"). Trainings lead (owner decision 27, 2026-11-06): the first section is the
 * ledger of the three team trainings with the team price, the per-person arithmetic and the hours; then the
 * booking process, the band "Unsicher, welche Schulung passt?" pointing at the free enquiry, and the KI-Check as
 * the paid entry whose report ends with a training recommendation. No OpSo or own-work section (owner,
 * 2026-11-14: the site must not list itself; OpSo lives in the footer and on About). Each fact is said once in
 * its place (format and certificate in the hero strip, the "no certificate required" line in the FAQ). German
 * is the source; no founder name or location outside About/Contact/footer, no trainer names, no certificate
 * claims beyond our own Teilnahmebescheinigung.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "home",
  meta: {
    title: "OpSolid: KI-Schulungen und KI-Beratung für Unternehmen",
    description:
      "KI-Schulungen für Ihr Team: online, live in Ihrem Microsoft Teams, pro Team ab 1.790 € netto, mit Teilnahmebescheinigung. Dazu der KI-Check, 990 € netto.",
  },
  crumbs: [],
  crumb: "Start",
  hero: {
    eyebrow: "KI-Schulungen für Unternehmen",
    h1: ["KI-Schulungen,", "live", " an Ihren Aufgaben"],
    lede: "Ihr Team lernt, KI sicher und sinnvoll einzusetzen, in einem geschlossenen Termin nur für Sie.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Schulungen und Preise", to: "home", hash: "schulungen" },
    strip: [
      ["Preis", "Pro Team ab 1.790 € netto"],
      ["Format", "Online, live, in Microsoft Teams"],
      ["Nach der Schulung", "Teilnahme\u00ADbescheinigung"],
      ["Sprache", "Deutsch oder Englisch"],
    ],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Skizze: ineinander liegende abgerundete Quadrate über einem Ablauf in vier Stationen: Aufgaben, Übung, Regeln, Bescheinigung",
      caption: "Von Ihren Aufgaben über Übung und Regeln zur Bescheinigung.",
      fig: "0.1",
      labels: ["Aufgaben", "Übung", "Regeln", "Bescheinigung"],
    },
  },
  blocks: [
    {
      t: "courses",
      id: "schulungen",
      label: "Schulungen",
      note: "Preis pro Team, nicht pro Person.",
      h: "Drei Schulungen, pro Team gebucht",
      lede: "Vom halben Tag Grundlagen bis zu zwei Tagen KI-Agenten, auf Deutsch oder Englisch. Jedes Team übt an Beispielen aus dem eigenen Alltag.",
      cta: { label: "Alle KI-Schulungen im Detail", to: "schulungen" },
      items: [
        {
          name: "KI-Kompetenz Basis",
          status: "bookable",
          statusLabel: "Termin auf Anfrage",
          format: "Halber Tag, 3,5 Stunden · 10 Personen inklusive, bis 15",
          p: "Grundlagen, Risiken, Datenschutz und klare Regeln für den Umgang mit KI im Team.",
          price: "ab 1.790 €",
          unit: "netto pro Team",
          arith: ["Rechnerisch 179 € pro Person bei 10 Personen", "Jede weitere Person 90 €"],
          href: { label: "Zur Schulung", to: "kompetenz" },
        },
        {
          name: "Microsoft 365 Copilot Praxistag",
          status: "bookable",
          statusLabel: "Termin auf Anfrage",
          format: "1 Tag, 6 Stunden · 10 Personen inklusive, bis 12",
          p: "Copilot in Outlook, Teams, Word, Excel und PowerPoint, geübt an Ihren eigenen Aufgaben.",
          price: "ab 2.900 €",
          unit: "netto pro Team",
          arith: ["Rechnerisch 290 € pro Person bei 10 Personen", "Jede weitere Person 150 €"],
          href: { label: "Zum Praxistag", to: "copilot" },
        },
        {
          name: "KI-Agenten & Workflow-Automatisierung",
          status: "bookable",
          statusLabel: "Termin auf Anfrage",
          format: "2 Tage · 8 Personen inklusive, bis 10",
          p: "KI-Agenten und automatisierte Workflows aufbauen. Die Agenda der zwei Tage stimmen wir vorab mit Ihrem Team ab.",
          price: "ab 5.900 €",
          unit: "netto pro Team",
          arith: ["Jede weitere Person 290 €"],
          href: { label: "Agenda anfragen", to: "kontakt", query: { anliegen: "schulung" } },
        },
      ],
      footnote:
        "Alle Preise netto zzgl. USt., nur für Unternehmen. Unternehmen, die KI einsetzen, ergreifen Maßnahmen, um die KI-Kompetenz ihrer Beschäftigten zu fördern (Art. 4 KI-Verordnung); eine Schulung mit Teilnahmebescheinigung ist eine nachvollziehbare Maßnahme. Keine Rechtsberatung.",
    },
    {
      t: "process",
      id: "ablauf",
      label: "Ablauf",
      h: "Von der Anfrage zur Bescheinigung",
      lede: "Vier Schritte, jeder mit einem Ergebnis. Nach jedem entscheiden Sie, ob es weitergeht.",
      cta: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
      steps: [
        {
          name: "Anfrage",
          h: "Team und Aufgaben",
          p: "Sie schildern uns per Formular Team, Aufgaben, Vorwissen und Sprache. Drei Sätze genügen.",
          result: "Wir empfehlen die passende Schulung und nennen den Preis pro Team.",
          meta: "kostenlos",
        },
        {
          name: "Angebot",
          h: "Trainer, Termin, Beispiele",
          p: "Wir stimmen Beispiele aus Ihrem Alltag, Teilnehmerzahl und Termin mit Ihnen ab. Die Trainerin oder den Trainer nennen wir Ihnen vor der Buchung namentlich.",
          result: "Ein schriftliches Angebot pro Team. Vertrag und Rechnung laufen über OpSolid.",
          meta: "vor der Buchung",
        },
        {
          name: "Schulung",
          h: "Live und online",
          p: "Ein geschlossener Termin nur für Ihr Team, live in Microsoft Teams. Geübt wird mit Beispieldaten, nie mit echten Kundendaten.",
          result: "Ihr Team hat an eigenen Aufgaben geübt und kennt die Regeln.",
          meta: "halber Tag bis zwei Tage",
        },
        {
          name: "Bescheinigung",
          h: "Teilnahmebescheinigung",
          p: "Wir stellen sie nach der Schulung aus, mit Datum, Dauer, Themen und Trainer.",
          result: "Eine nachvollziehbare Maßnahme für Ihre Unterlagen.",
          meta: "für Ihre Dokumentation",
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Leitsatz",
      text: "Unsicher, welche Schulung passt?",
      note: "Drei Sätze zu Team und Aufgaben genügen. Wir empfehlen die passende Schulung, kostenlos.",
      cta: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    },
    {
      t: "rows",
      id: "ki-check",
      label: "KI-Beratung",
      note: "Der bezahlte Einstieg, wenn die Richtung offen ist.",
      h: "Vom KI-Check zum eigenen Ablauf",
      lede: "Der schriftliche KI-Check zeigt, wo KI in Ihrem Alltag sinnvoll ist, und endet mit einer Schulungsempfehlung. Wer mehr will als Schulung, geht mit uns in den Pilot.",
      cta: { label: "Zur KI-Beratung", to: "beratung" },
      items: [
        {
          tag: "990 € netto · Festpreis",
          h: "KI-Check",
          p: "Fragebogen von etwa 20 Minuten, schriftlicher Bericht in der Regel 10 Werktage nach Eingang: drei Ideen nach Priorität, Risiken, Datenschutz und die Schulungsempfehlung für Ihr Team. NDA vor der Analyse. Bei einer Schulung oder einem Pilot innerhalb von 60 Tagen rechnen wir den Betrag voll an.",
          href: { label: "Zum KI-Check", to: "check" },
        },
        {
          tag: "Festpreis · vorab schriftlich",
          h: "Pilot",
          p: "Ein Ablauf aus dem Bericht, live im Alltag: Anfragen sortieren, Dokumente auslesen, Abläufe in Microsoft 365. Umfang, Termin und Preis stehen vor dem Start fest; Quellcode, Zugänge und Dokumentation gehören Ihnen.",
          href: { label: "Pilot besprechen", to: "kontakt", query: { anliegen: "beratung" } },
        },
        {
          tag: "monatlich · nach Vereinbarung",
          h: "Betrieb und Ausbau",
          p: "Wir betreuen die Lösung weiter oder übergeben sie mit Dokumentation an Ihr Team.",
        },
      ],
    },
    {
      t: "text",
      id: "ueber",
      label: "Über OpSolid",
      h: "Unabhängig von KI-Anbietern",
      lede: "Wir verkaufen keine KI-Lizenzen und keine Software. Wir empfehlen, was zu Ihrem Team und Ihren Abläufen passt.",
      paras: [
        "OpSolid organisiert KI-Schulungen im eigenen Namen, mit freiberuflichen Trainerinnen und Trainern, die wir selbst auswählen, und berät bei der Automatisierung mit KI. Umfang und Preis stehen vor jedem Auftrag schriftlich fest. Wir arbeiten für Dienstleistung, Gastronomie und Hotellerie, Handel und Praxen (ohne Gesundheitsdaten).",
      ],
      cta: { label: "Mehr über OpSolid", to: "ueber" },
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen",
    items: [
      {
        q: "Gilt der Preis pro Person?",
        a: "Nein, pro Team: bei KI-Kompetenz Basis sind 10 Personen inklusive (jede weitere 90 €, bis 15), beim Copilot-Praxistag 10 (jede weitere 150 €, bis 12), bei der KI-Agenten-Schulung 8 (jede weitere 290 €, bis 10). Rechnerisch sind das bei 10 Personen 179 € pro Person (KI-Kompetenz Basis) und 290 € pro Person (Copilot-Praxistag). Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Wo und wie findet die Schulung statt?",
        a: "Online und live, in Ihrem eigenen Microsoft Teams, auf Wunsch per Zoom. Ein halber Tag dauert 3,5 Stunden inklusive Pause, ein Tag 6 Stunden inklusive Pausen, auf Wunsch an zwei halben Tagen. Aufzeichnungen und Selbstlernkurse bieten wir nicht an.",
      },
      {
        q: "Bekommen wir ein Zertifikat?",
        a: "Ein Zertifikat ist nicht vorgeschrieben. Sie erhalten von uns eine eigene Teilnahmebescheinigung mit Datum, Dauer, Themen und Trainer. Sie ist kein Zertifikat einer Behörde, einer Kammer oder eines Verbands.",
      },
      {
        q: "Wer hält die Schulung?",
        a: "Freiberufliche Trainerinnen und Trainer, die wir auswählen. Wir nennen Ihnen die Person vor der Buchung namentlich. Vertrag und Rechnung laufen über OpSolid.",
      },
      {
        q: "Wie finden wir die passende Schulung?",
        a: "Mit einer kurzen Anfrage: Wir empfehlen die passende Schulung kostenlos. Ist offen, wo KI in Ihrem Betrieb sinnvoll ist, beginnen Sie mit dem KI-Check: 990 € netto als Festpreis, schriftlich per Fragebogen und Bericht, NDA vor der Analyse. Der Bericht endet mit einer Schulungsempfehlung. Buchen Sie innerhalb von 60 Tagen eine Schulung oder einen Pilot, rechnen wir den Betrag voll an.",
      },
      {
        q: "Brauchen wir dafür überhaupt KI?",
        a: "Nicht immer. Oft reicht eine saubere Automatisierung ohne KI, manchmal genügt eine Schulung mit klaren Regeln. Was zu Ihnen passt, klären wir im KI-Check.",
      },
    ],
  },
  cta: {
    label: "Schulung anfragen",
    h: "Welches Team soll sicherer mit KI arbeiten?",
    p: "Schreiben Sie uns kurz zu Team, Aufgaben und Sprache. Wir empfehlen die passende Schulung und nennen den Preis pro Team.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "info@opsolid.de", href: "mailto:info@opsolid.de" },
  },
  schema: {
    service: {
      name: "KI-Schulungen und KI-Beratung",
      serviceType: "KI-Schulungen",
      description: "KI-Schulungen für Teams (online, live, pro Team) und KI-Beratung für Unternehmen: KI-Check mit Schulungsempfehlung, Pilot zum Festpreis, Betrieb und Ausbau.",
      offers: [{ name: "KI-Check", price: 990 }],
    },
    courses: [
      {
        name: "KI-Kompetenz Basis",
        description:
          "Online-Schulung für Teams: Grundlagen, Risiken, Datenschutz und Regeln im Umgang mit KI. Halber Tag, bis zu 15 Personen, live auf Deutsch oder Englisch, mit Teilnahmebescheinigung.",
        price: 1790,
        from: true,
      },
      {
        name: "Microsoft 365 Copilot Praxistag",
        description:
          "Online-Praxistag für Teams: Microsoft 365 Copilot in Outlook, Teams, Word, Excel und PowerPoint an eigenen Aufgaben. 1 Tag, bis zu 12 Personen, live auf Deutsch oder Englisch.",
        price: 2900,
        from: true,
      },
      {
        name: "KI-Agenten & Workflow-Automatisierung",
        description:
          "Online-Schulung für Teams: KI-Agenten und automatisierte Workflows aufbauen, geübt an Abläufen aus dem Alltag. 2 Tage, bis zu 10 Personen, live auf Deutsch oder Englisch.",
        price: 5900,
        from: true,
      },
    ],
  },
};

const en: PageDef = {
  key: "home",
  meta: {
    title: "OpSolid: AI training and AI consulting for companies",
    description:
      "Live online AI training for your team in your own Microsoft Teams, from €1,790 net per team, with a participation record. Plus the AI check, €990 net.",
  },
  crumbs: [],
  crumb: "Home",
  hero: {
    eyebrow: "AI training for businesses",
    h1: ["AI training,", "live", " on your own tasks"],
    lede: "Your team learns to use AI safely and sensibly, in a closed session just for you.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Courses and prices", to: "home", hash: "schulungen" },
    strip: [
      ["Price", "From €1,790 net per team"],
      ["Format", "Online, live, in Microsoft Teams"],
      ["After the course", "Participation record"],
      ["Language", "English or German"],
    ],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Sketch: nested rounded squares above a workflow in four stations: tasks, practice, rules, record",
      caption: "From your tasks, through practice and rules, to the record.",
      fig: "0.1",
      labels: ["Tasks", "Practice", "Rules", "Record"],
    },
  },
  blocks: [
    {
      t: "courses",
      id: "schulungen",
      label: "Courses",
      note: "Priced per team, not per person.",
      h: "Three courses, booked per team",
      lede: "From a half day of fundamentals to two days on AI agents, in English or German. Every team practises on examples from its own daily work.",
      cta: { label: "All AI training in detail", to: "schulungen" },
      items: [
        {
          name: "AI literacy basics",
          status: "bookable",
          statusLabel: "Date on request",
          format: "Half day, 3.5 hours · 10 people included, up to 15",
          p: "Fundamentals, risks, data protection and clear rules for using AI as a team.",
          price: "from €1,790",
          unit: "net per team",
          arith: ["Works out at €179 per person with 10 people", "Each additional person €90"],
          href: { label: "View the course", to: "kompetenz" },
        },
        {
          name: "Microsoft 365 Copilot workshop",
          status: "bookable",
          statusLabel: "Date on request",
          format: "1 day, 6 hours · 10 people included, up to 12",
          p: "Copilot in Outlook, Teams, Word, Excel and PowerPoint, practised on your own tasks.",
          price: "from €2,900",
          unit: "net per team",
          arith: ["Works out at €290 per person with 10 people", "Each additional person €150"],
          href: { label: "View the workshop", to: "copilot" },
        },
        {
          name: "AI agents & workflow automation",
          status: "bookable",
          statusLabel: "Date on request",
          format: "2 days · 8 people included, up to 10",
          p: "Build AI agents and automated workflows. We agree the agenda for the two days with your team beforehand.",
          price: "from €5,900",
          unit: "net per team",
          arith: ["Each additional person €290"],
          href: { label: "Ask for the agenda", to: "kontakt", query: { anliegen: "schulung" } },
        },
      ],
      footnote:
        "All prices net of VAT, businesses only. Companies that use AI take measures to support their staff's AI literacy (Article 4 of the EU AI Act); a course with a participation record is one traceable measure. This is not legal advice.",
    },
    {
      t: "process",
      id: "ablauf",
      label: "Process",
      h: "From enquiry to participation record",
      lede: "Four steps, each with a result. After every step you decide whether to continue.",
      cta: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
      steps: [
        {
          name: "Enquiry",
          h: "Team and tasks",
          p: "Tell us via the form about your team, tasks, prior knowledge and language. Three sentences are enough.",
          result: "We recommend the right course and name the price per team.",
          meta: "free",
        },
        {
          name: "Offer",
          h: "Trainer, date, examples",
          p: "We agree examples from your daily work, group size and date with you. We name the trainer to you before you book.",
          result: "A written offer per team. Contract and invoice run through OpSolid.",
          meta: "before you book",
        },
        {
          name: "Course",
          h: "Live and online",
          p: "A closed session just for your team, live in Microsoft Teams. We practise with sample data, never with real customer data.",
          result: "Your team has practised on its own tasks and knows the rules.",
          meta: "half a day to two days",
        },
        {
          name: "Record",
          h: "Participation record",
          p: "We issue it after the course, with date, duration, topics and trainer.",
          result: "A traceable measure for your files.",
          meta: "for your documentation",
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Key point",
      text: "Not sure which course fits?",
      note: "Three sentences about your team and tasks are enough. We recommend the right course, free of charge.",
      cta: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    },
    {
      t: "rows",
      id: "ki-check",
      label: "AI consulting",
      note: "The paid entry when the direction is open.",
      h: "From the AI check to your own workflow",
      lede: "The written AI check shows where AI makes sense in your daily work and ends with a training recommendation. If you want more than training, we pilot with you.",
      cta: { label: "To AI consulting", to: "beratung" },
      items: [
        {
          tag: "€990 net · fixed price",
          h: "AI check",
          p: "A questionnaire of about 20 minutes, a written report usually 10 working days after we receive it: three ideas by priority, risks, data protection and the training recommendation for your team. NDA before the analysis. Credited in full against a course or pilot within 60 days.",
          href: { label: "To the AI check", to: "check" },
        },
        {
          tag: "Fixed price · in writing first",
          h: "Pilot",
          p: "One workflow from the report, live in daily work: sorting enquiries, reading documents, workflows in Microsoft 365. Scope, date and price are set before the start; source code, access and documentation belong to you.",
          href: { label: "Discuss a pilot", to: "kontakt", query: { anliegen: "beratung" } },
        },
        {
          tag: "Monthly · by agreement",
          h: "Operation and expansion",
          p: "We keep looking after the solution or hand it over to your team with full documentation.",
        },
      ],
    },
    {
      t: "text",
      id: "ueber",
      label: "About OpSolid",
      h: "Independent of AI vendors",
      lede: "We sell neither AI licences nor software. We recommend what fits your team and your workflows.",
      paras: [
        "OpSolid organises AI training in its own name, with freelance trainers we select ourselves, and advises on automation with AI. Scope and price are fixed in writing before every engagement. We work for services, hospitality, retail and practices (without health data).",
      ],
      cta: { label: "More about OpSolid", to: "ueber" },
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Frequently asked questions",
    items: [
      {
        q: "Is the price per person?",
        a: "No, per team: AI literacy basics includes 10 people (each additional €90, up to 15), the Copilot workshop 10 (each additional €150, up to 12), the AI agents course 8 (each additional €290, up to 10). With 10 people that works out at €179 per person (AI literacy basics) and €290 per person (Copilot workshop). All prices are net of VAT and for businesses only.",
      },
      {
        q: "Where and how does the course take place?",
        a: "Online and live, in your own Microsoft Teams, via Zoom if you prefer. A half day is 3.5 hours including a break, a day 6 hours including breaks, split over two half days on request. We do not offer recordings or self-paced courses.",
      },
      {
        q: "Do we get a certificate?",
        a: "No certificate is required. You receive our own participation record with date, duration, topics and trainer. It is not issued by an authority, chamber or association.",
      },
      {
        q: "Who teaches the course?",
        a: "Freelance trainers we select. We name the person to you before you book. Contract and invoice run through OpSolid.",
      },
      {
        q: "How do we find the right course?",
        a: "With a short enquiry: we recommend the right course free of charge. If it is open where AI makes sense in your business, start with the AI check: €990 net, a fixed price, in writing with a questionnaire and a report, NDA before the analysis. The report ends with a training recommendation. Book a course or a pilot within 60 days and we credit the amount in full.",
      },
      {
        q: "Do we need AI for this at all?",
        a: "Not always. Often clean automation without AI is enough, and sometimes a course with clear rules is all it takes. What fits you, we clarify in the AI check.",
      },
    ],
  },
  cta: {
    label: "Request training",
    h: "Which team should work with AI more safely?",
    p: "Tell us briefly about your team, tasks and language. We recommend the right course and name the price per team.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "info@opsolid.de", href: "mailto:info@opsolid.de" },
  },
  schema: {
    service: {
      name: "AI training and AI consulting",
      serviceType: "AI training",
      description: "AI training for teams (online, live, per team) and AI consulting for companies: AI check with a training recommendation, pilot at a fixed price, operation and expansion.",
      offers: [{ name: "AI check", price: 990 }],
    },
    courses: [
      {
        name: "AI literacy basics",
        description:
          "Online training for teams: fundamentals, risks, data protection and rules for working with AI. Half day, up to 15 people, live in English or German, with a participation record.",
        price: 1790,
        from: true,
      },
      {
        name: "Microsoft 365 Copilot workshop",
        description:
          "Online hands-on day for teams: Microsoft 365 Copilot in Outlook, Teams, Word, Excel and PowerPoint on your own tasks. 1 day, up to 12 people, live in English or German.",
        price: 2900,
        from: true,
      },
      {
        name: "AI agents & workflow automation",
        description:
          "Online training for teams: build AI agents and automated workflows, practised on processes from daily work. 2 days, up to 10 people, live in English or German.",
        price: 5900,
        from: true,
      },
    ],
  },
};

const tr: PageDef = {
  key: "home",
  meta: {
    title: "OpSolid: Şirketler için YZ eğitimleri ve YZ danışmanlığı",
    description:
      "Ekibiniz için kendi Microsoft Teams'inizde canlı YZ eğitimleri, ekip başına 1.790 €'dan itibaren (net), katılım belgesiyle. Ayrıca YZ Kontrolü, 990 € (net).",
  },
  crumbs: [],
  crumb: "Ana sayfa",
  hero: {
    eyebrow: "İşletmeler için yapay zekâ eğitimleri",
    h1: ["Yapay zekâ eğitimi,", "canlı", " ve işinize özel"],
    lede: "Ekibiniz, yalnızca size özel kapalı bir oturumda yapay zekâyı güvenli ve anlamlı kullanmayı öğrenir.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Eğitimler ve fiyatlar", to: "home", hash: "schulungen" },
    strip: [
      ["Fiyat", "Ekip başına 1.790 €'dan itibaren (net)"],
      ["Format", "Çevrimiçi, canlı, Microsoft Teams'te"],
      ["Eğitimden sonra", "Katılım belgesi"],
      ["Dil", "Almanca veya İngilizce"],
    ],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Çizim: iç içe yuvarlatılmış kareler ve dört istasyonlu bir akış: görevler, uygulama, kurallar, belge",
      caption: "Görevlerinizden uygulama ve kurallar üzerinden belgeye.",
      fig: "0.1",
      labels: ["Görevler", "Uygulama", "Kurallar", "Belge"],
    },
  },
  blocks: [
    {
      t: "courses",
      id: "schulungen",
      label: "Eğitimler",
      note: "Fiyat kişi başına değil, ekip başına.",
      h: "Üç eğitim, ekip başına rezervasyon",
      lede: "Yarım günlük temellerden iki günlük YZ ajanlarına kadar, Almanca veya İngilizce. Her ekip kendi günlük işinden örneklerle çalışır.",
      cta: { label: "Tüm YZ eğitimleri ayrıntılı", to: "schulungen" },
      items: [
        {
          name: "YZ Yetkinliği Temel",
          status: "bookable",
          statusLabel: "Tarih talep üzerine",
          format: "Yarım gün, 3,5 saat · 10 kişi dahil, en fazla 15",
          p: "Temeller, riskler, veri koruma ve ekipte yapay zekâ kullanımı için net kurallar.",
          price: "1.790 €'dan",
          unit: "itibaren · net, ekip başına",
          arith: ["Hesaben 10 kişide kişi başı 179 €", "Her ek kişi 90 €"],
          href: { label: "Eğitime bakın", to: "kompetenz" },
        },
        {
          name: "Microsoft 365 Copilot Uygulama Günü",
          status: "bookable",
          statusLabel: "Tarih talep üzerine",
          format: "1 gün, 6 saat · 10 kişi dahil, en fazla 12",
          p: "Outlook, Teams, Word, Excel ve PowerPoint'te Copilot; kendi görevleriniz üzerinde uygulamalı.",
          price: "2.900 €'dan",
          unit: "itibaren · net, ekip başına",
          arith: ["Hesaben 10 kişide kişi başı 290 €", "Her ek kişi 150 €"],
          href: { label: "Uygulama gününe bakın", to: "copilot" },
        },
        {
          name: "YZ Ajanları ve İş Akışı Otomasyonu",
          status: "bookable",
          statusLabel: "Tarih talep üzerine",
          format: "2 gün · 8 kişi dahil, en fazla 10",
          p: "YZ ajanlarını ve otomatik iş akışlarını kurma. İki günün programını ekibinizle önceden birlikte belirleriz.",
          price: "5.900 €'dan",
          unit: "itibaren · net, ekip başına",
          arith: ["Her ek kişi 290 €"],
          href: { label: "Programı isteyin", to: "kontakt", query: { anliegen: "schulung" } },
        },
      ],
      footnote:
        "Tüm fiyatlar net, KDV hariçtir ve yalnızca işletmeler içindir. Yapay zekâ kullanan şirketler, çalışanlarının yapay zekâ okuryazarlığını desteklemek için önlemler alır (AB Yapay Zekâ Tüzüğü Madde 4); katılım belgeli bir eğitim izlenebilir bir önlemdir. Hukuki danışmanlık değildir.",
    },
    {
      t: "process",
      id: "ablauf",
      label: "Süreç",
      h: "Talepten katılım belgesine",
      lede: "Dört adım, her birinin bir sonucu var. Her adımdan sonra devam edip etmeyeceğinize siz karar verirsiniz.",
      cta: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
      steps: [
        {
          name: "Talep",
          h: "Ekip ve görevler",
          p: "Formla ekibinizi, görevlerinizi, ön bilginizi ve dili anlatırsınız. Üç cümle yeter.",
          result: "Size uygun eğitimi önerir ve ekip başına fiyatı bildiririz.",
          meta: "ücretsiz",
        },
        {
          name: "Teklif",
          h: "Eğitmen, tarih, örnekler",
          p: "Günlük işinizden örnekleri, katılımcı sayısını ve tarihi sizinle birlikte belirleriz. Eğitmeni rezervasyondan önce size adıyla bildiririz.",
          result: "Ekip başına yazılı bir teklif. Sözleşme ve fatura OpSolid üzerinden yürür.",
          meta: "rezervasyondan önce",
        },
        {
          name: "Eğitim",
          h: "Canlı ve çevrimiçi",
          p: "Yalnızca ekibinize özel kapalı bir oturum, Microsoft Teams'te canlı. Örnek verilerle çalışılır, asla gerçek müşteri verisiyle değil.",
          result: "Ekibiniz kendi görevleri üzerinde çalıştı ve kuralları biliyor.",
          meta: "yarım günden iki güne",
        },
        {
          name: "Belge",
          h: "Katılım belgesi",
          p: "Eğitimden sonra düzenleriz: tarih, süre, konular ve eğitmen bilgisiyle.",
          result: "Kayıtlarınız için izlenebilir bir önlem.",
          meta: "dokümantasyonunuz için",
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Ana fikir",
      text: "Hangi eğitim size uygun?",
      note: "Ekibiniz ve görevleriniz hakkında üç cümle yeter. Uygun eğitimi ücretsiz öneririz.",
      cta: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    },
    {
      t: "rows",
      id: "ki-check",
      label: "YZ danışmanlığı",
      note: "Yön belli değilse ücretli giriş adımı.",
      h: "YZ Kontrolü'nden kendi iş akışınıza",
      lede: "Yazılı YZ Kontrolü, günlük işinizde YZ'nin nerede anlamlı olduğunu gösterir ve bir eğitim önerisiyle biter. Eğitimden fazlasını isteyenlerle pilota geçeriz.",
      cta: { label: "YZ danışmanlığına", to: "beratung" },
      items: [
        {
          tag: "990 € (net) · sabit fiyat",
          h: "YZ Kontrolü",
          p: "Yaklaşık 20 dakikalık soru formu; formun ulaşmasından genellikle 10 iş günü sonra yazılı rapor: öncelik sırasına göre üç fikir, riskler, veri koruma ve ekibiniz için eğitim önerisi. Analizden önce NDA. 60 gün içinde bir eğitim ya da pilotta tutarın tamamını mahsup ederiz.",
          href: { label: "YZ Kontrolü'ne gidin", to: "check" },
        },
        {
          tag: "Sabit fiyat · önceden yazılı",
          h: "Pilot",
          p: "Rapordan bir iş akışı, günlük işte canlı: talepleri ayıklamak, belgeleri okumak, Microsoft 365'te iş akışları. Kapsam, tarih ve fiyat başlamadan önce belirlenir; kaynak kod, erişimler ve dokümantasyon size aittir.",
          href: { label: "Pilotu görüşün", to: "kontakt", query: { anliegen: "beratung" } },
        },
        {
          tag: "Aylık · anlaşmaya göre",
          h: "İşletme ve geliştirme",
          p: "Çözümü işletmeyi sürdürürüz ya da dokümantasyonuyla birlikte ekibinize devrederiz.",
        },
      ],
    },
    {
      t: "text",
      id: "ueber",
      label: "OpSolid hakkında",
      h: "YZ sağlayıcılarından bağımsız",
      lede: "YZ lisansı da yazılım da satmayız. Ekibinize ve iş akışlarınıza uyanı öneririz.",
      paras: [
        "OpSolid, YZ eğitimlerini kendi adına, kendi seçtiği serbest eğitmenlerle düzenler ve yapay zekâ ile otomasyon konusunda danışmanlık verir. Kapsam ve fiyat her işten önce yazılı olarak belirlenir. Hizmet sektörü, yeme-içme ve konaklama, perakende ile muayenehaneler (sağlık verisi olmadan) için çalışıyoruz.",
      ],
      cta: { label: "OpSolid hakkında daha fazlası", to: "ueber" },
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Sık sorulan sorular",
    items: [
      {
        q: "Fiyat kişi başına mı?",
        a: "Hayır, ekip başına: YZ Yetkinliği Temel'de 10 kişi dahil (her ek kişi 90 €, en fazla 15), Copilot Uygulama Günü'nde 10 (her ek kişi 150 €, en fazla 12), YZ Ajanları eğitiminde 8 (her ek kişi 290 €, en fazla 10). 10 kişide bu, kişi başı 179 € (YZ Yetkinliği Temel) ve 290 € (Copilot Uygulama Günü) eder. Tüm fiyatlar net, KDV hariçtir ve yalnızca işletmeler içindir.",
      },
      {
        q: "Eğitim nerede ve nasıl yapılır?",
        a: "Çevrimiçi ve canlı, kendi Microsoft Teams'inizde; isterseniz Zoom ile. Yarım gün mola dahil 3,5 saat, bir gün molalar dahil 6 saat sürer; isterseniz iki yarım güne bölünür. Kayıt ve kendi kendine öğrenme kursu sunmuyoruz.",
      },
      {
        q: "Sertifika alıyor muyuz?",
        a: "Sertifika zorunlu değildir. Bizden tarih, süre, konular ve eğitmeni içeren kendi katılım belgemizi alırsınız. Bu belge bir kurum, oda veya dernek sertifikası değildir.",
      },
      {
        q: "Eğitimi kim veriyor?",
        a: "Bizim seçtiğimiz serbest eğitmenler. Kişiyi rezervasyondan önce size adıyla bildiririz. Sözleşme ve fatura OpSolid üzerinden yürür.",
      },
      {
        q: "Uygun eğitimi nasıl buluruz?",
        a: "Kısa bir talep yeter: uygun eğitimi ücretsiz öneririz. Yapay zekânın işletmenizde nerede anlamlı olduğu belli değilse YZ Kontrolü ile başlayın: 990 € (net), sabit fiyat, soru formu ve raporla yazılı, analizden önce NDA. Rapor bir eğitim önerisiyle biter. 60 gün içinde bir eğitim ya da pilot rezervasyonu yaparsanız tutarın tamamını mahsup ederiz.",
      },
      {
        q: "Bunun için gerçekten yapay zekâya ihtiyacımız var mı?",
        a: "Her zaman değil. Çoğu zaman yapay zekâ içermeyen düzgün bir otomasyon yeterlidir; bazen net kurallar içeren bir eğitim yeter. Size neyin uyduğunu YZ Kontrolü'nde netleştiririz.",
      },
    ],
  },
  cta: {
    label: "Eğitim talep edin",
    h: "Hangi ekip YZ ile daha güvenle çalışmalı?",
    p: "Ekibiniz, görevleriniz ve dil hakkında kısaca yazın. Size uygun eğitimi önerir ve ekip başına fiyatı bildiririz.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "info@opsolid.de", href: "mailto:info@opsolid.de" },
  },
  schema: {
    service: {
      name: "YZ eğitimleri ve YZ danışmanlığı",
      serviceType: "Yapay zekâ eğitimleri",
      description: "Ekipler için YZ eğitimleri (çevrimiçi, canlı, ekip başına) ve şirketler için YZ danışmanlığı: eğitim önerisiyle biten YZ Kontrolü, sabit fiyatlı pilot, işletme ve geliştirme.",
      offers: [{ name: "YZ Kontrolü", price: 990 }],
    },
    courses: [
      {
        name: "YZ Yetkinliği Temel",
        description:
          "Ekipler için çevrimiçi eğitim: YZ ile çalışmanın temelleri, riskleri, veri koruma ve kurallar. Yarım gün, en fazla 15 kişi, Almanca veya İngilizce canlı, katılım belgesiyle.",
        price: 1790,
        from: true,
      },
      {
        name: "Microsoft 365 Copilot Uygulama Günü",
        description:
          "Ekipler için çevrimiçi uygulama günü: Outlook, Teams, Word, Excel ve PowerPoint'te Microsoft 365 Copilot, kendi görevleriniz üzerinde. 1 gün, en fazla 12 kişi, Almanca veya İngilizce canlı.",
        price: 2900,
        from: true,
      },
      {
        name: "YZ Ajanları ve İş Akışı Otomasyonu",
        description:
          "Ekipler için çevrimiçi eğitim: YZ ajanlarını ve otomatik iş akışlarını kurma, günlük işten süreçler üzerinde. 2 gün, en fazla 10 kişi, Almanca veya İngilizce canlı.",
        price: 5900,
        from: true,
      },
    ],
  },
};

export const page: PageSet = { de, en, tr };
