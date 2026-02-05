'use client';

import { useTranslations } from 'next-intl';
import Text from '@/components/ui/typography/text';
import Accordion from '@/components/ui/accordion';
import SubscriptionBlock from '@/components/subscription/subscription-block';

const FAQ_COUNT = 6;

export default function HelpPage() {
  const t = useTranslations('help');

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="mx-auto max-w-3xl pt-8 lg:pt-12">
        <div className="text-center">
          <Text tag="h1" className="text-2xl md:!text-3xl xl:!text-4xl">
            {t('title')}
          </Text>
          <Text className="mt-3 text-gray">
            {t('subtitle')}
          </Text>
        </div>
        <div className="mt-10 lg:mt-14">
          {Array.from({ length: FAQ_COUNT }, (_, i) => (
            <Accordion
              key={i}
              title={t(`faq${i}Title`)}
              text={t(`faq${i}Text`)}
            />
          ))}
        </div>
      </div>
      <SubscriptionBlock sectionClassName="mt-16 4xl:!px-16" />
    </div>
  );
}
