'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';

export default function ForgotPasswordForm() {
  const t = useTranslations('auth');

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t('validationEmailRequired') })
          .email({ message: t('validationEmailInvalid') }),
      }),
    [t]
  );

  type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // TO-DO: Send data to API onSubmit.
  function handleFormSubmit(data: ForgotPasswordType) {
    console.log('Submitted data', data);
  }

  return (
    <form noValidate onSubmit={handleSubmit((d) => handleFormSubmit(d))}>
      <Input
        type="text"
        label={t('email')}
        className="mb-4"
        error={errors?.email?.message}
        required
        {...register('email')}
      />

      <Button type="submit" className="mb-2 w-full" size="xl">
        {t('sendEmail')}
      </Button>
    </form>
  );
}
