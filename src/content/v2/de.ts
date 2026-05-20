/**
 * DE — formal Sie, no Anglicisms ("Game-Changer", "boosten", "KI-nativ" banned).
 * No tool-name dropping on the home hero. No period at end of headings.
 */

import type { V2Content } from "./en";

type V2Mirror = {
  -readonly [K in keyof V2Content]: V2Content[K] extends readonly unknown[]
    ? Array<unknown>
    : V2Content[K] extends object
      ? {
          -readonly [P in keyof V2Content[K]]: V2Content[K][P] extends readonly unknown[]
            ? Array<unknown>
            : V2Content[K][P] extends object
              ? Record<string, unknown> | Array<unknown>
              : string;
        }
      : string;
};

export const v2: V2Mirror = {
  home: {
    hero: {
      eyebrow: "Unabhängige Automatisierungspraxis",
      headline: [
        "Wir nehmen Ihrem Team",
        "die Routine ab —",
        "leise, jeden Tag",
      ],
      lead: "Wir bauen die Werkzeuge, die Abläufe und die KI-Schicht, die Ihren Betrieb im Hintergrund tragen. Damit niemand mehr fragen muss, ob es gelaufen ist.",
      ctaPrimary: "Sprechen wir",
      ctaSecondary: "Was wir bauen",
      chips: ["Prozessautomatisierung", "Interne Tools", "KI-Beratung", "Schulungen DE · EN · TR"],
    },
    pillars: {
      eyebrow: "Was wir bauen",
      headline: "Vier Disziplinen, eine Werkstatt",
      items: [
        {
          slug: "prozessautomatisierung",
          label: "Prozessautomatisierung",
          sub: "Wiederkehrende Arbeit verschwindet im Hintergrund — niemand muss sie starten, niemand muss daran denken",
        },
        {
          slug: "interne-tools",
          label: "Interne Tools",
          sub: "Eigene Anwendungen statt fragiler Tabellen — ohne Compliance-Theater",
        },
        {
          slug: "ki-beratung",
          label: "KI-Beratung",
          sub: "Wir sagen Ihnen, wo KI sich rechnet und wo sie leise Budget verbrennt",
        },
        {
          slug: "ki-schulungen",
          label: "Schulungen DE · EN · TR",
          sub: "Praxis-Workshops auf Deutsch, Englisch und Türkisch — für die Menschen, die das System bedienen werden",
        },
      ],
      cardCta: "Öffnen",
    },
  },
  leistungen: {
    eyebrow: "Fünf Disziplinen",
    headline: "Was wir für Sie bauen",
    manifesto:
      "Fünf Disziplinen, eine Werkstatt. Wir wählen die richtige Kombination für Ihren Betrieb — manchmal ein einzelnes Werkzeug, manchmal das ganze Setup.",
    services: [
      {
        index: "01",
        slug: "ki-beratung",
        label: "KI-Beratung",
        sub: "Wo KI sich rechnet",
      },
      {
        index: "02",
        slug: "prozessautomatisierung",
        label: "Prozessautomatisierung",
        sub: "Abläufe, die von selbst laufen",
      },
      {
        index: "03",
        slug: "microsoft-365-automatisierung",
        label: "Microsoft 365",
        sub: "Outlook, Teams, SharePoint vernetzt",
      },
      {
        index: "04",
        slug: "interne-tools",
        label: "Interne Tools",
        sub: "Das Tabellenblatt ablösen",
      },
      {
        index: "05",
        slug: "ki-schulungen",
        label: "KI-Schulungen",
        sub: "Praxisnah für Ihr Team",
      },
    ],
  },
  kiBeratung: {
    eyebrow: "KI-Beratung",
    headline: "Welche Prozesse kann Ihre KI übernehmen?",
    lead: "Wir setzen uns mit Ihrer Operation hin, finden die Arbeit, die Maschinenarbeit sein sollte, und sagen Ihnen, wo KI sich rechnet — nicht, wo sie auf einer Folie gut klingt.",
    ctaPrimary: "Sprechen wir",
    ctaSecondary: "Wie wir arbeiten",
    terminal: {
      title: "session · ki-analyse",
      prompt: "$ opsolid scan --depth=ops",
      lines: [
        "> lese 12 Tagesabläufe ...",
        "  gefunden: Rechnungseingang     28 Min/Tag  → automatisierbar",
        "  gefunden: Kundenanfragen-Triage 44 Min/Tag → automatisierbar",
        "  gefunden: Bestandsabgleich      35 Min/Tag  → automatisierbar",
        "  gefunden: Rechtsprüfung                     → Mensch bleibt",
        "  gefunden: Preisausnahme                     → Mensch bleibt",
        "> Prognose: 11,3 Std / Woche eingespart",
        "> nächster Schritt: Kickoff-Gespräch",
      ],
    },
  },
  prozess: {
    eyebrow: "Prozessautomatisierung",
    headline: "Wir nehmen die Arbeit ab, die niemand gerne macht",
    lead: "Die Formulare, die Tabellen, das Copy-Paste, das 'hat schon jemand den Bericht geschickt?' — wir nehmen sie Ihrem Team ab und bringen sie auf Schienen.",
    ctaPrimary: "Sprechen wir",
    ctaSecondary: "Wie wir arbeiten",
  },
  microsoft365: {
    eyebrow: "Microsoft 365 Integration",
    headline: "Ihr 365 spricht endlich mit Ihren anderen Systemen",
    lead: "Wir installieren kein Microsoft 365 — wir verbinden Ihr bestehendes 365 mit CRM, ERP, Helpdesk und dem Rest Ihrer Tools, damit Nachrichten, Dateien und Freigaben nicht mehr zwischen den Apps verloren gehen.",
    ctaPrimary: "Sprechen wir",
    ctaSecondary: "Wie wir arbeiten",
    services: ["Outlook", "Teams", "SharePoint", "OneDrive", "Forms", "Planner"],
    hubLabel: "Integration Hub",
  },
  interneTools: {
    eyebrow: "Interne Tools",
    headline: "Das Tabellenblatt ablösen, auf dem Ihr Betrieb läuft",
    lead: "Die Excel-Datei, die alle teilen, kopieren und kaputtmachen — ersetzen wir durch ein kleines, zweckgebautes Werkzeug, das Ihr Team gerne öffnet.",
    ctaPrimary: "Sprechen wir",
    ctaSecondary: "Wie wir arbeiten",
    beforeLabel: "Tabellen-Chaos",
    afterLabel: "Ihr eigenes Werkzeug",
  },
};
