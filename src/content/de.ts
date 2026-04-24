// =============================================================================
// GERMAN CONTENT (Deutsch)
// Struktur identisch mit en.ts — alle Werte ins Deutsche übersetzt (Siezen).
// =============================================================================

import type { Content } from "./en";

export const content: Content = {
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
      ratingPill: "OpSolid · Automation Studio · Sitz in Deutschland",
      title: [
        "Automatisierung, die",
        "Ihren Betrieb steuert —",
        "nicht umgekehrt.",
      ],
      subtitle:
        "OpSolid entwickelt praxisnahe Automatisierungs- und KI-Systeme für den echten Geschäftsbetrieb — Workflow-Automatisierung, Systemintegration, interne Tools und KI-gestützte Prozesse. In Deutschland gehostet. Keine Abhängigkeit vom Anbieter.",
      primaryCtaLabel: "Erstgespräch buchen",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Leistungen ansehen",
      secondaryCtaHref: "/solutions",
      footnote: "Sitz in Deutschland  ·  DSGVO-nativ  ·  Keine Lock-ins",
      consultingNote:
        "Wir liefern auch eigenständige Produkte — Kutasia, Digital Business Card, Digital Reception.",
      editorial: {
        eyebrow: "[ 01 / 04 ]   AUTOMATION STUDIO — HAMBURG, DE",
        title: [
          "Wir bauen die Systeme,",
          "die euer Betrieb",
          "längst vorzeigen müsste.",
        ],
        paragraph:
          "Praxisnahe Automatisierung für den Mittelstand — Bestellungen, Dokumente, Freigaben, Kommunikation. Kein Umbau Ihres Stacks, kein KI-Theater, keine Abhängigkeit vom Anbieter.",
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

    trustStrip: {
      items: [
        "Aus Deutschland",
        "DSGVO-nativ",
        "n8n · Make · KI-gestützt",
        "Keine Anbieter-Lock-ins",
        "ISO 27001-orientiert",
        "EN · DE · TR",
      ],
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
            "End-to-End-Automatisierung für repetitive, regelbasierte Arbeit — mit n8n, Make und maßgeschneiderten Integrationen. Saubere Fehlerbehandlung, kein brüchiger Klebecode.",
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
            "Self-hosted oder deployed auf Hetzner / IONOS Frankfurt. DSGVO-nativ. Keine US-Subauftragnehmer, außer Sie möchten es explizit.",
        },
      ],
    },

    howItWorks: {
      label: "Vorgehen",
      headline: "Drei Schritte. Kein Lock-in. Keine Blackbox.",
      steps: [
        {
          title: "Analyse",
          description:
            "Wir kartieren Ihre tatsächlichen Prozesse, identifizieren Engpässe und finden heraus, wo Automatisierung sich rechnet. Sie erhalten einen schriftlichen Scope, bevor Code entsteht.",
        },
        {
          title: "Design & Umsetzung",
          description:
            "Wir wählen den passenden Stack (n8n, Make, Custom-Code oder KI) und entwickeln, testen und deployen iterativ — mit klaren Updates in jedem Schritt.",
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
      headline: "Teams, deren Betrieb nicht manuell bleiben darf.",
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
            "Interne Ops-Leads, die statt noch mehr Tabellen endlich verlässliche interne Tools, Freigabe-Workflows und Dashboards brauchen.",
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
            "Workflow-Automatisierung (n8n, Make, Custom)",
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
            "Alle DSGVO-nativ · gehostet in Deutschland",
          ],
          ctaLabel: "Alle Produkte ansehen",
          ctaHref: "/products",
          tone: "dark",
        },
      ],
    },

    testimonials: {
      label: "Notizen von Operations-Leads",
      headline: "Was Teams nach der Zusammenarbeit mit OpSolid bemerken.",
      items: [
        {
          quote:
            "Wir kopieren keine Bestelldaten mehr zwischen vier Systemen. Was früher zwei Stunden morgens gekostet hat, läuft jetzt bevor jemand den Laptop öffnet.",
          name: "Lena Richter",
          role: "Head of Operations",
          company: "Berliner Handelsgruppe",
        },
        {
          quote:
            "OpSolid wollte uns keine Plattform verkaufen. Sie haben unseren echten Prozess kartiert, das Langweilige automatisiert und uns volle Dokumentation übergeben.",
          name: "Marco Weber",
          role: "COO",
          company: "Industrieunternehmen aus München",
        },
        {
          quote:
            "Der gesamte Integrationslayer ist self-hosted. Keine US-Subauftragnehmer. Legal hat in einem einzigen Meeting freigegeben — das allein war es wert.",
          name: "Sarah Klein",
          role: "IT-Leitung",
          company: "Hamburger Dienstleistungsunternehmen",
        },
      ],
    },

    finalCta: {
      eyebrow: "BEREIT?",
      headline:
        "Schauen wir, was sich tatsächlich automatisieren lässt.",
      description:
        "Buchen Sie ein kostenloses Erstgespräch. Wir zeigen ehrlich, wo Automatisierung sich rechnet — und wo nicht.",
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
      heading: "Agenten, die wirklich ans Telefon gehen",
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
        subsections: [
          {
            title: "Keine Tracking-Cookies",
            content:
              "Diese Website verwendet keine Tracking-Cookies. Eine Sprachpräferenz wird im lokalen Speicher Ihres Browsers gespeichert, um Ihre ausgewählte Sprache zu merken.",
          },
          {
            title: "Vercel Analytics",
            content:
              "Wir nutzen auf dieser Website Vercel Analytics, das anonyme Seitenaufruf-Zählungen ohne Cookies und ohne personenbezogene Kennungen erfasst. Einzelne Besucherinnen und Besucher können damit nicht identifiziert werden.",
          },
        ],
      },
      {
        title: "6. Ihre Rechte",
        content:
          "Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten, Berichtigung oder Löschung, Einschränkung der Verarbeitung sowie Beschwerde bei einer Aufsichtsbehörde. Wurde eine Einwilligung erteilt, können Sie diese jederzeit widerrufen.",
      },
      {
        title: "7. Digital Business Card Produkt",
        subsections: [
          {
            title: "Zweck & Rechtsgrundlage",
            content:
              "Wir verarbeiten die Kontaktdaten, die Sie über das Digital Business Card Lead-Formular übermitteln (Name, geschäftliche E-Mail, Unternehmen, Teamgröße, Nachricht, DSGVO-Einwilligung), ausschließlich zur Beantwortung Ihrer Anfrage. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage) und Art. 6 Abs. 1 lit. a DSGVO (Ihre ausdrückliche Einwilligung).",
          },
          {
            title: "Hosting",
            content:
              "Kartendaten und Lead-Übermittlungen werden innerhalb der Europäischen Union auf Servern in Frankfurt am Main, Deutschland (Hetzner / IONOS) gespeichert. Keine US-Subauftragsverarbeiter.",
          },
          {
            title: "Aufbewahrung",
            content:
              "Lead-Daten werden 24 Monate aufbewahrt. Inaktive Digital Business Card Profile werden nach 12 Monaten Inaktivität und nach vorheriger Erinnerungs-E-Mail gelöscht.",
          },
          {
            title: "Recht auf Löschung",
            content:
              "Sie können Ihr Digital Business Card Profil und alle zugehörigen Daten mit einem Klick in Ihrem Konto oder per E-Mail an contact@opsolid.de löschen. Die Löschung wird innerhalb von 30 Tagen wirksam.",
          },
        ],
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
        "n8n",
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
        stack: "OpenAI · n8n · Supabase · HubSpot",
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
        stack: "Cal.com · Retell · n8n · Google Calendar",
      },
      {
        name: "E-Mail-Automatisierungs-Agent",
        tagline: "Outreach · Triage · Antwortentwürfe",
        description:
          "KI-E-Mail-Workflows — Cold Outreach mit personalisierten Varianten, Inbox-Triage, Auto-Entwürfe zur Freigabe. Gebaut auf Instantly / AgentMail / eigene n8n-Flows. Zustellbarkeit aufgewärmt, DSGVO-konform.",
        status: "Live",
        href: "/products/email-agent",
        externalUrl: "",
        icon: "mail",
        startingPrice: "Ab €99 – €499/Monat",
        category: "Kommunikation",
        stack: "Instantly · AgentMail · n8n · OpenAI",
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
        stack: "Retell · HubSpot · n8n · Supabase",
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
        eyebrow: "[ OPSOLID PRODUKT · 01 ]   DIGITALE VISITENKARTE",
        title: [
          "Handgefertigte",
          "digitale Visitenkarten,",
          "geliefert in 48 Stunden.",
        ],
        paragraph:
          "Ein handgefertigtes, einseitiges digitales Profil, das wir für Sie bauen. Teilbar als Link oder QR-Code. Über 20 Branchenvorlagen als Ausgangspunkt. Deutsches Hosting, DSGVO-nativ — keine Abo-Fallen.",
        primaryCta: "Karte starten",
        secondaryCta: "20 Live-Vorlagen ansehen",
        tags: "LINK · QR-CODE · CUSTOM DESIGN · 48H LIEFERUNG · DEUTSCHES HOSTING",
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
            title: "Handgefertigt für Sie",
            desc: "Wir passen die Vorlage mit Ihren Daten, Farben und Fotos an. Lieferung in 48–72 Stunden. Überarbeitungen inklusive.",
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
            title: "Gehostet in Deutschland",
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
            name: "Starter",
            price: "€49",
            cadence: "einmalig · 1. Jahr Hosting inklusive",
            popular: "",
            bullets: [
              "1 Branchenvorlage aus unserer Bibliothek",
              "Link + QR-Code (PNG + SVG)",
              "2 Überarbeitungen inklusive",
              "E-Mail-Signatur-Snippet",
              "1 Jahr Hosting auf opsolid.de/c/ihr-name",
              "Hosting-Verlängerung: €9/Jahr ab Jahr 2",
            ],
            cta: "Starter beginnen",
            href: "#lead",
          },
          {
            name: "Professional",
            price: "€149",
            cadence: "einmalig · €9/Jahr Hosting ab Jahr 2",
            popular: "true",
            bullets: [
              "Jede Vorlage + leichte Anpassung",
              "Eigener Slug (opsolid.de/c/ihre-marke)",
              "5 Überarbeitungen inklusive",
              "Analysen (Aufrufe, Link-Klicks)",
              "E-Mail-Signatur + Social-Media-Grafiken",
              "Mehrsprachig (DE/EN/TR) optional",
            ],
            cta: "Professional beginnen",
            href: "#lead",
          },
          {
            name: "Custom",
            price: "Ab €299",
            cadence: "Angebot pro Projekt",
            popular: "",
            bullets: [
              "Vollständig individuelles Design (keine Vorlage)",
              "Eigene Domain (ihrname.de)",
              "Mehrsprachig (DE/EN/TR)",
              "Erweiterte Analysen",
              "Team-Roster (5+ Karten, Preis pro Projekt)",
              "CRM-Integration bei Bedarf",
            ],
            cta: "Angebot anfragen",
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
            "Danke — Antwort innerhalb eines Werktages mit Vorschau-Link.",
          error:
            "Etwas ist schiefgegangen. Bitte direkt an contact@opsolid.de schreiben.",
        },
      },
      testimonials: {
        label: "SOZIALE BEWÄHRUNG",
        heading: "Was Kunden nach ihrer ersten Karte sagen.",
        items: [
          {
            quote:
              "Die Karte war in zwei Tagen fertig. Der Designer hat tatsächlich verstanden, was eine Maklerin auf einer Profilseite braucht — ich musste kaum etwas ändern.",
            name: "Lena Richter",
            role: "Selbstständige Maklerin",
            company: "Berlin, DE",
          },
          {
            quote:
              "Dass die Daten in Deutschland bleiben, hat unser Legal-Team überzeugt. Allein das war den Preis wert.",
            name: "Marco Weber",
            role: "COO",
            company: "Industrieunternehmen aus München",
          },
          {
            quote:
              "Kein Monatsabo. Kein „Enterprise-Stufe“-Upsell. Einmal bezahlt, Karte bekommen, QR bekommen, weitergemacht. Genau das wollte ich.",
            name: "Sarah Klein",
            role: "Selbstständige Beraterin",
            company: "Berlin, DE",
          },
        ],
      },
      howItWorks: {
        label: "SO LIEFERN WIR",
        heading: "Vier Schritte. Karte live in 48 Stunden.",
        steps: [
          {
            title: "01 · Bestellung",
            description:
              "Kurzformular ausfüllen: Branche, Basisdaten, bevorzugte Vorlage. Einmalgebühr bezahlen.",
          },
          {
            title: "02 · Design",
            description:
              "Innerhalb von 48–72 Stunden senden wir Ihnen einen Vorschau-Link Ihres angepassten Profils.",
          },
          {
            title: "03 · Überarbeitungen",
            description:
              "Sagen Sie uns, was geändert werden soll. 2–5 Runden je nach Tarif. Keine Express-Gebühren.",
          },
          {
            title: "04 · Lieferung",
            description:
              "Sie erhalten: den Live-Link, QR-Code (PNG + SVG), E-Mail-Signatur-Snippet. Alles gehört Ihnen.",
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
              "48–72 Stunden ab dem Moment, in dem wir Ihre Daten und Zahlung haben. Express-Lieferung in Professional und Custom möglich — fragen Sie uns.",
          },
          {
            question: "Versenden Sie eine physische NFC-Karte?",
            answer:
              "Noch nicht. Wir konzentrieren uns aktuell auf rein digital: Link + QR. Der Kunde scannt Ihren QR-Code oder öffnet Ihren Link und sieht Ihr Profil. Keine Hardware nötig. Physische NFC-Karten kommen später möglicherweise als Add-on.",
          },
          {
            question: "Kann ich meine Karte später selbst bearbeiten?",
            answer:
              "Sie senden uns die Änderungen, wir aktualisieren innerhalb eines Werktages. In Custom richten wir einen einfachen Editor für Sie ein. In Starter und Professional laufen Änderungen über uns.",
          },
          {
            question: "Wo werden meine Daten gespeichert?",
            answer:
              "Frankfurt, Deutschland — Hetzner / IONOS. Keine US-Subunternehmer. Ein AV-Vertrag liegt auf Anfrage bereit.",
          },
          {
            question: "Kann ich meine Karte kündigen oder löschen?",
            answer:
              "Ja, jederzeit. Ein-Klick-Löschung. Keine Auto-Verlängerungsfallen. Hosting wird ab Jahr 2 jährlich im Voraus bezahlt.",
          },
          {
            question: "Ich brauche 10+ Karten für mein Team. Wie?",
            answer:
              "Custom-Tarif. Wir erstellen ein projektbezogenes Angebot, abhängig davon, wie viel die Karten gemeinsam haben sollen. Schreiben Sie an contact@opsolid.de.",
          },
        ],
      },
      cta: {
        eyebrow: "BEREIT?",
        heading: "Ihre neue Karte. Live in 48 Stunden.",
        primaryCta: "Karte starten",
        secondaryCta: "Vorlagen ansehen",
      },
      preview: {
        meta: {
          title: "Digitale Visitenkarte — Live-Vorschau | OpSolid",
          description:
            "Probieren Sie alle 5 Designs auf Ihrem Handy. Wischen Sie nach links oder rechts. Bestellen Sie das Lieblingsdesign — €29 einmalig, €5/Monat oder €39/Jahr.",
        },
        eyebrow: "LIVE-VORSCHAU",
        title: "Designs auf dem Handy ausprobieren",
        subtitle:
          "5 Designs. Nach links oder rechts wischen. Ihr Favorit wird bestellt.",
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
        },
        form: {
          eyebrow: "BESTELLUNG",
          title: "Ihre Daten, Ihr Design, Ihre Karte.",
          subtitle:
            "Füllen Sie das Formular aus — die Karte wird direkt nach der Zahlung unter opsolid.de/c/… veröffentlicht.",
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
          designNotes: "Anmerkungen zum Design (optional)",
          designNotesPh:
            "Haben Sie besondere Wünsche? Schriften, Logos, Beispiele …",
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
        },
      },
      edit: {
        title: "Karte bearbeiten",
        subtitle:
          "Tippfehler, Telefonnummern, Social Links — ändern Sie alles selbst. Änderungen sind sofort live.",
        publicUrlLabel: "Ihre öffentliche Karte:",
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
        error: "Kündigung konnte nicht geplant werden. Bitte E-Mail an contact@opsolid.de.",
        doneBody:
          "Kündigung vorgemerkt. Ihre Karte bleibt bis zum {date} live. Eine abschließende Bestätigung senden wir per E-Mail.",
        doneClose: "Schließen",
      },
      meta: {
        title:
          "Digitale Visitenkarte — Handgefertigt, in Deutschland gehostet | OpSolid",
        description:
          "Eine handgefertigte einseitige digitale Visitenkarte mit Link und QR-Code. Über 20 Branchenvorlagen. Lieferung in 48 Stunden. In Deutschland gehostet, DSGVO-nativ.",
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
          { name: "n8n", role: "CRM-Sync + Post-Call-Workflows" },
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
        heading: "Ehrliche Antworten.",
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
        tags: "OPENAI · n8n · SUPABASE · MULTI-KANAL",
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
          { name: "n8n", role: "Kanal-Orchestrierung + CRM-Sync" },
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
        heading: "Ehrliche Antworten.",
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
          { name: "n8n", role: "Workflow-Orchestrierung" },
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
        heading: "Ehrliche Antworten zu einem undurchsichtigen Kanal.",
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
        tags: "CAL.COM · RETELL · N8N · GOOGLE KALENDER",
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
          { name: "n8n", role: "Erinnerungs- + Nachfass-Workflows" },
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
        heading: "Ehrliche Antworten.",
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
          "KI-E-Mail-Workflows, die wirklich laufen: personalisierter Cold Outreach, Eingangs-Triage und automatisch erstellte Antwortentwürfe zur Freigabe durch einen Menschen. Gebaut auf Instantly, AgentMail und eigenen n8n-Flows. Aufgewärmte Zustellbarkeit, DSGVO-konform.",
        primaryCta: "Demo buchen",
        secondaryCta: "So funktioniert's",
        tags: "INSTANTLY · AGENTMAIL · n8n · OPENAI",
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
          { name: "n8n", role: "Individuelle Workflow-Verklebung" },
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
        heading: "Ehrliche Antworten zu einem standardmäßig spammigen Kanal.",
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
        tags: "RETELL · HUBSPOT · N8N · SCORING",
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
          { name: "n8n", role: "Routing + Slack-/Cal.com-Übergabe" },
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
        heading: "Ehrliche Antworten.",
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
        heading: "Klein, ehrlich, monatlich. Jederzeit kündbar.",
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
            "Etwas ist schiefgegangen. Bitte schreiben Sie direkt an contact@opsolid.de.",
        },
      },
      faq: {
        label: "FAQ",
        heading: "Ehrliche Antworten.",
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
        title: "Digitale Rezeption — KI-Empfang für Hotels, Kliniken & Salons | OpSolid",
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
      voiceAgent: "Voice Agent",
      digitalCard: "Digital Card",
      kutasia: "Kutasia",
      journal: "Journal",
      contact: "Kontakt",
      cta: "Gespräch buchen",
    },

    footer: {
      tagline:
        "Unabhängiges Automatisierungsstudio. Hamburg · Frankfurt. GDPR-native Infrastruktur, kein Vendor-Lock-in.",
      chipLive: "FRA · DE",
      chipLanguages: "EN · DE · TR",
      cols: {
        productsHeading: "Produkte",
        servicesHeading: "Leistungen",
        studioHeading: "Studio",
        legalHeading: "Rechtliches",
        services: {
          workflow: "Workflow-Automatisierung",
          integration: "Systemintegration",
          internal: "Interne Tools",
          ai: "KI-gestützte Prozesse",
        },
        studio: {
          journal: "Journal",
          contact: "Kontakt",
        },
        legal: {
          privacy: "Datenschutz",
          imprint: "Impressum",
        },
      },
      base: {
        copyrightSuffix: "OpSolid UG · Hamburg, DE",
        trustLine: "GDPR-native · Hosted in Frankfurt · No US subprocessors",
      },
    },

    home: {
      hero: {
        metaChip: "AUTOMATION STUDIO",
        metaLabel: "[ 01 / 04 ] HAMBURG · DE",
        title: {
          pre: "Automatisierung, die Ihre Abläufe ",
          italic: "tatsächlich",
          post: " steuert — und nicht umgekehrt.",
        },
        lead:
          "OpSolid baut die Systeme, die Ihre Abläufe schon längst haben sollten. Workflow-Automatisierung, Systemintegration, interne Tools und KI-gestützte Prozesse für mittelständische Teams. Kein Stack-Rebuild. Kein KI-Theater.",
        ctaPrimary: "Discovery-Call buchen",
        ctaSecondary: "Was OpSolid baut",
        stats: [
          { value: "EU", label: "Hosted in Frankfurt" },
          { value: "DE · EN · TR", label: "Kundensprachen" },
          { value: "Q2 '26", label: "Pilot · Partner willkommen" },
        ],
      },

      capabilities: {
        eyebrow: "[ 02 / 04 ] LEISTUNGEN",
        headline: "Vier Bereiche, die OpSolid durchgängig verantwortet.",
        lead:
          "Keine Plattform. Kein Marktplatz. Ein kleines Studio, das Abläufe nimmt, wie sie sind — manuell, halbautomatisiert, zusammengestückelt — und sie als Systeme hinterlässt, die ohne Betreuung laufen.",
        cards: [
          {
            icon: "workflow",
            title: "Workflow-Automatisierung",
            body:
              "Aufträge, Dokumente, Freigaben, Kommunikation. Gebaut auf n8n, Make und eigenen Konnektoren, wo diese nicht ausreichen — nie auf Black-Box-SaaS.",
            tag: "N8N · MAKE · CUSTOM",
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
          pre: "Die Zahlen, die die Branche ",
          italic: "bereits",
          post: " kennt.",
        },
        body:
          "OpSolid ist vor dem Markt — keine erfundenen Fallstudien-Zahlen. Stattdessen: die öffentliche Referenz, an der jede Automatisierung gemessen wird. Jede Zeile zitiert ihre Quelle.",
        chipBefore: "BRANCHENMEDIAN",
        chipAfter: "AUTOMATISIERUNGSZIEL",
        rows: [
          {
            label: "Quote-to-Cash Zykluszeit",
            sub: "APQC Open Standards Benchmarking · 2023",
            value: "3–7 Tage",
            delta: "vs. <4h automatisiert",
          },
          {
            label: "Manuelle Touches pro Auftrag",
            sub: "Forrester TEI · Mittelstand-Ops, 2024",
            value: "4–9",
            delta: "vs. 1–2 automatisiert",
          },
          {
            label: "Voice-Agent p50-Latenz",
            sub: "Retell + GPT-4o + Deepgram Nova-3, öffentliche Werte 2025",
            value: "<800ms",
            delta: "end-to-end, menschennah",
          },
          {
            label: "Vendor-Lock-in bis Ausstieg",
            sub: "OpSolid-Prinzip · Quellcode gehört Ihnen",
            value: "0",
            delta: "gemessen in Wochen",
          },
        ],
      },

      process: {
        eyebrow: "[ 04 / 04 ] VORGEHEN",
        headline: "Drei Schritte. Kein Lock-in. Kein Geheimnis.",
        lead:
          "Jedes Mandat folgt derselben Form: Bestand kartieren, das Kleinste liefern, das Schmerz entfernt, dann nur dort ausbauen, wo es sich weiter auszahlt. Empfohlen, wo es passt — abgeraten, wo nicht.",
        steps: [
          {
            num: "01",
            title: "Operations-Walkthrough",
            body:
              "90-minütige Tiefenanalyse, wie Arbeit heute fließt. Liefert eine schriftliche Karte jeder manuellen Übergabe, jeder fragilen Integration, jeder Stelle, an der das Geschäft am Kalender einer Person statt an einem System hängt.",
            chipA: "1 Session · 90 Min.",
            chipB: "Schriftliche Karte · PDF",
          },
          {
            num: "02",
            title: "Kleinste ehrliche Automatisierung",
            body:
              "Ein Workflow, End-to-End, in drei Wochen produktiv. Gebaut auf Tools, die Ihr Team selbst öffnen und prüfen kann. Wenn sich der ROI im ersten Monat nicht zeigt, endet das Mandat dort.",
            chipA: "3 Wochen · fixer Umfang",
            chipB: "Produktionsreif",
            chipBHot: true,
          },
          {
            num: "03",
            title: "Ausbau, wo es sich weiter trägt",
            body:
              "Laufendes Retainer-Mandat, monatlich oder quartalsweise. Neue Flächen nur, wenn die bestehenden stabil sind. Übergabe-Notizen, Runbooks und vollständiger Quellcode gehören Ihnen ab Tag eins — der Ausstieg ist immer zwei Wochen entfernt.",
            chipA: "Monatsretainer",
            chipB: "Quellcode gehört Ihnen",
          },
        ],
      },

      finalCta: {
        eyebrow: "[ KONTAKT ]",
        title: {
          pre: "Sehen wir, was sich ",
          italic: "tatsächlich",
          post: " automatisieren lässt.",
        },
        lead:
          "30 Minuten. Operations-Walkthrough, klare Einschätzung und schriftlicher Plan. Kein Pitch-Deck, keine Sales-Motion — und keine Verpflichtung, wenn Automatisierung nicht das richtige Werkzeug ist.",
        ctaPrimary: "Discovery-Call buchen",
        ctaSecondary: "Journal lesen",
        trustLine:
          "BUILT IN GERMANY · GDPR-NATIVE · NO VENDOR LOCK-IN · EN · DE · TR",
      },
    },
  },
} as const;
