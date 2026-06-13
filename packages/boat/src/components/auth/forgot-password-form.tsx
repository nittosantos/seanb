'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@seanb/shared';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';
import { forgotPasswordRequest } from '@/lib/auth-api';
import { ApiError } from '@/lib/api-client';

export default function ForgotPasswordForm() {
  const t = useTranslations('auth');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      forgotPasswordSchema.extend({
        email: z
          .string()
          .min(1, { message: t('validationEmailRequired') })
          .email({ message: t('validationEmailInvalid') }),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(schema),
  });

  async function handleFormSubmit(data: ForgotPasswordInput) {
    setFormError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await forgotPasswordRequest(data);
      setSuccessMessage(response.message);
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError(t('authError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit((d) => handleFormSubmit(d))}>
      {formError && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {formError}
        </p>
      )}
      {successMessage && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {successMessage}
        </p>
      )}
      <Input
        type="text"
        label={t('email')}
        className="mb-4"
        error={errors?.email?.message}
        required
        disabled={isSubmitting || !!successMessage}
        {...register('email')}
      />

      <Button
        type="submit"
        className="mb-2 w-full"
        size="xl"
        disabled={isSubmitting || !!successMessage}
      >
        {isSubmitting ? t('sendingEmail') : t('sendEmail')}
      </Button>
    </form>
  );
}
