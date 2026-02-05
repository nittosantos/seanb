'use client';

import { useModalStore } from '@/stores/modal-store';
import type { MODAL_VIEW } from '@/stores/modal-store';

export type { MODAL_VIEW };

export function useModal() {
  const open = useModalStore((s) => s.open);
  const view = useModalStore((s) => s.view);
  const openModal = useModalStore((s) => s.openModal);
  const closeModal = useModalStore((s) => s.closeModal);

  return {
    open,
    view,
    openModal,
    closeModal,
  };
}
