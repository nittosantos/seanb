'use client';

import { useParams } from 'next/navigation';
import useAuth from '@/hooks/use-auth';
import { usePublicProfile } from '@/hooks/use-public-profile';
import VendorProfileCard from '@/components/ui/cards/vendor-profile-card';
import ProfileListBlock from '@/components/profile/profile-list-block';
import Text from '@/components/ui/typography/text';
import { useTranslations } from 'next-intl';

export default function UserPage() {
  const t = useTranslations('profile');
  const params = useParams<{ userID: string }>();
  const userID = params?.userID ?? '';
  const { user, isAuthorized, isHydrating } = useAuth();
  const { profile, isLoading, notFound } = usePublicProfile(userID);
  const isOwnProfile = isAuthorized && user?.id === profile?.id;

  if (isLoading || isHydrating) {
    return (
      <div className="container-fluid mb-12 py-16 text-center">
        <Text className="text-gray">{t('loading')}</Text>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="container-fluid mb-12 py-16 text-center">
        <Text tag="h2" className="mb-2 text-xl font-bold">
          {t('notFoundTitle')}
        </Text>
        <Text className="text-gray">{t('notFoundDesc')}</Text>
      </div>
    );
  }

  return (
    <div className="mb-12 lg:mb-16">
      <div className="container-fluid mb-10 !px-0 sm:!px-0 md:mb-12 md:!px-6 xl:mb-16 2xl:!px-7 3xl:!px-8 4xl:!px-16">
        <VendorProfileCard profile={profile} />
      </div>
      <div className="container-fluid">
        <ProfileListBlock ownerId={profile.id} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
}
