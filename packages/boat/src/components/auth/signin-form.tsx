'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Routes } from '@/config/routes';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';
import Checkbox from '@/components/ui/form-fields/checkbox';
import useAuth from '@/hooks/use-auth';
import { useModal } from '@/components/modals/context';

export default function SigninForm() {
  const t = useTranslations('auth');
  const { authorize } = useAuth();
  const { closeModal } = useModal();

  const loginInfoSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t('validationEmailRequired') })
          .email({ message: t('validationEmailInvalid') }),
        password: z
          .string()
          .min(8, { message: t('validationPasswordMin') }),
        remember: z.boolean(),
      }),
    [t]
  );

  type SignInType = z.infer<typeof loginInfoSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInType>({
    resolver: zodResolver(loginInfoSchema),
  });

  // TO-DO: Send data to API onSubmit.
  function handleFormSubmit(data: SignInType) {
    console.log('Submitted data', data);
    authorize();
    closeModal();
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
      <Button type="submit" className="mb-2 w-full" size="xl">
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
