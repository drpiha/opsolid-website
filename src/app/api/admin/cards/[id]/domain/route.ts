// =============================================================================
// /api/admin/cards/[id]/domain — set or clear the card's custom domain.
//
// POST body:
//   { "domain": "card.theirdomain.com" }   → set; resets verified=false and
//                                            emails CNAME instructions to the
//                                            order's contact email.
//   { "domain": null }                     → clear domain + verified flags.
//
// Domain validation:
//   - Lowercased + trimmed.
//   - Must match  ^[a-z0-9.-]+\.[a-z]{2,}$  (no protocol, no path, no port).
//   - Reject anything ending in ".opsolid.de" or equal to "opsolid.de" so
//     customers can't squat our own apex / subdomains.
//
// Auth: same ?token= / x-admin-token pattern as the rest of /api/admin/cards.
//
// Phase 6 — Custom Domain (Part A).
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendCustomerEmail } from "@/lib/email/send";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(req: Request, url: URL): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const fromQuery = url.searchParams.get("token") ?? "";
  const fromHeader = req.headers.get("x-admin-token") ?? "";
  return fromQuery === expected || fromHeader === expected;
}

const HOST_RE = /^[a-z0-9.-]+\.[a-z]{2,}$/;
const RESERVED_SUFFIX = ".opsolid.de";
const RESERVED_APEX = "opsolid.de";

const Body = z.object({
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
});

interface InstructionsCopy {
  subject: string;
  greeting: (name: string) => string;
  intro: string;
  cnameLabel: string;
  betaWarning: string;
  next: string;
  signoff: string;
}

// M6 — only en/de/tr have native templates here. The other locales fall
// back to English via the helper below; admin email is not in the M6
// translation polish surface.
const COPY: Record<"en" | "de" | "tr", InstructionsCopy> = {
  en: {
    subject: "DNS setup for your card domain",
    greeting: (n) => `Hello ${n},`,
    intro:
      "Thank you for connecting a custom domain to your OpSolid Smart Card. To finish the setup, please add the following CNAME record at your DNS provider:",
    cnameLabel: "CNAME record",
    betaWarning:
      "BETA — production routing for third-party hosts is being prepared. Until that goes live the domain will resolve in our admin tooling but may not yet serve public traffic.",
    next:
      "Once the CNAME is in place (DNS can take up to 24h to propagate), let us know and we will run the DNS verification step.",
    signoff: "— The OpSolid team",
  },
  de: {
    subject: "DNS-Setup für Ihre Kartendomain",
    greeting: (n) => `Guten Tag ${n},`,
    intro:
      "Vielen Dank, dass Sie eine eigene Domain mit Ihrer OpSolid Smart Card verbinden. Bitte legen Sie zur Einrichtung den folgenden CNAME-Eintrag bei Ihrem DNS-Anbieter an:",
    cnameLabel: "CNAME-Eintrag",
    betaWarning:
      "BETA — Routing für Drittanbieter-Hosts wird in Kürze aktiviert. Bis dahin ist die Domain in unserem Adminbereich sichtbar, liefert aber unter Umständen noch keinen öffentlichen Traffic aus.",
    next:
      "Sobald der Eintrag aktiv ist (DNS-Propagation kann bis zu 24 Stunden dauern), geben Sie uns bitte Bescheid – wir starten dann die Verifizierung.",
    signoff: "— Ihr OpSolid Team",
  },
  tr: {
    subject: "Kart alan adınız için DNS kurulumu",
    greeting: (n) => `Merhaba ${n},`,
    intro:
      "OpSolid Smart Card'ınıza özel alan adı bağladığınız için teşekkür ederiz. Kurulumu tamamlamak için DNS sağlayıcınızda aşağıdaki CNAME kaydını oluşturmanız gerekir:",
    cnameLabel: "CNAME kaydı",
    betaWarning:
      "BETA — üçüncü taraf alan adları için üretim yönlendirmesi henüz tamamlanmadı. O ana kadar alan adı admin panelinde görünür ancak henüz tüm ziyaretçi trafiğini sunmuyor olabilir.",
    next:
      "Kayıt yayıldıktan sonra (DNS yayılması 24 saati bulabilir) lütfen bize bildirin; doğrulama adımını başlatalım.",
    signoff: "— OpSolid ekibi",
  },
};

function pickCopy(localeRaw: string | null | undefined): InstructionsCopy {
  if (localeRaw === "de" || localeRaw === "tr") return COPY[localeRaw];
  return COPY.en;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildInstructionsEmail(
  contactName: string,
  customerDomain: string,
  locale: Locale,
): { subject: string; html: string; text: string } {
  const copy = pickCopy(locale);
  const safeName = escapeHtml(contactName || "—");
  const safeDomain = escapeHtml(customerDomain);

  const html = `<!doctype html><html><body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#15120F;line-height:1.55;padding:24px;max-width:560px;margin:0 auto;">
<p>${copy.greeting(safeName)}</p>
<p>${copy.intro}</p>
<table role="presentation" style="margin:16px 0;border-collapse:collapse;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:13px;background:#FAF6EF;border:1px solid #E5DDC8;border-radius:8px;">
  <tr><td style="padding:6px 12px;color:#737070;">Type</td><td style="padding:6px 12px;"><strong>CNAME</strong></td></tr>
  <tr><td style="padding:6px 12px;color:#737070;">Name / Host</td><td style="padding:6px 12px;"><strong>${safeDomain}</strong></td></tr>
  <tr><td style="padding:6px 12px;color:#737070;">Target / Value</td><td style="padding:6px 12px;"><strong>card.opsolid.de</strong></td></tr>
  <tr><td style="padding:6px 12px;color:#737070;">TTL</td><td style="padding:6px 12px;">300</td></tr>
</table>
<p style="background:#FFF7E6;border:1px solid #E8A252;border-radius:8px;padding:10px 14px;font-size:13px;color:#7A4F12;">${copy.betaWarning}</p>
<p>${copy.next}</p>
<p style="margin-top:24px;color:#737070;">${copy.signoff}</p>
</body></html>`;

  const text = [
    copy.greeting(contactName || "—"),
    "",
    copy.intro,
    "",
    `${copy.cnameLabel}:`,
    `  Type:   CNAME`,
    `  Name:   ${customerDomain}`,
    `  Target: card.opsolid.de`,
    `  TTL:    300`,
    "",
    `[BETA] ${copy.betaWarning}`,
    "",
    copy.next,
    "",
    copy.signoff,
  ].join("\n");

  return { subject: copy.subject, html, text };
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const url = new URL(req.url);
  if (!authorize(req, url)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { domain } = parsed.data;

  // Validate when setting (not when clearing).
  if (domain !== null) {
    if (!HOST_RE.test(domain)) {
      return NextResponse.json(
        {
          error:
            "Domain must be a bare hostname like card.example.com (no protocol, no path).",
        },
        { status: 400 },
      );
    }
    if (domain === RESERVED_APEX || domain.endsWith(RESERVED_SUFFIX)) {
      return NextResponse.json(
        { error: "Cannot use opsolid.de or any of its subdomains." },
        { status: 400 },
      );
    }
    // Uniqueness — Postgres also enforces, but a friendly 409 beats a 500.
    const conflict = await prisma.cardOrder.findFirst({
      where: { customDomain: domain, NOT: { id: params.id } },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "This domain is already attached to another card." },
        { status: 409 },
      );
    }
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      contactEmail: true,
      contactName: true,
      locale: true,
    },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const updated = await prisma.cardOrder.update({
    where: { id: order.id },
    data: {
      customDomain: domain,
      customDomainVerified: false,
      customDomainVerifiedAt: null,
    },
    select: {
      customDomain: true,
      customDomainVerified: true,
      customDomainVerifiedAt: true,
    },
  });

  // Fire-and-forget instructions email when a new domain is set.
  if (domain && order.contactEmail) {
    const locale: Locale = isLocale(order.locale) ? order.locale : "en";
    const { subject, html, text } = buildInstructionsEmail(
      order.contactName,
      domain,
      locale,
    );
    sendCustomerEmail({
      to: order.contactEmail,
      subject,
      html,
      text,
    }).catch((err) => {
      console.warn("[domain] instructions email failed", err);
    });
  }

  return NextResponse.json({
    ok: true,
    customDomain: updated.customDomain,
    customDomainVerified: updated.customDomainVerified,
    customDomainVerifiedAt: updated.customDomainVerifiedAt,
  });
}
