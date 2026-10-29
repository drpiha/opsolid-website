/**
 * KI-Schulungen hub (pillar 2). German is the source; EN and TR are transcreations in full key parity.
 * Prices: only the published ones (KI-Kompetenz Basis 1.490 EUR, Copilot-Praxistag ab 2.400 EUR). Planned
 * courses never carry a price. No trainer is named or implied: see trainer-roster.md section 5.4.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "schulungen",
  meta: {
    title: "KI-Schulungen für Teams: online, Deutsch und Englisch",
    description:
      "Online-Schulungen zu KI für Ihr Team: KI-Kompetenz Basis 1.490 € netto, Copilot-Praxistag ab 2.400 € netto. Live auf Deutsch oder Englisch, mit Bescheinigung.",
  },
  crumbs: [],
  crumb: "KI-Schulungen",
  hero: {
    eyebrow: "KI-Schulungen · online, live, Deutsch und Englisch",
    h1: ["KI-Schulungen für Ihr ", "Team", ", live online."],
    lede: "Wir schulen Teams im sicheren Umgang mit KI: online, live, auf Deutsch oder Englisch. Geübt wird an Ihren eigenen Aufgaben. Zwei Schulungen bieten wir an, weitere sind in Planung.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Schulungen ansehen", to: "schulungen", hash: "angebot" },
    facts: ["KI-Kompetenz Basis 1.490 € netto", "Copilot-Praxistag ab 2.400 € netto", "Eigene Teilnahmebescheinigung"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Skizze: ineinander liegende abgerundete Quadrate, die für aufeinander aufbauende Lernschritte stehen",
      caption: "Schritt für Schritt, an Ihren Aufgaben.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "courses",
      id: "angebot",
      label: "Schulungen",
      h: "Zwei Schulungen zur Auswahl, weitere folgen.",
      lede: "Wählen Sie nach Ihrem Ziel: Grundlagen für alle oder Copilot im Arbeitsalltag. Beide laufen online und live, pro Team.",
      items: [
        {
          name: "KI-Kompetenz Basis",
          status: "bookable",
          statusLabel: "Auf Anfrage",
          format: "Halber Tag · bis 15 Personen · pro Team",
          p: "Grundlagen, Risiken, Datenschutz und Regeln für den Alltag. Dazu eine Teilnahmebescheinigung für Ihre Unterlagen.",
          price: "1.490 € netto",
          href: { label: "Zur Schulung", to: "kompetenz" },
        },
        {
          name: "Microsoft 365 Copilot Praxistag",
          status: "bookable",
          statusLabel: "Auf Anfrage",
          format: "1 Tag · bis 12 Personen",
          p: "Copilot in Outlook, Teams, Word, Excel und PowerPoint, geübt an Aufgaben aus Ihrem Alltag.",
          price: "ab 2.400 € netto",
          href: { label: "Zum Praxistag", to: "copilot" },
        },
        {
          name: "KI-Agenten & Workflow-Automatisierung",
          status: "planned",
          statusLabel: "In Planung",
          format: "2 Tage oder 4 × 3 Stunden",
          p: "Ein praxisnaher Kurs zu Assistenten und automatisierten Abläufen mit Freigaben und Fehlerbehandlung. Termine und Preis stehen noch nicht fest.",
        },
        {
          name: "KI für Führungskräfte",
          status: "planned",
          statusLabel: "In Planung",
          format: "Halber Tag",
          p: "Wo sich KI lohnt, wie Sie Vorhaben auswählen und welche Risiken Sie im Blick behalten. Termine und Preis stehen noch nicht fest.",
        },
      ],
      footnote: "Weitere Kurse in Planung: KI-Governance und Datenschutz, KI im Kundenservice, KI für Marketing und Vertrieb. Alle Preise netto zzgl. USt., nur für Unternehmen.",
    },
    {
      t: "principles",
      id: "gemeinsam",
      label: "Gemeinsam",
      note: "Vier Regeln für jedes Format.",
      h: "Was alle Schulungen gemeinsam haben.",
      lede: "Jede Schulung folgt denselben vier Regeln, egal ob Grundlagen oder Copilot.",
      items: [
        { h: "Ihre Aufgaben statt fremder Folien.", p: "Die Teilnehmenden arbeiten an Beispielen aus ihrem Alltag. Dafür fragen wir vorab nach Aufgaben und Vorwissen." },
        { h: "Kleine Gruppen.", p: "Bis zu 15 Personen bei KI-Kompetenz Basis, bis zu 12 beim Copilot-Praxistag. So bleibt Zeit für Fragen." },
        { h: "Keine echten Kundendaten.", p: "Geübt wird mit Beispieldaten oder mit Inhalten, die Sie ausdrücklich dafür freigeben." },
        { h: "Klare Grenzen.", p: "Wir sagen, was KI kann und was nicht. In den Schulungen verkaufen wir weder Lizenzen noch Produkte." },
      ],
    },
    {
      t: "spec",
      id: "format",
      label: "Format",
      h: "Wie die Schulungen ablaufen.",
      lede: "Alle Schulungen finden online und live statt, als eigener Termin nur für Ihr Team.",
      rows: [
        ["Durchführung", "Online live, per Microsoft Teams oder Zoom nach Absprache"],
        ["Sprache", "Deutsch oder Englisch"],
        ["Dauer", "Halber Tag (KI-Kompetenz Basis), 1 Tag (Copilot-Praxistag)"],
        ["Gruppe", "Bis zu 15 Personen (KI-Kompetenz Basis), bis zu 12 Personen (Copilot-Praxistag)"],
        ["Termine", "Nach Vereinbarung, als geschlossener Termin für Ihr Team"],
        ["Nachweis", "Eigene Teilnahmebescheinigung von OpSolid mit Datum, Dauer, Themen und Trainer"],
        ["Preis", "Pro Team, netto zzgl. USt., nur für Unternehmen"],
      ],
    },
    {
      t: "text",
      id: "ki-verordnung",
      label: "KI-Verordnung",
      note: "Einordnung, keine Rechtsberatung.",
      h: "Was Art. 4 der KI-Verordnung bedeutet.",
      lede: "Unternehmen, die KI einsetzen, ergreifen Maßnahmen, um die KI-Kompetenz ihrer Beschäftigten zu fördern.",
      paras: [
        "Das regelt Art. 4 der KI-Verordnung (EU). Die Vorschrift gilt seit dem 2. Februar 2025 und wurde durch die Verordnung (EU) 2026/1744 neu gefasst, die seit dem 27. Juli 2026 in Kraft ist.",
        "Ein Zertifikat ist nicht vorgeschrieben. Dokumentierte Maßnahmen sind gute Praxis: Sie zeigen, was Ihr Unternehmen getan hat, und lassen sich später belegen.",
        "Unsere Schulungen können Teil dieser Maßnahmen sein. Dafür stellen wir eine eigene Teilnahmebescheinigung aus. Das ist keine Rechtsberatung; für Ihre Einordnung wenden Sie sich an Ihre Rechtsberatung oder Ihren Datenschutzbeauftragten.",
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Ablauf",
      note: "Fünf Schritte bis zur Bescheinigung.",
      h: "Von der Anfrage zur Bescheinigung.",
      lede: "Sie wissen in jedem Schritt, was als Nächstes passiert und wer die Schulung hält.",
      items: [
        { h: "Anfrage", p: "Sie schildern Team, Aufgaben und Vorwissen. Wir empfehlen die passende Schulung und nennen den Preis." },
        { h: "Abstimmung der Inhalte", p: "Wir stimmen Beispiele, Sprache und Teilnehmerzahl mit Ihnen ab, damit die Schulung zu Ihrem Alltag passt." },
        {
          h: "Trainerin oder Trainer",
          p: "Wer Ihre Schulung hält, nennen wir Ihnen vor der Buchung namentlich. Das ist eine von uns ausgewählte freiberufliche Trainerin, ein von uns ausgewählter freiberuflicher Trainer oder OpSolid selbst.",
        },
        { h: "Termin", p: "Wir legen den Termin gemeinsam fest. Die Schulung findet online und live statt." },
        { h: "Teilnahmebescheinigung", p: "Nach der Schulung erhalten Sie die Bescheinigung für Ihre Unterlagen." },
      ],
    },
    {
      t: "rows",
      id: "weitere-wege",
      label: "Weitere Wege",
      note: "Je nach Ausgangslage.",
      h: "Wenn eine Schulung allein nicht reicht.",
      lede: "Manchmal ist ein anderer Schritt sinnvoller, oder Sie möchten selbst als Trainerin oder Trainer mitwirken.",
      items: [
        {
          h: "Erst den Ablauf klären.",
          p: "Im KI-Check (ab 490 € netto) klären wir in 90 Minuten remote, wo KI in Ihrem Alltag sinnvoll ist, und halten es in einem schriftlichen Kurzbericht fest. So sehen Sie, welche Schulung Ihrem Team nützt.",
          href: { label: "Zum KI-Check", to: "check" },
        },
        {
          h: "Abläufe automatisieren.",
          p: "Wenn Sie nicht nur Ihr Team schulen, sondern Abläufe mit KI verbessern wollen, beginnen Sie mit der KI-Beratung.",
          href: { label: "Zur KI-Beratung", to: "beratung" },
        },
        {
          h: "Sie unterrichten selbst KI?",
          p: "Wir bauen ein Netzwerk freiberuflicher KI-Trainerinnen und -Trainer auf, für Deutsch und Englisch, online. Auf der Seite „Trainer werden“ steht, was wir suchen und wie die Zusammenarbeit abläuft.",
          href: { label: "Trainer werden", to: "trainer" },
        },
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen zu den Schulungen.",
    items: [
      {
        q: "Was verlangt Art. 4 der KI-Verordnung von uns?",
        a: "Unternehmen, die KI einsetzen, ergreifen Maßnahmen, um die KI-Kompetenz ihrer Beschäftigten zu fördern. Wie diese Maßnahmen aussehen, entscheiden Sie; eine Schulung kann dazu gehören. Ein Zertifikat ist nicht vorgeschrieben. Das ist keine Rechtsberatung.",
      },
      {
        q: "Bekommen wir ein Zertifikat?",
        a: "Ein Zertifikat ist nicht vorgeschrieben. Sie erhalten von uns eine eigene Teilnahmebescheinigung mit Datum, Dauer, Themen und Trainer. Sie ist kein Zertifikat einer Behörde, einer Kammer oder eines Verbands.",
      },
      {
        q: "Welche Online-Werkzeuge nutzen Sie?",
        a: "Wir arbeiten mit Microsoft Teams oder Zoom, je nachdem, was Ihr Team kennt. Die Teilnahme ist im Browser oder in der App möglich.",
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
        q: "Wie groß darf die Gruppe sein?",
        a: "Bei KI-Kompetenz Basis bis zu 15 Personen, beim Copilot-Praxistag bis zu 12. Der Preis gilt pro Team, nicht pro Person. Für größere Teams sprechen Sie uns an.",
      },
      {
        q: "Wer hält die Schulung?",
        a: "Eine von uns ausgewählte freiberufliche Trainerin, ein von uns ausgewählter freiberuflicher Trainer oder OpSolid selbst. Den Namen nennen wir Ihnen vor der Buchung. Das Trainernetzwerk befindet sich im Aufbau.",
      },
    ],
  },
  cta: {
    label: "Schulung anfragen",
    h: "Welches Team soll sicherer mit KI arbeiten?",
    p: "Schreiben Sie uns kurz zu Team, Aufgaben und Sprache. Wir empfehlen die passende Schulung und nennen den Preis.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Zum KI-Check", to: "check" },
  },
  schema: {
    courses: [
      {
        name: "KI-Kompetenz Basis",
        description:
          "Online-Schulung für Teams: Grundlagen, Risiken, Datenschutz und Regeln im Umgang mit KI. Halber Tag, bis zu 15 Personen, live auf Deutsch oder Englisch, mit Teilnahmebescheinigung.",
        price: 1490,
      },
      {
        name: "Microsoft 365 Copilot Praxistag",
        description:
          "Online-Praxistag für Teams: Microsoft 365 Copilot in Outlook, Teams, Word, Excel und PowerPoint an eigenen Aufgaben. 1 Tag, bis zu 12 Personen, live auf Deutsch oder Englisch.",
        price: 2400,
        from: true,
      },
    ],
  },
};

const en: PageDef = {
  key: "schulungen",
  meta: {
    title: "AI training for teams: live online, English and German",
    description:
      "Live online AI training for your team: AI literacy basics €1,490 net, Copilot workshop from €2,400 net. In English or German, with a participation record.",
  },
  crumbs: [],
  crumb: "AI training",
  hero: {
    eyebrow: "AI training · online, live, English and German",
    h1: ["AI training for your ", "team", ", live online."],
    lede: "We train teams to work with AI safely: online, live, in English or German. Participants practise on their own tasks. We offer two courses today, more are planned.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "See the courses", to: "schulungen", hash: "angebot" },
    facts: ["AI literacy basics €1,490 net", "Copilot workshop from €2,400 net", "Our own participation record"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Sketch: nested rounded squares standing for learning steps that build on each other",
      caption: "Step by step, on your own tasks.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "courses",
      id: "angebot",
      label: "Courses",
      h: "Two courses to choose from, more will follow.",
      lede: "Choose by goal: basics for everyone, or Copilot in daily work. Both run online and live, per team.",
      items: [
        {
          name: "AI literacy basics",
          status: "bookable",
          statusLabel: "On request",
          format: "Half day · up to 15 people · per team",
          p: "Fundamentals, risks, data protection and everyday rules. Includes a participation record for your files.",
          price: "€1,490 net",
          href: { label: "View the course", to: "kompetenz" },
        },
        {
          name: "Microsoft 365 Copilot workshop",
          status: "bookable",
          statusLabel: "On request",
          format: "1 day · up to 12 people",
          p: "Copilot in Outlook, Teams, Word, Excel and PowerPoint, practised on tasks from your daily work.",
          price: "from €2,400 net",
          href: { label: "View the workshop", to: "copilot" },
        },
        {
          name: "AI agents & workflow automation",
          status: "planned",
          statusLabel: "Planned",
          format: "2 days or 4 × 3 hours",
          p: "A hands-on course on assistants and automated workflows, with approvals and error handling. Dates and price are not set yet.",
        },
        {
          name: "AI for managers",
          status: "planned",
          statusLabel: "Planned",
          format: "Half day",
          p: "Where AI pays off, how to choose projects and which risks to keep in view. Dates and price are not set yet.",
        },
      ],
      footnote: "More courses are planned: AI governance and data protection, AI in customer service, AI for marketing and sales. All prices net of VAT, businesses only.",
    },
    {
      t: "principles",
      id: "gemeinsam",
      label: "In common",
      note: "Four rules for every format.",
      h: "What every course has in common.",
      lede: "Every course follows the same four rules, whether it covers basics or Copilot.",
      items: [
        { h: "Your tasks, not someone else's slides.", p: "Participants work on examples from their own daily work. We ask for tasks and prior knowledge beforehand." },
        { h: "Small groups.", p: "Up to 15 people for AI literacy basics, up to 12 for the Copilot workshop. That leaves room for questions." },
        { h: "No real customer data.", p: "We practise with sample data or with content you explicitly release for the purpose." },
        { h: "Clear limits.", p: "We say what AI can do and what it cannot. In our training we sell neither licences nor products." },
      ],
    },
    {
      t: "spec",
      id: "format",
      label: "Format",
      h: "How the courses run.",
      lede: "All courses take place online and live, as a session just for your team.",
      rows: [
        ["Delivery", "Live online, via Microsoft Teams or Zoom by agreement"],
        ["Language", "English or German"],
        ["Duration", "Half day (AI literacy basics), 1 day (Copilot workshop)"],
        ["Group", "Up to 15 people (AI literacy basics), up to 12 people (Copilot workshop)"],
        ["Dates", "By agreement, as a closed session for your team"],
        ["Proof", "Our own participation record from OpSolid with date, duration, topics and trainer"],
        ["Price", "Per team, net of VAT, businesses only"],
      ],
    },
    {
      t: "text",
      id: "ki-verordnung",
      label: "AI Act",
      note: "Context, not legal advice.",
      h: "What Article 4 of the AI Act means.",
      lede: "Companies that use AI take measures to support the AI literacy of their staff.",
      paras: [
        "This is set out in Article 4 of the EU AI Act. It has applied since 2 February 2025 and was reworded by Regulation (EU) 2026/1744, which has been in force since 27 July 2026.",
        "No certificate is required. Documented measures are good practice: they show what your company has done and can be evidenced later.",
        "Our training can be one of those measures. We issue our own participation record for it. This is not legal advice; for your own assessment, please consult your legal counsel or data protection officer.",
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Process",
      note: "Five steps to the participation record.",
      h: "From enquiry to participation record.",
      lede: "At every step you know what comes next and who will teach.",
      items: [
        { h: "Enquiry", p: "You describe your team, tasks and prior knowledge. We recommend the right course and name the price." },
        { h: "Agreeing the content", p: "We agree examples, language and group size with you, so the course fits your daily work." },
        {
          h: "Trainer",
          p: "We name the person who will teach your course before you book. That is a freelance trainer we have selected, or OpSolid itself.",
        },
        { h: "Date", p: "We set the date together. The course takes place online and live." },
        { h: "Participation record", p: "After the course you receive the record for your files." },
      ],
    },
    {
      t: "rows",
      id: "weitere-wege",
      label: "Other routes",
      note: "Depending on where you start.",
      h: "When training alone is not enough.",
      lede: "Sometimes another step makes more sense, or you may want to teach with us yourself.",
      items: [
        {
          h: "Clarify the workflow first.",
          p: "In the AI check (from €490 net) we clarify in 90 minutes, remotely, where AI makes sense in your daily work and record it in a short written report. That shows which course will help your team.",
          href: { label: "To the AI check", to: "check" },
        },
        {
          h: "Automate workflows.",
          p: "If you want to improve workflows with AI, not only train your team, start with AI automation consulting.",
          href: { label: "To AI consulting", to: "beratung" },
        },
        {
          h: "Do you teach AI yourself?",
          p: "We are building a network of freelance AI trainers for English and German, online. The “Become a trainer” page explains what we look for and how we work together.",
          href: { label: "Become a trainer", to: "trainer" },
        },
      ],
    },
  ],
  faq: {
    label: "Common questions",
    h: "Common questions about the training.",
    items: [
      {
        q: "What does Article 4 of the AI Act require of us?",
        a: "Companies that use AI take measures to support the AI literacy of their staff. You decide what those measures look like, and a course can be one of them. No certificate is required. We do not give legal advice.",
      },
      {
        q: "Do we get a certificate?",
        a: "No certificate is required. You receive our own participation record with date, duration, topics and trainer. It is not issued by an authority, chamber or association.",
      },
      {
        q: "Which online tools do you use?",
        a: "Microsoft Teams or Zoom, whichever your team knows. You can join in the browser or in the app.",
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
        q: "How large can the group be?",
        a: "Up to 15 people for AI literacy basics, up to 12 for the Copilot workshop. The price is per team, not per person. For larger teams, please get in touch.",
      },
      {
        q: "Who teaches the course?",
        a: "A freelance trainer we have selected, or OpSolid itself. We name the person before you book. Our trainer network is still being built.",
      },
    ],
  },
  cta: {
    label: "Request training",
    h: "Which team should work with AI more safely?",
    p: "Tell us briefly about your team, tasks and language. We recommend the right course and name the price.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "To the AI check", to: "check" },
  },
  schema: {
    courses: [
      {
        name: "AI literacy basics",
        description:
          "Online training for teams: fundamentals, risks, data protection and rules for working with AI. Half day, up to 15 people, live in English or German, with a participation record.",
        price: 1490,
      },
      {
        name: "Microsoft 365 Copilot workshop",
        description:
          "Online hands-on day for teams: Microsoft 365 Copilot in Outlook, Teams, Word, Excel and PowerPoint on your own tasks. 1 day, up to 12 people, live in English or German.",
        price: 2400,
        from: true,
      },
    ],
  },
};

const tr: PageDef = {
  key: "schulungen",
  meta: {
    title: "Ekipler için YZ eğitimleri: çevrimiçi, Almanca ve İngilizce",
    description:
      "Ekibiniz için canlı YZ eğitimleri: Temel 1.490 € (net), Copilot Uygulama Günü 2.400 €'dan itibaren (net). Almanca veya İngilizce, katılım belgesiyle.",
  },
  crumbs: [],
  crumb: "YZ eğitimleri",
  hero: {
    eyebrow: "YZ eğitimleri · çevrimiçi, canlı, Almanca ve İngilizce",
    h1: ["Ekibiniz için ", "YZ eğitimleri", ", canlı ve çevrimiçi."],
    lede: "Ekiplerin YZ'yi güvenle kullanmasını sağlıyoruz: çevrimiçi, canlı, Almanca veya İngilizce. Çalışma, kendi görevleriniz üzerinde yapılır. İki eğitim sunuyoruz, diğerleri planlama aşamasında.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Eğitimlere bakın", to: "schulungen", hash: "angebot" },
    facts: ["YZ Yetkinliği Temel 1.490 € (net)", "Copilot Uygulama Günü 2.400 €'dan itibaren (net)", "Kendi katılım belgemiz"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Taslak: birbiri içine geçmiş yuvarlatılmış kareler, birbirini izleyen öğrenme adımlarını temsil eder",
      caption: "Adım adım, kendi görevleriniz üzerinde.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "courses",
      id: "angebot",
      label: "Eğitimler",
      h: "İki eğitim sunuyoruz, yenileri gelecek.",
      lede: "Hedefinize göre seçin: herkes için temeller ya da günlük işte Copilot. İkisi de çevrimiçi ve canlı, ekip başına.",
      items: [
        {
          name: "YZ Yetkinliği Temel",
          status: "bookable",
          statusLabel: "Talep üzerine",
          format: "Yarım gün · en fazla 15 kişi · ekip başına",
          p: "Temeller, riskler, veri koruma ve günlük iş için kurallar. Kayıtlarınız için bir katılım belgesi de verilir.",
          price: "1.490 € (net)",
          href: { label: "Eğitime bakın", to: "kompetenz" },
        },
        {
          name: "Microsoft 365 Copilot Uygulama Günü",
          status: "bookable",
          statusLabel: "Talep üzerine",
          format: "1 gün · en fazla 12 kişi",
          p: "Outlook, Teams, Word, Excel ve PowerPoint'te Copilot; günlük işinizden görevler üzerinde uygulamalı.",
          price: "2.400 €'dan itibaren (net)",
          href: { label: "Uygulama gününe bakın", to: "copilot" },
        },
        {
          name: "YZ ajanları ve iş akışı otomasyonu",
          status: "planned",
          statusLabel: "Planlamada",
          format: "2 gün veya 4 × 3 saat",
          p: "Asistanlar ve otomatik iş akışları üzerine, onay adımları ve hata yönetimiyle uygulamalı bir kurs. Tarihler ve fiyat henüz belli değil.",
        },
        {
          name: "Yöneticiler için YZ",
          status: "planned",
          statusLabel: "Planlamada",
          format: "Yarım gün",
          p: "YZ nerede değer yaratır, projeler nasıl seçilir, hangi risklere dikkat edilir. Tarihler ve fiyat henüz belli değil.",
        },
      ],
      footnote: "Planlanan diğer kurslar: YZ yönetişimi ve veri koruma, müşteri hizmetlerinde YZ, pazarlama ve satışta YZ. Tüm fiyatlar net, KDV hariç; yalnızca işletmeler için.",
    },
    {
      t: "principles",
      id: "gemeinsam",
      label: "Ortak noktalar",
      note: "Her format için dört kural.",
      h: "Tüm eğitimlerin ortak yanı.",
      lede: "Temeller de olsa Copilot da olsa, her eğitim aynı dört kurala uyar.",
      items: [
        { h: "Başkasının slaytları değil, sizin görevleriniz.", p: "Katılımcılar kendi günlük işlerinden örnekler üzerinde çalışır. Bunun için önceden görevleri ve ön bilgiyi sorarız." },
        { h: "Küçük gruplar.", p: "YZ Yetkinliği Temel'de en fazla 15, Copilot Uygulama Günü'nde en fazla 12 kişi. Böylece sorulara zaman kalır." },
        { h: "Gerçek müşteri verisi yok.", p: "Örnek verilerle ya da sizin bu amaçla açıkça paylaştığınız içeriklerle çalışılır." },
        { h: "Net sınırlar.", p: "YZ'nin neyi yapabildiğini ve neyi yapamadığını söyleriz. Eğitimlerde lisans da ürün de satmıyoruz." },
      ],
    },
    {
      t: "spec",
      id: "format",
      label: "Format",
      h: "Eğitimler nasıl işler.",
      lede: "Tüm eğitimler çevrimiçi ve canlı yapılır; yalnızca ekibinize özel bir oturum olarak.",
      rows: [
        ["Uygulama", "Canlı çevrimiçi; anlaşmaya göre Microsoft Teams veya Zoom"],
        ["Dil", "Almanca veya İngilizce"],
        ["Süre", "Yarım gün (YZ Yetkinliği Temel), 1 gün (Copilot Uygulama Günü)"],
        ["Grup", "En fazla 15 kişi (YZ Yetkinliği Temel), en fazla 12 kişi (Copilot Uygulama Günü)"],
        ["Tarih", "Anlaşmaya göre, ekibinize özel kapalı oturum olarak"],
        ["Belge", "Tarih, süre, konular ve eğitmeni içeren, OpSolid'e ait katılım belgesi"],
        ["Fiyat", "Ekip başına, net (KDV hariç), yalnızca işletmeler için"],
      ],
    },
    {
      t: "text",
      id: "ki-verordnung",
      label: "AB YZ Tüzüğü",
      note: "Genel bilgi, hukuki danışmanlık değildir.",
      h: "AB YZ Tüzüğü'nün 4. maddesi ne anlama gelir?",
      lede: "YZ kullanan şirketler, çalışanlarının YZ yetkinliğini desteklemek için önlemler alır.",
      paras: [
        "Bunu AB Yapay Zekâ Tüzüğü'nün 4. maddesi düzenler. Madde 2 Şubat 2025'ten beri geçerlidir; 27 Temmuz 2026'dan beri yürürlükte olan (AB) 2026/1744 sayılı Tüzük ile yeniden düzenlenmiştir.",
        "Sertifika zorunlu değildir. Belgelenmiş önlemler iyi uygulamadır: şirketinizin neler yaptığını gösterir ve sonradan kanıtlanabilir.",
        "Eğitimlerimiz bu önlemlerin bir parçası olabilir. Bunun için kendi katılım belgemizi düzenleriz. Bu hukuki danışmanlık değildir; değerlendirmeniz için hukuk danışmanınıza veya veri koruma görevlinize başvurun.",
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Süreç",
      note: "Belgeye giden beş adım.",
      h: "Talepten katılım belgesine.",
      lede: "Her adımda sırada ne olduğunu ve eğitimi kimin vereceğini bilirsiniz.",
      items: [
        { h: "Talep", p: "Ekibinizi, görevlerinizi ve ön bilginizi anlatırsınız. Size uygun eğitimi önerir ve fiyatı bildiririz." },
        { h: "İçeriğin belirlenmesi", p: "Eğitimin günlük işinize uyması için örnekleri, dili ve katılımcı sayısını sizinle birlikte belirleriz." },
        {
          h: "Eğitmen",
          p: "Eğitimi kimin vereceğini rezervasyondan önce adıyla bildiririz. Bu, bizim seçtiğimiz serbest çalışan bir eğitmen ya da OpSolid'in kendisidir.",
        },
        { h: "Tarih", p: "Tarihi birlikte belirleriz. Eğitim çevrimiçi ve canlı yapılır." },
        { h: "Katılım belgesi", p: "Eğitimden sonra kayıtlarınız için belgeyi alırsınız." },
      ],
    },
    {
      t: "rows",
      id: "weitere-wege",
      label: "Diğer yollar",
      note: "Başlangıç noktanıza göre.",
      h: "Eğitim tek başına yetmediğinde.",
      lede: "Bazen başka bir adım daha mantıklıdır; ya da siz de eğitmen olarak bizimle çalışmak istersiniz.",
      items: [
        {
          h: "Önce iş akışını netleştirin.",
          p: "YZ Kontrolü'nde (490 €'dan itibaren (net)) 90 dakikalık uzaktan görüşmede günlük işinizde YZ'nin nerede anlamlı olduğunu netleştirir ve kısa bir yazılı raporda toplarız. Böylece hangi eğitimin ekibinize yararlı olacağını görürsünüz.",
          href: { label: "YZ Kontrolü'ne gidin", to: "check" },
        },
        {
          h: "İş akışlarını otomatikleştirin.",
          p: "Yalnızca ekibinizi eğitmek değil, iş akışlarını YZ ile iyileştirmek de istiyorsanız YZ danışmanlığıyla başlayın.",
          href: { label: "YZ danışmanlığına gidin", to: "beratung" },
        },
        {
          h: "YZ eğitimi veriyor musunuz?",
          p: "Çevrimiçi, Almanca ve İngilizce eğitim verecek serbest çalışan YZ eğitmenlerinden oluşan bir ağ kuruyoruz. “Eğitmen olun” sayfasında neyi aradığımızı ve işbirliğinin nasıl işlediğini bulabilirsiniz.",
          href: { label: "Eğitmen olun", to: "trainer" },
        },
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Eğitimler hakkında sık sorulan sorular.",
    items: [
      {
        q: "YZ Tüzüğü'nün 4. maddesi bizden ne istiyor?",
        a: "YZ kullanan şirketler, çalışanlarının YZ yetkinliğini desteklemek için önlemler alır. Bu önlemlerin nasıl olacağına siz karar verirsiniz; bir eğitim bunlardan biri olabilir. Sertifika zorunlu değildir. Hukuki danışmanlık vermiyoruz.",
      },
      {
        q: "Sertifika alıyor muyuz?",
        a: "Sertifika zorunlu değildir. Bizden tarih, süre, konular ve eğitmeni içeren kendi katılım belgemizi alırsınız. Bu belge bir kurum, oda veya dernek sertifikası değildir.",
      },
      {
        q: "Hangi çevrimiçi araçları kullanıyorsunuz?",
        a: "Ekibinizin bildiğine göre Microsoft Teams veya Zoom. Tarayıcıdan ya da uygulamadan katılabilirsiniz.",
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
        q: "Grup ne kadar büyük olabilir?",
        a: "YZ Yetkinliği Temel'de en fazla 15, Copilot Uygulama Günü'nde en fazla 12 kişi. Fiyat kişi başına değil, ekip başınadır. Daha büyük ekipler için bize yazın.",
      },
      {
        q: "Eğitimi kim veriyor?",
        a: "Bizim seçtiğimiz serbest çalışan bir eğitmen ya da OpSolid'in kendisi. Adını rezervasyondan önce bildiririz. Eğitmen ağımız hâlâ kurulum aşamasındadır.",
      },
    ],
  },
  cta: {
    label: "Eğitim talep edin",
    h: "Hangi ekip YZ ile daha güvenle çalışmalı?",
    p: "Ekibiniz, görevleriniz ve dil hakkında kısaca yazın. Size uygun eğitimi önerir ve fiyatı bildiririz.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "YZ Kontrolü'ne gidin", to: "check" },
  },
  schema: {
    courses: [
      {
        name: "YZ Yetkinliği Temel",
        description:
          "Ekipler için çevrimiçi eğitim: YZ ile çalışmanın temelleri, riskleri, veri koruma ve kurallar. Yarım gün, en fazla 15 kişi, Almanca veya İngilizce canlı, katılım belgesiyle.",
        price: 1490,
      },
      {
        name: "Microsoft 365 Copilot Uygulama Günü",
        description:
          "Ekipler için çevrimiçi uygulama günü: Outlook, Teams, Word, Excel ve PowerPoint'te Microsoft 365 Copilot, kendi görevleriniz üzerinde. 1 gün, en fazla 12 kişi, Almanca veya İngilizce canlı.",
        price: 2400,
        from: true,
      },
    ],
  },
};

export const page: PageSet = { de, en, tr };
