// =============================================================================
// GERMAN CONTENT (Deutsch)
// Struktur identisch mit en.ts — alle Werte ins Deutsche übersetzt (Siezen).
// =============================================================================

import type { Content } from "./en";

export const content: Content = {
  nav: {
    solutions: "Leistungen",
    useCases: "Beispiellösungen",
    about: "Über uns",
    contact: "Kontakt",
    cta: "Erstgespräch buchen",
    blog: "Blog",
    faq: "FAQ",
  },

  home: {
    hero: {
      headline: "Praxisnahe Automatisierung\nfür Geschäftsprozesse",
      subheadline:
        "OpSolid unterstützt Unternehmen dabei, manuelle, wiederkehrende Arbeit durch zuverlässige automatisierte Systeme zu ersetzen — von Workflow-Automatisierung und Systemintegration bis hin zu KI-gestützten Prozessen.",
      primaryCta: "Erstgespräch buchen",
      secondaryCta: "Leistungen ansehen",
    },

    capabilities: [
      "Workflow-Automatisierung",
      "Systemintegration",
      "Interne Tools",
      "KI-gestützte Workflows",
      "Prozessdigitalisierung",
      "Operative Dashboards",
    ],

    whatWeDo: {
      label: "Was OpSolid macht",
      headline: "Automatisierung und KI-Systeme für den realen Betrieb",
      description:
        "Viele Unternehmen arbeiten noch mit manuellen Prozessen, voneinander getrennten Tools und tabellenbasierter Nachverfolgung. OpSolid entwickelt und implementiert Automatisierungssysteme, die Ihre Tools verbinden, Ihre Workflows optimieren und den operativen Aufwand reduzieren, der Teams ausbremst.",
      points: [
        "Wiederkehrende Workflows mit n8n, Make und individuellen Integrationen automatisieren",
        "CRM, ERP, Datenbanken und Kommunikationstools zu einheitlichen Systemen verbinden",
        "Individuelle Dashboards und interne Tools für Ihr Team entwickeln",
        "KI-gestützte Prozesse dort einsetzen, wo sie praktischen Mehrwert schaffen",
      ],
    },

    solutions: {
      label: "Schwerpunkte",
      headline: "Was OpSolid für Sie entwickeln kann",
      items: [
        {
          title: "Workflow-Automatisierung",
          description:
            "Automatisierte Workflows, die manuelle Schritte ersetzen — von Dateneingabe und Freigaben bis hin zu Benachrichtigungen und Reporting. Umgesetzt mit n8n, Make und individuellen Integrationen.",
          icon: "workflow",
        },
        {
          title: "Systemintegration",
          description:
            "Verbinden Sie Ihr CRM, ERP, Ihre Datenbanken und Kommunikationstools zu einer einzigen, synchronisierten operativen Ebene. Keine manuellen Datenübertragungen mehr.",
          icon: "plug",
        },
        {
          title: "Interne Tools & Dashboards",
          description:
            "Individuell entwickelte operative Oberflächen, Admin-Panels und Dashboards — zugeschnitten auf die tatsächliche Arbeitsweise Ihres Teams.",
          icon: "layout",
        },
        {
          title: "KI-gestützte Workflows",
          description:
            "Chatbots, Sprachassistenten, Dokumentenverarbeitung und intelligentes Routing — praxisnahe KI-Anwendungen, eingebettet in Ihre bestehenden Prozesse.",
          icon: "bot",
        },
        {
          title: "Kommunikationsautomatisierung",
          description:
            "Automatisierte Nachrichten über WhatsApp, Telegram, E-Mail und SMS — von Support-Antworten über transaktionale Benachrichtigungen bis hin zu Follow-ups.",
          icon: "messageSquare",
        },
      ],
    },

    transformation: {
      label: "Der Wandel",
      headline: "Von manuellem Aufwand zu operativer Klarheit",
      items: [
        {
          before: "Manuelle E-Mails und Nachfassaktionen",
          after: "Automatisierte Workflows mit strukturierten Benachrichtigungen",
        },
        {
          before: "Tabellenbasierte Nachverfolgung",
          after: "Vernetzte Systeme mit konsistenten Daten",
        },
        {
          before: "Wiederkehrende Dateneingabe",
          after: "Zuverlässige, automatisierte Prozesse",
        },
        {
          before: "Fragmentierte, voneinander getrennte Tools",
          after: "Integrierte Abläufe über alle Plattformen hinweg",
        },
        {
          before: "Nachrichten verstreut über verschiedene Kanäle",
          after: "Einheitliche, automatisierte Kommunikation",
        },
        {
          before: "Manuelle Nachfassaktionen und Aufgabenverfolgung",
          after: "Strukturierte Workflows mit klarer Zuständigkeit",
        },
      ],
    },

    useCases: {
      label: "Wo Automatisierung hilft",
      headline: "Typische Problembereiche",
      items: [
        {
          title: "Bestell- und Fulfillment-Prozesse",
          description:
            "Automatisieren Sie Bestelleingang, Statusaktualisierungen und Fulfillment-Tracking über alle Kanäle hinweg.",
        },
        {
          title: "Dokumentenverarbeitung",
          description:
            "Rechnungen, Verträge und Formulare mit strukturierten Workflows extrahieren, klassifizieren und weiterleiten.",
        },
        {
          title: "Interne Freigaben",
          description:
            "Strukturierte Freigabe-Workflows für Bestellungen, Verträge und operative Anfragen.",
        },
        {
          title: "Operative Dashboards",
          description:
            "Dashboards, die Daten aus mehreren Quellen in einer einzigen operativen Ansicht zusammenführen.",
        },
        {
          title: "Kundenkommunikation",
          description:
            "Automatisierte Nachrichten, Follow-ups und Statusaktualisierungen über WhatsApp, E-Mail und weitere Kanäle.",
        },
        {
          title: "Datensynchronisation",
          description:
            "CRM, ERP und andere Geschäftssysteme synchron halten — weniger manuelle Datenübertragungen.",
        },
      ],
    },

    integrations: {
      label: "Integrationen",
      headline: "Tools und Plattformen, die OpSolid verbindet",
      items: [
        { name: "WhatsApp", icon: "messageCircle" },
        { name: "Telegram", icon: "send" },
        { name: "n8n", icon: "workflow" },
        { name: "Shopify", icon: "shoppingBag" },
        { name: "CRM-Systeme", icon: "users" },
        { name: "ERP-Systeme", icon: "database" },
        { name: "E-Mail & SMTP", icon: "mail" },
        { name: "REST APIs", icon: "code" },
        { name: "Google Workspace", icon: "cloud" },
        { name: "Datenbanken", icon: "hardDrive" },
        { name: "Zapier", icon: "zap" },
        { name: "Make", icon: "settings" },
      ],
    },

    howWeWork: {
      label: "Vorgehensweise",
      headline: "Wie ein typisches Projekt abläuft",
      steps: [
        {
          step: "01",
          title: "Analyse",
          description:
            "Ihre Prozesse verstehen, Engpässe identifizieren und herausfinden, wo Automatisierung den größten praktischen Mehrwert schafft.",
        },
        {
          step: "02",
          title: "Konzeption",
          description:
            "Die richtigen Tools, Integrationen und die passende Workflow-Architektur für Ihre spezifischen Anforderungen auswählen.",
        },
        {
          step: "03",
          title: "Umsetzung",
          description:
            "Iterativ entwickeln, testen und bereitstellen — mit klarer Kommunikation in jedem Schritt.",
        },
        {
          step: "04",
          title: "Optimierung",
          description:
            "Ihre Systeme überwachen, optimieren und erweitern, wenn sich Ihre Abläufe weiterentwickeln.",
        },
      ],
    },

    whyUs: {
      label: "Warum OpSolid",
      headline: "Was Sie erwarten können",
      points: [
        {
          title: "Prozesse zuerst",
          description:
            "Jedes Projekt beginnt damit, zu verstehen, wie Ihr Unternehmen arbeitet — nicht mit einem Technologie-Pitch.",
        },
        {
          title: "Individuell statt Standardlösung",
          description:
            "Ihre Systeme werden um Ihre tatsächlichen Workflows herum entwickelt — keine generischen Templates, keine erzwungenen Kompromisse.",
        },
        {
          title: "Für den Produktivbetrieb gebaut",
          description:
            "Lösungen werden für Zuverlässigkeit und reale Arbeitslasten entwickelt — mit ordnungsgemäßer Fehlerbehandlung und Monitoring.",
        },
        {
          title: "In Deutschland ansässig, international ausgerichtet",
          description:
            "Sitz in Deutschland, tätig für Unternehmen in Europa und darüber hinaus. Vertraut mit lokalen Anforderungen und internationalen Kontexten.",
        },
      ],
    },

    cta: {
      headline: "Bereit, Ihre Abläufe zu automatisieren?",
      description:
        "Buchen Sie ein kostenloses Erstgespräch. OpSolid hilft Ihnen zu erkennen, wo Automatisierung manuelle Arbeit reduzieren und Ihre operativen Workflows verbessern kann.",
      primaryCta: "Erstgespräch buchen",
    },

    toolsShowcase: {
      label: "Technologien",
      headline: "Automatisierungsplattformen und KI-Tools, mit denen OpSolid arbeitet",
      description:
        "OpSolid nutzt bewährte Automatisierungsplattformen und praxisnahe KI-Tools, um Systeme zu entwickeln, die zu Ihrem Betrieb passen — stets mit dem richtigen Werkzeug für jeden Anwendungsfall.",
      tools: [
        {
          name: "n8n",
          description:
            "Self-hosted Workflow-Engine für komplexe Automatisierungen. Webhook-Trigger, bedingte Logik und vollständige Datenhoheit.",
          techFeatures: [
            "Self-Hosted",
            "500+ Integrationen",
            "Webhook-Trigger",
            "Fehlerbehandlung",
            "Datenhoheit",
          ],
        },
        {
          name: "Make",
          description:
            "Visueller Szenario-Builder für mehrstufiges Daten-Routing. API-Verbindungen, Fehlerverzweigung und automatisierte Datentransformationen.",
          techFeatures: [
            "Visueller Builder",
            "Daten-Routing",
            "API-Module",
            "Fehlerverzweigung",
            "Echtzeit",
          ],
        },
        {
          name: "Zapier",
          description:
            "Schnelle Verbindung von über 6.000 Apps mit mehrstufigen Automatisierungen. Bedingte Pfade, geplante Trigger und Filterung.",
          techFeatures: [
            "6.000+ Apps",
            "Mehrstufig",
            "Bedingte Logik",
            "Zeitsteuerung",
            "Filter",
          ],
        },
        {
          name: "KI-Tools",
          description:
            "Praxisnahe KI-Anwendungen für Sprache, Chat, Dokumentenverarbeitung und Entscheidungsunterstützung. Entwickelt mit zuverlässigen Modellen und strukturierten Workflows.",
          techFeatures: [
            "Sprachassistenten",
            "Chatbots",
            "Dokumenten-KI",
            "Klassifizierung",
            "Strukturierte Ausgabe",
          ],
        },
      ],
    },
  },

  solutions: {
    hero: {
      label: "Leistungen",
      headline: "Systeme, die reale operative Probleme lösen",
      description:
        "Workflow-Automatisierung, interne Tools, Integrationen und KI-gestützte Prozesse — jeweils zugeschnitten auf Ihre spezifischen Abläufe.",
    },
    problemsLabel: "Typische Herausforderungen",
    outcomesLabel: "Mögliche Ergebnisse",
    items: [
      {
        title: "Workflow-Automatisierung",
        description:
          "Automatisieren Sie wiederkehrende, regelbasierte Aufgaben in Ihrem Unternehmen mit n8n, Make, individuellen Workflows und API-Orchestrierung.",
        problems: [
          "Stunden für Dateneingabe und Copy-Paste zwischen Systemen",
          "Fehler durch manuelle Übergaben zwischen Abteilungen",
          "Inkonsistente Ausführung je nachdem, wer die Aufgabe bearbeitet",
          "Engpässe durch manuelle Freigabeketten",
        ],
        outcomes: [
          "Automatisierte End-to-End-Workflows mit integrierter Fehlerbehandlung",
          "Konsistente, zuverlässige Ausführung jedes Mal",
          "Echtzeit-Transparenz über den Prozessstatus",
          "Erhebliche Reduzierung wiederkehrender manueller Arbeit",
        ],
        icon: "workflow",
      },
      {
        title: "Systemintegration",
        description:
          "Verbinden Sie Ihr CRM, ERP, Ihre Datenbanken und Tools zu einer einheitlichen operativen Ebene. Zuverlässige Integrationen, die Datensilos abbauen.",
        problems: [
          "Gleiche Daten werden manuell in mehrere Systeme eingegeben",
          "Entscheidungen auf Basis veralteter oder widersprüchlicher Daten",
          "Integrationsanfragen überlasten interne Ressourcen",
          "Keine zentrale Datenquelle für operative Daten",
        ],
        outcomes: [
          "Bidirektionaler Datenabgleich zwischen Kernsystemen",
          "Eine zentrale Datenquelle für den Betrieb",
          "Weniger manuelle Datenübertragungen und weniger Fehler",
          "Skalierbare Integrationsarchitektur",
        ],
        icon: "plug",
      },
      {
        title: "Interne Tools & Dashboards",
        description:
          "Individuell entwickelte operative Tools für Ihr Team — Admin-Panels, Datenoberflächen und Dashboards, die zu Ihrem Workflow passen.",
        problems: [
          "Teams nutzen Tabellen für Aufgaben, die richtige Tools erfordern",
          "Standardsoftware, die nicht zu Ihrem Prozess passt",
          "Keine zentrale Ansicht der operativen Daten",
          "Wichtige Informationen verstreut über E-Mails und Dokumente",
        ],
        outcomes: [
          "Zweckgebundene Tools, die zur Arbeitsweise Ihres Teams passen",
          "Zentrale Dashboards mit aktuellen Daten",
          "Kürzere Einarbeitungszeit für neue Teammitglieder",
          "Bessere Entscheidungen durch bessere Datentransparenz",
        ],
        icon: "layout",
      },
      {
        title: "KI-gestützte Workflows",
        description:
          "Praxisnahe KI-Anwendungen in Ihren Betrieb integriert — Chatbots, Sprachassistenten, Dokumentenverarbeitung und intelligentes Routing.",
        problems: [
          "Hohes Volumen an wiederkehrenden eingehenden Anfragen",
          "Langsame Reaktionszeiten in Spitzenzeiten",
          "Mitarbeiterzeit für routinemäßige, wenig komplexe Aufgaben",
          "Keine Erreichbarkeit außerhalb der Geschäftszeiten",
        ],
        outcomes: [
          "KI-gestützte Bearbeitung routinemäßiger Anfragen und Aufgaben",
          "Schnellere Reaktionszeiten über alle Kommunikationskanäle",
          "Mitarbeiter können sich auf höherwertige Arbeit konzentrieren",
          "Erweiterte Erreichbarkeit ohne zusätzliches Personal",
        ],
        icon: "bot",
      },
      {
        title: "Kommunikationsautomatisierung",
        description:
          "Automatisierte Nachrichten über WhatsApp, Telegram, E-Mail und SMS — von Support-Antworten über transaktionale Updates bis hin zu Follow-up-Sequenzen.",
        problems: [
          "Support-Nachrichten verteilt über mehrere Kanäle",
          "Langsame oder inkonsistente Reaktionszeiten",
          "Keine automatisierten transaktionalen Benachrichtigungen",
          "Manueller Aufwand, um Kunden über Statusänderungen zu informieren",
        ],
        outcomes: [
          "Einheitliche Kommunikation mit automatisiertem Routing",
          "Konsistente, zeitnahe Antworten über alle Kanäle",
          "Automatisierte Bestellbestätigungen und Statusaktualisierungen",
          "Reduzierter manueller Kommunikationsaufwand",
        ],
        icon: "messageSquare",
      },
    ],
    cta: {
      headline: "Nicht sicher, welche Leistung passt?",
      description:
        "Jedes Unternehmen ist anders. Buchen Sie ein kostenloses Erstgespräch, um Ihre Herausforderungen zu besprechen und herauszufinden, was sinnvoll ist.",
      primaryCta: "Erstgespräch buchen",
    },
  },

  useCases: {
    hero: {
      label: "Beispiellösungen",
      headline: "Praxisnahe Automatisierungsszenarien",
      description:
        "Realistische Beispiele für die Art von Systemen, die OpSolid entwerfen und umsetzen kann. Sie veranschaulichen typische Problembereiche und Lösungsansätze.",
    },
    labels: {
      context: "Szenario",
      problem: "Herausforderung",
      solution: "Ansatz",
      outcome: "Mögliches Ergebnis",
    },
    items: [
      {
        title: "Multi-Channel-Bestellverarbeitung",
        context:
          "Ein E-Commerce-Unternehmen, das täglich Bestellungen über mehrere Vertriebskanäle abwickelt.",
        problem:
          "Manuelle Bestelleingabe, Statusaktualisierungen und Bestandsanpassungen kosten täglich Stunden. Fehler häufen sich in Stoßzeiten.",
        solution:
          "Automatisierte Pipeline: Bestelleingang aus allen Kanälen, Datennormalisierung, Bestandsaktualisierungen, Labelerstellung und Tracking-Benachrichtigungs-Workflows.",
        outcome:
          "Erhebliche Reduzierung der manuellen Bearbeitungszeit. Weniger Fehler. Fähigkeit, höhere Bestellvolumina ohne proportionale Personalaufstockung zu bewältigen.",
      },
      {
        title: "Rechnungs- und Dokumentenverarbeitung",
        context:
          "Ein Unternehmen, das monatlich Hunderte von Rechnungen in verschiedenen Formaten von diversen Lieferanten erhält.",
        problem:
          "Mitarbeiter verbringen erhebliche Zeit mit der Extraktion von Rechnungsdaten, der Eingabe in Buchhaltungssysteme und dem Abgleich von Bestellungen.",
        solution:
          "KI-gestützte Extraktion, automatischer Bestellabgleich, Abweichungserkennung und direkte Weiterleitung an Buchhaltungssysteme.",
        outcome:
          "Erhebliche Reduzierung der Bearbeitungszeit. Das Finanzteam kann sich auf Ausnahmen und strategische Arbeit konzentrieren statt auf Dateneingabe.",
      },
      {
        title: "Interne Freigabe-Workflows",
        context:
          "Ein wachsendes Unternehmen, das Einkäufe, Reiseanträge und Auftragnehmer-Onboarding per E-Mail verwaltet.",
        problem:
          "Anfragen gehen in E-Mail-Verläufen verloren. Keine Transparenz über den Status, kein Audit-Trail. Der Prozess variiert je nach Vorgesetztem.",
        solution:
          "Strukturiertes Freigabesystem: Formularübermittlung, regelbasiertes Routing, Statusverfolgung und automatische Erinnerungen.",
        outcome:
          "Schnellere Freigabezyklen. Keine verlorenen Anfragen. Vollständiger Audit-Trail für Compliance.",
      },
      {
        title: "Operations-Dashboard",
        context:
          "Ein Distributionsunternehmen, das Verkaufs-, Lager- und Lieferdaten in separaten Tabellen verfolgt.",
        problem:
          "Berichte sind stets verspätet und oft inkonsistent. Entscheidungen basieren auf veralteten Informationen.",
        solution:
          "Live-Dashboard mit Daten aus ERP, Lagersystem und Liefersystemen. Konfigurierbare Warnmeldungen bei Anomalien und Schwellenwerten.",
        outcome:
          "Operative Transparenz in Echtzeit. Schnellere Problemerkennung. Fundiertere Entscheidungsfindung.",
      },
      {
        title: "Automatisiertes Kunden-Onboarding",
        context:
          "Ein B2B-Dienstleistungsunternehmen, das neue Kunden über einen mehrstufigen manuellen Prozess einführt.",
        problem:
          "Onboarding wird in geteilten Dokumenten verfolgt. Schritte werden vergessen, die Erfahrung ist inkonsistent, und der Prozess dauert länger als nötig.",
        solution:
          "Automatisierter Workflow: Willkommensnachrichten, Kontoeinrichtung, Nachverfolgung der Dokumentensammlung und Status-Dashboard.",
        outcome:
          "Kürzere Onboarding-Zeit. Konsistente Erfahrung für jeden Kunden. Keine vergessenen Schritte.",
      },
      {
        title: "Systemübergreifende Datensynchronisation",
        context:
          "Ein Einzelhandelsunternehmen mit separaten Systemen für E-Commerce, ERP, Lagerverwaltung und CRM.",
        problem:
          "Mitarbeiter verbringen täglich Stunden mit manueller Datensynchronisation. Abweichungen zwischen Systemen verursachen operative Probleme.",
        solution:
          "Zentrale Integrationsschicht mit nahezu Echtzeit-Synchronisation, Konflikterkennung und strukturierter Fehlerbehandlung.",
        outcome:
          "Manuelle Synchronisationsaufgaben eliminiert. Konsistente Daten über alle Systeme hinweg. Mitarbeiterzeit für höherwertige Aufgaben umgewidmet.",
      },
      {
        title: "Automatisierte Kundenkommunikation",
        context:
          "Ein Dienstleistungsunternehmen, das Statusaktualisierungen, Erinnerungen und Follow-ups manuell versendet.",
        problem:
          "Nachrichten kommen manchmal zu spät, sind inkonsistent oder werden ganz vergessen. Die Kommunikationsqualität sinkt in Stoßzeiten.",
        solution:
          "Automatisierte Nachrichten, ausgelöst durch Service-Meilensteine und Events. Konsistente Vorlagen mit manueller Überschreibungsmöglichkeit.",
        outcome:
          "Zuverlässige, zeitnahe Kommunikation. Reduzierter manueller Aufwand. Konsistentere Kundenerfahrung.",
      },
      {
        title: "WhatsApp- & Telegram-Support",
        context:
          "Ein Unternehmen, das täglich Kundenanfragen über WhatsApp, Telegram und E-Mail erhält.",
        problem:
          "Mitarbeiter beantworten manuell wiederkehrende Fragen. Keine Erreichbarkeit außerhalb der Geschäftszeiten. Nachrichten gehen zwischen den Kanälen verloren.",
        solution:
          "Einheitlicher Messaging-Hub mit automatisierten FAQ-Antworten, Statusabfragen und intelligentem Routing an menschliche Agenten bei komplexen Anliegen.",
        outcome:
          "Schnellere Reaktionszeiten. Erweiterte Erreichbarkeit. Mitarbeiter konzentrieren sich auf Anfragen, die menschliche Aufmerksamkeit erfordern.",
      },
    ],
    cta: {
      headline: "Erkennen Sie ein Szenario, das zu Ihrer Situation passt?",
      description:
        "Dies sind Beispiele für das, was entwickelt werden kann. Buchen Sie ein Erstgespräch, um Ihre konkreten Anforderungen zu besprechen.",
      primaryCta: "Erstgespräch buchen",
    },
  },

  about: {
    hero: {
      label: "Über OpSolid",
      headline:
        "Praxisnahe Automatisierungssysteme für Unternehmen, die weniger manuelle Arbeit brauchen",
      description:
        "Sitz in Deutschland. Fokus auf den Ersatz manueller, wiederkehrender operativer Arbeit durch zuverlässige automatisierte Systeme.",
    },
    story: {
      headline: "Warum es OpSolid gibt",
      paragraphs: [
        "Jedes wachsende Unternehmen erreicht einen Punkt, an dem manuelle Prozesse zum Engpass werden. Bestellungen häufen sich, Freigaben gehen in E-Mails verloren, Daten liegen in getrennten Tabellen, und Teams verbringen mehr Zeit mit operativem Overhead als mit Arbeit, die das Unternehmen voranbringt.",
        "OpSolid wurde gegründet, um genau das zu lösen. Durch die Verbindung von Prozessdenken mit modernen Automatisierungsplattformen und praxisnahen KI-Tools entwickelt OpSolid Systeme, die operative Arbeit übernehmen — zuverlässig, konsistent und ohne unnötige Komplexität hinzuzufügen.",
      ],
    },
    values: {
      headline: "Wie OpSolid arbeitet",
      items: [
        {
          title: "Erst der Prozess, dann die Technologie",
          description:
            "Zeit wird investiert, um zu verstehen, wie Ihr Unternehmen arbeitet, bevor eine Lösung vorgeschlagen wird.",
        },
        {
          title: "Für den Produktivbetrieb gebaut, nicht für Demos",
          description:
            "Systeme bewältigen reale Arbeitslasten. Sie sind auf Zuverlässigkeit, Fehlerbehandlung und Sonderfälle ausgelegt.",
        },
        {
          title: "Ergebnisse messen, nicht Features",
          description:
            "Was zählt, sind eingesparte Stunden, reduzierte Fehler und verbesserte Prozesse — keine Feature-Listen.",
        },
        {
          title: "Pragmatisch und ehrlich bleiben",
          description:
            "Automatisierung wird dort empfohlen, wo sie sinnvoll ist — und dort davon abgeraten, wo sie es nicht ist.",
        },
      ],
    },
    founder: {
      name: "Hasan Dönmez",
      title: "Gründer & Systems Architect",
      education: "",
      description:
        "Unabhängiger Automatisierungsspezialist mit Sitz in Deutschland. Fokussiert auf die Konzeption und Entwicklung praxisnaher Automatisierungssysteme, Workflow-Integrationen und KI-gestützter Prozesse für den Geschäftsbetrieb.",
      expertiseLabel: "",
      expertise: [],
      footnote:
        "Sitz in Deutschland. Verfügbar für Projekte in ganz Europa und international.",
    },
    cta: {
      headline: "Lassen Sie uns etwas Nützliches bauen",
      description:
        "Wenn Ihre Abläufe zu viel manuelle Arbeit und voneinander getrennte Prozesse beinhalten, kann OpSolid helfen.",
      primaryCta: "Erstgespräch buchen",
    },
  },

  contact: {
    hero: {
      label: "Kontakt",
      headline: "Sprechen wir über Ihre Abläufe",
      description:
        "Ob Sie eine konkrete Automatisierungsherausforderung haben oder erkunden möchten, was möglich ist — ein praxisnahes Gespräch, kein Verkaufsdruck.",
    },
    form: {
      name: "Vollständiger Name",
      email: "Geschäftliche E-Mail",
      company: "Unternehmen",
      message: "Welche operative Herausforderung möchten Sie lösen?",
      consent:
        "Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu. Meine Daten werden ausschließlich zur Bearbeitung dieser Anfrage verwendet.",
      privacyLink: "Datenschutzerklärung",
      submit: "Nachricht senden",
      sending: "Wird gesendet...",
      success:
        "Vielen Dank. Sie erhalten innerhalb von 1–2 Werktagen eine Antwort.",
      error:
        "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder senden Sie direkt eine E-Mail.",
    },
    meeting: {
      headline: "Lieber ein direktes Gespräch?",
      description:
        "Buchen Sie ein kostenloses 30-minütiges Erstgespräch. Wählen Sie einen passenden Termin — verfügbare Zeiten werden live synchronisiert.",
      cta: "Termin vereinbaren",
    },
    info: {
      email: "hello@opsolid.de",
      response: "Übliche Antwortzeit: 1–2 Werktage.",
      location:
        "Sitz in Deutschland. Verfügbar für Projekte in ganz Europa und international.",
    },
  },

  footer: {
    description:
      "Praxisnahe Automatisierungs- und KI-Systeme für den Geschäftsbetrieb.",
    company: "Unternehmen",
    services: "Leistungen",
    legal: "Rechtliches",
    resources: "Ressourcen",
    copyright: `© ${new Date().getFullYear()} OpSolid. All rights reserved.`,
  },

  notFound: {
    title: "Seite nicht gefunden",
    description:
      "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    backHome: "Zurück zur Startseite",
    contactUs: "Kontakt",
  },

  impressum: {
    title: "Impressum",
    notice:
      "Dieses Impressum gilt für ein Unternehmen in Gründung. Die Angaben werden nach der Gewerbeanmeldung aktualisiert.",
    sections: {
      according: "Angaben gemäß § 5 TMG",
      representedBy: "Vertreten durch",
      contact: "Kontakt",
      phone: "Telefon: Auf Anfrage",
      register: "Handelsregister",
      registerText:
        "Ein Handelsregistereintrag liegt derzeit nicht vor. Das Unternehmen befindet sich in Gründung.",
      vatId: "Umsatzsteuer-ID",
      vatIdText: "Wird nach der Gewerbeanmeldung beantragt.",
      responsibleContent:
        "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
      liabilityContent: "Haftung für Inhalte",
      liabilityContentText:
        "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.",
      liabilityLinks: "Haftung für Links",
      liabilityLinksText:
        "Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.",
      address: "Vollständige Adresse wird nach der Gewerbeanmeldung ergänzt.",
    },
  },

  privacy: {
    title: "Datenschutzerklärung",
    subtitle: "Datenschutzerklärung",
    notice:
      "Diese Datenschutzerklärung ist ein Entwurf. Sie wird nach der Gewerbeanmeldung durch eine rechtlich geprüfte Fassung ersetzt.",
    lastUpdated: "Letzte Aktualisierung: März 2026",
    sections: [
      {
        title: "1. Datenschutz auf einen Blick",
        content:
          "Im Folgenden erhalten Sie einen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.",
      },
      {
        title: "2. Verantwortliche Stelle",
        isResponsible: "true",
      },
      {
        title: "3. Datenerhebung",
        subsections: [
          {
            title: "Kontaktformular",
            content:
              "Über das Kontaktformular übermittelte Daten werden zur Bearbeitung der Anfrage und für Rückfragen gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogenen Anfragen, Art. 6 Abs. 1 lit. f DSGVO bei berechtigtem Interesse oder Art. 6 Abs. 1 lit. a DSGVO bei erteilter Einwilligung.",
          },
          {
            title: "Server-Log-Dateien",
            content:
              "Der Hosting-Anbieter erfasst automatisch Browsertyp, Betriebssystem, Referrer-URL, Hostname und Zeitpunkt der Anfrage. Diese Daten können keiner bestimmten Person zugeordnet werden.",
          },
        ],
      },
      {
        title: "4. Hosting",
        content:
          "Diese Website wird bei Vercel, Inc. (440 N Baxter St, Los Angeles, CA 90012, USA) gehostet. Beim Besuch unserer Website werden Ihre IP-Adresse und Nutzungsdaten von Vercel verarbeitet. Weitere Informationen finden Sie in der Datenschutzerklärung von Vercel.",
      },
      {
        title: "5. Cookies & Analyse",
        content:
          "Diese Website verwendet keine Tracking-Cookies oder Analysetools. Eine Sprachpräferenz wird im lokalen Speicher Ihres Browsers gespeichert, um Ihre ausgewählte Sprache zu merken.",
      },
      {
        title: "6. Ihre Rechte",
        content:
          "Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten, Berichtigung oder Löschung, Einschränkung der Verarbeitung sowie Beschwerde bei einer Aufsichtsbehörde. Wurde eine Einwilligung erteilt, können Sie diese jederzeit widerrufen.",
      },
    ],
  },

  blog: {
    hero: {
      label: "Blog",
      headline: "Einblicke in Automatisierung & Betrieb",
      description:
        "Praxisnahe Artikel über Workflow-Automatisierung, Integrationsstrategien und operative Effizienz.",
    },
    readMore: "Artikel lesen",
    minRead: "Min. Lesezeit",
    categories: {
      all: "Alle",
      automation: "Automatisierung",
      integration: "Integration",
      ai: "KI & ML",
      operations: "Betrieb",
    },
    posts: [
      {
        slug: "why-n8n-is-the-future-of-workflow-automation",
        title: "Warum n8n die Zukunft der Workflow-Automatisierung ist",
        excerpt:
          "Erfahren Sie, warum n8n zur bevorzugten Plattform für Unternehmen geworden ist, die leistungsstarke, selbst gehostete Workflow-Automatisierung mit voller Kontrolle über ihre Daten benötigen.",
        category: "automation",
        date: "2026-03-15",
        readTime: "6",
      },
      {
        slug: "5-signs-your-business-needs-process-automation",
        title: "5 Anzeichen, dass Ihr Unternehmen Prozessautomatisierung braucht",
        excerpt:
          "Verbringt Ihr Team zu viel Zeit mit manueller Arbeit? Hier sind die wichtigsten Indikatoren, dass es Zeit ist, in Automatisierung zu investieren.",
        category: "operations",
        date: "2026-03-08",
        readTime: "5",
      },
      {
        slug: "connecting-crm-erp-the-integration-playbook",
        title: "CRM & ERP verbinden: Der Integrations-Leitfaden",
        excerpt:
          "Ein praktischer Leitfaden zur Synchronisierung Ihrer CRM- und ERP-Systeme — Datensilos abbauen und eine zentrale Datenquelle schaffen.",
        category: "integration",
        date: "2026-02-28",
        readTime: "8",
      },
      {
        slug: "ai-chatbots-vs-rule-based-bots",
        title: "KI-Chatbots vs. regelbasierte Bots: Was brauchen Sie?",
        excerpt:
          "Den Unterschied zwischen KI-gestützten und regelbasierten Chatbots verstehen — und wann welcher Ansatz für Ihr Unternehmen sinnvoll ist.",
        category: "ai",
        date: "2026-02-20",
        readTime: "7",
      },
      {
        slug: "make-vs-zapier-vs-n8n-comparison",
        title:
          "Make vs. Zapier vs. n8n: Die richtige Automatisierungsplattform wählen",
        excerpt:
          "Ein detaillierter Vergleich der drei beliebtesten Automatisierungsplattformen — Funktionen, Preise, Flexibilität und wann welche zum Einsatz kommt.",
        category: "automation",
        date: "2026-02-12",
        readTime: "10",
      },
      {
        slug: "whatsapp-business-automation-guide",
        title: "Der vollständige Leitfaden zur WhatsApp Business Automatisierung",
        excerpt:
          "So automatisieren Sie Kundenkommunikation über WhatsApp — von Bestellbestätigungen bis zu Support-Bots — ohne die persönliche Note zu verlieren.",
        category: "automation",
        date: "2026-02-05",
        readTime: "9",
      },
    ],
    cta: {
      headline: "Möchten Sie Ihre Abläufe automatisieren?",
      description:
        "Buchen Sie ein kostenloses Erstgespräch. OpSolid hilft Ihnen, die wirkungsvollsten Automatisierungsmöglichkeiten für Ihr Unternehmen zu identifizieren.",
      primaryCta: "Erstgespräch buchen",
    },
  },

  faq: {
    hero: {
      label: "FAQ",
      headline: "Häufig gestellte Fragen",
      description:
        "Häufige Fragen zu Automatisierungsleistungen, Vorgehensweise und Technologie.",
    },
    allFilter: "Alle",
    categories: {
      general: "Allgemein",
      technical: "Technisch",
      process: "Ablauf & Preise",
    },
    items: [
      {
        question: "Was genau macht OpSolid?",
        answer:
          "OpSolid entwickelt Automatisierungssysteme, Integrationen und interne Tools für Unternehmen. Wenn Ihr Team Zeit mit manueller, wiederkehrender Arbeit verbringt — Dateneingabe, E-Mail-Nachfassaktionen, Bestellverarbeitung, Berichterstellung — baut OpSolid Systeme, die das automatisch und zuverlässig erledigen.",
        category: "general",
      },
      {
        question: "Welche Tools und Plattformen werden eingesetzt?",
        answer:
          "Die primäre Automatisierungsplattform ist n8n, ergänzt durch Make und Zapier, wo es sinnvoll ist. Individuelle Integrationen werden über APIs, Datenbanken und Cloud-Dienste erstellt. Für KI-gestützte Workflows kommen zuverlässige Foundation Models und strukturierte Ansätze zum Einsatz. Das richtige Tool wird für jeden Anwendungsfall gewählt — nie eine Einheitslösung.",
        category: "technical",
      },
      {
        question: "Was ist n8n und warum wird es bevorzugt?",
        answer:
          "n8n ist eine Open-Source-Plattform für Workflow-Automatisierung, die selbst gehostet werden kann und Ihnen volle Kontrolle über Ihre Daten und Workflows gibt. Sie ist flexibel, unterstützt Hunderte von Integrationen und erlaubt bei Bedarf individuellen Code. Sie bietet eine starke Balance aus Leistungsfähigkeit, Flexibilität und Datenhoheit für die Geschäftsautomatisierung.",
        category: "technical",
      },
      {
        question: "Wie lange dauert ein typisches Projekt?",
        answer:
          "Die meisten Projekte dauern 2–6 Wochen von der Analyse bis zum Deployment, abhängig von der Komplexität. Einfache Automatisierungen können innerhalb von Tagen live sein. Komplexe Multi-System-Integrationen können länger dauern. Die Arbeit erfolgt iterativ — Sie sehen früh und regelmäßig Ergebnisse.",
        category: "process",
      },
      {
        question: "Gibt es nach dem Deployment laufenden Support?",
        answer:
          "Ja. Monitoring, Wartung und Optimierung stehen nach dem Deployment zur Verfügung. Automatisierungssysteme entwickeln sich mit Ihrem Unternehmen weiter — laufender Support stellt sicher, dass Ihre Systeme Schritt halten. Dokumentation und Schulungen werden ebenfalls bereitgestellt, damit Ihr Team den täglichen Betrieb eigenständig verwalten kann.",
        category: "process",
      },
      {
        question: "Was kostet es?",
        answer:
          "Jedes Projekt ist anders. Ein kostenloses Erstgespräch hilft, Ihre Anforderungen zu verstehen, gefolgt von einem transparenten Angebot. Die Preisgestaltung ist projektbasiert, nicht stundenbasiert — Sie kennen die Investition im Voraus.",
        category: "process",
      },
      {
        question: "Kann OpSolid bestehende Systeme integrieren?",
        answer:
          "Mit großer Wahrscheinlichkeit ja. OpSolid arbeitet mit CRMs (HubSpot, Salesforce, Pipedrive), ERPs (SAP, Oracle, Odoo), E-Commerce-Plattformen (Shopify, WooCommerce), Datenbanken, Google Workspace und praktisch jedem System mit API.",
        category: "technical",
      },
      {
        question: "Müssen bestehende Tools ersetzt werden?",
        answer:
          "Nein. OpSolid entwickelt Systeme, die Ihre bestehenden Tools verbinden — nicht ersetzen. Das Ziel ist, das, was Sie bereits haben, besser zusammenarbeiten zu lassen und Datensilos sowie manuelle Übergaben zu eliminieren.",
        category: "general",
      },
      {
        question: "Sind die Daten sicher?",
        answer:
          "Ja. Die gesamte Automatisierungsinfrastruktur kann in Ihrer eigenen Umgebung selbst gehostet werden. DSGVO-Anforderungen werden eingehalten, Verschlüsselung wird für sensible Daten eingesetzt, und alle Verbindungen nutzen sichere APIs. Keine Daten passieren Drittanbieter-Server, es sei denn, Sie entscheiden sich ausdrücklich für cloudbasierte Lösungen.",
        category: "technical",
      },
      {
        question: "Welche Branchen werden bedient?",
        answer:
          "OpSolid arbeitet branchenübergreifend — E-Commerce, Logistik, Fertigung, professionelle Dienstleistungen und mehr. Lösungen werden um Ihre Prozesse herum gebaut, nicht um Ihre Branchenbezeichnung. Wenn Ihre Abläufe wiederkehrende manuelle Arbeit beinhalten, kann Automatisierung helfen.",
        category: "general",
      },
    ],
    cta: {
      headline: "Noch Fragen?",
      description:
        "Buchen Sie ein kostenloses Erstgespräch, um Ihre konkrete Situation zu besprechen — unverbindlich.",
      primaryCta: "Erstgespräch buchen",
    },
  },
} as const;
