# Testing Checklist — Voice Agent

20-point manual test checklist. Run before every customer go-live.

## Setup

- [ ] `RETELL_API_KEY` set and valid
- [ ] `VOICE_ADMIN_TOKEN` set
- [ ] `prisma db push` ran successfully on target environment
- [ ] At least one `VoiceBillingPlan` row exists (run seed or create manually)

## Admin flow

1. [ ] `/admin/voice?token=<VOICE_ADMIN_TOKEN>` loads — shows tenant list (or empty state)
2. [ ] `/admin/voice/new?token=...` — create a test tenant → redirects to tenant detail
3. [ ] Tenant detail page shows correct slug, status, and tenant token

## Customer dashboard

4. [ ] `/voice/[slug]?token=<tenantToken>` redirects to `/overview`
5. [ ] Wrong token → 401 error page (not a crash)
6. [ ] Sidebar renders all nav items; active item is highlighted

## Agent management

7. [ ] Create agent via `/voice/[slug]/agents/new` — form submits, agent appears in list
8. [ ] Edit agent — changes saved, `updatedAt` changes in DB
9. [ ] "Sync to provider" button → `providerAgentId` populated in DB, `lastSyncedAt` set
10. [ ] Delete agent → removed from list

## Business hours

11. [ ] `/voice/[slug]/business-hours` — all 7 days shown with correct defaults
12. [ ] Toggle a day closed → save → reload → still closed
13. [ ] Change AI mode → save → reload → mode persisted
14. [ ] `shouldAiAnswerNow(tenantId)` — returns `true` during business hours, `false` outside (test by temporarily changing hours)

## Webhook flow (requires Retell API key + real call OR test payload)

15. [ ] POST a synthetic `call_started` payload to `/api/voice/webhooks/retell` with valid HMAC signature → `VoiceCall` row created
16. [ ] POST a synthetic `call_ended` payload → `processingStatus` transitions `pending → done`; `summaryText` populated; `VoiceUsageRecord` created
17. [ ] POST same `call_ended` again (idempotency test) → no duplicate records, no error

## Test call

18. [ ] `/voice/[slug]/test-call` — initiate test call to a real mobile number → call rings
19. [ ] After call ends → call appears in `/voice/[slug]/calls` with transcript

## Billing

20. [ ] `/voice/[slug]/billing` — shows correct month; day table shows calls after test call completes

## Error cases

- [ ] Invalid JSON to any API route → 400 response
- [ ] Missing token → 401 response (not a 500)
- [ ] Feature flag disabled → 403 response with `reason: "feature_disabled"`
- [ ] Retell API key missing in production → server logs clear error (not a silent failure)
