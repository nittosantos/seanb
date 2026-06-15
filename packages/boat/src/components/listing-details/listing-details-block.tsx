'use client';

import SpecificationBlock from '@/components/listing-details/specification-block';
import BookingForm from '@/components/listing-details/booking-form/booking-form';
import CalenderBlock from '@/components/listing-details/calendar/calender-block';
import ListingDetailsHeroBlock from '@/components/listing-details/hero-block';
import DescriptionBlock from '@/components/listing-details/descripton-block';
import EquipmentBlock from '@/components/listing-details/equipment-block';
import LocationBlock from '@/components/listing-details/location-block';
import ReviewBlock from '@/components/listing-details/review-block';
import VendorBlock from '@/components/listing-details/vendor-block';
import ChatBlock from '@/components/listing-details/chat-block';
import { useListingDetail } from '@/contexts/listing-detail-context';
import { useModal } from '@/components/modals/context';
import Button from '@/components/ui/button';

export default function ListingDetails() {
  const listing = useListingDetail();
  const { openModal } = useModal();

  return (
    <>
      <div className="flex justify-between gap-5 lg:gap-8 xl:gap-12 4xl:gap-16">
        <div className="w-full">
          <ListingDetailsHeroBlock
            vendor={listing.vendor}
            listingId={listing.id}
          />
          <DescriptionBlock description={listing.description} />
          <EquipmentBlock equipment={listing.equipment} />
          <SpecificationBlock specifications={listing.specifications} />
          <VendorBlock
            stats={listing.reviewsData.stats}
            vendor={listing.vendor}
          />
          <LocationBlock />
          <CalenderBlock />
          <ReviewBlock reviewsData={listing.reviewsData} />
          <ChatBlock />
        </div>
        <div className="hidden w-full max-w-sm pb-11 lg:block xl:max-w-md 3xl:max-w-lg">
          <div className="sticky top-32 4xl:top-40">
            <BookingForm
              price={listing.price}
              averageRating={listing.reviewsData.stats.averageRating}
              totalReviews={listing.reviewsData.stats.totalReview}
            />
            <div className="mt-4 w-full text-center 4xl:mt-8">
              <Button
                size="lg"
                variant="text"
                className="relative !p-0 !font-bold !text-secondary focus:!ring-0"
                onClick={() => openModal('REPORT_LISTING')}
              >
                Report this listing
                <span className="absolute left-0 bottom-0 w-full border border-gray"></span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
