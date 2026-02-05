'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Drawer from '@/components/ui/drawer';
import clsx from 'clsx';
import { useDrawerStore } from '@/stores/drawer-store';
import { useShallow } from 'zustand/react/shallow';
import type { DRAWER_VIEW } from '@/stores/drawer-store';

const PhotoGallery = dynamic(
  () => import('@/components/ui/drawers/photo-gallery')
);
const SideMenu = dynamic(() => import('@/components/ui/drawers/side-menu'));
const Filter = dynamic(() => import('@/components/explore/filter'));
const BookingFormModal = dynamic(
  () => import('@/components/ui/drawers/booking-form-drawer')
);

export type { DRAWER_VIEW };

// render drawer contents
function renderDrawerContent(view: DRAWER_VIEW | string) {
  switch (view) {
    case 'PHOTO_GALLERY':
      return <PhotoGallery />;
    case 'SIDE_MENU':
      return <SideMenu />;
    case 'FILTER_MENU':
      return <Filter />;
    case 'BOOKING_FORM':
      return <BookingFormModal />;
    default:
      return null;
  }
}

export default function DrawerContainer() {
  const drawerState = useDrawerStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      placement: s.placement,
      view: s.view,
      customSize: s.customSize,
    }))
  );
  const setDrawerState = useDrawerStore((s) => s.setDrawerState);
  const pathName = usePathname();

  useEffect(() => {
    if (drawerState.isOpen) {
      setDrawerState({ isOpen: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <>
      <Drawer
        isOpen={drawerState.isOpen}
        placement={drawerState.placement}
        customSize={drawerState.customSize}
        containerClassName={clsx(
          drawerState.view === 'BOOKING_FORM' && 'bg-white',
          drawerState.view === 'PHOTO_GALLERY' && 'bg-white overflow-y-auto'
        )}
        onClose={() => setDrawerState({ isOpen: false })}
      >
        {renderDrawerContent(drawerState.view)}
      </Drawer>
    </>
  );
}
