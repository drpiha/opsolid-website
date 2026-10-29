/**
 * About page (v7). Company voice ("wir"), no team-size claims, no years, no employer. Founder name and
 * LinkedIn, location and working languages appear here (and on Contact, footer, JSON-LD) only.
 */
import type { Href, PageDef, PageSet } from "../types";

/**
 * External profile link. Href only models page keys and mailto:/tel:; the renderer emits a plain <a>
 * for any non-page href, so the https URL works at run time. A typed `https:` variant is requested
 * from the shared types owner.
 */
const LINKEDIN = "https://www.linkedin.com/in/hasanhd/" as const;
const linkedin = (label: string): Href => ({ label, href: LINKEDIN });

const de: PageDef = {
  key: "ueber",
  meta: {
    title: "Über OpSolid: unabhängige KI-Beratung aus Arnsberg",
    description:
      "OpSolid ist eine unabhängige Beratung für KI-Automatisierung aus Arnsberg: Angebot, Methode, Grundsätze und Gründer. Nicht zu verwechseln mit TopSolid.",
  },
  crumbs: [],
  crumb: "Über uns",
  hero: {
    eyebrow: "Über OpSolid",
    h1: ["Beratung, die beim", "Ablauf", "anfängt."],
    lede: "OpSolid berät Unternehmen bei der Automatisierung mit KI. Wir fangen beim Ablauf an, nicht bei der Technik, und sagen offen, wenn sich etwas nicht lohnt.",
    primary: { label: "Kennenlernen anfragen", to: "kontakt", query: { anliegen: "beratung" } },
    secondary: { label: "KI-Check ansehen", to: "check" },
    facts: ["Unabhängig von KI-Anbietern", "NDA vor der Analyse", "Pilot zum Festpreis, vorab schriftlich"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Skizze: ineinander liegende abgerundete Quadrate und ein Ablauf von Anfrage über Prüfung und Entwurf zur Freigabe",
      caption: "Erst der Ablauf, dann die Technik.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "rows",
      id: "angebot",
      label: "Angebot",
      note: "Was wir tun, in dieser Reihenfolge.",
      h: "Drei Bereiche, die Beratung zuerst.",
      lede: "Die Beratung steht an erster Stelle. KI-Schulungen und OpSo ergänzen sie, ersetzen sie aber nicht.",
      items: [
        {
          tag: "1 · Beratung",
          h: "KI-Beratung und KI-Automatisierung",
          p: "Wir finden mit Ihnen die Abläufe, bei denen sich Automatisierung lohnt, und setzen die erste Lösung um. Der Einstieg ist der KI-Check ab 490 € netto: 90 Minuten remote plus schriftlicher Kurzbericht. Danach folgt auf Wunsch ein Pilot zum Festpreis, vorab schriftlich, und der Betrieb monatlich nach Vereinbarung.",
          href: { label: "Zur KI-Beratung", to: "beratung" },
        },
        {
          tag: "2 · KI-Schulungen",
          h: "Ihr Team lernt, KI sicher zu nutzen",
          p: "Online, auf Deutsch und Englisch, live für Ihr Team. Wir bauen ein Netzwerk freiberuflicher Trainerinnen und Trainer auf. Wer Ihre Schulung hält, nennen wir Ihnen vor der Buchung namentlich.",
          href: { label: "Zu den KI-Schulungen", to: "schulungen" },
        },
        {
          tag: "3 · Eigenes Produkt",
          h: "OpSo, unsere digitale Visitenkarte",
          p: "Ein eigenes Produkt, getrennt von der Beratung. Es ist in der Testphase: Android im geschlossenen Test bei Google Play, iPhone bei Apple zur Prüfung eingereicht (Stand: 28.10.2026).",
          href: { label: "Zu OpSo", to: "opso" },
        },
      ],
    },
    {
      t: "steps",
      id: "methode",
      label: "Methode",
      note: "Fünf Schritte vom Gespräch bis zur Übergabe.",
      h: "So arbeiten wir.",
      lede: "Wir nehmen den Ablauf auf, messen die Ausgangslage, pilotieren klein und übergeben vollständig. Jeder Schritt hat ein Ergebnis, und nach jedem entscheiden Sie neu.",
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
      t: "principles",
      id: "grundsaetze",
      label: "Grundsätze",
      note: "Woran Sie uns messen können.",
      h: "Vier Grundsätze für jedes Projekt.",
      lede: "Sie begrenzen unsere Arbeit und schützen damit Ihre Entscheidung.",
      items: [
        {
          h: "Bei den Menschen anfangen.",
          p: "Wir beginnen bei Ihren echten Abläufen und bei denen, die sie erledigen. Wo Automatisierung nicht sinnvoll ist, sagen wir das.",
        },
        {
          h: "Unabhängig bleiben.",
          p: "Wir verkaufen keine KI-Lizenzen und keine Software von Anbietern. Wir empfehlen, was zu Ihrem Ablauf passt und auf Ihren vorhandenen Systemen aufbaut.",
        },
        {
          h: "Daten mit Plan.",
          p: "Vor dem Start klären wir, wo Daten verarbeitet werden, und schließen die nötigen Verträge (AVV). Die abschließende Bewertung trifft Ihr Datenschutzbeauftragter.",
        },
        {
          h: "Der Mensch entscheidet.",
          p: "Jeder Assistent hat klare Grenzen und übergibt an Ihr Team. Freigaben bleiben bei Ihnen.",
        },
      ],
    },
    {
      t: "about",
      id: "menschen",
      label: "Menschen",
      note: "Gründer, Ort, Arbeitsweise.",
      h: "Wer hinter OpSolid steht.",
      lede: "OpSolid wurde von Hasan Dönmez gegründet und hat seinen Sitz in Arnsberg im Sauerland.",
      paras: [
        "Die Erfahrung hinter OpSolid stammt aus IT-Projektmanagement, Digitalisierung und Prozessoptimierung im laufenden Betrieb von Unternehmen. Daraus ist unsere Methode entstanden.",
        "Wir arbeiten mit Microsoft 365 (Outlook, Teams, SharePoint, Power Automate), Make, n8n und Python, binden CRM und ERP an und hosten bei Bedarf in der EU.",
        "Unser Schwerpunkt liegt auf Dienstleistung, Gastronomie und Hotellerie, Handel und Praxen (ohne Gesundheitsdaten).",
      ],
      facts: [
        ["Gründer", "Hasan Dönmez"],
        ["Sitz", "Arnsberg, Sauerland, NRW"],
        ["Arbeitsweise", "Remote in Deutschland und Europa, vor Ort nach Absprache"],
        ["Sprachen", "Deutsch, Englisch, Türkisch"],
      ],
      link: linkedin("Hasan Dönmez auf LinkedIn"),
    },
    {
      t: "text",
      id: "abgrenzung",
      label: "Abgrenzung",
      note: "Eine Verwechslung ausschließen.",
      h: "OpSolid ist nicht TopSolid.",
      lede: "Die Namen klingen ähnlich. Mit dem CAD/CAM-Anbieter haben wir nichts zu tun.",
      paras: [
        "OpSolid ist nicht TopSolid (CAD/CAM-Software) und steht in keiner Verbindung dazu. Wir beraten zu KI und zur Automatisierung von Abläufen in Unternehmen und entwickeln keine Konstruktions- oder Fertigungssoftware.",
        "Der Einstieg bei uns: Das Kennenlernen ist kostenlos und unverbindlich, der KI-Check kostet ab 490 € netto. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen zu OpSolid.",
    items: [
      {
        q: "Sind Sie mit TopSolid verbunden?",
        a: "Nein. OpSolid ist nicht TopSolid (CAD/CAM-Software) und steht in keiner Verbindung dazu.",
      },
      {
        q: "Verkaufen Sie KI-Lizenzen oder Software von Anbietern?",
        a: "Nein. Wir sind unabhängig und verkaufen weder KI-Lizenzen noch Software von Anbietern. Zugänge und Dokumentation gehören Ihnen, und wir bauen auf den Systemen auf, die Sie bereits nutzen.",
      },
      {
        q: "Müssen wir für ein Projekt nach Arnsberg kommen?",
        a: "Nein. Wir arbeiten remote in Deutschland und Europa. Termine vor Ort sind nach Absprache möglich.",
      },
      {
        q: "In welchen Sprachen arbeiten Sie?",
        a: "Auf Deutsch, Englisch und Türkisch. Die KI-Schulungen finden online auf Deutsch und Englisch statt.",
      },
      {
        q: "Welche Branchen beraten Sie?",
        a: "Unser Schwerpunkt liegt auf Dienstleistung, Gastronomie und Hotellerie, Handel und Praxen, ohne Gesundheitsdaten.",
      },
      {
        q: "Wer steht hinter OpSolid?",
        a: "OpSolid wurde von Hasan Dönmez gegründet und hat seinen Sitz in Arnsberg (Sauerland, Nordrhein-Westfalen).",
      },
      {
        q: "Wie beginnt die Zusammenarbeit, und was kostet der Einstieg?",
        a: "Mit einem kostenlosen, unverbindlichen Kennenlernen. Danach folgt auf Wunsch der KI-Check ab 490 € netto: 90 Minuten remote plus schriftlicher Kurzbericht, NDA vor der Analyse. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
    ],
  },
  cta: {
    label: "Kennenlernen",
    h: "Mit einem Ablauf anfangen.",
    p: "Schreiben Sie uns, welcher Ablauf Sie gerade Zeit kostet. Im Kennenlernen klären wir, ob ein KI-Check sinnvoll ist.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
  },
};

const en: PageDef = {
  key: "ueber",
  meta: {
    title: "About OpSolid: independent AI consulting from Arnsberg",
    description:
      "OpSolid is an independent AI automation consultancy in Arnsberg, Germany: offer, method, principles and founder. Not to be confused with TopSolid (CAD/CAM).",
  },
  crumbs: [],
  crumb: "About",
  hero: {
    eyebrow: "About OpSolid",
    h1: ["Consulting that starts with the", "workflow.", ""],
    lede: "OpSolid advises companies on automation with AI. We start with the workflow, not with the technology, and we tell you plainly when something is not worth doing.",
    primary: { label: "Request an introductory call", to: "kontakt", query: { anliegen: "beratung" } },
    secondary: { label: "See the AI check", to: "check" },
    facts: ["Independent of AI vendors", "NDA before the analysis", "Pilot at a fixed price, in writing first"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Sketch: nested rounded squares and a flow from enquiry through review and draft to approval",
      caption: "The workflow first, then the technology.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "rows",
      id: "angebot",
      label: "Offer",
      note: "What we do, in this order.",
      h: "Three areas, consulting first.",
      lede: "Consulting comes first. AI training and OpSo complement it; they do not replace it.",
      items: [
        {
          tag: "1 · Consulting",
          h: "AI consulting and AI automation",
          p: "With you, we find the workflows where automation pays off, and we build the first solution. The way in is the AI check, from €490 net: 90 minutes remote plus a short written report. If you wish, a pilot at a fixed price follows, agreed in writing beforehand, and then operation, monthly by agreement.",
          href: { label: "To AI consulting", to: "beratung" },
        },
        {
          tag: "2 · AI training",
          h: "Your team learns to use AI safely",
          p: "Online, in German and English, live for your team. We are building a network of freelance trainers. Before you book, we tell you by name who will deliver your training.",
          href: { label: "To AI training", to: "schulungen" },
        },
        {
          tag: "3 · Our own product",
          h: "OpSo, our digital business card",
          p: "A product of our own, separate from the consulting. It is in testing: Android in a closed test on Google Play, iPhone submitted to Apple for review (as of 28 October 2026).",
          href: { label: "To OpSo", to: "opso" },
        },
      ],
    },
    {
      t: "steps",
      id: "methode",
      label: "Method",
      note: "Five steps from the first call to handover.",
      h: "How we work.",
      lede: "We map the workflow, measure the starting point, pilot small and hand over completely. Every step has a result, and after each one you decide again.",
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
      t: "principles",
      id: "grundsaetze",
      label: "Principles",
      note: "What you can hold us to.",
      h: "Four principles for every project.",
      lede: "They limit our work and so protect your decision.",
      items: [
        {
          h: "Start with the people.",
          p: "We begin with your real workflows and the people who carry them out. Where automation does not make sense, we say so.",
        },
        {
          h: "Stay independent.",
          p: "We sell no AI licences and no vendor software. We recommend what fits your workflow and builds on the systems you already use.",
        },
        {
          h: "Data with a plan.",
          p: "Before we start, we clarify where data is processed and put the necessary contracts in place (data processing agreements). The final assessment rests with your data protection officer.",
        },
        {
          h: "People decide.",
          p: "Every assistant has clear limits and hands over to your team. Approvals stay with you.",
        },
      ],
    },
    {
      t: "about",
      id: "menschen",
      label: "People",
      note: "Founder, place, way of working.",
      h: "Who is behind OpSolid.",
      lede: "OpSolid was founded by Hasan Dönmez and is based in Arnsberg in the Sauerland region of Germany.",
      paras: [
        "The experience behind OpSolid comes from IT project management, digitalisation and process optimisation in the day-to-day operations of companies. Our method grew out of that work.",
        "We work with Microsoft 365 (Outlook, Teams, SharePoint, Power Automate), Make, n8n and Python, connect CRM and ERP systems, and host in the EU where needed.",
        "Our focus is on services, hospitality, retail and practices (without health data).",
      ],
      facts: [
        ["Founder", "Hasan Dönmez"],
        ["Based in", "Arnsberg, Sauerland, North Rhine-Westphalia"],
        ["Way of working", "Remote in Germany and Europe, on site by arrangement"],
        ["Languages", "German, English, Turkish"],
      ],
      link: linkedin("Hasan Dönmez on LinkedIn"),
    },
    {
      t: "text",
      id: "abgrenzung",
      label: "Not to be confused",
      note: "Avoiding a mix-up.",
      h: "OpSolid is not TopSolid.",
      lede: "The names sound alike. We have nothing to do with the CAD/CAM vendor.",
      paras: [
        "OpSolid is not TopSolid (CAD/CAM software) and has no connection to it. We advise companies on AI and on automating their workflows, and we do not develop design or manufacturing software.",
        "Working with us starts like this: the introductory call is free and without obligation, and the AI check starts at €490 net. All prices are net of VAT and for businesses only.",
      ],
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Frequently asked questions about OpSolid.",
    items: [
      {
        q: "Are you connected to TopSolid?",
        a: "No. OpSolid is not TopSolid (CAD/CAM software) and has no connection to it.",
      },
      {
        q: "Do you sell AI licences or vendor software?",
        a: "No. We are independent and sell neither AI licences nor vendor software. Access and documentation belong to you, and we build on the systems you already use.",
      },
      {
        q: "Do we have to come to Arnsberg for a project?",
        a: "No. We work remotely in Germany and Europe. Meetings on site are possible by arrangement.",
      },
      {
        q: "Which languages do you work in?",
        a: "German, English and Turkish. AI training takes place online in German and English.",
      },
      {
        q: "Which industries do you advise?",
        a: "Our focus is on services, hospitality, retail and practices, without health data.",
      },
      {
        q: "Who is behind OpSolid?",
        a: "OpSolid was founded by Hasan Dönmez and is based in Arnsberg (Sauerland, North Rhine-Westphalia, Germany).",
      },
      {
        q: "How does working together begin, and what does the entry point cost?",
        a: "With a free introductory call, without obligation. If you wish, the AI check follows, from €490 net: 90 minutes remote plus a short written report, with an NDA before the analysis. All prices are net of VAT and for businesses only.",
      },
    ],
  },
  cta: {
    label: "Introductory call",
    h: "Start with one workflow.",
    p: "Tell us which workflow is costing you time right now. In an introductory call, we clarify whether an AI check makes sense.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "To AI consulting", to: "beratung" },
  },
};

const tr: PageDef = {
  key: "ueber",
  meta: {
    title: "OpSolid hakkında: Arnsberg'den bağımsız YZ danışmanlığı",
    description:
      "OpSolid, Arnsberg merkezli bağımsız bir YZ otomasyonu danışmanlığıdır: hizmetler, yöntem, ilkeler ve kurucu. TopSolid (CAD/CAM) ile karıştırılmamalıdır.",
  },
  crumbs: [],
  crumb: "Hakkımızda",
  hero: {
    eyebrow: "OpSolid hakkında",
    h1: ["İş akışından", "başlayan", "danışmanlık."],
    lede: "OpSolid, şirketlere yapay zeka ile otomasyon konusunda danışmanlık verir. Teknolojiden değil iş akışından başlarız; bir şeye değmiyorsa bunu açıkça söyleriz.",
    primary: { label: "Tanışma görüşmesi talep edin", to: "kontakt", query: { anliegen: "beratung" } },
    secondary: { label: "YZ Kontrolünü görün", to: "check" },
    facts: ["YZ sağlayıcılarından bağımsız", "Analizden önce NDA", "Sabit fiyatlı pilot, önceden yazılı"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Çizim: iç içe yuvarlatılmış kareler ve talepten kontrol ve taslak aşamalarından onaya uzanan bir akış",
      caption: "Önce iş akışı, sonra teknoloji.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "rows",
      id: "angebot",
      label: "Hizmetler",
      note: "Ne yapıyoruz, hangi sırayla.",
      h: "Üç alan, önce danışmanlık.",
      lede: "Danışmanlık başta gelir. YZ eğitimleri ve OpSo onu tamamlar; yerini almaz.",
      items: [
        {
          tag: "1 · Danışmanlık",
          h: "Yapay zeka danışmanlığı ve otomasyonu",
          p: "Sizinle birlikte otomasyonun karşılığını vereceği iş akışlarını buluruz ve ilk çözümü kurarız. Giriş noktası, 490 €'dan başlayan (net) YZ Kontrolüdür: 90 dakika uzaktan ve kısa bir yazılı rapor. İsterseniz ardından sabit fiyatlı bir pilot gelir, fiyat önceden yazılı olarak belirlenir; sonra da aylık, anlaşmaya göre işletme.",
          href: { label: "Yapay zeka danışmanlığına", to: "beratung" },
        },
        {
          tag: "2 · YZ eğitimleri",
          h: "Ekibiniz yapay zekayı güvenle kullanmayı öğrenir",
          p: "Çevrim içi, Almanca ve İngilizce, ekibiniz için canlı. Serbest çalışan eğitmenlerden oluşan bir ağ kuruyoruz. Eğitimi kimin vereceğini rezervasyondan önce size adıyla bildiririz.",
          href: { label: "YZ eğitimlerine", to: "schulungen" },
        },
        {
          tag: "3 · Kendi ürünümüz",
          h: "OpSo, dijital kartvizitimiz",
          p: "Danışmanlıktan ayrı, kendi ürünümüz. Test aşamasında: Android'de Google Play'de kapalı test, iPhone'da Apple'a incelenmek üzere gönderildi (28.10.2026 itibarıyla).",
          href: { label: "OpSo'ya", to: "opso" },
        },
      ],
    },
    {
      t: "steps",
      id: "methode",
      label: "Yöntem",
      note: "İlk görüşmeden teslime beş adım.",
      h: "Nasıl çalışıyoruz?",
      lede: "İş akışını kayda alır, başlangıç durumunu ölçer, küçük bir pilotla başlar ve eksiksiz teslim ederiz. Her adımın bir sonucu vardır; her adımdan sonra yeniden siz karar verirsiniz.",
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
      t: "principles",
      id: "grundsaetze",
      label: "İlkeler",
      note: "Bizi nelerle ölçebilirsiniz.",
      h: "Her projede dört ilke.",
      lede: "Çalışmamızı sınırlar ve böylece kararınızı korur.",
      items: [
        {
          h: "İnsanlardan başlamak.",
          p: "Gerçek iş akışlarınızdan ve bu işleri yapan insanlardan başlarız. Otomasyonun anlamlı olmadığı yerde bunu söyleriz.",
        },
        {
          h: "Bağımsız kalmak.",
          p: "YZ lisansı ya da sağlayıcı yazılımı satmayız. İş akışınıza uyanı ve zaten kullandığınız sistemlerin üzerine kurulabilecek olanı öneririz.",
        },
        {
          h: "Planlı veri yönetimi.",
          p: "Başlamadan önce verilerin nerede işlendiğini netleştirir, gerekli sözleşmeleri (veri işleme sözleşmesi) yaparız. Nihai değerlendirmeyi veri koruma sorumlunuz yapar.",
        },
        {
          h: "Kararı insan verir.",
          p: "Her asistanın net sınırları vardır ve ekibinize devreder. Onaylar sizde kalır.",
        },
      ],
    },
    {
      t: "about",
      id: "menschen",
      label: "İnsanlar",
      note: "Kurucu, yer, çalışma biçimi.",
      h: "OpSolid'in arkasında kim var?",
      lede: "OpSolid'i Hasan Dönmez kurdu; merkezi Almanya'nın Sauerland bölgesindeki Arnsberg'dedir.",
      paras: [
        "OpSolid'in arkasındaki deneyim, şirketlerin günlük işleyişi içinde yürütülen BT proje yönetimi, dijitalleşme ve süreç iyileştirme çalışmalarından gelir. Yöntemimiz bu çalışmalardan doğdu.",
        "Microsoft 365 (Outlook, Teams, SharePoint, Power Automate), Make, n8n ve Python ile çalışır, CRM ve ERP sistemlerini bağlar, gerektiğinde AB'de barındırırız.",
        "Odağımız hizmet sektörü, yeme-içme ve konaklama, perakende ve muayenehaneler (sağlık verisi olmadan).",
      ],
      facts: [
        ["Kurucu", "Hasan Dönmez"],
        ["Merkez", "Arnsberg, Sauerland, Kuzey Ren-Vestfalya"],
        ["Çalışma biçimi", "Almanya ve Avrupa'da uzaktan, anlaşmayla yerinde"],
        ["Diller", "Almanca, İngilizce, Türkçe"],
      ],
      link: linkedin("Hasan Dönmez, LinkedIn"),
    },
    {
      t: "text",
      id: "abgrenzung",
      label: "Ayrım",
      note: "Karışıklığı önlemek için.",
      h: "OpSolid, TopSolid değildir.",
      lede: "Adlar birbirine benziyor. CAD/CAM yazılımı sağlayıcısıyla bir ilgimiz yok.",
      paras: [
        "OpSolid, TopSolid (CAD/CAM yazılımı) ile ilgili değildir ve onunla bağlantısı yoktur. Şirketlere yapay zeka ve iş akışı otomasyonu konusunda danışmanlık veririz; tasarım ya da üretim yazılımı geliştirmeyiz.",
        "Bizimle çalışmanın başlangıcı: Tanışma görüşmesi ücretsiz ve bağlayıcı değildir, YZ Kontrolü 490 €'dan başlar (net). Tüm fiyatlar net, KDV hariçtir ve yalnızca şirketler içindir.",
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "OpSolid hakkında sık sorulan sorular.",
    items: [
      {
        q: "TopSolid ile bağlantınız var mı?",
        a: "Hayır. OpSolid, TopSolid (CAD/CAM yazılımı) ile ilgili değildir ve onunla bağlantısı yoktur.",
      },
      {
        q: "YZ lisansı ya da sağlayıcı yazılımı satıyor musunuz?",
        a: "Hayır. Bağımsızız; YZ lisansı da sağlayıcı yazılımı da satmayız. Erişimler ve dokümantasyon size aittir; zaten kullandığınız sistemlerin üzerine kurarız.",
      },
      {
        q: "Proje için Arnsberg'e gelmemiz gerekir mi?",
        a: "Hayır. Almanya ve Avrupa'da uzaktan çalışıyoruz. Yerinde görüşmeler anlaşmayla mümkündür.",
      },
      {
        q: "Hangi dillerde çalışıyorsunuz?",
        a: "Almanca, İngilizce ve Türkçe. YZ eğitimleri çevrim içi, Almanca ve İngilizce verilir.",
      },
      {
        q: "Hangi sektörlere danışmanlık veriyorsunuz?",
        a: "Odağımız hizmet sektörü, yeme-içme ve konaklama, perakende ve muayenehaneler; sağlık verisi olmadan.",
      },
      {
        q: "OpSolid'in arkasında kim var?",
        a: "OpSolid'i Hasan Dönmez kurdu; merkezi Arnsberg'dedir (Sauerland, Kuzey Ren-Vestfalya, Almanya).",
      },
      {
        q: "İş birliği nasıl başlar, giriş ne kadar tutar?",
        a: "Ücretsiz ve bağlayıcı olmayan bir tanışma görüşmesiyle. İsterseniz ardından YZ Kontrolü gelir, 490 €'dan başlar (net): 90 dakika uzaktan ve kısa bir yazılı rapor, analizden önce NDA. Tüm fiyatlar net, KDV hariçtir ve yalnızca şirketler içindir.",
      },
    ],
  },
  cta: {
    label: "Tanışma",
    h: "Tek bir iş akışıyla başlayın.",
    p: "Şu anda hangi iş akışının size zaman kaybettirdiğini yazın. Tanışma görüşmesinde bir YZ Kontrolünün anlamlı olup olmadığını netleştiririz.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Yapay zeka danışmanlığına", to: "beratung" },
  },
};

export const page: PageSet = { de, en, tr };
