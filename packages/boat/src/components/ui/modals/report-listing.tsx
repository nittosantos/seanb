'use client';

import Text from '@/components/ui/typography/text';
import { XMarkIcon } from '@heroicons/react/24/solid';
import ActionIcon from '@/components/ui/action-icon';
import Radio from '@/components/ui/form-fields/radio';
import Button from '@/components/ui/button';
import { useMemo, useState } from 'react';
import Input from '@/components/ui/form-fields/input';
import Textarea from '@/components/ui/form-fields/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  listingReportReasonSchema,
  reportListingFeedbackSchema,
  type ListingReportReason,
} from '@seanb/shared';
import { useTranslations } from 'next-intl';
import { useModal } from '@/components/modals/context';
import { useListingDetailStore } from '@/stores/listing-detail-store';
import useAuth from '@/hooks/use-auth';
import { submitListingReport } from '@/lib/feedback-api';
import { ApiError } from '@/lib/api-client';

const REPORT_REASONS = listingReportReasonSchema.options;

type ReportFormProps = {
  reason: ListingReportReason;
};

function ReportForm({ reason }: ReportFormProps) {
  const t = useTranslations('modals');
  const { closeModal } = useModal();
  const listing = useListingDetailStore((state) => state.listing);
  const { accessToken } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackSchema = useMemo(
    () =>
      reportListingFeedbackSchema.extend({
        email: z
          .string()
          .min(1, { message: t('validationEmailRequired') })
          .email({ message: t('validationEmailInvalid') }),
        message: z.string().min(1, { message: t('messageRequired') }),
      }),
    [t],
  );

  type FeedbackSchemaType = z.infer<typeof feedbackSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackSchemaType>({
    resolver: zodResolver(feedbackSchema),
  });

  async function handleFeedback(data: FeedbackSchemaType) {
    if (!listing?.slug) {
      setFormError(t('listingMissing'));
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await submitListingReport(
        listing.slug,
        {
          reason,
          email: data.email,
          message: data.message,
        },
        accessToken,
      );
      closeModal();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError(t('reportSubmitError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) => handleFeedback(data))}
      className="mt-8"
    >
      {formError && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {formError}
        </p>
      )}
      <Input
        type="email"
        size="lg"
        variant="outline"
        label={t('email')}
        {...register('email')}
        error={errors.email?.message}
      />
      <Textarea
        className="mt-4"
        label={t('feedback')}
        textareaClassName="w-full min-h-[160px] focus:border-gray-dark py-3 !px-5"
        labelClassName="font-bold text-gray-dark"
        {...register('message')}
        error={errors.message?.message}
      />
      <div className="mt-12 flex">
        <Button
          type="submit"
          size="lg"
          variant="solid"
          className="ml-auto !w-24 !font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  );
}

export default function ReportListing() {
  const t = useTranslations('modals');
  const { closeModal } = useModal();

  const report = REPORT_REASONS.map((reason) => ({
    reason,
    title: t(`reportReason.${reason}`),
  }));

  const [selected, setSelected] = useState<ListingReportReason>(REPORT_REASONS[0]);
  const [step, setStep] = useState(1);

  return (
    <div className="mx-auto w-full max-w-full overflow-hidden rounded-xl bg-white p-12 xs:w-[480px] sm:w-[520px]">
      <div className="flex items-center justify-between">
        <Text tag="h3" className="text-xl leading-8 md:!text-xl">
          {t('whyReporting')}
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
      <Text className="mt-4 !text-base !text-gray">
        {t('wontBeShared')}
      </Text>
      {step === 1 && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 ">
            {report.map((item) => (
              <div
                key={item.reason}
                className="flex cursor-pointer items-center justify-between"
                onClick={() => setSelected(item.reason)}
              >
                <span>{item.title}</span>
                <Radio
                  name="report"
                  readOnly
                  checked={item.reason === selected}
                  className="[&>div>div]:!p-0"
                  inputClassName={
                    item.reason === selected
                      ? '!border-gray-lighter focus:!ring-1 focus:!ring-offset-0 focus:!ring-gray-dark ring-1 !ring-gray-dark !text-gray-dark'
                      : ''
                  }
                />
              </div>
            ))}
          </div>
          <div className="mt-12 flex">
            <Button
              size="lg"
              variant="solid"
              className="ml-auto !w-24 !font-bold"
              onClick={() => setStep(2)}
            >
              {t('next')}
            </Button>
          </div>
        </>
      )}
      {step === 2 && <ReportForm reason={selected} />}
    </div>
  );
}
