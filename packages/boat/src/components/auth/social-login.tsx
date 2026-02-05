'use client';

import { useTranslations } from 'next-intl';
import useAuth from '@/hooks/use-auth';
import Button from '@/components/ui/button';
import { AppleIcon } from '@/components/icons/apple';
import { FBIcon } from '@/components/icons/facebook';
import { GoogleIcon } from '@/components/icons/google';
import { useModal } from '@/components/modals/context';

export default function SocialLogin() {
  const t = useTranslations('auth');
  const { closeModal } = useModal();
  const { authorize } = useAuth();

  const handleSocialLogin = () => {
    authorize();
    closeModal();
  };

  return (
    <>
      <Button
        onClick={handleSocialLogin}
        type="button"
        variant="outline"
        size="xl"
        className="mb-3 w-full"
      >
        <FBIcon className="mr-5" />
        {t('signUpWithFacebook')}
      </Button>
      <Button
        onClick={handleSocialLogin}
        type="button"
        variant="outline"
        size="xl"
        className="mb-3 w-full"
      >
        <GoogleIcon className="mr-5" />
        {t('signUpWithGoogle')}
      </Button>

      <Button
        onClick={handleSocialLogin}
        type="button"
        variant="outline"
        size="xl"
        className="w-full"
      >
        <AppleIcon className="mr-5" />
        {t('signUpWithApple')}
      </Button>
    </>
  );
}
