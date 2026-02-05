'use client';

import { create } from 'zustand';

interface QueryParamState {
  query: string;
  setQuery: (query: string) => void;
}

export const useQueryParamStore = create<QueryParamState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
}));
