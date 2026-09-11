import { NextRequest, NextResponse } from "next/server";
import { hasEmailProvider, sendEmail } from "@/lib/email/client";
import { escapeHtml } from "@/lib/email/shell";
import { ContactRequestError, contactLimiter, contactSchema, readContactBody } from "@/lib/contact-guard";

export const runtime = "nodejs";

const unavailable = () => NextResponse.json(
  { error: "Message delivery is temporarily unavailable. Please try again later." },
  { status: 503 },
);

/** Required: name/email/message. Existing optional company/source/teamSize,
 * phone/topics remain accepted; unknown legacy properties are ignored. */
export async function POST(req: NextRequest) {
  const permit = contactLimiter.acquire();
  if (!permit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(permit.retryAfter) } },
    );
  }
  try {
    const body = await readContactBody(req);
    // The honeypot never triggers mail, even if the remaining bot payload is
    // invalid. It uses the same generic accepted response as a delivered form.
    if (body && typeof body === "object" && !Array.isArray(body) &&
        "website" in body && typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ success: true });
    }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide valid contact details and a message." }, { status: 400 });
    }
    const { name, email, company, message, source, teamSize, phone, topics } = parsed.data;
    const contactTo = process.env.CONTACT_TO_EMAIL?.trim();
    if (!contactTo || !hasEmailProvider()) return unavailable();

    const subject = `New inquiry from ${name}${company ? ` (${company})` : ""}${source ? ` · source=${source}` : ""}`;
    const bodyLines = [`Name: ${name}`, `Email: ${email}`, `Company: ${company || "Not provided"}`];
    if (phone) bodyLines.push(`Phone: ${phone}`);
    if (topics?.length) bodyLines.push(`Topics: ${topics.join(", ")}`);
    if (source) bodyLines.push(`Source: ${source}`);
    if (teamSize) bodyLines.push(`Team size: ${teamSize}`);
    bodyLines.push("", "Message:", message, "", "---", "Sent from opsolid.de contact form", `Time: ${new Date().toISOString()}`);

    const result = await sendEmail({
      to: contactTo,
      from: process.env.CONTACT_FROM_EMAIL || undefined,
      replyTo: email,
      subject,
      html: bodyLines.map((line) => line === "" ? "<br/>" : `<p style="margin:0 0 4px 0;">${escapeHtml(line)}</p>`).join(""),
      text: bodyLines.join("\n"),
    });
    return result.ok ? NextResponse.json({ success: true }) : unavailable();
  } catch (error) {
    if (error instanceof ContactRequestError) {
      return NextResponse.json({ error: "Invalid contact request." }, { status: error.status });
    }
    // Never return/log a thrown provider error or submitted content.
    return unavailable();
  } finally {
    permit.release();
  }
}
