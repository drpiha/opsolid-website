# Deployment Checklist — Voice Agent

Run this every time you deploy a version that includes Voice Agent changes.

## Pre-deploy (local)

- [ ] `npm run build` passes — no TypeScript errors, no ESLint errors
- [ ] All new Prisma models are in `prisma/schema.prisma`
- [ ] `.env.example` is up to date with any new variables

## VPS deploy

1. **Ship code** only through the reviewed release path in `README.md`
   ("Deployment"): hosted runtime image, private receive, app-only cutover.
   Uploading source to the VPS or `docker compose up -d --build` there is
   retired and breaks the release and rollback chain.

2. **Database schema** (the 14 Voice tables): the cutover never touches the
   database. Creating the tables in production (`prisma db push` or a patch
   SQL) needs its own reviewed database step with a fresh backup first; do not
   run it from this checklist.

3. **Seed billing plans** (required once): also a reviewed database step, not
   part of a release.

4. **Verify healthcheck**:
   ```bash
   curl https://opsolid.de/api/health
   # Should return 200
   ```

## Environment variables (add to VPS .env)

```env
VOICE_AGENT_ENABLED=true
VOICE_ADMIN_TOKEN=<64-char hex>
VOICE_DEFAULT_PROVIDER=retell
RETELL_API_KEY=<from Retell dashboard>
VOICE_PUBLIC_BASE_URL=https://opsolid.de
VOICE_ANALYTICS_ENABLED=true
VOICE_TEST_CALL_ENABLED=true
```

Generate `VOICE_ADMIN_TOKEN`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Post-deploy smoke test

- [ ] `https://opsolid.de/admin/voice?token=<VOICE_ADMIN_TOKEN>` loads
- [ ] Create one test tenant
- [ ] Test tenant dashboard at `/voice/[slug]?token=...` loads
- [ ] Check Sentry — no new errors after deploy

## Retell webhook registration

After first deploy, register the webhook URL in Retell dashboard:
- URL: `https://opsolid.de/api/voice/webhooks/retell`
- This only needs to be done once per Retell account

## Rollback

If something breaks, roll the app back with the reviewed cutover packet
(`scripts/ops/opsolid-app-cutover.py --mode rollback --state <packet>`, dry run
first, then `--execute`); see `deploy/hostinger/README.md`.
The database changes (new tables) are additive — rollback does not break existing functionality.
