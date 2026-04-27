# Retell AI Setup Guide

## 1. Create a Retell account

Go to https://retellai.com and sign up. You need a business email. Add billing/payment — Retell charges per minute of call time.

## 2. Get your API key

Dashboard → Settings → API Keys → Create new key. Copy it.

```env
RETELL_API_KEY=key_xxxxxxxxxxxxxxxx
```

## 3. Register the webhook URL

Dashboard → Webhooks → Add webhook:

- URL: `https://opsolid.de/api/voice/webhooks/retell`
- Events: check all — `call_started`, `call_ended`, `transcript_updated`, `recording_ready`, `error`
- Signing secret: copy it (Retell calls this the "webhook signing secret")

```env
RETELL_WEBHOOK_SECRET=whsec_xxxxxxxx  # Optional — we verify via RETELL_API_KEY HMAC
```

Signature verification uses `HMAC-SHA256(RETELL_API_KEY, rawBody)` → base64 → compare with `x-retell-signature` header. This is the standard Retell signature scheme.

## 4. Import or buy a phone number

In Retell dashboard: Phone Numbers → Import or Buy.

- **Buy**: Retell can provision a German number (+49) directly. ~$2/month.
- **Import (SIP)**: If the customer already has a number, they forward it to a Retell SIP address.
- **Import (Twilio/Telnyx)**: Bring your own Twilio/Telnyx number — see `telephony-options.md`.

After getting the number, go to the `/voice/[slug]/phone-numbers` page in the dashboard and import it there (this links it to the correct tenant and agent).

## 5. Create an agent in Retell

The dashboard at `/voice/[slug]/agents` does this for you via the "Sync to Provider" button. This calls `/api/voice/[tenantId]/agents/[agentId]/sync` which hits `provider.createAgent()`.

Alternatively you can create an agent manually in the Retell dashboard and paste the provider agent ID into the database.

## 6. Test

1. Go to `/voice/[slug]/test-call?token=...`
2. Enter a German mobile number
3. Click "Testanruf starten"
4. Your phone rings — the AI answers

If the call doesn't connect, check:
- `VOICE_TEST_CALL_ENABLED=true` feature flag is set for this tenant
- The agent has a `providerAgentId` set (sync must have run)
- The API key has call initiation permissions

## 7. Monitoring

Retell dashboard shows all calls with latency, transcripts, and errors. Our dashboard at `/voice/[slug]/calls` mirrors this with additional business-level processing.

Errors go to Sentry (`SENTRY_DSN` env var).

## Retell pricing (as of 2024)

| Plan | Minutes/month | Rate after |
|------|-------------|------------|
| Starter | Pay-as-you-go | ~$0.07/min |
| Scale | 1000 min | ~$0.05/min |

Our billing layer (`VoiceUsageRecord`) tracks this separately and applies the customer's plan pricing. The customer pays us; we pay Retell.
