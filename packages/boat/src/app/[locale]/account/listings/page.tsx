'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { fetchMyListings } from '@/lib/listings-api';
import { toListingCardProps } from '@/lib/listing-card-mapper';
import ListingCard from '@/components/ui/cards/listing';
import ListingCardLoader from '@/components/ui/loader/listing-card-loader';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';

export default function ListingPage() {
  const t = useTranslations('account');
  const accessToken = useAuthStore((state) => state.accessToken);
  const [listings, setListings] = useState<Awaited<ReturnType<typeof fetchMyListings>>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    fetchMyListings(accessToken)
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-4 md:mt-10 lg:mt-12 xl:mt-16">
        <Text tag="h4" className="text-xl">
          {t('yourListings')}
        </Text>
        <Link href={Routes.private.addListing}>
          <Button size="sm">{t('addListing')}</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-y-8 gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ListingCardLoader key={`listing-loader-${index}`} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-8 gap-x-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((item, index) => {
            const props = toListingCardProps(item, 'account-listing', index);
            return <ListingCard key={item.id} {...props} />;
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-lighter bg-gray-50 py-16 text-center">
          <Text className="mb-4 text-gray">{t('noListingsYet')}</Text>
          <Link href={Routes.private.addListing}>
            <Button>{t('addListing')}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
