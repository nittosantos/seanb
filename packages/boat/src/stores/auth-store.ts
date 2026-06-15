'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  loginRequest,
  meRequest,
  registerRequest,
  type AuthUser,
} from '@/lib/auth-api';
import type { RegisterInput } from '@seanb/shared';
import { ApiError } from '@/lib/api-client';
import { clearAuthCookie, setAuthCookie } from '@/config/auth-cookie';

interface AuthState {
  isAuthorized: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  isHydrating: boolean;
  setSession: (user: AuthUser, accessToken: string) => void;
  clearSession: () => void;
  setHydrating: (hydrating: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  hydrateSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthorized: false,
      user: null,
      accessToken: null,
      isHydrating: true,
      setSession: (user, accessToken) => {
        setAuthCookie(accessToken);
        set({ isAuthorized: true, user, accessToken });
      },
      clearSession: () => {
        clearAuthCookie();
        set({
          isAuthorized: false,
          user: null,
          accessToken: null,
        });
      },
      setHydrating: (isHydrating) => set({ isHydrating }),
      login: async (email, password) => {
        const { user, accessToken } = await loginRequest(email, password);
        get().setSession(user, accessToken);
      },
      register: async (input) => {
        const { user, accessToken } = await registerRequest(input);
        get().setSession(user, accessToken);
      },
      hydrateSession: async () => {
        const { accessToken, setSession, clearSession, setHydrating } = get();

        if (!accessToken) {
          setHydrating(false);
          return;
        }

        try {
          const user = await meRequest(accessToken);
          setSession(user, accessToken);
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            clearSession();
          } else {
            clearSession();
          }
        } finally {
          setHydrating(false);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthorized: state.isAuthorized,
        user: state.user,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          useAuthStore.getState().setHydrating(false);
          return;
        }

        if (state?.accessToken) {
          setAuthCookie(state.accessToken);
        }

        void state?.hydrateSession();
      },
    },
  ),
);
