// =============================================================================
// GERMAN CONTENT (Deutsch)
// Struktur identisch mit en.ts — alle Werte ins Deutsche übersetzt (Siezen).
// =============================================================================

import type { Content } from "./en";

export const content: Content = {








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
      "Diese selbst erstellte Datenschutzerklärung umfasst die DSGVO (EU) und KVKK (Türkei) für die OpSolid-Marketing-Site sowie das OpSo Smart-Produkt (Digital Business Card). Eine anwaltlich geprüfte Endfassung ersetzt diesen Hinweis nach der Gewerbeanmeldung. Letzte Durchsicht: Hasan Dönmez.",
    lastUpdated: "Letzte Aktualisierung: Oktober 2026",
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
              "Über das Kontaktformular übermittelte Daten (Name, E-Mail-Adresse, optional Unternehmen, gewählte Themen und Nachricht) werden zur Bearbeitung der Anfrage und für Rückfragen gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bei vertragsbezogenen Anfragen, Art. 6 Abs. 1 lit. f DSGVO bei berechtigtem Interesse oder Art. 6 Abs. 1 lit. a DSGVO bei erteilter Einwilligung. KVKK-Grundlage: Art. 5(2)(c) (Vertragserfüllung) bzw. Art. 5(1) açık rıza.",
          },
          {
            title: "Server-Log-Dateien",
            content:
              "Der Hosting-Anbieter erfasst automatisch Browsertyp, Betriebssystem, Referrer-URL, Hostname, IP-Adresse (wo möglich gekürzt) und Zeitpunkt der Anfrage. Aufbewahrung: 14 Tage zur Sicherheits- und Missbrauchsanalyse, danach Löschung. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Betrieb).",
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
            title: "Erforderliche und selbst gewählte Einstellungen",
            content:
              "Wir speichern nur, was technisch erforderlich ist oder was Sie selbst wählen. Dazu gehören ein Sprach-Cookie, das nur gesetzt wird, wenn Sie die Sprache selbst umstellen; die Einstellung des Schalters „3D-Effekte“ im Seitenfuß, die nur bei Benutzung im localStorage Ihres Browsers gespeichert wird; und in Konto- und Kartenbereichen ein Sitzungs-Cookie nach der Anmeldung sowie einzelne Anzeige-Einstellungen und Formularentwürfe im localStorage. Diese Angaben dienen nur dazu, Ihre Auswahl umzusetzen oder den Dienst bereitzustellen, und werden nicht an Dritte weitergegeben. Sie sind nach § 25 Abs. 2 TDDDG einwilligungsfrei; deshalb zeigt diese Website kein Cookie-Banner.",
          },
          {
            title: "Keine Analyse",
            content:
              "Diese Website setzt kein Analyse- oder Tracking-Tool ein: keine Zählung von Seitenaufrufen, keine Besucherprofile, keine Tracking-Cookies.",
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
          "Soweit personenbezogene Daten in Länder außerhalb des Europäischen Wirtschaftsraums übermittelt werden (z. B. an Stripe, OpenAI oder Anthropic in den USA), erfolgt dies (a) auf Grundlage des Angemessenheitsbeschlusses zum EU-US Data Privacy Framework, sofern der Empfänger DPF-zertifiziert ist, oder (b) auf Grundlage der Standardvertragsklauseln (SCC, EU 2021/914) mit dokumentiertem Transfer Impact Assessment. Für betroffene Personen mit Wohnsitz in der Türkei gelten zusätzlich KVKK Art. 9 zur Yurtdışı Aktarım: Übermittlungen erfolgen unter KVKK-Standardvertragsklauseln (Yönetmelik 10.07.2024) und werden, sofern vorgesehen, dem Kurum innerhalb von 5 Werktagen gemeldet.",
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
            title: "Marketing-E-Mails (Einwilligung / Double-Opt-in)",
            content:
              "Werbliche E-Mails (Produktneuigkeiten und Angebote zu OpSo Smart) senden wir Ihnen nur mit Ihrer vorherigen ausdrücklichen Einwilligung (§ 7 UWG, Art. 6 Abs. 1 lit. a DSGVO). Die Einwilligung wird getrennt von der Kontoerstellung über ein nicht vorausgewähltes Kontrollkästchen erteilt und im Double-Opt-in-Verfahren per Bestätigungs-E-Mail verifiziert; erst nach Ihrer Bestätigung versenden wir Marketing-E-Mails. Zum Nachweis protokollieren wir den genauen Einwilligungstext, Zeitstempel sowie eine gehashte (nicht im Klartext gespeicherte) IP-Adresse. Sie können die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen — über den Abmeldelink in jeder E-Mail oder per E-Mail an info@opsolid.de. Der Widerruf lässt die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung unberührt.",
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
    posts: [
      {
        slug: "eu-ai-act-august-2026-omnibus-compliance",
        title: "EU-KI-Verordnung ab 2. August 2026 anwendbar: Was die Omnibus-Änderungen für Ihr Unternehmen bedeuten",
        seoTitle: "EU-KI-Verordnung ab 2. August 2026 anwendbar",
        excerpt:
          "Ab dem 2. August 2026 ist die KI-Verordnung weitgehend anwendbar. Was Omnibus VII geändert hat – und welche Transparenzpflichten ab diesem Tag gelten.",
        category: "ai",
        date: "2026-07-07",
      },
      {
        slug: "workflow-automation-fundamentals",
        title: "Workflow-Automatisierung: Was in der Praxis wirklich zählt",
        seoTitle: "Workflow-Automatisierung: Was im Betrieb zählt",
        excerpt:
          "Was eine Automatisierung im laufenden Betrieb trägt: Fehlerbehandlung, Datenhoheit, Nachvollziehbarkeit und Ausstiegskosten – unabhängig vom Werkzeug.",
        category: "automation",
        date: "2026-03-15",
      },
      {
        slug: "5-signs-your-business-needs-process-automation",
        title: "5 Anzeichen, dass Ihr Unternehmen Prozessautomatisierung braucht",
        seoTitle: "5 Anzeichen, dass Sie Prozessautomatisierung brauchen",
        excerpt:
          "Verbringt Ihr Team zu viel Zeit mit manueller Arbeit? Hier sind die wichtigsten Indikatoren, dass es Zeit ist, in Automatisierung zu investieren.",
        category: "operations",
        date: "2026-03-08",
      },
      {
        slug: "connecting-crm-erp-the-integration-playbook",
        title: "CRM und ERP verbinden: ein Überblick",
        excerpt:
          "Ein praktischer Überblick zur Synchronisierung Ihrer CRM- und ERP-Systeme – Datensilos abbauen und eine zentrale Datenquelle schaffen.",
        category: "integration",
        date: "2026-02-28",
      },
      {
        slug: "ai-chatbots-vs-rule-based-bots",
        title: "KI-Chatbots vs. regelbasierte Bots: Was brauchen Sie?",
        excerpt:
          "Den Unterschied zwischen KI-gestützten und regelbasierten Chatbots verstehen – und wann welcher Ansatz für Ihr Unternehmen sinnvoll ist.",
        category: "ai",
        date: "2026-02-20",
      },
      {
        slug: "choosing-the-right-automation-architecture",
        title:
          "Die richtige Automatisierungsarchitektur für Ihr Unternehmen wählen",
        seoTitle: "Die richtige Automatisierungsarchitektur wählen",
        excerpt:
          "Direkte Schnittstellen, zentrale Orchestrierung oder hybrid? Entscheiden Sie nach Volumen, Compliance und Teamgröße, nicht nach Verkaufsargumenten.",
        category: "automation",
        date: "2026-02-12",
      },
      {
        slug: "whatsapp-business-automation-guide",
        title: "WhatsApp-Business-Automatisierung: ein Überblick",
        excerpt:
          "So automatisieren Sie Kundenkommunikation über WhatsApp – von Bestellbestätigungen bis zu Support-Bots – ohne die persönliche Note zu verlieren.",
        category: "automation",
        date: "2026-02-05",
      },
    ],
  },

  faq: {
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
  },

  products: {
    comingSoonDescription:
      "Das Produktportfolio von OpSolid wächst. Neue Tools für Operations, Kommunikation und KI-gestützte Workflows befinden sich derzeit in Entwicklung.",

    digitalCard: {
      hero: {
        eyebrow: "[ OPSO SMART ]   IHRE DIGITALE VISITENKARTE",
        title: [
          "OpSo Smart.",
          "Erstellen Sie Ihre digitale Visitenkarte selbst -",
          "kostenlos, in Sekunden live.",
        ],
        paragraph:
          "Vorlage wählen, Daten eintragen, veröffentlichen. Ihre Karte geht in Sekunden live unter opsolid.de/c/ihr-name, kostenlos. Teilen Sie sie per Link, QR-Code, WhatsApp oder E-Mail - der Empfänger braucht keine App, und Sie bearbeiten sie jederzeit. EU-Hosting in Frankfurt, DSGVO-nativ.",
        primaryCta: "Kostenlose Karte erstellen",
        secondaryCta: "20 Live-Vorlagen ansehen",
        tags: "OPSO SMART · LINK · QR-CODE · WHATSAPP · vCARD · KEINE APP · KOSTENLOS",
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
            provider: "OpSo Smart",
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
              "WhatsApp-Teilen-Button",
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
        items: [],
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
            question: "Braucht der Empfänger eine App?",
            answer:
              "Nein. Die Karte öffnet sich in jedem Browser über Link oder QR-Code - nichts zu installieren. Teilen Sie sie per Link, QR, WhatsApp oder E-Mail, der Empfänger tippt einmal und sieht Ihr Profil.",
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
              "Jede Karte ist kostenlos, also erstellen Sie eine pro Person. Für einen größeren Rollout, den Sie nicht selbst aufsetzen möchten, schreiben Sie an info@opsolid.de, wir helfen.",
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
          title: "Digitale Visitenkarte — Live-Vorschau | OpSolid",
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
        orderCta: "Dieses Design verwenden",
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
          eyebrow: "KARTE ERSTELLEN",
          title: "Ihre Daten, Ihr Design, Ihre Karte.",
          subtitle:
            "Füllen Sie das Formular aus — die Karte wird direkt nach dem Veröffentlichen unter opsolid.de/c/… live.",
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
          spotlightSection: "Aktuell · Spotlight",
          spotlightHint:
            "Eine auffällige, aktuelle Notiz direkt unter deinem Foto — ein kurzer Text und/oder ein Link. Leer lassen zum Ausblenden.",
          spotlightEnabled: "Auf meiner Karte anzeigen",
          spotlightBody: "Was gibt es gerade Neues?",
          spotlightBodyPlaceholder: "z. B. Nehme im Juli neue Projekte an — meld dich 👋",
          spotlightLinkUrl: "Link (optional)",
          spotlightLinkLabel: "Button-Text (optional)",
          spotlightLinkLabelPlaceholder: "Mehr erfahren",
          spotlightPlacement: "Position auf der Karte",
          spotlightPlaceBelowPhoto: "Unter dem Foto (empfohlen)",
          spotlightPlaceTop: "Oben auf der Karte",
          spotlightPlaceBottom: "Unten auf der Karte",
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
            "Etwas Bestimmtes, das wir wissen sollten: Schriftart, Logo-Anpassungen, Layout-Wünsche.",
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
          previewNoPaymentNote: "Nur Vorschau",
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
            "Senden Sie Ihre Karte vor der Veröffentlichung. Jeder mit dem Link kann sie lesen.",
          shareLinkUrl: "Link",
          shareLinkCopy: "Kopieren",
          shareLinkCopied: "Kopiert ✓",
          shareLinkOpen: "In neuem Tab öffnen",
          shareLinkNote:
            "Der Link enthält alle Formulardaten; die Karte wird erst veröffentlicht, wenn Sie sie erstellen.",
          videoSection: "Video (optional)",
          videoHint:
            "YouTube- oder Vimeo-Link einfügen — er läuft direkt auf Ihrer Karte.",
          videoLabel: "Video-Link",
          videoPlaceholder: "https://youtube.com/watch?v=…",
          videoInvalid: "Nur YouTube- oder Vimeo-Links werden unterstützt.",
          videoPlacementLabel: "Videoposition",
          videoPlacementTop: "Oben",
          videoPlacementDefault: "Standard",
          videoPlacementBottom: "Unten",
          customSectionsSection: "Eigene Abschnitte (optional)",
          customSectionsHint:
            "Bis zu 6 Abschnitte — Auszeichnungen, Sprachen, alles was Sie wollen.",
          // Editable section labels
          labelsSection: "Abschnittstitel (optional)",
          labelsHint:
            'Benennen Sie die Abschnitts-TITEL auf Ihrer Karte um (z.B. "Leistungen" → "Menü"). Den Inhalt selbst geben Sie in den Abschnitten oben ein — ein leerer Abschnitt (und sein Titel) erscheint nicht auf der Karte. Leer lassen behält die Vorgabe.',
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
          // Self-serve free flow (shown when payments are off). The card is
          // created & published, not ordered/paid for.
          step4TitleCreate: "Erstellen & veröffentlichen",
          step4SummaryCreate: "Adresse prüfen und live schalten",
          step3NextCreate: "Weiter zum Veröffentlichen",
          slugSection: "Kartenadresse",
          slugHint:
            "Die URL deiner Karte. Leer lassen für automatische Erzeugung aus dem Namen.",
          createExplainerTitle: "Was beim Klick passiert",
          createExplainerBody:
            "Deine Karte wird sofort veröffentlicht und ist unter ihrem Link erreichbar. Wir senden dir den Link und einen privaten Bearbeitungs-Link per E-Mail. Kostenlos, keine Kreditkarte.",
          createSubmitLabel: "Kostenlos veröffentlichen",
          createSubmitHint: "Keine Kreditkarte. Deine Karte geht sofort live.",
          createSubmit: "Karte kostenlos erstellen",
          stepIndicator: "Schritt {current} von {total}",
          stepEmpty: "Bitte ausfüllen",
          stepBack: "Zurück",
          reviewEdit: "Bearbeiten",
          contactEmailInline: "Deine E-Mail (hierhin senden wir deinen Karten-Link)",
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
        // WS-2 / WS-3 — vereinfachter Editor
        backToCards: "Meine Karten",
        tierBasic: "Basis",
        tierMore: "Mehr Details",
        tierAdvanced: "Erweitert",
        allDesigns: "Alle Designs",
        allDesignsHint: "Alle 90+ Designs nach Branche durchsuchen.",
        performanceTitle: "Performance & CRM",
        uploadCue: "Hochgeladen — zum Veröffentlichen auf Speichern tippen.",
        completenessTitle: "Karten-Vollständigkeit",
        completenessSummary: "{done}/{total} erledigt",
        completenessGoto: "Los",
        completenessAllDone: "Ihre Karte sieht vollständig aus 🎉",
        completenessPhoto: "Profilfoto",
        completenessLogo: "Logo",
        completenessName: "Name",
        completenessJobTitle: "Position",
        completenessCompany: "Unternehmen",
        completenessContact: "Kontakt (Tel./E-Mail)",
        completenessSocial: "Social-Link",
        completenessBio: "Über mich",
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
          "OpSo Smart — Kostenlose digitale Visitenkarte, in Sekunden live | OpSolid",
        description:
          "Erstellen Sie Ihre digitale Visitenkarte kostenlos und veröffentlichen Sie sie in Sekunden — Link, QR, WhatsApp, E-Mail. Keine App für den Empfänger, jederzeit bearbeitbar. EU-Hosting (Frankfurt), DSGVO-nativ.",
      },
    },








  },

  v2: {


    home: {







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
          "Erstellen Sie in einer Minute eine mobilfreundliche digitale Visitenkarte. Teilen Sie sie per Link, QR-Code, WhatsApp oder E-Mail — Ihre Empfänger brauchen keine App. Kontaktdaten, Terminlink und Portfolio aktualisieren Sie jederzeit zentral, ganz ohne Neudruck.",
        ctaPrimary: "Kostenlos erstellen",
        ctaSecondary: "Designs ansehen",
        features: [
          {
            label: "FORMAT",
            value: "Digitale Karte",
            sub: "Link · QR · WhatsApp",
          },
          {
            label: "EMPFÄNGER",
            value: "Keine App",
            sub: "Öffnet im Browser",
          },
          {
            label: "PREIS",
            value: "Kostenlos",
            sub: "Jederzeit bearbeitbar",
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
        headline: "Erstellen. Teilen. Aktualisieren",
        lead:
          "Keine Hardware, keine App. Ihre Karte lebt unter einem Link, den Sie jederzeit in Ihrem Dashboard aktualisieren.",
        steps: [
          {
            num: "01",
            title: "In einer Minute erstellen",
            body:
              "Design wählen, ein paar Felder ausfüllen, kostenlos veröffentlichen — ganz ohne Konto.",
          },
          {
            num: "02",
            title: "Überall teilen",
            body:
              "Per Link, QR-Code, WhatsApp oder E-Mail. Ihre Empfänger öffnen die Karte im Browser — keine App nötig.",
          },
          {
            num: "03",
            title: "Jederzeit bearbeiten",
            body:
              "Neue Rolle, neue Nummer, neues Foto — einmal ändern, sofort auf Ihrer Live-Karte.",
          },
        ],
      },
      customRequest: {
        eyebrow: "[ WHITE-GLOVE · FÜR SIE GESTALTET ]",
        headline: "Lieber von uns gestalten lassen?",
        lead:
          "Zwei Done-for-you-Wege: White-Glove gestaltet Ihre Karte in 48 Stunden von Hand, oder wir erstellen ein Angebot für Teams und Sonderwünsche. Sagen Sie uns unten, was Sie brauchen — oder schreiben Sie uns einfach.",
        options: [
          {
            tag: "WHITE-GLOVE",
            price: "ab 299 €",
            title: "Wir gestalten sie für Sie",
            body:
              "In 48 Stunden von Hand gestaltet, unbegrenzte Korrekturen, mehrsprachig (DE / EN / TR), bevorzugter Support.",
          },
          {
            tag: "INDIVIDUELL · TEAM",
            price: "Auf Anfrage",
            title: "Maßgeschneidert oder Team-Rollout",
            body:
              "Besondere Layouts, viele Karten, eigene Domain — wir kalkulieren und senden Ihnen ein Angebot.",
          },
        ],
        channels: {
          heading: "Direkt erreichen",
          note: "Am schnellsten per WhatsApp — meist antworten wir innerhalb eines Werktags.",
          prefill: "Hallo OpSolid — ich hätte gern eine individuelle OpSo Smart Karte.",
          labels: {
            whatsappTr: "WhatsApp · TR",
            whatsappDe: "WhatsApp · DE",
            phone: "Anrufen",
            email: "E-Mail",
          },
        },
        form: {
          heading: "Erzählen Sie uns von Ihrer Karte",
          name: "Vollständiger Name",
          email: "Geschäftliche E-Mail",
          company: "Unternehmen (optional)",
          industry: "Branche",
          teamSize: "Wie viele Karten?",
          teamSizeOptions: ["1", "2 – 5", "6 – 20", "20+"],
          message: "Was brauchen Sie? Stil, Links, Sonderwünsche…",
          consent:
            "Ich willige ein, dass OpSolid diese Anfrage zur Beantwortung verarbeitet.",
          privacyLink: "Datenschutz",
          submit: "Anfrage senden",
          submitting: "Senden…",
          success: "Danke — wir antworten innerhalb eines Werktags.",
          error: "Etwas ist schiefgelaufen. Bitte direkt an info@opsolid.de schreiben.",
        },
      },
      gallery: {
        heading: "Alle Designs",
        subheading: "Die komplette Auswahl — passend für Ihre Branche.",
        countLabel: "Designs",
        allChip: "Alle",
        useDesign: "Dieses Design wählen",
        backLink: "Zurück zur digitalen Karte",
        imgFallbackLabel: "Vorschau",
        sectors: {
          general: "Allgemein",
          realEstate: "Immobilien",
          salon: "Salon & Barber",
          restaurant: "Restaurant",
          creator: "Kreativ & Foto",
          freelancer: "Freelancer",
          lawyer: "Recht & Kanzlei",
          clinic: "Klinik",
          fitness: "Fitness",
          music: "Musik & DJ",
          architecture: "Architektur",
          retail: "Handel",
          hospitality: "Hotellerie",
          events: "Events",
          construction: "Bau",
          tourism: "Tourismus",
          corporate: "Unternehmen",
          tech: "Tech",
          consultant: "Beratung",
          dentist: "Zahnarzt",
          psychologist: "Psychologie",
          beauty: "Beauty",
          accounting: "Buchhaltung",
          software: "Software",
          "content-creator": "Content Creator",
          wellness: "Wellness",
          eventPlanner: "Eventplanung",
          auto: "Autohandel",
          interior: "Innenarchitektur",
        },
      },
      pricing: {
        eyebrow: "[ PREISE ]",
        headline: "Kostenlos starten. Zahlen, wenn Sie mehr brauchen.",
        lead:
          "Kostenlos erstellen und veröffentlichen. Upgraden Sie für eigene Domain und Analytics — oder lassen Sie alles von uns gestalten.",
      },
    },








    pricing: {
      meta: {
        title: "Preise — Standard, Professional, Enterprise | OpSolid",
        description: "Preisübersicht für die Produkte von OpSolid (Preise für die meisten Produkte auf Anfrage): Voice Agent, OpSo Smart, Chatbot, WhatsApp, Booking, Email, Lead Qualifier, Custom Automation und Kutasia.",
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
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["500 Minuten / Monat", "1 Telefonnummer", "1 Sprache", "Geschäftszeiten-Abdeckung", "Cal.com-Integration"],
              overage: "",
              forWhom: "Einzel-Standort SMB, Überlaufabdeckung",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["2.000 Minuten / Monat", "3 Telefonnummern", "Mehrsprachig (DE / EN / TR)", "24/7-Abdeckung", "CRM-Sync (HubSpot, Pipedrive)"],
              overage: "",
              forWhom: "Mid-Market mit konstantem Inbound (Kliniken, Agenturen)",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["8.000 Minuten / Monat", "Unbegrenzte Nummern", "Custom Voice + Branding", "SLA nach Vereinbarung", "EU-Datenresidenz-Vertrag"],
              overage: "",
              forWhom: "Hochvolumig, regulierte Branchen",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "verso",
          name: "OpSo Smart",
          tagline: "Erstellen Sie Ihre digitale Visitenkarte selbst, kostenlos",
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
              included: ["Alles aus Free, Badge entfernt", "Eigener Slug oder eigene Domain", "WhatsApp-Teilen-Button", "Analysen (Aufrufe + Klicks)", "Lead-Erfassung + CRM-Webhook"],
              overage: "",
              forWhom: "Profis, die Domain & Analysen wollen",
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
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["1 Site", "500 Konversationen / Monat", "Knowledge Base bis 50 Dokumente", "Geschäftszeiten-Übergabe", "E-Mail- + Ticket-Capture"],
              overage: "",
              forWhom: "Kleine Site, Lead-Capture-Fokus",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["3 Sites", "2.500 Konversationen / Monat", "Unbegrenzte KB-Dokumente", "24/7-Übergabe", "CRM-Sync"],
              overage: "",
              forWhom: "Mid-Market mit aktivem Funnel",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["Unbegrenzte Sites", "10.000 Konversationen / Monat", "Mehrsprachig", "SLA + Audit-Log", "Custom Voice + Tone-Training"],
              overage: "",
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
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["1 WABA-Nummer", "3 Nutzer", "1.000 Konversationen / Monat", "Templates + Broadcast", "Lead-Capture-Flow"],
              overage: "",
              forWhom: "Lokale Geschäfte, Single-Channel",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["1 WABA-Nummer", "10 Nutzer", "5.000 Konversationen / Monat", "Automation-Flows", "CRM-Sync"],
              overage: "",
              forWhom: "Mid-Market Service-Operationen",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["3+ WABA-Nummern", "Unbegrenzte Nutzer", "20.000 Konversationen / Monat", "Multi-Team-Routing", "SLA"],
              overage: "",
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
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["Web-Buchungs-Widget", "Cal.com-Sync", "E-Mail- + SMS-Erinnerungen", "1 Kalender", "Bis zu 100 Buchungen / Monat"],
              overage: "",
              forWhom: "Solo-Praxis / kleines Team",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["Bis zu 10 Kalender", "Voice + WhatsApp + Web-Intake", "No-Show-Recovery-Flow", "Intake-Formulare", "Custom-Erinnerungen"],
              overage: "",
              forWhom: "Multi-Staff-Servicebetrieb",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
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
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["1 Shared Inbox", "KI-Triage + Auto-Antwort", "500 E-Mails / Platz / Monat", "Basis-CRM-Log", "Slack-Benachrichtigungen"],
              overage: "",
              forWhom: "Kleines Operations-Team",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["3 Inboxes", "Eskalationsregeln", "2.000 E-Mails / Platz / Monat", "HubSpot- / Pipedrive-Sync", "Custom-Antwort-Templates"],
              overage: "",
              forWhom: "Mid-Market Service-Desk",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["Unbegrenzte Inboxes", "Custom-Routing-Regeln", "Audit-Log + SLA", "EU AVV inklusive", "Dedicated Success Manager"],
              overage: "",
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
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["250 qualifizierte Leads / Monat", "Formular- + Chat-Intake", "BANT-Scoring", "CRM-Push (HubSpot, Pipedrive)", "Slack-Alerts"],
              overage: "",
              forWhom: "Outbound-leichtes B2B",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["1.000 qualifizierte Leads / Monat", "Voice + Chat + Formular-Intake", "Custom-Scoring-Modell", "Routing-Regeln", "Wöchentliche Übersicht"],
              overage: "",
              forWhom: "Aktives SDR-unterstütztes Team",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["4.000 qualifizierte Leads / Monat", "Multi-Channel-Intake", "Account-basiertes Scoring", "SLA", "Custom-Integrationen"],
              overage: "",
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
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["1 Workflow End-to-End gebaut", "Scoping + Build + 30 Tage Support", "Bis zu 3 Integrationen", "Dokumentation + Übergabe", "Quellcode gehört Ihnen"],
              overage: "",
              forWhom: "Einzelner, klar definierter Schmerzpunkt",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
              included: ["3–5 Workflows", "Discovery-Workshop", "Build + 90 Tage Support", "Integration + Custom Code", "Ops-Dashboard"],
              overage: "",
              forWhom: "Mid-Market Digital-Ops-Projekt",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Preis auf Anfrage",
              monthly: "Preis auf Anfrage",
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
    wallet: {
      notConfigured:
        "Wallet-Unterstützung wird konfiguriert. Apple/Google Wallet-Buttons erscheinen nach der Aktivierung.",
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
      ctaTitle: "Ihre eigene digitale Visitenkarte",
      ctaBody:
        "Digitale Visitenkarten mit OpSo: Beispiele, Funktionen und Verfügbarkeit im Überblick.",
      ctaButton: "OpSo ansehen",
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
      designSectionLabel: "Design",
      designClassic: "Klassisch",
      designModern: "Modern",
      designVisual: "Visuell",
      designHint:
        "Wählen Sie einen Startlook — Design und Details können Sie jederzeit ändern.",
      logoLabel: "Logo hinzufügen (optional)",
      logoChange: "Logo ändern",
      logoHint: "PNG mit Transparenz funktioniert am besten",
      socialSectionLabel: "Soziale Medien (optional)",
      linkedinLabel: "LinkedIn-URL",
      instagramLabel: "Instagram-URL",
      xLabel: "X (Twitter)-URL",
      youtubeLabel: "YouTube-URL",
      facebookLabel: "Facebook-URL",
      tiktokLabel: "TikTok-URL",
      moreToggle: "Mehr Details",
      whatsappLabel: "WhatsApp-Nummer",
      websiteLabel: "Website",
      addressLabel: "Adresse",
      bioLabel: "Kurzbio",
      videoLabel: "YouTube-/Vimeo-Video-URL",
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
      loginCta: "Anmelden und alle Karten verwalten",
      loginBody:
        "Melden Sie sich mit dieser E-Mail an, um alle Karten von jedem Gerät aus zu verwalten.",
      dismiss: "Verstanden",
    },
    languageSwitcher: "Sprache",
  },

  auth: {
    signup: {
      title: "Konto erstellen",
      subtitle: "Erstellen Sie Ihr kostenloses Konto per E-Mail-Anmeldelink oder Google. Ein Passwort ist nicht nötig.",
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
      passwordCta: "Passwort eines bereits bestätigten Kontos verwenden",
      legacyPasswordHelp: "Passwörter bleiben für Konten mit bereits bestätigter E-Mail-Adresse verfügbar. Haben Sie Ihr Passwort vor der E-Mail-Bestätigung erstellt, nutzen Sie den Anmeldelink per E-Mail oder Google. Das frühere Passwort wird bei der ersten E-Mail-Bestätigung entfernt.",
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
