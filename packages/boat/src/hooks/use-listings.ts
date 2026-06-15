'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchListings } from '@/lib/listings-api';
import type { ListingCard, ListingsQuery } from '@/types/listings';

type UseListingsOptions = ListingsQuery & {
  enabled?: boolean;
};

export function useListings({
  enabled = true,
  ...params
}: UseListingsOptions = {}) {
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const queryKey = JSON.stringify(params);

  const load = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchListings(JSON.parse(queryKey) as ListingsQuery);
      setListings(response.data);
      setTotal(response.meta.total);
    } catch {
      setError('Failed to load listings');
      setListings([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, queryKey]);

  useEffect(() => {
    void load();
  }, [load]);

  return { listings, total, isLoading, error, reload: load };
}

export function useListingsPages(initialParams: ListingsQuery = {}) {
  const [page, setPage] = useState(initialParams.page ?? 1);
  const limit = initialParams.limit ?? 12;
  const { listings, total, isLoading, error } = useListings({
    ...initialParams,
    page,
    limit,
  });

  const hasMore = listings.length < total;

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((current) => current + 1);
    }
  };

  return {
    listings,
    total,
    isLoading,
    error,
    hasMore,
    loadMore,
    page,
  };
}
