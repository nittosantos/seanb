'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@seanb/shared';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Routes } from '@/config/routes';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';
import Checkbox from '@/components/ui/form-fields/checkbox';
import useAuth from '@/hooks/use-auth';
import { ApiError } from '@/lib/api-client';

export default function SignUpForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signUpFormSchema = useMemo(
    () =>
      registerSchema
        .extend({
          firstName: z
            .string()
            .min(1, { message: t('validationFieldRequired') }),
          lastName: z.string().optional(),
          confirmPassword: registerSchema.shape.password,
          acceptPolicy: z.literal(true, {
            errorMap: () => ({ message: t('validationAcceptPolicy') }),
          }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('validationPasswordsDontMatch'),
          path: ['confirmPassword'],
        }),
    [t],
  );

  type SignUpType = z.infer<typeof signUpFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpFormSchema),
  });

  async function handleFormSubmit(data: SignUpType) {
    setFormError(null);
    setIsSubmitting(true);

    const name = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();

    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: name || undefined,
      });
      router.push(Routes.private.dashboard);
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
      <div className="flex items-center justify-between gap-3">
        <Input
          type="text"
          label={t('firstName')}
          className="mb-4"
          error={errors?.firstName?.message}
          required
          {...register('firstName')}
        />
        <Input
          type="text"
          label={t('lastName')}
          className="mb-4"
          error={errors?.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <Input
        type="text"
        label={t('email')}
        className="mb-4"
        error={errors?.email?.message}
        required
        {...register('email')}
      />
      <div className="flex items-center justify-between gap-3">
        <Input
          type="password"
          label={t('password')}
          className="mb-4"
          error={errors?.password?.message}
          required
          {...register('password')}
        />
        <Input
          type="password"
          label={t('confirmPassword')}
          className="mb-4"
          error={errors?.confirmPassword?.message}
          required
          {...register('confirmPassword')}
        />
      </div>
      <Checkbox
        label={
          <>
            <span className="font-normal">{t('acceptPolicy')}</span>
            <Link href="/" className="underline">
              {t('termsAndPrivacy')}
            </Link>
          </>
        }
        size="sm"
        className="mb-7"
        labelClassName="ml-3"
        containerClassName="!items-start"
        inputClassName="!text-gray-dark"
        error={errors?.acceptPolicy?.message}
        {...register('acceptPolicy')}
      />
      <Button
        type="submit"
        className="mb-2 w-full"
        size="xl"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {t('signUp')}
      </Button>
      <p className="text-sm leading-6 text-gray">
        {t('alreadyHaveAccount')}{' '}
        <Link
          href={Routes.auth.signIn}
          className="font-semibold text-primary underline"
        >
          {t('signIn')}
        </Link>
      </p>
      <div className="relative mt-7 mb-8 text-center before:absolute before:top-1/2 before:left-0 before:h-[1px] before:w-full before:bg-gray-200">
        <span className="relative z-10 m-auto inline-flex bg-white px-5">
          {t('or')}
        </span>
      </div>
    </form>
  );
}
