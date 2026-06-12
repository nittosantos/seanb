'use client';

import { useTranslations } from 'next-intl';
import Calendar from '@/components/listing-details/calendar/calendar';
import { useListingDetail } from '@/contexts/listing-detail-context';
import { useListingBookedDates } from '@/hooks/use-listing-booked-dates';
import Section from '@/components/ui/section';

export default function CalenderBlock() {
  const t = useTranslations('listing');
  const listing = useListingDetail();
  const { bookedRanges, isLoading } = useListingBookedDates(listing.slug);

  return (
    <Section
      className="py-5 xl:py-7"
      title={t('availability')}
      titleClassName="text-xl md:!text-[22px] 2xl:!text-2xl mb-2"
      description={listing.location ?? ''}
      descriptionClassName="!text-gray !text-base"
    >
      <ul className="pt-4 md:pt-6">
        <li className="flex items-center gap-3 text-sm text-gray-dark">
          <span className="block h-4 w-4 rounded-sm bg-[#eaeaea]"></span>
          {t('bookedDates')}
        </li>
      </ul>
      {!isLoading && (
        <Calendar
          bookedRanges={bookedRanges}
          noMonth={3}
          className="mt-7 min-h-[324px] md:min-h-[400px] xl:min-h-[424px]"
          monthContainerClassName="month"
        />
      )}
    </Section>
  );
}
