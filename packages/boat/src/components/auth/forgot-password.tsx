'use client';

import { useTranslations } from 'next-intl';
import ForgotPasswordForm from '@/components/auth/forgot-password-form';

export default function ForgotPassword() {
  const t = useTranslations('auth');

  return (
    <div className="container mt-8 mb-12 px-4 lg:mb-16">
      <div className="m-auto w-full max-w-[496px] rounded-lg border border-gray-200 p-6 pt-9 sm:p-12">
        <div className="mb-8">
          <h2 className="mb-3 text-3xl font-bold uppercase leading-[48px] text-primary">
            {t('forgetPasswordTitle')}
          </h2>
          <p className="text-base leading-5 text-gray">
            {t('forgetPasswordSubtitle')}
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
