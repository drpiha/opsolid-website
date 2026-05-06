import * as WebBrowser from 'expo-web-browser';
import { apiFetch, setTokens, API_BASE } from '../api/client';
import type { AuthLoginResponse, AuthMeResponse } from '../api/types';

// The login endpoint returns extra fields (name, locale, sessionExpiresAt) on
// top of the base AuthMeResponse. We capture them here for forward-compat but
// only surface the AuthMeResponse shape to callers.
type LoginUserPayload = AuthMeResponse & {
  name?: string | null;
  locale?: string | null;
};

type LoginResponse = AuthLoginResponse & {
  user: LoginUserPayload;
  sessionExpiresAt: string;
};

export async function login(email: string, password: string): Promise<AuthMeResponse> {
  const res = await apiFetch<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await setTokens(res.accessToken, res.refreshToken);
  // Return only the AuthMeResponse-compatible subset
  const { id, email: userEmail, role, emailVerifiedAt } = res.user;
  return { id, email: userEmail, role, emailVerifiedAt };
}

export async function requestMagicLink(
  email: string,
  locale: 'en' | 'de' | 'tr',
): Promise<void> {
  await apiFetch('/api/v1/auth/magic-link', {
    method: 'POST',
    body: JSON.stringify({ email, locale }),
  });
}

export async function verifyMagicLink(token: string): Promise<AuthMeResponse> {
  const res = await apiFetch<LoginResponse>('/api/v1/auth/magic-link/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  await setTokens(res.accessToken, res.refreshToken);
  const { id, email, role, emailVerifiedAt } = res.user;
  return { id, email, role, emailVerifiedAt };
}

export async function fetchMe(): Promise<AuthMeResponse> {
  return apiFetch<AuthMeResponse>('/api/v1/auth/me');
}

/**
 * Opens an in-app browser to the Google OAuth flow.
 * On success, Google redirects to our callback which redirects to
 * `opsolid://auth/google?rt=REFRESH&at=ACCESS`.
 * WebBrowser intercepts the opsolid:// redirect and returns the URL.
 * Returns the parsed AuthMeResponse on success, null if the user cancelled.
 */
export async function signInWithGoogle(): Promise<AuthMeResponse | null> {
  const oauthUrl = `${API_BASE}/api/auth/google?mobile=1`;
  const result = await WebBrowser.openAuthSessionAsync(oauthUrl, 'opsolid://');

  if (result.type !== 'success') return null;

  const url = new URL(result.url);
  const rt = url.searchParams.get('rt');
  const at = url.searchParams.get('at');
  if (!rt || !at) return null;

  await setTokens(at, rt);

  // Fetch the user profile with the fresh access token
  const user = await apiFetch<AuthMeResponse>('/api/v1/auth/me');
  return user;
}
