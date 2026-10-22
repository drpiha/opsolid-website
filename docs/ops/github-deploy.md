# Deploy production from GitHub (phone-friendly)

Workflow: **Deploy production (VPS)** (`.github/workflows/deploy-production.yml`).
Manual only (`workflow_dispatch`), runs only on `main`, only for the repository owner.
The existing `deploy.yml` stays validation-only and is not changed.

## What it does

1. Requires the input `confirm` to be exactly `DEPLOY`.
2. Re-runs the validation (audit:cards, lint, typecheck, cutover tests, build) and
   requires a green `Verify web source` run for the exact main commit.
3. Builds the runtime image on the hosted runner (`scripts/ops/build-runtime-image.cjs`,
   same gates as *Build runtime image*).
4. Over SSH: uploads image + the ops scripts of that commit, loads the image, runs
   `opsolid-app-cutover.py --mode prepare-existing`, a dry run, then `--mode apply --execute`.
   The script health-checks the app and **rolls back automatically** on failure.
5. The job **fails** (red, exit 1) if the cutover or health check fails. Only on success is
   the new packet recorded as the baseline for the next deploy.

No cutover script logic was changed. A new wrapper, `scripts/ops/remote-deploy.sh`, runs on the VPS.

## Repository secrets (Settings > Secrets and variables > Actions)

| Secret | Value |
| --- | --- |
| `DEPLOY_SSH_HOST` | VPS hostname or IP |
| `DEPLOY_SSH_USER` | `root`, or a user with passwordless `sudo` (the cutover script requires root) |
| `DEPLOY_SSH_PORT` | optional, default 22 |
| `DEPLOY_SSH_PRIVATE_KEY` | full private key (OpenSSH format) of a dedicated deploy key |
| `DEPLOY_SSH_KNOWN_HOSTS` | output of `ssh-keyscan -p <port> <host>` (pins the host key) |

Secrets are only passed via `env:` and never echoed. SSH material is deleted at the end of the job.
The job uses the GitHub environment `production`; you may add required reviewers there.

## One-time setup

1. Create a dedicated key on your machine: `ssh-keygen -t ed25519 -f opsolid-deploy -C opsolid-github-deploy -N ""`.
   Append `opsolid-deploy.pub` to `~/.ssh/authorized_keys` of the deploy user on the VPS.
   Paste the private file contents into `DEPLOY_SSH_PRIVATE_KEY`, then delete the local copy.
2. `ssh-keyscan <host>` (verify the fingerprint against the VPS) and paste into `DEPLOY_SSH_KNOWN_HOSTS`.
3. Add the other secrets above.
4. On the VPS create the baseline pointer once (as root), using the live packet and its
   verified manifest hash. `expected` is the private expected-state JSON you already use with
   `--mode prepare-existing`:

   ```bash
   install -m 600 /dev/null /var/backups/opsolid/app-cutover-current.json
   cat > /var/backups/opsolid/app-cutover-current.json <<'JSON'
   {"expected": "<path to existing expected.json>",
    "state": "/var/backups/opsolid/app-cutover-1a6a38b57fda46b6b8c39eac",
    "manifest_sha256": "98fc21caaddbe10548c0621699d3adf189b7fdb21e8f7a05049de34fe1491284"}
   JSON
   ```
   Re-check the manifest hash first (`sha256sum <state>/manifest.json`); use the packet that is
   currently live if a later one exists.

## Deploying from the phone

GitHub mobile > repository > Actions > **Deploy production (VPS)** > Run workflow >
branch `main`, type `DEPLOY`. The deploy job log ends with `deploy ok: <sha>` or fails.

## Failure handling

- `rollback_ok: true` in the log: previous version is serving again; the pointer is untouched.
- `manual_review_required: true`: log in to the VPS and follow the packet's `rollback` mode.
- Re-running is safe: the pointer only advances after a healthy deploy.

## Release-gate note

`docs/STATUS.md` records production as NO-GO until the DB role and backup/restore blockers
are cleared. This workflow only automates the existing reviewed cutover path; it does not
lift that gate. Do not run it until you have decided to.
