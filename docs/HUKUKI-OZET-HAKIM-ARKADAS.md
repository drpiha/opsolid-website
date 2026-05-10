# Kısa Hukuki Görüş İsteği — KVKK / GDPR

**Hazırlayan:** Hasan Dönmez · **Tarih:** 10 Mayıs 2026
**Süre tahmini:** 10-15 dakika okuma + sohbet

---

## Durum (Kısaca)

İki tane web tabanlı yazılım ürünü geliştiriyorum:

1. **Kutasia (kutasia.com)** — Otel, restoran, kuaför gibi yerel işletmelerin kendi müşteri mesajlarını (WhatsApp, Instagram, e-posta) tek panelde yönettiği bir SaaS. Türkiye pazarı ağırlıklı.
2. **OpSolid + Verso (opsolid.de)** — Almanya merkezli marka. Verso, dijital kartvizit ürünü; Avrupa + Türkiye + global B2C/B2B satış hedefi.

**Teknik durum:** Her iki uygulama da aynı sunucuda (Hostinger, **Vilnius / Litvanya**, AB içi). Veritabanı dahil tüm veri AB toprağında. Yapay zeka ve ödeme için ABD merkezli sağlayıcılar (OpenAI, Anthropic, Stripe) kullanıyorum — bunlara dış aktarım var.

**Hukuki konum:** Şu an Almanya'da kuruluş aşamasında **Einzelunternehmen** (şahıs şirketi) olarak başvurdum; Türkiye'de bir tüzel kişiliğim yok. Solo kurucuyum, çalışanım yok.

---

## Çözmem Gereken Üç Ana Soru

### 1. KVKK gerçek risk seviyesi
Solo kurucu, 50 çalışan altı, 100M TL altı bir SaaS olarak Türkiye'de **VERBİS kayıt zorunluluğum yok** gibi görünüyor — ama otel/klinik müşterisi varsa "özel nitelikli veri" eşiği devreye giriyor. Sizin yargı tecrübenizden:
- KVKK Kurumu **küçük SaaS işletmelerini gerçekten denetliyor mu**, yoksa pratikte sadece büyük kurumsal vaka mı geliyor önüne?
- Bir kullanıcı şikayeti olursa, Kurum'un tipik süreç ve ceza pratiği nedir?
- Yurtdışına veri aktarımı için 5 iş günlük Kurum bildirimi (10.07.2024 yönetmeliği) — bu yükümlülüğün ihlal edilmesinde Kurum gerçekten ceza veriyor mu, yoksa "düzelt" uyarısı mı çıkıyor?

### 2. Şirket yapısı — TR'de mi DE'de mi?
İki seçenek var:
- **(A)** Almanya'da Einzelunternehmen olarak kalıp her iki ürünü buradan yönetmek. Avantaj: AB pazarına direkt satış, Stripe Avrupa erişimi. **Dezavantaj: kişisel mal varlığım GDPR cezalarına sınırsız açık** (€20M tavan).
- **(B)** Türkiye'de bir Limited Şirket kurup yazılım ihracatı (%80 vergi indirimi var) avantajıyla buradan satmak; Almanya tarafını minimum tutmak.

Sizin pratik perspektifinizden hangisi daha az risk? Bir dava söz konusu olduğunda hangi yargı ortamı (TR vs DE) daha öngörülebilir?

### 3. Veri sorumlusu temsilcisi
Almanya'dan Türk müşteriye satış yapıyorsam, KVKK'ya göre **"Türkiye'de yerleşik veri sorumlusu temsilcisi"** atamam gerekiyor (Yönetmelik m.11). Genellikle bunu bir KVKK avukatlık bürosu ücret karşılığı sağlıyor.
- Bu zorunluluk pratikte ne kadar sıkı uygulanıyor?
- Atamadan satış yapsam Kurum'un öğrenme yolu nedir (rastgele denetim mi, şikayet mi)?

---

## Sizden Ricam

Aşağıdakilerden hangisi mümkünse:

1. **Genel yön:** Yukarıdaki üç soruya tecrübenizden yorum (telefon görüşmesi yeter).
2. **Avukat tavsiyesi:** İstanbul'da güvendiğiniz, KVKK + ticaret hukuku kesişimini bilen küçük/orta boy bir hukuk bürosu tavsiye edebilir misiniz? (Büyük bürolar fiyat olarak benim ölçeğime uymuyor; solo founder paketi arıyorum.)
3. **Yargısal öngörü:** Bir KVKK ihlal davası TR yargısında bugün tipik olarak ne kadar sürüyor, sonuç nasıl seyrediyor? Bu beni "çok temkinli" mi olmaya itmeli, yoksa "minimum yasal yeterlilik + büyüme" mı?

---

## Notlar

- Detaylı teknik döküman ayrıca hazır (`docs/COMPLIANCE.md`) — istemeniz halinde gönderirim, ancak sizin görüşünüz için gerekli değil.
- Vaktinizi alabilecek soruları **3 ana başlığa** indirdim; her biri 5 dakikalık sohbette cevaplanabilir.
- Buradaki amacım uzman hukuki görüş değil, **yön belirleme** — hangi konuyu ciddiye almalı, hangisini şu an erteleyebilirim?

Teşekkür ederim — kısa bir telefon görüşmesi bile çok yardımcı olur.

— Hasan
