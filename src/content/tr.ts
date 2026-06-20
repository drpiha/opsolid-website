// =============================================================================
// TURKISH CONTENT (Türkçe)
// Tüm metinler profesyonel iş Türkçesinde. Yapı en.ts ile birebir aynı.
// =============================================================================

import type { Content } from "./en";

export const content: Content = {
  consent: {
    title: "Çerezler ve analitik",
    body: "OpSolid'in nasıl kullanıldığını anlamak için minimal analitik kullanıyoruz. Pazarlama çerezi, profilleme yok. Tercihini istediğin zaman değiştirebilirsin.",
    privacyLink: "Gizlilik politikamızı okuyun",
    accept: "Kabul et",
    reject: "Reddet",
  },

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
      ratingPill: "",
      title: [
        "Operasyonlarınızı",
        "yöneten otomasyon —",
        "tersi değil.",
      ],
      subtitle:
        "OpSolid gerçek iş operasyonları için pratik otomasyon ve yapay zeka sistemleri tasarlar ve kurar — iş akışı otomasyonu, sistem entegrasyonu, dahili araçlar ve AI destekli süreçler.",
      primaryCtaLabel: "Tanışma görüşmesi planla",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Hizmetleri gör",
      secondaryCtaHref: "/solutions",
      footnote: "",
      consultingNote:
        "Ayrıca bağımsız ürünler de sunuyoruz — Kutasia, Dijital Kartvizit, Dijital Resepsiyon.",
      editorial: {
        eyebrow: "",
        title: [
          "Operasyonun arka planında",
          "sessizce çalışan",
          "sistemler.",
        ],
        paragraph:
          "Orta ölçekli operasyonlar için pratik otomasyon — siparişler, belgeler, onaylar, iletişim. Mevcut sisteminizi yeniden kurmak gerekmeden — sürecinize entegre olan otomasyon.",
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
        "Tekrarlayan iş akışlarını özel olarak geliştirilmiş otomasyonlarla ortadan kaldırın",
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
            "Manuel adımların yerini alan otomatik iş akışları — veri girişinden onaylara, bildirimlerden raporlamaya. API entegrasyonları ve özel iş mantığı ile geliştirilir.",
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
        { name: "Özel İş Akışları", icon: "workflow" },
        { name: "Shopify", icon: "shoppingBag" },
        { name: "CRM Sistemleri", icon: "users" },
        { name: "ERP Sistemleri", icon: "database" },
        { name: "E-posta & SMTP", icon: "mail" },
        { name: "REST API'ler", icon: "code" },
        { name: "Google Workspace", icon: "cloud" },
        { name: "Veritabanları", icon: "hardDrive" },
        { name: "Webhooks", icon: "zap" },
        { name: "Message Queues", icon: "settings" },
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
      label: "Yapı Taşları",
      headline: "OpSolid'in otomasyonda kullandığı yapı taşları",
      description:
        "Her proje özel bir sistem olarak teslim edilir — operasyonlarınıza uygun üretim düzeyinde mühendislik katmanlarından kurulur; hazır paket kutusu değil, ihtiyaca göre mimari seçim.",
      tools: [
        {
          name: "Custom Workflow Engine",
          description:
            "Karmaşık otomasyonlar için özel olarak geliştirilmiş iş akışı motorları. Webhook tetikleyicileri, koşullu mantık, yeniden denemeler ve tam veri egemenliği — kapalı kutu yok.",
          techFeatures: [
            "Self-Hosted",
            "Açık Mimari",
            "Webhook Tetikleyiciler",
            "Hata Yönetimi",
            "Veri Egemenliği",
          ],
        },
        {
          name: "API Orchestration",
          description:
            "REST API, GraphQL ve mesaj kuyrukları üzerinden çok adımlı orkestrasyon. Üretim yükleri için yerleşik dönüşüm, dallanma ve hata kurtarma.",
          techFeatures: [
            "REST · GraphQL",
            "Veri Yönlendirme",
            "API Modülleri",
            "Hata Dallanması",
            "Gerçek Zamanlı",
          ],
        },
        {
          name: "AI Layer",
          description:
            "Pratik yapay zeka bileşenleri: sınıflandırma, çıkarım, ses ve sohbet ajanları. Denetlenebilir model çağrıları, yapılandırılmış çıktı ve insan onaylı kontrol noktaları.",
          techFeatures: [
            "Ses Ajanları",
            "Belge Yapay Zekası",
            "Sınıflandırma",
            "Yapılandırılmış Çıktı",
            "Denetim Logları",
          ],
        },
        {
          name: "Self-Hosted Stack",
          description:
            "Kendi altyapınızda veya AB'de barındırılan ortamlarda tam dağıtım — Postgres, kuyruklar, gözlemlenebilirlik. Çıkış her zaman iki hafta uzakta.",
          techFeatures: [
            "Postgres",
            "Message Queues",
            "Gözlemlenebilirlik",
            "AB'de Barındırma",
            "Kaynak Kod Sizin",
          ],
        },
      ],
    },

    trustStrip: {
      items: [],
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
            "Tekrarlayan, kural tabanlı işler için uçtan uca otomasyon — özel entegrasyonlar, sağlam hata yönetimi ve izleme ile.",
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
            "Self-hosted veya bulut, EU altyapısında. İstemediğiniz sürece ABD alt işleyen yok.",
        },
      ],
    },

    howItWorks: {
      label: "Süreç",
      headline: "Süreç üç adımda işliyor.",
      steps: [
        {
          title: "Keşfet",
          description:
            "Gerçek süreçlerinizi haritalandırırız, darboğazları tespit ederiz ve otomasyonun nerede karşılığını verdiğini buluruz. Tek satır kod yazılmadan önce yazılı kapsam alırsınız.",
        },
        {
          title: "Tasarla & kur",
          description:
            "Süreçlerinize uygun mimariyi tasarlar, özel kodla geliştirip teslim ederiz — her adımda net güncellemelerle iteratif şekilde.",
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
      headline: "Operasyonlarını ölçeklendirmek isteyen ekipler.",
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
            "Daha fazla tablo yerine güvenilir dahili araçlar, onay iş akışları ve panolar isteyen operasyon liderleri.",
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
            "Özel iş akışı otomasyonu",
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
            "Dijital Kartvizit — link, QR, WhatsApp, uygulama yok",
            "Dijital Resepsiyon — hizmet işletmeleri için AI resepsiyon",
            "Tüm ürünler doğrudan kullanıma hazır",
          ],
          ctaLabel: "Tüm ürünleri gör",
          ctaHref: "/products",
          tone: "dark",
        },
      ],
    },

    testimonials: {
      label: "Saha notları",
      headline: "Ekipler OpSolid ile çalıştıktan sonra neyi fark ediyor.",
      items: [
        {
          quote:
            "Sipariş verilerini artık dört sistem arasında kopyalamıyoruz. Süreç artık herkes işe başlamadan önce otomatik tamamlanıyor.",
          name: "Lena Richter",
          role: "Operasyon Direktörü",
          company: "Orta ölçekli perakende grubu",
        },
        {
          quote:
            "OpSolid bize bir platform satmaya çalışmadı. Gerçek sürecimizi haritalandırdılar, tekrarlayan kısımları otomatikleştirdiler ve tam dokümantasyonu teslim ettiler.",
          name: "Marco Weber",
          role: "COO",
          company: "Sanayi grubu, Almanya",
        },
        {
          quote:
            "Bütün entegrasyon katmanı self-hosted. ABD alt işleyen yok. Legal tek toplantıda onay verdi.",
          name: "Sarah Klein",
          role: "BT Direktörü",
          company: "Hizmet firması",
        },
      ],
    },

    finalCta: {
      eyebrow: "BAŞLAYALIM",
      headline:
        "Süreçlerinizi birlikte inceleyelim.",
      description:
        "Ücretsiz tanışma görüşmesi planlayın. Otomasyonun nerede kazandırdığını — ve nerede kazandırmadığını — birlikte ele alalım.",
      primaryCtaLabel: "Tanışma görüşmesi planla",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Hizmetleri gör",
      secondaryCtaHref: "/solutions",
    },

    cardStrip: {
      eyebrow: "ŞABLONLAR",
      heading: "Hazır 10 sektör şablonu",
      paragraph:
        "Emlakçı, klinik, restoran, DJ, kuaför, e-ticaret, mimar, fitness — her sektöre özel, linkle paylaşılan 10 kart. Canlı önizleme için tıklayın.",
      ctaLabel: "Tüm şablonları gör",
      ctaHref: "/products/digital-card",
    },

    agentShowcase: {
      eyebrow: "AI AJANLARI",
      heading: "Telefon, sohbet ve takvim için yapay zekâ ajanları",
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
          "Özel iş akışları ve API orkestrasyonu kullanarak kuruluşunuz genelindeki tekrarlayan, kural tabanlı görevleri otomatize edin.",
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
        "Manuel, tekrarlayan operasyonel işlerin güvenilir otomatik sistemlerle değiştirilmesine odaklanır.",
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
          title: "Pratik ve net kalın",
          description:
            "Otomasyon mantıklı olduğu yerde önerilir; olmadığı yerde önerilmez.",
        },
      ],
    },
    founder: {
      name: "Hasan Dönmez",
      title: "Kurucu & Sistem Mimarı",
      education: "",
      description:
        "Bağımsız otomasyon uzmanı. İş operasyonları için pratik otomasyon sistemleri, iş akışı entegrasyonları ve yapay zeka destekli süreçlerin tasarımı ve geliştirilmesine odaklanır.",
      expertiseLabel: "",
      expertise: [],
      footnote:
        "Avrupa genelinde ve uluslararası projelere açıktır.",
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
      email: "info@kutasia.com",
      response: "Tipik yanıt süresi: 1-2 iş günü.",
      location:
        "Avrupa genelinde ve uluslararası projelere açıktır.",
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
      "OpSolid, Hasan Dönmez'e ait, Almanya Arnsberg merkezli bir şahıs şirketidir (Einzelunternehmen).",
    sections: {
      according: "§ 5 DDG'ye göre (Dijital Hizmetler Yasası, eski § 5 TMG)",
      representedBy: "Temsil eden",
      contact: "İletişim",
      phone: "Telefon: Talep üzerine",
      register: "Ticaret Sicili",
      registerText:
        "OpSolid bir şahıs şirketidir (Einzelunternehmen) ve ticaret siciline (Handelsregister) kayıtlı değildir; bu hukuki biçim için kayıt gerekmez.",
      vatId: "KDV Kimlik No / Wirtschafts-Identifikationsnummer (W-IdNr)",
      vatIdText:
        "Katma değer vergisi kimlik numarası (§ 27a UStG uyarınca USt-IdNr.): DE462227107",
      responsibleContent:
        "§ 18 Abs. 2 MStV'ye göre içerikten sorumlu kişi (Medienstaatsvertrag, eski § 55 RStV)",
      disputeResolution: "Çevrimiçi Uyuşmazlık Çözümü",
      disputeResolutionText:
        "Avrupa Komisyonu, çevrimiçi uyuşmazlık çözümü (ODR) için bir platform sunmaktadır: https://ec.europa.eu/consumers/odr/. E-posta adresimizi yukarıda bulabilirsiniz. Bir tüketici hakem heyeti önünde uyuşmazlık çözümü sürecine katılmaya istekli ve zorunlu değiliz.",
      liabilityContent: "İçerik Sorumluluğu",
      liabilityContentText:
        "Hizmet sağlayıcı olarak, bu sayfalardaki kendi içeriklerimizden genel yasalar çerçevesinde § 7 Abs. 1 DDG'ye göre sorumluyuz. Ancak §§ 8-10 DDG'ye göre, iletilen veya depolanan üçüncü taraf bilgilerini izlemekle yükümlü değiliz.",
      liabilityLinks: "Bağlantı Sorumluluğu",
      liabilityLinksText:
        "Web sitemiz, içerikleri üzerinde hiçbir etkimiz olmayan harici üçüncü taraf web sitelerine bağlantılar içermektedir. Bağlantı verilen sayfaların içeriğinden her zaman ilgili sağlayıcı veya işletmeci sorumludur.",
      address: "Tam posta adresi, Gewerbeanmeldung sonrası eklenecektir.",
    },
  },

  privacy: {
    title: "Gizlilik Politikası",
    subtitle: "Datenschutzerklärung · Privacy Policy",
    notice:
      "Bu, OpSolid pazarlama sitesi ve OpSo Smart (Dijital Kartvizit) ürünü için GDPR (AB) ve KVKK (Türkiye) çerçevesinde hazırlanmış bir aydınlatma metnidir. Gewerbeanmeldung sonrası avukat onaylı nihai metin bu bildirimin yerini alacaktır. Son inceleme: Hasan Dönmez.",
    lastUpdated: "Son güncelleme: Mayıs 2026",
    sections: [
      {
        title: "1. Veri Koruma Özeti",
        content:
          "Aşağıda, bu web sitesini ziyaret ettiğinizde veya OpSo Smart ürününü kullandığınızda kişisel verilerinize ne olduğuna dair genel bir bakış sunulmaktadır. Kişisel veri, sizi kişisel olarak tanımlayabilecek her türlü veridir. İki düzenleme paralel olarak uygulanır: AB Genel Veri Koruma Tüzüğü (GDPR / DSGVO) ve Türk Kişisel Verilerin Korunması Kanunu (KVKK, 6698 sayılı Kanun).",
      },
      {
        title: "2. Sorumlu Taraf / Veri Sorumlusu",
        isResponsible: "true",
      },
      {
        title: "3. Veri Toplama",
        subsections: [
          {
            title: "İletişim Formu",
            content:
              "İletişim formu aracılığıyla gönderilen veriler (ad, iş e-postası, şirket, mesaj, opsiyonel telefon) talebin işlenmesi ve takibi amacıyla saklanır. Hukuki dayanak: Sözleşmeye ilişkin talepler için GDPR Madde 6(1)(b), meşru menfaat için GDPR Madde 6(1)(f) veya açık rıza için GDPR Madde 6(1)(a). KVKK dayanağı: m.5(2)(c) (sözleşmenin ifası) veya m.5(1) açık rıza.",
          },
          {
            title: "Sunucu Günlük Dosyaları",
            content:
              "Barındırma sağlayıcısı, tarayıcı türü, işletim sistemi, yönlendiren URL, ana bilgisayar adı, IP adresi (mümkün olduğunda kısaltılmış) ve istek zamanını otomatik olarak toplar. Saklama: 14 gün güvenlik ve kötüye kullanım analizi için, ardından silinir. Hukuki dayanak: GDPR m.6(1)(f) (operasyonel güvenlikte meşru menfaat).",
          },
          {
            title: "Çerez Onay Kaydı",
            content:
              "Çerez bandında bir tercih yaptığınızda (kabul / ret), seçiminizi zaman damgasıyla birlikte tarayıcınızın localStorage alanında saklarız. Bu onay kaydı için IP adresinizi iletmiyoruz. Tercihinizi alt menüdeki bağlantıyla istediğiniz zaman değiştirebilir veya geri alabilirsiniz. Hukuki dayanak: GDPR m.6(1)(c) (TDDDG § 25 uyarınca onayı belgeleme yasal yükümlülüğü).",
          },
        ],
      },
      {
        title: "4. Barındırma",
        content:
          "Pazarlama sitesi, OpSo Smart ürününün backend'i ve Postgres veritabanı, tek bir kendi yönetimimizdeki Hostinger VPS (Hostinger International Ltd., AS47583) üzerinde çalışmaktadır. Sunucu fiziksel olarak Vilnius, Litvanya (AB) konumundadır. Sunucu hostname: srv1150632.hstgr.cloud. Tüm ziyaretçi trafiği, kart içerikleri, müşteri kayıtları ve veritabanı yedekleri AB toprağında kalır. Hostinger ile DPA (GDPR m.28 kapsamında AVV) dosyalanmıştır.",
      },
      {
        title: "5. Çerezler ve Analitik",
        subsections: [
          {
            title: "Kesinlikle gerekli olanlar",
            content:
              "Dil tercihi ve çerez onay durumu tarayıcınızın localStorage alanında saklanır. Bunlar sitenin çalışması için zorunludur ve TDDDG § 25(2) uyarınca onaya tabi değildir.",
          },
          {
            title: "Opsiyonel analitik",
            content:
              "Çerez bandında analitik onayı verirseniz, toplulaştırılmış, anonim sayfa görüntüleme sayıları toplanabilir. Bu toplama çerezsiz ve kişisel tanımlayıcı olmadan yapılır; bireysel ziyaretçi tanımlayamaz. Reddetmeniz halinde hiçbir analitik çağrısı yapılmaz ve hiçbir veri Vilnius'taki Hostinger sunucusunu terk etmez.",
          },
          {
            title: "Üçüncü taraf izleme, reklam veya sosyal eklenti yok",
            content:
              "Reklam çerezi, üçüncü taraf izleme pikseli, sosyal ağ eklentisi veya parmak izi (fingerprint) yoktur. Yazı tipleri kendi sunucularımızda barındırılır (Google Fonts CDN çağrısı yok).",
          },
        ],
      },
      {
        title: "6. Alt İşleyiciler / Sub-Processors",
        content:
          "Hizmeti sunmak için aşağıdaki alt işleyicileri kullanırız. Her biri için GDPR m.28 kapsamında AVV / DPA dosyalanmıştır. Güncel liste her zaman info@opsolid.de adresinden talep edilebilir.",
        subsections: [
          {
            title: "Barındırma ve altyapı",
            content:
              "Hostinger International Ltd. (Litvanya, AB) — pazarlama sitesi, OpSo Smart uygulaması ve Postgres veritabanını Vilnius'taki tek bir VPS üzerinde barındırır. ABD'de barındırma alt işleyicisi yoktur.",
          },
          {
            title: "E-posta gönderimi",
            content:
              "İletişim formu bildirimleri için SMTP relay. Sağlayıcı detayları talep üzerine; değiştiğinde güncellenir.",
          },
          {
            title: "Ödemeler (OpSo Smart, planlanan)",
            content:
              "Tek seferlik ve abonelik faturalandırması için Stripe Payments Europe Ltd. (İrlanda). Kart bilgileri Stripe tarafından tokenize edilir; OpSolid ham PAN'ı görmez. AVV Stripe Services Agreement üzerinden. Stripe ABD'ye uluslararası aktarım DPF + SCC kapsamında.",
          },
          {
            title: "AI sağlayıcılar (kullanıldığında)",
            content:
              "OpenAI Ireland Ltd. ve Anthropic Ireland Ltd. üretim özellikleri için API üzerinden kullanılabilir. AVV ve SCC mevcut; kullanıcı içeriği model eğitimi için kullanılmaz (API tarafında opt-out aktif).",
          },
        ],
      },
      {
        title: "7. Uluslararası Veri Aktarımı",
        content:
          "Kişisel veriler Avrupa Ekonomik Alanı dışına aktarıldığında (örn. ABD'de Vercel, Stripe, OpenAI, Anthropic), aktarım (a) alıcı DPF sertifikalı ise AB-ABD Veri Gizliliği Çerçevesi yeterlilik kararına, ya da (b) Standart Sözleşme Hükümleri (SCC, AB 2021/914) ile dökümante edilmiş Transfer Etki Değerlendirmesine dayanır. Türkiye'de yerleşik veri sahipleri için ek olarak KVKK m.9 yurtdışı aktarım kuralları uygulanır: aktarımlar KVKK standart sözleşmesi (10.07.2024 Yönetmeliği) kapsamında yapılır ve gerektiğinde 5 iş günü içinde Kurum'a bildirilir.",
      },
      {
        title: "8. OpSo Smart Dijital Kartvizit Ürünü",
        subsections: [
          {
            title: "Amaç ve hukuki dayanak",
            content:
              "OpSo Smart lead formu veya self-servis sipariş akışı üzerinden gönderdiğiniz verileri (ad, iş e-postası, şirket, ünvan, telefon (opsiyonel), mesaj, foto/logo upload, marka renkleri, sosyal linkler) hizmetin sunulması için işleriz. Hukuki dayanak: GDPR m.6(1)(b) (sözleşme ifası) ve GDPR m.6(1)(a) (kamuya yayın için açık rızanız).",
          },
          {
            title: "Kartınızın kamuya yayınlanması",
            content:
              "Bir OpSo Smart kartını /c/{slug} altında yayınladığınızda, girdiğiniz bilgiler internette kamuya açık hale gelir. Bunun için yayın adımında ayrı, açık opt-in onayınız gereklidir. Kartı istediğiniz zaman hesabınızdan yayından kaldırabilir veya silebilirsiniz; bu durumda noindex header eklenir ve büyük arama motorlarından URL kaldırma talebi yapılır.",
          },
          {
            title: "Üçüncü kişi içeriği",
            content:
              "Yüklediğiniz fotoğraf, logo veya diğer içeriklerin tüm haklarına sahip olduğunuzdan yalnız siz sorumlusunuz. Yükleyerek bu hakların sizde olduğunu beyan edersiniz. Notice-and-takedown talepleri info@opsolid.de adresine gönderilebilir; 7 gün içinde yanıtlarız.",
          },
          {
            title: "Barındırma",
            content:
              "Kart ve müşteri verileri Hostinger VPS (Litvanya, AB) üzerinde saklanır. OpSo Smart kart içerikleri için ABD alt işleyici yoktur; ödeme verileri yukarıda belirtilen ayrı sub-processor şartları altında Stripe tarafından işlenir.",
          },
          {
            title: "14 günlük cayma hakkı (B2C)",
            content:
              "OpSo Smart'ı tüketici olarak (B2C, AB/AEA) sipariş ederseniz, § 355 BGB uyarınca 14 günlük cayma hakkına sahipsiniz. Dijital hizmetin 14 gün dolmadan başlaması için, derhal ifa talep ettiğinizi ve tam ifa halinde cayma hakkınızın sona ereceğini ayrı checkbox'larla onaylamanız gerekir. Onaylarınızı ispat amacıyla loglanır. 19 Haziran 2026'dan itibaren tek tıkla cayma butonu sunulur.",
          },
          {
            title: "Saklama süresi",
            content:
              "Aktif OpSo Smart kartları: abonelik aktif olduğu sürece saklanır. İptal / inaktif: abonelik bitiminden 90 gün sonra silinir (60. günde hatırlatma e-postası). Lead form gönderimleri (satın alma yok): 24 ay. Faturalar: § 257 HGB / Vergi Usul Kanunu uyarınca 10 yıl saklanır (yasal yükümlülük).",
          },
          {
            title: "Silme hakkı",
            content:
              "OpSo Smart kartınızı ve ilgili tüm kişisel verileri hesabınız içinden tek tıklamayla veya info@opsolid.de adresine e-posta göndererek silebilirsiniz. Silme işlemi 30 gün içinde tamamlanır. Yıkıcı işlemler öncesi kimlik doğrulama (e-posta onayı + aktif ise 2FA) gereklidir.",
          },
        ],
      },
      {
        title: "9. Haklarınız (GDPR)",
        content:
          "GDPR m.15-22 uyarınca: erişim (m.15), düzeltme (m.16), silme (m.17), kısıtlama (m.18), veri taşınabilirliği (m.20) ve işlemeye itiraz (m.21) hakkına sahipsiniz. Verdiğiniz onayı önceki işlemeyi etkilemeden istediğiniz zaman geri çekebilirsiniz. Haklarınızı kullanmak için: info@opsolid.de — bir ay içinde yanıtlarız (m.12(3)). Mutaden bulunduğunuz yer ya da iddia edilen ihlalin yerindeki denetim otoritesine de şikayette bulunabilirsiniz.",
      },
      {
        title: "10. Haklarınız (KVKK Madde 11) — Türkiye'de yerleşik veri sahipleri için",
        content:
          "6698 sayılı KVKK m.11 uyarınca: kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içi/yurt dışında aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, KVKK m.7'deki şartlarda silinmesini/yok edilmesini isteme, otomatik sistemlerle yapılan analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme, kanuna aykırı işleme nedeniyle uğradığınız zararın giderilmesini talep etme. Başvuru: info@opsolid.de. KVKK 2026/347 ilke kararı uyarınca aydınlatma metni (bu sayfa) ile açık rıza beyanı ayrı belgelerdir; rıza onayı ürün akışında ayrıca alınır.",
      },
      {
        title: "11. Veri İhlali Bildirimi",
        content:
          "Bir kişisel veri ihlali, hak ve özgürlükleriniz için risk doğurabilecekse, ihlali öğrendiğimiz andan itibaren 72 saat içinde yetkili denetim otoritesine bildiririz (GDPR m.33). Yüksek riskli ihlaller etkilenen kişilere de gecikmeksizin bildirilir (GDPR m.34). KVKK kapsamında ayrıca Kurum'a ve etkilenen kişilere mümkün olan en kısa sürede bildirim yaparız (KVKK Kurul kararları).",
      },
      {
        title: "12. Bu Politikadaki Değişiklikler",
        content:
          "Yasal değişiklikleri veya işleme uygulamalarımızdaki değişiklikleri yansıtmak için bu politikayı güncelleyebiliriz. Önemli değişiklikler bu sayfada ve hesabınız varsa en az 30 gün önceden e-postayla duyurulur.",
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
        slug: "workflow-automation-fundamentals",
        title: "İş Akışı Otomasyonu: Uygulamada Gerçekten Ne Önemli",
        excerpt:
          "Bir iş akışı otomasyonunu üretimde ayakta tutan şey neyse onlara odaklanan bir inceleme — hata yönetimi, veri egemenliği, izlenebilirlik ve çıkış maliyeti, seçilen motordan bağımsız olarak.",
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
        slug: "choosing-the-right-automation-architecture",
        title:
          "İşletmeniz İçin Doğru Otomasyon Mimarisini Seçmek",
        excerpt:
          "Noktadan noktaya entegrasyonlar, özel orkestrasyon katmanları ve hibrit modeller arasında nasıl seçim yapılır — hacme, uyumluluğa ve ekip büyüklüğüne göre; tedarikçi sunumuna göre değil.",
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
          "Her proje özel bir sistem olarak teslim edilir; temeli REST API'ler, mesaj kuyrukları, Postgres ve webhook'lardan kurulur; AI bileşenleri ise değer kattığı yerlerde eklenir. Mimari her kullanım senaryosu için ayrı seçilir — tek tip bir araç kutusu kullanılmaz.",
        category: "technical",
      },
      {
        question: "Neden hazır bir SaaS yerine özel geliştirme?",
        answer:
          "Özel olarak geliştirilmiş sistemler verileriniz, iş akışlarınız ve maliyet eğriniz üzerinde tam kontrol sağlar. Her çalıştırma başına ücret yok, tedarikçi kilidi yok, kapalı fiyat katmanları yok. Mimari, süreçlerinize göre tasarlanır — ve kaynak kod sizindir.",
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
        "Custom Workflows",
        "Supabase",
        "Meta Business",
        "HubSpot",
        "Stripe",
      ],
    },
    items: [
      {
        name: "Dijital Kartvizit",
        tagline: "Link · QR kod · WhatsApp · uygulama yok",
        description:
          "Almanya'da barındırılan bir dijital kartvizit. Profilinizi link, QR kod, WhatsApp veya e-posta ile paylaşın - alıcının uygulamaya ihtiyacı yok ve kartı istediğiniz zaman düzenlersiniz. Emlakçı, kuaför, klinik, restoran, fotoğrafçı gibi meslekler için sektör şablonları — hepsi GDPR-yerli.",
        status: "Canlı",
        href: "/products/digital-card",
        externalUrl: "",
        icon: "idCard",
        startingPrice: "Ücretsiz",
        category: "Müşteriye yönelik",
        stack: "Next.js · Hetzner · vCard · HubSpot",
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
        stack: "OpenAI · Custom Workflows · Supabase · HubSpot",
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
        stack: "Cal.com · Retell · Custom Workflows · Google Calendar",
      },
      {
        name: "E-posta Otomasyon Ajanı",
        tagline: "Dış iletişim · triyaj · yanıt taslağı",
        description:
          "AI e-posta iş akışları — kişiselleştirilmiş varyantlarla soğuk dış iletişim, gelen kutusu triyajı, onay için otomatik taslaklar. Instantly, AgentMail ve özel orkestrasyon akışları üzerine kurulu. Deliverability ısıtılmış, GDPR uyumlu.",
        status: "Canlı",
        href: "/products/email-agent",
        externalUrl: "",
        icon: "mail",
        startingPrice: "€99 – €499/ay'dan başlar",
        category: "İletişim",
        stack: "Instantly · AgentMail · Custom Workflows · OpenAI",
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
        stack: "Retell · HubSpot · Custom Workflows · Supabase",
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
        eyebrow: "[ OPSO SMART ]   DİJİTAL KARTVİZİTİNİZ",
        title: [
          "OpSo Smart.",
          "Dijital kartvizitinizi kendiniz oluşturun -",
          "ücretsiz, saniyeler içinde canlı.",
        ],
        paragraph:
          "Şablon seçin, bilgilerinizi girin, yayınlayın. Kartınız saniyeler içinde opsolid.de/c/adiniz adresinde canlı olur, ücretsizdir. Link, QR kod, WhatsApp veya e-posta ile paylaşın - alıcının uygulamaya ihtiyacı yok ve kartı istediğiniz zaman düzenlersiniz. Frankfurt'ta EU barındırma, GDPR-yerli.",
        primaryCta: "Ücretsiz kartımı oluştur",
        secondaryCta: "20 canlı şablonu gör",
        tags: "OPSO SMART · LİNK · QR KOD · WHATSAPP · vCARD · UYGULAMA YOK · ÜCRETSİZ",
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
            title: "Kendiniz tasarlayın",
            desc: "Yazdıkça canlı önizleme. Düzen ve tema seçin, renklerinizi ve fotoğraflarınızı ekleyin, anında yayınlayın. Sizin için yapılmasını mı istersiniz? White-glove bir üst pakette.",
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
            title: "EU barındırma (Frankfurt)",
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
            name: "Free",
            price: "€0",
            cadence: "Kendiniz oluşturun, saniyeler içinde canlı.",
            popular: "",
            bullets: [
              "Tüm şablonlar, düzenler ve temalar",
              "Link + QR kod (PNG + SVG)",
              "Kişilere kaydet (vCard)",
              "opsolid.de/c/adiniz üzerinde barındırma",
              "Küçük „Made with OpSo Smart“ rozeti",
              "Giriş gerekmez",
            ],
            cta: "Ücretsiz kartımı oluştur",
            href: "#lead",
          },
          {
            name: "Premium",
            price: "€149",
            cadence: "tek seferlik · 1. yıldan sonra €9/yıl hosting",
            popular: "true",
            bullets: [
              "Free'deki her şey, rozet kaldırıldı",
              "Özel slug veya kendi alan adınız",
              "WhatsApp paylaşım butonu",
              "Analitik (görüntüleme + tıklama)",
              "Video bloğu + müşteri toplama / CRM",
              "Birden fazla kart",
            ],
            cta: "Premium'a geç",
            href: "#lead",
          },
          {
            name: "White-glove",
            price: "€299'dan başlayan",
            cadence: "teklifli · sizin için tasarlarız",
            popular: "",
            bullets: [
              "Kartınızı 48 saatte sizin için elle tasarlarız",
              "Sınırsız revizyon",
              "Çoklu dil (DE/EN/TR)",
              "Ekip kurulumu",
              "Premium'daki her şey",
              "Öncelikli destek",
            ],
            cta: "White-glove iste",
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
            "Teşekkürler - bir iş günü içinde önizleme linkiyle dönüş yapacağız.",
          error:
            "Bir sorun oluştu. Lütfen doğrudan info@opsolid.de adresine yazın.",
        },
      },
      testimonials: {
        label: "SOSYAL KANIT",
        heading: "İlk kartından sonra müşteriler ne söylüyor.",
        items: [
          {
            quote:
              "Kartımı on dakikada oluşturdum. Şablon seçtim, bilgilerimi yazdım, yayınladım - ve link canlıya çıktı. Ne yazışma ne de bekleme.",
            name: "Lena Richter",
            role: "Bağımsız emlakçı",
            company: "Berlin, DE",
          },
          {
            quote:
              "Verilerin AB'de kalması, hukuk ekibimizi ikna etti. Sırf bu bile bizim için belirleyici oldu.",
            name: "Marco Weber",
            role: "COO",
            company: "Münih sanayi grubu",
          },
          {
            quote:
              "Aylık abonelik yok. „Enterprise paketi“ satışı yok. Ücretsiz başladım, özel alan adı için bir kez ödedim, yoluma devam ettim. Tam da istediğim şey.",
            name: "Sarah Klein",
            role: "Bağımsız danışman",
            company: "Berlin, DE",
          },
        ],
      },
      howItWorks: {
        label: "NASIL ÇALIŞIR",
        heading: "Dört adım. Saniyeler içinde canlı.",
        steps: [
          {
            title: "01 · Şablon seçin",
            description:
              "20 sektör şablonuna göz atın ve size uygun olanı seçin. Eşleşecek düzen ve temayı belirleyin.",
          },
          {
            title: "02 · Bilgilerinizi girin",
            description:
              "Adınızı, rolünüzü, linklerinizi, fotoğraf ve renklerinizi ekleyin. Yazdıkça canlı önizleme güncellenir.",
          },
          {
            title: "03 · Saniyeler içinde yayınlayın",
            description:
              "Yayınlayın ve kartınız opsolid.de/c/adiniz adresinde canlı olsun. Giriş yok, bekleme yok.",
          },
          {
            title: "04 · Linkinizi paylaşın",
            description:
              "Link ve QR kodu her yerde paylaşın: e-posta imzaları, WhatsApp, Instagram, basılı materyal.",
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
              "Anında: kendiniz oluşturup saniyeler içinde yayınlayın. Sizin için tasarlamamızı mı istersiniz? White-glove'u seçin (48 saat).",
          },
          {
            question: "Alıcının bir uygulamaya ihtiyacı var mı?",
            answer:
              "Hayır. Kart link veya QR kod ile herhangi bir tarayıcıda açılır - kurulacak bir şey yok. Link, QR, WhatsApp veya e-posta ile paylaşın, alıcı tek dokunuşla profilinizi görür.",
          },
          {
            question: "Kartımı daha sonra kendim düzenleyebilir miyim?",
            answer:
              "Evet, istediğiniz zaman - bir düzenleme linkine sahip olursunuz. Açın, değiştirin, saniyeler içinde yeniden yayınlayın. Talep yok, bekleme yok.",
          },
          {
            question: "Verilerim nerede saklanıyor?",
            answer:
              "EU barındırma (Frankfurt) - Hetzner / IONOS. ABD alt işleyen yok. Talep üzerine DPA hazır.",
          },
          {
            question: "Kartımı iptal edebilir veya silebilir miyim?",
            answer:
              "Evet, istediğiniz zaman. Tek tıkla silme. Otomatik yenileme tuzağı yok. Hosting, 1. yıldan sonra yıllık olarak peşin ödenir.",
          },
          {
            question: "Ekibim için 10+ karta ihtiyacım var. Nasıl?",
            answer:
              "Her kart ücretsiz, kişi başına bir tane oluşturun. Kendiniz kurmak istemediğiniz daha büyük bir kurulum için info@opsolid.de adresine yazın, yardımcı oluruz.",
          },
        ],
      },
      cta: {
        eyebrow: "HAZIR MISIN?",
        heading: "Kartınız. Saniyeler içinde canlı.",
        primaryCta: "Ücretsiz kartımı oluştur",
        secondaryCta: "Şablonlara gözat",
      },
      preview: {
        meta: {
          title: "Dijital Kartvizit — Canlı Önizleme | OpSolid",
          description:
            "Dijital kartvizitinizi kendiniz oluşturun. Telefonunuzda canlı önizleyin, şablonlar arasında kaydırın ve saniyeler içinde ücretsiz yayınlayın.",
        },
        eyebrow: "CANLI ÖNİZLEME",
        title: "Kartınızı oluşturun, canlı önizleyin",
        subtitle:
          "Şablonlar arasında kaydırın. Canlı önizleyin. Saniyeler içinde ücretsiz yayınlayın.",
        hintSwipe: "Kaydırın",
        hintArrows: "Tasarımlar arasında ok tuşlarıyla geçin",
        prev: "Önceki tasarım",
        next: "Sonraki tasarım",
        orderCta: "Bu tasarımı kullan",
        secondaryCta: "Tüm tasarımları gör",
        counter: "{{current}} / {{total}}",
        priceYearly: "/yıl",
        priceMonthly: "/ay",
        priceOneTime: "tek seferlik",
      },
      order: {
        gallery: {
          title: "Bir tasarım seçin",
          subtitle:
            "Her tasarım numaralıdır. Arama sırasında sadece numarayı söyleyin yeter.",
          selectCta: "Bu tasarımı seç",
          selected: "Seçildi",
          fromPrice: "başlangıç",
          demoCta: "Demo",
          demoModalChoose: "Bu şablonu seç",
          demoModalBack: "Galeriye dön",
          comingSoon: "Yakında",
          comingSoonHint: "Bu tasarım hazırlanıyor.",
          prevSlide: "Önceki tasarım",
          nextSlide: "Sonraki tasarım",
          slideOf: "{{current}} / {{total}}",
          sectorAll: "Tümü",
          sectorRealEstate: "Emlak",
          sectorLawyer: "Hukuk",
          sectorRestaurant: "Restoran",
          sectorCreator: "Kreatif",
          sectorClinic: "Klinik",
          sectorMusic: "Müzik",
          sectorSalon: "Kuaför",
          sectorRetail: "Butik",
          sectorArchitecture: "Mimari",
          sectorFitness: "Fitness",
          sectorHospitality: "Otel",
          sectorConsultant: "Danışmanlık",
          sectorTech: "Teknoloji",
          sectorEvents: "Etkinlik",
          sectorDentist: "Diş Hekimi",
          sectorPsychologist: "Psikolog",
          sectorBeauty: "Güzellik",
          sectorAccounting: "Muhasebe",
          sectorSoftware: "Yazılım & BT",
          sectorContentCreator: "İçerik Üretici",
          sectorWellness: "Wellness",
          sectorEventPlanner: "Organizasyon",
          sectorAuto: "Oto Galeri",
          sectorInterior: "İç Mimar",
          monthlyShort: "/ay",
        },
        form: {
          eyebrow: "KART OLUŞTUR",
          title: "Bilgileriniz, tasarımınız, kartınız.",
          subtitle:
            "Formu doldurun — yayınlar yayınlamaz kartınız opsolid.de/c/… adresinde canlıya alınır.",
          howToCreate:
            "Kartı herkes oluşturabilir — hesap gerekmez. Tasarımı seç, formu doldur; dakikalar içinde yayında olur. Dilediğin zaman düzenlemen için özel bir bağlantı alırsın.",
          eventJoinLabel:
            "Kartım katılımcı rehberinde görünsün — diğer katılımcılar beni bulabilsin.",
          draftRestored:
            "Önceki taslağın geri yüklendi — kaldığın yerden devam edebilirsin.",
          draftDiscard: "Baştan başla",
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
          sampleHint: "Denemek için örnek içerik — kendi bilgilerinizle değiştirin.",
          clearSample: "Örneği temizle",
          cardLanguageLabel: "Kart dili",
          cardLanguageHint:
            "Kartınızı ziyaret edenlerin göreceği dil. Daha sonra editörden değiştirebilirsiniz.",
          spotlightSection: "Şu an · Öne çıkan",
          spotlightHint:
            "Fotoğrafının hemen altında görünen dikkat çekici, anlık bir not — kısa bir yazı ve/veya tek bir bağlantı. Gizlemek için boş bırak.",
          spotlightEnabled: "Kartımda göster",
          spotlightBody: "Şu an neler oluyor?",
          spotlightBodyPlaceholder: "ör. Temmuz için yeni projeler alıyorum — merhaba de 👋",
          spotlightLinkUrl: "Bağlantı (isteğe bağlı)",
          spotlightLinkLabel: "Buton metni (isteğe bağlı)",
          spotlightLinkLabelPlaceholder: "Daha fazla",
          spotlightPlacement: "Karttaki konum",
          spotlightPlaceBelowPhoto: "Fotoğrafın altında (önerilen)",
          spotlightPlaceTop: "Kartın üstünde",
          spotlightPlaceBottom: "Kartın altında",
          statsSection: "İstatistikler",
          statsHint:
            "Birçok tasarımda istatistik şeridi olarak görünen gerçek rakamlar (ör. 12 — Yıl).",
          statsEmpty:
            "Henüz istatistik yok. Gurur duyduğunuz gerçek rakamları ekleyin (ör. 12 — Yıl deneyim). İstatistik girilmezse kartta bu bölüm hiç görünmez.",
          statsValue: "12+",
          statsLabel: "Yıl deneyim",
          statsAdd: "İstatistik ekle",
          statsRemove: "Sil",
          taglineLabel: "Slogan",
          taglinePlaceholder: "Kısa bir tanıtım cümlesi (opsiyonel)",
          taglineHint:
            "Bazı tasarımlarda adınızın altında görünür. Boşsa unvanınız/pozisyonunuz kullanılır.",
          locationLabel: "Karttaki konum",
          locationAuto: "Adresten",
          locationCustom: "Özel metin",
          locationHidden: "Gizle",
          locationAutoHint: "Adresinizden türetildi:",
          locationAutoEmpty:
            "Henüz adres yok — adres ekleyene kadar konum gösterilmez.",
          locationPlaceholder: "Remote · İstanbul",
          locationHiddenHint: "Kartınızda konum etiketi görünmez.",
          copyFromContact: "Yukarıdaki bilgileri kullan",
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
          designNotes: "Özel istekler (isteğe bağlı)",
          designNotesPh:
            "Bilmemiz gereken özel bir şey: yazı tipi, logo düzenlemeleri, düzen tercihleri.",
          resetColors: "Şablon renklerini sıfırla",
          uploadWrongType: "Desteklenmeyen format. JPG, PNG veya WebP kullanın.",
          dragHere: "Buraya sürükleyin veya tıklayın",
          uploadHint: "JPG, PNG, WebP · maks 5 MB",
          uploadRemove: "Kaldır",
          submitLabel: "Öde ve kartımı yayınla",
          selectionModeLabel: "Tasarımı seçin",
          templateColors: "Şablon renkleri",
          uploadDone: "Yüklendi",
          uploading: "Yükleniyor…",
          templateNoPhoto: "Bu tasarım fotoğraf kullanmıyor.",
          templateNoLogo: "Bu tasarım logo kullanmıyor.",
          templateNoAsset: "Bu tasarım bu öğeyi kullanmıyor.",
          previewExpand: "Tam önizlemeyi aç",
          previewClose: "Önizlemeyi kapat",
          previewOpenInNewTab: "Yeni sekmede aç",
          previewLanguage: "Kart dili",
          previewNoPaymentNote: "Sadece önizleme",
          // Phase 7.9
          editPosition: "Pozisyonu düzenle",
          photoEditorTitle: "Profil fotoğrafı pozisyonu",
          photoEditorSubtitle:
            "Sürükleyerek konumla, yakınlaştırma için kaydırıcıyı kullan.",
          logoEditorTitle: "Logo pozisyonu",
          logoEditorSubtitle:
            "Logoyu çerçevesinde tam istediğin yere yerleştir.",
          photoEditorZoom: "Yakınlaştırma",
          photoEditorReset: "Sıfırla",
          photoEditorSave: "Kaydet",
          photoEditorCancel: "İptal",
          photoEditorHint: "Halka, fotoğrafın görünür merkezini gösterir.",
          shareLink: "Önizleme linki",
          shareLinkTitle: "Önizleme linkini paylaş",
          shareLinkSubtitle:
            "Kartını yayınlamadan önce başkalarına gönder. Linke sahip olan herkes okuyabilir.",
          shareLinkUrl: "Link",
          shareLinkCopy: "Kopyala",
          shareLinkCopied: "Kopyalandı ✓",
          shareLinkOpen: "Yeni sekmede aç",
          shareLinkNote:
            "Bağlantı tüm form bilgilerini içerir; kart siz oluşturana kadar yayında değildir.",
          videoSection: "Video (opsiyonel)",
          videoHint:
            "YouTube veya Vimeo bağlantısı yapıştır — kartında doğrudan oynar.",
          videoLabel: "Video bağlantısı",
          videoPlaceholder: "https://youtube.com/watch?v=…",
          videoInvalid: "Yalnızca YouTube veya Vimeo bağlantıları desteklenir.",
          videoPlacementLabel: "Video konumu",
          videoPlacementTop: "Üst",
          videoPlacementDefault: "Varsayılan",
          videoPlacementBottom: "Alt",
          customSectionsSection: "Özel bölümler (opsiyonel)",
          customSectionsHint:
            "En fazla 6 bölüm ekleyebilirsin — ödüller, diller, ne istersen.",
          // Düzenlenebilir bölüm başlıkları
          labelsSection: "Bölüm başlıkları (opsiyonel)",
          labelsHint:
            'Bunlar kartınızdaki bölüm BAŞLIKLARINI yeniden adlandırır (örn. "Hizmetler" → "Menü"). İçeriği yukarıdaki bölümlerden girersiniz — boş bıraktığınız bir bölüm (ve başlığı) kartta görünmez. Boş bırakırsanız varsayılan kalır.',
          customSectionAdd: "Bölüm ekle",
          customSectionTitle: "Başlık",
          customSectionTitlePh: "Örn. Diller, Ödüller, Basın",
          customSectionBody: "İçerik",
          customSectionBodyPh:
            "Açıklama — kartını açan herkesin göreceği metin.",
          customSectionRemove: "Kaldır",
          customSectionsCount: "{n} / 6",
          customSectionAddImage: "Resim ekle (opsiyonel)",
          // FAQ editor
          faqSection: "SSS (opsiyonel)",
          faqHint:
            "En fazla 12 sık sorulan soru — kartında akordiyon biçiminde görünür.",
          faqQuestion: "Soru",
          faqAnswer: "Cevap",
          faqAdd: "Soru ekle",
          faqRemove: "Kaldır",
          faqEmpty:
            "Henüz SSS yok. İlk soruyu ekle.",
          // Testimonials editor
          testimonialsSection: "Müşteri yorumları (opsiyonel)",
          testimonialsHint:
            "En fazla 8 müşteri alıntısı — yerleşik yorumları olmayan tüm şablonlarda gösterilir.",
          testimonialAuthor: "Ad (ör. Ayşe K.)",
          testimonialRole: "Unvan / şirket (opsiyonel)",
          testimonialQuote: "Alıntı",
          testimonialAdd: "Yorum ekle",
          testimonialRemove: "Kaldır",
          testimonialsEmpty:
            "Henüz müşteri yorumu yok. İlk alıntını ekle.",
          typographySection: "Tipografi (opsiyonel)",
          typographyHint:
            "Şablonun fontlarını değiştirir. Şablon varsayılanı seçili kalırsa şablonun kendi fontları kullanılır.",
          typographyDefaultLabel: "Şablon varsayılanı",
          typographyDefaultDesc: "Şablonun kendi tipografisini kullanır.",
          typographyModernLabel: "Modern",
          typographyModernDesc: "Inter + Manrope — minimalist, kurumsal.",
          typographyClassicLabel: "Klasik",
          typographyClassicDesc:
            "Cormorant Garamond + Source Sans 3 — zarif, geleneksel.",
          typographyEditorialLabel: "Editöryel",
          typographyEditorialDesc: "Playfair Display + Inter — dergi havası.",
          typographyBoldLabel: "Cesur",
          typographyBoldDesc: "Bebas Neue + Inter — etkileyici, sportif.",
          billingSection: "Ödeme modeli",
          billingMonthly: "Aylık",
          monthlyFooter: "Düşük giriş bariyeri. İstediğiniz zaman iptal.",
          billingYearly: "Yıllık",
          billingBestValue: "En avantajlı",
          yearlyFooter: "Aylığa göre ~%35 indirim. Revizyonlar dahil.",
          billingOneTime: "Tek seferlik",
          oneTimeFooter: "Ömür boyu barındırılır. Yenileme yok.",
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
          step1Title: "İletişim",
          step1Summary: "Size nasıl ulaşırız",
          step1Next: "Kart içeriğine geç",
          step2Title: "Kart içeriği",
          step2Summary: "Kartınızda ne görünecek",
          step2Next: "Marka kimliğine geç",
          step3Title: "Marka kimliği",
          step3Summary: "Renkler, stil, tasarım notları",
          step3Next: "Ödemeye geç",
          step4Title: "Ödeme",
          step4Summary: "Planınızı seçin",
          // Self-serve free flow (shown when payments are off). The card is
          // created & published, not ordered/paid for.
          step4TitleCreate: "Oluştur & yayınla",
          step4SummaryCreate: "Adresini kontrol et ve yayına al",
          step3NextCreate: "Yayınlamaya devam et",
          slugSection: "Kart adresi",
          slugHint:
            "Kartının adresi. Boş bırakırsan ad-soyaddan otomatik üretilir.",
          createExplainerTitle: "Tıklayınca ne olur",
          createExplainerBody:
            "Kartın anında yayınlanır ve linkiyle erişilebilir. Sana linki ve özel bir düzenleme linkini e-posta ile göndeririz. Tamamen ücretsiz, kredi kartı yok.",
          createSubmitLabel: "Ücretsiz yayınla",
          createSubmitHint: "Kredi kartı yok. Kartın anında yayına girer.",
          createSubmit: "Kartımı ücretsiz oluştur",
          stepIndicator: "Adım {current} / {total}",
          stepEmpty: "Lütfen doldurun",
          stepBack: "Geri",
          reviewEdit: "Düzelt",
          contactEmailInline: "E-postan (kart linkini buraya göndeririz)",
          previewLabelMobile: "Önizleme",
          previewSheetTitle: "Canlı önizleme",
          previewSheetClose: "Kapat",
          previewLiveBadge: "Canlı önizleme",
          previewLiveHint: "Yazdıkça güncellenir",
          stepLockedHint: "Önceki adımı tamamlayın",
        },
      },
      edit: {
        title: "Kartınızı düzenleyin",
        subtitle:
          "Yazım hataları, telefon numarası, sosyal linkler — kartınızdaki her şeyi kendiniz düzenleyin. Değişiklikler saniyeler içinde canlıya çıkar.",
        liveBadge: "Kartın yayında",
        slugRenameWarning:
          "Yeni adres «Kaydet»'e basıldığında uygulanır. Eski adres otomatik olarak yeni adrese yönlenir.",
        viewAsOwner: "Sahip modunda görüntüle",
        analyticsLoading: "Yükleniyor…",
        analyticsEmpty: "Analitik yüklenemedi.",
        analyticsLast7: "Son 7 gün",
        analyticsLast30: "Son 30 gün",
        analyticsTotal: "Toplam",
        sourceWallet: "Cüzdan",
        sourceOther: "Diğer",
        leadStatusContacted: "İletişim",
        leadStatusArchived: "Arşiv",
        leadStatusNew: "Yeni",
        leadStatusQualified: "Nitelikli",
        crmHeaderTitle: "Bağlantılar (CRM)",
        crmHeaderHint:
          "Kartını ziyaret edip formu dolduranlar ve sana kartını gönderen diğer kart sahipleri buraya düşer. Her kayıt için ayrıca email alırsın.",
        crmTabLeads: "Gelen kutusu",
        crmTabConnections: "Kart bağlantıları",
        crmFilterAll: "Tümü",
        crmSearchPlaceholder: "İsim, email, şirket, etiket…",
        crmLoading: "Yükleniyor…",
        crmEmptyLeads: "Henüz gelen bilgi yok.",
        crmEmptyConnections: "Henüz kart bağlantısı yok.",
        addNotePlaceholder:
          "Bağlam: nerede tanıştık, ne konuştuk, takip notu…",
        editNote: "Notu düzenle",
        closeNote: "Notu kapat",
        addNote: "Not ekle",
        connectionNotePlaceholder: "Bu bağlantı hakkında not ekle…",
        unsavedChanges: "Kaydedilmemiş değişiklikler",
        allSaved: "Tümü kaydedildi",
        revert: "Geri al",
        untitledCard: "İsimsiz kart",
        viewLive: "Canlıyı gör",
        sectionPersonBrand: "Kişi & Marka",
        sectionContact: "İletişim",
        sectionContent: "İçerik",
        sectionPublish: "Yayın & Durum",
        adjustPhoto: "Fotoğrafı ayarla",
        adjustLogo: "Logoyu ayarla",
        expandSection: "Bölümü aç",
        collapseSection: "Bölümü kapat",
        // WS-2 / WS-3 — sadeleştirilmiş editör
        backToCards: "Kartlarım",
        tierBasic: "Temel",
        tierMore: "Daha fazla",
        tierAdvanced: "Gelişmiş",
        allDesigns: "Tüm tasarımlar",
        allDesignsHint: "90+ tasarımı sektöre göre incele.",
        performanceTitle: "Performans & CRM",
        uploadCue: "Yüklendi — yayına almak için Kaydet'e bas.",
        completenessTitle: "Kart tamamlanma",
        completenessSummary: "{done}/{total} tamam",
        completenessGoto: "Git",
        completenessAllDone: "Kartın eksiksiz görünüyor 🎉",
        completenessPhoto: "Profil fotoğrafı",
        completenessLogo: "Logo",
        completenessName: "İsim",
        completenessJobTitle: "Ünvan",
        completenessCompany: "Şirket",
        completenessContact: "İletişim (telefon/e-posta)",
        completenessSocial: "Sosyal medya",
        completenessBio: "Hakkında",
        publicUrlLabel: "Herkese açık kartınız:",
        contactReadonlyLabel: "İletişim bilgileriniz (salt okunur)",
        contactReadonlyHint:
          "E-posta, ad veya telefonu değiştirmek istiyorsanız sipariş e-postanıza yanıt verin — biz hallederiz.",
        statusLabel: "Sipariş durumu",
        save: "Değişiklikleri kaydet",
        saving: "Kaydediliyor …",
        savedSuccess: "Kaydedildi.",
        savedError: "Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.",
        shareHeading: "Kartınızı paylaşın",
        shareBody:
          "LinkedIn, Instagram veya e-posta imzanız için 1200×630 boyutunda görseli indirin.",
        downloadOg: "Sosyal medya görselini indir",
        shareNotReady:
          "Paylaşım görseli, kartınız yayımlandıktan sonra kullanılabilir hale gelir.",
        notFoundTitle: "Bu düzenleme bağlantısı açılamıyor",
        notFoundBody:
          "Bu bağlantının süresi dolmuş veya artık geçerli değil. Lütfen sipariş e-postanıza yanıt verin — size yeni bir bağlantı gönderelim.",
      },
      cancel: {
        heading: "Aboneliği iptal et",
        body: "Kartınız mevcut fatura döneminin sonuna kadar canlı kalır. Ondan sonra tekrar ücretlendirilmezsiniz.",
        openCta: "Aboneliğimi iptal et",
        alreadyScheduled:
          "Aboneliğiniz zaten {date} tarihinde sonlanacak şekilde planlandı.",
        modalEyebrow: "ONAYLA",
        modalTitle: "OpSolid Dijital Kartvizit aboneliğini iptal etmek istiyor musunuz?",
        explainer:
          "Aboneliğiniz {date} tarihine kadar aktif kalır, ardından yenilenmez. Tekrar ücretlendirilmezsiniz.",
        explainerNoDate:
          "Aboneliğiniz mevcut fatura döneminin sonuna kadar aktif kalır, ardından yenilenmez.",
        keep: "Aboneliği koru",
        confirm: "İptali onayla",
        error: "İptal planlanamadı. Lütfen info@kutasia.com adresine yazın.",
        doneBody:
          "İptal planlandı. Kartınız {date} tarihine kadar canlı kalır. Stripe'tan son bir onay e-postası alacaksınız.",
        doneClose: "Kapat",
      },
      meta: {
        title:
          "OpSo Smart — Ücretsiz dijital kartvizit, saniyeler içinde canlı | OpSolid",
        description:
          "Dijital kartvizitinizi ücretsiz oluşturun ve saniyeler içinde yayınlayın — link, QR, WhatsApp, e-posta. Alıcıya uygulama gerekmez, istediğiniz zaman düzenlenir. EU barındırma (Frankfurt), GDPR-yerli.",
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
          { name: "Custom Workflows", role: "CRM senkronu + çağrı sonrası orkestrasyon" },
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
        heading: "Net cevaplar.",
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
        tags: "OPENAI · CUSTOM · SUPABASE · ÇOK KANALLI",
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
          { name: "Custom Workflows", role: "Kanal orkestrasyonu + CRM senkronu" },
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
        heading: "Net cevaplar.",
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
          { name: "Custom Workflows", role: "İş akışı orkestrasyonu" },
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
        heading: "Şeffaf olmayan bir kanal hakkında net cevaplar.",
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
        tags: "CAL.COM · RETELL · CUSTOM · GOOGLE CALENDAR",
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
          { name: "Custom Workflows", role: "Hatırlatma + takip orkestrasyonu" },
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
        heading: "Net cevaplar.",
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
          "Gerçekten yayına çıkan AI e-posta iş akışları: kişiselleştirilmiş soğuk dış iletişim, gelen triyajı ve insan onayı için otomatik taslaklar. Instantly, AgentMail ve özel orkestrasyon akışları üzerine kurulu. Isıtılmış deliverability, GDPR uyumlu.",
        primaryCta: "Demo planla",
        secondaryCta: "Nasıl çalışır",
        tags: "INSTANTLY · AGENTMAIL · CUSTOM · OPENAI",
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
          { name: "Custom Workflows", role: "Özel iş akışı orkestrasyonu" },
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
        heading: "Varsayılan olarak spam dolu bir kanal hakkında net cevaplar.",
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
        tags: "RETELL · HUBSPOT · CUSTOM · SKORLAMA",
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
          { name: "Custom Workflows", role: "Yönlendirme + Slack/Cal.com teslimatı" },
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
        heading: "Net cevaplar.",
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
        heading: "Küçük, net, aylık. İstediğiniz zaman iptal.",
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
            "Bir şeyler yanlış gitti. Lütfen doğrudan info@kutasia.com adresine yazın.",
        },
      },
      faq: {
        label: "SSS",
        heading: "Net cevaplar.",
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

  v2: {
    nav: {
      home: "Anasayfa",
      services: "Hizmetler",
      automationCheck: "AI Automation Check",
      journal: "Bilgi",
      contact: "İletişim",
      cta: "Ücretsiz görüşme planla",
      account: "Kartlarım",
      servicesDropdown: {
        "ki-beratung": { title: "AI danışmanlığı", sub: "Use cases · risk · yol haritası" },
        prozessautomatisierung: { title: "Süreç otomasyonu", sub: "Workflow · API · otomasyon" },
        "microsoft-365-automatisierung": {
          title: "Microsoft 365 otomasyonu",
          sub: "Power Automate · M365 · SharePoint",
        },
        "interne-tools": { title: "İç araçlar", sub: "Dashboard · araç · entegrasyon" },
        "ki-schulungen": { title: "AI eğitimleri & politikaları", sub: "Eğitim · politika · KVKK/DSGVO" },
      },
    },

    footer: {
      tagline:
        "Almanya ve Avrupa'daki KOBİ'ler için AI ve otomasyon danışmanlığı — uygulanabilir, ölçülebilir ve veri koruma odaklı.",
      chipLive: "",
      chipLanguages: "DE · EN · TR",
      cols: {
        servicesHeading: "Hizmetler",
        studioHeading: "Stüdyo",
        reachHeading: "İletişim",
        legalHeading: "Hukuki",
        services: {
          automationCheck: "AI Automation Check",
          consulting: "AI danışmanlığı",
          automation: "Süreç otomasyonu",
          internalTools: "Dahili araçlar & entegrasyonlar",
          training: "AI eğitimi & yönergeler",
        },
        studio: {
          about: "Hakkımda",
          journal: "Bilgi",
          contact: "İletişim",
        },
        reach: {
          email: "info@opsolid.de",
          linkedinLabel: "LinkedIn",
          linkedinHref: "https://www.linkedin.com/company/opsolid/",
        },
        legal: {
          privacy: "Gizlilik",
          imprint: "Künye",
        },
      },
      base: {
        copyrightSuffix: "OpSolid · Arnsberg, DE",
        trustLine: "",
      },
    },

    home: {
      hero: {
        metaChip: "",
        metaLabel: "[ AI & OTOMASYON DANIŞMANLIĞI ]",
        title: {
          pre: "Daha verimli iş süreçleri için ",
          italic: "AI",
          post: " ve otomasyon.",
        },
        lead:
          "OpSolid; KOBİ'lere manuel görevleri, Excel süreçlerini, e-posta iş akışlarını ve dahili operasyonları AI, otomasyon ve modern araçlarla sadeleştirmede yardımcı olur.",
        ctaPrimary: "Ücretsiz görüşme planla",
        ctaSecondary: "AI & Automation Check'i incele",
        stats: [],
        benefits: [
          { icon: "workflow", label: "Daha az manuel iş" },
          { icon: "bolt", label: "Daha hızlı süreçler" },
          { icon: "shield", label: "Güvenli AI kullanımı" },
        ],
      },

      problem: {
        eyebrow: "[ MEVCUT DURUM ]",
        headline: "Bu problemler tanıdık geliyor mu?",
        lead:
          "Çoğu KOBİ her hafta saatleri manuel devirlere, dağınık verilere ve araçlar arası kopyala-yapıştıra kaybediyor — ekibi yöneten değil, ekibi yönlendiren iş.",
        items: [
          {
            title: "Tekrarlayan görevler her gün zaman yiyor",
            body: "Teklifler, faturalar, durum güncellemeleri ve takip mailleri hâlâ elle yapılıyor.",
          },
          {
            title: "Bilgi e-posta, Excel ve farklı araçlara dağılmış durumda",
            body: "Aynı veri üç ayrı yere giriliyor; hiçbir şey otomatik mutabık kalmıyor.",
          },
          {
            title: "Çalışanlar verileri sistemler arasında elle kopyalıyor",
            body: "CRM, ERP, tablolar — yerleşik olması gereken köprüler ekibe yıkılmış durumda.",
          },
          {
            title: "Teklif, rapor ve dokümanlar çok uzun sürüyor",
            body: "Şablonlar var ama bir araya getirmek hâlâ el işi.",
          },
          {
            title: "AI kullanılıyor — ama yapı ve veri koruma planı yok",
            body: "Gölge IT'de ChatGPT: yönerge yok, audit yok, net sahip yok.",
          },
        ],
      },

      services: {
        eyebrow: "[ OPSOLID NE YAPAR ]",
        headline: "OpSolid ne yapar?",
        lead:
          "Dört odaklı alan. Her biri ölçülebilir bir sonuca bağlı — daha az manuel dokunuş, daha kısa döngü süreleri, daha güvenli AI kullanımı.",
        cards: [
          {
            icon: "bot",
            title: "AI danışmanlığı",
            body:
              "Anlamlı AI kullanım senaryolarını belirler, fayda/risk dengesini değerlendirir ve işletmeniz için gerçekçi bir yol haritası çıkarırız.",
            tag: "USE CASES · RİSK · YOL HARİTASI",
          },
          {
            icon: "workflow",
            title: "Süreç otomasyonu",
            body:
              "Tekrarlayan görevleri Microsoft 365, Power Automate, Make, API'ler, Python ve özel iş akışları ile otomatikleştiririz.",
            tag: "M365 · POWER AUTOMATE · APIS",
          },
          {
            icon: "plug",
            title: "Dahili araçlar & entegrasyonlar",
            body:
              "Mevcut sistemleri bağlar, medya kopukluklarını azaltır ve günlük operasyonlar için küçük dahili uygulamalar geliştiririz.",
            tag: "ENTEGRASYON · DAHİLİ ARAÇ",
          },
          {
            icon: "shield",
            title: "AI eğitimi & yönergeler",
            body:
              "Ekipleri AI'ın güvenli ve verimli kullanımı için eğitir, günlük iş hayatına uygun basit yönergeler hazırlarız.",
            tag: "EĞİTİM · YÖNERGE · KVKK/DSGVO",
          },
        ],
      },

      automationCheckCard: {
        eyebrow: "[ GİRİŞ PAKETİ ]",
        badge: "AI & AUTOMATION CHECK",
        title: {
          pre: "AI ve otomasyon için ",
          italic: "ilk net adım",
          post: "",
        },
        lead:
          "60–90 dakika. En önemli manuel süreçlerinizi haritalar, beş somut otomasyon adayı belirler ve uygulanabilir bir 30 günlük plan teslim ederiz.",
        bullets: [
          "60–90 dakika analiz görüşmesi",
          "Kritik manuel süreçlerin kayıt altına alınması",
          "5 otomasyon fırsatının belirlenmesi",
          "Eforu, faydası ve riski açısından değerlendirme",
          "Somut 30 günlük uygulama planı",
          "Opsiyonel: ilk pilot iş akışının uygulanması",
        ],
        priceNote: "Fiyat talep üzerine",
        ctaPrimary: "AI & Automation Check talep et",
        ctaSecondary: "Neleri içerdiğini gör",
      },

      useCases: {
        eyebrow: "[ TİPİK KULLANIM SENARYOLARI ]",
        headline: "Pratikte neleri otomatikleştiriyoruz",
        lead:
          "KOBİ'ler için kurguladığımız veya hayata geçirdiğimiz iş akışlarından kısa bir seçki. Daha az kopyala-yapıştır, daha az hata, daha hızlı çıktı.",
        cards: [
          {
            title: "E-posta sınıflandırma & yönlendirme",
            body: "Gelen e-postalar konuya göre etiketlenir ve doğru gelen kutusuna ya da ticket'a iletilir — manuel triyaj biter.",
          },
          {
            title: "Teklif ve doküman üretimi",
            body: "Şablonlar CRM verisinden doldurulup onaya gönderilir — teklifler aynı gün çıkar.",
          },
          {
            title: "Excel & raporlama otomasyonu",
            body: "Tekrarlayan raporlar bir kez kurulup otomatik üretilir — KPI'lar toplantıdan önce hazır olur.",
          },
          {
            title: "CRM / ERP veri aktarımı",
            body: "Veri sistemler arasında bir kez akar ve kendini mutabık kılar — çift girişe son.",
          },
          {
            title: "Dokümanların otomatik özetlenmesi",
            body: "Uzun PDF'ler, sözleşmeler ve toplantı notları, ekibin aksiyona dökeceği net bir özete dönüşür.",
          },
          {
            title: "AI destekli dahili bilgi tabanı",
            body: "Kendi dokümanlarınızda, politikalarınızda ve SSS'lerinizde arama — cevaplar şirket içinde kalır.",
          },
          {
            title: "Toplantı notları & görev takibi",
            body: "Görüşmeler transkribe edilir, kararlar çıkarılır, görevler sisteme aktarılır.",
          },
          {
            title: "Destek & talep süreçleri",
            body: "Birinci seviye sorular otomatik yanıtlanır — insanlar yalnızca gerekli vakalarla ilgilenir.",
          },
        ],
      },

      targetGroup: {
        eyebrow: "[ KİMLERE UYGUN ]",
        headline: "OpSolid kimler için uygun?",
        lead:
          "Dahili sistemlerinden hızlı büyümüş — ve platform vaadi yerine ölçülebilir bir sonraki adım arayan şirketlerle en verimli çalışıyoruz.",
        items: [
          "Orta ölçekli işletmeler (KOBİ · Mittelstand)",
          "El sanatları ve üretim işletmeleri",
          "Satış ve servis ekipleri",
          "Excel, e-posta veya doküman yoğun süreçlere sahip şirketler",
          "AI kullanmak isteyen — ama yapısal ve güvenli başlamak isteyen ekipler",
        ],
      },

      trust: {
        eyebrow: "[ NEDEN OPSOLID ]",
        headline: "Neden OpSolid?",
        lead:
          "Uygulanabilir, ölçülebilir, veri koruma odaklı. Şişirilmiş platformlar yok, buzzword yok, AI uğruna AI yok.",
        items: [
          {
            title: "Sahada IT ve proje yönetimi geçmişi",
            body: "IT projeleri, dijitalleşme ve süreç optimizasyonunda gerçek şirketlerde yıllar — danışmanlık tiyatrosu değil.",
          },
          {
            title: "Ölçülebilir süreç iyileştirmesine odak",
            body: "Her iş bir baseline ile başlar, üzerine aksiyon alabileceğiniz bir sayı ile biter.",
          },
          {
            title: "Gereksiz karmaşık sistemler yok",
            body: "Sorunu gerçekten çözen en küçüğü kurar, karşılığını verdiği yerde genişletiriz.",
          },
          {
            title: "Veri koruma odaklı uygulama",
            body: "EU hosting, DSGVO/KVKK uyumlu altyapı, gölge IT yok — denetim ve uyum işin başından mümkün.",
          },
          {
            title: "Teknik jargon yerine anlaşılır danışmanlık",
            body: "Karar vericiler IT çevirmenine ihtiyaç duymadan önerileri takip edebilmeli.",
          },
          {
            title: "Network üzerinden veya doğrudan uygulama",
            body: "OpSolid ağı üzerinden veya doğrudan geliştirme ile — hangisi kapsama uygunsa.",
          },
        ],
      },

      faq: {
        eyebrow: "[ SSS ]",
        headline: "Sık sorulan sorular",
        items: [
          {
            q: "OpSolid kimler için uygun?",
            a: "Çok sayıda manuel veya Excel/e-posta odaklı süreci olan KOBİ'ler ve ekipler. Her şey zaten bir sistem hâlinde işliyorsa, muhtemelen en etkili seçim biz değiliz.",
          },
          {
            q: "Hangi süreçler otomatikleştirilebilir?",
            a: "Net girdi ve net çıktısı olan her tekrarlı iş — teklifler, doküman üretimi, raporlama, veri senkronizasyonu, e-posta yönlendirme, destek triyajı.",
          },
          {
            q: "AI kullanımı KVKK/DSGVO uyumlu olabilir mi?",
            a: "Evet — doğru model seçimi, AB veri rezidanslığı ve yazılı bir yönerge ile. Bunu en baştan birlikte kurarız.",
          },
          {
            q: "Şirketimin zaten AI kullanıyor olması gerekiyor mu?",
            a: "Hayır. Çoğu iş hiç AI olmadan başlar; sonuç yine de ölçülebilir bir iyileşme olur.",
          },
          {
            q: "İlk Automation Check ne kadar sürer?",
            a: "Görüşme için 60–90 dakika, yazılı 30 günlük plan için birkaç iş günü daha.",
          },
          {
            q: "Microsoft 365 gibi mevcut araçlarımız kullanılmaya devam edebilir mi?",
            a: "Evet — kurduğumuzun büyük kısmı zaten ödediğiniz araçların üzerine oturur.",
          },
          {
            q: "OpSolid özel çözümler de geliştirir mi?",
            a: "Evet — standart çözüm uymadığında dahili araçlar, özel iş akışları ve entegrasyonlar geliştiririz.",
          },
        ],
      },

      capabilities: {
        eyebrow: "[ 02 / 04 ] KAPSAM",
        headline: "Uçtan uca sahiplendiğimiz alanlar",
        lead:
          "Platform değiliz, pazaryeri değiliz. Operasyonunuzu olduğu hâliyle — manuel, yarı otomatik ya da derme çatma birleştirilmiş — alıp, sürekli müdahale gerektirmeden çalışan sistemler hâlinde bırakan küçük ve odaklı bir stüdyoyuz.",
        seeAffordance: "+ Çalışırken gör",
        closeAffordance: "− Kapat",
        cards: [
          {
            icon: "workflow",
            title: "Workflow otomasyonu",
            body:
              "Siparişler, dokümanlar, onaylar, iletişim. Süreçlerinize özel kurulur — kapalı kutu hazır araçlar üzerine değil.",
            tag: "API · WEBHOOKS · CUSTOM",
          },
          {
            icon: "plug",
            title: "Sistem entegrasyonu",
            body:
              "ERP, CRM, depo, faturalama, mesajlaşma — veri bir kez akacak ve otomatik mutabık kalacak şekilde bağlanır. Adaptörler kiralanmaz, size aittir.",
            tag: "ADAPTERS · WEBHOOKS · APIS",
          },
          {
            icon: "bot",
            title: "Yapay zekâ destekli süreçler",
            body:
              "Yönlendirme, çıkarım veya sınıflandırma karşılığını verdiği yerde — yalnızca orada. Vermediği yerde önerilmez. Her model çağrısı denetlenir ve loglanır.",
            tag: "LLM · RETELL · VAPI",
          },
          {
            icon: "ship",
            title: "Dahili araçlar",
            body:
              "Admin konsolları, operasyon panoları, onay kuyrukları. Ekibinizin zaten kullandığı sistemlerin üzerine kurulur — tek bir çalışma yüzeyi.",
            tag: "REACT · POSTGRES · CAL",
          },
          {
            icon: "radio",
            title: "Voice & chat agent'ları",
            body:
              "Telefon yanıtlama, WhatsApp triyajı, web sohbeti. Script tükendiğinde insana devir — size uygun olmadığında değil.",
            tag: "24/7 · EN · DE · TR",
          },
          {
            icon: "shield",
            title: "GDPR-native altyapı",
            body:
              "Alman hosting, EU veri rezidanslığı, ISO 27001 uyumlu pratikler. Her müşteri verisinin, workflow'unun ve çıkış kapısının sahibidir.",
            tag: "FRA · AV-DSGVO · ISO 27001",
          },
        ],
      },

      specimen: {
        eyebrow: "[ 03 / 04 ] SEKTÖR REFERANSI",
        title: {
          pre: "Otomasyonun ",
          italic: "ölçüldüğü",
          post: " rakamlar",
        },
        body:
          "Her otomasyonu sektörün referans değerleriyle yan yana ölçüyoruz. Solda bugünkü tipik durum; sağda otomasyonun hedeflediği sonuç.",
        chipBefore: "SEKTÖR MEDYANI",
        chipAfter: "OTOMASYON HEDEFİ",
        rows: [
          {
            label: "Teklif-tahsilat döngü süresi",
            sub: "Sektör referansı · orta ölçek",
            value: "3–7 gün",
            delta: "otomasyonda <4 saat",
          },
          {
            label: "Sipariş başına manuel dokunuş",
            sub: "Sektör referansı · orta ölçek",
            value: "4–9",
            delta: "otomasyonda 1–2",
          },
          {
            label: "Sesli yanıtta gecikme",
            sub: "Sektör referansı · 2025",
            value: "<800ms",
            delta: "uçtan uca, doğal akış",
          },
          {
            label: "Sistemden çıkış süresi",
            sub: "OpSolid · kaynak kodu sizinle kalır",
            value: "0",
            delta: "haftalar içinde devir",
          },
        ],
      },

      process: {
        eyebrow: "[ İŞ BİRLİĞİ ]",
        headline: "İşbirliği nasıl ilerler?",
        lead:
          "Dört kısa adım. Önce haritala, kapsamı dar tut, bir şeyi temiz teslim et, ve karşılığını verdiği yerde genişlet — platform rollout'u yok, çeyrek dönen discovery yok.",
        steps: [
          {
            num: "01",
            title: "Erstgespräch / Ön görüşme",
            body:
              "Odaklı bir ilk görüşme. Ekibin nerede zaman kaybettiğini ve günün gerçekte nasıl geçtiğini dinleriz — slayt yok, satış konuşması yok.",
            chipA: "30–60 dk",
            chipB: "Yükümlülük yok",
          },
          {
            num: "02",
            title: "Süreç analizi",
            body:
              "En kritik iş akışlarını uçtan uca haritalarız — devirler, araçlar, veri, istisnalar — ve ekibin gözden geçirebileceği netlikte yazılı hale getiririz.",
            chipA: "AI & Automation Check",
            chipB: "Yazılı plan",
          },
          {
            num: "03",
            title: "Çözüm konsepti",
            body:
              "Kısa, somut bir öneri: önce neyi otomatikleştireceğiz, hangi araçlarla, beklenen efor ve ölçülebilir sonuç. Değmediği yerde de açıkça söyleyen.",
            chipA: "Kapsam · efor · sonuç",
            chipB: "Karara hazır",
            chipBHot: true,
          },
          {
            num: "04",
            title: "Uygulama & optimizasyon",
            body:
              "Uygularız — tek başımıza veya ekibinizle — ve karşılığını veren yerde iterasyona devam ederiz. Devir notları ve kaynak kodu ilk günden sizindir.",
            chipA: "Pilot → rollout",
            chipB: "Kaynak kodu sizinle",
          },
        ],
      },

      finalCta: {
        eyebrow: "[ KONUŞALIM ]",
        title: {
          pre: "Süreçlerinizi ",
          italic: "daha verimli",
          post: " hale getirmeye hazır mısınız?",
        },
        lead:
          "Şirketinizdeki hangi görevlerin AI ve otomasyonla sadeleştirilebileceğini birlikte değerlendirelim. Görüşmeden sonra bir yükümlülük yok — uygun değilse bunu da açıkça söyleriz.",
        ctaPrimary: "Ücretsiz görüşme planla",
        ctaSecondary: "Bilgi içeriklerini gör",
        trustLine:
          "BAĞIMSIZ · DSGVO/KVKK UYUMLU · EU-HOSTED · DE · EN · TR",
      },
    },

    aiAutomationCheckPage: {
      hero: {
        metaChip: "AI & AUTOMATION CHECK",
        metaLabel: "[ GİRİŞ PAKETİ · 60–90 DK ]",
        title: {
          pre: "Şirketinizdeki ",
          italic: "gerçek",
          post: " otomasyon potansiyelini bulun",
        },
        lead:
          "Odaklı 60–90 dakika analiz görüşmesi ve eforu, faydası, riskine göre puanlanmış 5 somut otomasyon adayı içeren yazılı bir 30 günlük plan. Daha büyük projelerden önce, düşük riskli bir ilk adım olarak tasarlandı.",
        ctaPrimary: "AI & Automation Check talep et",
        ctaSecondary: "Genel görünüme dön",
      },
      problem: {
        eyebrow: "[ NEDEN VAR ]",
        headline: "Otomasyon projelerinin çoğu başlamadan başarısız olur",
        lead:
          "Teknoloji çalışmadığı için değil — yanlış süreç otomatikleştirildiği için ya da ekibin gerçekte ne yaptığı hiç yazılmadığı için. AI & Automation Check tam burada devreye girer.",
        items: [
          "Köklere değil, semptomlara otomasyon kurulur",
          "AI araçları net kullanım senaryosu olmadan satın alınır",
          "ROI ölçülemez çünkü bir baseline yoktur",
          "Hangi adımların bilinçli olarak manuel kalması gerektiği belirsizdir",
        ],
      },
      package: {
        eyebrow: "[ NELER İÇERİR ]",
        headline: "Check'te neler var?",
        bullets: [
          {
            title: "60–90 dakika analiz görüşmesi",
            body: "Yerinde veya uzaktan. İşin ekipten nasıl geçtiğini dinleriz — slayt yok.",
          },
          {
            title: "Kritik manuel süreçlerin kayıt altına alınması",
            body: "İlgili iş akışlarını ekibin gözden geçirebileceği şekilde yazılı hâle getiririz — tek kişinin kafasında değil.",
          },
          {
            title: "5 somut otomasyon adayı",
            body: "Gerçek süreçlerinizden seçilmiş — jenerik AI fikir listesi değil.",
          },
          {
            title: "Efor, fayda ve riske göre puanlama",
            body: "Her aday derecelendirilir; yönetim, kendisi tech-uzman olmak zorunda kalmadan öncelik belirleyebilir.",
          },
          {
            title: "Net 30 günlük uygulama planı",
            body: "Somut sonraki adımlar, araçlar, sorumlular ve beklenen sonuç.",
          },
          {
            title: "Opsiyonel: pilot iş akışının uygulanması",
            body: "Mantıklı olduğunda ilk otomasyonu doğrudan kurarız — sabit kapsam, sabit takvim.",
          },
        ],
      },
      audience: {
        eyebrow: "[ KİMLER İÇİN ]",
        headline: "Check kimler için uygun?",
        items: [
          "Ölçülebilir bir ilk adım isteyen orta ölçekli işletmeler",
          "AI'ı gölge IT'de kullanan ve yapı arayan ekipler",
          "Çok sayıda manuel devri olan operasyon sorumluları",
          "Microsoft 365 / Power Automate / Make değerlendiren şirketler",
          "Dışarıdan bir bakış isteyenler: \"Önce ne otomatikleştirmeliyiz?\"",
        ],
      },
      deliverables: {
        eyebrow: "[ NE TESLİM EDİLİR ]",
        headline: "E-postanıza ne düşer?",
        items: [
          "Konuştuğumuz iş akışlarının yazılı süreç haritası",
          "Puanlanmış 5 otomasyon fırsatı",
          "Her fırsat için önerilen araçlar ve kabaca efor tahmini",
          "Sorumluları içeren 30 günlük uygulama planı",
          "Bilinçli olarak manuel kalması gerekenlere dair kısa bir not — ve nedeni",
        ],
      },
      process: {
        eyebrow: "[ NASIL İLERLER ]",
        headline: "Check nasıl ilerler?",
        steps: [
          { num: "01", title: "Kickoff", body: "Hedeflerin ve scope'taki süreçlerin netleştirildiği kısa ön görüşme." },
          { num: "02", title: "Analiz görüşmesi", body: "İşi gerçekten yapan kişilerle 60–90 dakika." },
          { num: "03", title: "Yazılı plan", body: "Birkaç iş günü içinde yazılı 30 günlük planı alırsınız." },
          { num: "04", title: "Birlikte gözden geçirme", body: "Kapsam, efor ve sonraki adımların netleştirildiği 30 dakika." },
        ],
      },
      faq: {
        eyebrow: "[ SSS ]",
        headline: "Sık sorulan sorular",
        items: [
          { q: "AI & Automation Check'in fiyatı nedir?", a: "Fiyat talep üzerine — kapsam ve ekip büyüklüğüne bağlı. İlk kısa görüşmeden sonra sabit fiyat veririz." },
          { q: "Gizlilik sözleşmesi imzalanıyor mu?", a: "Evet — analiz görüşmesinden önce standart NDA imzalanır." },
          { q: "Sadece AI kullanan şirketler için mi?", a: "Hayır. Birçok iş hiç AI olmadan başlar." },
          { q: "Mevcut araçlarımız kullanılmaya devam edebilir mi?", a: "Evet — Microsoft 365, Google Workspace, CRM veya ERP iş akışını taşıyabildiği yerde önce onları kullanırız." },
          { q: "Check'ten sonra ne olur?", a: "Ya planı kendiniz uygularsınız, ya birlikte bir pilot uygularız, ya da iş orada biter. Lock-in yok." },
        ],
      },
      finalCta: {
        eyebrow: "[ SONRAKİ ADIM ]",
        title: {
          pre: "Şirketinizde ",
          italic: "neyi otomatikleştirmenin gerçekten değerli olduğunu",
          post: " keşfedin.",
        },
        lead:
          "Bir görüşme. Bir yazılı plan. Sonrasında bir yükümlülük yok — değmeyecek bir projeyi başlatmak yerine, henüz zamanı değil demeyi tercih ederiz.",
        ctaPrimary: "AI & Automation Check talep et",
        ctaSecondary: "Önce tanışma görüşmesi planla",
      },
    },

    leistungen: {
      meta: {
        title: "Hizmetler — AI, Otomasyon & Dijital Süreçler | OpSolid",
        description:
          "OpSolid hizmetleri KOBİ'lere yönelik: AI danışmanlığı, süreç otomasyonu, Microsoft 365 otomasyonu, iç araçlar ve AI eğitimleri. Uygulanabilir, ölçülebilir, veri koruması odaklı.",
      },
      hero: {
        metaChip: "",
        metaLabel: "[ HİZMETLER · 2026 ]",
        title: {
          pre: "AI, otomasyon ve ",
          italic: "dijital süreçler",
          post: " için hizmetler",
        },
        lead:
          "Beş net çalışma alanı. Sorununuzu çözen en küçük işi seçer, teslim eder — ve sadece değerini koruduğu yerde genişletiriz. Platform rolloutları yok, çeyreklerce sürecek discovery yok.",
        ctaPrimary: "Tanışma görüşmesi planla",
        ctaSecondary: "AI Automation Check ile başla",
      },
      cards: {
        eyebrow: "[ NE SUNUYORUZ ]",
        headline: "Beş uygulanabilir hizmet alanı",
        lead:
          "Her alanın kendi sayfası var — anwendungsfälle, araçlar, süreç ve fiyat çerçevesi. Çoğu proje AI & Automation Check ile başlar — doğru şeyi otomatikleştirdiğimizden emin olmanın en ucuz yolu.",
        items: [
          {
            slug: "ki-beratung",
            icon: "bot",
            title: "AI danışmanlığı",
            body:
              "Şirketiniz için gerçekten değerli AI kullanım senaryolarını belirliyoruz — faydayı riskle tartıp gerçekçi, karar verilebilir bir yol haritası teslim ediyoruz.",
            tag: "USE CASES · RİSK · YOL HARİTASI",
            linkLabel: "AI danışmanlığı detayları",
          },
          {
            slug: "prozessautomatisierung",
            icon: "workflow",
            title: "Süreç otomasyonu",
            body:
              "Tekrarlayan manuel görevleri uçtan uca otomatikleştirin. Teklifler, faturalar, raporlar, doküman üretimi, e-posta yönlendirme — zaten ödediğiniz araçlar üzerinde.",
            tag: "WORKFLOW · API · OTOMASYON",
            linkLabel: "Süreç otomasyonu detayları",
          },
          {
            slug: "microsoft-365-automatisierung",
            icon: "plug",
            title: "Microsoft 365 otomasyonu",
            body:
              "Power Automate, Power Apps, Teams, SharePoint, Outlook — günlük aracınızın işi yapmasını sağlayan şekilde bağlanmış.",
            tag: "POWER AUTOMATE · M365 · SHAREPOINT",
            linkLabel: "Microsoft 365 otomasyonu detayları",
          },
          {
            slug: "interne-tools",
            icon: "ship",
            title: "İç araçlar",
            body:
              "SaaS'ın uymadığı yerlerde küçük, odaklı iç araçlar: admin konsolları, onay kuyrukları, dashboard'lar, bilgi tabanları — mevcut sisteminizin üzerinde.",
            tag: "DASHBOARD · ARAÇLAR · ENTEGRASYON",
            linkLabel: "İç araçlar detayları",
          },
          {
            slug: "ki-schulungen",
            icon: "shield",
            title: "AI eğitimleri & politikaları",
            body:
              "Ekiplerinize AI'ı güvenli ve verimli kullanmayı öğretiyoruz. Yazılı yönergeler, role özel playbook'lar, KVKK/DSGVO-uyumlu kurulum — Shadow IT yok.",
            tag: "EĞİTİM · POLİTİKA · KVKK/DSGVO",
            linkLabel: "AI eğitimi detayları",
          },
        ],
      },
      process: {
        eyebrow: "[ NASIL ÇALIŞIYORUZ ]",
        headline: "Bir proje nasıl ilerler",
        lead:
          "Her hizmet alanında aynı yaklaşım: önce haritala, dar kapsamda planla, tek bir şeyi düzgün teslim et.",
        steps: [
          {
            num: "01",
            title: "Tanışma görüşmesi",
            body:
              "30–60 dakika. Ekibin nerede zaman kaybettiğini ve günlük işin gerçekte nasıl göründüğünü dinliyoruz.",
          },
          {
            num: "02",
            title: "Analiz & teklif",
            body:
              "İlgili iş akışlarını yazıya döker, otomasyon adaylarını puanlar, önce yapılmaya değer en küçük işi öneririz.",
          },
          {
            num: "03",
            title: "Uygulama",
            body:
              "İşi tek başına ya da ekibinizle yapıyoruz — ve sadece değerini koruduğu yerde genişletiyoruz. Kaynak kodu sizde kalır.",
          },
        ],
      },
      faq: {
        eyebrow: "[ SSS ]",
        headline: "Hizmetler hakkında sık sorulanlar",
        items: [
          {
            q: "Tek bir hizmet alanı seçmek zorunda mıyız?",
            a: "Hayır. Çoğu proje iki-üç alana yayılır — bir AI use case'i etrafında genelde otomasyon gerekir, custom bir tool genelde eğitim gerektirir. Hizmet kataloğuna uyanı değil, gerçekten işe yarayanı planlıyoruz.",
          },
          {
            q: "Ücretlendirme nasıl?",
            a: "Ya teslim başına sabit fiyat (AI Automation Check, pilot workflow, eğitim günü) ya da sürekli iyileştirme için küçük aylık retainer. Fiyat istek üzerine — kapsam ve ekip büyüklüğüne bağlı.",
          },
          {
            q: "Mevcut araçlarımızı kullanmaya devam edebilir miyiz?",
            a: "Evet. Microsoft 365, Google Workspace, CRM'iniz, ERP'niz — workflow'u taşıyabildiği her yerde zaten ödediğiniz şeyi kullanıyoruz.",
          },
          {
            q: "Veriler nerede barındırılıyor?",
            a: "Varsayılan olarak sadece AB — Frankfurt veya diğer AB bölgeleri. Müşteri verisine dokunan her projeden önce AVV (Auftragsverarbeitungsvertrag) imzalanır.",
          },
          {
            q: "Sıfırdan mı geliştirirsiniz, yoksa platform mu kullanırsınız?",
            a: "İkisi de — Power Automate, Make veya n8n işi görüyorsa onları kullanırız. Yapamıyorsa küçük Python servisleri, Next.js araçları veya custom entegrasyonlar inşa ederiz.",
          },
        ],
      },
      finalCta: {
        eyebrow: "[ İLK ADIM ]",
        title: {
          pre: "Hangi hizmetin ",
          italic: "size en uygun olduğundan",
          post: " emin değil misiniz?",
        },
        lead:
          "AI & Automation Check veya ücretsiz bir tanışma görüşmesi ile başlayın. Hangi alanın sizde en büyük kaldıraca sahip olduğunu — sorduğunuz alan olmasa bile — söyleriz.",
        ctaPrimary: "AI Automation Check talep et",
        ctaSecondary: "Tanışma görüşmesi planla",
      },
    },

    services: {
      shared: {
        whatWeDoEyebrow: "[ NE YAPIYORUZ ]",
        useCasesEyebrow: "[ KULLANIM SENARYOLARI ]",
        toolsEyebrow: "[ ARAÇLAR & STACK ]",
        processEyebrow: "[ NASIL İLERLİYOR ]",
        faqEyebrow: "[ SSS ]",
        finalCtaEyebrow: "[ SONRAKİ ADIM ]",
        backToServices: "Tüm hizmetler",
      },
      kiBeratung: {
        slug: "ki-beratung",
        meta: {
          title: "KOBİ'ler için AI Danışmanlığı — Use Cases, Risk, Yol Haritası | OpSolid",
          description:
            "Almanya'daki KOBİ'lere AI danışmanlığı. Değerli AI kullanım senaryolarını belirliyoruz, faydayı riskle tartıyoruz ve karar verilebilir bir yol haritası teslim ediyoruz. Veri koruması odaklı.",
        },
        hero: {
          metaChip: "AI DANIŞMANLIĞI",
          metaLabel: "[ HİZMET · 01 / 05 ]",
          title: {
            pre: "Hangi AI ",
            italic: "şirketiniz için gerçekten değer üretir",
            post: "?",
          },
          lead:
            "Şu anda her departmana AI satılıyor — ama emeği, maliyeti ve riski hak eden use case'ler az. Farkı görmenize yardım eder, yönetime karşı gerçekten savunabileceğiniz bir yol haritası üretiriz.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
        whatWeDo: {
          headline: "OpSolid ile AI danışmanlığı nasıl görünür",
          bullets: [
            "Şirketinize uyan üç ila beş AI use case belirleriz — uymayanları net şekilde ekarte ederiz.",
            "Her use case'i beklenen değer, uygulama eforu ve operasyonel risk açısından puanlarız.",
            "Net sahipler, maliyetler ve karar noktalarıyla 6–12 aylık AI yol haritasını yazıya dökeriz.",
            "DSGVO/KVKK uyumlu AI kullanımını kurarız: model seçimi, veri konumu ve kısa şirket politikası.",
          ],
        },
        useCases: {
          headline: "Daha önce danıştığımız veya planladığımız işler",
          items: [
            {
              title: "Doküman ve sözleşme analizi",
              body: "Uzun PDF'leri ön-sınıflandırma, maddeleri çıkarma, son tarihleri yüzeye çıkarma — insanlar dokümanı değil özeti inceler.",
            },
            {
              title: "Şirket içi bilgi araması",
              body: "Kendi politikalarınızı, SSS'lerinizi ve SharePoint'inizi indekslersiniz — personel cevapları kamu ChatGPT'sinden değil sizin dokümanlarınızdan alır.",
            },
            {
              title: "Teklif ve proposal taslakları",
              body: "Şablon, CRM kaydı ve kısa brief'ten özel teklifler taslakla — satış sıfırdan yazmak yerine inceler.",
            },
            {
              title: "Destek triage ve yönlendirme",
              body: "Gelen talepleri konu ve aciliyete göre sınıflandır — insan kuyruğuna düşmeden önce.",
            },
          ],
        },
        tools: {
          headline: "Çalıştığımız modeller, sağlayıcılar ve framework'ler",
          items: [
            "OpenAI · GPT-4 ailesi",
            "Anthropic · Claude",
            "Microsoft Copilot · Azure OpenAI",
            "Mistral · open-source seçenekler",
            "Retrieval-Augmented Generation (RAG)",
            "Vektör veritabanları · pgvector · Qdrant",
            "DSGVO-uyumlu AB hosting",
          ],
        },
        process: {
          headline: "AI danışmanlığı projesi nasıl ilerler",
          steps: [
            { num: "01", title: "Keşif", body: "Ekip, veri ve hedefleri anlamak için kısa görüşme." },
            { num: "02", title: "Use case puanlama", body: "Workshop ve yazılı analiz: hangi AI use case'leri sizin için değerli, hangileri değil." },
            { num: "03", title: "Yol haritası & politika", body: "Karar verilebilir 6–12 aylık yol haritası ve kısa şirket içi yazılı AI politikası." },
          ],
        },
        faq: {
          headline: "AI danışmanlığı — sık sorulanlar",
          items: [
            { q: "„AI-ready“ olmamız gerekir mi?", a: "Hayır. Çoğu müşteri değil — zaten bu yüzden tool'lara para harcamadan önce bu işin yapılması gerekiyor." },
            { q: "AI tool'u satıyor musunuz?", a: "Hayır. Bağımsızız — neyin uygun olduğunu, „elinizdekini kullanın“ veya „bunu henüz yapmayın“ dahil, öneririz." },
            { q: "AI'ı DSGVO uyumlu kullanmak mümkün mü?", a: "Evet, doğru model seçimi, AB hosting ve yazılı politika ile. Başından itibaren bunu kurmanıza yardım ederiz." },
            { q: "Bir danışmanlık projesi ne kadar sürer?", a: "Analiz ve yol haritası için tipik olarak iki-dört hafta. Uygulama süreleri ayrı ve kapsama bağlı." },
          ],
        },
        finalCta: {
          title: { pre: "Hangi AI use case'leri ", italic: "sizin için değerli olduğunu", post: " öğrenin." },
          lead: "Bir görüşme. Yazılı bir yol haritası. Platform satışı yok.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
      },
      prozessautomatisierung: {
        slug: "prozessautomatisierung",
        meta: {
          title: "KOBİ'ler için Süreç Otomasyonu — Power Automate, Make, Python | OpSolid",
          description:
            "Manuel workflow'ları otomatikleştirin — teklifler, faturalar, doküman üretimi, e-posta yönlendirme, veri senkronizasyonu. Zaten ödediğiniz araçlar üzerinde. DSGVO-native.",
        },
        hero: {
          metaChip: "SÜREÇ OTOMASYONU",
          metaLabel: "[ HİZMET · 02 / 05 ]",
          title: {
            pre: "Artık ",
            italic: "kimsenin elle yapmaması gereken",
            post: " manuel görevler",
          },
          lead:
            "Yarım gün süren teklifler. Her pazartesi sıfırdan kurulan raporlar. Excel, CRM ve e-posta arasında kopyalanan veriler. Bu workflow'ları haritalandırırız, otomasyona değen kısımları otomatikleştiririz — geri kalanı insanlara bırakırız.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
        whatWeDo: {
          headline: "OpSolid ile süreç otomasyonu nasıl görünür",
          bullets: [
            "Workflow'u uçtan uca haritalandır — devirler, araçlar, veri, istisnalar — ekibin denetleyebileceği netlikte.",
            "Hangi adımların otomasyona değdiğini ve hangilerinin bilinçli olarak manuel kalması gerektiğini belirle.",
            "Otomasyonu Power Automate, Make, n8n, Python veya custom kodla — hangisi uyuyorsa — inşa et.",
            "İzleme, dokümantasyon ve devir — workflow'u sonrasında ekibin sahiplenir.",
          ],
        },
        useCases: {
          headline: "Otomatikleştirdiğimiz workflow'lar",
          items: [
            {
              title: "Teklif ve doküman üretimi",
              body: "CRM verisinden doldurulmuş, workflow'da onaylanmış ve gönderilmiş şablonlar — teklifler aynı gün çıkar.",
            },
            {
              title: "E-posta sınıflandırma ve yönlendirme",
              body: "Gelen postalar konuya göre etiketlenir ve doğru inbox veya ticket kuyruğuna gönderilir — manuel triage yok.",
            },
            {
              title: "Raporlama ve Excel otomasyonu",
              body: "Tekrarlayan raporlar bir kez kurulur ve otomatik yeniden oluşturulur — KPI'lar toplantı başladığında hazır.",
            },
            {
              title: "CRM / ERP veri senkronizasyonu",
              body: "Veri sistemler arasında bir kez akar ve kendini eşler — çift giriş yok.",
            },
          ],
        },
        tools: {
          headline: "Otomasyonda kullandığımız araçlar",
          items: [
            "Microsoft Power Automate",
            "Make (Integromat)",
            "n8n · self-hosted",
            "Zapier · uyuyorsa",
            "Python · custom script'ler",
            "REST API'leri · Webhook'lar",
            "PostgreSQL · dosya storage · queue'lar",
          ],
        },
        process: {
          headline: "Süreç otomasyonu projesi nasıl ilerler",
          steps: [
            { num: "01", title: "Haritala", body: "İşi gerçekten yapan ekiple workshop. Workflow'u gerçekte nasıl ilerlediğini yazıya dökeriz." },
            { num: "02", title: "İnşa et", body: "İlk pilot otomasyonu uygularız — genelde iki-dört hafta içinde." },
            { num: "03", title: "İşlet", body: "Dokümantasyon, devir ve siz devralmadan önce kısa bir iyileştirme süresi." },
          ],
        },
        faq: {
          headline: "Süreç otomasyonu — sık sorulanlar",
          items: [
            { q: "Tipik bir ilk proje nedir?", a: "Yüksek kaldıraçlı tek bir workflow — teklif üretimi, e-posta triage'ı veya haftalık rapor. Sabit kapsam, iki-dört hafta." },
            { q: "Araçlarımızı değiştirmemiz gerekir mi?", a: "Hayır. Sahip olduğunuz şey üzerinde otomatikleştiririz — Microsoft 365, Google Workspace, CRM'iniz, ERP'niz." },
            { q: "Süreç sonradan değişirse?", a: "Çoğu otomasyon, kendi IT ekibinizin uyarlayabileceği şekilde dokümanlanır. Daha büyük değişiklikler için küçük aylık retainer önerebiliriz." },
            { q: "Kritik süreçleri otomatikleştirmek güvenli mi?", a: "Evet — düzgün logging, hata yönetimi ve manuel fallback ile. Sadece mutlu yolu değil, hata durumunu da tasarlarız." },
          ],
        },
        finalCta: {
          title: { pre: "Otomatikleştirmeye ", italic: "değen ilk workflow'u", post: " seçin." },
          lead: "Haritalandırır, puanlar ve emeği hak edip etmediğini söyleriz.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
      },
      microsoft365: {
        slug: "microsoft-365-automatisierung",
        meta: {
          title: "Microsoft 365 Otomasyonu — Power Automate, SharePoint, Teams | OpSolid",
          description:
            "Microsoft 365 içindeki workflow'ları otomatikleştirin: Power Automate flow'ları, SharePoint doküman kütüphaneleri, Teams onayları, Outlook yönlendirme. AB-hostlu, veri koruması odaklı.",
        },
        hero: {
          metaChip: "MICROSOFT 365 OTOMASYONU",
          metaLabel: "[ HİZMET · 03 / 05 ]",
          title: {
            pre: "Microsoft 365 zaten her masada — ",
            italic: "şimdi sizin için çalışmasını sağlayın",
            post: "",
          },
          lead:
            "Teams, SharePoint, Outlook ve Power Automate zaten ödenmiş. Doğru kurulumla, üstüne satın alacağınız üçüncü taraf otomasyon araçlarının çoğunu da kapsar — daha az abonelik, tek bir kimlik, tek bir audit trail.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
        whatWeDo: {
          headline: "OpSolid ile Microsoft 365 otomasyonu nasıl görünür",
          bullets: [
            "Mevcut Microsoft 365 tenant'ınızı auditle ve ekibin henüz kullanmadığı otomasyon fırsatlarını belirle.",
            "Onaylar, doküman üretimi, e-posta yönlendirme ve bildirimler için Power Automate flow'ları inşa et.",
            "SharePoint, Teams, Outlook ve Excel'i bir araya getir — veriler yedi kopyada değil tek bir yerde yaşasın.",
            "Microsoft 365 Copilot'u sorumlu şekilde kur — rol bazlı erişim ve net yönergelerle.",
          ],
        },
        useCases: {
          headline: "İnşa ettiğimiz Microsoft 365 workflow'ları",
          items: [
            {
              title: "Teams'te onay workflow'ları",
              body: "İzin talepleri, harcama raporları, doküman imzaları — Teams'te onaylanır, SharePoint'te loglanır.",
            },
            {
              title: "SharePoint listelerinden doküman üretimi",
              body: "SharePoint listesinden üretilen teklifler, sözleşmeler ve raporlar — Excel'den copy-paste yok.",
            },
            {
              title: "Outlook e-posta parsing ve yönlendirme",
              body: "Gelen siparişler, destek talepleri veya faturalar otomatik parse edilir ve doğru sisteme aktarılır.",
            },
            {
              title: "Microsoft 365 Copilot rollout",
              body: "Yönergeler, rol bazlı erişim ve kısa eğitim — Copilot gerçekten kullanılsın ve güvenle kullanılsın.",
            },
          ],
        },
        tools: {
          headline: "Çalıştığımız Microsoft teknolojileri",
          items: [
            "Microsoft Power Automate",
            "Power Apps · low-code app'ler",
            "SharePoint Online · Listeler · Kütüphaneler",
            "Microsoft Teams · Bot'lar · Approval'lar",
            "Outlook · Exchange",
            "Microsoft Graph API",
            "Microsoft 365 Copilot",
            "Entra ID (Azure AD)",
          ],
        },
        process: {
          headline: "Microsoft 365 projesi nasıl ilerler",
          steps: [
            { num: "01", title: "Tenant incelemesi", body: "Mevcut lisanslarınıza, security setup'ınıza ve araçlarınıza bakarız — yetersiz kullanılanı buluruz." },
            { num: "02", title: "İlk flow", body: "Pilot olarak ilk Power Automate flow'unu veya Teams workflow'unu inşa ederiz — genelde iki hafta içinde." },
            { num: "03", title: "Rollout", body: "Dokümantasyon, devir ve IT ekibiniz için opsiyonel eğitimle daha geniş rollout." },
          ],
        },
        faq: {
          headline: "Microsoft 365 otomasyonu — sık sorulanlar",
          items: [
            { q: "Power Automate Premium lisansı gerekir mi?", a: "Bazen — ama yararlı flow'ların çoğu standart Microsoft 365 planlarıyla çalışır. Premium'un gerçekten ne zaman gerektiğini söyleriz." },
            { q: "Microsoft 365 Copilot değer mi?", a: "Bazı ekipler için evet, bazıları için hayır. Lisansları satın almadan önce karar vermenize yardım ederiz." },
            { q: "IT departmanımızla çalışabilir misiniz?", a: "Evet — projelerin çoğu IT'niz veya mevcut Microsoft partnerlerinizden biriyle yürütülür. Tamamlarız, yerine geçmeyiz." },
            { q: "DSGVO uyumlu mu?", a: "AB tenant konfigürasyonundaki Microsoft 365 DSGVO uyumludur. Doğru kurar ve veri akışlarını dokümanlarız." },
          ],
        },
        finalCta: {
          title: { pre: "Microsoft 365'ten ", italic: "daha fazla tool satın almadan", post: " daha çok faydalanın." },
          lead: "Bir görüşme. Mevcut tenant'ınızda neyi otomatikleştirmenin değerli olduğunu — bir abonelik daha eklemeden önce — söyleriz.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
      },
      interneTools: {
        slug: "interne-tools",
        meta: {
          title: "İç Araçlar & Entegrasyonlar — Admin Panelleri, Dashboard'lar | OpSolid",
          description:
            "KOBİ'lere küçük, odaklı iç araçlar: admin konsolları, onay kuyrukları, dashboard'lar, bilgi tabanları. Mevcut sistemlerinizin üzerinde inşa edilmiş. AB-hostlu.",
        },
        hero: {
          metaChip: "İÇ ARAÇLAR",
          metaLabel: "[ HİZMET · 04 / 05 ]",
          title: {
            pre: "SaaS'ın uymadığı yerlerde ",
            italic: "küçük bir custom tool",
            post: " işi görür",
          },
          lead:
            "Her iç iş €500/ay'lık platforma ihtiyaç duymaz. Bazen küçük bir custom admin panel, bir onay kuyruğu veya bir dashboard sorunu daha iyi, daha ucuz ve daha hızlı çözer — ve sizin mülkünüz olarak kalır.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
        whatWeDo: {
          headline: "Ne inşa ediyoruz",
          bullets: [
            "Operations ekipleri için iç admin konsolları — net, odaklı, şişkinlik yok.",
            "Mevcut veri kaynaklarınızın üzerinde dashboard'lar — KPI'lar, istisnalar ve uyarılar tek görünümde.",
            "Gerçek sürecinize uyan onay kuyrukları, iç formlar, eskalasyon flow'ları.",
            "İç bilgi tabanları — kendi dokümanlarınız, politikalarınız ve SSS'lerinizde arama.",
          ],
        },
        useCases: {
          headline: "İnşa ettiğimiz iç araçlar",
          items: [
            {
              title: "Operations admin konsolu",
              body: "Sipariş özeti, istisna yönetimi, müşteri notları — üç sekme yerine tek bir yer.",
            },
            {
              title: "İç KPI dashboard'u",
              body: "CRM, ERP ve finans sisteminden günlük, haftalık ve aylık sayılar — bir analistin her hafta tabloyu yeniden kurmasına gerek kalmadan.",
            },
            {
              title: "Onay ve eskalasyon kuyruğu",
              body: "Teklifler, sözleşmeler veya iadeler kuyruklanır, yönlendirilir ve net audit trail ile onaylanır.",
            },
            {
              title: "İç AI bilgi tabanı",
              body: "Kendi dokümanlarınız, politikalarınız ve SSS'lerinizde arama — cevaplar organizasyonunuzun içinde kalır.",
            },
          ],
        },
        tools: {
          headline: "Tech stack",
          items: [
            "Next.js · React · TypeScript",
            "Node.js · Python",
            "PostgreSQL · Supabase",
            "REST · GraphQL · Webhook'lar",
            "Auth0 · Microsoft Entra ID · SSO",
            "Hetzner · IONOS · Vercel · AB hosting",
            "GitHub · CI/CD · audit log'lar",
          ],
        },
        process: {
          headline: "İç araç projesi nasıl ilerler",
          steps: [
            { num: "01", title: "Spesifikasyon", body: "Tool'un ne yapması gerektiğini — ve yapmaması gerektiğini — kısa workshop ile yazıya döker." },
            { num: "02", title: "İnşa et", body: "Üç-altı haftada pilot sürüm. Gerçek kullanıcılar, gerçek veri, hızlı iyileştirme." },
            { num: "03", title: "İşlet", body: "Dokümantasyon, kaynak kodu ve süregelen iyileştirme isterseniz küçük retainer ile devir." },
          ],
        },
        faq: {
          headline: "İç araçlar — sık sorulanlar",
          items: [
            { q: "Custom tool gerçekten SaaS'tan daha mı ucuz?", a: "Spesifik, dar problemler için — genelde evet. Özellikle SaaS adoption düşükse veya tool tek tip bir sürece uymak zorundaysa." },
            { q: "Kodu kim sahiplenir?", a: "Siz. Kaynak kodu, şemalar ve runbook'lar birinci günden itibaren sizindir." },
            { q: "Sonradan değiştirmek istersek?", a: "Yapabilirsiniz — kendi içinizde, başka bir sağlayıcıyla veya bizimle. Lock-in yok." },
            { q: "Mevcut sistemlerimizle entegre olur mu?", a: "Evet — genelde tüm mesele budur. CRM, ERP, Microsoft 365, depo sisteminiz." },
          ],
        },
        finalCta: {
          title: { pre: "Ekibinize ", italic: "uyan bir tool", post: " edinin." },
          lead: "Bir görüşme. Custom iç bir tool'un doğru hamle olup olmadığını — veya konfigüre edilmiş bir SaaS'ın yeterli olup olmayacağını — söyleriz.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
      },
      kiSchulungen: {
        slug: "ki-schulungen",
        meta: {
          title: "KOBİ'lere AI Eğitimleri & Politikaları — Güvenli, Verimli AI Kullanımı | OpSolid",
          description:
            "KOBİ ekipleri için pratik AI eğitimleri: AI'ın günlük işte nasıl güvenli ve verimli kullanılacağı. Yazılı yönergeler, role özel playbook'lar, DSGVO-uyumlu kurulum.",
        },
        hero: {
          metaChip: "AI EĞİTİMLERİ",
          metaLabel: "[ HİZMET · 05 / 05 ]",
          title: {
            pre: "Ekibiniz. AI ile ",
            italic: "daha güvenli ve hızlı",
            post: ".",
          },
          lead:
            "Ekibinizin yarısı zaten Shadow IT'de ChatGPT kullanıyor. Yönerge yoksa bu bir veri koruması ve kalite sorunu. Varsa, bir verimlilik artışı. Kuralları kurmanıza ve insanları eğitmenize yardım ederiz.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
        whatWeDo: {
          headline: "Bir AI eğitimi neleri kapsar",
          bullets: [
            "Günlük görevler için pratik AI workshop'ları — taslak, özetleme, sınıflandırma, yapılandırma.",
            "Satış, destek, finans, İK için role özel playbook'lar — „ChatGPT ile nasıl konuşulur“ tarzı jenerik sunumlar değil.",
            "Şirket için yazılı AI politikaları ve acceptable-use policy — kısa, okunabilir, uygulanabilir.",
            "DSGVO uyumlu AI kurulumu: model seçimi, veri konumu, audit trail ve çalışanların ne yapıştırabileceği / yapıştıramayacağı.",
          ],
        },
        useCases: {
          headline: "Daha önce yürüttüğümüz eğitim formatları",
          items: [
            {
              title: "Şirket çapında AI temeli",
              body: "Tüm personel için yarım günlük oturum: AI ne yapabilir, ne yapamaz; nerede yardım eder, nerede zarar verir.",
            },
            {
              title: "Departmana özel workshop'lar",
              body: "Satış, destek, finans, İK — her biri role özel prompt'lar ve örnek workflow'larla.",
            },
            {
              title: "Liderlik briefing'i",
              body: "Yönetim ekibi için odaklı iki saatlik oturum — prompt syntax'ı değil, stratejik etkiler.",
            },
            {
              title: "AI politika rollout'u",
              body: "Yazılı policy, iç Q&A ve kısa e-learning modülü — kurallar gerçekten yerleşsin diye.",
            },
          ],
        },
        tools: {
          headline: "Eğittiğimiz araçlar ve platformlar",
          items: [
            "ChatGPT · GPT-4 ailesi",
            "Microsoft 365 Copilot",
            "Claude · Anthropic",
            "Google Gemini · Workspace",
            "Notion AI · Slack AI",
            "İç RAG / chat asistanları",
            "DSGVO best practice · audit logging",
          ],
        },
        process: {
          headline: "Bir eğitim projesi nasıl ilerler",
          steps: [
            { num: "01", title: "Audit", body: "Kısa görüşme turu: kim AI'ı zaten kullanıyor, nasıl, riskler nerede." },
            { num: "02", title: "Uyarla", body: "Eğitimi sektörünüze, araçlarınıza ve gerçek use case'lerinize uyarlarız — hazır slayt yok." },
            { num: "03", title: "Yay", body: "Workshop'lar, yazılı politika, iç Q&A — ve sekiz hafta sonra opsiyonel follow-up." },
          ],
        },
        faq: {
          headline: "AI eğitimleri — sık sorulanlar",
          items: [
            { q: "Tipik bir eğitim ne kadar sürer?", a: "Tüm personel için yarım gün; departmana özel deep-dive için bir-iki tam gün." },
            { q: "Almanca eğitim veriyor musunuz?", a: "Evet — Almanca ve İngilizce. Türkçe talep üzerine." },
            { q: "Bir online kurstan farkı ne?", a: "Hipotetik örneklerle değil, gerçek workflow'larınız, araçlarınız ve verilerinizle eğitiyoruz. İnsanlar gerçekten kullandıklarını hatırlar." },
            { q: "AI politikasını da yazıyor musunuz?", a: "Evet — kısa, okunabilir, uygulanabilir. Sektörünüze ve araçlarınıza uyarlanmış, 30 sayfalık hukuki doküman değil." },
          ],
        },
        finalCta: {
          title: { pre: "Ekibinize AI'ı ", italic: "güvenli ve verimli", post: " kullanmasına yardım edin." },
          lead: "Bir görüşme. Standart bir webinar değil, ekibinize gerçekten uyan bir eğitim formatı öneririz.",
          ctaPrimary: "Tanışma görüşmesi planla",
          ctaSecondary: "AI Automation Check ile başla",
        },
      },
    },

    voiceAgent: {
      hero: {
        metaChip: "VOICE AGENT",
        metaLabel: "[ PRODUCT · 01 ]",
        title: {
          pre: "Her çağrıya ",
          italic: "otuz saniyede",
          post: " ya da daha kısa sürede yanıt — günün yirmi dört saati",
        },
        lead:
          "Müşterilerinizin santral elemanından ayırt edemeyeceği bir voice agent. Intent'e göre yönlendirir, takviminize kayıt eder, script tükendiğinde insana sıcak devir yapar. Retell veya Vapi üzerinde kurulur, uçtan uca denetlenir, sizin playbook'unuzla eğitilir.",
        ctaPrimary: "Pilot başlat",
        ctaSecondary: "Canlı çağrıyı dinle",
        features: [
          {
            label: "LATENCY",
            value: "<800",
            unit: "ms p50",
            sub: "uçtan uca · gerçek zamanlı",
          },
          {
            label: "LANGUAGES",
            value: "DE · EN · TR",
            unit: "",
            sub: "otomatik algılama",
          },
          {
            label: "UPTIME",
            value: "%99,9",
            unit: " hedef",
            sub: "Retell SLA · sağlayıcı ölçümü",
          },
        ],
      },
      flow: {
        eyebrow: "[ ÇAĞRI AKIŞI ]",
        headline: "Her çağrı, dört hamlede tamamlanır",
        lead:
          "Agent, gereken yerde deterministiktir — kimlik, planlama, devir — ve mümkün olan yerde konuşmacıdır. Politika uyduran açık uçlu sohbet yok.",
        steps: [
          {
            num: "01 · GREET",
            title: "İlk çalıştaki açılış.",
            body:
              "Açılış cümlesi markanızın sesinde. Dil, ilk cümleden otomatik algılanır.",
          },
          {
            num: "02 · CLASSIFY",
            title: "Menüye değil, intent'e göre yönlendir.",
            body:
              "Rezervasyon, destek, sevkiyat, teslimat, acil. Ekibinizin gerçek kuyruklarına eşlenir.",
          },
          {
            num: "03 · RESOLVE",
            title: "İşi yap, kaydı yaz.",
            body:
              "Cal.com'a rezervasyon yazar, CRM'i günceller, operasyon kanalına gönderir. Her eylem trace ID ile loglanır.",
          },
          {
            num: "04 · HANDOFF",
            title: "Başarısız olmadan eskale et.",
            body:
              "Güven düştüğünde veya intent yeniyse, tam transkript bağlamıyla insana sıcak devir.",
          },
        ],
      },
      spec: {
        eyebrow: "[ TEKNİK ŞARTNAME ]",
        headline: "Açıp inceleyebileceğiniz araçlar üzerine kurulur",
        lead:
          "Kapalı kutu fiyatlandırma katmanı yok. Her katman değiştirilebilir, her ayar sizin tarafınızda sürümlü tutulur.",
        rows: [
          { label: "Platform", value: "Sizin seçiminize göre kurulur" },
          { label: "Konuşma tanıma", value: "Çok dilli, gerçek zamanlı" },
          { label: "Anlama", value: "Önde gelen modeller; gerekirse yerel kurulum" },
          { label: "Ses sentezi", value: "Markanıza özel ses tonu" },
          { label: "Telefon hattı", value: "Alman numara · GDPR sözleşmesi" },
          { label: "Entegrasyonlar", value: "Cal.com, HubSpot, Pipedrive, SAP ve özel bağlantılar" },
          { label: "Veri rezidansı", value: "EU-west · Frankfurt · ABD alt-işlemcisi yok" },
          { label: "Devir süresi", value: "İki hafta. Ayarlar, veri ve numaralar taşınabilir." },
        ],
      },
    },

    digitalCard: {
      hero: {
        metaChip: "OPSO SMART",
        metaLabel: "[ OPSO SMART · 02 ]",
        title: {
          pre: "Saklanmayı ",
          italic: "hak eden",
          post: " bir kartvizit",
        },
        lead:
          "Bir dakikada mobil uyumlu bir dijital kartvizit oluşturun. Bağlantı, QR kod, WhatsApp veya e-posta ile paylaşın — karşı tarafın uygulamaya ihtiyacı yok. İletişim bilgilerinizi, randevu bağlantınızı ve portföyünüzü istediğiniz zaman tek merkezden güncelleyin, yeniden baskı yok.",
        ctaPrimary: "Ücretsiz oluştur",
        ctaSecondary: "Tasarımları gör",
        features: [
          {
            label: "FORMAT",
            value: "Dijital kart",
            sub: "Link · QR · WhatsApp",
          },
          {
            label: "ALICI",
            value: "Uygulama yok",
            sub: "Tarayıcıda açılır",
          },
          {
            label: "FİYAT",
            value: "Ücretsiz",
            sub: "İstediğin zaman düzenle",
          },
        ],
      },
      templates: {
        eyebrow: "[ SEKTÖR ŞABLONLARI ]",
        headline: "Başlangıç noktası — deli gömleği değil",
        lead:
          "Hukuk, sağlık, zanaat ve konaklama için hazır düzenler — her biri o sektörde fiilen kullanılan iletişim alanları, uyumluluk bildirimleri ve takvim entegrasyonları ile. Kilitli bir tema değil, dilediğiniz gibi çatallayıp değiştirebileceğiniz bir başlangıç noktası.",
        items: [
          {
            sector: "LAW",
            name: "Anja Weber",
            role: "Partner · Kurumsal Hukuk",
            code: "LAW · HAM",
            cls: "sector-law",
          },
          {
            sector: "CLINIC",
            name: "Dr. Martin Bauer",
            role: "Diş Hekimi · Özel Muayene",
            code: "CLINIC · BER",
            cls: "sector-clinic",
          },
          {
            sector: "TRADES",
            name: "Jan Meister",
            role: "Usta · Tesisat",
            code: "TRADES · FRA",
            cls: "sector-trades",
          },
          {
            sector: "HOSP",
            name: "Sofia Aydın",
            role: "Sommelière · Fine Dining",
            code: "HOSP · IST",
            cls: "sector-hosp",
          },
        ],
      },
      howItWorks: {
        eyebrow: "[ NASIL ÇALIŞIR ]",
        headline: "Oluştur. Paylaş. Güncelle",
        lead:
          "Donanım yok, uygulama yok. Kartınız, panelinizden istediğiniz zaman güncellediğiniz bir bağlantıda yaşar.",
        steps: [
          {
            num: "01",
            title: "Bir dakikada oluştur",
            body:
              "Tasarım seç, birkaç alan doldur, ücretsiz yayınla — hesap gerekmez.",
          },
          {
            num: "02",
            title: "Her yerde paylaş",
            body:
              "Bağlantı, QR kod, WhatsApp veya e-posta ile. Karşı taraf tarayıcıda açar — uygulama yok.",
          },
          {
            num: "03",
            title: "İstediğin zaman düzenle",
            body:
              "Yeni unvan, yeni numara, yeni foto — bir kez değiştir, anında canlı.",
          },
        ],
      },
      customRequest: {
        eyebrow: "[ WHITE-GLOVE · SİZİN İÇİN TASARLANIR ]",
        headline: "Sizin için biz tasarlayalım mı?",
        lead:
          "İki 'sizin yerinize yapalım' yolu: White-glove kartınızı 48 saatte elde tasarlar, ya da ekipler ve özel istekler için teklif çıkarırız. Aşağıdan ne istediğini yaz — ya da direkt bize mesaj at.",
        options: [
          {
            tag: "WHITE-GLOVE",
            price: "299 €'dan başlar",
            title: "Sizin için tasarlarız",
            body:
              "48 saatte elde tasarım, sınırsız revizyon, çok dilli (DE / EN / TR), öncelikli destek.",
          },
          {
            tag: "ÖZEL · EKİP",
            price: "Talep üzerine",
            title: "Özel tasarım veya ekip kurulumu",
            body:
              "Özel düzenler, çok sayıda kart, kendi alan adınız — kapsamı çıkarıp size teklif göndeririz.",
          },
        ],
        channels: {
          heading: "Direkt bize ulaşın",
          note: "En hızlısı WhatsApp — genelde bir iş günü içinde yanıtlıyoruz.",
          prefill: "Merhaba OpSolid — özel bir OpSo Smart kart istiyorum.",
          labels: {
            whatsappTr: "WhatsApp · TR",
            whatsappDe: "WhatsApp · DE",
            phone: "Ara",
            email: "E-posta",
          },
        },
        form: {
          heading: "Kartından bahset",
          name: "Ad soyad",
          email: "İş e-postası",
          company: "Firma (opsiyonel)",
          industry: "Sektör",
          teamSize: "Kaç kart?",
          teamSizeOptions: ["1", "2 – 5", "6 – 20", "20+"],
          message: "Ne lazım? Stil, bağlantılar, özel istekler…",
          consent:
            "OpSolid'in bu talebi yanıtlamak için işlemesine onay veriyorum.",
          privacyLink: "Gizlilik Politikası",
          submit: "Talebi gönder",
          submitting: "Gönderiliyor…",
          success: "Teşekkürler — bir iş günü içinde yanıtlayacağız.",
          error: "Bir şeyler ters gitti. Lütfen doğrudan info@opsolid.de adresine yazın.",
        },
      },
      gallery: {
        heading: "Tüm Tasarımlar",
        subheading:
          "Tüm koleksiyonu keşfet ve sektörüne en uygun tasarımı seç.",
        countLabel: "tasarım",
        allChip: "Tümü",
        useDesign: "Bu tasarımı kullan",
        backLink: "Dijital Kartlara Dön",
        imgFallbackLabel: "Ön izleme",
        sectors: {
          general: "Genel",
          realEstate: "Emlak",
          salon: "Salon & Berber",
          restaurant: "Restoran",
          creator: "Kreatif & Foto",
          freelancer: "Freelancer",
          lawyer: "Hukuk",
          clinic: "Klinik",
          fitness: "Fitness",
          music: "Müzik & DJ",
          architecture: "Mimari",
          retail: "Perakende",
          hospitality: "Otelcilik",
          events: "Etkinlik",
          construction: "İnşaat",
          tourism: "Turizm",
          corporate: "Kurumsal",
          tech: "Teknoloji",
          consultant: "Danışmanlık",
          dentist: "Diş Hekimi",
          psychologist: "Psikoloji",
          beauty: "Güzellik",
          accounting: "Muhasebe",
          software: "Yazılım",
          "content-creator": "İçerik Üretici",
          wellness: "Sağlık & Wellness",
          eventPlanner: "Etkinlik Planlama",
          auto: "Otomotiv",
          interior: "İç Mimarlık",
        },
      },
    },

    contact: {
      hero: {
        metaChip: "BOOKING OPEN · 2026 Q2",
        metaLabel: "[ İLETİŞİM ]",
        title: {
          pre: "Otuz dakika. ",
          italic: "Yazılı bir plan",
          post: "",
        },
        lead:
          "Kısa bir görüşme. Operasyon keşfi, neyin otomasyona uygun olduğuna dair açık bir değerlendirme ve 48 saat içinde gelen kutunuza yazılı bir özet — iş ilerlese de ilerlemese de.",
        contacts: [],
        trust: [],
      },
      form: {
        title: "Discovery görüşmesi ayarla",
        meta: "FORM · 01",
        fields: {
          name: { label: "Ad", placeholder: "Tam adınız" },
          company: { label: "Şirket", placeholder: "İşletme" },
          email: { label: "E-posta", placeholder: "sen@firma.de" },
          phone: { label: "Telefon (opsiyonel)", placeholder: "+49 …" },
          interest: { label: "İlgilendiğiniz" },
          message: {
            label: "Operasyon zemininde ne var?",
            placeholder:
              "Neyin manuel, neyin kırılgan, düşünmeyi bırakmak istediğiniz şey hakkında bir-iki cümle.",
          },
        },
        topics: [
          { key: "automation", label: "Workflow otomasyonu" },
          { key: "integration", label: "Sistem entegrasyonu" },
          { key: "voice", label: "Voice agent" },
          { key: "card", label: "Digital card" },
          { key: "kutasia", label: "Kutasia" },
          { key: "other", label: "Başka bir şey" },
        ],
        legal:
          "Form gönderileri doğrudan tarafımıza ulaşır. Üçüncü taraf analitik kullanmıyoruz, pazarlama listesine eklenmiyorsunuz; 14 gün sonra otomatik takip yapılmaz.",
        submitCta: "Görüşme talep et",
        success: "Teşekkürler — 48 saat içinde yanıt vereceğiz.",
        error: "Gönderilemedi. Tekrar deneyin veya doğrudan yazın.",
      },
    },

    blog: {
      head: {
        eyebrow: "[ JOURNAL · VOL. 0 ]",
        title: {
          pre: "Operasyon ",
          italic: "zemininden",
          post: " notlar",
        },
        intro:
          "Saha notları, iş raporları ve zaman zaman sağlam bir fikir. İlk yazılar hazırlanıyor — yayınlandığında haber almak için aşağıdan abone olun.",
      },
      emptyFeature: {
        tag: "HAZIRLANIYOR · UZUN BİÇİM",
        headline:
          "Odaklı otomasyon: bir işi gerçekten ileri taşıyan nedir, yalnızca sunumda iyi görünen nedir",
        lede:
          "Günlüğün açılış yazısı. Taslak hazırlanıyor — 20 satırın altında odaklı bir iş akışının ERP değişimini anlamlı ölçütlerde nasıl geçtiği üzerine.",
        meta: "D. PIHA · PLANLANDI · 15 DK",
      },
      series: {
        title: "Otomasyon için pratik playbook'lar",
        body:
          "Süregelen bir seri. İlk altı yazı planlandı — ikinci yarı gelecek çeyrekte. E-posta patlaması yok, damla kampanyası yok — sadece bir şey indiğinde bir not.",
        placeholder: "sen@firma.de",
        cta: "Abone ol",
        legal: "Yazı başına bir e-posta. Tek tıkla abonelikten çık.",
      },
    },

    legal: {
      impressum: {
        eyebrow: "[ LEGAL · KÜNYE ]",
        title: "Künye",
      },
      privacy: {
        eyebrow: "[ LEGAL · GİZLİLİK ]",
        title: "Gizlilik",
      },
    },

    kutasia: {
      hero: {
        metaChip: "KUTASIA",
        metaLabel: "[ WORKSPACE · KOBİ ]",
        title: {
          pre: "Uyumayan ",
          italic: "müşteri operasyonu",
          post: " için AI çalışma alanı",
        },
        lead:
          "WhatsApp, Telegram, e-posta ve telefon görüşmelerini tek AI çalışma alanında birleştirir — DACH ve Türkiye'deki, işi müşteri görüşmelerine bağlı KOBİ'ler için tasarlandı. Tedarikçi sesli notunu alan fırıncıdan, randevu iptalini bekleme listesinden dolduran kliniğe kadar.",
        ctaPrimary: "Çalışma alanını aç",
        ctaSecondary: "Otomasyonları gör",
      },
      rooms: {
        eyebrow: "[ OTOMASYONLAR ]",
        headline: "Altı otomasyon. Tek çalışma alanı",
        lead:
          "Her otomasyon 90 saniyenin altında uçtan-uca gösterilebilir — fuar standında telefondan çalışır. Tek başına kullanın ya da zincirleyin — unified inbox her görüşmeyi, her kanalı ve her AI önerisini tek görünümde tutar.",
        items: [
          {
            n: "01 · UNIFIED INBOX",
            h: "Her kanal, tek ekran.",
            b: "WhatsApp, Telegram, e-posta, ses transkripsiyonları ve web formları tek inbox'ta — her thread için AI özet, sentiment ve yanıt taslağı.",
            rows: [
              { label: "KANALLAR", value: "WA · TG · EMAIL · VOICE" },
              { label: "AI", value: "ÖZET · SENTIMENT · TASLAK" },
              { label: "ATAMA", value: "ROLLER · EKİPLER · ETİKETLER" },
            ],
          },
          {
            n: "02 · SESLİ NOT → KAYIT",
            h: "Ses notundan yapılandırılmış aksiyona.",
            b: "Müşteri ya da tedarikçi WhatsApp'tan sesli not gönderir — Whisper transkribe eder, LLM ürün, miktar ve tarihi çıkarır. Onaylanmış kayıt olarak düşer, sahibe Telegram özeti gider.",
            rows: [
              { label: "TRANSKRİPSİYON", value: "WHISPER · ÇOK DİLLİ" },
              { label: "ÇIKARIM", value: "ÜRÜN · MİKTAR · TARİH" },
              { label: "ÇIKTI", value: "KAYIT + TG UYARI" },
            ],
          },
          {
            n: "03 · ÇOK DİLLİ TRİYAJ",
            h: "TR ↔ DE ↔ EN, anlık.",
            b: "Müşteri kendi dilinde yazar. Sahip kendi dilinde tek satır özet görür. AI yanıt taslakları müşterinin dilinde gelir — sizin tonunuzla imzalı.",
            rows: [
              { label: "ALGILAMA", value: "OTOMATİK · 12 DİL" },
              { label: "ÇEVİRİ", value: "BAĞLAM-FARKINDA" },
              { label: "YÖNLENDİRME", value: "TG / WEB OWNER PING" },
            ],
          },
          {
            n: "04 · NO-SHOW KURTARMA",
            h: "Kendini dolduran boş slotlar.",
            b: "Rezervasyon iptal edilir — sistem bekleme listesinin ilk 3'üne paralel WhatsApp template atar. İlk yanıt slotu kapar, diğerleri kibar bir geri çekilme mesajı alır.",
            rows: [
              { label: "TETİK", value: "CAL.COM · MANUEL" },
              { label: "ŞABLON", value: "WA UTILITY · ONAYLI" },
              { label: "YARIŞ", value: "İLK-EVET KAZANIR" },
            ],
          },
          {
            n: "05 · E-POSTA → TEKLİF TASLAĞI",
            h: "Talep girer, taslak çıkar, insan gönderir.",
            b: "Gelen teklif talepleri anahtar kelimelerinizi yakalar. AI fiyat listenize göre teklif taslağı çizer ve Outbox'a düşer — insan onaylar, gönderir; otomatik gönderim yok, sürpriz yok.",
            rows: [
              { label: "GİRİŞ", value: "IMAP · POSTMARK" },
              { label: "FİYAT LİSTESİ", value: "JSON · CSV · API" },
              { label: "ONAY", value: "HUMAN IN THE LOOP" },
            ],
          },
          {
            n: "06 · AI ANALİTİK",
            h: "Yalnızca aksiyona dönen.",
            b: "Yanıt süresi, sentiment trendi, intent dağılımı, konuşma maliyeti. Günlük özet e-posta ya da Telegram ile. Vanity dashboard yok — chart ya bir kararı değiştirir, ya da dashboarda çıkmaz.",
            rows: [
              { label: "DIŞA AKTARIM", value: "CSV · API" },
              { label: "ÖZET", value: "EMAIL · TG · HAFTALIK" },
              { label: "GİZLİLİK", value: "GDPR · EU-HOSTED" },
            ],
          },
        ],
      },
    },

    productsHub: {
      meta: {
        title: "Ürünler — Voice, OpSo Smart, Chat, WhatsApp, Booking, Email, Lead, Custom, Kutasia | OpSolid",
        description: "Tek stüdyodan dokuz ürün: telefon, chat, WhatsApp, e-posta ve lead qualification için yapay zekâ ajanları, ücretsiz dijital kartvizit (OpSo Smart), özel workflow otomasyonu ve Kutasia — DACH ve Türkiye'deki KOBİ'ler için unified AI çalışma alanı. Her ürün şeffaf fiyatlı ve EU-hostlu.",
      },
      hero: {
        eyebrow: "[ ÜRÜNLER · 2026 ]",
        title: { pre: "Dokuz ürün, ", italic: "tek stüdyo", post: "" },
        lead: "Bu sayfadaki her ürünü aynı ekip kuruyor ve işletiyor. Voice, chat ve WhatsApp ajanları aynı entegrasyon omurgasını paylaşır. Dijital kartvizitimiz OpSo Smart, ücretsizdir ve saniyeler içinde canlı olur. Custom Automation, geri kalanın ulaşamadığı workflow'ları halleder. Kutasia, ajanları tek bir unified AI çalışma alanında birleştirir — işi müşteri görüşmelerine bağlı KOBİ'ler için. Yüzeyi siz seçin, gerisini biz yaparız.",
        primaryCta: "Fiyatları gör",
        secondaryCta: "Tanışma görüşmesi planla",
      },
      featured: {
        eyebrow: "[ AMİRAL GEMİLERİ ]",
        heading: "Bizi hatırlatan iki ürün",
        items: [
          { id: "voice-agent", name: "Voice AI Agent", tagline: "Retell veya Vapi üzerinde 24/7 telefon resepsiyonu.", body: "Çok dilli telefon yanıtı, takvim senkronizasyonu, script bittiğinde insana devir. Hamburg taksi dispeçlerinde, Bavyera otellerinde ve Almanya çapında B2B service desk'lerinde canlı.", href: "/products/voice-agent", startingAt: "€1.500 setup + €299/ay'dan", badge: "Canlı" },
          { id: "verso", name: "OpSo Smart", tagline: "Dijital kartvizit · ücretsiz, saniyeler içinde canlı.", body: "Kartınızı ücretsiz oluşturun ve saniyeler içinde yayınlayın. 20+ sektör şablonu, link, QR, WhatsApp veya e-posta ile paylaşın - alıcıya uygulama gerekmez, istediğiniz zaman düzenlenir. Frankfurt'ta EU barındırma. Linktree olmadan kağıt kartviziti değiştirir.", href: "/products/digital-card", startingAt: "Ücretsiz", badge: "Canlı" },
        ],
      },
      grid: {
        eyebrow: "[ AJANLAR & HİZMETLER ]",
        heading: "Yedi tane daha, her biri ne yaptığında net",
        items: [
          { id: "chatbot-agent", name: "Chatbot Agent", tagline: "Knowledge base'inizle eğitilmiş web chat.", startingAt: "€149/ay'dan", href: "/products/chatbot-agent", category: "AJAN" },
          { id: "whatsapp-agent", name: "WhatsApp Agent", tagline: "WhatsApp Business otomatik yanıt + broadcast.", startingAt: "€199/ay'dan", href: "/products/whatsapp-agent", category: "AJAN" },
          { id: "booking-agent", name: "Booking Agent", tagline: "Multi-kanal randevu → Cal.com → hatırlatma.", startingAt: "€99/ay'dan", href: "/products/booking-agent", category: "AJAN" },
          { id: "email-agent", name: "Email Agent", tagline: "Inbox triage, AI taslak yanıt, eskalasyon.", startingAt: "€39/koltuk/ay'dan", href: "/products/email-agent", category: "AJAN" },
          { id: "lead-qualifier-agent", name: "Lead Qualifier Agent", tagline: "Form, chat ve voice intake'te BANT scoring.", startingAt: "€249/ay'dan", href: "/products/lead-qualifier-agent", category: "AJAN" },
          { id: "custom-automation", name: "Custom Automation", tagline: "Sprint, proje veya retainer engineering.", startingAt: "€4.500 sprint'ten", href: "/products/custom-automation", category: "HİZMET" },
          { id: "kutasia", name: "Kutasia", tagline: "KOBİ'ler için unified WhatsApp, Telegram, e-posta ve Voice AI çalışma alanı.", startingAt: "€79/ay'dan", href: "/products/kutasia", category: "WORKSPACE" },
        ],
      },
      bottomCta: {
        eyebrow: "[ HANGİSİ EMİN DEĞİL MİSİNİZ? ]",
        heading: "Darboğazınızı söyleyin — doğru ürünü gösterelim, ya da hiçbirini",
        lead: "20 dakikalık görüşme bizim olmadığımıza karar verirse, o da faydalı 20 dakika. Birden fazla kez prospect'leri Cal.com'a, bir Zapier flow'una ya da 'bir junior işe al'a yönlendirdik.",
        cta: "Ücretsiz 20 dakika rezerve et",
      },
    },

    about: {
      meta: {
        title: "Hakkımda — Hasan Dönmez | OpSolid",
        description:
          "OpSolid Hasan Dönmez tarafından yürütülüyor — Almanya'daki KOBİ'lere yönelik pratik AI ve otomasyon danışmanlığı. IT proje yönetimi, dijitalleşme ve süreç optimizasyonunda geçmiş.",
      },
      hero: {
        eyebrow: "[ HAKKIMDA · 2026 ]",
        title: {
          pre: "Pratik, uygulanabilir ve ",
          italic: "ölçülebilir",
          post: " dijital çözümler",
        },
        lead:
          "OpSolid, Hasan Dönmez'in bağımsız danışmanlık pratiğidir. Odak: Almanya'daki KOBİ'lere yönelik AI, süreç otomasyonu ve dijital workflow'lar — yıllarca süren pratik IT proje yönetimi, dijitalleşme ve süreç optimizasyonu çalışmalarına dayanıyor.",
        primaryCta: "Tanışma görüşmesi planla",
        secondaryCta: "Hizmetleri gör",
      },
      principles: {
        eyebrow: "[ NASIL ÇALIŞIYORUM ]",
        heading: "Dört prensip, kısa tutulmuş",
        items: [
          {
            n: "01",
            title: "Stratejiden önce pratik",
            body: "Ekibe gerçekten zaman kaybettiren tek bir workflow ile başlarız — çeyreklik strateji sunumuyla değil. Strateji, daha ileri planlama hakkını kazandığımızda gelir.",
          },
          {
            n: "02",
            title: "Ölçülebilir sonuçlar",
            body: "Her engagement bir baseline ile başlar (görev başına süre, hata oranı, döngü süresi) ve aksiyona dönüşebilir bir sayıyla biter. Tiyatro yok, buzzword raporu yok.",
          },
          {
            n: "03",
            title: "Veri koruması varsayılan",
            body: "AB hosting, DSGVO-native altyapı, müşteri verisine dokunan projelerden önce AVV imzası. Audit ve compliance ilk günden itibaren takip edebilir.",
          },
          {
            n: "04",
            title: "Kaynak kodu sizde kalır",
            body: "Her engagement size başka bir sağlayıcıya götürebileceğiniz kod, şema ve dokümantasyon bırakır. Tasarım gereği vendor lock-in yok.",
          },
        ],
      },
      founder: {
        eyebrow: "[ KURUCU ]",
        heading: "Hasan Dönmez",
        body: [
          "Tam zamanlı IT proje yöneticisi olarak çalışıyorum ve yan tarafta OpSolid'i AI ve otomasyon için bağımsız bir danışmanlık pratiği olarak kuruyorum. Bu kombinasyon bilinçli: gündüz, dijitalleşme projelerinin orta ölçekli şirketlerde gerçekte nasıl yürüdüğünü görüyorum — kısıtları, politikası, eski sistemleri ve gerçek ekipleriyle — ve bu perspektifi OpSolid projelerine taşıyorum.",
          "Geçmiş: IT proje yönetimi, dijitalleşme ve süreç optimizasyonunda pratik deneyim. Odak: Almanya'daki küçük ve orta ölçekli işletmeler — iç sistemlerinden hızlı büyümüş ve platform pitch'i değil, ölçülebilir bir sonraki adım arayan şirketler.",
          "OpSolid bilinçli olarak tek kişilik: bir görüşme rezerve ettiğinizde, işi yapacak kişiyle konuşuyorsunuz. Katman yok, junior teslimat yok, handoff yok.",
        ],
        linkedinLabel: "LinkedIn'de Hasan",
        linkedinHref: "https://www.linkedin.com/in/hasan-doenmez/",
      },
      contact: {
        eyebrow: "[ KONUŞMA BAŞLAT ]",
        heading: "Uyumlu olup olmadığımızı görmek için 20 dakika yeterli",
        lead:
          "Ücretsiz tanışma görüşmesi: bana bir operasyonel acı noktasını anlatın. OpSolid'in uygun olup olmadığını, AI & Automation Check'in doğru ilk adım olup olmadığını ya da yaptığınıza devam etmeniz gerektiğini söylerim.",
        cta: "Tanışma görüşmesi planla",
      },
    },

    productPages: {
      labels: {
        useCasesEyebrow: "[ KULLANIM SENARYOLARI ]",
        useCasesHeading: "Değerini nerede kanıtlıyor",
        integrationsEyebrow: "[ ENTEGRASYONLAR ]",
        integrationsHeading: "Mevcut stack'inize entegre",
        faqEyebrow: "[ SSS ]",
        faqHeading: "Sık sorulan sorular",
      },
      pages: {
        chatbotAgent: {
          meta: { title: "Chatbot Agent — Web chat, knowledge base, lead capture | OpSolid", description: "Siteniz için yapılandırılmış chatbot ajanı. Knowledge base ingestion, lead capture ve insana devir — HubSpot, Pipedrive veya Slack ile bağlı. EU-hostlu, GDPR-uyumlu." },
          hero: {
            metaChip: "CHATBOT AGENT",
            metaLabel: "[ ÜRÜN · 03 ]",
            title: { pre: "Site ziyaretçileri yanıt alır, ", italic: "ekibiniz nitelikli lead", post: "" },
            lead: "Knowledge base'inizle eğitilmiş bir web-chat ajanı. Mesai saatlerinde ürün sorularını yanıtlar, mesai dışında iletişim bilgisi toplar ve ziyaretçi istediğinde konuşmayı insana devreder. İlk hafta sitenize göre yapılandırılır — ekibinize öğrenecek bir araç değildir.",
            ctaPrimary: "20 dakikalık kurulum görüşmesi",
            ctaSecondary: "Fiyatları gör",
            features: [
              { label: "DEPLOY", value: "Hafta 1", sub: "Sizin için yapılandırıldı" },
              { label: "DEVİR", value: "Slack · E-mail", sub: "İnsan devralır" },
              { label: "HOSTING", value: "EU · Frankfurt", sub: "GDPR-uyumlu" },
            ],
          },
          useCases: [
            { industry: "B2B SaaS", problem: "Mühendisler chat widget'ında aynı ürün sorularını cevaplamakla saatler harcıyor.", outcome: "Chatbot dokümanlardan %70 ürün sorusunu yanıtlar; %30'u ekibe kalır." },
            { industry: "E-ticaret", problem: "Saat 18 sonrası kargo ve iade soruları yanıtsız kaldığı için sepet terk ediliyor.", outcome: "7/24 yanıtlar terk oranını düşürür; karmaşık siparişler gece e-posta ile eskale edilir." },
            { industry: "Profesyonel hizmetler", problem: "Inbound lead'ler iletişim formuna düşüyor ve kimse hızlı cevap vermeyince zıplıyor.", outcome: "Chatbot niteler, Cal.com'da discovery call planlar, lead'i HubSpot'a düşürür." },
          ],
          integrations: ["HubSpot", "Pipedrive", "Cal.com", "Slack", "Notion", "Zendesk", "Custom webhook"],
          faq: [
            { q: "Kurulum ne kadar sürer?", a: "Standard için bir hafta (1 site, 50 KB doküman). CRM senkron'lu Professional için iki-üç hafta. 20 dakikalık scoping görüşmesi planlar, knowledge base'inizi inceler ve kickoff'tan sonra beş iş günü içinde yapılandırılmış ajanı teslim ederiz." },
            { q: "Chatbot cevaplayamadığında ne olur?", a: "Üç seçenek: e-mail toplama + ekibinizin SLA dahilinde yanıtı (Standard), konuşma bağlamıyla Slack'e canlı devir (Professional) veya kendi help desk'inize 7/24 eskalasyon (Enterprise). Ziyaretçi asla çıkmaz sokağa girmez." },
            { q: "Bu sadece kutuda ChatGPT mi?", a: "Hayır. Modern LLM'leri bir bileşen olarak kullanırız ama her cevabı indekslenmiş knowledge base'inize dayandırır, her yanıtı denetler ve ekibinizin dashboard'da yanıtları gözden geçirip düzenlemesini sağlarız. Model ürününüz hakkında bilgi uydurmaz." },
            { q: "Veri nerede hostlanıyor?", a: "Hetzner / IONOS Frankfurt. Sadece EU. Sıfır ABD subprocessor. Konuşma geçmişi sizindir, CSV veya API olarak export edilebilir, talep üzerine silinir." },
          ],
        },
        whatsappAgent: {
          meta: { title: "WhatsApp Agent — Business API, otomatik yanıt, broadcast | OpSolid", description: "Yapılandırılmış WhatsApp Business ajanı — otomatik yanıt, broadcast kampanyası, CRM senkron ve insana devir. Meta WABA passthrough, gizli markup yok." },
          hero: {
            metaChip: "WHATSAPP AGENT",
            metaLabel: "[ ÜRÜN · 04 ]",
            title: { pre: "Ekibiniz uyurken ", italic: "WhatsApp yanıt verir", post: "" },
            lead: "WhatsApp Business numaranızda otomatik bir ajan. Şablon, broadcast kampanyası, lead capture flow'u, script bittiğinde insana devir. Meta WABA konuşma maliyetleri şeffaf şekilde geçer — faturanızda gizli markup olmaz.",
            ctaPrimary: "20 dakikalık kurulum görüşmesi",
            ctaSecondary: "Fiyatları gör",
            features: [
              { label: "API", value: "Meta WABA", sub: "Resmi, gateway değil" },
              { label: "PASSTHROUGH", value: "Şeffaf", sub: "Gizli markup yok" },
              { label: "TAKIM", value: "Multi-user", sub: "Roller ve routing" },
            ],
          },
          useCases: [
            { industry: "Lokal perakende", problem: "Müşteriler WhatsApp'ta saat, stok ve iade sorar; personel gün boyu aynı beş soruyu cevaplar.", outcome: "Otomatik yanıt SSS'i halleder; personel gerçek satışa odaklanır, status update'lere değil." },
            { industry: "Hospitality", problem: "Saat 23'te WhatsApp'a düşen booking sorgusu, ön büronun 09'da cevap vermesiyle kötü dönüşür.", outcome: "Ajan müsaitliği teyit eder, booking'i alır, ödeme linki gönderir — ön büro kapalıyken bile." },
            { industry: "Sınır ötesi hizmetler", problem: "WhatsApp'ta çok dilli destek takım kapasitesini yer; takım DE/EN/TR talebine yetişemiyor.", outcome: "Ajan ziyaretçinin dilinde yanıtlar, sadece gerektiğinde doğru ekip üyesine devreder." },
          ],
          integrations: ["Meta WABA", "HubSpot", "Pipedrive", "Cal.com", "Stripe", "Twilio fallback", "Custom webhook"],
          faq: [
            { q: "Meta WABA numarasına ihtiyacım var mı?", a: "Evet — sizin adınıza Meta'da kaydedeceğimiz bir numara verirsiniz. Hâlihazırda WABA numaranız varsa migrate ederiz. Numara sizin kalır; ayrılırsanız her zaman taşıyabilirsiniz." },
            { q: "Konuşma maliyetleri nasıl çalışıyor?", a: "Meta 24-saatlik konuşma penceresi başına ücret alır (kategoriye göre EU'da ~€0,05–0,15). Standard ve Professional'da küçük bir mesaj başına markup ekleriz; Enterprise'da Meta fiyatını markup'sız geçiririz." },
            { q: "Takımım sohbeti manuel olarak devralabilir mi?", a: "Evet — her konuşmada dashboard'umuzda 'insan devralır' düğmesi var, ya da tam bağlamla bir Slack kanalına route edersiniz. İnsan devraldıktan sonra ajan, sohbeti çözüldü işaretleyene kadar sessiz kalır." },
            { q: "Broadcast spam-güvenli mi?", a: "Sadece Meta'nın önceden onaylı template mesajlarını kullanır ve opt-out taleplerine otomatik uyar. Kötüye kullanım Meta'nın numaranızı banlamasına yol açar — biz numaranızı uyumlu tutan muhafazakar varsayılanlar yapılandırırız." },
          ],
        },
        bookingAgent: {
          meta: { title: "Booking Agent — Web, voice, WhatsApp randevu → Cal.com | OpSolid", description: "Multi-kanal booking ajanı. Web widget, voice intake, WhatsApp teyit, no-show recovery — Cal.com veya kendi takviminizle senkron. EU-hostlu." },
          hero: {
            metaChip: "BOOKING AGENT",
            metaLabel: "[ ÜRÜN · 05 ]",
            title: { pre: "Rezervasyon web, voice ve WhatsApp'tan gelir — ", italic: "takvim temiz kalır", post: "" },
            lead: "Her kanaldan intake alan, gerçek takviminize karşı müsaitlik teyit eden, hatırlatma gönderen ve no-show'ları geri kazanan bir booking ajanı. Altta Cal.com, üstte bizim zekamız — solo pratisyenler, çok personelli servis işletmeleri ve multi-lokasyon operasyonları için çalışır.",
            ctaPrimary: "20 dakikalık kurulum görüşmesi",
            ctaSecondary: "Fiyatları gör",
            features: [
              { label: "KANALLAR", value: "Web · Voice · WA", sub: "Hepsi tek takvime" },
              { label: "TAKVİM", value: "Cal.com", sub: "Açık kaynak çekirdek" },
              { label: "RECOVERY", value: "Otomatik", sub: "No-show flow yerleşik" },
            ],
          },
          useCases: [
            { industry: "Salon / berber", problem: "Telefon booking'i servisi keser; müşteriler haber vermeden çift-bookluyor veya gelmiyor.", outcome: "Voice ve web booking'lerin %80'ini alır; SMS hatırlatma no-show oranını yarıya indirir." },
            { industry: "Klinikler", problem: "Resepsiyon teyit araması ve yeniden booking'le saatler harcıyor.", outcome: "Hatırlatma + auto-rebook flow'u çoğunu halleder; resepsiyon sadece istisnalarla ilgilenir." },
            { industry: "Multi-staff ajanslar", problem: "Takım üyeleri arasında round-robin booking, takvimler senk dışına çıktığında başarısız olur.", outcome: "Real-time Cal.com entegrasyonu herkesi tek doğruluk kaynağında tutar; booking'ler skill veya iş yüküne göre route olur." },
          ],
          integrations: ["Cal.com", "Google Calendar", "Outlook", "Twilio", "Stripe (depozito)", "HubSpot", "Slack bildirim"],
          faq: [
            { q: "Cal.com kullanmak zorunda mıyım?", a: "Cal.com varsayılan — açık kaynak ve Professional + Enterprise'da kendi altyapınızda hostluyoruz. Native Google Calendar, Outlook veya CalDAV'lı her takvime de bağlanabiliriz." },
            { q: "Depozito alabiliyor mu?", a: "Evet, Enterprise'da Stripe ile booking anında yapılandırılabilir depozito alıyoruz. Flow iadeleri, no-show'da kısmi captures'ı ve Alman müşteriler için SEPA'yı yönetir." },
            { q: "Multi-lokasyon ne durumda?", a: "Enterprise sınırsız lokasyon destekler, her biri kendi takvim setine, mesai saatine ve routing kuralına sahip. Ziyaretçiler önce lokasyonu, sonra personeli seçer." },
            { q: "No-show recovery nasıl çalışır?", a: "Booking kaçırılırsa ajan 48 saat içinde yeniden booking için takip mesajı gönderir. Müşteri rebookluyorsa ücret yok. Yanıt vermezse auto-rebook teklifi veya nihai hatırlatma yapılandırabilirsiniz." },
          ],
        },
        emailAgent: {
          meta: { title: "Email Agent — Inbox triage, otomatik yanıt, eskalasyon | OpSolid", description: "Paylaşımlı inbox'lar için e-posta otomasyon ajanı. AI triage, yapılandırılabilir otomatik yanıt, eskalasyon kuralları, CRM logging. Front-style UX, Front fiyatı olmadan." },
          hero: {
            metaChip: "EMAIL AGENT",
            metaLabel: "[ ÜRÜN · 06 ]",
            title: { pre: "Inbox'ta triage ve otomatik yanıt, ", italic: "ekibinizi yeniden eğitmeden", post: "" },
            lead: "Paylaşımlı inbox'ı okuyan, mesajları sınıflandıran, yanıt taslakları hazırlayan, acil olanları Slack veya bir kıdemliye eskale eden ve geri kalanı CRM'inize loglayan bir e-posta ajanı. Front, Help Scout veya düz Gmail / Outlook ile uyumlu — ekibiniz araç değiştirmez.",
            ctaPrimary: "20 dakikalık kurulum görüşmesi",
            ctaSecondary: "Fiyatları gör",
            features: [
              { label: "INBOX", value: "Gmail · Outlook · Front", sub: "Araç değişimi yok" },
              { label: "TRIAGE", value: "Sınıflandırılmış", sub: "Auto-tag + öncelik" },
              { label: "TASLAK", value: "Gözden geçirilebilir", sub: "Takım göndermeden onaylar" },
            ],
          },
          useCases: [
            { industry: "Servis masası", problem: "Günlük 200 inbox demek, acil ticket'ların newsletter abonelikleri yanında saatlerce beklemesi demek.", outcome: "Triage 'acil / standart / düşük' tagler; takım önce acil sırayı çalışır, ajan standart için taslak hazırlar." },
            { industry: "Sales-ops", problem: "Inbound ürün sorusu ve fiyat talebi genel info@ inbox'ında kayboluyor.", outcome: "Sales-ilgili e-postalar HubSpot'a route olur, taslaklar doğru rep'e gider, düşük öncelikli mesajlar nazik teyit alır." },
            { industry: "Hospitality", problem: "Resepsiyon takımı servis başlamadan önce inbox temizlemeyle sabahlar harcıyor.", outcome: "Ajan teyitleri, SSS yanıtlarını ve routing'i geceden halleder — resepsiyon sadece istisnaları kontrol eder." },
          ],
          integrations: ["Gmail / Workspace", "Outlook / Microsoft 365", "Front", "Help Scout", "HubSpot", "Pipedrive", "Slack"],
          faq: [
            { q: "Onayım olmadan yanıt gönderir mi?", a: "Standard sadece taslak gönderir — takımınız gözden geçirir ve gönder'e tıklar. Professional whitelist'lenmiş yanıt türleri için (örn. açılış saatleri, basit SSS) opsiyonel auto-send ekler. Enterprise audit log ve rollback ile tam auto-send destekler. Spektrumda nerede duracağınıza siz karar verirsiniz." },
            { q: "Yanıt stilimizi öğrenebilir mi?", a: "Evet — son 90 günlük gönderilen mailinizi indeksleriz; ton, imza ve yaygın ifadeleri öğrenir. Taslaklar takım tarafından yazılmış gibi okunur, generik AI asistanı gibi değil." },
            { q: "E-posta içeriği için GDPR ne durumda?", a: "E-posta içeriği sadece EU'da işlenir. Konuşma geçmişini DPA'nızda belirtilen süre boyunca tutarız (varsayılan 24 ay). Tek tıkla export ve silme desteklenir." },
            { q: "Front ile birlikte çalışabilir mi?", a: "Evet — Email Agent API üzerinden Front'a bağlanır ve mevcut Front workflow'larınız içinde çalışır. Help Scout için aynı. Migrate etmezsiniz; tamamlarsınız." },
          ],
        },
        leadQualifierAgent: {
          meta: { title: "Lead Qualifier Agent — Form, chat, voice → BANT scoring | OpSolid", description: "Her kanaldan intake alan, ICP'nize karşı scor eden ve nitelikli lead'leri tam bağlamla CRM'inize push eden lead qualification ajanı." },
          hero: {
            metaChip: "LEAD QUALIFIER AGENT",
            metaLabel: "[ ÜRÜN · 07 ]",
            title: { pre: "Satış yalnızca ", italic: "nitelikli lead'lerle konuşur", post: "" },
            lead: "Form, web chat ve inbound voice üzerinde çalışan bir qualification ajanı. Doğru discovery sorularını sorar, ICP ve BANT kriterlerine göre scor eder ve sadece nitelikli olanları sales takımınıza route eder. Niteliksiz ziyaretçiler nazik bir sonraki adım alır — boşa harcanmış SDR call'u değil.",
            ctaPrimary: "20 dakikalık kurulum görüşmesi",
            ctaSecondary: "Fiyatları gör",
            features: [
              { label: "INTAKE", value: "Form · Chat · Voice", sub: "Hepsi aynı şekilde scor" },
              { label: "SCORING", value: "BANT + ICP", sub: "Özelleştirilebilir model" },
              { label: "ROUTING", value: "Rep / bölge", sub: "Round-robin veya kural" },
            ],
          },
          useCases: [
            { industry: "B2B SaaS", problem: "Demo talepleri akın halinde gelir; SDR'lar tire-kicker'larla zaman yakar, gerçek prospect'ler bekler.", outcome: "Ajan önce niteler; SDR'lar sadece intent sinyali zaten toplanmış ICP-match lead'leri görür." },
            { industry: "Ajanslar", problem: "Inbound 'ne kadar?' soruları yanıtsız kalır çünkü fiyat scope'a bağlı.", outcome: "Ajan scoping soruları yapar, sadece bütçe ve zaman çizelgesi mantıklıysa nitelikli intro call'u alır." },
            { industry: "Outbound-ağırlıklı takımlar", problem: "Apollo / Outreach yanıtları open rate'i yüksek tutmak için hızlı triage gerektirir.", outcome: "Ajan yanıtları okur, niyeti sınıflandırır, sadece pozitif sinyallerde follow-up planlar." },
          ],
          integrations: ["HubSpot", "Pipedrive", "Salesforce", "Apollo.io", "Outreach.io", "Slack", "Webhook ile custom CRM"],
          faq: [
            { q: "'Nitelikli' nasıl tanımlanır?", a: "Kickoff'ta sizinle birlikte tanımlarız: ICP fit (sektör, boyut, rol), intent sinyali (spesifik soru, aciliyet işareti) ve BANT (bütçe, yetki, ihtiyaç, zaman çizelgesi). Tanım kontratınızda yazılı — qualified lead başına faturalandırma sadece eşleşenler için olur." },
            { q: "Scoring'i geçersiz kılabilir miyim?", a: "Evet. Sales takımı dashboard'da herhangi bir lead'i 'yanlış nitelendirilmiş' işaretleyebilir; model adapte olur. Takımınızın geçersiz kılmaları üzerine aylık yeniden eğitim yaparız — model zamanla ICP'nize daha keskin olur." },
            { q: "Niteliksiz lead'lere ne olur?", a: "Nazik bir sonraki adım alırlar: bir içerik parçası, self-service waitlist, community linki veya 'biz uygun değiliz, doğrusu bu' yönlendirmesi. Asla ghostlanmaz, asla boşa harcanmaz." },
            { q: "Mevcut chat aracımda çalışır mı?", a: "Evet — Lead Qualifier Intercom, Drift, custom widget'inize veya bizim Chatbot Agent'imize bağlanır. Qualification flow'u üst katman olarak çalışır, ikame değil." },
          ],
        },
        customAutomation: {
          meta: { title: "Custom Automation — Sprint, proje, retainer | OpSolid", description: "Alman mid-market B2B için workflow otomasyon inşası. Sprint, proje veya retainer engagement — kaynak kodunuz, verileriniz, vendor lock-in yok." },
          hero: {
            metaChip: "CUSTOM AUTOMATION",
            metaLabel: "[ HİZMET · 08 ]",
            title: { pre: "Hazır araçların ", italic: "ulaşamadığı workflow'lar", post: "" },
            lead: "Bazen cevap SaaS değil — ERP'nizi, deponuzu ve CRM'inizi işletmenizin çalıştığı şekilde bağlayan entegrasyonu inşa eden bir engineer. Tek workflow için sprint, dijital-ops girişimi için proje veya teslim etmeye devam eden aylık retainer. Kaynak kodu sizde kalır.",
            ctaPrimary: "30 dakikalık scoping görüşmesi",
            ctaSecondary: "Fiyatları gör",
            features: [
              { label: "ENGAGEMENT", value: "Sprint · Proje · Retainer", sub: "İhtiyaca göre scope" },
              { label: "SAHİPLİK", value: "Kaynak kod sizde", sub: "Lock-in yok" },
              { label: "STACK", value: "Açık kaynak öncelikli", sub: "Hetzner · Postgres · Node" },
            ],
          },
          useCases: [
            { industry: "Lojistik", problem: "Depo verisi CSV olarak çıkar, finans ERP EDI yer, manuel çeviri haftada bir FTE harcar.", outcome: "Sprint bir çevirici servisi inşa etti; finans depo export'undan sonra iki dakika içinde temiz EDI alır." },
            { industry: "Real estate", problem: "Inbound lead'ler Immoscout, web form ve WhatsApp'a dağılmış; tek doğruluk kaynağı yok.", outcome: "Proje tüm kanalları HubSpot'ta deduplikasyon ve kontak zenginleştirme ile birleştirdi." },
            { industry: "Multi-entity holding", problem: "Altı bağlı şirket, altı muhasebe sistemi, aylık konsolidasyon bir hafta sürüyor.", outcome: "Retainer entegrasyon teslim etmeye devam eder: konsolidasyon artık geceleri çalışır, sabah audit-hazır." },
          ],
          integrations: ["Postgres", "Node.js / TypeScript", "Python", "n8n", "Zapier (mantıklıysa)", "Hetzner", "Custom API"],
          faq: [
            { q: "Neden sadece Zapier veya Make kullanmıyorsunuz?", a: "Kullanıyoruz — uyduğunda. Zapier ve Make basit connector'lar için yeterli; ölçekte zorlanmaya başlarlar (maliyet, debugging, güvenilirlik) ve işletmeye özel mantığı taşıyamazlar. Hangi aracın yerini hak ettiğine birlikte karar veriyoruz, gerisini biz kuruyoruz." },
            { q: "Scoping nasıl çalışır?", a: "Ücretsiz 30-dakikalık discovery görüşmesi. İki taraf da devam etmek isterse, ücretli bir scoping workshop'u (~€1.500, sözleşme imzalanırsa proje ücretinden düşülür) çalıştırırız; yazılı spec ve sabit fiyat çıkar. Her durumda spec sizinle gider." },
            { q: "Günlük tarife nedir?", a: "Senior automation engineering için günlük €1.200, yarım gün artışlarıyla faturalandırılır. Bunun altı junior iş veya tooling'de fazla ödüyorsunuz demek. İyi scope'lanmış işte proje fiyatı genelde günlük tarifeyi yener — bu €4.500'lik Standard sprint'tir." },
            { q: "AVV imzalıyor musunuz?", a: "Evet — müşteri verisine dokunan her engagement'ta standart Alman B2B AVV (Auftragsverarbeitungsvertrag). Gizli bağlam paylaşmanız gerekiyorsa scoping öncesi NDA." },
          ],
        },
      },
    },

    pricing: {
      meta: {
        title: "Fiyatlandırma — Standard, Professional, Enterprise | OpSolid",
        description: "OpSolid'in dokuz ürünü için şeffaf EUR fiyatlandırma: Voice Agent, OpSo Smart, Chatbot, WhatsApp, Booking, Email, Lead Qualifier, Custom Automation ve Kutasia.",
      },
      hero: {
        eyebrow: "[ FİYATLANDIRMA · ŞEFFAF ]",
        title: {
          pre: "Tüm dokuz ürün için ",
          italic: "tier fiyatlandırma",
          post: ".",
        },
        lead: "Standard odaklı kullanım için. Professional aktif operasyon için. Enterprise regüle ve ölçekli ortamlar için. Tek seferlik kurulum, kullanıma göre aylık ücret, gizli tier yükseltmesi yok.",
        vatNotice: "Tüm fiyatlar EUR, KDV hariç. EU-hostlu altyapı dahildir.",
      },
      labels: {
        setup: "Kurulum",
        monthly: "Aylık",
        included: "Dahil",
        overage: "Aşım",
        forWhom: "Kim için",
        primaryCta: "Başlayalım",
        enterpriseCta: "Bizimle konuşun",
        viewProduct: "Ürüne git",
        perMonth: "/ay",
        perUser: "/kullanıcı",
        perSeat: "/koltuk",
      },
      tierNames: {
        standard: "Standard",
        professional: "Professional",
        enterprise: "Enterprise",
      },
      products: [
        {
          id: "voice-agent",
          name: "Voice AI Agent",
          tagline: "Retell veya Vapi üzerinde 24/7 telefon resepsiyonu, çok dilli.",
          href: "/products/voice-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€1.500",
              monthly: "€299/ay",
              included: ["500 dakika / ay", "1 telefon numarası", "1 dil", "Mesai saatleri kapsamı", "Cal.com entegrasyonu"],
              overage: "€0,18/dk",
              forWhom: "Tek lokasyon SMB, mesai dışı taşma",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€2.500",
              monthly: "€699/ay",
              included: ["2.000 dakika / ay", "3 telefon numarası", "Çok dilli (DE / EN / TR)", "7/24 kapsam", "CRM senk. (HubSpot, Pipedrive)"],
              overage: "€0,14/dk",
              forWhom: "Sürekli inbound olan mid-market (klinik, ajans)",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€4.500",
              monthly: "€1.499/ay",
              included: ["8.000 dakika / ay", "Sınırsız numara", "Custom voice + branding", "SLA %99,9", "EU veri ikametgah sözleşmesi"],
              overage: "€0,10/dk",
              forWhom: "Yüksek hacim, regüle sektörler",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "verso",
          name: "OpSo Smart",
          tagline: "Dijital kartvizitinizi kendiniz oluşturun, ücretsiz",
          href: "/products/digital-card",
          tiers: [
            {
              name: "Free",
              setup: "€0",
              monthly: "€0",
              included: ["Tüm şablonlar, düzenler & temalar", "Link + QR kod (PNG + SVG)", "Kişilere kaydet (vCard)", "opsolid.de/c/adiniz üzerinde barındırma", "Küçük 'Made with OpSo Smart' rozeti"],
              overage: "",
              forWhom: "Solo, freelancer, danışman",
              isHighlighted: false,
            },
            {
              name: "Premium",
              setup: "€149 tek seferlik",
              monthly: "1. yıldan sonra €9/yıl hosting",
              included: ["Free'deki her şey, rozet kaldırıldı", "Özel slug veya kendi alan adınız", "WhatsApp paylaşım butonu", "Analitik (görüntüleme + tıklama)", "Lead toplama + CRM webhook"],
              overage: "",
              forWhom: "Alan adı & analitik isteyen profesyoneller",
              isHighlighted: true,
            },
            {
              name: "White-glove",
              setup: "€299'dan başlayan",
              monthly: "teklifli",
              included: ["Kartınızı 48 saatte elle tasarlarız", "Sınırsız revizyon", "Çoklu dil (DE / EN / TR)", "Ekip kurulumu", "Öncelikli destek"],
              overage: "",
              forWhom: "Sizin için yapılmasını isteyenler",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "chatbot-agent",
          name: "Chatbot Agent",
          tagline: "Web chat + KB ingestion + lead capture, insana devir.",
          href: "/products/chatbot-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€750",
              monthly: "€149/ay",
              included: ["1 site", "500 konuşma / ay", "Knowledge base 50 dokümana kadar", "Mesai saatlerinde devir", "E-mail + ticket capture"],
              overage: "€0,40 / konuşma",
              forWhom: "Küçük site, lead capture odaklı",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1.500",
              monthly: "€399/ay",
              included: ["3 site", "2.500 konuşma / ay", "Sınırsız KB dokümanı", "7/24 devir", "CRM senk."],
              overage: "€0,30 / konuşma",
              forWhom: "Aktif funnel'i olan mid-market",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€3.000",
              monthly: "€999/ay",
              included: ["Sınırsız site", "10.000 konuşma / ay", "Çok dilli", "SLA + audit log", "Custom voice + tone training"],
              overage: "€0,20 / konuşma",
              forWhom: "Yüksek trafikli e-ticaret / B2B SaaS",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "whatsapp-agent",
          name: "WhatsApp Agent",
          tagline: "WhatsApp Business API — otomatik yanıt, broadcast, devir.",
          href: "/products/whatsapp-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€900",
              monthly: "€199/ay",
              included: ["1 WABA numarası", "3 kullanıcı", "1.000 konuşma / ay", "Şablon + broadcast", "Lead capture flow"],
              overage: "Meta passthrough + €0,02 / mesaj",
              forWhom: "Lokal işletmeler, tek kanal",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1.800",
              monthly: "€499/ay",
              included: ["1 WABA numarası", "10 kullanıcı", "5.000 konuşma / ay", "Otomasyon flow'ları", "CRM senk."],
              overage: "Meta passthrough + €0,015 / mesaj",
              forWhom: "Mid-market servis operasyonu",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€3.500",
              monthly: "€1.299/ay",
              included: ["3+ WABA numarası", "Sınırsız kullanıcı", "20.000 konuşma / ay", "Çok takımlı routing", "SLA"],
              overage: "Sadece Meta passthrough (markup yok)",
              forWhom: "Yüksek hacim retail / multi-brand",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "booking-agent",
          name: "Booking Agent",
          tagline: "Web / voice / WhatsApp randevu → Cal.com → hatırlatma → no-show recovery.",
          href: "/products/booking-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€500",
              monthly: "€99/ay",
              included: ["Web booking widget", "Cal.com senk.", "E-mail + SMS hatırlatma", "1 takvim", "Aylık 100 booking'e kadar"],
              overage: "",
              forWhom: "Solo pratisyen / küçük takım",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1.200",
              monthly: "€299/ay",
              included: ["10 takvime kadar", "Voice + WhatsApp + web intake", "No-show recovery flow", "Intake formları", "Custom hatırlatma"],
              overage: "",
              forWhom: "Çok personelli servis işletmesi",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€2.500",
              monthly: "€699/ay",
              included: ["Sınırsız takvim", "Custom workflow", "Depozito (Stripe)", "Multi-lokasyon", "SLA"],
              overage: "",
              forWhom: "Klinikler, multi-şube operasyonları",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "email-agent",
          name: "Email Agent",
          tagline: "Inbox triage, otomatik yanıt, eskalasyon, CRM logging.",
          href: "/products/email-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€600",
              monthly: "€39/koltuk/ay",
              included: ["1 paylaşılan inbox", "AI triage + otomatik yanıt", "500 e-mail / koltuk / ay", "Temel CRM log", "Slack bildirim"],
              overage: "€0,05 / e-mail",
              forWhom: "Küçük operasyon takımı",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€1.200",
              monthly: "€69/koltuk/ay",
              included: ["3 inbox", "Eskalasyon kuralları", "2.000 e-mail / koltuk / ay", "HubSpot / Pipedrive senk.", "Custom yanıt şablonu"],
              overage: "€0,04 / e-mail",
              forWhom: "Mid-market servis masası",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€2.500",
              monthly: "€99/koltuk/ay",
              included: ["Sınırsız inbox", "Custom routing kuralları", "Audit log + SLA", "EU DPA dahil", "Adanmış success manager"],
              overage: "€0,03 / e-mail",
              forWhom: "Regüle / yüksek hacim",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "lead-qualifier-agent",
          name: "Lead Qualifier Agent",
          tagline: "Form / chat / voice intake → BANT scoring → CRM push.",
          href: "/products/lead-qualifier-agent",
          tiers: [
            {
              name: "Standard",
              setup: "€1.000",
              monthly: "€249/ay",
              included: ["250 nitelikli lead / ay", "Form + chat intake", "BANT scoring", "CRM push (HubSpot, Pipedrive)", "Slack alert"],
              overage: "€1,50 / lead",
              forWhom: "Outbound-hafif B2B",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€2.000",
              monthly: "€599/ay",
              included: ["1.000 nitelikli lead / ay", "Voice + chat + form intake", "Custom scoring modeli", "Routing kuralları", "Haftalık özet"],
              overage: "€1,00 / lead",
              forWhom: "Aktif SDR-destekli takım",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "€4.000",
              monthly: "€1.499/ay",
              included: ["4.000 nitelikli lead / ay", "Multi-kanal intake", "Account-tabanlı scoring", "SLA", "Custom entegrasyon"],
              overage: "€0,60 / lead",
              forWhom: "Sales-led mid-market",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "custom-automation",
          name: "Custom Automation",
          tagline: "Workflow inşa — sprint, proje veya retainer. SaaS değil.",
          href: "/products/custom-automation",
          tiers: [
            {
              name: "Standard",
              setup: "€4.500 sabit (sprint)",
              monthly: "—",
              included: ["1 workflow uçtan uca inşa", "Scoping + build + 30 gün destek", "3 entegrasyona kadar", "Dokümantasyon + devir", "Kaynak kodu sizde"],
              overage: "",
              forWhom: "Tek, iyi tanımlı acı noktası",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "€12.000 sabit (proje) — veya €1.200/gün",
              monthly: "—",
              included: ["3–5 workflow", "Discovery workshop", "Build + 90 gün destek", "Entegrasyon + custom kod", "Ops dashboard"],
              overage: "",
              forWhom: "Mid-market dijital ops projesi",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "—",
              monthly: "€4.500/ay (12 ay min süre)",
              included: ["Adanmış automation engineer 4 gün / ay", "Scope dahili sınırsız workflow", "Çeyreklik review", "Olaylarda öncelik", "Roadmap işbirliği"],
              overage: "",
              forWhom: "Sürekli dönüşüm partneri",
              isHighlighted: false,
            },
          ],
        },
        {
          id: "kutasia",
          name: "Kutasia",
          tagline: "Unified AI çalışma alanı — WhatsApp, Telegram, e-posta ve Voice tek inbox'ta, hero otomasyonlar ve fuar-test edilmiş demo modu ile.",
          href: "/products/kutasia",
          tiers: [
            {
              name: "Starter",
              setup: "€500",
              monthly: "€79/ay",
              included: ["1 kanal (WhatsApp, Telegram veya e-posta)", "Ayda 500 AI konuşma", "1 kullanıcı", "Unified inbox + AI özet", "Sesli not transkripsiyonu (Whisper)"],
              overage: "Ek konuşma €0,06",
              forWhom: "Solo operatör veya tek lokasyon KOBİ",
              isHighlighted: false,
            },
            {
              name: "Growth",
              setup: "€1.200",
              monthly: "€179/ay",
              included: ["3 kanal (WA + TG + e-posta)", "Ayda 2.000 AI konuşma", "5 kullanıcı", "5 hero playbook aktif", "Çok dilli triyaj + AI taslakları"],
              overage: "Ek konuşma €0,05",
              forWhom: "Günlük müşteri operasyonu olan aktif KOBİ",
              isHighlighted: true,
            },
            {
              name: "Scale",
              setup: "€2.500",
              monthly: "€379/ay",
              included: ["Tüm kanallar + Voice (300 dk)", "Ayda 8.000 AI konuşma", "Sınırsız kullanıcı", "Özel playbook + otomasyonlar", "WhatsApp BSP ücreti pass-through (markup yok)"],
              overage: "Ek konuşma €0,04 · Ek Voice dk €0,18",
              forWhom: "Multi-staff operasyonlar, günlük+ hacim",
              isHighlighted: false,
            },
          ],
        },
      ],
      bundles: {
        eyebrow: "[ BUNDLE & YILLIK ]",
        heading: "Tasarrufu üst üste koyun",
        lead: "Birden fazla ürün satın alın veya yıllık ödeyin, fatura otomatik düşer. İndirimler birbiriyle kombinlenebilir.",
        items: [
          { rule: "2 ürün", benefit: "Birleşik aylık ücretten −%10" },
          { rule: "3+ ürün", benefit: "Aylık ücretten −%15 + 3 ay ücretsiz tier yükseltmesi" },
          { rule: "Yıllık peşin ödeme", benefit: "−%15 (her ürün, her tier)" },
          { rule: "OpSo Smart takımı (50+ koltuk) bir agent ile bundle", benefit: "OpSo Smart koltuk fiyatı €4/kullanıcı/ay'a düşer" },
          { rule: "Custom Automation retainer müşterileri", benefit: "Tüm SaaS ürünlerinde −%20" },
        ],
        note: "İndirimler sadece aylık ücretlere uygulanır. Setup ücreti sabit kalır. Yıllık peşin ödeme iade edilemez; aylık tierlar 30 gün önceden iptal edilebilir.",
      },
      footnote: "Tüm fiyatlar EUR, KDV hariç. EU dışı müşteriler reverse charge ile KDV'siz faturalandırılır. EU-hostlu altyapı (Hetzner / IONOS Frankfurt) her tier'da dahildir.",
    },
  },
  card: {
    send: {
      triggerLabel: "Bilgilerimi gönder",
      modalTitle: "Bilgilerimi gönder",
      modalSubtitle:
        "İletişim bilgilerini bırak, kart sahibi sana ulaşsın.",
      submitLabel: "Gönder",
      submittingLabel: "Gönderiliyor…",
      closeLabel: "Kapat",
      successTitle: "Teşekkürler!",
      successBody: "Bilgilerin gönderildi. Kısa süre içinde dönüş yapılacak.",
      successCloseLabel: "Kapat",
      consentRequired: "Lütfen gizlilik onayını işaretle.",
      submitFailed: "Gönderilemedi. Daha sonra tekrar dene.",
      networkError: "Bağlantı hatası. Tekrar dene.",
      nameLabel: "Ad Soyad",
      phoneLabel: "Telefon",
      emailLabel: "E-posta",
      companyLabel: "Şirket",
      meetingContextLabel: "Nerede tanıştık?",
      meetingContextPh: "Fuar, LinkedIn, tavsiye …",
      interestLabel: "İlgi / konu",
      messageLabel: "Mesaj",
      messagePh: "Kısaca konu nedir?",
      consentText:
        "Bilgilerimin iletişim amacıyla işlenmesini onaylıyorum (KVKK / GDPR).",
      requiredMark: "*",
    },
    qr: {
      triggerLabel: "QR'ı göster",
      modalTitle: "Tara veya paylaş",
      modalSubtitle: "Telefon kamerası ile tara ya da linki paylaş.",
      copyLabel: "Linki kopyala",
      copiedLabel: "Kopyalandı",
      shareLabel: "Paylaş",
      downloadLabel: "QR'ı indir",
      closeLabel: "Kapat",
    },
    contribute: {
      triggerLabel: "Fotoğraf gönder",
      modalTitle: "Fotoğraf gönder",
      modalSubtitle:
        "Gönderdiğin fotoğraf önce kart sahibi tarafından onaylanır.",
      nameLabel: "Adın",
      emailLabel: "E-posta (opsiyonel)",
      messageLabel: "Mesaj (opsiyonel)",
      messagePh: "Fotoğrafa eşlik eden kısa not.",
      photoLabel: "Fotoğraf",
      photoHint: "JPG, PNG veya WebP · maks 5 MB",
      submitLabel: "Gönder",
      submittingLabel: "Gönderiliyor…",
      successTitle: "Teşekkürler!",
      successBody: "Sahibine ilettik. Onaylandığında kartta görünecek.",
      consentText: "Bu fotoğrafı paylaşma hakkına sahip olduğumu onaylıyorum.",
      consentRequired: "Lütfen onayı işaretle.",
      tooLargeError: "Dosya çok büyük (maks 5 MB).",
      wrongTypeError: "Desteklenmeyen format. JPG, PNG veya WebP kullan.",
      genericError: "Gönderilemedi. Daha sonra tekrar dene.",
      rateLimited: "Çok fazla gönderim. Daha sonra tekrar dene.",
    },
    wallet: {
      notConfigured:
        "Wallet desteği yapılandırılıyor. Etkinleştirildiğinde Apple/Google Wallet butonları görünecek.",
    },
    vcard: {
      label: "Rehbere kaydet",
    },
    share: {
      title: "Kartı paylaş",
      close: "Kapat",
      qrDownload: "QR indir",
      copyLink: "Linki kopyala",
      copied: "Kopyalandı!",
      whatsapp: "WhatsApp'ta paylaş",
      whatsappHint: "Linkinle birlikte büyük bir kart görseli gönderir",
      storyDownload: "Kart görseli (9:16)",
      storyHint: "WhatsApp durumu ve Instagram story için",
      vcardVisitor: "Kişiyi kaydet",
      vcardOwner: "vCard'ım (.vcf)",
      vcardOwnerHint: "İlet — karşı taraf seni rehberine kaydeder",
      emailSignature: "E-posta imzası",
      copy: "Kopyala",
      openCard: "Kartı aç",
      shareButtonAriaLabel: "Kartı paylaş",
    },
    error: {
      title: "Bu kart şu an açılamıyor",
      body: "Kart verisi yüklenemedi. Birkaç saniye sonra yeniden dene.",
      retry: "Yeniden dene",
    },
    owner: {
      banner:
        "Bu kartın sahibi sensin — değişiklikler kaydedildiğinde anında yayınlanır.",
      publicBannerLabel: "Senin kartın",
      editLabel: "Düzenle",
      previewLabel: "Önizleme modu",
      shareLabel: "Linki paylaş",
      manageLabel: "İstatistik ve linkler",
    },
    manage: {
      title: "Kart yönetimi",
      subtitle:
        "Kartın için istatistikler, paylaşım linkleri ve lead'ler — hepsi tek yerde.",
      backToCard: "Kartı görüntüle",
      editCard: "Kartı düzenle",
      statsHeading: "Son 30 gün",
      statViews: "Görüntülenme",
      statLeads: "Lead",
      statSaves: "Kaydedilme",
      statShares: "Paylaşım",
      statScans: "Link taraması",
      linksHeading: "Paylaşım linkleri",
      linksHint:
        "Her kanal için ayrı bir kısa link oluştur — baskıdaki QR, e-posta imzası, Instagram bio — hangi kanalın ziyaretçi getirdiğini gör.",
      linkLabelPlaceholder: "Etiket (örn. Fuar QR)",
      linkCodePlaceholder: "Özel kod (isteğe bağlı)",
      linkSourcePlaceholder: "Kaynak (örn. instagram)",
      linkCampaignPlaceholder: "Kampanya (isteğe bağlı)",
      createLink: "Link oluştur",
      creating: "Oluşturuluyor…",
      linkLimitReached: "Bu kart için link limitine ulaşıldı.",
      codeUnavailable: "Bu kod alınmış veya geçersiz — başka bir kod dene.",
      linkCreateFailed: "Link oluşturulamadı. Lütfen tekrar dene.",
      scansLabel: "tarama",
      activeLabel: "Aktif",
      inactiveLabel: "Kapalı",
      copyLabel: "Kopyala",
      copiedLabel: "Kopyalandı",
      qrLabel: "QR",
      disableLabel: "Kapat",
      enableLabel: "Aç",
      noLinksYet:
        "Henüz paylaşım linki yok. Kart URL'in her zaman çalışır — kısa linkler kanal bazlı takip ekler.",
      leadsHeading: "Lead'ler",
      leadsHint: "Kartın üzerinden iletişim bilgisini paylaşan kişiler.",
      noLeadsYet:
        "Henüz lead yok. Biri kartında “Bilgilerimi gönder”i kullandığında burada görünür.",
      leadStatusNew: "Yeni",
      leadStatusContacted: "İletişime geçildi",
      leadStatusQualified: "Nitelikli",
      leadStatusArchived: "Arşivlendi",
      notPublished:
        "Bu kart henüz yayınlanmadı — linkler ve istatistikler kart yayına girince aktifleşir.",
      publicLinkLabel: "Halka açık kart linkin — paylaşacağın link bu",
      publicLinkHint:
        "Bu linke sahip herkes kartını görür. Sohbetlere, e-posta imzana, QR kodlara koy.",
      privateLinkLabel: "Özel linklerin — sadece sende kalsın",
      privateLinkHint:
        "Bu yönetim sayfası ve düzenleme sayfan özeldir: linklerine sahip olan herkes kartını değiştirebilir. Kart e-postanda duruyorlar — asla paylaşma.",
    },
    eventDirectory: {
      eyebrow: "Katılımcı rehberi",
      ctaTitle: "Sen de mi katılıyorsun? Kartını oluştur.",
      ctaBody:
        "Ücretsiz, hesap gerekmez — kartın dakikalar içinde yayında olur ve bu listede görünürsün.",
      ctaButton: "Kartımı oluştur",
      participantsHeading: "Katılımcılar",
      participantsHint:
        "Sahipleri herkese açık listelenmeyi seçen kartlar. Birine dokunarak kişiyi görüntüle ve rehberine kaydet.",
      emptyState:
        "Henüz listelenen katılımcı yok — ilk sen ol: kartını oluştur ve rehbere katıl.",
      searchPlaceholder: "İsim, şirket veya unvana göre ara…",
      noResults: "Aramanla eşleşen katılımcı yok.",
    },
    mobileAppSoon:
      "Mobil uygulama yakında — kartını yolda da oluştur ve yönet. Bugün her şey tarayıcıda çalışıyor.",
    quickCreate: {
      title: "60 saniyede kartın hazır",
      subtitle:
        "Beş alan, tek buton — dijital kartvizitin anında yayında. Ücretsiz, hesap gerekmez.",
      nameLabel: "Ad soyad",
      titleLabel: "Unvan",
      companyLabel: "Şirket",
      phoneLabel: "Telefon",
      emailLabel: "E-posta",
      emailHint:
        "Özel düzenleme ve yönetim linklerin bu adrese gider — kontrol etmeyi unutma.",
      photoLabel: "Fotoğraf ekle (isteğe bağlı)",
      photoChange: "Fotoğrafı değiştir",
      photoHint: "JPG, PNG veya WebP",
      photoError:
        "Fotoğraf yüklenemedi — daha sonra düzenleyiciden ekleyebilirsin.",
      submit: "Kartımı oluştur — ücretsiz",
      submitting: "Oluşturuluyor…",
      errorRequired: "Ad, telefon ve e-posta zorunlu.",
      errorGeneric: "Bir şeyler ters gitti. Lütfen tekrar dene.",
      designSectionLabel: "Tasarım",
      designClassic: "Klasik",
      designModern: "Modern",
      designVisual: "Görsel",
      designHint:
        "Bir başlangıç görünümü seç — tasarımı ve detayları istediğin zaman değiştirebilirsin.",
      logoLabel: "Logo ekle (opsiyonel)",
      logoChange: "Logoyu değiştir",
      logoHint: "Şeffaf PNG en iyi sonucu verir",
      socialSectionLabel: "Sosyal medya (opsiyonel)",
      linkedinLabel: "LinkedIn URL",
      instagramLabel: "Instagram URL",
      xLabel: "X (Twitter) URL",
      youtubeLabel: "YouTube URL",
      facebookLabel: "Facebook URL",
      tiktokLabel: "TikTok URL",
      moreToggle: "Daha fazla bilgi",
      whatsappLabel: "WhatsApp numarası",
      websiteLabel: "Web sitesi",
      addressLabel: "Adres",
      bioLabel: "Kısa bio",
      videoLabel: "YouTube / Vimeo video URL",
      fullFormLink: "Tüm seçenekler için detaylı formu kullan",
    },
    ownerWelcome: {
      title: "Kartın yayında!",
      step1Title: "Paylaş",
      step1Body:
        "Paylaş butonunu kullan — halka açık linkini, QR'ını veya WhatsApp'ta büyük kart görselini gönderir.",
      step2Title: "E-postanı kontrol et",
      step2Body:
        "Özel düzenleme ve yönetim linklerin orada. Kimseyle paylaşma — kartının kontrolü onlarda.",
      step3Title: "Etkisini izle",
      step3Body:
        "Görüntülenmeler, gelen kişiler ve kanal bazlı kısa linkler yönetim sayfanda.",
      manageCta: "İstatistik ve linkler",
      loginCta: "Giriş yap, tüm kartlarını yönet",
      loginBody:
        "Bu e-postayla giriş yaparsan tüm kartlarını her cihazdan yönetebilirsin.",
      dismiss: "Anladım",
    },
    languageSwitcher: "Dil",
  },

  auth: {
    signup: {
      title: "Hesap oluştur",
      subtitle: "Ücretsiz dijital kartvizit — kredi kartı gerekmez.",
      emailLabel: "E-posta adresi",
      nameLabel: "Ad (isteğe bağlı)",
      passwordLabel: "Şifre",
      magicLinkCta: "Sihirli bağlantı gönder",
      passwordCta: "veya şifre ile devam et",
      alreadyHaveAccount: "Zaten hesabınız var mı?",
      signInLink: "Giriş yap",
      expandPassword: "+ şifre ekle",
    },
    login: {
      title: "Tekrar hoş geldiniz",
      subtitle: "Dijital kartvizitlerinizi yönetmek için giriş yapın.",
      emailLabel: "E-posta adresi",
      passwordLabel: "Şifre",
      magicLinkCta: "Sihirli bağlantı gönder",
      passwordCta: "veya şifre kullan",
      dontHaveAccount: "Hesabınız yok mu?",
      signUpLink: "Hesap oluştur",
      expandPassword: "+ şifre kullan",
      orDivider: "veya",
      googleCta: "Google ile devam et",
    },
    magicLink: {
      title: "Gelen kutunuzu kontrol edin",
      subtitle: "Giriş bağlantısı gönderildi:",
      resendCta: "Bağlantıyı yeniden gönder",
      sentToEmail: "Bağlantı gönderildi:",
      resendCooldown: "Yeniden gönderme",
      seconds: "saniye sonra mevcut",
      backToLogin: "Giriş sayfasına dön",
    },
    verify: {
      verifying: "Bağlantı doğrulanıyor…",
      successTitle: "Giriş yapıldı",
      successBody: "Yönlendiriliyorsunuz…",
      errorTitle: "Bağlantı süresi doldu veya geçersiz",
      errorBody: "Bu sihirli bağlantı zaten kullanılmış veya süresi dolmuş. Lütfen yeni bir tane isteyin.",
      requestNewLink: "Yeni bağlantı iste",
    },
    errors: {
      invalid_email: "Lütfen geçerli bir e-posta adresi girin.",
      weak_password: "Şifre en az 12 karakter olmalı ve en az bir harf ve bir rakam içermelidir.",
      email_in_use: "Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.",
      invalid_credentials: "Geçersiz e-posta veya şifre.",
      rate_limited: "Çok fazla istek — lütfen birkaç dakika bekleyip tekrar deneyin.",
      generic: "Bir şeyler yanlış gitti. Lütfen tekrar deneyin.",
      invalid_input: "Lütfen girişinizi kontrol edip tekrar deneyin.",
      email_unavailable: "Bu e-posta kayıt için kullanılamaz.",
    },
  },

  dashboard: {
    cards: {
      title: "Kartlarım",
      subtitle: "Dijital kartvizitlerinizi yönetin ve paylaşın.",
      createNewCta: "Yeni kart oluştur",
      emptyTitle: "Henüz kart yok",
      emptyHint: "ilk dijital kartvizitinizi oluşturun ve saniyeler içinde iletişim bilgilerinizi paylaşın.",
      emptyCta: "ilk kartınızı oluşturun",
    },
    cardItem: {
      editCta: "Düzenle",
      shareCta: "Bağlantıyı kopyala",
      deleteCta: "Sil",
      deleteConfirm: "Bu kart silinsin mi?",
      viewCountLabel: "Görüntüleme",
      statusPublished: "Yayınlandı",
      statusDraft: "Taslak",
      statusDeleted: "Arşivlendi",
    },
    chrome: {
      logoutCta: "çıkış Yap",
      settingsCta: "Ayarlar",
    },
    claim: {
      bannerTitle: "E-posta adresiniz altında kartlar bulduk.",
      bannerHint: "Burada yönetmek için bunları hesabınıza bağlayın.",
      claimCta: "Bu kartı sahiplen",
      claimingState: "Bağlanıyor…",
      claimedState: "Bağlandı",
    },
  },

  onboarding: {
    cancel: "Vazgeç",
    back: "Geri",
    next: "Devam et",
    steps: {
      industry: "Sektör",
      personal: "Hakkınızda",
      preview: "Önizle ve yayınla",
    },
    industry: {
      title: "Nasıl bir kart hazırlıyorsunuz?",
      subtitle:
        "Bir sektör seçin — size uygun bir tasarım ve uyumlu bir renk paleti ile başlayalım. Her şeyi sonradan değiştirebilirsiniz.",
      surpriseMe: "Sürpriz olsun",
      categories: {
        architecture: "Mimarlık",
        legal: "Hukuk",
        restaurant: "Restoran",
        photography: "Fotoğrafçılık",
        clinic: "Sağlık",
        music: "Müzik",
        barber: "Berber & güzellik",
        retail: "Perakende",
        realEstate: "Gayrimenkul",
        fitness: "Fitness",
        hospitality: "Konaklama",
        consulting: "Danışmanlık",
        tech: "Teknoloji",
        events: "Etkinlik",
        dentist: "Diş hekimi",
        psychologist: "Psikoloji",
        beauty: "Güzellik salonu",
        accounting: "Muhasebe",
        software: "Yazılım",
        contentCreator: "İçerik üretici",
        wellness: "Wellness",
        eventPlanner: "Organizasyon",
        auto: "Otomotiv",
        interior: "İç mimari",
      },
      descriptions: {
        architecture: "Sade çizgiler, taş paleti",
        legal: "Otoriter, serif tipografi",
        restaurant: "Sıcak, iştah açıcı",
        photography: "Editöryel, görsel ağırlıklı",
        clinic: "Sakin, güven veren",
        music: "Cesur, yüksek kontrast",
        barber: "Net, maskülen ızgara",
        retail: "Ürün odaklı, yaşam stili",
        realEstate: "Premium lacivert ve altın",
        fitness: "Enerjik, atletik",
        hospitality: "Şık, butik hissi",
        consulting: "Editöryel, yönetici",
        tech: "Net, hassas, modern",
        events: "Şenlikli, kutlama havası",
        dentist: "Aydınlık, dostane klinik",
        psychologist: "Yumuşak, samimi",
        beauty: "Zarif, pürüzsüz",
        accounting: "Güvenilir, düzenli",
        software: "Geliştirici dostu, mono",
        contentCreator: "Canlı, kişilikli",
        wellness: "Sakin, organik palet",
        eventPlanner: "Romantik, törensel",
        auto: "Cesur, performans odaklı",
        interior: "Sıcak, dokulu nötrler",
      },
    },
    personal: {
      title: "Kendinizden bahsedin",
      subtitle:
        "Bildiklerimizi sizin için doldurduk. Ünvan ve telefon ekleyin — gerisi isteğe bağlı.",
      nameLabel: "Ad Soyad",
      namePlaceholder: "Ayşe Yıldız",
      titleLabel: "Ünvan",
      titlePlaceholder: "Kurucu & Tasarımcı",
      emailLabel: "E-posta",
      emailHint: "Hesabınıza bağlı — sonradan ayarlardan değiştirebilirsiniz.",
      phoneLabel: "Telefon",
      companyLabel: "Şirket",
      companyPlaceholder: "Atölye Kuzey",
      bioLabel: "Kısa biyografi",
      bioPlaceholder: "Sizi tanıtan bir-iki cümle.",
      photoLabel: "Profil fotoğrafı",
      photoCta: "Fotoğrafı buraya bırakın",
      photoHint: "Sürükleyin veya tıklayın — JPG/PNG, en fazla 5MB",
      photoBrowse: "Dosya seç",
      photoUploading: "Yükleniyor…",
      photoUploaded: "Fotoğraf yüklendi",
      photoChange: "Değiştirmek için çöp simgesine tıklayın",
      photoRemove: "Fotoğrafı kaldır",
      brandColorLabel: "Marka rengi",
      skipCta: "Atla ve bitir",
    },
    preview: {
      title: "Az kaldı — son bir kontrol",
      subtitle:
        "Sağda kartınızı inceleyin ve paylaşmak istediğiniz adresi seçin.",
      slugLabel: "Kart adresi",
      slugChecking: "Kontrol ediliyor…",
      slugAvailable: "Uygun",
      slugTaken: "Dolu",
      slugTakenHint: "Bu adres alınmış — bir varyasyon deneyin.",
      slugReset: "Varsayılana sıfırla",
      summaryName: "İsim",
      summaryTitle: "Ünvan",
      summaryCompany: "Şirket",
      summaryPhone: "Telefon",
      summaryEmail: "E-posta",
      livePreviewLabel: "Canlı önizleme",
      previewFallbackName: "İsminiz",
      publishCta: "Kartı yayınla",
      publishingState: "Yayınlanıyor…",
      draftCta: "Taslak olarak kaydet",
      draftingState: "Kaydediliyor…",
    },
    errors: {
      name_too_short: "İsim en az 2 karakter olmalı.",
      name_too_long: "İsim çok uzun.",
      title_required: "Ünvan ekleyin (veya 'Atla ve bitir' tuşuna basın).",
      phone_invalid: "Bu telefon numarası doğru görünmüyor.",
      brand_invalid: "6 haneli hex kullanın (örn. #1a365d).",
      slug_invalid:
        "En az 3 karakter: küçük harf, rakam ve tire kullanılabilir.",
      slug_taken: "Bu adres zaten alınmış — lütfen başka bir adres seçin.",
      upload_failed: "Yükleme başarısız — lütfen başka bir dosya deneyin.",
      upload_too_large: "Bu görsel 5MB'tan büyük — daha küçük bir görsel deneyin.",
      network_error:
        "Bir şeyler ters gitti — bağlantınızı kontrol edin ve tekrar deneyin.",
    },
  },
} as const;
