'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import BookingForm from '@/components/listing-details/booking-form/booking-form';
import { useListingDetail } from '@/contexts/listing-detail-context';
import { useDrawerState } from '@/stores/drawer-store';
import ActionIcon from '@/components/ui/action-icon';

export default function BookingFormModal() {
  const listing = useListingDetail();
  const [, setDrawerState] = useDrawerState();

  return (
    <div className="w-full bg-white">
      <div className="container-fluid sticky top-0 z-10 flex h-14 w-full items-center justify-end bg-white shadow-sm">
        <ActionIcon
          variant="outline"
          size="sm"
          rounded="full"
          className="md:h-8 md:w-8"
          onClick={() => setDrawerState({ isOpen: false })}
        >
          <XMarkIcon className="h-4 w-4" />
        </ActionIcon>
      </div>
      <BookingForm
        price={listing.price}
        averageRating={listing.reviewsData.stats.averageRating}
        totalReviews={listing.reviewsData.stats.totalReview}
        className="mx-auto mt-5 w-full max-w-lg !border-none !shadow-none"
      />
    </div>
  );
}
