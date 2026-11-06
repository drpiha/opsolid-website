/**
 * "Trainer werden": recruiting page for freelance AI trainers. German is the source; EN and TR are
 * transcreations in full key parity. Binding (trainer-roster.md section 5.4 and 4.2): no named trainers,
 * no "our trainers", no day-rate numbers, no employee-like control (freedom of method, own clients,
 * right to decline). No "network in progress" wording; a longer-term partnership is mentioned once.
 * Selection (owner decision 2026-11-06): no separate trial session, paid or unpaid. Reply within seven days,
 * trainer pool, then a 30-minute conversation with a short live demo once a matching client request is in
 * sight; the first assignment is paid like any other.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "trainer",
  meta: {
    title: "Trainer werden: freiberufliche KI-Trainer gesucht",
    description:
      "OpSolid sucht freiberufliche KI-Trainerinnen und -Trainer für Online-Schulungen auf Deutsch und Englisch. Auswahl im Gespräch, Rahmenvertrag, freie Methodik.",
  },
  crumbs: ["schulungen"],
  crumb: "Trainer werden",
  hero: {
    eyebrow: "Trainer werden · freiberuflich · online",
    h1: ["Freiberufliche ", "KI-Trainerinnen und -Trainer", " gesucht"],
    lede: "Wir suchen freiberufliche KI-Trainerinnen und -Trainer für Schulungen auf Deutsch und Englisch, online und live. Wenn Sie KI praxisnah vermitteln, melden Sie sich.",
    primary: { label: "Kurzprofil senden", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "So läuft es ab", to: "trainer", hash: "ablauf" },
    facts: ["Freiberuflich", "Online · Deutsch und Englisch", "Auswahl im Gespräch mit kurzer Live-Demo"],
  },
  blocks: [
    {
      t: "rows",
      id: "themen",
      label: "Themen",
      note: "Vier Themenfelder.",
      h: "Wofür wir Fachleute suchen",
      cta: { label: "Alle KI-Schulungen", to: "schulungen" },
      items: [
        {
          tag: "Copilot",
          h: "Microsoft 365 Copilot",
          p: "Copilot in Outlook, Teams, Word, Excel und PowerPoint, dazu Berechtigungen und Datenhygiene im Büroalltag.",
          href: { label: "Zum Copilot-Praxistag", to: "copilot" },
        },
        {
          tag: "Alltag",
          h: "KI im Arbeitsalltag",
          p: "ChatGPT, Claude und Gemini im Büro: Anfragen formulieren, Ergebnisse prüfen, eigene Abläufe entwickeln.",
        },
        {
          tag: "Automatisierung",
          h: "Abläufe automatisieren",
          p: "Workflows mit n8n, Make oder Power Automate, mit Freigaben und Fehlerbehandlung.",
          href: { label: "Zur KI-Beratung", to: "beratung" },
        },
        {
          tag: "Grundlagen",
          h: "KI-Kompetenz, Datenschutz und Regeln",
          p: "Grundlagen für alle Beschäftigten, Datenschutz im Umgang mit KI, Regeln für Teams. Praktische Orientierung, keine Rechtsberatung.",
          href: { label: "Zur KI-Kompetenz-Schulung", to: "kompetenz" },
        },
      ],
    },
    {
      t: "spec",
      id: "profil",
      label: "Profil",
      h: "Was wir von Ihnen erwarten",
      rows: [
        ["Fachwissen", "Eigene Praxis im gewählten Thema, die Sie live zeigen können"],
        ["Vermittlung", "Erfahrung in Training oder Erwachsenenbildung; im Gespräch zeigen Sie eine kurze Live-Demo"],
        ["Sprache", "Deutsch oder Englisch auf hohem Niveau (etwa C1)"],
        ["Datenschutz", "Sie kennen die Grundsätze der DSGVO und gehen mit Kundendaten in KI-Werkzeugen sorgfältig um"],
        ["Selbstständigkeit", "Sie arbeiten freiberuflich oder als Gewerbetreibende, mit eigenem Auftritt"],
        ["Versicherung", "Berufshaftpflicht ist üblich; den Nachweis erbitten wir vor dem ersten Einsatz"],
      ],
    },
    {
      t: "principles",
      id: "zusammenarbeit",
      label: "Zusammenarbeit",
      note: "Freiberuflich heißt: Sie bestimmen, wie Sie arbeiten.",
      h: "Was wir Ihnen bieten",
      items: [
        { h: "Vergütung ab dem ersten Einsatz", p: "Eine gesonderte Probesession gibt es nicht. Ihren ersten Einsatz vergüten wir wie jeden weiteren." },
        { h: "Rahmenvertrag", p: "Die Zusammenarbeit läuft über einen Rahmenvertrag mit Ihnen als selbstständiger Trainerin oder selbstständigem Trainer." },
        { h: "Honorar nach Vereinbarung", p: "Das Honorar vereinbaren wir persönlich und vorab schriftlich." },
        { h: "Freiheit bei der Methode", p: "Wir stimmen Thema und Lernziele mit Ihnen ab. Wie Sie sie erreichen, entscheiden Sie." },
        { h: "Planbare Termine", p: "Wir stimmen Termine mit Ihnen ab. Sie entscheiden, welche Anfragen Sie annehmen." },
        { h: "Eigener Auftritt", p: "Sie treten unter Ihrem eigenen Namen auf und können weitere Auftraggeber haben." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Ablauf",
      note: "Fünf Schritte.",
      h: "Von Ihrem Profil zum ersten Termin",
      lede: "Nach jedem Schritt entscheiden wir beide, ob es weitergeht.",
      items: [
        { h: "Kurzprofil", p: "Sie schicken uns ein kurzes Profil: Themen, Erfahrung, Sprachen und Ihre Selbstständigkeit. Eine Bewerbungsmappe brauchen wir nicht." },
        {
          h: "Rückmeldung und Trainerpool",
          p: "Wir antworten innerhalb von sieben Tagen. Passt Ihr Profil zu unseren Themen, nehmen wir Sie in unseren Trainerpool auf. Eine Zusage für Einsätze ist damit nicht verbunden.",
        },
        {
          h: "Gespräch mit Live-Demo",
          p: "Sobald eine passende Kundenanfrage in Sicht ist, sprechen wir 30 Minuten online über Ihre Praxis und Ihre Art zu vermitteln. Sie zeigen uns in einer kurzen Live-Demo, wie Sie arbeiten.",
        },
        {
          h: "Rahmenvertrag",
          p: "Passt es für beide Seiten, schließen wir den Rahmenvertrag. Jede Schulung vereinbaren wir danach einzeln, und Sie entscheiden, ob Sie sie übernehmen.",
        },
        {
          h: "Erste Schulung",
          p: "Sie übernehmen die Schulung. Den ersten Einsatz vergüten wir wie jeden weiteren. Danach ist eine längerfristige Partnerschaft möglich.",
        },
      ],
    },
    {
      t: "text",
      id: "datenschutz",
      label: "Datenschutz",
      note: "Zu Ihrer Bewerbung.",
      h: "Was mit Ihren Bewerbungsdaten geschieht",
      lede: "Wir nutzen Ihre Angaben nur, um über eine Zusammenarbeit zu entscheiden.",
      cta: { label: "Datenschutzerklärung", to: "privacy", hash: "bewerbungen" },
      paras: [
        "Ihr Kurzprofil und Ihre Kontaktdaten verwenden wir nur für die Auswahl von Trainerinnen und Trainern und für passende Anfragen. Ihre Bewerbung geben wir nicht an Kunden weiter; Ihren Namen nennen wir einem Kunden nur mit Ihrem Einverständnis.",
        "Auskunft über Ihre Daten und deren Löschung können Sie jederzeit verlangen. Alle Angaben dazu stehen in der Datenschutzerklärung.",
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen von Trainerinnen und Trainern",
    items: [
      {
        q: "Bin ich bei OpSolid angestellt?",
        a: "Nein. Sie arbeiten als selbstständige Trainerin oder selbstständiger Trainer auf Basis eines Rahmenvertrags. Sie entscheiden, welche Anfragen Sie annehmen, und können für andere Auftraggeber arbeiten.",
      },
      {
        q: "Muss ich mit Ihren Folien arbeiten?",
        a: "Nein. Sie entscheiden über Methode und Material. Wir stimmen mit Ihnen Thema, Umfang und Lernziele ab.",
      },
      {
        q: "Wie viele Einsätze sind zu erwarten?",
        a: "Das hängt von den Kundenanfragen ab. Eine feste Zahl von Einsätzen sagen wir nicht zu.",
      },
      {
        q: "Werde ich auf der Website genannt?",
        a: "Nur mit Ihrer schriftlichen Einwilligung. Dem Kunden nennen wir Ihren Namen vor der Buchung der Schulung, wenn Sie einverstanden sind.",
      },
    ],
  },
  cta: {
    label: "Trainer werden",
    h: "Sie vermitteln KI praxisnah? Schreiben Sie uns",
    p: "Wir antworten innerhalb von sieben Tagen. Passt Ihr Profil zu unseren Themen, nehmen wir Sie in unseren Trainerpool auf.",
    primary: { label: "Kurzprofil senden", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "KI-Check für Unternehmen", to: "check" },
  },
};

const en: PageDef = {
  key: "trainer",
  meta: {
    title: "Become a trainer: freelance AI trainers wanted",
    description:
      "OpSolid is looking for freelance AI trainers for online courses in English and German. Selection by conversation, framework contract, freedom in method.",
  },
  crumbs: ["schulungen"],
  crumb: "Become a trainer",
  hero: {
    eyebrow: "Become a trainer · freelance · online",
    h1: ["Freelance ", "AI trainers", " wanted"],
    lede: "We are looking for freelance AI trainers for courses in English and German, online and live. If you teach AI in a practical way, get in touch.",
    primary: { label: "Send a short profile", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "How it works", to: "trainer", hash: "ablauf" },
    facts: ["Freelance", "Online · English and German", "Selection in a conversation with a short live demo"],
  },
  blocks: [
    {
      t: "rows",
      id: "themen",
      label: "Topics",
      note: "Four topic areas.",
      h: "What we are looking for specialists in",
      cta: { label: "All AI training", to: "schulungen" },
      items: [
        {
          tag: "Copilot",
          h: "Microsoft 365 Copilot",
          p: "Copilot in Outlook, Teams, Word, Excel and PowerPoint, plus permissions and data hygiene in daily office work.",
          href: { label: "To the Copilot workshop", to: "copilot" },
        },
        {
          tag: "Daily work",
          h: "AI in daily work",
          p: "ChatGPT, Claude and Gemini in the office: asking well, checking results, developing your own workflows.",
        },
        {
          tag: "Automation",
          h: "Automating workflows",
          p: "Workflows with n8n, Make or Power Automate, with approvals and error handling.",
          href: { label: "To AI consulting", to: "beratung" },
        },
        {
          tag: "Basics",
          h: "AI literacy, data protection and rules",
          p: "Fundamentals for all staff, data protection when working with AI, rules for teams. Practical orientation, not legal advice.",
          href: { label: "To the AI literacy course", to: "kompetenz" },
        },
      ],
    },
    {
      t: "spec",
      id: "profil",
      label: "Profile",
      h: "What we expect from you",
      rows: [
        ["Expertise", "Your own practice in the chosen topic, which you can show live"],
        ["Teaching", "Experience in training or adult education; you show a short live demo in our conversation"],
        ["Language", "English or German at a high level (around C1)"],
        ["Data protection", "You know the principles of GDPR and handle client data in AI tools with care"],
        ["Self-employment", "You work as a freelancer or sole trader, with your own profile"],
        ["Insurance", "Professional liability cover is usual; we ask for proof before your first assignment"],
      ],
    },
    {
      t: "principles",
      id: "zusammenarbeit",
      label: "Working together",
      note: "Freelance means you decide how you work.",
      h: "What we offer you",
      items: [
        { h: "Paid from the first assignment", p: "There is no separate trial session. Your first assignment is paid like any other." },
        { h: "Framework contract", p: "We work together under a framework contract with you as an independent trainer." },
        { h: "Fee by agreement", p: "We agree the fee with you personally and in writing beforehand." },
        { h: "Freedom in method", p: "We agree topic and learning goals with you. How you reach them is up to you." },
        { h: "Plannable dates", p: "We coordinate dates with you. You decide which requests you accept." },
        { h: "Your own profile", p: "You appear under your own name and may have other clients." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Process",
      note: "Five steps.",
      h: "From your profile to the first date",
      lede: "After each step we both decide whether to continue.",
      items: [
        { h: "Short profile", p: "You send us a short profile: topics, experience, languages and your self-employment. We do not need a full application pack." },
        {
          h: "Reply and trainer pool",
          p: "We reply within seven days. If your profile fits our topics, we add you to our trainer pool. This does not promise any assignments.",
        },
        {
          h: "Conversation with a live demo",
          p: "As soon as a matching client request is in sight, we talk online for 30 minutes about your practice and how you teach. You show us in a short live demo how you work.",
        },
        {
          h: "Framework contract",
          p: "If it fits for both sides, we sign the framework contract. After that we agree each course individually, and you decide whether to take it on.",
        },
        {
          h: "First course",
          p: "You take on the course. Your first assignment is paid like any other. A longer-term partnership can follow.",
        },
      ],
    },
    {
      t: "text",
      id: "datenschutz",
      label: "Data protection",
      note: "About your application.",
      h: "What happens to your application data",
      lede: "We use your details only to decide on a collaboration.",
      cta: { label: "Privacy policy", to: "privacy", hash: "bewerbungen" },
      paras: [
        "We use your short profile and contact details only to select trainers and for matching requests. We do not pass your application on to clients; we give a client your name only with your consent.",
        "You can ask at any time for information about your data and for its deletion. Details are in the privacy policy.",
      ],
    },
  ],
  faq: {
    label: "Common questions",
    h: "Common questions from trainers",
    items: [
      {
        q: "Would I be employed by OpSolid?",
        a: "No. You work as an independent trainer under a framework contract. You decide which requests you accept and may work for other clients.",
      },
      {
        q: "Do I have to use your slides?",
        a: "No. You decide on method and material. We agree topic, scope and learning goals with you.",
      },
      {
        q: "How many assignments can I expect?",
        a: "That depends on client requests. We do not promise a fixed number of assignments.",
      },
      {
        q: "Will I be named on the website?",
        a: "Only with your written consent. We name you to the client before they book a course, if you agree.",
      },
    ],
  },
  cta: {
    label: "Become a trainer",
    h: "Do you teach AI in a practical way? Write to us",
    p: "We reply within seven days. If your profile fits our topics, we add you to our trainer pool.",
    primary: { label: "Send a short profile", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "AI check for companies", to: "check" },
  },
};

const tr: PageDef = {
  key: "trainer",
  meta: {
    title: "Eğitmen olun: serbest YZ eğitmenleri aranıyor",
    description:
      "OpSolid, Almanca ve İngilizce çevrimiçi eğitimler için serbest çalışan YZ eğitmenleri arıyor. Görüşmeyle seçim, çerçeve sözleşme, yöntemde özgürlük.",
  },
  crumbs: ["schulungen"],
  crumb: "Eğitmen olun",
  hero: {
    eyebrow: "Eğitmen olun · serbest çalışan · çevrimiçi",
    h1: ["Serbest çalışan ", "YZ eğitmenleri", " aranıyor"],
    lede: "Almanca ve İngilizce, çevrimiçi ve canlı eğitimler için serbest çalışan YZ eğitmenleri arıyoruz. YZ'yi uygulamalı anlatıyorsanız bize yazın.",
    primary: { label: "Kısa profil gönderin", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "Süreç nasıl işler", to: "trainer", hash: "ablauf" },
    facts: ["Serbest çalışan", "Çevrimiçi · Almanca ve İngilizce", "Kısa canlı gösterimli bir görüşmeyle seçim"],
  },
  blocks: [
    {
      t: "rows",
      id: "themen",
      label: "Konular",
      note: "Dört konu alanı.",
      h: "Hangi alanlarda uzman arıyoruz?",
      cta: { label: "Tüm YZ eğitimleri", to: "schulungen" },
      items: [
        {
          tag: "Copilot",
          h: "Microsoft 365 Copilot",
          p: "Outlook, Teams, Word, Excel ve PowerPoint'te Copilot; ayrıca ofis gündelik işinde yetkiler ve veri düzeni.",
          href: { label: "Copilot Uygulama Günü'ne gidin", to: "copilot" },
        },
        {
          tag: "Günlük iş",
          h: "Günlük işte YZ",
          p: "Ofiste ChatGPT, Claude ve Gemini: iyi istek yazmak, sonuçları kontrol etmek, kendi iş akışlarını geliştirmek.",
        },
        {
          tag: "Otomasyon",
          h: "İş akışlarını otomatikleştirmek",
          p: "n8n, Make veya Power Automate ile onay adımları ve hata yönetimi olan iş akışları.",
          href: { label: "YZ danışmanlığına gidin", to: "beratung" },
        },
        {
          tag: "Temeller",
          h: "YZ yetkinliği, veri koruma ve kurallar",
          p: "Tüm çalışanlar için temeller, YZ ile çalışırken veri koruma, ekipler için kurallar. Pratik yönlendirme; hukuki danışmanlık değildir.",
          href: { label: "YZ Yetkinliği eğitimine gidin", to: "kompetenz" },
        },
      ],
    },
    {
      t: "spec",
      id: "profil",
      label: "Profil",
      h: "Sizden beklediklerimiz",
      rows: [
        ["Uzmanlık", "Seçtiğiniz konuda, canlı gösterebileceğiniz kendi uygulama deneyiminiz"],
        ["Aktarım", "Eğitim veya yetişkin eğitimi deneyimi; görüşmede kısa bir canlı gösterim yaparsınız"],
        ["Dil", "Almanca veya İngilizce, yüksek düzeyde (yaklaşık C1)"],
        ["Veri koruma", "GDPR/DSGVO ilkelerini bilirsiniz ve YZ araçlarında müşteri verileriyle özenle çalışırsınız"],
        ["Serbest çalışma", "Serbest meslek sahibi ya da işletme sahibi olarak, kendi duruşunuzla çalışırsınız"],
        ["Sigorta", "Mesleki sorumluluk sigortası yaygındır; belgesini ilk görevden önce isteriz"],
      ],
    },
    {
      t: "principles",
      id: "zusammenarbeit",
      label: "İşbirliği",
      note: "Serbest çalışmak, nasıl çalışacağınıza sizin karar vermeniz demektir.",
      h: "Size ne sunuyoruz?",
      items: [
        { h: "İlk görevden itibaren ücret", p: "Ayrı bir deneme oturumu yoktur. İlk görevinizin ücretini diğer görevler gibi öderiz." },
        { h: "Çerçeve sözleşme", p: "İşbirliği, sizinle bağımsız eğitmen olarak yapılan bir çerçeve sözleşme üzerinden yürür." },
        { h: "Anlaşmaya göre ücret", p: "Ücreti sizinle kişisel olarak ve önceden yazılı biçimde belirleriz." },
        { h: "Yöntemde özgürlük", p: "Konuyu ve öğrenme hedeflerini sizinle birlikte belirleriz. Bunlara nasıl ulaşacağınıza siz karar verirsiniz." },
        { h: "Planlanabilir tarihler", p: "Tarihleri sizinle birlikte belirleriz. Hangi talepleri kabul edeceğinize siz karar verirsiniz." },
        { h: "Kendi tanıtımınız", p: "Kendi adınızla görünürsünüz ve başka müşterilerle de çalışabilirsiniz." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Süreç",
      note: "Beş adım.",
      h: "Profilinizden ilk tarihe",
      lede: "Her adımdan sonra birlikte devam edip etmeyeceğimize karar veririz.",
      items: [
        { h: "Kısa profil", p: "Bize kısa bir profil gönderirsiniz: konular, deneyim, diller ve serbest çalışma durumunuz. Tam bir başvuru dosyasına gerek yok." },
        {
          h: "Yanıt ve eğitmen havuzu",
          p: "Yedi gün içinde yanıt veririz. Profiliniz konularımıza uyuyorsa sizi eğitmen havuzumuza alırız. Bu, görev verileceği anlamına gelmez.",
        },
        {
          h: "Canlı gösterimli görüşme",
          p: "Konunuza uygun bir müşteri talebi göründüğünde sizinle 30 dakika çevrimiçi görüşür, uygulamanızı ve anlatım tarzınızı konuşuruz. Nasıl çalıştığınızı kısa bir canlı gösterimle anlatırsınız.",
        },
        {
          h: "Çerçeve sözleşme",
          p: "İki taraf için de uygunsa çerçeve sözleşmeyi imzalarız. Ardından her eğitimi ayrı ayrı kararlaştırırız; üstlenip üstlenmeyeceğinize siz karar verirsiniz.",
        },
        {
          h: "İlk eğitim",
          p: "Eğitimi siz üstlenirsiniz. İlk görevinizin ücretini diğer görevler gibi öderiz. Ardından uzun vadeli bir ortaklık mümkündür.",
        },
      ],
    },
    {
      t: "text",
      id: "datenschutz",
      label: "Veri koruma",
      note: "Başvurunuz hakkında.",
      h: "Başvuru verilerinize ne olur?",
      lede: "Bilgilerinizi yalnızca bir işbirliğine karar vermek için kullanırız.",
      cta: { label: "Gizlilik politikası", to: "privacy", hash: "bewerbungen" },
      paras: [
        "Kısa profilinizi ve iletişim bilgilerinizi yalnızca eğitmen seçimi ve uygun talepler için kullanırız. Başvurunuzu müşterilere iletmeyiz; adınızı bir müşteriye yalnızca onayınızla bildiririz.",
        "Verileriniz hakkında bilgi almayı ve silinmesini istediğiniz zaman talep edebilirsiniz. Ayrıntılar gizlilik politikasında yer alır.",
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Eğitmenlerden sık gelen sorular",
    items: [
      {
        q: "OpSolid'in çalışanı mı olurum?",
        a: "Hayır. Bir çerçeve sözleşme temelinde bağımsız eğitmen olarak çalışırsınız. Hangi talepleri kabul edeceğinize siz karar verirsiniz ve başka müşteriler için de çalışabilirsiniz.",
      },
      {
        q: "Sizin slaytlarınızla mı çalışmam gerekiyor?",
        a: "Hayır. Yöntem ve materyale siz karar verirsiniz. Konuyu, kapsamı ve öğrenme hedeflerini sizinle birlikte belirleriz.",
      },
      {
        q: "Kaç görev bekleyebilirim?",
        a: "Bu, müşteri taleplerine bağlıdır. Belirli sayıda görev vaat etmiyoruz.",
      },
      {
        q: "Web sitesinde adım geçer mi?",
        a: "Yalnızca yazılı onayınızla. Onay verirseniz, eğitim rezervasyonundan önce müşteriye adınızı bildiririz.",
      },
    ],
  },
  cta: {
    label: "Eğitmen olun",
    h: "YZ'yi uygulamalı mı anlatıyorsunuz? Bize yazın",
    p: "Yedi gün içinde yanıt veriyoruz. Profiliniz konularımıza uyuyorsa sizi eğitmen havuzumuza alırız.",
    primary: { label: "Kısa profil gönderin", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "İşletmeler için YZ Kontrolü", to: "check" },
  },
};

export const page: PageSet = { de, en, tr };
