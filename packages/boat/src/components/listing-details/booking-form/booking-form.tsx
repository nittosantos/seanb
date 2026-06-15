'use client';

import { z } from 'zod';
import clsx from 'clsx';
import { differenceInCalendarDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SelectBox from '@/components/listing-details/booking-form/select-box';
import DateTime from '@/components/ui/form-fields/date-time-picker';
import { Staricon } from '@/components/icons/star-icon';
import Button from '@/components/ui/button';
import { useListingDetail } from '@/contexts/listing-detail-context';
import useAuth from '@/hooks/use-auth';
import { Routes } from '@/config/routes';
import { createReservation } from '@/lib/reservations-api';
import {
  bookingFormObjectSchema,
  bookingGuestSelectionSchema,
  mapBookingDatesToCreateReservation,
  type BookingFormInput,
} from '@seanb/shared';
import { ApiError } from '@/lib/api-client';
import { useListingBookedDates } from '@/hooks/use-listing-booked-dates';
import {
  filterAvailableDate,
  isRangeAvailable,
} from '@/lib/listing-availability';

interface BookingFormProps {
  price: number;
  averageRating: number;
  totalReviews: number;
  className?: string;
}

export default function BookingForm({
  price,
  averageRating,
  totalReviews,
  className,
}: BookingFormProps) {
  const t = useTranslations('listing');
  const router = useRouter();
  const listing = useListingDetail();
  const { bookedRanges } = useListingBookedDates(listing.slug);
  const { isAuthorized, accessToken } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BookingSchema = useMemo(
    () =>
      bookingFormObjectSchema
        .extend({
          startDate: z.date({ required_error: t('selectDate') }),
          endDate: z.date({ required_error: t('selectDate') }),
          selected: bookingGuestSelectionSchema.extend({
            adults: z.number().min(1, t('minAdultRequired')),
          }),
        })
        .refine(
          ({ startDate, endDate }) => startDate < endDate,
          {
            message: t('selectDate'),
            path: ['endDate'],
          },
        )
        .refine(
          ({ startDate, endDate }) =>
            isRangeAvailable(startDate, endDate, bookedRanges),
          {
            message: t('datesUnavailable'),
            path: ['endDate'],
          },
        ),
    [t, bookedRanges],
  );

  const {
    control,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormInput>({
    defaultValues: {
      selected: {
        adults: 1,
        child: 0,
        pets: false,
      },
    },
    resolver: zodResolver(BookingSchema),
  });

  const [minEndDate, setMinEndDate] = useState<Date | undefined>();
  const [focus, setFocus] = useState(false);

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const nights =
    startDate && endDate
      ? Math.max(1, differenceInCalendarDays(endDate, startDate))
      : 0;
  const subtotal = nights > 0 ? price * nights : 0;

  async function handleBooking(data: BookingFormInput) {
    setFormError(null);

    if (!isAuthorized || !accessToken) {
      router.push(Routes.auth.signIn);
      return;
    }

    setIsSubmitting(true);

    try {
      await createReservation(
        mapBookingDatesToCreateReservation({
          listingId: listing.id,
          checkIn: data.startDate,
          checkOut: data.endDate,
        }),
        accessToken,
      );
      router.push(Routes.private.trips);
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError(t('reservationError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) => handleBooking(data))}
      className={clsx(
        'rounded-xl border border-gray-lighter bg-white p-8 shadow-card',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3  ">
        <p className="text-xl font-bold text-gray-dark xl:text-[22px]">
          ${price} <span className="text-base">/ night</span>
        </p>
        <p className="inline-flex flex-shrink-0 items-center gap-2">
          <Staricon className="xl:w-h-5 h-4 w-4 xl:h-5" />
          <span className="text-base font-bold text-gray-dark">
            {averageRating}
          </span>
          <span className="flex-shrink-0 text-sm font-normal text-gray-dark xl:text-base">
            ({' '}
            <a href="#reviews" rel="noopener noreferer" className="underline">
              {totalReviews} reviews
            </a>{' '}
            )
          </span>
        </p>
      </div>
      {formError && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {formError}
        </p>
      )}
      <div
        className={clsx(
          'relative mt-6 grid grid-cols-2 gap-3 rounded-t-lg border border-b-0 border-gray-lighter',
          focus && '!border-b !border-gray-dark ring-[1px] ring-gray-900/20',
        )}
        onBlur={() => setFocus(false)}
      >
        <span
          className={clsx(
            'absolute inset-y-0 left-1/2 translate-x-1/2 border-r border-gray-lighter',
            focus && '!border-gray-dark',
          )}
        ></span>
        <span className="absolute left-4 top-3 inline-block -translate-x-3 scale-75 text-sm font-semibold uppercase text-gray-dark">
          {t('tripStart')}
        </span>
        <span className="absolute right-4 top-3 inline-block translate-x-2 scale-75 text-sm font-semibold uppercase text-gray-dark">
          {t('tripEnd')}
        </span>
        <Controller
          name="startDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateTime
              onFocus={(e) => {
                e.target.blur();
                setFocus(true);
              }}
              onClickOutside={() => setFocus(false)}
              placeholderText={t('addDate')}
              minDate={new Date()}
              filterDate={(date) => filterAvailableDate(date, bookedRanges)}
              selected={value}
              onChange={(date: Date) => {
                setMinEndDate(date);
                onChange(date);
              }}
              selectsStart
              startDate={getValues('startDate')}
              endDate={getValues('endDate')}
              dateFormat="eee dd / LL / yy"
              popperClassName="!translate-x-0 !right-0 !top-full booking-form-calendar"
              inputClassName="border-0 !text-base text-gray-dark !h-16 pt-5"
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateTime
              onFocus={(e) => {
                e.target.blur();
                setFocus(true);
              }}
              onClickOutside={() => setFocus(false)}
              placeholderText={t('addDate')}
              selected={value}
              onChange={onChange}
              selectsEnd
              minDate={minEndDate ?? new Date()}
              filterDate={(date) => filterAvailableDate(date, bookedRanges)}
              endDate={getValues('endDate')}
              startDate={getValues('startDate')}
              dateFormat="eee dd / LL / yy"
              popperClassName="!translate-x-0 !right-0 !top-full booking-form-calendar booking-form-calendar-two"
              inputClassName="border-0 !text-base text-gray-dark text-end !h-16 pt-5"
            />
          )}
        />
      </div>
      <Controller
        name="selected"
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectBox defaultSelected={value} onChange={onChange} />
        )}
      />
      <p className="flex items-center justify-between text-xs text-red">
        <span>{errors.startDate?.message}</span>
        <span>{errors.endDate?.message}</span>
        <span>{errors.selected?.adults?.message}</span>
      </p>
      <Button
        size="xl"
        rounded="lg"
        type="submit"
        variant="solid"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="mt-4 w-full !py-[14px] text-base !font-bold uppercase tracking-widest"
      >
        {t('reserve')}
      </Button>
      {nights > 0 && (
        <ul className="mt-3 xl:mt-5">
          <li className="flex items-center justify-between py-1.5 text-base text-gray-dark">
            <span className="font-normal">
              ${price} × {nights} {t('nights')}
            </span>
            <span className="font-bold">${subtotal}</span>
          </li>
          <li className="flex items-center justify-between border-t border-gray-lighter py-1.5 text-base text-gray-dark">
            <span className="font-normal">{t('total')}</span>
            <span className="font-bold">${subtotal}</span>
          </li>
        </ul>
      )}
    </form>
  );
}
