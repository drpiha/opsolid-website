/**
 * OpSo NFC card studio (owner plan of 2026-11-19: `~/.claude/products/growth/opso/2026-11-18-nfc-kart-magaza/PLAN.md`).
 * A visitor types what the card should say and sees both faces at once; the card cannot be ordered yet, an e-mail
 * address can be left for one launch mail. German is the source and keeps the OpSo page's "du" voice.
 *
 * Wording rules of this page (legal check of 2026-11-19, `~/.claude/products/legal/opso-nfc-preisangabe-vor-bestellstart-2026-11-19.md`):
 * - The planned price appears once, in the studio's price block, with "Noch nicht bestellbar" beside it at the same
 *   size. It is an "Endpreis" (no VAT wording until the VAT status is settled) and never appears in the title, the
 *   meta description, a FAQ answer or structured data.
 * - No "bestellen", "vorbestellen" or "reservieren" as an action, no launch or delivery date, no scarcity, no
 *   reference or introductory price.
 * - The sample person is fictional (German and English names only); the preview carries its Etikett.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "opsoKarte",
  meta: {
    title: "OpSo NFC-Karte: Vorschau mit deinem Namen",
    description:
      "Trag Name, Position und Firma ein und sieh sofort Vorder- und Rückseite deiner OpSo NFC-Karte. Noch nicht bestellbar; du kannst dich vormerken lassen.",
  },
  crumbs: ["produkte", "opso"],
  crumb: "NFC-Karte",
  hero: {
    eyebrow: "OpSo NFC-Karte · in Vorbereitung",
    h1: ["Sieh deine NFC-Karte", "vor dem Druck", ""],
    lede: "Trag ein, was auf deiner Karte stehen soll. Die Vorschau entsteht aus derselben Zeichnung wie später die Druckdatei. Bestellbar ist die Karte noch nicht.",
    facts: [
      "Gleiche Zeichnung wie später der Druck",
      "QR-Code und Link auf der Rückseite",
      "Öffnet ohne App, per NFC oder QR-Code",
      "Noch nicht bestellbar",
    ],
    studio: {
      stage: {
        sample: "Vorschau · Beispielname",
        own: "Vorschau · deine Angaben",
        front: "Vorderseite",
        back: "Rückseite",
        sides: "Kartenseite",
        alt: "Vorschau der OpSo NFC-Karte, {side}",
        long: "85,6 mm",
        short: "54 mm",
        caption:
          "Vorschau: Material und Details können sich bis zum Bestellstart noch ändern. Der QR-Code zeigt einen Beispielcode.",
        unavailable:
          "Die Vorschau ist gerade nicht erreichbar. Deine Eingaben bleiben im Formular stehen.",
        tight: "Passt so nicht · letzter Stand",
      },
      docket: {
        title: "Auftrag · Entwurf",
        name: "Name",
        title2: "Position",
        org: "Firma",
        line1: "Kontaktzeile 1",
        line2: "Kontaktzeile 2",
        lineHint: "Zum Beispiel E-Mail-Adresse oder Telefonnummer.",
        linkNote:
          "QR-Code und Link setzen wir. Der Link bleibt gleich, auch wenn du deine digitale Karte später änderst.",
        layout: "Layout",
        layouts: {
          onyx: { name: "Onyx", note: "quer, QR-Code links" },
          linea: { name: "Linea", note: "quer, QR-Code unten rechts" },
          monolith: { name: "Monolith", note: "hochkant" },
        },
        tight:
          "So passt es in diesem Layout nicht auf die Karte. Kürze eine Zeile oder wechsle das Layout.",
        useOnyx: "Onyx nehmen, dort ist mehr Platz",
        glyphs: "Diese Zeichen kann die Kartenschrift nicht drucken:",
      },
      sample: {
        name: "Clara Weber",
        title: "Architektin",
        org: "Atelier Weber",
        line: "hello@clara-weber.example",
      },
      price: {
        label: "Geplanter Endpreis",
        value: "29 € inkl. Versand",
        status: "Noch nicht bestellbar",
        note: "Lieferung nur innerhalb Deutschlands. Du kannst dich aber unverbindlich vormerken lassen.",
      },
      interest: {
        open: "Für den Bestellstart vormerken",
        email: "E-Mail-Adresse",
        consent:
          "Mit Klick auf „Vormerken“ willigst du ein, dass OpSolid dir nach Bestätigung deiner Adresse einmalig eine E-Mail zum Bestellstart der OpSo Karte schickt; du kannst jederzeit widerrufen, mehr in der Datenschutzerklärung.",
        consentLink: "Datenschutzerklärung",
        send: "Vormerken",
        pending: "Das Vormerken ist noch nicht freigeschaltet.",
      },
    },
  },
  blocks: [
    {
      t: "steps",
      id: "ablauf",
      label: "Ablauf",
      h: "Vom Entwurf zur Karte in drei Schritten",
      lede: "Erst siehst du deine Karte, dann entscheidest du. Vor deiner Bestellung wird nichts gedruckt und nichts berechnet.",
      items: [
        {
          h: "Gestalten",
          p: "Du trägst Name, Position, Firma und bis zu zwei Kontaktzeilen ein und wählst eines von drei Layouts.",
        },
        {
          h: "Vormerken",
          p: "Du hinterlässt deine E-Mail-Adresse und bestätigst sie. Wir schreiben dir einmal, sobald die Karte bestellbar ist.",
        },
        {
          h: "Später: prüfen und bestellen",
          p: "Wenn die Bestellung öffnet, prüfst du deine Angaben noch einmal. Gedruckt wird erst nach deiner Freigabe.",
        },
      ],
    },
    {
      t: "spec",
      id: "karte",
      label: "Die Karte",
      h: "Was auf der Karte steht",
      lede: "Vorn das Zeichen, hinten deine Angaben mit QR-Code und Link. Hält jemand die Karte ans Handy, öffnet sich deine digitale OpSo Karte.",
      footnote: "Material und Druck legen wir mit dem Muster fest.",
      rows: [
        ["Vorderseite", "Das OpSolid Zeichen, sonst nichts."],
        [
          "Rückseite",
          "Name, Position und Firma, bis zu zwei Kontaktzeilen, QR-Code und der Link in Klarschrift.",
        ],
        [
          "Link",
          "Der Link auf der Karte bleibt gleich, auch wenn du deine digitale Karte änderst.",
        ],
        [
          "Antippen",
          "Ans NFC-fähige Handy halten, die Karte öffnet sich im Browser. iPhone und Android, ohne App, ohne Batterie.",
        ],
      ],
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Vor dem Vormerken",
    items: [
      {
        q: "Kann ich die Karte schon bestellen?",
        a: "Nein. Wir prüfen zuerst Muster aus dem Druck. Wenn du dich vormerken lässt, schreiben wir dir einmal, sobald die Karte bestellbar ist.",
      },
      {
        q: "Brauche ich die OpSo App?",
        a: "Für die Vorschau nicht. Die NFC-Karte öffnet später deine digitale OpSo Karte; die legst du kostenlos in der App an.",
      },
      {
        q: "Was passiert mit meinen Angaben?",
        a: "Für die Vorschau gehen deine Eingaben an unseren Server und werden dort nicht gespeichert. Erst beim Vormerken speichern wir deine E-Mail-Adresse und deinen Entwurf, bis wir dir zum Bestellstart geschrieben haben, längstens 12 Monate.",
      },
    ],
  },
  cta: {
    label: "OpSo",
    h: "Die digitale Karte gibt es schon",
    p: "OpSo ist kostenlos im App Store und bei Google Play, noch nicht in den USA und der Türkei. Die NFC-Karte öffnet später genau diese Karte.",
    primary: { label: "Zur OpSo App", to: "opso" },
  },
};

const en: PageDef = {
  key: "opsoKarte",
  meta: {
    title: "OpSo NFC card: a preview with your name",
    description:
      "Enter your name, role and company and see the front and back of your OpSo NFC card at once. Not available to order yet; you can register your interest.",
  },
  crumbs: ["produkte", "opso"],
  crumb: "NFC card",
  hero: {
    eyebrow: "OpSo NFC card · in preparation",
    h1: ["See your NFC card", "before it is printed", ""],
    lede: "Enter what your card should say. The preview comes from the same drawing as the later print file. The card is not available to order yet.",
    facts: [
      "Same drawing as the later print",
      "QR code and link on the back",
      "Opens without an app, by NFC or QR code",
      "Not available to order yet",
    ],
    studio: {
      stage: {
        sample: "Preview · sample name",
        own: "Preview · your details",
        front: "Front",
        back: "Back",
        sides: "Card side",
        alt: "Preview of the OpSo NFC card, {side}",
        long: "85.6 mm",
        short: "54 mm",
        caption:
          "Preview: material and details may still change before ordering opens. The QR code shows a sample code.",
        unavailable:
          "The preview cannot be reached right now. Your entries stay in the form.",
        tight: "Does not fit · last version",
      },
      docket: {
        title: "Card job · draft",
        name: "Name",
        title2: "Role",
        org: "Company",
        line1: "Contact line 1",
        line2: "Contact line 2",
        lineHint: "For example an e-mail address or a phone number.",
        linkNote:
          "We add the QR code and the link. The link stays the same, even if you change your digital card later.",
        layout: "Layout",
        layouts: {
          onyx: { name: "Onyx", note: "landscape, QR code on the left" },
          linea: { name: "Linea", note: "landscape, QR code bottom right" },
          monolith: { name: "Monolith", note: "portrait" },
        },
        tight:
          "This does not fit on the card in this layout. Shorten a line or switch the layout.",
        useOnyx: "Use Onyx, it has more room",
        glyphs: "The card typeface cannot print these characters:",
      },
      sample: {
        name: "Clara Weber",
        title: "Architect",
        org: "Atelier Weber",
        line: "hello@clara-weber.example",
      },
      price: {
        label: "Planned final price",
        value: "€29 incl. shipping",
        status: "Not available to order yet",
        note: "Delivery within Germany only. You can, however, register your interest without obligation.",
      },
      interest: {
        open: "Register for the order start",
        email: "E-mail address",
        consent:
          'By clicking "Register interest" you agree that, once you confirm your address, OpSolid will send you one e-mail when ordering for the OpSo card opens; you can withdraw at any time, see our privacy policy.',
        consentLink: "privacy policy",
        send: "Register interest",
        pending: "Registering interest is not switched on yet.",
      },
    },
  },
  blocks: [
    {
      t: "steps",
      id: "ablauf",
      label: "How it works",
      h: "From draft to card in three steps",
      lede: "First you see your card, then you decide. Nothing is printed and nothing is charged before you order.",
      items: [
        {
          h: "Design",
          p: "You enter your name, role, company and up to two contact lines and choose one of three layouts.",
        },
        {
          h: "Register interest",
          p: "You leave your e-mail address and confirm it. We write to you once, as soon as the card can be ordered.",
        },
        {
          h: "Later: check and order",
          p: "When ordering opens, you check your details once more. Printing only begins after your approval.",
        },
      ],
    },
    {
      t: "spec",
      id: "karte",
      label: "The card",
      h: "What is on the card",
      lede: "The mark on the front, your details with QR code and link on the back. When someone holds the card to a phone, your digital OpSo card opens.",
      footnote: "We settle material and print with the sample.",
      rows: [
        ["Front", "The OpSolid mark, nothing else."],
        [
          "Back",
          "Name, role and company, up to two contact lines, the QR code and the link in plain text.",
        ],
        [
          "Link",
          "The link on the card stays the same, even if you change your digital card.",
        ],
        [
          "Tap",
          "Hold it to an NFC phone and the card opens in the browser. iPhone and Android, no app, no battery.",
        ],
      ],
    },
  ],
  faq: {
    label: "Common questions",
    h: "Before you register interest",
    items: [
      {
        q: "Can I order the card already?",
        a: "No. We are checking print samples first. If you register your interest, we write to you once, as soon as the card can be ordered.",
      },
      {
        q: "Do I need the OpSo app?",
        a: "Not for the preview. The NFC card will open your digital OpSo card; you create that for free in the app.",
      },
      {
        q: "What happens to my details?",
        a: "For the preview your entries go to our server and are not stored there. Only when you register interest do we store your e-mail address and your draft, until we have written to you about the start of ordering, for 12 months at most.",
      },
    ],
  },
  cta: {
    label: "OpSo",
    h: "The digital card is already here",
    p: "OpSo is free in the App Store and on Google Play, not yet in the USA and Turkey. The NFC card will open exactly that card.",
    primary: { label: "To the OpSo app", to: "opso" },
  },
};

const tr: PageDef = {
  key: "opsoKarte",
  meta: {
    title: "OpSo NFC kart: adınla önizleme",
    description:
      "Adını, unvanını ve şirketini yaz, OpSo NFC kartının ön ve arka yüzünü hemen gör. Henüz sipariş verilemiyor; istersen ön kayıt yaptırabilirsin.",
  },
  crumbs: ["produkte", "opso"],
  crumb: "NFC kart",
  hero: {
    eyebrow: "OpSo NFC kart · hazırlanıyor",
    h1: ["NFC kartını", "basılmadan önce gör", ""],
    lede: "Kartında ne yazacağını gir. Önizleme, sonradan baskı dosyasına dönüşen aynı çizimden gelir. Kart henüz sipariş edilemiyor.",
    facts: [
      "Sonraki baskıyla aynı çizim",
      "Arka yüzde QR kod ve bağlantı",
      "Uygulamasız açılır, NFC ya da QR kodla",
      "Henüz sipariş verilemiyor",
    ],
    studio: {
      stage: {
        sample: "Önizleme · örnek isim",
        own: "Önizleme · senin bilgilerin",
        front: "Ön yüz",
        back: "Arka yüz",
        sides: "Kart yüzü",
        alt: "OpSo NFC kart önizlemesi, {side}",
        long: "85,6 mm",
        short: "54 mm",
        caption:
          "Önizleme: malzeme ve ayrıntılar sipariş açılana kadar değişebilir. QR kod örnek bir kod gösterir.",
        unavailable:
          "Önizlemeye şu anda ulaşılamıyor. Yazdıkların formda duruyor.",
        tight: "Sığmıyor · son hâli",
      },
      docket: {
        title: "Kart taslağı",
        name: "Ad soyad",
        title2: "Unvan",
        org: "Şirket",
        line1: "İletişim satırı 1",
        line2: "İletişim satırı 2",
        lineHint: "Örneğin e-posta adresi ya da telefon numarası.",
        linkNote:
          "QR kodu ve bağlantıyı biz ekleriz. Dijital kartını sonradan değiştirsen de bağlantı aynı kalır.",
        layout: "Düzen",
        layouts: {
          onyx: { name: "Onyx", note: "yatay, QR kod solda" },
          linea: { name: "Linea", note: "yatay, QR kod sağ altta" },
          monolith: { name: "Monolith", note: "dikey" },
        },
        tight:
          "Bu düzende karta sığmıyor. Bir satırı kısalt ya da düzeni değiştir.",
        useOnyx: "Onyx'i seç, orada daha çok yer var",
        glyphs: "Kart yazı tipi şu karakterleri basamıyor:",
      },
      sample: {
        name: "Clara Weber",
        title: "Mimar",
        org: "Atelier Weber",
        line: "hello@clara-weber.example",
      },
      price: {
        label: "Planlanan nihai fiyat",
        value: "29 €, kargo dahil",
        status: "Henüz sipariş verilemiyor",
        note: "Teslimat yalnızca Almanya içinde. Ama bağlayıcı olmadan ön kayıt yaptırabilirsin.",
      },
      interest: {
        open: "Sipariş açılışı için ön kayıt",
        email: "E-posta adresi",
        consent:
          '"Ön kayıt yaptır"a tıklayarak, adresini onayladıktan sonra OpSolid\'in OpSo kart siparişleri açıldığında sana tek bir e-posta göndermesini kabul edersin; onayını istediğin zaman geri alabilirsin, ayrıntılar gizlilik politikasında.',
        consentLink: "gizlilik politikasında",
        send: "Ön kayıt yaptır",
        pending: "Ön kayıt henüz açılmadı.",
      },
    },
  },
  blocks: [
    {
      t: "steps",
      id: "ablauf",
      label: "Nasıl işler",
      h: "Taslaktan karta üç adım",
      lede: "Önce kartını görürsün, sonra karar verirsin. Sipariş vermeden hiçbir şey basılmaz ve ücret alınmaz.",
      items: [
        {
          h: "Tasarla",
          p: "Adını, unvanını, şirketini ve en çok iki iletişim satırını yazar, üç düzenden birini seçersin.",
        },
        {
          h: "Ön kayıt yaptır",
          p: "E-posta adresini bırakır ve onaylarsın. Kart sipariş edilebilir olduğunda sana bir kez yazarız.",
        },
        {
          h: "Sonra: kontrol et ve sipariş ver",
          p: "Sipariş açıldığında bilgilerini bir kez daha kontrol edersin. Baskı ancak senin onayından sonra başlar.",
        },
      ],
    },
    {
      t: "spec",
      id: "karte",
      label: "Kart",
      h: "Kartın üzerinde ne var",
      lede: "Önde işaret, arkada bilgilerin, QR kod ve bağlantı. Biri kartı telefonuna tuttuğunda dijital OpSo kartın açılır.",
      footnote: "Malzemeyi ve baskıyı numuneyle belirliyoruz.",
      rows: [
        ["Ön yüz", "OpSolid işareti, başka bir şey yok."],
        [
          "Arka yüz",
          "Ad, unvan ve şirket, en çok iki iletişim satırı, QR kod ve açık yazıyla bağlantı.",
        ],
        [
          "Bağlantı",
          "Dijital kartını değiştirsen de karttaki bağlantı aynı kalır.",
        ],
        [
          "Dokundur",
          "NFC'li telefona tutunca kart tarayıcıda açılır. iPhone ve Android, uygulama yok, pil yok.",
        ],
      ],
    },
  ],
  faq: {
    label: "Sık sorulanlar",
    h: "Ön kayıttan önce",
    items: [
      {
        q: "Kartı şimdiden sipariş edebilir miyim?",
        a: "Hayır. Önce baskı numunelerini inceliyoruz. Ön kayıt yaptırırsan, kart sipariş edilebilir olduğunda sana bir kez yazarız.",
      },
      {
        q: "OpSo uygulamasına ihtiyacım var mı?",
        a: "Önizleme için hayır. NFC kart ileride dijital OpSo kartını açacak; onu uygulamada ücretsiz oluşturursun.",
      },
      {
        q: "Bilgilerime ne oluyor?",
        a: "Önizleme için yazdıkların sunucumuza gider ve orada saklanmaz. Yalnızca ön kayıtta e-posta adresini ve taslağını, sipariş açıldığında sana yazana kadar, en fazla 12 ay saklarız.",
      },
    ],
  },
  cta: {
    label: "OpSo",
    h: "Dijital kart zaten var",
    p: "OpSo, App Store'da ve Google Play'de ücretsiz; henüz ABD'de ve Türkiye'de yok. NFC kart ileride tam olarak bu kartı açacak.",
    primary: { label: "OpSo uygulamasına git", to: "opso" },
  },
};

export const page: PageSet = { de, en, tr };
