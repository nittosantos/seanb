'use client';

import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { XMarkIcon } from '@heroicons/react/24/solid';
import {
  addReviewFormSchema,
  mapAddReviewFormToCreateReview,
  type AddReviewFormInput,
} from '@seanb/shared';
import { useTranslations } from 'next-intl';
import Textarea from '@/components/ui/form-fields/textarea';
import { useModal } from '@/components/modals/context';
import ActionIcon from '@/components/ui/action-icon';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import Rate from '@/components/ui/rating';
import { useListingDetailStore } from '@/stores/listing-detail-store';
import useAuth from '@/hooks/use-auth';
import { createReview } from '@/lib/listings-api';
import { ApiError } from '@/lib/api-client';

export default function AddReview() {
  const t = useTranslations('modals');
  const { closeModal, openModal } = useModal();
  const listing = useListingDetailStore((state) => state.listing);
  const { isAuthorized, accessToken } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      addReviewFormSchema.extend({
        rating: addReviewFormSchema.shape.rating.min(1, {
          message: t('minStars'),
        }),
        message: addReviewFormSchema.shape.message.min(1, {
          message: t('saySomething'),
        }),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddReviewFormInput>({
    resolver: zodResolver(schema),
  });

  async function handleReview(data: AddReviewFormInput) {
    if (!listing?.slug) {
      setFormError(t('reviewListingMissing'));
      return;
    }

    if (!isAuthorized || !accessToken) {
      closeModal();
      openModal('SIGN_IN');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await createReview(
        listing.slug,
        mapAddReviewFormToCreateReview(data),
        accessToken,
      );
      closeModal();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError(t('reviewSubmitError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!listing) {
    return null;
  }

  return (
    <div className="relative z-50 mx-auto w-full max-w-full overflow-hidden rounded-xl bg-white p-6 sm:w-[520px] sm:p-8 md:w-[648px] md:p-10 lg:p-12">
      <div className="flex items-center justify-between">
        <Text tag="h3" className="text-xl leading-8 md:!text-xl">
          {t('addReview')}
        </Text>
        <ActionIcon
          size="sm"
          variant="outline"
          className="border-none !p-0 focus:!ring-0"
          onClick={closeModal}
        >
          <XMarkIcon className="h-6 w-6" />
        </ActionIcon>
      </div>
      <form noValidate onSubmit={handleSubmit((data) => handleReview(data))}>
        {formError && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </p>
        )}
        <div className="mt-8">
          <Text tag="h6">{t('yourRating')}</Text>
          <Controller
            name="rating"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Rate
                className="mt-3"
                allowClear
                defaultValue={0}
                value={value}
                size="xl"
                onChange={onChange}
                error={errors.rating?.message}
              />
            )}
          />
        </div>
        <Textarea
          className="mt-8"
          label={t('feedback')}
          textareaClassName="w-full min-h-[160px] focus:border-gray-dark py-3 !px-5"
          labelClassName="!text-base font-bold text-gray-dark"
          {...register('message')}
          error={errors?.message?.message}
        />
        <Button
          type="submit"
          size="xl"
          variant="solid"
          className="mt-4 w-full !py-[15px] !font-semibold uppercase tracking-[0.7px] sm:mt-8 lg:mt-12"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </form>
    </div>
  );
}
