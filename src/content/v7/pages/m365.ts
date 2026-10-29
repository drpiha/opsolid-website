/**
 * Microsoft 365 (key "m365", /ki-beratung/microsoft-365). Power Automate, SharePoint, Teams/Outlook, Copilot
 * set-up and governance, inside the client's own tenant. German is the source; EN and TR are transcreations.
 * No prices on the page except the published KI-Check "ab 490 €" and the Copilot-Praxistag "ab 2.400 €" (FAQ).
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "m365",
  meta: {
    title: "Microsoft 365: Power Automate, SharePoint, Copilot",
    description:
      "Microsoft 365 automatisieren: Power Automate, SharePoint, Teams und Outlook mit Ihren Lizenzen, Copilot mit klaren Regeln. Alles läuft in Ihrem Tenant.",
  },
  crumbs: ["beratung"],
  crumb: "Microsoft 365",
  hero: {
    eyebrow: "KI-Beratung · Microsoft 365",
    h1: ["Microsoft 365: weniger ", "Handarbeit", " in Ihrem Tenant."],
    lede: "Wir richten Power Automate, SharePoint, Teams und Outlook in Ihrem Tenant ein, also in Ihrer eigenen Microsoft-365-Umgebung, sodass Freigaben, Dokumente und Postfach-Regeln ohne Handarbeit laufen. Manches davon steckt schon in Ihren Lizenzen. Was fehlt, sagen wir Ihnen vor dem Kauf.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zum Copilot-Praxistag", to: "copilot" },
    facts: ["Läuft in Ihrem Tenant", "Lizenzprüfung vor jedem Kauf", "Dokumentation für Ihre IT"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Skizze: ineinander liegende abgerundete Quadrate und ein Ablauf von Anfrage über Prüfung und Entwurf zur Freigabe",
      caption: "Von der Anfrage zur Freigabe, im eigenen Tenant.",
      fig: "1.2",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "ausgangslage",
      label: "Ausgangslage",
      note: "Woran man erkennt, dass Lizenzen brachliegen.",
      h: "Woran Sie merken, dass Lizenzen brachliegen.",
      lede: "Meist liegt es nicht an Microsoft 365, sondern daran, dass die Abläufe drumherum nicht eingerichtet sind.",
      items: [
        { h: "Freigaben laufen per E-Mail.", p: "Urlaub, Reisekosten und Dokumente wandern als Anhang durch Postfächer. Den Stand kennt niemand." },
        { h: "SharePoint ist ein Ablageordner.", p: "Dateien liegen dort, aber Listen, Status und Berechtigungen werden nicht genutzt." },
        { h: "Das Postfach ist Handarbeit.", p: "Bestellungen und Anfragen werden gelesen, kopiert und von Hand weitergegeben." },
        { h: "Copilot ist geplant, aber nicht eingeführt.", p: "Es fehlen Rollen, Regeln und eine Einführung, die das Team mitnimmt." },
      ],
    },
    {
      t: "rows",
      id: "leistungen",
      label: "Leistungen",
      note: "Vier Bausteine, einzeln oder zusammen.",
      h: "Was wir in Ihrem Tenant einrichten.",
      lede: "Wir beginnen mit dem, was Ihrem Team am meisten Handarbeit abnimmt, und erweitern von dort.",
      items: [
        { tag: "Power Automate", h: "Flows", p: "Automatische Abläufe für Freigaben, Benachrichtigungen, Dokumente und Postfach-Regeln." },
        { tag: "SharePoint", h: "Listen und Freigaben", p: "Anfragen, Urlaub, Reisekosten oder Bestellungen als Liste mit Status und Verlauf. Freigegeben wird per Klick in Teams." },
        { tag: "Outlook · Teams", h: "Postfach und Chat", p: "Eingehende Mails sortieren, auslesen und als Vorgang anlegen. Benachrichtigungen kommen dorthin, wo Ihr Team arbeitet." },
        {
          tag: "Microsoft 365 Copilot",
          h: "Copilot einführen",
          p: "Rollen, Zugriffe und Regeln festlegen, damit Copilot nur auf Inhalte zugreift, für die die jeweilige Person berechtigt ist. Dazu auf Wunsch eine Schulung für Ihr Team.",
          href: { label: "Zum Copilot-Praxistag", to: "copilot" },
        },
      ],
    },
    {
      t: "examples",
      id: "ablaeufe",
      label: "Typische Abläufe",
      note: "Beispiel-Szenarien, keine Kundenprojekte.",
      h: "Was sich in Microsoft 365 abnehmen lässt.",
      lede: "Für diese Abläufe reichen oft die Standard-Connectoren für Outlook, Teams und SharePoint. Wann ein Premium-Connector nötig ist, sagen wir Ihnen vorher.",
      tag: "Beispiel-Szenario",
      items: [
        {
          area: "Freigaben",
          h: "Urlaub und Reisekosten freigeben",
          before: "Der Antrag geht als Anhang per E-Mail an die Leitung, die Antwort kommt irgendwann zurück.",
          after: "Der Antrag landet als Eintrag in einer SharePoint-Liste, die Leitung gibt in Teams frei, der Status ist für alle sichtbar.",
          human: "Die Leitung entscheidet.",
        },
        {
          area: "Dokumente",
          h: "Angebote und Verträge aus einer Liste erzeugen",
          before: "Daten werden aus Excel in ein Word-Dokument kopiert.",
          after: "Das Dokument entsteht aus dem Listeneintrag und liegt in der richtigen Ablage.",
          human: "Eine Person prüft das Dokument vor dem Versand.",
        },
        {
          area: "Outlook",
          h: "Bestellungen und Anfragen auslesen",
          before: "Eingehende Mails werden gelesen und von Hand in die Liste oder das System übertragen.",
          after: "Die wichtigen Angaben werden ausgelesen und als Vorgang angelegt.",
          human: "Unklare Fälle landen bei einer Person.",
        },
        {
          area: "Copilot",
          h: "Copilot mit Regeln einführen",
          before: "Einzelne probieren Copilot aus, ohne gemeinsame Regeln.",
          after: "Rollen, Zugriffe und Regeln sind festgelegt, und das Team kennt typische Aufgaben.",
          human: "Ihr Team prüft jedes Ergebnis, bevor es weitergegeben wird.",
          href: { label: "Zum Copilot-Praxistag", to: "copilot" },
        },
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Vorgehen",
      note: "Vier Schritte, nach jedem entscheiden Sie.",
      h: "Vom Tenant-Check zur Einführung.",
      lede: "Wir beginnen mit einer Prüfung und bauen erst danach. Nach jedem Schritt entscheiden Sie, ob es weitergeht.",
      cta: { label: "Den KI-Check ansehen", to: "check" },
      steps: [
        {
          name: "Prüfung",
          h: "Tenant ansehen",
          p: "Lizenzen, Sicherheitseinstellungen und genutzte Werkzeuge. Wir suchen Automatisierungen, die Ihr Team noch nicht nutzt, und prüfen, ob Ihre Lizenzen dafür reichen.",
          result: "Eine Liste mit Abläufen, Aufwand und dem, was an Lizenzen fehlt, falls etwas fehlt.",
          meta: "Lizenzprüfung vor jedem Kauf",
        },
        {
          name: "Pilot",
          h: "Erster Flow",
          p: "Ein Power-Automate-Flow oder eine Liste mit Freigabe geht live. Umfang und Festpreis stehen vorab schriftlich fest.",
          result: "Ein laufender Ablauf in Ihrem Tenant, im Alltag getestet.",
          meta: "Festpreis, vorab schriftlich",
        },
        {
          name: "Einführung",
          h: "Weitere Abläufe und Copilot",
          p: "Wir übertragen den Ansatz auf weitere Abläufe und führen Copilot mit Rollen und Regeln ein. Auf Wunsch schulen wir Ihr Team.",
          result: "Mehrere Abläufe laufen, Zugriffe und Regeln sind festgelegt.",
          meta: "nach dem Pilot, auf Wunsch",
        },
        {
          name: "Übergabe",
          h: "Dokumentation",
          p: "Wir dokumentieren Flows, Listen und Berechtigungen so, dass Ihre IT sie pflegen kann. Auf Wunsch betreuen wir die Lösung weiter.",
          result: "Jeder Flow ist dokumentiert und hat eine zuständige Person.",
          meta: "Betrieb monatlich nach Vereinbarung",
        },
      ],
    },
    {
      t: "spec",
      id: "voraussetzungen",
      label: "Voraussetzungen",
      h: "Was wir für den Start brauchen.",
      lede: "Wenig: einen Tenant, einen Zugang, eine Ansprechperson und einen Ablauf, der sich lohnt.",
      rows: [
        ["Microsoft-365-Tenant", "Ein vorhandener Tenant mit Exchange Online, SharePoint und Teams. Manche Flows brauchen Zusatzlizenzen. Das klären wir vorab."],
        ["Zugang", "Ein Administrator-Konto oder eine Person, die Berechtigungen einrichtet. Wir arbeiten mit Ihrer IT oder Ihrem Microsoft-Partner zusammen und ersetzen sie nicht."],
        ["Ansprechperson", "Eine Person, die den Ablauf kennt und Entscheidungen trifft."],
        ["Ablauf", "Ein Ablauf, der regelmäßig vorkommt und klaren Regeln folgt."],
        ["Zeit", "Ein Workshop zu Beginn und kurze Abstimmungen während des Piloten."],
      ],
      footnote: "Lizenzen kaufen Sie bei Ihrem Anbieter. Wir verkaufen keine.",
    },
    {
      t: "principles",
      id: "tenant",
      label: "Ihr Tenant",
      note: "Ihre Daten, Ihre Konten.",
      h: "Was in Ihrem Tenant bleibt.",
      lede: "Die Flows laufen in Ihrem Microsoft-365-Tenant. Dort liegen auch Ihre Daten, Konten und Berechtigungen.",
      cta: { label: "Mehr zur KI-Beratung", to: "beratung" },
      items: [
        { h: "Daten im Tenant.", p: "Dokumente, Listen und Postfächer bleiben dort, wo sie sind. Wir arbeiten in Ihrem Tenant und halten keine eigene Kopie Ihrer Daten vor." },
        { h: "Konten und Eigentum.", p: "Flows, Listen und Verbindungen gehören zu Ihrem Tenant und laufen mit Ihren Konten. Sie behalten die Kontrolle." },
        { h: "Rollen und Rechte.", p: "Flows und Copilot greifen nur auf Inhalte zu, für die die jeweilige Person berechtigt ist. Die Berechtigungen legen wir vorher mit Ihrer IT fest." },
        {
          h: "Datenschutz mit Plan.",
          p: "Wir zeigen vor dem Start, welche Daten durch welche Flows laufen, und schließen die nötigen Verträge (AVV). Die abschließende Bewertung trifft Ihr Datenschutzbeauftragter.",
        },
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Fragen zu Microsoft 365.",
    items: [
      {
        q: "Brauchen wir Power-Automate-Premium-Lizenzen?",
        a: "Manchmal. Viele sinnvolle Flows kommen mit den Standard-Connectoren für Outlook, Teams und SharePoint aus. Wann ein Premium-Connector nötig ist, sagen wir Ihnen vor dem Kauf.",
      },
      {
        q: "Lohnt sich Microsoft 365 Copilot?",
        a: "Für manche Teams ja, für andere nicht. Das klären wir, bevor Sie Lizenzen kaufen. Wir verkaufen keine Lizenzen.",
      },
      {
        q: "Bleiben unsere Daten im Tenant?",
        a: "Ja, die Flows laufen in Ihrem Tenant. Bindet ein Ablauf einen externen Dienst ein, zeigen wir Ihnen das vorher und klären es mit Ihnen, einschließlich der nötigen Verträge.",
      },
      {
        q: "Wer pflegt die Flows danach?",
        a: "Ihre IT oder Ihr Team, wenn Sie das möchten: Wir dokumentieren jeden Flow, jede Liste und jede Berechtigung. Auf Wunsch betreuen wir die Lösung monatlich nach Vereinbarung weiter.",
      },
      {
        q: "Was kostet das?",
        a: "Das Kennenlernen ist kostenlos und unverbindlich. Der KI-Check kostet ab 490 € netto: 90 Minuten remote plus schriftlicher Kurzbericht, NDA vor der Analyse. Für den Pilot legen wir Umfang und Festpreis vorab schriftlich fest. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Wie hängt das mit dem Copilot-Praxistag zusammen?",
        a: "Der Copilot-Praxistag ist eine Schulung für Ihr Team: 1 Tag, bis 12 Personen, ab 2.400 € netto. Die Einrichtung in Ihrem Tenant gehört zur Beratung. Beides lässt sich kombinieren.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Was steckt in Ihrem Tenant?",
    p: "Im KI-Check prüfen wir, welche Abläufe sich mit Microsoft 365 automatisieren lassen und was Ihre Lizenzen dafür hergeben. Wenn sich nichts lohnt, steht auch das im Bericht.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zum Copilot-Praxistag", to: "copilot" },
  },
  schema: {
    service: {
      name: "Microsoft-365-Automatisierung",
      serviceType: "Microsoft 365 Automatisierung",
      description:
        "Power Automate, SharePoint, Teams und Outlook im eigenen Microsoft-365-Tenant einrichten, Copilot mit Rollen und Regeln einführen und alles für die IT dokumentieren.",
    },
  },
};

const en: PageDef = {
  key: "m365",
  meta: {
    title: "Microsoft 365: Power Automate, SharePoint, Copilot",
    description:
      "Automate Microsoft 365: Power Automate, SharePoint, Teams and Outlook with the licences you have, Copilot with clear rules. Everything runs in your own tenant.",
  },
  crumbs: ["beratung"],
  crumb: "Microsoft 365",
  hero: {
    eyebrow: "AI automation consulting · Microsoft 365",
    h1: ["Microsoft 365: less ", "manual work", " in your own tenant."],
    lede: "We set up Power Automate, SharePoint, Teams and Outlook in your tenant, your own Microsoft 365 environment, so that approvals, documents and mailbox rules run without manual work. Some of it is already part of your licences. What is missing, we tell you before you buy.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "See the Copilot workshop", to: "copilot" },
    facts: ["Runs in your tenant", "Licence check before any purchase", "Documentation for your IT"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Sketch: nested rounded squares and a flow from request through review and draft to approval",
      caption: "From request to approval, inside your own tenant.",
      fig: "1.2",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "ausgangslage",
      label: "Starting point",
      note: "How to tell that licences sit unused.",
      h: "How you can tell your licences sit unused.",
      lede: "Usually the problem is not Microsoft 365 itself but that the workflows around it have not been set up.",
      items: [
        { h: "Approvals run by email.", p: "Leave, expenses and documents travel as attachments through mailboxes. Nobody knows where things stand." },
        { h: "SharePoint is a filing cabinet.", p: "Files are stored there, but lists, status fields and permissions go unused." },
        { h: "The mailbox is manual work.", p: "Orders and requests are read, copied and passed on by hand." },
        { h: "Copilot is planned but not introduced.", p: "Roles, rules and a rollout that brings the team along are missing." },
      ],
    },
    {
      t: "rows",
      id: "leistungen",
      label: "Services",
      note: "Four building blocks, alone or together.",
      h: "What we set up in your tenant.",
      lede: "We start with what takes the most manual work off your team and expand from there.",
      items: [
        { tag: "Power Automate", h: "Flows", p: "Automatic workflows for approvals, notifications, documents and mailbox rules." },
        { tag: "SharePoint", h: "Lists and approvals", p: "Requests, leave, expenses or orders as a list with status and history. Approval happens with one click in Teams." },
        { tag: "Outlook · Teams", h: "Mailbox and chat", p: "Sort and read incoming mail and create cases from it. Notifications arrive where your team works." },
        {
          tag: "Microsoft 365 Copilot",
          h: "Introduce Copilot",
          p: "Set roles, access and rules so that Copilot only draws on content each person is permitted to access. Optionally with a training for your team.",
          href: { label: "See the Copilot workshop", to: "copilot" },
        },
      ],
    },
    {
      t: "examples",
      id: "ablaeufe",
      label: "Typical flows",
      note: "Example scenarios, not client projects.",
      h: "What Microsoft 365 can take off your hands.",
      lede: "For these workflows the standard connectors for Outlook, Teams and SharePoint are often enough. When a premium connector is needed, we tell you beforehand.",
      tag: "Example scenario",
      items: [
        {
          area: "Approvals",
          h: "Approve leave and expenses",
          before: "The request goes to the manager as an email attachment, and the answer comes back at some point.",
          after: "The request lands as an entry in a SharePoint list, the manager approves in Teams, and everyone can see the status.",
          human: "The manager decides.",
        },
        {
          area: "Documents",
          h: "Generate quotes and contracts from a list",
          before: "Data is copied from Excel into a Word document.",
          after: "The document is generated from the list entry and filed in the right place.",
          human: "A person checks the document before it goes out.",
        },
        {
          area: "Outlook",
          h: "Read orders and requests",
          before: "Incoming mail is read and transferred by hand into the list or the system.",
          after: "The key details are read out and created as a case.",
          human: "Unclear cases go to a person.",
        },
        {
          area: "Copilot",
          h: "Introduce Copilot with rules",
          before: "A few people try Copilot out, with no shared rules.",
          after: "Roles, access and rules are set, and the team knows typical tasks.",
          human: "Your team checks every result before it is passed on.",
          href: { label: "See the Copilot workshop", to: "copilot" },
        },
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Approach",
      note: "Four steps, you decide after each.",
      h: "From tenant check to rollout.",
      lede: "We start with a review and only then build. After each step you decide whether to continue.",
      cta: { label: "See the AI check", to: "check" },
      steps: [
        {
          name: "Review",
          h: "Look at the tenant",
          p: "Licences, security settings and the tools in use. We look for automations your team does not use yet and check whether your licences cover them.",
          result: "A list of workflows, effort, and any licences that are missing, if something is.",
          meta: "licence check before any purchase",
        },
        {
          name: "Pilot",
          h: "First flow",
          p: "A Power Automate flow or a list with approval goes live. Scope and fixed price are agreed in writing beforehand.",
          result: "A running workflow in your tenant, tested in daily work.",
          meta: "fixed price, in writing first",
        },
        {
          name: "Rollout",
          h: "More workflows and Copilot",
          p: "We carry the approach over to further workflows and introduce Copilot with roles and rules. If you want, we train your team.",
          result: "Several workflows run, and access and rules are set.",
          meta: "after the pilot, on request",
        },
        {
          name: "Handover",
          h: "Documentation",
          p: "We document flows, lists and permissions so that your IT can maintain them. If you want, we keep looking after the solution.",
          result: "Every flow is documented and has a named owner.",
          meta: "operation monthly by agreement",
        },
      ],
    },
    {
      t: "spec",
      id: "voraussetzungen",
      label: "Prerequisites",
      h: "What we need to get started.",
      lede: "Not much: a tenant, access, a contact person and a workflow worth automating.",
      rows: [
        ["Microsoft 365 tenant", "An existing tenant with Exchange Online, SharePoint and Teams. Some flows need extra licences. We clarify that up front."],
        ["Access", "An administrator account or a person who sets up permissions. We work with your IT or your Microsoft partner and do not replace them."],
        ["Contact person", "Someone who knows the workflow and makes decisions."],
        ["Workflow", "A workflow that comes up regularly and follows clear rules."],
        ["Time", "A workshop at the start and short check-ins during the pilot."],
      ],
      footnote: "You buy licences from your own provider. We do not sell any.",
    },
    {
      t: "principles",
      id: "tenant",
      label: "Your tenant",
      note: "Your data, your accounts.",
      h: "What stays in your tenant.",
      lede: "The flows run in your Microsoft 365 tenant. That is also where your data, accounts and permissions live.",
      cta: { label: "More on AI automation consulting", to: "beratung" },
      items: [
        { h: "Data in the tenant.", p: "Documents, lists and mailboxes stay where they are. We work inside your tenant and keep no copy of your data of our own." },
        { h: "Accounts and ownership.", p: "Flows, lists and connections belong to your tenant and run under your accounts. You stay in control." },
        { h: "Roles and permissions.", p: "Flows and Copilot only access content the person involved is permitted to see. We set the permissions beforehand with your IT." },
        {
          h: "Data protection with a plan.",
          p: "Before we start, we show which data passes through which flows and sign the necessary agreements (DPA). The final assessment is made by your data protection officer.",
        },
      ],
    },
  ],
  faq: {
    label: "Common questions",
    h: "Questions about Microsoft 365.",
    items: [
      {
        q: "Do we need Power Automate Premium licences?",
        a: "Sometimes. Many useful flows get by with the standard connectors for Outlook, Teams and SharePoint. When a premium connector is needed, we tell you before you buy.",
      },
      {
        q: "Is Microsoft 365 Copilot worth it?",
        a: "For some teams yes, for others no. We clarify that before you buy licences. We do not sell licences.",
      },
      {
        q: "Does our data stay in the tenant?",
        a: "Yes, the flows run in your tenant. If a workflow connects an external service, we show you that beforehand and settle it with you, including the necessary agreements.",
      },
      {
        q: "Who maintains the flows afterwards?",
        a: "Your IT or your team, if you wish: we document every flow, list and permission. If you want, we keep looking after the solution monthly by agreement.",
      },
      {
        q: "What does it cost?",
        a: "Getting to know each other is free and non-binding. The AI check costs from €490 net: 90 minutes remote plus a short written report, NDA before the analysis. For the pilot we agree scope and a fixed price in writing beforehand. All prices net of VAT, businesses only.",
      },
      {
        q: "How does this relate to the Copilot workshop?",
        a: "The Copilot workshop is a training for your team: one day, up to 12 people, from €2,400 net. Setting things up in your tenant is part of the consulting. The two can be combined.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "What is in your tenant?",
    p: "In the AI check we look at which workflows you can automate with Microsoft 365 and what your licences allow. If nothing pays off, the report says so.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "See the Copilot workshop", to: "copilot" },
  },
  schema: {
    service: {
      name: "Microsoft 365 automation",
      serviceType: "Microsoft 365 automation",
      description:
        "Set up Power Automate, SharePoint, Teams and Outlook in your own Microsoft 365 tenant, introduce Copilot with roles and rules, and document everything for your IT.",
    },
  },
};

const tr: PageDef = {
  key: "m365",
  meta: {
    title: "Microsoft 365: Power Automate, SharePoint, Copilot",
    description:
      "Microsoft 365'i otomatikleştirin: mevcut lisanslarınızla Power Automate, SharePoint, Teams ve Outlook; net kurallarla Copilot. Hepsi kendi tenant'ınızda.",
  },
  crumbs: ["beratung"],
  crumb: "Microsoft 365",
  hero: {
    eyebrow: "YZ danışmanlığı · Microsoft 365",
    h1: ["Microsoft 365: kendi tenant'ınızda daha az ", "elle iş", "."],
    lede: "Power Automate, SharePoint, Teams ve Outlook'u kendi Microsoft 365 ortamınızda (tenant'ınızda) kuruyoruz; böylece onaylar, belgeler ve e-posta kuralları elle uğraşmadan işler. Bunların bir kısmı lisanslarınızda zaten var. Eksik olanı satın almadan önce size söyleriz.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Copilot Uygulama Gününe bakın", to: "copilot" },
    facts: ["Tenant'ınızda çalışır", "Her satın almadan önce lisans incelemesi", "BT biriminiz için dokümantasyon"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Çizim: iç içe yuvarlatılmış kareler ve talepten incelemeye, taslağa ve onaya uzanan bir akış",
      caption: "Talepten onaya, kendi tenant'ınızın içinde.",
      fig: "1.2",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "ausgangslage",
      label: "Başlangıç durumu",
      note: "Lisansların boşta kaldığını nasıl anlarsınız?",
      h: "Lisansların boşta kaldığını nereden anlarsınız?",
      lede: "Sorun çoğunlukla Microsoft 365'te değil; etrafındaki iş akışlarının kurulmamış olmasındadır.",
      items: [
        { h: "Onaylar e-postayla yürüyor.", p: "İzin, masraf ve belgeler ek olarak posta kutuları arasında dolaşır. Durumu kimse bilmez." },
        { h: "SharePoint bir arşiv klasörü gibi kullanılıyor.", p: "Dosyalar orada durur; ama listeler, durum alanları ve yetkiler kullanılmaz." },
        { h: "Posta kutusu elle yürüyen bir iş.", p: "Siparişler ve talepler okunur, kopyalanır ve elle iletilir." },
        { h: "Copilot planlandı ama devreye alınmadı.", p: "Roller, kurallar ve ekibi yanına alan bir devreye alma süreci eksik." },
      ],
    },
    {
      t: "rows",
      id: "leistungen",
      label: "Hizmetler",
      note: "Dört yapı taşı; ayrı ayrı veya birlikte.",
      h: "Tenant'ınızda neleri kuruyoruz?",
      lede: "Ekibinizden en çok elle yapılan işi alacak olanla başlıyor, oradan genişletiyoruz.",
      items: [
        { tag: "Power Automate", h: "Akışlar", p: "Onaylar, bildirimler, belgeler ve e-posta kuralları için otomatik iş akışları." },
        { tag: "SharePoint", h: "Listeler ve onaylar", p: "Talepler, izinler, masraflar veya siparişler; durum ve geçmişiyle bir liste olarak. Onay, Teams'te tek tıkla verilir." },
        { tag: "Outlook · Teams", h: "Posta kutusu ve sohbet", p: "Gelen e-postaları sıralamak, okumak ve kayıt olarak açmak. Bildirimler ekibinizin çalıştığı yere gelir." },
        {
          tag: "Microsoft 365 Copilot",
          h: "Copilot'u devreye almak",
          p: "Roller, erişimler ve kurallar belirlenir; Copilot yalnızca ilgili kişinin erişim yetkisi olan içeriğe başvurur. İsterseniz ekibiniz için bir eğitimle birlikte.",
          href: { label: "Copilot Uygulama Gününe bakın", to: "copilot" },
        },
      ],
    },
    {
      t: "examples",
      id: "ablaeufe",
      label: "Tipik iş akışları",
      note: "Örnek senaryolar, müşteri projesi değil.",
      h: "Microsoft 365 hangi işleri üstlenebilir?",
      lede: "Bu iş akışları için çoğu zaman Outlook, Teams ve SharePoint'in standart bağlayıcıları yeter. Premium bağlayıcının ne zaman gerektiğini size önceden söyleriz.",
      tag: "Örnek senaryo",
      items: [
        {
          area: "Onaylar",
          h: "İzin ve masraf onayı",
          before: "Başvuru e-postayla ek olarak yöneticiye gider, yanıt bir ara geri döner.",
          after: "Başvuru bir SharePoint listesine kayıt olarak düşer, yönetici Teams'te onaylar, durumu herkes görür.",
          human: "Kararı yönetici verir.",
        },
        {
          area: "Belgeler",
          h: "Tekliflerin ve sözleşmelerin listeden üretilmesi",
          before: "Veriler Excel'den bir Word belgesine kopyalanır.",
          after: "Belge liste kaydından oluşur ve doğru dizine konur.",
          human: "Gönderimden önce belgeyi bir kişi kontrol eder.",
        },
        {
          area: "Outlook",
          h: "Siparişlerin ve taleplerin okunması",
          before: "Gelen e-postalar okunur ve elle listeye veya sisteme aktarılır.",
          after: "Önemli bilgiler okunur ve kayıt olarak açılır.",
          human: "Belirsiz durumlar bir kişiye gider.",
        },
        {
          area: "Copilot",
          h: "Copilot'un kurallarla devreye alınması",
          before: "Birkaç kişi ortak kural olmadan Copilot'u dener.",
          after: "Roller, erişimler ve kurallar belirlidir; ekip tipik görevleri bilir.",
          human: "Her sonucu, iletilmeden önce ekibiniz kontrol eder.",
          href: { label: "Copilot Uygulama Gününe bakın", to: "copilot" },
        },
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Yöntem",
      note: "Dört adım; her adımdan sonra siz karar verirsiniz.",
      h: "Tenant incelemesinden devreye almaya.",
      lede: "Bir incelemeyle başlıyor, ancak sonra kuruyoruz. Her adımdan sonra devam edip etmeyeceğinize siz karar verirsiniz.",
      cta: { label: "YZ Kontrolü'ne bakın", to: "check" },
      steps: [
        {
          name: "İnceleme",
          h: "Tenant'a bakmak",
          p: "Lisanslar, güvenlik ayarları ve kullanılan araçlar. Ekibinizin henüz kullanmadığı otomasyonları arıyor ve lisanslarınızın buna yetip yetmediğine bakıyoruz.",
          result: "İş akışlarının, emeğin ve varsa eksik lisansların listesi.",
          meta: "her satın almadan önce lisans incelemesi",
        },
        {
          name: "Pilot",
          h: "İlk akış",
          p: "Bir Power Automate akışı veya onaylı bir liste canlıya geçer. Kapsam ve sabit fiyat önceden yazılı olarak belirlenir.",
          result: "Tenant'ınızda çalışan ve günlük işte denenmiş bir iş akışı.",
          meta: "sabit fiyat, önceden yazılı",
        },
        {
          name: "Yaygınlaştırma",
          h: "Diğer iş akışları ve Copilot",
          p: "Yaklaşımı başka iş akışlarına taşıyor ve Copilot'u roller ve kurallarla devreye alıyoruz. İsterseniz ekibinizi eğitiriz.",
          result: "Birkaç iş akışı çalışır; erişimler ve kurallar belirlidir.",
          meta: "pilottan sonra, isteğe bağlı",
        },
        {
          name: "Teslim",
          h: "Dokümantasyon",
          p: "Akışları, listeleri ve yetkileri BT biriminizin bakımını yapabileceği şekilde belgeliyoruz. İsterseniz çözümü sonrasında da biz yürütürüz.",
          result: "Her akış belgelenmiştir ve sorumlu bir kişisi vardır.",
          meta: "işletme aylık, anlaşmaya göre",
        },
      ],
    },
    {
      t: "spec",
      id: "voraussetzungen",
      label: "Ön koşullar",
      h: "Başlamak için nelere ihtiyacımız var?",
      lede: "Fazla bir şeye değil: bir tenant, bir erişim, bir muhatap ve değecek bir iş akışı.",
      rows: [
        ["Microsoft 365 tenant'ı", "Exchange Online, SharePoint ve Teams içeren mevcut bir tenant. Bazı akışlar ek lisans gerektirir. Bunu baştan netleştiririz."],
        ["Erişim", "Bir yönetici hesabı veya yetkileri tanımlayan bir kişi. BT biriminiz veya Microsoft iş ortağınızla birlikte çalışırız, onların yerine geçmeyiz."],
        ["Muhatap", "İş akışını bilen ve karar veren bir kişi."],
        ["İş akışı", "Düzenli olarak tekrarlanan ve net kurallara dayanan bir iş akışı."],
        ["Zaman", "Başlangıçta bir atölye, pilot boyunca kısa görüşmeler."],
      ],
      footnote: "Lisansları kendi sağlayıcınızdan alırsınız. Biz lisans satmıyoruz.",
    },
    {
      t: "principles",
      id: "tenant",
      label: "Tenant'ınız",
      note: "Verileriniz, hesaplarınız.",
      h: "Tenant'ınızda neler kalır?",
      lede: "Akışlar sizin Microsoft 365 tenant'ınızda çalışır. Verileriniz, hesaplarınız ve yetkileriniz de orada durur.",
      cta: { label: "YZ danışmanlığı hakkında", to: "beratung" },
      items: [
        { h: "Veriler tenant'ta kalır.", p: "Belgeler, listeler ve posta kutuları olduğu yerde kalır. Tenant'ınızın içinde çalışır, verilerinizin kendimize ait bir kopyasını tutmayız." },
        { h: "Hesaplar ve sahiplik.", p: "Akışlar, listeler ve bağlantılar tenant'ınıza aittir ve sizin hesaplarınızla çalışır. Kontrol sizde kalır." },
        { h: "Roller ve yetkiler.", p: "Akışlar ve Copilot yalnızca ilgili kişinin erişim yetkisi olan içeriğe ulaşır. Yetkileri önceden BT biriminizle birlikte belirleriz." },
        {
          h: "Planlı veri koruma.",
          p: "Başlamadan önce hangi verilerin hangi akışlardan geçtiğini gösterir ve gerekli sözleşmeleri (veri işleme sözleşmesi) yaparız. Nihai değerlendirmeyi veri koruma sorumlunuz yapar.",
        },
      ],
    },
  ],
  faq: {
    label: "Sık sorulanlar",
    h: "Microsoft 365 hakkında sorular.",
    items: [
      {
        q: "Power Automate Premium lisansına ihtiyacımız var mı?",
        a: "Bazen. İşe yarayan birçok akış, Outlook, Teams ve SharePoint'in standart bağlayıcılarıyla çalışır. Premium bağlayıcının ne zaman gerektiğini satın almadan önce size söyleriz.",
      },
      {
        q: "Microsoft 365 Copilot almaya değer mi?",
        a: "Bazı ekipler için evet, bazıları için hayır. Bunu siz lisans satın almadan önce netleştiririz. Biz lisans satmıyoruz.",
      },
      {
        q: "Verilerimiz tenant'ta mı kalır?",
        a: "Evet, akışlar sizin tenant'ınızda çalışır. Bir iş akışı harici bir hizmete bağlanıyorsa bunu önceden gösterir, gerekli sözleşmeler dahil sizinle netleştiririz.",
      },
      {
        q: "Akışların bakımını sonradan kim yapar?",
        a: "İsterseniz BT biriminiz veya ekibiniz: Her akışı, her listeyi ve her yetkiyi belgeliyoruz. İsterseniz çözümü anlaşmaya göre aylık olarak biz yürütürüz.",
      },
      {
        q: "Ücreti ne kadar?",
        a: "Tanışma görüşmesi ücretsiz ve bağlayıcı değildir. YZ Kontrolü 490 €'dan itibaren (net): 90 dakika uzaktan görüşme ve kısa yazılı rapor, analizden önce NDA. Pilot için kapsamı ve sabit fiyatı önceden yazılı olarak belirleriz. Tüm fiyatlar net olup KDV hariçtir; yalnızca işletmeler içindir.",
      },
      {
        q: "Bunun Copilot Uygulama Günüyle ilişkisi nedir?",
        a: "Copilot Uygulama Günü ekibiniz için bir eğitimdir: 1 gün, en fazla 12 kişi, net 2.400 €'dan başlayan fiyatlarla. Tenant'ınızdaki kurulum danışmanlığın parçasıdır. İkisi birleştirilebilir.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Tenant'ınızda neler var?",
    p: "YZ Kontrolünde hangi iş akışlarını Microsoft 365 ile otomatikleştirebileceğinize ve lisanslarınızın buna ne kadar yettiğine bakıyoruz. Hiçbir şey değmiyorsa, bunu da raporda yazarız.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Copilot Uygulama Gününe bakın", to: "copilot" },
  },
  schema: {
    service: {
      name: "Microsoft 365 otomasyonu",
      serviceType: "Microsoft 365 otomasyonu",
      description:
        "Power Automate, SharePoint, Teams ve Outlook'u kendi Microsoft 365 tenant'ınızda kurmak, Copilot'u roller ve kurallarla devreye almak ve her şeyi BT biriminiz için belgelemek.",
    },
  },
};

export const page: PageSet = { de, en, tr };
