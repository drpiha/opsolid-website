import type { PageDef } from "./types";
import type { PageKey } from "./keys";

const CHECK = { label: "YZ Kontrolüyle başlayın", href: "/ai-automation-check" };
const CONTACT = { label: "İletişime geçin", href: "/contact" };
/** Required under every price table: net prices are only safe when the offer is visibly limited to businesses. */
const PRICE_NOTE = "Tüm fiyatlar net, KDV hariçtir. Hizmetlerimiz yalnızca işletmelere yöneliktir.";
/** Limited pilot phase: remove once the three free YZ Kontrolü sessions are used. */
const PILOT_NOTE = "Pilot dönemi: İlk üç YZ Kontrolünü başlangıç kapsamında, dürüst geri bildirim karşılığında ücretsiz yapıyoruz.";

const DEMO = {
  chip: "Demo · senaryo, sessiz",
  play: "Senaryoyu oynatın",
  again: "Tekrar oynatın",
  note: "Kurgulanmış bir akıştır, canlı görüşme değildir. Canlı ses demosu, ses sağlayıcısı ve veri koruma incelemesi (KVKK/GDPR) netleştiğinde yayına alınacak.",
  sr: "Örnek görüşme. Asistan: İyi günler, bir yapay zekâ asistanıyla görüşüyorsunuz. Size nasıl yardımcı olabilirim? Arayan: Gelecek hafta için randevu almak istiyorum. Asistan: Memnuniyetle. Çarşamba 10:00 mu, perşembe 14:00 mü uygun? Arayan: Perşembe uygun. Asistan: O zaman perşembe 14:00'e kaydediyorum. Onayı e-postayla alacaksınız.",
  script: [
    { who: "Asistan", agent: true, text: "İyi günler, bir yapay zekâ asistanıyla görüşüyorsunuz. Size nasıl yardımcı olabilirim?", ms: 3400 },
    { who: "Arayan", agent: false, text: "Gelecek hafta için randevu almak istiyorum.", ms: 3000 },
    { who: "Asistan", agent: true, text: "Memnuniyetle. Çarşamba 10:00 mu, perşembe 14:00 mü uygun?", ms: 3600 },
    { who: "Arayan", agent: false, text: "Perşembe uygun.", ms: 1400 },
    { who: "Asistan", agent: true, text: "O zaman perşembe 14:00'e kaydediyorum. Onayı e-postayla alacaksınız.", ms: 4200 },
  ],
};

/** Real screenshots of our own work (public/img/v4), shown next to the project rows. */
const SHOT = {
  opsolid: { src: "/img/v4/shot-opsolid.webp", w: 960, h: 640, alt: "opsolid.de ana sayfası (Almanca): “Weniger Routine. Mehr Zeit für Ihre Kunden.” (Daha az rutin. Müşterilere daha çok zaman.) başlığı ve her hizmet için bir tane olmak üzere yedi cam plakadan oluşan açık renkli bir sahne" },
  opso: { src: "/img/v4/shot-card.webp", w: 960, h: 640, alt: "OpSo ana sayfası (Almanca): “Deine Visitenkarte als Mini-Website.” (Mini web sitesi olarak kartvizitiniz.) başlığı ve yanında kurgusal bir demo profili, QR kod, NFC ve bağlantı etiketleri gösteren bir telefon" },
  kutasia: { src: "/img/v4/shot-kutasia.webp", w: 960, h: 640, alt: "Kutasia ana sayfası: “Müşteri iletişimi, randevu ve işleriniz tek ekranda” başlığı ve yanında mesajları ve haftalık istatistikleri gösteren bir kontrol paneli görünümü" },
};

export const tr: Record<PageKey, PageDef> = {
  home: {
    slug: "",
    meta: {
      title: "OpSolid | YZ asistanları, web siteleri ve otomasyon",
      description:
        "Daha az rutin, müşterilere daha çok zaman: OpSolid, küçük ve orta ölçekli işletmeler için telefon ve sohbet YZ asistanları, abonelikli web siteleri ve otomasyonlar kurar.",
    },
    crumb: "Ana sayfa",
    hero: {
      eyebrow: "YZ asistanları · Web siteleri · Otomasyon",
      h1: ["Daha az rutin. ", "Müşterilere", " daha çok zaman."],
      lede: "YZ asistanları aramaları ve mesajları yanıtlar, iş akışları kopyala-yapıştır olmadan ilerler, web siteniz bakım yükü yerine talep getirir. OpSolid bunu küçük ve orta ölçekli işletmeler için kurar, öncesini ve sonrasını ölçer, belgeleyerek teslim eder.",
      primary: { label: "YZ Kontrolüyle başlayın", href: "/ai-automation-check" },
      secondary: { label: "Hizmetleri görün", href: "#leistungen" },
    },
    blocks: [
      {
        t: "rows",
        id: "leistungen",
        eyebrow: "Hizmetler",
        h: "Daha az elle iş için sekiz yol.",
        lede: "Her hizmet, işletmenizin günlük işleyişindeki somut bir sorunu çözer. Bugün size en çok zaman kaybettireni seçin.",
        items: [
          { h: "YZ asistanları", p: "Ekibiniz müşteriyle meşgulken bile aramalar ve mesajlar yanıtlanır.", href: "/agents" },
          { h: "Web siteleri", p: "Hızlı, sade, bakımı bizden. Abonelikle aylık 99 €'dan başlayan fiyatlarla.", href: "/websites" },
          { h: "Süreç otomasyonu", p: "Veriyi bir kez girin. Gerisi kendiliğinden ilerler.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Zaten ödediğiniz lisanslardan daha fazlası.", href: "/microsoft-365-automatisierung" },
          { h: "Şirket içi araçlar", p: "Ortak Excel listesi, yetkileri ve geçmişi olan bir araca dönüşür.", href: "/interne-tools" },
          { h: "YZ Kontrolü", p: "90 dakikada neyin kazandıracağı netleşir. 490 €'dan başlayan fiyatlarla.", href: "/ai-automation-check" },
          { h: "YZ eğitimleri", p: "Ekibiniz gerçek görevler üzerinde YZ ile güvenle çalışmayı öğrenir.", href: "/ki-schulungen" },
          { h: "OpSo", tag: "Test aşaması", p: "Dijital kartvizit: tek bağlantı, NFC ve QR, her zaman güncel.", href: "/opso" },
        ],
        cta: { label: "Tüm hizmetlere genel bakış", href: "/leistungen" },
      },
      {
        t: "demo",
        id: "agents",
        eyebrow: "Telefon ve sohbet için YZ asistanları",
        h: "Hiçbir arama yanıtsız kalmaz.",
        lede: "Bir YZ asistanı talepleri alır, randevuları ayarlar ve kendi belgelerinize dayanarak bilgi verir. Bir insana ihtiyaç olduğu anda görüşmeyi ekibinize devreder. Arayanlar en başta bir YZ sistemiyle konuştuklarını öğrenir.",
        ...DEMO,
        cta: { label: "YZ asistanları hakkında", href: "/agents" },
      },
      {
        t: "offer",
        id: "websites",
        eyebrow: "Abonelikle web siteleri",
        h: "Talep getiren bir web sitesi.",
        lede: "Web sitenizi tasarlar, kurar ve işletiriz: hızlı, kolay okunur, hazır şablon yerine işletmeniz için tasarlanmış. Barındırma, bakım ve güncellemeler bizden.",
        label: "Web sitesi aboneliği",
        amount: "99 €",
        unit: "aylık, başlangıç fiyatı",
        sub: "veya yıllık 990 € · kurulum 490 €'dan başlayan fiyatlarla",
        items: ["Barındırma, bakım ve güncellemeler dahil", "Ayda 1 küçük değişiklik, 5 iş günü içinde", "Web sitesini satın alma seçeneği talep üzerine"],
        note: PRICE_NOTE,
        shot: SHOT.opsolid,
        cta: { label: "Web siteleri hakkında", href: "/websites" },
      },
      {
        t: "compare",
        id: "automatisierung",
        eyebrow: "Süreç otomasyonu · Microsoft 365 · Şirket içi araçlar",
        h: "Veriyi yalnızca bir kez girin.",
        lede: "Bugün e-posta, Excel, CRM ve ERP arasında elle taşınan işler, sonrasında kendiliğinden ilerler. Yalnızca bir insanın verebileceği kararlar ekibinizde kalır.",
        before: { h: "Bugün", items: ["Talep e-postayla gelir", "Veriler Excel listesine kopyalanır", "CRM'e bir kez daha yazılır", "Teklif elle hazırlanır", "Durum toplu e-postayla sorulur"] },
        after: { h: "Sonrası", items: ["Talep e-postayla gelir", "Veriler kontrol edilip CRM'e düşer", "Teklif taslağı hazır bekler", "Ekibiniz kontrol eder ve onaylar", "Herkes durumu Teams'te görür"] },
        cta: { label: "Süreç otomasyonu hakkında", href: "/prozessautomatisierung" },
      },
      {
        t: "rows",
        eyebrow: "Neler değişir",
        h: "İşletmenizde neler değişir.",
        lede: "Bunun bir vaat olarak kalmaması için her pilot projeden önce iş akışının bugün neye mal olduğunu ölçeriz: iş başına süre, bekleme süresi, hatalar. Sonrasında aynısını yeniden ölçeriz.",
        items: [
          { h: "Daha az rutin", p: "Kopyala-yapıştır, çift veri girişi ve haftalık rapor kendiliğinden ilerler. Ekibiniz müşterilere zaman kazanır." },
          { h: "Daha az hata", p: "Veriler bir kez girilir ve düzgün aktarılır. Her iş akışının kaydı, hata yönetimi ve elle devralma yolu vardır." },
          { h: "Daha hızlı yanıt", p: "Talepler ön sıralanır, yanıtlanır veya doğrudan ilgili kişiye yönlendirilir." },
          { h: "Bağımlılık yok", p: "Otomasyonlarda ve şirket içi araçlarda kaynak kod ve dokümantasyon sizindir. BT ekibiniz istediği zaman devralabilir." },
        ],
      },
      {
        t: "spec",
        id: "ki-check",
        eyebrow: "Başlangıç: YZ Kontrolü",
        h: "Bütçe harcanmadan önce bir plan.",
        lede: "YZ Kontrolü, hangi iş akışlarınızın otomatikleştirilebileceğini ve hangilerinin otomatikleştirilemeyeceğini gösterir: işi yapan kişilerle 90 dakika uzaktan görüşme, ardından kısa bir yazılı rapor.",
        rows: [
          ["Başlangıç", "90 dakika uzaktan, kısa yazılı rapor"],
          ["Geniş kapsam", "Atölye, süreç haritası, puanlanmış beş aday, 30 günlük plan"],
          ["NDA", "Analiz görüşmesinden önce"],
          ["Fiyat", "490 €'dan başlayan fiyatlarla (net); geniş kapsam önceden yazılı sabit fiyatla"],
        ],
        cta: { label: "YZ Kontrolü ayrıntıları", href: "/ai-automation-check" },
      },
      {
        t: "table",
        id: "preise",
        eyebrow: "Sabit formatlar, net fiyatlar",
        h: "Başlangıcın maliyeti.",
        caption: "YZ Kontrolü, YZ eğitimleri ve web sitesi aboneliğine genel bakış",
        cols: ["Teklif", "Format", "Fiyat"],
        rows: [
          ["YZ Kontrolü", "90 dakika uzaktan, kısa yazılı rapor", "490 €'dan itibaren"],
          ["YZ Yetkinliği Temel", "Yarım gün, en fazla 15 kişi", "1.490 €"],
          ["Copilot Uygulama Günü", "1 gün, en fazla 12 kişi", "2.400 €'dan itibaren"],
          ["Web sitesi aboneliği", "Barındırma, bakım, güncellemeler, ayda 1 küçük değişiklik", "aylık 99 €'dan itibaren"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
        cta: { label: "Eğitimlerin ayrıntıları", href: "/ki-schulungen" },
      },
      {
        t: "rows",
        id: "produkte",
        eyebrow: "Kendi projelerimiz",
        h: "Kendimiz için geliştirdiklerimiz.",
        lede: "Kendi uygulamalarımız nasıl çalıştığımızı gösterir: tasarım, teknik ve veri koruma aynı projede.",
        items: [
          { h: "opsolid.de", tag: "Bu site", p: "OpSolid tarafından tasarlandı, kuruldu ve işletiliyor. Önce metin gelir; arka plan videosu durdurulabilir ve kapatılabilir.", shot: SHOT.opsolid },
          { h: "OpSo", tag: "Test aşamasındaki ürün", p: "NFC ve QR'lı dijital kartvizit: tek bağlantı, her zaman güncel, alıcının uygulama yüklemesine gerek yok.", href: "/opso", shot: SHOT.opso },
          { h: "Kutasia", tag: "Geliştirme aşamasındaki proje", p: "WhatsApp, Telegram ve e-postadan gelen müşteri mesajları tek gelen kutusunda, YZ tarafından ön sıralanmış.", href: "https://kutasia.com", shot: SHOT.kutasia },
        ],
      },
    ],
    faq: {
      h: "Sık sorulan sorular",
      items: [
        { q: "Bir YZ asistanı ekibimizin yerini alır mı?", a: "Hayır. Rutini üstlenir ve bir kişiye ihtiyaç olduğu anda görüşmeyi devreder." },
        { q: "Mevcut sistemlerimizi koruyabilir miyiz?", a: "Evet. Microsoft 365, Google Workspace, CRM'iniz veya ERP'niz iş akışını taşıyorsa onların üzerine kurarız." },
        { q: "Ekibimizin ne kadar zaman ayırması gerekir?", a: "YZ Kontrolü için: kısa bir ön görüşme ve işi yapan kişilerle 90 dakikalık analiz. Geniş kapsamda buna bir atölye ve planı konuşmak için 30 dakika eklenir." },
        { q: "Önceden gizlilik sözleşmesi imzalanıyor mu?", a: "Evet. Analiz görüşmesinden önce standart bir NDA imzalanır." },
        { q: "Muhatabımız kim olacak?", a: "Analizden işletime kadar OpSolid'de sabit bir muhatabınız olur. YZ Yetkinliği Temel eğitimini ise bizim seçtiğimiz ve adını size önceden bildirdiğimiz serbest çalışan bir uzman yürütür." },
      ],
    },
    cta: {
      h: "Bugün en çok zamanınızı hangi iş akışı alıyor?",
      p: "Üç cümleyle anlatın; otomasyonun karşılığını verip vermeyeceğini ve sonraki adımı söyleriz. Genellikle birkaç iş günü içinde yanıt veririz.",
      primary: { label: "İş akışınızı anlatın", href: "/contact" },
      secondary: CHECK,
    },
    service: undefined,
  },

  agents: {
    slug: "agents",
    meta: {
      title: "Telefon ve web sitesi için YZ asistanları",
      description:
        "OpSolid'in yapay zekâ asistanları telefon ve sohbet asistanı olarak çalışır: talepleri alır, randevuları ayarlar ve ekibinize devreder. Veri koruma incelemesiyle.",
    },
    crumb: "YZ asistanları",
    hero: {
      eyebrow: "YZ asistanları · telefon ve web sitesi",
      h1: ["Telefon çalıyor, ", "YZ asistanı", " açıyor."],
      lede: "Bir yapay zekâ asistanı (AI agent) talepleri alır, randevuları ayarlar ve işletmenizle ilgili soruları kendi belgelerinize dayanarak yanıtlar. Muhakeme gerektiren konuları ekibinize devreder. Böylece daha az arama cevapsız kalır, ekibiniz daha az bölünür.",
      primary: CHECK,
      secondary: { label: "Senaryoyu izleyin", href: "#demo" },
      spec: [
        ["Formatlar", "Telefon ve sohbet asistanı"],
        ["Görevler", "Talepler, randevular, bilgi, devretme"],
        ["Durum", "Senaryo demosu; canlı demo hazırlanıyor"],
      ],
    },
    blocks: [
      {
        t: "demo",
        id: "demo",
        h: "Bir arama böyle ilerler.",
        lede: "İlk cümleden onaya kadar bir randevu talebi: Asistan en başta bir yapay zekâ sisteminin konuştuğunu söyler, uygun saatleri önerir, randevuyu kaydeder ve e-postayla onay gönderir. Bir insan gerektiği anda görüşmeyi ekibinize devreder.",
        ...DEMO,
      },
      {
        t: "rows",
        eyebrow: "Görevler",
        h: "Asistan neyi üstlenir, neyi üstlenmez?",
        lede: "Asistan, tekrar eden ve net kurallara dayanan rutin işleri üstlenir. Muhakeme gerektiren her şey ekibinize gider.",
        items: [
          { h: "Talepleri almak", p: "Telefonda veya web sitesinde gelen talepleri almak ve düzenli biçimde ekibinize iletmek." },
          { h: "Randevu ayarlamak", p: "Boş saatleri önermek, randevuyu kaydetmek ve onay göndermek." },
          { h: "Bilgi vermek", p: "Hizmetleri, süreçleri ve çalışma saatlerini kendi belgelerinize dayanarak açıklamak." },
          { h: "İnsana devretmek", p: "Şikâyet, özel durum veya belirsizlikte görüşmeyi bir çalışana aktarmak." },
        ],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Dört adımda kendi asistanınız.",
        items: [
          { h: "Netleştirme", p: "Görevleri, sınırları ve konuşma tonunu belirlemek: Asistan neye karar verebilir, neye veremez?" },
          { h: "Kurulum", p: "Diyaloğu ve sesi tasarlamak; takvime, CRM'e veya e-posta kutusuna bağlamak." },
          { h: "Veri koruma incelemesi", p: "Canlıya geçmeden önce sağlayıcıyı, saklama yerini, saklama süresini ve arayanlara yapılacak YZ bilgilendirmesini belirlemek." },
          { h: "Test ve işletim", p: "Görüşmeleri değerlendirmek, iyileştirmek ve asistanı günlük işte desteklemek." },
        ],
      },
    ],
    faq: {
      h: "YZ asistanları hakkında sorular",
      items: [
        { q: "Bir YZ asistanının maliyeti nedir?", a: "Görevlere, bağlantılara ve arama hacmine bağlıdır. Fiyatı, hiçbir şey kurulmadan önce yazılı olarak bildiririz. Fiyatlar net olup KDV hariçtir." },
        { q: "Asistan bugün canlı konuşabiliyor mu?", a: "Şu anda canlandırılmış bir senaryo gösteriyoruz. Canlı ses demosu, ses sağlayıcısı ve veri koruma incelemesi netleştiğinde gelecek." },
        { q: "Görüşmeleri kim dinleyebilir?", a: "Bunu önceden sizinle birlikte belirleriz: sağlayıcı, saklama yeri, saklama süresi ve erişim. Arayanlara en başta bir YZ sistemiyle konuştukları bildirilir." },
        { q: "Asistan ekibimizin yerini alır mı?", a: "Hayır. Rutin işleri üstlenir ve bir kişi gerektiği anda görüşmeyi devreder." },
        { q: "Bu sitedeki video bir asistan mı?", a: "Hayır. Cam plakalı arka plan videosu bir tasarım öğesidir; durdurabilir veya sayfanın altındaki “Arka plan videosu” ayarından kapatabilirsiniz. YZ asistanlarımız figürsüz ve yüzsüz, telefon ve sohbet asistanı olarak çalışır." },
        { q: "Nasıl başlarız?", a: "YZ Kontrolüyle. Bir asistanın işletmeniz için anlamlı olup olmadığını ve hangi görevleri üstlenmesi gerektiğini orada birlikte netleştiririz." },
      ],
    },
    cta: { h: "Asistan size uygun mu, birlikte bakalım.", p: "YZ Kontrolünde, hiçbir şey kurulmadan önce görevleri, sınırları ve veri korumayı netleştiririz.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI phone and chat assistants" },
  },

  websites: {
    slug: "websites",
    meta: {
      title: "Web sitesi tasarımı: satın alma veya abonelik",
      description:
        "OpSolid, işletmenize benzeyen hızlı ve çok dilli web siteleri tasarlar, kurar ve işletir. Satın alma veya aylık 99 €'dan itibaren (net) web sitesi aboneliği.",
    },
    crumb: "Web siteleri",
    hero: {
      eyebrow: "Web siteleri · satın alma veya abonelik",
      h1: ["", "Size benzeyen", " web siteleri."],
      lede: "OpSolid; hızlı açılan, kolay okunan ve birden çok dilde çalışan web siteleri tasarlar ve kurar. Satın alma: tek seferlik proje bedeli, site sizin olur. Web sitesi aboneliği: aylık 99 €'dan başlayan ücret; barındırma, bakım ve güncellemeleri biz üstleniriz.",
      primary: CONTACT,
      secondary: { label: "Örnek çalışmaları inceleyin", href: "#referenzen" },
      spec: [
        ["Modeller", "Satın alma veya web sitesi aboneliği"],
        ["Abonelik", "Aylık 99 €'dan itibaren veya yıllık 990 €; kurulum 490 €'dan itibaren"],
        ["Satın alma", "Fiyat, ilk görüşmeden sonra yazılı olarak"],
        ["Fiyatlar", "Net, KDV hariç; yalnızca işletmeler için"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Hizmet",
        h: "Her web sitesinde neler var?",
        items: [
          { h: "Tasarım", p: "Yeni logo takılmış bir şablon yerine işletmenize uyan tipografi, renk ve hareket." },
          { h: "Kurulum", p: "Önce metin, hızlı yükleme, erişilebilirlik; arama motorları ve YZ aramaları için temiz bir yapı." },
          { h: "Çok dillilik", p: "Her dil için ayrı adres ve arama motorları için doğru işaretleme; müşterilerinizin konuştuğu dillerde." },
          { h: "Satın alma veya abonelik", p: "Siteyi kendiniz sürdürmek istiyorsanız satın alma, teknik hiçbir şeyle uğraşmak istemiyorsanız web sitesi aboneliği mantıklıdır." },
        ],
      },
      {
        t: "table",
        id: "preise",
        eyebrow: "Fiyatlar",
        h: "Bir web sitesinin maliyeti.",
        lede: "Web sitesi aboneliğinin fiyatları tabloda yer alır. Satın almada proje bedelini ilk görüşmeden sonra yazılı olarak bildiririz.",
        caption: "Web sitesi aboneliği ve satın almaya genel bakış",
        cols: ["Model", "Kapsam", "Fiyat"],
        rows: [
          ["Web sitesi aboneliği||Barındırma, bakım, güncellemeler ve ayda 1 küçük değişiklik dahildir (5 iş günü içinde uygulanır, acil servis yoktur).", "Kurulum 490 €'dan itibaren; ardından aylık veya yıllık 990 €", "aylık 99 €'dan itibaren"],
          ["Satın alma||Tek seferlik proje bedeli. Tamamlanan site sizin olur; onu kendiniz veya BT ekibinizle sürdürürsünüz.", "Kapsama göre proje bedeli, ilk görüşmeden sonra yazılı olarak", "Talep üzerine"],
        ],
        note: PRICE_NOTE,
      },
      {
        t: "rows",
        id: "referenzen",
        eyebrow: "Örnek çalışmalar",
        h: "Kendimiz tasarladık, kendimiz kurduk.",
        lede: "Bu projeleri OpSolid, tasarımdan teknolojiye kadar kendisi kurguladı ve geliştirdi. Bağlantılar sizi projelere götürür; kendiniz inceleyebilirsiniz.",
        items: [
          { h: "opsolid.de", tag: "Bu site", p: "Önce metin; arka plan videosu metinden sonra başlar, durdurulabilir ve kapatılabilir.", shot: SHOT.opsolid },
          { h: "OpSo", tag: "Test aşamasında ürün", p: "Web uygulaması olarak dijital kartvizit: profil, QR kod ve NFC bağlantısı. Yayına hazırlık sürüyor.", href: "/opso", shot: SHOT.opso },
          { h: "Kutasia", tag: "Geliştirme aşamasında proje", p: "WhatsApp, Telegram ve e-posta için tek gelen kutusu; mesajları yapay zekâ önceden sıralar.", href: "https://kutasia.com", shot: SHOT.kutasia },
        ],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "İlk görüşmeden yayındaki siteye.",
        items: [
          { h: "Görüşme", p: "Hedefi, hedef kitleyi, içerikleri ve dilleri netleştiririz. Ardından kapsamı ve fiyatı yazılı olarak bildiririz." },
          { h: "Taslak", p: "En önemli sayfaların yapısı ve tasarımı, geri bildiriminize göre şekillenir." },
          { h: "Kurulum", p: "Metin, görsel ve formlarla uygulama; telefonda ve masaüstünde test edilir." },
          { h: "Yayın ve işletim", p: "Yayına alma, alan adı ve veri koruma bileşenleri; web sitesi aboneliğinde ardından barındırma, bakım ve güncellemeleri biz üstleniriz." },
        ],
      },
    ],
    faq: {
      h: "Web siteleri hakkında sorular",
      items: [
        { q: "Satın alma mı, abonelik mi daha uygun?", a: "Siteyi kendiniz veya BT ekibinizle sürdürmek istiyorsanız satın alın: Bir kez ödersiniz, site sizindir; fiyatı ilk görüşmeden sonra yazılı olarak bildiririz. Teknik işlerle uğraşmak istemiyorsanız web sitesi aboneliğini seçin: aylık 99 €'dan itibaren veya yıllık 990 €, kurulum 490 €'dan itibaren; tüm fiyatlar net, KDV hariçtir. Barındırma, bakım, güncellemeler ve ayda bir küçük değişiklik dahildir; değişiklik 5 iş günü içinde uygulanır, acil servis yoktur." },
        { q: "Bir web sitesi projesi ne kadar sürer?", a: "Kapsama bağlıdır. İlk görüşmeden sonra somut bir zaman planı alırsınız." },
        { q: "Metinler ve görseller kime ait?", a: "Sizin sağladığınız içerikler sizin kalır. Tasarım ve kodun kullanım haklarını önceden yazılı olarak belirleriz." },
        { q: "Sitede video ve hareket olabilir mi?", a: "Evet, ek olarak. Metin her zaman önce gelir; video ve efektler durdurulabilir, kapatılabilir ve azaltılmış hareket ayarına uyar." },
      ],
    },
    cta: { h: "Web siteniz ne başarmalı?", p: "Sitenin kimin için olduğunu ve neyi başarması gerektiğini iki üç cümleyle yazın. Genellikle birkaç iş günü içinde yanıt veririz.", primary: { label: "Web sitesi talep edin", href: "/contact" } },
    service: {
      type: "Website design, development and subscription",
      offers: [
        { name: "Web sitesi aboneliği, aylık", price: 99, from: true, unit: "month" },
        { name: "Web sitesi aboneliği, yıllık", price: 990, unit: "year" },
        { name: "Web sitesi aboneliği, kurulum", price: 490, from: true },
      ],
    },
  },

  leistungen: {
    slug: "leistungen",
    meta: {
      title: "Hizmetler: YZ asistanları, web siteleri, otomasyon",
      description:
        "YZ asistanları, web siteleri, süreç otomasyonu, Microsoft 365, şirket içi araçlar, YZ danışmanlığı ve YZ eğitimleri: hangi OpSolid hizmeti hangi sorunu çözer.",
    },
    crumb: "Hizmetler",
    hero: {
      eyebrow: "Hizmetler",
      h1: ["Manuel işi azaltmanın ", "yedi yolu", "."],
      lede: "Her hizmet belirli bir sorunu çözer: cevapsız kalan aramalar, artık işletmenize uymayan bir web sitesi, sistemler arasında elle taşınan veriler. YZ Kontrolü, nereden başlamanın en çok karşılık vereceğini gösterir.",
      primary: CHECK,
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Tüm hizmetler",
        h: "Hangi hizmet hangi sorunu çözer?",
        items: [
          { h: "YZ asistanları", tag: "Telefon · web sitesi", p: "Aramalar ve talepler yanıtsız kalıyorsa: Asistan onları karşılar, randevuları ayarlar ve ekibinize devreder.", href: "/agents" },
          { h: "Web siteleri", tag: "Satın alma · abonelik", p: "Web siteniz artık işletmenize uymuyorsa: tasarlarız, kurarız ve isterseniz işletiriz.", href: "/websites" },
          { h: "Süreç otomasyonu", p: "Aynı veriler iki kez giriliyorsa: teklifler, raporlar ve veri eşitleme otomatik işler.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Lisanslar ödeniyor ama pek kullanılmıyorsa: onayları, belgeleri ve e-posta kurallarını otomatikleştiririz.", href: "/microsoft-365-automatisierung" },
          { h: "Şirket içi araçlar", p: "Bir tablo darboğaza dönüştüyse: yetkileri, geçmişi ve tam ihtiyacınız olan alanları olan bir araç.", href: "/interne-tools" },
          { h: "YZ danışmanlığı", p: "YZ'nin nerede karşılığını verdiği belirsizse: üç ila beş kullanım senaryosu, yazılı değerlendirme ve yol haritası.", href: "/ki-beratung" },
          { h: "YZ eğitimleri", tag: "Ekip", p: "Ekibiniz YZ'yi ortak kurallar olmadan kullanıyorsa: sabit kapsamlı ve net fiyatlı üç format.", href: "/ki-schulungen" },
        ],
      },
      {
        t: "steps",
        eyebrow: "Yöntem",
        h: "Nereden başlarsanız başlayın, yol aynı.",
        items: [
          { h: "Analiz", p: "YZ Kontrolünde iş akışlarınızı inceler ve otomasyonun nerede karşılığını vereceğini netleştiririz." },
          { h: "Pilot", p: "Etkisi büyük tek bir iş akışı; sabit kapsam ve sabit zaman çerçevesiyle." },
          { h: "Devreye alma", p: "Pilotta işe yarayan çözüm yaygınlaştırılır ve belgelenir." },
          { h: "Teslim", p: "Çözümü ekibiniz kendisi işletir; isterseniz değişiklikler için küçük bir destek çerçevesiyle yanınızda oluruz." },
        ],
      },
    ],
    cta: { h: "Nereden başlamalı?", p: "YZ Kontrolünde iş akışlarınızı birlikte sıralar, ilk önce karşılığını verecek yapı taşını seçeriz.", primary: CHECK, secondary: CONTACT },
  },

  kiBeratung: {
    slug: "ki-beratung",
    meta: {
      title: "KOBİ'ler için YZ danışmanlığı ve yol haritası",
      description:
        "OpSolid'den KOBİ'lere YZ danışmanlığı: fayda, efor ve riske göre değerlendirilmiş üç ila beş kullanım senaryosu, yol haritası ve şirket içi YZ politikası.",
    },
    crumb: "YZ danışmanlığı",
    hero: {
      eyebrow: "YZ danışmanlığı",
      h1: ["Hangi YZ ", "işinize", " yarar?"],
      lede: "İşletmenize uyan üç ila beş YZ kullanım senaryosu buluruz; fayda, efor ve riski değerlendirir, sonucu yazılı bir yol haritasına dökeriz. Uymayanları açıkça eleriz.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Sonuç", "Senaryo değerlendirmesi, yol haritası, YZ politikası"],
        ["Süre", "Hedef çerçeve: iki ila dört hafta"],
        ["Yaklaşım", "Bağımsız, YZ aracı satışı yok"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Hizmet",
        h: "Üç ila beş senaryo, gerekçeli ve yazılı.",
        items: [
          { h: "Senaryoları bulmak", p: "İşletmenize uyan üç ila beş uygulamayı belirlemek, uymayanları açıkça elemek." },
          { h: "Değerlendirmek", p: "Her senaryoyu beklenen fayda, efor ve işletme riskine göre sıralamak." },
          { h: "Yol haritasını yazmak", p: "Sorumlular, maliyetler ve karar noktalarıyla 6 ila 12 aylık bir yol haritası." },
          { h: "Veri korumayı kurmak", p: "Veri korumaya uygun kullanımı hazırlamak: model seçimi, veri egemenliği ve işletmeniz için kısa bir YZ politikası." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Tipik uygulamalar",
        h: "YZ okur, sıralar, taslak hazırlar.",
        lede: "YZ, çok sayıda metnin okunduğu, sıralandığı veya taslağının hazırlandığı ve sonucu bir insanın kontrol ettiği yerde karşılığını verir.",
        items: [
          { h: "Belge ve sözleşme analizi", p: "Uzun PDF'leri ön sıralamak, maddeleri ve süreleri görünür kılmak. Özeti bir insan kontrol eder." },
          { h: "Şirket içi bilgi arama", p: "Politikaları, SSS'leri ve SharePoint'i aranabilir kılmak; yanıtlar kendi belgelerinizden gelir." },
          { h: "Teklif taslakları", p: "Şablon, CRM kaydı ve kısa bir brifingden teklif taslağı hazırlamak. Satış ekibi kontrol eder ve onaylar." },
          { h: "Destek talebi ön sıralaması", p: "Gelen talepleri, bir çalışan ele almadan önce konu ve aciliyete göre sıralamak. Bu tür bir YZ ön sıralaması, geliştirmekte olduğumuz Kutasia projesinde de yer alıyor." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Modeller ve yapı taşları",
        h: "Model verinize uyar, tersi değil.",
        lede: "Verilerin AB dışına çıkmaması gerekiyorsa AB'de barındırma veya açık kaynak modeller devreye girer. Microsoft 365 kullanılıyorsa Copilot öne çıkar.",
        items: ["OpenAI", "Anthropic Claude", "Microsoft Copilot, Azure OpenAI", "Mistral ve açık kaynak modeller", "Retrieval-Augmented Generation", "pgvector, Qdrant", "AB'de barındırma"],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Görüşmeden yol haritasına üç adım.",
        items: [
          { h: "Mevcut durum", p: "Ekip, veri ve hedefler üzerine kısa bir görüşme." },
          { h: "Senaryo değerlendirmesi", p: "Atölye ve yazılı analiz: Hangi uygulamalar karşılığını verir, hangileri vermez?" },
          { h: "Yol haritası ve politika", p: "Karar vermeye hazır bir yol haritası ve işletmeniz için kısa, yazılı bir YZ politikası." },
        ],
      },
    ],
    faq: {
      h: "YZ danışmanlığı hakkında sorular",
      items: [
        { q: "Ücreti ne kadar?", a: "Kapsama bağlıdır. Kapsamı ve fiyatı, iş başlamadan önce teklifte yazılı olarak belirleriz. Fiyatlar net olup KDV hariçtir." },
        { q: "YZ danışmanlığı ile YZ Kontrolü arasındaki fark nedir?", a: "YZ Kontrolü, iş akışlarınızda YZ'li veya YZ'siz otomasyon adaylarını arar. YZ danışmanlığı daha ileri gider: somut YZ uygulamalarını değerlendirir, 6 ila 12 aylık bir yol haritası belirler ve işletmeniz için bir YZ politikası hazırlar." },
        { q: "YZ araçları satıyor musunuz?", a: "Hayır. OpSolid bağımsızdır ve işinize uyanı önerir. Bu bazen “elinizdekini kullanın” ya da “şimdilik bekleyin” anlamına da gelir." },
        { q: "YZ, KVKK ve GDPR kurallarına uygun kullanılabilir mi?", a: "Kullanım, veri korumaya uygun biçimde kurgulanabilir: doğru model seçimi, AB'de barındırma, veri işleme sözleşmesi ve yazılı bir politika. Bunları birlikte hazırlarız; nihai değerlendirme veri koruma sorumlunuza veya hukuk danışmanınıza aittir." },
        { q: "Danışmanlık ne kadar sürer?", a: "Analiz ve yol haritası için iki ila dört hafta öngörürüz; kesin çerçeveyi teklifte belirleriz. Uygulama ayrı bir projedir." },
      ],
    },
    cta: { h: "Hangi YZ'nin karşılık vereceğini görün.", p: "Bir görüşme, yazılı bir yol haritası; platform satışı yok.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI consulting" },
  },

  prozess: {
    slug: "prozessautomatisierung",
    meta: {
      title: "KOBİ'ler için süreç otomasyonu",
      description:
        "OpSolid teklifleri, belgeleri, e-posta yönlendirmeyi, raporları ve veri eşitlemeyi mevcut araçlarınızla otomatikleştirir. Önce ölçülür, sonra kurulur.",
    },
    crumb: "Süreç otomasyonu",
    hero: {
      eyebrow: "Süreç otomasyonu",
      h1: ["Veriyi yalnızca ", "bir kez", " girin."],
      lede: "Bugün zaman kaybettiren iş akışlarını otomatikleştiririz: yarım gün süren teklifler, her pazartesi yeniden hazırlanan raporlar, Excel, CRM ve e-posta arasında dolaşan veriler. Önce iş akışını kayda alır ve maliyetini ölçeriz. Sonra değecek olanı otomatikleştiririz.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Başlangıç", "Etkisi büyük tek bir iş akışı, sabit kapsam"],
        ["Pilot", "Hedef çerçeve: iki ila dört hafta"],
        ["Temel", "Mevcut araçlarınız"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Yöntem",
        h: "Bugünkü akıştan çalışan pilota.",
        items: [
          { h: "İş akışını kayda almak", p: "Devir noktalarını, araçları, verileri ve istisnaları ekibinizin kontrol edebileceği şekilde yazıya dökmek." },
          { h: "Ölçmek ve seçmek", p: "Başlangıç durumunu ölçmek; hangi adımların otomatikleşebileceğini, hangilerinin bilerek manuel kalacağını netleştirmek." },
          { h: "Kurmak", p: "Power Automate, Make, n8n, Python veya özel kodla otomasyon; iş akışınıza hangisi uyuyorsa." },
          { h: "Teslim etmek", p: "İzleme, dokümantasyon ve teslim; böylece ekibiniz iş akışını sonrasında kendisi yürütür." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Tipik iş akışları",
        h: "Otomasyon ilk nerede karşılık verir?",
        lede: "Aynı verinin iki kez girildiği yerde: e-posta, Excel, CRM ve ERP arasında.",
        items: [
          { h: "Teklifler ve belgeler", p: "Şablonları CRM verileriyle doldurmak, akış içinde onaylamak ve göndermek." },
          { h: "E-posta sıralama", p: "Gelen e-postaları konuya göre etiketlemek ve doğru gelen kutusuna veya destek kaydına yönlendirmek. Geliştirmekte olduğumuz Kutasia projesi de WhatsApp, Telegram ve e-postadan gelen mesajları aynı ilkeyle ön sıralar." },
          { h: "Raporlar ve Excel", p: "Tekrarlayan analizleri bir kez kurmak ve otomatik olarak yeniden üretmek." },
          { h: "CRM ve ERP eşitleme", p: "Veriyi bir kez girmek ve sistemler arasında çift giriş olmadan eşitlemek." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Araçlar",
        h: "İş akışınıza uyan araçlar.",
        lede: "Şirkette Microsoft 365 varsa Power Automate öne çıkar. Sistemler arası bağlantılar için Make veya n8n, özel durumlar için Python uygundur.",
        items: ["Microsoft Power Automate", "Make", "n8n, kendi sunucunuzda", "Zapier, uygun olduğunda", "Python", "REST API'ler ve webhook'lar", "PostgreSQL ve kuyruklar"],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Üç adım, sabit bir kapsam.",
        items: [
          { h: "Kayda alma", p: "İşi yapan ekiple bir atölye. İş akışını gerçekte nasıl işliyorsa öyle kayda alır ve başlangıç durumunu ölçeriz." },
          { h: "Kurulum", p: "İlk pilot otomasyon; hedef çerçeve iki ila dört hafta, teklifte bağlayıcı olarak belirlenir." },
          { h: "Teslim", p: "Dokümantasyon, ekibinize teslim ve kısa bir iyileştirme dönemi." },
        ],
      },
    ],
    faq: {
      h: "Süreç otomasyonu hakkında sorular",
      items: [
        { q: "Ücreti ne kadar?", a: "Kapsama bağlıdır. Kapsamı ve fiyatı, iş başlamadan önce teklifte yazılı olarak belirleriz. Fiyatlar net olup KDV hariçtir." },
        { q: "Tipik bir ilk proje nedir?", a: "Etkisi büyük tek bir iş akışı; örneğin teklif hazırlama, e-posta sıralama veya haftalık rapor. Sabit kapsam, hedef çerçeve iki ila dört hafta." },
        { q: "Bunun için YZ gerekir mi?", a: "Hayır. Çoğu zaman ilk mantıklı adım, hiç YZ kullanmayan düzgün bir otomasyondur." },
        { q: "İş akışı sonradan değişirse ne olur?", a: "Dokümantasyonu, BT ekibiniz değişiklikleri kendisi yapabilecek şekilde hazırlarız. Daha büyük değişiklikler için isteğe bağlı küçük bir aylık çerçeve sunarız." },
        { q: "Kritik iş akışlarını otomatikleştirmek güvenli mi?", a: "Evet; kayıt, hata yönetimi ve elle devam etme imkânıyla. Yalnızca ideal durumu değil, hata durumunu da planlarız." },
      ],
    },
    cta: { h: "Karşılık verecek ilk akışı seçin.", p: "Onu kayda alır, değerlendirir ve harcanacak efora değip değmediğini söyleriz.", primary: CHECK, secondary: CONTACT },
    service: { type: "Business process automation" },
  },

  m365: {
    slug: "microsoft-365-automatisierung",
    meta: {
      title: "Microsoft 365 otomasyonu: Power Automate, SharePoint",
      description:
        "OpSolid, Microsoft 365'i mevcut lisanslarınızla otomatikleştirir: Power Automate, SharePoint, Teams onayları, Outlook yönlendirme. Eksiksiz belgelenir.",
    },
    crumb: "Microsoft 365",
    hero: {
      eyebrow: "Microsoft 365",
      h1: ["Lisanslar zaten sizde. ", "Sıra iş akışlarında", "."],
      lede: "Teams, SharePoint, Outlook ve Power Automate'i; onaylar, belgeler ve e-posta kuralları elle uğraşmadan işleyecek, veriler tek yerde duracak şekilde yapılandırırız. Bunların çoğu lisanslarınızda zaten var; bazı ek abonelikler de gereksiz hâle gelir.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Başlangıç", "Tenant'ınızın incelenmesi"],
        ["Pilot", "İlk akış, hedef çerçeve iki hafta"],
        ["Temel", "Yeterli olduğunda standart lisanslar"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Hizmet",
        h: "Microsoft 365 ortamınızda zaten neler var?",
        items: [
          { h: "Tenant'ı incelemek", p: "Lisanslara, ayarlara ve araçlara bakmak; ekibinizin henüz kullanmadığı otomasyonları bulmak." },
          { h: "Akışları kurmak", p: "Onaylar, belgeler, e-posta yönlendirme ve bildirimler için Power Automate." },
          { h: "Bağlamak", p: "SharePoint, Teams, Outlook ve Excel'i veriler tek yerde duracak şekilde birbirine bağlamak." },
          { h: "Copilot'u yapılandırmak", p: "Microsoft 365 Copilot'u rol tabanlı erişim ve net kurallarla kurmak." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Tipik iş akışları",
        h: "Microsoft 365 hangi işleri üstlenir?",
        lede: "Bunun için çoğu zaman elinizdekiler yeterlidir: Onaylar, belgeler ve e-posta kuralları Outlook, Teams ve SharePoint'in standart bağlayıcılarıyla otomatikleştirilebilir.",
        items: [
          { h: "Teams'te onaylar", p: "İzin, masraf, belge: Teams'te onaylanır, SharePoint'te kayda geçer." },
          { h: "SharePoint listelerinden belgeler", p: "Teklif, sözleşme ve raporları bir listeden üretmek; Excel'den kopyala-yapıştır olmadan." },
          { h: "Outlook'ta ayrıştırma ve yönlendirme", p: "Siparişleri, talepleri veya faturaları otomatik okuyup doğru sisteme aktarmak." },
          { h: "Copilot'u devreye alma", p: "Copilot güvenle kullanılsın diye kurallar, roller ve kısa bir eğitim." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Araçlar",
        h: "Microsoft'un yapı taşlarıyla.",
        items: ["Power Automate", "Power Apps", "SharePoint Online", "Teams, botlar, onaylar", "Outlook, Exchange", "Microsoft Graph API", "Microsoft 365 Copilot", "Entra ID"],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "İncelemeden devreye almaya.",
        items: [
          { h: "Tenant incelemesi", p: "Lisanslara, güvenlik ayarlarına ve araçlara bakmak, kullanılmayanı bulmak." },
          { h: "İlk akış", p: "Pilot olarak bir Power Automate akışı veya Teams iş akışı; hedef çerçeve iki hafta." },
          { h: "Yaygınlaştırma", p: "Dokümantasyon, teslim ve BT ekibiniz için isteğe bağlı eğitimle daha geniş kullanım." },
        ],
      },
    ],
    faq: {
      h: "Microsoft 365 hakkında sorular",
      items: [
        { q: "Ücreti ne kadar?", a: "Kapsama bağlıdır. Kapsamı ve fiyatı, iş başlamadan önce teklifte yazılı olarak belirleriz. Fiyatlar net olup KDV hariçtir." },
        { q: "Power Automate Premium lisansına ihtiyacımız var mı?", a: "Bazen. İşe yarayan birçok akış standart planlarla çalışır. Premium'un ne zaman gerektiğini size önceden söyleriz." },
        { q: "Microsoft 365 Copilot almaya değer mi?", a: "Bazı ekipler için evet, bazıları için hayır. Bunu siz lisans satın almadan önce netleştiririz." },
        { q: "BT ekibimizle birlikte çalışabilir misiniz?", a: "Evet. BT ekibiniz veya Microsoft iş ortağınızla birlikte çalışırız; OpSolid tamamlar, yerine geçmez." },
        { q: "Bu, KVKK ve GDPR açısından uygun mu?", a: "Kullanım, veri korumaya uygun biçimde kurgulanabilir: AB Veri Sınırı (EU Data Boundary), veri işleme sözleşmesi, roller ve yetkiler, belgelenmiş veri akışları. Nihai değerlendirme veri koruma sorumlunuza veya hukuk danışmanınıza aittir; bunun için gereken dokümantasyonu biz sağlarız." },
      ],
    },
    cta: { h: "Microsoft 365'ten daha fazlasını alın.", p: "Yeni bir aboneliğe imza atmadan önce, tenant'ınızda neyi otomatikleştirmenin değeceğini gösteririz.", primary: CHECK, secondary: CONTACT },
    service: { type: "Microsoft 365 automation" },
  },

  interneTools: {
    slug: "interne-tools",
    meta: {
      title: "Şirket içi araçlar: paneller, dashboard'lar, onaylar",
      description:
        "OpSolid küçük, odaklı şirket içi araçlar geliştirir: yönetim konsolları, dashboard'lar, onay kuyrukları ve bilgi tabanları. AB'de barındırılır, kaynak koduyla.",
    },
    crumb: "Şirket içi araçlar",
    hero: {
      eyebrow: "Şirket içi araçlar",
      h1: ["Excel listeniz gerçek bir ", "araca", " dönüşsün."],
      lede: "Hazır yazılımın uymadığı yerde, amaca yönelik kurulmuş küçük bir araç sorunu çoğu zaman daha iyi ve daha hızlı çözer. Her şirket içi iş akışı, kullanıcı başına aylık ücretli bir platform daha gerektirmez. Kendi örneğimiz: OpSo'nun kontrol panelini, ilk kurulum akışını ve yönetim konsolunu OpSolid geliştirdi.",
      primary: CHECK,
      secondary: CONTACT,
      spec: [
        ["Pilot", "Hedef çerçeve: üç ila altı hafta"],
        ["Teslim", "Kaynak kod ve dokümantasyon"],
        ["Barındırma", "AB'de, isterseniz sizin altyapınızda"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Ne geliştiriyoruz",
        h: "Küçük, hızlı, tek bir akışa özel.",
        items: [
          { h: "Yönetim konsolları", p: "Operasyon ekibiniz için net ve odaklı, gereksiz yük olmadan." },
          { h: "Dashboard'lar", p: "Veri kaynaklarınızdan metrikler, istisnalar ve uyarılar tek ekranda." },
          { h: "Onay kuyrukları ve formlar", p: "Gerçek iş akışınıza uyan onay ve eskalasyon adımları." },
          { h: "Bilgi tabanları", p: "Kendi belgelerinizde, politikalarınızda ve SSS'lerinizde arama." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Tipik araçlar",
        h: "Tablo artık yetmiyorsa.",
        lede: "Birkaç kişi aynı tabloyu güncelliyor ve hangi sürümün doğru olduğunu artık kimse kesin bilmiyorsa, kendi aracınız karşılığını verir.",
        items: [
          { h: "Operasyon konsolu", p: "Sipariş özeti, istisnalar ve müşteri notları üç sekme yerine tek yerde." },
          { h: "KPI dashboard'u", p: "CRM, ERP ve finans sisteminden günlük, haftalık ve aylık rakamlar; elle uğraşmadan." },
          { h: "Onay kuyruğu", p: "Teklifleri, sözleşmeleri veya iadeleri sıraya almak, yönlendirmek ve geçmişiyle birlikte onaylamak." },
          { h: "YZ bilgi tabanı", p: "Kendi belgelerinizde arama. Yanıtlar kuruluşunuzun içinde kalır." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Teknoloji",
        h: "Yaygın teknoloji, kolay devralınır.",
        items: ["Next.js, React, TypeScript", "Node.js, Python", "PostgreSQL", "REST, GraphQL, webhook'lar", "Microsoft Entra ID, SSO", "AB'de barındırma", "GitHub, CI/CD, denetim kayıtları"],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "İhtiyaç tanımından işletime.",
        items: [
          { h: "İhtiyaç tanımı", p: "Kısa bir atölye: Araç neyi yapmalı, neyi yapmamalı?" },
          { h: "Kurulum", p: "Gerçek kullanıcılar ve gerçek verilerle pilot sürüm; hedef çerçeve üç ila altı hafta." },
          { h: "Teslim", p: "Dokümantasyon ve kaynak koduyla teslim; isterseniz düzenli değişiklikler için küçük bir çerçeve." },
        ],
      },
    ],
    faq: {
      h: "Şirket içi araçlar hakkında sorular",
      items: [
        { q: "Ücreti ne kadar?", a: "Kapsama bağlıdır. Kapsamı ve fiyatı, iş başlamadan önce teklifte yazılı olarak belirleriz. Fiyatlar net olup KDV hariçtir." },
        { q: "Neden hazır yazılım değil?", a: "Hazır yazılım çoğu zaman doğru seçimdir. Yalnızca uymadığında veya amaca göre fazla pahalı olduğunda geliştiririz ve bunu size önceden söyleriz." },
        { q: "Kod kime ait?", a: "Bunu başlamadan önce yazılı olarak belirleriz. Öngörülen, kaynak kodun ve dokümantasyonun size teslim edilmesidir." },
        { q: "Araç nerede çalışır?", a: "AB'de, seçtiğiniz bir sağlayıcıda veya kendi altyapınızda." },
      ],
    },
    cta: { h: "Ortak tabloyu geride bırakın.", p: "İş akışını kısaca anlatın. Kendi aracınızın mı karşılık vereceğini, yoksa hazır yazılımın mı yeteceğini söyleriz.", primary: CHECK, secondary: CONTACT },
    service: { type: "Custom internal tools" },
  },

  schulungen: {
    slug: "ki-schulungen",
    meta: {
      title: "YZ eğitimleri: net fiyatlı üç format",
      description:
        "YZ Kontrolü 490 €'dan itibaren, YZ Yetkinliği Temel 1.490 €, Copilot Uygulama Günü 2.400 €'dan itibaren (KDV hariç). Kendi görevleriniz üzerinde uygulamalı.",
    },
    crumb: "YZ eğitimleri",
    hero: {
      eyebrow: "YZ eğitimleri · AB YZ Tüzüğü, Madde 4",
      h1: ["Üç format, ", "net fiyatlar", "."],
      lede: "AB'de faaliyet gösteren ve YZ kullanan işletmeler, 2 Şubat 2025'ten bu yana AB Yapay Zekâ Tüzüğü'nün 4. maddesi gereği çalışanlarının YZ yetkinliği için önlem almak zorunda. Üç formatımızın kapsamı sabit, fiyatı nettir; slaytlar yerine kendi işleriniz üzerinde çalışılır.",
      primary: { label: "Eğitim talep edin", href: "/contact" },
      secondary: CHECK,
    },
    blocks: [
      {
        t: "table",
        id: "angebote",
        eyebrow: "Formatlar ve fiyatlar",
        h: "Ekibinize hangi format uyar?",
        caption: "YZ Kontrolü ve YZ eğitimlerine genel bakış",
        cols: ["Hizmet", "Format", "Fiyat"],
        rows: [
          ["YZ Kontrolü||Kompakt başlangıç: Günlük işinizde YZ'nin nerede anlamlı olduğunu, nerede olmadığını birlikte inceleriz. OpSolid tarafından yürütülür; sonuç kısa bir yazılı rapordur. Süreç haritası ve 30 günlük plan içeren geniş kapsamı, önceden yazılı olarak bildirdiğimiz sabit bir fiyatla sunarız.", "90 dakika uzaktan, raporlu", "490 €'dan itibaren"],
          ["YZ Yetkinliği Temel||İş hayatında YZ'yi güvenle kullanmanın temelleri. OpSolid'in seçtiği ve adını size önceden bildirdiği serbest çalışan bir uzman yürütür. AB YZ Tüzüğü'nün 4. maddesi kapsamındaki YZ yetkinliği önlemlerinizi destekler.", "Yarım gün, en fazla 15 kişi", "1.490 €"],
          ["Copilot Uygulama Günü||Kendi işleriniz üzerinde Microsoft 365 Copilot ile uygulamalı çalışma. Copilot lisansı zaten bulunan işletmeler için.", "1 gün, en fazla 12 kişi", "2.400 €'dan itibaren"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Pratik, kendi işleriniz üzerinde.",
        items: [
          { h: "Talep", p: "Ekibinizi, görevlerinizi ve ön bilginizi anlatırsınız. Size uygun formatı önerir ve fiyatı bildiririz." },
          { h: "Planlama", p: "Tarih, yerinde veya uzaktan, katılımcı sayısı ve günlük işinizden örneklerle içerik." },
          { h: "Uygulama", p: "Katılımcılar yalnızca dinlemez; kendi işleri üzerinde bizzat çalışır." },
        ],
      },
    ],
    faq: {
      h: "Eğitimler hakkında sorular",
      items: [
        { q: "Sertifika alıyor muyuz?", a: "Eğitim bir sertifika kursu değildir. AB YZ Tüzüğü'nün 4. maddesi kapsamındaki YZ yetkinliği önlemlerinizi destekler." },
        { q: "Eğitimi kim yürütür?", a: "YZ Kontrolünü OpSolid kendisi yürütür. YZ Yetkinliği Temel'i ise OpSolid'in seçtiği ve adını size önceden bildirdiği serbest çalışan bir uzman yürütür." },
        { q: "YZ Kontrolü neden eğitimler arasında?", a: "Çünkü bir eğitimden önce iyi bir başlangıçtır: 90 dakikada YZ'nin günlük işinizde nerede anlamlı olduğunu netleştiririz. İsterseniz kontrolü, iş akışlarınızın süreç haritası ve 30 günlük planla kaydına genişletiriz; bunun sabit fiyatını önceden yazılı olarak bildiririz." },
        { q: "Çevrimiçi eğitim mümkün mü?", a: "YZ Kontrolünün başlangıç kapsamı uzaktan yapılır. Diğer formatlarda yerinde mi uzaktan mı yapılacağını sizinle birlikte belirleriz." },
      ],
    },
    cta: { h: "Doğru formatı bulun.", p: "Ekibiniz ve hedefiniz hakkında kısaca yazın. Size bir format önerir ve fiyatı bildiririz.", primary: { label: "Eğitim talep edin", href: "/contact" }, secondary: CHECK },
    service: {
      type: "AI training",
      offers: [
        { name: "YZ Kontrolü", price: 490, from: true },
        { name: "YZ Yetkinliği Temel", price: 1490 },
        { name: "Copilot Uygulama Günü", price: 2400, from: true },
      ],
    },
  },

  check: {
    slug: "ai-automation-check",
    meta: {
      title: "YZ Kontrolü: otomasyon nerede karşılığını verir?",
      description:
        "OpSolid'in YZ Kontrolü 490 €'dan itibaren, net: 90 dakika uzaktan, ardından kısa bir yazılı rapor. Geniş kapsamda süreç haritası ve 30 günlük plan. Önceden NDA.",
    },
    crumb: "YZ Kontrolü",
    hero: {
      eyebrow: "YZ Kontrolü · ilk adım",
      h1: ["Otomasyon ", "nerede", " gerçekten karşılığını verir?"],
      lede: "YZ Kontrolü, hangi iş akışlarınızın otomatikleştirilebileceğini, hangilerinin manuel kalmasının daha iyi olduğunu gösterir. Başlangıç kapsamı 490 €'dan itibaren, net: 90 dakika uzaktan ve kısa bir yazılı rapor. Atölye, süreç haritası ve 30 günlük plan içeren geniş kapsam için sabit fiyatı önceden yazılı olarak bildiririz.",
      primary: { label: "YZ Kontrolü talep edin", href: "/contact" },
      secondary: { label: "Adımları görün", href: "#ablauf" },
      spec: [
        ["Başlangıç", "90 dakika uzaktan, kısa yazılı rapor"],
        ["Geniş kapsam", "Atölye, süreç haritası, beş değerlendirilmiş aday, 30 günlük plan"],
        ["NDA", "Analiz görüşmesinden önce"],
        ["Fiyat", "490 €'dan itibaren, net; geniş kapsam için sabit fiyat, önceden yazılı"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Neden bu kontrol",
        h: "Otomasyon çoğu zaman neden tökezler?",
        lede: "Nadiren teknoloji yüzünden. Daha sık olarak yanlış iş akışı otomatikleştirilir ya da ekibin gerçekte ne yaptığı hiç yazıya dökülmemiştir.",
        items: [
          { h: "Neden yerine belirti", p: "Sorunu yaratan değil, göze çarpan otomatikleştirilir." },
          { h: "Senaryosu olmayan araçlar", p: "YZ araçları, ne için kullanılacağı belli olmadan satın alınır." },
          { h: "Başlangıç ölçümü yok", p: "Ölçülmüş bir mevcut durum olmadan fayda kanıtlanamaz." },
          { h: "Belirsiz sınırlar", p: "Hangi adımların bilerek manuel kalacağı belli değildir." },
        ],
      },
      {
        t: "table",
        id: "umfang",
        eyebrow: "Kapsam ve fiyat",
        h: "Küçük başlayın, gerekirse genişletin.",
        lede: "Başlangıç kapsamının fiyatı 490 €'dan başlar. Daha fazlasına ihtiyacınız varsa kapsamı genişletir, bunun sabit fiyatını önceden yazılı olarak bildiririz.",
        caption: "YZ Kontrolü: başlangıç ve geniş kapsam",
        cols: ["Kapsam", "Format", "Fiyat"],
        rows: [
          ["Başlangıç||OpSolid tarafından, işi yapan kişilerle birlikte yürütülür. Sonuç kısa bir yazılı rapordur: Günlük işinizde YZ ve otomasyonun nerede anlamlı olduğu, nerede olmadığı.", "90 dakika uzaktan, raporlu", "490 €'dan itibaren"],
          ["Geniş kapsam||Önemli iş akışlarının kaydı, süreç haritası, efor, fayda ve riske göre değerlendirilmiş beş aday, 30 günlük plan ve 30 dakikalık değerlendirme toplantısı.", "Yerinde veya uzaktan atölye", "Sabit fiyat, önceden yazılı"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
      },
      {
        t: "rows",
        eyebrow: "Kimler için",
        h: "Kontrol kimler için uygun?",
        items: [
          { h: "Küçük ve orta ölçekli işletmeler", p: "Büyük bir platform projesi yerine ölçülebilir bir ilk adım arıyorsunuz." },
          { h: "YZ var, ortak kurallar yok", p: "Ekibiniz YZ'yi zaten kullanıyor, ama ortak kurallar ve yapı olmadan." },
          { h: "Operasyon sorumluları", p: "Çok sayıda manuel devir zaman kaybettiriyor ve hataya yol açıyor." },
          { h: "Satın alma kararı öncesi", p: "Microsoft 365, Power Automate veya Make gibi araçları değerlendiriyor ve önce ne için kullanacağınızı bilmek istiyorsunuz." },
          { h: "Sektör odağı", p: "Hizmet, yeme-içme, perakende ve muayenehaneler (sağlık verisi olmadan). Tesisat ve ısıtma, bina teknik tesisatı, elektrik, inşaat ve toptan ticaret işletmeleri için değil." },
        ],
      },
      {
        t: "steps",
        id: "ablauf",
        eyebrow: "Süreç",
        h: "Dört adım, tek bir sabit fiyat.",
        items: [
          { h: "Ön görüşme", p: "Hedefleri, ilgili iş akışlarını ve kapsamı kısaca netleştiririz. Ardından sabit fiyat belli olur; 490 €'dan itibaren, net." },
          { h: "Analiz görüşmesi", p: "İşi gerçekten yapan kişilerle 90 dakika uzaktan; geniş kapsamda atölye olarak, isterseniz yerinde." },
          { h: "Yazılı sonuç", p: "Kısa bir rapor; geniş kapsamda süreç haritasını ve 30 günlük planı birkaç iş günü içinde alırsınız." },
          { h: "Değerlendirme toplantısı", p: "Geniş kapsamda: plan, efor ve sonraki adımlar üzerine 30 dakika." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Sonuç",
        h: "Sonunda gelen kutunuzda olanlar.",
        items: [
          { h: "Kısa yazılı rapor", tag: "Başlangıç", p: "Günlük işinizde YZ ve otomasyonun nerede anlamlı olduğu, nerede olmadığı." },
          { h: "Süreç haritası", tag: "Geniş kapsam", p: "Görüşülen iş akışları, yazılı olarak." },
          { h: "Beş değerlendirilmiş aday", tag: "Geniş kapsam", p: "Gerçek iş akışlarınızdan; araç önerisi ve kaba efor tahminiyle." },
          { h: "30 günlük plan", tag: "Geniş kapsam", p: "Sorumlular ve sonraki adımlarla." },
          { h: "Manuel kalacaklar", tag: "Geniş kapsam", p: "Hangi adımların bilerek manuel kalması gerektiği ve nedeni." },
        ],
      },
    ],
    faq: {
      h: "YZ Kontrolü hakkında sorular",
      items: [
        { q: "YZ Kontrolünün ücreti nedir?", a: "Başlangıç kapsamı 490 €'dan itibaren: 90 dakika uzaktan ve kısa bir yazılı rapor. Atölye, süreç haritası ve 30 günlük plan içeren geniş kapsam için sabit fiyatı ön görüşmeden sonra, iş başlamadan önce yazılı olarak bildiririz. Tüm fiyatlar net, KDV hariçtir." },
        { q: "Gizlilik sözleşmesi imzalanıyor mu?", a: "Evet, analiz görüşmesinden önce standart bir NDA imzalanır." },
        { q: "Otomatikleştirmeye değer bir şey çıkmazsa ne olur?", a: "O zaman yazılı sonuçta tam olarak bu, gerekçesiyle birlikte yer alır. Bu da bir sonuçtur: Karşılığını vermeyecek bir projeye kaynak ayırmazsınız." },
        { q: "Kontrolden sonra ne olur?", a: "Üç yol vardır: Önerileri kendiniz uygularsınız, birlikte bir pilot hayata geçiririz ya da iş birliği orada sona erer. Herhangi bir taahhüt altına girmezsiniz." },
      ],
    },
    cta: { h: "Neyin gerçekten değdiğini öğrenin.", p: "Bir görüşme, yazılı bir sonuç, taahhüt yok. Zamanlama henüz doğru değilse bunu size söyleriz.", primary: { label: "YZ Kontrolü talep edin", href: "/contact" }, secondary: { label: "Tüm hizmetler", href: "/leistungen" } },
    service: { type: "AI and automation assessment", offers: [{ name: "YZ Kontrolü", price: 490, from: true }] },
  },

  about: {
    slug: "ueber-uns",
    meta: {
      title: "OpSolid hakkında: önce süreç, sonra teknoloji",
      description:
        "OpSolid, küçük ve orta ölçekli işletmeler için YZ asistanları, web siteleri ve otomasyon kurar: ölçülmüş, belgelenmiş, bağımlılık yaratmadan. TopSolid ile karıştırılmamalıdır.",
    },
    crumb: "Hakkımızda",
    hero: {
      eyebrow: "Hakkımızda",
      h1: ["Önce süreç, ", "sonra teknoloji", "."],
      lede: "OpSolid, küçük ve orta ölçekli işletmeler için yapay zekâ asistanları, web siteleri ve otomatik iş akışları kurar. Önce işin bugün nasıl yürüdüğünü anlarız, sonra teknolojinin neyi iyileştireceğine karar veririz.",
      primary: CONTACT,
      secondary: CHECK,
      spec: [
        ["Odak", "YZ asistanları, web siteleri, otomasyon"],
        ["Yöntem", "Analiz, pilot, devreye alma, teslim"],
        ["Kimin için", "Küçük ve orta ölçekli işletmeler"],
        ["Teslim", "Kaynak kod ve dokümantasyon"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Çalışma biçimi",
        h: "Her projede dört ilke.",
        items: [
          { h: "İnsanlardan başlamak", p: "Gerçek iş akışlarınızdan ve bu işleri yapan insanlardan başlarız; günlük işte gerçekten işe yarayanı öneririz. Otomasyonun anlamlı olmadığı yerde bunu söyleriz." },
          { h: "Ölçülmüş başlangıç durumu", p: "Her pilottan önce iş akışının bugün nasıl işlediğini ve ne kadar zaman aldığını kayda geçiririz. Pilottan sonra aynı değerlerle karşılaştırırız." },
          { h: "Baştan itibaren veri koruma", p: "AB'de barındırma ve GDPR gerekliliklerine uygun kurulum; Türkiye ile bağlantılı projelerde KVKK gereklilikleri de gözetilir. Net erişim kuralları sonradan eklenmez, tasarımın parçasıdır." },
          { h: "Bize bağımlı kalmazsınız", p: "Otomasyonlarda ve şirket içi araçlarda kaynak kodu ve dokümantasyonu teslim ederiz; BT ekibiniz veya başka bir hizmet sağlayıcı istediği an devralabilir." },
        ],
      },
      {
        t: "text",
        eyebrow: "Sektörler",
        h: "Hangi işletmelerle çalışıyoruz?",
        paras: ["Sektör odağı: hizmet, yeme-içme, perakende ve muayenehaneler (sağlık verisi olmadan). Tesisat, ısıtma ve sıhhi tesisat (SHK), bina teknik tesisatı (TGA), elektrik, inşaat ve toptan ticaret işletmeleri için çalışmıyoruz."],
      },
      {
        t: "text",
        eyebrow: "Deneyim",
        h: "Yöntemimiz nereden geliyor?",
        lede: "OpSolid'in arkasındaki deneyim, şirketlerin günlük işleyişi içinde yürütülen BT proje yönetimi, dijitalleşme ve süreç iyileştirme çalışmalarından gelir. Yöntemimizin her adımı oradan doğdu: iş akışını kayda almak, başlangıç durumunu ölçmek, küçük bir pilotla denemek, eksiksiz teslim etmek.",
        paras: [
          "Araç setimiz; Outlook, Teams, SharePoint ve Power Automate ile Microsoft 365'i, ayrıca Make, n8n, Python ve özel kodu, CRM ve ERP bağlantılarını ve AB'de barındırmayı kapsar.",
        ],
      },
      {
        t: "rows",
        eyebrow: "Kendi projelerimiz",
        h: "İşimizi gösteren projeler.",
        items: [
          { h: "opsolid.de", tag: "Bu site", p: "OpSolid tarafından tasarlandı, kuruldu ve işletiliyor. Önce metin gelir; arka plan videosu durdurulabilir ve kapatılabilir.", shot: SHOT.opsolid },
          { h: "OpSo", tag: "Test aşamasında ürün", p: "NFC ve QR destekli dijital kartvizit; kendi kontrol paneli, ilk kurulum akışı ve yönetim konsoluyla web uygulaması olarak geliştirildi. Yayına hazırlık sürüyor.", href: "/opso", shot: SHOT.opso },
          { h: "Kutasia", tag: "Geliştirme aşamasında proje", p: "WhatsApp, Telegram ve e-postadan gelen müşteri mesajları tek gelen kutusunda, YZ destekli ön sıralamayla.", href: "https://kutasia.com", shot: SHOT.kutasia },
        ],
      },
      {
        t: "text",
        eyebrow: "Ayrım",
        h: "OpSolid, TopSolid değildir.",
        paras: ["OpSolid, TopSolid (CAD/CAM) ile ilgili değildir ve onunla bağlantısı yoktur."],
      },
    ],
    cta: { h: "Tek bir iş akışıyla başlayın.", p: "İş akışlarınızda çok fazla manuel iş varsa, analizden teslime kadar yanınızdayız.", primary: CHECK, secondary: CONTACT },
  },

  contact: {
    slug: "contact",
    meta: {
      title: "İletişim: iş akışınızı anlatın, YZ Kontrolü talep edin",
      description:
        "OpSolid'e form, e-posta veya telefonla ulaşın: hangi iş akışı, hangi sistemler, bugün ne aksıyor. Genellikle birkaç iş günü içinde yanıt veririz.",
    },
    crumb: "İletişim",
    hero: {
      eyebrow: "İletişim",
      h1: ["Üç cümle ", "yeterli", "."],
      lede: "Hangi iş akışının söz konusu olduğunu, hangi sistemlerin işin içinde olduğunu ve bugün neyin aksadığını yazın. Form, e-posta veya telefonla; genellikle birkaç iş günü içinde yanıt veririz.",
      primary: { label: "Mesaj yazın", href: "#form-h" },
      secondary: CHECK,
    },
    blocks: [],
    cta: { h: "Önce iş akışlarınıza mı bakalım?", p: "YZ Kontrolü, otomasyonun sizde nerede karşılığını vereceğini gösterir: 90 dakika uzaktan, ardından kısa bir yazılı rapor.", primary: CHECK },
  },
};
