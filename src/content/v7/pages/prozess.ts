/**
 * Prozessautomatisierung (key "prozess", /ki-beratung/prozessautomatisierung). Includes the internal-tools
 * section (#interne-tools, formerly /interne-tools). German is the source; EN and TR are transcreations.
 * No prices on the page except the published KI-Check "ab 490 €"; the pilot has no number.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "prozess",
  meta: {
    title: "Prozessautomatisierung: Daten nur einmal erfassen",
    description:
      "Prozessautomatisierung für Unternehmen: Wir messen den Ablauf, bauen einen Pilot zum Festpreis und übergeben ihn mit Dokumentation. KI-Check ab 490 € netto.",
  },
  crumbs: ["beratung"],
  crumb: "Prozessautomatisierung",
  hero: {
    eyebrow: "KI-Beratung · Prozessautomatisierung",
    h1: ["Daten nur ", "einmal", " erfassen."],
    lede: "Wir automatisieren wiederkehrende Abläufe zwischen E-Mail, Excel, CRM und ERP. Zuerst messen wir, wie der Ablauf heute läuft. Dann bauen wir einen Pilot zum Festpreis und übergeben ihn mit Dokumentation.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zu den internen Werkzeugen", to: "prozess", hash: "interne-tools" },
    facts: ["KI-Check ab 490 € netto", "Pilot zum Festpreis, vorab schriftlich", "Übergabe mit Dokumentation"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Skizze eines Ablaufs in vier Stationen: Eingang, Regeln, Entwurf, Mensch",
      caption: "Der Mensch entscheidet. Die Routine läuft von allein.",
      fig: "1.1",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "ausgangslage",
      label: "Ausgangslage",
      note: "Wo derselbe Datensatz mehrfach angefasst wird.",
      h: "Wo dieselben Daten zweimal getippt werden.",
      lede: "Automatisierung lohnt sich zuerst dort, wo ein Mensch Daten von einem System ins nächste überträgt.",
      items: [
        { h: "Aus der E-Mail wird eine Tabellenzeile.", p: "Anfragen und Bestellungen kommen per Postfach und werden von Hand in Excel oder ins CRM übertragen." },
        { h: "Das Angebot entsteht in drei Programmen.", p: "Kundendaten, Preise und Texte werden aus verschiedenen Quellen zusammenkopiert und dann von Hand versendet." },
        { h: "Der Bericht entsteht jede Woche neu.", p: "Zahlen werden aus mehreren Systemen exportiert, zusammengeführt und formatiert, bevor sie jemand liest." },
        { h: "Niemand weiß, welche Liste stimmt.", p: "Mehrere Personen pflegen dieselbe Tabelle. Änderungen gehen verloren, und Freigaben laufen per Zuruf." },
      ],
    },
    {
      t: "examples",
      id: "ablaeufe",
      label: "Typische Abläufe",
      note: "Beispiel-Szenarien, keine Kundenprojekte.",
      h: "Fünf Abläufe, die sich oft zuerst lohnen.",
      lede: "Wir wählen den Ablauf, bei dem Aufwand und Nutzen am besten zusammenpassen. Diese fünf zeigen, wie das aussehen kann.",
      tag: "Beispiel-Szenario",
      items: [
        {
          area: "Anfragen & E-Mails",
          h: "Eingänge sortieren und weiterleiten",
          before: "Anfragen kommen per Postfach und werden von Hand in die richtige Ablage verschoben.",
          after: "Eingehende Mails werden nach Thema gekennzeichnet und als Vorgang im richtigen System angelegt.",
          human: "Ihr Team beantwortet den Vorgang. Auf Wunsch liegt ein Antwortentwurf bereit.",
          href: { label: "Weitere Anwendungsfälle", to: "anwendungen" },
        },
        {
          area: "Angebote & Aufträge",
          h: "Vom Anfragedatensatz zum Angebot",
          before: "Das Angebot wird aus CRM-Daten, Preisliste und Vorlage von Hand zusammengestellt.",
          after: "Die Vorlage füllt sich aus den Kundendaten und geht in die Freigabe.",
          human: "Eine Person prüft das Angebot und gibt es frei.",
        },
        {
          area: "Belege & Rechnungen",
          h: "Belege auslesen und zuordnen",
          before: "Rechnungen und Lieferscheine werden abgetippt und von Hand abgelegt.",
          after: "Die Angaben werden ausgelesen, geprüft und dort eingetragen, wo sie hingehören.",
          human: "Auffälligkeiten und Abweichungen prüft eine Person.",
        },
        {
          area: "Termine & Erinnerungen",
          h: "Bestätigen, erinnern, nachfassen",
          before: "Bestätigungen und Erinnerungen werden einzeln geschrieben, und das Nachfassen geht unter.",
          after: "Bestätigung, Erinnerung und Nachfassen laufen nach festen Regeln aus dem Kalender.",
          human: "Absagen und Sonderwünsche übernimmt Ihr Team.",
        },
        {
          area: "Berichte",
          h: "Auswertungen automatisch erzeugen",
          before: "Zahlen werden jede Woche aus mehreren Systemen exportiert und von Hand zusammengeführt.",
          after: "Der Bericht entsteht zum festen Zeitpunkt aus den Quellsystemen und geht an die Empfänger.",
          human: "Ihr Team bewertet die Zahlen und entscheidet.",
        },
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Vorgehen",
      note: "Vier Schritte, nach jedem entscheiden Sie.",
      h: "Erst messen, dann bauen.",
      lede: "Wir beginnen mit einem einzelnen Ablauf und messen ihn, bevor wir etwas automatisieren. Nach jedem Schritt entscheiden Sie, ob es weitergeht.",
      cta: { label: "Den KI-Check ansehen", to: "check" },
      steps: [
        {
          name: "Messen",
          h: "Ablauf aufnehmen und messen",
          p: "Workshop mit den Menschen, die die Arbeit machen. Wir halten fest, wie der Ablauf wirklich läuft: Übergaben, Werkzeuge, Daten und Ausnahmen.",
          result: "Eine Ausgangslage, die Ihr Team prüfen kann, und die Entscheidung, was automatisiert wird und was bewusst manuell bleibt.",
          meta: "im KI-Check",
        },
        {
          name: "Pilot",
          h: "Ein Ablauf geht live",
          p: "Wir bauen die erste Automatisierung und testen sie im Alltag. Umfang und Festpreis stehen vorab schriftlich fest.",
          result: "Eine laufende Automatisierung mit Protokoll, Fehlerbehandlung und manuellem Rückfall.",
          meta: "Festpreis, vorab schriftlich",
        },
        {
          name: "Einführung",
          h: "Vom Pilot in den Alltag",
          p: "Wenn der Pilot trägt, übertragen wir ihn auf weitere Abteilungen oder Abläufe und arbeiten die Erfahrungen aus dem Alltag ein.",
          result: "Der Ablauf läuft im ganzen Team, nicht nur im Test.",
          meta: "nach dem Pilot, auf Wunsch",
        },
        {
          name: "Übergabe",
          h: "Dokumentation und Quellcode",
          p: "Dokumentation, Zugänge und, soweit vorhanden, der Quellcode gehen an Ihr Team. Auf Wunsch betreuen wir die Lösung weiter.",
          result: "Ihr Team erhält, was es braucht, um den Ablauf selbst zu betreiben.",
          meta: "Betrieb monatlich nach Vereinbarung",
        },
      ],
    },
    {
      t: "spec",
      id: "werkzeuge",
      label: "Werkzeuge",
      h: "Werkzeuge, die zu Ihrem Ablauf passen.",
      lede: "Wir bauen mit dem, was bei Ihnen schon im Haus ist, und ergänzen nur, wo es nötig ist.",
      rows: [
        ["Microsoft Power Automate", "Wenn Microsoft 365 im Haus ist: Freigaben, Dokumente und Postfach-Regeln. Mehr dazu auf der Seite zu Microsoft 365."],
        ["Make", "Für Verbindungen zwischen Cloud-Diensten, wenn kein Standard-Connector reicht."],
        ["n8n", "Für Abläufe mit sensiblen Daten: selbst gehostet auf einem Server in der EU möglich."],
        ["Python", "Für Sonderfälle: Dateien auslesen, Daten prüfen, Berichte erzeugen."],
        ["CRM- und ERP-Anbindung", "Über Schnittstellen und Webhooks, damit Daten einmal erfasst und überall genutzt werden."],
        ["Hosting", "In der EU, auf Wunsch bei einem Anbieter Ihrer Wahl oder auf Ihrer eigenen Infrastruktur."],
      ],
      footnote: "Wir verkaufen keine Lizenzen. Konten und Zugänge liegen bei Ihnen.",
    },
    {
      t: "compare",
      id: "vorher-nachher",
      label: "Vorher und nachher",
      note: "Ein Beispiel, kein Kundenfall.",
      h: "Derselbe Ablauf, von Hand und automatisiert.",
      lede: "Als Beispiel: Eine Anfrage kommt per E-Mail und soll zum Angebot werden.",
      tag: "Beispiel-Szenario",
      before: {
        h: "Heute von Hand",
        items: [
          "Die Anfrage wird gelesen und in eine Tabelle übertragen.",
          "Kundendaten werden im CRM gesucht oder neu angelegt.",
          "Das Angebot wird aus einer Vorlage zusammenkopiert.",
          "Das PDF geht per Mail raus. Das Nachfassen steht im Kalender, wenn jemand daran denkt.",
        ],
      },
      after: {
        h: "Nach der Automatisierung",
        items: [
          "Die Anfrage wird erkannt und als Vorgang angelegt. Die Daten stehen einmal im CRM.",
          "Das Angebot wird aus den Kundendaten vorbereitet.",
          "Eine Person prüft und gibt frei.",
          "Versand und Nachfass-Erinnerung laufen nach festen Regeln. Jeder Schritt ist protokolliert.",
        ],
      },
    },
    {
      t: "rows",
      id: "interne-tools",
      label: "Interne Werkzeuge",
      note: "Wenn die Tabelle nicht mehr reicht.",
      h: "Aus der Excel-Liste wird ein Werkzeug.",
      lede: "Manche Abläufe passen in keine Standard-Software. Dann bauen wir ein kleines, fokussiertes Werkzeug für genau diesen Ablauf, statt eine weitere Plattform mit Monatsabo pro Nutzer einzuführen. Fertige Software ist oft die bessere Wahl, und das sagen wir Ihnen vorher.",
      items: [
        { h: "Admin-Konsolen", p: "Aufträge, Ausnahmen und Kundennotizen an einem Ort statt in drei Tabs." },
        { h: "Dashboards", p: "Kennzahlen und Warnungen aus CRM, ERP und Finanzsystem in einer Ansicht, ohne Handarbeit." },
        { h: "Freigaben und Formulare", p: "Angebote, Verträge oder Erstattungen einreihen, weiterleiten und mit Verlauf freigeben." },
        { h: "Wissensdatenbanken", p: "Suche in Ihren eigenen Dokumenten, Richtlinien und FAQs." },
        {
          tag: "Eigene Arbeit",
          h: "OpSo",
          p: "Für OpSo, unser eigenes Produkt in der Testphase, haben wir Dashboard, Onboarding und Admin-Konsole selbst entwickelt.",
          href: { label: "Unsere Projekte", to: "projekte" },
        },
      ],
    },
    {
      t: "principles",
      id: "absicherung",
      label: "Absicherung",
      note: "Auch der Fehlerfall ist geplant.",
      h: "Was wir für den Fehlerfall einplanen.",
      lede: "Eine Automatisierung muss auch dann ruhig weiterlaufen, wenn etwas schiefgeht. Deshalb planen wir den Fehlerfall von Anfang an mit.",
      items: [
        { h: "Protokoll.", p: "Jeder Lauf wird festgehalten, damit Ihr Team nachvollziehen kann, was passiert ist." },
        { h: "Manueller Rückfall.", p: "Fällt ein Schritt aus, landet der Vorgang bei einer Person, statt zu verschwinden." },
        {
          h: "Daten mit Plan.",
          p: "Vor dem Start klären wir, wo Daten verarbeitet werden, und schließen die nötigen Verträge (AVV). Die abschließende Bewertung trifft Ihr Datenschutzbeauftragter.",
        },
        {
          h: "Übergabe statt Abhängigkeit.",
          p: "Dokumentation und, soweit vorhanden, Quellcode gehen an Ihr Team. Wir bauen so, dass Sie die Lösung auch ohne uns betreiben können. Was übergeben wird, halten wir vor dem Start schriftlich fest.",
        },
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Fragen zur Prozessautomatisierung.",
    items: [
      {
        q: "Brauchen wir dafür KI?",
        a: "Nicht immer. Oft reicht eine saubere Automatisierung ohne KI. Wo KI hilft, etwa beim Auslesen von Belegen oder beim Sortieren von Mails, prüft eine Person das Ergebnis.",
      },
      {
        q: "Was ist ein typisches erstes Projekt?",
        a: "Ein einzelner Ablauf mit großem Hebel, zum Beispiel die Angebotserstellung, die Mail-Sortierung oder ein Wochenbericht. Welcher zuerst dran ist, klären wir im KI-Check.",
      },
      {
        q: "Was kostet das?",
        a: "Das Kennenlernen ist kostenlos und unverbindlich. Der KI-Check kostet ab 490 € netto: 90 Minuten remote plus schriftlicher Kurzbericht, NDA vor der Analyse. Für den Pilot legen wir Umfang und Festpreis vorab schriftlich fest. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Was, wenn sich der Ablauf später ändert?",
        a: "Wir dokumentieren so, dass Ihr Team oder Ihre IT Anpassungen selbst vornehmen kann. Für größere Änderungen gibt es auf Wunsch einen monatlichen Rahmen nach Vereinbarung.",
      },
      {
        q: "Ist es sicher, kritische Abläufe zu automatisieren?",
        a: "Wir planen für den Fehlerfall, nicht nur für den Idealfall: mit Protokoll, Fehlerbehandlung und manuellem Rückfall. Kritische Schritte, etwa Freigaben, bleiben bei einer Person.",
      },
      {
        q: "Wo laufen die Automatisierungen?",
        a: "Bei Ihnen oder auf Servern in der EU, je nach Werkzeug und Daten. Das legen wir vor dem Start schriftlich fest.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Welcher Ablauf soll als Erstes entlastet werden?",
    p: "Beschreiben Sie ihn in wenigen Sätzen. Im Kennenlernen klären wir, ob ein KI-Check sinnvoll ist. Der KI-Check zeigt, ob sich die Automatisierung lohnt. Wenn nicht, steht auch das im Bericht.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
  },
  schema: {
    service: {
      name: "Prozessautomatisierung",
      serviceType: "Prozessautomatisierung",
      description:
        "Automatisierung wiederkehrender Abläufe zwischen E-Mail, Excel, CRM und ERP: Ablauf messen, Pilot bauen, einführen und mit Dokumentation übergeben. Dazu interne Werkzeuge wie Admin-Konsolen und Dashboards.",
    },
  },
};

const en: PageDef = {
  key: "prozess",
  meta: {
    title: "Process automation: enter your data only once",
    description:
      "Process automation for companies: we measure the workflow, build a pilot at a fixed price and hand it over with documentation. AI check from €490 net.",
  },
  crumbs: ["beratung"],
  crumb: "Process automation",
  hero: {
    eyebrow: "AI automation consulting · Process automation",
    h1: ["Enter your data ", "once", "."],
    lede: "We automate recurring workflows between email, Excel, CRM and ERP. First we measure how the workflow runs today. Then we build a pilot at a fixed price and hand it over with documentation.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "On to internal tools", to: "prozess", hash: "interne-tools" },
    facts: ["AI check from €490 net", "Pilot at a fixed price, agreed in writing beforehand", "Handover with documentation"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Sketch of a workflow in four stations: input, rules, draft, person",
      caption: "A person decides. The routine runs on its own.",
      fig: "1.1",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "ausgangslage",
      label: "Starting point",
      note: "Where the same record gets handled more than once.",
      h: "Where the same data gets typed twice.",
      lede: "Automation pays off first where a person moves data from one system into the next.",
      items: [
        { h: "An email becomes a spreadsheet row.", p: "Requests and orders arrive in a mailbox and are copied by hand into Excel or the CRM." },
        { h: "A quote is built in three programs.", p: "Customer data, prices and text are pasted together from different sources and then sent by hand." },
        { h: "The report is rebuilt every week.", p: "Figures are exported from several systems, merged and formatted before anyone reads them." },
        { h: "Nobody knows which list is right.", p: "Several people maintain the same spreadsheet. Changes get lost and approvals happen by word of mouth." },
      ],
    },
    {
      t: "examples",
      id: "ablaeufe",
      label: "Typical flows",
      note: "Example scenarios, not client projects.",
      h: "Five workflows that often pay off first.",
      lede: "We pick the workflow where effort and benefit match best. These five show what that can look like.",
      tag: "Example scenario",
      items: [
        {
          area: "Requests & email",
          h: "Sort and route incoming mail",
          before: "Requests arrive in a mailbox and are moved to the right place by hand.",
          after: "Incoming mail is tagged by topic and created as a case in the right system.",
          human: "Your team answers the case. A draft reply is ready on request.",
          href: { label: "More use cases", to: "anwendungen" },
        },
        {
          area: "Quotes & orders",
          h: "From inquiry record to quote",
          before: "The quote is assembled by hand from CRM data, a price list and a template.",
          after: "The template fills itself from the customer data and goes to approval.",
          human: "A person checks the quote and approves it.",
        },
        {
          area: "Receipts & invoices",
          h: "Read and assign receipts",
          before: "Invoices and delivery notes are retyped and filed by hand.",
          after: "The details are read out, checked and entered where they belong.",
          human: "A person reviews anything unusual or inconsistent.",
        },
        {
          area: "Appointments & reminders",
          h: "Confirm, remind, follow up",
          before: "Confirmations and reminders are written one by one, and follow-ups get lost.",
          after: "Confirmation, reminder and follow-up run on fixed rules from the calendar.",
          human: "Your team handles cancellations and special requests.",
        },
        {
          area: "Reports",
          h: "Generate evaluations automatically",
          before: "Figures are exported from several systems every week and merged by hand.",
          after: "The report is produced at a fixed time from the source systems and sent to its recipients.",
          human: "Your team judges the figures and decides.",
        },
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Approach",
      note: "Four steps, you decide after each.",
      h: "Measure first, then build.",
      lede: "We start with a single workflow and measure it before we automate anything. After each step you decide whether to continue.",
      cta: { label: "See the AI check", to: "check" },
      steps: [
        {
          name: "Measure",
          h: "Map and measure the workflow",
          p: "A workshop with the people who do the work. We record how the workflow really runs: handovers, tools, data and exceptions.",
          result: "A baseline your team can verify, and a decision on what gets automated and what deliberately stays manual.",
          meta: "in the AI check",
        },
        {
          name: "Pilot",
          h: "One workflow goes live",
          p: "We build the first automation and test it in daily work. Scope and fixed price are agreed in writing beforehand.",
          result: "A running automation with a log, error handling and a manual fallback.",
          meta: "fixed price, in writing first",
        },
        {
          name: "Rollout",
          h: "From pilot to daily work",
          p: "If the pilot holds, we carry it over to further departments or workflows and work in what daily use has taught us.",
          result: "The workflow runs across the whole team, not just in a test.",
          meta: "after the pilot, on request",
        },
        {
          name: "Handover",
          h: "Documentation and source code",
          p: "Documentation, access and, where there is any, source code go to your team. If you want, we keep looking after the solution.",
          result: "Your team gets what it needs to run the workflow itself.",
          meta: "operation monthly by agreement",
        },
      ],
    },
    {
      t: "spec",
      id: "werkzeuge",
      label: "Tools",
      h: "Tools that fit your workflow.",
      lede: "We build with what you already have and add only where needed.",
      rows: [
        ["Microsoft Power Automate", "Where Microsoft 365 is in place: approvals, documents and mailbox rules. More on the Microsoft 365 page."],
        ["Make", "For connections between cloud services when no standard connector is enough."],
        ["n8n", "For workflows with sensitive data: can be self-hosted on a server in the EU."],
        ["Python", "For special cases: reading files, checking data, generating reports."],
        ["CRM and ERP connections", "Through interfaces and webhooks, so data is captured once and used everywhere."],
        ["Hosting", "In the EU, on request with a provider of your choice or on your own infrastructure."],
      ],
      footnote: "We do not sell licences. Accounts and access stay with you.",
    },
    {
      t: "compare",
      id: "vorher-nachher",
      label: "Before and after",
      note: "An example, not a client case.",
      h: "The same workflow, by hand and automated.",
      lede: "As an example: an inquiry arrives by email and is meant to become a quote.",
      tag: "Example scenario",
      before: {
        h: "Today, by hand",
        items: [
          "The inquiry is read and copied into a spreadsheet.",
          "Customer data is looked up in the CRM or created anew.",
          "The quote is pasted together from a template.",
          "The PDF goes out by email. The follow-up sits in the calendar, if someone remembers.",
        ],
      },
      after: {
        h: "After automation",
        items: [
          "The inquiry is recognised and created as a case. The data sits in the CRM once.",
          "The quote is prepared from the customer data.",
          "A person checks and approves.",
          "Sending and the follow-up reminder run on fixed rules. Every step is logged.",
        ],
      },
    },
    {
      t: "rows",
      id: "interne-tools",
      label: "Internal tools",
      note: "When the spreadsheet is no longer enough.",
      h: "From Excel list to a proper tool.",
      lede: "Some workflows fit no standard software. Then we build a small, focused tool for exactly that workflow instead of adding another platform with a monthly fee per user. Off-the-shelf software is often the better choice, and we tell you so up front.",
      items: [
        { h: "Admin consoles", p: "Orders, exceptions and customer notes in one place instead of three tabs." },
        { h: "Dashboards", p: "Key figures and alerts from CRM, ERP and finance system in one view, without manual work." },
        { h: "Approvals and forms", p: "Queue, route and approve quotes, contracts or refunds with a full history." },
        { h: "Knowledge bases", p: "Search across your own documents, policies and FAQs." },
        {
          tag: "Our own work",
          h: "OpSo",
          p: "For OpSo, our own product in its test phase, we built the dashboard, onboarding and admin console ourselves.",
          href: { label: "Our projects", to: "projekte" },
        },
      ],
    },
    {
      t: "principles",
      id: "absicherung",
      label: "Safeguards",
      note: "The failure case is planned too.",
      h: "What we plan for when something fails.",
      lede: "An automation has to keep running calmly even when something goes wrong. That is why we plan for failure from the start.",
      items: [
        { h: "A log.", p: "Every run is recorded so your team can see what happened." },
        { h: "Manual fallback.", p: "If a step fails, the case lands with a person instead of disappearing." },
        {
          h: "Data with a plan.",
          p: "Before we start, we clarify where data is processed and sign the necessary agreements (DPA). The final assessment is made by your data protection officer.",
        },
        {
          h: "Handover, not dependency.",
          p: "Documentation and, where there is any, source code go to your team. We build so that you can run the solution without us. What is handed over, we put in writing before we start.",
        },
      ],
    },
  ],
  faq: {
    label: "Common questions",
    h: "Questions about process automation.",
    items: [
      {
        q: "Do we need AI for this?",
        a: "Not always. A clean automation without AI is often enough. Where AI helps, for example reading receipts or sorting mail, a person checks the result.",
      },
      {
        q: "What does a typical first project look like?",
        a: "A single workflow with a big lever, for example quote creation, mail sorting or a weekly report. Which one comes first, we clarify in the AI check.",
      },
      {
        q: "What does it cost?",
        a: "Getting to know each other is free and non-binding. The AI check costs from €490 net: 90 minutes remote plus a short written report, NDA before the analysis. For the pilot we agree scope and a fixed price in writing beforehand. All prices net of VAT, businesses only.",
      },
      {
        q: "What if the workflow changes later?",
        a: "We document so that your team or your IT can make adjustments themselves. For larger changes there is an optional monthly arrangement by agreement.",
      },
      {
        q: "Is it safe to automate critical workflows?",
        a: "We plan for failure, not only for the ideal case: with a log, error handling and a manual fallback. Critical steps, such as approvals, stay with a person.",
      },
      {
        q: "Where do the automations run?",
        a: "With you or on servers in the EU, depending on the tool and the data. We settle this in writing before we start.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Which workflow should be relieved first?",
    p: "Describe it in a few sentences. In our first conversation we clarify whether an AI check makes sense. The AI check shows whether automation pays off. If it does not, the report says so.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Back to AI automation consulting", to: "beratung" },
  },
  schema: {
    service: {
      name: "Process automation",
      serviceType: "Process automation",
      description:
        "Automation of recurring workflows between email, Excel, CRM and ERP: measure the workflow, build a pilot, roll it out and hand it over with documentation. Also internal tools such as admin consoles and dashboards.",
    },
  },
};

const tr: PageDef = {
  key: "prozess",
  meta: {
    title: "Süreç otomasyonu: veriyi yalnızca bir kez girin",
    description:
      "Şirketler için süreç otomasyonu: iş akışını ölçer, sabit fiyatlı bir pilot kurar ve dokümantasyonla teslim ederiz. YZ Kontrolü 490 €'dan itibaren (net).",
  },
  crumbs: ["beratung"],
  crumb: "Süreç otomasyonu",
  hero: {
    eyebrow: "YZ danışmanlığı · Süreç otomasyonu",
    h1: ["Veriyi yalnızca ", "bir kez", " girin."],
    lede: "E-posta, Excel, CRM ve ERP arasında tekrar eden iş akışlarını otomatikleştiriyoruz. Önce iş akışının bugün nasıl işlediğini ölçüyoruz. Ardından sabit fiyatlı bir pilot kuruyor ve dokümantasyonla birlikte teslim ediyoruz.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Şirket içi araçlara geçin", to: "prozess", hash: "interne-tools" },
    facts: ["YZ Kontrolü 490 €'dan itibaren (net)", "Sabit fiyatlı pilot, önceden yazılı", "Dokümantasyonla teslim"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Dört istasyonlu bir iş akışı çizimi: giriş, kurallar, taslak, kişi",
      caption: "Kararı insan verir. Rutin kendiliğinden işler.",
      fig: "1.1",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "ausgangslage",
      label: "Başlangıç durumu",
      note: "Aynı kaydın birden fazla kez ele alındığı yerler.",
      h: "Aynı verinin iki kez girildiği yerler.",
      lede: "Otomasyon önce, bir kişinin veriyi bir sistemden ötekine elle taşıdığı yerde karşılığını verir.",
      items: [
        { h: "E-posta bir tablo satırına dönüşüyor.", p: "Talepler ve siparişler e-posta kutusuna gelir, elle Excel'e veya CRM'e aktarılır." },
        { h: "Teklif üç programda hazırlanıyor.", p: "Müşteri verileri, fiyatlar ve metinler farklı kaynaklardan kopyalanır, sonra elle gönderilir." },
        { h: "Rapor her hafta baştan hazırlanıyor.", p: "Rakamlar birkaç sistemden dışa aktarılır, birleştirilir ve biçimlendirilir; ancak sonra biri okur." },
        { h: "Hangi listenin doğru olduğunu kimse bilmiyor.", p: "Birkaç kişi aynı tabloyu günceller. Değişiklikler kaybolur, onaylar sözlü yürür." },
      ],
    },
    {
      t: "examples",
      id: "ablaeufe",
      label: "Tipik iş akışları",
      note: "Örnek senaryolar, müşteri projesi değil.",
      h: "Çoğu zaman önce karşılık veren beş iş akışı.",
      lede: "Emek ile faydanın en iyi örtüştüğü iş akışını seçiyoruz. Bu beşi, bunun nasıl görünebileceğini gösteriyor.",
      tag: "Örnek senaryo",
      items: [
        {
          area: "Talepler ve e-posta",
          h: "Gelen e-postaları sıralamak ve yönlendirmek",
          before: "Talepler e-posta kutusuna gelir ve elle doğru yere taşınır.",
          after: "Gelen e-postalar konuya göre etiketlenir ve doğru sistemde bir kayıt olarak açılır.",
          human: "Kaydı ekibiniz yanıtlar. İsterseniz yanıt taslağı hazır bekler.",
          href: { label: "Diğer kullanım örnekleri", to: "anwendungen" },
        },
        {
          area: "Teklifler ve siparişler",
          h: "Talep kaydından teklife",
          before: "Teklif; CRM verileri, fiyat listesi ve şablondan elle derlenir.",
          after: "Şablon müşteri verilerinden dolar ve onaya gider.",
          human: "Bir kişi teklifi kontrol eder ve onaylar.",
        },
        {
          area: "Belgeler ve faturalar",
          h: "Belgeleri okumak ve doğru yere işlemek",
          before: "Faturalar ve irsaliyeler yeniden yazılır, elle dosyalanır.",
          after: "Bilgiler okunur, kontrol edilir ve ait oldukları yere kaydedilir.",
          human: "Dikkat çeken ve tutmayan kayıtları bir kişi inceler.",
        },
        {
          area: "Randevular ve hatırlatmalar",
          h: "Onaylamak, hatırlatmak, takip etmek",
          before: "Onaylar ve hatırlatmalar tek tek yazılır, takip unutulur.",
          after: "Onay, hatırlatma ve takip, takvimden sabit kurallarla işler.",
          human: "İptalleri ve özel istekleri ekibiniz üstlenir.",
        },
        {
          area: "Raporlar",
          h: "Analizleri otomatik üretmek",
          before: "Rakamlar her hafta birkaç sistemden dışa aktarılır ve elle birleştirilir.",
          after: "Rapor, sabit bir zamanda kaynak sistemlerden üretilir ve alıcılara gider.",
          human: "Rakamları ekibiniz değerlendirir ve karar verir.",
        },
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Yöntem",
      note: "Dört adım; her adımdan sonra siz karar verirsiniz.",
      h: "Önce ölçüyoruz, sonra kuruyoruz.",
      lede: "Tek bir iş akışıyla başlıyor ve bir şeyi otomatikleştirmeden önce onu ölçüyoruz. Her adımdan sonra devam edip etmeyeceğinize siz karar verirsiniz.",
      cta: { label: "YZ Kontrolü'ne bakın", to: "check" },
      steps: [
        {
          name: "Ölçme",
          h: "İş akışını kayda almak ve ölçmek",
          p: "İşi yapan kişilerle bir atölye. İş akışının gerçekte nasıl işlediğini kaydediyoruz: devir noktaları, araçlar, veriler ve istisnalar.",
          result: "Ekibinizin kontrol edebileceği bir başlangıç durumu ve nelerin otomatikleştirileceğine, nelerin bilerek elle kalacağına dair karar.",
          meta: "YZ Kontrolü içinde",
        },
        {
          name: "Pilot",
          h: "Bir iş akışı canlıya geçiyor",
          p: "İlk otomasyonu kuruyor ve günlük işte deniyoruz. Kapsam ve sabit fiyat önceden yazılı olarak belirlenir.",
          result: "Kayıt tutan, hataları yöneten ve elle devam etme imkânı olan çalışan bir otomasyon.",
          meta: "sabit fiyat, önceden yazılı",
        },
        {
          name: "Yaygınlaştırma",
          h: "Pilottan günlük işe",
          p: "Pilot işe yararsa onu başka bölümlere veya iş akışlarına taşıyor, günlük kullanımdan çıkan deneyimleri ekliyoruz.",
          result: "İş akışı yalnızca denemede değil, tüm ekipte çalışır.",
          meta: "pilottan sonra, isteğe bağlı",
        },
        {
          name: "Teslim",
          h: "Dokümantasyon ve kaynak kod",
          p: "Dokümantasyon, erişimler ve varsa kaynak kod ekibinize geçer. İsterseniz çözümü sonrasında da biz yürütürüz.",
          result: "Ekibiniz, iş akışını kendisi işletmek için gereken her şeyi alır.",
          meta: "işletme aylık, anlaşmaya göre",
        },
      ],
    },
    {
      t: "spec",
      id: "werkzeuge",
      label: "Araçlar",
      h: "İş akışınıza uyan araçlar.",
      lede: "Elinizde zaten olanla kuruyor, yalnızca gerektiği yerde ekleme yapıyoruz.",
      rows: [
        ["Microsoft Power Automate", "Microsoft 365 kullanılıyorsa: onaylar, belgeler ve e-posta kuralları. Ayrıntısı Microsoft 365 sayfasında."],
        ["Make", "Hazır bir bağlayıcı yetmediğinde bulut hizmetleri arasındaki bağlantılar için."],
        ["n8n", "Hassas verili iş akışları için: kendi kontrolünüzdeki bir AB sunucusunda barındırılabilir."],
        ["Python", "Özel durumlar için: dosya okumak, veri denetlemek, rapor üretmek."],
        ["CRM ve ERP bağlantısı", "Arayüzler ve webhook'lar üzerinden; veri bir kez girilsin, her yerde kullanılsın."],
        ["Barındırma", "AB'de; isterseniz seçtiğiniz bir sağlayıcıda veya kendi altyapınızda."],
      ],
      footnote: "Lisans satmıyoruz. Hesaplar ve erişimler sizde kalır.",
    },
    {
      t: "compare",
      id: "vorher-nachher",
      label: "Önce ve sonra",
      note: "Bir örnek, müşteri vakası değil.",
      h: "Aynı iş akışı: elle ve otomatik.",
      lede: "Örnek olarak: e-postayla bir talep gelir ve teklife dönüşmesi gerekir.",
      tag: "Örnek senaryo",
      before: {
        h: "Bugün, elle",
        items: [
          "Talep okunur ve bir tabloya aktarılır.",
          "Müşteri verileri CRM'de aranır veya yeniden girilir.",
          "Teklif bir şablondan kopyalanarak hazırlanır.",
          "PDF e-postayla gider. Takip, biri hatırlarsa takvimde durur.",
        ],
      },
      after: {
        h: "Otomasyondan sonra",
        items: [
          "Talep tanınır ve kayıt olarak açılır. Veriler CRM'de bir kez durur.",
          "Teklif müşteri verilerinden hazırlanır.",
          "Bir kişi kontrol eder ve onaylar.",
          "Gönderim ve takip hatırlatması sabit kurallarla işler. Her adım kayıt altındadır.",
        ],
      },
    },
    {
      t: "rows",
      id: "interne-tools",
      label: "Şirket içi araçlar",
      note: "Tablo artık yetmediğinde.",
      h: "Excel listesi gerçek bir araca dönüşsün.",
      lede: "Bazı iş akışları hiçbir hazır yazılıma uymaz. O zaman kullanıcı başına aylık ücretli bir platform daha eklemek yerine, tam o iş akışı için küçük ve odaklı bir araç geliştiriyoruz. Hazır yazılım çoğu zaman daha iyi bir seçimdir; bunu size önceden söyleriz.",
      items: [
        { h: "Yönetim konsolları", p: "Siparişler, istisnalar ve müşteri notları üç sekme yerine tek yerde." },
        { h: "Dashboard'lar", p: "CRM, ERP ve finans sisteminden rakamlar ve uyarılar tek ekranda, elle uğraşmadan." },
        { h: "Onaylar ve formlar", p: "Teklifleri, sözleşmeleri veya iadeleri sıraya almak, yönlendirmek ve geçmişiyle onaylamak." },
        { h: "Bilgi tabanları", p: "Kendi belgelerinizde, politikalarınızda ve SSS'lerinizde arama." },
        {
          tag: "Kendi çalışmamız",
          h: "OpSo",
          p: "Test aşamasındaki kendi ürünümüz OpSo için dashboard'u, ilk kurulum akışını ve yönetim konsolunu kendimiz geliştirdik.",
          href: { label: "Projelerimiz", to: "projekte" },
        },
      ],
    },
    {
      t: "principles",
      id: "absicherung",
      label: "Güvenceler",
      note: "Hata durumu da planlanır.",
      h: "Bir şey ters giderse neyi önceden planlıyoruz?",
      lede: "Bir otomasyon, bir şey ters gittiğinde de sakin biçimde çalışmaya devam etmelidir. Bu yüzden hata durumunu en başından planlıyoruz.",
      items: [
        { h: "Kayıt.", p: "Her çalışma kaydedilir; ekibiniz ne olduğunu izleyebilir." },
        { h: "Elle devam etme.", p: "Bir adım aksarsa kayıt kaybolmaz, bir kişiye düşer." },
        {
          h: "Planlı veri işleme.",
          p: "Başlamadan önce verilerin nerede işleneceğini netleştirir ve gerekli sözleşmeleri (veri işleme sözleşmesi) yaparız. Nihai değerlendirmeyi veri koruma sorumlunuz yapar.",
        },
        {
          h: "Bağımlılık değil, teslim.",
          p: "Dokümantasyon ve varsa kaynak kod ekibinize geçer. Çözümü bizsiz de işletebileceğiniz biçimde kurarız. Nelerin teslim edileceğini başlamadan önce yazılı olarak belirleriz.",
        },
      ],
    },
  ],
  faq: {
    label: "Sık sorulanlar",
    h: "Süreç otomasyonu hakkında sorular.",
    items: [
      {
        q: "Bunun için YZ gerekir mi?",
        a: "Her zaman değil. Çoğu zaman YZ içermeyen düzgün bir otomasyon yeter. YZ'nin yardımcı olduğu yerde, örneğin belge okumada veya e-posta sıralamada, sonucu bir kişi kontrol eder.",
      },
      {
        q: "Tipik bir ilk proje nasıl olur?",
        a: "Etkisi büyük tek bir iş akışı; örneğin teklif hazırlama, e-posta sıralama veya haftalık rapor. Hangisinin önce geleceğini YZ Kontrolü'nde netleştiririz.",
      },
      {
        q: "Ücreti ne kadar?",
        a: "Tanışma görüşmesi ücretsiz ve bağlayıcı değildir. YZ Kontrolü 490 €'dan itibaren (net): 90 dakika uzaktan görüşme ve kısa yazılı rapor, analizden önce NDA. Pilot için kapsamı ve sabit fiyatı önceden yazılı olarak belirleriz. Tüm fiyatlar net olup KDV hariçtir; yalnızca işletmeler içindir.",
      },
      {
        q: "İş akışı sonradan değişirse ne olur?",
        a: "Dokümantasyonu, ekibiniz veya BT biriminiz değişiklikleri kendisi yapabilecek şekilde hazırlarız. Daha büyük değişiklikler için isterseniz anlaşmaya göre aylık bir çerçeve sunarız.",
      },
      {
        q: "Kritik iş akışlarını otomatikleştirmek güvenli mi?",
        a: "Yalnızca ideal durumu değil, hata durumunu da planlıyoruz: kayıt, hata yönetimi ve elle devam etme imkânıyla. Onay gibi kritik adımlar bir kişide kalır.",
      },
      {
        q: "Otomasyonlar nerede çalışır?",
        a: "Sizde veya AB'deki sunucularda; araca ve verilere bağlı olarak. Bunu başlamadan önce yazılı olarak belirleriz.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Önce hangi iş akışı hafiflesin?",
    p: "Birkaç cümleyle anlatın. Tanışma görüşmesinde bir YZ Kontrolü'nün anlamlı olup olmadığını netleştiririz. YZ Kontrolü, otomasyonun karşılığını verip vermeyeceğini gösterir; vermiyorsa bunu da raporda yazarız.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "YZ danışmanlığına dönün", to: "beratung" },
  },
  schema: {
    service: {
      name: "Süreç otomasyonu",
      serviceType: "Süreç otomasyonu",
      description:
        "E-posta, Excel, CRM ve ERP arasında tekrar eden iş akışlarının otomasyonu: iş akışını ölçmek, pilot kurmak, yaygınlaştırmak ve dokümantasyonla teslim etmek. Ayrıca yönetim konsolları ve dashboard'lar gibi şirket içi araçlar.",
    },
  },
};

export const page: PageSet = { de, en, tr };
