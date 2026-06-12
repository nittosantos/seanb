'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/ui/button';
import { AppleIcon } from '@/components/icons/apple';
import { FBIcon } from '@/components/icons/facebook';
import { GoogleIcon } from '@/components/icons/google';

export default function SocialLogin() {
  const t = useTranslations('auth');

  return (
    <>
      <p className="mb-3 text-center text-sm text-gray">{t('socialComingSoon')}</p>
      <Button
        type="button"
        variant="outline"
        size="xl"
        className="mb-3 w-full"
        disabled
      >
        <FBIcon className="mr-5" />
        {t('signUpWithFacebook')}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="xl"
        className="mb-3 w-full"
        disabled
      >
        <GoogleIcon className="mr-5" />
        {t('signUpWithGoogle')}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="xl"
        className="w-full"
        disabled
      >
        <AppleIcon className="mr-5" />
        {t('signUpWithApple')}
      </Button>
    </>
  );
}
