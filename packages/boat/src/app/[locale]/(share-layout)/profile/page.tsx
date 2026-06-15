'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import useAuth from '@/hooks/use-auth';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const router = useRouter();
  const { isAuthorized, user, isHydrating } = useAuth();

  useEffect(() => {
    if (!isHydrating && isAuthorized && user?.id) {
      router.replace(Routes.public.userID(user.id));
    }
  }, [isAuthorized, isHydrating, router, user?.id]);

  if (isHydrating || (isAuthorized && user?.id)) {
    return (
      <div className="container-fluid mb-12 py-16 text-center">
        <Text className="text-gray">{t('loading')}</Text>
      </div>
    );
  }

  return (
    <div className="container-fluid mb-12 py-16">
      <div className="rounded-xl border border-gray-lighter bg-gray-50 py-16 text-center">
        <Text className="mb-4 text-gray">{t('loginRequired')}</Text>
        <Button onClick={() => router.push(Routes.auth.signIn)}>
          {t('signIn')}
        </Button>
      </div>
    </div>
  );
}
