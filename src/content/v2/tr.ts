/**
 * TR — formal siz with -iniz endings. Institutional CTAs ("Görüşelim").
 * No tool-name dropping on the home hero. No period at end of headings.
 */

import type { V2Content } from "./en";

type V2Mirror = {
  -readonly [K in keyof V2Content]: V2Content[K] extends readonly unknown[]
    ? Array<unknown>
    : V2Content[K] extends object
      ? {
          -readonly [P in keyof V2Content[K]]: V2Content[K][P] extends readonly unknown[]
            ? Array<unknown>
            : V2Content[K][P] extends object
              ? Record<string, unknown> | Array<unknown>
              : string;
        }
      : string;
};

export const v2: V2Mirror = {
  home: {
    hero: {
      eyebrow: "Bağımsız otomasyon atölyesi",
      headline: [
        "Ekibinizin sırtından",
        "tekrarlanan işi —",
        "sessizce alıyoruz",
      ],
      lead: "Operasyonunuzu arka planda taşıyan araçları, akışları ve AI katmanını biz kuruyoruz. Sonra kimsenin 'çalıştı mı?' diye sormasına gerek kalmaz.",
      ctaPrimary: "Görüşelim",
      ctaSecondary: "Ne kuruyoruz",
      chips: ["Süreç otomasyonu", "Dahili araçlar", "AI danışmanlık", "Eğitim TR · DE · EN"],
    },
    pillars: {
      eyebrow: "Ne kuruyoruz",
      headline: "Dört disiplin, tek atölye",
      items: [
        {
          slug: "prozessautomatisierung",
          label: "Süreç otomasyonu",
          sub: "Tekrar eden işler arka planda kaybolur — kimsenin başlatmasına ya da hatırlamasına gerek kalmaz",
        },
        {
          slug: "interne-tools",
          label: "Dahili araçlar",
          sub: "Kırılgan tablolar yerine size özel uygulamalar — uyumluluk derdi olmadan",
        },
        {
          slug: "ki-beratung",
          label: "AI danışmanlık",
          sub: "AI'nın nerede gerçekten geri ödediğini, nerede sessizce bütçe yaktığını söyleriz",
        },
        {
          slug: "ki-schulungen",
          label: "Eğitim TR · DE · EN",
          sub: "Türkçe, Almanca ve İngilizce uygulamalı atölyeler — sistemi kullanacak insanlar için",
        },
      ],
      cardCta: "Aç",
    },
  },
  leistungen: {
    eyebrow: "Beş disiplin",
    headline: "Sizin için ne kuruyoruz",
    manifesto:
      "Beş disiplin, tek atölye. Operasyonunuza doğru kombinasyonu biz seçiyoruz — bazen tek bir araç, bazen tüm yığın.",
    services: [
      {
        index: "01",
        slug: "ki-beratung",
        label: "AI danışmanlık",
        sub: "AI'nın gerçekten geri ödediği yer",
      },
      {
        index: "02",
        slug: "prozessautomatisierung",
        label: "Süreç otomasyonu",
        sub: "Kendi kendine işleyen akışlar",
      },
      {
        index: "03",
        slug: "microsoft-365-automatisierung",
        label: "Microsoft 365",
        sub: "Outlook, Teams, SharePoint bağlı",
      },
      {
        index: "04",
        slug: "interne-tools",
        label: "Dahili araçlar",
        sub: "Excel tablosunu emekliye ayırın",
      },
      {
        index: "05",
        slug: "ki-schulungen",
        label: "AI eğitimi",
        sub: "Ekibiniz için uygulamalı seanslar",
      },
    ],
  },
  kiBeratung: {
    eyebrow: "AI danışmanlık",
    headline: "AI'nız hangi süreçleri devralabilir?",
    lead: "Operasyonunuza oturuyor, makine işi olması gereken işi buluyor ve AI'nın gerçekten geri ödediği yeri söylüyoruz — sunumda iyi durduğu yeri değil.",
    ctaPrimary: "Görüşelim",
    ctaSecondary: "Nasıl çalışıyoruz",
    terminal: {
      title: "session · ai-keşif",
      prompt: "$ opsolid tarama --derinlik=ops",
      lines: [
        "> 12 günlük akış okunuyor ...",
        "  bulundu: fatura girişi           28 dk/gün → otomatik",
        "  bulundu: müşteri yanıt sınıflama 44 dk/gün → otomatik",
        "  bulundu: stok mutabakat          35 dk/gün → otomatik",
        "  bulundu: hukuki inceleme                  → insan kalır",
        "  bulundu: fiyat istisnası                  → insan kalır",
        "> tahmin: haftada 11,3 saat tasarruf",
        "> sonraki adım: kickoff görüşmesi",
      ],
    },
  },
  prozess: {
    eyebrow: "Süreç otomasyonu",
    headline: "Kimsenin sevmediği işi emekliye ayırıyoruz",
    lead: "Formlar, tablolar, kopyala-yapıştır, 'rapor gönderildi mi acaba?' — bunları ekibinizin sırtından alıyor, otomatik raylara koyuyoruz.",
    ctaPrimary: "Görüşelim",
    ctaSecondary: "Nasıl çalışıyoruz",
  },
  microsoft365: {
    eyebrow: "Microsoft 365",
    headline: "Microsoft 365'iniz tek bir sistem olarak çalışır",
    lead: "Outlook, Teams, SharePoint, OneDrive, Forms, Planner — birbirine bağlanmış halde, böylece mesajlar, dosyalar ve onaylar uygulamalar arasında kaybolmaz.",
    ctaPrimary: "Görüşelim",
    ctaSecondary: "Nasıl çalışıyoruz",
    services: ["Outlook", "Teams", "SharePoint", "OneDrive", "Forms", "Planner"],
    hubLabel: "Orkestratör",
  },
  interneTools: {
    eyebrow: "Dahili araçlar",
    headline: "Şirketinizin üzerinde döndüğü tabloyu kaldırın",
    lead: "Herkesin paylaştığı, bozduğu, kopyaladığı Excel dosyasını — ekibinizin gerçekten açmak isteyeceği küçük, amaca özel bir araçla değiştiriyoruz.",
    ctaPrimary: "Görüşelim",
    ctaSecondary: "Nasıl çalışıyoruz",
    beforeLabel: "Tablo kaosu",
    afterLabel: "Sizin aracınız",
  },
};
