'use client';

import { useTranslations } from 'next-intl';
import { useListings } from '@/hooks/use-listings';
import { useListingDetail } from '@/contexts/listing-detail-context';
import ListingCard from '@/components/ui/cards/listing';
import Section from '@/components/ui/section';
import { toListingCardProps } from '@/lib/listing-card-mapper';

export default function RelatedListingBlock() {
  const t = useTranslations('listing');
  const { slug } = useListingDetail();
  const { listings, isLoading } = useListings({
    limit: 4,
    excludeSlug: slug,
  });

  if (isLoading || listings.length === 0) {
    return null;
  }

  return (
    <Section
      className="py-8 xl:py-10"
      title={t('similarYachts')}
      titleClassName="text-xl md:!text-[22px] 2xl:!text-2xl"
    >
      <div className="grid grid-cols-1 gap-y-8 gap-x-5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:gap-y-10">
        {listings.map((item, index) => {
          const props = toListingCardProps(item, 'related-boat', index);
          return <ListingCard key={item.id} {...props} />;
        })}
      </div>
    </Section>
  );
}
