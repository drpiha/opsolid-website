# Phase 7.8 — Bug Fixes, Customization & Template Expansion

## User-Reported Issues (kategorize)

### A) Critical bugs (yöneten/manager düzeltir)
- **A1** Foto/logo yükleme alanı: tek alan görünüyor, hangisi olduğu belli değil. İki ayrı alan + net etiket olmalı.
- **A2** Yüklenen resim kart önizlemesinde görünmüyor (data URL preview broken).
- **A3** Renk paletinden ana rengi değiştirmek kart önizlemesinde yansımıyor.
- **A4** Studio (id=6) ve potansiyel diğer şablonlarda kontrast sorunu — siyah arka planda telefon bilgisi okunmuyor.
- **A5** Template her seçildiğinde step 1'e döndürmek can sıkıcı. Sadece ilk seçimde yap.

### B) Önizleme & UX (yöneten düzeltir)
- **B1** Localhost'ta ödeme tamamlanamıyor → kartın gerçek halini göremeden satın alamıyor. **Public preview route** lazım: `/preview/[templateId]?data=...` payment olmadan.
- **B2** Sticky thumbnail yetersiz. **Full-screen modal preview** (tıklayınca açılan, scroll edilebilen, gerçek boyutlu).
- **B3** Kart üzerindeki ifadeler ("Save my contact", "Add to Wallet" vs.) sadece Almanca. Çok dilli olmalı + ziyaretçi default dil seçebilmeli.

### C) Customization (yöneten düzeltir, küçük scope)
- **C1** Manuel resim ayarlama (zoom + position, profesyonelce).
- **C2** Custom başlık/alan ekleme — örn: "Çekim Talebi" başlığı yeniden adlandırılabilir veya yeni bölüm eklenebilir.
- **C3** Custom alanlara foto/video yükleme.
- **C4** Tipografi (font size, color) customization.

> Not: C1-C4 büyük scope. Bu fazda **C1 + C2'nin minimal MVP**'si yapılacak. C3-C4 Phase 7.9'a ertelenecek.

### D) Yeni template'ler (designer takım üretir)
8 yeni şablon, 4 paralel agent tarafından:
- **Agent 1 — Service Sectors:** Restaurant, Hotel
- **Agent 2 — Tech & Modern:** Tech Startup, Developer
- **Agent 3 — Health & Wellness:** Yoga Studio, Personal Trainer
- **Agent 4 — Creative & Lifestyle:** Music Producer, Wedding Planner

### E) Audit (auditor agent yapar)
- Tüm 12 mevcut template kontrast/responsiveness için audit
- Yeni 8 template entegrasyon + qualite kontrolü
- Bug raporu → yöneten

---

## Execution Plan

### STEP 1 — Background: Designer takım çalıştır (4 paralel agent)
### STEP 2 — Foreground: Yöneten kritik bugları düzeltir (A1-A5)
### STEP 3 — Foreground: Önizleme iyileştirmeleri (B1-B3)
### STEP 4 — Foreground: Mini customization (C1, C2 minimal)
### STEP 5 — Designer agent'lar bitince: integrasyon + auditor agent
### STEP 6 — Auditor raporu → yöneten son düzeltmeleri yapar
### STEP 7 — `npx tsc --noEmit` + `npm run build` + dev server restart
