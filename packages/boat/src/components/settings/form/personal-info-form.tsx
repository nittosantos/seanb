'use client';

import { useMemo } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import DateTime from '@/components/ui/form-fields/date-time-picker';
import PhoneNumber from '@/components/ui/form-fields/phone-number';
import Radio from '@/components/ui/form-fields/radio';
import Input from '@/components/ui/form-fields/input';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import clsx from 'clsx';
import { useState } from 'react';

export default function PersonalInfoForm() {
  const t = useTranslations('settings');
  const tAuth = useTranslations('auth');
  const [state, setState] = useState(false);

  const PersonalInfoSchema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(1, { message: t('validationFieldRequired') }),
        lastName: z.string().min(1, { message: t('validationFieldRequired') }),
        email: z
          .string()
          .min(1, { message: tAuth('validationEmailRequired') })
          .email({ message: tAuth('validationEmailInvalid') }),
        phoneNumber: z.string().min(7, { message: t('validationMinDigits') }),
        birthDate: z.date().optional(),
        townCity: z.string().optional(),
        zipCode: z.string().optional(),
        bio: z.string().optional(),
        gender: z.string(),
        country: z.string().optional(),
        city: z.string().optional(),
        streetAddress: z.string().optional(),
        state: z.string().optional(),
      }),
    [t, tAuth]
  );

  type PersonalInfoType = z.infer<typeof PersonalInfoSchema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PersonalInfoType>({
    defaultValues: {
      gender: 'male',
    },
    resolver: zodResolver(PersonalInfoSchema),
  });

  function handlePersonalInfo(data: any) {
    console.log('Data:', data);
  }

  return (
    <div>
      <Text
        tag="h3"
        className="mb-4 border-b border-b-gray-lighter pb-4 text-xl lg:mb-6"
      >
        {t('personalInfo')}
      </Text>
      <form
        noValidate
        onSubmit={handleSubmit((data) => handlePersonalInfo(data))}
        className="grid grid-cols-1 gap-8 xl:gap-12"
      >
        <div>
          <div className="mb-4 grid grid-cols-1 gap-3 md:mb-6 xl:gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                label={tAuth('firstName')}
                placeholder={tAuth('firstName')}
                labelClassName="!font-normal lg:text-base"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                type="text"
                label={tAuth('lastName')}
                placeholder={tAuth('lastName')}
                labelClassName="!font-normal lg:text-base"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                type="email"
                label={tAuth('email')}
                placeholder={tAuth('email')}
                labelClassName="!font-normal lg:text-base"
                {...register('email')}
                error={errors.email?.message}
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PhoneNumber
                    country="us"
                    label={t('phoneNumber')}
                    labelClassName="!font-normal lg:text-base"
                    buttonClassName="personal-info-phone-input"
                    inputClassName="!pl-14"
                    onChange={onChange}
                    value={value}
                    error={errors?.phoneNumber?.message}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="birthDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DateTime
                    onFocus={(e) => e.target.blur()}
                    label={t('dateOfBirth')}
                    selected={value}
                    onChange={onChange}
                    showMonthDropdown
                    showYearDropdown
                    yearDropdownItemNumber={30}
                    scrollableYearDropdown
                    maxDate={new Date()}
                    dateFormat="dd / LL / yy"
                    labelClassName="!font-normal !text-sm lg:!text-base mb-2"
                    placeholderText="dd/mm/yyyy"
                    inputClassName={clsx(
                      state &&
                        '!border !border-gray-dark !ring-[1px] !ring-gray-900/20'
                    )}
                    onCalendarOpen={() => setState(true)}
                    onCalendarClose={() => setState(false)}
                  />
                )}
              />
              <Input
                type="text"
                label={t('townCity')}
                placeholder={t('townCity')}
                labelClassName="!font-normal lg:text-base !mb-2"
                {...register('townCity')}
                error={errors.townCity?.message}
              />
              <Input
                type="number"
                label={t('zipCode')}
                placeholder="1234"
                labelClassName="!font-normal lg:text-base"
                {...register('zipCode')}
                error={errors.zipCode?.message}
              />
              <Input
                type="text"
                label={t('bio')}
                placeholder={t('bio')}
                labelClassName="!font-normal lg:text-base"
                {...register('bio')}
                error={errors.bio?.message}
              />
            </div>
          </div>
          <Text tag="h6" className="mb-4">
            {t('gender')}
          </Text>
          <div className="flex items-center gap-8">
            <Radio
              label={t('male')}
              labelClassName="!ml-3 !text-gray-dark font-normal"
              inputClassName="!border-gray-lighter focus:!ring-1 focus:!ring-offset-0 focus:!ring-gray-dark ring-1 !ring-gray-dark !text-gray-dark"
              value="male"
              {...register('gender')}
            />
            <Radio
              label={t('female')}
              value="female"
              labelClassName="!ml-3 text-gray font-normal"
              inputClassName="!border-gray-lighter focus:!ring-1 focus:!ring-offset-0 focus:!ring-gray-dark ring-1 !ring-gray-dark !text-gray-dark"
              {...register('gender')}
            />
          </div>
        </div>
        <div>
          <Text
            tag="h3"
            className="mb-4 border-b border-b-gray-lighter pb-4 text-xl lg:mb-6"
          >
            {t('address')}
          </Text>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              <Input
                type="text"
                label={t('country')}
                placeholder={t('country')}
                labelClassName="!font-normal lg:text-base"
                {...register('country')}
                error={errors.country?.message}
              />
              <Input
                type="text"
                label={t('city')}
                placeholder={t('city')}
                labelClassName="!font-normal lg:text-base"
                {...register('city')}
                error={errors.city?.message}
              />
            </div>
            <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2 ">
              <Input
                type="text"
                label={t('streetAddress')}
                placeholder={t('streetAddressPlaceholder')}
                labelClassName="!font-normal lg:text-base"
                {...register('streetAddress')}
                error={errors.streetAddress?.message}
              />
              <Input
                type="text"
                label={t('state')}
                placeholder={t('statePlaceholder')}
                labelClassName="!font-normal lg:text-base"
                {...register('state')}
                error={errors.state?.message}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            size="xl"
            variant="outline"
            className="w-full border-gray-dark hover:bg-gray-dark hover:text-white md:w-auto"
          >
            {t('cancel')}
          </Button>
          <Button type="submit" size="xl" className="w-full md:w-auto">
            {t('save')}
          </Button>
        </div>
      </form>
    </div>
  );
}
