/**
 * "Trainer werden": recruiting page for freelance AI trainers. German is the source; EN and TR are
 * transcreations in full key parity. Binding (trainer-roster.md section 5.4 and 4.2): no named trainers,
 * no "our trainers", no day-rate numbers, no employee-like control (freedom of method, own clients,
 * right to decline). The network is still being built and the page says so.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "trainer",
  meta: {
    title: "Trainer werden: freiberufliche KI-Trainer gesucht",
    description:
      "OpSolid baut ein Netzwerk freiberuflicher KI-Trainerinnen und -Trainer auf: online, Deutsch und Englisch. Bezahlte Probesession, Rahmenvertrag, freie Methodik.",
  },
  crumbs: ["schulungen"],
  crumb: "Trainer werden",
  hero: {
    eyebrow: "Trainer werden · freiberuflich · online",
    h1: ["Freiberufliche ", "KI-Trainerinnen und -Trainer", " gesucht."],
    lede: "Wir bauen ein Netzwerk freiberuflicher KI-Trainerinnen und -Trainer auf, für Schulungen auf Deutsch und Englisch, online und live. Wenn Sie KI praxisnah vermitteln, melden Sie sich.",
    primary: { label: "Kurzprofil senden", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "So läuft es ab", to: "trainer", hash: "ablauf" },
    facts: ["Freiberuflich", "Online · Deutsch und Englisch", "Probesession wird bezahlt"],
  },
  blocks: [
    {
      t: "text",
      id: "netzwerk",
      label: "Netzwerk",
      note: "Stand: im Aufbau.",
      h: "Was wir aufbauen.",
      lede: "Ein Netzwerk freiberuflicher Fachleute, die KI-Schulungen für Unternehmensteams halten.",
      cta: { label: "Alle KI-Schulungen", to: "schulungen" },
      paras: [
        "OpSolid bietet KI-Schulungen für Teams an: online, live, auf Deutsch und Englisch. Für die Durchführung suchen wir freiberufliche Trainerinnen und Trainer. Wer eine Schulung hält, nennen wir dem Kunden vor der Buchung namentlich.",
        "Das Netzwerk ist im Aufbau. Wir stellen die ersten Trainerinnen und Trainer hier vor, sobald sie zugesagt haben und einverstanden sind.",
      ],
    },
    {
      t: "rows",
      id: "themen",
      label: "Themen",
      note: "Vier Felder, in denen wir Schulungen planen.",
      h: "Wofür wir Fachleute suchen.",
      lede: "Gesucht sind Menschen mit eigener Praxis, die ihr Thema verständlich vermitteln.",
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
      t: "principles",
      id: "zusammenarbeit",
      label: "Zusammenarbeit",
      note: "Freiberuflich heißt: Sie bestimmen, wie Sie arbeiten.",
      h: "Was wir Ihnen bieten.",
      lede: "Eine klare Zusammenarbeit zwischen zwei selbstständigen Partnern.",
      items: [
        { h: "Honorar nach Vereinbarung.", p: "Das Honorar vereinbaren wir persönlich und vorab schriftlich." },
        { h: "Planbare Termine.", p: "Wir stimmen Termine mit Ihnen ab. Sie entscheiden, welche Anfragen Sie annehmen." },
        { h: "Bezahlte Probesession.", p: "Vor dem ersten Einsatz halten Sie eine Probesession, die wir bezahlen." },
        { h: "Rahmenvertrag.", p: "Die Zusammenarbeit läuft über einen Rahmenvertrag mit Ihnen als selbstständiger Trainerin oder selbstständigem Trainer." },
        { h: "Freiheit bei der Methode.", p: "Wir stimmen Thema und Lernziele mit Ihnen ab. Wie Sie sie erreichen, entscheiden Sie." },
        { h: "Eigener Auftritt.", p: "Sie treten unter Ihrem eigenen Namen auf und können weitere Auftraggeber haben." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Ablauf",
      note: "Fünf Schritte, jeder mit einer Entscheidung.",
      h: "Von Ihrem Profil zum ersten Termin.",
      lede: "Nach jedem Schritt entscheiden wir beide, ob es weitergeht.",
      items: [
        { h: "Kurzprofil", p: "Sie schicken uns ein kurzes Profil: Themen, Erfahrung, Sprachen und Ihre Selbstständigkeit. Eine Bewerbungsmappe brauchen wir nicht." },
        { h: "Gespräch", p: "Wir sprechen online mit Ihnen über Ihre Praxis und Ihre Art zu vermitteln. Dazu zeigen Sie uns kurz live, wie Sie arbeiten." },
        { h: "Bezahlte Probesession", p: "Sie halten eine Probesession, die wir bezahlen. Danach entscheiden wir beide, ob die Zusammenarbeit passt." },
        { h: "Rahmenvertrag", p: "Passt es, schließen wir einen Rahmenvertrag. Darin steht, wie wir zusammenarbeiten und wie das Honorar geregelt ist." },
        { h: "Erste Termine", p: "Sobald eine Anfrage zu Ihrem Thema vorliegt, fragen wir Sie an. Dem Kunden nennen wir Sie vor der Buchung namentlich, wenn Sie einverstanden sind." },
      ],
    },
    {
      t: "spec",
      id: "profil",
      label: "Profil",
      h: "Was wir von Ihnen erwarten.",
      lede: "Eigene Praxis, klare Vermittlung und Verlässlichkeit im Umgang mit Kundendaten.",
      rows: [
        ["Fachwissen", "Eigene Praxis im gewählten Thema, die Sie live zeigen können"],
        ["Vermittlung", "Erfahrung in Training oder Erwachsenenbildung und eine kurze Lehrprobe"],
        ["Sprache", "Deutsch oder Englisch auf hohem Niveau (etwa C1)"],
        ["Datenschutz", "Sie kennen die Grundsätze der DSGVO und gehen mit Kundendaten in KI-Werkzeugen sorgfältig um"],
        ["Selbstständigkeit", "Sie arbeiten freiberuflich oder als Gewerbetreibende, mit eigenem Auftritt"],
        ["Versicherung", "Berufshaftpflicht ist üblich; den Nachweis erbitten wir vor dem ersten Einsatz"],
      ],
    },
    {
      t: "text",
      id: "datenschutz",
      label: "Datenschutz",
      note: "Zu Ihrer Bewerbung.",
      h: "Was mit Ihren Bewerbungsdaten geschieht.",
      lede: "Wir nutzen Ihre Angaben nur, um über eine Zusammenarbeit zu entscheiden.",
      cta: { label: "Datenschutzerklärung", to: "privacy" },
      paras: [
        "Ihr Kurzprofil und Ihre Kontaktdaten verwenden wir ausschließlich für die Auswahl von Trainerinnen und Trainern. Wir geben sie nicht an Kunden weiter.",
        "Name, Foto oder Profil zeigen wir auf dieser Website nur, wenn Sie schriftlich eingewilligt haben und ein Vertrag besteht. Eine Einwilligung können Sie widerrufen.",
        "Sie können jederzeit Auskunft über Ihre Daten und deren Löschung verlangen. Alle Angaben dazu stehen in der Datenschutzerklärung.",
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen von Trainerinnen und Trainern.",
    items: [
      {
        q: "Bin ich bei OpSolid angestellt?",
        a: "Nein. Sie arbeiten als selbstständige Trainerin oder selbstständiger Trainer auf Basis eines Rahmenvertrags. Sie entscheiden, welche Anfragen Sie annehmen, und können für andere Auftraggeber arbeiten.",
      },
      {
        q: "Wie hoch ist das Honorar?",
        a: "Das Honorar vereinbaren wir persönlich und vorab schriftlich. Eine Honorartabelle veröffentlichen wir nicht.",
      },
      {
        q: "Wird die Probesession bezahlt?",
        a: "Ja. Die Probesession bezahlen wir zum vereinbarten Honorar. Sie ist keine unbezahlte Vorarbeit.",
      },
      {
        q: "Muss ich mit Ihren Folien arbeiten?",
        a: "Nein. Sie entscheiden über Methode und Material. Wir stimmen mit Ihnen Thema, Umfang und Lernziele ab.",
      },
      {
        q: "Wann beginnen die ersten Termine?",
        a: "Das Netzwerk ist im Aufbau. Termine hängen von Kundenanfragen ab. Eine feste Zahl von Einsätzen können wir nicht zusagen.",
      },
      {
        q: "Werde ich auf der Website genannt?",
        a: "Nur mit Ihrer schriftlichen Einwilligung. Dem Kunden nennen wir Ihren Namen vor der Buchung der Schulung, wenn Sie einverstanden sind.",
      },
    ],
  },
  cta: {
    label: "Trainer werden",
    h: "Sie vermitteln KI praxisnah? Schreiben Sie uns.",
    p: "Ein kurzes Profil genügt: Themen, Erfahrung und Sprachen. Wir melden uns und vereinbaren ein Gespräch.",
    primary: { label: "Kurzprofil senden", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "KI-Check für Unternehmen", to: "check" },
  },
};

const en: PageDef = {
  key: "trainer",
  meta: {
    title: "Become a trainer: freelance AI trainers wanted",
    description:
      "OpSolid is building a network of freelance AI trainers: online, English and German. Paid trial session, framework contract and freedom in how you teach.",
  },
  crumbs: ["schulungen"],
  crumb: "Become a trainer",
  hero: {
    eyebrow: "Become a trainer · freelance · online",
    h1: ["Freelance ", "AI trainers", " wanted."],
    lede: "We are building a network of freelance AI trainers for courses in English and German, online and live. If you teach AI in a practical way, get in touch.",
    primary: { label: "Send a short profile", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "How it works", to: "trainer", hash: "ablauf" },
    facts: ["Freelance", "Online · English and German", "Trial session is paid"],
  },
  blocks: [
    {
      t: "text",
      id: "netzwerk",
      label: "Network",
      note: "Status: being built.",
      h: "What we are building.",
      lede: "A network of freelance specialists who teach AI courses for company teams.",
      cta: { label: "All AI training", to: "schulungen" },
      paras: [
        "OpSolid offers AI training for teams: online, live, in English and German. To deliver it, we are looking for freelance trainers. We name the person who teaches a course to the client before they book.",
        "The network is still being built. We will introduce the first trainers here once they have confirmed and agreed.",
      ],
    },
    {
      t: "rows",
      id: "themen",
      label: "Topics",
      note: "Four areas where we plan courses.",
      h: "What we are looking for specialists in.",
      lede: "We look for people with hands-on practice who can teach their topic clearly.",
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
      t: "principles",
      id: "zusammenarbeit",
      label: "Working together",
      note: "Freelance means you decide how you work.",
      h: "What we offer you.",
      lede: "A clear working relationship between two independent partners.",
      items: [
        { h: "Fee by agreement.", p: "We agree the fee with you personally and in writing beforehand." },
        { h: "Plannable dates.", p: "We coordinate dates with you. You decide which requests you accept." },
        { h: "Paid trial session.", p: "Before your first assignment you run a trial session, which we pay for." },
        { h: "Framework contract.", p: "We work together under a framework contract with you as an independent trainer." },
        { h: "Freedom in method.", p: "We agree topic and learning goals with you. How you reach them is up to you." },
        { h: "Your own profile.", p: "You appear under your own name and may have other clients." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Process",
      note: "Five steps, each with a decision.",
      h: "From your profile to the first date.",
      lede: "After each step we both decide whether to continue.",
      items: [
        { h: "Short profile", p: "You send us a short profile: topics, experience, languages and your self-employment. We do not need a full application pack." },
        { h: "Conversation", p: "We talk with you online about your practice and how you teach. You also show us briefly, live, how you work." },
        { h: "Paid trial session", p: "You run a trial session, which we pay for. Afterwards we both decide whether the collaboration fits." },
        { h: "Framework contract", p: "If it fits, we sign a framework contract. It sets out how we work together and how the fee is arranged." },
        { h: "First dates", p: "Once a request matches your topic, we ask you. We name you to the client before they book, if you agree." },
      ],
    },
    {
      t: "spec",
      id: "profil",
      label: "Profile",
      h: "What we expect from you.",
      lede: "Hands-on practice, clear teaching and care with client data.",
      rows: [
        ["Expertise", "Your own practice in the chosen topic, which you can show live"],
        ["Teaching", "Experience in training or adult education and a short trial lesson"],
        ["Language", "English or German at a high level (around C1)"],
        ["Data protection", "You know the principles of GDPR and handle client data in AI tools with care"],
        ["Self-employment", "You work as a freelancer or sole trader, with your own profile"],
        ["Insurance", "Professional liability cover is usual; we ask for proof before your first assignment"],
      ],
    },
    {
      t: "text",
      id: "datenschutz",
      label: "Data protection",
      note: "About your application.",
      h: "What happens to your application data.",
      lede: "We use your details only to decide on a collaboration.",
      cta: { label: "Privacy policy", to: "privacy" },
      paras: [
        "We use your short profile and contact details only to select trainers. We do not pass them on to clients.",
        "We show your name, photo or profile on this website only if you have consented in writing and a contract is in place. You can withdraw consent.",
        "You can ask at any time for information about your data and for its deletion. Details are in the privacy policy.",
      ],
    },
  ],
  faq: {
    label: "Common questions",
    h: "Common questions from trainers.",
    items: [
      {
        q: "Would I be employed by OpSolid?",
        a: "No. You work as an independent trainer under a framework contract. You decide which requests you accept and may work for other clients.",
      },
      {
        q: "What is the fee?",
        a: "We agree the fee with you personally and in writing beforehand. We do not publish a fee table.",
      },
      {
        q: "Is the trial session paid?",
        a: "Yes. We pay for the trial session at the agreed fee. It is not unpaid groundwork.",
      },
      {
        q: "Do I have to use your slides?",
        a: "No. You decide on method and material. We agree topic, scope and learning goals with you.",
      },
      {
        q: "When do the first dates start?",
        a: "The network is still being built. Dates depend on client requests. We cannot promise a fixed number of assignments.",
      },
      {
        q: "Will I be named on the website?",
        a: "Only with your written consent. We name you to the client before they book a course, if you agree.",
      },
    ],
  },
  cta: {
    label: "Become a trainer",
    h: "Do you teach AI in a practical way? Write to us.",
    p: "A short profile is enough: topics, experience and languages. We will get back to you and arrange a conversation.",
    primary: { label: "Send a short profile", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "AI check for companies", to: "check" },
  },
};

const tr: PageDef = {
  key: "trainer",
  meta: {
    title: "Eğitmen olun: serbest çalışan YZ eğitmenleri aranıyor",
    description:
      "OpSolid, serbest çalışan YZ eğitmenlerinden bir ağ kuruyor: çevrimiçi, Almanca ve İngilizce. Ücretli deneme oturumu, çerçeve sözleşme, yöntemde özgürlük.",
  },
  crumbs: ["schulungen"],
  crumb: "Eğitmen olun",
  hero: {
    eyebrow: "Eğitmen olun · serbest çalışan · çevrimiçi",
    h1: ["Serbest çalışan ", "YZ eğitmenleri", " aranıyor."],
    lede: "Almanca ve İngilizce, çevrimiçi ve canlı eğitimler için serbest çalışan YZ eğitmenlerinden oluşan bir ağ kuruyoruz. YZ'yi uygulamalı anlatıyorsanız bize yazın.",
    primary: { label: "Kısa profil gönderin", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "Süreç nasıl işler", to: "trainer", hash: "ablauf" },
    facts: ["Serbest çalışan", "Çevrimiçi · Almanca ve İngilizce", "Deneme oturumu ücretli"],
  },
  blocks: [
    {
      t: "text",
      id: "netzwerk",
      label: "Ağ",
      note: "Durum: kuruluyor.",
      h: "Ne kuruyoruz?",
      lede: "Şirket ekipleri için YZ eğitimleri veren, serbest çalışan uzmanlardan oluşan bir ağ.",
      cta: { label: "Tüm YZ eğitimleri", to: "schulungen" },
      paras: [
        "OpSolid ekipler için YZ eğitimleri sunuyor: çevrimiçi, canlı, Almanca ve İngilizce. Eğitimleri vermek için serbest çalışan eğitmenler arıyoruz. Bir eğitimi kimin vereceğini, müşteri rezervasyon yapmadan önce adıyla bildiriyoruz.",
        "Ağ henüz kuruluş aşamasında. İlk eğitmenleri, onay verip kabul ettiklerinde burada tanıtacağız.",
      ],
    },
    {
      t: "rows",
      id: "themen",
      label: "Konular",
      note: "Eğitim planladığımız dört alan.",
      h: "Hangi alanlarda uzman arıyoruz?",
      lede: "Kendi uygulama deneyimi olan ve konusunu anlaşılır aktarabilen kişiler arıyoruz.",
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
      t: "principles",
      id: "zusammenarbeit",
      label: "İşbirliği",
      note: "Serbest çalışmak, nasıl çalışacağınıza sizin karar vermeniz demektir.",
      h: "Size ne sunuyoruz?",
      lede: "İki bağımsız ortak arasında net bir işbirliği.",
      items: [
        { h: "Anlaşmaya göre ücret.", p: "Ücreti sizinle kişisel olarak ve önceden yazılı biçimde belirleriz." },
        { h: "Planlanabilir tarihler.", p: "Tarihleri sizinle birlikte belirleriz. Hangi talepleri kabul edeceğinize siz karar verirsiniz." },
        { h: "Ücretli deneme oturumu.", p: "İlk görevden önce bir deneme oturumu verirsiniz; bunun ücretini biz öderiz." },
        { h: "Çerçeve sözleşme.", p: "İşbirliği, sizinle bağımsız eğitmen olarak yapılan bir çerçeve sözleşme üzerinden yürür." },
        { h: "Yöntemde özgürlük.", p: "Konuyu ve öğrenme hedeflerini sizinle birlikte belirleriz. Bunlara nasıl ulaşacağınıza siz karar verirsiniz." },
        { h: "Kendi tanıtımınız.", p: "Kendi adınızla görünürsünüz ve başka müşterilerle de çalışabilirsiniz." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Süreç",
      note: "Her biri bir kararla beş adım.",
      h: "Profilinizden ilk tarihe.",
      lede: "Her adımdan sonra birlikte devam edip etmeyeceğimize karar veririz.",
      items: [
        { h: "Kısa profil", p: "Bize kısa bir profil gönderirsiniz: konular, deneyim, diller ve serbest çalışma durumunuz. Tam bir başvuru dosyasına gerek yok." },
        { h: "Görüşme", p: "Sizinle çevrimiçi olarak uygulamanız ve anlatım tarzınız hakkında konuşuruz. Nasıl çalıştığınızı ayrıca kısaca canlı gösterirsiniz." },
        { h: "Ücretli deneme oturumu", p: "Bir deneme oturumu verirsiniz; ücretini biz öderiz. Ardından işbirliğinin uyup uymadığına birlikte karar veririz." },
        { h: "Çerçeve sözleşme", p: "Uyuyorsa bir çerçeve sözleşme imzalarız. Sözleşmede nasıl çalışacağımız ve ücretin nasıl düzenlendiği yer alır." },
        { h: "İlk tarihler", p: "Konunuza uygun bir talep geldiğinde size danışırız. Onay verirseniz, rezervasyondan önce müşteriye adınızı bildiririz." },
      ],
    },
    {
      t: "spec",
      id: "profil",
      label: "Profil",
      h: "Sizden beklediklerimiz.",
      lede: "Kendi uygulama deneyimi, net aktarım ve müşteri verilerinde güvenilirlik.",
      rows: [
        ["Uzmanlık", "Seçtiğiniz konuda, canlı gösterebileceğiniz kendi uygulama deneyiminiz"],
        ["Aktarım", "Eğitim veya yetişkin eğitimi deneyimi ve kısa bir deneme dersi"],
        ["Dil", "Almanca veya İngilizce, yüksek düzeyde (yaklaşık C1)"],
        ["Veri koruma", "GDPR/DSGVO ilkelerini bilirsiniz ve YZ araçlarında müşteri verileriyle özenle çalışırsınız"],
        ["Serbest çalışma", "Serbest meslek sahibi ya da işletme sahibi olarak, kendi duruşunuzla çalışırsınız"],
        ["Sigorta", "Mesleki sorumluluk sigortası yaygındır; belgesini ilk görevden önce isteriz"],
      ],
    },
    {
      t: "text",
      id: "datenschutz",
      label: "Veri koruma",
      note: "Başvurunuz hakkında.",
      h: "Başvuru verilerinize ne olur?",
      lede: "Bilgilerinizi yalnızca bir işbirliğine karar vermek için kullanırız.",
      cta: { label: "Gizlilik politikası", to: "privacy" },
      paras: [
        "Kısa profilinizi ve iletişim bilgilerinizi yalnızca eğitmen seçimi için kullanırız. Müşterilere iletmeyiz.",
        "Adınızı, fotoğrafınızı veya profilinizi bu web sitesinde yalnızca yazılı onayınız ve bir sözleşme varsa gösteririz. Onayınızı geri alabilirsiniz.",
        "Verileriniz hakkında bilgi almayı ve silinmesini istediğiniz zaman talep edebilirsiniz. Ayrıntılar gizlilik politikasında yer alır.",
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Eğitmenlerden sık gelen sorular.",
    items: [
      {
        q: "OpSolid'in çalışanı mı olurum?",
        a: "Hayır. Bir çerçeve sözleşme temelinde bağımsız eğitmen olarak çalışırsınız. Hangi talepleri kabul edeceğinize siz karar verirsiniz ve başka müşteriler için de çalışabilirsiniz.",
      },
      {
        q: "Ücret ne kadar?",
        a: "Ücreti sizinle kişisel olarak ve önceden yazılı biçimde belirleriz. Bir ücret tablosu yayımlamıyoruz.",
      },
      {
        q: "Deneme oturumu ücretli mi?",
        a: "Evet. Deneme oturumunu kararlaştırılan ücretle öderiz. Karşılıksız bir ön çalışma değildir.",
      },
      {
        q: "Sizin slaytlarınızla mı çalışmam gerekiyor?",
        a: "Hayır. Yöntem ve materyale siz karar verirsiniz. Konuyu, kapsamı ve öğrenme hedeflerini sizinle birlikte belirleriz.",
      },
      {
        q: "İlk tarihler ne zaman başlıyor?",
        a: "Ağ kuruluş aşamasında. Tarihler müşteri taleplerine bağlıdır. Belirli sayıda görev vaat edemeyiz.",
      },
      {
        q: "Web sitesinde adım geçer mi?",
        a: "Yalnızca yazılı onayınızla. Onay verirseniz, eğitim rezervasyonundan önce müşteriye adınızı bildiririz.",
      },
    ],
  },
  cta: {
    label: "Eğitmen olun",
    h: "YZ'yi uygulamalı mı anlatıyorsunuz? Bize yazın.",
    p: "Kısa bir profil yeterli: konular, deneyim ve diller. Size döner ve bir görüşme planlarız.",
    primary: { label: "Kısa profil gönderin", to: "kontakt", query: { anliegen: "trainer" } },
    secondary: { label: "İşletmeler için YZ Kontrolü", to: "check" },
  },
};

export const page: PageSet = { de, en, tr };
