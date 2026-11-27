/**
 * "Trainer werden": recruiting page for freelance AI trainers. German is the source; EN and TR are
 * transcreations in full key parity. Binding (trainer-roster.md section 5.4 and 4.2): no named trainers,
 * no "our trainers", no day-rate numbers, no employee-like control (freedom of method, own clients,
 * right to decline). No "network in progress" wording; a longer-term partnership is mentioned once.
 * Selection (owner decision 2026-11-06): no separate trial session, paid or unpaid. Reply within seven days,
 * trainer pool, then a 30-minute conversation with a short live demo once a matching client request is in
 * sight; the first assignment is paid like any other.
 * Waitlist since 2026-11-17 (owner plan, "Evet, uygula"): the pool is full; no reply promise any more, a personal
 * reply only when a client request matches the profile.
 * Closed since owner decision 107 B (2026-11-26, "Ocak'a kadar kapat"): no new applications and no link to the form
 * (the contact topic "trainer" is gone); profiles we already have stay on the waiting list. No reopening date and no
 * promise to reopen anywhere on the page (owner, 2026-11-27: "Ocakta yazmasın belki hiç açmayız").
 */
import type { PageDef, PageSet } from "../types";
import { blockOf, frag, liste } from "../hero-objects";

const de: PageDef = {
  key: "trainer",
  meta: {
    title: "Trainerpool für freiberufliche KI-Trainer: pausiert",
    description:
      "Der Trainerpool von OpSolid nimmt derzeit keine neuen Bewerbungen an. Hier steht, wen wir für Schulungen suchen und wie bei uns die Auswahl abläuft.",
  },
  crumbs: [],
  crumb: "Trainerpool",
  hero: {
    eyebrow: "Trainerpool · Bewerbungen derzeit geschlossen",
    // "\u00A0-\u2060": "-Trainer" stays with "und" and its hyphen never ends a line (design review R2).
    h1: ["Trainerpool für ", "KI-Trainerinnen und\u00A0-\u2060Trainer", ": pausiert"],
    lede: "Wir nehmen derzeit keine neuen Bewerbungen an. Wen wir suchen und wie die Auswahl abläuft, können Sie hier weiterhin nachlesen.",
    primary: { label: "So läuft es ab", to: "trainer", hash: "ablauf" },
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
          h: "Generative KI im Büro",
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
        ["Didaktik", "Erfahrung in Training oder Erwachsenenbildung; im Gespräch zeigen Sie eine kurze Live-Demo"],
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
        { h: "Kurzprofil", p: "Ein kurzes Profil genügt: Themen, Erfahrung, Sprachen und Ihre Selbstständigkeit. Eine Bewerbungsmappe brauchen wir nicht." },
        {
          h: "Warteliste und Trainerpool",
          p: "Derzeit nehmen wir keine neuen Profile an. Profile, die schon bei uns sind, bleiben auf der Warteliste. Eine persönliche Antwort erhalten Sie, wenn eine Kundenanfrage zu Ihrem Profil passt. Eine Zusage für Einsätze ist damit nicht verbunden.",
        },
        {
          h: "Gespräch mit Live-Demo",
          p: "Sobald eine passende Kundenanfrage in Sicht ist, sprechen wir 30 Minuten online über Ihre Praxis und Ihre Art zu schulen. Sie zeigen uns in einer kurzen Live-Demo, wie Sie arbeiten.",
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
    label: "Trainerpool",
    h: "Bewerbungen derzeit geschlossen",
    p: "Neue Kurzprofile nehmen wir derzeit nicht an. Profile, die schon bei uns sind, bleiben auf der Warteliste; wir melden uns, wenn eine Kundenanfrage passt.",
    primary: { label: "Alle KI-Schulungen", to: "schulungen" },
    secondary: { label: "Über OpSolid", to: "ueber" },
  },
};

const en: PageDef = {
  key: "trainer",
  meta: {
    title: "Trainer pool for freelance AI trainers: paused",
    description:
      "OpSolid's trainer pool is not accepting new applications at the moment. Here you can still see who we look for and how our selection process works.",
  },
  crumbs: [],
  crumb: "Trainer pool",
  hero: {
    eyebrow: "Trainer pool · applications currently closed",
    h1: ["Trainer pool for ", "AI trainers", ": paused"],
    lede: "We are not accepting new applications at the moment. You can still read who we look for and how selection works.",
    primary: { label: "How it works", to: "trainer", hash: "ablauf" },
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
          h: "Generative AI in the office",
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
        { h: "Short profile", p: "A short profile is enough: topics, experience, languages and your self-employment. We do not need a full application pack." },
        {
          h: "Waiting list and trainer pool",
          p: "We are not taking new profiles at the moment. Profiles we already have stay on the waiting list. You receive a personal reply when a client request matches your profile. This does not promise any assignments.",
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
    label: "Trainer pool",
    h: "Applications currently closed",
    p: "We are not taking new short profiles at the moment. Profiles we already have stay on the waiting list; we get in touch when a client request matches.",
    primary: { label: "All AI training", to: "schulungen" },
    secondary: { label: "About OpSolid", to: "ueber" },
  },
};

const tr: PageDef = {
  key: "trainer",
  meta: {
    title: "Serbest YZ eğitmenleri için havuz: başvurulara ara verdik",
    description:
      "OpSolid eğitmen havuzu şu anda yeni başvuru almıyor. Kimi aradığımızı ve eğitmen seçiminin nasıl işlediğini yine de bu sayfada okuyabilirsiniz.",
  },
  crumbs: [],
  crumb: "Eğitmen havuzu",
  hero: {
    eyebrow: "Eğitmen havuzu · başvurular şu anda kapalı",
    h1: ["Eğitmen havuzu: ", "YZ eğitmenleri", " için başvurulara ara verdik"],
    lede: "Şu anda yeni başvuru almıyoruz. Kimi aradığımızı ve seçimin nasıl işlediğini yine de bu sayfada okuyabilirsiniz.",
    primary: { label: "Süreç nasıl işler", to: "trainer", hash: "ablauf" },
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
          h: "Ofiste üretken YZ",
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
        ["Öğretim", "Eğitim veya yetişkin eğitimi deneyimi; görüşmede kısa bir canlı gösterim yaparsınız"],
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
      h: "Profilinizden ilk eğitime",
      lede: "Her adımdan sonra birlikte devam edip etmeyeceğimize karar veririz.",
      items: [
        { h: "Kısa profil", p: "Kısa bir profil yeterli: konular, deneyim, diller ve serbest çalışma durumunuz. Tam bir başvuru dosyasına gerek yok." },
        {
          h: "Bekleme listesi ve eğitmen havuzu",
          p: "Şu anda yeni profil almıyoruz. Elimizdeki profiller bekleme listesinde kalır. Profilinize uyan bir müşteri talebi gelince size kişisel olarak yanıt veririz. Bu, görev verileceği anlamına gelmez.",
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
    label: "Eğitmen havuzu",
    h: "Başvurular şu anda kapalı",
    p: "Şu anda yeni kısa profil almıyoruz. Elimizdeki profiller bekleme listesinde kalır; profile uyan bir müşteri talebi gelince size döneriz.",
    primary: { label: "Tüm YZ eğitimleri", to: "schulungen" },
    secondary: { label: "OpSolid hakkında", to: "ueber" },
  },
};

/* R2: the hero object, the page's own five steps as a schema sheet; every note is a verbatim part of the step text. */
const TRAINER_NOTES: Record<"de" | "en" | "tr", [string, string, string, string, string]> = {
  de: ["Eine Bewerbungsmappe brauchen wir nicht.", "Derzeit nehmen wir keine neuen Profile an.", "30 Minuten online", "Jede Schulung vereinbaren wir danach einzeln", "Den ersten Einsatz vergüten wir wie jeden weiteren."],
  en: ["We do not need a full application pack.", "We are not taking new profiles at the moment.", "online for 30 minutes", "we agree each course individually", "Your first assignment is paid like any other."],
  tr: ["Tam bir başvuru dosyasına gerek yok.", "Şu anda yeni profil almıyoruz.", "30 dakika çevrimiçi", "her eğitimi ayrı ayrı kararlaştırırız", "İlk görevinizin ücretini diğer görevler gibi öderiz."],
};
for (const [loc, d, etikett, stamp] of [
  ["de", de, "Schema · so arbeiten wir mit Trainerinnen und Trainern", "Schema"],
  ["en", en, "Schema · how we work with trainers", "Schema"],
  ["tr", tr, "Şema · eğitmenlerle nasıl çalışıyoruz", "Şema"],
] as const) {
  const b = blockOf(d, "steps", "ablauf");
  const notes = TRAINER_NOTES[loc];
  d.hero.object = liste(etikett, { title: b.h, sub: b.note ?? b.label, stamp }, b.items.map((it, i) => ({ text: it.h, note: frag(it.p, notes[i]) })), { numbered: true });
}

export const page: PageSet = { de, en, tr };
