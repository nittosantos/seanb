'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useMyWishlist } from '@/hooks/use-my-wishlist';
import { useWishlistStore } from '@/stores/wishlist-store';
import useAuth from '@/hooks/use-auth';
import ListingCard from '@/components/ui/cards/listing';
import ListingCardLoader from '@/components/ui/loader/listing-card-loader';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';
import { toListingCardProps } from '@/lib/listing-card-mapper';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const router = useRouter();
  const { isAuthorized, isHydrating } = useAuth();
  const { listings, isLoading } = useMyWishlist();
  const ids = useWishlistStore((state) => state.ids);
  const visibleListings = listings.filter((item) => ids.includes(item.id));

  if (isHydrating || isLoading) {
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

  if (!isAuthorized) {
    return (
      <div className="container-fluid mb-12 pt-6 lg:mb-16">
        <div className="rounded-xl border border-gray-lighter bg-gray-50 py-16 text-center">
          <Text className="mb-4 text-gray">{t('loginRequired')}</Text>
          <Button onClick={() => router.push(Routes.auth.signIn)}>
            {t('signIn')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mb-12 pt-6 lg:mb-16">
      <Text tag="h1" className="mb-2 text-2xl font-bold text-primary">
        {t('title')}
      </Text>
      <Text className="mb-8 text-gray">{t('subtitle')}</Text>
      {visibleListings.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-8 gap-x-5 xs:grid-cols-2 lg:grid-cols-3">
          {visibleListings.map((item, index) => {
            const props = toListingCardProps(item, 'wishlist-boat', index);
            return <ListingCard key={item.id} {...props} />;
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-lighter bg-gray-50 py-16 text-center">
          <Text tag="h3" className="mb-2 font-bold text-gray-dark">
            {t('emptyTitle')}
          </Text>
          <Text className="mb-6 text-gray">{t('emptyDesc')}</Text>
          <Link href={Routes.public.explore}>
            <Button>{t('exploreBoats')}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
