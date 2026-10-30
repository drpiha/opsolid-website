/**
 * Anwendungsfälle (use cases by sector). German is the source; EN and TR are transcreations.
 * Everything here is an example, not a client project. Practices: organisational workflows only,
 * no health data. No numbers, savings or client claims.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "anwendungen",
  meta: {
    title: "KI-Anwendungsfälle für Dienstleistung, Gastronomie, Handel",
    description:
      "Beispiele für KI-Automatisierung in Dienstleistung, Gastronomie und Hotellerie, Handel und Praxen, mit dem, was beim Menschen bleibt. Keine Kundenprojekte.",
  },
  crumbs: ["beratung"],
  crumb: "Anwendungsfälle",
  hero: {
    eyebrow: "Anwendungsfälle · Beispiele nach Branche",
    h1: ["Anwendungsfälle, die im ", "Alltag", " tragen"],
    lede: "So kann KI-Automatisierung in vier Branchen aussehen: Dienstleistung, Gastronomie und Hotellerie, Handel sowie Praxen. Zu jedem Beispiel gehört, was beim Menschen bleibt.",
    primary: { label: "KI-Check ansehen", to: "check" },
    secondary: { label: "Anwendungsfall besprechen", to: "kontakt", query: { anliegen: "beratung" } },
    facts: ["Beispiele, keine Kundenprojekte", "Praxen: nur organisatorische Abläufe"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Skizze eines Ablaufs in vier Stationen: Branche, Ablauf, Entwurf, Freigabe",
      caption: "Von der Branche zur Freigabe: Jedes Beispiel endet bei einem Menschen.",
      fig: "0.1",
      labels: ["Branche", "Ablauf", "Entwurf", "Freigabe"],
    },
  },
  blocks: [
    {
      t: "sectors",
      id: "branchen",
      label: "Branchen",
      h: "Anwendungsfälle nach Branche",
      lede: "Wählen Sie Ihre Branche: Sie sehen, was sich übernehmen lässt und was bei Ihrem Team bleibt.",
      tag: "Beispielideen, keine Kundenprojekte",
      items: [
        {
          name: "Dienstleistung",
          h: "Anfragen, Angebote und Termine vorbereiten lassen",
          p: "Agenturen, Beratungen und Büros: Vieles in Anfragen und Zusagen folgt demselben Muster und lässt sich vorbereiten, bevor ein Mensch hinsieht.",
          ideas: [
            "Anfragen aus E-Mail und Formular sortieren und mit Antwortentwurf vorbereiten",
            "Angebotsentwürfe aus Vorlage und Kurzbriefing erstellen",
            "Terminbestätigungen und Erinnerungen automatisch versenden",
            "Stundenzettel und Rechnungsdaten abgleichen",
          ],
          stays: "Preise, Zusagen und der Ton gegenüber Kundinnen und Kunden. Angebote gehen erst nach Freigabe raus.",
        },
        {
          name: "Gastronomie & Hotellerie",
          h: "Gäste auch dann erreichen, wenn das Haus voll ist",
          p: "Anrufe, Reservierungen und immer dieselben Fragen kommen oft dann, wenn niemand Zeit hat. Ein Assistent nimmt die Routine ab.",
          ideas: [
            "Reservierungsanfragen per Telefon oder Chat außerhalb der Öffnungszeiten aufnehmen",
            "Fragen zu Öffnungszeiten, Anfahrt und Speisekarte beantworten",
            "Bewertungen sichten und Antwortentwürfe vorbereiten",
            "Bestätigungen und Hinweise vor der Anreise versenden",
          ],
          stays: "Sonderwünsche, Beschwerden und die Entscheidung über Tische, Zimmer und Preise.",
        },
        {
          name: "Handel",
          h: "Bestellungen und Kundenfragen ohne Tipparbeit",
          p: "Im Handel wandern Daten zwischen Lieferanten, Warenwirtschaft und Kundenservice. Je weniger davon von Hand läuft, desto seltener schleichen sich Tippfehler ein.",
          ideas: [
            "Fragen zu Lieferstatus und Retouren vorsortieren und vorbereitet beantworten",
            "Lieferscheine und Rechnungen auslesen und in die Warenwirtschaft eintragen",
            "Produkttexte aus Lieferantendaten als Entwurf erstellen",
            "Bestellbestätigungen mit dem Bestand abgleichen",
          ],
          stays: "Kulanzentscheidungen, Reklamationen und Preisfreigaben.",
        },
        {
          name: "Praxen (ohne Gesundheitsdaten)",
          tab: "Praxen",
          h: "Organisation entlasten, ohne sensible Inhalte anzufassen",
          p: "Wir automatisieren hier nur organisatorische Abläufe. Gesundheitsdaten bleiben außen vor, und fachliche Inhalte verarbeitet ein Mensch.",
          ideas: [
            "Terminanfragen und Terminverschiebungen organisieren",
            "Erinnerungen an Termine versenden",
            "Rückrufbitten mit Name und Telefonnummer erfassen und weiterleiten",
            "Unterlagen anfordern und den Eingang nachhalten",
          ],
          stays: "Fachliche Beurteilung, Beratung und alles, was die Inhalte einzelner Fälle betrifft.",
        },
      ],
    },
    {
      t: "examples",
      id: "szenarien",
      label: "Szenarien",
      h: "Drei Abläufe im Vorher und Nachher",
      lede: "Sie zeigen, wo KI vorbereitet und wo ein Mensch entscheidet.",
      tag: "Beispiel-Szenario",
      items: [
        {
          area: "Anfragen & E-Mails",
          h: "Terminanfragen per E-Mail",
          before: "Terminwünsche kommen per E-Mail in verschiedenen Formulierungen. Jemand liest sie, prüft den Kalender und antwortet von Hand.",
          after: "Die Anfrage wird erkannt, freie Zeiten werden vorgeschlagen und ein Antwortentwurf liegt bereit.",
          human: "Ihr Team prüft den Entwurf und sendet ihn, besondere Wünsche entscheidet eine Person.",
          href: { label: "Mehr zur Prozessautomatisierung", to: "prozess" },
        },
        {
          area: "Telefon & Chat",
          h: "Standardfragen außerhalb der Öffnungszeiten",
          before: "Anrufe und Chat-Nachrichten außerhalb der Öffnungszeiten bleiben liegen, und am nächsten Morgen müssen alle einzeln beantwortet werden.",
          after: "Ein KI-Assistent beantwortet Standardfragen, nimmt Anliegen auf und legt sie sortiert ab.",
          human: "Bei allem, was über Standardfragen hinausgeht, übergibt der Assistent an Ihr Team.",
          href: { label: "Mehr zu KI-Assistenten", to: "agenten" },
        },
        {
          area: "Microsoft 365",
          h: "Angebotsentwurf aus einer Anfrage",
          before: "Aus einer Anfrage wird von Hand ein Angebot gebaut: Vorlage suchen, Daten übertragen, Text anpassen.",
          after: "Outlook, SharePoint und Power Automate legen aus der Anfrage einen Angebotsentwurf mit den richtigen Daten an.",
          human: "Der Vertrieb prüft den Entwurf, ändert ihn bei Bedarf und gibt ihn frei.",
          href: { label: "Mehr zu Microsoft 365", to: "m365" },
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Leitsatz",
      text: "Nicht jeder Ablauf braucht Automatisierung",
    },
    {
      t: "principles",
      id: "kriterien",
      label: "Kriterien",
      h: "Woran sich ein guter Anwendungsfall erkennen lässt",
      lede: "Im KI-Check prüfen wir vier Dinge, bevor wir etwas empfehlen.",
      items: [
        { h: "Er kehrt regelmäßig wieder", p: "Ein Ablauf, der täglich oder wöchentlich läuft, trägt den Aufwand eher als ein seltener." },
        { h: "Er folgt erkennbaren Regeln", p: "Wo Menschen immer ähnlich entscheiden, lässt sich vorbereiten. Wo jeder Fall anders ist, bleibt es Handarbeit." },
        { h: "Die Eingänge sind digital", p: "E-Mail, Formular, Dokument oder Datensatz lassen sich verarbeiten. Handschriftliche Zettel sind schwieriger." },
        { h: "Ein Mensch kann das Ergebnis prüfen", p: "Wir bauen nur, was Ihr Team sehen, ändern und freigeben kann, bevor es nach außen geht." },
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Fragen zu Anwendungsfällen",
    items: [
      {
        q: "Gibt es einen Anwendungsfall für meine Branche?",
        a: "Die vier Branchen sind unser Schwerpunkt. Ob ein konkreter Ablauf in Ihrem Betrieb passt, klären wir im KI-Check an Ihren eigenen Abläufen.",
      },
      {
        q: "Wir sind eine Praxis. Geht das?",
        a: "Für organisatorische Abläufe wie Termine, Erinnerungen und Rückrufbitten ja. Abläufe mit Gesundheitsdaten nehmen wir nicht auf.",
      },
      {
        q: "Müssen wir dafür unsere Software wechseln?",
        a: "Nein. Wir bauen auf dem auf, was Sie nutzen, etwa Microsoft 365, Ihr CRM oder Ihre Warenwirtschaft, und verbinden es.",
      },
      {
        q: "Was kostet ein Anwendungsfall?",
        a: "Der KI-Check kostet ab 990 € netto. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an. Für die Umsetzung als Pilot legen wir Umfang und Festpreis vorab schriftlich fest. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Welcher Ablauf soll der erste sein?",
    p: "Schildern Sie uns kurz, wo die Arbeit hakt. Wir melden uns und klären, ob ein KI-Check sinnvoll ist.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
  },
  schema: {
    service: {
      name: "KI-Anwendungsfälle nach Branche",
      serviceType: "KI-Beratung",
      description:
        "Beispiele für KI-Automatisierung in Dienstleistung, Gastronomie und Hotellerie, Handel sowie Praxen. Beispiele, keine Kundenprojekte.",
      offers: [{ name: "KI-Check", price: 990, from: true }],
    },
  },
};

const en: PageDef = {
  key: "anwendungen",
  meta: {
    title: "AI use cases for services, hospitality and retail",
    description:
      "Examples of AI automation by sector: services, hospitality, retail and practices. With what stays with people. Examples, not client projects.",
  },
  crumbs: ["beratung"],
  crumb: "Use cases",
  hero: {
    eyebrow: "Use cases · examples by sector",
    h1: ["Use cases that hold up in ", "daily", " work"],
    lede: "This is what AI automation can look like in four sectors: services, hospitality, retail and practices. Each example comes with what stays with people.",
    primary: { label: "See the AI check", to: "check" },
    secondary: { label: "Discuss a use case", to: "kontakt", query: { anliegen: "beratung" } },
    facts: ["Examples, not client projects", "Practices: organisational workflows only"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Sketch of a workflow in four stations: sector, workflow, draft, approval",
      caption: "From sector to approval: every example ends with a person.",
      fig: "0.1",
      labels: ["Sector", "Workflow", "Draft", "Approval"],
    },
  },
  blocks: [
    {
      t: "sectors",
      id: "branchen",
      label: "Sectors",
      h: "Use cases by sector",
      lede: "Pick your sector and see what can be taken over and what stays with your team.",
      tag: "Example ideas, not client projects",
      items: [
        {
          name: "Services",
          h: "Have enquiries, quotes and appointments prepared for you",
          p: "Agencies, consultancies and offices: much of the work on enquiries and commitments follows the same pattern and can be prepared before a person looks at it.",
          ideas: [
            "Sort enquiries from email and forms and prepare a draft reply",
            "Create quote drafts from a template and a short briefing",
            "Send appointment confirmations and reminders automatically",
            "Reconcile timesheets and invoice data",
          ],
          stays: "Prices, commitments and the tone towards customers. Quotes only go out after approval.",
        },
        {
          name: "Hospitality",
          h: "Reach guests even when the house is full",
          p: "Calls, bookings and the same questions again and again often arrive when nobody has time. An assistant takes over the routine.",
          ideas: [
            "Take booking requests by phone or chat outside opening hours",
            "Answer questions about opening hours, directions and the menu",
            "Review ratings and prepare draft replies",
            "Send confirmations and information before arrival",
          ],
          stays: "Special requests, complaints and the decision on tables, rooms and prices.",
        },
        {
          name: "Retail",
          h: "Orders and customer questions without the typing",
          p: "In retail, data moves between suppliers, inventory systems and customer service. The less of it runs by hand, the fewer typing errors creep in.",
          ideas: [
            "Pre-sort questions about delivery status and returns and answer them with prepared replies",
            "Read delivery notes and invoices and enter them into the inventory system",
            "Draft product texts from supplier data",
            "Reconcile order confirmations with stock",
          ],
          stays: "Goodwill decisions, complaints and price approvals.",
        },
        {
          name: "Practices (no health data)",
          tab: "Practices",
          h: "Relieve the organisation without touching sensitive content",
          p: "Here we automate organisational workflows only. Health data stays out, and a person handles professional content.",
          ideas: [
            "Organise appointment requests and rescheduling",
            "Send appointment reminders",
            "Capture callback requests with name and phone number and pass them on",
            "Request documents and track their receipt",
          ],
          stays: "Professional judgement, advice and anything that concerns the content of individual cases.",
        },
      ],
    },
    {
      t: "examples",
      id: "szenarien",
      label: "Scenarios",
      h: "Three workflows, before and after",
      lede: "They show where AI prepares and where a person decides.",
      tag: "Example scenario",
      items: [
        {
          area: "Enquiries & email",
          h: "Appointment requests by email",
          before: "Appointment requests arrive by email in many wordings. Someone reads them, checks the calendar and replies by hand.",
          after: "The request is recognised, free slots are suggested and a draft reply is ready.",
          human: "Your team checks the draft and sends it; special requests are decided by a person.",
          href: { label: "More about process automation", to: "prozess" },
        },
        {
          area: "Phone & chat",
          h: "Standard questions outside opening hours",
          before: "Calls and chat messages outside opening hours are left waiting, and the next morning each has to be answered individually.",
          after: "An AI assistant answers standard questions, takes down requests and files them sorted.",
          human: "For anything beyond standard questions, the assistant hands over to your team.",
          href: { label: "More about AI assistants", to: "agenten" },
        },
        {
          area: "Microsoft 365",
          h: "A quote draft from an enquiry",
          before: "A quote is built by hand from an enquiry: find the template, transfer the data, adapt the text.",
          after: "Outlook, SharePoint and Power Automate create a quote draft with the right data from the enquiry.",
          human: "Sales checks the draft, changes it if needed and approves it.",
          href: { label: "More about Microsoft 365", to: "m365" },
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Key point",
      text: "Not every workflow needs automation",
    },
    {
      t: "principles",
      id: "kriterien",
      label: "Criteria",
      h: "How to recognise a good use case",
      lede: "In the AI check we examine four things before we recommend anything.",
      items: [
        { h: "It recurs regularly", p: "A workflow that runs daily or weekly carries the effort better than a rare one." },
        { h: "It follows recognisable rules", p: "Where people decide in similar ways, preparation works. Where every case is different, it stays manual." },
        { h: "The inputs are digital", p: "Email, form, document or record can be processed. Handwritten notes are harder." },
        { h: "A person can check the result", p: "We only build what your team can see, change and approve before it goes outside." },
      ],
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Questions about use cases",
    items: [
      {
        q: "Is there a use case for my sector?",
        a: "The four sectors are our focus. Whether a specific workflow fits your business, we clarify in the AI check using your own workflows.",
      },
      {
        q: "We are a practice. Does this work?",
        a: "For organisational workflows such as appointments, reminders and callback requests, yes. We do not record workflows that involve health data.",
      },
      {
        q: "Do we have to change our software?",
        a: "No. We build on what you use, such as Microsoft 365, your CRM or your inventory system, and connect it.",
      },
      {
        q: "What does a use case cost?",
        a: "The AI check costs from €990 net. Credited in full against a follow-up order within 60 days. For implementation as a pilot, we set scope and fixed price in writing beforehand. All prices are net of VAT and for businesses only.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Which workflow should come first?",
    p: "Tell us briefly where the work gets stuck. We will get back to you and clarify whether an AI check makes sense.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "To AI consulting", to: "beratung" },
  },
  schema: {
    service: {
      name: "AI use cases by sector",
      serviceType: "AI consulting",
      description:
        "Examples of AI automation in services, hospitality, retail and practices. Examples, not client projects.",
      offers: [{ name: "AI check", price: 990, from: true }],
    },
  },
};

const tr: PageDef = {
  key: "anwendungen",
  meta: {
    title: "Hizmet, yeme-içme ve perakende için YZ kullanım örnekleri",
    description:
      "Sektöre göre YZ otomasyonu örnekleri: hizmet, yeme-içme ve konaklama, perakende ve muayenehaneler. İnsanda kalanlarla birlikte. Örnekler, müşteri projesi değil.",
  },
  crumbs: ["beratung"],
  crumb: "Kullanım örnekleri",
  hero: {
    eyebrow: "Kullanım örnekleri · sektöre göre örnekler",
    h1: ["Günlük işte ", "ayakta kalan", " kullanım örnekleri"],
    lede: "YZ otomasyonu dört sektörde böyle görünebilir: hizmet, yeme-içme ve konaklama, perakende ve muayenehaneler. Her örnekte insanda neyin kaldığı da yazılıdır.",
    primary: { label: "YZ Kontrolü'nü inceleyin", to: "check" },
    secondary: { label: "Bir kullanım örneğini görüşün", to: "kontakt", query: { anliegen: "beratung" } },
    facts: ["Örnekler, müşteri projesi değil", "Muayenehaneler: yalnızca idari iş akışları"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Dört istasyonlu bir iş akışı çizimi: sektör, akış, taslak, onay",
      caption: "Sektörden onaya: Her örnek bir insanla biter.",
      fig: "0.1",
      labels: ["Sektör", "Akış", "Taslak", "Onay"],
    },
  },
  blocks: [
    {
      t: "sectors",
      id: "branchen",
      label: "Sektörler",
      h: "Sektöre göre kullanım örnekleri",
      lede: "Sektörünüzü seçin; nelerin devralınabildiğini ve nelerin ekibinizde kaldığını görün.",
      tag: "Örnek fikirler, müşteri projesi değil",
      items: [
        {
          name: "Hizmet",
          h: "Talepleri, teklifleri ve randevuları hazırlatmak",
          p: "Ajanslar, danışmanlık şirketleri ve ofisler: talepler ve taahhütlerle ilgili işlerin büyük kısmı aynı kalıbı izler ve bir insan bakmadan önce hazırlanabilir.",
          ideas: [
            "E-posta ve formdan gelen talepleri sıralamak ve yanıt taslağı hazırlamak",
            "Şablon ve kısa bir brifingten teklif taslakları oluşturmak",
            "Randevu onaylarını ve hatırlatmalarını otomatik göndermek",
            "Puantaj ve fatura verilerini karşılaştırmak",
          ],
          stays: "Fiyatlar, taahhütler ve müşterilere karşı üslup. Teklifler yalnızca onaydan sonra gider.",
        },
        {
          name: "Yeme-içme ve konaklama",
          h: "Mekân doluyken de misafirlere ulaşmak",
          p: "Aramalar, rezervasyonlar ve hep aynı sorular çoğu zaman kimsenin vakti olmadığı anlarda gelir. Bir asistan rutini üstlenir.",
          ideas: [
            "Çalışma saatleri dışında telefon veya sohbetle rezervasyon taleplerini almak",
            "Çalışma saatleri, ulaşım ve menü hakkındaki soruları yanıtlamak",
            "Değerlendirmeleri incelemek ve yanıt taslakları hazırlamak",
            "Varıştan önce onay ve bilgilendirme mesajları göndermek",
          ],
          stays: "Özel istekler, şikâyetler ve masa, oda ile fiyat kararları.",
        },
        {
          name: "Perakende",
          h: "Siparişler ve müşteri soruları, yazı yazmadan",
          p: "Perakendede veriler tedarikçiler, stok sistemi ve müşteri hizmetleri arasında dolaşır. Ne kadarı elle yürürse, yazım hatası riski de o kadar artar.",
          ideas: [
            "Teslimat durumu ve iade sorularını ön sıralamaya almak ve hazır yanıtlarla cevaplamak",
            "İrsaliye ve faturaları okuyup stok sistemine girmek",
            "Tedarikçi verilerinden ürün metni taslakları hazırlamak",
            "Sipariş onaylarını stokla karşılaştırmak",
          ],
          stays: "Hoşgörü kararları, şikâyetler ve fiyat onayları.",
        },
        {
          name: "Muayenehaneler (sağlık verisi olmadan)",
          tab: "Muayenehaneler",
          h: "Hassas içeriğe dokunmadan idari yükü hafifletmek",
          p: "Burada yalnızca idari iş akışlarını otomatikleştiririz. Sağlık verileri dışarıda kalır; mesleki içerikleri bir insan işler.",
          ideas: [
            "Randevu taleplerini ve erteleme isteklerini düzenlemek",
            "Randevu hatırlatmaları göndermek",
            "Geri arama taleplerini ad ve telefon numarasıyla kaydedip iletmek",
            "Belge talep etmek ve gelişini takip etmek",
          ],
          stays: "Mesleki değerlendirme, danışmanlık ve tek tek vakaların içeriğiyle ilgili her şey.",
        },
      ],
    },
    {
      t: "examples",
      id: "szenarien",
      label: "Senaryolar",
      h: "Üç iş akışı, öncesi ve sonrasıyla",
      lede: "YZ'nin nerede hazırladığını ve nerede bir insanın karar verdiğini gösterirler.",
      tag: "Örnek senaryo",
      items: [
        {
          area: "Talepler ve e-posta",
          h: "E-postayla gelen randevu talepleri",
          before: "Randevu istekleri e-postayla farklı ifadelerle gelir. Biri okur, takvime bakar ve elle yanıtlar.",
          after: "Talep tanınır, boş saatler önerilir ve hazır bir yanıt taslağı bekler.",
          human: "Ekibiniz taslağı kontrol edip gönderir; özel istekleri bir insan karara bağlar.",
          href: { label: "Süreç otomasyonu hakkında", to: "prozess" },
        },
        {
          area: "Telefon ve sohbet",
          h: "Çalışma saatleri dışındaki standart sorular",
          before: "Çalışma saatleri dışındaki aramalar ve sohbet mesajları bekler; ertesi sabah her biri tek tek yanıtlanmak zorunda kalır.",
          after: "Bir YZ asistanı standart soruları yanıtlar, talepleri alır ve sıralı biçimde kaydeder.",
          human: "Standart soruların ötesindeki her şeyde asistan ekibinize devreder.",
          href: { label: "YZ asistanları hakkında", to: "agenten" },
        },
        {
          area: "Microsoft 365",
          h: "Bir talepten teklif taslağı",
          before: "Bir talepten elle teklif hazırlanır: şablon aranır, veriler aktarılır, metin uyarlanır.",
          after: "Outlook, SharePoint ve Power Automate, talepten doğru verilerle bir teklif taslağı oluşturur.",
          human: "Satış taslağı kontrol eder, gerekirse değiştirir ve onaylar.",
          href: { label: "Microsoft 365 hakkında", to: "m365" },
        },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Ana fikir",
      text: "Her iş akışının otomasyona ihtiyacı yok",
    },
    {
      t: "principles",
      id: "kriterien",
      label: "Ölçütler",
      h: "İyi bir kullanım örneği nasıl anlaşılır?",
      lede: "YZ Kontrolü'nde bir şey önermeden önce dört şeye bakarız.",
      items: [
        { h: "Düzenli olarak tekrarlanır", p: "Günlük ya da haftalık işleyen bir iş akışı, nadir bir iş akışından daha iyi emeğini çıkarır." },
        { h: "Tanınabilir kuralları izler", p: "İnsanların hep benzer karar verdiği yerde hazırlık mümkündür. Her vakanın farklı olduğu yerde iş elle kalır." },
        { h: "Girdiler dijitaldir", p: "E-posta, form, belge ya da kayıt işlenebilir. El yazısı notlar daha zordur." },
        { h: "Bir insan sonucu kontrol edebilir", p: "Yalnızca ekibinizin dışarı çıkmadan görebildiği, değiştirebildiği ve onaylayabildiği şeyi kurarız." },
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Kullanım örnekleri hakkında sorular",
    items: [
      {
        q: "Sektörüm için bir kullanım örneği var mı?",
        a: "Dört sektör odağımızdır. Belirli bir iş akışının işletmenize uyup uymadığını, YZ Kontrolü'nde kendi iş akışlarınız üzerinden netleştiririz.",
      },
      {
        q: "Biz bir muayenehaneyiz. Bu mümkün mü?",
        a: "Randevu, hatırlatma ve geri arama talepleri gibi idari iş akışları için evet. Sağlık verisi içeren iş akışlarını kaydetmeyiz.",
      },
      {
        q: "Bunun için yazılımımızı değiştirmek zorunda mıyız?",
        a: "Hayır. Microsoft 365, CRM'iniz veya stok sisteminiz gibi kullandığınız araçların üzerine kurar ve onları birbirine bağlarız.",
      },
      {
        q: "Bir kullanım örneği ne kadar tutar?",
        a: "YZ Kontrolü 990 €'dan itibaren (net). 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Pilot olarak uygulama için kapsamı ve sabit fiyatı önceden yazılı olarak belirleriz. Tüm fiyatlar net, KDV hariçtir ve yalnızca işletmeler içindir.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "İlk hangi iş akışı olsun?",
    p: "Bize kısaca işin nerede tıkandığını yazın. Size döner ve bir YZ Kontrolü'nün anlamlı olup olmadığını netleştiririz.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "YZ danışmanlığına", to: "beratung" },
  },
  schema: {
    service: {
      name: "Sektöre göre YZ kullanım örnekleri",
      serviceType: "Yapay zeka danışmanlığı",
      description:
        "Hizmet, yeme-içme ve konaklama, perakende ile muayenehaneler için YZ otomasyonu örnekleri. Örnekler, müşteri projesi değil.",
      offers: [{ name: "YZ Kontrolü", price: 990, from: true }],
    },
  },
};

export const page: PageSet = { de, en, tr };
