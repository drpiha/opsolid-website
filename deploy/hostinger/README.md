# OpSolid Website — Hostinger VPS deploy

This folder documents how the site runs on the same Hostinger VPS that hosts
Kutasia. The pattern mirrors `/opt/kutasia/`:

- Dedicated Postgres container (`opsolid-db`)
- Next.js app container (`opsolid-app`)
- Both on a private `internal` network; the app also joins `root_default`
  so the shared Traefik reverse proxy (`root-traefik-1`) can route
  `opsolid.de` and `www.opsolid.de` to it.
- Auto-TLS via Traefik's Let's Encrypt (`mytlschallenge` cert resolver).

## First-time setup on the VPS

```bash
# 1) Give the VPS read access to the GitHub repo
#    The pubkey lives at /root/.ssh/opsolid_deploy.pub — add it as a
#    read-only Deploy key on github.com/drpiha/opsolid-website.
cat /root/.ssh/opsolid_deploy.pub

# 2) Clone
mkdir -p /opt && cd /opt
GIT_SSH_COMMAND='ssh -i /root/.ssh/opsolid_deploy' \
  git clone git@github.com:drpiha/opsolid-website.git

# 3) Write /opt/opsolid-website/.env (see env.example below)
nano /opt/opsolid-website/.env
chmod 600 /opt/opsolid-website/.env

# 4) Create the uploads volume dir on the host
mkdir -p /var/www/opsolid/uploads

# 5) Launch
cd /opt/opsolid-website
docker compose up -d --build

# 6) Bootstrap the DB (idempotent — init schema + patch + seed templates).
#    This replaces the old `prisma migrate deploy`-on-boot CMD that kept
#    crashing with `Cannot find module 'effect'` in the runtime image.
bash deploy/hostinger/db-bootstrap.sh

# 7) Check logs
docker logs -f opsolid-app
```

## env.example (runtime secrets)

```env
# --- App ---
NEXT_PUBLIC_SITE_URL=https://opsolid.de

# --- DB ---
OPSOLID_DB_PASSWORD=generate-a-64-char-random-string
DATABASE_URL=postgresql://opsolid:OPSOLID_DB_PASSWORD_HERE@opsolid-db:5432/opsolid?schema=public

# --- Stripe (TEST first; swap for LIVE when going to production) ---
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# --- Admin panel ---
ADMIN_TOKEN=another-long-random-string

# --- SMTP (reuses the Kutasia pattern) ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@opsolid.de
SMTP_PASS=google-app-password
CONTACT_TO_EMAIL=admin@opsolid.de

# --- Notifications (optional but recommended) ---
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
WHATSAPP_PHONE=4917631020654
WHATSAPP_CALLMEBOT_APIKEY=...
```

## Update deploy

After code changes are pushed to GitHub:

```bash
cd /opt/opsolid-website
GIT_SSH_COMMAND='ssh -i /root/.ssh/opsolid_deploy' git pull
docker compose up -d --build

# If this pull contains schema SQL changes (new file under prisma/patch_*.sql
# or an edited init.sql), re-run the bootstrap — it's idempotent:
bash deploy/hostinger/db-bootstrap.sh
```

## DNS checklist

- `opsolid.de` A record → `72.62.0.111`
- `www.opsolid.de` A record → `72.62.0.111`
- IPv6 (`AAAA`) optional: `2a02:4780:c:9789::1`

## Stripe webhook

After first deploy, verify the webhook endpoint resolves:
```bash
curl -I https://opsolid.de/api/webhooks/stripe
```

Should return `405 Method Not Allowed` (GET not supported — POST only).
That's a green signal that Traefik + the app are responding for the domain.

Then in the Stripe dashboard, "Send test webhook" against the endpoint.

## Operational docs

- [`BACKUPS.md`](./BACKUPS.md) — daily Postgres dump + 14d retention cron.
- [`CUTOVER.md`](./CUTOVER.md) — Stripe TEST → LIVE runbook.
- [`crontab.example`](./crontab.example) — the cron entry for backups.
- [`db-bootstrap.sh`](./db-bootstrap.sh) — idempotent schema + seed runner.
- [`backup.sh`](./backup.sh) — the actual backup script (run by cron).

## Health check

```bash
curl -s https://opsolid.de/api/health
# {"ok":true,"commit":"<git-sha-or-unknown>","dbOk":true}
```

Point UptimeRobot or the VPS's own cron at this URL to get alerted when the
app is up but the DB is unreachable (or vice versa).
