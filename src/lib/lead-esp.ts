// =============================================================================
// Lead-form ESP forwarding (M1 — Form-builder-lite, Carrd amendment).
//
// Reads `cardData.contactForm.esps` and forwards a normalized lead payload to
// whichever ESP/webhook the owner configured. Mailchimp + MailerLite + raw
// webhook are the v0 set — Carrd's full 18 ESPs is overkill for the DACH
// solo/SMB segment (per `mobile/assets/carrd-comparison-plan.md` §4 row 2).
//
// All forwards are best-effort. We never throw out of `forwardLeadToEsp` —
// the visitor's POST has already been answered with `{ ok: true }` before
// this fires; failures are logged for the owner's later debugging but
// never surface in the visitor's response.
// =============================================================================

type LeadPayload = {
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  interest: string | null;
  slug: string;
  leadId: string;
};

type EspConfig = {
  mailchimp?: {
    listId?: unknown;
    audienceId?: unknown;
    apiKey?: unknown;
  };
  mailerlite?: {
    groupId?: unknown;
    apiKey?: unknown;
  };
  webhook?: {
    url?: unknown;
  };
};

const FORWARD_TIMEOUT_MS = 5_000;

export async function forwardLeadToEsp(
  cardData: unknown,
  lead: LeadPayload,
): Promise<void> {
  const esps = readEspConfig(cardData);
  if (!esps) return;

  // Run all configured forwards in parallel; aggregate via Promise.allSettled
  // so one provider's failure doesn't cancel the others.
  const tasks: Promise<unknown>[] = [];

  if (esps.mailchimp) {
    tasks.push(forwardMailchimp(esps.mailchimp, lead));
  }
  if (esps.mailerlite) {
    tasks.push(forwardMailerlite(esps.mailerlite, lead));
  }
  if (esps.webhook) {
    tasks.push(forwardGenericWebhook(esps.webhook, lead));
  }

  if (tasks.length === 0) return;
  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === "rejected") {
      console.warn("[lead-esp] forward failed:", r.reason);
    }
  }
}

// ---------- config reader ----------

function readEspConfig(cardData: unknown): EspConfig | null {
  if (!cardData || typeof cardData !== "object") return null;
  const cd = cardData as Record<string, unknown>;
  const cf = cd.contactForm as Record<string, unknown> | undefined;
  if (!cf || typeof cf !== "object") return null;
  if (cf.enabled !== true) return null;
  const esps = cf.esps as EspConfig | undefined;
  if (!esps || typeof esps !== "object") return null;
  return esps;
}

// ---------- Mailchimp ----------

async function forwardMailchimp(
  cfg: NonNullable<EspConfig["mailchimp"]>,
  lead: LeadPayload,
): Promise<void> {
  if (!lead.email) return; // Mailchimp requires an email address
  const apiKey = strOrNull(cfg.apiKey);
  const audienceId =
    strOrNull(cfg.audienceId) ?? strOrNull(cfg.listId);
  if (!apiKey || !audienceId) return;
  // Mailchimp keys are suffixed with the datacenter id, e.g. `abcd1234-us21`.
  const dc = apiKey.includes("-") ? apiKey.split("-").pop() : null;
  if (!dc) {
    console.warn("[lead-esp] mailchimp api key missing datacenter suffix");
    return;
  }
  const [firstName, ...rest] = lead.name.split(/\s+/);
  const lastName = rest.join(" ");

  const payload = {
    email_address: lead.email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName ?? "",
      LNAME: lastName,
      PHONE: lead.phone ?? "",
      COMPANY: lead.company ?? "",
    },
    tags: ["verso", `card:${lead.slug}`],
  };

  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const res = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
    },
  );
  if (!res.ok && res.status !== 400) {
    // 400 commonly means "already subscribed" — not a real failure. Anything
    // else is worth logging.
    const detail = await res.text().catch(() => "");
    throw new Error(`mailchimp_${res.status}_${detail.slice(0, 200)}`);
  }
}

// ---------- MailerLite ----------

async function forwardMailerlite(
  cfg: NonNullable<EspConfig["mailerlite"]>,
  lead: LeadPayload,
): Promise<void> {
  if (!lead.email) return;
  const apiKey = strOrNull(cfg.apiKey);
  const groupId = strOrNull(cfg.groupId);
  if (!apiKey) return;

  const fields: Record<string, string> = {};
  if (lead.name) fields.name = lead.name;
  if (lead.phone) fields.phone = lead.phone;
  if (lead.company) fields.company = lead.company;

  const body: Record<string, unknown> = {
    email: lead.email,
    fields,
  };
  if (groupId) body.groups = [groupId];

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`mailerlite_${res.status}_${detail.slice(0, 200)}`);
  }
}

// ---------- Generic webhook ----------

async function forwardGenericWebhook(
  cfg: NonNullable<EspConfig["webhook"]>,
  lead: LeadPayload,
): Promise<void> {
  const url = strOrNull(cfg.url);
  if (!url) return;
  // We accept any https URL the owner pasted in. We do NOT require a signing
  // secret here — the v0 spec is "raw webhook"; signing is a follow-up.
  if (!/^https?:\/\//i.test(url)) return;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "lead.created",
      slug: lead.slug,
      leadId: lead.leadId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      message: lead.message,
      interest: lead.interest,
    }),
    signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`webhook_${res.status}`);
  }
}

// ---------- shared ----------

function strOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t : null;
}
