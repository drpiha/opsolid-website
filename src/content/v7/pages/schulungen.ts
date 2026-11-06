/**
 * KI-Schulungen hub (pillar 1 since the owner decision of 2026-11-06: trainings lead). German is the source; EN and
 * TR are transcreations in full key parity. Prices: only the published ones (KI-Kompetenz Basis ab 1.790 EUR,
 * Copilot-Praxistag ab 2.900 EUR, KI-Agenten ab 5.900 EUR), the per-person arithmetic only at the included group
 * size. No trainer is named or implied: freelance trainers we select, named before booking; contract and invoice
 * through OpSolid. Live only (no recordings, no self-paced courses). No planned courses are listed.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "schulungen",
  meta: {
    title: "KI-Schulungen für Teams: live in Ihrem Teams, pro Team",
    description:
      "KI-Schulungen für Ihr Team, live in Ihrem Microsoft Teams: KI-Kompetenz Basis ab 1.790 €, Copilot-Praxistag ab 2.900 € netto pro Team. Mit Bescheinigung.",
  },
  crumbs: [],
  crumb: "KI-Schulungen",
  hero: {
    eyebrow: "KI-Schulungen · online, live, in Ihrem Teams",
    h1: ["KI-Schulungen für Ihr Team,", "live", " in Ihrem Teams"],
    lede: "Wir schulen Teams im sicheren Umgang mit KI: online, live in Ihrem eigenen Microsoft Teams, auf Deutsch oder Englisch, an Aufgaben aus Ihrem Alltag. Gebucht wird pro Team; nach der Schulung erhält Ihr Team unsere Teilnahmebescheinigung.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Schulungen und Preise", to: "schulungen", hash: "angebot" },
    facts: ["Pro Team ab 1.790 € netto", "Online, live, in Ihrem Teams", "Eigene Teilnahmebescheinigung", "Deutsch oder Englisch"],
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
      id: "angebot",
      label: "Schulungen",
      note: "Preis pro Team, nicht pro Person.",
      h: "Drei Schulungen zur Auswahl",
      lede: "Grundlagen für alle, Copilot im Arbeitsalltag oder KI-Agenten und Workflows: online, live in Ihrem Microsoft Teams, pro Team. Nach jeder Schulung erhält Ihr Team unsere Teilnahmebescheinigung.",
      items: [
        {
          name: "KI-Kompetenz Basis",
          status: "bookable",
          statusLabel: "Auf Anfrage",
          format: "Halber Tag, 3,5 Stunden · 10 Personen inklusive, bis 15 · online, live",
          p: "Grundlagen, Risiken, Datenschutz und Regeln für den Alltag. Mit Teilnahmebescheinigung für Ihre Unterlagen.",
          price: "ab 1.790 €",
          unit: "netto pro Team",
          arith: "Rechnerisch 179 € pro Person bei 10 Personen · jede weitere 90 €",
          href: { label: "Zur Schulung", to: "kompetenz" },
        },
        {
          name: "Microsoft 365 Copilot Praxistag",
          status: "bookable",
          statusLabel: "Auf Anfrage",
          format: "1 Tag, 6 Stunden · 10 Personen inklusive, bis 12 · online, live",
          p: "Copilot in Outlook, Teams, Word, Excel und PowerPoint, geübt an Aufgaben aus Ihrem Alltag.",
          price: "ab 2.900 €",
          unit: "netto pro Team",
          arith: "Rechnerisch 290 € pro Person bei 10 Personen · jede weitere 150 €",
          href: { label: "Zum Praxistag", to: "copilot" },
        },
        {
          name: "KI-Agenten & Workflow-Automatisierung",
          status: "bookable",
          statusLabel: "Auf Anfrage",
          format: "2 Tage · 8 Personen inklusive, bis 10 · online, live",
          p: "KI-Agenten und automatisierte Workflows aufbauen, geübt an Abläufen aus Ihrem Alltag.",
          price: "ab 5.900 €",
          unit: "netto pro Team",
          arith: "Jede weitere Person 290 €",
          href: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
        },
      ],
      footnote: "Alle Preise netto zzgl. USt., nur für Unternehmen.",
    },
    {
      t: "principles",
      id: "gemeinsam",
      label: "Gemeinsam",
      note: "Vier Regeln für jedes Format.",
      h: "Was alle Schulungen gemeinsam haben",
      items: [
        { h: "Ihre Aufgaben statt fremder Folien", p: "Die Teilnehmenden arbeiten an Beispielen aus ihrem Alltag. Dafür fragen wir vorab nach Aufgaben und Vorwissen." },
        { h: "Kleine Gruppen", p: "Die Gruppen bleiben klein, damit Zeit für Fragen bleibt." },
        { h: "Keine echten Kundendaten", p: "Geübt wird mit Beispieldaten oder mit Inhalten, die Sie ausdrücklich dafür freigeben." },
        { h: "Klare Grenzen", p: "Wir sagen, was KI kann und was nicht. In den Schulungen verkaufen wir weder Lizenzen noch Produkte." },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Leitsatz",
      text: "Wir verkaufen Schulung, keine Lizenzen",
    },
    {
      t: "spec",
      id: "format",
      label: "Format",
      h: "Wie die Schulungen ablaufen",
      rows: [
        ["Durchführung", "Online und live in Ihrem eigenen Microsoft Teams, auf Wunsch per Zoom. Die Trainerin oder der Trainer kommt als Gast in Ihre Sitzung. Keine Aufzeichnung, kein Selbstlernkurs."],
        ["Sprache", "Deutsch oder Englisch"],
        ["Dauer", "Halber Tag: 3,5 Stunden inklusive Pause. Ein Tag: 6 Stunden inklusive Pausen, auf Wunsch an zwei halben Tagen."],
        ["Termine", "Nach Vereinbarung, als geschlossener Termin für Ihr Team"],
        ["Trainer", "Freiberufliche Trainerinnen und Trainer, die wir auswählen und Ihnen vor der Buchung namentlich nennen. Vertrag und Rechnung laufen über OpSolid."],
        ["Bescheinigung", "Eigene Teilnahmebescheinigung von OpSolid mit Datum, Dauer, Themen und Trainer"],
        ["Preis", "Pro Team, netto zzgl. USt., nur für Unternehmen"],
      ],
    },
    {
      t: "text",
      id: "ki-verordnung",
      label: "KI-Verordnung",
      note: "Zur Einordnung.",
      h: "Was Art. 4 der KI-Verordnung bedeutet",
      lede: "Unternehmen, die KI einsetzen, ergreifen Maßnahmen, um die KI-Kompetenz ihrer Beschäftigten zu fördern.",
      paras: [
        "Das regelt Art. 4 der KI-Verordnung (EU). Die Vorschrift gilt seit dem 2. Februar 2025 und wurde durch die Verordnung (EU) 2026/1744 neu gefasst, die seit dem 27. Juli 2026 in Kraft ist.",
        "Ein Zertifikat ist nicht vorgeschrieben. Dokumentierte Maßnahmen sind gute Praxis, denn sie lassen sich später belegen.",
        "Unsere Schulungen können Teil dieser Maßnahmen sein. Dafür stellen wir eine eigene Teilnahmebescheinigung aus. Das ist keine Rechtsberatung.",
      ],
      sources: {
        asOf: "Rechtsstand: 2. November 2026",
        items: [
          { label: "Verordnung (EU) 2024/1689 (KI-Verordnung), EUR-Lex", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu" },
          { label: "Verordnung (EU) 2026/1744 (Art. 4 neu gefasst), EUR-Lex", href: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj/deu" },
        ],
      },
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Ablauf",
      note: "Vier Schritte bis zur Bescheinigung.",
      h: "Von der Anfrage zur Bescheinigung",
      lede: "Sie wissen in jedem Schritt, was als Nächstes passiert.",
      items: [
        { h: "Anfrage", p: "Sie schildern Team, Aufgaben und Vorwissen. Wir empfehlen die passende Schulung und nennen den Preis." },
        { h: "Trainerin oder Trainer", p: "Die Trainerin oder den Trainer nennen wir Ihnen vor der Buchung namentlich." },
        { h: "Inhalte und Termin", p: "Wir stimmen Beispiele, Sprache, Teilnehmerzahl und Termin mit Ihnen ab, damit die Schulung zu Ihrem Alltag passt." },
        { h: "Teilnahmebescheinigung", p: "Nach der Schulung erhalten Sie die Bescheinigung für Ihre Unterlagen." },
      ],
    },
    {
      t: "rows",
      id: "weitere-wege",
      label: "Weitere Wege",
      note: "Erst analysieren, dann schulen.",
      h: "Wenn offen ist, welche Schulung passt",
      items: [
        {
          h: "Erst analysieren, dann schulen",
          p: "Der schriftliche KI-Check (990 € netto, Festpreis) zeigt per Fragebogen und Bericht, wo KI in Ihrem Alltag sinnvoll ist, und endet mit einer Schulungsempfehlung für Ihr Team. Buchen Sie innerhalb von 60 Tagen eine Schulung, rechnen wir den Betrag voll an.",
          href: { label: "Zum KI-Check", to: "check" },
        },
        {
          h: "Abläufe automatisieren",
          p: "Wenn Sie nicht nur schulen, sondern Abläufe mit KI verbessern wollen, beginnen Sie mit der KI-Beratung.",
          href: { label: "Zur KI-Beratung", to: "beratung" },
        },
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen zu den Schulungen",
    items: [
      {
        q: "Bekommen wir ein Zertifikat?",
        a: "Ein Zertifikat ist nicht vorgeschrieben. Sie erhalten von uns eine eigene Teilnahmebescheinigung mit Datum, Dauer, Themen und Trainer. Sie ist kein Zertifikat einer Behörde, einer Kammer oder eines Verbands.",
      },
      {
        q: "Schulen Sie auch auf Englisch?",
        a: "Ja. Jede Schulung läuft auf Deutsch oder Englisch. Nennen Sie uns bei der Anfrage die Sprache, die Ihr Team braucht.",
      },
      {
        q: "Kommen Sie auch zu uns ins Haus?",
        a: "Die Schulungen finden online statt, als eigener Termin nur für Ihr Team. Vor-Ort-Termine sind derzeit nicht vorgesehen.",
      },
      {
        q: "Gilt der Preis pro Person?",
        a: "Nein, pro Team: bei KI-Kompetenz Basis 10 Personen inklusive (jede weitere 90 €, bis 15), beim Copilot-Praxistag 10 inklusive (jede weitere 150 €, bis 12), bei der KI-Agenten-Schulung 8 inklusive (jede weitere 290 €, bis 10). Rechnerisch sind das bei 10 Personen 179 € pro Person (KI-Kompetenz Basis) und 290 € pro Person (Copilot-Praxistag). Für größere Teams sprechen Sie uns an.",
      },
      {
        q: "Wer hält die Schulung?",
        a: "Freiberufliche Trainerinnen und Trainer, die wir auswählen. Die Person nennen wir Ihnen vor der Buchung namentlich. Vertrag und Rechnung laufen über OpSolid.",
      },
      {
        q: "Gibt es eine Aufzeichnung?",
        a: "Nein. Unsere Schulungen finden ausschließlich live statt. Aufzeichnungen und Selbstlernkurse bieten wir nicht an; Unterlagen zur Schulung erhält Ihr Team im Anschluss.",
      },
    ],
  },
  cta: {
    label: "Schulung anfragen",
    h: "Welches Team soll sicherer mit KI arbeiten?",
    p: "Schreiben Sie uns kurz zu Team, Aufgaben und Sprache. Wir empfehlen die passende Schulung und nennen den Preis pro Team.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Erst analysieren: zum KI-Check", to: "check" },
  },
  schema: {
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
  key: "schulungen",
  meta: {
    title: "AI training for teams: live in your Teams, priced per team",
    description:
      "AI training for your team, live in your Microsoft Teams: AI literacy basics from €1,790, Copilot workshop from €2,900 net per team. With a participation record.",
  },
  crumbs: [],
  crumb: "AI training",
  hero: {
    eyebrow: "AI training · online, live, in your Teams",
    h1: ["AI training for your team,", "live", " in your Teams"],
    lede: "We train teams to work with AI safely: online, live in your own Microsoft Teams, in English or German, on tasks from your daily work. You book per team; after the course your team receives our participation record.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Courses and prices", to: "schulungen", hash: "angebot" },
    facts: ["From €1,790 net per team", "Online, live, in your Teams", "Our own participation record", "English or German"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Sketch: nested rounded squares above a workflow in four stations: tasks, practice, rules, record",
      caption: "From your tasks, through practice and rules, to a record.",
      fig: "0.1",
      labels: ["Tasks", "Practice", "Rules", "Record"],
    },
  },
  blocks: [
    {
      t: "courses",
      id: "angebot",
      label: "Courses",
      note: "Priced per team, not per person.",
      h: "Three courses to choose from",
      lede: "Basics for everyone, Copilot in daily work, or AI agents and workflows: online, live in your Microsoft Teams, per team. After every course your team receives our participation record.",
      items: [
        {
          name: "AI literacy basics",
          status: "bookable",
          statusLabel: "On request",
          format: "Half day, 3.5 hours · 10 people included, up to 15 · online, live",
          p: "Fundamentals, risks, data protection and everyday rules. With a participation record for your files.",
          price: "from €1,790",
          unit: "net per team",
          arith: "Works out at €179 per person with 10 people · each additional €90",
          href: { label: "View the course", to: "kompetenz" },
        },
        {
          name: "Microsoft 365 Copilot workshop",
          status: "bookable",
          statusLabel: "On request",
          format: "1 day, 6 hours · 10 people included, up to 12 · online, live",
          p: "Copilot in Outlook, Teams, Word, Excel and PowerPoint, practised on tasks from your daily work.",
          price: "from €2,900",
          unit: "net per team",
          arith: "Works out at €290 per person with 10 people · each additional €150",
          href: { label: "View the workshop", to: "copilot" },
        },
        {
          name: "AI agents & workflow automation",
          status: "bookable",
          statusLabel: "On request",
          format: "2 days · 8 people included, up to 10 · online, live",
          p: "Build AI agents and automated workflows, practised on processes from your daily work.",
          price: "from €5,900",
          unit: "net per team",
          arith: "Each additional person €290",
          href: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
        },
      ],
      footnote: "All prices net of VAT, businesses only.",
    },
    {
      t: "principles",
      id: "gemeinsam",
      label: "In common",
      note: "Four rules for every format.",
      h: "What every course has in common",
      items: [
        { h: "Your tasks, not someone else's slides", p: "Participants work on examples from their own daily work. We ask for tasks and prior knowledge beforehand." },
        { h: "Small groups", p: "Groups stay small, so there is time for questions." },
        { h: "No real customer data", p: "We practise with sample data or with content you explicitly release for the purpose." },
        { h: "Clear limits", p: "We say what AI can do and what it cannot. In our training we sell neither licences nor products." },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Key point",
      text: "We sell training, not licences",
    },
    {
      t: "spec",
      id: "format",
      label: "Format",
      h: "How the courses run",
      rows: [
        ["Delivery", "Online and live in your own Microsoft Teams, via Zoom if you prefer. The trainer joins your session as a guest. No recording, no self-paced course."],
        ["Language", "English or German"],
        ["Duration", "Half day: 3.5 hours including a break. One day: 6 hours including breaks, on request split over two half days."],
        ["Dates", "By agreement, as a closed session for your team"],
        ["Trainer", "Freelance trainers we select and name to you before you book. Contract and invoice run through OpSolid."],
        ["Record", "Our own participation record from OpSolid with date, duration, topics and trainer"],
        ["Price", "Per team, net of VAT, businesses only"],
      ],
    },
    {
      t: "text",
      id: "ki-verordnung",
      label: "AI Act",
      note: "For context.",
      h: "What Article 4 of the AI Act means",
      lede: "Companies that use AI take measures to support the AI literacy of their staff.",
      paras: [
        "This is set out in Article 4 of the EU AI Act. It has applied since 2 February 2025 and was reworded by Regulation (EU) 2026/1744, which has been in force since 27 July 2026.",
        "No certificate is required. Documented measures are good practice because they can be evidenced later.",
        "Our training can be one of those measures. We issue our own participation record for it. This is not legal advice.",
      ],
      sources: {
        asOf: "Legal status: 2 November 2026",
        items: [
          { label: "Regulation (EU) 2024/1689 (AI Act), EUR-Lex", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng" },
          { label: "Regulation (EU) 2026/1744 (Article 4 replaced), EUR-Lex", href: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng" },
        ],
      },
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Process",
      note: "Four steps to the participation record.",
      h: "From enquiry to participation record",
      lede: "At every step you know what comes next.",
      items: [
        { h: "Enquiry", p: "You describe your team, tasks and prior knowledge. We recommend the right course and name the price." },
        { h: "Trainer", p: "We name the trainer to you before you book." },
        { h: "Content and date", p: "We agree examples, language, group size and date with you, so the course fits your daily work." },
        { h: "Participation record", p: "After the course you receive the record for your files." },
      ],
    },
    {
      t: "rows",
      id: "weitere-wege",
      label: "Other routes",
      note: "Analyse first, then train.",
      h: "When it is open which course fits",
      items: [
        {
          h: "Analyse first, then train",
          p: "The written AI check (€990 net, fixed price) shows with a questionnaire and a report where AI makes sense in your daily work, and ends with a training recommendation for your team. Book a course within 60 days and we credit the amount in full.",
          href: { label: "To the AI check", to: "check" },
        },
        {
          h: "Automate workflows",
          p: "If you want to improve workflows with AI, not only train your team, start with AI automation consulting.",
          href: { label: "To AI consulting", to: "beratung" },
        },
      ],
    },
  ],
  faq: {
    label: "Common questions",
    h: "Common questions about the training",
    items: [
      {
        q: "Do we get a certificate?",
        a: "No certificate is required. You receive our own participation record with date, duration, topics and trainer. It is not issued by an authority, chamber or association.",
      },
      {
        q: "Do you teach in English?",
        a: "Yes. Every course runs in English or German. Tell us the language your team needs when you enquire.",
      },
      {
        q: "Do you come to our site?",
        a: "The courses take place online, as a session just for your team. On-site sessions are not planned at the moment.",
      },
      {
        q: "Is the price per person?",
        a: "No, per team: AI literacy basics includes 10 people (each additional €90, up to 15), the Copilot workshop 10 (each additional €150, up to 12), the AI agents course 8 (each additional €290, up to 10). With 10 people that works out at €179 per person (AI literacy basics) and €290 per person (Copilot workshop). For larger teams, please get in touch.",
      },
      {
        q: "Who teaches the course?",
        a: "Freelance trainers we select. We name the person to you before you book. Contract and invoice run through OpSolid.",
      },
      {
        q: "Is there a recording?",
        a: "No. Our courses take place live only. We do not offer recordings or self-paced courses; your team receives the course materials afterwards.",
      },
    ],
  },
  cta: {
    label: "Request training",
    h: "Which team should work with AI more safely?",
    p: "Tell us briefly about your team, tasks and language. We recommend the right course and name the price per team.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Analyse first: to the AI check", to: "check" },
  },
  schema: {
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
  key: "schulungen",
  meta: {
    title: "YZ eğitimleri: kendi Teams'inizde canlı, ekip başına",
    description:
      "Kendi Microsoft Teams'inizde canlı YZ eğitimleri: Temel 1.790 €'dan, Copilot Uygulama Günü 2.900 €'dan itibaren, ekip başına (net). Katılım belgesiyle.",
  },
  crumbs: [],
  crumb: "YZ eğitimleri",
  hero: {
    eyebrow: "YZ eğitimleri · çevrimiçi, canlı, kendi Teams'inizde",
    h1: ["Ekibiniz için YZ eğitimleri,", "canlı", ", kendi Teams'inizde"],
    lede: "Ekiplerin YZ'yi güvenle kullanmasını sağlıyoruz: çevrimiçi, kendi Microsoft Teams'inizde canlı, Almanca veya İngilizce, günlük işinizden görevler üzerinde. Rezervasyon ekip başınadır; eğitimden sonra ekibiniz katılım belgemizi alır.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Eğitimler ve fiyatlar", to: "schulungen", hash: "angebot" },
    facts: ["Ekip başına 1.790 €'dan itibaren (net)", "Çevrimiçi, canlı, kendi Teams'inizde", "Kendi katılım belgemiz", "Almanca veya İngilizce"],
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
      id: "angebot",
      label: "Eğitimler",
      note: "Fiyat kişi başına değil, ekip başına.",
      h: "Seçebileceğiniz üç eğitim",
      lede: "Herkes için temeller, günlük işte Copilot ya da YZ ajanları ve iş akışları: çevrimiçi, kendi Microsoft Teams'inizde canlı, ekip başına. Her eğitimden sonra ekibiniz katılım belgemizi alır.",
      items: [
        {
          name: "YZ Yetkinliği Temel",
          status: "bookable",
          statusLabel: "Talep üzerine",
          format: "Yarım gün, 3,5 saat · 10 kişi dahil, en fazla 15 · çevrimiçi, canlı",
          p: "Temeller, riskler, veri koruma ve günlük iş için kurallar. Kayıtlarınız için katılım belgesiyle.",
          price: "1.790 €'dan",
          unit: "itibaren · net, ekip başına",
          arith: "Hesaben 10 kişide kişi başı 179 € · her ek kişi 90 €",
          href: { label: "Eğitime bakın", to: "kompetenz" },
        },
        {
          name: "Microsoft 365 Copilot Uygulama Günü",
          status: "bookable",
          statusLabel: "Talep üzerine",
          format: "1 gün, 6 saat · 10 kişi dahil, en fazla 12 · çevrimiçi, canlı",
          p: "Outlook, Teams, Word, Excel ve PowerPoint'te Copilot; günlük işinizden görevler üzerinde uygulamalı.",
          price: "2.900 €'dan",
          unit: "itibaren · net, ekip başına",
          arith: "Hesaben 10 kişide kişi başı 290 € · her ek kişi 150 €",
          href: { label: "Uygulama gününe bakın", to: "copilot" },
        },
        {
          name: "YZ Ajanları ve İş Akışı Otomasyonu",
          status: "bookable",
          statusLabel: "Talep üzerine",
          format: "2 gün · 8 kişi dahil, en fazla 10 · çevrimiçi, canlı",
          p: "YZ ajanlarını ve otomatik iş akışlarını kurma; günlük işinizdeki süreçler üzerinde uygulamalı.",
          price: "5.900 €'dan",
          unit: "itibaren · net, ekip başına",
          arith: "Her ek kişi 290 €",
          href: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
        },
      ],
      footnote: "Tüm fiyatlar net, KDV hariç; yalnızca işletmeler için.",
    },
    {
      t: "principles",
      id: "gemeinsam",
      label: "Ortak noktalar",
      note: "Her format için dört kural.",
      h: "Tüm eğitimlerin ortak yanı",
      items: [
        { h: "Başkasının slaytları değil, sizin görevleriniz", p: "Katılımcılar kendi günlük işlerinden örnekler üzerinde çalışır. Bunun için önceden görevleri ve ön bilgiyi sorarız." },
        { h: "Küçük gruplar", p: "Gruplar küçük tutulur; böylece sorulara zaman kalır." },
        { h: "Gerçek müşteri verisi yok", p: "Örnek verilerle ya da sizin bu amaçla açıkça paylaştığınız içeriklerle çalışılır." },
        { h: "Net sınırlar", p: "YZ'nin neyi yapabildiğini ve neyi yapamadığını söyleriz. Eğitimlerde lisans da ürün de satmıyoruz." },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Ana fikir",
      text: "Eğitim satıyoruz, lisans değil",
    },
    {
      t: "spec",
      id: "format",
      label: "Format",
      h: "Eğitimler nasıl işler",
      rows: [
        ["Uygulama", "Çevrimiçi ve kendi Microsoft Teams'inizde canlı; isterseniz Zoom ile. Eğitmen oturumunuza konuk olarak katılır. Kayıt yok, kendi kendine öğrenme kursu yok."],
        ["Dil", "Almanca veya İngilizce"],
        ["Süre", "Yarım gün: mola dahil 3,5 saat. Bir gün: molalar dahil 6 saat; isterseniz iki yarım güne bölünür."],
        ["Tarih", "Anlaşmaya göre, ekibinize özel kapalı oturum olarak"],
        ["Eğitmen", "Bizim seçtiğimiz ve rezervasyondan önce size adıyla bildirdiğimiz serbest eğitmenler. Sözleşme ve fatura OpSolid üzerinden yürür."],
        ["Belge", "Tarih, süre, konular ve eğitmeni içeren, OpSolid'e ait katılım belgesi"],
        ["Fiyat", "Ekip başına, net (KDV hariç), yalnızca işletmeler için"],
      ],
    },
    {
      t: "text",
      id: "ki-verordnung",
      label: "AB YZ Tüzüğü",
      note: "Genel bilgi.",
      h: "AB YZ Tüzüğü'nün 4. maddesi ne anlama gelir?",
      lede: "YZ kullanan şirketler, çalışanlarının YZ yetkinliğini desteklemek için önlemler alır.",
      paras: [
        "Bunu AB Yapay Zekâ Tüzüğü'nün 4. maddesi düzenler. Madde 2 Şubat 2025'ten beri geçerlidir; 27 Temmuz 2026'dan beri yürürlükte olan (AB) 2026/1744 sayılı Tüzük ile yeniden düzenlenmiştir.",
        "Sertifika zorunlu değildir. Belgelenmiş önlemler iyi uygulamadır, çünkü sonradan kanıtlanabilir.",
        "Eğitimlerimiz bu önlemlerin bir parçası olabilir. Bunun için kendi katılım belgemizi düzenleriz. Bu hukuki danışmanlık değildir.",
      ],
      sources: {
        asOf: "Hukuki durum: 2 Kasım 2026",
        items: [
          { label: "Tüzük (AB) 2024/1689 (AI Act), EUR-Lex, İngilizce", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng" },
          { label: "Tüzük (AB) 2026/1744 (4. madde yeni metinle değiştirildi), EUR-Lex, İngilizce", href: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng" },
        ],
      },
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Süreç",
      note: "Belgeye giden dört adım.",
      h: "Talepten katılım belgesine",
      lede: "Her adımda sırada ne olduğunu bilirsiniz.",
      items: [
        { h: "Talep", p: "Ekibinizi, görevlerinizi ve ön bilginizi anlatırsınız. Size uygun eğitimi önerir ve fiyatı bildiririz." },
        { h: "Eğitmen", p: "Eğitmeni rezervasyondan önce size adıyla bildiririz." },
        { h: "İçerik ve tarih", p: "Eğitimin günlük işinize uyması için örnekleri, dili, katılımcı sayısını ve tarihi sizinle birlikte belirleriz." },
        { h: "Katılım belgesi", p: "Eğitimden sonra kayıtlarınız için belgeyi alırsınız." },
      ],
    },
    {
      t: "rows",
      id: "weitere-wege",
      label: "Diğer yollar",
      note: "Önce analiz, sonra eğitim.",
      h: "Hangi eğitimin uygun olduğu belli değilse",
      items: [
        {
          h: "Önce analiz, sonra eğitim",
          p: "Yazılı YZ Kontrolü (990 €, net, sabit fiyat) soru formu ve raporla günlük işinizde YZ'nin nerede anlamlı olduğunu gösterir ve ekibiniz için bir eğitim önerisiyle biter. 60 gün içinde bir eğitim rezervasyonu yaparsanız tutarın tamamını mahsup ederiz.",
          href: { label: "YZ Kontrolü'ne gidin", to: "check" },
        },
        {
          h: "İş akışlarını otomatikleştirin",
          p: "Yalnızca eğitmek değil, iş akışlarını YZ ile iyileştirmek de istiyorsanız YZ danışmanlığıyla başlayın.",
          href: { label: "YZ danışmanlığına gidin", to: "beratung" },
        },
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Eğitimler hakkında sık sorulan sorular",
    items: [
      {
        q: "Sertifika alıyor muyuz?",
        a: "Sertifika zorunlu değildir. Bizden tarih, süre, konular ve eğitmeni içeren kendi katılım belgemizi alırsınız. Bu belge bir kurum, oda veya dernek sertifikası değildir.",
      },
      {
        q: "İngilizce eğitim veriyor musunuz?",
        a: "Evet. Her eğitim Almanca veya İngilizce yapılır. Talep ederken ekibinizin ihtiyaç duyduğu dili belirtmeniz yeterli.",
      },
      {
        q: "Yerinize gelir misiniz?",
        a: "Eğitimler çevrimiçi, yalnızca ekibinize özel bir oturum olarak yapılır. Yerinde oturumlar şu an planlanmıyor.",
      },
      {
        q: "Fiyat kişi başına mı?",
        a: "Hayır, ekip başına: YZ Yetkinliği Temel'de 10 kişi dahil (her ek kişi 90 €, en fazla 15), Copilot Uygulama Günü'nde 10 kişi dahil (her ek kişi 150 €, en fazla 12), YZ Ajanları'nda 8 kişi dahil (her ek kişi 290 €, en fazla 10). 10 kişilik bir ekipte bu, kişi başı 179 € (YZ Yetkinliği Temel) ve 290 € (Copilot Uygulama Günü) eder. Daha büyük ekipler için bize yazın.",
      },
      {
        q: "Eğitimi kim veriyor?",
        a: "Bizim seçtiğimiz serbest eğitmenler. Kişiyi rezervasyondan önce size adıyla bildiririz. Sözleşme ve fatura OpSolid üzerinden yürür.",
      },
      {
        q: "Kayıt var mı?",
        a: "Hayır. Eğitimlerimiz yalnızca canlı yapılır. Kayıt ve kendi kendine öğrenme kursu sunmuyoruz; eğitim materyallerini ekibiniz sonrasında alır.",
      },
    ],
  },
  cta: {
    label: "Eğitim talep edin",
    h: "Hangi ekip YZ ile daha güvenle çalışmalı?",
    p: "Ekibiniz, görevleriniz ve dil hakkında kısaca yazın. Size uygun eğitimi önerir ve ekip başına fiyatı bildiririz.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Önce analiz: YZ Kontrolü'ne gidin", to: "check" },
  },
  schema: {
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
