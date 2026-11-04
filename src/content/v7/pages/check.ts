/**
 * KI-Check (entry offer, best conversion page). German is the source; EN and TR are transcreations.
 * Since 2026-11-04 (owner-approved strategy review) the check is written and meeting-free: 990 € netto as a
 * fixed price; questionnaire of about 20 minutes → report (in der Regel 10 Werktage) → optional 30-minute video
 * call on Wednesday or Friday, 18:30-20:00. The extended scope carries no number: "Festpreis, vorab schriftlich".
 * The sample report is a fictional company ("Hausverwaltung Kranich"), labelled as such, with no results.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "check",
  meta: {
    title: "KI-Check für 990 € netto: wo Automatisierung lohnt",
    description:
      "Der schriftliche KI-Check zeigt, welche Abläufe sich automatisieren lassen: Fragebogen, Bericht mit drei Ideen, Risiken und Datenschutz, 990 € netto.",
  },
  crumbs: ["beratung"],
  crumb: "KI-Check",
  hero: {
    eyebrow: "KI-Check · der erste Schritt",
    h1: ["Wo sich Automatisierung ", "wirklich", " lohnt"],
    lede: "Der KI-Check zeigt, welche Ihrer Abläufe sich automatisieren lassen und welche besser bleiben, wie sie sind. Sie füllen einen Fragebogen aus, wir schreiben den Bericht, auch dann, wenn sich nichts zu automatisieren lohnt.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Ablauf ansehen", to: "check", hash: "ablauf" },
    facts: ["KI-Check 990 € netto, Festpreis", "Fragebogen und schriftlicher Bericht", "NDA vor der Analyse", "Bericht auch ohne Empfehlung"],
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
        ["Format", "Schriftlich: Sie füllen einen Fragebogen aus (etwa 20 Minuten), wir schreiben den Bericht. Auf Wunsch 30 Minuten Besprechung per Video, mittwochs oder freitags zwischen 18:30 und 20:00 Uhr"],
        ["Lieferzeit", "In der Regel 10 Werktage nach Eingang des Fragebogens"],
        ["Ergebnis", "Ein schriftlicher Bericht: drei Ideen nach Priorität, die Risiken, Hinweise zum Datenschutz und der nächste Schritt"],
        ["Preis", "990 € netto, Festpreis. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an. Erweiterter Umfang: Festpreis, vorab schriftlich"],
        ["Vertraulichkeit", "Eine NDA unterzeichnen wir vor der Analyse"],
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
          p: "Wir klären kurz Ziele und Abläufe, per E-Mail oder in 15 bis 30 Minuten per Video am Mittwoch- oder Freitagabend. Danach unterzeichnen wir die NDA.",
          result: "Umfang und Festpreis stehen schriftlich fest.",
          meta: "kostenlos, vor der Analyse",
        },
        {
          name: "Fragebogen",
          h: "Ihre Angaben",
          p: "Sie beantworten den Fragebogen in etwa 20 Minuten, am besten zusammen mit den Menschen, die die Arbeit machen. Wir fragen nach dem, was wirklich passiert, nicht nach dem Soll.",
          result: "Die wichtigsten Abläufe sind beschrieben.",
          meta: "etwa 20 Minuten",
        },
        {
          name: "Bericht",
          h: "Schriftliches Ergebnis",
          p: "Drei Ideen nach Priorität, die Risiken, Hinweise zum Datenschutz und der nächste Schritt. Im erweiterten Umfang folgen zusätzlich Prozesskarte und 30-Tage-Plan.",
          result: "Sie sehen schwarz auf weiß, was sich lohnt.",
          meta: "in der Regel 10 Werktage",
        },
        {
          name: "Entscheidung",
          h: "Ihr nächster Schritt",
          p: "Auf Wunsch besprechen wir den Bericht 30 Minuten per Video, am Mittwoch- oder Freitagabend. Dann entscheiden Sie: selbst umsetzen, mit uns pilotieren oder es dabei belassen.",
          result: "Eine Entscheidung auf Basis von Fakten.",
          meta: "ohne Verpflichtung",
        },
      ],
    },
    {
      t: "principles",
      id: "fragebogen",
      label: "Fragebogen",
      note: "Etwa 20 Minuten.",
      h: "Was der Fragebogen abfragt",
      lede: "Sie erhalten ihn nach der Beauftragung per E-Mail. Personenbezogene Daten von Kunden oder Beschäftigten brauchen wir nicht.",
      airy: true,
      items: [
        { h: "Ihr Betrieb", p: "Branche, Größe und Standorte." },
        { h: "Ihre Abläufe", p: "Drei wiederkehrende Aufgaben, die heute viel Zeit kosten, und welche Rolle sie erledigt, zum Beispiel Empfang oder Buchhaltung." },
        { h: "Ihre Systeme", p: "E-Mail, Microsoft 365 oder Google Workspace, Branchensoftware und Ablage." },
        { h: "Ihre Daten", p: "Welche Arten von Daten vorkommen und wo sie liegen. Gesundheitsdaten nehmen wir nicht auf." },
        { h: "Ziele und Grenzen", p: "Was besser werden soll und was auf keinen Fall passieren darf." },
        { h: "KI im Team", p: "Ob und wie Ihr Team KI schon nutzt und welche Regeln dafür gelten." },
      ],
    },
    {
      t: "offers",
      id: "umfang",
      label: "Umfang",
      h: "Kompakt starten, bei Bedarf erweitern",
      lede: "Der KI-Check genügt für eine erste Einschätzung. Für mehrere Abläufe gibt es mehr Tiefe zum Festpreis.",
      items: [
        {
          name: "KI-Check",
          price: "990 € netto",
          unit: "Festpreis",
          p: "Eine erste Einschätzung auf Basis Ihres Fragebogens. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an.",
          points: [
            "Fragebogen von etwa 20 Minuten",
            "Schriftlicher Bericht: drei Ideen, Risiken, Datenschutz, nächster Schritt",
            "Auf Wunsch 30 Minuten Besprechung per Video, abends",
            "NDA vor der Analyse",
          ],
          href: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
          featured: true,
        },
        {
          name: "Erweitert",
          price: "Festpreis",
          unit: "vorab schriftlich",
          p: "Mehr Tiefe für mehrere Abläufe, ebenfalls schriftlich: ein ausführlicherer Fragebogen, Rückfragen per E-Mail und ein konkreter Plan.",
          points: [
            "Mehrere Abläufe, aufgenommen per Fragebogen und E-Mail",
            "Prozesskarte und fünf bewertete Kandidaten",
            "30-Tage-Plan und 30 Minuten Besprechung per Video",
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
      h: "Ein Auszug aus einem Musterbericht",
      lede: "So ist der Bericht aufgebaut. Unternehmen, Abläufe und Angaben sind erfunden.",
      mark: "Beispiel, fiktiv",
      title: "KI-Check-Bericht (Auszug)",
      meta: "Hausverwaltung Kranich · fiktives Unternehmen",
      rows: [],
      sections: [
        {
          h: "Drei Ideen nach Priorität",
          ordered: true,
          items: [
            "E-Mail-Eingang vorsortieren: Schadensmeldungen, Zählerstände und Rückfragen landen getrennt in eigenen Ordnern. Geringer Aufwand, Microsoft 365 ist vorhanden.",
            "Antwortentwürfe für häufige Mieterfragen aus Ihren eigenen Textbausteinen. Versendet wird erst nach Freigabe durch eine Person.",
            "Eingangsrechnungen auslesen und zur Prüfung vorbereiten. Gebucht wird weiter in der Buchhaltung.",
          ],
        },
        {
          h: "Risiken",
          items: [
            "Unklare E-Mails landen im falschen Ordner: ein Ordner „Unklar“ und eine tägliche Sichtprüfung.",
            "Entwürfe klingen zu glatt oder sind sachlich falsch: Freigabe vor jedem Versand.",
          ],
        },
        {
          h: "Datenschutz",
          items: [
            "Mieterdaten sind personenbezogen: Auftragsverarbeitungsvertrag mit dem Anbieter, Speicherort in der EU, Zugriff nur für Berechtigte.",
            "Die abschließende Bewertung liegt bei Ihnen oder Ihrem Datenschutzbeauftragten.",
          ],
        },
        {
          h: "Nächster Schritt",
          items: [
            "Idee 1 als Pilot zum Festpreis, vorab schriftlich, oder selbst umsetzen. Bewusst manuell bleiben Beschwerden und Konflikte mit Mietern.",
          ],
        },
      ],
      foot: "Fiktives Beispiel: Unternehmen, Abläufe und Angaben sind erfunden. Ihr Bericht beruht auf Ihrem Fragebogen und nennt Werkzeuge, Aufwand und Reihenfolge für Ihren Betrieb.",
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
        a: "990 € netto als Festpreis: Fragebogen, schriftlicher Bericht und auf Wunsch 30 Minuten Besprechung per Video. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an. Für den erweiterten Umfang nennen wir den Festpreis vorab schriftlich. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Wird eine Vertraulichkeitsvereinbarung geschlossen?",
        a: "Ja. Wir unterzeichnen eine NDA vor der Analyse, also bevor Sie uns Ihre Abläufe beschreiben.",
      },
      {
        q: "Was, wenn sich nichts zu automatisieren lohnt?",
        a: "Dann steht genau das im Bericht, mit Begründung. Den Bericht erhalten Sie trotzdem.",
      },
      {
        q: "Wer füllt den Fragebogen aus?",
        a: "Am besten die Menschen, die den Ablauf täglich ausführen, zusammen mit einer Person, die über Änderungen entscheiden darf. Rückfragen klären wir per E-Mail.",
      },
      {
        q: "Wie lange dauert es bis zum Bericht?",
        a: "In der Regel 10 Werktage nach Eingang des Fragebogens. Der Fragebogen selbst dauert etwa 20 Minuten.",
      },
      {
        q: "Wann können wir sprechen?",
        a: "Das Vorgespräch und die Besprechung des Berichts finden per Video statt, mittwochs oder freitags zwischen 18:30 und 20:00 Uhr. Alles andere klären wir per E-Mail.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Finden Sie heraus, was sich lohnt",
    p: "Ein Fragebogen, ein schriftlicher Bericht, keine Bindung.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
  },
  schema: {
    service: {
      name: "KI-Check",
      serviceType: "KI-Beratung",
      description:
        "Schriftliche Einstiegsanalyse für Unternehmen: Fragebogen, Bericht mit drei priorisierten Ideen, Risiken und Datenschutzhinweisen, NDA vorab, auf Wunsch 30 Minuten Besprechung per Video. Erweiterter Umfang zum Festpreis.",
      offers: [{ name: "KI-Check", price: 990 }],
    },
  },
};

const en: PageDef = {
  key: "check",
  meta: {
    title: "AI check for €990 net: where automation pays off",
    description:
      "The written AI check shows which workflows can be automated: a questionnaire, then a report with three ideas, risks and data protection notes. €990 net.",
  },
  crumbs: ["beratung"],
  crumb: "AI check",
  hero: {
    eyebrow: "AI check · the first step",
    h1: ["Where automation ", "really", " pays off"],
    lede: "The AI check shows which of your workflows can be automated and which are better left as they are. You fill in a questionnaire and we write the report, even if nothing is worth automating.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "See how it works", to: "check", hash: "ablauf" },
    facts: ["AI check €990 net, fixed price", "Questionnaire and written report", "NDA before the analysis", "Report even without a recommendation"],
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
        ["Format", "In writing: you fill in a questionnaire (about 20 minutes) and we write the report. A 30-minute video call if you wish, on Wednesdays or Fridays between 18:30 and 20:00 German time"],
        ["Delivery", "Usually 10 working days after we receive the questionnaire"],
        ["Result", "A written report: three ideas by priority, the risks, data protection notes and the next step"],
        ["Price", "€990 net, fixed price. Credited in full against a follow-up order within 60 days. Extended scope: fixed price, agreed in writing first"],
        ["Confidentiality", "We sign an NDA before the analysis"],
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
          p: "We briefly clarify goals and workflows, by email or in a 15 to 30-minute video call on a Wednesday or Friday evening. Then we sign the NDA.",
          result: "Scope and fixed price are set in writing.",
          meta: "free, before the analysis",
        },
        {
          name: "Questionnaire",
          h: "Your answers",
          p: "You answer the questionnaire in about 20 minutes, ideally together with the people who do the work. We ask about what really happens, not about what should happen.",
          result: "The key workflows are described.",
          meta: "about 20 minutes",
        },
        {
          name: "Report",
          h: "Written result",
          p: "Three ideas by priority, the risks, data protection notes and the next step. In the extended scope, a process map and a 30-day plan follow as well.",
          result: "You see in black and white what is worth it.",
          meta: "usually 10 working days",
        },
        {
          name: "Decision",
          h: "Your next step",
          p: "If you wish, we go through the report in a 30-minute video call on a Wednesday or Friday evening. Then you decide: implement yourself, pilot with us, or leave it there.",
          result: "A decision based on facts.",
          meta: "no obligation",
        },
      ],
    },
    {
      t: "principles",
      id: "fragebogen",
      label: "Questionnaire",
      note: "About 20 minutes.",
      h: "What the questionnaire asks",
      lede: "You receive it by email after you place the order. We do not need personal data about your customers or staff.",
      airy: true,
      items: [
        { h: "Your business", p: "Sector, size and locations." },
        { h: "Your workflows", p: "Three recurring tasks that take a lot of time today, and which role handles them, for example front desk or accounts." },
        { h: "Your systems", p: "Email, Microsoft 365 or Google Workspace, industry software and file storage." },
        { h: "Your data", p: "Which kinds of data occur and where they are kept. We do not record health data." },
        { h: "Goals and limits", p: "What should improve and what must not happen under any circumstances." },
        { h: "AI in your team", p: "Whether and how your team already uses AI, and which rules apply." },
      ],
    },
    {
      t: "offers",
      id: "umfang",
      label: "Scope",
      h: "Start compact, extend if needed",
      lede: "The AI check is enough for a first assessment. For several workflows, more depth comes at a fixed price.",
      items: [
        {
          name: "AI check",
          price: "€990 net",
          unit: "fixed price",
          p: "A first assessment based on your questionnaire. Credited in full against a follow-up order within 60 days.",
          points: [
            "Questionnaire of about 20 minutes",
            "Written report: three ideas, risks, data protection, next step",
            "Optional 30-minute video call in the evening",
            "NDA before the analysis",
          ],
          href: { label: "Request the AI check", to: "kontakt", query: { anliegen: "ki-check" } },
          featured: true,
        },
        {
          name: "Extended",
          price: "Fixed price",
          unit: "in writing first",
          p: "More depth for several workflows, also in writing: a more detailed questionnaire, questions by email and a concrete plan.",
          points: [
            "Several workflows, recorded by questionnaire and email",
            "Process map and five rated candidates",
            "30-day plan and a 30-minute video call",
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
      h: "An excerpt from a sample report",
      lede: "This is how the report is structured. Company, workflows and details are invented.",
      mark: "Example, fictional",
      title: "AI check report (excerpt)",
      meta: "Hausverwaltung Kranich (property management) · fictional company",
      rows: [],
      sections: [
        {
          h: "Three ideas by priority",
          ordered: true,
          items: [
            "Pre-sort incoming email: damage reports, meter readings and questions go into separate folders. Low effort, Microsoft 365 is already in place.",
            "Draft replies to frequent tenant questions from your own text modules. Nothing is sent before a person approves it.",
            "Read incoming invoices and prepare them for checking. Bookkeeping still does the booking.",
          ],
        },
        {
          h: "Risks",
          items: [
            "Unclear emails end up in the wrong folder: an “Unclear” folder and a daily visual check.",
            "Drafts sound too smooth or are factually wrong: approval before every send.",
          ],
        },
        {
          h: "Data protection",
          items: [
            "Tenant data is personal data: a data processing agreement with the provider, storage in the EU, access only for authorised staff.",
            "The final assessment lies with you or your data protection officer.",
          ],
        },
        {
          h: "Next step",
          items: [
            "Idea 1 as a pilot at a fixed price, agreed in writing first, or implement it yourself. Complaints and disputes with tenants deliberately stay manual.",
          ],
        },
      ],
      foot: "Fictional example: company, workflows and details are invented. Your report is based on your questionnaire and names tools, effort and order for your business.",
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
        a: "€990 net, a fixed price: a questionnaire, a written report and, if you wish, a 30-minute video call. Credited in full against a follow-up order within 60 days. For the extended scope we name the fixed price in writing beforehand. All prices are net of VAT and for businesses only.",
      },
      {
        q: "Is a confidentiality agreement signed?",
        a: "Yes. We sign an NDA before the analysis, that is, before you describe your workflows to us.",
      },
      {
        q: "What if nothing is worth automating?",
        a: "Then the report says exactly that, with reasons. You still receive the report.",
      },
      {
        q: "Who fills in the questionnaire?",
        a: "Ideally the people who carry out the workflow every day, together with one person who can decide on changes. We settle follow-up questions by email.",
      },
      {
        q: "How long until I get the report?",
        a: "Usually 10 working days after we receive the questionnaire. The questionnaire itself takes about 20 minutes.",
      },
      {
        q: "When can we talk?",
        a: "The preliminary call and the review of the report take place by video, on Wednesdays or Fridays between 18:30 and 20:00 German time. Everything else we settle by email.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Find out what is worth it",
    p: "One questionnaire, one written report, no obligation.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "To AI consulting", to: "beratung" },
  },
  schema: {
    service: {
      name: "AI check",
      serviceType: "AI consulting",
      description:
        "Written entry analysis for companies: questionnaire, report with three prioritised ideas, risks and data protection notes, NDA beforehand, a 30-minute video call if you wish. Extended scope at a fixed price.",
      offers: [{ name: "AI check", price: 990 }],
    },
  },
};

const tr: PageDef = {
  key: "check",
  meta: {
    title: "YZ Kontrolü 990 € (net): otomasyon nerede değer?",
    description:
      "Yazılı YZ Kontrolü hangi iş akışlarının otomatikleştirilebileceğini gösterir: soru formu, ardından üç fikir, riskler ve veri koruma içeren rapor. 990 € (net).",
  },
  crumbs: ["beratung"],
  crumb: "YZ Kontrolü",
  hero: {
    eyebrow: "YZ Kontrolü · ilk adım",
    h1: ["Otomasyon ", "nerede", " gerçekten karşılığını verir?"],
    lede: "YZ Kontrolü, hangi iş akışlarınızın otomatikleştirilebileceğini, hangilerinin olduğu gibi kalmasının daha iyi olduğunu gösterir. Siz bir soru formu doldurursunuz, raporu biz yazarız; otomatikleştirmeye değer bir şey çıkmasa bile.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Süreci görün", to: "check", hash: "ablauf" },
    facts: ["YZ Kontrolü 990 € (net), sabit fiyat", "Soru formu ve yazılı rapor", "Analizden önce NDA", "Öneri çıkmasa da rapor"],
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
        ["Format", "Yazılı: siz yaklaşık 20 dakikalık bir soru formu doldurursunuz, raporu biz yazarız. İsterseniz çarşamba veya cuma günleri Almanya saatiyle 18:30-20:00 arasında 30 dakikalık görüntülü görüşme"],
        ["Teslim", "Genellikle soru formu bize ulaştıktan sonra 10 iş günü içinde"],
        ["Sonuç", "Yazılı bir rapor: öncelik sırasına göre üç fikir, riskler, veri koruma notları ve sonraki adım"],
        ["Fiyat", "990 € (net), sabit fiyat. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Geniş kapsam: sabit fiyat, önceden yazılı"],
        ["Gizlilik", "Analizden önce bir NDA imzalarız"],
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
          p: "Hedefleri ve iş akışlarını kısaca netleştiririz: e-postayla ya da çarşamba veya cuma akşamı 15-30 dakikalık görüntülü görüşmeyle. Ardından NDA'yı imzalarız.",
          result: "Kapsam ve sabit fiyat yazılı olarak belli.",
          meta: "ücretsiz, analizden önce",
        },
        {
          name: "Soru formu",
          h: "Bilgileriniz",
          p: "Soru formunu yaklaşık 20 dakikada, tercihen işi yapan kişilerle birlikte yanıtlarsınız. Olması gerekeni değil, gerçekte olanı sorarız.",
          result: "Önemli iş akışları tarif edildi.",
          meta: "yaklaşık 20 dakika",
        },
        {
          name: "Rapor",
          h: "Yazılı sonuç",
          p: "Öncelik sırasına göre üç fikir, riskler, veri koruma notları ve sonraki adım. Geniş kapsamda ayrıca süreç haritası ve 30 günlük plan gelir.",
          result: "Neyin değdiğini siyah beyaz görürsünüz.",
          meta: "genellikle 10 iş günü",
        },
        {
          name: "Karar",
          h: "Sonraki adımınız",
          p: "İsterseniz raporu çarşamba veya cuma akşamı 30 dakikalık görüntülü görüşmede birlikte ele alırız. Sonra siz karar verirsiniz: kendiniz uygulamak, bizimle pilot yapmak ya da burada bırakmak.",
          result: "Gerçeklere dayanan bir karar.",
          meta: "yükümlülük yok",
        },
      ],
    },
    {
      t: "principles",
      id: "fragebogen",
      label: "Soru formu",
      note: "Yaklaşık 20 dakika.",
      h: "Soru formu neleri sorar?",
      lede: "Siparişten sonra e-postayla alırsınız. Müşterilerinizin ya da çalışanlarınızın kişisel verilerine ihtiyacımız yok.",
      airy: true,
      items: [
        { h: "İşletmeniz", p: "Sektör, büyüklük ve lokasyonlar." },
        { h: "İş akışlarınız", p: "Bugün çok zaman alan üç tekrarlayan görev ve bunları hangi rolün yaptığı, örneğin resepsiyon ya da muhasebe." },
        { h: "Sistemleriniz", p: "E-posta, Microsoft 365 veya Google Workspace, sektör yazılımı ve dosya saklama." },
        { h: "Verileriniz", p: "Hangi tür verilerin bulunduğu ve nerede durduğu. Sağlık verilerini kaydetmeyiz." },
        { h: "Hedefler ve sınırlar", p: "Neyin iyileşmesi gerektiği ve neyin kesinlikle olmaması gerektiği." },
        { h: "Ekipte YZ", p: "Ekibinizin YZ'yi kullanıp kullanmadığı, nasıl kullandığı ve hangi kuralların geçerli olduğu." },
      ],
    },
    {
      t: "offers",
      id: "umfang",
      label: "Kapsam",
      h: "Küçük başlayın, gerekirse genişletin",
      lede: "İlk değerlendirme için YZ Kontrolü yeterlidir. Birkaç iş akışı için daha fazla derinlik sabit fiyatla gelir.",
      items: [
        {
          name: "YZ Kontrolü",
          price: "990 € (net)",
          unit: "sabit fiyat",
          p: "Soru formunuza dayanan ilk değerlendirme. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir.",
          points: [
            "Yaklaşık 20 dakikalık soru formu",
            "Yazılı rapor: üç fikir, riskler, veri koruma, sonraki adım",
            "İsterseniz akşam 30 dakikalık görüntülü görüşme",
            "Analizden önce NDA",
          ],
          href: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
          featured: true,
        },
        {
          name: "Geniş kapsam",
          price: "Sabit fiyat",
          unit: "önceden yazılı",
          p: "Birkaç iş akışı için daha fazla derinlik, yine yazılı: daha ayrıntılı bir soru formu, e-postayla sorular ve somut bir plan.",
          points: [
            "Birkaç iş akışı, soru formu ve e-postayla kaydedilir",
            "Süreç haritası ve değerlendirilmiş beş aday",
            "30 günlük plan ve 30 dakikalık görüntülü görüşme",
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
      h: "Bir örnek rapordan özet",
      lede: "Rapor böyle kurulur. Şirket, iş akışları ve bilgiler uydurmadır.",
      mark: "Örnek, kurgusal",
      title: "YZ Kontrolü raporu (özet)",
      meta: "Hausverwaltung Kranich (mülk yönetimi) · kurgusal şirket",
      rows: [],
      sections: [
        {
          h: "Öncelik sırasına göre üç fikir",
          ordered: true,
          items: [
            "Gelen e-postaları önceden ayırmak: hasar bildirimleri, sayaç değerleri ve sorular ayrı klasörlere gider. Efor düşük, Microsoft 365 zaten var.",
            "Sık sorulan kiracı sorularına kendi metin şablonlarınızdan yanıt taslakları. Bir kişi onaylamadan hiçbir şey gönderilmez.",
            "Gelen faturaları okuyup kontrole hazırlamak. Kaydı yine muhasebe yapar.",
          ],
        },
        {
          h: "Riskler",
          items: [
            "Belirsiz e-postalar yanlış klasöre düşer: bir “Belirsiz” klasörü ve günlük göz kontrolü.",
            "Taslaklar fazla pürüzsüz ya da yanlış olabilir: her gönderimden önce onay.",
          ],
        },
        {
          h: "Veri koruma",
          items: [
            "Kiracı verileri kişisel veridir: sağlayıcıyla veri işleme sözleşmesi, AB'de saklama, yalnızca yetkili kişilere erişim.",
            "Son değerlendirme size ya da veri koruma görevlinize aittir.",
          ],
        },
        {
          h: "Sonraki adım",
          items: [
            "1. fikir sabit fiyatlı pilot olarak (önceden yazılı) ya da kendiniz uygulayın. Şikâyetler ve kiracılarla anlaşmazlıklar bilerek manuel kalır.",
          ],
        },
      ],
      foot: "Kurgusal örnek: şirket, iş akışları ve bilgiler uydurmadır. Sizin raporunuz soru formunuza dayanır ve işletmeniz için araçları, eforu ve sırayı belirtir.",
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
        a: "990 € (net), sabit fiyat: soru formu, yazılı rapor ve isterseniz 30 dakikalık görüntülü görüşme. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Geniş kapsam için sabit fiyatı önceden yazılı olarak bildiririz. Tüm fiyatlar net, KDV hariçtir ve yalnızca işletmeler içindir.",
      },
      {
        q: "Gizlilik sözleşmesi yapılıyor mu?",
        a: "Evet. Analizden önce, yani iş akışlarınızı bize anlatmadan önce bir NDA imzalarız.",
      },
      {
        q: "Otomatikleştirmeye değer bir şey çıkmazsa ne olur?",
        a: "O zaman rapor tam olarak bunu gerekçesiyle söyler. Raporu yine alırsınız.",
      },
      {
        q: "Soru formunu kim doldurur?",
        a: "En iyisi iş akışını her gün yürüten kişiler, değişikliklere karar verebilecek bir kişiyle birlikte. Ek soruları e-postayla netleştiririz.",
      },
      {
        q: "Rapor ne zaman gelir?",
        a: "Genellikle soru formu bize ulaştıktan sonra 10 iş günü içinde. Soru formunun kendisi yaklaşık 20 dakika sürer.",
      },
      {
        q: "Ne zaman görüşebiliriz?",
        a: "Ön görüşme ve raporun değerlendirilmesi görüntülü olarak, çarşamba veya cuma günleri Almanya saatiyle 18:30-20:00 arasında yapılır. Diğer her şeyi e-postayla netleştiririz.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Neyin değdiğini öğrenin",
    p: "Bir soru formu, yazılı bir rapor, yükümlülük yok.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "YZ danışmanlığına", to: "beratung" },
  },
  schema: {
    service: {
      name: "YZ Kontrolü",
      serviceType: "Yapay zeka danışmanlığı",
      description:
        "Şirketler için yazılı başlangıç analizi: soru formu, öncelikli üç fikir, riskler ve veri koruma notları içeren rapor, önceden NDA, isterseniz 30 dakikalık görüntülü görüşme. Geniş kapsam sabit fiyatla.",
      offers: [{ name: "YZ Kontrolü", price: 990 }],
    },
  },
};

export const page: PageSet = { de, en, tr };
