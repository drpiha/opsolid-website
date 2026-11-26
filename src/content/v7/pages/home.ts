/**
 * Home page (design C "Werkstatt", owner decision 81; package P1, PLAN 6.1). Trainings lead: the ink hero with the
 * bench (a sample exercise and a sample participation record), then the three doors (Schulungen, Beratung,
 * Produkte), the training ledger with the one quiet row of planned courses (rule 5), the process on ink, the
 * KI-Check on slate, the products band on charcoal, About, the FAQ and the contact form (#kontakt). No CTA band:
 * the form closes the page. German is the source; EN and TR carry identical blocks, item counts and ids.
 *
 * Rules that bind this file: only the published net prices with the price note next to every price group; trainings
 * "ab" and "pro Team", never "Festpreis"; the KI-Check credit next to its chip; planned courses only by name with
 * "geplant"; Kutasia one sentence, no price, picture or link out (lead override A); the NFC card without a price;
 * no location, team size, on-site wording, founder or trainer names; every sample, render and screen labelled.
 */
import { CHECK, OFFERS, PLANNED, type CourseKey } from "../offers";
import { APP_STORE, PLAY } from "./opso";
import type { Block, PageDef, PageSet } from "../types";
import type { L3 } from "@/lib/v7-routes";

const W = "/img/v7/werkstatt";

/** The four step cut-outs of the process (decorative, alt ""; one Etikett line under the row names them). */
const CROPS = ["crop-anfrage", "crop-agenda", "crop-termin", "crop-bescheinigung"].map((n) => ({ src: `${W}/crop/${n}.webp`, w: 288, h: 224, alt: "" }));

/** Ledger rows from the one offer source: track tag, duration bars, spec lines, price, unit, arithmetic. */
function ledger(l: L3, p: Record<CourseKey, string>, tags: Record<CourseKey, string>, link: string, status: string) {
  const ids: Record<CourseKey, string> = { kompetenz: "grundlagen", copilot: "copilot", workflows: "automatisierung" };
  const bars: Record<CourseKey, 1 | 2 | 4> = { kompetenz: 1, copilot: 2, workflows: 4 };
  return (["kompetenz", "copilot", "workflows"] as const).map((k) => {
    const o = OFFERS[l][k];
    return {
      id: ids[k],
      name: o.name,
      status: "bookable" as const,
      statusLabel: status,
      p: p[k],
      price: o.price,
      unit: o.unit,
      arith: o.arith ? [o.arith] : undefined,
      tag: tags[k],
      bars: bars[k],
      spec: [o.duration, o.persons, o.extra],
      href: { label: link, to: k },
    };
  });
}

const planned = (l: L3, label: string) => PLANNED[l].map((name) => ({ name, status: "planned" as const, statusLabel: label }));

/** The home contact form (after the FAQ): ink with the mat, copy column and the form card. */
function form(l: L3, x: { label: string; h: string; lede: string; topics: { value: string; label: string }[]; mailLabel: string; nextH: string; next: string[] }): Block {
  return {
    t: "form",
    id: "kontakt",
    label: x.label,
    h: x.h,
    lede: x.lede,
    ground: "ink",
    mat: "linear-gradient(80deg,#000 0%,transparent 46%)",
    variant: "home",
    topics: x.topics,
    aside: { mailLabel: x.mailLabel, mail: "info@opsolid.de", next: { h: x.nextH, items: x.next } },
  };
}

const de: PageDef = {
  key: "home",
  meta: {
    title: "OpSolid: KI-Schulungen, KI-Beratung und eigene Software",
    description:
      "KI-Schulungen für Ihr Team: online, live in Ihrem Microsoft Teams, mit Teilnahmebescheinigung und Preis pro Team. Dazu der schriftliche KI-Check für Abläufe.",
  },
  crumbs: [],
  crumb: "Start",
  hero: {
    art: "bench",
    tone: "ink",
    eyebrow: "KI-Schulungen und KI-Beratung für Unternehmen",
    h1: ["KI-Schulungen,", "live", " an Ihren Aufgaben"],
    lede: "OpSolid bringt KI in den Arbeitsalltag von Unternehmen: mit Schulungen für Ihr Team, Beratung für Ihre Abläufe und eigener Software.",
    primary: { label: "Schulung anfragen", to: "home", hash: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Schulungen und Preise", to: "home", hash: "schulungen" },
    strip: [
      ["Preis", "Pro Team ab 1.790 € netto"],
      ["Format", "Online, live, in Microsoft Teams"],
      ["Nach der Schulung", "Teilnahme­bescheinigung"],
      ["Sprache", "Deutsch oder Englisch"],
    ],
    stripNote: "Alle Preise netto zzgl. USt., nur für Unternehmen.",
    bench: {
      ariaLabel: "Zwei Werkstücke: ein Beispiel einer Übung und ein Muster der Teilnahmebescheinigung",
      ledeStrong: ["Schulungen für Ihr Team", "Beratung für Ihre Abläufe", "eigener Software"],
      exercise: {
        etikett: "Beispiel · Übung mit Musterdaten",
        ariaLabel: "Beispiel einer Übung aus der Schulung, mit Musterdaten: eine Gästeanfrage an ein Hotel, ein Antwortentwurf mit KI und zwei Stellen, die Ihr Team prüft",
        bar: ["Übung: Gästeanfrage beantworten", "Beispiel"],
        task: "Die Aufgabe aus dem Alltag: ein Hotel",
        avatar: "JB",
        from: "Julia Brandt, Anfrage per E-Mail",
        subject: "Tagungsraum für 14 Personen am 12. März?",
        mail: "Wir planen einen Workshop mit 14 Personen. Ist der Raum frei, und was kostet die Tagungspauschale?",
        aiLabel: "Der Entwurf mit KI",
        promptLabel: "Anweisung:",
        prompt: "Entwirf eine Antwort. Nutze nur Angaben aus der Anfrage und aus unserer Preisliste.",
        draft: [
          "Guten Tag Frau Brandt, vielen Dank für Ihre Anfrage. Der Tagungsraum ist am 12. März ",
          { mark: "[Belegung prüfen]" },
          " frei. Die Tagungspauschale laut Liste: ",
          { mark: "[Preis prüfen]" },
          ".",
        ],
        foot: [
          { label: "Entwurf", who: "KI" },
          { label: "Belegung und Preis prüfen", who: "Ihr Team" },
          { label: "Senden", who: "Ihr Team" },
        ],
      },
      certificate: {
        ariaLabel: "Muster einer Teilnahmebescheinigung",
        stamp: "Muster",
        title: "Teilnahmebescheinigung",
        name: "Clara Weber",
        line: "hat an der Schulung teilgenommen:",
        rows: [
          ["Schulung", "KI-Kompetenz Basis"],
          ["Datum", "[Datum]"],
          ["Dauer", "Halber Tag (3,5 Stunden)"],
          ["Themen", "Grundlagen, Datenschutz, Regeln"],
          ["Leitung", "[Trainerin oder Trainer]"],
        ],
        foot: "Die Bescheinigung belegt die Teilnahme. Sie ist kein Zertifikat einer Behörde, einer Kammer oder eines Verbands.",
        etikett: "Muster · Teilnahmebescheinigung",
      },
    },
  },
  blocks: [
    {
      t: "doors",
      id: "wege",
      label: "Drei Wege",
      h: "Drei Wege, eine Methode",
      lede: "Erst analysieren, dann schulen oder umsetzen.",
      doors: [
        {
          tone: "schulungen",
          etikett: "Schulungen",
          h: "Ihr Team lernt KI an den eigenen Aufgaben",
          p: "Live, als geschlossener Termin nur für Ihr Team.",
          chip: { kind: "live", text: "pro Team ab 1.790 € netto" },
          link: { label: "Alle Schulungen und Preise", to: "schulungen" },
          art: {
            kind: "picture",
            pic: {
              src: `${W}/desk/desk-agenda-door.webp`,
              w: 720,
              h: 860,
              alt: "Gedruckte Muster-Agenda der Schulung KI-Kompetenz Basis mit acht Zeitpunkten, auf einem kupferfarbenen Tisch",
              etikett: "Render · Muster-Agenda",
            },
          },
        },
        {
          tone: "beratung",
          etikett: "Beratung",
          h: "Wir sagen schriftlich, wo KI hilft und wo nicht",
          chip: { kind: "live", text: CHECK.de.chip },
          credit: CHECK.de.credit,
          link: { label: "Zum KI-Check", to: "check" },
          art: {
            kind: "fragebogen",
            title: "Fragebogen KI-Check",
            sub: "Frage 3 · Muster",
            q: "Wo geht heute Zeit verloren?",
            options: [{ text: "E-Mails sortieren", on: true }, { text: "Angebote schreiben" }],
            etikett: "Muster · Fragebogen",
            ariaLabel: "Muster eines Fragebogens zum KI-Check mit einer angekreuzten Antwort",
          },
        },
        {
          tone: "produkte",
          etikett: "Produkte",
          h: "Eigene Software, selbst betrieben",
          p: "OpSo ist live, als App für iPhone und Android.",
          chip: { kind: "live", text: "OpSo · kostenlos" },
          link: { label: "Alle Produkte", to: "produkte" },
          art: {
            kind: "phone",
            img: { src: "/img/v7/opso/app/de-06-contacts.webp", w: 328, h: 710, alt: "OpSo App: Kontaktliste mit Lead-Status, Demodaten" },
            etikett: "App-Screen · Demodaten",
          },
        },
      ],
      footnote: "Alle Preise netto zzgl. USt., nur für Unternehmen.",
    },
    {
      t: "courses",
      variant: "ledger",
      id: "schulungen",
      label: "Schulungen",
      note: "Preis pro Team, nicht pro Person.",
      h: "Drei Schulungen, pro Team gebucht",
      lede: "Vom halben Tag Grundlagen bis zu zwei Tagen KI-Agenten, auf Deutsch oder Englisch. Jedes Team übt an Beispielen aus dem eigenen Alltag.",
      cta: { label: "Alle KI-Schulungen im Detail", to: "schulungen" },
      items: [
        ...ledger(
          "de",
          {
            kompetenz: "Grundlagen, Risiken, Datenschutz und klare Regeln für den Umgang mit KI im Team.",
            copilot: "Copilot in Outlook, Teams, Word, Excel und PowerPoint, geübt an Ihren eigenen Aufgaben.",
            workflows: "KI-Agenten und automatisierte Workflows aufbauen, geübt an Abläufen aus Ihrem Alltag.",
          },
          { kompetenz: "Grundlagen", copilot: "Microsoft 365", workflows: "Automatisierung" },
          "Zur Schulung",
          "Termin auf Anfrage",
        ),
        ...planned("de", "geplant"),
      ],
      soon: {
        id: "in-vorbereitung",
        label: "In Vorbereitung",
        chip: "geplant",
        link: { label: "Interesse vormerken", to: "home", hash: "kontakt", query: { anliegen: "vormerken" } },
      },
      footnote:
        "Alle Preise netto zzgl. USt., nur für Unternehmen. Unternehmen, die KI einsetzen, ergreifen Maßnahmen, um die KI-Kompetenz ihrer Beschäftigten zu fördern (Art. 4 KI-Verordnung); eine Schulung mit Teilnahmebescheinigung ist eine nachvollziehbare Maßnahme. Keine Rechtsberatung.",
    },
    {
      t: "process",
      id: "ablauf",
      label: "Ablauf",
      h: "Von der Anfrage zur Bescheinigung",
      lede: "Vier Schritte, jeder mit einem Ergebnis. Nach jedem entscheiden Sie, ob es weitergeht.",
      ground: "ink",
      mat: "linear-gradient(180deg,#000 0%,transparent 55%)",
      etikett: "Ausschnitte · Formular, Muster-Agenda, Schema, Muster-Bescheinigung",
      steps: [
        {
          name: "Anfrage",
          h: "Team und Aufgaben",
          p: "Sie schildern uns per Formular Team, Aufgaben, Vorwissen und Sprache. Drei Sätze genügen.",
          result: "Wir empfehlen die passende Schulung und nennen den Preis pro Team.",
          meta: "kostenlos",
          crop: CROPS[0],
        },
        {
          name: "Angebot",
          h: "Trainer, Termin, Beispiele",
          p: "Wir stimmen Beispiele aus Ihrem Alltag, Teilnehmerzahl und Termin mit Ihnen ab. Die Trainerin oder den Trainer nennen wir Ihnen vor der Buchung namentlich.",
          result: "Ein schriftliches Angebot pro Team. Vertrag und Rechnung laufen über OpSolid.",
          meta: "vor der Buchung",
          crop: CROPS[1],
        },
        {
          name: "Schulung",
          h: "Live und online",
          p: "Ein geschlossener Termin nur für Ihr Team, live in Microsoft Teams. Geübt wird mit Beispieldaten, nie mit echten Kundendaten.",
          result: "Ihr Team hat an eigenen Aufgaben geübt und kennt die Regeln.",
          meta: "halber Tag bis zwei Tage",
          crop: CROPS[2],
        },
        {
          name: "Bescheinigung",
          h: "Teilnahme­bescheinigung",
          p: "Wir stellen sie nach der Schulung aus, mit Datum, Dauer, Themen und Trainer.",
          result: "Eine nachvollziehbare Maßnahme für Ihre Unterlagen.",
          meta: "für Ihre Dokumentation",
          crop: CROPS[3],
        },
      ],
    },
    {
      t: "check",
      id: "ki-check",
      label: "KI-Check",
      ground: "slate",
      etikett: "Beratung · der Einstieg",
      h: "Nicht sicher, wo Sie anfangen? Der KI-Check",
      lede: "Sie füllen einen Fragebogen aus, wir schreiben den Bericht. Er endet mit einer Handlungsempfehlung: umsetzen, schulen oder vorerst nichts tun.",
      price: "990 €",
      terms: ["netto, Festpreis", CHECK.de.credit],
      points: [
        { b: "Fragebogen", rest: " von etwa 20 Minuten" },
        { b: "Schriftlicher Bericht", rest: ": drei Ideen, Risiken, Datenschutz" },
        { b: "Handlungsempfehlung", rest: " am Ende, auch zur Frage, ob Ihr Team eine Schulung braucht" },
      ],
      primary: { label: "KI-Check anfragen", to: "home", hash: "kontakt", query: { anliegen: "ki-check" } },
      secondary: { label: "Zum KI-Check", to: "check" },
      priceNote: "Alle Preise netto zzgl. USt., nur für Unternehmen.",
      report: {
        ariaLabel: "Auszug aus einem Musterbericht des KI-Checks, fiktives Unternehmen",
        title: "Ergebnis KI-Check",
        meta: "Hausverwaltung Kranich · fiktives Unternehmen",
        stamp: "Muster",
        h: "Drei Ideen nach Priorität",
        items: [
          { b: "E-Mail-Eingang vorsortieren.", more: " Schadensmeldungen, Zählerstände und Rückfragen landen getrennt in eigenen Ordnern." },
          { b: "Antwortentwürfe für häufige Mieterfragen.", more: " Versendet wird erst nach Freigabe durch eine Person." },
          { b: "Eingangsrechnungen auslesen.", more: " Gebucht wird weiter in der Buchhaltung." },
        ],
        manualH: "Bewusst manuell",
        manual: "Beschwerden und Konflikte mit Mietern.",
        recH: "Handlungsempfehlung",
        rec: "Idee 1 als Pilot. Schulung: KI-Kompetenz Basis für den Mieterservice, halber Tag, online.",
        etikett: "Beispiel, fiktiv",
      },
    },
    {
      t: "products",
      id: "produkte",
      label: "Produkte",
      ground: "char",
      etikett: "Produkte",
      h: "Was wir selbst bauen",
      app: {
        name: "OpSo",
        chip: { kind: "live", text: "live · kostenlos" },
        p: "Digitale Visitenkarte mit Kontaktliste und Follow-up. Kostenlos für iPhone und Android.",
        stores: [
          { label: "Im App Store laden", href: APP_STORE },
          { label: "Auf Google Play laden", href: PLAY },
        ],
        all: { label: "Alle Produkte", to: "produkte" },
      },
      stage: {
        render: {
          src: `${W}/render/render-hero-1600.webp`,
          w: 1600,
          h: 1200,
          srcSet: [
            { src: `${W}/render/render-hero-960.webp`, w: 960 },
            { src: `${W}/render/render-hero-1600.webp`, w: 1600 },
          ],
          sizes: "(max-width: 960px) 100vw, 60vw",
          alt: "Zwei OpSo NFC-Karten in mattem Schwarz mit Kupferprägung: eine stehend mit OpSolid-Zeichen, eine liegend mit QR-Code und dem Beispielnamen Clara Weber",
          etikett: "Render · OpSo NFC-Karte, Name als Beispiel",
        },
        phone: {
          img: { src: "/img/v7/opso/app/de-02-share.webp", w: 328, h: 710, alt: "OpSo App: Bildschirm Teilen mit QR-Code, Antippen und NFC-Karte" },
          etikett: "App-Screen · unbearbeitet, Demodaten",
        },
      },
      line: [
        {
          name: "OpSo NFC-Karte",
          chip: { kind: "plan", text: "in Vorbereitung" },
          p: "Die Visitenkarte zum Antippen, verbunden mit Ihrer OpSo-Karte.",
          to: { label: "OpSo NFC-Karte", to: "produkte", hash: "nfc-karte" },
        },
        {
          name: "Kutasia",
          chip: { kind: "plan", text: "in Entwicklung" },
          p: "Posteingang mit KI-Antwortvorschlägen. Noch nicht erhältlich.",
          to: { label: "Kutasia", to: "produkte", hash: "kutasia" },
        },
      ],
    },
    {
      t: "about",
      id: "ueber",
      label: "Über OpSolid",
      ground: "paper",
      h: "Ein Unternehmen, eine Methode",
      lede: "Wir verkaufen keine KI-Lizenzen. Wir empfehlen, was zu Ihrem Team und Ihren Abläufen passt.",
      paras: [
        "OpSolid organisiert KI-Schulungen im eigenen Namen, mit freiberuflichen Trainerinnen und Trainern, die wir selbst auswählen und Ihnen vor der Buchung namentlich nennen. Vertrag und Rechnung laufen über OpSolid.",
      ],
      facts: [
        ["Methode", "Erst analysieren, dann schulen oder umsetzen"],
        ["Angebot", "Umfang und Preis stehen vor jedem Auftrag schriftlich fest"],
        ["Branchen", "Dienstleistung, Gastronomie und Hotellerie, Handel, Praxen (ohne Gesundheitsdaten)"],
      ],
      links: [
        { label: "Mehr über OpSolid", to: "ueber" },
        { label: "Trainer werden", to: "trainer" },
      ],
      picture: {
        src: `${W}/desk/desk-docs-1300.webp`,
        w: 1300,
        h: 800,
        srcSet: [
          { src: `${W}/desk/desk-docs-780.webp`, w: 780 },
          { src: `${W}/desk/desk-docs-1300.webp`, w: 1300 },
        ],
        sizes: "(max-width: 960px) 100vw, 54vw",
        alt: "Gedruckte Muster-Unterlagen auf einem kupferfarbenen Tisch: ein Stapel Teilnahmebescheinigungen mit dem Beispielnamen Clara Weber, dahinter eine Agenda",
        etikett: "Render · Muster-Unterlagen: Teilnahmebescheinigung und Agenda",
      },
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Häufige Fragen",
    aside: "Ihre Frage fehlt? Schreiben Sie an info@opsolid.de.",
    items: [
      {
        q: "Gilt der Preis pro Person?",
        a: "Nein, pro Team: bei KI-Kompetenz Basis sind 10 Personen inklusive (jede weitere 90 €, bis 15), beim Copilot-Praxistag 10 (jede weitere 150 €, bis 12), bei der KI-Agenten-Schulung 8 (jede weitere 290 €, bis 10). Rechnerisch sind das bei 10 Personen 179 € pro Person (KI-Kompetenz Basis) und 290 € pro Person (Copilot-Praxistag). Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Wo und wie findet die Schulung statt?",
        a: "Online und live, in Ihrem eigenen Microsoft Teams, auf Wunsch per Zoom. Ein halber Tag dauert 3,5 Stunden inklusive Pause, ein Tag 6 Stunden inklusive Pausen, auf Wunsch an zwei halben Tagen. Aufzeichnungen und Selbstlernkurse bieten wir nicht an.",
      },
      {
        q: "Bekommen wir ein Zertifikat?",
        a: "Ein Zertifikat ist nicht vorgeschrieben. Sie erhalten von uns eine eigene Teilnahmebescheinigung mit Datum, Dauer, Themen und Trainer. Sie ist kein Zertifikat einer Behörde, einer Kammer oder eines Verbands.",
      },
      {
        q: "Wer hält die Schulung?",
        a: "Freiberufliche Trainerinnen und Trainer, die wir auswählen. Wir nennen Ihnen die Person vor der Buchung namentlich. Vertrag und Rechnung laufen über OpSolid.",
      },
      {
        q: "Wie finden wir die passende Schulung?",
        a: "Mit einer kurzen Anfrage: Wir empfehlen die passende Schulung kostenlos. Ist offen, wo KI in Ihrem Betrieb sinnvoll ist, beginnen Sie mit dem KI-Check: 990 € netto, Festpreis, schriftlich per Fragebogen und Bericht, NDA vor der Analyse. Der Bericht endet mit einer Handlungsempfehlung und sagt auch, ob eine Schulung sinnvoll ist. Bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir ihn voll an. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Brauchen wir dafür überhaupt KI?",
        a: "Nicht immer. Oft reicht eine saubere Automatisierung ohne KI, manchmal genügt eine Schulung mit klaren Regeln. Was zu Ihnen passt, klären wir im KI-Check.",
      },
    ],
  },
  after: [
    form("de", {
      label: "Kontakt",
      h: "Schulung anfragen",
      lede: "Schreiben Sie uns kurz zu Team, Aufgaben und Sprache. Wir empfehlen die passende Schulung und nennen den Preis pro Team.",
      topics: [
        { value: "schulung", label: "KI-Schulung für mein Team" },
        { value: "vormerken", label: "Interesse an einer geplanten Schulung vormerken" },
        { value: "ki-check", label: "KI-Check" },
        { value: "beratung", label: "KI-Beratung und KI-Automatisierung" },
        { value: "opso", label: "OpSo" },
        { value: "sonstiges", label: "Sonstiges" },
      ],
      mailLabel: "Lieber per E-Mail",
      nextH: "Was danach passiert",
      next: ["Persönliche Antwort per E-Mail", "Kennenlernen, kostenlos", "Angebot: Schulung oder KI-Check"],
    }),
  ],
  schema: {
    service: {
      name: "KI-Schulungen und KI-Beratung",
      serviceType: "KI-Schulungen",
      description: "KI-Schulungen für Teams (online, live, pro Team) und KI-Beratung für Unternehmen: KI-Check mit Handlungsempfehlung, Pilot zum Festpreis, Betrieb und Ausbau.",
      offers: [{ name: "KI-Check", price: 990 }],
    },
    courses: [
      {
        name: "KI-Kompetenz Basis",
        description:
          "Online-Schulung für Teams: Grundlagen, Risiken, Datenschutz und Regeln im Umgang mit KI. Halber Tag, bis zu 15 Personen, live auf Deutsch oder Englisch, mit Teilnahmebescheinigung.",
        price: 1790,
        from: true,
      },
      {
        name: "Microsoft 365 Copilot Praxistag",
        description:
          "Online-Praxistag für Teams: Microsoft 365 Copilot in Outlook, Teams, Word, Excel und PowerPoint an eigenen Aufgaben. 1 Tag, bis zu 12 Personen, live auf Deutsch oder Englisch.",
        price: 2900,
        from: true,
      },
      {
        name: "KI-Agenten & Workflow-Automatisierung",
        description:
          "Online-Schulung für Teams: KI-Agenten und automatisierte Workflows aufbauen, geübt an Abläufen aus dem Alltag. 2 Tage, bis zu 10 Personen, live auf Deutsch oder Englisch.",
        price: 5900,
        from: true,
      },
    ],
  },
};

const en: PageDef = {
  key: "home",
  meta: {
    title: "OpSolid: AI training, AI consulting and our own software",
    description:
      "Live AI training for your team in your own Microsoft Teams, with a participation record and one price per team. Plus the written AI check for your workflows.",
  },
  crumbs: [],
  crumb: "Home",
  hero: {
    art: "bench",
    tone: "ink",
    eyebrow: "AI training and AI consulting for companies",
    h1: ["AI training,", "live", " on your own tasks"],
    lede: "OpSolid brings AI into the daily work of companies: with training for your team, consulting for your workflows and our own software.",
    primary: { label: "Request training", to: "home", hash: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Courses and prices", to: "home", hash: "schulungen" },
    strip: [
      ["Price", "From €1,790 net per team"],
      ["Format", "Online, live, in Microsoft Teams"],
      ["After the course", "Participation record"],
      ["Language", "English or German"],
    ],
    stripNote: "All prices are net of VAT and for businesses only.",
    bench: {
      ariaLabel: "Two workpieces: an example of an exercise and a sample of the participation record",
      ledeStrong: ["training for your team", "consulting for your workflows", "our own software"],
      exercise: {
        etikett: "Example · exercise with sample data",
        ariaLabel: "Example of a course exercise with sample data: a guest enquiry to a hotel, a reply drafted with AI and two points your team checks",
        bar: ["Exercise: a guest enquiry", "Example"],
        task: "The task from daily work: a hotel",
        avatar: "JB",
        from: "Julia Brandt, enquiry by email",
        subject: "Meeting room for 14 people on 12 March?",
        mail: "We are planning a workshop with 14 people. Is the room free, and what is the day-delegate rate?",
        aiLabel: "The draft with AI",
        promptLabel: "Instruction:",
        prompt: "Draft a reply. Use only details from the enquiry and from our price list.",
        draft: [
          "Dear Ms Brandt, thank you for your enquiry. The meeting room is free on 12 March ",
          { mark: "[check availability]" },
          ". The day-delegate rate as per our list: ",
          { mark: "[check price]" },
          ".",
        ],
        foot: [
          { label: "Draft", who: "AI" },
          { label: "Check availability and price", who: "your team" },
          { label: "Send", who: "your team" },
        ],
      },
      certificate: {
        ariaLabel: "Sample of a participation record",
        stamp: "Sample",
        title: "Participation record",
        name: "Clara Weber",
        line: "has taken part in the course:",
        rows: [
          ["Course", "AI literacy basics"],
          ["Date", "[date]"],
          ["Duration", "Half day (3.5 hours)"],
          ["Topics", "Fundamentals, data protection, rules"],
          ["Led by", "[trainer]"],
        ],
        foot: "The record confirms attendance. It is not a certificate from an authority, a chamber or an association.",
        etikett: "Sample · participation record",
      },
    },
  },
  blocks: [
    {
      t: "doors",
      id: "wege",
      label: "Three ways",
      h: "Three ways, one method",
      lede: "Analyse first, then train or implement.",
      doors: [
        {
          tone: "schulungen",
          etikett: "Training",
          h: "Your team learns AI on its own tasks",
          p: "Live, as a closed session just for your team.",
          chip: { kind: "live", text: "from €1,790 net per team" },
          link: { label: "All courses and prices", to: "schulungen" },
          art: {
            kind: "picture",
            pic: {
              src: `${W}/desk/desk-agenda-door.webp`,
              w: 720,
              h: 860,
              alt: "A printed sample agenda in German for the AI literacy basics course with eight time slots, on a copper-coloured table",
              etikett: "Render · sample agenda",
            },
          },
        },
        {
          tone: "beratung",
          etikett: "Consulting",
          h: "We tell you in writing where AI helps and where it does not",
          chip: { kind: "live", text: CHECK.en.chip },
          credit: CHECK.en.credit,
          link: { label: "To the AI check", to: "check" },
          art: {
            kind: "fragebogen",
            title: "AI check questionnaire",
            sub: "Question 3 · sample",
            q: "Where is time lost today?",
            options: [{ text: "Sorting emails", on: true }, { text: "Writing quotes" }],
            etikett: "Sample · questionnaire",
            ariaLabel: "Sample of an AI check questionnaire with one answer ticked",
          },
        },
        {
          tone: "produkte",
          etikett: "Products",
          h: "Our own software, run by us",
          p: "OpSo is live, as an app for iPhone and Android.",
          chip: { kind: "live", text: "OpSo · free" },
          link: { label: "All products", to: "produkte" },
          art: {
            kind: "phone",
            img: { src: "/img/v7/opso/app/en-06-contacts.webp", w: 328, h: 710, alt: "OpSo app: contact list with lead status, demo data" },
            etikett: "App screen · demo data",
          },
        },
      ],
      footnote: "All prices are net of VAT and for businesses only.",
    },
    {
      t: "courses",
      variant: "ledger",
      id: "schulungen",
      label: "Courses",
      note: "Priced per team, not per person.",
      h: "Three courses, booked per team",
      lede: "From a half day of fundamentals to two days on AI agents, in English or German. Every team practises on examples from its own daily work.",
      cta: { label: "All AI training in detail", to: "schulungen" },
      items: [
        ...ledger(
          "en",
          {
            kompetenz: "Fundamentals, risks, data protection and clear rules for using AI as a team.",
            copilot: "Copilot in Outlook, Teams, Word, Excel and PowerPoint, practised on your own tasks.",
            workflows: "Build AI agents and automated workflows, practised on processes from your daily work.",
          },
          { kompetenz: "Fundamentals", copilot: "Microsoft 365", workflows: "Automation" },
          "View the course",
          "Date on request",
        ),
        ...planned("en", "planned"),
      ],
      soon: {
        id: "in-vorbereitung",
        label: "In preparation",
        chip: "planned",
        link: { label: "Register interest", to: "home", hash: "kontakt", query: { anliegen: "vormerken" } },
      },
      footnote:
        "All prices are net of VAT and for businesses only. Companies that use AI take measures to support their staff's AI literacy (Article 4 of the EU AI Act); a course with a participation record is one traceable measure. This is not legal advice.",
    },
    {
      t: "process",
      id: "ablauf",
      label: "Process",
      h: "From enquiry to participation record",
      lede: "Four steps, each with a result. After every step you decide whether to continue.",
      ground: "ink",
      mat: "linear-gradient(180deg,#000 0%,transparent 55%)",
      etikett: "Cut-outs · form, sample agenda, schema, sample record",
      steps: [
        {
          name: "Enquiry",
          h: "Team and tasks",
          p: "Tell us via the form about your team, tasks, prior knowledge and language. Three sentences are enough.",
          result: "We recommend the right course and name the price per team.",
          meta: "free",
          crop: CROPS[0],
        },
        {
          name: "Offer",
          h: "Trainer, date, examples",
          p: "We agree examples from your daily work, group size and date with you. We name the trainer to you before you book.",
          result: "A written offer per team. Contract and invoice run through OpSolid.",
          meta: "before you book",
          crop: CROPS[1],
        },
        {
          name: "Course",
          h: "Live and online",
          p: "A closed session just for your team, live in Microsoft Teams. We practise with sample data, never with real customer data.",
          result: "Your team has practised on its own tasks and knows the rules.",
          meta: "half a day to two days",
          crop: CROPS[2],
        },
        {
          name: "Record",
          h: "Participation record",
          p: "We issue it after the course, with date, duration, topics and trainer.",
          result: "A traceable measure for your files.",
          meta: "for your documentation",
          crop: CROPS[3],
        },
      ],
    },
    {
      t: "check",
      id: "ki-check",
      label: "AI check",
      ground: "slate",
      etikett: "Consulting · the starting point",
      h: "Not sure where to start? The AI check",
      lede: "You fill in a questionnaire and we write the report. It ends with a clear recommendation: implement, train or do nothing for now.",
      price: "€990",
      terms: ["net, fixed price", CHECK.en.credit],
      points: [
        { b: "Questionnaire", rest: " of about 20 minutes" },
        { b: "Written report", rest: ": three ideas, risks, data protection" },
        { b: "A clear recommendation", rest: " at the end, including whether your team needs training" },
      ],
      primary: { label: "Request the AI check", to: "home", hash: "kontakt", query: { anliegen: "ki-check" } },
      secondary: { label: "To the AI check", to: "check" },
      priceNote: "All prices are net of VAT and for businesses only.",
      report: {
        ariaLabel: "Excerpt from a sample AI check report, fictional company",
        title: "AI check result",
        meta: "Hausverwaltung Kranich (property management) · fictional company",
        stamp: "Sample",
        h: "Three ideas by priority",
        items: [
          { b: "Pre-sort incoming email.", more: " Damage reports, meter readings and questions go into separate folders." },
          { b: "Draft replies to frequent tenant questions.", more: " Nothing is sent before a person approves it." },
          { b: "Read incoming invoices.", more: " Bookkeeping still does the booking." },
        ],
        manualH: "Deliberately manual",
        manual: "Complaints and disputes with tenants.",
        recH: "Recommendation",
        rec: "Idea 1 as a pilot. Training: AI literacy basics for the tenant-service team, half day, online.",
        etikett: "Example, fictional",
      },
    },
    {
      t: "products",
      id: "produkte",
      label: "Products",
      ground: "char",
      etikett: "Products",
      h: "What we build ourselves",
      app: {
        name: "OpSo",
        chip: { kind: "live", text: "live · free" },
        p: "Digital business card with a contact list and follow-up. Free for iPhone and Android.",
        stores: [
          { label: "Download on the App Store", href: APP_STORE },
          { label: "Get it on Google Play", href: PLAY },
        ],
        all: { label: "All products", to: "produkte" },
      },
      stage: {
        render: {
          src: `${W}/render/render-hero-1600.webp`,
          w: 1600,
          h: 1200,
          srcSet: [
            { src: `${W}/render/render-hero-960.webp`, w: 960 },
            { src: `${W}/render/render-hero-1600.webp`, w: 1600 },
          ],
          sizes: "(max-width: 960px) 100vw, 60vw",
          alt: "Two OpSo NFC cards in matt black with copper embossing: one standing with the OpSolid mark, one lying flat with a QR code and the sample name Clara Weber",
          etikett: "Render · OpSo NFC card, name as an example",
        },
        phone: {
          img: { src: "/img/v7/opso/app/en-02-share.webp", w: 328, h: 710, alt: "OpSo app: share screen with QR code, tap and NFC card" },
          etikett: "App screen · unedited, demo data",
        },
      },
      line: [
        {
          name: "OpSo NFC card",
          chip: { kind: "plan", text: "in preparation" },
          p: "The business card you tap, linked to your OpSo card.",
          to: { label: "OpSo NFC card", to: "produkte", hash: "nfc-karte" },
        },
        {
          name: "Kutasia",
          chip: { kind: "plan", text: "in development" },
          p: "Inbox with AI reply suggestions. Not yet available.",
          to: { label: "Kutasia", to: "produkte", hash: "kutasia" },
        },
      ],
    },
    {
      t: "about",
      id: "ueber",
      label: "About OpSolid",
      ground: "paper",
      h: "One company, one method",
      lede: "We do not sell AI licences. We recommend what fits your team and your workflows.",
      paras: [
        "OpSolid organises AI training in its own name, with freelance trainers we select ourselves and name to you before you book. Contract and invoice run through OpSolid.",
      ],
      facts: [
        ["Method", "Analyse first, then train or implement"],
        ["Offer", "Scope and price are fixed in writing before every engagement"],
        ["Industries", "Services, hospitality, retail, practices (without health data)"],
      ],
      links: [
        { label: "More about OpSolid", to: "ueber" },
        { label: "Become a trainer", to: "trainer" },
      ],
      picture: {
        src: `${W}/desk/desk-docs-1300.webp`,
        w: 1300,
        h: 800,
        srcSet: [
          { src: `${W}/desk/desk-docs-780.webp`, w: 780 },
          { src: `${W}/desk/desk-docs-1300.webp`, w: 1300 },
        ],
        sizes: "(max-width: 960px) 100vw, 54vw",
        alt: "Printed sample documents in German on a copper-coloured table: a stack of participation records with the sample name Clara Weber, an agenda behind them",
        etikett: "Render · sample documents: participation record and agenda",
      },
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Frequently asked questions",
    aside: "Is your question missing? Write to info@opsolid.de.",
    items: [
      {
        q: "Is the price per person?",
        a: "No, per team: AI literacy basics includes 10 people (each additional €90, up to 15), the Copilot workshop 10 (each additional €150, up to 12), the AI agents course 8 (each additional €290, up to 10). With 10 people that works out at €179 per person (AI literacy basics) and €290 per person (Copilot workshop). All prices are net of VAT and for businesses only.",
      },
      {
        q: "Where and how does the course take place?",
        a: "Online and live, in your own Microsoft Teams, via Zoom if you prefer. A half day is 3.5 hours including a break, a day 6 hours including breaks, split over two half days on request. We do not offer recordings or self-paced courses.",
      },
      {
        q: "Do we get a certificate?",
        a: "No certificate is required. You receive our own participation record with date, duration, topics and trainer. It is not issued by an authority, chamber or association.",
      },
      {
        q: "Who teaches the course?",
        a: "Freelance trainers we select. We name the person to you before you book. Contract and invoice run through OpSolid.",
      },
      {
        q: "How do we find the right course?",
        a: "With a short enquiry: we recommend the right course free of charge. If it is open where AI makes sense in your business, start with the AI check: €990 net, fixed price, in writing with a questionnaire and a report, NDA before the analysis. The report ends with a clear recommendation and also says whether training makes sense. Credited in full against a follow-up order within 60 days. All prices are net of VAT and for businesses only.",
      },
      {
        q: "Do we need AI for this at all?",
        a: "Not always. Often clean automation without AI is enough, and sometimes a course with clear rules is all it takes. What fits you, we clarify in the AI check.",
      },
    ],
  },
  after: [
    form("en", {
      label: "Contact",
      h: "Request training",
      lede: "Tell us briefly about your team, tasks and language. We recommend the right course and name the price per team.",
      topics: [
        { value: "schulung", label: "AI training for my team" },
        { value: "vormerken", label: "Register interest in a planned course" },
        { value: "ki-check", label: "AI check" },
        { value: "beratung", label: "AI consulting and AI automation" },
        { value: "opso", label: "OpSo" },
        { value: "sonstiges", label: "Something else" },
      ],
      mailLabel: "Prefer email",
      nextH: "What happens next",
      next: ["A personal reply by email", "Intro, free", "A quote: training or AI check"],
    }),
  ],
  schema: {
    service: {
      name: "AI training and AI consulting",
      serviceType: "AI training",
      description: "AI training for teams (online, live, per team) and AI consulting for companies: AI check with a clear recommendation, pilot at a fixed price, operation and expansion.",
      offers: [{ name: "AI check", price: 990 }],
    },
    courses: [
      {
        name: "AI literacy basics",
        description:
          "Online training for teams: fundamentals, risks, data protection and rules for working with AI. Half day, up to 15 people, live in English or German, with a participation record.",
        price: 1790,
        from: true,
      },
      {
        name: "Microsoft 365 Copilot workshop",
        description:
          "Online hands-on day for teams: Microsoft 365 Copilot in Outlook, Teams, Word, Excel and PowerPoint on your own tasks. 1 day, up to 12 people, live in English or German.",
        price: 2900,
        from: true,
      },
      {
        name: "AI agents & workflow automation",
        description:
          "Online training for teams: build AI agents and automated workflows, practised on processes from daily work. 2 days, up to 10 people, live in English or German.",
        price: 5900,
        from: true,
      },
    ],
  },
};

const tr: PageDef = {
  key: "home",
  meta: {
    title: "OpSolid: YZ eğitimleri, YZ danışmanlığı ve kendi yazılımımız",
    description:
      "Ekibiniz için kendi Microsoft Teams'inizde canlı YZ eğitimleri: katılım belgesiyle, ekip başına tek fiyatla. Ayrıca iş akışlarınız için yazılı YZ Kontrolü.",
  },
  crumbs: [],
  crumb: "Ana sayfa",
  hero: {
    art: "bench",
    tone: "ink",
    eyebrow: "Şirketler için YZ eğitimleri ve YZ danışmanlığı",
    h1: ["Yapay zekâ eğitimi,", "canlı", " ve işinize özel"],
    lede: "OpSolid yapay zekâyı şirketlerin günlük işine taşır: ekibiniz için eğitimlerle, iş akışlarınız için danışmanlıkla ve kendi yazılımımızla.",
    primary: { label: "Eğitim talep edin", to: "home", hash: "kontakt", query: { anliegen: "schulung" } },
    secondary: { label: "Eğitimler ve fiyatlar", to: "home", hash: "schulungen" },
    strip: [
      ["Fiyat", "Ekip başına 1.790 €'dan itibaren (net)"],
      ["Format", "Çevrimiçi, canlı, Microsoft Teams'te"],
      ["Eğitimden sonra", "Katılım belgesi"],
      ["Dil", "Almanca veya İngilizce"],
    ],
    stripNote: "Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
    bench: {
      ariaLabel: "İki çalışma parçası: bir alıştırma örneği ve bir katılım belgesi örneği",
      ledeStrong: ["ekibiniz için eğitimlerle", "iş akışlarınız için danışmanlıkla", "kendi yazılımımızla"],
      exercise: {
        etikett: "Örnek · örnek verilerle alıştırma",
        ariaLabel: "Örnek verilerle bir eğitim alıştırması: bir otele gelen misafir talebi, YZ ile hazırlanan bir yanıt taslağı ve ekibinizin kontrol ettiği iki nokta",
        bar: ["Alıştırma: misafir talebi", "Örnek"],
        task: "Günlük işten görev: bir otel",
        avatar: "JB",
        from: "Julia Brandt, e-postayla talep",
        subject: "12 Mart'ta 14 kişilik toplantı salonu?",
        mail: "14 kişilik bir atölye planlıyoruz. Salon boş mu ve toplantı paketinin fiyatı nedir?",
        aiLabel: "YZ ile taslak",
        promptLabel: "Talimat:",
        prompt: "Bir yanıt taslağı yaz. Yalnızca talepteki ve fiyat listemizdeki bilgileri kullan.",
        draft: [
          "İyi günler Sayın Brandt, talebiniz için teşekkür ederiz. Toplantı salonu 12 Mart'ta ",
          { mark: "[doluluğu kontrol et]" },
          " boştur. Listemize göre toplantı paketi: ",
          { mark: "[fiyatı kontrol et]" },
          ".",
        ],
        foot: [
          { label: "Taslak", who: "YZ" },
          { label: "Doluluk ve fiyat kontrolü", who: "ekibiniz" },
          { label: "Gönderim", who: "ekibiniz" },
        ],
      },
      certificate: {
        ariaLabel: "Katılım belgesi örneği",
        stamp: "Örnek",
        title: "Katılım belgesi",
        name: "Clara Weber",
        line: "eğitime katılmıştır:",
        rows: [
          ["Eğitim", "YZ Yetkinliği Temel"],
          ["Tarih", "[tarih]"],
          ["Süre", "Yarım gün (3,5 saat)"],
          ["Konular", "Temeller, veri koruma, kurallar"],
          ["Eğitmen", "[eğitmen]"],
        ],
        foot: "Belge katılımı doğrular. Bir kurum, oda veya dernek sertifikası değildir.",
        etikett: "Örnek · katılım belgesi",
      },
    },
  },
  blocks: [
    {
      t: "doors",
      id: "wege",
      label: "Üç yol",
      h: "Üç yol, tek yöntem",
      lede: "Önce analiz, sonra eğitim ya da uygulama.",
      doors: [
        {
          tone: "schulungen",
          etikett: "Eğitimler",
          h: "Ekibiniz yapay zekâyı kendi görevleri üzerinde öğrenir",
          p: "Canlı, yalnızca ekibinize özel kapalı bir oturum olarak.",
          chip: { kind: "live", text: "Ekip başına 1.790 €'dan itibaren (net)" },
          link: { label: "Tüm eğitimler ve fiyatlar", to: "schulungen" },
          art: {
            kind: "picture",
            pic: {
              src: `${W}/desk/desk-agenda-door.webp`,
              w: 720,
              h: 860,
              alt: "Bakır renkli bir masada, YZ Yetkinliği Temel eğitiminin sekiz zaman noktalı, Almanca basılı örnek programı",
              etikett: "Render · örnek program",
            },
          },
        },
        {
          tone: "beratung",
          etikett: "Danışmanlık",
          h: "YZ'nin nerede yardımcı olduğunu ve nerede olmadığını yazılı söyleriz",
          chip: { kind: "live", text: CHECK.tr.chip },
          credit: CHECK.tr.credit,
          link: { label: "YZ Kontrolü'ne gidin", to: "check" },
          art: {
            kind: "fragebogen",
            title: "YZ Kontrolü soru formu",
            sub: "Soru 3 · örnek",
            q: "Bugün zaman nerede kayboluyor?",
            options: [{ text: "E-postaları ayıklamak", on: true }, { text: "Teklif yazmak" }],
            etikett: "Örnek · soru formu",
            ariaLabel: "Bir yanıtı işaretlenmiş YZ Kontrolü soru formu örneği",
          },
        },
        {
          tone: "produkte",
          etikett: "Ürünler",
          h: "Kendi yazılımımız, kendimiz işletiyoruz",
          p: "OpSo yayında: iPhone ve Android için bir uygulama.",
          chip: { kind: "live", text: "OpSo · ücretsiz" },
          link: { label: "Tüm ürünler", to: "produkte" },
          art: {
            kind: "phone",
            img: { src: "/img/v7/opso/app/tr-06-contacts.webp", w: 328, h: 710, alt: "OpSo uygulaması: potansiyel müşteri durumlu kişi listesi, demo veri" },
            etikett: "Uygulama ekranı · demo veri",
          },
        },
      ],
      footnote: "Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
    },
    {
      t: "courses",
      variant: "ledger",
      id: "schulungen",
      label: "Eğitimler",
      note: "Fiyat kişi başına değil, ekip başına.",
      h: "Üç eğitim, ekip başına rezervasyon",
      lede: "Yarım günlük temellerden iki günlük YZ ajanlarına kadar, Almanca veya İngilizce. Her ekip kendi günlük işinden örneklerle çalışır.",
      cta: { label: "Tüm YZ eğitimleri ayrıntılı", to: "schulungen" },
      items: [
        ...ledger(
          "tr",
          {
            kompetenz: "Temeller, riskler, veri koruma ve ekipte yapay zekâ kullanımı için net kurallar.",
            copilot: "Outlook, Teams, Word, Excel ve PowerPoint'te Copilot; kendi görevleriniz üzerinde uygulamalı.",
            workflows: "YZ ajanlarını ve otomatik iş akışlarını kurma; günlük işinizdeki süreçler üzerinde uygulamalı.",
          },
          { kompetenz: "Temeller", copilot: "Microsoft 365", workflows: "Otomasyon" },
          "Eğitime bakın",
          "Tarih talep üzerine",
        ),
        ...planned("tr", "planlanıyor"),
      ],
      soon: {
        id: "in-vorbereitung",
        label: "Hazırlanıyor",
        chip: "planlanıyor",
        link: { label: "İlginizi bildirin", to: "home", hash: "kontakt", query: { anliegen: "vormerken" } },
      },
      footnote:
        "Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir. Yapay zekâ kullanan şirketler, çalışanlarının yapay zekâ okuryazarlığını desteklemek için önlemler alır (AB Yapay Zekâ Tüzüğü Madde 4); katılım belgeli bir eğitim izlenebilir bir önlemdir. Hukuki danışmanlık değildir.",
    },
    {
      t: "process",
      id: "ablauf",
      label: "Süreç",
      h: "Talepten katılım belgesine",
      lede: "Dört adım, her birinin bir sonucu var. Her adımdan sonra devam edip etmeyeceğinize siz karar verirsiniz.",
      ground: "ink",
      mat: "linear-gradient(180deg,#000 0%,transparent 55%)",
      etikett: "Kesitler · form, örnek program, şema, örnek belge",
      steps: [
        {
          name: "Talep",
          h: "Ekip ve görevler",
          p: "Formla ekibinizi, görevlerinizi, ön bilginizi ve dili anlatırsınız. Üç cümle yeter.",
          result: "Size uygun eğitimi önerir ve ekip başına fiyatı bildiririz.",
          meta: "ücretsiz",
          crop: CROPS[0],
        },
        {
          name: "Teklif",
          h: "Eğitmen, tarih, örnekler",
          p: "Günlük işinizden örnekleri, katılımcı sayısını ve tarihi sizinle birlikte belirleriz. Eğitmeni rezervasyondan önce size adıyla bildiririz.",
          result: "Ekip başına yazılı bir teklif. Sözleşme ve fatura OpSolid üzerinden yürür.",
          meta: "rezervasyondan önce",
          crop: CROPS[1],
        },
        {
          name: "Eğitim",
          h: "Canlı ve çevrimiçi",
          p: "Yalnızca ekibinize özel kapalı bir oturum, Microsoft Teams'te canlı. Örnek verilerle çalışılır, asla gerçek müşteri verisiyle değil.",
          result: "Ekibiniz kendi görevleri üzerinde çalıştı ve kuralları biliyor.",
          meta: "yarım günden iki güne",
          crop: CROPS[2],
        },
        {
          name: "Belge",
          h: "Katılım belgesi",
          p: "Eğitimden sonra düzenleriz: tarih, süre, konular ve eğitmen bilgisiyle.",
          result: "Kayıtlarınız için izlenebilir bir önlem.",
          meta: "dokümantasyonunuz için",
          crop: CROPS[3],
        },
      ],
    },
    {
      t: "check",
      id: "ki-check",
      label: "YZ Kontrolü",
      ground: "slate",
      etikett: "Danışmanlık · giriş adımı",
      h: "Nereden başlayacağınızdan emin değil misiniz? YZ Kontrolü",
      lede: "Siz bir soru formu doldurursunuz, raporu biz yazarız. Rapor net bir öneriyle biter: uygulayın, ekibinizi eğitin ya da şimdilik hiçbir şey yapmayın.",
      price: "990 €",
      terms: ["net, sabit fiyat", CHECK.tr.credit],
      points: [
        { b: "Soru formu", rest: ", yaklaşık 20 dakika" },
        { b: "Yazılı rapor", rest: ": üç fikir, riskler, veri koruma" },
        { b: "Net bir öneri", rest: " raporun sonunda; ekibinizin eğitime ihtiyacı olup olmadığı da yazar" },
      ],
      primary: { label: "YZ Kontrolü talep edin", to: "home", hash: "kontakt", query: { anliegen: "ki-check" } },
      secondary: { label: "YZ Kontrolü'ne gidin", to: "check" },
      priceNote: "Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
      report: {
        ariaLabel: "Bir YZ Kontrolü örnek raporundan özet, kurgusal şirket",
        title: "YZ Kontrolü sonucu",
        meta: "Hausverwaltung Kranich (mülk yönetimi) · kurgusal şirket",
        stamp: "Örnek",
        h: "Öncelik sırasına göre üç fikir",
        items: [
          { b: "Gelen e-postaları önceden ayırmak.", more: " Hasar bildirimleri, sayaç değerleri ve sorular ayrı klasörlere gider." },
          { b: "Sık sorulan kiracı sorularına yanıt taslakları.", more: " Bir kişi onaylamadan hiçbir şey gönderilmez." },
          { b: "Gelen faturaları okumak.", more: " Kaydı yine muhasebe yapar." },
        ],
        manualH: "Bilerek manuel",
        manual: "Şikâyetler ve kiracılarla anlaşmazlıklar.",
        recH: "Öneri",
        rec: "1. fikir pilot olarak. Eğitim: kiracı hizmetleri ekibi için YZ Yetkinliği Temel, yarım gün, çevrimiçi.",
        etikett: "Örnek, kurgusal",
      },
    },
    {
      t: "products",
      id: "produkte",
      label: "Ürünler",
      ground: "char",
      etikett: "Ürünler",
      h: "Kendi geliştirdiklerimiz",
      app: {
        name: "OpSo",
        chip: { kind: "live", text: "yayında · ücretsiz" },
        p: "Kişi listesi ve takip özellikli dijital kartvizit. iPhone ve Android için ücretsiz.",
        stores: [
          { label: "App Store’dan indirin", href: APP_STORE },
          { label: "Google Play’den indirin", href: PLAY },
        ],
        all: { label: "Tüm ürünler", to: "produkte" },
      },
      stage: {
        render: {
          src: `${W}/render/render-hero-1600.webp`,
          w: 1600,
          h: 1200,
          srcSet: [
            { src: `${W}/render/render-hero-960.webp`, w: 960 },
            { src: `${W}/render/render-hero-1600.webp`, w: 1600 },
          ],
          sizes: "(max-width: 960px) 100vw, 60vw",
          alt: "Bakır kabartmalı mat siyah iki OpSo NFC kartı: biri OpSolid işaretiyle ayakta, diğeri karekod ve Clara Weber örnek adıyla yatay",
          etikett: "Render · OpSo NFC kartı, ad örnek",
        },
        phone: {
          img: { src: "/img/v7/opso/app/tr-02-share.webp", w: 328, h: 710, alt: "OpSo uygulaması: karekod, dokunma ve NFC kartı seçenekli paylaşma ekranı" },
          etikett: "Uygulama ekranı · düzenlenmemiş, demo veri",
        },
      },
      line: [
        {
          name: "OpSo NFC kartı",
          chip: { kind: "plan", text: "hazırlanıyor" },
          p: "Dokunarak paylaşılan kartvizit, OpSo kartınıza bağlı.",
          to: { label: "OpSo NFC kartı", to: "produkte", hash: "nfc-karte" },
        },
        {
          name: "Kutasia",
          chip: { kind: "plan", text: "geliştiriliyor" },
          p: "YZ yanıt önerileri sunan gelen kutusu. Henüz satışta değil.",
          to: { label: "Kutasia", to: "produkte", hash: "kutasia" },
        },
      ],
    },
    {
      t: "about",
      id: "ueber",
      label: "OpSolid hakkında",
      ground: "paper",
      h: "Tek şirket, tek yöntem",
      lede: "YZ lisansı satmayız. Ekibinize ve iş akışlarınıza uyanı öneririz.",
      paras: [
        "OpSolid, YZ eğitimlerini kendi adına, kendi seçtiği ve rezervasyondan önce size adıyla bildirdiği serbest eğitmenlerle düzenler. Sözleşme ve fatura OpSolid üzerinden yürür.",
      ],
      facts: [
        ["Yöntem", "Önce analiz, sonra eğitim ya da uygulama"],
        ["Teklif", "Kapsam ve fiyat her işten önce yazılı olarak belirlenir"],
        ["Sektörler", "Hizmet sektörü, yeme-içme ve konaklama, perakende, muayenehaneler (sağlık verisi olmadan)"],
      ],
      links: [
        { label: "OpSolid hakkında daha fazlası", to: "ueber" },
        { label: "Eğitmen olun", to: "trainer" },
      ],
      picture: {
        src: `${W}/desk/desk-docs-1300.webp`,
        w: 1300,
        h: 800,
        srcSet: [
          { src: `${W}/desk/desk-docs-780.webp`, w: 780 },
          { src: `${W}/desk/desk-docs-1300.webp`, w: 1300 },
        ],
        sizes: "(max-width: 960px) 100vw, 54vw",
        alt: "Bakır renkli bir masada Almanca basılı örnek belgeler: Clara Weber örnek adını taşıyan bir deste katılım belgesi, arkasında bir program",
        etikett: "Render · örnek belgeler: katılım belgesi ve program",
      },
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Sık sorulan sorular",
    aside: "Sorunuz burada yok mu? info@opsolid.de adresine yazın.",
    items: [
      {
        q: "Fiyat kişi başına mı?",
        a: "Hayır, ekip başına: YZ Yetkinliği Temel'de 10 kişi dahil (her ek kişi 90 €, en fazla 15), Copilot Uygulama Günü'nde 10 (her ek kişi 150 €, en fazla 12), YZ Ajanları eğitiminde 8 (her ek kişi 290 €, en fazla 10). 10 kişide bu, kişi başı 179 € (YZ Yetkinliği Temel) ve 290 € (Copilot Uygulama Günü) eder. Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
      },
      {
        q: "Eğitim nerede ve nasıl yapılır?",
        a: "Çevrimiçi ve canlı, kendi Microsoft Teams'inizde; isterseniz Zoom ile. Yarım gün mola dahil 3,5 saat, bir gün molalar dahil 6 saat sürer; isterseniz iki yarım güne bölünür. Kayıt ve kendi kendine öğrenme kursu sunmuyoruz.",
      },
      {
        q: "Sertifika alıyor muyuz?",
        a: "Sertifika zorunlu değildir. Bizden tarih, süre, konular ve eğitmeni içeren kendi katılım belgemizi alırsınız. Bu belge bir kurum, oda veya dernek sertifikası değildir.",
      },
      {
        q: "Eğitimi kim veriyor?",
        a: "Bizim seçtiğimiz serbest eğitmenler. Kişiyi rezervasyondan önce size adıyla bildiririz. Sözleşme ve fatura OpSolid üzerinden yürür.",
      },
      {
        q: "Uygun eğitimi nasıl buluruz?",
        a: "Kısa bir talep yeter: uygun eğitimi ücretsiz öneririz. Yapay zekânın işletmenizde nerede anlamlı olduğu belli değilse YZ Kontrolü ile başlayın: 990 € (net, sabit fiyat), soru formu ve raporla yazılı, analizden önce NDA. Rapor net bir öneriyle biter ve eğitimin anlamlı olup olmadığını da söyler. 60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir. Tüm fiyatlar KDV hariçtir; yalnızca şirketler içindir.",
      },
      {
        q: "Bunun için gerçekten yapay zekâya ihtiyacımız var mı?",
        a: "Her zaman değil. Çoğu zaman yapay zekâ içermeyen düzgün bir otomasyon yeterlidir; bazen net kurallar içeren bir eğitim yeter. Size neyin uyduğunu YZ Kontrolü'nde netleştiririz.",
      },
    ],
  },
  after: [
    form("tr", {
      label: "İletişim",
      h: "Eğitim talep edin",
      lede: "Ekibiniz, görevleriniz ve dil hakkında kısaca yazın. Size uygun eğitimi önerir ve ekip başına fiyatı bildiririz.",
      topics: [
        { value: "schulung", label: "Ekibim için YZ eğitimi" },
        { value: "vormerken", label: "Planlanan bir eğitime ilgimi bildirmek istiyorum" },
        { value: "ki-check", label: "YZ Kontrolü" },
        { value: "beratung", label: "Yapay zeka danışmanlığı ve otomasyonu" },
        { value: "opso", label: "OpSo" },
        { value: "sonstiges", label: "Diğer" },
      ],
      mailLabel: "E-postayı tercih ederseniz",
      nextH: "Sonra ne olur",
      next: ["E-postayla kişisel yanıt", "Tanışma, ücretsiz", "Teklif: eğitim ya da YZ Kontrolü"],
    }),
  ],
  schema: {
    service: {
      name: "YZ eğitimleri ve YZ danışmanlığı",
      serviceType: "Yapay zekâ eğitimleri",
      description: "Ekipler için YZ eğitimleri (çevrimiçi, canlı, ekip başına) ve şirketler için YZ danışmanlığı: net bir öneriyle biten YZ Kontrolü, sabit fiyatlı pilot, işletme ve geliştirme.",
      offers: [{ name: "YZ Kontrolü", price: 990 }],
    },
    courses: [
      {
        name: "YZ Yetkinliği Temel",
        description:
          "Ekipler için çevrimiçi eğitim: YZ ile çalışmanın temelleri, riskleri, veri koruma ve kurallar. Yarım gün, en fazla 15 kişi, Almanca veya İngilizce canlı, katılım belgesiyle.",
        price: 1790,
        from: true,
      },
      {
        name: "Microsoft 365 Copilot Uygulama Günü",
        description:
          "Ekipler için çevrimiçi uygulama günü: Outlook, Teams, Word, Excel ve PowerPoint'te Microsoft 365 Copilot, kendi görevleriniz üzerinde. 1 gün, en fazla 12 kişi, Almanca veya İngilizce canlı.",
        price: 2900,
        from: true,
      },
      {
        name: "YZ Ajanları ve İş Akışı Otomasyonu",
        description:
          "Ekipler için çevrimiçi eğitim: YZ ajanlarını ve otomatik iş akışlarını kurma, günlük işten süreçler üzerinde. 2 gün, en fazla 10 kişi, Almanca veya İngilizce canlı.",
        price: 5900,
        from: true,
      },
    ],
  },
};

export const page: PageSet = { de, en, tr };
