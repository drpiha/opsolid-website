# Manual Steps — Voice Agent Owner Checklist

Steps that cannot be automated. Do these in order before accepting the first paying customer.

---

## Phase 1: Account setup (once)

- [ ] **1. Create Retell account**  
  Go to https://retellai.com → Sign Up → verify email → add billing card.

- [ ] **2. Get Retell API key**  
  Retell Dashboard → Settings → API Keys → Create → copy.  
  Add to VPS `.env`: `RETELL_API_KEY=key_...`

- [ ] **3. Register webhook URL in Retell**  
  Retell Dashboard → Webhooks → Add:  
  URL: `https://opsolid.de/api/voice/webhooks/retell`  
  Enable all events. Save.

- [ ] **4. Generate VOICE_ADMIN_TOKEN**  
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Add to VPS `.env`: `VOICE_ADMIN_TOKEN=...`  
  Store in your password manager.

---

## Phase 2: First deployment (once)

- [ ] **5. Deploy to VPS**  
  Use the standard deploy workflow. See `deployment-checklist.md`.

- [ ] **6. Run prisma db push**  
  ```bash
  ssh vps "cd /opt/opsolid-website && docker-compose exec app npx prisma db push"
  ```
  Creates 14 new tables. Verify no errors.

- [ ] **7. Run seed**  
  ```bash
  ssh vps "cd /opt/opsolid-website && docker-compose exec app npx prisma db seed"
  ```
  Creates the 4 billing plans.

- [ ] **8. Smoke test admin**  
  Open: `https://opsolid.de/admin/voice?token=<VOICE_ADMIN_TOKEN>`  
  Should show empty tenant list.

---

## Phase 3: First customer setup

- [ ] **9. Create tenant**  
  `/admin/voice/new` → fill form → save.  
  Copy the tenant token from the detail page.

- [ ] **10. Buy or configure phone number**  
  Option A: Buy in Retell dashboard (+49 number ~$2/month).  
  Option B: Use customer's existing number with call forwarding (see `telephony-options.md`).

- [ ] **11. Set up call forwarding on customer's phone** (if using forwarding)  
  The customer must dial this code on their own mobile/landline:  
  Telekom/Vodafone: `**61*+49<retell_number_without_leading_0>#`  
  O2: `*61*+49<retell_number_without_leading_0>#`  
  
  Test: call the customer's number, don't pick up after 3 rings — AI should answer.

- [ ] **12. Import phone number in dashboard**  
  `/voice/[slug]/phone-numbers` → Import → select agent.

- [ ] **13. Configure agent + knowledge base**  
  See `customer-onboarding.md` for the relevant track (Generic/Restaurant/Clinic).

- [ ] **14. Make 5 test calls**  
  Use `/voice/[slug]/test-call`. Verify:
  - AI introduces itself correctly
  - AI answers common questions from the knowledge base
  - Call summary is generated after the call
  - Notification sent to the configured channel

- [ ] **15. Send welcome email to customer**  
  Template in `customer-onboarding.md`.

---

## Phase 4: Go live

- [ ] **16. Set `VOICE_AGENT_ENABLED=true`** in VPS `.env`
- [ ] **17. Monitor Sentry** for the first 48 hours after first real calls
- [ ] **18. Check billing tab** after first real calls — verify `VoiceUsageRecord` rows are created
- [ ] **19. Sign AVV** (data processing agreement) with the customer — see `gdpr-compliance.md`

---

## Monthly

- [ ] Check Retell invoice vs our `VoiceUsageRecord` totals — they should match (±10%)
- [ ] Check if any transcripts are past retention date → delete manually until auto-deletion is built
- [ ] Review Sentry for any recurring voice webhook errors
