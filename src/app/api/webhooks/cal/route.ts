import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { notifyBooking, type BookingInfo } from "@/lib/notifications";

// Cal.com webhook payload types (subset we need)
interface CalWebhookPayload {
  triggerEvent: string;
  payload: {
    title?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    additionalNotes?: string;
    attendees?: Array<{ name: string; email: string }>;
    organizer?: { name: string; email: string };
    responses?: {
      name?: { value: string };
      email?: { value: string };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Verify webhook signature if secret is configured
    const secret = process.env.CALCOM_WEBHOOK_SECRET;
    if (secret) {
      const signature = req.headers.get("x-cal-signature-256") || "";
      const expectedSig = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSig) {
        console.error("[Cal Webhook] Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const body: CalWebhookPayload = JSON.parse(rawBody);
    const { triggerEvent, payload } = body;

    // Map Cal.com event types to our status
    const statusMap: Record<string, BookingInfo["status"]> = {
      BOOKING_CREATED: "created",
      BOOKING_CANCELLED: "cancelled",
      BOOKING_RESCHEDULED: "rescheduled",
    };

    const status = statusMap[triggerEvent];
    if (!status) {
      // Ignore events we don't handle (e.g. BOOKING_PAYMENT, etc.)
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Extract attendee info — Cal.com puts the booker in attendees[0] or responses
    const attendee = payload.attendees?.[0];
    const name =
      payload.responses?.name?.value ||
      attendee?.name ||
      "Unbekannt";
    const email =
      payload.responses?.email?.value ||
      attendee?.email ||
      "keine E-Mail";

    const bookingInfo: BookingInfo = {
      title: payload.title || "Discovery Call",
      name,
      email,
      startTime: payload.startTime || new Date().toISOString(),
      endTime: payload.endTime || new Date().toISOString(),
      status,
      location: payload.location || undefined,
      notes: payload.additionalNotes || undefined,
    };

    // Log for debugging
    console.log(`[Cal Webhook] ${triggerEvent} — ${name} (${email})`);

    // Send notifications to all channels
    await notifyBooking(bookingInfo);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Cal Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
