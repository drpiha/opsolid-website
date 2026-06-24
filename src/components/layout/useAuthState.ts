"use client";

// =============================================================================
// useAuthState — lightweight "am I logged in?" hook for marketing-site chrome.
//
// Calls GET /api/auth/me once on mount. That endpoint resolves the session from
// the refresh cookie (or Bearer) and returns the user (incl. role) or 401. The
// header uses this to render an auth-aware account corner: a "Sign in" link when
// anonymous, an account menu (My cards / Admin / Sign out) when logged in.
//
// Deliberately minimal — no global store. The header is the only consumer and a
// single fetch per page load is cheap (the endpoint is no-store but tiny).
// =============================================================================

import { useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  locale: string;
  role: string;
}

export type AuthStatus = "loading" | "authed" | "anon";

export function useAuthState(): { status: AuthStatus; user: AuthUser | null } {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) {
          const json = (await res.json()) as { user?: AuthUser };
          if (json?.user) {
            setUser(json.user);
            setStatus("authed");
            return;
          }
        }
        setStatus("anon");
      })
      .catch(() => {
        if (!cancelled) setStatus("anon");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, user };
}
