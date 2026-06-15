'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchPublicHostProfile } from '@/lib/users-api';
import type { PublicHostProfile } from '@seanb/shared';

export function usePublicProfile(identifier: string) {
  const [profile, setProfile] = useState<PublicHostProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!identifier) {
      setProfile(null);
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setNotFound(false);

    try {
      const data = await fetchPublicHostProfile(identifier);
      setProfile(data);
    } catch {
      setProfile(null);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    void load();
  }, [load]);

  return { profile, isLoading, notFound, reload: load };
}
