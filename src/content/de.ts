// =============================================================================
// GERMAN CONTENT (Deutsch)
// Struktur identisch mit en.ts — alle Werte ins Deutsche übersetzt (Siezen).
// =============================================================================

import type { Content } from "./en";

export const content: Content = {
  consent: {
    title: "Cookies & Analyse",
    body: "Wir setzen ein minimales Analyse-Tool ein, um die Nutzung von OpSolid zu verstehen. Keine Marketing-Cookies, keine Profilbildung. Du kannst deine Wahl jederzeit ändern.",
    privacyLink: "Datenschutzerklärung lesen",
    accept: "Akzeptieren",
    reject: "Ablehnen",
  },

  nav: {
    solutions: "Leistungen",
    products: "Produkte",
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
      ratingPill: "",
      title: [
        "Automatisierung, die",
        "Ihren Betrieb steuert —",
        "nicht umgekehrt.",
      ],
      subtitle:
        "OpSolid entwickelt praxisnahe Automatisierungs- und KI-Systeme für den echten Geschäftsbetrieb — Workflow-Automatisierung, Systemintegration, interne Tools und KI-gestützte Prozesse.",
      primaryCtaLabel: "Erstgespräch buchen",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Leistungen ansehen",
      secondaryCtaHref: "/solutions",
      footnote: "",
      consultingNote:
        "Wir liefern auch eigenständige Produkte — Kutasia, Digital Business Card, Digital Reception.",
      editorial: {
        eyebrow: "",
        title: [
          "Systeme, die im Hintergrund",
          "Ihres Betriebs zuverlässig",
          "laufen.",
        ],
        paragraph:
          "Praxisnahe Automatisierung für den Mittelstand — Bestellungen, Dokumente, Freigaben, Kommunikation. Integriert sich in Ihren Stack, statt ihn zu ersetzen.",
        primaryCta: "Termin vereinbaren",
        secondaryCta: "Wie wir arbeiten",
        stackLabel: "Bewährter Stack",
        schematic: {
          trigger: "Trigger",
          triggerDetail: "Webhook / Formular",
          parse: "Parsen",
          parseDetail: "KI · PDF-OCR",
          route: "Routen",
          routeDetail: "If / Else",
          write: "Schreiben",
          writeDetail: "Postgres",
          notify: "Benachrichtigen",
          notifyDetail: "WhatsApp / E-Mail",
          caption: "Workflow · v1",
        },
      },
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
        "Wiederkehrende Workflows mit individuell entwickelten Automatisierungen ablösen",
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
            "Automatisierte Workflows, die manuelle Schritte ersetzen — von Dateneingabe und Freigaben bis hin zu Benachrichtigungen und Reporting. Umgesetzt über API-Integrationen und individuelle Geschäftslogik.",
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
        { name: "Custom Workflows", icon: "workflow" },
        { name: "Shopify", icon: "shoppingBag" },
        { name: "CRM-Systeme", icon: "users" },
        { name: "ERP-Systeme", icon: "database" },
        { name: "E-Mail & SMTP", icon: "mail" },
        { name: "REST APIs", icon: "code" },
        { name: "Google Workspace", icon: "cloud" },
        { name: "Datenbanken", icon: "hardDrive" },
        { name: "Webhooks", icon: "zap" },
        { name: "Message Queues", icon: "settings" },
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
      label: "Bausteine",
      headline: "Bausteine, mit denen OpSolid Automatisierung umsetzt",
      description:
        "Jedes Projekt wird als individuelles System ausgeliefert — gebaut aus produktionsreifen Engineering-Schichten, ausgewählt für Ihren Betrieb statt aus einem One-size-fits-all-Werkzeugkasten.",
      tools: [
        {
          name: "Custom Workflow Engine",
          description:
            "Individuell entwickelte Workflow-Engines für komplexe Automatisierungen. Webhook-Trigger, bedingte Logik, Retries und vollständige Datenhoheit — keine geschlossene Laufzeitumgebung.",
          techFeatures: [
            "Self-Hosted",
            "Offene Architektur",
            "Webhook-Trigger",
            "Fehlerbehandlung",
            "Datenhoheit",
          ],
        },
        {
          name: "API Orchestration",
          description:
            "Mehrstufige Orchestrierung über REST APIs, GraphQL und Message Queues. Eingebaute Transformation, Verzweigung und Fehlerbehandlung für den Produktionsbetrieb.",
          techFeatures: [
            "REST · GraphQL",
            "Daten-Routing",
            "API-Module",
            "Fehlerverzweigung",
            "Echtzeit",
          ],
        },
        {
          name: "AI Layer",
          description:
            "Praxisnahe KI-Bausteine: Klassifizierung, Extraktion, Voice- und Chat-Agenten. Auditierbare Modellaufrufe, strukturierte Ausgaben und Human-in-the-Loop-Checkpoints.",
          techFeatures: [
            "Voice-Agenten",
            "Dokumenten-KI",
            "Klassifizierung",
            "Strukturierte Ausgabe",
            "Audit-Logs",
          ],
        },
        {
          name: "Self-Hosted Stack",
          description:
            "Komplettes Deployment auf Ihrer eigenen Infrastruktur oder in EU-gehosteten Umgebungen — Postgres, Queues, Observability. Der Ausstieg ist immer zwei Wochen entfernt.",
          techFeatures: [
            "Postgres",
            "Message Queues",
            "Observability",
            "EU-gehostet",
            "Quellcode gehört Ihnen",
          ],
        },
      ],
    },

    trustStrip: {
      items: [],
    },

    featureGrid: {
      label: "Was OpSolid baut",
      headline: "Automatisierung, KI und interne Tools — für den Betrieb, den Sie bereits führen.",
      description:
        "Sechs Fokusbereiche. Jedes Projekt startet mit Ihrem Prozess — nicht mit einem Technologie-Pitch.",
      items: [
        {
          icon: "workflow",
          title: "Workflow-Automatisierung",
          description:
            "End-to-End-Automatisierung für repetitive, regelbasierte Arbeit — mit maßgeschneiderten Integrationen. Saubere Fehlerbehandlung und Monitoring von Anfang an.",
        },
        {
          icon: "plug",
          title: "Systemintegration",
          description:
            "Verknüpfung von CRM, ERP, Datenbanken und Kommunikationstools zu einer einheitlichen operativen Ebene. Eine Wahrheitsquelle statt Datensilos.",
        },
        {
          icon: "layout",
          title: "Interne Tools & Dashboards",
          description:
            "Individuelle Admin-Panels, Dashboards und interne Apps — gebaut um die Art, wie Ihr Team tatsächlich arbeitet.",
        },
        {
          icon: "bot",
          title: "KI-gestützte Prozesse",
          description:
            "Praxisnahe KI — Dokumentenverarbeitung, Klassifikation, Sprach-Agenten, Chat-Assistenten — eingebettet in Ihre bestehenden Abläufe, nicht aufgesetzt.",
        },
        {
          icon: "messageSquare",
          title: "Kommunikations-Automatisierung",
          description:
            "Automatisierte Nachrichten über WhatsApp, Telegram, E-Mail und SMS — von Statusupdates bis Follow-up-Sequenzen. Kanal-agnostisch.",
        },
        {
          icon: "shield",
          title: "Gehostet in Europa",
          description:
            "Self-hosted oder in EU-Infrastruktur deployed. Keine US-Subauftragnehmer, außer Sie möchten es explizit.",
        },
      ],
    },

    howItWorks: {
      label: "Vorgehen",
      headline: "Drei Schritte.",
      steps: [
        {
          title: "Analyse",
          description:
            "Wir kartieren Ihre tatsächlichen Prozesse, identifizieren Engpässe und finden heraus, wo Automatisierung sich rechnet. Sie erhalten einen schriftlichen Scope, bevor Code entsteht.",
        },
        {
          title: "Design & Umsetzung",
          description:
            "Wir entwerfen die zu Ihren Prozessen passende Architektur, setzen sie mit individuellem Code um und liefern iterativ aus — mit klaren Updates in jedem Schritt.",
        },
        {
          title: "Betrieb & Weiterentwicklung",
          description:
            "Wir überwachen, optimieren und erweitern Ihre Systeme mit Ihrem Betrieb. Volle Dokumentation. Die Infrastruktur gehört jederzeit Ihnen.",
        },
      ],
    },

    whoUses: {
      label: "Für wen wir arbeiten",
      headline: "Teams, die ihre Abläufe skalieren möchten.",
      items: [
        {
          title: "Hotellerie & Service",
          description:
            "Hotels, Kliniken, Salons und Restaurants, die Buchungen, Kundengespräche und Mehrkanal-Abläufe steuern.",
          icon: "founder",
        },
        {
          title: "Handel & E-Commerce",
          description:
            "Mehrkanal-Händler, die Bestellungen, Lager, Fulfillment und ERP/CRM-Synchronisation jonglieren.",
          icon: "sales",
        },
        {
          title: "Professional Services",
          description:
            "Beratungen, Kanzleien, Steuerbüros und Agenturen, die Dokumentenprüfung, Intake und Kunden-Onboarding automatisieren.",
          icon: "agency",
        },
        {
          title: "Operations-Teams",
          description:
            "Interne Ops-Leads, die verlässliche interne Tools, Freigabe-Workflows und Dashboards statt weiterer Tabellen einsetzen möchten.",
          icon: "freelancer",
        },
      ],
    },

    pricingPreview: {
      label: "Zwei Wege, mit OpSolid zu arbeiten",
      headline: "Maßgeschneiderte Systeme — oder eigenständige Produkte.",
      description:
        "Die meisten Kunden starten mit individueller Automatisierung. Wer ein fertiges Werkzeug braucht, wählt eines unserer eigenständigen Produkte — auf demselben Fundament gebaut.",
      cards: [
        {
          title: "Individuelle Automatisierung",
          priceLabel: "Projektbasiert",
          priceCadence: "startet mit einem Erstgespräch",
          bullets: [
            "Individuelle Workflow-Automatisierung",
            "Systemintegration über CRM, ERP, APIs",
            "Interne Tools, Admin-Panels, Dashboards",
            "KI-gestützte Workflows und Kommunikation",
          ],
          ctaLabel: "Erstgespräch buchen",
          ctaHref: "/contact",
          tone: "brand",
        },
        {
          title: "Eigenständige Produkte",
          priceLabel: "Self-Serve",
          priceCadence: "direkt einsatzbereit · Preis pro Produkt",
          bullets: [
            "Kutasia — Multi-Branchen-Kundenplattform",
            "Digital Business Card — Link, QR, optional NFC",
            "Digital Reception — KI-Empfang für Service-Betriebe",
            "Jedes Produkt direkt einsatzbereit",
          ],
          ctaLabel: "Alle Produkte ansehen",
          ctaHref: "/products",
          tone: "dark",
        },
      ],
    },

    testimonials: {
      label: "Stimmen aus der Praxis",
      headline: "Was Teams nach der Zusammenarbeit mit OpSolid bemerken.",
      items: [
        {
          quote:
            "Wir kopieren keine Bestelldaten mehr zwischen vier Systemen. Der Prozess läuft automatisiert vor Arbeitsbeginn — ohne manuelle Dateneingabe.",
          name: "Lena Richter",
          role: "Head of Operations",
          company: "Mittelständischer Handel",
        },
        {
          quote:
            "OpSolid wollte uns keine Plattform verkaufen. Sie haben unseren echten Prozess kartiert, die repetitiven Teile automatisiert und uns volle Dokumentation übergeben.",
          name: "Marco Weber",
          role: "COO",
          company: "Industrieunternehmen, Deutschland",
        },
        {
          quote:
            "Der gesamte Integrationslayer ist self-hosted. Keine US-Subauftragnehmer. Legal hat in einem einzigen Meeting freigegeben.",
          name: "Sarah Klein",
          role: "IT-Leitung",
          company: "Dienstleistungsunternehmen",
        },
      ],
    },

    finalCta: {
      eyebrow: "ERSTGESPRÄCH",
      headline:
        "Sehen wir uns Ihre Prozesse gemeinsam an.",
      description:
        "Buchen Sie ein kostenloses Erstgespräch. Wir zeigen Ihnen, wo Automatisierung sich rechnet — und wo nicht.",
      primaryCtaLabel: "Erstgespräch buchen",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Leistungen ansehen",
      secondaryCtaHref: "/solutions",
    },

    cardStrip: {
      eyebrow: "VORLAGEN",
      heading: "10 Branchenvorlagen, sofort einsatzbereit",
      paragraph:
        "Immobilien, Klinik, Restaurant, DJ, Barber, E-Commerce, Architekt, Fitness — 10 Tap-to-Share-Karten, pro Branche zugeschnitten. Zum Live-Vorschau klicken.",
      ctaLabel: "Alle Vorlagen ansehen",
      ctaHref: "/products/digital-card",
    },

    agentShowcase: {
      eyebrow: "KI-AGENTEN",
      heading: "KI-Agenten für Telefon, Chat und Terminbuchung",
      paragraph:
        "Voice auf Ihrer Telefonleitung, Chat auf Ihrer Website, Buchungen in Ihrem Kalender — gebaut auf echten, produktionsreifen Stacks.",
      items: [
        {
          key: "voice",
          title: "Voice-KI-Agent",
          body: "24/7 Anrufannahme, Routing, Terminbuchung — mit Retell.",
          href: "/products/voice-agent",
          badge: "Retell · Vapi",
        },
        {
          key: "chatbot",
          title: "Website-Chatbot",
          body: "Web, WhatsApp, Telegram gleichzeitig. CRM-synchronisiert.",
          href: "/products/chatbot",
          badge: "Multi-Kanal",
        },
        {
          key: "booking",
          title: "Terminbuchungs-Agent",
          body: "Telefon oder Chat → Kalender. Keine Doppelbuchungen.",
          href: "/products/booking-agent",
          badge: "Cal.com",
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
          "Automatisieren Sie wiederkehrende, regelbasierte Aufgaben in Ihrem Unternehmen mit individuellen Workflows und API-Orchestrierung.",
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
        "Fokus auf den Ersatz manueller, wiederkehrender operativer Arbeit durch zuverlässige automatisierte Systeme.",
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
          title: "Pragmatisch und klar bleiben",
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
        "Unabhängiger Automatisierungsspezialist. Fokussiert auf die Konzeption und Entwicklung praxisnaher Automatisierungssysteme, Workflow-Integrationen und KI-gestützter Prozesse für den Geschäftsbetrieb.",
      expertiseLabel: "",
      expertise: [],
      footnote:
        "Verfügbar für Projekte in ganz Europa und international.",
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
      email: "info@kutasia.com",
      response: "Übliche Antwortzeit: 1–2 Werktage.",
      location:
        "Verfügbar für Projekte in ganz Europa und international.",
    },
  },

  footer: {
    description:
      "Praxisnahe Automatisierungs- und KI-Systeme für den Geschäftsbetrieb.",
    company: "Unternehmen",
    services: "Leistungen",
    products: "Produkte",
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
      "OpSolid ist das Einzelunternehmen von Hasan Dönmez mit Sitz in Arnsberg, Deutschland.",
    sections: {
      according: "Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz, vormals § 5 TMG)",
      representedBy: "Vertreten durch",
      contact: "Kontakt",
      phone: "Telefon: Auf Anfrage",
      register: "Handelsregister",
      registerText:
        "OpSolid ist ein Einzelunternehmen und nicht im Handelsregister eingetragen; für diese Rechtsform ist kein Eintrag erforderlich.",
      vatId: "Umsatzsteuer-ID / Wirtschafts-Identifikationsnummer (W-IdNr)",
      vatIdText:
        "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE462227107",
      responsibleContent:
        "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV (Medienstaatsvertrag, vormals § 55 RStV)",
      disputeResolution: "Online-Streitbeilegung",
      disputeResolutionText:
        "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Unsere E-Mail-Adresse finden Sie oben. Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      liabilityContent: "Haftung für Inhalte",
      liabilityContentText:
        "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.",
      liabilityLinks: "Haftung für Links",
      liabilityLinksText:
        "Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.",
      address: "Vollständige Postanschrift wird nach der Gewerbeanmeldung ergänzt.",
    },
  },

  privacy: {
    title: "Datenschutzerklärung",
    subtitle: "Privacy Policy · Aydınlatma Metni",
    notice:
      "Diese selbst erstellte Datenschutzerklärung umfasst die DSGVO (EU) und KVKK (Türkei) für die OpSolid-Marketing-Site sowie das OpSo Smart-Produkt (Digital Business Card). Eine anwaltlich geprüfte Endfassung ersetzt diesen Hinweis nach der Gewerbeanmeldung. Letzter Stand: Hasan Dönmez.",
    lastUpdated: "Letzte Aktualisierung: Mai 2026",
    sections: [
      {
        title: "1. Datenschutz auf einen Blick",
        content:
          "Im Folgenden erhalten Sie einen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen oder das OpSo Smart-Produkt nutzen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Es gelten parallel die EU-Datenschutz-Grundverordnung (DSGVO) und das türkische Datenschutzgesetz (KVKK, Gesetz Nr. 6698).",
      },
      {
        title: "2. Verantwortliche Stelle / Veri Sorumlusu",
        isResponsible: "true",
      },
      {
        title: "3. Datenerhebung",
        subsections: [
          {
            title: "Kontaktformular",
            content:
              "Über das Kontaktformular übermittelte Daten (Name, geschäftliche E-Mail, Unternehmen, Nachricht, optional Telefon) werden zur Bearbeitung der Anfrage und für Rückfragen gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogenen Anfragen, Art. 6 Abs. 1 lit. f DSGVO bei berechtigtem Interesse oder Art. 6 Abs. 1 lit. a DSGVO bei erteilter Einwilligung. KVKK-Grundlage: Art. 5(2)(c) (Vertragserfüllung) bzw. Art. 5(1) açık rıza.",
          },
          {
            title: "Server-Log-Dateien",
            content:
              "Der Hosting-Anbieter erfasst automatisch Browsertyp, Betriebssystem, Referrer-URL, Hostname, IP-Adresse (wo möglich gekürzt) und Zeitpunkt der Anfrage. Aufbewahrung: 14 Tage zur Sicherheits- und Missbrauchsanalyse, danach Löschung. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Betrieb).",
          },
          {
            title: "Cookie-Einwilligungsprotokoll",
            content:
              "Wenn Sie im Cookie-Banner eine Auswahl treffen (Akzeptieren / Ablehnen), speichern wir die Auswahl mit Zeitstempel im localStorage Ihres Browsers. Wir übertragen für diesen Einwilligungsnachweis nicht Ihre IP. Sie können die Auswahl jederzeit über den Footer-Link ändern oder widerrufen. Rechtsgrundlage: Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung gemäß § 25 TDDDG, Einwilligung zu dokumentieren).",
          },
        ],
      },
      {
        title: "4. Hosting",
        content:
          "Die Marketing-Site, das Backend des OpSo Smart-Produkts und die Postgres-Datenbank laufen gemeinsam auf einem selbst verwalteten Hostinger VPS (Hostinger International Ltd., AS47583), physisch in Vilnius, Litauen (EU). Server-Hostname: srv1150632.hstgr.cloud. Sämtlicher Besucher-Traffic, Karteninhalte, Kundendatensätze und Datenbank-Backups verbleiben auf EU-Gebiet. Der AVV (Art. 28 DSGVO) mit Hostinger liegt vor.",
      },
      {
        title: "5. Cookies & Analyse",
        subsections: [
          {
            title: "Unbedingt erforderlich",
            content:
              "Sprachpräferenz und Cookie-Einwilligungsstatus werden im localStorage des Browsers gespeichert. Diese sind für den Betrieb erforderlich und einwilligungsfrei nach § 25 Abs. 2 TDDDG.",
          },
          {
            title: "Optionale Analyse",
            content:
              "Falls Sie im Cookie-Banner Analyse zustimmen, werden aggregierte, anonyme Seitenaufrufzahlen erfasst. Die Erfassung erfolgt cookieless, ohne personenbezogene Kennungen, und kann einzelne Besucherinnen und Besucher nicht identifizieren. Bei Ablehnung wird kein Analyse-Aufruf ausgelöst und es verlassen keine Daten den Hostinger-Server in Vilnius.",
          },
          {
            title: "Kein Drittanbieter-Tracking, keine Werbung, keine Social-Plugins",
            content:
              "Keine Werbe-Cookies, keine Tracking-Pixel Dritter, keine Social-Network-Plugins, kein Fingerprinting. Schriftarten werden selbst gehostet (kein Google-Fonts-CDN-Aufruf).",
          },
        ],
      },
      {
        title: "6. Auftragsverarbeiter / Sub-Processors",
        content:
          "Wir setzen die folgenden Auftragsverarbeiter ein, um den Dienst zu erbringen. AVV / DPA gemäß Art. 28 DSGVO liegen jeweils vor. Die jeweils aktuelle Liste kann unter info@opsolid.de angefordert werden.",
        subsections: [
          {
            title: "Hosting & Infrastruktur",
            content:
              "Hostinger International Ltd. (Litauen, EU) — ein einziger VPS in Vilnius hostet die Marketing-Site, die OpSo Smart-Anwendung und die Postgres-Datenbank. Kein US-Hosting-Auftragsverarbeiter.",
          },
          {
            title: "E-Mail-Zustellung",
            content:
              "SMTP-Relay für Kontaktformular-Benachrichtigungen. Anbieterdetails auf Anfrage; werden bei Wechsel aktualisiert.",
          },
          {
            title: "Zahlungen (OpSo Smart, geplant)",
            content:
              "Stripe Payments Europe Ltd. (Irland) für Einmal- und Abo-Abrechnung. Kartendaten werden von Stripe tokenisiert; OpSolid sieht keine Klartext-PAN. AVV über das Stripe Services Agreement. Internationale Übermittlung an Stripe US auf Basis DPF + SCC.",
          },
          {
            title: "KI-Anbieter (sofern eingesetzt)",
            content:
              "OpenAI Ireland Ltd. und Anthropic Ireland Ltd. können für Produktivfunktionen über API eingesetzt werden. AVV und SCC liegen vor; Nutzerinhalte werden nicht zum Modelltraining verwendet (API-seitiger Opt-out aktiv).",
          },
        ],
      },
      {
        title: "7. Internationale Datenübermittlung",
        content:
          "Soweit personenbezogene Daten in Länder außerhalb des Europäischen Wirtschaftsraums übermittelt werden (z. B. an Vercel, Stripe, OpenAI, Anthropic in den USA), erfolgt dies (a) auf Grundlage des Angemessenheitsbeschlusses zum EU-US Data Privacy Framework, sofern der Empfänger DPF-zertifiziert ist, oder (b) auf Grundlage der Standardvertragsklauseln (SCC, EU 2021/914) mit dokumentiertem Transfer Impact Assessment. Für betroffene Personen mit Wohnsitz in der Türkei gelten zusätzlich KVKK Art. 9 zur Yurtdışı Aktarım: Übermittlungen erfolgen unter KVKK-Standardvertragsklauseln (Yönetmelik 10.07.2024) und werden, sofern vorgesehen, dem Kurum innerhalb von 5 Werktagen gemeldet.",
      },
      {
        title: "8. OpSo Smart Digital Business Card Produkt",
        subsections: [
          {
            title: "Zweck & Rechtsgrundlage",
            content:
              "Wir verarbeiten die Daten, die Sie über das OpSo Smart-Lead-Formular oder den Self-Service-Bestellfluss übermitteln (Name, geschäftliche E-Mail, Unternehmen, Position, Telefon (optional), Nachricht, Foto/Logo-Upload, Markenfarben, Social-Links), zur Erbringung des Dienstes. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. a DSGVO (Ihre ausdrückliche Einwilligung in die öffentliche Veröffentlichung).",
          },
          {
            title: "Öffentliche Veröffentlichung Ihrer Karte",
            content:
              "Wenn Sie eine OpSo Smart-Karte unter /c/{slug} veröffentlichen, werden die eingetragenen Informationen öffentlich im Internet zugänglich. Hierfür ist Ihre ausdrückliche, separate Opt-in-Auswahl im Veröffentlichungs-Schritt erforderlich. Sie können die Karte jederzeit aus Ihrem Konto entveröffentlichen oder löschen; wir setzen anschließend einen noindex-Header und veranlassen die URL-Entfernung bei den großen Suchmaschinen.",
          },
          {
            title: "Drittinhalte",
            content:
              "Sie sind allein dafür verantwortlich, sämtliche Rechte an hochgeladenen Fotos, Logos und sonstigen Inhalten zu besitzen. Mit dem Upload bestätigen Sie das Vorliegen dieser Rechte. Notice-and-Takedown-Anfragen können an info@opsolid.de gerichtet werden; Antwortzeit innerhalb von 7 Tagen.",
          },
          {
            title: "Hosting",
            content:
              "Karten- und Kundendaten werden auf dem Hostinger VPS (Litauen, EU) gespeichert. Keine US-Subauftragsverarbeiter für OpSo Smart-Karteninhalte selbst; Zahlungsdaten werden von Stripe gemäß den oben genannten Sub-Processor-Bedingungen verarbeitet.",
          },
          {
            title: "14-tägiges Widerrufsrecht (B2C)",
            content:
              "Wenn Sie OpSo Smart als Verbraucherin oder Verbraucher (B2C, EU/EWR) bestellen, haben Sie ein 14-tägiges Widerrufsrecht nach § 355 BGB. Damit der digitale Dienst vor Ablauf der 14 Tage beginnen kann, müssen Sie ausdrücklich die sofortige Ausführung verlangen und bestätigen, dass das Widerrufsrecht mit vollständiger Vertragserfüllung erlischt — beides über separate Checkboxen im Checkout. Wir protokollieren Ihre Bestätigungen zu Beweiszwecken. Ab dem 19. Juni 2026 steht ein One-Click-Widerrufsbutton zur Verfügung.",
          },
          {
            title: "Aufbewahrung",
            content:
              "Aktive OpSo Smart-Karten: Aufbewahrung während laufendem Abo. Gekündigt / inaktiv: Löschung 90 Tage nach Abo-Ende (Erinnerungsmail an Tag 60). Lead-Formular-Übermittlungen (ohne Kauf): 24 Monate. Rechnungen: 10 Jahre Aufbewahrung gemäß § 257 HGB / Vergi Usul Kanunu (gesetzliche Pflicht).",
          },
          {
            title: "Recht auf Löschung",
            content:
              "Sie können Ihre OpSo Smart-Karte und alle zugehörigen personenbezogenen Daten mit einem Klick aus Ihrem Konto oder per E-Mail an info@opsolid.de löschen. Die Löschung wird innerhalb von 30 Tagen wirksam. Vor destruktiven Aktionen ist eine Identitätsprüfung (E-Mail-Bestätigung + 2FA, sofern aktiviert) erforderlich.",
          },
        ],
      },
      {
        title: "9. Ihre Rechte (DSGVO)",
        content:
          "Nach Art. 15–22 DSGVO haben Sie das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und auf Widerspruch gegen die Verarbeitung (Art. 21). Eine erteilte Einwilligung können Sie jederzeit ohne Auswirkung auf bisherige Verarbeitungen widerrufen. Zur Ausübung Ihrer Rechte: info@opsolid.de — wir antworten innerhalb eines Monats (Art. 12 Abs. 3). Sie können sich auch bei der Aufsichtsbehörde Ihres gewöhnlichen Aufenthaltsorts oder des Orts der mutmaßlichen Verletzung beschweren.",
      },
      {
        title: "10. Ihre Rechte (KVKK Madde 11) — für betroffene Personen mit Wohnsitz in der Türkei",
        content:
          "Gemäß § 11 des türkischen KVKK (Gesetz Nr. 6698): Auskunft über die Verarbeitung, Auskunft über Verarbeitungszweck und zweckgemäße Nutzung, Information über Empfänger im In- und Ausland, Berichtigung unvollständiger oder unrichtiger Daten, Löschung oder Vernichtung gemäß § 7 KVKK, Mitteilung von Berichtigungen/Löschungen an Empfänger, Widerspruch gegen ausschließlich automatisierte Entscheidungen und Schadensersatz bei rechtswidriger Verarbeitung. Anfragen: info@opsolid.de. Gemäß KVKK-Grundsatzentscheidung 2026/347 sind die Aydınlatma Metni (diese Seite) und die açık rıza-Erklärung getrennte Dokumente; eine Einwilligung wird im Produktfluss gesondert eingeholt.",
      },
      {
        title: "11. Datenpannenmeldung",
        content:
          "Falls eine Verletzung des Schutzes personenbezogener Daten voraussichtlich ein Risiko für Ihre Rechte und Freiheiten zur Folge hat, melden wir dies der zuständigen Aufsichtsbehörde innerhalb von 72 Stunden nach Bekanntwerden (Art. 33 DSGVO). Bei hohem Risiko benachrichtigen wir die betroffenen Personen unverzüglich (Art. 34 DSGVO). Nach KVKK informieren wir zusätzlich den Kurum und die betroffenen Personen in der kürzest möglichen Zeit (KVKK-Kurul-Beschlüsse).",
      },
      {
        title: "12. Änderungen dieser Erklärung",
        content:
          "Wir können diese Erklärung anpassen, um Änderungen der Rechtslage oder unserer Verarbeitung Rechnung zu tragen. Wesentliche Änderungen werden auf dieser Seite und, sofern Sie ein Konto besitzen, mindestens 30 Tage im Voraus per E-Mail angekündigt.",
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
        slug: "workflow-automation-fundamentals",
        title: "Workflow-Automatisierung: Was in der Praxis wirklich zählt",
        excerpt:
          "Ein nüchterner Blick darauf, was eine Workflow-Automatisierung im Produktivbetrieb trägt — Fehlerbehandlung, Datenhoheit, Observability und Ausstiegskosten, unabhängig von der gewählten Engine.",
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
        slug: "choosing-the-right-automation-architecture",
        title:
          "Die richtige Automatisierungsarchitektur für Ihr Unternehmen wählen",
        excerpt:
          "Wie man zwischen Point-to-Point-Integrationen, individuellen Orchestrierungsschichten und hybriden Modellen entscheidet — anhand von Volumen, Compliance und Teamgröße, nicht Vendor-Pitch.",
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
          "Jedes Projekt wird als individuelles System ausgeliefert, gebaut aus produktionsreifen Engineering-Schichten — REST APIs, Message Queues, Postgres und Webhooks als Kern, ergänzt durch KI-Primitive, wo sie sich auszahlen. Die Architektur wird pro Anwendungsfall gewählt, nicht nach einem One-size-fits-all-Werkzeugkasten.",
        category: "technical",
      },
      {
        question: "Warum individuelle Entwicklung statt einer SaaS-Plattform?",
        answer:
          "Individuell entwickelte Systeme geben Ihnen volle Kontrolle über Ihre Daten, Ihre Workflows und die Kostenkurve. Keine Gebühren pro Ausführung, keine intransparenten Preisstufen, keine Abhängigkeit vom Anbieter. Die Architektur wird passgenau für Ihre Prozesse entworfen — und der Quellcode gehört Ihnen.",
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

  products: {
    hero: {
      label: "Unsere Produkte",
      headline: "Eigenentwickelte Software-Produkte",
      description:
        "Neben individuellen Projekten entwickelt und betreibt OpSolid eigene Software-Produkte — ausgereifte, produktionsreife Systeme auf derselben Automatisierungs- und KI-Grundlage.",
    },
    comingSoonLabel: "Weitere in Entwicklung",
    comingSoonTitle: "Weitere Produkte folgen",
    comingSoonDescription:
      "Das Produktportfolio von OpSolid wächst. Neue Tools für Operations, Kommunikation und KI-gestützte Workflows befinden sich derzeit in Entwicklung.",
    categories: {
      all: "Alle",
      customerFacing: "Kundenkontakt",
      internalOps: "Interne Prozesse",
      communication: "Kommunikation",
    },
    templatesStrip: {
      label: "BRANCHEN-VORLAGEN",
      heading: "10 Vorlagen, bereit zum Anpassen",
      paragraph:
        "Wählen Sie Ihre Branche, passen Sie an, gehen Sie live. Immobilien, Klinik, Restaurant, DJ, Barber, E-Commerce, Architekt, Fitness und mehr.",
      cta: "Eigene Vorlage anpassen",
      ctaHref: "/products/digital-card",
    },
    techStack: {
      label: "AUF ECHTER INFRASTRUKTUR",
      heading: "Keine Magie. Echte, produktionsreife Technik.",
      items: [
        "Retell AI",
        "Vapi",
        "Cal.com",
        "Custom Workflows",
        "Supabase",
        "Meta Business",
        "HubSpot",
        "Stripe",
      ],
    },
    items: [
      {
        name: "Digitale Visitenkarte",
        tagline: "Link · QR-Code · optionales NFC",
        description:
          "Eine in Deutschland gehostete digitale Visitenkarte. Teilen Sie Ihr Profil per Link, QR-Code oder optionaler NFC-Karte. Branchenvorlagen für Immobilien, Salons, Kliniken, Restaurants, Fotografen und mehr — alle DSGVO-nativ.",
        status: "Live",
        href: "/products/digital-card",
        externalUrl: "",
        icon: "idCard",
        startingPrice: "€39 einmalig · kostenlose Stufe verfügbar",
        category: "Kundenkontakt",
        stack: "Next.js · Hetzner · Apple Wallet · HubSpot",
      },
      {
        name: "Voice-KI-Agent",
        tagline: "24/7 Telefonempfang · Retell · Vapi",
        description:
          "Ein KI-Voice-Agent, der Ihre Telefonleitung rund um die Uhr entgegennimmt, Termine bucht und Anrufe weiterleitet. Mehrsprachig (DE/EN/TR). Gebaut auf Retell AI oder Vapi mit Kalender-Sync. Ersetzt €3.000/Monat Empfangsarbeit.",
        status: "Live",
        href: "/products/voice-agent",
        externalUrl: "",
        icon: "phone",
        startingPrice: "Ab €1.200 Einrichtung + €0,12/Min.",
        category: "Kommunikation",
        stack: "Retell AI · Vapi · Cal.com · Supabase",
      },
      {
        name: "Website-Chatbot",
        tagline: "Multi-Kanal · Web · WhatsApp · Telegram",
        description:
          "Ein Chatbot, der gleichzeitig auf Ihrer Website, WhatsApp und Telegram lebt. Qualifiziert Leads, beantwortet FAQs, synchronisiert ins CRM. Kontextbewusste Mehrfach-Dialoge, keine starren Skriptwände.",
        status: "Live",
        href: "/products/chatbot",
        externalUrl: "",
        icon: "messageCircle",
        startingPrice: "Ab €1.800 Einrichtung + €99/Monat",
        category: "Kundenkontakt",
        stack: "OpenAI · Custom Workflows · Supabase · HubSpot",
      },
      {
        name: "WhatsApp-Business-Agent",
        tagline: "Offizielle Meta-API · Auftragsstatus · Zahlungen",
        description:
          "WhatsApp-Automatisierung über die offizielle Meta Business Cloud API (via verifiziertem BSP — Twilio, 360dialog, AiSensy). Auftragsstatus, Support, Qualifizierung, Zahlungs-Trigger. Kein Graumarkt-Scraping, kein Sperrrisiko.",
        status: "Live",
        href: "/products/whatsapp-agent",
        externalUrl: "",
        icon: "messagesSquare",
        startingPrice: "Ab €1.500 Einrichtung + Meta-Gebühren",
        category: "Kommunikation",
        stack: "Meta Business Cloud · 360dialog · Twilio · Stripe",
      },
      {
        name: "Terminbuchungs-Agent",
        tagline: "Cal.com + Voice + Chat",
        description:
          "Ein Buchungs-Agent, der Terminplanung per Telefon, Chat oder Formular übernimmt. Zwei-Wege-Sync mit Google Kalender/Outlook/Cal.com. Umbuchungen, Erinnerungen und No-Show-Nachfassen inklusive.",
        status: "Live",
        href: "/products/booking-agent",
        externalUrl: "",
        icon: "calendarClock",
        startingPrice: "Ab €800 Einrichtung + €49/Monat",
        category: "Interne Prozesse",
        stack: "Cal.com · Retell · Custom Workflows · Google Calendar",
      },
      {
        name: "E-Mail-Automatisierungs-Agent",
        tagline: "Outreach · Triage · Antwortentwürfe",
        description:
          "KI-E-Mail-Workflows — Cold Outreach mit personalisierten Varianten, Inbox-Triage, Auto-Entwürfe zur Freigabe. Gebaut auf Instantly, AgentMail und individuellen Orchestrierungs-Flows. Zustellbarkeit aufgewärmt, DSGVO-konform.",
        status: "Live",
        href: "/products/email-agent",
        externalUrl: "",
        icon: "mail",
        startingPrice: "Ab €99 – €499/Monat",
        category: "Kommunikation",
        stack: "Instantly · AgentMail · Custom Workflows · OpenAI",
      },
      {
        name: "Lead-Qualifizierungs-Agent",
        tagline: "Voice + Chat · CRM-Scoring · HubSpot-Sync",
        description:
          "Ein Gesprächs-Agent, der eingehende Leads per Voice oder Chat qualifiziert, bewertet und qualifizierte Leads an HubSpot/Pipedrive/Salesforce weiterleitet. 40 % MQL-zu-SQL-Steigerung realistisch.",
        status: "Live",
        href: "/products/lead-qualifier",
        externalUrl: "",
        icon: "userCheck",
        startingPrice: "Ab €2.200 Einrichtung + €199/Monat",
        category: "Kundenkontakt",
        stack: "Retell · HubSpot · Custom Workflows · Supabase",
      },
      {
        name: "Digitale Rezeption",
        tagline: "KI-Empfang · Micro-SaaS",
        description:
          "Ein eigenständiger KI-Empfang für Hotels, Kliniken, Salons und Service-Betriebe. Webformulare, E-Mail-Intake, optionaler Voice-Agent — ohne Instagram- oder WhatsApp-Business-Verifizierung.",
        status: "Live",
        href: "/products/digital-reception",
        externalUrl: "",
        icon: "bell",
        startingPrice: "Ab €29/Monat",
        category: "Interne Prozesse",
        stack: "Retell · Cal.com · Postmark · Supabase",
      },
      {
        name: "Kutasia",
        tagline: "Multi-Branchen-Kundenplattform",
        description:
          "Die volle Plattform — eine mandantenfähige SaaS, die Kundenkommunikation, Anfragen, Buchungen und Inhalte über Kanäle hinweg vereint. Branchenspezifische Workflows und KI-gestützte Analyse. Einzelne Module sind auch als eigenständige Produkte erhältlich.",
        status: "Live",
        href: "/products/kutasia",
        externalUrl: "https://kutasia.com",
        icon: "sparkles",
        startingPrice: "Individuelle Preise · pro Mandant",
        category: "Interne Prozesse",
        stack: "Next.js · Postgres · OpenAI · Stripe",
      },
    ],

    digitalCard: {
      hero: {
        eyebrow: "[ OPSO SMART ]   IHRE DIGITALE VISITENKARTE",
        title: [
          "OpSo Smart.",
          "Erstellen Sie Ihre digitale Visitenkarte selbst -",
          "kostenlos, in Sekunden live.",
        ],
        paragraph:
          "Vorlage wählen, Daten eintragen, veröffentlichen. Ihre Karte geht in Sekunden live unter opsolid.de/c/ihr-name, kostenlos zum Start. Upgrade, wenn Sie eigene Domain, NFC oder Analysen brauchen. EU-Hosting in Frankfurt, DSGVO-nativ, keine Abo-Fallen.",
        primaryCta: "Kostenlose Karte erstellen",
        secondaryCta: "20 Live-Vorlagen ansehen",
        tags: "OPSO SMART · LINK · QR-CODE · vCARD · EU-HOSTING · KOSTENLOS STARTEN",
        cardLabels: {
          name: "Alex Weber",
          role: "Produktdesigner",
          company: "Studio Nord",
          nfc: "QR",
          chip: "QR-CODE SCANNEN",
        },
      },
      features: {
        label: "WAS SIE BEKOMMEN",
        heading: "Ein Profil, drei Teilmodi, zwanzig Ausgangspunkte.",
        intro:
          "Wir gestalten Ihr Profil passend zu Ihrer Branche. Sie teilen es so, wie es gerade passt.",
        items: [
          {
            label: "LINK · 01",
            title: "Teilbarer Link",
            desc: "Eine saubere URL auf opsolid.de/c/ihr-name (oder Ihre eigene Domain in Custom). In E-Mail-Signaturen, WhatsApp-Bios, Instagram einsetzen. Keine App-Installation beim Empfänger.",
            icon: "link",
          },
          {
            label: "QR · 02",
            title: "QR-Code herunterladen",
            desc: "PNG- und SVG-Dateien zum Drucken, Einbetten oder Teilen. Auf Fensteraufklebern, Speisekarten, Messebannern oder als Zoom-Hintergrund.",
            icon: "qr",
          },
          {
            label: "VORLAGEN · 03",
            title: "20 Branchenvorlagen",
            desc: "Immobilien, Klinik, Restaurant, DJ, Barbier, Fotograf, Architekt, Fitness und mehr. Live-Vorschauen vor Projektstart durchstöbern.",
            icon: "templates",
          },
          {
            label: "DESIGN · 04",
            title: "Selbst gestalten",
            desc: "Live-Vorschau beim Tippen. Layout und Theme wählen, Ihre Farben und Fotos einsetzen, sofort veröffentlichen. Lieber fertig geliefert? White-Glove ist eine Stufe höher.",
            icon: "layout",
          },
          {
            label: "SIGNATUR · 05",
            title: "E-Mail-Signatur bereit",
            desc: "Fertigen Snippet in Gmail oder Outlook einfügen. Ihre Karte reist mit jeder E-Mail, die Sie versenden.",
            icon: "wallet",
          },
          {
            label: "HOSTING · 06",
            title: "EU-Hosting (Frankfurt)",
            desc: "Hetzner / IONOS Frankfurt. DSGVO-nativ. Keine US-Subunternehmer. Ein-Klick-Löschung, immer.",
            icon: "hosting",
          },
        ],
      },
      compliance: {
        label: "DATENHOHEIT",
        heading: "Wo leben die Daten Ihrer Karte?",
        intro:
          "Die meisten Mitbewerber hosten in den USA. Wir nicht. Wenn jemand Ihre Karte scannt, bleiben die Daten in Deutschland.",
        cols: [
          "Anbieter",
          "Hosting-Region",
          "Subunternehmer",
          "DSGVO-AVV",
          "Ein-Klick-Löschung",
        ],
        rows: [
          {
            provider: "Popl",
            host: "USA",
            sub: "USA (AWS, Heroku)",
            dpa: "über SCC",
            del: "Teilweise",
            highlight: "",
          },
          {
            provider: "Blinq",
            host: "AU",
            sub: "USA (AWS Sydney)",
            dpa: "über SCC",
            del: "Teilweise",
            highlight: "",
          },
          {
            provider: "Lemontaps",
            host: "DE (Frankfurt)",
            sub: "Begrenzt",
            dpa: "Ja",
            del: "Ja",
            highlight: "",
          },
          {
            provider: "OpSolid Digitale Visitenkarte",
            host: "DE (Frankfurt)",
            sub: "Keine US-Subunternehmer",
            dpa: "Nativ",
            del: "Ja",
            highlight: "true",
          },
        ],
      },
      pricing: {
        label: "PREISE",
        heading: "Drei flexible Stufen. Keine Abo-Fallen.",
        popularBadge: "BELIEBT",
        plans: [
          {
            name: "Free",
            price: "€0",
            cadence: "Selbst erstellen, in Sekunden live.",
            popular: "",
            bullets: [
              "Alle Vorlagen, Layouts und Themes",
              "Link + QR-Code (PNG + SVG)",
              "In Kontakte speichern (vCard)",
              "Gehostet auf opsolid.de/c/ihr-name",
              "Kleiner „Made with OpSo Smart“-Badge",
              "Kein Login nötig",
            ],
            cta: "Kostenlose Karte erstellen",
            href: "#lead",
          },
          {
            name: "Premium",
            price: "€149",
            cadence: "einmalig · €9/Jahr Hosting ab Jahr 2",
            popular: "true",
            bullets: [
              "Alles aus Free, Badge entfernt",
              "Eigener Slug oder eigene Domain",
              "NFC-Option",
              "Analysen (Aufrufe + Klicks)",
              "Video-Block + Lead-Erfassung / CRM",
              "Mehrere Karten",
            ],
            cta: "Auf Premium wechseln",
            href: "#lead",
          },
          {
            name: "White-Glove",
            price: "Ab €299",
            cadence: "auf Anfrage · wir gestalten für Sie",
            popular: "",
            bullets: [
              "Wir gestalten Ihre Karte in 48 Std. von Hand",
              "Unbegrenzte Überarbeitungen",
              "Mehrsprachig (DE/EN/TR)",
              "Team-Rollout",
              "Alles aus Premium",
              "Priorisierter Support",
            ],
            cta: "White-Glove anfragen",
            href: "#lead",
          },
        ],
      },
      lead: {
        label: "ANFRAGE",
        heading: "Erzählen Sie uns von Ihrer Karte.",
        intro:
          "Teilen Sie Ihre Branche, Basisdaten und die gewünschte Vorlage mit. Wir antworten innerhalb eines Werktages mit einem Vorschau-Link.",
        fields: {
          name: "Vollständiger Name",
          email: "Geschäfts-E-Mail",
          company: "Unternehmen (optional)",
          teamSize: "Wie viele Karten?",
          teamSizeOptions: ["1", "2 – 5", "6 – 20", "20+"],
          message:
            "Noch etwas, das wir wissen sollten? (Branche, Link-Wünsche usw.)",
          consent:
            "Ich willige in die Verarbeitung dieser Daten durch OpSolid zur Bearbeitung meiner Anfrage ein. Siehe Datenschutzerklärung.",
          privacyLink: "Datenschutzerklärung",
          submit: "Anfrage senden",
          submitting: "Wird gesendet…",
          success:
            "Danke - Antwort innerhalb eines Werktages mit Vorschau-Link.",
          error:
            "Etwas ist schiefgegangen. Bitte direkt an info@opsolid.de schreiben.",
        },
      },
      testimonials: {
        label: "SOZIALE BEWÄHRUNG",
        heading: "Was Kunden nach ihrer ersten Karte sagen.",
        items: [
          {
            quote:
              "Ich habe meine Karte in zehn Minuten erstellt. Vorlage gewählt, Daten eingetippt, veröffentlicht - und der Link war live. Kein Hin und Her, kein Warten.",
            name: "Lena Richter",
            role: "Selbstständige Maklerin",
            company: "Berlin, DE",
          },
          {
            quote:
              "Dass die Daten in der EU bleiben, hat unser Legal-Team überzeugt. Allein das war das Upgrade wert.",
            name: "Marco Weber",
            role: "COO",
            company: "Industrieunternehmen aus München",
          },
          {
            quote:
              "Kein Monatsabo. Kein „Enterprise-Stufe“-Upsell. Kostenlos gestartet, einmal für die eigene Domain bezahlt, weitergemacht. Genau das wollte ich.",
            name: "Sarah Klein",
            role: "Selbstständige Beraterin",
            company: "Berlin, DE",
          },
        ],
      },
      howItWorks: {
        label: "SO FUNKTIONIERT ES",
        heading: "Vier Schritte. In Sekunden live.",
        steps: [
          {
            title: "01 · Vorlage wählen",
            description:
              "Stöbern Sie durch 20 Branchenvorlagen und wählen Sie die passende. Layout und Theme dazu auswählen.",
          },
          {
            title: "02 · Daten eintragen",
            description:
              "Name, Rolle, Links, Fotos und Farben ergänzen. Eine Live-Vorschau aktualisiert sich beim Tippen.",
          },
          {
            title: "03 · In Sekunden veröffentlichen",
            description:
              "Veröffentlichen und Ihre Karte ist live unter opsolid.de/c/ihr-name. Kein Login, kein Warten.",
          },
          {
            title: "04 · Link teilen",
            description:
              "Link und QR-Code überall teilen: E-Mail-Signaturen, WhatsApp, Instagram, Druckmaterial.",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Fragen, direkt beantwortet.",
        items: [
          {
            question: "Wie schnell bekomme ich meine Karte?",
            answer:
              "Sofort: selbst erstellen und in Sekunden veröffentlichen. Lieber von uns gestaltet? Wählen Sie White-Glove (48 Std.).",
          },
          {
            question: "Versenden Sie eine physische NFC-Karte?",
            answer:
              "Verfügbar mit Premium. Die kostenlose Karte funktioniert als Link + QR: Der Kunde scannt Ihren QR-Code oder öffnet Ihren Link und sieht Ihr Profil, ohne Hardware. NFC ist eine Option nach dem Upgrade.",
          },
          {
            question: "Kann ich meine Karte später selbst bearbeiten?",
            answer:
              "Ja, jederzeit - Sie besitzen einen Bearbeitungslink. Öffnen, ändern, in Sekunden erneut veröffentlichen. Keine Anfrage, kein Warten.",
          },
          {
            question: "Wo werden meine Daten gespeichert?",
            answer:
              "EU-Hosting (Frankfurt) - Hetzner / IONOS. Keine US-Subunternehmer. Ein AV-Vertrag liegt auf Anfrage bereit.",
          },
          {
            question: "Kann ich meine Karte kündigen oder löschen?",
            answer:
              "Ja, jederzeit. Ein-Klick-Löschung. Keine Auto-Verlängerungsfallen. Hosting wird ab Jahr 2 jährlich im Voraus bezahlt.",
          },
          {
            question: "Ich brauche 10+ Karten für mein Team. Wie?",
            answer:
              "Premium unterstützt mehrere Karten. Für größere Rollouts wählen Sie White-Glove, dann übernehmen wir das Team-Setup. Schreiben Sie an info@opsolid.de.",
          },
        ],
      },
      cta: {
        eyebrow: "BEREIT?",
        heading: "Ihre Karte. In Sekunden live.",
        primaryCta: "Kostenlose Karte erstellen",
        secondaryCta: "Vorlagen ansehen",
      },
      preview: {
        meta: {
          title: "Digitale Visitenkarte — Live-Vorschau",
          description:
            "Erstellen Sie Ihre digitale Visitenkarte selbst. Live-Vorschau auf dem Handy, zwischen Vorlagen wischen und kostenlos in Sekunden veröffentlichen.",
        },
        eyebrow: "LIVE-VORSCHAU",
        title: "Karte erstellen, live vorschauen",
        subtitle:
          "Zwischen Vorlagen wischen. Live-Vorschau. Kostenlos in Sekunden veröffentlichen.",
        hintSwipe: "Wischen",
        hintArrows: "Mit den Pfeiltasten durch die Designs blättern",
        prev: "Vorheriges Design",
        next: "Nächstes Design",
        orderCta: "Dieses Design bestellen",
        secondaryCta: "Alle Designs ansehen",
        counter: "{{current}} / {{total}}",
        priceYearly: "/Jahr",
        priceMonthly: "/Monat",
        priceOneTime: "einmalig",
      },
      order: {
        gallery: {
          title: "Wählen Sie ein Design",
          subtitle:
            "Jedes Design ist nummeriert. Wenn Sie anrufen, nennen Sie einfach die Nummer.",
          selectCta: "Dieses Design wählen",
          selected: "Ausgewählt",
          fromPrice: "ab",
          demoCta: "Demo",
          demoModalChoose: "Diese Vorlage wählen",
          demoModalBack: "Zurück zur Galerie",
          comingSoon: "Bald verfügbar",
          comingSoonHint: "Diese Vorlage ist in Vorbereitung.",
          prevSlide: "Vorheriges Design",
          nextSlide: "Nächstes Design",
          slideOf: "{{current}} von {{total}}",
          sectorAll: "Alle",
          sectorRealEstate: "Immobilien",
          sectorLawyer: "Kanzlei",
          sectorRestaurant: "Restaurant",
          sectorCreator: "Kreativ",
          sectorClinic: "Klinik",
          sectorMusic: "Musik",
          sectorSalon: "Salon",
          sectorRetail: "Boutique",
          sectorArchitecture: "Architektur",
          sectorFitness: "Fitness",
          sectorHospitality: "Hotel",
          sectorConsultant: "Beratung",
          sectorTech: "Tech",
          sectorEvents: "Events",
          sectorDentist: "Zahnarzt",
          sectorPsychologist: "Therapeut",
          sectorBeauty: "Beauty",
          sectorAccounting: "Buchhaltung",
          sectorSoftware: "Software & IT",
          sectorContentCreator: "Content Creator",
          sectorWellness: "Wellness",
          sectorEventPlanner: "Event Planner",
          sectorAuto: "Autohändler",
          sectorInterior: "Interior Design",
          monthlyShort: "/Mo.",
        },
        form: {
          eyebrow: "BESTELLUNG",
          title: "Ihre Daten, Ihr Design, Ihre Karte.",
          subtitle:
            "Füllen Sie das Formular aus — die Karte wird direkt nach der Zahlung unter opsolid.de/c/… veröffentlicht.",
          howToCreate:
            "Jeder kann eine Karte erstellen — ganz ohne Konto. Design wählen, Formular ausfüllen, in wenigen Minuten live. Sie erhalten einen privaten Link zum jederzeitigen Bearbeiten.",
          eventJoinLabel:
            "Meine Karte im Teilnehmerverzeichnis anzeigen, damit andere Teilnehmer mich finden.",
          draftRestored:
            "Ihr letzter Entwurf wurde wiederhergestellt — machen Sie dort weiter, wo Sie aufgehört haben.",
          draftDiscard: "Neu beginnen",
          selectedTemplate: "Gewähltes Design",
          changeTemplate: "Ändern",
          contactSection: "Kontakt — so erreichen wir Sie",
          contactName: "Ihr Name",
          contactEmail: "E-Mail",
          contactPhone: "Telefon",
          callMeBack: "Rufen Sie mich an",
          callMeBackHint:
            "Wir melden uns innerhalb eines Werktags, um Details zu klären.",
          cardSection: "Inhalt Ihrer Karte",
          sampleHint: "Beispielinhalt zum Ausprobieren — mit Ihren eigenen Daten überschreiben.",
          clearSample: "Leeren",
          cardLanguageLabel: "Kartensprache",
          cardLanguageHint:
            "Die Sprache, die Besucher Ihrer Karte sehen. Später im Editor änderbar.",
          statsSection: "Kennzahlen",
          statsHint:
            "Echte Zahlen, die viele Designs als Kennzahlen-Leiste zeigen (z. B. 12 — Jahre).",
          statsEmpty:
            "Noch keine Kennzahlen. Fügen Sie echte Zahlen hinzu (z. B. 12 — Jahre Erfahrung). Ohne Kennzahlen zeigt die Karte diesen Bereich einfach nicht.",
          statsValue: "12+",
          statsLabel: "Jahre Erfahrung",
          statsAdd: "Kennzahl hinzufügen",
          statsRemove: "Entfernen",
          taglineLabel: "Slogan",
          taglinePlaceholder: "Eine kurze Aussage (optional)",
          taglineHint:
            "Erscheint bei manchen Designs unter Ihrem Namen. Leer = Ihre Rolle/Ihr Titel wird verwendet.",
          locationLabel: "Standort auf der Karte",
          locationAuto: "Aus Adresse",
          locationCustom: "Eigener Text",
          locationHidden: "Ausblenden",
          locationAutoHint: "Aus Ihrer Adresse abgeleitet:",
          locationAutoEmpty:
            "Noch keine Adresse — es wird kein Standort angezeigt, bis Sie eine hinzufügen.",
          locationPlaceholder: "Remote · Berlin",
          locationHiddenHint: "Auf Ihrer Karte erscheint kein Standort-Chip.",
          copyFromContact: "Von oben übernehmen",
          cardName: "Vor- und Nachname",
          cardTitle: "Titel / Rolle",
          cardCompany: "Unternehmen",
          cardWebsite: "Website",
          cardEmail: "E-Mail (auf Karte)",
          cardPhone: "Telefon (auf Karte)",
          cardWhatsapp: "WhatsApp",
          cardAddress: "Adresse",
          cardBio: "Kurzbeschreibung",
          cardBioPh: "Ein Satz zu Ihnen / Ihrem Unternehmen.",
          socialSection: "Social Links (optional)",
          uploadSection: "Foto & Logo (optional)",
          photoLabel: "Profilfoto",
          logoLabel: "Logo",
          uploadTooLarge: "Datei zu groß (max 2 MB).",
          uploadFailed: "Upload fehlgeschlagen.",
          brandSection: "Markenfarben (optional)",
          primaryColor: "Primärfarbe",
          accentColor: "Akzentfarbe",
          designNotes: "Besondere Wünsche (optional)",
          designNotesPh:
            "Schriftart, Logo-Anpassungen, Layout-Wünsche — wir lesen jeden Auftrag vor Veröffentlichung durch.",
          resetColors: "Vorlagenfarben wiederherstellen",
          uploadWrongType: "Format nicht unterstützt. Bitte JPG, PNG oder WebP.",
          dragHere: "Hierher ziehen oder klicken",
          uploadHint: "JPG, PNG, WebP · max 5 MB",
          uploadRemove: "Entfernen",
          submitLabel: "Bezahlen & Karte veröffentlichen",
          selectionModeLabel: "Design auswählen",
          templateColors: "Vorlagenfarben",
          uploadDone: "Hochgeladen",
          uploading: "Wird hochgeladen…",
          templateNoPhoto: "Dieses Design verwendet kein Foto.",
          templateNoLogo: "Dieses Design verwendet kein Logo.",
          templateNoAsset: "Dieses Design verwendet dieses Element nicht.",
          previewExpand: "Vollvorschau öffnen",
          previewClose: "Vorschau schließen",
          previewOpenInNewTab: "In neuem Tab öffnen",
          previewLanguage: "Kartensprache",
          previewNoPaymentNote: "Nur Vorschau — keine Zahlung nötig",
          // Phase 7.9
          editPosition: "Position bearbeiten",
          photoEditorTitle: "Profilfoto-Position",
          photoEditorSubtitle: "Ziehen zum Verschieben, schieben zum Zoomen.",
          logoEditorTitle: "Logo-Position",
          logoEditorSubtitle:
            "Platzieren Sie das Logo genau dort, wo Sie es haben möchten.",
          photoEditorZoom: "Zoom",
          photoEditorReset: "Zurücksetzen",
          photoEditorSave: "Speichern",
          photoEditorCancel: "Abbrechen",
          photoEditorHint: "Der Ring zeigt das sichtbare Zentrum des Bildes.",
          shareLink: "Vorschau-Link",
          shareLinkTitle: "Vorschau-Link teilen",
          shareLinkSubtitle:
            "Senden Sie Ihre Karte vor dem Bezahlen. Jeder mit dem Link kann sie lesen.",
          shareLinkUrl: "Link",
          shareLinkCopy: "Kopieren",
          shareLinkCopied: "Kopiert ✓",
          shareLinkOpen: "In neuem Tab öffnen",
          shareLinkNote:
            "Der Link enthält alle Formulardaten; die Karte wird erst nach Zahlung veröffentlicht.",
          videoSection: "Video (optional)",
          videoHint:
            "YouTube- oder Vimeo-Link einfügen — er läuft direkt auf Ihrer Karte.",
          videoLabel: "Video-Link",
          videoPlaceholder: "https://youtube.com/watch?v=…",
          videoInvalid: "Nur YouTube- oder Vimeo-Links werden unterstützt.",
          customSectionsSection: "Eigene Abschnitte (optional)",
          customSectionsHint:
            "Bis zu 6 Abschnitte — Auszeichnungen, Sprachen, alles was Sie wollen.",
          customSectionAdd: "Abschnitt hinzufügen",
          customSectionTitle: "Titel",
          customSectionTitlePh: "z.B. Sprachen, Auszeichnungen, Presse",
          customSectionBody: "Inhalt",
          customSectionBodyPh:
            "Fließtext — sichtbar für jeden, der Ihre Karte öffnet.",
          customSectionRemove: "Entfernen",
          customSectionsCount: "{n} von 6",
          customSectionAddImage: "Bild hinzufügen (optional)",
          // FAQ editor
          faqSection: "FAQ (optional)",
          faqHint:
            "Bis zu 12 häufig gestellte Fragen — erscheinen als Akkordeon auf Ihrer Karte.",
          faqQuestion: "Frage",
          faqAnswer: "Antwort",
          faqAdd: "Frage hinzufügen",
          faqRemove: "Entfernen",
          faqEmpty:
            "Noch keine FAQ-Einträge. Fügen Sie eine Frage hinzu.",
          // Testimonials editor
          testimonialsSection: "Kundenstimmen (optional)",
          testimonialsHint:
            "Bis zu 8 Kundenzitate — werden auf allen Vorlagen angezeigt, die keine eigenen Stimmen enthalten.",
          testimonialAuthor: "Name (z. B. Maria K.)",
          testimonialRole: "Position / Unternehmen (optional)",
          testimonialQuote: "Zitat",
          testimonialAdd: "Kundenstimme hinzufügen",
          testimonialRemove: "Entfernen",
          testimonialsEmpty:
            "Noch keine Kundenstimmen. Fügen Sie Ihr erstes Zitat hinzu.",
          typographySection: "Typografie (optional)",
          typographyHint:
            "Überschreiben Sie die Schriften der Vorlage. Standard belassen, um die Schriften der Vorlage zu verwenden.",
          typographyDefaultLabel: "Vorlagen-Standard",
          typographyDefaultDesc: "Verwendet die Schriften der Vorlage.",
          typographyModernLabel: "Modern",
          typographyModernDesc: "Inter + Manrope — minimalistisch, geschäftlich.",
          typographyClassicLabel: "Klassisch",
          typographyClassicDesc:
            "Cormorant Garamond + Source Sans 3 — elegant, traditionell.",
          typographyEditorialLabel: "Editorial",
          typographyEditorialDesc: "Playfair Display + Inter — Magazin-Feeling.",
          typographyBoldLabel: "Markant",
          typographyBoldDesc: "Bebas Neue + Inter — auffällig, sportlich.",
          billingSection: "Zahlungsmodell",
          billingMonthly: "Monatlich",
          monthlyFooter: "Niedrige Einstiegshürde. Jederzeit kündbar.",
          billingYearly: "Jährlich",
          billingBestValue: "Beste Wahl",
          yearlyFooter: "~35 % Ersparnis vs. monatlich. Revisionen inkl.",
          billingOneTime: "Einmalzahlung",
          oneTimeFooter: "Lebenslang gehostet. Keine Verlängerung.",
          totalLabel: "Zu zahlen",
          submit: "Zahlen & Karte veröffentlichen",
          submitting: "Wird verarbeitet …",
          previewLabel: "Live-Vorschau",
          previewHint:
            "Die Vorschau aktualisiert sich live — so sieht Ihre Karte nach Veröffentlichung aus.",
          invalidInput: "Bitte prüfen Sie die markierten Felder.",
          serverError: "Serverfehler. Bitte erneut versuchen.",
          noCheckoutUrl: "Keine Zahlungs-URL erhalten.",
          networkError: "Netzwerkfehler.",
          step1Title: "Kontakt",
          step1Summary: "So erreichen wir Sie",
          step1Next: "Weiter zum Karteninhalt",
          step2Title: "Karteninhalt",
          step2Summary: "Was auf Ihrer Karte erscheint",
          step2Next: "Weiter zum Branding",
          step3Title: "Branding",
          step3Summary: "Farben, Stil, Designnotizen",
          step3Next: "Weiter zur Zahlung",
          step4Title: "Zahlung",
          step4Summary: "Wählen Sie Ihren Plan",
          stepIndicator: "Schritt {current} von {total}",
          stepEmpty: "Bitte ausfüllen",
          previewLabelMobile: "Vorschau",
          previewSheetTitle: "Live-Vorschau",
          previewSheetClose: "Schließen",
          previewLiveBadge: "Live-Vorschau",
          previewLiveHint: "Aktualisiert sich beim Tippen",
          stepLockedHint: "Vorherigen Schritt abschließen, um fortzufahren",
        },
      },
      edit: {
        title: "Karte bearbeiten",
        subtitle:
          "Tippfehler, Telefonnummern, Social Links — ändern Sie alles selbst. Änderungen sind sofort live.",
        publicUrlLabel: "Ihre öffentliche Karte:",
        liveBadge: "Karte ist live",
        slugRenameWarning:
          "Die neue Adresse wird mit «Speichern» übernommen. Die alte leitet automatisch um.",
        viewAsOwner: "Als Inhaber ansehen",
        analyticsLoading: "Lädt…",
        analyticsEmpty: "Statistiken nicht verfügbar.",
        analyticsLast7: "Letzte 7 Tage",
        analyticsLast30: "Letzte 30 Tage",
        analyticsTotal: "Gesamt",
        sourceWallet: "Wallet",
        sourceOther: "Andere",
        leadStatusContacted: "Kontaktiert",
        leadStatusArchived: "Archiv",
        leadStatusNew: "Neu",
        leadStatusQualified: "Qualifiziert",
        crmHeaderTitle: "Kontakte (CRM)",
        crmHeaderHint:
          "Hier landen Besucher, die das Formular ausfüllen, und andere Karteninhaber, die ihre Karte an dich senden. Du bekommst zusätzlich eine E-Mail pro Eintrag.",
        crmTabLeads: "Eingang",
        crmTabConnections: "Karten-Verbindungen",
        crmFilterAll: "Alle",
        crmSearchPlaceholder: "Name, E-Mail, Firma, Tag…",
        crmLoading: "Lädt…",
        crmEmptyLeads: "Noch keine eingegangenen Anfragen.",
        crmEmptyConnections: "Noch keine Karten-Verbindungen.",
        addNotePlaceholder:
          "Kontext: wo getroffen, was besprochen, Follow-up-Notizen…",
        editNote: "Notiz bearbeiten",
        closeNote: "Notiz schließen",
        addNote: "Notiz hinzufügen",
        connectionNotePlaceholder: "Notiz zu dieser Verbindung hinzufügen…",
        unsavedChanges: "Ungespeicherte Änderungen",
        allSaved: "Alles gespeichert",
        revert: "Verwerfen",
        untitledCard: "Unbenannte Karte",
        viewLive: "Live ansehen",
        sectionPersonBrand: "Person & Marke",
        sectionContact: "Kontakt",
        sectionContent: "Inhalt",
        sectionPublish: "Veröffentlichung & Status",
        adjustPhoto: "Foto anpassen",
        adjustLogo: "Logo anpassen",
        expandSection: "Bereich öffnen",
        collapseSection: "Bereich schließen",
        contactReadonlyLabel: "Ihre Kontaktdaten (nur Anzeige)",
        contactReadonlyHint:
          "E-Mail, Name oder Telefon ändern? Antworten Sie auf Ihre Bestell-E-Mail — wir erledigen das.",
        statusLabel: "Bestellstatus",
        save: "Änderungen speichern",
        saving: "Wird gespeichert …",
        savedSuccess: "Gespeichert.",
        savedError: "Änderungen konnten nicht gespeichert werden. Bitte erneut versuchen.",
        shareHeading: "Karte teilen",
        shareBody:
          "Laden Sie ein 1200×630-Bild Ihrer Karte herunter — für LinkedIn, Instagram oder Ihre Signatur.",
        downloadOg: "Social-Bild herunterladen",
        shareNotReady:
          "Das Teilen-Bild steht zur Verfügung, sobald Ihre Karte veröffentlicht ist.",
        notFoundTitle: "Dieser Bearbeitungslink funktioniert nicht",
        notFoundBody:
          "Der Link ist abgelaufen oder ungültig. Antworten Sie auf Ihre Bestell-E-Mail — wir senden Ihnen einen neuen Link.",
      },
      cancel: {
        heading: "Abo kündigen",
        body: "Ihre Karte bleibt bis zum Ende des aktuellen Abrechnungszeitraums online. Danach werden keine weiteren Beträge abgebucht.",
        openCta: "Abo jetzt kündigen",
        alreadyScheduled:
          "Ihr Abo ist bereits zum {date} gekündigt.",
        modalEyebrow: "BESTÄTIGEN",
        modalTitle: "OpSolid Digital Card wirklich kündigen?",
        explainer:
          "Ihr Abo bleibt bis zum {date} aktiv und verlängert sich danach nicht mehr. Weitere Abbuchungen entfallen.",
        explainerNoDate:
          "Ihr Abo bleibt bis zum Ende des aktuellen Abrechnungszeitraums aktiv und verlängert sich danach nicht mehr.",
        keep: "Abo behalten",
        confirm: "Kündigung bestätigen",
        error: "Kündigung konnte nicht geplant werden. Bitte E-Mail an info@kutasia.com.",
        doneBody:
          "Kündigung vorgemerkt. Ihre Karte bleibt bis zum {date} live. Eine abschließende Bestätigung senden wir per E-Mail.",
        doneClose: "Schließen",
      },
      meta: {
        title:
          "OpSo Smart — Kostenlose digitale Visitenkarte, in Sekunden live",
        description:
          "Erstellen Sie Ihre digitale Visitenkarte kostenlos und veröffentlichen Sie sie in Sekunden — Link, QR, vCard. EU-Hosting (Frankfurt), DSGVO-nativ. Premium ergänzt eigene Domain, NFC und Analysen.",
      },
    },

    voiceAgent: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 02 ]   VOICE AI",
        title: [
          "Ein Voice-Agent,",
          "der Ihr Telefon um 2 Uhr morgens beantwortet —",
          "in drei Sprachen.",
        ],
        paragraph:
          "Ein produktionsreifer KI-Voice-Agent, der Ihre Telefonleitung rund um die Uhr entgegennimmt, Anrufer qualifiziert, Termine bucht und echte Notfälle an einen Menschen weiterleitet. Deutsch, Englisch und Türkisch ab Werk. Gebaut auf Retell AI oder Vapi mit Live-Kalender-Sync.",
        primaryCta: "Demo buchen",
        secondaryCta: "So funktioniert's",
        tags: "RETELL · VAPI · DE/EN/TR · 24/7",
        startingPrice: "Ab €1.200 Einrichtung + €0,12/Min.",
      },
      features: {
        label: "WAS SIE BEKOMMEN",
        heading: "Jeder Anruf entgegengenommen — qualifiziert, protokolliert, weitergeleitet.",
        items: [
          {
            label: "NATÜRLICHER DIALOG",
            body: "Niedrige Latenz beim Sprecherwechsel (<800 ms) mit Barge-In-Unterstützung. Klingt wie ein gut gebriefter Empfang, nicht wie ein IVR-Menü.",
          },
          {
            label: "KALENDERBUCHUNG",
            body: "Live-Zwei-Wege-Sync mit Google Kalender, Outlook und Cal.com. Der Agent bucht, bucht um und respektiert Puffer.",
          },
          {
            label: "ANRUF-ROUTING",
            body: "Erkennt Dringlichkeit und leitet komplexe Anrufe an eine menschliche Leitung weiter — mit vollem Kontext und Transkript vor der Annahme.",
          },
          {
            label: "TRANSKRIPTE & ZUSAMMENFASSUNGEN",
            body: "Jeder Anruf wird transkribiert, zusammengefasst und nach Absicht getaggt. Landet Sekunden nach dem Auflegen in Ihrem CRM oder Slack.",
          },
          {
            label: "MEHRSPRACHIG",
            body: "Deutsch, Englisch, Türkisch — mit Stimmenauswahl pro Sprache. Anrufer werden in der Sprache beantwortet, in der sie anrufen.",
          },
          {
            label: "DSGVO-NATIV",
            body: "EU-gehostete Inferenz, AV-Vertrag ab Registrierung, Aufzeichnungen in Frankfurt gespeichert. Opt-in-Ansage zu Beginn jedes Anrufs.",
          },
        ],
      },
      howItWorks: {
        label: "SO FUNKTIONIERT'S",
        heading: "Vier Schritte. Eine Telefonnummer.",
        steps: [
          {
            step: "01",
            title: "Nummer portieren oder weiterleiten",
            body: "Sie behalten Ihre bestehende Nummer — wir leiten unbeantwortete Anrufe an den Agenten weiter, oder Sie geben uns eine eigene Leitung.",
          },
          {
            step: "02",
            title: "Agent briefen",
            body: "Wir schreiben den System-Prompt mit Ihren Leistungen, Preisen, Öffnungszeiten und Eskalationsregeln. Sie prüfen ihn.",
          },
          {
            step: "03",
            title: "Kalender + CRM verbinden",
            body: "Cal.com oder Google Kalender für Buchungen; HubSpot/Pipedrive für Leads. Webhooks erledigen den Rest.",
          },
          {
            step: "04",
            title: "Live gehen und überwachen",
            body: "Jeder Anruf wird im Dashboard protokolliert. Sie prüfen Transkripte, justieren den Prompt, passen Eskalations-Trigger an.",
          },
        ],
      },
      stack: {
        label: "GEBAUT AUF",
        heading: "Keine Magie. Echte Technik.",
        items: [
          { name: "Retell AI", role: "Voice-Orchestrierung + Telefonie" },
          { name: "Vapi", role: "Alternativer Voice-Stack (Enterprise)" },
          { name: "Cal.com", role: "Kalenderbuchungsschicht" },
          { name: "Supabase", role: "Anruf-Logs + Kontext-Store" },
          { name: "Custom Workflows", role: "CRM-Sync + Post-Call-Orchestrierung" },
        ],
      },
      pricing: {
        label: "PREISE",
        heading: "Einrichtung einmalig. Abrechnung pro Gesprächsminute.",
        tiers: [
          {
            name: "Starter",
            price: "€1.200",
            billing: "einmalige Einrichtung + €0,12/Min.",
            features: [
              "Eine Telefonleitung",
              "DE oder EN (eine Sprache)",
              "Cal.com-Integration",
              "E-Mail-Benachrichtigungen",
              "100 Min. Testguthaben",
            ],
            cta: "Demo buchen",
          },
          {
            name: "Business",
            price: "€2.400",
            billing: "Einrichtung + €0,12/Min. + €99/Monat",
            features: [
              "Bis zu 3 Telefonleitungen",
              "DE · EN · TR mehrsprachig",
              "HubSpot- / Pipedrive-Sync",
              "Slack + WhatsApp-Benachrichtigungen",
              "Monatliche Prompt-Feinabstimmung",
              "Priorisierter Support",
            ],
            cta: "Demo buchen",
            featured: "true",
          },
          {
            name: "Enterprise",
            price: "Individuell",
            billing: "Volumenpreise + SLA",
            features: [
              "Unbegrenzte Leitungen",
              "Individuelles Voice-Cloning",
              "Self-Hosted-Option (Vapi)",
              "Eigener Slack-Kanal",
              "99,9 % SLA",
            ],
            cta: "Sprechen Sie uns an",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Klare Antworten.",
        items: [
          {
            q: "Merken Anrufer, dass es eine KI ist?",
            a: "Ja — wir sagen es zu Beginn jedes Gesprächs an. Etwas anderes bricht DSGVO und beschädigt Vertrauen. In der Praxis stört es Anrufer nicht, sobald der Agent den Anruf kompetent abwickelt.",
          },
          {
            q: "Was passiert bei komplexen oder Notfall-Anrufen?",
            a: "Der Agent erkennt Eskalations-Trigger (von Ihnen definierte Schlüsselwortlisten + Intent-Signale) und leitet an eine menschliche Leitung weiter — Transkript und Zusammenfassung werden bereits per Slack/E-Mail gesendet.",
          },
          {
            q: "Wie schnell ist das wirklich?",
            a: "Die Sprecherwechsel-Latenz liegt bei Retells Enterprise-Stufe unter 800 ms. Er unterbricht höflich und macht nicht die peinlichen 2-Sekunden-Pausen früher Voice-Agenten aus 2024.",
          },
          {
            q: "Kann ich ein echtes Beispiel hören?",
            a: "Ja. Wir lassen beim Erstgespräch eine Live-Demo auf einer Sandbox-Nummer laufen — Sie rufen an, der Agent antwortet, Sie testen Grenzfälle. Kein Folienvortrag.",
          },
          {
            q: "Ist es wirklich DSGVO-konform?",
            a: "Anrufe werden auf EU-Infrastruktur verarbeitet (Retell EU-Region / Vapi selbstgehostet). Aufzeichnungen in Frankfurt gespeichert. AV-Vertrag ab Tag eins. Wir kündigen die KI zu Beginn an und bieten Opt-out.",
          },
        ],
      },
      cta: {
        heading: "Ihr Telefon klingelt um 2 Uhr morgens. Wer hebt ab?",
        paragraph:
          "Buchen Sie ein 30-minütiges Erstgespräch. Wir richten einen Sandbox-Agenten auf Ihren tatsächlichen Leistungen ein und lassen Sie ihn anrufen.",
        primaryCta: "Demo buchen",
        secondaryCta: "Sprechen Sie uns an",
      },
    },

    chatbot: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 03 ]   WEBSITE-CHATBOT",
        title: [
          "Ein Chatbot.",
          "Drei Kanäle.",
          "Null Skriptmauern.",
        ],
        paragraph:
          "Ein kontextbewusster Chatbot, der gleichzeitig auf Ihrer Website, WhatsApp und Telegram lebt — ein Gehirn, drei Stimmen. Qualifiziert Leads, beantwortet echte Fragen aus Ihren Dokumenten und synchronisiert Gespräche mit HubSpot.",
        primaryCta: "Demo buchen",
        secondaryCta: "So funktioniert's",
        tags: "OPENAI · CUSTOM · SUPABASE · MULTI-KANAL",
        startingPrice: "Ab €1.800 Einrichtung + €99/Monat",
      },
      features: {
        label: "WAS SIE BEKOMMEN",
        heading: "Ein Chatbot, der Ihre Dokumente liest — kein FAQ-Papagei.",
        items: [
          {
            label: "MULTI-KANAL",
            body: "Gleiches Gespräch, gleiche Erinnerung — über Web-Widget, WhatsApp Business und Telegram. Ein gemeinsamer Posteingang für Ihr Team.",
          },
          {
            label: "RAG-GESTÜTZT",
            body: "Trainiert auf Ihren echten Inhalten: Produkt-Dokumente, Richtlinien, PDFs, Notion-Seiten. Keine halluzinierten Antworten — Quellenangaben inklusive.",
          },
          {
            label: "LEAD-ERFASSUNG",
            body: "Qualifiziert im natürlichen Dialog (kein Formular-Abarbeiten), dann schickt strukturierte Daten beim Absenden an HubSpot/Pipedrive.",
          },
          {
            label: "ÜBERGABE AN MENSCHEN",
            body: "Nahtlose Eskalation an einen Live-Agenten mit vollem Transkript, erkannter Stimmung und empfohlener nächster Aktion.",
          },
          {
            label: "ANALYSE",
            body: "Top-unbeantwortete Fragen, Eskalationsrate, Conversion-Funnel pro Kanal. Ein wöchentlicher Digest, kein Dashboard-Labyrinth.",
          },
          {
            label: "INDIVIDUELL GESTALTET",
            body: "Ihre Schriften, Ihre Farben, Ihr Ton. Lebt im Gehäuse Ihrer Seite — keine generische Fremd-Chatblase.",
          },
        ],
      },
      howItWorks: {
        label: "SO FUNKTIONIERT'S",
        heading: "Vier Schritte zum Launch.",
        steps: [
          {
            step: "01",
            title: "Wissensquellen einlesen",
            body: "Wir crawlen Ihre Seite, importieren Dokumente/PDFs, verbinden Ihr Notion oder Confluence. Embeddings landen in Supabase pgvector.",
          },
          {
            step: "02",
            title: "Flows entwerfen",
            body: "Lead-Qualifizierung, Buchungspfad, Eskalations-Trigger. Sie geben System-Prompt und Leitplanken frei.",
          },
          {
            step: "03",
            title: "Über alle Kanäle deployen",
            body: "Ein Widget fürs Web. BSP-verifiziertes WhatsApp Business. Telegram-Bot. Alle landen im selben Gesprächs-Backend.",
          },
          {
            step: "04",
            title: "Wöchentlich iterieren",
            body: "Wir überwachen die am häufigsten fehlgeschlagenen Anfragen und aktualisieren Wissensbasis und Prompts. Erste 30 Tage inklusive.",
          },
        ],
      },
      stack: {
        label: "GEBAUT AUF",
        heading: "Keine Magie. Echte Technik.",
        items: [
          { name: "OpenAI / Claude", role: "LLM-Kern (austauschbar)" },
          { name: "Supabase pgvector", role: "RAG-Embeddings + Gedächtnis" },
          { name: "Custom Workflows", role: "Kanal-Orchestrierung + CRM-Sync" },
          { name: "Meta Business Cloud", role: "Offizieller WhatsApp-BSP" },
          { name: "HubSpot / Pipedrive", role: "Lead-Sync-Ziel" },
        ],
      },
      pricing: {
        label: "PREISE",
        heading: "Einmalige Einrichtung. Planbare Monatsraten.",
        tiers: [
          {
            name: "Nur Web",
            price: "€1.800",
            billing: "Einrichtung + €99/Monat",
            features: [
              "Website-Widget",
              "RAG auf bis zu 200 Seiten/Dokumenten",
              "HubSpot-Sync",
              "5.000 Nachrichten/Monat",
              "30 Tage Feinabstimmung nach Launch",
            ],
            cta: "Demo buchen",
          },
          {
            name: "Multi-Kanal",
            price: "€2.800",
            billing: "Einrichtung + €199/Monat",
            features: [
              "Web + WhatsApp + Telegram",
              "Vereinheitlichter Agenten-Posteingang",
              "RAG auf bis zu 1.000 Dokumenten",
              "20.000 Nachrichten/Monat",
              "Übergabe-an-Mensch-Workflow",
              "Wöchentliche Iteration",
            ],
            cta: "Demo buchen",
            featured: "true",
          },
          {
            name: "Scale",
            price: "Ab €5.000",
            billing: "Einrichtung + nutzungsbasiert",
            features: [
              "Unbegrenzte Kanäle",
              "Individuelles LLM (Self-Hosted-Option)",
              "Erweiterte Analyse",
              "White-Label",
              "SLA + dedizierter Support",
            ],
            cta: "Sprechen Sie uns an",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Klare Antworten.",
        items: [
          {
            q: "Halluziniert er und beschädigt unsere Marke?",
            a: "RAG mit strenger Erdung bedeutet, dass der Bot seine Quellen nennt. Steht die Antwort nicht in Ihren Dokumenten, sagt er das und bietet Eskalation an. Wir tunen ihn explizit so, dass er 'ich weiß es nicht' der selbstbewussten Erfindung vorzieht.",
          },
          {
            q: "Funktioniert WhatsApp wirklich richtig?",
            a: "Ja — über die offizielle Meta Business Cloud API via verifiziertem BSP (Twilio, 360dialog oder AiSensy). Kein Graumarkt-Scraping. Grüner Verifikations-Haken, kein Sperrrisiko.",
          },
          {
            q: "Können wir unser bestehendes Live-Chat-Tool weiter nutzen?",
            a: "Wenn Sie Intercom, Crisp oder Zendesk verwenden — ja. Wir legen KI darüber und eskalieren nur an Ihren bestehenden menschlichen Workflow. Kein Tool-Austausch.",
          },
          {
            q: "Was passiert, wenn OpenAI ausfällt?",
            a: "Wir konfigurieren Claude (Anthropic) als Fallback und können Llama 3 für kritische Workloads selbst hosten. Multi-Provider-LLM-Routing ist in jeder Stufe ab Web enthalten.",
          },
        ],
      },
      cta: {
        heading: "Ihr Support-Team beantwortet die gleichen 50 Fragen. Jeden Tag.",
        paragraph:
          "Buchen Sie eine Demo. Wir richten einen Chatbot auf Ihren echten Dokumenten ein und lassen Sie ihn vor der Festlegung testen.",
        primaryCta: "Demo buchen",
        secondaryCta: "Sprechen Sie uns an",
      },
    },

    whatsappAgent: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 04 ]   WHATSAPP BUSINESS",
        title: [
          "WhatsApp,",
          "das tatsächlich funktioniert —",
          "offiziell.",
        ],
        paragraph:
          "WhatsApp-Automatisierung über die offizielle Meta Business Cloud API — via verifiziertem BSP (Twilio, 360dialog, AiSensy). Auftrags-Tracking, Support, Qualifizierung, Zahlungs-Trigger. Kein Scraping, keine inoffiziellen Bibliotheken, kein Sperrrisiko.",
        primaryCta: "Demo buchen",
        secondaryCta: "So funktioniert's",
        tags: "META BUSINESS CLOUD · 360DIALOG · TWILIO · VERIFIZIERT",
        startingPrice: "Ab €1.500 Einrichtung + Meta-Gebühren",
      },
      features: {
        label: "WAS SIE BEKOMMEN",
        heading: "Alles, was Metas API erlaubt — nichts, was sie nicht erlaubt.",
        items: [
          {
            label: "VERIFIZIERTER GRÜNER HAKEN",
            body: "Wir übernehmen die offizielle Business-Verifizierung über den BSP. Ihre Marke erscheint mit dem grünen Häkchen, dem Kunden vertrauen.",
          },
          {
            label: "BESTELL- & VERSANDUPDATES",
            body: "Automatisierte Benachrichtigungen: Bestellung erhalten, verpackt, versendet, zugestellt. Direkt angebunden an Shopify / WooCommerce / Ihr ERP.",
          },
          {
            label: "KUNDENSUPPORT",
            body: "Eingehender Support mit KI-Antworten in erster Linie. Eskalation an einen Menschen mit vollem Kontext, wenn der Bot an Grenzen stößt.",
          },
          {
            label: "ZAHLUNGSLINKS",
            body: "Stripe-Zahlungslinks im Gespräch auslösen — Auftragsbestätigungen, Rechnungen, Anzahlungen — mit Belegen zurück in WhatsApp.",
          },
          {
            label: "KAMPAGNEN-VORLAGEN",
            body: "Meta-freigegebene Nachrichtenvorlagen für Broadcasts. Opt-in-Verwaltung, Rate-Limit, niemals spammy.",
          },
          {
            label: "TEAM-POSTEINGANG",
            body: "Ihre Agenten bearbeiten Gespräche in einem echten Posteingang (unserem oder Ihrem bestehenden — Front, HubSpot, Zendesk). Vollständiger Audit-Trail.",
          },
        ],
      },
      howItWorks: {
        label: "SO FUNKTIONIERT'S",
        heading: "Erst verifizieren, dann automatisieren.",
        steps: [
          {
            step: "01",
            title: "Geschäft bei Meta verifizieren",
            body: "Wir begleiten Sie durch die Facebook-Business-Manager-Verifizierung und das BSP-Onboarding. Üblich sind 5–10 Werktage.",
          },
          {
            step: "02",
            title: "Nachrichtenvorlagen entwerfen",
            body: "Meta prüft jede Broadcast-Vorlage. Wir entwerfen, reichen ein und iterieren bis zur Freigabe — meist 1–2 Runden.",
          },
          {
            step: "03",
            title: "Backend anbinden",
            body: "Shopify/WooCommerce für Bestellungen, Stripe für Zahlungen, HubSpot für Leads. Webhooks fließen in beide Richtungen.",
          },
          {
            step: "04",
            title: "Launch mit Automatisierung + menschlicher Ebene",
            body: "Automatische Antworten + KI für Skalierung, menschliche Agenten für Nuance. Sie wählen, wo die Grenze liegt.",
          },
        ],
      },
      stack: {
        label: "GEBAUT AUF",
        heading: "Offizielle API, kein Graumarkt.",
        items: [
          { name: "Meta Business Cloud API", role: "Offizieller WhatsApp-Kanal" },
          { name: "360dialog / Twilio / AiSensy", role: "Verifizierte BSP-Schicht" },
          { name: "Custom Workflows", role: "Workflow-Orchestrierung" },
          { name: "Stripe", role: "Zahlungslink-Trigger" },
          { name: "Shopify / WooCommerce", role: "Bestell- + Versand-Quelle der Wahrheit" },
        ],
      },
      pricing: {
        label: "PREISE",
        heading: "Einrichtung + BSP-Durchleitung. Keine Marge-Spielchen.",
        tiers: [
          {
            name: "Launch",
            price: "€1.500",
            billing: "Einrichtung + Meta-Gebühren durchgereicht",
            features: [
              "Business-Verifizierung",
              "3 freigegebene Meta-Vorlagen",
              "1 Automatisierung (Bestellung oder Support)",
              "360dialog- oder Twilio-BSP",
              "30 Tage Support nach Launch",
            ],
            cta: "Demo buchen",
          },
          {
            name: "Commerce",
            price: "€3.200",
            billing: "Einrichtung + €149/Monat + Meta-Gebühren",
            features: [
              "Alles aus Launch",
              "Shopify-/WooCommerce-Integration",
              "Bestellfluss-Automatisierungen",
              "Stripe-Zahlungslinks",
              "KI-first-Support-Schicht",
              "Team-Posteingang (bis zu 5 Agenten)",
            ],
            cta: "Demo buchen",
            featured: "true",
          },
          {
            name: "Enterprise",
            price: "Individuell",
            billing: "Einrichtung + Volumenpreise",
            features: [
              "Nummern in mehreren Ländern",
              "Bi-direktionaler CRM-Sync",
              "Erweitertes Routing + SLAs",
              "Eigener BSP-Ansprechpartner",
              "Compliance-Prüfung",
            ],
            cta: "Sprechen Sie uns an",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Klare Antworten zu einem undurchsichtigen Kanal.",
        items: [
          {
            q: "Warum nicht eine günstigere inoffizielle WhatsApp-Bibliothek nutzen?",
            a: "Weil Meta sie sperrt, Punkt. Ihre Nummer wird markiert, Kunden verlieren Vertrauen, Ihre Automatisierung bricht über Nacht. Wir liefern keinen Graumarkt-WhatsApp. Die offizielle API kostet mehr — sie ist auch das Einzige, was überlebt.",
          },
          {
            q: "Wie hoch sind Metas Gebühren?",
            a: "Gesprächsbasiert. Utility-Gespräche (Auftrags-Updates) liegen bei etwa €0,02–0,05; Marketing-Gespräche bei €0,05–0,12. Wir reichen diese zum Selbstkostenpreis durch — ohne Aufschlag.",
          },
          {
            q: "Wie lange dauert die Verifizierung?",
            a: "Durchschnittlich 5–10 Werktage. Meta verifiziert Ihre Unternehmensdokumente und Ihre BSP-Beziehung. Wir erledigen den Papierkram.",
          },
          {
            q: "Kann ich von einem inoffiziellen Tool migrieren?",
            a: "Ja. Wir lassen den offiziellen Kanal 2 Wochen parallel laufen, dann schalten wir um. Die Migration der Rufnummer ist möglich, erfordert aber Koordination mit Ihrem aktuellen Anbieter.",
          },
        ],
      },
      cta: {
        heading: "WhatsApp ist dort, wo Ihre Kunden bereits sind.",
        paragraph:
          "Buchen Sie eine Demo. Wir zeigen Ihnen den exakten Meta-Verifizierungsweg und was auf Ihrem Stack automatisierbar ist.",
        primaryCta: "Demo buchen",
        secondaryCta: "Sprechen Sie uns an",
      },
    },

    bookingAgent: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 05 ]   TERMINBUCHUNGS-AGENT",
        title: [
          "Buchungen,",
          "die sich selbst erledigen —",
          "über Telefon und Chat.",
        ],
        paragraph:
          "Ein KI-Agent für eine Aufgabe: buchen, umbuchen, erinnern. Funktioniert per Voice, Chat oder Formular — mit Zwei-Wege-Sync zu Google Kalender, Outlook oder Cal.com. Null Doppelbuchungen, weniger No-Shows.",
        primaryCta: "Demo buchen",
        secondaryCta: "So funktioniert's",
        tags: "CAL.COM · RETELL · CUSTOM · GOOGLE KALENDER",
        startingPrice: "Ab €800 Einrichtung + €49/Monat",
      },
      features: {
        label: "WAS SIE BEKOMMEN",
        heading: "Ein Agent, jeder Buchungskanal.",
        items: [
          {
            label: "MULTI-KANAL-INTAKE",
            body: "Anrufer, Chat-Nutzer oder Web-Formular — gleiches Backend, gleiche Verfügbarkeitslogik, gleiche Bestätigungs-E-Mail.",
          },
          {
            label: "ZWEI-WEGE-KALENDER-SYNC",
            body: "Live-Sync mit Google Kalender, Outlook 365, iCloud oder Cal.com. Externe Blocker werden sofort berücksichtigt.",
          },
          {
            label: "UMBUCHEN & STORNIEREN",
            body: "Kunden können per Antwort auf die Bestätigung oder Rückruf umbuchen. Kein Formular-Marathon, kein Support-Ticket.",
          },
          {
            label: "ERINNERUNGEN + NO-SHOWS",
            body: "SMS-/WhatsApp-/E-Mail-Erinnerungen nach Ihrem Zeitplan. Automatisches Nachfassen bei verpassten Terminen mit Umbuchungs-Link.",
          },
          {
            label: "PUFFER- & ROUTING-REGELN",
            body: "Dauer pro Leistung, Puffer, Team-Routing, Standort-Beschränkungen. Keine Magie — alles in Cal.com sichtbar.",
          },
          {
            label: "DASHBOARDS",
            body: "Buchungsgeschwindigkeit, Auslastung, No-Show-Rate pro Kanal. Schlichter Wochenbericht, kein 20-Diagramme-Friedhof.",
          },
        ],
      },
      howItWorks: {
        label: "SO FUNKTIONIERT'S",
        heading: "Vier Schritte. Ein Kalender der Wahrheit.",
        steps: [
          {
            step: "01",
            title: "Leistungen abbilden",
            body: "Jede Leistung: Dauer, Puffer, wer liefern darf, Standort-/Raum-Beschränkungen. Wir modellieren das in Cal.com.",
          },
          {
            step: "02",
            title: "Kalender verbinden",
            body: "Mitarbeiterkalender (Google/Outlook/iCloud) synchronisieren in beide Richtungen. Externe Termine blockieren Buchungsslots automatisch.",
          },
          {
            step: "03",
            title: "Intake-Kanäle verdrahten",
            body: "Telefon (via Retell-Voice-Agent), Web-Chat-Widget, eingebettetes Formular. Alles schreibt ins gleiche Cal.com-Backend.",
          },
          {
            step: "04",
            title: "Erinnerungen automatisieren",
            body: "Erinnerungskadenz und Kanal pro Leistung. No-Show-Nachfassen mit Umbuchungs-Links. Alles messbar.",
          },
        ],
      },
      stack: {
        label: "GEBAUT AUF",
        heading: "Keine Magie. Echte Technik.",
        items: [
          { name: "Cal.com", role: "Buchungs-Engine + Verfügbarkeit" },
          { name: "Retell AI", role: "Voice-Intake (optional)" },
          { name: "Custom Workflows", role: "Erinnerungs- + Nachfass-Orchestrierung" },
          { name: "Google Calendar / Outlook", role: "Quelle-der-Wahrheit-Sync" },
          { name: "Twilio", role: "SMS-Erinnerungen" },
        ],
      },
      pricing: {
        label: "PREISE",
        heading: "Kleine Einrichtung. Kleine Monatsrate. Echter ROI.",
        tiers: [
          {
            name: "Solo",
            price: "€800",
            billing: "Einrichtung + €49/Monat",
            features: [
              "Bis zu 3 Leistungen",
              "Web-Formular + Chat-Intake",
              "Google Kalender oder Cal.com",
              "E-Mail- + SMS-Erinnerungen",
              "Wochenbericht",
            ],
            cta: "Demo buchen",
          },
          {
            name: "Team",
            price: "€1.600",
            billing: "Einrichtung + €129/Monat",
            features: [
              "Unbegrenzte Leistungen",
              "Telefon + Chat + Formular",
              "Voice-Agent (Retell)",
              "Team-Routing-Regeln",
              "WhatsApp-Erinnerungen",
              "No-Show-Umbuchungs-Flow",
            ],
            cta: "Demo buchen",
            featured: "true",
          },
          {
            name: "Multi-Standort",
            price: "Individuell",
            billing: "pro Standort",
            features: [
              "Multi-Standort-Routing",
              "Ressourcen-Beschränkungen",
              "Individuelle Integrationen",
              "Mitarbeiter-App (optional)",
              "SLA + Onboarding",
            ],
            cta: "Sprechen Sie uns an",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Klare Antworten.",
        items: [
          {
            q: "Kann ich meinen bestehenden Cal.com-Account behalten?",
            a: "Ja — wir legen obenauf. Wenn Sie bereits auf Cal.com sind, erweitern wir es um Voice-Intake und Workflow-Automatisierung. Keine Migration nötig.",
          },
          {
            q: "Was ist mit wiederkehrenden Buchungen / Paketen?",
            a: "Nativ über Cal.com unterstützt. 5er-Pakete, Monatsabos, Mehr-Sitzungs-Behandlungen — alles Standard.",
          },
          {
            q: "Reduziert es wirklich No-Shows?",
            a: "In unseren Einsätzen sind 30–50 % Reduktion typisch — getrieben von 24-h- + 2-h-Erinnerungen und einem Ein-Klick-Umbuchungs-Link. Zahlen hängen von Ihrem Leistungstyp ab.",
          },
          {
            q: "Können Kunden einfach zum Buchen anrufen?",
            a: "Ja — genau das ist der Punkt. Der Voice-Agent hebt ab, findet Slots, bucht, bestätigt. Oder ein Mensch hebt dennoch ab, wenn der Kunde das bevorzugt.",
          },
        ],
      },
      cta: {
        heading: "Jeder verpasste Anruf ist eine verpasste Buchung.",
        paragraph:
          "Buchen Sie eine Demo. Wir binden einen Sandbox-Kalender an und lassen Sie den Telefon- + Chat-Flow Ende-zu-Ende testen.",
        primaryCta: "Demo buchen",
        secondaryCta: "Sprechen Sie uns an",
      },
    },

    emailAgent: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 06 ]   E-MAIL-AUTOMATISIERUNG",
        title: [
          "Inbox-Triage.",
          "Cold Outreach.",
          "Antwortentwürfe zur Freigabe.",
        ],
        paragraph:
          "KI-E-Mail-Workflows, die wirklich laufen: personalisierter Cold Outreach, Eingangs-Triage und automatisch erstellte Antwortentwürfe zur Freigabe durch einen Menschen. Gebaut auf Instantly, AgentMail und eigenen Orchestrierungs-Flows. Aufgewärmte Zustellbarkeit, DSGVO-konform.",
        primaryCta: "Demo buchen",
        secondaryCta: "So funktioniert's",
        tags: "INSTANTLY · AGENTMAIL · CUSTOM · OPENAI",
        startingPrice: "Ab €99 – €499/Monat",
      },
      features: {
        label: "WAS SIE BEKOMMEN",
        heading: "E-Mail, die funktioniert — ohne 50-Personen-SDR-Team.",
        items: [
          {
            label: "COLD OUTREACH IN SKALIERUNG",
            body: "Personalisierte Varianten pro Kontakt, kein Spray-and-Pray. Multi-Inbox-Rotation, Absenderaufwärmung, Bounce-Handling.",
          },
          {
            label: "EINGANGS-TRIAGE",
            body: "Eingehende Post klassifiziert: Lead, Support, Partner, Spam, Eskalation. Geroutet, getaggt, Zusammenfassung wartet in Ihrem CRM.",
          },
          {
            label: "ANTWORTENTWÜRFE",
            body: "KI entwirft Antworten in Ihrer Stimme, basierend auf Ihren bisherigen E-Mails. Sie prüfen, justieren, senden — Stunden gespart, kein Bot-Schrott.",
          },
          {
            label: "ZUSTELLBARKEITS-GESUNDHEIT",
            body: "SPF/DKIM/DMARC-Audit, Absenderreputation überwacht, Aufwärmung über 5–50 Postfächer. Sie landen tatsächlich im Posteingang.",
          },
          {
            label: "CRM-RÜCKSCHREIBEN",
            body: "Jeder relevante Thread automatisch in HubSpot/Pipedrive protokolliert — mit richtigem Kontakt, Stufe und Zusammenfassung.",
          },
          {
            label: "DSGVO-LEITPLANKEN",
            body: "Sperr-Listen, Abmelde-Handling, Einwilligungslogik für EU-Kontakte. Kein Cold-Mailing ohne Opt-in-Signal.",
          },
        ],
      },
      howItWorks: {
        label: "SO FUNKTIONIERT'S",
        heading: "Vier Schritte, tief in den Posteingang.",
        steps: [
          {
            step: "01",
            title: "Zustellbarkeit prüfen",
            body: "SPF, DKIM, DMARC, Absenderreputation. Alles reparieren, was brennt. Aufwärm-Postfächer bereitstellen, falls Outreach Teil des Umfangs ist.",
          },
          {
            step: "02",
            title: "Post + CRM verbinden",
            body: "Google Workspace, M365 oder Postmark. HubSpot/Pipedrive fürs Protokollieren. Alles nur lesend, bis Sie freigeben.",
          },
          {
            step: "03",
            title: "Flows bauen",
            body: "Triage-Regeln, Antwortvorlagen, Outreach-Sequenzen. Prompts mit echten Beispiel-E-Mails auf Ihre Stimme abgestimmt.",
          },
          {
            step: "04",
            title: "Mensch-im-Prozess",
            body: "Entwürfe landen in einer Prüfwarteschlange. Sie geben frei, bearbeiten, senden. Outreach läuft eigenständig mit Sperr-Logik.",
          },
        ],
      },
      stack: {
        label: "GEBAUT AUF",
        heading: "Keine Magie. Echte Technik.",
        items: [
          { name: "Instantly", role: "Cold Outreach + Aufwärmung" },
          { name: "AgentMail", role: "Eingangs-Triage + Entwürfe" },
          { name: "Custom Workflows", role: "Individuelle Workflow-Orchestrierung" },
          { name: "OpenAI / Claude", role: "Entwürfe + Klassifikation" },
          { name: "HubSpot / Pipedrive", role: "CRM-Quelle der Wahrheit" },
        ],
      },
      pricing: {
        label: "PREISE",
        heading: "Monatliche Betriebspreise. Jederzeit kündbar.",
        tiers: [
          {
            name: "Triage",
            price: "€99",
            billing: "pro Monat",
            features: [
              "1 Postfach klassifiziert + triagiert",
              "Antwortentwürfe (bis zu 200/Monat)",
              "HubSpot- oder Pipedrive-Sync",
              "Wochenbericht",
            ],
            cta: "Demo buchen",
          },
          {
            name: "Outreach + Triage",
            price: "€299",
            billing: "pro Monat",
            features: [
              "Alles aus Triage",
              "Cold Outreach (5 Postfächer)",
              "Aufwärmung + Zustellbarkeits-Monitoring",
              "Bis zu 2.000 gesendete E-Mails/Monat",
              "A/B-Testing",
              "Monatliche Prompt-Feinabstimmung",
            ],
            cta: "Demo buchen",
            featured: "true",
          },
          {
            name: "Scale",
            price: "€499+",
            billing: "pro Monat, volumenbasiert",
            features: [
              "Unbegrenzte Postfächer",
              "Individuelles LLM-Routing",
              "Erweiterte Segmentierung",
              "Dedizierter Workflow-Engineer",
              "SLA",
            ],
            cta: "Sprechen Sie uns an",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Klare Antworten zu einem standardmäßig spammigen Kanal.",
        items: [
          {
            q: "Ist KI-geschriebene Cold-E-Mail nicht einfach Spam?",
            a: "Wenn man es falsch macht, ja. Wir personalisieren auf Absatzebene (kein Token-Austausch), deckeln Volumen pro Postfach und sperren alle, die nicht interagieren. Ist Ihre Liste Müll, sagen wir das — und empfehlen stattdessen Inbound.",
          },
          {
            q: "Ist das DSGVO-konform für EU-Kontakte?",
            a: "B2B-Cold-Outreach an EU-Kontakte erfordert eine Begründung berechtigter Interessen + einfachen Opt-out. Wir setzen beides um. Für Verbraucher (B2C) ist eine vorherige Einwilligung Pflicht — wir mailen ohne sie nicht.",
          },
          {
            q: "Kann ohne menschliche Freigabe geantwortet werden?",
            a: "Ja, aber nur für enge, sichere Intents (Versandbestätigungen, Verfügbarkeits-Antworten, Terminabstimmung). Alles andere landet zur Prüfung in der Warteschlange. Sie setzen die Linie.",
          },
          {
            q: "Was ist mit meiner bestehenden Postfach-Historie?",
            a: "Wir können den Antwort-Entwerfer auf Ihren letzten 500 gesendeten E-Mails trainieren, damit Entwürfe wie Sie klingen, nicht wie die Konzernstimme von GPT-4. Alles lokal verarbeitet, nichts über Embeddings hinaus gespeichert.",
          },
        ],
      },
      cta: {
        heading: "Ihr Posteingang ist ein zweiter Vollzeitjob. Sollte er nicht sein.",
        paragraph:
          "Buchen Sie eine Demo. Wir prüfen Ihr Mail-Setup und zeigen, was sich automatisieren lässt, ohne Spam-Filter auszulösen.",
        primaryCta: "Demo buchen",
        secondaryCta: "Sprechen Sie uns an",
      },
    },

    leadQualifier: {
      hero: {
        eyebrow: "[ OPSOLID AGENT · 07 ]   LEAD-QUALIFIZIERUNG",
        title: [
          "Jeder eingehende Lead.",
          "Qualifiziert, bewertet,",
          "an den Vertrieb übergeben.",
        ],
        paragraph:
          "Ein Gesprächs-Agent, der eingehende Leads per Voice oder Chat qualifiziert, gegen Ihr ICP bewertet und MQLs direkt in HubSpot oder Pipedrive an den Vertrieb weiterleitet. Typische Steigerung: 40 % MQL-zu-SQL-Conversion.",
        primaryCta: "Demo buchen",
        secondaryCta: "So funktioniert's",
        tags: "RETELL · HUBSPOT · CUSTOM · SCORING",
        startingPrice: "Ab €2.200 Einrichtung + €199/Monat",
      },
      features: {
        label: "WAS SIE BEKOMMEN",
        heading: "SDR-Arbeit — 24/7 verfügbar.",
        items: [
          {
            label: "GESPRÄCHSBASIERTE QUALIFIZIERUNG",
            body: "Natürlicher Dialog statt 14-Feld-Formular. Fragt, was zählt, überspringt, was nicht zählt, wirkt menschlich.",
          },
          {
            label: "ICP-SCORING",
            body: "Konfigurierbares Scoring-Modell — Firmografik, Intent-Signale, Budget, Zeitplan. Score landet beim Absenden in HubSpot.",
          },
          {
            label: "SOFORT-ROUTING",
            body: "SQL-reife Leads pingen den Vertrieb auf Slack an oder buchen direkt einen Termin im Kalender eines AE. Kein 'Wir melden uns'-Verzug.",
          },
          {
            label: "VOICE ODER CHAT",
            body: "Gleiche Qualifizierungslogik funktioniert per Telefon (Retell), Website-Chat oder WhatsApp. Sie wählen die Kanäle.",
          },
          {
            label: "GESPRÄCHSBIBLIOTHEK",
            body: "Vollständiges Transkript + Zusammenfassung + Score für jeden Lead. Der Vertrieb öffnet HubSpot und kennt den Kontext bereits.",
          },
          {
            label: "A/B-FRAGEN-TUNING",
            body: "Monatliche Prüfung der Qualifizierungs-Abbrüche. Fragen verfeinern, Abschlussrate verbessern, Wirkung messen.",
          },
        ],
      },
      howItWorks: {
        label: "SO FUNKTIONIERT'S",
        heading: "Vom anonymen Besucher zum vertriebsreifen Lead — ohne Menschen.",
        steps: [
          {
            step: "01",
            title: "ICP + Scoring-Modell definieren",
            body: "Wir erarbeiten Ihr ideales Kundenprofil und übersetzen es in eine gewichtete Scoring-Rubrik (firmografisch + Intent).",
          },
          {
            step: "02",
            title: "Gespräch entwerfen",
            body: "Qualifizierungsfragen auf Score-Dimensionen abgebildet. Verzweigungslogik. Disqualifikation elegant abgewickelt.",
          },
          {
            step: "03",
            title: "CRM + Vertriebs-Routing verdrahten",
            body: "HubSpot/Pipedrive-Pipelines, Slack-Kanäle, AE-Kalender-Routing. SQL-Übergabe per Buchungslink oder direktem Ping.",
          },
          {
            step: "04",
            title: "Über alle Kanäle launchen",
            body: "Chat-Widget + Telefonleitung live. Monatlicher Scoring-Review mit dem Vertrieb zur Kalibrierung der MQL-zu-SQL-Conversion.",
          },
        ],
      },
      stack: {
        label: "GEBAUT AUF",
        heading: "Keine Magie. Echte Technik.",
        items: [
          { name: "Retell AI", role: "Voice-Qualifizierung" },
          { name: "HubSpot / Pipedrive", role: "CRM + Scoring-Ziel" },
          { name: "Custom Workflows", role: "Routing + Slack-/Cal.com-Übergabe" },
          { name: "Supabase", role: "Gesprächs-Log + Analyse" },
          { name: "Clearbit / Apollo (optional)", role: "Firmografische Anreicherung" },
        ],
      },
      pricing: {
        label: "PREISE",
        heading: "Einmalige Einrichtung. Wiederkehrende Steigerung.",
        tiers: [
          {
            name: "Nur Chat",
            price: "€2.200",
            billing: "Einrichtung + €199/Monat",
            features: [
              "Website-Chat-Widget",
              "ICP-Scoring-Modell",
              "HubSpot- oder Pipedrive-Sync",
              "Slack-Routing",
              "Monatlicher Review",
            ],
            cta: "Demo buchen",
          },
          {
            name: "Voice + Chat",
            price: "€3.800",
            billing: "Einrichtung + €349/Monat",
            features: [
              "Chat + eingehendes Telefon",
              "Retell-Voice-Qualifizierung",
              "Kalender-Routing an AEs",
              "Firmografische Anreicherung",
              "A/B-Testing von Fragen",
              "Wöchentlicher Vertriebs-Sync",
            ],
            cta: "Demo buchen",
            featured: "true",
          },
          {
            name: "Enterprise",
            price: "Individuell",
            billing: "Preise pro Team",
            features: [
              "Multi-Team-Routing",
              "Individuelle CRM-Integrationen",
              "Account-basiertes Scoring",
              "Dedizierte Sales Ops",
              "SLA + Reporting",
            ],
            cta: "Sprechen Sie uns an",
          },
        ],
      },
      faq: {
        label: "FAQ",
        heading: "Klare Antworten.",
        items: [
          {
            q: "Bleiben Leads bei einer KI wirklich dran?",
            a: "Kurze Antwort: ja, wenn das Gespräch nützlich wirkt. Wir weisen die KI vorab offen, halten die Fragen auf 4–6 begrenzt und bieten jederzeit eine menschliche Übergabe. Abschlussraten liegen bei 60–80 % gegenüber 15–25 % bei statischen Formularen.",
          },
          {
            q: "Welche MQL-zu-SQL-Steigerung ist realistisch?",
            a: "30–50 % in den meisten Einsätzen — getrieben durch bessere Scoring-Genauigkeit + schnelleres Routing (SQLs landen in Minuten, nicht Stunden beim Vertrieb). Konkrete Zahlen hängen von Ihrem Ausgangswert ab.",
          },
          {
            q: "Kann er Leads disqualifizieren?",
            a: "Ja — und zwar elegant. Außer-ICP-Leads landen in einer Self-Service-Stufe oder werden höflich verabschiedet. Ihre AEs verlieren keine Zeit mehr mit Nicht-Passern.",
          },
          {
            q: "Wie fügt er sich in unser bestehendes SDR-Team?",
            a: "Er ersetzt entweder die Erstqualifizierung (das SDR-Team konzentriert sich auf warmen Outbound) oder ergänzt sie (SDRs bekommen nur SQL-reife Übergaben). Wir bilden Ihre aktuelle Motion ab.",
          },
        ],
      },
      cta: {
        heading: "Ihre AEs sollten mit SQLs sprechen. Nicht Tire-Kicker qualifizieren.",
        paragraph:
          "Buchen Sie eine Demo. Wir gehen Ihren Funnel durch und zeigen, wo die Qualifizierung heute Leads verliert.",
        primaryCta: "Demo buchen",
        secondaryCta: "Sprechen Sie uns an",
      },
    },

    digitalReception: {
      hero: {
        eyebrow: "[ OPSOLID PRODUKT · 02 ]   DIGITALE REZEPTION",
        title: [
          "Ein KI-Empfang,",
          "der antwortet —",
          "auch wenn niemand da ist.",
        ],
        paragraph:
          "Digitale Rezeption ist ein eigenständiges Micro-SaaS — ein KI-gestützter Empfang für Hotels, Kliniken, Salons und Service-Betriebe. Webformular + E-Mail-Intake + optionaler Voice-Agent. Ohne Instagram- oder WhatsApp-Business-Verifizierung. Eigenständig oder als Modul in Kutasia.",
        primaryCta: "Demo buchen",
        secondaryCta: "So funktioniert's",
        tags: "KI-INTAKE · WEBFORMULAR · E-MAIL · OPTIONALER VOICE · DSGVO",
      },
      features: {
        label: "FUNKTIONEN",
        heading: "Ein Empfang, der nicht schläft, krank wird oder den Terminkalender verbummelt.",
        intro:
          "Fokus auf die eine Aufgabe, die eine Rezeption gut machen muss: Anfrage erfassen, qualifizieren, Häufiges beantworten und den Rest sauber an einen Menschen weiterreichen.",
        items: [
          {
            label: "INTAKE · 01",
            title: "Smartes Webformular",
            desc: "Ein gebrandetes Intake-Formular für Ihre Seite. Dynamische Fragen, bedingte Logik und automatisches Routing nach Leistungstyp.",
            icon: "form",
          },
          {
            label: "E-MAIL · 02",
            title: "KI-E-Mail-Triage",
            desc: "Eingehende E-Mails werden von der KI zusammengefasst, klassifiziert und geroutet. Antwortentwürfe werden vorgeschlagen — ein Mensch gibt immer frei.",
            icon: "mail",
          },
          {
            label: "VOICE · 03",
            title: "Optionaler Voice-Agent",
            desc: "Ein DSGVO-konformer Voice-Agent, der nach Feierabend abhebt. Deutsch, Englisch, Türkisch. Gespräche werden transkribiert und landen in Ihrem Posteingang.",
            icon: "phone",
          },
          {
            label: "BUCHUNGEN · 04",
            title: "Kalenderbuchungen",
            desc: "Verbindung zu Google Kalender, Outlook oder Cal.com. Keine zerbrochene Instagram-DM-Integration — nur Kalenderverfügbarkeit und bestätigte Buchungen.",
            icon: "calendar",
          },
          {
            label: "ANALYSE · 05",
            title: "Schlichte Analyse",
            desc: "Woher Anfragen kommen, wie schnell geantwortet wird, welche Leistungen am häufigsten nachgefragt werden. Ein Dashboard, kein 40-Tab-CRM.",
            icon: "chart",
          },
          {
            label: "HOSTING · 06",
            title: "Gehostet in Deutschland",
            desc: "Hetzner / IONOS Frankfurt. DSGVO-nativ. Keine Daten in die USA. Läuft eigenständig oder als Modul in Kutasia.",
            icon: "hosting",
          },
        ],
      },
      useCases: {
        label: "FÜR WEN",
        heading: "Kleine Teams, deren Rezeption zum Engpass wird.",
        intro:
          "Digitale Rezeption ist bewusst schmal — sie ersetzt das Chaos aus verpassten Anrufen, langsamen E-Mails und überlaufenden DMs durch einen organisierten Intake.",
        items: [
          {
            title: "Hotels & Pensionen",
            desc: "Reservierungsfragen, nächtliche Anfragen, mehrsprachige Gäste. Voice-Agent + Formular + E-Mail-Triage — ohne Ihre Rezeption zu ersetzen.",
          },
          {
            title: "Kliniken & Praxen",
            desc: "Terminaufnahme, Medikationsfragen, weniger No-Shows. Intake-Formulare folgen DSGVO für Gesundheitsdaten. Ein Mensch bleibt immer dabei.",
          },
          {
            title: "Salons & Spas",
            desc: "Terminbuchung, Service-Fragen, Walk-in-Triage. KI nimmt die repetitiven Fragen, das Personal konzentriert sich auf den Kunden am Stuhl.",
          },
          {
            title: "Dienstleistungsbetriebe",
            desc: "Installateure, Elektriker, Steuerberater, Kanzleien — wer auch immer das Telefon als Engpass hat. Vollständig gebrandeter Intake mit Routing.",
          },
        ],
      },
      pricing: {
        label: "PREISE",
        heading: "Klein, klar, monatlich. Jederzeit kündbar.",
        popularBadge: "AM BELIEBTESTEN",
        plans: [
          {
            name: "Starter",
            price: "29 €",
            cadence: "pro Monat",
            popular: "",
            bullets: [
              "Intake-Webformular",
              "KI-E-Mail-Triage (1 Postfach)",
              "100 Konversationen / Monat",
              "EN · DE · TR",
            ],
            cta: "Kostenlos testen",
            href: "#lead",
          },
          {
            name: "Rezeption",
            price: "79 €",
            cadence: "pro Monat",
            popular: "true",
            bullets: [
              "Alles aus Starter",
              "Unbegrenzte Postfächer & Formulare",
              "Kalenderbuchungs-Integration",
              "500 Konversationen / Monat",
              "Eigene Domain & Branding",
            ],
            cta: "Demo buchen",
            href: "#lead",
          },
          {
            name: "Voice+",
            price: "149 €",
            cadence: "pro Monat",
            popular: "",
            bullets: [
              "Alles aus Rezeption",
              "KI-Voice-Agent (EN · DE · TR)",
              "Anrufe nach Feierabend",
              "1.500 Konversationen / Monat",
              "Priorisierter Support",
            ],
            cta: "Demo buchen",
            href: "#lead",
          },
        ],
      },
      lead: {
        label: "ANFRAGE",
        heading: "Testen Sie es an Ihrem Betrieb — kostenloses 30-Minuten-Setup.",
        intro:
          "Sagen Sie uns, welche Art Betrieb und wie viele Anfragen Sie ungefähr bearbeiten. Wir gehen das Setup gemeinsam durch und richten eine Testversion ein.",
        fields: {
          name: "Voller Name",
          email: "Geschäftliche E-Mail",
          company: "Name des Betriebs",
          businessType: "Art des Betriebs",
          businessTypeOptions: ["Hotel / Pension", "Klinik / Praxis", "Salon / Spa", "Dienstleistung", "Andere"],
          message: "Etwas, das wir wissen sollten? (optional)",
          consent:
            "Ich stimme zu, dass OpSolid diese Anfrage zur Kontaktaufnahme verarbeitet. Siehe Datenschutzerklärung.",
          privacyLink: "Datenschutzerklärung",
          submit: "Anfrage senden",
          submitting: "Wird gesendet…",
          success:
            "Danke — wir antworten innerhalb eines Werktags.",
          error:
            "Etwas ist schiefgegangen. Bitte schreiben Sie direkt an info@kutasia.com.",
        },
      },
      faq: {
        label: "FAQ",
        heading: "Klare Antworten.",
        items: [
          {
            question: "Ersetzt das mein Empfangspersonal?",
            answer:
              "Nein — es nimmt ihnen Last ab. Die KI erledigt die repetitiven, unwichtigen Anfragen, damit Ihre Leute sich auf den Gast / Patienten / Kunden konzentrieren können, der gerade vor ihnen steht. Alles Nicht-Triviale wird vom Menschen freigegeben.",
          },
          {
            question: "Brauche ich Instagram oder WhatsApp Business?",
            answer:
              "Nein. Digitale Rezeption meidet bewusst Plattformen mit Business-Verifizierungs-Hürden. Es arbeitet mit Ihrem Webformular, Ihrer E-Mail und optional einer Telefonnummer — keine Meta-/Instagram-Integrationen.",
          },
          {
            question: "Ist es DSGVO-konform für Gesundheitsdaten?",
            answer:
              "Ja. Hosting in Frankfurt, Daten im Ruhezustand verschlüsselt, AV-Vertrag ab Registrierung. Kliniken und Praxen bekommen ein spezielles Onboarding für BDSG-konformes Setup.",
          },
          {
            question: "Kann ich das später in Kutasia integrieren?",
            answer:
              "Ja. Digitale Rezeption ist ein eigenständiges Produkt — wenn Sie aber in die volle Kutasia-Plattform hineinwachsen (vereinheitlichter Posteingang, Branchen-Workflows, KI-Analyse), lässt es sich als Modul einbinden — ohne Datenmigration.",
          },
        ],
      },
      cta: {
        eyebrow: "BEREIT?",
        heading:
          "Lassen Sie Ihre Rezeption um 2 Uhr morgens antworten —\nohne eine weitere Person einzustellen.",
        primaryCta: "Demo buchen",
        secondaryCta: "Mit uns sprechen",
      },
      meta: {
        title: "Digitale Rezeption — KI-Empfang für Hotels, Kliniken & Salons",
        description:
          "Eigenständiger KI-Empfang für Service-Betriebe. Webformulare, E-Mail-Triage, optionaler Voice-Agent. DSGVO-nativ, in Deutschland gehostet. Ohne Instagram-Business-Verifizierung.",
      },
    },

    kutasia: {
      hero: {
        eyebrow: "Ein OpSolid-Produkt · Die Plattform",
        label: "Kutasia",
        headline: "Kundenbetrieb,\nvereint und intelligent",
        subheadline:
          "Kutasia ist eine mandantenfähige SaaS-Plattform, die Nachrichten, Anfragen, Buchungen und Inhalte in einem KI-gestützten Arbeitsbereich zusammenführt — angepasst an Ihre Branche. Modular aufgebaut: Kern-Bausteine (Digitale Rezeption, Digitale Visitenkarte) gibt es auch als eigenständige Produkte.",
        primaryCta: "Kutasia besuchen",
        secondaryCta: "Mit dem Team sprechen",
        primaryCtaHref: "https://kutasia.com",
        secondaryCtaHref: "/contact",
        domain: "kutasia.com",
      },

      trustStrip: [
        "Mandantenfähiges SaaS",
        "AES-256-Verschlüsselung",
        "DSGVO-konform",
        "EN / DE / TR",
      ],

      features: {
        label: "Plattformfunktionen",
        headline: "Alles, was ein operatives Team braucht",
        description:
          "Kutasia bündelt die Tools, die Unternehmen über Kanäle hinweg jonglieren — mit branchenspezifischer Struktur und KI, die Gespräche in Erkenntnisse verwandelt.",
        items: [
          {
            icon: "inbox",
            title: "Vereinheitlichter Posteingang",
            description:
              "E-Mail, Webformulare und optionale Messaging-Kanäle (WhatsApp Business API, Instagram wo freigeschaltet) in einem thematisch strukturierten Arbeitsbereich — mit automatischer Zuweisung und Statusverfolgung. Kanal-agnostisch: Sie entscheiden, welche Integrationen aktiv sind.",
          },
          {
            icon: "bot",
            title: "KI-Analyse",
            description:
              "Stimmung, Absicht und Buchungsabsichts-Scoring für jede Nachricht — dringende Gespräche und Chancen werden automatisch hervorgehoben.",
          },
          {
            icon: "layers",
            title: "Branchen-Vorlagen",
            description:
              "Hotel, Salon, Juwelier, Klinik, Restaurant, Buchhaltung und mehr — jede Branche bringt eigene Felder, Terminologie und Workflows mit.",
          },
          {
            icon: "lineChart",
            title: "Operative Dashboards",
            description:
              "Tagessummaries, KPI-Trends, Kanalverteilung und KI-Insights in einem Dashboard, das für Multi-Branchen-Betrieb entwickelt wurde.",
          },
          {
            icon: "shield",
            title: "Sicheres Multi-Tenant",
            description:
              "AES-256-GCM-verschlüsselte OAuth-Tokens, strikte Mandantenisolation, rollenbasierte Zugriffskontrolle und DSGVO-konforme Datenhaltung.",
          },
          {
            icon: "languages",
            title: "Für Europa entwickelt",
            description:
              "Native Englisch, Deutsch und Türkisch — Branchenterminologie pro Industrie übersetzt, bereit für den grenzüberschreitenden Einsatz.",
          },
        ],
      },

      sectors: {
        label: "Unterstützte Branchen",
        headline: "Eine Plattform, fünfzehn Branchen",
        description:
          "Kutasia passt Felder, Sprache und Workflows an Ihre Branche an — ohne generische Vorlagen auf spezialisierte Arbeit zu zwingen.",
        list: [
          { name: "Hotel & Gastgewerbe", icon: "bed" },
          { name: "Salon & Beauty", icon: "scissors" },
          { name: "Juwelier", icon: "gem" },
          { name: "Restaurant", icon: "utensils" },
          { name: "Klinik & Gesundheit", icon: "stethoscope" },
          { name: "Buchhaltung", icon: "calculator" },
          { name: "Influencer", icon: "sparkles" },
          { name: "Creator", icon: "video" },
          { name: "Freelancer", icon: "briefcase" },
          { name: "E-Commerce", icon: "shoppingBag" },
          { name: "Agentur", icon: "megaphone" },
          { name: "Bildung", icon: "graduationCap" },
          { name: "Recht", icon: "scale" },
          { name: "Beratung", icon: "lineChart" },
          { name: "Sonstige", icon: "package" },
        ],
      },

      howItHelps: {
        label: "Der Wandel",
        headline: "Von verstreuten Kanälen zu operativer Klarheit",
        items: [
          {
            before: "Nachrichten gehen zwischen Instagram, WhatsApp und E-Mail verloren",
            after: "Vereinheitlichter Posteingang mit KI-bewerteter Dringlichkeit",
          },
          {
            before: "Generisches CRM, das nicht zu Ihrer Branche passt",
            after: "Branchenspezifische Felder und Workflows ab Werk",
          },
          {
            before: "Manuelle Follow-ups und keine Einsicht in Gespräche",
            after: "Tägliche KI-Zusammenfassungen und automatisierte Kundensignale",
          },
          {
            before: "Fragmentierte Kundendaten über mehrere Tools verteilt",
            after: "Einheitliches Kundenprofil mit vollständigem Interaktionsverlauf",
          },
        ],
      },

      forWho: {
        label: "Entwickelt für",
        headline: "Teams, die auf Kundenkommunikation angewiesen sind",
        items: [
          {
            title: "Lokale Dienstleister",
            description:
              "Hotels, Salons, Kliniken, Juweliere und Restaurants, die Buchungen und Kundenbeziehungen über Kanäle hinweg verwalten.",
          },
          {
            title: "Selbstständige Profis",
            description:
              "Influencer, Creator, Freelancer und Berater, die hohe Volumina an Kundenkommunikation bewältigen.",
          },
          {
            title: "Kleine Agenturen",
            description:
              "Teams, die mehrere Kundenaccounts mit eigenen Workflows, Branding und Reporting-Bedarf betreuen.",
          },
        ],
      },

      cta: {
        headline: "Sehen Sie Kutasia in Aktion",
        description:
          "Besuchen Sie kutasia.com, um die Plattform zu erkunden, oder sprechen Sie mit dem OpSolid-Team für eine maßgeschneiderte Präsentation.",
        primaryCta: "kutasia.com besuchen",
        secondaryCta: "Präsentation buchen",
      },
    },
  },

  v2: {
    nav: {
      home: "Start",
      services: "Leistungen",
      automationCheck: "AI Automation Check",
      journal: "Wissen",
      contact: "Kontakt",
      cta: "Erstgespräch buchen",
      account: {
        login: "Anmelden",
        myCards: "Meine Karten",
        logout: "Abmelden",
        menuLabel: "Konto",
      },
      servicesDropdown: {
        "ki-beratung": { title: "KI-Beratung", sub: "Use Cases · Risiko · Roadmap" },
        prozessautomatisierung: { title: "Prozessautomatisierung", sub: "Workflows · API · Automation" },
        "microsoft-365-automatisierung": {
          title: "Microsoft 365 Automatisierung",
          sub: "Power Automate · M365 · SharePoint",
        },
        "interne-tools": { title: "Interne Tools", sub: "Dashboards · Tools · Integrationen" },
        "ki-schulungen": { title: "KI-Schulungen & Richtlinien", sub: "Schulung · Richtlinien · DSGVO" },
      },
    },

    footer: {
      tagline:
        "KI- und Automatisierungsberatung für mittelständische Unternehmen in Deutschland und Europa — praxisnah, messbar, datenschutzbewusst.",
      chipLive: "",
      chipLanguages: "DE · EN · TR",
      cols: {
        servicesHeading: "Leistungen",
        studioHeading: "Studio",
        reachHeading: "Kontakt",
        legalHeading: "Rechtliches",
        services: {
          automationCheck: "AI Automation Check",
          consulting: "KI-Beratung",
          automation: "Prozessautomatisierung",
          internalTools: "Interne Tools & Integrationen",
          training: "KI-Schulungen & Guidelines",
        },
        studio: {
          about: "Über uns",
          journal: "Wissen",
          contact: "Kontakt",
        },
        reach: {
          email: "info@opsolid.de",
          linkedinLabel: "LinkedIn",
          linkedinHref: "https://www.linkedin.com/company/opsolid/",
        },
        legal: {
          privacy: "Datenschutz",
          imprint: "Impressum",
        },
      },
      base: {
        copyrightSuffix: "OpSolid · Arnsberg, DE",
        trustLine: "",
      },
    },

    home: {
      hero: {
        metaChip: "",
        metaLabel: "[ KI- & AUTOMATISIERUNGSBERATUNG ]",
        title: {
          pre: "KI & Automatisierung für ",
          italic: "effizientere",
          post: " Geschäftsprozesse.",
        },
        lead:
          "OpSolid hilft kleinen und mittelständischen Unternehmen, manuelle Aufgaben, Excel-Prozesse, E-Mail-Abläufe und interne Workflows mit KI, Automatisierung und modernen Tools effizienter zu gestalten.",
        ctaPrimary: "Kostenloses Erstgespräch buchen",
        ctaSecondary: "AI & Automation Check ansehen",
        stats: [],
        benefits: [
          { icon: "workflow", label: "Weniger manuelle Arbeit" },
          { icon: "bolt", label: "Schnellere Prozesse" },
          { icon: "shield", label: "Sichere KI-Nutzung" },
        ],
      },

      problem: {
        eyebrow: "[ AUSGANGSLAGE ]",
        headline: "Kommen Ihnen diese Probleme bekannt vor?",
        lead:
          "Die meisten Mittelständler verlieren jede Woche Stunden an manuelle Übergaben, verteilte Daten und Copy-&-Paste zwischen Tools — Arbeit, die das Team steuert, statt umgekehrt.",
        items: [
          {
            title: "Wiederkehrende Aufgaben kosten täglich Zeit",
            body: "Angebote, Rechnungen, Status-Updates und Nachfassen laufen weiterhin von Hand.",
          },
          {
            title: "Informationen liegen verteilt in E-Mails, Excel-Dateien und Tools",
            body: "Dieselben Daten werden dreimal erfasst; nichts gleicht sich automatisch ab.",
          },
          {
            title: "Mitarbeitende kopieren Daten manuell zwischen Systemen",
            body: "CRM, ERP, Tabellen — Brücken, die längst gebaut sein sollten, übernimmt das Team.",
          },
          {
            title: "Angebote, Berichte oder Dokumente dauern zu lange",
            body: "Vorlagen sind da, aber das Zusammensetzen bleibt Handarbeit.",
          },
          {
            title: "KI wird genutzt — aber ohne Struktur oder Datenschutzkonzept",
            body: "ChatGPT im Schatten-IT: keine Richtlinien, kein Audit-Trail, keine klare Verantwortung.",
          },
        ],
      },

      services: {
        eyebrow: "[ WAS OPSOLID MACHT ]",
        headline: "Was OpSolid für Sie übernimmt",
        lead:
          "Vier fokussierte Bereiche. Jeder mit einem messbaren Ergebnis — weniger manuelle Schritte, kürzere Durchlaufzeiten, sicherer KI-Einsatz.",
        cards: [
          {
            icon: "bot",
            title: "KI-Beratung",
            body:
              "Wir identifizieren sinnvolle KI-Anwendungsfälle, bewerten Nutzen und Risiken und entwickeln eine realistische Roadmap für Ihr Unternehmen.",
            tag: "USE CASES · RISIKO · ROADMAP",
          },
          {
            icon: "workflow",
            title: "Prozessautomatisierung",
            body:
              "Wir automatisieren wiederkehrende Aufgaben mit Microsoft 365, Power Automate, Make, APIs, Python und individuellen Workflows.",
            tag: "M365 · POWER AUTOMATE · APIS",
          },
          {
            icon: "plug",
            title: "Interne Tools & Integrationen",
            body:
              "Wir verbinden bestehende Systeme, reduzieren Medienbrüche und entwickeln kleine interne Anwendungen für Ihren Arbeitsalltag.",
            tag: "INTEGRATIONEN · INTERNE TOOLS",
          },
          {
            icon: "shield",
            title: "KI-Schulungen & Guidelines",
            body:
              "Wir schulen Teams im sicheren, produktiven Umgang mit KI und entwickeln einfache Richtlinien für den Unternehmensalltag.",
            tag: "SCHULUNG · GUIDELINES · DSGVO",
          },
        ],
      },

      automationCheckCard: {
        eyebrow: "[ EINSTIEGS-PAKET ]",
        badge: "AI & AUTOMATION CHECK",
        title: {
          pre: "Ein klarer ",
          italic: "erster Schritt",
          post: " für KI und Automatisierung",
        },
        lead:
          "60–90 Minuten. Wir nehmen Ihre wichtigsten manuellen Prozesse auf, identifizieren fünf konkrete Automatisierungspotenziale und liefern einen umsetzbaren 30-Tage-Plan.",
        bullets: [
          "60–90 Minuten Analysegespräch",
          "Aufnahme der wichtigsten manuellen Prozesse",
          "Identifikation von 5 Automatisierungspotenzialen",
          "Bewertung nach Aufwand, Nutzen und Risiko",
          "Konkreter 30-Tage-Umsetzungsplan",
          "Optional: Umsetzung eines ersten Pilot-Workflows",
        ],
        priceNote: "Preis auf Anfrage",
        ctaPrimary: "AI & Automation Check anfragen",
        ctaSecondary: "Was enthalten ist",
      },

      useCases: {
        eyebrow: "[ TYPISCHE ANWENDUNGSFÄLLE ]",
        headline: "Was wir in der Praxis automatisieren",
        lead:
          "Eine kurze Auswahl der Workflows, die wir für mittelständische Unternehmen gebaut oder bewertet haben. Weniger Kopieren, weniger Fehler, schnellere Bearbeitung.",
        cards: [
          {
            title: "E-Mail-Klassifizierung & Weiterleitung",
            body: "Eingehende Nachrichten werden thematisch markiert und an das richtige Postfach oder Ticket geroutet — keine manuelle Triage mehr.",
          },
          {
            title: "Angebots- und Dokumentenerstellung",
            body: "Vorlagen werden aus CRM-Daten gefüllt und zur Freigabe gegeben — Angebote gehen am selben Tag raus.",
          },
          {
            title: "Excel- und Reporting-Automatisierung",
            body: "Wiederkehrende Berichte einmal gebaut, automatisch wiederhergestellt — KPIs liegen vor der Besprechung vor.",
          },
          {
            title: "CRM-/ERP-Datenübertragung",
            body: "Daten fließen einmal zwischen Systemen und gleichen sich selbst ab — keine doppelte Erfassung.",
          },
          {
            title: "Automatische Zusammenfassung von Dokumenten",
            body: "Lange PDFs, Verträge und Meeting-Notizen werden zu einer klaren Übersicht, mit der das Team arbeiten kann.",
          },
          {
            title: "Interne Wissensdatenbank mit KI",
            body: "Suche in eigenen Dokumenten, Richtlinien und FAQs — Antworten bleiben innerhalb des Unternehmens.",
          },
          {
            title: "Meeting-Notizen & Aufgabenverfolgung",
            body: "Gespräche werden transkribiert, Entscheidungen extrahiert, Aufgaben ins System übernommen.",
          },
          {
            title: "Support- und Anfrageprozesse",
            body: "Standardanfragen werden automatisch beantwortet — Menschen übernehmen die Fälle, die es brauchen.",
          },
        ],
      },

      targetGroup: {
        eyebrow: "[ FÜR WEN ]",
        headline: "Für wen OpSolid geeignet ist",
        lead:
          "Wir arbeiten am besten mit Unternehmen, die schneller gewachsen sind als ihre internen Systeme — und die einen messbaren nächsten Schritt suchen statt einer Plattform-Vision.",
        items: [
          "Mittelständische Unternehmen",
          "Handwerks- und Produktionsbetriebe",
          "Vertriebs- und Serviceteams",
          "Unternehmen mit vielen Excel-, E-Mail- oder Dokumentenprozessen",
          "Firmen, die KI nutzen möchten — aber strukturiert und sicher starten wollen",
        ],
      },

      trust: {
        eyebrow: "[ WARUM OPSOLID ]",
        headline: "Warum OpSolid",
        lead:
          "Praxisnah, messbar, datenschutzbewusst. Keine überdimensionierten Plattformen, keine Buzzwords, keine KI um ihrer selbst willen.",
        items: [
          {
            title: "Praxisnaher IT- und Projektmanagement-Hintergrund",
            body: "Erfahrung aus IT-Projektmanagement, Digitalisierung und Prozessoptimierung in echten Unternehmen — keine Beratungsfolien.",
          },
          {
            title: "Fokus auf messbare Prozessverbesserung",
            body: "Jedes Mandat beginnt mit einer Ausgangsmessung und endet mit einer Zahl, mit der Sie arbeiten können.",
          },
          {
            title: "Keine unnötig komplexen Systeme",
            body: "Wir bauen das Kleinste, das das Problem wirklich löst — und erweitern nur dort, wo es sich trägt.",
          },
          {
            title: "Datenschutzbewusste Umsetzung",
            body: "EU-Hosting, DSGVO-konforme Infrastruktur, keine Schatten-IT — so aufgesetzt, dass Audit und Compliance mitkommen.",
          },
          {
            title: "Verständliche Beratung statt reiner Technik-Sprache",
            body: "Entscheider sollen ohne IT-Übersetzer folgen können, was wir vorschlagen.",
          },
          {
            title: "Umsetzung durch Netzwerk oder direkt",
            body: "Lieferung über das OpSolid-Netzwerk oder direkte Entwicklung — je nachdem, was zum Umfang passt.",
          },
        ],
      },

      faq: {
        eyebrow: "[ FAQ ]",
        headline: "Häufige Fragen",
        items: [
          {
            q: "Für welche Unternehmen ist OpSolid geeignet?",
            a: "Mittelständische Unternehmen und Teams mit vielen manuellen oder Excel-/E-Mail-getriebenen Prozessen. Wenn alles ohnehin schon als System läuft, sind wir vermutlich nicht die wirkungsvollste Wahl.",
          },
          {
            q: "Welche Prozesse können automatisiert werden?",
            a: "Alles Wiederkehrende mit klarem Input und klarem Output — Angebote, Dokumentenerstellung, Reporting, Datenabgleich, E-Mail-Routing, Support-Triage.",
          },
          {
            q: "Ist KI-Nutzung datenschutzkonform möglich?",
            a: "Ja — mit der richtigen Modellauswahl, EU-Datenresidenz und einer schriftlichen Richtlinie. Wir richten das von Anfang an mit ein.",
          },
          {
            q: "Muss mein Unternehmen bereits KI nutzen?",
            a: "Nein. Viele Mandate starten ganz ohne KI im Einsatz — das Ergebnis ist trotzdem eine messbare Verbesserung.",
          },
          {
            q: "Wie lange dauert ein erster Automation Check?",
            a: "60 bis 90 Minuten für das Gespräch selbst, plus einige Arbeitstage für den schriftlichen 30-Tage-Plan.",
          },
          {
            q: "Können bestehende Tools wie Microsoft 365 weiter genutzt werden?",
            a: "Ja — der größte Teil dessen, was wir bauen, sitzt auf den Tools auf, die Sie ohnehin schon bezahlen.",
          },
          {
            q: "Entwickelt OpSolid auch individuelle Lösungen?",
            a: "Ja — wo Standard nicht passt, bauen wir interne Tools, eigene Workflows und Integrationen.",
          },
        ],
      },

      capabilities: {
        eyebrow: "[ 02 / 04 ] LEISTUNGEN",
        headline: "Was wir durchgängig verantworten",
        lead:
          "Keine Plattform, kein Marktplatz. Ein kleines, fokussiertes Studio, das Abläufe nimmt, wie sie sind — manuell, halbautomatisiert oder zusammengestückelt — und sie als Systeme hinterlässt, die ohne ständige Betreuung laufen.",
        seeAffordance: "+ Live ansehen",
        closeAffordance: "− Schließen",
        cards: [
          {
            icon: "workflow",
            title: "Workflow-Automatisierung",
            body:
              "Aufträge, Dokumente, Freigaben, Kommunikation. Auf Ihre Prozesse zugeschnitten, mit eigener Orchestrierung und Konnektoren — nicht auf geschlossener Standard-SaaS.",
            tag: "API · WEBHOOKS · CUSTOM",
          },
          {
            icon: "plug",
            title: "Systemintegration",
            body:
              "ERP, CRM, Lager, Abrechnung, Messaging — so verbunden, dass Daten einmal fließen und sich automatisch abgleichen. Adapter gehören Ihnen, nicht gemietet.",
            tag: "ADAPTERS · WEBHOOKS · APIS",
          },
          {
            icon: "bot",
            title: "KI-gestützte Prozesse",
            body:
              "Wo Routing, Extraktion oder Klassifizierung sich rechnet — und nur dort. Abgeraten, wo es nicht passt. Jeder Modellaufruf auditiert und protokolliert.",
            tag: "LLM · RETELL · VAPI",
          },
          {
            icon: "ship",
            title: "Interne Tools",
            body:
              "Admin-Konsolen, Ops-Dashboards, Freigabequeues. Gebaut auf den Systemen, die Ihr Team ohnehin nutzt — eine einzige Arbeitsoberfläche.",
            tag: "REACT · POSTGRES · CAL",
          },
          {
            icon: "radio",
            title: "Voice- & Chat-Agenten",
            body:
              "Telefonannahme, WhatsApp-Triage, Web-Chat. Übergabe an Menschen, wenn das Skript endet — nicht wenn es Ihnen unpassend wäre.",
            tag: "24/7 · EN · DE · TR",
          },
          {
            icon: "shield",
            title: "GDPR-native Infrastruktur",
            body:
              "Deutsches Hosting, EU-Datenresidenz, ISO-27001-konforme Praktiken. Jeder Kunde besitzt seine Daten, Workflows und den Ausstieg.",
            tag: "FRA · AV-DSGVO · ISO 27001",
          },
        ],
      },

      specimen: {
        eyebrow: "[ 03 / 04 ] BRANCHENREFERENZ",
        title: {
          pre: "Die Zahlen, an denen Automatisierung ",
          italic: "gemessen",
          post: " wird",
        },
        body:
          "Jede Automatisierung wird an den Referenzwerten der Branche gemessen. Links der heutige Standardzustand, rechts das angestrebte Ergebnis.",
        chipBefore: "BRANCHENMEDIAN",
        chipAfter: "AUTOMATISIERUNGSZIEL",
        rows: [
          {
            label: "Quote-to-Cash-Zykluszeit",
            sub: "Branchenreferenz · Mittelstand",
            value: "3–7 Tage",
            delta: "vs. <4 h automatisiert",
          },
          {
            label: "Manuelle Schritte pro Auftrag",
            sub: "Branchenreferenz · Mittelstand",
            value: "4–9",
            delta: "vs. 1–2 automatisiert",
          },
          {
            label: "Antwortlatenz der Sprach-KI",
            sub: "Branchenreferenz · 2025",
            value: "<800 ms",
            delta: "end-to-end, natürlicher Fluss",
          },
          {
            label: "Zeit bis zum Ausstieg",
            sub: "OpSolid · Quellcode bleibt bei Ihnen",
            value: "0",
            delta: "Übergabe innerhalb von Wochen",
          },
        ],
      },

      process: {
        eyebrow: "[ ZUSAMMENARBEIT ]",
        headline: "So läuft die Zusammenarbeit ab",
        lead:
          "Vier kurze Schritte. Zuerst kartieren, eng schneiden, eine Sache sauber liefern und nur dort ausbauen, wo es sich trägt — keine Plattform-Rollouts, kein mehrquartaliges Discovery.",
        steps: [
          {
            num: "01",
            title: "Erstgespräch",
            body:
              "Ein fokussiertes erstes Gespräch. Wir hören zu, wo das Team aktuell Zeit verliert und wie der Alltag wirklich aussieht — keine Folien, kein Vertriebs-Pitch.",
            chipA: "30–60 Min.",
            chipB: "Unverbindlich",
          },
          {
            num: "02",
            title: "Prozessanalyse",
            body:
              "Wir nehmen die wichtigsten Workflows End-to-End auf — Übergaben, Tools, Daten, Ausnahmen — und halten sie so klar fest, dass das Team mitprüfen kann.",
            chipA: "AI & Automation Check",
            chipB: "Schriftlicher Plan",
          },
          {
            num: "03",
            title: "Lösungskonzept",
            body:
              "Ein kurzes, konkretes Konzept: Was zuerst automatisiert wird, mit welchen Tools, erwarteter Aufwand und das messbare Ergebnis. Ehrlich auch dort, wo es sich nicht lohnt.",
            chipA: "Umfang · Aufwand · Ergebnis",
            chipB: "Entscheidungsreif",
            chipBHot: true,
          },
          {
            num: "04",
            title: "Umsetzung & Optimierung",
            body:
              "Wir setzen um — allein oder mit Ihrem Team — und iterieren weiter, wo es sich rechnet. Übergabe-Notizen und Quellcode gehören Ihnen ab Tag eins.",
            chipA: "Pilot → Rollout",
            chipB: "Quellcode gehört Ihnen",
          },
        ],
      },

      finalCta: {
        eyebrow: "[ KONTAKT ]",
        title: {
          pre: "Bereit, Ihre Prozesse ",
          italic: "effizienter",
          post: " zu machen?",
        },
        lead:
          "Lassen Sie uns gemeinsam prüfen, welche Aufgaben in Ihrem Unternehmen mit KI und Automatisierung vereinfacht werden können. Keine Verpflichtung nach dem Gespräch — wenn es nicht passt, sagen wir das auch offen.",
        ctaPrimary: "Kostenloses Erstgespräch buchen",
        ctaSecondary: "Wissen lesen",
        trustLine:
          "UNABHÄNGIG · DSGVO-KONFORM · EU-HOSTED · DE · EN · TR",
      },
    },

    aiAutomationCheckPage: {
      hero: {
        metaChip: "AI & AUTOMATION CHECK",
        metaLabel: "[ EINSTIEGS-PAKET · 60–90 MIN ]",
        title: {
          pre: "Finden Sie das ",
          italic: "echte",
          post: " Automatisierungspotenzial in Ihrem Unternehmen",
        },
        lead:
          "Ein fokussiertes 60–90 Minuten Analysegespräch und ein schriftlicher 30-Tage-Plan mit fünf konkreten Automatisierungskandidaten — bewertet nach Aufwand, Nutzen und Risiko. Gedacht als risikoarmer erster Schritt vor jedem größeren Projekt.",
        ctaPrimary: "AI & Automation Check anfragen",
        ctaSecondary: "Zurück zur Übersicht",
      },
      problem: {
        eyebrow: "[ WARUM ES IHN GIBT ]",
        headline: "Die meisten Automatisierungsprojekte scheitern, bevor sie beginnen",
        lead:
          "Nicht weil die Technik nicht funktioniert — sondern weil der falsche Prozess automatisiert wird, oder weil nie aufgeschrieben wurde, was das Team eigentlich tut. Der AI & Automation Check setzt genau hier an.",
        items: [
          "Symptome werden automatisiert statt der Ursachen",
          "KI-Tools werden gekauft, ohne klaren Anwendungsfall",
          "ROI ist nicht messbar, weil es keine Ausgangslage gibt",
          "Es ist unklar, welche Schritte bewusst manuell bleiben sollen",
        ],
      },
      package: {
        eyebrow: "[ WAS ENTHALTEN IST ]",
        headline: "Was im Check enthalten ist",
        bullets: [
          {
            title: "60–90 Minuten Analysegespräch",
            body: "Vor Ort oder remote. Wir hören zu, wie Arbeit aktuell durch das Team fließt — keine Folien.",
          },
          {
            title: "Aufnahme der wichtigsten manuellen Prozesse",
            body: "Wir schreiben die relevanten Workflows so auf, dass das Team mitprüfen kann — nicht im Kopf einer einzelnen Person.",
          },
          {
            title: "5 konkrete Automatisierungspotenziale",
            body: "Ausgewählt aus Ihren echten Prozessen — keine generische KI-Wunschliste.",
          },
          {
            title: "Bewertung nach Aufwand, Nutzen und Risiko",
            body: "Jedes Potenzial bewertet, damit die Leitung priorisieren kann, ohne selbst Tech-Expertise zu brauchen.",
          },
          {
            title: "Klarer 30-Tage-Umsetzungsplan",
            body: "Konkrete nächste Schritte, Tools, Verantwortliche und das erwartete Ergebnis.",
          },
          {
            title: "Optional: Umsetzung eines Pilot-Workflows",
            body: "Wo es sinnvoll ist, setzen wir die erste Automatisierung direkt um — fixer Umfang, fixer Zeitrahmen.",
          },
        ],
      },
      audience: {
        eyebrow: "[ FÜR WEN ]",
        headline: "Für wen der Check geeignet ist",
        items: [
          "Mittelständische Unternehmen, die einen messbaren ersten Schritt wollen",
          "Teams, die KI bereits im Schatten-IT nutzen und Struktur suchen",
          "Operations-Verantwortliche mit zu vielen manuellen Übergaben",
          "Unternehmen, die Microsoft 365 / Power Automate / Make bewerten",
          "Alle, die einen Außenblick wollen: „Was sollten wir überhaupt zuerst automatisieren?“",
        ],
      },
      deliverables: {
        eyebrow: "[ WAS SIE BEKOMMEN ]",
        headline: "Was am Ende in Ihrem Postfach liegt",
        items: [
          "Schriftliche Prozesskarte der besprochenen Workflows",
          "5 bewertete Automatisierungspotenziale",
          "Empfohlene Tools und grobe Aufwandsschätzung je Potenzial",
          "30-Tage-Umsetzungsplan mit Verantwortlichen",
          "Eine kurze Notiz, was bewusst manuell bleiben sollte — und warum",
        ],
      },
      process: {
        eyebrow: "[ ABLAUF ]",
        headline: "So läuft der Check ab",
        steps: [
          { num: "01", title: "Kickoff", body: "Kurzes Vorgespräch zur Abstimmung der Ziele und welcher Prozesse im Scope sind." },
          { num: "02", title: "Analysegespräch", body: "60–90 Minuten mit den Menschen, die die Arbeit tatsächlich machen." },
          { num: "03", title: "Schriftlicher Plan", body: "Innerhalb weniger Arbeitstage erhalten Sie den schriftlichen 30-Tage-Plan." },
          { num: "04", title: "Durchsprache", body: "30 Minuten zur Klärung von Umfang, Aufwand und nächsten Schritten." },
        ],
      },
      faq: {
        eyebrow: "[ FAQ ]",
        headline: "Häufige Fragen",
        items: [
          { q: "Was kostet der AI & Automation Check?", a: "Preis auf Anfrage — abhängig von Umfang und Teamgröße. Nach dem ersten Kurzgespräch geben wir einen fixen Preis." },
          { q: "Wird eine Vertraulichkeitsvereinbarung geschlossen?", a: "Ja — eine Standard-NDA wird vor dem Analysegespräch unterzeichnet." },
          { q: "Ist das nur für Unternehmen, die bereits KI einsetzen?", a: "Nein. Viele Mandate starten ganz ohne KI im Einsatz." },
          { q: "Können wir unsere bestehenden Tools weiter nutzen?", a: "Ja — wo Microsoft 365, Google Workspace, Ihr CRM oder ERP den Workflow tragen, nutzen wir die zuerst." },
          { q: "Was passiert nach dem Check?", a: "Entweder Sie setzen den Plan selbst um, wir setzen gemeinsam einen Pilot um, oder es endet dort. Kein Lock-in." },
        ],
      },
      finalCta: {
        eyebrow: "[ NÄCHSTER SCHRITT ]",
        title: {
          pre: "Finden Sie heraus, ",
          italic: "was sich wirklich lohnt zu automatisieren",
          post: ".",
        },
        lead:
          "Ein Gespräch. Ein schriftlicher Plan. Keine Verpflichtung danach — wir sagen Ihnen lieber, dass es noch nicht der richtige Zeitpunkt ist, als ein Projekt zu starten, das sich nicht trägt.",
        ctaPrimary: "AI & Automation Check anfragen",
        ctaSecondary: "Lieber Erstgespräch buchen",
      },
    },

    leistungen: {
      meta: {
        title: "Leistungen — KI, Automatisierung & digitale Prozesse",
        description:
          "OpSolid Leistungen für mittelständische Unternehmen: KI-Beratung, Prozessautomatisierung, Microsoft 365 Automatisierung, interne Tools und KI-Schulungen. Praxisnah, messbar, datenschutzbewusst.",
      },
      hero: {
        metaChip: "",
        metaLabel: "[ LEISTUNGEN · 2026 ]",
        title: {
          pre: "Leistungen für KI, Automatisierung und ",
          italic: "digitale Prozesse",
          post: "",
        },
        lead:
          "Fünf klar abgegrenzte Leistungsbereiche. Wir wählen das kleinste Engagement, das Ihr Problem löst, liefern es ab — und erweitern nur dort, wo es sich weiterhin rechnet. Keine Plattform-Rollouts, keine Discovery über mehrere Quartale.",
        ctaPrimary: "Erstgespräch buchen",
        ctaSecondary: "Mit dem AI Automation Check starten",
      },
      cards: {
        eyebrow: "[ DAS BIETEN WIR ]",
        headline: "Fünf praxisnahe Leistungsbereiche",
        lead:
          "Jeder Bereich hat eine eigene Seite mit Anwendungsfällen, Tools, Vorgehen und Preisrahmen. Die meisten Projekte starten mit einem AI & Automation Check — der günstigste Weg sicherzustellen, dass wir das Richtige automatisieren.",
        items: [
          {
            slug: "ki-beratung",
            icon: "bot",
            title: "KI-Beratung",
            body:
              "Wir identifizieren KI-Use-Cases, die sich für Ihr Unternehmen wirklich lohnen — wägen Nutzen gegen Risiko ab und liefern eine realistische, entscheidungsreife Roadmap.",
            tag: "USE CASES · RISIKO · ROADMAP",
            linkLabel: "Mehr zu KI-Beratung",
          },
          {
            slug: "prozessautomatisierung",
            icon: "workflow",
            title: "Prozessautomatisierung",
            body:
              "Wiederkehrende Aufgaben Ende-zu-Ende automatisieren. Angebote, Rechnungen, Reports, Dokumentenerstellung, E-Mail-Routing — auf den Tools, die Sie bereits bezahlen.",
            tag: "WORKFLOWS · API · AUTOMATION",
            linkLabel: "Mehr zu Prozessautomatisierung",
          },
          {
            slug: "microsoft-365-automatisierung",
            icon: "plug",
            title: "Microsoft 365 Automatisierung",
            body:
              "Power Automate, Power Apps, Teams, SharePoint, Outlook — so verzahnt, dass Ihr tägliches Werkzeug die Arbeit übernimmt, statt sie nur zu unterstützen.",
            tag: "POWER AUTOMATE · M365 · SHAREPOINT",
            linkLabel: "Mehr zu Microsoft 365 Automatisierung",
          },
          {
            slug: "interne-tools",
            icon: "ship",
            title: "Interne Tools",
            body:
              "Kleine, fokussierte interne Tools dort, wo SaaS nicht passt: Admin-Konsolen, Freigabe-Queues, Dashboards, Wissensdatenbanken — auf Ihrer bestehenden Infrastruktur.",
            tag: "DASHBOARDS · TOOLS · INTEGRATIONEN",
            linkLabel: "Mehr zu internen Tools",
          },
          {
            slug: "ki-schulungen",
            icon: "shield",
            title: "KI-Schulungen & Richtlinien",
            body:
              "Teams lernen, KI sicher und produktiv zu nutzen. Schriftliche Richtlinien, rollenbasierte Playbooks, DSGVO-konformes Setup — keine Schatten-IT.",
            tag: "SCHULUNG · RICHTLINIEN · DSGVO",
            linkLabel: "Mehr zu KI-Schulungen",
          },
        ],
      },
      process: {
        eyebrow: "[ SO ARBEITEN WIR ]",
        headline: "So läuft ein Projekt ab",
        lead:
          "Gleiches Vorgehen in jedem Leistungsbereich: erst kartieren, eng scopen, eine Sache sauber liefern.",
        steps: [
          {
            num: "01",
            title: "Erstgespräch",
            body:
              "30–60 Minuten. Wir hören zu, wo das Team aktuell Zeit verliert und wie der Alltag wirklich aussieht.",
          },
          {
            num: "02",
            title: "Analyse & Vorschlag",
            body:
              "Wir schreiben die relevanten Workflows nieder, bewerten Automatisierungskandidaten und schlagen die kleinste lohnende Maßnahme zuerst vor.",
          },
          {
            num: "03",
            title: "Umsetzung",
            body:
              "Wir bauen es — allein oder mit Ihrem Team — und erweitern nur, wo es sich weiter trägt. Quellcode bleibt bei Ihnen.",
          },
        ],
      },
      faq: {
        eyebrow: "[ FAQ ]",
        headline: "Häufige Fragen zu unseren Leistungen",
        items: [
          {
            q: "Müssen wir uns auf einen Leistungsbereich festlegen?",
            a: "Nein. Die meisten Projekte überschneiden sich über zwei oder drei Bereiche — ein KI-Use-Case braucht meist Automatisierung drumherum, ein internes Tool braucht oft Schulung. Wir scopen, was wirklich Nutzen bringt, nicht was in einen Leistungskatalog passt.",
          },
          {
            q: "Wie wird abgerechnet?",
            a: "Entweder Festpreis pro Lieferung (AI Automation Check, Pilot-Workflow, Schulungstag) oder als kleiner monatlicher Retainer für laufende Iteration. Preis auf Anfrage — abhängig von Umfang und Teamgröße.",
          },
          {
            q: "Können wir unsere bestehenden Tools weiter nutzen?",
            a: "Ja. Microsoft 365, Google Workspace, Ihr CRM, Ihr ERP — wir nutzen, was Sie bereits bezahlen, überall dort, wo es den Workflow tragen kann.",
          },
          {
            q: "Wo werden die Daten gehostet?",
            a: "Standardmäßig nur EU — Frankfurt oder andere EU-Regionen. AVV (Auftragsverarbeitungsvertrag) wird vor jedem Projekt unterzeichnet, das Kundendaten berührt.",
          },
          {
            q: "Bauen Sie von Grund auf oder nutzen Sie Plattformen?",
            a: "Beides — wo Power Automate, Make oder n8n den Job erledigen können, nutzen wir sie. Wo nicht, bauen wir kleine Python-Services, Next.js-Tools oder maßgeschneiderte Integrationen.",
          },
        ],
      },
      finalCta: {
        eyebrow: "[ ERSTER SCHRITT ]",
        title: {
          pre: "Unsicher, welche Leistung ",
          italic: "am besten passt",
          post: "?",
        },
        lead:
          "Starten Sie mit dem AI & Automation Check oder einem kostenlosen Erstgespräch. Wir sagen Ihnen, welcher Bereich bei Ihnen den größten Hebel hat — auch wenn es nicht der ist, den Sie gefragt haben.",
        ctaPrimary: "AI Automation Check anfragen",
        ctaSecondary: "Erstgespräch buchen",
      },
    },

    services: {
      shared: {
        whatWeDoEyebrow: "[ DAS MACHEN WIR ]",
        useCasesEyebrow: "[ ANWENDUNGSFÄLLE ]",
        toolsEyebrow: "[ TOOLS & STACK ]",
        processEyebrow: "[ SO LÄUFT ES ]",
        faqEyebrow: "[ FAQ ]",
        finalCtaEyebrow: "[ NÄCHSTER SCHRITT ]",
        backToServices: "Alle Leistungen",
      },
      kiBeratung: {
        slug: "ki-beratung",
        meta: {
          title: "KI-Beratung für Mittelstand — Use Cases, Risiko, Roadmap",
          description:
            "KI-Beratung für mittelständische Unternehmen in Deutschland. Wir identifizieren lohnende KI-Use-Cases, wägen Nutzen gegen Risiko ab und liefern eine entscheidungsreife Roadmap. Datenschutzbewusst.",
        },
        hero: {
          metaChip: "KI-BERATUNG",
          metaLabel: "[ LEISTUNG · 01 / 05 ]",
          title: {
            pre: "Welche KI lohnt sich für ",
            italic: "Ihr Unternehmen",
            post: " wirklich?",
          },
          lead:
            "Aktuell wird in jede Abteilung KI verkauft — aber nur wenige Use Cases sind den Aufwand, die Kosten und das Risiko wert. Wir helfen Ihnen, den Unterschied zu erkennen, und liefern eine Roadmap, die Sie vor der Geschäftsführung wirklich verteidigen können.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
        whatWeDo: {
          headline: "So sieht KI-Beratung mit OpSolid aus",
          bullets: [
            "Drei bis fünf KI-Use-Cases identifizieren, die zu Ihrem Unternehmen passen — und die unpassenden klar ausschließen.",
            "Jeden Use Case nach erwartetem Nutzen, Implementierungsaufwand und Betriebsrisiko bewerten.",
            "Eine 6–12-monatige KI-Roadmap mit klaren Verantwortlichen, Kosten und Entscheidungspunkten schriftlich festhalten.",
            "DSGVO-konformen KI-Einsatz aufsetzen: Modellwahl, Datenhoheit und kurze Unternehmensrichtlinie.",
          ],
        },
        useCases: {
          headline: "Was wir bereits beraten oder gescopet haben",
          items: [
            {
              title: "Dokumenten- und Vertragsanalyse",
              body: "Lange PDFs vorklassifizieren, Klauseln extrahieren, Fristen sichtbar machen — der Mensch prüft die Zusammenfassung, nicht das Dokument.",
            },
            {
              title: "Interne Wissenssuche",
              body: "Eigene Richtlinien, FAQs und SharePoint indexieren — Mitarbeitende bekommen Antworten aus Ihren Dokumenten, nicht aus dem öffentlichen ChatGPT.",
            },
            {
              title: "Angebots- und Proposal-Entwürfe",
              body: "Maßgeschneiderte Angebote aus Vorlage, CRM-Datensatz und kurzem Briefing entwerfen — der Vertrieb prüft, statt jedes Mal neu zu schreiben.",
            },
            {
              title: "Support-Triage und Routing",
              body: "Eingehende Anfragen nach Thema und Dringlichkeit klassifizieren, bevor sie einer menschlichen Queue zugewiesen werden.",
            },
          ],
        },
        tools: {
          headline: "Modelle, Anbieter und Frameworks",
          items: [
            "OpenAI · GPT-4-Familie",
            "Anthropic · Claude",
            "Microsoft Copilot · Azure OpenAI",
            "Mistral · Open-Source-Optionen",
            "Retrieval-Augmented Generation (RAG)",
            "Vektor-Datenbanken · pgvector · Qdrant",
            "DSGVO-konformes EU-Hosting",
          ],
        },
        process: {
          headline: "So läuft eine KI-Beratung ab",
          steps: [
            { num: "01", title: "Discovery", body: "Kurzes Gespräch, um Team, Daten und Zielsetzung zu verstehen." },
            { num: "02", title: "Use-Case-Bewertung", body: "Workshop und schriftliche Analyse: Welche KI-Use-Cases sind für Sie lohnend, welche nicht." },
            { num: "03", title: "Roadmap & Richtlinie", body: "Entscheidungsreife 6–12-monatige Roadmap plus kurze schriftliche KI-Richtlinie für das Unternehmen." },
          ],
        },
        faq: {
          headline: "KI-Beratung — häufige Fragen",
          items: [
            { q: "Müssen wir bereits „KI-ready“ sein?", a: "Nein. Die meisten Kunden sind das nicht — genau deshalb braucht es diese Arbeit, bevor Geld für Tools ausgegeben wird." },
            { q: "Verkaufen Sie KI-Tools?", a: "Nein. Wir sind unabhängig — wir empfehlen, was passt, einschließlich „nutzen Sie das, was Sie haben“ oder „machen Sie das noch nicht“." },
            { q: "Lässt sich KI DSGVO-konform einsetzen?", a: "Ja, mit der richtigen Modellwahl, EU-Hosting und einer schriftlichen Richtlinie. Wir helfen, das von Anfang an aufzusetzen." },
            { q: "Wie lange dauert eine Beratung?", a: "In der Regel zwei bis vier Wochen für Analyse und Roadmap. Implementierungszeiträume sind separat und vom Scope abhängig." },
          ],
        },
        finalCta: {
          title: { pre: "Finden Sie heraus, welche KI-Use-Cases ", italic: "sich für Sie lohnen", post: "." },
          lead: "Ein Gespräch. Eine schriftliche Roadmap. Kein Plattform-Pitch.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
      },
      prozessautomatisierung: {
        slug: "prozessautomatisierung",
        meta: {
          title: "Prozessautomatisierung für Mittelstand — Power Automate, Make, Python",
          description:
            "Manuelle Workflows automatisieren — Angebote, Rechnungen, Dokumentenerstellung, E-Mail-Routing, Datensynchronisation. Auf den Tools, die Sie bereits bezahlen. DSGVO-nativ.",
        },
        hero: {
          metaChip: "PROZESSAUTOMATISIERUNG",
          metaLabel: "[ LEISTUNG · 02 / 05 ]",
          title: {
            pre: "Manuelle Aufgaben, die ",
            italic: "niemand mehr von Hand",
            post: " machen sollte",
          },
          lead:
            "Angebote, die einen halben Tag dauern. Reports, die jeden Montag neu gebaut werden. Daten, die zwischen Excel, CRM und E-Mail kopiert werden. Wir kartieren diese Workflows, automatisieren das, was sich lohnt — und lassen den Rest bei den Menschen.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
        whatWeDo: {
          headline: "So sieht Prozessautomatisierung mit OpSolid aus",
          bullets: [
            "Workflow Ende-zu-Ende kartieren — Übergaben, Tools, Daten, Ausnahmen — so klar, dass das Team es auditieren kann.",
            "Identifizieren, welche Schritte sich zu automatisieren lohnen — und welche bewusst manuell bleiben sollten.",
            "Automatisierung auf Power Automate, Make, n8n, Python oder eigenem Code bauen — was am besten passt.",
            "Überwachung, Dokumentation und Übergabe, damit Ihr Team den Workflow danach selbst betreibt.",
          ],
        },
        useCases: {
          headline: "Workflows, die wir bereits automatisiert haben",
          items: [
            {
              title: "Angebots- und Dokumentenerstellung",
              body: "Vorlagen aus CRM-Daten gefüllt, im Workflow freigegeben und versendet — Angebote verlassen das Haus am selben Tag.",
            },
            {
              title: "E-Mail-Klassifizierung und Routing",
              body: "Eingehende Mails nach Thema getaggt und in den richtigen Posteingang oder Ticket-Queue gepusht — keine manuelle Triage mehr.",
            },
            {
              title: "Reporting- und Excel-Automatisierung",
              body: "Wiederkehrende Reports einmal gebaut und automatisch neu erstellt — KPIs sind fertig, wenn das Meeting startet.",
            },
            {
              title: "CRM-/ERP-Datensynchronisation",
              body: "Daten fließen einmal zwischen Systemen und gleichen sich selbst ab — keine Doppelerfassung.",
            },
          ],
        },
        tools: {
          headline: "Tools, mit denen wir automatisieren",
          items: [
            "Microsoft Power Automate",
            "Make (Integromat)",
            "n8n · selbst gehostet",
            "Zapier · wo es passt",
            "Python · eigene Skripte",
            "REST-APIs · Webhooks",
            "PostgreSQL · Dateispeicher · Queues",
          ],
        },
        process: {
          headline: "So läuft ein Automatisierungs-Projekt ab",
          steps: [
            { num: "01", title: "Kartieren", body: "Workshop mit dem Team, das die Arbeit wirklich macht. Wir schreiben den Workflow nieder, wie er wirklich läuft." },
            { num: "02", title: "Bauen", body: "Wir implementieren die erste Pilot-Automatisierung — meist innerhalb von zwei bis vier Wochen." },
            { num: "03", title: "Betreiben", body: "Dokumentation, Übergabe und eine kurze Phase der Iteration, bevor Sie es übernehmen." },
          ],
        },
        faq: {
          headline: "Prozessautomatisierung — häufige Fragen",
          items: [
            { q: "Was ist ein typisches erstes Projekt?", a: "Ein einzelner Workflow mit großem Hebel — Angebotserstellung, E-Mail-Triage oder ein Wochenreport. Fester Scope, zwei bis vier Wochen." },
            { q: "Müssen wir unsere Tools ersetzen?", a: "Nein. Wir automatisieren auf dem, was Sie haben — Microsoft 365, Google Workspace, Ihr CRM, Ihr ERP." },
            { q: "Was, wenn sich der Prozess später ändert?", a: "Die meisten Automatisierungen sind so dokumentiert, dass Ihre eigene IT sie anpassen kann. Für größere Änderungen gibt es einen kleinen monatlichen Retainer." },
            { q: "Ist es sicher, kritische Prozesse zu automatisieren?", a: "Ja — mit sauberem Logging, Fehlerbehandlung und manueller Rückfallebene. Wir designen für den Fehlerfall, nicht nur für den Idealpfad." },
          ],
        },
        finalCta: {
          title: { pre: "Wählen Sie den ersten Workflow, ", italic: "der sich lohnt", post: "." },
          lead: "Wir kartieren ihn, bewerten ihn und sagen Ihnen, ob er den Aufwand wert ist.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
      },
      microsoft365: {
        slug: "microsoft-365-automatisierung",
        meta: {
          title: "Microsoft 365 Automatisierung — Power Automate, SharePoint, Teams",
          description:
            "Workflows in Microsoft 365 automatisieren: Power Automate Flows, SharePoint-Dokumentenbibliotheken, Teams-Freigaben, Outlook-Routing. EU-gehostet, datenschutzbewusst.",
        },
        hero: {
          metaChip: "MICROSOFT 365 AUTOMATISIERUNG",
          metaLabel: "[ LEISTUNG · 03 / 05 ]",
          title: {
            pre: "Microsoft 365 ist längst da — ",
            italic: "jetzt soll es für Sie arbeiten",
            post: "",
          },
          lead:
            "Teams, SharePoint, Outlook und Power Automate sind bereits bezahlt. Mit dem richtigen Setup ersetzen sie die meisten Drittanbieter-Tools, die Sie sonst zusätzlich kaufen würden — weniger Abos, eine Identität, ein Audit-Trail.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
        whatWeDo: {
          headline: "So sieht Microsoft 365 Automatisierung mit OpSolid aus",
          bullets: [
            "Ihren aktuellen Microsoft-365-Tenant auditieren und Automatisierungspotenziale identifizieren, die das Team noch nicht nutzt.",
            "Power Automate Flows für Freigaben, Dokumentenerstellung, E-Mail-Routing und Benachrichtigungen bauen.",
            "SharePoint, Teams, Outlook und Excel so verbinden, dass Daten an einem Ort leben — nicht in sieben Kopien.",
            "Microsoft 365 Copilot verantwortungsbewusst aufsetzen — mit rollenbasiertem Zugriff und klaren Richtlinien.",
          ],
        },
        useCases: {
          headline: "Microsoft-365-Workflows, die wir gebaut haben",
          items: [
            {
              title: "Freigabe-Workflows in Teams",
              body: "Urlaubsanträge, Reisekosten, Dokumentenfreigabe — in Teams freigegeben, in SharePoint protokolliert.",
            },
            {
              title: "Dokumentenerstellung aus SharePoint-Listen",
              body: "Angebote, Verträge und Reports aus einer SharePoint-Liste generiert — kein Copy-Paste aus Excel.",
            },
            {
              title: "Outlook-E-Mail-Parsing und -Routing",
              body: "Eingehende Bestellungen, Support-Anfragen oder Rechnungen automatisch geparst und ins richtige System gepusht.",
            },
            {
              title: "Microsoft 365 Copilot Rollout",
              body: "Richtlinien, rollenbasierter Zugriff und kurze Schulung, damit Copilot tatsächlich genutzt wird — und zwar sicher.",
            },
          ],
        },
        tools: {
          headline: "Microsoft-Technologien, mit denen wir arbeiten",
          items: [
            "Microsoft Power Automate",
            "Power Apps · Low-Code-Apps",
            "SharePoint Online · Lists · Libraries",
            "Microsoft Teams · Bots · Approvals",
            "Outlook · Exchange",
            "Microsoft Graph API",
            "Microsoft 365 Copilot",
            "Entra ID (Azure AD)",
          ],
        },
        process: {
          headline: "So läuft ein Microsoft-365-Projekt ab",
          steps: [
            { num: "01", title: "Tenant-Review", body: "Wir schauen uns Ihre aktuellen Lizenzen, Security-Setup und Tools an — und finden, was untergenutzt ist." },
            { num: "02", title: "Erster Flow", body: "Wir bauen den ersten Power-Automate-Flow oder Teams-Workflow als Pilot — meist innerhalb von zwei Wochen." },
            { num: "03", title: "Rollout", body: "Breiterer Rollout mit Dokumentation, Übergabe und optionaler Schulung für Ihre IT." },
          ],
        },
        faq: {
          headline: "Microsoft 365 Automatisierung — häufige Fragen",
          items: [
            { q: "Brauchen wir Power-Automate-Premium-Lizenzen?", a: "Manchmal — aber die meisten sinnvollen Flows funktionieren mit den Standard-Microsoft-365-Plänen. Wir sagen Ihnen, wann Premium tatsächlich nötig ist." },
            { q: "Lohnt sich Microsoft 365 Copilot?", a: "Für manche Teams ja, für andere nein. Wir helfen Ihnen zu entscheiden, bevor Sie die Lizenzen kaufen." },
            { q: "Können Sie mit unserer IT-Abteilung zusammenarbeiten?", a: "Ja — die meisten Projekte laufen gemeinsam mit Ihrer IT oder einem Ihrer bestehenden Microsoft-Partner. Wir ergänzen, wir ersetzen nicht." },
            { q: "Ist das DSGVO-konform?", a: "Microsoft 365 im EU-Tenant-Setup ist DSGVO-konform. Wir konfigurieren es korrekt und dokumentieren die Datenflüsse." },
          ],
        },
        finalCta: {
          title: { pre: "Holen Sie mehr aus Microsoft 365 heraus, ", italic: "ohne weitere Tools zu kaufen", post: "." },
          lead: "Ein Gespräch. Wir sagen Ihnen, was sich in Ihrem aktuellen Tenant zu automatisieren lohnt — bevor Sie ein weiteres Abo abschließen.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
      },
      interneTools: {
        slug: "interne-tools",
        meta: {
          title: "Interne Tools & Integrationen — Admin-Panels, Dashboards",
          description:
            "Kleine, fokussierte interne Tools für den Mittelstand: Admin-Konsolen, Freigabe-Queues, Dashboards, Wissensdatenbanken. Auf Systemen, die Sie bereits betreiben. EU-gehostet.",
        },
        hero: {
          metaChip: "INTERNE TOOLS",
          metaLabel: "[ LEISTUNG · 04 / 05 ]",
          title: {
            pre: "Wo SaaS nicht passt, ",
            italic: "macht ein kleines Custom-Tool",
            post: " den Job",
          },
          lead:
            "Nicht jeder interne Job braucht eine 500-€-pro-Monat-Plattform. Manchmal löst ein kleines Custom-Admin-Panel, eine Freigabe-Queue oder ein Dashboard das Problem besser, günstiger und schneller — und bleibt Ihr Eigentum.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
        whatWeDo: {
          headline: "Was wir bauen",
          bullets: [
            "Interne Admin-Konsolen für Operations-Teams — klar, fokussiert, ohne Bloat.",
            "Dashboards auf Basis Ihrer bestehenden Datenquellen — KPIs, Ausnahmen und Alerts in einer Ansicht.",
            "Freigabe-Queues, interne Formulare, Eskalations-Flows, die zu Ihrem realen Prozess passen.",
            "Interne Wissensdatenbanken — Suche über Ihre eigenen Dokumente, Richtlinien und FAQs.",
          ],
        },
        useCases: {
          headline: "Interne Tools, die wir gebaut haben",
          items: [
            {
              title: "Operations-Admin-Konsole",
              body: "Auftragsübersicht, Ausnahmen, Kundennotizen — ein Ort statt drei Tabs.",
            },
            {
              title: "Internes KPI-Dashboard",
              body: "Tages-, Wochen- und Monatszahlen aus CRM, ERP und Finanzsystem — ohne dass ein Analyst die Tabelle jede Woche neu baut.",
            },
            {
              title: "Freigabe- und Eskalations-Queue",
              body: "Angebote, Verträge oder Erstattungen in Queue, geroutet und mit Audit-Trail freigegeben.",
            },
            {
              title: "Interne KI-Wissensdatenbank",
              body: "Eigene Dokumente, Richtlinien und FAQs durchsuchen — Antworten bleiben in Ihrer Organisation.",
            },
          ],
        },
        tools: {
          headline: "Tech-Stack",
          items: [
            "Next.js · React · TypeScript",
            "Node.js · Python",
            "PostgreSQL · Supabase",
            "REST · GraphQL · Webhooks",
            "Auth0 · Microsoft Entra ID · SSO",
            "Hetzner · IONOS · Vercel · EU-Hosting",
            "GitHub · CI/CD · Audit-Logs",
          ],
        },
        process: {
          headline: "So läuft ein Internes-Tool-Projekt ab",
          steps: [
            { num: "01", title: "Spezifikation", body: "Kurzer Workshop, um festzuhalten, was das Tool können muss — und was nicht." },
            { num: "02", title: "Bauen", body: "Pilotversion in drei bis sechs Wochen. Echte Nutzer, echte Daten, schnelle Iteration." },
            { num: "03", title: "Betreiben", body: "Übergabe mit Dokumentation, Quellcode und optionalem kleinen Retainer für laufende Iteration." },
          ],
        },
        faq: {
          headline: "Interne Tools — häufige Fragen",
          items: [
            { q: "Ist ein Custom-Tool wirklich günstiger als SaaS?", a: "Bei spezifischen, engen Problemen — oft ja. Besonders, wenn die SaaS-Adoption niedrig ist oder das Tool zu einem einzigartigen Prozess passen muss." },
            { q: "Wem gehört der Code?", a: "Ihnen. Quellcode, Schemas und Runbooks gehören ab Tag eins Ihnen." },
            { q: "Was, wenn wir es später ändern wollen?", a: "Können Sie — intern, mit einem anderen Anbieter oder mit uns. Kein Lock-in." },
            { q: "Kann es in unsere bestehenden Systeme integrieren?", a: "Ja — das ist meist der ganze Punkt. CRM, ERP, Microsoft 365, Ihr Warenwirtschaftssystem." },
          ],
        },
        finalCta: {
          title: { pre: "Holen Sie sich ein Tool, ", italic: "das zu Ihrem Team passt", post: "." },
          lead: "Ein Gespräch. Wir sagen Ihnen, ob ein internes Custom-Tool der richtige Schritt ist — oder ob eine konfigurierte SaaS reicht.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
      },
      kiSchulungen: {
        slug: "ki-schulungen",
        meta: {
          title: "KI-Schulungen & Richtlinien für den Mittelstand — Sichere, produktive KI-Nutzung",
          description:
            "Praxisnahe KI-Schulungen für KMU-Teams: Wie KI sicher und produktiv im Arbeitsalltag genutzt wird. Schriftliche Richtlinien, rollenbasierte Playbooks, DSGVO-konformes Setup.",
        },
        hero: {
          metaChip: "KI-SCHULUNGEN",
          metaLabel: "[ LEISTUNG · 05 / 05 ]",
          title: {
            pre: "Ihr Team. ",
            italic: "Sicherer und schneller",
            post: " mit KI.",
          },
          lead:
            "Die Hälfte Ihres Teams nutzt ChatGPT bereits in Schatten-IT. Ohne Richtlinien ist das ein Datenschutz- und ein Qualitätsproblem. Mit Richtlinien ist es ein Produktivitätsschub. Wir helfen, die Regeln aufzusetzen und die Menschen zu schulen.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
        whatWeDo: {
          headline: "Was eine KI-Schulung abdeckt",
          bullets: [
            "Praxisnahe KI-Workshops für Alltagsaufgaben — Entwürfe, Zusammenfassungen, Klassifizierung, Strukturierung.",
            "Rollenbasierte Playbooks für Vertrieb, Support, Finance, HR — keine generischen „So sprichst du mit ChatGPT“-Folien.",
            "Schriftliche KI-Richtlinien und Acceptable-Use-Policy für das Unternehmen — kurz, lesbar, durchsetzbar.",
            "DSGVO-konformes KI-Setup: Modellwahl, Datenhoheit, Audit-Trail und was Mitarbeitende einfügen dürfen und was nicht.",
          ],
        },
        useCases: {
          headline: "Schulungsformate, die wir bereits durchgeführt haben",
          items: [
            {
              title: "Unternehmensweiter KI-Primer",
              body: "Halbtägige Sitzung für alle Mitarbeitenden: Was KI kann und was nicht, wo sie hilft, wo sie schadet.",
            },
            {
              title: "Abteilungsspezifische Workshops",
              body: "Vertrieb, Support, Finance, HR — jeweils mit rollenspezifischen Prompts und Beispiel-Workflows.",
            },
            {
              title: "Leadership-Briefing",
              body: "Fokussierte zweistündige Session für die Führungsebene — strategische Implikationen, nicht Prompt-Syntax.",
            },
            {
              title: "KI-Richtlinien-Rollout",
              body: "Schriftliche Policy, internes Q&A und kurzes E-Learning-Modul, damit die Regeln auch wirklich greifen.",
            },
          ],
        },
        tools: {
          headline: "Tools und Plattformen, auf denen wir schulen",
          items: [
            "ChatGPT · GPT-4-Familie",
            "Microsoft 365 Copilot",
            "Claude · Anthropic",
            "Google Gemini · Workspace",
            "Notion AI · Slack AI",
            "Interne RAG- / Chat-Assistenten",
            "DSGVO-Best-Practice · Audit-Logging",
          ],
        },
        process: {
          headline: "So läuft eine Schulung ab",
          steps: [
            { num: "01", title: "Audit", body: "Kurze Interview-Runde: Wer nutzt schon KI, wie, und wo liegen die Risiken." },
            { num: "02", title: "Anpassen", body: "Wir passen die Schulung an Ihre Branche, Ihre Tools und Ihre echten Use Cases an — keine Standardfolien." },
            { num: "03", title: "Ausrollen", body: "Workshops, schriftliche Richtlinie, internes Q&A — und optionales Follow-up nach acht Wochen." },
          ],
        },
        faq: {
          headline: "KI-Schulungen — häufige Fragen",
          items: [
            { q: "Wie lange dauert eine typische Schulung?", a: "Ein halber Tag für einen unternehmensweiten Primer; ein bis zwei volle Tage für abteilungsspezifische Deep-Dives." },
            { q: "Schulen Sie auf Deutsch?", a: "Ja — Deutsch und Englisch. Türkisch auf Anfrage." },
            { q: "Was ist der Unterschied zu einem Online-Kurs?", a: "Wir schulen an Ihren echten Workflows, Tools und Daten — nicht an hypothetischen Beispielen. Menschen erinnern sich an das, was sie wirklich genutzt haben." },
            { q: "Schreiben Sie auch die KI-Richtlinie?", a: "Ja — kurz, lesbar, durchsetzbar. Auf Ihre Branche und Tools zugeschnitten, kein 30-seitiges Rechtsdokument." },
          ],
        },
        finalCta: {
          title: { pre: "Helfen Sie Ihrem Team, KI ", italic: "sicher und produktiv", post: " zu nutzen." },
          lead: "Ein Gespräch. Wir schlagen Ihnen ein Schulungsformat vor, das wirklich zu Ihrem Team passt — kein Standard-Webinar.",
          ctaPrimary: "Erstgespräch buchen",
          ctaSecondary: "Mit dem AI Automation Check starten",
        },
      },
    },

    voiceAgent: {
      hero: {
        metaChip: "VOICE AGENT",
        metaLabel: "[ PRODUCT · 01 ]",
        title: {
          pre: "Jeden Anruf in ",
          italic: "dreißig Sekunden",
          post: " oder weniger beantworten — rund um die Uhr",
        },
        lead:
          "Ein Voice Agent, den Ihre Kunden nicht von einem Junior-Dispatcher unterscheiden können. Routet nach Intent, bucht in Ihren Kalender, übergibt warm an Menschen, wenn das Skript endet. Auf Retell oder Vapi, end-to-end auditiert, auf Ihrem eigenen Playbook trainiert.",
        ctaPrimary: "Pilot buchen",
        ctaSecondary: "Live-Call anhören",
        features: [
          {
            label: "LATENCY",
            value: "<800",
            unit: "ms p50",
            sub: "end-to-end · in Echtzeit",
          },
          {
            label: "LANGUAGES",
            value: "DE · EN · TR",
            unit: "",
            sub: "auto-erkannt",
          },
          {
            label: "UPTIME",
            value: "99,9",
            unit: "% Ziel",
            sub: "Retell SLA · herstellergemessen",
          },
        ],
      },
      flow: {
        eyebrow: "[ GESPRÄCHSABLAUF ]",
        headline: "Jeder Anruf, vier Züge",
        lead:
          "Der Agent ist deterministisch, wo er es sein muss — Identität, Terminvergabe, Übergabe — und konversationell, wo er es sein darf. Keine offene Chat-Runde, die Richtlinien erfindet.",
        steps: [
          {
            num: "01 · GREET",
            title: "Abheben beim ersten Klingeln.",
            body:
              "Einstiegssatz in der Stimme Ihrer Marke. Sprache wird anhand des ersten Satzes automatisch erkannt.",
          },
          {
            num: "02 · CLASSIFY",
            title: "Routen nach Intent, nicht Menü.",
            body:
              "Buchung, Support, Disposition, Lieferung, Notfall. Gemappt auf die tatsächlichen Queues Ihres Teams.",
          },
          {
            num: "03 · RESOLVE",
            title: "Die Sache erledigen, den Eintrag schreiben.",
            body:
              "Bucht in Cal.com, aktualisiert das CRM, postet in den Ops-Kanal. Jede Aktion mit Trace-ID protokolliert.",
          },
          {
            num: "04 · HANDOFF",
            title: "Eskalieren, bevor es scheitert.",
            body:
              "Wenn Confidence sinkt oder der Intent neu ist, warme Übergabe an einen Menschen mit vollem Transkript-Kontext.",
          },
        ],
      },
      spec: {
        eyebrow: "[ TECHNISCHE SPEC ]",
        headline: "Gebaut auf Werkzeugen, die Sie öffnen und prüfen können",
        lead:
          "Keine geschlossenen Preisstufen. Jede Schicht ist austauschbar, jede Einstellung wird auf Ihrer Seite versioniert.",
        rows: [
          { label: "Plattform", value: "Nach Ihrer Vorgabe eingerichtet" },
          { label: "Spracherkennung", value: "Mehrsprachig, in Echtzeit" },
          { label: "Sprachverständnis", value: "Führende Produktionsmodelle; bei Bedarf on-premise" },
          { label: "Sprachausgabe", value: "Auf Ihre Marke abgestimmter Klang" },
          { label: "Telefonie", value: "Deutsche Rufnummer · AV-Vertrag" },
          { label: "Integrationen", value: "Cal.com, HubSpot, Pipedrive, SAP und individuelle Anbindungen" },
          { label: "Datenresidenz", value: "EU-west · Frankfurt · keine US-Subprozessoren" },
          { label: "Übergabezeit", value: "Zwei Wochen. Einstellungen, Daten und Nummern portabel." },
        ],
      },
    },

    digitalCard: {
      hero: {
        metaChip: "OPSO SMART",
        metaLabel: "[ OPSO SMART · 02 ]",
        title: {
          pre: "Eine Visitenkarte, ",
          italic: "die behalten wird",
          post: "",
        },
        lead:
          "Tap-to-share NFC mit QR-Fallback. Als gefräste Metallkarte oder Wallet-Pass. Kontaktdaten, Kalenderlink und Portfolio werden zentral aktualisiert — ohne neue Druckauflage, wenn jemand die Rolle wechselt.",
        ctaPrimary: "Muster bestellen",
        ctaSecondary: "Templates ansehen",
        features: [
          {
            label: "FORMAT",
            value: "Digitale Karte",
            sub: "NFC · QR · Link",
          },
          {
            label: "PROTOCOL",
            value: "NFC + QR",
            sub: "NDEF · vCard",
          },
          {
            label: "PHYSICAL",
            value: "Brass · Matt",
            sub: "→ Demnächst",
          },
        ],
      },
      templates: {
        eyebrow: "[ BRANCHENVORLAGEN ]",
        headline: "Ausgangspunkte, keine Zwangsjacken",
        lead:
          "Vorlagenlayouts für Recht, Medizin, Handwerk und Gastronomie — jede mit den Kontaktfeldern, Compliance-Angaben und Kalenderintegrationen, die in der Branche täglich gebraucht werden. Jedes Layout ist ein Ausgangspunkt zum Forken und Anpassen, kein festes Theme.",
        items: [
          {
            sector: "LAW",
            name: "Anja Weber",
            role: "Partnerin · Corporate Law",
            code: "LAW · HAM",
            cls: "sector-law",
          },
          {
            sector: "CLINIC",
            name: "Dr. Martin Bauer",
            role: "Zahnarzt · Privatpraxis",
            code: "CLINIC · BER",
            cls: "sector-clinic",
          },
          {
            sector: "TRADES",
            name: "Jan Meister",
            role: "Meisterbetrieb · Sanitär",
            code: "TRADES · FRA",
            cls: "sector-trades",
          },
          {
            sector: "HOSP",
            name: "Sofia Aydın",
            role: "Sommelière · Fine Dining",
            code: "HOSP · IST",
            cls: "sector-hosp",
          },
        ],
      },
      howItWorks: {
        eyebrow: "[ FUNKTIONSWEISE ]",
        headline: "Drei Schichten. Ein Tippen",
        lead:
          "Die Hardware wird einmal versandt. Alles hinter dem Tippen wird in Ihrem Dashboard aktualisiert — nicht beim Drucker.",
        steps: [
          {
            num: "01",
            title: "Tippen oder scannen",
            body:
              "NFC löst auf jedem Handy innerhalb von 4 cm aus. QR-Fallback auf der Rückseite für ältere Geräte und Druckmaterial.",
          },
          {
            num: "02",
            title: "Landen Sie auf Ihrem Portal",
            body:
              "Eine einzige gehostete Seite — vCard-Download, Terminbuchung, Portfolio-Links und alles andere, was die Branche braucht.",
          },
          {
            num: "03",
            title: "Zentral bearbeiten",
            body:
              "Neue Rolle, neue Nummer, neue Verfügbarkeit — einmal ändern, wirkt auf jede Karte da draußen.",
          },
        ],
      },
    },

    contact: {
      hero: {
        metaChip: "BOOKING OPEN · 2026 Q2",
        metaLabel: "[ KONTAKT ]",
        title: {
          pre: "Dreißig Minuten. ",
          italic: "Ein schriftlicher Plan",
          post: "",
        },
        lead:
          "Ein kurzes Gespräch. Ein Operations-Walkthrough, eine klare Einschätzung, was automatisiert werden sollte und was nicht, und eine schriftliche Zusammenfassung innerhalb von 48 Stunden in Ihrem Posteingang — ob das Mandat weitergeht oder nicht.",
        contacts: [],
        trust: [],
      },
      form: {
        title: "Discovery-Call buchen",
        meta: "FORM · 01",
        fields: {
          name: { label: "Name", placeholder: "Ihr vollständiger Name" },
          company: { label: "Unternehmen", placeholder: "Betreibende Einheit" },
          email: { label: "E-Mail", placeholder: "sie@firma.de" },
          phone: { label: "Telefon (optional)", placeholder: "+49 …" },
          interest: { label: "Interesse an" },
          message: {
            label: "Was liegt auf Ihrem Operations-Floor?",
            placeholder:
              "Ein, zwei Sätze dazu, was manuell ist, was fragil ist, woran Sie aufhören möchten zu denken.",
          },
        },
        topics: [
          { key: "automation", label: "Workflow-Automatisierung" },
          { key: "integration", label: "Systemintegration" },
          { key: "voice", label: "Voice Agent" },
          { key: "card", label: "Digital Card" },
          { key: "kutasia", label: "Kutasia" },
          { key: "other", label: "Etwas anderes" },
        ],
        legal:
          "Anfragen erreichen uns direkt. Wir nutzen keine Drittanbieter-Analyse; Sie kommen auf keine Marketingliste, und es gibt kein automatisches Follow-up nach 14 Tagen.",
        submitCta: "Anruf anfragen",
        success: "Danke — wir antworten innerhalb von 48 Stunden.",
        error: "Etwas ging schief. Versuchen Sie es erneut oder schreiben Sie direkt.",
      },
    },

    blog: {
      head: {
        eyebrow: "[ JOURNAL · VOL. 0 ]",
        title: {
          pre: "Notizen vom ",
          italic: "Operations-Floor",
          post: "",
        },
        intro:
          "Feldnotizen, Mandatsberichte und gelegentliche klare Meinungen. Die ersten Stücke sind in Arbeit — abonnieren Sie unten, um zu erfahren, wann sie erscheinen.",
      },
      emptyFeature: {
        tag: "IN ARBEIT · LANGFORM",
        headline:
          "Fokussierte Automatisierung: was das Geschäft bewegt vs. was nur im Deck gut aussieht",
        lede:
          "Eröffnungsstück des Journals. Entwurf in Arbeit — darüber, wie ein fokussierter Workflow mit weniger als 20 Zeilen einen ERP-Austausch bei den Messgrößen schlägt, die zählen.",
        meta: "D. PIHA · GEPLANT · 15 MIN",
      },
      series: {
        title: "Praktische Playbooks für Automatisierung",
        body:
          "Eine laufende Serie. Die ersten sechs Stücke sind geplant — die zweite Hälfte im nächsten Quartal. Keine E-Mail-Blasts, keine Drip-Kampagnen — nur eine Notiz, wenn etwas landet.",
        placeholder: "sie@firma.de",
        cta: "Abonnieren",
        legal: "Eine E-Mail pro Artikel. Abmeldung mit einem Klick.",
        success: "✓ Danke — wir melden uns, sobald ein neuer Beitrag erscheint.",
        error: "Senden fehlgeschlagen. Bitte später erneut versuchen.",
      },
      labels: {
        featured: "EMPFOHLEN",
        note: "NOTIZ",
        minutesSuffix: "MIN",
      },
    },

    legal: {
      impressum: {
        eyebrow: "[ LEGAL · IMPRESSUM ]",
        title: "Impressum",
      },
      privacy: {
        eyebrow: "[ LEGAL · DATENSCHUTZ ]",
        title: "Datenschutz",
      },
    },

    kutasia: {
      hero: {
        metaChip: "KUTASIA",
        metaLabel: "[ WORKSPACE · KMU ]",
        title: {
          pre: "Der KI-Arbeitsplatz für ",
          italic: "Kundenservice",
          post: ", der nicht schläft",
        },
        lead:
          "WhatsApp, Telegram, E-Mail und Telefonie vereint in einem KI-gestützten Workspace — gebaut für KMU im DACH-Raum und in der Türkei, deren Geschäft auf Kundengesprächen läuft. Vom Bäcker, der Lieferanten-Sprachnachrichten annimmt, bis zur Klinik, die ausgefallene Termine über die Warteliste nachfüllt.",
        ctaPrimary: "Workspace öffnen",
        ctaSecondary: "Automatisierungen sehen",
      },
      rooms: {
        eyebrow: "[ AUTOMATISIERUNGEN ]",
        headline: "Sechs Automatisierungen. Ein Workspace",
        lead:
          "Jede Automatisierung läuft End-to-End in unter 90 Sekunden — vorführbar vom Handy am Messestand. Einzeln nutzen oder verketten — der Unified Inbox hält jede Konversation, jeden Kanal und jeden KI-Vorschlag in einer Ansicht.",
        items: [
          {
            n: "01 · UNIFIED INBOX",
            h: "Jeder Kanal, ein Screen.",
            b: "WhatsApp, Telegram, E-Mail, Voice-Transkripte und Web-Formulare in einem Posteingang — mit KI-Zusammenfassung, Stimmung und Antwortvorschlag zu jedem Thread.",
            rows: [
              { label: "KANÄLE", value: "WA · TG · EMAIL · VOICE" },
              { label: "KI", value: "SUMMARY · SENTIMENT · DRAFT" },
              { label: "ZUWEISUNG", value: "ROLLEN · TEAMS · TAGS" },
            ],
          },
          {
            n: "02 · SPRACHNACHRICHT → TICKET",
            h: "Von der Sprachnotiz zur strukturierten Aktion.",
            b: "Kunde oder Lieferant schickt eine Sprachnachricht über WhatsApp — Whisper transkribiert, das LLM extrahiert Artikel, Mengen, Daten. Landet als bestätigtes Ticket mit Telegram-Zusammenfassung an den Inhaber.",
            rows: [
              { label: "TRANSKRIPTION", value: "WHISPER · MEHRSPRACHIG" },
              { label: "EXTRAKTION", value: "ARTIKEL · MENGE · DATUM" },
              { label: "AUSGABE", value: "TICKET + TG ALERT" },
            ],
          },
          {
            n: "03 · MEHRSPRACHIGE TRIAGE",
            h: "TR ↔ DE ↔ EN, in Echtzeit.",
            b: "Der Kunde schreibt in seiner Sprache. Der Inhaber liest eine Ein-Zeilen-Zusammenfassung in seiner. KI-Antwortentwürfe kommen in der Sprache des Kunden zurück — in Ihrem Ton signiert.",
            rows: [
              { label: "ERKENNUNG", value: "AUTO · 12 SPRACHEN" },
              { label: "ÜBERSETZUNG", value: "KONTEXTBEWUSST" },
              { label: "ROUTE", value: "TG / WEB OWNER PING" },
            ],
          },
          {
            n: "04 · NO-SHOW-RÜCKGEWINNUNG",
            h: "Leere Slots, die sich selbst füllen.",
            b: "Eine Buchung wird storniert — das System feuert parallel eine WhatsApp-Vorlage an die Top 3 der Warteliste. Erste Antwort bekommt den Slot, andere erhalten eine höfliche Absage.",
            rows: [
              { label: "AUSLÖSER", value: "CAL.COM · MANUELL" },
              { label: "VORLAGE", value: "WA UTILITY · FREIGEGEBEN" },
              { label: "RENNEN", value: "FIRST-YES WINS" },
            ],
          },
          {
            n: "05 · E-MAIL → ANGEBOTSENTWURF",
            h: "Anfrage rein, Entwurf raus, Mensch sendet.",
            b: "Eingehende RFQs treffen Ihre Schlüsselwörter. Die KI entwirft ein Angebot anhand Ihrer Preisliste und legt es in den Ausgang — kein Auto-Versand, keine Überraschungen.",
            rows: [
              { label: "EINGANG", value: "IMAP · POSTMARK" },
              { label: "PREISLISTE", value: "JSON · CSV · API" },
              { label: "FREIGABE", value: "HUMAN IN THE LOOP" },
            ],
          },
          {
            n: "06 · KI-ANALYTIK",
            h: "Nur das, was Entscheidungen unterstützt.",
            b: "Antwortzeit, Stimmungstrend, Intent-Mix, Konversationskosten. Tägliches Digest per E-Mail oder Telegram. Keine Vanity-Dashboards — das Chart verändert eine Entscheidung oder es kommt nicht aufs Dashboard.",
            rows: [
              { label: "EXPORTS", value: "CSV · API" },
              { label: "DIGEST", value: "EMAIL · TG · WÖCHENTLICH" },
              { label: "DATENSCHUTZ", value: "DSGVO · EU-GEHOSTET" },
            ],
          },
        ],
      },
    },

    productsHub: {
      meta: {
        title: "Produkte — Voice, OpSo Smart, Chat, WhatsApp, Booking, Email, Lead, Custom, Kutasia",
        description: "Neun Produkte aus einem Studio: KI-Agenten für Telefon, Chat, WhatsApp, E-Mail und Lead-Qualifizierung, Premium digitale Visitenkarten (OpSo Smart), Custom Workflow-Automatisierung und Kutasia — der unified KI-Workspace für KMU in DACH und der Türkei. Jedes Produkt transparent bepreist und EU-gehostet.",
      },
      hero: {
        eyebrow: "[ PRODUKTE · 2026 ]",
        title: { pre: "Neun Produkte, ", italic: "ein Studio", post: "" },
        lead: "Jedes Produkt auf dieser Seite wird vom selben Team gebaut und betrieben. Voice-, Chat- und WhatsApp-Agenten teilen sich eine Integrationsspine. OpSo Smart, unsere digitale Visitenkarte, ist kostenlos zum Start und in Sekunden live. Custom Automation übernimmt die Workflows, die der Rest nicht erreicht. Kutasia bündelt die Agenten in einem unified KI-Workspace für KMU, deren Geschäft auf Kundengesprächen läuft. Wählen Sie die Oberfläche, wir kümmern uns um den Rest.",
        primaryCta: "Preise ansehen",
        secondaryCta: "Discovery-Call buchen",
      },
      featured: {
        eyebrow: "[ FLAGGSCHIFFE ]",
        heading: "Die zwei Flaggschiff-Produkte",
        items: [
          { id: "voice-agent", name: "Voice AI Agent", tagline: "24/7 Telefonempfang auf Retell oder Vapi.", body: "Mehrsprachige Telefonbeantwortung, Kalender-Sync, Übergabe an einen Menschen, wenn das Skript endet — auf Retell oder Vapi gebaut und auf Ihre Anrufabläufe konfiguriert.", href: "/products/voice-agent", startingAt: "ab €299/Mon. + €1.500 Setup", badge: "Live" },
          { id: "verso", name: "OpSo Smart", tagline: "Digitale Visitenkarte · kostenlos zum Start, in Sekunden live.", body: "Erstellen Sie Ihre Karte kostenlos und veröffentlichen Sie in Sekunden. 20+ Branchen-Templates, Link + QR, EU-Hosting in Frankfurt. Premium ergänzt eigene Domain, NFC und Analysen; White-Glove-Handgestaltung ist optional. Ersetzt Papierkarten, ohne zu Linktree zu werden.", href: "/products/digital-card", startingAt: "Kostenlos zum Start", badge: "Live" },
        ],
      },
      grid: {
        eyebrow: "[ AGENTS & DIENSTE ]",
        heading: "Sieben weitere, jeder klar in seinem Auftrag",
        items: [
          { id: "chatbot-agent", name: "Chatbot Agent", tagline: "Web-Chat, trainiert auf Ihrer Knowledge Base.", startingAt: "ab €149/Mon.", href: "/products/chatbot-agent", category: "AGENT" },
          { id: "whatsapp-agent", name: "WhatsApp Agent", tagline: "WhatsApp Business automatisierte Antworten + Broadcast.", startingAt: "ab €199/Mon.", href: "/products/whatsapp-agent", category: "AGENT" },
          { id: "booking-agent", name: "Booking Agent", tagline: "Multi-Channel Buchungen → Cal.com → Erinnerungen.", startingAt: "ab €99/Mon.", href: "/products/booking-agent", category: "AGENT" },
          { id: "email-agent", name: "Email Agent", tagline: "Inbox-Triage, KI-Antwortentwürfe, Eskalation.", startingAt: "ab €39/Platz/Mon.", href: "/products/email-agent", category: "AGENT" },
          { id: "lead-qualifier-agent", name: "Lead Qualifier Agent", tagline: "BANT-Scoring auf Formular-, Chat- und Voice-Intake.", startingAt: "ab €249/Mon.", href: "/products/lead-qualifier-agent", category: "AGENT" },
          { id: "custom-automation", name: "Custom Automation", tagline: "Sprint-, Projekt- oder Retainer-Engineering.", startingAt: "ab €4.500 Sprint", href: "/products/custom-automation", category: "SERVICE" },
          { id: "kutasia", name: "Kutasia", tagline: "Unified WhatsApp, Telegram, E-Mail und Voice KI-Workspace für KMU.", startingAt: "ab €79/Mon.", href: "/products/kutasia", category: "WORKSPACE" },
        ],
      },
      bottomCta: {
        eyebrow: "[ UNSICHER, WELCHES? ]",
        heading: "Nennen Sie uns Ihren Engpass — wir zeigen das passende Produkt, oder gar keines",
        lead: "Wenn ein 20-Minuten-Call entscheidet, dass wir nicht passen, sind das auch nützliche 20 Minuten. Wir haben Prospects mehr als einmal zu Cal.com, einem Zapier-Flow oder 'einfach einen Junior einstellen' geschickt.",
        cta: "20 kostenlose Minuten buchen",
      },
    },

    about: {
      meta: {
        title: "Über OpSolid — Hasan Dönmez",
        description:
          "OpSolid ist eine unabhängige KI- und Automatisierungsberatung für mittelständische Unternehmen in Deutschland, gegründet von Hasan Dönmez — auf Basis von jahrelangem IT-Projektmanagement, Digitalisierung und Prozessoptimierung.",
      },
      hero: {
        eyebrow: "[ ÜBER OPSOLID · 2026 ]",
        title: {
          pre: "Praktische, anwendbare und ",
          italic: "messbare",
          post: " digitale Lösungen",
        },
        lead:
          "OpSolid ist eine unabhängige KI- und Automatisierungsberatung, gegründet von Hasan Dönmez. Der Fokus liegt auf KI, Prozessautomatisierung und digitalen Workflows für mittelständische Unternehmen in Deutschland — auf Basis von jahrelanger praktischer Arbeit in IT-Projektmanagement, Digitalisierung und Prozessoptimierung.",
        primaryCta: "Erstgespräch buchen",
        secondaryCta: "Leistungen ansehen",
      },
      principles: {
        eyebrow: "[ WIE WIR ARBEITEN ]",
        heading: "Vier Prinzipien, kurz gehalten",
        items: [
          {
            n: "01",
            title: "Praxis vor Strategie",
            body: "Wir starten mit einem Workflow, der dem Team wirklich Zeit kostet — nicht mit einem Quartalsstrategie-Deck. Strategie folgt, sobald wir uns das Recht verdient haben, weiter zu planen.",
          },
          {
            n: "02",
            title: "Messbare Ergebnisse",
            body: "Jedes Engagement startet mit einer Baseline (Zeit pro Aufgabe, Fehlerrate, Durchlaufzeit) und endet mit einer Zahl, mit der Sie etwas anfangen können. Kein Theater, kein Buzzword-Reporting.",
          },
          {
            n: "03",
            title: "Datenschutzbewusst by default",
            body: "EU-Hosting, DSGVO-native Infrastruktur, AVV vor jedem Projekt, das Kundendaten berührt. Audit und Compliance können von Tag eins an mitlaufen.",
          },
          {
            n: "04",
            title: "Quellcode bleibt bei Ihnen",
            body: "Jedes Engagement hinterlässt Ihnen Code, Schemas und Dokumentation, die Sie zu einem anderen Anbieter mitnehmen können. Kein Vendor-Lock-in by Design.",
          },
        ],
      },
      founder: {
        eyebrow: "[ GRÜNDER ]",
        heading: "Hasan Dönmez",
        body: [
          "OpSolid wird von Hasan Dönmez geführt, der praktische Erfahrung aus IT-Projektmanagement und Digitalisierung in mittelständischen Unternehmen mitbringt. Diese Perspektive ist Absicht: zu wissen, wie Transformation in realen Organisationen tatsächlich läuft — mit ihren Zwängen, Politik, Altlasten und Teams — prägt genau die OpSolid-Projekte.",
          "Hintergrund: praxisnahe Erfahrung in IT-Projektmanagement, Digitalisierung und Prozessoptimierung. Der Fokus liegt auf kleinen und mittelständischen Unternehmen in Deutschland — Firmen, die schneller gewachsen sind als ihre internen Systeme und einen messbaren nächsten Schritt brauchen, keinen Plattform-Pitch.",
          "Projekte bleiben praxisnah und senior: Sie arbeiten direkt mit den Menschen, die Ihr Projekt umsetzen — klare Verantwortung, keine Schichten, keine Junior-Übergaben.",
        ],
        linkedinLabel: "Hasan auf LinkedIn",
        linkedinHref: "https://www.linkedin.com/in/hasan-doenmez/",
      },
      contact: {
        eyebrow: "[ GESPRÄCH STARTEN ]",
        heading: "20 Minuten reichen, um zu sehen ob wir passen",
        lead:
          "Kostenloses Erstgespräch: Erzählen Sie uns von einem operativen Schmerzpunkt. Wir sagen Ihnen, ob OpSolid passt, ob der AI & Automation Check der richtige erste Schritt ist, oder ob Sie weitermachen sollten wie bisher.",
        cta: "Erstgespräch buchen",
      },
    },

    productPages: {
      labels: {
        useCasesEyebrow: "[ ANWENDUNGSFÄLLE ]",
        useCasesHeading: "Wo es seinen Wert beweist",
        integrationsEyebrow: "[ INTEGRATIONEN ]",
        integrationsHeading: "Verdrahtet mit dem Stack, den Sie bereits nutzen",
        faqEyebrow: "[ FAQ ]",
        faqHeading: "Häufige Fragen",
      },
      pages: {
        chatbotAgent: {
          meta: { title: "Chatbot Agent — Web-Chat, Knowledge Base, Lead-Capture", description: "Ein konfigurierter Chatbot-Agent für Ihre Site. Knowledge-Base-Ingestion, Lead-Capture und Übergabe an einen Menschen — verdrahtet mit HubSpot, Pipedrive oder Slack. EU-gehostet, GDPR-nativ." },
          hero: {
            metaChip: "CHATBOT AGENT",
            metaLabel: "[ PRODUKT · 03 ]",
            title: { pre: "Site-Besucher bekommen Antworten, ", italic: "Ihr Team qualifizierte Leads", post: "" },
            lead: "Ein Web-Chat-Agent, trainiert auf Ihrer Knowledge Base. Beantwortet Produktfragen während der Geschäftszeiten, erfasst Kontaktdaten danach und übergibt das Gespräch an einen Menschen, wenn der Besucher es verlangt. In Woche eins für Ihre Site konfiguriert — kein Tool, das Ihr Team lernen muss.",
            ctaPrimary: "20-Minuten-Setup-Call buchen",
            ctaSecondary: "Preise ansehen",
            features: [
              { label: "DEPLOY", value: "Woche 1", sub: "Für Sie konfiguriert" },
              { label: "ÜBERGABE", value: "Slack · E-Mail", sub: "Mensch übernimmt" },
              { label: "HOSTING", value: "EU · Frankfurt", sub: "GDPR-nativ" },
            ],
          },
          useCases: [
            { industry: "B2B SaaS", problem: "Engineers verschwenden Stunden mit denselben Produktfragen im Chat-Widget.", outcome: "Chatbot beantwortet 70 % der Produktfragen aus den Docs; lässt 30 % für das Team." },
            { industry: "E-Commerce", problem: "Kaufabbruch, weil Versand- und Rückgabefragen nach 18 Uhr unbeantwortet bleiben.", outcome: "24/7-Antworten reduzieren Abbrüche; komplexe Bestellungen eskalieren über Nacht per E-Mail." },
            { industry: "Professionelle Dienstleistungen", problem: "Inbound-Leads landen im Kontaktformular und springen ab, wenn niemand schnell antwortet.", outcome: "Chatbot qualifiziert, bucht ein Discovery-Call auf Cal.com, legt den Lead in HubSpot ab." },
          ],
          integrations: ["HubSpot", "Pipedrive", "Cal.com", "Slack", "Notion", "Zendesk", "Custom Webhooks"],
          faq: [
            { q: "Wie lange dauert das Setup?", a: "Woche eins für Standard (1 Site, 50 KB-Dokumente). Zwei bis drei Wochen für Professional mit CRM-Sync. Wir planen einen 20-Minuten-Scoping-Call, prüfen Ihre Knowledge Base und liefern einen konfigurierten Agenten innerhalb von fünf Werktagen nach Kickoff." },
            { q: "Was passiert, wenn der Chatbot nicht antworten kann?", a: "Drei Optionen: Erfassung einer E-Mail mit Antwort durch Ihr Team innerhalb des vereinbarten SLA (Standard), Live-Übergabe an Slack mit Konversationskontext (Professional) oder 24/7-Eskalation an Ihren eigenen Help Desk (Enterprise). Der Besucher trifft nie auf eine Sackgasse." },
            { q: "Ist das nur ChatGPT in einer Box?", a: "Nein. Wir verwenden moderne LLMs als eine Komponente, gründen aber jede Antwort auf Ihrer indizierten Knowledge Base, prüfen jede Antwort und ermöglichen Ihrem Team, Antworten in einem Dashboard zu überprüfen und zu bearbeiten. Das Modell erfindet keine Fakten über Ihr Produkt." },
            { q: "Wo werden die Daten gehostet?", a: "Hetzner / IONOS Frankfurt. Nur EU. Keine US-Subprozessoren. Konversationsverlauf gehört Ihnen, exportierbar als CSV oder API, auf Anfrage löschbar." },
          ],
        },
        whatsappAgent: {
          meta: { title: "WhatsApp Agent — Business API, automatisierte Antworten, Broadcast", description: "Ein konfigurierter WhatsApp-Business-Agent — automatisierte Antworten, Broadcast-Kampagnen, CRM-Sync und Übergabe an einen Menschen. Meta-WABA-Durchgriff, kein versteckter Aufschlag." },
          hero: {
            metaChip: "WHATSAPP AGENT",
            metaLabel: "[ PRODUKT · 04 ]",
            title: { pre: "WhatsApp antwortet, ", italic: "während Ihr Team schläft", post: "" },
            lead: "Ein automatisierter Agent auf Ihrer WhatsApp-Business-Nummer. Templates, Broadcast-Kampagnen, Lead-Capture-Flows, Übergabe an Menschen, wenn das Skript endet. Meta-WABA-Konversationskosten werden transparent durchgereicht — kein versteckter Aufschlag in Ihrer Rechnung.",
            ctaPrimary: "20-Minuten-Setup-Call buchen",
            ctaSecondary: "Preise ansehen",
            features: [
              { label: "API", value: "Meta WABA", sub: "Offiziell, kein Gateway" },
              { label: "DURCHGRIFF", value: "Transparent", sub: "Kein versteckter Aufschlag" },
              { label: "TEAM", value: "Multi-User", sub: "Rollen & Routing" },
            ],
          },
          useCases: [
            { industry: "Lokaler Einzelhandel", problem: "Kunden fragen über Öffnungszeiten, Bestand und Rückgaben auf WhatsApp; Personal beantwortet den ganzen Tag dieselben fünf Fragen.", outcome: "Auto-Antwort übernimmt die FAQ; Personal kümmert sich um echten Verkauf, nicht um Status-Updates." },
            { industry: "Hospitality", problem: "Buchungsanfragen kommen um 23 Uhr auf WhatsApp und konvertieren schlecht, weil die Rezeption erst um 9 Uhr antwortet.", outcome: "Agent bestätigt Verfügbarkeit, nimmt die Buchung an, sendet Zahlungslink — auch wenn die Rezeption geschlossen ist." },
            { industry: "Grenzüberschreitende Dienste", problem: "Mehrsprachiger Support auf WhatsApp belastet die Teamkapazität; Team kommt mit DE/EN/TR-Nachfrage nicht hinterher.", outcome: "Agent antwortet in der Sprache des Besuchers, übergibt nur bei Bedarf an das richtige Teammitglied." },
          ],
          integrations: ["Meta WABA", "HubSpot", "Pipedrive", "Cal.com", "Stripe", "Twilio Fallback", "Custom Webhooks"],
          faq: [
            { q: "Brauche ich eine Meta-WABA-Nummer?", a: "Ja — Sie stellen eine Nummer bereit, die wir in Ihrem Auftrag bei Meta registrieren. Wenn Sie bereits eine WABA-Nummer haben, migrieren wir sie. Die Nummer bleibt Ihre; Sie können sie jederzeit mitnehmen." },
            { q: "Wie funktionieren die Konversationskosten?", a: "Meta berechnet pro 24-Stunden-Konversationsfenster (~€0,05–0,15 in der EU je nach Kategorie). Bei Standard und Professional fügen wir einen kleinen Aufschlag pro Nachricht hinzu; bei Enterprise reichen wir Metas Preis ohne Aufschlag durch." },
            { q: "Kann mein Team das Gespräch manuell übernehmen?", a: "Ja — jede Konversation hat einen 'Mensch übernimmt'-Button in unserem Dashboard, oder Sie routen zu einem Slack-Kanal mit vollem Kontext. Sobald ein Mensch übernimmt, schweigt der Agent, bis Sie den Chat als gelöst markieren." },
            { q: "Ist Broadcast spam-sicher?", a: "Wir verwenden ausschließlich Metas vorab genehmigte Template-Nachrichten und respektieren Opt-out-Anfragen automatisch. Missbrauch führt zur Sperrung Ihrer Nummer durch Meta — wir konfigurieren konservative Defaults, die Ihre Nummer compliant halten." },
          ],
        },
        bookingAgent: {
          meta: { title: "Booking Agent — Web, Voice, WhatsApp Buchungen → Cal.com", description: "Multi-Channel-Buchungs-Agent. Web-Widget, Voice-Intake, WhatsApp-Bestätigungen, No-Show-Recovery — synchronisiert mit Cal.com oder Ihrem eigenen Kalender. EU-gehostet." },
          hero: {
            metaChip: "BOOKING AGENT",
            metaLabel: "[ PRODUKT · 05 ]",
            title: { pre: "Buchungen kommen über Web, Voice und WhatsApp — ", italic: "der Kalender bleibt sauber", post: "" },
            lead: "Ein Buchungs-Agent, der Intake aus jedem Kanal nimmt, Verfügbarkeit gegen Ihren echten Kalender prüft, Erinnerungen sendet und No-Shows zurückgewinnt. Cal.com unter der Haube, unsere Intelligenz darüber — funktioniert für Solo-Praxen, Multi-Staff-Service-Betriebe und Multi-Standort-Operationen.",
            ctaPrimary: "20-Minuten-Setup-Call buchen",
            ctaSecondary: "Preise ansehen",
            features: [
              { label: "KANÄLE", value: "Web · Voice · WA", sub: "Alle in einen Kalender" },
              { label: "KALENDER", value: "Cal.com", sub: "Open-Source-Kern" },
              { label: "RECOVERY", value: "Auto", sub: "No-Show-Flow eingebaut" },
            ],
          },
          useCases: [
            { industry: "Salons / Friseure", problem: "Telefonbuchungen unterbrechen den Service; Kunden buchen doppelt oder erscheinen ohne Bescheid nicht.", outcome: "Voice und Web nehmen 80 % der Buchungen; SMS-Erinnerungen halbieren die No-Show-Rate." },
            { industry: "Kliniken", problem: "Rezeption verbringt Stunden mit Bestätigungsanrufen und Umbuchungen.", outcome: "Erinnerungen + Auto-Rebook-Flow erledigen das meiste; Rezeption kümmert sich nur um Ausnahmen." },
            { industry: "Multi-Staff-Agenturen", problem: "Round-Robin-Buchung über Teammitglieder versagt, wenn Kalender desynchronisiert sind.", outcome: "Echtzeit-Cal.com-Integration hält alle in einer Quelle der Wahrheit; Buchungen routen nach Skill oder Auslastung." },
          ],
          integrations: ["Cal.com", "Google Calendar", "Outlook", "Twilio", "Stripe (Anzahlung)", "HubSpot", "Slack-Benachrichtigungen"],
          faq: [
            { q: "Muss ich Cal.com verwenden?", a: "Cal.com ist der Default — Open-Source und auf Professional und Enterprise hosten wir es in Ihrer Infrastruktur. Wir können auch nativ mit Google Calendar, Outlook oder jedem CalDAV-Kalender verdrahten." },
            { q: "Kann es Anzahlungen einziehen?", a: "Ja, auf Enterprise nehmen wir eine konfigurierbare Anzahlung beim Buchen via Stripe entgegen. Der Flow handhabt Rückerstattungen, Teil-Captures bei No-Show und SEPA für deutsche Kunden." },
            { q: "Was ist mit Multi-Standort?", a: "Enterprise unterstützt unbegrenzte Standorte, jeder mit eigenen Kalendern, Geschäftszeiten und Routing-Regeln. Besucher wählen zuerst den Standort, dann das Teammitglied." },
            { q: "Wie funktioniert No-Show-Recovery?", a: "Wenn eine Buchung verpasst wird, sendet der Agent eine Folgenachricht mit der Bitte, innerhalb von 48 Stunden umzubuchen. Wenn der Kunde umbucht, keine Gebühr. Wenn er nicht antwortet, können Sie Auto-Rebook-Angebote oder finale Erinnerungen konfigurieren." },
          ],
        },
        emailAgent: {
          meta: { title: "Email Agent — Inbox-Triage, Auto-Antwort, Eskalation", description: "Ein E-Mail-Automatisierungs-Agent für Shared Inboxes. KI-Triage, konfigurierbare Auto-Antwort, Eskalationsregeln, CRM-Logging. Front-Style UX ohne Front-Preise." },
          hero: {
            metaChip: "EMAIL AGENT",
            metaLabel: "[ PRODUKT · 06 ]",
            title: { pre: "Triage und Auto-Antwort im Postfach, ", italic: "ohne Ihr Team neu zu schulen", post: "" },
            lead: "Ein E-Mail-Agent, der die Shared Inbox liest, Nachrichten klassifiziert, Antworten zur Prüfung entwirft, dringende Fälle an Slack oder einen Senior eskaliert und den Rest in Ihrem CRM protokolliert. Funktioniert mit Front, Help Scout oder einfachem Gmail / Outlook — Ihr Team wechselt nicht das Tool.",
            ctaPrimary: "20-Minuten-Setup-Call buchen",
            ctaSecondary: "Preise ansehen",
            features: [
              { label: "INBOX", value: "Gmail · Outlook · Front", sub: "Kein Tool-Wechsel" },
              { label: "TRIAGE", value: "Kategorisiert", sub: "Auto-Tag + Priorität" },
              { label: "ENTWÜRFE", value: "Prüfbar", sub: "Team genehmigt vor dem Senden" },
            ],
          },
          useCases: [
            { industry: "Service-Desk", problem: "Inbox von 200/Tag heißt, dringende Tickets liegen stundenlang neben Newsletter-Anmeldungen.", outcome: "Triage taggt 'dringend / standard / niedrig'; Team arbeitet zuerst die dringende Schlange ab, Agent entwirft Antworten für Standard." },
            { industry: "Sales-Ops", problem: "Eingehende Produktfragen und Preisanfragen gehen in einer generischen info@-Inbox unter.", outcome: "Sales-relevante E-Mails routen zu HubSpot, Entwürfe gehen an den richtigen Rep, niedrigprior. Nachrichten erhalten eine höfliche Eingangsbestätigung." },
            { industry: "Hospitality", problem: "Rezeptionsteam verbringt Vormittage mit Inbox-Aufräumen, bevor der Service beginnt.", outcome: "Agent bearbeitet Bestätigungen, FAQ-Antworten und Routing über Nacht — Rezeption prüft nur Ausnahmen." },
          ],
          integrations: ["Gmail / Workspace", "Outlook / Microsoft 365", "Front", "Help Scout", "HubSpot", "Pipedrive", "Slack"],
          faq: [
            { q: "Sendet es Antworten ohne meine Genehmigung?", a: "Standard sendet nur Entwürfe — Ihr Team prüft und klickt Senden. Professional fügt optionales Auto-Senden für freigegebene Antworttypen hinzu (z. B. Öffnungszeiten, einfache FAQs). Enterprise unterstützt vollautomatisches Senden mit Audit-Log und Rollback. Sie entscheiden, wo Sie auf dem Spektrum stehen wollen." },
            { q: "Kann es unseren Antwortstil lernen?", a: "Ja — wir indizieren Ihre letzten 90 Tage gesendeter Mails, um Tonalität, Signatur und gängige Formulierungen zu lernen. Entwürfe lesen sich wie vom Team geschrieben, nicht wie ein generischer KI-Assistent." },
            { q: "Was ist mit GDPR für E-Mail-Inhalt?", a: "E-Mail-Inhalt wird nur in der EU verarbeitet. Wir behalten Konversationsverlauf für die in Ihrer DPA angegebene Periode (Default 24 Monate). Ein-Klick-Export und -Löschung unterstützt." },
            { q: "Funktioniert es neben Front?", a: "Ja — Email Agent verbindet sich via API mit Front und arbeitet innerhalb Ihrer bestehenden Front-Workflows. Gleiches gilt für Help Scout. Sie migrieren nicht; Sie ergänzen." },
          ],
        },
        leadQualifierAgent: {
          meta: { title: "Lead Qualifier Agent — Formular, Chat, Voice → BANT-Scoring", description: "Lead-Qualifizierungs-Agent, der Intake aus jedem Kanal nimmt, gegen Ihre ICP scort und qualifizierte Leads mit vollem Kontext an Ihr CRM pusht." },
          hero: {
            metaChip: "LEAD QUALIFIER AGENT",
            metaLabel: "[ PRODUKT · 07 ]",
            title: { pre: "Vertrieb spricht ", italic: "nur mit qualifizierten Leads", post: "" },
            lead: "Ein Qualifizierungs-Agent, der auf Ihren Formularen, Web-Chat und eingehender Voice läuft. Stellt die richtigen Discovery-Fragen, scort gegen ICP- und BANT-Kriterien und routet nur die Qualifizierten an Ihr Sales-Team. Unqualifizierte Besucher bekommen einen höflichen nächsten Schritt — keinen verschwendeten SDR-Call.",
            ctaPrimary: "20-Minuten-Setup-Call buchen",
            ctaSecondary: "Preise ansehen",
            features: [
              { label: "INTAKE", value: "Form · Chat · Voice", sub: "Alles einheitlich gescort" },
              { label: "SCORING", value: "BANT + ICP", sub: "Anpassbares Modell" },
              { label: "ROUTING", value: "Pro Rep / Region", sub: "Round-Robin oder regelbasiert" },
            ],
          },
          useCases: [
            { industry: "B2B SaaS", problem: "Demo-Anfragen strömen herein; SDRs verbrennen Zeit mit Tire-Kickern, während echte Prospects warten.", outcome: "Agent qualifiziert zuerst; SDRs sehen nur ICP-Match-Leads mit bereits gesammeltem Intent-Signal." },
            { industry: "Agenturen", problem: "Inbound-'Wie viel?'-Anfragen bleiben unbeantwortet, weil Preise vom Scope abhängen.", outcome: "Agent führt Scoping-Fragen durch, landet einen qualifizierten Intro-Call nur wenn Budget und Timeline passen." },
            { industry: "Outbound-lastige Teams", problem: "Apollo- / Outreach-Antworten brauchen schnelle Triage, um Open Rates hoch zu halten.", outcome: "Agent liest Antworten, klassifiziert Intent, plant Follow-up nur bei positiven Signalen." },
          ],
          integrations: ["HubSpot", "Pipedrive", "Salesforce", "Apollo.io", "Outreach.io", "Slack", "Custom CRM via Webhook"],
          faq: [
            { q: "Wie ist 'qualifiziert' definiert?", a: "Wir definieren es gemeinsam mit Ihnen im Kickoff: ICP-Fit (Branche, Größe, Rolle), Intent-Signale (spezifische Fragen, Dringlichkeitsmarker) und BANT (Budget, Authority, Need, Timeline). Die Definition steht schriftlich in Ihrem Vertrag — Abrechnung pro qualifiziertem Lead kann nur Leads in Rechnung stellen, die passen." },
            { q: "Kann ich das Scoring überschreiben?", a: "Ja. Sales-Team kann jeden Lead im Dashboard als 'fehlqualifiziert' markieren; das Modell adaptiert. Wir trainieren monatlich auf den Überschreibungen Ihres Teams — das Modell wird im Lauf der Zeit schärfer auf Ihre ICP." },
            { q: "Was passiert mit unqualifizierten Leads?", a: "Sie bekommen einen höflichen nächsten Schritt: ein Content-Stück, eine Self-Service-Warteliste, einen Community-Link oder eine 'Wir sind nicht der richtige Fit, hier ist es'-Empfehlung. Niemals geghosted, niemals verschwendet." },
            { q: "Funktioniert es auf meinem bestehenden Chat-Tool?", a: "Ja — Lead Qualifier verbindet sich mit Intercom, Drift, Ihrem Custom-Widget oder unserem Chatbot Agent. Der Qualifizierungs-Flow läuft als Schicht darüber, nicht als Ersatz." },
          ],
        },
        customAutomation: {
          meta: { title: "Custom Automation — Sprint, Projekt, Retainer", description: "Workflow-Automatisierungs-Builds für deutsches Mid-Market-B2B. Sprint, Projekt oder Retainer-Engagement — Ihr Quellcode, Ihre Daten, kein Vendor-Lock-in." },
          hero: {
            metaChip: "CUSTOM AUTOMATION",
            metaLabel: "[ SERVICE · 08 ]",
            title: { pre: "Workflows, die Standard-Tools ", italic: "nicht erreichen", post: "" },
            lead: "Manchmal ist die Antwort kein SaaS — sondern ein Engineer, der die Integration baut, die Ihr ERP, Ihr Lager und Ihr CRM so verbindet, wie Ihr Geschäft läuft. Sprint für einen einzelnen Workflow, Projekt für eine Digital-Ops-Initiative oder ein Monatsretainer, der weiterliefert. Quellcode bleibt bei Ihnen.",
            ctaPrimary: "30-Minuten-Scoping-Call buchen",
            ctaSecondary: "Preise ansehen",
            features: [
              { label: "ENGAGEMENT", value: "Sprint · Projekt · Retainer", sub: "Scope passt zum Bedarf" },
              { label: "EIGENTUM", value: "Quellcode bei Ihnen", sub: "Kein Lock-in" },
              { label: "STACK", value: "Open-Source zuerst", sub: "Hetzner · Postgres · Node" },
            ],
          },
          useCases: [
            { industry: "Logistik", problem: "Lagerdaten exportieren als CSV, Finanz-ERP frisst EDI, manuelle Übersetzung verbraucht eine FTE pro Woche.", outcome: "Sprint baute einen Übersetzungsdienst; Finanzen erhält saubere EDI innerhalb von zwei Minuten nach Lager-Export." },
            { industry: "Real Estate", problem: "Inbound-Leads verteilt auf Immoscout, Webformulare und WhatsApp; keine Single-Source-of-Truth.", outcome: "Projekt konsolidierte alle Kanäle in HubSpot mit Deduplizierung und Kontaktanreicherung." },
            { industry: "Multi-Entity-Holding", problem: "Sechs Tochtergesellschaften, sechs Buchhaltungssysteme, monatliche Konsolidierung dauert eine Woche.", outcome: "Retainer liefert weiter Integrationen: Konsolidierung läuft jetzt nächtlich, am Morgen audit-bereit." },
          ],
          integrations: ["Postgres", "Node.js / TypeScript", "Python", "n8n", "Zapier (wenn sinnvoll)", "Hetzner", "Custom APIs"],
          faq: [
            { q: "Warum nicht einfach Zapier oder Make verwenden?", a: "Wir tun das — wenn sie passen. Zapier und Make sind großartig für einfache Connectors. Sie schmerzen ab einer gewissen Größe (Kosten, Debugging, Zuverlässigkeit) und können keine geschäftsspezifische Logik. Wir helfen Ihnen zu entscheiden, wo jedes Tool seinen Wert beweist, und bauen den Rest." },
            { q: "Wie funktioniert Scoping?", a: "Kostenloser 30-Minuten-Discovery-Call. Wenn beide Seiten weitermachen wollen, führen wir einen bezahlten Scoping-Workshop durch — die Gebühr wird bei Vertragsabschluss auf das Projekt angerechnet —, der eine schriftliche Spec und einen Festpreis liefert. Sie gehen in beiden Fällen mit der Spec." },
            { q: "Wie kalkulieren Sie die Arbeit?", a: "Die meisten Projekte werden pauschal auf Basis einer schriftlichen, fest umrissenen Spec berechnet — nicht nach Stunden —, sodass Sie die Zahl vor dem Start kennen. Für laufende Arbeit gibt es Tagessatz- und monatliche Retainer-Optionen. Das Angebot folgt nach dem Scoping-Workshop." },
            { q: "Unterschreiben Sie AVVs?", a: "Ja — Standard-deutsche-B2B-AVV (Auftragsverarbeitungsvertrag) bei jedem Engagement, das Kundendaten berührt. NDA vor Scoping, wenn Sie vertraulichen Kontext teilen müssen." },
          ],
        },
      },
    },

    pricing: {
      meta: {
        title: "Preise — Standard, Professional, Enterprise",
        description: "Transparente EUR-Preise für die neun Produkte von OpSolid: Voice Agent, OpSo Smart, Chatbot, WhatsApp, Booking, Email, Lead Qualifier, Custom Automation und Kutasia.",
      },
      hero: {
        eyebrow: "[ PREISE · TRANSPARENT ]",
        title: {
          pre: "Tier-Preise für ",
          italic: "alle neun Produkte",
          post: ".",
        },
        lead: "Standard für den fokussierten Einsatz. Professional für den aktiven Betrieb. Enterprise für regulierte und skalierte Umgebungen. Einmaliges Setup, laufende Gebühren passend zur Nutzung, keine versteckten Tier-Upgrades.",
        vatNotice: "Alle Preise in EUR, zzgl. MwSt. EU-gehostete Infrastruktur inklusive.",
      },
      labels: {
        setup: "Einrichtung",
        monthly: "Laufend",
        included: "Enthalten",
        overage: "Überlauf",
        forWhom: "Für wen",
        primaryCta: "Loslegen",
        enterpriseCta: "Sprechen wir",
        viewProduct: "Zum Produkt",
        perMonth: "/Mon.",
        perUser: "/Nutzer",
        perSeat: "/Platz",
      },
      tierNames: {
        standard: "Standard",
        professional: "Professional",
        enterprise: "Enterprise",
      },
      products: [
        {
          id: "voice-agent",
          name: "Voice AI Agent",
          tagline: "24/7 Telefonempfang auf Retell oder Vapi, mehrsprachig.",
          href: "/products/voice-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€1.500",
              monthly: "€299/Mon.",
              included: ["500 Minuten / Monat", "1 Telefonnummer", "1 Sprache", "Geschäftszeiten-Abdeckung", "Cal.com-Integration"],
              overage: "€0,18/Min.",
              forWhom: "Einzel-Standort SMB, Überlaufabdeckung",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€2.500",
              monthly: "€699/Mon.",
              included: ["2.000 Minuten / Monat", "3 Telefonnummern", "Mehrsprachig (DE / EN / TR)", "24/7-Abdeckung", "CRM-Sync (HubSpot, Pipedrive)"],
              overage: "€0,14/Min.",
              forWhom: "Mid-Market mit konstantem Inbound (Kliniken, Agenturen)",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€4.500",
              monthly: "€1.499/Mon.",
              included: ["8.000 Minuten / Monat", "Unbegrenzte Nummern", "Custom Voice + Branding", "SLA 99,9 %", "EU-Datenresidenz-Vertrag"],
              overage: "€0,10/Min.",
              forWhom: "Hochvolumig, regulierte Branchen",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "verso",
          name: "OpSo Smart",
          tagline: "Erstellen Sie Ihre digitale Visitenkarte selbst, kostenlos zum Start",
          href: "/products/digital-card",
          tiers: [
            {
              name: "Free",
              setup: "€0",
              monthly: "€0",
              included: ["Alle Vorlagen, Layouts & Themes", "Link + QR-Code (PNG + SVG)", "In Kontakte speichern (vCard)", "Gehostet auf opsolid.de/c/ihr-name", "Kleiner 'Made with OpSo Smart'-Badge"],
              overage: "",
              forWhom: "Solo, Freiberufler, Berater",
              isHighlighted: false,
            },
            {
              name: "Premium",
              setup: "€149 einmalig",
              monthly: "€9/Jahr Hosting ab Jahr 2",
              included: ["Alles aus Free, Badge entfernt", "Eigener Slug oder eigene Domain", "NFC-Option", "Analysen (Aufrufe + Klicks)", "Lead-Erfassung + CRM-Webhook"],
              overage: "",
              forWhom: "Profis, die Domain, NFC & Analysen wollen",
              isHighlighted: true,
            },
            {
              name: "White-glove",
              setup: "Ab €299",
              monthly: "auf Anfrage",
              included: ["Wir gestalten Ihre Karte in 48 Std. von Hand", "Unbegrenzte Überarbeitungen", "Mehrsprachig (DE / EN / TR)", "Team-Rollout", "Priorisierter Support"],
              overage: "",
              forWhom: "Wer es fertig geliefert haben möchte",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "chatbot-agent",
          name: "Chatbot Agent",
          tagline: "Web-Chat + KB-Ingestion + Lead-Capture, Übergabe an Mensch.",
          href: "/products/chatbot-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€750",
              monthly: "€149/Mon.",
              included: ["1 Site", "500 Konversationen / Monat", "Knowledge Base bis 50 Dokumente", "Geschäftszeiten-Übergabe", "E-Mail- + Ticket-Capture"],
              overage: "€0,40 / Konversation",
              forWhom: "Kleine Site, Lead-Capture-Fokus",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1.500",
              monthly: "€399/Mon.",
              included: ["3 Sites", "2.500 Konversationen / Monat", "Unbegrenzte KB-Dokumente", "24/7-Übergabe", "CRM-Sync"],
              overage: "€0,30 / Konversation",
              forWhom: "Mid-Market mit aktivem Funnel",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€3.000",
              monthly: "€999/Mon.",
              included: ["Unbegrenzte Sites", "10.000 Konversationen / Monat", "Mehrsprachig", "SLA + Audit-Log", "Custom Voice + Tone-Training"],
              overage: "€0,20 / Konversation",
              forWhom: "Hochfrequenter E-Commerce / B2B SaaS",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "whatsapp-agent",
          name: "WhatsApp Agent",
          tagline: "WhatsApp Business API — automatisierte Antworten, Broadcast, Übergabe.",
          href: "/products/whatsapp-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€900",
              monthly: "€199/Mon.",
              included: ["1 WABA-Nummer", "3 Nutzer", "1.000 Konversationen / Monat", "Templates + Broadcast", "Lead-Capture-Flow"],
              overage: "Meta-Durchgriff + €0,02 / Nachricht",
              forWhom: "Lokale Geschäfte, Single-Channel",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1.800",
              monthly: "€499/Mon.",
              included: ["1 WABA-Nummer", "10 Nutzer", "5.000 Konversationen / Monat", "Automation-Flows", "CRM-Sync"],
              overage: "Meta-Durchgriff + €0,015 / Nachricht",
              forWhom: "Mid-Market Service-Operationen",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€3.500",
              monthly: "€1.299/Mon.",
              included: ["3+ WABA-Nummern", "Unbegrenzte Nutzer", "20.000 Konversationen / Monat", "Multi-Team-Routing", "SLA"],
              overage: "Nur Meta-Durchgriff (kein Aufschlag)",
              forWhom: "Hochvolumiger Retail / Multi-Brand",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "booking-agent",
          name: "Booking Agent",
          tagline: "Web / Voice / WhatsApp Buchungen → Cal.com → Erinnerungen → No-Show-Recovery.",
          href: "/products/booking-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€500",
              monthly: "€99/Mon.",
              included: ["Web-Buchungs-Widget", "Cal.com-Sync", "E-Mail- + SMS-Erinnerungen", "1 Kalender", "Bis zu 100 Buchungen / Monat"],
              overage: "",
              forWhom: "Solo-Praxis / kleines Team",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1.200",
              monthly: "€299/Mon.",
              included: ["Bis zu 10 Kalender", "Voice + WhatsApp + Web-Intake", "No-Show-Recovery-Flow", "Intake-Formulare", "Custom-Erinnerungen"],
              overage: "",
              forWhom: "Multi-Staff-Servicebetrieb",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€2.500",
              monthly: "€699/Mon.",
              included: ["Unbegrenzte Kalender", "Custom Workflows", "Anzahlung (Stripe)", "Multi-Standort", "SLA"],
              overage: "",
              forWhom: "Kliniken, Multi-Standort-Betriebe",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "email-agent",
          name: "Email Agent",
          tagline: "Inbox-Triage, Auto-Antwort, Eskalation, CRM-Logging.",
          href: "/products/email-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€600",
              monthly: "€39/Platz/Mon.",
              included: ["1 Shared Inbox", "KI-Triage + Auto-Antwort", "500 E-Mails / Platz / Monat", "Basis-CRM-Log", "Slack-Benachrichtigungen"],
              overage: "€0,05 / E-Mail",
              forWhom: "Kleines Operations-Team",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1.200",
              monthly: "€69/Platz/Mon.",
              included: ["3 Inboxes", "Eskalationsregeln", "2.000 E-Mails / Platz / Monat", "HubSpot- / Pipedrive-Sync", "Custom-Antwort-Templates"],
              overage: "€0,04 / E-Mail",
              forWhom: "Mid-Market Service-Desk",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€2.500",
              monthly: "€99/Platz/Mon.",
              included: ["Unbegrenzte Inboxes", "Custom-Routing-Regeln", "Audit-Log + SLA", "EU AVV inklusive", "Dedicated Success Manager"],
              overage: "€0,03 / E-Mail",
              forWhom: "Reguliert / hochvolumig",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "lead-qualifier-agent",
          name: "Lead Qualifier Agent",
          tagline: "Formular- / Chat- / Voice-Intake → BANT-Scoring → CRM-Push.",
          href: "/products/lead-qualifier-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€1.000",
              monthly: "€249/Mon.",
              included: ["250 qualifizierte Leads / Monat", "Formular- + Chat-Intake", "BANT-Scoring", "CRM-Push (HubSpot, Pipedrive)", "Slack-Alerts"],
              overage: "€1,50 / Lead",
              forWhom: "Outbound-leichtes B2B",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€2.000",
              monthly: "€599/Mon.",
              included: ["1.000 qualifizierte Leads / Monat", "Voice + Chat + Formular-Intake", "Custom-Scoring-Modell", "Routing-Regeln", "Wöchentliche Übersicht"],
              overage: "€1,00 / Lead",
              forWhom: "Aktives SDR-unterstütztes Team",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€4.000",
              monthly: "€1.499/Mon.",
              included: ["4.000 qualifizierte Leads / Monat", "Multi-Channel-Intake", "Account-basiertes Scoring", "SLA", "Custom-Integrationen"],
              overage: "€0,60 / Lead",
              forWhom: "Sales-led Mid-Market",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "custom-automation",
          name: "Custom Automation",
          tagline: "Workflow-Builds — Sprint, Projekt oder Retainer. Kein SaaS.",
          href: "/products/custom-automation",
          tiers: [
            {
              name: "Standard",
              setup: "€4.500 fix (Sprint)",
              monthly: "—",
              included: ["1 Workflow End-to-End gebaut", "Scoping + Build + 30 Tage Support", "Bis zu 3 Integrationen", "Dokumentation + Übergabe", "Quellcode gehört Ihnen"],
              overage: "",
              forWhom: "Einzelner, klar definierter Schmerzpunkt",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€12.000 fix (Projekt) — oder €1.200/Tag",
              monthly: "—",
              included: ["3–5 Workflows", "Discovery-Workshop", "Build + 90 Tage Support", "Integration + Custom Code", "Ops-Dashboard"],
              overage: "",
              forWhom: "Mid-Market Digital-Ops-Projekt",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "—",
              monthly: "€4.500/Mon. (12 Monate Mindestlaufzeit)",
              included: ["Dedizierter Automation-Engineer 4 Tage / Monat", "Unbegrenzte Workflows im Scope", "Quartalsreview", "Priorität bei Incidents", "Roadmap-Kollaboration"],
              overage: "",
              forWhom: "Laufender Transformationspartner",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "kutasia",
          name: "Kutasia",
          tagline: "Unified KI-Workspace — WhatsApp, Telegram, E-Mail und Voice in einem Posteingang, mit Hero-Automatisierungen und messetauglichem Demo-Modus.",
          href: "/products/kutasia",
          tiers: [
            {
              name: "Starter",
              setup: "€500",
              monthly: "€79/Mon.",
              included: ["1 Kanal (WhatsApp, Telegram oder E-Mail)", "500 KI-Konversationen / Monat", "1 Nutzer", "Unified Inbox + KI-Zusammenfassung", "Sprachnachricht-Transkription (Whisper)"],
              overage: "€0,06 / zusätzliche Konversation",
              forWhom: "Solo-Betreiber oder Einzelstandort-KMU",
              isHighlighted: false,
            },
            {
              name: "Growth",
              setup: "€1.200",
              monthly: "€179/Mon.",
              included: ["3 Kanäle (WA + TG + E-Mail)", "2.000 KI-Konversationen / Monat", "5 Nutzer", "5 Hero-Playbooks aktiviert", "Mehrsprachige Triage + KI-Entwürfe"],
              overage: "€0,05 / zusätzliche Konversation",
              forWhom: "Aktives KMU mit täglichem Kundenservice",
              isHighlighted: true,
            },
            {
              name: "Scale",
              setup: "€2.500",
              monthly: "€379/Mon.",
              included: ["Alle Kanäle + Voice (300 Min.)", "8.000 KI-Konversationen / Monat", "Unbegrenzte Nutzer", "Custom Playbooks + Automatisierungen", "WhatsApp-BSP-Gebühren als Pass-Through (kein Aufschlag)"],
              overage: "€0,04 / zusätzliche Konversation · €0,18 / zusätzliche Voice-Min.",
              forWhom: "Multi-Staff-Betriebe, tägliches Volumen oder höher",
              isHighlighted: false,
            },
          ],
        },
      ],
      bundles: {
        eyebrow: "[ BUNDLES & JÄHRLICH ]",
        heading: "Sparen, das sich stapelt",
        lead: "Kaufen Sie mehr als ein Produkt oder verpflichten Sie sich jährlich, und die Rechnung sinkt automatisch. Rabatte sind kombinierbar.",
        items: [
          { rule: "2 Produkte", benefit: "−10 % auf kombinierte laufende Gebühren" },
          { rule: "3+ Produkte", benefit: "−15 % auf laufende Gebühren + 1 kostenloses Tier-Upgrade für 3 Monate" },
          { rule: "Jährliche Vorauszahlung", benefit: "−15 % (jedes Produkt, jeder Tier)" },
          { rule: "OpSo Smart-Teams (50+ Plätze) gebündelt mit beliebigem Agent", benefit: "OpSo Smart-Platzpreis fällt auf €4/Nutzer/Mon." },
          { rule: "Custom-Automation-Retainer-Kunden", benefit: "Alle SaaS-Produkte mit −20 %" },
        ],
        note: "Rabatte gelten nur für laufende Gebühren. Setup-Gebühren bleiben fix. Jährliche Vorauszahlung nicht erstattbar; monatliche Tiers kündbar mit 30-tägiger Frist.",
      },
      footnote: "Alle Preise in EUR, zzgl. MwSt. Nicht-EU-Kunden werden ohne MwSt. fakturiert (Reverse Charge anwendbar). EU-gehostete Infrastruktur (Hetzner / IONOS Frankfurt) auf jedem Tier inklusive.",
    },
  },
  card: {
    send: {
      triggerLabel: "Meine Daten senden",
      modalTitle: "Meine Daten senden",
      modalSubtitle: "Hinterlasse deine Kontaktdaten — wir melden uns.",
      submitLabel: "Senden",
      submittingLabel: "Wird gesendet…",
      closeLabel: "Schließen",
      successTitle: "Vielen Dank!",
      successBody: "Deine Daten wurden gesendet. Wir melden uns in Kürze.",
      successCloseLabel: "Schließen",
      consentRequired: "Bitte Datenschutzhinweis bestätigen.",
      submitFailed: "Senden fehlgeschlagen. Bitte später erneut versuchen.",
      networkError: "Netzwerkfehler. Bitte erneut versuchen.",
      nameLabel: "Name",
      phoneLabel: "Telefon",
      emailLabel: "E-Mail",
      companyLabel: "Unternehmen",
      meetingContextLabel: "Wo haben wir uns kennengelernt?",
      meetingContextPh: "Hannover Messe, LinkedIn, Empfehlung …",
      interestLabel: "Interesse / Thema",
      messageLabel: "Nachricht",
      messagePh: "Worum geht's?",
      consentText:
        "Ich stimme zu, dass meine Angaben zur Kontaktaufnahme verarbeitet werden (DSGVO).",
      requiredMark: "*",
    },
    qr: {
      triggerLabel: "QR anzeigen",
      modalTitle: "Scannen oder teilen",
      modalSubtitle: "Mit der Handykamera scannen oder Link teilen.",
      copyLabel: "Link kopieren",
      copiedLabel: "Kopiert",
      shareLabel: "Teilen",
      downloadLabel: "QR herunterladen",
      closeLabel: "Schließen",
    },
    contribute: {
      triggerLabel: "Foto senden",
      modalTitle: "Foto senden",
      modalSubtitle:
        "Dein Foto wird vom Karteninhaber geprüft, bevor es erscheint.",
      nameLabel: "Dein Name",
      emailLabel: "E-Mail (optional)",
      messageLabel: "Nachricht (optional)",
      messagePh: "Eine kurze Notiz zum Foto.",
      photoLabel: "Foto",
      photoHint: "JPG, PNG oder WebP · max. 5 MB",
      submitLabel: "Senden",
      submittingLabel: "Wird gesendet…",
      successTitle: "Danke!",
      successBody:
        "Wir haben es an den Inhaber gesendet. Es erscheint nach Freigabe.",
      consentText: "Ich bestätige, dass ich dieses Foto teilen darf.",
      consentRequired: "Bitte Bestätigung markieren.",
      tooLargeError: "Datei zu groß (max. 5 MB).",
      wrongTypeError: "Format nicht unterstützt. Bitte JPG, PNG oder WebP.",
      genericError: "Senden fehlgeschlagen. Bitte später erneut versuchen.",
      rateLimited: "Zu viele Einsendungen. Bitte später erneut versuchen.",
    },
    wallet: {
      notConfigured:
        "Wallet-Unterstützung wird konfiguriert. Apple/Google Wallet-Buttons erscheinen nach der Aktivierung.",
    },
    vcard: {
      label: "In Kontakte speichern",
    },
    share: {
      title: "Karte teilen",
      close: "Schließen",
      qrDownload: "QR herunterladen",
      copyLink: "Link kopieren",
      copied: "Kopiert!",
      whatsapp: "Über WhatsApp teilen",
      whatsappHint: "Sendet ein großes Kartenbild zusammen mit Ihrem Link",
      storyDownload: "Kartenbild (9:16)",
      storyHint: "Für WhatsApp-Status & Instagram-Stories",
      vcardVisitor: "Kontakt speichern",
      vcardOwner: "Meine vCard (.vcf)",
      vcardOwnerHint: "Weiterleiten — andere speichern dich in ihren Kontakten",
      emailSignature: "E-Mail-Signatur",
      copy: "Kopieren",
      openCard: "Karte öffnen",
      shareButtonAriaLabel: "Karte teilen",
    },
    error: {
      title: "Diese Karte kann gerade nicht geöffnet werden",
      body: "Wir konnten den Kartendatensatz nicht laden. Bitte versuche es in wenigen Sekunden erneut.",
      retry: "Erneut versuchen",
    },
    owner: {
      banner:
        "Du bist der Inhaber dieser Karte — Änderungen werden sofort veröffentlicht.",
      publicBannerLabel: "Deine Karte",
      editLabel: "Bearbeiten",
      previewLabel: "Vorschau-Modus",
      shareLabel: "Link teilen",
      manageLabel: "Statistiken & Links",
    },
    manage: {
      title: "Kartenverwaltung",
      subtitle:
        "Statistiken, Teilen-Links und Leads für deine Karte — alles an einem Ort.",
      backToCard: "Karte ansehen",
      editCard: "Karte bearbeiten",
      statsHeading: "Letzte 30 Tage",
      statViews: "Aufrufe",
      statLeads: "Leads",
      statSaves: "Gespeichert",
      statShares: "Geteilt",
      statScans: "Link-Scans",
      linksHeading: "Teilen-Links",
      linksHint:
        "Erstelle pro Kanal einen eigenen Kurzlink — QR auf Drucksachen, E-Mail-Signatur, Instagram-Bio — und sieh, welcher Kanal Besucher bringt.",
      linkLabelPlaceholder: "Bezeichnung (z. B. Messe-QR)",
      linkCodePlaceholder: "Wunsch-Code (optional)",
      linkSourcePlaceholder: "Quelle (z. B. instagram)",
      linkCampaignPlaceholder: "Kampagne (optional)",
      createLink: "Link erstellen",
      creating: "Wird erstellt …",
      linkLimitReached: "Link-Limit für diese Karte erreicht.",
      codeUnavailable:
        "Dieser Code ist vergeben oder ungültig — bitte einen anderen wählen.",
      linkCreateFailed:
        "Der Link konnte nicht erstellt werden. Bitte erneut versuchen.",
      scansLabel: "Scans",
      activeLabel: "Aktiv",
      inactiveLabel: "Aus",
      copyLabel: "Kopieren",
      copiedLabel: "Kopiert",
      qrLabel: "QR",
      disableLabel: "Deaktivieren",
      enableLabel: "Aktivieren",
      noLinksYet:
        "Noch keine Teilen-Links. Deine Karten-URL funktioniert immer — Kurzlinks ergänzen das Tracking pro Kanal.",
      leadsHeading: "Leads",
      leadsHint:
        "Personen, die ihre Kontaktdaten über deine Karte geteilt haben.",
      noLeadsYet:
        "Noch keine Leads. Sie erscheinen hier, sobald jemand „Meine Daten senden“ auf deiner Karte nutzt.",
      leadStatusNew: "Neu",
      leadStatusContacted: "Kontaktiert",
      leadStatusQualified: "Qualifiziert",
      leadStatusArchived: "Archiviert",
      notPublished:
        "Diese Karte ist noch nicht veröffentlicht — Links und Statistiken werden aktiv, sobald sie live ist.",
      publicLinkLabel: "Ihr öffentlicher Kartenlink — diesen teilen",
      publicLinkHint:
        "Jeder mit diesem Link sieht Ihre Karte. Für Chats, E-Mail-Signaturen, QR-Codes.",
      privateLinkLabel: "Ihre privaten Links — nur für Sie",
      privateLinkHint:
        "Diese Verwaltungsseite und Ihre Bearbeitungsseite sind privat: Wer ihre Links hat, kann Ihre Karte ändern. Sie stehen in Ihrer Karten-E-Mail — niemals weitergeben.",
    },
    eventDirectory: {
      eyebrow: "Teilnehmerverzeichnis",
      ctaTitle: "Auch dabei? Erstellen Sie Ihre Karte.",
      ctaBody:
        "Kostenlos, ohne Konto — Ihre Karte ist in Minuten live und Sie erscheinen in dieser Liste.",
      ctaButton: "Karte erstellen",
      participantsHeading: "Teilnehmer",
      participantsHint:
        "Karten, deren Inhaber sich öffentlich listen lassen. Antippen, um den Kontakt anzusehen und zu speichern.",
      emptyState:
        "Noch keine Teilnehmer gelistet — seien Sie der Erste: Karte erstellen und ins Verzeichnis eintragen.",
      searchPlaceholder: "Nach Name, Firma oder Rolle suchen …",
      noResults: "Keine Teilnehmer passen zu Ihrer Suche.",
    },
    mobileAppSoon:
      "Mobile App kommt bald — Karte unterwegs erstellen und verwalten. Heute funktioniert alles im Browser.",
    quickCreate: {
      title: "Ihre Karte in 60 Sekunden",
      subtitle:
        "Fünf Felder, ein Button — Ihre digitale Visitenkarte ist sofort live. Kostenlos, ohne Konto.",
      nameLabel: "Vollständiger Name",
      titleLabel: "Position",
      companyLabel: "Unternehmen",
      phoneLabel: "Telefon",
      emailLabel: "E-Mail",
      emailHint:
        "Ihre privaten Bearbeitungs- und Verwaltungslinks gehen an diese Adresse — bitte prüfen.",
      photoLabel: "Foto hinzufügen (optional)",
      photoChange: "Foto ändern",
      photoHint: "JPG, PNG oder WebP",
      photoError:
        "Foto-Upload fehlgeschlagen — Sie können es später im Editor hinzufügen.",
      submit: "Karte erstellen — kostenlos",
      submitting: "Wird erstellt …",
      errorRequired: "Name, Telefon und E-Mail sind erforderlich.",
      errorGeneric: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
      designHint:
        "Ein cleanes Standard-Design wird angewendet — Design und Details können Sie jederzeit ändern.",
      fullFormLink: "Alle Optionen? Zum ausführlichen Formular",
    },
    ownerWelcome: {
      title: "Ihre Karte ist live!",
      step1Title: "Teilen",
      step1Body:
        "Nutzen Sie den Teilen-Button — er verschickt Ihren öffentlichen Link, den QR-Code oder ein großes Kartenbild per WhatsApp.",
      step2Title: "E-Mail prüfen",
      step2Body:
        "Dort liegen Ihre privaten Bearbeitungs- und Verwaltungslinks. Nicht weitergeben — sie kontrollieren Ihre Karte.",
      step3Title: "Wirkung verfolgen",
      step3Body:
        "Aufrufe, eingehende Kontakte und Kanal-Kurzlinks finden Sie auf Ihrer Verwaltungsseite.",
      manageCta: "Statistiken & Links",
      dismiss: "Verstanden",
    },
    languageSwitcher: "Sprache",
  },

  auth: {
    signup: {
      title: "Konto erstellen",
      subtitle: "Kostenlose digitale Visitenkarte — keine Kreditkarte erforderlich.",
      emailLabel: "E-Mail-Adresse",
      nameLabel: "Name (optional)",
      passwordLabel: "Passwort",
      magicLinkCta: "Magic Link senden",
      passwordCta: "oder mit Passwort fortfahren",
      alreadyHaveAccount: "Bereits ein Konto?",
      signInLink: "Anmelden",
      expandPassword: "+ Passwort hinzufügen",
    },
    login: {
      title: "Willkommen zurück",
      subtitle: "Melden Sie sich an, um Ihre digitalen Visitenkarten zu verwalten.",
      emailLabel: "E-Mail-Adresse",
      passwordLabel: "Passwort",
      magicLinkCta: "Magic Link senden",
      passwordCta: "oder Passwort verwenden",
      dontHaveAccount: "Noch kein Konto?",
      signUpLink: "Jetzt registrieren",
      expandPassword: "+ Passwort verwenden",
      orDivider: "oder",
      googleCta: "Mit Google fortfahren",
    },
    magicLink: {
      title: "Posteingang prüfen",
      subtitle: "Wir haben einen Anmeldelink gesendet an",
      resendCta: "Link erneut senden",
      sentToEmail: "Link gesendet an",
      resendCooldown: "Erneut senden in",
      seconds: "Sekunden",
      backToLogin: "Zurück zur Anmeldung",
    },
    verify: {
      verifying: "Link wird überprüft…",
      successTitle: "Angemeldet",
      successBody: "Sie werden weitergeleitet…",
      errorTitle: "Link abgelaufen oder ungültig",
      errorBody: "Dieser Magic Link wurde bereits verwendet oder ist abgelaufen. Bitte fordern Sie einen neuen an.",
      requestNewLink: "Neuen Link anfordern",
    },
    errors: {
      invalid_email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      weak_password: "Das Passwort muss mindestens 12 Zeichen mit mindestens einem Buchstaben und einer Zahl enthalten.",
      email_in_use: "Diese E-Mail ist bereits registriert. Versuchen Sie sich anzumelden.",
      invalid_credentials: "Ungültige E-Mail oder Passwort.",
      rate_limited: "Zu viele Anfragen — bitte warten Sie einige Minuten und versuchen Sie es erneut.",
      generic: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      invalid_input: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
      email_unavailable: "Diese E-Mail kann nicht für die Registrierung verwendet werden.",
    },
  },

  dashboard: {
    cards: {
      title: "Meine Karten",
      subtitle: "Verwalten und teilen Sie Ihre digitalen Visitenkarten.",
      createNewCta: "Neue Karte erstellen",
      emptyTitle: "Noch keine Karten",
      emptyHint: "Erstellen Sie Ihre erste digitale Visitenkarte und teilen Sie Ihre Kontaktdaten in Sekunden.",
      emptyCta: "Erste Karte erstellen",
    },
    cardItem: {
      editCta: "Bearbeiten",
      shareCta: "Link kopieren",
      deleteCta: "Löschen",
      deleteConfirm: "Diese Karte löschen?",
      viewCountLabel: "Aufrufe",
      statusPublished: "Veröffentlicht",
      statusDraft: "Entwurf",
      statusDeleted: "Archiviert",
    },
    chrome: {
      logoutCta: "Abmelden",
      settingsCta: "Einstellungen",
    },
    claim: {
      bannerTitle: "Wir haben Karten unter Ihrer E-Mail-Adresse gefunden.",
      bannerHint: "Verbinden Sie diese mit Ihrem Konto, um sie hier zu verwalten.",
      claimCta: "Karte verbinden",
      claimingState: "Verbinden…",
      claimedState: "Verbunden",
    },
  },

  onboarding: {
    cancel: "Abbrechen",
    back: "Zurück",
    next: "Weiter",
    steps: {
      industry: "Branche",
      personal: "Über Sie",
      preview: "Vorschau & Veröffentlichen",
    },
    industry: {
      title: "Welche Art von Karte erstellen Sie?",
      subtitle:
        "Wählen Sie eine Branche — wir starten mit einem passenden Design und einer sinnvollen Farbpalette. Alles lässt sich später anpassen.",
      surpriseMe: "Überrasch mich",
      categories: {
        architecture: "Architektur",
        legal: "Recht",
        restaurant: "Restaurant",
        photography: "Fotografie",
        clinic: "Gesundheit",
        music: "Musik",
        barber: "Barbier & Beauty",
        retail: "Einzelhandel",
        realEstate: "Immobilien",
        fitness: "Fitness",
        hospitality: "Hotellerie",
        consulting: "Beratung",
        tech: "Technologie",
        events: "Events",
        dentist: "Zahnarzt",
        psychologist: "Psychologie",
        beauty: "Beauty Salon",
        accounting: "Buchhaltung",
        software: "Software",
        contentCreator: "Content Creator",
        wellness: "Wellness",
        eventPlanner: "Eventplanung",
        auto: "Automobil",
        interior: "Innenarchitektur",
      },
      descriptions: {
        architecture: "Klare Linien, Steinpalette",
        legal: "Seriös, mit Serifen",
        restaurant: "Warm, appetitanregend",
        photography: "Editorial, bildbetont",
        clinic: "Ruhig, vertrauensbildend",
        music: "Mutig, kontrastreich",
        barber: "Klar, maskuliner Raster",
        retail: "Produktnah, lebensnah",
        realEstate: "Premium-Marine & Gold",
        fitness: "Energiegeladen, sportlich",
        hospitality: "Edel, boutiquehaft",
        consulting: "Editorial, exekutiv",
        tech: "Klar, präzise, modern",
        events: "Festlich, feierlich",
        dentist: "Hell, freundlich",
        psychologist: "Weich, einladend",
        beauty: "Elegant, gepflegt",
        accounting: "Vertrauenswürdig, strukturiert",
        software: "Entwickler-Mindset, Mono",
        contentCreator: "Lebhaft, persönlich",
        wellness: "Ruhig, organisch",
        eventPlanner: "Romantisch, zeremoniell",
        auto: "Mutig, performanceorientiert",
        interior: "Warm, gewebte Neutraltöne",
      },
    },
    personal: {
      title: "Erzählen Sie uns von sich",
      subtitle:
        "Wir haben vorab ausgefüllt, was wir wissen. Ergänzen Sie Berufsbezeichnung und Telefon — der Rest ist optional.",
      nameLabel: "Vollständiger Name",
      namePlaceholder: "Anna Fischer",
      titleLabel: "Berufsbezeichnung",
      titlePlaceholder: "Gründerin & Designerin",
      emailLabel: "E-Mail",
      emailHint:
        "Mit Ihrem Konto verknüpft — ändern Sie sie später in den Einstellungen.",
      phoneLabel: "Telefon",
      companyLabel: "Unternehmen",
      companyPlaceholder: "Atelier Nord",
      bioLabel: "Kurzbeschreibung",
      bioPlaceholder: "Ein oder zwei Sätze, die Sie vorstellen.",
      photoLabel: "Profilfoto",
      photoCta: "Foto hier ablegen",
      photoHint: "Ziehen oder klicken zum Hochladen — JPG/PNG bis 5 MB",
      photoBrowse: "Datei wählen",
      photoUploading: "Wird hochgeladen…",
      photoUploaded: "Foto hochgeladen",
      photoChange: "Klicken Sie auf das Mülleimer-Symbol zum Ersetzen",
      photoRemove: "Foto entfernen",
      brandColorLabel: "Markenfarbe",
      skipCta: "Überspringen & abschließen",
    },
    preview: {
      title: "Fast geschafft — letzter Blick",
      subtitle:
        "Prüfen Sie Ihre Karte rechts und wählen Sie die Adresse, die Sie teilen möchten.",
      slugLabel: "Karten-Adresse",
      slugChecking: "Wird geprüft…",
      slugAvailable: "Verfügbar",
      slugTaken: "Vergeben",
      slugTakenHint: "Diese Adresse ist vergeben — probieren Sie eine Variante.",
      slugReset: "Auf Standard zurücksetzen",
      summaryName: "Name",
      summaryTitle: "Position",
      summaryCompany: "Unternehmen",
      summaryPhone: "Telefon",
      summaryEmail: "E-Mail",
      livePreviewLabel: "Live-Vorschau",
      previewFallbackName: "Ihr Name",
      publishCta: "Karte veröffentlichen",
      publishingState: "Wird veröffentlicht…",
      draftCta: "Als Entwurf speichern",
      draftingState: "Wird gespeichert…",
    },
    errors: {
      name_too_short: "Name muss mindestens 2 Zeichen lang sein.",
      name_too_long: "Name ist zu lang.",
      title_required:
        "Berufsbezeichnung ergänzen (oder „Überspringen & abschließen“ klicken).",
      phone_invalid: "Diese Telefonnummer scheint nicht korrekt zu sein.",
      brand_invalid: "Bitte 6-stelligen Hex-Code verwenden (z. B. #1a365d).",
      slug_invalid:
        "Mindestens 3 Zeichen: Kleinbuchstaben, Zahlen, Bindestriche.",
      slug_taken:
        "Diese Adresse ist bereits vergeben — bitte wählen Sie eine andere.",
      upload_failed:
        "Upload fehlgeschlagen — bitte versuchen Sie eine andere Datei.",
      upload_too_large: "Dieses Bild ist über 5 MB — bitte ein kleineres wählen.",
      network_error:
        "Etwas ist schiefgelaufen — bitte Verbindung prüfen und erneut versuchen.",
    },
  },
} as const;
