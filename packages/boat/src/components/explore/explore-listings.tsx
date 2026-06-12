'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ListingCard from '@/components/ui/cards/listing';
import Button from '@/components/ui/button';
import ListingCardLoader from '@/components/ui/loader/listing-card-loader';
import { fetchListings } from '@/lib/listings-api';
import { parseExploreSearchParams } from '@/lib/explore-query';
import { toListingCardProps } from '@/lib/listing-card-mapper';
import type { ListingCard as ListingCardType } from '@/types/listings';

const PAGE_SIZE = 12;

export default function ExploreListings() {
  const t = useTranslations('explore');
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseExploreSearchParams(searchParams ?? new URLSearchParams()),
    [searchParams],
  );

  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadPage = useCallback(
    async (pageToLoad: number, append: boolean) => {
      if (pageToLoad === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await fetchListings({
          ...filters,
          page: pageToLoad,
          limit: PAGE_SIZE,
        });

        setTotal(response.meta.total);
        setListings((current) =>
          append ? [...current, ...response.data] : response.data,
        );
        setPage(pageToLoad);
      } catch {
        if (!append) {
          setListings([]);
          setTotal(0);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    void loadPage(1, false);
  }, [loadPage]);

  const hasMore = listings.length < total;

  if (isLoading) {
    return (
      <div className="mt-1 grid grid-cols-1 gap-y-8 gap-x-5 xs:grid-cols-2 lg:grid-cols-3 3xl:gap-y-10 4xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ListingCardLoader key={`explore-loader-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mt-1 grid grid-cols-1 gap-y-8 gap-x-5 xs:grid-cols-2 lg:grid-cols-3 3xl:gap-y-10 4xl:grid-cols-4">
        {listings.map((item, index) => {
          const props = toListingCardProps(item, 'explore-boat', index);
          return <ListingCard key={item.id} {...props} />;
        })}
      </div>
      {hasMore && (
        <Button
          size="xl"
          type="button"
          isLoading={isLoadingMore}
          onClick={() => loadPage(page + 1, true)}
          className="relative bottom-0 left-1/2 z-30 mx-auto mt-16 -translate-x-1/2 py-2.5 px-6 md:sticky md:bottom-10 md:text-base xl:relative xl:bottom-0"
        >
          {t('loadMore')}
        </Button>
      )}
    </div>
  );
}
