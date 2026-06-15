'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import type { ReviewStatsTypes, ReviewTypes } from '@/types';
import ReviewCard from '@/components/ui/cards/review-card';
import ReviewStat from '@/components/ui/cards/review-stat';
import { useModal } from '@/components/modals/context';
import Section from '@/components/ui/section';
import Button from '@/components/ui/button';
import Text from '@/components/ui/typography/text';

const REVIEWS_PER_PAGE = 3;

interface ReviewBlockTypes {
  reviewsData: {
    stats: ReviewStatsTypes;
    reviews: ReviewTypes[];
  };
}

export default function ReviewBlock({ reviewsData }: ReviewBlockTypes) {
  const t = useTranslations('listing');
  const { openModal } = useModal();
  const [page, setPage] = useState(0);

  const { stats, reviews } = reviewsData;
  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));

  useEffect(() => {
    setPage(0);
  }, [reviews.length]);

  const visibleReviews = useMemo(() => {
    const start = page * REVIEWS_PER_PAGE;
    return reviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [page, reviews]);

  const title = t('reviewsTitle', { count: stats.totalReview });
  const mobileSummary = t('reviewsSummary', {
    rating: stats.averageRating,
    count: stats.totalReview,
  });

  function goToPreviousPage() {
    setPage((current) => Math.max(0, current - 1));
  }

  function goToNextPage() {
    setPage((current) => Math.min(totalPages - 1, current + 1));
  }

  return (
    <Section
      id="reviews"
      title={title}
      className="scroll-mt-20 py-5 xl:py-7"
      titleClassName="text-xl md:!text-[22px] 2xl:!text-2xl hidden md:block"
      rightElement={
        <Button
          size="xl"
          variant="outline"
          className="hidden !border-gray-dark !py-[10px] !px-4 !text-sm !font-bold !leading-[18px] text-gray-dark hover:bg-gray-1000 hover:text-white md:block md:border-gray md:!text-base lg:!py-[14px] lg:!px-[30px]"
          onClick={() => openModal('ADD_REVIEW')}
        >
          {t('addReview')}
        </Button>
      }
    >
      <Text tag="h2" className="mb-2 flex items-center gap-2 text-xl md:hidden">
        <StarIcon className="h-auto w-6" />
        {mobileSummary}
      </Text>
      <Button
        size="xl"
        variant="outline"
        className="mb-4 w-full !border-gray-dark !py-[10px] !text-sm !font-bold text-gray-dark md:hidden"
        onClick={() => openModal('ADD_REVIEW')}
      >
        {t('addReview')}
      </Button>
      <ReviewStat stats={stats} />
      <div className="md:mt-8">
        {visibleReviews.length > 0 ? (
          visibleReviews.map((item, index) => (
            <ReviewCard
              key={`${item.name}-${item.date}-${page * REVIEWS_PER_PAGE + index}`}
              avatar={item.avatar}
              name={item.name}
              date={item.date}
              location={item.location}
              rating={item.rating}
              review={item.review}
            />
          ))
        ) : (
          <Text className="py-8 text-center text-gray">{t('noReviews')}</Text>
        )}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between md:mt-12">
          <Button
            size="lg"
            variant="text"
            className="!p-0 !ring-0"
            disabled={page === 0}
            onClick={goToPreviousPage}
          >
            <span className="flex items-center gap-6 font-medium text-gray-dark drop-shadow-sm hover:text-gray disabled:opacity-40">
              <ArrowLeftIcon className="h-auto w-6" />
              {t('previousPage')}
            </span>
          </Button>
          <Text className="text-sm text-gray">
            {t('pageOf', { current: page + 1, total: totalPages })}
          </Text>
          <Button
            size="lg"
            variant="text"
            className="!p-0 !ring-0"
            disabled={page >= totalPages - 1}
            onClick={goToNextPage}
          >
            <span className="flex items-center gap-6 font-medium text-gray-dark drop-shadow-sm hover:text-gray disabled:opacity-40">
              {t('nextPage')}
              <ArrowRightIcon className="h-auto w-6" />
            </span>
          </Button>
        </div>
      )}
    </Section>
  );
}
