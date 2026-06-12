'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/button';

interface BackNextFooterTypes {
  onNext?: () => void;
  onBack?: () => void;
  isLoading?: boolean;
  disableNext?: boolean;
  submitLabel?: string;
}

export default function CreateListingFooter({
  onNext,
  onBack,
  isLoading = false,
  disableNext = false,
  submitLabel,
}: BackNextFooterTypes) {
  const t = useTranslations('addListing');

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 w-full bg-white">
      <div className="container-fluid flex items-center justify-between py-3 lg:py-4">
        <Button
          type="button"
          variant="text"
          className="!px-0 text-sm !font-bold capitalize focus:!ring-0 lg:text-base"
          onClick={onBack}
          disabled={isLoading}
        >
          <ChevronLeftIcon className="mr-2 h-auto w-4" />
          {t('back')}
        </Button>
        <Button
          type="submit"
          className="text-sm !font-bold capitalize focus:!ring-0 lg:text-base"
          onClick={onNext}
          isLoading={isLoading}
          disabled={isLoading || disableNext}
        >
          {submitLabel ?? t('next')}{' '}
          {!submitLabel && <ChevronRightIcon className="ml-2 h-auto w-4" />}
        </Button>
      </div>
    </div>
  );
}
