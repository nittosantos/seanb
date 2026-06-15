'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ListingDetail } from '@/types/listings';
import { fetchListingBySlug } from '@/lib/listings-api';
import { useListingDetailStore } from '@/stores/listing-detail-store';

type ListingDetailContextValue = {
  listing: ListingDetail;
  refresh: () => Promise<void>;
};

const ListingDetailContext = createContext<ListingDetailContextValue | null>(
  null,
);

export async function refreshListingDetail(slug: string) {
  const updated = await fetchListingBySlug(slug);
  useListingDetailStore.getState().setListing(updated);
  return updated;
}

export function ListingDetailProvider({
  value,
  children,
}: {
  value: ListingDetail;
  children: React.ReactNode;
}) {
  const [listing, setListing] = useState(value);
  const setStoreListing = useListingDetailStore((state) => state.setListing);

  useEffect(() => {
    setListing(value);
  }, [value]);

  useEffect(() => {
    setStoreListing(listing);
    return () => setStoreListing(null);
  }, [listing, setStoreListing]);

  const refresh = useCallback(async () => {
    const updated = await refreshListingDetail(listing.slug);
    setListing(updated);
  }, [listing.slug]);

  return (
    <ListingDetailContext.Provider value={{ listing, refresh }}>
      {children}
    </ListingDetailContext.Provider>
  );
}

export function useListingDetail() {
  const storeListing = useListingDetailStore((state) => state.listing);
  const context = useContext(ListingDetailContext);
  const listing = storeListing ?? context?.listing;

  if (!listing) {
    throw new Error('Listing detail is not available');
  }

  return listing;
}
