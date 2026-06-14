import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/client";
import { escapeHtml } from "@/lib/email/shell";

export const runtime = "nodejs";

/**
 * Contact form POST endpoint.
 *
 * Required fields: name, email, message.
 * Optional fields: company, source, teamSize.
 *   - `source`   — marketing / referral label (e.g. "digital-card", "dbc-free").
 *   - `teamSize` — rough bucket (e.g. "1", "2 – 10", "50+").
 *
 * Both optional fields are sanitized (short strings only, <64 chars).
 * Backwards compatible: legacy callers that only send name/email/company/message
 * still work exactly as before.
 */

const MAX_OPTIONAL_LEN = 64;

function sanitizeShortString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > MAX_OPTIONAL_LEN) return undefined;
  return trimmed;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;
    const source = sanitizeShortString(body?.source);
    const teamSize = sanitizeShortString(body?.teamSize);

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Deliver via the shared provider chain (Brevo > Resend > SMTP > console)
    // with the visitor's address as Reply-To. No personal-email fallback — if
    // CONTACT_TO_EMAIL is unset we log a warning and let the UX continue.
    const contactTo = process.env.CONTACT_TO_EMAIL;

    if (contactTo) {
      const subject = `New inquiry from ${name}${
        company ? ` (${company})` : ""
      }${source ? ` · source=${source}` : ""}`;

      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "Not provided"}`,
      ];
      if (source) bodyLines.push(`Source: ${source}`);
      if (teamSize) bodyLines.push(`Team size: ${teamSize}`);
      bodyLines.push(``, `Message:`, message, ``, `---`, `Sent from opsolid.de contact form`, `Time: ${new Date().toISOString()}`);

      const html = bodyLines
        .map((line) =>
          line === ""
            ? "<br/>"
            : `<p style="margin:0 0 4px 0;">${escapeHtml(line)}</p>`,
        )
        .join("");

      const result = await sendEmail({
        to: contactTo,
        from: process.env.CONTACT_FROM_EMAIL || undefined,
        replyTo: email,
        subject,
        html,
        text: bodyLines.join("\n"),
      });
      if (!result.ok) {
        console.error("[contact] delivery failed:", result.error);
      }
    } else {
      // Dev-only fallback so the form still "works" without a destination.
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[contact] CONTACT_TO_EMAIL missing — submission accepted but not delivered",
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
