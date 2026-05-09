// =============================================================================
// M4 — Server-side Expo Push fan-out.
//
// Single entry point used by every event hook (new chat message, new inbox
// request, mutual save, event reminder). All call sites pass:
//   - `userId`: the recipient (NOT the sender).
//   - `category`: keys defined in `PushCategory` — must match the client-side
//     toggles in Settings → Notifications.
//   - `title` / `body`: the visible banner text.
//   - `data`: payload merged into Notifications.NotificationResponse.notification
//     for client-side deep-link routing (`url` in particular triggers the
//     mobile linking handler at `_layout.tsx`).
//
// Behaviour:
//   - If the recipient has no registered devices, no-ops.
//   - If `notificationPrefs[category] === false`, no-ops (skips fan-out).
//   - Batches Expo push messages 100-per-request (Expo's documented cap).
//   - Adds `Authorization: Bearer ${EXPO_ACCESS_TOKEN}` when the env var is
//     set (improves rate limit + receipt support; anonymous Expo Push still
//     works for development).
//   - On `DeviceNotRegistered` per-ticket error, hard-deletes the offending
//     `PushDevice` row. (Expo's docs explicitly say to stop sending to a token
//     once you see this error — keeping the row would just retry forever.)
//   - Errors are logged (`console.error`) but never rethrown — push fan-out is
//     best-effort and must never block the user-facing request that triggered
//     it.
//
// Failure-domain isolation: every caller wraps in `void notify(…)` (or, when
// awaited, ignores the resolved value). The function returns void on purpose.
// =============================================================================

import { prisma } from "@/lib/prisma";

export type PushCategory =
  | "messages"
  | "inboxRequests"
  | "mutualSaves"
  | "eventReminders";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const BATCH_SIZE = 100;

interface NotifyArgs {
  userId: string;
  category: PushCategory;
  title: string;
  body: string;
  /**
   * Free-form payload merged into the push message's `data` field. The mobile
   * client reads `data.url` and routes via `Linking.openURL` — pass the deep
   * link there (`verso://inbox/<connectionId>` or `verso://inbox`).
   */
  data?: Record<string, unknown>;
}

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  priority?: "default" | "normal" | "high";
  channelId?: string;
}

interface ExpoTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
}

interface ExpoSendResponse {
  data?: ExpoTicket[];
  errors?: Array<{ message?: string; code?: string }>;
}

/**
 * Read `User.notificationPrefs` for the recipient and check if the requested
 * category is enabled. Treats null/missing keys as `true` (default-on) so a
 * fresh user gets all categories until they explicitly opt out in Settings.
 */
async function categoryEnabled(
  userId: string,
  category: PushCategory,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notificationPrefs: true },
  });
  if (!user) return false;
  const prefs = (user.notificationPrefs ?? {}) as Record<string, unknown>;
  // Explicit `false` opts out; anything else (true, undefined, null) opts in.
  return prefs[category] !== false;
}

/**
 * Send a push notification to all registered devices for a user. Best-effort,
 * never throws. Returns void.
 */
export async function notify(args: NotifyArgs): Promise<void> {
  try {
    const { userId, category, title, body, data } = args;

    const enabled = await categoryEnabled(userId, category);
    if (!enabled) return;

    const devices = await prisma.pushDevice.findMany({
      where: { userId },
      select: { id: true, expoPushToken: true },
    });
    if (devices.length === 0) return;

    const messages: ExpoPushMessage[] = devices.map((d) => ({
      to: d.expoPushToken,
      title,
      body,
      sound: "default",
      priority: "high",
      // Android channel — matches the channel id we register on the client
      // when permission is granted. iOS ignores this field.
      channelId: "default",
      data: data ?? {},
    }));

    // Send in batches of 100 (Expo's documented cap).
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      const tokensInBatch = batch.map((m) => m.to);
      const tickets = await sendBatch(batch);
      if (!tickets) continue;

      // Reap any token whose ticket says `DeviceNotRegistered`. Match each
      // ticket back to its original token by index (Expo guarantees ticket
      // ordering matches request body ordering).
      const stale: string[] = [];
      tickets.forEach((tk, idx) => {
        if (
          tk.status === "error" &&
          tk.details?.error === "DeviceNotRegistered"
        ) {
          const tok = tokensInBatch[idx];
          if (tok) stale.push(tok);
        }
      });
      if (stale.length > 0) {
        await prisma.pushDevice
          .deleteMany({ where: { expoPushToken: { in: stale } } })
          .catch((err) => {
            console.error("[push] reap stale tokens failed:", err);
          });
      }
    }
  } catch (err) {
    // Catch-all: push fan-out is best-effort.
    console.error("[push] notify failed:", err);
  }
}

/**
 * One HTTP round-trip to the Expo Push endpoint with up to BATCH_SIZE
 * messages. Returns the parsed tickets array or null on transport error.
 */
async function sendBatch(
  messages: ExpoPushMessage[],
): Promise<ExpoTicket[] | null> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate",
  };
  const accessToken = process.env.EXPO_ACCESS_TOKEN;
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res: Response;
  try {
    res = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(messages),
    });
  } catch (err) {
    console.error("[push] fetch failed:", err);
    return null;
  }

  if (!res.ok) {
    console.error("[push] non-OK from Expo:", res.status, await safeText(res));
    return null;
  }

  let parsed: ExpoSendResponse;
  try {
    parsed = (await res.json()) as ExpoSendResponse;
  } catch (err) {
    console.error("[push] parse failed:", err);
    return null;
  }

  if (parsed.errors && parsed.errors.length > 0) {
    console.error("[push] expo returned top-level errors:", parsed.errors);
  }

  return parsed.data ?? null;
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "<no body>";
  }
}
