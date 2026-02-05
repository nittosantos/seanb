'use client';

import {
  ChatBubbleLeftRightIcon,
  BoltIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Text from '@/components/ui/typography/text';

export default function PricingSteps() {
  const t = useTranslations('pricing');
  const steps = [
    {
      icon: <ChatBubbleLeftRightIcon className="h-auto w-9 md:w-11" />,
      titleKey: 'step1Title' as const,
      textKey: 'step1Text' as const,
    },
    {
      icon: <BoltIcon className="h-auto w-9 md:w-11" />,
      titleKey: 'step2Title' as const,
      textKey: 'step2Text' as const,
    },
    {
      icon: <Square3Stack3DIcon className="h-auto w-9 md:w-11" />,
      titleKey: 'step3Title' as const,
      textKey: 'step3Text' as const,
    },
  ];

  return (
    <div className="bg-[#F9FAFB]">
      <div className="container-fluid grid w-full !max-w-[1296px] justify-center gap-x-4 py-4 sm:grid-cols-2 md:py-8 lg:grid-cols-3 lg:gap-6 lg:py-12 2xl:py-16 3xl:px-0">
        {steps.map((item, i) => (
          <div key={i} className="py-11 text-center xl:py-14">
            <div className="flex items-center justify-center">{item.icon}</div>
            <Text tag="h5" className="mt-9 text-base xl:mt-11 xl:text-xl">
              {t(item.titleKey)}
            </Text>
            <Text className="m-auto mt-3 w-full max-w-[227px] text-sm capitalize leading-[22px] text-gray-dark md:max-w-[260px] xl:leading-7">
              {t(item.textKey)}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
