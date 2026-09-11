import { createCalWebhookHandler } from "@/lib/cal-webhook";
import { notifyBooking } from "@/lib/notifications";

export const runtime = "nodejs";

export const POST = createCalWebhookHandler({
  secret: () => process.env.CALCOM_WEBHOOK_SECRET,
  notify: notifyBooking,
});
