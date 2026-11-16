/**
 * About page (v7). Company voice ("wir"), no team-size claims, no years, no employer. Location and
 * working languages appear here (and on Contact, footer, JSON-LD) only. No founder name or photo
 * (owner decision 2026-11-14; the legal name stays in the Impressum). Training leads (owner, 2026-11-14); the TopSolid
 * disambiguation is one FAQ item (plus JSON-LD), not a section; OpSo is one row without status dates.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "ueber",
  meta: {
    title: "Über OpSolid: KI-Schulungen und KI-Beratung aus Arnsberg",
    description:
      "OpSolid aus Arnsberg organisiert KI-Schulungen für Teams und berät unabhängig bei KI-Automatisierung: Angebot, Methode, Grundsätze und Arbeitsweise.",
  },
  crumbs: [],
  crumb: "Über uns",
  hero: {
    eyebrow: "Über OpSolid",
    h1: ["Schulung und Beratung, die beim", "Ablauf", "anfangen"],
    lede: "OpSolid organisiert KI-Schulungen für Teams und berät Unternehmen bei der Automatisierung mit KI. In beidem fangen wir beim Ablauf an, nicht bei der Technik.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "KI-Check ansehen", to: "check" },
    facts: ["Unabhängig von KI-Anbietern", "Trainer vor der Buchung namentlich genannt", "Umfang und Preis vorab schriftlich"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Skizze: ineinander liegende abgerundete Quadrate über einem Ablauf in vier Stationen: Aufnahme, Messung, Pilot, Übergabe",
      caption: "Aufnehmen, messen, pilotieren, übergeben.",
      fig: "0.1",
      labels: ["Aufnahme", "Messung", "Pilot", "Übergabe"],
    },
  },
  blocks: [
    {
      t: "rows",
      id: "angebot",
      label: "Angebot",
      note: "Was wir tun, in dieser Reihenfolge.",
      h: "Drei Bereiche, die Schulungen zuerst",
      items: [
        {
          tag: "1 · KI-Schulungen",
          h: "Ihr Team lernt, KI sicher zu nutzen",
          p: "Online, live in Ihrem eigenen Microsoft Teams, auf Deutsch oder Englisch, gebucht pro Team ab 1.790 € netto. OpSolid organisiert die Schulungen im eigenen Namen: Die Trainerin oder der Trainer ist freiberuflich, von uns ausgewählt und Ihnen vor der Buchung namentlich genannt; Vertrag und Rechnung laufen über OpSolid. Nach der Schulung erhält Ihr Team unsere Teilnahmebescheinigung.",
          href: { label: "Zu den KI-Schulungen", to: "schulungen" },
        },
        {
          tag: "2 · Beratung",
          h: "KI-Beratung und KI-Automatisierung",
          p: "Wir finden mit Ihnen die Abläufe, bei denen sich Automatisierung lohnt, und setzen die erste Lösung um. Einstieg ist der KI-Check für 990 € netto, Festpreis: Fragebogen und schriftlicher Bericht, der mit einer Schulungsempfehlung endet. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir ihn voll an. Auf Wunsch folgt ein Pilot zum Festpreis, vorab schriftlich, danach der Betrieb monatlich nach Vereinbarung.",
          href: { label: "Zur KI-Beratung", to: "beratung" },
        },
        {
          tag: "3 · Eigene Produkte",
          h: "OpSo, unsere digitale Visitenkarte",
          p: "Unsere eigene App für digitale Visitenkarten, getrennt von Schulung und Beratung: kostenlos im App Store und bei Google Play, in der EU, der Schweiz und Großbritannien. App, Webkarten und Verwaltung haben wir selbst entwickelt.",
          href: { label: "Zu OpSo", to: "opso" },
        },
      ],
    },
    {
      t: "steps",
      id: "methode",
      label: "Methode",
      note: "Fünf Schritte vom Gespräch bis zur Übergabe.",
      h: "So arbeiten wir in der Beratung",
      lede: "Jeder Schritt hat ein Ergebnis, und nach jedem entscheiden Sie neu.",
      items: [
        {
          h: "Ablauf aufnehmen",
          p: "Wir sprechen mit den Menschen, die die Arbeit machen, und halten fest, wie der Ablauf heute tatsächlich läuft.",
        },
        {
          h: "Ausgangslage messen",
          p: "Vor dem Pilot notieren wir, wie lange der Ablauf dauert und wo er hakt. Nach dem Pilot vergleichen wir mit denselben Werten.",
        },
        {
          h: "Klein pilotieren",
          p: "Wir setzen einen Ablauf um, nicht alle auf einmal. Umfang und Festpreis stehen vorab schriftlich fest.",
        },
        {
          h: "Einführen",
          p: "Der Ablauf wird im Alltag genutzt. Ihr Team weiß, was der Assistent tut und wann er an einen Menschen übergibt.",
        },
        {
          h: "Übergeben",
          p: "Dokumentation und Zugänge gehören Ihnen. Bei Automatisierungen und internen Tools übergeben wir auch den Quellcode, sodass Ihre IT oder ein anderer Dienstleister übernehmen kann.",
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Leitsatz",
      text: "Wir empfehlen, was auf Ihren Systemen aufbaut",
    },
    {
      t: "principles",
      id: "grundsaetze",
      label: "Grundsätze",
      note: "Woran Sie uns messen können.",
      h: "Vier Grundsätze für jede Zusammenarbeit",
      items: [
        {
          h: "Bei den Menschen anfangen",
          p: "Wir beginnen bei Ihren echten Abläufen und bei denen, die sie erledigen. Wo Automatisierung nicht sinnvoll ist, sagen wir das.",
        },
        {
          h: "Unabhängig bleiben",
          p: "Wir verkaufen keine KI-Lizenzen und keine Software von Anbietern. Wir empfehlen, was zu Ihrem Ablauf passt und auf Ihren vorhandenen Systemen aufbaut.",
        },
        {
          h: "Daten mit Plan",
          p: "Vor dem Start klären wir, wo Daten verarbeitet werden, und schließen die nötigen Verträge (AVV). Die abschließende Bewertung trifft Ihr Datenschutzbeauftragter.",
        },
        {
          h: "Der Mensch entscheidet",
          p: "Jeder Assistent hat klare Grenzen und übergibt an Ihr Team. Freigaben bleiben bei Ihnen.",
        },
      ],
    },
    {
      t: "about",
      id: "menschen",
      label: "Hintergrund",
      note: "Methode, Ort, Sprachen.",
      h: "Woher unsere Methode kommt",
      lede: "Unsere Methode stammt aus IT-Projektmanagement, Digitalisierung und Prozessoptimierung im laufenden Betrieb von Unternehmen.",
      paras: [
        "Wir arbeiten mit Microsoft 365 (Outlook, Teams, SharePoint, Power Automate), Make, n8n und Python, binden CRM und ERP an und hosten bei Bedarf in der EU.",
      ],
      facts: [
        ["Sitz", "Arnsberg, Sauerland, NRW"],
        ["Arbeitsweise", "Remote in Deutschland und Europa, schriftlich und per Video"],
        ["Sprachen", "Deutsch, Englisch, Türkisch"],
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen zu OpSolid",
    items: [
      {
        q: "Müssen wir für ein Projekt nach Arnsberg kommen?",
        a: "Nein. Wir arbeiten remote in Deutschland und Europa, auf Deutsch, Englisch und Türkisch, schriftlich und per Video.",
      },
      {
        q: "Welche Branchen beraten Sie?",
        a: "Dienstleistung, Gastronomie und Hotellerie, Handel und Praxen, ohne Gesundheitsdaten.",
      },
      {
        q: "Hat OpSolid etwas mit TopSolid zu tun?",
        a: "Nein. Die Namen klingen ähnlich, aber OpSolid steht in keiner Verbindung zu TopSolid (CAD/CAM-Software). Wir schulen und beraten zu KI und entwickeln keine Konstruktions- oder Fertigungssoftware.",
      },
      {
        q: "Wie beginnt die Zusammenarbeit, und was kostet der Einstieg?",
        a: "Mit einem kostenlosen, unverbindlichen Kennenlernen, per E-Mail oder kurz per Video. Auf Wunsch folgt der KI-Check für 990 € netto, Festpreis: Fragebogen und schriftlicher Bericht, NDA vor der Analyse. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir ihn voll an. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
    ],
  },
  cta: {
    label: "Anfrage",
    h: "Womit sollen wir anfangen?",
    p: "Schreiben Sie uns kurz, ob es um eine Schulung für Ihr Team oder um einen Ablauf geht. Wir empfehlen den passenden Einstieg und nennen den Preis.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
  },
};

const en: PageDef = {
  key: "ueber",
  meta: {
    title: "About OpSolid: AI training and AI consulting from Arnsberg",
    description:
      "OpSolid, Arnsberg, Germany: AI training for teams and independent AI automation consulting. Offer, method, principles and our way of working.",
  },
  crumbs: [],
  crumb: "About",
  hero: {
    eyebrow: "About OpSolid",
    h1: ["Training and consulting that start with the", "workflow", ""],
    lede: "OpSolid organises AI training for teams and advises companies on automation with AI. In both we start with the workflow, not with the technology.",
    primary: { label: "Request a course", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "See the AI check", to: "check" },
    facts: ["Independent of AI vendors", "Trainer named before you book", "Scope and price in writing first"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Sketch: nested rounded squares above a workflow in four stations: intake, baseline, pilot, handover",
      caption: "Map, measure, pilot, hand over.",
      fig: "0.1",
      labels: ["Intake", "Baseline", "Pilot", "Handover"],
    },
  },
  blocks: [
    {
      t: "rows",
      id: "angebot",
      label: "Offer",
      note: "What we do, in this order.",
      h: "Three areas, training first",
      items: [
        {
          tag: "1 · AI training",
          h: "Your team learns to use AI safely",
          p: "Online, live in your own Microsoft Teams, in English or German, booked per team from €1,790 net. OpSolid organises the training in its own name: the trainer is a freelancer we select and name to you before you book; contract and invoice run through OpSolid. After the course your team receives our participation record.",
          href: { label: "To AI training", to: "schulungen" },
        },
        {
          tag: "2 · Consulting",
          h: "AI consulting and AI automation",
          p: "With you, we find the workflows where automation pays off, and we build the first solution. The way in is the AI check for €990 net, fixed price: a questionnaire and a written report that ends with a training recommendation. Credited in full against a follow-up order within 60 days. If you wish, a pilot at a fixed price follows, agreed in writing beforehand, then operation, monthly by agreement.",
          href: { label: "To AI consulting", to: "beratung" },
        },
        {
          tag: "3 · Our own products",
          h: "OpSo, our digital business card",
          p: "Our own app for digital business cards, separate from training and consulting: free in the App Store and on Google Play in the EU, Switzerland and the UK. We built the app, the web cards and the admin tools ourselves.",
          href: { label: "To OpSo", to: "opso" },
        },
      ],
    },
    {
      t: "steps",
      id: "methode",
      label: "Method",
      note: "Five steps from the first call to handover.",
      h: "How we work in consulting",
      lede: "Every step has a result, and after each one you decide again.",
      items: [
        {
          h: "Map the workflow",
          p: "We talk to the people who do the work and record how the workflow actually runs today.",
        },
        {
          h: "Measure the starting point",
          p: "Before the pilot, we note how long the workflow takes and where it stalls. After the pilot, we compare against the same measures.",
        },
        {
          h: "Pilot small",
          p: "We implement one workflow, not all at once. Scope and fixed price are agreed in writing beforehand.",
        },
        {
          h: "Roll out",
          p: "The workflow is used in daily work. Your team knows what the assistant does and when it hands over to a person.",
        },
        {
          h: "Hand over",
          p: "Documentation and access belong to you. For automations and internal tools, we also hand over the source code, so your IT team or another provider can take over.",
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Key point",
      text: "We recommend what builds on the systems you already use",
    },
    {
      t: "principles",
      id: "grundsaetze",
      label: "Principles",
      note: "What you can hold us to.",
      h: "Four principles for every engagement",
      items: [
        {
          h: "Start with the people",
          p: "We begin with your real workflows and the people who carry them out. Where automation does not make sense, we say so.",
        },
        {
          h: "Stay independent",
          p: "We sell no AI licences and no vendor software. We recommend what fits your workflow and builds on the systems you already use.",
        },
        {
          h: "Data with a plan",
          p: "Before we start, we clarify where data is processed and put the necessary contracts in place (data processing agreements). The final assessment rests with your data protection officer.",
        },
        {
          h: "People decide",
          p: "Every assistant has clear limits and hands over to your team. Approvals stay with you.",
        },
      ],
    },
    {
      t: "about",
      id: "menschen",
      label: "Background",
      note: "Method, place, languages.",
      h: "Where our method comes from",
      lede: "Our method comes from IT project management, digitalisation and process optimisation in the day-to-day operations of companies.",
      paras: [
        "We work with Microsoft 365 (Outlook, Teams, SharePoint, Power Automate), Make, n8n and Python, connect CRM and ERP systems, and host in the EU where needed.",
      ],
      facts: [
        ["Based in", "Arnsberg, Sauerland, North Rhine-Westphalia"],
        ["Way of working", "Remote in Germany and Europe, in writing and by video"],
        ["Languages", "German, English, Turkish"],
      ],
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Frequently asked questions about OpSolid",
    items: [
      {
        q: "Do we have to come to Arnsberg for a project?",
        a: "No. We work remotely in Germany and Europe, in German, English and Turkish, in writing and by video.",
      },
      {
        q: "Which industries do you advise?",
        a: "Services, hospitality, retail and practices, without health data.",
      },
      {
        q: "Is OpSolid related to TopSolid?",
        a: "No. The names sound alike, but OpSolid has no connection to TopSolid (CAD/CAM software). We train and advise on AI and do not develop design or manufacturing software.",
      },
      {
        q: "How does working together begin, and what does the entry point cost?",
        a: "With a free intro, by email or a short video call, without obligation. If you wish, the AI check follows for €990 net, fixed price: a questionnaire and a written report, with an NDA before the analysis. Credited in full against a follow-up order within 60 days. All prices are net of VAT and for businesses only.",
      },
    ],
  },
  cta: {
    label: "Enquiry",
    h: "Where should we start?",
    p: "Tell us briefly whether you need a course for your team or help with a workflow. We recommend the right starting point and name the price.",
    primary: { label: "Request a course", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
  },
};

const tr: PageDef = {
  key: "ueber",
  meta: {
    title: "OpSolid hakkında: Arnsberg'den YZ eğitimleri ve danışmanlığı",
    description:
      "OpSolid, Arnsberg'den ekipler için YZ eğitimleri düzenler ve YZ otomasyonunda bağımsız danışmanlık verir: hizmetler, yöntem, ilkeler ve çalışma biçimi.",
  },
  crumbs: [],
  crumb: "Hakkımızda",
  hero: {
    eyebrow: "OpSolid hakkında",
    h1: ["İş akışından", "başlayan", "eğitim ve danışmanlık"],
    lede: "OpSolid, ekipler için YZ eğitimleri düzenler ve şirketlere yapay zeka ile otomasyon konusunda danışmanlık verir. İkisinde de teknolojiden değil, iş akışından başlarız.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "YZ Kontrolünü görün", to: "check" },
    facts: ["YZ sağlayıcılarından bağımsız", "Eğitmen rezervasyondan önce adıyla bildirilir", "Kapsam ve fiyat önceden yazılı"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Çizim: iç içe yuvarlatılmış kareler ve dört istasyonlu bir akış: kayıt, ölçüm, pilot, teslim",
      caption: "Kaydet, ölç, pilotla, teslim et.",
      fig: "0.1",
      labels: ["Kayıt", "Ölçüm", "Pilot", "Teslim"],
    },
  },
  blocks: [
    {
      t: "rows",
      id: "angebot",
      label: "Hizmetler",
      note: "Ne yapıyoruz, hangi sırayla.",
      h: "Üç alan, önce eğitimler",
      items: [
        {
          tag: "1 · YZ eğitimleri",
          h: "Ekibiniz yapay zekayı güvenle kullanmayı öğrenir",
          p: "Çevrimiçi, kendi Microsoft Teams'inizde canlı, Almanca veya İngilizce, ekip başına 1.790 €'dan (net) itibaren. OpSolid eğitimleri kendi adına düzenler: eğitmen, bizim seçtiğimiz ve rezervasyondan önce size adıyla bildirdiğimiz bir serbest çalışandır; sözleşme ve fatura OpSolid üzerinden yürür. Eğitimden sonra ekibiniz katılım belgemizi alır.",
          href: { label: "YZ eğitimlerine", to: "schulungen" },
        },
        {
          tag: "2 · Danışmanlık",
          h: "Yapay zeka danışmanlığı ve otomasyonu",
          p: "Sizinle birlikte otomasyonun karşılığını vereceği iş akışlarını buluruz ve ilk çözümü kurarız. Giriş noktası 990 € (net, sabit fiyat) tutarındaki YZ Kontrolüdür: soru formu ve eğitim önerisiyle biten yazılı rapor. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. İsterseniz ardından sabit fiyatlı bir pilot gelir, fiyat önceden yazılı olarak belirlenir; sonra aylık, anlaşmaya göre işletme.",
          href: { label: "Yapay zeka danışmanlığına", to: "beratung" },
        },
        {
          tag: "3 · Kendi ürünlerimiz",
          h: "OpSo, dijital kartvizitimiz",
          p: "Eğitim ve danışmanlıktan ayrı, dijital kartvizit için kendi uygulamamız: AB, İsviçre ve Birleşik Krallık'ta App Store ve Google Play'de ücretsiz. Uygulamayı, web kartlarını ve yönetim araçlarını kendimiz geliştirdik.",
          href: { label: "OpSo'ya", to: "opso" },
        },
      ],
    },
    {
      t: "steps",
      id: "methode",
      label: "Yöntem",
      note: "İlk görüşmeden teslime beş adım.",
      h: "Danışmanlıkta nasıl çalışırız?",
      lede: "Her adımın bir sonucu vardır; her adımdan sonra yeniden siz karar verirsiniz.",
      items: [
        {
          h: "İş akışını kayda almak",
          p: "İşi yapan kişilerle konuşur ve iş akışının bugün gerçekte nasıl yürüdüğünü not ederiz.",
        },
        {
          h: "Başlangıç durumunu ölçmek",
          p: "Pilottan önce iş akışının ne kadar sürdüğünü ve nerede aksadığını kaydederiz. Pilottan sonra aynı değerlerle karşılaştırırız.",
        },
        {
          h: "Küçük pilot",
          p: "Hepsini birden değil, tek bir iş akışını hayata geçiririz. Kapsam ve sabit fiyat önceden yazılı olarak belirlenir.",
        },
        {
          h: "Devreye almak",
          p: "İş akışı günlük işte kullanılır. Ekibiniz asistanın ne yaptığını ve ne zaman bir insana devrettiğini bilir.",
        },
        {
          h: "Teslim etmek",
          p: "Dokümantasyon ve erişimler size aittir. Otomasyonlarda ve şirket içi araçlarda kaynak kodu da teslim ederiz; böylece BT ekibiniz veya başka bir hizmet sağlayıcı devralabilir.",
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Ana fikir",
      text: "Mevcut sistemlerinizin üzerine kurulanı öneririz",
    },
    {
      t: "principles",
      id: "grundsaetze",
      label: "İlkeler",
      note: "Bizi nelerle ölçebilirsiniz.",
      h: "Her iş birliğinde dört ilke",
      items: [
        {
          h: "İnsanlardan başlamak",
          p: "Gerçek iş akışlarınızdan ve bu işleri yapan insanlardan başlarız. Otomasyonun anlamlı olmadığı yerde bunu söyleriz.",
        },
        {
          h: "Bağımsız kalmak",
          p: "YZ lisansı ya da sağlayıcı yazılımı satmayız. İş akışınıza uyanı ve zaten kullandığınız sistemlerin üzerine kurulabilecek olanı öneririz.",
        },
        {
          h: "Planlı veri yönetimi",
          p: "Başlamadan önce verilerin nerede işlendiğini netleştirir, gerekli sözleşmeleri (veri işleme sözleşmesi) yaparız. Nihai değerlendirmeyi veri koruma sorumlunuz yapar.",
        },
        {
          h: "Kararı insan verir",
          p: "Her asistanın net sınırları vardır ve ekibinize devreder. Onaylar sizde kalır.",
        },
      ],
    },
    {
      t: "about",
      id: "menschen",
      label: "Arka plan",
      note: "Yöntem, yer, diller.",
      h: "Yöntemimiz nereden geliyor?",
      lede: "Yöntemimiz, şirketlerin günlük işleyişi içinde yürütülen BT proje yönetimi, dijitalleşme ve süreç iyileştirme çalışmalarından doğdu.",
      paras: [
        "Microsoft 365 (Outlook, Teams, SharePoint, Power Automate), Make, n8n ve Python ile çalışır, CRM ve ERP sistemlerini bağlar, gerektiğinde AB'de barındırırız.",
      ],
      facts: [
        ["Merkez", "Arnsberg, Sauerland, Kuzey Ren-Vestfalya"],
        ["Çalışma biçimi", "Almanya ve Avrupa'da uzaktan, yazılı olarak ve görüntülü görüşmeyle"],
        ["Diller", "Almanca, İngilizce, Türkçe"],
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "OpSolid hakkında sık sorulan sorular",
    items: [
      {
        q: "Proje için Arnsberg'e gelmemiz gerekir mi?",
        a: "Hayır. Almanya ve Avrupa'da uzaktan, Almanca, İngilizce ve Türkçe, yazılı olarak ve görüntülü görüşmeyle çalışıyoruz.",
      },
      {
        q: "Hangi sektörlere danışmanlık veriyorsunuz?",
        a: "Hizmet sektörü, yeme-içme ve konaklama, perakende ve muayenehaneler; sağlık verisi olmadan.",
      },
      {
        q: "OpSolid'in TopSolid ile bir ilgisi var mı?",
        a: "Hayır. Adlar birbirine benziyor, ancak OpSolid'in TopSolid (CAD/CAM yazılımı) ile bir bağlantısı yoktur. Yapay zekâ konusunda eğitim ve danışmanlık veririz; tasarım ya da üretim yazılımı geliştirmeyiz.",
      },
      {
        q: "İş birliği nasıl başlar, giriş ne kadar tutar?",
        a: "Ücretsiz ve bağlayıcı olmayan bir tanışmayla; e-postayla ya da kısa bir görüntülü görüşmeyle. İsterseniz ardından YZ Kontrolü gelir, 990 € (net, sabit fiyat): soru formu ve yazılı rapor, analizden önce NDA. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
      },
    ],
  },
  cta: {
    label: "Talep",
    h: "Nereden başlayalım?",
    p: "Ekibiniz için bir eğitim mi, yoksa bir iş akışı için destek mi istediğinizi kısaca yazın. Uygun başlangıcı önerir ve fiyatı bildiririz.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
  },
};

export const page: PageSet = { de, en, tr };
