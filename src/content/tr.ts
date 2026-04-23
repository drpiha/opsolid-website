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

    cardStrip: {
      eyebrow: "ŞABLONLAR",
      heading: "Hazır 10 sektör şablonu",
      paragraph:
        "Emlakçı, klinik, restoran, DJ, kuaför, e-ticaret, mimar, fitness — her sektöre özel 10 tap-to-share kart. Canlı önizleme için tıklayın.",
      ctaLabel: "Tüm şablonları gör",
      ctaHref: "/products/digital-card",
    },

    agentShowcase: {
      eyebrow: "AI AJANLARI",
      heading: "Telefonu gerçekten açan ajanlar",
      paragraph:
        "Telefon hattınızda ses, sitenizde sohbet, takviminizde rezervasyon — gerçek, üretime hazır yığınlar üzerine kurulu.",
      items: [
        {
          key: "voice",
          title: "Ses AI Ajanı",
          body: "7/24 telefon yanıtlama, yönlendirme, rezervasyon — Retell destekli.",
          href: "/products/voice-agent",
          badge: "Retell · Vapi",
        },
        {
          key: "chatbot",
          title: "Web Sitesi Chatbot'u",
          body: "Web, WhatsApp, Telegram aynı anda. CRM ile senkron.",
          href: "/products/chatbot",
          badge: "Çok kanallı",
        },
        {
          key: "booking",
          title: "Rezervasyon Ajanı",
          body: "Telefon veya sohbet → takvim. Çifte rezervasyon yok.",
          href: "/products/booking-agent",
          badge: "Cal.com",
        },
      ],
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
    categories: {
      all: "Tümü",
      customerFacing: "Müşteriye yönelik",
      internalOps: "Dahili operasyon",
      communication: "İletişim",
    },
    templatesStrip: {
      label: "SEKTÖR ŞABLONLARI",
      heading: "Özelleştirmeye hazır 10 şablon",
      paragraph:
        "Sektörünüzü seçin, özelleştirin, yayına alın. Emlakçı, klinik, restoran, DJ, kuaför, e-ticaret, mimar, fitness ve daha fazlası.",
      cta: "Kendi şablonunuzu özelleştirin",
      ctaHref: "/products/digital-card",
    },
    techStack: {
      label: "GERÇEK ALTYAPI ÜZERİNE KURULU",
      heading: "Sihir yok. Gerçek, üretime hazır teknoloji.",
      items: [
        "Retell AI",
        "Vapi",
        "Cal.com",
        "n8n",
        "Supabase",
        "Meta Business",
        "HubSpot",
        "Stripe",
      ],
    },
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
        startingPrice: "€39 tek seferlik · ücretsiz katman mevcut",
        category: "Müşteriye yönelik",
        stack: "Next.js · Hetzner · Apple Wallet · HubSpot",
      },
      {
        name: "Ses AI Ajanı",
        tagline: "7/24 telefon resepsiyonu · Retell · Vapi",
        description:
          "Telefon hattınıza 7/24 yanıt veren, randevu oluşturan ve çağrıları yönlendiren bir AI ses ajanı. Çok dilli (DE/EN/TR). Retell AI veya Vapi üzerine kurulu, takvim senkronu ile. Aylık 3.000 €'luk resepsiyonist işinin yerini alır.",
        status: "Canlı",
        href: "/products/voice-agent",
        externalUrl: "",
        icon: "phone",
        startingPrice: "€1.200 kurulum + €0,12/dk'dan başlar",
        category: "İletişim",
        stack: "Retell AI · Vapi · Cal.com · Supabase",
      },
      {
        name: "Web Sitesi Chatbot'u",
        tagline: "Çok kanallı · web · WhatsApp · Telegram",
        description:
          "Sitenizde, WhatsApp'ta ve Telegram'da aynı anda yaşayan bir chatbot. Leadleri niteler, SSS'leri yanıtlar, CRM'e senkronlar. Bağlam farkındalıklı çok turlu konuşmalar, senaryo duvarı yok.",
        status: "Canlı",
        href: "/products/chatbot",
        externalUrl: "",
        icon: "messageCircle",
        startingPrice: "€1.800 kurulum + €99/ay'dan başlar",
        category: "Müşteriye yönelik",
        stack: "OpenAI · n8n · Supabase · HubSpot",
      },
      {
        name: "WhatsApp Business Ajanı",
        tagline: "Resmi Meta API · sipariş durumu · ödemeler",
        description:
          "Resmi Meta Business Cloud API üzerinden WhatsApp otomasyonu (doğrulanmış BSP aracılığıyla — Twilio, 360dialog, AiSensy). Sipariş durumu, destek, nitelendirme, ödeme tetikleri. Gri piyasa kazıma yok, ban riski yok.",
        status: "Canlı",
        href: "/products/whatsapp-agent",
        externalUrl: "",
        icon: "messagesSquare",
        startingPrice: "€1.500 kurulum + Meta ücretleri'nden başlar",
        category: "İletişim",
        stack: "Meta Business Cloud · 360dialog · Twilio · Stripe",
      },
      {
        name: "Randevu Rezervasyon Ajanı",
        tagline: "Cal.com + ses + sohbet",
        description:
          "Telefon, sohbet veya form üzerinden rezervasyon alan bir ajan. Google Takvim/Outlook/Cal.com ile çift yönlü senkron. Yeniden planlama, hatırlatma ve randevuya gelmeme takiplerini yönetir.",
        status: "Canlı",
        href: "/products/booking-agent",
        externalUrl: "",
        icon: "calendarClock",
        startingPrice: "€800 kurulum + €49/ay'dan başlar",
        category: "Dahili operasyon",
        stack: "Cal.com · Retell · n8n · Google Calendar",
      },
      {
        name: "E-posta Otomasyon Ajanı",
        tagline: "Dış iletişim · triyaj · yanıt taslağı",
        description:
          "AI e-posta iş akışları — kişiselleştirilmiş varyantlarla soğuk dış iletişim, gelen kutusu triyajı, onay için otomatik taslaklar. Instantly / AgentMail / özel n8n akışları üzerine kurulu. Deliverability ısıtılmış, GDPR uyumlu.",
        status: "Canlı",
        href: "/products/email-agent",
        externalUrl: "",
        icon: "mail",
        startingPrice: "€99 – €499/ay'dan başlar",
        category: "İletişim",
        stack: "Instantly · AgentMail · n8n · OpenAI",
      },
      {
        name: "Lead Nitelendirme Ajanı",
        tagline: "Ses + sohbet · CRM skorlama · HubSpot senkron",
        description:
          "Gelen leadleri ses veya sohbet üzerinden niteleyen, skorlayan ve nitelikli leadleri HubSpot/Pipedrive/Salesforce'a yönlendiren bir konuşma ajanı. %40 MQL→SQL dönüşüm artışı gerçekçi.",
        status: "Canlı",
        href: "/products/lead-qualifier",
        externalUrl: "",
        icon: "userCheck",
        startingPrice: "€2.200 kurulum + €199/ay'dan başlar",
        category: "Müşteriye yönelik",
        stack: "Retell · HubSpot · n8n · Supabase",
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
        startingPrice: "€29/ay'dan başlar",
        category: "Dahili operasyon",
        stack: "Retell · Cal.com · Postmark · Supabase",
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
        startingPrice: "Özel fiyatlandırma · kiracı başına",
        category: "Dahili operasyon",
        stack: "Next.js · Postgres · OpenAI · Stripe",
      },
    ],

    digitalCard: {
      hero: {
        eyebrow: "[ OPSOLID ÜRÜN · 01 ]   DİJİTAL KARTVİZİT",
        title: [
          "El yapımı tasarım",
          "dijital kartvizitler,",
          "48 saatte teslim.",
        ],
        paragraph:
          "Sizin için oluşturduğumuz, tek sayfalık el yapımı bir dijital profil. Link veya QR kod olarak paylaşın. Başlangıç noktası olarak 20+ sektör şablonu. Almanya'da barındırma, GDPR-yerli — abonelik tuzakları yok.",
        primaryCta: "Kartımı başlat",
        secondaryCta: "20 canlı şablonu gör",
        tags: "LİNK · QR KOD · ÖZEL TASARIM · 48 SAAT TESLİMAT · ALMAN HOSTİNG",
        cardLabels: {
          name: "Alex Weber",
          role: "Ürün Tasarımcısı",
          company: "Studio Nord",
          nfc: "QR",
          chip: "QR ILE PAYLAŞ",
        },
      },
      features: {
        label: "NELER ALIRSINIZ",
        heading: "Tek profil, üç paylaşım modu, yirmi başlangıç noktası.",
        intro:
          "Profilinizi sektörünüze göre tasarlarız. Siz de o ana uygun şekilde paylaşırsınız.",
        items: [
          {
            label: "LİNK · 01",
            title: "Paylaşılabilir link",
            desc: "opsolid.de/c/adiniz üzerinde temiz bir URL (Custom'da kendi alan adınız). E-posta imzalarında, WhatsApp bio'sunda, Instagram'da kullanın. Karşı tarafta uygulama kurulumu gerekmez.",
            icon: "link",
          },
          {
            label: "QR · 02",
            title: "QR kodunuzu indirin",
            desc: "Yazdırabileceğiniz, gömeceğiniz veya ekran paylaşacağınız PNG + SVG dosyaları. Vitrin çıkartmalarına, menülere, fuar pankartlarına ya da Zoom arka planına koyun.",
            icon: "qr",
          },
          {
            label: "ŞABLON · 03",
            title: "20 sektör şablonu",
            desc: "Emlak, klinik, restoran, DJ, berber, fotoğrafçı, mimar, fitness ve daha fazlası. Başlamadan önce canlı önizlemeleri inceleyin.",
            icon: "templates",
          },
          {
            label: "TASARIM · 04",
            title: "Size özel el yapımı",
            desc: "Şablonu bilgileriniz, renkleriniz ve fotoğraflarınızla uyarlarız. 48–72 saatte teslim. Revizyonlar dahil.",
            icon: "layout",
          },
          {
            label: "İMZA · 05",
            title: "E-posta imzasına hazır",
            desc: "Hazır snippet'i Gmail veya Outlook'a yapıştırın. Kartınız gönderdiğiniz her e-postayla birlikte seyahat eder.",
            icon: "wallet",
          },
          {
            label: "HOSTİNG · 06",
            title: "Almanya'da barındırılıyor",
            desc: "Hetzner / IONOS Frankfurt. GDPR-yerli. ABD alt işleyen yok. Her zaman tek tıkla silme.",
            icon: "hosting",
          },
        ],
      },
      compliance: {
        label: "VERİ EGEMENLİĞİ",
        heading: "Kartınızın verisi nerede yaşıyor?",
        intro:
          "Rakiplerin çoğu ABD'de barındırıyor. Biz değil. Biri kartınızı taradığında verileri Almanya'da kalır.",
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
        heading: "Üç esnek paket. Abonelik tuzağı yok.",
        popularBadge: "EN POPÜLER",
        plans: [
          {
            name: "Starter",
            price: "€49",
            cadence: "tek seferlik · 1. yıl hosting dahil",
            popular: "",
            bullets: [
              "Kütüphanemizden 1 sektör şablonu",
              "Link + QR kod (PNG + SVG)",
              "2 revizyon dahil",
              "E-posta imza snippet'i",
              "opsolid.de/c/adiniz üzerinde 1 yıl hosting",
              "Hosting yenileme: 1. yıldan sonra €9/yıl",
            ],
            cta: "Starter'ı başlat",
            href: "#lead",
          },
          {
            name: "Professional",
            price: "€149",
            cadence: "tek seferlik · 1. yıldan sonra €9/yıl hosting",
            popular: "true",
            bullets: [
              "Her şablon + hafif özelleştirme",
              "Özel slug (opsolid.de/c/markaniz)",
              "5 revizyon dahil",
              "Analitik (görüntüleme, link tıklamaları)",
              "E-posta imzası + sosyal medya görselleri",
              "Çoklu dil (DE/EN/TR) opsiyonel",
            ],
            cta: "Professional'ı başlat",
            href: "#lead",
          },
          {
            name: "Custom",
            price: "€299'dan başlayan",
            cadence: "proje bazlı teklif",
            popular: "",
            bullets: [
              "Tamamen özel tasarım (şablonsuz)",
              "Kendi alan adınız (adiniz.com)",
              "Çoklu dil (DE/EN/TR)",
              "Gelişmiş analitik",
              "Ekip listesi (5+ kart proje bazlı fiyat)",
              "Gerektiğinde CRM entegrasyonu",
            ],
            cta: "Teklif iste",
            href: "#lead",
          },
        ],
      },
      lead: {
        label: "TALEP",
        heading: "Kartınızdan bahsedin.",
        intro:
          "Sektörünüzü, temel bilgilerinizi ve beğendiğiniz şablonu paylaşın. Bir iş günü içinde önizleme linkiyle dönüş yapıyoruz.",
        fields: {
          name: "Ad Soyad",
          email: "İş e-postası",
          company: "Şirket (opsiyonel)",
          teamSize: "Kaç kart?",
          teamSizeOptions: ["1", "2 – 5", "6 – 20", "20+"],
          message:
            "Bilmemiz gereken başka bir şey var mı? (sektör, link tercihleri vb.)",
          consent:
            "Bu talebime yanıt vermesi için OpSolid'in bu verileri işlemesine izin veriyorum. Gizlilik Politikası'na bakabilirsiniz.",
          privacyLink: "Gizlilik Politikası",
          submit: "Talep gönder",
          submitting: "Gönderiliyor…",
          success:
            "Teşekkürler — bir iş günü içinde önizleme linkiyle dönüş yapacağız.",
          error:
            "Bir sorun oluştu. Lütfen doğrudan contact@opsolid.de adresine yazın.",
        },
      },
      testimonials: {
        label: "SOSYAL KANIT",
        heading: "İlk kartından sonra müşteriler ne söylüyor.",
        items: [
          {
            quote:
              "Kart iki günde hazırdı. Tasarımcı bir emlakçının profil sayfasında neye ihtiyacı olduğunu gerçekten anladı — neredeyse hiç revizyon istemedim.",
            name: "Lena Richter",
            role: "Bağımsız emlakçı",
            company: "Berlin, DE",
          },
          {
            quote:
              "Verilerin Almanya'da kalması, hukuk ekibimizi ikna etti. Sırf bu bile fiyata değerdi.",
            name: "Marco Weber",
            role: "COO",
            company: "Münih sanayi grubu",
          },
          {
            quote:
              "Aylık abonelik yok. „Enterprise paketi“ satışı yok. Bir kez ödedim, kartı aldım, QR'ı aldım, yoluma devam ettim. Tam da istediğim şey.",
            name: "Sarah Klein",
            role: "Bağımsız danışman",
            company: "Berlin, DE",
          },
        ],
      },
      howItWorks: {
        label: "NASIL TESLİM EDİYORUZ",
        heading: "Dört adım. 48 saatte canlı kart.",
        steps: [
          {
            title: "01 · Sipariş",
            description:
              "Kısa formu doldurun: sektörünüz, temel bilgileriniz, tercih ettiğiniz şablon. Tek seferlik ücreti ödeyin.",
          },
          {
            title: "02 · Tasarım",
            description:
              "48–72 saat içinde özelleştirilmiş profilinizin önizleme linkini göndeririz.",
          },
          {
            title: "03 · Revizyonlar",
            description:
              "Nelerin değişmesini istediğinizi söyleyin. Paketinize bağlı olarak 2–5 tur. Acele ücreti yok.",
          },
          {
            title: "04 · Teslimat",
            description:
              "Alırsınız: canlı link, QR kod (PNG + SVG), e-posta imza snippet'i. Tamamen sizindir.",
          },
        ],
      },
      faq: {
        label: "SSS",
        heading: "Sorular, doğrudan yanıtlar.",
        items: [
          {
            question: "Kartımı ne kadar sürede alırım?",
            answer:
              "Bilgilerinizi ve ödemenizi aldığımız andan itibaren 48–72 saat. Professional ve Custom paketlerde acele teslimat mümkün — bize sorun.",
          },
          {
            question: "Fiziksel NFC kart gönderiyor musunuz?",
            answer:
              "Henüz hayır. Şu anda yalnızca dijital odaklıyız: link + QR. Müşteri QR'ınızı tarar veya linkinizi açar ve profilinizi görür. Donanım gerekmez. Fiziksel NFC kartlar ilerleyen dönemde bir ek olarak gelebilir.",
          },
          {
            question: "Kartımı daha sonra kendim düzenleyebilir miyim?",
            answer:
              "Değişiklikleri bize gönderirsiniz, bir iş günü içinde güncelleriz. Custom'da sizin için basit bir editör kurabiliriz. Starter ve Professional'da değişiklikler bizden yürütülür.",
          },
          {
            question: "Verilerim nerede saklanıyor?",
            answer:
              "Frankfurt, Almanya — Hetzner / IONOS. ABD alt işleyen yok. Talep üzerine DPA hazır.",
          },
          {
            question: "Kartımı iptal edebilir veya silebilir miyim?",
            answer:
              "Evet, istediğiniz zaman. Tek tıkla silme. Otomatik yenileme tuzağı yok. Hosting, 1. yıldan sonra yıllık olarak peşin ödenir.",
          },
          {
            question: "Ekibim için 10+ karta ihtiyacım var. Nasıl?",
            answer:
              "Custom paket. Kartların ne kadar ortak paylaşacağına ve ne kadar özel kalacağına göre proje bazlı teklif veririz. contact@opsolid.de adresine yazın.",
          },
        ],
      },
      cta: {
        eyebrow: "HAZIR MISIN?",
        heading: "Yeni kartınız. 48 saatte canlı.",
        primaryCta: "Kartımı başlat",
        secondaryCta: "Şablonlara gözat",
      },
      order: {
        gallery: {
          title: "Bir tasarım seçin",
          subtitle:
            "Her tasarım numaralıdır. Arama sırasında sadece numarayı söyleyin yeter.",
          selectCta: "Bu tasarımı seç",
          selected: "Seçildi",
          fromPrice: "başlangıç",
        },
        form: {
          eyebrow: "SİPARİŞ",
          title: "Bilgileriniz, tasarımınız, kartınız.",
          subtitle:
            "Formu doldurun — ödemeden hemen sonra kartınız opsolid.de/c/… adresinde canlıya alınır.",
          selectedTemplate: "Seçili tasarım",
          changeTemplate: "Değiştir",
          contactSection: "İletişim — size nasıl ulaşırız",
          contactName: "Adınız",
          contactEmail: "E-posta",
          contactPhone: "Telefon",
          callMeBack: "Beni arayın",
          callMeBackHint:
            "1 iş günü içinde detayları netleştirmek için size dönüş yapacağız.",
          cardSection: "Kart içeriğiniz",
          cardName: "Ad ve soyad",
          cardTitle: "Ünvan / rol",
          cardCompany: "Şirket",
          cardWebsite: "Web sitesi",
          cardEmail: "E-posta (kartta)",
          cardPhone: "Telefon (kartta)",
          cardWhatsapp: "WhatsApp",
          cardAddress: "Adres",
          cardBio: "Kısa tanıtım",
          cardBioPh: "Kendiniz / işiniz hakkında tek cümle.",
          socialSection: "Sosyal linkler (opsiyonel)",
          uploadSection: "Fotoğraf ve logo (opsiyonel)",
          photoLabel: "Profil fotoğrafı",
          logoLabel: "Logo",
          uploadTooLarge: "Dosya çok büyük (maks 2 MB).",
          uploadFailed: "Yükleme başarısız.",
          brandSection: "Marka renkleri (opsiyonel)",
          primaryColor: "Ana renk",
          accentColor: "Vurgu rengi",
          designNotes: "Tasarım notları (opsiyonel)",
          designNotesPh:
            "Özel bir şey mi var? Font, logo, referans örnek …",
          billingSection: "Ödeme modeli",
          billingOneTime: "Tek seferlik",
          oneTimeFooter: "Bir kez ödeyin, kart ömür boyu barındırılsın.",
          billingSubscription: "Yıllık abonelik",
          subscriptionFooter: "Güncellemeler + revizyonlar dahil.",
          totalLabel: "Toplam",
          submit: "Öde ve kartı yayımla",
          submitting: "İşleniyor …",
          previewLabel: "Canlı önizleme",
          previewHint:
            "Önizleme anlık güncellenir — yayımdan sonra kartınız böyle görünecek.",
          invalidInput: "Lütfen işaretli alanları kontrol edin.",
          serverError: "Sunucu hatası. Lütfen tekrar deneyin.",
          noCheckoutUrl: "Ödeme URL'i alınamadı.",
          networkError: "Bağlantı hatası.",
        },
      },
      meta: {
        title:
          "Dijital Kartvizit — El yapımı tasarım, Almanya'da barındırma | OpSolid",
        description:
          "Link ve QR kod içeren el yapımı tasarım, tek sayfalık dijital kartvizit. 20+ sektör şablonu. 48 saatte teslim. Almanya'da barındırılıyor, GDPR-yerli.",
      },
    },

    voiceAgent: {
      hero: {
        eyebrow: "[ OPSOLID AJAN · 02 ]   SES AI",
        title: [
          "Telefonunuzu gece 2'de",
          "açan bir ses ajanı —",
          "üç dilde.",
        ],
        paragraph:
          "Üretime hazır bir AI ses ajanı: telefon hattınızı 7/24 açar, arayanları niteler, randevu oluşturur ve gerçek acil durumları bir insana yönlendirir. Almanca, İngilizce ve Türkçe kutudan çıkar çıkmaz. Retell AI veya Vapi üzerine kurulu, canlı takvim senkronu ile.",
        primaryCta: "Demo planla",
        secondaryCta: "Nasıl çalışır",
        tags: "RETELL · VAPI · DE/EN/TR · 7/24",
        startingPrice: "€1.200 kurulum + €0,12/dk'dan başlar",
      },
      features: {
        label: "NELER VAR",
        heading: "Her çağrı yanıtlanır — nitelendirilir, kaydedilir, yönlendirilir.",
        items: [
          {
            label: "DOĞAL KONUŞMA",
            body: "Düşük gecikmeli sıra değişimi (<800ms) ve söze girme desteği. IVR ağacı gibi değil, iyi brifinglenmiş bir resepsiyonist gibi konuşur.",
          },
          {
            label: "TAKVİM REZERVASYONU",
            body: "Google Calendar, Outlook ve Cal.com ile canlı çift yönlü senkron. Ajan rezervasyon yapar, yeniden planlar ve tamponlara uyar.",
          },
          {
            label: "ÇAĞRI YÖNLENDİRME",
            body: "Aciliyeti algılar ve karmaşık çağrıları, tam bağlam ve transkriptle birlikte canlı bir insana aktarır.",
          },
          {
            label: "TRANSKRİPT VE ÖZETLER",
            body: "Her çağrı yazıya dökülür, özetlenir, niyete göre etiketlenir. Telefon kapanır kapanmaz saniyeler içinde CRM veya Slack'e düşer.",
          },
          {
            label: "ÇOK DİLLİ",
            body: "Almanca, İngilizce, Türkçe — her dil için ses seçimi. Arayanlar hangi dilde aradıysa o dilde karşılanır.",
          },
          {
            label: "GDPR-YERLİ",
            body: "AB'de çalışan inference, kayıt anında DPA, kayıtlar Frankfurt'ta saklanır. Çağrı başında opt-in duyurusu.",
          },
        ],
      },
      howItWorks: {
        label: "NASIL ÇALIŞIR",
        heading: "Dört adım. Tek telefon numarası.",
        steps: [
          {
            step: "01",
            title: "Numaranızı taşıyın veya yönlendirin",
            body: "Mevcut numaranızı koruyun — cevapsız çağrıları ajana yönlendiririz ya da size özel bir hat veririz.",
          },
          {
            step: "02",
            title: "Ajanı brifingleyin",
            body: "Sistem promptunu hizmetleriniz, fiyatlarınız, mesai saatleriniz ve yükseltme kurallarınızla birlikte yazarız. Siz onaylarsınız.",
          },
          {
            step: "03",
            title: "Takvim + CRM bağlayın",
            body: "Rezervasyonlar için Cal.com veya Google Calendar; leadler için HubSpot/Pipedrive. Gerisini webhook'lar halleder.",
          },
          {
            step: "04",
            title: "Canlıya alın ve izleyin",
            body: "Her çağrı panoda kayıtlı. Transkriptleri inceler, promptu ayarlar, yükseltme tetiklerini düzenlersiniz.",
          },
        ],
      },
      stack: {
        label: "ÜZERİNE KURULU",
        heading: "Sihir yok. Gerçek teknoloji.",
        items: [
          { name: "Retell AI", role: "Ses orkestrasyonu + telefon" },
          { name: "Vapi", role: "Alternatif ses yığını (kurumsal)" },
          { name: "Cal.com", role: "Takvim rezervasyon katmanı" },
          { name: "Supabase", role: "Çağrı kayıtları + bağlam deposu" },
          { name: "n8n", role: "CRM senkronu + çağrı sonrası iş akışları" },
        ],
      },
      pricing: {
        label: "FİYATLANDIRMA",
        heading: "Kurulumu bir kez ödeyin. Gerçek çağrı dakikası başına ödeyin.",
        tiers: [
          {
            name: "Starter",
            price: "€1.200",
            billing: "tek seferlik kurulum + €0,12/dk",
            features: [
              "Tek telefon hattı",
              "DE veya EN (tek dil)",
              "Cal.com entegrasyonu",
              "E-posta bildirimleri",
              "100 dk test kredisi",
            ],
            cta: "Demo planla",
          },
          {
            name: "Business",
            price: "€2.400",
            billing: "kurulum + €0,12/dk + €99/ay",
            features: [
              "3 telefon hattına kadar",
              "DE · EN · TR çok dilli",
              "HubSpot / Pipedrive senkronu",
              "Slack + WhatsApp bildirimleri",
              "Aylık prompt ince ayarı",
              "Öncelikli destek",
            ],
            cta: "Demo planla",
            featured: "true",
          },
          {
            name: "Enterprise",
            price: "Özel",
            billing: "hacim fiyatlandırması + SLA",
            features: [
              "Sınırsız hat",
              "Özel ses klonlama",
              "Self-hosted opsiyonu (Vapi)",
              "Özel Slack kanalı",
              "%99,9 SLA",
            ],
            cta: "Bizimle konuşun",
          },
        ],
      },
      faq: {
        label: "SSS",
        heading: "Dürüst cevaplar.",
        items: [
          {
            q: "Arayanlar AI olduğunu anlayacak mı?",
            a: "Evet — her çağrının başında duyuruyoruz. Aksini yapmak hem GDPR'ı ihlal eder hem de güveni sarsar. Pratikte, ajan çağrıyı yetkin şekilde yürüttüğü sürece arayanlar önemsemiyor.",
          },
          {
            q: "Karmaşık veya acil çağrılarda ne oluyor?",
            a: "Ajan yükseltme tetiklerini (tanımladığınız anahtar kelimeler + niyet sinyalleri) algılar ve insan hattına aktarır; transkript ve özet önceden Slack/e-posta ile iletilir.",
          },
          {
            q: "Gerçekten ne kadar hızlı?",
            a: "Retell'in kurumsal katmanında sıra gecikmesi 800 ms'nin altında. Söze girer, kibarca böler, 2024 başı ses ajanlarını ele veren o garip 2 saniyelik duraksamayı yapmaz.",
          },
          {
            q: "Gerçek bir örnek dinleyebilir miyim?",
            a: "Evet. Tanışma görüşmesinde sandbox bir numarada canlı demo yürütürüz — siz ararsınız, ajan cevaplar, uç durumları test edersiniz. Sunum yok.",
          },
          {
            q: "Gerçekten GDPR uyumlu mu?",
            a: "Çağrılar AB altyapısında işlenir (Retell AB bölgesi / Vapi self-hosted). Kayıtlar Frankfurt'ta saklanır. İlk gün DPA imzalanır. Çağrı başında AI duyurulur ve opt-out sunulur.",
          },
        ],
      },
      cta: {
        heading: "Gece 2'de telefonunuz çalıyor. Kim açıyor?",
        paragraph:
          "30 dakikalık tanışma görüşmesi planlayın. Gerçek hizmetleriniz üzerinde sandbox bir ajan kurup aramanızı sağlarız.",
        primaryCta: "Demo planla",
        secondaryCta: "Bizimle konuşun",
      },
    },

    chatbot: {
      hero: {
        eyebrow: "[ OPSOLID AJAN · 03 ]   WEB SİTESİ CHATBOT",
        title: [
          "Tek chatbot.",
          "Üç kanal.",
          "Senaryo duvarı yok.",
        ],
        paragraph:
          "Web sitenizde, WhatsApp'ta ve Telegram'da aynı anda yaşayan, bağlam farkındalıklı bir chatbot — aynı beyin, üç ağız. Leadleri niteler, dokümanlarınızdan gerçek soruları yanıtlar ve konuşmaları HubSpot'a senkronlar.",
        primaryCta: "Demo planla",
        secondaryCta: "Nasıl çalışır",
        tags: "OPENAI · n8n · SUPABASE · ÇOK KANALLI",
        startingPrice: "€1.800 kurulum + €99/ay'dan başlar",
      },
      features: {
        label: "NELER VAR",
        heading: "SSS papağanı değil, dokümanlarınızı okuyan bir chatbot.",
        items: [
          {
            label: "ÇOK KANALLI",
            body: "Aynı konuşma, aynı hafıza — web widget'ı, WhatsApp Business ve Telegram arasında. Ekibiniz için birleşik gelen kutusu.",
          },
          {
            label: "RAG DESTEKLİ",
            body: "Gerçek içeriğinizle eğitilir: ürün dokümanları, politikalar, PDF'ler, Notion sayfaları. Halüsinasyon yok — kaynak atıfları dahil.",
          },
          {
            label: "LEAD YAKALAMA",
            body: "Doğal bir konuşmayla niteler (form dayatması değil), ardından gönderimde HubSpot/Pipedrive'a yapılandırılmış veri iter.",
          },
          {
            label: "İNSANA DEVRETME",
            body: "Tam transkript, algılanan duygu ve önerilen sonraki adımla canlı temsilciye sorunsuz yükseltme.",
          },
          {
            label: "ANALİTİK",
            body: "En çok cevapsız kalan sorular, yükseltme oranı, kanal başına dönüşüm hunisi. Haftalık tek özet, pano labirenti yok.",
          },
          {
            label: "ÖZEL STİL",
            body: "Sizin yazı tipleriniz, renkleriniz, tonunuz. Sitenizin kabuğunda yaşar — jenerik üçüncü taraf sohbet balonu değil.",
          },
        ],
      },
      howItWorks: {
        label: "NASIL ÇALIŞIR",
        heading: "Yayına almak için dört adım.",
        steps: [
          {
            step: "01",
            title: "Bilginizi içeri alın",
            body: "Sitenizi tararız, doküman/PDF'leri içeri aktarırız, Notion veya Confluence'ınızı bağlarız. Embeddingler Supabase pgvector'a düşer.",
          },
          {
            step: "02",
            title: "Akışları tasarlayın",
            body: "Lead nitelendirme, rezervasyon yolu, yükseltme tetikleri. Sistem promptunu ve guardrail'leri siz onaylarsınız.",
          },
          {
            step: "03",
            title: "Kanallara dağıtın",
            body: "Web için tek widget. BSP onaylı WhatsApp Business. Telegram botu. Hepsi aynı konuşma backend'ine bağlanır.",
          },
          {
            step: "04",
            title: "Haftalık iyileştirin",
            body: "En çok başarısız sorguları izler, bilgi tabanı ve promptları güncelleriz. İlk 30 gün dahil.",
          },
        ],
      },
      stack: {
        label: "ÜZERİNE KURULU",
        heading: "Sihir yok. Gerçek teknoloji.",
        items: [
          { name: "OpenAI / Claude", role: "LLM çekirdeği (değiştirilebilir)" },
          { name: "Supabase pgvector", role: "RAG embeddings + hafıza" },
          { name: "n8n", role: "Kanal orkestrasyonu + CRM senkronu" },
          { name: "Meta Business Cloud", role: "Resmi WhatsApp BSP" },
          { name: "HubSpot / Pipedrive", role: "Lead senkron hedefi" },
        ],
      },
      pricing: {
        label: "FİYATLANDIRMA",
        heading: "Tek seferlik kurulum. Öngörülebilir aylık.",
        tiers: [
          {
            name: "Sadece Web",
            price: "€1.800",
            billing: "kurulum + €99/ay",
            features: [
              "Web sitesi widget'ı",
              "200 sayfa/dokümana kadar RAG",
              "HubSpot senkronu",
              "Aylık 5.000 mesaj",
              "Yayın sonrası 30 gün ince ayar",
            ],
            cta: "Demo planla",
          },
          {
            name: "Çok kanallı",
            price: "€2.800",
            billing: "kurulum + €199/ay",
            features: [
              "Web + WhatsApp + Telegram",
              "Birleşik ajan gelen kutusu",
              "1.000 dokümana kadar RAG",
              "Aylık 20.000 mesaj",
              "İnsana devretme iş akışı",
              "Haftalık iterasyon",
            ],
            cta: "Demo planla",
            featured: "true",
          },
          {
            name: "Scale",
            price: "€5.000'den",
            billing: "kurulum + kullanım bazlı",
            features: [
              "Sınırsız kanal",
              "Özel LLM (self-hosted opsiyonu)",
              "Gelişmiş analitik",
              "White-label",
              "SLA + özel destek",
            ],
            cta: "Bizimle konuşun",
          },
        ],
      },
      faq: {
        label: "SSS",
        heading: "Dürüst cevaplar.",
        items: [
          {
            q: "Halüsinasyon yapıp markamıza zarar verecek mi?",
            a: "Sıkı sınırlı RAG, botun kaynaklarını atıf göstermesini sağlar. Cevap dokümanlarınızda yoksa bunu söyler ve yükseltmeyi önerir. Özellikle kendinden emin kurguya göre 'bilmiyorum' demeyi tercih edecek şekilde ayarlıyoruz.",
          },
          {
            q: "WhatsApp gerçekten düzgün çalışıyor mu?",
            a: "Evet — resmi Meta Business Cloud API üzerinden doğrulanmış bir BSP aracılığıyla (Twilio, 360dialog veya AiSensy). Gri piyasa kazıma yok. Yeşil doğrulanmış rozet, ban riski yok.",
          },
          {
            q: "Mevcut canlı sohbet aracımızı kullanmaya devam edebilir miyiz?",
            a: "Intercom, Crisp veya Zendesk kullanıyorsanız — evet. Üzerine AI katmanı koyarız ve yalnızca mevcut insan akışınıza yükseltiriz. Araç değişimi yok.",
          },
          {
            q: "OpenAI kesintiye girerse ne olur?",
            a: "Yedek olarak Claude'u (Anthropic) yapılandırıyoruz ve kritik iş yükleri için Llama 3'ü self-host edebiliyoruz. Web'in üstündeki her katmanda çoklu sağlayıcı LLM yönlendirmesi var.",
          },
        ],
      },
      cta: {
        heading: "Destek ekibiniz her gün aynı 50 soruyu yanıtlıyor.",
        paragraph:
          "Demo planlayın. Gerçek dokümanlarınız üzerinde bir chatbot kurup, karar vermeden önce test etmenizi sağlarız.",
        primaryCta: "Demo planla",
        secondaryCta: "Bizimle konuşun",
      },
    },

    whatsappAgent: {
      hero: {
        eyebrow: "[ OPSOLID AJAN · 04 ]   WHATSAPP BUSINESS",
        title: [
          "Gerçekten çalışan",
          "WhatsApp —",
          "resmi olarak.",
        ],
        paragraph:
          "Resmi Meta Business Cloud API üzerinden WhatsApp otomasyonu — doğrulanmış bir BSP aracılığıyla (Twilio, 360dialog, AiSensy). Sipariş takibi, destek, nitelendirme, ödeme tetikleri. Kazıma yok, gayri resmi kütüphane yok, ban riski yok.",
        primaryCta: "Demo planla",
        secondaryCta: "Nasıl çalışır",
        tags: "META BUSINESS CLOUD · 360DIALOG · TWILIO · DOĞRULANMIŞ",
        startingPrice: "€1.500 kurulum + Meta ücretleri'nden başlar",
      },
      features: {
        label: "NELER VAR",
        heading: "Meta'nın API'sinin izin verdiği her şey — vermediği hiçbir şey.",
        items: [
          {
            label: "DOĞRULANMIŞ YEŞİL TİK",
            body: "Resmi işletme doğrulamasını BSP üzerinden biz yürütürüz. Markanız müşterilerin güvendiği yeşil tik ile görünür.",
          },
          {
            label: "SİPARİŞ VE KARGO GÜNCELLEMELERİ",
            body: "Otomatik bildirimler: sipariş alındı, hazırlandı, kargoya verildi, teslim edildi. Shopify / WooCommerce / ERP'nize doğrudan bağlı.",
          },
          {
            label: "MÜŞTERİ DESTEĞİ",
            body: "AI ilk kademe yanıtlarıyla gelen destek. Bot sınırına ulaştığında tam bağlamla birlikte insana yükseltme.",
          },
          {
            label: "ÖDEME LİNKLERİ",
            body: "Konuşma içinde Stripe ödeme linklerini tetikleyin — sipariş onayları, faturalar, depozitolar — makbuzlar WhatsApp'a geri düşer.",
          },
          {
            label: "KAMPANYA ŞABLONLARI",
            body: "Yayınlar için Meta onaylı mesaj şablonları. Opt-in yönetimi, hız sınırlı, asla spam değil.",
          },
          {
            label: "EKİP GELEN KUTUSU",
            body: "Temsilcileriniz konuşmaları gerçek bir gelen kutusunda yürütür (bizim veya mevcut olanınız — Front, HubSpot, Zendesk). Tam denetim izi.",
          },
        ],
      },
      howItWorks: {
        label: "NASIL ÇALIŞIR",
        heading: "Önce doğrulama, sonra otomasyon.",
        steps: [
          {
            step: "01",
            title: "İşletmenizi Meta'da doğrulayın",
            body: "Facebook Business Manager doğrulaması ve BSP onboarding'de size rehberlik ederiz. Tipik olarak 5–10 iş günü.",
          },
          {
            step: "02",
            title: "Mesaj şablonları tasarlayın",
            body: "Meta her yayın şablonunu onaylar. Taslağı biz yazarız, gönderirız, onaylanana kadar iterasyon — genelde 1–2 tur.",
          },
          {
            step: "03",
            title: "Backend'inizi bağlayın",
            body: "Siparişler için Shopify/WooCommerce, ödemeler için Stripe, leadler için HubSpot. Webhook'lar iki yöne akar.",
          },
          {
            step: "04",
            title: "Otomasyon + insan katmanıyla yayına alın",
            body: "Ölçek için otomatik yanıtlar + AI, nüans için insan temsilciler. Çizgiyi siz belirlersiniz.",
          },
        ],
      },
      stack: {
        label: "ÜZERİNE KURULU",
        heading: "Resmi API, gri piyasa yok.",
        items: [
          { name: "Meta Business Cloud API", role: "Resmi WhatsApp kanalı" },
          { name: "360dialog / Twilio / AiSensy", role: "Doğrulanmış BSP katmanı" },
          { name: "n8n", role: "İş akışı orkestrasyonu" },
          { name: "Stripe", role: "Ödeme linki tetikleri" },
          { name: "Shopify / WooCommerce", role: "Sipariş + kargo doğru kaynağı" },
        ],
      },
      pricing: {
        label: "FİYATLANDIRMA",
        heading: "Kurulum + BSP geçişi. Marj oyunu yok.",
        tiers: [
          {
            name: "Launch",
            price: "€1.500",
            billing: "kurulum + Meta ücretleri geçişli",
            features: [
              "İşletme doğrulaması",
              "3 Meta şablonu onaylı",
              "1 otomasyon (sipariş veya destek)",
              "360dialog veya Twilio BSP",
              "Yayın sonrası 30 gün destek",
            ],
            cta: "Demo planla",
          },
          {
            name: "Commerce",
            price: "€3.200",
            billing: "kurulum + €149/ay + Meta ücretleri",
            features: [
              "Launch'taki her şey",
              "Shopify/WooCommerce entegrasyonu",
              "Sipariş akışı otomasyonları",
              "Stripe ödeme linkleri",
              "AI öncelikli destek katmanı",
              "Ekip gelen kutusu (5 temsilciye kadar)",
            ],
            cta: "Demo planla",
            featured: "true",
          },
          {
            name: "Enterprise",
            price: "Özel",
            billing: "kurulum + hacim fiyatlandırması",
            features: [
              "Çok ülkeli numaralar",
              "Çift yönlü CRM senkronu",
              "Gelişmiş yönlendirme + SLA'lar",
              "Özel BSP temsilcisi",
              "Uyum incelemesi",
            ],
            cta: "Bizimle konuşun",
          },
        ],
      },
      faq: {
        label: "SSS",
        heading: "Şeffaf olmayan bir kanal hakkında dürüst cevaplar.",
        items: [
          {
            q: "Neden daha ucuz gayri resmi WhatsApp kütüphanesi kullanmıyoruz?",
            a: "Çünkü Meta onları yasaklıyor, nokta. Numaranız işaretlenir, müşterilerinizin güveni sarsılır, otomasyonunuz bir gecede bozulur. Gri piyasa WhatsApp göndermeyi reddediyoruz. Resmi API daha pahalı — aynı zamanda ayakta kalan tek şey.",
          },
          {
            q: "Meta'nın ücretleri ne kadar?",
            a: "Konuşma bazlı. Utility konuşmaları (sipariş güncellemeleri) yaklaşık €0,02–0,05; pazarlama konuşmaları €0,05–0,12. Bunları maliyetine geçiriyoruz — marj yok.",
          },
          {
            q: "Doğrulama ne kadar sürüyor?",
            a: "Ortalama 5–10 iş günü. Meta, işletme belgelerinizi ve BSP ilişkinizi doğrular. Evrak işini biz hallederiz.",
          },
          {
            q: "Gayri resmi bir araçtan geçiş yapabilir miyim?",
            a: "Evet. Resmi kanalı 2 hafta paralel çalıştırırız, sonra geçiş yaparız. Telefon numarası taşıma mümkün ama mevcut sağlayıcınızla koordinasyon gerektirir.",
          },
        ],
      },
      cta: {
        heading: "WhatsApp müşterilerinizin zaten bulunduğu yer.",
        paragraph:
          "Demo planlayın. Tam Meta doğrulama yolunu ve yığınınızda neyin otomatize edilebileceğini gösteririz.",
        primaryCta: "Demo planla",
        secondaryCta: "Bizimle konuşun",
      },
    },

    bookingAgent: {
      hero: {
        eyebrow: "[ OPSOLID AJAN · 05 ]   REZERVASYON AJANI",
        title: [
          "Kendini yöneten",
          "rezervasyonlar —",
          "telefon ve sohbette.",
        ],
        paragraph:
          "Tek bir işe adanmış AI ajanı: rezervasyon yapmak, yeniden planlamak, hatırlatmak. Ses, sohbet veya form üzerinden çalışır — Google Calendar, Outlook veya Cal.com ile çift yönlü senkron. Sıfır çifte rezervasyon, daha az randevuya gelmeme.",
        primaryCta: "Demo planla",
        secondaryCta: "Nasıl çalışır",
        tags: "CAL.COM · RETELL · N8N · GOOGLE CALENDAR",
        startingPrice: "€800 kurulum + €49/ay'dan başlar",
      },
      features: {
        label: "NELER VAR",
        heading: "Tek ajan, her rezervasyon kanalı.",
        items: [
          {
            label: "ÇOK KANALLI ALIM",
            body: "Arayan, sohbet kullanıcısı veya web formu — aynı backend, aynı müsaitlik mantığı, aynı onay e-postası.",
          },
          {
            label: "ÇİFT YÖNLÜ TAKVİM SENKRONU",
            body: "Google Calendar, Outlook 365, iCloud veya Cal.com ile canlı senkron. Harici bloklar anında dikkate alınır.",
          },
          {
            label: "YENİDEN PLANLAMA VE İPTAL",
            body: "Müşteri, onay mailine yanıt vererek veya tekrar arayarak yeniden planlayabilir. Form rodeosu yok, destek bileti yok.",
          },
          {
            label: "HATIRLATMA + GELMEME",
            body: "Takviminize göre SMS/WhatsApp/e-posta hatırlatmaları. Kaçırılan randevular için rebooking linki ile otomatik takip.",
          },
          {
            label: "TAMPON VE YÖNLENDİRME KURALLARI",
            body: "Hizmet başına süre, tampon, ekip yönlendirme, lokasyon kısıtları. Sihir yok — hepsi Cal.com'da görünür.",
          },
          {
            label: "PANOLAR",
            body: "Rezervasyon hızı, kullanım oranı, kanal başına gelmeme oranı. Basit haftalık rapor, 20 grafikli mezarlık yok.",
          },
        ],
      },
      howItWorks: {
        label: "NASIL ÇALIŞIR",
        heading: "Dört adım. Tek doğru takvim.",
        steps: [
          {
            step: "01",
            title: "Hizmetlerinizi haritalayın",
            body: "Her hizmet: süre, tampon, kim verebilir, lokasyon/oda kısıtları. Cal.com'da modelleriz.",
          },
          {
            step: "02",
            title: "Takvimleri bağlayın",
            body: "Personel takvimleri (Google/Outlook/iCloud) çift yönlü senkronize olur. Harici toplantılar rezervasyon slotlarını otomatik bloklar.",
          },
          {
            step: "03",
            title: "Alım kanallarını bağlayın",
            body: "Telefon (Retell ses ajanıyla), web sohbet widget'ı, gömülü form. Hepsi aynı Cal.com backend'ine yazar.",
          },
          {
            step: "04",
            title: "Hatırlatmaları otomatikleştirin",
            body: "Hizmet başına hatırlatma sıklığı ve kanalı. Rebooking linkli gelmeme takipleri. Her şeyi izleyin.",
          },
        ],
      },
      stack: {
        label: "ÜZERİNE KURULU",
        heading: "Sihir yok. Gerçek teknoloji.",
        items: [
          { name: "Cal.com", role: "Rezervasyon motoru + müsaitlik" },
          { name: "Retell AI", role: "Ses alımı (opsiyonel)" },
          { name: "n8n", role: "Hatırlatma + takip iş akışları" },
          { name: "Google Calendar / Outlook", role: "Doğru kaynak senkronu" },
          { name: "Twilio", role: "SMS hatırlatmaları" },
        ],
      },
      pricing: {
        label: "FİYATLANDIRMA",
        heading: "Küçük kurulum. Küçük aylık. Gerçek ROI.",
        tiers: [
          {
            name: "Solo",
            price: "€800",
            billing: "kurulum + €49/ay",
            features: [
              "3 hizmete kadar",
              "Web form + sohbet alımı",
              "Google Calendar veya Cal.com",
              "E-posta + SMS hatırlatmaları",
              "Haftalık rapor",
            ],
            cta: "Demo planla",
          },
          {
            name: "Team",
            price: "€1.600",
            billing: "kurulum + €129/ay",
            features: [
              "Sınırsız hizmet",
              "Telefon + sohbet + form",
              "Ses ajanı (Retell)",
              "Ekip yönlendirme kuralları",
              "WhatsApp hatırlatmaları",
              "Gelmeme rebooking akışı",
            ],
            cta: "Demo planla",
            featured: "true",
          },
          {
            name: "Çok lokasyonlu",
            price: "Özel",
            billing: "lokasyon başına",
            features: [
              "Çok şubeli yönlendirme",
              "Kaynak kısıtları",
              "Özel entegrasyonlar",
              "Personel uygulaması (opsiyonel)",
              "SLA + onboarding",
            ],
            cta: "Bizimle konuşun",
          },
        ],
      },
      faq: {
        label: "SSS",
        heading: "Dürüst cevaplar.",
        items: [
          {
            q: "Mevcut Cal.com hesabımı koruyabilir miyim?",
            a: "Evet — üzerine katman ekleriz. Zaten Cal.com'daysanız, ses alımı ve iş akışı otomasyonuyla genişletiriz. Göç gerekmez.",
          },
          {
            q: "Tekrarlayan rezervasyonlar / paketler?",
            a: "Cal.com'da yerli olarak desteklenir. 5'li paketler, aylık abonelikler, çok seanslı tedaviler — hepsi standart.",
          },
          {
            q: "Gerçekten gelmemeleri azaltıyor mu?",
            a: "Uygulamalarımızda %30–50 azalma tipik — 24 saat + 2 saat hatırlatmalar ve tek tıkla yeniden planlama linkiyle. Sayılar hizmet türünüze bağlı.",
          },
          {
            q: "Müşteriler rezervasyon için bizi arayabilir mi?",
            a: "Evet — tüm mesele bu. Ses ajanı cevaplar, slot bulur, rezervasyon yapar, onaylar. Ya da müşteri tercih ederse insan da telefonu açabilir.",
          },
        ],
      },
      cta: {
        heading: "Her kaçırılan çağrı, kaçırılan bir rezervasyondur.",
        paragraph:
          "Demo planlayın. Sandbox bir takvim bağlar ve telefon + sohbet akışını uçtan uca test etmenizi sağlarız.",
        primaryCta: "Demo planla",
        secondaryCta: "Bizimle konuşun",
      },
    },

    emailAgent: {
      hero: {
        eyebrow: "[ OPSOLID AJAN · 06 ]   E-POSTA OTOMASYONU",
        title: [
          "Gelen kutusu triyajı.",
          "Soğuk dış iletişim.",
          "Onaylı yanıt taslakları.",
        ],
        paragraph:
          "Gerçekten yayına çıkan AI e-posta iş akışları: kişiselleştirilmiş soğuk dış iletişim, gelen triyajı ve insan onayı için otomatik taslaklar. Instantly, AgentMail ve özel n8n akışları üzerine kurulu. Isıtılmış deliverability, GDPR uyumlu.",
        primaryCta: "Demo planla",
        secondaryCta: "Nasıl çalışır",
        tags: "INSTANTLY · AGENTMAIL · n8n · OPENAI",
        startingPrice: "€99 – €499/ay'dan başlar",
      },
      features: {
        label: "NELER VAR",
        heading: "50 kişilik SDR ekibi olmadan işleyen e-posta.",
        items: [
          {
            label: "ÖLÇEKLİ SOĞUK DIŞ İLETİŞİM",
            body: "Kişi başına kişiselleştirilmiş varyantlar, sprey-dua değil. Çoklu gelen kutusu rotasyonu, gönderen ısıtma, bounce yönetimi.",
          },
          {
            label: "GELEN KUTUSU TRİYAJI",
            body: "Gelen mailler sınıflandırılır: Lead, Destek, Partner, Spam, Yükselt. Yönlendirilir, etiketlenir, CRM'de özet bekler.",
          },
          {
            label: "YANIT TASLAKLARI",
            body: "AI, geçmiş e-postalarınıza dayanarak sizin sesinizle taslak yazar. Siz inceler, düzenler, gönderirsiniz — saatler tasarruf, bot atığı gönderilmez.",
          },
          {
            label: "DELIVERABILITY SAĞLIĞI",
            body: "SPF/DKIM/DMARC denetimi, gönderen itibar izleme, 5–50 gelen kutusunda ısıtma. Gerçekten gelen kutusuna düşersiniz.",
          },
          {
            label: "CRM'E YAZMA",
            body: "Anlamlı her konuşma HubSpot/Pipedrive'a doğru kişi, aşama ve özetle otomatik olarak kaydedilir.",
          },
          {
            label: "GDPR GUARDRAIL'LERİ",
            body: "Suppression listeleri, unsubscribe yönetimi, AB kişi rıza mantığı. Opt-in sinyali olmayan soğuk maile yer yok.",
          },
        ],
      },
      howItWorks: {
        label: "NASIL ÇALIŞIR",
        heading: "Dört adım, gelen kutusu derinliğinde.",
        steps: [
          {
            step: "01",
            title: "Deliverability denetimi",
            body: "SPF, DKIM, DMARC, gönderen itibarı. Yanan ne varsa düzeltin. Dış iletişim kapsamdaysa ısıtma gelen kutuları sağlarız.",
          },
          {
            step: "02",
            title: "Mail + CRM bağlayın",
            body: "Google Workspace, M365 veya Postmark. Kayıt için HubSpot/Pipedrive. Siz onaylayana kadar her şey salt okunur.",
          },
          {
            step: "03",
            title: "Akışları kurun",
            body: "Triyaj kuralları, yanıt şablonları, dış iletişim dizileri. Gerçek örnek maillerle sesinize ayarlanmış promptlar.",
          },
          {
            step: "04",
            title: "İnsan döngüde",
            body: "Taslaklar inceleme kuyruğuna düşer. Siz onaylar, düzenler, gönderirsiniz. Dış iletişim suppression mantığıyla kendi başına çalışır.",
          },
        ],
      },
      stack: {
        label: "ÜZERİNE KURULU",
        heading: "Sihir yok. Gerçek teknoloji.",
        items: [
          { name: "Instantly", role: "Soğuk dış iletişim + ısıtma" },
          { name: "AgentMail", role: "Gelen triyaj + taslak" },
          { name: "n8n", role: "Özel iş akışı tutkalı" },
          { name: "OpenAI / Claude", role: "Taslak + sınıflandırma" },
          { name: "HubSpot / Pipedrive", role: "CRM doğru kaynağı" },
        ],
      },
      pricing: {
        label: "FİYATLANDIRMA",
        heading: "Aylık operasyonel fiyatlandırma. İstediğinizde iptal.",
        tiers: [
          {
            name: "Triage",
            price: "€99",
            billing: "aylık",
            features: [
              "1 gelen kutusu sınıflandırma + triyaj",
              "Yanıt taslakları (aylık 200'e kadar)",
              "HubSpot veya Pipedrive senkronu",
              "Haftalık rapor",
            ],
            cta: "Demo planla",
          },
          {
            name: "Outreach + Triage",
            price: "€299",
            billing: "aylık",
            features: [
              "Triage'daki her şey",
              "Soğuk dış iletişim (5 gelen kutusu)",
              "Isıtma + deliverability izleme",
              "Aylık 2.000'e kadar gönderim",
              "A/B test",
              "Aylık prompt ince ayarı",
            ],
            cta: "Demo planla",
            featured: "true",
          },
          {
            name: "Scale",
            price: "€499+",
            billing: "aylık, hacim bazlı",
            features: [
              "Sınırsız gelen kutusu",
              "Özel LLM yönlendirme",
              "Gelişmiş segmentasyon",
              "Özel iş akışı mühendisi",
              "SLA",
            ],
            cta: "Bizimle konuşun",
          },
        ],
      },
      faq: {
        label: "SSS",
        heading: "Varsayılan olarak spam dolu bir kanal hakkında dürüst cevaplar.",
        items: [
          {
            q: "AI yazılı soğuk e-posta aslında spam değil mi?",
            a: "Yanlış yapılırsa öyledir. Paragraf düzeyinde kişiselleştiririz (mail-merge token ikamesi değil), gelen kutusu başına hacmi sınırlandırırız ve etkileşime geçmeyenleri suppress ederiz. Listeniz berbatsa size söyleriz — inbound öneririz.",
          },
          {
            q: "AB kişileri için GDPR uyumlu mu?",
            a: "AB kişilerine B2B soğuk iletişim, meşru menfaat gerekçesi + kolay opt-out gerektirir. İkisini de uygularız. Tüketici (B2C) kişileri için önceden rıza zorunludur — onsuz mail göndermeyiz.",
          },
          {
            q: "İnsan incelemesi olmadan yanıt verebilir mi?",
            a: "Evet, ama sadece dar ve güvenli niyetler için (kargo onayları, müsaitlik kontrolü yanıtları, planlama). Geri kalan her şey inceleme için kuyruğa girer. Çizgiyi siz belirlersiniz.",
          },
          {
            q: "Mevcut posta geçmişime ne olacak?",
            a: "Yanıt taslayıcıyı son 500 gönderilmiş e-postanız üzerinde eğitebiliriz; böylece taslaklar GPT-4'ün kurumsal sesi gibi değil, sizin gibi duyulur. Hepsi lokal işlenir, embedding dışında hiçbir şey saklanmaz.",
          },
        ],
      },
      cta: {
        heading: "Gelen kutunuz ikinci bir tam zamanlı iş. Olmamalı.",
        paragraph:
          "Demo planlayın. Mail kurulumunuzu denetler ve spam filtrelerini tetiklemeden neyin otomatize edilebileceğini gösteririz.",
        primaryCta: "Demo planla",
        secondaryCta: "Bizimle konuşun",
      },
    },

    leadQualifier: {
      hero: {
        eyebrow: "[ OPSOLID AJAN · 07 ]   LEAD NİTELENDİRME",
        title: [
          "Her gelen lead.",
          "Nitelendirilmiş, skorlanmış,",
          "satışa teslim edilmiş.",
        ],
        paragraph:
          "Gelen leadleri ses veya sohbet üzerinden niteleyen, ICP'nize göre skorlayan ve MQL'leri doğrudan HubSpot veya Pipedrive'da satışa yönlendiren bir konuşma ajanı. Tipik artış: %40 MQL-SQL dönüşümü.",
        primaryCta: "Demo planla",
        secondaryCta: "Nasıl çalışır",
        tags: "RETELL · HUBSPOT · N8N · SKORLAMA",
        startingPrice: "€2.200 kurulum + €199/ay'dan başlar",
      },
      features: {
        label: "NELER VAR",
        heading: "SDR işi, 7/24 müsait.",
        items: [
          {
            label: "KONUŞMAYLA NİTELENDİRME",
            body: "14 alanlı form yerine doğal karşılıklı konuşma. Önemliyi sorar, gereksizi atlar, insan gibi hissettirir.",
          },
          {
            label: "ICP SKORLAMA",
            body: "Yapılandırılabilir skorlama modeli — firmografik, niyet sinyalleri, bütçe, zaman çizelgesi. Skor gönderimde HubSpot'a düşer.",
          },
          {
            label: "ANINDA YÖNLENDİRME",
            body: "SQL'e hazır leadler satışa Slack'ten pinglenir veya doğrudan AE'nin takvimine randevu düşer. 'Size döneriz' gecikmesi yok.",
          },
          {
            label: "SES VEYA SOHBET",
            body: "Aynı nitelendirme mantığı telefon (Retell), web sohbeti veya WhatsApp üzerinden çalışır. Kanalları siz seçersiniz.",
          },
          {
            label: "KONUŞMA KÜTÜPHANESİ",
            body: "Her lead için tam transkript + özet + skor. Satış HubSpot'u açar ve bağlamı zaten bilir.",
          },
          {
            label: "A/B SORU AYARI",
            body: "Nitelendirme terkinin aylık incelemesi. Soruları iyileştirin, kapanış oranını artırın, etkisini ölçün.",
          },
        ],
      },
      howItWorks: {
        label: "NASIL ÇALIŞIR",
        heading: "Anonim ziyaretçiden satışa hazır lead'e, insan olmadan.",
        steps: [
          {
            step: "01",
            title: "ICP + skorlama modelinizi tanımlayın",
            body: "İdeal müşteri profilinizi birlikte çalışır ve ağırlıklı bir skorlama rubriğine dönüştürürüz (firmografik + niyet).",
          },
          {
            step: "02",
            title: "Konuşmayı tasarlayın",
            body: "Skor boyutlarına eşlenmiş nitelendirme soruları. Dallanma mantığı. Diskalifiye zarifçe yürütülür.",
          },
          {
            step: "03",
            title: "CRM + satış yönlendirmesi bağlayın",
            body: "HubSpot/Pipedrive pipeline'ları, Slack kanalları, AE takvim yönlendirme. SQL teslimatı rezervasyon linki veya doğrudan ping ile.",
          },
          {
            step: "04",
            title: "Kanallarda yayına alın",
            body: "Sohbet widget'ı + telefon hattı canlı. MQL→SQL dönüşümünü kalibre etmek için satışla aylık skorlama incelemesi.",
          },
        ],
      },
      stack: {
        label: "ÜZERİNE KURULU",
        heading: "Sihir yok. Gerçek teknoloji.",
        items: [
          { name: "Retell AI", role: "Ses nitelendirme" },
          { name: "HubSpot / Pipedrive", role: "CRM + skorlama hedefi" },
          { name: "n8n", role: "Yönlendirme + Slack/Cal.com teslimatı" },
          { name: "Supabase", role: "Konuşma kaydı + analitik" },
          { name: "Clearbit / Apollo (opsiyonel)", role: "Firmografik zenginleştirme" },
        ],
      },
      pricing: {
        label: "FİYATLANDIRMA",
        heading: "Tek seferlik kurulum. Tekrarlayan artış.",
        tiers: [
          {
            name: "Sadece sohbet",
            price: "€2.200",
            billing: "kurulum + €199/ay",
            features: [
              "Web sitesi sohbet widget'ı",
              "ICP skorlama modeli",
              "HubSpot veya Pipedrive senkronu",
              "Slack yönlendirme",
              "Aylık inceleme",
            ],
            cta: "Demo planla",
          },
          {
            name: "Ses + Sohbet",
            price: "€3.800",
            billing: "kurulum + €349/ay",
            features: [
              "Sohbet + gelen telefon",
              "Retell ses nitelendirme",
              "AE'lere takvim yönlendirme",
              "Firmografik zenginleştirme",
              "Sorularda A/B test",
              "Haftalık satış senkronu",
            ],
            cta: "Demo planla",
            featured: "true",
          },
          {
            name: "Enterprise",
            price: "Özel",
            billing: "ekip başına fiyatlandırma",
            features: [
              "Çok ekipli yönlendirme",
              "Özel CRM entegrasyonları",
              "Hesap bazlı skorlama",
              "Özel sales ops",
              "SLA + raporlama",
            ],
            cta: "Bizimle konuşun",
          },
        ],
      },
      faq: {
        label: "SSS",
        heading: "Dürüst cevaplar.",
        items: [
          {
            q: "Leadler gerçekten AI ile etkileşimde kalıyor mu?",
            a: "Kısa cevap: konuşma yararlı hissettirirse evet. AI'yı önceden açıklıyoruz, soruları en fazla 4–6 ile sınırlıyoruz ve her noktada insana devretme sunuyoruz. Tamamlama oranları statik formlardaki %15–25'e karşı %60–80 seviyelerinde.",
          },
          {
            q: "Gerçekçi bir MQL→SQL artışı nedir?",
            a: "Çoğu uygulamada %30–50, daha iyi skorlama doğruluğu + daha hızlı yönlendirme (SQL'ler satışa saatler yerine dakikalar içinde düşer) ile. Spesifik rakamlar mevcut tabanınıza bağlıdır.",
          },
          {
            q: "Leadleri diskalifiye edebilir mi?",
            a: "Evet — hem de zarifçe. ICP dışı leadler self-serve bir katmana yönlendirilir veya kibarca yolcu edilir. AE'leriniz uymayan çağrılarda zaman kaybetmez.",
          },
          {
            q: "Mevcut SDR ekibimizle nasıl entegre olur?",
            a: "İlk nitelendirmeyi devralır (SDR ekibi sıcak dışa odaklanır) veya onları güçlendirir (SDR'ler yalnızca SQL'e hazır leadleri alır). Mevcut hareketinize eşleriz.",
          },
        ],
      },
      cta: {
        heading: "AE'leriniz SQL'lerle konuşmalı. Lastik tekmeleyenlerle değil.",
        paragraph:
          "Demo planlayın. Huninizde nitelendirmenin bugün leadleri nerede kaybettiğini birlikte haritalayalım.",
        primaryCta: "Demo planla",
        secondaryCta: "Bizimle konuşun",
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
