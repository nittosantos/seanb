'use client';

import { useTranslations } from 'next-intl';
import { useListings } from '@/hooks/use-listings';
import ListingCard from '@/components/ui/cards/listing';
import ListingCardLoader from '@/components/ui/loader/listing-card-loader';
import { toListingCardProps } from '@/lib/listing-card-mapper';
import NotFound from '@/components/errors/not-found';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const { listings, isLoading } = useListings({ limit: 6 });

  if (isLoading) {
    return (
      <div className="container-fluid mb-12 pt-6 lg:mb-16">
        <div className="grid grid-cols-1 gap-y-8 gap-x-5 xs:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ListingCardLoader key={`wishlist-loader-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mb-12 pt-6 lg:mb-16">
      <h2 className="mb-8 text-2xl font-bold text-primary">{t('title')}</h2>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-8 gap-x-5 xs:grid-cols-2 lg:grid-cols-3">
          {listings.map((item, index) => {
            const props = toListingCardProps(item, 'wishlist-boat', index);
            return <ListingCard key={item.id} {...props} />;
          })}
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
