// =============================================================================
// POST /api/v1/billing/domain-request — Pro user submits a custom-domain
// provisioning request.
//
// Auth: bearer-only, Pro-gated. v1 = manual provision: we email the
// maintainer + persist a `DomainRequest` row at status="pending". v2 (out
// of scope) will self-serve via DNS verification + automatic ACME issuance.
//
// Body: { domain: string, cardOrderId?: string, notes?: string }.
// =============================================================================

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthError } from "@/lib/auth/require-user";
import { requireBearerUser } from "@/lib/api/v1/bearer-only";
import { errorJson, readJsonBody } from "@/lib/api/v1/errors";
import { applyCors, corsPreflight } from "@/lib/api/v1/cors";
import { rateLimit } from "@/lib/api/v1/rate-limit";
import { isPro } from "@/lib/auth/pro";
import { sendCustomerEmail } from "@/lib/email/send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_MAX = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

// Domain regex: allow apex + subdomains. Reject anything obviously invalid;
// strict DNS validation happens at provision time.
const DOMAIN_RE =
  /^(?!-)(?:[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,63}$/;

const BodySchema = z
  .object({
    domain: z
      .string()
      .trim()
      .toLowerCase()
      .max(253)
      .regex(DOMAIN_RE, "Invalid domain"),
    cardOrderId: z.string().trim().min(1).max(40).optional(),
    notes: z.string().trim().max(1000).optional(),
  })
  .strict();

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const user = await requireBearerUser(req);

    if (!isPro(user)) {
      return applyCors(
        errorJson("pro_required", "Pro subscription required.", 402),
        req,
      );
    }

    const limit = rateLimit(
      "billing:domain-request",
      req,
      user,
      RATE_MAX,
      RATE_WINDOW_MS,
    );
    if (!limit.ok) {
      return applyCors(
        errorJson("rate_limited", "Too many requests.", 429, {
          "Retry-After": String(limit.retryAfterSeconds ?? 60),
        }),
        req,
      );
    }

    const body = await readJsonBody(req);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return applyCors(
        errorJson(
          "invalid_payload",
          parsed.error.issues[0]?.message ?? "Invalid payload.",
          400,
          undefined,
          parsed.error.issues,
        ),
        req,
      );
    }

    // If cardOrderId is provided, verify ownership.
    if (parsed.data.cardOrderId) {
      const owns = await prisma.cardOrder.findFirst({
        where: { id: parsed.data.cardOrderId, userId: user.id },
        select: { id: true },
      });
      if (!owns) {
        return applyCors(
          errorJson("card_not_found", "Card not found.", 404),
          req,
        );
      }
    }

    const created = await prisma.domainRequest.create({
      data: {
        userId: user.id,
        cardOrderId: parsed.data.cardOrderId ?? null,
        domain: parsed.data.domain,
        notes: parsed.data.notes ?? null,
        status: "pending",
      },
    });

    // Best-effort maintainer email. Failure does NOT fail the request —
    // the row is the source of truth and the maintainer can poll.
    try {
      const maintainer =
        process.env.OPSOLID_MAINTAINER_EMAIL ?? process.env.SMTP_FROM ?? null;
      if (maintainer) {
        const subject = `[OpSo Smart Pro] Custom domain request: ${parsed.data.domain}`;
        const body = [
          `User: ${user.email} (${user.id})`,
          `Domain: ${parsed.data.domain}`,
          parsed.data.cardOrderId ? `Card: ${parsed.data.cardOrderId}` : "",
          parsed.data.notes ? `\nNotes:\n${parsed.data.notes}` : "",
          `\nRequest ID: ${created.id}`,
        ]
          .filter(Boolean)
          .join("\n");
        await sendCustomerEmail({
          to: maintainer,
          subject,
          html: `<pre style="font-family:ui-monospace,monospace;font-size:13px;line-height:1.5">${body
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")}</pre>`,
          text: body,
        });
      }
    } catch (err) {
      console.error("[v1/billing/domain-request] email failed:", err);
    }

    return applyCors(
      NextResponse.json(
        {
          id: created.id,
          domain: created.domain,
          status: created.status,
          createdAt: created.createdAt.toISOString(),
        },
        { status: 201 },
      ),
      req,
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return applyCors(
        errorJson(err.code, "Authentication required.", err.status),
        req,
      );
    }
    console.error("[v1/billing/domain-request] failed:", err);
    return applyCors(errorJson("server_error", "Internal error.", 500), req);
  }
}
