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
type OpsoContent = {
  meta: { title: string; description: string };
  status: string;
  title: string;
  intro: string;
  explore: string;
  availabilityLink: string;
  navLabel: string;
  nav: [string, string, string, string];
  illustration: { caption: string; alt: string };
  overview: { title: string; intro: string; items: [SectionItem, SectionItem, SectionItem] };
  families: OpsoShowcaseContent & { title: string; intro: string };
  sharing: SectionItem;
  plans: { title: string; intro: string; free: string; soon: string; unit: string; included: string; coming: string; note: string };
  availability: SectionItem & { contact: string };
  faq: { title: string; items: [SectionItem, SectionItem, SectionItem, SectionItem] };
};

const en: OpsoContent = {
  meta: { title: "OpSo | Digital business cards with your own style", description: "Explore four professional OpSo example cards with portraits and distinct styles, from light and minimal to bold and colourful. Check features and app availability." },
  status: "In testing · Launch in preparation",
  title: "Your work, in your own style",
  intro: "Give people more than a name and a number. Bring your portrait, expertise, services and contact details together in a digital card that feels like you.",
  explore: "Explore the examples",
  availabilityLink: "App availability",
  navLabel: "On this page",
  nav: ["What it does", "Example cards", "Plans", "Availability"],
  illustration: { caption: "Example profiles with AI-generated portraits", alt: "OpSo example card" },
  overview: {
    title: "From a first hello to a fuller picture",
    intro: "A portrait, a clear introduction and useful details help someone understand what you do and how to reach you.",
    items: [
      { title: "More of what makes you, you", text: "Start with your portrait and introduction. Add services, selected work and the contact options that fit your business. Choose what visitors see." },
      { title: "Room for more than a card", text: "Website layouts with a top menu and up to six addressable pages are being prepared for release. Give services, selected work and contact information their own space." },
      { title: "Preview, save, then publish", text: "Review changes in mobile and desktop preview. Save your draft, then publish when it is ready. Later edits stay in your draft until you publish again." },
    ],
  },
  families: {
    title: "Different people, different first impressions",
    intro: "Architecture, consulting, brand design and digital products. Explore four complete examples, each with its own colour, character and content.",
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
  sharing: { title: "Scan, tap or open the link", text: "A published OpSo card or website opens in the recipient’s browser, with no OpSo app required. Share its link, show its QR code or use a compatible NFC tag that points to the same address. NFC requires a compatible phone and tag." },
  plans: { title: "Start with one, plan for more", intro: "The launch offer includes one free card or website in one account. Larger account plans are in development.", free: "Free", soon: "Coming soon", unit: "cards / websites per account", included: "1 card or website included", coming: "In development", note: "OpSo currently has no active checkout or charges. Pro and Studio cannot be purchased yet; their prices and launch dates are not announced." },
  availability: { title: "The app is still in testing", text: "OpSo is in quality assurance before public launch. It is not yet published on Google Play. A verified public Android download link is not available yet; it will appear here when ready.", contact: "Ask us about OpSo" },
  faq: { title: "Before you get started", items: [
    { title: "Is this a link page or a website?", text: "OpSo combines compact digital business cards with website layouts. The website features in testing include a top menu and addressable subpages, with up to six pages in total." },
    { title: "Does the recipient need an app?", text: "No. The published card or website opens in a browser. QR codes and compatible NFC tags point to its public link." },
    { title: "Can I connect my own domain now?", text: "Not yet. Domain setup is being prepared. Connecting and publishing on your own domain is not currently available." },
    { title: "What do Free, Pro and Studio include?", text: "Free includes one card or website. Pro is planned for up to 10 and Studio for up to 50 in one account. Pro and Studio are still in development, with checkout disabled." },
  ] },
};

const de: OpsoContent = {
  meta: { title: "OpSo | Digitale Visitenkarten mit eigenem Stil", description: "Vier professionelle OpSo-Beispielkarten mit Porträts und unterschiedlichen Stilen: hell, zurückhaltend oder farbenfroh. Funktionen und App-Verfügbarkeit im Überblick." },
  status: "In der Testphase · Veröffentlichung in Vorbereitung",
  title: "Ihre Arbeit, in Ihrem eigenen Stil",
  intro: "Zeigen Sie mehr als einen Namen und eine Nummer. Verbinden Sie Porträt, Expertise, Leistungen und Kontaktdaten in einer digitalen Visitenkarte, die zu Ihnen passt.",
  explore: "Beispiele entdecken",
  availabilityLink: "Verfügbarkeit der App",
  navLabel: "Auf dieser Seite",
  nav: ["Funktionen", "Beispielkarten", "Pläne", "Verfügbarkeit"],
  illustration: { caption: "Beispielprofile mit KI-generierten Porträts", alt: "OpSo-Beispielkarte" },
  overview: {
    title: "Vom ersten Kontakt zum vollständigen Bild",
    intro: "Ein Porträt, eine klare Vorstellung und die passenden Informationen zeigen, was Sie tun und wie man Sie erreicht.",
    items: [
      { title: "Mehr von dem, was Sie ausmacht", text: "Beginnen Sie mit Porträt und Vorstellung. Ergänzen Sie Leistungen, ausgewählte Arbeiten und passende Kontaktwege. Sie entscheiden, was Besucher sehen." },
      { title: "Mehr Raum als eine Visitenkarte", text: "Website-Layouts mit einem oberen Menü und bis zu sechs direkt aufrufbaren Seiten werden für den Start vorbereitet. Für Leistungen, ausgewählte Arbeiten und Kontaktdaten." },
      { title: "Prüfen, speichern, veröffentlichen", text: "Sehen Sie Änderungen in der Mobil- und Desktop-Vorschau an. Speichern Sie Ihren Entwurf und veröffentlichen Sie ihn, sobald er fertig ist. Spätere Änderungen bleiben bis zur erneuten Veröffentlichung im Entwurf." },
    ],
  },
  families: {
    title: "Verschiedene Menschen, verschiedene erste Eindrücke",
    intro: "Architektur, Beratung, Markengestaltung und digitale Produkte. Entdecken Sie vier ausgearbeitete Beispiele mit eigener Farbwelt, Persönlichkeit und passenden Inhalten.",
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
  sharing: { title: "Scannen, antippen oder den Link öffnen", text: "Eine veröffentlichte OpSo-Karte oder Website öffnet sich im Browser des Empfängers, ohne OpSo-App. Teilen Sie den Link, zeigen Sie den QR-Code oder nutzen Sie einen kompatiblen NFC-Tag mit derselben Adresse. NFC setzt ein kompatibles Smartphone und einen passenden Tag voraus." },
  plans: { title: "Mit einem Auftritt starten und mehr einplanen", intro: "Zum Start ist eine Karte oder Website in einem Konto kostenlos enthalten. Größere Kontopläne sind in Entwicklung.", free: "Kostenlos", soon: "Demnächst", unit: "Karten / Websites pro Konto", included: "1 Karte oder Website enthalten", coming: "In Entwicklung", note: "OpSo hat derzeit keinen aktiven Checkout und erhebt keine Gebühren. Pro und Studio sind noch nicht buchbar; Preise und Starttermine stehen noch nicht fest." },
  availability: { title: "Die App ist noch in der Testphase", text: "OpSo durchläuft die Qualitätssicherung vor dem öffentlichen Start. Die App ist noch nicht bei Google Play veröffentlicht. Ein geprüfter öffentlicher Android-Download steht noch nicht bereit und wird hier ergänzt, sobald er verfügbar ist.", contact: "OpSo anfragen" },
  faq: { title: "Vor dem Start", items: [
    { title: "Ist das eine Linkseite oder eine Website?", text: "OpSo verbindet kompakte digitale Visitenkarten mit Website-Layouts. Die Website-Funktionen in der Testphase umfassen ein oberes Menü und direkt aufrufbare Unterseiten, insgesamt bis zu sechs Seiten." },
    { title: "Braucht der Empfänger eine App?", text: "Nein. Die veröffentlichte Karte oder Website öffnet sich im Browser. QR-Codes und kompatible NFC-Tags führen zu ihrem öffentlichen Link." },
    { title: "Kann ich bereits eine eigene Domain verbinden?", text: "Noch nicht. Die Domain-Einrichtung wird vorbereitet. Das Verbinden und Veröffentlichen unter einer eigenen Domain ist derzeit nicht verfügbar." },
    { title: "Was enthalten Free, Pro und Studio?", text: "Free enthält eine Karte oder Website. Für Pro sind bis zu 10 und für Studio bis zu 50 in einem Konto vorgesehen. Pro und Studio sind noch in Entwicklung, der Checkout ist deaktiviert." },
  ] },
};

const tr: OpsoContent = {
  meta: { title: "OpSo | Kendi tarzınızı yansıtan dijital kartvizitler", description: "Fotoğraflı dört profesyonel OpSo örnek kartını keşfedin: açık, sade veya renkli tasarımlar. Özellikleri ve uygulamanın yayın durumunu inceleyin." },
  status: "Test aşamasında · Yayına hazırlanıyor",
  title: "İşiniz, kendi tarzınızla",
  intro: "Bir isim ve numaradan fazlasını paylaşın. Fotoğrafınızı, uzmanlığınızı, hizmetlerinizi ve iletişim bilgilerinizi sizi yansıtan bir dijital kartvizitte birleştirin.",
  explore: "Örnekleri keşfedin",
  availabilityLink: "Uygulamanın durumu",
  navLabel: "Bu sayfada",
  nav: ["Özellikler", "Örnek kartlar", "Planlar", "Uygulama durumu"],
  illustration: { caption: "Yapay zekâ ile üretilmiş portrelerle örnek profiller", alt: "OpSo örnek kartı" },
  overview: {
    title: "İlk merhabadan daha kapsamlı bir tanıtıma",
    intro: "Bir fotoğraf, net bir tanıtım ve faydalı bilgiler; ne yaptığınızı ve size nasıl ulaşılacağını anlatır.",
    items: [
      { title: "Sizi anlatan daha fazla ayrıntı", text: "Fotoğrafınız ve tanıtımınızla başlayın. Hizmetlerinizi, seçili çalışmalarınızı ve işinize uygun iletişim yollarını ekleyin. Ziyaretçilerin neler göreceğine siz karar verin." },
      { title: "Kartvizitin ötesinde bir alan", text: "Üst menüsü ve kendi adresinden açılan en fazla altı sayfası olan site düzenleri yayına hazırlanıyor. Hizmetlerinize, seçili çalışmalarınıza ve iletişim bilgilerinize yer açın." },
      { title: "İnceleyin, kaydedin, yayımlayın", text: "Değişiklikleri mobil ve masaüstü önizlemede inceleyin. Taslağınızı kaydedin, hazır olduğunda yayımlayın. Sonraki değişiklikler yeniden yayımlayana kadar taslakta kalır." },
    ],
  },
  families: {
    title: "Farklı insanlar, farklı ilk izlenimler",
    intro: "Mimarlık, danışmanlık, marka tasarımı ve dijital ürünler. Kendine özgü rengi, karakteri ve içeriği olan dört kapsamlı örneği inceleyin.",
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
  sharing: { title: "Okutun, dokundurun veya bağlantıyı açın", text: "Yayımlanmış OpSo kartı veya sitesi, alıcının tarayıcısında açılır; OpSo uygulaması gerekmez. Bağlantıyı paylaşın, karekodu gösterin veya aynı adrese yönlenen uyumlu bir NFC etiketi kullanın. NFC için uyumlu telefon ve etiket gerekir." },
  plans: { title: "Bir tane ile başlayın, devamını planlayın", intro: "Başlangıçta tek hesapta bir kart veya web sitesi ücretsizdir. Daha fazla kart ve site için hesap planları geliştiriliyor.", free: "Ücretsiz", soon: "Yakında", unit: "hesap başına kart / web sitesi", included: "1 kart veya web sitesi dahil", coming: "Geliştirme aşamasında", note: "OpSo’da şu anda aktif ödeme adımı veya ücretlendirme yoktur. Pro ve Studio henüz satın alınamaz; fiyatları ve çıkış tarihleri açıklanmadı." },
  availability: { title: "Uygulama hâlâ test aşamasında", text: "OpSo genel kullanıma açılmadan önce kalite kontrolünden geçiyor. Henüz Google Play’de yayımlanmadı. Doğrulanmış, herkese açık bir Android indirme bağlantısı şu anda hazır değil; hazır olduğunda burada paylaşılacak.", contact: "OpSo hakkında bize ulaşın" },
  faq: { title: "Başlamadan önce", items: [
    { title: "Bu bir bağlantı sayfası mı, web sitesi mi?", text: "OpSo sade dijital kartvizitleri site düzenleriyle birleştirir. Test aşamasındaki site özellikleri, üst menü ve kendi adresinden açılabilen toplam en fazla altı sayfa içerir." },
    { title: "Alıcının uygulama yüklemesi gerekiyor mu?", text: "Hayır. Yayımlanmış kart veya site tarayıcıda açılır. Karekodlar ve uyumlu NFC etiketleri aynı herkese açık bağlantıya yönlenir." },
    { title: "Kendi alan adımı şimdi bağlayabilir miyim?", text: "Henüz değil. Alan adı kurulumu hazırlanıyor. Kendi alan adınızı bağlama ve bu adreste yayımlama şu anda kullanıma açık değildir." },
    { title: "Free, Pro ve Studio neleri içeriyor?", text: "Free bir kart veya web sitesi içerir. Pro için tek hesapta en fazla 10, Studio için en fazla 50 planlanıyor. Pro ve Studio geliştirme aşamasındadır, ödeme adımı kapalıdır." },
  ] },
};

// Like the existing content bundles, secondary locales fall back to English.
// They are excluded from public hreflang/sitemap until fully translated.
export function getOpsoContent(locale: Locale): OpsoContent {
  return locale === "de" ? de : locale === "tr" ? tr : en;
}
