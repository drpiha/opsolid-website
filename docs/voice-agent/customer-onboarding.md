# Customer Onboarding Guide

Step-by-step setup for a new Voice Agent customer. Three tracks: Generic, Restaurant, Clinic.

---

## Before you start (you, as OpSolid operator)

1. Create the tenant in `/admin/voice/new`:
   - Business name, contact email, phone
   - Mode: `standalone` (or `kutasia_module` for Kutasia customers)
   - Business category: `generic` / `restaurant` / `clinic` / `hotel`
   - Timezone: `Europe/Berlin` for Germany
2. Copy the generated tenant token — send it to the customer in the welcome email
3. The dashboard URL: `https://opsolid.de/voice/[slug]?token=[tenantToken]`

---

## Track A — Generic business (service provider, consultant, craftsman)

**1. Knowledge base**  
Go to `/voice/[slug]/knowledge-base` → Add items:
- Type "FAQ" — list of common questions + answers
- Type "Team" — who works there, their role
- Type "Location" — address, parking, opening hours description

**2. Agent setup**  
`/voice/[slug]/agents/new`:
- Language: `de` (German)
- Voice: choose from the voice catalog (try a few with the preview)
- Prompt template: `generic`
- The system prompt auto-generates from the template + knowledge base

**3. Business hours**  
`/voice/[slug]/business-hours`:
- Set Mon–Fri hours
- Saturday/Sunday as needed
- AI mode: `outside_hours` is the most common ("AI only answers when we're closed")

**4. Phone number**  
Buy a Retell number or set up call forwarding from the customer's existing number (see `telephony-options.md`).

**5. Test call**  
`/voice/[slug]/test-call` → enter customer's mobile → verify AI answers correctly.

---

## Track B — Restaurant

**1. Knowledge base**  
- Type "Menu" — paste the full menu with prices
- Type "Pricing" — special menus, lunch deal, group pricing
- Type "Policy" — reservation policy (cancellation, group size, deposit)
- Type "Location" — address, parking, public transport

**2. Agent setup**  
- Prompt template: `restaurant-reservation` or `restaurant-order` (takeaway)
- Language: `de` or `tr` depending on the restaurant

**3. Business hours**  
Kitchen hours, not office hours. Set closed on Monday if that's the rest day.

**4. Appointment rules** (for reservations)  
`/voice/[slug]/appointments`:
- Booking type: `email_request` (simplest — AI collects name, party size, date/time, sends email to restaurant)
- Or `direct_cal` if they use Cal.com for reservations (requires a Cal.com API key)

**5. Notifications**  
`/voice/[slug]/notifications` → enable Telegram or WhatsApp so the owner gets instant alerts for new reservations.

---

## Track C — Medical clinic / practice

**1. Knowledge base**  
- Type "FAQ" — what conditions do you treat, do you take new patients, insurance types accepted
- Type "Team" — doctors + specialties
- Type "Policy" — appointment cancellation policy, emergency instructions ("for emergencies call 112")
- Type "Pricing" — self-pay rates, GKV/PKV info

**2. Agent setup**  
- Prompt template: `clinic`
- The clinic template includes GDPR-compliant language: AI explicitly does NOT give medical advice, does NOT discuss diagnoses
- Language: `de`

**3. Appointment rules**  
- Booking type: `email_request` (most practices don't use Cal.com)
- Required fields: name, phone, date of birth, reason for appointment (brief)

**4. Handoff rules**  
`/voice/[slug]/handoff-rules` → add rule:
- Trigger: keyword `"notfall"` / `"schmerzen"` / `"blut"`
- Action: `send_sms` to the practice mobile immediately

**5. Compliance**  
`/voice/[slug]/compliance`:
- Recording: OFF for medical contexts (privacy-sensitive)
- Retention: set transcript retention to 30 days (minimum needed for follow-up)
- DSGVO note: AI announces itself as an AI assistant at the start of each call

---

## Welcome email template

Subject: Ihr KI-Empfangssystem ist bereit — Zugangsdaten

```
Guten Tag [Name],

Ihr KI-Empfangssystem ist eingerichtet. Hier Ihr persönlicher Dashboard-Link:

https://opsolid.de/voice/[slug]?token=[tenantToken]

Speichern Sie diesen Link als Lesezeichen — er ist Ihr Zugang.

Nächste Schritte:
1. Öffnen Sie den Link und überprüfen Sie die Öffnungszeiten
2. Lesen Sie den Willkommenstext im Dashboard durch
3. Machen Sie einen Testanruf unter "Testanruf" im Menü

Bei Fragen: antworten Sie auf diese E-Mail.

Mit freundlichen Grüßen
OpSolid
```
