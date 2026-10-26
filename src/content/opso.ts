import type { Locale } from "@/lib/i18n";

type SectionItem = { title: string; text: string };
type DemoProfile = SectionItem & { profession: string; style: string };
export type OpsoShowcaseContent = {
  label: string;
  caption: string;
  desktop: string;
  mobile: string;
  fullSize: string;
  openExample: string;
  imageAlt: string;
  items: [DemoProfile, DemoProfile, DemoProfile, DemoProfile];
};
/** App screens in the order of public/img/opso/<locale>/NN-*.webp (the caption is also printed in the image). */
export const OPSO_SCREENS = ["01-create", "02-share", "03-recipient", "04-fairs", "05-messages", "06-contacts", "07-editor", "08-privacy"] as const;
type OpsoContent = {
  meta: { title: string; description: string };
  status: string;
  title: string;
  intro: string;
  explore: string;
  availabilityLink: string;
  navLabel: string;
  nav: [string, string, string, string];
  heroAlt: [string, string];
  flow: { title: string; intro: string; steps: [SectionItem, SectionItem, SectionItem] };
  features: { title: string; intro: string; items: SectionItem[] };
  screens: { title: string; intro: string; label: string; note: string; alts: [string, string, string, string, string, string, string, string] };
  audience: { title: string; intro: string; items: string[]; note: string };
  families: OpsoShowcaseContent & { title: string; intro: string };
  sharing: SectionItem;
  price: { title: string; text: string; points: [string, string, string] };
  availability: { title: string; text: string; android: SectionItem; ios: SectionItem; contact: string; note: string };
  faq: { title: string; items: SectionItem[] };
};

const en: OpsoContent = {
  meta: {
    title: "OpSo | Your card, the people you meet, and the follow-up, in one free app",
    description: "OpSo is a free digital business card with contacts, follow-up reminders and a trade fair calendar. Share by QR, NFC or link; recipients need no app. Android closed beta, iPhone coming soon.",
  },
  status: "Android closed beta · iPhone coming soon",
  title: "Your card, the people you meet, and the follow-up, in one free app.",
  intro: "OpSo is for everyone who meets people face to face and wants to follow up afterwards: trade fair visitors, small exhibitors, freelancers and tradespeople. Share your card in seconds, note where you met, and never lose track of who to get back to.",
  explore: "See what it does",
  availabilityLink: "Availability",
  navLabel: "On this page",
  nav: ["How it works", "What it does", "Screens", "Availability"],
  heroAlt: ["OpSo contacts list with notes and lead status (demo data)", "OpSo share screen with QR code, tap and NFC card (demo data)"],
  flow: {
    title: "Meet. Remember. Follow up.",
    intro: "Three steps that happen at a stand, a meeting or a handshake.",
    steps: [
      { title: "Share your card", text: "Show a QR code, tap phones, use an NFC tag or send the link. Your card opens in the other person’s browser, so they need no app." },
      { title: "Save who and where", text: "Every contact keeps the place you met, notes and a lead status. Scan a paper business card and it lands in the same list." },
      { title: "Follow up in time", text: "Set a reminder and send a ready-made follow-up message, so a good conversation does not end at the stand." },
    ],
  },
  features: {
    title: "What OpSo already does today",
    intro: "Only features that exist in the app now. Nothing here is a promise for later.",
    items: [
      { title: "Web card, no app needed", text: "Your card lives at opso.cc/yourname and opens in any browser." },
      { title: "QR, NFC tag and tap", text: "Share with a QR code, a compatible NFC tag or, on Android, by tapping phones." },
      { title: "Business card scan", text: "Photograph a paper card and add the person to your contacts." },
      { title: "Contacts with “where we met”", text: "Notes, lead status (hot, warm, VIP) and the place you met, in one searchable list." },
      { title: "Follow-up reminders", text: "A reminder per contact and a ready follow-up message to adapt and send." },
      { title: "Trade fair calendar", text: "A curated list of fairs. Tap “I’m going” and new contacts are filed under the fair." },
      { title: "1:1 messages", text: "Chat with people you are connected to, with text, photos and files." },
      { title: "Save to your phone", text: "Save a contact straight into your phone’s address book, or export your contacts as CSV or vCard." },
      { title: "Your data, your call", text: "You choose what is public. Export your data or delete your account at any time." },
    ],
  },
  screens: {
    title: "The app, screen by screen",
    intro: "Real screens from the Android app. The people and companies shown are fictional demo data.",
    label: "App screens, scroll sideways",
    note: "Demo data only. Portraits are AI-generated and show no real people.",
    alts: [
      "Create your card: name, role and company, then publish",
      "Share screen with QR code and the tabs Tap and NFC card",
      "Your card in the recipient’s browser with one tap to save the contact",
      "Trade fair calendar with search and an I’m going button",
      "A chat with a connected contact, with text and an attached file",
      "Contacts list with lead status, notes and CSV or vCard export",
      "Card editor with templates, colours and fonts and a live preview",
      "Privacy settings: choose what is public, export or delete your data",
    ],
  },
  audience: {
    title: "Who OpSo is for",
    intro: "For people who rely on conversations in person and need a calm way to follow them up.",
    items: ["Trade fair visitors", "Small exhibitors", "Freelancers and consultants", "Tradespeople and local businesses", "Community and event organisers"],
    note: "If you mostly meet people online, a profile on a business network may serve you better. OpSo is built for the handshake.",
  },
  families: {
    title: "Your web card, in your own style",
    intro: "Four example cards with different looks. This is what a recipient sees in the browser.",
    label: "Choose an example profile",
    caption: "Fictional demonstration profiles with AI-generated portraits. Captured from OpSo; these are not customer endorsements.",
    desktop: "Desktop",
    mobile: "Phone",
    fullSize: "View full-size image",
    openExample: "Open the live example",
    imageAlt: "Digital business card with an AI-generated portrait and example content",
    items: [
      { title: "Clara Weber", profession: "Architect", style: "Light stone", text: "A calm, considered introduction. Light surfaces give her approach and architectural services room to breathe." },
      { title: "James Bennett", profession: "Business consultant", style: "Corporate navy", text: "A focused professional profile. Deep navy brings structure to his expertise, services and contact options." },
      { title: "Maya Collins", profession: "Brand designer", style: "Coral & violet", text: "A colourful introduction to a creative practice. An expressive palette makes room for personality and design work." },
      { title: "Felix Berger", profession: "Product designer", style: "Fresh mint", text: "A clear, approachable profile. Light mint complements an introduction to digital product design and collaboration." },
    ],
  },
  sharing: { title: "Scan, tap or open the link", text: "A published OpSo card opens in the recipient’s browser, with no OpSo app required. Share its link, show its QR code or use a compatible NFC tag that points to the same address. NFC requires a compatible phone and tag." },
  price: {
    title: "Free today, no ads",
    text: "OpSo is free to use right now. There is no checkout and nothing is charged.",
    points: ["No ads", "No payment details needed", "Export or delete your data any time"],
  },
  availability: {
    title: "Where to get OpSo",
    text: "OpSo is in testing. There is no public store listing yet, so there is no download link on this page.",
    android: { title: "Android: closed beta", text: "The app is in Google Play closed testing and open to invited testers only. Write to us and we will add you." },
    ios: { title: "iPhone: coming soon", text: "The iPhone version is being prepared and is moving towards TestFlight. No date is set yet." },
    contact: "Request beta access",
    note: "Until then you can already open any published card in a browser, for example the demo cards above.",
  },
  faq: { title: "Before you get started", items: [
    { title: "Does the other person need the app?", text: "No. Your published card opens in a browser. QR codes and compatible NFC tags point to its public link." },
    { title: "What does OpSo cost?", text: "Nothing at the moment. OpSo is free and has no ads. If that ever changes, it will be announced on this page before any charge." },
    { title: "Can I get it on my iPhone?", text: "Not yet. The iPhone version is coming soon. Until then, anyone with an iPhone can still open your card in the browser." },
    { title: "What happens to my data?", text: "You decide what is public on your card. You can export your data and delete your account in the app at any time. Details are in the privacy policy." },
    { title: "Can I use my own domain?", text: "Not yet. Cards are published at opso.cc." },
  ] },
};

const de: OpsoContent = {
  meta: {
    title: "OpSo | Karte, Kontakte und Follow-up an einem Ort",
    description: "OpSo ist eine kostenlose digitale Visitenkarte mit Kontakten, Follow-up-Erinnerungen und Messekalender. Teilen per QR, NFC oder Link; der Empfänger braucht keine App. Android Closed Beta, iPhone folgt.",
  },
  status: "Android Closed Beta · iPhone folgt",
  title: "Karte, Kontakte und Follow-up an einem Ort: Wen du triffst, vergisst du nicht mehr.",
  intro: "OpSo ist für alle, die Menschen persönlich treffen und danach nachfassen wollen: Messebesucher, kleine Aussteller, Freiberufler und Handwerker. Teile deine Karte in Sekunden, notiere, wo ihr euch getroffen habt, und behalte im Blick, bei wem du dich melden wolltest.",
  explore: "Funktionen ansehen",
  availabilityLink: "Verfügbarkeit",
  navLabel: "Auf dieser Seite",
  nav: ["Ablauf", "Funktionen", "Bildschirme", "Verfügbarkeit"],
  heroAlt: ["OpSo-Kontaktliste mit Notizen und Lead-Status (Demodaten)", "OpSo-Teilen-Bildschirm mit QR-Code, Antippen und NFC-Karte (Demodaten)"],
  flow: {
    title: "Treffen. Merken. Nachfassen.",
    intro: "Drei Schritte, die am Messestand, im Termin oder beim Händeschütteln passieren.",
    steps: [
      { title: "Karte teilen", text: "QR-Code zeigen, Handys aneinanderhalten, NFC-Tag nutzen oder den Link senden. Deine Karte öffnet sich im Browser des Gegenübers, eine App ist nicht nötig." },
      { title: "Wer und wo festhalten", text: "Jeder Kontakt behält den Ort des Treffens, Notizen und einen Lead-Status. Eine Papier-Visitenkarte scannst du ein und sie landet in derselben Liste." },
      { title: "Rechtzeitig nachfassen", text: "Setze eine Erinnerung und sende eine fertige Follow-up-Nachricht, damit ein gutes Gespräch nicht am Stand endet." },
    ],
  },
  features: {
    title: "Was OpSo heute schon kann",
    intro: "Nur Funktionen, die es in der App jetzt gibt. Nichts davon ist ein Versprechen für später.",
    items: [
      { title: "Webkarte ohne App", text: "Deine Karte liegt unter opso.cc/deinname und öffnet sich in jedem Browser." },
      { title: "QR, NFC-Tag und Antippen", text: "Teile per QR-Code, mit einem kompatiblen NFC-Tag oder auf Android durch Aneinanderhalten der Handys." },
      { title: "Visitenkarten-Scan", text: "Fotografiere eine Papierkarte und füge die Person deinen Kontakten hinzu." },
      { title: "Kontakte mit „Wo wir uns trafen“", text: "Notizen, Lead-Status (heiß, warm, VIP) und der Ort des Treffens in einer durchsuchbaren Liste." },
      { title: "Follow-up-Erinnerungen", text: "Eine Erinnerung pro Kontakt und eine fertige Follow-up-Nachricht zum Anpassen und Senden." },
      { title: "Messekalender", text: "Eine kuratierte Liste von Messen. Tippe auf „Ich gehe hin“, neue Kontakte werden der Messe zugeordnet." },
      { title: "1:1-Nachrichten", text: "Schreibe mit verbundenen Personen, mit Text, Fotos und Dateien." },
      { title: "Aufs Handy speichern", text: "Speichere einen Kontakt direkt im Adressbuch deines Handys oder exportiere deine Kontakte als CSV oder vCard." },
      { title: "Deine Daten, deine Entscheidung", text: "Du bestimmst, was öffentlich ist. Export und Konto löschen sind jederzeit möglich." },
    ],
  },
  screens: {
    title: "Die App, Bildschirm für Bildschirm",
    intro: "Echte Bildschirme aus der Android-App. Die gezeigten Personen und Firmen sind fiktive Demodaten.",
    label: "App-Bildschirme, seitlich scrollen",
    note: "Nur Demodaten. Die Porträts sind KI-generiert und zeigen keine realen Personen.",
    alts: [
      "Karte erstellen: Name, Rolle und Firma, dann veröffentlichen",
      "Teilen-Bildschirm mit QR-Code und den Reitern Antippen und NFC-Karte",
      "Deine Karte im Browser des Empfängers, ein Tipp speichert den Kontakt",
      "Messekalender mit Suche und der Schaltfläche Ich gehe hin",
      "Ein Chat mit einem verbundenen Kontakt, mit Text und angehängter Datei",
      "Kontaktliste mit Lead-Status, Notizen und Export als CSV oder vCard",
      "Karteneditor mit Vorlagen, Farben und Schriften und Live-Vorschau",
      "Datenschutz-Einstellungen: Öffentliches wählen, Daten exportieren oder löschen",
    ],
  },
  audience: {
    title: "Für wen OpSo gemacht ist",
    intro: "Für Menschen, die vom persönlichen Gespräch leben und es danach entspannt weiterführen wollen.",
    items: ["Messebesucher", "Kleine Aussteller", "Freiberufler und Berater", "Handwerker und lokale Betriebe", "Community- und Veranstaltungsorganisatoren"],
    note: "Wer überwiegend online Kontakte knüpft, ist mit einem Profil in einem Business-Netzwerk vielleicht besser bedient. OpSo ist für den Handschlag gebaut.",
  },
  families: {
    title: "Deine Webkarte, in deinem Stil",
    intro: "Vier Beispielkarten mit unterschiedlichem Look. So sieht sie der Empfänger im Browser.",
    label: "Beispielprofil auswählen",
    caption: "Fiktive Beispielprofile mit KI-generierten Porträts. Aufnahmen aus OpSo, keine Kundenreferenzen.",
    desktop: "Desktop",
    mobile: "Smartphone",
    fullSize: "Bild in voller Größe ansehen",
    openExample: "Beispiel live öffnen",
    imageAlt: "Digitale Visitenkarte mit KI-generiertem Porträt und Beispielinhalten",
    items: [
      { title: "Clara Weber", profession: "Architektin", style: "Helle Steintöne", text: "Ein ruhiger, durchdachter Auftritt. Helle Flächen geben ihrer Arbeitsweise und ihren Architekturleistungen Raum." },
      { title: "James Bennett", profession: "Unternehmensberater", style: "Klassisches Navy", text: "Ein professionelles Profil mit klarem Fokus. Tiefes Marineblau gliedert Expertise, Leistungen und Kontaktmöglichkeiten." },
      { title: "Maya Collins", profession: "Markendesignerin", style: "Koralle & Violett", text: "Ein farbenfroher Einblick in kreative Arbeit. Eine ausdrucksstarke Farbwelt verbindet Persönlichkeit und Gestaltung." },
      { title: "Felix Berger", profession: "Produktdesigner", style: "Frisches Mint", text: "Ein klarer, zugänglicher Auftritt. Helles Mint begleitet seine Vorstellung, digitales Produktdesign und Möglichkeiten zur Zusammenarbeit." },
    ],
  },
  sharing: { title: "Scannen, antippen oder den Link öffnen", text: "Eine veröffentlichte OpSo-Karte öffnet sich im Browser des Empfängers, ohne OpSo-App. Teile den Link, zeige den QR-Code oder nutze einen kompatiblen NFC-Tag mit derselben Adresse. NFC setzt ein kompatibles Smartphone und einen passenden Tag voraus." },
  price: {
    title: "Heute kostenlos, ohne Werbung",
    text: "OpSo ist aktuell kostenlos nutzbar. Es gibt keinen Checkout, und es wird nichts berechnet.",
    points: ["Keine Werbung", "Keine Zahlungsdaten nötig", "Export und Löschen deiner Daten jederzeit"],
  },
  availability: {
    title: "Wo es OpSo gibt",
    text: "OpSo ist in der Testphase. Es gibt noch keinen öffentlichen Store-Eintrag, deshalb steht hier kein Download-Link.",
    android: { title: "Android: Closed Beta", text: "Die App ist im geschlossenen Test bei Google Play und nur für eingeladene Tester offen. Schreib uns, wir nehmen dich auf." },
    ios: { title: "iPhone: folgt in Kürze", text: "Die iPhone-Version wird vorbereitet und läuft auf TestFlight zu. Ein Termin steht noch nicht fest." },
    contact: "Beta-Zugang anfragen",
    note: "Bis dahin kannst du jede veröffentlichte Karte schon im Browser öffnen, zum Beispiel die Demokarten oben.",
  },
  faq: { title: "Vor dem Start", items: [
    { title: "Braucht das Gegenüber die App?", text: "Nein. Deine veröffentlichte Karte öffnet sich im Browser. QR-Codes und kompatible NFC-Tags führen zu ihrem öffentlichen Link." },
    { title: "Was kostet OpSo?", text: "Aktuell nichts. OpSo ist kostenlos und ohne Werbung. Sollte sich das ändern, steht es vor jeder Berechnung auf dieser Seite." },
    { title: "Gibt es OpSo fürs iPhone?", text: "Noch nicht. Die iPhone-Version folgt in Kürze. Bis dahin kann jeder mit iPhone deine Karte trotzdem im Browser öffnen." },
    { title: "Was passiert mit meinen Daten?", text: "Du bestimmst, was auf deiner Karte öffentlich ist. Datenexport und Konto löschen sind jederzeit in der App möglich. Details stehen in der Datenschutzerklärung." },
    { title: "Kann ich eine eigene Domain nutzen?", text: "Noch nicht. Karten werden unter opso.cc veröffentlicht." },
  ] },
};

const tr: OpsoContent = {
  meta: {
    title: "OpSo | Kartın, kişilerin ve sohbetin tek ücretsiz uygulamada",
    description: "OpSo; kişi listesi, takip hatırlatıcıları ve fuar takvimi olan ücretsiz bir dijital kartvizit. QR, NFC veya bağlantıyla paylaş; karşı tarafın uygulama kurması gerekmez. Android kapalı beta, iPhone yakında.",
  },
  status: "Android kapalı beta · iPhone yakında",
  title: "Tanıştığın insanları kaydet, hatırla, takip et: kartın, kişilerin ve sohbetin tek ücretsiz uygulamada.",
  intro: "OpSo, insanlarla yüz yüze tanışıp sonrasında takip etmek isteyenler için: fuar ziyaretçileri, küçük katılımcılar, serbest çalışanlar ve esnaf. Kartını saniyeler içinde paylaş, nerede tanıştığını not et, kimi arayacağını unutma.",
  explore: "Neler yaptığını gör",
  availabilityLink: "Uygulama durumu",
  navLabel: "Bu sayfada",
  nav: ["Nasıl çalışır", "Özellikler", "Ekranlar", "Uygulama durumu"],
  heroAlt: ["OpSo kişi listesi, notlar ve durum etiketleriyle (demo veri)", "OpSo paylaşma ekranı: karekod, dokun ve NFC kart (demo veri)"],
  flow: {
    title: "Tanış. Hatırla. Takip et.",
    intro: "Fuar standında, toplantıda ya da bir el sıkışmada gerçekleşen üç adım.",
    steps: [
      { title: "Kartını paylaş", text: "Karekodu göster, telefonları dokundur, NFC etiketi kullan ya da bağlantıyı gönder. Kartın karşı tarafın tarayıcısında açılır; uygulama gerekmez." },
      { title: "Kim ve nerede, kaydet", text: "Her kişi, tanıştığınız yeri, notları ve bir durum etiketini taşır. Kâğıt kartviziti taratırsan aynı listeye eklenir." },
      { title: "Zamanında takip et", text: "Bir hatırlatıcı kur ve hazır bir takip mesajı gönder; güzel bir sohbet standda bitmesin." },
    ],
  },
  features: {
    title: "OpSo bugün neler yapıyor",
    intro: "Yalnızca uygulamada şu anda var olan özellikler. Hiçbiri sonraya verilmiş bir söz değil.",
    items: [
      { title: "Uygulamasız web kartı", text: "Kartın opso.cc/adin adresinde durur ve her tarayıcıda açılır." },
      { title: "Karekod, NFC etiketi ve dokun", text: "Karekodla, uyumlu bir NFC etiketiyle ya da Android’de telefonları dokundurarak paylaş." },
      { title: "Kartvizit tarama", text: "Kâğıt kartı fotoğrafla, kişiyi listene ekle." },
      { title: "“Nerede tanıştık” notlu kişiler", text: "Notlar, durum etiketi (sıcak, ılık, VIP) ve tanışılan yer; aranabilir tek bir listede." },
      { title: "Takip hatırlatıcıları", text: "Kişi başına bir hatırlatıcı ve uyarlayıp gönderebileceğin hazır bir takip mesajı." },
      { title: "Fuar takvimi", text: "Seçilmiş fuarların listesi. “Gidiyorum”a dokun, yeni kişiler o fuara eklenir." },
      { title: "Birebir mesajlaşma", text: "Bağlantıda olduğun kişilerle yazı, fotoğraf ve dosya ile mesajlaş." },
      { title: "Telefonuna kaydet", text: "Bir kişiyi doğrudan telefonunun rehberine kaydet ya da kişilerini CSV veya vCard olarak dışa aktar." },
      { title: "Verin, kararın", text: "Neyin herkese açık olacağını sen seçersin. Verilerini istediğin an indirebilir, hesabını silebilirsin." },
    ],
  },
  screens: {
    title: "Uygulama, ekran ekran",
    intro: "Android uygulamasından gerçek ekranlar. Görünen kişiler ve şirketler kurgusal demo verisidir.",
    label: "Uygulama ekranları, yana kaydır",
    note: "Yalnızca demo veri. Portreler yapay zekâ ile üretilmiştir, gerçek kişileri göstermez.",
    alts: [
      "Kartını oluştur: ad, unvan ve şirket, sonra yayınla",
      "Karekod ile Dokun ve NFC kart sekmelerini gösteren paylaşma ekranı",
      "Kartın alıcının tarayıcısında, tek dokunuşla kişi olarak kaydediliyor",
      "Arama ve Gidiyorum düğmesiyle fuar takvimi",
      "Bağlantıdaki bir kişiyle, yazı ve ekli dosyalı sohbet",
      "Durum etiketleri, notlar ve CSV ya da vCard dışa aktarımıyla kişi listesi",
      "Şablon, renk ve yazı tipleri ile canlı önizlemeli kart editörü",
      "Gizlilik ayarları: neyin açık olacağını seç, verini indir ya da sil",
    ],
  },
  audience: {
    title: "OpSo kimler için",
    intro: "İşini yüz yüze sohbetlerle yürüten ve sonrasını rahatça takip etmek isteyenler için.",
    items: ["Fuar ziyaretçileri", "Küçük fuar katılımcıları", "Serbest çalışanlar ve danışmanlar", "Esnaf ve yerel işletmeler", "Topluluk ve etkinlik organizatörleri"],
    note: "Bağlantılarını çoğunlukla çevrimiçi kuruyorsan, bir iş ağındaki profil sana daha uygun olabilir. OpSo el sıkışma için tasarlandı.",
  },
  families: {
    title: "Web kartın, kendi tarzında",
    intro: "Farklı görünümlü dört örnek kart. Alıcı kartı tarayıcıda böyle görür.",
    label: "Örnek profil seçin",
    caption: "Yapay zekâ ile üretilmiş portreler içeren kurgusal örnek profiller. OpSo’dan alınan görüntülerdir; müşteri referansı değildir.",
    desktop: "Masaüstü",
    mobile: "Telefon",
    fullSize: "Görseli tam boyutta aç",
    openExample: "Canlı örneği aç",
    imageAlt: "Yapay zekâ ile üretilmiş portre ve örnek içerikli dijital kartvizit",
    items: [
      { title: "Clara Weber", profession: "Mimar", style: "Açık taş tonları", text: "Sakin, özenli bir tanıtım. Açık yüzeyler, çalışma yaklaşımına ve mimarlık hizmetlerine alan açar." },
      { title: "James Bennett", profession: "İş danışmanı", style: "Kurumsal lacivert", text: "Odağı net bir profesyonel profil. Koyu lacivert; uzmanlık, hizmetler ve iletişim seçeneklerini düzenler." },
      { title: "Maya Collins", profession: "Marka tasarımcısı", style: "Mercan ve mor", text: "Yaratıcı çalışmalara renkli bir giriş. Güçlü renkler, kişiliğe ve tasarım çalışmalarına yer verir." },
      { title: "Felix Berger", profession: "Ürün tasarımcısı", style: "Ferah mint", text: "Sade, ulaşılabilir bir profil. Açık mint; tanıtımına, dijital ürün tasarımına ve iş birliği seçeneklerine eşlik eder." },
    ],
  },
  sharing: { title: "Okut, dokundur ya da bağlantıyı aç", text: "Yayımlanmış OpSo kartı, alıcının tarayıcısında açılır; OpSo uygulaması gerekmez. Bağlantıyı paylaş, karekodu göster veya aynı adrese yönlenen uyumlu bir NFC etiketi kullan. NFC için uyumlu telefon ve etiket gerekir." },
  price: {
    title: "Bugün ücretsiz, reklamsız",
    text: "OpSo şu anda ücretsiz kullanılıyor. Ödeme adımı yok, hiçbir şey ücretlendirilmiyor.",
    points: ["Reklam yok", "Ödeme bilgisi gerekmez", "Verilerini istediğin an indir ya da sil"],
  },
  availability: {
    title: "OpSo’ya nereden ulaşılır",
    text: "OpSo test aşamasında. Henüz herkese açık bir mağaza sayfası yok, bu yüzden burada indirme bağlantısı da yok.",
    android: { title: "Android: kapalı beta", text: "Uygulama Google Play’de kapalı testte ve yalnızca davet edilen testçilere açık. Bize yaz, seni ekleyelim." },
    ios: { title: "iPhone: yakında", text: "iPhone sürümü hazırlanıyor ve TestFlight’a doğru ilerliyor. Henüz bir tarih yok." },
    contact: "Beta erişimi iste",
    note: "O zamana kadar yayımlanmış her kartı tarayıcıda açabilirsin; örneğin yukarıdaki demo kartları.",
  },
  faq: { title: "Başlamadan önce", items: [
    { title: "Karşı tarafın uygulamaya ihtiyacı var mı?", text: "Hayır. Yayımlanmış kartın tarayıcıda açılır. Karekodlar ve uyumlu NFC etiketleri herkese açık bağlantıya yönlenir." },
    { title: "OpSo ne kadar?", text: "Şu anda hiçbir şey. OpSo ücretsizdir ve reklam içermez. Bu değişirse, herhangi bir ücret alınmadan önce bu sayfada duyurulur." },
    { title: "iPhone için var mı?", text: "Henüz yok. iPhone sürümü yakında. O zamana kadar iPhone kullanan herkes kartını yine de tarayıcıda açabilir." },
    { title: "Verilerime ne oluyor?", text: "Kartında neyin herkese açık olacağına sen karar verirsin. Verilerini dışa aktarmak ve hesabını silmek uygulamada her zaman mümkündür. Ayrıntılar gizlilik politikasında." },
    { title: "Kendi alan adımı kullanabilir miyim?", text: "Henüz değil. Kartlar opso.cc adresinde yayımlanır." },
  ] },
};

export function getOpsoContent(locale: Locale): OpsoContent {
  return locale === "de" ? de : locale === "tr" ? tr : en;
}
