/**
 * Projects page (v7). Our own work only: opsolid.de, OpSo (product in test phase), Kutasia (project in
 * development). No client projects, logos or quotes. Status lines follow the build brief (OpSo: Android
 * closed test on Google Play, iPhone submitted to Apple for review, as of 28.10.2026).
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "projekte",
  meta: {
    title: "Projekte: eigene Arbeit mit klarem Status",
    description:
      "Unsere eigenen Projekte: opsolid.de im Betrieb, OpSo in der Testphase, Kutasia in Entwicklung. Wir zeigen nur Arbeit, die wir selbst gebaut haben.",
  },
  crumbs: [],
  crumb: "Projekte",
  hero: {
    eyebrow: "Projekte",
    h1: ["Eigene Projekte mit", "klarem", "Status."],
    lede: "Wir zeigen drei Projekte, die wir selbst gestalten und bauen: diese Website, unsere App OpSo und Kutasia. Jedes steht mit seinem heutigen Status da, vom laufenden Betrieb bis zur Entwicklung.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
    facts: ["Nur eigene Arbeit", "Status je Projekt angegeben", "Kundenprojekte nur mit schriftlicher Zustimmung"],
    media: {
      kind: "image",
      img: { src: "/img/v7/proof/opsolid-a.webp", w: 960, h: 640, alt: "Ausschnitt der Startseite von opsolid.de" },
      frame: "browser",
      caption: "Ausschnitt dieser Website, Stand 29.10.2026.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "projects",
      id: "projekte",
      label: "Projekte",
      note: "Drei eigene Projekte, jedes mit Status.",
      h: "Drei Projekte, drei Stände.",
      lede: "Eine Website im Betrieb, ein Produkt in der Testphase, ein Projekt in Entwicklung. Wir benennen jedes so, wie es heute ist.",
      items: [
        {
          name: "opsolid.de",
          status: "Im Betrieb",
          p: "Diese Website. Konzept, Design, Texte und Entwicklung stammen von uns, ebenso der laufende Betrieb.",
          points: ["Konzept, Design und Entwicklung", "Deutsch, Englisch und Türkisch", "Zugänglichkeit nach WCAG 2.2 AA als Maßstab"],
          img: { src: "/img/v7/proof/opsolid-a.webp", w: 960, h: 640, alt: "Ausschnitt der Startseite von opsolid.de" },
          frame: "browser",
        },
        {
          name: "OpSo",
          status: "Testphase",
          p: "Unsere digitale Visitenkarte: Sie legen ein Profil an, teilen es per Link, QR-Code oder NFC und fassen bei Kontakten nach. Zum Produkt gehören die App, das Onboarding und eine Admin-Konsole.",
          points: [
            "Android: geschlossener Test bei Google Play",
            "iPhone: bei Apple zur Prüfung eingereicht (Stand: 28.10.2026)",
            "Der Bildschirm zeigt ein Demo-Profil mit erfundenen Daten",
          ],
          img: { src: "/img/v7/opso/screens/02-share.webp", w: 540, h: 960, alt: "OpSo-App: Teilen per QR-Code, NFC oder Link, Bildschirm mit Demo-Daten" },
          frame: "phone",
          href: { label: "OpSo ansehen", to: "opso" },
        },
        {
          name: "Kutasia",
          status: "In Entwicklung",
          p: "Ein Posteingang für WhatsApp, Telegram und E-Mail mit KI-Vorsortierung. Kutasia ist noch kein Produkt und kein Angebot.",
          points: ["Kanäle: WhatsApp, Telegram, E-Mail", "Die KI sortiert vor, Menschen antworten"],
          img: {
            src: "/img/v7/proof/shot-kutasia.webp",
            w: 960,
            h: 640,
            alt: "Ausschnitt der Kutasia-Startseite mit der Überschrift „Kundennachrichten, Termine und Ihre Arbeit auf einem Bildschirm“",
          },
          frame: "browser",
        },
      ],
    },
    {
      t: "rows",
      id: "bezug",
      label: "Bezug zur Beratung",
      note: "Was die Projekte über unsere Arbeit sagen.",
      h: "Was das für Ihr Vorhaben bedeutet.",
      lede: "Eigene Projekte ersetzen keine Referenzen. Sie zeigen aber, wie wir arbeiten: von der Idee bis zum laufenden Betrieb.",
      items: [
        {
          tag: "Zeigt: Umsetzung und Betrieb",
          h: "opsolid.de",
          p: "Ziel, Aufbau, Texte und Technik haben wir selbst festgelegt, und wir halten die Seite aktuell. Das ist dieselbe Abfolge wie in einem Pilot: Umfang klären, bauen, betreiben.",
          href: { label: "Zum KI-Check", to: "check" },
        },
        {
          tag: "Zeigt: ein Produkt bis zur Prüfung",
          h: "OpSo",
          p: "Aus eigener Arbeit kennen wir den Weg von der Idee bis zur Veröffentlichung in den App-Stores: Datenhaltung, Zugriffsrechte, Tests und die Prüfung durch die Plattformen.",
          href: { label: "Zur OpSo-Seite", to: "opso" },
        },
        {
          tag: "Zeigt: KI mit Übergabe an Menschen",
          h: "Kutasia",
          p: "Nachrichten aus mehreren Kanälen landen in einem Posteingang, die KI sortiert vor. Hier erproben wir, wo die Vorsortierung trägt und wo ein Mensch entscheiden muss. Dieselbe Grenze ziehen wir in der Beratung.",
          href: { label: "Mehr zu KI-Assistenten", to: "agenten" },
        },
      ],
    },
    {
      t: "gallery",
      id: "opso-screens",
      label: "OpSo",
      note: "Echte Bildschirme, Demo-Daten.",
      h: "OpSo in vier Bildschirmen.",
      lede: "Die Bilder zeigen die App mit einem Demo-Profil. Alle Namen und Angaben darin sind erfunden.",
      frame: "phone",
      tag: "Demo-Daten",
      items: [
        { img: { src: "/img/v7/opso/screens/01-create.webp", w: 540, h: 960, alt: "OpSo-App: Karte erstellen, Schritt 1 mit Live-Vorschau, Demo-Daten" }, caption: "Profil anlegen" },
        { img: { src: "/img/v7/opso/screens/02-share.webp", w: 540, h: 960, alt: "OpSo-App: Teilen per QR-Code, Antippen oder NFC-Karte, Demo-Daten" }, caption: "Teilen per QR, NFC oder Link" },
        { img: { src: "/img/v7/opso/screens/06-contacts.webp", w: 540, h: 960, alt: "OpSo-App: Kontaktliste mit Notizen und Status, Demo-Daten" }, caption: "Kontakte mit Notizen und Status" },
        { img: { src: "/img/v7/opso/screens/07-editor.webp", w: 540, h: 960, alt: "OpSo-App: Editor mit Vorlagen, Demo-Daten" }, caption: "Vorlagen im Editor" },
      ],
    },
    {
      t: "spec",
      id: "stand",
      label: "Stand",
      note: "Was heute gilt.",
      h: "Wo jedes Projekt heute steht.",
      lede: "Die Übersicht nennt zu jedem Projekt den aktuellen Stand, ohne Ausschmückung.",
      rows: [
        ["opsolid.de", "Im Betrieb. Deutsch, Englisch und Türkisch."],
        ["OpSo", "Testphase. Android: geschlossener Test bei Google Play. iPhone: bei Apple zur Prüfung eingereicht (Stand: 28.10.2026)."],
        ["Kutasia", "In Entwicklung. Noch kein Produkt, nicht buchbar."],
        ["Kundenprojekte", "Zeigen wir nur mit schriftlicher Zustimmung. Aktuell zeigen wir keine."],
      ],
    },
    {
      t: "text",
      id: "eigene-arbeit",
      label: "Haltung",
      note: "Warum hier nur eigene Arbeit steht.",
      h: "Warum wir nur eigene Arbeit zeigen.",
      lede: "Eigene Arbeit dürfen wir zeigen. Fremde nur mit Erlaubnis.",
      paras: [
        "Projekte für Kunden gehören den Kunden. Ohne deren schriftliche Zustimmung nennen wir weder Namen noch Zahlen noch Bildschirme. Deshalb gibt es hier keine Kundenlogos und keine Referenzliste.",
        "Erfundene Referenzen, Zitate oder Kennzahlen gibt es bei uns nicht. Was auf dieser Seite zu sehen ist, haben wir selbst gebaut.",
        "Wie ein KI-Check abläuft und wie der Bericht aufgebaut ist, erklären wir Ihnen im Kennenlernen. Das Gespräch ist kostenlos und unverbindlich.",
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen zu unseren Projekten.",
    items: [
      {
        q: "Warum zeigen Sie keine Kundenprojekte?",
        a: "Kundenprojekte zeigen wir nur mit schriftlicher Zustimmung des Kunden. Aktuell steht hier ausschließlich eigene Arbeit.",
      },
      {
        q: "Ist OpSo schon erhältlich?",
        a: "Noch nicht allgemein. OpSo ist in der Testphase. Android: geschlossener Test bei Google Play. iPhone: bei Apple zur Prüfung eingereicht (Stand: 28.10.2026). Mehr steht auf der OpSo-Seite.",
      },
      {
        q: "Kann ich Kutasia nutzen oder kaufen?",
        a: "Nein. Kutasia ist ein Projekt in Entwicklung, noch kein Produkt und kein Angebot.",
      },
      {
        q: "Bauen Sie Websites für Kunden?",
        a: "Derzeit nicht. Unser Schwerpunkt ist die KI-Beratung: Wir finden die Abläufe, bei denen sich Automatisierung lohnt, und setzen die erste Lösung im Pilot zum Festpreis um, vorab schriftlich vereinbart.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Möchten Sie sehen, wie wir bei Ihnen vorgehen?",
    p: "Im Kennenlernen besprechen wir Ihren Ablauf, kostenlos und unverbindlich. Ob ein KI-Check sinnvoll ist, entscheiden Sie danach. Er kostet ab 490 € netto.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
  },
};

const en: PageDef = {
  key: "projekte",
  meta: {
    title: "Projects: our own work, with a clear status",
    description:
      "Our own projects: opsolid.de in operation, OpSo in testing, Kutasia in development. We only show work that we built ourselves, each with its current status.",
  },
  crumbs: [],
  crumb: "Projects",
  hero: {
    eyebrow: "Projects",
    h1: ["Our own projects, each with a", "clear", "status."],
    lede: "We show three projects that we design and build ourselves: this website, our app OpSo and Kutasia. Each is listed with its status today, from live operation to still in development.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "To AI consulting", to: "beratung" },
    facts: ["Our own work only", "Status given for each project", "Client projects only with written consent"],
    media: {
      kind: "image",
      img: { src: "/img/v7/proof/opsolid-a.webp", w: 960, h: 640, alt: "Excerpt of the opsolid.de home page" },
      frame: "browser",
      caption: "Excerpt of this website, as of 29 Oct 2026.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "projects",
      id: "projekte",
      label: "Projects",
      note: "Three projects of our own, each with its status.",
      h: "Three projects, three stages.",
      lede: "A website in operation, a product in testing, a project in development. We describe each one as it is today.",
      items: [
        {
          name: "opsolid.de",
          status: "In operation",
          p: "This website. Concept, design, copy and development are ours, and so is the day-to-day operation.",
          points: ["Concept, design and development", "German, English and Turkish", "Accessibility measured against WCAG 2.2 AA"],
          img: { src: "/img/v7/proof/opsolid-a.webp", w: 960, h: 640, alt: "Excerpt of the opsolid.de home page" },
          frame: "browser",
        },
        {
          name: "OpSo",
          status: "In testing",
          p: "Our digital business card: you create a profile, share it by link, QR code or NFC and follow up with your contacts. The product includes the app, the onboarding and an admin console.",
          points: [
            "Android: closed test on Google Play",
            "iPhone: submitted to Apple for review (as of 28 October 2026)",
            "The screen shows a demo profile with invented data",
          ],
          img: { src: "/img/v7/opso/screens/02-share.webp", w: 540, h: 960, alt: "OpSo app (German interface): sharing by QR code, NFC or link, screen with demo data" },
          frame: "phone",
          href: { label: "See OpSo", to: "opso" },
        },
        {
          name: "Kutasia",
          status: "In development",
          p: "One inbox for WhatsApp, Telegram and email, with AI pre-sorting. Kutasia is not yet a product or an offer.",
          points: ["Channels: WhatsApp, Telegram, email", "The AI pre-sorts, people reply"],
          img: {
            src: "/img/v7/proof/shot-kutasia.webp",
            w: 960,
            h: 640,
            alt: "Excerpt of the Kutasia home page (in German) with the headline “Kundennachrichten, Termine und Ihre Arbeit auf einem Bildschirm”, meaning customer messages, appointments and your work on one screen",
          },
          frame: "browser",
        },
      ],
    },
    {
      t: "rows",
      id: "bezug",
      label: "Link to consulting",
      note: "What the projects say about how we work.",
      h: "What this means for your project.",
      lede: "Our own projects are no substitute for client references. They do show how we work: from the idea to running operation.",
      items: [
        {
          tag: "Shows: delivery and operation",
          h: "opsolid.de",
          p: "We set the goal, structure, copy and technology ourselves, and we keep the site up to date. That is the same sequence as in a pilot: clarify the scope, build, operate.",
          href: { label: "To the AI check", to: "check" },
        },
        {
          tag: "Shows: a product through review",
          h: "OpSo",
          p: "From our own work, we know the road from an idea to publication in the app stores: data storage, access rights, testing and the platforms' review.",
          href: { label: "To the OpSo page", to: "opso" },
        },
        {
          tag: "Shows: AI with a handover to people",
          h: "Kutasia",
          p: "Messages from several channels land in one inbox, and the AI pre-sorts them. Here we test where pre-sorting holds up and where a person has to decide. We draw the same line in our consulting.",
          href: { label: "More on AI assistants", to: "agenten" },
        },
      ],
    },
    {
      t: "gallery",
      id: "opso-screens",
      label: "OpSo",
      note: "Real screens, demo data.",
      h: "OpSo in four screens.",
      lede: "The images show the app with a demo profile. All names and details in them are invented. The app interface is in German.",
      frame: "phone",
      tag: "Demo data",
      items: [
        { img: { src: "/img/v7/opso/screens/01-create.webp", w: 540, h: 960, alt: "OpSo app (German interface): creating a card, step 1 with live preview, demo data" }, caption: "Create a profile" },
        { img: { src: "/img/v7/opso/screens/02-share.webp", w: 540, h: 960, alt: "OpSo app (German interface): sharing by QR code, tap or NFC card, demo data" }, caption: "Share by QR, NFC or link" },
        { img: { src: "/img/v7/opso/screens/06-contacts.webp", w: 540, h: 960, alt: "OpSo app (German interface): contact list with notes and status, demo data" }, caption: "Contacts with notes and status" },
        { img: { src: "/img/v7/opso/screens/07-editor.webp", w: 540, h: 960, alt: "OpSo app (German interface): editor with templates, demo data" }, caption: "Templates in the editor" },
      ],
    },
    {
      t: "spec",
      id: "stand",
      label: "Status",
      note: "What applies today.",
      h: "Where each project stands today.",
      lede: "The overview gives the current status of each project, without embellishment.",
      rows: [
        ["opsolid.de", "In operation. German, English and Turkish."],
        ["OpSo", "In testing. Android: closed test on Google Play. iPhone: submitted to Apple for review (as of 28 October 2026)."],
        ["Kutasia", "In development. Not a product yet, not available to book."],
        ["Client projects", "We only show them with written consent. Right now, we show none."],
      ],
    },
    {
      t: "text",
      id: "eigene-arbeit",
      label: "Approach",
      note: "Why only our own work appears here.",
      h: "Why we only show our own work.",
      lede: "We may show our own work. Other people's work only with their permission.",
      paras: [
        "Client projects belong to the clients. Without their written consent, we name no names, no figures and no screens. That is why there are no client logos and no reference list here.",
        "We do not use invented references, quotes or metrics. Everything on this page is something we built ourselves.",
        "How an AI check runs and how the report is structured, we explain in an introductory call. The call is free and without obligation.",
      ],
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Frequently asked questions about our projects.",
    items: [
      {
        q: "Why do you not show client projects?",
        a: "We only show client projects with the client's written consent. At the moment, this page shows our own work only.",
      },
      {
        q: "Is OpSo available yet?",
        a: "Not publicly yet. OpSo is in testing. Android: closed test on Google Play. iPhone: submitted to Apple for review (as of 28 October 2026). More on the OpSo page.",
      },
      {
        q: "Can I use or buy Kutasia?",
        a: "No. Kutasia is a project in development, not yet a product or an offer.",
      },
      {
        q: "Do you build websites for clients?",
        a: "Not at the moment. Our focus is AI consulting: we find the workflows where automation pays off and build the first solution in a pilot at a fixed price, agreed in writing beforehand.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Would you like to see how we would approach your case?",
    p: "In an introductory call, free and without obligation, we discuss your workflow. You decide afterwards whether an AI check makes sense. It starts at €490 net.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "To AI consulting", to: "beratung" },
  },
};

const tr: PageDef = {
  key: "projekte",
  meta: {
    title: "Projeler: kendi işlerimiz ve güncel durumları",
    description:
      "Kendi projelerimiz: opsolid.de yayında, OpSo test aşamasında, Kutasia geliştirme aşamasında. Yalnızca kendi kurduğumuz işleri, güncel durumlarıyla gösteriyoruz.",
  },
  crumbs: [],
  crumb: "Projeler",
  hero: {
    eyebrow: "Projeler",
    h1: ["Kendi projelerimiz,", "net", "durumlarıyla."],
    lede: "Kendimizin tasarladığı ve kurduğu üç projeyi gösteriyoruz: bu web sitesi, OpSo uygulamamız ve Kutasia. Her biri bugünkü durumuyla yer alıyor; yayındaki siteden geliştirme aşamasındaki projeye kadar.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Yapay zeka danışmanlığına", to: "beratung" },
    facts: ["Yalnızca kendi işlerimiz", "Her projenin durumu belirtilir", "Müşteri projeleri yalnızca yazılı onayla"],
    media: {
      kind: "image",
      img: { src: "/img/v7/proof/opsolid-a.webp", w: 960, h: 640, alt: "opsolid.de ana sayfasından bir kesit" },
      frame: "browser",
      caption: "Bu web sitesinden bir kesit, 29.10.2026 itibarıyla.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "projects",
      id: "projekte",
      label: "Projeler",
      note: "Üç kendi projemiz, her birinin durumuyla.",
      h: "Üç proje, üç farklı aşama.",
      lede: "Yayında bir web sitesi, test aşamasında bir ürün, geliştirme aşamasında bir proje. Her birini bugün olduğu gibi adlandırıyoruz.",
      items: [
        {
          name: "opsolid.de",
          status: "Yayında",
          p: "Bu web sitesi. Kavram, tasarım, metinler ve geliştirme bize ait; günlük işletme de öyle.",
          points: ["Kavram, tasarım ve geliştirme", "Almanca, İngilizce ve Türkçe", "Erişilebilirlikte ölçüt: WCAG 2.2 AA"],
          img: { src: "/img/v7/proof/opsolid-a.webp", w: 960, h: 640, alt: "opsolid.de ana sayfasından bir kesit" },
          frame: "browser",
        },
        {
          name: "OpSo",
          status: "Test aşamasında",
          p: "Dijital kartvizitimiz: profil oluşturur, bağlantı, QR kod veya NFC ile paylaşır, kişileri takip edersiniz. Ürüne uygulama, ilk kurulum akışı ve bir yönetim konsolu da dahildir.",
          points: [
            "Android: Google Play'de kapalı test",
            "iPhone: Apple'a incelenmek üzere gönderildi (28.10.2026 itibarıyla)",
            "Ekran, kurgu verilerle bir demo profili gösterir",
          ],
          img: { src: "/img/v7/opso/screens/02-share.webp", w: 540, h: 960, alt: "OpSo uygulaması (Almanca arayüz): QR kod, NFC veya bağlantıyla paylaşım, demo verileriyle ekran" },
          frame: "phone",
          href: { label: "OpSo'ya göz atın", to: "opso" },
        },
        {
          name: "Kutasia",
          status: "Geliştirme aşamasında",
          p: "WhatsApp, Telegram ve e-posta için YZ ile ön sıralama yapan tek bir gelen kutusu. Kutasia henüz bir ürün ya da teklif değildir.",
          points: ["Kanallar: WhatsApp, Telegram, e-posta", "YZ ön sıralama yapar, yanıtı insanlar verir"],
          img: {
            src: "/img/v7/proof/shot-kutasia.webp",
            w: 960,
            h: 640,
            alt: "Kutasia ana sayfasından bir kesit (Almanca): “Kundennachrichten, Termine und Ihre Arbeit auf einem Bildschirm”, yani müşteri mesajları, randevular ve işiniz tek ekranda",
          },
          frame: "browser",
        },
      ],
    },
    {
      t: "rows",
      id: "bezug",
      label: "Danışmanlıkla bağlantı",
      note: "Projeler çalışma biçimimiz hakkında ne söylüyor.",
      h: "Bunun sizin projeniz için anlamı ne?",
      lede: "Kendi projelerimiz müşteri referanslarının yerini tutmaz. Ama nasıl çalıştığımızı gösterir: fikirden çalışan işletmeye kadar.",
      items: [
        {
          tag: "Gösterir: uygulama ve işletme",
          h: "opsolid.de",
          p: "Hedefi, yapıyı, metinleri ve teknolojiyi kendimiz belirledik, siteyi de güncel tutuyoruz. Bir pilottaki sıra da aynıdır: kapsamı netleştirmek, kurmak, işletmek.",
          href: { label: "YZ Kontrolüne", to: "check" },
        },
        {
          tag: "Gösterir: incelemeye kadar bir ürün",
          h: "OpSo",
          p: "Bir fikirden uygulama mağazalarında yayına uzanan yolu kendi çalışmamızdan biliyoruz: veri saklama, erişim yetkileri, testler ve platformların incelemesi.",
          href: { label: "OpSo sayfasına", to: "opso" },
        },
        {
          tag: "Gösterir: insana devreden YZ",
          h: "Kutasia",
          p: "Birden çok kanaldan gelen mesajlar tek bir gelen kutusuna düşer, YZ ön sıralama yapar. Burada ön sıralamanın nerede işe yaradığını, nerede bir insanın karar vermesi gerektiğini deniyoruz. Aynı sınırı danışmanlıkta da çizeriz.",
          href: { label: "YZ asistanları hakkında", to: "agenten" },
        },
      ],
    },
    {
      t: "gallery",
      id: "opso-screens",
      label: "OpSo",
      note: "Gerçek ekranlar, demo verileri.",
      h: "OpSo dört ekranda.",
      lede: "Görseller uygulamayı bir demo profiliyle gösterir. İçindeki tüm adlar ve bilgiler kurgudur. Uygulama arayüzü Almancadır.",
      frame: "phone",
      tag: "Demo verileri",
      items: [
        { img: { src: "/img/v7/opso/screens/01-create.webp", w: 540, h: 960, alt: "OpSo uygulaması (Almanca arayüz): kart oluşturma, canlı önizlemeli 1. adım, demo verileri" }, caption: "Profil oluşturma" },
        { img: { src: "/img/v7/opso/screens/02-share.webp", w: 540, h: 960, alt: "OpSo uygulaması (Almanca arayüz): QR kod, dokunma veya NFC kartla paylaşım, demo verileri" }, caption: "QR, NFC veya bağlantıyla paylaşım" },
        { img: { src: "/img/v7/opso/screens/06-contacts.webp", w: 540, h: 960, alt: "OpSo uygulaması (Almanca arayüz): notlar ve durumlarla kişi listesi, demo verileri" }, caption: "Notlu ve durumlu kişiler" },
        { img: { src: "/img/v7/opso/screens/07-editor.webp", w: 540, h: 960, alt: "OpSo uygulaması (Almanca arayüz): şablonlarla düzenleyici, demo verileri" }, caption: "Düzenleyicide şablonlar" },
      ],
    },
    {
      t: "spec",
      id: "stand",
      label: "Durum",
      note: "Bugün geçerli olan.",
      h: "Her proje bugün nerede?",
      lede: "Bu özet, her projenin güncel durumunu süslemeden verir.",
      rows: [
        ["opsolid.de", "Yayında. Almanca, İngilizce ve Türkçe."],
        ["OpSo", "Test aşamasında. Android: Google Play'de kapalı test. iPhone: Apple'a incelenmek üzere gönderildi (28.10.2026 itibarıyla)."],
        ["Kutasia", "Geliştirme aşamasında. Henüz ürün değil, sipariş edilemez."],
        ["Müşteri projeleri", "Yalnızca yazılı onayla gösteririz. Şu anda hiçbirini göstermiyoruz."],
      ],
    },
    {
      t: "text",
      id: "eigene-arbeit",
      label: "Tutum",
      note: "Burada neden yalnızca kendi işlerimiz var.",
      h: "Neden yalnızca kendi işlerimizi gösteriyoruz?",
      lede: "Kendi işimizi gösterebiliriz. Başkalarının işini yalnızca izinle.",
      paras: [
        "Müşteri projeleri müşterilere aittir. Yazılı onayları olmadan ne ad, ne rakam, ne de ekran görüntüsü paylaşırız. Bu yüzden burada müşteri logosu ya da referans listesi yoktur.",
        "Uydurma referans, alıntı ya da ölçüt kullanmayız. Bu sayfada gördüklerinizin hepsini kendimiz kurduk.",
        "Bir YZ Kontrolünün nasıl ilerlediğini ve raporun nasıl hazırlandığını tanışma görüşmesinde anlatırız. Görüşme ücretsizdir ve bağlayıcı değildir.",
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Projelerimiz hakkında sık sorulan sorular.",
    items: [
      {
        q: "Neden müşteri projelerini göstermiyorsunuz?",
        a: "Müşteri projelerini yalnızca müşterinin yazılı onayıyla gösteririz. Şu anda burada yalnızca kendi işlerimiz yer alır.",
      },
      {
        q: "OpSo şimdiden edinilebilir mi?",
        a: "Henüz herkese açık değil. OpSo test aşamasında. Android: Google Play'de kapalı test. iPhone: Apple'a incelenmek üzere gönderildi (28.10.2026 itibarıyla). Ayrıntılar OpSo sayfasında.",
      },
      {
        q: "Kutasia'yı kullanabilir ya da satın alabilir miyim?",
        a: "Hayır. Kutasia geliştirme aşamasında bir projedir; henüz ürün ya da teklif değildir.",
      },
      {
        q: "Müşteriler için web sitesi yapıyor musunuz?",
        a: "Şu anda hayır. Odağımız yapay zeka danışmanlığı: otomasyonun karşılığını vereceği iş akışlarını bulur, ilk çözümü sabit fiyatlı bir pilotla uygularız; fiyat önceden yazılı olarak kararlaştırılır.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Sizde nasıl ilerleyeceğimizi görmek ister misiniz?",
    p: "Ücretsiz ve bağlayıcı olmayan tanışma görüşmesinde iş akışınızı konuşuruz. Bir YZ Kontrolünün anlamlı olup olmadığına ondan sonra siz karar verirsiniz. YZ Kontrolü 490 €'dan başlar (net).",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Yapay zeka danışmanlığına", to: "beratung" },
  },
};

export const page: PageSet = { de, en, tr };
