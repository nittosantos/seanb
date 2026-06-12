'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import CreateListingFooter from '@/components/footer/create-listing-footer';
import { useAddListingStore } from '@/stores/add-listing-store';
import useAuth from '@/hooks/use-auth';
import { DuplicateIcon } from '@/components/icons/duplicate-icon';
import { CakeIcon } from '@/components/icons/cake-icon';
import Text from '@/components/ui/typography/text';

export default function CreateListing() {
  const t = useTranslations('addListing');
  const router = useRouter();
  const { user } = useAuth();
  const setStep = useAddListingStore((s) => s.setStep);
  const resetStore = useAddListingStore((s) => s.resetStore);

  const displayName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <>
      <div className="w-full md:w-[548px] xl:w-[648px]">
        <Text tag="h2" className="text-xl md:!text-2xl 2xl:!text-3xl">
          {t('welcomeBack', { name: displayName })}
        </Text>
        <Text
          tag="h3"
          className="mt-8 text-lg font-medium md:!text-xl 2xl:!text-2xl"
        >
          {t('startNewListing')}
        </Text>
        <div>
          <div
            onClick={() => {
              resetStore();
              setStep(2);
            }}
            className="card-gradient mt-4 flex cursor-pointer items-center gap-5 rounded-md border border-gray-lighter p-6 font-bold text-gray-dark transition duration-200 hover:shadow-card md:p-8 lg:mt-6 lg:p-10 lg:text-xl 2xl:rounded-lg 2xl:p-12"
          >
            <CakeIcon className="h-auto w-8" />
            {t('createNewListing')}
          </div>
          <div className="card-gradient mt-4 flex cursor-not-allowed items-center gap-5 rounded-md border border-gray-lighter p-6 font-bold text-gray-dark opacity-60 md:p-8 lg:mt-6 lg:p-10 lg:text-xl 2xl:rounded-lg 2xl:p-12">
            <DuplicateIcon className="h-auto w-8" />
            {t('duplicateListing')}
          </div>
        </div>
      </div>
      <CreateListingFooter onBack={() => router.back()} onNext={() => setStep(2)} />
    </>
  );
}
