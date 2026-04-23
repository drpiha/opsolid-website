# OpSolid — Postgres backups

Daily gzipped `pg_dump` of the `opsolid-db` container, retained 14 days on the
VPS. Host-side cron, not inside Docker.

## Install (once, as root)

```bash
# 1) Make the script executable
chmod +x /opt/opsolid-website/deploy/hostinger/backup.sh

# 2) Prepare the output dir (the script also does this, but be explicit)
mkdir -p /var/backups/opsolid
chmod 700 /var/backups/opsolid

# 3) Install the cron entry
install -m 644 /opt/opsolid-website/deploy/hostinger/crontab.example \
  /etc/cron.d/opsolid-backup

# 4) (Optional) do a manual test run NOW
bash /opt/opsolid-website/deploy/hostinger/backup.sh
ls -lh /var/backups/opsolid
```

## Expected log line

```
[2026-04-23T03:00:02Z] backup start → /var/backups/opsolid/opsolid-20260423-0300.sql.gz
[2026-04-23T03:00:04Z] backup ok  /var/backups/opsolid/opsolid-20260423-0300.sql.gz (148213 bytes)
[2026-04-23T03:00:04Z] backup done (retention 14d)
```

## Restore

```bash
# Pick a dump and restore into a fresh DB (smoke test target):
gunzip -c /var/backups/opsolid/opsolid-20260423-0300.sql.gz \
  | docker exec -i opsolid-db psql -U opsolid -d opsolid
```

For a full DR test, spin up a throwaway Postgres container, stream the dump
into it, and point a local dev app at it before touching production.

## Off-site copy (TODO)

Two-copy rule: one on the VPS, one off-site. Not in scope for this patch —
candidates are Hetzner Storage Box (already in use for Kutasia) or a
GPG-encrypted rsync to a Hostinger S3 bucket. Opening a tracking issue.
