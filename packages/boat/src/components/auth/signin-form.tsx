'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@seanb/shared';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Routes } from '@/config/routes';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';
import Checkbox from '@/components/ui/form-fields/checkbox';
import useAuth from '@/hooks/use-auth';
import { useModal } from '@/components/modals/context';
import { ApiError } from '@/lib/api-client';

export default function SigninForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { login } = useAuth();
  const { closeModal } = useModal();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginFormSchema = useMemo(
    () =>
      loginSchema.extend({
        remember: z.boolean(),
      }),
    [],
  );

  type SignInType = z.infer<typeof loginFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInType>({
    resolver: zodResolver(loginFormSchema),
  });

  async function handleFormSubmit(data: SignInType) {
    setFormError(null);
    setIsSubmitting(true);

    try {
      await login(data.email, data.password);
      closeModal();
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
      <Input
        type="text"
        label={t('email')}
        className="mb-4"
        error={errors?.email?.message}
        required
        {...register('email')}
      />
      <Input
        type="password"
        label={t('password')}
        className="mb-4"
        error={errors?.password?.message}
        required
        {...register('password')}
      />
      <div className="mb-7 flex items-center justify-between">
        <Checkbox
          size="sm"
          label={t('rememberMe')}
          labelClassName="ml-2"
          inputClassName="!text-gray-dark"
          {...register('remember')}
        />
        <Link
          href={Routes.auth.forgotPassword}
          className="  text-sm font-semibold leading-6 text-primary underline"
        >
          {t('forgetPassword')}
        </Link>
      </div>
      <Button
        type="submit"
        className="mb-2 w-full"
        size="xl"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {t('signIn')}
      </Button>
      <p className="text-sm font-semibold leading-6 text-gray">
        {t('notMemberYet')}{' '}
        <Link href={Routes.auth.signUp} className="text-primary underline">
          {t('createAccount')}
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
