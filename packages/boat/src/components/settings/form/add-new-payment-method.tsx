'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/form-fields/input';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';

export default function AddnewPaymentMethod() {
  const t = useTranslations('settings');

  const AddnewPaymentMethodSchema = z.object({
    fullName: z.string().min(1, { message: t('validationFieldRequired') }),
    cardNumber: z
      .string()
      .min(12, { message: t('validationCardInvalid') })
      .max(12, { message: t('validationCardInvalid') }),
    email: z
      .string()
      .min(1, { message: t('validationEmailRequired') })
      .email({ message: t('validationEmailInvalid') }),
    ccv: z.string().min(4, { message: t('validationCcvRequired') }),
  });

  type AddnewPaymentMethodType = z.infer<typeof AddnewPaymentMethodSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddnewPaymentMethodType>({
    resolver: zodResolver(AddnewPaymentMethodSchema),
  });

  function handleAddPaymentMethod(data: AddnewPaymentMethodType) {
    console.log('Data:', data);
  }

  return (
    <div>
      <Text
        tag="h3"
        className="mb-4 border-b border-b-gray-lighter pb-4 text-xl capitalize lg:mb-6"
      >
        {t('addPaymentMethod')}
      </Text>
      <form
        noValidate
        onSubmit={handleSubmit((data) => handleAddPaymentMethod(data))}
        className="mt-4 lg:mt-6"
      >
        <div className="grid grid-cols-1 gap-y-3 gap-x-3 md:grid-cols-2 lg:gap-y-4">
          <Input
            type="text"
            label={t('fullName')}
            placeholder={t('fullName')}
            labelClassName="!font-normal lg:text-base"
            {...register('fullName')}
            error={errors.fullName?.message}
          />
          <Input
            type="number"
            label={t('cardNumber')}
            placeholder="1111 2222 3333 4444"
            labelClassName="!font-normal lg:text-base"
            {...register('cardNumber')}
            error={errors.cardNumber?.message}
          />
          <Input
            type="email"
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            labelClassName="!font-normal lg:text-base"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            type="text"
            label={t('ccv')}
            placeholder={t('ccvPlaceholder')}
            labelClassName="!font-normal lg:text-base"
            {...register('ccv')}
            error={errors.ccv?.message}
          />
        </div>
        <div className="mt-8 flex items-center justify-between gap-3 xl:mt-12">
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
