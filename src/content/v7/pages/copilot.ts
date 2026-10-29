/**
 * Microsoft 365 Copilot Praxistag in depth. German is the source; EN and TR are transcreations in full
 * key parity. Published price: ab 2.400 EUR netto (1 day, up to 12). Data-protection wording stays neutral
 * ("nach Angaben von Microsoft"), no guarantees, no legal advice.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "copilot",
  meta: {
    title: "Microsoft 365 Copilot Schulung: der Praxistag für Teams",
    description:
      "Microsoft 365 Copilot Praxistag: 1 Tag, online live, bis zu 12 Personen, ab 2.400 € netto. Copilot in Outlook, Teams, Word, Excel und PowerPoint praktisch.",
  },
  crumbs: ["schulungen"],
  crumb: "Copilot-Praxistag",
  hero: {
    eyebrow: "KI-Schulung · 1 Tag · online live",
    h1: ["Microsoft 365 Copilot: ", "ein Tag Praxis", " an Ihren Aufgaben."],
    lede: "Ein Tag, an dem Ihr Team Copilot in Outlook, Teams, Word, Excel und PowerPoint an Aufgaben aus dem Alltag anwendet. Online und live, für bis zu 12 Personen, ab 2.400 € netto.",
    primary: { label: "Praxistag anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Tagesablauf ansehen", to: "copilot", hash: "ablauf" },
    facts: ["Ab 2.400 € netto", "1 Tag · bis 12 Personen", "Copilot-Lizenzen sind Voraussetzung"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Skizze: vier Stationen von Eingang über Regeln und Entwurf bis zum Menschen, der entscheidet",
      caption: "Copilot entwirft. Ihr Team entscheidet.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "spec",
      id: "eckdaten",
      label: "Eckdaten",
      h: "Was der Praxistag umfasst.",
      lede: "Ein ganzer Tag für Ihr Team, ab 2.400 € netto. Voraussetzung sind Microsoft-365-Copilot-Lizenzen für alle Teilnehmenden.",
      rows: [
        ["Preis", "Ab 2.400 € netto, zzgl. USt., nur für Unternehmen. Den Preis für Ihren Umfang nennen wir vorab."],
        ["Dauer", "1 Tag"],
        ["Gruppe", "Bis zu 12 Personen"],
        ["Voraussetzung", "Microsoft 365 Copilot-Lizenz und Microsoft-365-Anmeldung für jede teilnehmende Person"],
        ["Durchführung", "Online live, per Microsoft Teams oder Zoom nach Absprache"],
        ["Sprache", "Deutsch oder Englisch"],
        ["Termin", "Nach Vereinbarung, als geschlossener Termin für Ihr Team"],
        ["Leitung", "Eine von uns ausgewählte freiberufliche Trainerin, ein von uns ausgewählter freiberuflicher Trainer oder OpSolid selbst. Den Namen nennen wir Ihnen vor der Buchung."],
        ["Nachweis", "Teilnahmebescheinigung von OpSolid"],
      ],
    },
    {
      t: "situations",
      id: "fuer-wen",
      label: "Für wen",
      note: "Für Teams mit Copilot-Lizenzen.",
      h: "Für Teams, die Copilot haben und nutzen wollen.",
      lede: "Der Praxistag hilft, wenn Copilot freigeschaltet ist, aber im Alltag noch nicht ankommt.",
      cta: { label: "Erst klären: der KI-Check", to: "check" },
      items: [
        { h: "Die Lizenzen sind da, die Nutzung ist es nicht.", p: "Copilot ist freigeschaltet, aber im Alltag kaum verankert." },
        { h: "Niemand weiß, welche Aufgaben sich lohnen.", p: "Es fehlt ein Gespür dafür, wofür Copilot taugt und wofür nicht." },
        { h: "Es gibt Sorgen um Berechtigungen und vertrauliche Inhalte.", p: "Was sieht Copilot, was darf ich eingeben? Die Antworten fehlen im Team." },
        { h: "Postfach und Besprechungen binden viel Zeit.", p: "Zusammenfassen, Nachbereiten und erste Entwürfe sind Aufgaben, bei denen ein Assistent entlasten kann." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Tagesablauf",
      note: "Sechs Blöcke über den Tag.",
      h: "Was an dem Tag passiert.",
      lede: "Sechs Blöcke, jeder an Aufgaben aus Ihrem Alltag. Die Reihenfolge passen wir mit Ihnen vorab an.",
      items: [
        { h: "Ausgangslage", p: "Wir klären, welche Aufgaben Ihr Team hat und wie Copilot bei Ihnen eingerichtet ist." },
        { h: "Outlook und Teams", p: "E-Mail-Verläufe zusammenfassen und beantworten, Besprechungen vor- und nachbereiten." },
        { h: "Word und PowerPoint", p: "Texte entwerfen, überarbeiten und kürzen. Präsentationen aus vorhandenen Unterlagen aufbauen." },
        { h: "Excel", p: "Daten erklären lassen, Auswertungen vorbereiten und die Ergebnisse prüfen." },
        { h: "Gute Anfragen und Kontrolle", p: "Aufgaben so beschreiben, dass der Entwurf brauchbar wird, und Ergebnisse vor der Weitergabe kontrollieren." },
        { h: "Ihre Abläufe", p: "Jede Person hält fest, welche Abläufe sie künftig mit Copilot unterstützt." },
      ],
    },
    {
      t: "examples",
      id: "anwendungsfaelle",
      label: "Anwendungsfälle",
      note: "Beispiel-Szenarien, keine Kundenprojekte.",
      h: "Was sich mit Copilot im Alltag erledigen lässt.",
      lede: "Vier typische Aufgaben, an denen wir üben. In jeder bleibt die Entscheidung bei Ihrem Team.",
      tag: "Beispiel-Szenario",
      cta: { label: "Zur Seite Microsoft 365", to: "m365" },
      items: [
        {
          area: "Outlook",
          h: "Lange E-Mail-Verläufe",
          before: "Lange Verläufe werden komplett gelesen, um die offene Frage zu finden.",
          after: "Copilot fasst den Verlauf zusammen und entwirft eine Antwort.",
          human: "Sie lesen den Entwurf, passen ihn an und senden selbst.",
        },
        {
          area: "Teams",
          h: "Besprechungen nachbereiten",
          before: "Nach dem Termin schreibt jemand Protokoll und offene Punkte von Hand.",
          after: "Ist die Transkription aktiviert, fasst Copilot die Besprechung zusammen und schlägt Aufgaben vor.",
          human: "Das Team prüft Zusammenfassung und Aufgaben, bevor sie verteilt werden.",
        },
        {
          area: "Word & PowerPoint",
          h: "Erste Fassungen von Texten und Folien",
          before: "Erste Fassungen entstehen aus der leeren Seite.",
          after: "Copilot entwirft aus vorhandenen Dokumenten eine erste Fassung.",
          human: "Inhalt, Zahlen und Ton prüft eine Person.",
        },
        {
          area: "Excel",
          h: "Auswertungen vorbereiten",
          before: "Formeln und Auswertungen entstehen mühsam von Hand.",
          after: "Copilot erklärt Daten, schlägt Formeln vor und bereitet Auswertungen vor.",
          human: "Ergebnisse werden gegen die Quelldaten geprüft.",
        },
      ],
    },
    {
      t: "text",
      id: "datenschutz",
      label: "Datenschutz",
      note: "Neutrale Einordnung, keine Rechtsberatung.",
      h: "Daten und Berechtigungen in Microsoft 365.",
      lede: "Nach Angaben von Microsoft greift Copilot nur auf Inhalte zu, auf die die jeweilige Person bereits Zugriff hat.",
      cta: { label: "Zur KI-Beratung", to: "beratung" },
      paras: [
        "Für den sicheren Einsatz heißt das: Saubere Berechtigungen in SharePoint, Teams und OneDrive sind die Grundlage. Wer zu viel sehen darf, kann es auch über Copilot finden.",
        "Im Praxistag zeigen wir, wie Sie Freigaben prüfen und welche Inhalte besser nicht in eine Anfrage gehören. Die Einstellungen Ihres Microsoft-365-Mandanten ändern wir dabei nicht.",
        "Die datenschutzrechtliche Bewertung für Ihr Unternehmen trifft Ihr Datenschutzbeauftragter. Wir geben keine Rechtsberatung. Wenn Sie Copilot unternehmensweit einführen oder Berechtigungen aufräumen möchten, ist das ein Thema für unsere KI-Beratung zu Microsoft 365.",
      ],
    },
    {
      t: "rows",
      id: "vorbereitung",
      label: "Vorbereitung",
      note: "Drei Dinge vorab.",
      h: "Wie Sie sich vorbereiten.",
      lede: "Wir senden Ihnen vorab eine kurze Checkliste. Das Wichtigste in drei Punkten.",
      items: [
        { h: "Lizenzen und Anmeldung prüfen.", p: "Alle Teilnehmenden brauchen eine Copilot-Lizenz und müssen sich in Microsoft 365 anmelden können. Wir verkaufen keine Lizenzen." },
        { h: "Aufgaben sammeln.", p: "Wir bitten Sie um einige typische Aufgaben aus Ihrem Alltag. Daraus bauen wir die Übungen." },
        { h: "Vertrauliches ausklammern.", p: "Wir üben mit Beispielinhalten oder mit Material, das Sie dafür ausdrücklich freigeben." },
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen zum Copilot-Praxistag.",
    items: [
      {
        q: "Brauchen wir Copilot-Lizenzen?",
        a: "Ja. Alle Teilnehmenden brauchen eine Microsoft-365-Copilot-Lizenz. Wir verkaufen keine Lizenzen; Sie beziehen sie über Microsoft oder Ihren Microsoft-Partner.",
      },
      {
        q: "Was bedeutet „ab 2.400 €“?",
        a: "Der Preis gilt für einen Tag mit bis zu 12 Personen. Weicht Ihr Umfang ab, nennen wir den Preis vor der Buchung. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Ändern Sie unsere Microsoft-365-Einstellungen?",
        a: "Nein. Der Praxistag ist eine Schulung. Copilot unternehmensweit einzuführen oder Berechtigungen aufzuräumen ist ein Beratungsthema.",
      },
      {
        q: "Läuft der Praxistag auch auf Englisch?",
        a: "Ja. Er läuft auf Deutsch oder Englisch. Nennen Sie uns bei der Anfrage die Sprache Ihres Teams.",
      },
      {
        q: "Wer hält den Praxistag?",
        a: "Eine von uns ausgewählte freiberufliche Trainerin, ein von uns ausgewählter freiberuflicher Trainer oder OpSolid selbst. Den Namen nennen wir Ihnen vor der Buchung.",
      },
      {
        q: "Bekommen wir eine Bescheinigung?",
        a: "Ja, eine Teilnahmebescheinigung von OpSolid mit Datum, Dauer, Themen und Trainer. Ein Zertifikat ist nicht vorgeschrieben.",
      },
      {
        q: "Ist der Praxistag eine Maßnahme nach Art. 4 der KI-Verordnung?",
        a: "Unternehmen, die KI einsetzen, ergreifen Maßnahmen, um die KI-Kompetenz ihrer Beschäftigten zu fördern. Der Praxistag kann dazu gehören. Ein Zertifikat ist nicht vorgeschrieben. Wir geben keine Rechtsberatung.",
      },
    ],
  },
  cta: {
    label: "Praxistag anfragen",
    h: "Wofür soll Ihr Team Copilot als Erstes nutzen?",
    p: "Schreiben Sie uns kurz zu Teamgröße, Sprache und Aufgaben. Wir melden uns mit einem Vorschlag und nennen die Trainerin oder den Trainer vor der Buchung.",
    primary: { label: "Praxistag anfragen", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Zur Seite Microsoft 365", to: "m365" },
  },
  schema: {
    courses: [
      {
        name: "Microsoft 365 Copilot Praxistag",
        description:
          "Online-Praxistag für Teams: Microsoft 365 Copilot in Outlook, Teams, Word, Excel und PowerPoint an eigenen Aufgaben. 1 Tag, bis zu 12 Personen, live auf Deutsch oder Englisch.",
        price: 2400,
        from: true,
      },
    ],
  },
};

const en: PageDef = {
  key: "copilot",
  meta: {
    title: "Microsoft 365 Copilot workshop: a practice day for teams",
    description:
      "Microsoft 365 Copilot workshop: 1 day, live online, up to 12 people, from €2,400 net. Copilot in Outlook, Teams, Word, Excel and PowerPoint, hands-on.",
  },
  crumbs: ["schulungen"],
  crumb: "Copilot workshop",
  hero: {
    eyebrow: "AI training · 1 day · live online",
    h1: ["Microsoft 365 Copilot: ", "one day of practice", " on your own tasks."],
    lede: "One day in which your team applies Copilot in Outlook, Teams, Word, Excel and PowerPoint to tasks from daily work. Live online, for up to 12 people, from €2,400 net.",
    primary: { label: "Request the workshop", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "See the day plan", to: "copilot", hash: "ablauf" },
    facts: ["From €2,400 net", "1 day · up to 12 people", "Copilot licences required"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Sketch: four stations from input through rules and draft to the person who decides",
      caption: "Copilot drafts. Your team decides.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "spec",
      id: "eckdaten",
      label: "Key facts",
      h: "What the workshop covers.",
      lede: "A full day for your team, from €2,400 net. Microsoft 365 Copilot licences for all participants are a prerequisite.",
      rows: [
        ["Price", "From €2,400 net, plus VAT, businesses only. We name the price for your scope up front."],
        ["Duration", "1 day"],
        ["Group", "Up to 12 people"],
        ["Prerequisite", "A Microsoft 365 Copilot licence and a Microsoft 365 sign-in for every participant"],
        ["Delivery", "Live online, via Microsoft Teams or Zoom by agreement"],
        ["Language", "English or German"],
        ["Date", "By agreement, as a closed session for your team"],
        ["Led by", "A freelance trainer we have selected, or OpSolid itself. We name the person before you book."],
        ["Proof", "Participation record from OpSolid"],
      ],
    },
    {
      t: "situations",
      id: "fuer-wen",
      label: "For whom",
      note: "For teams with Copilot licences.",
      h: "For teams that have Copilot and want to use it.",
      lede: "The workshop helps when Copilot is switched on but has not yet made it into daily work.",
      cta: { label: "Clarify first: the AI check", to: "check" },
      items: [
        { h: "The licences are there, the use is not.", p: "Copilot is enabled, but not yet part of daily work." },
        { h: "Nobody knows which tasks are worth it.", p: "There is no feel for what Copilot is good for and what it is not." },
        { h: "There are worries about permissions and confidential content.", p: "What does Copilot see, what may I enter? The team has no answers." },
        { h: "Inbox and meetings take up a lot of time.", p: "Summarising, follow-up and first drafts are tasks where an assistant can take work off your hands." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Day plan",
      note: "Six blocks through the day.",
      h: "What happens during the day.",
      lede: "Six blocks, each on tasks from your daily work. We adjust the order with you beforehand.",
      items: [
        { h: "Starting point", p: "We clarify which tasks your team has and how Copilot is set up at your company." },
        { h: "Outlook and Teams", p: "Summarise and answer email threads, prepare and follow up meetings." },
        { h: "Word and PowerPoint", p: "Draft, revise and shorten text. Build presentations from existing material." },
        { h: "Excel", p: "Have data explained, prepare analyses and check the results." },
        { h: "Asking well and checking", p: "Describe tasks so the draft becomes usable, and check results before they are passed on." },
        { h: "Your workflows", p: "Each person notes which workflows they will support with Copilot from now on." },
      ],
    },
    {
      t: "examples",
      id: "anwendungsfaelle",
      label: "Use cases",
      note: "Example scenarios, not client projects.",
      h: "What Copilot can take off your plate.",
      lede: "Four typical tasks we practise on. In each of them, the decision stays with your team.",
      tag: "Example scenario",
      cta: { label: "To the Microsoft 365 page", to: "m365" },
      items: [
        {
          area: "Outlook",
          h: "Long email threads",
          before: "Long threads are read in full to find the open question.",
          after: "Copilot summarises the thread and drafts a reply.",
          human: "You read the draft, adjust it and send it yourself.",
        },
        {
          area: "Teams",
          h: "Following up meetings",
          before: "After the meeting, someone writes the minutes and open points by hand.",
          after: "With transcription enabled, Copilot summarises the meeting and suggests tasks.",
          human: "The team checks the summary and tasks before they are assigned.",
        },
        {
          area: "Word & PowerPoint",
          h: "First versions of texts and slides",
          before: "First versions start from a blank page.",
          after: "Copilot drafts a first version from existing documents.",
          human: "A person checks content, figures and tone.",
        },
        {
          area: "Excel",
          h: "Preparing analyses",
          before: "Formulas and analyses are built laboriously by hand.",
          after: "Copilot explains data, suggests formulas and prepares analyses.",
          human: "Results are checked against the source data.",
        },
      ],
    },
    {
      t: "text",
      id: "datenschutz",
      label: "Data protection",
      note: "Neutral context, not legal advice.",
      h: "Data and permissions in Microsoft 365.",
      lede: "According to Microsoft, Copilot only accesses content that the person already has access to.",
      cta: { label: "To AI consulting", to: "beratung" },
      paras: [
        "For safe use, that means clean permissions in SharePoint, Teams and OneDrive are the foundation. Anyone who is allowed to see too much can also find it through Copilot.",
        "During the workshop we show how to review shares and which content is better kept out of a prompt. We do not change the settings of your Microsoft 365 tenant.",
        "The data protection assessment for your company is made by your data protection officer. We do not give legal advice. If you want to roll out Copilot company-wide or tidy up permissions, that is a topic for our AI consulting on Microsoft 365.",
      ],
    },
    {
      t: "rows",
      id: "vorbereitung",
      label: "Preparation",
      note: "Three things beforehand.",
      h: "How to prepare.",
      lede: "We send you a short checklist beforehand. The essentials in three points.",
      items: [
        { h: "Check licences and sign-in.", p: "All participants need a Copilot licence and must be able to sign in to Microsoft 365. We do not sell licences." },
        { h: "Collect tasks.", p: "We ask for a few typical tasks from your daily work. We build the exercises from them." },
        { h: "Keep confidential material out.", p: "We practise with sample content or with material you explicitly release for the purpose." },
      ],
    },
  ],
  faq: {
    label: "Common questions",
    h: "Common questions about the Copilot workshop.",
    items: [
      {
        q: "Do we need Copilot licences?",
        a: "Yes. All participants need a Microsoft 365 Copilot licence. We do not sell licences; you get them from Microsoft or your Microsoft partner.",
      },
      {
        q: "What does “from €2,400” mean?",
        a: "The price covers one day with up to 12 people. If your scope differs, we name the price before you book. All prices net of VAT, businesses only.",
      },
      {
        q: "Will you change our Microsoft 365 settings?",
        a: "No. The workshop is training. Rolling out Copilot company-wide or tidying up permissions is a consulting topic.",
      },
      {
        q: "Does the workshop run in English?",
        a: "Yes. It runs in English or German. Tell us your team’s language when you enquire.",
      },
      {
        q: "Who teaches the workshop?",
        a: "A freelance trainer we have selected, or OpSolid itself. We name the person before you book.",
      },
      {
        q: "Do we get proof of participation?",
        a: "Yes, a participation record from OpSolid with date, duration, topics and trainer. A certificate is not required.",
      },
      {
        q: "Is the workshop a measure under Article 4 of the AI Act?",
        a: "Companies that use AI take measures to support the AI literacy of their staff. The workshop can be one of them. No certificate is required. We do not give legal advice.",
      },
    ],
  },
  cta: {
    label: "Request the workshop",
    h: "What should your team use Copilot for first?",
    p: "Tell us briefly about team size, language and tasks. We come back with a proposal and name the trainer before you book.",
    primary: { label: "Request the workshop", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "To the Microsoft 365 page", to: "m365" },
  },
  schema: {
    courses: [
      {
        name: "Microsoft 365 Copilot workshop",
        description:
          "Online hands-on day for teams: Microsoft 365 Copilot in Outlook, Teams, Word, Excel and PowerPoint on your own tasks. 1 day, up to 12 people, live in English or German.",
        price: 2400,
        from: true,
      },
    ],
  },
};

const tr: PageDef = {
  key: "copilot",
  meta: {
    title: "Microsoft 365 Copilot Uygulama Günü: ekipler için",
    description:
      "Copilot Uygulama Günü: 1 gün, canlı çevrimiçi, en fazla 12 kişi, 2.400 €'dan itibaren (net). Outlook, Teams, Word, Excel ve PowerPoint'te uygulamalı.",
  },
  crumbs: ["schulungen"],
  crumb: "Copilot Uygulama Günü",
  hero: {
    eyebrow: "YZ eğitimi · 1 gün · canlı çevrimiçi",
    h1: ["Microsoft 365 Copilot: ", "bir gün uygulama", ", kendi görevlerinizle."],
    lede: "Ekibinizin Outlook, Teams, Word, Excel ve PowerPoint'te Copilot'u günlük işinden görevlerde kullandığı bir gün. Canlı çevrimiçi, en fazla 12 kişi için, 2.400 €'dan itibaren (net).",
    primary: { label: "Uygulama gününü talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Gün planına bakın", to: "copilot", hash: "ablauf" },
    facts: ["2.400 €'dan itibaren (net)", "1 gün · en fazla 12 kişi", "Copilot lisansı gerekir"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Taslak: girişten kurallar ve taslak üzerinden karar veren kişiye uzanan dört istasyon",
      caption: "Copilot taslak hazırlar. Ekibiniz karar verir.",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "spec",
      id: "eckdaten",
      label: "Temel bilgiler",
      h: "Uygulama günü neleri kapsar?",
      lede: "Ekibiniz için 2.400 €'dan itibaren (net), tam bir gün. Ön koşul, tüm katılımcılar için Microsoft 365 Copilot lisansıdır.",
      rows: [
        ["Fiyat", "2.400 €'dan itibaren (net), KDV hariç; yalnızca işletmeler için. Kapsamınıza göre fiyatı önceden bildiririz."],
        ["Süre", "1 gün"],
        ["Grup", "En fazla 12 kişi"],
        ["Ön koşul", "Her katılımcı için Microsoft 365 Copilot lisansı ve Microsoft 365 girişi"],
        ["Uygulama", "Canlı çevrimiçi; anlaşmaya göre Microsoft Teams veya Zoom"],
        ["Dil", "Almanca veya İngilizce"],
        ["Tarih", "Anlaşmaya göre, ekibinize özel kapalı oturum olarak"],
        ["Yürüten", "Bizim seçtiğimiz serbest çalışan bir eğitmen ya da OpSolid'in kendisi. Adını rezervasyondan önce bildiririz."],
        ["Belge", "OpSolid katılım belgesi"],
      ],
    },
    {
      t: "situations",
      id: "fuer-wen",
      label: "Kimin için",
      note: "Copilot lisansı olan ekipler için.",
      h: "Copilot'u olan ve kullanmak isteyen ekipler için.",
      lede: "Copilot açılmış ama günlük işe henüz girmemişse uygulama günü yardımcı olur.",
      cta: { label: "Önce netleştirin: YZ Kontrolü", to: "check" },
      items: [
        { h: "Lisanslar var, kullanım yok.", p: "Copilot açık, ancak günlük işe henüz yerleşmemiş." },
        { h: "Hangi görevlerin değerli olduğunu kimse bilmiyor.", p: "Copilot'un neye yaradığına, neye yaramadığına dair bir his oluşmamış." },
        { h: "Yetkiler ve gizli içerikler konusunda kaygılar var.", p: "Copilot neyi görür, ben ne girebilirim? Ekipte bu soruların cevabı yok." },
        { h: "Posta kutusu ve toplantılar çok zaman alıyor.", p: "Özetleme, toplantı sonrası işler ve ilk taslaklar, bir asistanın yük alabileceği görevlerdir." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Gün planı",
      note: "Gün boyunca altı blok.",
      h: "O gün neler olur?",
      lede: "Her biri günlük işinizden görevlerle altı blok. Sırayı önceden sizinle birlikte ayarlarız.",
      items: [
        { h: "Başlangıç durumu", p: "Ekibinizin hangi görevleri olduğunu ve Copilot'un sizde nasıl kurulduğunu netleştiririz." },
        { h: "Outlook ve Teams", p: "E-posta yazışmalarını özetlemek ve yanıtlamak, toplantılara hazırlanmak ve toplantı sonrası işleri yürütmek." },
        { h: "Word ve PowerPoint", p: "Metin taslağı yazmak, düzeltmek ve kısaltmak. Mevcut belgelerden sunum oluşturmak." },
        { h: "Excel", p: "Verileri açıklatmak, analizleri hazırlamak ve sonuçları kontrol etmek." },
        { h: "İyi istek yazmak ve kontrol etmek", p: "Görevi, taslağın işe yarayacağı şekilde tarif etmek ve sonuçları iletmeden önce kontrol etmek." },
        { h: "Sizin iş akışlarınız", p: "Herkes, bundan sonra hangi işlerini Copilot ile destekleyeceğini not eder." },
      ],
    },
    {
      t: "examples",
      id: "anwendungsfaelle",
      label: "Kullanım örnekleri",
      note: "Örnek senaryolar, müşteri projesi değildir.",
      h: "Copilot günlük işte neleri hafifletebilir?",
      lede: "Üzerinde çalıştığımız dört tipik görev. Hepsinde karar ekibinizde kalır.",
      tag: "Örnek senaryo",
      cta: { label: "Microsoft 365 sayfasına gidin", to: "m365" },
      items: [
        {
          area: "Outlook",
          h: "Uzun e-posta yazışmaları",
          before: "Açık soruyu bulmak için uzun yazışmaların hepsi okunur.",
          after: "Copilot yazışmayı özetler ve bir yanıt taslağı hazırlar.",
          human: "Taslağı siz okur, düzeltir ve kendiniz gönderirsiniz.",
        },
        {
          area: "Teams",
          h: "Toplantı sonrası işler",
          before: "Toplantıdan sonra biri tutanağı ve açık maddeleri elle yazar.",
          after: "Transkripsiyon açıksa Copilot toplantıyı özetler ve görevler önerir.",
          human: "Ekip, özeti ve görevleri dağıtmadan önce kontrol eder.",
        },
        {
          area: "Word ve PowerPoint",
          h: "Metin ve slaytların ilk sürümleri",
          before: "İlk sürümler boş sayfadan başlar.",
          after: "Copilot mevcut belgelerden bir ilk sürüm hazırlar.",
          human: "İçeriği, rakamları ve üslubu bir kişi kontrol eder.",
        },
        {
          area: "Excel",
          h: "Analizleri hazırlamak",
          before: "Formüller ve analizler zahmetle elle hazırlanır.",
          after: "Copilot verileri açıklar, formül önerir ve analizleri hazırlar.",
          human: "Sonuçlar kaynak verilerle karşılaştırılarak kontrol edilir.",
        },
      ],
    },
    {
      t: "text",
      id: "datenschutz",
      label: "Veri koruma",
      note: "Tarafsız bilgi, hukuki danışmanlık değildir.",
      h: "Microsoft 365'te veriler ve yetkiler.",
      lede: "Microsoft'a göre Copilot yalnızca ilgili kişinin zaten erişebildiği içeriklere erişir.",
      cta: { label: "YZ danışmanlığına gidin", to: "beratung" },
      paras: [
        "Güvenli kullanım için bu şu anlama gelir: SharePoint, Teams ve OneDrive'daki düzgün yetkiler temeldir. Fazlasını görmeye yetkili biri, onu Copilot üzerinden de bulabilir.",
        "Uygulama gününde paylaşımların nasıl kontrol edileceğini ve hangi içeriklerin isteğe girmemesinin daha iyi olduğunu gösteririz. Microsoft 365 kiracınızın ayarlarını değiştirmeyiz.",
        "Şirketiniz için veri koruma değerlendirmesini veri koruma görevliniz yapar. Hukuki danışmanlık vermiyoruz. Copilot'u şirket genelinde devreye almak ya da yetkileri düzenlemek istiyorsanız, bu Microsoft 365 konusundaki YZ danışmanlığımızın alanıdır.",
      ],
    },
    {
      t: "rows",
      id: "vorbereitung",
      label: "Hazırlık",
      note: "Önceden üç şey.",
      h: "Nasıl hazırlanırsınız?",
      lede: "Önceden kısa bir kontrol listesi göndeririz. Önemli olanlar üç maddede.",
      items: [
        { h: "Lisansları ve girişi kontrol edin.", p: "Tüm katılımcıların bir Copilot lisansı olmalı ve Microsoft 365'e giriş yapabilmeli. Lisans satmıyoruz." },
        { h: "Görevleri toplayın.", p: "Günlük işinizden birkaç tipik görev isteriz. Alıştırmaları bunlardan hazırlarız." },
        { h: "Gizli içeriği dışarıda bırakın.", p: "Örnek içeriklerle ya da sizin bu amaçla açıkça paylaştığınız materyalle çalışırız." },
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Copilot Uygulama Günü hakkında sık sorulan sorular.",
    items: [
      {
        q: "Copilot lisansı gerekli mi?",
        a: "Evet. Tüm katılımcıların bir Microsoft 365 Copilot lisansı olmalı. Lisans satmıyoruz; lisansları Microsoft'tan ya da Microsoft iş ortağınızdan alırsınız.",
      },
      {
        q: "“2.400 €'dan itibaren” ne demek?",
        a: "Fiyat, en fazla 12 kişilik bir gün için geçerlidir. Kapsamınız farklıysa fiyatı rezervasyondan önce bildiririz. Tüm fiyatlar net, KDV hariç; yalnızca işletmeler için.",
      },
      {
        q: "Microsoft 365 ayarlarımızı değiştirir misiniz?",
        a: "Hayır. Uygulama günü bir eğitimdir. Copilot'u şirket genelinde devreye almak ya da yetkileri düzenlemek danışmanlık konusudur.",
      },
      {
        q: "Uygulama günü İngilizce de yapılıyor mu?",
        a: "Evet. Almanca veya İngilizce yapılır. Talep ederken ekibinizin dilini belirtmeniz yeterli.",
      },
      {
        q: "Uygulama gününü kim veriyor?",
        a: "Bizim seçtiğimiz serbest çalışan bir eğitmen ya da OpSolid'in kendisi. Adını rezervasyondan önce bildiririz.",
      },
      {
        q: "Belge alıyor muyuz?",
        a: "Evet; tarih, süre, konular ve eğitmeni içeren bir OpSolid katılım belgesi. Sertifika zorunlu değildir.",
      },
      {
        q: "Uygulama günü, YZ Tüzüğü'nün 4. maddesi kapsamında bir önlem midir?",
        a: "YZ kullanan şirketler, çalışanlarının YZ yetkinliğini desteklemek için önlemler alır. Uygulama günü bunlardan biri olabilir. Sertifika zorunlu değildir. Hukuki danışmanlık vermiyoruz.",
      },
    ],
  },
  cta: {
    label: "Uygulama gününü talep edin",
    h: "Ekibiniz Copilot'u ilk olarak ne için kullanmalı?",
    p: "Ekip büyüklüğü, dil ve görevler hakkında kısaca yazın. Bir teklifle döneriz ve eğitmeni rezervasyondan önce bildiririz.",
    primary: { label: "Uygulama gününü talep edin", to: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Microsoft 365 sayfasına gidin", to: "m365" },
  },
  schema: {
    courses: [
      {
        name: "Microsoft 365 Copilot Uygulama Günü",
        description:
          "Ekipler için çevrimiçi uygulama günü: Outlook, Teams, Word, Excel ve PowerPoint'te Microsoft 365 Copilot, kendi görevleriniz üzerinde. 1 gün, en fazla 12 kişi, Almanca veya İngilizce canlı.",
        price: 2400,
        from: true,
      },
    ],
  },
};

export const page: PageSet = { de, en, tr };
