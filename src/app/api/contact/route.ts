import { NextRequest, NextResponse } from "next/server";

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

    // Send email if SMTP is configured. No personal-email fallback — if
    // CONTACT_TO_EMAIL is unset we log a warning and let the UX continue.
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactTo = process.env.CONTACT_TO_EMAIL;

    if (smtpHost && smtpUser && smtpPass && contactTo) {
      const nodemailer = await import("nodemailer");

      const transporter = nodemailer.default.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: (process.env.SMTP_PORT || "587") === "465",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

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

      await transporter.sendMail({
        from: `"OpSolid Website" <${smtpUser}>`,
        to: contactTo,
        replyTo: email,
        subject,
        text: bodyLines.join("\n"),
      });

    } else {
      // Dev-only fallback so the form still "works" without SMTP. In prod
      // this branch never runs because SMTP is configured.
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[contact] CONTACT_TO_EMAIL or SMTP env missing — submission accepted but not delivered",
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
