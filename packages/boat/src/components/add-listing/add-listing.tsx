'use client';

import dynamic from 'next/dynamic';
import { useAddListingStore } from '@/stores/add-listing-store';

const CreateListing = dynamic(
  () => import('@/components/add-listing/steps/create-listing')
);
const BoatInfo = dynamic(
  () => import('@/components/add-listing/steps/boat-info')
);
const AddBoatPhotos = dynamic(
  () => import('@/components/add-listing/steps/upload-photos')
);
const AddLocation = dynamic(
  () => import('@/components/add-listing/steps/add-location')
);
const AddEquipment = dynamic(
  () => import('@/components/add-listing/steps/add-equipment')
);
const AddSpecification = dynamic(
  () => import('@/components/add-listing/steps/add-specification')
);
const StepsEnd = dynamic(
  () => import('@/components/add-listing/steps/steps-end')
);

export default function AddListing() {
  const step = useAddListingStore((s) => s.step);

  let stepComponent;
  switch (step) {
    case 1:
      stepComponent = <CreateListing />;
      break;
    case 2:
      stepComponent = <BoatInfo />;
      break;
    case 3:
      stepComponent = <AddBoatPhotos />;
      break;
    case 4:
      stepComponent = <AddLocation />;
      break;
    case 5:
      stepComponent = <AddEquipment />;
      break;
    case 6:
      stepComponent = <AddSpecification />;
      break;
    case 7:
      stepComponent = <StepsEnd />;
      break;
    default:
      stepComponent = null;
  }

  return (
    <div className="flex flex-grow items-center justify-center px-4 pt-10 pb-24">
      {stepComponent}
    </div>
  );
}
