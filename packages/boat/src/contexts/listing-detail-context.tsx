'use client';

import { useEffect } from 'react';
import type { ListingDetail } from '@/types/listings';
import { useListingDetailStore } from '@/stores/listing-detail-store';

export function ListingDetailProvider({
  value,
  children,
}: {
  value: ListingDetail;
  children: React.ReactNode;
}) {
  const setListing = useListingDetailStore((state) => state.setListing);

  useEffect(() => {
    setListing(value);
    return () => setListing(null);
  }, [value, setListing]);

  return <>{children}</>;
}

export function useListingDetail() {
  const listing = useListingDetailStore((state) => state.listing);

  if (!listing) {
    throw new Error('Listing detail is not available');
  }

  return listing;
}
