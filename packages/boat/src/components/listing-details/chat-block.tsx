'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import useAuth from '@/hooks/use-auth';
import { Routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import { useModal } from '@/components/modals/context';
import { useListingDetail } from '@/contexts/listing-detail-context';
import Text from '@/components/ui/typography/text';
import Section from '@/components/ui/section';
import Button from '@/components/ui/button';

export default function ChatBlock() {
  const t = useTranslations('listing');
  const router = useRouter();
  const listing = useListingDetail();
  const { isAuthorized } = useAuth();
  const { openModal } = useModal();

  function handleClick() {
    if (isAuthorized) {
      router.push(`${Routes.private.inbox}?listing=${listing.id}`);
      return;
    }

    openModal('SIGN_IN');
  }

  return (
    <Section className="py-5 xl:py-7">
      <div className="flex justify-between">
        <div>
          <Text
            tag="h3"
            className="mb-3 text-xl capitalize md:mb-2 md:!text-[22px] 2xl:!text-2xl"
          >
            {t('chatTitle')}
          </Text>
          <p className="mb-8 leading-6 text-gray">{t('chatDescription')}</p>
          <Button
            size="xl"
            variant="outline"
            className="w-full !border-gray-dark !py-[8px] !px-4 !font-bold text-gray-dark hover:bg-gray-dark hover:text-white md:w-auto md:border-gray lg:!py-[14px] lg:!px-[28px]"
            onClick={handleClick}
          >
            {t('chatNow')}
          </Button>
        </div>
        <div className="relative hidden h-40 w-64 md:block">
          <Image
            src="/images/questions.png"
            alt={t('chatTitle')}
            fill
            sizes="(min-width: 320) 100vw, 100vw"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </Section>
  );
}
