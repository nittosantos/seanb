'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import CreateListingFooter from '@/components/footer/create-listing-footer';
import { useAddListingForm, useAddListingStore } from '@/stores/add-listing-store';
import Input from '@/components/ui/form-fields/input';
import Text from '@/components/ui/typography/text';

export default function AddSpecification() {
  const t = useTranslations('addListing');

  const EquipmentSchema = z
  .object({
    engine: z.string(),
    engineTorque: z.string(),
    fuelSystem: z.string(),
    boreStroke: z.string(),
    infotainmentSystem: z.string(),
    displacement: z.string(),
    fuelCapacity: z.string(),
    compressionRatio: z.string(),
    luggageCapacity: z.string(),
    fuelEconomy: z.string(),
    weight: z.string(),
  })
  .optional();

type EquipmentSchemaType = z.infer<typeof EquipmentSchema>;

  const setStep = useAddListingStore((s) => s.setStep);
  const [store, setStore] = useAddListingForm();
  const {
    handleSubmit,
    register,
    formState: { errors },
    // @ts-ignore
  } = useForm<EquipmentSchemaType>({
    resolver: zodResolver(EquipmentSchema),
  });

  function handleSpecification(data: any) {
    setStore({
      ...store,
      specification: data,
    });
    console.log(data);
    setStep(7);
  }

  return (
    <div className="w-full md:w-[448px] xl:w-[648px]">
      <form
        noValidate
        onSubmit={handleSubmit((data) => handleSpecification(data))}
      >
        <Text
          tag="h3"
          className="mb-4 text-lg !font-medium md:!text-xl lg:mb-6 2xl:!text-2xl"
        >
          {t('setSpecifications')}
        </Text>
        <div className="grid grid-cols-1 gap-4">
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('engine')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderEngine')}
              inputClassName="!h-10 lg:!h-12"
              {...register('engine')}
              error={errors?.engine?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('engineTorque')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderTorque')}
              inputClassName="!h-10 lg:!h-12"
              {...register('engineTorque')}
              error={errors?.engineTorque?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('fuelSystem')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderEngine')}
              inputClassName="!h-10 lg:!h-12"
              {...register('fuelSystem')}
              error={errors?.fuelSystem?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('boreStroke')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderTorque')}
              inputClassName="!h-10 lg:!h-12"
              {...register('boreStroke')}
              error={errors?.boreStroke?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('infotainmentSystem')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderEngine')}
              inputClassName="!h-10 lg:!h-12"
              {...register('infotainmentSystem')}
              error={errors?.infotainmentSystem?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('displacement')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderTorque')}
              inputClassName="!h-10 lg:!h-12"
              {...register('displacement')}
              error={errors?.displacement?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('fuelCapacity')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderEngine')}
              inputClassName="!h-10 lg:!h-12"
              {...register('fuelCapacity')}
              error={errors?.fuelCapacity?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('compressionRatio')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderTorque')}
              inputClassName="!h-10 lg:!h-12"
              {...register('compressionRatio')}
              error={errors?.compressionRatio?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('luggageCapacity')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderEngine')}
              inputClassName="!h-10 lg:!h-12"
              {...register('luggageCapacity')}
              error={errors?.luggageCapacity?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('fuelEconomy')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderTorque')}
              inputClassName="!h-10 lg:!h-12"
              {...register('fuelEconomy')}
              error={errors?.fuelEconomy?.message}
            />
          </div>
          <div className="gap-2 lg:grid lg:items-center xl:grid-cols-2">
            <Text className="mb-2 font-medium md:font-bold lg:mb-0">
              {t('weight')}
            </Text>
            <Input
              type="text"
              placeholder={t('placeholderEngine')}
              inputClassName="!h-10 lg:!h-12"
              {...register('weight')}
              error={errors?.weight?.message}
            />
          </div>
        </div>
        <CreateListingFooter onBack={() => setStep(5)} />
      </form>
    </div>
  );
}
