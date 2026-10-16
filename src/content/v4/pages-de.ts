import type { PageDef } from "./types";
import type { PageKey } from "./keys";

const CHECK = { label: "KI-Check buchen", href: "/ai-automation-check" };
const CONTACT = { label: "Kontakt aufnehmen", href: "/contact" };

export const de: Record<PageKey, PageDef> = {
  home: {
    slug: "",
    meta: {
      title: "OpSolid | KI-Agents, Websites und Automatisierung aus Arnsberg",
      description:
        "Unabhängige Praxis für sprechende KI-Agents, Websites, Prozessautomatisierung und KI-Schulungen. Ich plane, baue und betreibe selbst. Arnsberg, Deutschland.",
    },
    crumb: "Start",
    hero: {
      eyebrow: "OpSolid · Praxis für KI-Agents, Websites und Automatisierung · Arnsberg",
      h1: ["Gebaut, damit es ", "läuft", "."],
      lede: "Ich entwickle sprechende KI-Agents, Websites und Abläufe für kleine und mittlere Betriebe und betreibe eigene Produkte, die heute schon im Einsatz sind.",
      primary: CHECK,
      secondary: { label: "Agents ansehen", href: "/agents" },
      scene: "stack",
    },
    blocks: [
      {
        t: "demo",
        id: "agents",
        scene: "agents",
        heat: [0],
        eyebrow: "Sprach- und Video-Agents",
        h: "Agents, die sprechen und zuhören.",
        lede: "Ich baue Sprach- und Video-Agents für Anfragen, Terminabstimmung und Auskünfte zu Ihrem Betrieb. Das Gesicht ist die Oberfläche, dahinter läuft Ihr Prozess.",
        chip: "Demo · Szenario, ohne Ton",
        play: "Szenario abspielen",
        again: "Noch einmal abspielen",
        note: "Ein gespielter Ablauf, kein Live-Gespräch. Die Live-Sprachdemo folgt, sobald Sprachanbieter und Datenschutzprüfung (DSGVO) geklärt sind.",
        sr: "Beispielgespräch. Anrufer: Guten Tag, ich möchte einen Termin für nächste Woche vereinbaren. Agent: Gern. Passt Ihnen Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr? Anrufer: Donnerstag passt. Agent: Dann trage ich Donnerstag, 14 Uhr, ein. Sie erhalten eine Bestätigung per E-Mail.",
        script: [
          { who: "Anrufer", agent: false, text: "Guten Tag, ich möchte einen Termin für nächste Woche vereinbaren.", ms: 3000 },
          { who: "Agent", agent: true, text: "Gern. Passt Ihnen Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr?", ms: 3600 },
          { who: "Anrufer", agent: false, text: "Donnerstag passt.", ms: 1400 },
          { who: "Agent", agent: true, text: "Dann trage ich Donnerstag, 14 Uhr, ein. Sie erhalten eine Bestätigung per E-Mail.", ms: 4200 },
        ],
        cta: { label: "Mehr zu Agents", href: "/agents" },
      },
      {
        t: "rows",
        id: "websites",
        scene: "websites",
        heat: [1],
        eyebrow: "Websites zum Kauf oder zur Miete",
        h: "Websites, die ich gestalte, baue und vermiete.",
        lede: "Eine Website mit eigenem Gesicht, zum Kauf oder zur Miete. Die Konditionen kläre ich mit Ihnen im Gespräch.",
        items: [
          { h: "opsolid.de", tag: "Diese Seite", p: "Gestaltet, gebaut und betrieben von mir: drei Sprachen, Text zuerst, 3D nur als Zugabe.", href: "https://opsolid.de" },
          { h: "OpSo", tag: "Produkt", p: "Digitale Visitenkarte mit NFC und QR, als eigene Web-App gebaut.", href: "https://card.opsolid.de" },
          { h: "Kutasia", tag: "Live-Demo", p: "WhatsApp, Telegram und E-Mail in einem Posteingang, mit KI-Vorsortierung.", href: "https://kutasia.com" },
        ],
        cta: { label: "Mehr zu Websites", href: "/websites" },
      },
      {
        t: "rows",
        id: "automatisierung",
        scene: "flow",
        heat: [2, 3, 4],
        eyebrow: "Prozessautomatisierung und Microsoft 365",
        h: "Abläufe, die von selbst laufen.",
        lede: "Formulare, Tabellen und Copy-Paste bringe ich auf Schienen. Was nur ein Mensch entscheiden kann, bleibt bei Ihrem Team.",
        items: [
          { h: "Prozessautomatisierung", p: "Wiederkehrende Schritte laufen ohne Nacharbeit durch.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Outlook, Teams und SharePoint verbunden mit CRM, ERP und Helpdesk.", href: "/microsoft-365-automatisierung" },
          { h: "Interne Tools", p: "Das gemeinsam genutzte Tabellenblatt wird ein zweckgebautes Werkzeug.", href: "/interne-tools" },
          { h: "KI-Beratung", p: "Wo KI sich in Ihrem Betrieb rechnet und wo nicht.", href: "/ki-beratung" },
        ],
      },
      {
        t: "spec",
        id: "ki-check",
        scene: "steps",
        heat: [5, 6],
        eyebrow: "KI-Check und KI-Schulungen",
        h: "Erst klären, dann bauen.",
        lede: "Im KI-Check gehe ich 60–90 Minuten Ihre Abläufe mit Ihnen durch. Danach erhalten Sie einen schriftlichen 30-Tage-Plan mit fünf bewerteten Kandidaten.",
        rows: [
          ["Umfang", "60–90 Minuten, vor Ort oder remote"],
          ["Ergebnis", "Prozesskarte, 5 bewertete Potenziale, 30-Tage-Plan"],
          ["Preis", "Auf Anfrage, nach dem Vorgespräch fix"],
        ],
        cta: { label: "KI-Check buchen", href: "/ai-automation-check" },
      },
      {
        t: "table",
        h: "Drei feste Schulungsangebote.",
        caption: "Stückliste KI-Schulungen",
        cols: ["Angebot", "Format", "Preis"],
        rows: [
          ["KI-Quick-Check", "90 Minuten remote, schriftlicher Bericht", "ab 490 €"],
          ["KI-Kompetenz Basis", "Halber Tag, bis 15 Personen", "1.490 €"],
          ["Copilot Praxis-Tag", "1 Tag, bis 12 Personen", "ab 2.400 €"],
        ],
        cta: { label: "Alle Schulungen", href: "/ki-schulungen" },
      },
      {
        t: "rows",
        id: "produkte",
        scene: "cards",
        eyebrow: "Eigene Produkte",
        h: "Zwei Produkte, die ich selbst betreibe.",
        lede: "Beide laufen, und beide zeigen, wie ich arbeite.",
        items: [
          { h: "OpSo", tag: "Produkt", p: "Digitale Visitenkarte mit NFC und QR: ein Link, immer aktuell, ohne App für den Empfänger.", href: "/opso" },
          { h: "Kutasia", tag: "Live-Demo", p: "Kundenkommunikation aus WhatsApp, Telegram und E-Mail in einem Posteingang.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "text",
        id: "ueber-mich",
        scene: "offset",
        eyebrow: "Über mich",
        h: "Hasan Dönmez, Arnsberg.",
        lede: "Ich arbeite allein, Sie sprechen immer mit mir. Erst der Prozess, dann die Technologie. Wo Automatisierung nicht sinnvoll ist, sage ich das.",
        paras: ["OpSolid ist nicht TopSolid (CAD/CAM) und steht in keiner Verbindung dazu."],
        cta: { label: "Mehr über mich", href: "/ueber-mich" },
      },
    ],
    faq: {
      h: "Häufige Fragen",
      items: [
        { q: "Wer arbeitet an meinem Projekt?", a: "Ich, Hasan Dönmez, persönlich. OpSolid ist eine Einzelpraxis. Wenn ich für eine Schulung eine Fachtrainerin oder einen Fachtrainer hinzuziehe, wähle ich diese Person vorab selbst aus und sage es Ihnen." },
        { q: "Wird vorab eine Vertraulichkeitsvereinbarung geschlossen?", a: "Ja. Eine Standard-NDA wird vor dem Analysegespräch unterzeichnet." },
        { q: "Brauche ich schon KI im Einsatz?", a: "Nein. Viele Projekte starten ganz ohne KI." },
        { q: "Kann ich meine bestehenden Tools behalten?", a: "Ja. Wo Microsoft 365, Google Workspace, Ihr CRM oder ERP den Ablauf tragen, nutze ich das zuerst." },
      ],
    },
    cta: {
      h: "Erstgespräch buchen oder direkt schreiben.",
      p: "Antwort in der Regel innerhalb weniger Arbeitstage.",
      primary: CHECK,
      secondary: CONTACT,
    },
    service: undefined,
  },

  agents: {
    slug: "agents",
    meta: {
      title: "KI-Agents mit Stimme und Video",
      description:
        "Sprechende KI-Agents für Anfragen, Terminabstimmung und Auskünfte: als Stimme oder 3D-Figur. Gebaut von Hasan Dönmez, mit Datenschutzprüfung vor dem Live-Betrieb.",
    },
    crumb: "Agents",
    hero: {
      eyebrow: "Agents · Sprache und Video",
      h1: ["Agents, die ", "sprechen", " und zuhören."],
      lede: "Ein Agent nimmt Anfragen an, stimmt Termine ab und beantwortet Fragen zu Ihrem Betrieb, als Stimme oder als 3D-Figur im Video. Dahinter läuft Ihr eigener Prozess.",
      primary: CHECK,
      secondary: { label: "Szenario ansehen", href: "#demo" },
      scene: "agents",
      heat: [0],
      spec: [
        ["Formate", "Sprache und Video mit 3D-Figur"],
        ["Aufgaben", "Anfragen, Termine, Auskünfte"],
        ["Status", "Szenario-Demo, Live-Demo folgt"],
      ],
    },
    blocks: [
      {
        t: "demo",
        id: "demo",
        scene: "agents",
        heat: [0],
        h: "So klingt ein Anruf.",
        lede: "Ein gespielter Ablauf mit Wellenform und beweglichem Mund. Der Agent sagt, was er tut, und übergibt, wenn ein Mensch gefragt ist.",
        chip: "Demo · Szenario, ohne Ton",
        play: "Szenario abspielen",
        again: "Noch einmal abspielen",
        note: "Ein gespielter Ablauf, kein Live-Gespräch. Die Live-Sprachdemo folgt, sobald Sprachanbieter und Datenschutzprüfung (DSGVO) geklärt sind.",
        sr: "Beispielgespräch. Anrufer: Guten Tag, ich möchte einen Termin für nächste Woche vereinbaren. Agent: Gern. Passt Ihnen Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr? Anrufer: Donnerstag passt. Agent: Dann trage ich Donnerstag, 14 Uhr, ein. Sie erhalten eine Bestätigung per E-Mail.",
        script: [
          { who: "Anrufer", agent: false, text: "Guten Tag, ich möchte einen Termin für nächste Woche vereinbaren.", ms: 3000 },
          { who: "Agent", agent: true, text: "Gern. Passt Ihnen Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr?", ms: 3600 },
          { who: "Anrufer", agent: false, text: "Donnerstag passt.", ms: 1400 },
          { who: "Agent", agent: true, text: "Dann trage ich Donnerstag, 14 Uhr, ein. Sie erhalten eine Bestätigung per E-Mail.", ms: 4200 },
        ],
      },
      {
        t: "rows",
        eyebrow: "Aufgaben",
        h: "Was ein Agent für Sie übernimmt.",
        lede: "Routine, die sich wiederholt und klaren Regeln folgt. Alles, was Urteilskraft braucht, geht an Ihr Team.",
        items: [
          { h: "Anfragen annehmen", p: "Fragen am Telefon oder im Video-Chat aufnehmen und strukturiert an Ihr Team weitergeben." },
          { h: "Termine abstimmen", p: "Freie Zeiten vorschlagen, Termin eintragen, Bestätigung senden." },
          { h: "Auskünfte geben", p: "Leistungen, Abläufe und Zeiten erklären, aus Ihren eigenen Unterlagen." },
          { h: "An Menschen übergeben", p: "Bei Beschwerden, Sonderfällen und Unsicherheit geht das Gespräch an eine Person." },
        ],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "So entsteht ein Agent.",
        items: [
          { h: "Klären", p: "Aufgaben, Grenzen und Tonfall festlegen. Was darf der Agent entscheiden, was nicht?" },
          { h: "Bauen", p: "Dialog, Stimme oder Figur gestalten und an Kalender, CRM oder Postfach anbinden." },
          { h: "Datenschutz prüfen", p: "Anbieter, Speicherort, Aufbewahrung und Hinweis auf das KI-System festlegen, bevor es live geht." },
          { h: "Testen und betreiben", p: "Gespräche prüfen, nachschärfen und den Agent im Alltag begleiten." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu Agents",
      items: [
        { q: "Spricht der Agent heute schon live?", a: "Heute zeige ich ein gespieltes Szenario. Die Live-Sprachdemo folgt, sobald Sprachanbieter und Datenschutzprüfung geklärt sind." },
        { q: "Wer hört die Gespräche mit?", a: "Das lege ich vorab mit Ihnen fest: Anbieter, Speicherort, Aufbewahrung und Zugriff. Anrufer erfahren zu Beginn, dass ein KI-System spricht." },
        { q: "Ersetzt ein Agent mein Team?", a: "Nein. Er nimmt Routine ab und übergibt, sobald eine Person gefragt ist." },
        { q: "Wie starte ich?", a: "Mit dem KI-Check. Dort kläre ich mit Ihnen, ob ein Agent für Ihren Betrieb sinnvoll ist und welche Aufgaben er übernehmen sollte." },
      ],
    },
    cta: { h: "Prüfen, ob ein Agent für Sie passt.", p: "Im KI-Check kläre ich Aufgaben, Grenzen und Datenschutz, bevor etwas gebaut wird.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI voice and video agents" },
  },

  websites: {
    slug: "websites",
    meta: {
      title: "Websites gestalten, bauen und mieten",
      description:
        "Websites mit eigenem Gesicht, zum Kauf oder zur Miete. Gestaltung, Bau und Betrieb aus einer Hand. Gezeigt werden nur Seiten, die Hasan Dönmez selbst gebaut hat.",
    },
    crumb: "Websites",
    hero: {
      eyebrow: "Websites · Kauf oder Miete",
      h1: ["Websites, die ich ", "gestalte, baue", " und vermiete."],
      lede: "Eine Website mit eigenem Gesicht, schnell, gut lesbar und in mehreren Sprachen. Sie kaufen sie oder mieten sie. Die Konditionen kläre ich mit Ihnen im Gespräch.",
      primary: CONTACT,
      secondary: { label: "Referenzen ansehen", href: "#referenzen" },
      scene: "websites",
      heat: [1],
      spec: [
        ["Modelle", "Kauf oder Miete"],
        ["Sprachen", "Deutsch, Englisch, Türkisch möglich"],
        ["Preise", "Nach Umfang, im Gespräch"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Leistung",
        h: "Was Sie bekommen.",
        items: [
          { h: "Gestaltung", p: "Eine eigene Handschrift statt Vorlage: Typografie, Farbe und Bewegung passen zu Ihrem Betrieb." },
          { h: "Bau", p: "Text zuerst, schnelle Ladezeit, barrierearm, sauber für Suchmaschinen und KI-Suche aufgebaut." },
          { h: "Mehrsprachigkeit", p: "Mehrere Sprachen mit eigenen Adressen und sauberer Auszeichnung für die Suche." },
          { h: "Kauf oder Miete", p: "Kauf: Sie erhalten die fertige Website. Miete: Sie nutzen sie laufend, ich kümmere mich um den Betrieb. Die Konditionen legen Sie und ich gemeinsam fest." },
        ],
      },
      {
        t: "rows",
        id: "referenzen",
        scene: "websites",
        heat: [1],
        eyebrow: "Referenzen",
        h: "Seiten, die ich selbst gebaut habe.",
        lede: "Hier zeige ich nur Seiten und Produkte, die ich selbst gebaut habe und betreibe. Kundenseiten folgen, sobald es welche gibt.",
        items: [
          { h: "opsolid.de", tag: "Diese Seite", p: "Drei Sprachen, Text zuerst, mit 3D-Bühne als Zugabe, die sich abschalten lässt.", href: "https://opsolid.de" },
          { h: "OpSo", tag: "Produkt", p: "Digitale Visitenkarte als Web-App: Profil, QR und NFC-Link.", href: "https://card.opsolid.de" },
          { h: "Kutasia", tag: "Live-Demo", p: "Posteingang für WhatsApp, Telegram und E-Mail mit KI-Vorsortierung.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "Vom Gespräch zur fertigen Seite.",
        items: [
          { h: "Gespräch", p: "Ziel, Zielgruppe, Inhalte und Sprachen klären. Ich nenne danach Umfang und Preis." },
          { h: "Entwurf", p: "Struktur und Gestaltung der wichtigsten Seiten, mit Ihrem Feedback." },
          { h: "Bau", p: "Umsetzung mit Texten, Bildern und Formularen, getestet auf Handy und Desktop." },
          { h: "Start und Betrieb", p: "Veröffentlichung, Domain, Datenschutz-Bausteine und auf Wunsch laufende Pflege." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu Websites",
      items: [
        { q: "Kauf oder Miete, was ist besser?", a: "Das hängt davon ab, ob Sie die Seite selbst weiterführen wollen. Beim Kauf gehört sie Ihnen, bei der Miete kümmere ich mich um den Betrieb. Das kläre ich mit Ihnen im Gespräch." },
        { q: "Wie lange dauert eine Website?", a: "Das hängt vom Umfang ab. Nach dem Gespräch nenne ich einen konkreten Zeitplan." },
        { q: "Wem gehören Texte und Bilder?", a: "Inhalte, die Sie liefern, bleiben Ihre. Die Nutzungsrechte an Gestaltung und Code halte ich vorab schriftlich fest." },
        { q: "Kann die Seite 3D und Bewegung enthalten?", a: "Ja, als Zugabe. Der Text steht immer zuerst, und die Effekte lassen sich abschalten und respektieren die Einstellung für weniger Bewegung." },
      ],
    },
    cta: { h: "Ihre Website besprechen.", p: "Schreiben Sie mir kurz, was die Seite leisten soll. Ich melde mich in der Regel innerhalb weniger Arbeitstage.", primary: CONTACT },
    service: { type: "Website design, development and rental" },
  },

  leistungen: {
    slug: "leistungen",
    meta: {
      title: "Leistungen: Agents, Websites, Automatisierung, KI",
      description:
        "Sieben Leistungen aus einer Praxis: KI-Agents, Websites, Prozessautomatisierung, Microsoft 365, interne Tools, KI-Beratung und KI-Schulungen.",
    },
    crumb: "Leistungen",
    hero: {
      eyebrow: "Leistungen",
      h1: ["Sieben Bereiche, ", "eine Praxis", "."],
      lede: "Ich übernehme einzelne Bausteine oder das ganze Setup. Der KI-Check zeigt, wo es anfängt.",
      primary: CHECK,
      scene: "stack",
      heat: [0, 1, 2, 3, 4, 5, 6],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Alle Leistungen",
        h: "Jede Platte im Stapel ist ein Angebot.",
        items: [
          { h: "Agents", tag: "Stimme · Video", p: "Sprechende KI-Agents für Anfragen, Termine und Auskünfte.", href: "/agents" },
          { h: "Websites", tag: "Bau · Miete", p: "Gestaltet, gebaut und auf Wunsch vermietet.", href: "/websites" },
          { h: "Prozessautomatisierung", p: "Abläufe, die von selbst laufen.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Outlook, Teams und SharePoint verbunden mit Ihren Fachsystemen.", href: "/microsoft-365-automatisierung" },
          { h: "Interne Tools", p: "Das Tabellenblatt ablösen, durch ein kleines, zweckgebautes Werkzeug.", href: "/interne-tools" },
          { h: "KI-Beratung", p: "Wo KI sich rechnet, und wo nicht.", href: "/ki-beratung" },
          { h: "KI-Schulungen", tag: "Team", p: "Drei feste Angebote mit festen Preisen.", href: "/ki-schulungen" },
        ],
      },
    ],
    cta: { h: "Nicht sicher, wo anfangen?", p: "Im KI-Check ordne ich Ihre Abläufe und wähle den Baustein, der sich zuerst lohnt.", primary: CHECK, secondary: CONTACT },
  },

  kiBeratung: {
    slug: "ki-beratung",
    meta: {
      title: "KI-Beratung für den Mittelstand: Use Cases, Risiko, Roadmap",
      description:
        "KI-Beratung für kleine und mittlere Betriebe: lohnende Use Cases finden, Nutzen und Risiko abwägen, eine schriftliche Roadmap und DSGVO-konformen Einsatz aufsetzen.",
    },
    crumb: "KI-Beratung",
    hero: {
      eyebrow: "KI-Beratung",
      h1: ["Welche KI lohnt sich für ", "Ihren Betrieb", " wirklich?"],
      lede: "Ich finde drei bis fünf KI-Use-Cases, die zu Ihnen passen, bewerte Nutzen, Aufwand und Risiko und halte das Ergebnis als Roadmap schriftlich fest.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "steps",
      heat: [5],
      spec: [
        ["Ergebnis", "Use-Case-Bewertung und schriftliche Roadmap"],
        ["Dauer", "In der Regel zwei bis vier Wochen"],
        ["Haltung", "Unabhängig, ich verkaufe keine KI-Tools"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Was ich tue",
        h: "So sieht KI-Beratung aus.",
        items: [
          { h: "Use Cases finden", p: "Drei bis fünf Anwendungen identifizieren, die zu Ihrem Betrieb passen, und die unpassenden klar ausschließen." },
          { h: "Bewerten", p: "Jeden Use Case nach erwartetem Nutzen, Aufwand und Betriebsrisiko einordnen." },
          { h: "Roadmap festhalten", p: "Eine Roadmap für 6 bis 12 Monate mit Verantwortlichen, Kosten und Entscheidungspunkten." },
          { h: "Datenschutz aufsetzen", p: "DSGVO-konformen Einsatz vorbereiten: Modellwahl, Datenhoheit und eine kurze Unternehmensrichtlinie." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Einsatzfelder",
        h: "Typische Anwendungen.",
        lede: "Das sind typische Beispiele, keine Kundenprojekte.",
        items: [
          { h: "Dokumenten- und Vertragsanalyse", p: "Lange PDFs vorsortieren, Klauseln und Fristen sichtbar machen. Der Mensch prüft die Zusammenfassung." },
          { h: "Interne Wissenssuche", p: "Richtlinien, FAQs und SharePoint durchsuchbar machen, mit Antworten aus Ihren eigenen Dokumenten." },
          { h: "Angebotsentwürfe", p: "Angebote aus Vorlage, CRM-Datensatz und kurzem Briefing entwerfen. Der Vertrieb prüft und gibt frei." },
          { h: "Support-Triage", p: "Eingehende Anfragen nach Thema und Dringlichkeit sortieren, bevor eine Person sie bearbeitet." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Werkzeuge",
        h: "Modelle, Anbieter und Bausteine.",
        items: ["OpenAI", "Anthropic Claude", "Microsoft Copilot, Azure OpenAI", "Mistral und Open-Source-Modelle", "Retrieval-Augmented Generation", "pgvector, Qdrant", "EU-Hosting"],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "So läuft eine KI-Beratung.",
        items: [
          { h: "Discovery", p: "Kurzes Gespräch zu Team, Daten und Zielen." },
          { h: "Use-Case-Bewertung", p: "Workshop und schriftliche Analyse: welche Anwendungen lohnen sich, welche nicht." },
          { h: "Roadmap und Richtlinie", p: "Entscheidungsreife Roadmap plus kurze schriftliche KI-Richtlinie für Ihren Betrieb." },
        ],
      },
    ],
    faq: {
      h: "Fragen zur KI-Beratung",
      items: [
        { q: "Muss mein Betrieb schon „KI-ready“ sein?", a: "Nein. Gerade dann lohnt die Beratung, bevor Geld in Werkzeuge fließt." },
        { q: "Verkaufen Sie KI-Tools?", a: "Nein. Ich bin unabhängig und empfehle, was passt. Das kann auch heißen: nutzen Sie, was Sie haben, oder warten Sie noch." },
        { q: "Lässt sich KI DSGVO-konform einsetzen?", a: "Ja, mit der passenden Modellwahl, EU-Hosting und einer schriftlichen Richtlinie. Ich setze das von Anfang an mit auf." },
        { q: "Wie lange dauert eine Beratung?", a: "In der Regel zwei bis vier Wochen für Analyse und Roadmap. Umsetzungszeiträume sind separat und hängen vom Umfang ab." },
      ],
    },
    cta: { h: "Finden Sie heraus, welche KI sich lohnt.", p: "Ein Gespräch, eine schriftliche Roadmap, kein Plattform-Pitch.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI consulting" },
  },

  prozess: {
    slug: "prozessautomatisierung",
    meta: {
      title: "Prozessautomatisierung für den Mittelstand",
      description:
        "Manuelle Abläufe automatisieren: Angebote, Dokumente, E-Mail-Routing, Reports und Datenabgleich. Auf den Werkzeugen, die Sie schon bezahlen. DSGVO-bewusst.",
    },
    crumb: "Prozessautomatisierung",
    hero: {
      eyebrow: "Prozessautomatisierung",
      h1: ["Aufgaben, die ", "niemand mehr von Hand", " machen sollte."],
      lede: "Angebote, die einen halben Tag dauern. Reports, die jeden Montag neu gebaut werden. Daten, die zwischen Excel, CRM und E-Mail wandern. Ich kartiere den Ablauf und automatisiere, was sich lohnt.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "flow",
      heat: [2],
      spec: [
        ["Start", "Ein Ablauf mit großem Hebel, fester Umfang"],
        ["Dauer", "Pilot meist in zwei bis vier Wochen"],
        ["Grundlage", "Ihre vorhandenen Werkzeuge"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Was ich tue",
        h: "So sieht Prozessautomatisierung aus.",
        items: [
          { h: "Ablauf kartieren", p: "Übergaben, Werkzeuge, Daten und Ausnahmen so aufschreiben, dass Ihr Team es prüfen kann." },
          { h: "Auswählen", p: "Klären, welche Schritte sich automatisieren lassen und welche bewusst manuell bleiben." },
          { h: "Bauen", p: "Automatisierung mit Power Automate, Make, n8n, Python oder eigenem Code, je nachdem, was passt." },
          { h: "Übergeben", p: "Überwachung, Dokumentation und Übergabe, damit Ihr Team den Ablauf danach selbst betreibt." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Einsatzfelder",
        h: "Typische Abläufe.",
        lede: "Typische Beispiele, keine Kundenprojekte.",
        items: [
          { h: "Angebote und Dokumente", p: "Vorlagen aus CRM-Daten füllen, im Ablauf freigeben und versenden." },
          { h: "E-Mail-Sortierung", p: "Eingehende Mails nach Thema kennzeichnen und in das richtige Postfach oder Ticket leiten." },
          { h: "Reports und Excel", p: "Wiederkehrende Auswertungen einmal bauen und automatisch neu erzeugen." },
          { h: "CRM- und ERP-Abgleich", p: "Daten einmal erfassen und zwischen Systemen abgleichen, ohne Doppelerfassung." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Werkzeuge",
        h: "Womit ich automatisiere.",
        items: ["Microsoft Power Automate", "Make", "n8n, selbst gehostet", "Zapier, wo es passt", "Python", "REST-APIs und Webhooks", "PostgreSQL und Queues"],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "So läuft ein Automatisierungsprojekt.",
        items: [
          { h: "Kartieren", p: "Workshop mit dem Team, das die Arbeit macht. Ich schreibe den Ablauf auf, wie er wirklich läuft." },
          { h: "Bauen", p: "Die erste Pilot-Automatisierung, meist innerhalb von zwei bis vier Wochen." },
          { h: "Betreiben", p: "Dokumentation, Übergabe und eine kurze Phase der Nachbesserung." },
        ],
      },
    ],
    faq: {
      h: "Fragen zur Prozessautomatisierung",
      items: [
        { q: "Was ist ein typisches erstes Projekt?", a: "Ein einzelner Ablauf mit großem Hebel, etwa Angebotserstellung, E-Mail-Sortierung oder ein Wochenreport. Fester Umfang, zwei bis vier Wochen." },
        { q: "Muss ich meine Werkzeuge ersetzen?", a: "Nein. Ich automatisiere auf dem, was Sie haben: Microsoft 365, Google Workspace, Ihr CRM, Ihr ERP." },
        { q: "Was, wenn sich der Ablauf später ändert?", a: "Ich dokumentiere so, dass Ihre IT Anpassungen selbst machen kann. Für größere Änderungen gibt es auf Wunsch einen kleinen monatlichen Rahmen." },
        { q: "Ist es sicher, kritische Abläufe zu automatisieren?", a: "Ja, mit Protokoll, Fehlerbehandlung und manuellem Rückfall. Ich plane für den Fehlerfall, nicht nur für den Idealfall." },
      ],
    },
    cta: { h: "Den ersten Ablauf wählen, der sich lohnt.", p: "Ich kartiere ihn, bewerte ihn und sage Ihnen, ob er den Aufwand wert ist.", primary: CHECK, secondary: CONTACT },
    service: { type: "Business process automation" },
  },

  m365: {
    slug: "microsoft-365-automatisierung",
    meta: {
      title: "Microsoft 365 Automatisierung: Power Automate, SharePoint, Teams",
      description:
        "Abläufe in Microsoft 365 automatisieren: Power Automate, SharePoint, Teams-Freigaben und Outlook-Routing, EU-gehostet und datenschutzbewusst.",
    },
    crumb: "Microsoft 365",
    hero: {
      eyebrow: "Microsoft 365",
      h1: ["Microsoft 365 ist da. ", "Jetzt arbeitet es", " für Sie."],
      lede: "Teams, SharePoint, Outlook und Power Automate sind bezahlt. Mit dem richtigen Setup ersetzen sie viele Zusatz-Abos und halten Daten an einem Ort.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "flow",
      heat: [3],
      spec: [
        ["Start", "Review Ihres Tenants"],
        ["Pilot", "Erster Flow meist in zwei Wochen"],
        ["Grundlage", "Standardlizenzen, wo es reicht"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Was ich tue",
        h: "So sieht Microsoft-365-Automatisierung aus.",
        items: [
          { h: "Tenant prüfen", p: "Lizenzen, Setup und Werkzeuge ansehen und Automatisierungen finden, die Ihr Team noch nicht nutzt." },
          { h: "Flows bauen", p: "Power Automate für Freigaben, Dokumente, E-Mail-Routing und Benachrichtigungen." },
          { h: "Verbinden", p: "SharePoint, Teams, Outlook und Excel so verknüpfen, dass Daten an einem Ort liegen." },
          { h: "Copilot ordnen", p: "Microsoft 365 Copilot mit rollenbasiertem Zugriff und klaren Regeln aufsetzen." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Einsatzfelder",
        h: "Typische Abläufe in Microsoft 365.",
        lede: "Typische Beispiele, keine Kundenprojekte.",
        items: [
          { h: "Freigaben in Teams", p: "Urlaub, Reisekosten, Dokumente: in Teams freigeben, in SharePoint protokollieren." },
          { h: "Dokumente aus SharePoint-Listen", p: "Angebote, Verträge und Reports aus einer Liste erzeugen, ohne Copy-Paste aus Excel." },
          { h: "Outlook-Parsing und -Routing", p: "Bestellungen, Anfragen oder Rechnungen automatisch auslesen und ins richtige System geben." },
          { h: "Copilot-Einführung", p: "Regeln, Rollen und kurze Schulung, damit Copilot sicher genutzt wird." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Werkzeuge",
        h: "Womit ich arbeite.",
        items: ["Power Automate", "Power Apps", "SharePoint Online", "Teams, Bots, Approvals", "Outlook, Exchange", "Microsoft Graph API", "Microsoft 365 Copilot", "Entra ID"],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "So läuft ein Microsoft-365-Projekt.",
        items: [
          { h: "Tenant-Review", p: "Lizenzen, Sicherheits-Setup und Werkzeuge ansehen, Ungenutztes finden." },
          { h: "Erster Flow", p: "Ein Power-Automate-Flow oder Teams-Ablauf als Pilot, meist in zwei Wochen." },
          { h: "Rollout", p: "Breiterer Einsatz mit Dokumentation, Übergabe und optionaler Schulung für Ihre IT." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu Microsoft 365",
      items: [
        { q: "Brauche ich Power-Automate-Premium-Lizenzen?", a: "Manchmal. Die meisten sinnvollen Flows laufen mit den Standardplänen. Ich sage Ihnen, wann Premium nötig ist." },
        { q: "Lohnt sich Microsoft 365 Copilot?", a: "Für manche Teams ja, für andere nicht. Das kläre ich, bevor Sie Lizenzen kaufen." },
        { q: "Können Sie mit unserer IT zusammenarbeiten?", a: "Ja. Die meisten Projekte laufen gemeinsam mit Ihrer IT oder Ihrem Microsoft-Partner. Ich ergänze, ich ersetze nicht." },
        { q: "Ist das DSGVO-konform?", a: "Microsoft 365 im EU-Tenant lässt sich DSGVO-konform betreiben. Ich konfiguriere es sauber und dokumentiere die Datenflüsse." },
      ],
    },
    cta: { h: "Mehr aus Microsoft 365 holen.", p: "Ich sage Ihnen, was sich in Ihrem Tenant zu automatisieren lohnt, bevor Sie ein weiteres Abo abschließen.", primary: CHECK, secondary: CONTACT },
    service: { type: "Microsoft 365 automation" },
  },

  interneTools: {
    slug: "interne-tools",
    meta: {
      title: "Interne Tools: Admin-Panels, Dashboards, Freigabe-Queues",
      description:
        "Kleine, fokussierte interne Werkzeuge für den Mittelstand: Admin-Konsolen, Dashboards, Freigabe-Queues und Wissensdatenbanken, EU-gehostet.",
    },
    crumb: "Interne Tools",
    hero: {
      eyebrow: "Interne Tools",
      h1: ["Wo Standard-Software nicht passt, ", "löst ein kleines Werkzeug", " das Problem."],
      lede: "Nicht jeder interne Job braucht eine Plattform für 500 Euro im Monat. Oft löst ein kleines, gezielt gebautes Werkzeug das Problem besser, günstiger und schneller.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "cards",
      heat: [4],
      spec: [
        ["Pilot", "In drei bis sechs Wochen"],
        ["Übergabe", "Quellcode und Dokumentation"],
        ["Hosting", "EU, auf Wunsch bei Ihnen"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Was ich baue",
        h: "Werkzeuge für den Betriebsalltag.",
        items: [
          { h: "Admin-Konsolen", p: "Klar und fokussiert für Ihr Operations-Team, ohne Ballast." },
          { h: "Dashboards", p: "Kennzahlen, Ausnahmen und Warnungen aus Ihren Datenquellen in einer Ansicht." },
          { h: "Freigabe-Queues und Formulare", p: "Freigaben und Eskalationen, die zu Ihrem echten Ablauf passen." },
          { h: "Wissensdatenbanken", p: "Suche über Ihre eigenen Dokumente, Richtlinien und FAQs." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Einsatzfelder",
        h: "Typische Werkzeuge.",
        lede: "Typische Beispiele, keine Kundenprojekte.",
        items: [
          { h: "Operations-Konsole", p: "Auftragsübersicht, Ausnahmen und Kundennotizen an einem Ort statt in drei Tabs." },
          { h: "KPI-Dashboard", p: "Tages-, Wochen- und Monatszahlen aus CRM, ERP und Finanzsystem, ohne Handarbeit." },
          { h: "Freigabe-Queue", p: "Angebote, Verträge oder Erstattungen einreihen, routen und mit Verlauf freigeben." },
          { h: "KI-Wissensdatenbank", p: "Eigene Dokumente durchsuchen. Antworten bleiben in Ihrer Organisation." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Technik",
        h: "Womit ich baue.",
        items: ["Next.js, React, TypeScript", "Node.js, Python", "PostgreSQL", "REST, GraphQL, Webhooks", "Microsoft Entra ID, SSO", "EU-Hosting", "GitHub, CI/CD, Audit-Logs"],
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "So läuft ein Projekt für ein internes Tool.",
        items: [
          { h: "Spezifikation", p: "Kurzer Workshop: was das Werkzeug können muss und was nicht." },
          { h: "Bauen", p: "Pilotversion in drei bis sechs Wochen, mit echten Nutzern und echten Daten." },
          { h: "Betreiben", p: "Übergabe mit Dokumentation und Quellcode, auf Wunsch mit kleinem Rahmen für laufende Anpassung." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu internen Tools",
      items: [
        { q: "Warum nicht fertige Software?", a: "Fertige Software ist oft die richtige Wahl. Ich baue nur, wenn sie nicht passt oder zu teuer für den Zweck wäre. Das sage ich Ihnen ehrlich." },
        { q: "Wem gehört der Code?", a: "Das halte ich vor dem Start schriftlich fest. Üblich ist die Übergabe von Quellcode und Dokumentation." },
        { q: "Wo läuft das Werkzeug?", a: "In der EU, bei einem Anbieter Ihrer Wahl oder auf Ihrer eigenen Infrastruktur." },
      ],
    },
    cta: { h: "Das Tabellenblatt ablösen.", p: "Schildern Sie mir kurz den Ablauf. Ich sage Ihnen, ob ein eigenes Werkzeug sich lohnt.", primary: CHECK, secondary: CONTACT },
    service: { type: "Custom internal tools" },
  },

  schulungen: {
    slug: "ki-schulungen",
    meta: {
      title: "KI-Schulungen: drei feste Angebote mit klaren Preisen",
      description:
        "KI-Quick-Check ab 490 €, KI-Kompetenz Basis 1.490 €, Copilot Praxis-Tag ab 2.400 €. Praxis statt Theorie, für Ihr Team, auf Deutsch, Englisch oder Türkisch.",
    },
    crumb: "KI-Schulungen",
    hero: {
      eyebrow: "KI-Schulungen",
      h1: ["Drei feste Angebote, ", "klar bepreist", "."],
      lede: "Kein Baukasten, keine Abos. Sie wählen das Format, das zu Ihrem Team passt. Die Schulungen sind praxisnah: mit Ihren Aufgaben statt mit Folien.",
      primary: { label: "Anfrage senden", href: "/contact" },
      secondary: CHECK,
      scene: "steps",
      heat: [6],
    },
    blocks: [
      {
        t: "table",
        id: "angebote",
        eyebrow: "Angebote",
        h: "Was ich anbiete.",
        caption: "Stückliste KI-Schulungen",
        cols: ["Angebot", "Format", "Preis"],
        rows: [
          ["KI-Quick-Check||Gemeinsam prüfen, wo KI im Alltag sinnvoll ist und wo nicht. Ergebnis als kurzer schriftlicher Bericht. Die ersten 3 Piloten sind kostenlos, im Austausch gegen ehrliches Feedback.", "90 Minuten remote, mit Bericht", "ab 490 €"],
          ["KI-Kompetenz Basis||Grundlagen für den sicheren Umgang mit KI im Arbeitsalltag. Durchgeführt von einer freiberuflichen Fachtrainerin oder einem Fachtrainer, die ich vorab persönlich auswähle. Unterstützt Ihre Maßnahmen zur KI-Kompetenz nach Art. 4 der EU-KI-Verordnung.", "Halber Tag, bis 15 Personen", "1.490 €"],
          ["Copilot Praxis-Tag||Praktische Arbeit mit Microsoft 365 Copilot an Ihren eigenen Aufgaben. Für Betriebe, die bereits Copilot-Lizenzen haben.", "1 Tag, bis 12 Personen", "ab 2.400 €"],
        ],
        note: "Sprachen: Deutsch, Englisch und Türkisch.",
      },
      {
        t: "steps",
        eyebrow: "Ablauf",
        h: "So läuft eine Schulung.",
        items: [
          { h: "Anfrage", p: "Sie schildern Team, Aufgaben und Vorwissen. Ich empfehle das passende Format." },
          { h: "Abstimmung", p: "Termin, Ort oder Remote, Teilnehmerzahl und Inhalte mit Beispielen aus Ihrem Alltag." },
          { h: "Durchführung", p: "Praxis an Ihren Aufgaben. Teilnehmende arbeiten selbst, statt zuzuhören." },
        ],
      },
    ],
    faq: {
      h: "Fragen zu Schulungen",
      items: [
        { q: "Bekommen wir ein Zertifikat?", a: "Die Schulung ist kein Zertifikatskurs. Sie unterstützt Ihre Maßnahmen zur KI-Kompetenz nach Art. 4 der EU-KI-Verordnung." },
        { q: "Wer führt die Schulung durch?", a: "Den KI-Quick-Check führe ich selbst durch. Bei KI-Kompetenz Basis übernimmt eine freiberufliche Fachperson, die ich vorab persönlich auswähle." },
        { q: "Gibt es Online-Termine?", a: "Der Quick-Check läuft remote. Die anderen Formate stimme ich mit Ihnen ab." },
      ],
    },
    cta: { h: "Das passende Format finden.", p: "Schreiben Sie mir kurz zu Team und Ziel. Ich empfehle ein Format und nenne den Preis.", primary: { label: "Anfrage senden", href: "/contact" }, secondary: CHECK },
    service: {
      type: "AI training",
      offers: [
        { name: "KI-Quick-Check", price: 490, from: true },
        { name: "KI-Kompetenz Basis", price: 1490 },
        { name: "Copilot Praxis-Tag", price: 2400, from: true },
      ],
    },
  },

  check: {
    slug: "ai-automation-check",
    meta: {
      title: "KI-Check: Automatisierungspotenzial mit 30-Tage-Plan",
      description:
        "60–90 Minuten Analysegespräch und ein schriftlicher 30-Tage-Plan mit fünf bewerteten Automatisierungskandidaten. Der risikoarme erste Schritt.",
    },
    crumb: "KI-Check",
    hero: {
      eyebrow: "KI-Check · Einstiegsangebot",
      h1: ["Das ", "echte", " Automatisierungs\u00ADpotenzial finden."],
      lede: "Ein fokussiertes Analysegespräch von 60–90 Minuten und ein schriftlicher 30-Tage-Plan mit fünf konkreten Kandidaten, bewertet nach Aufwand, Nutzen und Risiko.",
      primary: { label: "KI-Check anfragen", href: "/contact" },
      secondary: { label: "Ablauf ansehen", href: "#ablauf" },
      scene: "steps",
      heat: [5],
      spec: [
        ["Umfang", "60–90 Minuten, vor Ort oder remote"],
        ["Ergebnis", "Prozesskarte, 5 bewertete Potenziale, 30-Tage-Plan"],
        ["Preis", "Auf Anfrage, nach dem Vorgespräch fix"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Warum es ihn gibt",
        h: "Viele Automatisierungsprojekte scheitern, bevor sie beginnen.",
        lede: "Nicht an der Technik, sondern weil der falsche Ablauf automatisiert wird oder nie aufgeschrieben wurde, was das Team tut.",
        items: [
          { h: "Symptome statt Ursachen", p: "Es wird automatisiert, was auffällt, nicht was das Problem verursacht." },
          { h: "Werkzeuge ohne Anwendungsfall", p: "KI-Tools werden gekauft, bevor klar ist, wofür." },
          { h: "Keine Ausgangslage", p: "Ohne Ist-Zustand lässt sich der Nutzen nicht messen." },
          { h: "Unklare Grenzen", p: "Es ist offen, welche Schritte bewusst manuell bleiben sollen." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Enthalten",
        h: "Was im Check steckt.",
        items: [
          { h: "Analysegespräch, 60–90 Minuten", p: "Vor Ort oder remote. Ich höre zu, wie Arbeit durch Ihr Team fließt, ohne Folien." },
          { h: "Aufnahme der wichtigsten Abläufe", p: "Die Abläufe werden so aufgeschrieben, dass Ihr Team mitprüfen kann." },
          { h: "5 konkrete Potenziale", p: "Aus Ihren echten Abläufen, keine allgemeine KI-Wunschliste." },
          { h: "Bewertung nach Aufwand, Nutzen, Risiko", p: "Damit die Leitung ohne Technikwissen priorisieren kann." },
          { h: "30-Tage-Plan", p: "Nächste Schritte, Werkzeuge, Verantwortliche und erwartetes Ergebnis." },
          { h: "Optional: ein Pilot-Workflow", p: "Wo es sinnvoll ist, setze ich die erste Automatisierung um, mit festem Umfang und Zeitrahmen." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Für wen",
        h: "Für wen der Check passt.",
        items: [
          { h: "Mittelständische Betriebe", p: "Die einen messbaren ersten Schritt wollen." },
          { h: "Teams mit Schatten-KI", p: "Die KI schon nutzen und Struktur suchen." },
          { h: "Operations-Verantwortliche", p: "Mit zu vielen manuellen Übergaben." },
          { h: "Betriebe, die Werkzeuge bewerten", p: "Etwa Microsoft 365, Power Automate oder Make." },
        ],
      },
      {
        t: "steps",
        id: "ablauf",
        eyebrow: "Ablauf",
        h: "So läuft der Check.",
        items: [
          { h: "Kickoff", p: "Kurzes Vorgespräch zu Zielen und den Abläufen im Umfang. Danach steht der Festpreis." },
          { h: "Analysegespräch", p: "60–90 Minuten mit den Menschen, die die Arbeit tatsächlich machen." },
          { h: "Schriftlicher Plan", p: "Innerhalb weniger Arbeitstage erhalten Sie den 30-Tage-Plan." },
          { h: "Durchsprache", p: "30 Minuten zu Umfang, Aufwand und nächsten Schritten." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Ergebnis",
        h: "Was am Ende in Ihrem Postfach liegt.",
        items: [
          { h: "Prozesskarte", p: "Die besprochenen Abläufe, schriftlich." },
          { h: "5 bewertete Potenziale", p: "Mit Werkzeugempfehlung und grober Aufwandsschätzung." },
          { h: "30-Tage-Plan", p: "Mit Verantwortlichen." },
          { h: "Notiz zum Manuellen", p: "Was bewusst manuell bleiben sollte, und warum." },
        ],
      },
    ],
    faq: {
      h: "Fragen zum KI-Check",
      items: [
        { q: "Was kostet der KI-Check?", a: "Der Preis hängt von Umfang und Teamgröße ab. Nach dem Vorgespräch nenne ich einen Festpreis. Eine kürzere Variante mit Kurzbericht ist der KI-Quick-Check ab 490 €." },
        { q: "Wird eine Vertraulichkeitsvereinbarung geschlossen?", a: "Ja, eine Standard-NDA wird vor dem Analysegespräch unterzeichnet." },
        { q: "Ist das nur für Betriebe, die schon KI nutzen?", a: "Nein. Viele Projekte starten ganz ohne KI." },
        { q: "Können wir unsere Werkzeuge weiter nutzen?", a: "Ja. Wo Microsoft 365, Google Workspace, Ihr CRM oder ERP den Ablauf tragen, nutze ich das zuerst." },
        { q: "Was passiert nach dem Check?", a: "Sie setzen den Plan selbst um, Sie und ich setzen gemeinsam einen Pilot um, oder es endet dort. Kein Lock-in." },
      ],
    },
    cta: { h: "Herausfinden, was sich wirklich lohnt.", p: "Ein Gespräch, ein schriftlicher Plan, keine Verpflichtung. Ich sage Ihnen lieber, dass es noch nicht der richtige Zeitpunkt ist, als ein Projekt zu starten, das sich nicht trägt.", primary: { label: "KI-Check anfragen", href: "/contact" }, secondary: { label: "Alle Leistungen", href: "/leistungen" } },
    service: { type: "AI and automation assessment" },
  },

  about: {
    slug: "ueber-mich",
    meta: {
      title: "Über mich: Hasan Dönmez, unabhängige Praxis in Arnsberg",
      description:
        "Hasan Dönmez ist Automatisierungsspezialist in Arnsberg. OpSolid ist eine Einzelpraxis für KI-Agents, Websites und Automatisierung. Nicht zu verwechseln mit TopSolid.",
    },
    crumb: "Über mich",
    hero: {
      eyebrow: "Über mich",
      h1: ["Hasan Dönmez, ", "allein", " und persönlich."],
      lede: "Ich bin Automatisierungsspezialist in Arnsberg. OpSolid ist meine Einzelpraxis: Sie sprechen immer mit mir und bekommen die Ergebnisse von mir.",
      primary: CONTACT,
      secondary: CHECK,
      scene: "offset",
      spec: [
        ["Name", "Hasan Dönmez"],
        ["Praxis", "OpSolid, unabhängig, Einzelunternehmen"],
        ["Ort", "Arnsberg, Deutschland"],
        ["Sprachen", "Deutsch, Englisch, Türkisch"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Arbeitsweise",
        h: "Wie ich arbeite.",
        items: [
          { h: "Erst der Prozess, dann die Technologie", p: "Ich nehme mir Zeit, Ihren Betrieb zu verstehen, bevor ich etwas vorschlage." },
          { h: "Für den Alltag gebaut, nicht für Demos", p: "Systeme müssen echte Last tragen, Fehler behandeln und Sonderfälle kennen." },
          { h: "Ergebnisse statt Funktionen", p: "Zählen sollen eingesparte Stunden, weniger Fehler und bessere Abläufe." },
          { h: "Klar bleiben", p: "Ich empfehle Automatisierung, wo sie sinnvoll ist, und rate ab, wo sie es nicht ist." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Eigene Produkte",
        h: "Was ich selbst betreibe.",
        items: [
          { h: "OpSo", tag: "Produkt", p: "Digitale Visitenkarte mit NFC und QR.", href: "/opso" },
          { h: "Kutasia", tag: "Live-Demo", p: "Kundenkommunikation in einem Posteingang, mit KI-Vorsortierung.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "text",
        eyebrow: "Abgrenzung",
        h: "OpSolid ist nicht TopSolid.",
        paras: ["OpSolid ist nicht TopSolid (CAD/CAM) und steht in keiner Verbindung dazu. Wer Hasan Dönmez und OpSolid sucht, ist hier richtig."],
      },
    ],
    cta: { h: "Etwas Nützliches für Ihre Abläufe bauen.", p: "Wenn Ihre Abläufe zu viel Handarbeit enthalten, kann ich helfen.", primary: CHECK, secondary: CONTACT },
  },

  contact: {
    slug: "contact",
    meta: {
      title: "Kontakt: Erstgespräch und KI-Check anfragen",
      description:
        "Erstgespräch oder KI-Check anfragen: per Formular, E-Mail oder Telefon. Antwort in der Regel innerhalb weniger Arbeitstage.",
    },
    crumb: "Kontakt",
    hero: {
      eyebrow: "Kontakt",
      h1: ["Schreiben oder ", "anrufen", "."],
      lede: "Schildern Sie kurz, worum es geht. Ich antworte in der Regel innerhalb weniger Arbeitstage.",
      primary: CHECK,
      scene: "tight",
    },
    blocks: [],
    cta: { h: "Lieber direkt starten?", p: "Der KI-Check ist der klarste erste Schritt.", primary: CHECK },
  },
};
