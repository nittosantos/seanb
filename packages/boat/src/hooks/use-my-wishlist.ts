'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchWishlist } from '@/lib/wishlist-api';
import useAuth from '@/hooks/use-auth';
import type { WishlistList } from '@seanb/shared';

export function useMyWishlist() {
  const { isAuthorized, accessToken, isHydrating } = useAuth();
  const [listings, setListings] = useState<WishlistList>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthorized || !accessToken) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWishlist(accessToken);
      setListings(data);
    } catch {
      setError('Failed to load wishlist');
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, isAuthorized]);

  useEffect(() => {
    if (isHydrating) return;
    void load();
  }, [isHydrating, load]);

  return { listings, isLoading, error, reload: load };
}
