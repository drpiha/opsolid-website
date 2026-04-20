// =============================================================================
// TURKISH CONTENT (Türkçe)
// Tüm metinler profesyonel iş Türkçesinde. Yapı en.ts ile birebir aynı.
// =============================================================================

import type { Content } from "./en";

export const content: Content = {
  nav: {
    solutions: "Hizmetler",
    products: "Ürünler",
    useCases: "Örnek Çözümler",
    about: "Hakkımızda",
    contact: "İletişim",
    cta: "Tanışma Görüşmesi Planlayın",
    blog: "Blog",
    faq: "SSS",
  },

  home: {
    hero: {
      headline: "İş Operasyonları İçin\nPratik Otomasyon",
      subheadline:
        "OpSolid, işletmelerin manuel ve tekrarlayan işlerini güvenilir otomasyon sistemleriyle değiştirmelerine yardımcı olur — iş akışı otomasyonundan sistem entegrasyonuna, yapay zeka destekli süreçlere kadar.",
      primaryCta: "Tanışma Görüşmesi Planlayın",
      secondaryCta: "Hizmetleri İnceleyin",
      ratingPill: "OpSolid · Otomasyon Stüdyosu · Almanya merkezli",
      title: [
        "Operasyonlarınızı",
        "yöneten otomasyon —",
        "tersi değil.",
      ],
      subtitle:
        "OpSolid gerçek iş operasyonları için pratik otomasyon ve yapay zeka sistemleri tasarlar ve kurar — iş akışı otomasyonu, sistem entegrasyonu, dahili araçlar ve AI destekli süreçler. Almanya'da barındırılır. Tedarikçi bağımlılığı yok.",
      primaryCtaLabel: "Tanışma görüşmesi planla",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Hizmetleri gör",
      secondaryCtaHref: "/solutions",
      footnote: "Almanya merkezli  ·  GDPR-yerli  ·  Tedarikçi kilidi yok",
      consultingNote:
        "Ayrıca bağımsız ürünler de sunuyoruz — Kutasia, Dijital Kartvizit, Dijital Resepsiyon.",
      editorial: {
        eyebrow: "[ 01 / 04 ]   OTOMASYON STÜDYOSU — HAMBURG, DE",
        title: [
          "Operasyonunun zaten",
          "sahipmiş gibi davrandığı",
          "sistemleri biz kuruyoruz.",
        ],
        paragraph:
          "Orta ölçekli operasyonlar için pratik otomasyon — siparişler, belgeler, onaylar, iletişim. Yığınınızı yeniden kurmak yok, yapay zeka tiyatrosu yok, tedarikçiye bağımlılık yok.",
        primaryCta: "Görüşme ayarla",
        secondaryCta: "Nasıl çalışıyoruz",
        stackLabel: "Güvenilen yığın",
        schematic: {
          trigger: "Tetikleyici",
          triggerDetail: "Webhook / Form",
          parse: "Ayrıştır",
          parseDetail: "AI · PDF OCR",
          route: "Yönlendir",
          routeDetail: "If / Else",
          write: "Yaz",
          writeDetail: "Postgres",
          notify: "Bildir",
          notifyDetail: "WhatsApp / E-posta",
          caption: "İş Akışı · v1",
        },
      },
    },

    capabilities: [
      "İş Akışı Otomasyonu",
      "Sistem Entegrasyonu",
      "Dahili Araçlar",
      "Yapay Zeka Destekli İş Akışları",
      "Süreç Dijitalleştirme",
      "Operasyonel Panolar",
    ],

    whatWeDo: {
      label: "OpSolid Ne Yapar",
      headline: "Gerçek operasyonlar için otomasyon ve yapay zeka sistemleri",
      description:
        "Birçok işletme hâlâ manuel süreçlere, birbirinden kopuk araçlara ve elektronik tablo tabanlı takip sistemlerine güveniyor. OpSolid, araçlarınızı birbirine bağlayan, iş akışlarınızı düzenleyen ve ekipleri yavaşlatan operasyonel yükü azaltan otomasyon sistemleri tasarlar ve geliştirir.",
      points: [
        "n8n, Make ve özel entegrasyonlarla tekrarlayan iş akışlarını otomatize edin",
        "CRM, ERP, veritabanları ve iletişim araçlarını birleşik sistemlere bağlayın",
        "Ekibiniz için özel panolar ve dahili araçlar geliştirin",
        "Pratik değer yaratan alanlara yapay zeka destekli süreçler ekleyin",
      ],
    },

    solutions: {
      label: "Odak Alanları",
      headline: "OpSolid neler geliştirebilir",
      items: [
        {
          title: "İş Akışı Otomasyonu",
          description:
            "Manuel adımların yerini alan otomatik iş akışları — veri girişinden onaylara, bildirimlerden raporlamaya. n8n, Make ve özel entegrasyonlarla geliştirilir.",
          icon: "workflow",
        },
        {
          title: "Sistem Entegrasyonu",
          description:
            "CRM, ERP, veritabanları ve iletişim araçlarınızı tek bir senkronize operasyonel katmanda birleştirin. Artık manuel veri aktarımına gerek yok.",
          icon: "plug",
        },
        {
          title: "Dahili Araçlar ve Panolar",
          description:
            "Ekibinizin gerçek çalışma şekline göre tasarlanmış özel operasyonel arayüzler, yönetim panelleri ve gösterge panoları.",
          icon: "layout",
        },
        {
          title: "Yapay Zeka Destekli İş Akışları",
          description:
            "Chatbot'lar, sesli asistanlar, belge işleme ve akıllı yönlendirme — mevcut süreçlerinize entegre edilen pratik yapay zeka uygulamaları.",
          icon: "bot",
        },
        {
          title: "İletişim Otomasyonu",
          description:
            "WhatsApp, Telegram, e-posta ve SMS üzerinden otomatik mesajlaşma — destek yanıtlarından işlemsel bildirimlere ve takip mesajlarına kadar.",
          icon: "messageSquare",
        },
      ],
    },

    transformation: {
      label: "Dönüşüm",
      headline: "Manuel yükten operasyonel netliğe",
      items: [
        {
          before: "Manuel e-postalar ve takip mesajları",
          after: "Yapılandırılmış bildirimlerle otomatik iş akışları",
        },
        {
          before: "Elektronik tablo tabanlı takip",
          after: "Tutarlı veriye sahip bağlantılı sistemler",
        },
        {
          before: "Tekrarlayan veri girişi",
          after: "Güvenilir, otomatik süreçler",
        },
        {
          before: "Parçalanmış, birbirinden kopuk araçlar",
          after: "Platformlar arası entegre operasyonlar",
        },
        {
          before: "Kanallara dağılmış mesajlar",
          after: "Birleşik, otomatik iletişim",
        },
        {
          before: "Manuel takip ve görev yönetimi",
          after: "Net sorumluluk dağılımına sahip yapılandırılmış iş akışları",
        },
      ],
    },

    useCases: {
      label: "Otomasyonun Fayda Sağladığı Alanlar",
      headline: "Tipik sorun alanları",
      items: [
        {
          title: "Sipariş ve Teslimat Operasyonları",
          description:
            "Sipariş alımı, durum güncellemeleri ve teslimat takibini tüm kanallarda otomatize edin.",
        },
        {
          title: "Belge İşleme",
          description:
            "Faturaları, sözleşmeleri ve formları yapılandırılmış iş akışlarıyla çıkarın, sınıflandırın ve yönlendirin.",
        },
        {
          title: "Dahili Onaylar",
          description:
            "Satın alma, sözleşme ve operasyonel talepler için yapılandırılmış onay iş akışları.",
        },
        {
          title: "Operasyonel Panolar",
          description:
            "Birden fazla kaynaktan gelen verileri tek bir operasyonel görünümde birleştiren panolar.",
        },
        {
          title: "Müşteri İletişimi",
          description:
            "WhatsApp, e-posta ve diğer kanallar üzerinden otomatik mesajlaşma, takip ve durum güncellemeleri.",
        },
        {
          title: "Veri Senkronizasyonu",
          description:
            "CRM, ERP ve diğer iş sistemlerini senkronize tutun — manuel veri aktarımlarını azaltın.",
        },
      ],
    },

    integrations: {
      label: "Entegrasyonlar",
      headline: "OpSolid'in bağlandığı araçlar ve platformlar",
      items: [
        { name: "WhatsApp", icon: "messageCircle" },
        { name: "Telegram", icon: "send" },
        { name: "n8n", icon: "workflow" },
        { name: "Shopify", icon: "shoppingBag" },
        { name: "CRM Sistemleri", icon: "users" },
        { name: "ERP Sistemleri", icon: "database" },
        { name: "E-posta & SMTP", icon: "mail" },
        { name: "REST API'ler", icon: "code" },
        { name: "Google Workspace", icon: "cloud" },
        { name: "Veritabanları", icon: "hardDrive" },
        { name: "Zapier", icon: "zap" },
        { name: "Make", icon: "settings" },
      ],
    },

    howWeWork: {
      label: "Süreç",
      headline: "Tipik bir proje nasıl ilerler",
      steps: [
        {
          step: "01",
          title: "Keşif",
          description:
            "Süreçlerinizi anlamak, darboğazları belirlemek ve otomasyonun en fazla pratik değer yarattığı alanları tespit etmek.",
        },
        {
          step: "02",
          title: "Tasarım",
          description:
            "İhtiyaçlarınıza uygun araçları, entegrasyonları ve iş akışı mimarisini belirlemek.",
        },
        {
          step: "03",
          title: "Geliştirme",
          description:
            "Her adımda net iletişim ile iteratif olarak geliştirmek, test etmek ve devreye almak.",
        },
        {
          step: "04",
          title: "İyileştirme",
          description:
            "Operasyonlarınız geliştikçe sistemlerinizi izlemek, optimize etmek ve genişletmek.",
        },
      ],
    },

    whyUs: {
      label: "Neden OpSolid",
      headline: "Neler bekleyebilirsiniz",
      points: [
        {
          title: "Önce Süreç Odaklı Düşünce",
          description:
            "Her proje, işletmenizin nasıl çalıştığını anlamakla başlar — bir teknoloji satışıyla değil.",
        },
        {
          title: "Size Özel, Hazır Paket Değil",
          description:
            "Sistemleriniz gerçek iş akışlarınıza göre tasarlanır — genel şablonlar veya zorunlu tavizler yok.",
        },
        {
          title: "Üretime Hazır",
          description:
            "Çözümler güvenilirlik ve gerçek iş yükleri için tasarlanır — uygun hata yönetimi ve izleme ile.",
        },
        {
          title: "Almanya Merkezli, Uluslararası Bakış Açısı",
          description:
            "Almanya merkezli, Avrupa genelinde ve ötesinde hizmet veren. Yerel gereksinimler ve uluslararası bağlamlarla tanışık.",
        },
      ],
    },

    cta: {
      headline: "Operasyonlarınızı otomatize etmeye hazır mısınız?",
      description:
        "Ücretsiz bir tanışma görüşmesi planlayın. OpSolid, otomasyonun manuel işleri nerede azaltabileceğini ve operasyonel iş akışlarınızı nasıl iyileştirebileceğini belirlemenize yardımcı olur.",
      primaryCta: "Tanışma Görüşmesi Planlayın",
    },

    toolsShowcase: {
      label: "Kullanılan Araçlar",
      headline: "OpSolid'in çalıştığı otomasyon platformları ve yapay zeka araçları",
      description:
        "OpSolid, operasyonlarınıza uygun sistemler geliştirmek için güvenilir, kanıtlanmış otomasyon platformları ve pratik yapay zeka araçları kullanır — her kullanım senaryosu için doğru aracı seçerek.",
      tools: [
        {
          name: "n8n",
          description:
            "Karmaşık otomasyonlar için kendi sunucunuzda barındırılan iş akışı motoru. Webhook tetikleyicileri, koşullu mantık ve tam veri egemenliği.",
          techFeatures: [
            "Kendi Sunucunuzda",
            "500+ Entegrasyon",
            "Webhook Tetikleyiciler",
            "Hata Yönetimi",
            "Veri Egemenliği",
          ],
        },
        {
          name: "Make",
          description:
            "Çok adımlı veri yönlendirme için görsel senaryo oluşturucu. API bağlantıları, hata dallanması ve otomatik veri dönüşümleri.",
          techFeatures: [
            "Görsel Oluşturucu",
            "Veri Yönlendirme",
            "API Modülleri",
            "Hata Dallanması",
            "Gerçek Zamanlı",
          ],
        },
        {
          name: "Zapier",
          description:
            "6.000'den fazla uygulamayı çok adımlı otomasyonlarla hızlıca bağlayın. Koşullu yollar, zamanlanmış tetikleyiciler ve filtreleme.",
          techFeatures: [
            "6.000+ Uygulama",
            "Çok Adımlı",
            "Koşullu Mantık",
            "Zamanlayıcılar",
            "Filtreler",
          ],
        },
        {
          name: "Yapay Zeka Araçları",
          description:
            "Ses, sohbet, belge işleme ve karar destek için pratik yapay zeka uygulamaları. Güvenilir modellerle ve yapılandırılmış iş akışlarıyla geliştirilir.",
          techFeatures: [
            "Sesli Asistanlar",
            "Chatbot'lar",
            "Belge Yapay Zekası",
            "Sınıflandırma",
            "Yapılandırılmış Çıktı",
          ],
        },
      ],
    },

    trustStrip: {
      items: [
        "Almanya'da kurulmuş",
        "GDPR-yerli",
        "n8n · Make · AI destekli",
        "Tedarikçi kilidi yok",
        "ISO 27001-uyumlu",
        "EN · DE · TR",
      ],
    },

    featureGrid: {
      label: "OpSolid ne inşa eder",
      headline: "Otomasyon, AI ve dahili araçlar — zaten yürüttüğünüz operasyonlar için.",
      description:
        "Altı odak alanı. Her proje, sizin sürecinizle başlar — bir teknoloji sunumuyla değil.",
      items: [
        {
          icon: "workflow",
          title: "İş akışı otomasyonu",
          description:
            "Tekrarlayan, kural tabanlı işler için uçtan uca otomasyon — n8n, Make ve özel entegrasyonlarla. Düzgün hata yönetimi, kırılgan yapıştırıcı kod yok.",
        },
        {
          icon: "plug",
          title: "Sistem entegrasyonu",
          description:
            "CRM, ERP, veritabanları ve iletişim araçlarını tek bir senkronize operasyonel katmana bağlayın. Tek kaynak doğrusu.",
        },
        {
          icon: "layout",
          title: "Dahili araçlar & panolar",
          description:
            "Ekibinizin gerçekten çalıştığı şekle göre tasarlanmış özel admin panelleri, operasyonel dashboardlar ve dahili uygulamalar.",
        },
        {
          icon: "bot",
          title: "AI destekli süreçler",
          description:
            "Pratik yapay zeka — doküman işleme, sınıflandırma, ses ajanları, sohbet asistanları — mevcut süreçlerinize üzerine monte değil, içine gömülü.",
        },
        {
          icon: "messageSquare",
          title: "İletişim otomasyonu",
          description:
            "WhatsApp, Telegram, e-posta ve SMS üzerinden otomatik mesajlaşma — durum güncellemelerinden takip dizilerine kadar. Kanaldan bağımsız.",
        },
        {
          icon: "shield",
          title: "Avrupa'da barındırma",
          description:
            "Self-hosted veya Hetzner / IONOS Frankfurt üzerinde deploy. GDPR-yerli. İstemediğiniz sürece ABD alt işleyen yok.",
        },
      ],
    },

    howItWorks: {
      label: "Süreç",
      headline: "Üç adım. Tedarikçi kilidi yok. Gizem yok.",
      steps: [
        {
          title: "Keşfet",
          description:
            "Gerçek süreçlerinizi haritalandırırız, darboğazları tespit ederiz ve otomasyonun nerede karşılığını verdiğini buluruz. Tek satır kod yazılmadan önce yazılı kapsam alırsınız.",
        },
        {
          title: "Tasarla & kur",
          description:
            "Durumunuza uygun stack'i seçeriz (n8n, Make, özel kod veya AI) — sonra her adımda net güncellemelerle iteratif kurup test edip deploy ederiz.",
        },
        {
          title: "İşlet & geliştir",
          description:
            "Operasyonunuz geliştikçe sistemleri izler, optimize eder ve genişletiriz. Tam dokümantasyon. Altyapı her zaman sizin.",
        },
      ],
    },

    whoUses: {
      label: "Kimlerle çalışıyoruz",
      headline: "Operasyonları manuel kalmaya tahammülü olmayan ekipler.",
      items: [
        {
          title: "Otel & hizmet",
          description:
            "Rezervasyonları, müşteri konuşmalarını ve çok kanallı operasyonları yöneten oteller, klinikler, salonlar ve restoranlar.",
          icon: "founder",
        },
        {
          title: "Perakende & e-ticaret",
          description:
            "Siparişleri, stoku, fulfillment'ı ve ERP/CRM arası veri senkronunu taşıyan çok kanallı satıcılar.",
          icon: "sales",
        },
        {
          title: "Profesyonel hizmetler",
          description:
            "Doküman işleme, müşteri alımı ve onboarding'i otomatikleştiren danışmanlıklar, hukuk büroları, mali müşavirler, ajanslar.",
          icon: "agency",
        },
        {
          title: "Operasyon ekipleri",
          description:
            "Daha çok tablo yerine güvenilir dahili araçlar, onay iş akışları ve panolara ihtiyaç duyan operasyon liderleri.",
          icon: "freelancer",
        },
      ],
    },

    pricingPreview: {
      label: "OpSolid ile çalışmanın iki yolu",
      headline: "Özel sistemler — veya bağımsız ürünler.",
      description:
        "Çoğu proje özel otomasyonla başlar. Hazır kullanılabilir bir araç isteyen ekipler bağımsız ürünlerimizden birini seçer — aynı temeller üzerine kurulu.",
      cards: [
        {
          title: "Özel otomasyon",
          priceLabel: "Proje bazlı",
          priceCadence: "tanışma görüşmesiyle başlar",
          bullets: [
            "İş akışı otomasyonu (n8n, Make, özel)",
            "CRM, ERP, API'ler üzerinde sistem entegrasyonu",
            "Dahili araçlar, admin panelleri, dashboardlar",
            "AI destekli iş akışları ve iletişim",
          ],
          ctaLabel: "Tanışma görüşmesi planla",
          ctaHref: "/contact",
          tone: "brand",
        },
        {
          title: "Bağımsız ürünler",
          priceLabel: "Self-Serve",
          priceCadence: "kullanıma hazır · ürün başına fiyat",
          bullets: [
            "Kutasia — çok sektörlü müşteri platformu",
            "Dijital Kartvizit — link, QR, opsiyonel NFC",
            "Dijital Resepsiyon — hizmet işletmeleri için AI resepsiyon",
            "Hepsi GDPR-yerli · Almanya'da barındırılır",
          ],
          ctaLabel: "Tüm ürünleri gör",
          ctaHref: "/products",
          tone: "dark",
        },
      ],
    },

    testimonials: {
      label: "Operasyon liderlerinden notlar",
      headline: "Ekipler OpSolid ile çalıştıktan sonra neyi fark ediyor.",
      items: [
        {
          quote:
            "Sipariş verilerini artık dört sistem arasında kopyalamıyoruz. Her sabah iki saat süren iş artık kimse laptopu açmadan önce tamamlanıyor.",
          name: "Lena Richter",
          role: "Operasyon Direktörü",
          company: "Berlinli perakende grubu",
        },
        {
          quote:
            "OpSolid bize bir platform satmaya çalışmadı. Gerçek sürecimizi haritalandırdılar, sıkıcı kısımları otomatikleştirdiler ve tam dokümantasyonu teslim ettiler.",
          name: "Marco Weber",
          role: "COO",
          company: "Münih sanayi grubu",
        },
        {
          quote:
            "Bütün entegrasyon katmanı self-hosted. ABD alt işleyen yok. Legal tek toplantıda onay verdi — bu tek başına değerdi.",
          name: "Sarah Klein",
          role: "BT Direktörü",
          company: "Hamburg hizmet firması",
        },
      ],
    },

    finalCta: {
      eyebrow: "HAZIR MISINIZ?",
      headline:
        "Gerçekten neyin otomatikleştirilebileceğine bakalım.",
      description:
        "Ücretsiz tanışma görüşmesi planlayın. Otomasyonun nerede kazandırdığını — ve dürüstçe nerede kazandırmadığını — birlikte haritalayalım.",
      primaryCtaLabel: "Tanışma görüşmesi planla",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Hizmetleri gör",
      secondaryCtaHref: "/solutions",
    },
  },

  solutions: {
    hero: {
      label: "Hizmetler",
      headline: "Gerçek operasyonel sorunları çözen sistemler",
      description:
        "İş akışı otomasyonu, dahili araçlar, entegrasyonlar ve yapay zeka destekli süreçler — her biri sizin operasyonlarınıza göre tasarlanır.",
    },
    problemsLabel: "Yaygın sorunlar",
    outcomesLabel: "Olası sonuçlar",
    items: [
      {
        title: "İş Akışı Otomasyonu",
        description:
          "n8n, Make, özel iş akışları ve API orkestrasyonu kullanarak kuruluşunuz genelindeki tekrarlayan, kural tabanlı görevleri otomatize edin.",
        problems: [
          "Veri girişi ve sistemler arası kopyala-yapıştır işlerine harcanan saatler",
          "Departmanlar arası manuel aktarımlardan kaynaklanan hatalar",
          "Görevi kimin yürüttüğüne bağlı tutarsız uygulama",
          "Manuel onay zincirlerinden kaynaklanan darboğazlar",
        ],
        outcomes: [
          "Yerleşik hata yönetimine sahip uçtan uca otomatik iş akışları",
          "Her seferinde tutarlı, güvenilir uygulama",
          "Süreç durumuna gerçek zamanlı görünürlük",
          "Tekrarlayan manuel işlerde önemli azalma",
        ],
        icon: "workflow",
      },
      {
        title: "Sistem Entegrasyonu",
        description:
          "CRM, ERP, veritabanları ve araçlarınızı birleşik bir operasyonel katmanda bağlayın. Veri silolarını azaltan güvenilir entegrasyonlar.",
        problems: [
          "Aynı verinin birden fazla sisteme manuel olarak girilmesi",
          "Güncel olmayan veya çelişen verilere dayalı kararlar",
          "Dahili kaynakları zorlayan entegrasyon talepleri",
          "Operasyonel veriler için tek bir doğru kaynağın olmaması",
        ],
        outcomes: [
          "Temel sistemler arasında çift yönlü veri senkronizasyonu",
          "Operasyonlar için tek doğru kaynak",
          "Azaltılmış manuel veri aktarımı ve daha az hata",
          "Ölçeklenebilir entegrasyon mimarisi",
        ],
        icon: "plug",
      },
      {
        title: "Dahili Araçlar ve Panolar",
        description:
          "Ekibiniz için özel olarak geliştirilen operasyonel araçlar — yönetim panelleri, veri arayüzleri ve iş akışınıza uygun gösterge panoları.",
        problems: [
          "Uygun araçlar gerektiren görevler için elektronik tablo kullanan ekipler",
          "Sürecinize uymayan hazır yazılımlar",
          "Operasyonel verilerin merkezi bir görünümünün olmaması",
          "Önemli bilgilerin e-postalar ve belgelere dağılmış olması",
        ],
        outcomes: [
          "Ekibinizin çalışma şekline uygun, amaca yönelik araçlar",
          "Güncel verilerle merkezi panolar",
          "Yeni ekip üyeleri için kısaltılmış uyum süresi",
          "Daha iyi veri görünürlüğü ile daha iyi kararlar",
        ],
        icon: "layout",
      },
      {
        title: "Yapay Zeka Destekli İş Akışları",
        description:
          "Operasyonlarınıza gömülü pratik yapay zeka uygulamaları — chatbot'lar, sesli asistanlar, belge işleme ve akıllı yönlendirme.",
        problems: [
          "Yüksek hacimli tekrarlayan gelen talepler",
          "Yoğun saatlerde yavaş yanıt süreleri",
          "Rutin, düşük karmaşıklıktaki görevlere harcanan personel zamanı",
          "Mesai saatleri dışında müşteri iletişimi kapsamının olmaması",
        ],
        outcomes: [
          "Rutin talep ve görevlerin yapay zeka destekli yönetimi",
          "İletişim kanalları genelinde daha hızlı yanıt süreleri",
          "Personelin daha yüksek değerli işlere odaklanabilmesi",
          "Ek personel olmadan genişletilmiş erişilebilirlik",
        ],
        icon: "bot",
      },
      {
        title: "İletişim Otomasyonu",
        description:
          "WhatsApp, Telegram, e-posta ve SMS üzerinden otomatik mesajlaşma — destek yanıtlarından işlemsel güncellemelere ve takip dizilerine kadar.",
        problems: [
          "Birden fazla kanala dağılmış destek mesajları",
          "Yavaş veya tutarsız yanıt süreleri",
          "Otomatik işlemsel bildirimlerin olmaması",
          "Müşterileri durum güncellemeleri hakkında bilgilendirmek için harcanan manuel çaba",
        ],
        outcomes: [
          "Otomatik yönlendirmeli birleşik iletişim",
          "Tüm kanallarda tutarlı, zamanında yanıtlar",
          "Otomatik sipariş onayları ve durum güncellemeleri",
          "Azaltılmış manuel iletişim yükü",
        ],
        icon: "messageSquare",
      },
    ],
    cta: {
      headline: "Hangi hizmetin uygun olduğundan emin değil misiniz?",
      description:
        "Her işletme farklıdır. Sorunlarınızı görüşmek ve neyin mantıklı olduğunu keşfetmek için ücretsiz bir tanışma görüşmesi planlayın.",
      primaryCta: "Tanışma Görüşmesi Planlayın",
    },
  },

  useCases: {
    hero: {
      label: "Örnek Çözümler",
      headline: "Pratik otomasyon senaryoları",
      description:
        "OpSolid'in tasarlayıp geliştirebileceği sistem türlerinin gerçekçi örnekleri. Bunlar tipik sorun alanlarını ve çözüm yaklaşımlarını gösterir.",
    },
    labels: {
      context: "Senaryo",
      problem: "Sorun",
      solution: "Yaklaşım",
      outcome: "Olası Sonuç",
    },
    items: [
      {
        title: "Çok Kanallı Sipariş İşleme",
        context:
          "Birden fazla satış kanalı üzerinden günlük sipariş yöneten bir e-ticaret işletmesi.",
        problem:
          "Manuel sipariş girişi, durum güncellemeleri ve envanter düzenlemeleri günde saatlerce zaman alıyor. Yoğun dönemlerde hatalar artıyor.",
        solution:
          "Otomatik boru hattı: tüm kanallardan sipariş alımı, veri normalleştirme, envanter güncellemeleri, etiket oluşturma ve takip bildirimi iş akışları.",
        outcome:
          "Manuel işlem süresinde önemli azalma. Daha az hata. Orantılı personel artışı olmadan daha yüksek sipariş hacimlerini yönetebilme kapasitesi.",
      },
      {
        title: "Fatura ve Belge İşleme",
        context:
          "Farklı tedarikçilerden aylık yüzlerce fatura alan, karışık formatlarda belgelerle uğraşan bir şirket.",
        problem:
          "Personel, fatura verilerini çıkarmak, muhasebe sistemlerine girmek ve satın alma siparişleriyle eşleştirmek için önemli miktarda zaman harcıyor.",
        solution:
          "Yapay zeka destekli veri çıkarma, otomatik satın alma siparişi eşleştirme, tutarsızlık işaretleme ve muhasebe sistemlerine doğrudan yönlendirme.",
        outcome:
          "İşlem süresinde önemli azalma. Finans ekibinin veri girişi yerine istisnalara ve stratejik işlere odaklanabilmesi.",
      },
      {
        title: "Dahili Onay İş Akışları",
        context:
          "Satın alma, seyahat talepleri ve yüklenici uyum süreçlerini e-posta üzerinden yöneten, büyüyen bir şirket.",
        problem:
          "Talepler e-posta dizilerinde kaybolyor. Duruma ilişkin görünürlük yok, denetim izi yok. Süreç yöneticiye göre değişiyor.",
        solution:
          "Yapılandırılmış onay sistemi: form gönderimi, kural tabanlı yönlendirme, durum takibi ve otomatik hatırlatıcılar.",
        outcome:
          "Daha hızlı onay döngüleri. Kaybolan talep yok. Uyumluluk için tam denetim izi.",
      },
      {
        title: "Operasyon Panosu",
        context:
          "Satış, depo ve teslimat verilerini ayrı elektronik tablolarda takip eden bir dağıtım şirketi.",
        problem:
          "Raporlar her zaman gecikiyor ve genellikle tutarsız. Karar alma, güncel olmayan bilgilere dayanıyor.",
        solution:
          "ERP, depo ve teslimat sistemlerinden veri çeken canlı pano. Anomali ve eşik değerleri için yapılandırılabilir uyarılar.",
        outcome:
          "Gerçek zamanlı operasyonel görünürlük. Daha hızlı sorun tespiti. Daha bilinçli karar alma.",
      },
      {
        title: "Müşteri Uyum Otomasyonu",
        context:
          "Yeni müşterilerini çok adımlı manuel bir süreçle sisteme dahil eden bir B2B hizmet şirketi.",
        problem:
          "Uyum süreci paylaşımlı belgelerde takip ediliyor. Adımlar atlanıyor, deneyim tutarsız ve süreç gereğinden uzun sürüyor.",
        solution:
          "Otomatik iş akışı: hoş geldiniz iletişimleri, hesap oluşturma, belge toplama takibi ve durum panosu.",
        outcome:
          "Daha kısa uyum süresi. Her müşteri için tutarlı deneyim. Atlanan adım yok.",
      },
      {
        title: "Sistemler Arası Veri Senkronizasyonu",
        context:
          "E-ticaret, ERP, depo yönetimi ve CRM için ayrı sistemler kullanan bir perakende şirketi.",
        problem:
          "Personel, günde saatlerce manuel veri senkronizasyonu yapıyor. Sistemler arasındaki tutarsızlıklar operasyonel sorunlara yol açıyor.",
        solution:
          "Neredeyse gerçek zamanlı senkronizasyon, çakışma algılama ve yapılandırılmış hata yönetimine sahip merkezi entegrasyon katmanı.",
        outcome:
          "Manuel senkronizasyon görevlerinin ortadan kaldırılması. Tüm sistemlerde tutarlı veri. Personel zamanının daha yüksek değerli işlere yönlendirilmesi.",
      },
      {
        title: "Otomatik Müşteri İletişimi",
        context:
          "Durum güncellemelerini, hatırlatıcıları ve takip mesajlarını manuel olarak gönderen bir hizmet şirketi.",
        problem:
          "Mesajlar bazen geç kalıyor, tutarsız oluyor veya tamamen atlanıyor. Yoğun dönemlerde iletişim kalitesi düşüyor.",
        solution:
          "Hizmet kilometre taşları ve olaylar tarafından tetiklenen otomatik mesajlaşma. Manuel müdahale imkânıyla tutarlı şablonlar.",
        outcome:
          "Güvenilir, zamanında iletişim. Azaltılmış manuel yük. Daha tutarlı müşteri deneyimi.",
      },
      {
        title: "WhatsApp ve Telegram Desteği",
        context:
          "WhatsApp, Telegram ve e-posta üzerinden günlük müşteri talepleri alan bir işletme.",
        problem:
          "Personel, tekrarlayan soruları manuel olarak yanıtlıyor. Mesai dışı kapsam yok. Mesajlar kanallar arasında kayboluyor.",
        solution:
          "Otomatik SSS yanıtları, durum sorgulamaları ve karmaşık konular için insan temsilcilerine akıllı yönlendirmeli birleşik mesajlaşma merkezi.",
        outcome:
          "Daha hızlı yanıt süreleri. Genişletilmiş erişilebilirlik. Personelin insan ilgisi gerektiren taleplere odaklanması.",
      },
    ],
    cta: {
      headline: "Durumunuza uyan bir senaryo görüyor musunuz?",
      description:
        "Bunlar nelerin geliştirilebileceğine dair örneklerdir. Özel ihtiyaçlarınızı görüşmek için bir tanışma görüşmesi planlayın.",
      primaryCta: "Tanışma Görüşmesi Planlayın",
    },
  },

  about: {
    hero: {
      label: "OpSolid Hakkında",
      headline:
        "Daha az manuel iş isteyen işletmeler için pratik otomasyon sistemleri",
      description:
        "Almanya merkezli. Manuel, tekrarlayan operasyonel işlerin güvenilir otomatik sistemlerle değiştirilmesine odaklanır.",
    },
    story: {
      headline: "OpSolid neden var",
      paragraphs: [
        "Her büyüyen işletme, bir noktada manuel süreçlerin darboğaz haline geldiği anla karşılaşır. Siparişler birikir, onaylar e-posta arasında kaybolur, veriler birbirinden kopuk elektronik tablolarda kalır ve ekipler, işi ileriye taşıyan çalışmalardan çok operasyonel yüke zaman harcar.",
        "OpSolid bunu çözmek için kuruldu. Süreç düşüncesini modern otomasyon platformları ve pratik yapay zeka araçlarıyla birleştirerek OpSolid, operasyonel işleri güvenilir, tutarlı ve gereksiz karmaşıklık eklemeden yürüten sistemler tasarlar.",
      ],
    },
    values: {
      headline: "OpSolid'in çalışma yaklaşımı",
      items: [
        {
          title: "Teknolojiyle değil, süreçle başlayın",
          description:
            "Herhangi bir çözüm önermeden önce işletmenizin nasıl çalıştığını anlamaya zaman ayrılır.",
        },
        {
          title: "Demo için değil, üretim için geliştirin",
          description:
            "Sistemler gerçek iş yüklerini yönetir. Güvenilirlik, hata yönetimi ve uç durumlar için tasarlanır.",
        },
        {
          title: "Özellikleri değil, sonuçları ölçün",
          description:
            "Önemli olan tasarruf edilen saatler, azaltılan hatalar ve iyileştirilen süreçlerdir — özellik listeleri değil.",
        },
        {
          title: "Pratik kalın, dürüst olun",
          description:
            "Otomasyon mantıklı olan yerde önerilir — mantıklı olmayan yerde tavsiye edilmez.",
        },
      ],
    },
    founder: {
      name: "Hasan Dönmez",
      title: "Kurucu & Sistem Mimarı",
      education: "",
      description:
        "Almanya merkezli bağımsız otomasyon uzmanı. İş operasyonları için pratik otomasyon sistemleri, iş akışı entegrasyonları ve yapay zeka destekli süreçlerin tasarımı ve geliştirilmesine odaklanır.",
      expertiseLabel: "",
      expertise: [],
      footnote:
        "Almanya merkezli. Avrupa genelinde ve uluslararası projelere açıktır.",
    },
    cta: {
      headline: "Birlikte faydalı bir şeyler geliştirelim",
      description:
        "Operasyonlarınız çok fazla manuel iş ve birbirinden kopuk süreçler içeriyorsa, OpSolid yardımcı olabilir.",
      primaryCta: "Tanışma Görüşmesi Planlayın",
    },
  },

  contact: {
    hero: {
      label: "İletişim",
      headline: "Operasyonlarınızı konuşalım",
      description:
        "Belirli bir otomasyon sorununuz olsun ya da nelerin mümkün olduğunu keşfetmek isteyin — pratik bir sohbet, zorlama yok.",
    },
    form: {
      name: "Ad Soyad",
      email: "İş E-postası",
      company: "Şirket Adı",
      message: "Hangi operasyonel sorunu çözmek istiyorsunuz?",
      consent:
        "Verilerimin Gizlilik Politikası'nda açıklandığı şekilde işlenmesini kabul ediyorum. Verilerim yalnızca bu talebe yanıt vermek için kullanılacaktır.",
      privacyLink: "Gizlilik Politikası",
      submit: "Mesaj Gönder",
      sending: "Gönderiliyor...",
      success:
        "Teşekkürler. 1-2 iş günü içinde yanıt alacaksınız.",
      error:
        "Bir şeyler ters gitti. Lütfen tekrar deneyin veya doğrudan e-posta gönderin.",
    },
    meeting: {
      headline: "Doğrudan görüşmeyi mi tercih ediyorsunuz?",
      description:
        "Ücretsiz 30 dakikalık bir tanışma görüşmesi planlayın. Size uygun bir zaman seçin — müsait saatler anlık olarak güncellenir.",
      cta: "Görüşme Planlayın",
    },
    info: {
      email: "hello@opsolid.de",
      response: "Tipik yanıt süresi: 1-2 iş günü.",
      location:
        "Almanya merkezli. Avrupa genelinde ve uluslararası projelere açıktır.",
    },
  },

  footer: {
    description:
      "İş operasyonları için pratik otomasyon ve yapay zeka sistemleri.",
    company: "Şirket",
    services: "Hizmetler",
    products: "Ürünler",
    legal: "Yasal",
    resources: "Kaynaklar",
    copyright: `© ${new Date().getFullYear()} OpSolid. Tüm hakları saklıdır.`,
  },

  notFound: {
    title: "Sayfa bulunamadı",
    description:
      "Aradığınız sayfa mevcut değil veya taşınmış olabilir.",
    backHome: "Ana Sayfaya Dön",
    contactUs: "Bize Ulaşın",
  },

  impressum: {
    title: "Yasal Bildirim",
    notice:
      "Bu yasal bildirim, kuruluş aşamasındaki bir şirket içindir. Ticaret sicili kaydı yapıldığında bilgiler güncellenecektir.",
    sections: {
      according: "§ 5 TMG'ye göre",
      representedBy: "Temsil eden",
      contact: "İletişim",
      phone: "Telefon: Talep üzerine",
      register: "Ticaret Sicili",
      registerText:
        "Şu anda ticaret sicili kaydı bulunmamaktadır. Şirket kuruluş aşamasındadır.",
      vatId: "KDV Kimlik Numarası",
      vatIdText: "Ticaret sicili kaydı yapıldığında başvurulacaktır.",
      responsibleContent:
        "§ 55 Abs. 2 RStV'ye göre içerikten sorumlu kişi",
      liabilityContent: "İçerik Sorumluluğu",
      liabilityContentText:
        "Hizmet sağlayıcı olarak, bu sayfalardaki kendi içeriklerimizden genel yasalar çerçevesinde § 7 Abs. 1 TMG'ye göre sorumluyuz. Ancak §§ 8-10 TMG'ye göre, iletilen veya depolanan üçüncü taraf bilgilerini izlemekle yükümlü değiliz.",
      liabilityLinks: "Bağlantı Sorumluluğu",
      liabilityLinksText:
        "Web sitemiz, içerikleri üzerinde hiçbir etkimiz olmayan harici üçüncü taraf web sitelerine bağlantılar içermektedir. Bağlantı verilen sayfaların içeriğinden her zaman ilgili sağlayıcı veya işletmeci sorumludur.",
      address: "Tam adres, ticaret sicili kaydı yapıldığında eklenecektir.",
    },
  },

  privacy: {
    title: "Gizlilik Politikası",
    subtitle: "Datenschutzerklärung",
    notice:
      "Bu gizlilik politikası bir taslaktır. Ticaret sicili kaydı yapıldığında hukuki incelemeden geçmiş bir politikayla değiştirilecektir.",
    lastUpdated: "Son güncelleme: Mart 2026",
    sections: [
      {
        title: "1. Veri Koruma Özeti",
        content:
          "Aşağıda, bu web sitesini ziyaret ettiğinizde kişisel verilerinize ne olduğuna dair genel bir bakış sunulmaktadır. Kişisel veri, sizi kişisel olarak tanımlayabilecek her türlü veridir.",
      },
      {
        title: "2. Sorumlu Taraf",
        isResponsible: "true",
      },
      {
        title: "3. Veri Toplama",
        subsections: [
          {
            title: "İletişim Formu",
            content:
              "İletişim formu aracılığıyla gönderilen veriler, talebin işlenmesi ve takibi amacıyla saklanır. Hukuki dayanak: Sözleşmeye ilişkin talepler için GDPR Madde 6(1)(b), meşru menfaat için GDPR Madde 6(1)(f) veya onay verilmişse GDPR Madde 6(1)(a).",
          },
          {
            title: "Sunucu Günlük Dosyaları",
            content:
              "Barındırma sağlayıcısı, tarayıcı türü, işletim sistemi, yönlendiren URL, ana bilgisayar adı ve istek zamanını otomatik olarak toplar. Bu veriler belirli kişilere atanamaz.",
          },
        ],
      },
      {
        title: "4. Barındırma",
        content:
          "Bu web sitesi Vercel, Inc. (440 N Baxter St, Los Angeles, CA 90012, ABD) üzerinde barındırılmaktadır. Web sitemizi ziyaret ettiğinizde, IP adresiniz ve kullanım verileriniz Vercel tarafından işlenir. Daha fazla bilgi için Vercel'in gizlilik politikasına bakınız.",
      },
      {
        title: "5. Çerezler ve Analitik",
        subsections: [
          {
            title: "İzleme çerezi yok",
            content:
              "Bu web sitesi izleme çerezleri kullanmaz. Seçtiğiniz dili hatırlamak için tarayıcınızın yerel depolama alanında bir dil tercihi saklanır.",
          },
          {
            title: "Vercel Analytics",
            content:
              "Bu web sitesinde Vercel Analytics kullanıyoruz; bu araç çerez kullanmadan ve kişisel tanımlayıcılar olmadan anonim sayfa görüntüleme sayılarını toplar. Bireysel ziyaretçileri tanımlayamaz.",
          },
        ],
      },
      {
        title: "6. Haklarınız",
        content:
          "Saklanan verileriniz hakkında bilgi alma, düzeltme veya silme talep etme, işlemeyi kısıtlama ve bir denetim makamına şikayette bulunma hakkınız bulunmaktadır. Onay verilmişse, istediğiniz zaman geri çekebilirsiniz.",
      },
      {
        title: "7. Digital Business Card Ürünü",
        subsections: [
          {
            title: "Amaç ve hukuki dayanak",
            content:
              "Digital Business Card lead formu aracılığıyla gönderdiğiniz iletişim bilgilerini (ad, iş e-postası, şirket, ekip büyüklüğü, mesaj, GDPR onayı) yalnızca talebinizi yanıtlamak amacıyla işleriz. Hukuki dayanak: GDPR Madde 6(1)(b) (talebiniz üzerine sözleşme öncesi tedbirler) ve GDPR Madde 6(1)(a) (açık rızanız).",
          },
          {
            title: "Barındırma",
            content:
              "Kart verileri ve lead gönderimleri, Avrupa Birliği içinde, Frankfurt, Almanya'da bulunan sunucularda (Hetzner / IONOS) saklanır. ABD'de alt işleyici bulunmamaktadır.",
          },
          {
            title: "Saklama süresi",
            content:
              "Lead verileri 24 ay süreyle saklanır. Kullanılmayan Digital Business Card profilleri, hatırlatma e-postasının ardından 12 aylık hareketsizlik sonunda silinir.",
          },
          {
            title: "Silme hakkı",
            content:
              "Digital Business Card profilinizi ve ilgili tüm verileri hesabınız içinden tek tıklamayla veya contact@opsolid.de adresine e-posta göndererek silebilirsiniz. Silme işlemi 30 gün içinde tamamlanır.",
          },
        ],
      },
    ],
  },

  blog: {
    hero: {
      label: "Blog",
      headline: "Otomasyon ve Operasyonlar Hakkında İçgörüler",
      description:
        "İş akışı otomasyonu, entegrasyon stratejileri ve operasyonel verimlilik hakkında pratik makaleler.",
    },
    readMore: "Makaleyi Oku",
    minRead: "dk okuma",
    categories: {
      all: "Tümü",
      automation: "Otomasyon",
      integration: "Entegrasyon",
      ai: "Yapay Zeka",
      operations: "Operasyonlar",
    },
    posts: [
      {
        slug: "why-n8n-is-the-future-of-workflow-automation",
        title: "n8n Neden İş Akışı Otomasyonunun Geleceği",
        excerpt:
          "n8n'in, verileri üzerinde tam kontrol isteyen işletmeler için neden güçlü ve kendi sunucusunda barındırılan iş akışı otomasyonu platformu haline geldiğini keşfedin.",
        category: "automation",
        date: "2026-03-15",
        readTime: "6",
      },
      {
        slug: "5-signs-your-business-needs-process-automation",
        title: "İşletmenizin Süreç Otomasyonuna İhtiyacı Olduğunun 5 İşareti",
        excerpt:
          "Ekibiniz manuel işlere çok fazla zaman mı harcıyor? İşte otomasyona yatırım yapmanın zamanının geldiğini gösteren temel göstergeler.",
        category: "operations",
        date: "2026-03-08",
        readTime: "5",
      },
      {
        slug: "connecting-crm-erp-the-integration-playbook",
        title: "CRM ve ERP Bağlantısı: Entegrasyon Rehberi",
        excerpt:
          "CRM ve ERP sistemlerinizi senkronize etmek için pratik bir rehber — veri silolarını azaltarak tek bir doğru kaynak oluşturmak.",
        category: "integration",
        date: "2026-02-28",
        readTime: "8",
      },
      {
        slug: "ai-chatbots-vs-rule-based-bots",
        title: "Yapay Zeka Chatbot'ları ve Kural Tabanlı Botlar: Hangisine İhtiyacınız Var?",
        excerpt:
          "Yapay zeka destekli ve kural tabanlı chatbot'lar arasındaki farkı ve her yaklaşımın işletmeniz için ne zaman mantıklı olduğunu anlayın.",
        category: "ai",
        date: "2026-02-20",
        readTime: "7",
      },
      {
        slug: "make-vs-zapier-vs-n8n-comparison",
        title:
          "Make vs. Zapier vs. n8n: Doğru Otomasyon Platformunu Seçmek",
        excerpt:
          "En popüler üç otomasyon platformunun ayrıntılı karşılaştırması — özellikler, fiyatlandırma, esneklik ve her birinin ne zaman kullanılacağı.",
        category: "automation",
        date: "2026-02-12",
        readTime: "10",
      },
      {
        slug: "whatsapp-business-automation-guide",
        title: "WhatsApp Business Otomasyon Rehberi",
        excerpt:
          "WhatsApp üzerinde müşteri iletişimini nasıl otomatize edeceğiniz — sipariş onaylarından destek botlarına — kişisel dokunuşu kaybetmeden.",
        category: "automation",
        date: "2026-02-05",
        readTime: "9",
      },
    ],
    cta: {
      headline: "Operasyonlarınızı otomatize etmek mi istiyorsunuz?",
      description:
        "Ücretsiz bir tanışma görüşmesi planlayın. OpSolid, işletmeniz için en yüksek etkili otomasyon fırsatlarını belirlemenize yardımcı olur.",
      primaryCta: "Tanışma Görüşmesi Planlayın",
    },
  },

  faq: {
    hero: {
      label: "SSS",
      headline: "Sıkça Sorulan Sorular",
      description:
        "Otomasyon hizmetleri, süreç ve teknoloji hakkında sık sorulan sorular.",
    },
    allFilter: "Tümü",
    categories: {
      general: "Genel",
      technical: "Teknik",
      process: "Süreç ve Fiyatlandırma",
    },
    items: [
      {
        question: "OpSolid tam olarak ne yapar?",
        answer:
          "OpSolid, işletmeler için otomasyon sistemleri, entegrasyonlar ve dahili araçlar geliştirir. Ekibiniz manuel, tekrarlayan işlere — veri girişi, e-posta takipleri, sipariş işleme, rapor oluşturma — zaman harcıyorsa, OpSolid bunları otomatik ve güvenilir bir şekilde yürüten sistemler geliştirir.",
        category: "general",
      },
      {
        question: "Hangi araçlar ve platformlar kullanılıyor?",
        answer:
          "Ana otomasyon platformu n8n'dir, uygun olduğunda Make ve Zapier ile desteklenir. Özel entegrasyonlar API'ler, veritabanları ve bulut hizmetleri kullanılarak geliştirilir. Yapay zeka destekli iş akışları için güvenilir temel modeller ve yapılandırılmış yaklaşımlar kullanılır. Her kullanım senaryosu için doğru araç seçilir — tek tip yaklaşım asla uygulanmaz.",
        category: "technical",
      },
      {
        question: "n8n nedir ve neden tercih edilir?",
        answer:
          "n8n, kendi sunucunuzda barındırılabilen, verileriniz ve iş akışlarınız üzerinde tam kontrol sağlayan açık kaynaklı bir iş akışı otomasyon platformudur. Esnek, yüzlerce entegrasyonu destekler ve gerektiğinde özel kod yazılmasına olanak tanır. İş otomasyonu için güç, esneklik ve veri egemenliği arasında güçlü bir denge sunar.",
        category: "technical",
      },
      {
        question: "Tipik bir proje ne kadar sürer?",
        answer:
          "Çoğu proje, karmaşıklığa bağlı olarak keşiften devreye almaya kadar 2-6 hafta sürer. Basit otomasyonlar günler içinde canlıya alınabilir. Karmaşık çoklu sistem entegrasyonları daha uzun sürebilir. Çalışmalar iteratif olarak yapılır — sonuçları erken ve sık görürsünüz.",
        category: "process",
      },
      {
        question: "Devreye alma sonrası sürekli destek var mı?",
        answer:
          "Evet. Devreye alma sonrasında izleme, bakım ve optimizasyon hizmetleri mevcuttur. Otomasyon sistemleri işletmeniz büyüdükçe gelişir — sürekli destek, sistemlerinizin ayak uydurmasını sağlar. Ekibinizin günlük operasyonları bağımsız olarak yönetebilmesi için dokümantasyon ve eğitim de sağlanır.",
        category: "process",
      },
      {
        question: "Maliyeti ne kadar?",
        answer:
          "Her proje farklıdır. Ücretsiz bir ilk görüşme ihtiyaçlarınızı anlamaya yardımcı olur, ardından şeffaf bir teklif sunulur. Fiyatlandırma saatlik değil, proje bazlıdır — yatırımı önceden bilirsiniz.",
        category: "process",
      },
      {
        question: "OpSolid mevcut sistemlerle entegre olabilir mi?",
        answer:
          "Neredeyse kesinlikle. OpSolid; CRM'ler (HubSpot, Salesforce, Pipedrive), ERP'ler (SAP, Oracle, Odoo), e-ticaret platformları (Shopify, WooCommerce), veritabanları, Google Workspace ve API'si olan neredeyse her sistemle çalışır.",
        category: "technical",
      },
      {
        question: "Mevcut araçların değiştirilmesi gerekiyor mu?",
        answer:
          "Hayır. OpSolid, mevcut araçlarınızı birbirine bağlayan sistemler geliştirir — onların yerini almaz. Amaç, sahip olduğunuz araçların birlikte daha iyi çalışmasını sağlamak, veri silolarını ve manuel aktarımları ortadan kaldırmaktır.",
        category: "general",
      },
      {
        question: "Veriler güvende mi?",
        answer:
          "Evet. Tüm otomasyon altyapısı kendi ortamınızda barındırılabilir. GDPR/KVKK gereksinimlerine uyulur, hassas veriler için şifreleme kullanılır ve tüm bağlantılar güvenli API'ler üzerinden yapılır. Siz açıkça bulut barındırmalı çözümleri tercih etmediğiniz sürece hiçbir veri üçüncü taraf sunucularından geçmez.",
        category: "technical",
      },
      {
        question: "Hangi sektörlere hizmet veriliyor?",
        answer:
          "OpSolid, sektörler genelinde çalışır — e-ticaret, lojistik, üretim, profesyonel hizmetler ve daha fazlası. Çözümler sektör etiketinize göre değil, süreçlerinize göre geliştirilir. Operasyonlarınız tekrarlayan manuel iş içeriyorsa, otomasyon yardımcı olabilir.",
        category: "general",
      },
    ],
    cta: {
      headline: "Hâlâ sorularınız mı var?",
      description:
        "Özel durumunuzu görüşmek için ücretsiz bir tanışma görüşmesi planlayın — hiçbir yükümlülük yok.",
      primaryCta: "Tanışma Görüşmesi Planlayın",
    },
  },

  products: {
    hero: {
      label: "Ürünlerimiz",
      headline: "Kendi geliştirdiğimiz yazılım ürünleri",
      description:
        "Özel projelerin yanı sıra OpSolid, kendi yazılım ürünlerini de geliştirip işletir — aynı otomasyon ve yapay zekâ temelleri üzerine inşa edilmiş, üretime hazır olgun sistemler.",
    },
    comingSoonLabel: "Geliştirme aşamasında",
    comingSoonTitle: "Yeni ürünler yolda",
    comingSoonDescription:
      "OpSolid'in ürün portföyü genişliyor. Operasyon, iletişim ve yapay zekâ destekli iş akışları için yeni araçlar şu anda geliştirme aşamasında.",
    items: [
      {
        name: "Dijital Kartvizit",
        tagline: "Link · QR kod · opsiyonel NFC",
        description:
          "Almanya'da barındırılan bir dijital kartvizit. Profilinizi link, QR kod veya opsiyonel NFC kart olarak paylaşın. Emlakçı, kuaför, klinik, restoran, fotoğrafçı gibi meslekler için sektör şablonları — hepsi GDPR-yerli.",
        status: "Canlı",
        href: "/products/digital-card",
        externalUrl: "",
        icon: "idCard",
      },
      {
        name: "Dijital Resepsiyon",
        tagline: "AI resepsiyon · mikro-SaaS",
        description:
          "Oteller, klinikler, kuaförler ve hizmet işletmeleri için bağımsız AI destekli resepsiyon. Web formları, e-posta alımı, opsiyonel ses ajanı — Instagram veya WhatsApp Business doğrulamasına ihtiyaç yok.",
        status: "Canlı",
        href: "/products/digital-reception",
        externalUrl: "",
        icon: "bell",
      },
      {
        name: "Kutasia",
        tagline: "Çoklu sektör müşteri platformu",
        description:
          "Tam platform — müşteri iletişimini, talepleri, rezervasyonları ve içeriği kanallar arasında birleştiren çok kiracılı SaaS. Sektöre özel iş akışları ve AI destekli analiz. Bireysel modüller bağımsız ürün olarak da mevcut.",
        status: "Canlı",
        href: "/products/kutasia",
        externalUrl: "https://kutasia.com",
        icon: "sparkles",
      },
    ],

    digitalCard: {
      hero: {
        eyebrow: "[ OPSOLID ÜRÜN · 01 ]   DİJİTAL KARTVİZİT",
        title: [
          "Tek link, tek QR,",
          "tek profil —",
          "Almanya'da barındırılır.",
        ],
        paragraph:
          "Link veya QR kod olarak paylaşacağınız bir dijital kartvizit. Fiziksel dokunuş isterseniz opsiyonel NFC kart. Emlakçı, kuaför, fotoğrafçı, klinik, restoran gibi meslekler için sektör şablonları. GDPR-yerli, Almanya'da barındırılır — ABD abonelik kilidi yok.",
        primaryCta: "Demo planla",
        secondaryCta: "Nasıl çalışır",
        tags: "LİNK · QR KOD · NFC (OPSİYONEL) · APPLE WALLET · GDPR",
        cardLabels: {
          name: "Hasan Dönmez",
          role: "Otomasyon Stüdyosu",
          company: "OpSolid · Hamburg",
          nfc: "QR",
          chip: "TARATIN VEYA DOKUNUN",
        },
      },
      features: {
        label: "YETENEKLER",
        heading: "Her yerde çalışan bir profil — linkiniz, QR'ınız, kartınız.",
        intro:
          "Kartınızı duruma göre verin: e-posta imzasında link, duvarda QR kod ya da opsiyonel NFC kart. Aynı profil, üç dağıtım modu.",
        items: [
          {
            label: "LİNK · 01",
            title: "Paylaşılabilir link",
            desc: "E-posta imzanıza, WhatsApp biyografinize, Instagram bağlantınıza veya mesajlarınıza eklediğiniz temiz bir URL. Karşı tarafın uygulama yüklemesine gerek yok.",
            icon: "link",
          },
          {
            label: "QR · 02",
            title: "Dinamik QR kod",
            desc: "Basılabilir, yeniden üretilebilir QR kod. Vitrinde, menüde, fuar standında ya da Zoom arka planında — her zaman güncel profile yönlendirir.",
            icon: "qr",
          },
          {
            label: "NFC · 03",
            title: "Opsiyonel NFC kart",
            desc: "Fiziksel kart isterseniz: mat, ahşap veya metal NFC kartlar Hamburg'dan gönderilir. Tamamen opsiyoneldir — dijital profil kart olmadan da çalışır.",
            icon: "nfc",
          },
          {
            label: "ŞABLON · 04",
            title: "Sektör şablonları",
            desc: "Emlakçı, kuaför, klinik, fotoğrafçı, restoran, mali müşavir, avukat ve daha fazlası için hazır tasarımlar. Her biri kendi alanları, bölümleri, tonuyla.",
            icon: "templates",
          },
          {
            label: "WALLET + CRM · 05",
            title: "Wallet kartı ve CRM senkronu",
            desc: "Otomatik güncellenen Apple & Google Wallet kartları. Yakalanan leadler HubSpot, Pipedrive, Salesforce'a ya da CSV'ye senkronlanır. Yerel — Zapier gerekmez.",
            icon: "wallet",
          },
          {
            label: "HOSTING · 06",
            title: "Almanya'da barındırılıyor",
            desc: "Hetzner / IONOS Frankfurt. GDPR-yerli. ABD alt işleyen yok. Kayıt anında DPA hazır. Tek tıkla silme, her zaman.",
            icon: "hosting",
          },
        ],
      },
      compliance: {
        label: "VERİ EGEMENLİĞİ",
        heading: "Kartınızın verisi nerede yaşıyor?",
        intro:
          "Rakiplerin çoğu gururla ABD'de barındırıyor. Biz barındırmıyoruz. Önemli olan tam da bu.",
        cols: [
          "Sağlayıcı",
          "Hosting bölgesi",
          "Alt işleyenler",
          "GDPR DPA",
          "Tek tıkla silme",
        ],
        rows: [
          {
            provider: "Popl",
            host: "ABD",
            sub: "ABD (AWS, Heroku)",
            dpa: "SCC üzerinden",
            del: "Kısmen",
            highlight: "",
          },
          {
            provider: "Blinq",
            host: "AU",
            sub: "ABD (AWS Sydney)",
            dpa: "SCC üzerinden",
            del: "Kısmen",
            highlight: "",
          },
          {
            provider: "Lemontaps",
            host: "DE (Frankfurt)",
            sub: "Sınırlı",
            dpa: "Evet",
            del: "Evet",
            highlight: "",
          },
          {
            provider: "OpSolid Dijital Kartvizit",
            host: "DE (Frankfurt)",
            sub: "ABD alt işleyen yok",
            dpa: "Yerli",
            del: "Evet",
            highlight: "true",
          },
        ],
      },
      pricing: {
        label: "FİYATLANDIRMA",
        heading: "Tek seferlik, abonelik ya da ücretsiz. Kilitli kalmazsınız.",
        popularBadge: "EN POPÜLER",
        plans: [
          {
            name: "Ücretsiz",
            price: "€0",
            cadence: "",
            popular: "",
            bullets: [
              "Dijital profil, 1 kart",
              "Temel analiz",
              "OpSolid filigranı",
              "Girişimciler ve freelancerlar için ideal",
            ],
            cta: "Profil oluştur",
            href: "/contact?source=dbc-free",
          },
          {
            name: "Team",
            price: "€4,90",
            cadence: "kullanıcı başı / ay",
            popular: "true",
            bullets: [
              "Ücretsiz'deki her şey",
              "Gelişmiş analiz",
              "CRM senkronizasyonu (HubSpot, Pipedrive, Salesforce)",
              "Özel domain ve tam markalama",
              "Roster + SSO",
              "Yıllık faturalandırma, min. 5 koltuk",
            ],
            cta: "Demo planla",
            href: "#lead",
          },
          {
            name: "NFC + Lifetime",
            price: "€39",
            cadence: "tek seferlik, kart başı",
            popular: "",
            bullets: [
              "Mat ya da ahşap NFC kart, Hamburg'dan gönderim",
              "Sonsuza kadar ücretsiz dijital hesap",
              "Abonelik yok, asla",
              "İstediğinde Team'e yükselt",
            ],
            cta: "Kart iste",
            href: "#lead",
          },
        ],
      },
      lead: {
        label: "TALEP",
        heading: "Demo planla — ya da ilk kartını al.",
        intro:
          "Ekip büyüklüğünüzü ve dijital kartlarla ne yapmak istediğinizi kısaca yazın. Bir iş günü içinde dönüş yapıyoruz.",
        fields: {
          name: "Ad Soyad",
          email: "İş e-postası",
          company: "Şirket (opsiyonel)",
          teamSize: "Ekip büyüklüğü",
          teamSizeOptions: ["1", "2 – 10", "11 – 50", "50+"],
          message: "Bilmemiz gereken bir şey var mı? (opsiyonel)",
          consent:
            "Bu talebime yanıt vermesi için OpSolid'in bu verileri işlemesine izin veriyorum. Gizlilik Politikası'na bakabilirsiniz.",
          privacyLink: "Gizlilik Politikası",
          submit: "Talep gönder",
          submitting: "Gönderiliyor…",
          success:
            "Teşekkürler — bir iş günü içinde dönüş yapacağız.",
          error:
            "Bir sorun oluştu. Lütfen doğrudan contact@opsolid.de adresine yazın.",
        },
      },
      testimonials: {
        label: "Sosyal kanıt",
        heading: "Geçiş yapan müşteriler ne söylüyor.",
        items: [
          {
            quote:
              "Bir haftada üç şehirdeki kağıt kartları değiştirdik. Müşteri adayları saniyeler içinde HubSpot'a düşüyor, kimsenin bir şey yazmasına gerek kalmadı.",
            name: "Lena Richter",
            role: "Satış Direktörü",
            company: "Berlin merkezli scale-up",
          },
          {
            quote:
              "Verilerin Almanya'da kalması, hukuk ekibimizi ikna etti. Geri kalan her şey artı bir bonustu.",
            name: "Marco Weber",
            role: "COO",
            company: "Münih sanayi grubu",
          },
          {
            quote:
              "Ömür boyu kart için tek seferlik 39 €. Abonelik tuzağı yok. Sırf bu yüzden ABD ürününden geçtim.",
            name: "Sarah Klein",
            role: "Bağımsız danışman",
            company: "Hamburg",
          },
        ],
      },
      howItWorks: {
        label: "Nasıl çalışır",
        heading: "Üç adım. Beş dakikadan az.",
        steps: [
          {
            title: "Kartınızı sipariş edin",
            description:
              "Mat, metal veya ahşap seçin. Hamburg'dan iki iş günü içinde kargolarız.",
          },
          {
            title: "Profilinizi oluşturun",
            description:
              "Fotoğrafınızı, bağlantılarınızı, sosyal hesaplarınızı ve takviminizi ekleyin. Anlık önizleme.",
          },
          {
            title: "Dokunun ve paylaşın",
            description:
              "Tek dokunuş her şeyi paylaşır. Her etkileşimi panelinizden takip edin.",
          },
        ],
      },
      faq: {
        label: "SSS",
        heading: "Sık sorulan sorular.",
        items: [
          {
            question: "Kartlar her telefonla çalışıyor mu?",
            answer:
              "Evet. NFC, modern iOS ve Android cihazlarının tümünde desteklenir. Alıcının uygulama kurmasına gerek yoktur.",
          },
          {
            question: "Verilerim nerede saklanıyor?",
            answer:
              "Almanya / Frankfurt'ta, Hetzner ve IONOS altyapısında. Sıfır ABD alt işleyen. Kayıt olur olmaz DPA hazır.",
          },
          {
            question: "İstediğim zaman iptal edebilir miyim?",
            answer:
              "39 €'luk ömür boyu kartın aboneliği hiç yok. Ekip planları ilk yıldan sonra aylık olarak iptal edilebilir.",
          },
          {
            question: "Mevcut CRM'imi tutabilir miyim?",
            answer:
              "Evet. HubSpot, Pipedrive ve Salesforce ile yerli olarak senkronize oluruz — diğer her şey için CSV'ye aktarırız. Zapier gerekmez.",
          },
        ],
      },
      cta: {
        eyebrow: "HAZIR MISIN?",
        heading:
          "Bir sonraki kartınız Hamburg'dan gelir,\nSan Francisco'dan değil.",
        primaryCta: "Görüşme planla",
        secondaryCta: "/contact'a git",
      },
      meta: {
        title: "Dijital Kartvizit — Almanya'da barındırılıyor | OpSolid",
        description:
          "GDPR-yerli dijital profile sahip modern NFC kartvizit. Apple & Google Wallet, CRM senkronizasyonu, ekip listesi — Hamburg'da barındırılıyor, San Francisco'da değil.",
      },
    },

    digitalReception: {
      hero: {
        eyebrow: "[ OPSOLID ÜRÜN · 02 ]   DİJİTAL RESEPSİYON",
        title: [
          "Kimse yokken bile",
          "cevap veren",
          "bir AI resepsiyon.",
        ],
        paragraph:
          "Dijital Resepsiyon, bağımsız bir mikro-SaaS — oteller, klinikler, kuaförler ve hizmet işletmeleri için AI destekli bir ön büro. Web form + e-posta alımı + opsiyonel ses ajanı. Instagram veya WhatsApp Business doğrulamasına ihtiyaç yok. Tek başına ya da Kutasia içinde modül olarak.",
        primaryCta: "Demo planla",
        secondaryCta: "Nasıl çalışır",
        tags: "AI ALIM · WEB FORMU · E-POSTA · OPSİYONEL SES · GDPR",
      },
      features: {
        label: "YETENEKLER",
        heading: "Uyumayan, hasta olmayan, takvimi karıştırmayan bir resepsiyon.",
        intro:
          "Resepsiyonun iyi yapması gereken tek işe odaklanır: talebi alır, önceliklendirir, sıkça sorulanları yanıtlar ve geri kalanı düzgün şekilde bir insana yönlendirir.",
        items: [
          {
            label: "ALIM · 01",
            title: "Akıllı web formu",
            desc: "Siteniz için markalı alım formu. Dinamik sorular, koşullu mantık ve hizmet türüne göre otomatik yönlendirme.",
            icon: "form",
          },
          {
            label: "E-POSTA · 02",
            title: "AI e-posta triyajı",
            desc: "Gelen e-postalar AI tarafından özetlenir, sınıflandırılır ve yönlendirilir. Yanıt taslakları önerilir — son onayı her zaman insan verir.",
            icon: "mail",
          },
          {
            label: "SES · 03",
            title: "Opsiyonel ses ajanı",
            desc: "Mesai sonrası telefonu açan GDPR uyumlu bir ses ajanı. Almanca, İngilizce, Türkçe. Konuşmalar yazıya dökülüp e-posta kutunuza düşer.",
            icon: "phone",
          },
          {
            label: "REZERVASYON · 04",
            title: "Takvim rezervasyonları",
            desc: "Google Takvim, Outlook veya Cal.com'a bağlanır. Kırık Instagram DM entegrasyonu yok — sadece takvim müsaitliği ve onaylı rezervasyonlar.",
            icon: "calendar",
          },
          {
            label: "ANALİZ · 05",
            title: "Sade analiz",
            desc: "Taleplerin nereden geldiği, ne kadar hızlı yanıtlandığı, en çok hangi hizmetlerin sorulduğu. Tek panel, 40 sekmeli CRM yok.",
            icon: "chart",
          },
          {
            label: "HOSTING · 06",
            title: "Almanya'da barındırılıyor",
            desc: "Hetzner / IONOS Frankfurt. GDPR-yerli. ABD'ye veri aktarımı yok. Tek başına ya da Kutasia içinde modül olarak çalışır.",
            icon: "hosting",
          },
        ],
      },
      useCases: {
        label: "KİME GÖRE",
        heading: "Resepsiyonu darboğaz olan küçük ekipler.",
        intro:
          "Dijital Resepsiyon bilerek dar tutulmuştur — kaçırılan çağrı, geciken e-posta ve taşan DM kaosunu tek bir düzenli alımla değiştirir.",
        items: [
          {
            title: "Oteller & pansiyonlar",
            desc: "Rezervasyon soruları, gece saatlerindeki talepler, çok dilli misafirler. Ses ajanı + form + e-posta triyajı — mevcut resepsiyonunuzu ikame etmeden.",
          },
          {
            title: "Klinikler & muayenehaneler",
            desc: "Randevu alımı, ilaç soruları, randevuya gelmeme oranını azaltma. Alım formları sağlık verisi için GDPR'a uyar. İnsan her zaman döngüde.",
          },
          {
            title: "Kuaförler & spalar",
            desc: "Randevu alma, hizmet soruları, walk-in triyajı. AI tekrarlayan soruları halleder, ekip koltuktaki müşteriye odaklanır.",
          },
          {
            title: "Hizmet işletmeleri",
            desc: "Tesisatçı, elektrikçi, mali müşavir, avukat — telefonu darboğaz olan herkes. Tamamen markalı alım, doğru kişiye yönlendirme.",
          },
        ],
      },
      pricing: {
        label: "FİYATLANDIRMA",
        heading: "Küçük, dürüst, aylık. İstediğiniz zaman iptal.",
        popularBadge: "EN POPÜLER",
        plans: [
          {
            name: "Başlangıç",
            price: "29 €",
            cadence: "aylık",
            popular: "",
            bullets: [
              "Web alım formu",
              "AI e-posta triyajı (1 posta kutusu)",
              "Aylık 100 konuşma",
              "EN · DE · TR",
            ],
            cta: "Ücretsiz dene",
            href: "#lead",
          },
          {
            name: "Resepsiyon",
            price: "79 €",
            cadence: "aylık",
            popular: "true",
            bullets: [
              "Başlangıç'taki her şey",
              "Sınırsız posta kutusu ve form",
              "Takvim rezervasyon entegrasyonu",
              "Aylık 500 konuşma",
              "Özel alan adı ve markalama",
            ],
            cta: "Demo planla",
            href: "#lead",
          },
          {
            name: "Voice+",
            price: "149 €",
            cadence: "aylık",
            popular: "",
            bullets: [
              "Resepsiyon'daki her şey",
              "AI ses ajanı (EN · DE · TR)",
              "Mesai sonrası çağrı yönetimi",
              "Aylık 1.500 konuşma",
              "Öncelikli destek",
            ],
            cta: "Demo planla",
            href: "#lead",
          },
        ],
      },
      lead: {
        label: "TALEP",
        heading: "İşletmenizde deneyin — ücretsiz 30 dakikalık kurulum.",
        intro:
          "Ne tür işletme yürüttüğünüzü ve yaklaşık kaç talep aldığınızı anlatın. Kurulumu birlikte yürütüp bir deneme başlatırız.",
        fields: {
          name: "Adınız Soyadınız",
          email: "İş e-posta adresi",
          company: "İşletme adı",
          businessType: "İşletme türü",
          businessTypeOptions: ["Otel / pansiyon", "Klinik / muayenehane", "Kuaför / spa", "Hizmet işletmesi", "Diğer"],
          message: "Bilmemizi istediğiniz bir şey var mı? (opsiyonel)",
          consent:
            "OpSolid'in bu gönderimi cevap vermek amacıyla işlemesini kabul ediyorum. Gizlilik Politikası'na bakın.",
          privacyLink: "Gizlilik Politikası",
          submit: "Talep gönder",
          submitting: "Gönderiliyor…",
          success:
            "Teşekkürler — bir iş günü içinde yanıtlayacağız.",
          error:
            "Bir şeyler yanlış gitti. Lütfen doğrudan contact@opsolid.de adresine yazın.",
        },
      },
      faq: {
        label: "SSS",
        heading: "Dürüst cevaplar.",
        items: [
          {
            question: "Bu resepsiyon personelimi yerine geçer mi?",
            answer:
              "Hayır — yüklerini azaltır. AI tekrarlayan, düşük değerli soruları halleder; ekibiniz karşılarındaki müşteriye / misafir / hastaya odaklanır. Önemli olan her şey için son onayı insan verir.",
          },
          {
            question: "Instagram veya WhatsApp Business'e ihtiyacım var mı?",
            answer:
              "Hayır. Dijital Resepsiyon, iş doğrulaması gerektiren platformları bilinçli olarak atlar. Web formu, e-posta ve opsiyonel olarak telefon numarası ile çalışır — Meta/Instagram entegrasyonuna gerek yok.",
          },
          {
            question: "Sağlık verisi için GDPR uyumlu mu?",
            answer:
              "Evet. Frankfurt'ta barındırılır, veriler şifrelenir, kayıt anında DPA verilir. Klinikler ve muayenehaneler için BDSG uyumlu kurulum özel onboarding ile gelir.",
          },
          {
            question: "Daha sonra Kutasia'ya bağlayabilir miyim?",
            answer:
              "Evet. Dijital Resepsiyon bağımsız bir üründür — ama daha büyüyüp tam Kutasia platformuna ihtiyaç duyarsanız (birleşik posta kutusu, sektör iş akışları, AI analiz), veri göçüne gerek kalmadan modül olarak entegre olur.",
          },
        ],
      },
      cta: {
        eyebrow: "HAZIR MISINIZ?",
        heading:
          "Resepsiyonunuz sabah 2'de cevap versin —\nyeni bir kişi almadan.",
        primaryCta: "Demo planla",
        secondaryCta: "Bizimle konuşun",
      },
      meta: {
        title: "Dijital Resepsiyon — Otel, Klinik ve Kuaförler için AI Ön Büro | OpSolid",
        description:
          "Hizmet işletmeleri için bağımsız AI resepsiyon. Web formları, e-posta triyajı, opsiyonel ses ajanı. GDPR-yerli, Almanya'da barındırılır. Instagram Business doğrulaması gerektirmez.",
      },
    },

    kutasia: {
      hero: {
        eyebrow: "Bir OpSolid ürünü · Platform",
        label: "Kutasia",
        headline: "Müşteri operasyonu,\nbirleşik ve akıllı",
        subheadline:
          "Kutasia; mesajlaşmayı, talepleri, rezervasyonları ve içerikleri yapay zekâ destekli tek bir çalışma alanında birleştiren çok kiracılı SaaS platformdur — sektörünüze göre uyarlanmıştır. Modüler yapı: temel modüller (Dijital Resepsiyon, Dijital Kartvizit) bağımsız ürün olarak da mevcut.",
        primaryCta: "Kutasia'yı Ziyaret Et",
        secondaryCta: "Ekiple Görüşün",
        primaryCtaHref: "https://kutasia.com",
        secondaryCtaHref: "/contact",
        domain: "kutasia.com",
      },

      trustStrip: [
        "Çok kiracılı SaaS",
        "AES-256 şifreleme",
        "KVKK/GDPR uyumlu",
        "EN / DE / TR",
      ],

      features: {
        label: "Platform Yetenekleri",
        headline: "Bir operasyon ekibinin ihtiyacı olan her şey",
        description:
          "Kutasia, işletmelerin kanallar arasında yönettiği araçları tek bir yerde toplar — sektöre özel yapı ve konuşmaları içgörüye dönüştüren yapay zekâ ile.",
        items: [
          {
            icon: "inbox",
            title: "Birleşik Gelen Kutusu",
            description:
              "E-posta, web formları ve opsiyonel mesajlaşma kanalları (WhatsApp Business API, onaylanan yerlerde Instagram) tek iş parçacığı mantığında — otomatik atama ve durum takibi ile. Kanaldan bağımsız: hangi entegrasyonun aktif olacağına siz karar verirsiniz.",
          },
          {
            icon: "bot",
            title: "Yapay Zekâ Analizi",
            description:
              "Her mesaj için duygu, niyet ve rezervasyon niyeti skorlama — acil konuşmalar ve fırsatlar otomatik olarak öne çıkar.",
          },
          {
            icon: "layers",
            title: "Sektör Şablonları",
            description:
              "Otel, kuaför, kuyumcu, klinik, restoran, muhasebe ve daha fazlası — her sektör kendi alanları, terminolojisi ve iş akışlarıyla gelir.",
          },
          {
            icon: "lineChart",
            title: "Operasyonel Panolar",
            description:
              "Günlük özetler, KPI trendleri, kanal dağılımı ve yapay zekâ içgörüleri — çok sektörlü operasyon için tasarlanmış tek panoda.",
          },
          {
            icon: "shield",
            title: "Güvenli Çok Kiracılı",
            description:
              "AES-256-GCM şifreli OAuth token'ları, sıkı kiracı izolasyonu, rol bazlı erişim kontrolü ve KVKK/GDPR uyumlu veri işleme.",
          },
          {
            icon: "languages",
            title: "Avrupa için tasarlandı",
            description:
              "Yerel İngilizce, Almanca ve Türkçe — sektör terminolojisi her endüstriye özel çevrilmiş, sınır ötesi operasyona hazır.",
          },
        ],
      },

      sectors: {
        label: "Desteklenen Sektörler",
        headline: "Tek platform, on beş sektör",
        description:
          "Kutasia; alanlarını, dilini ve iş akışlarını çalıştığınız sektöre uyarlar — özel işlere jenerik şablon dayatmaz.",
        list: [
          { name: "Otel & Konaklama", icon: "bed" },
          { name: "Kuaför & Güzellik", icon: "scissors" },
          { name: "Kuyumculuk", icon: "gem" },
          { name: "Restoran", icon: "utensils" },
          { name: "Klinik & Sağlık", icon: "stethoscope" },
          { name: "Muhasebe", icon: "calculator" },
          { name: "Influencer", icon: "sparkles" },
          { name: "İçerik Üretici", icon: "video" },
          { name: "Freelancer", icon: "briefcase" },
          { name: "E-ticaret", icon: "shoppingBag" },
          { name: "Ajans", icon: "megaphone" },
          { name: "Eğitim", icon: "graduationCap" },
          { name: "Hukuk", icon: "scale" },
          { name: "Danışmanlık", icon: "lineChart" },
          { name: "Diğer", icon: "package" },
        ],
      },

      howItHelps: {
        label: "Dönüşüm",
        headline: "Dağınık kanallardan operasyonel netliğe",
        items: [
          {
            before: "Mesajlar Instagram, WhatsApp ve e-posta arasında kayboluyor",
            after: "Yapay zekâ ile öncelik skorlanmış birleşik gelen kutusu",
          },
          {
            before: "Sektörünüze uymayan genel amaçlı CRM",
            after: "Kutudan çıkar çıkmaz sektöre özel alanlar ve akışlar",
          },
          {
            before: "Manuel takipler ve konuşmalara dair içgörü yok",
            after: "Günlük yapay zekâ özetleri ve otomatik müşteri sinyalleri",
          },
          {
            before: "Araçlar arasında parçalanmış müşteri verisi",
            after: "Tam etkileşim geçmişiyle tekil müşteri profili",
          },
        ],
      },

      forWho: {
        label: "Kimler için",
        headline: "Müşteri iletişimine bağımlı ekipler için",
        items: [
          {
            title: "Yerel hizmet işletmeleri",
            description:
              "Rezervasyon ve müşteri ilişkilerini kanallar arasında yöneten otel, kuaför, klinik, kuyumcu ve restoranlar.",
          },
          {
            title: "Bireysel profesyoneller",
            description:
              "Yüksek hacimli müşteri iletişimini yöneten influencer, içerik üretici, freelancer ve danışmanlar.",
          },
          {
            title: "Küçük ajanslar",
            description:
              "Her biri kendi iş akışları, markası ve raporlama ihtiyacı olan birden fazla müşteri hesabını yöneten ekipler.",
          },
        ],
      },

      cta: {
        headline: "Kutasia'yı iş başında görün",
        description:
          "Platformu keşfetmek için kutasia.com'u ziyaret edin veya özelleştirilmiş bir tanıtım için OpSolid ekibiyle görüşün.",
        primaryCta: "kutasia.com'u ziyaret et",
        secondaryCta: "Tanıtım planla",
      },
    },
  },
} as const;
