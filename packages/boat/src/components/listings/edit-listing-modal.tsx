'use client';

import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editListingFormSchema,
  mapEditListingFormToUpdateInput,
  type EditListingFormInput,
  type UpdateListingInput,
} from '@seanb/shared';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/form-fields/input';
import Textarea from '@/components/ui/form-fields/textarea';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import type { ListingCard } from '@/types/listings';

type EditListingModalProps = {
  listing: ListingCard | null;
  description?: string;
  isOpen: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (values: UpdateListingInput) => void;
};

export default function EditListingModal({
  listing,
  description = '',
  isOpen,
  isSaving = false,
  onClose,
  onSave,
}: EditListingModalProps) {
  const t = useTranslations('account');
  const tSettings = useTranslations('settings');

  const schema = useMemo(
    () =>
      editListingFormSchema.extend({
        title: editListingFormSchema.shape.title.min(3, {
          message: t('validationTitleMin'),
        }),
        price: z.coerce.number().min(1, { message: t('validationPriceMin') }),
        location: z.string().min(1, {
          message: t('validationLocationRequired'),
        }),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditListingFormInput>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        price: listing.priceValue,
        location: listing.location,
        description,
      });
    }
  }, [listing, description, reset]);

  if (!isOpen || !listing) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <Text tag="h3" className="mb-4 text-xl">
          {t('editListing')}
        </Text>
        <form
          noValidate
          onSubmit={handleSubmit((data) =>
            onSave(mapEditListingFormToUpdateInput(data)),
          )}
          className="grid grid-cols-1 gap-4"
        >
          <Input
            type="text"
            label={t('listingTitle')}
            {...register('title')}
            error={errors.title?.message}
          />
          <Input
            type="number"
            label={t('listingPrice')}
            {...register('price')}
            error={errors.price?.message}
          />
          <Input
            type="text"
            label={t('listingLocation')}
            {...register('location')}
            error={errors.location?.message}
          />
          <Textarea
            label={t('listingDescription')}
            {...register('description')}
            error={errors.description?.message}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {tSettings('cancel')}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('saving') : tSettings('save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
