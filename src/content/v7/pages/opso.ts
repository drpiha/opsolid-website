/**
 * OpSo page (pillar 3, our own product in test phase). German is the source. This page keeps the owner-approved
 * "du" voice of the previous OpSo page (PR #53); the rest of the site uses "Sie". Only features that exist now.
 * Images: the app screens are the real screens (demo data) cropped to the screen area from public/img/opso/<locale>/;
 * the four example cards are captures of fictional profiles with AI-generated portraits; the NFC card render is our
 * own 3D concept render (not AI-generated). The planned card price is shown exactly as on the previous page, with its label.
 */
import type { L3, PageDef, PageSet } from "../types";

const APP = (loc: L3, n: string) => `/img/v7/opso/app/${loc}-${n}.webp`;
const SCREEN = { w: 328, h: 710 } as const;
const CARD = { w: 390, h: 844 } as const;
const SCREEN_KEYS = ["01-create", "02-share", "03-recipient", "04-fairs", "05-messages", "06-contacts", "07-editor", "08-privacy"] as const;
const CARD_FILES = ["clara-weber", "james-bennett", "maya-collins", "felix-berger"] as const;

function screens(loc: L3, alts: string[], captions: string[]) {
  return SCREEN_KEYS.map((k, i) => ({ img: { src: APP(loc, k), ...SCREEN, alt: alts[i] }, caption: captions[i] }));
}
function cards(alts: string[], captions: string[]) {
  return CARD_FILES.map((f, i) => ({ img: { src: `/img/v7/opso/cards/${f}.webp`, ...CARD, alt: alts[i] }, caption: captions[i] }));
}

const de: PageDef = {
  key: "opso",
  meta: {
    title: "OpSo: Karte, Kontakte und Follow-up an einem Ort",
    description:
      "OpSo: kostenlose digitale Visitenkarte mit Kontaktliste und Follow-up. Android: geschlossener Test, iPhone: bei Apple eingereicht. Ohne App für Empfänger.",
  },
  crumbs: [],
  crumb: "OpSo",
  hero: {
    eyebrow: "OpSo · by OpSolid · in der Testphase",
    h1: ["Karte, Kontakte, Follow-up.", "Wen du triffst, vergisst du nicht", ""],
    lede: "OpSo ist die digitale Visitenkarte mit Kontaktliste. Du teilst deine Karte per QR-Code, NFC oder Link, notierst, wo ihr euch getroffen habt, und fasst rechtzeitig nach.",
    primary: { label: "Zugang zum Test anfragen", to: "kontakt", query: { anliegen: "opso" } },
    secondary: { label: "Funktionen ansehen", to: "opso", hash: "funktionen" },
    facts: ["Heute kostenlos, ohne Werbung", "Empfänger brauchen keine App", "Stand: 28.10.2026"],
    media: {
      kind: "image",
      img: { src: APP("de", "02-share"), ...SCREEN, alt: "OpSo-Teilen-Bildschirm mit QR-Code und den Reitern Antippen und NFC-Karte (Demodaten)" },
      frame: "phone",
      caption: "Teilen-Bildschirm der Android-App, Demodaten",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "zielgruppe",
      label: "Zielgruppe",
      note: "Für den Handschlag gebaut.",
      h: "Für wen OpSo gemacht ist",
      lede: "Für Menschen, die vom persönlichen Gespräch leben und es danach in Ruhe weiterführen wollen. Wer überwiegend online Kontakte knüpft, ist in einem Business-Netzwerk besser aufgehoben.",
      items: [
        { h: "Messebesucher", p: "Viele Gespräche an einem Tag, und später weißt du noch, wer was wollte." },
        { h: "Kleine Aussteller", p: "Karte teilen, Kontakt festhalten, nach der Messe nachfassen." },
        { h: "Freiberufler und Berater", p: "Eine Karte, die du überall zeigst, und eine Liste, die mitwächst." },
        { h: "Handwerker und lokale Betriebe", p: "Ein Link und ein QR-Code statt Stapel von Papierkarten." },
        { h: "Veranstalter und Community-Organisatoren", p: "Wer vieles organisiert, trifft viele und braucht einen Ort für alle Kontakte." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Ablauf",
      note: "Drei Schritte, die am Stand oder beim Händeschütteln passieren.",
      h: "Treffen. Merken. Nachfassen",
      items: [
        {
          h: "Karte teilen",
          p: "QR-Code zeigen, Handys aneinanderhalten (Android), NFC-Tag nutzen oder den Link senden. Deine Karte öffnet sich im Browser des Gegenübers.",
        },
        {
          h: "Festhalten, wen du wo getroffen hast",
          p: "Jeder Kontakt behält den Ort des Treffens, Notizen und einen Lead-Status. Eine Papier-Visitenkarte scannst du ein, und sie landet in derselben Liste.",
        },
        {
          h: "Rechtzeitig nachfassen",
          p: "Setze eine Erinnerung und sende eine fertige Follow-up-Nachricht, damit ein gutes Gespräch nicht am Stand endet.",
        },
      ],
    },
    {
      t: "gallery",
      id: "bildschirme",
      label: "Bildschirme",
      h: "Die App, Bildschirm für Bildschirm",
      lede: "Das sind echte Bildschirme aus der Android-App. Die gezeigten Personen und Firmen sind fiktive Demodaten.",
      frame: "phone",
      tag: "Demodaten",
      items: screens(
        "de",
        [
          "Karte erstellen: Name, Rolle und Firma, dann veröffentlichen",
          "Teilen-Bildschirm mit QR-Code und den Reitern Antippen und NFC-Karte",
          "Deine Karte im Browser des Empfängers, ein Tipp speichert den Kontakt",
          "Messekalender mit Suche und der Schaltfläche Ich gehe hin",
          "Ein Chat mit einem verbundenen Kontakt, mit Text und angehängter Datei",
          "Kontaktliste mit Lead-Status, Notizen und Export als CSV oder vCard",
          "Karteneditor mit Vorlagen, Farben und Schriften und Live-Vorschau",
          "Datenschutz-Einstellungen: Öffentliches wählen, Daten exportieren oder löschen",
        ],
        [
          "Karte erstellen",
          "Teilen per QR-Code, Antippen, NFC",
          "Deine Karte beim Empfänger",
          "Messekalender",
          "Chat mit verbundenem Kontakt",
          "Kontakte mit Lead-Status",
          "Karteneditor mit Live-Vorschau",
          "Datenschutz-Einstellungen",
        ],
      ),
    },
    {
      t: "rows",
      id: "funktionen",
      label: "Funktionen",
      h: "Was OpSo heute schon kann",
      lede: "Nur Funktionen, die es in der App jetzt gibt. Nichts davon ist ein Versprechen für später.",
      items: [
        { tag: "Teilen", h: "Webkarte ohne App", p: "Deine Karte liegt unter opso.cc/deinname und öffnet sich in jedem Browser." },
        { tag: "Teilen", h: "QR, NFC-Tag und Antippen", p: "Teile per QR-Code, mit einem kompatiblen NFC-Tag oder auf Android durch Aneinanderhalten der Handys." },
        { tag: "Erfassen", h: "Visitenkarten-Scan", p: "Fotografiere eine Papierkarte und füge die Person deinen Kontakten hinzu." },
        {
          tag: "Kontakte",
          h: "„Wo wir uns trafen“",
          p: "Notizen, Lead-Status (heiß, warm, VIP) und der Ort des Treffens in einer durchsuchbaren Liste.",
        },
        { tag: "Nachfassen", h: "Follow-up-Erinnerungen", p: "Eine Erinnerung pro Kontakt und eine fertige Follow-up-Nachricht zum Anpassen und Senden." },
        {
          tag: "Messen",
          h: "Messekalender",
          p: "Eine kuratierte Liste von Messen. Tippe auf „Ich gehe hin“, neue Kontakte werden der Messe zugeordnet.",
        },
        { tag: "Austausch", h: "1:1-Nachrichten", p: "Schreibe mit verbundenen Personen, mit Text, Fotos und Dateien." },
        {
          tag: "Export",
          h: "Aufs Handy speichern",
          p: "Speichere einen Kontakt direkt im Adressbuch deines Handys oder exportiere deine Kontakte als CSV oder vCard.",
        },
      ],
    },
    {
      t: "gallery",
      id: "beispielkarten",
      label: "Beispielkarten",
      h: "Deine Webkarte, in deinem Stil",
      lede: "Eine veröffentlichte Karte öffnet sich im Browser des Empfängers. NFC setzt ein kompatibles Smartphone und einen passenden Tag voraus.",
      frame: "phone",
      tag: "Beispiele · KI-generierte Porträts",
      items: cards(
        [
          "Beispielkarte Clara Weber, Architektin, in hellen Steintönen, mit KI-generiertem Porträt",
          "Beispielkarte James Bennett, Unternehmensberater, in klassischem Navy, mit KI-generiertem Porträt",
          "Beispielkarte Maya Collins, Markendesignerin, in Koralle und Violett, mit KI-generiertem Porträt",
          "Beispielkarte Felix Berger, Produktdesigner, in frischem Mint, mit KI-generiertem Porträt",
        ],
        [
          "Clara Weber, Architektin · Helle Steintöne",
          "James Bennett, Unternehmensberater · Klassisches Navy",
          "Maya Collins, Markendesignerin · Koralle & Violett",
          "Felix Berger, Produktdesigner · Frisches Mint",
        ],
      ),
    },
    {
      t: "product",
      id: "nfc-karte",
      label: "NFC-Karte",
      note: "Noch nicht bestellbar.",
      h: "Die physische NFC-Karte: ein Konzept",
      lede: "Eine Karte, die dein OpSo-Profil per Berührung öffnet.",
      name: "Physische NFC-Karte",
      status:
        "Konzept. Preis, Druckausführung und Verfügbarkeit werden nach dem Produktionstest bestätigt.",
      p: "Die geplante mattschwarze Karte öffnet dein OpSo-Profil per Berührung. Ein gedruckter QR-Code ist als Alternative vorgesehen.",
      points: [
        "Mattschwarze Karte im Standardformat",
        "Separater Einmalkauf, kein Abonnement",
      ],
      price: { label: "Geplanter Einführungspreis", value: "24,90 € inklusive MwSt., Versand wird separat berechnet" },
      href: { label: "NFC-Karte anfragen", to: "kontakt", query: { anliegen: "opso" } },
      media: {
        kind: "image",
        img: {
          src: "/img/v7/opso/render-hero.jpg",
          w: 1600,
          h: 1200,
          alt: "Konzept-Render einer mattschwarzen NFC-Visitenkarte mit kupferfarbener Folienprägung, vorne das Logo, hinten QR-Code und Beispielname",
        },
        caption: "Konzept-Render. Die endgültige Karte kann abweichen.",
        fig: "6.1",
      },
    },
    {
      t: "principles",
      id: "daten",
      label: "Kosten und Daten",
      h: "Heute kostenlos, ohne Werbung",
      lede: "Es gibt keinen Checkout, keine Zahlungsdaten und keine Werbung.",
      cta: { label: "Zur Datenschutzerklärung", to: "privacy" },
      items: [
        {
          h: "Kostenlos",
          p: "Es wird nichts berechnet. Sollte sich das ändern, steht es vor jeder Berechnung auf dieser Seite.",
        },
        { h: "Du bestimmst, was öffentlich ist", p: "Auf deiner Karte erscheint nur, was du dafür freigibst." },
        { h: "Export jederzeit", p: "Deine Kontakte exportierst du als CSV oder vCard, deine Daten in der App." },
        { h: "Konto löschen jederzeit", p: "Das geht in der App. Details stehen in der Datenschutzerklärung." },
      ],
    },
    {
      t: "spec",
      id: "verfuegbarkeit",
      label: "Verfügbarkeit",
      footnote: "Stand: 28.10.2026.",
      h: "Wo es OpSo gibt",
      lede: "OpSo ist in der Testphase. Android: geschlossener Test bei Google Play. iPhone: bei Apple zur Prüfung eingereicht (Stand: 28.10.2026).",
      cta: { label: "Zugang zum Test anfragen", to: "kontakt", query: { anliegen: "opso" } },
      rows: [
        ["Android", "Geschlossener Test bei Google Play, nur für eingeladene Tester; einen öffentlichen Store-Link gibt es noch nicht. Schreib uns, wir nehmen dich auf."],
        ["iPhone", "Ein Termin für den App Store steht noch nicht fest."],
        ["Im Browser", "Jede veröffentlichte Karte öffnet sich schon jetzt im Browser, auch auf dem iPhone."],
        ["Eigene Domain", "Noch nicht. Karten werden unter opso.cc veröffentlicht."],
      ],
    },
    {
      t: "text",
      id: "von-opsolid",
      label: "Von OpSolid",
      note: "Unser eigenes Produkt, getrennt von der Beratung.",
      h: "OpSo ist ein Produkt von OpSolid",
      lede: "Wir entwickeln und betreiben OpSo selbst, von der ersten Skizze bis zum Betrieb.",
      paras: [
        "Dieselbe Arbeitsweise bringen wir in die KI-Beratung für Unternehmen: erst klären, was gebraucht wird, dann bauen, was im Alltag läuft.",
      ],
      cta: { label: "KI-Beratung für Unternehmen", to: "beratung" },
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Vor dem Start",
    items: [
      {
        q: "Braucht das Gegenüber die App?",
        a: "Nein. Deine veröffentlichte Karte öffnet sich im Browser. QR-Codes und kompatible NFC-Tags führen zu ihrem öffentlichen Link.",
      },
      {
        q: "Was kostet OpSo?",
        a: "Aktuell nichts: OpSo ist kostenlos und ohne Werbung.",
      },
      {
        q: "Gibt es OpSo fürs iPhone?",
        a: "Noch nicht im Store. Die iPhone-Version ist bei Apple zur Prüfung eingereicht (Stand: 28.10.2026). Deine Karte kann jeder mit iPhone trotzdem im Browser öffnen.",
      },
      {
        q: "Was passiert mit meinen Daten?",
        a: "Du bestimmst, was auf deiner Karte öffentlich ist. Datenexport und Konto löschen sind jederzeit in der App möglich. Details stehen in der Datenschutzerklärung.",
      },
    ],
  },
  cta: {
    label: "OpSo",
    h: "Probier OpSo aus",
    p: "Schreib uns kurz, wir nehmen dich in den Android-Test auf.",
    primary: { label: "Zugang zum Test anfragen", to: "kontakt", query: { anliegen: "opso" } },
    secondary: { label: "KI-Check für Unternehmen", to: "check" },
  },
  schema: {
    software: {
      name: "OpSo",
      description: "Digitale Visitenkarte mit Kontaktliste und Follow-up. Karte teilen per QR-Code, NFC oder Link; Empfänger brauchen keine App. In der Testphase.",
      os: ["Android", "iOS"],
      category: "BusinessApplication",
    },
  },
};

const en: PageDef = {
  key: "opso",
  meta: {
    title: "OpSo: your card, contacts and follow-up in one place",
    description:
      "OpSo is the free digital business card with contacts and follow-up. Android: closed test, iPhone: submitted to Apple. Recipients need no app. By OpSolid.",
  },
  crumbs: [],
  crumb: "OpSo",
  hero: {
    eyebrow: "OpSo · by OpSolid · in test phase",
    h1: ["Card, contacts, follow-up.", "You won’t forget who you met", ""],
    lede: "OpSo is the digital business card with a contact list. You share your card by QR code, NFC or link, note where you met, and follow up in time.",
    primary: { label: "Request test access", to: "kontakt", query: { anliegen: "opso" } },
    secondary: { label: "See the features", to: "opso", hash: "funktionen" },
    facts: ["Free today, no ads", "Recipients need no app", "As of 28 Oct 2026"],
    media: {
      kind: "image",
      img: { src: APP("en", "02-share"), ...SCREEN, alt: "OpSo share screen with QR code and the tabs Tap and NFC card (demo data)" },
      frame: "phone",
      caption: "Share screen of the Android app, demo data",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "zielgruppe",
      label: "Audience",
      note: "Built for the handshake.",
      h: "Who OpSo is for",
      lede: "For people who live on conversations in person and want to follow them up calmly afterwards. If you mostly meet people online, a business network suits you better.",
      items: [
        { h: "Trade fair visitors", p: "Many conversations in one day, and later you still know who wanted what." },
        { h: "Small exhibitors", p: "Share your card, keep the contact, follow up after the fair." },
        { h: "Freelancers and consultants", p: "One card you can show anywhere, and a list that grows with you." },
        { h: "Tradespeople and local businesses", p: "A link and a QR code instead of stacks of paper cards." },
        { h: "Community and event organisers", p: "If you organise a lot, you meet a lot, and need one place for all contacts." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "How it works",
      note: "Three steps that happen at a stand or a handshake.",
      h: "Meet. Remember. Follow up",
      items: [
        {
          h: "Share your card",
          p: "Show a QR code, tap phones together (Android), use an NFC tag or send the link. Your card opens in the other person’s browser.",
        },
        {
          h: "Note who you met and where",
          p: "Every contact keeps the place you met, notes and a lead status. Scan a paper business card and it lands in the same list.",
        },
        {
          h: "Follow up in time",
          p: "Set a reminder and send a ready-made follow-up message, so a good conversation does not end at the stand.",
        },
      ],
    },
    {
      t: "gallery",
      id: "bildschirme",
      label: "Screens",
      h: "The app, screen by screen",
      lede: "These are real screens from the Android app. The people and companies shown are fictional demo data.",
      frame: "phone",
      tag: "Demo data",
      items: screens(
        "en",
        [
          "Create your card: name, role and company, then publish",
          "Share screen with QR code and the tabs Tap and NFC card",
          "Your card in the recipient’s browser with one tap to save the contact",
          "Trade fair calendar with search and an I’m going button",
          "A chat with a connected contact, with text and an attached file",
          "Contacts list with lead status, notes and CSV or vCard export",
          "Card editor with templates, colours and fonts and a live preview",
          "Privacy settings: choose what is public, export or delete your data",
        ],
        [
          "Create your card",
          "Share by QR code, tap or NFC",
          "Your card at the recipient’s end",
          "Trade fair calendar",
          "Chat with a connected contact",
          "Contacts with lead status",
          "Card editor with live preview",
          "Privacy settings",
        ],
      ),
    },
    {
      t: "rows",
      id: "funktionen",
      label: "Features",
      h: "What OpSo already does today",
      lede: "Only features that exist in the app now. Nothing here is a promise for later.",
      items: [
        { tag: "Sharing", h: "Web card, no app needed", p: "Your card lives at opso.cc/yourname and opens in any browser." },
        { tag: "Sharing", h: "QR, NFC tag and tap", p: "Share with a QR code, a compatible NFC tag or, on Android, by tapping phones together." },
        { tag: "Capture", h: "Business card scan", p: "Photograph a paper card and add the person to your contacts." },
        {
          tag: "Contacts",
          h: "“Where we met”",
          p: "Notes, lead status (hot, warm, VIP) and the place you met, in one searchable list.",
        },
        { tag: "Follow-up", h: "Follow-up reminders", p: "A reminder per contact and a ready follow-up message to adapt and send." },
        {
          tag: "Fairs",
          h: "Trade fair calendar",
          p: "A curated list of fairs. Tap “I’m going” and new contacts are filed under the fair.",
        },
        { tag: "Messages", h: "1:1 messages", p: "Chat with people you are connected to, with text, photos and files." },
        {
          tag: "Export",
          h: "Save to your phone",
          p: "Save a contact straight into your phone’s address book, or export your contacts as CSV or vCard.",
        },
      ],
    },
    {
      t: "gallery",
      id: "beispielkarten",
      label: "Example cards",
      h: "Your web card, in your own style",
      lede: "A published card opens in the recipient’s browser. NFC requires a compatible phone and tag.",
      frame: "phone",
      tag: "Examples · AI-generated portraits",
      items: cards(
        [
          "Example card of Clara Weber, architect, in light stone tones, with an AI-generated portrait",
          "Example card of James Bennett, business consultant, in classic navy, with an AI-generated portrait",
          "Example card of Maya Collins, brand designer, in coral and violet, with an AI-generated portrait",
          "Example card of Felix Berger, product designer, in fresh mint, with an AI-generated portrait",
        ],
        [
          "Clara Weber, architect · Light stone",
          "James Bennett, business consultant · Corporate navy",
          "Maya Collins, brand designer · Coral & violet",
          "Felix Berger, product designer · Fresh mint",
        ],
      ),
    },
    {
      t: "product",
      id: "nfc-karte",
      label: "NFC card",
      note: "Cannot be ordered yet.",
      h: "The physical NFC card: a concept",
      lede: "A card that opens your OpSo profile with a tap.",
      name: "Physical NFC card",
      status:
        "Concept. Price, print finish and availability will be confirmed after the production trial.",
      p: "The planned matte-black card opens your OpSo profile with a tap. A printed QR code is intended as a fallback.",
      points: [
        "Matte-black, standard-size card",
        "Separate one-time purchase, not a subscription",
      ],
      price: { label: "Planned launch price", value: "€24.90 including VAT, shipping charged separately" },
      href: { label: "Ask about the NFC card", to: "kontakt", query: { anliegen: "opso" } },
      media: {
        kind: "image",
        img: {
          src: "/img/v7/opso/render-hero.jpg",
          w: 1600,
          h: 1200,
          alt: "Concept render of a matte-black NFC business card with copper foil, logo on the front, QR code and sample name on the back",
        },
        caption: "Concept render. The final card may differ.",
        fig: "6.1",
      },
    },
    {
      t: "principles",
      id: "daten",
      label: "Cost and data",
      h: "Free today, no ads",
      lede: "There is no checkout, no payment details and no advertising.",
      cta: { label: "Read the privacy policy", to: "privacy" },
      items: [
        { h: "Free", p: "Nothing is charged. If that ever changes, it will be announced on this page before any charge." },
        { h: "You decide what is public", p: "Only what you release appears on your card." },
        { h: "Export any time", p: "Export your contacts as CSV or vCard, and your data from the app." },
        { h: "Delete your account any time", p: "You can do it in the app. Details are in the privacy policy." },
      ],
    },
    {
      t: "spec",
      id: "verfuegbarkeit",
      label: "Availability",
      footnote: "As of 28 Oct 2026.",
      h: "Where to get OpSo",
      lede: "OpSo is in its test phase. Android: closed test on Google Play. iPhone: submitted to Apple for review (as of 28 Oct 2026).",
      cta: { label: "Request test access", to: "kontakt", query: { anliegen: "opso" } },
      rows: [
        ["Android", "Closed test on Google Play, open to invited testers only; there is no public store link yet. Write to us and we will add you."],
        ["iPhone", "There is no App Store date yet."],
        ["In the browser", "Any published card already opens in a browser, on an iPhone too."],
        ["Own domain", "Not yet. Cards are published at opso.cc."],
      ],
    },
    {
      t: "text",
      id: "von-opsolid",
      label: "By OpSolid",
      note: "Our own product, separate from the consulting.",
      h: "OpSo is a product of OpSolid",
      lede: "We develop and run OpSo ourselves, from the first sketch to operation.",
      paras: [
        "We bring the same way of working to our AI consulting for companies: first clarify what is needed, then build what runs in daily work.",
      ],
      cta: { label: "AI consulting for companies", to: "beratung" },
    },
  ],
  faq: {
    label: "Frequently asked questions",
    h: "Before you get started",
    items: [
      {
        q: "Does the other person need the app?",
        a: "No. Your published card opens in a browser. QR codes and compatible NFC tags point to its public link.",
      },
      {
        q: "What does OpSo cost?",
        a: "Nothing at the moment: OpSo is free and has no ads.",
      },
      {
        q: "Can I get OpSo on my iPhone?",
        a: "Not in the store yet. The iPhone version has been submitted to Apple for review (as of 28 Oct 2026). Anyone with an iPhone can still open your card in the browser.",
      },
      {
        q: "What happens to my data?",
        a: "You decide what is public on your card. You can export your data and delete your account in the app at any time. Details are in the privacy policy.",
      },
    ],
  },
  cta: {
    label: "OpSo",
    h: "Try OpSo",
    p: "Write to us and we will add you to the Android test.",
    primary: { label: "Request test access", to: "kontakt", query: { anliegen: "opso" } },
    secondary: { label: "AI check for companies", to: "check" },
  },
  schema: {
    software: {
      name: "OpSo",
      description: "Digital business card with a contact list and follow-up. Share your card by QR code, NFC or link; recipients need no app. In test phase.",
      os: ["Android", "iOS"],
      category: "BusinessApplication",
    },
  },
};

const tr: PageDef = {
  key: "opso",
  meta: {
    title: "OpSo: kartın, kişilerin ve takibin tek yerde",
    description:
      "OpSo, kişi listesi ve takip özelliği olan ücretsiz dijital kartvizit. Android: kapalı test, iPhone: Apple’a gönderildi. Karşı tarafın uygulaması gerekmez.",
  },
  crumbs: [],
  crumb: "OpSo",
  hero: {
    eyebrow: "OpSo · OpSolid’den · test aşamasında",
    h1: ["Kart, kişiler, takip.", "Tanıştığın insanı unutmazsın", ""],
    lede: "OpSo, kişi listesi olan dijital kartvizit. Kartını karekod, NFC ya da bağlantıyla paylaşırsın, nerede tanıştığını not edersin ve zamanında takip edersin.",
    primary: { label: "Test erişimi iste", to: "kontakt", query: { anliegen: "opso" } },
    secondary: { label: "Özelliklere bak", to: "opso", hash: "funktionen" },
    facts: ["Bugün ücretsiz, reklamsız", "Karşı tarafın uygulaması gerekmez", "Durum: 28.10.2026"],
    media: {
      kind: "image",
      img: { src: APP("tr", "02-share"), ...SCREEN, alt: "Karekod ile Dokun ve NFC kart sekmelerini gösteren OpSo paylaşma ekranı (demo veri)" },
      frame: "phone",
      caption: "Android uygulamasının paylaşma ekranı, demo veri",
      fig: "0.1",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "zielgruppe",
      label: "Kimler için",
      note: "El sıkışma için tasarlandı.",
      h: "OpSo kimler için",
      lede: "İşini yüz yüze sohbetlerle yürüten ve sonrasını rahatça takip etmek isteyenler için. Bağlantılarını çoğunlukla çevrimiçi kuruyorsan, bir iş ağı sana daha uygun.",
      items: [
        { h: "Fuar ziyaretçileri", p: "Bir günde çok sohbet edersin; sonra kimin ne istediğini hâlâ bilirsin." },
        { h: "Küçük fuar katılımcıları", p: "Kartını paylaş, kişiyi kaydet, fuardan sonra takip et." },
        { h: "Serbest çalışanlar ve danışmanlar", p: "Her yerde gösterebileceğin tek bir kart ve seninle büyüyen bir liste." },
        { h: "Esnaf ve yerel işletmeler", p: "Kâğıt kart destelerinin yerine bir bağlantı ve bir karekod." },
        { h: "Topluluk ve etkinlik organizatörleri", p: "Çok şey organize eden çok insanla tanışır; tüm kişiler için tek bir yer gerekir." },
      ],
    },
    {
      t: "steps",
      id: "ablauf",
      label: "Nasıl çalışır",
      note: "Standda ya da el sıkışırken gerçekleşen üç adım.",
      h: "Tanış. Hatırla. Takip et",
      items: [
        {
          h: "Kartını paylaş",
          p: "Karekodu göster, telefonları dokundur (Android), NFC etiketi kullan ya da bağlantıyı gönder. Kartın karşı tarafın tarayıcısında açılır.",
        },
        {
          h: "Kiminle nerede tanıştığını kaydet",
          p: "Her kişi, tanıştığınız yeri, notları ve bir durum etiketini taşır. Kâğıt kartviziti taratırsan aynı listeye eklenir.",
        },
        {
          h: "Zamanında takip et",
          p: "Bir hatırlatıcı kur ve hazır bir takip mesajı gönder; güzel bir sohbet standda bitmesin.",
        },
      ],
    },
    {
      t: "gallery",
      id: "bildschirme",
      label: "Ekranlar",
      h: "Uygulama, ekran ekran",
      lede: "Bunlar Android uygulamasından gerçek ekranlar. Görünen kişiler ve şirketler kurgusal demo verisidir.",
      frame: "phone",
      tag: "Demo veri",
      items: screens(
        "tr",
        [
          "Kartını oluştur: ad, unvan ve şirket, sonra yayınla",
          "Karekod ile Dokun ve NFC kart sekmelerini gösteren paylaşma ekranı",
          "Kartın alıcının tarayıcısında, tek dokunuşla kişi olarak kaydediliyor",
          "Arama ve Gidiyorum düğmesiyle fuar takvimi",
          "Bağlantıdaki bir kişiyle, yazı ve ekli dosyalı sohbet",
          "Durum etiketleri, notlar ve CSV ya da vCard dışa aktarımıyla kişi listesi",
          "Şablon, renk ve yazı tipleri ile canlı önizlemeli kart editörü",
          "Gizlilik ayarları: neyin açık olacağını seç, verini indir ya da sil",
        ],
        [
          "Kartını oluştur",
          "Karekod, dokun ya da NFC ile paylaş",
          "Kartın alıcıda",
          "Fuar takvimi",
          "Bağlantıdaki kişiyle sohbet",
          "Durum etiketli kişiler",
          "Canlı önizlemeli kart editörü",
          "Gizlilik ayarları",
        ],
      ),
    },
    {
      t: "rows",
      id: "funktionen",
      label: "Özellikler",
      h: "OpSo bugün neler yapıyor",
      lede: "Yalnızca uygulamada şu anda var olan özellikler. Hiçbiri sonraya verilmiş bir söz değil.",
      items: [
        { tag: "Paylaşma", h: "Uygulamasız web kartı", p: "Kartın opso.cc/adin adresinde durur ve her tarayıcıda açılır." },
        {
          tag: "Paylaşma",
          h: "Karekod, NFC etiketi ve dokun",
          p: "Karekodla, uyumlu bir NFC etiketiyle ya da Android’de telefonları dokundurarak paylaş.",
        },
        { tag: "Kaydetme", h: "Kartvizit tarama", p: "Kâğıt kartı fotoğrafla, kişiyi listene ekle." },
        {
          tag: "Kişiler",
          h: "“Nerede tanıştık”",
          p: "Notlar, durum etiketi (sıcak, ılık, VIP) ve tanışılan yer; aranabilir tek bir listede.",
        },
        { tag: "Takip", h: "Takip hatırlatıcıları", p: "Kişi başına bir hatırlatıcı ve uyarlayıp gönderebileceğin hazır bir takip mesajı." },
        {
          tag: "Fuarlar",
          h: "Fuar takvimi",
          p: "Seçilmiş fuarların listesi. “Gidiyorum”a dokun, yeni kişiler o fuara eklenir.",
        },
        { tag: "Mesajlar", h: "Birebir mesajlaşma", p: "Bağlantıda olduğun kişilerle yazı, fotoğraf ve dosya ile mesajlaş." },
        {
          tag: "Dışa aktarma",
          h: "Telefonuna kaydet",
          p: "Bir kişiyi doğrudan telefonunun rehberine kaydet ya da kişilerini CSV veya vCard olarak dışa aktar.",
        },
      ],
    },
    {
      t: "gallery",
      id: "beispielkarten",
      label: "Örnek kartlar",
      h: "Web kartın, kendi tarzında",
      lede: "Yayınlanan bir kart, alıcının tarayıcısında açılır. NFC için uyumlu bir telefon ve etiket gerekir.",
      frame: "phone",
      tag: "Örnekler · yapay zeka ile üretilmiş portreler",
      items: cards(
        [
          "Mimar Clara Weber’in açık taş tonlarındaki örnek kartı, yapay zeka ile üretilmiş portreyle",
          "Danışman James Bennett’in klasik lacivert örnek kartı, yapay zeka ile üretilmiş portreyle",
          "Marka tasarımcısı Maya Collins’in mercan ve mor örnek kartı, yapay zeka ile üretilmiş portreyle",
          "Ürün tasarımcısı Felix Berger’in ferah nane yeşili örnek kartı, yapay zeka ile üretilmiş portreyle",
        ],
        [
          "Clara Weber, mimar · Açık taş tonları",
          "James Bennett, danışman · Klasik lacivert",
          "Maya Collins, marka tasarımcısı · Mercan ve mor",
          "Felix Berger, ürün tasarımcısı · Ferah nane",
        ],
      ),
    },
    {
      t: "product",
      id: "nfc-karte",
      label: "NFC kart",
      note: "Henüz sipariş verilemiyor.",
      h: "Fiziksel NFC kart: bir konsept",
      lede: "Tek dokunuşla OpSo profilini açan bir kart.",
      name: "Fiziksel NFC kart",
      status:
        "Konsept. Fiyat, baskı özellikleri ve satış tarihi üretim denemesinden sonra kesinleşecek.",
      p: "Planlanan mat siyah kart, tek dokunuşla OpSo profilini açacak. Basılı karekodun alternatif olarak kullanılması planlanıyor.",
      points: [
        "Standart ölçülerde mat siyah kart",
        "Abonelikten ayrı, tek seferlik satın alma",
      ],
      price: { label: "Planlanan tanıtım fiyatı", value: "24,90 €, KDV dahil, kargo ayrıca ücretlendirilir" },
      href: { label: "NFC kart hakkında bilgi al", to: "kontakt", query: { anliegen: "opso" } },
      media: {
        kind: "image",
        img: {
          src: "/img/v7/opso/render-hero.jpg",
          w: 1600,
          h: 1200,
          alt: "Bakır folyolu mat siyah bir NFC kartvizitin konsept görseli: önde logo, arkada karekod ve örnek ad",
        },
        caption: "Konsept görsel. Nihai kart farklılık gösterebilir.",
        fig: "6.1",
      },
    },
    {
      t: "principles",
      id: "daten",
      label: "Maliyet ve veri",
      h: "Bugün ücretsiz, reklamsız",
      lede: "Ödeme adımı, ödeme bilgisi ve reklam yok.",
      cta: { label: "Gizlilik politikasına git", to: "privacy" },
      items: [
        { h: "Ücretsiz", p: "Hiçbir ücret alınmıyor. Bu değişirse, herhangi bir ücretten önce bu sayfada duyurulur." },
        { h: "Neyin herkese açık olduğuna sen karar verirsin", p: "Kartında yalnızca senin açtığın bilgiler görünür." },
        { h: "İstediğin an dışa aktar", p: "Kişilerini CSV veya vCard olarak, verilerini uygulamadan dışa aktarabilirsin." },
        { h: "İstediğin an hesabını sil", p: "Bunu uygulamadan yaparsın. Ayrıntılar gizlilik politikasında." },
      ],
    },
    {
      t: "spec",
      id: "verfuegbarkeit",
      label: "Uygulama durumu",
      footnote: "Durum: 28.10.2026.",
      h: "OpSo’yu nereden alırsın",
      lede: "OpSo test aşamasında. Android: Google Play’de kapalı test. iPhone: Apple’a inceleme için gönderildi (durum: 28.10.2026).",
      cta: { label: "Test erişimi iste", to: "kontakt", query: { anliegen: "opso" } },
      rows: [
        ["Android", "Google Play’de kapalı test, yalnızca davetli test kullanıcılarına açık; henüz herkese açık bir mağaza bağlantısı yok. Bize yaz, seni ekleyelim."],
        ["iPhone", "App Store için henüz bir tarih yok."],
        ["Tarayıcıda", "Yayınlanmış her kart şimdiden tarayıcıda açılır, iPhone’da da."],
        ["Kendi alan adın", "Henüz değil. Kartlar opso.cc altında yayınlanır."],
      ],
    },
    {
      t: "text",
      id: "von-opsolid",
      label: "OpSolid’den",
      note: "Kendi ürünümüz, danışmanlıktan ayrı.",
      h: "OpSo, OpSolid’in bir ürünü",
      lede: "OpSo’yu ilk taslaktan işletmeye kadar kendimiz geliştirir ve işletiriz.",
      paras: [
        "Aynı çalışma biçimini şirketlere yönelik yapay zeka danışmanlığımıza da taşırız: önce neyin gerektiğini netleştirmek, sonra günlük işte çalışanı kurmak.",
      ],
      cta: { label: "Şirketler için yapay zeka danışmanlığı", to: "beratung" },
    },
  ],
  faq: {
    label: "Sık sorulan sorular",
    h: "Başlamadan önce",
    items: [
      {
        q: "Karşı tarafın uygulamaya ihtiyacı var mı?",
        a: "Hayır. Yayınladığın kart tarayıcıda açılır. Karekodlar ve uyumlu NFC etiketleri kartın herkese açık bağlantısına gider.",
      },
      {
        q: "OpSo ne kadar?",
        a: "Şu anda hiçbir şey: OpSo ücretsiz ve reklamsız.",
      },
      {
        q: "OpSo’yu iPhone’umda kullanabilir miyim?",
        a: "Henüz mağazada değil. iPhone sürümü Apple’a inceleme için gönderildi (durum: 28.10.2026). iPhone’u olan herkes kartını yine de tarayıcıda açabilir.",
      },
      {
        q: "Verilerime ne olur?",
        a: "Kartında neyin herkese açık olduğuna sen karar verirsin. Verilerini istediğin an dışa aktarabilir, hesabını uygulamadan silebilirsin. Ayrıntılar gizlilik politikasında.",
      },
    ],
  },
  cta: {
    label: "OpSo",
    h: "OpSo’yu dene",
    p: "Bize kısaca yaz, seni Android testine ekleyelim.",
    primary: { label: "Test erişimi iste", to: "kontakt", query: { anliegen: "opso" } },
    secondary: { label: "Şirketler için YZ Kontrolü", to: "check" },
  },
  schema: {
    software: {
      name: "OpSo",
      description: "Kişi listesi ve takip özelliği olan dijital kartvizit. Kartını karekod, NFC ya da bağlantıyla paylaş; karşı tarafın uygulaması gerekmez. Test aşamasında.",
      os: ["Android", "iOS"],
      category: "BusinessApplication",
    },
  },
};

export const page: PageSet = { de, en, tr };
