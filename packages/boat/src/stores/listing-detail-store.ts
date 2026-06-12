'use client';

import { create } from 'zustand';
import type { ListingDetail } from '@/types/listings';

interface ListingDetailState {
  listing: ListingDetail | null;
  setListing: (listing: ListingDetail | null) => void;
}

export const useListingDetailStore = create<ListingDetailState>((set) => ({
  listing: null,
  setListing: (listing) => set({ listing }),
}));
