'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { tripsData } from 'public/data/trips';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function TripsPage() {
  const t = useTranslations('trips');

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="pt-8 lg:pt-12">
        <Text tag="h1" className="mb-2 text-2xl md:!text-3xl xl:!text-4xl">
          {t('title')}
        </Text>
        <Text className="mb-8 text-gray">
          {t('subtitle')}
        </Text>
      </div>
      <div className="space-y-6">
        {tripsData.map((trip) => (
          <div
            key={trip.id}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-lighter bg-white shadow-card transition-shadow hover:shadow-card-hover md:flex-row"
          >
            <Link
              href={Routes.public.listingDetails(trip.slug)}
              className="relative block aspect-[16/10] w-full shrink-0 md:w-72"
            >
              <Image
                src={trip.boatImage}
                alt={trip.boatTitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 288px"
              />
            </Link>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <Link href={Routes.public.listingDetails(trip.slug)}>
                  <Text tag="h3" className="mb-2 font-bold hover:text-primary">
                    {trip.boatTitle}
                  </Text>
                </Link>
                <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {trip.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    {trip.duration}
                  </span>
                </div>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    trip.status === 'Upcoming'
                      ? 'bg-green/20 text-green-dark'
                      : 'bg-gray-200 text-gray-dark'
                  }`}
                >
                  {trip.status === 'Upcoming' ? t('upcoming') : t('past')}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-dark">
                  {trip.price}
                </span>
                <Link href={Routes.public.listingDetails(trip.slug)}>
                  <Button size="sm" variant="outline" className="mt-0">
                    {t('viewDetails')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {tripsData.length === 0 && (
        <div className="rounded-xl border border-gray-lighter bg-gray-50 py-16 text-center">
          <Text className="mb-4 text-gray">{t('noTripsYet')}</Text>
          <Link href={Routes.public.explore}>
            <Button>{t('exploreBoats')}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
