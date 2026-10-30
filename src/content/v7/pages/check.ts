/**
 * KI-Check (entry offer, best conversion page). German is the source; EN and TR are transcreations.
 * Published price: ab 990 € netto. The extended scope carries no number: "Festpreis, vorab schriftlich".
 * The "free first three checks" pilot note is gone (owner default 2026-10-29).
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "check",
  meta: {
    title: "KI-Check ab 990 € netto: wo sich Automatisierung lohnt",
    description:
      "Der KI-Check zeigt, welche Abläufe sich automatisieren lassen: 90 Minuten remote, schriftlicher Kurzbericht, NDA vor der Analyse, ab 990 € netto.",
  },
  crumbs: ["beratung"],
  crumb: "KI-Check",
  hero: {
    eyebrow: "KI-Check · der erste Schritt",
    h1: ["Wo sich Automatisierung ", "wirklich", " lohnt"],
    lede: "Der KI-Check zeigt, welche Ihrer Abläufe sich automatisieren lassen und welche besser bleiben, wie sie sind. Sie erhalten einen schriftlichen Kurzbericht, auch dann, wenn nichts zu automatisieren lohnt.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Ablauf ansehen", to: "check", hash: "ablauf" },
    facts: ["KI-Check ab 990 € netto", "90 Minuten remote plus schriftlicher Kurzbericht", "NDA vor der Analyse", "Bericht auch ohne Empfehlung"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Skizze: ineinander liegende abgerundete Quadrate über einem Ablauf in vier Stationen: Betrieb, Abläufe, Auswahl, Bericht",
      caption: "Vom ganzen Betrieb zu dem einen Ablauf, der sich lohnt.",
      fig: "0.1",
      labels: ["Betrieb", "Abläufe", "Auswahl", "Bericht"],
    },
  },
  blocks: [
    {
      t: "spec",
      id: "ueberblick",
      label: "Überblick",
      h: "Der KI-Check im Überblick",
      rows: [
        ["Format", "Gespräch per Videokonferenz mit den Menschen, die die Arbeit machen; im erweiterten Umfang als Workshop, auch vor Ort"],
        ["Dauer", "90 Minuten im Einstieg"],
        ["Ergebnis", "Ein kurzer schriftlicher Bericht: welche Abläufe sich automatisieren lassen, welche nicht, und warum"],
        ["Preis", "Ab 990 € netto. Den genauen Preis nennen wir nach einem kurzen Vorgespräch, bevor Sie zusagen. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an. Erweiterter Umfang: Festpreis, vorab schriftlich"],
        ["Vertraulichkeit", "Eine NDA unterzeichnen wir vor dem Analysegespräch"],
      ],
      footnote: "Alle Preise netto zzgl. USt., nur für Unternehmen.",
    },
    {
      t: "process",
      id: "ablauf",
      label: "Ablauf",
      h: "Vom Vorgespräch zur Entscheidung",
      lede: "Nach jedem Schritt wissen Sie, woran Sie sind.",
      steps: [
        {
          name: "Vorbereitung",
          h: "Vorgespräch und NDA",
          p: "Wir klären kurz Ziele, betroffene Abläufe und Umfang. Danach unterzeichnen wir die NDA und nennen Ihnen den Preis.",
          result: "Umfang und Preis stehen schriftlich fest.",
          meta: "vor der Analyse",
        },
        {
          name: "Gespräch",
          h: "Analysegespräch",
          p: "90 Minuten remote mit den Menschen, die die Arbeit tatsächlich machen. Wir fragen nach dem, was wirklich passiert, nicht nach dem Soll.",
          result: "Die wichtigsten Abläufe sind aufgenommen.",
          meta: "90 Minuten",
        },
        {
          name: "Bericht",
          h: "Schriftliches Ergebnis",
          p: "Ein kurzer Bericht: welche Abläufe sich automatisieren lassen, welche nicht und warum. Im erweiterten Umfang folgen zusätzlich Prozesskarte und 30-Tage-Plan.",
          result: "Sie sehen schwarz auf weiß, was sich lohnt.",
          meta: "kurz und schriftlich",
        },
        {
          name: "Entscheidung",
          h: "Ihr nächster Schritt",
          p: "Im erweiterten Umfang besprechen wir den Plan in 30 Minuten. Dann entscheiden Sie: selbst umsetzen, mit uns pilotieren oder es dabei belassen.",
          result: "Eine Entscheidung auf Basis von Fakten.",
          meta: "ohne Verpflichtung",
        },
      ],
    },
    {
      t: "offers",
      id: "umfang",
      label: "Umfang",
      h: "Kompakt starten, bei Bedarf erweitern",
      lede: "Der Einstieg genügt für eine erste Einschätzung. Mehr Tiefe gibt es zum Festpreis.",
      items: [
        {
          name: "Einstieg",
          price: "ab 990 € netto",
          unit: "90 Minuten remote",
          p: "Eine erste Einschätzung gemeinsam mit den Menschen, die die Arbeit machen. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an.",
          points: [
            "Analysegespräch von 90 Minuten, remote",
            "Kurzer schriftlicher Bericht: wo KI und Automatisierung sinnvoll sind und wo nicht",
            "NDA vor der Analyse",
          ],
          href: { label: "Einstieg anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
          featured: true,
        },
        {
          name: "Erweitert",
          price: "Festpreis",
          unit: "vorab schriftlich",
          p: "Mehr Tiefe für mehrere Abläufe: ein Workshop, vor Ort oder remote, und ein konkreter Plan.",
          points: [
            "Workshop und Aufnahme der wichtigsten Abläufe",
            "Prozesskarte und fünf bewertete Kandidaten",
            "30-Tage-Plan und 30 Minuten Besprechung",
          ],
          href: { label: "Erweiterten Umfang anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
        },
      ],
      footnote: "Alle Preise netto zzgl. USt., nur für Unternehmen. Wir prüfen mit Ihnen, welche Förderung zu Ihrem Vorhaben passt.",
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Leitsatz",
      text: "Bericht auch ohne Empfehlung",
    },
    {
      t: "sample",
      id: "muster",
      label: "Muster",
      h: "Ein Auszug aus dem erweiterten Bericht",
      lede: "Im erweiterten Umfang bewerten wir fünf Kandidaten aus Ihren echten Abläufen nach Nutzen, Aufwand und Risiko.",
      mark: "Muster",
      title: "Bewertete Kandidaten (Auszug)",
      meta: "Dienstleistungsunternehmen, fiktives Beispiel",
      rows: [
        ["Eingehende Anfragen sortieren", "Nutzen hoch · Aufwand gering"],
        ["Angebotsentwurf aus Vorlage", "Nutzen hoch · Aufwand mittel"],
        ["Terminbestätigungen versenden", "Nutzen mittel · Aufwand gering"],
        ["Rechnungen auslesen", "Nutzen mittel · Risiko mittel"],
        ["Reklamationen beantworten", "Manuell lassen"],
      ],
      foot: "Ein echter Bericht enthält Ihre Abläufe, eine Werkzeugempfehlung, eine grobe Aufwandsschätzung und den 30-Tage-Plan mit Verantwortlichen.",
    },
    {
      t: "situations",
      id: "fuer-wen",
      label: "Für wen",
      h: "Für wen der KI-Check passt",
      lede: "Er passt, wenn Sie vor einer Entscheidung stehen und Fakten statt Versprechen wollen.",
      items: [
        {
          h: "Sie suchen einen messbaren ersten Schritt",
          p: "Statt eines großen Plattformprojekts wollen Sie wissen, welcher einzelne Ablauf sich zuerst lohnt.",
        },
        {
          h: "Ihr Team nutzt KI schon, ohne Regeln",
          p: "Einzelne arbeiten mit KI-Werkzeugen. Gemeinsame Regeln und eine Struktur fehlen noch.",
        },
        {
          h: "Sie stehen vor einer Kaufentscheidung",
          p: "Sie wägen Microsoft 365, Power Automate oder Make ab und wollen vorher wissen, wofür Sie es brauchen.",
        },
        {
          h: "Eher nicht geeignet: Gesundheitsdaten",
          p: "Abläufe mit Gesundheitsdaten nehmen wir nicht auf. In Praxen betrachten wir nur organisatorische Abläufe.",
        },
      ],
    },
    {
      t: "rows",
      id: "danach",
      label: "Danach",
      h: "Was nach dem KI-Check passiert",
      lede: "Drei Wege, alle gleichwertig.",
      items: [
        {
          h: "Selbst umsetzen",
          tag: "Weg 1",
          p: "Sie nehmen den Bericht und setzen die Empfehlungen mit Ihrem Team oder Ihrem IT-Dienstleister um.",
        },
        {
          h: "Gemeinsam pilotieren",
          tag: "Weg 2",
          p: "Wir bauen einen der Abläufe als Pilot. Umfang und Festpreis stehen vorab schriftlich fest.",
          href: { label: "Mehr zur KI-Beratung", to: "beratung" },
        },
        {
          h: "Es dabei belassen",
          tag: "Weg 3",
          p: "Die Zusammenarbeit endet hier. Sie müssen nichts weiter tun.",
        },
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Fragen zum KI-Check",
    items: [
      {
        q: "Was kostet der KI-Check?",
        a: "Der Einstieg kostet ab 990 € netto: 90 Minuten remote und ein kurzer schriftlicher Bericht. Den Preis nennen wir nach einem kurzen Vorgespräch. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an. Für den erweiterten Umfang mit Workshop, Prozesskarte und 30-Tage-Plan nennen wir den Festpreis vorab schriftlich. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Wird eine Vertraulichkeitsvereinbarung geschlossen?",
        a: "Ja. Wir unterzeichnen eine NDA vor der Analyse, also bevor wir über Ihre Abläufe sprechen.",
      },
      {
        q: "Was, wenn sich nichts zu automatisieren lohnt?",
        a: "Dann steht genau das im Bericht, mit Begründung. Den Bericht erhalten Sie trotzdem.",
      },
      {
        q: "Wer nimmt am Gespräch teil?",
        a: "Am besten die Menschen, die den Ablauf täglich ausführen, und eine Person, die über Änderungen entscheiden darf. Das Gespräch führt OpSolid.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Finden Sie heraus, was sich lohnt",
    p: "Ein Gespräch, ein schriftliches Ergebnis, keine Bindung.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
  },
  schema: {
    service: {
      name: "KI-Check",
      serviceType: "KI-Beratung",
      description:
        "Einstiegsanalyse für Unternehmen: 90 Minuten remote, kurzer schriftlicher Bericht, NDA vorab. Erweiterter Umfang mit Workshop, Prozesskarte und 30-Tage-Plan zum Festpreis.",
      offers: [{ name: "KI-Check", price: 990, from: true }],
    },
  },
};

const en: PageDef = {
  key: "check",
  meta: {
    title: "AI check from €990 net: where automation pays off",
    description:
      "The AI check shows which workflows can be automated: 90 minutes remote, short written report, NDA before the analysis, from €990 net. No obligation afterwards.",
  },
  crumbs: ["beratung"],
  crumb: "AI check",
  hero: {
    eyebrow: "AI check · the first step",
    h1: ["Where automation ", "really", " pays off"],
    lede: "The AI check shows which of your workflows can be automated and which are better left as they are. You receive a short written report, even if nothing is worth automating.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "See how it works", to: "check", hash: "ablauf" },
    facts: ["AI check from €990 net", "90 minutes remote plus a short written report", "NDA before the analysis", "Report even without a recommendation"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Sketch: nested rounded squares above a workflow in four stations: business, workflows, shortlist, report",
      caption: "From the whole business to the one workflow that is worth it.",
      fig: "0.1",
      labels: ["Business", "Workflows", "Shortlist", "Report"],
    },
  },
  blocks: [
    {
      t: "spec",
      id: "ueberblick",
      label: "Overview",
      h: "The AI check at a glance",
      rows: [
        ["Format", "A video conversation with the people who do the work; in the extended scope as a workshop, also on site"],
        ["Duration", "90 minutes for the entry scope"],
        ["Result", "A short written report: which workflows can be automated, which cannot, and why"],
        ["Price", "From €990 net. We confirm the exact price after a short preliminary call, before you commit. Credited in full against a follow-up order within 60 days. Extended scope: fixed price, agreed in writing first"],
        ["Confidentiality", "We sign an NDA before the analysis call"],
      ],
      footnote: "All prices are net of VAT and for businesses only.",
    },
    {
      t: "process",
      id: "ablauf",
      label: "Process",
      h: "From the preliminary call to a decision",
      lede: "After each step you know where you stand.",
      steps: [
        {
          name: "Preparation",
          h: "Preliminary call and NDA",
          p: "We briefly clarify goals, affected workflows and scope. Then we sign the NDA and tell you the price.",
          result: "Scope and price are fixed in writing.",
          meta: "before the analysis",
        },
        {
          name: "Conversation",
          h: "Analysis call",
          p: "90 minutes remote with the people who actually do the work. We ask about what really happens, not about what should happen.",
          result: "The key workflows are recorded.",
          meta: "90 minutes",
        },
        {
          name: "Report",
          h: "Written result",
          p: "A short report: which workflows can be automated, which cannot, and why. In the extended scope, a process map and a 30-day plan follow as well.",
          result: "You see in black and white what is worth it.",
          meta: "short and in writing",
        },
        {
          name: "Decision",
          h: "Your next step",
          p: "In the extended scope we go through the plan in 30 minutes. Then you decide: implement yourself, pilot with us, or leave it there.",
          result: "A decision based on facts.",
          meta: "no obligation",
        },
      ],
    },
    {
      t: "offers",
      id: "umfang",
      label: "Scope",
      h: "Start compact, extend if needed",
      lede: "The entry scope is enough for a first assessment. More depth comes at a fixed price.",
      items: [
        {
          name: "Entry",
          price: "from €990 net",
          unit: "90 minutes remote",
          p: "A first assessment together with the people who do the work. Credited in full against a follow-up order within 60 days.",
          points: [
            "Analysis call of 90 minutes, remote",
            "Short written report: where AI and automation make sense and where they do not",
            "NDA before the analysis",
          ],
          href: { label: "Request the entry scope", to: "kontakt", query: { anliegen: "ki-check" } },
          featured: true,
        },
        {
          name: "Extended",
          price: "Fixed price",
          unit: "in writing first",
          p: "More depth for several workflows: a workshop, on site or remote, and a concrete plan.",
          points: [
            "Workshop and recording of the key workflows",
            "Process map and five rated candidates",
            "30-day plan and a 30-minute review",
          ],
          href: { label: "Request the extended scope", to: "kontakt", query: { anliegen: "ki-check" } },
        },
      ],
      footnote: "All prices are net of VAT and for businesses only. We check with you which funding fits your project.",
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Key point",
      text: "A report even without a recommendation",
    },
    {
      t: "sample",
      id: "muster",
      label: "Sample",
      h: "An excerpt from the extended report",
      lede: "In the extended scope we rate five candidates from your real workflows by benefit, effort and risk.",
      mark: "Sample",
      title: "Rated candidates (excerpt)",
      meta: "Service company, fictional example",
      rows: [
        ["Sort incoming enquiries", "Benefit high · Effort low"],
        ["Draft a quote from a template", "Benefit high · Effort medium"],
        ["Send appointment confirmations", "Benefit medium · Effort low"],
        ["Read invoices", "Benefit medium · Risk medium"],
        ["Answer complaints", "Keep manual"],
      ],
      foot: "A real report contains your workflows, a tool recommendation, a rough effort estimate and the 30-day plan with owners.",
    },
    {
      t: "situations",
      id: "fuer-wen",
      label: "Who it is for",
      h: "Who the AI check suits",
      lede: "It suits you if you face a decision and want facts instead of promises.",
      items: [
        {
          h: "You want a measurable first step",
          p: "Instead of a large platform project, you want to know which single workflow is worth doing first.",
        },
        {
          h: "Your team already uses AI, without rules",
          p: "Some people work with AI tools. Shared rules and a structure are still missing.",
        },
        {
          h: "You are facing a purchase decision",
          p: "You are weighing up Microsoft 365, Power Automate or Make and want to know beforehand what you need it for.",
        },
        {
          h: "Less suited: health data",
          p: "We do not record workflows that involve health data. For practices we look at organisational workflows only.",
        },
      ],
    },
    {
      t: "rows",
      id: "danach",
      label: "Afterwards",
      h: "What happens after the AI check",
      lede: "Three ways, all equal.",
      items: [
        {
          h: "Implement it yourself",
          tag: "Way 1",
          p: "You take the report and implement the recommendations with your team or your IT provider.",
        },
        {
          h: "Pilot together",
          tag: "Way 2",
          p: "We build one of the workflows as a pilot. Scope and fixed price are set in writing beforehand.",
          href: { label: "More about AI consulting", to: "beratung" },
        },
        {
          h: "Leave it there",
          tag: "Way 3",
          p: "The collaboration ends here. You have nothing more to do.",
        },
      ],
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Questions about the AI check",
    items: [
      {
        q: "What does the AI check cost?",
        a: "The entry scope costs from €990 net: 90 minutes remote and a short written report. We name the price after a short preliminary call. Credited in full against a follow-up order within 60 days. For the extended scope with workshop, process map and 30-day plan, we name the fixed price in writing beforehand. All prices are net of VAT and for businesses only.",
      },
      {
        q: "Is a confidentiality agreement signed?",
        a: "Yes. We sign an NDA before the analysis, that is, before we talk about your workflows.",
      },
      {
        q: "What if nothing is worth automating?",
        a: "Then the report says exactly that, with reasons. You still receive the report.",
      },
      {
        q: "Who takes part in the call?",
        a: "Ideally the people who carry out the workflow every day, and one person who can decide on changes. OpSolid leads the call.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Find out what is worth it",
    p: "One conversation, one written result, no obligation.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "To AI consulting", to: "beratung" },
  },
  schema: {
    service: {
      name: "AI check",
      serviceType: "AI consulting",
      description:
        "Entry analysis for companies: 90 minutes remote, short written report, NDA beforehand. Extended scope with workshop, process map and 30-day plan at a fixed price.",
      offers: [{ name: "AI check", price: 990, from: true }],
    },
  },
};

const tr: PageDef = {
  key: "check",
  meta: {
    title: "YZ Kontrolü 990 €'dan itibaren: otomasyon nerede işe yarar?",
    description:
      "YZ Kontrolü hangi iş akışlarının otomatikleştirilebileceğini gösterir: 90 dakika uzaktan, kısa yazılı rapor, önceden NDA, 990 €'dan (net). Yükümlülük yok.",
  },
  crumbs: ["beratung"],
  crumb: "YZ Kontrolü",
  hero: {
    eyebrow: "YZ Kontrolü · ilk adım",
    h1: ["Otomasyon ", "nerede", " gerçekten karşılığını verir?"],
    lede: "YZ Kontrolü, hangi iş akışlarınızın otomatikleştirilebileceğini, hangilerinin olduğu gibi kalmasının daha iyi olduğunu gösterir. Otomatikleştirmeye değer bir şey çıkmasa bile kısa bir yazılı rapor alırsınız.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Süreci görün", to: "check", hash: "ablauf" },
    facts: ["YZ Kontrolü 990 €'dan itibaren (net)", "90 dakika uzaktan görüşme ve kısa yazılı rapor", "Analizden önce NDA", "Öneri çıkmasa da rapor"],
    media: {
      kind: "svg",
      name: "squares",
      alt: "Çizim: iç içe yuvarlatılmış kareler ve dört istasyonlu bir akış: işletme, akışlar, seçim, rapor",
      caption: "Bütün işletmeden, değen o tek iş akışına.",
      fig: "0.1",
      labels: ["İşletme", "Akışlar", "Seçim", "Rapor"],
    },
  },
  blocks: [
    {
      t: "spec",
      id: "ueberblick",
      label: "Genel bakış",
      h: "YZ Kontrolü bir bakışta",
      rows: [
        ["Format", "İşi yapan kişilerle görüntülü görüşme; geniş kapsamda atölye olarak, isterseniz yerinde"],
        ["Süre", "Başlangıç kapsamında 90 dakika"],
        ["Sonuç", "Kısa bir yazılı rapor: hangi iş akışları otomatikleştirilebilir, hangileri değil ve neden"],
        ["Fiyat", "990 €'dan itibaren (net). Kesin fiyatı, karar vermeden önce kısa bir ön görüşmenin ardından bildiririz. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Geniş kapsam: sabit fiyat, önceden yazılı"],
        ["Gizlilik", "Analiz görüşmesinden önce bir NDA imzalarız"],
      ],
      footnote: "Tüm fiyatlar net, KDV hariçtir ve yalnızca işletmeler içindir.",
    },
    {
      t: "process",
      id: "ablauf",
      label: "Süreç",
      h: "Ön görüşmeden karara",
      lede: "Her adımdan sonra nerede olduğunuzu bilirsiniz.",
      steps: [
        {
          name: "Hazırlık",
          h: "Ön görüşme ve NDA",
          p: "Hedefleri, ilgili iş akışlarını ve kapsamı kısaca netleştiririz. Ardından NDA'yı imzalar ve fiyatı bildiririz.",
          result: "Kapsam ve fiyat yazılı olarak belli.",
          meta: "analizden önce",
        },
        {
          name: "Görüşme",
          h: "Analiz görüşmesi",
          p: "İşi gerçekten yapan kişilerle 90 dakika uzaktan. Olması gerekeni değil, gerçekte olanı sorarız.",
          result: "Önemli iş akışları kaydedildi.",
          meta: "90 dakika",
        },
        {
          name: "Rapor",
          h: "Yazılı sonuç",
          p: "Kısa bir rapor: hangi iş akışları otomatikleştirilebilir, hangileri değil ve neden. Geniş kapsamda ayrıca süreç haritası ve 30 günlük plan gelir.",
          result: "Neyin değdiğini siyah beyaz görürsünüz.",
          meta: "kısa ve yazılı",
        },
        {
          name: "Karar",
          h: "Sonraki adımınız",
          p: "Geniş kapsamda planı 30 dakikada birlikte gözden geçiririz. Sonra siz karar verirsiniz: kendiniz uygulamak, bizimle pilot yapmak ya da burada bırakmak.",
          result: "Gerçeklere dayanan bir karar.",
          meta: "yükümlülük yok",
        },
      ],
    },
    {
      t: "offers",
      id: "umfang",
      label: "Kapsam",
      h: "Küçük başlayın, gerekirse genişletin",
      lede: "İlk değerlendirme için başlangıç kapsamı yeterlidir. Daha fazla derinlik sabit fiyatla gelir.",
      items: [
        {
          name: "Başlangıç",
          price: "990 €'dan itibaren (net)",
          unit: "90 dakika uzaktan",
          p: "İşi yapan kişilerle birlikte yapılan ilk değerlendirme. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir.",
          points: [
            "90 dakikalık analiz görüşmesi, uzaktan",
            "Kısa yazılı rapor: YZ ve otomasyonun nerede anlamlı olduğu, nerede olmadığı",
            "Analizden önce NDA",
          ],
          href: { label: "Başlangıç kapsamını talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
          featured: true,
        },
        {
          name: "Geniş kapsam",
          price: "Sabit fiyat",
          unit: "önceden yazılı",
          p: "Birkaç iş akışı için daha fazla derinlik: yerinde veya uzaktan bir atölye ve somut bir plan.",
          points: [
            "Atölye ve önemli iş akışlarının kaydı",
            "Süreç haritası ve değerlendirilmiş beş aday",
            "30 günlük plan ve 30 dakikalık değerlendirme",
          ],
          href: { label: "Geniş kapsamı talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
        },
      ],
      footnote: "Tüm fiyatlar net, KDV hariçtir ve yalnızca işletmeler içindir. Projenize hangi teşvikin uyduğunu sizinle birlikte değerlendiririz.",
    },
    {
      t: "statement",
      id: "leitsatz",
      label: "Ana fikir",
      text: "Öneri çıkmasa bile rapor var",
    },
    {
      t: "sample",
      id: "muster",
      label: "Örnek",
      h: "Geniş kapsamlı rapordan bir özet",
      lede: "Geniş kapsamda, gerçek iş akışlarınızdan beş adayı fayda, efor ve riske göre değerlendiririz.",
      mark: "Örnek",
      title: "Değerlendirilen adaylar (özet)",
      meta: "Bir hizmet şirketi, kurgusal örnek",
      rows: [
        ["Gelen talepleri sıralamak", "Fayda yüksek · Efor düşük"],
        ["Şablondan teklif taslağı", "Fayda yüksek · Efor orta"],
        ["Randevu onaylarını göndermek", "Fayda orta · Efor düşük"],
        ["Faturaları okumak", "Fayda orta · Risk orta"],
        ["Şikâyetleri yanıtlamak", "Manuel kalsın"],
      ],
      foot: "Gerçek bir rapor sizin iş akışlarınızı, bir araç önerisini, kaba bir efor tahminini ve sorumluların yer aldığı 30 günlük planı içerir.",
    },
    {
      t: "situations",
      id: "fuer-wen",
      label: "Kimler için",
      h: "YZ Kontrolü kimlere uygun?",
      lede: "Bir kararın eşiğindeyseniz ve vaat yerine gerçek istiyorsanız size uygun.",
      items: [
        {
          h: "Ölçülebilir bir ilk adım arıyorsunuz",
          p: "Büyük bir platform projesi yerine, hangi tek iş akışının önce değdiğini bilmek istiyorsunuz.",
        },
        {
          h: "Ekibiniz YZ'yi kullanıyor, ama kural yok",
          p: "Bazı kişiler YZ araçlarıyla çalışıyor. Ortak kurallar ve bir yapı hâlâ eksik.",
        },
        {
          h: "Bir satın alma kararının eşiğindesiniz",
          p: "Microsoft 365, Power Automate veya Make'i tartıyorsunuz ve önce ne için gerektiğini bilmek istiyorsunuz.",
        },
        {
          h: "Pek uygun değil: sağlık verileri",
          p: "Sağlık verisi içeren iş akışlarını kaydetmeyiz. Muayenehanelerde yalnızca idari iş akışlarına bakarız.",
        },
      ],
    },
    {
      t: "rows",
      id: "danach",
      label: "Sonrası",
      h: "YZ Kontrolü'nden sonra ne olur?",
      lede: "Üç yol, hepsi eşit değerde.",
      items: [
        {
          h: "Kendiniz uygulayın",
          tag: "Yol 1",
          p: "Raporu alır, önerileri ekibinizle ya da BT hizmet sağlayıcınızla uygularsınız.",
        },
        {
          h: "Birlikte pilot yapın",
          tag: "Yol 2",
          p: "İş akışlarından birini pilot olarak kurarız. Kapsam ve sabit fiyat önceden yazılı olarak belirlenir.",
          href: { label: "YZ danışmanlığı hakkında", to: "beratung" },
        },
        {
          h: "Burada bırakın",
          tag: "Yol 3",
          p: "İş birliği burada biter. Yapmanız gereken başka bir şey kalmaz.",
        },
      ],
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "YZ Kontrolü hakkında sorular",
    items: [
      {
        q: "YZ Kontrolü ne kadar tutar?",
        a: "Başlangıç kapsamı 990 €'dan itibaren (net): 90 dakika uzaktan ve kısa bir yazılı rapor. Fiyatı kısa bir ön görüşmeden sonra bildiririz. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Atölye, süreç haritası ve 30 günlük plan içeren geniş kapsam için sabit fiyatı önceden yazılı olarak bildiririz. Tüm fiyatlar net, KDV hariçtir ve yalnızca işletmeler içindir.",
      },
      {
        q: "Gizlilik sözleşmesi yapılıyor mu?",
        a: "Evet. Analizden önce, yani iş akışlarınızı konuşmadan önce bir NDA imzalarız.",
      },
      {
        q: "Otomatikleştirmeye değer bir şey çıkmazsa ne olur?",
        a: "O zaman rapor tam olarak bunu gerekçesiyle söyler. Raporu yine alırsınız.",
      },
      {
        q: "Görüşmeye kimler katılır?",
        a: "En iyisi iş akışını her gün yürüten kişiler ve değişikliklere karar verebilecek bir kişi. Görüşmeyi OpSolid yürütür.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Neyin değdiğini öğrenin",
    p: "Bir görüşme, yazılı bir sonuç, yükümlülük yok.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "YZ danışmanlığına", to: "beratung" },
  },
  schema: {
    service: {
      name: "YZ Kontrolü",
      serviceType: "Yapay zeka danışmanlığı",
      description:
        "Şirketler için başlangıç analizi: 90 dakika uzaktan, kısa yazılı rapor, önceden NDA. Atölye, süreç haritası ve 30 günlük plan içeren geniş kapsam sabit fiyatla.",
      offers: [{ name: "YZ Kontrolü", price: 990, from: true }],
    },
  },
};

export const page: PageSet = { de, en, tr };
