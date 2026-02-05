'use client';

import { create } from 'zustand';

export type MODAL_VIEW =
  | 'SIGN_IN'
  | 'SIGN_UP'
  | 'ADD_REVIEW'
  | 'REPORT_LISTING'
  | 'CONTACT_HOST'
  | 'SEARCH_MODAL'
  | 'SHARE';

interface ModalState {
  open: boolean;
  view: string;
}

interface ModalStore extends ModalState {
  openModal: (view: MODAL_VIEW) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  open: false,
  view: 'ADD_REVIEW_VIEW',
  openModal: (view) => set({ view, open: true }),
  closeModal: () => set({ open: false }),
}));
