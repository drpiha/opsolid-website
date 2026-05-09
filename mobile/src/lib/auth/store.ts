import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { AuthMeResponse } from '../api/types';
import { apiFetch, clearTokens } from '../api/client';

type AuthState = {
  user: AuthMeResponse | null;
  status: 'idle' | 'authenticated' | 'unauthenticated' | 'loading';
  hydrate: () => Promise<void>;
  setUser: (user: AuthMeResponse | null) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  hydrate: async () => {
    set({ status: 'loading' });
    try {
      const refresh = await SecureStore.getItemAsync('opsolid.refreshToken');
      if (!refresh) {
        set({ status: 'unauthenticated', user: null });
        return;
      }
      // The server response is `{ user: {...} }`. M4 needs the unwrapped shape
      // (push registration reads `user.id` for parity with the login() and
      // verifyMagicLink() paths which already unwrap).
      const res = await apiFetch<{ user: AuthMeResponse }>(
        '/api/v1/auth/me',
      );
      set({ status: 'authenticated', user: res.user });
    } catch {
      await clearTokens();
      set({ status: 'unauthenticated', user: null });
    }
  },
  setUser: (user) =>
    set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
  signOut: async () => {
    try {
      await apiFetch('/api/v1/auth/logout', { method: 'POST' });
    } catch {
      // ignore — clear local state regardless
    }
    await clearTokens();
    set({ user: null, status: 'unauthenticated' });
  },
}));
