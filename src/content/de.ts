// =============================================================================
// GERMAN CONTENT (Deutsch)
// Struktur identisch mit en.ts — alle Werte ins Deutsche übersetzt (Siezen).
// =============================================================================

import type { Content } from "./en";

export const content: Content = {
  nav: {
    solutions: "Lösungen",
    useCases: "Anwendungsfälle",
    about: "Über uns",
    contact: "Kontakt",
    cta: "Kontakt aufnehmen",
    blog: "Blog",
    faq: "FAQ",
  },

  home: {
    hero: {
      headline: "KI-gestützte Automatisierung\nfür moderne Unternehmen",
      subheadline:
        "Wir integrieren KI-Agenten der nächsten Generation und Automatisierungssysteme in Ihre Abläufe — ersetzen manuelle Arbeit durch intelligente, selbstlaufende Workflows, die Ihr Unternehmen voranbringen.",
      primaryCta: "Beratungsgespräch buchen",
      secondaryCta: "Lösungen entdecken",
      stats: [
        { value: "80%", label: "Weniger manuelle Arbeit" },
        { value: "3x", label: "Schnellere Prozesse" },
        { value: "24/7", label: "KI-gestützte Abläufe" },
      ],
    },

    capabilities: [
      "KI-Agent-Integration",
      "Prozessautomatisierung",
      "Systemintegration",
      "Workflow-Engineering",
      "Intelligente Chatbots",
      "KI-Lösungen der nächsten Generation",
    ],

    whatWeDo: {
      label: "Was wir tun",
      headline: "Wir bringen KI und Automatisierung in Ihre Geschäftsabläufe",
      description:
        "Die Welt entwickelt sich rasant — KI-Agenten, intelligente Automatisierung und vernetzte Systeme sind keine Option mehr. Wir integrieren die neuesten KI-Technologien und Automatisierungsplattformen in Ihre Abläufe, damit Ihr Unternehmen wettbewerbsfähig, effizient und zukunftsfähig bleibt.",
      points: [
        "KI-Agenten einsetzen, die Aufgaben autonom erledigen",
        "Komplexe Workflows mit n8n und Make automatisieren",
        "Alle Tools in intelligente Systeme verbinden",
        "Mit KI-Technologie der nächsten Generation voraus sein",
      ],
    },

    solutions: {
      label: "Lösungen",
      headline: "Was wir für Sie bauen",
      items: [
        {
          title: "Prozessautomatisierung",
          description:
            "Manuelle Schritte durch zuverlässige automatisierte Workflows ersetzen — von der Dateneingabe über Freigaben bis zu Benachrichtigungen.",
          icon: "workflow",
        },
        {
          title: "Interne Tools",
          description:
            "Maßgeschneiderte Dashboards, Admin-Panels und operative Oberflächen, die zu den Arbeitsabläufen Ihres Teams passen.",
          icon: "layout",
        },
        {
          title: "Workflow-Systeme",
          description:
            "End-to-End-Orchestrierung, die Menschen, Prozesse und Entscheidungen in nachvollziehbare, wiederholbare Systeme verbindet.",
          icon: "gitBranch",
        },
        {
          title: "Systemintegration",
          description:
            "CRM, ERP, Lagerverwaltung, Datenbanken und Kommunikationstools in eine einheitliche, synchronisierte Betriebsschicht verbinden.",
          icon: "plug",
        },
        {
          title: "Marketing- & Vertriebsautomatisierung",
          description:
            "Automatisierte Lead-Erfassung, Follow-up-Sequenzen, CRM-Updates, YouTube-Content-Operations und Kampagnen-Tracking.",
          icon: "target",
        },
        {
          title: "Versand & Bestellabwicklung",
          description:
            "Automatisierte Bestellverarbeitung, Carrier-Integration und Fulfillment-Workflows — ein Bereich mit sofortigem ROI.",
          icon: "package",
        },
        {
          title: "Messaging & Kommunikation",
          description:
            "Kundenkommunikation über WhatsApp, Telegram, E-Mail und SMS automatisieren — von Support-Tickets bis zu transaktionalen Updates.",
          icon: "messageSquare",
        },
        {
          title: "KI-Agenten & Sprach-Assistenten",
          description:
            "Intelligente KI-Agenten für ein- und ausgehende Sprachanrufe, Kundenbetreuung, Lead-Qualifizierung und autonome Aufgabenausführung. Multi-Agent-Systeme, die zusammenarbeiten, denken und handeln — angetrieben durch die neuesten Foundation-Modelle.",
          icon: "bot",
        },
      ],
    },

    transformation: {
      label: "Die Veränderung",
      headline: "Von manuellem Aufwand zu operativer Klarheit",
      items: [
        {
          before: "Manuelle E-Mails und Nachfassaktionen",
          after: "Automatisierte Workflows mit intelligenten Benachrichtigungen",
        },
        {
          before: "Tracking per Spreadsheet",
          after: "Vernetzte Systeme mit Echtzeitdaten",
        },
        {
          before: "Repetitive Dateneingabe",
          after: "Zuverlässige, fehlerfreie Prozesse",
        },
        {
          before: "Fragmentierte, unverbundene Tools",
          after: "Integrierte Abläufe über alle Plattformen",
        },
        {
          before: "Verpasste Nachrichten über WhatsApp, E-Mail und Telefon",
          after: "Einheitliche, automatisierte Kommunikation über alle Kanäle",
        },
        {
          before: "Manuelles Nachfassen und Lead-Tracking",
          after: "Automatisierte Vertriebspipeline mit intelligentem Routing",
        },
      ],
    },

    useCases: {
      label: "Anwendungsfälle",
      headline: "Wo wir Ergebnisse liefern",
      items: [
        {
          title: "Versand & Bestellabwicklung",
          description: "Bestelleingang, Labelerstellung, Carrier-Auswahl und Tracking-Updates automatisieren.",
        },
        {
          title: "Dokumentenverarbeitung",
          description: "Rechnungen, Verträge und Formulare automatisch extrahieren, klassifizieren und weiterleiten.",
        },
        {
          title: "Interne Freigaben",
          description: "Strukturierte Freigabe-Workflows für Einkauf, Verträge und Budgetanträge.",
        },
        {
          title: "Reporting & Dashboards",
          description: "Live-Dashboards, die Daten aus mehreren Quellen automatisch konsolidieren.",
        },
        {
          title: "Kundenoperationen",
          description: "Onboarding, Support-Routing und Kundenkommunikation optimieren.",
        },
        {
          title: "WhatsApp- & Telegram-Automatisierung",
          description: "Automatisiertes Messaging, Support-Bots und transaktionale Benachrichtigungen über alle Kanäle.",
        },
        {
          title: "KI-Sprach- & Chat-Assistenten",
          description: "Intelligente Agenten, die eingehende Anrufe bearbeiten, Fragen beantworten und Anfragen weiterleiten.",
        },
        {
          title: "Vertriebspipeline-Automatisierung",
          description: "Lead-Scoring, Follow-up-Sequenzen, CRM-Synchronisation und Conversion-Tracking.",
        },
        {
          title: "Datensynchronisierung",
          description: "CRM, ERP und Lagersysteme in Echtzeit synchron halten.",
        },
      ],
    },

    integrations: {
      label: "Integrationen",
      headline: "Tools und Plattformen, die wir verbinden",
      items: [
        { name: "WhatsApp", icon: "messageCircle" },
        { name: "Telegram", icon: "send" },
        { name: "n8n", icon: "workflow" },
        { name: "Shopify", icon: "shoppingBag" },
        { name: "CRM-Systeme", icon: "users" },
        { name: "ERP-Systeme", icon: "database" },
        { name: "E-Mail & SMTP", icon: "mail" },
        { name: "REST-APIs", icon: "code" },
        { name: "Google Workspace", icon: "cloud" },
        { name: "Datenbanken", icon: "hardDrive" },
        { name: "Zapier", icon: "zap" },
        { name: "Make", icon: "settings" },
      ],
    },

    howWeWork: {
      label: "Prozess",
      headline: "Wie wir mit Ihnen arbeiten",
      steps: [
        {
          step: "01",
          title: "Verstehen",
          description: "Wir analysieren Ihre Prozesse, identifizieren Engpässe und finden die größten Automatisierungshebel.",
        },
        {
          step: "02",
          title: "Konzipieren",
          description: "Wir entwerfen das passende System — die richtigen Tools, Integrationen und Workflows für Ihre Anforderungen.",
        },
        {
          step: "03",
          title: "Umsetzen",
          description: "Wir entwickeln, testen und deployen iterativ — Sie sind bei jedem Schritt eingebunden.",
        },
        {
          step: "04",
          title: "Optimieren",
          description: "Wir überwachen, verbessern und erweitern Ihre Systeme, wenn Ihr Unternehmen wächst.",
        },
      ],
    },

    whyUs: {
      label: "Warum OpSolid",
      headline: "Was uns unterscheidet",
      points: [
        {
          title: "Business-First-Ansatz",
          description: "Wir beginnen bei Ihren Abläufen, nicht bei unserer Technologie. Jedes System löst ein reales Problem.",
        },
        {
          title: "Maßgeschneidert, nicht von der Stange",
          description: "Ihre Systeme werden um Ihre Arbeitsweise herum entworfen — keine Templates, keine Kompromisse.",
        },
        {
          title: "Gebaut für den Produktivbetrieb",
          description: "Unsere Lösungen laufen unter realer Last. Wir entwickeln für Zuverlässigkeit, nicht für Demos.",
        },
        {
          title: "In Europa verwurzelt, international ausgerichtet",
          description: "Sitz in Deutschland, tätig für Unternehmen in ganz Europa und darüber hinaus. Wir kennen lokale Anforderungen und internationale Skalierung.",
        },
      ],
    },

    cta: {
      headline: "Bereit, KI in Ihre Abläufe zu bringen?",
      description:
        "Buchen Sie ein kostenloses Beratungsgespräch. Wir identifizieren, wo KI-Agenten und Automatisierung Ihr Unternehmen transformieren können — und erstellen einen Fahrplan.",
      primaryCta: "Beratungsgespräch buchen",
    },

    results: {
      label: "Ergebnisse",
      headline: "Messbarer Einfluss auf Ihre Abläufe",
      items: [
        { value: "80%", label: "Weniger manuelle Arbeit", description: "Automatisierung eliminiert typischerweise bis zu 80% der repetitiven manuellen Aufgaben" },
        { value: "5-10x", label: "ROI im ersten Jahr", description: "Unternehmen erzielen 5-10x Rendite auf ihre Automatisierungsinvestition innerhalb von 12 Monaten" },
        { value: "60%", label: "Schnellere Abläufe", description: "Prozesszykluszeiten werden mit intelligenten Workflows um 60% oder mehr reduziert" },
        { value: "35%", label: "Kosteneinsparung", description: "Durchschnittliche Betriebskostenreduktion durch Automatisierung und KI-Agenten" },
      ],
    },

    toolsShowcase: {
      label: "Angetrieben durch",
      headline: "Angetrieben durch KI & Automatisierungsplattformen der nächsten Generation",
      description: "Wir nutzen modernste KI-Modelle, autonome Agenten und die leistungsfähigsten Automatisierungsplattformen, um intelligente Systeme zu bauen, die mit Ihrem Unternehmen wachsen.",
      tools: [
        { name: "n8n", description: "Self-hosted Workflow-Engine für komplexe Automatisierungen. Webhook-Trigger, bedingte Logik und KI-Agenten-Orchestrierungsschleifen.", techFeatures: ["Self-Hosted", "500+ Integrationen", "KI-Agent-Loops", "Webhook-Trigger", "Fehlerbehandlung"] },
        { name: "Make", description: "Visueller Szenario-Builder für mehrstufiges Daten-Routing. Echtzeit-API-Verbindungen, Fehlerverzweigung und automatisierte Datentransformationen.", techFeatures: ["Visueller Builder", "Daten-Routing", "API-Module", "Fehlerverzweigung", "Echtzeit"] },
        { name: "Zapier", description: "6.000+ Apps schnell verbinden mit mehrstufigen Automatisierungen. Bedingte Pfade, geplante Trigger und KI-gestützte Filterung.", techFeatures: ["6.000+ Apps", "Mehrstufig", "Bedingte Logik", "Zeitpläne", "Filter"] },
        { name: "KI-Agenten", description: "Autonome KI-Agenten für Sprachanrufe, Kundenservice, Datenanalyse und Entscheidungsfindung. Gebaut mit den neuesten Foundation-Modellen, RAG-Pipelines und Multi-Agent-Orchestrierung.", techFeatures: ["Sprach-Assistenten", "Multi-Agent", "RAG-Pipeline", "Tool-Nutzung", "Echtzeit"] },
      ],
    },
  },

  solutions: {
    hero: {
      label: "Lösungen",
      headline: "Systeme, die echte operative Probleme lösen",
      description:
        "Automatisierung, interne Tools, Integrationen und Workflow-Systeme — jeweils um Ihre spezifischen Prozesse herum entwickelt.",
    },
    problemsLabel: "Probleme, die wir lösen",
    outcomesLabel: "Erwartete Ergebnisse",
    items: [
      {
        title: "Prozessautomatisierung",
        description: "Repetitive, regelbasierte Aufgaben in Ihrem Unternehmen automatisieren — mit n8n, individuellen Workflows und API-Orchestrierung.",
        problems: [
          "Stundenlange Dateneingabe und Copy-Paste zwischen Systemen",
          "Fehler durch manuelle Übergaben zwischen Abteilungen",
          "Inkonsistente Ausführung je nach Bearbeiter",
          "Engpässe durch manuelle Freigabeketten",
        ],
        outcomes: [
          "Automatisierte End-to-End-Workflows mit Fehlerbehandlung",
          "Konsistente, zuverlässige Ausführung jedes Mal",
          "Echtzeit-Einblick in den Prozessstatus",
          "Wöchentlich Stunden manueller Arbeit eingespart",
        ],
        icon: "workflow",
      },
      {
        title: "Interne Tools & Dashboards",
        description: "Maßgeschneiderte operative Tools — Admin-Panels, Datenoberflächen und Dashboards, die zu Ihren Arbeitsabläufen passen.",
        problems: [
          "Teams arbeiten mit Spreadsheets statt richtigen Tools",
          "Standardsoftware, die nicht zum Prozess passt",
          "Keine zentrale Sicht auf operative Daten",
          "Wichtige Informationen verstreut über E-Mails und Dokumente",
        ],
        outcomes: [
          "Zweckgebundene Tools, die zum Arbeitsablauf passen",
          "Zentralisierte Dashboards mit Echtzeitdaten",
          "Kürzere Einarbeitungszeit für neue Teammitglieder",
          "Bessere Entscheidungen durch bessere Datentransparenz",
        ],
        icon: "layout",
      },
      {
        title: "Workflow-Orchestrierung",
        description: "End-to-End-Workflows, die Menschen, Entscheidungen und Systeme mit voller Nachvollziehbarkeit verbinden.",
        problems: [
          "Kritische Prozesse per E-Mail und Gedächtnis verwaltet",
          "Keine Sicht auf Status oder Verantwortlichkeiten",
          "Aufgaben, die zwischen Abteilungen durchfallen",
          "Prozesse, die mit dem Wachstum nicht skalieren",
        ],
        outcomes: [
          "Klare Workflows mit Verantwortung bei jedem Schritt",
          "Automatisches Routing, Eskalation und Benachrichtigung",
          "Vollständiger Audit-Trail für Compliance",
          "Prozesse, die ohne zusätzliches Personal skalieren",
        ],
        icon: "gitBranch",
      },
      {
        title: "Systemintegration",
        description: "CRM, ERP, Datenbanken und Tools in eine einheitliche Betriebsschicht verbinden. Zuverlässige Integrationen, die Datensilos beseitigen.",
        problems: [
          "Gleiche Daten manuell in mehrere Systeme eingegeben",
          "Entscheidungen auf Basis veralteter oder widersprüchlicher Daten",
          "Punkt-zu-Punkt-Integrations-Anfragen überlasten die IT",
          "Keine einheitliche Datenquelle für den Betrieb",
        ],
        outcomes: [
          "Bidirektionale Datensynchronisation zwischen Kernsystemen",
          "Single Source of Truth für den Betrieb",
          "Eliminierte manuelle Datenübertragung und Fehler",
          "Skalierbare Integrationsarchitektur",
        ],
        icon: "plug",
      },
      {
        title: "Marketing- & Vertriebsautomatisierung",
        description: "Vertriebspipeline, Marketingkampagnen, YouTube-Content-Operations und Lead-Management mit intelligenten Workflows automatisieren.",
        problems: [
          "Leads gehen ohne Follow-up verloren",
          "Manuelle CRM-Updates und verstreute Kampagnendaten",
          "YouTube- und Content-Veröffentlichung wird manuell durchgeführt",
          "Keine Sicht auf Conversion-Metriken über alle Kanäle",
        ],
        outcomes: [
          "Automatisiertes Lead-Scoring und Follow-up-Sequenzen",
          "CRM automatisch mit allen Touchpoints synchronisiert",
          "Content-Veröffentlichung und -Planung auf Autopilot",
          "Einheitliches Analytics-Dashboard für alle Kampagnen",
        ],
        icon: "target",
      },
      {
        title: "Versand & Bestellabwicklung",
        description: "End-to-End-Automatisierung für Bestellverarbeitung, Fulfillment und Versand — Vertriebskanäle, Lager und Carrier verbunden.",
        problems: [
          "Bestellungen manuell über Vertriebskanäle verarbeitet",
          "Labelerstellung und Carrier-Auswahl per Hand",
          "Keine automatischen Tracking-Updates für Kunden",
          "Fulfillment-Fehler durch unverbundene Systeme",
        ],
        outcomes: [
          "Automatisierte Multi-Channel-Bestellverarbeitung",
          "Intelligente Carrier-Auswahl und Labelerstellung",
          "Echtzeit-Tracking über alle Kanäle",
          "Weniger Fehler, schnellerer Versand",
        ],
        icon: "package",
      },
      {
        title: "Messaging- & Kommunikationsautomatisierung",
        description: "Kundenkommunikation über WhatsApp, Telegram, E-Mail und SMS mit intelligentem Routing und vorlagenbasierten Antworten automatisieren.",
        problems: [
          "Supportnachrichten verstreut über WhatsApp, E-Mail und Telefon",
          "Langsame Reaktionszeiten in Stoßzeiten",
          "Keine automatisierten transaktionalen Benachrichtigungen an Kunden",
          "Manueller Aufwand, um Kunden über den Bestellstatus zu informieren",
        ],
        outcomes: [
          "Einheitlicher Posteingang mit automatischem Routing und Tagging",
          "Sofortige Antworten über WhatsApp- und Telegram-Bots",
          "Automatische Bestellbestätigungen und Statusupdates",
          "Rund-um-die-Uhr-Verfügbarkeit ohne zusätzliches Personal",
        ],
        icon: "messageSquare",
      },
      {
        title: "KI-Assistenten & Chatbots",
        description: "Sprachassistenten, Chat-Agenten und intelligente Bots, die Anfragen bearbeiten, Leads qualifizieren und Ihr Team rund um die Uhr unterstützen.",
        problems: [
          "Hohes Volumen repetitiver eingehender Anrufe und Nachrichten",
          "Kunden warten in der Warteschleife oder auf E-Mail-Antworten",
          "Mitarbeiter überlastet durch FAQ-artige Anfragen",
          "Keine Erreichbarkeit außerhalb der Geschäftszeiten",
        ],
        outcomes: [
          "KI-Sprachassistent bearbeitet eingehende Anrufe sofort",
          "Chat-Agenten beantworten Fragen und qualifizieren Leads rund um die Uhr",
          "80 % der Routineanfragen werden ohne menschliches Eingreifen gelöst",
          "Mitarbeiter für komplexe, wertschöpfende Interaktionen freigestellt",
        ],
        icon: "bot",
      },
    ],
    cta: {
      headline: "Nicht sicher, welche Lösung passt?",
      description: "Jedes Unternehmen ist anders. Lassen Sie uns über Ihre Herausforderungen sprechen und das richtige System gemeinsam entwerfen.",
      primaryCta: "Beratungsgespräch buchen",
    },
  },

  useCases: {
    hero: {
      label: "Anwendungsfälle",
      headline: "Wie Unternehmen mit OpSolid besser arbeiten",
      description: "Reale Szenarien, in denen unsere Systeme manuelle Arbeit durch zuverlässige, automatisierte Abläufe ersetzen.",
    },
    labels: {
      context: "Kontext",
      problem: "Problem",
      solution: "Lösung",
      outcome: "Ergebnis",
    },
    items: [
      {
        title: "Multi-Channel-Bestellverarbeitung",
        context: "Mittelständisches E-Commerce-Unternehmen, 200+ tägliche Bestellungen über vier Vertriebskanäle.",
        problem: "4+ Stunden täglich für manuelle Bestelleingabe, Statusaktualisierungen und Bestandsanpassungen. Häufige Fehler in Spitzenzeiten.",
        solution: "Automatisierte Pipeline: Bestelleingang, Datennormalisierung, Echtzeit-Bestand, Labelerstellung und Tracking über alle Kanäle.",
        outcome: "Bearbeitungszeit: 4 Stunden auf 15 Minuten. Fehlerrate -94%. 3x Bestellvolumen mit gleichem Team.",
      },
      {
        title: "Rechnungs- & Dokumentenverarbeitung",
        context: "Logistikunternehmen, 500+ monatliche Rechnungen von Carriern und Lieferanten in verschiedenen Formaten.",
        problem: "Zwei volle Tage pro Woche für Rechnungsdatenextraktion, Buchhaltungseingabe und Bestellabgleich.",
        solution: "KI-gestützte Extraktion, automatischer PO-Abgleich, Abweichungserkennung und direkte Weiterleitung an die Buchhaltung.",
        outcome: "Bearbeitungszeit -75%. Finanzteam konzentriert sich auf Ausnahmen und Strategie.",
      },
      {
        title: "Interne Freigabe-Workflows",
        context: "Wachsendes Unternehmen, 120 Mitarbeiter. Einkauf, Reisen, Contractor-Onboarding per E-Mail verwaltet.",
        problem: "Anfragen gehen in E-Mails verloren. Keine Transparenz, kein Audit-Trail. Prozess variiert je nach Manager.",
        solution: "Strukturiertes Freigabesystem: Formulareinreichung, regelbasiertes Routing, Tracking, automatische Erinnerungen.",
        outcome: "Freigabezeit: 5 Tage auf 1,2 Tage. Null verlorene Anfragen. Vollständiger Audit-Trail.",
      },
      {
        title: "Operations-Dashboard",
        context: "Distributionsunternehmen, das Vertrieb, Lager und Lieferung über separate wöchentliche Spreadsheets trackt.",
        problem: "Berichte immer eine Woche alt, oft inkonsistent. Entscheidungen auf Bauchgefühl basiert.",
        solution: "Live-Dashboard mit Daten aus ERP, Lagersystem und Lieferverfolgung. Konfigurierbare Alerts bei Anomalien.",
        outcome: "Montagsmeetings: 2 Stunden auf 30 Minuten. Probleme werden in Echtzeit erkannt.",
      },
      {
        title: "Kunden-Onboarding",
        context: "B2B-Dienstleister, monatlich 15-20 neue Kunden mit mehrstufigem Prozess.",
        problem: "Checkliste im geteilten Dokument. Schritte vergessen, inkonsistente Erfahrung, 2-3 Wochen Onboarding.",
        solution: "Automatisierter Workflow: Willkommens-E-Mails, Account-Einrichtung, Dokumenten-Tracking, Status-Dashboard.",
        outcome: "Onboarding: 3 Wochen auf 5 Tage. Keine vergessenen Schritte. Bessere Kundenzufriedenheit.",
      },
      {
        title: "Back-Office-Digitalisierung",
        context: "Fertigungsunternehmen. HR und Einkauf arbeiten noch mit Papierformularen und lokalen Dateien.",
        problem: "Tage für Papierverarbeitung. Inkonsistente Kanäle. Nichts durchsuchbar oder nachvollziehbar.",
        solution: "Digitale Workflows für Onboarding, Bestellanforderungen und Dokumentenmanagement mit Versionierung.",
        outcome: "Papier eliminiert. HR-Onboarding -60%. Bestellanforderungen: 1 Woche auf 2 Tage.",
      },
      {
        title: "Systemübergreifende Datensynchronisation",
        context: "Handelsunternehmen mit Shopify, ERP, WMS und HubSpot — jedes System mit eigenen Daten.",
        problem: "Stundenlange manuelle Synchronisation täglich. Häufige Diskrepanzen zwischen Systemen.",
        solution: "Zentrale Integrationsschicht mit Echtzeit-Sync, Konflikterkennung und Fehlerbehandlung.",
        outcome: "Manuelle Synchronisation eliminiert. Diskrepanzen gegen null. 15+ Stunden/Woche umverteilt.",
      },
      {
        title: "Automatisierte Kundenkommunikation",
        context: "Dienstleistungsunternehmen. Statusupdates und Follow-ups werden manuell von drei Personen verwaltet.",
        problem: "Nachrichten verspätet, inkonsistent oder vergessen. Kommunikation bricht in Hochphasen ein.",
        solution: "Automatisierte Kommunikation, ausgelöst durch Service-Meilensteine. Konsistente Vorlagen mit Überschreibungsoption.",
        outcome: "100% Kommunikationszuverlässigkeit. 20+ Stunden/Woche gespart. Zufriedenheit +35%.",
      },
      {
        title: "WhatsApp- & Telegram-Supportkanal",
        context: "E-Commerce-Unternehmen mit 300+ täglichen Kundenanfragen über WhatsApp, Telegram und E-Mail.",
        problem: "Drei Mitarbeiter beantworten manuell dieselben Fragen. Keine Erreichbarkeit außerhalb der Geschäftszeiten. Nachrichten gehen zwischen Kanälen verloren.",
        solution: "Einheitlicher Messaging-Hub mit automatisierten FAQ-Antworten, Bestellstatus-Abfragen und intelligentem Routing an menschliche Agenten bei komplexen Anliegen.",
        outcome: "70 % der Anfragen automatisch gelöst. Antwortzeit unter 30 Sekunden. Volle Erreichbarkeit außerhalb der Geschäftszeiten.",
      },
      {
        title: "KI-Sprachassistent für eingehende Anrufe",
        context: "Dienstleistungsunternehmen mit 100+ täglichen Anrufen — Terminbuchungen, Statusanfragen, allgemeine Fragen.",
        problem: "Zwei Vollzeitkräfte am Telefon. Lange Wartezeiten. Verpasste Anrufe in Stoßzeiten und außerhalb der Geschäftszeiten.",
        solution: "KI-Sprachassistent für eingehende Anrufe: FAQ-Beantwortung, Terminbuchung, Weiterleitung komplexer Anrufe an die richtige Abteilung.",
        outcome: "60 % der Anrufe ohne menschliches Eingreifen bearbeitet. Null verpasste Anrufe. Mitarbeiter für höherwertige Aufgaben freigestellt.",
      },
      {
        title: "YouTube-Content-Operations",
        context: "Marketingteam, das monatlich 8-12 Videos auf mehreren YouTube-Kanälen mit lokalisierten Metadaten veröffentlicht.",
        problem: "Manueller Upload, Titel-/Beschreibungs-/Tag-Eingabe, Thumbnail-Zuweisung und Planung. 3+ Stunden pro Video.",
        solution: "Automatisierte Pipeline: Videoverarbeitung, Metadaten-Generierung, Thumbnail-Zuweisung, geplante Veröffentlichung und Performance-Tracking-Dashboard.",
        outcome: "Veröffentlichungszeit auf 20 Minuten pro Video reduziert. Konsistente Metadaten-Qualität. Zentralisierte Analysen.",
      },
      {
        title: "Vertriebspipeline-Automatisierung",
        context: "B2B-Unternehmen mit 50+ aktiven Leads. Vertriebsteam nutzt CRM, trackt Follow-ups aber manuell und aktualisiert Deal-Stufen per Hand.",
        problem: "Leads werden kalt durch verpasste Follow-ups. Inkonsistente Daten im CRM. Keine Sicht auf Pipeline-Gesundheit.",
        solution: "Automatisiertes Lead-Scoring, verhaltensgesteuerte Follow-up-Sequenzen, automatische CRM-Updates und Pipeline-Dashboard mit Alerts.",
        outcome: "Follow-up-Rate: 100 %. Lead-to-Meeting-Conversion +40 %. Echtzeit-Pipeline-Transparenz für das Management.",
      },
    ],
    cta: {
      headline: "Erkennen Sie sich in diesen Szenarien?",
      description: "Wenn Ihr Team Zeit mit Arbeit verbringt, die automatisiert werden sollte, sollten wir sprechen.",
      primaryCta: "Beratungsgespräch buchen",
    },
  },

  about: {
    hero: {
      label: "Über OpSolid",
      headline: "Operative Infrastruktur für Unternehmen, die manuelle Prozesse hinter sich lassen",
      description: "Sitz in Deutschland. Fokussiert auf eines: manuelle, repetitive Arbeit durch zuverlässige automatisierte Systeme zu ersetzen.",
    },
    story: {
      headline: "Warum es uns gibt",
      paragraphs: [
        "Jedes wachsende Unternehmen erreicht einen Punkt, an dem manuelle Prozesse zum Engpass werden. Bestellungen stauen sich, Freigaben gehen in E-Mails verloren, Daten leben in unverbundenen Spreadsheets, und Teams verbringen mehr Zeit mit Overhead als mit wertschöpfender Arbeit.",
        "OpSolid wurde gegründet, um genau dieses Problem zu lösen. Wir verbinden tiefes Prozessverständnis mit moderner Automatisierung, Integration und KI, um Systeme zu bauen, die operative Arbeit übernehmen — zuverlässig, konsistent und skalierbar.",
        "Wir sind keine generische Technologie-Agentur. Wir bauen keine Marketing-Websites und schalten keine Werbung. Wir fokussieren uns auf operative Systeme: die Workflows, Tools und Integrationen, die ein Unternehmen jeden Tag am Laufen halten.",
      ],
    },
    values: {
      headline: "Wie wir über unsere Arbeit denken",
      items: [
        {
          title: "Erst der Prozess, dann die Technologie",
          description: "Wir investieren Zeit, um zu verstehen, wie Ihr Unternehmen tatsächlich arbeitet, bevor wir eine Lösung vorschlagen.",
        },
        {
          title: "Gebaut für den Produktivbetrieb, nicht für Demos",
          description: "Unsere Systeme verarbeiten echte Lasten. Wir entwickeln für Zuverlässigkeit, Fehlerbehandlung und Grenzfälle.",
        },
        {
          title: "Ergebnisse messen, nicht Features",
          description: "Uns geht es um eingesparte Stunden, eliminierte Fehler und verbesserte Prozesse — nicht um Feature-Listen.",
        },
        {
          title: "Praktisch bleiben, ehrlich bleiben",
          description: "Wir empfehlen Automatisierung dort, wo sie Sinn ergibt — und raten davon ab, wo nicht.",
        },
      ],
    },
    founder: {
      name: "Hasan Dönmez",
      title: "Gründer & Systemarchitekt",
      education: "M.Sc. Elektrotechnik & Informationstechnik — Karlsruher Institut für Technologie (KIT)",
      description: "Hasan hat einen Master-Abschluss in Elektrotechnik & Informationstechnik vom Karlsruher Institut für Technologie (KIT), einer der führenden Forschungsuniversitäten Deutschlands. Mit fundierter Expertise in Prozessautomatisierung, Systemintegration und KI-gestützten Workflows — ergänzt durch weiterführende Ausbildung in Data Science, Machine Learning, Deep Learning und Business Intelligence — baut er operative Systeme, die reale Geschäftsprobleme lösen. Sein Ingenieur-Hintergrund garantiert, dass jede Lösung auf Zuverlässigkeit, Skalierbarkeit und messbare Ergebnisse ausgelegt ist.",
      expertiseLabel: "Kernkompetenzen",
      expertise: [
        "Prozessautomatisierung & Workflow-Engineering",
        "Data Science & Machine Learning",
        "Deep Learning & KI-Systeme",
        "Business Intelligence & Analytics",
        "Systemintegration & API-Entwicklung",
      ],
      footnote: "Sitz in Deutschland. Tätig für Unternehmen in Europa und international.",
    },
    cta: {
      headline: "Lassen Sie uns etwas bauen, das funktioniert",
      description: "Wenn Ihre Abläufe weniger manuelle Arbeit und zuverlässigere Systeme brauchen, freuen wir uns auf Ihre Nachricht.",
      primaryCta: "Kontakt aufnehmen",
    },
  },

  contact: {
    hero: {
      label: "Kontakt",
      headline: "Lassen Sie uns über Ihre Abläufe sprechen",
      description: "Ob Sie eine konkrete Automatisierungs-Herausforderung haben oder Möglichkeiten erkunden möchten — kein Verkaufsdruck, nur ein sachliches Gespräch.",
    },
    form: {
      name: "Vollständiger Name",
      email: "Geschäftliche E-Mail",
      company: "Firmenname",
      message: "Welche operative Herausforderung möchten Sie lösen?",
      consent: "Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu. Meine Daten werden ausschließlich zur Bearbeitung dieser Anfrage verwendet.",
      privacyLink: "Datenschutzerklärung",
      submit: "Nachricht senden",
      sending: "Wird gesendet...",
      success: "Vielen Dank. Wir melden uns innerhalb von 1-2 Werktagen bei Ihnen.",
      error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.",
    },
    meeting: {
      headline: "Lieber direkt sprechen?",
      description: "Buchen Sie ein kostenloses 30-minütiges Erstgespräch. Wählen Sie einen passenden Termin — verfügbare Zeiten werden live aus unserem Kalender synchronisiert.",
      cta: "Gespräch vereinbaren",
    },
    info: {
      email: "hello@opsolid.de",
      response: "Wir antworten in der Regel innerhalb von 1-2 Werktagen.",
      location: "Sitz in Deutschland. Kunden in ganz Europa und international.",
    },
  },

  footer: {
    description: "Operative Infrastruktur für moderne Unternehmen. Automatisierung, interne Tools und Workflow-Systeme.",
    company: "Unternehmen",
    services: "Leistungen",
    legal: "Rechtliches",
    resources: "Ressourcen",
    copyright: `© ${new Date().getFullYear()} OpSolid. Alle Rechte vorbehalten.`,
  },

  notFound: {
    title: "Seite nicht gefunden",
    description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    backHome: "Zur Startseite",
    contactUs: "Kontakt",
  },

  impressum: {
    title: "Impressum",
    notice: "Dieses Impressum gilt für ein Unternehmen in Gründung. Die Angaben werden nach der Gewerbeanmeldung aktualisiert.",
    sections: {
      according: "Angaben gemäß § 5 TMG",
      representedBy: "Vertreten durch",
      contact: "Kontakt",
      phone: "Telefon: Auf Anfrage",
      register: "Registereintrag",
      registerText: "Ein Handelsregistereintrag besteht derzeit nicht. Das Unternehmen befindet sich in Gründung.",
      vatId: "Umsatzsteuer-ID",
      vatIdText: "Wird nach Gewerbeanmeldung beantragt.",
      responsibleContent: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
      liabilityContent: "Haftung für Inhalte",
      liabilityContentText: "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.",
      liabilityLinks: "Haftung für Links",
      liabilityLinksText: "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.",
      address: "Vollständige Adresse wird nach Gewerbeanmeldung ergänzt.",
    },
  },

  privacy: {
    title: "Datenschutzerklärung",
    subtitle: "Datenschutzerklärung",
    notice: "Diese Datenschutzerklärung ist ein Entwurf. Sie wird nach der Gewerbeanmeldung durch eine rechtlich geprüfte Fassung ersetzt.",
    lastUpdated: "Letzte Aktualisierung: März 2026",
    sections: [
      {
        title: "1. Datenschutz auf einen Blick",
        content: "Im Folgenden erhalten Sie einen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.",
      },
      {
        title: "2. Verantwortliche Stelle",
        isResponsible: "true",
      },
      {
        title: "3. Datenerfassung",
        subsections: [
          {
            title: "Kontaktformular",
            content: "Die über das Kontaktformular übermittelten Daten werden zur Bearbeitung der Anfrage und für Nachfragen gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogenen Anfragen, Art. 6 Abs. 1 lit. f DSGVO bei berechtigtem Interesse oder Art. 6 Abs. 1 lit. a DSGVO bei erteilter Einwilligung.",
          },
          {
            title: "Server-Logdateien",
            content: "Der Hosting-Anbieter erfasst automatisch Browsertyp, Betriebssystem, Referrer-URL, Hostname und Zeitpunkt der Anfrage. Diese Daten können keinen bestimmten Personen zugeordnet werden.",
          },
        ],
      },
      {
        title: "4. Hosting",
        content: "Diese Website wird bei Vercel, Inc. (440 N Baxter St, Los Angeles, CA 90012, USA) gehostet. Beim Besuch unserer Website werden Ihre IP-Adresse und Nutzungsdaten von Vercel verarbeitet. Weitere Informationen finden Sie in der Datenschutzerklärung von Vercel.",
      },
      {
        title: "5. Cookies & Analysetools",
        content: "Diese Website verwendet keine Tracking-Cookies oder Analysetools. Eine Sprachpräferenz wird im lokalen Speicher Ihres Browsers gespeichert, um Ihre gewählte Sprache zu merken.",
      },
      {
        title: "6. Ihre Rechte",
        content: "Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten, Berichtigung oder Löschung, Einschränkung der Verarbeitung und Beschwerde bei einer Aufsichtsbehörde. Bei erteilter Einwilligung können Sie diese jederzeit widerrufen.",
      },
    ],
  },

  blog: {
    hero: {
      label: "Blog",
      headline: "Einblicke in Automatisierung & Betrieb",
      description: "Praxisnahe Artikel über Workflow-Automatisierung, Integrationsstrategien und operative Effizienz.",
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
        slug: "warum-n8n-die-zukunft-der-workflow-automatisierung-ist",
        title: "Warum n8n die Zukunft der Workflow-Automatisierung ist",
        excerpt: "Erfahren Sie, warum n8n zur bevorzugten Plattform für Unternehmen geworden ist, die leistungsstarke, selbst gehostete Workflow-Automatisierung mit voller Datenkontrolle benötigen.",
        category: "automation",
        date: "2026-03-15",
        readTime: "6",
      },
      {
        slug: "5-zeichen-dass-ihr-unternehmen-prozessautomatisierung-braucht",
        title: "5 Zeichen, dass Ihr Unternehmen Prozessautomatisierung braucht",
        excerpt: "Versinkt Ihr Team in manueller Arbeit? Hier sind die entscheidenden Indikatoren, dass es Zeit ist, in Automatisierungsinfrastruktur zu investieren.",
        category: "operations",
        date: "2026-03-08",
        readTime: "5",
      },
      {
        slug: "crm-und-erp-verbinden-der-integrations-leitfaden",
        title: "CRM & ERP verbinden: Der Integrations-Leitfaden",
        excerpt: "Ein praktischer Leitfaden zur Synchronisierung Ihrer CRM- und ERP-Systeme — Datensilos beseitigen und eine einheitliche Datenquelle schaffen.",
        category: "integration",
        date: "2026-02-28",
        readTime: "8",
      },
      {
        slug: "ki-chatbots-vs-regelbasierte-bots",
        title: "KI-Chatbots vs. regelbasierte Bots: Was brauchen Sie?",
        excerpt: "Den Unterschied zwischen KI-gesteuerten und regelbasierten Chatbots verstehen — und wann welcher Ansatz für Ihr Unternehmen sinnvoll ist.",
        category: "ai",
        date: "2026-02-20",
        readTime: "7",
      },
      {
        slug: "make-vs-zapier-vs-n8n-vergleich",
        title: "Make vs. Zapier vs. n8n: Die richtige Automatisierungsplattform wählen",
        excerpt: "Ein detaillierter Vergleich der drei beliebtesten Automatisierungsplattformen — Funktionen, Preise, Flexibilität und Einsatzszenarien.",
        category: "automation",
        date: "2026-02-12",
        readTime: "10",
      },
      {
        slug: "whatsapp-business-automatisierung-leitfaden",
        title: "Der komplette Leitfaden zur WhatsApp Business Automatisierung",
        excerpt: "Wie Sie die Kundenkommunikation auf WhatsApp automatisieren — von Bestellbestätigungen bis zu Support-Bots — ohne die persönliche Note zu verlieren.",
        category: "automation",
        date: "2026-02-05",
        readTime: "9",
      },
    ],
    cta: {
      headline: "Möchten Sie Ihre Abläufe automatisieren?",
      description: "Buchen Sie ein kostenloses Beratungsgespräch. Wir identifizieren die wirkungsvollsten Automatisierungsmöglichkeiten für Ihr Unternehmen.",
      primaryCta: "Beratungsgespräch buchen",
    },
  },

  faq: {
    hero: {
      label: "FAQ",
      headline: "Häufig gestellte Fragen",
      description: "Häufige Fragen zu unseren Automatisierungsdiensten, unserem Prozess und unserer Technologie.",
    },
    allFilter: "Alle",
    categories: {
      general: "Allgemein",
      technical: "Technisch",
      process: "Prozess & Preise",
    },
    items: [
      {
        question: "Was genau macht OpSolid?",
        answer: "Wir bauen Automatisierungssysteme, Integrationen und interne Tools für Unternehmen. Wenn Ihr Team Zeit mit manueller, repetitiver Arbeit verbringt — Dateneingabe, E-Mail-Follow-ups, Bestellverarbeitung, Berichtserstellung — bauen wir Systeme, die das automatisch, zuverlässig und skalierbar erledigen.",
        category: "general",
      },
      {
        question: "Welche Tools und Plattformen nutzen Sie?",
        answer: "Unsere primäre Automatisierungsplattform ist n8n, ergänzt durch Make und Zapier wo passend. Wir bauen auch individuelle Integrationen mit APIs, Datenbanken und Cloud-Diensten. Für KI-Lösungen nutzen wir OpenAI, Claude und eigene ML-Modelle. Wir wählen immer das richtige Tool für den jeweiligen Anwendungsfall.",
        category: "technical",
      },
      {
        question: "Was ist n8n und warum bevorzugen Sie es?",
        answer: "n8n ist eine Open-Source-Workflow-Automatisierungsplattform, die selbst gehostet werden kann und Ihnen volle Kontrolle über Ihre Daten und Workflows gibt. Sie ist extrem flexibel, unterstützt Hunderte von Integrationen und ermöglicht individuellen Code bei Bedarf. Wir bevorzugen n8n wegen der besten Balance aus Leistung, Flexibilität und Datensouveränität.",
        category: "technical",
      },
      {
        question: "Wie lange dauert ein typisches Projekt?",
        answer: "Die meisten Projekte dauern 2-6 Wochen von der Analyse bis zum Deployment, abhängig von der Komplexität. Einfache Automatisierungen können innerhalb weniger Tage live sein. Wir arbeiten iterativ — Sie sehen früh und regelmäßig Ergebnisse.",
        category: "process",
      },
      {
        question: "Bieten Sie nach dem Deployment fortlaufenden Support?",
        answer: "Ja. Wir bieten Monitoring-, Wartungs- und Optimierungspakete. Automatisierungssysteme entwickeln sich mit Ihrem Unternehmen weiter — wir sorgen dafür, dass Ihre Systeme Schritt halten. Zudem liefern wir Dokumentation und Schulungen.",
        category: "process",
      },
      {
        question: "Was kostet es?",
        answer: "Jedes Projekt ist anders. Wir bieten ein kostenloses Erstgespräch, um Ihre Anforderungen zu verstehen, und erstellen dann ein transparentes Angebot. Unsere Preise sind projektbasiert, nicht stundenbasiert — Sie kennen die Investition im Voraus.",
        category: "process",
      },
      {
        question: "Können Sie sich in unsere bestehenden Systeme integrieren?",
        answer: "Mit ziemlicher Sicherheit. Wir arbeiten mit CRMs (HubSpot, Salesforce, Pipedrive), ERPs (SAP, Oracle, Odoo), E-Commerce-Plattformen (Shopify, WooCommerce), Datenbanken, Google Workspace und praktisch jedem System mit API.",
        category: "technical",
      },
      {
        question: "Müssen wir unsere bestehenden Tools wechseln?",
        answer: "Nein. Wir bauen Systeme, die Ihre bestehenden Tools verbinden — wir ersetzen sie nicht. Unser Ziel ist es, das, was Sie bereits haben, besser zusammenarbeiten zu lassen und Datensilos sowie manuelle Übergaben zu eliminieren.",
        category: "general",
      },
      {
        question: "Sind unsere Daten sicher?",
        answer: "Absolut. Wir können die gesamte Automatisierungsinfrastruktur in Ihrer eigenen Umgebung hosten. Wir folgen den DSGVO-Anforderungen, implementieren Verschlüsselung für sensible Daten und nutzen sichere API-Verbindungen. Keine Daten laufen über Drittanbieter-Server, es sei denn, Sie wählen explizit Cloud-gehostete Lösungen.",
        category: "technical",
      },
      {
        question: "Welche Branchen bedienen Sie?",
        answer: "Wir arbeiten branchenübergreifend — E-Commerce, Logistik, Fertigung, Dienstleistungen und mehr. Unsere Lösungen werden um Ihre Prozesse herum gebaut, nicht um Ihre Branche. Wenn Sie Abläufe mit repetitiver manueller Arbeit haben, können wir helfen.",
        category: "general",
      },
    ],
    cta: {
      headline: "Noch Fragen?",
      description: "Wir beantworten gerne weitere Fragen. Buchen Sie ein kostenloses Beratungsgespräch und lassen Sie uns über Ihre Situation sprechen.",
      primaryCta: "Beratungsgespräch buchen",
    },
  },
} as const;
