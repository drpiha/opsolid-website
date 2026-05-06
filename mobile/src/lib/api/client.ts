import * as SecureStore from 'expo-secure-store';

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'https://opsolid.de';

// Hard ceiling on every API request. Without this, a phone with no network /
// wrong DNS hangs SplashScreen forever during hydrate(), which the user reads
// as "app doesn't open". 8s is enough for a slow 3G round-trip.
const REQUEST_TIMEOUT_MS = 8000;

function fetchWithTimeout(input: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

// In-memory cache so we don't hit SecureStore on every request.
let accessToken: string | null = null;

// Single-flight guard: if a refresh is already in-flight, other 401 callers
// await the same promise instead of firing duplicate refresh requests.
let refreshing: Promise<string> | null = null;

export async function getAccessToken(): Promise<string | null> {
  if (accessToken) return accessToken;
  return SecureStore.getItemAsync('opsolid.accessToken');
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  accessToken = access;
  await SecureStore.setItemAsync('opsolid.accessToken', access);
  await SecureStore.setItemAsync('opsolid.refreshToken', refresh);
}

export async function clearTokens(): Promise<void> {
  accessToken = null;
  await SecureStore.deleteItemAsync('opsolid.accessToken');
  await SecureStore.deleteItemAsync('opsolid.refreshToken');
}

async function refreshAccessToken(): Promise<string> {
  if (refreshing) return refreshing;

  refreshing = (async () => {
    const refresh = await SecureStore.getItemAsync('opsolid.refreshToken');
    if (!refresh) throw new Error('NO_REFRESH_TOKEN');

    const res = await fetchWithTimeout(`${API_BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });

    if (!res.ok) {
      await clearTokens();
      throw new Error('REFRESH_FAILED');
    }

    const data = await res.json();
    await setTokens(data.accessToken, data.refreshToken);
    return data.accessToken as string;
  })();

  try {
    return await refreshing;
  } finally {
    refreshing = null;
  }
}

/**
 * Authenticated fetch wrapper for all OpSolid API calls.
 *
 * - Attaches `Authorization: Bearer <token>` automatically.
 * - On 401, attempts a single token refresh (single-flight) and retries.
 * - Throws `Error('UNAUTHORIZED')` if refresh fails (caller should redirect to login).
 * - Throws `Error('API <status>: <body>')` for other non-ok responses.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init.headers as Record<string, string>) ?? {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetchWithTimeout(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401 && token) {
    try {
      const fresh = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${fresh}`;
      res = await fetchWithTimeout(`${API_BASE}${path}`, { ...init, headers });
    } catch {
      throw new Error('UNAUTHORIZED');
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}
