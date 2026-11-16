/**
 * Produkte (key "produkte", /produkte, EN /our-products, TR /urunler; owner decision 72, 2026-11-15): our own
 * products and where they stand. OpSo is live; the OpSo NFC card is "in Vorbereitung" with no price anywhere
 * (decision 78); Kutasia is "in Entwicklung" and "noch nicht erhältlich" with one descriptive sentence (lead
 * override A) and no price, link, picture, "buchen" or pilot wording. Company voice ("Sie" or neutral); the OpSo page
 * keeps its own "du". Prices appear only in the closing "why" cards, with the price note (rule 1).
 *
 * Pictures: the OpSo NFC renders (public/img/v7/werkstatt/render, own 3D renders, labelled "Render") and the
 * unedited, localized OpSo app screens with demo data (public/img/v7/opso/app, labelled "App-Screens").
 */
import { CHECK, OFFERS } from "../offers";
import { SITE_STR } from "../site";
import type { Block, L3, PageDef, PageSet, Picture } from "../types";
import { APP_STORE, OPSO_SOFTWARE, PLAY } from "./opso";

const RENDER = "/img/v7/werkstatt/render";
const SCREEN = { w: 328, h: 710 } as const;
const app = (loc: L3, n: string) => `/img/v7/opso/app/${loc}-${n}.webp`;
const STORE_SHOWN = { apple: "apps.apple.com/app/id6826541629", play: "play.google.com/store/apps/details?id=de.opsolid.verso" } as const;

function heroPic(alt: string, etikett: string): Picture {
  return {
    src: `${RENDER}/render-collection-1232.webp`,
    w: 1232,
    h: 770,
    srcSet: [
      { src: `${RENDER}/render-collection-800.webp`, w: 800 },
      { src: `${RENDER}/render-collection-1232.webp`, w: 1232 },
    ],
    sizes: "(max-width: 960px) 100vw, 52vw",
    alt,
    etikett,
    priority: true,
  };
}

function phones(loc: L3, alts: [string, string, string], captions: [string, string, string]) {
  return (["02-share", "06-contacts", "07-editor"] as const).map((n, i) => ({
    img: { src: app(loc, n), ...SCREEN, alt: alts[i] },
    caption: captions[i],
  }));
}

const nfcImg = (alt: string) => ({ src: `${RENDER}/render-linea-1120.webp`, w: 1120, h: 840, alt });

/* ---------------------------------------------------------------- de */

const deBlocks: Block[] = [
  {
    t: "app",
    id: "opso",
    label: "OpSo",
    etikett: "Verfügbar",
    h: "OpSo",
    chip: { kind: "live", text: "live" },
    lede: "Die digitale Visitenkarte mit Kontaktliste und Follow-up: Karte per QR-Code, NFC oder Link teilen, notieren, wo man sich getroffen hat, und rechtzeitig nachfassen.",
    free: "Kostenlos für iPhone und Android",
    stores: [
      { link: { label: "Im App Store laden", href: APP_STORE }, shown: STORE_SHOWN.apple },
      { link: { label: "Auf Google Play laden", href: PLAY }, shown: STORE_SHOWN.play },
    ],
    note: "Empfänger brauchen keine App. Heute kostenlos, ohne Werbung.",
    more: { label: "Verfügbarkeit und alle Funktionen", to: "opso" },
    phones: phones(
      "de",
      [
        "OpSo App: Teilen-Bildschirm mit QR-Code und den Reitern Antippen und NFC-Karte (Demodaten)",
        "OpSo App: Kontaktliste mit Lead-Status und Notizen (Demodaten)",
        "OpSo App: Karteneditor mit Vorlagen, Farben und Schriften (Demodaten)",
      ],
      ["Teilen per QR-Code, Antippen, NFC", "Kontakte mit Lead-Status", "Karteneditor mit Live-Vorschau"],
    ),
    phonesEtikett: "App-Screens · unbearbeitet, Demodaten",
    ground: "sheet",
  },
  {
    t: "product",
    id: "nfc-karte",
    label: "Gehört zu OpSo",
    h: "OpSo NFC-Karte",
    name: "OpSo NFC-Karte",
    p: "Die Visitenkarte zum Antippen, verbunden mit Ihrer OpSo-Karte.",
    chip: { kind: "plan", text: "in Vorbereitung" },
    status: "Noch nicht bestellbar.",
    points: [],
    media: {
      kind: "image",
      img: nfcImg("Zwei OpSo NFC-Karten in mattem Schwarz: eine mit Kupferzeichen und Kupferlinie, eine mit QR-Code und dem Beispielnamen Maya Collins"),
      caption: "Render · OpSo NFC-Karte, Name als Beispiel",
    },
    href: { label: "NFC-Karte anfragen", to: "kontakt", query: { anliegen: "opso" } },
    ground: "char",
  },
  {
    t: "product",
    id: "kutasia",
    label: "In Entwicklung",
    h: "Kutasia",
    name: "Kutasia",
    p: "Ein gemeinsamer Posteingang für Kundenanfragen aus Chat und E-Mail, mit KI-Antwortvorschlägen, die Ihr Team prüft und freigibt. Kutasia ist in Entwicklung und noch nicht erhältlich.",
    chip: { kind: "plan", text: "in Entwicklung" },
    status: "",
    points: [],
    compact: true,
    ground: "slate",
  },
  {
    t: "why",
    id: "warum",
    label: "Warum",
    h: "Warum eigene Software?",
    lede: "Wir entwickeln und betreiben OpSo selbst, von der ersten Skizze bis zum Betrieb. Dieselbe Arbeitsweise bringen wir in die KI-Beratung für Unternehmen.",
    cards: [
      {
        tone: "ink",
        etikett: "Schulungen",
        h: "KI-Schulungen für Ihr Team",
        chip: { kind: "live", text: OFFERS.de.kompetenz.chip },
        link: { label: "Alle Schulungen und Preise", to: "schulungen" },
      },
      {
        tone: "slate",
        etikett: "Beratung",
        h: "Der KI-Check",
        chip: { kind: "live", text: CHECK.de.chip },
        credit: CHECK.de.credit,
        link: { label: "Zum KI-Check", to: "check" },
      },
    ],
    footnote: SITE_STR.de.priceNote,
    ground: "bench",
    mat: "linear-gradient(0deg,#000 0%,transparent 80%)",
  },
];

const de: PageDef = {
  key: "produkte",
  meta: {
    title: "Produkte: OpSo, OpSo NFC-Karte und Kutasia",
    description:
      "OpSo, die digitale Visitenkarte von OpSolid, ist kostenlos für iPhone und Android. NFC-Karte in Vorbereitung, Kutasia in Entwicklung, noch nicht erhältlich.",
  },
  crumbs: [],
  crumb: "Produkte",
  hero: {
    eyebrow: "Eigene Produkte",
    h1: ["Was wir selbst ", "bauen", " und betreiben"],
    lede: "Drei eigene Produkte und ihr Stand: OpSo ist live, die OpSo NFC-Karte in Vorbereitung, Kutasia in Entwicklung und noch nicht erhältlich.",
    tone: "ink",
    picture: heroPic(
      "Vier OpSo NFC-Karten in mattem Schwarz: zwei mit dem OpSolid-Zeichen in Kupfer, zwei mit QR-Code und Beispielnamen",
      "Render · OpSo NFC-Karten, Namen als Beispiel",
    ),
    index: [
      { k: "Digitale Visitenkarte", name: "OpSo", chip: { kind: "live", text: "live · kostenlos" }, to: { label: "OpSo", to: "produkte", hash: "opso" } },
      {
        k: "Visitenkarte zum Antippen",
        name: "OpSo NFC-Karte",
        chip: { kind: "plan", text: "in Vorbereitung" },
        to: { label: "OpSo NFC-Karte", to: "produkte", hash: "nfc-karte" },
      },
      {
        k: "Posteingang mit KI-Antwortvorschlägen",
        name: "Kutasia",
        chip: { kind: "plan", text: "noch nicht erhältlich" },
        to: { label: "Kutasia", to: "produkte", hash: "kutasia" },
      },
    ],
  },
  blocks: deBlocks,
  schema: { software: OPSO_SOFTWARE.de },
};

/* ---------------------------------------------------------------- en */

const enBlocks: Block[] = [
  {
    t: "app",
    id: "opso",
    label: "OpSo",
    etikett: "Available",
    h: "OpSo",
    chip: { kind: "live", text: "live" },
    lede: "The digital business card with a contact list and follow-up: share a card by QR code, NFC or link, note where you met, and follow up in time.",
    free: "Free for iPhone and Android",
    stores: [
      { link: { label: "Download on the App Store", href: APP_STORE }, shown: STORE_SHOWN.apple },
      { link: { label: "Get it on Google Play", href: PLAY }, shown: STORE_SHOWN.play },
    ],
    note: "Recipients need no app. Free today, no ads.",
    more: { label: "Availability and all features", to: "opso" },
    phones: phones(
      "en",
      [
        "OpSo app: share screen with a QR code and the tabs Tap and NFC card (demo data)",
        "OpSo app: contacts list with lead status and notes (demo data)",
        "OpSo app: card editor with templates, colours and fonts (demo data)",
      ],
      ["Share by QR code, tap or NFC", "Contacts with lead status", "Card editor with live preview"],
    ),
    phonesEtikett: "App screens · unedited, demo data",
    ground: "sheet",
  },
  {
    t: "product",
    id: "nfc-karte",
    label: "Part of OpSo",
    h: "OpSo NFC card",
    name: "OpSo NFC card",
    p: "The business card you tap, linked to your OpSo card.",
    chip: { kind: "plan", text: "in preparation" },
    status: "Cannot be ordered yet.",
    points: [],
    media: {
      kind: "image",
      img: nfcImg("Two OpSo NFC cards in matte black: one with a copper mark and a copper line, one with a QR code and the sample name Maya Collins"),
      caption: "Render · OpSo NFC card, sample name",
    },
    href: { label: "Ask about the NFC card", to: "kontakt", query: { anliegen: "opso" } },
    ground: "char",
  },
  {
    t: "product",
    id: "kutasia",
    label: "In development",
    h: "Kutasia",
    name: "Kutasia",
    p: "A shared inbox for customer enquiries from chat and email, with AI reply suggestions that your team reviews and approves. Kutasia is in development and not yet available.",
    chip: { kind: "plan", text: "in development" },
    status: "",
    points: [],
    compact: true,
    ground: "slate",
  },
  {
    t: "why",
    id: "warum",
    label: "Why",
    h: "Why our own software?",
    lede: "We develop and run OpSo ourselves, from the first sketch to operation. We bring the same way of working to our AI consulting for companies.",
    cards: [
      {
        tone: "ink",
        etikett: "Training",
        h: "AI training for your team",
        chip: { kind: "live", text: OFFERS.en.kompetenz.chip },
        link: { label: "All training and prices", to: "schulungen" },
      },
      {
        tone: "slate",
        etikett: "Consulting",
        h: "The AI check",
        chip: { kind: "live", text: CHECK.en.chip },
        credit: CHECK.en.credit,
        link: { label: "Go to the AI check", to: "check" },
      },
    ],
    footnote: SITE_STR.en.priceNote,
    ground: "bench",
    mat: "linear-gradient(0deg,#000 0%,transparent 80%)",
  },
];

const en: PageDef = {
  key: "produkte",
  meta: {
    title: "Products: OpSo, OpSo NFC card and Kutasia",
    description:
      "OpSo, the digital business card from OpSolid, is free for iPhone and Android. The NFC card is in preparation; Kutasia is in development, not yet available.",
  },
  crumbs: [],
  crumb: "Products",
  hero: {
    eyebrow: "Our own products",
    h1: ["What we ", "build", " and run ourselves"],
    lede: "Three products of our own and where they stand: OpSo is live, the OpSo NFC card is in preparation, Kutasia is in development and not yet available.",
    tone: "ink",
    picture: heroPic(
      "Four OpSo NFC cards in matte black: two with the OpSolid mark in copper, two with a QR code and sample names",
      "Render · OpSo NFC cards, sample names",
    ),
    index: [
      { k: "Digital business card", name: "OpSo", chip: { kind: "live", text: "live · free" }, to: { label: "OpSo", to: "produkte", hash: "opso" } },
      {
        k: "The business card you tap",
        name: "OpSo NFC card",
        chip: { kind: "plan", text: "in preparation" },
        to: { label: "OpSo NFC card", to: "produkte", hash: "nfc-karte" },
      },
      {
        k: "Inbox with AI reply suggestions",
        name: "Kutasia",
        chip: { kind: "plan", text: "not yet available" },
        to: { label: "Kutasia", to: "produkte", hash: "kutasia" },
      },
    ],
  },
  blocks: enBlocks,
  schema: { software: OPSO_SOFTWARE.en },
};

/* ---------------------------------------------------------------- tr */

const trBlocks: Block[] = [
  {
    t: "app",
    id: "opso",
    label: "OpSo",
    etikett: "Kullanılabilir",
    h: "OpSo",
    chip: { kind: "live", text: "yayında" },
    lede: "Kişi listesi ve takip özelliği olan dijital kartvizit: kartı karekod, NFC ya da bağlantıyla paylaşın, nerede tanıştığınızı not edin ve zamanında takip edin.",
    free: "iPhone ve Android için ücretsiz",
    stores: [
      { link: { label: "App Store’dan indirin", href: APP_STORE }, shown: STORE_SHOWN.apple },
      { link: { label: "Google Play’den indirin", href: PLAY }, shown: STORE_SHOWN.play },
    ],
    note: "Karşı tarafın uygulaması gerekmez. Bugün ücretsiz, reklamsız.",
    more: { label: "Durum ve tüm özellikler", to: "opso" },
    phones: phones(
      "tr",
      [
        "OpSo uygulaması: karekod ile Dokun ve NFC kart sekmelerini gösteren paylaşma ekranı (demo veri)",
        "OpSo uygulaması: durum etiketleri ve notlarla kişi listesi (demo veri)",
        "OpSo uygulaması: şablon, renk ve yazı tipleriyle kart editörü (demo veri)",
      ],
      ["Karekod, dokunma ya da NFC ile paylaşma", "Durum etiketli kişiler", "Canlı önizlemeli kart editörü"],
    ),
    phonesEtikett: "Uygulama ekranları · düzenlenmemiş, demo veri",
    ground: "sheet",
  },
  {
    t: "product",
    id: "nfc-karte",
    label: "OpSo’nun parçası",
    h: "OpSo NFC kartı",
    name: "OpSo NFC kartı",
    p: "Dokunarak paylaşılan kartvizit, OpSo kartınıza bağlı.",
    chip: { kind: "plan", text: "hazırlanıyor" },
    status: "Henüz sipariş verilemiyor.",
    points: [],
    media: {
      kind: "image",
      img: nfcImg("Mat siyah iki OpSo NFC kartı: birinde bakır işaret ve bakır çizgi, diğerinde karekod ve örnek isim Maya Collins"),
      caption: "Render · OpSo NFC kartı, isim örnek",
    },
    href: { label: "NFC kart hakkında bilgi alın", to: "kontakt", query: { anliegen: "opso" } },
    ground: "char",
  },
  {
    t: "product",
    id: "kutasia",
    label: "Geliştiriliyor",
    h: "Kutasia",
    name: "Kutasia",
    p: "Sohbet ve e-postadan gelen müşteri taleplerini tek bir ortak gelen kutusunda toplar; YZ yanıt önerilerini ekibiniz kontrol eder ve onaylar. Kutasia geliştirme aşamasındadır ve henüz satışta değildir.",
    chip: { kind: "plan", text: "geliştiriliyor" },
    status: "",
    points: [],
    compact: true,
    ground: "slate",
  },
  {
    t: "why",
    id: "warum",
    label: "Neden",
    h: "Neden kendi yazılımımız?",
    lede: "OpSo’yu ilk taslaktan işletmeye kadar kendimiz geliştirir ve işletiriz. Aynı çalışma biçimini şirketlere yönelik yapay zeka danışmanlığımıza da taşırız.",
    cards: [
      {
        tone: "ink",
        etikett: "Eğitimler",
        h: "Ekibiniz için YZ eğitimleri",
        chip: { kind: "live", text: OFFERS.tr.kompetenz.chip },
        link: { label: "Tüm eğitimler ve fiyatlar", to: "schulungen" },
      },
      {
        tone: "slate",
        etikett: "Danışmanlık",
        h: "YZ Kontrolü",
        chip: { kind: "live", text: CHECK.tr.chip },
        credit: CHECK.tr.credit,
        link: { label: "YZ Kontrolüne git", to: "check" },
      },
    ],
    footnote: SITE_STR.tr.priceNote,
    ground: "bench",
    mat: "linear-gradient(0deg,#000 0%,transparent 80%)",
  },
];

const tr: PageDef = {
  key: "produkte",
  meta: {
    title: "Ürünler: OpSo, OpSo NFC kartı ve Kutasia",
    description:
      "OpSo, OpSolid'in dijital kartvizitidir; iPhone ve Android için ücretsiz. NFC kartı hazırlanıyor, Kutasia geliştiriliyor ve henüz satışta değil.",
  },
  crumbs: [],
  crumb: "Ürünler",
  hero: {
    eyebrow: "Kendi ürünlerimiz",
    h1: ["Kendimiz ", "geliştirip", " işlettiklerimiz"],
    lede: "Kendi üç ürünümüz ve durumları: OpSo yayında, OpSo NFC kartı hazırlanıyor, Kutasia geliştiriliyor ve henüz satışta değil.",
    tone: "ink",
    picture: heroPic(
      "Mat siyah dört OpSo NFC kartı: ikisinde bakır renkli OpSolid işareti, ikisinde karekod ve örnek isimler",
      "Render · OpSo NFC kartları, isimler örnek",
    ),
    index: [
      { k: "Dijital kartvizit", name: "OpSo", chip: { kind: "live", text: "yayında · ücretsiz" }, to: { label: "OpSo", to: "produkte", hash: "opso" } },
      {
        k: "Dokunarak paylaşılan kartvizit",
        name: "OpSo NFC kartı",
        chip: { kind: "plan", text: "hazırlanıyor" },
        to: { label: "OpSo NFC kartı", to: "produkte", hash: "nfc-karte" },
      },
      {
        k: "YZ yanıt önerili gelen kutusu",
        name: "Kutasia",
        chip: { kind: "plan", text: "henüz satışta değil" },
        to: { label: "Kutasia", to: "produkte", hash: "kutasia" },
      },
    ],
  },
  blocks: trBlocks,
  /* The OpSo page speaks in its owner-approved "sen" voice; this page uses the company "siz" voice, so the TR
     description is written neutrally here instead of reusing the OpSo text. */
  schema: {
    software: {
      ...OPSO_SOFTWARE.tr,
      description:
        "Kişi listesi ve takip özelliği olan dijital kartvizit. Kart karekod, NFC ya da bağlantıyla paylaşılır; alıcının uygulama yüklemesi gerekmez. iPhone uygulaması App Store’da, Android uygulaması Google Play’de.",
    },
  },
};

export const page: PageSet = { de, en, tr };
