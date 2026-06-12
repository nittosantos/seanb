'use client';

import { useTranslations } from 'next-intl';
import { useTimeout } from '@/hooks/use-timeout';
import { useListings } from '@/hooks/use-listings';
import ListingCardLoader from '@/components/ui/loader/listing-card-loader';
import ListingCard from '@/components/ui/cards/listing';
import SeeMore from '@/components/ui/see-more';
import Section from '@/components/ui/section';
import { toListingCardProps } from '@/lib/listing-card-mapper';

function NewBoatsGrid() {
  const { listings, isLoading } = useListings({ limit: 8 });
  const items = listings.slice(4, 8);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-y-8 gap-x-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:gap-y-10">
        {Array.from({ length: 4 }).map((_, index) => (
          <ListingCardLoader key={`new-boat-loader-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-8 gap-x-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:gap-y-10">
      {items.map((item, index) => {
        const props = toListingCardProps(item, 'new-boat', index);
        return <ListingCard key={item.id} {...props} />;
      })}
    </div>
  );
}

export default function NewBoats() {
  const t = useTranslations('home');
  const { state } = useTimeout();

  return (
    <Section
      className="container-fluid mt-12 overflow-hidden lg:mt-16"
      title={t('newBoatsTitle')}
      description={t('topDestinationsDesc')}
      headerClassName="items-end mb-4 lg:mb-5 xl:mb-6 gap-5"
      rightElement={<SeeMore />}
    >
      {!state && <ListingCardLoader />}
      {state && <NewBoatsGrid />}
    </Section>
  );
}
