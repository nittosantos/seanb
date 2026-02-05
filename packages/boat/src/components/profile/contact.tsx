'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import PhoneNumber from '@/components/ui/form-fields/phone-number';
import Checkbox from '@/components/ui/form-fields/checkbox';
import Textarea from '@/components/ui/form-fields/textarea';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';

export default function Contact() {
  const t = useTranslations('profile');

  const contactSchema = z.object({
    message: z.string().min(1, { message: t('validationFieldRequired') }),
    email: z
      .string()
      .min(1, { message: t('validationEmailRequired') })
      .email({ message: t('validationEmailInvalid') }),
    phoneNumber: z.string().min(7, { message: t('validationMin7Digits') }),
    remember: z.boolean().optional(),
  });

  type ContactSchemaType = z.infer<typeof contactSchema>;
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactSchemaType>({
    defaultValues: {
      remember: false,
    },
    resolver: zodResolver(contactSchema),
  });

  function handleFormSubmit(data: any) {
    console.log('Data:', data);
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
        className="mt-4 lg:mt-6"
      >
        <Textarea
          label={t('yourMessage')}
          variant="outline"
          className="w-full"
          placeholder={t('yourMessagePlaceholder')}
          labelClassName="font-bold lg:text-base text-gray-dark"
          textareaClassName="w-full lg:rounded-xl h-24 md:h-32 xl:h-40"
          {...register('message')}
          error={errors.message?.message}
        />
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-6 lg:gap-5">
          <Input
            type="email"
            label={t('yourEmail')}
            placeholder={t('emailPlaceholder')}
            labelClassName="lg:text-base text-gray-dark"
            {...register('email')}
            error={errors.email?.message}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneNumber
                country="us"
                value={value}
                onChange={onChange}
                label={t('phoneNumber')}
                error={errors?.phoneNumber?.message}
                buttonClassName="vendor-contact-phone-input"
                labelClassName="font-bold lg:text-base text-gray-dark"
                inputClassName="!pl-14"
              />
            )}
          />
        </div>
        <div className="mt-4 lg:mt-6">
          <Checkbox
            label={t('saveEmailCheckbox')}
            variant="outline"
            inputClassName="lg:h-6 lg:w-6"
            iconClassName="bg-gray-dark rounded-lg lg:h-6 lg:w-6"
            {...register('remember')}
          />
        </div>
        <Button
          type="submit"
          size="xl"
          className="mt-4 w-full md:w-auto lg:mt-6"
        >
          {t('submit')}
        </Button>
      </form>
    </>
  );
}
