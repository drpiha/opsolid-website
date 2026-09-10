import type { Locale } from "@/lib/i18n";

type SectionItem = { title: string; text: string };
type OpsoContent = {
  meta: { title: string; description: string };
  status: string;
  title: string;
  intro: string;
  explore: string;
  availabilityLink: string;
  navLabel: string;
  nav: [string, string, string, string];
  illustration: { caption: string; name: string; role: string; pages: [string, string, string]; contact: string };
  overview: { title: string; intro: string; items: [SectionItem, SectionItem, SectionItem] };
  families: { title: string; intro: string; items: [SectionItem, SectionItem, SectionItem] };
  sharing: SectionItem;
  plans: { title: string; intro: string; free: string; soon: string; unit: string; included: string; coming: string; note: string };
  availability: SectionItem & { contact: string };
  faq: { title: string; items: [SectionItem, SectionItem, SectionItem, SectionItem] };
};

const en: OpsoContent = {
  meta: { title: "OpSo — Digital business card & small website", description: "Meet OpSo: a professional digital business card and a small website with real subpages. Explore the app, website layouts and free launch plan." },
  status: "In testing · Launch in preparation",
  title: "Your introduction. Your own small website.",
  intro: "OpSo brings your contact details, work and services together. Build a professional digital business card or a small website, then share one link.",
  explore: "Explore OpSo",
  availabilityLink: "App availability",
  navLabel: "On this page",
  nav: ["What it does", "Website layouts", "Plans", "Availability"],
  illustration: { caption: "Structure illustration · not a live customer website", name: "Your name", role: "Your work, in your own words", pages: ["Home", "Services", "Contact"], contact: "Your contact details" },
  overview: {
    title: "From a first hello to a fuller picture",
    intro: "Use a compact card for a quick introduction. Give your work more room with a website that visitors can browse page by page.",
    items: [
      { title: "A professional digital card", text: "Bring your profile, contact details and chosen links into one clear place. Decide what people see when you share." },
      { title: "A website with real pages", text: "Add a top menu and up to six pages with their own addresses. Make room for services, selected work, an introduction and contact information." },
      { title: "Preview before saving", text: "Check your unsaved changes in mobile and desktop preview. Review layout and navigation before saving the version you want to share." },
    ],
  },
  families: {
    title: "Three ways to give your work a home",
    intro: "Choose a website family that fits what you want to present, then shape its pages around your own content.",
    items: [
      { title: "Consultant", text: "Introduce your expertise and give visitors a clear route to your services and contact page." },
      { title: "Portfolio", text: "Put selected work at the centre, with dedicated pages for projects and your introduction." },
      { title: "Service business", text: "Explain your offer, answer practical questions and help visitors find the right way to contact you." },
    ],
  },
  sharing: { title: "Scan, tap or open the link", text: "A published OpSo card or website opens in the recipient’s browser, with no OpSo app required. Share its link, show its QR code or use a compatible NFC tag that points to the same address. NFC requires a compatible phone and tag." },
  plans: { title: "Start with one. Plan for more.", intro: "The launch offer includes one free card or website in one account. Larger account plans are in development.", free: "Free", soon: "Coming soon", unit: "cards / websites per account", included: "1 card or website included", coming: "In development", note: "OpSo currently has no active checkout or charges. Pro and Studio cannot be purchased yet; their prices and launch dates are not announced." },
  availability: { title: "The app is still in testing", text: "OpSo is in quality assurance before public launch. It is not yet published on Google Play. A verified public Android download link is not available yet; it will appear here when ready.", contact: "Ask us about OpSo" },
  faq: { title: "Before you get started", items: [
    { title: "Is this a link page or a website?", text: "You can use OpSo as a compact digital business card or choose a website family. Websites have a top menu and addressable subpages, with up to six pages in total." },
    { title: "Does the recipient need an app?", text: "No. The published card or website opens in a browser. QR codes and compatible NFC tags point to its public link." },
    { title: "Can I connect my own domain now?", text: "Not yet. Domain setup is being prepared. Connecting and publishing on your own domain is not currently available." },
    { title: "What do Free, Pro and Studio include?", text: "Free includes one card or website. Pro is planned for up to 10 and Studio for up to 50 in one account. Pro and Studio are still in development, with checkout disabled." },
  ] },
};

const de: OpsoContent = {
  meta: { title: "OpSo — Digitale Visitenkarte & kleine Website", description: "OpSo verbindet eine professionelle digitale Visitenkarte mit einer kleinen Website mit echten Unterseiten. Funktionen, Website-Layouts und kostenloser Start im Überblick." },
  status: "In der Testphase · Veröffentlichung in Vorbereitung",
  title: "Ihr erster Eindruck. Ihre eigene kleine Website.",
  intro: "OpSo bündelt Ihre Kontaktdaten, Arbeiten und Leistungen. Gestalten Sie eine professionelle digitale Visitenkarte oder eine kleine Website und teilen Sie einen Link.",
  explore: "OpSo entdecken",
  availabilityLink: "Verfügbarkeit der App",
  navLabel: "Auf dieser Seite",
  nav: ["Funktionen", "Website-Layouts", "Pläne", "Verfügbarkeit"],
  illustration: { caption: "Schematische Darstellung · keine echte Kundenwebsite", name: "Ihr Name", role: "Ihre Arbeit, in Ihren eigenen Worten", pages: ["Start", "Leistungen", "Kontakt"], contact: "Ihre Kontaktdaten" },
  overview: {
    title: "Vom ersten Kontakt zum vollständigen Bild",
    intro: "Eine kompakte Karte für die kurze Vorstellung. Eine Website mit mehreren Seiten, wenn Ihre Arbeit mehr Raum braucht.",
    items: [
      { title: "Eine professionelle digitale Visitenkarte", text: "Profil, Kontaktdaten und ausgewählte Links an einem übersichtlichen Ort. Sie entscheiden, was beim Teilen sichtbar ist." },
      { title: "Eine Website mit echten Unterseiten", text: "Ein Menü am oberen Rand und bis zu sechs Seiten mit eigenen Adressen. Für Leistungen, ausgewählte Arbeiten, Ihre Vorstellung und Kontaktdaten." },
      { title: "Vorschau vor dem Speichern", text: "Prüfen Sie ungespeicherte Änderungen in der Mobil- und Desktop-Vorschau. Kontrollieren Sie Layout und Navigation, bevor Sie die gewünschte Fassung speichern." },
    ],
  },
  families: {
    title: "Drei Website-Typen für Ihre Arbeit",
    intro: "Wählen Sie die passende Grundstruktur und gestalten Sie die Seiten mit Ihren eigenen Inhalten.",
    items: [
      { title: "Beratung", text: "Stellen Sie Ihre Expertise vor und führen Sie Besucher zu Ihren Leistungen und zur Kontaktseite." },
      { title: "Portfolio", text: "Geben Sie ausgewählten Arbeiten den Mittelpunkt, mit eigenen Seiten für Projekte und Ihre Vorstellung." },
      { title: "Dienstleistungen", text: "Erklären Sie Ihr Angebot, beantworten Sie praktische Fragen und zeigen Sie den passenden Kontaktweg." },
    ],
  },
  sharing: { title: "Scannen, antippen oder den Link öffnen", text: "Eine veröffentlichte OpSo-Karte oder Website öffnet sich im Browser des Empfängers, ohne OpSo-App. Teilen Sie den Link, zeigen Sie den QR-Code oder nutzen Sie einen kompatiblen NFC-Tag mit derselben Adresse. NFC setzt ein kompatibles Smartphone und einen passenden Tag voraus." },
  plans: { title: "Mit einem Auftritt starten. Mehr einplanen.", intro: "Zum Start ist eine Karte oder Website in einem Konto kostenlos enthalten. Größere Kontopläne sind in Entwicklung.", free: "Kostenlos", soon: "Demnächst", unit: "Karten / Websites pro Konto", included: "1 Karte oder Website enthalten", coming: "In Entwicklung", note: "OpSo hat derzeit keinen aktiven Checkout und erhebt keine Gebühren. Pro und Studio sind noch nicht buchbar; Preise und Starttermine stehen noch nicht fest." },
  availability: { title: "Die App ist noch in der Testphase", text: "OpSo durchläuft die Qualitätssicherung vor dem öffentlichen Start. Die App ist noch nicht bei Google Play veröffentlicht. Ein geprüfter öffentlicher Android-Download steht noch nicht bereit und wird hier ergänzt, sobald er verfügbar ist.", contact: "OpSo anfragen" },
  faq: { title: "Vor dem Start", items: [
    { title: "Ist das eine Linkseite oder eine Website?", text: "Sie können OpSo als kompakte digitale Visitenkarte nutzen oder einen Website-Typ wählen. Websites haben ein oberes Menü und direkt aufrufbare Unterseiten, insgesamt bis zu sechs Seiten." },
    { title: "Braucht der Empfänger eine App?", text: "Nein. Die veröffentlichte Karte oder Website öffnet sich im Browser. QR-Codes und kompatible NFC-Tags führen zu ihrem öffentlichen Link." },
    { title: "Kann ich bereits eine eigene Domain verbinden?", text: "Noch nicht. Die Domain-Einrichtung wird vorbereitet. Das Verbinden und Veröffentlichen unter einer eigenen Domain ist derzeit nicht verfügbar." },
    { title: "Was enthalten Free, Pro und Studio?", text: "Free enthält eine Karte oder Website. Für Pro sind bis zu 10 und für Studio bis zu 50 in einem Konto vorgesehen. Pro und Studio sind noch in Entwicklung, der Checkout ist deaktiviert." },
  ] },
};

const tr: OpsoContent = {
  meta: { title: "OpSo — Dijital kartvizit ve küçük web sitesi", description: "OpSo ile profesyonel dijital kartviziti gerçek alt sayfalı küçük bir web sitesiyle birleştirin. Uygulamayı, site düzenlerini ve ücretsiz başlangıç planını keşfedin." },
  status: "Test aşamasında · Yayına hazırlanıyor",
  title: "İlk tanışma. Size ait küçük bir web sitesi.",
  intro: "OpSo iletişim bilgilerinizi, çalışmalarınızı ve hizmetlerinizi bir araya getirir. Profesyonel bir dijital kartvizit veya küçük bir web sitesi hazırlayın, tek bağlantıyla paylaşın.",
  explore: "OpSo’yu keşfedin",
  availabilityLink: "Uygulamanın durumu",
  navLabel: "Bu sayfada",
  nav: ["Özellikler", "Site düzenleri", "Planlar", "Uygulama durumu"],
  illustration: { caption: "Şematik gösterim · gerçek müşteri sitesi değildir", name: "Adınız", role: "Kendi sözlerinizle yaptığınız iş", pages: ["Ana sayfa", "Hizmetler", "İletişim"], contact: "İletişim bilgileriniz" },
  overview: {
    title: "İlk merhabadan daha kapsamlı bir tanıtıma",
    intro: "Kısa bir tanışma için sade bir kart kullanın. İşinizi daha ayrıntılı anlatmak için ziyaretçilerin sayfa sayfa gezebildiği bir site hazırlayın.",
    items: [
      { title: "Profesyonel dijital kartvizit", text: "Profiliniz, iletişim bilgileriniz ve seçtiğiniz bağlantılar tek yerde. Paylaşırken nelerin görüneceğine siz karar verin." },
      { title: "Gerçek alt sayfalı web sitesi", text: "Üst menü ve kendine ait adresleri olan en fazla altı sayfa ekleyin. Hizmetlerinize, seçili çalışmalarınıza, tanıtımınıza ve iletişim bilgilerinize yer açın." },
      { title: "Kaydetmeden önce önizleme", text: "Kaydedilmemiş değişiklikleri mobil ve masaüstü önizlemede inceleyin. Paylaşmak istediğiniz sürümü kaydetmeden önce düzeni ve gezinmeyi kontrol edin." },
    ],
  },
  families: {
    title: "İşiniz için üç site türü",
    intro: "Anlatmak istediğiniz işe uygun bir site türü seçin ve sayfalarını kendi içeriklerinizle şekillendirin.",
    items: [
      { title: "Danışmanlık", text: "Uzmanlığınızı tanıtın; ziyaretçileri hizmetlerinize ve iletişim sayfanıza yönlendirin." },
      { title: "Portfolyo", text: "Seçili çalışmalarınızı öne çıkarın. Projelerinize ve kendinizi tanıtmaya ayrı sayfalar ayırın." },
      { title: "Hizmet işletmesi", text: "Teklifinizi anlatın, pratik soruları yanıtlayın ve ziyaretçilerin size doğru kanaldan ulaşmasını kolaylaştırın." },
    ],
  },
  sharing: { title: "Okutun, dokundurun veya bağlantıyı açın", text: "Yayımlanmış OpSo kartı veya sitesi, alıcının tarayıcısında açılır; OpSo uygulaması gerekmez. Bağlantıyı paylaşın, karekodu gösterin veya aynı adrese yönlenen uyumlu bir NFC etiketi kullanın. NFC için uyumlu telefon ve etiket gerekir." },
  plans: { title: "Bir tane ile başlayın. Devamını planlayın.", intro: "Başlangıçta tek hesapta bir kart veya web sitesi ücretsizdir. Daha fazla kart ve site için hesap planları geliştiriliyor.", free: "Ücretsiz", soon: "Yakında", unit: "hesap başına kart / web sitesi", included: "1 kart veya web sitesi dahil", coming: "Geliştirme aşamasında", note: "OpSo’da şu anda aktif ödeme adımı veya ücretlendirme yoktur. Pro ve Studio henüz satın alınamaz; fiyatları ve çıkış tarihleri açıklanmadı." },
  availability: { title: "Uygulama hâlâ test aşamasında", text: "OpSo genel kullanıma açılmadan önce kalite kontrolünden geçiyor. Henüz Google Play’de yayımlanmadı. Doğrulanmış, herkese açık bir Android indirme bağlantısı şu anda hazır değil; hazır olduğunda burada paylaşılacak.", contact: "OpSo hakkında bize ulaşın" },
  faq: { title: "Başlamadan önce", items: [
    { title: "Bu bir bağlantı sayfası mı, web sitesi mi?", text: "OpSo’yu sade bir dijital kartvizit olarak kullanabilir veya bir site türü seçebilirsiniz. Sitelerde üst menü ve kendi adresinden açılabilen alt sayfalar bulunur; toplamda en fazla altı sayfa oluşturulabilir." },
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
