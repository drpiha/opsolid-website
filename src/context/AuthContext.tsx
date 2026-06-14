"use client";

// =============================================================================
// AuthContext — lightweight client-side "am I logged in?" signal for public
// chrome (Header / Footer). The OpSo Smart account lives behind the same
// `/api/auth/*` backend the dashboard and mobile app use; this context only
// surfaces login STATE so the marketing site can show the right entry point.
//
// It calls GET /api/auth/me once on mount. requireUser() accepts the web
// `opsolid_refresh` cookie directly, so no access-token dance is needed here.
// Marketing pages stay static — we resolve auth on the client instead of
// making the root layout dynamic.
// =============================================================================

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  locale: string | null;
}

type AuthStatus = "loading" | "authed" | "guest";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  /** Re-query /api/auth/me — call after a login completes. */
  refresh: () => Promise<void>;
  /** POST /api/auth/logout then drop local state. */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  status: "loading",
  user: null,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!res.ok) {
        setUser(null);
        setStatus("guest");
        return;
      }
      const data = (await res.json()) as { user?: AuthUser | null };
      if (data.user) {
        setUser(data.user);
        setStatus("authed");
      } else {
        setUser(null);
        setStatus("guest");
      }
    } catch {
      // Network error — treat as guest; the dashboard guard is the real gate.
      setUser(null);
      setStatus("guest");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      setUser(null);
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ status, user, refresh, logout }),
    [status, user, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
