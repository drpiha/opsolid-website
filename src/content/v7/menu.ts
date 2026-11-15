/**
 * The four mega menus, the phone menu and the footer of the Werkstatt shell (owner decisions 71 and 77; PLAN
 * sections 3.2 to 4, lead overrides A and B). One builder per locale fills the same structure, so de, en and tr
 * have the same groups, columns, items and targets by construction (scripts/tests/menu-rules.test.mts pins it).
 *
 * Rules this file keeps (repo CLAUDE.md, site rules 1 to 6):
 * - Prices come only from offers.ts (OFFERS, CHECK). Every group that shows a price has a foot note and a phone
 *   note with SITE_STR.priceNote; the KI-Check chip always travels with CHECK.credit in the same group.
 * - The four planned courses (PLANNED) appear only in the Schulungen group, in their fixed order, with "geplant"
 *   and "Interesse vormerken" (contact form, ?anliegen=vormerken). No duration, price, date or page of their own.
 * - Kutasia: one descriptive line (override A), "in Entwicklung", "noch nicht erhältlich"; no price, no picture,
 *   no external link, no "buchen", no pilot-stage wording. The OpSo NFC-Karte: "in Vorbereitung", no price (decision 78).
 * - No on-site wording, no place names, no team size, no dashes in copy.
 */
import { OFFERS, CHECK, PLANNED } from "./offers";
import { LABEL, SITE_STR } from "./site";
import type { Chip, Href, Img } from "./types";
import type { L3, PageKey } from "@/lib/v7-routes";
import { postSlugIn } from "@/lib/blog-slugs";

/** A menu link target: a page key (localized by href()) or a mail link. The visible text lives on the item. */
export type Target = { to: PageKey; hash?: string; sub?: string; query?: Record<string, string> } | { href: `mailto:${string}` };

export type MenuItem = {
  label: string;
  desc?: string;
  to: Target;
  chip?: Chip;
  /** Small labelled picture (Produkte only): an app screen or the NFC render. `cap` is its visible Etikett. */
  thumb?: { img: Img; cap: string; kind: "app" | "render" };
};

export type MenuCol = {
  h: string;
  /** lead: larger item names; mini: one-line rows without description (planned courses). */
  style?: "lead" | "mini";
  items: MenuItem[];
  /** One extra link under a mini list ("Interesse vormerken"). */
  after?: MenuItem;
  /** A note chip under the column ("Pilot zum Festpreis"). */
  note?: Chip;
};

/** The drawn picture of a feature card. Every piece carries its Etikett (rule 6) on the card. */
export type FeatureArt =
  | { kind: "agenda" | "report"; title: string; sub: string; stamp: string; items: { time?: string; text: string }[]; ariaLabel: string }
  | { kind: "phones"; phones: [Img, Img] }
  | { kind: "way"; labels: [string, string, string, string]; base: string; ariaLabel: string };

export type MenuFeature = { art: FeatureArt; etikett: string; title: string; p: string; cta: Href };

export type MenuGroupKey = "schulungen" | "beratung" | "produkte" | "unternehmen";

export type MenuGroup = {
  key: MenuGroupKey;
  /** Top item text. */
  label: string;
  /** The page the top item's label links to (decision 71). */
  hub: PageKey;
  /** Mark colour (decision 77): Schulungen copper, Beratung slate, Produkte charcoal, Unternehmen ink. */
  line: MenuGroupKey;
  cols: MenuCol[];
  /** CSS grid-template-columns of the columns (default: equal columns). */
  colTemplate?: string;
  feature: MenuFeature;
  foot: { link: Href; note: string };
  /**
   * Phone menu: summary under the group name, the price note (only where the group shows a price), the hub link.
   * `flat`: one plain list of all links without column headings (Unternehmen).
   */
  mobile: { summary: string; priceNote?: string; all: Href; flat?: boolean };
};

export type FooterLink = { to: Href; small?: string };
export type FooterCol = { id: MenuGroupKey; h: string; links: FooterLink[] };

const post = (n: 0 | 1, l: L3): Target => ({
  to: "blog",
  sub: `/${postSlugIn(n === 0 ? "what-does-ai-training-cost" : "is-ai-training-mandatory-ai-act-article-4", l)}`,
});
const app = (l: L3, n: string, alt: string): Img => ({ src: `/img/v7/opso/app/${l}-${n}.webp`, w: 328, h: 710, alt });
const NFC_THUMB = "/img/v7/werkstatt/render/render-hero-thumb.webp";
const MAIL = "info@opsolid.de";

/** The copy of one locale. Targets, order and counts live in build() and are the same for every locale. */
type Copy = {
  s: {
    label: string; h1: string; d: [string, string, string]; h2: string; vormerken: string; geplant: string; h3: string;
    how: [string, string][]; journal: string;
    blatt: { title: string; sub: string; items: [string, string, string, string]; aria: string };
    etikett: string; title: string; p: string; all: string; summary: string;
  };
  b: {
    label: string; h1: string; checkD: string; intro: string; introD: string; h2: string; pilot: string;
    prozessD: string; m365D: string; agenten: string; agentenD: string; h3: string; anwD: string; beispiel: string;
    blatt: { title: string; sub: string; items: [string, string, string]; aria: string };
    etikett: string; title: string; p: string; cta: string; all: string; summary: string;
  };
  p: {
    label: string; h1: string; opsoD: string; opsoChip: string; appCap: string; nfc: string; nfcD: string; nfcChip: string;
    renderCap: string; h2: string; kutD: string; kutChip: string; contactsAlt: string; shareAlt: string; editorAlt: string;
    etikett: string; title: string; p: string; all: string; note: string; summary: string;
  };
  u: {
    label: string; h1: string; ueberD: string; method: string; methodD: string; trainerD: string; h2: string; blogD: string;
    post1: string; post1D: string; post2: string; post2D: string; h3: string; kontaktD: string; mailD: string;
    way: [string, string, string, string]; wayBase: string; wayAria: string;
    etikett: string; title: string; p: string; all: string; summary: string;
  };
  foot: { allS: string; allB: string; nfc: string; nfcSmall: string; kutSmall: string; allP: string };
};

const COPY: Record<L3, Copy> = {
  de: {
    s: {
      label: "Schulungen",
      h1: "Mit Preis pro Team",
      d: [
        "Halber Tag: was KI kann, wo sie irrt, welche Regeln gelten.",
        "Ein Tag Copilot in Outlook, Teams, Word, Excel und PowerPoint.",
        "Zwei Tage: KI-Agenten und Workflows an Abläufen aus Ihrem Alltag aufbauen.",
      ],
      h2: "In Vorbereitung",
      vormerken: "Interesse vormerken",
      geplant: "geplant",
      h3: "So läuft es",
      how: [
        ["So läuft eine Schulung", "Von der Anfrage bis zur Teilnahmebescheinigung."],
        ["Preise und Gruppengrößen", "Preis pro Team, netto, Personen inklusive."],
        ["Online, live, in Microsoft Teams", "Geschlossener Termin für Ihr Team, auf Wunsch per Zoom."],
        ["Ist eine KI-Schulung Pflicht?", "Art. 4 KI-Verordnung, nüchtern erklärt."],
      ],
      journal: "Journal",
      blatt: {
        title: "Agenda KI-Kompetenz Basis",
        sub: "Halber Tag · 3,5 Stunden",
        items: ["Was KI ist und was nicht", "Gute Anfragen stellen", "Fehler erkennen", "Datenschutz im Alltag"],
        aria: "Muster einer Agenda für KI-Kompetenz Basis, Zeiten als Beispiel: Was KI ist und was nicht, Gute Anfragen stellen, Fehler erkennen, Datenschutz im Alltag",
      },
      etikett: "Muster · Zeiten als Beispiel",
      title: "Schulung für Ihr Team anfragen",
      p: "Schreiben Sie uns kurz zu Teamgröße, Sprache und Wunschzeitraum. Wir melden uns mit einem Vorschlag.",
      all: "Alle Schulungen und Preise",
      summary: "Drei mit Preis, vier in Vorbereitung",
    },
    b: {
      label: "Beratung",
      h1: "Einstieg",
      checkD: "Fragebogen und schriftlicher Bericht mit Schulungsempfehlung.",
      intro: "Kennenlernen",
      introD: "Per E-Mail oder 15 bis 30 Minuten per Video, kostenlos und unverbindlich.",
      h2: "Umsetzung nach dem KI-Check",
      pilot: "Pilot zum Festpreis",
      prozessD: "Daten nur einmal erfassen, Übergaben ohne Abtippen.",
      m365D: "Power Automate, SharePoint, Teams und Outlook in Ihrem Tenant einrichten.",
      agenten: "KI-Assistenten für Telefon und Chat",
      agentenD: "Der KI-Assistent nimmt ab. Ihr Team entscheidet.",
      h3: "Beispiele",
      anwD: "Dienstleistung, Gastronomie, Handel, Praxen: Beispiele, keine Kundenprojekte.",
      beispiel: "Beispiel",
      blatt: {
        title: "Ergebnis KI-Check",
        sub: "Hausverwaltung Kranich · fiktives Unternehmen",
        items: ["E-Mail-Eingang vorsortieren", "Antwortentwürfe für Mieterfragen", "Eingangsrechnungen auslesen"],
        aria: "Muster eines KI-Check-Ergebnisses für ein fiktives Unternehmen: E-Mail-Eingang vorsortieren, Antwortentwürfe für Mieterfragen, Eingangsrechnungen auslesen",
      },
      etikett: "Beispiel, fiktiv",
      title: "Erst analysieren, dann schulen",
      p: "Der KI-Check zeigt schriftlich, wo KI bei Ihnen hilft, und endet mit einer Schulungsempfehlung.",
      cta: "KI-Check anfragen",
      all: "Zur KI-Beratung",
      summary: "KI-Check, danach Umsetzung im Pilot",
    },
    p: {
      label: "Produkte",
      h1: "Verfügbar",
      opsoD: "Digitale Visitenkarte mit Kontaktliste und Follow-up. Kostenlos für iPhone und Android.",
      opsoChip: "im App Store und bei Google Play",
      appCap: "App-Screen, Demodaten",
      nfc: "OpSo NFC-Karte",
      nfcD: "Die Visitenkarte zum Antippen, verbunden mit Ihrer OpSo-Karte.",
      nfcChip: "in Vorbereitung",
      renderCap: "Render",
      h2: "In Entwicklung",
      kutD: "Gemeinsamer Posteingang mit KI-Antwortvorschlägen. Noch nicht erhältlich.",
      kutChip: "in Entwicklung",
      contactsAlt: "",
      shareAlt: "OpSo App: Teilen-Bildschirm mit QR-Code (Demodaten)",
      editorAlt: "OpSo App: Karteneditor (Demodaten)",
      etikett: "App-Screens · unbearbeitet, Demodaten",
      title: "Was wir selbst bauen und betreiben",
      p: "OpSo ist live: kostenlos für iPhone und Android. Die OpSo NFC-Karte ist in Vorbereitung, Kutasia in Entwicklung.",
      all: "Alle Produkte",
      note: "OpSo: kostenlos für iPhone und Android.",
      summary: "OpSo, NFC-Karte, Kutasia",
    },
    u: {
      label: "Unternehmen",
      h1: "OpSolid",
      ueberD: "Wer wir sind und wie wir arbeiten.",
      method: "Unsere Arbeitsweise",
      methodD: "Erst analysieren, dann schulen oder umsetzen.",
      trainerD: "Sie schulen selbst? So arbeiten Sie mit uns.",
      h2: "Wissen",
      blogD: "Artikel zu KI-Schulung, Kosten und Regeln.",
      post1: "Was kostet eine KI-Schulung?",
      post1D: "Preise pro Team, nachgerechnet.",
      post2: "Ist eine KI-Schulung Pflicht?",
      post2D: "Art. 4 KI-Verordnung, nüchtern erklärt.",
      h3: "Kontakt",
      kontaktD: "Formular oder E-Mail an info@opsolid.de.",
      mailD: "E-Mail schreiben",
      way: ["Anfrage", "Angebot\nmit Agenda", "Live-Termin\nin Teams", "Bescheini-\ngung"],
      wayBase: "Vertrag und Rechnung: über OpSolid",
      wayAria: "Schema der Arbeitsweise: Anfrage, Angebot mit Agenda, Live-Termin in Microsoft Teams, Teilnahmebescheinigung; Vertrag und Rechnung über OpSolid",
      etikett: "Schema · Arbeitsweise",
      title: "Ein Unternehmen, eine Methode",
      p: "OpSolid organisiert KI-Schulungen im eigenen Namen, mit freiberuflichen Trainerinnen und Trainern, die wir selbst auswählen und Ihnen vor der Buchung namentlich nennen. Vertrag und Rechnung laufen über OpSolid.",
      all: "Kontakt aufnehmen",
      summary: "Über uns, Journal, Kontakt",
    },
    foot: {
      allS: "Alle Schulungen und Preise",
      allB: "Zur KI-Beratung",
      nfc: "OpSo NFC-Karte",
      nfcSmall: "in Vorbereitung",
      kutSmall: "in Entwicklung",
      allP: "Alle Produkte",
    },
  },
  en: {
    s: {
      label: "Training",
      h1: "Priced per team",
      d: [
        "Half day: what AI can do, where it goes wrong, which rules apply.",
        "A full day of Copilot in Outlook, Teams, Word, Excel and PowerPoint.",
        "Two days: build AI agents and workflows on processes from your daily work.",
      ],
      h2: "In preparation",
      vormerken: "Register interest",
      geplant: "planned",
      h3: "How it works",
      how: [
        ["How a training runs", "From the request to the participation record."],
        ["Prices and group sizes", "Price per team, net, people included."],
        ["Online, live, in Microsoft Teams", "A closed session for your team, Zoom on request."],
        ["Is AI training mandatory?", "Article 4 of the AI Act, explained plainly."],
      ],
      journal: "Journal",
      blatt: {
        title: "Agenda AI literacy basics",
        sub: "Half day · 3.5 hours",
        items: ["What AI is and is not", "Asking well", "Spotting errors", "Data protection in daily work"],
        aria: "Sample agenda for AI literacy basics, times as an example: What AI is and is not, Asking well, Spotting errors, Data protection in daily work",
      },
      etikett: "Sample · times as an example",
      title: "Request training for your team",
      p: "Tell us briefly about team size, language and preferred period. We come back with a proposal.",
      all: "All training and prices",
      summary: "Three priced, four in preparation",
    },
    b: {
      label: "Consulting",
      h1: "Getting started",
      checkD: "Questionnaire and written report with a training recommendation.",
      intro: "Intro",
      introD: "By email or a 15 to 30-minute video call, free and without obligation.",
      h2: "Implementation after the AI check",
      pilot: "Pilot at a fixed price",
      prozessD: "Enter data once, hand it over without retyping.",
      m365D: "Set up Power Automate, SharePoint, Teams and Outlook in your tenant.",
      agenten: "AI assistants for phone and chat",
      agentenD: "The AI assistant picks up. Your team decides.",
      h3: "Examples",
      anwD: "Services, hospitality, retail, practices: examples, not client projects.",
      beispiel: "Example",
      blatt: {
        title: "AI check result",
        sub: "Hausverwaltung Kranich · fictional company",
        items: ["Pre-sort incoming email", "Draft replies to tenant questions", "Read incoming invoices"],
        aria: "Sample AI check result for a fictional company: pre-sort incoming email, draft replies to tenant questions, read incoming invoices",
      },
      etikett: "Example, fictional",
      title: "Analyse first, then train",
      p: "The AI check shows in writing where AI helps you and ends with a training recommendation.",
      cta: "Request an AI check",
      all: "Go to AI consulting",
      summary: "AI check, then implementation as a pilot",
    },
    p: {
      label: "Products",
      h1: "Available",
      opsoD: "Digital business card with contact list and follow-up. Free for iPhone and Android.",
      opsoChip: "in the App Store and on Google Play",
      appCap: "App screen, demo data",
      nfc: "OpSo NFC card",
      nfcD: "The business card you tap, linked to your OpSo card.",
      nfcChip: "in preparation",
      renderCap: "Render",
      h2: "In development",
      kutD: "Shared inbox with AI reply suggestions. Not yet available.",
      kutChip: "in development",
      contactsAlt: "",
      shareAlt: "OpSo app: share screen with QR code (demo data)",
      editorAlt: "OpSo app: card editor (demo data)",
      etikett: "App screens · unedited, demo data",
      title: "What we build and run ourselves",
      p: "OpSo is live: free for iPhone and Android. The OpSo NFC card is in preparation, Kutasia in development.",
      all: "All products",
      note: "OpSo: free for iPhone and Android.",
      summary: "OpSo, NFC card, Kutasia",
    },
    u: {
      label: "Company",
      h1: "OpSolid",
      ueberD: "Who we are and how we work.",
      method: "How we work",
      methodD: "Analyse first, then train or implement.",
      trainerD: "You train yourself? Here is how we work together.",
      h2: "Knowledge",
      blogD: "Articles on AI training, costs and rules.",
      post1: "What does AI training cost?",
      post1D: "Prices per team, worked through.",
      post2: "Is AI training mandatory?",
      post2D: "Article 4 of the AI Act, explained plainly.",
      h3: "Contact",
      kontaktD: "Form or email to info@opsolid.de.",
      mailD: "Write an email",
      way: ["Request", "Offer with\nagenda", "Live session\nin Teams", "Participation\nrecord"],
      wayBase: "Contract and invoice: through OpSolid",
      wayAria: "Schema of how we work: request, offer with agenda, live session in Microsoft Teams, participation record; contract and invoice through OpSolid",
      etikett: "Schema · how we work",
      title: "One company, one method",
      p: "OpSolid organises AI training in its own name, with freelance trainers we select ourselves and name to you before you book. Contract and invoice run through OpSolid.",
      all: "Get in touch",
      summary: "About us, Journal, Contact",
    },
    foot: {
      allS: "All training and prices",
      allB: "Go to AI consulting",
      nfc: "OpSo NFC card",
      nfcSmall: "in preparation",
      kutSmall: "in development",
      allP: "All products",
    },
  },
  tr: {
    s: {
      label: "Eğitimler",
      h1: "Ekip başına fiyatlı",
      d: [
        "Yarım gün: YZ neler yapabilir, nerede yanılır, hangi kurallar geçerlidir.",
        "Outlook, Teams, Word, Excel ve PowerPoint'te bir gün Copilot.",
        "İki gün: günlük işinizdeki süreçler üzerinde YZ ajanları ve iş akışları kurmak.",
      ],
      h2: "Hazırlanıyor",
      vormerken: "İlginizi bildirin",
      geplant: "planlanıyor",
      h3: "Nasıl işler",
      how: [
        ["Bir eğitim nasıl ilerler", "Talepten katılım belgesine kadar."],
        ["Fiyatlar ve grup büyüklükleri", "Ekip başına fiyat, net, kişiler dahil."],
        ["Çevrimiçi, canlı, Microsoft Teams'te", "Ekibinize özel kapalı oturum, isterseniz Zoom ile."],
        ["Yapay zeka eğitimi zorunlu mu?", "AI Act 4. madde, sade bir dille."],
      ],
      journal: "Notlar",
      blatt: {
        title: "Program: YZ Yetkinliği Temel",
        sub: "Yarım gün · 3,5 saat",
        items: ["YZ nedir, ne değildir", "İyi istek yazmak", "Hataları fark etmek", "Günlük işte veri koruma"],
        aria: "YZ Yetkinliği Temel için örnek program, saatler temsilidir: YZ nedir, ne değildir; İyi istek yazmak; Hataları fark etmek; Günlük işte veri koruma",
      },
      etikett: "Örnek · saatler temsilidir",
      title: "Ekibiniz için eğitim talep edin",
      p: "Ekip büyüklüğü, dil ve tercih ettiğiniz dönem hakkında kısaca yazın. Bir teklifle döneriz.",
      all: "Tüm eğitimler ve fiyatlar",
      summary: "Üçü fiyatlı, dördü hazırlanıyor",
    },
    b: {
      label: "Danışmanlık",
      h1: "Başlangıç",
      checkD: "Anket ve eğitim önerisiyle biten yazılı rapor.",
      intro: "Tanışma",
      introD: "E-postayla ya da 15-30 dakika görüntülü; ücretsiz ve bağlayıcı değil.",
      h2: "YZ Kontrolü sonrası uygulama",
      pilot: "Sabit fiyatlı pilot",
      prozessD: "Veriyi bir kez girin, yeniden yazmadan aktarın.",
      m365D: "Power Automate, SharePoint, Teams ve Outlook'u kendi tenant'ınızda kurmak.",
      agenten: "Telefon ve sohbet için YZ asistanları",
      agentenD: "YZ asistanı telefonu açar. Kararı ekibiniz verir.",
      h3: "Örnekler",
      anwD: "Hizmet, yeme-içme, perakende, muayenehaneler: örnekler, müşteri projesi değil.",
      beispiel: "Örnek",
      blatt: {
        title: "YZ Kontrolü sonucu",
        sub: "Hausverwaltung Kranich · kurgusal şirket",
        items: ["Gelen e-postaları önceden ayırmak", "Kiracı soruları için yanıt taslakları", "Gelen faturaları okumak"],
        aria: "Kurgusal bir şirket için örnek YZ Kontrolü sonucu: gelen e-postaları önceden ayırmak, kiracı soruları için yanıt taslakları, gelen faturaları okumak",
      },
      etikett: "Örnek, kurgusal",
      title: "Önce analiz, sonra eğitim",
      p: "YZ Kontrolü, YZ'nin size nerede yardımcı olduğunu yazılı olarak gösterir ve bir eğitim önerisiyle biter.",
      cta: "YZ Kontrolü isteyin",
      all: "YZ danışmanlığına git",
      summary: "YZ Kontrolü, ardından pilot olarak uygulama",
    },
    p: {
      label: "Ürünler",
      h1: "Mevcut",
      opsoD: "Kişi listesi ve takip özellikli dijital kartvizit. iPhone ve Android için ücretsiz.",
      opsoChip: "App Store'da ve Google Play'de",
      appCap: "Uygulama ekranı, demo veri",
      nfc: "OpSo NFC kartı",
      nfcD: "Dokunarak paylaşılan kartvizit, OpSo kartınıza bağlı.",
      nfcChip: "hazırlanıyor",
      renderCap: "Render",
      h2: "Geliştiriliyor",
      kutD: "YZ yanıt önerileri sunan ortak gelen kutusu. Henüz satışta değil.",
      kutChip: "geliştiriliyor",
      contactsAlt: "",
      shareAlt: "OpSo uygulaması: karekodlu paylaşma ekranı (demo veri)",
      editorAlt: "OpSo uygulaması: kart düzenleyici (demo veri)",
      etikett: "Uygulama ekranları · düzenlenmemiş, demo veri",
      title: "Kendi geliştirip işlettiklerimiz",
      p: "OpSo yayında: iPhone ve Android için ücretsiz. OpSo NFC kartı hazırlanıyor, Kutasia geliştiriliyor.",
      all: "Tüm ürünler",
      note: "OpSo: iPhone ve Android için ücretsiz.",
      summary: "OpSo, NFC kartı, Kutasia",
    },
    u: {
      label: "Kurumsal",
      h1: "OpSolid",
      ueberD: "Kim olduğumuz ve nasıl çalıştığımız.",
      method: "Çalışma yöntemimiz",
      methodD: "Önce analiz, sonra eğitim ya da uygulama.",
      trainerD: "Kendiniz eğitim mi veriyorsunuz? Birlikte nasıl çalıştığımız.",
      h2: "Bilgi",
      blogD: "YZ eğitimi, maliyetler ve kurallar üzerine yazılar.",
      post1: "Yapay zeka eğitimi ne kadar tutar?",
      post1D: "Ekip başına fiyatlar, hesaplanmış olarak.",
      post2: "Yapay zeka eğitimi zorunlu mu?",
      post2D: "AI Act 4. madde, sade bir dille.",
      h3: "İletişim",
      kontaktD: "Form ya da info@opsolid.de adresine e-posta.",
      mailD: "E-posta yazın",
      way: ["Talep", "Program ile\nteklif", "Teams'te\ncanlı ders", "Katılım\nbelgesi"],
      wayBase: "Sözleşme ve fatura: OpSolid üzerinden",
      wayAria: "Çalışma yöntemi şeması: talep, programlı teklif, Microsoft Teams'te canlı ders, katılım belgesi; sözleşme ve fatura OpSolid üzerinden",
      etikett: "Şema · çalışma yöntemi",
      title: "Tek şirket, tek yöntem",
      p: "OpSolid, YZ eğitimlerini kendi adına, kendi seçtiği ve rezervasyondan önce size adıyla bildirdiği serbest eğitmenlerle düzenler. Sözleşme ve fatura OpSolid üzerinden yürür.",
      all: "İletişime geçin",
      summary: "Hakkımızda, Notlar, İletişim",
    },
    foot: {
      allS: "Tüm eğitimler ve fiyatlar",
      allB: "YZ danışmanlığına git",
      nfc: "OpSo NFC kartı",
      nfcSmall: "hazırlanıyor",
      kutSmall: "geliştiriliyor",
      allP: "Tüm ürünler",
    },
  },
};

function build(l: L3): MenuGroup[] {
  const c = COPY[l];
  const o = OFFERS[l];
  const ck = CHECK[l];
  const t = SITE_STR[l];
  const lb = LABEL[l];
  const schulung: Href = { label: t.cta, to: "kontakt", query: { anliegen: "schulung" } };
  return [
    {
      key: "schulungen",
      label: c.s.label,
      hub: "schulungen",
      line: "schulungen",
      colTemplate: "1.28fr .92fr 1fr",
      cols: [
        {
          h: c.s.h1,
          style: "lead",
          items: (["kompetenz", "copilot", "workflows"] as const).map((k, i) => ({
            label: o[k].name,
            desc: c.s.d[i],
            chip: { kind: "live", text: o[k].chip },
            to: { to: k },
          })),
        },
        {
          h: c.s.h2,
          style: "mini",
          items: PLANNED[l].map((name) => ({ label: name, to: { to: "schulungen", hash: "in-vorbereitung" } })),
          after: { label: c.s.vormerken, chip: { kind: "plan", text: c.s.geplant }, to: { to: "kontakt", query: { anliegen: "vormerken" } } },
        },
        {
          h: c.s.h3,
          items: [
            { label: c.s.how[0][0], desc: c.s.how[0][1], to: { to: "schulungen", hash: "ablauf" } },
            { label: c.s.how[1][0], desc: c.s.how[1][1], to: { to: "schulungen", hash: "preise" } },
            { label: c.s.how[2][0], desc: c.s.how[2][1], to: { to: "schulungen", hash: "format" } },
            { label: c.s.how[3][0], desc: c.s.how[3][1], chip: { kind: "note", text: c.s.journal }, to: post(1, l) },
          ],
        },
      ],
      feature: {
        art: {
          kind: "agenda",
          title: c.s.blatt.title,
          sub: c.s.blatt.sub,
          stamp: t.sampleLabel,
          items: ["09:00", "09:35", "10:10", "11:00"].map((time, i) => ({ time, text: c.s.blatt.items[i] })),
          ariaLabel: c.s.blatt.aria,
        },
        etikett: c.s.etikett,
        title: c.s.title,
        p: c.s.p,
        cta: schulung,
      },
      foot: { link: { label: c.s.all, to: "schulungen" }, note: t.priceNote },
      mobile: { summary: c.s.summary, priceNote: t.priceNote, all: { label: c.s.all, to: "schulungen" } },
    },
    {
      key: "beratung",
      label: c.b.label,
      hub: "beratung",
      line: "beratung",
      cols: [
        {
          h: c.b.h1,
          style: "lead",
          items: [
            { label: ck.name, desc: c.b.checkD, chip: { kind: "live", text: ck.chip }, to: { to: "check" } },
            { label: c.b.intro, desc: c.b.introD, to: { to: "kontakt", query: { anliegen: "beratung" } } },
          ],
        },
        {
          h: c.b.h2,
          note: { kind: "note", text: c.b.pilot },
          items: [
            { label: lb.prozess, desc: c.b.prozessD, to: { to: "prozess" } },
            { label: lb.m365, desc: c.b.m365D, to: { to: "m365" } },
            { label: c.b.agenten, desc: c.b.agentenD, to: { to: "agenten" } },
          ],
        },
        {
          h: c.b.h3,
          items: [{ label: lb.anwendungen, desc: c.b.anwD, chip: { kind: "note", text: c.b.beispiel }, to: { to: "anwendungen" } }],
        },
      ],
      feature: {
        art: {
          kind: "report",
          title: c.b.blatt.title,
          sub: c.b.blatt.sub,
          stamp: t.sampleLabel,
          items: c.b.blatt.items.map((text) => ({ text })),
          ariaLabel: c.b.blatt.aria,
        },
        etikett: c.b.etikett,
        title: c.b.title,
        // The KI-Check chip in this group always travels with the credit line (rule 1).
        p: `${c.b.p} ${ck.credit}`,
        cta: { label: c.b.cta, to: "kontakt", query: { anliegen: "ki-check" } },
      },
      foot: { link: { label: c.b.all, to: "beratung" }, note: `${ck.name}: ${ck.chip}. ${t.priceNote}` },
      mobile: { summary: c.b.summary, priceNote: `${ck.name}: ${ck.credit} ${t.priceNote}`, all: { label: c.b.all, to: "beratung" } },
    },
    {
      key: "produkte",
      label: c.p.label,
      hub: "produkte",
      line: "produkte",
      colTemplate: "1.2fr 1fr",
      cols: [
        {
          h: c.p.h1,
          items: [
            {
              label: "OpSo",
              desc: c.p.opsoD,
              chip: { kind: "live", text: c.p.opsoChip },
              thumb: { img: app(l, "06-contacts", c.p.contactsAlt), cap: c.p.appCap, kind: "app" },
              to: { to: "opso" },
            },
            {
              label: c.p.nfc,
              desc: c.p.nfcD,
              chip: { kind: "plan", text: c.p.nfcChip },
              thumb: { img: { src: NFC_THUMB, w: 400, h: 190, alt: "" }, cap: c.p.renderCap, kind: "render" },
              to: { to: "produkte", hash: "nfc-karte" },
            },
          ],
        },
        {
          h: c.p.h2,
          // Kutasia: one line, no picture, no price, no external link (override A).
          items: [{ label: "Kutasia", desc: c.p.kutD, chip: { kind: "plan", text: c.p.kutChip }, to: { to: "produkte", hash: "kutasia" } }],
        },
      ],
      feature: {
        art: { kind: "phones", phones: [app(l, "02-share", c.p.shareAlt), app(l, "07-editor", c.p.editorAlt)] },
        etikett: c.p.etikett,
        title: c.p.title,
        p: c.p.p,
        cta: { label: c.p.all, to: "produkte" },
      },
      foot: { link: { label: c.p.all, to: "produkte" }, note: c.p.note },
      mobile: { summary: c.p.summary, all: { label: c.p.all, to: "produkte" } },
    },
    {
      key: "unternehmen",
      label: c.u.label,
      hub: "ueber",
      line: "unternehmen",
      cols: [
        {
          h: c.u.h1,
          items: [
            { label: lb.ueber, desc: c.u.ueberD, to: { to: "ueber" } },
            // Override B: the About page carries the method section (id "methode").
            { label: c.u.method, desc: c.u.methodD, to: { to: "ueber", hash: "methode" } },
            { label: lb.trainer, desc: c.u.trainerD, to: { to: "trainer" } },
          ],
        },
        {
          h: c.u.h2,
          items: [
            { label: lb.blog, desc: c.u.blogD, to: { to: "blog" } },
            { label: c.u.post1, desc: c.u.post1D, to: post(0, l) },
            { label: c.u.post2, desc: c.u.post2D, to: post(1, l) },
          ],
        },
        {
          h: c.u.h3,
          items: [
            { label: lb.kontakt, desc: c.u.kontaktD, to: { to: "kontakt" } },
            { label: MAIL, desc: c.u.mailD, to: { href: `mailto:${MAIL}` } },
          ],
        },
      ],
      feature: {
        art: { kind: "way", labels: c.u.way, base: c.u.wayBase, ariaLabel: c.u.wayAria },
        etikett: c.u.etikett,
        title: c.u.title,
        p: c.u.p,
        cta: { label: lb.ueber, to: "ueber" },
      },
      foot: { link: { label: c.u.all, to: "kontakt" }, note: MAIL },
      mobile: { summary: c.u.summary, all: { label: c.u.all, to: "kontakt" }, flat: true },
    },
  ];
}

export const MENU: Record<L3, MenuGroup[]> = { de: build("de"), en: build("en"), tr: build("tr") };

function footer(l: L3): { cols: FooterCol[]; legal: FooterLink[] } {
  const c = COPY[l];
  const o = OFFERS[l];
  const lb = LABEL[l];
  const h = SITE_STR[l].footer;
  const page = (to: PageKey, label = lb[to]): FooterLink => ({ to: { label, to } });
  return {
    cols: [
      {
        id: "schulungen",
        h: h.schulungen,
        links: [page("kompetenz", o.kompetenz.name), page("copilot", o.copilot.name), page("workflows", o.workflows.name), page("schulungen", c.foot.allS)],
      },
      {
        id: "beratung",
        h: h.beratung,
        links: [page("check"), page("prozess"), page("m365"), page("agenten"), page("anwendungen"), page("beratung", c.foot.allB)],
      },
      {
        id: "produkte",
        h: h.produkte,
        links: [
          page("opso"),
          { to: { label: c.foot.nfc, to: "produkte", hash: "nfc-karte" }, small: c.foot.nfcSmall },
          { to: { label: "Kutasia", to: "produkte", hash: "kutasia" }, small: c.foot.kutSmall },
          page("produkte", c.foot.allP),
        ],
      },
      { id: "unternehmen", h: h.unternehmen, links: [page("ueber"), page("trainer"), page("blog"), page("kontakt")] },
    ],
    legal: [page("impressum"), page("privacy"), page("kontakt")],
  };
}

export const FOOTER: Record<L3, { cols: FooterCol[]; legal: FooterLink[] }> = { de: footer("de"), en: footer("en"), tr: footer("tr") };

/** Active top item per page (the home marks none). The header reads it from a data attribute, so no menu data ships as JS. */
export const PILLAR: Partial<Record<PageKey, MenuGroupKey>> = {
  schulungen: "schulungen",
  kompetenz: "schulungen",
  copilot: "schulungen",
  workflows: "schulungen",
  beratung: "beratung",
  check: "beratung",
  prozess: "beratung",
  m365: "beratung",
  agenten: "beratung",
  anwendungen: "beratung",
  produkte: "produkte",
  opso: "produkte",
  ueber: "unternehmen",
  trainer: "unternehmen",
  blog: "unternehmen",
  kontakt: "unternehmen",
};
