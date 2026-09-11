import type { Locale } from "@/lib/i18n";

type SectionItem = { title: string; text: string };
export type OpsoShowcaseContent = {
  label: string;
  caption: string;
  desktop: string;
  mobile: string;
  fullSize: string;
  imageAlt: string;
  items: [SectionItem, SectionItem, SectionItem];
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
  meta: { title: "OpSo | Digital business card & small website", description: "Meet OpSo: digital business cards and small websites with real subpages. Preview three layouts on desktop and mobile, and check the app’s launch status." },
  status: "In testing · Launch in preparation",
  title: "A clear introduction to you and your work",
  intro: "OpSo brings your contact details, work and services together. Build a professional digital business card or a small website, then share one link.",
  explore: "Explore OpSo",
  availabilityLink: "App availability",
  navLabel: "On this page",
  nav: ["What it does", "Website layouts", "Plans", "Availability"],
  illustration: { caption: "Portfolio layout from the test version · example content", alt: "OpSo portfolio website preview with navigation, an introduction and selected work" },
  overview: {
    title: "From a first hello to a fuller picture",
    intro: "Use a compact card for a quick introduction. Give your work more room with a website that visitors can browse page by page.",
    items: [
      { title: "A professional digital card", text: "Bring your profile, contact details and chosen links into one clear place. Decide what people see when you share." },
      { title: "Room for more than a card", text: "Website layouts with a top menu and up to six addressable pages are being prepared for release. Give services, selected work and contact information their own space." },
      { title: "Preview, save, then publish", text: "Review changes in mobile and desktop preview. Save your draft, then publish when it is ready. Later edits stay in your draft until you publish again." },
    ],
  },
  families: {
    title: "Three ways to give your work a home",
    intro: "Compare the same example on a large screen and a phone. Each layout gives your content a different emphasis.",
    label: "Choose a website layout",
    caption: "Screenshots from the OpSo test version with English example content. Website features are being prepared for release. These are demonstration layouts, not customer websites.",
    desktop: "Desktop",
    mobile: "Phone",
    fullSize: "View full-size image",
    imageAlt: "Example homepage",
    items: [
      { title: "Consultant", text: "Introduce your expertise and give visitors a clear route to your services and contact page." },
      { title: "Portfolio", text: "Put selected work at the centre, with dedicated pages for projects and your introduction." },
      { title: "Service business", text: "Explain your offer, answer practical questions and help visitors find the right way to contact you." },
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
  meta: { title: "OpSo | Digitale Visitenkarte & kleine Website", description: "OpSo verbindet digitale Visitenkarten mit kleinen Websites mit echten Unterseiten. Drei Layouts auf Desktop und Smartphone ansehen und den Stand der App erfahren." },
  status: "In der Testphase · Veröffentlichung in Vorbereitung",
  title: "Ein klarer erster Eindruck von Ihnen und Ihrer Arbeit",
  intro: "OpSo bündelt Ihre Kontaktdaten, Arbeiten und Leistungen. Gestalten Sie eine professionelle digitale Visitenkarte oder eine kleine Website und teilen Sie einen Link.",
  explore: "OpSo entdecken",
  availabilityLink: "Verfügbarkeit der App",
  navLabel: "Auf dieser Seite",
  nav: ["Funktionen", "Website-Layouts", "Pläne", "Verfügbarkeit"],
  illustration: { caption: "Portfolio-Layout aus der Testversion · Beispielinhalte", alt: "Vorschau einer OpSo-Portfolio-Website mit Navigation, Vorstellung und ausgewählten Arbeiten" },
  overview: {
    title: "Vom ersten Kontakt zum vollständigen Bild",
    intro: "Eine kompakte Karte für die kurze Vorstellung. Eine Website mit mehreren Seiten, wenn Ihre Arbeit mehr Raum braucht.",
    items: [
      { title: "Eine professionelle digitale Visitenkarte", text: "Profil, Kontaktdaten und ausgewählte Links an einem übersichtlichen Ort. Sie entscheiden, was beim Teilen sichtbar ist." },
      { title: "Mehr Raum als eine Visitenkarte", text: "Website-Layouts mit einem oberen Menü und bis zu sechs direkt aufrufbaren Seiten werden für den Start vorbereitet. Für Leistungen, ausgewählte Arbeiten und Kontaktdaten." },
      { title: "Prüfen, speichern, veröffentlichen", text: "Sehen Sie Änderungen in der Mobil- und Desktop-Vorschau an. Speichern Sie Ihren Entwurf und veröffentlichen Sie ihn, sobald er fertig ist. Spätere Änderungen bleiben bis zur erneuten Veröffentlichung im Entwurf." },
    ],
  },
  families: {
    title: "Drei Website-Typen für Ihre Arbeit",
    intro: "Vergleichen Sie dasselbe Beispiel auf einem großen Bildschirm und einem Smartphone. Jedes Layout setzt einen anderen Schwerpunkt.",
    label: "Website-Layout auswählen",
    caption: "Aufnahmen aus der OpSo-Testversion mit englischen Beispielinhalten. Die Website-Funktionen werden für die Veröffentlichung vorbereitet. Gezeigt werden Musterlayouts, keine Kundenwebsites.",
    desktop: "Desktop",
    mobile: "Smartphone",
    fullSize: "Bild in voller Größe ansehen",
    imageAlt: "Beispiel einer Startseite",
    items: [
      { title: "Beratung", text: "Stellen Sie Ihre Expertise vor und führen Sie Besucher zu Ihren Leistungen und zur Kontaktseite." },
      { title: "Portfolio", text: "Geben Sie ausgewählten Arbeiten den Mittelpunkt, mit eigenen Seiten für Projekte und Ihre Vorstellung." },
      { title: "Dienstleistungen", text: "Erklären Sie Ihr Angebot, beantworten Sie praktische Fragen und zeigen Sie den passenden Kontaktweg." },
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
  meta: { title: "OpSo | Dijital kartvizit ve küçük web sitesi", description: "OpSo dijital kartvizitleri gerçek alt sayfalı küçük sitelerle birleştirir. Üç düzeni masaüstü ve telefonda inceleyin, uygulamanın yayın durumunu öğrenin." },
  status: "Test aşamasında · Yayına hazırlanıyor",
  title: "Sizi ve işinizi anlatan ilk izlenim",
  intro: "OpSo iletişim bilgilerinizi, çalışmalarınızı ve hizmetlerinizi bir araya getirir. Profesyonel bir dijital kartvizit veya küçük bir web sitesi hazırlayın, tek bağlantıyla paylaşın.",
  explore: "OpSo’yu keşfedin",
  availabilityLink: "Uygulamanın durumu",
  navLabel: "Bu sayfada",
  nav: ["Özellikler", "Site düzenleri", "Planlar", "Uygulama durumu"],
  illustration: { caption: "Test sürümünden portfolyo düzeni · örnek içerik", alt: "Gezinme menüsü, tanıtım ve seçili çalışmalar içeren OpSo portfolyo sitesi önizlemesi" },
  overview: {
    title: "İlk merhabadan daha kapsamlı bir tanıtıma",
    intro: "Kısa bir tanışma için sade bir kart kullanın. İşinizi daha ayrıntılı anlatmak için ziyaretçilerin sayfa sayfa gezebildiği bir site hazırlayın.",
    items: [
      { title: "Profesyonel dijital kartvizit", text: "Profiliniz, iletişim bilgileriniz ve seçtiğiniz bağlantılar tek yerde. Paylaşırken nelerin görüneceğine siz karar verin." },
      { title: "Kartvizitin ötesinde bir alan", text: "Üst menüsü ve kendi adresinden açılan en fazla altı sayfası olan site düzenleri yayına hazırlanıyor. Hizmetlerinize, seçili çalışmalarınıza ve iletişim bilgilerinize yer açın." },
      { title: "İnceleyin, kaydedin, yayımlayın", text: "Değişiklikleri mobil ve masaüstü önizlemede inceleyin. Taslağınızı kaydedin, hazır olduğunda yayımlayın. Sonraki değişiklikler yeniden yayımlayana kadar taslakta kalır." },
    ],
  },
  families: {
    title: "İşiniz için üç site türü",
    intro: "Aynı örneği geniş ekranda ve telefonda karşılaştırın. Her düzen, içeriğinizin farklı bir yönünü öne çıkarır.",
    label: "Site düzeni seçin",
    caption: "OpSo test sürümünden, İngilizce örnek içerikli ekran görüntüleri. Site özellikleri yayına hazırlanıyor. Bunlar örnek düzenlerdir; müşteri siteleri değildir.",
    desktop: "Masaüstü",
    mobile: "Telefon",
    fullSize: "Görseli tam boyutta aç",
    imageAlt: "Örnek ana sayfa",
    items: [
      { title: "Danışmanlık", text: "Uzmanlığınızı tanıtın; ziyaretçileri hizmetlerinize ve iletişim sayfanıza yönlendirin." },
      { title: "Portfolyo", text: "Seçili çalışmalarınızı öne çıkarın. Projelerinize ve kendinizi tanıtmaya ayrı sayfalar ayırın." },
      { title: "Hizmet işletmesi", text: "Teklifinizi anlatın, pratik soruları yanıtlayın ve ziyaretçilerin size doğru kanaldan ulaşmasını kolaylaştırın." },
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
