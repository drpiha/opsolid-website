import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import {
  requireTenantToken,
  TenantTokenError,
} from "@/lib/voice/auth/tenant-token";

export const runtime = "nodejs";

const TEST_TIMEOUT_MS = 8_000;

function unauthorized(err: unknown): NextResponse {
  if (err instanceof TenantTokenError) {
    const status = err.status;
    return NextResponse.json({ error: err.message }, { status });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// -----------------------------------------------------------------------------
// POST — execute a connectivity test for the integration. Each integration
// type has its own probe; we always update lastTestedAt + lastErrorMsg so the
// dashboard can surface integration health without a background job.
// -----------------------------------------------------------------------------
export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ tenantId: string; integId: string }>;
  },
) {
  const { tenantId, integId } = await params;
  try {
    await requireTenantToken(req, tenantId);
  } catch (err) {
    return unauthorized(err);
  }

  try {
    const integration = await prisma.voiceIntegration.findFirst({
      where: { id: integId, tenantId },
      include: {
        tenant: {
          select: { contactEmail: true, businessName: true },
        },
      },
    });
    if (!integration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 },
      );
    }

    let ok = false;
    let message = "";
    try {
      switch (integration.integrationType) {
        case "email_only":
          ({ ok, message } = await testEmailOnly(integration.tenant.contactEmail));
          break;
        case "cal_com":
          ({ ok, message } = await testCalCom(
            (integration.credentialsJson as Record<string, unknown> | null)
              ?.apiKey as string | undefined,
          ));
          break;
        case "custom_webhook":
          ({ ok, message } = await testCustomWebhook(
            integration.configJson as Record<string, unknown>,
            (integration.credentialsJson as Record<string, unknown> | null)
              ?.secret as string | undefined,
          ));
          break;
        case "google_calendar":
          // Google Calendar requires OAuth flow — beyond the scope of a sync
          // test. Mark as "informational" and surface a clear message.
          ok = false;
          message =
            "Google Calendar test must be performed through the OAuth consent flow.";
          break;
        default:
          ok = false;
          message = `Unknown integration type: ${integration.integrationType}`;
      }
    } catch (err) {
      ok = false;
      message =
        err instanceof Error ? err.message : "Integration test failed";
    }

    await prisma.voiceIntegration.update({
      where: { id: integId },
      data: {
        lastTestedAt: new Date(),
        lastErrorMsg: ok ? null : message,
        // Only auto-flip to "error" when we already considered it active.
        ...(integration.status === "active" && !ok && { status: "error" }),
      },
    });

    return NextResponse.json({ data: { ok, message } });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { area: "voice-tenant", route: "integrations.test" },
      extra: { tenantId, integId },
    });
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// Test probes. Each is best-effort and bounded by TEST_TIMEOUT_MS so a slow
// remote service can't hold the request thread.
// -----------------------------------------------------------------------------

async function testEmailOnly(
  contactEmail: string | null | undefined,
): Promise<{ ok: boolean; message: string }> {
  if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { ok: false, message: "Tenant has no valid contact email" };
  }
  // We only validate that an SMTP transport is configured. Sending a real
  // email here would be expensive and noisy for an idempotent test endpoint.
  const smtpReady =
    !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
  return smtpReady
    ? {
        ok: true,
        message: `SMTP transport configured. Test email destination: ${contactEmail}`,
      }
    : {
        ok: false,
        message: "SMTP transport not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing)",
      };
}

async function testCalCom(
  apiKey: string | undefined,
): Promise<{ ok: boolean; message: string }> {
  if (!apiKey) {
    return { ok: false, message: "Cal.com API key missing in credentials" };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TEST_TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://api.cal.com/v1/me?apiKey=${encodeURIComponent(apiKey)}`,
      { method: "GET", signal: controller.signal, cache: "no-store" },
    );
    if (!res.ok) {
      return { ok: false, message: `Cal.com responded ${res.status}` };
    }
    return { ok: true, message: "Cal.com reachable, API key valid" };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? `Cal.com unreachable: ${err.message}`
          : "Cal.com unreachable",
    };
  } finally {
    clearTimeout(timer);
  }
}

async function testCustomWebhook(
  config: Record<string, unknown>,
  _secret: string | undefined,
): Promise<{ ok: boolean; message: string }> {
  const url = typeof config?.url === "string" ? config.url : null;
  if (!url) return { ok: false, message: "Webhook URL missing in config" };
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, message: "Webhook URL is malformed" };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, message: "Webhook URL must be http(s)" };
  }
  // Minimal SSRF mitigation — refuse private/loopback hosts in production.
  // Operators who need on-prem endpoints should run a tunnel / public proxy.
  if (process.env.NODE_ENV === "production") {
    const host = parsed.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host.endsWith(".internal") ||
      host.endsWith(".local") ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host)
    ) {
      return {
        ok: false,
        message: "Webhook URL must be a public host in production",
      };
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-voice-test": "1",
      },
      body: JSON.stringify({ test: true, timestamp: new Date().toISOString() }),
    });
    if (!res.ok) {
      return { ok: false, message: `Webhook responded ${res.status}` };
    }
    return { ok: true, message: `Webhook accepted test (HTTP ${res.status})` };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? `Webhook unreachable: ${err.message}`
          : "Webhook unreachable",
    };
  } finally {
    clearTimeout(timer);
  }
}
