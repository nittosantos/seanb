'use client';

import { boatTypes } from 'public/data/boat-types';
import { z } from 'zod';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import FieldHelperText from '@/components/ui/form-fields/field-helper-text';
import CreateListingFooter from '@/components/footer/create-listing-footer';
import { useAddListingForm, useAddListingStore } from '@/stores/add-listing-store';
import AdvancedRadio from '@/components/ui/form-fields/advanced-radiobox';
import Textarea from '@/components/ui/form-fields/textarea';
import SetPrice from '@/components/add-listing/set-price';
import Text from '@/components/ui/typography/text';
import Counter from '@/components/ui/counter';

export default function BoatInfo() {
  const t = useTranslations('addListing');

  const BoatSchema = z.object({
    boatName: z
      .string()
      .min(1, { message: t('validationFieldRequired') })
      .max(24, { message: t('validationLetterLimit') }),
    boatType: z.string().min(1, { message: t('validationFieldRequired') }),
    pricePerDay: z.number().min(10, { message: t('validationMinPrice') }),
    boatDescription: z
      .string()
      .min(1, { message: t('validationLetterLimitReq') })
      .max(450, { message: t('validationLetterLimit') }),
    beadRooms: z.number().optional(),
    bathRooms: z.number().optional(),
    guests: z.number().min(1, { message: t('validationMin1Guest') }),
  });

  type BoatSchemaType = z.infer<typeof BoatSchema>;
  const setStep = useAddListingStore((s) => s.setStep);
  const [store, setStore] = useAddListingForm();
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<BoatSchemaType>({
    defaultValues: {
      boatName: store.boatName,
      boatType: store.boatType,
      pricePerDay: store.pricePerDay,
      boatDescription: store.boatDescription,
      beadRooms: store.beadRooms,
      bathRooms: store.bathRooms,
      guests: store.guests,
    },
    resolver: zodResolver(BoatSchema),
  });

  function handleBoatDetails(data: any) {
    setStore({
      ...store,
      boatName: data.boatName,
      boatType: data.boatType,
      pricePerDay: data.pricePerDay,
      boatDescription: data.boatDescription,
      beadRooms: data.beadRooms,
      bathRooms: data.bathRooms,
      guests: data.guests,
    });
    console.log(data);
    setStep(3);
  }

  return (
    <div className="w-full md:w-[448px] xl:w-[648px]">
      <form
        noValidate
        onSubmit={handleSubmit((data) => handleBoatDetails(data))}
      >
        <Textarea
          variant="outline"
          label={t('boatTitle')}
          labelClassName="!mb-4 !text-lg !font-medium md:!text-xl lg:!mb-6 2xl:!text-2xl"
          textareaClassName="h-[72px] lg:h-20 w-full resize-none lg:rounded-xl"
          maxLength={24}
          {...register('boatName')}
          error={errors.boatName?.message}
        />
        <p className="mt-1 text-sm font-normal lg:mt-2 lg:text-base">
          {watch('boatName')?.length ?? 0}
          /24
        </p>
        <Text
          tag="h3"
          className="mt-12 mb-4 text-lg !font-medium md:!text-xl lg:mb-6 2xl:!text-2xl"
        >
          {t('boatType')}
        </Text>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {boatTypes.map((item) => (
            <AdvancedRadio
              key={item.name}
              value={item.name}
              className="card-gradient cursor-pointer rounded-lg border border-gray-lighter py-4 text-center lg:rounded-xl xl:p-6 xl:text-left"
              inputClassName="[&:checked:enabled~span]:ring-1 [&:checked:enabled~span]:ring-gray-lighter [&:checked:enabled~span]:border [&:checked:enabled~span]:border-gray-dark"
              {...register('boatType')}
            >
              <div className="relative inline-block h-8 w-8">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-4   text-sm font-bold lg:text-base">
                {item.name}
              </p>
            </AdvancedRadio>
          ))}
        </div>
        <FieldHelperText className="text-xs font-normal text-red">
          {errors.boatType?.message}
        </FieldHelperText>
        <Text
          tag="h3"
          className="mt-12 mb-4 text-lg !font-medium md:!text-xl lg:mb-6 2xl:!text-2xl"
        >
          {t('setPrice')}
        </Text>
        <Controller
          name="pricePerDay"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SetPrice value={value} countBy={1} onChange={onChange} />
          )}
        />
        <FieldHelperText className="text-xs font-normal text-red">
          {errors.pricePerDay?.message}
        </FieldHelperText>
        <Textarea
          variant="outline"
          className="mt-12"
          label={t('createDescription')}
          maxLength={450}
          labelClassName="!mb-4 !text-lg !font-medium md:!text-xl lg:!mb-6 2xl:!text-2xl"
          textareaClassName="h-[72px] lg:h-20 w-full resize-none lg:rounded-xl"
          {...register('boatDescription')}
          error={errors.boatDescription?.message}
        />
        <p className="mt-1 text-sm font-normal lg:mt-2 lg:text-base">
          {watch('boatDescription')?.length ?? 0}
          /450
        </p>
        <Text
          tag="h3"
          className="mt-12 mb-4 text-lg !font-medium md:!text-xl lg:mb-6 2xl:!text-2xl"
        >
          {t('shareBasic')}
        </Text>
        <div className="grid grid-cols-1 gap-2 lg:gap-3">
          <Controller
            name="beadRooms"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="card-gradient flex items-center justify-between rounded-lg border border-gray-lighter p-6 lg:rounded-xl lg:p-8">
                <Text className="text-base !font-semibold">{t('bedRooms')}</Text>
                <Counter
                  count={value ? value : 0}
                  onCount={onChange}
                  countBy={1}
                  buttonClassName="rounded-lg !h-6 !w-6 !p-1 sm:!h-9 sm:!w-9"
                />
              </div>
            )}
          />
          <Controller
            name="bathRooms"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="card-gradient flex items-center justify-between rounded-lg border border-gray-lighter p-6 lg:rounded-xl lg:p-8">
                <Text className="text-base !font-semibold">{t('bathRooms')}</Text>
                <Counter
                  count={value ? value : 0}
                  onCount={onChange}
                  countBy={1}
                  buttonClassName="rounded-lg !h-6 !w-6 !p-1 sm:!h-9 sm:!w-9"
                />
              </div>
            )}
          />
          <Controller
            name="guests"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="card-gradient flex items-center justify-between rounded-lg border border-gray-lighter p-6 lg:rounded-xl lg:p-8">
                <Text className="text-base !font-semibold">{t('guests')}</Text>
                <Counter
                  count={value ? value : 0}
                  onCount={onChange}
                  countBy={1}
                  buttonClassName="rounded-lg !h-6 !w-6 !p-1 sm:!h-9 sm:!w-9"
                />
              </div>
            )}
          />
          <FieldHelperText className="text-xs font-normal text-red">
            {errors.guests?.message}
          </FieldHelperText>
        </div>
        <CreateListingFooter onBack={() => setStep(1)} />
      </form>
    </div>
  );
}
