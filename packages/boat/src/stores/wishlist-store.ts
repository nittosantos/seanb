'use client';

import { create } from 'zustand';

interface WishlistState {
  ids: string[];
  isLoaded: boolean;
  setIds: (ids: string[]) => void;
  addId: (id: string) => void;
  removeId: (id: string) => void;
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  ids: [],
  isLoaded: false,
  setIds: (ids) => set({ ids, isLoaded: true }),
  addId: (id) =>
    set((state) => ({
      ids: state.ids.includes(id) ? state.ids : [...state.ids, id],
    })),
  removeId: (id) =>
    set((state) => ({
      ids: state.ids.filter((itemId) => itemId !== id),
    })),
  reset: () => set({ ids: [], isLoaded: false }),
}));
