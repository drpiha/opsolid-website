/**
 * KI-Kompetenz Basis in depth. German is the source; EN and TR are transcreations in full key parity.
 * Published price: ab 1.790 EUR netto pro Team (half day, 10 included, each additional 90 EUR, up to 15). Art. 4 only in the safe wording of
 * trainings.md section 1. The sample certificate is labelled "Muster" and carries placeholders only.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "kompetenz",
  meta: {
    title: "KI-Kompetenz Schulung: Basis für Ihr Team, online",
    description:
      "KI-Kompetenz Basis: halber Tag, online live, ab 1.790 € netto pro Team (10 Personen inklusive, bis 15). Grundlagen, Risiken, Datenschutz, mit Bescheinigung.",
  },
  crumbs: ["schulungen"],
  crumb: "KI-Kompetenz",
  hero: {
    eyebrow: "KI-Schulung · halber Tag · online live",
    h1: ["KI-Kompetenz Basis: ", "sicher mit KI", " arbeiten"],
    lede: "Ein halber Tag, an dem Ihr Team lernt, was KI kann, wo sie irrt und welche Regeln im Alltag gelten. Online und live, für bis zu 15 Personen, mit Teilnahmebescheinigung.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Agenda ansehen", to: "kompetenz", hash: "agenda" },
    facts: ["Ab 1.790 € netto pro Team", "Halber Tag · 10 Personen inklusive, bis 15", "Deutsch oder Englisch"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Skizze: ineinander liegende abgerundete Quadrate über einem Ablauf in vier Stationen: Grundlagen, Grenzen, Regeln, Nachweis",
      caption: "Von den Grundlagen über die Grenzen zu den Regeln.",
      fig: "0.1",
      labels: ["Grundlagen", "Grenzen", "Regeln", "Nachweis"],
    },
  },
  blocks: [
    {
      t: "spec",
      id: "eckdaten",
      label: "Eckdaten",
      h: "Was die Schulung umfasst",
      rows: [
        ["Preis", "Ab 1.790 € netto pro Team, 10 Personen inklusive, jede weitere Person 90 € (bis 15 Personen), zzgl. USt., nur für Unternehmen"],
        ["Umfang", "Halber Tag, 10 Personen inklusive, bis zu 15 Personen"],
        ["Durchführung", "Online live auf Deutsch oder Englisch, per Microsoft Teams oder Zoom; geschlossener Termin für Ihr Team nach Vereinbarung"],
        ["Leitung", "Die Trainerin oder den Trainer nennen wir Ihnen vor der Buchung namentlich."],
        ["Nachweis", "Teilnahmebescheinigung von OpSolid"],
      ],
    },
    {
      t: "situations",
      id: "fuer-wen",
      label: "Für wen",
      note: "Für alle, die KI im Büro nutzen.",
      h: "Für Teams, die KI nutzen oder bald nutzen",
      lede: "Die Schulung richtet sich an Beschäftigte aller Bereiche, nicht an Technikerinnen und Techniker. Vorkenntnisse sind nicht nötig.",
      cta: { label: "Zur KI-Beratung", to: "beratung" },
      items: [
        { h: "Das Team nutzt KI, aber ohne gemeinsame Regeln", p: "Alle probieren für sich aus. Was in ein KI-Werkzeug gehört und was nicht, ist nicht geklärt." },
        { h: "Die Geschäftsführung will Maßnahmen dokumentieren", p: "Sie möchten zeigen können, was Ihr Unternehmen für die KI-Kompetenz getan hat, ohne ein großes Projekt zu starten." },
        { h: "Neue Werkzeuge kommen, die Unsicherheit bleibt", p: "Copilot, ChatGPT oder Gemini sind verfügbar. Niemand hat gezeigt, wie man sie sicher nutzt." },
        { h: "Mitarbeitende fragen, was erlaubt ist", p: "Es fehlt eine einfache Antwort und ein Ort, an dem Fragen willkommen sind." },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Leitsatz",
      text: "Wer KI nutzt, sollte ihre Grenzen kennen",
    },
    {
      t: "steps",
      id: "agenda",
      label: "Agenda",
      note: "Sechs Themen in dieser Reihenfolge.",
      h: "Was an dem halben Tag passiert",
      lede: "Vom Verständnis bis zu den Regeln, mit Beispielen aus Ihrem Team.",
      items: [
        { h: "Was KI ist und was nicht", p: "Wie Sprachmodelle arbeiten, warum sie überzeugend klingen und trotzdem irren können." },
        { h: "Gute Anfragen stellen", p: "Aufgaben so beschreiben, dass das Ergebnis brauchbar wird. Geübt an Beispielen aus Ihrem Alltag." },
        { h: "Fehler erkennen", p: "Erfundene Angaben, veraltetes Wissen, einseitige Antworten. Wir üben, Ergebnisse zu prüfen, bevor sie weitergehen." },
        { h: "Datenschutz im Alltag", p: "Welche Informationen in ein KI-Werkzeug gehören und welche nicht, und warum. Die Grundlagen der DSGVO, praktisch erklärt." },
        { h: "Regeln für Ihr Team", p: "Wir erarbeiten gemeinsam einfache Dos und Don’ts, die Ihr Team danach anwenden kann." },
        { h: "Menschliche Kontrolle", p: "Wer prüft was, bevor ein KI-Ergebnis in ein Dokument, eine E-Mail oder eine Entscheidung eingeht." },
      ],
    },
    {
      t: "text",
      id: "art-4",
      label: "KI-Verordnung",
      note: "Zur Einordnung.",
      h: "Wie die Schulung zu Art. 4 passt",
      lede: "Sie kann ein Baustein Ihrer Maßnahmen zur KI-Kompetenz sein.",
      paras: [
        "Unternehmen, die KI einsetzen, ergreifen nach Art. 4 der KI-Verordnung Maßnahmen, um die KI-Kompetenz ihrer Beschäftigten zu fördern. Das gilt seit dem 2. Februar 2025. Die Vorschrift wurde durch die Verordnung (EU) 2026/1744 neu gefasst, die seit dem 27. Juli 2026 in Kraft ist.",
        "Ein Zertifikat ist nicht vorgeschrieben. Dokumentierte Maßnahmen sind gute Praxis.",
        "KI-Kompetenz Basis deckt die Grundlagen für alle Beschäftigten ab. Sie ist eine Maßnahme von mehreren, kein vollständiger Nachweis. Wir geben keine Rechtsberatung.",
      ],
    },
    {
      t: "sample",
      id: "nachweis",
      label: "Nachweis",
      h: "Die Teilnahmebescheinigung",
      lede: "Alle Teilnehmenden erhalten eine Bescheinigung für die Unterlagen.",
      mark: "Muster",
      title: "Teilnahmebescheinigung",
      meta: "Platzhalter in eckigen Klammern",
      rows: [
        ["Schulung", "KI-Kompetenz Basis"],
        ["Datum", "[Datum]"],
        ["Dauer", "Halber Tag"],
        ["Themen", "Grundlagen, Datenschutz, Regeln"],
        ["Trainerin oder Trainer", "[Name]"],
        ["Teilnehmende Person", "[Name]"],
      ],
      foot: "Die Bescheinigung belegt die Teilnahme. Sie ist kein Zertifikat einer Behörde, einer Kammer oder eines Verbands.",
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen zu KI-Kompetenz Basis",
    items: [
      {
        q: "Ist das ein Zertifikatskurs?",
        a: "Nein. Ein Zertifikat ist nicht vorgeschrieben. Sie erhalten eine Teilnahmebescheinigung von OpSolid, die Ihre dokumentierten Maßnahmen zur KI-Kompetenz ergänzen kann.",
      },
      {
        q: "Gilt der Preis pro Person?",
        a: "Nein, pro Team: ab 1.790 € netto, 10 Personen inklusive, jede weitere Person 90 € (bis 15 Personen). Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Können Sie die Beispiele an unser Team anpassen?",
        a: "Ja. Wir fragen vorab nach Aufgaben und Vorwissen und wählen die Beispiele passend dazu aus. Echte Kundendaten brauchen wir dafür nicht.",
      },
      {
        q: "Was, wenn wir mehr als 15 Personen sind?",
        a: "Sprechen Sie uns an. Wir klären, wie sich die Schulung auf mehrere Gruppen verteilen lässt, und nennen Ihnen den Preis vorab.",
      },
    ],
  },
  cta: {
    label: "Schulung anfragen",
    h: "Einen halben Tag KI-Grundlagen für Ihr Team?",
    p: "Schreiben Sie uns kurz zu Teamgröße, Sprache und Wunschzeitraum. Wir melden uns mit einem Vorschlag.",
    primary: { label: "Schulung anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Zum KI-Check", to: "check" },
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
    ],
  },
};

const en: PageDef = {
  key: "kompetenz",
  meta: {
    title: "AI literacy training: the basics for your team, online",
    description:
      "AI literacy basics: half day, live online, from €1,790 net per team (10 people included, up to 15). Basics, risks, data protection, with a participation record.",
  },
  crumbs: ["schulungen"],
  crumb: "AI literacy",
  hero: {
    eyebrow: "AI training · half day · live online",
    h1: ["AI literacy basics: ", "working safely", " with AI"],
    lede: "One half day in which your team learns what AI can do, where it goes wrong and which rules apply in daily work. Live online, for up to 15 people, with a participation record.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "See the agenda", to: "kompetenz", hash: "agenda" },
    facts: ["From €1,790 net per team", "Half day · 10 people included, up to 15", "English or German"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Sketch: nested rounded squares above a workflow in four stations: basics, limits, rules, record",
      caption: "From the basics, through the limits, to the rules.",
      fig: "0.1",
      labels: ["Basics", "Limits", "Rules", "Record"],
    },
  },
  blocks: [
    {
      t: "spec",
      id: "eckdaten",
      label: "Key facts",
      h: "What the course covers",
      rows: [
        ["Price", "From €1,790 net per team, 10 people included, each additional person €90 (up to 15), plus VAT, businesses only"],
        ["Scope", "Half day, 10 people included, up to 15 people"],
        ["Delivery", "Live online in English or German, via Microsoft Teams or Zoom; a closed session for your team, by agreement"],
        ["Led by", "We name the trainer to you before you book."],
        ["Proof", "Participation record from OpSolid"],
      ],
    },
    {
      t: "situations",
      id: "fuer-wen",
      label: "For whom",
      note: "For everyone who uses AI in the office.",
      h: "For teams that use AI or soon will",
      lede: "The course is for staff in every function, not for technical specialists. No prior knowledge is needed.",
      cta: { label: "To AI consulting", to: "beratung" },
      items: [
        { h: "The team uses AI, but without shared rules", p: "Everyone experiments on their own. What belongs in an AI tool and what does not has not been settled." },
        { h: "Management wants to document its measures", p: "You want to be able to show what your company has done for AI literacy, without launching a large project." },
        { h: "New tools arrive, the uncertainty stays", p: "Copilot, ChatGPT or Gemini are available. Nobody has shown how to use them safely." },
        { h: "Staff ask what is allowed", p: "There is no simple answer and no place where questions are welcome." },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Key point",
      text: "Anyone who uses AI should know its limits",
    },
    {
      t: "steps",
      id: "agenda",
      label: "Agenda",
      note: "Six topics in this order.",
      h: "What happens during the half day",
      lede: "From understanding to rules, with examples from your team.",
      items: [
        { h: "What AI is and is not", p: "How language models work, why they sound convincing and can still be wrong." },
        { h: "Asking well", p: "Describing tasks so the result is usable. Practised on examples from your daily work." },
        { h: "Spotting errors", p: "Invented details, outdated knowledge, one-sided answers. We practise checking results before they move on." },
        { h: "Data protection in daily work", p: "Which information belongs in an AI tool and which does not, and why. The basics of GDPR, explained in practice." },
        { h: "Rules for your team", p: "Together we draft simple dos and don’ts that your team can apply afterwards." },
        { h: "Human oversight", p: "Who checks what before an AI result goes into a document, an email or a decision." },
      ],
    },
    {
      t: "text",
      id: "art-4",
      label: "AI Act",
      note: "For context.",
      h: "How the course relates to Article 4",
      lede: "It can be one building block of your measures for AI literacy.",
      paras: [
        "Under Article 4 of the AI Act, companies that use AI take measures to support the AI literacy of their staff. This has applied since 2 February 2025. The provision was reworded by Regulation (EU) 2026/1744, which has been in force since 27 July 2026.",
        "No certificate is required. Documented measures are good practice.",
        "AI literacy basics covers the fundamentals for all staff. It is one measure among several, not complete proof. We do not give legal advice.",
      ],
    },
    {
      t: "sample",
      id: "nachweis",
      label: "Proof",
      h: "The participation record",
      lede: "Every participant receives a record for their files.",
      mark: "Sample",
      title: "Participation record",
      meta: "Placeholders in square brackets",
      rows: [
        ["Course", "AI literacy basics"],
        ["Date", "[date]"],
        ["Duration", "Half day"],
        ["Topics", "Fundamentals, data protection, rules"],
        ["Trainer", "[name]"],
        ["Participant", "[name]"],
      ],
      foot: "The record confirms attendance. It is not a certificate from an authority, a chamber or an association.",
    },
  ],
  faq: {
    label: "Common questions",
    h: "Common questions about AI literacy basics",
    items: [
      {
        q: "Is this a certification course?",
        a: "No. A certificate is not required. You receive a participation record from OpSolid, which can complement your documented measures for AI literacy.",
      },
      {
        q: "Is the price per person?",
        a: "No, per team: from €1,790 net, 10 people included, each additional person €90 (up to 15). All prices net of VAT, businesses only.",
      },
      {
        q: "Can you adapt the examples to our team?",
        a: "Yes. We ask for tasks and prior knowledge beforehand and choose examples to match. We do not need real customer data for this.",
      },
      {
        q: "What if we are more than 15 people?",
        a: "Get in touch. We will work out how to split the course across several groups and name the price up front.",
      },
    ],
  },
  cta: {
    label: "Request training",
    h: "Half a day of AI basics for your team?",
    p: "Tell us briefly about team size, language and preferred period. We come back with a proposal.",
    primary: { label: "Request training", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "To the AI check", to: "check" },
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
    ],
  },
};

const tr: PageDef = {
  key: "kompetenz",
  meta: {
    title: "YZ Yetkinliği eğitimi: ekibiniz için temel, çevrimiçi",
    description:
      "YZ Yetkinliği Temel: yarım gün, çevrimiçi, ekip başına 1.790 €'dan itibaren (net), 10 kişi dahil (en fazla 15). Temeller, riskler, veri koruma; belgeli.",
  },
  crumbs: ["schulungen"],
  crumb: "YZ Yetkinliği",
  hero: {
    eyebrow: "YZ eğitimi · yarım gün · canlı çevrimiçi",
    h1: ["YZ Yetkinliği Temel: ", "YZ ile güvenle", " çalışmak"],
    lede: "Ekibinizin YZ'nin neler yapabildiğini, nerede yanıldığını ve günlük işte hangi kuralların geçerli olduğunu öğrendiği yarım gün. Canlı çevrimiçi, en fazla 15 kişi için, katılım belgesiyle.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Programa bakın", to: "kompetenz", hash: "agenda" },
    facts: ["Ekip başına 1.790 €'dan itibaren (net)", "Yarım gün · 10 kişi dahil, en fazla 15", "Almanca veya İngilizce"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Çizim: iç içe yuvarlatılmış kareler ve dört istasyonlu bir akış: temeller, sınırlar, kurallar, belge",
      caption: "Temellerden sınırlara, oradan kurallara.",
      fig: "0.1",
      labels: ["Temeller", "Sınırlar", "Kurallar", "Belge"],
    },
  },
  blocks: [
    {
      t: "spec",
      id: "eckdaten",
      label: "Temel bilgiler",
      h: "Eğitim neleri kapsar?",
      rows: [
        ["Fiyat", "Ekip başına 1.790 €'dan itibaren (net), 10 kişi dahil, her ek kişi 90 € (en fazla 15 kişi), KDV hariç; yalnızca işletmeler için"],
        ["Kapsam", "Yarım gün, 10 kişi dahil, en fazla 15 kişi"],
        ["Uygulama", "Almanca veya İngilizce canlı çevrimiçi; anlaşmaya göre Microsoft Teams veya Zoom; ekibinize özel kapalı oturum"],
        ["Yürüten", "Eğitmeni rezervasyondan önce size adıyla bildiririz."],
        ["Belge", "OpSolid katılım belgesi"],
      ],
    },
    {
      t: "situations",
      id: "fuer-wen",
      label: "Kimin için",
      note: "Ofiste YZ kullanan herkes için.",
      h: "YZ kullanan ya da yakında kullanacak ekipler için",
      lede: "Eğitim her bölümden çalışanlara yöneliktir, teknik uzmanlara değil. Ön bilgi gerekmez.",
      cta: { label: "YZ danışmanlığına gidin", to: "beratung" },
      items: [
        { h: "Ekip YZ kullanıyor, ama ortak kural yok", p: "Herkes kendi başına deniyor. Bir YZ aracına neyin girip neyin girmeyeceği belirsiz." },
        { h: "Yönetim aldığı önlemleri belgelemek istiyor", p: "Büyük bir proje başlatmadan, şirketin YZ yetkinliği için neler yaptığını gösterebilmek istiyorsunuz." },
        { h: "Yeni araçlar geliyor, belirsizlik kalıyor", p: "Copilot, ChatGPT ya da Gemini kullanıma açık. Ama bunları güvenle nasıl kullanacağını kimse göstermedi." },
        { h: "Çalışanlar neye izin verildiğini soruyor", p: "Basit bir cevap yok ve soruların hoş karşılandığı bir yer de yok." },
      ],
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Ana fikir",
      text: "Yapay zekayı kullanan, sınırlarını bilmeli",
    },
    {
      t: "steps",
      id: "agenda",
      label: "Program",
      note: "Bu sırayla altı konu.",
      h: "Yarım günde neler olur?",
      lede: "Anlamaktan kurallara kadar, ekibinizden örneklerle.",
      items: [
        { h: "YZ nedir, ne değildir", p: "Dil modelleri nasıl çalışır, neden ikna edici görünür ve yine de yanılabilir." },
        { h: "İyi istek yazmak", p: "Görevi, sonucun işe yarayacağı şekilde tarif etmek. Günlük işinizden örneklerle uygulanır." },
        { h: "Hataları fark etmek", p: "Uydurulmuş bilgiler, eskimiş bilgi, tek yönlü cevaplar. Sonuçları, ilerlemeden önce kontrol etmeyi çalışırız." },
        { h: "Günlük işte veri koruma", p: "Hangi bilgi bir YZ aracına girer, hangisi girmez ve neden. AB Genel Veri Koruma Tüzüğü'nün (GDPR) temelleri, pratik anlatımla." },
        { h: "Ekibiniz için kurallar", p: "Ekibinizin sonradan uygulayabileceği basit yapılacaklar ve yapılmayacaklar listesini birlikte hazırlarız." },
        { h: "İnsan denetimi", p: "Bir YZ sonucu bir belgeye, e-postaya ya da karara girmeden önce kim neyi kontrol eder." },
      ],
    },
    {
      t: "text",
      id: "art-4",
      label: "AB YZ Tüzüğü",
      note: "Genel bilgi.",
      h: "Eğitim, 4. madde ile nasıl ilişkilidir?",
      lede: "YZ yetkinliği önlemlerinizin bir parçası olabilir.",
      paras: [
        "YZ kullanan şirketler, Yapay Zekâ Tüzüğü'nün 4. maddesi uyarınca çalışanlarının YZ yetkinliğini desteklemek için önlemler alır. Bu, 2 Şubat 2025'ten beri geçerlidir. Hüküm, 27 Temmuz 2026'dan beri yürürlükte olan (AB) 2026/1744 sayılı Tüzük ile yeniden düzenlenmiştir.",
        "Sertifika zorunlu değildir. Belgelenmiş önlemler iyi uygulamadır.",
        "YZ Yetkinliği Temel, tüm çalışanlar için temelleri kapsar. Birçok önlemden biridir, eksiksiz bir kanıt değildir. Hukuki danışmanlık vermiyoruz.",
      ],
    },
    {
      t: "sample",
      id: "nachweis",
      label: "Belge",
      h: "Katılım belgesi",
      lede: "Her katılımcı kayıtları için bir belge alır.",
      mark: "Örnek",
      title: "Katılım belgesi",
      meta: "Yer tutucular köşeli parantez içinde",
      rows: [
        ["Eğitim", "YZ Yetkinliği Temel"],
        ["Tarih", "[tarih]"],
        ["Süre", "Yarım gün"],
        ["Konular", "Temeller, veri koruma, kurallar"],
        ["Eğitmen", "[ad]"],
        ["Katılımcı", "[ad]"],
      ],
      foot: "Belge katılımı doğrular. Bir kurum, oda veya dernek sertifikası değildir.",
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "YZ Yetkinliği Temel hakkında sık sorulan sorular",
    items: [
      {
        q: "Bu bir sertifika kursu mu?",
        a: "Hayır. Sertifika zorunlu değildir. OpSolid'ten bir katılım belgesi alırsınız; bu belge, YZ yetkinliği için belgelenmiş önlemlerinizi tamamlayabilir.",
      },
      {
        q: "Fiyat kişi başına mı?",
        a: "Hayır, ekip başına: 1.790 €'dan itibaren (net), 10 kişi dahil, her ek kişi 90 € (en fazla 15 kişi). Tüm fiyatlar net, KDV hariç; yalnızca işletmeler için.",
      },
      {
        q: "Örnekleri ekibimize uyarlayabilir misiniz?",
        a: "Evet. Önceden görevleri ve ön bilgiyi sorar, örnekleri buna göre seçeriz. Bunun için gerçek müşteri verisine ihtiyacımız yok.",
      },
      {
        q: "15 kişiden fazlaysak ne olur?",
        a: "Bize yazın. Eğitimi birden fazla gruba nasıl bölebileceğimizi netleştirir ve fiyatı önceden bildiririz.",
      },
    ],
  },
  cta: {
    label: "Eğitim talep edin",
    h: "Ekibiniz için yarım günlük YZ temelleri?",
    p: "Ekip büyüklüğü, dil ve tercih ettiğiniz dönem hakkında kısaca yazın. Bir teklifle döneriz.",
    primary: { label: "Eğitim talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "YZ Kontrolü'ne gidin", to: "check" },
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
    ],
  },
};

export const page: PageSet = { de, en, tr };
