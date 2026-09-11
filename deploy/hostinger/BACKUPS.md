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

Never restore a smoke-test dump into `opsolid-db` or its `opsolid` database.
The former example incorrectly targeted production despite calling the target
fresh. It has been removed.

Restore verification requires explicit authorization to create a restricted
backup and an isolated temporary copy of production data. Keep all bytes on
the VPS; never print/download the dump or restore errors containing rows.
Use a separately named container with the exact reviewed PostgreSQL image,
no network, no published ports, no production mounts, and temporary storage.
Run `pg_restore --exit-on-error --single-transaction --no-owner --no-privileges`
against that isolated target only. Validate the restored schema internally;
export only pass/fail and aggregate counts. Cleanup may target only the
freshly created, labelled verification container, never a production service.

The concrete staged recovery and access-control plan is recorded in
[`docs/ops/20260911-release-security-transition.md`](../../docs/ops/20260911-release-security-transition.md).

## Off-site copy (TODO)

Two-copy rule: one on the VPS, one off-site. Not in scope for this patch —
candidates are Hetzner Storage Box (already in use for Kutasia) or a
GPG-encrypted rsync to a Hostinger S3 bucket. Opening a tracking issue.
