# OpSolid · Müşteri Sunumu (TR)

19 slaytlık Türkçe müşteri sunumu. Danışmanlık ağırlıklı, "önce dinleriz" duruşunda.
Reveal.js, tek dosya HTML, dört mood paleti (dark / paper / image / data).

## Açma

- Çift tıkla: `index.html` (Chrome / Edge önerilir, font ve CDN için internet gerekir)
- Yerel sunucu: `mayai-website` dev açıkken `http://localhost:3000/decks/musteri-sunumu/`
- Canlı: `https://opsolid.de/decks/musteri-sunumu/`

## PDF dışa aktarma

1. Chrome'da aç
2. URL sonuna `?print-pdf` ekle, Enter
3. `Ctrl + P` → Hedef: PDF
4. Layout: Yatay · Kenarlık: Yok · Arka plan grafikleri: **Açık**

## Arka plan görselleri

`assets/img/` altında 8 JPEG bekleniyor. Yoksa CSS gradient fallback devreye girer.
Üretim brief'i: [`assets/img/PROMPTS.md`](assets/img/PROMPTS.md).

Beklenen dosyalar:
- `cover-bg.jpg`, `sectors-bg.jpg`, `close-bg.jpg`
- `sector-hospitality.jpg`, `sector-ecommerce.jpg`, `sector-manufacturing.jpg`,
  `sector-services.jpg`, `sector-realestate.jpg`

## Düzenleme

- Slaytlar `index.html`, sırayla 1-19.
- Tema `assets/theme.css`. Mood `<section data-mood="…">` ile seçilir
  (`dark` · `paper` · `image` · `data`).
- İkonlar inline SVG, dış görsel bağımlılığı yok.

## Bağlantı

Kapanış CTA → `https://opsolid.de/tr/contact` (Cal.com gömülü iletişim sayfası).
