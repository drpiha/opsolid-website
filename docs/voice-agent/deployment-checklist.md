# Deployment Checklist — Voice Agent

Run this every time you deploy a version that includes Voice Agent changes.

## Pre-deploy (local)

- [ ] `npm run build` passes — no TypeScript errors, no ESLint errors
- [ ] All new Prisma models are in `prisma/schema.prisma`
- [ ] `.env.example` is up to date with any new variables

## VPS deploy

1. **Upload code** (existing workflow):
   ```bash
   tar -czf /tmp/deploy.tar.gz .
   scp /tmp/deploy.tar.gz vps:/opt/opsolid-website/
   ssh vps "cd /opt/opsolid-website && tar -xzf deploy.tar.gz && docker-compose up -d --build"
   ```

2. **Run Prisma migration** (required on first deploy of Voice Agent):
   ```bash
   ssh vps "cd /opt/opsolid-website && docker-compose exec app npx prisma db push"
   ```
   This creates the 14 Voice tables. Safe to re-run — idempotent.

3. **Seed billing plans** (required once):
   ```bash
   ssh vps "cd /opt/opsolid-website && docker-compose exec app npx prisma db seed"
   ```

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
VOICE_ENABLE_RECORDING=false
VOICE_DEFAULT_RETENTION_DAYS=90
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

If something breaks:
```bash
ssh vps "cd /opt/opsolid-website && git stash && docker-compose up -d --build"
```
The database changes (new tables) are additive — rollback does not break existing functionality.
