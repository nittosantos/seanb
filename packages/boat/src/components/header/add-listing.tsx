'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addScrollingClass } from '@/utils/add-scrolling-class';
import { useAddListingStore } from '@/stores/add-listing-store';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';
import Logo from '@/components/ui/logo';

export default function AddListingHeader() {
  const router = useRouter();
  const headerRef = useRef<HTMLElement | null>(null);
  addScrollingClass(headerRef);
  const store = useAddListingStore((s) => ({
    boatName: s.boatName,
    boatType: s.boatType,
    pricePerDay: s.pricePerDay,
    boatDescription: s.boatDescription,
    beadRooms: s.beadRooms,
    bathRooms: s.bathRooms,
    guests: s.guests,
    location: s.location,
    phoneNumber: s.phoneNumber,
    equipment: s.equipment,
    images: s.images,
    specification: s.specification,
  }));

  function handleSaveExit() {
    console.log(store);
    router.push(Routes.private.dashboard);
  }

  return (
    <header
      ref={headerRef}
      className="addlisting-header sticky top-0 z-50 flex h-16 w-full bg-white md:flex md:items-center lg:h-[72px] 2xl:h-20 4xl:h-24"
    >
      <div className="container-fluid flex w-full items-center justify-between">
        <Logo className="!text-gray-dark" />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="!py-[6px] !px-3 text-xs !font-semibold capitalize text-gray md:!px-4 md:!py-2 md:text-sm 2xl:!py-[10px] 2xl:!px-6 2xl:text-base"
          >
            Questions
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="!py-[6px] !px-3 text-xs !font-semibold capitalize text-gray md:!px-4 md:!py-2 md:text-sm 2xl:!py-[10px] 2xl:!px-6 2xl:text-base"
            onClick={handleSaveExit}
          >
            Save & Exit
          </Button>
        </div>
      </div>
    </header>
  );
}
