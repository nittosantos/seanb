'use client';

import Confetti from 'react-confetti';
import { useTranslations } from 'next-intl';
import { Routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { useWindowsize } from '@/hooks/use-window-size';
import { useAddListingStore } from '@/stores/add-listing-store';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';

export default function StepsEnd() {
  const t = useTranslations('addListing');
  const router = useRouter();
  const { width, height } = useWindowsize();
  const mounted = useIsMounted();
  const createdListingSlug = useAddListingStore((s) => s.createdListingSlug);
  const resetStore = useAddListingStore((s) => s.resetStore);

  function handleViewListing() {
    if (createdListingSlug) {
      router.push(Routes.public.listingDetails(createdListingSlug));
    } else {
      router.push(Routes.private.listings);
    }
    resetStore();
  }

  function handleGoToListings() {
    router.push(Routes.private.listings);
    resetStore();
  }

  return (
    <>
      <div className="flex w-full max-w-[648px] flex-col items-center justify-center gap-6">
        <CheckCircleIcon className="h-auto w-24 text-gray-dark/40" />
        <Text tag="h5" className="text-gray-dark">
          {t('productAdded')}
        </Text>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="tracking-wider"
            onClick={handleViewListing}
          >
            {t('viewListing')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="tracking-wider"
            onClick={handleGoToListings}
          >
            {t('view')}
          </Button>
        </div>
      </div>
      {mounted && (
        <Confetti width={width - 20} height={height - 10} className="mx-auto" />
      )}
    </>
  );
}
