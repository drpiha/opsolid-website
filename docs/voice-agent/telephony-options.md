# Telephony Options

How to connect a phone number to the AI agent. Four approaches, ordered by simplicity.

---

## Option 1: Retell-provisioned number (simplest)

Retell buys and manages the number. You just import it into our dashboard.

**Steps:**
1. Retell dashboard → Phone Numbers → Buy Number → select Germany (+49)
2. Go to `/voice/[slug]/phone-numbers` → Import → paste the E.164 number
3. Select the agent — done

**Cost:** ~$2/month per number via Retell  
**Limitation:** Customer must use the Retell number. Their existing number keeps ringing as before.

---

## Option 2: Call forwarding (most common for existing businesses)

Customer keeps their existing mobile/landline. They set up "forward unanswered calls" to the Retell number. The AI only answers when the human doesn't pick up (after 3–4 rings).

**Steps:**
1. Get a Retell number (Option 1)
2. Customer dials a carrier-specific code on their phone:
   - Telekom: `**61*+49…<retell_number>#` (forward on no answer)
   - Vodafone: `**61*+49…<retell_number>#`
   - O2: `*61*+49…<retell_number>#`
3. Test: let the phone ring 4 times without answering → AI should pick up

**Cost:** included in carrier plan (most German carriers forward free)  
**Limitation:** Not automatable — customer must dial the code themselves. See `MANUAL_STEPS_FOR_OWNER.md`.

---

## Option 3: SIP trunk (advanced)

Customer has a VoIP/SIP-capable phone system (e.g., FRITZ!Box, Asterisk, 3CX). They set up SIP forwarding to Retell's SIP address.

**Steps:**
1. In Retell dashboard: Phone Numbers → Import SIP → get the SIP URI for your account
2. Configure SIP forwarding in customer's PBX to the Retell SIP URI
3. Import the customer's DID number in our dashboard

**Use case:** Clinics, hotels, offices with existing PBX systems

---

## Option 4: Twilio / Telnyx import (future)

Retell supports importing numbers from Twilio or Telnyx. This gives full programmatic number management (buy, release, port) but adds another billing layer.

**Currently:** Not needed. Implement if customers request number porting or specific carrier features.

**Steps (when needed):**
1. Buy number in Twilio/Telnyx
2. Retell dashboard → Phone Numbers → Import from Twilio/Telnyx
3. Follow Retell's carrier import docs

---

## AI Mode per number

Each phone number maps to one agent. The agent's business hours define when the AI actually answers:

| AI Mode | Behavior |
|---------|----------|
| `always_on` | AI answers every call, any time |
| `outside_hours` | AI only answers outside business hours |
| `overflow` | AI only answers when human doesn't pick up (forwarding required) |
| `manual_off` | AI disabled — calls go unanswered or to voicemail |

Set per day in `/voice/[slug]/business-hours`.
