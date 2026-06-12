'use client';

import { useTranslations } from 'next-intl';
import HostReservationsTable from '@/components/reservation/host-reservations-table';
import Text from '@/components/ui/typography/text';

export default function TransactionActivity() {
  const t = useTranslations('account');

  return (
    <div>
      <Text tag="h4" className="mb-6 text-xl md:!text-2xl">
        {t('transactionActivity')}
      </Text>
      <HostReservationsTable showSearch={false} />
    </div>
  );
}
