'use client';

import { useTranslations } from 'next-intl';
import { topBoats } from 'public/data/top-boats';
import ListingCard from '@/components/ui/cards/listing';
import Text from '@/components/ui/typography/text';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const wishlistBoats = topBoats.slice(0, 6);

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="pt-8 lg:pt-12">
        <Text tag="h1" className="mb-2 text-2xl md:!text-3xl xl:!text-4xl">
          {t('title')}
        </Text>
        <Text className="mb-8 text-gray">
          {t('subtitle')}
        </Text>
      </div>
      {wishlistBoats.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-8 gap-x-5 xs:grid-cols-2 lg:grid-cols-3 3xl:gap-y-10 4xl:grid-cols-4">
          {wishlistBoats.map((item, index) => (
            <ListingCard
              key={`wishlist-boat-${index}`}
              id={`wishlist-boat-${index}`}
              slides={item.thumbnail}
              time={item.time}
              caption={item.caption}
              title={item.title}
              slug={item.slug}
              location={item.location}
              price={item.price}
              ratingCount={item.ratingCount}
              rating={item.rating}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-lighter bg-gray-50 py-16 text-center">
          <Text className="mb-4 text-gray">{t('emptyTitle')}</Text>
          <Text className="text-sm text-gray">
            {t('emptyDesc')}
          </Text>
        </div>
      )}
    </div>
  );
}
