'use client';

import { useMemo, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { useListings } from '@/hooks/use-listings';
import { useMyWishlist } from '@/hooks/use-my-wishlist';
import { TabItem, Tablist, TabPanel, TabPanels } from '@/components/ui/tab';
import DirectContactCard from '@/components/profile/direct-contact-card';
import ListingCard from '@/components/ui/cards/listing';
import ListingCardLoader from '@/components/ui/loader/listing-card-loader';
import Contact from '@/components/profile/contact';
import Text from '@/components/ui/typography/text';
import { toListingCardProps } from '@/lib/listing-card-mapper';
import type { ListingCard as ListingCardType } from '@/types/listings';

function ListingGrid({
  items,
  idPrefix,
  isLoading,
  emptyMessage,
}: {
  items: ListingCardType[];
  idPrefix: string;
  isLoading: boolean;
  emptyMessage?: string;
}) {
  if (isLoading) {
    return (
      <div className="md:gap- grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 sm:gap-y-7 lg:grid-cols-3 2xl:grid-cols-4 2xl:gap-x-6 2xl:gap-y-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <ListingCardLoader key={`${idPrefix}-loader-${index}`} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-lighter bg-gray-50 py-12 text-center">
        <Text className="text-gray">{emptyMessage}</Text>
      </div>
    );
  }

  return (
    <div className="md:gap- grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 sm:gap-y-7 lg:grid-cols-3 2xl:grid-cols-4 2xl:gap-x-6 2xl:gap-y-8">
      {items.map((item, index) => {
        const props = toListingCardProps(item, idPrefix, index);
        return <ListingCard key={item.id} {...props} />;
      })}
    </div>
  );
}

type ProfileListBlockProps = {
  ownerId: string;
  isOwnProfile?: boolean;
};

export default function ProfileListBlock({
  ownerId,
  isOwnProfile = false,
}: ProfileListBlockProps) {
  const t = useTranslations('profile');
  const { listings, isLoading } = useListings({ ownerId, limit: 12 });
  const { listings: wishlist, isLoading: isWishlistLoading } = useMyWishlist();
  const [selected, setSelected] = useState(0);

  const tabData = useMemo(() => {
    const tabs = [{ title: t('listing'), path: 'listing' }];

    if (isOwnProfile) {
      tabs.push({ title: t('favourite'), path: 'favourite' });
    }

    tabs.push({ title: t('contact'), path: 'contact' });
    return tabs;
  }, [isOwnProfile, t]);

  return (
    <div>
      <Tab.Group selectedIndex={selected} onChange={setSelected}>
        <Tablist className="relative flex w-full items-center gap-8 lg:gap-14">
          {tabData.map((item) => (
            <TabItem key={item.path} motionLayoutId="profileTab">
              {item.title}
            </TabItem>
          ))}
          <div className="absolute left-0 bottom-0 h-0.5 w-full rounded-xl bg-gray-lightest lg:h-1"></div>
        </Tablist>
        <TabPanels className="mt-5 lg:mt-8">
          <TabPanel>
            <ListingGrid
              items={listings}
              idPrefix="profile-listing-cards"
              isLoading={isLoading}
              emptyMessage={t('noListings')}
            />
          </TabPanel>
          {isOwnProfile && (
            <TabPanel>
              <ListingGrid
                items={wishlist}
                idPrefix="profile-favourite-cards"
                isLoading={isWishlistLoading}
                emptyMessage={t('noFavourites')}
              />
            </TabPanel>
          )}
          <TabPanel>
            <Text tag="h3" className="mb-5 text-xl md:!text-2xl">
              {t('contact')}
            </Text>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Contact />
              <DirectContactCard />
            </div>
          </TabPanel>
        </TabPanels>
      </Tab.Group>
    </div>
  );
}
