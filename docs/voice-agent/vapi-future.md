# Vapi — Future Provider

Vapi (vapi.ai) is a second voice AI provider. The integration skeleton is built but all methods throw `"not implemented"`. This document explains what's ready, what's missing, and how to enable it.

## What's built

- `src/lib/voice/provider/vapi.ts` — `VapiProvider` class implementing the full `VoiceProvider` interface
- All methods throw: `new Error("VapiProvider: createAgent not implemented")`
- Webhook signature: checks `x-vapi-secret` header against `VAPI_WEBHOOK_SECRET` env var
- `POST /api/voice/webhooks/vapi` — route exists, same ack-then-process pattern as Retell

## What's needed to activate

1. **Install Vapi SDK**: `npm install @vapi-ai/server-sdk`
2. **Implement `VapiProvider` methods** using Vapi's API (similar to Retell but different field names)
3. **Map Vapi webhook event types** to our `ParsedWebhookEventType` union
4. **Set env vars**:
   ```env
   VAPI_API_KEY=your-vapi-key
   VAPI_WEBHOOK_SECRET=your-vapi-webhook-secret
   VOICE_PROVIDER_VAPI_ENABLED=true
   ```
5. **Remove `RETELL_API_KEY`** from the environment (factory picks first available key)

## Key differences from Retell

| Concern | Retell | Vapi |
|---------|--------|------|
| Webhook signature | HMAC-SHA256(API_KEY, rawBody) | Static secret header |
| Agent creation | `POST /v2/create-agent` | `POST /assistant` |
| Call initiation | `POST /v2/create-phone-call` | `POST /call/phone` |
| Transcript field | `transcript_object` | `messages` array |
| Cost field | `cost` (cents) | `costs` array |

## Enabling per tenant

Set `VOICE_PROVIDER_VAPI_ENABLED=true` and `VOICE_DEFAULT_PROVIDER=vapi`. Individual tenants can also override via `VoiceTenant.featureFlags`:

```json
{ "VOICE_PROVIDER_VAPI_ENABLED": true }
```

## Why we built the skeleton

The `VoiceProvider` interface was designed provider-agnostic from the start. All business logic (billing, notifications, dashboard, webhooks) works with any provider that implements the interface. Switching providers in the future requires only filling in `vapi.ts` — nothing else changes.
