// =============================================================================
// TURKISH CONTENT (Türkçe)
// Tüm metinler doğal iş Türkçesinde. Yapı en.ts ile birebir aynı.
// =============================================================================

import type { Content } from "./en";

export const content: Content = {
  nav: {
    solutions: "Çözümler",
    useCases: "Kullanım Alanları",
    about: "Hakkımızda",
    contact: "İletişim",
    cta: "Bize Ulaşın",
    blog: "Blog",
    faq: "SSS",
  },

  home: {
    hero: {
      headline: "Yapay Zeka Destekli Otomasyon\nModern İşletmeler İçin",
      subheadline:
        "Yeni nesil yapay zeka ajanlarını ve otomasyon sistemlerini operasyonlarınıza entegre ediyoruz — manuel işleri akıllı, kendi kendine çalışan iş akışlarıyla değiştirerek işletmenizi her zaman bir adım önde tutuyoruz.",
      primaryCta: "Ücretsiz Görüşme Planlayın",
      secondaryCta: "Çözümleri Keşfedin",
      stats: [
        { value: "%80", label: "Daha Az Manuel İş" },
        { value: "3x", label: "Daha Hızlı Süreçler" },
        { value: "7/24", label: "Yapay Zeka Destekli Operasyonlar" },
      ],
    },

    capabilities: [
      "Yapay Zeka Ajan Entegrasyonu",
      "Süreç Otomasyonu",
      "Sistem Entegrasyonu",
      "İş Akışı Mühendisliği",
      "Akıllı Chatbot'lar",
      "Yeni Nesil Yapay Zeka Çözümleri",
    ],

    whatWeDo: {
      label: "Ne Yapıyoruz",
      headline: "Yapay zeka ve otomasyonu iş süreçlerinize taşıyoruz",
      description:
        "Dünya hızla değişiyor — yapay zeka ajanları, akıllı otomasyon ve bağlantılı sistemler artık bir tercih değil, zorunluluk. En son yapay zeka teknolojilerini ve otomasyon platformlarını operasyonlarınıza entegre ediyoruz, böylece işletmeniz rekabetçi, verimli ve geleceğe hazır kalıyor.",
      points: [
        "Görevleri otonom olarak yürüten yapay zeka ajanları kurun",
        "n8n ve Make ile karmaşık iş akışlarını otomatize edin",
        "Tüm araçlarınızı akıllı sistemlere bağlayın",
        "Yeni nesil yapay zeka teknolojisiyle öne geçin",
      ],
    },

    solutions: {
      label: "Çözümler",
      headline: "Neler inşa ediyoruz",
      items: [
        {
          title: "Süreç Otomasyonu",
          description:
            "Manuel adımları güvenilir otomatik iş akışlarıyla değiştirin — veri girişinden onaylara, bildirimlerden raporlamaya. n8n, özel betikler ve API orkestrasyonu ile desteklenir.",
          icon: "workflow",
        },
        {
          title: "Dahili Araçlar",
          description:
            "Ekibinizin gerçek çalışma şekline uygun özel panolar, yönetim arayüzleri ve operasyonel araçlar.",
          icon: "layout",
        },
        {
          title: "İş Akışı Orkestrasyonu",
          description:
            "İnsanları, süreçleri ve kararları izlenebilir, tekrarlanabilir sistemlerle birbirine bağlayan uçtan uca orkestrasyon.",
          icon: "gitBranch",
        },
        {
          title: "Sistem Entegrasyonu",
          description:
            "CRM, ERP, depo, veritabanları ve iletişim araçlarınızı tek bir senkronize operasyonel katmanda birleştirin.",
          icon: "plug",
        },
        {
          title: "Pazarlama ve Satış Otomasyonu",
          description:
            "Otomatik potansiyel müşteri yakalama, takip dizileri, CRM güncellemeleri, YouTube içerik operasyonları ve kampanya takibi.",
          icon: "target",
        },
        {
          title: "Kargo ve Sipariş Operasyonları",
          description:
            "Otomatik sipariş işleme, kargo entegrasyonu ve sevkiyat iş akışları — sistemlerimizin anında yatırım getirisi sağladığı alanlardan biri.",
          icon: "package",
        },
        {
          title: "Mesajlaşma ve İletişim",
          description:
            "WhatsApp, Telegram, e-posta ve SMS üzerinden müşteri iletişimini otomatize edin — destek taleplerinden işlemsel bildirimlere kadar.",
          icon: "messageSquare",
        },
        {
          title: "Yapay Zeka Ajanları & Sesli Asistanlar",
          description:
            "Gelen ve giden sesli aramalar, müşteri desteği, potansiyel müşteri değerlendirmesi ve otonom görev yürütme için akıllı yapay zeka ajanları. İşbirliği yapan, muhakeme eden ve harekete geçen çoklu ajan sistemleri — en son temel modellerle güçlendirildi.",
          icon: "bot",
        },
      ],
    },

    transformation: {
      label: "Dönüşüm",
      headline: "Manuel yükten operasyonel netliğe",
      items: [
        {
          before: "Manuel e-postalar ve takipler",
          after: "Akıllı bildirimlerle otomatik iş akışları",
        },
        {
          before: "Tablo tabanlı takip",
          after: "Gerçek zamanlı veriye sahip bağlantılı sistemler",
        },
        {
          before: "Tekrarlayan veri girişi",
          after: "Güvenilir, hatasız süreçler",
        },
        {
          before: "Parçalanmış, birbirinden kopuk araçlar",
          after: "Platformlar arası entegre operasyonlar",
        },
        {
          before: "WhatsApp, e-posta ve telefonda kaçırılan mesajlar",
          after: "Tüm kanallarda birleşik, otomatik iletişim",
        },
        {
          before: "Manuel takipler ve potansiyel müşteri izleme",
          after: "Akıllı yönlendirmeli otomatik satış hattı",
        },
      ],
    },

    useCases: {
      label: "Kullanım Alanları",
      headline: "Sonuç ürettiğimiz alanlar",
      items: [
        {
          title: "Kargo ve Sipariş Operasyonları",
          description:
            "Sipariş alımı, etiket oluşturma, kargo seçimi ve takip güncellemelerini otomatize edin.",
        },
        {
          title: "Belge İşleme",
          description:
            "Faturaları, sözleşmeleri ve formları otomatik olarak çıkarın, sınıflandırın ve yönlendirin.",
        },
        {
          title: "Dahili Onaylar",
          description:
            "Satın alma, sözleşme ve bütçe talepleri için yapılandırılmış onay iş akışları.",
        },
        {
          title: "Raporlama ve Panolar",
          description:
            "Birden fazla kaynaktan verileri otomatik olarak birleştiren canlı panolar.",
        },
        {
          title: "Müşteri Operasyonları",
          description:
            "Müşteri alıştırma, destek yönlendirme ve müşteri iletişimini düzenleyin.",
        },
        {
          title: "WhatsApp ve Telegram Otomasyonu",
          description:
            "Kanallar arası otomatik mesajlaşma, destek botları ve işlemsel bildirimler.",
        },
        {
          title: "Yapay Zeka Sesli ve Sohbet Asistanları",
          description:
            "Gelen aramaları karşılayan, soruları yanıtlayan ve talepleri yönlendiren akıllı ajanlar.",
        },
        {
          title: "Satış Hattı Otomasyonu",
          description:
            "Potansiyel müşteri puanlama, takip dizileri, CRM senkronizasyonu ve dönüşüm takibi.",
        },
        {
          title: "Veri Senkronizasyonu",
          description:
            "CRM, ERP ve depo sistemlerinizi gerçek zamanlı olarak senkronize tutun.",
        },
      ],
    },

    integrations: {
      label: "Entegrasyonlar",
      headline: "Bağladığımız araç ve platformlar",
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
      headline: "Sizinle nasıl çalışıyoruz",
      steps: [
        {
          step: "01",
          title: "Keşif",
          description:
            "Süreçlerinizi haritalıyor, darboğazları tespit ediyor ve otomasyonun en yüksek etkiyi yaratacağı noktaları belirliyoruz.",
        },
        {
          step: "02",
          title: "Tasarım",
          description:
            "Doğru sistemi tasarlıyoruz — ihtiyaçlarınıza uygun araçları, entegrasyonları ve iş akışlarını seçiyoruz.",
        },
        {
          step: "03",
          title: "Geliştirme",
          description:
            "Yinelemeli olarak geliştiriyor, test ediyor ve devreye alıyoruz — her adımda sizi sürecin içinde tutuyoruz.",
        },
        {
          step: "04",
          title: "İyileştirme",
          description:
            "İşletmeniz büyüdükçe sistemlerinizi izliyor, optimize ediyor ve genişletiyoruz.",
        },
      ],
    },

    whyUs: {
      label: "Neden OpSolid",
      headline: "Bizi farklı kılan ne",
      points: [
        {
          title: "Önce İş, Sonra Teknoloji",
          description:
            "Teknolojimizle değil, operasyonlarınızla başlıyoruz. İnşa ettiğimiz her sistem gerçek bir sorunu çözer.",
        },
        {
          title: "Size Özel, Hazır Paket Değil",
          description:
            "Sistemleriniz işletmenizin çalışma şekline göre tasarlanır — şablon yok, taviz yok.",
        },
        {
          title: "Üretime Hazır Sistemler",
          description:
            "Çözümlerimiz gerçek iş yüklerini taşır. Demo için değil, güvenilirlik için mühendislik yapıyoruz.",
        },
        {
          title: "Avrupa Merkezli, Uluslararası Bakış Açısı",
          description:
            "Almanya merkezliyiz, Avrupa ve ötesindeki şirketlere hizmet veriyoruz. Yerel gereksinimleri ve uluslararası ölçeği anlıyoruz.",
        },
      ],
    },

    cta: {
      headline: "Yapay zekayı operasyonlarınıza taşımaya hazır mısınız?",
      description:
        "Ücretsiz bir danışma görüşmesi planlayın. Yapay zeka ajanları ve otomasyonun işletmenizi nerede dönüştürebileceğini belirleyip, size ulaştıracak bir yol haritası oluşturalım.",
      primaryCta: "Ücretsiz Görüşme Planlayın",
    },

    results: {
      label: "Sonuçlar",
      headline: "Operasyonlarınız üzerinde ölçülebilir etki",
      items: [
        { value: "%80", label: "Daha Az Manuel İş", description: "Otomasyon tipik olarak tekrarlayan manuel görevlerin %80'ine kadarını ortadan kaldırır" },
        { value: "5-10x", label: "İlk Yıl Yatırım Getirisi", description: "İşletmeler 12 ay içinde otomasyon yatırımlarının 5-10 katı geri dönüş elde eder" },
        { value: "%60", label: "Daha Hızlı Operasyonlar", description: "Akıllı iş akışlarıyla süreç döngü süreleri %60 veya daha fazla kısalır" },
        { value: "%35", label: "Maliyet Tasarrufu", description: "Otomasyon ve yapay zeka ajanlarıyla ortalama operasyonel maliyet düşüşü" },
      ],
    },

    toolsShowcase: {
      label: "Altyapımız",
      headline: "Yeni nesil yapay zeka ve otomasyon platformlarıyla güçlendirildi",
      description: "İşletmenizle birlikte gelişen akıllı sistemler inşa etmek için en son yapay zeka modellerini, otonom ajanları ve en güçlü otomasyon platformlarını kullanıyoruz.",
      tools: [
        { name: "n8n", description: "Karmaşık otomasyonlar için self-hosted iş akışı motoru. Webhook tetikleyiciler, koşullu mantık ve yapay zeka ajan orkestrasyon döngüleri.", techFeatures: ["Self-Hosted", "500+ Entegrasyon", "AI Ajan Döngüleri", "Webhook Trigger", "Hata Yönetimi"] },
        { name: "Make", description: "Çok adımlı veri yönlendirme için görsel senaryo oluşturucu. Gerçek zamanlı API bağlantıları, hata dallanması ve otomatik veri dönüşümleri.", techFeatures: ["Görsel Builder", "Veri Routing", "API Modülleri", "Hata Dallanma", "Gerçek Zamanlı"] },
        { name: "Zapier", description: "Çok adımlı otomasyonlarla 6.000+ uygulamayı hızlıca bağlayın. Koşullu yollar, zamanlanmış tetikleyiciler ve yapay zeka destekli filtreleme.", techFeatures: ["6000+ Uygulama", "Çok Adımlı", "Koşullu Mantık", "Zamanlayıcılar", "Filtreler"] },
        { name: "Yapay Zeka Ajanları", description: "Sesli aramalar, müşteri desteği, veri analizi ve karar verme için otonom yapay zeka ajanları. En son temel modellerle, RAG pipeline'larıyla ve çoklu ajan orkestrasyonuyla inşa edildi.", techFeatures: ["Sesli Asistanlar", "Çoklu Ajan", "RAG Pipeline", "Araç Kullanımı", "Gerçek Zamanlı"] },
      ],
    },
  },

  solutions: {
    hero: {
      label: "Çözümler",
      headline: "Gerçek operasyonel sorunları çözen sistemler",
      description:
        "Otomasyon, dahili araçlar, entegrasyonlar ve iş akışı sistemleri — her biri sizin süreçlerinize göre tasarlanır.",
    },
    problemsLabel: "Çözdüğümüz sorunlar",
    outcomesLabel: "Beklenen sonuçlar",
    items: [
      {
        title: "Süreç Otomasyonu",
        description:
          "n8n, özel iş akışları ve API orkestrasyonu kullanarak kuruluşunuzdaki tekrarlayan, kural tabanlı görevleri otomatize edin.",
        problems: [
          "Sistemler arası veri girişi ve kopyala-yapıştır ile harcanan saatler",
          "Departmanlar arası manuel aktarımlardaki hatalar",
          "Görevi kimin yaptığına bağlı tutarsız yürütme",
          "Manuel onay zincirleri nedeniyle oluşan darboğazlar",
        ],
        outcomes: [
          "Hata yönetimli uçtan uca otomatik iş akışları",
          "Her seferinde tutarlı, güvenilir yürütme",
          "Süreç durumuna gerçek zamanlı görünürlük",
          "Haftalık saatlerce manuel işin ortadan kaldırılması",
        ],
        icon: "workflow",
      },
      {
        title: "Dahili Araçlar ve Panolar",
        description:
          "Ekibiniz için özel olarak geliştirilmiş operasyonel araçlar — yönetim panelleri, veri arayüzleri ve iş akışınıza uygun panolar.",
        problems: [
          "Ekiplerin uygun araçlar gerektiren işler için tablo kullanması",
          "Sürecinize uymayan hazır yazılımlar",
          "Operasyonel verilerin merkezi bir görünümünün olmaması",
          "Kritik bilgilerin e-postalar ve belgeler arasında dağınık olması",
        ],
        outcomes: [
          "Ekibinizin çalışma şekline uygun amaca yönelik araçlar",
          "Gerçek zamanlı verilerle merkezi panolar",
          "Yeni ekip üyelerinin uyum süresinin kısalması",
          "Daha iyi veri görünürlüğüyle daha iyi kararlar",
        ],
        icon: "layout",
      },
      {
        title: "İş Akışı Orkestrasyonu",
        description:
          "İnsanları, kararları ve sistemleri tam izlenebilirlikle birbirine bağlayan uçtan uca iş akışları.",
        problems: [
          "Kritik süreçlerin e-posta ve hafıza ile yönetilmesi",
          "Durum veya sorumluluk hakkında görünürlük eksikliği",
          "Departmanlar arasında kaybolan görevler",
          "Büyümeyle ölçeklenemeyen süreçler",
        ],
        outcomes: [
          "Her adımda sahipliği olan net iş akışları",
          "Otomatik yönlendirme, eskalasyon ve bildirim",
          "Uyumluluk denetimi için tam iz kaydı",
          "Kadro artırmadan ölçeklenen süreçler",
        ],
        icon: "gitBranch",
      },
      {
        title: "Sistem Entegrasyonu",
        description:
          "CRM, ERP, veritabanları ve araçlarınızı birleşik bir operasyonel katmanda birleştirin. Veri silolarını ortadan kaldıran güvenilir entegrasyonlar.",
        problems: [
          "Aynı verinin birden fazla sisteme manuel olarak girilmesi",
          "Güncel olmayan veya çelişkili verilere dayalı kararlar",
          "BT'yi bunaltan noktadan noktaya entegrasyon talepleri",
          "Operasyonel veriler için tek bir doğru kaynağın bulunmaması",
        ],
        outcomes: [
          "Ana sistemler arasında çift yönlü veri senkronizasyonu",
          "Operasyonlar için tek doğru kaynak",
          "Manuel veri aktarımı ve hataların ortadan kaldırılması",
          "Ölçeklenebilir entegrasyon mimarisi",
        ],
        icon: "plug",
      },
      {
        title: "Pazarlama ve Satış Otomasyonu",
        description:
          "Satış hattınızı, pazarlama kampanyalarınızı, YouTube içerik operasyonlarınızı ve potansiyel müşteri yönetiminizi akıllı iş akışlarıyla otomatize edin.",
        problems: [
          "Takip yapılmadığı için kaybolan potansiyel müşteriler",
          "Manuel CRM güncellemeleri ve dağınık kampanya verileri",
          "YouTube ve içerik yayınlamanın manuel yapılması",
          "Kanallar arası dönüşüm metriklerine görünürlük olmaması",
        ],
        outcomes: [
          "Otomatik potansiyel müşteri puanlama ve takip dizileri",
          "CRM'in tüm temas noktalarıyla otomatik senkronizasyonu",
          "İçerik yayınlama ve zamanlama otopilotta",
          "Tüm kampanyalar için birleşik analitik panosu",
        ],
        icon: "target",
      },
      {
        title: "Kargo ve Sipariş Operasyonları",
        description:
          "Sipariş işleme, sevkiyat ve kargo için uçtan uca otomasyon — satış kanallarını, depoları ve kargo firmalarını birbirine bağlar.",
        problems: [
          "Satış kanalları genelinde siparişlerin manuel işlenmesi",
          "Etiket oluşturma ve kargo seçiminin elle yapılması",
          "Müşteriler için otomatik takip güncellemelerinin olmaması",
          "Birbirinden kopuk sistemlerden kaynaklanan sevkiyat hataları",
        ],
        outcomes: [
          "Çok kanallı otomatik sipariş işleme",
          "Akıllı kargo seçimi ve etiket oluşturma",
          "Tüm kanallarda gerçek zamanlı takip",
          "Azaltılmış hatalar ve daha hızlı teslimat",
        ],
        icon: "package",
      },
      {
        title: "Mesajlaşma ve İletişim Otomasyonu",
        description:
          "WhatsApp, Telegram, e-posta ve SMS üzerinden müşteri iletişimini akıllı yönlendirme ve şablonlu yanıtlarla otomatize edin.",
        problems: [
          "Destek mesajlarının WhatsApp, e-posta ve telefon arasında dağılması",
          "Yoğun saatlerde yavaş yanıt süreleri",
          "Müşterilere otomatik işlemsel bildirim gönderilmemesi",
          "Müşterileri sipariş durumu hakkında bilgilendirmek için manuel çaba",
        ],
        outcomes: [
          "Otomatik yönlendirme ve etiketleme ile birleşik gelen kutusu",
          "WhatsApp ve Telegram botları ile anında yanıtlar",
          "Otomatik sipariş onayları ve durum güncellemeleri",
          "Ek personel gerektirmeden 7/24 erişilebilirlik",
        ],
        icon: "messageSquare",
      },
      {
        title: "Yapay Zeka Asistanları ve Sohbet Botları",
        description:
          "Soruları yanıtlayan, potansiyel müşterileri değerlendiren ve ekibinizi gece gündüz destekleyen sesli arama asistanları, sohbet ajanları ve akıllı botlar.",
        problems: [
          "Tekrarlayan gelen arama ve mesajların yüksek hacmi",
          "Müşterilerin beklemede kalması veya e-posta yanıtı beklemesi",
          "Personelin SSS tipi sorularla bunalması",
          "Mesai saatleri dışında destek kapsamının olmaması",
        ],
        outcomes: [
          "Gelen aramaları anında karşılayan yapay zeka sesli asistan",
          "7/24 soruları yanıtlayan ve potansiyel müşterileri değerlendiren sohbet ajanları",
          "Rutin soruların %80'inin insan müdahalesi olmadan çözülmesi",
          "Personelin karmaşık, yüksek değerli etkileşimlere odaklanması",
        ],
        icon: "bot",
      },
    ],
    cta: {
      headline: "Hangi çözümün uygun olduğundan emin değil misiniz?",
      description:
        "Her işletme farklıdır. Zorluklarınızı konuşalım ve doğru sistemi birlikte tasarlayalım.",
      primaryCta: "Ücretsiz Görüşme Planlayın",
    },
  },

  useCases: {
    hero: {
      label: "Kullanım Alanları",
      headline: "İşletmeler OpSolid ile nasıl daha verimli çalışıyor",
      description:
        "Manuel işlerin güvenilir, otomatik operasyonlarla değiştirildiği gerçek senaryolar.",
    },
    labels: {
      context: "Bağlam",
      problem: "Sorun",
      solution: "Çözüm",
      outcome: "Sonuç",
    },
    items: [
      {
        title: "Çok Kanallı Sipariş İşleme",
        context:
          "Orta ölçekli e-ticaret şirketi, dört satış kanalından günde 200'den fazla sipariş.",
        problem:
          "Manuel sipariş girişi, durum güncellemeleri ve stok ayarlamaları için günde 4+ saat. Yoğun dönemlerde sık hatalar.",
        solution:
          "Otomatik boru hattı: sipariş alımı, veri normalleştirme, gerçek zamanlı stok, etiket oluşturma ve takip — tüm kanallarda.",
        outcome:
          "İşlem süresi: 4 saatten 15 dakikaya. Hata oranı %94 azaldı. Aynı ekiple 3 kat sipariş hacmi.",
      },
      {
        title: "Fatura ve Belge İşleme",
        context:
          "Lojistik şirketi, kargo firmaları ve tedarikçilerden farklı formatlarda aylık 500'den fazla fatura.",
        problem:
          "Haftada iki tam gün fatura verilerini çıkarmak, muhasebe sistemine girmek ve satın alma siparişleriyle eşleştirmek için harcanıyor.",
        solution:
          "Yapay zeka destekli veri çıkarma, otomatik satın alma siparişi eşleştirme, tutarsızlık bildirimi ve muhasebe sistemine doğrudan yönlendirme.",
        outcome:
          "İşlem süresi %75 azaldı. Finans ekibi artık istisnalara ve stratejiye odaklanıyor.",
      },
      {
        title: "Dahili Onay İş Akışları",
        context:
          "Büyüyen şirket, 120 çalışan. Satın alma, seyahat ve taşeron işe alım e-posta ile yönetiliyor.",
        problem:
          "Talepler e-posta içinde kayboluyor. Görünürlük yok, iz kaydı yok. Süreç yöneticiye göre değişiyor.",
        solution:
          "Yapılandırılmış onay sistemi: form gönderimi, kural tabanlı yönlendirme, takip ve otomatik hatırlatıcılar.",
        outcome:
          "Onay süresi: 5 günden 1,2 güne. Sıfır kayıp talep. Tam iz kaydı.",
      },
      {
        title: "Operasyonel Pano",
        context:
          "Satış, depo ve teslimatı ayrı haftalık tablolarla izleyen dağıtım şirketi.",
        problem:
          "Raporlar her zaman bir hafta eski, çoğu zaman tutarsız. Kararlar sezgiye dayalı.",
        solution:
          "ERP, depo ve teslimat sistemlerinden beslenen canlı pano. Anomaliler için yapılandırılabilir uyarılar.",
        outcome:
          "Pazartesi toplantıları: 2 saatten 30 dakikaya. Sorunlar gerçek zamanlı tespit ediliyor.",
      },
      {
        title: "Müşteri Alıştırma",
        context:
          "Aylık 15-20 müşteriyi çok adımlı süreçle karşılayan B2B hizmet şirketi.",
        problem:
          "Paylaşılan belgede kontrol listesi. Adımlar atlanıyor, tutarsız deneyim, 2-3 haftalık alıştırma süresi.",
        solution:
          "Otomatik iş akışı: hoş geldiniz e-postaları, hesap oluşturma, belge takibi, durum panosu.",
        outcome:
          "Alıştırma süresi: 3 haftadan 5 güne. Atlanan adım yok. Artan müşteri memnuniyeti.",
      },
      {
        title: "Arka Ofis Dijitalleştirme",
        context:
          "Üretim şirketi. İK ve satın alma hâlâ kâğıt formlar ve yerel dosyalarla yürütülüyor.",
        problem:
          "Evrak işlemek günler sürüyor. Tutarsız kanallar. Hiçbir şey aranabilir veya izlenebilir değil.",
        solution:
          "İşe alım, satın alma talepleri ve belge yönetimi için uygun versiyonlama ile dijital iş akışları.",
        outcome:
          "Kâğıt kullanımı ortadan kalktı. İK işe alım süresi -%60. Satın alma talepleri: 1 haftadan 2 güne.",
      },
      {
        title: "Sistemler Arası Veri Senkronizasyonu",
        context:
          "Shopify, ERP, depo yönetim sistemi ve HubSpot kullanan perakende şirketi — her biri kendi verisiyle.",
        problem:
          "Manuel senkronizasyona günde saatler harcanıyor. Sistemler arasında sık tutarsızlıklar.",
        solution:
          "Neredeyse gerçek zamanlı senkronizasyon, çakışma tespiti ve hata yönetimi ile merkezi entegrasyon katmanı.",
        outcome:
          "Manuel senkronizasyon ortadan kalktı. Tutarsızlıklar neredeyse sıfır. Haftalık 15+ saat yeniden tahsis edildi.",
      },
      {
        title: "Otomatik Müşteri İletişimi",
        context:
          "Hizmet şirketi. Durum güncellemeleri, hatırlatmalar ve takipler üç kişi tarafından manuel yönetiliyor.",
        problem:
          "Mesajlar geç, tutarsız veya gönderilmiyor. Yoğun dönemlerde iletişim aksıyor.",
        solution:
          "Hizmet kilometre taşlarına göre tetiklenen otomatik mesajlaşma. Gerektiğinde müdahale imkânı olan tutarlı şablonlar.",
        outcome:
          "%100 iletişim güvenilirliği. Haftalık 20+ saat tasarruf. Memnuniyet %35 artış.",
      },
      {
        title: "WhatsApp ve Telegram Destek Kanalı",
        context:
          "WhatsApp, Telegram ve e-posta üzerinden günde 300'den fazla müşteri talebi alan e-ticaret şirketi.",
        problem:
          "Üç personel aynı soruları manuel yanıtlıyor. Mesai dışı destek yok. Kanallar arasında mesajlar kayboluyor.",
        solution:
          "Otomatik SSS yanıtları, sipariş durumu sorgulamaları ve karmaşık konular için insan temsilcilere akıllı yönlendirme ile birleşik mesajlaşma merkezi.",
        outcome:
          "Taleplerin %70'i otomatik çözüldü. Yanıt süresi 30 saniyenin altında. Tam mesai dışı kapsam.",
      },
      {
        title: "Gelen Aramalar İçin Yapay Zeka Sesli Asistan",
        context:
          "Günde 100'den fazla arama alan hizmet şirketi — randevu, durum sorgusu, genel sorular.",
        problem:
          "Telefonlarda iki tam zamanlı personel. Uzun bekleme süreleri. Yoğun saatlerde ve mesai sonrası kaçırılan aramalar.",
        solution:
          "Gelen aramaları karşılayan yapay zeka sesli asistan: SSS'leri yanıtlama, randevu alma, karmaşık aramaları doğru departmana yönlendirme.",
        outcome:
          "Aramaların %60'ı insan müdahalesi olmadan karşılandı. Sıfır kaçırılan arama. Personel daha değerli işlere yönlendirildi.",
      },
      {
        title: "YouTube İçerik Operasyonları",
        context:
          "Birden fazla YouTube kanalında yerelleştirilmiş meta verilerle aylık 8-12 video yayınlayan pazarlama ekibi.",
        problem:
          "Manuel yükleme, başlık/açıklama/etiket girişi, küçük resim atama ve zamanlama. Video başına 3+ saat.",
        solution:
          "Otomatik boru hattı: video işleme, meta veri oluşturma, küçük resim atama, zamanlanmış yayınlama ve performans takip panosu.",
        outcome:
          "Yayınlama süresi video başına 20 dakikaya düştü. Tutarlı meta veri kalitesi. Merkezi analitik.",
      },
      {
        title: "Satış Hattı Otomasyonu",
        context:
          "50'den fazla aktif potansiyel müşterisi olan B2B şirketi. Satış ekibi CRM kullanıyor ama takipleri ve anlaşma aşamalarını manuel izliyor.",
        problem:
          "Kaçırılan takipler nedeniyle soğuyan potansiyel müşteriler. CRM'de tutarsız veriler. Satış hattı sağlığına görünürlük yok.",
        solution:
          "Otomatik potansiyel müşteri puanlama, davranışa göre tetiklenen takip dizileri, CRM otomatik güncellemeleri ve uyarılı satış hattı panosu.",
        outcome:
          "Takip oranı: %100. Potansiyel müşteriden toplantıya dönüşüm %40 artış. Yönetim için gerçek zamanlı satış hattı görünürlüğü.",
      },
    ],
    cta: {
      headline: "Bu senaryolarda kendinizi görüyor musunuz?",
      description:
        "Ekibiniz otomatize edilmesi gereken işlere zaman harcıyorsa, konuşalım.",
      primaryCta: "Ücretsiz Görüşme Planlayın",
    },
  },

  about: {
    hero: {
      label: "OpSolid Hakkında",
      headline:
        "Manuel süreçleri aşmış işletmeler için operasyonel altyapı inşa ediyoruz",
      description:
        "Almanya merkezli. Tek bir odak noktası: manuel, tekrarlayan işleri güvenilir otomatik sistemlerle değiştirmek.",
    },
    story: {
      headline: "Neden varız",
      paragraphs: [
        "Her büyüyen işletme, manuel süreçlerin darboğaz haline geldiği bir noktaya ulaşır. Siparişler birikir, onaylar kaybolur, veriler birbirinden kopuk tablolarda yaşar ve ekipler zamanlarını işi ileriye taşıyan çalışmalardan çok yönetim yüküne harcar.",
        "OpSolid tam da bunu çözmek için kuruldu. Derin süreç anlayışını modern otomasyon, entegrasyon ve yapay zeka yetenekleriyle birleştirerek operasyonel işleri güvenilir, tutarlı ve ölçeklenebilir şekilde yürüten sistemler inşa ediyoruz.",
        "Genel bir teknoloji ajansı değiliz. Pazarlama web siteleri yapmıyoruz, reklam kampanyaları yürütmüyoruz. Operasyonel sistemlere odaklanıyoruz: bir işletmeyi her gün ayakta tutan iş akışları, araçlar ve entegrasyonlar.",
      ],
    },
    values: {
      headline: "İşimize bakış açımız",
      items: [
        {
          title: "Teknolojiden değil, süreçten başla",
          description:
            "Herhangi bir çözüm önermeden önce işletmenizin nasıl çalıştığını anlamaya zaman ayırırız.",
        },
        {
          title: "Demo için değil, üretim için inşa et",
          description:
            "Sistemlerimiz gerçek iş yüklerini taşır. Güvenilirlik, hata yönetimi ve uç durumlar için tasarlarız.",
        },
        {
          title: "Özellikleri değil, sonuçları ölç",
          description:
            "Özellik listeleriyle değil — kazanılan saatler, ortadan kaldırılan hatalar ve iyileştirilen süreçlerle ilgileniriz.",
        },
        {
          title: "Pratik ol, dürüst ol",
          description:
            "Otomasyonu mantıklı olan yerde önerir, olmayan yerde uyarırız.",
        },
      ],
    },
    founder: {
      name: "Hasan Dönmez",
      title: "Kurucu & Sistem Mimarı",
      education: "Yüksek Lisans Elektrik-Elektronik Mühendisliği & Bilgi Teknolojileri — Karlsruhe Teknoloji Enstitüsü (KIT)",
      description:
        "Hasan, Almanya'nın önde gelen araştırma üniversitelerinden Karlsruhe Teknoloji Enstitüsü'nden (KIT) Elektrik-Elektronik Mühendisliği & Bilgi Teknolojileri alanında yüksek lisans derecesine sahiptir. Süreç otomasyonu, sistem entegrasyonu ve yapay zeka destekli iş akışlarındaki derin uzmanlığı — Veri Bilimi, Makine Öğrenimi, Derin Öğrenme ve İş Zekası alanlarındaki ileri eğitimiyle birleşerek — gerçek iş sorunlarını çözen operasyonel sistemler inşa etmektedir. Mühendislik altyapısı, her çözümün güvenilirlik, ölçeklenebilirlik ve ölçülebilir sonuçlar için tasarlanmasını garanti eder.",
      expertiseLabel: "Temel Uzmanlıklar",
      expertise: [
        "Süreç Otomasyonu & İş Akışı Mühendisliği",
        "Veri Bilimi & Makine Öğrenimi",
        "Derin Öğrenme & Yapay Zeka Sistemleri",
        "İş Zekası & Analitik",
        "Sistem Entegrasyonu & API Geliştirme",
      ],
      footnote: "Almanya merkezli. Avrupa ve uluslararası alanda hizmet vermektedir.",
    },
    cta: {
      headline: "İşe yarayan bir şey inşa edelim",
      description:
        "Operasyonlarınız daha az manuel iş ve daha güvenilir sistemlere ihtiyaç duyuyorsa, sizden haber almak isteriz.",
      primaryCta: "Bize Ulaşın",
    },
  },

  contact: {
    hero: {
      label: "İletişim",
      headline: "Operasyonlarınızı konuşalım",
      description:
        "Belirli bir otomasyon sorununuz olsun ya da nelerin mümkün olduğunu keşfetmek isteyin — satış baskısı yok, sadece pratik bir sohbet.",
    },
    form: {
      name: "Ad Soyad",
      email: "Kurumsal E-posta",
      company: "Şirket Adı",
      message: "Hangi operasyonel sorunu çözmek istiyorsunuz?",
      consent:
        "Verilerimin Gizlilik Politikası'nda açıklandığı şekilde işlenmesini kabul ediyorum. Verilerim yalnızca bu talebe yanıt vermek için kullanılacaktır.",
      privacyLink: "Gizlilik Politikası",
      submit: "Mesaj Gönder",
      sending: "Gönderiliyor...",
      success: "Teşekkür ederiz. 1-2 iş günü içinde size dönüş yapacağız.",
      error:
        "Bir hata oluştu. Lütfen tekrar deneyin veya bize doğrudan e-posta gönderin.",
    },
    meeting: {
      headline: "Doğrudan görüşmeyi mi tercih edersiniz?",
      description:
        "Ücretsiz 30 dakikalık bir keşif görüşmesi planlayın. Size uygun bir zaman seçin — uygun saatler takvimimizden canlı olarak senkronize edilir.",
      cta: "Görüşme Planlayın",
    },
    info: {
      email: "hello@opsolid.de",
      response: "Genellikle 1-2 iş günü içinde yanıt veriyoruz.",
      location:
        "Almanya merkezli. Avrupa ve uluslararası düzeyde müşterilere hizmet veriyoruz.",
    },
  },

  footer: {
    description:
      "Modern işletmeler için operasyonel altyapı. Otomasyon, dahili araçlar ve iş akışı sistemleri.",
    company: "Şirket",
    services: "Hizmetler",
    legal: "Hukuki",
    resources: "Kaynaklar",
    copyright: `© ${new Date().getFullYear()} OpSolid. Tüm hakları saklıdır.`,
  },

  notFound: {
    title: "Sayfa bulunamadı",
    description: "Aradığınız sayfa mevcut değil veya taşınmış olabilir.",
    backHome: "Ana Sayfaya Dön",
    contactUs: "İletişim",
  },

  impressum: {
    title: "Yasal Bildirim",
    notice: "Bu yasal bildirim kuruluş aşamasındaki bir şirket içindir. Bilgiler işletme tescilinden sonra güncellenecektir.",
    sections: {
      according: "§ 5 TMG uyarınca bilgiler",
      representedBy: "Temsil eden",
      contact: "İletişim",
      phone: "Telefon: Talep üzerine",
      register: "Ticaret Sicili",
      registerText: "Şu anda bir ticaret sicili kaydı bulunmamaktadır. Şirket kuruluş aşamasındadır.",
      vatId: "KDV Kimlik Numarası",
      vatIdText: "İşletme tescilinden sonra başvurulacaktır.",
      responsibleContent: "§ 55 Abs. 2 RStV uyarınca içerikten sorumlu",
      liabilityContent: "İçerik Sorumluluğu",
      liabilityContentText: "Hizmet sağlayıcı olarak, § 7 Abs. 1 TMG uyarınca bu sayfalardaki kendi içeriklerimizden genel yasalar çerçevesinde sorumluyuz. Ancak §§ 8 ila 10 TMG uyarınca, iletilen veya depolanan üçüncü taraf bilgilerini izlemek zorunda değiliz.",
      liabilityLinks: "Bağlantı Sorumluluğu",
      liabilityLinksText: "Teklifimiz, içerikleri üzerinde hiçbir etkimiz olmayan üçüncü taraf harici web sitelerine bağlantılar içermektedir. Bağlantı verilen sayfaların içeriğinden her zaman ilgili sağlayıcı veya işletmeci sorumludur.",
      address: "Tam adres işletme tescilinden sonra eklenecektir.",
    },
  },

  privacy: {
    title: "Gizlilik Politikası",
    subtitle: "Datenschutzerklärung",
    notice: "Bu gizlilik politikası bir taslaktır. İşletme tescilinden sonra yasal olarak incelenmiş bir versiyonla değiştirilecektir.",
    lastUpdated: "Son güncelleme: Mart 2026",
    sections: [
      {
        title: "1. Veri Korumaya Genel Bakış",
        content: "Aşağıda, bu web sitesini ziyaret ettiğinizde kişisel verilerinize ne olduğuna dair genel bir bakış sunulmaktadır. Kişisel veriler, sizi kişisel olarak tanımlayabilecek tüm verilerdir.",
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
            content: "İletişim formu aracılığıyla gönderilen veriler, sorgunun işlenmesi ve takibi için saklanır. Yasal dayanak: Sözleşmeye ilişkin sorgular için GDPR Madde 6(1)(b), meşru menfaat için GDPR Madde 6(1)(f) veya onay verilmişse GDPR Madde 6(1)(a).",
          },
          {
            title: "Sunucu Günlük Dosyaları",
            content: "Barındırma sağlayıcısı otomatik olarak tarayıcı türü, işletim sistemi, yönlendiren URL, ana bilgisayar adı ve istek zamanını toplar. Bu veriler belirli kişilere atanamaz.",
          },
        ],
      },
      {
        title: "4. Barındırma",
        content: "Bu web sitesi Vercel, Inc. (440 N Baxter St, Los Angeles, CA 90012, ABD) tarafından barındırılmaktadır. Web sitemizi ziyaret ettiğinizde IP adresiniz ve kullanım verileriniz Vercel tarafından işlenir. Daha fazla bilgi için Vercel'in gizlilik politikasına bakın.",
      },
      {
        title: "5. Çerezler ve Analitik",
        content: "Bu web sitesi izleme çerezleri veya analitik araçları kullanmamaktadır. Seçtiğiniz dili hatırlamak için tarayıcınızın yerel depolamasında bir dil tercihi saklanır.",
      },
      {
        title: "6. Haklarınız",
        content: "Saklanan verileriniz hakkında bilgi alma, düzeltme veya silme talep etme, işlemeyi kısıtlama ve denetim makamına şikayette bulunma hakkına sahipsiniz. Onay verilmişse, bunu istediğiniz zaman geri çekebilirsiniz.",
      },
    ],
  },

  blog: {
    hero: {
      label: "Blog",
      headline: "Otomasyon ve Operasyonlar Hakkında İçgörüler",
      description: "İş akışı otomasyonu, entegrasyon stratejileri ve operasyonel verimlilik hakkında pratik makaleler.",
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
        slug: "n8n-neden-is-akisi-otomasyonunun-gelecegi",
        title: "n8n Neden İş Akışı Otomasyonunun Geleceği?",
        excerpt: "Güçlü, kendi sunucunuzda barındırılan ve verileriniz üzerinde tam kontrol sağlayan iş akışı otomasyonuna ihtiyaç duyan işletmeler için n8n'in neden tercih edilen platform haline geldiğini keşfedin.",
        category: "automation",
        date: "2026-03-15",
        readTime: "6",
      },
      {
        slug: "isletmenizin-surec-otomasyonuna-ihtiyaci-oldugunu-gosteren-5-isaret",
        title: "İşletmenizin Süreç Otomasyonuna İhtiyacı Olduğunu Gösteren 5 İşaret",
        excerpt: "Ekibiniz manuel işlerin altında eziliyor mu? Otomasyon altyapısına yatırım yapmanın zamanı geldiğini gösteren temel göstergeler.",
        category: "operations",
        date: "2026-03-08",
        readTime: "5",
      },
      {
        slug: "crm-ve-erp-entegrasyonu-rehber",
        title: "CRM & ERP Entegrasyonu: Uygulama Rehberi",
        excerpt: "CRM ve ERP sistemlerinizi senkronize etmek için pratik bir rehber — veri silolarını ortadan kaldırın ve tek bir doğruluk kaynağı oluşturun.",
        category: "integration",
        date: "2026-02-28",
        readTime: "8",
      },
      {
        slug: "yapay-zeka-chatbotlar-vs-kural-tabanli-botlar",
        title: "Yapay Zeka Chatbotlar vs. Kural Tabanlı Botlar: Hangisine İhtiyacınız Var?",
        excerpt: "Yapay zeka destekli ve kural tabanlı chatbotlar arasındaki farkı anlayın — ve her yaklaşımın işletmeniz için ne zaman mantıklı olduğunu öğrenin.",
        category: "ai",
        date: "2026-02-20",
        readTime: "7",
      },
      {
        slug: "make-vs-zapier-vs-n8n-karsilastirma",
        title: "Make vs. Zapier vs. n8n: Doğru Otomasyon Platformunu Seçmek",
        excerpt: "En popüler üç otomasyon platformunun detaylı karşılaştırması — özellikler, fiyatlandırma, esneklik ve kullanım senaryoları.",
        category: "automation",
        date: "2026-02-12",
        readTime: "10",
      },
      {
        slug: "whatsapp-business-otomasyon-rehberi",
        title: "WhatsApp Business Otomasyon Rehberi",
        excerpt: "WhatsApp üzerinden müşteri iletişimini nasıl otomatize edeceğinizi öğrenin — sipariş onaylarından destek botlarına — kişisel dokunuşu kaybetmeden.",
        category: "automation",
        date: "2026-02-05",
        readTime: "9",
      },
    ],
    cta: {
      headline: "Operasyonlarınızı otomatize etmek ister misiniz?",
      description: "Ücretsiz bir danışma görüşmesi planlayın. İşletmeniz için en etkili otomasyon fırsatlarını birlikte belirleyelim.",
      primaryCta: "Ücretsiz Görüşme Planlayın",
    },
  },

  faq: {
    hero: {
      label: "SSS",
      headline: "Sıkça Sorulan Sorular",
      description: "Otomasyon hizmetlerimiz, sürecimiz ve teknolojimiz hakkında sık sorulan sorular.",
    },
    allFilter: "Tümü",
    categories: {
      general: "Genel",
      technical: "Teknik",
      process: "Süreç & Fiyatlandırma",
    },
    items: [
      {
        question: "OpSolid tam olarak ne yapıyor?",
        answer: "İşletmeler için otomasyon sistemleri, entegrasyonlar ve dahili araçlar inşa ediyoruz. Ekibiniz manuel, tekrarlayan işlerle vakit harcıyorsa — veri girişi, e-posta takipleri, sipariş işleme, rapor oluşturma — bunu otomatik, güvenilir ve ölçeklenebilir şekilde yapan sistemler kuruyoruz.",
        category: "general",
      },
      {
        question: "Hangi araç ve platformları kullanıyorsunuz?",
        answer: "Birincil otomasyon platformumuz n8n, gerektiğinde Make ve Zapier ile desteklenir. Ayrıca API'ler, veritabanları ve bulut hizmetleri kullanarak özel entegrasyonlar inşa ediyoruz. Yapay zeka çözümleri için OpenAI, Claude ve özel ML modelleri kullanıyoruz. Her kullanım senaryosu için doğru aracı seçiyoruz.",
        category: "technical",
      },
      {
        question: "n8n nedir ve neden tercih ediyorsunuz?",
        answer: "n8n, kendi sunucunuzda barındırılabilen, verileriniz ve iş akışlarınız üzerinde tam kontrol sağlayan açık kaynaklı bir iş akışı otomasyon platformudur. Son derece esnek, yüzlerce entegrasyonu destekler ve gerektiğinde özel kod yazmaya izin verir. İş otomasyonu için güç, esneklik ve veri egemenliği arasındaki en iyi dengeyi sunduğu için tercih ediyoruz.",
        category: "technical",
      },
      {
        question: "Tipik bir proje ne kadar sürer?",
        answer: "Çoğu proje karmaşıklığa bağlı olarak keşiften devreye almaya 2-6 hafta sürer. Basit otomasyonlar birkaç gün içinde canlıya alınabilir. Yinelemeli çalışıyoruz — sonuçları erken ve sık görürsünüz.",
        category: "process",
      },
      {
        question: "Devreye alma sonrası sürekli destek sunuyor musunuz?",
        answer: "Evet. İzleme, bakım ve optimizasyon paketleri sunuyoruz. Otomasyon sistemleri işletmeniz büyüdükçe gelişir — sistemlerinizin ayak uydurmasını sağlıyoruz. Ayrıca ekibinizin günlük operasyonları bağımsız yönetebilmesi için dokümantasyon ve eğitim sağlıyoruz.",
        category: "process",
      },
      {
        question: "Maliyeti nedir?",
        answer: "Her proje farklıdır. İhtiyaçlarınızı anlamak için ücretsiz bir ilk görüşme sunuyoruz, ardından şeffaf bir teklif hazırlıyoruz. Fiyatlandırmamız proje bazlı, saat bazlı değil — yatırımı önceden bilirsiniz.",
        category: "process",
      },
      {
        question: "Mevcut sistemlerimize entegre olabilir misiniz?",
        answer: "Neredeyse kesinlikle. CRM'ler (HubSpot, Salesforce, Pipedrive), ERP'ler (SAP, Oracle, Odoo), e-ticaret platformları (Shopify, WooCommerce), veritabanları, Google Workspace ve API'si olan neredeyse her sistemle çalışıyoruz.",
        category: "technical",
      },
      {
        question: "Mevcut araçlarımızı değiştirmemiz gerekiyor mu?",
        answer: "Hayır. Mevcut araçlarınızı birbirine bağlayan sistemler inşa ediyoruz — onları değiştirmiyoruz. Amacımız, elinizdekinin birlikte daha iyi çalışmasını sağlamak, veri silolarını ve manuel aktarımları ortadan kaldırmaktır.",
        category: "general",
      },
      {
        question: "Verilerimiz güvende mi?",
        answer: "Kesinlikle. Tüm otomasyon altyapısını kendi ortamınızda barındırabiliriz. KVKK ve GDPR gereksinimlerini takip ediyor, hassas veriler için şifreleme uyguluyoruz ve güvenli API bağlantıları kullanıyoruz. Açıkça bulut çözümü tercih etmediğiniz sürece hiçbir veri üçüncü taraf sunucularından geçmez.",
        category: "technical",
      },
      {
        question: "Hangi sektörlere hizmet veriyorsunuz?",
        answer: "Sektörler arası çalışıyoruz — e-ticaret, lojistik, üretim, profesyonel hizmetler ve daha fazlası. Çözümlerimiz sektör etiketinize göre değil, süreçlerinize göre inşa edilir. Tekrarlayan manuel iş içeren operasyonlarınız varsa yardımcı olabiliriz.",
        category: "general",
      },
    ],
    cta: {
      headline: "Hala sorularınız mı var?",
      description: "Diğer sorularınızı yanıtlamaktan memnuniyet duyarız. Ücretsiz bir danışma görüşmesi planlayın ve durumunuzu birlikte konuşalım.",
      primaryCta: "Ücretsiz Görüşme Planlayın",
    },
  },
} as const;
