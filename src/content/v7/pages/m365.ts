/**
 * Microsoft 365 (key "m365", /ki-beratung/microsoft-365). Power Automate, SharePoint, Teams/Outlook, Copilot
 * set-up and governance, inside the client's own tenant. German is the source; EN and TR are transcreations.
 * No prices on the page except the published KI-Check "ab 990 €" and the Copilot-Praxistag "ab 2.900 €" (FAQ).
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
    h1: ["Microsoft 365: weniger ", "Handarbeit", " in Ihrem Tenant"],
    lede: "Wir richten Power Automate, SharePoint, Teams und Outlook in Ihrem Tenant ein, Ihrer eigenen Microsoft-365-Umgebung, damit Freigaben, Dokumente und Postfach-Regeln ohne Handarbeit laufen. Manches steckt schon in Ihren Lizenzen. Was fehlt, sagen wir Ihnen vor dem Kauf.",
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
      t: "rows",
      id: "leistungen",
      label: "Leistungen",
      h: "Was wir in Ihrem Tenant einrichten",
      lede: "Wir beginnen mit dem, was Ihrem Team am meisten Handarbeit abnimmt, und erweitern von dort.",
      items: [
        { tag: "Power Automate", h: "Flows", p: "Automatische Abläufe für Freigaben, Benachrichtigungen, Dokumente und Postfach-Regeln." },
        { tag: "SharePoint", h: "Listen und Freigaben", p: "Anfragen, Urlaub, Reisekosten oder Bestellungen als Liste mit Status und Verlauf. Freigegeben wird per Klick in Teams." },
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
      h: "Was sich in Microsoft 365 abnehmen lässt",
      lede: "Für diese Abläufe reichen oft die Standard-Connectoren für Outlook, Teams und SharePoint.",
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
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Vorgehen",
      h: "Vom Tenant-Check zur Einführung",
      lede: "Wir beginnen mit einer Prüfung und bauen erst danach. Nach jedem Schritt entscheiden Sie, ob es weitergeht.",
      cta: { label: "Den KI-Check ansehen", to: "check" },
      steps: [
        {
          name: "Prüfung",
          h: "Tenant ansehen",
          p: "Lizenzen, Sicherheitseinstellungen und genutzte Werkzeuge. Wir suchen ungenutzte Automatisierungen und prüfen, ob Ihre Lizenzen dafür reichen.",
          result: "Eine Liste mit Abläufen, Aufwand und fehlenden Lizenzen.",
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
      h: "Was wir für den Start brauchen",
      rows: [
        ["Microsoft-365-Tenant", "Ein vorhandener Tenant mit Exchange Online, SharePoint und Teams. Manche Flows brauchen Zusatzlizenzen. Das klären wir vorab."],
        ["Zugang", "Ein Administrator-Konto oder eine Person, die Berechtigungen einrichtet. Wir arbeiten mit Ihrer IT oder Ihrem Microsoft-Partner zusammen."],
        ["Ansprechperson", "Eine Person, die den Ablauf kennt und Entscheidungen trifft."],
        ["Zeit", "Ein Workshop zu Beginn und kurze Abstimmungen während des Piloten."],
      ],
      footnote: "Lizenzen kaufen Sie bei Ihrem Anbieter. Wir verkaufen keine.",
    },
    {
      t: "principles",
      id: "tenant",
      label: "Ihr Tenant",
      h: "Was in Ihrem Tenant bleibt",
      cta: { label: "Mehr zur KI-Beratung", to: "beratung" },
      items: [
        { h: "Daten und Konten bleiben bei Ihnen", p: "Dokumente, Listen und Postfächer bleiben im Tenant. Flows, Listen und Verbindungen laufen mit Ihren Konten, und wir halten keine eigene Kopie Ihrer Daten vor." },
        { h: "Rollen und Rechte", p: "Flows und Copilot greifen nur auf Inhalte zu, für die die jeweilige Person berechtigt ist. Die Berechtigungen legen wir vorher mit Ihrer IT fest. Die nötigen Verträge (AVV) schließen wir vor dem Start." },
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Fragen zu Microsoft 365",
    items: [
      {
        q: "Brauchen wir Power-Automate-Premium-Lizenzen?",
        a: "Manchmal. Viele sinnvolle Flows kommen mit den Standard-Connectoren für Outlook, Teams und SharePoint aus. Wann ein Premium-Connector nötig ist, sagen wir Ihnen vor dem Kauf.",
      },
      {
        q: "Lohnt sich Microsoft 365 Copilot?",
        a: "Für manche Teams ja, für andere nicht. Das klären wir, bevor Sie Lizenzen kaufen.",
      },
      {
        q: "Bleiben unsere Daten im Tenant?",
        a: "Ja, die Flows laufen in Ihrem Tenant. Bindet ein Ablauf einen externen Dienst ein, zeigen wir Ihnen das vorher.",
      },
      {
        q: "Was kostet das?",
        a: "Das Kennenlernen ist kostenlos und unverbindlich. Der KI-Check kostet ab 990 € netto: 90 Minuten remote plus schriftlicher Kurzbericht, NDA vor der Analyse. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an. Für den Pilot legen wir Umfang und Festpreis vorab schriftlich fest. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Wie hängt das mit dem Copilot-Praxistag zusammen?",
        a: "Der Copilot-Praxistag ist eine Schulung für Ihr Team: 1 Tag, ab 2.900 € netto pro Team, 10 Personen inklusive, jede weitere Person 150 € (bis 12 Personen). Die Einrichtung in Ihrem Tenant gehört zur Beratung.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Was steckt in Ihrem Tenant?",
    p: "Im KI-Check prüfen wir, welche Abläufe sich mit Microsoft 365 automatisieren lassen und was Ihre Lizenzen dafür hergeben.",
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
    h1: ["Microsoft 365: less ", "manual work", " in your own tenant"],
    lede: "We set up Power Automate, SharePoint, Teams and Outlook in your tenant, your own Microsoft 365 environment, so that approvals, documents and mailbox rules run without manual work. Some of it is already in your licences. What is missing, we tell you before you buy.",
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
      t: "rows",
      id: "leistungen",
      label: "Services",
      h: "What we set up in your tenant",
      lede: "We start with what takes the most manual work off your team and expand from there.",
      items: [
        { tag: "Power Automate", h: "Flows", p: "Automatic workflows for approvals, notifications, documents and mailbox rules." },
        { tag: "SharePoint", h: "Lists and approvals", p: "Requests, leave, expenses or orders as a list with status and history. Approval happens with one click in Teams." },
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
      h: "What Microsoft 365 can take off your hands",
      lede: "For these workflows the standard connectors for Outlook, Teams and SharePoint are often enough.",
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
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Approach",
      h: "From tenant check to rollout",
      lede: "We start with a review and only then build. After each step you decide whether to continue.",
      cta: { label: "See the AI check", to: "check" },
      steps: [
        {
          name: "Review",
          h: "Look at the tenant",
          p: "Licences, security settings and the tools in use. We look for unused automations and check whether your licences cover them.",
          result: "A list of workflows, effort and missing licences.",
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
      h: "What we need to get started",
      rows: [
        ["Microsoft 365 tenant", "An existing tenant with Exchange Online, SharePoint and Teams. Some flows need extra licences. We clarify that up front."],
        ["Access", "An administrator account or a person who sets up permissions. We work with your IT or your Microsoft partner."],
        ["Contact person", "Someone who knows the workflow and makes decisions."],
        ["Time", "A workshop at the start and short check-ins during the pilot."],
      ],
      footnote: "You buy licences from your own provider. We do not sell any.",
    },
    {
      t: "principles",
      id: "tenant",
      label: "Your tenant",
      h: "What stays in your tenant",
      cta: { label: "More on AI automation consulting", to: "beratung" },
      items: [
        { h: "Data and accounts stay with you", p: "Documents, lists and mailboxes stay in the tenant. Flows, lists and connections run under your accounts, and we keep no copy of your data of our own." },
        { h: "Roles and permissions", p: "Flows and Copilot only access content the person involved is permitted to see. We set the permissions beforehand with your IT. We sign the necessary agreements (DPA) before we start." },
      ],
    },
  ],
  faq: {
    label: "Common questions",
    h: "Questions about Microsoft 365",
    items: [
      {
        q: "Do we need Power Automate Premium licences?",
        a: "Sometimes. Many useful flows get by with the standard connectors for Outlook, Teams and SharePoint. When a premium connector is needed, we tell you before you buy.",
      },
      {
        q: "Is Microsoft 365 Copilot worth it?",
        a: "For some teams yes, for others no. We clarify that before you buy licences.",
      },
      {
        q: "Does our data stay in the tenant?",
        a: "Yes, the flows run in your tenant. If a workflow connects an external service, we show you that beforehand.",
      },
      {
        q: "What does it cost?",
        a: "Getting to know each other is free and non-binding. The AI check costs from €990 net: 90 minutes remote plus a short written report, NDA before the analysis. Credited in full against a follow-up order within 60 days. For the pilot we agree scope and a fixed price in writing beforehand. All prices net of VAT, businesses only.",
      },
      {
        q: "How does this relate to the Copilot workshop?",
        a: "The Copilot workshop is a training for your team: one day, from €2,900 net per team, 10 people included, each additional person €150 (up to 12). Setting things up in your tenant is part of the consulting.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "What is in your tenant?",
    p: "In the AI check we look at which workflows you can automate with Microsoft 365 and what your licences allow.",
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
    h1: ["Microsoft 365: kendi tenant'ınızda daha az ", "elle iş", ""],
    lede: "Power Automate, SharePoint, Teams ve Outlook'u kendi Microsoft 365 ortamınızda (tenant'ınızda) kuruyoruz; böylece onaylar, belgeler ve e-posta kuralları elle uğraşmadan işler. Bir kısmı lisanslarınızda zaten var. Eksik olanı satın almadan önce size söyleriz.",
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
      t: "rows",
      id: "leistungen",
      label: "Hizmetler",
      h: "Tenant'ınızda neleri kuruyoruz?",
      lede: "Ekibinizden en çok elle yapılan işi alacak olanla başlıyor, oradan genişletiyoruz.",
      items: [
        { tag: "Power Automate", h: "Akışlar", p: "Onaylar, bildirimler, belgeler ve e-posta kuralları için otomatik iş akışları." },
        { tag: "SharePoint", h: "Listeler ve onaylar", p: "Talepler, izinler, masraflar veya siparişler; durum ve geçmişiyle bir liste olarak. Onay, Teams'te tek tıkla verilir." },
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
      h: "Microsoft 365 hangi işleri üstlenebilir?",
      lede: "Bu iş akışları için çoğu zaman Outlook, Teams ve SharePoint'in standart bağlayıcıları yeter.",
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
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Yöntem",
      h: "Tenant incelemesinden devreye almaya",
      lede: "Bir incelemeyle başlıyor, ancak sonra kuruyoruz. Her adımdan sonra devam edip etmeyeceğinize siz karar verirsiniz.",
      cta: { label: "YZ Kontrolü'ne bakın", to: "check" },
      steps: [
        {
          name: "İnceleme",
          h: "Tenant'a bakmak",
          p: "Lisanslar, güvenlik ayarları ve kullanılan araçlar. Kullanılmayan otomasyonları arıyor ve lisanslarınızın buna yetip yetmediğine bakıyoruz.",
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
      rows: [
        ["Microsoft 365 tenant'ı", "Exchange Online, SharePoint ve Teams içeren mevcut bir tenant. Bazı akışlar ek lisans gerektirir. Bunu baştan netleştiririz."],
        ["Erişim", "Bir yönetici hesabı veya yetkileri tanımlayan bir kişi. BT biriminiz veya Microsoft iş ortağınızla birlikte çalışırız."],
        ["Muhatap", "İş akışını bilen ve karar veren bir kişi."],
        ["Zaman", "Başlangıçta bir atölye, pilot boyunca kısa görüşmeler."],
      ],
      footnote: "Lisansları kendi sağlayıcınızdan alırsınız. Biz lisans satmıyoruz.",
    },
    {
      t: "principles",
      id: "tenant",
      label: "Tenant'ınız",
      h: "Tenant'ınızda neler kalır?",
      cta: { label: "YZ danışmanlığı hakkında", to: "beratung" },
      items: [
        { h: "Veriler ve hesaplar sizde kalır", p: "Belgeler, listeler ve posta kutuları tenant'ta kalır. Akışlar, listeler ve bağlantılar sizin hesaplarınızla çalışır; verilerinizin kendimize ait bir kopyasını tutmayız." },
        { h: "Roller ve yetkiler", p: "Akışlar ve Copilot yalnızca ilgili kişinin erişim yetkisi olan içeriğe ulaşır. Yetkileri önceden BT biriminizle birlikte belirleriz. Gerekli sözleşmeleri (AVV) başlamadan önce yaparız." },
      ],
    },
  ],
  faq: {
    label: "Sık sorulanlar",
    h: "Microsoft 365 hakkında sorular",
    items: [
      {
        q: "Power Automate Premium lisansına ihtiyacımız var mı?",
        a: "Bazen. İşe yarayan birçok akış, Outlook, Teams ve SharePoint'in standart bağlayıcılarıyla çalışır. Premium bağlayıcının ne zaman gerektiğini satın almadan önce size söyleriz.",
      },
      {
        q: "Microsoft 365 Copilot almaya değer mi?",
        a: "Bazı ekipler için evet, bazıları için hayır. Bunu siz lisans satın almadan önce netleştiririz.",
      },
      {
        q: "Verilerimiz tenant'ta mı kalır?",
        a: "Evet, akışlar sizin tenant'ınızda çalışır. Bir iş akışı harici bir hizmete bağlanıyorsa bunu önceden gösteririz.",
      },
      {
        q: "Ücreti ne kadar?",
        a: "Tanışma görüşmesi ücretsiz ve bağlayıcı değildir. YZ Kontrolü 990 €'dan itibaren (net): 90 dakika uzaktan görüşme ve kısa yazılı rapor, analizden önce NDA. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Pilot için kapsamı ve sabit fiyatı önceden yazılı olarak belirleriz. Tüm fiyatlar net olup KDV hariçtir; yalnızca işletmeler içindir.",
      },
      {
        q: "Bunun Copilot Uygulama Günüyle ilişkisi nedir?",
        a: "Copilot Uygulama Günü ekibiniz için bir eğitimdir: 1 gün, ekip başına 2.900 €'dan itibaren (net), 10 kişi dahil, her ek kişi 150 € (en fazla 12 kişi). Tenant'ınızdaki kurulum danışmanlığın parçasıdır.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Tenant'ınızda neler var?",
    p: "YZ Kontrolünde hangi iş akışlarını Microsoft 365 ile otomatikleştirebileceğinize ve lisanslarınızın buna ne kadar yettiğine bakıyoruz.",
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
