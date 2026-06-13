'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '@seanb/shared';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/form-fields/input';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { changeUserPassword } from '@/lib/users-api';

export default function ChangePassword() {
  const t = useTranslations('settings');
  const accessToken = useAuthStore((state) => state.accessToken);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const changePasswordFormSchema = changePasswordSchema
    .extend({
      confirmPassword: changePasswordSchema.shape.newPassword,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('validationPasswordsDontMatch'),
      path: ['confirmPassword'],
    });

  type ChangePasswordType = z.infer<typeof changePasswordFormSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  async function handleChangePassword(data: ChangePasswordType) {
    if (!accessToken) return;

    setIsSaving(true);
    setFeedback(null);

    try {
      await changeUserPassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        accessToken,
      );
      reset();
      setFeedback(t('passwordUpdated'));
    } catch {
      setFeedback(t('passwordUpdateError'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <Text
        tag="h3"
        className="mb-4 border-b border-b-gray-lighter pb-4 text-xl lg:mb-6"
      >
        {t('changePassword')}
      </Text>
      {feedback && (
        <Text className="mb-4 text-sm text-gray-dark">{feedback}</Text>
      )}
      <form
        noValidate
        onSubmit={handleSubmit((data) => handleChangePassword(data))}
      >
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 md:gap-y-4">
          <Input
            type="password"
            label={t('currentPassword')}
            labelClassName="!font-normal lg:text-base"
            {...register('currentPassword')}
            error={errors.currentPassword?.message}
          />
          <Input
            type="password"
            label={t('newPassword')}
            labelClassName="!font-normal lg:text-base"
            {...register('newPassword')}
            error={errors.newPassword?.message}
          />
          <Input
            type="password"
            label={t('confirmPassword')}
            labelClassName="!font-normal lg:text-base"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            className="col-span-2 md:col-span-1"
          />
        </div>
        <div className="mt-8 xl:mt-12">
          <Button
            type="submit"
            size="xl"
            className="w-full transition-transform duration-100 focus:!ring-0 active:scale-95 md:w-auto"
            disabled={isSaving}
          >
            {isSaving ? t('saving') : t('updatePassword')}
          </Button>
        </div>
      </form>
    </div>
  );
}
