'use client';

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export type DRAWER_VIEW =
  | 'PHOTO_GALLERY'
  | 'SIDE_MENU'
  | 'BOOKING_FORM'
  | 'FILTER_MENU';

export type DrawerState = {
  isOpen: boolean;
  placement: 'top' | 'right' | 'bottom' | 'left';
  view: string;
  customSize?: string;
};

interface DrawerStore extends DrawerState {
  setDrawerState: (state: Partial<DrawerState> | ((prev: DrawerState) => Partial<DrawerState>)) => void;
}

const initialState: DrawerState = {
  isOpen: false,
  placement: 'left',
  view: 'SIDE_MENU',
};

export const useDrawerStore = create<DrawerStore>((set) => ({
  ...initialState,
  setDrawerState: (stateOrFn) =>
    set((prev) => {
      const next = typeof stateOrFn === 'function' ? stateOrFn(prev) : stateOrFn;
      return { ...prev, ...next };
    }),
}));

/** Hook compatível com o uso anterior: const [drawerState, setDrawerState] = useDrawerState() */
export function useDrawerState(): [DrawerState, DrawerStore['setDrawerState']] {
  const state = useDrawerStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      placement: s.placement,
      view: s.view,
      customSize: s.customSize,
    }))
  );
  const setDrawerState = useDrawerStore((s) => s.setDrawerState);
  return [state, setDrawerState];
}
