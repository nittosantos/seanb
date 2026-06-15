'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { clearAuthCookie, readAuthCookie, setAuthCookie } from '@/config/auth-cookie';

export default function AuthCookieSync() {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      setAuthCookie(accessToken);
      return;
    }

    const cookieToken = readAuthCookie();

    if (cookieToken) {
      clearAuthCookie();
    }
  }, [accessToken]);

  return null;
}
