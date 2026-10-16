import type { PageDef } from "./types";
import type { PageKey } from "./keys";

const CHECK = { label: "YZ kontrolü ayarla", href: "/ai-automation-check" };
const CONTACT = { label: "İletişime geç", href: "/contact" };

const DEMO = {
  chip: "Demo · senaryo, sessiz",
  play: "Senaryoyu oynat",
  again: "Tekrar oynat",
  note: "Oynatılan bir senaryo, canlı görüşme değil. Canlı ses demosu, ses sağlayıcısı ve veri koruma incelemesi (KVKK/GDPR) netleşince gelecek.",
  sr: "Örnek görüşme. Arayan: İyi günler, gelecek hafta için randevu almak istiyorum. Agent: Memnuniyetle. Çarşamba 10:00 mu, perşembe 14:00 mü uygun? Arayan: Perşembe uygun. Agent: O zaman perşembe 14:00'e kaydediyorum. E-posta ile onay alacaksınız.",
  script: [
    { who: "Arayan", agent: false, text: "İyi günler, gelecek hafta için randevu almak istiyorum.", ms: 3000 },
    { who: "Agent", agent: true, text: "Memnuniyetle. Çarşamba 10:00 mu, perşembe 14:00 mü uygun?", ms: 3600 },
    { who: "Arayan", agent: false, text: "Perşembe uygun.", ms: 1400 },
    { who: "Agent", agent: true, text: "O zaman perşembe 14:00'e kaydediyorum. E-posta ile onay alacaksınız.", ms: 4200 },
  ],
};

export const tr: Record<PageKey, PageDef> = {
  home: {
    slug: "",
    meta: {
      title: "OpSolid | Arnsberg'den YZ agent'ları, web siteleri ve otomasyon",
      description:
        "Konuşan YZ agent'ları, web siteleri, süreç otomasyonu ve YZ eğitimleri için bağımsız bir pratik. Kendim planlar, kurar ve işletirim. Arnsberg, Almanya.",
    },
    crumb: "Ana sayfa",
    hero: {
      eyebrow: "OpSolid · YZ agent'ları, web siteleri ve otomasyon pratiği · Arnsberg",
      h1: ["Gerçekten ", "çalışan", " sistemler."],
      lede: "Küçük ve orta ölçekli işletmeler için konuşan YZ agent'ları, web siteleri ve iş akışları kurarım; bugün kullanımda olan kendi ürünlerimi de işletirim.",
      primary: CHECK,
      secondary: { label: "Agent'lara bak", href: "/agents" },
      scene: "stack",
    },
    blocks: [
      {
        t: "demo",
        id: "agents",
        scene: "agents",
        heat: [0],
        eyebrow: "Ses ve video agent'ları",
        h: "Konuşan ve dinleyen agent'lar.",
        lede: "Talepler, randevu ayarlama ve işletmenize dair sorular için ses ve video agent'ları kurarım. Yüz yalnızca arayüzdür, arkasında sizin süreciniz çalışır.",
        ...DEMO,
        cta: { label: "Agent'lar hakkında", href: "/agents" },
      },
      {
        t: "rows",
        id: "websites",
        scene: "websites",
        heat: [1],
        eyebrow: "Satın alınan veya kiralanan web siteleri",
        h: "Tasarladığım, kurduğum ve kiraladığım web siteleri.",
        lede: "Kendine has bir yüzü olan web sitesi, satın alma veya kiralama ile. Koşulları görüşmede netleştiririz.",
        items: [
          { h: "opsolid.de", tag: "Bu site", p: "Benim tasarladığım, kurduğum ve işlettiğim site: üç dil, önce metin, 3D yalnızca ek olarak.", href: "https://opsolid.de" },
          { h: "OpSo", tag: "Ürün", p: "NFC ve QR ile dijital kartvizit, kendi web uygulaması olarak kuruldu.", href: "https://card.opsolid.de" },
          { h: "Kutasia", tag: "Canlı demo", p: "WhatsApp, Telegram ve e-posta tek gelen kutusunda, YZ ön sıralamasıyla.", href: "https://kutasia.com" },
        ],
        cta: { label: "Web siteleri hakkında", href: "/websites" },
      },
      {
        t: "rows",
        id: "automatisierung",
        scene: "flow",
        heat: [2, 3, 4],
        eyebrow: "Süreç otomasyonu ve Microsoft 365",
        h: "Kendiliğinden çalışan iş akışları.",
        lede: "Formları, tabloları ve kopyala-yapıştır işlerini raya oturturum. Yalnızca bir insanın karar verebileceği şey ekibinizde kalır.",
        items: [
          { h: "Süreç otomasyonu", p: "Tekrarlayan adımlar yeniden iş çıkmadan akar.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Outlook, Teams ve SharePoint; CRM, ERP ve yardım masanızla bağlı.", href: "/microsoft-365-automatisierung" },
          { h: "Dahili araçlar", p: "Ortak kullanılan tablo, amaca yönelik bir araca dönüşür.", href: "/interne-tools" },
          { h: "YZ danışmanlığı", p: "YZ'nin işletmenizde nerede karşılığını verdiği, nerede vermediği.", href: "/ki-beratung" },
        ],
      },
      {
        t: "spec",
        id: "ki-check",
        scene: "steps",
        heat: [5, 6],
        eyebrow: "YZ kontrolü ve YZ eğitimleri",
        h: "Önce netleştir, sonra kur.",
        lede: "YZ kontrolünde 60–90 dakika iş akışlarınızı birlikte inceleriz. Ardından beş değerlendirilmiş adaylı, yazılı bir 30 günlük plan alırsınız.",
        rows: [
          ["Kapsam", "60–90 dakika, yerinde veya uzaktan"],
          ["Sonuç", "Süreç haritası, 5 değerlendirilmiş fırsat, 30 günlük plan"],
          ["Fiyat", "Talep üzerine, ön görüşmeden sonra sabit"],
        ],
        cta: { label: "YZ kontrolü ayarla", href: "/ai-automation-check" },
      },
      {
        t: "table",
        h: "Üç sabit eğitim teklifi.",
        caption: "Parça listesi: YZ eğitimleri",
        cols: ["Teklif", "Format", "Fiyat"],
        rows: [
          ["YZ Hızlı Kontrol", "90 dakika uzaktan, yazılı rapor", "490 €'dan"],
          ["YZ Yetkinliği Temel", "Yarım gün, 15 kişiye kadar", "1.490 €"],
          ["Copilot Uygulama Günü", "1 gün, 12 kişiye kadar", "2.400 €'dan"],
        ],
        cta: { label: "Tüm eğitimler", href: "/ki-schulungen" },
      },
      {
        t: "rows",
        id: "produkte",
        scene: "cards",
        eyebrow: "Kendi ürünlerim",
        h: "Kendim işlettiğim iki ürün.",
        lede: "İkisi de çalışıyor ve ikisi de nasıl çalıştığımı gösteriyor.",
        items: [
          { h: "OpSo", tag: "Ürün", p: "NFC ve QR ile dijital kartvizit: tek bağlantı, her zaman güncel, alıcı için uygulama gerekmez.", href: "/opso" },
          { h: "Kutasia", tag: "Canlı demo", p: "WhatsApp, Telegram ve e-postadan müşteri iletişimi tek gelen kutusunda.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "text",
        id: "ueber-mich",
        scene: "offset",
        eyebrow: "Hakkımda",
        h: "Hasan Dönmez, Arnsberg.",
        lede: "Tek başıma çalışırım, her zaman benimle konuşursunuz. Önce süreç, sonra teknoloji. Otomasyonun anlamlı olmadığı yerde bunu söylerim.",
        paras: ["OpSolid, TopSolid (CAD/CAM) ile ilgili değildir ve onunla bağlantısı yoktur."],
        cta: { label: "Hakkımda daha fazla", href: "/ueber-mich" },
      },
    ],
    faq: {
      h: "Sık sorulan sorular",
      items: [
        { q: "Projemde kim çalışır?", a: "Ben, Hasan Dönmez, bizzat. OpSolid tek kişilik bir pratiktir. Bir eğitim için serbest eğitmen çağırırsam, o kişiyi önceden kendim seçer ve size söylerim." },
        { q: "Önceden gizlilik sözleşmesi yapılır mı?", a: "Evet. Analiz görüşmesinden önce standart bir NDA imzalanır." },
        { q: "Şimdiden YZ kullanıyor olmam gerekir mi?", a: "Hayır. Birçok proje hiç YZ olmadan başlar." },
        { q: "Mevcut araçlarımı tutabilir miyim?", a: "Evet. Microsoft 365, Google Workspace, CRM veya ERP'niz süreci taşıyorsa önce onları kullanırım." },
      ],
    },
    cta: { h: "Ön görüşme ayarlayın veya doğrudan yazın.", p: "Genellikle birkaç iş günü içinde yanıtlarım.", primary: CHECK, secondary: CONTACT },
  },

  agents: {
    slug: "agents",
    meta: {
      title: "Ses ve video ile YZ agent'ları",
      description:
        "Talepler, randevu ayarlama ve sorular için konuşan YZ agent'ları: ses veya 3D figür olarak. Hasan Dönmez tarafından kurulur, canlıya geçmeden önce veri koruma incelemesi yapılır.",
    },
    crumb: "Agent'lar",
    hero: {
      eyebrow: "Agent'lar · ses ve video",
      h1: ["Konuşan", " ve dinleyen", " agent'lar."],
      lede: "Bir agent talepleri alır, randevu ayarlar ve işletmenize dair soruları yanıtlar; ses olarak veya videoda 3D figür olarak. Arkasında kendi süreciniz çalışır.",
      primary: CHECK,
      secondary: { label: "Senaryoya bak", href: "#demo" },
      scene: "agents",
      heat: [0],
      spec: [
        ["Formatlar", "Ses ve 3D figürlü video"],
        ["Görevler", "Talepler, randevular, bilgi verme"],
        ["Durum", "Senaryo demosu, canlı demo gelecek"],
      ],
    },
    blocks: [
      {
        t: "demo",
        id: "demo",
        scene: "agents",
        heat: [0],
        h: "Bir arama böyle duyulur.",
        lede: "Dalga formlu ve hareketli ağızlı oynatılan bir senaryo. Agent ne yaptığını söyler ve bir insan gerekince devreder.",
        ...DEMO,
      },
      {
        t: "rows",
        eyebrow: "Görevler",
        h: "Bir agent sizin için ne üstlenir.",
        lede: "Tekrar eden ve net kurallara uyan rutin. Muhakeme gerektiren her şey ekibinize gider.",
        items: [
          { h: "Talepleri almak", p: "Telefonda veya video sohbette soruları alıp yapılandırılmış biçimde ekibinize iletir." },
          { h: "Randevu ayarlamak", p: "Boş zaman önerir, randevuyu kaydeder, onay gönderir." },
          { h: "Bilgi vermek", p: "Hizmetleri, süreçleri ve saatleri kendi belgelerinizden açıklar." },
          { h: "İnsana devretmek", p: "Şikayet, özel durum ve belirsizlikte görüşme bir kişiye geçer." },
        ],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Bir agent nasıl ortaya çıkar.",
        items: [
          { h: "Netleştirme", p: "Görevleri, sınırları ve tonu belirlemek. Agent neye karar verebilir, neye veremez?" },
          { h: "Kurma", p: "Diyaloğu, sesi veya figürü tasarlayıp takvime, CRM'e veya posta kutusuna bağlamak." },
          { h: "Veri korumayı incelemek", p: "Canlıya geçmeden önce sağlayıcıyı, saklama yerini, saklama süresini ve bir YZ sisteminin konuştuğu bilgisini belirlemek." },
          { h: "Test ve işletim", p: "Görüşmeleri incelemek, iyileştirmek ve agent'ı günlük kullanımda desteklemek." },
        ],
      },
    ],
    faq: {
      h: "Agent'lar hakkında sorular",
      items: [
        { q: "Agent bugün canlı konuşuyor mu?", a: "Bugün oynatılan bir senaryo gösteriyorum. Canlı ses demosu, ses sağlayıcısı ve veri koruma incelemesi netleşince gelecek." },
        { q: "Görüşmeleri kim dinler?", a: "Bunu önceden belirleriz: sağlayıcı, saklama yeri, saklama süresi ve erişim. Arayanlara başta bir YZ sisteminin konuştuğu söylenir." },
        { q: "Agent ekibimin yerini alır mı?", a: "Hayır. Rutini üstlenir ve bir kişi gerekir gerekmez devreder." },
        { q: "Nasıl başlarım?", a: "YZ kontrolüyle. Orada bir agent'ın işletmeniz için anlamlı olup olmadığını ve hangi görevleri üstlenmesi gerektiğini netleştiririz." },
      ],
    },
    cta: { h: "Bir agent'ın size uyup uymadığını kontrol edin.", p: "YZ kontrolünde, bir şey kurulmadan önce görevleri, sınırları ve veri korumayı netleştiririz.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI voice and video agents" },
  },

  websites: {
    slug: "websites",
    meta: {
      title: "Web siteleri: tasarım, kurulum ve kiralama",
      description:
        "Kendine has web siteleri, satın alma veya kiralama ile. Tasarım, kurulum ve işletim tek elden. Yalnızca Hasan Dönmez'in kendi kurduğu siteler gösterilir.",
    },
    crumb: "Web siteleri",
    hero: {
      eyebrow: "Web siteleri · satın alma veya kiralama",
      h1: ["Tasarladığım, kurduğum", " ve kiraladığım", " web siteleri."],
      lede: "Kendine has bir yüzü olan web sitesi: hızlı, kolay okunur ve birden çok dilde. Satın alırsınız ya da kiralarsınız. Koşulları görüşmede netleştiririz.",
      primary: CONTACT,
      secondary: { label: "Referanslara bak", href: "#referenzen" },
      scene: "websites",
      heat: [1],
      spec: [
        ["Modeller", "Satın alma veya kiralama"],
        ["Diller", "Almanca, İngilizce, Türkçe mümkün"],
        ["Fiyat", "Kapsama göre, görüşmede"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Ne alırsınız",
        h: "Ne alırsınız.",
        items: [
          { h: "Tasarım", p: "Şablon yerine kendi el yazısı: tipografi, renk ve hareket işletmenize uyar." },
          { h: "Kurulum", p: "Önce metin, hızlı yükleme, erişilebilir; arama motorları ve YZ aramasına uygun temiz yapı." },
          { h: "Çok dillilik", p: "Kendi adresleri olan birden çok dil ve arama için temiz işaretleme." },
          { h: "Satın alma veya kiralama", p: "Satın alma: bitmiş siteyi alırsınız. Kiralama: sürekli kullanırsınız, işletimle ben ilgilenirim. Koşulları birlikte belirleriz." },
        ],
      },
      {
        t: "rows",
        id: "referenzen",
        scene: "websites",
        heat: [1],
        eyebrow: "Referanslar",
        h: "Kendi kurduğum siteler.",
        lede: "Burada yalnızca kendim kurduğum ve işlettiğim site ve ürünleri gösteriyorum. Müşteri siteleri, olunca eklenecek.",
        items: [
          { h: "opsolid.de", tag: "Bu site", p: "Üç dil, önce metin, kapatılabilen bir 3D sahne ek olarak.", href: "https://opsolid.de" },
          { h: "OpSo", tag: "Ürün", p: "Web uygulaması olarak dijital kartvizit: profil, QR ve NFC bağlantısı.", href: "https://card.opsolid.de" },
          { h: "Kutasia", tag: "Canlı demo", p: "WhatsApp, Telegram ve e-posta için YZ ön sıralamalı gelen kutusu.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Görüşmeden hazır siteye.",
        items: [
          { h: "Görüşme", p: "Hedef, hedef kitle, içerik ve dilleri netleştirmek. Ardından kapsamı ve fiyatı söylerim." },
          { h: "Taslak", p: "Önemli sayfaların yapısı ve tasarımı, sizin geri bildiriminizle." },
          { h: "Kurulum", p: "Metin, görsel ve formlarla uygulama; telefon ve masaüstünde test edilmiş." },
          { h: "Yayın ve işletim", p: "Yayınlama, alan adı, veri koruma bileşenleri ve isterseniz sürekli bakım." },
        ],
      },
    ],
    faq: {
      h: "Web siteleri hakkında sorular",
      items: [
        { q: "Satın alma mı, kiralama mı daha iyi?", a: "Siteyi kendiniz sürdürmek isteyip istemediğinize bağlı. Satın alırsanız sizindir, kiralarsanız işletimle ben ilgilenirim. Bunu görüşmede netleştiririz." },
        { q: "Bir web sitesi ne kadar sürer?", a: "Kapsama bağlı. Görüşmeden sonra somut bir takvim söylerim." },
        { q: "Metin ve görseller kimin?", a: "Sizin verdiğiniz içerik sizin kalır. Tasarım ve kod kullanım haklarını önceden yazılı olarak belirleriz." },
        { q: "Site 3D ve hareket içerebilir mi?", a: "Evet, ek olarak. Metin her zaman önce gelir, efektler kapatılabilir ve az hareket ayarına uyar." },
      ],
    },
    cta: { h: "Web sitenizi konuşalım.", p: "Sitenin ne yapması gerektiğini kısaca yazın. Genellikle birkaç iş günü içinde yanıtlarım.", primary: CONTACT },
    service: { type: "Website design, development and rental" },
  },

  leistungen: {
    slug: "leistungen",
    meta: {
      title: "Hizmetler: agent'lar, web siteleri, otomasyon, YZ",
      description:
        "Tek pratikten yedi hizmet: YZ agent'ları, web siteleri, süreç otomasyonu, Microsoft 365, dahili araçlar, YZ danışmanlığı ve YZ eğitimleri.",
    },
    crumb: "Hizmetler",
    hero: {
      eyebrow: "Hizmetler",
      h1: ["Yedi alan, ", "tek pratik", "."],
      lede: "Tek tek parçaları veya bütün kurulumu üstlenirim. YZ kontrolü nereden başlanacağını gösterir.",
      primary: CHECK,
      scene: "stack",
      heat: [0, 1, 2, 3, 4, 5, 6],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Tüm hizmetler",
        h: "Yığındaki her plaka bir tekliftir.",
        dim: true,
        items: [
          { h: "Agent'lar", tag: "Ses · video", p: "Talepler, randevular ve bilgi için konuşan YZ agent'ları.", href: "/agents" },
          { h: "Web siteleri", tag: "Kurulum · kiralama", p: "Tasarlanır, kurulur ve isteğe bağlı kiralanır.", href: "/websites" },
          { h: "Süreç otomasyonu", p: "Kendiliğinden çalışan iş akışları.", href: "/prozessautomatisierung" },
          { h: "Microsoft 365", p: "Outlook, Teams ve SharePoint iş sistemlerinizle bağlı.", href: "/microsoft-365-automatisierung" },
          { h: "Dahili araçlar", p: "Tabloyu küçük, amaca yönelik bir araçla değiştirmek.", href: "/interne-tools" },
          { h: "YZ danışmanlığı", p: "YZ'nin nerede karşılığını verdiği, nerede vermediği.", href: "/ki-beratung" },
          { h: "YZ eğitimleri", tag: "Ekip", p: "Sabit fiyatlı üç sabit teklif.", href: "/ki-schulungen" },
        ],
      },
    ],
    cta: { h: "Nereden başlayacağınızdan emin değil misiniz?", p: "YZ kontrolünde iş akışlarınızı sıralar, önce karşılığını verecek parçayı seçeriz.", primary: CHECK, secondary: CONTACT },
  },

  kiBeratung: {
    slug: "ki-beratung",
    meta: {
      title: "KOBİ'ler için YZ danışmanlığı: kullanım senaryoları, risk, yol haritası",
      description:
        "Küçük ve orta ölçekli işletmeler için YZ danışmanlığı: değerli kullanım senaryolarını bulmak, fayda ve riski tartmak, yazılı yol haritası ve KVKK/GDPR uyumlu kurulum.",
    },
    crumb: "YZ danışmanlığı",
    hero: {
      eyebrow: "YZ danışmanlığı",
      h1: ["Hangi YZ işletmenize ", "gerçekten değer", " katar?"],
      lede: "İşletmenize uyan üç ila beş YZ kullanım senaryosu bulur, fayda, emek ve riski değerlendirir ve sonucu yol haritası olarak yazılı hale getiririm.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "steps",
      heat: [5],
      spec: [
        ["Sonuç", "Senaryo değerlendirmesi ve yazılı yol haritası"],
        ["Süre", "Genellikle iki ila dört hafta"],
        ["Duruş", "Bağımsız, YZ aracı satmam"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Ne yaparım",
        h: "YZ danışmanlığı nasıl görünür.",
        items: [
          { h: "Senaryoları bulmak", p: "İşletmenize uyan üç ila beş uygulamayı bulmak, uymayanları açıkça dışarıda bırakmak." },
          { h: "Değerlendirmek", p: "Her senaryoyu beklenen fayda, emek ve işletme riskine göre sıralamak." },
          { h: "Yol haritasını yazmak", p: "Sorumluları, maliyetleri ve karar noktalarıyla 6 ila 12 aylık bir yol haritası." },
          { h: "Veri korumayı kurmak", p: "KVKK/GDPR uyumlu kullanıma hazırlık: model seçimi, veri egemenliği ve kısa bir şirket politikası." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Kullanım alanları",
        h: "Tipik uygulamalar.",
        lede: "Bunlar tipik örnekler, müşteri projeleri değil.",
        items: [
          { h: "Belge ve sözleşme analizi", p: "Uzun PDF'leri ön sıralamak, madde ve süreleri görünür kılmak. Özeti bir insan kontrol eder." },
          { h: "Dahili bilgi arama", p: "Politikaları, SSS'leri ve SharePoint'i aranabilir yapmak; yanıtlar kendi belgelerinizden gelir." },
          { h: "Teklif taslakları", p: "Şablon, CRM kaydı ve kısa bir brifingden teklif taslağı çıkarmak. Satış kontrol eder ve onaylar." },
          { h: "Destek ön sıralaması", p: "Gelen talepleri bir kişi ilgilenmeden önce konu ve aciliyete göre sıralamak." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Araçlar",
        h: "Modeller, sağlayıcılar ve yapı taşları.",
        items: ["OpenAI", "Anthropic Claude", "Microsoft Copilot, Azure OpenAI", "Mistral ve açık kaynak modeller", "Retrieval-augmented generation", "pgvector, Qdrant", "AB barındırma"],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Bir YZ danışmanlığı nasıl işler.",
        items: [
          { h: "Keşif", p: "Ekip, veri ve hedefler üzerine kısa bir görüşme." },
          { h: "Senaryo değerlendirmesi", p: "Atölye ve yazılı analiz: hangi uygulamalar karşılığını verir, hangileri vermez." },
          { h: "Yol haritası ve politika", p: "Karar vermeye hazır bir yol haritası ve işletmeniz için kısa yazılı bir YZ politikası." },
        ],
      },
    ],
    faq: {
      h: "YZ danışmanlığı hakkında sorular",
      items: [
        { q: "İşletmemin şimdiden „YZ'ye hazır“ olması gerekir mi?", a: "Hayır. Danışmanlık tam da araçlara para harcanmadan önce değer katar." },
        { q: "YZ araçları satıyor musunuz?", a: "Hayır. Bağımsızım ve uyanı öneririm. Bu, „elinizdekini kullanın“ veya „şimdilik beklemeyin“ de olabilir." },
        { q: "YZ KVKK/GDPR uyumlu kullanılabilir mi?", a: "Evet; doğru model seçimi, AB barındırma ve yazılı bir politikayla. Bunu en baştan birlikte kurarım." },
        { q: "Danışmanlık ne kadar sürer?", a: "Analiz ve yol haritası için genellikle iki ila dört hafta. Uygulama süreleri ayrıdır ve kapsama bağlıdır." },
      ],
    },
    cta: { h: "Hangi YZ'nin karşılığını verdiğini öğrenin.", p: "Bir görüşme, yazılı bir yol haritası, platform satışı yok.", primary: CHECK, secondary: CONTACT },
    service: { type: "AI consulting" },
  },

  prozess: {
    slug: "prozessautomatisierung",
    meta: {
      title: "KOBİ'ler için süreç otomasyonu",
      description:
        "Manuel iş akışlarını otomatikleştirmek: teklifler, belgeler, e-posta yönlendirme, raporlar ve veri eşitleme. Zaten ödediğiniz araçlar üzerinde. KVKK/GDPR bilinciyle.",
    },
    crumb: "Süreç otomasyonu",
    hero: {
      eyebrow: "Süreç otomasyonu",
      h1: ["Artık ", "kimsenin elle yapmaması gereken", " işler."],
      lede: "Yarım gün süren teklifler. Her pazartesi yeniden kurulan raporlar. Excel, CRM ve e-posta arasında dolaşan veriler. İş akışını haritalar, değeceğini otomatikleştiririm.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "flow",
      heat: [2],
      spec: [
        ["Başlangıç", "Büyük kaldıraçlı tek iş akışı, sabit kapsam"],
        ["Süre", "Pilot genellikle iki ila dört haftada"],
        ["Temel", "Mevcut araçlarınız"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Ne yaparım",
        h: "Süreç otomasyonu nasıl görünür.",
        items: [
          { h: "İş akışını haritalamak", p: "Devirleri, araçları, verileri ve istisnaları ekibinizin kontrol edebileceği netlikte yazmak." },
          { h: "Seçmek", p: "Hangi adımların otomatikleştirilebileceğini, hangilerinin bilerek manuel kalması gerektiğini netleştirmek." },
          { h: "Kurmak", p: "Power Automate, Make, n8n, Python veya özel kodla, ne uygunsa." },
          { h: "Devretmek", p: "İzleme, dokümantasyon ve devir; ekibiniz akışı sonrasında kendisi işletsin." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Kullanım alanları",
        h: "Tipik iş akışları.",
        lede: "Tipik örnekler, müşteri projeleri değil.",
        items: [
          { h: "Teklifler ve belgeler", p: "Şablonları CRM verisinden doldurmak, akışta onaylamak ve göndermek." },
          { h: "E-posta sıralama", p: "Gelen postayı konuya göre etiketleyip doğru gelen kutusuna veya bilete yönlendirmek." },
          { h: "Raporlar ve Excel", p: "Tekrarlayan analizleri bir kez kurup otomatik yeniden üretmek." },
          { h: "CRM ve ERP eşitleme", p: "Veriyi bir kez girip sistemler arasında çift girişsiz eşitlemek." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Araçlar",
        h: "Neyle otomatikleştiririm.",
        items: ["Microsoft Power Automate", "Make", "n8n, kendi sunucunda", "Zapier, uygun yerde", "Python", "REST API'ler ve webhook'lar", "PostgreSQL ve kuyruklar"],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Bir otomasyon projesi nasıl işler.",
        items: [
          { h: "Haritalama", p: "İşi yapan ekiple atölye. İş akışını gerçekte işlediği gibi yazarım." },
          { h: "Kurma", p: "İlk pilot otomasyon, genellikle iki ila dört hafta içinde." },
          { h: "İşletim", p: "Dokümantasyon, devir ve kısa bir iyileştirme dönemi." },
        ],
      },
    ],
    faq: {
      h: "Süreç otomasyonu hakkında sorular",
      items: [
        { q: "Tipik bir ilk proje nedir?", a: "Büyük kaldıraçlı tek bir iş akışı; örneğin teklif hazırlama, e-posta sıralama veya haftalık rapor. Sabit kapsam, iki ila dört hafta." },
        { q: "Araçlarımı değiştirmem gerekir mi?", a: "Hayır. Elinizdekinin üzerinde otomatikleştiririm: Microsoft 365, Google Workspace, CRM'iniz, ERP'niz." },
        { q: "İş akışı sonradan değişirse?", a: "BT'niz ayarları kendisi yapabilsin diye dokümante ederim. Daha büyük değişiklikler için isteğe bağlı küçük bir aylık çerçeve var." },
        { q: "Kritik iş akışlarını otomatikleştirmek güvenli mi?", a: "Evet; kayıt, hata yönetimi ve manuel geri dönüşle. İdeal durumu değil, hata durumunu da planlarım." },
      ],
    },
    cta: { h: "Değecek ilk iş akışını seçin.", p: "Haritalarım, değerlendiririm ve emeğe değip değmediğini söylerim.", primary: CHECK, secondary: CONTACT },
    service: { type: "Business process automation" },
  },

  m365: {
    slug: "microsoft-365-automatisierung",
    meta: {
      title: "Microsoft 365 otomasyonu: Power Automate, SharePoint, Teams",
      description:
        "Microsoft 365'te iş akışlarını otomatikleştirmek: Power Automate, SharePoint, Teams onayları ve Outlook yönlendirme; AB'de barındırılan, gizliliğe duyarlı.",
    },
    crumb: "Microsoft 365",
    hero: {
      eyebrow: "Microsoft 365",
      h1: ["Microsoft 365 zaten orada. ", "Şimdi sizin için", " çalışsın."],
      lede: "Teams, SharePoint, Outlook ve Power Automate zaten ödenmiş durumda. Doğru kurulumla birçok ek aboneliğin yerini alır ve verileri tek yerde tutar.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "flow",
      heat: [3],
      spec: [
        ["Başlangıç", "Tenant incelemesi"],
        ["Pilot", "İlk akış genellikle iki haftada"],
        ["Temel", "Yeterli olduğunda standart lisanslar"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Ne yaparım",
        h: "Microsoft 365 otomasyonu nasıl görünür.",
        items: [
          { h: "Tenant'ı incelemek", p: "Lisanslara, kurulum ve araçlara bakıp ekibinizin henüz kullanmadığı otomasyonları bulmak." },
          { h: "Akışları kurmak", p: "Onaylar, belgeler, e-posta yönlendirme ve bildirimler için Power Automate." },
          { h: "Bağlamak", p: "SharePoint, Teams, Outlook ve Excel'i veriler tek yerde dursun diye birbirine bağlamak." },
          { h: "Copilot'u düzenlemek", p: "Microsoft 365 Copilot'u role dayalı erişim ve net kurallarla kurmak." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Kullanım alanları",
        h: "Microsoft 365'te tipik iş akışları.",
        lede: "Tipik örnekler, müşteri projeleri değil.",
        items: [
          { h: "Teams'te onaylar", p: "İzin, masraf, belgeler: Teams'te onayla, SharePoint'te kaydet." },
          { h: "SharePoint listelerinden belgeler", p: "Teklif, sözleşme ve raporları bir listeden üretmek; Excel'den kopyala-yapıştır yok." },
          { h: "Outlook ayrıştırma ve yönlendirme", p: "Siparişleri, talepleri veya faturaları otomatik okuyup doğru sisteme aktarmak." },
          { h: "Copilot kullanıma alma", p: "Copilot güvenle kullanılsın diye kurallar, roller ve kısa bir eğitim." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Araçlar",
        h: "Neyle çalışırım.",
        items: ["Power Automate", "Power Apps", "SharePoint Online", "Teams, bot'lar, onaylar", "Outlook, Exchange", "Microsoft Graph API", "Microsoft 365 Copilot", "Entra ID"],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Bir Microsoft 365 projesi nasıl işler.",
        items: [
          { h: "Tenant incelemesi", p: "Lisanslara, güvenlik kurulumuna ve araçlara bakıp az kullanılanı bulmak." },
          { h: "İlk akış", p: "Pilot olarak bir Power Automate akışı veya Teams iş akışı, genellikle iki haftada." },
          { h: "Yaygınlaştırma", p: "Dokümantasyon, devir ve BT'niz için isteğe bağlı eğitimle daha geniş kullanım." },
        ],
      },
    ],
    faq: {
      h: "Microsoft 365 hakkında sorular",
      items: [
        { q: "Power Automate Premium lisansına ihtiyacım var mı?", a: "Bazen. Çoğu işe yarar akış standart planlarla çalışır. Premium'un ne zaman gerektiğini söylerim." },
        { q: "Microsoft 365 Copilot'a değer mi?", a: "Bazı ekipler için evet, bazıları için hayır. Lisans almadan önce bunu netleştiririz." },
        { q: "BT'mizle birlikte çalışabilir misiniz?", a: "Evet. Çoğu proje BT'nizle veya Microsoft ortağınızla birlikte yürür. Tamamlarım, yerine geçmem." },
        { q: "Bu KVKK/GDPR uyumlu mu?", a: "AB tenant'ındaki Microsoft 365 KVKK/GDPR uyumlu işletilebilir. Temiz yapılandırır ve veri akışlarını dokümante ederim." },
      ],
    },
    cta: { h: "Microsoft 365'ten daha fazlasını alın.", p: "Bir abonelik daha almadan önce tenant'ınızda neyi otomatikleştirmeye değeceğini söylerim.", primary: CHECK, secondary: CONTACT },
    service: { type: "Microsoft 365 automation" },
  },

  interneTools: {
    slug: "interne-tools",
    meta: {
      title: "Dahili araçlar: yönetim panelleri, dashboard'lar, onay kuyrukları",
      description:
        "KOBİ'ler için küçük, odaklı dahili araçlar: yönetim konsolları, dashboard'lar, onay kuyrukları ve bilgi tabanları; AB'de barındırılan.",
    },
    crumb: "Dahili araçlar",
    hero: {
      eyebrow: "Dahili araçlar",
      h1: ["Hazır yazılım uymadığında, ", "küçük bir araç", " sorunu çözer."],
      lede: "Her dahili iş, ayda 500 euroluk bir platforma ihtiyaç duymaz. Çoğu zaman amaca yönelik küçük bir araç sorunu daha iyi, daha ucuz ve daha hızlı çözer.",
      primary: CHECK,
      secondary: CONTACT,
      scene: "cards",
      heat: [4],
      spec: [
        ["Pilot", "Üç ila altı haftada"],
        ["Devir", "Kaynak kod ve dokümantasyon"],
        ["Barındırma", "AB, istenirse sizde"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Ne kurarım",
        h: "Günlük operasyon için araçlar.",
        items: [
          { h: "Yönetim konsolları", p: "Operasyon ekibiniz için net ve odaklı, gereksiz yük olmadan." },
          { h: "Dashboard'lar", p: "Veri kaynaklarınızdan metrikler, istisnalar ve uyarılar tek görünümde." },
          { h: "Onay kuyrukları ve formlar", p: "Gerçek iş akışınıza uyan onaylar ve yükseltmeler." },
          { h: "Bilgi tabanları", p: "Kendi belgeleriniz, politikalarınız ve SSS'leriniz üzerinde arama." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Kullanım alanları",
        h: "Tipik araçlar.",
        lede: "Tipik örnekler, müşteri projeleri değil.",
        items: [
          { h: "Operasyon konsolu", p: "Sipariş özeti, istisnalar ve müşteri notları üç sekme yerine tek yerde." },
          { h: "KPI dashboard'u", p: "CRM, ERP ve finans sisteminden günlük, haftalık, aylık rakamlar; el işi yok." },
          { h: "Onay kuyruğu", p: "Teklifleri, sözleşmeleri veya iadeleri kuyruğa alıp yönlendirmek ve geçmişle onaylamak." },
          { h: "YZ bilgi tabanı", p: "Kendi belgelerinizde arama. Yanıtlar kuruluşunuzda kalır." },
        ],
      },
      {
        t: "tags",
        eyebrow: "Teknoloji",
        h: "Neyle kurarım.",
        items: ["Next.js, React, TypeScript", "Node.js, Python", "PostgreSQL", "REST, GraphQL, webhook'lar", "Microsoft Entra ID, SSO", "AB barındırma", "GitHub, CI/CD, denetim kayıtları"],
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Bir dahili araç projesi nasıl işler.",
        items: [
          { h: "Şartname", p: "Kısa bir atölye: aracın neyi yapması gerektiği ve neyi yapmaması gerektiği." },
          { h: "Kurma", p: "Gerçek kullanıcılar ve gerçek verilerle üç ila altı haftada pilot sürüm." },
          { h: "İşletim", p: "Dokümantasyon ve kaynak kodla devir; isteğe bağlı olarak sürekli değişiklikler için küçük bir çerçeve." },
        ],
      },
    ],
    faq: {
      h: "Dahili araçlar hakkında sorular",
      items: [
        { q: "Neden hazır yazılım değil?", a: "Hazır yazılım çoğu zaman doğru seçimdir. Yalnızca uymadığında veya amaç için fazla pahalı olacağında kurarım. Bunu size dürüstçe söylerim." },
        { q: "Kod kimin?", a: "Başlamadan önce yazılı olarak belirleriz. Kaynak kod ve dokümantasyonun devri olağandır." },
        { q: "Araç nerede çalışır?", a: "AB'de, seçeceğiniz bir sağlayıcıda veya kendi altyapınızda." },
      ],
    },
    cta: { h: "Tabloyu değiştirin.", p: "İş akışını kısaca anlatın. Kendi aracın karşılığını verip vermeyeceğini söylerim.", primary: CHECK, secondary: CONTACT },
    service: { type: "Custom internal tools" },
  },

  schulungen: {
    slug: "ki-schulungen",
    meta: {
      title: "YZ eğitimleri: net fiyatlı üç sabit teklif",
      description:
        "YZ Hızlı Kontrol 490 €'dan, YZ Yetkinliği Temel 1.490 €, Copilot Uygulama Günü 2.400 €'dan. Teori yerine pratik, ekibiniz için, Almanca, İngilizce veya Türkçe.",
    },
    crumb: "YZ eğitimleri",
    hero: {
      eyebrow: "YZ eğitimleri",
      h1: ["Net fiyatlı ", "üç sabit", " teklif."],
      lede: "Modüler paket yok, abonelik yok. Ekibinize uyan formatı seçersiniz. Eğitimler uygulamalıdır: slayt yerine sizin işleriniz.",
      primary: { label: "Talep gönder", href: "/contact" },
      secondary: CHECK,
      scene: "steps",
      heat: [6],
    },
    blocks: [
      {
        t: "table",
        id: "angebote",
        eyebrow: "Teklifler",
        h: "Ne sunuyorum.",
        caption: "Parça listesi: YZ eğitimleri",
        cols: ["Teklif", "Format", "Fiyat"],
        rows: [
          ["YZ Hızlı Kontrol||Günlük işinizde YZ'nin nerede anlamlı, nerede anlamsız olduğuna birlikte bakarız. Sonuç kısa yazılı bir rapor. İlk 3 pilot, dürüst geri bildirim karşılığında ücretsiz.", "90 dakika uzaktan, raporlu", "490 €'dan"],
          ["YZ Yetkinliği Temel||İş gününde YZ'yi güvenle kullanmanın temelleri. Önceden bizzat seçtiğim serbest çalışan bir eğitmen tarafından yürütülür. AB YZ Tüzüğü'nün 4. maddesi kapsamındaki YZ yetkinliği önlemlerinizi destekler.", "Yarım gün, 15 kişiye kadar", "1.490 €"],
          ["Copilot Uygulama Günü||Microsoft 365 Copilot ile kendi işlerinizde uygulamalı çalışma. Zaten Copilot lisansı olan işletmeler için.", "1 gün, 12 kişiye kadar", "2.400 €'dan"],
        ],
        note: "Diller: Almanca, İngilizce ve Türkçe.",
      },
      {
        t: "steps",
        eyebrow: "Süreç",
        h: "Bir eğitim nasıl işler.",
        items: [
          { h: "Talep", p: "Ekibi, işleri ve ön bilgiyi anlatırsınız. Uygun formatı öneririm." },
          { h: "Anlaşma", p: "Tarih, yer veya uzaktan, katılımcı sayısı ve günlük işinizden örneklerle içerik." },
          { h: "Uygulama", p: "Sizin işleriniz üzerinde pratik. Katılımcılar dinlemek yerine kendileri çalışır." },
        ],
      },
    ],
    faq: {
      h: "Eğitimler hakkında sorular",
      items: [
        { q: "Sertifika alıyor muyuz?", a: "Eğitim bir sertifika kursu değildir. AB YZ Tüzüğü'nün 4. maddesi kapsamındaki YZ yetkinliği önlemlerinizi destekler." },
        { q: "Eğitimi kim yürütür?", a: "YZ Hızlı Kontrol'ü kendim yürütürüm. YZ Yetkinliği Temel'i, önceden bizzat seçtiğim serbest çalışan bir uzman üstlenir." },
        { q: "Çevrimiçi tarihler mümkün mü?", a: "Hızlı Kontrol uzaktan yapılır. Diğer formatları sizinle netleştiririz." },
      ],
    },
    cta: { h: "Doğru formatı bulun.", p: "Ekip ve hedef hakkında kısaca yazın. Bir format önerir ve fiyatı söylerim.", primary: { label: "Talep gönder", href: "/contact" }, secondary: CHECK },
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
        "60–90 dakikalık analiz görüşmesi ve beş değerlendirilmiş otomasyon adaylı yazılı 30 günlük plan. Düşük riskli ilk adım.",
    },
    crumb: "YZ kontrolü",
    hero: {
      eyebrow: "YZ kontrolü · giriş teklifi",
      h1: ["", "Gerçek", " otomasyon potansiyelini bulun."],
      lede: "60–90 dakikalık odaklı bir analiz görüşmesi ve emek, fayda ve riske göre değerlendirilmiş beş somut adaylı yazılı bir 30 günlük plan.",
      primary: { label: "YZ kontrolü talep et", href: "/contact" },
      secondary: { label: "Sürece bak", href: "#ablauf" },
      scene: "steps",
      heat: [5],
      spec: [
        ["Kapsam", "60–90 dakika, yerinde veya uzaktan"],
        ["Sonuç", "Süreç haritası, 5 değerlendirilmiş fırsat, 30 günlük plan"],
        ["Fiyat", "Talep üzerine, ön görüşmeden sonra sabit"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Neden var",
        h: "Birçok otomasyon projesi başlamadan başarısız olur.",
        lede: "Teknoloji yüzünden değil; yanlış iş akışı otomatikleştirildiği veya ekibin gerçekte ne yaptığı hiç yazılmadığı için.",
        items: [
          { h: "Nedenler yerine belirtiler", p: "Sorunu doğuran değil, göze çarpan otomatikleştirilir." },
          { h: "Kullanım senaryosuz araçlar", p: "Ne için olduğu belli olmadan YZ araçları satın alınır." },
          { h: "Başlangıç noktası yok", p: "Mevcut durum olmadan faydayı ölçmek mümkün olmaz." },
          { h: "Belirsiz sınırlar", p: "Hangi adımların bilerek manuel kalması gerektiği açık değildir." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Kapsam",
        h: "Kontrolün içinde ne var.",
        items: [
          { h: "Analiz görüşmesi, 60–90 dakika", p: "Yerinde veya uzaktan. İşin ekibinizde nasıl aktığını slayt olmadan dinlerim." },
          { h: "Önemli iş akışlarının alınması", p: "İş akışları, ekibinizin kontrol edebileceği biçimde yazılır." },
          { h: "5 somut fırsat", p: "Gerçek iş akışlarınızdan, genel bir YZ dilek listesi değil." },
          { h: "Emek, fayda ve riske göre değerlendirme", p: "Yönetim teknik bilgi olmadan önceliklendirebilsin diye." },
          { h: "30 günlük plan", p: "Sonraki adımlar, araçlar, sorumlular ve beklenen sonuç." },
          { h: "İsteğe bağlı: bir pilot iş akışı", p: "Mantıklı olduğunda ilk otomasyonu sabit kapsam ve süreyle kendim kurarım." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Kimler için",
        h: "Kontrol kime uygun.",
        items: [
          { h: "Orta ölçekli işletmeler", p: "Ölçülebilir bir ilk adım isteyenler." },
          { h: "Gölge YZ kullanan ekipler", p: "YZ'yi zaten kullanıp yapı arayanlar." },
          { h: "Operasyon sorumluları", p: "Çok fazla manuel devri olanlar." },
          { h: "Araç değerlendiren işletmeler", p: "Örneğin Microsoft 365, Power Automate veya Make." },
        ],
      },
      {
        t: "steps",
        id: "ablauf",
        eyebrow: "Süreç",
        h: "Kontrol nasıl işler.",
        items: [
          { h: "Başlangıç", p: "Hedefler ve kapsamdaki iş akışları üzerine kısa bir ön görüşme. Ardından sabit fiyat netleşir." },
          { h: "Analiz görüşmesi", p: "İşi gerçekten yapan insanlarla 60–90 dakika." },
          { h: "Yazılı plan", p: "Birkaç iş günü içinde 30 günlük planı alırsınız." },
          { h: "Gözden geçirme", p: "Kapsam, emek ve sonraki adımlar için 30 dakika." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Sonuç",
        h: "Sonunda gelen kutunuzda ne olur.",
        items: [
          { h: "Süreç haritası", p: "Konuştuğumuz iş akışları, yazılı olarak." },
          { h: "5 değerlendirilmiş fırsat", p: "Araç önerisi ve kaba emek tahminiyle." },
          { h: "30 günlük plan", p: "Sorumlularla." },
          { h: "Manuel kalanlar üzerine not", p: "Neyin bilerek manuel kalması gerektiği ve neden." },
        ],
      },
    ],
    faq: {
      h: "YZ kontrolü hakkında sorular",
      items: [
        { q: "YZ kontrolü ne kadar?", a: "Fiyat kapsama ve ekip büyüklüğüne bağlıdır. Ön görüşmeden sonra sabit bir fiyat söylerim. Kısa raporlu daha hafif bir seçenek, 490 €'dan YZ Hızlı Kontrol'dür." },
        { q: "Gizlilik sözleşmesi yapılır mı?", a: "Evet, analiz görüşmesinden önce standart bir NDA imzalanır." },
        { q: "Bu yalnızca zaten YZ kullanan işletmeler için mi?", a: "Hayır. Birçok proje hiç YZ olmadan başlar." },
        { q: "Araçlarımızı kullanmaya devam edebilir miyiz?", a: "Evet. Microsoft 365, Google Workspace, CRM veya ERP'niz iş akışını taşıyorsa önce onları kullanırım." },
        { q: "Kontrolden sonra ne olur?", a: "Ya planı kendiniz uygularsınız, ya birlikte bir pilot kurarız, ya da orada biter. Bağımlılık yok." },
      ],
    },
    cta: { h: "Gerçekten neye değdiğini öğrenin.", p: "Bir görüşme, yazılı bir plan, yükümlülük yok. Karşılığını vermeyecek bir projeye başlamaktansa henüz doğru zaman olmadığını söylemeyi tercih ederim.", primary: { label: "YZ kontrolü talep et", href: "/contact" }, secondary: { label: "Tüm hizmetler", href: "/leistungen" } },
    service: { type: "AI and automation assessment" },
  },

  about: {
    slug: "ueber-mich",
    meta: {
      title: "Hakkımda: Hasan Dönmez, Arnsberg'de bağımsız pratik",
      description:
        "Hasan Dönmez, Arnsberg'de otomasyon uzmanıdır. OpSolid, YZ agent'ları, web siteleri ve otomasyon için tek kişilik bir pratiktir. TopSolid ile karıştırılmamalıdır.",
    },
    crumb: "Hakkımda",
    hero: {
      eyebrow: "Hakkımda",
      h1: ["Hasan Dönmez, ", "tek başıma", " ve kişisel."],
      lede: "Arnsberg'de otomasyon uzmanıyım. OpSolid benim tek kişilik pratiğim: her zaman benimle konuşursunuz ve sonuçları benden alırsınız.",
      primary: CONTACT,
      secondary: CHECK,
      scene: "offset",
      spec: [
        ["Ad", "Hasan Dönmez"],
        ["Pratik", "OpSolid, bağımsız, şahıs işletmesi"],
        ["Yer", "Arnsberg, Almanya"],
        ["Diller", "Almanca, İngilizce, Türkçe"],
      ],
    },
    blocks: [
      {
        t: "rows",
        eyebrow: "Çalışma biçimi",
        h: "Nasıl çalışırım.",
        items: [
          { h: "Önce süreç, sonra teknoloji", p: "Bir şey önermeden önce işletmenizi anlamaya zaman ayırırım." },
          { h: "Demo için değil, günlük kullanım için kurulur", p: "Sistemler gerçek yükü taşımalı, hataları yönetmeli ve özel durumları bilmeli." },
          { h: "Özellik değil, sonuç", p: "Sayılması gereken kazanılan saatler, azalan hatalar ve daha iyi akışlardır." },
          { h: "Net kalmak", p: "Otomasyonu mantıklı olduğu yerde öneririm, olmadığı yerde vazgeçirmeye çalışırım." },
        ],
      },
      {
        t: "rows",
        eyebrow: "Kendi ürünlerim",
        h: "Kendim işlettiklerim.",
        items: [
          { h: "OpSo", tag: "Ürün", p: "NFC ve QR ile dijital kartvizit.", href: "/opso" },
          { h: "Kutasia", tag: "Canlı demo", p: "Müşteri iletişimi tek gelen kutusunda, YZ ön sıralamasıyla.", href: "https://kutasia.com" },
        ],
      },
      {
        t: "text",
        eyebrow: "Ayrım",
        h: "OpSolid, TopSolid değildir.",
        paras: ["OpSolid, TopSolid (CAD/CAM) ile ilgili değildir ve onunla bağlantısı yoktur. Hasan Dönmez ve OpSolid'i arıyorsanız doğru yerdesiniz."],
      },
    ],
    cta: { h: "Birlikte işe yarar bir şey kuralım.", p: "İş akışlarınızda çok fazla elle iş varsa yardımcı olabilirim.", primary: CHECK, secondary: CONTACT },
  },

  contact: {
    slug: "contact",
    meta: {
      title: "İletişim: ön görüşme veya YZ kontrolü talep edin",
      description:
        "Form, e-posta veya telefonla ön görüşme ya da YZ kontrolü talep edin. Genellikle birkaç iş günü içinde yanıtlarım.",
    },
    crumb: "İletişim",
    hero: {
      eyebrow: "İletişim",
      h1: ["Yazın veya ", "arayın", "."],
      lede: "Konunun ne olduğunu kısaca anlatın. Genellikle birkaç iş günü içinde yanıtlarım.",
      primary: CHECK,
      scene: "tight",
    },
    blocks: [],
    cta: { h: "Hemen başlamak ister misiniz?", p: "YZ kontrolü en net ilk adımdır.", primary: CHECK },
  },
};
