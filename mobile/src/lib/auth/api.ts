import { apiFetch, setTokens } from '../api/client';
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
