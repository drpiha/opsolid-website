// =============================================================================
// TURKISH CONTENT (Türkçe)
// Tüm metinler profesyonel iş Türkçesinde. Yapı en.ts ile birebir aynı.
// =============================================================================

import type { Content } from "./en";

export const content: Content = {








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
            title: "Pazarlama e-postaları (rıza / çift onay)",
            content:
              "Pazarlama e-postalarını (OpSo Smart hakkında ürün haberleri ve teklifler) yalnızca önceden alınmış açık rızanızla göndeririz (§ 7 UWG, GDPR m.6(1)(a)). Rıza, hesap oluşturmadan ayrı olarak önceden işaretlenmemiş bir kutucukla verilir ve bir onay e-postası aracılığıyla çift onay (double opt-in) ile doğrulanır; pazarlama e-postası yalnızca siz onayladıktan sonra gönderilir. İspat için tam rıza metnini, zaman damgasını ve hashlenmiş (asla açık metin olarak saklanmayan) bir IP adresini loglanır. Rızanızı her e-postadaki abonelikten çıkma bağlantısıyla veya info@opsolid.de adresine yazarak istediğiniz zaman ileriye dönük olarak geri çekebilirsiniz. Geri çekme, o ana kadar yapılan işlemenin hukuka uygunluğunu etkilemez.",
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
    posts: [
      {
        slug: "eu-ai-act-august-2026-omnibus-compliance",
        title: "AB Yapay Zeka Yasası Yürürlükte: Omnibus Değişiklikleri İşletmeniz İçin Ne Anlama Geliyor",
        excerpt:
          "AB Yapay Zeka Yasası 2 Ağustos 2026'da tam olarak yürürlüğe giriyor. Omnibus VII neler değiştirdi - ve hangi şeffaflık yükümlülükleri şimdi geçerli.",
        category: "ai",
        date: "2026-07-07",
        readTime: "7",
      },
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
  },

  faq: {
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
  },

  products: {
    comingSoonDescription:
      "OpSolid'in ürün portföyü genişliyor. Operasyon, iletişim ve yapay zekâ destekli iş akışları için yeni araçlar şu anda geliştirme aşamasında.",

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
            provider: "OpSo Smart",
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
        items: [],
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








  },

  v2: {


    home: {







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
      pricing: {
        eyebrow: "[ FİYATLANDIRMA ]",
        headline: "Ücretsiz başla. Sadece ihtiyaç oldukça öde.",
        lead:
          "Ücretsiz oluştur ve yayınla. Kendi alan adın ve analitik için yükselt — ya da her şeyi biz tasarlayalım.",
      },
    },








    pricing: {
      meta: {
        title: "Fiyatlandırma — Standard, Professional, Enterprise | OpSolid",
        description: "OpSolid ürünleri için fiyat özeti (çoğu ürünün fiyatı talep üzerine): Voice Agent, OpSo Smart, Chatbot, WhatsApp, Booking, Email, Lead Qualifier, Custom Automation ve Kutasia.",
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
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["500 dakika / ay", "1 telefon numarası", "1 dil", "Mesai saatleri kapsamı", "Cal.com entegrasyonu"],
              overage: "",
              forWhom: "Tek lokasyon SMB, mesai dışı taşma",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["2.000 dakika / ay", "3 telefon numarası", "Çok dilli (DE / EN / TR)", "7/24 kapsam", "CRM senk. (HubSpot, Pipedrive)"],
              overage: "",
              forWhom: "Sürekli inbound olan mid-market (klinik, ajans)",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["8.000 dakika / ay", "Sınırsız numara", "Custom voice + branding", "SLA anlaşmaya göre", "EU veri ikametgah sözleşmesi"],
              overage: "",
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
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["1 site", "500 konuşma / ay", "Knowledge base 50 dokümana kadar", "Mesai saatlerinde devir", "E-mail + ticket capture"],
              overage: "",
              forWhom: "Küçük site, lead capture odaklı",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["3 site", "2.500 konuşma / ay", "Sınırsız KB dokümanı", "7/24 devir", "CRM senk."],
              overage: "",
              forWhom: "Aktif funnel'i olan mid-market",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["Sınırsız site", "10.000 konuşma / ay", "Çok dilli", "SLA + audit log", "Custom voice + tone training"],
              overage: "",
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
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["1 WABA numarası", "3 kullanıcı", "1.000 konuşma / ay", "Şablon + broadcast", "Lead capture flow"],
              overage: "",
              forWhom: "Lokal işletmeler, tek kanal",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["1 WABA numarası", "10 kullanıcı", "5.000 konuşma / ay", "Otomasyon flow'ları", "CRM senk."],
              overage: "",
              forWhom: "Mid-market servis operasyonu",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["3+ WABA numarası", "Sınırsız kullanıcı", "20.000 konuşma / ay", "Çok takımlı routing", "SLA"],
              overage: "",
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
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["Web booking widget", "Cal.com senk.", "E-mail + SMS hatırlatma", "1 takvim", "Aylık 100 booking'e kadar"],
              overage: "",
              forWhom: "Solo pratisyen / küçük takım",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["10 takvime kadar", "Voice + WhatsApp + web intake", "No-show recovery flow", "Intake formları", "Custom hatırlatma"],
              overage: "",
              forWhom: "Çok personelli servis işletmesi",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
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
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["1 paylaşılan inbox", "AI triage + otomatik yanıt", "500 e-mail / koltuk / ay", "Temel CRM log", "Slack bildirim"],
              overage: "",
              forWhom: "Küçük operasyon takımı",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["3 inbox", "Eskalasyon kuralları", "2.000 e-mail / koltuk / ay", "HubSpot / Pipedrive senk.", "Custom yanıt şablonu"],
              overage: "",
              forWhom: "Mid-market servis masası",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["Sınırsız inbox", "Custom routing kuralları", "Audit log + SLA", "EU DPA dahil", "Adanmış success manager"],
              overage: "",
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
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["250 nitelikli lead / ay", "Form + chat intake", "BANT scoring", "CRM push (HubSpot, Pipedrive)", "Slack alert"],
              overage: "",
              forWhom: "Outbound-hafif B2B",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["1.000 nitelikli lead / ay", "Voice + chat + form intake", "Custom scoring modeli", "Routing kuralları", "Haftalık özet"],
              overage: "",
              forWhom: "Aktif SDR-destekli takım",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["4.000 nitelikli lead / ay", "Multi-kanal intake", "Account-tabanlı scoring", "SLA", "Custom entegrasyon"],
              overage: "",
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
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["1 workflow uçtan uca inşa", "Scoping + build + 30 gün destek", "3 entegrasyona kadar", "Dokümantasyon + devir", "Kaynak kodu sizde"],
              overage: "",
              forWhom: "Tek, iyi tanımlı acı noktası",
              isHighlighted: false,
            },
            {
              name: "Professional",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
              included: ["3–5 workflow", "Discovery workshop", "Build + 90 gün destek", "Entegrasyon + custom kod", "Ops dashboard"],
              overage: "",
              forWhom: "Mid-market dijital ops projesi",
              isHighlighted: true,
            },
            {
              name: "Enterprise",
              setup: "Fiyat talep üzerine",
              monthly: "Fiyat talep üzerine",
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
    wallet: {
      notConfigured:
        "Wallet desteği yapılandırılıyor. Etkinleştirildiğinde Apple/Google Wallet butonları görünecek.",
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
      subtitle: "Ücretsiz hesabınızı e-posta giriş bağlantısı veya Google ile oluşturun. Şifre gerekmez.",
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
      passwordCta: "Önceden doğrulanmış hesabın şifresini kullan",
      legacyPasswordHelp: "E-postası önceden doğrulanmış hesaplar şifreyle giriş yapmaya devam edebilir. Şifrenizi e-postanızı doğrulamadan önce oluşturduysanız e-posta giriş bağlantısını veya Google'ı kullanın. Önceki şifreniz ilk e-posta doğrulamasında kaldırılır.",
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
