'use client';

import { useTranslations } from 'next-intl';
import HostReservationsTable from '@/components/reservation/host-reservations-table';

export default function ReservationsPage() {
  const t = useTranslations('account');

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <HostReservationsTable title={t('reservations')} />
    </div>
  );
}
