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

Historical: this is how the server was first set up. Do not re-run any of it
on the live VPS. Releases follow "Release and follow-ups" below; rebuilding
in `/opt/opsolid-website` or editing its `docker-compose.yml` or `.env` breaks
the reviewed release and rollback chain.

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

## Release and follow-ups

There is no automatic deploy and no rebuild on the VPS. Merging to `main` runs
only "Verify web source (production disabled)" (`.github/workflows/deploy.yml`).
`git pull`, `docker compose up -d --build`, `scripts/deploy.sh` (retired, exits
with an error) and the old rsync/bootstrap workflow are not release paths.

1. **Image:** after the exact `main` push passes verification, the repository
   owner dispatches `build-runtime-image.yml` on `main` with the full `main`
   SHA as `commit`. The image exists only as a three-day workflow artifact.
   See [`docs/ops/hosted-runtime-image.md`](../../docs/ops/hosted-runtime-image.md).
2. **Private receive** (separately reviewed): authenticate the exact owner run
   and artifact, verify the hashes, `docker load`, re-check image ID, platform
   and OCI revision.
3. **App-only cutover** (separately reviewed), as root, with
   `scripts/ops/opsolid-app-cutover.py`:

   ```bash
   # Writes a new private forward/rollback packet; changes nothing live.
   python3 scripts/ops/opsolid-app-cutover.py --mode prepare-existing \
     --expected <private expected-identity file> \
     --candidate-image <loaded image> --commit <full sha> \
     --current-state <current packet dir> \
     --current-manifest-sha256 <its manifest hash>

   # Dry run, then the real switch after an independent release GO.
   python3 scripts/ops/opsolid-app-cutover.py --mode apply --state <new packet>
   python3 scripts/ops/opsolid-app-cutover.py --mode apply --state <new packet> --execute

   # Return to the previous image (dry run without --execute).
   python3 scripts/ops/opsolid-app-cutover.py --mode rollback --state <new packet> --execute
   ```

   `prepare-existing` keeps the complete live environment and database
   connection and changes only the image and `GIT_COMMIT`. The cutover
   recreates only the `opsolid` app container; a failed forward step rolls
   back automatically. It never builds, pulls, syncs source, runs migrations
   or `db-bootstrap.sh`, or changes roles and permissions. A schema change
   needs its own reviewed database step before the cutover.

**Keep `/opt/opsolid-website/docker-compose.yml` and `.env` byte-identical.**
The cutover script hashes both and refuses to continue when they differ from
the originals recorded in the current packet. A runtime env change is its own
reviewed ops change, not a hand edit.

### This release: `prepare-existing` only

Use only `--mode prepare-existing`. The original `--mode prepare` (new runtime
role) depends on `scripts/ops/opsolid-candidate-runtime.py --execute`, whose
smoke test still requires `/{de,en,tr}/signup` to answer 200. Since `/signup`
became a 301 to `/opso` (#42), that mode fails at stage `http_pages`.

`--current-state` is the packet named by the live container's
`com.docker.compose.project.config_files` label. A host reboot restarts the
same database container with a new start time and network endpoint;
`prepare-existing` accepts exactly that against the predecessor's baseline, while
identity, image, configuration, host configuration, mounts and network
membership must still match. Between a packet's own prepare and apply the exact
fingerprint still applies. The September 17 and 20 packets are accepted as
predecessors only together with the executable digest that wrote each of them.

The post-cutover proof (`READ_PROOF` in the cutover script) checks only
`/api/health` (exact commit, `dbOk: true`) and the database identity. After
`apply --execute`, check the public site by hand:

```bash
for p in /de /en /tr /de/agents /de/websites /de/blog /de/contact /de/opso /de/impressum /de/privacy; do
  printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://opsolid.de$p"   # expect 200
done
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://opsolid.de/de/signup  # expect 301 -> /de/opso
curl -sI 'https://opsolid.de/?geodebug=1' | grep -i -e '^location' -e '^x-opsolid-geo'  # 307 + country decision
curl -s https://opsolid.de/api/health                                                   # exact commit, dbOk true
```

### Follow-up (done)

Landed after the 2108def go-live in one reviewed ops change:

- `opsolid-candidate-runtime.py` `NODE_PROOF` now requests `opso`, `login` and
  the v4 `agents` page per locale (200), and `/de/signup` as a 301 to
  `/de/opso` (14 HTTP checks).
- `opsolid-app-cutover.py` `READ_PROOF` also requires `GET /de` to be 200
  `text/html`, so a broken marketing page cannot pass as verified.
- The live packet `app-cutover-d5434be240b94b7b934a886e` (written by script
  sha256 `bb958107…`) is registered in `LEGACY_PREDECESSORS`, so the next
  `prepare-existing` accepts it as predecessor.

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

- [`docs/ops/hosted-runtime-image.md`](../../docs/ops/hosted-runtime-image.md) — hosted image artifact and private receive.
- [`scripts/ops/opsolid-app-cutover.py`](../../scripts/ops/opsolid-app-cutover.py) — reviewed app-only cutover and rollback.
- [`BACKUPS.md`](./BACKUPS.md) — daily Postgres dump + 14d retention cron.
- [`CUTOVER.md`](./CUTOVER.md) — Stripe TEST → LIVE runbook. It predates the
  reviewed release path: do not run its `.env` edit and rebuild steps as
  written; the env swap needs a reviewed ops change.
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
