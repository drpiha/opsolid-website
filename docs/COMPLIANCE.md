# OpSolid + Verso — GDPR & KVKK Uyumluluk Dökümanı

**Son güncelleme:** 2026-05-10
**Sahip:** Hasan Dönmez
**Kapsam:** opsolid.de pazarlama sitesi + Verso (Dijital Kartvizit) ürünü
**Hukuk çerçevesi:** GDPR (AB) + KVKK (Türkiye) + DDG/MStV/TDDDG (Almanya) + DSA (AB) + B2C tüketici hukuku

> Bu döküman iki bölümden oluşur: **(1)** Claude'un bu commit ile koda/içeriğe yansıttığı düzeltmeler, **(2)** sizin (kurucu olarak) yapmanız gereken — kod dışındaki — somut aksiyonlar. İkinci bölüm tarihi/maliyet/iletişim adresleriyle birlikte verilmiştir.

---

## Bölüm 1 — Bu Commit ile Yapılan Değişiklikler

### Kod / İçerik
| Dosya | Değişiklik | Sebep |
|---|---|---|
| `src/lib/constants.ts` | `SITE_CONFIG.email`: `info@kutasia.com` → `info@opsolid.de` | Kritik bug — OpSolid privacy/impressum sayfaları yanlış email gösteriyordu |
| `src/content/{en,de,tr}.ts` impressum | TMG → DDG, RStV → MStV referansları; W-IdNr (Aralık 2026) hatırlatması; Einzelunternehmen i.Gr. açıklaması | DDG 14.05.2024'ten itibaren TMG'nin yerini aldı; MStV 2020'den beri RStV yerine geçerli |
| `src/content/{en,de,tr}.ts` privacy | Tamamen yeniden yazıldı: 7 → 12 bölüm. Yeni bölümler: Sub-Processors, International Transfer, KVKK m.11, Veri İhlali Bildirimi. Verso bölümüne 14 gün cayma + Withdrawal Button (19.06.2026) + public publication açık rıza eklendi. | 2026 standardına uyum; Verso B2C/B2B hibrit satış için zemin |
| `src/app/[locale]/privacy/PrivacyPage.tsx` | Section render mantığı: `content` ve `subsections` artık birlikte render edilebiliyor | Yeni Sub-Processors bölümünün intro paragrafı + alt liste yapısını desteklemek için |
| `src/components/shared/ConsentBanner.tsx` | Reject butonu `btn-ghost` (şeffaf) → solid neutral-900 dolgulu, accept butonu ile eşit görsel ağırlık | TDDDG § 25 + DSGVO eşit prominence kuralı; Alman DPA'ları transparent reject'i dark pattern sayıyor |

### Mevcut Olan ama Doğrulanması Gereken
- `src/lib/consent.ts` — sadece localStorage'a kayıt yapıyor; sunucu tarafı log yok. Bu yasal asgaride yeterli ama güçlü değil. Sonraki adım: `/api/consent-log` endpoint'i + DB tablosu (öncelik düşük).
- Ürün sayfasındaki form (`src/app/[locale]/products/digital-card/sections/OrderFormSection.tsx`) hâlâ derleme hatası veriyor (eksik radix-ui/embla/framer-motion bağımlılıkları). Bu commit kapsamı dışında — Verso self-serve order akışı tamamlandığında ele alınacak.

---

## Bölüm 2 — Sizin Yapmanız Gerekenler (Sırasıyla)

### Acil — Önümüzdeki 14 Gün

#### 1. Hostinger VPS'in fiziksel lokasyonunu doğrulayın
- **Niye:** Privacy policy "AB içinde" diyor ama hangi AB ülkesi olduğu yazılı değil. KVKK yurtdışı aktarım analizi için kritik.
- **Nasıl:** Hostinger control panel → VPS → Server Information; veya support ticket: "Please confirm in writing the physical data centre location of VPS at IP 72.62.0.111 (city + country) for our GDPR / KVKK records."
- **Çıktı:** Email yanıtını PDF olarak `docs/legal/hostinger-dc-location.pdf` altına dosyalayın.
- **Süre:** 1-2 gün.
- **Maliyet:** 0 €.

#### 2. Vercel DPA'yı indirip dosyalayın
- **Niye:** opsolid.de Vercel'de barındırılıyor, AVV (Art. 28 DSGVO) zorunlu.
- **Nasıl:** https://vercel.com/legal/dpa → "Download DPA" → PDF.
- **Çıktı:** `docs/legal/dpa/vercel-dpa-2026-05.pdf`.
- **Süre:** 5 dakika.
- **Maliyet:** 0 €.

#### 3. Hostinger DPA talep edin
- **Niye:** Verso uygulaması Hostinger VPS'te çalışacak, AVV zorunlu.
- **Nasıl:** support@hostinger.com'a yazın: "We require a Data Processing Agreement (DPA / AVV under Art. 28 GDPR) covering our VPS service. Please send the signed template."
- **Çıktı:** `docs/legal/dpa/hostinger-dpa-2026-XX.pdf`.
- **Süre:** Yanıt 1-3 gün.
- **Maliyet:** 0 €.

#### 4. Stripe DPA'sı (Verso ödemeleri için)
- **Niye:** Stripe Checkout entegrasyonundan ÖNCE DPA imzalanmış olmalı.
- **Nasıl:** https://stripe.com/legal/ssa → DPA bölümü, Stripe Services Agreement içine entegre. Ek olarak https://stripe.com/legal/data-processing dosyasını PDF olarak alın.
- **Çıktı:** `docs/legal/dpa/stripe-dpa-2026-05.pdf`.
- **Süre:** 10 dakika.
- **Maliyet:** 0 €.

#### 5. OpenAI / Anthropic DPA — sadece API kullanıyorsanız
- **Niye:** Eğer hâlâ ChatGPT Plus / Claude Pro ile ürün özellikleri test ediyorsanız, kullanıcı verisi aktarımı **hukuksuz**. Sadece API + paid hesap üzerinden gidin.
- **Nasıl:**
  - OpenAI: https://openai.com/policies/data-processing-addendum → form doldur, e-imza
  - Anthropic: https://anthropic.com/legal/dpa → form doldur, e-imza
- **Çıktı:** `docs/legal/dpa/openai-dpa-2026-XX.pdf` + `anthropic-dpa-2026-XX.pdf`.
- **Süre:** 30 dakika her biri.
- **Maliyet:** 0 € (form), API kullanımı kullanım bazlı.

---

### Önemli — Önümüzdeki 30 Gün

#### 6. Türk avukat ile ilk görüşme yapın
- **Niye:** Almanya'dan Türkiye'ye ürün satışında VERBİS, veri sorumlusu temsilcisi, KVKK standart sözleşmesi konularında uzman görüşü.
- **Nasıl:** İstanbul'da KVKK uzmanı boutique hukuk büroları (örn. Esenyel Partners, Eralp Hukuk, Gün+Partners). LinkedIn'den 3-5 büroya tek mesaj atın: "Almanya yerleşik Einzelunternehmen olarak TR pazarına SaaS satıyorum. KVKK + yurtdışı aktarım + temsilci konularında 1 saat ücretli ilk görüşme istiyorum, paket teklifinizi rica ederim."
- **Görüşmede sorulacak sorular:** [Ek A](#ek-a--türk-avukat-soru-listesi)
- **Süre:** 1-2 hafta randevu için, 1 saat görüşme.
- **Maliyet:** Tahmini 1.500-5.000 TL ilk görüşme; paket 50-150K TL.

#### 7. Alman Fachanwalt für IT-Recht ile ilk görüşme
- **Niye:** Datenschutzerklärung + Impressum + AGB hukuki onay; UG/GmbH geçiş kararı; Withdrawal Button uyum (19.06.2026 deadline).
- **Nasıl:** anwaltauskunft.de → "Fachanwalt für IT-Recht" filtresi + bölge. Boutique öneri: dury.de (Saarbrücken), spiegel-rechtsanwaelte.de (Köln), srd-rechtsanwaelte.de (Hannover). Tek mail: "Einzelunternehmen i.Gr. mit DSGVO-relevantem SaaS (B2C + B2B). Brauche Pauschalpreis für: (a) DSE/Impressum-Review, (b) AGB+Refund, (c) AVV-Inventar TIA, (d) Beratung UG/GmbH-Wechsel."
- **Görüşmede sorulacak sorular:** [Ek B](#ek-b--alman-avukat-soru-listesi)
- **Süre:** 1-2 hafta randevu, 1 saat görüşme.
- **Maliyet:** Saatlik 200-600 EUR (taşra), 600-1.200 EUR (Berlin/München); paket 1.500-4.000 EUR.

#### 8. Vergi danışmanı (Steuerberater) ile UG/GmbH kararı
- **Niye:** Einzelunternehmen olarak GDPR cezalarına karşı kişisel mal varlığınız hedef. UG/GmbH limited liability sağlar. Aynı zamanda Kleinunternehmer §19 UStG vs OSS B2C dijital hizmet satışı kararı vergi danışmanı + avukatı birlikte gerektirir.
- **Nasıl:** Bölgenizde IT/SaaS deneyimli Steuerberater. Datev üyesi tavsiye edilir. İlk soru: "Solo Founder mit ~XX TEUR Jahresumsatz, B2C dijital hizmet (DE+EU+TR pazarı): Einzelunternehmen-Risiko vs UG-Mehrkosten? Kleinunternehmer-Status mit OSS-Pflicht in Konflikt?"
- **Süre:** 1-2 hafta randevu, 1 saat görüşme.
- **Maliyet:** İlk görüşme 100-300 EUR; aylık retainer 100-400 EUR.

#### 9. Veri envanteri (RoPA — Verzeichnis von Verarbeitungstätigkeiten)
- **Niye:** Art. 30 GDPR — küçük şirket istisnası DAR yorumlanıyor; düzenli işleme varsa zorunlu.
- **Nasıl:** Notion / Google Sheet template. Her processing activity için:
  - Activity adı (örn. "İletişim formu", "Verso kart yayını", "Ödeme")
  - Veri sorumlusu / işleyen rolü
  - Veri kategorileri (ad, email, ödeme, foto, vs.)
  - Veri sahibi kategorileri (web ziyaretçisi, müşteri, lead)
  - İşleme amacı + Art. 6 yasal dayanak
  - Alıcılar / sub-processors
  - Yurt dışı aktarım (var/yok, hangi mekanizma)
  - Saklama süresi
  - TOMs özet (encryption, RBAC, vs.)
- **Şablon:** https://gdpr.eu/wp-content/uploads/2019/03/data-processing-activities-record-template.docx
- **Süre:** 4-8 saat.
- **Maliyet:** 0 €.
- **Çıktı:** `docs/legal/RoPA-2026.xlsx` veya Notion sayfası.

#### 10. Cookie consent server-side log
- **Niye:** localStorage tek başına ispat değeri zayıf. TDDDG § 25 dökümante edilebilir consent ister.
- **Nasıl:** `/api/consent-log` endpoint'i ekleyin; ConsentBanner içinden POST atın. DB tablosu: `id, sessionId (anonim), choice (accept/reject), version, ts, ipHash`. (Bu opsiyonel — kod tarafı işi, isterseniz Claude'a yaptırabilirsiniz.)
- **Süre:** 2-3 saat developer.
- **Maliyet:** 0 €.

---

### Sürdürülebilir — Önümüzdeki 90 Gün

#### 11. Verso Withdrawal Button (DEADLINE: 19.06.2026)
- **Niye:** AB tüketici hukuku — bu tarihten itibaren online sözleşme yapan her trader, 14 gün içinde tek tıkla cayma butonu sunmak zorunda.
- **Nasıl:** Hesap sayfasında "Aboneliğimden Cay" butonu + onay modal + iptal işlemi. Kayıt: cayma timestamp + sebep (opsiyonel).
- **Süre:** Verso self-serve akışı içinde 4-6 saat developer.
- **Maliyet:** 0 €.

#### 12. PCI-DSS SAQ-A self-assessment
- **Niye:** Stripe Checkout kullanıyorsanız zaten %95'i Stripe tarafından kapsanıyor. SAQ-A formu doldurmak müşteri sorularına "yes, PCI compliant" cevabı verir.
- **Nasıl:** https://www.pcisecuritystandards.org/document_library/?category=saqs#results → SAQ-A 2024 → 22 soruluk Excel form.
- **Süre:** 2-3 saat.
- **Maliyet:** 0 €.

#### 13. Stripe Tax aktive etme + OSS hazırlık
- **Niye:** AB B2C dijital hizmet satışında 10.000 EUR/yıl eşiği geçince OSS portal üzerinden alıcının ülkesi MwSt rate'i uygulanır. Stripe Tax bunu otomatik hesaplar.
- **Nasıl:** Stripe Dashboard → Tax → Activate → KDV/MwSt registration form.
- **Süre:** 30 dakika.
- **Maliyet:** Stripe Tax fee: 0.5% transaction (üstüne).

#### 14. Verso public profil için noindex + Search Console removal akışı
- **Niye:** Kart silindiğinde Google'da hâlâ index'lenmiş olabilir. "Right to be forgotten" gerekliliği.
- **Nasıl:** Kart silindiğinde route'a `noindex` header + Google Search Console URL Removal API çağrısı (opsiyonel).
- **Süre:** 2-4 saat developer.
- **Maliyet:** 0 €.

#### 15. Notice-and-takedown formu (Verso public profil için)
- **Niye:** DSA m.16 uyarınca her hosting service notice mekanizması sunmak zorunda (mikro/SME istisnası geçerli olsa bile bunu sunmak korunma sağlar).
- **Nasıl:** Site footer'da "Report Abuse" linki + form (içerik URL, şikayet sebebi, şikayetçi iletişim, beyan). Yanıt süresi 7 gün taahhüt.
- **Süre:** 4-6 saat developer.
- **Maliyet:** 0 €.

---

### Yıllık Tekrar Edenler

| Görev | Sıklık | Sorumluluk |
|---|---|---|
| Sub-processor listesini güncelle (yeni sağlayıcı eklendiğinde müşteriye bildirim) | Aylık kontrol | Siz |
| DPA dosyalarını gözden geçir (sözleşme renewal'leri) | Yıllık | Siz |
| Datenschutzerklärung review (avukat, küçük güncelleme) | Yıllık | Avukat |
| Data breach incident response tatbikatı | Yılda 1 | Siz |
| RoPA güncellemesi | Quarterly | Siz |
| KVKK Kurumu duyuruları takip (kvkk.gov.tr) | Aylık | Siz |
| BfDI / EDPB rehberlik takibi | Aylık | Siz |

---

## Sertifikasyon — Şu An Ne Yapmayın

- **ISO 27001 / 27701, SOC 2 Type II:** **YAPMAYIN.** Solo founder MVP aşamasında 6.000-40.000 € maliyet + 6-12 ay süre — pazar konumlanması için fayda/maliyet uygun değil.
- **Ne zaman yapın:** MRR €10K geçince Vanta/Drata/Sprinto trial başlat (compliance-as-code). 6 ay dökümantasyondan sonra ISO 27001 + 27701 birlikte git.
- **Hemen yapın:** PCI-DSS SAQ-A self-assessment (#12) — ücretsiz, anında.

---

## Ek A — Türk Avukat Soru Listesi

Bu listeyi LinkedIn / e-posta üzerinden ilk temas öncesi onlara gönderin; daha hızlı teklif alırsınız.

1. Almanya yerleşik Einzelunternehmen olarak TR pazarına SaaS satışı yaparken VERBİS kayıt zorunluluğum var mı? (50 çalışan altı + 100M TL altı)
2. Türkiye'de yerleşik veri sorumlusu temsilcisi atamak zorunda mıyım? Bu hizmeti siz veriyorsanız yıllık ücret nedir?
3. Stripe (IE/US), OpenAI (US), Anthropic (US), Hostinger (LT), Vercel (US) için **KVKK Standart Sözleşmesi** uygulamasını siz hazırlar + 5 iş günü içinde Kurum'a bildirir misiniz? Toplam maliyet?
4. KVKK 2026/347 ilke kararı (aydınlatma + açık rıza ayrımı) sonrası hazırladığım taslak metinleri denetleyebilir misiniz?
5. Verso (dijital kartvizit) ürünü için TR'de yerleşik tüketicilere satış yaparken ek lisans/izin (BTK, RTÜK, ESHS) gerek var mı?
6. Almanya'dan Türkiye'ye yazılım/dijital hizmet ihracatında **kazancın %80'i vergi matrahından düşülebilir** indirimi (KVK m.89/13) — bunu kullanmak için şahıs/ltd. yapı önerisi nedir?
7. Çocuk verisi (16-18 yaş arası) için açık rıza akışı nasıl olmalı? Verso B2B yetişkin ürünü, ama yine de yaş gate gerekli mi?
8. KVKK ihlal bildirimi için yazdığım runbook'u + 72h şablonu denetler misiniz?
9. Otomatik karar verme / profilleme özellikleri eklersem (ileride) DPIA + ek aydınlatma maddesi gerekir mi?
10. Bir veri ihlali olduğunda sizinle ne sürede iletişime geçmem gerekir, süreç akışı nasıl olur?
11. Toplam paket fiyatı (privacy + DPA + standart sözleşme + 1 yıl danışmanlık)? Saatlik tarife nedir? Aylık retainer mümkün mü?
12. Sizinle çalışan benzer (yurtdışı yerleşik, TR pazarına satan) müşterileriniz var mı?

---

## Ek B — Alman Avukat Soru Listesi

1. Einzelunternehmen i.Gr. olarak GDPR ihlal cezalarına karşı kişisel mal varlığım hedef midir? UG/GmbH'ye geçişin pratikte aciliyeti nedir?
2. Mevcut Datenschutzerklärung + Impressum'umu (`opsolid.de/de/privacy` + `/de/impressum`) Abmahnsicher hale getirmek için sabit fiyatlı paket sunabilir misiniz?
3. Verso B2C dijital hizmet sözleşmesinde **19.06.2026 Withdrawal Button** regülasyonuna uyum nasıl olmalı? Hazır şablon var mı?
4. Verso `/c/{slug}` public profil yayını joint controllership doğurur mu? (Kart sahibi = controller, OpSolid = controller veya processor?)
5. AGB + Refund Policy + Cookie Policy paketi sabit fiyatla yazımı?
6. Stripe DPF + Hostinger LT + OpenAI/Anthropic SCC için **TIA (Transfer Impact Assessment)** çıkartabilir misiniz?
7. **DSA SME exemption** ile Verso'nun yükümlülüklerini minimumda nasıl tutarım? Exemption hangi koşullarda kaybolur?
8. Verso public profilde 3. kişi verisi/foto yayınlandığında DSA notice-and-takedown akışı nasıl yapılandırılmalı? Hazır form template'iniz var mı?
9. **BDSG §38 eşik düşüşü** (31.12.2026 önerisi geçerse) Hasan'ı etkiler mi? DSB atama gerekecek mi?
10. **Kleinunternehmer §19 UStG** seçersem AB-içi B2C dijital hizmet OSS satışı nasıl etkilenir? (Bu konuda Steuerberater + avukat birlikte gerekli mi?)
11. Türkiye'den AB'ye veri akışı (Kutasia tarafı) GDPR ayağında ek yükümlülük getiriyor mu?
12. Veri ihlalinde **72h Meldung** — hangi Aufsichtsbehörde'ye? Hazır şablon?
13. **Free-tier ChatGPT/Claude Pro** kişisel hesaplara müşteri verisi gönderme yasağı — bu konuda yazılı bir görüş alabilir miyim (denetim/dava deliline karşı)?
14. ISO 27001 + 27701'e gitmeden önce hangi hukuki dökümanlar **MUST**-have, hangileri **NICE**-to-have?
15. Saatlik tarife? **Pauschale** (paket)? Yıllık retainer (DSB-as-a-service) modeliniz var mı?

---

## Ek C — Sub-Processor / DPA Envanter (Hedef Durum)

Bu tabloyu doldurarak `docs/legal/sub-processors.md` olarak bağımsız da tutabilirsiniz.

| Sağlayıcı | Hizmet | Lokasyon | DPA imzalı mı | DPF / SCC | Aktarım sebebi |
|---|---|---|---|---|---|
| Vercel Inc. | Marketing site hosting | US (DPF) | ☐ → İndir | DPF | Sözleşme ifası |
| Hostinger International | Verso VPS + Postgres | LT (AB) | ☐ → Talep et | — | Sözleşme ifası |
| Stripe Payments Europe | Verso ödemeler | IE → US | ☐ → İndir | DPF + SCC | Sözleşme ifası |
| OpenAI Ireland | AI özellikler (gerekirse) | IE → US | ☐ → İmzala | DPF + SCC | Sözleşme ifası |
| Anthropic Ireland | AI özellikler (gerekirse) | IE → US | ☐ → İmzala | DPF + SCC | Sözleşme ifası |
| SMTP relay (TBD) | Email gönderimi | TBD | ☐ | TBD | Sözleşme ifası |
| Cloudflare (eğer) | DNS / CDN | Global | ☐ | DPF | Meşru menfaat (güvenlik) |

---

## Ek D — TOMs (Technische und Organisatorische Maßnahmen) — Mevcut Durum

| Kategori | Önlem | Durum |
|---|---|---|
| Encryption at rest | Postgres TLS + disk encryption | Hostinger varsayılanı, doğrula |
| Encryption in transit | TLS 1.2+ zorunlu | ✓ HTTPS only, HSTS active |
| Access control | NextAuth session, RBAC | ✓ session.ts |
| Pseudonymization | Verso card slug = random | Doğrula |
| Backup | Postgres günlük yedek | Hostinger setup ile aktive et, 30 gün retention |
| Logging | Server logs 14 gün retention | Privacy'de yazıyor — gerçekten 14 gün cron'unu kur |
| Incident response | Runbook | Yazılması gerek (Bölüm 2 #16'da yok ama yıllık tekrar listesinde tatbikat var) |
| Vulnerability mgmt | npm audit + dependabot | GitHub'da otomatik aktif |

---

## Ek E — Data Breach Runbook (72-saat Şablonu)

Bir veri ihlali şüphesinde yapılacaklar:

1. **0-2 saat:** İhlali izole et — etkilenen sistemleri kapat, log'ları kaydet, kanıt topla.
2. **2-12 saat:** Kapsam değerlendirme — hangi veriler? kaç kişi? hangi yargı bölgesi?
3. **12-48 saat:** Karar — bildirim eşiği aşıldı mı (Art. 33 GDPR / KVKK)?
4. **48-72 saat:** Bildirimler:
   - Aufsichtsbehörde (Almanya): Bağlı olduğunuz Land otoritesi (örn. LfDI Niedersachsen)
   - KVKK Kurumu (Türkiye etkili): https://www.kvkk.gov.tr/Icerik/4187/Kisisel-Veri-Ihlali-Bildirim-Formu
   - Etkilenen kişilere (yüksek risk durumunda — Art. 34 GDPR)
5. **72-720 saat:** İletişim, müşteri desteği, kök sebep analizi, tedbir alma, rapor.

**Şablon e-posta + form alanları yıllık tatbikatla test edilmeli.**

---

## Sonuç ve İletişim

Bu döküman canlı bir araçtır. Yıllık tam review, üç ayda bir RoPA güncellemesi.

**Soru / katkı:** info@opsolid.de
**Bu commit:** Claude Code tarafından hazırlandı, 2026-05-10.
**Bir sonraki review:** 2026-08-10 veya VPS lokasyonu / avukat görüşmesi sonrası (hangisi önce ise).
