'use client';

import { useAuthStore } from '@/stores/auth-store';

export default function useAuth() {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const user = useAuthStore((state) => state.user);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const clearSession = useAuthStore((state) => state.clearSession);

  return {
    isAuthorized,
    user,
    isHydrating,
    login,
    register,
    authorize: () => {
      // Legacy shim — prefer login/register. Social OAuth will replace this.
    },
    unauthorize: clearSession,
  };
}
