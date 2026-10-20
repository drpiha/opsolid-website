import type { PageDef } from "./types";
import type { PageKey } from "./keys";

const CHECK = { label: "Mit dem KI-Check starten", href: "/ai-automation-check" };
const CONTACT = { label: "Kontakt aufnehmen", href: "/contact" };
/** Required under every price table: net prices are only safe when the offer is visibly limited to businesses. */
const PRICE_NOTE = "Alle Preise netto, zzgl. MwSt. Die Angebote richten sich ausschließlich an Unternehmen.";
/** Limited pilot phase: remove once the three free KI-Checks are used. */
const PILOT_NOTE = "Pilotphase: Die ersten drei KI-Checks im Einstiegsumfang führen wir kostenlos durch, im Austausch gegen ehrliches Feedback.";

const DEMO = {
  chip: "Demo · Szenario, ohne Ton",
  play: "Szenario abspielen",
  again: "Noch einmal abspielen",
  note: "Ein gespielter Ablauf, kein Live-Gespräch. Die Live-Sprachdemo folgt, sobald Sprachanbieter und Datenschutzprüfung (DSGVO) geklärt sind.",
  sr: "Beispielgespräch. Agent: Guten Tag, Sie sprechen mit einem KI-Agenten. Wie kann ich Ihnen helfen? Anrufer: Ich möchte einen Termin für nächste Woche vereinbaren. Agent: Gern. Passt Ihnen Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr? Anrufer: Donnerstag passt. Agent: Dann trage ich Donnerstag, 14 Uhr, ein. Sie erhalten eine Bestätigung per E-Mail.",
  script: [
    { who: "Agent", agent: true, text: "Guten Tag, Sie sprechen mit einem KI-Agenten. Wie kann ich Ihnen helfen?", ms: 3400 },
    { who: "Anrufer", agent: false, text: "Ich möchte einen Termin für nächste Woche vereinbaren.", ms: 3000 },
    { who: "Agent", agent: true, text: "Gern. Passt Ihnen Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr?", ms: 3600 },
    { who: "Anrufer", agent: false, text: "Donnerstag passt.", ms: 1400 },
    { who: "Agent", agent: true, text: "Dann trage ich Donnerstag, 14 Uhr, ein. Sie erhalten eine Bestätigung per E-Mail.", ms: 4200 },
  ],
};

/** Real screenshots of our own work (public/img/v4), shown next to the project rows. */
const SHOT = {
  opsolid: { src: "/img/v4/shot-opsolid.webp", w: 960, h: 640, alt: "Startseite von opsolid.de: die Überschrift „Weniger Routine. Mehr Zeit für Ihre Kunden.“ vor einer hellen Szene aus sieben Glasplatten, eine je Leistung" },
  opso: { src: "/img/v4/shot-card.webp", w: 960, h: 640, alt: "Startseite von OpSo: „Deine Visitenkarte als Mini-Website.“ neben einem Smartphone mit einem fiktiven Demoprofil, QR-Code und Hinweisen auf NFC und Link" },
  kutasia: { src: "/img/v4/shot-kutasia.webp", w: 960, h: 640, alt: "Startseite von Kutasia in der türkischen Fassung: Überschrift zu Kundenkommunikation und Terminen auf einem Bildschirm, daneben eine Dashboard-Ansicht mit Nachrichten und Wochenstatistik" },
};

export const de: Record<PageKey, PageDef> = {
  home: {
    slug: "",
    meta: {
      title: "OpSolid | KI-Agenten, Websites und Automatisierung",
      description:
        "Weniger Routine, mehr Zeit für Kunden: OpSolid baut KI-Agenten für Telefon und Chat, Websites im Abo und Automatisierungen für kleine und mittlere Betriebe.",
    },
    crumb: "Start",
    hero: {
      eyebrow: "KI-Agenten · Websites · Automatisierung",
      h1: ["Weniger Routine. ", "Mehr Zeit", " für Ihre Kunden."],
      lede: "KI-Agenten beantworten Anrufe und Chats, Abläufe laufen ohne Copy-Paste, und Ihre Website bringt Anfragen statt Pflegeaufwand. OpSolid baut das für kleine und mittlere Betriebe, misst vorher und nachher und übergibt dokumentiert.",
      primary: { label: "KI-Check starten", href: "/ai-automation-check" },
      secondary: { label: "Leistungen ansehen", href: "#leistungen" },
    },
    blocks: [
      {
        t: "rows",
        id: "leistungen",
        eyebrow: "Leistungen",
        h: "Acht Wege zu weniger Handarbeit.",
        lede: "Jede Leistung löst ein konkretes Problem im Alltag Ihres Betriebs. Wählen Sie, was Sie heute am meisten Zeit kostet.",
        items: [
          { h: "KI-Agenten", p: "Anrufe und Chats beantwortet, auch wenn Ihr Team im Termin ist.", href: "/agents" },
          { h: "Websites", p: "Schnell, klar, gepflegt. Im Abo ab 99 € im Monat.", href: "/websites" },
          { h: "Prozessautomatisierung", p: "Daten nur noch einmal eintippen. Der Rest läuft automatisch.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Mehr aus den Lizenzen, die Sie schon bezahlen.", href: "/microsoft-365-automatisierung" },
          { h: "Interne Tools", p: "Aus der Excel-Liste wird ein Werkzeug mit Rechten und Verlauf.", href: "/interne-tools" },
          { h: "KI-Check", p: "In 90 Minuten klar, was sich lohnt. Ab 490 €.", href: "/ai-automation-check" },
          { h: "KI-Schulungen", p: "Ihr Team arbeitet sicher mit KI, geübt an echten Aufgaben.", href: "/ki-schulungen" },
          { h: "OpSo", tag: "Testphase", p: "Die digitale Visitenkarte: ein Link, NFC und QR, immer aktuell.", href: "/opso" },
        ],
        cta: { label: "Alle Leistungen im Überblick", href: "/leistungen" },
      },
      {
        t: "demo",
        id: "agents",
        eyebrow: "KI-Agenten für Telefon und Chat",
        h: "Kein Anruf bleibt mehr liegen.",
        lede: "Ein KI-Agent nimmt Anfragen an, stimmt Termine ab und gibt Auskunft, auf Basis Ihrer eigenen Unterlagen. Sobald ein Mensch gefragt ist, übergibt er an Ihr Team. Anrufer erfahren zu Beginn, dass ein KI-System spricht.",
        ...DEMO,
        cta: { label: "Mehr zu KI-Agenten", href: "/agents" },
      },
      {
        t: "offer",
        id: "websites",
        eyebrow: "Websites im Abo",
        h: "Eine Website, die Anfragen bringt.",
        lede: "Wir gestalten, bauen und betreiben Ihre Website: schnell, gut lesbar, für Ihren Betrieb entworfen statt aus der Vorlage. Hosting, Pflege und Updates übernehmen wir.",
        label: "Website-Abo",
        amount: "ab 99 €",
        unit: "im Monat",
        sub: "oder 990 € im Jahr · Einrichtung ab 490 €",
        items: ["Hosting, Pflege und Updates inklusive", "1 kleine Änderung pro Monat, erledigt in 5 Werktagen", "Kauf der Website auf Anfrage"],
        note: PRICE_NOTE,
        shot: SHOT.opsolid,
        cta: { label: "Mehr zu Websites", href: "/websites" },
      },
      {
        t: "compare",
        id: "automatisierung",
        eyebrow: "Prozessautomatisierung · Microsoft 365 · Interne Tools",
        h: "Daten nur noch einmal eintippen.",
        lede: "Was heute von Hand zwischen Postfach, Excel, CRM und ERP wandert, läuft danach automatisch. Was nur ein Mensch entscheiden kann, bleibt bei Ihrem Team.",
        before: { h: "Heute", items: ["Anfrage kommt per Mail", "Daten in die Excel-Liste kopieren", "Noch einmal ins CRM tippen", "Angebot von Hand zusammenstellen", "Stand per Rundmail erfragen"] },
        after: { h: "Danach", items: ["Anfrage kommt per Mail", "Daten landen geprüft im CRM", "Angebotsentwurf liegt bereit", "Ihr Team prüft und gibt frei", "Jeder sieht den Stand in Teams"] },
        cta: { label: "Mehr zur Prozessautomatisierung", href: "/prozessautomatisierung" },
      },
      {
        t: "rows",
        eyebrow: "Was sich ändert",
        h: "Was sich in Ihrem Betrieb ändert.",
        lede: "Damit das kein Versprechen bleibt, messen wir vor jedem Pilotprojekt, was der Ablauf heute kostet: Zeit pro Vorgang, Durchlaufzeit, Fehler. Danach messen wir dasselbe noch einmal.",
        items: [
          { h: "Weniger Routine", p: "Copy-Paste, Doppelerfassung und der wöchentliche Report laufen automatisch. Ihr Team gewinnt Zeit für Kunden." },
          { h: "Weniger Fehler", p: "Daten werden einmal erfasst und sauber weitergegeben. Jeder Ablauf hat Protokoll, Fehlerbehandlung und manuellen Rückfall." },
          { h: "Schnellere Antworten", p: "Anfragen werden vorsortiert, beantwortet oder direkt an die zuständige Person geleitet." },
          { h: "Keine Abhängigkeit", p: "Bei Automatisierungen und internen Tools gehören Quellcode und Dokumentation Ihnen. Ihre IT kann jederzeit übernehmen." },
        ],
      },
      {
        t: "spec",
        id: "ki-check",
        eyebrow: "Der Einstieg: KI-Check",
        h: "Ein Plan, bevor Budget fließt.",
        lede: "Der KI-Check zeigt, welche Abläufe sich bei Ihnen automatisieren lassen und welche nicht: 90 Minuten remote mit den Menschen, die die Arbeit machen, danach ein kurzer schriftlicher Bericht.",
        rows: [
          ["Einstieg", "90 Minuten remote, kurzer schriftlicher Bericht"],
          ["Erweitert", "Workshop, Prozesskarte, fünf bewertete Kandidaten, 30-Tage-Plan"],
          ["NDA", "Vor dem Analysegespräch"],
          ["Preis", "Ab 490 € netto; erweiterter Umfang zum Festpreis, vorab schriftlich"],
        ],
        cta: { label: "Details zum KI-Check", href: "/ai-automation-check" },
      },
      {
        t: "table",
        id: "preise",
        eyebrow: "Feste Formate, klare Preise",
        h: "Was der Einstieg kostet.",
        caption: "KI-Check, KI-Schulungen und Website-Abo im Überblick",
        cols: ["Angebot", "Format", "Preis"],
        rows: [
          ["KI-Check", "90 Minuten remote, kurzer schriftlicher Bericht", "ab 490 €"],
          ["KI-Kompetenz Basis", "Halber Tag, bis 15 Personen", "1.490 €"],
          ["Copilot-Praxistag", "1 Tag, bis 12 Personen", "ab 2.400 €"],
          ["Website-Abo", "Hosting, Pflege, Updates, 1 kleine Änderung im Monat", "ab 99 € / Monat"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
        cta: { label: "Schulungen im Detail", href: "/ki-schulungen" },
      },
      {
        t: "rows",
        id: "produkte",
        eyebrow: "Eigene Projekte",
        h: "Woran wir selbst bauen.",
        lede: "Eigene Anwendungen zeigen, wie wir arbeiten: Gestaltung, Technik und Datenschutz im selben Projekt.",
        items: [
          { h: "opsolid.de", tag: "Diese Website", p: "Von OpSolid gestaltet, gebaut und betrieben. Der Text steht zuerst, das Hintergrundvideo lässt sich anhalten und abschalten.", shot: SHOT.opsolid },
          { h: "OpSo", tag: "Produkt in der Testphase", p: "Digitale Visitenkarte mit NFC und QR: ein Link, immer aktuell, ohne App beim Empfänger.", href: "/opso", shot: SHOT.opso },
          { h: "Kutasia", tag: "Projekt in Entwicklung", p: "Kundennachrichten aus WhatsApp, Telegram und E-Mail in einem Posteingang, von einer KI vorsortiert.", href: "https://kutasia.com", shot: SHOT.kutasia },
        ],
      },
    ],
    faq: {
      h: "Häufige Fragen",
      items: [
        { q: "Ersetzt ein KI-Agent unser Team?", a: "Nein. Er nimmt Routine ab und übergibt, sobald eine Person gefragt ist." },
        { q: "Können wir unsere bestehenden Systeme behalten?", a: "Ja. Wo Microsoft 365, Google Workspace, Ihr CRM oder ERP den Ablauf tragen, bauen wir darauf auf." },
        { q: "Wie viel Zeit muss unser Team einplanen?", a: "Für den KI-Check: ein kurzes Vorgespräch und 90 Minuten Analyse mit den Menschen, die die Arbeit machen. Beim erweiterten Umfang kommen Workshop und 30 Minuten Besprechung des Plans hinzu." },
        { q: "Wird vorab eine Vertraulichkeitsvereinbarung geschlossen?", a: "Ja. Vor dem Analysegespräch wird eine Standard-NDA unterzeichnet." },
        { q: "Wer ist unsere Ansprechperson?", a: "Sie haben eine feste Ansprechperson bei OpSolid, von der Analyse bis zum Betrieb. Die Schulung KI-Kompetenz Basis leitet eine freiberufliche Fachkraft, die wir auswählen und Ihnen vorab namentlich nennen." },
      ],
    },
    cta: {
      h: "Welcher Ablauf kostet Sie heute am meisten Zeit?",
      p: "Beschreiben Sie ihn in drei Sätzen. Wir sagen Ihnen, ob sich Automatisierung lohnt und was der nächste Schritt ist. Antwort in der Regel innerhalb weniger Arbeitstage.",
      primary: { label: "Ablauf schildern", href: "/contact" },
      secondary: CHECK,
    },
    service: undefined,
  },

  agents: {
    slug: "agents",
    meta: {
      title: "KI-Agenten für Telefon und Website",
      description:
        "KI-Agenten von OpSolid arbeiten als Telefon- und Chat-Assistent: Sie nehmen Anfragen an, stimmen Termine ab und übergeben an Ihr Team. Mit Datenschutzprüfung.",
    },
    crumb: "KI-Agenten",
    hero: {
      eyebrow: "KI-Agenten · Telefon und Website",
      h1: ["Das Telefon klingelt. ", "Der KI-Agent", " nimmt ab."],
      lede: "Ein KI-Agent nimmt Anfragen an, stimmt Termine ab und beantwortet Fragen zu Ihrem Betrieb, auf Basis Ihrer eigenen Unterlagen. Was Urteilskraft braucht, übergibt er an Ihr Team. So bleiben weniger Anrufe liegen, und Ihr Team wird seltener unterbrochen.",
      primary: CHECK,
      secondary: { label: "Szenario ansehen", href: "#demo" },
      spec: [
        ["Formate", "Telefon- und Chat-Assistent"],
        ["Aufgaben", "Anfragen, Termine, Auskünfte, Übergabe"],
        ["Status", "Szenario-Demo, Live-Demo folgt"],
      ],
    },
    blocks: [
      {
        t: "demo",
        id: "demo",
        h: "So läuft ein Anruf ab.",
        lede: "Ein Terminwunsch vom ersten Satz bis zur Bestätigung: Der Agent sagt zu Beginn, dass ein KI-System spricht, schlägt Zeiten vor, trägt den Termin ein und bestätigt per E-Mail. Sobald ein Mensch gefragt ist, übergibt er an Ihr Team.",
        ...DEMO,
      },
      {
        t: "rows",
        eyebrow: "Aufgaben",
        h: "Was ein Agent übernimmt und was nicht.",
        lede: "Ein Agent übernimmt Routine, die sich wiederholt und klaren Regeln folgt. Alles, was Urteilskraft braucht, geht an Ihr Team.",
        items: [
          { h: "Anfragen annehmen", p: "Anliegen am Telefon oder auf der Website aufnehmen und strukturiert an Ihr Team weitergeben." },
          { h: "Termine abstimmen", p: "Freie Zeiten vorschlagen, den Termin eintragen und eine Bestätigung senden." },
          { h: "Auskünfte geben", p: "Leistungen, Abläufe und Zeiten erklären, auf Basis Ihrer eigenen Unterlagen." },
          { h: "An Menschen übergeben", p: "Bei Beschwerden, Sonderfällen und Unsicherheit geht das Gespräch an eine Person." },
        ],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "In vier Schritten zum eigenen Agenten.",
        items: [
          { h: "Klären", p: "Aufgaben, Grenzen und Tonfall festlegen: Was darf der Agent entscheiden, was nicht?" },
          { h: "Bauen", p: "Dialog und Stimme gestalten und an Kalender, CRM oder Postfach anbinden." },
          { h: "Datenschutz prüfen", p: "Anbieter, Speicherort, Aufbewahrung und Hinweis auf das KI-System festlegen, bevor es live geht." },
          { h: "Testen und betreiben", p: "Gespräche auswerten, nachschärfen und den Agenten im Alltag begleiten." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu KI-Agenten",
      items: [
        { q: "Was kostet ein KI-Agent?", a: "Das hängt von Aufgaben, Anbindungen und Gesprächsaufkommen ab. Den Preis nennen wir schriftlich, bevor etwas gebaut wird. Preise verstehen sich netto, zzgl. MwSt." },
        { q: "Spricht der Agent heute schon live?", a: "Derzeit zeigen wir ein gespieltes Szenario. Die Live-Sprachdemo folgt, sobald Sprachanbieter und Datenschutzprüfung geklärt sind." },
        { q: "Wer hört die Gespräche mit?", a: "Das legen wir vorab gemeinsam mit Ihnen fest: Anbieter, Speicherort, Aufbewahrung und Zugriff. Anrufer erfahren zu Beginn, dass ein KI-System spricht." },
        { q: "Ersetzt ein Agent unser Team?", a: "Nein. Er nimmt Routine ab und übergibt, sobald eine Person gefragt ist." },
        { q: "Ist das Video auf dieser Website ein Agent?", a: "Nein. Das Hintergrundvideo mit den Glasplatten ist Gestaltung; Sie können es anhalten oder unten auf der Seite unter „Hintergrundvideo“ abschalten. Unsere KI-Agenten arbeiten als Telefon- und Chat-Assistent, ohne Figur und ohne Gesicht." },
        { q: "Wie starten wir?", a: "Mit dem KI-Check. Dort klären wir gemeinsam, ob ein Agent für Ihr Unternehmen sinnvoll ist und welche Aufgaben er übernehmen sollte." },
      ],
    },
    cta: { h: "Prüfen, ob ein Agent zu Ihnen passt.", p: "Im KI-Check klären wir Aufgaben, Grenzen und Datenschutz, bevor etwas gebaut wird.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI phone and chat assistants" },
  },

  websites: {
    slug: "websites",
    meta: {
      title: "Websites gestalten und bauen: Kauf oder Abo",
      description:
        "OpSolid gestaltet, baut und betreibt Websites, die nach Ihrem Unternehmen aussehen: schnell und mehrsprachig. Zum Kauf oder im Website-Abo ab 99 € im Monat, netto.",
    },
    crumb: "Websites",
    hero: {
      eyebrow: "Websites · Kauf oder Abo",
      h1: ["Websites, die nach ", "Ihnen", " aussehen."],
      lede: "OpSolid gestaltet und baut Websites, die schnell laden, gut lesbar sind und in mehreren Sprachen funktionieren. Kauf: einmaliger Projektpreis, die Seite gehört Ihnen. Website-Abo: ab 99 € im Monat; Hosting, Pflege und Updates übernehmen wir.",
      primary: CONTACT,
      secondary: { label: "Arbeitsproben ansehen", href: "#referenzen" },
      spec: [
        ["Modelle", "Kauf oder Website-Abo"],
        ["Website-Abo", "Ab 99 €/Monat oder 990 €/Jahr, Einrichtung ab 490 €"],
        ["Kauf", "Preis schriftlich nach dem ersten Gespräch"],
        ["Preise", "Netto zzgl. MwSt., nur für Unternehmen"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Leistung",
        h: "Was in jeder Website steckt.",
        items: [
          { h: "Gestaltung", p: "Typografie, Farbe und Bewegung, die zu Ihrem Unternehmen passen, statt einer Vorlage mit neuem Logo." },
          { h: "Bau", p: "Text zuerst, schnelle Ladezeit, barrierearm, sauber für Suchmaschinen und KI-Suche aufgebaut." },
          { h: "Mehrsprachigkeit", p: "Jede Sprache mit eigener Adresse und sauberer Auszeichnung für die Suche, in den Sprachen, die Ihre Kunden sprechen." },
          { h: "Kauf oder Website-Abo", p: "Kauf lohnt sich, wenn Sie die Seite selbst weiterführen möchten. Das Website-Abo, wenn Sie sich um nichts Technisches kümmern wollen." },
        ],
      },
      {
        t: "table",
        id: "preise",
        eyebrow: "Preise",
        h: "Was eine Website kostet.",
        lede: "Die Preise für das Website-Abo stehen in der Tabelle. Für den Kauf nennen wir den Projektpreis nach dem ersten Gespräch schriftlich.",
        caption: "Website-Abo und Kauf im Überblick",
        cols: ["Modell", "Umfang", "Preis"],
        rows: [
          ["Website-Abo||Inklusive Hosting, Pflege, Updates und 1 kleine Änderung pro Monat (Umsetzung innerhalb von 5 Werktagen, kein Notdienst).", "Einrichtung ab 490 €; danach monatlich oder 990 € im Jahr", "ab 99 €/Monat"],
          ["Kauf||Einmaliger Projektpreis. Die fertige Website gehört Ihnen, und Sie führen sie selbst oder mit Ihrer IT weiter.", "Projektpreis nach Umfang, schriftlich nach dem ersten Gespräch", "Auf Anfrage"],
        ],
        note: PRICE_NOTE,
      },
      {
        t: "rows",
        id: "referenzen",
        eyebrow: "Arbeitsproben",
        h: "Selbst gestaltet, selbst gebaut.",
        lede: "OpSolid hat diese Projekte selbst konzipiert und entwickelt, von der Gestaltung bis zur Technik. Die Links führen zu den Projekten; machen Sie sich selbst ein Bild.",
        items: [
          { h: "opsolid.de", tag: "Diese Website", p: "Text zuerst; das Hintergrundvideo startet nach dem Text und lässt sich anhalten und abschalten.", shot: SHOT.opsolid },
          { h: "OpSo", tag: "Produkt in der Testphase", p: "Digitale Visitenkarte als Web-App: Profil, QR-Code und NFC-Link. Die Veröffentlichung wird vorbereitet.", href: "/opso", shot: SHOT.opso },
          { h: "Kutasia", tag: "Projekt in Entwicklung", p: "Ein Posteingang für WhatsApp, Telegram und E-Mail, mit KI-Vorsortierung.", href: "https://kutasia.com", shot: SHOT.kutasia },
        ],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "Vom ersten Gespräch zur fertigen Seite.",
        items: [
          { h: "Gespräch", p: "Ziel, Zielgruppe, Inhalte und Sprachen klären. Danach nennen wir Umfang und Preis schriftlich." },
          { h: "Entwurf", p: "Struktur und Gestaltung der wichtigsten Seiten, abgestimmt mit Ihrem Feedback." },
          { h: "Bau", p: "Umsetzung mit Texten, Bildern und Formularen, getestet auf Handy und Desktop." },
          { h: "Start und Betrieb", p: "Veröffentlichung, Domain und Datenschutz-Bausteine; im Website-Abo übernehmen wir danach Hosting, Pflege und Updates." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu Websites",
      items: [
        { q: "Kauf oder Website-Abo: Was passt besser?", a: "Kauf, wenn Sie die Seite selbst oder mit Ihrer IT weiterführen möchten: Sie zahlen einmal, und die Seite gehört Ihnen; den Preis nennen wir nach dem ersten Gespräch schriftlich. Das Website-Abo, wenn Sie sich nicht um Technik kümmern möchten: ab 99 € im Monat oder 990 € im Jahr, Einrichtung ab 490 €, alle Preise netto zzgl. MwSt. Enthalten sind Hosting, Pflege, Updates und eine kleine Änderung pro Monat, umgesetzt innerhalb von 5 Werktagen; einen Notdienst gibt es nicht." },
        { q: "Wie lange dauert ein Website-Projekt?", a: "Das hängt vom Umfang ab. Nach dem ersten Gespräch erhalten Sie einen konkreten Zeitplan." },
        { q: "Wem gehören Texte und Bilder?", a: "Inhalte, die Sie liefern, bleiben Ihr Eigentum. Die Nutzungsrechte an Gestaltung und Code halten wir vorab schriftlich fest." },
        { q: "Kann die Seite Video und Bewegung enthalten?", a: "Ja, als Zugabe. Der Text steht immer zuerst; Video und Effekte lassen sich anhalten und abschalten und respektieren die Einstellung für weniger Bewegung." },
      ],
    },
    cta: { h: "Was soll Ihre Website leisten?", p: "Schreiben Sie uns in zwei, drei Sätzen, für wen die Seite ist und was sie erreichen soll. Wir antworten in der Regel innerhalb weniger Arbeitstage.", primary: { label: "Website anfragen", href: "/contact" } },
    service: {
      type: "Website design, development and subscription",
      offers: [
        { name: "Website-Abo, monatlich", price: 99, from: true, unit: "month" },
        { name: "Website-Abo, jährlich", price: 990, unit: "year" },
        { name: "Website-Abo, Einrichtung", price: 490, from: true },
      ],
    },
  },

  leistungen: {
    slug: "leistungen",
    meta: {
      title: "Leistungen: KI-Agenten, Websites, Automatisierung",
      description:
        "KI-Agenten, Websites, Prozessautomatisierung, Microsoft 365, interne Tools, KI-Beratung, KI-Schulungen: welche Leistung von OpSolid welches Problem löst.",
    },
    crumb: "Leistungen",
    hero: {
      eyebrow: "Leistungen",
      h1: ["Sieben Wege zu ", "weniger Handarbeit", "."],
      lede: "Jede Leistung löst ein bestimmtes Problem: Anrufe, die liegen bleiben; eine Website, die nicht mehr passt; Daten, die von Hand zwischen Systemen wandern. Der KI-Check zeigt, wo sich der Einstieg lohnt.",
      primary: CHECK,
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Alle Leistungen",
        h: "Welche Leistung welches Problem löst.",
        items: [
          { h: "KI-Agenten", tag: "Telefon · Website", p: "Wenn Anrufe und Anfragen liegen bleiben: Der Agent nimmt sie an, stimmt Termine ab und übergibt an Ihr Team.", href: "/agents" },
          { h: "Websites", tag: "Kauf · Abo", p: "Wenn die Website nicht mehr zu Ihrem Unternehmen passt: gestaltet, gebaut und auf Wunsch von uns betrieben.", href: "/websites" },
          { h: "Prozessautomatisierung", p: "Wenn dieselben Daten zweimal getippt werden: Angebote, Reports und Abgleich laufen automatisch.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Wenn Lizenzen bezahlt, aber kaum genutzt werden: Freigaben, Dokumente und Postfach-Regeln automatisieren.", href: "/microsoft-365-automatisierung" },
          { h: "Interne Tools", p: "Wenn ein Tabellenblatt zum Engpass wird: ein Werkzeug mit Rechten, Verlauf und genau den Feldern, die Sie brauchen.", href: "/interne-tools" },
          { h: "KI-Beratung", p: "Wenn unklar ist, wo sich KI rechnet: drei bis fünf Use Cases, schriftlich bewertet, mit Roadmap.", href: "/ki-beratung" },
          { h: "KI-Schulungen", tag: "Team", p: "Wenn Ihr Team KI ohne gemeinsame Regeln nutzt: drei Formate mit festem Umfang und klarem Preis.", href: "/ki-schulungen" },
        ],
      },
      {
        t: "steps",
        eyebrow: "Vorgehen",
        h: "Ein Weg, egal wo Sie einsteigen.",
        items: [
          { h: "Analyse", p: "Im KI-Check sehen wir uns Ihre Abläufe an und klären, wo sich Automatisierung lohnt." },
          { h: "Pilot", p: "Ein Ablauf mit großem Hebel, mit festem Umfang und festem Zeitrahmen." },
          { h: "Einführung", p: "Was im Pilotprojekt trägt, wird breiter eingesetzt und dokumentiert." },
          { h: "Übergabe", p: "Ihr Team betreibt die Lösung selbst weiter; auf Wunsch begleiten wir mit einem kleinen Rahmen für Anpassungen." },
        ],
      },
    ],
    cta: { h: "Nicht sicher, wo Sie anfangen sollen?", p: "Im KI-Check ordnen wir Ihre Abläufe und wählen den Baustein, der sich zuerst lohnt.", primary: CHECK, secondary: CONTACT },
  },

  kiBeratung: {
    slug: "ki-beratung",
    meta: {
      title: "KI-Beratung für den Mittelstand: Use Cases und Roadmap",
      description:
        "KI-Beratung von OpSolid für den Mittelstand: drei bis fünf Use Cases, bewertet nach Nutzen, Aufwand und Risiko, mit Roadmap und KI-Richtlinie.",
    },
    crumb: "KI-Beratung",
    hero: {
      eyebrow: "KI-Beratung",
      h1: ["Welche KI lohnt sich ", "für Sie", "?"],
      lede: "Wir finden drei bis fünf KI-Use-Cases, die zu Ihrem Unternehmen passen, bewerten Nutzen, Aufwand und Risiko und halten das Ergebnis als schriftliche Roadmap fest. Was nicht passt, schließen wir ausdrücklich aus.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Ergebnis", "Use-Case-Bewertung, Roadmap, KI-Richtlinie"],
        ["Dauer", "Zielrahmen zwei bis vier Wochen"],
        ["Haltung", "Unabhängig, kein Verkauf von KI-Tools"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Leistung",
        h: "Drei bis fünf Use Cases, schriftlich bewertet.",
        items: [
          { h: "Use Cases finden", p: "Drei bis fünf Anwendungen identifizieren, die zu Ihrem Unternehmen passen, und unpassende klar ausschließen." },
          { h: "Bewerten", p: "Jeden Use Case nach erwartetem Nutzen, Aufwand und Betriebsrisiko einordnen." },
          { h: "Roadmap festhalten", p: "Eine Roadmap für 6 bis 12 Monate mit Verantwortlichen, Kosten und Entscheidungspunkten." },
          { h: "Datenschutz aufsetzen", p: "Den datenschutzgerechten Einsatz vorbereiten: Modellwahl, Datenhoheit und eine kurze KI-Richtlinie für Ihr Unternehmen." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Typische Anwendungen",
        h: "Wo KI Text liest, sortiert und entwirft.",
        lede: "KI lohnt sich dort, wo viel Text gelesen, sortiert oder entworfen wird und ein Mensch das Ergebnis prüft.",
        items: [
          { h: "Dokumenten- und Vertragsanalyse", p: "Lange PDFs vorsortieren, Klauseln und Fristen sichtbar machen. Ein Mensch prüft die Zusammenfassung." },
          { h: "Interne Wissenssuche", p: "Richtlinien, FAQs und SharePoint durchsuchbar machen, mit Antworten aus Ihren eigenen Dokumenten." },
          { h: "Angebotsentwürfe", p: "Angebote aus Vorlage, CRM-Datensatz und kurzem Briefing entwerfen. Der Vertrieb prüft und gibt frei." },
          { h: "Support-Triage", p: "Eingehende Anfragen nach Thema und Dringlichkeit sortieren, bevor eine Person sie bearbeitet. Eine solche KI-Vorsortierung steckt auch in Kutasia, unserem Projekt in Entwicklung." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Modelle und Bausteine",
        h: "Das Modell folgt Ihren Daten, nicht umgekehrt.",
        lede: "Wo Daten die EU nicht verlassen dürfen, kommen EU-Hosting oder Open-Source-Modelle infrage. Wo Microsoft 365 gesetzt ist, liegt Copilot nahe.",
        items: ["OpenAI", "Anthropic Claude", "Microsoft Copilot, Azure OpenAI", "Mistral und Open-Source-Modelle", "Retrieval-Augmented Generation", "pgvector, Qdrant", "EU-Hosting"],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "Vom Gespräch zur Roadmap in drei Schritten.",
        items: [
          { h: "Bestandsaufnahme", p: "Kurzes Gespräch zu Team, Daten und Zielen." },
          { h: "Use-Case-Bewertung", p: "Workshop und schriftliche Analyse: Welche Anwendungen lohnen sich, welche nicht?" },
          { h: "Roadmap und Richtlinie", p: "Entscheidungsreife Roadmap plus kurze schriftliche KI-Richtlinie für Ihr Unternehmen." },
        ],
      },
    ],
    faq: {
      h: "Fragen zur KI-Beratung",
      items: [
        { q: "Was kostet das?", a: "Das hängt vom Umfang ab. Umfang und Preis legen wir schriftlich im Angebot fest, bevor die Arbeit beginnt. Preise verstehen sich netto, zzgl. MwSt." },
        { q: "Worin unterscheiden sich KI-Beratung und KI-Check?", a: "Der KI-Check sucht in Ihren Abläufen nach Kandidaten für Automatisierung, mit und ohne KI. Die KI-Beratung geht weiter: Sie bewertet konkrete KI-Anwendungen, legt eine Roadmap für 6 bis 12 Monate fest und liefert eine KI-Richtlinie für Ihr Unternehmen." },
        { q: "Verkaufen Sie KI-Tools?", a: "Nein. OpSolid ist unabhängig und empfiehlt, was passt. Das kann auch heißen: Nutzen Sie, was Sie haben, oder warten Sie noch." },
        { q: "Lässt sich KI datenschutzgerecht einsetzen?", a: "Der Einsatz lässt sich datenschutzgerecht gestalten: passende Modellwahl, EU-Hosting, Auftragsverarbeitung und eine schriftliche Richtlinie. Wir bereiten das mit vor; die abschließende Bewertung liegt bei Ihrem Datenschutzbeauftragten oder Ihrer Rechtsberatung." },
        { q: "Wie lange dauert eine Beratung?", a: "Für Analyse und Roadmap planen wir zwei bis vier Wochen; den genauen Rahmen legen wir im Angebot fest. Die Umsetzung ist ein eigenes Projekt." },
      ],
    },
    cta: { h: "Finden Sie heraus, welche KI sich lohnt.", p: "Ein Gespräch, eine schriftliche Roadmap, kein Verkauf von Plattformen.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI consulting" },
  },

  prozess: {
    slug: "prozessautomatisierung",
    meta: {
      title: "Prozessautomatisierung für den Mittelstand",
      description:
        "OpSolid automatisiert Angebote, Dokumente, E-Mail-Routing, Reports und Datenabgleich mit Ihren vorhandenen Werkzeugen. Erst gemessen, dann gebaut.",
    },
    crumb: "Prozessautomatisierung",
    hero: {
      eyebrow: "Prozessautomatisierung",
      h1: ["Daten nur noch ", "einmal", " eintippen."],
      lede: "Wir automatisieren Abläufe, die heute Zeit kosten: Angebote, die einen halben Tag dauern; Reports, die jeden Montag neu entstehen; Daten, die zwischen Excel, CRM und E-Mail wandern. Zuerst nehmen wir den Ablauf auf und messen, was er kostet. Dann automatisieren wir, was sich lohnt.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Start", "Ein Ablauf mit großem Hebel, fester Umfang"],
        ["Pilot", "Zielrahmen zwei bis vier Wochen"],
        ["Grundlage", "Ihre vorhandenen Werkzeuge"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Vorgehen",
        h: "Vom Ist-Ablauf zum laufenden Pilotprojekt.",
        items: [
          { h: "Ablauf aufnehmen", p: "Übergaben, Werkzeuge, Daten und Ausnahmen so aufschreiben, dass Ihr Team den Ablauf prüfen kann." },
          { h: "Messen und auswählen", p: "Die Ausgangslage messen und klären, welche Schritte sich automatisieren lassen und welche bewusst manuell bleiben." },
          { h: "Bauen", p: "Automatisierung mit Power Automate, Make, n8n, Python oder eigenem Code, je nachdem, was zu Ihrem Ablauf passt." },
          { h: "Übergeben", p: "Überwachung, Dokumentation und Übergabe, damit Ihr Team den Ablauf danach selbst betreibt." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Typische Abläufe",
        h: "Wo sich Automatisierung zuerst lohnt.",
        lede: "Dort, wo dieselben Daten zweimal getippt werden: zwischen E-Mail, Excel, CRM und ERP.",
        items: [
          { h: "Angebote und Dokumente", p: "Vorlagen aus CRM-Daten füllen, im Ablauf freigeben und versenden." },
          { h: "E-Mail-Sortierung", p: "Eingehende Mails nach Thema kennzeichnen und ins richtige Postfach oder Ticket leiten. Nach demselben Prinzip sortiert Kutasia, unser Projekt in Entwicklung, Nachrichten aus WhatsApp, Telegram und E-Mail vor." },
          { h: "Reports und Excel", p: "Wiederkehrende Auswertungen einmal bauen und automatisch neu erzeugen." },
          { h: "CRM- und ERP-Abgleich", p: "Daten einmal erfassen und zwischen Systemen abgleichen, ohne Doppelerfassung." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Werkzeuge",
        h: "Werkzeuge, die zu Ihrem Ablauf passen.",
        lede: "Wo Microsoft 365 im Haus ist, liegt Power Automate nahe. Für Verbindungen über Systemgrenzen eignen sich Make oder n8n, für Sonderfälle Python.",
        items: ["Microsoft Power Automate", "Make", "n8n, selbst gehostet", "Zapier, wo es passt", "Python", "REST-APIs und Webhooks", "PostgreSQL und Queues"],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "Drei Schritte, ein fester Umfang.",
        items: [
          { h: "Aufnehmen", p: "Workshop mit dem Team, das die Arbeit macht. Wir halten den Ablauf so fest, wie er wirklich läuft, und messen die Ausgangslage." },
          { h: "Bauen", p: "Die erste Pilot-Automatisierung, Zielrahmen zwei bis vier Wochen, im Angebot verbindlich festgelegt." },
          { h: "Übergeben", p: "Dokumentation, Übergabe an Ihr Team und eine kurze Phase der Nachbesserung." },
        ],
      },
    ],
    faq: {
      h: "Fragen zur Prozessautomatisierung",
      items: [
        { q: "Was kostet das?", a: "Das hängt vom Umfang ab. Umfang und Preis legen wir schriftlich im Angebot fest, bevor die Arbeit beginnt. Preise verstehen sich netto, zzgl. MwSt." },
        { q: "Was ist ein typisches erstes Projekt?", a: "Ein einzelner Ablauf mit großem Hebel, etwa Angebotserstellung, E-Mail-Sortierung oder ein Wochenreport. Fester Umfang, Zielrahmen zwei bis vier Wochen." },
        { q: "Brauchen wir dafür KI?", a: "Nein. Oft ist der erste sinnvolle Schritt eine saubere Automatisierung ganz ohne KI." },
        { q: "Was, wenn sich der Ablauf später ändert?", a: "Wir dokumentieren so, dass Ihre IT Anpassungen selbst vornehmen kann. Für größere Änderungen gibt es auf Wunsch einen kleinen monatlichen Rahmen." },
        { q: "Ist es sicher, kritische Abläufe zu automatisieren?", a: "Ja, mit Protokoll, Fehlerbehandlung und manuellem Rückfall. Wir planen für den Fehlerfall, nicht nur für den Idealfall." },
      ],
    },
    cta: { h: "Den ersten Ablauf wählen, der sich lohnt.", p: "Wir nehmen ihn auf, bewerten ihn und sagen Ihnen, ob er den Aufwand wert ist.", primary: CHECK, secondary: CONTACT },
    service: { type: "Business process automation" },
  },

  m365: {
    slug: "microsoft-365-automatisierung",
    meta: {
      title: "Microsoft 365 automatisieren: Power Automate, SharePoint",
      description:
        "OpSolid automatisiert Microsoft 365 mit den Lizenzen, die Sie haben: Power Automate, SharePoint, Freigaben in Teams, Outlook-Routing. Sauber dokumentiert.",
    },
    crumb: "Microsoft 365",
    hero: {
      eyebrow: "Microsoft 365",
      h1: ["Die Lizenzen haben Sie. ", "Jetzt die Abläufe", "."],
      lede: "Wir richten Teams, SharePoint, Outlook und Power Automate so ein, dass Freigaben, Dokumente und Postfach-Regeln ohne Handarbeit laufen und Daten an einem Ort liegen. Vieles davon steckt schon in Ihren Lizenzen, und manches Zusatz-Abo wird überflüssig.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Start", "Prüfung Ihres Tenants"],
        ["Pilot", "Erster Flow, Zielrahmen zwei Wochen"],
        ["Grundlage", "Standardlizenzen, wo sie reichen"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Leistung",
        h: "Was in Ihrem Tenant schon steckt.",
        items: [
          { h: "Tenant prüfen", p: "Lizenzen, Einstellungen und Werkzeuge ansehen und Automatisierungen finden, die Ihr Team noch nicht nutzt." },
          { h: "Flows bauen", p: "Power Automate für Freigaben, Dokumente, E-Mail-Routing und Benachrichtigungen." },
          { h: "Verbinden", p: "SharePoint, Teams, Outlook und Excel so verknüpfen, dass Daten an einem Ort liegen." },
          { h: "Copilot einrichten", p: "Microsoft 365 Copilot mit rollenbasiertem Zugriff und klaren Regeln aufsetzen." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Typische Abläufe",
        h: "Wo Microsoft 365 Arbeit abnimmt.",
        lede: "Dafür reicht oft, was Sie haben: Freigaben, Dokumente und Postfach-Regeln lassen sich mit den Standard-Connectoren für Outlook, Teams und SharePoint automatisieren.",
        items: [
          { h: "Freigaben in Teams", p: "Urlaub, Reisekosten, Dokumente: in Teams freigeben, in SharePoint protokollieren." },
          { h: "Dokumente aus SharePoint-Listen", p: "Angebote, Verträge und Reports aus einer Liste erzeugen, ohne Copy-Paste aus Excel." },
          { h: "Outlook-Parsing und -Routing", p: "Bestellungen, Anfragen oder Rechnungen automatisch auslesen und ins richtige System geben." },
          { h: "Copilot-Einführung", p: "Regeln, Rollen und eine kurze Schulung, damit Copilot sicher genutzt wird." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Werkzeuge",
        h: "Aus dem Microsoft-Baukasten.",
        items: ["Power Automate", "Power Apps", "SharePoint Online", "Teams, Bots, Approvals", "Outlook, Exchange", "Microsoft Graph API", "Microsoft 365 Copilot", "Entra ID"],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "Vom Tenant-Check zur Einführung.",
        items: [
          { h: "Tenant-Prüfung", p: "Lizenzen, Sicherheitseinstellungen und Werkzeuge ansehen, Ungenutztes finden." },
          { h: "Erster Flow", p: "Ein Power-Automate-Flow oder Teams-Ablauf als Pilot, Zielrahmen zwei Wochen." },
          { h: "Einführung", p: "Breiterer Einsatz mit Dokumentation, Übergabe und optionaler Schulung für Ihre IT." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu Microsoft 365",
      items: [
        { q: "Was kostet das?", a: "Das hängt vom Umfang ab. Umfang und Preis legen wir schriftlich im Angebot fest, bevor die Arbeit beginnt. Preise verstehen sich netto, zzgl. MwSt." },
        { q: "Brauchen wir Power-Automate-Premium-Lizenzen?", a: "Manchmal. Viele sinnvolle Flows kommen mit den Standardplänen aus. Wann Premium nötig ist, sagen wir Ihnen vorher." },
        { q: "Lohnt sich Microsoft 365 Copilot?", a: "Für manche Teams ja, für andere nicht. Das klären wir, bevor Sie Lizenzen kaufen." },
        { q: "Können Sie mit unserer IT zusammenarbeiten?", a: "Ja. Wir arbeiten mit Ihrer IT oder Ihrem Microsoft-Partner zusammen; OpSolid ergänzt, ersetzt aber nicht." },
        { q: "Ist das datenschutzkonform?", a: "Der Einsatz lässt sich datenschutzgerecht gestalten: EU-Datengrenze, Auftragsverarbeitung, Rollen und Rechte, dokumentierte Datenflüsse. Die abschließende Bewertung liegt bei Ihrem Datenschutzbeauftragten oder Ihrer Rechtsberatung; wir liefern die Dokumentation dafür." },
      ],
    },
    cta: { h: "Mehr aus Microsoft 365 holen.", p: "Wir zeigen Ihnen, was sich in Ihrem Tenant zu automatisieren lohnt, bevor Sie ein weiteres Abo abschließen.", primary: CHECK, secondary: CONTACT },
    service: { type: "Microsoft 365 automation" },
  },

  interneTools: {
    slug: "interne-tools",
    meta: {
      title: "Interne Tools: Admin-Panels, Dashboards, Freigaben",
      description:
        "OpSolid baut kleine, fokussierte interne Werkzeuge: Admin-Konsolen, Dashboards, Freigabe-Queues und Wissensdatenbanken. EU-gehostet, mit Quellcode.",
    },
    crumb: "Interne Tools",
    hero: {
      eyebrow: "Interne Tools",
      h1: ["Aus der Excel-Liste wird ein ", "Werkzeug", "."],
      lede: "Wo Standard-Software nicht passt, löst ein kleines, gezielt gebautes Werkzeug das Problem oft besser und schneller. Nicht jeder interne Ablauf braucht eine weitere Plattform mit Monatsabo pro Nutzer. Selbst gebaut: Für OpSo hat OpSolid Dashboard, Onboarding und Admin-Konsole entwickelt.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Pilot", "Zielrahmen drei bis sechs Wochen"],
        ["Übergabe", "Quellcode und Dokumentation"],
        ["Hosting", "EU, auf Wunsch bei Ihnen"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Was wir bauen",
        h: "Klein, schnell, für genau einen Ablauf gebaut.",
        items: [
          { h: "Admin-Konsolen", p: "Klar und fokussiert für Ihr Operations-Team, ohne Ballast." },
          { h: "Dashboards", p: "Kennzahlen, Ausnahmen und Warnungen aus Ihren Datenquellen in einer Ansicht." },
          { h: "Freigabe-Queues und Formulare", p: "Freigaben und Eskalationen, die zu Ihrem tatsächlichen Ablauf passen." },
          { h: "Wissensdatenbanken", p: "Suche über Ihre eigenen Dokumente, Richtlinien und FAQs." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Typische Werkzeuge",
        h: "Wenn das Tabellenblatt nicht mehr reicht.",
        lede: "Ein eigenes Werkzeug lohnt sich, wenn mehrere Personen ein Tabellenblatt pflegen und niemand mehr sicher weiß, welche Version stimmt.",
        items: [
          { h: "Operations-Konsole", p: "Auftragsübersicht, Ausnahmen und Kundennotizen an einem Ort statt in drei Tabs." },
          { h: "KPI-Dashboard", p: "Tages-, Wochen- und Monatszahlen aus CRM, ERP und Finanzsystem, ohne Handarbeit." },
          { h: "Freigabe-Queue", p: "Angebote, Verträge oder Erstattungen einreihen, weiterleiten und mit Verlauf freigeben." },
          { h: "KI-Wissensdatenbank", p: "Eigene Dokumente durchsuchen. Antworten bleiben in Ihrer Organisation." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Technik",
        h: "Gängige Technik, damit Ihre IT übernehmen kann.",
        items: ["Next.js, React, TypeScript", "Node.js, Python", "PostgreSQL", "REST, GraphQL, Webhooks", "Microsoft Entra ID, SSO", "EU-Hosting", "GitHub, CI/CD, Audit-Logs"],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "Von der Spezifikation zum Betrieb.",
        items: [
          { h: "Spezifikation", p: "Kurzer Workshop: Was muss das Werkzeug können, und was nicht?" },
          { h: "Bauen", p: "Pilotversion mit echten Nutzern und echten Daten, Zielrahmen drei bis sechs Wochen." },
          { h: "Übergeben", p: "Übergabe mit Dokumentation und Quellcode, auf Wunsch mit kleinem Rahmen für laufende Anpassungen." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu internen Tools",
      items: [
        { q: "Was kostet das?", a: "Das hängt vom Umfang ab. Umfang und Preis legen wir schriftlich im Angebot fest, bevor die Arbeit beginnt. Preise verstehen sich netto, zzgl. MwSt." },
        { q: "Warum nicht fertige Software?", a: "Fertige Software ist oft die richtige Wahl. Wir bauen nur, wenn sie nicht passt oder für den Zweck zu teuer wäre, und sagen Ihnen das vorher." },
        { q: "Wem gehört der Code?", a: "Das halten wir vor dem Start schriftlich fest. Vorgesehen ist die Übergabe von Quellcode und Dokumentation an Sie." },
        { q: "Wo läuft das Werkzeug?", a: "In der EU, bei einem Anbieter Ihrer Wahl oder auf Ihrer eigenen Infrastruktur." },
      ],
    },
    cta: { h: "Das Tabellenblatt ablösen.", p: "Schildern Sie uns kurz den Ablauf. Wir sagen Ihnen, ob sich ein eigenes Werkzeug lohnt oder fertige Software reicht.", primary: CHECK, secondary: CONTACT },
    service: { type: "Custom internal tools" },
  },

  schulungen: {
    slug: "ki-schulungen",
    meta: {
      title: "KI-Schulungen: drei Formate mit klaren Preisen",
      description:
        "KI-Check ab 490 €, KI-Kompetenz Basis 1.490 €, Copilot-Praxistag ab 2.400 €, jeweils zzgl. MwSt. Geübt wird an Ihren Aufgaben.",
    },
    crumb: "KI-Schulungen",
    hero: {
      eyebrow: "KI-Schulungen · Art. 4 EU-KI-Verordnung",
      h1: ["Drei Formate, ", "klare Preise", "."],
      lede: "Seit dem 2. Februar 2025 müssen Unternehmen, die KI einsetzen, nach Art. 4 der EU-KI-Verordnung Maßnahmen für ausreichende KI-Kompetenz ihrer Mitarbeitenden ergreifen. Unsere drei Formate haben festen Umfang und klaren Preis; gearbeitet wird an Ihren eigenen Aufgaben statt an Folien.",
      primary: { label: "Schulung anfragen", href: "/contact" },
      secondary: CHECK,
    },
    blocks: [
      {
        t: "table",
        id: "angebote",
        eyebrow: "Formate und Preise",
        h: "Welches Format zu Ihrem Team passt.",
        caption: "KI-Check und KI-Schulungen im Überblick",
        cols: ["Angebot", "Format", "Preis"],
        rows: [
          ["KI-Check||Der kompakte Einstieg: Gemeinsam prüfen wir, wo KI in Ihrem Arbeitsalltag sinnvoll ist und wo nicht. Durchgeführt von OpSolid, Ergebnis als kurzer schriftlicher Bericht. Einen erweiterten Umfang mit Prozesskarte und 30-Tage-Plan bieten wir zum Festpreis an, vorab schriftlich.", "90 Minuten remote, mit Bericht", "ab 490 €"],
          ["KI-Kompetenz Basis||Grundlagen für den sicheren Umgang mit KI im Arbeitsalltag. Geleitet von einer freiberuflichen Fachkraft, die OpSolid auswählt und Ihnen vorab namentlich nennt. Unterstützt Ihre Maßnahmen zur KI-Kompetenz nach Art. 4 der EU-KI-Verordnung.", "Halber Tag, bis 15 Personen", "1.490 €"],
          ["Copilot-Praxistag||Praktische Arbeit mit Microsoft 365 Copilot an Ihren eigenen Aufgaben. Für Unternehmen, die bereits Copilot-Lizenzen haben.", "1 Tag, bis 12 Personen", "ab 2.400 €"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "Geübt wird an Ihren Aufgaben.",
        items: [
          { h: "Anfrage", p: "Sie schildern Team, Aufgaben und Vorwissen. Wir empfehlen das passende Format und nennen den Preis." },
          { h: "Abstimmung", p: "Termin, Ort oder Remote, Teilnehmerzahl und Inhalte mit Beispielen aus Ihrem Alltag." },
          { h: "Durchführung", p: "Die Teilnehmenden arbeiten selbst an ihren Aufgaben, statt nur zuzuhören." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu Schulungen",
      items: [
        { q: "Bekommen wir ein Zertifikat?", a: "Die Schulung ist kein Zertifikatskurs. Sie unterstützt Ihre Maßnahmen zur KI-Kompetenz nach Art. 4 der EU-KI-Verordnung." },
        { q: "Wer führt die Schulung durch?", a: "Den KI-Check führt OpSolid selbst durch. KI-Kompetenz Basis leitet eine freiberufliche Fachkraft, die OpSolid auswählt und Ihnen vorab namentlich nennt." },
        { q: "Warum steht der KI-Check bei den Schulungen?", a: "Weil er sich als Einstieg vor einer Schulung eignet: In 90 Minuten klären wir, wo KI in Ihrem Alltag sinnvoll ist. Auf Wunsch erweitern wir ihn um eine Aufnahme Ihrer Abläufe mit Prozesskarte und 30-Tage-Plan; den Festpreis dafür nennen wir vorab schriftlich." },
        { q: "Gibt es Online-Termine?", a: "Der Einstieg in den KI-Check läuft remote. Für die anderen Formate stimmen wir Ort oder Remote-Durchführung mit Ihnen ab." },
      ],
    },
    cta: { h: "Das passende Format finden.", p: "Schreiben Sie uns kurz zu Team und Ziel. Wir empfehlen ein Format und nennen den Preis.", primary: { label: "Schulung anfragen", href: "/contact" }, secondary: CHECK },
    service: {
      type: "AI training",
      offers: [
        { name: "KI-Check", price: 490, from: true },
        { name: "KI-Kompetenz Basis", price: 1490 },
        { name: "Copilot-Praxistag", price: 2400, from: true },
      ],
    },
  },

  check: {
    slug: "ai-automation-check",
    meta: {
      title: "KI-Check: wo sich Automatisierung wirklich lohnt",
      description:
        "Der KI-Check von OpSolid ab 490 € netto: 90 Minuten remote, danach ein kurzer schriftlicher Bericht. Erweitert mit Prozesskarte und 30-Tage-Plan. NDA vorab.",
    },
    crumb: "KI-Check",
    hero: {
      eyebrow: "KI-Check · der erste Schritt",
      h1: ["Wo sich Automatisierung ", "wirklich", " lohnt."],
      lede: "Der KI-Check zeigt, welche Ihrer Abläufe sich automatisieren lassen und welche besser manuell bleiben. Der Einstieg ab 490 € netto: 90 Minuten remote und ein kurzer schriftlicher Bericht. Für einen erweiterten Umfang mit Workshop, Prozesskarte und 30-Tage-Plan nennen wir den Festpreis vorab schriftlich.",
      primary: { label: "KI-Check anfragen", href: "/contact" },
      secondary: { label: "Ablauf ansehen", href: "#ablauf" },
      spec: [
        ["Einstieg", "90 Minuten remote, kurzer schriftlicher Bericht"],
        ["Erweitert", "Workshop, Prozesskarte, fünf bewertete Kandidaten, 30-Tage-Plan"],
        ["NDA", "Vor dem Analysegespräch"],
        ["Preis", "Ab 490 € netto; erweiterter Umfang zum Festpreis, vorab schriftlich"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Warum es den Check gibt",
        h: "Woran Automatisierung oft scheitert.",
        lede: "Selten an der Technik. Häufiger wird der falsche Ablauf automatisiert, oder niemand hat aufgeschrieben, was das Team tatsächlich tut.",
        items: [
          { h: "Symptome statt Ursachen", p: "Es wird automatisiert, was auffällt, nicht was das Problem verursacht." },
          { h: "Werkzeuge ohne Anwendungsfall", p: "KI-Tools werden gekauft, bevor klar ist, wofür." },
          { h: "Keine Ausgangslage", p: "Ohne gemessenen Ist-Zustand lässt sich der Nutzen nicht belegen." },
          { h: "Unklare Grenzen", p: "Es ist offen, welche Schritte bewusst manuell bleiben sollen." },
        ],
      },
      {
        t: "table",
        id: "umfang",
        eyebrow: "Umfang und Preis",
        h: "Kompakt starten, bei Bedarf erweitern.",
        lede: "Der Einstieg kostet ab 490 €. Brauchen Sie mehr, erweitern wir den Umfang; den Festpreis dafür nennen wir vorab schriftlich.",
        caption: "KI-Check: Einstieg und erweiterter Umfang",
        cols: ["Umfang", "Format", "Preis"],
        rows: [
          ["Einstieg||Durchgeführt von OpSolid, mit den Menschen, die die Arbeit machen. Ergebnis als kurzer schriftlicher Bericht: wo KI und Automatisierung in Ihrem Arbeitsalltag sinnvoll sind und wo nicht.", "90 Minuten remote, mit Bericht", "ab 490 €"],
          ["Erweitert||Aufnahme der wichtigsten Abläufe, Prozesskarte, fünf Kandidaten bewertet nach Aufwand, Nutzen und Risiko, 30-Tage-Plan und 30 Minuten Besprechung.", "Workshop vor Ort oder remote", "Festpreis, vorab schriftlich"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
      },
      {
        t: "rows",
        eyebrow: "Für wen",
        h: "Für wen sich der Check eignet.",
        items: [
          { h: "Mittelständische Unternehmen", p: "Sie suchen einen messbaren ersten Schritt statt eines großen Plattformprojekts." },
          { h: "KI im Einsatz, aber ohne Regeln", p: "Ihr Team nutzt KI bereits, aber ohne gemeinsame Regeln und Struktur." },
          { h: "Operations-Verantwortliche", p: "Zu viele manuelle Übergaben kosten Zeit und erzeugen Fehler." },
          { h: "Vor einer Kaufentscheidung", p: "Sie bewerten Werkzeuge wie Microsoft 365, Power Automate oder Make und wollen vorher wissen, wofür." },
          { h: "Branchenfokus", p: "Dienstleistung, Gastronomie, Handel und Praxen (ohne Gesundheitsdaten). Nicht für Betriebe aus SHK, TGA, Elektro, Bau und Großhandel." },
        ],
      },
      {
        t: "steps",
        id: "ablauf",
        eyebrow: "Ablauf",
        h: "Vier Schritte, ein Festpreis.",
        items: [
          { h: "Vorgespräch", p: "Kurz Ziele, betroffene Abläufe und Umfang klären. Danach steht der Festpreis, ab 490 € netto." },
          { h: "Analysegespräch", p: "90 Minuten remote mit den Menschen, die die Arbeit tatsächlich machen; im erweiterten Umfang als Workshop, auch vor Ort." },
          { h: "Schriftliches Ergebnis", p: "Ein kurzer Bericht; im erweiterten Umfang erhalten Sie innerhalb weniger Arbeitstage Prozesskarte und 30-Tage-Plan." },
          { h: "Besprechung", p: "Im erweiterten Umfang: 30 Minuten zu Plan, Aufwand und nächsten Schritten." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Ergebnis",
        h: "Was am Ende in Ihrem Postfach liegt.",
        items: [
          { h: "Kurzer schriftlicher Bericht", tag: "Einstieg", p: "Wo KI und Automatisierung in Ihrem Arbeitsalltag sinnvoll sind und wo nicht." },
          { h: "Prozesskarte", tag: "Erweitert", p: "Die besprochenen Abläufe, schriftlich." },
          { h: "Fünf bewertete Kandidaten", tag: "Erweitert", p: "Aus Ihren echten Abläufen, mit Werkzeugempfehlung und grober Aufwandsschätzung." },
          { h: "30-Tage-Plan", tag: "Erweitert", p: "Mit Verantwortlichen und nächsten Schritten." },
          { h: "Was manuell bleibt", tag: "Erweitert", p: "Welche Schritte bewusst manuell bleiben sollten, und warum." },
        ],
      },
    ],
    faq: {
      h: "Fragen zum KI-Check",
      items: [
        { q: "Was kostet der KI-Check?", a: "Der Einstieg kostet ab 490 €: 90 Minuten remote und ein kurzer schriftlicher Bericht. Für einen erweiterten Umfang mit Workshop, Prozesskarte und 30-Tage-Plan nennen wir den Festpreis nach dem Vorgespräch schriftlich, bevor die Arbeit beginnt. Alle Preise verstehen sich netto, zzgl. MwSt." },
        { q: "Wird eine Vertraulichkeitsvereinbarung geschlossen?", a: "Ja, eine Standard-NDA wird vor dem Analysegespräch unterzeichnet." },
        { q: "Was, wenn sich nichts zu automatisieren lohnt?", a: "Dann steht genau das im schriftlichen Ergebnis, mit Begründung. Auch das ist ein Ergebnis: Sie sparen sich ein Projekt, das sich nicht trägt." },
        { q: "Was passiert nach dem Check?", a: "Drei Wege sind möglich: Sie setzen die Empfehlungen selbst um, wir setzen gemeinsam ein Pilotprojekt um, oder die Zusammenarbeit endet an dieser Stelle. Eine Bindung gehen Sie nicht ein." },
      ],
    },
    cta: { h: "Herausfinden, was sich wirklich lohnt.", p: "Ein Gespräch, ein schriftliches Ergebnis, keine Bindung. Ist der Zeitpunkt noch nicht richtig, sagen wir Ihnen das.", primary: { label: "KI-Check anfragen", href: "/contact" }, secondary: { label: "Alle Leistungen", href: "/leistungen" } },
    service: { type: "AI and automation assessment", offers: [{ name: "KI-Check", price: 490, from: true }] },
  },

  about: {
    slug: "ueber-uns",
    meta: {
      title: "Über OpSolid: erst der Ablauf, dann die Technik",
      description:
        "OpSolid baut KI-Agenten, Websites und Automatisierung für kleine und mittlere Betriebe: gemessen, dokumentiert, ohne Abhängigkeit. Nicht zu verwechseln mit TopSolid.",
    },
    crumb: "Über OpSolid",
    hero: {
      eyebrow: "Über OpSolid",
      h1: ["Erst der Ablauf, ", "dann die Technik", "."],
      lede: "OpSolid baut KI-Agenten, Websites und automatisierte Abläufe für kleine und mittlere Unternehmen. Wir verstehen zuerst, wie die Arbeit heute läuft, und entscheiden dann, was Technik daran verbessert.",
      primary: CONTACT,
      secondary: CHECK,
      spec: [
        ["Schwerpunkt", "KI-Agenten, Websites, Automatisierung"],
        ["Methode", "Analyse, Pilot, Einführung, Übergabe"],
        ["Für", "Kleine und mittlere Betriebe"],
        ["Übergabe", "Quellcode und Dokumentation"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Arbeitsweise",
        h: "Vier Grundsätze für jedes Projekt.",
        items: [
          { h: "Bei den Menschen anfangen", p: "Wir beginnen bei Ihren echten Abläufen und den Menschen, die sie erledigen, und schlagen vor, was im Alltag trägt. Wo Automatisierung nicht sinnvoll ist, sagen wir das." },
          { h: "Gemessene Ausgangslage", p: "Vor jedem Pilotprojekt halten wir fest, wie der Ablauf heute läuft und wie viel Zeit er kostet. Danach vergleichen wir mit denselben Werten." },
          { h: "Datenschutz von Anfang an", p: "EU-Hosting, eine datenschutzgerechte Einrichtung nach DSGVO und, bei Projekten mit Bezug zur Türkei, nach dem türkischen Datenschutzgesetz KVKK. Klare Zugriffsregeln gehören zum Entwurf, nicht zur Nacharbeit." },
          { h: "Ohne Abhängigkeit von uns", p: "Bei Automatisierungen und internen Tools übergeben wir Quellcode und Dokumentation. Ihre IT oder ein anderer Dienstleister kann jederzeit übernehmen." },
        ],
      },
      {
        t: "text",
        eyebrow: "Branchen",
        h: "Für welche Betriebe wir arbeiten.",
        paras: ["Branchenfokus: Dienstleistung, Gastronomie, Handel und Praxen (ohne Gesundheitsdaten). Nicht für Betriebe aus SHK/Heizung/Sanitär, TGA, Elektro, Bau und Großhandel."],
      },
      {
        t: "text",
        eyebrow: "Erfahrung",
        h: "Woher die Methode kommt.",
        lede: "Die Erfahrung hinter OpSolid stammt aus IT-Projektmanagement, Digitalisierung und Prozessoptimierung im laufenden Betrieb von Unternehmen. Jeder Schritt unserer Methode kommt von dort: Ablauf aufnehmen, Ausgangslage messen, klein pilotieren, sauber übergeben.",
        paras: [
          "Zum Werkzeugkasten gehören Microsoft 365 mit Outlook, Teams, SharePoint und Power Automate, außerdem Make, n8n, Python und eigener Code, Anbindungen an CRM und ERP sowie Hosting in der EU.",
        ],
      },
      {
        t: "rows",
        eyebrow: "Eigene Projekte",
        h: "Projekte, die unsere Arbeit zeigen.",
        items: [
          { h: "opsolid.de", tag: "Diese Website", p: "Von OpSolid gestaltet, gebaut und betrieben. Der Text steht zuerst, das Hintergrundvideo lässt sich anhalten und abschalten.", shot: SHOT.opsolid },
          { h: "OpSo", tag: "Produkt in der Testphase", p: "Digitale Visitenkarte mit NFC und QR, als Web-App gebaut, mit eigenem Dashboard, Onboarding und Admin-Konsole. Die Veröffentlichung wird vorbereitet.", href: "/opso", shot: SHOT.opso },
          { h: "Kutasia", tag: "Projekt in Entwicklung", p: "Kundennachrichten aus WhatsApp, Telegram und E-Mail in einem Posteingang, mit KI-Vorsortierung.", href: "https://kutasia.com", shot: SHOT.kutasia },
        ],
      },
      {
        t: "text",
        eyebrow: "Abgrenzung",
        h: "OpSolid ist nicht TopSolid.",
        paras: ["OpSolid ist nicht TopSolid (CAD/CAM) und steht in keiner Verbindung dazu."],
      },
    ],
    cta: { h: "Mit einem Ablauf anfangen.", p: "Wenn Ihre Abläufe zu viel Handarbeit enthalten, begleiten wir Sie von der Analyse bis zur Übergabe.", primary: CHECK, secondary: CONTACT },
  },

  contact: {
    slug: "contact",
    meta: {
      title: "Kontakt: Ablauf schildern, KI-Check anfragen",
      description:
        "Schreiben Sie OpSolid per Formular, E-Mail oder Telefon: welcher Ablauf, welche Systeme, was stört. Antwort in der Regel innerhalb weniger Arbeitstage.",
    },
    crumb: "Kontakt",
    hero: {
      eyebrow: "Kontakt",
      h1: ["Drei Sätze ", "genügen", "."],
      lede: "Schreiben Sie uns, um welchen Ablauf es geht, welche Systeme beteiligt sind und was heute stört. Per Formular, E-Mail oder Telefon; wir antworten in der Regel innerhalb weniger Arbeitstage.",
      primary: { label: "Nachricht schreiben", href: "#form-h" },
      secondary: CHECK,
    },
    blocks: [],
    cta: { h: "Lieber erst die Abläufe prüfen lassen?", p: "Der KI-Check zeigt, wo sich Automatisierung bei Ihnen lohnt: 90 Minuten remote, danach ein kurzer schriftlicher Bericht.", primary: CHECK },
  },
};
