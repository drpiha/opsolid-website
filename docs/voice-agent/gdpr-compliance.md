# GDPR / DSGVO Compliance

Voice Agent processes personal data (caller names, phone numbers, conversation content). This document covers legal requirements for German/EU deployment.

---

## Legal basis

Processing is lawful under **Art. 6 (1) f DSGVO** (legitimate interest): the business has a legitimate interest in answering customer calls automatically. The caller initiates contact voluntarily.

For health data (clinic use case), the legal basis must be **Art. 9 (2) h DSGVO** (healthcare provision) — this is why the clinic prompt template prohibits collecting diagnosis information and only books appointments.

---

## Transparency obligation (Art. 13/14 DSGVO)

Callers must be informed that their call is handled by an AI. The default prompt templates include this disclosure:

> "Guten Tag, Sie sprechen mit dem KI-Assistenten von [Business]. Ich kann Ihnen bei [Leistungen] helfen."

Do not modify prompts to hide AI identity. This also aligns with the EU AI Act (2024) transparency requirements for AI systems in human-interaction contexts.

---

## Call recordings

**Default: disabled** (`VOICE_CALL_RECORDING_ENABLED=false`)

If you enable recordings:
- Callers must be informed before recording starts: "Dieses Gespräch wird zur Qualitätssicherung aufgezeichnet."
- The Retell-provided recording URL must be deleted after the retention period
- Set `VoiceCall.recordingDeletedAt` when deletion occurs
- Add recording consent to the prompt template

For most use cases, **transcripts are sufficient** — recordings are not needed.

---

## Data retention

| Data type | Default retention | Rationale |
|-----------|------------------|-----------|
| Transcripts | 90 days | Follow-up calls possible; deleted after |
| Summaries | 90 days | Same |
| Caller phone / name | 90 days | Same |
| Usage records (billing) | 7 years | HGB §257 (German commercial law) |
| Call metadata (duration, time) | 7 years | Same |

Retention is configured per tenant at `/voice/[slug]/compliance`. Automatic deletion is not yet implemented — manual deletion or a cron job is needed for transcript data after 90 days.

---

## Data processing agreement (AVV / DPA)

Since OpSolid processes personal data **on behalf of customers** (the businesses using Voice Agent), each customer is a data controller and OpSolid is a data processor. A **Auftragsverarbeitungsvertrag (AVV)** is required under Art. 28 DSGVO.

Retell AI also processes data (transcription, AI inference). Retell's DPA must be reviewed — check https://retellai.com/privacy and their DPA documentation.

**Action items:**
1. Prepare an AVV template for Voice Agent customers
2. Request and sign Retell's DPA
3. Add AVV acceptance to the customer signup flow

---

## Caller rights

Callers can request:
- **Access** (Art. 15): what data was collected about their call
- **Deletion** (Art. 17): delete transcript, summary, and extracted fields
- **Rectification** (Art. 16): correct inaccurate extracted data (e.g., misspelled name)

Currently, deletion must be done manually via the database. Future: add a "Delete caller data" function to the call detail page.

---

## Technical measures (Art. 32 DSGVO)

| Measure | Implementation |
|---------|---------------|
| Access control | Tenant token — URL param, constant-time compare |
| Transport encryption | HTTPS everywhere (Traefik TLS) |
| Pseudonymization | Caller data stored separately from call metadata |
| Database encryption | Relies on VPS disk encryption (configure at OS level) |
| Audit logging | VoiceCallEvent table logs all processing steps |
| Sentry | Error reports are sanitized — no PII in Sentry tags |

---

## Checklist before going live

- [ ] Prompt template includes AI identity disclosure
- [ ] Recording disabled (or recording consent phrase added if needed)
- [ ] Retention period configured for each tenant
- [ ] AVV signed with each customer
- [ ] Retell DPA reviewed and signed
- [ ] Privacy policy on opsolid.de updated to mention Voice Agent data processing
- [ ] Clinic customers: verify prompt does not collect health data
