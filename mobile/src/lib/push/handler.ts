// -----------------------------------------------------------------------
// M4 — Notification handler.
//
// Tells expo-notifications how to render incoming pushes while the app is
// foregrounded. Default behaviour (since SDK 50) is to DROP foreground
// notifications silently — explicitly opt-in to banner + sound here.
//
// Imported once at module scope by the root `_layout.tsx`. Calling
// `setNotificationHandler` is idempotent.
// -----------------------------------------------------------------------

import * as Notifications from 'expo-notifications';

let installed = false;

export function installNotificationHandler(): void {
  if (installed) return;
  installed = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      // Show a banner even when the app is foreground — for chat the
      // user may have the inbox list open while a thread message arrives.
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}
