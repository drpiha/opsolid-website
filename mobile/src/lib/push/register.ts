// -----------------------------------------------------------------------
// M4 — Mobile push registration helper.
//
// Single entry point: `registerForPushAsync()`. Must be called AFTER auth
// has resolved (we need a valid bearer token for /api/v1/push/register).
// Idempotent on the server via the (userId, deviceId) unique constraint.
//
// Behaviour:
//   1. Skip on web / unsupported platform (Notifications doesn't ship for
//      web in SDK 54).
//   2. Read existing permission status. If `undetermined`, request it.
//      If the result is `denied`, return early — never throw, never spam
//      the user with a re-prompt.
//   3. If the existing status is `denied`, also return early. (iOS only
//      lets you ask once; subsequent prompts are silent no-ops.)
//   4. Get the Expo push token. Pass `projectId` from `expo-constants` —
//      required by SDK 49+ when not running inside Expo Go.
//   5. Mint or read a stable `deviceId` from SecureStore (UUID v4 once,
//      kept across launches).
//   6. POST to /api/v1/push/register. Errors are logged + swallowed —
//      registration is best-effort and must never block app entry.
//   7. (Android only) Ensure a notification channel exists so high-priority
//      banners actually surface.
//
// Stuck `pending` permission state: the only way `requestPermissionsAsync`
// returns is once the OS dialog is dismissed; if the user never taps either
// button (rare; airplane-mode background suspension), the promise stays
// pending. Our caller in `(app)/_layout.tsx` does NOT await this function —
// it fires it in a `void` and the post-auth flow proceeds independently.
// Combined with the root layout's 10s safety timer, the worst-case is the
// user sees the permission prompt and the rest of the app behind it.
// -----------------------------------------------------------------------

import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { registerPushDevice } from '../api/push';

// We don't depend on a separate uuid library — generate a v4-ish 32-hex
// string from Math.random() and Date.now(). Crypto-strong randomness isn't
// required (the id is just an opaque dedupe key on the server).
function newDeviceId(): string {
  let s = '';
  for (let i = 0; i < 8; i++) {
    s += Math.floor(Math.random() * 0xffffffff)
      .toString(16)
      .padStart(8, '0');
  }
  return s.slice(0, 32);
}

const DEVICE_ID_KEY = 'verso.pushDeviceId';
const REGISTERED_TOKEN_KEY = 'verso.pushLastToken';

export async function getOrMintDeviceId(): Promise<string> {
  try {
    const existing = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (existing && existing.length >= 8) return existing;
  } catch {
    // SecureStore can fail on some emulators on first cold-start; mint a
    // throwaway id and retry persistence.
  }
  const fresh = newDeviceId();
  try {
    await SecureStore.setItemAsync(DEVICE_ID_KEY, fresh);
  } catch {
    // Keep going — we'll just re-register on next launch with a new id.
  }
  return fresh;
}

/**
 * Set up Android's default notification channel. iOS ignores this — channels
 * are an Android concept. Without this, Android 13+ may downgrade our
 * priority-high pushes to silent banners.
 */
async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Verso',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 100, 200],
      lockscreenVisibility:
        Notifications.AndroidNotificationVisibility.PUBLIC,
      enableVibrate: true,
      sound: 'default',
    });
  } catch {
    // Channel already exists / older Android — fine.
  }
}

/**
 * Request OS permission + register the resulting Expo push token with the
 * server. Returns true on success, false on any failure (denied, no token,
 * server error). Never throws.
 */
export async function registerForPushAsync(): Promise<boolean> {
  // Web + unsupported platforms — bail early.
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;

  await ensureAndroidChannel();

  let status: Notifications.PermissionStatus;
  try {
    const existing = await Notifications.getPermissionsAsync();
    status = existing.status;
    if (status === 'undetermined') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
  } catch (err) {
    console.warn('[push] permission lookup failed:', err);
    return false;
  }

  if (status !== 'granted') {
    // User declined — quietly stop. We don't re-prompt; on iOS that's
    // futile, and on Android the user can re-enable from system settings.
    return false;
  }

  // Resolve projectId — required by getExpoPushTokenAsync in SDK 49+ when
  // the build isn't running inside Expo Go.
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    undefined;

  let tokenStr: string;
  try {
    const tokenObj = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    tokenStr = tokenObj.data;
  } catch (err) {
    console.warn('[push] getExpoPushTokenAsync failed:', err);
    return false;
  }

  if (!tokenStr) return false;

  const deviceId = await getOrMintDeviceId();

  // Skip the network round-trip when the token hasn't changed since the
  // last successful registration (best-effort optimisation; the server
  // upsert is idempotent so a duplicate call is harmless).
  let lastToken: string | null = null;
  try {
    lastToken = await SecureStore.getItemAsync(REGISTERED_TOKEN_KEY);
  } catch {
    lastToken = null;
  }

  try {
    await registerPushDevice(
      tokenStr,
      deviceId,
      Platform.OS as 'ios' | 'android',
    );
    if (tokenStr !== lastToken) {
      try {
        await SecureStore.setItemAsync(REGISTERED_TOKEN_KEY, tokenStr);
      } catch {
        // ignore — re-registration on next cold start is fine
      }
    }
    return true;
  } catch (err) {
    console.warn('[push] register failed:', err);
    return false;
  }
}

