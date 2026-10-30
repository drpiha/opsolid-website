/**
 * Prozessautomatisierung (key "prozess", /ki-beratung/prozessautomatisierung). Includes the internal-tools
 * section (#interne-tools, formerly /interne-tools). German is the source; EN and TR are transcreations.
 * No prices on the page except the published KI-Check "ab 990 €"; the pilot has no number.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "prozess",
  meta: {
    title: "Prozessautomatisierung: Daten nur einmal erfassen",
    description:
      "Prozessautomatisierung für Unternehmen: Wir messen den Ablauf, bauen einen Pilot zum Festpreis und übergeben ihn mit Dokumentation. KI-Check ab 990 € netto.",
  },
  crumbs: ["beratung"],
  crumb: "Prozessautomatisierung",
  hero: {
    eyebrow: "KI-Beratung · Prozessautomatisierung",
    h1: ["Daten nur ", "einmal", " erfassen"],
    lede: "Wir automatisieren wiederkehrende Abläufe zwischen E-Mail, Excel, CRM und ERP: erst messen, wie der Ablauf heute läuft, dann ein Pilot zum Festpreis, dann die Übergabe.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zu den internen Werkzeugen", to: "prozess", hash: "interne-tools" },
    facts: ["KI-Check ab 990 € netto", "Pilot zum Festpreis, vorab schriftlich", "Übergabe mit Dokumentation"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Skizze eines Ablaufs in vier Stationen: Messen, Pilot, Einführung, Übergabe",
      caption: "Erst messen, dann bauen, am Ende die Übergabe.",
      fig: "0.1",
      labels: ["Messen", "Pilot", "Einführung", "Übergabe"],
    },
  },
  blocks: [
    {
      t: "examples",
      id: "ablaeufe",
      label: "Typische Abläufe",
      h: "Vier Abläufe, die sich oft zuerst lohnen",
      lede: "Wir wählen den Ablauf, bei dem Aufwand und Nutzen am besten zusammenpassen.",
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
      h: "Erst messen, dann bauen",
      lede: "Wir beginnen mit einem einzelnen Ablauf. Nach jedem Schritt entscheiden Sie, ob es weitergeht.",
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
          p: "Dokumentation, Zugänge und, soweit vorhanden, der Quellcode gehen an Ihr Team. Was übergeben wird, halten wir vor dem Start schriftlich fest. Auf Wunsch betreuen wir die Lösung weiter.",
          result: "Ihr Team erhält, was es braucht, um den Ablauf selbst zu betreiben.",
          meta: "Betrieb monatlich nach Vereinbarung",
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Leitsatz",
      text: "Fertige Software ist oft die bessere Wahl",
    },
    {
      t: "spec",
      id: "werkzeuge",
      label: "Werkzeuge",
      h: "Werkzeuge, die zu Ihrem Ablauf passen",
      lede: "Wir bauen mit dem, was bei Ihnen schon im Haus ist, und ergänzen nur, wo es nötig ist.",
      rows: [
        ["Microsoft Power Automate", "Wenn Microsoft 365 im Haus ist: Freigaben, Dokumente und Postfach-Regeln."],
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
      h: "Derselbe Ablauf, von Hand und automatisiert",
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
      h: "Aus der Excel-Liste wird ein Werkzeug",
      lede: "Passt ein Ablauf in keine Standard-Software, bauen wir ein kleines Werkzeug genau dafür. Fertige Software ist oft die bessere Wahl, und das sagen wir Ihnen vorher.",
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
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Fragen zur Prozessautomatisierung",
    items: [
      {
        q: "Brauchen wir dafür KI?",
        a: "Nicht immer. Oft reicht eine saubere Automatisierung ohne KI. Wo KI hilft, etwa beim Auslesen von Belegen oder beim Sortieren von Mails, prüft eine Person das Ergebnis.",
      },
      {
        q: "Was kostet das?",
        a: "Das Kennenlernen ist kostenlos und unverbindlich. Der KI-Check kostet ab 990 € netto: 90 Minuten remote plus schriftlicher Kurzbericht, NDA vor der Analyse. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an. Für den Pilot legen wir Umfang und Festpreis vorab schriftlich fest. Alle Preise netto zzgl. USt., nur für Unternehmen.",
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
        a: "Bei Ihnen oder auf Servern in der EU, je nach Werkzeug und Daten. Die nötigen Verträge (AVV) schließen wir vor dem Start; die abschließende Bewertung trifft Ihr Datenschutzbeauftragter.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Welcher Ablauf soll als Erstes entlastet werden?",
    p: "Beschreiben Sie ihn in wenigen Sätzen. Im Kennenlernen klären wir, ob ein KI-Check sinnvoll ist.",
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
      "Process automation for companies: we measure the workflow, build a pilot at a fixed price and hand it over with documentation. AI check from €990 net.",
  },
  crumbs: ["beratung"],
  crumb: "Process automation",
  hero: {
    eyebrow: "AI automation consulting · Process automation",
    h1: ["Enter your data ", "once", ""],
    lede: "We automate recurring workflows between email, Excel, CRM and ERP: first measure how the workflow runs today, then a pilot at a fixed price, then the handover.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "On to internal tools", to: "prozess", hash: "interne-tools" },
    facts: ["AI check from €990 net", "Pilot at a fixed price, agreed in writing beforehand", "Handover with documentation"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Sketch of a workflow in four stations: measure, pilot, rollout, handover",
      caption: "Measure first, then build, then hand over.",
      fig: "0.1",
      labels: ["Measure", "Pilot", "Rollout", "Handover"],
    },
  },
  blocks: [
    {
      t: "examples",
      id: "ablaeufe",
      label: "Typical flows",
      h: "Four workflows that often pay off first",
      lede: "We pick the workflow where effort and benefit match best.",
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
      h: "Measure first, then build",
      lede: "We start with a single workflow. After each step you decide whether to continue.",
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
          p: "Documentation, access and, where there is any, source code go to your team. What is handed over, we put in writing before we start. If you want, we keep looking after the solution.",
          result: "Your team gets what it needs to run the workflow itself.",
          meta: "operation monthly by agreement",
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Key point",
      text: "Ready-made software is often the better choice",
    },
    {
      t: "spec",
      id: "werkzeuge",
      label: "Tools",
      h: "Tools that fit your workflow",
      lede: "We build with what you already have and add only where needed.",
      rows: [
        ["Microsoft Power Automate", "Where Microsoft 365 is in place: approvals, documents and mailbox rules."],
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
      h: "The same workflow, by hand and automated",
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
      h: "From Excel list to a proper tool",
      lede: "If a workflow fits no standard software, we build a small tool for exactly that. Off-the-shelf software is often the better choice, and we tell you so up front.",
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
  ],
  faq: {
    label: "Common questions",
    h: "Questions about process automation",
    items: [
      {
        q: "Do we need AI for this?",
        a: "Not always. A clean automation without AI is often enough. Where AI helps, for example reading receipts or sorting mail, a person checks the result.",
      },
      {
        q: "What does it cost?",
        a: "The intro call is free and non-binding. The AI check costs from €990 net: 90 minutes remote plus a short written report, NDA before the analysis. Credited in full against a follow-up order within 60 days. For the pilot we agree scope and a fixed price in writing beforehand. All prices net of VAT, businesses only.",
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
        a: "With you or on servers in the EU, depending on the tool and the data. We sign the necessary agreements (DPA) before we start; the final assessment is made by your data protection officer.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Which workflow should be relieved first?",
    p: "Describe it in a few sentences. In our first conversation we clarify whether an AI check makes sense.",
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
      "Şirketler için süreç otomasyonu: iş akışını ölçer, sabit fiyatlı bir pilot kurar ve dokümantasyonla teslim ederiz. YZ Kontrolü 990 €'dan itibaren (net).",
  },
  crumbs: ["beratung"],
  crumb: "Süreç otomasyonu",
  hero: {
    eyebrow: "YZ danışmanlığı · Süreç otomasyonu",
    h1: ["Veriyi yalnızca ", "bir kez", " girin"],
    lede: "E-posta, Excel, CRM ve ERP arasında tekrar eden iş akışlarını otomatikleştiriyoruz: önce iş akışının bugün nasıl işlediğini ölçüyor, sonra sabit fiyatlı bir pilot kuruyor, ardından teslim ediyoruz.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Şirket içi araçlara geçin", to: "prozess", hash: "interne-tools" },
    facts: ["YZ Kontrolü 990 €'dan itibaren (net)", "Sabit fiyatlı pilot, önceden yazılı", "Dokümantasyonla teslim"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Dört istasyonlu bir iş akışı çizimi: ölçme, pilot, canlı, teslim",
      caption: "Önce ölçülür, sonra kurulur, sonunda teslim edilir.",
      fig: "0.1",
      labels: ["Ölçme", "Pilot", "Canlı", "Teslim"],
    },
  },
  blocks: [
    {
      t: "examples",
      id: "ablaeufe",
      label: "Tipik iş akışları",
      h: "Çoğu zaman önce karşılık veren dört iş akışı",
      lede: "Emek ile faydanın en iyi örtüştüğü iş akışını seçiyoruz.",
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
      h: "Önce ölçüyoruz, sonra kuruyoruz",
      lede: "Tek bir iş akışıyla başlıyoruz. Her adımdan sonra devam edip etmeyeceğinize siz karar verirsiniz.",
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
          p: "Dokümantasyon, erişimler ve varsa kaynak kod ekibinize geçer. Nelerin teslim edileceğini başlamadan önce yazılı olarak belirleriz. İsterseniz çözümü sonrasında da biz yürütürüz.",
          result: "Ekibiniz, iş akışını kendisi işletmek için gereken her şeyi alır.",
          meta: "işletme aylık, anlaşmaya göre",
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Ana fikir",
      text: "Hazır yazılım çoğu zaman daha iyi seçimdir",
    },
    {
      t: "spec",
      id: "werkzeuge",
      label: "Araçlar",
      h: "İş akışınıza uyan araçlar",
      lede: "Elinizde zaten olanla kuruyor, yalnızca gerektiği yerde ekleme yapıyoruz.",
      rows: [
        ["Microsoft Power Automate", "Microsoft 365 kullanılıyorsa: onaylar, belgeler ve e-posta kuralları."],
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
      h: "Aynı iş akışı: elle ve otomatik",
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
      h: "Excel listesi gerçek bir araca dönüşsün",
      lede: "Bir iş akışı hiçbir hazır yazılıma uymuyorsa, tam o iş için küçük bir araç geliştiriyoruz. Hazır yazılım çoğu zaman daha iyi bir seçimdir; bunu size önceden söyleriz.",
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
  ],
  faq: {
    label: "Sık sorulanlar",
    h: "Süreç otomasyonu hakkında sorular",
    items: [
      {
        q: "Bunun için YZ gerekir mi?",
        a: "Her zaman değil. Çoğu zaman YZ içermeyen düzgün bir otomasyon yeter. YZ'nin yardımcı olduğu yerde, örneğin belge okumada veya e-posta sıralamada, sonucu bir kişi kontrol eder.",
      },
      {
        q: "Ücreti ne kadar?",
        a: "Tanışma görüşmesi ücretsiz ve bağlayıcı değildir. YZ Kontrolü 990 €'dan itibaren (net): 90 dakika uzaktan görüşme ve kısa yazılı rapor, analizden önce NDA. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Pilot için kapsamı ve sabit fiyatı önceden yazılı olarak belirleriz. Tüm fiyatlar net olup KDV hariçtir; yalnızca işletmeler içindir.",
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
        a: "Sizde veya AB'deki sunucularda; araca ve verilere bağlı olarak. Gerekli sözleşmeleri (AVV) başlamadan önce yaparız; nihai değerlendirmeyi veri koruma sorumlunuz yapar.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Önce hangi iş akışı hafiflesin?",
    p: "Birkaç cümleyle anlatın. Tanışma görüşmesinde bir YZ Kontrolü'nün anlamlı olup olmadığını netleştiririz.",
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
