import type { PageDef } from "./types";
import type { PageKey } from "./keys";

const CHECK = { label: "YZ kontrolüyle başlayın", href: "/ai-automation-check" };
const CONTACT = { label: "İletişime geçin", href: "/contact" };
/** Required under every price table: net prices are only safe when the offer is visibly limited to businesses. */
const PRICE_NOTE = "Tüm fiyatlar net, KDV hariçtir. Hizmetlerimiz yalnızca işletmelere yöneliktir.";
/** Limited pilot phase: remove once the three free Quick-Checks are used. */
const PILOT_NOTE = "Pilot dönemi: İlk üç YZ Hızlı Kontrol'ü, dürüst geri bildirim karşılığında ücretsiz yapıyoruz.";

const DEMO = {
  chip: "Demo · senaryo, sessiz",
  play: "Senaryoyu oynatın",
  again: "Tekrar oynatın",
  note: "Kurgulanmış bir akıştır, canlı görüşme değildir. Canlı ses demosu, ses sağlayıcısı ve veri koruma incelemesi (KVKK/GDPR) netleştiğinde yayına alınacak.",
  sr: "Örnek görüşme. Arayan: İyi günler, gelecek hafta için randevu almak istiyorum. Asistan: Memnuniyetle. Çarşamba 10:00 mu, perşembe 14:00 mü uygun? Arayan: Perşembe uygun. Asistan: O zaman perşembe 14:00'e kaydediyorum. Onayı e-postayla alacaksınız.",
  script: [
    { who: "Arayan", agent: false, text: "İyi günler, gelecek hafta için randevu almak istiyorum.", ms: 3000 },
    { who: "Asistan", agent: true, text: "Memnuniyetle. Çarşamba 10:00 mu, perşembe 14:00 mü uygun?", ms: 3600 },
    { who: "Arayan", agent: false, text: "Perşembe uygun.", ms: 1400 },
    { who: "Asistan", agent: true, text: "O zaman perşembe 14:00'e kaydediyorum. Onayı e-postayla alacaksınız.", ms: 4200 },
  ],
};

export const tr: Record<PageKey, PageDef> = {
  home: {
    slug: "",
    meta: {
      title: "OpSolid | YZ asistanları, web siteleri ve otomasyon",
      description:
        "KOBİ'ler için yapay zekâ asistanları, web siteleri ve otomasyon: önce ölçüm, sonra kurulum, ardından belgeli teslim. Türkçe, Almanca ve İngilizce.",
    },
    crumb: "Ana sayfa",
    hero: {
      eyebrow: "KOBİ'ler için otomasyon ve yapay zekâ · Arnsberg · TR/DE/EN",
      h1: ["Önce ölçeriz, ", "sonra kurarız", "."],
      lede: "Ekibinizin rutin işlerini üstleniriz: telefonu karşılayan YZ asistanları, kopyala-yapıştır gerektirmeyen iş akışları ve size benzeyen web siteleriyle. Kurmadan önce bir iş akışının bugün neye mal olduğunu ölçer, sonunda her şeyi belgeleyerek ekibinize teslim ederiz.",
      primary: CHECK,
      secondary: { label: "YZ asistanlarını görün", href: "/agents" },
      scene: "stack",
    },
    blocks: [
      {
        t: "demo",
        id: "agents",
        scene: "agents",
        heat: [0],
        eyebrow: "Telefon ve web sitesi için YZ asistanları",
        h: "Ekibiniz çalışırken aramalar karşılanır.",
        lede: "Bir yapay zekâ asistanı (AI agent) talepleri alır, randevuları ayarlar ve işletmeniz hakkında bilgi verir. Ses yalnızca arayüzdür: Asistan arka planda takviminiz, CRM'iniz ve sizin koyduğunuz kurallarla çalışır; bir insan gerektiği anda görüşmeyi ekibinize devreder.",
        ...DEMO,
        cta: { label: "YZ asistanlarını keşfedin", href: "/agents" },
      },
      {
        t: "rows",
        id: "websites",
        scene: "websites",
        heat: [1],
        eyebrow: "Web siteleri · satın alma veya kiralama",
        h: "Şablondan değil, size göre tasarlanır.",
        lede: "Hızlı açılan, kolay okunan ve birden çok dilde çalışan web siteleri tasarlar, kurar ve işletiriz. Fiyatı ilk görüşmeden sonra yazılı olarak bildiririz.",
        items: [
          { h: "opsolid.de", tag: "Bu site", p: "OpSolid tarafından tasarlandı, kuruldu ve işletiliyor: üç dil, önce metin; 3D sahne metinden sonra yüklenir ve kapatılabilir.", href: "https://opsolid.de" },
          { h: "Satın alma", p: "Tek seferlik proje bedeli. Tamamlanan site sizin olur ve onu kendiniz yönetirsiniz." },
          { h: "Kiralama", p: "Tek seferlik yatırım yerine düzenli bir ücret. İşletim ve bakımı biz üstleniriz." },
        ],
        cta: { label: "Web sitelerini inceleyin", href: "/websites" },
      },
      {
        t: "rows",
        id: "automatisierung",
        scene: "flow",
        heat: [2, 3, 4],
        eyebrow: "Süreç otomasyonu ve Microsoft 365",
        h: "Kopyala-yapıştır olmadan iş akışları.",
        lede: "Bugün e-posta, Excel, CRM ve ERP arasında elle taşınan işleri otomatikleştiririz. Yalnızca bir insanın verebileceği kararlar ekibinizde kalır.",
        items: [
          { h: "Süreç otomasyonu", p: "Teklif, rapor ve veri eşitleme her hafta yeniden elle yapılmaz; bir kez kurulur, düzenli işler.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Teams'te onaylar, SharePoint'ten belgeler, Outlook'tan e-postalar doğrudan doğru sisteme; çoğu zaman yeni abonelik gerekmeden.", href: "/microsoft-365-automatisierung" },
          { h: "Şirket içi araçlar", p: "Birkaç kişinin birlikte güncellediği Excel listesi, yetkileri ve geçmişi olan bir araca dönüşür.", href: "/interne-tools" },
          { h: "YZ danışmanlığı", p: "YZ'nin işletmenizde nerede karşılığını verdiği, nerede vermediği yazılı olarak değerlendirilir.", href: "/ki-beratung" },
        ],
      },
      {
        t: "rows",
        eyebrow: "Neden OpSolid",
        h: "İşletmenizde neler değişir?",
        lede: "Daha az rutin iş, daha az hata, daha hızlı yanıt. Bunlar vaatte kalmasın diye her pilottan önce iş akışının bugünkü maliyetini ölçeriz: işlem başına süre, baştan sona geçen süre ve hatalar. Pilottan sonra aynı ölçümü tekrarlarız.",
        items: [
          { h: "Daha az rutin iş", p: "Kopyala-yapıştır, çift veri girişi ve haftalık rapor otomatik işler. Ekibiniz müşterilere ve kararlara daha çok zaman ayırır." },
          { h: "Daha az hata", p: "Veri bir kez girilir ve doğru aktarılır. Her iş akışında kayıt, hata yönetimi ve gerektiğinde elle devam etme imkânı bulunur." },
          { h: "Daha hızlı yanıt", p: "Talepler ön sıralanır, yanıtlanır ya da doğrudan ilgili kişiye yönlendirilir." },
          { h: "Herkesin okuyabildiği süreçler", p: "İş akışını otomatikleştirmeden önce yazıya dökeriz. Sonrasında kimin neyi ne zaman yaptığı görünür olur; bilgi tek bir kişiye bağlı kalmaz." },
          { h: "Bize bağımlı kalmazsınız", p: "Otomasyonlarda ve şirket içi araçlarda kaynak kodu ve dokümantasyonu teslim ederiz; BT ekibiniz veya başka bir hizmet sağlayıcı istediği an devralabilir." },
          { h: "Türkçe, Almanca ve İngilizce", p: "Atölyeler, dokümantasyon ve eğitimler ekibinizin dilinde; Türkiye'deki, Almanya'daki ve Avrupa'daki işletmeler için." },
        ],
      },
      {
        t: "spec",
        id: "ki-check",
        scene: "steps",
        heat: [5, 6],
        eyebrow: "İlk adım: YZ kontrolü",
        h: "Bütçeden önce bir plan.",
        lede: "YZ kontrolü, hangi iş akışlarınızın otomasyona uygun olduğunu, hangilerinin olmadığını gösterir. 60–90 dakikada bu akışları işi yapan kişilerle birlikte gözden geçiririz. Ardından beş değerlendirilmiş aday içeren 30 günlük yazılı bir plan alırsınız.",
        rows: [
          ["Kapsam", "60–90 dakika, yerinde veya uzaktan"],
          ["Sonuç", "Süreç haritası, beş değerlendirilmiş aday, 30 günlük plan"],
          ["NDA", "Analiz görüşmesinden önce"],
          ["Fiyat", "Sabit fiyat; ön görüşmeden sonra netleşir"],
        ],
        cta: { label: "YZ kontrolünü ayrıntılı görün", href: "/ai-automation-check" },
      },
      {
        t: "table",
        eyebrow: "Başlangıç ve eğitimler",
        h: "Sabit formatlar, net fiyatlar.",
        caption: "YZ Hızlı Kontrol ve YZ eğitimlerine genel bakış",
        cols: ["Hizmet", "Format", "Fiyat"],
        rows: [
          ["YZ Hızlı Kontrol", "90 dakika uzaktan, kısa yazılı rapor", "490 €'dan itibaren"],
          ["YZ Yetkinliği Temel", "Yarım gün, en fazla 15 kişi", "1.490 €"],
          ["Copilot Uygulama Günü", "1 gün, en fazla 12 kişi", "2.400 €'dan itibaren"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE}`,
        cta: { label: "Formatları karşılaştırın", href: "/ki-schulungen" },
      },
      {
        t: "rows",
        id: "produkte",
        scene: "cards",
        eyebrow: "Kendi projelerimiz",
        h: "Kendi kurduğumuz projeler.",
        lede: "OpSolid kendi uygulamalarını da geliştirir. Bu projeler nasıl çalıştığımızı gösterir: tasarım, teknoloji ve veri koruma aynı projede, hizmet sağlayıcılar arasında devir teslim olmadan.",
        items: [
          { h: "OpSo", tag: "Test aşamasında ürün", p: "NFC ve QR destekli dijital kartvizit: tek bağlantı, her zaman güncel, karşı tarafın uygulama indirmesi gerekmez. Kontrol paneli, ilk kurulum akışı ve yönetim konsolu OpSolid tarafından geliştirildi; yayına hazırlık sürüyor.", href: "/opso" },
          { h: "Kutasia", tag: "Geliştirme aşamasında proje", p: "WhatsApp, Telegram ve e-postadan gelen müşteri mesajları tek gelen kutusunda; mesajları yapay zekâ önceden sıralar.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "text",
        id: "ueber-mich",
        scene: "offset",
        eyebrow: "OpSolid hakkında",
        h: "Şirket içi BT projelerinin deneyimiyle.",
        lede: "OpSolid, Arnsberg'de Hasan Dönmez tarafından kuruldu. Arkasındaki deneyim, şirketlerdeki BT proje yönetimi, dijitalleşme ve süreç iyileştirme çalışmalarından gelir. Sıramız bu yüzden sabittir: önce süreç, sonra teknoloji.",
        paras: ["OpSolid, TopSolid (CAD/CAM) ile ilgili değildir ve onunla bağlantısı yoktur."],
        cta: { label: "OpSolid'i tanıyın", href: "/ueber-mich" },
      },
    ],
    faq: {
      h: "Sık sorulan sorular",
      items: [
        { q: "Muhatabımız kim olacak?", a: "Analizden işletime kadar OpSolid'de sabit bir muhatabınız olur. YZ Yetkinliği Temel eğitimini ise bizim seçtiğimiz ve adını size önceden bildirdiğimiz serbest çalışan bir uzman yürütür." },
        { q: "Ekibimizin ne kadar zaman ayırması gerekir?", a: "YZ kontrolü için: kısa bir ön görüşme, işi yapan kişilerle 60–90 dakikalık analiz ve planı konuşmak için 30 dakika." },
        { q: "Önceden gizlilik sözleşmesi imzalanıyor mu?", a: "Evet. Analiz görüşmesinden önce standart bir NDA imzalanır." },
        { q: "Mevcut sistemlerimizi koruyabilir miyiz?", a: "Evet. Microsoft 365, Google Workspace, CRM'iniz veya ERP'niz iş akışını taşıyorsa onların üzerine kurarız." },
        { q: "Hangi dillerde çalışıyorsunuz?", a: "Türkçe, Almanca ve İngilizce. Arnsberg'den ve uzaktan; Avrupa genelindeki ve Türkiye'deki işletmelerle çalışıyoruz." },
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
        "OpSolid'in yapay zekâ asistanları (AI agent) talepleri alır, randevuları ayarlar ve ekibinize devreder. Canlıya geçmeden önce veri koruma incelenir.",
    },
    crumb: "YZ asistanları",
    hero: {
      eyebrow: "YZ asistanları · telefon ve web sitesi",
      h1: ["Telefon çalıyor, ", "YZ asistanı", " açıyor."],
      lede: "Bir yapay zekâ asistanı (AI agent) talepleri alır, randevuları ayarlar ve işletmenizle ilgili soruları kendi belgelerinize dayanarak yanıtlar. Muhakeme gerektiren konuları ekibinize devreder. Böylece daha az arama cevapsız kalır, ekibiniz daha az bölünür.",
      primary: CHECK,
      secondary: { label: "Senaryoyu izleyin", href: "#demo" },
      scene: "agents",
      heat: [0],
      spec: [
        ["Formatlar", "Sesli: telefonda ve web sitesinde; 3D figürlü video"],
        ["Görevler", "Talepler, randevular, bilgi, devretme"],
        ["Durum", "Senaryo demosu; canlı demo hazırlanıyor"],
      ],
    },
    blocks: [
      {
        t: "demo",
        id: "demo",
        scene: "agents",
        heat: [0],
        h: "Bir arama böyle ilerler.",
        lede: "İlk cümleden onaya kadar bir randevu talebi: Asistan uygun saatleri önerir, randevuyu kaydeder ve e-postayla onay gönderir. Bir insan gerektiği anda görüşmeyi ekibinize devreder.",
        ...DEMO,
      },
      {
        scene: "flow",
        heat: [0],
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
        scene: "steps",
        heat: [0],
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
        { q: "Asistan bugün canlı konuşabiliyor mu?", a: "Şu anda canlandırılmış bir senaryo gösteriyoruz. Canlı ses demosu, ses sağlayıcısı ve veri koruma incelemesi netleştiğinde gelecek." },
        { q: "Görüşmeleri kim dinleyebilir?", a: "Bunu önceden sizinle birlikte belirleriz: sağlayıcı, saklama yeri, saklama süresi ve erişim. Arayanlara en başta bir YZ sistemiyle konuştukları bildirilir." },
        { q: "Asistan ekibimizin yerini alır mı?", a: "Hayır. Rutin işleri üstlenir ve bir kişi gerektiği anda görüşmeyi devreder." },
        { q: "Video formatında asistan da var mı?", a: "Evet. Telefonda ve web sitesinde sesli çalışan asistanların yanı sıra, örneğin web siteniz veya resepsiyonunuz için 3D figürlü video asistanlar da kuruyoruz. Canlı demo, veri koruma incelemesinden sonra gelecek." },
        { q: "Nasıl başlarız?", a: "YZ kontrolüyle. Bir asistanın işletmeniz için anlamlı olup olmadığını ve hangi görevleri üstlenmesi gerektiğini orada birlikte netleştiririz." },
      ],
    },
    cta: { h: "Asistan size uygun mu, birlikte bakalım.", p: "YZ kontrolünde, hiçbir şey kurulmadan önce görevleri, sınırları ve veri korumayı netleştiririz.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI voice agents" },
  },

  websites: {
    slug: "websites",
    meta: {
      title: "Web sitesi tasarımı: satın alma veya kiralama",
      description:
        "OpSolid, işletmenize benzeyen web siteleri tasarlar, kurar ve işletir: hızlı, çok dilli ve kolay bulunur. Satın alma veya kiralama seçeneğiyle.",
    },
    crumb: "Web siteleri",
    hero: {
      eyebrow: "Web siteleri · satın alma veya kiralama",
      h1: ["", "Size benzeyen", " web siteleri."],
      lede: "OpSolid; hızlı açılan, kolay okunan ve birden çok dilde çalışan web siteleri tasarlar ve kurar. Satın alma: tek seferlik proje bedeli, site sizin olur. Kiralama: düzenli bir ücret; işletim ve bakımı biz üstleniriz. Fiyatı ilk görüşmeden sonra yazılı olarak bildiririz.",
      primary: CONTACT,
      secondary: { label: "Örnek çalışmaları inceleyin", href: "#referenzen" },
      scene: "websites",
      heat: [1],
      spec: [
        ["Modeller", "Satın alma veya kiralama"],
        ["Diller", "Türkçe, Almanca, İngilizce mümkün"],
        ["Fiyat", "İlk görüşmeden sonra yazılı olarak"],
      ],
    },
    blocks: [
      {
        scene: "stack",
        heat: [1],
        t: "rows",
        eyebrow: "Hizmet",
        h: "Her web sitesinde neler var?",
        items: [
          { h: "Tasarım", p: "Yeni logo takılmış bir şablon yerine işletmenize uyan tipografi, renk ve hareket." },
          { h: "Kurulum", p: "Önce metin, hızlı yükleme, erişilebilirlik; arama motorları ve YZ aramaları için temiz bir yapı." },
          { h: "Çok dillilik", p: "Her dil için ayrı adres ve arama motorları için doğru işaretleme; isterseniz Türkçe, Almanca ve İngilizce." },
          { h: "Satın alma veya kiralama", p: "Siteyi kendiniz sürdürmek istiyorsanız satın alma, teknik hiçbir şeyle uğraşmak istemiyorsanız kiralama mantıklıdır." },
        ],
      },
      {
        t: "rows",
        id: "referenzen",
        scene: "websites",
        heat: [1],
        eyebrow: "Örnek çalışmalar",
        h: "Kendimiz tasarladık, kendimiz kurduk.",
        lede: "Bu projeleri OpSolid, tasarımdan teknolojiye kadar kendisi kurguladı ve geliştirdi. Bağlantılar sizi doğrudan projelere götürür; kendiniz inceleyebilirsiniz.",
        items: [
          { h: "opsolid.de", tag: "Bu site", p: "Üç dil, önce metin; 3D sahne metinden sonra yüklenir ve kapatılabilir.", href: "https://opsolid.de" },
          { h: "OpSo", tag: "Test aşamasında ürün", p: "Web uygulaması olarak dijital kartvizit: profil, QR kod ve NFC bağlantısı. Yayına hazırlık sürüyor.", href: "https://card.opsolid.de" },
          { h: "Kutasia", tag: "Geliştirme aşamasında proje", p: "WhatsApp, Telegram ve e-posta için tek gelen kutusu; mesajları yapay zekâ önceden sıralar.", href: "https://kutasia.com" },
        ],
      },
      {
        scene: "steps",
        heat: [1],
        t: "steps",
        eyebrow: "Süreç",
        h: "İlk görüşmeden yayındaki siteye.",
        items: [
          { h: "Görüşme", p: "Hedefi, hedef kitleyi, içerikleri ve dilleri netleştiririz. Ardından kapsamı ve fiyatı yazılı olarak bildiririz." },
          { h: "Taslak", p: "En önemli sayfaların yapısı ve tasarımı, geri bildiriminize göre şekillenir." },
          { h: "Kurulum", p: "Metin, görsel ve formlarla uygulama; telefonda ve masaüstünde test edilir." },
          { h: "Yayın ve işletim", p: "Yayına alma, alan adı, veri koruma bileşenleri ve isterseniz düzenli bakım." },
        ],
      },
    ],
    faq: {
      h: "Web siteleri hakkında sorular",
      items: [
        { q: "Satın almak mı, kiralamak mı daha iyi?", a: "Siteyi kendiniz veya BT ekibinizle sürdürmek istiyorsanız satın alın: Bir kez ödersiniz, site sizindir. Teknikle uğraşmak istemiyorsanız kiralayın: Düzenli ödersiniz, işletim ve bakımı biz üstleniriz." },
        { q: "Bir web sitesi projesi ne kadar sürer?", a: "Kapsama bağlıdır. İlk görüşmeden sonra somut bir zaman planı alırsınız." },
        { q: "Metinler ve görseller kime ait?", a: "Sizin sağladığınız içerikler sizin kalır. Tasarım ve kodun kullanım haklarını önceden yazılı olarak belirleriz." },
        { q: "Sitede 3D ve hareket olabilir mi?", a: "Evet, ek olarak. Metin her zaman önce gelir; efektler kapatılabilir ve azaltılmış hareket ayarına uyar." },
      ],
    },
    cta: { h: "Web siteniz ne başarmalı?", p: "Sitenin kimin için olduğunu ve neyi başarması gerektiğini iki üç cümleyle yazın. Genellikle birkaç iş günü içinde yanıt veririz.", primary: { label: "Web sitesi talep edin", href: "/contact" } },
    service: { type: "Website design, development and rental" },
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
      lede: "Her hizmet belirli bir sorunu çözer: cevapsız kalan aramalar, artık işletmenize uymayan bir web sitesi, sistemler arasında elle taşınan veriler. YZ kontrolü, nereden başlamanın en çok karşılık vereceğini gösterir.",
      primary: CHECK,
      scene: "stack",
      heat: [0, 1, 2, 3, 4, 5, 6],
    },
    blocks: [
      {
        scene: "offset",
        t: "rows",
        eyebrow: "Tüm hizmetler",
        h: "Hangi hizmet hangi sorunu çözer?",
        items: [
          { h: "YZ asistanları", tag: "Telefon · web sitesi", p: "Aramalar ve talepler yanıtsız kalıyorsa: Asistan onları karşılar, randevuları ayarlar ve ekibinize devreder.", href: "/agents" },
          { h: "Web siteleri", tag: "Satın alma · kiralama", p: "Web siteniz artık işletmenize uymuyorsa: tasarlarız, kurarız ve isterseniz işletiriz.", href: "/websites" },
          { h: "Süreç otomasyonu", p: "Aynı veriler iki kez giriliyorsa: teklifler, raporlar ve veri eşitleme otomatik işler.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Lisanslar ödeniyor ama pek kullanılmıyorsa: onayları, belgeleri ve e-posta kurallarını otomatikleştiririz.", href: "/microsoft-365-automatisierung" },
          { h: "Şirket içi araçlar", p: "Bir tablo darboğaza dönüştüyse: yetkileri, geçmişi ve tam ihtiyacınız olan alanları olan bir araç.", href: "/interne-tools" },
          { h: "YZ danışmanlığı", p: "YZ'nin nerede karşılığını verdiği belirsizse: üç ila beş kullanım senaryosu, yazılı değerlendirme ve yol haritası.", href: "/ki-beratung" },
          { h: "YZ eğitimleri", tag: "Ekip", p: "Ekibiniz YZ'yi ortak kurallar olmadan kullanıyorsa: sabit kapsamlı ve net fiyatlı üç format.", href: "/ki-schulungen" },
        ],
      },
      {
        scene: "steps",
        t: "steps",
        eyebrow: "Yöntem",
        h: "Nereden başlarsanız başlayın, yol aynı.",
        items: [
          { h: "Analiz", p: "YZ kontrolünde iş akışlarınızı kayda alır ve bugünkü maliyetlerini ölçeriz." },
          { h: "Pilot", p: "Etkisi büyük tek bir iş akışı; sabit kapsam ve sabit zaman çerçevesiyle." },
          { h: "Devreye alma", p: "Pilotta işe yarayan çözüm yaygınlaştırılır ve belgelenir." },
          { h: "Teslim", p: "Çözümü ekibiniz kendisi işletir; isterseniz değişiklikler için küçük bir destek çerçevesiyle yanınızda oluruz." },
        ],
      },
    ],
    cta: { h: "Nereden başlamalı?", p: "YZ kontrolünde iş akışlarınızı birlikte sıralar, ilk önce karşılığını verecek yapı taşını seçeriz.", primary: CHECK, secondary: CONTACT },
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
      scene: "steps",
      heat: [5],
      spec: [
        ["Sonuç", "Senaryo değerlendirmesi, yol haritası, YZ politikası"],
        ["Süre", "Hedef çerçeve: iki ila dört hafta"],
        ["Yaklaşım", "Bağımsız, YZ aracı satışı yok"],
      ],
    },
    blocks: [
      {
        scene: "stack",
        heat: [5],
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
        scene: "flow",
        heat: [5],
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
        { q: "YZ danışmanlığı ile YZ kontrolü arasındaki fark nedir?", a: "YZ kontrolü, iş akışlarınızda YZ'li veya YZ'siz otomasyon adaylarını arar. YZ danışmanlığı daha ileri gider: somut YZ uygulamalarını değerlendirir, 6 ila 12 aylık bir yol haritası belirler ve işletmeniz için bir YZ politikası hazırlar." },
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
      scene: "flow",
      heat: [2],
      spec: [
        ["Başlangıç", "Etkisi büyük tek bir iş akışı, sabit kapsam"],
        ["Pilot", "Hedef çerçeve: iki ila dört hafta"],
        ["Temel", "Mevcut araçlarınız"],
      ],
    },
    blocks: [
      {
        scene: "stack",
        heat: [2],
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
        scene: "steps",
        heat: [2],
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
      scene: "flow",
      heat: [3],
      spec: [
        ["Başlangıç", "Tenant'ınızın incelenmesi"],
        ["Pilot", "İlk akış, hedef çerçeve iki hafta"],
        ["Temel", "Yeterli olduğunda standart lisanslar"],
      ],
    },
    blocks: [
      {
        scene: "stack",
        heat: [3],
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
        items: ["Power Automate", "Power Apps", "SharePoint Online", "Teams, bot'lar, onaylar", "Outlook, Exchange", "Microsoft Graph API", "Microsoft 365 Copilot", "Entra ID"],
      },
      {
        scene: "steps",
        heat: [3],
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
        { q: "Power Automate Premium lisansına ihtiyacımız var mı?", a: "Bazen. İşe yarayan birçok akış standart planlarla çalışır. Premium'un ne zaman gerektiğini size önceden söyleriz." },
        { q: "Microsoft 365 Copilot'a değer mi?", a: "Bazı ekipler için evet, bazıları için hayır. Bunu siz lisans satın almadan önce netleştiririz." },
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
      scene: "cards",
      heat: [4],
      spec: [
        ["Pilot", "Hedef çerçeve: üç ila altı hafta"],
        ["Teslim", "Kaynak kod ve dokümantasyon"],
        ["Barındırma", "AB'de, isterseniz sizin altyapınızda"],
      ],
    },
    blocks: [
      {
        scene: "flow",
        heat: [4],
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
        scene: "steps",
        heat: [4],
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
        "YZ Hızlı Kontrol 490 €'dan itibaren, YZ Yetkinliği Temel 1.490 €, Copilot Uygulama Günü 2.400 €'dan itibaren (KDV hariç). Türkçe, Almanca veya İngilizce.",
    },
    crumb: "YZ eğitimleri",
    hero: {
      eyebrow: "YZ eğitimleri · AB YZ Tüzüğü, Madde 4",
      h1: ["Üç format, ", "net fiyatlar", "."],
      lede: "AB'de faaliyet gösteren ve YZ kullanan işletmeler, 2 Şubat 2025'ten bu yana AB Yapay Zekâ Tüzüğü'nün 4. maddesi gereği çalışanlarının YZ yetkinliği için önlem almak zorunda. Üç formatımızın kapsamı sabit, fiyatı nettir; slaytlar yerine kendi işleriniz üzerinde çalışılır.",
      primary: { label: "Eğitim talep edin", href: "/contact" },
      secondary: CHECK,
      scene: "steps",
      heat: [6],
    },
    blocks: [
      {
        t: "table",
        id: "angebote",
        eyebrow: "Formatlar ve fiyatlar",
        h: "Ekibinize hangi format uyar?",
        caption: "YZ Hızlı Kontrol ve YZ eğitimlerine genel bakış",
        cols: ["Hizmet", "Format", "Fiyat"],
        rows: [
          ["YZ Hızlı Kontrol||Kompakt başlangıç: Günlük işinizde YZ'nin nerede anlamlı olduğunu, nerede olmadığını birlikte inceleriz. OpSolid tarafından yürütülür; sonuç kısa bir yazılı rapordur.", "90 dakika uzaktan, raporlu", "490 €'dan itibaren"],
          ["YZ Yetkinliği Temel||İş hayatında YZ'yi güvenle kullanmanın temelleri. OpSolid'in seçtiği ve adını size önceden bildirdiği serbest çalışan bir uzman yürütür. AB YZ Tüzüğü'nün 4. maddesi kapsamındaki YZ yetkinliği önlemlerinizi destekler.", "Yarım gün, en fazla 15 kişi", "1.490 €"],
          ["Copilot Uygulama Günü||Kendi işleriniz üzerinde Microsoft 365 Copilot ile uygulamalı çalışma. Copilot lisansı zaten bulunan işletmeler için.", "1 gün, en fazla 12 kişi", "2.400 €'dan itibaren"],
        ],
        note: `${PRICE_NOTE} ${PILOT_NOTE} Diller: Türkçe, Almanca ve İngilizce.`,
      },
      {
        scene: "stack",
        heat: [6],
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
        { q: "Eğitimi kim yürütür?", a: "YZ Hızlı Kontrol'ü OpSolid kendisi yürütür. YZ Yetkinliği Temel'i ise OpSolid'in seçtiği ve adını size önceden bildirdiği serbest çalışan bir uzman yürütür." },
        { q: "YZ Hızlı Kontrol neden eğitimler arasında?", a: "Çünkü bir eğitimden önce iyi bir başlangıçtır: 90 dakikada YZ'nin günlük işinizde nerede anlamlı olduğunu netleştiririz. İş akışlarınızın süreç haritası ve 30 günlük planla eksiksiz kaydını ise YZ kontrolü sunar." },
        { q: "Çevrimiçi eğitim mümkün mü?", a: "YZ Hızlı Kontrol uzaktan yapılır. Diğer formatlarda yerinde mi uzaktan mı yapılacağını sizinle birlikte belirleriz." },
      ],
    },
    cta: { h: "Doğru formatı bulun.", p: "Ekibiniz ve hedefiniz hakkında kısaca yazın. Size bir format önerir ve fiyatı bildiririz.", primary: { label: "Eğitim talep edin", href: "/contact" }, secondary: CHECK },
    service: {
      type: "AI training",
      offers: [
        { name: "YZ Hızlı Kontrol", price: 490, from: true },
        { name: "YZ Yetkinliği Temel", price: 1490 },
        { name: "Copilot Uygulama Günü", price: 2400, from: true },
      ],
    },
  },

  check: {
    slug: "ai-automation-check",
    meta: {
      title: "YZ kontrolü: 30 günlük planla otomasyon potansiyeli",
      description:
        "OpSolid'in YZ kontrolü: iş akışlarınızın 60–90 dakikalık analizi, ardından beş değerlendirilmiş aday içeren 30 günlük yazılı plan. Sabit fiyat, önceden NDA.",
    },
    crumb: "YZ kontrolü",
    hero: {
      eyebrow: "YZ kontrolü · ilk adım",
      h1: ["Otomasyon ", "nerede", " gerçekten değer?"],
      lede: "YZ kontrolü, hangi iş akışlarınızın otomatikleştirilebileceğini, hangilerinin manuel kalmasının daha iyi olduğunu gösterir: 60–90 dakikalık bir analiz görüşmesi ve efor, fayda ve riske göre değerlendirilmiş beş aday içeren 30 günlük yazılı bir plan.",
      primary: { label: "YZ kontrolü talep edin", href: "/contact" },
      secondary: { label: "Adımları görün", href: "#ablauf" },
      scene: "steps",
      heat: [5],
      spec: [
        ["Kapsam", "60–90 dakika, yerinde veya uzaktan"],
        ["Sonuç", "Süreç haritası, beş değerlendirilmiş aday, 30 günlük plan"],
        ["NDA", "Analiz görüşmesinden önce"],
        ["Fiyat", "Sabit fiyat; ön görüşmeden sonra netleşir"],
      ],
    },
    blocks: [
      {
        scene: "stack",
        heat: [2, 3, 4],
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
        t: "rows",
        eyebrow: "Neler dahil",
        h: "Kontrolde neler var?",
        items: [
          { h: "Analiz görüşmesi, 60–90 dakika", p: "Yerinde veya uzaktan, işi yapan kişilerle. İşin ekibinizde nasıl aktığını dinleriz." },
          { h: "Önemli iş akışlarının kaydı", p: "İş akışları, ekibinizin birlikte kontrol edebileceği şekilde yazıya dökülür." },
          { h: "Beş somut aday", p: "Gerçek iş akışlarınızdan çıkar; genel bir YZ dilek listesi değildir." },
          { h: "Efor, fayda ve riske göre değerlendirme", p: "Yönetim teknik bilgi gerektirmeden önceliklendirebilsin diye." },
          { h: "30 günlük plan", p: "Sonraki adımlar, araçlar, sorumlular ve beklenen sonuç." },
          { h: "İsteğe bağlı: ilk pilot", p: "Anlamlı olduğunda ilk otomasyonu sabit kapsam ve süreyle hayata geçiririz." },
        ],
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
        ],
      },
      {
        scene: "flow",
        heat: [5],
        t: "steps",
        id: "ablauf",
        eyebrow: "Süreç",
        h: "Dört adım, tek bir sabit fiyat.",
        items: [
          { h: "Ön görüşme", p: "Hedefleri ve ilgili iş akışlarını kısaca netleştiririz. Ardından sabit fiyat belli olur." },
          { h: "Analiz görüşmesi", p: "İşi gerçekten yapan kişilerle 60–90 dakika." },
          { h: "Yazılı plan", p: "Birkaç iş günü içinde süreç haritasını ve 30 günlük planı alırsınız." },
          { h: "Değerlendirme toplantısı", p: "Kapsam, efor ve sonraki adımlar üzerine 30 dakika." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Sonuç",
        h: "Sonunda gelen kutunuzda olanlar.",
        items: [
          { h: "Süreç haritası", p: "Görüşülen iş akışları, yazılı olarak." },
          { h: "Beş değerlendirilmiş aday", p: "Araç önerisi ve kaba efor tahminiyle." },
          { h: "30 günlük plan", p: "Sorumlular ve sonraki adımlarla." },
          { h: "Manuel kalacaklar notu", p: "Neyin bilerek manuel kalması gerektiği ve nedeni." },
        ],
      },
    ],
    faq: {
      h: "YZ kontrolü hakkında sorular",
      items: [
        { q: "YZ kontrolünün ücreti nedir?", a: "Sabit fiyatı ön görüşmeden sonra bildiririz; kapsama ve ekip büyüklüğüne bağlıdır. Tüm fiyatlar net, KDV hariçtir." },
        { q: "YZ kontrolü ile YZ Hızlı Kontrol arasındaki fark nedir?", a: "YZ kontrolü, yerinde veya uzaktan iş akışlarınızı kayda alır; süreç haritası, beş değerlendirilmiş aday ve 30 günlük plan sunar. YZ Hızlı Kontrol ise kısa bir yazılı raporla biten, 90 dakikalık uzaktan bir görüşmedir; 490 €'dan itibaren, KDV hariç." },
        { q: "Gizlilik sözleşmesi imzalanıyor mu?", a: "Evet, analiz görüşmesinden önce standart bir NDA imzalanır." },
        { q: "Otomatikleştirmeye değer bir şey çıkmazsa ne olur?", a: "O zaman planda tam olarak bu, gerekçesiyle birlikte yazar. Bu da bir sonuçtur: Karşılığını vermeyecek bir projeye kaynak ayırmazsınız." },
        { q: "Kontrolden sonra ne olur?", a: "Üç yol vardır: Planı kendiniz uygularsınız, birlikte bir pilot hayata geçiririz ya da iş birliği orada sona erer. Herhangi bir taahhüt altına girmezsiniz." },
      ],
    },
    cta: { h: "Neyin gerçekten değdiğini öğrenin.", p: "Bir görüşme, yazılı bir plan, taahhüt yok. Zamanlama henüz doğru değilse bunu size söyleriz.", primary: { label: "YZ kontrolü talep edin", href: "/contact" }, secondary: { label: "Tüm hizmetler", href: "/leistungen" } },
    service: { type: "AI and automation assessment" },
  },

  about: {
    slug: "ueber-mich",
    meta: {
      title: "OpSolid hakkında: Arnsberg'den otomasyon ve YZ",
      description:
        "OpSolid, KOBİ'ler için YZ asistanları, web siteleri ve otomasyon geliştirir; Hasan Dönmez tarafından Arnsberg'de kuruldu. TopSolid ile karıştırılmamalıdır.",
    },
    crumb: "Hakkımızda",
    hero: {
      eyebrow: "Hakkımızda",
      h1: ["Önce süreç, ", "sonra teknoloji", "."],
      lede: "OpSolid, küçük ve orta ölçekli işletmeler için yapay zekâ asistanları, web siteleri ve otomatik iş akışları kurar. Önce işin bugün nasıl yürüdüğünü anlarız, sonra teknolojinin neyi iyileştireceğine karar veririz.",
      primary: CONTACT,
      secondary: CHECK,
      scene: "offset",
      spec: [
        ["Odak", "YZ asistanları, web siteleri, otomasyon"],
        ["Yöntem", "Analiz, pilot, devreye alma, teslim"],
        ["Merkez", "Arnsberg, Almanya"],
        ["Diller", "Türkçe, Almanca, İngilizce"],
      ],
    },
    blocks: [
      {
        scene: "stack",
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
        eyebrow: "Kurucu ve deneyim",
        h: "Yöntemimiz nereden geliyor?",
        lede: "OpSolid'i Hasan Dönmez kurdu. Deneyimi, şirketlerin günlük işleyişi içinde yürüttüğü BT proje yönetimi, dijitalleşme ve süreç iyileştirme çalışmalarından gelir. Yöntemimizin her adımı oradan doğdu: iş akışını kayda almak, başlangıç durumunu ölçmek, küçük bir pilotla denemek, eksiksiz teslim etmek.",
        paras: [
          "Araç setimiz; Outlook, Teams, SharePoint ve Power Automate ile Microsoft 365'i, ayrıca Make, n8n, Python ve özel kodu, CRM ve ERP bağlantılarını ve AB'de barındırmayı kapsar.",
          "Arnsberg'den ve uzaktan; Avrupa genelindeki ve Türkiye'deki işletmelerle Türkçe, Almanca ve İngilizce çalışıyoruz. Atölyeler ve dokümantasyon, ekibinizin çalıştığı dilde hazırlanır.",
        ],
        cta: { label: "LinkedIn'de Hasan Dönmez", href: "https://www.linkedin.com/in/hasanhd/" },
      },
      {
        scene: "cards",
        heat: [1],
        t: "rows",
        eyebrow: "Kendi projelerimiz",
        h: "İşimizi gösteren projeler.",
        items: [
          { h: "OpSo", tag: "Test aşamasında ürün", p: "NFC ve QR destekli dijital kartvizit; kendi kontrol paneli, ilk kurulum akışı ve yönetim konsoluyla web uygulaması olarak geliştirildi. Yayına hazırlık sürüyor.", href: "/opso" },
          { h: "Kutasia", tag: "Geliştirme aşamasında proje", p: "WhatsApp, Telegram ve e-postadan gelen müşteri mesajları tek gelen kutusunda, YZ destekli ön sıralamayla.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "text",
        eyebrow: "Ayrım",
        h: "OpSolid, TopSolid değildir.",
        paras: ["OpSolid, TopSolid (CAD/CAM) ile ilgili değildir ve onunla bağlantısı yoktur. Arnsberg'deki OpSolid'i arıyorsanız doğru yerdesiniz."],
      },
    ],
    cta: { h: "Tek bir iş akışıyla başlayın.", p: "İş akışlarınızda çok fazla manuel iş varsa, analizden teslime kadar yanınızdayız.", primary: CHECK, secondary: CONTACT },
  },

  contact: {
    slug: "contact",
    meta: {
      title: "İletişim: iş akışınızı anlatın, YZ kontrolü talep edin",
      description:
        "OpSolid'e form, e-posta veya telefonla ulaşın: hangi iş akışı, hangi sistemler, bugün ne aksıyor. Genellikle birkaç iş günü içinde yanıt veririz.",
    },
    crumb: "İletişim",
    hero: {
      eyebrow: "İletişim",
      h1: ["Üç cümle ", "yeterli", "."],
      lede: "Hangi iş akışının söz konusu olduğunu, hangi sistemlerin işin içinde olduğunu ve bugün neyin aksadığını yazın. Form, e-posta veya telefonla; genellikle birkaç iş günü içinde yanıt veririz.",
      primary: { label: "Önce YZ kontrolünü inceleyin", href: "/ai-automation-check" },
      scene: "tight",
    },
    blocks: [],
    cta: { h: "Önce iş akışlarınıza mı bakalım?", p: "YZ kontrolü iş akışlarınızı kayda alır ve beş değerlendirilmiş aday içeren 30 günlük yazılı bir plan sunar.", primary: CHECK },
  },
};
