'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';

export default function PricingHero({
  state,
  onClick,
}: {
  state: string;
  onClick: (key: string) => void;
}) {
  const t = useTranslations('pricing');

  return (
    <div className="mt-8 text-center   lg:mt-20 2xl:mt-24">
      <Text tag="h1" className="text-[28px] font-bold leading-10">
        {t('selectPlan')}
      </Text>
      <Text className="mt-2 text-base 2xl:mt-4">
        {t('simplePricing')}
      </Text>
      <div className="mt-8 inline-block rounded-md bg-[#F2F4F7] p-1 2xl:mt-14">
        <Button
          size="lg"
          className={clsx(
            'focus:!ring-0 2xl:!p-[11px_26px]',
            state === 'monthly'
              ? 'bg-gray-dark text-white'
              : '!bg-transparent !text-gray-dark'
          )}
          onClick={() => onClick('monthly')}
        >
          {t('monthlyPlan')}
        </Button>
        <Button
          size="lg"
          className={clsx(
            'focus:!ring-0 2xl:!p-[11px_26px]',
            state === 'annually'
              ? 'bg-gray-dark text-white'
              : '!bg-transparent !text-gray-dark'
          )}
          onClick={() => onClick('annually')}
        >
          {t('annuallyPlan')}
        </Button>
      </div>
    </div>
  );
}
