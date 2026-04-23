# Yeni Bilgisayara Geçiş — OpSolid Website

Bu döküman, projeyi **başka bir bilgisayara** aldığınızda sıfırdan eksiksiz devam edebilmeniz için. Tek bir Claude Code oturumuna da "bu dosyayı oku ve yap" diyerek verebilirsiniz.

---

## 1. Ortam

- **OS**: Windows (bash/Git Bash kurulu) veya macOS/Linux (fark yok)
- **Gereken araçlar**: Git, Node.js 22+ (veya Volta/nvm), npm. Opsiyonel: GitHub CLI
- **GitHub erişimi**: `drpiha/opsolid-website` **özel** repo. HTTPS + PAT (`repo` scope) yeterli. Yeni PAT: https://github.com/settings/tokens/new

---

## 2. Clone + secrets kurulumu (5 dakika)

```bash
# 2.1 Klonla
git clone https://github.com/drpiha/opsolid-website.git
cd opsolid-website

# 2.2 Bundle branch'ini çek (VPS key + Stripe key + admin token içinde)
git fetch origin bundle-one-time
git checkout bundle-one-time

# 2.3 Secretleri HOME klasörüne yerleştir (bash/zsh)
bash .transfer/install.sh
# Windows PowerShell kullanıyorsanız:
#   copy .transfer\id_ed25519_opsolid     $env:USERPROFILE\.ssh\id_ed25519_opsolid
#   copy .transfer\id_ed25519_opsolid.pub $env:USERPROFILE\.ssh\id_ed25519_opsolid.pub
#   copy .transfer\stripe-token           $env:USERPROFILE\.stripe-token
#   copy .transfer\opsolid-deploy-secrets $env:USERPROFILE\.opsolid-deploy-secrets

# 2.4 main'e geri dön ve bundle'ı hem local hem remote'da SİL
git checkout main
git branch -D bundle-one-time
git push origin --delete bundle-one-time

# 2.5 Bağlantıyı doğrula
ssh -i ~/.ssh/id_ed25519_opsolid root@srv1150632.hstgr.cloud 'echo SSH_OK; docker ps --filter name=opsolid'
# Beklenen: SSH_OK + "opsolid-app (Up ...)" + "opsolid-db (Up ...)"
```

**Önemli**: Bundle branch silinmeden secrets GitHub'da duruyor. Repo özel olsa da risk var — adım 2.4'ü atlamayın.

---

## 3. Kod yapısını anlayın (15 dakika okuma)

Şu 4 dosyayı **sırasıyla** okuyun — her biri farklı soruyu cevaplıyor:

1. **`docs/STATUS.md`** — bugün itibariyle ne canlı, ne bekliyor. Tek kaynak.
2. **`docs/NEXT_SESSION_HANDOFF.md`** — önceki oturumdan gelen 5-track plan. Track A/B/C/D tamamlandı (`feat/complete-dbc` dalında), Track E yarıda kalmış.
3. **`docs/ORDER_FLOW.md`** — müşteri → ödeme → tasarım review → yayın akışının anlatımı. "Biri sipariş verdi, bundan sonra ne olur?" sorusuna cevap.
4. **`deploy/hostinger/README.md`** — VPS'te kurulu sistemin detayı.

---

## 4. Repo durumu (2026-04-23 sonrası)

### Dallar

| Dal | Ne içerir | Kim kullandı |
|---|---|---|
| `main` | İlk sürüm + URL fix + middleware fix + admin detail page + handoff docs | Önceki Claude oturumu |
| `feat/complete-dbc` | **Main'in önünde.** Track A (Kutasia federation), B (email), C (design review), D (self-edit + OG + cancel) tamamlandı. Track E yarıda (Sentry, backup, stats). | Paralel agent takımı oturumu |

Buradan devam için **`feat/complete-dbc`** dalına geçin:
```bash
git checkout feat/complete-dbc
git pull
```

### Track durumları

- ✅ **Track A** (Kutasia admin unification) — commit `2bd1642`
- ✅ **Track B** (email pipeline) — commit `2bd1642` (birleşik)
- ✅ **Track C** (AWAITING_DESIGN review stage) — commit `ee8e445`
- ✅ **Track D** (self-edit + OG + cancel) — commit `e51201f`
- 🔄 **Track E** (Sentry + backup + stats + LIVE cutover) — uncommitted dosyalar var, başka oturumda devam ediyordu. `git status`'te göreceksiniz.

---

## 5. Canlı sistem özeti

- **Site**: https://opsolid.de (DE/EN/TR üç lokal, otomatik locale detect)
- **VPS**: `root@srv1150632.hstgr.cloud` (= `72.62.0.111`), Docker + Traefik
- **Container'lar**: `opsolid-app` (Next.js 14 standalone) + `opsolid-db` (Postgres 16)
- **Stripe**: **TEST** modu. 5 ürün × 3 fiyat (monthly €5-7, yearly €39-59, one-time €79-129)
- **Admin (opsolid kendi)**: `https://opsolid.de/admin/orders?token=<ADMIN_TOKEN>` (token `~/.opsolid-deploy-secrets` içinde)
- **Admin (Kutasia içinden)**: `https://kutasia.com/admin/opsolid-orders` (SUPER_ADMIN rolü gerekli) — Track A'dan sonra. Bu tercih edilir.
- **SSL**: Let's Encrypt, otomatik yenilenir (22 Jul 2026'ya kadar geçerli)
- **Test siparişi**: https://opsolid.de/c/claude-test-eokd (PUBLISHED, önceki oturumda üretildi)

---

## 6. Paralel oturumdaki "Track E" işi — dikkat

`feat/complete-dbc` dalında **uncommitted** dosyalar var:
- `Dockerfile` (effect modülü fix)
- `next.config.mjs` (Sentry ile sarılmış)
- `sentry.{client,server,edge}.config.ts` + `instrumentation.ts` (yeni)
- `deploy/hostinger/{BACKUPS,CUTOVER}.md` + `backup.sh` + `db-bootstrap.sh` + `crontab.example` (yeni)
- `src/app/admin/stats/` + `src/app/api/m2m/stats/` + `src/app/api/health/` (yeni)
- `src/lib/stats.ts` (yeni)
- `scripts/setup-stripe.ts` (LIVE mode bayrağı eklenmiş)

Bunlar **önceki oturumun arka planda çalışan agent'ı tarafından üretildi, henüz commit edilmedi**. Yeni makineye pull ettiğinizde **görmezsiniz** (sadece git'teki commit'lenmiş hali gelir).

- Eğer paralel oturum bu işi bitirmişse → bir sonraki `git pull`'da commit olarak gelir.
- Bitirmemişse → siz `docs/NEXT_SESSION_HANDOFF.md`'deki **Track E** bölümünü tekrar uygulayabilirsiniz (veya atlayıp yalnızca LIVE cutover'a odaklanabilirsiniz — Track E zaten opsiyonel observability).

---

## 7. İlk çalıştırma (dev modu)

```bash
git checkout feat/complete-dbc
npm ci
npx prisma generate
npm run dev
# http://localhost:3000 açılır. DB local'de yoksa sadece marketing sayfaları çalışır.
```

Sipariş akışını local'de test etmek için `.env.local` oluşturun:
```env
DATABASE_URL=postgresql://opsolid:bda8b35a942e1fceb7b677829deccdb281b3ecef061c1167@srv1150632.hstgr.cloud:5432/opsolid?schema=public
STRIPE_SECRET_KEY=sk_test_...  (~/.stripe-token satır 1)
STRIPE_WEBHOOK_SECRET=whsec_... (~/.opsolid-deploy-secrets içinde)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (~/.stripe-token satır 2)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_TOKEN=... (~/.opsolid-deploy-secrets içinde)
```

> **Uyarı**: Yukarıdaki DATABASE_URL **canlı DB**'ye bağlanır (SSH tunnel yok). Local test için yeni bir DB kurmanız iyi olur. Prod DB'ye yanlış migration atmayın. Güvenli alternatif:
> ```
> ssh -L 5432:localhost:5432 -i ~/.ssh/id_ed25519_opsolid root@srv1150632.hstgr.cloud
> ```
> sonra `DATABASE_URL=postgresql://opsolid:...@localhost:5432/opsolid` — ama test değil, canlıya dokunuyorsunuz.

---

## 8. Deploy — yapılan değişiklik VPS'e nasıl gider

`feat/complete-dbc` dalında değişiklik yaptıysanız:

```bash
git push origin feat/complete-dbc
# VPS'e:
ssh -i ~/.ssh/id_ed25519_opsolid root@srv1150632.hstgr.cloud <<'EOF'
cd /opt/opsolid-website
GIT_SSH_COMMAND='ssh -i /root/.ssh/opsolid_deploy' git fetch
GIT_SSH_COMMAND='ssh -i /root/.ssh/opsolid_deploy' git checkout feat/complete-dbc
GIT_SSH_COMMAND='ssh -i /root/.ssh/opsolid_deploy' git pull
docker compose up -d --build opsolid
docker logs opsolid-app --tail 20
EOF
```

Şema değişikliği varsa `docker exec -i opsolid-db psql -U opsolid -d opsolid < prisma/patch_*.sql` (idempotent patch dosyaları var).

---

## 9. Henüz yapılmamış — sizin / yeni oturumun bitirmesi gereken

Öncelik sırasına göre:

1. **Gerçek şablon tasarımları** — `src/components/cards/templates/Template0{1..5}.tsx` şu an stilize iskelet. Gerçek handcrafted tasarımları ekleyin. `public/images/templates/card-0{1..5}.png` thumbnail'leri de.
2. **SMTP'yi doldur** — `/opt/opsolid-website/.env` içinde `SMTP_*` boş olabilir. `~/.opsolid-smtp` dosyanız varsa kullanın, yoksa bir Gmail App Password oluşturup ekleyin. Restart: `docker restart opsolid-app`.
3. **Track E tamamla** (opsiyonel ama tavsiye) — Sentry DSN, backup cron, stats page, health endpoint. `docs/NEXT_SESSION_HANDOFF.md` § 4-Track E'ye bak.
4. **LIVE Stripe cutover** — `scripts/setup-stripe.ts --live sk_live_...` → `.env` değişkenlerini yeni ID'lerle güncelle → `docker restart opsolid-app`. Detay: `deploy/hostinger/CUTOVER.md` (paralel oturum yazdıysa).
5. **Kutasia integration'ını test et** — `kutasia.com/admin/opsolid-orders` sayfası siparişleri gerçekten getiriyor mu? Getirmiyorsa Kutasia `.env`'inde `OPSOLID_ADMIN_API_URL` + `OPSOLID_ADMIN_API_TOKEN` doğru mu?
6. **Gerçek test siparişi** — tarayıcıdan https://opsolid.de/tr/products/digital-card → şablon seç → form doldur → Stripe test kart `4242 4242 4242 4242` → thanks sayfası → Kutasia admin'de görün → "Publish" bas → müşteriye e-posta gitti mi?

---

## 10. Claude Code oturumunu yeniden başlatmak

```bash
cd opsolid-website
claude
```

İlk prompt olarak (tek satır):
```
projects/opsolid/opsolid-website/docs/NEW_MACHINE_PULL.md ve docs/NEXT_SESSION_HANDOFF.md oku. Devam edeceğimiz şey: feat/complete-dbc dalına geç, Track E'yi bitir (Sentry + backup + stats + health + CUTOVER doc), sonra LIVE cutover'ı yardımcı ol. Önce git status ile paralel oturumun ne kadarını commit etmiş olduğunu gör.
```

Memory dosyaları (`~/.claude/projects/.../memory/`) — bu repo için daha önce yazılmış not'ları taşıyın:
- `project_opsolid_website.md` — proje kimliği
- `project_kutasia.md` — Kutasia proje kimliği
- `feedback_infra_preferences.md` — VPS self-host tercihi
- `MEMORY.md` — index

Eski makinenin `.claude` klasöründen kopyalayabilir veya `/remember` komutuyla yeniden tarif edebilirsiniz.

---

**Son kontrol listesi (yeni makineye geçiş tamam mı?):**
- [ ] `git clone` + `main` çalıştı
- [ ] `.transfer/install.sh` çalıştı, 4 dosya `$HOME`'a yerleşti
- [ ] **`bundle-one-time` branch hem local hem remote silindi**
- [ ] `ssh root@srv1150632.hstgr.cloud` çalışıyor
- [ ] `https://opsolid.de` tarayıcıdan açılıyor, test siparişi görünüyor
- [ ] `git checkout feat/complete-dbc` + `git pull` yapıldı
- [ ] `docs/STATUS.md` okundu, güncel durum netlendi
