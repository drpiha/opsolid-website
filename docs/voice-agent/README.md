# Voice Agent — Product Overview

OpSolid Voice Agent is a B2B AI phone receptionist that answers inbound calls 24/7, handles appointment booking, takes messages, and routes complex calls to the right person.

## What it does

- Answers calls in German, Turkish, or English using a natural-sounding AI voice (Retell AI)
- Takes caller name, phone, reason for call
- Books appointments directly into Cal.com or sends a booking request by email
- Sends call summaries to the business owner via email, Telegram, or WhatsApp
- Logs every call with full transcript and AI-generated summary
- Escalates to a human via call transfer or SMS when needed

## Two modes

### Standalone Mode
Sold directly to any business. The customer gets a dashboard at `/voice/[slug]?token=...`. No accounts, no login — URL token only (same pattern as the digital card product).

### Kutasia Module Mode
Add-on for Kutasia CRM customers. Linked via `VoiceTenant.kutasiaOrderId`. Same dashboard, same API — just a different `mode` flag.

## Architecture

```
Customer calls phone number
    ↓
Retell AI answers (AI voice agent)
    ↓
Call ends → Retell sends webhook → /api/voice/webhooks/retell
    ↓
processCallEnded() pipeline:
  1. Fetch full call from Retell
  2. Save transcript + summary
  3. Extract structured fields (name, phone, appointment intent)
  4. Create appointment / callback task
  5. Send notifications (email + Telegram + WhatsApp)
  6. Write usage record for billing
    ↓
Customer views call log in dashboard
```

## Provider abstraction

All provider-specific code lives in `src/lib/voice/provider/`. The rest of the app only talks to the `VoiceProvider` interface.

| Provider | Status | File |
|----------|--------|------|
| Retell AI | Live | `provider/retell.ts` |
| Vapi | Skeleton (future) | `provider/vapi.ts` |
| Mock | Dev/test (no API key) | `provider/mock.ts` |

The factory `getVoiceProvider()` auto-selects: `RETELL_API_KEY` → Retell, `VAPI_API_KEY` → Vapi, else in dev → Mock, in production → throws.

## Database

14 Prisma models, all prefixed `Voice*`. Run `prisma db push` after first deploy. See `prisma/schema.prisma` for full schema. Key tables:

| Table | Purpose |
|-------|---------|
| `voice_tenants` | One row per customer |
| `voice_agents` | AI agent config, synced to Retell |
| `voice_phone_numbers` | Phone numbers assigned to agents |
| `voice_calls` | Every call — transcript, summary, extracted fields |
| `voice_usage_records` | Billing records, one per call |
| `voice_business_hours` | Weekly schedule + AI mode per day |

## URL structure

```
/voice/[slug]?token=...          Customer dashboard
/admin/voice?token=...           Platform operator (you)
/api/voice/webhooks/retell       Retell webhook (public, HMAC-verified)
/api/voice/[tenantId]/*          All tenant API routes
```

## Environment variables

See `.env.example` for the full list. Minimum to go live:
- `RETELL_API_KEY` — from your Retell dashboard
- `VOICE_ADMIN_TOKEN` — 64-char hex, kept secret
- `VOICE_AGENT_ENABLED=true`

## Running locally

```bash
# No RETELL_API_KEY needed — MockProvider auto-activates in dev
npm run dev
# Visit /admin/voice?token=<VOICE_ADMIN_TOKEN from .env>
```
