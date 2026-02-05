'use client';

import { useGalleryStore } from '@/stores/gallery-store';
import type { GALLERY_VIEW } from '@/stores/gallery-store';

export type { GALLERY_VIEW };

export function useGallery() {
  const open = useGalleryStore((s) => s.open);
  const view = useGalleryStore((s) => s.view);
  const initialSlide = useGalleryStore((s) => s.initialSlide);
  const openGallery = useGalleryStore((s) => s.openGallery);
  const closeGallery = useGalleryStore((s) => s.closeGallery);

  return {
    open,
    view,
    initialSlide,
    openGallery,
    closeGallery,
  };
}
