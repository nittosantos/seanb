'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import {
  addToWishlist,
  fetchWishlistIds,
  removeFromWishlist,
} from '@/lib/wishlist-api';
import { Routes } from '@/config/routes';

export function useWishlistIds() {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const ids = useWishlistStore((state) => state.ids);
  const isLoaded = useWishlistStore((state) => state.isLoaded);
  const setIds = useWishlistStore((state) => state.setIds);
  const reset = useWishlistStore((state) => state.reset);

  useEffect(() => {
    if (isHydrating) return;

    if (!isAuthorized || !accessToken) {
      reset();
      return;
    }

    if (isLoaded) return;

    let cancelled = false;

    void fetchWishlistIds(accessToken)
      .then((response) => {
        if (!cancelled) {
          setIds(response.ids);
        }
      })
      .catch(() => {
        if (!cancelled) {
          reset();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthorized, accessToken, isHydrating, isLoaded, reset, setIds]);

  return { ids, isLoaded };
}

export function useWishlistToggle() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const ids = useWishlistStore((state) => state.ids);
  const addId = useWishlistStore((state) => state.addId);
  const removeId = useWishlistStore((state) => state.removeId);
  const [isToggling, setIsToggling] = useState(false);

  useWishlistIds();

  const isWishlisted = useCallback(
    (listingId: string) => ids.includes(listingId),
    [ids],
  );

  const toggleWishlist = useCallback(
    async (listingId: string) => {
      if (!isAuthorized || !accessToken) {
        router.push(Routes.auth.signIn);
        return;
      }

      const wasWishlisted = ids.includes(listingId);
      setIsToggling(true);

      if (wasWishlisted) {
        removeId(listingId);
        try {
          await removeFromWishlist(listingId, accessToken);
        } catch {
          addId(listingId);
        }
      } else {
        addId(listingId);
        try {
          await addToWishlist(listingId, accessToken);
        } catch {
          removeId(listingId);
        }
      }

      setIsToggling(false);
    },
    [accessToken, addId, ids, isAuthorized, removeId, router],
  );

  return { isWishlisted, toggleWishlist, isToggling };
}
