# Voice Agent API Reference

All tenant routes require `Authorization: Bearer <apiToken>` or `?token=<tenantToken>` in the URL.

Admin routes require `?token=<VOICE_ADMIN_TOKEN>`.

Response format: `{ data: ... }` on success, `{ error: string, reason?: string }` on failure.

---

## Webhook (public, HMAC-verified)

### POST /api/voice/webhooks/retell
Receives Retell AI webhook events. Verified via `x-retell-signature` HMAC header.

Always returns `{ received: true }` with 200 — processing happens async.

Events handled: `call_started`, `call_ended`, `transcript_updated`, `recording_ready`, `error`.

---

## Admin

### GET /api/voice/admin/tenants
List all tenants.

Response: `{ data: VoiceTenant[] }`

### POST /api/voice/admin/tenants
Create a tenant.

Body: `{ slug, businessName, contactEmail, contactPhone?, timezone?, locale?, mode?, planId?, businessCategory? }`

Response 201: `{ data: { id, slug, tenantToken, apiToken } }`

### GET /api/voice/admin/tenants/[id]
Tenant detail.

### PATCH /api/voice/admin/tenants/[id]
Update tenant status, plan, flags.

### DELETE /api/voice/admin/tenants/[id]
Hard delete. Cascades to all related records.

---

## Agents

### GET /api/voice/[tenantId]/agents
List agents. Response: `{ data: VoiceAgent[] }`

### POST /api/voice/[tenantId]/agents
Create agent. Body: `{ name, displayName, language, voiceId, promptTemplate, systemPrompt, ... }`

### GET /api/voice/[tenantId]/agents/[agentId]
### PATCH /api/voice/[tenantId]/agents/[agentId]
### DELETE /api/voice/[tenantId]/agents/[agentId]

### POST /api/voice/[tenantId]/agents/[agentId]/sync
Push agent config to Retell. Sets `providerAgentId` and `lastSyncedAt`.

Response: `{ data: { providerAgentId, synced: true } }`

---

## Calls

### GET /api/voice/[tenantId]/calls
List calls. Query params: `status`, `from`, `limit`, `cursor`, `search` (phone number).

### GET /api/voice/[tenantId]/calls/[callId]
Call detail with transcript and events.

### POST /api/voice/[tenantId]/calls/[callId]/reprocess
Re-run the post-call processing pipeline (useful when processing failed).

### POST /api/voice/[tenantId]/calls/[callId]/summary/regenerate
Regenerate AI summary from existing transcript.

---

## Phone numbers

### GET /api/voice/[tenantId]/phone-numbers
### POST /api/voice/[tenantId]/phone-numbers
Import a number. Body: `{ e164Number, agentId?, friendlyName?, country? }`

### PATCH /api/voice/[tenantId]/phone-numbers/[numberId]
Reassign agent or update label.

### DELETE /api/voice/[tenantId]/phone-numbers/[numberId]
Release number (also calls `provider.releasePhoneNumber`).

---

## Business hours

### GET /api/voice/[tenantId]/business-hours
Returns array of 7 rows (Mon–Sun).

### PUT /api/voice/[tenantId]/business-hours
Replace all 7 rows atomically. Body: `{ hours: BusinessHourRow[] }`

---

## Analytics

### GET /api/voice/[tenantId]/analytics
Query param: `range=7d|30d|90d` (default 30d).

Response: `{ data: { stats, busyHours, recommendations } }`

---

## Usage / Billing

### GET /api/voice/[tenantId]/usage
Query param: `month=YYYY-MM` (default: current month).

Response: `{ data: { month, totalCalls, totalMinutes, totalCost, records } }`

---

## Test call

### POST /api/voice/[tenantId]/test-call
Initiate outbound test call. Requires feature flag `VOICE_TEST_CALL_ENABLED`.

Body: `{ toNumber: "+49...", agentId: "cuid", notes?: string }`

Response 201: `{ data: { testRunId, providerCallId, status } }`

---

## Settings

### GET /api/voice/[tenantId]/settings
### PATCH /api/voice/[tenantId]/settings
Update `businessName`, `contactEmail`, `timezone`, `locale`, `businessDescription`, etc.

---

## Compliance

### GET /api/voice/[tenantId]/compliance
### PATCH /api/voice/[tenantId]/compliance
Update recording consent, retention days, GDPR flags.

---

## HTTP status codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error — check `error` and `reason` fields |
| 401 | Missing or invalid token |
| 403 | Feature disabled or insufficient permissions |
| 404 | Resource not found |
| 423 | Tenant suspended |
| 500 | Server error — check Sentry |
| 502 | Provider error (Retell/Vapi rejected the request) |
