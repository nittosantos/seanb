'use client';

import { create } from 'zustand';

export type GALLERY_VIEW = 'MODAL_GALLERY';

interface GalleryState {
  open: boolean;
  view: string;
  initialSlide: number;
}

interface GalleryStore extends GalleryState {
  openGallery: (view: GALLERY_VIEW, initialSlide?: number) => void;
  closeGallery: () => void;
}

export const useGalleryStore = create<GalleryStore>((set) => ({
  open: false,
  view: 'MODAL_GALLERY',
  initialSlide: 1,
  openGallery: (view, initialSlide = 1) =>
    set({ view, open: true, initialSlide }),
  closeGallery: () => set({ open: false }),
}));
