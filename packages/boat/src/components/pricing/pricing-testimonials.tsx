'use client';

import { useTranslations } from 'next-intl';
import Text from '@/components/ui/typography/text';
import Accordion from '@/components/ui/accordion';

export default function PricingTestimonials() {
  const t = useTranslations('pricing');

  return (
    <div className="container-fluid w-full !max-w-[1248px] pt-12 lg:pt-20 2xl:pb-8 3xl:px-0 3xl:pt-24">
      <div className="text-center">
        <Text tag="h2" className="text-xl md:!text-2xl xl:!text-3xl">
          {t('faqTitle')}
        </Text>
        <Text className="mt-2 text-sm lg:mt-3">
          {t('faqSubtitle')}
        </Text>
      </div>
      <div className="mt-8 lg:mt-12 2xl:mt-16">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Accordion
            key={i}
            title={t(`pricingFaq${i}Title`)}
            text={t(`pricingFaq${i}Text`)}
          />
        ))}
      </div>
    </div>
  );
}
