# Arka plan görselleri – üretim brief'i

Deck'teki 8 `image` mood slaytı, `assets/img/` altındaki JPEG'leri arka plan olarak
bekler. Dosya yoksa CSS bir gradient fallback gösterir (deck yine çalışır, ton
çeşitliliği büyük ölçüde korunur). Görselleri eklemek deck'i tamamlar.

Tüm görseller:
- **1536x1024 px** (yatay 3:2). Reveal slaytı 1280x800, ekstra dolgu güvenli.
- **JPEG, kalite 80**, dosya başına 200-400 KB hedef.
- Doygunluk düşük (-20 ile -35 arası). Yarı saydam koyu overlay üstüne bineceği için
  ham görsel "fazla canlı" olmamalı.
- **Hiçbir görselde yazı, logo, sayı, grafik veya gerçek kişi yüzü olmayacak.**
- Tek tutarlı estetik: sofistike, sessiz, az kontrast, fine art photography hissi.

## image-generator agent çağrısı

8 görsel için tek brief ver, paralel üretilsin. Skill `gpt-image-1` kullanıyor,
`OPENAI_API_KEY` mayai-website projesinin `.env.local`'ından gelir.

### Ortak stil ekini her prompt'a ekle

> Cinematic fine art photography, low saturation, soft directional light,
> earthy industrial palette (oxidized copper, smoke grey, warm charcoal, bone),
> shallow depth of field, subtle film grain, no text, no logos, no people facing
> the camera, no graphics or UI. 3:2 horizontal, suitable as a dark overlay
> background.

### 8 görsel

| Dosya | Prompt çekirdek (yukarıdaki stil ekiyle birleştir) |
|---|---|
| `cover-bg.jpg`             | Abstract macro detail of weathered oxidized copper sheet, fine patina texture, soft side light, smoky grey background, industrial luxury mood. |
| `sectors-bg.jpg`           | Abstract still life composing five subtle textures together — linen, polished wood, brushed metal, paper, glass — overhead diffused light, calm editorial layout. |
| `sector-hospitality.jpg`   | Dim boutique hotel lobby at dusk, brass lamp glow, leather armchair detail in foreground, deep shadow, no people, tasteful European hospitality. |
| `sector-ecommerce.jpg`     | Clean retail back-of-house, neatly folded fabrics on shelves, a single open parcel box on a worktable, warm overhead light, minimal modern stockroom. |
| `sector-manufacturing.jpg` | Quiet small workshop interior, soft daylight from clerestory window, machined metal part on a wooden bench, scattered tools, fine dust in light. |
| `sector-services.jpg`      | Restrained professional office detail, leather portfolio and fountain pen on a walnut desk, single window light, library shelves blurred behind. |
| `sector-realestate.jpg`    | Modern European building facade at golden hour, stone and dark window frames, abstract architectural geometry, warm honey light raking across surface. |
| `close-bg.jpg`             | Tranquil evening table for two, warm candle glow, copper espresso cups, hands of two people in conversation (out of focus, no faces), inviting mood. |

### Boyut/kalite

```
size = 1536x1024
quality = high
output_format = jpeg
```

### Yerine koyma

Dosyaları `assets/img/` altına aynı isimlerle koy. CSS `--bg-image` değişkeni
`url('assets/img/<dosya>.jpg')` ile zaten bağlı, ek bir değişiklik gerekmez.

### Maliyet tahmini (gpt-image-1, high quality, 1536x1024)

Şu an için ≈ **\$0.19/görsel × 8 = \$1.50 toplam**. (OpenAI fiyatları değişebilir.)
