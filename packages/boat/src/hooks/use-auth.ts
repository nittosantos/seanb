'use client';

import { useAuthStore } from '@/stores/auth-store';

export default function useAuth() {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const user = useAuthStore((state) => state.user);
  const authorize = useAuthStore((state) => state.authorize);
  const unauthorize = useAuthStore((state) => state.unauthorize);

  return {
    isAuthorized,
    user,
    authorize,
    unauthorize,
  };
}
