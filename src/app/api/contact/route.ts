import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

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

    // Log submission (always works, even without SMTP)
    console.log("--- New Contact Submission ---");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Company: ${company || "N/A"}`);
    console.log(`Message: ${message}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log("-----------------------------");

    // Send email if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactTo = process.env.CONTACT_TO_EMAIL || "hello@opsolid.de";

    if (smtpHost && smtpUser && smtpPass) {
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

      await transporter.sendMail({
        from: `"OpSolid Website" <${smtpUser}>`,
        to: contactTo,
        replyTo: email,
        subject: `New inquiry from ${name}${company ? ` (${company})` : ""}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || "Not provided"}`,
          ``,
          `Message:`,
          message,
          ``,
          `---`,
          `Sent from opsolid.de contact form`,
          `Time: ${new Date().toISOString()}`,
        ].join("\n"),
      });

      console.log("Email sent successfully.");
    } else {
      console.log(
        "SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars to enable email delivery."
      );
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
